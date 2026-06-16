---
title: Sporting Core Context-definition Maturity
status: current
tags: [research, synthesis, ddd, bounded-context, sporting-core, match, training, squad-player, fmx-132]
created: 2026-06-16
updated: 2026-06-16
type: research
binding: false
linear: FMX-132
related:
  - [[raw-perplexity/raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[raw-perplexity/raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[raw-perplexity/raw-sporting-core-contexts-game-precedents-2026-06-16]]
  - [[raw-perplexity/raw-sporting-core-contexts-source-checks-2026-06-16]]
  - [[../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
  - [[../10-Architecture/09-Decisions/ADR-0129-match-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0130-training-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0131-squad-and-player-context-definition]]
  - [[../10-Architecture/bounded-context-map]]
---

# Sporting Core Context-definition Maturity

## Intent

FMX-132 asks whether the Original-11 Sporting Core should keep Match, Training
and Squad & Player as thin rows plus fragmented per-feature ADRs, or promote
them into explicit context-definition ADRs with boundaries, aggregate inventory,
published events and ACL responsibilities.

This note preserves the Perplexity-first research, source checks and local
analysis. It is non-binding. The paired decision queue asks Nico to approve or
reject the proposed context-definition direction.

## Evidence Summary

DDD evidence supports explicit context-definition documents for stable,
long-lived boundaries:

- Fowler treats bounded context as the central strategic DDD pattern for
  splitting large models and recommends explicit interrelationships/context
  maps.
- Microsoft Learn separates strategic DDD (domain analysis and bounded
  contexts) from tactical DDD (aggregates/services) and recommends context maps
  plus relationship patterns such as Customer/Supplier, Published Language and
  ACL.
- Context Mapper's semantics are useful for FMX wording: upstream contexts
  publish language; downstream contexts protect themselves with ACLs where they
  do not conform.

Real-world football evidence supports three distinct operating languages:

- matchday participation and substitution rules are match-specific facts
  governed by the Laws of the Game and competition rules;
- referee/match-official authority owns match facts, disciplinary action and
  injury stoppage facts during the match;
- sports-science evidence treats training load, wellness, GPS measures and
  medically verified injury reports as different inputs to injury-risk analysis.

Comparable-game evidence supports player-facing module separation but is weaker
for software architecture. Football Manager's official hub visibly separates
tactics, player roles, team guides and tutorials. Earlier FMX research already
contains stronger Anstoss/tactics/match-engine precedent than this pass could
source-check live.

## Local Baseline

The current vault already says these contexts exist:

| Context | Current map row | Gap FMX-132 closes |
|---|---|---|
| Match | Line-up, tactic lock, simulation, results -> result, match events, replay stream. | No dedicated context-definition ADR that names aggregate inventory, event set and ACLs. |
| Training | Training plan, load, development signals -> outcomes, fatigue signals, growth deltas. | R2-03 still leaves the tactics/training seam open in GD-0005. |
| Squad & Player | Player base data, fitness, morale, contracts, injuries -> projections and player state. | Contract, discipline, injury and development ownership is spread across feature ADRs without one context-definition home. |

Accepted local decisions already constrain the answer:

- ADR-0019: contexts own data and publish contracts; no cross-context joins.
- ADR-0018: Training computes development/load/readiness signals; Squad &
  Player persists player state and injury/availability records; Match emits
  match injury facts.
- ADR-0055: Tactics owns persistent tactics library, opposition templates,
  `RoleProfileForPosition`, `TacticSnapshot` and tactical identity; Match only
  consumes locked snapshots.
- ADR-0072/0087/GD-0035: in-match interventions are buffered/deterministic and
  current pause semantics are already accepted.
- ADR-0078: Squad & Player owns discipline ledger, suspension windows, appeal
  cases and the canonical `PlayerSuspendedV1` schema.

## Options

| Option | Meaning | Assessment |
|---|---|---|
| A. Three dedicated context-definition ADRs | Draft one ADR each for Match, Training and Squad & Player. Keep existing feature ADRs and link, not duplicate, their detail. | **Recommended.** Best DDD fit, keeps context docs small and gives each context a canonical owner page. |
| B. One Sporting Core umbrella ADR | One large ADR defines all three contexts and the seams between them. | Lower document count, but high risk of a mixed omnibus ADR and future edit conflicts. |
| C. Keep fragmented rows/per-feature ADRs | Update the map and rely on existing ADRs. | Cheapest now, but leaves R2-03/open ownership ambiguity and makes future implementation teams reconstruct the boundary from scattered notes. |

Recommendation: **A**, with all three ADRs draft until Nico approves D1-D7 in
the decision queue.

## Proposed Context Shape

### Match

Match owns fixture-scoped runtime truth:

- match lifecycle/state machine;
- lineup/tactic snapshot lock;
- in-match command/intervention buffer;
- deterministic simulation;
- committed match event log, replay stream and report handoff.

Match does not own persistent tactics, player master data, durable injury or
discipline state, weather/pitch truth, rivalry/fan atmosphere, or narrative
display.

### Training

Training owns weekly/session planning and derived sporting signals:

- weekly training plan and session blocks;
- load/readiness/fatigue/injury-risk calculation;
- development signal batches;
- set-piece readiness signal emission;
- role/tactical-familiarity training projection consuming Tactics profiles.

Training does not own durable player records, contracts, discipline, lineup
locks, match simulation or persistent tactics libraries.

### Squad & Player

Squad & Player owns durable player and squad truth:

- player identity/base facts and attributes/development profile;
- durable fitness/form/morale/availability state;
- injuries and return-to-play state inside the game model;
- player contract lifecycle and future Contracts/CLM extraction seam;
- discipline ledger, suspension windows and appeal cases;
- squad projections consumed by selection, Impact Lens and other contexts.

Squad & Player does not own training algorithms, match simulation, match card
facts, competition-rule interpretation, transfer process cases, staff skills or
the persistent tactics library.

## Event-status Cleanup

FMX-132 should not invent a new Sporting Core mega-event catalog. The draft ADRs
collect the current published language per context and mark additional names as
proposal-only.

Current accepted/ratified event families used by the drafts:

- Match state machine events from `match.md`: `MatchScheduled`,
  `MatchLineupOpened`, `MatchLineupLocked`, `MatchSimulating`,
  `MatchHalftime`, `MatchEvent`, `MatchCompleted`, `MatchReported`,
  `MatchPostponed`, `InterventionBuffered`, `InterventionApplied`,
  `InterventionRejected`, `MatchPaused`, `MatchResumed`.
- ADR-0018 match injury fact: `MatchInjuryOccurred`.
- ADR-0018 Training/Squad development and injury lifecycle:
  `TrainingWeekProcessed`, `InjuryRiskUpdated`, `TrainingInjuryOccurred`,
  `PlayerReturnedFromInjury`, `PlayerDevelopmentDeltaApplied`,
  `PlayerAvailabilityChanged`.
- GD-0026 Training event: `SetPieceCoachReadinessUpdated`.
- ADR-0078 Squad & Player discipline event: `PlayerSuspendedV1` plus its appeal
  lifecycle events.
- Player contract lifecycle events from the state-machine note:
  `ContractMonitorWindowOpened`, `ContractRenewalDue`, `ContractExpiring`,
  `ContractRenewed`, `PlayerContractLifecycleAdvanced`,
  `PreContractWindowOpened`, `PreContractAgreed`.

Names not already accepted are explicitly proposal-only in ADR-0129/0130/0131.

## GD-0005 R2-03 Handling

Recommended closure:

- close **R2-03 tactics/training contract** as a boundary/specification gap once
  Nico accepts D5;
- the resolved contract is: Tactics owns `RoleProfileForPosition` and locked
  `TacticSnapshot`; Training consumes role profiles and emits training-derived
  readiness/familiarity signals; Match consumes only the locked snapshot;
- leave numeric magnitudes, growth/decay constants and calibration in
  GD-0043/FM X calibration work, not in FMX-132.

## Decision Status

Awaiting Nico in
[[../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]].

Until then:

- ADR-0129/0130/0131 are draft/non-binding;
- bounded-context map updates are descriptive and proposed where they touch
  pending choices;
- no implementation may use the draft ADRs as accepted authority.

