---
title: Source Checks - Observability Trace Backend Re-add Trigger
status: raw
tags: [research, raw, source-checks, observability, tracing, tempo, mimir, prometheus, opentelemetry, alloy, fmx-171]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-171
related:
  - [[../observability-trace-backend-readd-trigger-2026-06-18]]
  - [[raw-observability-trace-backend-readd-trigger-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../../10-Architecture/08-Crosscutting]]
  - [[../../10-Architecture/07-Deployment]]
  - [[../../30-Implementation/observability-runbook]]
---

# Source Checks - Observability Trace Backend Re-add Trigger

These checks validate, qualify or downgrade the Perplexity discovery claims used
for FMX-171. They do not make a binding architecture decision.

## Source Check Matrix

| Claim | Source checked | Finding | FMX use |
|---|---|---|---|
| Prometheus local TSDB needs a retention-size buffer. | Prometheus storage docs (`https://prometheus.io/docs/prometheus/latest/storage/#right-sizing-retention-size`) | Prometheus recommends setting `storage.tsdb.retention.size` to at most 80-85% of allocated Prometheus disk. | Use 80% as FMX's conservative Mimir trigger budget. |
| Prometheus local storage has explicit retention flags and a capacity formula. | Prometheus storage docs (`https://prometheus.io/docs/prometheus/latest/storage/#operational-aspects`) | Docs name `--storage.tsdb.retention.time`, `--storage.tsdb.retention.size`, `--storage.tsdb.path`, `--storage.tsdb.wal-compression` and the rough formula `retention_time_seconds * ingested_samples_per_second * bytes_per_sample`. | Use a daily capacity check against 15-month retention before adding Mimir. |
| Mimir is the Prometheus-compatible remote/long-term metrics backend. | Grafana Mimir introduction (`https://github.com/grafana/mimir/blob/main/docs/sources/mimir/introduction/_index.md`) | Mimir handles large time-series volume, horizontal scaling, HA/replication, long-term object storage and Prometheus remote write/PromQL compatibility. | Add Mimir only when local Prometheus no longer fits the required retention/HA envelope. |
| Tempo adds value through trace-derived metrics and service graph style analysis. | Grafana Tempo metrics-from-traces docs (`https://github.com/grafana/tempo/blob/main/docs/sources/tempo/metrics-from-traces/_index.md`) | Tempo's metrics-generator can derive RED metrics and service graphs from spans; TraceQL metrics support trace-data aggregation for debugging. | Use Tempo when cross-service incident triage needs span-level causality, not as a default single-service MVP dependency. |
| Alloy can receive OTLP and later export traces to Tempo by config. | Grafana Alloy OpenTelemetry pipeline docs (`https://github.com/grafana/alloy/blob/main/docs/sources/collect/opentelemetry-data.md`) and LGTM example (`https://github.com/grafana/alloy/blob/main/docs/sources/collect/opentelemetry-to-lgtm-stack.md`) | Alloy wiring is explicit OTLP receiver -> processor -> exporter. The LGTM example sends traces to an OTLP/Tempo endpoint. | Supports ADR-0017's "collector-config + container" re-add path once app instrumentation exists. |
| OTel JS can disable automatic trace export. | OpenTelemetry SDK general config (`https://opentelemetry.io/docs/languages/sdk-configuration/general/#otel_traces_exporter`) | `OTEL_TRACES_EXPORTER` accepts `none`, meaning no automatically configured trace exporter. | Use as a safety setting when SDK autoconfiguration exists, but do not rely on exporter none alone to remove all span overhead. |
| OTel JS supports an AlwaysOff sampler. | OpenTelemetry JS SDK trace-base docs via Context7 (`https://github.com/open-telemetry/opentelemetry-js/blob/main/packages/opentelemetry-sdk-trace-base/README.md`) | `AlwaysOffSampler` disables sampling for all traces. | FMX MVP tracing mode should be no-op or `AlwaysOffSampler` plus no exporter. |
| Current stable Tempo version as of 2026-06-18. | GitHub release `https://github.com/grafana/tempo/releases/tag/v2.10.7` | Latest non-prerelease returned by GitHub API: `v2.10.7`, published 2026-06-12. | Version evidence for research packet only; implementation still repins at build time. |
| Current stable Mimir version as of 2026-06-18. | GitHub release `https://github.com/grafana/mimir/releases/tag/mimir-3.1.1` | Latest non-prerelease returned by GitHub API: `mimir-3.1.1`, published 2026-06-12. | Version evidence for research packet only; implementation still repins at build time. |
| Current stable Alloy version as of 2026-06-18. | GitHub release `https://github.com/grafana/alloy/releases/tag/v1.17.0` | Latest non-prerelease returned by GitHub API: `v1.17.0`, published 2026-06-12. | Version evidence for research packet only; implementation still repins at build time. |
| Current stable OpenTelemetry JS version as of 2026-06-18. | GitHub release `https://github.com/open-telemetry/opentelemetry-js/releases/tag/v2.8.0` | Latest non-prerelease returned by GitHub API: `v2.8.0`, published 2026-06-11. | Version evidence for research packet only; implementation still checks package pins and contrib packages. |
| Current stable Prometheus version as of 2026-06-18. | GitHub release `https://github.com/prometheus/prometheus/releases/tag/v3.12.0` | Latest non-prerelease returned by GitHub API: `v3.12.0`, published 2026-05-28. | Version evidence for research packet only; implementation still pins image/package at deployment time. |

## Extracted Evidence

### Prometheus local storage

Prometheus local storage is explicitly single-node local TSDB storage. The docs
state that local storage is not clustered or replicated, name the core retention
flags and document a rough sizing formula. They also recommend keeping
`storage.tsdb.retention.size` below the full disk allocation so cleanup can
remove old blocks before the disk is exhausted.

FMX consequence: Prometheus remains acceptable for MVP metrics, but the Mimir
trigger should be a storage-budget trigger, not a vague "outgrows node" phrase.
FMX uses 80% of the dedicated Prometheus disk as the conservative budget.

### Mimir

Grafana Mimir's own introduction positions it as Prometheus-compatible
large-volume, horizontally scalable, HA-capable and long-term object-storage
metrics infrastructure.

FMX consequence: Mimir is justified when local Prometheus cannot meet the
required retention envelope safely, when multi-node/HA metrics become required,
or when remote-write long-term storage becomes an explicit operations goal.
FMX-171 proposes only the storage-budget trigger for the MVP-to-v1 transition.

### Tempo

Tempo docs source-check the operational value of storing trace data: trace
metrics, RED metrics, service graphs, TraceQL metrics and exploratory debugging
over causal span relationships.

FMX consequence: Tempo should be tied to a real need for cross-service causal
debugging. A service-count-only trigger would be measurable but too eager; an
incident-only trigger without a service graph condition would be ambiguous. The
proposed trigger combines a split runtime path with a failed 30-minute
log/metric-only localisation budget.

### Alloy

Alloy docs show OTLP receivers, batch processors and OTLP exporters. The LGTM
example forwards traces to a Tempo endpoint. This supports ADR-0017's claim
that re-adding Tempo is collector-config plus container work, provided the app
instrumentation seam already exists.

FMX consequence: do not wait to define span coverage points. Do wait to export
sampled production spans until Tempo is approved/enabled.

### OpenTelemetry JS

OpenTelemetry docs source-check `OTEL_TRACES_EXPORTER=none` and Context7
confirmed `AlwaysOffSampler` from OpenTelemetry JS trace SDK docs. I did not
find a current official OpenTelemetry docs page for a portable
`OTEL_SDK_DISABLED` recommendation during this source-check pass, so FMX-171
does not canonize that env var.

FMX consequence: the durable policy should say "no-op or `AlwaysOffSampler` +
no exporter" rather than naming an unsourced global SDK-disable variable.

## Version Snapshot

As of 2026-06-18, direct GitHub release checks returned:

| Component | Latest stable checked | Published | Source |
|---|---:|---:|---|
| Grafana Tempo | `v2.10.7` | 2026-06-12 | `https://github.com/grafana/tempo/releases/tag/v2.10.7` |
| Grafana Mimir | `mimir-3.1.1` | 2026-06-12 | `https://github.com/grafana/mimir/releases/tag/mimir-3.1.1` |
| Grafana Alloy | `v1.17.0` | 2026-06-12 | `https://github.com/grafana/alloy/releases/tag/v1.17.0` |
| OpenTelemetry JS | `v2.8.0` | 2026-06-11 | `https://github.com/open-telemetry/opentelemetry-js/releases/tag/v2.8.0` |
| Prometheus | `v3.12.0` | 2026-05-28 | `https://github.com/prometheus/prometheus/releases/tag/v3.12.0` |

These are research-time facts only. The dependency-currency rule still requires
implementation to check current stable releases, read current docs and pin exact
versions at the time the stack is actually introduced.
