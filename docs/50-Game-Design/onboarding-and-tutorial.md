---
title: Onboarding & Tutorial — FTUE, Inbox Arc, Feed-Cards, Assistant Manager
status: approved
tags: [game-design, onboarding, ftue, tutorial, inbox, feed-cards, assistant, mobile-ux, fmx-99]
created: 2026-05-17
updated: 2026-06-03
type: game-design
binding: true
related: [[README]], [[GD-0012-onboarding]], [[GD-0017-mvp-scope-and-mode-sequencing]], [[../00-Index/MVP-Scope]], [[../60-Research/onboarding-guided-first-season-2026-06-03]], [[../60-Research/onboarding-strategy]], [[../60-Research/narrative-content-pipeline]], [[../60-Research/progressive-disclosure-research]], [[../60-Research/ai-manager-behaviour]], [[../60-Research/tactics-and-formations]], [[../60-Research/club-boss-analysis]], [[../60-Research/anstoss-series-deep-dive]], [[progressive-disclosure-ui]], [[mode-manage-a-club-career]], [[mode-create-a-club-roguelite]]
---

# Onboarding & Tutorial - FTUE, Inbox Arc, Feed-Cards, Assistant Manager

Approved 2026-05-17 (gap D5), then ratified for R2-05 on 2026-06-03
by [[GD-0012-onboarding]] / FMX-99. Binding implementation references are
[[GD-0012-onboarding]], [[../60-Research/onboarding-guided-first-season-2026-06-03]]
and [[../60-Research/onboarding-strategy]]. This GDD captures the detailed
product rules; full inbox copy and localization remain separate narrative /
localization work.

## 1. Approved product rules

1. **First match within 3 minutes**. Every required decision screen
   before first match costs ~5-10 % retention; cap is ≤ 2 required
   screens.
2. **Default first-time experience must complete in < 60 seconds** to
   the first meaningful tactical choice.
3. **Roguelite playable from day 0; Career visible as "comes later"**:
   Manage-a-Club Career stays visible in the mode step but cannot be started
   until post-MVP.
4. **3 UI tiers and 4 difficulty modes are silently mapped** from a
   single experience question; user can override anytime in
   Settings.
5. **Inbox-as-narrative** is the primary tutorial channel.
6. **Feed-card daily action queue** is the Home dashboard primary
   UI; inbox is secondary (drives narrative, not action queue).
7. **Assistant Manager** is a named, configurable character ("Alex"
   default) with voice consistency across inbox, coach marks, and
   match commentary. Per-difficulty intensity scaling with user
   override.
8. **WCAG 2.2 AA / BITV 2.0** accessibility is non-negotiable.
   No critical info exclusive to overlays. Coach marks are
   keyboard-reachable. Reduced-motion respected.
9. **Veteran skip** with safety net (micro-tooltips + settings reset
   + auto-detection of struggle).

## 1.1 FMX-99 R2-05 ratified addendum

- **FTUE shape** stays the current route path:
  `/new` → `/onboarding/experience` → `/onboarding/mode` →
  `/onboarding/club` → Home feed-card → `/tactics` playstyle.
- **Timing target** is < 60 seconds to first playstyle choice and
  < 3 minutes to first match kickoff. The two management-decision
  screens before match are Roguelite setup and playstyle; the
  experience/mode steps remain measured one-tap routing steps.
- **Season 1 learning spine** is an objective roadmap, not the inbox
  arc. The 12-message inbox arc supports the roadmap with voice,
  context and emotion.
- **First economy lesson** is wage runway: wage room, free agents,
  loans and board expectations. Matchday revenue and full finance
  cockpit are later lessons.
- **Assistant auto-handling** may prepare local drafts or prefill
  low-impact actions on Easy/Normal. Authoritative mutations still
  require explicit user confirmation.

## 2. FTUE flow (60-second start)

4 steps; target < 60s to first tactical choice, < 3 min to first
match.

```text
[Launch]
  ↓ 5-7s
[Experience Question]
  ↓ 5-10s
[Mode Step — Roguelite playable / Career comes later]
  ↓ 15-25s
[Club / Setup — Recommended club + Advanced setup escape]
  ↓ auto + 5s
[Home Dashboard — First inbox tutorial card]
  ↓
[Choose Playstyle — simplified tactics with 3 preset cards]
```

Silent tier + difficulty mapping from experience question:

| Selection | UI tier | Difficulty | Tutorial verbosity |
|---|---|---|---|
| Newbie | Quick | Easy | Full coach |
| Bit | Standard | Normal | Essential tips |
| Veteran | Expert | Normal | Skip (micro-tooltips only) |

User can change all of these in Settings → Assistance / Game
Settings anytime.

"Advanced setup" link on the Mode step AND Club picker opens the
full **New Save wizard** (5 screens: World / Country & Region /
Club / Difficulty & Mode / Assistance preferences). Power-user
opt-in; deliberate friction.

MVP mode step:

| Tile | MVP state |
|---|---|
| Create-a-Club Roguelite | Active primary CTA. |
| Manage-a-Club Career | Disabled / roadmap tile labelled "comes later". |

## 3. Inbox-as-narrative tutorial

### 3.1 Sender cast (10 senders)

**Core tutorial drivers (4)**:

| Sender | Role | Tutorial share | Tone keyword |
|---|---|---:|---|
| Assistant Manager (Alex) | Primary teacher / sidekick | ~50 % | Friendly, practical, "boss" / "Chef" |
| Chairman | Goals + board confidence | ~15 % | Formal, demanding |
| Director of Football | Transfers + contracts | ~20 % | Data-driven, professional |
| Head Scout | Discovery + youth hints | ~10 % | Enthusiastic, attribute-specific |

**Supporting cast (6)**:

| Sender | Role |
|---|---|
| Head of Youth Academy | Youth pulls + development paths |
| Player Agent | Contracts, playing time, transfer pressure |
| Journalist / Press Officer | Press conferences, narrative pressure |
| Sponsors | Money, optional objectives |
| Family / Personal Life | Anstoss flavour, pacing hints |
| Anonymous Tips | Mysterious hooks into hidden systems |

Per-sender voice cards live in `packages/game-data/src/inbox/voice-cards/`.

### 3.2 First-season objective roadmap + 12-message support arc

The first-season action order is owned by Home feed-card objectives.
The inbox provides 12 core messages + 1 optional Family flavour
message over the first four in-game weeks as voice/context support.
Full subjects + previews in [[../60-Research/onboarding-strategy]] §5.3.

| Phase | Time | Primary objective lane | Inbox role |
|---|---|---|---|
| Kickoff | Day 0-7 | confirm XI, choose playstyle, first match, report | welcome, board expectation, first match framing |
| Stabilize | Week 2 | training load and rotation | explain fatigue and reinforce lineup choices |
| Runway | Week 3-4 | wage room, free/loan shortlist, board runway | DoF/board explain wage trade-off and risk |
| Adjust | Days 31-60 | tactical fit, morale, squad depth | reactive feedback and open-loop hooks |
| Review | Days 61-90 | objective progress, wage runway checkpoint | board confidence and next target |
| Rhythm | Rest of season | recurring match prep and targeted warnings | lower-volume narrative and decision prompts |

**Pacing**:

- Tutorial arc (weeks 1-4): 4-6 messages/week.
- Rest of season 1 (weeks 5-38): 3-4 messages/week.
- Season 2+: 2-3 messages/week (user-tunable in Settings).

Week 4 closes with a **soft-transition message**: "You've got the
basics. From now on, I'll only step in when something important
comes up."

### 3.3 Message type mix

| Type | Arc % | Steady-state % |
|---|---:|---:|
| Tutorial-explanatory | 40-50 | 0 (only on new feature unlock) |
| Goal-setting | 15-20 | 25-30 |
| Reactive feedback (positive + criticism) | 20-30 | 30-40 |
| Open-loop hooks | 10 | 20-25 |
| Narrative flavour | 5-10 | 20-25 |
| Decision prompts | 5-10 | 10-15 |
| Press conferences | 0 at MVP | 5-10 post-MVP |

### 3.4 Localisation

EN source language; DE second locale at MVP (per D2). ~80-120 inbox
templates × ~60 words = ~7-10k words per locale. DE budget for length
+20-30 % vs EN.

## 4. Feed-card daily action queue

Home dashboard = 3-5 priority action cards per in-game day. Replaces
sprawling menu navigation with task-focused queue. Mental model =
Gmail / Inbox Zero.

### 4.1 Card structure

- Title + urgency tag (high / medium / low; colour + icon + text)
- 1-2 line summary
- Impact line ("Affects: Match performance, morale")
- Primary CTA + secondary text action + overflow menu

### 4.2 Swipe semantics

- **Right swipe**: complete (if auto-completable) OR open primary
  screen.
- **Left swipe**: snooze with contextual default + undo snackbar.

Swipe actions duplicated as visible buttons (accessibility).

### 4.3 Prioritisation

```text
priorityScore =
  onboardingStageBoost
  + timePressureScore
  + impactTypeScore
  + playerBehaviourAdjust
```

| Factor | Values |
|---|---|
| `onboardingStageBoost` | +80 current required objective; +35 newly unlocked system; +20 returning-user recap; 0 otherwise |
| `timePressureScore` | +100 overdue/today hard deadline; +80 due <=1 day; +55 due <=3 days; +30 due <=7 days; +10 next-step relevant; 0 informational |
| `impactTypeScore` | +70 match-critical; +65 wage runway / board confidence; +60 tutorial progression; +50 morale/fitness/availability; +45 transfer opportunity; +25 narrative/open loop; +10 info-only |
| `playerBehaviourAdjust` | +10 per ignored high-impact CTA, max +30; +20 struggle trigger; -20 same type dismissed twice; -30 completed/snoozed recently; -20 tutorial card for Veteran/Minimal help |

Tie-breaks: score, due date, category order, stable card id. `playerBehaviourAdjust`
is per-save only and resettable through Assistance settings; it is not a
cross-save profile.

Per-difficulty queue behaviour:

| Difficulty | Behaviour |
|---|---|
| Easy | Assistant auto-filters low-impact; one-tap auto-complete on rotation / training. |
| Normal | Balanced 3-5 cards; no auto-complete. |
| Hard | More cards (4-6); fewer "I prepared this for you" helpers. |
| Sim | Strategic decisions only; micro-tasks auto-handled. |

Full algorithm:
[[../60-Research/onboarding-strategy]] §7.4.

### 4.4 Card categories

- Match prep (lineup, playstyle, set-piece takers)
- Squad management (rotation, training, youth promotion)
- Transfers (shortlist, contract responses, bid updates)
- Board / press (concerns, press conferences, sponsor requests)
- Tutorial / hints (during arc weeks 1-4)
- Returning user recap (§7)

## 5. Assistant Manager character + UX

### 5.1 Character

- Name: configurable. Default "Alex" (gender-neutral, works in DE +
  EN). Locale-default variants ("Felix" / "Sam" / "Jordan").
- Portrait: 3-5 selectable presets + "No portrait" option.
- Configurable in Settings → Assistant.

### 5.2 Voice channels

Voice consistency required across:

- Inbox messages (primary)
- In-context tooltips / coach marks
- Match commentary hints (tagged `[Assistant]`)
- "Ask Assistant" button responses

### 5.3 "Ask Assistant" sticky button

Persistent FAB on Home, Match, Tactics, Training, Transfers screens.
Tap opens bottom sheet with:

- Quick help (Explain this screen / Suggested actions)
- Suggested questions (context-aware)
- "Do something for me" (Easy / Normal only)

### 5.4 Per-difficulty intensity

| Difficulty | Assistant behaviour |
|---|---|
| Easy | Proactive — auto-surface suggestions in feed cards; can auto-complete low-impact with one-tap |
| Normal | Suggestive — no auto-complete; standard coach marks on new screens |
| Hard | Sparse — minimal coach marks; rarely interrupts in-match; Ask Assistant focused on analysis |
| Sim | Silent — no in-match interventions; post-match analysis only |

User override in Settings → Assistance:

- `Coaching intensity`: Full / Standard / Minimal
- `Allow assistant to auto-handle minor tasks` (Easy / Normal only)

## 6. Tutorial overlay patterns

| Pattern | Use case | Frequency |
|---|---|---|
| Spotlight overlay | Absolutely critical FTUE actions | 3-4 max total |
| Coach mark | First-visit on new screens | Max 2-3 per screen, sequential |
| Hint chip | Optional depth suggestions | Subtle; auto-hide after 2 dismissals |
| Modal full-screen | Complex concepts (tactics basics, transfers basics) | 1-2 per major system; re-accessible via Help |

Coach mark accessibility: focus trapped + ESC to close + "Skip tips
for this screen" as first focusable element.

## 7. Returning-user recap

Triggered when user opens app after ≥ 7 in-game days OR ≥ 14 real
days absent.

- Auto-shown top feed-card on first open
- 3-4 bullet summary
- "Review key events" → timeline view with deep-link buttons
- "Skip for now"
- Soft re-onboarding hint for very-long absences (≥ 30 real days):
  "Need a refresher? Tactics quick-tour: 2 min."

## 8. Achievement celebrations

Subtle, non-patronising milestones:

| Milestone | Treatment |
|---|---|
| First match played | None (no celebration) |
| First match won | Banner + tiny confetti (disabled with reduced-motion) |
| First transfer signed | Player reveal card + "Add to starting XI?" follow-up |
| First cup victory | Dedicated screen + trophy art (2-3s auto-play) + forward-looking choice |
| First promotion | Same as cup; next-season expectations escalated |
| First autosave | One-time Assistant inbox message |

Each celebration has "Don't show this type again" overflow option.

## 9. PWA install prompt

Per D9 + this gap. Triggered after:

- `sessions >= 3`
- 1 clear success (first match win OR first transfer OR first
  objective ticked)
- `total_playtime > 20 min` OR `current_session > 2 min`

Placement: after closing a positive-result screen (NOT session
start) as bottom sheet.

Platform handling:

- Chrome / Edge Android: native `beforeinstallprompt` event.
- iOS Safari: custom 3-step Add-to-Home-Screen walkthrough.

Snooze policy: 7d / 5 sessions on explicit dismiss; 3 sessions on
ignore; max 5 lifetime prompts.

## 10. Veteran skip + safety net

Veteran path triggers modal confirmation:

- "Give me the tour (recommended)"
- "Skip tutorial, I'll find my way"

If skipped:

- Full-screen overlays + coach marks suppressed.
- Micro-tooltips (small "?" chips) still appear on first visit.
- Inbox tutorial arc still runs but with shorter copy + skip-ahead
  links.
- "Ask Assistant" button still present.

Safety net:

- Settings → Assistance: "Tutorial & tips" toggle (Off / Essential /
  Full) + "Reset first-time tips" button.
- Auto-detection: if user loses 5+ matches in a row on Easy OR
  ignores 10+ feed-card CTAs, Assistant sends optional inbox
  message: "Tough run? Want more guidance?".

## 11. Accessibility (WCAG 2.2 AA + BITV 2.0)

- Onboarding screens as linear semantic pages (h1-h3), not modal-
  only.
- Coach marks: focus trap + ESC close + Tab-reachable "Skip" first.
- `prefers-reduced-motion` honoured + in-game "Limit animations"
  toggle.
- Redundant encodings (colour + icon + pattern); WCAG 4.5:1 / 3:1
  contrast.
- Inbox "Read aloud" via Web Speech API; user-controlled (not
  auto-play).
- One-handed mode: large bottom-aligned primary actions for halftime
  panic.
- Voice-control-friendly labels (text + icon; never icon-only for
  critical actions).
- Touch targets 44 × 44 px enforced per D9.

## 12. Autosave UX

Autosave on:

- Completion of any match
- End of in-game day
- Critical operations (transfer / contract / financial)

Signalling: subtle "Game saved" toast (2s fade); persistent "Last
autosave" indicator in Settings → Account.

First autosave triggers single Assistant inbox message explaining
the system.

## 13. Onboarding-state schema

Stored in IndexedDB under `onboarding_state` object store, keyed by
`save_id`. Full schema:
[[../60-Research/onboarding-strategy]] §15.

Key fields:

- `experience_level` (newbie / bit / veteran)
- `initial_tier` + `initial_difficulty` + `initial_mode`
- `tutorial_arc_status` (current message, completed, completed_at)
- `screen_tips_seen` (per-screen flags)
- `pwa_install` (eligibility, prompt count, dismissed_until,
  installed)
- `assistance` (coaching_intensity, auto_handle, assistant name +
  portrait)
- `recap_state` (last session end, recap shown)
- `celebrations_shown` (per-milestone flags)

## 14. Open follow-ups (deferred to later gaps)

- **A8 ADR-0008 Mobile-first UI**: absorbs feed-card + coach mark +
  halftime modal patterns.
- **D15 Narrative event content & authoring pipeline**: tutorial arc
  copy + reactive variants + supporting cast messages.
- **D10 i18n + copy tone**: full DE translation of tutorial arc.
- **E22 Localization workflow**: 80-120 inbox templates × DE + EN.
- **K1 Player onboarding docs**: external help-centre content
  referenced from inbox CTAs.
- **K3 Tutorial scripts**: full body copy for the 12-message arc.
