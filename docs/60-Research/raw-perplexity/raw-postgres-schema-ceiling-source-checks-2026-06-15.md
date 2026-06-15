---
title: "Raw source checks - PostgreSQL schema ceiling SLO"
status: raw
tags: [research, raw, source-check, postgresql, pg-dump, pitr, football-manager, steam-cloud, tenancy, fmx-170]
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

# Raw source checks - PostgreSQL schema ceiling SLO

## PostgreSQL official docs

### PostgreSQL versioning policy

URL: https://www.postgresql.org/support/versioning/

Source-check outcome:

- PostgreSQL releases a new major version about once per year and supports each
  major version for five years.
- Users are recommended to run the current minor release for their major
  version.
- On 2026-06-15, the official table lists PostgreSQL `18.4` as current and
  supported, with `17.10`, `16.14`, `15.18` and `14.23` also supported.
- The official site also announces PostgreSQL 19 Beta 1; that confirms 19 is a
  development/beta line, not the stable implementation target.

Use in synthesis: corrects the Perplexity uncertainty and confirms ADR-0097's
PostgreSQL 18.x target; implementation should pin the current minor when code
phase lands.

### PostgreSQL backup and restore overview

URL: https://www.postgresql.org/docs/current/backup.html

Source-check outcome:

- PostgreSQL documents three fundamental backup approaches: SQL dump,
  file-system-level backup and continuous archiving.
- The docs warn that valuable databases must be backed up regularly and that
  each backup technique has different assumptions and trade-offs.

Use in synthesis: FMX should not treat a per-schema archive artifact as the only
backup. Whole-cluster backup/PITR remains a separate operations requirement.

### PostgreSQL `pg_dump`

URL: https://www.postgresql.org/docs/current/app-pgdump.html

Context7 and Ref checks confirm:

- `pg_dump` creates consistent exports while the database is in use.
- `pg_dump --schema=pattern` dumps only matching schemas and their contained
  objects.
- When `--schema` is specified, PostgreSQL warns that dependencies outside the
  selected schema are not automatically included.
- `pg_dump -Fd -j <jobs>` supports parallel directory-format dumps; parallel
  dumps consume `jobs + 1` connections and add database load.
- Custom and directory formats are the flexible archive formats for selective
  `pg_restore`.

Use in synthesis: per-save archive/restore can use schema-filtered logical
artifacts, but the control-plane dependencies and restore validation must be
part of the contract. Parallel dump is an ops tool, not a license to let live
schemas grow unbounded.

### PostgreSQL continuous archiving and PITR

URL: https://www.postgresql.org/docs/current/continuous-archiving.html

Source-check outcome:

- PostgreSQL writes changes to WAL for crash safety.
- File-system-level backup plus archived WAL supports continuous backup and
  point-in-time recovery.
- PITR is whole-cluster/database recovery, not a subset restore mechanism.
- The docs explicitly say `pg_dump`/`pg_dumpall` are logical dumps and cannot be
  used as part of WAL replay.

Use in synthesis: FMX needs both whole-cluster PITR health and per-save archive
artifacts. They solve different failure modes.

## Postgres tenancy guidance

### Crunchy Data - Designing Your Postgres Database for Multi-tenancy

URL: https://www.crunchydata.com/blog/designing-your-postgres-database-for-multi-tenancy

Source-check outcome:

- Crunchy frames database-per-customer as tens of tenants, schema-per-customer
  as hundreds, and tenant-discriminator shared tables as millions.
- It calls out schema migrations across all schemas as the main cost of
  schema-per-tenant.
- It notes Citus schema-based sharding can support a medium level of tenants,
  generally not exceeding several thousand schemas.

Use in synthesis: supports a soft warn in the low hundreds and a hard stop well
below the several-thousand zone for FMX's single-node MVP.

### PlanetScale - Approaches to tenancy in Postgres

URL: https://planetscale.com/blog/approaches-to-tenancy-in-postgres

Source-check outcome:

- PlanetScale describes shared-schema as the general-purpose scalable tenancy
  model.
- It warns that schema-per-tenant likely will not scale beyond a few hundred
  tenants because every table, index, constraint and sequence across all schemas
  lives in shared system catalogs.
- It says catalog growth slows planning and migrations.

Use in synthesis: supports `300` as the soft-warning point and rejects a casual
`500/1500` default for a small single-node deployment.

## Game and platform save precedent

### Football Manager save compatibility FAQ

URL: https://www.footballmanager.com/help/savegamefaq

Source-check outcome:

- The FAQ says older saves can be imported if the user can locate the files.
- For transfer count, it says there is no limit as long as the device has the
  necessary storage space.
- Console/local save language emphasizes that uninstalling the game does not
  remove local save files.

Use in synthesis: FM-style players expect careers to persist unless they choose
otherwise or run into a visible storage boundary.

### SEGA support - remove Football Manager saves from cloud storage

URL: https://support.sega.com/hc/en-gb/articles/19454114381457-How-to-remove-Football-Manager-saves-from-my-cloud-storage

Source-check outcome:

- For Steam, Epic and Microsoft Store/Xbox cloud saves, SEGA instructs users to
  open the Cloud tab, view listed saves and select a save to delete.
- The workflow requires an active internet connection and is explicitly
  user-driven.

Use in synthesis: capacity pressure should lead to visible save-management UI,
not silent active-save eviction.

### Steam Cloud documentation

URL: https://partner.steamgames.com/doc/features/cloud

Source-check outcome:

- Steam Cloud is a platform sync facility with configuration and conflict
  semantics; it is not a game-layer rule for deleting user saves.

Use in synthesis: platform cloud precedent supports visible quota/conflict
handling, not autonomous FMX career deletion.

## Source-quality notes

- Perplexity was useful for discovery and option framing. Primary/official
  sources corrected the PostgreSQL 18 stability question.
- No source gives a hard PostgreSQL schema-count limit; `300/1000` is a
  reasoned operating SLO from practitioner guidance plus FMX's single-node
  constraint.
- Game precedent is strong on user trust and manual save control; exact
  implementation details for Football Manager internals are not inferred.

## Related

- [[../postgres-schema-ceiling-slo-benchmark-2026-06-15]]
- [[raw-postgres-schema-ceiling-slo-2026-06-15]]
- [[raw-save-archive-game-precedents-2026-06-15]]
- [[raw-postgres-archive-restore-contracts-2026-06-15]]
