---
title: Squad & Player module
status: draft
tags: [architecture, module, squad-player, player-state, contracts, discipline, availability]
context: squad-player
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0131-squad-and-player-context-definition]], [[../09-Decisions/ADR-0073-player-contract-lifecycle-fsm]], [[../09-Decisions/ADR-0078-player-discipline-suspension-contracts]], [[../09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Squad & Player Boundary

## Purpose

Canonical home for durable player and squad truth: player records, attributes
and development state, fitness/form/morale and availability, injuries, contract
lifecycle and discipline. Match and Training emit facts/signals; Squad & Player
applies the durable player-state consequences (per ADR-0131).

## Owns

Aggregates / consistency boundaries (draft future-code names per ADR-0131 §2,
not database tables):

- `PlayerRecord` — save-local player identity, base facts, attributes and
  immutable/protected source fields.
- `PlayerDevelopmentProfile` — applied development deltas, attribute progression
  and development history.
- `PlayerAvailability` — selection availability derived from injuries,
  suspensions, registration/eligibility snapshots and fatigue/readiness facts.
- `PlayerInjuryRecord` — durable injury status, return-to-play timeline, history.
- `PlayerContractLifecycle` — active/monitor/renewal/expiring/pre-contract/
  free-agent lifecycle per ADR-0073.
- `PlayerDisciplineLedger` — card/suspension/appeal windows and canonical
  `PlayerSuspendedV1` publication per ADR-0078.
- `SquadProjection` — roster and availability views for Match, Training,
  Transfer and UI/Impact Lens.
- `SquadCohesionState` — draft family for morale/cohesion/form-style squad state
  where accepted GDDRs need it.

`ImpactLensProjection` is a Squad & Player read model exposed via the squad
`queryGateway` (BCM).

## Public contract

Transcribed from ADR-0131 §3 (Published Language). Commands and queries are
marked **draft public language** in the source.

### Commands (draft public language)

- `ApplyPlayerDevelopmentDelta`
- `UpdatePlayerAvailability`
- `RecordPlayerInjury`
- `ClearPlayerForReturn`
- `AdvancePlayerContractLifecycle`
- `OpenDisciplineCase`
- `ApplySuspension`
- `ResolveDisciplineAppeal`

### Queries / read models (draft public language)

- `GetPlayerRecord`
- `GetPlayerAvailabilitySnapshot`
- `GetSquadAvailabilityBoard`
- `GetPlayerDevelopmentProfile`
- `GetPlayerContractLifecycle`
- `GetPlayerDisciplineLedger`
- `GetSquadProjection`

### Domain events

Accepted / current event families:

- `PlayerDevelopmentDeltaApplied`
- `PlayerAvailabilityChanged`
- `TrainingInjuryOccurred`
- `PlayerReturnedFromInjury`
- `PlayerSuspendedV1`
- `DisciplineAppealSubmitted`
- `DisciplineAppealResolved`
- `SuspensionServed`
- `ContractMonitorWindowOpened`
- `ContractRenewalDue`
- `ContractExpiring`
- `ContractRenewed`
- `PlayerContractLifecycleAdvanced`
- `PreContractWindowOpened`
- `PreContractAgreed`

Accepted 2026-06-19 (code-phase refinement):

- `PlayerMoraleChanged`
- `PlayerFitnessStateChanged`
- `SquadCohesionChanged`
- `PlayerRegisteredForCompetition`
- `PlayerRegistrationChanged`

## Storage ownership

- Per ADR-0027 the context owns its Drizzle tables inside the per-save
  PostgreSQL schema; code lives under `src/domain/squad/`.
- Per ADR-0121 (no shared tables): no joins across context boundaries, no
  shared/ownerless lookup tables, and no importing another context's Drizzle
  table objects. Cross-context needs are met via published events or
  denormalised projection inputs copied into Squad-owned storage.
- Concrete table names are not enumerated by ADR-0131 (the aggregate names above
  are explicitly "not database tables") — see Open items.

## Consumers / Producers

Consumes facts (ADR-0131 §4, as self-contained verdicts/snapshots via ACLs):

- **Training** — `TrainingWeekProcessed`, development deltas/intents,
  `InjuryRiskUpdated`, `TrainingInjuryOccurred`.
- **Match** — `MatchInjuryOccurred`, match participation/card facts.
- **Regulations & Compliance** — eligibility, suspension-rule and
  contract-permission verdicts.
- **Transfer / Loan orchestration** — transfer completion, pre-contract and
  loan lifecycle facts.
- **People / Staff Operations** — actor/persona/staff influence snapshots.

Publishes to (ADR-0131 §5):

- **Match** — eligibility/availability/player snapshot for lineup lock and sim.
- **Training** — roster/player baseline/development profile snapshots.
- **Transfer / Scouting** — contract, availability, player profile and
  squad-needs projections.
- **Narrative / Notification** — self-contained injury, contract, suspension and
  availability events.
- **Impact Lens / UI** — player-state, squad-depth and availability projections.

## Invariants

- Durable player state is mutated only inside Squad & Player.
- Match and Training emit facts/signals; Squad & Player applies the durable
  player consequences.
- Player discipline/suspension events remain self-contained for consumers.
- Squad & Player must not import Training/Match/Tactics storage or internals
  (reinforced by ADR-0121).
- Contracts/CLM extraction is reserved but not activated (GD-0040 seam).
- Consumers depend on the context's published contracts/projections, not on its
  internal tables.

## Open items

- ADR-0131 marks Commands and Queries as **draft public language**; exact
  signatures/payloads are unspecified.
- Concrete Drizzle table names, schema layout and migrations for the owned
  aggregates are not defined by ADR-0131/ADR-0027 (aggregate names are explicitly
  not tables).
- `SquadCohesionState` is a draft aggregate family pending the relevant GDDRs.

## Dependencies

- [[../09-Decisions/ADR-0131-squad-and-player-context-definition]] (context definition; accepted/binding)
- [[../09-Decisions/ADR-0073-player-contract-lifecycle-fsm]] (contract lifecycle)
- [[../09-Decisions/ADR-0078-player-discipline-suspension-contracts]] (discipline/suspension)
- [[../09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] (player lifecycle/systemic events)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (per-save PostgreSQL schema, Drizzle)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables)
- [[../bounded-context-map]], [[../05-Building-Blocks]]
- State machines: [[../state-machines/player-contract-lifecycle]], [[../state-machines/player-discipline]]
