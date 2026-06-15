---
title: Handoff FMX-170 PostgreSQL Schema Ceiling
status: wrapped
tags: [meta, execution, handoff, postgresql, schema-per-save, archive, fmx-170]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-170
related:
  - [[../../60-Research/postgres-schema-ceiling-slo-benchmark-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  - [[../fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15]]
---

# Handoff: FMX-170 PostgreSQL Schema Ceiling (2026-06-15)

## Linear

- Issue: FMX-170
- Branch: `codex/fmx-170-schema-ceiling`

## Done this session

- Claimed FMX-170 in Linear and moved it to `In Progress`.
- Created an isolated worktree from current `origin/main`.
- Captured Perplexity-first discovery for PostgreSQL schema-count operations,
  game/platform save precedents and archive/restore contracts.
- Added source-check note with PostgreSQL official docs, Crunchy Data,
  PlanetScale, Football Manager and SEGA support references.
- Recorded Nico's accepted D1-D3 packet.
- Updated ADR-0097 to binding with `300/1000`, user-confirmed hybrid archive
  pressure and no platform `audit_log`.
- Added dated ADR-0027 amendment wording so archive/unarchive and `audit_log`
  no longer contradict ADR-0097.
- Updated deployment/runbook notes plus front-door indexes.

## Open / next step

- Open PR and let docs checks / Linear checks run.
- Code phase must later add measured catalog/backup tests, archive/restore
  implementation tests and UI for user-confirmed archive pressure.

## Blockers

- None for the FMX-170 decision packet.

## Changed vault paths

- `docs/10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation.md`
- `docs/10-Architecture/09-Decisions/ADR-0027-postgres-data-model.md`
- `docs/60-Research/postgres-schema-ceiling-slo-benchmark-2026-06-15.md`
- `docs/60-Research/raw-perplexity/raw-postgres-schema-ceiling-*.md`
- `docs/40-Execution/fmx-170-postgres-schema-ceiling-decision-queue-2026-06-15.md`
- `docs/10-Architecture/07-Deployment.md`
- `docs/30-Implementation/deployment-dokploy.md`
- front-door indexes and this handoff

## Needs promotion

- None. ADR-0097 is accepted/binding for the FMX-170 scope per Nico's D1-D3
  approval.
