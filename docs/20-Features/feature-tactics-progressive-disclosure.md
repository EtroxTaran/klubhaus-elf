---
title: Feature - Tactics with Progressive Disclosure
status: draft
tags: [feature, tactics, ux, progressive-disclosure]
created: 2026-05-16
updated: 2026-05-16
type: feature
binding: false
related: [[README]], [[../50-Game-Design/progressive-disclosure-ui]], [[../50-Game-Design/tactics-system]], [[../60-Research/progressive-disclosure-research]]
---

# Feature - Tactics with Progressive Disclosure

## Goal

One simulation core, three operating tiers (Quick / Standard / Expert),
so a 5-min/week casual user and a 25-min/week power user can both
manage the same match engine.

## User stories

- As a casual I pick a formation, see recommended XI, accept Auto-Coach
  and move on.
- As a Standard user I edit roles + duties + mentality + pressing.
- As an Expert I edit per-player instructions, set-piece variants, view
  pass networks and heat-maps.

## In scope (MVP)

- Three explicit UI tiers, switchable in user settings.
- Auto-Coach proposes-only, never overwrites manual choices.
- Tier-aware match reports.
- Player attribute view: stars (Quick), star + role-fit + arrows
  (Standard), full 1-10 + traits (Expert).

## Out of scope (MVP)

- Per-area tier override (Standard with Expert tactics only) - Phase 2.
- 1-20 attribute parity mode (post-MVP).

## Acceptance

- Tier switching preserves underlying tactical state.
- Auto-Coach proposals do not overwrite manual edits.
- All three tiers consume the same event log from the match engine.

## Dependencies

- [[../50-Game-Design/tactics-system]]
- [[../50-Game-Design/match-engine]]
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
