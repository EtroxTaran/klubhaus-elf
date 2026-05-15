---
title: Solution Strategy
status: draft
tags: [architecture]
updated: 2026-05-15
---

# Solution Strategy

Build a modular pnpm workspace:

- `apps/web`: TanStack Start PWA and server functions.
- `packages/match-engine`: deterministic simulation without React dependencies.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: SurrealDB schema mirrors and validation.
- `packages/ui`: shared UI primitives/components.
