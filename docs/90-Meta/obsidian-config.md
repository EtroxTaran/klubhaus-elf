---
title: Obsidian Config
status: current
tags: [meta]
created: 2026-05-17
updated: 2026-05-27
type: protocol
binding: false
related:
  - [[README]]
  - [[vault-governance]]
---

# Obsidian Config

Use the `docs/` directory as the vault. Keep private plugins and local workspace
state out of Git.

## Viewing the vault

### Option A — Obsidian desktop app

1. Open Obsidian.
2. "Open folder as vault" → select this repository's `docs/` directory.
3. `docs/.obsidian/app.json` is auto-detected. No build step. Start at
   `00-Index/Home.md`.

### Option B — Browser preview (no Obsidian required)

```bash
pnpm docs:preview
```

Serves the vault at <http://localhost:8080> via Quartz v4 (wikilinks,
frontmatter and graph view supported). First run clones Quartz into a
gitignored, vendored checkout; details in `tools/docs-preview/README.md`.

## Graph hygiene

The `90-Meta/github-issue-suite/` notes and `95-Archive/` are archival,
non-canonical history. They are kept as traceability but filtered out of the
graph view so they do not pollute the active knowledge web.

Apply this filter in **Graph view → Filters → Search** (Obsidian desktop) — the
local graph on any note already excludes them via the same string:

```
-path:"90-Meta/github-issue-suite" -path:"90-Meta/templates" -path:"95-Archive"
```

This drops archival mirrors, frozen historical notes and templates so the graph
shows the active connected knowledge web. Connectivity expectations for content
notes are defined in [[vault-governance]] § Knowledge connectivity.
## Related

- [[README]]
- [[vault-governance]]
