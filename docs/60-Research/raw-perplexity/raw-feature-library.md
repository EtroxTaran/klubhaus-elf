---
title: Raw - Feature Library Across Football Manager Products
status: raw
tags: [research, raw, perplexity, competitors, features]
created: 2026-05-16
updated: 2026-05-16
type: research-raw
binding: false
related: [[README]], [[../feature-library-synthesis]], [[../competitor-matrix]], [[../anstoss-series-deep-dive]], [[../club-boss-analysis]]
---

# Raw - Feature Library Across Football Manager Products

> Source: private Perplexity transcripts (2026-05-16). Original language German.
> Captures the full feature inventory of the football-manager genre that informs
> our scope decisions. Feeds [[../feature-library-synthesis]].

## English summary

The transcript catalogues every major football-management product the user is
aware of: the German Anstoss lineage (1993–2022), EA's Fußball Manager / FIFA
Manager line (2001–2013), Sports Interactive's Football Manager (PC + Netflix
mobile), EA FC career mode, mobile/casual entries Club Boss and Soccer Manager
2026, and online async products ManagerZone (since 2001) and SOKKA. It enumerates
features per product, includes a comparison matrix across seven products, and
ends with concept recommendations: take-over-a-club career mode (Anstoss 2),
roguelite create-your-own-club mode, async multiplayer with closed friend groups,
licence-free procedurally generated player universe, full 30+ attribute model,
five tactical layers, ten-category stadium/campus build system, full match-day
event-based 2D engine, and Capacitor-based PWA → native deployment path.

The key market-gap conclusion: **no competitor combines roguelite permadeath +
Anstoss-style stadium attractions + FM-level depth + private async multiplayer in
a modern offline-first PWA**. That intersection is the soccer-manager target.

## 1. Anstoss series (1993-2022)

- **Anstoss 1 (1993)**: established office hub, transfers, stadium upgrade,
  training, match-day in three modes (out, text, scene). Limited to 10 seasons +
  Bundesliga only.
- **Anstoss 2 (1997)**: unlimited play and "real manager career" - manager
  applies for jobs and can be fired. England/France/Italy/Spain added. *Anstoss 2
  Gold* added merchandise sales and a manager skill-points ladder
  (Press Work, Training, …).
- **Anstoss 3 (2000)**: best-selling entry (>200 k units in year one), Gerald
  Köhler's last as creator. Key innovations:
  - **Stadium grounds construction (SimCity-style)** with categories:
    Gastronomy (Würstchenbude, Bierzelt, Pizzeria), Entertainment (Discothek,
    Karussell, 360° Kino, Extra-Leinwand), Lodging (Hotel, Reihenhaus,
    Hochhaus), Infrastructure (Kartenhäuschen, Tankstelle, Einkaufszentrum,
    Fanshop), Sport (Trainingshalle, Unterdruckkammer, Krankenhaus, Sand
    training pitch), Misc (TV-Station, Flugplatz +20 % away wins,
    Schiedsrichterschule, Dopinglabor).
  - **3D match scenes** replacing drawn scenes; compressed match runs in 9 min;
    commentary by Günther Koch.
  - IPO clubs, up to 5 countries simultaneously, expanded statistics.
- **Anstoss 2022 (2tainment, Early Access never left, 2025 development halted)**:
  modern feature set on paper - tactic engine with goal-keeping/back-pass rule
  /variable pressing + special camera, heat-maps, manager talent tree (multiple
  branches replacing flat point system), global scouting network, deep player
  personality system, planned multiplayer and national-team modes.

## 2. EA Fußball Manager / FIFA Manager (2001-2013)

Developed by Gerald Köhler post-Anstoss. Series ended because new engine + online
tech would have been required to continue.

- **Transfers**: full scouting in FM 08 (info hidden by league level); FM 11
  added pre-talks with players and press lobbying.
- **Club grounds (FM 07+)**: ~100 buildings, dozens of landscaping options;
  FM 12 had 25 buildings × up to 289 upgrade levels, with ageing/renovation.
- **Sponsoring system (FM 12)**: separated Main / Premium / Side / Local
  sponsors to model wealth gaps between clubs.
- **Create a Club (FM 2005)**: choose city, name, kits; FM 06 lets you carry
  personal wealth from previous careers as starting capital.
- **Private life**: family area, luxury items, personal manager profile
  (FM 2002-2005, returned FM 07).
- **Football Fusion (FM 2004)**: export career data into FIFA, play the match
  yourself. Unique cross-over.
- **Squad analysis tool (FM 12)**: evaluates team for chosen formation, flags
  surplus players.
- **Team dynamics (FM 13)**: dressing-room mood as a first-class system.

## 3. Football Manager (Sports Interactive)

- **Attributes**: four categories, 30+ individual attributes scored 1-20.
  Technical (dribbling, passing, crossing, finishing, heading, tackling,
  goalkeeping-specific). Mental (bravery, concentration, decisions, anticipation,
  teamwork, vision, leadership, composure). Physical (acceleration, pace,
  stamina, strength, balance, jumping, natural fitness, agility). Hidden
  (injury proneness, big-match temperament, professionalism, ambition,
  adaptability). Each player has Current Ability (CA) and Potential Ability
  (PA) capping growth.
- **Tactics**: any formation; 5-10 roles per position (e.g. striker: advanced
  forward, poacher, deep-lying forward); duties attack/support/defend;
  Team Mentality slider; In/Out-of-Possession instructions (pressing intensity,
  triggers, tempo, width, defensive line); dedicated Set Piece coach (since
  FM24); Individual Player Instructions overriding role defaults.
- **Match engine**: event-based, *not* frame-by-frame. Pre-match probability
  distribution from attributes/tactics/formations; in-engine events are
  attribute comparisons with randomness; substitutions and tactical changes
  trigger re-computation of the rest of the match; 2D top-down view; team-talks
  and shouts move morale which moves performance.
- **Scouting (FM26)**: Recruitment Hub, scout assignment by region/player type,
  scout quality = Judging Player Ability (JPA) + Judging Player Potential (JPP),
  regional knowledge weighting, shortlist with periodic report updates,
  Intermediaries (agents, FM24+).
- **Player development**: PA cap, training facility quality, coaching staff,
  match minutes (under-18 = training, 18+ = minutes), personality
  (professionalism/determination accelerate growth), age curve (physical
  declines ~28, mental keeps growing).
- **Finance**: transfer budget, wage budget (weekly), revenues (gate, TV,
  merchandise, sponsoring, transfers, Champions League prize), costs
  (wages, transfers, loans, instalments), Financial Fair Play sanctions,
  board season expectations.
- **Game modes FM24**: Real World / Original / Your World starts.
- **FM26 Mobile** (Netflix-exclusive): top-down match view, transfer market,
  squad management, tactics, player development, contract negotiation,
  compressed depth for short sessions.

## 4. EA FC / FIFA career mode

- **Manager Live (EA FC 26)**: replaces linear seasons with a dynamic hub. Weekly
  Live Management Challenges (relegation fight, treble chance, …). Unexpected
  events from injured defence to near-bankruptcy. 13 Manager Archetypes with
  upgrade paths. Active job market - AI teams change tactics when new manager
  joins.
- **Total Management System (EA FC 24)**: predefined play-styles
  (Tiki-Taka, Gegenpressing, Defensive Block); specialised staff for attack /
  midfield / defence / goalkeeper.

## 5. Club Boss (mobile)

Offline Android football management between Football Chairman and FM-style
stats. Create club (name/colours/badge), choose league + country. Buy/sell
managers and players, build youth academy. Upgrade stadium/training/
infrastructure. Stats over legends, top scorers, most expensive transfers.
Youth scouts deployable to continents. Dynamic player world over time.
**Offline; no Pay-to-Win; own pace** - cited as the casual benchmark.

## 6. ManagerZone (2001-)

Oldest web-based football MMO. Pyramidal league system based on the English
pyramid. **Season = 13 weeks (1 quarter)**, 22 match-days (Wed + Sun). All
managers live in the same persistent world; transfers are between real
managers, prices via supply and demand. Stadium Features include clinics,
restaurants, souvenir shops in the stadium builder. Friendly Leagues
(private, invite-only, up to 16 teams). ManagerZone World Cup with manager
vote system. Finances: home matches + player sales + position prizes;
Fridays evening for wages, coaches, stadium maintenance.

## 7. SOKKA

Modern asynchronous multiplayer football manager. 27-day seasons, one match
per day. Daily tactical adjustments needed (stamina management, formation).
Champions Cup at season end (quarterly). Market-based economy; no
Pay-to-Win. Tactical depth via Special Qualities + Tactical Adjustments.
Scouting, youth development, live transfer market. Demonstrates async
multiplayer with daily checkpoints - no simultaneous online presence required.

## 8. Soccer Manager 2026

Steam + mobile. 90+ leagues, 54 countries, 900+ clubs. Manager Trait System
(skill tree, very similar to Anstoss 2022). Create-a-Club. Objectives system
(daily/weekly/seasonal goals). Match Motion Engine (3D animations on the
pitch). Facilities upgrade system. Criticism: pay-to-win elements,
micro-transactions.

## 9. Feature comparison matrix (verbatim from Doc 1)

| Feature | Anstoss 3 | FM26 | EA FM | Club Boss | ManagerZone | SOKKA |
|---|---|---|---|---|---|---|
| Stadium build | ✅ deep | ❌ | ✅ SimCity | ✅ basic | ✅ basic | ❌ |
| Gastronomy/Würstchenbude | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| 2D match engine | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tactic system | medium | ✅ complex | medium | simple | medium | medium |
| Player attributes | medium | ✅ 30+ | medium | basic | 11 skills | simple |
| Scouting network | basic | ✅ global | ✅ | basic | basic | ✅ |
| Youth academy | basic | ✅ complex | ✅ | ✅ | ✅ | ✅ |
| Async multiplayer | ❌ | ✅ FM Online | online mode | ❌ | ✅ MMO | ✅ core |
| Manager career | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create-a-Club | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Club grounds SimCity | ✅ | ❌ | ✅ FM07 | basic | basic | ❌ |
| Roguelike / Permadeath | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PWA / browser | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Real licences | none | ✅ | ✅ | ❌ | ❌ | ❌ |

## 10. Concept design recommendations (verbatim points)

### 10.1 Mode A: Take Over a Club

- Start with generated fictional clubs across several fictional leagues.
- Apply to manager/coach jobs depending on reputation.
- Seasonal board goals (placement, budget, youth work).
- Sacking risk on underperformance.
- Reputation system - successes/failures affect future job offers.

### 10.2 Mode B: Create Your Own Club (Roguelite)

- Own club name/colours/crest/home stadium (with location).
- **Permadeath on insolvency** - club is lost, you restart.
- **Roguelite carries** - each run unlocks small permanent advantages
  (better start, retained scout from old network, starting-capital bonus).
- Resource management becomes existential.
- Comparable to Nutmeg (deck-building football roguelike) but from manager
  perspective.

### 10.3 Async multiplayer mode

- Closed groups, only invited friends (no open MMO).
- Async phases through the week: transfers, scouting, training, tactics
  planning at your own pace.
- Sync events on match days: tactic inputs must be set before; player-to-player
  direct negotiations require a sync session.
- Transfer window opens/closes at season points; transfers only within the
  group.

### 10.4 Licence-free player universe

- Procedurally generated player universe (names, nationalities, attributes).
- Fictional leagues mirroring real league structures (pyramids, promotion/
  relegation).
- Community editor (Anstoss tradition) to adapt data to reality.
- Archetype-driven generation (fast winger, playmaker, ball-winner) as
  procedural templates.
- Recommended attribute categories: Technique, Athletics, Mental, Character,
  Goalkeeper-specific. Each player has visible current strength + (optionally
  hidden) potential ceiling.

### 10.5 Tactics system

- Free formation (11 positions).
- Predefined style templates (Gegenpressing, Tiki-Taka, Counter,
  Defensive Block).
- 4-6 roles per position (e.g. striker: Target Man, Poacher, Run-Maker,
  Playmaker).
- Mentality slider Defensive ↔ Offensive.
- Pressing level (high/medium/low) + triggers.
- Individual instructions override role defaults.
- Set pieces: corners, free kicks, penalties.

### 10.6 Stadium and grounds (with attractions table)

| Area | Buildings | Effect |
|---|---|---|
| Gastronomy | Würstchenbude, beer stand, fan restaurant, VIP lounge | match-day revenue, fan mood |
| Fan area | Fan shop, ticket booth, outdoor screen, fan zone | merchandise revenue |
| Training | Pitch (grass/turf/sand), training hall, fitness centre, infirmary | player development, injury recovery |
| Infrastructure | Youth academy, scouting centre, media centre, club house | youth, media power |
| Commercial | Office building, conference centre | sponsor revenue |

### 10.7 Scouting & recruitment

- Scout network: deploy scouts to regions (cost wages, deliver reports).
- Scout qualities: talent recognition (current/potential), regional knowledge.
- Player report incomplete at first, improves with scouting intensity.
- Youth scouting: talents from age 15 in own academy.
- Transfer market: fictional players procedurally generated per season.

### 10.8 Finance system

| Revenue | Cost |
|---|---|
| Stadium gates (home games) | Player wages |
| TV money (league-dependent) | Staff wages |
| Sponsors (Main / Premium / Side / Local) | Transfer outlays |
| Merchandise / fan shop | Stadium maintenance |
| Youth sales | Loan interest |
| Club grounds revenue | Training operations |
| Cup / Euro prize money | Insurance |

FFP mechanic: budget overshoots across seasons trigger transfer bans and fines
(in roguelite mode: insolvency risk).

### 10.9 2D match engine design principles

1. Pre-match: tactics + attributes + morale + form curves → probability
   distribution for outcome.
2. Event simulation: sequence of player events (possession, pass, dribble,
   shot, …) with attribute comparisons.
3. 2D presentation: top-down, players as coloured circles with positions.
4. Tactical interventions: substitutions / tactic changes trigger re-computation.

UI elements: pitch (top-down green), player positions (numbered dots in club
colours), ball animation, event feed (text + timestamps), stats overlay
(shots, possession, duels), tactic panel (subs, formation, shouts).

## 11. PWA tech stack recommendation

- **Frontend**: React + TanStack Router, TypeScript.
- **PWA**: Service Worker (Workbox), Web App Manifest, offline support.
- **Mobile deployment**: Capacitor.js for native iOS/Android from same codebase.
  PWABuilder as simpler alternative. Capacitor offers native plugin access
  (Push, Secure Storage) with first-class PWA support.
- **Backend**: Node.js (Hono or Express), PostgreSQL for player + career data.
- **Realtime** (synchronous events): WebSockets or Supabase Realtime.
- **Async multiplayer**: database-driven; real-time only for direct
  negotiations.

(Note: this contradicts our SurrealDB / Dexie / TanStack Start stack as locked
in [[../../10-Architecture/09-Decisions/ADR-0001-tech-stack]]. The Capacitor
recommendation is sound for future native packaging but PostgreSQL is **not** in
scope.)

## 12. Market gap analysis

| Gap | Description |
|---|---|
| Async multiplayer with real friends | ManagerZone and SOKKA are open MMOs; nobody offers closed friend groups like FM Online but async. |
| Roguelite mode | No football manager has permadeath / roguelite carries. |
| Anstoss-3 grounds | FM has none; EA FM had it (FM07) but discontinued; high nostalgia potential. |
| PWA + mobile-first | ManagerZone runs in browser but is not modern PWA; modern design absent. |
| Licence-free but realistic | Club Boss does it but without depth; ours can combine FM depth + fictional universe. |
| German/European target audience | Anstoss was the German community darling; no modern product serves this niche. |

## 13. Roadmap (4 phases)

- **Phase 1 - Single Player MVP**: fictional league (1 country, 2 tiers),
  take-over-a-club mode, simplified tactics (formation + mentality),
  event-based 2D match engine, basic finance, basic transfer/scouting,
  stadium (capacity only).
- **Phase 2 - Expanded Single Player**: create-own-club + roguelite with
  carries, grounds with buildings (gastronomy, training, fan area), full
  attribute system (30+ + CA/PA), expanded scouting network, manager talent
  tree, multiple leagues/countries.
- **Phase 3 - Async Multiplayer**: closed groups / friend league, async
  actions (transfers, training, tactics), match-day events (synced), direct
  negotiations (sync sessions), push notifications.
- **Phase 4 - App Store Releases**: Capacitor wrapping for iOS/Android, store
  assets, splash screens, native push notifications, PWABuilder / Capacitor
  deployment.

## 14. Citations preserved from the source

All Perplexity citations 1-45 (Doc 1) cover Wikipedia, MobyGames, anstoss-zone.de,
fmscout, FourFourTwo, Reddit football-manager subreddits, sportitoutsi,
operationsports, footballgpt, fm-base, capacitorjs and capgo. Full URL list lives
in the source `.md`; only URLs new to this vault are listed in
[[../feature-library-synthesis]] §Sources.
