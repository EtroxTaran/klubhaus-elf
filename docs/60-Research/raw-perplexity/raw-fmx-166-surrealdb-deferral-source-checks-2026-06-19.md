---
title: Source Checks - FMX-166 SurrealDB Deferral Watch
status: raw
tags: [research, raw, source-checks, fmx-166, surrealdb, postgresql, graph, live-query, backup, migration, context7, ref]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-166
sourceType: source-check
related:
  - [[../surrealdb-deferral-reevaluation-watch-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-reevaluation-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-governance-2026-06-19]]
  - [[raw-fmx-166-surrealdb-deferral-game-precedents-2026-06-19]]
  - [[../../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]]
---

# Source Checks - FMX-166 SurrealDB Deferral Watch

## Official SurrealDB checks

| Source | Checked fact | FMX use |
|---|---|---|
| SurrealDB releases, `https://surrealdb.com/releases` | The releases page shows **Latest: 3.1** and lists **3.1.4** as latest patch on **2026-06-10**. It also lists 2.x and 1.x as older release lines. | The old FMX risk wording "stable 1.x / re-evaluate 2.x" is stale. Future SurrealDB work must source-check and exact-pin the current stable line at the time of trial. |
| GitHub release/tag, `https://github.com/surrealdb/surrealdb/releases/tag/v3.1.4` plus `git ls-remote --tags` | GitHub shows release/tag **v3.1.4** from 2026-06-10; local tag check observed tags through `refs/tags/v3.1.4`. | Confirms the official releases page with repository evidence. |
| SurrealDB roadmap, `https://surrealdb.com/roadmap` | The roadmap says items may change and timescales are not guaranteed. On 2026-06-19 it lists Postgres wire compatibility, parallelized import/export, Cloud Scale GA, distributed live queries and versioned temporal tables as in development, and incremental backups as planned. | Do not treat roadmap items as shipped operating evidence. Use them as watch triggers only. |
| SurrealDB 3.1 blog, `https://surrealdb.com/blog/surrealdb-3-1-stability-diskann-and-a-new-release-process` | Vendor positions 3.1 as a stability/security/observability-focused 3.x minor and describes a new release workflow. | Useful maturity signal, but vendor positioning does not by itself justify adoption for FMX. |
| SurrealDB CLI export/import docs, `https://surrealdb.com/docs/reference/cli/surrealdb-cli/commands/export` and `https://surrealdb.com/docs/reference/cli/surrealdb-cli/commands/import` | Official docs describe logical export to SurrealQL and import from a SurrealQL file, with validation before import. | Projection rebuild/restore is plausible, but future trial must prove recovery objectives against FMX data volume and topology. |
| SurrealDB reference index, `https://surrealdb.com/docs/surrealdb/reference-guide` | Current docs expose graph/record-link, real-time/events, observability, schema best-practice and migration sections. | Feature surface fits a possible future graph/live projection store; it does not make SurrealDB authoritative. |

## Documentation tool checks

| Tool/source | Checked fact | FMX use |
|---|---|---|
| Context7 `/websites/surrealdb` | Current docs surface `surreal upgrade`, graph relation/`RELATE`, live-query APIs, observability pipeline concepts and deployment options including Cloud, single-node, multi-node and embedded modes. | Confirms feature surface and operational areas to check at any future Trial gate. |
| Ref SurrealDB docs | Source checks covered Cloud backups/recovery, README live-query snippets, single-node/distributed concepts and FAQ-style deployment material. | Backs the watch checklist, especially backups/recovery and deployment topology. |
| FMX vault | ADR-0021 and ADR-0097 already choose PostgreSQL + Drizzle as system of record and keep SurrealDB non-authoritative/deferred. | FMX-166 should amend stale watch wording, not reopen the Postgres decision. |

## Governance checks

| Source | Checked fact | FMX use |
|---|---|---|
| Thoughtworks Technology Radar, `https://www.thoughtworks.com/radar` | Technology-radar practice separates technologies under observation from technologies ready for broader use. | FMX maps SurrealDB to **Assess** until a product need and operational proof justify a time-boxed **Trial**. |
| FMX collaboration protocol, [[../../90-Meta/collaboration-and-decision-protocol]] | Architecture, technology and data-model decisions require Nico approval with sourced options and recommendation. | This packet cannot accept SurrealDB, a version pin, owner or gate by itself. It records recommended options for Nico. |

## Corrections applied

- **Version line:** replace "stable 1.x / re-evaluate 2.x" with "source-check
  and exact-pin the current stable line at the future Trial date". As of
  2026-06-19, the observed current stable patch is **3.1.4**.
- **Adoption trigger:** vendor maturity alone is insufficient. A concrete FMX
  feature must prove that PostgreSQL/read models/in-memory graph logic cannot
  meet the target.
- **Authority boundary:** SurrealDB remains non-authoritative, rebuildable and
  swappable. PostgreSQL remains the source of record.
- **Roadmap handling:** roadmap items are watch signals, not shipped evidence.
- **Raw Perplexity handling:** game-precedent citations are useful hypotheses
  but not canonical source evidence.

