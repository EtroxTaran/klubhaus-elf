---
title: Solution Strategy
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-27
type: arch
related: [[01-Introduction]], [[02-Constraints]], [[05-Building-Blocks]], [[09-Decisions/ADR-0001-tech-stack]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[../00-Index/MVP-Scope]]
---

# Solution Strategy

Build a modular pnpm workspace:

- `apps/web`: TanStack Start PWA and server functions.
- Match engine adapter: deterministic simulation behind `MatchEnginePort`,
  isolated from React, DB, UI rendering and LLM code. The concrete runtime is
  selected by the ADR-0049 TS-vs-Rust spike.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: standalone, zero-dependency Zod validation mirror
  generated from the Drizzle schema ([[09-Decisions/ADR-0027-postgres-data-model]]).
- `packages/ui`: shared UI primitives/components.

MVP runtime strategy:

- Create-a-Club Roguelite first playable.
- Server-confirmed commands own authoritative progression.
- Match results are server-confirmed in MVP; local client adapters are preview
  or future selective-offline surfaces unless a later ADR/GDDR promotes them.
- Dexie / IndexedDB stores cached read models, drafts and local UI state.
- Contracts remain versioned and storage-adapter-friendly so selective
  offline-first singleplayer can be added later.

## Related

- [[05-Building-Blocks]] — module map (hub) · [[09-Decisions/ADR-0001-tech-stack]] — stack decision
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — MVP runtime staging · [[09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] — match-engine replacement boundary · [[../00-Index/MVP-Scope]] — scope
- Modules: [[modules/web]] · [[modules/match-engine]] · [[modules/game-data]] · [[modules/db-schema]] · [[modules/ui]]
- [[01-Introduction]] · [[02-Constraints]] — arc42 siblings
