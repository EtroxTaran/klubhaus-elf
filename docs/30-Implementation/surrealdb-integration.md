---
title: SurrealDB Integration
status: draft
tags: [database, implementation]
created: 2026-05-15
updated: 2026-05-17
type: implementation
related: [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/modules/db-schema]], [[../60-Research/pwa-offline-patterns]], [[deployment-dokploy]]
---

# SurrealDB Integration

Local development uses `docker-compose.dev.yml`. Schemas are kept in `db/schema.surql`
and forward-only migrations in `db/migrations/`.

## Related

- [[../10-Architecture/09-Decisions/ADR-0004-data-model]] — schema decision (draft, Wave 2)
- [[../10-Architecture/modules/db-schema]] — schema/Zod mirror module
- [[../60-Research/pwa-offline-patterns]] — sync/conflict research · [[deployment-dokploy]] — DB in compose
