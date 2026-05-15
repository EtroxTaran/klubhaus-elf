---
title: ADR-0004 Club, Player, and League Data Model
status: draft
tags: [adr, data]
updated: 2026-05-15
---

# ADR-0004: Club, Player, and League Data Model

## Decision

Model clubs, players, leagues, competitions, fixtures, and saves with explicit
schema mirrors in SurrealDB and Zod.

## Consequences

Schema changes require forward-only migrations and generated/validated TypeScript
types before dependent feature work fans out.
