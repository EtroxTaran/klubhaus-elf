---
title: "ADR-0103: Multi-agent orchestration & conflict serialization"
status: accepted
tags: [adr, meta, process, workflow, multi-agent, orchestration, fmx-103]
created: 2026-06-08
updated: 2026-06-08
type: adr
binding: false
supersedes: ADR-0009-cursor-orchestration
superseded_by:
related:
  - [[ADR-0009-cursor-orchestration]]
  - [[ADR-0044-cicd-and-merge-policy]]
  - [[ADR-0045-issue-first-worktree-workflow]]
  - [[ADR-0046-team-topology-and-scaling]]
  - [[../../30-Implementation/agent-workflow-pattern]]
  - [[../../30-Implementation/cursor-cloud-agent-workflow]]
  - [[../../90-Meta/collaboration-and-decision-protocol]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0103: Multi-agent orchestration & conflict serialization

## Status

draft

> **`draft` / `binding: false`.** Authored 2026-06-08. Supersedes
> [[ADR-0009-cursor-orchestration]] (Cursor-only, stale framing, contradictory status).
> Preserves ADR-0009's one durable insight — **serialize shared-contract changes, fan out
> independent beats** — and re-bases it on the now-canonical, **tool-agnostic** agent-ops
> stack (ADR-0044/0045/0046) that covers all three agents (Claude, Codex, Cursor).
> Low-priority, agent-workflow housekeeping. Awaiting Nico ratify.

## Date

2026-06-08

## Context

[[ADR-0009-cursor-orchestration]] is the oldest agent-ops ADR and has aged badly on three
independent axes:

1. **Cursor-only framing.** Its title, body and consequences are written entirely around
   "Cursor Cloud Agents" (`.cursor/plans/`, `cursor/*` branches, Bugbot). The repo today is
   worked by **three** agents — Claude, Codex, Cursor — on a tool-agnostic branch/worktree
   convention (`‹tool›/fmx-‹n›-‹slug›`, [[ADR-0045-issue-first-worktree-workflow]] §1). The
   orchestration rule is not Cursor-specific; the ADR's framing makes it read as if it were.
2. **A factually stale premise.** ADR-0009's Context opens with *"Most implementation is done
   by Cloud Agents working in parallel."* In the current **docs-vault-only, research/analysis
   phase** (no development — per [[../../90-Meta/collaboration-and-decision-protocol]] and the
   repo `CLAUDE.md`), there is no implementation fan-out at all; the parallelism that exists
   is **docs/ADR authoring** across the three agents. The premise will partly return in the
   build phase, but the ADR states it as a present, dominant fact, which it is not.
3. **Contradictory / incoherent status metadata.** Frontmatter says `status: draft` **and**
   `binding: true`; the body's `## Status` heading says `accepted`. Three different
   statements of bindingness in one file. Under the current decision gate **nothing is
   accepted** ([[../../90-Meta/collaboration-and-decision-protocol]]); ADR-0009 should be a
   `draft` like the rest of the reopened set. Its `related: []` is also empty, so it floats
   unlinked from the agent-ops cluster that has since grown up around it.

Meanwhile the **tool-agnostic agent-ops trio** has largely absorbed ADR-0009's good content
**without ever linking back to it**:

- [[ADR-0045-issue-first-worktree-workflow]] gives the **isolation** mechanism
  (one issue ↔ one worktree ↔ one branch per agent session) that makes the "no uncoordinated
  parallel edits" goal concrete and tool-neutral.
- [[ADR-0044-cicd-and-merge-policy]] gives the **integration gate** (auto-merge-when-green on
  strict branch protection, `Closes FMX-‹n›`, CODEOWNER review for code) — the safety net
  ADR-0009 only gestured at via "Bugbot/draft PR".
- [[ADR-0046-team-topology-and-scaling]] gives the **ownership/Conway** seam (bounded-context
  ↔ lead, CODEOWNERS-by-domain) that determines *which* contracts are shared and who serializes
  them.

What is **not** yet captured anywhere as a first-class rule is ADR-0009's actual nugget: the
**conflict-serialization heuristic** — *serialize the small set of shared-contract changes
(schema / public interface / config), then fan out only the independent beats after explicit
file/interface/config exclusivity checks.* That heuristic is worth preserving verbatim; the
Cursor-only/"most implementation" wrapper around it is not. This ADR retires the wrapper and
re-homes the heuristic on the tool-agnostic stack.

This is a **meta/process** decision (agent workflow), not an architecture/tech/gameplay/data
decision; it is low priority and changes nothing about the product. It still goes through the
ask-first gate as a `needs:nico-decision`.

## Options Considered

- **D1 — How to retire ADR-0009 and re-home its insight.**
  - **A (RECOMMENDED).** A **superseding, tool-agnostic orchestration ADR** (this one) that
    (i) generalises *serialize-schema/interface/config + fan-out-independent-beats* across all
    three agents, (ii) explicitly cross-links the agent-ops trio
    [[ADR-0044-cicd-and-merge-policy]] / [[ADR-0045-issue-first-worktree-workflow]] /
    [[ADR-0046-team-topology-and-scaling]], and (iii) declares `Supersedes: ADR-0009` so the
    cluster gains a clear hierarchy. ADR-0009 stays on disk untouched (supersession = a new
    ADR, never an edit).
  - **B.** Keep ADR-0009 but mark it stale via **Decision-Log status only**; defer any
    generalisation to the build phase when real implementation fan-out resumes. Cheapest, but
    leaves the contradictory status metadata and Cursor-only framing in place and the
    serialization heuristic still un-promoted and unlinked.
  - **C.** **Fold orchestration entirely into [[ADR-0045-issue-first-worktree-workflow]]**
    (worktree workflow) with no separate orchestration ADR — supersede ADR-0009 by reference
    from 0045. Tidy, but conflates two different concerns (physical *isolation* of work vs the
    *ordering policy* for shared-contract edits) and would require **editing** 0045, which is a
    separate ratified-direction ADR; also loses a clean named home for the heuristic.

- **D2 — Branch-naming reconciliation (open).** Whether to also reconcile the two branch-name
  forms in circulation — `‹tool›/fmx-‹n›-‹slug›` (ADR-0045) vs the `‹tool›/‹thema›` form used in
  the global agent instructions and on this very branch (`claude/open-decisions-dossier`) —
  **here**, or as a small **amendment to [[ADR-0045-issue-first-worktree-workflow]]** (which
  owns branch naming). See Open Questions.

## Decision

Propose, awaiting Nico: **D1 = A.** D2 is left open (see Open Questions).

### D1 — Supersede ADR-0009 with a tool-agnostic orchestration ADR

This ADR replaces [[ADR-0009-cursor-orchestration]]. The durable rule, restated tool-agnostically
for **all three agents** (Claude / Codex / Cursor) and for human contributors:

1. **Serialize shared-contract changes.** Edits to **schema, public interfaces / contracts, or
   shared config** are serialized — at most one in-flight change per shared artifact, sequenced
   (not fanned out). This is the dominant merge-conflict and broken-contract source; serializing
   the *small* set of shared edits removes it. ("Contracts-first, serialize the contract" — the
   same principle the engineering standard already mandates.)
2. **Fan out only independent beats.** After **file / interface / config exclusivity checks**
   confirm two beats touch disjoint artifacts, they may run in parallel across agents/worktrees.
   Parallelism is the default *only* on the independent set.
3. **Isolation is the mechanism (not a new rule).** The exclusivity boundary is realised by
   **one issue ↔ one worktree ↔ one branch per agent session**
   ([[ADR-0045-issue-first-worktree-workflow]]). A shared artifact "in flight" = an open
   issue/worktree owning it; that is the serialization unit.
4. **Integration is the gate (not a new rule).** Conflicts that slip through are caught at the
   **auto-merge-when-green + branch-protection** gate ([[ADR-0044-cicd-and-merge-policy]]):
   green required checks, `Closes FMX-‹n›`, CODEOWNER review for code paths.
5. **Ownership decides "shared".** *Which* contracts are shared (and thus serialized) and *who*
   owns the serialization follows the bounded-context ↔ lead map
   ([[ADR-0046-team-topology-and-scaling]] / [[../bounded-context-map]]); solo today (Nico owns
   all), additive when a second lead joins.
6. **Tool-specific plan artifacts are optional, not normative.** Cursor's `.cursor/plans/`
   Plan-Mode output (and any agent's equivalent) is a fine *implementation* of step 2's
   exclusivity check but is **not** the rule — the rule is the exclusivity check itself, however
   produced. Claude/Codex satisfy it through their own plan/issue-scoping.

ADR-0009's frontmatter `binding: true` / body `accepted` are **not** carried forward: this ADR
is `draft` / `binding: false` under the current gate. ADR-0009 is left **unedited**; its
retirement is recorded here and (on ratify) in [[../../00-Index/Decision-Log]] /
[[../../00-Index/Open-Decisions-Dossier]].

## Rationale

The serialization heuristic is sound and matches established multi-writer practice: the cheapest
way to keep parallel writers conflict-free is to **make shared/contract edits mutually exclusive
and let everything genuinely independent run wide** — exactly Git's "a branch lives in one
worktree" isolation model ([[ADR-0045-issue-first-worktree-workflow]]) plus a green-gate merge
([[ADR-0044-cicd-and-merge-policy]]). Nothing about that heuristic is Cursor-specific, so binding
it to one vendor (and to a no-longer-true "most implementation is Cloud Agents" premise) under-
serves the three-agent reality and contradicts the tool-agnostic stack that has grown around it.
Option A preserves the insight, removes the stale wrapper and the triple-contradictory status, and
gives the agent-ops cluster (0009 → 0103, beside 0044/0045/0046) a single current head with a
clear hierarchy — at zero product cost. Options B and C either leave the contradictions in place
(B) or force an edit to a separate ratified-direction ADR while conflating isolation with ordering
(C).

## Consequences

Positive:

- **One current orchestration ADR** covering all three agents; the Cursor-only framing and the
  "most implementation is Cloud Agents" premise are retired.
- The **agent-ops cluster gains a clear hierarchy**: ADR-0103 (orchestration/ordering) sits with
  ADR-0045 (isolation), ADR-0044 (integration gate), ADR-0046 (ownership/scaling), each
  cross-linked — closing ADR-0009's empty `related: []`.
- The **serialization heuristic is preserved verbatim** and promoted to a first-class, linked
  rule instead of living only inside a stale Cursor doc.
- Status metadata is **internally consistent** (`draft` everywhere) and matches the gate.

Negative:

- One more ADR in the meta cluster to keep in sync (mitigated: it is the named head, the others
  link to it).
- ADR-0009 remains on disk as a superseded artifact (by design — supersession ≠ deletion); a
  reader must follow `superseded_by` to reach the current rule. Decision-Log will carry the
  pointer.
- The branch-naming inconsistency (D2) is **not** resolved by this ADR and stays open.

## Risks

Low — meta/process only. No code, schema, data-model, gameplay or scope impact; the product is
unchanged. The only failure mode is the cluster's cross-links drifting out of sync, mitigated by
making ADR-0103 the explicit head the others reference.

## Open Questions

- **D2 — Branch-naming form.** Two forms are live: `‹tool›/fmx-‹n›-‹slug›`
  ([[ADR-0045-issue-first-worktree-workflow]] §1) and `‹tool›/‹thema›` (global agent instructions
  / this branch `claude/open-decisions-dossier`). Reconcile **here**, or as a small **amendment to
  ADR-0045** (which owns branch naming)? Recommendation leans to an **ADR-0045 amendment** so
  branch naming stays single-sourced, but it is Nico's call.
- Should the **file/interface/config exclusivity check** (step 2) ever be hard-enforced (a hook),
  or stay advisory like the issue-first hook in [[ADR-0045-issue-first-worktree-workflow]] §3
  ("OFF until Nico arms it")? Default: stay advisory in the docs phase.

## Supersedes

[[ADR-0009-cursor-orchestration]] (`Cursor Cloud Agent Orchestration`). ADR-0009's
serialize-shared-contracts / fan-out-independent-beats insight is **carried forward** and
generalised; its Cursor-only framing, its "most implementation is Cloud Agents" premise, and its
contradictory `accepted`/`binding: true`/`draft` status are **retired**. ADR-0009 is left
**unedited** (supersession is expressed only by this new ADR + its `Supersedes` link).

## Related Docs

- [[ADR-0009-cursor-orchestration]] — superseded; source of the preserved serialization heuristic.
- [[ADR-0045-issue-first-worktree-workflow]] — the **isolation** mechanism (issue ↔ worktree ↔
  branch); branch naming.
- [[ADR-0044-cicd-and-merge-policy]] — the **integration gate** (auto-merge-when-green, branch
  protection, `Closes FMX-‹n›`).
- [[ADR-0046-team-topology-and-scaling]] — **ownership/Conway** seam deciding which contracts are
  shared and who serializes them.
- [[../../30-Implementation/agent-workflow-pattern]] · [[../../30-Implementation/cursor-cloud-agent-workflow]] —
  process docs; the latter is the Cursor-specific implementation of the now-generalised rule.
- [[../../90-Meta/collaboration-and-decision-protocol]] — phase + ask-first gate (nothing accepted).
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
