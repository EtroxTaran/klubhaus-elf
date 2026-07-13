---
title: klubhaus-elf Completion Gates
type: completion-gates
project: klubhaus-elf
context: quality
status: active
owner: Nico
updated: 2026-07-13
sensitivity: internal
---

# Completion Gates

- `npm run ci:team-governance` passes.
- `npm run ci:runner-policy` passes before a self-hosted workflow change.
- `npm run docs:check` and `npm run docs:status-check` pass.
- The central project-knowledge validator accepts the Project Wall.
- Every PR links a local issue with Gherkin acceptance criteria.
- Product, gameplay, or architecture decisions obey the current draft/approved
  status and the collaboration protocol.
- Code-bearing changes include a cross-family pair review.
