---
title: Vault Governance
status: current
tags: [meta, agents, vault, governance]
created: 2026-05-17
updated: 2026-05-27
type: protocol
binding: true
related: [[agent-memory-protocol]], [[../00-Index/Documentation-V1]]
---

# Vault Governance

How the `docs/` vault stays usable as memory for every agent. The operational
step-by-step is in [[agent-memory-protocol]]; this note defines the rules that
protocol enforces.

## Memory classes

| Class | Changes | Contents | Where |
|---|---|---|---|
| Cold | Rarely | Vision, glossary, accepted ADRs, architecture, module notes, approved design | `00-Index/Vision`, `00-Index/Glossary`, `10-Architecture/**` |
| Warm | Regularly | Current state, active feature specs, gap classifications | `00-Index/Current-State`, `20-Features/**` |
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

   > **SUPERSEDED on YYYY-MM-DD by \[\[ADR-MMMM-...\]\].**
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

## Status vs binding — two axes (FMX-211 D2/D14, decided 2026-06-22)

`status` and `binding` are **orthogonal** and must not be conflated:

- **`status`** = the note's lifecycle of record (`draft` → `accepted`/`current`
  → `superseded`). It is the **sole lifecycle authority**, enforced by
  `scripts/status-consistency-check.mjs`.
- **`binding`** = "are this decision's rules in force in the repo **today**?"
  `binding: false` is **legitimate** for an `accepted` decision whose enforcement
  is **future-scope** (e.g. [[ADR-0046-team-topology-and-scaling]])
  or **activation-pending** (e.g. [[ADR-0044-cicd-and-merge-policy]]
  — the gate does not exist yet). Such a flag is the honest signal that a guardrail
  is decided but not yet enforced; the code-phase gate that activates it (ADR-0110
  DoD) is what flips it to `binding: true`.

Therefore: **there is no "accepted ⇒ `binding: true`" rule** — that would assert
rules are in force that are not. The only hard, judgment-free invariants
(CI-enforced) are: **`status: superseded` ⇒ `binding: false`** (a retired decision
cannot be in force), and **every ADR must declare an explicit `binding` field**.
Changing a ratified decision recorded under this model requires a **new ADR**, not
an in-place edit.

## Draft / idea layer

`draft` (ADRs) and `idea` (game design) notes are a **recognized intent
collection**, not noise to skip. Agents:

- **Read** them for direction and context, and to avoid re-deciding or
  re-proposing something already sketched.
- **Must not implement** from them, cite them as authoritative, or treat their
  content as settled.
- Treat a draft as "the current best thinking, not yet ratified". Moving a
  draft to `accepted`/`approved` is a deliberate decision (often gated, e.g. on
  research) - see [[../00-Index/Documentation-V1]] and [[../00-Index/Current-State]] for the current temporal classification.

`superseded` / `archived` are different: not the idea layer — replaced or
retired. Read only to understand history, never for direction.

Discoverability: draft ADRs are listed with status in
[[../00-Index/Decision-Log]]; current intent and gap classifications are
summarized in [[../00-Index/Current-State]] and
[[../00-Index/Documentation-V1]].

## Same-PR rule

Code that changes architecture, product scope, gameplay, operations, or
user-facing behavior must update the relevant vault note(s) in the **same PR**.
Bugbot flags violations.

## Module notes

Every package/app under `apps/` and `packages/` has a note in
`10-Architecture/modules/`. A new module requires a `module.md`; an
architecture-relevant change to a module updates it. Template:
[[templates/module]].

## Game design layer

The causal chain for this project is:

`research (60-Research) → game design (50-Game-Design) → architecture (ADRs) → implementation`

Game design is a **first-class decision layer, peer to ADRs**, recorded as
Game Design Decision Records (GDDRs) in `50-Game-Design/`, indexed by
[[../50-Game-Design/README]] (the Game Design Log — status + lineage, like
[[../00-Index/Decision-Log]] for ADRs). Template: [[templates/game-design]].

Rules every agent follows:

- **Implement gameplay only from `approved` GDDRs.** `idea`/`draft` GDDRs are
  the recognized intent layer (read for direction, do not implement).
- **Scoped approval.** In an `approved` GDDR only the **Decided / strong**
  section is ratified. Its **Open (Wave 2)** section is never approved and not
  implementable until that research closes — `approved` status does not make
  the whole note buildable. A GDDR whose entire core is Wave-2-gated stays
  `draft` (e.g. GD-0002, GD-0010) — do not promote it just to look complete.
- **An ADR must not contradict an `approved` GDDR.** ADRs *implement* game
  design; each gameplay ADR carries a "Design source" link to its GDDR(s).
- **Same-PR rule (gameplay):** a PR that changes gameplay, a game system, or
  player-facing behavior updates the relevant GDDR in the same PR (and the
  ADR/Current-State if affected) — exactly like the architecture same-PR rule.
- **Supersede discipline applies** to GDDRs identically to ADRs (status,
  two-way links, banner, Game Design Log row).
- New game system ⇒ new GDDR. A gameplay change with no GDDR is a defect
  (Bugbot flags it).

## Knowledge connectivity

The vault is a graph, not a folder of essays. A note that no other note links
to is invisible to the graph, to backlinks, and to an agent navigating by
relationships. Connectivity is mandatory, not decorative.

Rules for every **content** note (architecture, implementation, research,
feature, design — not templates or archival mirrors):

- **Link its decisions.** Name the ADRs it depends on or realizes with
  wiki-links. If it implements an architectural choice, it links that ADR.
- **Link its modules.** If it concerns a package/app, link the
  `10-Architecture/modules/*` note.
- **Link its inputs.** Research that fed a decision links that decision;
  implementation that realizes a strategy links the arc42 note.
- **Carry a `## Related` section** at the end with those wikilinks, and mirror
  the key ones in a `related:` frontmatter list. One direction is enough —
  Obsidian/Quartz backlinks make the edge bidirectional automatically.
- **Hub-and-spoke.** Every domain has a Map of Content (MOC) hub that links its
  children and is reachable from [[../00-Index/Home]]: `00-Index/Home`
  (master), `00-Index/Decision-Log` (ADRs), `50-Game-Design/README`
  (game design), `10-Architecture/README` (architecture),
  `30-Implementation/README` (implementation), `60-Research/00-summary`
  (research), `10-Architecture/05-Building-Blocks` (modules).

Archival/non-canonical notes (`90-Meta/github-issue-suite/**`) are filtered
out of the graph view via the documented Obsidian/Quartz filter
([[obsidian-config]]). Do not add new links from canonical notes into them;
the few existing D-001/D-002 references are tolerated legacy.

Orphan check: a content note with zero inbound or outbound wiki-links is a
defect. The monthly review greps for it.

## Review cadence

- **Per session** — update [[../00-Index/Current-State]], write a handoff.
- **Monthly** — mark stale notes, link superseded ADRs **and GDDRs**, prune
  the glossary, confirm the entry chain has zero dangling links, and grep for
  orphan content notes (zero inbound/outbound wiki-links) — connect or
  archive each.
- **Quarterly** — review `AGENTS.md`, `CLAUDE.md`, and the `.cursor` rules
  against this note and [[agent-memory-protocol]].

## Agent entry-point conformance

Every entry point must point at the same artifacts with the same semantics.
This table is the single source of truth for "all agents use memory the same
way".

| Entry point | Must guarantee |
|---|---|
| `CLAUDE.md` | One-line pointer to `AGENTS.md`. No duplicated content. |
| `AGENTS.md` | Entry chain → Agent-Onboarding → Current-State → Home → agent-memory-protocol → vault-governance. Points to collaboration-and-decision-protocol; names the `vault-memory` skill. |
| `docs/90-Meta/agent-memory-protocol.md` | Canonical session start / during-work / update / wrap-up steps. |
| `docs/90-Meta/collaboration-and-decision-protocol.md` | Canonical roles, ask-first decision gate, and current project phase. |
| `.cursor/rules/10-vault-memory.mdc` | Same start/update/wrap-up semantics as the protocol; orchestrator only. |
| `.cursor/rules/01-collaboration.mdc` | Same roles / decision-gate / phase semantics; orchestrator only. |
| `.cursor/skills/vault-memory/SKILL.md` | Repeatable start/update/wrap-up workflow matching the protocol. |
| `.cursor/BUGBOT.md` | Flags missing same-PR vault updates. |

Changing one entry point's memory semantics means updating this table and every
row it affects in the same PR.
