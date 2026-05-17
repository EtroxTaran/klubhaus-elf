---
title: CI & Review Process
status: draft
tags: [implementation, ci, process, quality]
updated: 2026-05-16
---

# CI & Review Process

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

## Definition of done (every PR)

A PR is mergeable only when **all** required checks are green:
`quality` (Biome + typecheck + Vitest coverage), `e2e`, `lighthouse`,
`cursor-smoke`, `configured`. "Works locally" is not done. The author runs
`pnpm check`, `pnpm typecheck`, `pnpm test`, and (for app changes)
`pnpm test:e2e` before requesting review. In addition, the three workflow
gates in [[agent-workflow-pattern]] must hold: design-system compliance
(no agent-invented style), a vault delta in the same PR, and knowledge-base
alignment (contradictions escalated to Nico, not merged).

## Flake policy

- Transient failures are retried in CI (`playwright.config.ts`
  `retries: 2`; Lighthouse asserts the **median of 3** runs). This reduces
  noise; it does **not** lower any threshold or budget.
- A test that flakes is **fixed at its source** (stabilise the wait, remove
  the race) — never deleted, `.skip`-ed, or its assertion weakened to go
  green. Weakening a gate to pass CI is explicitly forbidden
  (`.cursor/rules/99-safety.mdc`).

## Local ↔ CI parity

- `lefthook` pre-commit mirrors CI (`biome check --write
  --no-errors-on-unmatched`, `typecheck`); pre-existing-debt files are out
  of scope but new code must be clean.
- Use the pinned toolchain: Node 22, **pnpm 11.1.2** via `corepack enable`
  (`.mise.toml` pins both). If a local pnpm mismatch forces
  `COREPACK_ENABLE_STRICT=0` to run hooks, that is a local-env smell — fix
  the toolchain, do not normalise the workaround.

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

## Branch protection (GitHub admin — apply once, Nico)

Enforces "no merging red". Not settable from the repo; apply on
`main` and `develop`:

- Require status checks to pass before merging; required:
  `quality`, `e2e`, `lighthouse`, `cursor-smoke`, `configured`.
- Require branches up to date before merging.
- Require a PR review; dismiss stale approvals on new commits.
- Require conversation resolution.
- **Do not** allow administrators to bypass (the override policy above is
  the only sanctioned bypass, and it is a human decision, not a quiet
  admin-merge).

```sh
gh api -X PUT repos/EtroxTaran/football-manager-x/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f 'required_status_checks[strict]=true' \
  -f 'required_status_checks[contexts][]=quality' \
  -f 'required_status_checks[contexts][]=e2e' \
  -f 'required_status_checks[contexts][]=lighthouse' \
  -f 'required_status_checks[contexts][]=cursor-smoke' \
  -f 'required_status_checks[contexts][]=configured' \
  -f 'enforce_admins=true' \
  -f 'required_pull_request_reviews[required_approving_review_count]=1' \
  -f 'required_pull_request_reviews[dismiss_stale_reviews]=true' \
  -f 'required_conversation_resolution=true' \
  -f 'restrictions=' || true
```

## Current state

`cursor-smoke`, `lefthook`, and the offline-e2e flake are fixed. The single
remaining deterministic red is `lighthouse` (Office Hub TBT), tracked as
**D-002** — the green-blocker for the whole repo. It is being fixed, not
overruled.
