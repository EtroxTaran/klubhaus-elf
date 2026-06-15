---
title: FMX-177 Test strategy handoff
status: current
tags: [execution, handoff, testing, quality, ci, fmx-177]
created: 2026-06-14
updated: 2026-06-15
type: handoff
binding: false
linear: FMX-177
related:
  - [[../../60-Research/test-strategy-adr-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
  - [[../../40-Quality/test-strategy]]
  - [[../fmx-177-test-strategy-decision-queue-2026-06-14]]
---

# FMX-177 Test strategy handoff

## Goals

- Replace the dead pre-mortem-era `ADR-0040` test-strategy target with the
  current next ADR number, ADR-0118.
- Preserve Perplexity-first research, source checks, real-world/game
  simulation context and decision options.
- Create the durable test-strategy note requested by FMX-177.
- Ratify only Nico-approved decisions and keep follow-up gaps separate.

## Completed

- Synced from `origin/main` and created clean branch/worktree:
  `codex/fmx-177-test-strategy-adr`.
- Moved FMX-177 from `Backlog` to `In Progress`.
- Ran Perplexity-first research and source checks for Vitest, Playwright,
  fast-check, Stryker, axe/Playwright, Storybook test-runner, Lighthouse CI,
  GitHub Actions billing and CycloneDX cdxgen.
- Added raw research:
  [[../../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]].
- Added synthesis:
  [[../../60-Research/test-strategy-adr-2026-06-14]].
- Added and accepted ADR:
  [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]].
- Added current quality note:
  [[../../40-Quality/test-strategy]].
- Added HITL decision queue:
  [[../fmx-177-test-strategy-decision-queue-2026-06-14]].
- Recorded Nico's approval: D1-D4=A, D5=A (`85/85/85/75`) and D6=A-custom.
- Clarified D6: `xAi` means Nico's own local AI-server stack, not xAI/Grok;
  it remains a future runner path until a compatibility, isolation, secret,
  maintenance, failure-triage and cost gate is approved.
- Refreshed 2026-06-15 source observations: `vitest` /
  `@vitest/browser` / `@vitest/browser-playwright` 4.1.9, Playwright 1.60.0,
  fast-check 4.8.0, Stryker 9.6.1 and Biome 2.5.0, plus GitHub runner
  hardening guidance.
- Superseded the historical pre-mortem note as a current instruction source
  while preserving it as research input.
- Reconciled the visible stale `ADR-0040` / `Vitest 3` / coverage-threshold
  references into accepted ADR-0118 language.
- Reconciled Current-State, Decision-Log, Research-Map, 00-summary, Quality,
  Implementation README, CI process, raw research index and pre-mortem indexes.
- Created Linear follow-ups FMX-196 (deterministic simulation QA harness, soak
  metrics and save-forward matrix) and FMX-197 (PWA/offline/mobile
  degradation, release rollback and content-QA gates).

## Open Tasks

- The future code scaffold must re-check current package versions and official
  docs before adding dependencies or pins.
- Code-phase CI/scripts must not be created until real workspace targets exist
  per ADR-0110.
- Open PR, link it to FMX-177 and move the issue to `In Review`.

## Accepted decisions

- D1=A: tiered 16-layer strategy.
- D2=A: Vitest projects + Playwright E2E split.
- D3=A: replayable property-test evidence.
- D4=A: scoped Stryker nightly/release first.
- D5=A: 85/85/85/75 per-file threshold for meaningful first-party logic.
- D6=A-custom: portable GitHub-hosted path plus future local `xAi` runner
  capability, inactive until a separate proof gate.

## Blockers

- None for the docs packet. Future code activation remains blocked on real
  bootstrap targets per ADR-0110 and on a separate `xAi` runner activation
  gate before local/self-hosted runner use.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-test-strategy-adr-2026-06-14]]
- [[../../60-Research/test-strategy-adr-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0118-test-strategy-and-quality-gates]]
- [[../../40-Quality/test-strategy]]
- [[../fmx-177-test-strategy-decision-queue-2026-06-14]]
- [[../../60-Research/pre-mortem/PM-2026-05-20-16-test-strategy-depth]]
- [[../../60-Research/pre-mortem/execution-index]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]
- [[../../30-Implementation/README]]
- [[../../10-Architecture/10-Quality]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../10-Architecture/09-Design-System]]

## Promotion Needed

No promotion remains for FMX-177 itself. Follow-up topics should be tracked as
new work rather than folded into ADR-0118.
