---
title: Telemetry, Privacy and GDPR - Locked Decisions
status: current
tags: [research, telemetry, privacy, gdpr, observability, pwa]
created: 2026-05-17
updated: 2026-05-17
type: research
binding: true
related: [[../95-Archive/gap-reports/wave-3-gap-analysis]], [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0013-transactional-outbox]]
---

# Telemetry, Privacy and GDPR - Locked Decisions

This note resolves Wave 3 gap **D11** (R2-11: Telemetry, privacy and
GDPR for an offline-first PWA). It defines what may be collected for
stability, crash analysis and performance monitoring before any
implementation adds logging SDKs, OpenTelemetry, analytics or client-side
offline telemetry queues.

The final stack decision is promoted into
[[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]. This
research note remains the privacy and consent input for F6, H7, C6 and
the implementation runbooks.

## Question

How can `soccer-manager` actively monitor stability, client crashes,
offline failures, performance and operational health while staying
self-hosted, privacy-minimising and compatible with GDPR / ePrivacy?

## Summary

Use **service-necessary diagnostics** and **optional analytics** as
separate data categories.

- Service-necessary diagnostics cover availability, security, crash
  diagnosis, sync correctness and save durability. They are minimised,
  disclosed in the privacy notice and never include raw save data,
  credentials or free-text user content.
- Optional product analytics and detailed performance analytics require
  explicit consent. They are deferred until H7 / G3 define product
  metrics and F6 defines the final GDPR implementation.
- Client-side crash diagnostics must support offline-first operation, but
  offline queues are capped, short-lived and redacted before anything is
  written to IndexedDB.
- All raw observability data stays on EU-hosted self-managed
  infrastructure by default. Any future SaaS exception requires a new
  ADR/DPA review.

## Findings

### 1. Tooling and data residency

Perplexity research for this gap compared self-hosted Sentry, GlitchTip,
OpenTelemetry, Grafana Loki / Tempo / Prometheus / Alloy, OpenObserve,
PostHog, Umami and Plausible.

The low-ops default is:

- **GlitchTip** for crash/error reporting via Sentry-compatible SDKs.
- **OpenTelemetry JS** as the instrumentation contract.
- **Grafana Alloy** as collector/agent.
- **Loki** for operational logs.
- **Prometheus** for metrics and alert input.
- **Tempo** for traces once request flows and worker flows exist.

Sentry self-hosted remains the upgrade path if GlitchTip lacks release,
source-map, performance or workflow features. It is not the default
because its self-hosted stack is heavier to operate.

### 2. Browser telemetry requires an ingestion boundary

OpenTelemetry documentation recommends exporting telemetry to a collector
in production. Browser exporters cannot use gRPC and require HTTP,
compatible CSP, CORS and a public or reverse-proxied endpoint.

Therefore browser telemetry must not expose the collector directly.
Browser events go to a same-origin telemetry endpoint or reverse proxy
that applies rate limits, origin checks and redaction before forwarding
to Alloy or the crash reporting backend.

### 3. Offline crash reporting is useful but dangerous if unbounded

Sentry JavaScript supports `makeBrowserOfflineTransport`, which stores
failed event envelopes in IndexedDB and later flushes them. That matches
the offline-first product goal, but it can also create accidental local
PII retention and reconnect spikes.

The project therefore caps client telemetry queues by category, count,
age and byte size. The queue is for high-value diagnostics only:

- crashes;
- unhandled promise rejections;
- service worker registration/runtime failures;
- Web Worker and match-engine crashes;
- Dexie / IndexedDB transaction and quota failures;
- failed outbox replay diagnostics;
- failed PWA update diagnostics.

Product analytics events and verbose performance spans are not stored in
offline queues until H7/F6 define their consent model.

### 4. PII must be scrubbed before storage and again before sending

Sentry documentation recommends `beforeSend` /
`beforeSendTransaction` for SDK-side scrubbing and server-side scrubbing
as a second guard. The same rule applies to all telemetry paths.

Forbidden telemetry fields:

- passwords, auth tokens, recovery codes, session cookies and API keys;
- emails, real names, phone numbers, payment data and addresses;
- free-text player input, chat, support text or community-pack content;
- raw request/response bodies;
- raw query strings with identifiers or secrets;
- encrypted save blobs, decrypted save payloads and full Dexie records;
- generated player/club datasets if they can reveal user-created content.

Allowed identifiers:

- release/build id;
- route id or screen name, not full URL with query string;
- pseudonymous account id if needed for crash-free-user metrics;
- correlation id / request id;
- aggregate id only when it is required for operational triage and is not
  a user-entered string.

### 5. Consent categories

Telemetry is split into these categories:

| Category | Default | Basis | Examples |
|---|---:|---|---|
| Service diagnostics | On | contract / legitimate interest | crash count, sync failure, service worker failure, save durability error |
| Security monitoring | On | legitimate interest / legal obligation | auth abuse, integrity failures, suspicious replay |
| Performance diagnostics | Sampled minimal by default; detailed opt-in | legitimate interest for coarse health, consent for detailed RUM | Web Vitals, slow spans, long tasks |
| Product analytics | Off until opt-in | consent | funnels, retention, feature usage, experiments |
| Session replay | Off / not planned | consent, high risk | only by future ADR if ever needed |

F6 must turn this into the final RoPA / privacy notice wording.

### 6. Retention

Initial retention defaults:

| Data set | Raw retention | Longer-lived form |
|---|---:|---|
| Loki operational logs | 14 days | none unless incident legal hold |
| GlitchTip crash reports | 30 days | release-level counts after deletion |
| Prometheus metrics | 15 months | aggregate dashboards |
| Tempo traces | 7 days | none |
| Client offline telemetry queue | max 24 hours and small queue cap | none |
| Domain audit events | per ADR-0013: hot 60 days, archive forever | SurrealDB archive tables |

Operational logs and traces are not a domain audit trail. Domain audit is
the SurrealDB outbox/archive defined by ADR-0013.

### 7. Deletion, export and consent withdrawal

Telemetry must use a pseudonymous telemetry subject id rather than email
or username. The mapping from account to telemetry subject id belongs to
the Identity / Privacy implementation, not the observability backend.

Deletion requirements:

- Server-side telemetry linked to a user must be deleted or irreversibly
  anonymised during account deletion unless retained for security/legal
  reasons.
- Client offline telemetry queues must be cleared on logout, account
  deletion, consent withdrawal or profile switch.
- Events created after consent withdrawal must not be queued locally.
- If an offline device never reconnects, server-side deletion still
  completes; local queue deletion happens at next app start/logout or
  via user-controlled local data clearing.

Export requirements:

- DSAR export should include a summary of diagnostic categories, retained
  crash reports linked to the telemetry subject id, and relevant domain
  audit events.
- Raw logs are exported only if they are tied to the subject and safe to
  disclose after redaction.

### 8. Incident response

Telemetry systems are incident evidence sources, but access is admin-only.
Incident handling must document:

- who may access Grafana / Loki / Prometheus / Tempo / GlitchTip;
- how to freeze a narrow time window under legal hold;
- how to redact evidence before sharing externally;
- how to detect telemetry pipeline failures so the team does not operate
  blind during incidents.

## Inputs For Decisions

- ADR-0017 locks the self-hosted observability stack.
- C6 rewrites crosscutting logging, errors, observability and privacy
  rules.
- E3/C5 extend Dokploy deployment with log shipping and telemetry
  services.
- F6 creates the GDPR compliance note and privacy/consent implementation.
- H1 incident response must include telemetry access and legal hold.
- H7 product analytics remains deferred until explicit product metrics are
  approved.

## Future-scope notes (classified future-scope)

- F6 must finalise jurisdiction-specific consent copy and privacy notice
  language.
- H7/G3 must decide if Umami, Plausible or PostHog is needed for product
  analytics. None is part of the operational logging MVP.
- F10 must decide whether outbox archives need a hash chain for tamper
  evidence.

## Sources

- Perplexity research, 2026-05-17: self-hosted/open-source
  observability stack comparison for offline-first PWA.
- Perplexity research, 2026-05-17: GDPR/ePrivacy client telemetry,
  consent, offline queues, retention and DSAR considerations.
- OpenTelemetry JS exporters:
  <https://opentelemetry.io/docs/languages/js/exporters/#exporters>
- OpenTelemetry SDK configuration:
  <https://opentelemetry.io/docs/languages/sdk-configuration#otlp-exporter-configuration>
- Grafana Alloy OTLP to LGTM pipeline:
  <https://github.com/grafana/alloy/blob/main/docs/sources/collect/opentelemetry-to-lgtm-stack.md>
- Grafana Loki clients / Alloy guidance:
  <https://github.com/grafana/loki/blob/main/docs/sources/send-data/_index.md>
- Sentry JavaScript sensitive-data scrubbing:
  <https://docs.sentry.io/platforms/javascript/data-management/sensitive-data>
- Sentry JavaScript offline caching:
  <https://docs.sentry.io/platforms/javascript/best-practices/offline-caching>
