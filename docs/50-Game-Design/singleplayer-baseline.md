---
title: Singleplayer Baseline
status: approved
tags: [game-design, mode, singleplayer, baseline]
created: 2026-05-16
updated: 2026-05-16
type: game-design
binding: true
related: [[README]], [[../60-Research/mode-design-research]], [[mode-create-a-club-roguelite]], [[mode-manage-a-club-career]], [[async-multiplayer-private-group]]
---

# Singleplayer Baseline

Singleplayer is the **full reference experience**, not the lite mode.
Multiplayer rules are derived from singleplayer by *adding* constraints
(deadlines, defaults, no-mid-week-mode-switches). Approved at the product
level.

## 1. Approved product rule

> **Singleplayer is the baseline. Every system that ships, ships first in
> singleplayer. Multiplayer rule sets are additive constraints on top of
> singleplayer, not separate code paths.**

## 2. Baseline guarantees

In singleplayer:

- Both content modes are fully available
  ([[mode-create-a-club-roguelite]] and [[mode-manage-a-club-career]]).
- All sub-systems are fully exposed.
- The game is **fully pausable** and **accelerable** (1×, 2×, 4×,
  match-only mode).
- All actions are **delegable** to assistants where the player chooses.
- The user can **save at any moment**.
- **Multiple parallel saves** are supported.
- Cheat modes are not supported (per safety rules), but **scenario packs**
  ([[community-editor-and-datasets]]) provide pre-canned starting points.

## 3. UI tier

Singleplayer respects all three UI tiers
([[progressive-disclosure-ui]]). The choice is per-user, persistent.

## 4. Assistant automation

Routine tasks can be automated:

| Task | Assistant role |
|---|---|
| Training plan | Auto-build per current squad + tactic |
| Team talks | Auto-pick based on context |
| Media | Auto-answer with neutral, no-controversy stance |
| Press conferences | Auto-attend with neutral answers |
| Scouting | Auto-deploy per Chief Scout's recommendation |
| Match-day line-up | Auto-pick best XI |
| Set pieces | Auto-assign takers + variants |
| Substitutions | Auto-rotate or auto-reactive |

The player can override every assistant decision. Assistant **never**
overrides a manual decision.

## 5. Save model

Per [[../10-Architecture/09-Decisions/ADR-0005-save-format]]:

- IndexedDB via Dexie.
- Multiple slots per profile.
- Each save is self-contained (game-version + dataset version included).
- Export / import as a single JSON file (with version migration on import).

## 6. Compute model

Per [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] and
[[../60-Research/research-wave-2-gaps]] R2-09:

- Match engine runs in a Web Worker.
- League AI tick runs in batch in background.
- UI thread never blocks on simulation.

## 7. Time and pacing

In singleplayer the player chooses pacing:

- **Pause**: any time.
- **Step day**: explicit "advance" button.
- **Auto-advance**: until next event flagged "needs decision".
- **Match-only mode**: collapse weeks to matches only.

This is intentionally *the opposite* of async multiplayer, which is server-
paced.

## 8. Singleplayer-only features

Features that *only* exist in singleplayer (because they don't make sense
in async groups):

- Time travel (rewind one season, accept consequences).
- Scenario import (start from a community-authored scenario pack).
- Cheat-adjacent toggles like "no insolvency" (renamed: "casual finance
  mode") - explicit opt-in, not default.

## 9. Open questions

- Should singleplayer support "challenge runs" (constraint-based)? Yes -
  modelled as scenario packs.
- Cross-save persistence (e.g. a player from a previous singleplayer save
  appears in a new save's transfer market)? Out of scope at MVP.
