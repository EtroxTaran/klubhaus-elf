---
title: ADR-0008 Mobile-first UI — route map, IA & client-state
status: accepted
tags: [adr, ui, ux, mobile, ia, navigation, client-state, optimistic-ui, worker, determinism, fmx-98]
created: 2026-05-15
updated: 2026-06-08
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0021-revised-tech-stack]]
  - [[ADR-0024-match-renderer-abstraction]]
  - [[ADR-0025-mobile-delivery]]
  - [[ADR-0010-design-system]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[ADR-0005-save-format]]
  - [[ADR-0006-i18n]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../../50-Game-Design/GD-0001-core-loop]]
  - [[../../50-Game-Design/GD-0012-onboarding]]
  - [[../../50-Game-Design/GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../../60-Research/mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-mobile-route-map-ia-and-client-state-2026-06-03]]
  - [[../../60-Research/onboarding-strategy]]
  - [[../../60-Research/performance-budgets]]
  - [[../../60-Research/match-engine-simulation-model]]
  - [[../../60-Research/determinism-and-replay]]
---

> **Ratified — D1–D3 answered live by Nico 2026-06-03** (ask-first gate; FMX-98),
> who also approved the ratification plan. ADR-0008 is promoted from `draft` to
> `accepted` / `binding: true`; the prior "do not implement" + "keep parked" banners
> are removed. This closes **GD-0016 R2-07** (route map + IA) and **R2-17**
> (client-state + worker bridge), and resolves the live contradiction between
> GD-0016 ("no Redux/Zustand") and ADR-0021 ("Zustand v5") via D2. R2-16 (match
> controls + rendering) stays open → FMX-100. Merge remains Nico's (auto-merge on green).

# ADR-0008: Mobile-first UI — route map, IA & client-state

## Status

accepted

## Date

- Proposed (intent): 2026-05-15
- Ratified (D1–D3 answered live by Nico): 2026-06-03

## Context

GD-0016 (approved, binding) locked the mobile *experience* — one mobile-first
responsive UI; one-handed portrait, <1 s tap budget; a single "this week" home of a
next-match card + 3–4 action cards; tap-only chairman loop with one primary action per
screen; hub + drill-down nav (Squad/Transfers/Youth/Staff/Stadium/Finances);
tabular→cards; halftime = 30-s modal; press/board = feed cards; sort/filter every list;
design language = ADR-0010 "Aurelia Premier". It deferred three Wave-2 items that block
this interaction-model ADR: **R2-07** (route map + bottom-nav vs drawer vs hub-tile,
WCAG 2.2 AA, 44px, `prefers-reduced-motion`) and **R2-17** (client-state pattern: modal
drafts, optimistic transfer UI, Worker bridge; "no Redux/Zustand"). This ADR ratifies
the interaction model that realises GD-0016 for the MVP first-playable (Create-a-Club
**Roguelite** only per GD-0017; Career routes out of scope).

Grounding: [[../../60-Research/mobile-route-map-ia-and-client-state-2026-06-03]]
(2026 mobile-IA best practice; mobile-first manager-game survey — Top Eleven / OSM
precedent; TanStack "Query is not client-state" guidance; Comlink vs hand-rolled
worker bridge; raw capture with an inferred-version caveat re-verified via context7).

**Constraints inherited (settled — not re-decided here):** ADR-0025 (responsive PWA is
source of truth; Capacitor shell reuses the same `webDir`, no web-code fork) · ADR-0010
(design tokens, `data-scheme`, club accent) · ADR-0021 (TanStack Start/Router/Query +
Dexie; Zustand v5; persist Query over IndexedDB) · ADR-0020 (hybrid-online: drafts local,
mutations server-confirmed; four offline UX states) · ADR-0018 + determinism-and-replay
(9 seeded RNG streams; no `Math.random`/`Date.now`/`setTimeout` in sim Workers) · ADR-0005
(save envelope) · bounded-context-map §3 (Bus + `QueryGateway`; **no cross-context join**) ·
`match-engine-simulation-model.md` §6.2 (existing `MatchWorkerBridge` over `postMessage`
discriminated unions, events batched per virtual minute).

## Decision (ratified — Nico D1–D3 = A,A,A live 2026-06-03)

### D1. Navigation pattern: bottom-nav hybrid

A **bottom navigation bar of 4–5 destinations** is the single primary pattern, sized to
the one-handed thumb zone:

- **Tabs:** **Home** ("This Week"), **Squad**, **Transfers**, **Inbox**, **Club/More**.
- **"Club/More"** opens a **bottom-sheet** (not a side-drawer) listing the lower-frequency
  hubs: **Youth, Staff, Stadium, Finances, Settings**.
- **Home is also a task hub:** the feed-card daily-action queue deep-links into any
  section, so most navigation is "follow the next card", with the bottom bar for direct
  jumps. This satisfies GD-0016's "single this-week home" + "hub + drill-down" + "one
  primary action per screen".

Caps at 5 visible tabs (NN/g); scales past 5 via the Club/More overflow without losing
thumb-reach. Works identically in the PWA and the Capacitor shell (ADR-0025); the bar
respects `env(safe-area-inset-bottom)`. **Alternatives rejected:** navigation drawer as
primary (poor one-handed reach + "out of sight" discoverability; kept only as a possible
tertiary surface) and pure hub-and-spoke tile grid as sole nav (an extra tap on every
section switch — friction for the power loop; the Home feed already supplies the hub
benefit). Validated by the mobile-first manager precedent (Top Eleven, OSM).

### D2. Client-state: layered, with a narrow Zustand slice (resolves the GD-0016↔ADR-0021 conflict)

State has a single home per category; there is **no central god-store**:

| State category | Home | Examples |
|---|---|---|
| Server-mirrored entities | **TanStack Query** (persist over IndexedDB) | squad, fixtures, league table, finances, match reports |
| Durable local working copies | **Dexie/IndexedDB** | lineup/tactic/transfer drafts, onboarding-state, offline queue (future) |
| Route-scoped / bookmarkable | **TanStack Router** (URL/search params) | active tab, filters, selected entity when deep-linked |
| Ephemeral component UI | **React local state** | modal open, form field-before-commit, hover/focus |
| Cross-cutting *synchronous* client state | **small Zustand v5 slice** | live match playback view-state, worker-bridge status/last-acked-tick, optimistic-overlay registry, app-wide toasts/drawers/prefs |

**Conflict resolution.** GD-0016's "no Redux/Zustand" and ADR-0021's "Zustand v5" are
reconciled by reading GD-0016's intent as *no Redux-style central store mirroring server
state* — which this ADR enforces (server data stays in Query; Zustand holds **client
state only, never server cache**). ADR-0021's Zustand v5 stands, **scoped** to the narrow
client-only slice above. GD-0016 is reworded accordingly (see §Reconciliation). Grounded
in TanStack's own "Query does not replace client state" guidance and 2026 practice: for a
live-match PWA the residual synchronous client state is real and a small store beats
hand-rolled context (granular subscriptions, fewer re-renders, clean worker-event wiring).
**Alternatives rejected:** zero-Zustand (purist, but the shared match-UI state won't stay
trivial → more custom context plumbing/re-render tuning) and defer (would leave ADR-0008
un-ratified — the issue's whole point).

### D3. UI↔Worker bridge: hybrid transport + separate workers

- **Transport (hybrid):** **Comlink (~v4.4.x; exact pin verified at build)** for the
  low-frequency **control-plane RPC** — `initEngine` / `startMatch` / `precomputeMatchLog`
  / `getEngineVersion` / save-load — which plugs naturally into TanStack Query mutations
  (auto request-response correlation, errors re-thrown as Promise rejections). A
  **hand-rolled discriminated-union `postMessage` protocol** for the **high-frequency
  event stream** (`eventBatch` per virtual minute, `matchCompleted`, `error`) — near-zero
  overhead, explicit transferables/back-pressure, protocol-level testable. This matches
  the `MatchWorkerBridge` already specified in `match-engine-simulation-model.md` §6.2.
- **Topology (separate workers):** a **dedicated deterministic engine worker** — pure: no
  `Date.now`/`Math.random`/`setTimeout`/IO; seeded PCG32 streams only (ADR-0018). An
  **optional app/background worker** is reserved for non-deterministic IO later.
  **OffscreenCanvas rendering stays on the main thread at MVP** (engine in its worker;
  each draw < 50 ms; events batched per virtual minute); moving rendering into a *separate*
  render worker is a profiling-driven, FMX-100-coupled future step — never collapsed into
  the deterministic engine worker. **Dedicated** (not Shared) Worker — SharedWorker iOS
  support is unreliable in 2026 and complicates determinism.
- **Boundary:** typed command/query/event only; commands in → events/read-models out; no
  cross-context join (BCM §3). The bridge respects determinism Rule 7 (sim driven by
  explicit `postMessage`).

## Route map (MVP — Roguelite first-playable)

Hub + drill-down; Home is the task hub, the bottom bar the direct-jump shell. Career-mode
routes are out of scope (GD-0017).

```
FTUE (pre-shell, onboarding-strategy §3): /new → experience-question → mode-step
                                          → club/region setup → first Home
App shell (bottom nav):
├── / (Home — "This Week" feed-card queue)         [tab]
├── /squad                                          [tab] → /squad/:playerId
│     └── /tactics (first tactical choice; preset cards) → /tactics/set-pieces
├── /transfers                                      [tab] → /transfers/:targetId, /transfers/shortlist
│     └── /transfers/:targetId/contract (negotiation)
├── /inbox                                          [tab] → /inbox/:messageId
└── /club  (Club/More — bottom-sheet)               [tab]
      ├── /youth        → /youth/:prospectId
      ├── /staff        → /staff/:roleId
      ├── /stadium
      ├── /finances
      └── /settings     (locale, accessibility, save mgmt)
Match (entered from a Home card / fixture; FMX-100 owns in-match controls UX):
      /match/:matchId   → text&stats | 2D-canvas modes (per-user persistent)
```

Each FTUE step and each card destination is a route; feed cards read from the Home
read-model (`QueryGateway`), never a cross-context join.

## Accessibility checklist (bound to the route shell)

- **Touch targets** ≥ 44×44px hit area (overflow icons); primary buttons ≥ 48dp; cards
  ≥ 56dp height (onboarding-strategy §2.1, §13).
- **Contrast** WCAG 2.2 AA: 4.5:1 body text, 3:1 large text + UI components.
- **Focus order** logical (content → bottom nav) with a "skip to navigation" affordance;
  visible focus states on every tab; bottom-sheet traps focus when open and is `inert`/
  `aria-hidden` when closed; tabs are semantic links/buttons announced with position/state.
- **`prefers-reduced-motion`**: disable tab-transition + sheet-slide animation (instant or
  short fade); no parallax/bounce.
- **DOM budget** ≤ 1500 nodes/route (hard cap 3000); per-route lazy chunk 80–120 KB
  (performance-budgets §5).
- **i18n**: route-level locale routing only (copy/tone = ADR-0006 / R2-10); chrome strings
  in `locales/{de,en}.ts` (ADR-0010).

## Client-state model & Resilient + Optimistic UI contract

The R2-17 core. Optimistic UI is a **temporary projection**, never a second source of truth.

- **Draft lifecycle (Dexie, durable across reload/offline):**
  `draft → staged → submitting → confirmed | rejected`. The draft payload + status + last
  known server version + conflict metadata live in Dexie; the Query cache mirrors only the
  current server-visible projection + optimistic overlay.
- **Optimistic mutation pattern (TanStack Query `useMutation`):**
  - `onMutate` — cancel relevant queries, **snapshot** previous cache, apply optimistic
    patch, mark the overlay/draft pending.
  - `onError` — restore the snapshot, mark the Dexie draft `rejected` / needs-review,
    surface a domain conflict (e.g. version mismatch).
  - `onSettled` — invalidate/refetch affected queries, reconcile with server truth, advance
    the draft lifecycle.
- **Precondition-aware / deterministic:** every authoritative mutation carries a client
  **command-id** + an **`expected-version`** precondition so the server rejects staleness
  deterministically and retries are idempotent/dedup-safe.
- **Four offline UX states (ADR-0020) bound to the shell:** available-offline /
  cached-stale (freshness-labelled) / draft-on-device / requires-connection.
- **Scope boundary (explicit):** "optimistic" = optimistic *within an online session* +
  resilient draft persistence. A **full offline command-replay queue + conflict resolution
  is deferred** (Offline Sync is MVP-narrow — BCM §7 + ADR-0020); the command-id /
  `expected-version` seam is designed **now** to be forward-compatible with it. Per-feature
  optimistic flows (transfer/lineup screens) are applied later by each screen against this
  contract. **Optimistic scope = single-player-only at MVP** (P2P transfer negotiation is
  future; the precondition seam extends to it).

## Invariants (checkable policies)

| # | Invariant | Where enforced |
|---|---|---|
| **U1** | ≤ 5 visible bottom-nav tabs; all lower-frequency hubs reachable via Club/More. | shell review |
| **U2** | Every player-facing surface is a route; feed cards read the Home read-model via `QueryGateway` — no cross-context join. | route + contract review |
| **U3** | Server-mirrored data never lives in Zustand; Zustand holds client-only state. | state review / lint |
| **U4** | Every authoritative mutation carries a command-id + `expected-version`; optimistic writes snapshot-then-patch and roll back on error. | mutation review |
| **U5** | The durable draft lifecycle lives in Dexie; the Query cache is never the sole copy of a draft. | client-state review |
| **U6** | The engine worker uses no `Date.now`/`Math.random`/`setTimeout`; sim driven by explicit `postMessage` (ADR-0018 Rule 7). | determinism CI gate |
| **U7** | Control-plane = Comlink RPC; high-frequency event stream = hand-rolled discriminated-union `postMessage`. | bridge review |
| **U8** | Shell meets 44px / WCAG 2.2 AA contrast / `prefers-reduced-motion` / skip-to-nav / focus-trap. | a11y checklist + audit |
| **U9** | The route shell runs identically in PWA + Capacitor (no web-code fork). | build review (ADR-0025) |

## Verification

- **Nav (U1/U2):** route map enumerates every MVP route with parent/child hierarchy; ≤ 5
  tabs; Club/More reaches Youth/Staff/Stadium/Finances/Settings.
- **State (U3–U5):** a sample lineup-edit flows draft→staged→submitting→confirmed in Dexie;
  optimistic patch rolls back on a forced server reject; no server entity sits in Zustand.
- **Worker (U6/U7):** determinism CI (Chromium MVP) confirms a fixed `(seed, lineups,
  tactics, engineVersion)` → byte-identical event log; control-plane uses Comlink, event
  stream uses raw `postMessage`.
- **A11y (U8):** Lighthouse/axe pass on the shell; manual focus-order + reduced-motion check.
- **Acceptance criteria (FMX-98):** mapped 1:1 — route map + single nav pattern (D1, route
  map §); nav choice as options + recommendation (D1 + research note); client-state model
  with optimistic rollback + offline, no god-store (D2 + contract §); typed join-free
  worker-bridge (D3); a11y rules enumerated (a11y §); status flipped + banners removed
  (front-matter); GD-0016 R2-07/R2-17 back-referenced (Reconciliation §).

## Reconciliation (other binding docs — applied in this PR)

- **GD-0016** — R2-07 + R2-17 marked **resolved** with back-references to this ADR; the
  "no Redux/Zustand" line reworded to "no Redux, no Zustand god-store mirroring server
  state — a narrow client-only slice is allowed (ADR-0008 §D2)". R2-16 (match controls/rendering) resolved 2026-06-03 by FMX-100 → [[../../50-Game-Design/GD-0025-in-match-controls]] + [[ADR-0072-in-match-control-seam]].
- **ADR-0021** — a note that ADR-0008 §D2 **scopes** the ratified Zustand v5 usage to the
  narrow client-only slice (contradiction closed; no status change).

## Consequences

**Positive**
- Unblocks the entire player-facing lane: FMX-99 (onboarding) and FMX-100 (match controls)
  now build against a stable nav + state + worker seam.
- Resolves a live binding-doc contradiction (Zustand) instead of papering over it.
- Optimistic/offline contract is forward-compatible with the future Offline Sync queue.
- Determinism + no-join preserved by construction; one nav pattern across PWA + Capacitor.

**Negative / constraints**
- A narrow Zustand slice is one more state layer to discipline (rule: client-only, never
  server cache) — mitigated by U3 lint/review.
- Comlink is a new dependency (small; control-plane only) — exact pin re-verified at build.
- OffscreenCanvas-in-worker is deferred; if main-thread playback later breaches budget,
  FMX-100 must move rendering to a render worker (named seam, not silent).

## HITL gate

Ratified: Nico answered **D1–D3 = A, A, A** live on 2026-06-03 (ask-first gate;
`needs:nico-decision`) and approved the ratification plan. Promoted `draft → accepted`,
`binding: false → true`; "do not implement"/"keep parked" banners removed. GD-0016 +
ADR-0021 reconciliation hunks are applied in this PR (this ADR is now `accepted`, so its
realising edits are in-scope). No edit to the binding bounded-context-map (cross-reference
only; the worker/UI boundary is already covered by BCM §3). Merge stays Nico's
(docs auto-merge on green).
