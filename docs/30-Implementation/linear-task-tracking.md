---
title: Linear Task Tracking
status: current
tags: [meta, implementation, backlog]
updated: 2026-05-17
---

# Linear Task Tracking

Linear is the operational task tracker for `soccer-manager`.

- **Linear project:** [soccer-manager — Research & Architecture](https://linear.app/coding-x/project/soccer-manager-research-and-architecture-c61a4eacf182)
- **Linear team:** `antigravity-kompass` (`AKOM`)
- **Linear working agreement:** [soccer-manager Linear Working Agreement](https://linear.app/coding-x/document/soccer-manager-linear-working-agreement-b061d12afe7a)
- **Docs vault:** `docs/` remains the durable knowledge base.
- **GitHub PRs:** implementation and documentation changes still flow through GitHub PRs.

## Operating principles

1. Linear is the source of truth for operational state, ownership, and progress.
2. The vault is the source of truth for durable decisions and project memory.
3. Every issue must be testable, linkable, and small enough to ship predictably.
4. Work moves through explicit statuses and explicit dependencies.
5. A ticket is done only when acceptance criteria and documentation obligations are complete.

## Issue quality standard

Use [../90-Meta/templates/linear-issue.md](../90-Meta/templates/linear-issue.md)
for issue bodies, and
[../90-Meta/templates/linear-issue-examples.md](../90-Meta/templates/linear-issue-examples.md)
for concrete examples.

Required sections in each implementation or research issue:

- Context
- User Story (`As... I want... so that...`)
- Gherkin scenarios (`Given/When/Then`) for behavioral flows
- Acceptance criteria checklist
- Out of scope
- Dependencies and blockers
- Documentation links (vault paths, ADRs, feature specs, game design notes)
- Verification notes (tests/checks/manual validation)

## Definition of Ready (DoR)

Do not move an issue into active execution until all are true:

- Scope is clear and bounded.
- User story and acceptance criteria are present.
- At least one concrete Gherkin scenario exists for behavior changes.
- Required links are attached (design, vault note, architecture note, or research).
- Team, owner, priority, and labels are set.
- Dependencies are expressed as Linear relations (`blocked by`, `related`, or sub-issue tree).

## Definition of Done (DoD)

Mark done only when all are true:

- Acceptance criteria are satisfied.
- PR is linked and merged (or explicitly marked docs-only where applicable).
- Tests/checks for the change are documented in the issue comment trail.
- Final vault paths are posted on the issue.
- Remaining follow-up work is split into new issues and linked back.

## Workflow states and transitions

Keep workflow simple and explicit:

1. `Triage` (optional intake inbox)
2. `Backlog` (accepted but not scheduled)
3. `Planned` or `Ready` (DoR met; prepared for cycle/project)
4. `In Progress`
5. `In Review`
6. `Done`
7. `Canceled` / `Duplicate` / `Won't Fix`

Transition rules:

- Move from `Triage` to `Backlog` or `Canceled` with a rationale comment.
- Move from `Backlog` to `Planned/Ready` only when DoR is met.
- Move to `In Progress` only when actively worked and owned.
- Move to `Done` through PR/validation automation or explicit closure comment.

## Labels and metadata

Use consistent taxonomy so views and insights stay useful:

- `type:*` (`feature`, `bug`, `research`, `refactor`, `chore`)
- `area:*` (bounded context or system area, for example `area:match-engine`)
- `priority:*` (`p0`..`p3`) in addition to native Linear priority
- `size:*` (`xs`..`xl`) when estimation clarity helps planning
- `parallel:*` (`safe`, `blocked`) for dispatch planning
- `status:*` labels only for special operational flags not represented by workflow

Label rules:

- Prefer workspace-level labels for shared terms (`bug`, `feature`, `p1`).
- Use label descriptions for ambiguous terms.
- Merge or archive duplicate labels; avoid synonyms.
- Avoid over-labeling: each issue should have only labels needed for routing and reporting.

## Linking and dependency standards

- Use Linear relations, not free-text dependency notes, for blockers and duplicates.
- Use parent/sub-issues when one outcome needs multiple independently owned tasks.
- Link the primary vault note(s) and update links as work progresses.
- Link PRs via branch naming with issue ID and/or magic words in PR descriptions.
- Keep one canonical issue for each work item; close duplicates into canonical issues.

## Progress tracking standards

During work, update the issue with concise comments:

- progress made
- blockers / decisions needed
- PR link
- final vault path(s)

Program-level tracking defaults:

- Use cycles for near-term execution cadence.
- Use projects for multi-week outcomes and cross-team coordination.
- Use custom views for role-based tracking (for example open `p0/p1` bugs, blocked work, this-cycle commitments).
- Use Insights for lead time, cycle time, triage time, and bug trend monitoring when available.

## Anti-patterns to avoid

- Vague tickets without user impact or verification criteria.
- Oversized tickets spanning unrelated outcomes.
- Dependency notes only in prose, without Linear relations.
- Status drift (`In Progress` issues with no owner activity).
- Closing issues without final vault links.
- Creating parallel labels with identical meaning (`auth` vs `authentication`).

## Working rules

1. Pick work from Linear issues, not ad hoc chat memory.
2. For multi-file work, create a plan in `.cursor/plans/` and link it in a Linear comment.
3. Keep issue progress comments updated through execution.
4. Close/complete issues only after docs/code merge and DoD validation.
5. Keep research outputs in the vault and link them back from Linear.

## Parallel dispatch reference (Wave 1 historical)

Phase 1 used these parallel-safe research issues:

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

## Architecture and backlog wave reference

- ADR issues: AKOM-117 through AKOM-125, plus AKOM-118 through AKOM-124 depending on order.
- arc42 synthesis: [AKOM-126](https://linear.app/coding-x/issue/AKOM-126/architecture-expand-arc42-docs-from-research-and-adrs)
- Tracking setup: [AKOM-127](https://linear.app/coding-x/issue/AKOM-127/meta-create-labels-milestones-and-branch-protection-checklist)
- Detailed implementation backlog: [AKOM-128](https://linear.app/coding-x/issue/AKOM-128/meta-create-m1-m8-implementation-backlog-from-adrs)

## Seed epics reference

Seed epics exist in Linear and must be split after ADRs are stable:

- [AKOM-130](https://linear.app/coding-x/issue/AKOM-130/areamatch-engine-implement-deterministic-match-engine-v1) Match Engine v1
- [AKOM-131](https://linear.app/coding-x/issue/AKOM-131/arealeague-implement-single-league-schedule-and-standings) League schedule and standings
- [AKOM-132](https://linear.app/coding-x/issue/AKOM-132/areasquad-implement-player-attributes-and-squad-model) Squad/player model
- [AKOM-129](https://linear.app/coding-x/issue/AKOM-129/areatraining-implement-weekly-training-planning-skeleton) Training skeleton
- [AKOM-134](https://linear.app/coding-x/issue/AKOM-134/areatransfer-implement-transfer-market-offer-loop-skeleton) Transfer market skeleton
- [AKOM-133](https://linear.app/coding-x/issue/AKOM-133/areafinance-implement-finance-and-stadium-foundations) Finance/stadium foundations
- [AKOM-135](https://linear.app/coding-x/issue/AKOM-135/areayouth-implement-youth-academy-skeleton) Youth academy skeleton

## Baseline conventions used

- One Linear project groups the full Research/Architecture/backlog setup effort.
- Milestones represent meaningful phases, not arbitrary dates.
- Issues are labeled by type, area, priority, size, and parallelization.
- Linear priority is set in addition to priority labels.
- Dependencies use Linear blockers, not only text references.
- Research issues are intentionally independent so parallel agents can run them safely.
