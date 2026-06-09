---
title: ADR-0002 Offline-first Strategy
status: superseded
tags: [adr, pwa, offline-first, service-worker, workbox, indexeddb, dexie, sync]
created: 2026-05-15
updated: 2026-06-09
accepted_at: 2026-05-16
type: adr
binding: true
superseded_by: ADR-0020-hybrid-online-mvp-offline-ready
related: [[ADR-0001-tech-stack]], [[ADR-0004-data-model]], [[ADR-0005-save-format]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0028-postgres-transactional-outbox]], [[../../60-Research/pwa-offline-patterns]], [[../../60-Research/determinism-and-replay]]
---

# ADR-0002: Offline-first Strategy

> **Superseded — historical memory only.** This document is superseded by [[ADR-0020-hybrid-online-mvp-offline-ready]] and must not be implemented. The current decision/spec lives there; see also [[../../00-Index/Decision-Log]] for the authoritative index. Retained for historical context per the vault's supersede discipline.

## Status

Superseded (2026-05-18 by [[ADR-0020-hybrid-online-mvp-offline-ready]]).
Accepted historically on 2026-05-16, gap A2 of
[[../../95-Archive/gap-reports/wave-3-gap-analysis]].

## Context

**Klubhaus Elf** is a Progressive Web App with two operating modes:

- **Singleplayer** must be **fully playable offline**: launch the app
  from the home screen with no network, continue a career, simulate
  matches, save and reload.
- **Multiplayer** is server-authoritative (ADR-0011). The client may
  draft actions offline (transfer offers, line-up changes, weekly
  closes), but the effect lands only after server-side confirmation
  via the transactional outbox (ADR-0028).

Wave-1 ADR-0002 was a 12-line stub. Wave-1 research
[[../../60-Research/pwa-offline-patterns]] established the foundation
(Dexie 4 + Workbox + outbox + iOS quota stance). Wave-3 has now
locked the surrounding context:

- **B2 (ADR-0011)** — encryption mandatory; offline draft replays
  hard-reject on conflict (`rejected_with_reason`).
- **A4 (ADR-0004)** — per-save DB isolation; save quotas
  (soft 10 / hard 50 per user); Dexie-only on the browser at MVP.
- **A5 (ADR-0005)** — encrypted save envelope; gzip compression;
  three independent version fields.
- **B4 (ADR-0028)** — transactional outbox + UUIDv7 + idempotent
  consumers.
- **D8 (determinism-and-replay)** — engine modules vendored per
  version into the PWA bundle so offline replay is deterministic.

Gap A2 Q&A (2026-05-16) settled six remaining decisions: SW tooling,
update strategy, Background Sync stance, storage budget, install
prompt timing, outbox visibility.

## Decision

The offline-first strategy has eight decision rules.

### 1. Offline capability matrix (what works offline)

| Capability | Offline | Notes |
|---|---|---|
| Launch the installed PWA | ✓ | Precached app shell |
| Play singleplayer career | ✓ | All sim runs in Web Worker against local save |
| Create / load / archive saves | ✓ | Dexie 4 + encrypted envelopes |
| Export save to file | ✓ | Encrypted envelope per ADR-0005 |
| Import save from file | ✓ | Subject to local quota |
| Read recent multiplayer state | ✓ (cached) | Stale-while-revalidate of read models |
| Draft a multiplayer action | ✓ | Written to local outbox; effect deferred |
| Submit a multiplayer action's effect | ✗ | Requires server confirmation |
| Live multiplayer events (watch-party, match-day open) | ✗ | Realtime feed requires online |
| Push notifications | depends on platform | iOS PWA installed + permission |

The split is deliberate: **anything that is "multiplayer truth"
requires the server**; everything else works offline.

### 2. Service Worker tooling — `vite-plugin-pwa` with `injectManifest`

- We use `vite-plugin-pwa` 1.x with `injectManifest` mode.
- The SW source is hand-authored TypeScript in `apps/web/src/sw.ts`,
  built to `apps/web/public/sw.js`.
- Workbox 7.x is imported for: precaching, route caching strategies,
  cleanup, expiration plugins, and `BackgroundSyncPlugin` (Chromium-
  only accelerator).
- Rejected: `generateSW` (opaque, hard to extend with outbox-replay
  logic); fully custom SW without Workbox (reinvents revision
  management + plugin system); Serwist (newer but less proven for
  TanStack Start in 2026).

### 3. Service Worker scope + lifecycle

- **Scope**: `/`. The SW lives at `/sw.js` and serves the entire app.
- **Install event**: precache app shell — JS/CSS bundles for the
  current build, the offline-fallback HTML, the manifest, the icon
  set, the engine modules (one per `engineVersion`, dynamic-imported
  for old saves per D8 §3.6), the fictional naming catalog data.
- **Activate event**: `cleanupOutdatedCaches()`; delete stale
  runtime cache buckets when their schema changes.
- **Fetch event**:
  - Precached assets → `precacheAndRoute` (cache-first with revision
    check).
  - HTML navigations → **network-first** with timeout fallback to the
    cached offline shell.
  - Read-only metadata API (read-models, catalog) →
    **stale-while-revalidate**.
  - Mutating API (`POST`, `PUT`, `PATCH`, `DELETE`) → **never
    cached**; queue in the IndexedDB outbox if offline (see §5).
  - Media (crests, kits) → cache-first with LRU expiration
    (`ExpirationPlugin`, max 200 entries, max 30 days).
- **Message event**: handle `SKIP_WAITING`, manual "replay outbox
  now", "clear caches" admin commands.

### 4. Update strategy — hybrid smart

Per Nico's gap-A2 Q&A choice:

- **No in-progress state** (no match in
  `simulating|halftime|matchday_resolving`, no draft transfer/contract
  pending submission, no active watch-party participation):
  → auto-`skipWaiting()` + `clientsClaim()`, reload silently on the
  next navigation tick.
- **In-progress state present**:
  → new SW stays `waiting`. The page shows a `workbox-window`
  banner: *"Update available. We'll apply it when you finish your
  current match / submit your draft."* with a "Update now anyway"
  override.
- Whichever path, the SW exposes a `message` handler for `SKIP_WAITING`
  so manual override works.

Detection of "in-progress state" is owned by the client's
state-management layer: it exposes a `getAppActivityState()` selector
that the `workbox-window` integration polls before each `waiting`
transition.

Rejected: auto-skipWaiting unconditionally (can lose match state);
pure prompt-only (annoying when there's nothing to lose); manual-only
update (stale-app risk).

### 5. Outbox replay strategy — cross-browser primary + Chromium accelerator

Primary triggers (all browsers, including Safari/iOS and Firefox):

- **App startup**: if `navigator.onLine`, `replayOutbox()` is called
  after the auth + save-registry hydration completes.
- **`online` event** on `window`: trigger `replayOutbox()` if not
  already in progress (debounce 500 ms).
- **`visibilitychange` → visible** while online: trigger
  `replayOutbox()` (catches "user backgrounded the app, switched
  Wi-Fi networks, returned").

Optional accelerator (Chromium only):

- **Workbox `BackgroundSyncPlugin`** on mutating fetches. If the
  network call fails and the user is on Chromium, the request is
  queued in a sync-tag-specific queue and retried by the browser
  when connectivity returns (even with the app closed).
- The plugin's queue is layered on top of our own IndexedDB outbox,
  not a replacement. Our outbox is the source of truth; Background
  Sync just opportunistically retries earlier.

Optional accelerator (post-MVP, installed PWAs with push consent):

- Server can send a Web Push "sync hint" when it expects the client
  to reconnect (e.g. a quorum-reached event for the user's group).
  SW `push` handler triggers `replayOutbox()` if network is
  available.

Rejected: Background Sync as the only mechanism (excludes Safari +
Firefox); manual sync button as the only mechanism (poor UX);
Push-driven as primary (gated by Web Push consent + iOS-installed-only
constraint).

### 6. IndexedDB storage budget — conservative cross-platform

- **Soft cap** (UI shows usage meter + warning): **300 MB**.
- **Warning threshold**: **70 %** of `navigator.storage.estimate().quota`
  OR the soft cap, whichever is lower.
- **Hard cap** (server-side, per ADR-0004 §6.1): **50 saves** per user
  total (active + archived). Combined with A5 §6 typical 5-20 MB per
  save, this caps the worst case around 250 MB - 1 GB per device.
- **Persistence**: call `navigator.storage.persist()` once after the
  first significant user gesture (creating their first save).
  - On Chromium / Firefox: usually granted for installed PWAs or
    high-engagement sites; reduces eviction risk substantially.
  - On Safari / iOS: returns `false` (no-op). We don't treat that as
    an error.
- **Eviction stance**:
  - Chromium / Firefox: LRU across origins when global quota is
    pressured; `persist()` granted ⇒ usually safe.
  - Safari / iOS 17 / iOS 18: installed PWAs survive longer than
    tab-only PWAs but can still be reclaimed under storage pressure.
    **We treat iOS storage as fragile.**

When usage exceeds the warning threshold, we surface a non-modal
banner: *"You're using X MB / Y MB available. Export old saves to
keep your career safe."* with a one-click "Export old saves" action
that pre-selects archives older than 6 months.

### 7. Install prompt UX

- **First load**: never auto-prompt.
- **Trigger window**: after **all** of:
  - At least one match completed OR at least one save created.
  - At least 3 sessions (counted by Identity service).
- **Surface**: a dismissible card in the home dashboard ("Install as
  app for faster loads and offline reliability").
- **Chromium/Edge/Samsung**: stash `beforeinstallprompt` event;
  card's "Install" button calls `event.prompt()`.
- **Safari (iOS/macOS)**: card explains "Share → Add to Home Screen"
  with a platform-specific illustrated guide.
- **Firefox desktop**: card links to browser's PWA install
  documentation (Firefox PWA support is minimal).
- **Dismissal**: snoozes for 7 days.
- **Quota-warning override**: if local storage > 70 % and not
  installed, the storage warning includes "Installing may improve
  reliability" copy.

Manifest configuration (in `apps/web/public/manifest.webmanifest`):

```json
{
  "name": "Klubhaus Elf",
  "short_name": "Klubhaus Elf",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#0a0e1a",
  "background_color": "#0a0e1a",
  "icons": [
    { "src": "/icons/icon-192.png",   "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-256.png",   "sizes": "256x256", "type": "image/png" },
    { "src": "/icons/icon-384.png",   "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512.png",   "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Plus the iOS-specific `<link rel="apple-touch-icon" href="/icons/icon-180.png" sizes="180x180">` in the HTML head.

### 8. Outbox UX — visible Sync / Activity view

Per the locked outbox behaviour of ADR-0011 (hard-reject on conflict)
and ADR-0028 (UUIDv7 + idempotent consumers):

#### 8.1 What's visible

A dedicated **Sync / Activity** view in the app navigation. Shows
three lists:

- **Pending** — commands queued, waiting for server confirmation.
- **Recently synced** — last 24 h of confirmed commands.
- **Failed** — hard-rejects (with reason) + retries-exhausted
  transients.

#### 8.2 Indicators

- A `Sync` icon in the main navigation with a badge counting
  `pending + failed`.
- `navigator.setAppBadge()` (Chromium / installed PWAs) reflects the
  same count on the OS shell.
- A non-modal banner: *"Some offline changes couldn't be applied.
  Review."* when at least one new `failed` command arrives.

#### 8.3 Retry behaviour

- **Transient network errors / 5xx**: exponential backoff per command
  with attempts at `0, 10s, 30s, 2 min, 5 min`. Cap at **7 attempts**.
  After cap → mark "stuck" and surface in the Failed list with a
  one-click "Retry now" action.
- **Hard-reject business errors** (`rejected_with_reason` per
  ADR-0011): **never auto-retry**. The command moves immediately to
  Failed with a human-readable reason and a "Recreate" shortcut that
  opens the originating UI with the old payload pre-filled.

#### 8.4 Reason copy

| `rejected_with_reason` code | User-facing copy |
|---|---|
| `state_changed` | "Situation changed while you were offline; this action is no longer valid." |
| `resource_unavailable` | "The player / club / slot you targeted is no longer available." |
| `deadline_passed` | "The deadline for this action closed while you were offline." |
| `forbidden` | "You no longer have permission or budget for this action." |

#### 8.5 Inline UX for current-screen failures

If a failed command is for the screen the user is currently viewing,
also show an inline error near the relevant control (in addition to
the Activity view entry). Example: a transfer offer rejected with
`state_changed` displays the failure inside the transfer-screen
panel, not only in Sync / Activity.

## Consequences

### Positive

- Singleplayer is genuinely playable offline (per the capability
  matrix in §1).
- Update strategy preserves in-progress state (hybrid smart approach
  beats both naive defaults).
- Offline-replay outbox is robust across all 2026 browsers,
  including Safari / iOS where Background Sync is unavailable.
- Storage strategy is conservative enough to survive iOS eviction
  without losing user data.
- Install prompt timing aligns with player investment (won't pester
  on first load).
- Outbox visibility transparency builds user trust: actions never
  silently disappear.

### Negative

- "Hybrid smart" update strategy needs an `getAppActivityState()`
  selector wired into every long-running flow (match, transfer,
  watch-party); discipline required to keep it accurate.
- `injectManifest` mode requires hand-authoring SW logic; more code
  to maintain than `generateSW`.
- iOS PWA storage cannot be persisted; we expose the user to a
  silent-loss risk that we mitigate but cannot eliminate.
- Outbox UX adds a Sync / Activity view + badge + banner — UI
  surface area we have to build before MP launches.
- Chromium-only Background Sync accelerator creates a
  capability-dependent code path (more branching in the SW).

### Future

- Background Sync support in Safari / Firefox would let us drop the
  Chromium-specific branch.
- Web Push on iOS-installed PWAs is opt-in and already supported in
  17.4+; we will use it for sync-hints once notification UX lands
  (gap E20).
- If we ship Capacitor-native packaging (gap E9), native storage
  replaces IndexedDB and the iOS-eviction risk disappears.
- Phase-2 cloud sync (per ADR-0004 §6.4) layers on top of this
  offline-first model; nothing in A2 needs to change for that.

## Design source

Implements the approved save/career design record [[../../50-Game-Design/GD-0014-save-career-model]] and the current offline/system notes in [[../../50-Game-Design/README]].

## Compliance

The following rules apply to every module in `apps/web`, `packages/sw`,
and the service-worker code itself:

- The SW MUST be built from `apps/web/src/sw.ts` via `injectManifest`.
- Mutating HTTP responses MUST NOT be cached.
- The SW MUST NOT auto-`skipWaiting()` when
  `getAppActivityState().hasInProgress === true`.
- Outbox replay MUST be triggered by all three primary mechanisms:
  startup, `online`, `visibilitychange → visible`.
- Outbox commands MUST be idempotent per ADR-0028 (UUIDv7 request
  IDs).
- `BackgroundSyncPlugin` MUST NOT be relied on as the sole mechanism;
  it is an accelerator only.
- IndexedDB writes for saves MUST go through the save-format library
  (per ADR-0005); no ad-hoc Dexie writes of save data.
- Local storage usage MUST be displayed to the user in a visible
  meter once it exceeds 50 % of the soft cap.
- Failed `rejected_with_reason` commands MUST NOT auto-retry.
- The Sync / Activity view MUST be reachable from the main
  navigation.

CI enforcement:

- Lint rule blocks `caches.put()` of mutating fetch responses.
- Lint rule blocks `self.skipWaiting()` outside the
  hybrid-update-strategy module.
- Test rule: outbox-replay integration test simulates
  startup / `online` / `visibilitychange` triggers and asserts each
  fires a replay.
- Test rule: a "hard-reject golden" test asserts every defined
  `rejected_with_reason` code has a copy entry + Recreate handler.
- Playwright offline E2E: install PWA, go offline, perform
  singleplayer match, reload, assert game state preserved.

## Sources

- [[../../60-Research/pwa-offline-patterns]] — Wave-1 research on
  Dexie 4, Workbox, IndexedDB quotas, iOS ITP.
- Perplexity research, 2026-05-16 (gap A2). Five-question Q&A
  covering SW tooling, Background Sync, IndexedDB quotas, install
  UX, outbox replay.
- Workbox 7.x documentation (Google).
- MDN Service Worker + Background Sync API + StorageManager docs.
- WebKit release notes (iOS 17.4 Web Push for installed PWAs;
  iOS 18 storage updates).
- TanStack Start PWA discussions (GitHub).
- [[ADR-0011-server-authoritative-multiplayer]] §Offline conflict
  policy (B2) — hard-reject + recreate flow.
- [[ADR-0028-postgres-transactional-outbox]] (B4) — UUIDv7, idempotency.
- [[ADR-0004-data-model]] §6 (A4) — save quotas, archive flow.
- [[ADR-0005-save-format]] (A5) — encryption + envelope.
- [[../../60-Research/determinism-and-replay]] (D8) — engine modules
  vendored per version.
- Wave 3 gap A2 Q&A with Nico (2026-05-16): five recommendations
  accepted; update strategy diverged to "hybrid smart".
