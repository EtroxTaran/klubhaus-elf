---
title: Implementation Backlog Seed
status: draft
tags: [meta, backlog]
updated: 2026-05-15
---

# Implementation Backlog Seed

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
