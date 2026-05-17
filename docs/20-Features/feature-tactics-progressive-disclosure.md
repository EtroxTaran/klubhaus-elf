---
title: Feature - Tactics with Progressive Disclosure
status: draft
tags: [feature, tactics, ux, progressive-disclosure]
created: 2026-05-16
updated: 2026-05-17
type: feature
binding: false
related: [[README]], [[../50-Game-Design/progressive-disclosure-ui]], [[../50-Game-Design/tactics-system]], [[../60-Research/progressive-disclosure-research]], [[../60-Research/player-strength-presentation]]
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
- Player strength view: qualitative Impact bands (Quick), Role Impact +
  category bars + status icons (Standard), full 1-20 visible attributes +
  Impact formula breakdown + traits (Expert).
- No global OVR or universal player star is shown in squad, tactic, scouting
  or transfer lists.

## Out of scope (MVP)

- Per-area tier override (Standard with Expert tactics only) - Phase 2.
- Exact role-weight tuning for all 50 roles beyond the MVP seed table.

## Acceptance

- Tier switching preserves underlying tactical state.
- Auto-Coach proposals do not overwrite manual edits.
- All three tiers consume the same event log from the match engine.
- Every player recommendation has a role / tactic context and can be explained
  without revealing unearned hidden attributes.

## Dependencies

- [[../50-Game-Design/tactics-system]]
- [[../50-Game-Design/match-engine]]
- [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
