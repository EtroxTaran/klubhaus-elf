---
title: Async escalation FSM + watch-party deadline source-of-truth (FMX-102)
status: current
tags: [research, transfer, escalation, league-week, watch-party, deadlines, determinism, fmx-102]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-102
related:
  - [[raw-perplexity/raw-transfer-escalation-realworld-2026-06-07]]
  - [[raw-perplexity/raw-transfer-escalation-games-2026-06-07]]
  - [[raw-perplexity/raw-transfer-escalation-fsm-ddd-determinism-2026-06-07]]
  - [[raw-perplexity/raw-derived-deadline-source-of-truth-ddd-2026-06-07]]
  - [[raw-perplexity/raw-async-multiplayer-deadline-scheduling-games-2026-06-07]]
  - [[async-multiplayer-research]]
  - [[../10-Architecture/state-machines/transfer]]
  - [[../10-Architecture/state-machines/league-week]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../50-Game-Design/async-multiplayer-private-group]]
  - [[../50-Game-Design/watch-party-and-conference]]
---

# FMX-102 — Async escalation FSM + watch-party deadline source-of-truth

Research synthesis for **FMX-102** (Epic E8 / FMX-64; gap **G25**), grounding proposed **ADR-0088**
and draft **GD-0036**. Closes the last open backlog child of E8 (sibling FMX-101 merged, PR #148).
Two independent halves share the async-coordination theme. Sources: five raw Perplexity captures
(real-world / games / DDD per half) linked above. **Propose only — Nico ratifies; all magnitudes →
FMX-52.**

## 1. Problem & scope

**Half A — escalation is under-quantified.** `transfer.md §4` collapses the researched 5-stage
escalation (`async-multiplayer-research.md §4`) into a single `escalated` lump: no per-stage
thresholds, no decay/cool-off, "strike is never an immediate consequence" only as prose. Designers
can't tune it; QA can't write the golden traces `transfer.md §10` already asks for; the no-instant-
strike guarantee is unenforceable.

**Half B — deadline source-of-truth conflict (additive-vs-mutative).** `league-week.md §3` opens a
matchday on its own cadence timer and emits `MatchdayOpened`; `watch-party.md §3` says backward-
derived deadlines from `broadcast_at` are "written into the match record so the league-week SM
respects them"; `watch-party-and-conference.md §4` says the matchday-open "**is bypassed** … the
scheduling event **takes precedence**." Nothing names the authoritative source → two FSMs can compute
different lock times for the same high-stakes fixture (derby/final) — a replay-unsafe race.

**Out of scope:** watch-party pause-vote / intervention buffer (FMX-101/E8-1); notification routing
(ADR-0043 — only trigger events here); numeric calibration runs (→ FMX-52); cup/competition fixture
scheduling schema (G1).

## 2. Key finding — escalation: real football is staged, slow, and reversible

(`raw-transfer-escalation-realworld`.) Five ordered stages — (1) bid rejected/ignored → (2) public
interest / "come-and-get-me" → (3) **formal written transfer request** → (4) public statements /
agent briefings / media leaks → (5) training-ground disputes / frozen-out / refusing-to-play / (rare)
strike threats. Three robust facts for the model:

1. **Every stage is reversible.** New/improved contract, manager reconciliation, public re-commit, or
   the window simply closing de-escalates. Gerrard (2005) and Rooney (2010) handed in requests and
   re-signed within days; Suárez (2013) and Coutinho (2017) re-committed and played on after refused
   exits; Mahrez/Van Dijk/Dembélé reconciled after brief stand-offs.
2. **The terminal stage needs sustained, repeated pressure.** A strike/refusal is **never** the
   consequence of a single rejected bid — the legal/financial/reputational cost is too high; it
   follows weeks of failed escalation. This is the literal justification for the "no strike from one
   offer" invariant.
3. **Pressure is back-loaded** toward the window deadline; escalation is gradual, not instant.

## 3. Key finding — escalation: every management game is a staged FSM with decay + traits

(`raw-transfer-escalation-games`.) FM, EA FC Career Mode, OOTP and Football Chairman all implement a
ladder (Content → Concerned → Unhappy → Wants-to-leave → Formal request → Committed) advanced by
**deterministic counters** (minutes-vs-status ratio over a window, broken-promise count, ignored-
complaint time, rejected-bid count × stature gap) with **decay** (direct repair + passive cool-off
once the cause is removed). The decisive lesson for a replay-safe design:

> **Replace RNG with trait-based thresholds.** FM's apparent randomness is mostly trait modulation —
> ambition lowers thresholds (escalates faster), loyalty/professionalism raise them. A deterministic
> FSM can reproduce the "feel" of variability by making personality shift *thresholds*, not by rolling
> dice. (Maps onto the EOS/persona substrate, GD-0027.)

## 4. Key finding — escalation: the deterministic FSM pattern

(`raw-transfer-escalation-fsm-ddd-determinism`.) The recommended construction, fully compatible with
ADR-0028 outbox + the ADR-0018/determinism-and-replay integer-clock stance:

- **Hybrid scalar pressure-accumulator.** A single integer `pressure`; each domain fact adds a
  weighted increment (`TransferOfferExpired` +w1, strong-interest-ignored +w2, inactivity-tick +w3…);
  `stage` is a pure function of `pressure`. Counters are implicit via event-type weights; the FSM
  operates on the scalar (smooth decay, expressive thresholds, golden-trace assertable).
- **Leaky-bucket decay, applied on event boundaries.** `decayed = max(0, pressure − decay_rate(stage)·dt)`
  where `dt` is the **integer sim-clock** delta since the last update. **Per-stage stickiness**: later
  stages (media-leak/strike) get a smaller `decay_rate` so they decay slower — answers the issue's
  "does decay differ by stage?" → **yes, by design**. Linear decay preferred over exponential for
  clean golden traces.
- **Hysteresis (Schmitt-trigger) dual thresholds** `θ_down[k] < θ_up[k]` per boundary → no flapping
  between adjacent stages when pressure hovers near a threshold.
- **"No strike from one event" encoded structurally** three ways (use all): bound max single-event
  increment below the strike gap; **at-most-one-stage-up per event** in the transition function; and a
  `pressure_since_stage_entry ≥ MIN` gate on `FINAL → STRIKE`.
- **Determinism:** integer/fixed-point only; no background scheduler (decay computed lazily on the
  next event using `dt`); persist **primitive** facts, emit `EscalationStageChanged` as a **derived
  projection via the outbox**; same event stream + sim-times → byte-identical trajectory.

> **Nico's choice (D4 = B, 2026-06-07):** escalation is **not** pure — it carries **bounded seeded
> variance from the existing `TransferRng` (stream #7)** for borderline tips/dwell, with **seed +
> draw indices persisted in provenance** for byte-identical replay (no new `*Rng`; the FMX-92
> pattern). The variance lives **inside** the structural gates and can never skip a rung or reach the
> strike stage from one event.

## 5. Key finding — deadline: the additive-vs-mutative question dissolves into "one anchor, derived deadlines"

(`raw-derived-deadline-source-of-truth-ddd` + `raw-async-multiplayer-deadline-scheduling-games`.)

The DDD architect's verdict: **B (additive / keep both sets) is the worst fit** — it breaks single-
source-of-truth and forces every consumer (UI, validators, settlement) to carry precedence logic. And
**"A (adopt/overwrite) is just C without naming the mode explicitly."** The clean construction:

> Deadlines are a **derived projection** of a single **authoritative anchor** chosen **per fixture at
> schedule time**. Introduce a `MatchTiming { anchor_type ∈ {KICKOFF, BROADCAST}, anchor_at }`. For a
> scheduled watch party, `anchor_type = BROADCAST` and `anchor_at = broadcast_at`; `computeDeadlines`
> is a pure function (`transfer_lock = broadcast_at − 60m`, `lineup_lock = − 30m`, `setup_lock = − 5m`).
> The source of truth is `(anchor_type, anchor_at)`, **not** the stored deadlines.

League Orchestration **keeps ownership of the matchday lifecycle** (it still emits `MatchdayOpened`
and enforces locks) but **derives** its deadlines from the anchor — so this is "adopt the watch-party
anchor," not "hand the FSM to Watch Party." Prior-art games confirm the override-at-schedule-time
shape: shipped async/turn-based systems store **one canonical processing timestamp** server-side,
display **one** deadline, and **lock the schedule in** so late edits can't create ambiguity.

**ADR-0012 reconciliation:** resolve precedence **at schedule time, before the week opens**. The
anchor + mode are set once and become **immutable after `MatchdayOpened`**; rescheduling is rejected
at the domain boundary once the cycle is open. This is *not* a mid-cycle mutation, so ADR-0012's
"no mid-week deadline mutation" rule holds without exception. The watch-party→league hand-off uses
**event-carried state transfer** — `WatchPartyScheduled` already exists and carries `broadcast_at`
self-contained; League consumes it at schedule time (no cross-context join), routed via the ADR-0028
outbox.

## 6. Ownership & contract matrix (proposed)

| Concern | Owner | Mechanism |
|---|---|---|
| Escalation stage FSM (pressure, stage, decay, hysteresis) | **Transfer** | Value object inside the negotiation/escalation aggregate; pure function of committed facts + sim-clock |
| Per-stage consequence facts (registered-interest, unrest, request, leak/threat, public-unrest) | **Transfer** emits; owning contexts apply effects | Self-contained per-stage domain events; Squad&Player/People, Audience, Board, Narrative consume (ADR-0030 prose stays presentation-only) |
| `MatchTiming` anchor + derived deadlines + `MatchdayOpened` | **League Orchestration** | Anchor set at schedule time, immutable after open; deadlines derived (pure) |
| `broadcast_at` source fact | **Watch Party** | `WatchPartyScheduled` (event-carried), consumed by League at schedule time |
| Numeric thresholds, weights, decay rates, dwell, lock offsets | **FMX-52** calibration | behind `escalationModelVersion` / existing deadline-offset config |

## 7. Invariants (proposed; numbered in ADR-0088)

- **ES1** Escalation `stage` is a pure deterministic function of committed Transfer facts + integer
  sim-clock; identical event stream → identical stage trajectory (replayable).
- **ES2** No new `*Rng` stream; escalation's only randomness is **bounded** draws from the existing
  `TransferRng` (stream #7) with seed + draw indices persisted (D4 = B; ADR-0018 locked-9 unchanged).
- **ES3** The transition function advances **at most one stage per event**; the terminal (strike-
  threat) stage is reachable only from the penultimate stage **and** only with
  `pressure_since_stage_entry ≥ MIN` — encoding "no strike from one ignored offer" structurally.
- **ES4** Decay is monotone non-increasing in calm (no event adds pressure ⇒ pressure cannot rise);
  later stages decay no faster than earlier ones (per-stage stickiness).
- **ES5** Each stage entry/exit emits a self-contained domain event (no cross-context join), routed
  via the ADR-0028 outbox; `EscalationStageChanged` is a derived projection that must match the
  deterministic transition logic.
- **DL1** Every lock deadline is a pure function of a single `(anchor_type, anchor_at)`; stored
  deadlines are a projection, never an independent source.
- **DL2** For a fixture with a scheduled watch party, `anchor_type = BROADCAST`, `anchor_at =
  broadcast_at`; `MatchdayOpened` carries the broadcast-derived locks (single source of truth).
- **DL3** `anchor_type`/`anchor_at` are set **before** `MatchdayOpened` and are **immutable after**;
  any reschedule once the cycle is open is rejected at the domain boundary (ADR-0012 no-mid-cycle
  mutation preserved — precedence resolved at schedule time, not as an exception to the rule).
- **DL4** `broadcast_at` is carried Watch Party → League via `WatchPartyScheduled` (event-carried
  state transfer); no cross-context join; wall-clock never enters the seeded engine.

## 8. Open / ratify-gated items (for Nico)

**Nico chose D1–D7 = A/A/A/B/A/A/A live (2026-06-07):**
- **D1–D4 (escalation):** 5 explicit stages · hybrid pressure-accumulator · leaky-bucket + per-stage
  stickiness + hysteresis · **D4 = B seeded variance via the existing `TransferRng`** (override of the
  pure-deterministic default; seed + draw indices persisted, variance inside the structural gates).
- **D5–D7 (deadline):** adopt `broadcast_at` as the anchor (research's "C-with-explicit-mode") ·
  ADR-0012 reconciliation at schedule time · reuse `WatchPartyScheduled`.
- All magnitudes (weights, thresholds, decay rates, dwell minimums, lock offsets) → **FMX-52**.
- bounded-context-map: **no change** — contract among already-ratified Transfer / League Orchestration
  / Watch Party.

## 9. Sources & honesty

Five Perplexity captures (§ links in frontmatter). The escalation-FSM and deadline-DDD captures are
high-confidence (well-aligned with established leaky-bucket/hysteresis/event-carried-state-transfer
patterns). The async-games capture explicitly flagged that its sources support the *general* pattern
but do not document every named title — game-specific claims there are informed domain knowledge, not
hard citations; the *pattern* conclusion (one canonical timestamp + schedule-time lock-in) is solid.
No on-device/runtime validation is possible in this no-code phase.
