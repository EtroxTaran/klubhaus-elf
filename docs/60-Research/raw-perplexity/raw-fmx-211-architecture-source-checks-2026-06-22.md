---
title: Raw Source Checks - FMX-211 Architecture Portfolio Review
status: raw
tags: [raw, source-check, fmx-211, architecture, ddd, modularity, tanstack-start, react, drizzle, postgresql, pwa, offline, realtime]
created: 2026-06-22
updated: 2026-06-22
type: research
binding: false
linear: FMX-211
sourceType: primary-docs
related:
  - [[../architecture-decision-portfolio-review-2026-06-22]]
  - [[../../40-Execution/fmx-211-architecture-review-decision-queue-2026-06-22]]
  - [[../../00-Index/Architecture-Map]]
  - [[../../00-Index/Game-Design-Map]]
  - [[../../10-Architecture/bounded-context-map]]
  - [[../../30-Implementation/stack-currency-ledger]]
---

# Raw Source Checks - FMX-211 Architecture Portfolio Review

## Method

FMX-211 reviewed the current `origin/main` vault on 2026-06-22 from branch
`codex/fmx-211-architecture-review`.

Local checks:

- `node scripts/docs-check.mjs` before edits: passed, 1075 notes checked.
- `node scripts/status-consistency-check.mjs` before edits: passed.
- Frontmatter/status scan of ADR, GDDR, feature, module and state-machine
  surfaces.
- Manual review of the entry chain, architecture maps, gameplay maps, bounded
  context map, solution strategy, building blocks, runtime, crosscutting and
  quality notes.

External source checks:

- official Microsoft Learn DDD/microservices architecture guidance;
- Microservices.io transactional outbox pattern;
- TanStack Start official docs via Ref plus Context7;
- Drizzle ORM official docs via Ref plus Context7;
- React official docs via Context7;
- PostgreSQL official documentation and versioning policy;
- MDN Service Worker, IndexedDB, Web Storage, Background Synchronization and
  Server-sent Events docs.

Package-version source checks are not reopened here except where they affect the
architecture verdict. FMX-198 remains the current dedicated stack-currency
ledger.

## Local Vault Scope

| Surface | Count/result | FMX-211 implication |
|---|---:|---|
| Markdown notes checked by docs validator | 1075 | Vault passes structural validation before FMX-211 edits. |
| ADR frontmatter statuses | 112 `accepted`, 11 `superseded` | The technical decision portfolio is closed from a status perspective; review should not create silent new decisions. |
| GDDR / game-design statuses | 47 `accepted`, 1 `current`, 25 `draft`, 1 `superseded` | Gameplay is mostly ratified at GDDR layer; non-numbered system notes remain planning context unless promoted. |
| Feature statuses | 2 `current`, 2 `approved`, 22 `draft` | Feature specs remain intentionally narrower than the ADR/GDDR portfolio. |
| Module note statuses | 7 `current`, 27 `draft` | Per-context module-card coverage is still partial by accepted FMX-169 staged-hybrid policy. |
| State-machine statuses | 11 `current`, 12 `draft` | Current FSM notes exist for the key MVP surfaces, but not all context workflows are promoted. |
| Status consistency check | passed | Remaining issues are semantic/front-door drift, not validator failures. |

Accepted/current notes with `binding: false` exist in several older ADR/GDDR
frontmatters, but the status consistency check currently allows that shape. The
semantic conflict is therefore a governance-cleanup issue, not an invalid vault
state under current tooling.

## Local Semantic Drift Findings

| Surface | Observation | FMX-211 handling |
|---|---|---|
| `Architecture-Map` current binding ADR section | Some accepted ADR entries still say `draft`, `proposed` or "no implementation until accepted" in their prose. | Correct obvious front-door contradictions where the accepted status is already clear; preserve a broader status-body cleanup as follow-up. |
| `bounded-context-map` FMX-132 / FMX-159 / FMX-139 sections | Some accepted 2026-06-19 packets still read as non-binding/draft until Nico answers. | Correct the sections because `Current-State` and accepted ADR frontmatter already define them as accepted. |
| `Game-Design Hub` authority paragraph | Mentions GD-0041 to GD-0043 and GD-0045 as draft/pending even the same page later lists them as accepted. | Correct local contradiction. |
| Accepted ADR/GDDR bodies | Several bodies preserve historical "proposed / binding false" notes below accepted frontmatter. | Do not rewrite every body in FMX-211; recommend a narrow status-body hygiene sweep if Nico wants zero ambiguity before code phase. |

## DDD / Modular Architecture Sources

| Source | Checked fact | FMX-211 implication |
|---|---|---|
| Microsoft Learn, "Use domain analysis to model microservices" (<https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>) | Service boundaries should be designed around business capabilities with loose coupling and high cohesion; bounded contexts and context maps clarify responsibilities and team ownership. | FMX's service-ready modular monolith and 28-context map match current DDD decomposition guidance, provided the context map stays authoritative and public contracts remain explicit. |
| Microsoft Learn, same page | DDD is iterative; service boundaries can be redefined as an application evolves. | FMX's ADR-0089/GD-0038 "28-context ceiling under merge-review gate" is stronger than a frozen final-context claim. |
| Microsoft Learn, "Use tactical DDD to design microservices" (<https://learn.microsoft.com/en-us/azure/architecture/microservices/model/tactical-domain-driven-design>) | A microservice should be no smaller than an aggregate and no larger than a bounded context; aggregates are transactional consistency boundaries and other aggregates are referenced by identity. | FMX's no cross-context FK/relation/join rule, opaque UUID refs and per-context ownership are compatible with tactical DDD. |
| Microsoft Learn, tactical DDD page | Domain events coordinate work across aggregate boundaries; integration events cross service boundaries after the originating transaction commits. | FMX's source-owned domain events plus transactional outbox are compatible with later service extraction. |

## Transactional Consistency Sources

| Source | Checked fact | FMX-211 implication |
|---|---|---|
| Microservices.io Transactional Outbox (<https://microservices.io/patterns/data/transactional-outbox.html>) | The pattern stores outgoing messages in the same database transaction as business entity changes, then a relay publishes them; consumers must be idempotent because relay publication can happen more than once. | ADR-0028 remains the correct consistency floor for cross-context events and future extracted services. ADR-0119's command dedupe and idempotency posture is a necessary companion, not over-engineering. |
| PostgreSQL docs current index (<https://www.postgresql.org/docs/current/index.html>) | Current PostgreSQL documentation line is 18.4; PostgreSQL 19 is beta. | PostgreSQL 18.x is the latest-stable target line, but active repo/tooling mutation still follows FMX-198 D3 and the data-layer bootstrap decision. |
| PostgreSQL versioning policy (<https://www.postgresql.org/support/versioning/>) | PostgreSQL 17 is supported through 2029; 18 is current with 18.4 current minor. | "PostgreSQL 17 supported but not newest" is the correct wording until Nico approves the PostgreSQL 18 code-phase move. |
| PostgreSQL 18 release note (<https://www.postgresql.org/about/news/postgresql-18-released-3142/>) | PostgreSQL 18 adds AIO, UUIDv7, generated-column changes, better upgrade behavior and security/auth updates. | ADR-0027's PostgreSQL direction is reinforced; the exact major version is a pending stack-currency follow-through, not a reason to change the persistence architecture. |

## Frontend / Full-stack Framework Sources

| Source | Checked fact | FMX-211 implication |
|---|---|---|
| TanStack Start overview via Ref (<https://tanstack.com/start/latest/docs/framework/react/overview>) | TanStack Start is in Release Candidate stage, considered feature-complete/API-stable but not bug-free; it provides full-document SSR, streaming, server functions, client/server builds and TanStack Router dependency. | TanStack Start remains a defensible full-stack PWA target, but the RC status should stay visible as a bootstrap risk gate. |
| Context7 TanStack Start docs | `createServerFn`, `createServerOnlyFn`, `createClientOnlyFn` and route SSR settings define server/client execution boundaries. | The repo's rule that secrets and server-only work stay behind server functions/server-only utilities is aligned with the framework model. |
| Context7 React docs | React is a UI/component library and does not prescribe routing/data fetching; Server Components can render server-only data and pass it to interactive components. | React should remain presentation/composition only. Authoritative game state belongs to domain contexts and server-side application/domain services, not React state. |
| Drizzle schema docs via Ref (<https://orm.drizzle.team/docs/sql-schema-declaration>) | Drizzle schemas in TypeScript are the source of truth for queries and migrations; schema files can be organized across folders. | Drizzle fits FMX's contracts-first schema-per-context approach, but FMX must keep its additional no cross-context relation/FK/join guardrails. |
| Drizzle Kit overview via Ref (<https://orm.drizzle.team/docs/kit-overview>) | Drizzle Kit generates and runs SQL migrations from Drizzle schema and supports config-driven PostgreSQL migrations. | ADR-0027 and the forward-only migration posture remain compatible with current Drizzle docs. |

## PWA / Offline / Browser Storage Sources

| Source | Checked fact | FMX-211 implication |
|---|---|---|
| MDN Service Worker API (<https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API>) | Service workers act as proxy servers between web apps, browser and network; they enable offline experiences, request interception, caching, push and background sync access. They require secure contexts. | ADR-0020/0124 service-worker strategy is correct for app shell and cached reads, with HTTPS/localhost constraints. |
| MDN IndexedDB API (<https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>) | IndexedDB stores significant structured client-side data, supports indexes and transactions, and runs asynchronously. | Dexie/IndexedDB is the right client storage substrate for drafts, caches and future local save surfaces. |
| MDN Web Storage API (<https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API>) | `localStorage` and `sessionStorage` are synchronous and can block JavaScript, especially with large data. | "No game state in localStorage" remains correct; localStorage should stay limited to trivial preferences if used at all. |
| MDN Background Synchronization API (<https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API>) | Background Sync has limited availability and is not Baseline; it defers work to a service worker after stable connectivity. | ADR-0090/0124's "Background Sync best-effort only" posture is correct. The authoritative command path cannot depend on it. |

## Realtime Sources

| Source | Checked fact | FMX-211 implication |
|---|---|---|
| MDN Server-sent Events (<https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events>) | Server-sent events let a server push new data to a web page through `EventSource`. | SSE remains a suitable MVP one-way transport for projections/notifications/watch surfaces. |
| Existing ADR-0023 / ADR-0099 / ADR-0102 | FMX already keeps SSE behind `RealtimeTransport` and treats push/realtime/email as accelerants over durable inbox/event-log truth. | Centrifugo/WebSocket scale paths should stay behind the transport interface; not needed to invalidate the MVP architecture. |

## Source URLs

- Microsoft Learn domain analysis: <https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>
- Microsoft Learn tactical DDD: <https://learn.microsoft.com/en-us/azure/architecture/microservices/model/tactical-domain-driven-design>
- Microservices.io transactional outbox: <https://microservices.io/patterns/data/transactional-outbox.html>
- TanStack Start overview: <https://tanstack.com/start/latest/docs/framework/react/overview>
- Drizzle schema declaration: <https://orm.drizzle.team/docs/sql-schema-declaration>
- Drizzle Kit overview: <https://orm.drizzle.team/docs/kit-overview>
- PostgreSQL current docs: <https://www.postgresql.org/docs/current/index.html>
- PostgreSQL versioning policy: <https://www.postgresql.org/support/versioning/>
- PostgreSQL 18 release: <https://www.postgresql.org/about/news/postgresql-18-released-3142/>
- MDN Service Worker API: <https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API>
- MDN IndexedDB API: <https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API>
- MDN Web Storage API: <https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API>
- MDN Background Synchronization API: <https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API>
- MDN Server-sent Events: <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events>
