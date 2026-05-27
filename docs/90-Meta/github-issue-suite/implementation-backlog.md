---
title: Implementation Backlog Seed
status: archived
tags: [meta, backlog]
created: 2026-05-15
updated: 2026-05-27
type: implementation
binding: false
related:
  - "[[README]]"
  - "[[../../00-Index/Feature-Map]]"
  - "[[../../30-Implementation/ci-and-review-process]]"
  - "[[../../30-Implementation/design-sync-workflow]]"
---

# Implementation Backlog Seed

> Archived pre-reset planning artefact. It is retained as historical context and
> is not current task-tracking authority.

Create detailed implementation beat issues only after Phase 2 ADRs are reviewed. The seed epics in `issues/M*-*.md` define the first milestone-sized containers. Split each epic into smaller red/green/refactor beats before implementation.

## Serial-first contracts

- Match engine event model and RNG contract.
- Data model/schema contracts for clubs, players, competitions, saves.
- Save format and migration contract.
- Generated naming/data constraints from ADR-0007.

## Parallel-safe after contracts

- UI views that consume stable contracts.
- E2E specs that target stable user flows.
- Game-data generators that use approved naming schema.
- Docs/user guides for implemented flows.

## Related

- [[README]]
- [[../../00-Index/Feature-Map]]
- [[../../30-Implementation/ci-and-review-process]]
- [[../../30-Implementation/design-sync-workflow]]
