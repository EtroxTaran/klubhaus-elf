---
title: "Handoff - FMX-180 Code-Phase DoD Transition"
status: current
tags: [handoff, execution, fmx-180, dod, ci, monorepo]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
related:
  - [[../../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
  - [[../../60-Research/code-phase-dod-transition-contract-2026-06-14]]
  - [[../fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]
---

# Handoff - FMX-180 Code-Phase DoD Transition

## Goals

- Make the post-reset docs-phase Definition of Done executable.
- Preserve the future code-phase DoD as a target contract.
- Save the research and Nico decision chain.

## Completed

- Claimed FMX-180 in Linear as `In Progress`.
- Created FMX-195 in Backlog for the pnpm pin mismatch.
- Recorded raw Perplexity/source-check research and synthesis.
- Promoted Nico's D1-D4 decisions into accepted ADR-0110.
- Added the executable transition checklist in
  [[../../30-Implementation/code-phase-dod-transition-contract]].
- Updated workflow, CI, design-system and roadmap docs to distinguish active
  docs-phase gates from target-only code-phase gates.

## Open Tasks

- Run docs validation and publish the PR.
- Future issues must execute the bootstrap/currency work:
  FMX-179, FMX-175, FMX-176 and FMX-195.

## Decisions Made

- D1: Phase-split DoD.
- D2: Nx day one for code phase.
- D3: Target-only `apps/web` / `packages/*` paths until bootstrap.
- D4: pnpm currency routed separately to FMX-195.

## Blockers

- None for FMX-180 after Nico's decisions.

## Durable Notes Updated

- [[../../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../60-Research/code-phase-dod-transition-contract-2026-06-14]]
- [[../fmx-180-code-phase-dod-transition-decision-queue-2026-06-14]]

## Promotion Needed

- No further promotion needed for FMX-180; ADR-0110 is accepted/binding.

