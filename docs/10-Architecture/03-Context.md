---
title: Context
status: draft
tags: [architecture]
updated: 2026-05-15
---

# Context

```mermaid
flowchart LR
  Player[Player] --> PWA[soccer-manager PWA]
  PWA --> IndexedDB[(IndexedDB saves)]
  PWA -. optional sync .-> Start[TanStack Start server functions]
  Start --> SurrealDB[(SurrealDB)]
```
