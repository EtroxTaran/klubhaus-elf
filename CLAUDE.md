# CLAUDE.md

Read **AGENTS.md** — it is the authoritative project context for all agents.

For durable project memory, follow the vault entry chain:

1. [docs/00-Index/Agent-Onboarding.md](docs/00-Index/Agent-Onboarding.md)
2. [docs/00-Index/Current-State.md](docs/00-Index/Current-State.md)
3. [docs/00-Index/Home.md](docs/00-Index/Home.md)
4. [docs/90-Meta/agent-memory-protocol.md](docs/90-Meta/agent-memory-protocol.md)
5. [docs/90-Meta/vault-governance.md](docs/90-Meta/vault-governance.md)

UI work specifically: read `docs/10-Architecture/09-Design-System.md` and use
the Storybook showcase as the visual reference *before* changing any UI; keep
every component's colocated `*.stories.tsx` current. A new claude.ai/design
export is synced via `pnpm sync:design <url>` — never reimplement a design by
eye. Details and the full rule set are in AGENTS.md.
