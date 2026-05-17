---
title: Onboarding Strategy — FTUE, Inbox Tutorial, Feed-Cards, Accessibility
status: current
binding: true
tags: [research, onboarding, ftue, tutorial, inbox, feed-cards, accessibility, mobile-ux]
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[ai-manager-behaviour]], [[tactics-and-formations]], [[data-generators]], [[performance-budgets]], [[progressive-disclosure-research]], [[club-boss-analysis]], [[../50-Game-Design/progressive-disclosure-ui]], [[../50-Game-Design/mode-manage-a-club-career]], [[../50-Game-Design/mode-create-a-club-roguelite]]
---

# Onboarding Strategy — FTUE, Inbox Tutorial, Feed-Cards, Accessibility

> Gap D5 of [[wave-3-gap-analysis]]. Locks the strategic onboarding
> system for an offline-first PWA football manager: 60-second FTUE
> with single experience question + mode picker + Advanced-setup
> escape; 12-message first-season inbox tutorial arc with 10-sender
> cast and per-sender voice guides; named configurable Assistant
> Manager character ("Alex" default) with per-difficulty intensity
> auto-scaling; feed-card daily action queue as Home dashboard
> primary UI; accessibility-first design (WCAG 2.2 AA / BITV 2.0).
> Without this gap the depth locked in D2 + D3 + D4 becomes a
> barrier; with it, onboarding turns depth into mastery.

## 1. Context and inputs

This note completes the user-facing onboarding strategy on top of
already-locked foundations:

- **D9 Performance Budgets** ([[performance-budgets]]): locked the
  3 UI tiers (Quick / Standard / Expert), touch-target 44 × 44 px,
  WCAG 2.2 AA, PWA install prompt budget ("after first success +
  ≥ 3 sessions"), 4-tier device matrix.
- **D4 AI Manager Behaviour** ([[ai-manager-behaviour]]): locked the
  4 difficulty modes (Easy / Normal / Hard / Sim) with concrete
  per-tier knob tables. Onboarding sets initial choice.
- **D3 Tactics & Formations** ([[tactics-and-formations]]): locked
  20 formations + 50 roles + 18 player instructions + 8 team
  instructions across 3 UI tiers. Onboarding teaches this depth.
- **D2 Data Generators** ([[data-generators]]): locked world-size
  presets (Small / Medium / Large). New Save wizard exposes.
- **Existing mode GDDs**:
  [[../50-Game-Design/mode-manage-a-club-career]] (Career — Anstoss-
  style sack-able manager) +
  [[../50-Game-Design/mode-create-a-club-roguelite]] (Create-a-Club
  Roguelite — permadeath + meta-progression).
- **Wave 1 research**: [[club-boss-analysis]] documented the inbox-
  as-narrative pattern from Club Boss; D5 builds on it. [[anstoss-
  series-deep-dive]] documented Anstoss's inbox-driven storytelling.

This note adds: complete FTUE flow, mode-picker design, inbox
tutorial sender cast + 12-message arc + voice guides, feed-card
daily action queue with priority algorithm, per-difficulty
Assistant Manager UX, tutorial overlay patterns, returning-user
recap, accessibility paths, and the onboarding-state IndexedDB
schema.

## 2. Comparative analysis — how other manager games onboard

Distilled from public dev commentary, modding community knowledge,
product teardowns, and retention benchmarks.

### 2.1 Comparison table

| Game | FTUE pattern | Approx D1 retention | Tutorial driver | Sidekick | Strength | Weakness |
|---|---|---|---|---|---|---|
| **FM PC** | 90-min advisor + heavy inbox spam | ~15-25 % | Pop-up advisor | Assistant Manager | Depth | Famously bad onboarding; veterans skip |
| **FM Mobile** | Tutorial overlays on first match | ~25-30 % | Overlays + inbox | Assistant Manager | Adapted to mobile | Still overwhelming |
| **Top Eleven** | Sign-up → name club → first match | ~35-40 % | Coach marks | Tactical advisor | **Best mobile FTUE** | Gameplay shallow |
| **OSM** | Pick league → club → in | ~35 % | Minimal | None | Web-friendly fast | No assistant teaching |
| **Hattrick** | Zero onboarding | ~10-15 % | None | None | Survivorship bias | 90 % bounce |
| **Anstoss 1-3** | Inbox-as-narrative + family flavour | N/A (SP) | Inbox emails | Co-Trainer | **Strong narrative voice** | German-only original |
| **Club Boss** (mobile) | Inbox-as-narrative on mobile | mid mobile | Inbox + tooltips | Assistant | Modern inbox-narrative reference | Generic mid-mobile depth |
| **SM24** | Tutorial popups + Unity polish | ~25-30 % | Popups | Assistant | Polished | Less character than Anstoss |
| **EA SPORTS FC Career** | Heavy tutorial; mostly skipped | varies | Coach objectives | Coach | Polished | Over-tutorialised |
| **PES / eFootball Mobile** | Similar to EA | varies | Coach popups | Coach | Same | Hidden depth |

### 2.2 Retention benchmarks (2026)

| Segment | D1 | D7 | D30 |
|---|---|---|---|
| Casual F2P (hypercasual, puzzle) | 35-45 % | 10-18 % | 2-6 % |
| Mid-core / strategy / managers | 25-35 % | 8-15 % | 3-7 % |
| Hardcore / PC-like deep sims on mobile | 15-25 % | 5-10 % | 2-5 % |
| **Best-in-class mobile manager** (Top Eleven, OSM) | **35-40 %** | **15-18 %** | **6-8 %** |
| Deep mobile manager (SM24, FM Mobile) | 25-30 % | 10-12 % | 4-6 % |

**Our target**: D1 ≥ 30 %, D7 ≥ 12 %, D30 ≥ 5 %. Hit by combining
Top Eleven's frictionless FTUE + Anstoss inbox character + per-
difficulty assistant intensity + 3-tier UI.

### 2.3 FTUE step drop-off (typical 5-step sequence)

| Step | Retention |
|---|---|
| Install → first app open | 60-70 % |
| App open → team selected | 80-90 % |
| Team selected → first match started | 70-85 % |
| First match started → finished | 65-80 % |
| First match finished → session 2 (D1) | matches D1 % |

**Critical rule**: every required decision screen before first match
costs ~5-10 % retention. Goal: **≤ 2 required screens before first
match**.

### 2.4 Techniques we adopt

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Single experience-question FTUE** | Top Eleven (minimal friction) | §3.1 — maps to tier + difficulty |
| 2 | **Recommended-club default** | Top Eleven, OSM | §3.4 — reduces club-picker friction |
| 3 | **Inbox-as-narrative tutorial** | Anstoss 1-3, Club Boss | §5 — 12-message first-season arc |
| 4 | **Named Assistant Manager** | FM Mobile, EA FC | §6 — configurable "Alex" + portrait presets |
| 5 | **Per-difficulty assistant intensity** | FM (implicit), our explicit | §6.4 — Easy proactive → Sim silent |
| 6 | **Feed-card daily action queue** | Top Eleven, EA FC objectives | §7 — Home primary UI |
| 7 | **Coach marks max 2-3 per screen** | Modern mobile games | §8.2 — first-visit only |
| 8 | **"While you were away" recap** | Modern returning-user UX | §9 — 7+ in-game day trigger |
| 9 | **Mode picker upfront** | Roguelites + modern multi-mode games | §3.3 — Career + Roguelite as launch tiles |
| 10 | **Veteran skip with safety net** | Best-practice 2026 | §10 — micro-tooltips + reset button |

### 2.5 Our unique style

Where we differ from every competitor:

- **3-in-1 silent tier auto-mapping**: single experience question →
  UI tier + difficulty + recommended-club tier. No competitor maps a
  single question to all three simultaneously.
- **Anstoss inbox cast + 10 distinct sender voices on mobile**:
  Anstoss had this on PC; mobile competitors have flatter inbox.
- **Feed-card swipe semantics** (Gmail-inspired): right = complete /
  open; left = snooze with undo snackbar. Novel for the genre.
- **Soft-transition message** ending tutorial at week 4 ("You've got
  the basics; I'll only step in when something important comes up"):
  no competitor handles tutorial-to-narrative handover explicitly.
- **Mode picker upfront with both available day 0**: Top Eleven /
  OSM / FM Mobile lock modes; we trust user agency. Veterans head
  straight to Roguelite; new players default to Career.
- **Per-difficulty assistant intensity + user override toggle**: best
  of FM (manual help) + casual mobile (proactive coach).
- **Deterministic + offline-first**: onboarding works fully offline;
  PWA install prompt timed to first success (per D9), not session 1.

## 3. The 60-second FTUE

### 3.1 Flow overview

Target: from app launch to first meaningful tactical choice in
< 60 seconds; first match started in < 3 minutes.

```text
[Launch]
   ↓
┌──────────────────────────────────────────────────┐
│ STEP 1 — Experience Question (5-7s)              │
│ "Have you played a football manager game before?"│
│  • New to manager games                          │
│  • I've played a bit                             │
│  • I'm an FM / Anstoss veteran                   │
│                                                  │
│  Silently maps to (tier, difficulty):            │
│  Newbie  → Quick    + Easy                       │
│  Bit     → Standard + Normal                     │
│  Veteran → Expert   + Normal                     │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ STEP 2 — Mode Picker (5-10s)                     │
│ Both modes available from day 0.                 │
│                                                  │
│  ┌─────────────────────┐  ┌────────────────────┐ │
│  │ Manage a Club       │  │ Create a Club      │ │
│  │ Career              │  │ Challenge          │ │
│  │ Anstoss-style       │  │ Roguelite, perma-  │ │
│  │ sack-able manager   │  │ death, meta-       │ │
│  │ ★ Recommended new   │  │ progression        │ │
│  └─────────────────────┘  └────────────────────┘ │
│                                                  │
│  Veterans (from Q1) see Roguelite with no "new"  │
│  badge - equal weight.                           │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ STEP 3 — Club / Setup (15-25s)                   │
│ Career path:                                     │
│   • Country chips (3-5 locale-relevant)          │
│   • Recommended club big card per country        │
│   • "Start with this club" primary CTA           │
│   • [Advanced setup] link → full New Save wizard │
│                                                  │
│ Roguelite path:                                  │
│   • Starting region picker                       │
│   • Starting club tier (Tier 4 / Tier 5)         │
│   • Permadeath rules summary card                │
│   • "Begin run" primary CTA                      │
└──────────────────────────────────────────────────┘
   ↓
┌──────────────────────────────────────────────────┐
│ STEP 4 — Home Dashboard (auto, 5s)               │
│ Feed-card queue with single tutorial card:       │
│   "Your first match is in 3 days.                │
│    Let's choose your playstyle."                 │
│   [Choose Playstyle] (primary)                   │
│   [Skip, use default]                            │
└──────────────────────────────────────────────────┘
   ↓
[First tactical choice — 60s mark]
```

### 3.2 Step 1 — Experience question

Full-screen card on first launch:

```text
┌─────────────────────────────────────┐
│  Welcome to {{ProductName}}         │
│                                     │
│  Have you played a football         │
│  manager game before?               │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🆕 New to manager games      │  │
│  │  Guided tour + simpler UI     │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  🎮 I've played a bit         │  │
│  │  Balanced depth + tips        │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  ⚽ FM / Anstoss veteran      │  │
│  │  Full depth + skip tutorial   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

Card-based UI; tap one to advance (no Next button). 44 × 44 px touch
targets enforced. Each card 56 dp tall minimum.

Silent mapping (NOT shown to user):

| Selection | UI tier | Difficulty | Tutorial verbosity |
|---|---|---|---|
| Newbie | Quick | Easy | Full coach |
| Bit | Standard | Normal | Essential tips |
| Veteran | Expert | Normal | Skip tutorial (micro-tooltips only) |

User can change in Settings anytime. Veteran path triggers "Skip
tutorial" confirmation modal in step 2 (see §10).

### 3.3 Step 2 — Mode picker

Both Career and Create-a-Club Roguelite available from day 0 (per D5
Q&A locked decision).

```text
┌─────────────────────────────────────┐
│  Choose your game mode              │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ Manage a Club Career      ★ NEW │ │   ← "NEW" badge only for
│  │                                 │ │     Newbie + Bit users
│  │ Take over an existing club.     │ │
│  │ Get sacked if you fail. Build   │ │
│  │ a long-term legacy.             │ │
│  │                                 │ │
│  │ ✓ Long campaigns                │ │
│  │ ✓ Familiar manager fantasy      │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ Create a Club Challenge         │ │
│  │                                 │ │
│  │ Start a fictional club. Perma-  │ │
│  │ death rules. Earn long-term     │ │
│  │ perks for future runs.          │ │
│  │                                 │ │
│  │ ✓ Shorter focused runs          │ │
│  │ ✓ Meta-progression              │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Advanced setup →]                 │
└─────────────────────────────────────┘
```

"Advanced setup" link → opens full New Save wizard (§4).

### 3.4 Step 3a — Club picker (Career path)

```text
┌─────────────────────────────────────┐
│  ← Choose your club                 │
│                                     │
│  Country                            │
│  [🇩🇪 Germany●] [🇬🇧 England]        │
│  [🇪🇸 Spain]    [🇮🇹 Italy]          │
│  [More countries →]                 │
│                                     │
│  ★ Recommended for new managers     │
│  ┌─────────────────────────────────┐ │
│  │ [Crest] FC Brennsdorf           │ │   ← Procedural club from D2
│  │         Bundesliga Tier 2       │ │
│  │         Predicted finish: 8th   │ │
│  │         Modest budget, stable   │ │
│  │                                 │ │
│  │ [Start with this club]          │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Browse more clubs in Bundesliga]  │
│  [🎲 Surprise me]                   │
│  [⚙ Advanced setup]                 │
└─────────────────────────────────────┘
```

**Recommended club logic**:

- For Newbie: mid-table Tier-2 club, modest budget, stable finances,
  predicted top-half finish. Locale-matched country (DE default for
  DE users via browser `navigator.language`).
- For Bit: mid-table Tier-1 club in user's locale.
- For Veteran: mid-table Tier-1 club; "Surprise me" button gets more
  prominence; "Advanced setup" link bolded.

### 3.5 Step 3b — Roguelite path

Different "Choose your starting club" screen for Roguelite:

```text
┌─────────────────────────────────────┐
│  ← Begin your challenge             │
│                                     │
│  Starting region                    │
│  [🇩🇪 Germany●] [🇬🇧 England]        │
│  [More →]                           │
│                                     │
│  Starting tier                      │
│  [Tier 5 (Amateur)●] [Tier 4]       │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │ Permadeath rules                │ │
│  │ • Sacked? Run ends.             │ │
│  │ • Insolvency for 3 months?      │ │
│  │   Run ends.                     │ │
│  │ • Survive 3 seasons to unlock   │ │
│  │   meta-progression.             │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [Begin run]                        │
└─────────────────────────────────────┘
```

(Details in [[../50-Game-Design/mode-create-a-club-roguelite]]; this
flow is the FTUE entry point.)

### 3.6 Step 4 — First Home dashboard

User lands on Home dashboard with feed-cards (§7). On first ever
session, the top card is the tutorial trigger:

```text
┌─────────────────────────────────────┐
│  Today — Saturday, 12 Aug 2026      │
│                                     │
│  Welcome, Coach!                    │
│  ┌─────────────────────────────────┐ │
│  │ 📨 From Alex (Assistant Mgr)    │ │   ← First inbox message
│  │ Welcome - let's start with      │ │     auto-opens as feed card
│  │ your first XI                   │ │
│  │ [Open Squad & Pick XI]          │ │
│  └─────────────────────────────────┘ │
│                                     │
│  Next match                         │
│  ┌─────────────────────────────────┐ │
│  │ vs Borussia Schwarzwald (H)     │ │
│  │ Saturday 3 days                 │ │
│  │ [Choose Playstyle]              │ │
│  └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

The "Choose Playstyle" card opens a **simplified tactics screen**
with 3 big preset cards (Defensive & solid / Balanced / Attacking &
risky), not the full Tactics editor. User picks one → mark of the
first meaningful, domain-relevant choice → 60s milestone hit.

## 4. New Save wizard (Advanced setup path)

For users who tap "Advanced setup" from Step 2 or Step 3, open the
full wizard. Power-user opt-in; deliberate friction.

```text
Screen 1: World Setup
  • World size: Small / Medium / Large  (default: Medium)
  • Include lower divisions toggle
  • Fictional players only toggle (per ADR-0007 always on; can't
    disable at MVP)
  • Game start year (default 2026)

Screen 2: Country & Region
  • Multi-select primary country
  • Optional neighbouring leagues toggle
  • Locale-aware default selections

Screen 3: Club Selection
  • Filter by tier (1 / 2 / 3 / 4 / 5)
  • Filter by budget band
  • Filter by region
  • Random club button

Screen 4: Difficulty & Mode (optional)
  • Show only on Advanced
  • Difficulty: Easy / Normal / Hard / Sim (per D4)
  • Mode: Career / Roguelite (per existing mode GDDs)

Screen 5: Assistance preferences (optional)
  • UI tier: Quick / Standard / Expert (override from Q1)
  • Coaching intensity: Full / Standard / Minimal
  • Allow assistant to auto-handle minor tasks (Easy/Normal only)
```

Each screen has [Back] / [Next] / [Skip wizard, use defaults].

## 5. Inbox-as-narrative tutorial

### 5.1 Sender taxonomy (10 senders, 4 core tutorial drivers)

**Core tutorial cast** (drives onboarding):

| Sender | Role | Tutorial share | Tone |
|---|---|---:|---|
| **Assistant Manager** ("Alex" default) | Primary teacher / sidekick; match week loop, squad, training | ~50 % | Friendly, practical, addresses user as "boss" / "Chef" |
| **Chairman / Board** | Stakes + long-term goals; board confidence | ~15 % | Formal, demanding; uses "the board" plural |
| **Director of Football** | Transfers + contracts; delegation | ~20 % | Data-driven, professional, calm |
| **Head Scout** | Discovery + open-loop hooks; youth previews | ~10 % | Enthusiastic, attribute-specific |

**Supporting cast** (flavour + specific systems):

| Sender | Role |
|---|---|
| **Head of Youth Academy** | Youth pulls + long-term development |
| **Player Agent** | Contracts, player happiness, transfer pressure |
| **Journalists / Press Officer** | Press conferences, narrative pressure |
| **Sponsors** | Money, optional objectives |
| **Family / Personal Life** | Anstoss flavour; pacing suggestions ("take a day off") |
| **Anonymous Tips** | Mysterious hooks into hidden systems |

### 5.2 Message-type taxonomy + mix ratio

8 message types:

| Type | Purpose | Tutorial arc % | Steady-state % |
|---|---|---:|---:|
| Tutorial-explanatory | "Here's how X works" | 40-50 | 0 (only on new feature unlock) |
| Goal-setting | Club goals, short-term tasks | 15-20 | 25-30 |
| Reactive feedback (positive) | Performance feedback, morale hints | 10-15 | 15-20 |
| Reactive criticism | Gently pushes toward action | 10-15 | 15-20 |
| Open-loop hooks | "Scout report ready" → opens screen | 10 | 20-25 |
| Narrative flavour | Colour, worldbuilding | 5-10 | 20-25 |
| Decision prompts | Explicit choices with immediate action | 5-10 | 10-15 |
| Press conferences | Small dialogue branching with morale effects | 0 at MVP | 5-10 post-MVP |

### 5.3 12-message first-season tutorial arc (Career mode)

Concrete messages teaching all core systems over 4 in-game weeks. EN
+ DE subject + preview given for localisation reference. Full bodies
authored as part of E22 localization workflow.

#### Week 1 — Getting started & first match

**M1 — Day 1 (Assistant)**
- Subject EN: "Welcome, boss — let's start with your first XI"
- Subject DE: „Willkommen, Chef — Zeit für Ihre erste Startelf"
- Teaches: Squad screen, lineup selection
- CTA: [Open Squad & Pick XI]

**M2 — Day 1 (Chairman)**
- Subject EN: "Board expectations for this season"
- Subject DE: „Vorstandserwartungen für diese Saison"
- Teaches: Goals screen, board confidence
- CTA: [View Season Objectives]

**M3 — Pre-Match (Assistant)**
- Subject EN: "Tactics basics for today's match"
- Subject DE: „Taktik-Grundlagen für das heutige Spiel"
- Teaches: Tactics editor with 3 simplified style presets
- CTA: [Open Tactics]

**M4 — Post-Match (Assistant, reactive)**
- Subject EN: "About that first match…"
- Subject DE: „Über das erste Spiel…"
- Teaches: Match report basics; hints at training
- CTA: [View Match Report]

#### Week 2 — Training & rotation

**M5 — Early Week (Assistant)**
- Subject EN: "Training: keep them sharp, not shattered"
- Subject DE: „Training: Fit halten, nicht kaputt trainieren"
- Teaches: Training screen with presets (Fitness / Tactics / Youth)
- CTA: [Open Training Plan]

**M6 — Midweek (Assistant)**
- Subject EN: "Rotation time — avoid tired legs"
- Subject DE: „Zeit für Rotation — müde Beine vermeiden"
- Teaches: Fitness indicators, rotation, bench
- CTA: [Review Suggested XI]

**M7 — Post-Match (Reactive feedback variant)**
- Subject EN (rotated + win): "Good call on the lineup"
- Subject DE: „Gute Entscheidung bei der Aufstellung"
- (Alt variant if user ignored rotation + lost: "We looked tired out
  there.")
- Teaches: Reinforces rotation mechanic
- CTA: [View Fitness Overview]

#### Week 3 — Transfers & contracts

**M8 — Early Week (DoF)**
- Subject EN: "Transfer market: we need depth at {position}"
- Subject DE: „Transfermarkt: Wir brauchen mehr Tiefe auf {position}"
- Teaches: Transfers screen, shortlists
- CTA: [View Suggested Targets]

**M9 — Midweek (Player Agent, decision prompt)**
- Subject EN: "{playerName} expects a new contract"
- Subject DE: „{playerName} erwartet einen neuen Vertrag"
- Teaches: Contract negotiation UI; morale impact
- CTAs: [Negotiate Contract] / [Ask DoF to handle]

**M10 — Post-Match (Chairman, reactive)**
- Subject EN: "Board reaction to recent form"
- Subject DE: „Vorstandsreaktion auf die aktuelle Form"
- Teaches: Board confidence page
- CTA: [View Board Confidence]

#### Week 4 — Set pieces, youth & soft transition

**M11 — Pre-Match (Assistant, set pieces)**
- Subject EN: "Let's sort your set pieces"
- Subject DE: „Lassen Sie uns die Standards ordnen"
- Teaches: Set-piece routine selection + taker assignment
- CTA: [Open Set-Piece Setup]

**M12 — End of Week (Head Scout / Youth Head, soft transition)**
- Subject EN: "First youth report: a prospect worth watching"
- Subject DE: „Erster Jugendbericht: Ein interessanter Nachwuchsspieler"
- Teaches: Youth screen + promotion
- CTA: [View Youth Report]
- Embedded soft-transition footer: "You've got the basics. From now
  on, I'll only step in when something important comes up. You can
  enable more guidance anytime in Settings → Assistance."

Optional **flavour add-on** around Week 4 (Family voice):
- Subject EN: "You still live here, you know"
- Subject DE: „Du wohnst übrigens noch hier"
- Teaches: Time-skip / advance controls
- CTA: [Skip to Next Match]

### 5.4 Pacing rules per game-week

| Phase | Messages / week | Cap per session |
|---|---|---|
| Tutorial arc (weeks 1-4) | 4-6 | 3 (if multiple in one real session) |
| Rest of season 1 (weeks 5-38) | 3-4 | 4 |
| Season 2+ | 2-3 (user-tunable) | 4 |

**Returning-user catch-up** (per §9): if user hasn't played for
≥ 7 real days, compress missed messages into a single "While you
were away" digest card with 2-3 highlighted items + link to full
inbox.

### 5.5 Voice consistency tools

Per-sender voice cards (1-page reference per sender):

```text
SENDER: Assistant Manager (Alex)
Tone keywords: friendly, practical, supportive, informal
Address: "boss" / "Chef" / occasionally "gaffer"
Do:
  - Short paragraphs, bullet-like tips
  - Football jargon with implicit context
  - Gentle teasing on losses ("Not our finest defending")
  - Reference recent stats ("Their winger had 5 dribbles")
Don't:
  - Corporate speak
  - Formal greetings
  - Long unbroken paragraphs
Signature: "— Alex" or "Alex, Assistant Manager"
3 sample sentences:
  1. "Boss, I'd rest Schmidt. His condition dropped below 80%."
  2. "Good win today — that rotated XI did the job."
  3. "Their winger keeps finding space on our left. Worth a sub?"
```

Voice cards live in `packages/game-data/src/inbox/voice-cards/`;
referenced by translators (per E22 localization workflow).

### 5.6 Localisation strategy

Inbox is the heaviest text-content surface:

- **EN** as source language. **DE** as MVP second language (per D2
  locale strategy).
- **Templates** stored as structured JSON per message ID:
  ```json
  {
    "id": "tutorial.m1.welcome",
    "sender": "assistant",
    "subject_en": "Welcome, boss — let's start with your first XI",
    "subject_de": "Willkommen, Chef — Zeit für Ihre erste Startelf",
    "body_en": "...",
    "body_de": "...",
    "cta_primary": "openSquad",
    "tags": ["tutorial", "week-1", "match-prep"]
  }
  ```
- **Placeholders**: `{playerName}`, `{clubName}`, `{position}`,
  `{opponentName}`, `{competitionName}`, `{form}` (e.g. "WWDL"),
  `{leaguePosition}`, `{points}`, `{date}`.
- **Length budget**: DE typically +20-30 % vs EN; design subjects
  ≤ 40 EN / ≤ 60 DE characters. Body ≤ 80 words EN / ≤ 100 words DE.
- **MVP word count estimate**: ~80-120 templates × ~60 words = ~7-10k
  words per locale.

## 6. Assistant Manager character + UX

### 6.1 Character design

- **Name**: configurable; default "Alex" (gender-neutral, short,
  works in DE + EN). Localised default for other locales (e.g. "Felix"
  / "Sam" / "Jordan").
- **Portrait**: 3-5 portrait presets selectable in onboarding;
  "No portrait (text only)" option for accessibility / minimal-UI
  users.
- **Configurable post-creation**: Settings → Assistant lets user
  rename + change portrait anytime.

### 6.2 Voice channels

The Assistant Manager speaks across:

1. **Inbox**: narrative + tutorial + summary messages (§5).
2. **In-context tooltips / coach marks**: anchored to UI elements on
   first visit (§8).
3. **"Ask Assistant" button**: persistent sticky button on Home, Match,
   Tactics, Training, Transfers screens (§6.3).
4. **Match commentary hints**: occasional `[Assistant]`-tagged lines
   during match playback (per D3 Text & Stats / Canvas modes).

### 6.3 "Ask Assistant" sticky button

Persistent floating action button (FAB) on key screens. Tap opens a
bottom sheet:

```text
┌─────────────────────────────────────┐
│  ━━━━━ (bottom sheet handle)        │
│  Ask Alex (Assistant Manager)       │
├─────────────────────────────────────┤
│  Quick help                         │
│  • Explain this screen              │
│  • Suggested actions                │
│  • Do something for me  (Easy/Normal)│
├─────────────────────────────────────┤
│  Suggested questions:               │
│  ┌───────────────────────────────┐  │
│  │ ? How do I sub a player?      │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ ? What's a good formation     │  │
│  │   for chasing a goal?         │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  [Close]                            │
└─────────────────────────────────────┘
```

"Do something for me" availability:

- **Easy**: Available; assistant can auto-complete tactics setup,
  squad rotation, training plan with one tap.
- **Normal**: Available for low-impact tasks only (rotation, training
  presets); not for transfers or contracts.
- **Hard**: Hidden.
- **Sim**: Hidden.

### 6.4 Per-difficulty intensity scaling

| Difficulty | Assistant behaviour |
|---|---|
| **Easy** | **Proactive**. Auto-surface suggestions in feed cards ("Suggested lineup ready"). Coach marks on first visit + occasional reminder hints. Pre-fills Ask-Assistant with recommended actions. |
| **Normal** | **Suggestive**. No auto-complete; only suggestions ("Their winger is finding space"). Standard number of coach marks on new screens. |
| **Hard** | **Sparse**. Coach marks reduced to minimal essentials. Assistant rarely interrupts during matches. "Ask Assistant" still accessible; responses focus on analysis. |
| **Sim** | **Silent**. No in-match interventions. Post-match analysis only. "Ask Assistant" still works (user-pull only). |

Plus user override in Settings → Assistance:

- `Coaching intensity`: Full / Standard / Minimal (overrides
  difficulty default).
- `Allow assistant to auto-handle minor tasks`: checkbox with
  examples list. Only available on Easy / Normal.

### 6.5 Voice tone by difficulty

Same Assistant character, different verbosity + explicitness:

| Difficulty | Example sentence |
|---|---|
| Easy | "We're vulnerable on the left flank; I recommend bringing on a fresh left-back. Tap here to do it now." |
| Normal | "Their winger is finding space on our left. A defensive sub there could help." |
| Hard | "Left side overloaded. Consider adjustment." |
| Sim | (post-match only) "Post-match note: 64 % of conceded chances came from our left third." |

## 7. Feed-card daily action queue (Home dashboard primary UI)

### 7.1 Concept

Home dashboard = daily feed of 3-5 priority action cards each in-game
day. Replaces sprawling menu navigation with task-focused queue.
Mental model = Gmail / Inbox Zero.

### 7.2 Card design

Mobile-first card layout (~360-430 dp width):

```text
┌─────────────────────────────────────┐
│ Set lineup for Saturday's match ●!  │  ← Title + urgency tag
│                                     │
│ Pick your starting XI and bench     │  ← What + Why
│ for the next league match.          │
│                                     │
│ Affects: Match performance, morale  │  ← Impact line
│                                     │
│ [Set lineup]            Later  ⋮    │  ← Primary CTA + secondary
└─────────────────────────────────────┘
```

Components:

- **Title** (18 sp, semi-bold, 1-2 lines)
- **Urgency tag** (right-aligned chip): "Match Day ●!" (high) / "This
  Week" (medium) / "Optional" (low). Colour + icon (redundant
  encoding for accessibility).
- **Summary** (1-2 lines, plain language)
- **Impact line** (smaller text, italicised)
- **Primary button** (filled, full-width or wide; label = outcome
  not generic "OK")
- **Secondary text action** (right-aligned: "Later" / "Snooze")
- **Overflow menu** (⋮): View details / Pin / Mute this type /
  Dismiss

Touch targets: ≥ 56 dp card height; primary button ≥ 48 dp tall;
overflow icon 44 × 44 px hit area.

### 7.3 Swipe semantics

Email-inspired:

- **Swipe right** → Complete (if auto-completable, e.g. "Approve
  weekly training plan with assistant's suggestion") OR Open primary
  screen.
- **Swipe left** → Snooze with contextual default (e.g. "Before
  Saturday's match" for match-related; "3 days before deadline" for
  contracts). Undo snackbar on swipe completion.

Swipe actions duplicated as visible buttons (accessibility
requirement).

### 7.4 Prioritisation algorithm

Per in-game day, score each pending task:

```ts
priority =
    timePressureScore        // 5-40 based on deadline proximity
  + impactTypeScore           // 10-30 based on category
  + playerBehaviourAdjust     // -10 to +10 based on user's history
                              // with this task type
```

Sort by priority descending; pick top 5.

#### Time pressure

| Condition | Score |
|---|---|
| Match in < 24 in-game hours | +40 |
| Expiring contract / deadline < 3 days | +30 |
| Match in 1-3 days | +25 |
| Match in 4-7 days | +15 |
| Long-term items (youth dev, sponsorship) | +5 to +10 |

#### Impact type

| Type | Score |
|---|---|
| Match performance / squad selection | +30 |
| Board requirements (finances, objectives) | +25 |
| Player morale / contracts | +20 |
| Transfers (in-window) | +25 |
| Background systems (staff, facilities) | +10 |
| Sponsors / press / flavour | +5 |

#### Player behaviour adjustment

| Pattern | Adjustment |
|---|---|
| User completes this task type > 80 % of the time | +10 |
| User dismisses this task type > 60 % of the time | -10 |
| First-time-ever task type | +5 (so it shows) |

#### Guardrails

- Always at least 1 match-related card if match within 3 days.
- At most 2 "admin" cards (finances, board, sponsorship) in top 5.
- At least 1 "Easy win" card per day on Easy difficulty (rotation
  approve, training approve) to maintain feel of progress.

### 7.5 Per-difficulty queue behaviour

| Difficulty | Queue behaviour |
|---|---|
| Easy | Assistant auto-filters low-impact ("I'll handle minor press conferences"). Assistant auto-completes low-impact with one-tap confirmation. Higher show-recommended-action ratio. |
| Normal | Balanced 3-5 cards; no auto-complete. |
| Hard | More cards (4-6); fewer "I prepared this for you" helpers. Hidden-consequence items shown (e.g. "Youth contract expires soon - no reminder closer"). |
| Sim | Only strategic decisions in queue; micro-tasks auto-handled by assistant with inbox summary. |

### 7.6 Card categories at MVP

| Category | Example titles |
|---|---|
| Match prep | "Set lineup for {opponent}", "Choose playstyle for {opponent}", "Confirm set-piece takers" |
| Squad management | "Approve weekly training plan", "Review fatigued players", "Promote youth player {name}" |
| Transfers | "Review {N} new scout shortlist", "Respond to {playerName}'s contract", "Bid update: {playerName}" |
| Board / press | "Board concern: {issue}", "Press conference - {opponent} preview", "Sponsor request" |
| Tutorial / hints | Inbox-driven; only during tutorial arc weeks 1-4 |
| Returning user | "While you were away" recap (§9) |

## 8. Tutorial overlay patterns

### 8.1 Pattern hierarchy

Used sparingly — modern mobile games favour minimal blocking overlays
+ contextual micro-tips.

| Pattern | Use case | Frequency |
|---|---|---|
| **Spotlight overlay** | Absolutely critical FTUE actions only | 3-4 max total over whole game |
| **Coach marks** | First-visit guidance on new screens | Max 2-3 per screen |
| **Hint chips** | Optional depth suggestions | Subtle; auto-hide after 2 dismissals |
| **Modal full-screen explanation** | Complex concepts (tactics basics, transfers basics) | 1-2 per major system; re-accessible via Help |

### 8.2 Coach mark pattern

Primary teaching mechanism. Speech bubble with Assistant avatar +
arrow pointing to control.

```text
                ┌─────────────────────┐
                │ 🧑 Alex             │
                │                     │
                │ This is your        │
                │ formation board.    │
                │ Drag players to     │
                │ change positions.   │
                │                     │
                │ [Got it]  [Tell me  │
                │           more]    │
                └─────────────────────┘
                       ▼
              ┌─────────────┐
              │   PITCH     │
              │  (highlighted)│
              └─────────────┘
```

Rules:

- Max 2-3 coach marks per screen, shown sequentially.
- Aggregated: NOT all at once.
- Triggered first time on screen OR when feature is newly unlocked.
- "Got it" dismisses; "Tell me more" expands to scrollable mini-guide.
- "Skip tips for this screen" available at top of sequence.
- Focus moves into coach mark; ESC closes (keyboard accessibility).

### 8.3 Hint chip pattern

Non-blocking suggestions; small pill at bottom of screen:

```text
┌─────────────────────────────────────┐
│  (Screen content)                   │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ 💡 Hint: Ask Alex for a recommended │
│    lineup.            [Try]   ×     │
└─────────────────────────────────────┘
```

Tap expands to mini coach mark. Auto-hide after action OR after user
dismisses same hint type twice.

### 8.4 Tutorial storage (IndexedDB)

```ts
// Schema in onboarding-state object store
interface OnboardingState {
  tutorial_seen: {
    [screenId: string]: boolean         // 'home_feed', 'tactics_basic', ...
  }
  tutorial_seen_by_difficulty: {
    [screenId: string]: DifficultyTier  // 'tactics_advanced_easy', ...
  }
  experience_level: 'newbie' | 'bit' | 'veteran'
  coaching_intensity: 'full' | 'standard' | 'minimal'
  allow_auto_handle: boolean
  arc_progress: {
    current_message_id: string
    completed_messages: string[]
    arc_completed_at: string | null      // ISO timestamp; non-null = arc done
  }
}
```

Stored under `game_settings` object store, keyed by `user_id` (or
single-user save key for offline). Local-first; no server sync at
MVP.

## 9. Returning-user recap

For users opening the app after ≥ 7 in-game days OR ≥ 14 real days
of absence:

```text
┌─────────────────────────────────────┐
│  While you were away…               │
│                                     │
│  Your club played 2 matches:        │
│  • Win 2-1 vs Mainfeld              │
│  • Loss 0-1 vs Sturm Hochburg       │
│                                     │
│  3 players' contracts now in final  │
│  year                               │
│                                     │
│  Board updated objectives:          │
│  "Aim for top 8 finish"             │
│                                     │
│  [Review key events]    Skip  ⋮     │
└─────────────────────────────────────┘
```

"Review key events" opens chronological timeline:

```text
Wed 15 Aug — Win 2-1 vs Mainfeld
  Scorers: J. Smith 12', M. Rodriguez 67'
  [View match report]

Fri 17 Aug — Schmidt's contract enters final 12 months
  Player wants new deal
  [Negotiate now]

Sat 19 Aug — Loss 0-1 vs Sturm Hochburg
  Conceded from set piece
  [View match report]

Sun 20 Aug — Board confidence: stable (62/100)
  [View board view]
```

Each event links to its detail screen. At end: "Resume where you
left off" CTA using last-known navigation state from `IndexedDB`.

**Soft re-onboarding** for very-long-absent users (≥ 30 real days):
hint chip after recap: "Need a refresher? Tactics quick-tour: 2 min.
[Take tour] [Not now]". Re-opens the simplified tactics tutorial
modal.

## 10. Veteran skip + safety net

Veteran path from experience question:

1. Modal confirmation: "Skip tutorial? You can re-enable tips later."
   - [Give me the tour (recommended)]
   - [Skip tutorial, I'll find my way]

If user skips:

- Full-screen overlays + coach marks suppressed.
- Micro-tooltips (small "?" chips on key UI elements) still appear
  on first visit; tap to expand briefly. Max 2-3 per screen.
- Inbox tutorial arc **still runs** but with shorter copy + skip-
  ahead links on each message.
- "Ask Assistant" button still present.

Safety net (re-enable guidance):

- Settings → Assistance:
  - "Tutorial & tips" toggle: Off / Essential only / Full coach mode
  - "Reset first-time tips" button: confirmation modal → re-enables
    coach marks on next visit to each screen
- Auto-detection: if user shows signs of struggle (lost 5+ matches in
  a row on Easy; ignored 10+ feed-card primary CTAs in a row),
  Assistant sends optional inbox message:
  - "Tough run? Want more guidance? [Turn on coaching] [No thanks]"

## 11. Achievement / progression celebration

Subtle, non-patronising milestones. Each has an overflow option
"Don't show this type again".

| Milestone | Treatment |
|---|---|
| First match played | None (no celebration; just match report) |
| First match won | Banner at top of feed: "First win under your management". Tiny confetti (disabled with reduced-motion). [View match report] |
| First transfer signed | Player reveal card with crest + 3 key attributes + "Welcome to {club}". "Add to starting XI now?" follow-up. |
| First cup victory | Dedicated screen with static trophy art (2-3s auto-play; tap to continue). Season performance snapshot. Forward-looking choice: "Board expectations for next season: Consolidate / Push for top half / Go for promotion" |
| First promotion | Same treatment as cup victory; next-season expectations escalated. |
| First save / autosave | Assistant inbox message (one-time): "I'll automatically save your progress after matches and important decisions." |

## 12. PWA install prompt timing

Per D9 + this gap:

### 12.1 Trigger conditions (all must be true)

- `sessions >= 3`
- At least 1 clear success:
  - First match win OR
  - First transfer completed OR
  - First season objective ticked
- `total_playtime > 20 minutes` cumulative OR `current_session > 2 minutes`

### 12.2 Placement

After closing a positive-result screen (e.g. post-match win summary),
NOT on session start. Bottom sheet:

```text
┌─────────────────────────────────────┐
│  Playing a lot?                     │
│  Add {ProductName} to your home     │
│  screen for faster offline access.  │
│                                     │
│  [Add to home screen]               │
│  [Not now]                          │
└─────────────────────────────────────┘
```

### 12.3 Platform handling

**Chrome / Edge Android**:

- Use `beforeinstallprompt` event captured on app start.
- Call `prompt()` from the bottom-sheet "Add to home screen" button.
- If browser declines (already installed / blocked), show fallback
  instruction.

**iOS Safari**:

- No native PWA install prompt API.
- Show 3-step custom walkthrough:
  1. "Tap the Share button (↑)"
  2. "Scroll down and tap 'Add to Home Screen'"
  3. "Tap 'Add'"
- Each step illustrated with annotated screenshot.

### 12.4 Snooze policy

- Explicit dismiss: snooze 7 days OR 5 sessions.
- Ignore (tap outside): snooze 3 sessions.
- Maximum 5 lifetime prompts.

## 13. Accessibility paths (WCAG 2.2 AA + BITV 2.0)

### 13.1 Core principles

- **No critical info only in overlays.** Every tutorial step has DOM
  equivalent in Help → Tutorials.
- **Everything reachable** via screen reader + keyboard / switch
  control.
- **Reduced-motion respected** via OS setting + in-game toggle.

### 13.2 Onboarding flow accessibility

Onboarding screens (§3) use linear semantic pages, not modal-only:

- Each step is a route (`/onboarding/experience`, `/onboarding/mode`,
  `/onboarding/club`) with `<h1>` per step.
- Form-like controls (radio cards for experience, mode tiles).
- `aria-live="polite"` regions for dynamic guidance.

### 13.3 Coach mark accessibility

- Focus moves into coach mark on appear; trapped until dismissed.
- Skip-tutorial action reachable via Tab key (first focusable element).
- Coach mark text exposed as `<dialog>` or `role="dialog"` with
  `aria-labelledby` + `aria-describedby`.
- Auto-dismiss timers disabled — coach marks persist until user
  action (WCAG 2.2 timing-independent rule).

### 13.4 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Plus in-game toggle in Settings → Accessibility: "Limit animations
(matches OS setting)".

### 13.5 Colour-blind support

- Redundant encodings everywhere:
  - Urgency tags: colour + icon + text label.
  - Tactic arrows: colour + line pattern (solid / dashed / dotted) +
    text label on tap.
  - Role/duty badges: colour + abbreviation + role-family icon.
- WCAG 2.2 AA contrast: 4.5:1 body text; 3:1 large text and UI
  elements.

### 13.6 Read-aloud for inbox

Each inbox message has a speaker icon "Read aloud" button. Uses
Web Speech API (`SpeechSynthesisUtterance`) or native TTS where
available.

- User control: play / pause / stop.
- Highlights sentence being read.
- Auto-pauses on app background.
- NOT auto-triggered (`aria-live` not used for long bodies — user
  initiates).

### 13.7 One-handed mode (halftime panic)

Halftime modal (§7 from D3) uses bottom-aligned primary actions in
thumb zone:

```text
┌─────────────────────────────────────┐
│  Halftime — 1-1                     │
│  Possession 53%   xG: 0.8 / 0.7     │
│                                     │
│      [Match content above]          │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  [Make Substitution]    ← Thumb zone│
│  [Adjust Mentality]                 │
│  [Press Higher / Sit Deeper]        │
│  [Open Full Editor]                 │
└─────────────────────────────────────┘
```

### 13.8 Voice-control-friendly labels

For OS-level voice control (iOS / Android):

- Every button has visible text label + icon.
- No icon-only buttons for critical actions.
- Disambiguating context for repeated labels: "Edit lineup" not just
  "Edit" when multiple Edits exist on the same screen.

## 14. Empty states + autosave UX

### 14.1 Autosave strategy

Autosave on:

- Completion of any match.
- End of in-game day (when user taps "Continue" or day tick).
- Critical operations: confirmed transfers / contract signings /
  major financial decisions.
- Local-first to IndexedDB (per D9 + ADR-0005); periodic sync to
  server when online (post-MVP).

### 14.2 Save signalling

Subtle, non-intrusive:

- Toast: "Game saved" with small icon, fades after ~2s. Respects
  reduced motion (fade, not bounce/slide).
- Persistent indicator in Settings → Account: "Last autosave: 2 min
  ago".
- Offline: "Saving locally — will sync when online" (one-time per
  session, not per save).

First autosave triggers single Assistant inbox message:

> "I'll automatically save your progress after matches and important
> decisions. You can leave anytime without losing your progress."

## 15. Onboarding-state IndexedDB schema

```ts
// Object store: onboarding_state
// Keyed by save_id (1 row per save)
interface OnboardingState {
  save_id: string
  experience_level: 'newbie' | 'bit' | 'veteran'
  initial_tier: 'quick' | 'standard' | 'expert'
  initial_difficulty: 'easy' | 'normal' | 'hard' | 'sim'
  initial_mode: 'career' | 'roguelite'
  ftue_completed_at: string | null              // ISO timestamp
  tutorial_arc_status: {
    current_message_id: string | null
    completed_message_ids: string[]
    arc_completed_at: string | null
    soft_transition_shown: boolean
  }
  screen_tips_seen: Record<string, boolean>     // 'tactics_basic' → true
  pwa_install: {
    prompt_eligible_at: string | null
    last_prompt_at: string | null
    prompt_count: number                        // max 5
    dismissed_until: string | null              // ISO timestamp
    installed: boolean
  }
  assistance: {
    coaching_intensity: 'full' | 'standard' | 'minimal'
    auto_handle_minor_tasks: boolean
    assistant_name: string                      // 'Alex' default
    assistant_portrait_id: 0 | 1 | 2 | 3 | 4 | -1  // -1 = none
  }
  recap_state: {
    last_session_end_at: string                 // ISO timestamp
    last_in_game_date_at_exit: string
    recap_shown_for_last_session: boolean
  }
  celebrations_shown: Record<string, boolean>   // 'first_win' → true
}
```

All state local-first; backed up in save file per ADR-0005.

## 16. Performance budget

Per D9 (locked):

| Component | Budget |
|---|---|
| Onboarding flow JS bundle | ≤ 30 KB gzipped (lazy-loaded; user only loads it on first session) |
| Inbox tutorial copy (DE + EN) | ~50-80 KB JSON per locale |
| Voice cards / sender metadata | ~5 KB JSON |
| Coach mark module | ≤ 8 KB gzipped (shadcn `Sheet` + custom positioning) |
| Feed-card module | ≤ 15 KB gzipped (React) |

Total onboarding-related bundle: ~110-150 KB gzipped lazy-loaded;
within D9's per-route lazy ≤ 200 KB budget.

Render budgets:

- FTUE step render: ≤ 5 ms per screen.
- Feed-card list render: ≤ 8 ms for 5 cards (virtualised if > 10).
- Coach mark open / close: ≤ 5 ms.
- Inbox message detail open: ≤ 5 ms.

All well within D9's frame budget (p95 main-thread ≤ 12 ms).

## 17. Open follow-ups

- **A8 ADR-0008 Mobile-first UI**: this note is the binding reference
  for onboarding UX patterns; A8 should incorporate the feed-card +
  coach mark + halftime modal patterns.
- **D7 Mobile UX + IA + accessibility**: this note's accessibility
  patterns feed D7's WCAG audit + route inventory.
- **D15 Narrative event content & authoring pipeline**: tutorial arc
  + sender voice cards + inbox templates are the seed content; D15
  defines the full authoring + localisation pipeline.
- **D10 i18n + copy tone**: tutorial arc copy needs full DE
  translation per E22 localization workflow.
- **E22 Localization workflow**: 80-120 inbox templates × DE + EN =
  ~14-20k words for MVP.
- **K1 Player onboarding docs**: external help-centre content
  referenced from inbox CTAs and Settings → Help.
- **K3 Tutorial scripts**: full body copy for the 12-message arc +
  reactive variants + supporting cast messages.

## 18. Sources

- Perplexity Sonar research, 2026-05-17 (gap D5): FTUE patterns 2026
  - 60-second start; mobile game onboarding best practices; D1/D7/D30
  retention benchmarks; step drop-off curves; PWA install prompt
  timing per platform; competitor onboarding comparison across FM /
  FM Mobile / Top Eleven / OSM / Hattrick / Anstoss / SM24 / EA FC /
  PES.
- Perplexity Sonar research, 2026-05-17 (gap D5): inbox-as-narrative
  tutorial design - Anstoss + Club Boss pattern; 10-sender taxonomy;
  message-type mix ratio (tutorial vs ongoing play); 12-message
  first-season arc with EN + DE subjects; voice consistency tools;
  pacing rules; localisation strategy; tutorial fatigue avoidance.
- Perplexity Sonar research, 2026-05-17 (gap D5): feed-card daily
  action queue UX; Assistant Manager character + per-difficulty
  intensity scaling; tutorial overlay micro-patterns (spotlight /
  coach mark / hint chip / modal); returning-user "While you were
  away" recap; accessibility paths (WCAG 2.2 AA / BITV 2.0; reduced-
  motion; colour-blind; screen reader; one-handed mode; voice
  control); achievement / progression celebration patterns; autosave
  UX.
- Locked context: [[performance-budgets]] (D9 UI tiers + touch
  targets + PWA prompt budget), [[ai-manager-behaviour]] (D4
  difficulty modes + AI archetypes), [[tactics-and-formations]] (D3
  per-tier tactics exposure), [[data-generators]] (D2 world-size +
  attribute schema), [[club-boss-analysis]] + [[anstoss-series-deep-dive]]
  (Wave 1 inbox-as-narrative references).
- D5 Q&A with Nico (2026-05-17): 6 of 8 recommendations accepted
  as-is; FTUE 60s flow refined to single-question PLUS visible
  Advanced-setup escape hatch; mode picker promoted to upfront
  (both Career + Roguelite available day 0 as launch tiles).
