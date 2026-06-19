---
title: FMX-179 monorepo workspace bootstrap handoff
status: current
tags: [execution, handoff, monorepo, workspace, nx, pnpm, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: handoff
binding: false
linear: FMX-179
related:
  - [[../../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
  - [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
---

# FMX-179 monorepo workspace bootstrap handoff

## Goals

- Define the monorepo/workspace bootstrap shape before any scaffold code lands.
- Preserve Perplexity, Context7, Ref and registry research.
- Prepare all Accepted Nico decisions for package granularity, namespace,
  workspace linking and code-gate activation.

## Completed

- Synced `main` and claimed FMX-179 in Linear.
- Created branch/worktree `codex/fmx-179-monorepo-workspace-bootstrap`.
- Ran Perplexity-first research for DDD package granularity, comparable
  game-production precedent and practical Nx/pnpm bootstrap sequencing.
- Ran Context7/Ref source checks for Nx, pnpm, TypeScript, Vitest, Playwright
  and Storybook, plus npm registry latest checks.
- Added raw captures, synthesis, accepted ADR-0114, decision queue and scaffold
  plan.
- Updated front-door notes and clarified design-system coverage wording as
  target-only until real packages exist.

## Open Tasks

- Nico to approve or amend D1-D8 in the decision queue.
- If approved, a follow-up scaffold PR can apply ADR-0114, create real
  workspace files/packages and activate only real code-phase gates.
- If amended, update ADR-0114 and the scaffold plan before implementation.

## Decisions Made

None binding. Approved packet:

- D1=A: progressive one-context package catalog.
- D2=A: real foundation packages only.
- D3=A: workspace package facade replaces `src/domain/<context>`.
- D4=A: pnpm workspaces + TypeScript references + Nx TypeScript plugin.
- D5=A: no placeholder green gates.
- D6=A: `@klubhaus-elf/*` package namespace.
- D7=A: module owner metadata now, domain CODEOWNERS later.
- D8=A: re-check and exact-pin versions in the scaffold PR.

## Blockers

- Binding status and actual scaffold require Nico approval.

## Durable Notes Updated

- [[../../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-monorepo-workspace-ddd-package-granularity-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]]
- [[../../60-Research/raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
- [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

ADR-0114 remains draft/binding after Nico approved it on 2026-06-19 D1-D8.
