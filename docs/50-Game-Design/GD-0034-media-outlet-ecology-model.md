---
title: GD-0034 Media-Outlet Ecology Model
status: accepted
tags: [game-design, gddr, media, media-ecology, outlets, press, editorial-stance, narrative, fmx-82, accepted]
context: media-ecology
created: 2026-06-07
updated: 2026-06-19
type: gddr
binding: true
linear: FMX-82
related:
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[GD-0013-narrative-inbox]]
  - [[GD-0018-ai-narrative-personas-and-dialogue]]
  - [[GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[GD-0015-ip-clean-data]]
  - [[../60-Research/media-outlet-operational-behaviour-2026-06-07]]
  - [[../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# GD-0034: Media-Outlet Ecology Model

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this game-design record is now
> binding according to its approved scope.


> **Status `draft`.** The gameplay-design companion to **ADR-0085** (architecture/boundary).
> Authored after Nico chose FMX-82 D1–D4 live (2026-06-07). All numeric magnitudes are
> **GD-0043 `media.ecology` calibration** behind `mediaEcologyModelVersion` — this note pins *shapes and
> directions*, not final values.

## Why this exists

Media outlets are how the world's newsworthiness reaches the player; their cadence and slant
shape the *perceived* world. The genre lesson (FMX-82 research) is blunt: outlets usually feel
**fake** — interchangeable logos, no memory, repetitive press. FMX-82 builds them as a small,
**persistent, opinionated cast** that remembers, drifts and reacts — without ever owning
authoritative facts. Decisions: **new "Media Ecology" context** (D1=B), **persistent named
outlets** (D2=A), **base archetype + dynamic drift** (D3=A), **scoring + per-edition budget**
(D4=A).

## The outlet as a character (D2)

The world generates a **small, bounded roster** of named outlets per market at world-gen
(deterministic from `worldSeed`), each a persistent character with **memory**:

- a stable identity and an **IP-safe** evocative name (GD-0015 / ADR-0007);
- an **editorial line** that can warm or sour over a save;
- a **relationship** with the manager (improved by exclusives/access, damaged by feuds);
- a history of how it has covered each club, and the **narrative threads** it is pushing.

Smaller outlets may be abstracted into **clusters** (e.g. "Local Press", "Global Tabloid
Cluster"); a few **ephemeral micro-outlets** add flavour without persistent state. Players
should be able to learn that *"that tabloid always twists our results"* — and have it stay true.

## The five attribute dimensions

Every outlet is captured by the same small vector (real-world research):

1. **Type** — `broadsheet · tabloid · regional · inHouse · broadcaster · wire · aggregator · fanMedia`.
   Type sets the **base** of every other dimension and the **impact channel** (tabloids hit
   individual player morale hardest; broadsheets shift board/fan perception; fan media move
   hardcore fan sentiment).
2. **Stance** — `clubAffinity[club/cluster]`, `sensationalism`, `independence`,
   `accessDependence`, `commercialFocus`. The slant knobs.
3. **Reach** — `audienceScope` (local → global) + `reachWeight`. How far a story travels and how
   hard it lands. Maps to ADR-0076 `audienceScopeHint`.
4. **Reliability** — `factReliability`, `rumorReliability`, `perceivedAuthority`. Wires/broadsheets
   high; aggregators/tabloids lower on rumours.
5. **Cadence** — `cadenceProfile` (`dailyEdition · breakingContinuous · weeklyMagazine`) +
   `eventSensitivity`. How often it publishes and how much matchdays/windows/crises spike it.

### Type archetype starting bands (directions only — `media.ecology` calibrates)

| Type | Sensationalism | Reliability | Reach base | Affinity tendency |
|---|---|---|---|---|
| Broadsheet | low–med | high | national(+) | neutral, analytical |
| Tabloid | high | low–med | national | polarised, swingy |
| Regional/local | med | med | local | loyal to local club |
| In-house | low (PR) | high facts / biased read | club-bound | strongly pro-club |
| Broadcaster | med | high | continental/global (top comps) | event-driven |
| Wire | very low | very high | global feed | neutral |
| Aggregator | high | low | global (lang-bound) | clicks-follow-gravity |
| Fan media | very high | low–med | niche (fanbase) | devotion↔fury |

## How an edition is made (D4)

Each outlet runs **editions** on its cadence. An edition is a **finite front page** filled by a
deterministic, pure selection:

1. **Candidates** = newsworthiness facts (ADR-0076) in the outlet's window, reach-compatible,
   legal-risk-filtered.
2. **Score** each: `salience × bias-alignment × decay × −legal-risk + seeded noise`
   (noise keyed by `(outletId, eventId, seasonSeed)` → variety that replays identically).
3. **Budget** the front page: stable-sort by score (eventId tiebreak), take top-N above a floor.
4. **Slant**: stance + the outlet's relationship + the club's narrative signals pick an
   **angle code** (e.g. `supportive · critical · sensationalist · neutral-analytical`); Narrative
   (ADR-0065) turns the angle into prose. A finite-front-page model + per-outlet noise is what
   defeats the "same headline from every outlet" pitfall.

A per-club **"news gravity"** (size × history × star power × league prestige) is the master dial
on how many outlets cover a club at all — so big clubs get global multi-outlet coverage of minor
events while a small club mostly gets its local paper, except on upsets/relegation/giant-killings.

## Living stance: drift (D3)

Outlets start at their type/archetype base, then **drift deterministically** from read-only world
signals (consumed as events into a local projection — never a cross-context join):

- a **winning streak + good relationship** slowly raises affinity and the outlet's crisis tolerance;
- **repeated high-stakes failures** spike short-term criticism, then drift affinity toward neutral
  (hostile outlets amplify a "bottlers" thread);
- **feuding with / banning an outlet** sours its relationship → fewer positive stories, more
  rumours, and *other* outlets cover the "manager vs media" story;
- **granting exclusives/access** warms high-`accessDependence` outlets;
- a **scandal** splits the cast by type (broadsheets investigate, tabloids/aggregators explode,
  in-house goes quiet, fan media fracture).

Every drift is an inspectable `OutletStanceAdjusted` event — the player can see *why* an outlet
turned.

## Narrative threads (memory made visible)

Coverage attaches to first-class **narrative threads** (`emerging → heating → climax → resolved`)
keyed to ADR-0076 `storyThreadId` — "can they end the drought?", "is the big signing a flop?",
"manager vs the board". Threads update rather than reset, and outlets **refer back** to their own
prior takes. Surfacing "current narratives" + "recent headlines" per outlet in the UI is what makes
the memory *felt* rather than merely stored.

## Reach vs delivery vs feed (clean separation)

- **Reach** is a Media-Ecology gameplay attribute — it decides how far a story travels and how much
  it moves **fan mood / board perception** (Audience & Atmosphere / Club Management consume the
  coverage fact and apply their own effects).
- **Delivery** (Notification, ADR-0043) independently routes coverage into the player's inbox.
- The **player's news feed** is a filtered, non-authoritative view — hiding an item never changes
  what the simulated world "saw".

Media never applies effects itself: it emits coverage facts + advisory effect-intents; the owning
contexts decide morale/mood/pressure (ADR-0030 / ADR-0076 invariants).

## Player levers (where this becomes gameplay)

Press conferences (GD-0018 / GD-0028 intents), interviews, **granting/denying access**, leaks to
friendly outlets and player media-training all feed outlet relationships and stance drift — making
"managing the media" a real, legible sub-game with multi-system stakes (job security, player
confidence, fan sentiment, sponsor appeal), not a "click the safe answer" minigame.

## Calibration debt (`media.ecology`, GD-0043, behind `mediaEcologyModelVersion`)

Scoring weights `w_*`; per-edition budgets and the salience floor; cadence base + matchday/
window/crisis/big-event factors; stance-drift rates and crisis thresholds; reach weights; the
news-gravity formula; roster size per market; outlet→fan-mood/board/morale effect magnitudes.
This note fixes the **shapes and directions**; the numbers are tuned in playtest.

Harness: T1/T3 outlet-cadence, stance-drift and long-save media-density sweeps in
[[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].

## Open / deferred

- The RNG label (`WorldAiMgmtRng` media sub-label vs a dedicated `MediaRng`) — ADR-0085 open item.
- The full outlet→effect-intent taxonomy is accepted by FMX-162 in
  [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
  and is binding after Nico approved the decision queue on 2026-06-19.
- Authored outlet archetype/name catalogues (content scope, not a design decision here).
