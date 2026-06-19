---
title: Handoff FMX-171 Observability Trigger and Span Policy
status: wrapped
tags: [meta, execution, handoff, observability, tracing, tempo, mimir, prometheus, opentelemetry, fmx-171]
created: 2026-06-18
updated: 2026-06-18
type: handoff
binding: false
linear: FMX-171
related:
  - [[../../60-Research/observability-trace-backend-readd-trigger-2026-06-18]]
  - [[../fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../../10-Architecture/08-Crosscutting]]
  - [[../../10-Architecture/07-Deployment]]
---

# Handoff: FMX-171 Observability Trigger and Span Policy (2026-06-18)

## Linear

- Issue: FMX-171

## Done this session

- Claimed FMX-171 and moved it to In Progress.
- Created branch/worktree `codex/fmx-171-observability-trigger-span-policy`.
- Captured Perplexity-first research and targeted source checks for Tempo,
  Mimir, Prometheus local TSDB retention, Alloy OTLP wiring and OpenTelemetry JS
  no-export/no-sampling posture.
- Wrote synthesis:
  [[../../60-Research/observability-trace-backend-readd-trigger-2026-06-18]].
- Wrote Nico decision queue:
  [[../fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18]].
- Added proposed non-binding amendments to ADR-0017 and supporting
  observability/deployment/runbook notes so the draft packet is concrete.
- Updated front-door indexes and raw-research indexes.

## Open / next step

- Nico must answer D1-D4 in the FMX-171 decision queue.
- If accepted, promote the proposed ADR-0017 amendment from pending wording to
  binding current architecture and keep Linear moving toward review/closure.

## Blockers

- No blocker to draft packet completion.
- Architecture ratification is blocked on Nico's HITL decision.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-observability-trace-backend-*.md`
- `docs/60-Research/observability-trace-backend-readd-trigger-2026-06-18.md`
- `docs/40-Execution/fmx-171-observability-trigger-span-policy-decision-queue-2026-06-18.md`
- `docs/10-Architecture/09-Decisions/ADR-0017-observability-logging.md`
- `docs/10-Architecture/08-Crosscutting.md`
- `docs/10-Architecture/07-Deployment.md`
- `docs/10-Architecture/11-Risks.md`
- `docs/30-Implementation/observability-runbook.md`
- `docs/30-Implementation/deployment-dokploy.md`
- Front-door/index notes updated in Current State, Decision Log, Research Map,
  Research Summary, raw Perplexity README and session handoffs.

## Needs promotion

- FMX-171 D1-D4 promotes only after Nico approval.
- No implementation work is authorized by this packet while it remains
  decision-pending.
