---
title: web module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-18
type: module
binding: false
related:
  - [[../05-Building-Blocks]]
  - [[../09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

# apps/web (`@soccer-manager/web`)

## Purpose

The TanStack Start PWA: SSR, file-based routing, the offline-ready app shell,
and the UI composition layer for the player.

## Owns

- TanStack Start app, routes, server functions.
- Service worker bootstrap (`apps/web/public/sw-register.js`) and Workbox build
  (`apps/web/scripts/build-pwa.mjs`).
- Dexie/IndexedDB cache, draft, onboarding-state and future save/export wiring.
- i18n resource wiring (i18next).

## Inputs

- `@soccer-manager/ui` components.
- `@soccer-manager/game-data` generated data.
- `@soccer-manager/db-schema` types/validation.
- `@soccer-manager/match-engine` simulation API.

## Outputs

- Rendered PWA; server-confirmed game progression plus IndexedDB caches/drafts.

## Invariants

- Server-only secrets via `createServerFn`/`createServerOnlyFn`; never
  `process.env.*` in route loaders/components.
- Browser persistence through Dexie/IndexedDB, never localStorage. MVP Dexie data
  is cache/draft/local UI state, not canonical domain progression.
- Never hand-edit `routeTree.gen.ts` or generated `src/components/ui/**`.

## Dependencies

- [[../09-Decisions/ADR-0001-tech-stack]]
- [[../09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../09-Decisions/ADR-0008-mobile-first-ui]] (draft)
- [[ui]], [[game-data]], [[db-schema]], [[match-engine]]
## Related

- [[../05-Building-Blocks]]
- [[../09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
