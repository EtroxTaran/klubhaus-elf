---
title: ADR-0129 Match Context Definition
status: accepted
tags: [adr, architecture, ddd, bounded-context, sporting-core, match, simulation, events, fmx-132, accepted]
context: match
created: 2026-06-16
updated: 2026-06-19
type: adr
binding: true
linear: FMX-132
amends:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0026-match-frame-contract]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0072-in-match-control-seam]]
  - [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-game-precedents-2026-06-16]]
  - [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
  - [[../bounded-context-map]]
  - [[../state-machines/match]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
---

# ADR-0129: Match Context Definition

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-132 on 2026-06-16. Binding after Nico approved D1-D7 on 2026-06-19 in
[[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]].

## Date

2026-06-16

## Context

Match is one of the Original-11 Sporting Core contexts, but its canonical
definition is currently spread across the bounded-context map, match state
machine, match-engine GDDRs, Tactics ADRs, in-match control ADRs and live-pause
ADR/GDDR notes.

FMX-132 consolidates the boundary without changing the accepted feature
decisions beneath it.

## Proposed Decision

### 1. Scope

Match owns fixture-scoped runtime truth:

- match lifecycle and match state transitions;
- lineup-open, lineup-lock and match-start guardrails;
- locked input snapshots for lineups, tactic snapshots and eligible-player
  projections consumed at lock time;
- deterministic simulation and match engine invocation;
- in-match intervention buffer and pause semantics already accepted by
  ADR-0087/FMX-140;
- committed match event log;
- replay stream and match report handoff facts;
- match injury/card/substitution facts as on-pitch facts.

Match does not own:

- persistent tactics library, opposition templates, set-piece catalogs or role
  profiles (Tactics);
- durable player base data, contracts, injuries, suspensions, morale, fitness
  or development state (Squad & Player);
- training plans, load, readiness, injury-risk or development-signal
  calculation (Training);
- competition eligibility rules (Regulations & Compliance);
- weather/pitch truth before the match (Environment & Climate / Stadium
  Operations per existing ADRs);
- fan atmosphere, rivalry, narrative, notification, analytics projections or
  commercial settlement.

### 2. Aggregate Inventory

| Aggregate / consistency boundary | Responsibility |
|---|---|
| `Match` | Fixture-scoped lifecycle from scheduled/open/locked/simulating/halftime/completed/reported/postponed. |
| `MatchLineupLock` | Immutable participant, bench, tactic-snapshot and eligibility projection captured at `lineup_locked`. |
| `MatchEventLog` | Ordered committed event facts for simulation, report, replay and downstream projections. |
| `InterventionBuffer` | Legal queued in-match commands and pause/intervention audit trail per ADR-0072/0087. |
| `MatchReport` | Post-simulation result/report fact package emitted to consumers. |

These are draft names for the future code phase. They define boundaries, not
database tables.

### 3. Published Language

Current events already accepted/current elsewhere:

- `MatchScheduled`
- `MatchLineupOpened`
- `MatchLineupLocked`
- `MatchSimulating`
- `MatchHalftime`
- `MatchEvent`
- `MatchCompleted`
- `MatchReported`
- `MatchPostponed`
- `InterventionBuffered`
- `InterventionApplied`
- `InterventionRejected`
- `MatchPaused`
- `MatchResumed`
- `MatchInjuryOccurred`

Commands, draft public language:

- `OpenMatchLineup`
- `SubmitLineup`
- `LockMatchLineup`
- `StartMatchSimulation`
- `QueueInMatchIntervention`
- `ApplyInMatchIntervention`
- `RequestMatchPause`
- `ResumeMatch`
- `ReportMatch`
- `PostponeMatch`

Queries/read models, draft public language:

- `GetMatchState`
- `GetMatchLineupLock`
- `GetMatchEventLog`
- `GetReplayStream`
- `GetMatchReport`

### 4. Consumed Facts and ACLs

| Upstream | Match consumes | Handling |
|---|---|---|
| Squad & Player | eligible-player projection, availability snapshot, player attribute/profile snapshot, suspension/discipline availability | Downstream lock-time ACL; Match freezes only the fields needed for simulation. |
| Tactics | `TacticSnapshot` including set-piece/opposition-template slices | Consumes snapshot only; no live Tactics joins during replay/simulation. |
| Training | readiness/load/fatigue projections if accepted by D2/D3/D5 | Consumed as snapshot inputs; Training remains signal owner. |
| Regulations & Compliance | competition rules and selection-eligibility verdicts | Consumed as self-contained verdicts; Match does not calculate law/competition policy. |
| Environment & Climate / Stadium Operations | match-weather/pitch/venue facts where already defined | Consumed as snapshot inputs; owner contexts keep source truth. |

### 5. Invariants

- A match cannot simulate before `MatchLineupLocked`.
- Replay/determinism inputs are immutable after the accepted lock/boundary
  point.
- Match event log order is deterministic under ADR-0096's selected runtime
  profile.
- Match emits facts; durable downstream effects are applied by owner contexts.
- Match never queries another context during replay to reconstruct authoritative
  state.

## Options Considered

### D1 - context-definition shape

| Option | Meaning | Assessment |
|---|---|---|
| A. Dedicated Match ADR | Define Match boundary here and link feature ADRs. | **Recommended, accepted by Nico 2026-06-19.** Clear canonical source without duplicating accepted detail. |
| B. Umbrella Sporting Core ADR | Put Match/Training/Squad together. | Higher merge-conflict and omnibus risk. |
| C. Fragmented status quo | Leave Match scattered across map/state-machine/feature ADRs. | Keeps current ambiguity. |

### D4 - Match event set

| Option | Meaning | Assessment |
|---|---|---|
| A. Current event set from match.md + ADR-0018 + ADR-0087/FMX-140 | Treat pause/intervention events as current and lifecycle/player effects as external. | **Recommended, accepted by Nico 2026-06-19.** |
| B. Demote pause/intervention to draft | Reopens already accepted pause/intervention work. | Not recommended. |
| C. Add player/training lifecycle to Match | Makes Match own durable player effects. | Conflicts with ADR-0018. |

## Consequences

Positive:

- Match gets one canonical context-definition home.
- Future code can implement Match without importing Training/Squad/Tactics
  internals.
- Current pause/intervention events are no longer ambiguous.

Negative / constraints:

- Adds another front-door ADR entry.
- Requires downstream owner contexts to keep self-contained event payloads and
  projections; no cross-context joins.

## Related

- [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
- [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
- [[../state-machines/match]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0055-tactics-context]]
- [[ADR-0072-in-match-control-seam]]
- [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
- [[ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]
