---
name: work-issue
description: The end-to-end loop for working one Linear issue in the research/architecture phase — pick, understand, grounded research, draft-first proposal, one decision checkpoint with Nico, finalize + PR. Use at the start of any issue/beat so every agent (Claude, Codex, Cursor) works it the same way.
---

# Work Issue

## Goal

Work a single Linear (team FMX) issue to a merged deliverable the **same way**
across Claude Code, Codex, and Cursor, in the current **research / analysis /
architecture** phase — deliverables are ADR / GDDR / research notes, not code.

## Source of truth

This skill is an **orchestrator**. If it ever disagrees with the vault, the vault
wins — fix this skill in the same PR.

1. `docs/30-Implementation/agent-workflow-pattern.md` — §**Research / Decision
   beat** is the canonical loop this skill runs.
2. `docs/30-Implementation/linear-task-tracking.md` — issue body format, labels,
   workflow states, the claim rule, branch/PR conventions, the max-3/session cap.
3. `docs/90-Meta/collaboration-and-decision-protocol.md` — roles, ask-first gate,
   current phase.
4. `.cursor/skills/vault-memory/SKILL.md` — run its vault start/update/wrap-up
   alongside this skill.

## The loop (checklist)

- [ ] **0. Well-formed?** Issue has a clear task + `Summary / Context /
  Requirements / Acceptance Criteria`. **Only if vague/missing:** draft the AC +
  definition-of-done and confirm with Nico. A well-formed issue is not
  re-litigated — proceed.
- [ ] **1. Pick + claim.** No branch/PR/worktree owns it → Linear → `In Progress`
  (first visible action) → own worktree + branch `‹tool›/fmx-‹n›-slug` (ADR-0045).
- [ ] **2. Read + understand.** Read linked vault notes + `accepted` ADRs/GDDRs +
  cited sources; restate intent + AC. *Grill-with-docs (optional, your call):* if
  the core idea is unclear, deep-read the records + external docs (context7/Ref)
  **before** broad research.
- [ ] **3. Research (grounded).** Dynamic fan-out — external via
  web/context7/Ref/Perplexity, internal via vault grep/read → analyze →
  synthesize. Scale depth to the issue. Never guess; ground every external fact.
- [ ] **4. Recommend (draft-first).** Write the `Status: proposed`
  ADR/GDDR/research note with the recommendation **filled in** + a tight list of
  open questions (each: 2–3 sourced options + a recommendation). Never self-accept.
- [ ] **5. Ask Nico — ONE checkpoint.** One turn: draft + all open questions
  ("is this how you think about it, or how do you want to change it?"). Every
  decision-bearing question live, options + recommendation. Resolve all before
  finalizing.
- [ ] **6. Finalize.** Apply decisions; vault delta in the **same PR** (ADR +
  Decision-Log / GDDR + `50-Game-Design/README` / Glossary / index).
- [ ] **7. PR + handoff.** PR (`Closes` / `Part of FMX-‹n›`) → Linear
  `In Review`. **Nico merges** (agents never `Done`/`Canceled`). Handoff note if
  the thread continues.

## Rules that never bend

- **Silent through 2–4; surface once at 5.** No drip questions.
- **Stop conditions fire immediately** — a contradiction with a binding record,
  blocking ambiguity, or a one-way door without an ADR escalates now, not at
  step 5 (see *Ask, don't work around* in the workflow doc).
- **`proposed` only** — agents never ratify a decision; Nico does.
- **Ground every external fact** (context7 / Ref / web / Perplexity); use the
  latest stable versions (*Dependencies & Tooling Currency*).
- **Max 3 new issues per session** unless Nico authorizes a batch.

## Research fan-out pattern

For a substantive beat, run a research → synthesize workflow: parallel agents,
one per angle (external precedent · best-practice / DDD · vault-completeness /
collision scan), then a synthesis agent that returns the recommendation, the
draft deliverable section, and the open-questions list. Scale the agent count to
the issue; adversarially verify a finding before relying on it.
