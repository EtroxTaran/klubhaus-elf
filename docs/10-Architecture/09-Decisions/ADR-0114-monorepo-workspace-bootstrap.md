---
title: ADR-0114 Monorepo Workspace Bootstrap
status: draft
tags: [adr, architecture, monorepo, workspace, nx, pnpm, typescript, ddd, code-phase, fmx-179, draft]
created: 2026-06-14
updated: 2026-06-14
type: adr
binding: false
amends:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0110-code-phase-dod-transition-contract]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-monorepo-workspace-ddd-package-granularity-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-monorepo-workspace-game-production-precedents-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-monorepo-workspace-tooling-bootstrap-2026-06-14]]
  - [[../../60-Research/raw-perplexity/raw-monorepo-workspace-source-checks-2026-06-14]]
  - [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
  - [[../bounded-context-map]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
---

# ADR-0114: Monorepo Workspace Bootstrap

## Status

draft

> **Proposal only (FMX-179).** This ADR records the recommended bootstrap shape
> after research. It does not create a workspace, install dependencies, activate
> code-phase checks, or amend accepted ADRs until Nico approves D1-D8 in
> [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]].

## Date

- Drafted: 2026-06-14 (FMX-179)
- Binding status: pending Nico

## Context

ADR-0110 accepted the executable phase split: docs-phase checks are active now,
and code-phase gates become active only after a bootstrap/foundation PR creates
the workspace, Nx config, root scripts, real app/package paths and CI wiring.

FMX-179 answers the next question: what should that first workspace look like?
The answer must reconcile:

- ADR-0019's old implementation convention of `src/domain/<context>/`, written
  before the docs-only reset;
- ADR-0089's ratified 28 bounded contexts and six clusters;
- the target package/module notes for `apps/web`, `packages/ui`,
  `packages/db`, `packages/db-schema`, `packages/game-data` and match contracts;
- the no-placeholder gate from ADR-0110;
- FMX tooling-currency rules requiring current docs and exact version checks
  before adding dependencies.

This ADR is intentionally non-binding because package granularity, package
namespace, public import contracts and CI activation are architecture/process
decisions.

## Options considered

### D1 - physical package granularity

| Option | Meaning | Assessment |
|---|---|---|
| **A. Progressive one-context package catalog** | Every bounded context gets a stable future package slug, but the physical package exists only once real code exists. | **Recommended.** Preserves service-ready DDD boundaries without 28 empty packages. |
| B. Six cluster packages | Physical code packages map to ADR-0089 clusters. | Lower overhead, but clusters become de facto code boundaries and weaken no-cross-context enforcement. |
| C. All 28 context packages day one | Create every context package in the bootstrap. | Strong isolation but mostly empty package noise at this phase. |

### D2 - initial scaffold package set

| Option | Meaning | Assessment |
|---|---|---|
| **A. Real foundation packages only** | Start with `apps/web`, `packages/ui`, `packages/db`, `packages/db-schema`, `packages/game-data` and `packages/match-contract` only if each has real source/targets. | **Recommended.** Aligns with existing module notes and avoids empty gates. |
| B. App + UI only | Keep the scaffold minimal. | Simpler, but defers data/schema/contract roots that many first slices already reference. |
| C. Include all planned technical and engine packages | Also add `packages/match-engine` and future context roots. | Too broad; risks placeholder roots. |

### D3 - ADR-0019 path reconciliation

| Option | Meaning | Assessment |
|---|---|---|
| **A. Workspace package public facade** | Replace `src/domain/<context>` with `packages/<context-slug>/src/index.ts` for context packages; apps host/adapt, packages own contracts. | **Recommended.** Makes the package boundary the service-ready boundary. |
| B. Keep app-local `src/domain/<context>` | All context code starts inside `apps/web`. | Recreates the pre-reset layout and makes later extraction harder. |
| C. Hybrid without a promotion rule | Some app-local, some package-local. | Ambiguous; creates drift. |

### D4 - TypeScript/Nx linking model

| Option | Meaning | Assessment |
|---|---|---|
| **A. pnpm workspace linking + TypeScript project references + Nx plugin** | Use `workspace:*`, solution/project references and `@nx/js/typescript` inferred targets/sync. | **Recommended.** Matches current Nx/pnpm/TypeScript docs. |
| B. Root TypeScript path aliases as primary links | Use `compilerOptions.paths` as the main monorepo linker. | Older/looser; easier to diverge from runtime package resolution. |
| C. pnpm-only orchestration | No Nx in bootstrap. | Reopens ADR-0110. |

### D5 - test, coverage, e2e and Storybook activation

| Option | Meaning | Assessment |
|---|---|---|
| **A. Real-target-only activation** | Add scripts/checks only when they execute real targets; coverage thresholds activate per meaningful package. | **Recommended.** Prevents placeholder green checks. |
| B. Activate the full target suite immediately | Add Vitest, Playwright, Storybook and coverage gates even if empty. | Fails or lies by construction. |
| C. Keep all code checks inactive after scaffold | Avoids false greens but leaves the scaffold without verification. | Too weak once real code exists. |

### D6 - package namespace

| Option | Meaning | Assessment |
|---|---|---|
| **A. `@klubhaus-elf/*`** | Standardize code packages on the namespace already used by module notes and current implementation docs. | **Recommended.** Matches root package name and most current vault docs. |
| B. `@soccer-manager/*` | Preserve older AGENTS examples. | Conflicts with current module notes and app branding. |
| C. Unscoped packages | Use plain package names. | More collision-prone and less clear. |

### D7 - ownership and CODEOWNERS

| Option | Meaning | Assessment |
|---|---|---|
| **A. Module owner metadata now; CODEOWNERS by domain later** | Each package has a module note/owner, but CODEOWNERS stays root-owner until ADR-0046's team-scaling trigger. | **Recommended.** Traceable without pretending domain leads exist. |
| B. Activate package CODEOWNERS immediately | Per-package review routing from the first scaffold. | Too heavy for current team topology. |
| C. No owner metadata | Leave packages unlabeled. | Weakens future maintainability. |

### D8 - version and pinning policy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Re-check and exact-pin in the scaffold PR** | Use current docs and registry checks at implementation time; do not pin from this draft. | **Recommended.** Matches dependency-currency policy. |
| B. Pin the versions observed in this docs PR | Treat 2026-06-14 registry values as fixed. | Could already be stale when scaffold starts. |
| C. Use floating ranges/latest | Avoids pin churn. | Violates ADR-0021/tooling-currency policy. |

## Proposed decision

Pending Nico approval:

- **D1 = A:** adopt a progressive one-context package catalog.
- **D2 = A:** first scaffold creates only real foundation packages/apps with
  source, targets and module notes.
- **D3 = A:** amend ADR-0019's implementation convention from
  `src/domain/<context>` to workspace package public facades.
- **D4 = A:** use pnpm workspace linking, TypeScript project references and
  Nx `@nx/js/typescript`.
- **D5 = A:** activate only real code/test/e2e/storybook/coverage gates.
- **D6 = A:** use `@klubhaus-elf/*` package names.
- **D7 = A:** keep CODEOWNERS root-owner for now, but require module/owner
  metadata per created package.
- **D8 = A:** re-check and exact-pin versions during the scaffold PR; keep
  FMX-195 as pnpm currency owner.

## Proposed package rules

If accepted, future code follows these rules:

- Workspace globs: `apps/*` and `packages/*`.
- Each package/app has a `package.json`, a module note under
  `docs/10-Architecture/modules/`, explicit Nx tags and TypeScript references
  when it compiles TypeScript.
- Public imports go through the package root or documented subpath exports.
  Deep imports into another package's `src/**` are forbidden.
- Bounded-context packages expose only commands, queries, events, schemas and
  read-model contracts from `src/index.ts`; entities, policies, repositories
  and adapters are internal.
- Technical packages (`ui`, `db`, `db-schema`, `game-data`, `match-contract`)
  do not own football-domain policy outside their accepted module contracts.
- Root scripts are thin Nx wrappers. GitHub CI invokes those scripts rather
  than duplicating logic.
- No package may be created solely to satisfy a future path reference. If a
  planned package has no real source/target, keep it in the scaffold plan.

## Proposed bounded-context map patch (not applied)

After Nico approves this ADR, add a section near the top of
[[../bounded-context-map]]:

```md
## Workspace package rule

ADR-0114 maps every bounded context to a future `@klubhaus-elf/<context-slug>`
workspace package. The package root is created only when real code for that
context exists; empty context packages are forbidden. ADR-0089 clusters remain
cognitive/navigation aids and are not physical code package boundaries.
```

Then add a `Future package` column or appendix using the catalog in
[[../../60-Research/monorepo-workspace-bootstrap-2026-06-14]].

This patch is deliberately not applied in FMX-179 because ADR-0114 is still
draft/non-binding.

## Consequences

Positive:

- The workspace scaffold can be small without weakening the service-ready
  target.
- Package roots correspond to real code and real checks.
- Existing `@klubhaus-elf/*` module docs become the likely package namespace,
  pending approval.
- Bounded-context extraction remains a package/deployment move rather than a
  late directory rescue.

Costs and constraints:

- The first feature slices must create their context package instead of hiding
  domain logic permanently inside `apps/web`.
- The scaffold PR must be careful: any package without real targets should be
  deferred, not stubbed.
- AGENTS and any stale `@soccer-manager/*` orchestrator examples need cleanup
  in the accepted scaffold PR if D6=A is approved.
- Playwright per-project `webServer` cannot be used from current mainline docs
  unless the installed Playwright version supports it; registry latest observed
  during this beat was `1.60.0` while the docs page marks that API since v1.61.

## Related docs

- [[../../60-Research/monorepo-workspace-bootstrap-2026-06-14]]
- [[../../30-Implementation/monorepo-workspace-bootstrap-plan]]
- [[../../30-Implementation/code-phase-dod-transition-contract]]
- [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
- [[ADR-0019-modular-monolith-ddd]]
- [[ADR-0089-bounded-context-portfolio-reconciliation]]
- [[ADR-0110-code-phase-dod-transition-contract]]
