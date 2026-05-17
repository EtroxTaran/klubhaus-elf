---
title: Solution Strategy
status: draft
tags: [architecture]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[01-Introduction]], [[02-Constraints]], [[05-Building-Blocks]], [[09-Decisions/ADR-0001-tech-stack]]
---

# Solution Strategy

Build a modular pnpm workspace:

- `apps/web`: TanStack Start PWA and server functions.
- `packages/match-engine`: deterministic simulation without React dependencies.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: SurrealDB schema mirrors and validation.
- `packages/ui`: shared UI primitives/components.

## Related

- [[05-Building-Blocks]] — module map (hub) · [[09-Decisions/ADR-0001-tech-stack]] — stack decision
- Modules: [[modules/web]] · [[modules/match-engine]] · [[modules/game-data]] · [[modules/db-schema]] · [[modules/ui]]
- [[01-Introduction]] · [[02-Constraints]] — arc42 siblings
