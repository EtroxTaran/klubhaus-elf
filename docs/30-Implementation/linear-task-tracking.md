---
title: Linear Task Tracking
status: draft
tags: [meta, implementation, backlog]
updated: 2026-05-15
---

# Linear Task Tracking

Linear is the operational task tracker for `soccer-manager`.

- **Linear project:** [soccer-manager — Research & Architecture](https://linear.app/coding-x/project/soccer-manager-research-and-architecture-c61a4eacf182)
- **Linear team:** `antigravity-kompass` (`AKOM`)
- **Linear working agreement:** [soccer-manager Linear Working Agreement](https://linear.app/coding-x/document/soccer-manager-linear-working-agreement-b061d12afe7a)
- **Docs vault:** `docs/` remains the durable knowledge base.
- **GitHub PRs:** implementation and documentation changes still flow through GitHub PRs.

## Working rules

1. Pick work from Linear issues, not ad hoc chat memory.
2. For multi-file work, create a Plan Mode document in `.cursor/plans/` and link it in a Linear comment.
3. During work, update the Linear issue with concise comments:
   - progress made
   - blockers / decisions needed
   - PR link
   - final Vault path(s)
4. Close/complete Linear issues only after the corresponding docs/code are merged and acceptance criteria are satisfied.
5. Keep research outputs in the Vault and link them back from Linear.

## Parallel dispatch

Start Phase 1 with these parallel-safe research issues:

| Linear | Topic | Output |
| --- | --- | --- |
| [AKOM-114](https://linear.app/coding-x/issue/AKOM-114/research-analyze-club-boss-gameplay-and-ux-patterns) | Club Boss gameplay and UX patterns | `docs/60-Research/club-boss-analysis.md` |
| [AKOM-113](https://linear.app/coding-x/issue/AKOM-113/research-deep-dive-classic-anstoss-design-patterns) | Classic Anstoss design patterns | `docs/60-Research/anstoss-series-deep-dive.md` |
| [AKOM-112](https://linear.app/coding-x/issue/AKOM-112/research-build-football-manager-competitor-matrix) | Competitor matrix | `docs/60-Research/competitor-matrix.md` |
| [AKOM-111](https://linear.app/coding-x/issue/AKOM-111/research-define-ip-licensing-and-naming-constraints) | IP, licensing, and naming constraints | `docs/60-Research/ip-and-licensing.md` |
| [AKOM-110](https://linear.app/coding-x/issue/AKOM-110/research-research-pwa-offline-first-save-and-sync-patterns) | PWA offline-first save and sync patterns | `docs/60-Research/pwa-offline-patterns.md` |

Then run:

| Linear | Topic | Blocked by |
| --- | --- | --- |
| [AKOM-115](https://linear.app/coding-x/issue/AKOM-115/research-produce-mvp-feature-gap-and-moscow-scope) | Feature-gap MoSCoW scope | AKOM-114, AKOM-113, AKOM-112 |
| [AKOM-116](https://linear.app/coding-x/issue/AKOM-116/research-consolidate-phase-1-findings-and-mvp-recommendation) | Phase 1 research summary | AKOM-110 through AKOM-115 |

## Architecture and backlog wave

- ADR issues: AKOM-117 through AKOM-125, plus AKOM-118 through AKOM-124 depending on order.
- arc42 synthesis: [AKOM-126](https://linear.app/coding-x/issue/AKOM-126/architecture-expand-arc42-docs-from-research-and-adrs)
- Tracking setup: [AKOM-127](https://linear.app/coding-x/issue/AKOM-127/meta-create-labels-milestones-and-branch-protection-checklist)
- Detailed implementation backlog: [AKOM-128](https://linear.app/coding-x/issue/AKOM-128/meta-create-m1-m8-implementation-backlog-from-adrs)

## Seed epics

Seed epics exist in Linear and must be split after ADRs are stable:

- [AKOM-130](https://linear.app/coding-x/issue/AKOM-130/areamatch-engine-implement-deterministic-match-engine-v1) Match Engine v1
- [AKOM-131](https://linear.app/coding-x/issue/AKOM-131/arealeague-implement-single-league-schedule-and-standings) League schedule and standings
- [AKOM-132](https://linear.app/coding-x/issue/AKOM-132/areasquad-implement-player-attributes-and-squad-model) Squad/player model
- [AKOM-129](https://linear.app/coding-x/issue/AKOM-129/areatraining-implement-weekly-training-planning-skeleton) Training skeleton
- [AKOM-134](https://linear.app/coding-x/issue/AKOM-134/areatransfer-implement-transfer-market-offer-loop-skeleton) Transfer market skeleton
- [AKOM-133](https://linear.app/coding-x/issue/AKOM-133/areafinance-implement-finance-and-stadium-foundations) Finance/stadium foundations
- [AKOM-135](https://linear.app/coding-x/issue/AKOM-135/areayouth-implement-youth-academy-skeleton) Youth academy skeleton

## Best-practice conventions used

- One Linear project groups the full Research/Architecture/backlog setup effort.
- Milestones represent meaningful phases, not arbitrary dates.
- Issues are labeled by type, area, priority, size, and parallelization.
- Linear priority is set in addition to priority labels.
- Dependencies use Linear blockers, not only text references.
- Research issues are intentionally independent so parallel agents can run them safely.
