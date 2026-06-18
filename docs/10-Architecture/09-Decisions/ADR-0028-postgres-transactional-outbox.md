---
title: ADR-0028 PostgreSQL Transactional Outbox (same-tx + poll-floor + LISTEN/NOTIFY)
status: accepted
tags: [adr, architecture, outbox, events, reliability, postgresql]
created: 2026-05-19
updated: 2026-06-17
accepted_at: 2026-05-19
type: adr
binding: true
supersedes: ADR-0013-transactional-outbox
superseded_by:
related: [[ADR-0013-transactional-outbox]], [[ADR-0021-revised-tech-stack]], [[ADR-0023-realtime-transport]], [[ADR-0027-postgres-data-model]], [[ADR-0019-modular-monolith-ddd]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0014-state-machines]], [[ADR-0119-command-reception-dedup-seam]], [[../../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
---

# ADR-0028: PostgreSQL Transactional Outbox (same-tx + poll-floor + LISTEN/NOTIFY)

## Status

accepted

FMX-164 / ADR-0119 amends the audit wording on 2026-06-15: this outbox is the
committed domain-event publication path and the domain mutation trail. It is
not the pre-commit command-reception replay/dedup gate and not the separate
Audit & Security security audit log.

> **FMX-182 reference note (2026-06-17):** Older pre-mortem/security drafts used
> `ADR-0028` as a placeholder for "Save Import/Export Trust Levels." That
> mapping is invalid. Current ADR-0028 is only the PostgreSQL Transactional
> Outbox. The accepted save trust/provenance home is
> [[ADR-0116-save-trust-levels-and-provenance-posture]].

## Date

2026-05-19

## Context

[[ADR-0021-revised-tech-stack]] swapped SurrealDB → PostgreSQL+Drizzle as the
system of record. [[ADR-0013-transactional-outbox]] specified a SurrealDB
outbox + Redis Streams fan-out; with SurrealDB deferred, both pieces of that
substrate change. The transactional-outbox *pattern* is preserved unchanged:

- Domain events written to `outbox_event` in the **same transaction** as the
  state change.
- Idempotent by `event_id` (UUIDv7).
- JSON payloads, Zod-validated at producer + consumer; unknown fields ignored.
- Retention: hot table 60 days, cold archive forever in monthly partitions.
- Outbox **is** the domain mutation trail for committed domain events (no
  separate platform domain-audit table). It is not the Audit & Security
  security audit log and not the pre-commit command dedup gate.
- Consumer-side idempotency via `consumer_event_offset (consumer_name,
  event_id)` UNIQUE.
- Lag SLOs: warn >60s / >1000 pending, crit >300s / >10000.

Substrate changes:

- Outbox table is in **PostgreSQL `public`** (platform-DB schema per
  [[ADR-0027-postgres-data-model]]).
- Domain-event insert is in the **same Postgres transaction** as the domain
  write — a *stronger* guarantee than the SurrealDB→Redis "atomic in DB,
  at-least-once to Redis" original.
- Fan-out moves from Redis Streams to the
  [[ADR-0023-realtime-transport]] `RealtimeTransport` interface (SSE now,
  Centrifugo planned).

## Options Considered

For publisher → "new outbox row" notification:

- Pure polling (reliable, simple, latency-bound).
- Pure `LISTEN/NOTIFY` (lowest latency; non-durable, ephemeral on restart,
  payload-limited, **pgbouncer transaction-mode strips it**).
- Logical-replication CDC (wal2json / pgoutput) — robust at scale, heavy
  ops, slot-bloat risk on a single node.

For cold-archive:

- Native declarative range partitioning (`PARTITION BY RANGE (emitted_at)`)
  with monthly child partitions.
- Hand-rolled nightly mover into per-month plain tables (the original
  ADR-0013 approach).

## Decision

### 1. Outbox written in the same Postgres transaction as the domain change

The transactional-outbox pattern's defining guarantee. Producers must use a
typed helper provided by `packages/db` (e.g. `withOutbox(tx, event)`) that
inserts the validated event row into `public.outbox_event` inside the
caller's transaction. Lint rule: no raw `db.insert(outbox_event).values(…)`
outside that helper.

### 2. Publisher learns of new rows via **hybrid: polling floor + LISTEN/NOTIFY**

- A long-running publisher worker runs a jittered poll loop:
  ```sql
  SELECT * FROM outbox_event
  WHERE status = 'pending'
  ORDER BY event_id
  FOR UPDATE SKIP LOCKED
  LIMIT 100;
  ```
  Claim → publish via `RealtimeTransport` → `UPDATE … SET status='published'`.
- AND the worker `LISTEN`s on channel `outbox_new`; a `NOTIFY outbox_new`
  fires from the command handler after insert (or from a trigger), waking
  the loop immediately.
- **Polling is the correctness floor.** If a `NOTIFY` is missed (connection
  lost, pgbouncer drop, restart), the poll loop drains within its interval.
  `NOTIFY` is a latency optimisation only — correctness never depends on it.

Rejected: pure `LISTEN/NOTIFY` (non-durable; [[ADR-0023-realtime-transport]]
already records "does not scale; ephemeral on restart"). Rejected: logical
CDC (operationally heavy on a single Hetzner node; slot-bloat risk if the
consumer stalls; overkill for ~100 events/s).

### 3. Fan-out via the `RealtimeTransport` interface (ADR-0023)

The publisher does not call SSE directly. It writes published events to an
in-process emitter that the SSE `RealtimeTransport` implementation subscribes
to. Centrifugo later swaps in behind the same interface — no outbox change.
Consumers (notifications, projections, audit subscribers) record idempotency
in `consumer_event_offset (consumer_name, event_id)` UNIQUE.

### 4. Cold-archive — native declarative range partitioning by month

```sql
CREATE TABLE outbox_event_archive (
  event_id      uuid NOT NULL,
  emitted_at    timestamptz NOT NULL,
  -- ... full row shape ...
  PRIMARY KEY (event_id, emitted_at)
) PARTITION BY RANGE (emitted_at);

-- Monthly child partitions named `outbox_event_archive_YYYY_MM`
-- (ADR-0013 naming preserved).
```

A nightly application job (a) ensures next month's partition exists,
(b) moves rows from hot `public.outbox_event` where
`status='published' AND emitted_at < now() - interval '60 days'` into the
appropriate archive partition (`INSERT … SELECT` + `DELETE`, batched).

Drizzle-kit does not model `PARTITION BY` / `CREATE PARTITION` declaratively.
Handle this with **a hand-authored migration appended after the drizzle-kit-
generated one**: define the table as a normal `pgTable` for type inference,
and add a custom SQL migration file in the forward-only migration sequence
that recreates it as a partitioned parent + the monthly partition-creation
helper function. Documented as the one place schema is hand-SQL, gated by
the same drift check.

### 5. Schema (high level)

`public.outbox_event` (hot):

| Column | Type | Notes |
|---|---|---|
| `event_id` | `uuid not null primary key` | UUIDv7, app-generated |
| `aggregate_type` | `text not null` | bounded context |
| `aggregate_id` | `uuid not null` | branded type at TS layer |
| `event_type` | `text not null` | `<context>.<name>` |
| `payload` | `jsonb not null` | per-event Zod at producer + consumer |
| `emitted_at` | `timestamptz not null default now()` | |
| `status` | `text not null` + `CHECK IN ('pending','published','failed_terminal')` | |
| `published_at` | `timestamptz` | nullable |
| `attempts` | `integer not null default 0` + `CHECK 0..10` | |

`public.consumer_event_offset` (idempotency):

| Column | Type | Notes |
|---|---|---|
| `consumer_name` | `text not null` | |
| `event_id` | `uuid not null` | |
| `processed_at` | `timestamptz not null` | |
| `status` | `text not null` + `CHECK IN ('processed','skipped','failed_terminal')` | |
| | | `UNIQUE (consumer_name, event_id)` |

`public.outbox_event_archive` (partitioned, see §4).

### 6. Lag SLOs (unchanged from ADR-0013)

- `outbox_oldest_pending_age_seconds`: warn > 60, crit > 300.
- `outbox_pending_count`: warn > 1000, crit > 10000.
- `outbox_publisher_attempts_exceeded_total`: any > 0 = page.

### 7. Domain mutation trail - the outbox is the committed domain-event trail

No separate platform `audit_log` table is used for the domain mutation trail at
MVP. Every committed domain mutation that warrants domain audit emits an outbox
event in the same transaction; the partitioned archive is the long-term domain
mutation store. F6 GDPR Art. 17 erasure follows ADR-0013's one-way HMAC
pseudonymisation on archived domain audit events (mechanics unchanged; substrate
is now Postgres `jsonb` payloads).

This does not replace the separate Audit & Security security audit log from
ADR-0091, and it does not own the pre-commit command replay/dedup decision from
ADR-0119. Audit & Security may consume committed domain events via the outbox,
but duplicate-command acceptance is decided synchronously before domain
validation.

## Rationale

The pattern is preserved; only the substrate changes. The same-Postgres-
transaction guarantee is strictly stronger than the original SurrealDB→Redis
flow (no possibility of "domain committed but outbox lost"). The hybrid
polling-floor + `LISTEN/NOTIFY` approach avoids the durability gotcha of
pure `NOTIFY` and the ops weight of CDC, while keeping the lag SLOs hit.
Native partitioning is cheap and well-trodden in Postgres; archived
partitions can later be detached for S3 tier-3 storage as one metadata
operation.

## Consequences

Positive:

- Stronger same-transaction guarantee than the SurrealDB+Redis original.
- One ACID database for the source-of-truth + outbox + archive.
- Fan-out fully decoupled via `RealtimeTransport` (ADR-0023); swap-friendly.
- Partition pruning keeps deep-history audit queries fast.

Negative / follow-up:

- A custom hand-SQL migration is required for partitioning (one well-marked
  exception to "drizzle-kit only").
- Partition-creation is an application nightly job; a missing partition
  would block outbox insert — alert on partition presence.
- Outbox publisher worker is a new long-running process (already implied by
  ADR-0013; concrete deployment slot lands with the engineering wave).

## Supersedes

[[ADR-0013-transactional-outbox]] (substrate change; pattern preserved).

## Related Docs

- [[ADR-0013-transactional-outbox]] — superseded predecessor
- [[ADR-0027-postgres-data-model]] — sibling rework
- [[ADR-0119-command-reception-dedup-seam]] — clarifies that command dedup is a
  pre-domain reception decision, not an outbox-consumer responsibility
- [[ADR-0021-revised-tech-stack]] · [[ADR-0023-realtime-transport]] ·
  [[ADR-0019-modular-monolith-ddd]] · [[ADR-0011-server-authoritative-multiplayer]] ·
  [[ADR-0014-state-machines]]
- [[../../30-Implementation/audit-trail]] · [[../../30-Implementation/postgres-drizzle-integration]] (next engineering wave)
