---
title: Building Blocks
status: draft
tags: [architecture]
updated: 2026-05-15
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
