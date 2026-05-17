---
title: Vault Templates
status: current
tags: [meta, templates]
created: 2026-05-16
updated: 2026-05-16
type: index
binding: true
related: [[../vault-governance]]
---

# Vault Templates

Use these templates for new vault notes. Keep frontmatter consistent so agents,
Obsidian, Dataview, and docs checks can identify current guidance.

## Active Templates

- [linear-issue.md](linear-issue.md)
- [linear-issue-examples.md](linear-issue-examples.md)
- [handoff.md](handoff.md)
- [adr.md](adr.md)
- [game-design.md](game-design.md)
- [module.md](module.md)

## Common Fields

- `title`: human-readable note title.
- `status`: controlled status for the note type.
- `tags`: broad categories.
- `created`: first creation date, `YYYY-MM-DD`.
- `updated`: last meaningful update date, `YYYY-MM-DD`.
- `type`: note type, such as `adr`, `feature`, `research`, `game-design`.
- `binding`: `true` only when agents may treat the note as authoritative.
- `related`: wiki links to relevant notes.
- `supersedes`: note this one replaces, when applicable.
- `superseded_by`: replacement note, when applicable.

## Statuses

- ADRs: `draft`, `accepted`, `superseded`.
- Game design: `idea`, `draft`, `approved`, `superseded`.
- Features: `idea`, `spec`, `in-progress`, `done`, `cancelled`, `superseded`.
- User docs: `draft`, `published`, `outdated`, `archived`.
- Session notes: `open`, `wrapped`, `promoted`, `archived`.
- Meta/index notes: `draft`, `current`, `superseded`, `archived`.
