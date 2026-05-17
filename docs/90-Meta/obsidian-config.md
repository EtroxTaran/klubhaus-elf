---
title: Obsidian Config
status: current
tags: [meta]
created: 2026-05-15
updated: 2026-05-16
type: configuration
binding: true
---

# Obsidian Config

Use the `docs/` directory as the Obsidian vault. The vault must also stay useful
as plain Markdown and in webview-style renderers.

## Shared Config

- Commit only minimal, safe Obsidian configuration.
- Keep private plugins, workspace state, local cache, API keys, and local REST
  tokens out of Git.
- Do not require Dataview, Local REST API, or any plugin to reveal critical
  current-state context.

## Navigation

- Start at [[../00-Index/Home]].
- Agents start at [[../00-Index/Agent-Onboarding]].
- Current project guidance lives at [[../00-Index/Current-State]].
- Maps should use readable headings, short summaries, and explicit outgoing links.

## Optional Local Enhancements

- Dataview may be used locally for status and tag queries.
- Obsidian Local REST API may be used locally for authenticated vault search,
  active-file access, and heading/frontmatter patching.
- These tools are access layers only; the canonical content remains Markdown in
  `docs/`.
