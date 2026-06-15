---
title: 2026-06-15 FMX-167 Architecture Fitness Function
status: promoted
tags: [handoff, execution, architecture-fitness, ddd, bounded-context, quality, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-167
related:
  - [[../../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../../40-Quality/architecture-fitness-function]]
  - [[../fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
---

# 2026-06-15 FMX-167 Architecture Fitness Function

## Goals

- Define and anchor the architecture fitness function for the no-shared-tables
  and no-cross-context-joins invariant.
- Preserve raw Perplexity discovery, source checks, Nico's decisions, the
  accepted ADR and the future quality runbook.

## Completed

- Live triage completed; FMX-167 moved to `In Progress`.
- Main fast-forwarded before work.
- Dedicated branch/worktree created:
  `codex/fmx-167-architecture-fitness-function`.
- Perplexity-first discovery saved for import boundaries, storage/query
  boundaries and real-world/game precedents.
- Source checks saved for dependency-cruiser, Nx, Drizzle, ts-morph,
  pgsql-ast-parser and TypeScript.
- Nico accepted D1=A, D2=A, D3=A.
- ADR-0121 accepted and quality runbook added.
- Front-door docs updated.

## Open Tasks

- Future code bootstrap must re-check dependency versions before installing
  scanner packages.
- Future code bootstrap must implement real scanner scripts, violation fixtures
  and burn-in before making architecture-fitness a hard `quality` subgate.

## Decisions Made

- D1=A: `dependency-cruiser` plus custom TypeScript/SQL scanners.
- D2=A: core violations hard-fail after real scripts/workflows exist and burn
  in.
- D3=A: accepted ADR plus current runbook now; no code dependencies/scripts in
  docs-only phase.

## Blockers

None for the docs packet.

## Durable Notes Updated

- [[../../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
- [[../../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[../../40-Quality/architecture-fitness-function]]
- [[../fmx-167-architecture-fitness-function-decision-queue-2026-06-15]]
- [[../../10-Architecture/10-Quality]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Architecture-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../60-Research/00-summary]]

## Promotion Needed

No additional promotion needed for FMX-167. ADR-0121 and
[[../../40-Quality/architecture-fitness-function]] are the durable sources.

