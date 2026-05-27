---
title: PostgreSQL + Drizzle Integration
status: current
tags: [database, implementation, postgresql, drizzle]
created: 2026-05-19
updated: 2026-05-19
type: implementation
binding: false
supersedes: surrealdb-integration
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]"
  - "[[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]"
  - "[[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]"
  - "[[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]"
related:
  - [[../10-Architecture/modules/db]]
  - [[../10-Architecture/modules/db-schema]]
  - [[secrets-management]]
  - [[deployment-dokploy]]
  - [[audit-trail]]
  - [[hybrid-online-pwa-strategy]]
---

# PostgreSQL + Drizzle Integration

This note replaces the superseded `surrealdb-integration.md`. It is the
**binding implementation specification** for how the codebase connects to,
migrates, and queries PostgreSQL via Drizzle.

The substrate decisions are [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
(schema-per-save, drizzle-source-of-truth, A2 lazy migration, branded opaque
UUIDs, numeric mapping, junction-table edges) and
[[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
(same-tx writes + polling-floor + LISTEN/NOTIFY + native partitioning + the
RealtimeTransport bridge).

## Local development

`docker-compose.dev.yml` runs `postgres:17-alpine` on port 5432 with default
dev credentials (see file). `DATABASE_URL` is provided to the app via
direnv + sops decryption of `secrets/dev/db.enc.yaml` (see
[[secrets-management]] §3.4 for the canonical shape — the `dsn:` key is
mapped to the `DATABASE_URL` env var at runtime).

```sh
# Start the DB
docker compose -f docker-compose.dev.yml up -d

# Apply migrations (platform + per-save baseline)
pnpm db:migrate

# Open the DB
psql "$DATABASE_URL"
```

`mise.toml` already pins `postgres = "17"` for local CLI tooling.

## Migrations

- **Drizzle is the source of truth** — TypeScript `pgTable` declarations in
  `packages/db/src/schema/{platform,save}/**`.
- `drizzle-kit generate` produces forward-only numbered SQL files in
  `packages/db/migrations/{platform,save}/`. **Committed.**
- `drizzle-kit push` is **forbidden** in CI/prod (locally permissible for
  quick prototyping; never against shared envs).
- The `outbox_event_archive` partitioning is the **one** hand-authored SQL
  migration alongside the drizzle-kit output (ADR-0028 §4).
- `pnpm db:migrate` runs `drizzle-orm/node-postgres/migrator` against
  `DATABASE_URL`. Replaces `scripts/db-migrate-placeholder.mjs`.
- **Per-save migrations** apply lazily via `QueryGateway.withSave` when a
  save's `schema_version` lags the target (A2 lazy — ADR-0027 §2). The
  `__drizzle_migrations` table is per-schema.
- **CI drift gate**: `pnpm db:generate && git diff --exit-code` must pass on
  every PR. `pnpm db:generate` runs drizzle-kit generate **and** the
  mirror-emitter that writes `packages/db-schema/src/generated/**`.

## Query gateway

Domain code never sees the pool. All access goes through `QueryGateway`
exported from `@soccer-manager/db`:

```ts
import { gateway } from '@soccer-manager/db'

// Platform context
await gateway.withPlatform(async (tx) => {
  const user = await tx.query.user.findFirst({ where: eq(user.id, userId) })
  // …
})

// Per-save context
await gateway.withSave(saveId, async (tx) => {
  // tx already has search_path = save_<hex>, public and schema_version is
  // current. A wrong saveId yields "schema does not exist".
  const squad = await tx.query.player.findMany({ where: eq(player.clubId, clubId) })
})
```

Implementation: `withSave` opens a transaction, runs
`SET LOCAL search_path = save_<hex>, public`, applies any pending per-save
migrations, then runs the handler. `LOCAL` so the scope cannot leak across
pgbouncer transaction-mode checkouts.

## Outbox usage (ADR-0028)

Producers emit events inside the same transaction as the domain change via
the typed helper:

```ts
await gateway.withSave(saveId, async (tx) => {
  await tx.update(transfer).set({ state: 'completed' }).where(eq(transfer.id, transferId))
  await withOutbox(tx, {
    aggregateType: 'transfer',
    aggregateId: transferId,
    eventType: 'transfer.completed',
    payload: { /* validated by the per-event Zod schema */ },
  })
})
```

`withOutbox` validates the payload, generates a UUIDv7 `event_id`, and
inserts into `public.outbox_event` inside the caller's transaction. **No
raw `db.insert(outbox_event)` calls are allowed** — lint rule.

## Realtime fan-out

The outbox publisher is a long-running worker (deployment slot lands with
the engineering wave). It runs the polling-floor loop **and** `LISTEN
outbox_new`; it never calls SSE directly — it writes published events to
the [[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]
`RealtimeTransport` interface, whose MVP SSE implementation lives in
`apps/web/src/lib/realtime-transport.ts`. Centrifugo swap-in is behind the
same interface.

## Backup + restore

- **Routine backup**: `pg_dump` (full + WAL archiving for PITR) to EU
  object storage. Cadence + drill recipe in [[secrets-management]] §11.3.
- **Restore drill**: covered by [[secrets-management]] §11.3 (the
  "PostgreSQL restore drill" supersedes the old SurrealDB drill).
- **PITR**: enabled via WAL archiving — minutes-granularity recovery on a
  Hetzner single node.

## Bounded-context isolation

Reinforces [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] §6:

- No cross-context foreign keys. Cross-context references are `uuid`
  columns with branded TypeScript types
  (`type PlayerId = string & { __brand: 'PlayerId' }`).
- Each bounded context has its own Drizzle schema folder under
  `packages/db/src/schema/save/<context>/` and only consumes its own
  tables via the gateway.
- Code review enforces "no `references()` across context folders".

## CI surface

| Check | Command |
|---|---|
| Drift gate | `pnpm db:generate && git diff --exit-code` |
| Migration apply (fresh DB) | `pnpm db:migrate` against a CI Postgres service |
| Isolation test | open `withSave(saveA)`, attempt to read a `saveB` table → expect relation-not-found |
| Outbox atomicity | in one tx write a state row + outbox row, force rollback → assert neither persists |
| Bounds (fast-check) | generate money/bp/attribute/coordinate values; assert CHECK constraints reject out-of-range and Zod mirrors the same bounds |
| Hotseat import | `provisionSave(src)`, write state, `snapshotAndImport(src,dst)` in one tx → assert dst is state-equivalent and src untouched |

## SurrealDB

SurrealDB is **deferred** ([[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]).
If it returns later, it does so only as an additive realtime/graph engine
**behind** [[../10-Architecture/09-Decisions/ADR-0023-realtime-transport]]
— never as the system of record. This integration note never imports
SurrealDB SDKs and Drizzle never connects to anything but PostgreSQL.
## Related

- [[../10-Architecture/modules/db]]
- [[../10-Architecture/modules/db-schema]]
- [[secrets-management]]
- [[deployment-dokploy]]
- [[audit-trail]]
- [[hybrid-online-pwa-strategy]]
