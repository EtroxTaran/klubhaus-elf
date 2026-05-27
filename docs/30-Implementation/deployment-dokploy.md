---
title: Dokploy Deployment
status: current
tags: [deployment, implementation, dokploy, observability]
created: 2026-05-15
updated: 2026-05-22
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]], [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
related:
  - [[../10-Architecture/07-Deployment]]
  - [[observability-runbook]]
  - [[client-telemetry]]
---

# Dokploy Deployment

> **Confirmed decision 2026-05-19 — Nico (owner) ([[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]], [[../10-Architecture/11-Risks]]).**
> Dokploy on the existing Hetzner machine **stays** — this is a deliberate,
> owner-confirmed choice, no longer "research default / reconsider". Dokploy
> runs Docker Swarm under the hood; on a single node we accept Swarm footguns
> (silent failed deploys, stale-`:latest`-image bug, single Traefik ingress) in
> exchange for its DB/volume backup-to-S3 + dashboard UX. The following
> mitigations are therefore **mandatory** (the price of keeping Dokploy): hard
> disk/retention caps on observability data; tested off-box EU backups (untested
> backup = no backup); external (out-of-box) uptime alerting; a rehearsed
> restore runbook. Kamal 2 / Compose+Caddy is retained only as a **fallback if
> the mandatory mitigations prove insufficient in practice** — not a planned
> migration.

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
- `postgres`: system of record for platform data, per-save schemas,
  notification records, outbox and audit archive.

Planned runtime additions from accepted ADRs:

- `outbox-publisher`: Postgres outbox to `RealtimeTransport` worker
  (ADR-0028 + ADR-0023).
- `scheduler`: countdowns, retries, notification reminders, digests and
  maintenance jobs.
- `notification-worker`: notification policy, delivery attempts, provider
  webhooks and channel retries.
- `surrealdb`: optional additive projection/live-graph store; not the system of
  record.
- `redis`: sessions/cache/rate limits and future Centrifugo engine storage; not
  a durable event queue.
- `centrifugo`: future realtime scale service for presence, recovery, history
  and horizontal fan-out.
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
- Postgres, SurrealDB, Redis and Centrifugo.

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

- PostgreSQL platform/per-save/notification/outbox data.
- SurrealDB projection data only if enabled and rebuild cost matters.
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

Domain audit retention is not configured here; ADR-0028 stores it in
Postgres outbox/archive partitions.

## Backups

Backup priority:

1. PostgreSQL platform/per-save/notification/outbox data.
2. GlitchTip Postgres and source maps.
3. Grafana dashboards and alert configuration.
4. Prometheus if long-range SLO history is required.
5. Loki/Tempo only for active incident/legal hold windows.
6. SurrealDB projection data only if enabled and rebuild cost matters.

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
- `docker-compose.yml`: current app + Postgres production-like stack.
- `docker-compose.dev.yml`: local Postgres for development.
- `apps/web/src/routes/healthz.ts`: app health response.
## Related

- [[../10-Architecture/07-Deployment]]
- [[observability-runbook]]
- [[client-telemetry]]
