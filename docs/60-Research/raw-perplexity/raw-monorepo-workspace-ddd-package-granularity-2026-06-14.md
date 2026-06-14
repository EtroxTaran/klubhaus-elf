---
title: Raw monorepo workspace DDD package granularity
status: raw
tags: [research, raw, perplexity, monorepo, workspace, ddd, package-boundaries, nx, fmx-179]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
related:
  - [[../monorepo-workspace-bootstrap-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
  - [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
---

# Raw monorepo workspace DDD package granularity

## Prompt

Research current best practices for a TypeScript service-ready modular monolith
using DDD bounded contexts in a pnpm/Nx monorepo. Compare package granularity
options: one package per bounded context, cluster packages, technical-layer
packages, and hybrid/progressive vertical-slice packages. Evaluate service
extraction readiness, cognitive load, TypeScript project references, workspace
linking and boundary enforcement.

## Perplexity capture

Perplexity recommended a hybrid/progressive approach for a project with many
bounded contexts: keep the business/domain boundary explicit, start with fewer
physical packages where the code actually exists, and split mature contexts into
their own workspace packages when extraction pressure or boundary clarity
justifies it.

Key points preserved from the answer:

- A modular monolith should align modules with bounded contexts and business
  use cases, not only technical layers.
- Nx libraries/packages can model module boundaries while the deployable remains
  one app.
- Nx dependency constraints, TypeScript project references and package-manager
  workspaces are the practical enforcement/build graph tools.
- Pure technical-layer packages are easiest at first but hide bounded-context
  ownership and make service extraction harder.
- One package per bounded context gives the strongest extraction posture, but
  creating 28 empty packages before code exists creates manifest, tsconfig and
  ownership overhead without useful signal.
- Cluster packages reduce setup overhead, but if used as the physical code
  boundary they weaken "no cross-context import" enforcement inside a cluster.
- A progressive approach keeps a target package catalog, creates packages only
  when there is real code, and reviews hot contexts for promotion.

## Option tradeoff

| Option | Strength | Weakness | Fit for FMX |
|---|---|---|---|
| One physical package per bounded context day one | Strongest package-level isolation and extraction posture. | High overhead for 28 contexts; easy to create empty green packages. | Too much for the first scaffold. |
| Six cluster packages | Lower initial overhead; maps to ADR-0089 cluster language. | Clusters become real code boundaries and can hide illegal context coupling. | Useful as documentation/navigation, weak as package contract. |
| Technical-layer packages | Few packages and simple tsconfig graph. | Scatters each bounded context across packages; poor DDD/service-readiness fit. | Reject for domain code. |
| Progressive one-context package catalog | Keeps one future package per context but creates roots only with real code. | Requires discipline not to let app-local code become permanent. | Recommended FMX default. |

## Source URLs returned

- https://github.com/dyarleniber/typescript-ddd-forum/blob/main/README.md
- https://maximilian-torggler.dev/blog/monorepo_moduliths
- https://nx.dev/blog/managing-ts-packages-in-monorepos
- https://angular.love/beyond-clean-code-building-a-scalable-angular-frontend-architecture-with-nx-monorepos
- https://javascript.plainenglish.io/domain-driven-design-for-a-modular-monolith-bridging-the-gap-between-microservices-and-monoliths-2d2521196dd8
- https://www.angulararchitects.io/blog/all-about-ddd-for-frontend-architectures-with-angular-co/

## Handling in synthesis

The raw answer's general recommendation was cluster-first. FMX's existing ADRs
shift the project-specific recommendation: ADR-0019 requires service-ready
bounded-context boundaries and ADR-0089 says clusters are cognitive aids, not
new boundaries. Therefore the synthesis recommends a progressive
one-context-package catalog, not six physical cluster packages.

## Related

- [[../monorepo-workspace-bootstrap-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0114-monorepo-workspace-bootstrap]]
- [[../../40-Execution/fmx-179-monorepo-workspace-bootstrap-decision-queue-2026-06-14]]
