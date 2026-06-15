---
title: "Raw Perplexity - PostgreSQL archive restore contracts"
status: raw
tags: [research, raw, perplexity, postgresql, archive, restore, pitr, pg-dump, backup, fmx-170]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-170
related:
  - [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../../40-Execution/fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15]]
---

# Raw Perplexity - PostgreSQL archive restore contracts

## Prompt

Research best practices for archive/restore contracts for per-tenant PostgreSQL
schemas or per-save data: dropping live schema into encrypted blob/row storage,
restore latency SLOs, backup/PITR strategy, observability metrics, and safe
failure modes. Include decision options and recommended defaults for a small
single-node Dokploy/Hetzner MVP.

## Raw discovery synthesis

Perplexity's useful discovery line was:

- Treat archive/restore as a tenant lifecycle contract, not just a storage
  optimization.
- Keep whole-cluster physical backup plus WAL/PITR as the disaster-recovery
  baseline.
- Use per-schema logical dumps or equivalent app-owned encrypted save blobs as
  archive artifacts for cold saves.
- Never drop the live schema until the archive artifact is written, checksummed,
  indexed and restorable.
- Restore should provision a new schema, load/validate, then atomically switch
  the save state/routing back to active. Failed restore leaves the save archived
  and no broken schema becomes visible.
- Expose metrics for live schema count, archive duration/failure count,
  restore duration/failure count, archive bytes, backup age, WAL archive lag and
  backup duration.

## Recommended default from discovery

- Archive operation:
  1. Mark save `archiving`.
  2. Quiesce or reject mutating commands for that save.
  3. Ensure current encrypted save blob / logical archive artifact exists.
  4. Verify checksum and metadata (`saveId`, `archiveId`, schema/app version,
     created/archived timestamps, size).
  5. Mark save `archived`.
  6. Drop the per-save schema from the live catalog.
- Restore operation:
  1. Require an active-save slot below the hard ceiling.
  2. Create a new `save_<uuidv7hex>` schema.
  3. Restore/provision and apply lazy migrations if needed.
  4. Validate basic health and version metadata.
  5. Flip state to `active`; failed restore leaves the save archived.
- SLO:
  - Typical archived-save restore target: minutes, not instant.
  - A 30-minute planning SLO is a reasonable MVP ceiling until real save sizes
    are measured.

## URLs surfaced by Perplexity

- https://www.postgresql.org/docs/current/backup.html
- https://www.postgresql.org/docs/current/app-pgdump.html
- https://www.postgresql.org/docs/current/continuous-archiving.html
- https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy
- https://oneuptime.com/blog/post/2026-01-25-multi-tenant-schemas-postgresql/view

## Source-quality notes

- Official PostgreSQL docs are authoritative for `pg_dump`, backup categories
  and PITR mechanics.
- Multi-tenant blog guidance is used only for operational shape, not as a hard
  FMX contract.
- Exact restore-time numerics need later measured tests once real save sizes and
  table counts exist.

## Related

- [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
- [[raw-postgres-schema-ceiling-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
