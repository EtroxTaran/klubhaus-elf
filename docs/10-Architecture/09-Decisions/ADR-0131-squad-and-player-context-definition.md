---
title: ADR-0131 Squad & Player Context Definition
status: accepted
tags: [adr, architecture, ddd, bounded-context, sporting-core, squad-player, player-state, availability, contracts, discipline, fmx-132, accepted]
context: squad-player
created: 2026-06-16
updated: 2026-06-19
type: adr
binding: true
linear: FMX-132
amends:
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0073-player-contract-lifecycle-fsm]]
  - [[ADR-0078-player-discipline-suspension-contracts]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-ddd-boundaries-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-realworld-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-sporting-core-contexts-game-precedents-2026-06-16]]
  - [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
  - [[../bounded-context-map]]
  - [[../state-machines/player-contract-lifecycle]]
  - [[../state-machines/player-discipline]]
  - [[../../50-Game-Design/GD-0003-squad-players]]
  - [[../../50-Game-Design/squad-and-club-structure]]
  - [[../../50-Game-Design/GD-0040-future-contracts-clm-extraction-seam]]
---

# ADR-0131: Squad & Player Context Definition

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

Squad & Player is one of the Original-11 Sporting Core contexts. Existing
feature decisions already assign it durable player state, contract lifecycle,
discipline, injury/availability and development-delta application, but that
ownership is spread across ADR-0018, ADR-0073, ADR-0078, game-design notes and
state-machine notes.

FMX-132 proposes a canonical context-definition ADR.

## Proposed Decision

### 1. Scope

Squad & Player owns durable player and squad truth:

- player record, identity inside the save, roster membership and base facts;
- visible/hidden attributes, development profile and applied development
  deltas;
- durable fitness, form, morale and availability state used for selection;
- injury records, injury status and return-to-play state inside the game model;
- player contract lifecycle per ADR-0073, with GD-0040's future Contracts/CLM
  extraction seam preserved;
- player discipline ledger, suspension windows and appeal cases per ADR-0078;
- squad projections, availability boards and player-state snapshots consumed by
  Match, Training, Transfer, Impact Lens and Narrative/Notification.

Squad & Player does not own:

- training plans, load algorithms, readiness/development-signal calculation or
  training sessions (Training);
- match simulation, event log, cards as on-pitch facts, lineups or replay
  (Match);
- persistent tactics library, set-piece routine catalogs, opposition templates
  or role profiles (Tactics);
- competition-rule interpretation and eligibility policy (Regulations &
  Compliance);
- transfer negotiations/process cases, loan orchestration or scouting
  workflows;
- staff skills/personas truth or People context facts;
- accounting ledger postings or wage-block accounting.

### 2. Aggregate Inventory

| Aggregate / consistency boundary | Responsibility |
|---|---|
| `PlayerRecord` | Save-local player identity, base facts, attributes and immutable/protected source fields. |
| `PlayerDevelopmentProfile` | Applied development deltas, attribute progression state and development history. |
| `PlayerAvailability` | Selection availability derived from injuries, suspensions, registration/eligibility snapshots and fatigue/readiness facts. |
| `PlayerInjuryRecord` | Durable injury status, return-to-play timeline and injury history. |
| `PlayerContractLifecycle` | Active/monitor/renewal/expiring/pre-contract/free-agent lifecycle per ADR-0073. |
| `PlayerDisciplineLedger` | Card/suspension/appeal windows and canonical `PlayerSuspendedV1` publication per ADR-0078. |
| `SquadProjection` | Roster and availability views consumed by Match, Training, Transfer and UI/Impact Lens. |
| `SquadCohesionState` | Draft family for morale/cohesion/form-style squad state where accepted GDDRs need it. |

These are draft future-code names and not database tables.

### 3. Published Language

Current accepted/current event families:

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

accepted event names accepted by Nico 2026-06-19/code-phase refinement:

- `PlayerMoraleChanged`
- `PlayerFitnessStateChanged`
- `SquadCohesionChanged`
- `PlayerRegisteredForCompetition`
- `PlayerRegistrationChanged`

Commands, draft public language:

- `ApplyPlayerDevelopmentDelta`
- `UpdatePlayerAvailability`
- `RecordPlayerInjury`
- `ClearPlayerForReturn`
- `AdvancePlayerContractLifecycle`
- `OpenDisciplineCase`
- `ApplySuspension`
- `ResolveDisciplineAppeal`

Queries/read models, draft public language:

- `GetPlayerRecord`
- `GetPlayerAvailabilitySnapshot`
- `GetSquadAvailabilityBoard`
- `GetPlayerDevelopmentProfile`
- `GetPlayerContractLifecycle`
- `GetPlayerDisciplineLedger`
- `GetSquadProjection`

### 4. Consumed Facts and ACLs

| Upstream | Squad & Player consumes | Handling |
|---|---|---|
| Training | `TrainingWeekProcessed`, development deltas/intents, `InjuryRiskUpdated`, `TrainingInjuryOccurred` | Applies durable player-state effects after validation; Training does not mutate player records directly. |
| Match | `MatchInjuryOccurred`, match participation/card facts | Applies durable injury/availability/discipline impacts through Squad & Player rules and ADR-0078/Regulations constraints. |
| Regulations & Compliance | eligibility, suspension-rule and contract-permission verdicts | Consumed as self-contained verdicts/rule snapshots; Squad & Player does not own regulation policy. |
| Transfer / Loan orchestration | transfer completion, pre-contract and loan lifecycle facts | Updates roster/contract/player lifecycle state; process ownership remains outside. |
| People / Staff Operations | actor/persona/staff influence snapshots where accepted | Consumed as snapshots only; Squad & Player does not own People truth. |

### 5. Downstream Consumers

| Downstream | Squad & Player publishes |
|---|---|
| Match | eligibility/availability/player snapshot for lineup lock and simulation input. |
| Training | roster/player baseline/development profile snapshots for planning and signal calculation. |
| Transfer / Scouting | contract, availability, player profile and squad-needs projections. |
| Narrative / Notification | self-contained injury, contract, suspension and availability events. |
| Impact Lens / UI | player-state, squad-depth and availability projections. |

### 6. Invariants

- Durable player state is mutated only inside Squad & Player.
- Match and Training emit facts/signals; Squad & Player applies durable player
  consequences.
- Contracts/CLM extraction is reserved but not activated by this ADR.
- Player discipline/suspension events remain self-contained for consumers.
- Squad & Player must not import Training/Match/Tactics storage or internals.

## Options Considered

### D2/D3/D6 - durable player-state ownership

| Option | Meaning | Assessment |
|---|---|---|
| A. Squad & Player owns durable player state and aggregate families | Training/Match emit signals/facts; Squad & Player applies state. | **Recommended, accepted by Nico 2026-06-19.** Matches ADR-0018/0073/0078. |
| B. Keep only a generic `Player` aggregate listed | Avoids detail. | Leaves too much ambiguity for implementation. |
| C. Split Medical or Contracts now | Add new contexts now. | Premature portfolio growth; GD-0040 keeps Contracts as extraction seam only. |

## Consequences

Positive:

- Gives player-state ownership one canonical home.
- Removes pressure for Match or Training to mutate durable player records.
- Makes existing contract and discipline ADRs easier to find from the context
  map.

Negative / constraints:

- Squad & Player becomes a large context and must be watched under the
  FMX-160/GD-0038 merge/split gate.
- Future code needs careful aggregate sizing so `PlayerRecord` does not become
  a catch-all object.

## Related

- [[../../60-Research/sporting-core-context-definition-maturity-2026-06-16]]
- [[../../40-Execution/fmx-132-sporting-core-context-definitions-decision-queue-2026-06-16]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[ADR-0073-player-contract-lifecycle-fsm]]
- [[ADR-0078-player-discipline-suspension-contracts]]
- [[../../50-Game-Design/GD-0040-future-contracts-clm-extraction-seam]]
- [[../state-machines/player-contract-lifecycle]]
- [[../state-machines/player-discipline]]
