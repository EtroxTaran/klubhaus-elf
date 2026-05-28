---
title: Decision Log
status: current
tags: [adr]
created: 2026-05-15
updated: 2026-05-28
type: index
binding: true
related: [[Documentation-V1]], [[Current-State]], [[Architecture-Map]], [[../50-Game-Design/README]], [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
---

# Decision Log

> **2026-05-27 — All decisions reopened for re-evaluation.** Every ADR
> previously `accepted` was reset to `status: draft` (the implementation was
> removed and the design is being re-questioned with additional topics).
> **Nothing in this log is currently binding.** The Status column below now
> reads `draft`; ADRs will be re-ratified individually after review. Superseded
> ADRs stay superseded.

ADR index with status and lineage. Implement only from `accepted` ADRs or
`current binding` research/implementation notes explicitly promoted here or in
[[Documentation-V1]]. Draft/proposed ADRs are planning context only.

ADRs decide how the game is built. Game-design notes and GDDRs in
[[../50-Game-Design/README]] decide how the game works. ADRs must not
contradict an `approved` game-design record.

## ADRs (reopened to draft 2026-05-27)

| ADR | Status | Decision | Lineage |
|---|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] | draft | Historical deterministic TypeScript match-engine target; reopened and superseded as planning target by ADR-0049. | Superseded by draft ADR-0049 if ratified. |
| [[../10-Architecture/09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] | draft | Swappable server-authoritative spatial-event match engine; TS-vs-Rust spike with Rust-native default. | Supersedes ADR-0003 as proposed target. |
| [[../10-Architecture/09-Decisions/ADR-0005-save-format]] | draft | Encrypted save/export envelope, versioning, RNG state snapshot. | Current; timing amended by ADR-0020. |
| [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] | draft | IP-clean naming and data generation. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]] | draft | Agent and Cursor orchestration. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0010-design-system]] | draft | Design system and Storybook showcase as UI source. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]] | draft | Server authority for multiplayer state. | Current; post-MVP MP constraints. |
| [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]] | draft | OpenTelemetry, Loki, Prometheus, Grafana, Alloy and GlitchTip profile. | Tempo/Mimir deferred 2026-05-19. |
| [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]] | draft | Domain-owned policies coordinated by deterministic orchestration. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] | draft | Service-ready modular monolith with 11 bounded contexts. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] | draft | Hybrid-online MVP, offline-ready architecture. | Supersedes ADR-0002 for MVP scope. |
| [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]] | draft | PostgreSQL + Drizzle system of record, SurrealDB deferred, Zustand v5, Zod 4, all-in TanStack data layer. | Supersedes ADR-0001. |
| [[../10-Architecture/09-Decisions/ADR-0022-animation-game-feel]] | draft | Motion + GSAP + Tailwind micro-states. | Amends old minimal-keyframes stance. |
| [[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]] | draft | RealtimeTransport abstraction; SSE MVP, Centrifugo planned. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]] | draft | MatchRenderer abstraction; Canvas 2D first. | Amended by ADR-0041; PixiJS no longer planned. |
| [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]] | draft | Responsive PWA source of truth, planned thin Capacitor shell. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]] | draft | Engine/renderer frame contract in `packages/match-contract`. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] | draft | PostgreSQL schema-per-save, Drizzle source of truth, lazy migrations, opaque UUID refs. | Supersedes ADR-0004. |
| [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]] | draft | Same-Postgres-transaction outbox, polling floor plus `LISTEN/NOTIFY`, partitioned archive. | Supersedes ADR-0013. |
| [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]] | draft | Post-MVP non-authoritative Three/R3F presentation scenes. | Tightened by ADR-0041. |
| [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] | draft | Runtime LLM may be evaluated only outside authoritative state; 2026-05-28 draft target expands to Full Dialogue plus async flavour, OpenRouter behind adapter, no generated prose feeds mechanics. | New 2026-05-27; amended 2026-05-28 for Full Dialogue MVP direction. |
| [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]] | draft | MVP Text & Stats + Canvas 2D; optional post-MVP Three/R3F presentation scenes only. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]] | draft | First-party Notification bounded context; Postgres durable truth, SurrealDB projection, Dexie offline mirror, Brevo/Mailjet email, Web Push/native push prepared. | Amends ADR-0021/0023/0028 for notification delivery. |
| [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]] | draft | Babylon.js = optional 3D/iso presentation engine (replaces Three.js/R3F) behind the unchanged SceneDescriptor/CapabilityGate; match render stays Canvas 2D. | New 2026-05-27; amends ADR-0029 §2 + ADR-0041. |
| [[../10-Architecture/09-Decisions/ADR-0048-design-update-and-migration-path]] | draft | Design-update/migration path: token single-source (wiki+app derive), versioned snapshots, diff-driven sync, one current truth, supersede for breaking changes; each update = issue+PR+auto-merge. | New 2026-05-27; amends ADR-0010. |
| [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] | draft | Club Management owns the weekly finance ledger, full-accounting projections, budget envelopes, country economy profiles and staged insolvency state. | New FMX-13 draft; feeds economy MVP pillar. |
| [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] | accepted | Manager & Legacy context owns manager identity, run analysis, style signals, archetype candidates, legacy setup and prestige selection; cross-save meta read only at save creation, never during a running save. | New FMX-16 draft; FMX-25 ratification dossier; **ratified Nico 2026-05-28 (FMX-35 apply)**: Manager & Legacy is the 12th bounded context. [[../60-Research/manager-legacy-bounded-context-2026-05-28]] is the decision basis. |
| [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] | draft | Proposed People / Persona & Skills context owns actor personas, relationship graph, player/staff skill profiles and deterministic dialogue context cards. | New FMX-23 draft; feeds EOS player skills/persona planning. |
| [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]] | accepted | Staff Operations context (13th) owns staff contract lifecycle, role assignment, pipeline coverage, wage schedule and specialisation metadata; emits wage events to Club Management's ledger; consumes People (ADR-0052) for actor identity when ratified. | New FMX-26 draft; **ratified Nico 2026-05-28 (FMX-36 apply)**: Staff Operations is the 13th bounded context. [[../60-Research/staff-backroom-bounded-context-2026-05-28]] is the decision basis. |
| [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] | accepted | Tactics context (14th) owns tactic presets, set-piece routine variants, opposition templates, role/duty configurations and tactical-style signal aggregation; produces TacticSnapshot at Match lock-time (canonical Reference + Snapshot); consumes Staff Operations Set-Piece-Coach effect-readiness; emits TacticalIdentityFingerprint to Manager & Legacy. | New FMX-28 draft; **ratified Nico 2026-05-28 (FMX-37 apply)**: Tactics is the 14th bounded context. [[../60-Research/tactics-persistence-bounded-context-2026-05-28]] is the decision basis. |
| [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]] | accepted | Regulations & Compliance context (15th) owns the versioned multi-regulator rule catalog (UEFA-analogue / national league / national association), transfer-window FSM, work-permit catalog, sanction catalog and licence-tier facility requirements; exposes Open Host Service + Published Language consumed by Transfer / Squad / Club / League / Staff / Match / Community Overlay; multi-context eligibility chain runs as Process Manager / Saga in the consuming BC. IP-clean rule terminology hardline contained in one context per GD-0015 + ADR-0007. | New FMX-30 draft; **ratified Nico 2026-05-28 (FMX-39 apply)**: Regulations & Compliance is the 15th bounded context. [[../60-Research/regulations-compliance-bounded-context-2026-05-28]] is the decision basis. `risk:legal` label set. |
| [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] | draft | Proposed Narrative context owns scene selection, context-card assembly, fallback templates, validation, provenance, eval corpus, provider adapter boundary and Playtest First evidence. | New FMX-3 draft; complements ADR-0030 and feeds AI Narration MVP pillar. |

## Process & Workflow ADRs (proposed 2026-05-27, draft)

These decide *how the team works* (CI/CD, merge, agent workflow, scaling), not how the
game is built. Draft until ratified.

| ADR | Status | Decision | Lineage |
|---|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]] | draft | Portable pipeline (check logic in repo scripts, thin CI) + auto-merge-when-green (docs: no review; code: CODEOWNER review); `Closes` ⇒ issue Done. | New; updates the "only Nico merges" stance. |
| [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]] | draft | One issue ↔ one git worktree ↔ one branch per agent session; no work without an issue (override = Nico command). | New. |
| [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]] | draft | Future-scope: Lead Architect + Domain Leads, CODEOWNERS-by-domain, activates when the 2nd lead joins. | New; future-scope. |

## Superseded ADRs

| ADR | Superseded by | Handling |
|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] | ADR-0021 | Historical SurrealDB-primary / React-Context / minimal-keyframes stance. Do not implement. |
| [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] | ADR-0020 for MVP scope | Historical full offline-first MVP posture. Do not implement as MVP authority. |
| [[../10-Architecture/09-Decisions/ADR-0004-data-model]] | ADR-0027 | Historical SurrealDB-specific data model. Substrate-agnostic invariants carried forward. |
| [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]] | ADR-0028 | Historical SurrealDB + Redis Streams outbox substrate. Pattern carried forward. |

## Classified Draft / Future-Scope ADRs

These are non-binding until promoted by owner decision and updated in the same
PR as the work that needs them.

| ADR | V1 classification | Handling |
|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0006-i18n]] | Future-scope depth pass | Promote when i18n implementation starts. |
| [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] | Covered by design-system/a11y baseline | Use design-system docs and approved UX notes; promote only for cleanup or new mobile delivery/UI decisions. |
| [[../10-Architecture/09-Decisions/ADR-0012-async-cadence-models]] | Product rules already approved | Implement cadence from game-design notes; ADR promotion is optional cleanup. |
| [[../10-Architecture/09-Decisions/ADR-0014-state-machines]] | Future runtime-orchestration decision | Promote before changing league/week, transfer, watch-party or match state orchestration. |
| [[../10-Architecture/09-Decisions/ADR-0015-spectator-snapshot-streaming]] | Post-MVP social layer | Keep behind watch-party gate. |
| [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]] | Future UGC/data governance | Do not host or execute untrusted packs until moderation/security gates exist. |

## Current Binding Non-ADR Inputs

- [[../30-Implementation/postgres-drizzle-integration]] - implementation spec for ADR-0027/0028.
- [[../30-Implementation/notification-messaging-platform]] - implementation spec for ADR-0043 notification, messaging, delivery and provider boundaries.
- [[../30-Implementation/hybrid-online-pwa-strategy]] - implementation stance for ADR-0020.
- [[../60-Research/match-engine-runtime-strategy]] - reopened runtime strategy: swappable runtime spike with Rust-native default candidate.
- [[../60-Research/swappable-spatial-event-match-engine-2026-05-27]] - FMX-10 synthesis for engine exchangeability, spatial-event model, runtime spike, OSS due diligence, disconnect/offline and LLM ticker boundaries.
- [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]] - FMX-3 synthesis for AI narration as an MVP pillar, Full Dialogue, All Active actor context, OpenRouter/provider gates and compliance/testing requirements.
- [[../60-Research/ai-narration-testing-framework-2026-05-28]] - FMX-3 synthesis for Narrative context ownership, contract/eval corpus design, Playtest First quality loop and LLM safety testing framework.
- [[../30-Implementation/ai-narration-contract-testing-framework]] - draft implementation framework for Narrative contracts, test tiers, eval corpus, safety gates and playtest feedback loops.
- [[../60-Research/club-economy-blueprint-2026-05-27]] - FMX-13 synthesis for the Club Economy MVP pillar, weekly ledger, full accounting, staged insolvency, country economy profiles and investor future-scope.
- [[../60-Research/manager-archetype-roguelite-2026-05-27]] - FMX-16 synthesis for Manager-Archetype Roguelite progression, MVP run-analysis hooks, proposed Manager & Legacy context, playtest-tunable taxonomy and prestige counterweight.
- [[../60-Research/manager-legacy-bounded-context-2026-05-28]] - FMX-25 ratification synthesis for ADR-0051; consolidates roguelite-genre, DDD and football-sim evidence; recommends Accept (Option A).
- [[../60-Research/staff-backroom-bounded-context-2026-05-28]] - FMX-26 ownership synthesis for staff lifecycle, role assignment, pipeline coverage and wage-event emission; recommends Option B (Staff Operations as own bounded context, ADR-0053 proposed).
- [[../60-Research/tactics-persistence-bounded-context-2026-05-28]] - FMX-28 ownership synthesis for the tactics library (presets, set-piece routines, opposition templates, role/duty configurations); recommends Option C (Tactics as own bounded context, ADR-0055 proposed).
- [[../60-Research/regulations-compliance-bounded-context-2026-05-28]] - FMX-30 ownership synthesis for the regulatory rule catalog (FFP/SCR/PSR, work permits / GBE, home-grown quotas, transfer windows, license-tier facilities, sanction catalog); recommends Option B (Regulations & Compliance as own bounded context, ADR-0056 proposed). Canonical Vernon Tax-catalog pattern with Open Host Service + Published Language + Process Manager / Saga for multi-context eligibility chains.
- [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]] - FMX-23 synthesis for player skills/perks, staff-skill target model, mixed OCEAN + football-domain personas, relationship constellations and proposed People context.
- [[../60-Research/presentation-renderer-strategy]] - research basis for ADR-0041.
- [[../60-Research/determinism-and-replay]] - deterministic simulation and replay rules.
- [[../60-Research/performance-budgets]] - device, bundle, memory, storage and match-render budgets.
- [[../60-Research/threat-model]] - binding security reference.
- [[../60-Research/gdpr-compliance]] and [[../30-Implementation/privacy-and-consent]] - GDPR/ePrivacy posture and implementation surface.
- [[../30-Implementation/auth-flows]], [[../30-Implementation/session-management]], [[../30-Implementation/account-recovery]], [[../30-Implementation/rate-limiting-anti-abuse]], [[../30-Implementation/secrets-management]] - current security/ops specs.

## Rule

If a current implementation need is not covered by a current binding ADR,
approved GDDR, current implementation spec or [[Documentation-V1]], open a gap
and escalate before implementation.
