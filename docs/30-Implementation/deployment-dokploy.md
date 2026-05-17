---
title: Dokploy Deployment
status: current
tags: [deployment, implementation, dokploy, observability]
created: 2026-05-15
updated: 2026-05-17
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
related: [[../10-Architecture/07-Deployment]], [[observability-runbook]], [[client-telemetry]]
---

# Dokploy Deployment

## Purpose

This note describes how the Docker/Dokploy deployment should host the app
and the self-hosted observability stack selected by ADR-0017.

## Target Apps

- `soccer-manager-dev`: branch `develop`, domain `dev.soccer-manager.etrox.de`
- `soccer-manager-prod`: branch `main`, domain `soccer-manager.etrox.de`

## Required Nico-provided access

- Dokploy URL and account/API access.
- DNS status for `*.etrox.de`.
- GitHub App/webhook permissions.
- Staging-only environment variables.

## Health check

Use `/healthz` on the app container.

The current Dockerfile probes:

```text
http://127.0.0.1:3000/healthz
```

Changing the path requires updating the Dockerfile, Dokploy checks and
dashboards together.

## Runtime Stack

Initial compose services:

- `app`: TanStack Start / Vinxi app.
- `surrealdb`: app data.

Planned runtime additions from accepted ADRs:

- `redis`: Redis Streams fan-out buffer for ADR-0013.
- `outbox-publisher`: SurrealDB outbox to Redis Streams worker.
- `scheduler`: countdowns, retries and maintenance jobs.
- `match-worker`: extracted server-authoritative match simulation worker
  when load justifies it. MVP can run match simulation inside the app
  runtime; a future Rust worker is gated by
  [[../60-Research/match-engine-runtime-strategy]].

All runtime services write structured JSON logs to stdout/stderr once
logging implementation begins.

## Observability Stack

Add the observability services as their own Dokploy compose group or a
clearly separated section in the main stack:

| Service | Purpose | Exposure |
|---|---|---|
| `grafana` | dashboards and alerts | admin-only |
| `alloy` | log/metric/trace collection | private except explicit browser ingest proxy |
| `loki` | operational logs | private |
| `prometheus` | metrics | private |
| `tempo` | traces | private |
| `glitchtip` | crash/error reporting | ingest public; admin protected |
| `glitchtip-postgres` | GlitchTip data | private |
| `glitchtip-redis` | GlitchTip queue/cache | private |

Prometheus/Tempo may be added after Loki/GlitchTip if rollout needs to
stay smaller. The accepted target remains the full stack.

## Routing and Access

Public:

- app domain;
- crash-report ingest endpoint;
- optional same-origin telemetry ingest endpoint.

Protected/admin-only:

- Grafana UI;
- GlitchTip admin UI;
- Prometheus, Loki and Tempo APIs;
- Alloy debug UI / internal endpoints;
- SurrealDB and Redis.

Recommended access controls:

- Traefik/Dokploy basic auth or forward auth for admin UIs.
- IP allowlist or VPN when available.
- No anonymous Grafana dashboards.
- No direct public OTLP collector endpoint.

Browser telemetry should post to the app origin, for example an eventual
`/api/telemetry/*` endpoint, where rate limits and redaction run before
forwarding to Alloy or GlitchTip.

## Volumes

Persist separately:

- SurrealDB data.
- Grafana data, dashboards and alert rules.
- Loki chunks/index.
- Prometheus time-series database.
- Tempo trace blocks.
- GlitchTip database and uploaded source maps.

Do not co-locate telemetry volumes with encrypted save data in a way that
makes restore or deletion ambiguous.

## Retention

Configure retention to match ADR-0017:

- Loki: 14 days raw logs.
- GlitchTip: 30 days crash reports.
- Prometheus: 15 months metrics.
- Tempo: 7 days traces.
- Client offline telemetry: max 24 hours before send/drop.

Domain audit retention is not configured here; ADR-0013 stores it in
SurrealDB outbox/archive tables.

## Backups

Backup priority:

1. SurrealDB data.
2. GlitchTip Postgres and source maps.
3. Grafana dashboards and alert configuration.
4. Prometheus if long-range SLO history is required.
5. Loki/Tempo only for active incident/legal hold windows.

Restore tests should prove that Grafana dashboards, alert rules and
GlitchTip source maps survive a stack rebuild.

## Alert Delivery

Start with non-paging channels in dev. Production alert delivery is added
only after:

- alert rules are exercised in dev;
- false positives are tuned;
- incident-response ownership is documented in
  [[observability-runbook]] and later [[incident-response]].

## Upgrade Cadence

- Pin container versions for observability services once introduced.
- Review security updates monthly.
- Upgrade dev first, then production.
- Keep release notes for Grafana, Loki, Prometheus, Tempo, Alloy and
  GlitchTip in the deployment change record.

## Current Code Pointers

- `Dockerfile`: app build and `/healthz` Docker health check.
- `docker-compose.yml`: current app + SurrealDB production-like stack.
- `docker-compose.dev.yml`: local SurrealDB for development.
- `apps/web/src/routes/healthz.ts`: app health response.
