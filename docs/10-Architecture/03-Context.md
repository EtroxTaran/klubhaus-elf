---
title: Context
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-22
type: arch
related: [[01-Introduction]], [[04-Solution-Strategy]], [[06-Runtime]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
---

# Context

```mermaid
flowchart LR
  Player[Player] --> PWA[soccer-manager PWA]
  PWA --> IndexedDB[(IndexedDB cache + drafts)]
  PWA --> Start[TanStack Start server functions]
  Start --> Postgres[(PostgreSQL + Drizzle)]
  IndexedDB -. future selective offline .-> PWA
```

## Related

- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — hybrid-online MVP · [[09-Decisions/ADR-0027-postgres-data-model]] — PostgreSQL data model
- [[06-Runtime]] — runtime view · [[01-Introduction]] · [[04-Solution-Strategy]] — arc42 siblings
- [[modules/db-schema]] — schema package
