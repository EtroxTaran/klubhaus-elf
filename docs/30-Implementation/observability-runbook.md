---
title: Observability Runbook
status: current
tags: [implementation, observability, logging, monitoring, incident-response]
created: 2026-05-17
updated: 2026-05-22
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
related:
  - [[client-telemetry]]
  - [[deployment-dokploy]]
  - [[jobs-and-scheduler]]
  - [[audit-trail]]
  - [[incident-response]]
---

# Observability Runbook

## Purpose

Operational playbook for logs, crash reports, metrics, traces, dashboards,
alerts and telemetry retention.

## Current Approach

ADR-0017 selects:

- GlitchTip for crash/error reports.
- Grafana Loki for logs.
- Prometheus for metrics.
- Tempo for traces.
- Grafana Alloy for collection.
- Grafana for dashboards and alerting.
- OpenTelemetry JS for instrumentation.

Until implementation lands, `/healthz`, Docker health checks, CI
artifacts and PostgreSQL stdout logs are the available signals.

## Dashboards

Minimum dashboards before beta:

- **Overview**: app availability, request rate, 5xx rate, p95 latency,
  container restarts, current release.
- **Client stability**: crash-free sessions, errors by release, service
  worker failures, IndexedDB failures, failed PWA updates.
- **Offline sync**: pending commands, failed commands, replay duration,
  retry exhaustion, rejected-with-reason counts.
- **Outbox**: `outbox_pending_count`, `outbox_oldest_age_seconds`,
  `outbox_publish_total`, `outbox_publish_failures_total`,
  `redis_stream_lag_per_consumer_group`.
- **Telemetry pipeline**: Alloy ingest, Loki write failures, Prometheus
  scrape health, Tempo ingest, GlitchTip queue health, disk usage.
- **Performance**: Web Vitals sample, server p95/p99 latency, slow
  PostgreSQL spans, match worker duration.

## Alerts

Initial alert policy:

| Alert | Warning | Critical |
|---|---|---|
| App health | intermittent `/healthz` failures | sustained failure or restart loop |
| Server errors | 5xx spike over 5 min | sustained 5xx or global outage |
| Client crashes | release-specific spike | major release crash regression |
| Service worker | registration/runtime spike | offline shell unavailable |
| IndexedDB | quota / transaction spike | save durability at risk |
| Outbox age | > 60 s | > 300 s |
| Outbox pending | > 1,000 | > 10,000 |
| Publish failures | > 1% 5 min | > 5% 5 min |
| Redis consumer lag | rising above normal | stale consumer group |
| Telemetry ingest | partial drop | blind spot across a signal class |
| Disk usage | > 75% | > 90% |

Alerts must include: dashboard link, suspected service, runbook link and
first triage query.

## Triage Flow

1. Check the overview dashboard for release, deploy time and container
   restarts.
2. Confirm user impact: client crash spike, 5xx rate, sync backlog,
   support reports.
3. Query Loki by `correlation_id`, `request_id`, `service`, `release`
   and `aggregate_id` if present.
4. Check GlitchTip for grouped exceptions and source-map quality.
5. Check Prometheus for saturation: CPU, memory, disk, queue depth.
6. Check Tempo only when traces are enabled and the issue spans services
   or workers.
7. If domain state may be affected, query the ADR-0013 outbox/audit
   tables through the Audit context, not Loki.

## Log Queries To Standardise

Create saved Grafana queries for:

- errors by `service` and `release`;
- all entries for one `correlation_id`;
- service worker diagnostics by browser family;
- IndexedDB / quota failures;
- outbox publisher retries;
- Redis consumer lag warnings;
- telemetry redaction drops.

## Retention Jobs

Retention policy:

- Loki raw logs: 14 days.
- GlitchTip crash reports: 30 days.
- Prometheus metrics: 15 months.
- Tempo traces: 7 days.

Retention job failures are alertable because they create privacy and disk
risks.

## Backups and Restore

Back up:

- Grafana dashboards and alert rules.
- GlitchTip database and source maps.
- Prometheus only if SLO history must survive rebuild.

Do not treat Loki or Tempo as the business audit trail. Restoring domain
history uses PostgreSQL outbox/archive partitions per ADR-0028.

## Access

Grafana, Loki, Prometheus, Tempo and GlitchTip are admin-only. Access is
granted by operational need and removed when no longer needed.

Source maps are sensitive operational artifacts. They are available only
to maintainers who can triage production crashes.

## Change History

- 2026-05-17: Created for ADR-0017.
## Related

- [[client-telemetry]]
- [[deployment-dokploy]]
- [[jobs-and-scheduler]]
- [[audit-trail]]
- [[incident-response]]
