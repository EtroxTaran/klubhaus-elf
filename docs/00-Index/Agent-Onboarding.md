---
title: Agent Onboarding
status: current
tags: [meta, agents, vault]
created: 2026-05-17
updated: 2026-05-22
type: index
binding: true
related:
  - [[../90-Meta/agent-memory-protocol]]
  - [[Documentation-V1]]
---

# Agent Onboarding

First read for every agent (Claude Code, Cursor local, Cursor Cloud, Bugbot).
The vault (`docs/`) is durable project memory. `AGENTS.md` / `CLAUDE.md` and the
`.cursor/rules` are orchestrators only — durable context lives in vault notes.

> **Start here (minimum reading set).** To understand the current state you only
> need five notes: this one → [[Current-State]] → [[Documentation-V1]] →
> [[Decision-Log]] → [[MVP-Scope]]. Everything else (the ~160-file vault,
> pre-mortem, raw research) is reference you pull on demand for a specific task —
> do **not** read it all. [[Documentation-V1]] is the pre-reopen baseline
> snapshot; [[Current-State]] and the decision indexes state what is currently
> binding.

## Read in this order

1. This note.
2. [[Current-State]] - what is being built, stable and temporally classified.
3. [[Documentation-V1]] - current gap-closure baseline.
4. Relevant maps from [[Home]] (Glossary, Decision-Log, Architecture).
5. Re-ratified `accepted` ADRs and `approved` game design / feature specs for
   the task. As of 2026-05-27, ADRs/GDDRs are reopened to `draft`.
6. The linked Linear issue when one exists.
7. The latest note under [[../40-Execution/session-handoffs/README|session-handoffs]]
   if the work continues a prior thread.

## Memory classes

- **Cold** — durable, rarely changes, often referenced: re-ratified ADRs,
  `10-Architecture/**`, `00-Index/Vision`, `Glossary`, design notes.
- **Warm** — changes regularly: [[Current-State]], active feature specs,
  module notes, gap classifications.
- **Hot** — changes every session: `40-Execution/session-handoffs/*`, the
  linked Linear issue, current branch context.

Load the minimum depth the task needs. Never "read the whole vault".

## Non-negotiables

- Prefer `current` process/meta notes and re-ratified `accepted`/`approved`
  decisions. Never implement from `draft`, `superseded`, `archived`, old plans,
  issue mirrors, or chat history.
- One canonical location per fact. Do not duplicate vault content into
  `AGENTS.md`, `CLAUDE.md`, rules, or README.
- Update the vault in the **same PR** when work changes architecture, scope,
  gameplay, operations, or user-facing behavior.
- On approach change: supersede, do not silently overwrite (see
  [[../90-Meta/vault-governance]]).
- End substantial sessions with a handoff note and a [[Current-State]] update.

Full rules: [[../90-Meta/agent-memory-protocol]] and
[[../90-Meta/vault-governance]].
## Related

- [[../90-Meta/agent-memory-protocol]]
- [[Documentation-V1]]
