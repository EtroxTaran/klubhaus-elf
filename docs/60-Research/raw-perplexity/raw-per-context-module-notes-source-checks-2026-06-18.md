---
title: Raw per-context module notes source checks
status: raw
tags: [research, raw, source-check, bounded-context, module-notes, context-map, asyncapi, game-engine, fmx-169]
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-169
related:
  - [[../per-context-module-notes-2026-06-18]]
  - [[raw-per-context-module-notes-2026-06-18]]
  - [[../../40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../10-Architecture/05-Building-Blocks]]
---

# Raw per-context module notes source checks

## Capture metadata

- **Issue:** FMX-169
- **Date:** 2026-06-18
- **Purpose:** Validate the Perplexity claims before canonizing FMX-169
  recommendations.

## Sources checked

| Source | Relevant finding | FMX implication | Confidence |
|---|---|---|---|
| Microsoft Learn, "Identify domain-model boundaries for each microservice": <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/architect-microservice-container-applications/identify-microservice-domain-model-boundaries> | Domain boundaries should come from business capability and domain knowledge, not arbitrary size. A bounded context provides clear shared understanding, owns its domain model and exposes integration contracts/interfaces. | The central FMX map should keep business-capability boundaries and relationships. Per-context notes should not redefine the 28 contexts; they should clarify each context's public contract and ownership. | High |
| DDD Crew Bounded Context Canvas: <https://github.com/ddd-crew/bounded-context-canvas> | The canvas is a tool for designing and documenting one bounded context. It walks from name/purpose and responsibilities to inbound/outbound communication, ubiquitous language, business decisions, assumptions, metrics and open questions. It treats the public interface as a contract with the rest of the system. | A per-context note template should be a context card, not a copied mini-ADR. Useful required sections include purpose, owns/not-owns, public contracts, inbound/outbound communication, language, decisions and open questions. | High |
| AsyncAPI "AsyncAPI document": <https://www.asyncapi.com/docs/concepts/asyncapi-document> | An AsyncAPI document can serve as the primary description of an event-driven API and a communication contract between applications. It defines channels, operations, messages and payload properties. | FMX's docs-only phase can summarize event/command/query contracts, but later code-phase schemas should become the stronger source. Avoid pasting final-looking schema detail into notes before it exists. | High |
| AsyncAPI Generator docs: <https://www.asyncapi.com/docs/tools/generator> | AsyncAPI documents can generate documentation, clients, boilerplate and other artifacts. | Future FMX generated contract docs could replace manual schema tables. For now, context notes should reference eventual generated surfaces instead of becoming a competing schema source. | High |
| Godot engine architecture docs: <https://docs.godotengine.org/en/latest/engine_details/architecture/index.html> and source docs <https://github.com/godotengine/godot-docs/blob/master/engine_details/architecture/object_class.rst> | Godot documents source-code organization and distinguishes registered public classes from internal-only classes. | Comparable game/engine practice supports documenting public extension/API surfaces separately from internal details. It does not prove DDD context notes are standard in games. | Medium |
| OpenTTD documentation: <https://github.com/OpenTTD/OpenTTD/blob/master/docs/directory_structure.md> | OpenTTD documents data locations, extension categories and save/scenario/config paths. | Simulation projects commonly document operational surfaces and ownership of file/data areas. This supports discoverability, not a mandate for all 28 FMX contexts to get deep notes now. | Medium |
| OpenRA README/modding docs entry points: <https://github.com/OpenRA/OpenRA/blob/bleed/README.md> | OpenRA is an RTS engine with distributed mods and points modders to generated trait documentation, modding guides and Lua API docs. | Game-engine documentation emphasizes extension contracts and generated API docs. FMX should keep future generated/public surfaces authoritative once code exists. | Medium |

## Source-check failures / downgraded inputs

- Firecrawl search calls failed with HTTP 402 during this beat, so they are not
  used as evidence.
- A Team Topologies public "team API" URL surfaced by discovery returned a
  Squarespace 404 page during source checking. The concept remains useful as a
  general comparison, but it is not cited as canonical evidence here.
- Community blog posts and secondary modular-monolith explainers were useful in
  discovery, but the synthesis relies on Microsoft, DDD Crew, AsyncAPI and
  primary project documentation for the conclusions.

## Source-check conclusion

- The source-backed pattern is **central map plus local interface cards**, not
  one giant contract table and not a disconnected forest of context notes.
- The central map should continue to own context identity, cluster membership,
  relationship topology and folder mapping.
- Per-context notes are justified where they add local public-contract clarity:
  purpose, owns/not-owns, commands, queries, events, inbound/outbound
  collaboration, invariants, timing/replay constraints and linked decisions.
- To avoid duplicate truth, context notes should reference ADRs, GDDRs, state
  machines and future generated schemas instead of copying their full contents.
