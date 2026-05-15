<!--
id: B-002
title: [meta] Create M1-M8 implementation backlog from ADRs
labels: type:chore, area:docs, prio:critical, size:m, parallel:after-adr
milestone: M1 Research & Architecture
depends_on: A-010
output: docs/90-Meta/github-issue-suite/implementation-backlog.md
-->

# [meta] Create M1-M8 implementation backlog from ADRs

**ID:** B-002  
**Labels:** `type:chore`, `area:docs`, `prio:critical`, `size:m`, `parallel:after-adr`  
**Milestone:** M1 Research & Architecture  
**Depends on:** `A-010`  
**Primary output:** `docs/90-Meta/github-issue-suite/implementation-backlog.md`

## Goal

Turn ADRs into detailed implementation issues with acceptance criteria and test strategy.

## Output / touched area

`docs/90-Meta/github-issue-suite/implementation-backlog.md`

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
- Parallel label: `parallel:after-adr`.
