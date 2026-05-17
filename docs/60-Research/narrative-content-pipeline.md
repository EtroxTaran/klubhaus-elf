---
title: Narrative Content & Authoring Pipeline — Events, Story Arcs, Voice, Press, Newspaper
status: current
binding: true
tags: [research, narrative, authoring, i18n, icu, events, story-arcs, voice, press-conference, newspaper]
created: 2026-05-17
updated: 2026-05-17
type: research
related: [[onboarding-strategy]], [[late-game-systems]], [[ai-manager-behaviour]], [[data-generators]], [[determinism-and-replay]], [[performance-budgets]], [[../10-Architecture/09-Decisions/ADR-0006-i18n]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]], [[club-boss-analysis]], [[anstoss-series-deep-dive]]
---

# Narrative Content & Authoring Pipeline — Events, Story Arcs, Voice, Press, Newspaper

> Gap D15 of [[wave-3-gap-analysis]]. Locks the narrative authoring
> pipeline for an offline-first PWA football manager: Markdown +
> frontmatter source → compiled locale-split JSON catalogues + typed
> TS message IDs; FormatJS / `intl-messageformat` for ICU; ~50
> event families across 10 groups; 6 story arc state machines;
> 5-tone press conferences; auto-generated Anstoss-style newspaper;
> multi-layer voice consistency with per-sender cards + per-AI-
> archetype reactions + CI lint rules; Anstoss-style personal life
> events layer toggleable; build-time LLM assistance (never
> runtime); deterministic seeded variant selection. Provides the
> content authoring + i18n pipeline for D5 onboarding inbox + D6
> newspaper archive + D4 AI manager reactions + all in-game text
> beyond UI labels.

## 1. Context and inputs

This note completes the narrative content authoring pipeline on
top of locked foundations:

- **D5 Onboarding Strategy** ([[onboarding-strategy]]): locked the
  **10-sender inbox cast** (Assistant Manager "Alex" + Chairman +
  DoF + Head Scout + Head of Youth + Player Agent + Journalist +
  Sponsors + Family + Anonymous Tips) + **12-message tutorial arc
  subjects** + **voice cards in `packages/game-data/src/inbox/voice-
  cards/`**. D15 provides the authoring pipeline + full body copy
  + non-tutorial template families.
- **D6 Late-Game Systems** ([[late-game-systems]]): locked **Anstoss
  newspaper archive** (per-season + decade retrospectives) + 6
  owner archetype takeover narratives + bankruptcy + national team
  tournament dialogues + manager career retrospective. D15 specifies
  the authoring + generation logic.
- **D4 AI Manager Behaviour** ([[ai-manager-behaviour]]): locked the
  **10 AI manager archetypes** (Park-the-Bus Pragmatist / Counter-
  Attacking Reactive / High-Pressing Aggressor / Possession Maestro
  / Youth Developer / Galáctico Collector / Moneyball Director /
  Tinkerman / Conservative Stabilizer / Chaos Motivator). D15 maps
  archetype → reaction tone patterns across event families.
- **D8 Determinism + Replay** ([[determinism-and-replay]]): same
  trigger + same seed → same content output. No runtime LLMs / no
  async fetching. Variant selection via seeded hash.
- **D2 Data Generators** ([[data-generators]]): all names fictional
  per ADR-0007; placeholders use `{playerName}` / `{clubName}` /
  `{position}` / `{competitionName}` etc. Same RNG-streams
  generator hierarchy extended for narrative seeding.
- **D9 Performance Budgets** ([[performance-budgets]]): per-locale
  JSON ~50-80 KB target; lazy-load per route. Bundle ~30-50 KB
  gzipped for the narrative engine + formatter.
- **ADR-0006 i18n** (still draft): DE source + EN MVP; Tier-2 locales
  (Nordic / Eastern Europe / Hispanic LATAM / Turkey / Asia / Arabic
  / Africa) post-MVP.
- **ADR-0007 Naming Schema**: all names fictional + IP-clean.

This note adds: full authoring pipeline (Markdown source → JSON
catalogs + TS types), ICU MessageFormat patterns, ~50 event family
taxonomy across 10 groups, 6 story arc state machines, 5-tone press
conferences with cumulative effects, newspaper generation algorithm
(weekly / monthly / season / decade), multi-layer voice consistency
system with CI lint rules, personal-life events layer, build-time-
only LLM assistance, writer workflow + translator handoff,
deterministic seeded variant selection, IndexedDB schemas for active
story arcs.

## 2. Comparative analysis

### 2.1 Comparison table

| Game | Narrative engine | Authoring format | i18n | Strength | Weakness |
|---|---|---|---|---|---|
| **FM PC** (FM23+ story engine) | Tagged news items + chained narratives + state-driven variants | Internal DB tables (opaque) | Mature multilingual | Industry-deep content | Content bloat; opaque to mods |
| **FM Mobile** | Lighter FM | Simpler internal | Limited | Mobile-adapted | Less depth |
| **Anstoss 3 Zeitung** | Template-based with stat slots ("biggest win" / "surprise team" / "financial chaos") | German-only proprietary | German source-only | **Iconic voice + Zeitung gold standard** | Can't reverse-engineer |
| **Club Boss** | Inbox-driven storylets per sender | Internal | Limited | Modern mobile reference | Generic narrative |
| **EA SPORTS FC Career** | "Manager Stories" + cinematic cutscenes | EA proprietary | Full multilingual | Polished | Over-tutorialised; loses player agency |
| **80 Days / inkle** | Ink branching narrative DSL | Ink files | Custom workflow | **Gold-standard authored branching narrative** | Custom runtime |
| **Failbetter Games** (Fallen London, Sunless Sea) | **Storylet model with quality gates** | Proprietary content engine | Strong | **Gold-standard branching narrative reactivity** | Custom runtime |
| **Disco Elysium** | Dialogue tree with skill checks | Internal scripting | Excellent multilingual | **Voice consistency master class** | Massive scope |
| **NBA 2K / MLB The Show career** | Tagged events + tone-based dialogue + cutscenes | Internal | Multilingual | Sports-game career mode benchmark | Cinematic-heavy |

### 2.2 Our positioning

We combine **FM's tagged event system + Anstoss's Zeitung templating
+ Club Boss's inbox cast + Failbetter's storylet quality-gate model
+ Disco Elysium-level voice consistency + Ink-style state-machine
arcs for special decisions**, all on offline-first PWA tech stack
with deterministic output.

### 2.3 Techniques adopted

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Tagged event-family system** | FM "story engine" FM23+ | §5 — ~50 stable IDs across 10 groups |
| 2 | **Template-based newspaper with stat slots** | Anstoss 3 Zeitung | §9 — auto-generated weekly + monthly + season + decade |
| 3 | **Cast of senders (Assistant + Chairman + DoF + ...)** | Club Boss inbox | D5 locked; D15 expands |
| 4 | **Storylet model with quality gates** | Failbetter Games | §6 — context flags + variant selection |
| 5 | **Authored branching scenes for special decisions** | Ink (80 Days) | §7 — story arcs as state machines (not whole-game DSL) |
| 6 | **Voice consistency master class** | Disco Elysium | §10 — per-sender voice cards + lint rules |
| 7 | **Press conference tone choices with effects** | FM + NBA 2K career | §8 — 5 tones × small per-question effects |
| 8 | **Per-AI-archetype reaction patterns** | FM hidden personality | §10.3 — 10 archetypes × event-family tone weights |
| 9 | **ICU MessageFormat (industry standard)** | Modern i18n best practice | §4 — FormatJS / `intl-messageformat` |
| 10 | **Markdown + frontmatter authoring** | Modern dev docs + SSGs | §3 — writer-friendly + Git-versioned |
| 11 | **Compiled-catalog runtime** | Lingui / FormatJS extraction | §4.5 — typed TS message IDs at build |
| 12 | **Deterministic seeded variant selection** | Roguelikes + procedural narrative | §6.4 — `hash(eventId + seed) mod variants` |

### 2.4 Our unique style

Where we differ from every competitor:

- **Deterministic + offline-first narrative pipeline**: same world
  seed + same event trigger → byte-identical content output. FM,
  Anstoss, EA FC all have runtime variation. Enables global challenge
  seasons + replay-stable narrative analysis per D8.
- **Voice-card linting in CI**: explicit ESLint-style rules
  ("Chairman never uses contractions"); no competitor lints
  narrative voice consistency in CI.
- **Per-AI-archetype reaction patterns mapped from D4**: 10
  archetypes × ~50 event families × 3-7 tones = ~1500 reaction-
  context slots; FM implicit, we make explicit + tuneable.
- **Anstoss-style personal life events as toggleable flavour layer**:
  most competitors hardcode this or omit; we make it on/reduced/off-
  toggleable in Settings.
- **Storylet quality-gate model adapted from Failbetter to football**:
  state-based narrative reactivity in a manager game is novel.
- **Markdown + frontmatter + Git workflow for 1-3 person indie team**:
  most competitors use proprietary tools; we ship a writer-friendly
  pipeline that scales to volunteer translators post-MVP.
- **Bundle determinism**: compiled catalogs + ICU + typed catalogues
  ensure same DE+EN bundle hash for same content version →
  cache-friendly + PWA-friendly per D9.
- **LLM build-time only, never runtime**: assistant for variant
  drafts + tone drift detection in CI; final output always human-
  reviewed. Preserves D8 determinism.

## 3. Authoring format — Markdown + frontmatter

### 3.1 Source of truth

`packages/game-content/src/**/*.md` — one Markdown file per
template (or grouped tightly-related templates).

```text
packages/game-content/src/
  inbox/
    tutorial/
      m01-welcome.md
      m02-board-expectations.md
      ...
    transfer-saga/
      bid-received.md
      negotiation-stalled.md
      ...
    board/
      sacking-warning.md
      ...
  newspaper/
    weekly/
      big-win.md
      comeback.md
      lucky-win.md
      ...
    season-end/
      champions.md
      relegated.md
      ...
  press-conference/
    pre-match/
      vs-rival.md
      vs-underdog.md
      ...
    post-match/
      after-win.md
      after-loss.md
      ...
  personal-life/
    family-complaint.md
    burnout-warning.md
    ...
  voice-cards/                   # per-sender style guides
    assistant-manager.md
    chairman.md
    director-of-football.md
    head-scout.md
    head-of-youth.md
    player-agent.md
    journalist.md
    sponsor.md
    family.md
    anonymous-tip.md
```

### 3.2 File structure example

```md
---
id: inbox.transfer-saga.bid-received
kind: inbox
sender: director-of-football
voice: formal-analytical
arc: transfer-saga
arc_beat: 2
event_family: SQUAD_TRANSFER_BID_RECEIVED
priority: HIGH
tags: [transfer, bid, decision]
locales: [en, de]
context_flags:
  required: [transfer_window_open]
  disallowed: [admin_state]
variants:
  - id: calm
    tone: formal
    weight: 1.0
  - id: urgent
    tone: pressured
    weight: 0.6
    when: { window_days_remaining: { lt: 7 } }
placeholders:
  - playerName: string
  - bidValue: integer
  - bidderClub: string
  - playerWage: integer
cta:
  primary:
    label: "Negotiate Contract"
    action: openTransferNegotiationScreen
  secondary:
    label: "Reject Bid"
    action: rejectBid
  tertiary:
    label: "Ask DoF to handle"
    action: delegateToDoF
---

# en

## Subject

{bidderClub} have made a {bidValue, number, ::currency/EUR} bid for {playerName}

## Body (calm variant)

{bidderClub} have submitted a formal offer for {playerName}: **{bidValue, number, ::currency/EUR}**.

{playerName}'s current wage is {playerWage, number, ::currency/EUR}/week; the bid is {bidValue, plural, =0 {below} other {within the acceptable range for a player of his profile}}.

How would you like to respond?

## Body (urgent variant)

The transfer window closes in {window_days_remaining} days. {bidderClub} have made their move on {playerName}: **{bidValue, number, ::currency/EUR}**.

Decision needed today, boss.

# de

## Subject

{bidderClub} hat ein Angebot über {bidValue, number, ::currency/EUR} für {playerName} abgegeben

## Body (calm variant)

{bidderClub} haben ein offizielles Angebot für {playerName} eingereicht: **{bidValue, number, ::currency/EUR}**.

{playerName}s aktuelles Wochengehalt liegt bei {playerWage, number, ::currency/EUR}; das Angebot ist {bidValue, plural, =0 {unter} other {im akzeptablen Bereich für einen Spieler seines Profils}}.

Wie möchten Sie reagieren?

## Body (urgent variant)

Das Transferfenster schließt in {window_days_remaining} Tagen. {bidderClub} hat sein Angebot für {playerName} unterbreitet: **{bidValue, number, ::currency/EUR}**.

Entscheidung heute, Chef.
```

### 3.3 Why Markdown + frontmatter

Per D15 Q&A:

- **Writer-friendly**: narrative writers can edit text without
  touching code; preview in any Markdown editor.
- **Git-reviewable**: PRs show clean diffs.
- **Type-safe**: frontmatter validated against TS schema at build.
- **Metadata-rich**: frontmatter holds sender, voice, arc, event
  family, priority, context flags, placeholders, CTAs — without
  polluting the body text.
- **Localisable**: per-locale sections within one file keep
  translations adjacent for review.
- **ICU-compatible**: body text uses ICU MessageFormat verbatim;
  build pipeline extracts + compiles per locale.

### 3.4 Build pipeline

```text
source (.md files)
   ↓
[markdown-parser + frontmatter-schema-validator]
   ↓
intermediate AST (TS)
   ↓
[icu-syntax-validator + placeholder-checker + voice-card-linter]
   ↓
[locale-split compiler]
   ↓
output:
  - packages/game-data/src/narrative/en/inbox.json
  - packages/game-data/src/narrative/de/inbox.json
  - packages/game-data/src/narrative/en/newspaper.json
  - ...
  - packages/game-data/src/narrative/types.ts          (typed message IDs)
  - packages/game-data/src/narrative/story-arcs.json   (arc graph)
  - packages/game-data/src/narrative/event-families.json (taxonomy)
```

Build runs in CI via `pnpm narrative:build` (and during local dev
via watch mode). PR fails on:

- ICU syntax errors
- Missing placeholder declarations
- Missing locale (DE or EN)
- Voice-card lint violations
- Unreachable arc beats (arc state machine validation)

### 3.5 Compiled output format

Compiled JSON per locale per category:

```json
{
  "inbox.transfer-saga.bid-received.subject.calm": "{bidderClub} have made a {bidValue, number, ::currency/EUR} bid for {playerName}",
  "inbox.transfer-saga.bid-received.body.calm": "{bidderClub} have submitted a formal offer for {playerName}...",
  "inbox.transfer-saga.bid-received.body.urgent": "The transfer window closes in {window_days_remaining} days...",
  ...
}
```

Plus typed TS message-ID maps in `types.ts`:

```ts
export type MessageId =
  | 'inbox.transfer-saga.bid-received.subject.calm'
  | 'inbox.transfer-saga.bid-received.body.calm'
  | 'inbox.transfer-saga.bid-received.body.urgent'
  | ...

export type MessageVars = {
  'inbox.transfer-saga.bid-received.subject.calm': {
    playerName: string
    bidValue: number
    bidderClub: string
  }
  ...
}
```

Runtime call:

```ts
import { t } from '@/i18n'

const subject = t('inbox.transfer-saga.bid-received.subject.calm', {
  playerName: player.fullName,
  bidValue: bid.amount,
  bidderClub: bidder.name,
})
// TypeScript enforces all required vars are present
```

## 4. ICU MessageFormat

### 4.1 Library — FormatJS / `intl-messageformat`

Per D15 Q&A. Industry standard; strong TS ecosystem; good
tree-shakability.

Setup:

```ts
// packages/i18n/src/index.ts
import { IntlMessageFormat } from 'intl-messageformat'
import { compiledCatalog } from './compiled'  // generated by build

export function t<K extends MessageId>(
  id: K,
  vars: MessageVars[K],
  locale: Locale = currentLocale,
): string {
  const pattern = compiledCatalog[locale][id]
  if (!pattern) throw new Error(`Missing message: ${id} in ${locale}`)
  const msg = new IntlMessageFormat(pattern, locale)
  return msg.format(vars) as string
}
```

### 4.2 Placeholder patterns

**Basic substitution**:

```text
{playerName} has been called up
```

**Plurals**:

```text
{goals, plural,
  =0 {no goals}
  =1 {1 goal}
  other {# goals}
}
```

**Select** (categorical):

```text
{result, select,
  win {a victory}
  draw {a draw}
  loss {a defeat}
  other {the match}
}
```

**Number formatting**:

```text
{value, number}                    // 1234567
{value, number, ::currency/EUR}    // €1,234,567
{value, number, ::percent}         // 47%
```

**Date / time formatting**:

```text
{date, date, medium}    // 12 Aug 2026
{date, time, short}     // 15:30
```

**Gender-aware variants** (DE has masculine/feminine/neuter):

```text
{playerGender, select,
  male {der Spieler}
  female {die Spielerin}
  other {die Person}
}
```

EN equivalent:

```text
{playerGender, select,
  male {he}
  female {she}
  other {they}
}
```

### 4.3 Nested ICU (used sparingly)

```text
{isBigGame, select,
  true {{result, select,
    win {What a statement win.}
    draw {A valuable point.}
    loss {A disappointing night.}
    other {An eventful match.}
  }}
  other {{result, select,
    win {Job done.}
    draw {A point is a point.}
    loss {We move on.}
    other {Match concluded.}
  }}
}
```

Rule: if nested ICU becomes unreadable (> 2 levels deep), split into
separate message IDs.

### 4.4 Forbidden patterns

- **No runtime concatenation** (`"Player " + name + " scored"`):
  breaks i18n; use ICU placeholders.
- **No string templates with logic** (`${form === 'good' ? 'great' : 'poor'}`):
  use ICU select.
- **No untyped variables** in CTA actions: build-time check.

### 4.5 Type generation

`packages/i18n/build/extract-types.ts` runs at build:

1. Parse all `.md` files
2. Extract all `{varName}` and `{varName, ..., ...}` placeholders
3. Generate `types.ts` with `MessageId` union + `MessageVars`
   record type
4. Run `tsc --noEmit` on `types.ts` to ensure validity

PR fails on:

- Missing variable in a translation (e.g. EN has `{playerName}` but
  DE forgot it)
- Extra variable in a translation (typo in placeholder)
- Type mismatch (e.g. `{goals, plural, ...}` requires number, but EN
  treats it as string)

## 5. Event family taxonomy

Per D15 Q&A: full ~50 families across 10 groups at MVP (phased
content authoring 80-120 templates → 250 → 500).

### 5.1 Family list (50 IDs)

Stable internal IDs (save-compatibility). Each family has 3-7
reactive variants by tone + context.

#### 5.1.1 Match events (18)

| ID | Trigger |
|---|---|
| `MATCH_PREVIEW_KEY_FIXTURE` | derby / title decider / cup final / relegation 6-pointer |
| `MATCH_PREVIEW_ROUTINE_FIXTURE` | standard league game |
| `MATCH_TEAM_SELECTION_DRAMA` | star dropped / key player not fit |
| `MATCH_KICKOFF_TUNNEL_TENSION` | optional flavour hook before big matches |
| `MATCH_HALFTIME_STATE` | losing badly / narrow deficit / dominant but not scoring |
| `MATCH_RESULT_BIG_WIN` | win by ≥ 3 goals OR xG_diff > 1.5 |
| `MATCH_RESULT_LUCKY_WIN` | xG_for << xG_against OR late winner OR opp missed big chances |
| `MATCH_RESULT_HEROIC_DRAW_OR_LOSS` | underdog performance vs much stronger opp |
| `MATCH_RESULT_HEAVY_LOSS` | lose ≥ 3 goals OR defensive meltdown |
| `MATCH_RESULT_DRAB_DRAW` | 0-0 / low xG slugfest |
| `MATCH_RESULT_COMEBACK` | come from 2+ goals down |
| `MATCH_RESULT_LATE_DRAMA` | winner/equaliser in 85+ minute |
| `MATCH_CLEAN_SHEET_DEFENSIVE_MASTERCLASS` | shutout in big game |
| `MATCH_KEY_INDIVIDUAL_PERFORMANCE` | hat-trick / 10/10 rating / penalty saved |
| `MATCH_PLAYER_MILESTONE` | 100th app / 100th goal / debut / record broken |
| `MATCH_DISCIPLINE_CRISIS` | multiple cards / red card / brawl |
| `MATCH_INJURY_KEY_PLAYER` | injury during match (with duration threshold) |
| `MATCH_SET_PIECE_STORY` | multiple goals from set pieces (for or against) |

#### 5.1.2 Squad & player events (20)

| ID | Trigger |
|---|---|
| `SQUAD_TRANSFER_RUMOUR_IN` | club linked to player |
| `SQUAD_TRANSFER_RUMOUR_OUT` | our player linked elsewhere |
| `SQUAD_TRANSFER_BID_RECEIVED` | formal offer arrived |
| `SQUAD_TRANSFER_NEGOTIATION_TURN` | stalled / improved / hijacked |
| `SQUAD_TRANSFER_COMPLETED_IN` | signing done |
| `SQUAD_TRANSFER_COMPLETED_OUT` | sale / loan done |
| `SQUAD_CONTRACT_RENEWAL_OFFERED` | extension started |
| `SQUAD_CONTRACT_RENEWAL_REJECTED` | wage/role/loyalty conflict |
| `SQUAD_CONTRACT_RENEWAL_ACCEPTED` | extension signed |
| `SQUAD_PLAYER_PROMOTED_FROM_YOUTH` | first-team promotion |
| `SQUAD_PLAYER_DEMOTED_OR_LISTED` | transfer list / reserves |
| `SQUAD_NEW_CAPTAIN_APPOINTED` | captaincy assigned |
| `SQUAD_CAPTAINCY_STRIPPED` | captaincy removed |
| `SQUAD_TRAINING_INJURY` | non-match injury |
| `SQUAD_FORM_STREAK_PLAYER_HOT` | 5+ games good ratings/goals |
| `SQUAD_FORM_STREAK_PLAYER_COLD` | slump; seeds Player Crisis arc |
| `SQUAD_PLAYER_WANTAWAY` | wants move (5 sub-reasons) |
| `SQUAD_LOCKER_ROOM_UNREST` | cliques / unhappy group |
| `SQUAD_RETURN_FROM_INJURY` | star returns |
| `SQUAD_AWARD_PLAYER_OF_MONTH_OR_YEAR` | individual award |

#### 5.1.3 Board / club / finance events (16)

| ID | Trigger |
|---|---|
| `BOARD_OBJECTIVES_SET_SEASON` | pre-season aims |
| `BOARD_CONFIDENCE_UPDATE_PERIODIC` | monthly review (FM-style) |
| `BOARD_SACKING_WARNING` | "results need to improve" |
| `BOARD_MANAGER_UNDER_REVIEW_MEETING` | save-your-job meeting |
| `BOARD_MANAGER_SACKED` | dismissal |
| `BOARD_NEW_CONTRACT_OFFERED_MANAGER` | extension |
| `BOARD_TAKEOVER_RUMOUR` | from journalist / anonymous tip |
| `BOARD_TAKEOVER_CONFIRMED` | takeover happens (per D6 archetypes) |
| `BOARD_OWNER_ARCHETYPE_BEHAVIOUR` | sugar daddy demand / penny-pincher veto |
| `BOARD_BANKRUPTCY_WARNING` | per D6 admin trigger |
| `BOARD_ADMINISTRATION_ENTERED` | full admin |
| `BOARD_NEW_SPONSOR_SIGNED` | revenue boost |
| `BOARD_SPONSOR_LOST` | revenue hit |
| `BOARD_STADIUM_EXPANSION_PROJECT` | per D6 year-X event |
| `BOARD_INFRASTRUCTURE_UPGRADE` | training / youth facilities |
| `BOARD_TICKET_PRICE_CHANGE_OR_FAN_PROTEST` | optional fan story |

#### 5.1.4 Tactical & training events (6)

| ID | Trigger |
|---|---|
| `TACTIC_NEW_SYSTEM_ADOPTED` | new primary formation saved |
| `TACTIC_TACTICAL_FAMILIARITY_REACHED` | team becomes "fluid" |
| `TACTIC_SET_PIECE_ROUTINE_ADDED_OR_REWORKED` | per A3 |
| `TACTIC_TACTICAL_IDENTITY_EMERGES` | data-driven (possession / press intensity) |
| `TRAINING_FOCUS_CHANGED` | new training emphasis |
| `TRAINING_COMPLAINT_OR_PRAISE_INTENSITY` | player or group reaction |

#### 5.1.5 Manager career events (9)

| ID | Trigger |
|---|---|
| `CAREER_JOB_OFFER_RECEIVED` | new opportunity |
| `CAREER_JOB_OFFER_REJECTED_BY_MANAGER` | user choice; rep narrative |
| `CAREER_JOB_OFFER_WITHDRAWN_BY_CLUB` | offer rescinded |
| `CAREER_MANAGER_APPOINTED_AT_OTHER_CLUB` | rival manager moves (per D4) |
| `CAREER_MANAGER_SACKED_ELSEWHERE` | rival sacked |
| `CAREER_REPUTATION_MILESTONE` | "nationally known" / "continental rep" |
| `CAREER_LEGEND_STATUS_AT_CLUB` | per D4 §9.5 + D6 §5.4 |
| `CAREER_NATIONAL_TEAM_JOB_OFFER` | Bundestrainer offer (D6 §4) |
| `CAREER_MANAGER_RETIREMENT_EVENT` | AI manager retires (per D4) |

#### 5.1.6 Competition / cup / continental events (9)

| ID | Trigger |
|---|---|
| `COMP_QUALIFIED_FOR_CONTINENTAL_CUP` | per D6 §3 |
| `COMP_DRAW_MADE_GROUP_STAGE` | continental draw |
| `COMP_DRAW_MADE_KNOCKOUT` | knockout bracket |
| `COMP_CUP_UPSET` | giant-killing |
| `COMP_RELEGATION_BATTLE_TURNING_POINT` | win/loss that shifts probabilities |
| `COMP_TITLE_RACE_TURNING_POINT` | title race swing |
| `COMP_CUP_FINAL_REACHED` | final qualification |
| `COMP_TROPHY_WON` | trophy won |
| `COMP_RUNNER_UP_OR_HEARTBREAK_LOSS` | final loss / last-day title miss |

#### 5.1.7 National team / international player events (6)

| ID | Trigger |
|---|---|
| `INTL_PLAYER_FIRST_CALL_UP` | first call-up |
| `INTL_PLAYER_MAJOR_TOURNAMENT_SQUAD` | tournament selection |
| `INTL_PLAYER_RETURN_FROM_DUTY_INJURED_OR_FATIGUED` | post-international comeback |
| `INTL_PLAYER_TOURNAMENT_PERFORMANCE` | hero / flop / penalty miss |
| `INTL_PLAYER_RETIREMENT` | international retirement |
| `INTL_MANAGER_TOURNAMENT_ARC` | user as national team manager (per D6 §4) |

#### 5.1.8 Personal life & mood events (6)

Per D15 Q&A — Anstoss-style flavour layer; toggleable in Settings.

| ID | Trigger |
|---|---|
| `LIFE_FAMILY_COMPLAINT_TIME` | high `stressLevel` + many hours worked |
| `LIFE_HEALTH_BURNOUT_WARNING` | stress + negative results stack |
| `LIFE_VACATION_OPPORTUNITY_OFF_SEASON` | preseason gap if stress high |
| `LIFE_PUBLIC_APPEARANCE_TV_OR_INTERVIEW` | media interest after success |
| `LIFE_CHARITY_EVENT_OR_LOCAL_COMMUNITY_STORY` | community engagement |
| `LIFE_OFF_FIELD_SCANDAL_RISK` | low-probability mild scandal |

Settings: `On (full)` / `Reduced (1 / in-game month)` / `Off (none)`.

#### 5.1.9 Rumours, leaks & journalism events (9)

| ID | Trigger |
|---|---|
| `RUMOUR_LOCKER_ROOM_LEAK` | anonymous tip / journalist gossip |
| `RUMOUR_SCOUTING_WHISPER` | hidden gem / wonderkid suggestion |
| `RUMOUR_TACTICAL_WHISPER` | opp likely shape/lineup |
| `PRESS_CONFERENCE_PRE_MATCH` | pre-match presser (see §8) |
| `PRESS_CONFERENCE_POST_MATCH` | post-match presser |
| `PRESS_CONFERENCE_TRANSFER_WINDOW` | transfer window presser |
| `PRESS_CONFERENCE_SCANDAL_OR_CRISIS` | crisis presser |
| `PRESS_OPINION_COLUMN` | journalist op-ed |
| `PRESS_FAN_REACTION_FEATURE` | fans praising/turning |

#### 5.1.10 Records, world events & meta (7)

| ID | Trigger |
|---|---|
| `RECORD_CLUB_RECORD_BROKEN` | most goals / points / wins (per D6 §11.6) |
| `RECORD_PLAYER_RECORD_BROKEN` | top scorer / appearance record |
| `RECORD_NATIONAL_OR_LEAGUE_RECORD` | league-wide record |
| `WORLD_RISING_RIVAL_CLUB_EVENT` | per D4 §10.4.1 |
| `WORLD_GIANT_COLLAPSE_EVENT` | per D4 §10.4.2 |
| `WORLD_LEAGUE_REFORM_OR_FORMAT_CHANGE` | per D6 §11.3 |
| `WORLD_LONG_TERM_DYNASTY_DETECTED` | dynasty milestone (your club or AI) |

**Total**: 18 + 20 + 16 + 6 + 9 + 9 + 6 + 6 + 9 + 7 = 106 events.
(Earlier counted as ~50 families but each group has more granularity
than initially estimated; actual count locks at 106 stable IDs.)

### 5.2 Priority + frequency caps

```ts
type EventPriority = 'HIGH' | 'MEDIUM' | 'LOW'
type EventChannel = 'INBOX' | 'NEWSPAPER' | 'PRESSER' | 'FLAVOUR'

interface EventConfig {
  id: EventFamilyId
  priority: EventPriority
  channels: EventChannel[]
  capPerWeek: number
  defaultTone: ToneId
}
```

**HIGH** (always shown; max 3 per in-game day):

- Match results (`MATCH_RESULT_*`): 18 families
- Sacking + job offers: `BOARD_MANAGER_SACKED`, `CAREER_JOB_OFFER_RECEIVED`, etc.
- Major transfers: `SQUAD_TRANSFER_COMPLETED_*`, `SQUAD_CONTRACT_RENEWAL_*`
- Takeovers + administration: `BOARD_TAKEOVER_*`, `BOARD_BANKRUPTCY_*`, `BOARD_ADMINISTRATION_*`
- Trophy + relegation/title turning points: `COMP_*`

**MEDIUM** (3-4 per in-game week per channel):

- Transfer rumours: `SQUAD_TRANSFER_RUMOUR_*`, `SQUAD_TRANSFER_NEGOTIATION_TURN`
- Player wantaway / unrest: `SQUAD_PLAYER_WANTAWAY`, `SQUAD_LOCKER_ROOM_UNREST`
- Board confidence: `BOARD_CONFIDENCE_UPDATE_PERIODIC`, `BOARD_NEW_CONTRACT_OFFERED_MANAGER`
- Player form streaks: `SQUAD_FORM_STREAK_PLAYER_*`
- National team call-ups: `INTL_PLAYER_FIRST_CALL_UP`, `INTL_PLAYER_MAJOR_TOURNAMENT_SQUAD`
- Records: `RECORD_*`

**LOW** (1-2 per in-game week; mostly optional flavour):

- Opinion columns, fan reactions: `PRESS_OPINION_COLUMN`, `PRESS_FAN_REACTION_FEATURE`
- Anonymous tips, scouting whispers: `RUMOUR_*`
- Personal life (when enabled): `LIFE_*`
- Tactical identity stories: `TACTIC_*`, `TRAINING_*`

**Spam guard** per family:

```ts
interface EventThrottle {
  lastTriggerDate: GameDate
  triggersThisWeek: number
  weeklyCap: number   // 1-3 depending on priority
}
```

If cap exceeded, suppress event. At week rollover, allow one
suppressed event through as a **catch-up summary** ("Media roundup:
multiple outlets…") rather than several separate messages.

## 6. Reactive variants + context flags

Each event family has 3-7 variants keyed by tone + context flags.
Borrowed from Failbetter's "quality gates" model.

### 6.1 Context flag system

For each event, compute deterministic context flags from game state:

```ts
interface EventContext {
  opponent_strength: 'much_stronger' | 'stronger' | 'equal' | 'weaker' | 'much_weaker'
  venue: 'home' | 'away'
  rivalry_level: 'none' | 'mild' | 'derby' | 'mortal'
  importance: 'friendly' | 'league' | 'cup' | 'derby' | 'title' | 'relegation'
  streak_before: 'slump' | 'neutral' | 'strong_run'
  score_margin: number
  late_goals: boolean
  xg_diff: number               // ours minus opponent's
  is_decider: boolean
  owner_archetype: OwnerArchetype | null
  manager_archetype: ManagerArchetype | null
  ...
}
```

### 6.2 Variant matching

```yaml
# in frontmatter
variants:
  - id: triumphant
    tone: triumphant
    weight: 1.0
    when:
      rivalry_level: derby
      venue: home
      importance: title
  - id: professional
    tone: professional
    weight: 1.0
    when:
      opponent_strength: { in: [weaker, much_weaker] }
      importance: league
  - id: statement_win
    tone: statement
    weight: 1.0
    when:
      opponent_strength: { in: [stronger, much_stronger] }
  - id: relief
    tone: relieved
    weight: 1.0
    when:
      streak_before: slump
```

### 6.3 Selection algorithm

```ts
function selectVariant(
  template: NarrativeTemplate,
  ctx: EventContext,
  seed: number,
): VariantId {
  const eligible = template.variants.filter(v => matchesContext(v.when, ctx))
  if (eligible.length === 0) return template.variants[0].id  // fallback default
  if (eligible.length === 1) return eligible[0].id
  
  // Weighted random with deterministic seed
  const totalWeight = eligible.reduce((sum, v) => sum + v.weight, 0)
  const r = seededRandom(seed) * totalWeight
  let cumWeight = 0
  for (const v of eligible) {
    cumWeight += v.weight
    if (r <= cumWeight) return v.id
  }
  return eligible[eligible.length - 1].id
}
```

### 6.4 Deterministic seeding

Per D8 — variant selection MUST be deterministic from game state:

```ts
const variantSeed = hash([
  matchId,        // or arcId for non-match events
  managerId,
  eventFamilyId,
  triggerDate,    // game date, not real date
].join(':'))
```

Same world seed + same match + same event family → same variant.
Replay-safe.

## 7. Story arc state machines

Per D15 Q&A: 6 core arcs at MVP, each as a state machine.

### 7.1 Arc 1 — Transfer Saga (4-6 beats)

Beats:

1. **Rumour appears** (`SQUAD_TRANSFER_RUMOUR_IN/OUT`; sender:
   Journalist / Anonymous)
2. **Concrete bid** (`SQUAD_TRANSFER_BID_RECEIVED`; CTAs: Negotiate
   / Accept / Reject; user choice branches arc)
3. **Negotiation turbulence** (`SQUAD_TRANSFER_NEGOTIATION_TURN`;
   sub-branches: player demands big wage / board overrides /
   bidder withdraws)
4. **Decision point** (`SQUAD_TRANSFER_COMPLETED_IN/OUT` OR saga
   collapses)
5. **Aftermath** (`SQUAD_PLAYER_WANTAWAY` if blocked, OR morale
   boost if move granted; `PRESS_FAN_REACTION_FEATURE` split by
   sentiment)
6. **Newspaper follow-up** (optional; depends on profile)

### 7.2 Arc 2 — Takeover Saga (3-5 beats)

Beats:

1. **Rumour** (`BOARD_TAKEOVER_RUMOUR`; archetype hints)
2. **Confirmation** (`BOARD_TAKEOVER_CONFIRMED`; unlocks owner
   archetype expectations)
3. **Manager uncertainty** (CTAs: support / silent / hint at
   leaving; press conference + inbox)
4. **Integration** (`BOARD_NEW_SPONSOR_*`, `BOARD_STADIUM_EXPANSION_*`,
   budget changes; archetype-specific)
5. **Newspaper retrospective** ("End of an era" piece feeding D6
   archive)

### 7.3 Arc 3 — Player Crisis Arc (4-7 beats)

Beats:

1. **Form dip** (`SQUAD_FORM_STREAK_PLAYER_COLD`)
2. **Whispers + leaks** (`RUMOUR_LOCKER_ROOM_LEAK`; CTA: address
   privately or ignore)
3. **Agent contact** (`SQUAD_PLAYER_WANTAWAY`; reason: not enough
   minutes / tactical misuse / desire to move up)
4. **Press escalation** (`PRESS_CONFERENCE_TRANSFER_WINDOW` or
   `_SCANDAL_OR_CRISIS`; tone choices affect morale)
5. **Resolution** (branches: reconciliation OR sale OR festering
   `SQUAD_LOCKER_ROOM_UNREST` continues)
6. **Epilogue** (if reconciled + form improves:
   `SQUAD_FORM_STREAK_PLAYER_HOT`; newspaper: redemption narrative
   vs "good riddance")

### 7.4 Arc 4 — Bankruptcy / Administration (5-8 beats)

Per D6 §6.4:

1. **Financial warning** (`BOARD_BANKRUPTCY_WARNING`)
2. **Operational pain** (budget cuts / blocked deals / unhappy
   staff)
3. **Administration** (`BOARD_ADMINISTRATION_ENTERED`; auto -10
   points + cuts)
4. **Fire sale** (forced outgoing transfers; board overrides user;
   `SQUAD_TRANSFER_COMPLETED_OUT` + fan reaction)
5. **White Knight or decay** (branch: new takeover OR prolonged
   purgatory)
6. **Heroic save path** (if user achieves survival + net positive
   window → "White Knight" trigger + "Saved the Club" HoF credit
   per D6)
7. **Aftermath retrospective** (Anstoss-style end-of-season or
   decade article)

### 7.5 Arc 5 — Rivalry Storyline (ongoing per-season)

- Track per-rival pair: H2H results + controversial incidents (late
  winners / red cards / press provocations)
- Each notable match triggers `MATCH_RESULT_*` + `PRESS_OPINION_COLUMN`
  focused on rivalry
- When rival manager sacked / moves: `CAREER_MANAGER_SACKED_ELSEWHERE`
  / `_APPOINTED` + "changing of the guard" newspaper entry
- `WORLD_RISING_RIVAL_CLUB_EVENT` / `WORLD_GIANT_COLLAPSE_EVENT`
  frame long-term arcs ("The fall of X" / "The rise of Y") for
  D6 decade retrospectives

### 7.6 Arc 6 — National Team Tournament (5 beats)

Per D6 §4:

1. **Pre-tournament** (`INTL_PLAYER_MAJOR_TOURNAMENT_SQUAD`
   call-ups; newspaper preview)
2. **Group stage** (`INTL_PLAYER_TOURNAMENT_PERFORMANCE` standout;
   injuries / fatigue tracking)
3. **Knockout rounds** (narrative around heartbreak vs heroes)
4. **Final** (`COMP_CUP_FINAL_REACHED` + outcome)
5. **Post-tournament** (newspaper recap; impact on club returners;
   reputation deltas)

### 7.7 Arc state machine schema

```ts
type ArcId = 'transfer-saga' | 'takeover-saga' | 'player-crisis' 
           | 'bankruptcy-saga' | 'rivalry-storyline' | 'national-tournament'

interface ArcState {
  arcId: ArcId
  arcInstanceId: string           // unique per save per arc instance
  currentBeat: number
  participants: EntityRef[]       // player / club / manager / nation IDs
  flags: Record<string, unknown>
  history: EmittedMessageId[]
  seedKey: string                 // for deterministic variant selection
  startedAt: GameDate
  expiresAt: GameDate | null      // null = ongoing
  nextEligibleTimestamp: GameDate
}

interface NarrativeArcSave {
  active: ArcState[]
  completed: ArcCompletionRecord[]
}
```

Stored in IndexedDB under `narrative_arcs` object store; resumable
across save reloads.

## 8. Press conference design

Per D15 Q&A: 5 tone choices × 4 contexts.

### 8.1 Tones (5)

| Tone | Behaviour |
|---|---|
| **Calm / Diplomatic** | Measured, professional; small `mediaReputation: respected` boost |
| **Critical** | Of players / referee / board; `mediaReputation: outspoken`; small board trust hit if criticising board |
| **Defiant** | Against media / doubters; `mediaReputation: firebrand`; fan support if backed up by results |
| **Self-Deprecating / Humorous** | Plays down expectations; `mediaReputation: charismatic`; reduces media pressure |
| **Ambitious / Bullish** | Sets high targets; `mediaReputation: bold`; raises pressure if results don't follow |

### 8.2 Contexts (4)

| Context | Trigger |
|---|---|
| **Pre-match vs important opponent** | `PRESS_CONFERENCE_PRE_MATCH` + `is_decider` OR `rivalry_level > none` |
| **Post-match** | `PRESS_CONFERENCE_POST_MATCH` after any match |
| **Transfer window** | `PRESS_CONFERENCE_TRANSFER_WINDOW` during transfer windows |
| **Scandal / crisis** | `PRESS_CONFERENCE_SCANDAL_OR_CRISIS` after `BOARD_SACKING_WARNING` / `BANKRUPTCY_*` / `SQUAD_LOCKER_ROOM_UNREST` |

### 8.3 Question patterns

2-4 questions per presser. Examples:

**Pre-match vs rival**:

- "Fans see this as a must-win. Do you?"
- "Is your job on the line if this goes badly?"
- "Your opponent's manager said X about your style…"

**Post-match (win)**:

- "Was this a statement performance?"
- (after lucky win) "Do you accept you were fortunate?"

**Post-match (loss)**:

- "Do you take responsibility?"
- "Has the dressing room reacted?"

**Transfer window**:

- "Are you confident of keeping {starPlayer}?"
- "Fans are frustrated with lack of signings."

**Scandal / crisis**:

- "Reports suggest the dressing room is lost. True?"
- "Are finances limiting your ambitions?"

### 8.4 Effects (cumulative over season)

```ts
interface PressEffect {
  moraleDelta?: { playerId: PlayerId; amount: number }     // -5 to +5
  boardTrustDelta?: number                                  // -3 to +3
  mediaReputationTag?: 'CALM' | 'FIREBRAND' | 'CHARISMATIC' | 'BOLD' | 'DULL'
  fanSentimentDelta?: number                                // -5 to +5
}
```

Per-question impacts small; cumulative effect over a season is
significant. Stored in IndexedDB under `press_history` per season.

## 9. Newspaper generation

Per D15 Q&A + D6: auto-generated from event log + season stats.

### 9.1 Weekly summary

Triggered each in-game week:

1. Select 2-4 **headline candidates** from past week's matches:
   - Highest upset factor (result vs odds)
   - Biggest scoreline / comeback
   - Most narrative-rich match (derby / rivalry / late drama)

2. For each candidate, pick template by event family:
   - `MATCH_RESULT_COMEBACK` → "Comeback Kings"-style headline
   - `MATCH_RESULT_LUCKY_WIN` → "Smash and Grab"
   - `MATCH_RESULT_BIG_WIN` → "Statement Performance"

3. Small sidebars:
   - "Form Watch" (from `SQUAD_FORM_STREAK_*`)
   - "Crisis Watch" (from `BOARD_BANKRUPTCY_*` / `BOARD_SACKING_*`)

### 9.2 Monthly opinion piece

Triggered every 3-4 in-game weeks per league:

- Patterns: over/under-performing vs expected table position
- Uses arc state: Rivalries, Takeover saga progression, Player
  crisis
- Templates from `PRESS_OPINION_COLUMN` with flags `OVERACHIEVING`
  / `UNDERACHIEVING` / `MANAGER_UNDER_PRESSURE` / etc.

### 9.3 End-of-season retrospective (per D6 §11.5)

Once per season:

- Champions, promoted, relegated, cup winners
- **Surprise package** (team finishing 5+ spots above expected)
- **Flop** (reverse)
- Top scorer, best defence
- 3-6 headline paragraphs
- Keyed by `COMP_TROPHY_WON`, `RECORD_*`, `WORLD_*`

### 9.4 Decade retrospective (per D6 §11.5)

Every 10 seasons OR when sim crosses time threshold:

- Use `WORLD_RISING_RIVAL_CLUB_EVENT`, `WORLD_GIANT_COLLAPSE_EVENT`,
  `WORLD_LONG_TERM_DYNASTY_DETECTED`
- Templates: "The decade of {clubName}" / "How {giantClub} fell" /
  "From yo-yo club to powerhouse"
- 4-7 headline paragraphs summarising era transitions

### 9.5 Generation determinism

Per D8: deterministic from event log. Same world + same week → same
weekly summary. Replay-safe.

```ts
const newspaperSeed = hash([
  worldSeed,
  weekNumber,
  leagueId,
  'newspaper-weekly',
].join(':'))
```

## 10. Voice consistency system

Per D15 Q&A: multi-layer.

### 10.1 Per-sender voice cards (10 senders)

Each sender's voice card lives in
`packages/game-content/src/voice-cards/{sender-id}.md`:

```md
---
sender: assistant-manager
display_name: "Alex"
tone_keywords: [friendly, practical, supportive, informal]
address_style:
  en: ["boss", "gaffer"]
  de: ["Chef"]
signature_phrases:
  - "I'd rest him"
  - "Worth a sub?"
contractions: allowed
sentence_length: short_to_medium
emotional_range: medium
banned_words: ["corporate", "synergy"]
forbidden_patterns: 
  - "formal-greetings"
  - "long-paragraphs"
allowed_signoff:
  - "— Alex"
  - "Alex, Assistant Manager"
---

## Sample sentences

1. "Boss, I'd rest Schmidt. His condition dropped below 80%."
2. "Good win today — that rotated XI did the job."
3. "Their winger keeps finding space on our left. Worth a sub?"
```

### 10.2 Voice card schema

```ts
interface VoiceCard {
  sender: SenderId
  displayName: Record<Locale, string>     // per-locale name variants
  toneKeywords: string[]
  addressStyle: Record<Locale, string[]>
  signaturePhrases: string[]
  contractions: 'allowed' | 'forbidden'
  sentenceLength: 'short' | 'short_to_medium' | 'medium' | 'medium_to_long' | 'any'
  emotionalRange: 'narrow' | 'medium' | 'wide'
  bannedWords: string[]
  forbiddenPatterns: PatternId[]
  allowedSignoff: string[]
  sampleSentences: { en: string[]; de: string[] }
}
```

### 10.3 Per-AI-archetype reaction styles

Per D4 10 archetypes × event-family tone weights:

```json
{
  "ChaosMotivator": {
    "MATCH_RESULT_HEAVY_LOSS": {
      "tones": { "DEFIANT": 0.6, "CRITICAL": 0.3, "CALM": 0.1 }
    },
    "MATCH_RESULT_LUCKY_WIN": {
      "tones": { "DEFIANT": 0.5, "HUMBLE": 0.2, "ANALYTICAL": 0.3 }
    },
    "SQUAD_PLAYER_WANTAWAY": {
      "tones": { "DEFIANT": 0.4, "DISMISSIVE": 0.3, "ANGRY": 0.3 }
    },
    ...
  },
  "Stabilizer": {
    "MATCH_RESULT_HEAVY_LOSS": {
      "tones": { "CALM": 0.6, "ANALYTICAL": 0.3, "RESPONSIBLE": 0.1 }
    },
    ...
  },
  ...
}
```

10 archetypes × ~106 event families × 3-7 tones = ~1500-2000
reaction-context slots.

When an event triggers for an AI manager (not user), select tone
based on archetype weights + deterministic seed.

### 10.4 CI lint rules

Voice-card linter runs in `pnpm narrative:lint`:

```ts
const LINT_RULES = [
  {
    id: 'chairman-no-contractions',
    description: 'Chairman never uses contractions',
    applies_to: { sender: 'chairman' },
    check: (body: string) => !/\b(don't|can't|won't|isn't|hasn't|...)\b/i.test(body),
  },
  {
    id: 'assistant-must-use-boss',
    description: 'Assistant Manager must use "boss" or "Chef" in at least 1 of every 3 messages',
    applies_to: { sender: 'assistant-manager' },
    check: (corpus: string[]) => {
      const matches = corpus.filter(b => /\b(boss|Chef|gaffer)\b/i.test(b))
      return matches.length / corpus.length >= 0.33
    },
  },
  {
    id: 'journalist-rhetorical-questions',
    description: 'Journalist must use a rhetorical question in 70% of messages',
    applies_to: { sender: 'journalist' },
    check: (corpus: string[]) => {
      const matches = corpus.filter(b => /\?/.test(b))
      return matches.length / corpus.length >= 0.7
    },
  },
  {
    id: 'family-no-tactical-jargon',
    description: 'Family messages must avoid tactical jargon',
    applies_to: { sender: 'family' },
    check: (body: string) => 
      !/(formation|tactic|mentality|press|pivot|playmaker|gegenpress)/i.test(body),
  },
  ...
]
```

PR fails on lint violations. Lint output example:

```text
content/inbox/chairman/contract-offer.md:12
  error chairman-no-contractions: "don't" is not allowed for chairman voice.
```

## 11. Personal life events layer

Per D15 Q&A — Anstoss-style flavour layer; toggleable.

### 11.1 6 personal-life families

(Already in §5.1.8 taxonomy.)

### 11.2 Stress level tracking

```ts
interface ManagerStress {
  level: number                  // 0-100
  recentHighPressureEvents: { eventId: string; date: GameDate; weight: number }[]
  hoursWorkedThisWeek: number    // simulated; +1 per matchday + +0.5 per training session
}
```

Stress increases with:

- `BOARD_SACKING_WARNING`: +20
- `BOARD_MANAGER_SACKED`: not relevant (career ends)
- `BOARD_BANKRUPTCY_WARNING`: +15
- `BOARD_ADMINISTRATION_ENTERED`: +25
- `MATCH_RESULT_HEAVY_LOSS`: +5
- Consecutive matches: +1 per match in current week
- Hours worked: +1 per matchday + 0.5 per training session

Stress decreases with:

- `MATCH_RESULT_BIG_WIN`: -5
- `COMP_TROPHY_WON`: -20
- `LIFE_VACATION_OPPORTUNITY_OFF_SEASON` (if accepted): -30

### 11.3 Trigger thresholds

- `LIFE_FAMILY_COMPLAINT_TIME`: triggers when `stressLevel + hoursWorked > 70`
- `LIFE_HEALTH_BURNOUT_WARNING`: triggers when `stressLevel > 80` and `negative_result_streak >= 3`
- `LIFE_VACATION_OPPORTUNITY_OFF_SEASON`: triggers in preseason gap if `stressLevel > 60`
- `LIFE_PUBLIC_APPEARANCE_TV_OR_INTERVIEW`: triggers after big success (`COMP_TROPHY_WON` OR `CAREER_REPUTATION_MILESTONE`)
- `LIFE_CHARITY_EVENT_OR_LOCAL_COMMUNITY_STORY`: random per quarter (deterministic seed)
- `LIFE_OFF_FIELD_SCANDAL_RISK`: low probability (1-2 % per quarter) based on personality

### 11.4 Settings toggle

In `Settings → Narrative`:

```text
Personal life events:
  ○ On (full) — all events trigger as designed
  ● Reduced — max 1 personal life event per in-game month
  ○ Off — no personal life events
```

## 12. Writer workflow + translator handoff

Per D15 Q&A: Markdown + Git + custom React preview app.

### 12.1 Writer workflow

1. Writer clones `packages/game-content/` repo
2. Creates new branch (e.g. `feat/transfer-saga-content`)
3. Edits `.md` files in chosen text editor
4. Runs `pnpm narrative:preview` locally → opens React preview app
   on `http://localhost:5173/narrative-preview`
5. Preview app shows:
   - Variable picker (sample player names, clubs, scores)
   - Locale toggle (EN ↔ DE)
   - Voice-card view (live tone reminders)
   - Lint panel (real-time violations)
   - Variant comparison
   - Search across all templates
6. Commits + opens PR
7. CI runs `pnpm narrative:build` + `pnpm narrative:lint` + `pnpm narrative:test`
8. Reviewer + merge

### 12.2 Translator workflow

For DE/EN MVP, the **same Markdown files** contain both locales (in
`# en` / `# de` sections per template). Translator workflow:

1. Translator clones repo (or works in Tolgee/Inlang if adopted
   post-MVP)
2. Edits `.md` files; only modifies their target locale section
3. Preview app supports translator role (sees only their locale +
   source language for context)
4. Submits PR
5. CI validates:
   - ICU syntax + placeholders consistent across locales
   - Missing translations (CI fails if EN exists but DE missing)
   - Type-safe (vars match between locales)
6. Reviewer + merge

### 12.3 Post-MVP platform evaluation

Per D15 Q&A — Git-first at MVP; evaluate post-MVP:

- **Inlang** — typed message workflows; modern dev-friendly; good
  for engineering-centric pipelines
- **Tolgee** — in-context translation; modern; great for non-
  technical translators
- **Crowdin / Phrase** — vendor-heavy; expensive; only if
  outsourcing translation
- **Lokalise** — mid-range; popular; consider if scaling Tier-2
  locales

## 13. LLM-based authoring assistance

Per D15 Q&A — build-time only, never runtime.

### 13.1 What it does

Internal CI tool (`pnpm narrative:llm-assist`):

1. **Variant draft generation**: given a template's frontmatter +
   one variant, generate 3-5 alternative variants in matching voice.
   Output: draft `.md` files in `_drafts/` folder; human reviews +
   merges + deletes draft.
2. **Tone drift detection**: scan corpus for voice-card violations
   the rule-based linter missed (e.g. Chairman using overly casual
   phrasing). Output: warning list per file.
3. **DE phrasing alternatives**: for any DE translation, suggest 2-3
   alternatives in different registers (formal / informal /
   technical). Output: comment in PR for translator.
4. **Cross-locale consistency check**: ensure EN + DE convey the
   same meaning + tone. Output: warning if semantic drift detected.

### 13.2 What it does NOT do

- **No runtime LLM calls** (per D8 determinism + offline-first)
- **No automatic merging** (human always reviews)
- **No production text generation** (every shipped string was
  human-authored or human-approved)

### 13.3 Tool choice

LLM is invoked via a TS script that calls a local or remote LLM API
during CI. MVP can ship **without LLM assistance** — add post-MVP
when content scale justifies it (~200+ templates).

### 13.4 Determinism preservation

Even though LLM is non-deterministic, **shipped catalogs are 100 %
deterministic** because:

- LLM output is human-reviewed + committed to repo
- Once committed, the same `.md` file produces the same compiled JSON
- Build artifacts are reproducible from source

## 14. Determinism + RNG usage

Per D8.

### 14.1 RNG stream

D2 locked stream #9 `GeneratorRng`. D15 extends with new sub-labels:

```text
generator:narrative:event:<eventFamilyId>:<entityId>:<triggerDate>:variant
generator:narrative:arc:<arcInstanceId>:beat:<n>:variant
generator:narrative:newspaper:weekly:<year>-<week>:headline-<n>
generator:narrative:newspaper:season:<year>:retrospective
generator:narrative:newspaper:decade:<decade>:retrospective
generator:narrative:press-conference:<matchId>:question-<n>
generator:narrative:opinion-column:<year>-<week>
generator:narrative:fan-reaction:<eventId>
generator:narrative:tone-bias:<archetypeId>:<eventFamilyId>
generator:narrative:personal-life:<year>-<month>:<familyId>
```

Adding new sub-labels later doesn't break existing replays (per D8
§2.3 future-proof property).

### 14.2 Deterministic variant selection

```ts
function pickVariant(seed: number, variants: Variant[]): Variant {
  if (variants.length === 0) throw new Error('No variants')
  if (variants.length === 1) return variants[0]
  
  const total = variants.reduce((s, v) => s + v.weight, 0)
  const r = seededFloat(seed) * total
  let cum = 0
  for (const v of variants) {
    cum += v.weight
    if (r <= cum) return v
  }
  return variants[variants.length - 1]
}
```

`seededFloat(seed)` uses xxhash32 + linear congruential generator
(per D8 §2.1).

### 14.3 Replay safety

Save snapshot includes:

- Active arc states (with all flags + history)
- Press conference history (tone choices made + effects)
- Newspaper archive (compressed per season; decoded on demand)
- Personal-life event history + stress level

Reloading a save → narrative engine reads these states → re-emits
deterministic future messages from the same seed point. **No
divergence**.

## 15. Performance + storage budgets

Per D9 (locked):

### 15.1 Bundle

| Component | Budget |
|---|---|
| Narrative engine + state machines | ~10-15 KB gzipped |
| FormatJS / `intl-messageformat` runtime | ~10-15 KB gzipped |
| Voice card metadata (10 senders) | ~5 KB JSON |
| Event family taxonomy + reactions | ~15-20 KB JSON |
| Story arc definitions | ~5-10 KB JSON |
| Compiled per-locale catalogs (per locale) | ~50-80 KB JSON gzipped at MVP (80-120 templates) |
| **Total narrative bundle** | **~95-145 KB gzipped lazy-loaded per locale** |

Within D9 per-route lazy ≤ 200 KB budget. Lazy-loaded only when
user enters Inbox / Newspaper / Press Conference screens.

### 15.2 IndexedDB storage

Per save:

| Item | Size |
|---|---|
| Active story arcs (max 10 concurrent) | ~10-15 KB |
| Press conference history | ~5-10 KB per season |
| Newspaper archive (per season) | ~50 KB compressed (decade retrospectives compress older seasons further per D6 §11.5) |
| Personal life event history + stress | ~5 KB |
| Per-AI-manager archetype reaction state | ~10 KB (sparse) |

Per 50-year save: ~3-5 MB narrative data total; well within D9
200 MB IndexedDB budget.

### 15.3 Content authoring scale

- MVP: 80-120 templates (per D5 estimate)
- Phase 2: ~250 templates (extends to all 50+ event families)
- Phase 3: ~500 templates (full personal life + decade retrospectives
  + reaction variants per archetype)

Word count estimates (per template ~60 words average):

- MVP: 80 × 60 × 2 locales = ~10 000 words per locale
- Phase 2: ~30 000 words per locale
- Phase 3: ~60 000 words per locale

## 16. IndexedDB schemas

```ts
// narrative_arcs (per save)
interface NarrativeArcRecord {
  arc_instance_id: string
  arc_id: ArcId
  current_beat: number
  participants: EntityRef[]
  flags: Record<string, unknown>
  history: EmittedMessageId[]
  seed_key: string
  started_at: string                    // ISO in-game date
  expires_at: string | null
  next_eligible_timestamp: string
}

// press_conference_history (per save, keyed by match_id)
interface PressConferenceRecord {
  match_id: string
  conference_type: 'pre' | 'post' | 'transfer-window' | 'crisis'
  questions: {
    question_id: string
    tone_chosen: ToneId
    effects: PressEffect
  }[]
  cumulative_effects_this_season: {
    media_reputation_tag: MediaRepTag
    board_trust_delta: number
    fan_sentiment_delta: number
    morale_deltas_by_player: Record<PlayerId, number>
  }
}

// newspaper_archive (per save, per season)
interface NewspaperArchiveRecord {
  season: number
  headlines: HeadlineEntry[]
  user_club_storyline: string
  compressed_decade?: DecadeRetrospective  // present for seasons > 10 years old
}

// personal_life_state (per save)
interface PersonalLifeRecord {
  stress_level: number                  // 0-100
  recent_high_pressure_events: { event_id: string; date: string; weight: number }[]
  hours_worked_this_week: number
  setting: 'on' | 'reduced' | 'off'
  events_triggered_this_month: number
}

// event_throttle (per save, keyed by event_family_id)
interface EventThrottleRecord {
  event_family_id: EventFamilyId
  last_trigger_date: string             // ISO in-game date
  triggers_this_week: number
  weekly_cap: number
  suppressed_count_this_week: number    // for catch-up summary generation
}
```

## 17. Open follow-ups (deferred)

- **ADR-0006 i18n** depth pass: should incorporate this note's
  authoring format + ICU library + build pipeline + translation
  workflow.
- **E22 Localization workflow**: full handoff process for Tier-2
  locales post-MVP.
- **K3 Tutorial scripts**: full body copy for the 12-message D5
  tutorial arc + reactive variants + supporting cast messages
  (estimated ~600 words EN + ~720 words DE for MVP).
- **D10 i18n + copy tone**: this note locks the framework;
  per-locale tone register (formal-Sie vs informal-Du in DE) for
  each sender voice is D10 scope.
- **A6 ADR-0006 depth pass**: ICU library choice + compiled-catalog
  format need ADR-level lock.
- **A8 Mobile-first UI**: inbox screen layout + press-conference
  modal layout from D5 §7.5 + newspaper archive view from D6.

## 18. Sources

- Perplexity Sonar research, 2026-05-17 (gap D15): narrative
  authoring format comparison 2026 (JSON / YAML / Markdown + frontmatter
  / Ink / Yarn Spinner / Twine / GraphQL / MDX / Custom TS DSL); ICU
  MessageFormat 2026 best practices (plurals / select / number /
  date / gender-aware / nested ICU); library comparison (FormatJS /
  i18next-icu / Lingui / Inlang / vanilla); template engine design;
  writer-first vs developer-first tooling; voice consistency system;
  story arc state machines; competitor analysis FM story engine +
  Anstoss 3 Zeitung + Club Boss + EA SPORTS FC Career + 80 Days
  (inkle) + Failbetter Games + Disco Elysium.
- Perplexity Sonar research, 2026-05-17 (gap D15): event family
  taxonomy (~50 families across 10 groups) with concrete trigger
  conditions; priority + frequency caps; reactive variants with
  context flags (storylet model from Failbetter); 6 core story
  arcs (Transfer / Takeover / Player Crisis / Bankruptcy / Rivalry
  / National Team Tournament) with beat-by-beat design; press
  conference design with 5 tones × 4 contexts + cumulative effects;
  newspaper generation logic (weekly + monthly + season-end +
  decade); personal life events layer (Anstoss flavour); per-AI-
  archetype reaction patterns matrix (10 archetypes × event-
  family tone weights); competitor analysis FM (FM23+ story
  engine) + Anstoss 3 Zeitung + Club Boss + EA SPORTS FC + NBA 2K
  / MLB The Show / Failbetter.
- Locked context: [[onboarding-strategy]] (D5 10-sender cast +
  12-message tutorial arc + voice cards), [[late-game-systems]]
  (D6 newspaper archive + takeover narrative + bankruptcy events +
  national tournament UX), [[ai-manager-behaviour]] (D4 10
  archetypes + board confidence + career arcs), [[data-generators]]
  (D2 generator RNG streams + name placeholders),
  [[determinism-and-replay]] (D8 cross-save determinism +
  variant-selection seeding), [[performance-budgets]] (D9 bundle
  budgets), [[../10-Architecture/09-Decisions/ADR-0006-i18n]] (i18n
  ADR pending depth pass), [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  (IP-clean naming), [[club-boss-analysis]] (inbox-as-narrative
  reference), [[anstoss-series-deep-dive]] (Zeitung + Bundestrainer).
- D15 Q&A with Nico (2026-05-17): **all 9 recommendations accepted
  as-is**. Maximum scope locked.
