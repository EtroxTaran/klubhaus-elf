---
title: ui module
status: current
tags: [architecture, module]
created: 2026-05-17
updated: 2026-05-17
type: module
binding: false
related:
  - [[../05-Building-Blocks]]
---

# packages/ui (`@soccer-manager/ui`)

## Purpose

Shared, presentational React component library consumed by `apps/web`.

## Owns

- Reusable UI primitives/components (shadcn-derived).
- Component-level styling conventions (Tailwind).

## Inputs

- React (peer dependency).
- Design tokens / Tailwind config from the app.

## Outputs

- Named-export React components via `src/index.ts`.

## Invariants

- Presentational only — no data access, no Postgres/Drizzle/Dexie, no server logic.
- Named exports, functional components, no default exports, no class components.
- shadcn primitives are generated; update with shadcn tooling, do not hand-edit.

## Dependencies

- [[../09-Decisions/ADR-0001-tech-stack]]
- [[../09-Decisions/ADR-0008-mobile-first-ui]] (draft)
- Consumed by [[web]].
## Related

- [[../05-Building-Blocks]]
