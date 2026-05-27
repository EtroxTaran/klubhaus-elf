---
title: Manager Archetype Roguelite - Research Synthesis 2026-05-27
status: draft
tags: [research, roguelite, meta-progression, manager, archetype, fmx-16]
created: 2026-05-27
updated: 2026-05-27
type: research
binding: false
linear: FMX-16
sourceType: external
related:
  - [[raw-perplexity/raw-roguelite-meta-progression]]
  - [[incoming-design-research-2026-05-27]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/mode-create-a-club-roguelite]]
  - [[late-game-systems]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
---

# Manager Archetype Roguelite - Research Synthesis 2026-05-27

## Question

How should the raw report "The Management Roguelite: Evolution of the
Manager-Archetype Design" be promoted into FMX planning without fixing too much
before playtests?

## Status

This note is a sourced synthesis for FMX-16. It sits between the lossless raw
input and the draft decision layer:

`raw report -> this synthesis -> GDDR -> ADR/contracts -> future implementation`

It is **not binding**. It records Nico's current direction and the research basis
for the draft notes created in the same beat.

## Nico Direction Captured

- The topic is **MVP-relevant**, but only as hooks: run analysis, style signals
  and a post-run reflection contract. Full perks, legacy unlocks and
  cross-save progression remain after the first playable.
- The manager identity model should be **emergent hybrid**: the player may pick
  a starting profile, but the real archetype is distilled from behaviour across
  runs.
- The domain owner should be proposed as a new **Manager & Legacy** bounded
  context, not hidden inside League or Identity.
- Perks may use a **balance corridor**: small numeric effects are allowed only
  with caps, test criteria and a prestige/challenge counterweight.
- Unlock progress should be **reflected, not grinded**: no in-run checklist of
  thresholds; post-run surfaces explain the style the player actually expressed.
- All concrete tuning remains **playtest-tunable**: thresholds, field lists,
  perk strength, taxonomy, naming and UI emphasis may change during development.

## External Source Check

The raw report's central principle is strong: meta-progression should increase
meaning, variety and identity rather than simply making the player stronger.
The current market and roguelite references support that direction, but also
show why FMX should not lock its taxonomy too early.

| Source | What it supports | FMX implication |
|---|---|---|
| EA SPORTS FC 26 Career Mode | Manager Live Challenges add rotating scenarios; EA's pitch notes also stress manager identity and archetype-style player progression. | Career variety is market-visible, but FC separates challenge content and archetypes. FMX can differentiate by deriving manager identity from behaviour across roguelite runs. |
| Against the Storm Citadel / Upgrades | A run-based management game can use a persistent meta layer around upgrades, deeds and a home hub. | Persistent progress should unlock options, systems and identity anchors rather than only raw output. |
| Hades Mirror of Night + Pact of Punishment | Permanent progress can coexist with a customizable challenge counterweight. | Any stronger FMX perk needs a prestige/ascension counterpart so replayability rises with mastery. |
| Slay the Spire Ascension | Difficulty can scale through cumulative negative modifiers after successful runs. | FMX prestige levels should be first-class, not a late balance patch. |
| Darkest Dungeon II Altar of Hope | Run-end meta-progression is a ritualized reflection point. | FMX should make run-end feel like a chapter close: highlights, style diagnosis, what survives, what changes next. |

## Promotion Targets

### Game design

Create [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] as
the decision record for:

- club = run asset, manager = persistent identity;
- emergent manager archetypes;
- post-run style reflection;
- playtest-tunable taxonomy and thresholds;
- balance corridor plus mandatory prestige counterweight;
- SP-first meta progression and MP-normalised behaviour.

### MVP feature planning

Amend [[../20-Features/feature-roguelite-mvp-first-playable]] and
[[../50-Game-Design/mode-create-a-club-roguelite]] with **hooks only**:

- the run end emits/records enough facts for later style analysis;
- the post-run UI can show a first reflection of what happened;
- the player is not promised final perks or a fixed archetype taxonomy in MVP.

### Architecture

Create [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] as
a draft architecture proposal:

- Manager & Legacy owns manager identity, run analysis, style signals,
  archetype candidates, legacy setup and prestige selection.
- It consumes public domain events/read models from League, Club Management,
  Match, Transfer, Squad & Player and Training.
- Cross-save meta is read at save creation only. A running save must not read
  changing global meta state, preserving determinism.

## Playtest Change Policy

The system must be designed for change:

- **Tunable without new decision:** thresholds, weights, labels, candidate names,
  per-signal confidence, post-run copy, perk caps and prestige modifier values.
- **Needs Nico decision / GDDR or ADR update:** changing MVP scope, removing the
  prestige counterweight, changing the domain owner, allowing runtime cross-save
  meta reads, exposing grind checklists, or adding competitive MP advantages.
- **Evidence expected:** each meaningful tuning change should record the
  observed playtest problem, the change, and the expected player-behaviour
  effect.

## Taxonomy Stance

Do **not** lock a fixed list of archetypes yet. Three planning options remain:

| Option | Strength | Risk |
|---|---|---|
| Existing 5 talent-tree families | Reuses late-game systems; easy to explain. | Too narrow for economy, club-building and run-style identity. |
| 6 football-manager families | Covers Tactics, Motivation, Youth, Transfer, Finance and Infrastructure. | Looks complete too early and may bias playtests toward our first guess. |
| Dynamic style-tag composition | Maximizes replayability and lets archetype names emerge from data. | Needs stronger post-run explanation and later content work. |

Current recommendation: use **dynamic style tags** in MVP hooks, then derive
named archetype families after playtests show which styles players actually
repeat.

## Open Decisions

- Final archetype family list and naming.
- Exact run-analysis fields and aggregation windows.
- Perk caps and allowed numeric effect range.
- Prestige ladder shape and minimum viable modifiers.
- How much post-run reflection is shown in the first playable.
- Whether future Challenge/Prestige runs can unlock cosmetic identity in async
  groups.

## Source Links

- EA SPORTS FC 26 Career Mode:
  <https://www.ea.com/en/games/ea-sports-fc/fc-26/features/fc-26-career-mode>
- EA SPORTS FC 26 Career Mode Deep Dive:
  <https://www.ea.com/games/ea-sports-fc/fc-26/news/pitch-notes-fc26-career-mode-deep-dive>
- Against the Storm Citadel:
  <https://wiki.hoodedhorse.com/Against_the_Storm/Citadel>
- Against the Storm Upgrades:
  <https://wiki.hoodedhorse.com/Against_the_Storm/Upgrades>
- Hades Mirror of Night:
  <https://hades.fandom.com/wiki/Mirror_of_Night>
- Hades Pact of Punishment:
  <https://hades.fandom.com/wiki/Pact_of_Punishment>
- Slay the Spire Ascension:
  <https://slay-the-spire.fandom.com/wiki/Ascension>
- Darkest Dungeon II locations / Altar of Hope:
  <https://darkestdungeon.wiki.gg/wiki/Locations_(Darkest_Dungeon_II)>

## Related

- Raw input: [[raw-perplexity/raw-roguelite-meta-progression]]
- Triage: [[incoming-design-research-2026-05-27]]
- Game design: [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] ·
  [[../50-Game-Design/mode-create-a-club-roguelite]]
- Feature: [[../20-Features/feature-roguelite-mvp-first-playable]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
