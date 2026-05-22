---
title: SurrealDB Integration
status: superseded
tags: [database, implementation]
created: 2026-05-15
updated: 2026-05-19
superseded_by: postgres-drizzle-integration
type: implementation
related: [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[../10-Architecture/modules/db-schema]], [[../60-Research/offline-mvp-scope-and-sync-strategy]], [[hybrid-online-pwa-strategy]], [[deployment-dokploy]]
---

# SurrealDB Integration

> **Superseded — historical memory only.** This document is superseded by [[postgres-drizzle-integration]] and must not be implemented. The current decision/spec lives there; see also [[../00-Index/Decision-Log]] for the authoritative index. Retained for historical context per the vault's supersede discipline.

Local development uses `docker-compose.dev.yml`. Schemas are kept in `db/schema.surql`
and forward-only migrations in `db/migrations/`.

For the MVP, SurrealDB-backed server commands are the authoritative persistence
path for game progression. Dexie mirrors read caches and drafts only. Repository
and query-gateway contracts must still be storage-adapter-friendly so a future
singleplayer local-authoritative adapter can satisfy the same public contracts.

Implementation rule: cross-context reads stay behind query gateways, and new
commands carry preconditions/idempotency data even before queued offline intents
exist.

## Related

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] — schema decision
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — MVP authority staging
- [[../10-Architecture/modules/db-schema]] — schema/Zod mirror module
- [[../60-Research/offline-mvp-scope-and-sync-strategy]] — MVP sync staging · [[deployment-dokploy]] — DB in compose
