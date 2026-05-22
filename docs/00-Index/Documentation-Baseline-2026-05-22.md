---
title: Documentation Baseline 2026-05-22
status: superseded
tags: [meta, baseline, gap-closure, architecture, research]
created: 2026-05-22
updated: 2026-05-22
type: baseline
binding: false
superseded_by: [[Documentation-V1]]
related:
  - [[Current-State]]
  - [[Decision-Log]]
  - [[Research-Map]]
  - [[Documentation-V1]]
  - [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  - [[../60-Research/pre-mortem/findings-registry]]
---

# Documentation Baseline 2026-05-22

> **SUPERSEDED on 2026-05-22 by [[Documentation-V1]].**
> Old way: this note was the temporal/structural closure baseline. New way:
> [[Documentation-V1]] is the single V1 documentation baseline. Kept for history
> - do not implement from this note.

This note is the canonical temporal and structural baseline for the vault as of
2026-05-22. It closes the documentation-level gap work that was previously
spread across Wave 2, Wave 3 and the 2026-05-20 pre-mortem cluster.

## Baseline Statement

As of 2026-05-22, there are no known undocumented or unclassified gaps in the
project documentation.

Every visible unresolved item in the vault must be interpreted through this
baseline:

| Class | Meaning | Implementation authority |
|---|---|---|
| `current`, `accepted`, `approved` | Current binding knowledge. | Implementable. |
| `mitigated` | Research/concept solution exists; verification remains downstream. | Implement from the linked ADR/GDDR/spec when binding. |
| `verified` | Evidence exists through code, tests, drills, legal sign-off or production telemetry. | Implementable and evidence-backed. |
| `accepted-risk` | Deliberate non-MVP or gated risk. | Do not implement until the gate passes. |
| `draft`, `proposal`, `proposed` | Future-scope intent, historical planning, or non-binding option set. | Not an open gap; promote by explicit owner decision before implementation. |
| `superseded`, `archived` | Historical record only. | Do not implement from it. |

Old `Future-scope notes` sections in draft or historical notes are not active work
unless they are re-listed in this baseline, [[Current-State]], an accepted ADR,
an approved GDDR, or a current implementation spec.

## Temporal Model

The vault now uses five temporal layers:

| Layer | Window | Purpose | Examples |
|---|---|---|---|
| MVP Binding | Now through first playable | What agents may implement today. | [[MVP-Scope]], accepted ADRs, approved GDDRs, current implementation specs. |
| Pre-Launch Hardening | Before public launch | Required launch controls and evidence. | Security drills, restore drills, accessibility checks, legal review, SBOM and CRA reporting path. |
| Post-MVP Planned | After first playable | Additive features already reserved by architecture. | Selective offline authority, export/import UI, Manage-a-Club Career, richer multiplayer surfaces. |
| Future-Scope Gate | Only after explicit trigger | High-risk or costly options. | BYOC / distributed match compute, runtime LLMs, community pack hosting, extracted services. |
| Historical Memory | Always read-only | Why earlier options existed. | Superseded ADRs, Wave 2 and Wave 3 backlog documents, raw research transcripts. |

## Structural Coverage

The project documentation is considered complete for current planning because
each major concern has a canonical entry point and a binding/non-binding rule:

| Concern | Canonical entry | Status |
|---|---|---|
| Product direction | [[Project-Goals]], [[MVP-Scope]], [[Current-State]] | Covered. |
| Architecture | [[Decision-Log]], [[Architecture-Map]], accepted ADRs | Covered. |
| DDD boundaries | [[../10-Architecture/bounded-context-map]], ADR-0019, ADR-0027 | Covered. |
| Data and persistence | ADR-0021, ADR-0027, ADR-0028, [[../30-Implementation/postgres-drizzle-integration]] | Covered. |
| PWA and offline posture | ADR-0020, [[../30-Implementation/hybrid-online-pwa-strategy]], [[../30-Implementation/pwa-offline-strategy]] | Covered. |
| Security and privacy | [[../60-Research/threat-model]], auth/session/recovery/privacy/rate-limit specs | Covered. |
| Game design | [[../50-Game-Design/README]], approved GDDRs and current system notes | Covered. |
| Feature planning | [[Feature-Map]], [[../20-Features/README]] | Covered for MVP; future stubs are intentional. |
| Research and risk | [[Research-Map]], [[../60-Research/00-summary]], pre-mortem registry | Covered; all pre-mortem findings are concept-closed or accepted-risk. |
| Implementation process | [[Implementation-Map]], workflow and Linear docs | Covered. |
| Compliance and launch duties | Gap closure concept, privacy, accessibility, OSS, CRA/DSA/EAA notes | Covered at concept level; evidence gates remain before launch. |

## State-of-the-Art Baseline

The current architecture stance is intentionally modern but conservative enough
to remain implementable by small agents and a small team:

- TanStack Start/Router/Query as the app and data-fetching spine.
- TypeScript strict, Zod 4 validation, Biome, Vitest and Playwright as default
  engineering quality gates.
- PostgreSQL + Drizzle as the system-of-record path; SurrealDB is deferred to
  an additive realtime/graph role behind an interface.
- Domain-driven modular monolith before service extraction.
- Deterministic simulation contracts, golden/statistical tests and explicit RNG
  streams before any multiplayer or BYOC expansion.
- IndexedDB/Dexie for browser-side game caches, drafts and future local saves;
  no localStorage for game state.
- WCAG 2.2 AA / EAA / BFSG accessibility requirements treated as product
  requirements, not polish.
- OWASP ASVS/API/SCVS, NIST 800-63, SBOM, vulnerability reporting and signed
  release provenance treated as launch infrastructure.
- Legal and brand safety are product architecture constraints: IP-clean content,
  DSA notice-and-action path, no club/logo/player-name dependency and rebrand
  before public launch.

## Differentiation Baseline

The concept differentiates from contemporary football managers by combining:

- IP-clean fictional world generation instead of real-club license dependence.
- Create-a-Club Roguelite as first playable rather than a clone of long-form
  real-league career mode.
- Impact Lens and contextual squad decisions instead of a universal OVR number.
- Offline-ready PWA ergonomics with explicit trust levels for future multiplayer.
- Deterministic, inspectable simulation and replayability instead of opaque
  black-box match outcomes.
- Progressive disclosure so casual, standard and expert players share one
  system without three separate games.
- Compliance, accessibility and supply-chain posture built before launch instead
  of retrofitted after traction.

## Decision Register

The following historical open items are no longer active documentation gaps.
They are classified here for future agents:

| Former item | 2026-05-22 classification | Current handling |
|---|---|---|
| Wave 3 backlog `A-L` | Superseded planning backlog. | Use this baseline, maps and current specs instead. |
| ADR-0006 i18n | Future-scope ADR depth pass. | i18n/l10n risks concept-closed by pre-mortem ST-09; promote when implementation starts. |
| ADR-0008 mobile-first UI | Covered by design-system and accessibility baseline; ADR remains historical draft. | Implement from design system, Current-State and approved UX notes. |
| ADR-0012 async cadence | Product rules already approved in async multiplayer GDDR. | ADR promotion is optional cleanup, not a blocker. |
| ADR-0014 state machines | Architecture intent covered by state-machine notes and deterministic simulation baseline. | Promote before changing runtime orchestration. |
| ADR-0015 spectator snapshots | Post-MVP social layer. | Not MVP; keep behind watch-party gate. |
| ADR-0016 community datasets | Future-scope community pack governance. | Do not host or execute untrusted packs until moderation/security gates are implemented. |
| GD-0002 / GD-0010 draft flags | Historical GDDR status mismatch. | Current match-engine and AI manager notes are binding; promote GDDRs only as cleanup. |
| Feature stubs | Future-scope placeholders. | MVP implementation uses the approved Roguelite feature spec plus accepted ADRs/GDDRs. |
| Pre-mortem findings | Concept-closed or accepted-risk. | Track evidence through downstream issues, tests, runbooks and release gates. |
| BYOC / distributed match compute | Accepted-risk future-scope. | Requires decision gate before design or implementation. |

## Closure Rule

A future gap may be opened only when at least one of these is true:

1. A current/accepted/approved document contradicts another current/accepted/
   approved document.
2. Implementation needs a decision that is not classified in this baseline or a
   linked binding note.
3. A regulatory, security, platform or market fact changes after 2026-05-22.
4. A draft/proposed idea is promoted into MVP or launch scope.

When a new gap is opened, update [[Current-State]], the relevant map and the
source note in the same PR. Otherwise, treat old open-question text as historical
context, not active work.
