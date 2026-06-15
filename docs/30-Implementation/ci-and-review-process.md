---
title: CI & Review Process
status: draft
tags: [implementation, ci, process, quality]
created: 2026-05-16
updated: 2026-06-15
type: implementation
related: [[../10-Architecture/10-Quality]], [[agent-workflow-pattern]], [[code-phase-dod-transition-contract]], [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]], [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]], [[../10-Architecture/09-Decisions/ADR-0110-code-phase-dod-transition-contract]], [[../00-Index/Current-State]]
---

# CI & Review Process

> **2026-06-14 — FMX-180 phase contract.** ADR-0110 and
> [[code-phase-dod-transition-contract]] are the executable source for the
> docs-phase -> code-phase Definition of Done. Today the repo is docs-vault-only:
> required checks are `docs-check` + `linear-id`, and green docs PRs auto-merge
> without review per ADR-0044. Code-phase checks and CODEOWNER review return only
> after the bootstrap PR creates the workspace, scripts, CI and real app/package
> paths.

**Principle: `main` and `develop` are always green.** A red required check
is an incident, not a backlog item. Overruling a red check is reserved for
an *utmost unusual* situation and is gated by the override policy below.

## Why this exists (root-cause of the chronic-red incident)

CI had been red on `main` across multiple merges. Post-mortem:

1. **Merging red was tolerated.** PR #13 merged with `lighthouse` failing
   (the hydrated Office Hub blew the Total Blocking Time budget — see
   [[../90-Meta/github-issue-suite/issues/D-002-home-route-lighthouse-tbt]]).
   Once `main` is red, every subsequent PR inherits red and "red is normal"
   sets in — the exact failure mode this policy kills.
2. **A structurally broken job went unnoticed.** `cursor-smoke` ran
   `pnpm test:cloud-env` without `pnpm/action-setup@v4` → `pnpm: command
   not found` on every run, green never required so nobody noticed.
3. **Flake tolerated.** The offline e2e raced un-hydrated content and
   intermittently failed; treated as noise instead of fixed at source.
4. **Local ≠ CI.** `lefthook`'s Biome step errored on commits touching only
   Biome-unsupported files (YAML/MD), so docs/CI commits couldn't pass the
   local gate — discouraging the small green-keeping fixes.

All four are fixed; this doc makes the green-by-default state enforceable.

## Definition of done

### Current docs-phase DoD

A docs-phase PR is mergeable only when all active checks are green and the vault
contract is satisfied:

- `node scripts/docs-check.mjs` passes.
- `node scripts/status-consistency-check.mjs` passes when the PR changes
  ADR/GDDR `status:` or `binding:` semantics.
- GitHub required checks are `docs-check` + `linear-id`.
- Research, decisions, process changes and handoff notes are saved in the vault
  when the beat changes durable knowledge.
- The three workflow gates in [[agent-workflow-pattern]] hold: design-system
  compliance for any UI/design work, vault delta in the same PR and
  knowledge-base alignment.

The current docs-phase DoD does **not** require `pnpm check`,
`pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, Storybook, `apps/web` or
`packages/*`; those commands and paths do not exist in the post-reset repo.

### Target code-phase DoD

After [[code-phase-dod-transition-contract]] marks code phase active, code PRs
also require the accepted code scripts and CI checks. Root `pnpm` scripts are
the human/CI entrypoints and wrap Nx targets per ADR-0110. Code-phase checks
must exist and pass before they can be made required.

## Flake policy

- Transient failures are retried in CI (`playwright.config.ts`
  `retries: 2`; Lighthouse asserts the **median of 3** runs). This reduces
  noise; it does **not** lower any threshold or budget.
- A test that flakes is **fixed at its source** (stabilise the wait, remove
  the race) — never deleted, `.skip`-ed, or its assertion weakened to go
  green. Weakening a gate to pass CI is explicitly forbidden
  (`.cursor/rules/99-safety.mdc`).

## Local ↔ CI parity

- Docs-phase local parity is `node scripts/docs-check.mjs` plus
  `node scripts/status-consistency-check.mjs` when status/binding changes.
- Code-phase local parity is target-only until FMX-176 / the bootstrap work
  restores lefthook and the code scripts. Do not describe nonexistent hooks as
  active.
- Use the pinned toolchain in the repo. As of FMX-195, active docs-phase tooling
  pins pnpm 11.7.0; future code bootstrap still re-checks tool versions before
  adding workspace dependencies.

## Override policy (utmost unusual only)

Merging with a red required check is allowed **only** when *all* hold:

1. The failure is **provably not caused by the PR** and is **not fixable
   within it** (e.g. an inherited `main`-wide regression in unrelated code).
2. A tracked issue exists for the real fix with an owner and a target, and
   is linked in the PR.
3. Written justification in the PR description under a **`Risk / rollout`**
   heading, plus the **`override:ci`** label.
4. **Nico signs off** in the PR (architecture/branch-protection trade-offs
   escalate to Nico per `.cursor/rules/99-safety.mdc`).
5. Follow-up to restore green is the **next** prioritised work, not "later".

Routine reds (your bug, flake, broken job, lint) are **never** overridden —
they are fixed.

## Branch protection

Docs-phase branch protection requires docs checks only:

- `docs-check`
- `linear-id`

Code-phase protection is target-only until the bootstrap creates and proves the
scripts/workflows. When activated, required contexts must map to real repo
scripts and ADR-0044's CODEOWNER-review rule for code paths.

## Current state

The repo is docs-vault-only. Code-CI, app e2e, Storybook and lefthook/local
parity are target-only until the code-phase transition checklist is green.
FMX-175 and FMX-176 track deeper code-CI/local-parity cleanup; FMX-179 tracks
workspace bootstrap; FMX-195 refreshed the active pnpm pin to 11.7.0.

## Related

- [[../10-Architecture/10-Quality]] — arc42 quality view this enforces
- [[agent-workflow-pattern]] — review phases · [[code-phase-dod-transition-contract]] — phase gate · [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]] — toolchain
- [[../00-Index/Current-State]] — live status · [[deployment-dokploy]] — gate before deploy
