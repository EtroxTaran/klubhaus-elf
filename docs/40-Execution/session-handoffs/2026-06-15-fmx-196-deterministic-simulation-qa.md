---
title: Handoff - FMX-196 deterministic simulation QA
status: wrapped
tags: [meta, execution, handoff, determinism, replay, soak-test, save-forward, fmx-196]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-196
related:
  - [[../../60-Research/deterministic-simulation-qa-harness-2026-06-15]]
  - [[../../40-Quality/deterministic-simulation-qa-harness]]
  - [[../../10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix]]
  - [[../fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]]
---

# Handoff: FMX-196 deterministic simulation QA (2026-06-15)

## Linear

- Issue: FMX-196

## Done this session

- Synced `main` and claimed FMX-196 in Linear.
- Created branch/worktree `codex/fmx-196-deterministic-simulation-qa`.
- Captured Perplexity-first research and source checks.
- Added synthesis, accepted ADR-0120 and current quality runbook.
- Added Nico decision queue D1-D7 with recommendations.
- Updated front-door indexes and raw/handoff maps.

## Open / next step

- Nico to decide D1-D7 in
  [[../fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15]].
- If accepted, promote ADR-0120 and the quality runbook, then patch
  [[../../60-Research/determinism-and-replay]] to allow QA sparse snapshots
  while preserving compact production replay by default.
- Code-phase follow-up: implement fixture manifests, artifact writers, parity
  matrix and soak reports only after code-phase bootstrap creates real targets.

## Blockers

- Binding promotion is blocked on Nico's D1-D7 approval.

## Changed vault paths

- `.cursor/plans/fmx-196-deterministic-simulation-qa.md`
- `docs/60-Research/raw-perplexity/raw-deterministic-simulation-qa-harness-2026-06-15.md`
- `docs/60-Research/raw-perplexity/raw-deterministic-simulation-qa-source-checks-2026-06-15.md`
- `docs/60-Research/deterministic-simulation-qa-harness-2026-06-15.md`
- `docs/40-Quality/deterministic-simulation-qa-harness.md`
- `docs/10-Architecture/09-Decisions/ADR-0120-deterministic-simulation-qa-and-save-forward-matrix.md`
- `docs/40-Execution/fmx-196-deterministic-simulation-qa-decision-queue-2026-06-15.md`
- Front-door indexes, summary and handoff index.

## Needs promotion

- ADR-0120 and the deterministic simulation QA runbook were promoted after Nico
  approved the decision packet on 2026-06-19.
