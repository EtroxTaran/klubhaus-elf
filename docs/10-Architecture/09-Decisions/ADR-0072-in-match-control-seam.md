---
title: ADR-0072 In-Match Control Seam & Intervention Determinism
status: accepted
tags: [adr, architecture, match, ui, controls, determinism, replay, canvas, performance, fmx-100]
created: 2026-06-03
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0024-match-renderer-abstraction]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0041-presentation-renderer-strategy]]
  - [[ADR-0047-babylon-3d-presentation-engine]]
  - [[ADR-0008-mobile-first-ui]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/GD-0025-in-match-controls]]
  - [[../../50-Game-Design/match-engine]]
  - [[../../60-Research/in-match-controls-and-presentation-2026-06-03]]
  - [[../../60-Research/performance-budgets]]
  - [[../../60-Research/determinism-and-replay]]
---

# ADR-0072: In-Match Control Seam & Intervention Determinism

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Decisions D1–D4 were put to Nico live on
> 2026-06-03 (ask-first gate) and chosen as A/A/A/A below; authored `proposed` per
> the never-self-accept rule — Nico ratifies (merge). This ADR specifies the
> engine↔renderer **control seam** (how UI interventions reach the deterministic
> engine) and the perf-validation protocol; it **does not re-open** the Canvas-2D
> match renderer (ADR-0024) or the two-renderer strategy (ADR-0041), which stay
> binding. Gameplay surface (kit, halftime, shouts) is in
> [[../../50-Game-Design/GD-0025-in-match-controls]].

## Date

- Proposed: 2026-06-03

## Context

The match-presentation *technology* is settled: ADR-0024 (renderer-agnostic
`MatchRenderer` over ephemeral `MatchFrame` projections, Canvas-2D first, GSAP
tweening state values), ADR-0026 (engine emits a typed event log; `MatchFrame` is a
derived, never-persisted projection), ADR-0041/0047 (Canvas-2D is the only MVP match
renderer). The match is deterministic: RNG seeded at `lineup_locked`; replay = seed
+ ordered intervention events ([[../state-machines/match]] §5;
[[../../60-Research/determinism-and-replay]]). ADR-0008 settled the client-state +
**hybrid worker bridge** (Comlink control-plane RPC + hand-rolled `postMessage`
event stream) and put OffscreenCanvas on the main thread at MVP.

The **gap** FMX-100 closes is the *control* seam, not the *draw* seam: how player
interventions (subs, tactical/mentality changes, shouts, pause, speed) enter the
deterministic engine without breaking replay-safety, and whether the renderer runs
on the main thread or a worker. [[../state-machines/match]] §4 only says
`simulating` accepts "Tactical changes, substitutions, shouts (per UI tier)" and
halftime "3 controls minimum" — the timing/binding contract is undefined.
[[../../50-Game-Design/match-engine]] §4 already says interventions are queued and
applied at deterministic points (dead-ball / halftime / phase transition).

Single-player only here. The intervention **buffer state machine** and the
watch-party **pause-vote** policy are gap **G24 / FMX-101**, which builds on this
seam. Grounded in
[[../../60-Research/in-match-controls-and-presentation-2026-06-03]] (+ four raw
captures): RTS-lockstep command queuing, sports-sim semantic boundaries, 2026
Canvas-2D/OffscreenCanvas reality, WCAG 2.2 AA.

## Decision options

### D1 — Intervention acceptance model

| Option | Description | Trade-off |
|---|---|---|
| **A. Hybrid + immutable snapshot** | Light commands (shout, mentality nudge) bind to the **next tick**; heavy commands (sub, formation, full tactic) bind to the **next semantic boundary** (dead-ball/stoppage). Tactics = immutable `TacticSnapshot` swapped atomically at the boundary. | **Recommended / chosen.** Sport-authentic, responsive where it matters, clean atomic audit; matches match-engine.md §4. |
| B. Semantic-boundary only | All interventions wait for the next stoppage. | Simplest/most deterministic, but laggy shouts/mentality in long open play. |
| C. Per-tick (all next tick) | Everything applies next tick (pure lockstep). | Most responsive, but mid-counterattack subs/tactics feel telepathic + less authentic. |

### D2 — Player-initiated pause

| Option | Description | Trade-off |
|---|---|---|
| **A. Operational, free** | Pause is a wall-clock UI/FSM flag **outside** the seeded event stream; player pauses anytime. | **Recommended / chosen.** Matches match.md §3 reconnect-pause + WCAG 2.2.1 real-time exception; replays stay canonical. |
| B. Replayable command | Pause recorded as a stream event. | Pollutes the log; forces replays to mirror watching. |
| C. No free pause | Pause only at auto-stops. | Worse a11y + one-handed UX. |

### D3 — Match render thread (MVP)

| Option | Description | Trade-off |
|---|---|---|
| **A. Main-thread Canvas2D** | Render on main thread; sim stays in its dedicated worker; `MatchRenderer` interface kept clean for a future OffscreenCanvas worker. | **Recommended / chosen.** Matches ADR-0008 D3; iOS/Safari OffscreenCanvas-in-worker still unreliable in 2026. |
| B. OffscreenCanvas worker now | Move rendering to a worker immediately. | Frees main thread but adds a 2nd heavy worker + messaging overhead + mandatory Safari fallback — premature for MVP. |

### D4 — MVP control kit breadth

| Option | Description | Trade-off |
|---|---|---|
| **A. Full kit (+ shouts)** | Subs + mentality preset + formation-swap + **3 shouts** + 3 speeds + pause. | **Chosen by Nico.** Most expressive; requires a shout-effect contract (provisional magnitudes, GD-0025). |
| B. Core + formation, defer shouts | As above without shouts. | Leaner; defers shout balancing. |
| C. Core only | Subs + mentality + speed/pause. | Minimum first-playable. |

## Decision (chosen — Nico 2026-06-03)

**D1 = A, D2 = A, D3 = A, D4 = A.**

### Intervention command contract

Interventions are typed commands carried over the ADR-0008 **Comlink control-plane
RPC** (not the high-frequency event stream); the engine binds each to an execution
point computed **purely from sim state**:

```ts
InterventionCommand = {
  commandId: CommandId,            // monotonic per match; deterministic ordering key
  matchId: MatchId,
  side: 'home' | 'away',
  type: 'substitution' | 'formationSwap' | 'tacticChange' | 'mentalityPreset' | 'shout',
  payload: SubstitutionPayload | FormationSwapPayload | TacticSnapshotRef | MentalityPreset | ShoutType,
  binding: ExecutionBinding,       // weight-derived, see below
  issuedAtTick: Tick               // sim tick sampled at UI time (provenance, not execution)
}

ExecutionBinding =
  | { kind: 'immediateNextTick' }              // light: shout, mentalityPreset
  | { kind: 'nextSemanticBoundary', boundary: 'deadBall' | 'restart' | 'halftime' }  // heavy: sub, formationSwap, tacticChange

// Tactics never mutate live; a change publishes a new immutable snapshot ref,
// swapped atomically at the bound boundary (consistent with ADR-0055 TacticSnapshot
// + ADR-0067 set-piece fields).
TacticSnapshotRef = { tacticSnapshotId: TacticSnapshotId, version: int }
```

Binding rules: shouts + mentality presets → `immediateNextTick`; substitutions,
formation swaps and full tactic changes → `nextSemanticBoundary`. At each tick the
engine (a) detects semantic transitions and binds matching pending commands to
`current_tick`, (b) executes tick-bound commands ordered by `commandId` (tactics =
snapshot swap at tick start), (c) simulates from the active snapshot. **Pause** and
**speed** are NOT commands: pause is an operational FSM flag; speed is a
ticks-per-wall-second multiplier with the fixed sim Δt unchanged.

### Late / illegal command policy

Default = **queue to the next valid boundary** with UI states pending → scheduled →
applied. Impossible commands (e.g. sub a sent-off player, exceed sub cap) → a
**deterministic reject** (same state + same request tick → same decision); rejects
are logged separately and never touch sim state. The buffer *state machine* and
watch-party vote are FMX-101 (G24).

### Render thread + worker bridge

Canvas-2D `MatchRenderer` runs on the **main thread**; the deterministic engine
stays in its dedicated worker (ADR-0008, seeded RNG only, no `Math.random`/
`Date.now`/`setTimeout`). Control-plane intervention commands use Comlink RPC; the
high-frequency match-event stream uses the hand-rolled `postMessage` channel
(batched ~1 per virtual minute, ≤60 events/batch — match.md §9). The `MatchRenderer`
interface is kept free of main-thread assumptions so an OffscreenCanvas render worker
can land in a profiled v2 (Chrome/Android first, feature-detected, Safari fallback).

### Canvas-2D performance validation protocol (measurement deferred)

Pass-criteria against [[../../60-Research/performance-budgets]]: device matrix
(≥1 Floor, ≥1 Standard, ≥1 Premium) × scenarios (idle / normal / peak / UI-stress),
10–15 min each; instrument p95 frame time, frame-budget breaches, long tasks
(`PerformanceObserver`), INP. **Pass:** Premium 60fps p95 ≤14 ms (no sustained
CPU>70%/throttle); Standard 60fps else default 30fps (p95 ≤28 ms); **Floor forced to
text&stats**; battery-saver → 30fps + lower DPR; `prefers-reduced-motion` → discrete
updates + fades. Degradation is **capability-based** (Canvas2D + worker probe +
micro-benchmark), not UA sniffing.

> **Deferred measurement (honest limitation).** This is the no-code phase — there is
> no renderer to measure. ADR-0072 ratifies the protocol + thresholds; the actual
> on-device fps/main-thread measurement is a **follow-up tied to the first Canvas-2D
> match prototype** and is tracked, not silently marked done.

## Invariants

| # | Invariant |
|---|---|
| **C1** | Every intervention's execution point is a pure function of sim state (tick/boundary); no wall-clock enters the seeded stream. |
| **C2** | Tactics are immutable snapshots swapped atomically at a boundary; never mutated mid-tick. |
| **C3** | Tick-bound commands at the same tick execute in `commandId` order (deterministic). |
| **C4** | Pause is operational and absent from the event stream; replays reproduce the result without it. |
| **C5** | Speed changes ticks-per-wall-second only; the fixed sim Δt and the event/command sequence are unchanged at any speed. |
| **C6** | Rejections are deterministic and never mutate sim state. |
| **C7** | The renderer consumes `MatchFrame` projections only (ADR-0026); it never sends commands into, or reads raw events from, the seeded stream out of band. |
| **C8** | Single-player scope only; the buffer FSM + watch-party pause-vote are owned by FMX-101 (G24). |
| **C9** | No re-opening of ADR-0024/0041: Canvas-2D stays the only MVP match renderer. |

## Amendments to existing ADRs (control-seam clarification only)

- [[ADR-0024-match-renderer-abstraction]] — add a "Control seam" note pointing to
  this ADR; renderer abstraction + Canvas-2D-first unchanged.
- [[ADR-0041-presentation-renderer-strategy]] — add a note that the control seam is
  specified here; two-renderer / Canvas-2D-only decision unchanged.

## Consequences

**Positive:** a replay-safe, auditable single-player control seam; responsive light
commands + sport-authentic heavy commands; render path matches the proven ADR-0008
posture; a concrete perf gate ready for the first prototype.

**Negative / constraints:** on-device perf numbers are owed by a follow-up (no code
yet); the intervention buffer FSM + watch-party coordination are deferred to
FMX-101; shout-effect magnitudes are calibration debt (FMX-52 via GD-0025).

## HITL gate

`proposed` / `binding: false`. D1–D4 chosen live by Nico 2026-06-03 (A/A/A/A).
Residual D-questions (halftime action set, speed-step count, shout cooldown/effect
magnitudes, max queued subs) sit in GD-0025 for ratification. Ratified 2026-06-08 (#153)
+ merge; ADR-0024/0041 amendment notes apply in the same PR.
