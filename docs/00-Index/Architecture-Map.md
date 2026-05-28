---
title: Architecture Map
status: current
tags: [architecture, meta]
created: 2026-05-16
updated: 2026-05-28
type: map
binding: false
related: [[Decision-Log]], [[Current-State]], [[MVP-Scope]], [[Documentation-V1]]
---

# Architecture Map

Use this map before architecture or cross-cutting implementation work.
[[Documentation-V1]] is the current architecture classification baseline. If a
note is not `accepted`, `current` or explicitly promoted there, treat it as
future-scope or historical context.

## arc42 Chapters

- [Introduction](../10-Architecture/01-Introduction.md)
- [Constraints](../10-Architecture/02-Constraints.md)
- [Context](../10-Architecture/03-Context.md)
- [Solution Strategy](../10-Architecture/04-Solution-Strategy.md)
- [Building Blocks](../10-Architecture/05-Building-Blocks.md)
- [Runtime](../10-Architecture/06-Runtime.md)
- [Deployment](../10-Architecture/07-Deployment.md)
- [Crosscutting](../10-Architecture/08-Crosscutting.md)
- [Design System](../10-Architecture/09-Design-System.md)
- [Quality](../10-Architecture/10-Quality.md)
- [Risks](../10-Architecture/11-Risks.md)

## DDD and Modules

- [[../10-Architecture/bounded-context-map]] - 12 bounded contexts, service-ready modular monolith; Manager & Legacy ratified 2026-05-28 (ADR-0051, FMX-25 + FMX-35); FMX-23 proposes People / Persona & Skills as a draft additional context.
- [[../10-Architecture/05-Building-Blocks]] - module map.
- [[../10-Architecture/modules/web]]
- [[../10-Architecture/modules/ui]]
- [[../10-Architecture/modules/db]]
- [[../10-Architecture/modules/db-schema]]
- [[../10-Architecture/modules/game-data]]
- [[../10-Architecture/modules/match-engine]]
- [[../10-Architecture/transfer-market-architecture]]

## State Machines

- [[../10-Architecture/state-machines/README]]
- [[../10-Architecture/state-machines/league-week]]
- [[../10-Architecture/state-machines/transfer]]
- [[../10-Architecture/state-machines/watch-party]]
- [[../10-Architecture/state-machines/match]]

State-machine notes are current planning references. Runtime orchestration
changes that depend on them require ADR-0014 promotion or a superseding ADR.

## Current Binding ADRs

- [ADR-0003 Match Engine](../10-Architecture/09-Decisions/ADR-0003-match-engine.md) - historical TypeScript-first target, superseded as planning target by ADR-0049.
- [ADR-0049 Swappable Spatial-Event Match Engine](../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine.md) - draft replacement target for match-engine boundary/runtime.
- [ADR-0005 Save Format](../10-Architecture/09-Decisions/ADR-0005-save-format.md)
- [ADR-0007 Naming Schema](../10-Architecture/09-Decisions/ADR-0007-naming-schema.md)
- [ADR-0009 Cursor Orchestration](../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration.md)
- [ADR-0010 Design System](../10-Architecture/09-Decisions/ADR-0010-design-system.md)
- [ADR-0011 Server-Authoritative Multiplayer](../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer.md)
- [ADR-0017 Observability and Logging](../10-Architecture/09-Decisions/ADR-0017-observability-logging.md)
- [ADR-0018 Systemic Events and Player Lifecycle Architecture](../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle.md)
- [ADR-0019 Service-ready Modular Monolith + DDD](../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd.md)
- [ADR-0020 Hybrid-online MVP, Offline-ready Architecture](../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready.md)
- [ADR-0021 Revised Tech Stack](../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack.md)
- [ADR-0022 Animation and Game Feel](../10-Architecture/09-Decisions/ADR-0022-animation-game-feel.md)
- [ADR-0023 Realtime Transport](../10-Architecture/09-Decisions/ADR-0023-realtime-transport.md)
- [ADR-0024 Match Renderer Abstraction](../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction.md)
- [ADR-0025 Mobile Delivery](../10-Architecture/09-Decisions/ADR-0025-mobile-delivery.md)
- [ADR-0026 Match Frame Contract](../10-Architecture/09-Decisions/ADR-0026-match-frame-contract.md)
- [ADR-0027 Postgres Data Model](../10-Architecture/09-Decisions/ADR-0027-postgres-data-model.md)
- [ADR-0028 Postgres Transactional Outbox](../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox.md)
- [ADR-0029 3D Presentation Layer](../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer.md)
- [ADR-0041 Presentation Renderer Strategy](../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy.md)
- [ADR-0043 Notification and Messaging Platform](../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform.md)
- [ADR-0050 Club Economy Accounting Ledger](../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md) - draft Club Management finance ledger, accounting projections, country economy profiles and staged insolvency boundary.
- [ADR-0051 Manager and Legacy Context](../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md) - draft proposed Manager & Legacy context for manager identity, run analysis, archetype candidates and prestige/legacy selection.
- [ADR-0052 People, Persona and Skills Context](../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context.md) - draft proposed People context for actor personas, relationship graph, player/staff skill profiles and deterministic context cards.

## Current Binding Research and Specs

- [Postgres + Drizzle Integration](../30-Implementation/postgres-drizzle-integration.md)
- [Notification and Messaging Platform](../30-Implementation/notification-messaging-platform.md)
- [Club Economy Accounting Ledger](../30-Implementation/club-economy-accounting-ledger.md) - draft implementation contracts for weekly ledger entries, economy read models and insolvency state.
- [Hybrid-online PWA Strategy](../30-Implementation/hybrid-online-pwa-strategy.md)
- [PWA Offline Strategy](../30-Implementation/pwa-offline-strategy.md)
- [Match Engine Runtime Strategy](../60-Research/match-engine-runtime-strategy.md)
- [Swappable Spatial-Event Match Engine Research](../60-Research/swappable-spatial-event-match-engine-2026-05-27.md)
- [Manager Archetype Roguelite Research](../60-Research/manager-archetype-roguelite-2026-05-27.md)
- [EOS Player, Staff, Skills and Personas Research](../60-Research/eos-player-staff-skills-and-personas-2026-05-28.md)
- [Match Engine Simulation Model](../60-Research/match-engine-simulation-model.md)
- [Presentation Renderer Strategy](../60-Research/presentation-renderer-strategy.md)
- [Performance Budgets](../60-Research/performance-budgets.md)
- [Determinism and Replay](../60-Research/determinism-and-replay.md)
- [Data Generators](../60-Research/data-generators.md)
- [AI Manager Behaviour](../60-Research/ai-manager-behaviour.md)
- [Narrative Content Pipeline](../60-Research/narrative-content-pipeline.md)
- [Late-Game Systems](../60-Research/late-game-systems.md)
- [Onboarding Strategy](../60-Research/onboarding-strategy.md)
- [Tactics and Formations](../60-Research/tactics-and-formations.md)
- [Player Strength Presentation](../60-Research/player-strength-presentation.md)
- [Threat Model](../60-Research/threat-model.md)

## Superseded Historical Decisions

- [ADR-0001 Tech Stack](../10-Architecture/09-Decisions/ADR-0001-tech-stack.md) - superseded by ADR-0021.
- [ADR-0002 Offline-first](../10-Architecture/09-Decisions/ADR-0002-offline-first.md) - superseded by ADR-0020 for MVP scope.
- [ADR-0004 Data Model](../10-Architecture/09-Decisions/ADR-0004-data-model.md) - superseded by ADR-0027.
- [ADR-0013 Transactional Outbox](../10-Architecture/09-Decisions/ADR-0013-transactional-outbox.md) - superseded by ADR-0028.
- [SurrealDB Integration](../30-Implementation/surrealdb-integration.md) - superseded by Postgres + Drizzle implementation.
- [SurrealDB Schema Patterns](../60-Research/surrealdb-schema-patterns.md) - historical substrate research carried forward into ADR-0027.

## Classified Future-Scope / Optional Promotion

- [ADR-0006 i18n](../10-Architecture/09-Decisions/ADR-0006-i18n.md) - future-scope depth pass; promote when implementation starts.
- [ADR-0008 Mobile-first UI](../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui.md) - covered by current design-system/a11y baseline; promote only for cleanup or new mobile UI decisions.
- [ADR-0012 Async Cadence Models](../10-Architecture/09-Decisions/ADR-0012-async-cadence-models.md) - product rules already approved in game design; ADR promotion is optional cleanup.
- [ADR-0014 State Machines](../10-Architecture/09-Decisions/ADR-0014-state-machines.md) - promote before changing runtime orchestration.
- [ADR-0015 Spectator Snapshot Streaming](../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming.md) - post-MVP watch-party layer.
- [ADR-0016 Community Dataset Overrides](../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides.md) - future-scope until UGC moderation/security gates are implemented.
- [ADR-0030 LLM Out Of Authoritative State Boundary](../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md) - draft Runtime-LLM re-evaluation for Full Dialogue outside authoritative state; no implementation until accepted.
- [ADR-0051 Manager and Legacy Context](../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md) - draft context-map change; no implementation until accepted.
- [ADR-0052 People, Persona and Skills Context](../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context.md) - draft context-map change; no implementation until accepted.

## Rule

Implement from accepted ADRs and current implementation specs. Draft/proposed
ADRs are planning context classified by [[Documentation-V1]], not open gaps.
Superseded ADRs are historical only.
