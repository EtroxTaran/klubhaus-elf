---
title: In-Match Controls & Presentation — synthesis (FMX-100)
status: current
tags: [research, match, ui-ux, controls, determinism, canvas, performance, accessibility, fmx-100]
created: 2026-06-03
updated: 2026-06-03
type: research
related:
  - [[raw-perplexity/raw-in-match-controls-ux-2026-06-03]]
  - [[raw-perplexity/raw-deterministic-intervention-buffering-2026-06-03]]
  - [[raw-perplexity/raw-canvas2d-mobile-performance-2026-06-03]]
  - [[raw-perplexity/raw-match-ux-accessibility-wcag-2026-06-03]]
  - [[../50-Game-Design/GD-0025-in-match-controls]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]
  - [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/state-machines/match]]
  - [[performance-budgets]]
  - [[onboarding-strategy]]
  - [[determinism-and-replay]]
---

# In-Match Controls & Presentation — synthesis (FMX-100)

Grounds the FMX-100 decisions. Four raw Perplexity captures (2026-06-03):
[[raw-perplexity/raw-in-match-controls-ux-2026-06-03|games]] ·
[[raw-perplexity/raw-deterministic-intervention-buffering-2026-06-03|determinism]] ·
[[raw-perplexity/raw-canvas2d-mobile-performance-2026-06-03|perf]] ·
[[raw-perplexity/raw-match-ux-accessibility-wcag-2026-06-03|a11y]]. Library
currency: **GSAP 3.13.0** (latest stable; fully free incl. all plugins under
Webflow stewardship) verified via context7 `/websites/gsap_v3`.

## 1. What other games do (real-world + genre)

FM Mobile 26, FM Touch, Top Eleven, Soccer Manager 2025/26, Club Soccer Director,
all converge on the same shape on mobile:

- **Halftime = a hard-pause planning hub**, never timed. One large primary
  "Continue / Start Second Half" (bottom-right thumb zone) + 3–5 secondary actions
  (Tactics, Subs, Team Talk/Shouts, Analysis). Emotional pressure via copy/colour,
  not a countdown.
- **A thin "live kit"** during play, not the full desktop matrix: queued subs with
  a Confirm + a **pending badge** (applies when the ball is next out of play);
  **mentality/game-plan presets** (Defensive→All-Out) rather than live sliders;
  **3–5 shouts treated as cooldown abilities** with clear available/used/refreshing
  state; **formation swap among pre-saved shapes** (free drag pushed one level deep
  to a Tactics sheet); **3–4 discrete speeds**; free pause + auto-pause on key
  events. Deep tuning happens pre-match / at halftime.
- **Top complaints** to engineer against: too many taps / fiddliness; accidental
  subs/tactical changes; unreadable state (no pending indicator; unclear shout
  duration); overwhelming halftime screens; "shouts do nothing". Best-reviewed fix
  = small kit (4–6 live actions) + **strong feedback** (banner + commentary line on
  every change) + use halftime/key events as the main decision beats.

→ **MVP take:** ship ONE expressive-but-thin interaction tier; ≤~6 HUD controls;
one consistent entry point for depth; feedback on every accepted intervention.

## 2. Deterministic intervention buffering (engineering)

The football sim is deterministic (RNG seeded at `lineup_locked`; replay = seed +
ordered intervention events — [[../10-Architecture/state-machines/match]] §5;
[[determinism-and-replay]]). Real-time UI input must become *synchronous commands
at discrete points*, exactly as RTS lockstep / replay systems do:

- **Tick-aligned command queuing:** sample the current sim tick at UI-event time,
  map intent → a command, and schedule it for a **future tick/boundary computed
  purely from sim state** (never wall-clock). Replays feeding the same (tick,
  command) schedule reproduce the result.
- **Boundary model (recommended hybrid):** *light* commands (shout, mentality
  nudge) bind to the **next tick** for responsiveness; *heavy* commands (sub,
  formation, full tactic) bind to the **next semantic boundary** (dead-ball /
  stoppage), matching sport semantics and giving clean atomic, auditable updates
  ("at dead-ball 63:21, snapshot T1→T2"). This already aligns with
  [[../50-Game-Design/match-engine]] §4 (interventions queued + applied at
  dead-ball/halftime/phase transitions; past events immutable).
- **Tactics = immutable snapshot, swapped at boundary** (not live mutation): build
  a new `TacticSnapshot` and `ApplyTacticSnapshot(...)` at the next boundary; for
  any tick the tactics state is exactly "snapshot X". Replay-safe + auditable.
- **Pause = operational, NOT a replay event:** a wall-clock UI/FSM flag outside the
  seeded stream. Matches [[../10-Architecture/state-machines/match]] §3 ("Pause
  windows are operational timers… only accepted interventions become replay
  events") and the WCAG 2.2.1 real-time-event exception.
- **Speed = playback multiplier on ticks-per-second; fixed sim Δt is unchanged.**
  Changing Δt by speed would alter physics/AI and break determinism. Replays run at
  any speed (incl. single-step) with no effect on the tick/command sequence.
- **Late/illegal commands:** default = queue to the next valid boundary with a UI
  state (pending → scheduled → applied); deterministic reject for impossible
  commands (e.g. sub a sent-off player). Rejections logged separately, never affect
  sim state.

→ This is FMX-100's single-player control seam; the buffer/queue *state machine*
and the watch-party pause-vote belong to FMX-101 (G24), which builds on top.

## 3. Mobile Canvas-2D performance (2026)

- **Keep rendering on the main thread for MVP** (sim stays in its dedicated
  worker). OffscreenCanvas-in-worker 2D is **still unreliable on iOS/Safari in
  2026**, so a render worker is a profiled v2, not a launch requirement — which is
  exactly the posture ADR-0008 D3 already took ("OffscreenCanvas main-thread at
  MVP"). Keep the `MatchRenderer` interface clean so the worker path can land later
  behind feature detection + a Safari fallback.
- **rAF discipline:** one render entry point; let GSAP own timing; **zero DOM
  reads/writes per frame**; clamp `devicePixelRatio` (≤2 Standard); resize only on
  load/orientation/tier change. Budgets: 60fps → p95 frame < 14 ms; 30fps → < 28 ms.
- **Validation protocol** (device matrix Floor/Standard/Premium × scenarios
  idle/normal/peak/UI-stress, 10–15 min each): in-app HUD (p95 frame time, budget
  breaches, long tasks via `PerformanceObserver`, INP) + DevTools/Safari traces.
  Pass: Premium 60fps p95 ≤14 ms no throttling; Standard 60fps else default 30fps
  (p95 ≤28 ms); **Floor → forced text&stats** (per [[performance-budgets]]).
- **Battery-saver → 30fps + lower DPR/effects; `prefers-reduced-motion` → discrete
  position updates + fades, no pans/zoom.** Degradation to text&stats is
  **capability-based** (Canvas2D + worker probe + tiny draw micro-benchmark), not
  UA sniffing.

## 4. Accessibility (WCAG 2.2 AA)

- The **animated canvas is decorative for assistive tech; text&stats is the
  accessible path** (DOM score/clock/event-log + stats tables + ARIA-live: polite
  for routine, assertive only for goals; verbosity toggle; clock not announced
  per-second).
- The **match clock is an essential real-time event** (2.2.1 exception) *because* a
  per-user pause exists (D2). No extra user-task time limits without extend/disable.
- **Targets:** ≥24×24 CSS px (2.5.8); primary controls ≥44×44 in the bottom thumb
  zone; ≥8 px spacing. **Tap alternatives** to any drag (2.5.7). **Focus
  appearance** (2.4.11) + modal focus-trap (focus in, background inert, ESC returns
  focus). Interaction-triggered motion suppressible (2.3.3 via reduced-motion /
  setting).

## 5. Decisions taken (Nico, 2026-06-03; ask-first gate)

| # | Decision | Choice |
|---|---|---|
| D1 | Intervention model | **Hybrid + immutable snapshot** (light=next tick, heavy=next semantic boundary) |
| D2 | Player pause | **Operational, free** (outside the seeded stream) |
| D3 | Render thread (MVP) | **Main-thread Canvas2D** (worker path is profiled v2) |
| D4 | MVP control kit | **Full kit** — subs + mentality preset + formation-swap + **3 shouts** + 3 speeds + pause |

D4 ships shouts, so [[../50-Game-Design/GD-0025-in-match-controls]] defines a
deterministic **shout-effect contract** with **provisional, playtest-tunable
magnitudes** (values not locked from intuition — FMX-52 calibration, GD-0019
precedent). Architecture seam → [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]].

Residual finer decisions (deferred as proposed D-questions in GD-0025/ADR-0072):
exact halftime action list, speed-step count (3 vs 4), shout cooldown length +
effect magnitudes, max queued subs / competition-rule coupling.

## 6. Known limitation

The "**measured** Canvas-2D fps on real devices" FMX-100 acceptance criterion
cannot be satisfied in this no-code phase — there is no renderer to measure. FMX-100
delivers the **validation protocol + pass-criteria**; the on-device measurement is a
**follow-up tied to the first Canvas-2D match prototype** (tracked, not silently
unmet).
