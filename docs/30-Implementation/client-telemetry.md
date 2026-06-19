---
title: Client Telemetry
status: current
tags: [implementation, telemetry, pwa, errors, performance, indexeddb, release, versioning]
created: 2026-05-17
updated: 2026-06-19
type: implementation
binding: false
adr: [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]], [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]], [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
related: [[../60-Research/telemetry-privacy]], [[../60-Research/observability-trace-backend-readd-trigger-2026-06-18]], [[../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]], [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]], [[../40-Compliance/age-assurance-and-rating-evidence]], [[observability-runbook]], [[release-versioning-app-build-process]]
---

# Client Telemetry

## Purpose

Define how browser, service worker, Web Worker and IndexedDB failures are
captured without compromising offline-first play or privacy.

## Current Approach

The app currently has no telemetry SDK. `apps/web/public/sw-register.js`
swallows service worker registration failures so the bootstrap shell stays
usable. Future implementation must keep that UX resilience while sending
a redacted diagnostic event when allowed.

## Draft Release Identity

Draft [[../10-Architecture/09-Decisions/ADR-0132-release-versioning-app-build-process]]
proposes the concrete fields behind this note's generic release/build id:

- `releaseVersion`;
- `playerReleaseLabel`;
- `buildId`;
- `releaseChannel`;
- `contentVersion`;
- `saveSchemaVersion`.

These fields are low-risk diagnostic context when they contain no player or
save payload data. Server-only artifact evidence such as full image digest,
SBOM/provenance refs and deploy approver stays in operational release records
unless a future accepted telemetry rule explicitly allows it.

## Signals To Capture

Crash/error diagnostics:

- `window.error`;
- `unhandledrejection`;
- React / TanStack Router error boundaries;
- service worker registration failures;
- service worker install/activate/fetch/message handler failures;
- Web Worker crashes and match-engine fatal errors;
- Dexie transaction failures;
- IndexedDB quota and persistence failures;
- failed outbox replay diagnostics;
- failed PWA update diagnostics.

Performance diagnostics:

- Web Vitals sample;
- long tasks;
- navigation and route transition time;
- slow fetch/server-function spans;
- match worker duration;
- outbox replay duration;
- IndexedDB transaction duration.

FMX-171 proposes **instrument-now, collect-later** for spans: keep the span
coverage points in the architecture contract, but production span export stays
no-op / `AlwaysOffSampler` / no exporter until Tempo is enabled. Browser
offline telemetry queues must not store verbose spans.

## Offline Queue Rules

Offline queues are for high-value diagnostics only.

Requirements:

- store in IndexedDB, not localStorage;
- cap by count, bytes and age;
- default max age: 24 hours;
- drop expired events before sending;
- drop low-value duplicate events after the first N per release;
- clear on logout, account deletion, consent withdrawal and profile
  switch;
- never block gameplay or save writes;
- never evict save data to keep telemetry.

The queue must store already-redacted envelopes only.

## Redaction

Before queueing or sending, remove:

- auth headers, cookies, tokens and credentials;
- email, names, phone numbers and addresses;
- request and response bodies;
- query strings unless allowlisted;
- save payloads and encrypted save blobs;
- full Dexie records;
- free-text user content and community-pack text.

Allowed context:

- release/build id, concretely `releaseVersion` and `buildId` after ADR-0132
  approval;
- release channel;
- content version and save schema version;
- route id or screen name;
- feature area;
- browser family/version;
- OS family;
- install/display mode if available;
- pseudonymous telemetry subject id;
- `correlation_id` / `request_id`;
- aggregate id only when needed for operational triage.

## Consent Enforcement

Use the categories from [[../60-Research/telemetry-privacy]]:

- service diagnostics: enabled when minimised and disclosed;
- security monitoring: enabled when minimised and disclosed;
- detailed performance diagnostics: sampled and consent-aware;
- product analytics: off until H7/F6 approve it;
- session replay: not planned.

Consent must be checked before:

- SDK initialisation for optional telemetry;
- writing optional events to IndexedDB;
- flushing queued optional events;
- enabling any future analytics tracker.

Age eligibility must also be checked before any optional telemetry path:

- this age-eligibility subset is binding through accepted ADR-0112 even though
  this wider telemetry note remains non-binding;
- no analytics/marketing SDK is initialised before the 16+ signup gate;
- a user choosing "No, under 16" creates no account, no persisted refusal
  record and no optional queued event;
- strictly necessary security/technical logs remain separate from optional
  telemetry and must be minimised and disclosed.

## Service Worker

Service worker telemetry must not change the failure semantics:

- registration failure stays non-fatal for the app shell;
- mutating HTTP responses are never cached;
- telemetry send failures do not trigger user-visible errors;
- telemetry queues are secondary to game outbox queues;
- Background Sync is not required for telemetry correctness.

## Web Worker / Match Engine

Match worker telemetry must preserve deterministic simulation:

- do not call `Date.now` or random APIs inside deterministic decisions;
- measure worker duration outside deterministic logic;
- report crash metadata without dumping match state;
- include `engineVersion`, release and match aggregate id only when
  allowed.

## Source Maps

Source maps may be uploaded to GlitchTip for crash triage. They are
protected operational artifacts:

- never publicly served by default;
- tied to the same release/build id used by telemetry events and source-map
  upload (`releaseVersion` plus `buildId` after ADR-0132 approval);
- retained with crash reports unless an incident requires longer hold.

## Tests To Add With Implementation

- redaction utility strips fake PII before queue write;
- offline queue drops expired and over-cap events;
- service worker registration failure emits a diagnostic without breaking
  the app;
- React error boundary captures a grouped error;
- Dexie quota failure surfaces user-safe copy and diagnostic event;
- consent withdrawal clears optional queued telemetry.

## Code Pointers

- `apps/web/public/sw-register.js`: current SW registration bootstrap.
- `apps/web/src/routes/__root.tsx`: future app-level error boundary hook.
- `apps/web/src/workers/service-worker.ts`: future SW diagnostics.
- `apps/web/scripts/build-pwa.mjs`: Workbox caching strategy.
- `tests/e2e/smoke.spec.ts`: service worker/offline smoke coverage.

## Change History

- 2026-06-16: Added non-binding FMX-178 / ADR-0132 release-identity field
  references.
- 2026-05-17: Created for ADR-0017.
