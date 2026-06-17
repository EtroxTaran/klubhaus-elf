---
title: "Session handoff: FMX-176 local-parity Lefthook"
status: current
tags: [handoff, tooling, lefthook, local-parity, fmx-176]
created: 2026-06-17
updated: 2026-06-17
type: handoff
binding: false
linear: FMX-176
related:
  - [[../../60-Research/local-parity-lefthook-2026-06-17]]
  - [[../fmx-176-local-parity-decision-record-2026-06-17]]
  - [[../../30-Implementation/ci-and-review-process]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Session handoff: FMX-176 local-parity Lefthook

## Goals

Restore local hook parity for the active docs-phase check without adding
placeholder code-phase gates.

## Completed

- Added exact-pinned `lefthook@2.1.9`.
- Added minimal `lefthook.yml` with `pre-push -> pnpm docs:check`.
- Added `pnpm hooks:install` and `pnpm hooks:run:pre-push`.
- Added `pnpm-workspace.yaml` only for pnpm v11 `allowBuilds.lefthook: true`.
- Saved raw Perplexity capture, source checks, synthesis and decision record.

## Open Tasks

- FMX-179/code bootstrap must revisit hooks once real app/package paths,
  root scripts, Nx targets and CI workflows exist.
- `docs:status-check` remains manual and should be run when ADR/GDDR
  `status:` or `binding:` semantics change.

## Decisions Made

Nico accepted the hybrid scope on 2026-06-17: docs-phase Lefthook now,
`pre-push` trigger, manual `docs:status-check`, and no Biome/Nx/lint-staged
until code bootstrap.

## Blockers

None for the docs-phase hook. Code-phase local parity remains blocked by the
absence of app/package workspace paths and real code scripts.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-local-parity-lefthook-2026-06-17]]
- [[../../60-Research/raw-perplexity/raw-local-parity-lefthook-source-checks-2026-06-17]]
- [[../../60-Research/local-parity-lefthook-2026-06-17]]
- [[../fmx-176-local-parity-decision-record-2026-06-17]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]

## Promotion Needed

No ADR/GDDR promotion is needed for this docs-phase tooling beat. Future
code-phase hook expansion needs a fresh decision when real scripts and paths
exist.
