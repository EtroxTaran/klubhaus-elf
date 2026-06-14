---
title: "FMX-180 Code-Phase DoD Transition Decision Queue"
status: current
tags: [execution, decision-queue, dod, ci, monorepo, nx, fmx-180]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-180
related:
  - [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]
---

# FMX-180 Code-Phase DoD Transition Decision Queue

This records the live HITL decisions Nico made for FMX-180 on 2026-06-14.
ADR-0110 is the binding promotion of these outcomes.

## D1 - Definition-of-Done mode

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| A | Single DoD now: require code checks immediately. | No | Rejected |
| **B** | Phase split: docs-phase DoD active now; code-phase DoD target-only until transition checklist passes. | **Yes** | **Accepted** |
| C | Remove/defer code DoD entirely until app bootstrap. | No | Rejected |

Outcome: active docs-phase gates must use only existing scripts and checks.
Code-phase gates remain target-only and visible.

## D2 - Code-phase runner baseline

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| A | pnpm-only root scripts and `pnpm -r` as long-term orchestrator. | No | Rejected |
| **B** | Nx day one; root pnpm scripts wrap Nx targets. | **Yes** | **Accepted** |
| C | Turborepo day one. | Viable, not recommended after FMX constraints | Rejected |

Outcome: the first code bootstrap/foundation PR must introduce Nx if the code
phase starts. FMX-180 does not install it.

## D3 - `apps/web` / `packages/*` path gate

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| A | Remove target app/package paths from docs until code exists. | No | Rejected |
| **B** | Keep paths as intended build target, but mark inactive until bootstrap creates them. | **Yes** | **Accepted** |
| C | Scaffold placeholder paths in FMX-180. | No | Rejected |

Outcome: design-system and workflow docs keep the target paths but no docs-phase
PR can treat them as required existing files.

## D4 - pnpm currency mismatch

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| A | Update pnpm pin in FMX-180. | No | Rejected |
| **B** | Create/route a separate Backlog issue. | **Yes** | **Accepted** |
| C | Leave stale pin untracked. | No | Rejected |

Outcome: FMX-195 was created in Backlog to handle the `pnpm@11.1.2` ->
current-stable update after a fresh version/release-note check.

## No remaining open FMX-180 decisions

FMX-180 is a docs/process contract. App bootstrap, code-CI implementation,
lefthook restoration and pnpm currency updates stay in their own issues:
FMX-179, FMX-175, FMX-176 and FMX-195.

## Related

- [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[../60-Research/code-phase-dod-transition-contract-2026-06-14]]

