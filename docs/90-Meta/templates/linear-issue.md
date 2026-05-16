---
title: Linear Issue Template
status: current
tags: [meta, templates, linear]
created: 2026-05-17
updated: 2026-05-17
type: template
binding: true
related:
  - [[../../30-Implementation/linear-task-tracking]]
---

# Linear Issue Template

Use this template for implementation, research, and architecture issues in Linear.

## Metadata Checklist

- [ ] Team set
- [ ] Owner set
- [ ] Priority set (Linear priority + `priority:*` label)
- [ ] Type label set (`type:*`)
- [ ] Area label set (`area:*`)
- [ ] State is `Backlog`, `Triage`, or `Planned/Ready`
- [ ] Cycle or Project set (when applicable)
- [ ] Dependencies linked (`blocked by`, `blocks`, `related`, or parent/sub-issues)

## Title

`<area>: <outcome-oriented action>`

Examples:

- `match-engine: stabilize deterministic replay checksum validation`
- `transfer: add counter-offer timeout fallback flow`

## Context

- Why this matters now:
- Who is impacted:
- Constraints, risks, or assumptions:
- Links (design, ADR, research, prior issues):

## User Story

As a `<role>`, I want `<capability>`, so that `<outcome>`.

## Gherkin Scenarios

```gherkin
Scenario: Happy path
  Given ...
  When ...
  Then ...
```

```gherkin
Scenario: Edge or failure path
  Given ...
  When ...
  Then ...
```

## Acceptance Criteria

- [ ] AC1:
- [ ] AC2:
- [ ] AC3:

## Out of Scope

- Not included:

## Dependencies

- Blocked by:
- Blocks:
- Related:

## Documentation Links

- Vault source notes:
- ADRs:
- Feature or game design notes:
- Implementation notes:

## Verification / Test Notes

- Automated checks:
- Manual validation:
- Rollout or observability notes:

## Closure Checklist

- [ ] PR linked
- [ ] Acceptance criteria all checked
- [ ] Final vault paths commented on issue
- [ ] Follow-up tasks split into linked issues
