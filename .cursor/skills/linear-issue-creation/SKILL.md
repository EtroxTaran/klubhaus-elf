---
name: linear-issue-creation
description: Create and maintain high-quality Linear issues with consistent user story structure, Gherkin scenarios, acceptance criteria, dependencies, and vault links. Use when creating, refining, triaging, splitting, or closing Linear tickets.
disable-model-invocation: true
---

# Linear Issue Creation

## Goal

Create Linear issues that are clear, testable, and traceable to vault documentation.

## Source Of Truth

1. Read `docs/30-Implementation/linear-task-tracking.md`.
2. Use `docs/90-Meta/templates/linear-issue.md` as the issue body structure.
3. Use `docs/90-Meta/templates/linear-issue-examples.md` for feature, bug, and research patterns.
4. Keep `docs/` as durable memory and Linear as operational state.

## Creation Workflow

Copy this checklist and complete it in order:

```md
Linear issue creation checklist:
- [ ] Confirm scope is one outcome, not a bundle
- [ ] Fill Context and User Story
- [ ] Add at least one happy-path and one edge-path Gherkin scenario
- [ ] Add measurable acceptance criteria checkboxes
- [ ] Set Team, Owner, Priority, Type, Area, and State
- [ ] Link blockers/related issues with Linear relations
- [ ] Add vault/ADR/design links
- [ ] Add verification notes (tests/manual checks)
```

## Required Issue Sections

- `Context`
- `User Story`
- `Gherkin Scenarios`
- `Acceptance Criteria`
- `Out of Scope`
- `Dependencies`
- `Documentation Links`
- `Verification / Test Notes`

## State And Relation Rules

- Use workflow statuses for lifecycle (`Triage`, `Backlog`, `Planned/Ready`, `In Progress`, `In Review`, `Done`, `Canceled`).
- Use Linear relations for dependency truth (`blocked by`, `blocks`, `related`, `duplicate`).
- Use parent/sub-issues when one outcome spans multiple owned tasks.
- Avoid free-text-only dependency notes.

## Progress And Closure Rules

During execution, comment on:

- progress made
- blockers or decisions needed
- PR link
- final vault paths

Before closing an issue, verify:

- acceptance criteria are complete
- PR is linked and merged (or closure rationale is explicit)
- final vault paths are posted
- follow-up work is split into linked issues

## Anti-Patterns

- Vague outcomes without user impact.
- Missing acceptance criteria.
- No Gherkin scenarios for behavior changes.
- Oversized issue covering unrelated outcomes.
- Status drift (`In Progress` without active owner updates).
- Closing tickets without vault links.
