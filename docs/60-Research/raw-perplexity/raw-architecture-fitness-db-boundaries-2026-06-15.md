---
title: Raw Architecture Fitness Database Boundary Research
status: raw
tags: [research, raw, perplexity, architecture-fitness, postgres, drizzle, sql, schema, bounded-context, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-167
related:
  - [[../architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../../40-Quality/architecture-fitness-function]]
---

# Raw Architecture Fitness Database Boundary Research

This note preserves the Perplexity-first discovery pass for FMX-167 database
and query boundary enforcement. It is raw research input, not a binding
implementation instruction.

## Prompt

For a TypeScript + PostgreSQL + Drizzle modular monolith, how should we enforce
"no shared tables", "no cross-context joins", "no cross-context foreign keys"
and "each bounded context owns its own tables"? Include Drizzle schema scanning,
query builder/raw SQL checks, generated SQL migrations and CI failure policy.

## Discovery Summary

Perplexity recommended treating storage isolation as a first-class architecture
fitness function, not as a code-review convention. The relevant controls are
different from import-level controls:

- a table/context ownership registry;
- static scanning of Drizzle schema declarations;
- static scanning of Drizzle relation and foreign-key declarations;
- static scanning of query-builder joins where statically inspectable;
- raw SQL parsing for generated migrations and checked source SQL;
- fixture-based violation tests to prove the scanner fails on known bad cases.

The key finding is that one tool is unlikely to cover the full policy. Import
graphs can prove package dependencies; they do not understand SQL table
ownership. SQL parsers can understand migrations and raw SQL; they do not
understand all TypeScript call graphs. TypeScript AST checks can bridge Drizzle
source patterns and project metadata.

## Candidate Hard-Fail Checks

Drizzle schema and relation checks:

- a context declares tables only in its owned schema/folder;
- a context does not import another context's Drizzle table object directly;
- `.references(...)` does not point to another context's table;
- `relations(...)` does not define cross-context relation navigation that would
  normalise cross-context reads into application code;
- shared lookup/reference tables are rejected unless a binding ADR names them
  as platform-owned data with a public contract.

Query and SQL checks:

- no query-builder join where left and right tables belong to different
  bounded contexts;
- no raw SQL `JOIN` across context-owned tables;
- no migration SQL creating cross-context foreign keys;
- no migration SQL creating a shared table that has no single owning context;
- no cross-context table access from tests/fixtures unless the file is a named
  scanner fixture proving violation detection.

## Best-Practice Notes

The scanner should derive table ownership from the bounded-context catalog and
future package/path metadata, not from a hand-written matrix of allowed pairs.
Pairwise allowlists age badly and create silent coupling.

Exceptions should be rare and should not be generic "performance" escapes. If a
read is too slow through a public query layer, the owning context publishes a
read model or event-backed projection. That matches the existing
bounded-context map rule.

Drizzle relation metadata requires specific care. Official Drizzle docs describe
relations as application-level helpers distinct from database foreign keys.
Therefore FMX must scan both layers: Drizzle relations for application-level
cross-context navigation and migrations/foreign-key declarations for database
constraints.

## Source-Check Caveat

Perplexity was used for discovery and comparison. Official/current facts are
checked in [[raw-architecture-fitness-source-checks-2026-06-15]] before the
synthesis and ADR consume them.

