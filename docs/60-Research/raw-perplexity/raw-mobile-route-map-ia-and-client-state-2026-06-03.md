---
title: Raw Perplexity — Mobile route map, IA & client-state pattern (FMX-98)
status: current
tags: [research, raw, perplexity, ui-ux, mobile, ia, client-state, worker, fmx-98]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-98
sourceType: external
related:
  - [[../mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
---

# Raw Perplexity — Mobile route map, IA & client-state pattern (FMX-98)

Raw capture of the three grounding queries run 2026-06-03 for FMX-98. Lightly
trimmed for length; citations preserved. Synthesis + decisions live in
[[../mobile-route-map-ia-and-client-state-2026-06-03]].

> **Caveat:** Perplexity flagged some library-version facts as "inferred"
> (Comlink ~v4.4.x). The exact pin is re-verified at implementation per the
> dependency-currency rule; context7 confirmed Comlink = Google Chrome Labs,
> high reputation. The competitor-game nav survey is "based on gameplay
> footage/reviews up to 2026; exact layouts vary by version" — treat as
> directional, not authoritative per-screen.

## Q1 — Mobile navigation pattern + competitor manager-game survey

**Asked:** For a one-handed mobile-first PWA football manager (~6–8 top-level
destinations: Home/"This Week" feed, Squad, Transfers, Youth, Staff, Stadium,
Finances, Inbox, Settings), compare bottom-nav vs drawer vs hub-and-spoke
(thumb reach, discoverability, scale beyond 5, WCAG 2.2, prefers-reduced-motion,
Capacitor vs web). And: how do real football/sports manager games navigate?

**Key answer:**
- **Bottom nav** — sits in the one-handed thumb zone; always-visible →
  high discoverability; iOS HIG + Material both put primary nav at the bottom on
  phones. NN/g: tab/bottom bars work best up to ~**5** options. Beyond 5 → put
  4–5 primary items + a "More"/"Club" overflow. Accessibility: 44×44px easy;
  ensure logical focus order (content→nav) or a skip-to-nav link; respect
  reduced-motion by disabling tab-transition animation. Capacitor: can use native
  tab bars; web PWA needs `env(safe-area-inset-bottom)`. **Strong primary candidate.**
- **Drawer (hamburger)** — top-corner trigger is hard to reach one-handed; NN/g:
  "out of sight, out of mind" → low discoverability; scales to many items; needs
  focus-trap + `inert`/`aria-hidden` when closed. **Best as secondary/tertiary, not primary.**
- **Hub-and-spoke (tile grid)** — great first-run orientation, trivially
  accessible (DOM-order tiles), minimal motion; but adds a tap to every section
  switch → friction for the power loop. **Great complementary Home, not the sole nav.**
- **Recommendation:** hybrid **bottom-nav-centric**: 4–5 bottom tabs for the
  high-frequency loop + a "More/Club" group (bottom-sheet, not side-drawer) for
  Youth/Staff/Stadium/Finances/Settings; Home "This Week" feed doubles as a
  task-card hub deep-linking into sections.

**Competitor survey (directional):**
- **Football Manager Mobile/Touch** — top-bar + drawer/lists, 10+ areas,
  desktop-like density; *cautionary* for one-handed/WCAG.
- **OSM (Online Soccer Manager)** — bottom nav (~4–5), Home as hub; built for
  casual one-handed play.
- **Top Eleven** — strongly bottom-nav-centric (4–5 tabs) + dashboard hub +
  "Club"/"More" submenu; **validates few-core-tabs + deeper stacks**.
- **Hattrick** — web-first top-bar/hamburger; many top-level categories;
  cautionary "web IA ported to mobile".
- **Club Soccer Director** — hub/dashboard + menus; dense, small targets →
  watch overcrowding + target size.
- **New Star Manager** — thematic spatial hub (tap objects); immersive but hurts
  discoverability + target size; needs redundant clear nav.
- **We Are Football** — desktop-style menus shrunk down; cautionary for ergonomics.
- **Lesson:** the mobile-first winners (Top Eleven, OSM) all use **4–5 bottom
  tabs + a task-oriented Home hub + a "More/Club" bucket**; hierarchy over breadth;
  dashboards surface "do this next"; progressive onboarding unlocks nav gradually.

Citations: nngroup.com/articles/mobile-navigation-patterns; smashingmagazine.com
(2022) navigation-design-mobile-ux; grialkit.com basic-patterns-for-navigation;
uxdesign.cc navigation-patterns-in-mobile-applications; justinmind.com mobile-navigation.

## Q2 — Client-state architecture (React/TanStack PWA) + optimistic/draft lifecycle

**Asked:** For a mobile React + TanStack Start/Router PWA with TanStack Query
(persist over IndexedDB), Dexie drafts, a deterministic Web-Worker engine, and a
hybrid-online model (drafts local, mutations server-confirmed): (A) what client-state
architecture in 2026, and is a global store (Zustand v5) warranted or avoidable?
(B) best practice for optimistic UI + rollback + offline draft lifecycle in TanStack Query.

**Key answer A:**
- TanStack's own docs: Query replaces **server-state** wiring, **not** client state;
  residual global client state in most apps is small.
- State homes: **TanStack Query** = server-mirrored entities; **Dexie/IndexedDB**
  = durable drafts/working copies; **Router URL/search params** = route-scoped/
  bookmarkable state; **React local** = ephemeral component UI; **small global store
  (Zustand v5)** = cross-cutting *synchronous client* state (live match playback
  view-state, worker-bridge status/last-acked-tick, optimistic-overlay registry,
  app-wide toasts/drawers/preferences).
- "Can you avoid Zustand?" — possible only if shared synchronous state stays trivial;
  **for a live-match manager PWA it won't**, so a *small* Zustand slice is the better
  trade-off (predictable sync reads/writes, granular subscriptions, easy worker-event
  integration, fewer context re-renders). **Rule: Zustand stores client state only,
  never server cache.** A Redux-style central store for everything = overkill, duplicates
  Query, worse offline reconciliation.

**Key answer B:**
- Lifecycle in **Dexie** (durable across reload/offline): `draft → staged →
  submitting → confirmed | rejected`. Query mirrors the current server-visible
  projection + optimistic overlay, never the persistent draft.
- `useMutation`: `onMutate` = cancel relevant queries + snapshot previous + apply
  optimistic patch; `onError` = restore snapshot + mark draft rejected/needs-review;
  `onSettled` = invalidate/refetch + reconcile + advance draft lifecycle.
- Each authoritative mutation carries a **client command-id** + **expected-version**
  precondition → deterministic staleness reject + idempotent retry/dedup.
- Rules of thumb: never let optimistic cache be the only persisted copy; always
  snapshot before optimistic writes; always cancel queries first; always send a
  version precondition; always reconcile the final server response; keep the worker
  deterministic (commands in, events/read-models out; no clock/randomness).

Citations: tanstack.com/query/v5 does-this-replace-client-state; tkdodo.eu
context-inheritance-in-tan-stack-router; frontendmasters.com tanstack-router-data-loading-2;
TanStack/query discussions #3198; TanStack/router issues #3997.

## Q3 — UI↔Worker bridge transport + worker topology

**Asked:** Comlink vs hand-rolled discriminated-union postMessage for the typed
UI↔Worker bridge (type-safety, bundle, proxy overhead on high-frequency event
streaming, async-iterable, transferables, correlation, errors, testability); and
same-worker vs separate-worker for a deterministic, replay-safe engine + OffscreenCanvas.

**Key answer 1 (transport): hybrid.**
- **Comlink** (~v4.4.x; ~1–2 kB gz) → excellent DX for **request/response control-plane
  RPC** (init/start/precompute/save-load), auto request-response correlation, errors
  re-thrown as Promise rejections (plugs into Query mutations). But per-message
  Promise/proxy churn can show on the **high-frequency event hot path** on low-end mobile.
- **Hand-rolled discriminated union** over raw `postMessage` → near-zero overhead,
  explicit `switch(type)` exhaustiveness, direct transferables control, explicit
  push-based buffering/back-pressure, protocol-level testability (pure
  `ToWorker → FromWorker[]` functions) — ideal for the deterministic event stream.
- **Recommendation:** Comlink for control-plane RPC + hand-rolled discriminated-union
  postMessage for the high-frequency `eventBatch`/`matchCompleted`/`error` stream.

**Key answer 2 (topology): separate workers.**
- Dedicated **deterministic match-engine worker** (pure: no Date/Math.random/setTimeout,
  no IO) — easy to review/test as a "simulation VM"; crash-isolated; clean scheduling.
- Optional **app/background worker** later for non-deterministic IO/network/persistence.
- **OffscreenCanvas** rendering stays **main-thread at MVP** (engine in its worker,
  events batched per virtual minute, each draw < 50 ms); move rendering to a *separate
  render worker* only if profiling shows main-thread pressure — never collapse rendering
  into the deterministic engine worker.
- **Dedicated** Worker (not SharedWorker) for a single-tab PWA — SharedWorker iOS
  support remains unreliable in 2026 and complicates determinism.

Citations (weak/tangential — topic is engineering-pattern, not game-specific):
stephendoddtech.com javascript-web-worker game-loop; assorted gamedev forum threads.
Comlink reputation/identity confirmed via context7 (/googlechromelabs/comlink, High).
