---
name: vault-memory
description: Repeatable vault start/update/wrap-up workflow. Use at the beginning of substantial work, when an approach changes, and before handing off a session, so every agent uses the docs/ vault memory the same way.
disable-model-invocation: true
---

# Vault Memory

## Goal

Use the `docs/` Obsidian vault as durable project memory consistently across
Claude Code, Cursor local, Cursor Cloud, and Bugbot.

## Source Of Truth

1. `docs/90-Meta/agent-memory-protocol.md` — canonical step-by-step.
2. `docs/90-Meta/vault-governance.md` — memory classes, supersede discipline,
   canonical-location rule, entry-point conformance table.
3. `docs/00-Index/Agent-Onboarding.md` — first read for every session.

This skill is an orchestrator. If it ever disagrees with the protocol or
governance note, the vault notes win — fix this skill in the same PR.

## Session Start

```md
Vault start checklist:
- [ ] Read docs/00-Index/Agent-Onboarding.md
- [ ] Read docs/00-Index/Current-State.md
- [ ] Read relevant maps from docs/00-Index/Home.md
- [ ] Read accepted ADRs / approved specs for the task
- [ ] Read the linked Linear issue when one exists
- [ ] Read the latest docs/40-Execution/session-handoffs/* if continuing a thread
```

## During Work

- Prefer `current` / `accepted` / `approved` notes. Never implement from
  `draft` / `superseded` / `archived`, old plans, issue mirrors, or chat.
- `draft`/`idea` = recognized intent layer: read for direction and to avoid
  re-deciding; do not implement from or cite as settled. `superseded`/
  `archived` = history only. See vault-governance § Draft / idea layer.
- One canonical location per fact; do not duplicate vault content into config.
- Load the minimum depth the task needs (cold/warm/hot — see governance).

## Updating Memory (approach changed)

```md
Vault update checklist:
- [ ] Create/update the replacement note
- [ ] Set old note status: superseded
- [ ] Link superseded_by (old) and supersedes (new)
- [ ] Add a visible supersession banner on the old note
- [ ] Update docs/00-Index/Current-State.md and affected maps
- [ ] Same PR as the code change
```

## Session Wrap-Up

```md
Vault wrap-up checklist:
- [ ] Write/update docs/40-Execution/session-handoffs/YYYY-MM-DD-<slug>.md
      from docs/90-Meta/templates/handoff.md
- [ ] Record done / open / blockers / changed paths / needs-promotion
- [ ] Update docs/00-Index/Current-State.md
- [ ] Post final vault paths on the Linear issue when one exists
```

## Anti-Patterns

- Implementing from a `draft` ADR.
- Editing config/README instead of the canonical vault note.
- Silently overwriting an accepted note instead of superseding it.
- Ending a substantial session with no handoff or stale Current-State.
- "Reading the whole vault" instead of the task-relevant slice.
