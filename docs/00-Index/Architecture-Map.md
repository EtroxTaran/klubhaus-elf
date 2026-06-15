---
title: Architecture Map
status: current
tags: [architecture, meta]
created: 2026-05-16
updated: 2026-06-15
type: map
binding: false
related: [[Decision-Log]], [[Current-State]], [[MVP-Scope]], [[Documentation-V1]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../60-Research/player-contract-lifecycle-fsm-2026-06-03]], [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]], [[../60-Research/newsworthiness-event-publication-semantics-2026-06-04]], [[../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05]], [[../60-Research/player-discipline-sub-aggregate-2026-06-05]], [[../60-Research/opposition-template-ai-consumption-contract-2026-06-05]], [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]], [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]], [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]], [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]], [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]], [[../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract]], [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]], [[../10-Architecture/state-machines/player-discipline]]
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

- [[../10-Architecture/bounded-context-map]] - 28 ratified bounded contexts
  after ADR-0089. FMX-131 clarifies the League/Statistics standings seam:
  League Orchestration owns tie-break rules, official ordering and
  promotion/relegation/rollover outcomes; Statistics & Analytics owns
  projection-only standings history, leaders and analytics views. FMX-134
  prepares a pending ADR-0111 cleanup for the Rivalry -> CommercialPortfolio
  contract: recommended line is no `RivalryCommercialSignal`; CommercialPortfolio
  derives commercial interpretation from `RivalryTierTransitioned` /
  `DerbyContext(matchId)` through a local ACL/projection after Nico approval.
  FMX-156 prepares pending ADR-0102 cleanup for the Notification platform:
  inbox-first replay, Web Push/native push as best-effort accelerants and no
  package-pin ratification until dependency-currency/code phase.
  FMX-179 prepares pending ADR-0114 for the future workspace/package mapping:
  progressive one-context package catalog, real packages only and
  `@klubhaus-elf/*` namespace after Nico approval.
  FMX-164 accepts ADR-0119 for the command-reception replay/dedup seam:
  Offline Sync owns client queue/retry/rebase UX, while Audit & Security owns
  authoritative replay/dedup policy and processed-command state through a
  synchronous Command Reception capability before domain validation.
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
- [[../10-Architecture/state-machines/player-contract-lifecycle]]
- [[../10-Architecture/state-machines/player-discipline]]
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
- [ADR-0119 Command Reception Dedup Seam](../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam.md) - accepted FMX-164 seam: command replay/dedup is a synchronous Audit & Security-owned reception capability, not the client Offline Sync queue and not an outbox consumer.
- [ADR-0029 3D Presentation Layer](../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer.md)
- [ADR-0041 Presentation Renderer Strategy](../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy.md)
- [ADR-0043 Notification and Messaging Platform](../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform.md) - superseded historical Notification platform source decision.
- [ADR-0102 Notification Platform Re-ratification + Offline-delivery Clause](../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause.md) - draft FMX-156 successor proposal: keep ADR-0102 as ADR-0043 successor after Nico approval, use Postgres + Dexie inbox as authoritative replay surface and treat push/realtime/email as best-effort accelerants.
- [ADR-0050 Club Economy Accounting Ledger](../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger.md) - accepted Club Management finance ledger, accounting projections, country economy profiles, cup cash/receivable/forecast events, matchday operating-cost ledger events and staged insolvency boundary.
- [ADR-0058 Club Economy Commercial Impact Boundary](../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary.md) - accepted CommercialPortfolio boundary for ticketing, contracts, cup settlement, matchday operating-cost profiles, fan events and Investor entitlement policy.
- [ADR-0051 Manager and Legacy Context](../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md) - draft proposed Manager & Legacy context for manager identity, run analysis, archetype candidates and prestige/legacy selection.
- [ADR-0052 People, Persona and Skills Context](../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context.md) - draft proposed People context for actor personas, relationship graph, player/staff skill profiles and deterministic context cards.
- [ADR-0054 Narrative Context and AI Narration Framework](../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework.md) - draft proposed Narrative context for scene selection, context-card assembly, templates, fallback coverage manifest, validation, provenance, evals and provider adapter boundary; FMX-87 adds finite dialogue-intent/effect result planning contracts while effects stay with source domains.
- [ADR-0055 Tactics Context](../10-Architecture/09-Decisions/ADR-0055-tactics-context.md) - accepted Tactics context for tactic presets, set-piece routine variants, opposition templates, role/duty configurations, lock-time `TacticSnapshot` production and tactical-style signal aggregation.
- [ADR-0065 Narrative Media and Press Content Ownership](../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership.md) - draft proposed extension of ADR-0054: Narrative owns Press/Media content authoring, conference response trees, article publication policy, tone library, deterministic fallbacks and optional validated LLM paraphrase controls; Notification delivers and People supplies persona cards.
- [ADR-0117 Narrative Display Snapshot Replay Determinism Floor](../10-Architecture/09-Decisions/ADR-0117-narrative-display-snapshot-replay-determinism-floor.md) - accepted FMX-153 binding amendment: revisitable Template/LLM prose persists exact display snapshots and replays/reopens verbatim; match commentary remains Narrative display, not `MatchFrame` or match authority.
- [ADR-0073 Player Contract Lifecycle FSM](../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm.md) - proposed Squad & Player ownership of player-contract lifecycle truth; Transfer owns renewal/pre-contract/free-agent process cases; Regulations owns pre-contract/free-agent/work-permit verdicts.
- [ADR-0076 Narrative Newsworthiness Event Contracts](../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts.md) - proposed source-owned newsworthy event publication facets for Narrative consumption: injuries, contract expiry, board pressure, transfer rumours and ADR-0078/Squad & Player-owned suspensions.
- [ADR-0078 Player Discipline Suspension Contracts](../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts.md) - proposed Squad & Player-owned discipline sub-aggregate/process manager for card accumulation, suspension windows, straight-red appeals, eligibility and canonical `PlayerSuspended`; Match owns card facts and Regulations owns discipline profiles.
- [ADR-0080 Opposition-template AI Consumption Contract](../10-Architecture/09-Decisions/ADR-0080-opposition-template-ai-consumption-contract.md) - proposed Tactics-published `OppositionTemplateSelectedForMatchV1` contract: AI-management supplies planning context, Tactics selects from the catalog using `WorldAiMgmtRng`, Match freezes the event into `TacticSnapshot` at `lineup_locked`.
- [ADR-0081 Statistics & Analytics Read-Model Owner](../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner.md) - accepted projection-only owner for standings history/display projections, stat lines, match analytics, league leaders, versioned metric definitions, MVP Analytics Hub queries and immutable Manager & Legacy / HoF handoff snapshots; FMX-131 keeps official ordering and season rollover in League Orchestration.

## Current Binding Research and Specs

- [Postgres + Drizzle Integration](../30-Implementation/postgres-drizzle-integration.md)
- [Notification and Messaging Platform](../30-Implementation/notification-messaging-platform.md) - non-binding FMX-156 implementation overlay while ADR-0102 remains decision-pending.
- [Club Economy Accounting Ledger](../30-Implementation/club-economy-accounting-ledger.md) - draft implementation contracts for weekly ledger entries, economy read models and insolvency state.
- [Club Economy Commercial Contracts](../30-Implementation/club-economy-commercial-contracts.md) - draft contracts for fan demand, ticketing, commercial contracts, cup/competition revenue, matchday operating costs, fan events and Investor grants.
- [Hybrid-online PWA Strategy](../30-Implementation/hybrid-online-pwa-strategy.md)
- [PWA Offline Strategy](../30-Implementation/pwa-offline-strategy.md)
- [Match Engine Runtime Strategy](../60-Research/match-engine-runtime-strategy.md)
- [Swappable Spatial-Event Match Engine Research](../60-Research/swappable-spatial-event-match-engine-2026-05-27.md)
- [Manager Archetype Roguelite Research](../60-Research/manager-archetype-roguelite-2026-05-27.md)
- [Club Economy Impact Map and Commercial Contracts](../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28.md)
- [Cup and Competition Revenue Profiles](../60-Research/cup-and-competition-revenue-profiles-2026-05-28.md)
- [Matchday Operating Costs and Risk-Cost Settlement](../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29.md)
- [EOS Player, Staff, Skills and Personas Research](../60-Research/eos-player-staff-skills-and-personas-2026-05-28.md)
- [AI Narration Testing and Framework Research](../60-Research/ai-narration-testing-framework-2026-05-28.md)
- [Narrative Media and Press Content Ownership Research](../60-Research/narrative-content-bounded-context-2026-06-02.md)
- [AI Narration Scope Freeze and Fallback Coverage](../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04.md)
- [Newsworthiness Event-Publication Semantics](../60-Research/newsworthiness-event-publication-semantics-2026-06-04.md)
- [Dialogue Intent Taxonomy and Effect Matrix](../60-Research/dialogue-intent-taxonomy-effect-matrix-2026-06-05.md)
- [Player Discipline Sub-Aggregate](../60-Research/player-discipline-sub-aggregate-2026-06-05.md)
- [Opposition-template AI Consumption Contract](../60-Research/opposition-template-ai-consumption-contract-2026-06-05.md)
- [Statistics & Analytics Read-Model Owner](../60-Research/statistics-analytics-read-model-owner-2026-06-05.md)
- [Standings Authority - League vs Statistics](../60-Research/standings-authority-league-vs-statistics-2026-06-12.md)
- [Player Contract Lifecycle FSM Research](../60-Research/player-contract-lifecycle-fsm-2026-06-03.md)
- [AI Narration Contract Testing Framework](../30-Implementation/ai-narration-contract-testing-framework.md)
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
- [ADR-0114 Monorepo Workspace Bootstrap](../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap.md) - draft FMX-179 package-boundary and workspace scaffold proposal; no workspace/package convention is binding until Nico approves D1-D8.
- [ADR-0030 LLM Out Of Authoritative State Boundary](../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state.md) - draft Runtime-LLM re-evaluation for Broad Full Dialogue outside authoritative state; FMX-88 adds the fallback manifest, Article 50 gate and MVP no-export rule; FMX-87 clarifies mechanics consume selected finite intents, not generated prose; no implementation until accepted.
- [ADR-0051 Manager and Legacy Context](../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context.md) - draft context-map change; no implementation until accepted.
- [ADR-0052 People, Persona and Skills Context](../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context.md) - draft context-map change; no implementation until accepted.
- [ADR-0054 Narrative Context and AI Narration Framework](../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework.md) - draft context-map change plus FMX-87 dialogue-intent/effect-result planning contracts; no implementation until accepted.
- [ADR-0065 Narrative Media and Press Content Ownership](../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership.md) - draft extension of ADR-0054; no implementation until accepted.
- [ADR-0107 Pricing and IAP Monetization Boundary](../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary.md) - draft FMX-191 monetization boundary for classified entitlements, no-P2W invariant, provider separation and privacy/legal gates; pending Nico D1-D5, no implementation until accepted.
- [ADR-0108 No-Pay-to-Win and MP Fairness Invariant](../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant.md) - draft FMX-190 zero-effect invariant for real-money entitlements across shared saves, rankings, async groups, watch-party state, exports, official comparisons and future multiplayer; pending Nico D1-D5, no implementation until accepted.
- [ADR-0111 Rivalry Commercial Signal Contract Reconciliation](../10-Architecture/09-Decisions/ADR-0111-rivalry-commercial-signal-contract-reconciliation.md) - draft FMX-134 proposal to remove the orphan `RivalryCommercialSignal`, derive CommercialPortfolio policy from Rivalry facts through a local ACL/projection and keep fan-side `derby_factor` in Audience & Atmosphere; pending Nico D1-D3, no implementation until accepted.
- [ADR-0112 Age Assurance and Rating Evidence Posture](../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture.md) - draft FMX-185 proposal for the 16+ self-declaration gate, under-16 refusal/telemetry minimisation and IARC/USK evidence packet; pending Nico D1-D6 plus legal/store review, no implementation until accepted.

## Rule

Implement from accepted ADRs and current implementation specs. Draft/proposed
ADRs are planning context classified by [[Documentation-V1]], not open gaps.
Superseded ADRs are historical only.
