---
title: "RAW — WCAG 2.2 AA + reduced-motion for a live match HUD"
status: raw
tags: [research, raw, perplexity, match, accessibility, wcag, reduced-motion, fmx-100]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../in-match-controls-and-presentation-2026-06-03]]
---

# RAW Perplexity capture — Live-match accessibility (FMX-100)

> Unprocessed transcript. Synthesised into
> [[../in-match-controls-and-presentation-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar).

## Prompt

System: accessibility (WCAG 2.2) + inclusive-game-design expert; cite SC by number;
address real-time/animated game UI.

User: specifying a live football-match controls UX for a mobile PWA; need WCAG 2.2
AA + reduced-motion guidance for a time-based animated game surface — (1)
prefers-reduced-motion for an animated 2D match canvas + modals, (2) most relevant
WCAG 2.2 SC for a real-time HUD + halftime modal (target size 2.5.8, focus
appearance, dragging 2.5.7, timing-adjustable 2.2.1, animation-from-interactions
2.3.3), (3) is a continuously-advancing match clock a "time limit"?, (4) touch
target sizing + thumb-zone (24×24 vs 44×44), (5) screen-reader / non-visual path.
Give concrete, citable acceptance criteria.

## Response (headline)

> Treat the live match UI as real-time, time-based content where some timing is
> *essential*, but still respect reduced-motion + WCAG 2.2 AA as far as possible.

### 1. prefers-reduced-motion

- **Canvas (when reduce):** no camera pans/zooms/shakes; coarsen player animation
  to lower frame rate / discrete position jumps (≈4–8 updates/sec) or no smooth
  tweening; ball uses straight-line/short-eased motion, not bouncy high-freq
  tweens; remove decorative moving overlays (confetti, pulsing bg, particles) →
  static/fade. Safe to keep: opacity fades (150–250 ms), colour transitions, subtle
  scale ≤1.05x. Offer an explicit "Static view / Low motion" tactical-map mode
  (discrete positions, no auto-camera) — aligns with SC 2.3.3 control to turn off
  non-essential motion.
- **Modals/HUD (when reduce):** appear/disappear via opacity fade or instant
  show/hide, no large slide/spatial movement. Even without reduce: transitions
  ≤250 ms and movement ≤20–25% viewport (or fades). No motion-chained effects
  (background zoom+blur+parallax). Interaction-triggered non-essential animations
  must be suppressible via prefers-reduced-motion or an in-app "reduce animations"
  setting (SC 2.3.3).

### 2. Most relevant WCAG 2.2 SC

- **2.5.8 Target Size (Minimum) (AA):** tappable targets ≥ 24×24 CSS px (with
  listed exceptions). All HUD controls ≥24×24 hit area even if the icon is
  smaller; adjacent controls spaced so each keeps 24×24.
- **2.4.11 Focus Appearance (AA):** visible focus indicator (≥ a 1 CSS px border
  around the element, ≥3:1 contrast vs surroundings); logical focus order; modal
  opens → focus moves in, cycles within, returns to trigger on close.
- **2.5.7 Dragging Movements (AA):** any drag operation needs a non-drag
  alternative (tap / +/- buttons). Tap-only HUD controls satisfy this; essential
  drag (tactical lines) must be justified as essential or get an alternative.
- **2.2.1 Timing Adjustable (A):** time limits adjustable/extendable/disable-able,
  with a **real-time-event exception** ("timing is essential and no alternative is
  possible"). The live match clock/progression MAY be treated as a real-time event
  and exempt — but any UI timeouts (auto-hiding controls, modal auto-dismiss,
  session timeouts) must comply (extend/adjust/disable).
- **2.3.3 Animation from Interactions (AAA, recommended):** motion animation
  triggered by interaction must be disable-able unless essential; respect
  prefers-reduced-motion and/or an app toggle.

### 3. Is the match clock a "time limit"?

- SC 2.2.1 time limits = form timeouts / session expiry. A live match is a
  **real-time event** governed by external timing → commonly under the real-time-
  events exception (essential, can't be arbitrarily extended per user). Practical:
  the match clock is not a user time limit you must let everyone extend; just
  avoid adding extra app time limits unless they meet an exception.
- Well-designed games stay conformant via: (a) **per-user pause/resume** (DVR-like;
  stop local playback/HUD updates even if the event continues; on resume indicate
  "behind live" + allow jump to live) — this satisfies 2.2.1 for the UI experience;
  (b) **adjustable speed** where feasible (0.5×/1×/1.5× for replays/sim); (c)
  document the essential-timing exception while still offering replay-at-adjustable-
  speed, pause/resume, and textual summaries. As long as no arbitrary user-task time
  limits exist, conformant.

### 4. Touch target sizing & thumb reach

- AA minimum 24×24 CSS px (2.5.8). Better practice: 40–44 px (iOS 44×44 / Material
  48×48). ACs: **primary in-match actions** (pause, menu, camera) ≥40×40 (prefer
  44×44), placed in bottom 60% within thumb reach (bottom corners / centred bottom
  bar) for one-handed; **secondary controls** ≥24×24, spaced ≥8 px; clusters ≥8–10
  px gaps to reduce error rates.

### 5. Screen-reader / non-visual path

- The animated canvas is **decorative for assistive tech, not the accessible
  path**. Provide a DOM-based textual representation: score, teams, minute, half,
  possession, cards; a chronological **event log** ("45' – Goal – Team A – Player
  X"); key stats in semantic tables. ARIA live regions: `aria-live="polite"` for
  regular events, `assertive` only for critical (goal); short, non-spammy updates.
  Toggle for "live commentary announcements" (all / major / muted-but-logged) —
  aligns with 2.2.2 Pause/Stop/Hide. Landmarks/headings (Match status / Score /
  Live events / Team A stats / Team B stats). Modal focus handling (focus in,
  background inert, ESC returns focus). All HUD controls focusable + labelled
  (`aria-label`/visible text) + correct roles (`<button>`, `role="switch"`). Match
  clock text NOT announced every second — static, queryable on demand; optional
  periodic announcements (~every 5 min) only if opted in.

### Example acceptance-criteria snippets (model)

- Reduced-motion canvas: no pan/zoom/shake; discrete/low-freq player+ball updates;
  decorative particles → static/fade.
- Reduced-motion modals/HUD: opacity fade or instant show/hide; no slide/large
  spatial movement.
- Targets (2.5.8): all controls ≥24×24; primary ≥40×40 in thumb-reach.
- Dragging (2.5.7): every drag has a tap / +/- alternative.
- Timing (2.2.1): match clock = essential real-time event; no extra user-task time
  limits without extend/disable, unless under a WCAG exception.
- Animation (2.3.3): interaction-triggered motion suppressible via
  prefers-reduced-motion or a global "reduce animations" setting unless essential.
- Screen-reader: canvas decorative; score/time/events/stats as DOM text with
  headings, landmarks, live regions + verbosity control.

Citations: [1] a11y-collective wcag-animation · [2] aaardvark 2.3.3 · [3]
accessibilitycraft pause-stop-hide · [4] getstark animation-from-interactions ·
[5] boia prefers-reduced-motion · [6] w3.org WCAG21 animation-from-interactions ·
[7] knowbility wcag21 233 · [8] css-tricks accessible-web-animation.
