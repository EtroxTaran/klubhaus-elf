---
title: ADR-0002 Offline-first Strategy
status: draft
tags: [adr, pwa]
updated: 2026-05-15
---

# ADR-0002: Offline-first Strategy

## Decision

Use IndexedDB via Dexie as the primary MVP save store. SurrealDB sync is optional
and post-MVP.

## Consequences

Gameplay must continue without network access. Save migrations must be forward
compatible and tested before cloud sync is introduced.
