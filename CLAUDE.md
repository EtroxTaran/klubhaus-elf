# CLAUDE.md

Read **AGENTS.md** — it is the authoritative project context for all agents.

UI work specifically: read `docs/10-Architecture/09-Design-System.md` and use
the Storybook showcase as the visual reference *before* changing any UI; keep
every component's colocated `*.stories.tsx` current. A new claude.ai/design
export is synced via `pnpm sync:design <url>` — never reimplement a design by
eye. Details and the full rule set are in AGENTS.md.
