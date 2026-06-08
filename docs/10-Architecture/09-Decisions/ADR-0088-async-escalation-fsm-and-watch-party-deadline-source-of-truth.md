---
title: ADR-0088 Async Escalation FSM + Watch-Party Deadline Source-of-Truth
status: accepted
tags: [adr, architecture, ddd, transfer, escalation, league-week, watch-party, deadlines, source-of-truth, event-carried-state-transfer, determinism, hysteresis, leaky-bucket, fmx-102]
created: 2026-06-07
updated: 2026-06-08
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0012-async-cadence-models]]
  - [[ADR-0014-state-machines]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0030-llm-out-of-authoritative-state]]
  - [[ADR-0068-fixture-scheduling-contract]]
  - [[ADR-0073-player-contract-lifecycle-fsm]]
  - [[../bounded-context-map]]
  - [[../state-machines/transfer]]
  - [[../state-machines/league-week]]
  - [[../state-machines/watch-party]]
  - [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../../50-Game-Design/async-multiplayer-private-group]]
  - [[../../50-Game-Design/watch-party-and-conference]]
  - [[../../60-Research/fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-transfer-escalation-realworld-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-transfer-escalation-games-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-transfer-escalation-fsm-ddd-determinism-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-derived-deadline-source-of-truth-ddd-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-async-multiplayer-deadline-scheduling-games-2026-06-07]]
  - [[../../60-Research/determinism-and-replay]]
---

# ADR-0088: Async Escalation FSM + Watch-Party Deadline Source-of-Truth

## Status

proposed

> **`proposed` / `binding: false`.** Authored after Nico chose the FMX-102 decisions live
> (2026-06-07, **D1–D7 = A/A/A/B/A/A/A**). Closes domain-audit gap **G25** and the **E8-2** child of
> epic FMX-64 — the **last open backlog item** (sibling FMX-101/ADR-0087 merged, PR #148), so on
> ratify E8/FMX-64 closes. Two independent halves: (A) a staged Transfer-owned **escalation FSM**
> replacing the single `escalated` lump; (B) a League-Orchestration **deadline source-of-truth** rule
> naming watch-party `broadcast_at` as the authoritative anchor. It proposes **draft amendments** to
> `state-machines/transfer.md`, `state-machines/league-week.md`, `state-machines/watch-party.md`,
> `watch-party-and-conference.md` and a reconciling note on **ADR-0012** (all authored in the same PR,
> clearly marked draft; flip to current on ratify). **No bounded-context-map change** — a contract
> among the already-ratified Transfer / League Orchestration / Watch Party contexts.

## Date

- Proposed: 2026-06-07 (FMX-102)

## Context

Transfer, League Orchestration and Watch Party are ratified contexts that communicate only via
commands/queries/events (no cross-context joins, bounded-context-map §3). FMX-102 resolves two
contradictions flagged as gap **G25**:

1. **Escalation is under-quantified.** `transfer.md §4` collapses the researched 5-stage escalation
   (`async-multiplayer-research.md §4`) into a single `escalated` state with **no per-stage
   thresholds, no decay/cool-off**, and "strike is never an immediate consequence" stated only as
   prose. Designers cannot tune consequences; QA cannot write the ignore-pattern golden traces
   `transfer.md §10` already asks for; the no-instant-strike guarantee is unenforceable.
2. **Deadline source-of-truth conflict (additive-vs-mutative).** `league-week.md §3` opens a matchday
   on its own cadence timer and emits `MatchdayOpened` (§5); `watch-party.md §3` says backward-derived
   deadlines from `broadcast_at` are "written into the underlying match record so the league-week
   state machine respects them"; `watch-party-and-conference.md §4` says the matchday-open "**is
   bypassed** … the scheduling event **takes precedence**." Nothing names the authoritative source →
   two FSMs can compute different lock times for the same high-stakes fixture (derby/final) — a
   replay-unsafe race.

Binding constraints preserved:

- **ADR-0012** — both cadence modes emit the same `MatchdayOpened`; the command validator rejects
  mid-week / mid-cycle deadline mutation. (The issue cites ADR-0013 for the outbox; that ADR is
  **superseded by ADR-0028** — this ADR uses ADR-0028.)
- **ADR-0028** — domain events route via the transactional outbox; `event_id` UUIDv7; Zod-validated
  payloads; idempotent, replay-deterministic consumers.
- **ADR-0018 / determinism-and-replay** — locked-**9** RNG streams; `TransferRng` is **stream #7**
  (player acceptance/refusal, contract variance). No wall-clock in the seeded engine.
- **ADR-0030** — generated prose is presentation-only; escalation creates the *facts*, Narrative
  renders them.

Grounded in [[../../60-Research/fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
(five Perplexity passes: transfer-escalation real-world / games / FSM-DDD-determinism, plus
derived-deadline source-of-truth DDD / async-games scheduling).

## Decision options

### D1 — Escalation stage model

| Option | Description | Trade-off |
|---|---|---|
| **A. 5 explicit stages** | `expired_ignored → registered_interest → unrest_requested → media_strike_threat → public_unrest`, each emitting a self-contained event. | **Chosen (Nico).** 1:1 with the real-football ladder + `async-multiplayer-research §4`; maximally tunable; golden-trace friendly. |
| B. 3 consolidated stages | Concerned → Wants-to-leave → Crisis. | Simpler/fewer events, but loses the granularity QA + designers need and blurs the no-strike gate. |
| C. Pressure level only | Continuous pressure; stage a thin derived label. | Most flexible internally; weakest for player-facing messaging + per-stage consequences. |

### D2 — Stage-advancement mechanism

| Option | Description | Trade-off |
|---|---|---|
| **A. Hybrid pressure-accumulator** | Each fact adds a weighted increment to a single integer `pressure`; stage = pure function of pressure via thresholds; counters implicit via weights. | **Chosen.** Smooth, expressive, golden-trace assertable; the FSM-DDD capture's recommended construction. |
| B. Pure event counts | Discrete gates (N expired offers, M ignored complaints). | Intuitive but coarse; harder smooth decay; needs rolling-window history. |
| C. Pure time-in-state | Advance on dwell alone. | Ignores intensity; feels arbitrary. |

### D3 — Decay / cool-off model

| Option | Description | Trade-off |
|---|---|---|
| **A. Leaky-bucket + per-stage stickiness + hysteresis** | Linear drain per sim-clock tick applied on event boundaries; later stages decay slower; Schmitt-trigger dual thresholds `θ_up>θ_down`. | **Chosen.** Realistic stickiness (a crisis doesn't evaporate as fast as mild concern); no flapping near a boundary; deterministic. Answers "does decay differ by stage?" = **yes**. |
| B. Uniform linear decay | Same rate everywhere, single thresholds. | Simplest; unrealistic late-stage decay; can flap. |
| C. No decay until full reset | Pressure clears only on a resolving event. | Sticky/simple; no gradual cool-off — player stays angry forever absent a fix. |

### D4 — Determinism / RNG

| Option | Description | Trade-off |
|---|---|---|
| A. Pure deterministic, no new RNG | Escalation = pure function of facts + sim-clock; personality shifts thresholds, not dice. | The conservative default (matches FMX-100/93). |
| **B. Seeded variance via existing `TransferRng`** | Replay-safe **bounded** seeded variance for borderline increments/dwell, drawn from the **existing** `TransferRng` (stream #7); seed + draw indices persisted in provenance. | **Chosen (Nico).** More "alive" / less predictable while staying byte-replayable; **no new stream**. Mirrors the FMX-92 cost-variance call. Variance stays **inside** the structural gates (cannot bypass the no-strike rule). |

### D5 — Additive-vs-mutative deadline resolution

| Option | Description | Trade-off |
|---|---|---|
| **A. Adopt `broadcast_at` as the anchor** | One `MatchTiming{anchorType, anchorAt}` per fixture; for a scheduled party `anchorAt = broadcast_at`; all locks are a **pure derivation**; League Orchestration still **owns** the matchday lifecycle and emits `MatchdayOpened`. | **Chosen.** The research's clean "C-with-explicit-mode": single source of truth, no two-clock race. "A is just C without naming the mode," made explicit and safe. |
| B. Defer whole FSM to Watch Party | Hand the matchday lifecycle for that fixture to the watch-party FSM. | Conflates ownership — League should keep lifecycle, only derive timing. |
| C. Additive — keep both deadline sets | League- and party-computed locks coexist. | The bug itself: two conflicting lock times; every consumer needs precedence logic. Rejected. |

### D6 — ADR-0012 reconciliation

| Option | Description | Trade-off |
|---|---|---|
| **A. Resolve at schedule time, before the week opens** | `anchorType/anchorAt` set **before** `MatchdayOpened` and **immutable after**; any reschedule once the cycle is open is rejected at the domain boundary. | **Chosen.** Never a mid-cycle mutation → ADR-0012's no-mutation rule holds unchanged; no exception carved. |
| B. Season-boundary-class exception | Sanction a scheduled party as an explicit exception to the no-mutation rule. | Simpler to state; weakens the invariant and sets a precedent. |

### D7 — Watch-Party → League carrying contract

| Option | Description | Trade-off |
|---|---|---|
| **A. Reuse `WatchPartyScheduled`** | The existing event carries `broadcast_at` (+ derived locks) self-contained; League consumes it at schedule time to set the anchor (event-carried state transfer), via the ADR-0028 outbox. | **Chosen.** No new event, no join; minimal surface. Adds derived-lock fields to the payload. |
| B. New `DeadlineSourceDeclared` event | Purpose-built deadline hand-off event. | Cleaner separation; extra contract + hop for data `WatchPartyScheduled` already implies. |

## Decision (proposed)

**D1 = A, D2 = A, D3 = A, D4 = B, D5 = A, D6 = A, D7 = A** (Nico, live, 2026-06-07).

Transfer replaces the single `escalated` state with a **5-stage escalation FSM** driven by a
**hybrid pressure-accumulator** value object, with **leaky-bucket per-stage-sticky decay + hysteresis**,
and **bounded seeded variance from the existing `TransferRng` (stream #7)** — replay-safe via persisted
seed + draw indices, and confined within hard structural gates that make the strike-threat stage
unreachable from a single event. League Orchestration adopts watch-party **`broadcast_at` as the single
deadline anchor**, set at schedule time and immutable after `MatchdayOpened` (so ADR-0012's
no-mid-cycle-mutation rule is preserved without exception), carried via the existing **`WatchPartyScheduled`**
event (event-carried state transfer, no join). All magnitudes route to **FMX-52** behind
`escalationModelVersion` / the existing deadline-offset config.

## Public contract direction (A — escalation FSM)

Escalation is a **Transfer-owned value object** on the negotiation track keyed by
`(playerId, sellerClubId, bidderClubId)` (the same tuple `transfer.md §4` already scopes). Zod sketches
are **illustrative, not implementation**:

```ts
EscalationStage =
  'none' | 'expired_ignored' | 'registered_interest' | 'unrest_requested'
  | 'media_strike_threat' | 'public_unrest'           // S1..S5 above 'none'

EscalationPressure = {                                 // value object on the case/escalation track
  escalationModelVersion: int,                         // FMX-52 calibration version
  pressure: int,                                       // hybrid accumulator (integer)
  stage: EscalationStage,
  lastUpdatedTick: int,                                // integer sim-clock of last update
  pressureSinceStageEntry: int,                        // gates FINAL transitions (no-strike rule)
  rngDrawCursor: int,                                  // index into TransferRng draws (provenance)
}

// pure update on each relevant committed fact (TransferOfferExpired, StrongInterestIgnored, InactivityTick, …)
// decayed = max(0, pressure - decayRate(stage) * dt);  dt = tick - lastUpdatedTick   (leaky bucket)
// pressure' = decayed + increment(eventType, traits, TransferRng-bounded-jitter)     (D2 + D4=B)
// stage' = nextStage(stage, pressure')  with θ_up/θ_down hysteresis + at-most-one-step + FINAL gate
```

**Per-stage self-contained events** (each routed via the ADR-0028 outbox; consumers apply effects in
their own context — no cross-context join; ADR-0030 keeps prose presentation-only):

```ts
TransferEscalationStageChanged = {                     // canonical derived projection
  playerId, sellerClubId, bidderClubId, fromStage, toStage,
  pressure: int, atTick: int, escalationModelVersion: int,
}
// stage-entry consequence facts (owning context applies the effect):
TransferInterestRegistered   // S2 → Narrative/Audience read
PlayerTransferRequestSubmitted // S3 → Squad & Player / People apply unrest + request
TransferStandoffEscalated    // S4 (media leak / strike-threat SIGNAL; Narrative renders, never creates a strike)
SupporterUnrestTriggered     // S5 → Audience & Atmosphere
TransferEscalationDeescalated = { fromStage, toStage, cause: 'newContract'|'reconciled'|'sold'|'windowClosed'|'decay', atTick }
```

The existing `TransferNegotiationEscalated` (transfer.md §6) is retained for back-compat, now carrying
`stage`. `EscalationStageChanged` is a **derived** fact: state is reconstructed from primitive committed
facts + the deterministic transition logic; tests assert the projection matches.

## Public contract direction (B — deadline source-of-truth)

```ts
MatchTiming = {                                        // value object on the league-week / matchday
  anchorType: 'kickoff' | 'broadcast',                 // exactly one anchor is authoritative
  anchorAt: timestamptz,                               // kickoff_at (cadence) OR broadcast_at (party)
}
computeLockDeadlines(t: MatchTiming) -> {              // PURE; no wall-clock
  transferLockAt, lineupLockAt, tacticLockAt, setupLockAt   // e.g. anchorAt - {60,30,30,5} min (→ FMX-52)
}

// D7 — existing event, payload extended; League consumes at SCHEDULE TIME
WatchPartyScheduled = {
  watchPartyId, leagueId, matchId, broadcastAt: timestamptz,
  derivedLocks: { transferLockAt, lineupLockAt, tacticLockAt, setupLockAt },  // self-contained
}
// MatchdayOpened (league-week §5) now carries the resolved anchor + derived locks
MatchdayOpened = { leagueId, season, weekNumber, matchId, anchorType, anchorAt, locks: {...} }
```

League Orchestration, on `WatchPartyScheduled` (before the week opens), sets `anchorType='broadcast'`,
`anchorAt=broadcastAt`, recomputes the locks, and freezes them; once `MatchdayOpened` fires, the anchor
is immutable and any `WatchPartyRescheduled`/late edit for that fixture is rejected at the domain
boundary. The watch-party FSM remains authoritative for *whether/when* a party exists and for
`broadcast_at`; League owns the matchday lifecycle and lock enforcement.

## Determinism & RNG

- **No new `*Rng` stream.** Escalation draws **bounded** seeded variance from the **existing**
  `TransferRng` (ADR-0018 stream #7); **seed + draw indices (`rngDrawCursor`) are persisted in
  provenance** so the same `worldSeed` + same committed facts replay byte-identically (the FMX-92
  pattern). Decay, threshold-crossing and the structural gates are **pure** — RNG only nudges
  borderline increments/dwell **within** the bounds the gates allow; it can **never** move a stage
  by more than one step or reach `media_strike_threat` from a single event.
- Decay is applied **lazily on event boundaries** using `dt = tick − lastUpdatedTick` (integer
  sim-clock); there is no background scheduler and no wall-clock.
- **Deadlines never use wall-clock in the engine.** `broadcast_at` is an explicit event timestamp;
  `computeLockDeadlines` is pure arithmetic; the seeded match engine is untouched by scheduling.

## Invariants

Escalation (**ES**):

- **ES1** `stage` is a pure deterministic function of committed Transfer facts + integer sim-clock +
  the persisted `TransferRng` draw sequence; identical inputs → identical trajectory (replayable).
- **ES2** No new `*Rng`; escalation's only randomness is **bounded** draws from the existing
  `TransferRng` (stream #7) with seed + draw indices persisted (ADR-0018 locked-9 unchanged).
- **ES3** The transition function advances **at most one stage per event**; `media_strike_threat`
  (and beyond) is reachable only from the immediately preceding stage **and** only with
  `pressureSinceStageEntry ≥ MIN` — encoding **"no strike from one ignored offer"** structurally; RNG
  cannot bypass this gate.
- **ES4** In calm (no pressure-adding fact) `pressure` is monotone non-increasing; later stages decay
  no faster than earlier ones (per-stage stickiness).
- **ES5** Each stage entry/exit emits a self-contained domain event via the ADR-0028 outbox (no
  cross-context join); `TransferEscalationStageChanged` is a derived projection matching the
  deterministic logic; effects are applied by the owning context (Squad & Player/People, Audience,
  Narrative-renders-only per ADR-0030).

Deadline (**DL**):

- **DL1** Every lock deadline is a pure function of a single `(anchorType, anchorAt)`; stored
  deadlines are a projection, never an independent source.
- **DL2** For a fixture with a scheduled watch party, `anchorType='broadcast'`, `anchorAt=broadcast_at`;
  `MatchdayOpened` carries the broadcast-derived locks (single source of truth).
- **DL3** `anchorType`/`anchorAt` are set **before** `MatchdayOpened` and **immutable after**; any
  reschedule once the cycle is open is rejected at the domain boundary — ADR-0012's no-mid-cycle
  mutation preserved (precedence resolved at schedule time, not as an exception).
- **DL4** `broadcast_at` is carried Watch Party → League via `WatchPartyScheduled` (event-carried
  state transfer); no cross-context join; routed via the ADR-0028 outbox; wall-clock never enters the
  seeded engine.

## Consequences

**Positive.** Closes G25 and the last open backlog item (E8/FMX-64 ready to close on ratify).
Escalation becomes tunable, golden-trace testable, and structurally guarantees "no strike from one
offer"; the seeded `TransferRng` variance keeps it lifelike yet replayable. The deadline rule kills the
two-clock race with a single authoritative anchor and a clean event-carried hand-off; ADR-0012 is
honoured without an exception. No bounded-context-map change; no new RNG stream.

**Negative / constraints.** Adds a Transfer escalation value object + several stage events and a
`MatchTiming` value object + extended payloads on `WatchPartyScheduled`/`MatchdayOpened`; D4=B means
escalation provenance must persist the `TransferRng` draw cursor (a small storage + discipline cost,
already established by FMX-92). Exact weights/thresholds/decay rates/lock offsets are unresolved until
FMX-52 (the spec ships structure + provisional defaults). No on-device validation is possible in this
no-code phase.

## Out of scope / open ratification items

- All magnitudes (increment weights, stage thresholds, `θ_up/θ_down`, per-stage decay rates, dwell
  minimums, variance bounds, lock offsets) → **FMX-52** behind `escalationModelVersion`.
- Confirm the **5-stage labels** and the **per-stage consequence event set** at ratify.
- Whether `TransferStandoffEscalated` (S4) should additionally gate on competition-window state
  (a stand-off late in a closed window) — flagged for design follow-up.
- The five draft amendments (`transfer.md`, `league-week.md`, `watch-party.md`,
  `watch-party-and-conference.md`, ADR-0012 reconciliation note) are authored `draft` in this PR and
  flip to current only on ratify.

## Bounded-context-map impact

**None.** A contract among the already-ratified Transfer / League Orchestration / Watch Party contexts;
the 19 ratified contexts are unchanged.

## Supersedes

None. The issue's cited **ADR-0013** (outbox) is itself superseded by **ADR-0028**, which this ADR uses.

## Related docs

See frontmatter `related` — research synthesis + five raw captures, the four state machines, ADR-0012
/0028/0018/0068/0030, GD-0036 and the bounded-context map.
