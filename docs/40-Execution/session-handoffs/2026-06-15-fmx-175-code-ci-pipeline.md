---
title: FMX-175 Code-CI pipeline handoff
status: current
tags: [execution, handoff, ci, github-actions, nx, pnpm, quality, security, fmx-175]
created: 2026-06-15
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-175
related:
  - [[../../60-Research/code-ci-pipeline-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
  - [[../fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
  - [[../../30-Implementation/ci-and-review-process]]
---

# FMX-175 Code-CI pipeline handoff

## Goals

- Reconcile stale D-002/code-check wording with the docs-vault-only repo.
- Define the future code-phase required check package without adding fake code
  workflows or dependencies.
- Preserve Perplexity-first research, official source checks, real-world
  delivery precedent and game/simulation QA implications.
- Record Nico-approved decisions and update front-door vault routing.

## Completed

- Fast-forwarded `/root/research-gp` `main` to the current remote main before
  starting.
- Moved FMX-175 from `Backlog` to `In Progress`.
- Created clean branch/worktree `codex/fmx-175-code-ci-pipeline`.
- Ran Perplexity-first research for code-CI naming, burn-in, branch protection,
  monorepo CI, PR/nightly/release split and game/simulation QA precedent.
- Source-checked against official/primary docs for GitHub branch protection,
  GitHub runner hardening, pnpm workspace/install behavior, Nx CI, Vitest,
  Playwright, fast-check, StrykerJS, Storybook a11y, Lighthouse CI, cdxgen and
  simulation determinism.
- Added raw research:
  [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-2026-06-15]].
- Added source-check note:
  [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]].
- Added synthesis:
  [[../../60-Research/code-ci-pipeline-2026-06-15]].
- Added HITL decision queue:
  [[../fmx-175-code-ci-pipeline-decision-queue-2026-06-15]].
- Updated [[../../30-Implementation/ci-and-review-process]] and ADR-0044 with
  the accepted future context package: active `docs-check`/`linear-id`, future
  `quality` / `e2e` / `security` after bootstrap and burn-in, no
  `cursor-smoke` or `configured` as required contexts.
- Updated Current-State, Decision-Log, Research-Map, Implementation-Map,
  research summary, raw research index, Implementation README and handoff index.

## Open Tasks

- Run docs validation and whitespace checks.
- Commit, push, open PR and move FMX-175 to `In Review`.
- Future code bootstrap must re-check current package versions before adding
  dependencies or pins.

## Decisions Made

- D1=A: future required names are script/domain-aligned:
  `quality`, `e2e`, `security`.
- D2=A: branch-protection promotion requires burn-in on real scripts/workflows.
- D3=A: compress D-002 in place as historical lessons, not live blocker state.
- D4=A: FMX-175 defines the contract; code-phase bootstrap owns scripts and
  workflows before the first code PR.

## Blockers

- None for FMX-175. Future code-CI activation remains blocked on real workspace
  targets per ADR-0110 and the FMX-179 bootstrap decision.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
- [[../../60-Research/code-ci-pipeline-2026-06-15]]
- [[../fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]
- [[../../30-Implementation/README]]

## Promotion Needed

No FMX-175 decision remains open. The future bootstrap/code-phase PR must
activate real scripts and workflows before any code-CI check can become
required.
