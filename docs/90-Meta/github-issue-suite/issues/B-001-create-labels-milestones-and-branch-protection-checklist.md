<!--
id: B-001
title: [meta] Create labels, milestones, and branch protection checklist
labels: type:chore, area:infra, prio:critical, size:s, parallel:safe
milestone: M1 Research & Architecture
depends_on: none
output: docs/90-Meta/github-issue-suite/labels.md
-->

# [meta] Create labels, milestones, and branch protection checklist

**ID:** B-001  
**Labels:** `type:chore`, `area:infra`, `prio:critical`, `size:s`, `parallel:safe`  
**Milestone:** M1 Research & Architecture  
**Depends on:** none  
**Primary output:** `docs/90-Meta/github-issue-suite/labels.md`

## Goal

Create or verify GitHub labels and milestones needed for agent orchestration.

## Output / touched area

`docs/90-Meta/github-issue-suite/labels.md`

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
- Parallel label: `parallel:safe`.
