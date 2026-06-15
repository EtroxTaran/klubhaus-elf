---
title: Collaboration & Decision Protocol
status: current
tags: [meta, agents, collaboration, governance]
created: 2026-05-27
updated: 2026-05-27
type: protocol
binding: true
related: [[vault-governance]], [[agent-memory-protocol]], [[../30-Implementation/agent-workflow-pattern]], [[../00-Index/Current-State]], [[../00-Index/Decision-Log]], [[../50-Game-Design/README]]
---

# Collaboration & Decision Protocol

Canonical home for **who decides what**, the **ask-first decision gate**, and the
**current project phase** for Klubhaus Elf. This note is the Klubhaus Elf-specific
expression of the cross-project principles in the machine-global agent
definitions (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`). Operational
step-by-step lives in [[agent-memory-protocol]] and
[[../30-Implementation/agent-workflow-pattern]] — this note does not restate them.

## Roles

- **Nico — Projektleitung / Lead Architect.** Decides architecture, scope,
  technology, gameplay and priorities. The only authority that ratifies
  decisions (ADRs `accepted`, GDDRs `approved`). As the team grows this delegates
  to per-domain Leads (see [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]]).
- **Agents (Claude Code, OpenAI Codex, Cursor) — supporting senior engineers.**
  Support the **shaping, research and elaboration** of the project: research,
  game-loop analysis, game and engine design, technical analysis and evaluation.
  Output is **vault notes and proposals**, never unilateral decisions.

## Current phase

Research / analysis / architecture planning — **no development**. This can change
over time; until Nico changes it, do not implement code or spin up premature
"versions". Deliverables are vault notes: research ([[../60-Research/00-summary|60-Research]]),
game design ([[../50-Game-Design/README|GDDRs]]) and architecture
([[../00-Index/Decision-Log|ADRs]]) as `draft` / proposals. Decisions are
currently **reopened** for re-evaluation — see [[../00-Index/Current-State]].

## Decision gate (ask-first)

Before any decision about **technology, gameplay, architecture, data model,
module boundaries, public APIs / contracts, scope, or security/privacy**:

1. **Stop.** Do not decide or build around it.
2. Present **2–3 options** with **best-practice rationale (sourced research) and
   a clear recommendation**.
3. Wait for Nico's go-ahead; record the ratified outcome as an ADR/GDDR.

This is the Klubhaus Elf expression of the stop conditions and HITL escalation in
[[../30-Implementation/agent-workflow-pattern]]; escalation runs through Linear
(team FMX), beat set to Blocked. **Never shorten a path just because it is faster
or easier** — thoroughness and durable foundations before speed; development does
not stop once an MVP exists.

## Engineering foundations

DDD, TDD, modular, contracts-first; modules **as small as possible but as large
as necessary** — independently rebuildable and scalable, the whole still
coherent, every decision future-proof. The concrete architecture is
[[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] +
[[../10-Architecture/bounded-context-map]] (both currently `draft`, pending
re-ratification). Follow them; do not duplicate their content here.

## Dependencies & tooling currency

Binding, **never optional**, for every library, framework or tool:

- **Latest stable, kept current.** Use the newest stable version and update
  regularly — for **features, future-proofing and security**. Running an outdated
  version is not a default; it is an exception that needs explicit Nico/HITL
  sign-off.
- **Docs-first, grounded.** Before adding *or upgrading* anything, read its
  **current** docs + best practices via **context7** and **Ref (ref.tools)** (plus
  Perplexity/Web where useful). Never assume an API, a default, or which version is
  "latest" — verify the real latest (release notes, `git ls-remote --tags`, the
  repo's default branch via `--symref HEAD`).
- **Pin exact, update deliberately.** Versions are pinned exactly (no floating
  `latest`/ranges) per
  [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]; currency comes
  from regular, reviewed bumps (Renovate), not from floating ranges.
- **HITL for staying behind or hard migrations.** Any reason to stay on an
  outdated version — or any upgrade/migration that cannot be done without **major
  complications** — is escalated to Nico (HITL) via the decision gate above. An
  agent **never** decides this alone; record the outcome (ADR / Decision-Log).

Approved MCP servers + research wiring: [[mcp-memory-integration]].

## Knowledge & traceability

- **One canonical truth per fact**; decisions and discussions are traceable;
  supersede instead of silently overwriting — rules in [[vault-governance]].
- **Decisions** are indexed in [[../00-Index/Decision-Log]] (ADRs) and
  [[../50-Game-Design/README]] (GDDRs); the vault is a knowledge graph, not a
  folder of essays (connectivity is mandatory).
- **Research is grounded and filed**: use **context7** + **Ref (ref.tools)** for
  library/tool docs, Perplexity / Web for the rest; raw transcripts under
  `60-Research/raw-perplexity/` (`status: raw`), synthesized into research notes.
  See § Dependencies & tooling currency above. MCP usage: [[mcp-memory-integration]].

## Global ↔ project split

- Cross-project principles live in the machine-global agent definitions
  (`~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`).
- This note is the Klubhaus Elf-specific, canonical expression. **Cursor has no
  machine-global file** and receives the same baseline via the repo `AGENTS.md`
  and `.cursor/rules/01-collaboration.mdc`, which point here.

## Related

- [[vault-governance]] — memory classes, canonical-location rule, supersede discipline
- [[agent-memory-protocol]] — session start / during / wrap-up steps
- [[../30-Implementation/agent-workflow-pattern]] — the beat loop and stop conditions
- [[../00-Index/Current-State]] — current phase and reopened decisions
- [[../00-Index/Decision-Log]] · [[../50-Game-Design/README]] — decision indexes
- [[mcp-memory-integration]] — approved MCP servers and research wiring
