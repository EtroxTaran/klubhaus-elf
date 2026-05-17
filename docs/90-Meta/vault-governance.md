---
title: Vault Governance
status: current
tags: [meta, vault, governance]
created: 2026-05-16
updated: 2026-05-16
type: governance
binding: true
---

# Vault Governance

`docs/` is the Obsidian vault and the durable project memory for `soccer-manager`.
It must work as plain Markdown, in Obsidian, and in webview-style renderers.

## Source Of Truth

When sources disagree, use this order:

1. Code and tests describe shipped behavior.
2. Accepted ADRs describe binding architecture decisions.
3. Current feature, game design, and implementation notes describe intended behavior.
4. Research notes preserve sourced inputs, assumptions, and options.
5. Linear tracks operational work; durable outcomes must be written back to the vault.
6. Chat transcripts and session notes are not authoritative unless promoted into a current vault note.

## Status Model

- `current`: active project guidance agents should use.
- `accepted`: binding architecture decision, normally an ADR.
- `approved`: binding product, gameplay, or feature decision.
- `draft`: not binding unless the user explicitly asks to plan from it.
- `superseded`: historical only. Do not implement from it.
- `archived`: retained history, not active guidance.

## Temporal Rules

Every note that changes an approach must make time and replacement clear:

- Add or update `created`, `updated`, and, when useful, `valid_from`.
- Mark the old note `status: superseded`.
- Add `superseded_by` to the old note and `supersedes` to the replacement.
- Put a visible note near the top of superseded content:
  `> Superseded by: replacement note. Historical context only.`
- Update [../00-Index/Current-State.md](../00-Index/Current-State.md) and relevant maps so agents reach the replacement first.

## Obsidian And Webview Rules

- Notes must be readable without private plugins or local workspace state.
- Critical context cannot depend on Dataview, Local REST API, or any plugin.
- Wikilinks are preferred for Obsidian navigation.
- Relative Markdown links are allowed when they improve webview rendering.
- High-traffic notes should include a short summary and outgoing links.

## Maintenance

- Review the vault weekly or at milestone boundaries.
- Review orphan notes monthly; link useful notes or mark them `archived`.
- Merge duplicate tags and keep frontmatter aligned with templates.
- Promote repeated agent learnings into rules, skills, ADRs, or implementation notes.
- Keep Linear issues linked to final vault paths.
