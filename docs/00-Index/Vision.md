---
title: Vision
status: current
tags: [context, vision]
created: 2026-05-17
updated: 2026-05-17
type: index
binding: true
related: [[Non-Goals]]
---

# Vision

`soccer-manager` is an offline-first football management PWA in the Anstoß
tradition: long single-player careers, deterministic simulation, and IP-clean
generated game data.

## Goals

- **Offline-first** — full gameplay with no network; local saves
  ([[../10-Architecture/09-Decisions/ADR-0002-offline-first]]).
- **Long careers** — multi-season play with versioned, forward-migrating saves
  ([[../10-Architecture/09-Decisions/ADR-0005-save-format]]).
- **Deterministic simulation** — reproducible, testable match core
  ([[../10-Architecture/09-Decisions/ADR-0003-match-engine]]).
- **IP-clean** — fictional names/assets, real league structure only
  ([[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).
- **Mobile-first** — inbox-driven boss loop
  ([[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]).
- **Agent-built** — most work by Cloud Agents under a strict CI gate
  ([[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]]).

See [[Non-Goals]] for explicit exclusions.
