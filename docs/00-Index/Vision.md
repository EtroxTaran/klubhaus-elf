---
title: Vision
status: current
tags: [context, vision]
created: 2026-05-17
updated: 2026-05-27
type: index
binding: true
related:
  - [[Non-Goals]]
  - [[MVP-Scope]]
---

# Vision

`football-manager-x` is an offline-ready football management PWA in the Anstoß
tradition: roguelite club-building first, long single-player careers later,
deterministic simulation, and IP-clean generated game data.

> The implementation path is reopened as of 2026-05-27; linked ADR/GDDR details
> are draft review inputs until re-ratified.

## Goals

- **Roguelite-first MVP** — Create-a-Club Roguelite proves the first playable;
  Manage-a-Club Career is visible as "comes later" ([[MVP-Scope]]).
- **Offline-ready now, selective offline-first later** — MVP has app shell,
  cached reads and local drafts; full local-authoritative singleplayer is a
  future stage ([[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]).
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
## Related

- [[Non-Goals]]
- [[MVP-Scope]]
