---
title: Raw per-context module notes research
status: raw
tags: [research, raw, perplexity, bounded-context, module-notes, context-map, ddd, fmx-169]
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-169
related:
  - [[../per-context-module-notes-2026-06-18]]
  - [[raw-per-context-module-notes-source-checks-2026-06-18]]
  - [[../../40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../10-Architecture/05-Building-Blocks]]
  - [[../../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# Raw per-context module notes research

## Capture metadata

- **Issue:** FMX-169
- **Date:** 2026-06-18
- **Purpose:** First-pass discovery for deciding whether FMX should introduce
  one module note per bounded context, keep
  [[../../10-Architecture/bounded-context-map]] §4 as the only target surface, or
  use a hybrid.
- **Status:** Raw Perplexity discovery input. Source-checked conclusions live in
  [[raw-per-context-module-notes-source-checks-2026-06-18]].

## Prompt 1

Research best practices for documenting per-bounded-context modules in a DDD
modular monolith. Compare three approaches: central context map only,
per-context module notes only, and a hybrid where a central context map lists
relationships and per-context notes own local contracts. Include Context Map,
Published Language, Open Host Service, commands/queries/events, avoiding
duplicate truth, and handling 20-30 contexts. The target is a docs-only
football-manager simulation vault with 28 bounded contexts and future
TypeScript folders under `src/domain/<context>`.

## Raw answer summary 1

- A central context map remains the best navigation surface for a many-context
  system because it shows the context portfolio, relationship types and
  integration edges in one place.
- Per-context notes are useful when a context has real public contracts:
  commands, queries, events, owned data, invariants, upstream/downstream
  dependencies and explicit non-goals.
- A map-only approach is low-maintenance and minimizes duplication, but it tends
  to become too shallow or too large when 20-30 contexts each need operational
  contract details.
- A per-context-only approach gives strong local ownership and onboarding, but
  makes cross-context relationships harder to scan and risks divergent language
  if no central map exists.
- The recommended approach was a hybrid:
  - the map owns the catalog, clusters and relationship topology;
  - context notes own local API/contract cards and operational invariants;
  - schema or contract details should be referenced, not copied, when a stronger
    source later exists in code or generated docs.
- Suggested context-note fields:
  - identity and aliases;
  - purpose and scope;
  - owned model/data;
  - public commands, queries and events;
  - inbound and outbound collaborations;
  - Published Language or Open Host Service surface;
  - upstream/downstream dependencies and anti-corruption boundaries;
  - invariants, state machines and timing constraints;
  - relevant ADRs/GDDRs and open decisions.
- For 20-30 contexts, the guidance was to avoid writing encyclopedic notes for
  all contexts at once. Start with high-coupling or MVP-critical contexts,
  enforce a template, and update the owning note in the same PR as public
  contract changes.

## Mentioned source classes 1

Perplexity cited mixed DDD and modular-monolith sources: Microsoft domain model
boundary guidance, DDD context mapping material, the DDD Crew Bounded Context
Canvas, Team Topologies "team API" ideas, AsyncAPI contract documentation,
modular-monolith examples and community blog posts. Primary/current checks are
preserved in the source-check sibling note.

## Prompt 2

Research comparable real-world and game or large-simulation documentation
practices for module/interface documentation. Include enterprise/team
architecture docs, Team Topologies/team APIs, modular-monolith READMEs,
event/API contract catalogs, and public open-source game/simulation/engine
examples. Explain what can and cannot be inferred for a football-manager game
architecture vault. End with decision questions and a recommended first set of
MVP-critical contexts if per-context module notes are adopted.

## Raw answer summary 2

- Real-world architecture documentation patterns favor lightweight,
  local-to-the-system documentation that clarifies ownership and interfaces
  rather than duplicating all implementation detail.
- ADRs record decisions and trade-offs; context/module notes should record the
  current operating contract and link back to ADRs.
- Team/API-style documentation is useful for showing capabilities, collaboration
  rules and quality expectations. For FMX, that maps to context responsibilities,
  commands/queries/events, timing/determinism constraints and integration
  contacts.
- Event/API catalogs are valuable when a system has many asynchronous
  producers/consumers, but they should be generated or strongly referenced when
  schemas exist. In a docs-only phase, a human-authored public-contract summary
  is enough if it avoids pretending final schemas exist.
- Public game and engine repositories usually do not document DDD bounded
  contexts. They more often document extension APIs, directory structure,
  engine subsystems, modding surfaces, save formats and contribution standards.
  These are useful analogues for public surface vs internal detail, but not
  evidence that game projects should use DDD context notes.
- Recommended template fields:
  - context identity, mission and scope;
  - public contracts;
  - inbound/outbound dependencies;
  - data ownership and consistency boundaries;
  - timing, replay and determinism constraints where relevant;
  - ownership/collaboration notes;
  - links to decisions, tests/examples and open questions.
- Suggested decision questions:
  - Does FMX want a staged hybrid surface or keep the map-only approach?
  - Which fields are required in every context note?
  - Which contexts are the first slice?
  - How are note/map/code-schema changes kept in sync later?
- Generic recommended first slice from the discovery pass:
  - Match Simulation;
  - Fixture/Competition Scheduling;
  - Squad/Roster;
  - Transfer/Contract;
  - Finance/Budgeting;
  - Player Development/Training;
  - Injuries/Fitness;
  - Save/Load/Persistence.

## FMX mapping caveat

The generic first-slice list above is not directly authoritative for FMX:

- "Fixture/Competition Scheduling" maps mostly to **League Orchestration**.
- "Squad/Roster", "Injuries/Fitness" and some contract state map to
  **Squad & Player** under the current 28-context catalog.
- "Transfer/Contract" is split between **Transfer**, **Squad & Player** and
  future contract-lifecycle decisions.
- "Finance/Budgeting" maps to **Club Management** plus existing ledger ADRs.
- "Save/Load/Persistence" is a platform capability, not a bounded context in the
  current map; the closest context-facing slice is **Offline Sync**.

## Raw conclusion

The best candidate is a staged hybrid. Keep
[[../../10-Architecture/bounded-context-map]] as the central catalog,
relationship map and source-folder index; add per-context module notes only as
local interface cards for the contexts whose public contracts are mature enough
to summarize. Do not create all 28 detailed notes in one pass unless Nico
explicitly chooses the high-coverage, high-maintenance option.
