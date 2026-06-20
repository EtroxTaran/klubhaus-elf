---
title: AI Manager Behaviour — Architecture, Personalities, Difficulty, World Drift
status: current
binding: true
tags: [research, ai, utility-ai, manager-personality, difficulty, world-drift, dynasty, determinism]
context: ai-world-simulation
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[../10-Architecture/bounded-context-map]], [[determinism-and-replay]], [[match-engine-simulation-model]], [[data-generators]], [[performance-budgets]], [[../50-Game-Design/tactics-system]], [[../50-Game-Design/mode-manage-a-club-career]], [[../50-Game-Design/scouting-and-recruitment]], [[../50-Game-Design/squad-and-club-structure]]
---

# AI Manager Behaviour — Architecture, Personalities, Difficulty, World Drift

> Gap D4 of [[../95-Archive/gap-reports/wave-3-gap-analysis]]. Locks the AI manager decision system
> for an offline-first PWA football manager: utility-AI core + FSM
> situation classifier + heuristic constraints; 8-trait personality
> vector with 10 archetypes; in-match + out-of-match decision pipelines;
> 4-tier difficulty model; explicit world-drift + dynasty-anti-staleness
> mechanics. Without this gap closed the match engine has nothing to do.

## 1. Context and inputs

This note assembles a complete AI architecture on top of already-locked
foundations:

- **D8 Determinism + Replay** ([[determinism-and-replay]]): two of the
  9 RNG streams are pre-allocated for AI use — `WorldAiMgmtRng` (stream
  #2, out-of-match) and `MatchAiRng(matchId)` (stream #4, in-match).
  Adding new AI sub-systems uses additional labels under these
  streams; no schema changes needed.
- **A3 Match Engine** ([[../10-Architecture/09-Decisions/ADR-0003-match-engine]]):
  `packages/match-engine/` is framework-agnostic. AI lives **outside**
  it but invokes it via `simulate(input)`. In-match AI runs in the
  same Web Worker as the match engine.
- **B2 ADR-0011 Server-Authoritative Multiplayer**: AI-vs-AI matches
  store seed-only by default (per match-record policy); on-demand
  re-sim runs the same AI logic. Hot-seat → async-MP promotion means
  the same AI code path must run on client AND server post-MVP.
- **D2 Data Generators** ([[data-generators]]): player attribute schema
  (16 visible + 4 GK + 8 hidden meta) defines what the AI can read.
  Manager records are part of the world genesis (one per club +
  unemployed pool).
- **D9 Performance Budgets** ([[performance-budgets]]): ~5 s total for
  processing 700 clubs / game-week on Snapdragon 695 → **~7 ms /
  club / week** out-of-match budget. AI-vs-AI match has 30 ms total
  (no narrative); human-involving matches have 50 ms total.
- **Bounded Context Map** ([[../10-Architecture/bounded-context-map]]):
  AI decisions split across **League** (league-wide drift / structural
  shocks), **Club** (per-club personality + squad management), and
  **Transfer** (transfer market mechanics) contexts.
- **ADR-0007 Naming Schema**: AI manager names use the same procedural
  pipeline as player names (D2 §4).

This note adds: the full AI decision pipelines, personality system,
archetype library, difficulty model, world drift mechanics, career arc
mechanics, and the cross-difficulty tuning tables.

## 2. Comparative analysis — how other manager games handle AI

Distilled from public dev commentary, modding community knowledge,
and product analysis.

### 2.1 Comparison table

| Game | AI architecture | Personality system | Difficulty model | Anti-staleness mechanics |
|---|---|---|---|---|
| **Football Manager** (PC) | Utility-style heuristics + role-based suitability scoring + deep transfer AI | Implicit (manager attributes; rep + tactical bias) | Single "simulation" tier — challenge is emergent | Emergent economy, regens, manager market; widely regarded as best long-game |
| **FM Mobile** | Simplified FM with template-based behaviour | Limited; rep + style | Single tier | Same as FM but lighter |
| **Anstoss 3** (legacy DE) | Personality-driven decision rules ("Erni Buntspecht" old-crook archetype famous) | Strong coarse personalities (Old Crook / Youth Guru / Mercenary) | None / fixed | Manager personalities + Bundestrainer career mode |
| **OSM** | Turn-based; auctions are user-driven; minimal AI managers | None | None | Short seasons restart-friendly |
| **Top Eleven** | Server-sim; thin opponent AI | None | "Manager level" progression | Season resets every 28 days |
| **Hattrick** | Turn-based; 27+ years of real play; long-term economy | None | None | Long-term economy + youth pulls + promotion/relegation |
| **EA SPORTS FC Career** | Real-time; opponent coach AI tweaks formation + subs | Minimal; coach attributes | "World Class / Legendary / Ultimate" — AI gets stat bonuses (Civ-style cheats) | Famously poor; goes stale ~5 seasons; deadline-day spam common |
| **PES / eFootball Master League** | Real-time; tactical AI | Limited | Similar to EA FC | Similar staleness pattern |
| **SM24** | Moderate; Unity-based, simple AI | Limited | 3 tiers | Limited |
| **Champ Man Mobile** (legacy) | Simple if-then heuristics | None | None | Limited |

### 2.2 The two camps (and where we land)

The market splits cleanly into:

- **Single-difficulty emergent games** (FM, FM Mobile, Hattrick) where
  challenge comes from the world's depth, not difficulty dials.
- **Multi-difficulty AI-cheat games** (EA FC Career, PES Master
  League) where harder modes give the AI flat stat boosts.

We adopt the **FM-style "constraints + AI optimisation"** approach
with **4 difficulty tiers** for accessibility, but no AI stat cheats
on Normal/Hard/Sim. Easy gets minor stat help for the user only
(onboarding aid), not the AI.

### 2.3 Techniques we adopt

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Utility AI as core decision mechanism** | FM (essentially); 4X games; modern sports sims | §3 — primary architecture |
| 2 | **Manager personality vector + archetypes** | Anstoss 3 (Erni Buntspecht); FM (subtler) | §4 — 8 traits + 10 archetypes |
| 3 | **Trigger-based in-match decisions** | FM (Touchline Tablet); FIFA Career | §7 — HT/60/75/85 + event triggers |
| 4 | **Per-role squad gap analysis** | FM, FM Mobile | §6.1 — `roleNeed[R]` formula |
| 5 | **Multi-club bid escalation** | FM (gold standard) | §6.3 — escalation + walk-away rules |
| 6 | **Job security as continuous value** | FM, Anstoss 3 | §9 — board confidence 0-100 |
| 7 | **Wage inflation tied to success** | Real-world football, FM | §10.1 — moderates dynasties |
| 8 | **Progressive FFP** | Real-world UEFA / DFL | §10.1 + §8 — soft → hard penalties on Sim |
| 9 | **Tactical arms race / opposition memory** | FM (partial), our extension | §10.4 — **our improvement** |
| 10 | **Talent diffusion (regen anti-hoarding)** | Hattrick (regional), our extension | §10.2 — **our improvement** (40 % elite regens spawn outside top clubs) |

### 2.4 Our unique style

Where we differ from every competitor:

- **Determinism + replay-stable AI**: same world seed + same inputs →
  byte-identical AI decisions. Enables **global challenge seasons**
  ("everyone plays the same 2030 world seed; can you win the league
  with Club X by Year 5 on Sim mode?") and reliable AI-vs-AI re-sim
  per ADR-0011. No competitor guarantees this.
- **Per-manager difficulty in shared async-MP worlds**: multiple
  humans in the same world, each with their own difficulty, dynamically
  counter AI dominance. Hattrick / OSM have multi-human worlds but
  no difficulty per manager.
- **Roguelite mode as built-in dynasty refresh** (per Create-A-Club
  GDD): career ends on sack / failed objective → meta-progression
  unlocks; world continues with new generation. Solves late-game
  staleness natively — no equivalent in FM / EA FC / SM.
- **Lazy expansion of AI managers** (per D2 pattern): full personality
  + decision history only for managers the user has interacted with;
  Tier C AI managers store compact profiles, expand on first contact.
- **Web Worker-batched weekly tick** within ~5 s on Snapdragon 695:
  desktop competitors (FM PC) take 30-60 s for similar work; we ship
  comparable depth in a PWA.

## 3. AI architecture

### 3.1 Approach: utility AI core + FSM situation classifier + heuristic constraints

Per the D4 Q&A, three-layer hybrid:

```text
┌──────────────────────────────────────────────────────────────┐
│  Layer 3: Heuristic CONSTRAINTS                              │
│    Hard rules + caps (wage > N % budget unless desperate;    │
│    never bid > 1.5x value; squad min sizes; etc.)            │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  Layer 2: UTILITY EVALUATION                                 │
│    For each decision: enumerate candidates → score via       │
│    weighted utility functions → argmax (with optional fuzz)  │
└──────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: SITUATION FSM (thin meta-controller)               │
│    ClubSituation = TitleRace / EuropePush / MidtableSafe /   │
│    RelegationBattle / Rebuild / FinancialCrisis              │
│    Picks which utility weights + heuristics apply this week  │
└──────────────────────────────────────────────────────────────┘
```

Layer 1 (FSM) is cheap (a handful of condition checks per club per
week) and gives utility evaluations strong context. Layer 2 (utility)
is where most decisions happen. Layer 3 (heuristics) prevents
pathological behaviour (FIFA Career-style deadline-day spam).

### 3.2 Why not pure alternatives

- **Pure utility AI** (no FSM): loses high-level context grouping; you
  end up encoding "what phase is this club in?" inside every utility
  function instead of once at the top.
- **Behaviour trees**: wrong abstraction for sparse deliberate
  decisions (manager AI doesn't tick 60 Hz; it ticks per game-week +
  per match event).
- **GOAP / HTN**: combinatorial explosion; planning multi-season
  sequences over dozens of actions is overkill — managers are
  **myopic but informed**, not multi-step planners.
- **Neural-net / RL**: bundle bloat (multi-MB even for tiny nets),
  inference runtime cost, determinism fragility, designer-tuning
  iteration nightmare. Inappropriate for indie + offline-first.
- **Pure rule-based**: 1000+ rule files become unmaintainable;
  regression risk on every change.

### 3.3 Package layout

```text
packages/ai-manager/
  src/
    architecture/
      utility.ts            # generic utility primitives
      situation.ts          # ClubSituation FSM
      constraints.ts        # heuristic caps + hard rules
    personality/
      traits.ts             # 8 primary + 3 derived traits
      archetypes.ts         # 10 archetypes
      drift.ts              # career-driven personality evolution
    decisions/
      transfers/
        scouting.ts
        targeting.ts
        bidding.ts
        contracts.ts
        selling.ts
      tactics/
        formation.ts
        approach.ts
        set-pieces.ts
        instructions.ts
      match/
        substitutions.ts
        formation-switch.ts
        mentality.ts
        time-management.ts
      squad/
        rotation.ts
        training.ts
        youth-promotion.ts
        loans.ts
      board/
        job-security.ts
        hiring.ts
        firing.ts
        budget-requests.ts
      facilities/
        stadium.ts
        training-grounds.ts
        sponsorships.ts
    difficulty/
      tiers.ts              # 4 difficulty modes
      modifiers.ts          # per-tier knob tables
    world-drift/
      economic-feedback.ts  # wage inflation + FFP
      talent-diffusion.ts   # regen distribution
      arms-race.ts          # tactical counter-templates
      structural-events.ts  # new investor + giant collapse
      expectations.ts       # board expectation escalation
    career-arcs/
      job-churn.ts
      retirement.ts
      legendary-detection.ts
      rival-tracking.ts
    cadence/
      weekly-tick.ts        # out-of-match orchestrator
      match-decisions.ts    # in-match trigger handler
      monthly-tick.ts       # contracts, expectations
      seasonal-tick.ts      # facilities, youth recruitment
```

Bundle target: ~60-80 KB gzipped (within D9 budget; same envelope
as the match-engine package).

### 3.4 Public API

```ts
// packages/ai-manager/src/index.ts

export interface WeeklyAITickInput {
  worldSeed: number
  worldState: WorldState           // read-only snapshot
  rng: PCG32                       // pre-derived from WorldAiMgmtRng
  currentWeek: number
}

export interface WeeklyAITickOutput {
  transferActions: TransferAction[]
  contractActions: ContractAction[]
  tacticalPlans: Map<ClubId, TacticalPlan>
  rotationPlans: Map<ClubId, RotationPlan>
  boardEvents: BoardEvent[]
  structuralEvents: StructuralEvent[]   // rising rival, giant collapse
}

export interface MatchAIInput {
  matchState: MatchState           // read-only
  matchAiRng: PCG32                // pre-derived from MatchAiRng(matchId)
  managerProfile: ManagerProfile
  difficulty: DifficultyTier
}

export interface MatchAIDecision {
  substitutions: SubstitutionAction[]
  formationChange?: FormationChange
  mentalityChange?: MentalityChange
  instructionsUpdate?: InstructionsUpdate
  setPieceTakerUpdate?: SetPieceTakerUpdate
}

export interface AIManager {
  runWeeklyTick(input: WeeklyAITickInput): WeeklyAITickOutput
  decideMatchAction(input: MatchAIInput): MatchAIDecision
}
```

Same contract runs client-side (singleplayer) and server-side
(post-MVP async MP).

## 4. Manager personality system

### 4.1 The 8 primary traits + 3 derived

All continuous in `[0, 1]` with 0.5 = neutral.

#### Primary traits (8)

| Trait | Drives |
|---|---|
| `tacticalAttacking` | Formation choice (more forwards/AMs); mentality bias toward attacking; pressing line; training emphasis |
| `pressingPreference` | Base pressing intensity; defensive line height; sprinting volume |
| `youthTrust` | Youth promotion willingness; loan-out rate; potential-vs-CA weight in transfers |
| `starPreference` | Marquee-signing willingness; squad-imbalance tolerance for stars; wage-budget breach risk |
| `transferAggressiveness` | Frequency of bids; transfer-window activity; "buy low / sell high" volume |
| `bargainSeeking` | Reputation-vs-value weight in target scoring; willingness to chase undervalued players |
| `riskTaking` | Bid escalation cap; mentality-shift severity; deadline-day boldness; bid above `feeEstimate` |
| `tinkering` | Formation-change frequency; in-match mentality-cooldown; rotation severity |

#### Derived traits (3, computed from primaries)

| Derived | Formula |
|---|---|
| `loyalty` | `1 - 0.5 * (transferAggressiveness + tinkering) / 2` |
| `fitnessFocus` | `0.4 * (1 - tacticalAttacking) + 0.6 * (1 - tinkering) + small_noise` (defensive low-tinker managers care more about fitness) |
| `wageDiscipline` | `0.5 + 0.3 * bargainSeeking - 0.3 * starPreference` (clamped to [0.2, 0.95]) |

### 4.2 Personality → utility integration

Personality enters utility functions as **weight modifiers** and
**caps**, never as override rules:

```ts
// Example: transfer target utility
const u =
    w_quality * curveQuality(player.ability) *
      (1 + STAR_MULTI * (manager.starPreference - 0.5))
  + w_potential * curvePotential(player.potential) *
      (1 + YOUTH_MULTI * (manager.youthTrust - 0.5))
  + w_value * curveValue(player.valueRatio) *
      (1 + BARGAIN_MULTI * (manager.bargainSeeking - 0.5))
```

Magnitude caps:

- Personality modifies any utility component by at most ±30 % (multipliers
  in [0.7, 1.3]).
- Personality NEVER changes the structure of a decision (no archetype
  has unique decision logic).
- Personality changes thresholds (e.g. `subUtilityThreshold *= (1 + 0.3 * conservatism)`)
  by at most ±30 %.

This keeps behaviour predictable + tunable. Designers can adjust trait
values without breaking AI behaviour; lint-rule + golden tests catch
regressions.

### 4.3 Personality drift over career

Career evolution at end of each season:

```ts
function applyCareerDrift(
  manager: ManagerProfile,
  seasonResult: SeasonResult,
  rng: PCG32
): ManagerProfile {
  const archetypeBase = ARCHETYPES[manager.archetypeId].traits
  for (const trait of TRAIT_IDS) {
    const driftDirection = getDriftDirection(trait, seasonResult)
    const driftMagnitude = clamp(0.01 + 0.02 * rng.nextFloat(), 0.01, 0.04)
    manager.traits[trait] += driftDirection * driftMagnitude
    // hard cap ±0.2 from archetype base
    manager.traits[trait] = clamp(
      manager.traits[trait],
      archetypeBase[trait] - 0.2,
      archetypeBase[trait] + 0.2
    )
  }
  return manager
}
```

Drift rules (locked):

- Successful attacking season → +`tacticalAttacking`.
- Successful youth integration (3+ youth players with > 1500 mins) → +`youthTrust`.
- Big underperformance with risky approach → -`riskTaking`, +`fitnessFocus`.
- Promoted to bigger club → small +`starPreference`, small +`transferAggressiveness`.
- Got sacked → varies by reason (cup exit → +`pressingPreference`; financial → +`bargainSeeking`).
- All drifts capped at ±0.2 from archetype base; manager identity is preserved.

## 5. Manager archetype library (10)

Each archetype is a preset trait vector + preferred formations +
description. AI managers are generated by picking an archetype (per
D2 / `WorldAiMgmtRng`) and then jittering each trait by `±0.05` to
ensure unique personality vectors.

| ID | Name | Trait highlights (vs neutral 0.5) | Preferred formations |
|---|---|---|---|
| `park_the_bus` | Park-the-Bus Pragmatist | `tacticalAttacking 0.20`, `pressingPreference 0.20`, `riskTaking 0.30`, `tinkering 0.30`, `fitnessFocus high` | 5-3-2, 4-5-1, 4-4-1-1 |
| `counter_attacker` | Counter-Attacking Reactive | `tacticalAttacking 0.40`, `pressingPreference 0.25`, `riskTaking 0.50`, `tinkering 0.55` | 4-2-3-1, 4-4-2 (deep), 3-5-2 |
| `high_press` | High-Pressing Aggressor | `tacticalAttacking 0.75`, `pressingPreference 0.90`, `riskTaking 0.70`, `fitnessFocus high` | 4-3-3, 4-2-3-1 (high), 3-4-3 |
| `possession` | Possession Maestro | `tacticalAttacking 0.65`, `pressingPreference 0.70`, `riskTaking 0.45`, `tinkering 0.40` | 4-3-3, 4-2-3-1, 3-4-3 |
| `youth_dev` | Youth Developer | `youthTrust 0.90`, `bargainSeeking 0.75`, `starPreference 0.20`, `transferAggressiveness 0.45`, `loyalty high` | 4-2-3-1, 4-3-3 |
| `galactico` | Galáctico Collector | `starPreference 0.90`, `youthTrust 0.30`, `bargainSeeking 0.20`, `wageDiscipline low` | 4-3-3, 4-2-3-1 |
| `moneyball` | Moneyball Director | `bargainSeeking 0.90`, `starPreference 0.30`, `youthTrust 0.70`, `transferAggressiveness 0.75` | 4-3-3, 4-2-3-1, 3-5-2 |
| `tinkerman` | Tinkerman | `tinkering 0.90`, `riskTaking 0.65`, `tacticalAttacking 0.55` | wide variety; switches 4-3-3 / 4-2-3-1 / 3-5-2 / 4-4-2 |
| `stabilizer` | Conservative Stabilizer | `tinkering 0.15`, `riskTaking 0.30`, `loyalty high` | 1-2 preferred formations, rarely changes |
| `chaos_motivator` | Chaos Motivator | `riskTaking 0.85`, `tinkering 0.70`, `tacticalAttacking 0.75`, `pressingPreference 0.65` | extreme formations: 3-4-3, 4-2-4, 3-5-2 attacking |

Generation per D2 `generator:manager:<managerId>`:

1. Sample archetype via region-weighted distribution (DACH favours
   `youth_dev` + `pragmatist`; British Isles favour `high_press` +
   `counter_attacker`; etc.).
2. Apply per-trait jitter `±0.05` deterministically.
3. Sample preferred formations (1-3) from archetype's preferred list.

## 6. Out-of-match AI — per-system decisions

### 6.1 Transfer market

Decision authority for the detailed market model is
[[transfer-market-simulation]]. This section keeps the AI-manager layer aligned
with that transfer-specific blueprint.

**Squad gap analysis** (weekly per club):

```ts
roleNeed[R] =
    0.6 * normalize(gapCount[R], 0, 2)
  + 0.4 * normalize(qualityGap[R], 0, 15)
// Then modulated by manager personality and club situation.
```

If `roleNeed[R] > 0.4`, role becomes a transfer priority. Max 3 priority roles
per club per week.

**Window strategy**:

Each club builds a `ClubTransferStrategy` at the start of a window and refreshes
it weekly:

```text
buyTargets + sellCandidates + loanList + notForSaleCore
+ wageCorrectionTargets + successionNeeds + boardPressure
+ cashUrgency + styleFit
```

**Scouting** (cheap; precomputed indexes):

- Global indexes built once per game-day:
  - `PlayersByRole[Role]` sorted by estimated ability / role fit.
  - `FreeAgents[]` per role.
  - `PlayersByTransferList`.
  - `TransferOpportunities[]` from the Transfer context.
- For each priority role, scan top **N = 60** players in the index; filter by:
  - valuation band within budget tolerance;
  - wage demand within wage-policy tolerance;
  - reputation within club attraction range;
  - style fit `>= 0.5`;
  - player-side plausibility above a low threshold.

**Target scoring**:

```ts
targetScore =
    0.30 * abilityFit
  + 0.20 * potentialFit
  + 0.15 * ageFit
  + 0.15 * styleFit
  + 0.10 * contractOpportunity
  + 0.10 * marketOpportunity
```

Personality changes weights, not hard rules. `youthTrust` raises potential and
age-fit weights; `starPreference` raises reputation / ability fit; `bargainSeeking`
raises contract and market-opportunity weights.

**Selling model**:

The old simple sale formula is replaced by the transfer-market blueprint:

```text
sellPressure =
  playerUnrest + contractRisk + wageBurden + squadSurplus
  + financeUrgency + tacticalMismatch + ownerDirective
  + marketOpportunity + agentPush

protectionScore =
  squadImportance + replacementScarcity + leadershipValue
  + fanBoardBacklash + tacticalFit + rivalryRisk + statusSignal
```

Outcomes:

- `protectionScore` clearly higher -> not-for-sale core; only exceptional
  overpay opens talks.
- scores close -> listen to offers.
- `sellPressure` higher -> actively list or seek loan.
- administration / owner directive / severe FFP pressure -> forced sale, still
  bounded by `panicSaleFloor`.

**Bidding logic** (with escalation + walk-away):

```ts
urgency =
    0.5 * roleNeed[R]
  + 0.2 * injuryCrisisFactor
  + 0.2 * seasonPhaseFactor
  + 0.1 * boardPressureFactor
```

- If `urgency < 0.4`: do nothing this week.
- Initial bid uses the Transfer context's valuation band, not a single
  `valueEstimate`.
- Escalation compares offer packages by `cashEquivalent`.
- Walk away when the package exceeds the buyer's reservation value, wage policy,
  squad-role plausibility or difficulty-specific risk cap.

**Multi-club contest**: when >= 2 clubs bid on the same player, award to highest
combined package score:

```ts
bidScore =
    0.45 * normalize(cashEquivalent, sellerAskBand)
  + 0.25 * clubReputationFactor
  + 0.20 * playerTermsFit
  + 0.10 * relationshipTemperature
// tie-breaker: WorldAiMgmtRng micro-jitter
```

**Transfer window dynamics**:

- Market inflation / heat comes from `transfer_window_regime`.
- Deadline-day urgency can raise reservation values, but cannot cross hard
  valuation floors / caps.
- Cap: max 2 deadline-day signings per club.

### 6.2 Contract renewals

Run **monthly**, not weekly (saves CPU).

```ts
renewalPriority =
    0.4 * playerImportance
  + 0.3 * (18 - contractMonthsLeft) / 18
  + 0.2 * potentialFit
  + 0.1 * (1 - wageBurden)
```

If `renewalPriority > 0.5`, attempt renewal.

**Offer construction**:

- Wage: `currentWage × (1 + 0.1 + 0.2 × playerImportance + 0.1 × (clubRep / 100))`.
- Length: 4-5 years if `age < 28`; 2-3 years if `age ≥ 30`.
- Role status: keep current unless CA jumped > 5 → upgrade.

Player acceptance: simple logistic over `(wage / desired, status_fit,
rep_difference)`.

### 6.3 Selling

```ts
saleScore =
    0.35 * surplus               // > required depth at role
  + 0.25 * contractRisk          // < 12 months left
  + 0.20 * wageBurden            // wage / squadAvg > 1.5
  + 0.10 * ageDeclineRisk
  + 0.10 * randomNoise
```

If `saleScore > 0.6`, list player at `askPrice = valueEstimate × (1 + 0.3 × (1 - loyalty))`.

Accept bid if `offer ≥ 0.9 × askPrice` AND player not in best XI, OR
if `ffpPressure > 0.6` AND `offer ≥ 0.8 × askPrice`.

### 6.4 Squad rotation + training

**Weekly XI selection** per upcoming match:

```ts
selectionScore =
    0.5 * importance
  + 0.2 * fitness
  + 0.1 * morale
  + 0.1 * form
  + 0.1 * rotationBoost
```

`rotationBoost` is higher in low-priority cup matches and for players
with few minutes. Personality: `youthTrust > 0.7` adds +0.15 to youth
players' `rotationBoost` in low-priority matches.

**Training focus** (weekly choice from 5 options):

```ts
U_Fitness = 0.5 × injuryRate + 0.3 × lowFitnessProportion + 0.2 × upcomingCongestion
U_Defending = 0.6 × goalsAgainstLast5 + 0.2 × defensiveErrors + 0.2 × (1 - tacticalAttacking)
U_Attacking = 0.6 × goalsForDeficit + 0.2 × xGUnderperformance + 0.2 × tacticalAttacking
U_SetPieces = setPieceGoalDeficit + boardPreference.setPieces
U_Individual = youthTrust + boardExpectations.youthFocus
```

Pick highest-scoring 1-2 focuses for the week.

### 6.5 Loans out (youth development)

For each U23 fringe player:

```ts
loanPriority =
    0.5 * (potential - currentAbility) / 20
  + 0.3 * (1 - playingTimeRatio)
  + 0.2 * youthTrust
```

If `> 0.5`, list for loan. Matching: lower-tier clubs with role need
+ reputation within ±15 of player's level + best expected minutes.

### 6.6 Youth recruitment (seasonal)

Intake day (once per season): D2 generates `N = 8 + youthFacilitiesLevel`
candidates per club. Club keeps top `K = 4-10` based on:

```ts
keepScore =
    0.6 * potential
  + 0.2 * roleNeedForFuture
  + 0.2 * youthTrust
```

Release the rest.

### 6.7 Sponsorships (annual / when expiring)

AI clubs auto-accept best deal:

```ts
dealScore = 0.7 * annualFee + 0.3 * durationPreference
```

Pick highest. No negotiation simulation for AI; user clubs are
interactive.

### 6.8 Stadium + facility upgrades (seasonal)

Capex once per season:

```ts
U_stadium =
    0.6 * attendanceRatio          // avgAttendance / capacity
  + 0.3 * longTermAmbition
  + 0.1 * successTrend

U_training =
    0.4 * injuryRate
  + 0.4 * youthTrust
  + 0.2 * currentFacilitiesInverse
```

Trigger upgrade if `U > 0.6` AND `balance > cost × 1.5`.

## 7. In-match AI

### 7.1 Decision pipeline

Per-match in the AI Worker:

```ts
function decideMatchAction(input: MatchAIInput): MatchAIDecision {
  // 1. Trigger check
  if (!isDecisionTrigger(input.matchState)) return EMPTY_DECISION

  // 2. Update MatchState snapshot (cheap; engine already updates)
  const ctx = buildMatchContext(input)

  // 3. Run decision passes in order, short-circuiting where appropriate
  const decisions: MatchAIDecision = { /* ... */ }

  decisions.mentalityChange = decideMentality(ctx)
  decisions.formationChange = decideFormationChange(ctx)
  decisions.substitutions = decideSubstitutions(ctx)
  decisions.instructionsUpdate = decideInstructions(ctx)
  decisions.setPieceTakerUpdate = decideSetPieceTakers(ctx)

  return decisions
}
```

### 7.2 Triggers (NOT per-event)

Decision passes run on:

**Time-based**:

- 30', 45' (HT), 60', 70', 75', 80', 85', 90'

**Event-based**:

- Goal scored or conceded
- Red card (own team)
- Serious injury
- Multiple yellow cards on a player
- Opponent substitution that changes shape
- Conceded 2+ set-piece goals

Total: ~15-25 decision passes per match (NOT 150 per-event). Avg
pass cost: 0.5-1.0 ms; max 2 ms on HT (full reassessment). Total
in-match AI cost: ~10-20 ms / match, well within the 30-50 ms budget.

### 7.3 Substitutions

**Sub-out utility** (per on-field player):

```ts
U_out =
    0.5 * clamp((fatigue - 0.7) / 0.3, 0, 1)
  + 0.3 * clamp((6.5 - impactRating) / 6.5, 0, 1)
  + 0.2 * cardRisk
```

**Sub-in utility** (per bench player):

```ts
U_in =
    0.4 * roleFit
  + 0.3 * qualityNorm
  + 0.2 * staminaRemaining
  + 0.1 * recentForm
```

**Combined**: `U_sub = U_out + U_in`. Apply thresholds:

| Phase | Threshold |
|---|---|
| Before 60' | `U_sub ≥ 1.2` |
| 60-80' | `U_sub ≥ 0.9` |
| After 80' | `U_sub ≥ 0.7` |
| Forced (red / injury) | always |

**Score-line modifiers** boost attacking subs when chasing and
defensive subs when leading.

### 7.4 Formation switches

**Triggers**: HT, 60', 75', 85', plus red card / 2-goal swing / late
equaliser.

```ts
D_def = (scoreDiff ≥ 1 ? 0.3 + 0.4 × timeRatio : 0)
      + (scoreDiff ≥ 2 ? 0.2 : 0)
      × (0.7 + 0.6 × (1 - tacticalAttacking))

D_att = (scoreDiff ≤ -1 ? 0.3 + 0.4 × timeRatio : 0)
      + (scoreDiff ≤ -2 ? 0.2 : 0)
      × (0.7 + 0.6 × tacticalAttacking)

C_change = 0.3 + 0.2 × changesAlreadyMade
         × (1.1 - 0.4 × tinkering)
```

Change if `D - C_change ≥ 0.3`. Cap: max formation changes per match =
`1 + round(2 × tinkering)`.

### 7.5 Mentality changes

Five settings: `VeryDefensive` / `Defensive` / `Balanced` / `Attacking`
/ `VeryAttacking`.

Target mentality from `scoreDiff × minute` table:

| Time | -2 | -1 | 0 | +1 | +2 |
|---|---|---|---|---|---|
| 0-60' | VeryAtt | Att | Balanced | Balanced | Defensive |
| 60-85' | VeryAtt | Att | Balanced | Defensive | VeryDef |
| 85'+ | VeryAtt | Att | Balanced | VeryDef | VeryDef |

Personality nudge: high `riskTaking` shifts one step more attacking;
high `pressingPreference` shifts one step more attacking when level
or chasing.

Cooldown: 10 minutes between mentality changes (shorter for high
`tinkering`).

### 7.6 Set-piece takers (per A3)

**Corners** (per side):

```ts
score = 0.6 × corners + 0.2 × setPieces + 0.1 × technique + 0.1 × form
+ 0.2 if strongFoot matches side
```

**Penalties**:

```ts
score = 0.5 × penalties + 0.2 × composure + 0.1 × finishing + 0.1 × leadership + 0.1 × form
```

**Free kicks** (direct range): primary `freeKicks` attr + composure +
finishing.

Selected at match start; re-evaluated when taker is subbed off /
injured.

### 7.7 Time-wasting + urgency

After 85':

- Leading by 1+: `timeWasting = High`; GK takes long over goal-kicks;
  more side passes; throw-in delays.
- Losing by 1+: `urgency = High`; quick restarts; long balls forward.
- Level + cup tie + drawing fine for the AI club's archetype + Park-the-Bus
  manager: time-waste lightly.

### 7.8 Pressing intensity

Adjust every 15 minutes based on:

- `avgStamina` (drop pressing when team tired).
- `scoreDiff` (less pressing when ahead in last 30 min).
- `fitnessFocus` (managers with high focus reduce pressing earlier).

### 7.9 Player instructions

Coarse settings, per-line:

- `pressHeight`: Low / Medium / High
- `defLine`: Deep / Normal / High
- `width`: Narrow / Normal / Wide
- `focusSide`: Left / Centre / Right / Mixed
- `focusPlayerId`: optional target opponent for tight marking

Updated every 15' OR after concede/score OR after opponent formation
change.

### 7.10 Yellow card management

For each booked player:

```ts
disciplineRisk =
    baseCardRisk[role]                              // CB/DM 0.6, FB 0.5, ...
  + 0.2 × aggression_norm
  + 0.2 × (tackling < 0.5 ? 1 : 0)
  + 0.2 × (oppFocusSide matches player zone)
```

If `disciplineRisk + 0.5 ≥ 0.7` AND minute ≥ 60 AND bench has
`roleFit ≥ 0.7` alternative: increase `U_out` weight by `+0.2` (sub
becomes likely). Alternative: switch instruction to `tackleLess /
pressLess`.

### 7.11 Set-piece defensive scheme

Binary: zonal vs man. Evaluated at match start + HT + after 2+
conceded set-piece goals. Man-mark opposition aerial threats with
best aerial defenders.

## 8. Difficulty modes — 4-tier model

**Hard rule**: NO AI stat cheats on Normal/Hard/Sim. Difficulty
changes constraints, AI competence, and (Easy only) user help.

### 8.1 Per-tier knob table

| Knob | Easy | Normal | Hard | Sim |
|---|---|---|---|---|
| **AI tactical quality weight** | 0.8 × | 1.0 × | 1.2 × | 1.4 × |
| **AI in-match adaptation freq** | every 30 min | every 15 min / events | every 10 min / events | every 5-10 min / events |
| **AI transfer success rate** | 80 % | 100 % | 120 % | 140 % |
| **AI scouting knowledge depth** | N=40 candidates / role | N=60 | N=80 | N=100 |
| **User board wage budget** | +20 % | baseline | baseline | -15 % |
| **User transfer budget** | +50 % | baseline | -10 % | -15 % |
| **User selling-price multiplier (when bid arrives)** | +15 % | baseline | baseline | baseline |
| **User buying-price multiplier (asking price)** | -15 % | baseline | +10 % | +15 % |
| **User wage demand multiplier (when offering)** | -15 % | baseline | +10 % | +10 % |
| **User stat help** | +1 to all visible attrs | none | none | none |
| **User consistency / big-matches hidden** | +2 | none | none | none |
| **Board patience after underperformance** | +50 % | baseline | -20 % | -30-40 % |
| **Board objective tier** | -1 tier | baseline | match prediction | prediction +1 tier |
| **Player wantaway threshold** | 2x harder | baseline | 0.8× | 0.6× |
| **Injury frequency** | 0.8 × | 1.0 × | 1.1 × | 1.1 × |
| **Match fatigue impact** | 0.8 × | 1.0 × | 1.0 × | 1.2 × |
| **Tactical familiarity build rate** | 1.3 × | 1.0 × | 0.9 × | 0.8 × |
| **FFP enforcement** | none | warnings only | soft penalties | hard penalties (point deductions possible) |
| **Star player ambition pressure** | 0.7 × | 1.0 × | 1.2 × | 1.5 × |

### 8.2 Hot-seat / async-MP integration

Per-manager difficulty: each human user picks their own tier. AI-vs-AI
matches don't have a "difficulty" (uses Normal AI competence). When
two humans of different difficulties play each other, the engine uses
their respective constraint multipliers symmetrically (the easier-
tier user gets their bonuses; the harder-tier user gets their
penalties).

## 9. AI manager career arcs

### 9.1 Board confidence formula

Per club per week:

```ts
C_new = 0.7 × C_old
      + 0.3 × (
          0.4 × resultsScore           // last 5 games vs expectations
        + 0.2 × leaguePositionScore    // logistic around target
        + 0.2 × financesScore          // overspend penalty, transfers
        + 0.1 × youthScore             // minutes to youth vs board pref
        + 0.1 × styleScore             // tactics align with board style
        ) × 100
```

`jobSecurity = 0.5 × C_new + 0.5 × timeAtClubFactor`.

### 9.2 Firing

Once per week, if `C_new < 30` AND `recentTrend` negative OR
`leaguePosition` >> `target + 4`:

```ts
fireProb = logistic((35 - C_new) / 5 + severityFactor)
```

Draw via `WorldAiMgmtRng:board:<clubId>`. High `loyalty` archetypes
get +5 threshold buffer.

### 9.3 Hiring

When a club fires its manager:

1. Generate candidate list: unemployed managers + low-confidence
   managers from clubs within rep ±10 of the firing club.
2. Score each candidate:

```ts
candidateScore =
    0.4 * reputationFit
  + 0.2 * tacticalFit      // archetype alignment with board style
  + 0.2 * youthFit          // matches board.youthFocus
  + 0.1 * pastSuccess
  + 0.1 * loyaltyFit
```

Pick highest. Hiring is instant — no negotiation simulation (defers
the depth to user clubs only).

### 9.4 Retirement

Each AI manager gets a retirement age sampled from `Normal(67, 4)`,
capped `[60, 75]`. At age 60+ in any off-season, draw retirement
probability:

```ts
retireProb = clamp((age - 60) / 15, 0, 1) ** 1.5
```

Retired managers join a "legend pool" available for symbolic appearances
(narrative content, hall of fame).

### 9.5 Legendary detection

A manager becomes `legendary` (flag) when they have:

- 3+ league titles, OR
- 2+ continental trophies, OR
- 5+ promotions to a top flight

Legendary managers get:

- Higher job-security thresholds (boards more patient).
- Stronger pull on top vacancies.
- Personality drift caps relaxed to ±0.25 (they "earn" eccentricity).
- Surfaced in narrative content + Hall of Fame.

### 9.6 Rival tracking

For each user club, track AI managers who:

- Have played in title races / cup finals with the user.
- Have > 0.5 points per game against the user in head-to-heads.
- Are in clubs in the user's league.

Top scorer becomes user's **primary rival**:

- Surfaced in match intros + media narrative.
- More aggressive counter-tactics application against the user.
- Persistent across manager job changes (rival follows the user's
  manager career, not just the user's club).

## 10. World drift mechanics

Five pillars, each tunable per difficulty tier.

### 10.1 Economic feedback

**Success-driven wage inflation**:

- 3 straight top-4 finishes → +10-20 % wage demands in all renewals.
- Each major trophy → +10-15 % wage on next contract renewal for that
  squad's key players ("champions bonus").

**Progressive FFP**:

- Soft penalty (warning): wage + amortised transfers > 120 % of football
  revenue for 1 season.
- Hard penalty (transfer ban for 1 window, or 5-10 point deduction
  on Sim): 3rd consecutive season of breach.

**TV / prize money cap**: champion gets ≤ 3-3.5 × what the bottom
gets (Bundesliga-like, not Premier League's 2 × cap which entrenches
top clubs). Re-evaluated every 5 years.

### 10.2 Talent diffusion (regen anti-hoarding)

Per D2 + this gap's locks:

- **40 % of elite regens** (`PA ≥ 160/200`) spawn at non-elite clubs
  (vs FM tendency to concentrate at top clubs).
- Mid-tier clubs with proven youth-development track record (3+ stars
  sold over past 5 seasons) get upgraded `youthFacilitiesLevel`,
  improving regen quality.
- **Min playing time pressure**: any high-potential player (`PA ≥ 160`) with
  < 35 % of available minutes for 2 consecutive seasons → 70-80 %
  chance to demand transfer (per `WorldAiMgmtRng:player:wantaway:<id>`).

### 10.3 Tactical arms race

**Opposition memory** per AI club:

- Track user's recent tactic profile via 5-10 match rolling stats:
  - Defensive line (Low / Med / High).
  - Pressing intensity.
  - Width preference (Narrow / Normal / Wide).
  - Build-up style (Short / Mixed / Direct).
  - Key focus (Crosses / Through Balls / Overloads).

**Counter-template application**:

- Easy: minimal adaptation; +0 % counter weight.
- Normal: +10 % counter weight in big games (top of table, cup finals).
- Hard: +20 % counter weight in all league fixtures; specific player
  marking on user's top scorer if 15+ goals.
- Sim: +30 % counter weight + summer arms race (managers most beaten
  by the user add counter-meta variants to their preferred-formation
  list).

### 10.4 Structural events

#### 10.4.1 Rising rival event

Every ~5 in-game years (deterministic via `WorldAiMgmtRng:structural:<year>`):

- If a region (country × division-level) has had no Tier-1 title in
  10 seasons → 60 % chance of triggering.
- Pick a Tier-2/3 club with good stadium + decent youth track record
  + regional fit.
- **Effect**:
  - Inject funds = 1-2 × league avg revenue.
  - Wage budget rises to top-4 level for next 5 seasons.
  - Hire a high-reputation manager (or upcoming prodigy).
  - Marketed as rising rival; gets media boost.

Cap: max 1 rising-rival event per year globally.

#### 10.4.2 Giant collapse event

Every ~10 in-game years:

- Pick a Tier-1 club with high recent success but high wage burden.
- Trigger "bad owner" scenario:
  - Forced fire-sale (stars listed at -20 % asking price).
  - Wage budget halved for 2 seasons.
  - Transfer ban for 1 window.

Cap: max 1 giant collapse per 10 years globally.

### 10.5 Board expectation escalation

Each overperformance season (finish ≥ target + 2) → expectations
advance +1 tier next season:

| Tier | Description |
|---|---|
| 1 | Avoid Relegation |
| 2 | Lower Mid-table |
| 3 | Mid-table |
| 4 | Top Half |
| 5 | Europe / Continental Qualification |
| 6 | Title Challenge |
| 7 | Win Title |
| 8 | Win Title + Deep Continental Run |

Each underperformance season (finish ≤ target - 2) → expectations
drop -1 tier with 50 % chance + board confidence penalty.

## 11. Late-game / endgame content

### 11.1 MVP scope

- **Dynasty achievement tracking**: surfaces 12 long-term goals:
  - 5-in-a-row league titles
  - Domestic treble (League + Cup + Super Cup)
  - Continental double (League + Continental)
  - Invincibles season (unbeaten league)
  - 100-point season
  - 100+ goals in a season
  - Top scorer 3 consecutive seasons (one player)
  - Promotion through all 5 divisions (one club, "ladder climb")
  - Win league with each tactical archetype
  - Generational squad (3+ academy stars in starting XI)
  - 1000 wins (career)
  - 50-year save (career longevity)
- **Tactical arms race** active from season 1.
- **Board expectation escalation** active from season 1.

### 11.2 Post-MVP scope

- **National team dual role**: unlock at manager reputation ≥ 75 +
  5 in-game seasons. Adds tournament cycles (World Cup / continental
  championship analog).
- **Manager Hall of Fame**: per-save leaderboard ranked by weighted
  trophies + PPG + longevity. Cross-save comparison via deterministic
  seeds.
- **Legacy mode**: after 15+ seasons, option to retire as manager and
  continue as chairman / DoF (low-touch meta decisions). Optionally
  start as rookie at lower club while original club continues under AI.
- **Roguelite integration**: career ends on sack / failed-objective
  per Create-A-Club GDD; meta-progression unlocks; world continues
  with new generation; ghost managers remain in history influencing
  rep tables.

## 12. Determinism + RNG usage

Per D8 §2.4: AI MUST use `WorldAiMgmtRng` (out-of-match) and
`MatchAiRng` (in-match). `Math.random` is forbidden.

Sub-stream labels:

```text
worldAiMgmt:club:<clubId>:weekly:<week>
worldAiMgmt:club:<clubId>:transfer:targeting
worldAiMgmt:club:<clubId>:transfer:bidding:<targetId>
worldAiMgmt:club:<clubId>:contract:renewal:<playerId>
worldAiMgmt:club:<clubId>:training:weekly
worldAiMgmt:club:<clubId>:youth:intake
worldAiMgmt:club:<clubId>:facilities
worldAiMgmt:board:<clubId>:confidence
worldAiMgmt:board:<clubId>:firing
worldAiMgmt:board:<clubId>:hiring
worldAiMgmt:structural:year:<year>:rising-rival
worldAiMgmt:structural:year:<year>:giant-collapse
worldAiMgmt:expectation:<clubId>:season:<season>
worldAiMgmt:manager:<managerId>:career-drift:season:<season>
worldAiMgmt:manager:<managerId>:retirement

matchAi:<matchId>:trigger:<minute>:<eventType>
matchAi:<matchId>:substitution:<passIdx>
matchAi:<matchId>:formation-change:<passIdx>
matchAi:<matchId>:mentality:<passIdx>
matchAi:<matchId>:set-piece-taker:<setPieceId>
```

Adding new sub-labels later doesn't break existing replays (per D8
§2.3 future-proof property).

## 13. Performance budget

### 13.1 Out-of-match (weekly tick, per club)

| Operation | Budget |
|---|---|
| Update derived metrics (form, position, finances) | < 0.5 ms |
| ClubSituation FSM evaluation | < 0.1 ms |
| Transfer evaluation (3 priority roles × 60 candidates) | ~ 2 ms |
| Contract renewal scan (monthly only) | ~ 0.5 ms |
| Squad rotation + training focus | ~ 1 ms |
| Tactical setup per upcoming match | ~ 0.5 ms |
| Board confidence update | < 0.1 ms |
| Sponsorship / facilities (seasonal only) | < 1 ms when run |
| Career drift (seasonal only) | < 0.1 ms when run |
| **Total per club per week (worst-case)** | **~ 5-6 ms** |

For 700 clubs: ~3.5-4.2 s, within the 5 s budget.

### 13.2 In-match (per match)

| Operation | Budget |
|---|---|
| Trigger check (per event) | ~ 0.05 ms × 150 events = 7.5 ms |
| Decision pass (substitutions + mentality + instructions) | ~ 0.5-1.0 ms × 15-25 passes = 10-20 ms |
| Formation change (rare; HT + reactive) | ~ 0.2 ms × ~ 2 passes = 0.4 ms |
| Set-piece taker decisions (rare) | ~ 0.05 ms × few = < 0.2 ms |
| **Total per match (worst-case)** | **~ 25 ms** |

Well within the 50 ms human-involving budget and the 30 ms AI-vs-AI
budget.

### 13.3 Lazy expansion of AI managers

Per D2 pattern: only AI managers the user has interacted with (faced
in matches, scouted, considered hiring) get full personality vectors
+ decision history in active memory. Tier C AI managers store compact
profiles (~16 bytes: `archetypeId + small drift deltas`); expand on
first interaction.

## 14. Open follow-ups

- **D3 Tactics & formation depth on mobile**: this note assumes a
  tactic taxonomy (formations + roles + duties + instructions) that
  D3 will finalise.
- **D5 Strategic onboarding**: the difficulty-mode dials in §8 are
  primary onboarding hooks.
- **D6 Late-game / end-game systems**: depth pass on the §11 list
  (national team UX, Hall of Fame design, legacy mode flows).
- **D7 Mobile UX, IA & accessibility**: surfacing AI manager
  archetype + rival info in the UI.
- **D15 Narrative event content**: AI manager career arcs + rivalries
  feed narrative event triggers.
- **I11 Roguelite carry-slot growth + insolvency tuning**: integrates
  with §9 sacking + §11.2 roguelite integration.
- **I12 Career: confidence thresholds + reputation per-region**:
  refines §9 with per-region reputation accumulators.
- **ADR-0019 service extraction**: post-MVP server-side AI for
  async-MP worlds reuses the same `packages/ai-manager/` code path.

## 15. Sources

- Perplexity Sonar research, 2026-05-17 (gap D4): AI architecture
  comparison (FSM / BT / utility / GOAP / HTN / ML / hybrid);
  determinism + performance fit for our stack; manager personality
  systems; anti-staleness mechanics.
- Perplexity Sonar research, 2026-05-17 (gap D4): in-match AI
  decision granularity; trigger systems; FM Touchline Tablet behaviour;
  set-piece taker selection; yellow card management; pressing
  intensity; time-wasting / urgency.
- Perplexity Sonar research, 2026-05-17 (gap D4): out-of-match AI
  systems; transfer market AI; bidding escalation; multi-club
  contests; squad rotation; board interactions; manager career arcs;
  archetypes (Anstoss 3 Erni Buntspecht reference); FIFA Career
  failure modes.
- Perplexity Sonar research, 2026-05-17 (gap D4): difficulty curve
  design; world drift / dynasty anti-staleness; rising rival events;
  giant collapse events; talent diffusion (40 % elite regens off-top);
  tactical arms race; FM long-game patterns; competitor late-game
  staleness (EA FC ~5 seasons; Master League similar).
- Dave Mark — *Behavioral Mathematics for Game AI*; GDC talks on
  utility systems (2010-2015).
- S. Rabin (ed.) — *Game AI Pro* series, utility-based decision
  making chapters.
- Sports Interactive — FM Match AI articles (footballmanager.com).
- Locked context: [[determinism-and-replay]] (D8 RNG streams),
  [[../10-Architecture/09-Decisions/ADR-0011-server-authoritative-multiplayer]]
  (AI-vs-AI policy), [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]
  (match engine bridge), [[data-generators]] (D2 attribute schema +
  archetype gen pattern), [[performance-budgets]] (D9 perf budgets),
  [[../10-Architecture/bounded-context-map]] (League / Club / Transfer
  context allocation).
- D4 Q&A with Nico (2026-05-17): all 8 recommendations accepted
  (utility-AI core + FSM + heuristics; 8 primary + 3 derived traits;
  10 archetypes; 4 difficulty tiers FM-style; moderate world drift
  with explicit mechanics; rising rival + giant collapse events;
  full career arcs at MVP; phased late-game content rollout).
