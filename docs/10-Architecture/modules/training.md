---
title: Training module
status: draft
tags: [architecture, module, training, sporting-core, development]
context: training
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0130-training-context-definition]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Training Boundary

## Purpose

Sporting Core context that computes training load, fatigue, readiness,
development signals and role/set-piece readiness from a weekly training plan;
it emits projections and facts for downstream contexts but never owns durable
player, tactics or staff state (per ADR-0130).

## Owns

- `TrainingPlan` — weekly plan, daily slots, individual focus and regeneration
  balance.
- `TrainingSession` — session-level load, focus and attendance facts.
- `PlayerLoadWindow` — per-player acute/current load, fatigue and readiness
  signal inputs.
- `DevelopmentSignalBatch` — deterministic batch of training-derived growth
  deltas handed to Squad & Player.
- `InjuryRiskSignal` — training-computed risk/readiness warning (not durable
  injury state).
- `SetPieceReadinessProjection` — per-module/variant readiness values emitted
  to Tactics.
- `RoleFamiliarityProjection` — draft family for role/tactical familiarity
  signals consuming Tactics profiles.

(Aggregate names are draft future-code names, not database tables.)

## Public contract

Commands (draft public language):

- `SetWeeklyTrainingPlan`
- `AssignIndividualTrainingFocus`
- `ScheduleTrainingCamp`
- `ProcessTrainingWeek`
- `RecordTrainingSession`

Queries / read models (draft public language):

- `GetTrainingPlan`
- `GetTrainingLoadProjection`
- `GetDevelopmentSignalPreview`
- `GetReadinessProjection`
- `GetSetPieceReadinessProjection`
- `GetRoleFamiliarityProjection`

Domain events — accepted/current:

- `TrainingWeekProcessed`
- `InjuryRiskUpdated`
- `TrainingInjuryOccurred`
- `SetPieceCoachReadinessUpdated`

Domain events — accepted for code-phase refinement (2026-06-19):

- `TrainingPlanUpdated`
- `TrainingSessionCompleted`
- `TrainingLoadUpdated`
- `RoleFamiliarityUpdated`
- `DevelopmentSignalBatchPrepared`

Also published toward Squad & Player as intent/facts:
`PlayerDevelopmentDelta`.

## Storage ownership

- Training owns its own schema/tables for its aggregates; it persists no
  durable player, tactics or staff truth.
- No shared tables and no cross-context joins: upstream facts are consumed only
  as snapshots/projections through public contracts, never by reading another
  context's storage (ADR-0121, on the ADR-0027 Postgres data model).

## Consumers / Producers

Consumes facts from (downstream ACL; reads projections/snapshots, never mutates
upstream truth):

- Squad & Player — player roster, current availability/injury/fitness baseline,
  player development profile snapshot.
- Tactics — `RoleProfileForPosition`, set-piece routine metadata (customer/
  supplier published query; no Tactics internals).
- Staff Operations / People — trainer capacity and staff skill/profile
  projections where accepted.
- Calendar / Competition / Match — schedule density and recent/next match
  workload facts.

Produces facts for:

- Squad & Player — `TrainingWeekProcessed`, `PlayerDevelopmentDelta`,
  `InjuryRiskUpdated`, `TrainingInjuryOccurred` (owns durable development,
  injury and availability state).
- Tactics — `SetPieceCoachReadinessUpdated`, proposed role-familiarity
  projection (owns TacticSnapshot/routine selection and persistent catalog).
- Match — readiness/load/fatigue snapshot (owns lineup lock, simulation, event
  log).
- Impact Lens / UI — training summaries and readiness projections.

## Invariants

- Training computes signals; Squad & Player persists durable player state —
  Training never mutates player truth directly (ADR-0130 D2/D3 option A,
  consistent with ADR-0018).
- Training does not own match simulation, lineup lock, persistent tactics
  catalog/snapshot assembly, staff lifecycle, or GD-0043 calibration constants.
- Consumed upstream facts cross the boundary only via snapshot/projection
  contracts — no shared tables, no cross-context joins (ADR-0121).
- Development signal and readiness payloads must be defined deterministically
  before implementation.

## Dependencies

- [[../09-Decisions/ADR-0130-training-context-definition]] (accepted/binding —
  context definition)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (storage boundary)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model)

## Open items

- Whether Match consumes Training's readiness/load/fatigue snapshot is gated on
  ADR-0130 D2/D5 acceptance; the snapshot's payload shape is not yet specified.
- Numeric calibration magnitudes for load/readiness/development formulas remain
  under GD-0043 gameplay-calibration ownership, not pinned here.
- Deterministic payload schemas for development-signal and readiness/familiarity
  projections are not yet defined by the source (deferred to code phase).
- Per-aggregate table/schema layout is unspecified (ADR-0130 names aggregates as
  draft future-code names, not tables).
