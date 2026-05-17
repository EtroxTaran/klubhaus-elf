---
title: Vault Governance
status: current
tags: [meta, agents, vault, governance]
created: 2026-05-17
updated: 2026-05-17
type: protocol
binding: true
related: [[agent-memory-protocol]]
---

# Vault Governance

How the `docs/` vault stays usable as memory for every agent. The operational
step-by-step is in [[agent-memory-protocol]]; this note defines the rules that
protocol enforces.

## Memory classes

| Class | Changes | Contents | Where |
|---|---|---|---|
| Cold | Rarely | Vision, glossary, accepted ADRs, architecture, module notes, approved design | `00-Index/Vision`, `00-Index/Glossary`, `10-Architecture/**` |
| Warm | Regularly | Current state, active feature specs, open questions | `00-Index/Current-State`, `20-Features/**` |
| Hot | Every session | Handoffs, branch context, linked Linear issue | `40-Execution/session-handoffs/**`, Linear |

Agents load the minimum depth a task needs. Never "load everything".

## Canonical-location rule

Every fact has exactly one canonical home in the vault. `AGENTS.md`,
`CLAUDE.md`, `.cursor/rules/*`, `.cursor/skills/*`, `.cursor/BUGBOT.md`, and
`README.md` are **orchestrators**: they point at the vault, they do not restate
it. No copy-paste duplication of durable content into config or README.

## Supersede discipline (temporal awareness)

The guarantee: at any time, "what was the old way and what is the newest way"
must be answerable from [[../00-Index/Decision-Log]] alone, without opening any
note, and from the old note itself in one banner.

Accepted/approved notes are append-only in spirit. When an approach changes
(e.g. a technology swap), do **not** edit the old decision — create a new ADR:

1. Create the replacement note (new ADR/decision), `created` = today.
2. Set the old note `status: superseded`, bump its `updated` date.
3. Link both directions in frontmatter: `superseded_by` on the old,
   `supersedes` on the new.
4. Paste the standard banner directly under the old note's H1, keeping old
   content intact:

   > **SUPERSEDED on YYYY-MM-DD by [[ADR-MMMM-...]].**
   > Old way: `<one line>`. New way: `<one line>`. Kept for history — do not
   > implement.

5. Update the old row in [[../00-Index/Decision-Log]] (status + Superseded-by)
   and the new row (Supersedes), so the old→new chain is visible at the index.
6. Update [[../00-Index/Current-State]] and any affected maps/module notes.

All of the above happens in the **same PR** as the technology/approach change.
Never silently rewrite an `accepted` ADR or `approved` design note — that
destroys the history and breaks temporal awareness. A chain of three swaps must
read as three linked ADRs (oldest `superseded` → … → newest `accepted`), fully
traceable from the Decision-Log table.

## Status values

Controlled per note type — see [[templates/README]]. Implement only from
`current` / `accepted` / `approved`. Never from `draft` / `superseded` /
`archived`.

## Draft / idea layer

`draft` (ADRs) and `idea` (game design) notes are a **recognized intent
collection**, not noise to skip. Agents:

- **Read** them for direction and context, and to avoid re-deciding or
  re-proposing something already sketched.
- **Must not implement** from them, cite them as authoritative, or treat their
  content as settled.
- Treat a draft as "the current best thinking, not yet ratified". Moving a
  draft to `accepted`/`approved` is a deliberate decision (often gated, e.g. on
  research) — see each note's blocked banner and [[../00-Index/Current-State]].

`superseded` / `archived` are different: not the idea layer — replaced or
retired. Read only to understand history, never for direction.

Discoverability: draft ADRs are listed with status in
[[../00-Index/Decision-Log]]; open intent is summarized in
[[../00-Index/Current-State]] (Blocked / Open questions).

## Same-PR rule

Code that changes architecture, product scope, gameplay, operations, or
user-facing behavior must update the relevant vault note(s) in the **same PR**.
Bugbot flags violations.

## Module notes

Every package/app under `apps/` and `packages/` has a note in
`10-Architecture/modules/`. A new module requires a `module.md`; an
architecture-relevant change to a module updates it. Template:
[[templates/module]].

## Review cadence

- **Per session** — update [[../00-Index/Current-State]], write a handoff.
- **Monthly** — mark stale notes, link superseded ADRs, prune the glossary,
  confirm the entry chain has zero dangling links.
- **Quarterly** — review `AGENTS.md`, `CLAUDE.md`, and the `.cursor` rules
  against this note and [[agent-memory-protocol]].

## Agent entry-point conformance

Every entry point must point at the same artifacts with the same semantics.
This table is the single source of truth for "all agents use memory the same
way".

| Entry point | Must guarantee |
|---|---|
| `CLAUDE.md` | One-line pointer to `AGENTS.md`. No duplicated content. |
| `AGENTS.md` | Entry chain → Agent-Onboarding → Current-State → Home → agent-memory-protocol → vault-governance. Names the `vault-memory` and `linear-issue-creation` skills. |
| `docs/90-Meta/agent-memory-protocol.md` | Canonical session start / during-work / update / wrap-up steps. |
| `.cursor/rules/10-vault-memory.mdc` | Same start/update/wrap-up semantics as the protocol; orchestrator only. |
| `.cursor/rules/15-linear-ticket-operating-system.mdc` | Linear = operational truth; vault = durable truth; points at linear-task-tracking. |
| `.cursor/skills/vault-memory/SKILL.md` | Repeatable start/update/wrap-up workflow matching the protocol. |
| `.cursor/skills/linear-issue-creation/SKILL.md` | Issue quality + vault links on closure. |
| `.cursor/BUGBOT.md` | Flags missing same-PR vault updates. |

Changing one entry point's memory semantics means updating this table and every
row it affects in the same PR.
