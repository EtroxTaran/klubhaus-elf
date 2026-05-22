---
title: Performance Budgets — Device Matrix, CWV Targets, CI Strategy
status: current
binding: true
tags: [research, performance, mobile, pwa, ci, web-vitals, lighthouse, budgets]
created: 2026-05-17
updated: 2026-05-22
type: research
related: [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0003-match-engine]], [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]], [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]], [[../10-Architecture/08-Crosscutting]], [[match-engine-simulation-model]], [[determinism-and-replay]], [[presentation-renderer-strategy]], [[../50-Game-Design/match-engine]], [[../50-Game-Design/progressive-disclosure-ui]]
---

# Performance Budgets — Device Matrix, CWV Targets, CI Strategy

> Gap D9 of [[wave-3-gap-analysis]]. Locks the device matrix, per-subsystem
> performance budgets, Core Web Vitals product targets, JS bundle budgets,
> match render-mode policy, world-size presets, and the CI perf-gating
> strategy for a 2026 offline-first PWA football manager.

## 1. Context and inputs

This note is mostly assembly + new policy on top of decisions already
locked elsewhere:

- **Match engine** (D1, [[match-engine-simulation-model]]): ≤ 50 ms /
  match in Web Worker on 2022 mid-range Android; soft alert 30-40 ms;
  AI-vs-AI batch ≤ 30 ms (no narrative); heavy-scenario CI perf gate
  already specified.
- **Runtime strategy** ([[match-engine-runtime-strategy]]): TypeScript MVP
  engine with a post-MVP polyglot/Rust extraction gate, plus explicit match
  quality profiles.
- **Storage** (A2, [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]):
  ~300 MB soft cap; warn at 70 %; persistent storage requested.
- **Determinism** (D8, [[determinism-and-replay]]): Chromium-only CI
  determinism gate at MVP; WebKit + Firefox in Phase-2 hardening.
- **Match engine package** (A3, [[../10-Architecture/09-Decisions/ADR-0003-match-engine]]):
  framework-agnostic `packages/match-engine/`; Worker bridge contract;
  ~80-100 KB minified canonical data bundle.
- **arc42 §Performance** ([[../10-Architecture/08-Crosscutting]]):
  placeholder "Lighthouse mobile ≥ 90 until D9 defines the full device
  matrix"; explicit pointer that D9 owns the device matrix + match-engine
  benchmark budgets.

What's new in this note: the device matrix itself, the CWV product
targets, the JS/CSS/HTML/font/image budgets, the memory budgets, the
test-rig strategy, world-size presets, and the match render-mode policy.

## 2. Comparative analysis — how other manager games handle perf

A comparative table grounded in product teardowns, dev interviews, and
support documentation. Used to extract the techniques worth adopting.

| Game | Platform | Install | Match render | Sim location | Save | Low-end rep |
|---|---|---|---|---|---|---|
| **FM Mobile / Touch** (SI) | Native iOS + Android (C++ core) | 1.2-1.5 GB initial; 2-4 GB w/ leagues | 2D events @ ~10-20 Hz, optional 3D | On-device | Compressed binary (.fmf), 10-150 MB | Good but UI overhead is the #1 bottleneck (FM26 community patch shows up to 250 % UI speedup) |
| **Top Eleven** (Nordeus) | Native + web | 180-250 MB | 2D w/ low-poly icons @ 30 fps | **Server-side** | Server | Famous for ultra-low-end support (1-2 GB Android) |
| **Online Soccer Manager** (Gamebasics) | Web + thin native wrappers | 80-150 MB | Light 2D viz (cosmetic) | **Server-side, turn-based** | Server | Excellent — text-driven UI runs anywhere |
| **Soccer Manager 24/25** (SM Studios) | Native (Unity) | 500 MB-1.5 GB | Full 3D @ 30 fps | On-device | Binary 5-20 MB | Mixed — Unity 3D is GPU-heavy; battery drain 15-25 % / h |
| **Hattrick** (Extralives) | Web only | ~hundreds KB | Text + light event feed | **Server-side, weekly** | Server | Runs on virtually anything |
| **Striker Manager / Manager Zone** | Web | A few MB JS/CSS | Text or simple 2D viewer | Server | Server | Lightweight by design |
| **EA SPORTS FC Mobile (Manager Mode)** | Native (Frostbite-derived) | 2-4 GB | Full 3D | On-device | Native | Throttles on Snapdragon 6-class; uses dynamic resolution |
| **Championship Manager Mobile** (legacy) | Native iOS/Android | 200-400 MB | 2D events | On-device | Binary 5-20 MB | Targeted low-end at the time |

### 2.1 The two architectures

The market splits cleanly into:

- **Heavy "simulation-first"** (FM Mobile, SM24, FC Mobile Manager Mode):
  larger installs (≥ 1 GB), heavier CPU, more thermals; rely on
  graphics-quality tiers, resolution scaling, and DB-size sliders.
- **Lightweight "service-first" or turn-based** (Top Eleven, OSM,
  Hattrick, Striker Manager, ManagerZone): minimal client sim;
  text/2D-only views; small bundles; works on anything.

We're forced into local sim (offline-first), but we can borrow the
**lightweight client philosophy** because:

- Non-interactive batch/replay paths can run **to completion in a Web Worker
  before playback starts** (per A3 + D1). Interactive human matches may buffer
  deterministic chunks so substitutions and tactical changes can affect the
  remaining match.
- This makes the on-device experience structurally similar to a
  Hattrick/OSM thin client: the heavy work is "remote" (in the Worker)
  and the UI just renders pre-computed events.

### 2.2 Techniques we adopt

Distilled from the comparative analysis, ranked by impact for low-end
devices (per the 2026 Perplexity research synthesis):

| # | Technique | Source | Adoption |
|---:|---|---|---|
| 1 | **Discrete-event sim, not frame-based physics** | FM Mobile, OSM, Hattrick, Champ Man | **Already locked** in D1 (per-event tick) |
| 2 | **Text-only match mode as first-class** | OSM, Hattrick, Top Eleven, FM "extended" mode | **Locked in §6** below |
| 3 | **Configurable database size (small/medium/large world)** | FM Mobile's #1 perf lever | **Locked in §7** below |
| 4 | **Compact binary saves in IndexedDB** | FM, Champ Man | **Already locked** in A5 (gzip + AES-GCM envelope) |
| 5 | **Virtualized lists, fixed-height rows, incremental DOM patches; minimal heavy CSS** | FM26 UI Speed Patch lesson | **Locked in §5.4** below |
| 6 | **Graphics scalability + low-spec mode** | FM, SM24, FC Mobile | **Locked in §6 + §8** (battery-saver mode, low-spec auto-detect) |
| 7 | **Small assets; lazy-load + LRU cache eviction** | Top Eleven, FC Mobile | **Locked in §5.6 + §5.7** |
| 8 | **Throttle heavy computation; batch + yield** | FM "processing" screens, idle scheduling | **Locked in §4** via main-thread budget |
| 9 | **Battery-saver / FPS-cap / reduced-motion toggle** | SI's own recommendations; `prefers-reduced-motion` | **Locked in §8** |
| 10 | **Incremental updates, never full recomputation per tick** | All scalable managers | **Already locked** in match engine design (event-based UI updates) |

### 2.3 Our unique style

Where we differ from every game in the table:

- **Offline-first PWA, not native or thin web** — no native shell at
  MVP; everything must fit Workbox 7 + Service Worker + IndexedDB +
  Web Worker on a single Origin.
- **Deterministic + reproducible** (per D8) — same `(engine_version,
  seeds, quality_profile, lineups, tactics)` → byte-identical event log.
  No competitor in the table guarantees this; it's our primary technical
  differentiator and enables:
  - Splitting non-interactive fixtures into **simulate-to-completion →
    playback** phases, while interactive matches consume deterministic
    buffered chunks.
  - Async multiplayer with hard-reject offline conflict resolution
    (per B2/ADR-0011), which constrains storage but not perf budgets.
- **Workbox 7 + `injectManifest`** (per A2) — service worker is our
  budgeted asset just like any JS chunk.
- **TanStack Start file-based routing** — natural route-chunk
  splitting; per-route bundle budgets are enforceable at the framework
  layer.
- **2D canvas as the primary match render** - explicit product decision
  2026-05-17: no interactive or authoritative browser 3D match view is on the
  roadmap. Refined by
  [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
  on 2026-05-22: optional post-MVP 2.5D/3D presentation scenes are separate,
  lazy-loaded renderer modules with 2D/still/text fallbacks.

### 2.4 Match quality profiles

Performance budgets are enforced per profile, not just per "match".

| Profile | Budget target | Main risk |
|---|---:|---|
| `competitive-full` | ≤ 50 ms full sim; full event + spatial output | Event/spatial output volume |
| `interactive-standard` | ≤ 50 ms full sim; reduced spatial output | Too much lookahead during live interventions |
| `background-detailed` | ≤ 30 ms; summary + key stats/selected events | Promoting too many AI fixtures |
| `background-fast` | Batch throughput first; no full event log | Plausibility drift if overused in active leagues |

Matchday processing must prioritise profiles in this order:

1. human-involving and watched fixtures;
2. active league and direct rivals;
3. relevant cup/continental fixtures;
4. rest-world fixtures.

On Floor tier, all user-visible active matches default to Text & Stats and
background fixtures downgrade before the main thread blocks.

## 3. Device matrix

Four tiers; three are supported; one is explicitly off-target.

### 3.1 Tier definitions

| Tier | Android example | iOS example | RAM | OS | Browser | Policy |
|---|---|---|---|---|---|---|
| **Premium** | Galaxy S23/S24, Pixel 8/8a, OnePlus 12 | iPhone 13/14/15/16, iPad M1+ | 6-12 GB | Android 14+ / iOS 17+ | Chromium 120+ / Safari 17+ | Full features; richer animations; larger asset packs; 2D canvas match @ 60 fps |
| **Standard** (optimization target) | Galaxy A34/A54/A55, Pixel 7a, Redmi Note 12-13 5G, Moto G72 | iPhone 11/12/SE 2/SE 3 | 4-6 GB | Android 12+ / iOS 16+ | Chromium 100+ / Safari 16+ | Full features; tuned animations; 2D canvas match @ 30-60 fps; ≤ 1 heavy Worker |
| **Floor** (reduced features + warning) | Galaxy A12/A21s, Redmi 9/9A, Realme C2/C3 | iPhone XS / XR | 3 GB | Android 10+ / iOS 15+ | Chromium 90+ / Safari 15+ | **Text & Stats match mode forced**; smaller asset packs; Small world only; one-time "your device may be slow" banner |
| **Off-target** | Pre-2019 Android Go, 2 GB RAM, non-64-bit | iPhone 8/X and older | < 3 GB | Android < 10 / iOS < 15 | Chromium < 90 / Safari < 15 | Unsupported page; HTML fallback only |

### 3.2 Detection rules

Tier detection runs on app start before route hydration:

```ts
type DeviceTier = 'premium' | 'standard' | 'floor' | 'off-target'

interface DeviceTierSignals {
  deviceMemoryGb: number | null   // navigator.deviceMemory (Chromium)
  hardwareConcurrency: number     // navigator.hardwareConcurrency
  saveData: boolean               // navigator.connection?.saveData
  effectiveType: string | null    // navigator.connection?.effectiveType
  userAgentBrand: string          // UA-CH brand version
  prefersReducedMotion: boolean
  prefersReducedData: boolean
}
```

Decision rules:

1. If any **required PWA feature is missing** (Service Worker,
   IndexedDB 2, ES2020) → **Off-target**.
2. Else if `deviceMemory < 4` OR `hardwareConcurrency < 4` OR
   `saveData` OR `prefersReducedData` → **Floor**.
3. Else if `deviceMemory >= 6` AND `hardwareConcurrency >= 6` AND not
   throttled → **Premium**.
4. Else → **Standard** (default).

For iOS Safari (no `navigator.deviceMemory`), use a coarse heuristic:

- `userAgentBrand` indicates iOS 17+ → **Standard** baseline.
- iOS 15-16 → **Floor**.
- iOS < 15 → **Off-target**.

The detected tier is stored in `localStorage` and re-evaluated on every
fresh load. The user can manually downgrade (e.g. "force Floor mode for
battery saving") but cannot manually upgrade above the detected tier
(prevents broken experiences when the user picks Premium on a 3 GB
device).

### 3.3 Off-target page

Off-target devices get a clean HTML fallback page with:

- "Your device or browser is not supported" copy in DE + EN.
- A list of recommended browsers / OS upgrades.
- A "try anyway" escape hatch that drops the user into Floor mode
  with no warranty (handles legitimate edge cases).
- No JS bundle larger than 20 KB compressed; pure HTML+CSS where
  possible.

## 4. Core Web Vitals + Lighthouse targets

### 4.1 Web Vitals product targets (p75, mobile)

Tighter than the standard "Good" cutoffs to stay competitive:

| Metric | "Good" (2026) | Our target (p75 mobile) | Our target (p75 desktop) |
|---|---|---|---|
| **LCP** | ≤ 2.5 s | **≤ 2.0 s** | ≤ 1.5 s |
| **INP** | ≤ 200 ms | **≤ 120 ms** on primary flows | ≤ 100 ms |
| **CLS** | ≤ 0.1 | **≤ 0.05** | ≤ 0.05 |

Primary flows (must hit INP ≤ 120 ms): squad list, tactics editor,
matchday lobby, transfer screen, save/load.

CWV thresholds themselves are unchanged in 2026 since the 2024 INP
rollout; product targets above are our internal stretch goals.

### 4.2 Lighthouse Performance score

| Surface | Threshold | Block-deploy floor |
|---|---|---|
| Mobile (emulated Moto G Power, 4× CPU throttle, Slow 4G) | **≥ 90** | < 85 fails CI |
| Desktop | **≥ 95** | < 90 fails CI |

Lighthouse is a coarse synthetic gate; the real product KPIs are the
CWV p75 from RUM (telemetry per [[telemetry-privacy]] + ADR-0017).
Lighthouse is what gates the PR; CWV is what gates the release retro.

### 4.3 Field RUM CWV thresholds

Tracked via the `web-vitals` library and the same-origin telemetry
endpoint defined in [[../30-Implementation/client-telemetry]]:

- Alert if any of LCP / INP / CLS p75 (rolling 14-day) crosses our
  product target band on a primary flow.
- Page if any metric crosses the standard "Good" threshold (release
  regression).

## 5. Bundle + transfer budgets

All sizes are **post-gzip / brotli transfer**.

### 5.1 JS budgets

| Scope | Target | Hard cap (CI block) |
|---|---|---|
| Initial critical JS (app shell + first route) | **150-200 KB** | **250 KB** |
| Total JS loaded per session | **500-700 KB** | **1 MB** |
| Per-route lazy chunk (heavy: squads, matchday, transfer, league) | **80-100 KB** | **120 KB** |
| Per-route lazy chunk (small: settings, help, about) | **30-50 KB** | **60 KB** |
| Third-party JS on initial load | **≤ 50 KB total** | **80 KB** |
| Match engine package (`packages/match-engine/`) | **80-100 KB** (per A3) | **120 KB** |
| Service Worker JS (Workbox runtime + custom) | **30-40 KB main + ≤ 30 KB modules; total ≤ 80 KB** | **100 KB** |

Notes:

- The match engine bundle is loaded **lazily** as part of the matchday
  route, not on the initial route.
- Old engine versions (vendored per ADR-0003 for replay) are
  dynamic-imported only when a replay or AI-vs-AI re-sim demands them.
  They do **not** count against initial load.

### 5.2 CSS budgets

| Scope | Target |
|---|---|
| Critical inline CSS (above the fold) | ≤ 10-15 KB |
| Total CSS on initial load | ≤ 50 KB (max 80 KB) |
| Total CSS per session | ≤ 120 KB |

Tailwind purge + shadcn/ui generated primitives must keep us under
this. CSS-in-JS is forbidden (per stack baseline + perf).

### 5.3 HTML / fonts / images

| Asset | Target |
|---|---|
| Initial HTML response | ≤ 30 KB compressed (≤ 80 KB raw) |
| Web fonts (initial route) | ≤ 70-80 KB woff2 (max 120 KB); 1 primary family, 2 weights max |
| LCP image (if any) | ≤ 100-150 KB WebP/AVIF |
| Other images on initial route | ≤ 200 KB total |
| Match-mode canvas assets (pitch, badges) | Procedural / vector-first; raster ≤ 100 KB total |

Font loading rules:

- `font-display: swap` on all custom fonts.
- Preload **only** fonts used above the fold.
- No icon fonts; use inline SVG sprites or vector icons.

### 5.4 DOM + render budgets

Distilled from the FM26 UI Speed Patch lesson: UI overhead is the #1
perf killer in this genre.

- **All tables** (squads, league tables, fixtures, transfer lists)
  MUST be virtualized via TanStack Virtual.
  - Max simultaneously-rendered rows on mobile: **40-60**.
  - Fixed-height rows required (variable height kills virtualization).
- **DOM node count per route**: target ≤ **1500 nodes**, hard cap
  **3000**. Beyond this, layout cost dominates main-thread work on
  Floor tier.
- Avoid expensive CSS: heavy `box-shadow`, `backdrop-filter`,
  cross-axis gradients with > 3 stops, animated `filter` properties.
- Animations on Floor tier: disable all decorative transitions; honor
  `prefers-reduced-motion`.

### 5.5 PWA install footprint

| Scope | Target |
|---|---|
| Manifest + icons | ≤ 100 KB total |
| Service Worker JS (per 5.1) | ≤ 80 KB |
| App-shell first transfer | ≤ 400-500 KB |
| Initial precache (offline shell) | ≤ 3-5 MB |
| Total first-install download | ≤ 5 MB |

### 5.6 Service Worker performance

| Metric | Target |
|---|---|
| SW cold boot + first fetch overhead | ≤ 100-150 ms |
| SW warm request overhead | ≤ 30-50 ms vs direct network |
| Static asset cache hit ratio (after first session) | ≥ 95 % |
| Data / API cache hit ratio (stale-while-revalidate) | ≥ 80-90 % |

### 5.7 Asset strategy

Borrowed from Top Eleven / FC Mobile / Workbox best practices:

- **Core shell + base DB** kept in initial precache (≤ 5 MB).
- **Optional packs** lazy-loaded + cached with LRU eviction:
  - Country / league packs (fixtures, names lookups)
  - Community dataset packs (per ADR-0016)
  - Save replays from previous engine versions
- LRU eviction kicks in when `navigator.storage.estimate().usage`
  crosses 70 % of soft cap (per A2).

## 6. Match render-mode policy

**Hard constraint**: no interactive or authoritative browser 3D match view is
on the roadmap. This is a permanent product decision (Nico, 2026-05-17),
refined on 2026-05-22 by
[[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]] to
allow optional, post-MVP, non-authoritative 2.5D/3D presentation scenes outside
the match renderer.

> **Scope precised 2026-05-20 by
> [[../10-Architecture/09-Decisions/ADR-0029-3d-presentation-layer]].**
> The ban applies to the **live match render pipeline** (22 players,
> ball, referee, live camera). A 3D **Presentation Layer** for the
> isometric stadium / campus view, kuratierte Event-Cutscenes
> (walkout, trophy lift, goal celebration) and static backdrops is
> permitted under that ADR, gated by `SceneDescriptor` contract,
> floor-tier 2D fallback, OffscreenCanvas worker render, draw-call
> budget ≤ 150 and iOS context-loss layered recovery. The match
> renderer itself is governed by
> [[../10-Architecture/09-Decisions/ADR-0024-match-renderer-abstraction]]
> (Canvas 2D first behind
> [[../10-Architecture/09-Decisions/ADR-0026-match-frame-contract]]).
> [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]
> later removes PixiJS as a planned 2D match-surface upgrade.

Two match render modes:

### 6.1 Text & Stats mode (first-class)

- Renders match events from the event log as a scrolling DOM list,
  not a canvas.
- Update cadence: **1-2 Hz** during live playback; instantaneous on
  fast-forward.
- Side panel shows live stats (xG, possession, shots) updated every
  10-15 in-game minutes.
- Auto-default on **Floor** tier (forced).
- User-selectable on **Standard** and **Premium** tiers.
- Lightest possible render mode; cuts main-thread + GPU cost ~10×
  vs canvas mode.

### 6.2 2D canvas mode (primary, mandatory)

- Top-down 2D canvas using HTML Canvas 2D (NOT WebGL — no GPU
  shader budget).
- Frame rate caps:
  - Floor tier: not available (forced to Text mode).
  - Standard tier: 30 fps cap.
  - Premium tier: 60 fps cap.
  - Battery-saver mode (§8): forces 30 fps regardless of tier.
- Internal render resolution: capped at 720p logical pixels even on
  high-DPR devices (DPR clamp at 2.0 for the canvas surface).
- Assets: procedural where possible; pitch is CSS gradient + canvas
  drawing, not a raster image. Badges / kit colours from data, not
  bitmap.
- Match engine writes the full event log before canvas playback
  starts for non-interactive replay/batch paths. Interactive matches may
  consume buffered event chunks. Canvas only interpolates between committed
  events; it never blocks on simulation work.

### 6.3 Mode switching

- Setting is per-user, persisted to local DB.
- Default by tier on first match: Floor → Text, Standard → Canvas,
  Premium → Canvas.
- One-click toggle on the matchday lobby and inside the match HUD.

### 6.4 Optional presentation scenes

Curated stadium/campus, walk-in, trophy, celebration or selected highlight
scenes are governed by [[presentation-renderer-strategy]], not by this match
render-mode policy. They must:

- be post-MVP unless a later ADR explicitly changes scope;
- derive from committed event logs, venue read models or career facts;
- be lazy-loaded outside the initial app shell;
- be unavailable or replaced by 2D/still/text fallback on Floor tier;
- handle WebGL/WebGPU context loss and GPU memory pressure;
- never compute match outcomes, hidden scouting data, multiplayer authority or
  gameplay modifiers.

## 7. World-size presets

The biggest perf lever in the genre (proven by FM Mobile's
nation/league sliders).

| Preset | Active nations | Active leagues (top divisions) | Active players (approx) | Save size (est.) | IndexedDB delta | Default on tier |
|---|---|---|---|---|---|---|
| **Small** | 1 (Germany) | 2 (Bundesliga + 2. Liga) | ~700 | ~5 MB compressed | ~5 MB | **Floor** (forced); Standard / Premium opt-in |
| **Medium** | 3 (DE + EN + ES) | 6 | ~2 500 | ~15 MB compressed | ~15 MB | **Standard** default |
| **Large** | 8 (top European leagues) | 20 | ~7 500 | ~50 MB compressed | ~50 MB | **Premium** default; Standard opt-in with warning |

Notes:

- World size is chosen at New Save and is **immutable** for the
  lifetime of that save (changing world size mid-save would violate
  determinism per D8).
- Save-size targets above are pre-compression deltas; final encrypted
  saves (per A5) compress and encrypt the snapshot.
- Total IndexedDB usage for a Large save with 10 seasons of replays
  cached: ~150 MB (well within the ~300 MB soft cap from A2).
- Floor tier can technically open a Medium or Large save (e.g. user
  switched devices); the app warns and forces Text & Stats match mode.

## 8. Battery-saver + low-spec UX

Three explicit toggles (in addition to tier auto-detection):

### 8.1 Battery saver

User-toggleable from settings + auto-suggested on Floor tier:

- Forces 30 fps cap in canvas match mode.
- Disables decorative animations site-wide.
- Reduces auto-refresh polling on non-critical panels.
- Lowers worker priority + simulation chunk size during AI-vs-AI
  re-sim.

### 8.2 Reduced motion

Auto-honors `prefers-reduced-motion: reduce`:

- All CSS transitions disabled.
- No camera-pan animations in match canvas.
- Page transitions use immediate swap, not fade.

### 8.3 Data saver

Auto-honors `navigator.connection?.saveData` (Chromium) +
`prefers-reduced-data` (where supported):

- Skip non-essential image downloads.
- Skip optional community pack downloads.
- Use lower-resolution canvas pitch rendering.

## 9. Main-thread + worker budgets

### 9.1 Frame budget on Standard tier (Snapdragon 695 / A13)

60 fps target → 16.67 ms / frame.

Practical breakdown (p95 target):

| Budget slot | Target |
|---|---|
| React render + commit | ≤ 4-5 ms |
| App / game logic on main thread | ≤ 4-5 ms |
| Layout + paint + composite | ≤ 3-4 ms |
| GC + OS noise margin | ≤ 4-5 ms |
| **Total main-thread per frame (p95)** | **≤ 12 ms** |

Long-task threshold: no single main-thread task > **20-25 ms p95**
during gameplay; absolutely no task > **50 ms** on matchday hot path.

Hard rule: **no main-thread task > 50 ms during a 90-minute simulated
match playback.** If we breach this, the match must move further into
the Worker.

### 9.2 Worker budget

| Workload | Budget |
|---|---|
| Match simulation (full match, human-involving) | ≤ 50 ms hard / 30-40 ms soft alert (per D1) |
| Match simulation (AI vs AI, no narrative) | ≤ 30 ms (per D1) |
| Outbox replay (per A2) | ≤ 200 ms per batch |
| Save serialization (per A5) | ≤ 500 ms for a Large save |
| Save deserialization | ≤ 800 ms for a Large save |
| AI transfer-window batch | ≤ 100 ms per Worker tick; yield between ticks |

### 9.3 Sustained-compute thermal policy

For matches > 10 min wall-clock time (extra time, replay rewind, etc.):

- Worker compute capped at **30-40 %** average per big core.
- Use `requestIdleCallback` patterns between match simulations in
  AI-vs-AI batch.
- Detect frame drops / `performance.now()` drift as a proxy for thermal
  throttling; auto-engage battery-saver mode if drift > 20 %.

## 10. Memory budgets

### 10.1 JS heap

| Tier | Steady-state heap | Upper cap |
|---|---|---|
| Premium | ≤ 200 MB main + ≤ 100 MB workers | ≤ 300 MB main + ≤ 150 MB workers |
| Standard | ≤ 150 MB main + ≤ 80 MB workers | ≤ 200 MB main + ≤ 100 MB workers |
| Floor | ≤ 100 MB main + ≤ 50 MB workers | ≤ 150 MB main + ≤ 60 MB workers |

If `performance.memory.usedJSHeapSize` (Chromium) exceeds the
steady-state target for > 30 s, emit a warning via telemetry and
trigger an in-app prompt to "free memory" (close other matches,
clear caches).

### 10.2 IndexedDB / storage

Already locked in A2; restated for completeness:

| Scope | Target | Soft cap | Hard policy |
|---|---|---|---|
| Total per-origin storage | < 100 MB (Small save), < 200 MB (Large + replays) | 300 MB warning at 70 % | LRU eviction of optional packs + old replays |
| First-install precache | ≤ 5 MB | — | — |
| Save delta per save | Per §7 (5/15/50 MB) | — | Reject save commit if would push usage > 90 % |

## 11. Test rig + CI strategy

### 11.1 Three-phase plan

| Phase | When | Rig | Frequency | Cost |
|---|---|---|---|---|
| **Phase 1** | MVP | Emulated CI only (Lighthouse CI + Playwright mobile preset + 4× CPU throttle) on GitHub Actions; manual ad-hoc on 2-3 personal devices | Every PR | ~ 0 € |
| **Phase 2** | Post-MVP, before public launch | Add **LambdaTest** 1 parallel slot + nightly Playwright job on 2-3 representative real devices (Galaxy A-series + iPhone 11/SE) | Nightly | ~ 1.5 k €/yr |
| **Phase 3** | Only if Phase 2 proves insufficient | Build dedicated 5-device hardware rig (Pixel 7a + Galaxy A54 + Redmi Note 12 + iPhone SE 3 + iPhone XS + Mac mini host) | Continuous self-hosted | ~ 2.4 k € one-off, ~ 800 €/yr amortised |

Phase 1 is the **MVP gate**. Phases 2 and 3 are explicitly
out-of-scope at MVP and ride on F-track operations work.

### 11.2 Phase 1 CI gate (mandatory at MVP)

Every PR runs:

1. **Lighthouse CI** (`lhci autorun` with `--preset=mobile`):
   - Block PR if mobile Lighthouse Performance < **85**.
   - Warn if < **90**.
   - Strict assertions on LCP / INP / CLS per §4.1.
   - Configuration committed to `lighthouserc.json`.
2. **Playwright perf assertions**:
   - Web Vitals captured via injected `web-vitals` library; logged to
     test artefacts.
   - Offline-mode smoke tests (per ADR-0002): SW reach the offline
     shell within 2 s; IndexedDB-backed saves load.
   - Long-task assertions on matchday flow: no task > 50 ms during
     a representative match playback.
3. **Bundle size CI** (`size-limit` or equivalent):
   - Per-route chunk budgets per §5.1; PR fails if any chunk exceeds
     its hard cap.
4. **Match-engine perf gate** (per D1):
   - 10 canonical golden replays must run within the ≤ 50 ms budget
     on the CI runner (CI hardware = approximation of Standard tier).
5. **Storage assertion** (per A2):
   - First-install precache ≤ 5 MB; warn at 4 MB; block at 6 MB.

### 11.3 Phase 2 nightly job (post-MVP)

- LambdaTest 1 parallel slot (~ €99-125/month) running Playwright on:
  - Galaxy A54 / A34 (Standard tier representative).
  - Pixel 6a / 7a (Standard tier representative).
  - iPhone 11 / SE 3 (Standard tier iOS representative).
- Captures real-device Web Vitals; alerts on > 20 % regression vs
  rolling 7-day baseline.
- Runs only on `main` post-merge, not per PR (cost control).

### 11.4 Phase 3 hardware rig (optional, conditional)

Build only if:

- LambdaTest cost rises above €3k/year, OR
- Real-device flakiness materially hurts release cadence, OR
- We need iOS-specific deep tracing that LambdaTest doesn't expose.

Build estimate: €2.0-2.4k one-off (Pixel 7a + Galaxy A54 + Redmi Note 12
+ iPhone SE 3 + iPhone XS used/refurb + M2 Mac mini base + USB hub +
cabling). Amortised ~€800/year over 3 years. Maintenance: 1-2 h/week
rig babysitting.

### 11.5 Why not BrowserStack / Sauce / Firebase / AWS Device Farm?

- **BrowserStack**: €2-4k/year minimum; no native Lighthouse-as-a-service;
  Playwright works but real-device runs are slow + flaky for a per-PR
  gate. Acceptable but not best value at our scale.
- **Sauce Labs**: €5k+/year; enterprise-focused; overkill for an indie
  team.
- **Firebase Test Lab**: native-app-only; PWA support requires wrapping
  into a TWA. Wrong tool.
- **AWS Device Farm**: Selenium-first, Playwright support patchy.
  Possible but more integration work than LambdaTest.

LambdaTest is the right cloud option **if we need cloud**. Otherwise
emulated CI is sufficient at MVP.

## 12. Cheat sheet — single table

For copy-paste reference and future arc42 §Performance update.

| Area | Metric | Target | Hard cap / block |
|---|---|---|---|
| CWV | LCP p75 mobile | **≤ 2.0 s** | ≤ 2.5 s (Good) |
| CWV | INP p75 primary flows | **≤ 120 ms** | ≤ 200 ms (Good) |
| CWV | CLS p75 | **≤ 0.05** | ≤ 0.1 (Good) |
| Lighthouse | Mobile lab | **≥ 90** | < 85 fails CI |
| Lighthouse | Desktop lab | **≥ 95** | < 90 fails CI |
| JS | Initial critical | **≤ 200 KB** | ≤ 250 KB |
| JS | Total session | **≤ 700 KB** | ≤ 1 MB |
| JS | Per-route lazy (heavy) | **≤ 100 KB** | ≤ 120 KB |
| JS | Per-route lazy (small) | **≤ 50 KB** | ≤ 60 KB |
| JS | Third-party initial | **≤ 50 KB** | ≤ 80 KB |
| JS | Match engine package | **80-100 KB** | ≤ 120 KB |
| JS | Service Worker | **≤ 80 KB** | ≤ 100 KB |
| CSS | Critical inline | ≤ 10-15 KB | — |
| CSS | Initial | ≤ 50 KB | ≤ 80 KB |
| HTML | Initial | ≤ 30 KB | ≤ 80 KB raw |
| Fonts | Initial woff2 | ≤ 70-80 KB | ≤ 120 KB |
| Images | LCP image | ≤ 100-150 KB | — |
| Images | Other initial | ≤ 200 KB | — |
| DOM | Nodes per route | ≤ 1500 | ≤ 3000 |
| Frame | Main-thread per frame (p95) | ≤ 12 ms | ≤ 16 ms |
| Frame | Long-task threshold | None > 25 ms | None > 50 ms on matchday |
| Match engine | Sim time / match | ≤ 50 ms | ≤ 50 ms (per D1) |
| Match engine | AI-vs-AI batch | ≤ 30 ms | ≤ 30 ms (per D1) |
| Memory | Heap (Standard tier) | ≤ 150 MB main + ≤ 80 MB workers | ≤ 200 + ≤ 100 |
| Memory | Heap (Floor tier) | ≤ 100 MB main + ≤ 50 MB workers | ≤ 150 + ≤ 60 |
| Storage | First install | ≤ 5 MB | ≤ 6 MB |
| Storage | Total per origin | ≤ 200 MB | warn 70 % of 300 MB |
| SW | Static cache hit | ≥ 95 % | — |
| SW | Data cache hit (SWR) | ≥ 80-90 % | — |
| Battery | Drain per hour active | ≤ 5-7 % on Standard | — |
| Worker | CPU average per big core | ≤ 30-40 % sustained | — |

## 13. Open follow-ups

- **E11 Test Strategy** (gap E11) — incorporate the Phase 1 CI gate
  into the broader test pyramid; align with [[determinism-and-replay]]
  test rules.
- **E24 Match-engine benchmarking** — extend D1's perf gate with
  per-PR delta tracking (last-7-days baseline); pending E24 work.
- **C7 arc42 Performance chapter** — currently a placeholder; this
  doc supplies the data to fill it. Pending separate gap C7.
- **ADR-0008 Mobile-first UI** — currently a 10-line stub; should
  incorporate device matrix + virtualization rules + canvas-only
  match policy. Pending separate gap A8.

## Sources

- Perplexity Sonar research, 2026-05-17 (gap D9): CWV 2026 targets,
  Lighthouse scoring, JS bundle budgets, main-thread budgets, memory
  limits, SW boot times, frame budgets, battery / thermal targets.
- Perplexity Sonar research, 2026-05-17 (gap D9): Android + iOS device
  matrix; SoC sustained-throughput data; Samsung Internet + WebView
  rollout; storage quota behaviour; EU + global connectivity profile.
- Perplexity Sonar research, 2026-05-17 (gap D9): comparative test-rig
  analysis (BrowserStack, Sauce, LambdaTest, Firebase Test Lab, AWS
  Device Farm, self-hosted hardware, emulated CI).
- Perplexity Sonar research, 2026-05-17 (gap D9): comparative perf
  analysis of FM Mobile, Top Eleven, OSM, Soccer Manager 24/25,
  Hattrick, Striker Manager, ManagerZone, EA FC Mobile Manager Mode,
  FM Online (KR), Champ Man Mobile remakes.
- Web.dev — Core Web Vitals, INP, Performance Budgets (2024-2025).
- Addy Osmani — JavaScript Start-up Performance, "Cost of JavaScript".
- Chrome DevRel — Performance Budgets in Practice; Long Tasks API.
- Sports Interactive support docs — FM26 match engine perf
  recommendations.
- D9 Q&A with Nico (2026-05-17): all six recommendations accepted;
  explicit no-authoritative-3D-match constraint locked.
- Presentation renderer report (2026-05-22), promoted into
  [[presentation-renderer-strategy]] and
  [[../10-Architecture/09-Decisions/ADR-0041-presentation-renderer-strategy]]:
  optional 3D/2.5D scenes stay outside the match renderer and require fallback
  plus device-tier gates.
