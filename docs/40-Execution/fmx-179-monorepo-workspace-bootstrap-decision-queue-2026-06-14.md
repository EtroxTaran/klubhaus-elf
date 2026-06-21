---
title: FMX-179 monorepo workspace bootstrap decision queue
status: accepted
tags: [execution, decision-queue, monorepo, workspace, nx, pnpm, ddd, fmx-179, accepted]
created: 2026-06-14
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-179
related:
  - [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
  - [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../30-Implementation/monorepo-workspace-bootstrap-plan]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
---

# FMX-179 monorepo workspace bootstrap decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-179.


This queue records Nico's accepted FMX-179 decisions for
[[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap|ADR-0114]]
and any follow-up PR that creates workspace files.

## D1 - bounded-context package granularity

| Option | Meaning | Assessment |
|---|---|---|
| **A. Progressive one-context package catalog** | Every context gets a future `@klubhaus-elf/<slug>` package name, but package roots appear only with real code. | **Recommended.** Keeps ADR-0019 service-readiness without 28 empty package roots. |
| B. Six physical cluster packages | Code packages map to ADR-0089 clusters. | Lower setup overhead but turns cognitive clusters into real coupling boundaries. |
| C. All 28 context packages in scaffold | Package-level isolation from day one. | Too much empty scaffolding and fake green risk. |

**Recommendation:** A.

## D2 - first scaffold package set

| Option | Meaning | Assessment |
|---|---|---|
| **A. Real foundation packages only** | Create `apps/web`, `packages/ui`, `packages/db`, `packages/db-schema`, `packages/game-data` and `packages/match-contract` only if each has real source/targets. | **Recommended.** Matches existing module notes and prevents placeholders. |
| B. App + UI only | Start smaller. | Less risk but defers core schema/data/contract foundations referenced by early slices. |
| C. Include `packages/match-engine` and all context roots now | Everything exists immediately. | Too broad and likely empty. |

**Recommendation:** A.

## D3 - ADR-0019 implementation path

| Option | Meaning | Assessment |
|---|---|---|
| **A. Workspace package facade** | Replace `src/domain/<context>` with `packages/<context-slug>/src/index.ts` public facades for context packages. | **Recommended.** Makes physical package boundaries match service-ready boundaries. |
| B. Keep `src/domain/<context>` inside `apps/web` | Preserve old wording. | Recreates extraction debt. |
| C. Hybrid with no promotion rule | Both patterns allowed. | Ambiguous and drift-prone. |

**Recommendation:** A.

## D4 - workspace/tooling linking model

| Option | Meaning | Assessment |
|---|---|---|
| **A. pnpm workspace linking + TS references + Nx TypeScript plugin** | Use `workspace:*`, solution/project references and `@nx/js/typescript` inferred targets/sync. | **Recommended.** Current docs-backed path. |
| B. Root `paths` alias primary | Use TypeScript paths as the main linking strategy. | Older and weaker at runtime/package parity. |
| C. pnpm-only runner | Skip Nx. | Reopens ADR-0110. |

**Recommendation:** A.

## D5 - gates and coverage

| Option | Meaning | Assessment |
|---|---|---|
| **A. Real-target-only checks** | Code scripts/checks run only real targets; coverage thresholds activate only for meaningful packages. | **Recommended.** Avoids placeholder green. |
| B. Activate all planned code checks immediately | Vitest/Playwright/Storybook/coverage all required at scaffold. | Fails or lies before target surfaces exist. |
| C. Keep code checks inactive after scaffold | Avoids false gates but leaves code unverified. | Too weak once packages contain source. |

**Recommendation:** A.

## D6 - package namespace

| Option | Meaning | Assessment |
|---|---|---|
| **A. `@klubhaus-elf/*`** | Use the namespace in module notes and current implementation docs. | **Recommended.** Aligns with repo name and recent docs. |
| B. `@soccer-manager/*` | Preserve older AGENTS examples. | Conflicts with current module docs. |
| C. Unscoped package names | No package scope. | More collision-prone. |

**Recommendation:** A.

## D7 - ownership and CODEOWNERS

| Option | Meaning | Assessment |
|---|---|---|
| **A. Module owner metadata now, domain CODEOWNERS later** | Every package gets a module note/owner; CODEOWNERS stays root-owner until ADR-0046 trigger. | **Recommended.** Traceable and realistic for current team topology. |
| B. Per-package CODEOWNERS now | Code review routing starts immediately. | Too heavy before domain leads exist. |
| C. No package owner metadata | Leave ownership implicit. | Weak. |

**Recommendation:** A.

## D8 - versions and pinning

| Option | Meaning | Assessment |
|---|---|---|
| **A. Re-check and exact-pin in scaffold PR** | Treat 2026-06-14 versions as evidence, not final pins. | **Recommended.** Matches tooling-currency policy. |
| B. Pin today's observed versions now | Lock `nx@22.7.5`, `typescript@6.0.3`, etc. from this docs packet. | Could be stale by scaffold time. |
| C. Floating ranges/latest | Avoids update churn. | Violates ADR-0021. |

**Recommendation:** A.

## Decision record

- 2026-06-14: Nico selected FMX-179 from the live shortlist and selected the
  Split Doc First scope.
- 2026-06-14: FMX-179 moved from `Backlog` to `In Progress`.
- 2026-06-14: branch/worktree created:
  `codex/fmx-179-monorepo-workspace-bootstrap`.
- 2026-06-14: `main` fast-forwarded before work; ADR-0113 already existed on
  main, so this beat uses ADR-0114.
- 2026-06-14: Perplexity-first research, Context7/Ref source checks and npm
  registry checks saved.
- 2026-06-14: synthesis, accepted ADR-0114 and scaffold plan prepared as
  non-binding proposal records.
- Accepted by Nico 2026-06-19: D1-D8 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A, D8=A**.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A, D8=A**.

No open Nico decision remains for FMX-179.

## Related

- [[../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
- [[../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
