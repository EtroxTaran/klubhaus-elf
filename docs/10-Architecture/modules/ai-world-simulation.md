---
title: AI World Simulation module
status: draft
tags: [architecture, module, ai-world, world-drift]
context: ai-world-simulation
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]], [[../09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]]
---

# AI World Simulation Boundary

## Purpose

Single owner for long-save world-drift orchestration: scores drift candidates,
applies caps/cooldowns and publishes self-contained `WorldDrift*` events
(Rising Rival, Giant Collapse, Continental Era Shift). It is also the canonical
planning-source context for AI match-prep (ADR-0080), supplying the planning
context while other contexts keep their source facts.

## Owns

Aggregates / owned state (ADR-0071):

- `WorldDriftCandidateSet`
- `WorldDriftProfile`
- `WorldDriftCooldownLedger`
- `WorldDriftParameterSheet`
- `WorldDriftEventLog`
- `ContinentalEraState`
- `WorldDriftPolicyCatalog` — producer-side published-language catalog owning
  `DriftConsumerPolicyRef` identity/versioning (FMX-139, accepted 2026-06-19).
- `WorldAiMgmtRng` sub-streams for club/owner/AI-management drift; `WorldRng`
  for impersonal macro shifts (hybrid allocation, ADR-0071 D2).

## Public contract

Domain events (ADR-0071):

- `RisingRivalTriggered`
- `GiantCollapseTriggered`
- `ContinentalEraShifted`
- `WorldDriftParameterSheetPublished`
- `WorldDriftPolicyCatalogVersionPublished` (FMX-139, accepted 2026-06-19)

Queries (ADR-0071):

- `WorldDriftForecast(clubId | leagueId | regionId)`
- `WorldDriftEventHistory(scope, seasons)`
- `WorldDriftHealthSnapshot(seedRunId)`

Published-language values carried on drift events:

- `DriftConsumerPolicyRef` — hybrid ref/snapshot record (id + catalog version +
  resolved snapshot) consumed by application-owning contexts; AI World owns its
  identity/versioning only, not its application (ADR-0071 inv. 8–11).

Planning-source role (ADR-0080): AI World Simulation supplies the
`planningContext` (`sourceContext: 'ai-world-simulation'`) used for opposition
match prep. Tactics — not AI World — owns and publishes
`OppositionTemplateSelectedForMatchV1` and the `SelectOppositionTemplateForMatch`
/ `BuildTacticSnapshotForMatch` surfaces; AI World only provides the planning
context, while League/Club/Transfer provide source facts through published
language (ADR-0080 OT7).

## Storage ownership

- Owns its own schema/tables for the aggregates above (drift candidates,
  profiles, cooldown ledger, parameter sheets, event log, era state, policy
  catalog) under the postgres data model ([[../09-Decisions/ADR-0027-postgres-data-model]]).
- No shared tables and no cross-context joins: AI World never queries another
  context's tables directly and never writes Club Management ledger rows
  (ADR-0071 inv. 2–3; [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]).
- Consumers store ACL projections from self-contained events; replay must not
  require live AI World table reads (ADR-0071 inv. 4, 8).

## Consumers / Producers

Consumes (source facts via published language, not direct reads):

- League Orchestration — season/fixture/competition lifecycle facts.
- Club Management — board/finance state inputs.
- CommercialPortfolio, Transfer, Youth Academy / Data Generator — domain facts
  used for candidate scoring.

Produces / consumed by:

- Club Management, CommercialPortfolio, Transfer apply `DriftConsumerPolicyRef`
  effects in their own contexts (ADR-0071 inv. 10).
- FMX-89 consumes `GiantCollapseTriggered` / `RisingRivalTriggered` for
  ownership-transition and bankruptcy FSMs.
- FMX-84 consumes `ContinentalEraShifted` for late-game / national-team arcs.
- Tactics consumes the supplied planning context for opposition-template
  selection (ADR-0080).

## Invariants

Boundary rules (ADR-0071, ADR-0080 OT7):

- Same `worldSeed`, engine version and input facts produce byte-identical
  `WorldDrift*` event sequences.
- AI World never writes Club Management ledger rows and never queries another
  context's tables directly.
- Every event is self-contained enough for consumers to store an ACL projection.
- All final numeric constants live in FMX-52 / GD-0043 calibration sheets, not
  in this context; events carry bands, not final cash amounts or ledger postings.
- Youth/Data Generator internals are not mutated; only a reserved
  `youthDiffusionHint` may be published until a Youth/Data follow-up approves it.
- MVP drama caps are global; per-confederation caps are reserved and inactive
  until ratified.
- Adding a new drift mechanism adds a new RNG label; never draw from an existing
  sequence.
- `DriftConsumerPolicyRef` is a published-language contract: consumers never
  persist AI World internal catalog rows; `policyCatalogVersion` is immutable
  once published for a save/engine version.
- AI World is the planning-source for match prep but does not own the
  opposition-template selection event or selector queries (Tactics owns those).

## Dependencies

- [[../09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]] (context + drift contract; draft phase, do not implement yet)
- [[../09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]] (planning-source role for opposition templates)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]] (no shared tables / no cross-context joins)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model)
- [[../bounded-context-map]] and [[../05-Building-Blocks]] (portfolio placement).

## Open items

The source ADRs leave these unspecified at the public-contract level:

- No command list is defined for AI World Simulation. ADR-0071 names aggregates,
  events and queries but no commands; the drift trigger (`season-end-structural-pass`)
  appears only as event provenance, not a named public command.
- Concrete schema/table names and DDL for the owned aggregates are not pinned
  (ADR-0027 fixes the data-model approach, not AI World's specific tables).
- `WorldDriftPolicyCatalog` read/query surface (how consumers fetch catalog
  versions beyond the `WorldDriftPolicyCatalogVersionPublished` event) is not
  specified.
- Final numeric calibration (caps, cooldowns, band values, candidate-scoring
  weights) is explicitly deferred to FMX-52 / GD-0043.
- `youthDiffusionHint` semantics are reserved pending a Youth/Data Generator
  follow-up decision.
