---
title: ADR-0004 Club, Player, and League Data Model
status: draft
tags: [adr, data]
created: 2026-05-15
updated: 2026-05-17
type: adr
binding: false
supersedes:
superseded_by:
related: [[../../60-Research/research-wave-2-gaps]]
---

> **DRAFT — do not implement from this ADR.** Blocked on Research Wave 2
> ([[../../60-Research/research-wave-2-gaps]]). Direction below is current
> intent, not an accepted decision.

# ADR-0004: Club, Player, and League Data Model

## Status

draft

## Date

2026-05-15

## Context

Clubs, players, leagues, competitions, fixtures, and saves need a schema that
works across SurrealDB and runtime validation. Exact entity attributes depend
on Wave 2 (data-model gap) and the match engine (ADR-0003).

## Options Considered

- SurrealDB SCHEMAFULL + Zod mirror, record links + RELATE (intended).
- Loose document store, validation at read time.
- Relational-only model with joins.

## Decision

(Intended, pending Wave 2) Model clubs, players, leagues, competitions,
fixtures, and saves with explicit schema mirrors in SurrealDB and Zod.

## Rationale

A single schema mirrored in SurrealDB and Zod gives one source of truth for
storage and runtime validation, and record links/RELATE match SurrealDB's graph
model better than joins.

## Consequences

Positive:

- Generated/validated TypeScript types; consistent storage + runtime contracts.

Negative:

- Schema changes require forward-only migrations and generated/validated types
  before dependent feature work fans out. Attribute set unstable until Wave 2.

## Supersedes

None

## Related Docs

- [[../../60-Research/research-wave-2-gaps]]
- [[ADR-0003-match-engine]]
- [[ADR-0005-save-format]]
