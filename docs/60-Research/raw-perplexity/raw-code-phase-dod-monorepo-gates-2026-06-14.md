---
title: "Raw - code-phase DoD and monorepo gates (FMX-180)"
status: raw
tags: [research, raw, perplexity, dod, monorepo, nx, pnpm, typescript, fmx-180]
created: 2026-06-14
updated: 2026-06-14
type: research
binding: false
linear: FMX-180
related:
  - [[../code-phase-dod-transition-contract-2026-06-14]]
  - [[../../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]
  - [[../../30-Implementation/code-phase-dod-transition-contract]]
---

# Raw - code-phase DoD and monorepo gates (FMX-180)

## Research prompt

Perplexity was asked for best practices on a phase-aware executable Definition
of Done for a greenfield/docs-first monorepo moving into code phase. The prompt
asked what should be active in docs-only phase, what should be target-only until
bootstrapped, how to avoid non-existent commands in a DoD, and how to compare
root scripts, pnpm recursive scripts, Nx and Turborepo.

## Source-quality note

The agile/Definition-of-Done sources are broad process guidance, not FMX-specific
technical policy. Official tool docs and registry checks were used for library
and tooling facts. Tool-version facts are temporal and must be re-verified at
the bootstrap beat.

## Extracted findings

- The DoD should be specific, measurable and objectively verifiable. For FMX,
  this means the active DoD names commands/checks that already exist.
- A docs-only phase should focus on durable documents, decision records,
  acceptance criteria, traceability and docs validation rather than pretending
  app tests exist.
- Non-executable activities should stay visible as future/impediment items with
  owners and activation conditions, not inside the current active DoD.
- A phase-aware DoD should have columns or sections for current phase, target
  phase, command/check and activation precondition.
- Root scripts should remain the public command surface for humans and CI.
- `pnpm -r` / `--if-present` can help during simple workspaces, but a large FMX
  monorepo benefits from task graph, affected execution and caching.
- Nx and Turborepo both fit a monorepo DoD; Nx gives project graph, task graph,
  affected commands and cache semantics that map well to FMX's many bounded
  contexts.
- TypeScript project references require `composite: true` and a solution-style
  config can orchestrate package boundaries; this belongs in the code bootstrap,
  not in FMX-180.
- On 2026-06-14 the npm registry reported `nx@22.7.5` and `pnpm@11.6.0`.
  FMX-180 does not pin either; the bootstrap/currency beat must re-check.

## Source trail

- Perplexity citations:
  - Atlassian Definition of Done:
    <https://www.atlassian.com/agile/project-management/definition-of-done>
  - Zaidan Consulting Definition of Done:
    <https://zaidanconsulting.com/2024/03/definition-of-done-2/>
  - Scrum Alliance Definition of Ready vs Definition of Done:
    <https://resources.scrumalliance.org/Article/definition-vs-ready>
  - Scrum Academy Definition of Done:
    <https://thescrumacademy.com/2024/06/17/definition-of-done-define-it-or-doom-your-sprints/>
  - MeisterTask DoR/DoD:
    <https://www.meistertask.com/blog/definition-of-ready-and-definition-of-done-in-scrum>
- Official/tool docs checked:
  - pnpm workspace YAML:
    <https://pnpm.io/pnpm-workspace_yaml>
  - pnpm run / recursive / `--if-present`:
    <https://pnpm.io/cli/run>
  - TypeScript project references:
    <https://www.typescriptlang.org/docs/handbook/project-references.html>
  - Nx concepts / mental model:
    <https://nx.dev/docs/concepts/mental-model>
  - Turborepo package and task graph:
    <https://turbo.build/repo/docs/core-concepts/package-and-task-graph>
  - npm registry latest Nx:
    <https://registry.npmjs.org/nx/latest>
  - npm registry latest pnpm:
    <https://registry.npmjs.org/pnpm/latest>

## Related

- [[../code-phase-dod-transition-contract-2026-06-14]]
- [[../../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]]

