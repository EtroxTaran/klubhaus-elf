---
title: Crosscutting Concerns
status: current
tags: [architecture, security, quality, observability, logging]
created: 2026-05-15
updated: 2026-06-18
type: architecture
binding: false
related: [[09-Decisions/ADR-0017-observability-logging]], [[../60-Research/observability-trace-backend-readd-trigger-2026-06-18]], [[../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]], [[09-Decisions/ADR-0028-postgres-transactional-outbox]], [[09-Decisions/ADR-0091-audit-security-context-definition]], [[09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]], [[09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]], [[09-Decisions/ADR-0094-i18n-stack-and-locale-scope]], [[09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]], [[09-Decisions/ADR-0030-llm-out-of-authoritative-state]], [[09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]], [[09-Decisions/ADR-0041-presentation-renderer-strategy]], [[../60-Research/performance-budgets]], [[../60-Research/presentation-renderer-strategy]], [[../60-Research/telemetry-privacy]], [[../30-Implementation/observability-runbook]], [[../30-Implementation/client-telemetry]]
---

# Crosscutting Concerns

This chapter defines project-wide rules for concerns that every bounded
context, route, worker and PWA component must follow. Accepted ADRs remain
the binding source when there is a conflict.

## Logging and Observability

ADR-0017 defines the observability stack. The MVP profile (trimmed by the
ADR-0017 2026-05-19 amendment) is:

- Grafana Loki for operational logs.
- Prometheus for metrics.
- Grafana Alloy for collection.
- Grafana for dashboards and alerting.
- GlitchTip with Sentry-compatible SDKs for crash/error reports.
- OpenTelemetry JS as the instrumentation contract.

Grafana Tempo (traces) and Mimir are **deferred** at MVP per the ADR-0017
amendment; Alloy keeps them re-addable as a collector-config + container change.
FMX-171 proposes the concrete trigger policy. Until Nico approves it, the
current draft is:

- Tempo when `TempoBackendRequired` fires: after a split runtime path exists,
  one incident cannot be localised with Loki + Prometheus within 30 minutes.
- Mimir when `MimirBackendRequired` fires: 15-month Prometheus retention would
  need `--storage.tsdb.retention.size` above 80% of dedicated TSDB disk for
  seven consecutive daily checks.

Tracing spans (below) are an OpenTelemetry **coverage contract** regardless of
whether the Tempo backend is deployed yet. At MVP, production span export is
off: no-op tracing or `AlwaysOffSampler` plus no exporter; with
autoconfiguration, `OTEL_TRACES_EXPORTER=none` is the off-profile safety flag.
Do not emit sampled spans to Alloy only to drop them while Tempo is absent.

Operational logs, crash reports, metrics, traces, domain audit events and the
security audit log are different data classes. Do not collapse them into one
store. In particular the **domain audit trail** (derived from the ADR-0028
transactional outbox) and the **security audit log** (the separate, append-only,
hash-chained log owned by the Audit & Security context per ADR-0091) are
deliberately distinct concerns and must never be merged — see Audit Trails below.

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
`correlation_id` and, when relevant, `causation_id` per ADR-0028 (the
transactional outbox that supersedes ADR-0013).

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

## Audit Trails

There are **three** distinct "audit" concerns; ADR-0092 (governance) and ADR-0097
(data-model) canonicalised them so they are never conflated, and the platform
`audit_log` table is dropped:

- **Domain audit trail.** "How did game state change?" — derived from the
  ADR-0028 transactional outbox (`outbox_event`); the outbox **is** the domain
  audit trail. There is **no separate platform `audit_log` table** (dropped per
  ADR-0097; outbox = domain trail).
- **Security audit log.** "Who attempted what, under which security decision,
  with what evidence?" — a **separate, append-only, write-once** log owned by the
  **Audit & Security** bounded context (ADR-0091). It is tamper-evident
  (per-record hash-chaining + periodic signed checkpoints), records command
  reception, auth/authz decisions, idempotency/replay rejections, rate-limit
  triggers, anomaly flags and moderation actions as security *facts* (not raw
  PII/secrets/payloads), and carries its own retention/redaction policy.
- **Operational/diagnostic logs.** The Loki/GlitchTip telemetry above — neither
  an authoritative source nor a forensic record.

These are distinct data classes with distinct invariants, retention rules and
access controls; **do not merge the domain audit trail and the security audit
log** (it would pollute the domain event store and break the forensic boundary).
Audit & Security *consumes* domain events + command metadata via the outbox; it
never joins another context's tables, and it does not own domain validation,
authentication or the outbox itself (ADR-0091). ADR-0119 adds the synchronous
exception at the command-reception boundary: Audit & Security owns replay/dedup
policy and processed-command state before domain dispatch, while the outbox
stays post-commit publication.

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
  [[09-Decisions/ADR-0047-babylon-3d-presentation-engine]] makes Babylon.js the
  only planned optional 3D/2.5D presentation stack.
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

ADR-0090 fixes the offline-sync scope and conflict-resolution strategy that
ADR-0020's "future selective offline" left open. Offline Sync stays a **thin
context at MVP** (Service-Worker cache + Dexie drafts + synchronous commands)
behind a mandated migration seam: every command carries `commandId` (idempotency
key) + `expectedVersion`, every client projection carries `lastSeenVersion`, the
server API is command-oriented, and clients can always rehydrate projections from
server events. The conflict strategy is **server-authoritative re-validation +
rebase** for all core game commands - the server is the single authority, treats
committed events as canonical, and rebases still-valid queued commands on
conflict. ADR-0119 puts authoritative replay/dedup at the server-side Command
Reception gate before domain validation; Offline Sync owns the retry and rebase
UX. CRDTs are **confined to watch-party collaborative overlays** (chat, shared
markers) on their own sync channel; last-write-wins is allowed **only** for
cosmetic local preferences, never for game state.

Observability must not break offline-ready behavior or future offline-first
singleplayer. Telemetry queues are secondary to game state, are bounded, and
may be dropped before they risk save durability or storage pressure.

## Determinism and Numeric Surface

Determinism is a crosscutting contract, not a match-engine-local detail
(ADR-0096, which supersedes ADR-0003 and finalises ADR-0049):

- **Every value a committed event, summary statistic, RNG branch or replay
  decision depends on is computed in integers / fixed-point** (basis points
  0–10000 for probabilities, integer millimetres on the pitch grid, integer mm/s
  for velocities, integer cents/minor units for money). Floating point is
  permitted **only** downstream of the committed event log — render interpolation
  and the `MatchFrame` projection — which are not replay-bearing. This is what
  keeps replay equality-safe across any runtime (Rust-native, Rust→WASM or TS).
- **Nine named RNG streams** are canonical (correcting the stale "8"): `WorldRng`,
  `WorldAiMgmtRng`, `MatchCoreRng`, `MatchAiRng`, `WeatherRng`, `InjuryRng`,
  `TransferRng`, `NewsRng/PresentationRng`, `GeneratorRng`. New randomness reuses a
  versioned sub-label of an existing stream; no new top-level `*Rng` is minted.
- **No non-deterministic primitives** in replay-bearing code: `Math.random`,
  `Date.now` and `setTimeout`-derived timing are lint-banned; seeds + draw indices
  are persisted in provenance for byte-identical replay.
- **Per-quality-profile replay precedence:** byte-identical golden replay is
  mandatory for `competitive-full` and `interactive-standard`; `background-detailed`
  keeps byte parity where cheap but a statistical envelope is the binding gate;
  `background-fast` is statistical-envelope-only and is never a byte-exact replay
  source. Anti-cheat, audit and watch-party replays run only against byte-exact
  profiles.

## AI / LLM Boundary

Runtime LLM usage is kept **out of authoritative state** as a crosscutting rule
(ADR-0030). No LLM runs inside the match engine, deterministic replay paths or any
authoritative command handler, and no generated text is parsed back into domain
commands, relationship deltas, numeric values or event facts. Generated prose is
cosmetic display copy only, always produced downstream of already-committed facts,
behind a feature-flagged, kill-switchable adapter with a deterministic template
fallback rendered first. Prompt payloads carry no PII, secrets, internal IDs, raw
user free-text or real-world entity names (placeholder tokens are substituted
locally). Every generated output stores `aiGenerated: true` + provenance; the
EU AI Act Article 50 release gate (ADR-0030) must close before any runtime-LLM
ship.

## Security Baseline

- Server-only secrets stay behind server functions or server-only modules.
- CSP must include only approved telemetry endpoints before production.
- Grafana, Loki, Prometheus, Tempo when deployed and GlitchTip are admin-only.
- Source maps uploaded for crash reporting are protected operational
  assets, not public artifacts.
- Production credentials, `.env*`, keys and secret stores are never read
  or committed by agents.
- Save encryption uses AES-GCM 256 with AAD header binding. The key-derivation
  function is **split by path** (ADR-0098, superseding ADR-0005 on the KDF):
  PBKDF2-SHA256 @ 600 000 iterations (native Web Crypto) for the high-entropy
  **device-backup** key on the hot at-rest decrypt path, and **Argon2id** (WASM,
  the OWASP-preferred memory-hard KDF) for the **portable-export passphrase** —
  the only brute-forceable, P2P-travelling secret — loaded only on the
  export/import path. The `kdfAlgo` envelope field discriminates the two.

## Accessibility and Internationalisation

- Accessibility target is WCAG 2.2 AA / BITV 2.0.
- Diagnostic UI such as Sync / Activity, storage warnings and error
  banners must be keyboard-accessible and screen-reader friendly.
- German is the primary (source) UI language; internal logs remain English for
  operational consistency.
- The i18n stack is **Paraglide JS + `format.js` Intl polyfills + self-hosted
  Tolgee** (ADR-0094, superseding ADR-0006's i18next direction), with **ICU-MF1**
  as the message contract and **5 MVP locales (DE/EN/FR/ES/IT, DE source)**.
  Crosscutting CI gates: pseudo-localisation snapshot, ICU-validate, RTL
  logical-properties lint, Unicode-property-escape name validation
  (`\p{L}\p{N}\p{Pd}\p{Zs}`, never `[a-zA-Z]`) and content-hashed locale bundles
  for service-worker cache-busting.

## Ubiquitous Language and Naming

Bounded contexts each own their own model and ubiquitous language; integration is
via Published-Language events over the ADR-0028 outbox, never a shared domain
model (ADR-0100). Two contexts referencing the same real-world thing share only a
**correlation key**, not a same-named aggregate — a same-named, same-structure
aggregate across contexts is a Shared Kernel / model-leakage smell. The ratified
worked example: the player-facing story arc is Narrative's `StoryThread` aggregate
(Narrative is the sole originator), the outlet-side coverage arc is Media Ecology's
`CoverageThread` aggregate, and both reference the same `storyThreadId` as a
correlation key owned by neither.
