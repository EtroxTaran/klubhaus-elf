---
title: Deployment
status: current
tags: [architecture, deployment, dokploy, observability, release, versioning]
created: 2026-05-15
updated: 2026-06-19
type: architecture
binding: false
related: [[09-Decisions/ADR-0017-observability-logging]], [[../60-Research/observability-trace-backend-readd-trigger-2026-06-18]], [[../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]], [[../60-Research/surrealdb-deferral-reevaluation-watch-2026-06-19]], [[../40-Execution/fmx-166-surrealdb-deferral-watch-decision-queue-2026-06-19]], [[09-Decisions/ADR-0044-cicd-and-merge-policy]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]], [[09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]], [[09-Decisions/ADR-0132-release-versioning-app-build-process]], [[../30-Implementation/deployment-dokploy]], [[../30-Implementation/observability-runbook]], [[../30-Implementation/release-versioning-app-build-process]]
---

# Deployment

Dokploy runs Docker Compose on Hetzner. The architecture remains a
single-node deployment for MVP, with services split into app/runtime,
data and observability groups so they can move independently later.

Deployment follows the portable-pipeline / auto-merge-when-green CI/CD
policy in ADR-0044: all check logic lives in repo scripts (runnable
locally and from a thin CI workflow, no vendor lock-in), and green PRs
auto-merge on strict branch protection (docs: no review; code → `main`:
≥1 CODEOWNER review). The single-node Postgres target is the node the
ADR-0097 per-node schema ceiling is scoped to: **soft-warn at 300 live
save schemas and hard-stop at 1000**.

## Environments

- `develop` -> `dev.klubhaus-elf.de`
- `main` -> `klubhaus-elf.de`
- A staging environment may be added before closed beta if production
  observability alerts become too noisy to test safely in dev.

## Runtime Services

MVP runtime services:

- `app`: TanStack Start / Vinxi Node server on port 3000.
- `postgres`: PostgreSQL 18.x (pin the concrete 18.x at implementation,
  no floating `latest`) — system of record for platform data, one schema
  **per active save** (ADR-0097), notification records, and the outbox +
  its partitioned archive. The outbox is the canonical **domain** audit
  trail (ADR-0028/0097); there is **no** platform `audit_log` table
  (dropped by ADR-0097) — the **security** trail is the Audit & Security
  context's own append-only log. Archived saves drop out of the live
  catalog into row-level/blob storage only after verified archive material
  exists; the per-node live-schema count is a monitored SLO: warn at 300,
  hard-stop at 1000 (ADR-0097 / FMX-170).
- `outbox-publisher`: future long-running worker for the ADR-0028 Postgres
  outbox to ADR-0023 realtime fan-out.
- `scheduler`: future long-running worker for timers, countdowns, notification
  reminders, digests and retry jobs.
- `notification-worker`: future worker for Notification context policies,
  delivery attempts, provider webhooks and channel retries (ADR-0102; the
  Dexie in-app inbox is the authoritative-for-read channel, SSE/Centrifugo,
  email and Web Push are best-effort online accelerants).
- `surrealdb`: optional additive projection/live-graph store when a feature
  explicitly enables it; never the authoritative data store. FMX-166 keeps it
  disabled-by-default / Assess. No deployment version is pinned in planning;
  any future Trial must source-check and exact-pin the current stable release
  line at that time, prove rebuild/restore and disable paths, and stay
  non-authoritative. FMX-198 observed current stable patch 3.1.5 on
  2026-06-19, but that is evidence for this watch, not a future implementation
  pin.
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

## Client Delivery and Sync

- **PWA + Capacitor shell.** The responsive PWA is the single source of
  truth and carries the MVP; a thin, additive Capacitor shell is the
  post-MVP path to the App Store / Play Store, reusing the unchanged web
  `webDir` (ADR-0104). ADR-0104's accepted historical anchor is
  **Capacitor 7.x** (min iOS 14.0, Xcode 16+), but FMX-198 source checks show
  Capacitor 8.4.1 is now current stable; changing the mobile baseline is a
  Nico platform decision, not a silent docs edit. Native APNs/FCM push lands with that
  shell; until then the EU-iOS-no-Web-Push limitation (dated 2026-06-08,
  DMA-driven and reversible) constrains push on iOS.
- **Narrow cloud-sync.** Offline Sync is a thin context at MVP
  (Service-Worker cache + Dexie drafts + synchronous commands) behind a
  migration seam (ADR-0090); the server stays the single authority with
  server-authoritative re-validation + rebase. The single node serves
  command-oriented endpoints and event rehydration — the post-MVP durable
  outbox / background-sync flush is purely additive and changes no node
  topology here.

## Observability Services

ADR-0017 adds an observability group:

- `alloy`: collection agent for Docker logs, OTLP, metrics scraping and
  forwarding.
- `loki`: short-retention operational logs.
- `prometheus`: metrics and alert inputs.
- `tempo`: deferred trace backend; add only after the FMX-171
  `TempoBackendRequired` trigger is approved and fires.
- `grafana`: dashboards and alerting UI.
- `glitchtip`: crash/error reporting via Sentry-compatible SDKs.
- `glitchtip-postgres` / `glitchtip-redis`: GlitchTip backing services
  if required by the chosen deployment image.

Grafana, Prometheus, Loki, Tempo when deployed and GlitchTip are admin-only.
They must not be exposed as public anonymous dashboards. Access should be
behind Dokploy/Traefik auth, VPN, or another explicit admin gate.

## Network Boundaries

Public routes:

- app web traffic;
- crash/telemetry ingest endpoints explicitly designed for browser use.

Private routes:

- Grafana UI;
- Loki / Prometheus APIs, plus Tempo APIs when Tempo is deployed;
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
- Prometheus metrics: 15 months while it fits the dedicated TSDB disk budget.
- Tempo traces: 7 days once Tempo is enabled.
- Domain trail (the outbox): ADR-0028 Postgres hot 60 days + monthly
  archive partitions forever. This is the canonical domain audit trail
  (ADR-0097); the separate security trail is owned by the Audit & Security
  context, not a platform `audit_log` table.

Save-archive operations are retention-adjacent but distinct from telemetry
retention: at 300 live save schemas the node emits capacity warning signals; at
1000 it blocks new active save creation/reactivation until the player confirms
an archive/delete action or a future capacity decision adds another node/shard.
LRU is a suggested candidate order only, never a silent active-career archive.

FMX-171 proposes a concrete Mimir storage trigger: re-add Mimir when the daily
Prometheus capacity check shows that 15-month retention would require
`--storage.tsdb.retention.size` above 80% of dedicated Prometheus TSDB disk for
seven consecutive days.

Telemetry volumes are separate from Postgres save/notification data. Backup
priority:

1. PostgreSQL platform/per-save/notification/outbox data.
2. GlitchTip database and uploaded source maps.
3. Grafana dashboards and alert configuration.
4. Prometheus metrics if needed for long-range SLO history.
5. Loki/Tempo raw data only when incident/legal hold requires it.
6. SurrealDB projection data only if projection rebuild cost becomes material.

For save archives, whole-cluster physical backup + WAL/PITR remains the disaster
recovery baseline. Per-save archive/restore artifacts may use PostgreSQL
schema-filtered logical exports or the encrypted save envelope, but a live schema
is not dropped until the archive artifact is written, checksummed, indexed and
restorable. Restore provisions and validates a schema before flipping a save
back to `active`; the planning SLO is within 30 minutes for a typical archived
save until real save-size measurements replace it.

## Deployment Rules

- All app and worker logs are structured JSON to stdout/stderr.
- No production secret is written to logs or telemetry.
- Source maps uploaded for crash reporting are protected operational
  artifacts.
- Draft ADR-0132 proposes that future app releases build once, deploy by
  immutable OCI digest and record release/build/save/content identity in
  `release.json`; this is accepted by Nico 2026-06-19 and is not active deployment
  policy yet.
- Telemetry services are version-pinned once introduced; upgrades happen
  in a planned maintenance window.
- Alerts must be tested in dev before enabling production notification
  routes.

Implementation details live in [[../30-Implementation/deployment-dokploy]]
and operational procedures live in
[[../30-Implementation/observability-runbook]].
