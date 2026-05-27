---
title: Deployment
status: current
tags: [architecture, deployment, dokploy, observability]
created: 2026-05-15
updated: 2026-05-22
type: architecture
binding: false
related:
  - [[09-Decisions/ADR-0017-observability-logging]]
  - [[09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[09-Decisions/ADR-0043-notification-and-messaging-platform]]
  - [[../30-Implementation/deployment-dokploy]]
  - [[../30-Implementation/observability-runbook]]
---

# Deployment

Dokploy runs Docker Compose on Hetzner. The architecture remains a
single-node deployment for MVP, with services split into app/runtime,
data and observability groups so they can move independently later.

## Environments

- `develop` -> `dev.soccer-manager.etrox.de`
- `main` -> `soccer-manager.etrox.de`
- A staging environment may be added before closed beta if production
  observability alerts become too noisy to test safely in dev.

## Runtime Services

MVP runtime services:

- `app`: TanStack Start / Vinxi Node server on port 3000.
- `postgres`: system of record for platform data, per-save schemas,
  notification records, outbox and audit archive.
- `outbox-publisher`: future long-running worker for the ADR-0028 Postgres
  outbox to ADR-0023 realtime fan-out.
- `scheduler`: future long-running worker for timers, countdowns, notification
  reminders, digests and retry jobs.
- `notification-worker`: future worker for Notification context policies,
  delivery attempts, provider webhooks and channel retries.
- `surrealdb`: optional additive projection/live-graph store when a feature
  explicitly enables it; never the authoritative data store.
- `redis`: session/cache/rate-limit and future Centrifugo engine storage;
  never the durable outbox or audit store.
- `match-worker`: future extracted Match Worker for server-authoritative
  multiplayer simulation. MVP may run this inside the app/runtime; extraction
  is a deployment change. Rust is only allowed after the gate in
  [[../60-Research/match-engine-runtime-strategy]] passes.
- `centrifugo`: future realtime scale service for presence, recovery, history
  and horizontal notification/watch-party fan-out.

`/healthz` is the app liveness contract. The Dockerfile already uses it
for the app container health check.

## Observability Services

ADR-0017 adds an observability group:

- `alloy`: collection agent for Docker logs, OTLP, metrics scraping and
  forwarding.
- `loki`: short-retention operational logs.
- `prometheus`: metrics and alert inputs.
- `tempo`: sampled traces after v1 logs/metrics are stable.
- `grafana`: dashboards and alerting UI.
- `glitchtip`: crash/error reporting via Sentry-compatible SDKs.
- `glitchtip-postgres` / `glitchtip-redis`: GlitchTip backing services
  if required by the chosen deployment image.

Grafana, Prometheus, Loki, Tempo and GlitchTip are admin-only. They must
not be exposed as public anonymous dashboards. Access should be behind
Dokploy/Traefik auth, VPN, or another explicit admin gate.

## Network Boundaries

Public routes:

- app web traffic;
- crash/telemetry ingest endpoints explicitly designed for browser use.

Private routes:

- Grafana UI;
- Loki / Prometheus / Tempo APIs;
- Alloy internal OTLP endpoints;
- Postgres, SurrealDB, Redis and Centrifugo;
- GlitchTip admin UI unless intentionally exposed behind auth.

Browser telemetry must use a same-origin endpoint or reverse-proxied
ingest path. The OpenTelemetry collector must not be directly exposed to
the public internet.

## Retention and Storage

Initial retention:

- Loki raw logs: 14 days.
- GlitchTip crash reports: 30 days.
- Prometheus metrics: 15 months.
- Tempo traces: 7 days.
- Domain audit events: ADR-0028 Postgres hot 60 days + monthly archive
  partitions forever.

Telemetry volumes are separate from Postgres save/notification data. Backup
priority:

1. PostgreSQL platform/per-save/notification/outbox data.
2. GlitchTip database and uploaded source maps.
3. Grafana dashboards and alert configuration.
4. Prometheus metrics if needed for long-range SLO history.
5. Loki/Tempo raw data only when incident/legal hold requires it.
6. SurrealDB projection data only if projection rebuild cost becomes material.

## Deployment Rules

- All app and worker logs are structured JSON to stdout/stderr.
- No production secret is written to logs or telemetry.
- Source maps uploaded for crash reporting are protected operational
  artifacts.
- Telemetry services are version-pinned once introduced; upgrades happen
  in a planned maintenance window.
- Alerts must be tested in dev before enabling production notification
  routes.

Implementation details live in [[../30-Implementation/deployment-dokploy]]
and operational procedures live in
[[../30-Implementation/observability-runbook]].
## Related

- [[09-Decisions/ADR-0017-observability-logging]]
- [[09-Decisions/ADR-0028-postgres-transactional-outbox]]
- [[09-Decisions/ADR-0043-notification-and-messaging-platform]]
- [[../30-Implementation/deployment-dokploy]]
- [[../30-Implementation/observability-runbook]]
