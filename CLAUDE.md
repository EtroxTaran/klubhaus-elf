# CLAUDE.md

Read **AGENTS.md** — it is the authoritative project context for all agents.

For durable project memory, follow the vault entry chain:

1. [docs/00-Index/Agent-Onboarding.md](docs/00-Index/Agent-Onboarding.md)
2. [docs/00-Index/Current-State.md](docs/00-Index/Current-State.md)
3. [docs/90-Meta/collaboration-and-decision-protocol.md](docs/90-Meta/collaboration-and-decision-protocol.md)
4. [docs/00-Index/Home.md](docs/00-Index/Home.md)
5. [docs/90-Meta/agent-memory-protocol.md](docs/90-Meta/agent-memory-protocol.md)
6. [docs/90-Meta/vault-governance.md](docs/90-Meta/vault-governance.md)

Current phase: **research / analysis / architecture planning — no development**
(all ADRs/GDDRs reopened to `draft`). Roles, the ask-first decision gate, and the
phase are defined in `docs/90-Meta/collaboration-and-decision-protocol.md`. The
full rule set is in AGENTS.md.

Use the global CLI rules when they are loaded: no silent fallback when Nico names
a tool, targeted questions after reading the vault/docs, Keep It Simple,
proportional DDD, baseline security and no speculative backup/DR, HA,
zero-downtime or enterprise machinery without Nicos prior decision. This repo
remains planning-only until Nico changes the phase.
