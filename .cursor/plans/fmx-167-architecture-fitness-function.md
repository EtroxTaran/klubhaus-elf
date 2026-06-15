---
title: FMX-167 Architecture Fitness Function Plan
status: implemented
created: 2026-06-15
updated: 2026-06-15
issue: FMX-167
branch: codex/fmx-167-architecture-fitness-function
---

# FMX-167 Architecture Fitness Function Plan

## Goal

Define and anchor the future code-phase architecture fitness function for the
accepted "no shared tables / no cross-context joins" invariant. Preserve raw
research, source checks, Nico's decisions, the binding ADR and the operational
quality runbook in the vault.

## Live Intake

- Confirm live Linear state for FMX-167.
- Fast-forward `main` before writing docs.
- Move FMX-167 to `In Progress`.
- Use a dedicated worktree/branch:
  `codex/fmx-167-architecture-fitness-function`.

## Research

- Run Perplexity-first discovery for:
  - TypeScript/DDD bounded-context import boundary enforcement.
  - PostgreSQL/Drizzle no shared tables, no cross-context joins and no
    cross-context foreign-key checks.
  - Real-world, simulation/game and modular-monolith precedents.
- Verify unstable tool facts through official/current sources:
  dependency-cruiser, Nx boundary/conformance docs, Drizzle relations/joins
  docs, npm registry versions for candidate scanner packages.
- Save raw discovery plus source-check summaries.

## Decisions

Nico accepted the recommended options on 2026-06-15:

- D1=A: `dependency-cruiser` plus custom TypeScript/SQL scanners.
- D2=A: core boundary violations hard-fail once code-phase scripts exist and
  have burned in.
- D3=A: publish an accepted ADR immediately, with no code dependencies or fake
  scripts added in docs-only phase.

## Artifacts

- Research synthesis:
  `docs/60-Research/architecture-fitness-function-no-shared-tables-2026-06-15.md`
- Raw research:
  `docs/60-Research/raw-perplexity/raw-architecture-fitness-*.md`
- Decision record:
  `docs/40-Execution/fmx-167-architecture-fitness-function-decision-queue-2026-06-15.md`
- ADR:
  `docs/10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables.md`
- Runbook/spec:
  `docs/40-Quality/architecture-fitness-function.md`
- Front-door updates:
  Current-State, Decision-Log, Research-Map, Research Summary, Architecture
  Map, Implementation Map, CI/DoD/Quality notes, bounded-context map and session
  handoff index.

## Validation

- `node scripts/docs-check.mjs`
- `node scripts/status-consistency-check.mjs`
- `git diff --check`

