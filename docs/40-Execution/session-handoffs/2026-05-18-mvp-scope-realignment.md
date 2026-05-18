---
title: Handoff - MVP Scope Realignment
status: current
tags: [handoff, mvp, scope, offline-ready, roguelite]
created: 2026-05-18
updated: 2026-05-18
type: handoff
binding: false
related: [[../../00-Index/MVP-Scope]], [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]], [[../../20-Features/feature-roguelite-mvp-first-playable]]
---

# Handoff: MVP Scope Realignment (2026-05-18)

## Linear

- Issue: none linked in this session.

## Done this session

- Added canonical [[../../00-Index/MVP-Scope]].
- Added binding research synthesis
  [[../../60-Research/offline-mvp-scope-and-sync-strategy]].
- Added accepted [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  and superseded ADR-0002 for MVP scope.
- Added approved [[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]].
- Added approved MVP feature slice
  [[../../20-Features/feature-roguelite-mvp-first-playable]].
- Updated architecture, arc42, implementation, game-design, feature, map and
  orchestrator docs for:
  - hybrid-online / offline-ready MVP;
  - Create-a-Club Roguelite first playable;
  - Manage-a-Club Career visible as "comes later";
  - export/import post-MVP but reserved by save envelope/versioning; and
  - future selective offline-first singleplayer without blocking architecture.

## Open / next step

- Implementation beats should start from
  [[../../20-Features/feature-roguelite-mvp-first-playable]].
- When first save/export implementation begins, use
  [[../../10-Architecture/09-Decisions/ADR-0005-save-format]] as the reserved
  envelope/versioning contract and [[../../30-Implementation/hybrid-online-pwa-strategy]]
  as MVP staging guidance.
- Consider a follow-up cleanup beat for the pre-existing vault-wide
  `docs:check` failures in `wave-3-gap-analysis`, Repository links and older
  supersession frontmatter.

## Blockers

- No product decision blocker remains for this scope change.
- `pnpm docs:check` still fails on 88 pre-existing vault issues unrelated to
  this realignment.

## Changed vault paths

- [[../../00-Index/MVP-Scope]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Project-Goals]]
- [[../../00-Index/Vision]]
- [[../../00-Index/Non-Goals]]
- [[../../00-Index/Home]]
- [[../../00-Index/Architecture-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../00-Index/Feature-Map]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Implementation-Map]]
- [[../../00-Index/Decision-Log]]
- [[../../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../../10-Architecture/09-Decisions/ADR-0002-offline-first]]
- [[../../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../../10-Architecture/09-Decisions/ADR-0005-save-format]]
- [[../../30-Implementation/hybrid-online-pwa-strategy]]
- [[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
- [[../../20-Features/feature-roguelite-mvp-first-playable]]
- [[../../60-Research/offline-mvp-scope-and-sync-strategy]]

## Needs promotion

- None. The scope change was promoted into current/accepted/approved notes in
  this session.
