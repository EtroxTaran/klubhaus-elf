<!--
id: M6-001
title: [area:transfer] Implement transfer market offer loop skeleton
labels: type:feature, area:transfer, prio:medium, size:l, parallel:after-schema-contract
milestone: M6
depends_on: A-010
output: packages/db-schema/**, apps/web/**
-->

# [area:transfer] Implement transfer market offer loop skeleton

**ID:** M6-001  
**Labels:** `type:feature`, `area:transfer`, `prio:medium`, `size:l`, `parallel:after-schema-contract`  
**Milestone:** M6  
**Depends on:** `A-010`  
**Primary output:** `packages/db-schema/**, apps/web/**`

## Goal

Search/filter, outgoing offers, incoming offers, negotiation state machine.

## Output / touched area

`packages/db-schema/**, apps/web/**`

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
- Parallel label: `parallel:after-schema-contract`.
