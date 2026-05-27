<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# AGENTS.md

This file is an orchestrator. Durable project facts live in the `docs/`
Obsidian vault; if this file disagrees with the vault, the vault wins.

## Current Phase

Repository reset: 2026-05-27. This repo is docs-vault-only; implementation was
removed. Current phase is research / analysis / architecture planning, with no
development. All ADRs/GDDRs are reopened to `draft` until Nico re-ratifies them.

Canonical phase, roles, and decision gate:
`docs/90-Meta/collaboration-and-decision-protocol.md`.

## Entry Chain

Read these first, in order:

1. `docs/00-Index/Agent-Onboarding.md`
2. `docs/00-Index/Current-State.md`
3. `docs/90-Meta/collaboration-and-decision-protocol.md`
4. `docs/00-Index/Home.md`
5. `docs/90-Meta/agent-memory-protocol.md`
6. `docs/90-Meta/vault-governance.md`

Use `.cursor/skills/vault-memory/SKILL.md` for the repeatable vault
start/update/wrap-up checklist when available.

## Working Rules

- Do not make technology, gameplay, architecture, data-model, API/contract,
  scope, or security/privacy decisions. Use the ask-first gate in the
  collaboration protocol.
- Keep `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*`, `.cursor/skills/*`,
  `.cursor/BUGBOT.md`, and `README.md` as pointers only; canonical content
  belongs in the vault.
- Validate vault changes with `pnpm docs:check`.
- Do not merge to `main`; open a PR when work is ready.

## Safety

Never read `.env*`, private keys, cloud credentials, `~/.ssh`, `~/.aws`, or
`secrets/`. Never run destructive infrastructure or Git commands such as
`rm -rf`, `git push --force`, `git reset --hard`, `sudo`, `terraform apply`,
`tofu apply`, `kubectl delete`, `aws s3 rm`, `curl | sh`, or `wget | sh`.
