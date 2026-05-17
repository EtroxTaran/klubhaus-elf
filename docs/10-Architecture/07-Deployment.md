---
title: Deployment
status: current
tags: [architecture, deployment, dokploy, observability]
created: 2026-05-15
updated: 2026-05-17
type: architecture
binding: false
related: [[09-Decisions/ADR-0017-observability-logging]], [[../30-Implementation/deployment-dokploy]], [[../30-Implementation/observability-runbook]]
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
- `surrealdb`: platform and per-save database host.
- `redis`: Redis Streams fan-out buffer once ADR-0013 outbox workers are
  implemented.
- `outbox-publisher`: future long-running worker for SurrealDB outbox to
  Redis Streams.
- `scheduler`: future long-running worker for timers, countdowns and
  retry jobs.
- `match-worker`: future extracted Match Worker for server-authoritative
  multiplayer simulation. MVP may run this inside the app/runtime; extraction
  is a deployment change. Rust is only allowed after the gate in
  [[../60-Research/match-engine-runtime-strategy]] passes.

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
- SurrealDB and Redis;
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
- Domain audit events: ADR-0013 hot 60 days + monthly archive forever.

Telemetry volumes are separate from SurrealDB save data. Backup priority:

1. SurrealDB platform/per-save data.
2. GlitchTip database and uploaded source maps.
3. Grafana dashboards and alert configuration.
4. Prometheus metrics if needed for long-range SLO history.
5. Loki/Tempo raw data only when incident/legal hold requires it.

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
