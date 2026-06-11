---
title: "ADR-0045: Issue-first + Git-Worktree Agent Workflow"
status: accepted
tags: [adr, architecture, process, workflow]
created: 2026-05-27
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related: [[../../30-Implementation/agent-workflow-pattern]], [[../../30-Implementation/linear-task-tracking]], [[ADR-0044-cicd-and-merge-policy]], [[../../00-Index/Decision-Log]]
---

# ADR-0045: Issue-first + Git-Worktree Agent Workflow

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-05-27

## Context

Multiple AI agents (and, later, multiple humans) work the repo in parallel. They must
not collide on branches/files, and every change must be traceable to a tracked unit of
work. "Pick a Linear beat, not ad-hoc chat work" is already normative
([[../../30-Implementation/agent-workflow-pattern]]); this ADR makes the **issue-first +
isolation** model explicit and decides how hard to enforce it now.

## Options Considered

- **Isolation:** all agents share one working copy · **one `git worktree` per agent
  session** (branch + dir per issue).
- **Issue enforcement:** social/advisory only · advisory now + hard hook later · hard
  blocking hook immediately.

## Decision

1. **One issue ↔ one worktree ↔ one branch per agent session.** An agent picks exactly
   one Linear issue, then works in its own `git worktree`:
   - branch `‹tool›/fmx-‹n›-‹slug›` (`claude|codex|cursor/…`; humans `feat/fmx-‹n›-‹slug›`),
   - directory `../fmx-‹n›-‹tool›-‹slug›` (sibling of the repo).
   - Worktrees share the repo object store; **never** `cp -r` a checkout and **never**
     nest worktrees. Cleanup is automatic on merge (`delete-branch-on-merge`) plus
     periodic `git worktree prune`.
2. **No work without an issue.** Every branch/PR carries its `fmx-‹n›` /
   `FMX-‹n›` id; `.github/workflows/linear-link-check.yml` already fails a PR that
   lacks it. 1 PR ↔ 1 issue, `Closes FMX-‹n›` (see [[ADR-0044-cicd-and-merge-policy]]).
3. **Override = maximum Nico override.** Working without a linked issue is allowed
   **only on Nico's explicit command** for that instance. A **hard-enforcement hook**
   (blocks agent work that has no associated issue) is specified but stays **OFF**
   until Nico arms it; until then enforcement is advisory + the PR-level
   `linear-link-check`.

## Rationale

Worktrees are the standard way to run parallel agents without branch collisions (a
branch can live in only one worktree), at near-zero cost (shared object store).
Issue-first guarantees traceability (Issue ⇄ Branch ⇄ PR ⇄ Done) and feeds the
auto-merge/auto-close flow. Staging the enforcement (advisory now, hard later) matches
the research/no-dev phase and Nico's "arm it on my command" preference.

## Consequences

Positive:

- Collision-free parallel agents; clean per-issue traceability; supports auto-merge/close.

Negative:

- A worktree lifecycle (create/cleanup, registry) must be maintained; a helper script is
  deferred until the hook is armed.
- Advisory-only today means discipline still relies partly on the agents + PR gate.

## Supersedes

None.

## Related Docs

- [[../../30-Implementation/agent-workflow-pattern]] · [[../../30-Implementation/linear-task-tracking]]
- [[ADR-0044-cicd-and-merge-policy]] · [[ADR-0046-team-topology-and-scaling]]
