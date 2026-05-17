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
