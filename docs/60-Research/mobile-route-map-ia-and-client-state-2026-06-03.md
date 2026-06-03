---
title: Mobile route map, IA & client-state pattern (FMX-98)
status: current
tags: [research, ui-ux, mobile, ia, navigation, client-state, optimistic-ui, worker, determinism, fmx-98]
created: 2026-06-03
updated: 2026-06-03
type: research
binding: false
linear: FMX-98
sourceType: external
related:
  - [[raw-perplexity/raw-mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]]
  - [[../10-Architecture/09-Decisions/ADR-0010-design-system]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
  - [[../10-Architecture/bounded-context-map]]
  - [[onboarding-strategy]]
  - [[performance-budgets]]
  - [[match-engine-simulation-model]]
  - [[determinism-and-replay]]
  - [[../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
---

# Mobile route map, IA & client-state pattern (FMX-98)

## Question

GD-0016 ratified the mobile *experience* (one-handed, one-primary-action-per-screen,
hub + drill-down, tabular→cards) but deferred R2-07 (route map + nav pattern) and
R2-17 (client-state pattern + worker bridge; "no Redux/Zustand"). ADR-0008 has been
`draft` ("do not implement") since 2026-05-15. Three things must be decided to ratify
it: (D1) the primary navigation pattern, (D2) the client-state stack — which forces
resolving a **live contradiction** (GD-0016 "no Redux/Zustand" vs ADR-0021 "Zustand v5")
— and (D3) the UI↔Worker bridge transport + worker topology.

## Summary

Decision-ready and **ratified live by Nico (2026-06-03)**:

- **D1 = Bottom-nav hybrid.** 4–5 bottom tabs for the high-frequency loop
  (Home/"This Week", Squad, Transfers, Inbox) + a "Club/More" tab → bottom-sheet for
  Youth/Staff/Stadium/Finances/Settings; the Home feed-cards double as a task hub that
  deep-links into sections. Grounded in NN/g's ≤5-tab rule, the thumb-zone ergonomics
  of bottom nav, and the mobile-first manager precedent (Top Eleven, OSM). Drawer-as-
  primary is rejected (reach + discoverability); pure hub-and-spoke is rejected as sole
  nav (extra tap per switch). Honors every GD-0016 "Decided/strong" rule.
- **D2 = Layered + narrow Zustand.** TanStack Query = server state · Dexie = drafts ·
  TanStack Router/URL = route state · React local = ephemeral; a **small** Zustand v5
  slice **only** for cross-cutting synchronous client state (live match playback
  view-state, worker-bridge status, optimistic-overlay registry, app-wide UI). This
  honors ADR-0021 and reconciles GD-0016: the intent of "no Redux/Zustand" was *no
  god-store mirroring server state*, which everyone agrees with. GD-0016 is reworded to
  "no Redux, no Zustand god-store mirroring server state — a narrow client-only slice is
  allowed." Grounded in TanStack's own "Query is not a client-state manager" guidance.
- **D3 = Hybrid transport + separate workers.** Comlink (~v4.4.x) for low-frequency
  control-plane RPC (init/start/precompute/save-load → TanStack Query mutations) +
  hand-rolled discriminated-union `postMessage` for the high-frequency event stream
  (this matches the protocol already specified in `match-engine-simulation-model.md`
  §6.2). A **dedicated deterministic engine worker** (pure: no `Date.now`/`Math.random`/
  `setTimeout`; 9 seeded RNG streams per ADR-0018/determinism-and-replay). OffscreenCanvas
  rendering stays **main-thread at MVP** (→ separate render worker only if profiling
  demands; couples to FMX-100).

## Inputs (vault, binding/relevant)

- **GD-0016** (approved): one mobile-first responsive UI; single "this week" home
  (next-match + 3–4 action cards); tap-only chairman loop, one primary action/screen;
  hub + drill-down (Squad/Transfers/Youth/Staff/Stadium/Finances); halftime = 30-s modal;
  press/board = feed cards; sort/filter every list; design language = ADR-0010. Open:
  R2-07, R2-16, R2-17.
- **ADR-0021** (accepted): retains TanStack Start/Router/Query + Dexie/IndexedDB;
  **Zustand v5** for client/UI/match-sim state; TanStack Query (+ persist over IndexedDB)
  for server-mirrored state; not TanStack Store. ← the Zustand side of the conflict.
- **ADR-0025** (accepted): responsive PWA is the single source of truth; thin Capacitor
  shell reuses the same `webDir`, additive + reversible → route shell must run identically
  in web + Capacitor (no web-code fork).
- **ADR-0010** (accepted): Aurelia Premier design system; Tailwind v4 tokens, `data-scheme`
  light/dark, club-adaptive accent; realises the mobile-first + WCAG intent.
- **ADR-0020** (accepted): hybrid-online MVP. Offline scope = app shell + cached read
  models (freshness-labelled) + **local drafts** (Dexie); authoritative mutations require
  connection. Four UX states: available-offline / cached-stale / draft-on-device /
  requires-connection. Queued-write replay + conflict = future.
- **ADR-0018 / determinism-and-replay** (accepted): 9 named RNG streams; PCG32 only,
  `Math.random` forbidden; no `Date.now`/`performance.now` in sim (use `simClock`);
  **Rule 7** — simulation in Workers via explicit `postMessage`, no `setTimeout`/
  `setInterval`/`rAF` in sim logic.
- **ADR-0005** (accepted): AES-GCM save envelope; payload mirrors per-save schema; RNG
  state snapshot persisted (replay).
- **match-engine-simulation-model.md** §6.2: an existing `MatchWorkerBridge`
  (`simulate`/`simulateStreaming`/`replay`) over `postMessage` discriminated unions,
  events batched per virtual minute. Worker forbidden from clock/randomness.
- **bounded-context-map.md** §3: contexts communicate only via Bus (commands/events) +
  `QueryGateway` (queries); **no cross-context join**; read models are deterministic
  projections.
- **onboarding-strategy.md / performance-budgets.md**: surface inventory (Home feed-card
  queue; Squad/Transfers/Youth/Staff/Stadium/Finances/Inbox/Settings; match playback
  modes); 3 UI tiers (Quick/Standard/Expert); 44×44px / WCAG 2.2 AA / BITV 2.0; DOM
  ≤1500/3000; INP ≤120 ms primary flows; no main-thread task >50 ms during playback;
  per-route lazy chunk 80–120 KB.
- **GD-0017** (binding): MVP first-playable = Create-a-Club **Roguelite only**; Career
  later → route map covers MVP routes only.

## Findings

### F1 — Bottom-nav wins for one-handed; cap at ~5, overflow the rest
The bottom third is the comfortable thumb zone; always-visible nav maximises
discoverability (iOS HIG + Material put primary nav at bottom on phones). NN/g caps
tab bars at ~5 → 4–5 core tabs + a "More/Club" overflow. Drawer = poor reach +
"out of sight, out of mind"; hub-and-spoke = an extra tap per section switch. → D1
hybrid bottom-nav with the Home feed as a task hub.

### F2 — The mobile-first manager precedent agrees
Top Eleven and OSM (the genre's mobile-native successes) both use 4–5 bottom tabs +
a task-oriented Home dashboard + a "Club/More" bucket — *hierarchy over breadth*. The
PC-derived managers (FM Mobile, We Are Football, Hattrick) carry dense top/drawer menus
that fail one-handed/44px/WCAG — explicit cautionary patterns. → D1.

### F3 — Query is for server state, not client state
TanStack's own docs state Query replaces server-state wiring, not client-state
management; the residual global client state in most apps is small. → keep server data
in Query, not a store. Resolves half the GD-0016/ADR-0021 conflict: nobody should put
server-mirrored entities in Zustand.

### F4 — A narrow Zustand slice is the right amount of global store
For a live-match PWA the residual cross-cutting *synchronous* client state (playback
controls, worker-bridge status/last-acked-tick, optimistic-overlay registry, app-wide
UI) is real and won't stay trivial → a *small* Zustand v5 slice beats hand-rolled
context (granular subscriptions, fewer re-renders, clean worker-event integration). The
discipline is the rule "Zustand holds client state only, never server cache". → D2; this
reconciles GD-0016 (its "no Redux/Zustand" = no god-store) with ADR-0021 (Zustand v5).

### F5 — Optimistic UI = temporary projection; drafts live in Dexie
2026 best practice: `onMutate` (cancel queries + snapshot + optimistic patch) → `onError`
(rollback) → `onSettled` (reconcile/invalidate); the durable draft lifecycle
(`draft→staged→submitting→confirmed|rejected`) lives in Dexie, never solely in the Query
cache. Every authoritative mutation carries a client command-id + `expected-version`
precondition (deterministic staleness reject + idempotent retry) — which also keeps the
seam forward-compatible with the future Offline Sync queued-replay path. → the Resilient
& Optimistic UI contract in ADR-0008.

### F6 — Hybrid worker transport: Comlink control-plane + raw postMessage hot path
Comlink (~1–2 kB; Google Chrome Labs, high reputation) gives auto request-response
correlation + error propagation for control-plane RPC and plugs into Query mutations;
but per-message Promise/proxy churn is unnecessary (and risky on low-end mobile) for the
high-frequency event stream. A hand-rolled discriminated-union `postMessage` protocol
(already specified in match-engine §6.2) is near-zero-overhead, explicit about
transferables/back-pressure, and testable at protocol level. → D3 hybrid.

### F7 — Separate, dedicated, pure engine worker; canvas on main thread at MVP
Isolating the deterministic engine in its own dedicated worker (no clock/randomness/IO)
makes it a reviewable, crash-isolated "simulation VM" and protects replay-safety; an
optional app/background worker handles non-deterministic IO later. OffscreenCanvas stays
main-thread at MVP (move to a separate render worker only on profiling pressure — couples
to FMX-100). Dedicated (not Shared) worker — SharedWorker iOS support is unreliable in
2026. → D3 topology.

### F8 — Everything else is already settled (do not re-decide)
The worker command/event boundary (match-engine §6.2), the RNG discipline
(ADR-0018), the offline draft model + four UX states (ADR-0020), the no-join read-model
rule (BCM §3), the save envelope (ADR-0005), and the Capacitor single-`webDir` constraint
(ADR-0025) are all binding and consistent. FMX-98 consumes them; it does not change them.

## Options matrix (ratified by Nico 2026-06-03)

| Decision | Options | Ratified |
|---|---|---|
| **D1 nav pattern** | A. **bottom-nav hybrid** (4–5 tabs + Club/More bottom-sheet + Home task-hub) · B. hub-and-spoke tile grid only · C. navigation drawer primary | **A** |
| **D2 client state** | A. **layered + narrow Zustand** (Query/Dexie/Router/React + small client-only Zustand slice) · B. zero Zustand (Query+Router+React context+worker-bridge) · C. defer (store-agnostic seam) | **A** |
| **D3 worker bridge** | A. **hybrid** (Comlink control-plane + postMessage event stream) + separate workers · B. all hand-rolled postMessage · C. Comlink for everything | **A** |

## Inputs For Decisions

- **ADR input (ADR-0008 ratification):** Decision/Alternatives/Consequences for D1–D3;
  MVP route map + hub→drill-down hierarchy; accessibility checklist bound to the shell;
  client-state model + the Resilient & Optimistic UI contract (draft lifecycle, optimistic
  pattern, expected-version preconditions, four UX states, scope boundary); typed
  worker-bridge contract (Comlink control-plane + postMessage event stream, separate
  workers, no cross-context join). Resolves GD-0016 R2-07/R2-17 + the Zustand conflict.
- **Game-design input:** the 60-second onboarding flow detail (R2-05) is FMX-99; in-match
  controls + rendering (R2-16) is FMX-100. Both now unblocked by this ratification.

## Future-scope notes (classified future-scope)

- **Offline queued-write replay + conflict resolution** (Offline Sync; ADR-0020 / BCM §7)
  — the command-id/expected-version seam is designed now to extend to it.
- **OffscreenCanvas render worker** — activate only on main-thread profiling pressure
  (couples to FMX-100 / R2-16).
- **P2P optimistic transfer negotiation** — optimistic scope is single-player-only at MVP;
  the precondition seam extends to P2P when multiplayer ships.
- **Per-feature optimistic flows** (transfer/lineup screens) — applied later by each
  screen against the ADR-0008 contract.
