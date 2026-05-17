---
title: Context
status: draft
tags: [architecture]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[01-Introduction]], [[04-Solution-Strategy]], [[06-Runtime]], [[09-Decisions/ADR-0002-offline-first]]
---

# Context

```mermaid
flowchart LR
  Player[Player] --> PWA[soccer-manager PWA]
  PWA --> IndexedDB[(IndexedDB saves)]
  PWA -. optional sync .-> Start[TanStack Start server functions]
  Start --> SurrealDB[(SurrealDB)]
```

## Related

- [[09-Decisions/ADR-0002-offline-first]] — IndexedDB-first decision · [[09-Decisions/ADR-0004-data-model]] — SurrealDB model
- [[06-Runtime]] — runtime view · [[01-Introduction]] · [[04-Solution-Strategy]] — arc42 siblings
- [[modules/db-schema]] — schema package
