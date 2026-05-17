---
name: vault-memory
description: Use the Obsidian docs vault as durable project memory. Use when starting substantial work, updating architecture/product/gameplay documentation, handling superseded approaches, or writing agent handoffs.
---

# Vault Memory

## Start Work

1. Read `docs/00-Index/Agent-Onboarding.md`.
2. Read `docs/00-Index/Current-State.md`.
3. Read the relevant map from `docs/00-Index/`.
4. Read accepted ADRs and approved game design or feature specs for the task.
5. Read the latest relevant handoff in `docs/90-Meta/session-handoffs/`.

## Choose Authority

- Use `current`, `accepted`, and `approved` notes for implementation.
- Treat `draft` notes as planning context only.
- Treat `superseded` and `archived` notes as historical context only.
- User docs explain shipped behavior for players; do not use them as implementation specs.

## Update Memory

Update the vault when work changes architecture, product scope, gameplay,
operations, user-facing behavior, or reusable agent knowledge.

When replacing an approach:

1. Update or create the new current note.
2. Mark the old note `status: superseded`.
3. Add `superseded_by` on the old note and `supersedes` on the new note.
4. Update `docs/00-Index/Current-State.md` and any relevant map.

## Wrap Up

For substantial work, write a handoff under `docs/90-Meta/session-handoffs/`
and list final vault paths in Linear or the PR when applicable.
