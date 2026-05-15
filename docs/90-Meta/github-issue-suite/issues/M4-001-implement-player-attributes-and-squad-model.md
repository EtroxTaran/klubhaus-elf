<!--
id: M4-001
title: [area:squad] Implement player attributes and squad model
labels: type:feature, area:squad, prio:high, size:l, parallel:after-data-model
milestone: M4
depends_on: A-010
output: packages/db-schema/**, packages/game-data/**, apps/web/**
-->

# [area:squad] Implement player attributes and squad model

**ID:** M4-001  
**Labels:** `type:feature`, `area:squad`, `prio:high`, `size:l`, `parallel:after-data-model`  
**Milestone:** M4  
**Depends on:** `A-010`  
**Primary output:** `packages/db-schema/**, packages/game-data/**, apps/web/**`

## Goal

Player attribute schema, roster generation, positions, fitness/form/morale placeholders.

## Output / touched area

`packages/db-schema/**, packages/game-data/**, apps/web/**`

## Acceptance criteria

- [ ] Create a Plan Mode document in `.cursor/plans/` before implementation.
- [ ] Confirm independence checks before dispatching parallel agents.
- [ ] Add/update Vault docs in the same PR.
- [ ] Follow TDD: failing test first for implementation work.
- [ ] Keep code, schema, and generated data IP-clean.
- [ ] CI green: Biome, typecheck, Vitest, Playwright, Lighthouse where relevant.

## Agent prompt

Use this issue as an epic seed after Phase 2 is complete. First write a detailed plan in `.cursor/plans/`, identify serial contracts vs. parallel-safe tasks, then split into smaller beat issues if needed. Do not start implementation until ADR dependencies are stable.

## Independence check

- File exclusivity: must be re-evaluated during planning.
- Interface stability: likely touches contracts; serialize schema/interface work first.
- Config exclusivity: avoid package/config changes unless explicitly planned.
- Parallel label: `parallel:after-data-model`.
