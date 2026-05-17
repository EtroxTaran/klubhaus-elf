---
title: Jobs and Scheduler
status: current
tags: [implementation, jobs, scheduler, outbox, redis-streams, observability]
created: 2026-05-17
updated: 2026-05-17
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
related: [[observability-runbook]], [[audit-trail]], [[deployment-dokploy]]
---

# Jobs and Scheduler

## Purpose

Implementation scope for the outbox publisher, scheduled jobs and their
operational metrics. This note covers Wave 3 E14 at the architecture
planning level; code implementation comes later.

## Current Approach

ADR-0013 locks the domain event pipeline:

1. command handler writes state + `outbox_event` in one SurrealDB
   transaction;
2. publisher worker reads pending rows;
3. publisher writes to Redis Streams;
4. consumers process through consumer groups;
5. consumers record idempotent offsets in `consumer_event_offset`;
6. published rows older than 60 days move to monthly archive tables.

## Worker Processes

Planned workers:

- `outbox-publisher`: claims pending SurrealDB outbox rows and publishes
  them to Redis Streams.
- `scheduler`: runs countdowns, reminders, maintenance jobs and retry
  timers.
- `archiver`: moves published outbox rows older than 60 days into
  monthly cold partitions.
- future context workers: match, notification, spectator/watch-party and
  projection consumers.

## Stream Naming

Default stream naming is `events:<aggregate_type>`.

Allowed fallback: one `events:all` stream if operational testing shows
per-aggregate streams add unnecessary complexity. This is the remaining
E14 implementation choice and does not change ADR-0013 semantics.

## Retry Policy

Publisher retry policy:

- transient failure: increment retry count and apply exponential backoff;
- batch size: start small, then tune after metrics exist;
- max retries: 20;
- after cap: mark row `failed`, emit alert and keep the row for operator
  action.

Client outbox retry policy remains governed by ADR-0002 and background
sync docs.

## Metrics

Required metrics:

| Metric | Type | Notes |
|---|---|---|
| `outbox_pending_count` | gauge | pending rows in hot outbox |
| `outbox_oldest_age_seconds` | gauge | age of oldest pending row |
| `outbox_publish_total` | counter | successful publishes |
| `outbox_publish_failures_total` | counter | failed publish attempts |
| `redis_stream_lag_per_consumer_group` | gauge | lag by stream/group |
| `job_run_total` | counter | scheduler job runs by job type/status |
| `job_duration_seconds` | histogram | job duration by job type |
| `job_retry_total` | counter | retries by job type |
| `archiver_moved_total` | counter | archived rows by partition |
| `archiver_failure_total` | counter | archive failures |

ADR-0013 thresholds:

| Metric | Warning | Critical |
|---|---:|---:|
| `outbox_oldest_age_seconds` | > 60 s | > 300 s |
| `outbox_pending_count` | > 1,000 | > 10,000 |
| publish failure rate over 5 min | > 1% | > 5% |

## Logs

Workers log structured JSON with:

- `service`;
- `worker_name`;
- `job_type`;
- `event_id`;
- `correlation_id`;
- `aggregate_type`;
- `aggregate_id`;
- `attempt`;
- `duration_ms`;
- `status`;
- redacted `error_code` / `error_message`.

Payloads are never logged.

## Traces

Once Tempo is enabled, trace:

- claim batch;
- SurrealDB query;
- Redis stream write;
- consumer processing;
- idempotency offset write;
- archiver batch.

## Supervision

Dokploy should restart crashed workers. Workers must handle shutdown by:

- stopping new claims;
- finishing in-flight rows when practical;
- leaving uncompleted rows claimable by a later run;
- writing a final lifecycle log.

## Change History

- 2026-05-17: Created for ADR-0013/ADR-0017 observability planning.
