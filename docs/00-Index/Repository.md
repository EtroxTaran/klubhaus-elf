---
title: Repository & Onboarding Docs
status: draft
tags: [meta]
updated: 2026-05-17
---

# Repository & Onboarding Docs

These files live at the repository root (outside the vault) but are part of
the project's documentation. They are mirrored into this wiki at build time so
nothing is missing for someone reading only the site.

- [[Repository-README]] — project overview & quick start (`README.md`).
- [[Contributing]] — how to contribute, branch/PR conventions (`CONTRIBUTING.md`).
- [[Agent-Guide]] — AI coding-agent rules & architecture guardrails (`AGENTS.md`).
- [[Claude-Guide]] — Claude Code project instructions (`CLAUDE.md`).

> The build mirrors the **current** root files; the repo copies are
> authoritative if they ever differ.

The external design hand-off (`design/handoff/<date>/`) is a **historical
snapshot** — the code and [[../10-Architecture/09-Design-System]] win on any
conflict, so it is intentionally *not* mirrored as wiki pages. See
[[../30-Implementation/design-sync-workflow]] for how it is consumed.
