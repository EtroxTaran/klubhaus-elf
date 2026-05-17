---
title: Raw - Architecture, DDD, State Machines and Offline-First Blueprint
status: raw
tags: [research, raw, perplexity, architecture, ddd, offline-first, state-machine]
created: 2026-05-16
updated: 2026-05-16
type: research-raw
binding: false
related: [[README]], [[../../10-Architecture/bounded-context-map]], [[../../10-Architecture/state-machines/league-week]]
---

# Raw - Architecture, DDD, State Machines and Offline-First Blueprint

> Source: private Perplexity transcripts (2026-05-16), Doc 2 sections 4354-7013.
> Four parallel architecture iterations and one final consolidated blueprint.
> Feeds the proposed ADRs ADR-0010..ADR-0016, the bounded-context map and the
> state-machine notes under [[../../10-Architecture/state-machines/]].

## English summary

All iterations agree on a **DDD-oriented modular monolith** in TypeScript with
serviceable internal modules, server-authoritative multiplayer truth, and an
offline-first PWA shell. Bounded contexts are: Identity & Access, League
Orchestration, Club Management, Squad & Player, Training, Transfer, Match,
Watch Party, Notification, Offline Sync, Audit & Security. Modules only
communicate via three contract types: **Commands** (explicit change
requests), **Queries / Read Models** (UI-optimised reads), **Domain Events**
(facts like `WeekCompleted`, `TransferOfferExpired`, `MatchResolved`).

State machines are mandatory for everything time-critical and multiplayer
relevant. Recommended FSMs:

- **League / Week**: `week_open → quorum_reached → pre_match_countdown →
  matchday_open → matchday_locked → matchday_resolving → post_match_reports
  → week_open`, plus `paused`. Fixed vs Dynamic cadence differ only in the
  trigger for `quorum_reached`.
- **Transfer**: `pending → countered → accepted | rejected | expired |
  escalated`.
- **Watch Party**: `proposed → poll_open → scheduled → setup_locked → live →
  completed | cancelled`.

Persistence/realtime via SurrealDB (live queries for UI projections, not as
the only consistency basis for workflow transitions). Workflows / deadlines
/ scheduled jobs go through a job queue + scheduler + worker. The
**transactional outbox** pattern is required for reliable domain-event
publication ↔ business-state changes.

Offline-first model: **clear split between local intent and server-confirmed
effect**. Singleplayer can simulate locally; multiplayer time, transfers,
week-completion and match results stay server-authoritative. Local
IndexedDB outbox stores commands `queued / syncing / confirmed`; service
worker / background sync replays. Conflict policy per capability (last-write
for UI prefs; server-authoritative for any multiplayer state).

Security: server-authoritative multiplayer; short-lived tokens; idempotent
commands with request IDs against replay; audit trail for all critical
commands; rate-limits on transfers/votes/chat/match commands; least
privilege between modules; user-tied local storage; SW only transports
commands, never decides gameplay.

## 1. Architecture form

- **Modular monolith first, microservice extraction later.** Bounded
  contexts separated in the same TS code-base, with clear interfaces +
  independent test boundaries, but one deployable + runtime in early
  product phase. Reduces network complexity, deployment overhead,
  distributed failure modes, while keeping later extraction open.

## 2. Layer model

| Layer | Responsibility | Tech hint |
|---|---|---|
| PWA / UI Shell | Navigation, screens, local drafts, offline UX | TanStack Start, React, shadcn/ui |
| Application | Commands, policies, orchestration, authorization | TS server functions |
| Domain | Business logic, state machines, contracts | Framework-agnostic TS |
| Persistence / Realtime | Data, read models, live updates | SurrealDB, live queries |
| Workflow / Jobs | Deadlines, replays, auto-resolve, countdowns | Queue + scheduler + workers |
| Security / Audit | AuthN, AuthZ, audit trail, abuse detection | Zero-trust policies, signed commands |

Domain logic must not leak into UI components, DB triggers or ad-hoc
scripts - that is the only way services stay swappable.

## 3. Bounded Context Map (verbatim)

| Bounded Context | Core elements | Exposed outputs |
|---|---|---|
| Identity & Access | User, sessions, roles, device state | Auth claims, membership context |
| League Orchestration | Season, week, match-day, mode, pause, quorum | League status, deadlines, lifecycle events |
| Club Management | Finances, infrastructure, sponsors, board, fans | Club state, board pressure, facility modifiers |
| Squad & Player | Player base data, fitness, morale, contracts, injuries | Squad projections, player state |
| Training | Training plan, load, development signals | Training outcomes, fatigue signals, growth deltas |
| Transfer | Offers, counter-offers, deadlines, escalation | Transfer state, pressure signals |
| Match | Line-up, tactic lock, simulation, results | Result, match events, replay stream |
| Watch Party | Polls, scheduling, broadcast, conference | Watch-party status, event timeline |
| Notification | Inbox, push, reminder, digest | User-facing message projections |
| Offline Sync | Local outbox, command replay, conflict logic | Sync status, retry status |
| Audit & Security | Command log, replay protection, abuse detection | Audit trail, anomaly flags |

These contexts map directly onto Nico's swap-ability requirement: e.g. the
Training service can later be replaced if it keeps its contract
`processWeek(input: TrainingWeekInput) → TrainingWeekOutcome` and doesn't
peek into Match or Notification internals.

## 4. Service contracts and decoupling

Services couple ONLY through:

- **Commands** - `SubmitTrainingPlan`, `CompleteWeek`, `SendTransferOffer`.
- **Queries / Read Models** - UI-friendly read views without mutation.
- **Domain Events** - `WeekCompleted`, `QuorumReached`,
  `TrainingWeekProcessed`, `TransferOfferExpired`, `MatchResolved`.

No service may mutate another context's internal tables, document fields
or private state.

## 5. State machine catalogue

### 5.1 League / Week

States: `week_open`, `quorum_reached`, `pre_match_countdown`,
`matchday_open`, `matchday_locked`, `matchday_resolving`,
`post_match_reports`, `paused`.

Transitions (verbatim):

| From | To | Trigger |
|---|---|---|
| `week_open` | `quorum_reached` | Quorum reached or fixed trigger |
| `quorum_reached` | `pre_match_countdown` | Countdown job created |
| `pre_match_countdown` | `matchday_open` | Timer fired |
| `matchday_open` | `matchday_locked` | Match-day lock time reached |
| `matchday_locked` | `matchday_resolving` | Resolver started |
| `matchday_resolving` | `post_match_reports` | Results produced |
| `post_match_reports` | `week_open` | Reports done, next week opens |
| any | `paused` | Pause vote or admin |

### 5.2 Transfer

States: `pending`, `countered`, `accepted`, `rejected`, `expired`,
`escalated`. Non-response must matter, but not instantly mean strike. Use
multi-stage escalation.

### 5.3 Watch Party

States: `proposed`, `poll_open`, `scheduled`, `setup_locked`, `live`,
`completed`, `cancelled`. Owns its own deadlines because dependent
match-day and tactic locks compute *backwards* from the broadcast time.

## 6. Async cadence rule sets

| Rule set | Description | Audience |
|---|---|---|
| Fixed Cadence | Fixed match-days, hard deadlines | Predictable casual friend groups |
| Dynamic Cadence | Quorum + countdown + max-week-length | Flexible groups, high activity |

Switch only at **season boundary** - mid-week switching breaks fairness.

## 7. Player interaction model

Player-to-player actions like transfers, watch-party polls, pause votes
always need deadlines + fall-backs. Async design becomes fragile if
silence is the strongest strategy.

Transfer escalation (recommended):

1. Offer submitted with response deadline.
2. No answer → `expired`.
3. Repeated ignored strong interest → `agentPressure` / `playerUnrest`
   build.
4. Later stages: transfer requests, media leaks, training mood drop.

## 8. Offline-first model

### Principle

Offline-first only with **clean separation** of local intent and
server-confirmed effect. Android Offline-First guidance + PWA / MDN docs
support this split.

### Capabilities offline (full)

- Singleplayer play.
- Read club data.
- Prep tactics.
- Draft training plans.
- Build transfer / vote drafts.
- Read history, reports, analyses.

### Offline as draft / queue only

- Close MP week.
- Send transfer offer to another manager.
- Vote / pause vote.
- Propose watch-party.
- Submit final match-day relevant changes.

Server confirmation is what makes those actions effective.

### Sync architecture (store-and-forward)

1. Command written to local IndexedDB outbox.
2. UI shows `queued / syncing / confirmed`.
3. Service Worker or background-sync worker replays the queue.
4. Server validates command against current state.
5. Successful commands confirmed, conflicts returned as
   `rejected_with_reason`.
6. Client rebases local projections on server state.

### Conflict resolution per capability

| Capability | Conflict rule |
|---|---|
| UI prefs | Last-write-wins |
| Local notes | Last-write-wins |
| Tactic draft | Newest version, but server decides finally |
| Transfer offer | Never client-final; server-authoritative |
| Close week | Valid only if week-state still open |
| Pause vote | Idempotent command |
| Training plan | Server-rebased on current squad state |

## 9. Runtime distribution

### Client / PWA

UI interaction, local caches, offline queue, singleplayer local sim, local
previews, tactic + training drafts.

### Application Server

AuthN/Z, command validation, domain policies, follow-up job creation,
orchestration between contexts.

### Worker / Domain Processor

Training processing, player development deltas, quorum/countdown jobs,
transfer expiry, escalations, notification digests.

### Match / Simulation Worker

Server-authoritative multiplayer matches, watch-party event feed,
conference feed, replay production.

Matches anti-cheat best practice: everything that is multiplayer truth is
produced or authorised by the server.

## 10. Match, training, character development services

### Training Service contract (verbatim)

```ts
interface TrainingService {
  processWeek(input: TrainingWeekInput): Promise<TrainingWeekOutcome>
}
```

`TrainingWeekOutcome` returns fitness deltas, form/morale signals,
attribute progress, injury risk, tactical familiarity. Pure business
results - no match logic.

### Match Service contract

```ts
interface MatchSimulationService {
  simulate(match: MatchContext): Promise<MatchResult>
}
```

`MatchResult` references an event or snapshot stream so spectator / replay
layers can plug in.

### Player Development Service

Separate service aggregating signals from Training + Matches + age +
morale + minutes + injuries + environment. Reduces coupling so model
swaps don't take Training or Match with them.

## 11. Watch-party and conference mode

- Match service simulates authoritatively.
- Watch-party service consumes replicated match events / snapshots.
- Watch-party owns its own state machine and back-deadlines.
- Spectator delay configurable (15-60 s) to neutralise external
  voice/chat info edge.
- Conference subscribes to multiple feeds, switches by priority (goal,
  penalty, red card, lead change, table swing).

## 12. SurrealDB role

Suitable for: primary store for aggregates and documents, projection
store, realtime feed via Live Queries, flexible relationship modelling.

Best practices:

- Index actual query patterns.
- Use Explain / Analyse for performance.
- Treat Live Queries as a UI / projection mechanism, **not** the only
  consistency basis for critical workflow transitions.
- Under high parallelism, Live Queries are not a perfect global ordering
  source - use authoritative state machines + outbox instead.

## 13. TanStack Start + shadcn/ui

- Same TS domain code shared server + client.
- Server functions = clean command layer.
- shadcn fits the manager UX (activity feeds, data tables, forms,
  dialogs, sheets, banners, timelines).

Recommended frontend layers:

- **App Shell** - navigation, layout, theme, install prompt.
- **Route Loader / Query Layer** - server-side read models.
- **Realtime Layer** - SurrealDB Live Query updates.
- **Local Draft Layer** - IndexedDB + React state for offline drafts.
- **Action Center UI** - deadlines, inbox, open negotiations, league
  status.

## 14. Security blueprint

### Principles

- Zero-trust: no client, device or internal service is implicitly trusted.
- OWASP web-service: consistent AuthN, input validation, least privilege,
  full logging of sensitive actions.

### Key decisions

- Server-authoritative multiplayer truth.
- Short-lived tokens, server-side session check, role-based authorisation.
- Idempotent commands with request IDs / nonces against replay attacks.
- Audit trail for all critical commands.
- Rate-limits on transfers, votes, chat, match commands.
- Least privilege between modules.
- User-tied local data separation in offline mode.

### Offline auth + local data

- Offline access only for already authorised devices.
- Local data strictly user-bound.
- Logout invalidates locally protected data.
- Offline capabilities are limited + explicitly granted.
- No sensitive multiplayer secrets in the generic cache.

### Service Worker security

- HTTPS-only.
- Narrow scope.
- Cache versioning.
- SW buffers + caches, **never** decides game logic.
- Critical commands are transported, not resolved, in the SW.
- Sensitive API responses kept in controlled local stores, not generic
  response cache.

### Inter-service security (future extraction)

- Signed internal requests or mTLS.
- Short-lived service identities.
- Central secrets management.
- Deny-by-default communication.

## 15. Recommended project structure (verbatim)

```txt
src/
  app/
    routes/
    components/
    features/
  server/
    functions/
    loaders/
    auth/
  domain/
    identity/
    league/
    club/
    squad/
    training/
    transfer/
    match/
    watch-party/
    notifications/
    sync/
    audit/
  infrastructure/
    surreal/
    jobs/
    realtime/
    queue/
    cache/
    telemetry/
  shared/
    types/
    schemas/
    contracts/
```

`domain/` must contain *no* framework- or DB-specific dependencies. Only
then can single modules be replaced without rebuilding the whole app.

## 16. Decision sequence (verbatim)

1. Lock down the Bounded Context Map and service contracts.
2. Define FSMs for League, Transfer, Match, Watch-Party.
3. Specify Command/Query model for TanStack Start server functions.
4. Design SurrealDB schemas and projection models.
5. Define offline outbox + IndexedDB projection model.
6. Build worker / scheduler architecture for deadlines, replays,
   escalations.
7. Establish security baseline (audit, idempotency, rate limits, RBAC).
8. THEN implement Match / Training / Watch-Party services in depth.

## 17. Citations preserved

Citations 17_x and 18_x cover: refactoring.guru (state pattern),
gameprogrammingpatterns.com (state), oneuptime.com (TS state machines),
microservices.io + AWS prescriptive (transactional outbox),
event-driven.io (outbox semantics), developer.chrome.com (Workbox
background sync), surrealdb.com docs (live select, live queries,
performance), tanstack.com (Start overview, Start latest), jilles.me
(Start server functions), OWASP web-service cheat-sheet, owasp.org
secure-coding quick reference, osohq.com (microservices security),
developer.android.com (offline-first), MDN (offline / background
operation), dev.to (offline-first conflict resolution), objectbox.io
(customisable conflict resolution), Unity discussions + Unreal forums
(spectator streaming, replay), learn.microsoft.com (PWA best practices),
dev.to (service worker best practices), pixelfreestudio.com (PWA
security). Full URL list in source `.md`; new URLs surface in the
relevant ADRs.
