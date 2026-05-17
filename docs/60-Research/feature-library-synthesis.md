---
title: Feature Library Synthesis Across Football Manager Products
status: in-review
tags: [research, competitors, features, synthesis, wave-2]
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related: [[competitor-matrix]], [[anstoss-series-deep-dive]], [[club-boss-analysis]], [[raw-perplexity/raw-feature-library]], [[../00-Index/Research-Map]]
---

# Feature Library Synthesis Across Football Manager Products

Phase 1 produced [[competitor-matrix]] (8 products), [[anstoss-series-deep-dive]]
and [[club-boss-analysis]]. Wave 2 (this note) adds three products that Wave 1
did not cover (Sports Interactive Football Manager in depth, ManagerZone, SOKKA,
Soccer Manager 2026) plus EA Fußball Manager / FIFA Manager history, and
consolidates the feature inventory the user collected through Perplexity into a
single source of design inspiration.

> Raw input: [[raw-perplexity/raw-feature-library]].
> IP rule: this note may cite competitor names for analysis; implementation
> follows [[ip-and-licensing]] and [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

## 1. What this note adds beyond Wave 1

| Topic | Wave 1 | Wave 2 |
|---|---|---|
| Anstoss design DNA | Done in [[anstoss-series-deep-dive]] | Confirmed - no overwrite |
| Club Boss | Done in [[club-boss-analysis]] | Confirmed - no overwrite |
| FM26 mobile + match engine | Light in [[competitor-matrix]] | Deep here: 30+ attributes, event-based engine, scouting + role taxonomy |
| EA Fußball Manager history | Mentioned | Detailed feature timeline (FM 02-13) |
| EA FC 26 Manager Live | Out | Covered (13 archetypes, weekly Live Challenges) |
| ManagerZone | Out | Covered (oldest async football MMO, stadium attractions, friendly leagues, ManagerZone World Cup) |
| SOKKA | Out | Covered (27-day seasons, one match per day, market economy) |
| Soccer Manager 2026 | Out | Covered (Manager Trait System, Match Motion Engine, criticism of P2W) |
| Roguelite carries pattern | Out | Imported from non-football roguelites (Nutmeg etc.) |

## 2. Genre map - design inspiration buckets

The combined product list naturally clusters into four buckets:

### Bucket A: Deep desktop simulations (FM26, Anstoss, EA FM, We Are Football)

Source of depth (30+ attributes, full economy, complex tactics). Use as
reference for feature ceiling but **not** for mobile UX.

### Bucket B: Stadium-economy classics (Anstoss 3, EA FM 07-12)

Source for the build-out system, on-grounds attractions
(Würstchenbude / Bierzelt / Fanzone), licensing-free naming and the
"office-as-cockpit" pacing.

### Bucket C: Mobile-first casual (Club Boss, Soccer Manager, Top Eleven, OSM)

Source for short-session UX, inbox-as-feed, star-rating shortcuts, and
the casual end of progressive disclosure.

### Bucket D: Async / online competitive (ManagerZone, SOKKA, FM Online)

Source for the async-multiplayer model, transfer market dynamics between
real managers and the friend-league framing.

The soccer-manager target is **the empty intersection of A + B + casual D**
with our own IP-clean fictional universe.

## 3. Distilled feature inventory (consolidation table)

A single inventory of every concrete mechanic referenced across the
products. Each line is a candidate for our own scope decisions (see
[[feature-gap-analysis]]).

### 3.1 Squad and attributes

- Skill scale **1-20** (FM) vs **1-13** (Anstoss 3) vs **stars 1-5** (mobile).
  We adopt 1-10 + 4 talent buckets per [[anstoss-series-deep-dive]] §7.
- Current Ability (CA) and Potential Ability (PA) with hidden range.
- Four attribute groups: technique, physical, mental, character. Plus
  goalkeeper-specific.
- Hidden attributes (injury proneness, professionalism, ambition).
- 8-12 personality traits / tendencies (FM "PPMs", Anstoss "character").

### 3.2 Tactics

- Free formations + 5-10 roles per position.
- Duties (attack / support / defend).
- Team mentality slider.
- In/Out-of-possession instructions (pressing trigger / intensity, tempo,
  width, defensive line).
- Dedicated set-piece coach (FM24+).
- Individual instructions overriding role defaults.
- Tactical familiarity over training + minutes.

### 3.3 Match presentation

- 3D engine (FM, Anstoss 3, Soccer Manager 2026, We Are Football).
- 2D top-down (FM, MZ, SOKKA).
- Highlights mode.
- Text ticker.
- Halftime + in-game adjustments.
- Conference / multi-match view (real-world Bundesliga radio model).

### 3.4 Scouting and transfers

- Multi-stage Recruitment Hub (FM26).
- Regional scout knowledge weighting (JPA / JPP).
- Shortlist with periodic updates.
- Agents / intermediaries (FM24+).
- Pre-talks + media lobbying (EA FM 11+).

### 3.5 Stadium and grounds

- Capacity tiers + seat-mix (standing / seated / premium / suites).
- ~100 buildings @ ~289 upgrade levels (EA FM 12).
- Anstoss 3 attractions: Würstchenbude, Bierzelt, Discothek, Karussell,
  Hotel, Hochhaus, Fanshop, TV-Station, Flugplatz +20 % away wins, etc.
- ManagerZone stadium features: clinic, restaurant, souvenir shop.
- Ageing / renovation cycle.

### 3.6 Finance

- Operating P&L vs investment budget (Anstoss split).
- Wage budget separate from transfer budget.
- FFP / financial-fair-play sanctions (FM).
- 4 sponsor tiers (EA FM 12): Main / Premium / Side / Local.
- Naming rights for stadium / stand / academy.

### 3.7 Youth

- Youth intake schedule.
- Loan target environment quality (league, role, coach).
- Youth academy as a separate building.
- Mentoring inside the senior squad.

### 3.8 Career / mode features

- "Real Manager Career" (Anstoss 2): apply for jobs, can be sacked.
- Create-a-Club (EA FM 05+).
- Carry personal wealth across careers (EA FM 06+).
- Football Fusion (EA FM 04): export to FIFA - unique cross-over.
- Manager Talent Tree (Anstoss 2022, Soccer Manager 2026).
- Manager Archetypes + Live Challenges (EA FC 26).
- Roguelite permadeath + carries (non-football, e.g. Nutmeg). **Our
  differentiator.**

### 3.9 Multiplayer

- Pyramidal league with shared world (ManagerZone, FM Online).
- 27-day seasons + daily match (SOKKA).
- Friendly Leagues / Private Async Groups - the design pattern we adopt.
- Inter-manager direct transfer market.

## 4. Empty quadrant - our market position

> No competitor combines **roguelite permadeath + Anstoss-style on-grounds
> economy + FM-grade depth + async private friend groups + offline-first
> PWA**.

Implications for scope:

1. Adopt FM/Anstoss depth ceiling for *systems* but compress *attribute UI*
   to mobile (1-10 + talent buckets, star summaries).
2. Treat on-grounds attractions as a signature feature, not a nice-to-have.
3. Permadeath + carries is our roguelite differentiator - see
   [[mode-design-research]].
4. Async groups are private (invite-only), with two cadence variants - see
   [[async-multiplayer-research]].
5. Procedural fictional universe + community override packs replace the
   licensing arms race - see [[ip-and-licensing]] and
   [[regulations-and-pyramids-research]].

## 5. Tech-stack note from the source (deviation flagged)

The Perplexity recommendation in Doc 1 §11 suggested **PostgreSQL + Capacitor**
for native packaging. Capacitor (or PWABuilder) is consistent with
[[../00-Index/Current-State.md]] and our future roadmap. PostgreSQL is *not*
in scope - we stay on **SurrealDB + Dexie** per ADR-0001 (tech stack) and
ADR-0002 (offline-first).

## 6. Sources (new URLs not in Wave 1)

All retrieved 2026-05-16 via Perplexity (private transcripts; URL set is the
union of footnotes from Doc 1 and Doc 2 sections 1-1080).

- ManagerZone landing + product info - [managerzone.com](https://www.managerzone.com)
- ManagerZone strategy article - [progressgames.com/managerzone-and-how-it-works](https://progressgames.com/managerzone-and-how-it-works/)
- SOKKA landing + guides - [playsokka.com/en](https://www.playsokka.com/en/) and [playsokka.com/en/guides](https://www.playsokka.com/en/guides/)
- SOKKA GM Games profile - [gmgames.org/sokka](https://gmgames.org/sokka/)
- Soccer Manager 2026 on Steam - [store.steampowered.com/app/3217240](https://store.steampowered.com/app/3217240/Soccer_Manager_2026/)
- Soccer Manager 2026 critique on Niklas Notes - [niklasnotes.com](https://niklasnotes.com/dashboard/game/60073/soccer_manager_2026)
- EA FC 26 Manager Live (games.gg) - [games.gg ea-fc-26 career-mode-manager-live guide](https://games.gg/de/ea-sports-fc-26/guides/ea-fc-26-career-mode-manager-live-neue-features-der-ultimative-guide/)
- Anstoss 3 build catalogue - [anstoss-zone.de/specials/bauwerke](http://www.anstoss-zone.de/specials/bauwerke.php)
- Anstoss DE Wikipedia - [de.wikipedia.org/wiki/Anstoss](https://de.wikipedia.org/wiki/Anstoss)
- Anstoss 3 DE Wikipedia - [de.wikipedia.org/wiki/Anstoss_3](https://de.wikipedia.org/wiki/Anstoss_3)
- EA Fußball Manager Wikipedia - [de.wikipedia.org/wiki/Fußball_Manager](https://de.wikipedia.org/wiki/Fu%C3%9Fball_Manager)
- FM26 mobile features - [footballmanager.com/fm26/features/mobile](https://www.footballmanager.com/fm26/features/mobile)
- FM26 scouting setup - [operationsports.com football-manager-26-how-to-set-up-scouting](https://www.operationsports.com/football-manager-26-how-to-set-up-scouting/)
- Sortitoutsi FM24 attribute guide - [sortitoutsi.net](https://sortitoutsi.net/content/67538/fm24-guide-players-attributes-explained)
- Nutmeg deck-builder review - [rogueliker.com nutmeg-review](https://rogueliker.com/nutmeg-review/)
- Capacitor PWA docs - [capacitorjs.com/docs/web/progressive-web-apps](https://capacitorjs.com/docs/web/progressive-web-apps)
- Capgo transform-PWA-to-Native - [capgo.app/blog/transform-pwa-to-native-app-with-capacitor](https://capgo.app/blog/transform-pwa-to-native-app-with-capacitor/)
