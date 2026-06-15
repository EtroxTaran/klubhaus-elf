---
title: FMX-175 Code-CI pipeline decision queue
status: current
tags: [execution, decision-queue, ci, github-actions, nx, pnpm, quality, security, fmx-175]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: true
linear: FMX-175
related:
  - [[../60-Research/code-ci-pipeline-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
  - [[../30-Implementation/ci-and-review-process]]
  - [[../30-Implementation/code-phase-dod-transition-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
---

# FMX-175 Code-CI pipeline decision queue

This is the HITL decision record for FMX-175. Nico accepted the packet on
2026-06-15 by choosing the recommended options before implementation.

## D1 - future required check names

| Option | Meaning | Assessment |
|---|---|---|
| **A. Script/domain-aligned names** | Keep `docs-check`/`linear-id` active today; future code-phase required contexts become stable domains backed by root scripts: `quality`, `e2e`, `security`. | **Recommended.** Avoids stale tool/vendor names and keeps branch protection tied to durable proof domains. |
| B. Legacy five-name set | Preserve `quality`, `e2e`, `lighthouse`, `cursor-smoke`, `configured` as the target set. | Repeats D-002 drift. `cursor-smoke` and `configured` are not durable quality domains. |
| C. Defer exact names | Document principles now and decide names only during bootstrap. | Safe, but leaves FMX-175's acceptance gap unresolved. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D2 - branch-protection activation

| Option | Meaning | Assessment |
|---|---|---|
| **A. Burn-in before required** | Create real scripts/workflows as non-required/reporting first, prove green/stable behavior, then promote stable contexts to branch protection. | **Recommended.** Prevents a new broken-check incident. |
| B. Require immediately | Make the target code checks required as soon as a bootstrap PR creates them. | Stricter, but risky while targets and flakes are unproven. |
| C. Feature-triggered | Keep only docs checks until the first feature PR needs code CI. | Avoids early work, but risks shipping the first code PR without mature gates. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D3 - D-002 narrative cleanup

| Option | Meaning | Assessment |
|---|---|---|
| **A. Compress in place** | Keep D-002 as compact historical lessons in `ci-and-review-process.md`; remove live blocker wording for nonexistent app/code checks. | **Recommended.** Preserves the lesson without misleading agents. |
| B. Archive separately | Create a dedicated incident-history note and keep active docs purely current. | Valid, but more structure than this cleanup needs. |
| C. Leave narrative | Keep the old story mostly intact and add caveats. | Leaves too much stale live-state noise. |

**Decision:** Accepted A (Nico, 2026-06-15).

## D4 - implementation ownership and trigger

| Option | Meaning | Assessment |
|---|---|---|
| **A. Contract now, workflows in bootstrap** | FMX-175 defines the CI contract; the first code-phase bootstrap/workspace PR creates real scripts and thin workflows before the first code PR. | **Recommended.** Matches docs-vault-only phase and ADR-0110. |
| B. Add workflows now | Add placeholder workflows/scripts in FMX-175. | Rejected. The repo has no workspace, app or packages and fake green checks are forbidden. |
| C. Leave owner unnamed | State that checks are future work without naming the trigger. | Too vague for a required-check contract. |

**Decision:** Accepted A by implementing the approved FMX-175 plan
(Nico, 2026-06-15).

## Decision record

- 2026-06-15: FMX-175 selected after live Linear/GitHub/worktree triage; prior
  selected FMX-156 had already been completed and merged by another agent.
- 2026-06-15: `/root/research-gp` `main` fast-forwarded to the current remote
  `main`.
- 2026-06-15: FMX-175 moved from `Backlog` to `In Progress`.
- 2026-06-15: clean branch/worktree created:
  `codex/fmx-175-code-ci-pipeline`.
- 2026-06-15: Perplexity-first discovery and official source checks saved.
- 2026-06-15: Nico accepted D1=A, D2=A, D3=A; D4=A follows the approved plan
  constraint that no code workflows are added in docs-only phase.

## Approved packet

Accepted selection: **D1=A, D2=A, D3=A, D4=A**.

No open Nico decision remains for FMX-175. Future code bootstrap must still
re-check tool versions and official docs before adding dependencies or pins.

## Related

- [[../60-Research/code-ci-pipeline-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-code-ci-pipeline-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-code-ci-pipeline-source-checks-2026-06-15]]
- [[../30-Implementation/ci-and-review-process]]
- [[../30-Implementation/code-phase-dod-transition-contract]]
- [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
