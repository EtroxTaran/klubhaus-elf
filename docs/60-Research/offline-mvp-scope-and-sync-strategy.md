---
title: Offline MVP Scope and Future Sync Strategy
status: current
binding: true
tags: [research, offline, pwa, mvp, sync, indexeddb]
created: 2026-05-18
updated: 2026-05-18
type: research
related: [[00-summary]], [[pwa-offline-patterns]], [[../00-Index/MVP-Scope]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]]
---

# Offline MVP Scope and Future Sync Strategy

This note promotes the May 2026 scope research into a binding synthesis for the
MVP: build an **offline-ready hybrid-online PWA**, not a full offline-first
domain model in the MVP.

## Question

Would it be more sensible to avoid full offline-first development in the MVP
and plan offline-first for the future instead?

## Answer

Yes. For this project, the best MVP path is **hybrid-online with
offline-ready seams**:

- cache the app shell and safe static/read-only data;
- store local drafts in IndexedDB;
- keep authoritative game progression server-confirmed;
- design contracts, snapshots and versioning so selective offline-first can be
  added later; and
- avoid a full sync/conflict engine before the core game loop proves itself.

This is especially important because future multiplayer is
server-authoritative and competitive integrity must never depend on a client
finalising state offline.

## Findings from best practices

### 1. App shell is safe; domain offline is expensive

PWA best practices consistently separate the app shell from data behavior.
Caching navigation chrome, JS/CSS, icons, static help and fallback pages is a
low-risk service-worker use case. It improves perceived reliability without
claiming that gameplay state is final while offline.

True offline domain support is different: it requires structured local storage,
write queues, retry scheduling, freshness indicators and conflict handling. The
service worker alone does not solve those problems.

### 2. Offline writes need status and conflict semantics

Offline-first and local-first architectures typically use a local database as
the read source, then replay queued writes to the server. That works only when
every mutation has:

- a durable local record;
- a status (`pending`, `submitting`, `confirmed`, `rejected`);
- idempotency keys;
- preconditions or versions;
- retry/backoff policy; and
- conflict handling when the server state changed.

Those requirements are disproportionate for an MVP whose core product question
is "is the roguelite football-manager loop fun?"

### 3. Critical effects should not be silently merged

Last-write-wins is acceptable for low-risk preferences, but not for football
manager domain effects such as match results, finances, transfers, contracts,
week advancement or competitive multiplayer actions. Wrong merges can destroy
trust because a player may lose a transfer, match result or run state.

Therefore MVP mutations should be online-confirmed. Later offline support can
start with singleplayer flows where conflict space is narrower and multiplayer
fairness is not involved.

### 4. Hybrid caching is a deliberate spectrum point

Offline capability is a spectrum:

| Level | Description | Fit for MVP |
|---|---|---|
| App shell | App opens, navigates and explains offline state. | Yes. |
| Hybrid cache | Last confirmed read models and static data are available with freshness labels. | Yes. |
| Local drafts | User can prepare tactics/training/lineups while disconnected. | Yes. |
| Queued writes | Mutations replay later with status and conflict policy. | Later, selectively. |
| Local-first | Client is primary authority with sync as a bonus. | Not MVP. |

The MVP chooses the first three levels and reserves the final two for Phase 2+.

## MVP vs future matrix

| Domain | MVP | Future selective offline |
|---|---|---|
| Static app shell | Precache/cache with update policy. | Same, richer install/update UX. |
| Rules, glossary, help | Cache read-only content. | Versioned content deltas. |
| Dashboard/read models | Cache last confirmed data; mark stale. | Deeper local projections. |
| Tactics/training/lineup | Local drafts only. | Queued intents, then local-authoritative SP. |
| Day/week progression | Online-confirmed command. | Local SP adapter with deterministic replay. |
| Match simulation | Online-confirmed MVP command; deterministic engine contract retained. | Client Worker local authority for SP; server remains MP authority. |
| Transfers/contracts | Online-confirmed. | Draft + revalidate first; SP local authority only when rules mature. |
| Save export/import | Designed but not user-facing. | Full envelope, migrations, import/export UI. |
| Async multiplayer | Out of MVP. | Server-authoritative; offline drafts/intents only. |

## Architecture implications

The MVP should keep the future path open through the following rules:

1. **Contracts first** — commands, queries, events and snapshots stay
   JSON-serialisable and versioned.
2. **Precondition-aware commands** — even online commands carry expected
   versions/state so future queued intents can replay safely.
3. **Repository abstraction** — command/query code should not assume that
   SurrealDB is the only possible singleplayer adapter forever.
4. **Freshness metadata** — cached reads include timestamps/version metadata and
   UI labels for stale data.
5. **Draft staging** — Dexie stores draft payloads separately from confirmed
   read models.
6. **Save envelope reserved** — the encrypted/versioned export/import envelope
   remains the future contract even if user-facing export/import ships later.
7. **No localStorage** — Dexie / IndexedDB stays the browser persistence layer
   for caches, drafts and future local saves.

## Risks avoided by not shipping full offline-first in MVP

- Hidden sync bugs in transfers, contracts, match locks and week advancement.
- False UX promises ("saved" when only queued locally).
- Auth/session expiry during delayed sync.
- Cache leakage between users on shared devices.
- Complex conflict UI before the product loop is proven.
- Overbuilding export/import/migration tooling before save shape stabilises.

## Recommendation

Adopt [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
as the MVP architecture and treat [[pwa-offline-patterns]] as the deeper
Phase-2 implementation reference for selective offline-first and export/import.

## Related

- [[00-summary]] — research hub
- [[../00-Index/MVP-Scope]] — canonical MVP scope
- [[pwa-offline-patterns]] — earlier full offline-first research, now future input
- [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — decision
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] — reserved save/export contract
