---
title: Crosscutting Concerns
status: current
tags: [architecture, security, quality, observability, logging]
created: 2026-05-15
updated: 2026-05-22
type: architecture
binding: false
related:
  - [[09-Decisions/ADR-0017-observability-logging]]
  - [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[09-Decisions/ADR-0003-match-engine]]
  - [[09-Decisions/ADR-0013-transactional-outbox]]
  - [[09-Decisions/ADR-0041-presentation-renderer-strategy]]
  - [[../60-Research/performance-budgets]]
  - [[../60-Research/presentation-renderer-strategy]]
  - [[../60-Research/telemetry-privacy]]
  - [[../30-Implementation/observability-runbook]]
  - [[../30-Implementation/client-telemetry]]
---

# Crosscutting Concerns

This chapter defines project-wide rules for concerns that every bounded
context, route, worker and PWA component must follow. Accepted ADRs remain
the binding source when there is a conflict.

## Logging and Observability

ADR-0017 defines the observability stack:

- Grafana Loki for operational logs.
- Prometheus for metrics.
- Grafana Tempo for traces.
- Grafana Alloy for collection.
- Grafana for dashboards and alerting.
- GlitchTip with Sentry-compatible SDKs for crash/error reports.
- OpenTelemetry JS as the instrumentation contract.

Operational logs, crash reports, metrics, traces and domain audit events
are different data classes. Do not collapse them into one store.

## Structured Logs

Production logs must be structured JSON written to stdout/stderr. Docker
and Alloy ship container logs to Loki. File logs are only allowed for
temporary local debugging and must not be required in production.

Every app/server/worker log entry should include:

| Field | Required | Notes |
|---|---:|---|
| `timestamp` | yes | ISO-8601 or logger-native timestamp |
| `level` | yes | `debug`, `info`, `warn`, `error`, `fatal` |
| `service` | yes | e.g. `web`, `outbox-publisher`, `scheduler` |
| `environment` | yes | `dev`, `staging`, `prod` |
| `release` | yes | build/release identifier |
| `message` | yes | short static message, no PII |
| `correlation_id` | when available | propagated across request/event chains |
| `request_id` | HTTP/server only | one id per inbound request |
| `user_telemetry_id` | when needed | pseudonymous; never email/username |
| `aggregate_type` / `aggregate_id` | when needed | no user-entered strings |
| `duration_ms` | timed operations | integer milliseconds |

Log levels:

- `debug`: local/dev diagnostics only; sampled or disabled in production.
- `info`: lifecycle events, deploy/build markers, successful long-running
  jobs, important state transitions.
- `warn`: recoverable degradation, retries, quota warnings, validation
  near-misses, slow operations above budget.
- `error`: failed operation needing developer or operator attention.
- `fatal`: process cannot continue and should restart.

Never log secrets, credentials, tokens, cookies, emails, real names,
free-text input, raw request bodies, save payloads, encrypted save blobs,
full Dexie rows or community-pack user content.

## Correlation and Tracing

Each inbound request gets a `request_id`. Commands and domain events carry
`correlation_id` and, when relevant, `causation_id` per ADR-0013.

OpenTelemetry spans should cover:

- browser navigation/fetch operations when sampled;
- TanStack Start server functions and route handlers;
- PostgreSQL queries through the project DB client/query gateway;
- outbox publisher and realtime transport operations;
- outbox publisher and scheduled-job work;
- match Web Worker jobs and long simulation steps;
- service worker update/replay paths when diagnostics are enabled.

Browser telemetry must go through a same-origin telemetry endpoint or
protected reverse proxy. Do not expose the collector directly.

## Error Handling

User-facing errors must be safe, localised and actionable. Internal error
details go to logs/crash reporting after redaction.

Error categories:

| Category | User treatment | Operator treatment |
|---|---|---|
| Validation | inline copy near control | no alert unless spike |
| Auth/session | redirect or re-auth copy | security metrics |
| Offline/transient network | Sync / Activity status, retry | warn/error if retry exhausted |
| Hard business reject | `rejected_with_reason` copy per ADR-0002 | domain event/audit trail |
| Save/storage risk | clear warning and export guidance | crash/error report if unexpected |
| Server fault | generic apology + retry | error log and alert on rate |
| Security/integrity | minimal copy | security alert and audit event |

React/TanStack Router error boundaries, service worker failures, Web
Worker crashes, Dexie failures and unhandled rejections must be reported
through the client telemetry rules in
[[../30-Implementation/client-telemetry]].

## Privacy and Consent

[[../60-Research/telemetry-privacy]] splits telemetry into:

- service diagnostics;
- security monitoring;
- performance diagnostics;
- product analytics;
- session replay (not planned).

Service diagnostics and security monitoring may be enabled by default
when minimised and disclosed. Product analytics and detailed performance
analytics are opt-in until F6/H7 define otherwise.

All telemetry paths must scrub sensitive data before local queue storage
and again before backend ingestion. Consent withdrawal clears future
optional telemetry, and logout/account deletion clears local offline
telemetry queues.

## Metrics and Alerts

Initial operational metrics:

- app health: `/healthz`, uptime, container restarts;
- server: request count, 5xx rate, p95/p99 latency, CPU, memory;
- client stability: crash-free sessions, errors by release, service
  worker registration failures, IndexedDB errors;
- offline sync: pending/failed command counts, retry exhaustion, replay
  duration;
- outbox: `outbox_pending_count`, `outbox_oldest_pending_age_seconds`,
  `outbox_publish_total`, `outbox_publish_failures_total`,
  `outbox_publisher_attempts_exceeded_total`, realtime-transport fan-out lag
  per consumer (ADR-0028);
- telemetry pipeline: ingest failures, disk pressure, retention-job
  failures and alert-delivery failures.

Alert rules should be symptom-first and actionable. Avoid paging on
single errors unless they indicate data loss, security compromise or
global outage.

## Performance

Performance budgets are locked in [[../60-Research/performance-budgets]]
(gap D9). Highlights below; see that note for the full cheat-sheet,
device matrix, render-mode policy, world-size presets, and CI strategy.

Device tiers:

- **Premium** (Snapdragon 8 Gen 2+ / A15+, 6+ GB RAM, Android 14+/iOS
  17+) - full features.
- **Standard** (Snapdragon 695 / 4 Gen 2 / 6 Gen 1 / A13/A14, 4-6 GB
  RAM, Android 12+/iOS 16+) - optimization target.
- **Floor** (3 GB RAM, A12, Android 10+/iOS 15+, Chromium 90+) -
  reduced features + warning banner; Small world only; Text & Stats
  match mode forced.
- **Off-target** (< 3 GB / Android < 10 / iOS < 15 / Chromium < 90) -
  HTML fallback page.

Product targets enforced via CI + RUM:

- Lighthouse mobile lab score **>= 90** (block deploy < 85); desktop
  **>= 95** (block < 90).
- LCP p75 mobile **<= 2.0 s**, INP p75 primary flows **<= 120 ms**,
  CLS p75 **<= 0.05**.
- Initial critical JS transfer **<= 200 KB** (hard cap 250 KB);
  total session JS **<= 700 KB** (hard cap 1 MB).
- DOM nodes per route **<= 1500** (hard cap 3000); all tables MUST
  be virtualised.
- Main-thread frame budget (p95) **<= 12 ms**; no matchday task
  > 50 ms.
- JS heap (Standard tier) <= 150 MB main + <= 80 MB workers steady;
  Floor tier <= 100 MB + <= 50 MB.

Match and presentation render policy:

- **No interactive or authoritative browser 3D match view** is on the
  roadmap (permanent product decision, gap D9). [[09-Decisions/ADR-0029-3d-presentation-layer]]
  scoped the ban to the live match render pipeline; [[09-Decisions/ADR-0041-presentation-renderer-strategy]]
  tightened the renderer portfolio so Canvas 2D remains the match renderer and
  Three.js/R3F is the only planned optional 3D presentation stack.
- Two modes only: Text & Stats (first-class, Floor default) and
  2D canvas (primary, Standard / Premium default). Canvas frame cap
  30 fps on Standard, 60 fps on Premium.
- Optional post-MVP 2.5D/3D stadium, campus, celebration, trophy or curated
  highlight scenes are presentation-only modules. They must be lazy-loaded,
  device-gated, fallback-safe and derived from committed event/career/venue
  data; they never compute domain outcomes.

CI gate (MVP):

- Lighthouse CI + Playwright + Web Vitals injection on every PR
  (emulated, mobile preset, 4x CPU throttle).
- Bundle-size CI per the budgets above.
- Match-engine perf gate per [[../60-Research/match-engine-simulation-model]]
  (10 golden replays + 50 ms hard cap).
- Phase 2 (post-MVP) adds LambdaTest nightly real-device job;
  Phase 3 (only if needed) adds self-hosted 5-device hardware rig.

Cross-cutting enforcement:

- Web Vitals sampling under the telemetry / privacy rules (per
  [[../60-Research/telemetry-privacy]]);
- p95 / p99 server-function latency dashboards;
- slow PostgreSQL query spans and logs (via the query gateway);
- long task / worker duration diagnostics for client simulation.

## PWA and Offline-ready MVP

ADR-0020 governs MVP offline behavior:

- mutating HTTP responses must never be cached;
- the service worker may cache app shell/static assets and safe read-only data;
- Dexie / IndexedDB stores caches, drafts and local UI state;
- authoritative domain mutations require server confirmation in MVP;
- stale/cached data must be labelled when it can affect decisions; and
- future selective offline must not be blocked by storage or contract choices.

Observability must not break offline-ready behavior or future offline-first
singleplayer. Telemetry queues are secondary to game state, are bounded, and
may be dropped before they risk save durability or storage pressure.

## Security Baseline

- Server-only secrets stay behind server functions or server-only modules.
- CSP must include only approved telemetry endpoints before production.
- Grafana, Loki, Prometheus, Tempo and GlitchTip are admin-only.
- Source maps uploaded for crash reporting are protected operational
  assets, not public artifacts.
- Production credentials, `.env*`, keys and secret stores are never read
  or committed by agents.

## Accessibility and Internationalisation

- Accessibility target is WCAG 2.2 AA / BITV 2.0.
- Diagnostic UI such as Sync / Activity, storage warnings and error
  banners must be keyboard-accessible and screen-reader friendly.
- German is the primary UI language; internal logs remain English for
  operational consistency.
## Related

- [[09-Decisions/ADR-0017-observability-logging]]
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[09-Decisions/ADR-0003-match-engine]]
- [[09-Decisions/ADR-0013-transactional-outbox]]
- [[09-Decisions/ADR-0041-presentation-renderer-strategy]]
- [[../60-Research/performance-budgets]]
- [[../60-Research/presentation-renderer-strategy]]
- [[../60-Research/telemetry-privacy]]
- [[../30-Implementation/observability-runbook]]
- [[../30-Implementation/client-telemetry]]
