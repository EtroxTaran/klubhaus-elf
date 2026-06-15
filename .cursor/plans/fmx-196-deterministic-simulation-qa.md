---
title: FMX-196 Deterministic Simulation QA Harness Plan
status: current
tags: [plan, fmx-196, determinism, replay, soak-test, save-forward, quality]
created: 2026-06-15
updated: 2026-06-15
type: plan
binding: false
linear: FMX-196
related:
  - [[../../docs/60-Research/deterministic-simulation-qa-harness-2026-06-15]]
  - [[../../docs/40-Quality/deterministic-simulation-qa-harness]]
  - [[../../docs/10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../../docs/40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
---

# FMX-196 Deterministic Simulation QA Harness Plan

## Goal

Define a sourced, decision-gated QA packet for deterministic match simulation,
long-horizon soak metrics and save-forward compatibility without changing
binding architecture before Nico approves the decisions.

## Scope

- Preserve raw research, synthesis, decision queue and proposed ADR.
- Anchor the rule on ADR-0096 and ADR-0118.
- Classify proposed QA sparse snapshots as non-binding until approved.
- Prepare Nico decisions; do not self-ratify.

## Execution

1. Sync `main`; claim FMX-196; create
   `codex/fmx-196-deterministic-simulation-qa`.
2. Run Perplexity-first research and source-check weak claims against primary
   or high-signal sources.
3. Save raw captures under `docs/60-Research/raw-perplexity/`.
4. Write synthesis, ADR-0120, draft quality runbook and HITL decision queue.
5. Update Decision-Log, Current-State, Research Map, Implementation Map, raw
   index, summary and handoff.
6. Validate with `node scripts/docs-check.mjs`, status consistency and
   `git diff --check`.

## Acceptance

- `FMX-196` remains non-binding until Nico approves the decision packet.
- Existing accepted deterministic profile precedence remains intact.
- Any change to production replay snapshots is explicit and decision-gated.
