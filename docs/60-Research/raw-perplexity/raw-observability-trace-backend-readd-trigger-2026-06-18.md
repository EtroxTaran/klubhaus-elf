---
title: Raw Perplexity - Observability Trace Backend Re-add Trigger
status: raw
tags: [research, raw, perplexity, observability, tracing, tempo, mimir, prometheus, opentelemetry, alloy, fmx-171]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-171
related:
  - [[../observability-trace-backend-readd-trigger-2026-06-18]]
  - [[raw-observability-trace-backend-source-checks-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../../10-Architecture/08-Crosscutting]]
  - [[../../10-Architecture/07-Deployment]]
  - [[../../30-Implementation/observability-runbook]]
---

# Raw Perplexity - Observability Trace Backend Re-add Trigger

Private Perplexity discovery capture for FMX-171. This is discovery input, not
implementation authority. Version and configuration claims were source-checked
separately in
[[raw-observability-trace-backend-source-checks-2026-06-18]] before synthesis.

## Prompt

As of 2026-06-18, research concrete observability policy for a single-node
Docker/Dokploy PWA/backend stack that currently uses Grafana Loki + Prometheus +
Grafana + Alloy + GlitchTip, while Grafana Tempo and Grafana Mimir are deferred.

Need:

1. best-practice or precedent for when to add a trace backend like Grafana
   Tempo: concrete operator-fireable triggers on service count, cross-service
   latency/MTTR incidents, or distributed tracing adoption thresholds;
2. best-practice thresholds for Prometheus local TSDB pressure that should
   trigger adding Mimir or remote/long-term metrics storage, including
   `retention.size` watermarks, disk allocation percentages and retention
   pressure signals;
3. OpenTelemetry JavaScript posture when no trace collector/backend is deployed
   at MVP: no-op TracerProvider, SDK disabled, `AlwaysOffSampler`,
   `OTEL_TRACES_EXPORTER=none`, or emit spans to a collector that drops them;
   compare overhead and future-proofing;
4. current stable versions and relevant docs/releases for Grafana Tempo,
   Grafana Mimir, Grafana Alloy, OpenTelemetry JS SDK and Prometheus.

Return source list with URLs, key findings, policy options and one recommended
policy for MVP span instrumentation and Tempo/Mimir re-add triggers.

## Perplexity Discovery Summary

### Trace backend timing

Perplexity found no official Grafana/CNCF numeric rule for "add a trace
backend at N services". The useful guidance is qualitative:

- distributed tracing is most valuable once a request or command crosses
  multiple independently deployed services or async worker hops;
- the signal becomes operationally worthwhile when logs and metrics cannot
  localise a slow or failing hop quickly enough during incidents;
- Tempo-specific value comes from service graphs, span metrics, TraceQL metrics
  and log/metric-to-trace drill-downs.

The discovery pass proposed three trigger families:

| Trigger family | Example | Caveat |
|---|---|---|
| Architecture complexity | add Tempo after three or more backend services or async hops in user-visible paths | Service count alone may add infra too early for FMX's single-node MVP. |
| Incident / MTTR | add Tempo after repeated cross-service incidents where logs/metrics fail to identify the hop | Needs a concrete incident budget to be operator-fireable. |
| Cross-signal workflow | add Tempo once service graphs, exemplars or trace-derived RED metrics become normal SRE workflow | Useful, but it describes a capability decision more than a first trigger. |

### Metrics backend timing

Perplexity treated Mimir as a remote/long-term metrics backend for when local
Prometheus storage no longer satisfies retention or reliability needs. The
source-checkable point was Prometheus storage guidance, not a Mimir-specific
numeric threshold.

The discovery pass suggested:

- alert before local Prometheus disk is full;
- keep a buffer between `storage.tsdb.retention.size` and actual allocated disk;
- use current ingestion rate and required retention to project when the
  single-node TSDB will breach the safe budget;
- add Mimir when keeping required retention on one Prometheus node would force
  unsafe disk pressure, retention cuts or remote-write/HA needs.

### OpenTelemetry JS without Tempo

Perplexity compared four approaches:

| Option | Runtime behavior | Discovery verdict |
|---|---|---|
| API/no SDK registered | tracer calls are no-op by default | Lowest overhead, but later Tempo enablement requires bootstrap wiring. |
| SDK with `AlwaysOffSampler` | instrumentation wiring exists, no sampled spans | Good future-proofing with low overhead. |
| `OTEL_TRACES_EXPORTER=none` | no automatically configured exporter | Useful safety flag, but if spans are sampled they may still be created/processed. |
| Export spans to a collector that drops them | full span creation/export path without Tempo | Highest overhead and bad default for FMX's MVP. |

The discovery recommendation was "instrument now, collect later": write the
span coverage points and OTel bootstrap seam now, keep production span sampling
off/no exporter until the Tempo trigger fires, and avoid a blackhole collector.

### Version leads

Perplexity correctly pointed to official docs and GitHub release pages, but it
did not provide reliable exact versions. Exact versions were therefore
source-checked from GitHub releases in
[[raw-observability-trace-backend-source-checks-2026-06-18]].

## Perplexity-Suggested Policy Options

### Tempo

- **A. Topology-only gate.** Re-add Tempo as soon as the backend request path has
  multiple independently deployed services/workers.
- **B. Incident-only gate.** Re-add Tempo only after logs/metrics fail during a
  real incident.
- **C. Hybrid topology plus incident gate.** Re-add Tempo when the system has a
  real cross-service path and a measured incident exceeds the log/metric-only
  localisation budget.

### Mimir

- **A. Local TSDB until safe disk budget fails.** Keep Prometheus local while the
  required retention fits inside a conservative retention-size cap.
- **B. Remote metrics when long-range retention becomes product/SLO-critical.**
  Add Mimir once long history or HA is explicitly required.
- **C. Mimir immediately.** Pay remote metrics complexity from day one.

### MVP span policy

- **A. Defer all instrumentation until Tempo.**
- **B. Instrument now, but production tracing is no-op / `AlwaysOffSampler` /
  no exporter until Tempo is enabled.**
- **C. Emit sampled spans to Alloy now and drop them until Tempo exists.**

## Source-Check Outcome

The synthesis recommends Tempo option C, Mimir option A and span option B, with
the thresholds made concrete and Nico-gated in
[[../../40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]].
