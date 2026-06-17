---
title: Raw branch-naming workflow research
status: raw
tags: [research, raw, perplexity, workflow, branch-naming, linear, github, agents, fmx-174]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-174
related:
  - [[../branch-naming-workflow-reconciliation-2026-06-17]]
  - [[raw-branch-naming-source-checks-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]
  - [[../../40-Execution/fmx-174-branch-naming-decision-record-2026-06-17]]
---

# Raw branch-naming workflow research

## Capture metadata

- **Issue:** FMX-174
- **Date:** 2026-06-17
- **Tool:** Perplexity via `perplexity-ask`
- **Purpose:** Compare strict issue-key branch naming against topic-only and mixed branch forms for a multi-agent, Linear/GitHub, one-issue/one-branch workflow.
- **Decision status when captured:** Research input only. Nico selected the strict issue-key option after this research and source checks.

## Query

```text
For a docs-vault / software project using Linear as issue tracker, GitHub PRs, multiple coding agents, and one issue <-> one branch/worktree/PR, compare branch naming conventions:
1. strict issue-key + slug branches such as codex/fmx-174-branch-naming
2. topic-only branches such as codex/branch-naming
3. mixed forms where both are accepted.
Research best practices, GitHub/Linear automation implications, CI regex enforcement, traceability, human review, and multi-agent collision risk. Include recommendations for a small team with strong auditability requirements.
```

## Perplexity findings

Perplexity's first-pass synthesis favored a **strict issue-key + slug** convention for FMX-like work:

- Branch names that include the tracker key give each branch a stable, human-readable join point back to the operational issue.
- Issue-key branches make GitHub PR lists, worktrees, local branch lists, and Linear automation easier to reconcile without reading commit history.
- Topic-only names are easier to type but create ambiguous ownership when several related issues share a theme.
- Mixed conventions reduce enforcement value because humans and CI need exceptions, and exceptions become policy drift.
- In a multi-agent setup, issue-key branches reduce accidental collisions because two agents researching the same theme will still produce different issue-key branches.
- For projects that require one issue per PR, the branch name should reinforce the issue relation rather than compete with the PR title/body.
- Topic-only branches can be useful for temporary experiments, but only when the team explicitly records a replacement traceability mechanism before the work starts.

## Options surfaced

| Option | Perplexity summary | Fit for FMX |
| --- | --- | --- |
| A. Strict issue-key + slug | Every normal PR branch contains `fmx-<n>` plus a readable slug. | Strongest fit: aligns with Linear, current CI, one-issue/one-worktree rule, and auditability. |
| B. Mixed accepted forms | Allow both `tool/fmx-n-slug` and `tool/topic`; rely on PR title/body for final traceability. | Weak fit: preserves historical wording but conflicts with current branch CI and adds review ambiguity. |
| C. Topic-only by default | Use short thematic branch names and let PR title/body link the issue. | Poor fit: optimizes typing over traceability and weakens multi-agent collision avoidance. |

## Perplexity recommendation

Perplexity recommended **Option A: strict issue-key + slug** as the normal workflow rule.

Recommended FMX form:

```text
agents: claude|codex|cursor/fmx-<n>-<slug>
humans: feat/fmx-<n>-<slug>
```

Recommended exception shape:

- Do not create a standing generic `no-ref` branch rule.
- If Nico explicitly approves work without a Linear issue, record the replacement traceability before branch creation.
- Treat such an override as one-off, not as an accepted second branch family.

## Source-quality notes

Perplexity mixed primary and secondary sources. The canonical FMX packet therefore verifies the recommendation against primary/current sources:

- Linear GitHub integration documentation.
- GitHub issue/PR linking documentation.
- Git branch-reference validity documentation.
- GitHub Actions context documentation.
- Current FMX `linear-link-check.yml`.

See [[raw-branch-naming-source-checks-2026-06-17]] for the checked source table.
