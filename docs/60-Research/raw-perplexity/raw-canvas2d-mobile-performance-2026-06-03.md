---
title: "RAW — Canvas-2D mobile performance + validation protocol (2026)"
status: raw
tags: [research, raw, perplexity, match, canvas, performance, offscreencanvas, pwa, fmx-100]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../in-match-controls-and-presentation-2026-06-03]]
---

# RAW Perplexity capture — Canvas-2D mobile performance (FMX-100)

> Unprocessed transcript. Synthesised into
> [[../in-match-controls-and-presentation-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar).

## Prompt

System: senior web-performance engineer, HTML5 Canvas games on mobile; current
(2024–2026), cite APIs + real benchmark guidance.

User: shipping a Canvas2D (not WebGL) live football-match renderer in a mobile PWA;
GSAP tweens STATE VALUES (not draw calls); rendering reads ephemeral frame
projections of an event log; heavy deterministic sim in a dedicated Worker. Tiers:
Floor (forced text&stats), Standard (2D 30–60fps, ≤1 heavy worker), Premium (2D
60fps); battery-saver forces 30fps. Need 2026 best practice on (1) Canvas2D perf
(rAF budgeting, layout thrash, DPR, 30fps), (2) OffscreenCanvas + render worker
(worth it? Safari/iOS status 2026), (3) measuring/validating fps + main-thread
budget on real devices, (4) battery-saver / prefers-reduced-motion, (5) graceful
degradation to text&stats (capability detection). Recommend main-thread-canvas vs
OffscreenCanvas-worker for MVP + a concrete validation protocol.

## Response (headline)

> **Keep rendering on the main thread for the MVP**, use a strict rAF budget
> (≤8 ms at 60 Hz, ≤16 ms at 30 Hz), and design a repeatable device test matrix
> that validates p95 frame time and INP under load on real phones. OffscreenCanvas
> is still not universally safe on iOS/Safari in 2026, so treat a render worker as
> a v2 optimization, not a launch requirement.

### 1. Canvas2D perf — rAF, layout, DPR, 30fps

- Single render entry point in one rAF; no nested timers/rAFs. Frame budget:
  60fps → 16.7 ms total / ~8–10 ms your code; 30fps → 33.3 ms / ~20–22 ms. Aim
  p95 render < half the frame so layout/GC spikes don't collapse the schedule.
- Simple FPS cap by comparing `dt` to `1000/fpsCap`; let GSAP own timing, use `dt`
  only for interpolation/metrics.
- **Zero DOM reads/writes per frame** (no getBoundingClientRect/offsetWidth inside
  rAF). Sync canvas size on debounced `resize` (~100 ms), not per-frame. Batch
  text/score DOM updates at ≤10 Hz and never read layout back.
- **DPR:** clamp `targetDpr = min(devicePixelRatio, 2)`; set
  `canvas.width = rect.width * targetDpr` + `ctx.setTransform(targetDpr,...)`.
  Floor = DPR 1 or text&stats; Standard = 1.5–2; Premium = up to native if budget
  holds. Only resize on first load / orientation / tier change.
- **Run 30fps** when: Standard-tier p95 frame time at 60 Hz > 10 ms during busy
  play, or regular long tasks >50 ms; thermal throttling / battery saver; sim
  worker + canvas pushes sustained CPU >60–70% on mid-range. Always rAF, never
  setInterval. 30fps is acceptable for a tactical football view (eased, stable
  motion; input latency not twitch-critical).

### 2. OffscreenCanvas + render worker (2026)

- **Chrome/Edge/Opera (Blink):** OffscreenCanvas 2D in workers supported/stable
  (`transferControlToOffscreen()`). **Firefox:** broadly usable by 2025–2026.
  **Safari/iOS:** partial and lagging — cannot assume 2D OffscreenCanvas in a
  worker is stable/performant on all iOS versions, nor that PWA add-to-home +
  OffscreenCanvas has no gotchas. Must feature-detect and fall back to main-thread
  Canvas2D on Safari.
- Worth moving off main thread when: heavy DOM/UI (not this case), or canvas
  drawing itself is the main-thread bottleneck (p95 draw > 12–15 ms at 60 Hz after
  optimizing), or main thread still overloaded after offloading sim, and you can
  tolerate Safari fallback. For this architecture (heavy sim worker + GSAP tweens +
  simple canvas), main-thread canvas is usually fine.
- Adding a render worker → sim worker + render worker + main thread (input/UI +
  message relay). Pros: freer main thread (better INP), render not blocked by
  other long tasks. Cons: message-passing overhead (send typed arrays/diffs not
  object graphs), two concurrent heavy workers (CPU/power/thermal on mid-range),
  mandatory Safari fallback, harder debugging.
- **MVP recommendation: main-thread Canvas2D**, sim in worker, with a clean
  `Renderer.render(state)` abstraction so rendering can move into an OffscreenCanvas
  worker in v2 (Chrome/Android first, feature-detected, Safari fallback). Only plan
  the render worker once profiling shows you're Canvas-bound at 60 Hz on Premium.

### 3. Measuring / validating fps + main-thread budget

- Tools: Chrome DevTools Performance (remote Android) + Web Vitals overlay (INP,
  long tasks); Safari Web Inspector Timelines (CPU, dropped frames); in-app HUD
  metrics (per-frame dt → instant FPS, p95 frame time, count of frames >16/33 ms);
  `PerformanceObserver` for `longtask`; INP via web-vitals (target <200 ms
  Standard, <100 ms Premium).
- Metrics/targets: p95 frame time <14 ms (60fps) / <28 ms (30fps), watch p99;
  frame-budget breaches (dt >25 ms @60 / >50 ms @30) target <1 per 10 s at peak;
  long tasks: no >100 ms during active play; INP p95 <200 ms; CPU <60–70% over
  10+ min to avoid throttling.
- Protocol: device matrix (Floor: 3–4 yr Android Snapdragon 6xx / iPhone 11–12
  mini; Standard: mid-range Android SD7xx/Dimensity / iPhone 13–14 / SE3; Premium:
  recent flagships). Scenarios (10–15 min each): idle/pre-match, normal play, peak
  play (counter-attack + overlays + camera pan), UI stress (toggling overlays /
  tab switches during match). For each tier+scenario: log in-app HUD 3–5 min +
  capture a 30–60 s DevTools trace (JS vs canvas vs layout, long tasks/GC); toggle
  60fps/battery-saver-off and 30fps/battery-saver-on; record p95 vs budget,
  visible stutter, surface temp over time.
- Pass criteria: Premium @60fps p95 ≤14 ms peak, no sustained CPU>70%/throttling;
  Standard 60fps else default 30fps (p95 ≤28 ms); Floor → text&stats if p95 >28 ms
  even at 30fps or frequent >100 ms long tasks or memory issues.

### 4. Battery-saver / prefers-reduced-motion

- Battery saver (user opt-in and/or OS hint): cap 30fps, lower DPR (1–1.5), reduce
  effects (fewer shadows/gradients/particles), simpler textures/transitions;
  optionally sub-sample the sim feed.
- `prefers-reduced-motion: reduce` (standard, widely supported via matchMedia):
  about motion discomfort — turn off non-essential animation (camera pans, smooth
  transitions), keep field/players relatively static (minimal UI tweening, step-
  based player updates), offer a one-click pure-stats mode. Combine: reduce-motion
  → default text&stats or low-motion field; battery-saver only → still animate at
  30fps lower fidelity.

### 5. Graceful degradation to text&stats (capability-based, not UA)

- Detect: Canvas2D availability (`getContext('2d')` + a test fillRect in try/catch);
  worker support (`!!window.Worker`); a tiny offscreen draw micro-benchmark
  (2000 clear+fillRect iterations → ms). Tier logic: no Canvas2D / no workers →
  floor; bench > 350 ms → floor; > 200 ms → standard; else premium (tune
  thresholds with real data). Behaviour: Floor = no canvas, show score/clock/
  events/stats + optional static pitch (SVG/PNG) + opt-in "try visual pitch"
  override; Standard = 30fps baseline, DPR 1.5–2, limited effects; Premium = 60fps,
  higher DPR, richer visuals. Detect once early, avoid flapping, allow settings
  override.

### MVP recommendation

- **Main-thread Canvas2D**, sim in a dedicated worker; `Renderer` interface
  abstracted for a future OffscreenCanvas/WebGL path. Floor → text&stats; Standard
  → 30fps default (DPR 1.5–2); Premium → 60fps (DPR 2–3 if p95 <14 ms), reduced-
  motion-aware. Ship sign-off only after the device-matrix protocol passes. Plan a
  v2 render worker only with evidence of main-thread Canvas2D being the Premium
  bottleneck (Chrome/Android first, Safari fallback).

Citations: [1–8] (GSAP canvas/game-UI articles + perf write-ups).
