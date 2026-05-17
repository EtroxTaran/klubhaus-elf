---
title: web module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-17
type: module
binding: true
related: [[../05-Building-Blocks]]
---

# apps/web (`@soccer-manager/web`)

## Purpose

The TanStack Start PWA: SSR, file-based routing, the offline game shell, and
the UI composition layer for the player.

## Owns

- TanStack Start app, routes, server functions.
- Service worker bootstrap (`apps/web/public/sw-register.js`) and Workbox build
  (`apps/web/scripts/build-pwa.mjs`).
- Dexie/IndexedDB save persistence wiring.
- i18n resource wiring (i18next).

## Inputs

- `@soccer-manager/ui` components.
- `@soccer-manager/game-data` generated data.
- `@soccer-manager/db-schema` types/validation.
- `@soccer-manager/match-engine` simulation API.

## Outputs

- Rendered PWA; persisted career saves in IndexedDB.

## Invariants

- Server-only secrets via `createServerFn`/`createServerOnlyFn`; never
  `process.env.*` in route loaders/components.
- Game state in IndexedDB via Dexie, never localStorage.
- Never hand-edit `routeTree.gen.ts` or generated `src/components/ui/**`.

## Dependencies

- [[../09-Decisions/ADR-0001-tech-stack]]
- [[../09-Decisions/ADR-0002-offline-first]]
- [[../09-Decisions/ADR-0008-mobile-first-ui]] (draft)
- [[ui]], [[game-data]], [[db-schema]], [[match-engine]]
