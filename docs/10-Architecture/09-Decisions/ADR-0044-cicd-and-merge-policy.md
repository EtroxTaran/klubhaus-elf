---
title: "ADR-0044: CI/CD Strategy & Merge Policy"
status: accepted
tags: [adr, architecture, ci, process]
created: 2026-05-27
updated: 2026-06-15
type: adr
binding: false
supersedes:
superseded_by:
related: [[../../30-Implementation/ci-and-review-process]], [[../../30-Implementation/linear-task-tracking]], [[../../30-Implementation/agent-workflow-pattern]], [[ADR-0045-issue-first-worktree-workflow]], [[../../00-Index/Decision-Log]]
---

# ADR-0044: CI/CD Strategy & Merge Policy

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).
> FMX-175 amended the target code-phase required-context package on 2026-06-15:
> after real scripts/workflows and burn-in, code branch protection uses
> `quality`, `e2e` and `security`; D-002-era `cursor-smoke` and `configured`
> names are historical only.

## Date

2026-05-27

## Context

The project is solo today and will grow to multiple leads; most PRs are opened
by AI agents (Claude Code, OpenAI Codex, Cursor). Two needs: (a) CI/CD that is
**clear and portable** — not locked to GitHub Actions, runnable locally so we are
not dependent on one vendor; (b) **auto-merge when green** so there is no manual
Nico-merge bottleneck once CI actually validates a change. The repo is currently
**docs-vault-only** (the only checks are `docs:check` and `linear-link-check`);
code CI (test/lint/type/e2e) returns in the build phase.

## Options Considered

- **CI portability:** self-hosted GitHub Actions runner · `act` (local GH Actions) ·
  Forgejo/Gitea Actions or Woodpecker (self-hosted, GH-independent) · Dagger/Earthly
  (pipeline-as-code, identical local/CI) · **check logic in plain repo scripts** with
  a thin CI trigger.
- **Merge:** manual-only (Nico merges) · auto-merge-when-green (no review) ·
  auto-merge-when-green **with review tiers**.

## Decision

1. **Portable pipeline, thin CI.** All check logic lives in **repo scripts**
   (the `scripts/docs-check.mjs` pattern; later optionally Dagger/Earthly), runnable
   locally (`pnpm …`) and invoked by a **thin** CI workflow that only triggers them.
   The same checks run identically locally, in GitHub Actions today, and in any other
   CI later — no vendor lock-in. A self-hosted runner is added only on concrete need
   (cost/independence); for AI-authored PRs runners must be **ephemeral, secret-free
   on untrusted input, and pin actions to SHAs**.
2. **Auto-merge when green, on strict branch protection.**
   - **Docs / low-risk:** required checks green → **auto-merge, no human review**.
   - **Code → `main`:** required checks green **plus ≥1 CODEOWNER review**.
   - A **merge queue** is enabled once volume/team size warrants it.
   - **`Closes FMX-<n>`** in the PR auto-closes the linked Linear issue on merge;
     **1 PR ↔ 1 issue** (see [[ADR-0045-issue-first-worktree-workflow]]).
3. **Docs-phase activation now:** `docs-check` + `linear-id` required on `main`,
   GitHub auto-merge enabled, **0 reviews** for docs. Code phase later adds the
   script/domain-aligned required contexts `quality`, `e2e` and `security` only
   after the backing repo scripts, workflows and real targets exist and have
   burned in green. CODEOWNER review then applies for code paths. `cursor-smoke`,
   `configured` and standalone `lighthouse` are not required-context names.

## Rationale

Keeping logic in scripts means the pipeline is the same artifact everywhere, so
switching CI vendors (or running locally) never rewrites the pipeline — that is the
durable answer to "not dependent on GitHub Actions". Auto-merge-on-green removes the
human merge bottleneck (the exact pain seen during setup) while strict required
checks keep `main` safe; requiring CODEOWNER review only for **code** balances speed
against the real risk of unreviewed AI-generated code, and scales cleanly to
per-domain owners ([[ADR-0046-team-topology-and-scaling]]).

## Consequences

Positive:

- No vendor lock-in; checks reproducible locally.
- No manual merge bottleneck for green PRs; `main` stays protected.
- Clean path to code-phase (add checks + review) and to multi-lead (CODEOWNER routing).
- No placeholder code-CI contexts: branch protection can require only checks
  that real workflows provide.

Negative:

- Docs auto-merge means an agent's green docs PR lands without human eyes — mitigated
  by `docs:check` + the same-PR vault rules + `linear-id` traceability.
- A bootstrap step is needed before any new required check can be activated:
  the workflow and repo script must exist and pass on real PR evidence before
  branch protection is updated.

## Supersedes

None. Updates the prior "only Nico merges" stance recorded in
[[../../90-Meta/collaboration-and-decision-protocol]] and the intended branch
protection in [[../../30-Implementation/ci-and-review-process]] (reconciled there).

## Related Docs

- [[../../30-Implementation/ci-and-review-process]] · [[../../30-Implementation/linear-task-tracking]] · [[../../30-Implementation/agent-workflow-pattern]]
- [[../../60-Research/code-ci-pipeline-2026-06-15]] · [[../../40-Execution/fmx-175-code-ci-pipeline-decision-queue-2026-06-15]]
- [[ADR-0045-issue-first-worktree-workflow]] · [[ADR-0046-team-topology-and-scaling]]
