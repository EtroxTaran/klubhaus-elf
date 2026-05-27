---
title: Decision Log
status: current
tags: [adr]
created: 2026-05-15
updated: 2026-05-27
type: index
binding: true
related: [[Documentation-V1]], [[Current-State]], [[Architecture-Map]], [[../50-Game-Design/README]]
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
| [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] | draft | Deterministic TypeScript match engine, event-first simulation, replay contracts. | Current. |
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
| [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]] | draft | Runtime LLM may be evaluated only outside authoritative state; async narrative flavour candidate, OpenRouter behind adapter, no generated prose feeds mechanics. | New 2026-05-27; reopens Runtime-LLM MVP question as a draft only. |
| [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]] | draft | MVP Text & Stats + Canvas 2D; optional post-MVP Three/R3F presentation scenes only. | Current. |
| [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]] | draft | First-party Notification bounded context; Postgres durable truth, SurrealDB projection, Dexie offline mirror, Brevo/Mailjet email, Web Push/native push prepared. | Amends ADR-0021/0023/0028 for notification delivery. |

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
- [[../60-Research/match-engine-runtime-strategy]] - TypeScript MVP engine and post-MVP extraction gate.
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
