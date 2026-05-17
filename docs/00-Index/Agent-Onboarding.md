---
title: Agent Onboarding
status: current
tags: [meta, agents, vault]
created: 2026-05-17
updated: 2026-05-17
type: index
binding: true
related: [[../90-Meta/agent-memory-protocol]]
---

# Agent Onboarding

First read for every agent (Claude Code, Cursor local, Cursor Cloud, Bugbot).
The vault (`docs/`) is durable project memory. `AGENTS.md` / `CLAUDE.md` and the
`.cursor/rules` are orchestrators only — durable context lives in vault notes.

## Read in this order

1. This note.
2. [[Current-State]] — what is being built, stable, blocked, open questions.
3. Relevant maps from [[Home]] (Glossary, Decision-Log, Architecture).
4. `accepted` ADRs and `approved` game design / feature specs for the task.
5. The linked Linear issue when one exists.
6. The latest note under [[../40-Execution/session-handoffs/README|session-handoffs]]
   if the work continues a prior thread.

## Memory classes

- **Cold** — durable, rarely changes, often referenced: `accepted` ADRs,
  `10-Architecture/**`, `00-Index/Vision`, `Glossary`, approved design notes.
- **Warm** — changes regularly: [[Current-State]], active feature specs,
  module notes, open questions.
- **Hot** — changes every session: `40-Execution/session-handoffs/*`, the
  linked Linear issue, current branch context.

Load the minimum depth the task needs. Never "read the whole vault".

## Non-negotiables

- Prefer `current`, `accepted`, `approved` notes. Never implement from `draft`,
  `superseded`, `archived`, old plans, issue mirrors, or chat history.
- One canonical location per fact. Do not duplicate vault content into
  `AGENTS.md`, `CLAUDE.md`, rules, or README.
- Update the vault in the **same PR** when work changes architecture, scope,
  gameplay, operations, or user-facing behavior.
- On approach change: supersede, do not silently overwrite (see
  [[../90-Meta/vault-governance]]).
- End substantial sessions with a handoff note and a [[Current-State]] update.

Full rules: [[../90-Meta/agent-memory-protocol]] and
[[../90-Meta/vault-governance]].
