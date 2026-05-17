---
title: Tactics & Formations — Mobile-first Manager Game Tactics Depth
status: current
binding: true
tags: [research, tactics, formations, roles, instructions, familiarity, opposition, mobile-ux, touch]
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]], [[ai-manager-behaviour]], [[match-engine-simulation-model]], [[data-generators]], [[performance-budgets]], [[progressive-disclosure-research]], [[../50-Game-Design/tactics-system]], [[../50-Game-Design/progressive-disclosure-ui]], [[../50-Game-Design/match-engine]], [[../50-Game-Design/set-pieces]]
---

# Tactics & Formations — Mobile-first Manager Game Tactics Depth

> Gap D3 of [[wave-3-gap-analysis]]. Locks the user-facing tactics
> system for an offline-first PWA football manager: 20 formations,
> 50 roles, per-tier player + team instructions (0/6/18 + 1/5/8),
> light Expert phase logic, full FM-style familiarity model, 3-layer
> opposition template system (archetypes + sub-archetypes +
> manager-signature templates), 3 universal touchline shouts, URL-
> encoded tactic share codes. This is the user-facing counterpart to
> D4 (AI manager behaviour).

## 1. Context and inputs

This note completes the tactics depth pass on top of already-locked
foundations:

- **D2 Data Generators** ([[data-generators]]): locked the player
  attribute schema (**16 visible + 4 GK + 8 hidden meta on 1-20 scale**)
  and the ~50 player archetypes used for procedural generation. The
  pre-existing `tactics-system.md` GDD §9 incorrectly claimed
  "10 + 8 + 10 + 5 = 33 attributes on 1-10 scale" — D3 reconciles this
  to the D2 schema as a mechanical fix.
- **A3 Match Engine** ([[../10-Architecture/09-Decisions/ADR-0003-match-engine]]):
  formation zone weights are TS literals per `(formation, role)` →
  18-zone intensity profile. 20 formations × ~50 roles = ~13 500 entries;
  pattern-constant reuse keeps the canonical data ~80-100 KB minified.
  Set-piece routine library is shared at MVP; per-club editor Phase 2.
- **D4 AI Manager Behaviour** ([[ai-manager-behaviour]]): locked the
  10 AI manager archetypes with preferred-formation lists. Tactical
  arms-race + opposition-counter logic depends on D3's template system.
- **D9 Performance Budgets** ([[performance-budgets]]): locked the
  3 UI tiers (Quick / Standard / Expert), DOM ≤ 1500 nodes per route,
  touch target 44 × 44 px minimum, no WebGL / no 3D for match canvas,
  text + canvas match render modes only.
- **D8 Determinism + Replay** ([[determinism-and-replay]]): tactics +
  opposition templates + familiarity values are part of the match
  inputs that drive byte-identical replays.
- **ADR-0016 Community Dataset Overrides**: provides the tactic
  share-code import / export pipeline.

This note adds: full tactical taxonomy, per-tier UI design, mobile-
first interaction patterns, familiarity formulas, opposition template
3-layer system, touchline shouts, and the in-app tactic library design.

## 2. Comparative analysis — how other manager games handle tactics

Distilled from public dev documentation, modding community knowledge,
and product analysis.

### 2.1 Comparison table

| Game | Formations | Roles | Player instr | Team instr | Familiarity | Mobile UX |
|---|---|---|---|---|---|---|
| **FM PC** | 30+ | 60+ | ~20 | 8+ | Multi-bar | Desktop-first; drag-drop |
| **FM Mobile / Touch** | ~15 | ~25-30 | 8-10 | 6 | Single bar | Adapted from desktop; awkward drag |
| **SM24** | ~15 | ~25 | ~10 | 6 | None | Unity-based; drag-drop polished |
| **EA SPORTS FC Mobile** | ~12 | ~20 | ~10 | 5 | None | Tap-first; polished but limited |
| **PES / eFootball Mobile** | ~12 | ~15 | ~8 | 4 | None | Similar to EA FC |
| **Anstoss 1-3** | 4-7 | 0 | 0 | 4-5 | None | Mouse-driven; menu-heavy |
| **OSM** | 5 | 0 | 3 | 3 | None | Web-first; dropdown UX |
| **Top Eleven** | 5 | 0 | 0 (AT/DE slider) | 2 | None | Mobile-first; minimal |
| **Hattrick** | 8 | 0 | Individual orders | 4 | None | Web-only; spartan |
| **Champ Man Mobile** | ~10 | ~15 | ~8 | 5 | None | Tap-driven; aged UX |

### 2.2 The competitive landscape

The market splits clearly:

- **Deep desktop sims** (FM PC, SM24-PC): 30+ formations, 60+ roles,
  ~20 instructions per player. Excellent on desktop; awkward on
  mobile.
- **Mobile-adapted sims** (FM Mobile, SM24, EA FC Mobile): 12-15
  formations, 20-30 roles, ~10 instructions. A clear depth cut but
  still substantial.
- **Mobile-native casual** (Top Eleven, OSM, Hattrick, Anstoss-style):
  5-8 formations, no role catalogue, 0-3 instructions. Fast but
  loses tactical expression for engaged users.

**Our target**: **deeper than any pure mobile competitor, accessible
via Quick tier**, by using progressive disclosure within a single app.
Per D3 Q&A:

- 20 formations (approaching FM PC's 30+, exceeding FM Mobile's 15).
- 50 roles (approaching FM PC's 60+, exceeding FM Mobile's 30).
- 0 / 6 / 18 player instructions per Quick / Standard / Expert tier.
- 1 / 5 / 8 team instructions per tier.
- FM-style familiarity model (unique on mobile).
- Touch-first interaction (better than FM Mobile's drag-drop port).

### 2.3 Techniques we adopt

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Single familiarity bar per tactic** | FM Mobile | §6 — 0-100 per slot |
| 2 | **3 "registered" tactic slots A/B/C** | FM PC | §6.7 — slots with familiarity |
| 3 | **Tap-to-place formation editing** | EA FC Mobile, FM Mobile | §7.1 — primary; drag in Expert only |
| 4 | **Bottom-sheet role/duty picker** | Modern mobile UI patterns | §7.2 — preserves pitch context |
| 5 | **Preset-first formation library** | Top Eleven, FM Mobile | §7.1 — presets primary, manual secondary |
| 6 | **Segmented controls for team tactics** | Hattrick, OSM | §7.5 — 5-band mentality |
| 7 | **Tactic share codes (URL-encoded)** | FM community sites | §6.8 — per ADR-0016 |
| 8 | **Touchline shouts as morale modifiers** | FM | §8 — 3 universal at MVP |
| 9 | **Opposition-template library** | FM (per-club), our extension | §9 — **our improvement**: archetype-based, 3 layers |
| 10 | **Tactical familiarity with squad-continuity factor** | FM (implicit), our explicit | §6.5 — **our improvement** |
| 11 | **3-tier in-app progressive disclosure** | rare (FM Touch vs PC are separate products) | §10 — **our improvement** |
| 12 | **Tactical predictability penalty** | our invention; ties to D4 arms race | §11 — **our improvement** |

### 2.4 Our unique style

Where we differ from every competitor:

- **Single codebase / 3 in-app tiers**: user can switch between Quick /
  Standard / Expert without losing save state. FM has Touch vs PC but
  they are separate products with parallel content.
- **Touch-first interaction model** (tap-to-place + bottom sheets +
  segmented controls): no mobile competitor nails this. FM Mobile's
  drag-drop is widely criticised; EA FC Mobile is polished but limited.
- **Familiarity with explicit ContinuityMatchFactor + new-manager
  Similarity**: FM has familiarity but mechanics are opaque; ours is
  explicit and tuneable.
- **3-layer opposition template system** (archetype + sub-archetype +
  manager-signature) gives **emergent club character** — clubs
  accumulate historic counter-template preferences from their manager
  history.
- **Tactical predictability penalty** (small ~5% max effectiveness
  reduction for over-using one tactic) ties to D4's tactical arms race.
- **Deterministic + replay-stable**: same `(worldSeed, tactics,
  opposition_template, familiarity)` → byte-identical match. Enables
  global challenge seasons + replay-stable tactical analysis.
- **No 3D** (per D9 permanent decision): all tactics UX runs on
  Canvas 2D or DOM. Touch target 44 × 44 px enforced.

## 3. Formation taxonomy (20 formations at MVP)

Per D3 Q&A: 20 formations approaching FM PC depth.

### 3.1 Core 8 (Tier-1; available at all UI tiers)

| # | Formation | Notes |
|---:|---|---|
| 1 | **4-4-2 Flat** | Classic shape; flat midfield; 2 strikers |
| 2 | **4-3-3** | 3 CMs (1 DM + 2 CM, or 3 flat) + 2 wingers + ST |
| 3 | **4-2-3-1** | Double pivot, 3 attacking mids (1 AMC + 2 wide), 1 ST |
| 4 | **3-5-2** | Back 3, 2 WBs, 3 CMs, 2 STs |
| 5 | **4-1-2-1-2 (Narrow Diamond)** | 1 DM, 2 CM, 1 AMC, 2 STs; narrow attack |
| 6 | **5-3-2** | Back 5, 3 CMs, 2 STs; defensive |
| 7 | **3-4-3** | Back 3, 4 mids (2 WBs + 2 CMs), 3 forwards |
| 8 | **4-5-1** | Flat 5-band midfield, 1 ST |

### 3.2 Advanced 12 (Tier-2; Quick tier hides from UI, AI still uses)

| # | Formation | Notes |
|---:|---|---|
| 9 | **4-1-4-1** | Single pivot DM, 4 mids across, 1 ST |
| 10 | **4-2-2-2 (Narrow)** | 2 DMs, 2 AMCs (narrow), 2 STs |
| 11 | **4-3-2-1 (Christmas Tree)** | 1 DM, 2 CM, 2 AMC, 1 ST |
| 12 | **3-4-1-2** | Back 3, 4 mids (2 WBs + 2 CMs), 1 AMC, 2 STs |
| 13 | **3-4-2-1** | Back 3, 4 mids, 2 AMs, 1 ST |
| 14 | **4-2-3-1 Wide** | Double pivot, 3 AMs (1 AMC + 2 wide W instead of AM), 1 ST |
| 15 | **5-4-1** | Back 5, 4 mids, 1 ST; very defensive |
| 16 | **4-1-2-3** | Variant of 4-3-3 with DM + 2 CMs (asymmetric duty) |
| 17 | **3-3-3-1** | Back 3, 3 DM/CM, 3 attacking mids/wingers, 1 ST |
| 18 | **5-2-3** | Modern attacking 5-back: 3 forwards + 2 CMs |
| 19 | **4-4-2 Asymmetric** | Attacking LW + defensive RB (or vice versa); managers like Mourinho |
| 20 | **4-3-3 (DM Pivot)** | 3-CM variant with 1 deep + 2 advanced; distinct zone weights from 4-3-3 flat |

### 3.3 Zone-weight authoring (per A3)

Each `(formation, role)` pair gets an 18-zone weight profile. With
20 formations × ~11 positions per formation = ~220 (formation, position)
slots; multiply by typical 2-3 valid roles per position = ~500-650
unique `formationZoneWeights[formation][role]` entries.

Pattern-constant reuse (e.g. `CENTRAL_CB`, `WIDE_WINGER`,
`INVERTED_FULLBACK`) compresses authoring significantly. Per A3 §6:

```text
packages/match-engine/src/data/formations/
  patterns.ts         # DRY named zone-weight constants
  4-4-2-flat.ts
  4-3-3.ts
  4-2-3-1.ts
  ... (one file per formation)
```

Bundle target per A3: ~80-100 KB minified for the full canonical data
set. 20 formations is achievable within this budget.

## 4. Role catalogue (50 roles at MVP)

Per D3 Q&A: 50 roles approaching FM PC depth.

Position families (8):

### 4.1 Goalkeeper (3 roles)

1. **Goalkeeper** (GK) — basic, conservative distribution.
2. **Sweeper Keeper** (SK) — high line, ball-playing.
3. **Distributor Keeper** (DK) — emphasises long throws + long kicks
   for direct play (e.g. Edersonish).

### 4.2 Centre-Back (5 roles)

1. **Central Defender** (CD) — baseline.
2. **Ball-Playing Defender** (BPD) — progressive passing.
3. **Stopper** (STP) — aggressive stepping; press triggers.
4. **Libero** (LIB) — back-3 only; deepest, ball-carrying.
5. **Wide Centre-Back** (WCB) — back-3 only; wider position.

### 4.3 Full-Back / Wing-Back (6 roles, shared catalogue)

1. **Full-Back** (FB) — baseline.
2. **Wing-Back** (WB) — more advanced runs + crosses.
3. **Inverted Full-Back** (IFB) — tucks inside in possession.
4. **Complete Wing-Back** (CWB) — high-risk, all phases.
5. **Defensive Full-Back** (DFB) — stays back, conservative.
6. **Marauding Wing-Back** (MWB) — far higher attacking duty than CWB;
   wing-target archetype.

### 4.4 Defensive Midfielder (5 roles)

1. **Anchor Man** (ANC) — pure shield; Defend only.
2. **Ball-Winning Midfielder (DM)** (BWM-D) — destroyer.
3. **Deep-Lying Playmaker (DM)** (DLP-D) — tempo from deep.
4. **Half-Back** (HB) — drops between CBs in build-up.
5. **Regista** (REG) — deep playmaker with attacking risk.

### 4.5 Central Midfielder (7 roles)

1. **Central Midfielder** (CM) — generic; duty-driven.
2. **Box-to-Box Midfielder** (BBM) — high mileage; D/S/A.
3. **Mezzala** (MEZ) — wide-drifting half-8.
4. **Carrilero** (CAR) — shuttler between lines.
5. **Roaming Playmaker** (RPM) — high involvement, drifts.
6. **Advanced Playmaker (CM)** (AP-CM) — creator from CM.
7. **Deep-Lying Playmaker (CM)** (DLP-CM) — playmaker; less defensive
   than DM-DLP.

### 4.6 Attacking Midfielder Central (6 roles)

1. **Attacking Midfielder** (AM) — generic.
2. **Advanced Playmaker (AMC)** (AP-A) — primary creator.
3. **Shadow Striker** (SS) — second forward.
4. **Trequartista** (TQ) — free role; Attack only.
5. **Enganche** (ENG) — classic playmaker; static creative pivot.
6. **Wide Playmaker (AMC)** (WP-A) — drifts wide from AMC slot.

### 4.7 Wide AM / Winger (7 roles, AML/AMR shared)

1. **Winger** (W) — stay wide; cross / run.
2. **Inside Forward** (IF) — cut inside, shoot.
3. **Inverted Winger** (IW) — cut inside, create.
4. **Wide Playmaker (Winger)** (WP-W) — comes inside to dictate.
5. **Raumdeuter** (RMD) — ghost into spaces; low defensive work.
6. **Defensive Winger** (DW) — tracks back hard; modern 4-5-1 wide.
7. **Wide Target Man** (WTM) — physical winger; aerial threat from
   wide; hold-up.

### 4.8 Striker (8 roles)

1. **Advanced Forward** (AF) — generic.
2. **Poacher** (P) — pure finisher; Attack only.
3. **Target Man** (TM) — physical hold-up.
4. **Deep-Lying Forward** (DLF) — drops; creates.
5. **Pressing Forward** (PF) — first defender.
6. **False Nine** (F9) — drops to AMC zone; creates from front.
7. **Complete Forward** (CF) — does everything (rare attribute combo).
8. **Channel Forward** (CHF) — drifts wide to channels; counter
   threat.

### 4.9 Per-tier exposure summary

| Tier | Visible roles | UI |
|---|---|---|
| Quick | 0 (no role UI) | Locked preset templates apply roles automatically |
| Standard | ~22 (top 3 per position) | Bottom-sheet picker; 3 role cards per position |
| Expert | All 50 | Full picker with search + role-family filter |

Total: GK 3 + CB 5 + FB-WB 6 + DM 5 + CM 7 + AMC 6 + Wide 7 + ST 8 =
**47 roles**. Add 3 specialist alternates (`Libero (back-4)`,
`Regista (CM)`, `Trequartista (ST)`) for cross-position role usage =
**50 total**.

### 4.10 Duties per role

Globally: 3 duties (Defend / Support / Attack). Per-role allowed
duties:

| Pattern | Roles | Reason |
|---|---|---|
| **Single duty** (Defend only) | Anchor, Half-Back | Strictly defensive |
| **Single duty** (Attack only) | Poacher, Shadow Striker, Raumdeuter, Trequartista | Strictly attacking |
| **Single duty** (Support) | Sweeper Keeper, Distributor Keeper | Coordinator role |
| **Dual (Defend / Support)** | Central Defender, BPD, Full-Back, Inverted FB, Anchor (no — Defend only), DLP-DM, BWM-DM, Half-Back (no — Defend only), Regista | Defensive base + can step up |
| **Dual (Support / Attack)** | Wing-Back, Complete WB, Marauding WB, Box-to-Box, Mezzala, Wide Playmaker, Pressing Forward, Deep-Lying Forward, False Nine | Attack-leaning |
| **Triple (D / S / A)** | Central Midfielder, Winger, Inside Forward, Advanced Forward, Target Man | Maximally flexible |

UI rule: duty segmented control shows only allowed duties for the
selected role; disabled if single-duty.

## 5. Player instructions catalogue

### 5.1 Per-tier exposure

Per D3 Q&A — balanced 0 / 6 / 18:

| Tier | Player instr count |
|---|---|
| Quick | 0 (no per-player instructions) |
| Standard | 6 (high-impact subset) |
| Expert | 18 (full catalogue in 4 groups) |

### 5.2 Standard tier — 6 high-impact instructions

Each as 3-step segmented control (Less / Normal / More):

1. **Width tendency** — Stay Wider / Normal / Cut Inside
2. **Run frequency** — Rarely / Normal / Often
3. **Press intensity** (individual) — Low / Normal / High
4. **Passing risk** (individual) — Safe / Normal / Risky
5. **Shoot frequency** — Rarely / Normal / Often
6. **Marking** — Loose / Normal / Tight

### 5.3 Expert tier — 18 instructions across 4 groups

**A. Positioning & movement (6)**:

1. Stay Wider / Stay Narrower
2. Roam From Position / Hold Position
3. Forward Runs (Rarely / Normal / Often)
4. Move Into Channels (On / Off)
5. Drop Off More / Push Higher Up (3-way)
6. Marking Style — Zonal / Mixed / Tight Man

**B. Ball use (6)**:

7. Passing Directness — Shorter / Normal / Direct
8. Passing Risk — Safer / Normal / Riskier
9. Crossing Frequency — Less / Normal / More
10. Cross Type — Byline low / Mixed / Early high
11. Shoot On Sight / Work Ball Into Box
12. Dribbling — Less / Normal / More

**C. Defensive / pressing (4)**:

13. Pressing Intensity (individual) — Lower / Normal / Higher
14. Tackle Style — Ease Off / Normal / Hard
15. Track Back / Stay Forward (wide players / AMs / STs)
16. Show Onto Foot — Weaker / Any / Stronger

**D. Set-piece behaviour (2)**:

17. Set-Piece Role Bias — Stay Back / Normal / Attack Ball
18. Short Option Preference — Available for Short Corners/FKs (On/Off)

### 5.4 Defaults + override visual state

Per role, a default Player Instruction set is auto-applied. User can
override per player. UI rule (per D9 + mobile-ux research):

- Default rows: neutral text.
- Overridden rows: accent border + "Changed" tag + inline reset icon.
- Player header shows badge with count of active overrides.
- "Reset to role defaults" button at row level + section level.

## 6. Team instructions + familiarity model

### 6.1 Per-tier exposure

Per D3 Q&A — balanced 1 / 5 / 8:

| Tier | Team instr count |
|---|---|
| Quick | 1 (Mentality only) |
| Standard | 5 (Mentality + Pressing + Defensive Line + Width + Tempo) |
| Expert | 8 (adds Build-up Style + Time-Wasting + Focus of Play) |

### 6.2 Team instruction catalogue

| # | Instruction | Steps | Tier |
|---:|---|---|---|
| 1 | **Mentality** | VeryDef / Def / Balanced / Att / VeryAtt (5 visible, 7 internal) | Quick + |
| 2 | **Pressing Intensity** | Low / Med / High | Standard + |
| 3 | **Defensive Line Height** | Deep / Normal / High / VeryHigh | Standard + |
| 4 | **Team Width** | Narrow / Normal / Wide | Standard + |
| 5 | **Tempo** | Slow / Normal / Fast / VeryFast | Standard + |
| 6 | **Build-up Style** | Short / Mixed / Direct / Long Ball | Expert |
| 7 | **Time-Wasting** | Never / Sometimes / Aggressive | Expert |
| 8 | **Focus of Play** | Left / Centre / Right / Mixed | Expert |

### 6.3 Mentality model (5 visible / 7 internal)

UI shows 5 bands: VeryDef / Def / Balanced / Att / VeryAtt. Internal
engine uses 7 steps with hidden Cautious + Positive half-steps for
fine-grained AI tuning + emergent variance from instruction combos.
Avoids the 21-step fiddliness on mobile while preserving engine
nuance.

### 6.4 Phase logic (Expert per-phase overrides)

Per D3 Q&A — light per-phase overrides at Expert tier only:

| Phase | Expert overrides |
|---|---|
| **Out of Possession** | Override Pressing Intensity; override Defensive Line; press triggers (Conservative / Normal / Aggressive — applies to which lines you press: forwards-only / midfield / full-team) |
| **In Possession** | Override Width; override Build-up Style |
| **Transition to Attack** | Choice: Counter Immediately / Regroup Then Build / Balanced; optional tempo override for first 3-4 actions after regain |
| **Transition to Defend** | Choice: Counter-Press / Drop Into Shape / Balanced |
| **Set Plays** | Routine selection only (per §7.4 + A3) |

Standard tier: single global team instructions — no per-phase UI. Phase
logic still runs internally; just no user override.

### 6.5 Tactical familiarity model

Per D3 Q&A — full FM-style with explicit ContinuityMatchFactor +
new-manager Similarity. Range 0-100 per tactic slot.

#### Growth per week

For tactic actively used + trained:

```text
TrainingGain:
  Primary tactic:   +4 × TacticalTrainingFocus
  Secondary (max 2): +2 × TacticalTrainingFocus
  Others:           0

MatchGain per match:
  90+ min in tactic: +3
  60-89 min:         +3
  30-59 min:         +1.5
  10-29 min:         +0.75
  <10 min:           0

ContinuityBonus:
  SquadContinuityFactor based on # players in XI with <5 apps in tactic:
    0-1 new: 1.0
    2-3 new: 0.7
    4-5 new: 0.4
    6+ new:  0.1
  ContinuityBonus = 2 × SquadContinuityFactor × MatchUsageFactor

WeeklyGain = min(TrainingGain + Σ MatchGain + Σ ContinuityBonus, 8)
```

Expected pace: 30 → 90 in ~8 weeks with full focus + same XI; ~12
weeks with half focus + some rotation.

#### Decay per week of non-use

If tactic not used ≥ 30 min in any match this week: `familiarity -= 2`,
**floor 20** (squad never fully forgets a tactic they once knew).

#### Switch modifier (per match)

Independent short-term penalty for not using a tactic recently:

| Last used | SwitchModifier |
|---|---|
| Last match | 1.0 |
| 1-3 matches ago | 0.9 |
| 4-10 matches ago | 0.75 |
| 11+ or never | 0.6 |

#### Penalty curve → match engine

`EffectiveFamiliarity = familiarity × SwitchModifier`

```text
0-20:    FamiliarityFactor = 0.4 + 0.01 × f      (0→0.4, 20→0.6)
20-40:   FamiliarityFactor = 0.6 + 0.01 × (f-20) (20→0.6, 40→0.8)
40-60:   FamiliarityFactor = 0.8 + 0.005 × (f-40) (40→0.8, 60→0.9)
60-80:   FamiliarityFactor = 0.9 + 0.005 × (f-60) (60→0.9, 80→1.0)
80-100:  FamiliarityFactor = 1.0 + 0.002 × (f-80) (80→1.0, 100→1.04)
```

Applied to: team-shape correctness, press/cover distances, line-height
adherence, role-execution probability. NOT applied to pure
physical/technical duels (per match-engine model).

#### Continuity match factor (rotation penalty)

For each match, count starting XI players with < 5 appearances in this
tactic:

| # new in XI | ContinuityMatchFactor |
|---|---|
| 0-1 | 1.0 |
| 2-3 | 0.97 |
| 4-5 | 0.93 |
| 6-7 | 0.88 |
| 8+ | 0.80 |

Total engine multiplier: `EffectiveFamiliarityFactor =
FamiliarityFactor × ContinuityMatchFactor`.

#### New manager Similarity

When a new manager arrives (per D4 hiring), each existing tactic's
familiarity carries over partially:

```text
new_familiarity = old_familiarity × (0.5 + 0.5 × Similarity)
```

`Similarity` (0.4-1.0) computed from:

- Same base formation: +0.4
- Within 1 step on mentality scale: +0.3
- Same pressing-preference band: +0.3

Examples:

- Same archetype, same formation, same mentality: Sim = 1.0 →
  no penalty.
- Same formation, opposite mentality: Sim = 0.7 → 0.85× = 80 → 68.
- Different shape (back-3 → back-4) + different mentality: Sim = 0.4 →
  0.7× = 80 → 56.

### 6.6 Tactic slots + saved presets

Per D3 Q&A — FM-style:

| Tier | Tactic slots (with familiarity) | Saved presets (no familiarity) |
|---|---|---|
| Quick | 2 (A / B) | 0 |
| Standard | 3 (A / B / C) | 10 |
| Expert | 3 (A / B / C) | 50 |

Slots are designated **Primary / Secondary / Experimental** in the UI.
Only Primary + Secondary get training-driven familiarity gain
(per §6.5). Experimental tactic accumulates familiarity only via
match minutes.

### 6.7 Quick tier — 5 starter presets

Locked, hand-tuned presets shipped at MVP:

| Preset | Formation | Mentality | Pressing | Style |
|---|---|---|---|---|
| **Solid 4-4-2** | 4-4-2 Flat | Balanced | Medium | All-purpose |
| **Counter-Attack 4-3-3** | 4-3-3 | Defensive | Low | Direct / Long ball |
| **High-Pressing 4-2-3-1** | 4-2-3-1 | Attacking | High | Short / Mixed |
| **Park the Bus 5-3-2** | 5-3-2 | VeryDef | Low | Long ball |
| **Balanced 4-3-3** | 4-3-3 | Balanced | Medium | Short / Mixed |

Quick users see only these 5 + the formation they're currently on.
Switching presets cycles all 11 roles + team instructions automatically.

### 6.8 Tactic preset sharing (per ADR-0016)

URL-encoded share codes, local-only at MVP:

```text
TACTIC-<hash>-<base64-LZ-compressed-JSON>
```

Encoding pipeline:

1. Serialise tactic config to compact JSON (formation, role+duty per
   position, all player instructions, all team instructions, phase
   overrides, set-piece routine selections).
2. Compress with LZ-string.
3. Base64 (URL-safe) encode.
4. Prefix with `TACTIC-<crc32-checksum>-`.

Result: typical tactic ~1-2 KB JSON → ~500-800 B base64. Fits in a
Discord message / Reddit comment / URL parameter.

Expert tier UI:

- **Community tab**: imported local presets + curated bundled packs.
- Filter by formation / style / use-case / vs-archetype.
- Import: paste code → preview → assign to Slot A/B/C OR save as preset.
- Export: copy-to-clipboard share code with optional metadata.

No server backend at MVP; players paste codes on community channels
(Reddit, Discord). Curated packs ship as ADR-0016 community overrides.

## 7. Mobile-first UX patterns

### 7.1 Formation editor

**Primary path**: preset carousel + tap-to-tweak.

```text
┌─────────────────────────────────────┐
│ ← Tactic A (Primary)         💾 ✓   │ ← Header
├─────────────────────────────────────┤
│ [4-4-2] [4-3-3] [4-2-3-1] [3-5-2]…  │ ← Formation carousel
├─────────────────────────────────────┤
│                                     │
│        ●                            │
│      ●   ●                          │
│    ●  ● ● ●  ●                      │ ← Pitch preview (Canvas 2D)
│      ● ●                            │
│        ●                            │
│                                     │
├─────────────────────────────────────┤
│ Edit Roles │ Team Tactics │ Set Pcs │ ← Section nav
├─────────────────────────────────────┤
│ ⟲ Undo    ↻ Reset    💾 Save        │ ← Sticky footer
└─────────────────────────────────────┘
```

Position circles: 36 px visual, 48 px hit target (per D9 touch-target
rule). Tap to select; nearby valid slots highlight; tap destination
to swap. Long-press drag only in Expert tier.

### 7.2 Role + duty picker (bottom sheet)

```text
┌─────────────────────────────────────┐
│ ━━━━━     (bottom sheet handle)     │
│ Right Back  — James (Number 23)     │
├─────────────────────────────────────┤
│ Defend  ◐ Support  ◯ Attack         │ ← Duty segmented
├─────────────────────────────────────┤
│ Role:                               │
│ ┌──────────────────────────────┐    │
│ │ 🛡 Full-Back        Defend → │    │
│ │ Solid; tracks runners.       │    │
│ │ Key: Tackling, Marking       │    │
│ └──────────────────────────────┘    │
│ ┌──────────────────────────────┐    │
│ │ 🏃 Wing-Back       Support → │ ✓  │
│ │ Provides width; crosses.     │    │
│ │ Key: Pace, Crossing, Stamina │    │
│ └──────────────────────────────┘    │
│ ┌──────────────────────────────┐    │
│ │ 🎯 Inverted FB     Defend → │    │
│ │ Tucks inside; build-up.      │    │
│ │ Key: Passing, Vision         │    │
│ └──────────────────────────────┘    │
├─────────────────────────────────────┤
│ Edit Instructions →                 │ ← Player instructions (Std/Exp)
└─────────────────────────────────────┘
```

Cards 44 px+ tall. Standard tier shows top 3 per position; Expert
shows all + search/filter.

### 7.3 Player instructions (accordion)

```text
┌─────────────────────────────────────┐
│ ← Wing-Back (Support)               │
│ James • 4 overrides active   ↺ Reset│
├─────────────────────────────────────┤
│ ▼ Positioning & movement     (2)    │
│   Stay Wider           ◀──●──▶ Wide │ ● = Changed
│   Forward Runs         Often        │ ●
│   Roam from Position   Hold         │
│   Move into Channels   ☐ Off        │
│   …                                 │
├─────────────────────────────────────┤
│ ▶ Ball use                   (1)    │
├─────────────────────────────────────┤
│ ▶ Defensive / pressing       (1)    │
├─────────────────────────────────────┤
│ ▶ Set pieces                 (0)    │
└─────────────────────────────────────┘
```

Quick: section hidden entirely. Standard: 6 high-impact only in flat
list. Expert: 4 accordion groups with search.

### 7.4 Team tactics page (segmented controls)

```text
┌─────────────────────────────────────┐
│ ← Team Tactics                      │
├─────────────────────────────────────┤
│ Mentality                           │
│ [VDef] [Def] [Bal●] [Att] [VAtt]    │ ← 5-band segmented
├─────────────────────────────────────┤
│ Pressing Intensity                  │
│ [Low] [Med●] [High]                 │
├─────────────────────────────────────┤
│ Defensive Line Height               │
│ [Deep] [Normal●] [High] [VHigh]     │
├─────────────────────────────────────┤
│ Team Width                          │
│ [Narrow] [Normal●] [Wide]           │
├─────────────────────────────────────┤
│ Tempo                               │
│ [Slow] [Normal●] [Fast] [VFast]     │
├─────────────────────────────────────┤
│ ▶ Advanced (Expert)                 │ ← Collapsible
│   Build-up Style                    │
│   Time-Wasting                      │
│   Focus of Play                     │
└─────────────────────────────────────┘
```

Each row 44 px+ tall. Segmented controls use `ToggleGroup` from
shadcn/ui with custom styling.

### 7.5 Halftime modal (3-control + open editor)

Per D9 + tactics-system §7 (existing GDD locked this):

```text
┌─────────────────────────────────────┐
│ Halftime — 1-1                      │
│ Possession 53%   xG: 0.8 / 0.7      │
├─────────────────────────────────────┤
│ Subs                  2 available → │ ← Tile 1
├─────────────────────────────────────┤
│ Mentality      Balanced  ▲ ▼        │ ← Tile 2 (up/down)
├─────────────────────────────────────┤
│ Press Higher / Sit Deeper           │ ← Tile 3 (single tactical tweak)
│ [Press Higher] [Sit Deeper]         │
├─────────────────────────────────────┤
│ Open Full Editor →                  │
└─────────────────────────────────────┘
```

Tile 3 alternates between "press higher / sit deeper" (matches AI's
in-match decision pattern per D4).

### 7.6 Pre-match lineup screen

```text
┌─────────────────────────────────────┐
│ vs Borussia Schwarzwald (A)         │
│ Tactic A — Solid 4-4-2 (Familiarity 87) │
├─────────────────────────────────────┤
│ [Lineup] [Bench] [Tactics] [SetPcs] │ ← Tabs
├─────────────────────────────────────┤
│        🥅  GK Smith                 │
│   CB    CB    CB                    │ ← Pitch lineup
│  LB         RB                      │
│      CM   CM                        │
│  LW         RW                      │
│        ST                           │
├─────────────────────────────────────┤
│ Opposition Analysis →               │
├─────────────────────────────────────┤
│ Start Match                         │ ← Primary CTA
└─────────────────────────────────────┘
```

Tabs split sections — never force all 11 + 7 subs + tactics + set
pieces on the same 360 px screen.

### 7.7 Touch target enforcement

All tactics UI controls MUST meet 44 × 44 px hit target (per D9):

- Position circles: 36 px visual + invisible padding to 48 px hit area.
- Role cards: 44+ px tall.
- Segmented control buttons: 44+ px tall.
- Mentality slider thumb: 44 px hit area.
- 8 px minimum spacing between adjacent controls (12 px for grouped
  chips).

### 7.8 Accessibility (WCAG 2.2 AA / BITV 2.0)

Per D9:

- Screen-reader labels on every pitch position: "Right back, James,
  Wing-Back Support, 4 custom instructions".
- Keyboard navigation: Tab between sections; arrow keys to navigate
  pitch positions (roving tabindex in football-formation order); Enter
  to open role sheet; Space to toggle instructions; Esc to close
  sheets.
- Colour-independent role/duty indicators: D/S/A badges with
  abbreviation text; role-family icons (shield / arrow / wing / anchor);
  border patterns or shape changes for state.

## 8. Touchline shouts (3 universal at MVP)

Per D3 Q&A — 3 shouts available at all tiers (no tier gating).

| Shout | Use case | Effects (5-10 min duration) |
|---|---|---|
| **Encourage** | Players flat / morale low / after conceding | +5 % Determination + Work Rate; -5 % Nerves; +5 % Composure. Stronger if morale is low. |
| **Demand More** | Match drifting; better side underperforming | +5-10 % Pressing Intensity + Defensive Work; +5 % shot frequency; +1-2 % extra stamina drain |
| **All-Out Attack** | Chasing late goal | +10-15 % Pressing Intensity; +10 % attacking risk; -10 % defensive organisation; +3-5 % extra stamina drain; longer cooldown (20 min) |

### 8.1 Mechanics

- **Cooldown**: 10 min between shouts (20 min for All-Out Attack).
- **Max per match**: 8 (1 per 10 in-game minutes).
- **Effects**: stack additively but capped (no shout combo exceeds
  1.3× any single metric).
- **Determinism**: shout effects are applied as fixed multipliers on
  the next decision pass; no RNG involvement (per D8).

Future post-MVP shouts (deferred): Focus / Regroup, Time-Waste,
Tackle Harder. Easy to add via the same mechanic.

## 9. Opposition tactics — 3-layer template system

Per D3 Q&A — **archetype + sub-archetype + manager-signature** 3-layer
system gives emergent club character.

### 9.1 Layer 1 — Archetype templates (8)

Universal counter-templates for common opponent shapes:

| ID | Vs | Typical adjustments |
|---|---|---|
| `vs_deep_block` | Defensive opponent | Push line + tempo down + width up + focus side |
| `vs_high_press` | Aggressive press | Build-up direct + bypass midfield + lower line |
| `vs_wide_overloads` | Wing-focused opponent | Compact width + double-up wide + show inside |
| `vs_target_man` | Aerial threat ST | Tight mark + drop second CB + zone marking |
| `vs_playmaker_10` | Creative AMC | Tight mark playmaker + press-trigger on him |
| `vs_counter_attack` | Counter-oriented | Tempo down + cautious + recovery first |
| `vs_3_5_2` | Back-3 formation | Stretch wide + isolate WB + central overload |
| `vs_4_2_3_1` | Standard top-club shape | Press DM pivot + force wide |

Each template carries:

- 2-4 team-instruction overrides (deltas; e.g. `width: +1 step`,
  `pressing: -1 step`).
- 2-3 opposition-instruction templates (e.g. "tight-mark their highest-
  rated AMC", "show their LW inside").

### 9.2 Layer 2 — Sub-archetypes (~25 variants)

3-4 sub-variants per main archetype, with distinct philosophies:

**Example: `vs_deep_block` archetype sub-variants**:

| ID | Philosophy |
|---|---|
| `vs_deep_block/stretch_wide` | Maximum width; cross-heavy; target man for headers |
| `vs_deep_block/box_pack_central` | Pack the box centrally; cutbacks + crosses to far post |
| `vs_deep_block/patient_build` | Slow tempo; circulation until gap; risk-averse |
| `vs_deep_block/quick_combination` | Tiki-taka in final third; one-twos in penalty area |

**Example: `vs_high_press` sub-variants**:

| ID | Philosophy |
|---|---|
| `vs_high_press/direct_bypass` | Long balls from GK to target striker; skip midfield |
| `vs_high_press/playmaker_dribble` | Through a deep playmaker who dribbles past first wave |
| `vs_high_press/wing_bypass` | Quick switches to overlapping wingers |
| `vs_high_press/draw_and_release` | Invite press; counter on regain |

Total sub-archetypes: ~25-30 (8 archetypes × 3-4 sub-variants each).

User picks the **archetype first**, then optionally drills into a
sub-archetype. Sub-archetype defaults to first listed variant if not
chosen.

### 9.3 Layer 3 — Manager-signature templates

Each of the 10 AI manager archetypes from D4 has 1-3 **signature
opposition-counter templates** they tend to apply, regardless of
which sub-archetype is technically optimal. This:

- Gives AI managers distinct tactical character.
- Means user can scout opponents' manager archetypes to predict tactics.
- Creates emergent club character (clubs accumulate historic manager
  signatures).

**Example signature template assignments**:

| AI archetype | Signature templates |
|---|---|
| Park-the-Bus Pragmatist | `vs_high_press/direct_bypass`, `vs_*/conservative_block` |
| Counter-Attacking Reactive | `vs_*/draw_and_release`, `vs_deep_block/quick_break` |
| High-Pressing Aggressor | `vs_*/aggressive_press_override` (overrides defensive in any matchup) |
| Possession Maestro | `vs_*/patient_build`, `vs_deep_block/quick_combination` |
| Youth Developer | `vs_*/balanced_familiar` (sticks with primary, no counter) |
| Galáctico Collector | `vs_*/star_individualist` (mark our star tighter) |
| Moneyball Director | `vs_*/exploit_weakness` (data-driven; picks max-EV sub-archetype) |
| Tinkerman | rotates 3 different signature templates randomly |
| Conservative Stabilizer | sticks with 1 default; never adapts |
| Chaos Motivator | picks sub-archetype at random within main archetype |

### 9.4 Emergent club character

Clubs accumulate counter-template history:

- Track last 50 matches' counter-template usage per club.
- Surface in opposition analysis: "Borussia Schwarzwald consistently
  uses `vs_high_press/direct_bypass` against attacking opponents".
- Players begin to recognise rival clubs by their counter-template
  preferences over a long save.

This is **D3's biggest unique-style contribution**: no competitor
surfaces this kind of historic tactical fingerprint per club.

### 9.5 Per-tier UX

| Tier | Opposition tactics UX |
|---|---|
| **Quick** | Pre-match panel shows opponent form + key player. Single "Recommended Counter" button auto-applies best layer-2 sub-archetype. |
| **Standard** | Full opponent summary (form, formation, key players, weakness zones, historic counter-template preferences). Pick from 3-5 layer-2 sub-archetype templates + 3 manual opposition instructions. |
| **Expert** | Full library + create/edit/tag/import + auto-suggest via D4 arms race + view club's historic counter-template fingerprint. Unlimited manual opposition instructions. |

### 9.6 Pre-match opposition analysis panel

Universal info shown (per tier):

| Info | Quick | Standard | Expert |
|---|---|---|---|
| Last 5 results | ✓ | ✓ | ✓ |
| League position | ✓ | ✓ | ✓ |
| Preferred formation (from last 5) | ✓ | ✓ | ✓ |
| Manager archetype label | ✓ | ✓ | ✓ |
| Average team mentality | — | ✓ | ✓ |
| Pressing height | — | ✓ | ✓ |
| Build-up style | — | ✓ | ✓ |
| Key player (1) | ✓ | — | — |
| Top 3-4 key players + role tags | — | ✓ | ✓ |
| Weakness zones (from A3 zone stats) | — | ✓ | ✓ |
| Common counters from teams that beat them | — | — | ✓ |
| Their historic counter-template fingerprint | — | — | ✓ |
| Auto-suggest vs them | "Recommended Counter" button | Suggested 1-2 from sub-archetypes | Suggested 1-3 + reason |

## 10. Per-tier UX summary

### 10.1 Quick tier — 60-second sessions

Target: casual users; halftime / pre-match quick edits in under
1 minute.

- 5 starter presets only.
- No role / instruction UI.
- Mentality (5 bands) + "Recommended Counter" button.
- 3 touchline shouts in match.
- Simple opposition info panel.

### 10.2 Standard tier — regular match prep

Target: most users; 5-15 minutes per match-week.

- 8 core formations visible (12 if user opens Tier-2).
- Top 3 roles per position via bottom sheet.
- 6 high-impact player instructions per player.
- 5 team instructions (Mentality / Pressing / Defensive Line /
  Width / Tempo).
- 10 saved presets.
- 3-5 opposition sub-archetype templates + 3 manual instructions.
- All 3 touchline shouts.

### 10.3 Expert tier — full tactical control

Target: veterans; deep planning + tablet usage.

- All 20 formations.
- All 50 roles + search/filter.
- All 18 player instructions in 4 accordion groups.
- All 8 team instructions + light per-phase overrides.
- Long-press drag formation editing.
- 50 saved presets + community import via share codes.
- Full opposition library + sub-archetypes + manager-signature view +
  create/edit/tag.
- All 3 touchline shouts + (post-MVP) extras.

## 11. Tactical predictability penalty

Ties to D4's tactical arms race.

```text
UsageScore = matches_with_tactic / total_matches_played (rolling 38 matches)
Predictability = UsageScore - 0.5
LeagueAdaptationFactor = 1 - clamp(Predictability × 0.1, 0, 0.05)
```

Effect:

- Using one tactic 100 % of the time → 5 % penalty on offensive
  pattern effectiveness in league games (not cup / continental).
- Mixing 50/50 → no penalty.
- Counter-templates (per §9) restore half the penalty when applied.

This encourages variety without forcing it — user can still commit to
one signature tactic and accept the 5 % cost.

## 12. Attribute schema reconciliation (mechanical fix)

The pre-existing `tactics-system.md` GDD §9 stated:

> "Default 1-10 with talent buckets. Expert mode shows the 1-20 scale
> for FM parity. Star rating in Quick mode.
>
> Categories:
> - Technical (10 attributes).
> - Physical (8).
> - Mental (10).
> - Hidden (5).
> Detailed list in [squad-and-club-structure] §5."

**This is incorrect per D2 (already locked)**.

D2 (per [[data-generators]] §10) locks the canonical schema:

- **16 visible** (7 Technical + 5 Mental + 4 Physical) on **1-20 scale**.
- **4 GK-only extras** (Reflexes / Handling / Aerial Reach /
  Distribution).
- **8 hidden meta** (Potential / Consistency / Pressure /
  Professionalism / Determination / Adaptability / Injury Proneness /
  Big Matches).

Total: **20 visible** (16 universal + 4 GK) + **8 hidden** = **28
attributes on 1-20 scale**.

Per-tier display:

- **Quick**: 4-star summary rating (computed as weighted average of
  visible attributes by archetype).
- **Standard**: 1-20 scale across the 16 visible (+ 4 GK if keeper).
- **Expert**: 1-20 scale across 20 visible + scout-report uncertainty
  bands for 8 hidden attributes.

GDD update will replace the §9 paragraph with this reconciled schema.

## 13. Performance budget

### 13.1 Tactics UI bundle

| Component | Budget |
|---|---|
| Formation zone weights (data) | per A3 ~80-100 KB minified |
| Role catalogue (data) | ~10-15 KB JSON |
| Player + team instruction definitions | ~5 KB JSON |
| Opposition templates (3-layer) | ~15-20 KB JSON |
| Tactics UI module (React) | ~30-40 KB gzipped |
| Total tactics-related bundle | ~140-180 KB gzipped (fits D9 per-route lazy ≤ 200 KB) |

### 13.2 Render budget

- Pitch preview (Canvas 2D): ~5-10 ms first render; ~1-2 ms re-render
  on position change.
- Role bottom sheet open: ~3-5 ms.
- Team instruction page render: ~2-3 ms (virtualised if > 30 rows).
- Halftime modal open: ~5 ms total.

All within D9's frame budget (p95 main-thread ≤ 12 ms).

### 13.3 Storage

| Item | Size |
|---|---|
| Tactic preset (encoded JSON) | ~1-2 KB pre-encoding; ~500-800 B base64 |
| Familiarity per slot | 4 B (single float clamped 0-100) |
| 50 saved presets at Expert | ~50-100 KB total |
| Tactic share codes (community pack) | ~100-200 KB for a 100-tactic pack |

Fits easily within D9's 200 MB total IndexedDB budget.

## 14. Open follow-ups

- **A8 ADR-0008 Mobile-first UI**: this note is the binding reference
  for tactics UI; A8 should incorporate the per-tier exposure tables
  + touch-target rules + accordion / bottom-sheet patterns.
- **I6 Tactics mentality slider vs bands**: closed by this note (5
  visible bands + 7 internal steps).
- **D7 Mobile UX + IA + accessibility**: this note's UX patterns feed
  D7's route inventory + navigation map.
- **E21 Asset pipeline**: pitch preview SVG / canvas assets are part
  of E21.
- **D15 Narrative event content**: in-match shout effects + tactical
  changes feed narrative event triggers.

## 15. Sources

- Perplexity Sonar research, 2026-05-17 (gap D3): mobile-first
  tactics UX — formation editor patterns (tap-to-place vs drag),
  role/duty picker (bottom sheet), player instructions (accordion +
  grouped), team controls (segmented controls), halftime modal,
  pre-match lineup, opposition analysis, set-piece UX, touch target
  sizes per Apple HIG + Material 3, WCAG 2.2 AA accessibility,
  competitor analysis across FM Mobile / EA FC Mobile / PES /
  Top Eleven / OSM / Hattrick / SM24 / Anstoss.
- Perplexity Sonar research, 2026-05-17 (gap D3): formation taxonomy
  + role catalogue + duties + player instructions + team instructions
  + phase logic + mentality model + set-piece selection + tactic
  preset library, with per-tier exposure recommendations.
- Perplexity Sonar research, 2026-05-17 (gap D3): tactical familiarity
  model (growth, decay, switch modifier, penalty curve, continuity
  factor, new manager penalty); opposition tactics + template library
  design (auto-suggest, archetype templates, manual overrides);
  tactical change frequency; tactic library size; preset sharing
  format; touchline shouts; tactical fatigue / overuse predictability
  penalty.
- Locked context: [[data-generators]] (D2 attribute schema),
  [[ai-manager-behaviour]] (D4 AI archetypes + tactical arms race),
  [[../10-Architecture/09-Decisions/ADR-0003-match-engine]] (A3
  formation zone weights + set-piece routines), [[performance-budgets]]
  (D9 UI tiers + touch targets + bundle budgets),
  [[determinism-and-replay]] (D8 deterministic replay contract).
- D3 Q&A with Nico (2026-05-17): 6 of 8 recommendations accepted as-is;
  formations expanded to 20 (from recommended 12); roles expanded to
  50 (from recommended 35); opposition tactics extended to 3-layer
  system with sub-archetypes + manager-signature templates + emergent
  club character; touchline shouts simplified to 3 universal (no tier
  gating).
