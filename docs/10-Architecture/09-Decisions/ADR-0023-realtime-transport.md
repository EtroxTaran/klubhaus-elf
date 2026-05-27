---
title: ADR-0023 Realtime Transport
status: draft
tags: [adr, architecture, realtime, messaging]
created: 2026-05-19
updated: 2026-05-22
accepted_at: 2026-05-19
type: adr
binding: true
supersedes:
superseded_by:
related: [[ADR-0021-revised-tech-stack]], [[ADR-0013-transactional-outbox]], [[ADR-0028-postgres-transactional-outbox]], [[ADR-0043-notification-and-messaging-platform]], [[ADR-0011-server-authoritative-multiplayer]], [[../11-Risks]]
---

# ADR-0023: Realtime Transport

## Status

accepted

## Date

2026-05-19

## Context

The game needs an in-game inbox, live match updates, and multiplayer
notifications. Nearly all of these are **server→client push**. ADR-0001
implied the SurrealDB outbox/Live-Queries as the realtime substrate; under
[[ADR-0021-revised-tech-stack]] SurrealDB is no longer the primary store, so
realtime must be decoupled from the database and made swappable.

2026-05-22 update: [[ADR-0043-notification-and-messaging-platform]] locks
notifications as a first-party bounded context. Realtime transports are
wake-up/update channels only; durable notification truth lives in PostgreSQL
and can be projected into SurrealDB/Dexie.

## Options Considered

- SurrealDB Live Queries (couples the most user-visible feature to the least
  mature, now-deferred dependency — rejected as the primary path).
- Postgres `LISTEN/NOTIFY` (does not scale; ephemeral on restart).
- SSE from TanStack Start server routes (native, zero new infra, server→client).
- A self-hosted broker (Centrifugo) for guaranteed delivery/recovery/presence
  and bidirectional multiplayer.

## Decision

Define a **`RealtimeTransport` interface** in `apps/web/src/lib`. Ship an
**SSE implementation** (TanStack Start server route returning a stream;
integrates with the TanStack Query cache) as the MVP transport for the inbox,
live match ticker, and notifications.

**Centrifugo** (single Apache-2.0 Docker container) is the planned upgrade —
swapped in behind the same interface — when guaranteed delivery/message-recovery
on flaky mobile, presence, or bidirectional multiplayer chat become real
requirements. The SurrealDB Live-Query option, if ever revisited, also lands
behind this interface.

For notification and messaging surfaces, Centrifugo is the first scale step
when presence, history, recovery or horizontal fan-out become real. Its Redis
engine is allowed for ephemeral fan-out/history/presence only; Redis is not the
durable notification queue or audit store.

## Rationale

SSE covers ~all stated needs with zero new infrastructure and is native to the
chosen framework. The interface boundary makes the SSE→Centrifugo (or
→SurrealDB-Live) move a contained, reversible swap rather than a rewrite —
consistent with the project's "reversible bet behind an interface" posture.

## Consequences

Positive:

- Realtime decoupled from the system of record; the substrate is swappable.
- Zero added ops at MVP; Centrifugo is a planned, low-risk single-container
  upgrade.

Negative:

- SSE is one-directional; bidirectional features (chat) force the Centrifugo
  upgrade. Browsers cap ~6 SSE connections per domain on HTTP/1.1 (fine over
  HTTP/2 behind the reverse proxy).
- [[ADR-0028-postgres-transactional-outbox]] reconciles the old ADR-0013
  substrate: the outbox pattern holds, but durable event storage is Postgres
  and fan-out goes through this transport boundary.
- Notification clients must not treat SSE/Centrifugo delivery as durable. They
  always reconcile against Notification/Postgres state and Dexie mirrors only
  cache that state.

## Supersedes

None.

## Related Docs

- [[ADR-0021-revised-tech-stack]] · [[ADR-0013-transactional-outbox]] ·
  [[ADR-0028-postgres-transactional-outbox]] ·
  [[ADR-0043-notification-and-messaging-platform]] ·
  [[ADR-0011-server-authoritative-multiplayer]] · [[../11-Risks]]
