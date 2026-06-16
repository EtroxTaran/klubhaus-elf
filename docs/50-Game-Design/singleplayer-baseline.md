---
title: Singleplayer Baseline
status: draft
tags: [game-design, mode, singleplayer, baseline]
created: 2026-05-16
updated: 2026-06-16
type: game-design
binding: false
related: [[README]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/mode-design-research]], [[../60-Research/match-engine-runtime-strategy]], [[mode-create-a-club-roguelite]], [[mode-manage-a-club-career]], [[match-engine]], [[async-multiplayer-private-group]]
---

# Singleplayer Baseline

> **Status note (2026-06-11, FMX-143):** This system/mode note is `status: draft` — it was
> reopened 2026-05-27 and was **not** among the 133 decisions ratified in the 2026-06-08
> sweep (#153). "Approved" wording below is **pre-reopen history**, not a current status
> claim; the product rules described here await individual re-approval (decided by Nico,
> 2026-06-11: keep `draft`, re-approval is a later HITL pass — see
> [[../40-Execution/ratification-status-inventory-2026-06-11|status inventory]]). Frontmatter
> is the status SSOT per
> [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]].
> The ratified GDDR layer ([[README|Game Design Hub]]) may cover the same system — the GDDR
> is then the binding record.

Singleplayer is the **full reference experience**, not the lite mode.
Multiplayer rules are derived from singleplayer by *adding* constraints
(deadlines, defaults, no-mid-week-mode-switches). Approved at the product
level.

FMX-189 clarifies that "derived" means rules/system concepts are reused, not
that singleplayer state carries into multiplayer. Singleplayer, hotseat and
imported/local saves are never multiplayer-eligible.

> MVP sequencing note: this remains the long-term reference experience. The MVP
> is a narrower [[mode-create-a-club-roguelite]] first playable per
> [[GD-0017-mvp-scope-and-mode-sequencing]] and [[../00-Index/MVP-Scope]].

## 1. Approved product rule

> **Singleplayer is the baseline. Every system that ships, ships first in
> singleplayer. Multiplayer rule sets are additive constraints on top of
> singleplayer, not separate code paths.**

## 2. Baseline guarantees

In the long-term singleplayer baseline:

- Both content modes are fully available after their rollout
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
  These imports are singleplayer/local authority only; they cannot seed MP.

## 6. Compute model

Long-term per [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]],
[[match-engine]] and [[../60-Research/match-engine-runtime-strategy]]:

- Match engine runs in a Web Worker.
- League AI tick runs in batch in background.
- UI thread never blocks on simulation.
- The active human match uses `interactive-standard` or `competitive-full`
  quality depending on device tier and settings.
- Background fixtures use `background-detailed` or `background-fast`; a full
  matchday never simulates every fixture at the deepest profile.
- Singleplayer can become local-authoritative in a later selective-offline
  phase. MVP progression is server-confirmed; server-side match workers and
  Rust extraction remain later scaling/extraction concerns.

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

## 9. Future-scope notes (classified future-scope)

- Should singleplayer support "challenge runs" (constraint-based)? Yes -
  modelled as scenario packs.
- Cross-save persistence (e.g. a player from a previous singleplayer save
  appears in a new save's transfer market)? Out of scope at MVP.
