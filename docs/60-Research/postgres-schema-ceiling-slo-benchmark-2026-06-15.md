---
title: "PostgreSQL schema ceiling SLO benchmark"
status: current
tags: [research, synthesis, postgresql, schema-per-save, archive, restore, audit-log, pg-dump, pitr, fmx-170]
context: audit-security
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-170
related:
  - [[raw-perplexity/raw-postgres-schema-ceiling-slo-2026-06-15]]
  - [[raw-perplexity/raw-save-archive-game-precedents-2026-06-15]]
  - [[raw-perplexity/raw-postgres-archive-restore-contracts-2026-06-15]]
  - [[raw-perplexity/raw-postgres-schema-ceiling-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/07-Deployment]]
  - [[../30-Implementation/deployment-dokploy]]
  - [[../40-Execution/fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15]]
---

# PostgreSQL schema ceiling SLO benchmark

## Scope

FMX-170 closes the concrete open questions left by
[[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]:

- the soft-warn and hard-stop live-schema count for one single-node Dokploy
  PostgreSQL instance;
- whether capacity pressure can automatically archive an active career;
- whether the orphaned platform `audit_log` table is dropped or retained as a
  convenience projection.

Nico selected the recommended packet live on 2026-06-15: **D1=A `300/1000`,
D2=A user-confirmed hybrid archive trigger, D3=A drop platform `audit_log`**.

## Evidence synthesis

### PostgreSQL operations

PostgreSQL itself does not publish a low hard limit for schema count. The
operational problem is shared-catalog growth and maintenance fan-out:
`pg_namespace`, `pg_class`, `pg_attribute`, indexes, constraints and sequences
all grow with every per-save schema.

The strongest external guidance supports a conservative single-node SLO:

- Crunchy Data frames schema-per-customer as a **hundreds** pattern and warns
  that migrations must be managed across all schemas. Its Citus schema-sharding
  note treats several thousand schemas as a scale-out/medium upper range, not a
  small single-node comfort target.
- PlanetScale warns that schema-per-tenant likely does not scale beyond a few
  hundred tenants because every object across every schema lives in shared
  system catalogs; planning and migrations slow as catalogs grow.
- PostgreSQL official docs confirm that `pg_dump --schema` can select individual
  schemas and that parallel directory dumps exist, but they also make clear
  that logical dumps and PITR are different mechanisms. PITR is whole-cluster
  recovery; a per-save archive artifact is not a replacement for base backup +
  WAL.

Conclusion: **soft warn at 300 live save schemas and hard stop at 1000 live
save schemas per node** is the right default for the MVP. It starts pressure
inside the commonly cited comfort band and stops before FMX enters the
low-thousands specialist zone.

### Product and game precedent

FM-style career saves are player work products. Official Football Manager
material reinforces that saves persist when the user still has the files, and
SEGA's cloud-save cleanup flow asks the user to select a save to delete from a
Cloud tab. Platform cloud quotas and SaaS cold storage also point toward visible
quota/retention flows, not silent deletion of primary user data.

Conclusion: capacity pressure may suggest the least-recently-played active save
as an archive candidate, but **the player must confirm archive/delete before an
active career leaves the live tier**.

### Archive and restore contract

The archive path is valid only if it is a real, testable lifecycle:

- Do not drop a live schema until the encrypted save blob or logical archive
  artifact is written, checksummed and indexed.
- Restore creates/provisions a schema, validates it and only then returns the
  save to `active`.
- Failed archive leaves the save active; failed restore leaves the save
  archived.
- Target restore latency is **within 30 minutes for a typical archived save**
  until measured save sizes justify a tighter SLO.

### Audit-table decision

The source check found no legitimate platform-level `audit_log` consumer in the
current vault contract. ADR-0028 already makes the outbox the domain trail, and
ADR-0091 owns the security audit log. Keeping a third platform projection would
reintroduce the drift ADR-0097 exists to remove.

Conclusion: **drop the platform `audit_log` table name entirely**. If a future
analytics view is needed, it must be proposed as a named read model with an
owner, not smuggled back as `audit_log`.

## Ratified packet

| Decision | Selected | Contract |
|---|---|---|
| D1 - schema ceiling | **A: 300/1000** | Warn at 300 live save schemas per Postgres node; block new activation/creation at 1000 until capacity is freed or a future sharding decision exists. |
| D2 - archive trigger | **A: user-confirmed hybrid** | Capacity pressure blocks new active saves and may preselect the least-recently-played candidate, but never silently archives/deletes an active career. |
| D3 - audit table | **A: drop platform `audit_log`** | Outbox is the domain trail; Audit & Security log is the security trail; no platform `audit_log` table or projection exists by default. |

## Metrics and gates

Implementation must expose at least:

- `postgres_live_save_schema_count{node}`;
- `postgres_live_save_schema_soft_warn` and `postgres_live_save_schema_hard_stop`;
- catalog row-count gauges for `pg_namespace`, `pg_class` and `pg_attribute`;
- per-save migration duration/failure metrics;
- archive request count, duration, failure count and bytes;
- restore request count, duration and failure count;
- whole-cluster backup age/duration and WAL archive lag.

## Related

- [[raw-perplexity/raw-postgres-schema-ceiling-slo-2026-06-15]]
- [[raw-perplexity/raw-save-archive-game-precedents-2026-06-15]]
- [[raw-perplexity/raw-postgres-archive-restore-contracts-2026-06-15]]
- [[raw-perplexity/raw-postgres-schema-ceiling-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
- [[../40-Execution/fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15]]
