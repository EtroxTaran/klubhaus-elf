---
title: Building Blocks
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-17
type: index
binding: true
---

# Building Blocks

```mermaid
flowchart TB
  Web[apps/web] --> UI[packages/ui]
  Web --> Data[packages/game-data]
  Web --> Schema[packages/db-schema]
  Web --> Engine[packages/match-engine]
  Web --> Dexie[Dexie / IndexedDB]
  Web --> Surreal[SurrealDB sync post-MVP]
```

## Modules

Each module has a note with Purpose / Owns / Inputs / Outputs / Invariants /
Dependencies. A new module requires a `module.md`
([[../90-Meta/templates/module]]); architecture-relevant changes update it
(see [[../90-Meta/vault-governance]]).

- [[modules/web]] — TanStack Start PWA shell
- [[modules/ui]] — shared React components
- [[modules/game-data]] — IP-clean generated content
- [[modules/db-schema]] — schema + Zod mirrors
- [[modules/match-engine]] — deterministic simulation
