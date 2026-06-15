---
title: "Raw Perplexity - PostgreSQL schema ceiling SLO"
status: raw
tags: [research, raw, perplexity, postgresql, schema-per-save, schema-per-tenant, catalog-bloat, pg-dump, fmx-170]
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

# Raw Perplexity - PostgreSQL schema ceiling SLO

## Prompt

Research PostgreSQL schema-per-tenant or schema-per-save scale limits for a
single-node app in 2026. Focus on practical live schema count bands, catalog
bloat (`pg_class`/`pg_attribute`), migration fan-out, `pg_dump`/PITR
implications, and whether soft-warn/hard-stop thresholds like `250/750`,
`300/1000`, or `500/1500` are defensible. Include current PostgreSQL stable
version evidence and note whether PostgreSQL 18 is actually stable as of June
2026.

## Raw discovery synthesis

Perplexity's useful discovery line was:

- PostgreSQL can operate with hundreds of schemas comfortably on a single node;
  low thousands are possible but increasingly operationally expensive.
- Schema-per-tenant guidance clusters around "hundreds" as normal and
  "several thousand" as an upper, scale-out or specialist range rather than a
  casual single-node target.
- The pain modes are not a hard PostgreSQL object-count limit. They are shared
  catalog growth, query-planner/catalog lookup cost, migration fan-out, DDL
  lock risk, backup/restore enumeration time and operational tooling friction.
- `250/750` and `300/1000` are defensible single-node bands; `500/1500` is
  technically plausible but aggressive for a small team because it lets the
  node live deep into the low-thousands pain range before stopping.
- The recommended pair from the research was **soft warn at about 300 live
  schemas and hard stop at about 1000 live schemas**.
- Perplexity initially questioned whether PostgreSQL 18 was stable in mid-2026;
  this was source-checked and corrected against the official PostgreSQL
  versioning page: PostgreSQL `18.4` is the current supported minor on
  2026-06-15, while PostgreSQL 19 is beta.

## Threshold comparison

| Band | Perplexity assessment | FMX implication |
|---|---|---|
| `250/750` | Conservative and safe. | Good if the team wants earlier alerts; may force archive pressure sooner than product needs. |
| `300/1000` | Best balance. Soft warn fits the "few hundred" comfort band; hard stop stays below the several-thousand specialist zone. | Recommended for ADR-0097 because it is operationally honest without shrinking active-save capacity too far. |
| `500/1500` | Aggressive. Possible, but enters a range where migration/catalog/backup tooling must already be strong. | Not the default for a single-node Dokploy MVP. Use only after project-specific measurements. |

## Operational takeaways before source check

- Track `live_save_schema_count` per Postgres node.
- Warn at `300`; block new active schema creation/activation at `1000`.
- Monitor catalog indicators such as `pg_namespace`, `pg_class` and
  `pg_attribute` growth, per-save migration duration, backup duration and
  `pg_dump`/restore job failures.
- Use lazy per-save migration to avoid deploy-time fan-out, but still cap the
  total live catalog so old active saves cannot make DDL and backups degrade
  silently.
- Treat PITR/WAL as whole-cluster disaster recovery and per-schema logical dumps
  as archive/restore artifacts, not as the only backup.

## URLs surfaced by Perplexity

- https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy
- https://planetscale.com/blog/approaches-to-tenancy-in-postgres
- https://clickhouse.com/resources/engineering/multi-tenant-saas-postgres-architecture
- https://www.midnytecity.com.au/blogs/multi-tenant-databases-with-postgres-row-level-security
- https://oneuptime.com/blog/post/2026-01-25-multi-tenant-schemas-postgresql/view
- https://openproceedings.org/2026/conf/edbt/paper-172.pdf
- https://www.postgresql.org/support/versioning/
- https://www.postgresql.org/docs/current/app-pgdump.html

## Source-quality notes

- Crunchy Data and PlanetScale are used as practitioner/vendor guidance for
  tenancy shape and count bands, not as hard PostgreSQL limits.
- ClickHouse's SaaS article is useful as a contrary modern default
  (shared-schema for large tenant counts); it does not override FMX's
  already-ratified schema-per-active-save isolation reason.
- Official PostgreSQL docs are authoritative for versioning, `pg_dump`,
  backup and PITR mechanics.

## Related

- [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
- [[raw-postgres-schema-ceiling-source-checks-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
