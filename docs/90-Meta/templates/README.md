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

- [agent-handoff.md](agent-handoff.md)
- [adr.md](adr.md)
- [daily-session-note.md](daily-session-note.md)
- [feature-spec.md](feature-spec.md)
- [game-design-note.md](game-design-note.md)
- [game-design.md](game-design.md)
- [handoff.md](handoff.md)
- [implementation-note.md](implementation-note.md)
- [module.md](module.md)
- [open-question.md](open-question.md)
- [research-note.md](research-note.md)

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
- Features: `idea`, `draft`, `spec`, `in-progress`, `done`, `cancelled`, `superseded`.
- Architecture / implementation / module / state-machine notes: `draft`,
  `current`, `superseded`, `archived`.
- Research notes: `draft`, `in-review`, `review`, `ready`, `current`, `raw`,
  `mitigated`, `verified`, `accepted-risk`, `superseded`, `archived`.
- Raw research notes: `raw`, `archived`.
- Open questions: `draft`, `current`, `answered`, `archived`.
- User docs: `draft`, `published`, `outdated`, `archived`.
- Session / handoff notes: `open`, `wrapped`, `promoted`, `archived`.
- Meta / index / map / baseline / protocol / project / product / registry notes:
  `draft`, `current`, `superseded`, `archived`.
