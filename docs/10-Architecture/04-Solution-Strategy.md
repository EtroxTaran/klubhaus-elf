---
title: Solution Strategy
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-22
type: architecture
binding: false
related:
  - [[01-Introduction]]
  - [[02-Constraints]]
  - [[05-Building-Blocks]]
  - [[09-Decisions/ADR-0001-tech-stack]]
  - [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../00-Index/MVP-Scope]]
---

# Solution Strategy

Build a modular pnpm workspace:

- `apps/web`: TanStack Start PWA and server functions.
- `packages/match-engine`: deterministic simulation without React dependencies.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: standalone, zero-dependency Zod validation mirror
  generated from the Drizzle schema ([[09-Decisions/ADR-0027-postgres-data-model]]).
- `packages/ui`: shared UI primitives/components.

MVP runtime strategy:

- Create-a-Club Roguelite first playable.
- Server-confirmed commands own authoritative progression.
- Dexie / IndexedDB stores cached read models, drafts and local UI state.
- Contracts remain versioned and storage-adapter-friendly so selective
  offline-first singleplayer can be added later.
## Related

- [[01-Introduction]]
- [[02-Constraints]]
- [[05-Building-Blocks]]
- [[09-Decisions/ADR-0001-tech-stack]]
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../00-Index/MVP-Scope]]
