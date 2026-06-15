---
title: FMX-167 Architecture Fitness Function Decision Queue
status: current
tags: [execution, decision-queue, architecture-fitness, ddd, bounded-context, ci, quality, fmx-167]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: true
linear: FMX-167
related:
  - [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-import-boundaries-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-db-boundaries-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-architecture-fitness-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  - [[../40-Quality/architecture-fitness-function]]
---

# FMX-167 Architecture Fitness Function Decision Queue

This is the HITL decision record for FMX-167. Nico accepted the recommended
packet on 2026-06-15 before implementation.

## D1 - enforcement stack

| Option | Meaning | Assessment |
|---|---|---|
| **A. Depcruise + scanners** | Use `dependency-cruiser` for import/path/cycle rules and custom TypeScript/SQL scanners for Drizzle schema, relation, query and migration checks. | **Recommended.** Covers both import and storage invariants without reintroducing ESLint or relying on Nx Enterprise Conformance. |
| B. Nx Conformance primary | Use Nx project metadata and Conformance as the main policy engine. | Useful later, but official docs describe Conformance as Enterprise and it still would not cover all Drizzle/SQL storage rules by itself. |
| C. ESLint module boundaries | Use ESLint boundary rules as the main enforcement layer. | Rejected for this beat because FMX standardises on Biome and forbids reintroducing ESLint without a separate decision. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D2 - failure policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Core hard fail** | After code-phase scripts/workflows exist and burn in, direct cross-context imports, cross-context table joins, cross-context FKs, shared ownerless tables and unapproved exceptions fail `quality`. | **Recommended.** The invariant is structural and already accepted; report-only would let coupling enter early. |
| B. Staged rollout | Report-only first, then fail later after several code beats. | Safe for migration-heavy legacy systems, but FMX is greenfield after the docs reset. |
| C. Import-only first | Hard-fail import rules now and defer DB/query checks. | Too weak for FMX-167 because storage coupling is the core issue. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D3 - artifact status

| Option | Meaning | Assessment |
|---|---|---|
| **A. Accepted ADR** | Publish a binding accepted ADR and a current quality runbook now; no code scripts/dependencies are added in docs-only phase. | **Recommended.** Nico has accepted the enforcement choices and future code work needs a binding target. |
| B. Proposed ADR | Keep ADR as non-binding until code bootstrap. | Safe but leaves future bootstrap without a ratified invariant. |
| C. Research only | Save research and defer ADR/runbook. | Too weak; the issue explicitly asks to define and anchor the fitness function. |

**Decision:** Accepted A (Nico, 2026-06-15).

## Decision Record

- 2026-06-15: Live triage checked Git, worktrees, open PRs and Linear.
- 2026-06-15: `/root/research-gp` `main` fast-forwarded to `origin/main`.
- 2026-06-15: FMX-167 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-167-architecture-fitness-function`.
- 2026-06-15: Perplexity-first discovery captured for import boundaries,
  database boundaries and real-world/game precedents.
- 2026-06-15: Official/current source checks captured for dependency-cruiser,
  Nx, Drizzle, ts-morph, pgsql-ast-parser and TypeScript.
- 2026-06-15: Nico accepted D1=A, D2=A, D3=A.

## Approved Packet

Accepted selection: **D1=A, D2=A, D3=A**.

No open Nico decision remains for FMX-167. Future code bootstrap must still
re-check dependency versions and official docs before adding packages, scripts
or CI workflows.

## Related

- [[../60-Research/architecture-fitness-function-no-shared-tables-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
- [[../40-Quality/architecture-fitness-function]]

