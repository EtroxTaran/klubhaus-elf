---
title: Raw Perplexity - FMX-166 SurrealDB Deferral Re-evaluation
status: raw
tags: [research, raw, perplexity, fmx-166, surrealdb, postgresql, database, graph, realtime, dependency-currency]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-166
sourceType: perplexity
related:
  - [[../surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-source-checks-2026-06-19]]
  - [[../../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
  - [[../../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../../10-Architecture/11-Risks]]
---

# Raw Perplexity - FMX-166 SurrealDB Deferral Re-evaluation

## Prompt

As of 2026-06-19, check SurrealDB's current stable release line, maturity,
operations posture, migration/backups, live-query/graph features, and whether
FMX should keep SurrealDB deferred behind PostgreSQL rather than pinning the old
`1.x` wording.

## Raw capture

Perplexity reported that the current SurrealDB stable line is now **3.1.x**,
with **3.1.4** presented as the latest patch on 2026-06-10. It framed 3.1 as a
stability and operational-maturity release, not merely a preview of 2.x-era
functionality. The answer highlighted security fixes, observability, live-query
permission hardening, graph traversal fixes and a changed release workflow.

The answer's FMX implication was consistent with the existing architecture:

- PostgreSQL remains the system of record for money, contracts, progression,
  save state and audit/outbox.
- SurrealDB may remain a deferred additive projection/live-graph engine only.
- The old "pin 1.x / re-evaluate 2.x" wording is stale. If SurrealDB is ever
  trialed, FMX should source-check and exact-pin the current stable release line
  at that time instead of inheriting a historical major line.
- Adoption should require a proven product need for graph/live behavior, not
  only vendor maturity.

## Perplexity sources emitted

Perplexity cited these sources for follow-up checking:

- `https://surrealdb.com/releases`
- `https://github.com/surrealdb/surrealdb/releases`
- `https://surrealdb.com/blog/surrealdb-3-1-stability-diskann-and-a-new-release-process`
- `https://surrealdb.com/3.1`
- `https://surrealdb.com/blog/surrealdb-3-x-by-the-numbers`
- `https://docs.rs/crate/surrealdb/latest`
- older community and Reddit discussion threads

## Source-quality note

This raw capture is **discovery input only**. The canonical synthesis uses the
official SurrealDB releases page, GitHub release/tag evidence, official roadmap,
official docs, Context7 and Ref source checks. Community discussion and vendor
benchmark claims remain context, not binding evidence.

