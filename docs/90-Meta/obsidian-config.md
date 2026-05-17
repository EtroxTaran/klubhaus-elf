---
title: Obsidian Config
status: draft
tags: [meta]
updated: 2026-05-17
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

The `90-Meta/github-issue-suite/` notes are archival, non-canonical issue
mirrors (~33 unlinked files). They are **kept in the build** (a few canonical
notes legitimately link D-001/D-002), but filtered out of the *graph view* so
they don't pollute it.

Apply this filter in **Graph view → Filters → Search** (Obsidian desktop) — the
local graph on any note already excludes them via the same string:

```
-path:"90-Meta/github-issue-suite" -path:"90-Meta/templates"
```

This drops the archival mirrors and the empty templates so the graph shows the
real, connected knowledge web. Connectivity expectations for content notes are
defined in [[vault-governance]] § Knowledge connectivity.
