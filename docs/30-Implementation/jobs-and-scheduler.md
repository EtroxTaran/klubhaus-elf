---
title: Jobs and Scheduler
status: current
tags: [implementation, jobs, scheduler, outbox, redis-streams, observability, matchday, events]
created: 2026-05-17
updated: 2026-05-17
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
related: [[observability-runbook]], [[audit-trail]], [[deployment-dokploy]], [[../60-Research/match-engine-runtime-strategy]], [[../60-Research/performance-budgets]], [[../60-Research/systemic-events-player-development-venue-ops]]
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
- `simulation-scheduler`: opens deterministic simulation windows for
  day/week/match/season ticks and dispatches commands to owning contexts.
  It coordinates player lifecycle and systemic event evaluation but does
  not mutate domain state directly.
- `archiver`: moves published outbox rows older than 60 days into
  monthly cold partitions.
- `match-worker`: future context worker for server-authoritative
  multiplayer match simulation. MVP may run in the app/runtime; extraction
  comes when operational load demands it.
- future context workers: notification, spectator/watch-party and
  projection consumers.

## Matchday Scheduling

Matchday is a priority queue, not a flat list of fixtures. The scheduler
assigns every fixture a `quality_profile` before dispatching work to the
Match Worker:

| Priority | Fixtures | Profile |
|---:|---|---|
| 1 | Human-vs-human, human-vs-AI, explicitly watched fixtures | `competitive-full` |
| 2 | Title deciders, relegation deciders, key cup/continental fixtures, direct rivals | `background-detailed` or promoted to `competitive-full` |
| 3 | Other active-league AI fixtures | `background-detailed` |
| 4 | Rest-world fixtures | `background-fast` |

Scheduling rules:

- Human-involving async multiplayer fixtures always run server-side.
- AI-vs-AI fixtures store seed + lineups + tactics + profile + summary by
  default; full event logs are generated on demand for watch-party/audit.
- The scheduler batches `background-fast` jobs to avoid long matchday waits.
- Worker concurrency is capped by deployment tier and observed lag; adding more
  workers must not starve outbox publishing or spectator streams.
- Floor-tier singleplayer devices downgrade background profiles before blocking
  the UI thread. Server-side multiplayer does not use client device tier for
  authority.

## Future Extracted Match Worker

If the Match Worker is extracted, it consumes scheduled simulation jobs and
returns deterministic outputs to the Match context. It may remain TypeScript or
eventually become Rust, but Rust cannot become authoritative until the gate in
[[../60-Research/match-engine-runtime-strategy]] passes.

Required operational hooks for the extracted worker:

- `/healthz` or equivalent liveness endpoint;
- structured JSON logs with `match_id`, `engine_version`, `quality_profile`,
  `job_id`, `duration_ms`, `status` and `correlation_id`;
- metrics for queue lag, in-flight jobs, duration by profile, failures by
  reason, and replay/audit requests;
- graceful shutdown that finishes or releases in-flight jobs;
- backpressure so matchday batches do not overwhelm Redis Streams, SurrealDB or
  spectator fan-out.

## Stream Naming

Default stream naming is `events:<aggregate_type>`.

Allowed fallback: one `events:all` stream if operational testing shows
per-aggregate streams add unnecessary complexity. This is the remaining
E14 implementation choice and does not change ADR-0013 semantics.

## Simulation Tick Responsibilities

ADR-0018 adds scheduler-facing simulation windows:

| Window | Scheduler action | Owning contexts |
|---|---|---|
| Day tick | active-club reminders, light venue checks, notification digests | League, Club, Notification |
| Week tick | dispatch training, development, mentoring, injury-risk and venue operations commands | Training, Squad & Player, Club |
| Match pre/live/post | dispatch match-day event evaluation and persist match facts | League, Match, Club, Squad & Player |
| Season rollover | structural events, youth intake, long-term venue/board checks | League, Club, Squad & Player |

The scheduler only opens windows and routes commands. It must not compute
development deltas, decide injuries, mutate venue state or render narrative
text itself.

All simulation windows must carry:

- save/world id;
- deterministic tick id (`season/week/day/match`);
- correlation id;
- engine/content version when relevant;
- RNG stream label or sub-label expected by the owning context.

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
| `simulation_tick_duration_seconds` | histogram | deterministic simulation window duration by tick type |
| `simulation_tick_failure_total` | counter | failed tick dispatches by tick type/context |
| `match_jobs_pending_count` | gauge | pending simulation jobs by quality profile |
| `match_job_duration_seconds` | histogram | match worker duration by profile and engine version |
| `match_job_failures_total` | counter | failed match jobs by reason |
| `match_worker_inflight_count` | gauge | currently running match simulations |
| `match_replay_requests_total` | counter | on-demand AI-vs-AI replay/audit jobs |

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
