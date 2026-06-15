---
title: FMX-170 PostgreSQL Schema Ceiling Decision Queue
status: current
tags: [execution, decision-queue, postgresql, schema-per-save, archive, audit-log, fmx-170]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: true
linear: FMX-170
related:
  - [[../60-Research/postgres-schema-ceiling-slo-benchmark-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-postgres-schema-ceiling-slo-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-save-archive-game-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-postgres-archive-restore-contracts-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-postgres-schema-ceiling-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
---

# FMX-170 PostgreSQL Schema Ceiling Decision Queue

This is the HITL decision record for FMX-170. Nico accepted the recommended
packet on 2026-06-15 before the vault updates were made binding.

## D1 - per-node live-schema SLO

| Option | Meaning | Assessment |
|---|---|---|
| 250/750 | Warn at 250 live save schemas per node; hard-stop at 750. | Conservative and safe, but it forces archive pressure earlier than the current product needs require. |
| **300/1000** | Warn at 300 live save schemas per node; hard-stop at 1000. | **Recommended.** Fits the "few hundred" comfort guidance and stops before the low-thousands specialist zone. |
| 500/1500 | Warn at 500; hard-stop at 1500. | Too aggressive for a single-node Dokploy MVP without project-specific catalog/backup measurements. |

**Decision:** Accepted **300/1000** (Nico, 2026-06-15).

## D2 - active-save archive trigger

| Option | Meaning | Assessment |
|---|---|---|
| **User-confirmed hybrid** | Capacity pressure blocks new active save creation/reactivation, preselects the least-recently-played candidate as a suggestion, and requires explicit archive/delete confirmation. | **Recommended.** Respects FM-style career ownership while still giving operations a hard live-catalog bound. |
| State-only archive | Only user/manual `state=archived` moves a save cold; capacity pressure only blocks. | Safe but higher-friction and less helpful when the user wants a default suggestion. |
| Automatic LRU archive | System archives the least-recently-played active save automatically under pressure. | Rejected. Too risky for player trust and too close to silent data loss for long-running careers. |

**Decision:** Accepted **user-confirmed hybrid** (Nico, 2026-06-15).

## D3 - platform `audit_log`

| Option | Meaning | Assessment |
|---|---|---|
| **Drop table** | Outbox is the domain trail, Audit & Security log is the security trail, and the platform `audit_log` name is forbidden by default. | **Recommended.** Removes the orphaned third audit surface and closes ADR-0097's drift. |
| Derived projection | Keep `audit_log` only as a derived outbox read model. | Rejected. Convenience does not justify another ownerless audit surface. |
| Defer audit close | Leave D2 unresolved. | Rejected. ADR-0097 would remain partially open and non-binding. |

**Decision:** Accepted **drop table** (Nico, 2026-06-15).

## Decision Record

- 2026-06-15: Live triage checked Git state, worktrees, open PRs and Linear.
- 2026-06-15: Nico selected FMX-170 from the shortlist.
- 2026-06-15: FMX-170 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-170-schema-ceiling`.
- 2026-06-15: Perplexity-first discovery captured for PostgreSQL schema-count
  operations, game/platform save precedent and archive/restore contracts.
- 2026-06-15: Official/current source checks captured for PostgreSQL
  versioning, `pg_dump`, backup/PITR, Crunchy/PlanetScale tenancy guidance,
  Football Manager save compatibility and SEGA cloud-save management.
- 2026-06-15: Nico accepted D1=`300/1000`, D2=user-confirmed hybrid, D3=drop
  platform `audit_log`.

## Approved Packet

Accepted selection: **D1=A, D2=A, D3=A**.

No open Nico decision remains for the ADR-0097 schema-ceiling/archive/audit
surface. Future code-phase implementation still needs measured catalog/backup
tests, exact PostgreSQL container pin checks, archive/restore test coverage and
UI copy review before shipping.

## Related

- [[../60-Research/postgres-schema-ceiling-slo-benchmark-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
