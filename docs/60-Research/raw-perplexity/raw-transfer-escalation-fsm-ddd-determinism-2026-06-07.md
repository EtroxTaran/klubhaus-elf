---
title: "RAW — Deterministic staged-escalation FSM patterns (accumulator/leaky-bucket/hysteresis) (FMX-102)"
status: raw
tags: [research, raw, perplexity, escalation, fsm, ddd, determinism, hysteresis, leaky-bucket, fmx-102]
created: 2026-06-07
updated: 2026-06-07
type: research
related:
  - [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
---

> Unprocessed Perplexity transcript. Synthesised into
> [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]].
> Do not implement from raw. Captured 2026-06-07 for FMX-102 (gap G25, escalation half).

## Prompt

**System:** You are a senior software architect specializing in domain-driven design, finite state
machines, event sourcing, and deterministic simulation. Give precise, implementable patterns with
rationale. Cite established patterns/sources.

**User:** I am designing a DETERMINISTIC, replay-safe multi-stage 'escalation' finite state machine
for a transfer/inactivity-pressure subsystem in a football-manager game. Architecture: event-sourced,
DDD bounded contexts, transactional outbox, integer sim-clock (no wall-clock), no RNG in this
subsystem (must replay byte-identically from committed domain facts). Requirements: explicit stages
with quantified entry thresholds; a decay/cool-off model so escalation reverses when pressure stops;
golden-trace testable. Please give best-practice patterns and trade-offs for: (a) modeling staged
escalation as a continuous PRESSURE-ACCUMULATOR vs DISCRETE COUNTERS/event-count gates vs a hybrid;
(b) decay / cool-off models — linear decay, exponential decay, leaky-bucket / token-bucket, per-stage
'stickiness'; (c) preventing oscillation/flapping using HYSTERESIS / Schmitt-trigger dual thresholds
(theta_up vs theta_down); (d) keeping the whole thing deterministic and replay-safe with only an
integer clock and committed events; (e) encoding an invariant like 'the terminal/strike stage can
never be entered from a single triggering event' as a structural stage-gating rule. Explain how
leaky-bucket and hysteresis specifically map onto this escalation problem.

## Response

You want an escalation mechanism that is deterministic under event-sourcing and integer time;
golden-trace/byte-perfect replayable; multi-stage with decay and non-flappy hysteresis; and
structurally constrained (e.g. "strike" stage not reachable in one jump).

### (a) Staged escalation: scalar accumulator vs discrete counters vs hybrid

**Recommended: scalar pressure-accumulator with stage thresholds + hysteresis.** Model a single
scalar `pressure` (Int/fixed-point) and derive `stage` from it via thresholds; stage is a pure
function of `(pressure, stage)`. Deterministic & replay-safe (`pressure_next =
f(pressure_prev, events_since_prev, dt)`), smooth decay (decrement the scalar), expressive thresholds,
golden-trace testable (assert exact numeric pressure + stage at each event boundary).

**Discrete counters** (recent transfer requests, consecutive inactivity intervals) make decay harder
(rolling windows / more history), are less smooth, and have coarse hysteresis.

**Hybrid (best):** local counters per event type → weighted scalar pressure; apply thresholds and
hysteresis on the scalar.

```text
pressure_increment_for(event):
  case TransferRequested: return +15
  case TransferRejected:  return +30
  case InactiveTick:      return +5
pressure_next = max(0, pressure_prev - decay(dt)) + Σ increments
```

### (b) Decay / cool-off models

Decay must be time-based (integer sim-clock), event-driven (applied only at event boundaries), pure
arithmetic. Let `dt = t_now - t_lastUpdate`.

1. **Linear decay** (discrete leaky-bucket): `decayed = max(0, pressure_prev - decay_rate * dt)`.
   Simple, deterministic, easy hysteresis reasoning. *Recommended unless exponential semantics are
   truly needed.*
2. **Exponential decay**: `decayed = floor(pressure_prev * α^dt)` with fixed-point α; more natural but
   more numeric complexity.
3. **Leaky-bucket / token-bucket framing**: bucket level = pressure, leak rate = decay_rate, events
   add "water," optional capacity cap. This is the "leaky bucket as a meter" variant.
4. **Per-stage stickiness**: make `decay_rate` depend on stage (NONE 5 → WARNING 3 → NOTICE 2 →
   FINAL 1 → STRIKE 0/1) so later stages decay slower. Safer than dynamic thresholds — thresholds stay
   fixed, only decay rate varies.

### (c) Preventing oscillation with hysteresis (Schmitt trigger)

Two thresholds per boundary, `θ_down[k] < θ_up[k]`:

```text
NONE -> WARNING: θ_up1=60 ; WARNING -> NONE: θ_down1=40
WARNING -> STRIKE: θ_up2=170 ; STRIKE -> WARNING: θ_down2=130
```

The current stage is the "memory" that biases the next decision — a cascade of hysteresis loops.
Avoids flapping when pressure hovers near a boundary.

### (d) Deterministic, replay-safe with integer clock + events

Keep in the aggregate: `pressure: Int`, `stage: EscalationStage`, `last_update_time: Int` (sim-clock
tick of the last internal update). On every domain event:

```pseudo
function applyEvent(aggregate, event):
  t_now = event.sim_time ; dt = t_now - aggregate.last_update_time ; assert dt >= 0
  decayed = max(0, aggregate.pressure - decay_rate(aggregate.stage) * dt)   // 1. decay
  new_pressure = decayed + pressure_increment_for(event)                     // 2. event increment
  if capacity_defined: new_pressure = min(new_pressure, capacity)
  new_stage = next_stage(aggregate.stage, new_pressure)                      // 3. hysteresis
  aggregate.pressure = new_pressure ; aggregate.stage = new_stage ; aggregate.last_update_time = t_now
```

Determinism: integer/fixed-point arithmetic; no background scheduler — decay only on event apply
using `dt` between events (discrete leaky bucket); same event sequence + sim_time → identical
trajectory. Persist only **primitive** boundary events (`TransferRequested`, `TickAdvanced`); compute
escalation in the aggregate; publish `EscalationStageChanged` via **outbox** as a derived
projection (tests assert it matches the deterministic transition logic). Temporal progression is
itself event-sourced (a Time/Simulation context publishes `SimulationTick`, or each event carries a
`sim_time`).

### (e) "Terminal stage cannot be reached by a single event"

Three encodings (combine for safety):
1. **Pure threshold design:** bound max single-event increment (e.g. 50) and place the strike
   threshold beyond reach from below FINAL; assert `∀eventType, ∀p<θ_down_STRIKE: p+inc < θ_up_STRIKE`.
2. **Transition gating:** allow at most **one stage increment per event** — even a 0→1000 spike climbs
   one step. Invariant is a property of the transition function, not numeric tuning.
3. **Accumulation-rule gating:** require `pressure_since_stage_entry ≥ MIN_REQUIRED` (or N events)
   before `FINAL → STRIKE`. Directly encodes "one event is not enough."

### Leaky-bucket & hysteresis mapping

| Leaky-bucket | Escalation domain |
|---|---|
| Bucket content/level | `pressure` |
| Leak/drain rate | decay function (per stage) |
| Capacity | max pressure / strike cap |
| Incoming packet | domain event adding pressure |
| Overflow/non-conformance | high escalation stage (STRIKE) |

Hysteresis: driving signal = `pressure`; response = `stage`; memory = current stage selects active
thresholds. The whole ladder is a cascade of hysteresis loops → stable, non-flapping stages.

### Concrete template

```text
EscalationState { pressure: Int; stage: EscalationStage; last_update_time: Int; pressure_since_stage_entry: Int }
Params: decay_rate_for_stage; theta_up; theta_down; max_pressure; pressure_increment_for(event_type)
evolve(state, event): decay → add increment (cap) → next_stage_with_hysteresis_and_gates →
  reset pressure_since_stage_entry on stage change else accumulate.
```

All pure and deterministic given event sequence + sim-times + static config + integer arithmetic.

Citations:
[1] https://en.wikipedia.org/wiki/Leaky_bucket
[2] https://itnext.io/rate-limiting-with-leaky-bucket-algorithm-using-go-generics-7a5086c02695
[3] https://docs.iproov.com/implementation_A-Z/rest_api/rate_limiting/leaky-bucket
[4] https://github.com/Inspiaaa/UnityHFSM
[5] https://ptolemy.berkeley.edu/books/Systems/models/doc/books/systems/fsm/index.html
[6] https://journals.aps.org/pre/accepted/10.1103/mzvj-n6vn
[7] https://publications.syscop.de/vanRoy2023.pdf
