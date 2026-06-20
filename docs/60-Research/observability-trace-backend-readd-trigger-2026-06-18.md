---
title: Observability Trace Backend Re-add Trigger and MVP Span Policy
status: current
tags: [research, synthesis, observability, tracing, tempo, mimir, prometheus, opentelemetry, alloy, fmx-171]
context: audit-security
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-171
related:
  - [[raw-perplexity/raw-observability-trace-backend-readd-trigger-2026-06-18]]
  - [[raw-perplexity/raw-observability-trace-backend-source-checks-2026-06-18]]
  - [[../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../10-Architecture/08-Crosscutting]]
  - [[../10-Architecture/07-Deployment]]
  - [[../10-Architecture/11-Risks]]
  - [[../30-Implementation/observability-runbook]]
  - [[../30-Implementation/deployment-dokploy]]
---

# Observability Trace Backend Re-add Trigger and MVP Span Policy

## Intent

FMX-171 replaces ADR-0017's qualitative "Tempo/Mimir later" wording with a
concrete operator-fireable policy and reconciles the current span ambiguity:
`08-Crosscutting` says OpenTelemetry spans are a contract even though Tempo is
not deployed at MVP.

This note is non-binding research and synthesis. The paired decision queue asks
Nico to approve the policy before it becomes accepted architecture truth.

## Local Baseline

Current vault state before this packet:

- ADR-0017 keeps the self-hosted EU observability direction, but the 2026-05-19
  amendment defers Tempo and Mimir from the MVP profile.
- `08-Crosscutting` still says spans are an OTel instrumentation contract
  regardless of Tempo deployment.
- `07-Deployment`, `deployment-dokploy` and `observability-runbook` still list
  Tempo in places that read like the current deployed target.
- `11-Risks` says the re-add trigger is documented, but the trigger is still
  qualitative.

## Evidence Summary

Source checks support these constraints:

- Prometheus local storage is not clustered/replicated. Its docs name
  `--storage.tsdb.retention.time`, `--storage.tsdb.retention.size` and the
  capacity formula
  `retention_time_seconds * ingested_samples_per_second * bytes_per_sample`.
- Prometheus recommends capping `storage.tsdb.retention.size` at most 80-85% of
  allocated Prometheus disk; FMX should use 80% as the conservative trigger.
- Mimir is Prometheus-compatible, remote-write compatible, horizontally
  scalable, HA-capable and intended for long-term metrics storage.
- Tempo adds value when traces are used for RED metrics, service graphs,
  TraceQL metrics and cross-service causal debugging.
- Alloy can wire an OTLP receiver/processor/exporter pipeline to Tempo by
  configuration once a Tempo container exists.
- OpenTelemetry JS supports `AlwaysOffSampler`; general OTel config supports
  `OTEL_TRACES_EXPORTER=none`.
- Current stable version checks on 2026-06-18 returned Tempo `v2.10.7`, Mimir
  `mimir-3.1.1`, Alloy `v1.17.0`, OpenTelemetry JS `v2.8.0` and Prometheus
  `v3.12.0`.

## Recommendation

Approve **D1=C, D2=A, D3=B, D4=A** in the decision queue.

Operational interpretation:

- **Tempo:** do not deploy at MVP. Re-add Tempo only when the runtime has a real
  cross-service path and logs+metrics fail a 30-minute incident-localisation
  budget.
- **Mimir:** do not deploy at MVP. Re-add Mimir when the required 15-month
  Prometheus retention no longer fits inside 80% of the dedicated Prometheus
  TSDB disk budget.
- **Spans:** instrument the span coverage points now, but production tracing is
  no-op / `AlwaysOffSampler` / no exporter until Tempo is enabled. Do not emit
  spans to Alloy just to drop them.
- **Re-add mechanics:** Tempo remains a collector-config + container addition
  because app code already uses the tracing seam. Mimir remains a Prometheus
  remote-write / storage-topology addition, not a replacement for app metrics.

## Proposed Tempo Trigger

The proposed single operator-fireable signal is:

> **`TempoBackendRequired` fires when a production or staging incident occurs
> after at least two independently deployed runtime services participate in one
> user-visible request/command/event path, and the operator cannot localise the
> slow or failing hop from Loki logs plus Prometheus metrics within 30 minutes
> of incident triage start.**

Definitions:

- independently deployed runtime service means a container/process that can be
  restarted or deployed separately from the app runtime, for example
  `outbox-publisher`, `scheduler`, `notification-worker`, `match-worker` or a
  future realtime worker;
- user-visible path includes synchronous requests and async command/event paths
  where delayed work affects player-visible state;
- "localise" means identifying the responsible service/hop and the failing
  operation class well enough to pick the next remediation owner;
- the 30-minute clock starts when triage begins, not when the bug first occurs.

When this signal fires, the re-add work is:

1. add the Tempo container and volume/retention config;
2. enable the Alloy OTLP trace export pipeline to Tempo;
3. switch tracing config from no-op / `AlwaysOffSampler` / exporter none to
   sampled OTLP export through Alloy;
4. start with conservative sampling and no browser offline span queue;
5. add Grafana trace dashboard links to the runbook.

## Proposed Mimir Trigger

The proposed single operator-fireable signal is:

> **`MimirBackendRequired` fires when the daily Prometheus capacity check shows
> that keeping ADR-0017's required 15-month metrics retention would require
> `--storage.tsdb.retention.size` above 80% of the dedicated Prometheus TSDB
> disk allocation for seven consecutive days.**

Definitions:

- the daily check uses the Prometheus storage formula from current ingestion
  rate and observed bytes/sample, or the measured TSDB growth trend once real
  production data exists;
- the 80% cap is intentionally stricter than the upper official 80-85% guidance
  to preserve cleanup, WAL and head-chunk buffer;
- a 70% projection is a warning and planning signal, not the Mimir trigger;
- increasing the disk can satisfy the trigger only if the single-node
  Dokploy/Hetzner risk envelope remains accepted and backup/restore remains
  tested.

When this signal fires, the re-add work is:

1. add Mimir as the Prometheus-compatible long-term metrics backend;
2. configure Prometheus/Alloy remote write;
3. reduce local Prometheus retention to the hot-window needed for alerting and
   fast incident triage;
4. keep Grafana dashboards compatible with PromQL/Mimir queries.

## Proposed MVP Span Policy

Use **instrument-now, collect-later**:

- OTel span coverage points are part of the architecture contract now.
- Production span export is off until the Tempo trigger is approved/fired.
- Implementation may use no SDK registration, or an SDK registered with
  `AlwaysOffSampler`; when autoconfiguration is used, set
  `OTEL_TRACES_EXPORTER=none` for the off profile.
- Do not configure a full exporter to a blackhole/drop collector in production.
- Do not store verbose spans in the client offline telemetry queue.
- Continue propagating `correlation_id` / `request_id` in logs, metrics and
  domain events so the later trace backend can align with existing evidence.

Required span coverage once tracing is enabled:

- browser navigation/fetch operations when sampled;
- TanStack Start server functions and route handlers;
- project DB gateway / PostgreSQL operations;
- outbox publisher, realtime transport and notification worker operations;
- scheduler jobs and long-running background work;
- match worker jobs and long simulation steps;
- service worker update/replay paths when diagnostics are enabled.

## Options

### D1 - Tempo trigger

| Option | Shape | Assessment |
|---|---|---|
| A. Service-count-only | Add Tempo as soon as two or three runtime services exist. | Measurable, but likely too early for a low-traffic single-node MVP. |
| B. Incident-only | Add Tempo after any logs/metrics-only incident exceeds a time budget. | Focused on pain, but ambiguous if the system is still a single runtime. |
| C. Topology plus incident-budget | Add Tempo after a real cross-service path exists and one incident exceeds the 30-minute localisation budget. | Recommended. Concrete, avoids premature infra, and preserves the "config + container" re-add. |

### D2 - Mimir trigger

| Option | Shape | Assessment |
|---|---|---|
| A. 15-month retention no longer fits inside 80% Prometheus disk budget. | Daily capacity check; 70% warning, 80% trigger. | Recommended. Directly grounded in Prometheus retention-size guidance. |
| B. Add Mimir once any long-term metrics/SLO history is wanted. | Product/SRE need gate. | Useful as future business trigger, but not a concrete storage watermark. |
| C. Add Mimir now. | Remote metrics from day one. | Overkill for docs-phase/MVP and contradicts the lean profile. |

### D3 - Span policy

| Option | Shape | Assessment |
|---|---|---|
| A. Defer instrumentation until Tempo. | No span code until backend exists. | Lowest early work, but makes the later Tempo re-add an instrumentation project. |
| B. Instrument now, export later. | Span coverage contract exists; no-op / `AlwaysOffSampler` / exporter none at MVP. | Recommended. Keeps re-add operational and low-overhead. |
| C. Emit sampled spans to Alloy and drop them. | Full export path with no backend. | Pays serialization/network/retry cost for no retained value. |

### D4 - Approval path

| Option | Shape | Assessment |
|---|---|---|
| A. Proposed amendment now, promote after Nico approval. | Draft policy in ADR/docs and explicit decision queue. | Recommended. Satisfies the ask-first gate. |
| B. Treat the thresholds as accepted immediately. | Agent applies binding change. | Violates architecture decision authority. |
| C. Defer all doc wording until after a meeting. | No branch-level proposal. | Leaves current ambiguity unresolved. |

## Open Questions for Nico

The decision queue asks Nico to approve or adjust:

- D1: Tempo trigger = topology plus one 30-minute localisation failure.
- D2: Mimir trigger = 15-month retention needing more than 80% of dedicated
  Prometheus disk for seven consecutive days.
- D3: span policy = instrument now, production export off until Tempo.
- D4: promotion path = non-binding proposed amendment until approval.

## Source List

- Perplexity discovery capture:
  [[raw-perplexity/raw-observability-trace-backend-readd-trigger-2026-06-18]].
- Source checks:
  [[raw-perplexity/raw-observability-trace-backend-source-checks-2026-06-18]].
- Prometheus storage:
  `https://prometheus.io/docs/prometheus/latest/storage/`.
- OpenTelemetry SDK config:
  `https://opentelemetry.io/docs/languages/sdk-configuration/general/#otel_traces_exporter`.
- Grafana Alloy OTLP pipeline:
  `https://github.com/grafana/alloy/blob/main/docs/sources/collect/opentelemetry-data.md`.
- Tempo metrics from traces:
  `https://github.com/grafana/tempo/blob/main/docs/sources/tempo/metrics-from-traces/_index.md`.
- Mimir introduction:
  `https://github.com/grafana/mimir/blob/main/docs/sources/mimir/introduction/_index.md`.
