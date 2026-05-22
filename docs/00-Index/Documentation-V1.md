---
title: Documentation V1 Baseline
status: current
tags: [meta, baseline, v1, planning, architecture]
created: 2026-05-22
updated: 2026-05-22
type: baseline
binding: true
supersedes: Documentation-Baseline-2026-05-22
related:
  - [[Agent-Onboarding]]
  - [[Current-State]]
  - [[Decision-Log]]
  - [[MVP-Scope]]
  - [[Architecture-Map]]
  - [[Game-Design-Map]]
  - [[Feature-Map]]
  - [[Research-Map]]
  - [[Implementation-Map]]
  - [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
---

# Documentation V1 Baseline

This note is the single V1 reference point for the project documentation as of
2026-05-22. It consolidates the latest planning, architecture, game-design,
research and pre-mortem decisions into one operating baseline for future agents
and human review.

The project is still in the planning and architecture phase. That makes V1 a
clean baseline, not a release freeze: future decisions may change it, but only
through an explicit ADR/GDDR/spec update plus the same index updates described
below.

## 1. Authority

Use this note to classify documentation state. Use the linked source notes for
implementation detail.

| Layer | Authority |
|---|---|
| Product scope | [[MVP-Scope]], [[Current-State]], [[Project-Goals]] |
| Architecture | [[Decision-Log]], [[Architecture-Map]], accepted ADRs |
| DDD boundaries | [[../10-Architecture/bounded-context-map]], ADR-0019, ADR-0027 |
| Game design | [[../50-Game-Design/README]], approved GDDRs and approved/current system notes |
| Feature work | [[Feature-Map]], current/approved feature specs |
| Research and risk | [[Research-Map]], [[../60-Research/00-summary]], pre-mortem registry |
| Implementation process | [[Implementation-Map]], [[../30-Implementation/agent-workflow-pattern]], Linear docs |

If two `current` / `accepted` / `approved` notes conflict, that is a stop
condition. Do not average the answers and do not implement around the conflict.

## 2. Status Model

| Status/class | Meaning | Implementation authority |
|---|---|---|
| `current`, `accepted`, `approved` | Current binding knowledge. | Implementable. |
| `current binding` | Binding research or implementation note explicitly promoted by the maps or Decision Log. | Implementable when it does not contradict an accepted ADR/GDDR. |
| `mitigated` | Research/concept solution exists; implementation evidence remains downstream. | Implement from the linked binding ADR/GDDR/spec, not from the finding itself. |
| `verified` | Evidence exists through code, tests, drills, legal sign-off or production telemetry. | Implementable and evidence-backed. |
| `accepted-risk` | Deliberate non-MVP or gated risk. | Do not implement until the gate passes. |
| `draft`, `proposal`, `proposed`, `idea` | Intent and planning context. | Read for direction; do not implement directly. |
| `superseded`, `archived` | Historical record only. | Never implement from it. |

Old `Future-scope notes`, draft TODOs, old gap reports and session notes are not
active work unless they are re-opened by this baseline, [[Current-State]], an
accepted ADR, an approved GDDR, a current implementation spec or a current
Linear beat.

## 3. Temporal Model

| Layer | Window | Purpose | Examples |
|---|---|---|---|
| MVP Binding | Now through first playable | What agents may implement today. | Create-a-Club Roguelite, hybrid-online/offline-ready PWA, accepted ADRs, approved GDDRs. |
| Pre-Launch Hardening | Before public launch | Required launch controls and evidence. | Restore drills, security drills, accessibility checks, legal review, SBOM/CRA path. |
| Post-MVP Planned | After first playable | Additive features already reserved by architecture. | Selective offline authority, export/import UI, Manage-a-Club Career, richer MP surfaces. |
| Future-Scope Gate | Only after explicit trigger | High-risk or costly options. | BYOC/distributed match compute, runtime LLMs, community pack hosting, extracted services. |
| Historical Memory | Always read-only | Why earlier options existed. | Superseded ADRs, archived Wave 2/3 reports, raw research transcripts. |

## 4. V1 Binding Facts

### Product and MVP

- The MVP is a hybrid-online, offline-ready PWA.
- The first playable mode is [[../50-Game-Design/mode-create-a-club-roguelite|Create-a-Club Roguelite]].
- [[../50-Game-Design/mode-manage-a-club-career|Manage-a-Club Career]] is visible as a future promise, not playable in MVP.
- Server-confirmed progression is the MVP authority model.
- Offline in MVP means app shell, safe cached reads, local drafts and local UI
  state. Full selective offline authority is post-MVP.
- Export/import is post-MVP user-facing functionality, with versioning and
  envelope contracts reserved from day one.
- German is the primary UI language; English remains a documentation and
  implementation working language where already established.
- User-facing docs are output documentation, not implementation specs.

### Architecture

- TanStack Start/Router, React, TypeScript strict, Tailwind, shadcn/ui, Biome,
  Vitest, Playwright and pnpm remain the app foundation.
- PostgreSQL + Drizzle is the system-of-record path per ADR-0021, ADR-0027 and
  ADR-0028.
- SurrealDB is no longer the primary substrate. It is deferred to an optional
  additive realtime/graph role behind an interface.
- The project uses a service-ready DDD modular monolith before service
  extraction.
- Database access goes through the project DB client/query gateway; queries are
  parameterized and scoped.
- Browser-side game caches, drafts, local UI state and future local saves live
  in IndexedDB via Dexie. No game state in localStorage.
- Server-only secrets stay behind server functions or server-only modules.

### Data, Persistence and Outbox

- Per-save persistence uses PostgreSQL schema-per-save:
  `public` for platform data and `save_<uuidv7hex>` for each save.
- Drizzle schema definitions are the source of truth; generated SQL and Zod
  mirrors must not drift.
- Save migrations are lazy on save-open through `QueryGateway.withSave`.
- Cross-context references use branded opaque UUIDs; no cross-context Drizzle
  `references()` boundaries.
- Relationship edges are modelled with junction tables and surrogate UUIDv7
  primary keys.
- Simulation numerics are integer/basis-point first.
- Transactional outbox is same-Postgres-transaction with polling as correctness
  floor and `LISTEN/NOTIFY` as latency hint; fan-out goes through the realtime
  transport abstraction.

### Match, Simulation and Presentation

- The match engine is deterministic, framework-agnostic TypeScript at MVP.
- Replays depend on seed, lineups, tactics, engine version and event logs where
  human involvement requires audit/fast UI.
- Match output is event-first. Renderer frames are derived, not persisted.
- MVP match presentation is Text & Stats plus Canvas 2D.
- There is no interactive or authoritative browser 3D match view.
- Optional post-MVP 2.5D/3D presentation scenes are non-authoritative,
  lazy-loaded, fallback-safe and use Three.js + React Three Fiber only unless a
  future ADR supersedes this.

### UX and Design System

- The design system is the only visual implementation source.
- Before UI work, agents read [[../10-Architecture/09-Design-System]] and use
  the Storybook showcase as visual reference.
- Progressive Disclosure has three tiers: Quick, Standard and Expert.
- Player strength presentation uses Impact Lens and contextual projections.
  There is no global OVR and no universal star rating.
- Accessibility is a product requirement: WCAG 2.2 AA / EAA / BFSG hardening is
  pre-launch evidence, not polish.

### Security, Privacy and Compliance

- The threat model is binding for current security architecture.
- Auth is passkey-first with password fallback, opaque sessions, refresh-token
  rotation, CSRF defence, Argon2id password storage and step-up MFA for
  sensitive operations.
- Account recovery uses a stable inner master key and versioned envelopes.
- GDPR/ePrivacy posture is concept-closed for MVP scope: no cookie banner at
  MVP when storage remains strictly necessary; DSAR/export/delete/restrict flows
  are implementation requirements before public launch.
- Pre-launch hardening must produce evidence for restore drills, breach
  notification, dependency audits, SBOM/provenance, accessibility and legal
  review.
- Regulatory dates and current legal obligations are tracked in
  [[Current-State]] and the pre-mortem registry.

### Research and Risk

- Pre-mortem findings are concept-closed as `mitigated` or explicitly
  `accepted-risk` for BYOC.
- `verified` remains reserved for implementation evidence: tests, drills, legal
  sign-off, release artifacts or production telemetry.
- BYOC/distributed match compute stays future-scope until its explicit decision
  gate passes.
- Runtime LLMs, image upload, free-form chat, lootboxes and daily login streaks
  are not MVP scope.

## 5. Decision Disposition

| Former item | V1 classification | Current handling |
|---|---|---|
| Wave 2 / Wave 3 gap backlogs | Superseded planning backlogs. | Use this V1 baseline, maps and current specs. |
| Archived gap reports | Historical memory. | Traceability only under `docs/95-Archive/gap-reports/`. |
| ADR-0001 | Superseded by ADR-0021. | Do not implement old SurrealDB-primary / React-Context / minimal-keyframes stance. |
| ADR-0002 | Superseded by ADR-0020 for MVP. | Full offline-first authority is post-MVP. |
| ADR-0004 | Superseded by ADR-0027. | Use PostgreSQL + Drizzle schema-per-save data model. |
| ADR-0013 | Superseded by ADR-0028. | Use same-Postgres-transaction outbox. |
| ADR-0006 | Future-scope depth pass. | Promote when i18n implementation starts. |
| ADR-0008 | Covered by design-system/a11y baseline. | Promote only for cleanup or new mobile UI decisions. |
| ADR-0012 | Product rules already approved. | Optional ADR cleanup; cadence implementation follows game-design notes. |
| ADR-0014 | Future runtime-orchestration decision. | Promote before changing league/week, transfer, watch-party or match orchestration. |
| ADR-0015 | Post-MVP social layer. | Keep behind watch-party gate. |
| ADR-0016 | Future UGC/data governance. | Do not host or execute untrusted packs until moderation/security gates exist. |
| Feature stubs | Future-scope planning unless approved/current. | MVP implementation starts from approved Roguelite feature spec. |
| Draft GDDRs | Intent layer. | Read for context; implement only after approval or explicit current binding promotion. |
| BYOC/distributed match compute | Accepted-risk future-scope. | Requires the documented gate before design or implementation. |

## 6. Operating Rules After V1

Every new architecture, scope, gameplay, operations or user-facing behavior
change updates the vault in the same PR:

1. Update [[Current-State]] for hot context.
2. Update the source note: ADR, GDDR, feature spec, implementation spec or
   research note.
3. Update the relevant map/index page.
4. If a prior note is replaced, mark it `superseded`, add two-way links and add
   the supersession banner.
5. If the work is substantial, add a session handoff under
   `docs/40-Execution/session-handoffs/`.

Agents must not create implementation work from chat history, archived reports
or draft notes when a current/accepted/approved source exists.

## 7. Reopening a Gap

A new documentation or architecture gap may be opened only when at least one of
these is true:

1. Two current/accepted/approved notes contradict each other.
2. Implementation needs a decision not classified by this baseline or a linked
   binding note.
3. A regulatory, security, platform or market fact changes after 2026-05-22.
4. A draft/proposed idea is promoted into MVP or launch scope.

When a gap is opened, update [[Current-State]], the relevant map and the source
note in the same PR. Otherwise, old open-question text remains historical
context.

## 8. Related

- [[Agent-Onboarding]]
- [[Current-State]]
- [[Decision-Log]]
- [[MVP-Scope]]
- [[Architecture-Map]]
- [[Game-Design-Map]]
- [[Feature-Map]]
- [[Research-Map]]
- [[Implementation-Map]]
- [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
