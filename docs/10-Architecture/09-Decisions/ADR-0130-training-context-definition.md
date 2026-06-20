---
title: ADR-0130 Training Context Definition
status: accepted
tags: [adr, architecture, ddd, bounded-context, sporting-core, training, development, load, readiness, fmx-132, accepted]
context: training
created: 2026-06-16
updated: 2026-06-19
type: adr
binding: true
linear: FMX-132
amends:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0067-set-piece-variant-selection-determinism]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-game-precedents-2026-06-16]]
  - [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0005-training]]
  - [[../../50-Game-Design/training-load-and-medicine]]
  - [[../../50-Game-Design/GD-0026-set-piece-coach-readiness]]
  - [[../../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
---

# ADR-0130: Training Context Definition

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

Training is an Original-11 Sporting Core context. GD-0005 is accepted for the
player-facing training loop, but still lists R2-03 as an open
tactics/training-contract item. ADR-0018 already says Training computes
development and injury-risk signals while Squad & Player persists durable
player state. ADR-0055 already says Training reads `RoleProfileForPosition`
from Tactics.

FMX-132 proposes a context-definition ADR that makes that boundary explicit.

## Proposed Decision

### 1. Scope

Training owns:

- weekly training plan and daily/session slots;
- training intensity/load/fatigue/readiness calculation;
- individual training focus and development-signal generation;
- regeneration/rest trade-off inputs;
- tactical/role familiarity training signals that consume Tactics role
  profiles;
- set-piece readiness calculation and `SetPieceCoachReadinessUpdated` emission
  per GD-0026;
- training-camp and training-facility effects where existing GDDR scope allows;
- training projections consumed by Match, Squad & Player and Impact Lens.

Training does not own:

- durable player master records, contracts, injury records, discipline, morale
  or availability state (Squad & Player);
- match simulation, lineup lock, substitutions, event log or replay (Match);
- persistent tactics library, opposition templates, set-piece routine catalogs
  or locked `TacticSnapshot` assembly (Tactics);
- staff lifecycle/skills truth (Staff Operations / People);
- numeric calibration constants that GD-0043 keeps under gameplay calibration
  ownership unless separately accepted.

### 2. Aggregate Inventory

| Aggregate / consistency boundary | Responsibility |
|---|---|
| `TrainingPlan` | Weekly plan, daily slots, individual focus and regeneration balance. |
| `TrainingSession` | Session-level load, focus and attendance facts. |
| `PlayerLoadWindow` | Per-player acute/current load, fatigue and readiness signal inputs. |
| `DevelopmentSignalBatch` | Deterministic batch of training-derived growth deltas to hand to Squad & Player. |
| `InjuryRiskSignal` | Training-computed risk/readiness warning, not durable injury state. |
| `SetPieceReadinessProjection` | Per-module/variant readiness values emitted to Tactics. |
| `RoleFamiliarityProjection` | Draft family for role/tactical familiarity signals consuming Tactics profiles. |

These are draft future-code names and not database tables.

### 3. Published Language

Current accepted/current events:

- `TrainingWeekProcessed`
- `InjuryRiskUpdated`
- `TrainingInjuryOccurred`
- `SetPieceCoachReadinessUpdated`

accepted event names accepted by Nico 2026-06-19/code-phase refinement:

- `TrainingPlanUpdated`
- `TrainingSessionCompleted`
- `TrainingLoadUpdated`
- `RoleFamiliarityUpdated`
- `DevelopmentSignalBatchPrepared`

Commands, draft public language:

- `SetWeeklyTrainingPlan`
- `AssignIndividualTrainingFocus`
- `ScheduleTrainingCamp`
- `ProcessTrainingWeek`
- `RecordTrainingSession`

Queries/read models, draft public language:

- `GetTrainingPlan`
- `GetTrainingLoadProjection`
- `GetDevelopmentSignalPreview`
- `GetReadinessProjection`
- `GetSetPieceReadinessProjection`
- `GetRoleFamiliarityProjection`

### 4. Consumed Facts and ACLs

| Upstream | Training consumes | Handling |
|---|---|---|
| Squad & Player | player roster, current availability/injury/fitness baseline, player development profile snapshot | Downstream ACL; Training reads projection/snapshot, never mutates player truth directly. |
| Tactics | `RoleProfileForPosition`, set-piece routine metadata needed for readiness | Customer/Supplier-style published query; Training must not read Tactics internals. |
| Staff Operations / People | trainer capacity and relevant staff skill/profile projections where accepted | Self-contained projections; Training does not own staff lifecycle. |
| Calendar/Competition/Match | schedule density and recent/next match workload facts | Consumed as fixtures/workload inputs; Training does not own fixture state. |

### 5. Downstream Effects

| Downstream | Training publishes | Downstream owns |
|---|---|---|
| Squad & Player | `TrainingWeekProcessed`, `PlayerDevelopmentDelta` intent/facts, `InjuryRiskUpdated`, `TrainingInjuryOccurred` | durable player development, injury and availability state |
| Tactics | `SetPieceCoachReadinessUpdated`, proposed role-familiarity projection | TacticSnapshot/routine selection and persistent tactics catalog |
| Match | readiness/load/fatigue snapshot if D2/D5 are accepted | lineup lock, simulation and event log |
| Impact Lens / UI | training summaries and readiness projections | presentation/projection behavior |

### 6. GD-0005 R2-03 Resolution

If Nico accepts D5:

- GD-0005 R2-03 is closed as a boundary-contract gap;
- the contract is Tactics -> Training via `RoleProfileForPosition`, Training ->
  Tactics via readiness/familiarity signals, and Tactics -> Match via locked
  `TacticSnapshot`;
- calibration magnitudes remain in GD-0043/gameplay-calibration work.

## Options Considered

### D2/D3 - state ownership

| Option | Meaning | Assessment |
|---|---|---|
| A. Training computes signals; Squad & Player persists state | Training emits load/readiness/development facts and does not mutate durable player state. | **Recommended, accepted by Nico 2026-06-19.** Matches ADR-0018. |
| B. Training owns fitness/availability/development record | Move durable player state to Training. | Conflicts with Squad & Player boundary. |
| C. Squad & Player computes all training effects | Training becomes planning UI only. | Loses the training domain model. |

### D5 - tactics/training seam

| Option | Meaning | Assessment |
|---|---|---|
| A. Close R2-03 as boundary-defined | Tactics owns role profiles/snapshot; Training owns signals; calibration remains later. | **Recommended, accepted by Nico 2026-06-19.** |
| B. Keep R2-03 open until formulas are calibrated | Wait for all magnitudes. | Conflates boundary with tuning. |
| C. Move tactic familiarity into Match/Squad | Shift ownership. | Conflicts with ADR-0055. |

## Consequences

Positive:

- Clarifies Training as signal/calculation owner.
- Gives GD-0005 a path to close R2-03 without premature numeric tuning.
- Keeps player-state durability and match simulation out of Training.

Negative / constraints:

- Future code must define deterministic signal payloads before implementation.
- Training consumers need snapshot/projection contracts rather than shared
  player/tactic tables.

## Related

- [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
- [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
- [[../../50-Game-Design/GD-0005-training]]
- [[../../50-Game-Design/training-load-and-medicine]]
- [[../../50-Game-Design/GD-0026-set-piece-coach-readiness]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0055-tactics-context]]
