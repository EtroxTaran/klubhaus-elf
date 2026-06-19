---
title: FMX-171 Observability Trigger and Span Policy Decision Queue
status: accepted
tags: [execution, decision-queue, observability, tracing, tempo, mimir, prometheus, opentelemetry, alloy, fmx-171, accepted]
created: 2026-06-18
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-171
related:
  - [[../60-Research/observability-trace-backend-readd-trigger-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-observability-trace-backend-readd-trigger-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-observability-trace-backend-source-checks-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../10-Architecture/08-Crosscutting]]
  - [[../10-Architecture/07-Deployment]]
  - [[../10-Architecture/11-Risks]]
---

# FMX-171 Observability Trigger and Span Policy Decision Queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-171.


## Status

Accepted by Nico on 2026-06-19. This queue records recommendations only. The Tempo/Mimir trigger
thresholds and MVP span policy do not become binding after Nico approved it on 2026-06-19.

## D1 - Tempo Re-add Trigger

Options:

- **A. Service-count-only trigger.** Re-add Tempo once the runtime has at least
  two or three independently deployed backend services on a user-visible path.
- **B. Incident-only trigger.** Re-add Tempo after a logs/metrics-only incident
  exceeds a fixed triage budget, regardless of runtime topology.
- **C. Topology plus incident-budget trigger.** Re-add Tempo when a production
  or staging incident occurs after at least two independently deployed runtime
  services participate in one user-visible request/command/event path, and the
  operator cannot localise the slow or failing hop from Loki + Prometheus within
  30 minutes of triage start.

Recommendation: **C.**

Reason: C is concrete enough for an operator to fire, but avoids re-adding a
trace backend merely because a worker has been split. The 30-minute budget makes
the current qualitative "not explainable from logs+metrics" clause measurable.

## D2 - Mimir Re-add Trigger

Options:

- **A. Prometheus retention-budget trigger.** Re-add Mimir when the daily
  Prometheus capacity check shows that keeping ADR-0017's required 15-month
  metrics retention would require `--storage.tsdb.retention.size` above 80% of
  the dedicated Prometheus TSDB disk allocation for seven consecutive days.
- **B. Long-term-SLO trigger.** Re-add Mimir once product/SRE explicitly requires
  long-range multi-node metrics history, regardless of current local disk use.
- **C. Add Mimir now.** Treat remote metrics as part of the baseline
  observability target.

Recommendation: **A.**

Reason: A is directly tied to Prometheus' local-storage guidance and gives a
single measurable watermark. B is a valid future strategy trigger but not the
storage-pressure threshold FMX-171 needs. C contradicts the lean MVP profile.

## D3 - MVP Span Policy

Options:

- **A. Defer all span instrumentation until Tempo is deployed.**
- **B. Instrument now, collect later.** Keep OTel span coverage points in the
  architecture contract, but production tracing uses no-op / `AlwaysOffSampler`
  / no exporter until Tempo is enabled.
- **C. Emit sampled spans to Alloy now and drop them while Tempo is absent.**

Recommendation: **B.**

Reason: B preserves ADR-0017's backend-neutral instrumentation promise and keeps
Tempo re-add to collector-config + container + runtime config. A makes the later
Tempo re-add an instrumentation project. C pays serialization/network/retry cost
for data that is intentionally not retained.

## D4 - Promotion Path

Options:

- **A. Accepted: promote FMX-171 wording to binding after Nico approved D1-D4 on
  2026-06-19.**
- **B. Treat the agent recommendation as accepted because ADR-0017 is already
  accepted.**
- **C. Do not edit canonical docs until after a separate discussion.**

Recommendation: **A.**

Reason: A gives Nico concrete text to approve and preserves the architecture
decision gate. B would self-ratify architecture. C leaves the existing
Tempo/Mimir/span ambiguity in place.

## Consolidated Recommendation

Approve **D1=C, D2=A, D3=B, D4=A**.

Operator interpretation:

- `TempoBackendRequired` fires on the first qualifying cross-service incident
  that exceeds a 30-minute Loki+Prometheus localisation budget after the runtime
  has at least two independently deployed services in the affected path.
- `MimirBackendRequired` fires when 15-month Prometheus retention requires more
  than 80% of the dedicated TSDB disk budget for seven consecutive daily checks.
- OTel span coverage is designed now; production span export stays off until
  Tempo is enabled.
- No sampled spans are exported to a blackhole/drop pipeline in MVP.

## Nico Decision Log

Pending.
## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=C, D2=A, D3=B, D4=A**.

No open Nico decision remains for FMX-171.
