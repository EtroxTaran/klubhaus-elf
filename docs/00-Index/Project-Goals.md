---
title: Project Goals
status: current
tags: [product, meta]
created: 2026-05-16
updated: 2026-05-18
type: project
binding: true
related: [[Current-State]], [[MVP-Scope]], [[Glossary]]
---

# Project Goals

## Mission

Build an offline-ready, IP-clean football manager PWA that captures the season
rhythm, management depth, and approachable charm of classic German football
manager games. The MVP proves the Create-a-Club Roguelite loop as a
hybrid-online first playable; selective offline-first singleplayer is a planned
future capability.

## Product Boundaries

- Create-a-Club Roguelite first playable before the classical career campaign.
- Hybrid-online MVP before full offline-first domain sync.
- Selective offline-first singleplayer, export/import and Manage-a-Club Career
  must remain architecturally reserved from day one.
- Browser persistence belongs in IndexedDB via Dexie, not localStorage.
- Club, league, player, stadium, and asset names must be fictional and IP-clean.
- German is the primary UI language; English resources stay ready for post-MVP.

## Milestones

1. M0 Bootstrap and CI.
2. M1 Research and Architecture.
3. M2 Roguelite first playable foundation.
4. M3 Match Engine v1.
5. M4 League System and Schedule.
6. M5 Squad and Player Attributes.
7. M6 Training and Transfer foundations.
8. M7 Finance, Stadium and run-risk feedback.
9. M8 Youth Academy and deeper long-run systems.

## Source Links

- [../../product/mission.md](../../product/mission.md)
- [../../product/roadmap.md](../../product/roadmap.md)
- [../../product/tech-stack.md](../../product/tech-stack.md)
