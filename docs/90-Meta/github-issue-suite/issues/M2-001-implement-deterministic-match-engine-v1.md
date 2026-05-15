<!--
id: M2-001
title: [area:match-engine] Implement deterministic match engine v1
labels: type:feature, area:match-engine, prio:critical, size:l, parallel:serial-only
milestone: M2
depends_on: A-010
output: packages/match-engine/**
-->

# [area:match-engine] Implement deterministic match engine v1

**ID:** M2-001  
**Labels:** `type:feature`, `area:match-engine`, `prio:critical`, `size:l`, `parallel:serial-only`  
**Milestone:** M2  
**Depends on:** `A-010`  
**Primary output:** `packages/match-engine/**`

## Goal

Seedable RNG, event model, minute-by-minute simulation, 100% branch coverage.

## Output / touched area

`packages/match-engine/**`

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
- Parallel label: `parallel:serial-only`.
