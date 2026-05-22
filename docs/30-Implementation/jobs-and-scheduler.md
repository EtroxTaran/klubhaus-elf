---
title: Jobs and Scheduler
status: current
tags: [implementation, jobs, scheduler, outbox, observability, matchday, events, notifications]
created: 2026-05-17
updated: 2026-05-22
type: implementation
binding: false
adr:
  - "[[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]"
  - "[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]"
  - "[[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]"
  - "[[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]"
  - "[[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]"
  - "[[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]"
related: [[observability-runbook]], [[audit-trail]], [[deployment-dokploy]], [[notification-messaging-platform]], [[../00-Index/MVP-Scope]], [[../60-Research/match-engine-runtime-strategy]], [[../60-Research/performance-budgets]], [[../60-Research/systemic-events-player-development-venue-ops]]
---

# Jobs and Scheduler

## Purpose

Implementation scope for outbox publishing, scheduled jobs, matchday
dispatching, notification reminders and operational metrics. Code
implementation comes later; this note records the runtime shape to implement
from accepted ADRs.

## Current Approach

ADR-0028 supersedes the old SurrealDB -> Redis Streams pipeline. The current
domain event pipeline is:

1. command handler writes state and `public.outbox_event` in one PostgreSQL
   transaction;
2. publisher worker drains pending rows with `FOR UPDATE SKIP LOCKED`;
3. `LISTEN/NOTIFY` wakes the publisher for latency, while polling remains the
   correctness floor;
4. publisher sends fan-out through the ADR-0023 `RealtimeTransport` boundary;
5. consumers record idempotency in `public.consumer_event_offset`;
6. published rows older than 60 days move to monthly Postgres archive
   partitions.

Redis is not the durable event queue. It is allowed for rate limiting,
session/cache needs and Centrifugo ephemeral fan-out/history/presence when
those services are introduced.

## Worker Processes

Planned workers:

- `outbox-publisher`: claims pending Postgres outbox rows and publishes through
  `RealtimeTransport`.
- `scheduler`: runs countdowns, reminders, maintenance jobs and retry timers.
- `notification-worker`: consumes notification-relevant domain events, creates
  durable notification records, resolves preferences and dispatches channel
  attempts.
- `surreal-projection-worker`: updates additive SurrealDB graph/live read
  projections from Postgres truth when projection usage is enabled.
- `simulation-scheduler`: opens deterministic simulation windows for
  day/week/match/season ticks and dispatches commands to owning contexts.
- `archiver`: moves published outbox rows older than 60 days into monthly
  Postgres archive partitions.
- `match-worker`: future context worker for server-authoritative multiplayer
  match simulation. MVP Roguelite progression may run through the app/runtime
  command path; extraction comes when operational load demands it.
- future context workers: spectator/watch-party and chat workers.

## Notification Scheduling

Notification schedules are durable rows owned by the Notification context. The
scheduler only wakes due rows; it does not decide copy, policy or channels.

Required schedule classes:

- immediate in-app inbox creation from domain events;
- async multiplayer deadline reminders;
- digest windows;
- transient delivery retries with exponential backoff;
- provider-webhook follow-up work such as bounce/complaint suppression.

Quiet hours, category rules and channel preferences are resolved by the
Notification context, not by the generic scheduler.

## Matchday Scheduling

Matchday is a priority queue, not a flat list of fixtures. The scheduler
assigns every fixture a `quality_profile` before dispatching work to the Match
Worker:

| Priority | Fixtures | Profile |
|---:|---|---|
| 1 | Human-vs-human, human-vs-AI, explicitly watched fixtures | `competitive-full` |
| 2 | Title deciders, relegation deciders, key cup/continental fixtures, direct rivals | `background-detailed` or promoted to `competitive-full` |
| 3 | Other active-league AI fixtures | `background-detailed` |
| 4 | Rest-world fixtures | `background-fast` |

Scheduling rules:

- MVP Roguelite match resolution is server-confirmed, with the deterministic
  engine contract kept compatible with future local singleplayer authority.
- Human-involving async multiplayer fixtures always run server-side when
  multiplayer ships.
- AI-vs-AI fixtures store seed + lineups + tactics + profile + summary by
  default; full event logs are generated on demand for watch-party/audit.
- The scheduler batches `background-fast` jobs to avoid long matchday waits.
- Worker concurrency is capped by deployment tier and observed lag; adding more
  workers must not starve outbox publishing, notification delivery or spectator
  streams.

## Future Extracted Match Worker

If the Match Worker is extracted, it consumes scheduled simulation jobs and
returns deterministic outputs to the Match context. It may remain TypeScript or
eventually become Rust, but Rust cannot become authoritative until the gate in
[[../60-Research/match-engine-runtime-strategy]] passes.

Required operational hooks:

- `/healthz` or equivalent liveness endpoint;
- structured JSON logs with `match_id`, `engine_version`, `quality_profile`,
  `job_id`, `duration_ms`, `status` and `correlation_id`;
- metrics for queue lag, in-flight jobs, duration by profile, failures by
  reason, and replay/audit requests;
- graceful shutdown that finishes or releases in-flight jobs;
- backpressure so matchday batches do not overwhelm Postgres, realtime fan-out
  or notification delivery.

## Event Routing

Outbox event types follow `<context>.<event_name>`.

Consumers subscribe by event type prefix or explicit allow-list. The first
implementation can use a single publisher loop over `public.outbox_event`; if
consumer-specific queues are needed later, they must remain derived from the
Postgres outbox and preserve consumer idempotency.

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

Outbox publisher retry policy:

- transient failure: increment retry count and apply exponential backoff;
- batch size: start small, then tune after metrics exist;
- max retries: 10 per ADR-0028 hot outbox shape;
- after cap: mark row `failed_terminal`, emit alert and keep the row for
  operator action.

Notification channel retry policy is governed by
[[notification-messaging-platform]] and stored as `DeliveryAttempt` rows.

Client outbox retry policy remains governed by ADR-0020 and PWA/offline docs.

## Metrics

Required metrics:

| Metric | Type | Notes |
|---|---|---|
| `outbox_pending_count` | gauge | pending rows in hot Postgres outbox |
| `outbox_oldest_age_seconds` | gauge | age of oldest pending row |
| `outbox_publish_total` | counter | successful publishes |
| `outbox_publish_failures_total` | counter | failed publish attempts |
| `realtime_publish_total` | counter | published events by transport |
| `realtime_publish_failures_total` | counter | failed transport publishes |
| `notification_due_count` | gauge | due notification schedules |
| `notification_delivery_attempt_total` | counter | attempts by channel/provider/status |
| `notification_delivery_lag_seconds` | histogram | event-to-channel delivery lag |
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

ADR-0028 thresholds:

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
- Postgres query;
- realtime publish;
- notification policy evaluation;
- provider adapter call;
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
- 2026-05-22: Rewritten for ADR-0028 Postgres outbox and ADR-0043
  Notification/Messaging platform; removed SurrealDB-outbox and Redis Streams
  as durable pipeline.
