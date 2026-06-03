---
title: "RAW — In-match controls UX across mobile football-management games"
status: raw
tags: [research, raw, perplexity, match, ui-ux, mobile, controls, fmx-100]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../in-match-controls-and-presentation-2026-06-03]]
---

# RAW Perplexity capture — In-match controls UX (FMX-100)

> Unprocessed transcript. Synthesised into
> [[../in-match-controls-and-presentation-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar). Citations are the model's own.

## Prompt

System: senior game-design + UX researcher; concrete, cite specific games/years,
focus on mobile (touch, one-handed); prefer 2023–2026 sources.

User: comparative analysis of how existing football-management games handle
LIVE-MATCH controls on mobile for a mobile-first PWA (one-handed/thumb-zone),
Anstoss/FM style — covering (1) halftime controls, (2) in-match subs / on-the-fly
tactics / shouts / formation, (3) match speed & pause, (4) one-handed thumb-zone
HUD layout best practices, (5) common player complaints + best-reviewed solutions;
ending with a best-practice recommendation set for an MVP that ships ONE match
interaction tier first.

## Response

### 1. Halftime controls

- **FM Mobile 2024/2025 & FM Touch:** halftime = a summary panel (score, xG, key
  stats, player condition/ratings) + buttons for Team Talk/Shouts, Tactics,
  Continue. Touch leans closer to PC (more stats, links to Tactics / Subs / Set
  Pieces / Opposition Instructions). Core actions = 1–2 primary (Continue, Team
  Talk) + 3–5 secondary (Tactics, Subs, Analysis, Opposition Instructions). On
  mobile, Continue is a large bottom-right (thumb-zone) button. No countdown —
  halftime is a hard pause; time resumes on Continue. Pressure communicated via
  commentary/colour, not timed UI.
- **Top Eleven:** halftime shows score + quick stats and a team screen to change
  formation (drag), adjust mentality (defensive/balanced/attacking) and apply
  "bonuses" (pressing/attack/possession). Match pauses between halves, no time
  pressure. Big touch targets.
- **Soccer Manager 2025/2026:** central 2D/3D match view + bottom controls bar
  (tactics, subs, speed). Halftime = summary overlay; tap into existing Tactics/
  Team screens. Encourages reusing the existing tactical view, not a separate
  micro-mode.
- **Club Soccer Director & similar:** summary overlay + three core actions
  (Continue, Tactics, Subs); lower-budget UI, vertical list/tabs. Works = low
  cognitive load; fails = no hierarchy, easy to skip tactical opportunities.

### 2. In-match controls during live play

- **Substitutions:** FM = tap Tactics/Subs → tap on-pitch player or list → pick
  replacement from bench → Confirm; a pending icon shows until ball out of play,
  then the sub completes. Multiple subs queued in one visit (up to competition
  rules). Always a confirm step. Top Eleven = tap player → tap bench → instant/
  confirm swap; multiple swaps possible. Soccer Manager = bottom bar → team screen
  → tap/tap/confirm. Patterns that work: **queue subs in one visit**, clear
  **pending state**, drag-and-drop is well understood.
- **On-the-fly tactics:** FM Mobile has tactical presets (Gegenpress, Tiki-Taka)
  and quick mentality presets (Defensive→Very Attacking); deep settings require
  the Tactics screen, not HUD micro-controls mid-play. Top Eleven = big preset
  buttons + a few binary switches (high press, counter). Soccer Manager = 3–5
  high-impact toggles on the HUD; granular options deeper. Works: **preset + 1–2
  global sliders** beats exposing the full matrix during play; deep tuning done
  pre-match/halftime.
- **Shouts / touchline:** FM Mobile simplifies PC shouts (Encourage/Praise/Demand
  More) with mood feedback, hidden cooldowns. Top Eleven uses "bonuses" as
  persistent shouts limited by energy + cooldowns (can't spam). Others use single-
  tap Motivate/Focus/Time-Wasting with internal cooldowns. Works: **limit to 3–5
  shout types**, treat like cooldown abilities (clear available/used/refreshing
  state), one-tap, avoid nested popups.
- **Formation changes:** FM = tactics screen (drag on a pitch map or formation
  dropdown). Top Eleven = drag players, legality-checked. Soccer Manager = preset
  dropdown + some drag. Works: formation change is infrequent → fine one level
  deep (Tactics sheet); drag is more discoverable but needs a visible label.

### 3. Match speed & pause

- **Speed:** FM Mobile = discrete steps (Slow/Normal/Fast/Very Fast); no
  continuous slider. Top Eleven = 1x/2x (some 3x). Soccer Manager = 3–4 discrete
  buttons. Works: **discrete speeds (3–4 levels)** are more readable and less
  error-prone than a slider on small screens.
- **Pause:** FM Mobile/Touch = pause at will any time + auto-pause at key events
  (goals, reds, halftime, injuries/pens). Top Eleven = real-time bursts; opening
  the tactics screen acts as a soft pause. Soccer Manager = manual pause any time
  + auto-pauses for big events.
- **Key moments / commentary-only:** FM = Highlights mode + Commentary-only (text
  feed + optional 2D highlights). Top Eleven = highlight snippets + commentary, no
  full minute-by-minute. Many lighter managers = "instant/quick result" skip +
  "key chances only". For mobile, **key-moments/highlights is the default**; full
  matches are rare; commentary-only suits background play.

### 4. One-handed / thumb-zone HUD best practices

- **Placement:** core controls in the bottom half (bottom-right for right-handed):
  bottom-centre/right = speed/pause/play; bottom clusters = Tactics/Subs/Shouts.
  Top = match view + commentary; bottom = controls + scoreline/time.
- **Overlay vs bottom sheet:** small persistent HUD (bottom bar) + large modal/
  bottom-sheet overlays for tactics/subs/formation. Bottom sheet ideal for
  one-handed (slides up, keeps context, thumb reach).
- **Avoid accidental taps:** keep destructive actions (instant result, resign,
  exit) far from routine controls; two-step confirm (tap player → tap bench →
  swap preview + confirm); don't put speed/pause in the same cluster as shouts.
- **Touch targets:** min 44×44 pt (Apple) / 48×48 dp (Android); group 3–5
  horizontal buttons with icons + labels; for drag, ≥7–9 mm avatars + snap zones.

### 5. Common complaints & best-reviewed solutions

- **Complaints:** too fiddly / too many taps; accidental subs/tactical changes;
  hard to read state (no pending indication; unclear shout/bonus duration);
  overwhelming halftime screens; "shouts/bonuses do nothing"; tactical changes not
  reflected in commentary.
- **Solutions:** surface a small "live kit" (4–6 things: mentality, subs, maybe
  pressing/tempo, 2–3 shouts); strong feedback loops (banner + commentary line on
  shout/tactic change; sub commentary); use halftime + key events as the main
  decision beats; simplify rather than scale down PC UI.

### Synthesised best-practice for an MVP (one interaction tier)

- **Live-control kit:** 3–4 mentality presets; 3–5 queued subs; formation swap
  among 3–4 pre-saved shapes (not free editing); one shout system (≈3 types) on
  cooldown with a ring; pause + 3 speeds (1x/2x/3x); optional Key-Highlights vs
  Commentary-Only toggle.
- **Halftime:** single bottom sheet that pauses time; score + short summary line;
  player list with condition/rating; bottom thumb-zone actions with a primary
  "Start Second Half" + ≤5–6 secondary buttons; no time pressure.
- **HUD:** single bottom bar + optional floating shout button; pause/speed bottom-
  left; game-plan bottom-centre; Tactics/Subs sheet bottom-right; 48dp+ targets,
  spaced.
- **Subs flow:** Tactics/Subs sheet → tap starter → tap bench → pending swap +
  Confirm → pending badge ("will occur when ball is out of play"); multiple queued
  before Confirm.
- **Feedback:** overlay + commentary line on every game-plan/shout/sub change.
- **Scope discipline:** ≤~6 HUD controls; no per-player instructions mid-match; one
  consistent entry point for depth.

Citations: [1] youtube 5XfyCdtTamI · [2] play.google soccermanager2025 ·
[3] apps.apple FM26 Mobile · [4] youtube 4dDDrGiTADU · [5] youtube Q0lpl23rqkA
