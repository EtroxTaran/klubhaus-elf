---
title: Late-Game Systems — Continental Cups, Bundestrainer, Ownership, Hall of Fame, Legacy
status: current
binding: true
tags: [research, late-game, endgame, continental, national-team, bundestrainer, ownership, takeover, hall-of-fame, legacy, longevity]
created: 2026-05-17
updated: 2026-06-15
type: research
related: [[ai-manager-behaviour]], [[data-generators]], [[onboarding-strategy]], [[tactics-and-formations]], [[manager-archetype-roguelite-2026-05-27]], [[cup-and-competition-revenue-profiles-2026-05-28]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[../10-Architecture/09-Decisions/ADR-0004-data-model]], [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]], [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]], [[../50-Game-Design/mode-manage-a-club-career]], [[../50-Game-Design/mode-create-a-club-roguelite]], [[../50-Game-Design/regulations-and-compliance]], [[../50-Game-Design/economy-system]], [[../50-Game-Design/club-dna-and-governance]], [[anstoss-series-deep-dive]]
---

# Late-Game Systems — Continental Cups, Bundestrainer, Ownership, Hall of Fame, Legacy

> Gap D6 of [[../95-Archive/gap-reports/wave-3-gap-analysis]]. Locks the late-game / endgame
> meta layer for an offline-first PWA football manager: 3-tier
> continental cup stack per continent + IFC Club World Masters;
> dual-role Bundestrainer arc with 3 engagement levels; full Make
> Your Career manager creator + 5-branch talent tree + region-based
> reputation; 6-archetype ownership transitions + bankruptcy /
> administration; 3-layer Hall of Fame (manager per-save + cross-
> save + club + player legends); 3-option Legacy mode with 3-tier
> Legacy perks; full 50-year save longevity stack (career phases +
> generational regens + Year-X events + continental power shifts +
> newspaper archive + records book). First PWA manager game to
> ship this stack.

## 1. Context and inputs

This note completes the late-game meta layer on top of locked
foundations:

- **D4 AI Manager Behaviour** ([[ai-manager-behaviour]]): locks
  Rising Rival (~5y) + Giant Collapse (~10y) structural events,
  10 manager archetypes with career drift + retirement at 60-70 +
  legendary detection (3+ titles or 2+ continentals), board
  expectation escalation +1 tier per overperformance. D6 §11.2
  explicitly deferred national team dual-role + Hall of Fame +
  legacy mode to post-MVP — D6 specifies them.
- **D5 Onboarding Strategy** ([[onboarding-strategy]]): locks 12
  dynasty achievements as MVP late-game content + national team /
  Hall of Fame / legacy mode as post-MVP. Configurable Assistant
  Manager voice carries into late-game narrative.
- **D8 Determinism** ([[determinism-and-replay]]): cross-save
  state MUST be meta-only and NEVER feed back into a running save's
  RNG. Same `worldSeed` + same legacy bonuses at gen → byte-
  identical world.
- **ADR-0007 Naming Schema** ([[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]):
  all continental cup + national team + governing-body names MUST
  be fictional + IP-clean.
- **D2 Data Generators** ([[data-generators]]): 10 countries with
  5-tier pyramids; top-European pool = DE / EN / ES / IT / FR / PT /
  NL; national-team eligibility via birth nationality + heritage
  per §10.4.
- **ADR-0004 Data Model**: `player` + `club` + national-team
  records already in schema; D6 fills out the late-game data
  fields.
- **Existing GDDs**:
  [[../50-Game-Design/mode-manage-a-club-career]] §7 has a
  Bundestrainer stub (Phase 3 add-on);
  [[../50-Game-Design/regulations-and-compliance]] §7-8 mentions
  continental cups + UEFA-analogue body but doesn't design them.
  D6 owns the full design.
- **Wave 1**: [[anstoss-series-deep-dive]] documented the
  Bundestrainer arc as Anstoss-3's iconic feature.

This note adds: continental cup stack design + qualification rules +
calendar + prize money + coefficients; national team mode with
3 engagement levels + dual-role calendar handling + tournament UX;
manager career meta-progression with Make Your Career creator +
5-branch talent tree + region-based reputation; 6-archetype
ownership transition system + bankruptcy mechanics + user
decision-points; 3-layer Hall of Fame; 3-option Legacy mode with
3-tier cross-save Legacy perks; 6-system 50-year save longevity
stack; performance + storage budgets; IndexedDB schemas.

FMX-16 adds a narrower MVP-facing bridge: [[manager-archetype-roguelite-2026-05-27]]
and [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] keep
the full cross-save legacy/perk layer playtest-tunable while requiring the
first playable to preserve run-analysis hooks.

## 2. Comparative analysis

### 2.1 Comparison table

| Game | Continental cups | Bundestrainer | Ownership transitions | Hall of Fame | 50-year saves |
|---|---|---|---|---|---|
| **FM PC** | 3 real UEFA tiers (licensed) | Dual-role, deep | Takeover scenarios + admin rare | Manager + club + player legends | **Goldfish-brain gold standard** |
| **FM Mobile** | Simpler bracket | Usually absent | Limited | Limited | Less |
| **EA FC Career** | Real UEFA licensed | Light "International Career" | Some events | Player legends | Dies ~season 5 |
| **PES Master League** | Similar to EA | Some | Limited | Limited | Dies ~season 5 |
| **Top Eleven** | Per-division CL analogue | None | Prestige levels | Manager XP | Seasons reset |
| **OSM** | UEFA where licensed | None | None | Minimal | Restart-friendly |
| **Hattrick** | Hattrick Masters (single comp) | National team coach elected by community | Community-owned vibe | Player legend tracking + record books | **27+ year saves, strong** |
| **Anstoss 3** | Fictional continental cups | **Iconic Bundestrainer arc** | Takeover narratives | Some "Eternal Fame" | "Eternal Fame" hooks |
| **CK3** (reference) | N/A | N/A | Dynasty system | Strong cross-save dynasty score | Generational play |
| **Civ** (reference) | N/A | N/A | N/A | Strong Hall of Fame + Legacy era | Multi-era play |

### 2.2 Our positioning

We combine: **Anstoss-3 Bundestrainer arc + FM-PC long-save depth +
CK3 cross-save Hall of Fame + Civ era system + Hattrick record
books** — first to ship this stack on a PWA.

### 2.3 Techniques adopted

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | 3-tier continental cup stack | UEFA 2021+ (FM, EA FC) | §3 — EFC / AFU / APFC / AFA per continent |
| 2 | Classic 32-team group + knockout | FM, EA FC, PES | §3.3 — MVP; Swiss as Phase 2 |
| 3 | Country coefficient with 5-year rolling | UEFA (FM, EA FC) | §3.7 — simplified; biennial slot adjustment |
| 4 | Dual-role club + national team | FM PC, Anstoss 3 | §4 — with 3 engagement levels |
| 5 | Bundestrainer arc as long-term goal | Anstoss 3 (iconic) | §4.2 — unlock rep ≥ 75 + (5 seasons OR 3 trophies) |
| 6 | Manager + Club + Player legend detection | FM PC | §7 — auto-detection algorithms |
| 7 | Era detection (Golden / Resurgence) | FM clubs + CK3 dynasty eras | §11.1 — 3-8 year span auto-labelling |
| 8 | Sugar Daddy + Asset Stripper + 4 more | FM (rich owner flag) + Anstoss (Investor) | §6 — 6 data-driven Owner Profiles |
| 9 | Cross-save Hall of Fame | Civ + CK3 dynasty score | §8 — meta-only; never feeds runtime sim |
| 10 | Legacy perks for new saves | CK3 dynasty perks | §9 — 3-tier; world-gen-time params only |
| 11 | Generational regens ("Son of X") | FM regens + The Sims | §11.2 — cosmetic tag + small bias |
| 12 | League reform every 15-20 years | CK3 era + real football reform | §11.3 — pre-announced 2-3 seasons ahead |
| 13 | Newspaper archive | Anstoss 3 Zeitung + FM news | §11.5 — per-season + decade retrospectives |
| 14 | Records book | Hattrick history + FM records | §11.6 — auto-detect on every match |
| 15 | Tournament cycle (4y global + 4y continental offset 2y) | FIFA + UEFA real-world | §3.10 — big tournament every 2y |
| 16 | Manager creator (Background + Badges + Specialisation) | FM PC | §5 — proven replayability |

### 2.4 Our unique style

- **CK3-style cross-save Hall of Fame with deterministic-safe
  Legacy perks**: FM has per-save HoF only; we extend cross-save
  without breaking D8 determinism by reading perks ONLY at
  world-gen, not runtime.
- **3-engagement-level dual-role national team mode**: addresses
  PWA tablet ergonomics; FM only has Full Control.
- **6 data-driven Owner archetypes with explicit takeover decision
  points** for the user manager: FM has implicit; Anstoss had
  narrative but binary.
- **Civ-style career phases UI** explicit on timeline labels: FM
  emergent; we make it explicit + readable.
- **Continental power shift labels** ("European Dominance Era
  2032-40") explicit on global overview: no competitor surfaces
  this.
- **Anstoss newspaper + Hattrick records combined**: each game has
  one or the other; we unify.
- **Generational regens with story hooks**: FM has regens; ours
  have explicit narrative continuity via "Son of X" + media
  headlines.
- **Deterministic + offline-first** entire system: same world seed
  + same legacy bonuses at gen → byte-identical world.

## 3. Continental cup stack

### 3.1 Governing bodies (IP-safe naming)

All fictional + generic:

| Scope | Name | Acronym |
|---|---|---|
| Global | International Football Confederation | **IFC** |
| Europe | European Football Confederation | **EFC** |
| Americas | Americas Football Union | **AFU** |
| Asia-Pacific | Asia-Pacific Football Confederation | **APFC** |
| Africa | African Football Alliance | **AFA** |

### 3.2 Competition names

**Per continent (3 tiers each)**:

- Tier 1: `{Confed} Champions Cup` (e.g. EFC Champions Cup)
- Tier 2: `{Confed} Continental League` (e.g. EFC Continental
  League)
- Tier 3: `{Confed} Challenge Trophy` (e.g. EFC Challenge Trophy)

**Global**:

- IFC Club World Masters

**National team**:

- Global: IFC Nations Championship
- Per continent: `{Confed} Continental Championship` / `{Confed}
  Nations Cup` / etc.

### 3.3 Competition format — classic 32-team groups + knockout

Per D6 Q&A: classic format at MVP; Swiss model as Phase-2 option.

**EFC Champions Cup (Tier 1)**:

- 32 teams; 8 groups of 4; double round-robin (6 matches each)
- Top 2 per group → Round of 16 (two-leg knockout)
- 3rd place per group → drops into EFC Continental League KO round
  (strong narrative)
- 4th eliminated
- Knockouts: R16 / QF / SF two-leg home + away; Final neutral venue

**EFC Continental League (Tier 2)**: 48 teams; 12 groups of 4;
group winners + best 4 runners-up → R16; remaining + Champions Cup
drop-downs → playoff round.

**EFC Challenge Trophy (Tier 3)**: 64 teams; 16 groups of 4;
straight knockout from R32 onwards.

Tiebreakers (group stage):

1. Points
2. Head-to-head points
3. Head-to-head goal difference
4. Overall goal difference
5. Goals scored
6. League ranking coefficient (or RNG via `WorldAiMgmtRng`)

### 3.4 Qualification rules

**EFC Country Ranking (Season 1 baseline)**:

| Rank | Country |
|---|---|
| 1 | EN |
| 2 | ES |
| 3 | IT |
| 4 | DE |
| 5 | FR |
| 6 | PT |
| 7 | NL |

**Slot allocation per country** (initial; modified by §3.7
coefficients):

| Country | Champions Cup | Continental League | Challenge Trophy |
|---|---|---|---|
| EN, ES, IT | 4 | 4 | 5 |
| DE, FR | 3 | 3 | 4 |
| PT, NL | 2 | 2 | 3 |

Plus:

- Defending Champions Cup holder: auto-qualifies for next season's
  Champions Cup; their league slot is passed down by league position.
- Continental League holder: auto-qualifies for next season's
  Champions Cup (like UEFA Europa → CL).
- Challenge Trophy holder: auto-qualifies for next season's
  Continental League.
- Domestic cup winner: minimum Tier 2; if already in Tier 1 → slot
  passed down by league.

**Mapping to league positions** (England 20-team example):

- Champions Cup: positions 1-4
- Continental League: positions 5-8
- Challenge Trophy: positions 9-13
- Domestic Cup winner: minimum Tier 2

### 3.5 Calendar / fixture scheduling

Continental matchdays use midweek windows (analogous to UEFA
Tue / Wed / Thu); leagues + domestic cups use weekends with some
midweeks.

Season ~42 weeks (mid-August to late May). Group phases Sep-Dec;
knockouts Feb-May.

| Phase | Schedule |
|---|---|
| Champions Cup MD1-6 (group) | mid-Sep / late-Sep / early-Oct / late-Oct / early-Nov / late-Nov |
| Continental League + Challenge Trophy MD1-6 | mirrored midweeks (offset within week or opposite midweeks) |
| Knockout rounds | Feb (R32 + playoff) / late Feb-Mar (R16) / Apr (QF) / late Apr-early May (SF) |
| Finals | Challenge Trophy 2nd weekend May midweek / Continental League mid-May midweek / Champions Cup last weekend May Saturday night |

Scheduler enforces:

- No club plays > 2 matches/week
- Continental matchdays block league fixtures for involved clubs
- "Continental batch days": engine simulates all Champions Cup
  Tuesday/Wednesday games together for perf

### 3.6 Prize money structure

Internally "credits"; UI labelled "€" but abstracted. All amounts
illustrative. FMX-45 moves final continental-cup revenue calibration into
[[cup-and-competition-revenue-profiles-2026-05-28]]: this section is a legacy
scale sketch, not a final `CompetitionRevenueProfile`.

**EFC Champions Cup**:

| Stage | Amount |
|---|---|
| Group participation | 10 M |
| Group win | 1.5 M |
| Group draw | 0.5 M |
| Reach R16 | +9 M |
| Reach QF | +10 M |
| Reach SF | +12 M |
| Runner-up | +15 M |
| Winner | +25 M |

Max winner take ≈ 74.5 M (10 + 8.5 + 9 + 10 + 12 + 25); transformative
but not insane.

**EFC Continental League**: participation 4 M / group win 0.75 M /
draw 0.25 M / playoff 1 M / R16 +2 M / QF +3 M / SF +4 M / runner-up
+5 M / winner +8 M. Max ~30-35 M.

**EFC Challenge Trophy**: participation 2 M / group win 0.4 M / draw
0.15 M / R32 +0.5 M / R16 +0.75 M / QF +1 M / SF +1.25 M / runner-up
+1.5 M / winner +3 M. Max ~12-15 M.

### 3.7 Country + club coefficient

**Country coefficient** (5-year rolling window):

Per season, each club earns "country points":

| Action | Points |
|---|---|
| Win | 2 |
| Draw | 1 |
| Group stage bonus per club (per tier) | T1: 4 / T2: 3 / T3: 2 |
| Reach R32 / R16 | +1 |
| QF | +1 |
| SF | +1 |
| Final | +1 |
| Winner | +1 |

Country season score = sum of all clubs' points ÷ number of clubs
entered. Country coefficient = sum of last 5 seasons' scores.

**Biennial slot adjustment** (every 2 seasons):

- Top 3 countries: +1 Champions Cup slot (cap 5) + +1 Continental
  League slot
- Bottom 2 countries: -1 Champions Cup slot (min 1) + -1 Continental
  League slot

Tier 3 slots used as buffer for displaced teams.

**Club coefficient** (5-year cumulative, not averaged): seeds group
draws (Pot 1-4) + knockout ties.

### 3.8 Anti-staleness integration with D4

Ties directly to D4's tactical arms race + Rising Rival + Giant
Collapse:

- Reaching Champions Cup: +5-10 % club rep
- Winning Champions Cup: +20-30 % rep jump, decaying slowly over
  years
- Continental League / Challenge Trophy: smaller boosts

Boards:

- Dynamic expectation curve: first qualification = "enjoy the
  experience" → repeated = "reach knockouts" → after winning =
  "maintain top-tier" + failure triggers Giant Collapse narrative
  hooks

Wage demands + tactical arms race: continental rep tier multiplies
agent expectations; overachievers (NL team in CL semis) flagged as
Rising Rival candidates per D4 §10.4.1.

### 3.9 Club World Masters

**IFC Club World Masters**:

- 32 clubs (8 from each continental Champions Cup; semi-finalists+ or
  top coefficient qualifiers)
- 8 groups of 4 (single or double round-robin depending on calendar
  tolerance)
- QF / SF / Final at neutral venues
- Late July / early August (pre-season super-tournament; competes
  with domestic super cups + friendlies)

### 3.10 National team competition cycle

Per D6 Q&A: 4-year global + 4-year continental offset 2 years →
big tournament every 2 years.

| Year | Tournament |
|---|---|
| Y0 (and Y4, Y8, Y12, ...) | IFC Nations Championship |
| Y2 (and Y6, Y10, ...) | Continental Championships (all confeds) |

**IFC Nations Championship**: 32 teams; 8 groups of 4 → top 2 → 16-team
knockout. Qualifiers Sept/Oct/Nov + Mar/Jun windows over 2 years
prior.

**Continental Championships**: 24 teams (Europe); groups of 3 or 4 →
knockout (modern Euros analogue).

Friendly windows on remaining FIFA dates; especially intense in
tournament-prep year.

## 4. National team mode

> **FMX-130 reconciliation (2026-06-15):** this section is preserved as the
> historical D6 research sketch. The current Career/GDDR truth for the
> Bundestrainer unlock is [[../50-Game-Design/GD-0033-national-team-dual-role]]
> and
> [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]:
> manager reputation >= 75 AND 5+ seasons, no trophy shortcut. Trophies feed
> reputation; the old board-confidence `<20` offer floor is
> `legacy.nationalTeam.offerWindow.boardConfidenceFloor` calibration debt.

### 4.1 Dual-role with 3 engagement levels

Per D6 Q&A — dual-role (club + nation simultaneously) with 3
engagement modes (toggleable per save):

| Mode | Behaviour |
|---|---|
| **Full Control** | User does everything (squad, training camp, friendlies, tactics) |
| **Match-Only** | AI assistant proposes squads + training; user confirms with one tap; user plays/auto-resolves matches |
| **Light Touch** | User only handles major tournaments; qualifying + friendlies are auto-simmed with high-level choices (youth focus vs results focus) |

Default: Full Control for users who self-identified as Veteran in D5
FTUE; Match-Only for Bit; Light Touch for Newbie.

### 4.2 Unlock conditions

Per D6 Q&A — manager rep ≥ 75 AND (5+ seasons OR 3+ major club
trophies). Job offers spawn:

- **Main hiring window**: 1 month post major tournament
- **Secondary window**: board confidence drops < 20 mid-cycle (bad
  qualifier run)
- Random resignations: low chance per year (burnout / club offer)

**Offer logic** when national team job opens:

Candidate shortlist priority:

1. Managers of that nationality with high rep
2. Managers with recent success in that country's top league
3. Global "big names" with legendary or near-legendary status

User flow:

- **Direct offer** if user is in top 3 candidates
- **Apply** via Job Center if rep threshold met but not
  auto-shortlisted

Assistant national-team coach intermediate role: **deferred to
Phase 4** (not core to Bundestrainer arc; can be boring).

### 4.3 Calendar conflict handling

National team calendar is **fixed** (qualifiers + tournaments + FIFA
windows). Club matches in these windows:

- **League fixtures**: auto-reschedule around international windows
  (FM-style)
- **Lower-priority cups / friendlies**: still exist; club plays with
  missing internationals; banner shown ("4 players on international
  duty (3 starters, 1 sub)")
- **Same-day clash** (rare in compressed schedules): forces user
  choice "You cannot attend both matches. Which bench will you
  take?" → unattended match auto-managed by assistant using user's
  tactics; story beat: "Media questions your absence from
  [club/nation] match."

### 4.4 National team squad + selection

**Squad size**: 23 players (3 GKs + 20 outfield) for tournaments
AND call-up windows (code simplicity).

**Eligibility** (per D2 §10.4): birth country + up to 2 heritage
countries. Friendly caps DON'T lock; first competitive senior
match permanently commits.

**Call-up window types**:

| Window | Matches |
|---|---|
| Friendly | 2 |
| Qualifying | 2 |

UI: "Name your squad for [Nation] - [Window Type]" with:

- Auto-pick by form / reputation
- Manual replacement
- Save & reuse "squad templates" (Youth-heavy / Conservative
  veterans / etc.)

**Caps + international retirement**:

- Track total + competitive caps + goals + assists
- 30+ players may retire from internationals (injury history /
  club focus / personality trait)
- Star retirement triggers event: "Star X retires from
  international duty; will you try to convince him to reconsider?"
  → persuasion dialog with success chance based on user rep +
  relationship

**Captaincy**:

- Defaults: highest leadership + caps; vice = second
- Events: dropping captain from tournament → media backlash + morale
  hit; changing captaincy risks upsetting senior players

### 4.5 Tournament management UX

**Pre-tournament (1-2 months before)**:

- Event: "Preliminary Squad of 35" (optional mini-game)
- Final decision: "Name your 23-man Tournament Squad"
- UI: comparison screen with stats + club form + positional depth
  chart
- Media pressure tags ("Public expects inclusion of veteran striker
  X")

**Training camp** (3 focus options; applied as temporary modifiers
over group stage):

1. Tactical cohesion (boost familiarity + small morale)
2. Physical prep (stamina + injury risk tweak)
3. Team spirit (morale boost + cohesion slower)

**Group stage** (3 matches in 10 days):

- Calendar compressed: MD1 → 3 days → MD2 → 4 days → MD3
- Between matches: light training choice (rest vs intensity) +
  rotation suggestion screen with fatigue / injury risk
- Group Table shows qualification scenarios ("A win guarantees
  progress; a draw may be enough if X happens")

**Knockouts** (single elimination):

- Pre-match talks / mood choices (calm vs aggressive)
- Penalty shootout mini-UX (select order + pick mental strength
  traits)

**Post-tournament**:

- Media debrief: 3 dialogue choices ("We overachieved" / "Matched
  expectations" / "Fell short")
- Board review: expectation vs actual → contract extension /
  warning / sacked from national role (club job unaffected)
- Long-term: rep spikes on deep runs; player reputations rise/fall

## 5. Manager career meta-progression

### 5.1 Make Your Career manager creator

Per D6 Q&A — full creator with Background + Badge + Specialisation +
Nationality + Languages.

**Background** (affects starting rep + talent-tree seed):

| Background | Starting rep | Talent-tree bonuses |
|---|---|---|
| Sunday League | Very low; strong underdog narrative | Spread evenly |
| Semi-Pro | Low | Motivator + Tactician weighted |
| Ex-Pro Player | Moderate; based on playing-level prestige | Motivator + Tactician heavily weighted |
| Ex-Director of Football / Analyst | Moderate-low | Transfer Guru weighted |

**Coaching Badge** (studyable over time):

- National C / B / A / Pro
- Start with: background-dependent badge
- Study costs money + time; yields attribute / talent unlock +
  reputation boost
- Soft-progression resource sink

**Tactical Specialisation** (primary + secondary):

1. Attacking
2. Defensive
3. Possession
4. Pressing
5. Youth Focus
6. Set-Piece Specialist

Effects:

- Slight tactical familiarity boost for matching styles (per D3
  familiarity model)
- Hiring bias: clubs whose preferred style matches more likely to
  offer jobs
- For national teams: style may fit or clash with "traditional
  identity" → drives media narratives

**Nationality + Languages**:

- Pick manager nationality + up to 2 languages
- Effects:
  - Club jobs: easier in matching-language countries (lower
    adaptation penalties)
  - National team jobs: nationality strongly affects offers from
    user's own country
  - Player communication bonuses when sharing language

### 5.2 5-branch talent tree

Per D6 Q&A — earned over career; 1 skill point per season + bonus
for major trophies. Inspired by CK3 dynasties + simplified for PWA.

Tree unlocks from season 2 onwards.

**Branches**:

1. **Tactician Path**
   - Effects: improved tactical familiarity speed (per D3 §6.5);
     small +xG from better in-match adaptation
   - Capstone: "Tournament Whisperer" (+5 % performance in knockout
     matches)

2. **Motivator Path**
   - Effects: better morale retention; improved performance in big
     matches + penalty shootouts (ties to D2 hidden meta `pressure`
     + `big_matches`)

3. **Youth Developer Path**
   - Effects: higher chance of top-potential regens (per D2 §11.3
     PA distribution); faster progression for U21s
   - Capstone: "Academy Legend" (club youth intake quality baseline
     raised)

4. **Transfer Guru Path**
   - Effects: better scouting info; slightly lower wage demands;
     more accurate potential estimates (per D2 §10.2 hidden
     potential)

5. **International Specialist Path**
   - Effects: improved performance cohesion for national teams;
     reduced club-vs-country tension; ties to §4 dual-role mode

### 5.3 Region-based reputation

Maintain rep per:

- Each of the 10 countries
- Continent
- Global

**Progression**:

- Dominate in one country → skyrockets local rep; slowly bleeds
  into continental + global
- Win IFC or major continentals → huge global rep boost

**Effects**:

- Job offers more likely in regions where user is famous
- National team jobs: priority to managers with strong national +
  regional rep (per §4.2)

Ties to I12 (Career: confidence thresholds + reputation per-region
- P1 gap).

### 5.4 Legendary manager detection

Per D4 §9.5 (locked): legendary when 3+ league titles OR 2+
continental trophies OR 5+ promotions.

When flagged, D6 extends:

- Unlock special cosmetic titles: "The Architect" / "The General"
- +1 extra talent point per season
- Personality drift caps relaxed to ±0.25 (legends "earn"
  eccentricity)
- Surfaced in narrative content + Hall of Fame (§7-8)
- **Future saves start with Legacy bonus**: slight rep boost + one
  pre-unlocked skill in talent tree (per §9)

## 6. Ownership transitions

### 6.1 Owner Profile schema

Each archetype is a data-driven Owner Profile:

```ts
interface OwnerProfile {
  archetype: OwnerArchetype
  budgetPolicy: {
    wageCapMultiplier: number      // 0.5-3.0 of league avg
    transferBudgetMultiplier: number
    cashInjection: number | null   // one-time, in credits
  }
  stability: number                // 0-1; chance they stick around
  clubDirection: {
    attackingBias: number          // 0-1
    youthFocus: number             // 0-1
    starFocus: number              // 0-1
    styleTags: string[]
  }
  riskTags: ('ffp' | 'regulatory' | 'sanctions' | 'fraud')[]
  narrativeFlags: string[]         // for newspaper + events
  satisfactionDecay: number        // per year if underperforming
  exitTrigger: 'underperformance' | 'rep_dropped' | 'regulatory' | 'natural_aging'
}
```

### 6.2 6 archetypes at MVP

Per D6 Q&A.

#### A. Sugar Daddy (Rising Rival driver)

**Use case**: Mid-table club, large city, stable finances but
underachieving.

**Effects**:

- Cash injection: `€[league_factor × (150-300 M)]` (one-time)
- Wage budget multiplier: ×1.5-2.0 for 5 seasons
- Transfer budget multiplier: ×2-3 for first 3 seasons
- Rep boost: +0.5-1.0 star club rep over 3 seasons if they perform
- Board expectations: quickly escalate to European spots / titles

**AI behaviour**:

- Aggressive bid algorithm: allows 10-20 % over-valuation on
  transfer targets
- Tendency to poach manager + star players from domestic rivals

**User impact (if own club is target)**:

- Pre-takeover rumour phase: press questions "Are you concerned
  about your future?"
- Offer resolution: new owner wants user to A) stay with new
  direction, or B) replace user unless N points in next M games
- Choice events:
  - **Align with owner**: accept constraints + objectives → bonus
    job security; commit to their style
  - **Resist publicly**: disagree → fan backing + risk immediate
    sacking
  - **Leave gracefully**: resign now; rep penalty light

#### B. Asset Stripper

**Use case**: Over-leveraged club; fallen giant; owner exiting.

**Effects**:

- Wage budget reduction: -30-50 %
- Forced star sale: within 2 transfer windows, sells top 3 wage
  earners
- Transfer budget: ~0; proceeds service debt
- Board expectations: survival / avoid bankruptcy
- Ticket prices: slightly decrease (PR spin) but revenue falls

**User impact**:

- Directives: "We must sell X before window closes"
- Tension events: user can publicly oppose board → morale boost
  with fans + risk of sacking

#### C. Foundation / Community Ownership

**Use case**: Traditional clubs, smaller towns, strong identity;
often after a crisis or fan takeover. Reference: Hattrick
"ownerless" + German 50+1 culture.

**Effects**:

- Strict wage cap: max 55-60 % of revenue
- No long-term debt accumulation
- Stability: very low takeover probability once in place
- Board expectations: realistic, slow growth; heavy emphasis on
  youth + local players

**AI behaviour**:

- Focus on youth academy + local-region scouting
- Avoid big-name transfers

#### D. Petrol-State / Nation-State Owner

**Use case**: Elite or aspiring elite clubs; high global
visibility.

**Effects**:

- Cash injection: €300-500 M initial; high long-term budgets
- Wage multiplier: ×2.5 for 8-10 seasons
- Reputation: near-max; easier to attract global stars
- Soft-power goal: high branding / trophy expectations (domestic +
  continental)
- Risk flag: **FFP investigation** after 3-5 seasons of
  overspending; punishments include transfer ban 1-2 windows /
  fines / point deductions

**AI behaviour**:

- Super-aggressive high-reputation signings
- Willing to overpay wages massively

**User impact**:

- If rival: this is the "Final Boss" of the save
- If own club: super-club play with win-now pressure; short leash if
  failing

#### E. Murky Owner

**Use case**: Mid-table or lower-tier clubs with shady backgrounds.

**Effects**:

- Moderate initial investment with risk of:
  - Sudden withdrawal of funds
  - FFP breaches
  - Reputation damage (fans uneasy + protests)

**AI behaviour**:

- Inconsistent transfer activity
- Higher chance of mid-season board dramas (sacking managers /
  interfering)

**Events**:

- "Money laundering investigation" possible → fines / transfer
  bans / forced sale (new takeover)

#### F. Foreign Business Ownership

**Use case**: Globalised marketing-driven owners.

**Effects**:

- Balanced investment: stable but not extreme
- Commercial focus: frequent stadium / naming-rights offers +
  friendly tours in owner's home market
- Long-term: increased commercial revenue growth rate

**AI behaviour**:

- Favours signing players from specific regions to tap markets
- Board requests "sign player from country X" objectives

**User impact**:

- Extra side-goals (sign players from owner's country)
- Marketing tours as optional pre-season events (small fatigue +
  moderate cash boost)

### 6.3 Takeover trigger model

Annual check at end of season:

For each club, compute `instability_score`:

```text
instability_score =
    financial_stress_factor    // +2 if cash < -0.2 × revenue; +1 if 2 consecutive seasons of loss
  + performance_factor          // +1 relegated; +1 narrow escape; +1 if 3+ seasons mid-table underperforming
  + ownership_factor            // +1 owner tenure > 15 years OR low satisfaction
```

If `instability_score >= 3` → takeover candidate.

Draw archetype from pool based on:

- Club market size (fanbase + city size)
- Current owner profile
- League reputation

**Global constraints**:

- Max **1 takeover / 5-7 seasons per league** (baseline)
- Max **2 meaningful takeovers per season globally** (avoid chaos)
- Weighting:
  - Financially unstable + large fanbase mid-table = Sugar Daddy
    candidates
  - Fallen giants in lower leagues = Sugar Daddy or Petrol-State
  - Over-leveraged + losing = Asset Stripper

Determinism: takeover decisions use
`worldAiMgmt:structural:year:<year>:takeover:<clubId>` sub-stream
(per D8 + D4 §10.4).

### 6.4 Bankruptcy / administration

Per D6 Q&A — include at MVP.

**Trigger** (annual financial audit, club enters Administration):

- 3 consecutive seasons of operating loss AND
- Wage bill > 90-100 % of revenue AND
- Cash < -0.5 × annual revenue AND
- No takeover / investor event triggered that season

If finances not stabilised within 2 seasons → enforced relegation OR
liquidation (very extreme; optional setting).

**Administration effects (on entry)**:

- Points deduction: -10 to -15 at start of next season
- Automatic transfer embargo: only frees / loans with low wages
- Board forced sale: accepts any "fair" bids on players above wage
  threshold
- Wage cap enforced: new deals < 40-50 % of revenue
- Reputation hit: club rep -0.5 stars; sponsor deals worsen
  temporarily

**User manager interaction**:

- **Pre-warning season**: board warns "We're on the brink; finish
  in X position or we may enter admin"
- **Heroic save path**: achieve survival targets + net positive
  transfer window → "White Knight" investor event triggered →
  user credited with "Saved the Club" in Hall of Fame
- **Escape path**: leave before admin → "Abandoned sinking ship"
  tag (slight HoF penalty for that club, but minimal long-term)
- **Inside admin**: job expectations shift to "Fight for survival"
  with heavy underdog bonus to HoF scoring if user keeps club up

## 7. Hall of Fame

Per D6 Q&A — full 3-layer system.

> **FMX-90 (2026-06-05):** the prestige/HoF/era model below is the raw material for
> the metric-input hand-off in
> [[dynasty-flatline-and-prestige-metric-inputs-2026-06-05]], consumed by **E6-3 /
> FMX-95** (owner of the ADR-0051 amendment + scoring formula + records book). FMX-90
> supplies the **input taxonomy** (manager-prestige / HoF-legend / era-detection
> inputs, MVP-flagged) and the **persist-raw-facts + version-the-formula** determinism
> rule (D4); it does not lock the §7 scoring numbers.

### 7.1 Manager HoF — per-save

**Scoring formula**:

```text
Score = Σ(trophy_value × competition_weight × difficulty_multiplier
        × underdog_bonus)
      + longevity_bonus
      + loyalty_bonus
      - scandal_penalties
```

**Trophy values**:

| Trophy | Value |
|---|---|
| Domestic top league | 100 |
| Domestic cup | 40 |
| Continental major (Champions Cup) | 200 |
| Continental secondary (Continental League) | 120 |
| Continental tertiary (Challenge Trophy) | 60 |
| IFC Club World Masters | 220 |
| IFC Nations Championship | 220 |
| Continental national championship | 180 |
| Promotion (per tier) | 20 |

**Multipliers**:

- League strength: top-5 ×1.2 / secondary ×1.0 / minor ×0.8
- Difficulty: Sim ×1.3 / Hard ×1.15 / Normal ×1.0 / Easy ×0.7
- Underdog: preseason ≤ 8th and won league = +50 % (scaled by
  gap); club rep < league avg = +10-30 %

**Bonuses**:

- Longevity: +1 per season managed; +2 per season at same club
  beyond 5 years
- Loyalty: +50 if 10+ years at one club; +20 if retire at a club
  where user is legend

**Penalties**:

- -10 to -100 for severe FFP breaches / repeated relegations
  after overspending (if user decision log shows overspending
  suggestions accepted)

**Per-save HoF UI**: top 20 managers with portrait + primary club
crest + timeline + key stats + signature titles ("Architect of
[Club X] Golden Age").

### 7.2 Manager HoF — cross-save (global)

Stored in separate local-storage meta file. **Read-only by sim;
never feeds runtime RNG** (deterministic-safe per D8).

Recorded fields per career:

- Manager name (user-chosen)
- Career score (using §7.1 formula, normalised)
- Difficulty + career length + main club
- Save seed hash (nostalgia only; not used in sim)
- Achievement flags (12 dynasty achievements from D5)

**UI**: single screen listing top 10-20 managers across saves.
Filter by difficulty / era / club.

### 7.3 Club HoF — per save

Per club. Autonomous; never crosses saves.

Tracked:

- **Trophy cabinet timeline** (FM-style, condensed)
- **Era detection**: 3-8 year spans with significantly above-
  average points + trophies → labelled "Golden Era" / "Resurgence
  Era"
- **XI-of-decade**: every 10 seasons, auto-calculated best XI by
  appearances + ratings + trophies
- **Milestones**: first promotion to top tier / first continental
  qualification / invincible season / record points

UI: history tab like FM Club History but simpler; integrated with
newspaper archive (§11.5).

### 7.4 Player Legends — per save

**Club Legend detection algorithm**:

Player becomes Club Legend when ALL met:

- 5+ seasons at club AND
- ≥ 150 competitive apps AND
- At least 2 of:
  - Major role in trophy-winning seasons (≥ 30 games in title
    season)
  - Club record holder (goals / appearances / assists)
  - Iconic match rating (≥ 9.5 in final or derby)

**Tiers**:

| Tier | Effects |
|---|---|
| **Icon** | Statue erected / stadium-stand named (cosmetic); shirt retirement if 10+ years + record goals/apps |
| **Legend** | Profile flag + listed in club Legends tab |
| **Favourite / Hero** | Smaller flag; warm reception when returning |

**National team legends**: similar criteria but with caps +
captaincy + key tournament involvement.

## 8. Legacy mode

Per D6 Q&A — 3 options at career end.

### 8.1 Career end triggers

- User explicit retirement
- Forced retirement at age cap (per D4 §9.4: Normal(67, 4) clamped
  [60, 75])

### 8.2 Option A: Retire as Chairman / DoF

Low-touch meta role:

- User stops day-to-day management
- Gets:
  - Budget slider influence (approve budgets)
  - High-level policies (youth focus vs star signings; club
    philosophy)
- Game fast-forwards seasons quickly (auto-sim results)
- User mostly watches:
  - Club trajectory
  - Whether successor honours legacy

### 8.3 Option B: Start new manager at lower club in same universe

- User continues as new character; old club becomes AI-managed
- Previous manager appears as retired legend in HoF + club history
- Chance former players become managers → may appear as rivals
- Same save universe; continuity preserved

### 8.4 Option C: Hard retire + Career retrospective

- Game shows:
  - Season-by-season achievements
  - Map / timeline of clubs managed
  - Graph of reputation + trophies + finances
- User can:
  - Save retrospective to global HoF
  - Start new save (new world) with **Legacy bonuses** (§9)

### 8.5 Manager statue / naming

If user qualifies as Icon at a club AND (10+ years at club OR 5+
major trophies):

- Club event: "Statue erected" / "Stadium stand named after you"
- Cosmetic only but referenced in newspaper headlines + club
  history page ("the north stand bears your name")

Reference: Anstoss 3 "Eternal Fame" + FM city icons.

## 9. Cross-save persistence + Legacy perks

Per D6 Q&A — full cross-save with deterministic-safe meta-only
Legacy perks.

### 9.1 What persists

Stored in **global meta file** (local storage, separate from save
files):

- Global Manager Hall of Fame entries (top 10-20)
- Dynasty achievements (12 from D5; per-save earned, cross-save
  recorded)
- Unlocked Legacy perks / talent-tree upgrades

### 9.2 Determinism safeguard

**Critical rule**: simulation reads **nothing** from this meta
file once a save is created.

- New save creation uses:
  - Base seed (random or user-specified)
  - Legacy perks as **parameters at world-gen only**, not runtime
    dynamic input
- Replays + restores:
  - Save snapshot includes all parameters used at generation
  - Reloading from a save snapshot **ignores** any meta progression
    earned since that snapshot
- Result: same seed + same legacy configuration at creation → byte-
  identical world; but user never changes perks mid-save

### 9.3 Legacy perk tree (3 tiers)

**Tier 1** — unlocked after first completed 10+ season career:

| Perk | Effect at world-gen |
|---|---|
| Tactician | +1 unlocked tactical slot (D3 §6.6: 3 → 4 slots) |
| Networker | Slightly better initial scouting knowledge |
| Youth Whisperer | 5 % higher chance of one special high-potential youth in season 1 youth intake |

**Tier 2** — unlocked after ≥ 3 careers + certain HoF thresholds:

| Perk | Effect |
|---|---|
| Global Reputation | Start with moderate manager rep instead of unknown |
| Financial Savvy | Slightly higher initial board confidence + trust in budget handling |

**Tier 3** — unlocked after major achievements (e.g. triple
continental winner):

| Perk | Effect |
|---|---|
| Legendary Name | Rare chance a regen player in new saves uses user's surname + has slight potential bias (pure flavour + tiny effect) |

All bonuses:

- Small enough to not break balance
- Implemented as deterministic seeds from global meta state → new
  save seed
- No runtime cross-talk

## 10. Manager career meta-progression (consolidated)

Putting §5 + §7 + §9 + D4 + D5 together:

```text
Career start
  ├─ Make Your Career creator (§5.1)
  │   ├─ Background → starting rep + talent-tree seed
  │   ├─ Coaching badge → unlocks studyable over time
  │   ├─ Tactical specialisation → familiarity + hiring bias
  │   └─ Nationality + languages → job offers + player comms
  │
  ├─ Career phases UI (§11.1; per Civ-style era labels)
  │
  ├─ Per-season:
  │   ├─ 1 talent point + bonus on major trophies → spend on 5-branch tree (§5.2)
  │   ├─ Region rep update (§5.3)
  │   ├─ Legendary check at season end (§5.4)
  │   ├─ Dynasty achievement check (per D5)
  │   └─ Records book updates (§11.6)
  │
  ├─ National team unlock at rep ≥ 75 + (5 seasons OR 3 trophies)
  │   └─ Dual-role with 3 engagement levels (§4)
  │
  ├─ Owner takeovers (§6) periodically reshape the world
  ├─ Continental cups (§3) provide endgame trophies
  ├─ Bankruptcy events (§6.4) provide heroic-save HoF opportunities
  │
  └─ Career end:
      ├─ Option A: Chairman / DoF (low-touch meta)
      ├─ Option B: New manager lower club (same universe)
      └─ Option C: Hard retire → Career retrospective
                  → Save to global HoF (§7.2)
                  → Start new save with Legacy perks (§9.3)
```

## 11. 50-year save longevity systems

Per D6 Q&A — full stack (6 systems).

### 11.1 Career phases UI

Not enforced systems, but visible timeline labels:

| Phase | Years | Focus |
|---|---|---|
| **Build-up** | 1-3 | Establishing identity; first trophies / promotions |
| **Ascent / Dominance** | 4-7 | Rivalry narratives; first continental runs |
| **Dynasty Defence** | 8-15 | Challenge events: Rising Rival, Giant Collapse, admin cases, owner changes |
| **Legacy** | 15+ | Records, club legends, regens of former players, long-term economic shifts |

UI: timeline strip on Manager Profile screen segmented into phases
with key milestones marked.

### 11.2 Generational regen markers

When a player retires:

- 5-10 years later, random chance (5 % default) of generating a
  regen with:
  - Relation: "Son of [Player X]" or "Relative of [Player X]"
  - Position bias toward parent's
  - Same nationality / heritage
  - Slight potential bias (+5 % max potential)

Eligibility: only for players above reputation threshold OR Club
Legend status.

UI: player profile shows "Son of Club Legend [Name]" tag; special
headlines when they debut OR sign for parent's club.

Determinism: uses `generator:regen:son-of:<parentPlayerId>:<years-
after-retirement>` sub-stream (D8-compatible).

### 11.3 Year-X / era events

Periodic global events to avoid staleness:

| Event | Cadence | Description |
|---|---|---|
| **Anniversaries** | Every 25 years of manager career OR major club milestones | Commemorative match vs classic rival; special kit colours (cosmetic); slight temporary attendance spike |
| **League reform** | Every 15-20 seasons | Adjust league size (20→18); introduce playoffs for last CL spot / relegation; new foreign player rules. Pre-announced 2-3 seasons in advance |
| **Stadium / infrastructure** | Every 8-12 years for big clubs | New stadium / major expansion; naming rights offers (more likely with Foreign Business / Petrol-State owners). User choice: accept naming rights (cash + fans divided) / reject (less money + more fan love) |
| **Regional festivals / cups** | Bi- or tri-annual | Minor cups / regional tournaments with small reward + flavour (inspired by Anstoss friendlies) |

### 11.4 Cross-decade continental power shifts

Track 10-year rolling performance for each continent (average semi-
finalists in Club World Masters + IFC Nations Championship titles +
continental titles).

**Era labels** (auto-applied):

- "European Dominance" — Europe wins ≥ 6 of last 10 Club World
  Masters / IFC Nations Championships
- "South American Renaissance" — Americas wins 4-6 of last 10
- "Asia-Pacific Rise" — APFC ≥ 3 of last 10
- "African Awakening" — AFA ≥ 2 of last 10

When one region dominates for 8+ years:

- Slight rep + financial boost to that region's leagues
- Increased transfer outflow from weaker regions

UI: global overview screen with graphs by decade + newspaper
headlines summarising era transitions.

Reference: Civ "Eras" feel + FM vague continental strength; we make
it explicit.

### 11.5 Anstoss-style newspaper archive

**Data model per season**:

- Summary: champions / cup winners / top scorer / promotions /
  relegations / user club final position + key storyline tagline
- Event highlights: takeovers / bankruptcies / Giant Collapse /
  Rising Rival / major retirements / club legends / record-breaking
  matches / sacking + appointments of notable managers

**UI**:

- Newspaper screen with tabs by year
- Each season = 3-7 article headlines
- Filter: "My club only" / "Major world events"
- **Compression**: old seasons compress into "Decade
  retrospectives":
  - "The 2040s: Era of [Club X] and [Star Player Y]"

Reference: Anstoss 3 Zeitung + FM news but with archive structure.

### 11.6 Records book

Per save. Auto-tracked.

**Club + league records**:

- Team: most goals in a season / fewest goals conceded / highest
  win streak / longest unbeaten run / most consecutive titles /
  most consecutive promotions
- Player: most goals for club + league / most apps for club +
  league / oldest + youngest scorer / fastest hat-trick

**Mechanics**:

- Every match result processed → check record thresholds for
  relevant competitions
- Record broken → event + newspaper headline
- User club records highlighted in end-of-season summary

Reference: Hattrick club history + record pages + FM records
screens.

## 12. Performance + storage budgets

Per D9 (locked):

### 12.1 Bundle

| Component | Budget |
|---|---|
| Continental cup module (data + scheduler) | ~30-40 KB gzipped |
| National team mode UI | ~25-35 KB gzipped |
| Hall of Fame module | ~15-20 KB gzipped |
| Legacy mode + Make Your Career creator | ~20-25 KB gzipped |
| Owner archetypes + takeover events | ~10-15 KB gzipped |
| Newspaper archive + records book | ~15-20 KB gzipped |
| **Total D6 late-game bundle** | **~115-155 KB gzipped lazy-loaded** |

Within D9 per-route lazy ≤ 200 KB budget. Late-game modules NOT
loaded on initial app launch — only when entering relevant screens
(e.g. opening Hall of Fame for the first time).

### 12.2 IndexedDB storage

Per save:

| Item | Size |
|---|---|
| Continental cup history (per season) | ~50 KB compressed |
| National team caps + tournament history | ~20 KB per nation per save |
| Manager career stats + region rep | ~10 KB |
| Per-save Manager HoF (top 20) | ~15 KB |
| Club HoF data (10 clubs × histories) | ~50 KB |
| Player Legend metadata | ~10 KB per save |
| Newspaper archive (50 seasons) | ~200 KB compressed (with decade compression) |
| Records book | ~10 KB |

Total per Large 50-year save: ~400 KB late-game-data overhead;
within D9 200 MB total IndexedDB budget.

Global meta file (cross-save):

- Manager HoF cross-save entries: ~50 KB max (capped at top 20)
- Legacy perks + unlocked achievements: ~5 KB

Total cross-save meta: < 100 KB.

## 13. IndexedDB schemas

### 13.1 Per-save schemas

```ts
// continental_cup_history (per save)
interface ContinentalCupHistoryRecord {
  season: number
  competition: 'efc-cc' | 'efc-cl' | 'efc-ct' | 'afu-cc' | ...
  participants: ClubId[]
  results: MatchSummary[]
  winner: ClubId
  runner_up: ClubId
}

// national_team_history (per save, keyed by nation)
interface NationalTeamHistoryRecord {
  nation_id: NationId
  manager_id: ManagerId
  era_start: string                   // ISO date in-game
  era_end: string | null
  matches_played: number
  matches_won: number
  tournaments: TournamentResult[]
  legendary_caps: PlayerId[]
}

// manager_career (per save, single row)
interface ManagerCareerRecord {
  manager_id: ManagerId
  background: 'sunday_league' | 'semi_pro' | 'ex_pro' | 'ex_dof'
  coaching_badge: 'C' | 'B' | 'A' | 'Pro'
  tactical_specialisation: [SpecId, SpecId]  // primary + secondary
  nationality: NationId
  languages: NationId[]
  talent_tree: TalentTreeState
  region_rep: Record<NationId, number>       // 0-100
  global_rep: number                         // 0-100
  legendary: boolean
  career_stats: CareerStats
}

// hall_of_fame (per save, manager + club + legends)
interface HallOfFameRecord {
  managers: ManagerHoFEntry[]               // top 20 in this save
  clubs: Record<ClubId, ClubHoFData>
  player_legends: Record<PlayerId, PlayerLegendData>
}

// newspaper_archive (per save)
interface NewspaperArchiveRecord {
  season: number
  headlines: HeadlineEntry[]
  user_club_storyline: string
  compressed_decade?: DecadeRetrospective    // only present for seasons > 10 years ago
}

// records_book (per save, single row)
interface RecordsBookRecord {
  team_records: Record<string, RecordEntry>     // 'most_goals_season' → {value, holder, season}
  player_records: Record<string, RecordEntry>
  club_records: Record<ClubId, Record<string, RecordEntry>>
}
```

### 13.2 Cross-save meta schema

```ts
// global_meta_file (cross-save, single document in local storage)
interface GlobalMetaFile {
  version: number
  manager_hof_entries: ManagerHoFCareerEntry[]  // top 10-20 across all saves
  dynasty_achievements_unlocked: AchievementId[] // 12 from D5
  legacy_perks_unlocked: {
    tier_1: PerkId[]
    tier_2: PerkId[]
    tier_3: PerkId[]
  }
  career_completed_count: number
  total_hof_score: number
  last_updated: string                          // ISO timestamp
}

interface ManagerHoFCareerEntry {
  manager_name: string                          // user-chosen
  career_score: number                          // normalised
  difficulty: DifficultyTier
  career_length_seasons: number
  main_club_name: string
  save_seed_hash: string                        // nostalgia only; not used in sim
  achievement_flags: AchievementId[]
  background: ManagerBackground
  signature_titles: string[]                    // e.g. "The Architect"
  retired_at: string                            // ISO timestamp
}
```

## 14. Open follow-ups (deferred)

- **D15 Narrative event content & authoring pipeline**: full
  newspaper article text + reactive variants + season summary
  generators
- **D7 Mobile UX + IA + accessibility**: HoF + newspaper + records-
  book UI patterns
- **A8 ADR-0008 Mobile-first UI**: should absorb Manager Profile +
  Career timeline + HoF screens
- **D13 Women's football data model**: national team mode needs
  female variants (deferred per D2 §14)
- **I12 Career: confidence thresholds + reputation per-region** (P1):
  refines §5.3 with per-region reputation accumulators
- **K1 Player onboarding docs**: external help for HoF + Legacy mode
- **Phase 4 — Assistant national team coach intermediate role**: see
  §4.2

## 15. Sources

- Perplexity Sonar research, 2026-05-17 (gap D6): continental cup
  stack 2026 - 3-tier structure (UEFA 2021+ analogue); classic
  groups vs Swiss model; qualification rules; calendar / scheduling
  rules; prize money structure; country + club coefficients;
  competitor analysis across FM PC / FM Mobile / EA FC / PES / Top
  Eleven / OSM / Hattrick / SM24 / Anstoss 3 / FM Online (Korea).
  Fictional IP-safe naming for governing bodies (IFC / EFC / AFU /
  APFC / AFA) and competitions (Champions Cup / Continental League /
  Challenge Trophy / Club World Masters).
- Perplexity Sonar research, 2026-05-17 (gap D6): Bundestrainer /
  national team manager design - dual-role with 3 engagement levels
  (Full Control / Match-Only / Light Touch); unlock conditions (rep
  ≥ 75 + 5 seasons OR 3 trophies); job market; squad selection;
  call-up windows; eligibility + retirement; captaincy; tournament
  management UX (training camp / group stage / knockouts / post-
  tournament); manager career meta-progression with Make Your Career
  creator + 5-branch talent tree + region-based reputation;
  legendary detection extensions; "goldfish brain" effect strategies;
  competitor analysis Anstoss 3 Bundestrainer + FM PC dual-role +
  EA FC International Career + PES Master League.
- Perplexity Sonar research, 2026-05-17 (gap D6): late-game meta
  layer - 6 owner archetypes (Sugar Daddy / Asset Stripper /
  Foundation-Community / Petrol-State / Murky / Foreign Business)
  with full Owner Profile schema + takeover triggers + user decision
  points; bankruptcy / administration system; 3-layer Hall of Fame
  (Manager per-save + cross-save + Club + Player Legends) with
  scoring formulas + era detection + XI-of-decade + legend tier
  detection algorithm; 3-option Legacy mode (Chairman / new manager
  / hard retire); cross-save persistence with deterministic-safe
  Legacy perks (3-tier unlock); 50-year save longevity stack
  (career phases UI / generational regens / Year-X events /
  continental power shifts / newspaper archive / records book);
  competitor analysis FM 50-year saves + EA FC ~5-season ceiling +
  Hattrick 27-year saves + CK3 dynasty system + Civ Hall of Fame.
- Locked context: [[ai-manager-behaviour]] (D4 §10 Rising Rival +
  Giant Collapse + §11 deferred late-game), [[data-generators]]
  (D2 §10.4 eligibility + heritage), [[onboarding-strategy]] (D5
  12 dynasty achievements), [[determinism-and-replay]] (D8 cross-
  save determinism safeguard), [[../50-Game-Design/mode-manage-a-club-career]]
  (§7 Bundestrainer stub), [[../50-Game-Design/regulations-and-compliance]]
  (continental cups + UEFA-analogue body), [[anstoss-series-deep-dive]]
  (Bundestrainer iconic feature).
- D6 Q&A with Nico (2026-05-17): all 10 recommendations accepted
  as-is. Maximum scope locked.
