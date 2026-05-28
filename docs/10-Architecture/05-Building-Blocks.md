---
title: Building Blocks
status: current
tags: [architecture]
updated: 2026-05-28
---

# Building Blocks

The application is a **modular monolith** with thirteen bounded contexts,
primarily implemented in TypeScript. Each context owns its domain logic, state
machine(s), storage isolation, and contracts (commands / queries / domain
events). The match engine is deliberately behind a runtime-neutral port so it
can move to Rust without changing caller contracts.

FMX-13 adds a load-bearing domain port: Club Management owns the
accounting ledger and economy read models behind
[[09-Decisions/ADR-0050-club-economy-accounting-ledger]]. Finance remains inside
Club Management, not a shared utility package.

FMX-25 / FMX-35 ratified the twelfth bounded context, **Manager & Legacy**,
on 2026-05-28 via [[09-Decisions/ADR-0051-manager-and-legacy-context]].
It owns cross-run manager identity, run analysis snapshots, style signals,
archetype candidates, legacy unlock catalog and prestige profile. The MVP
scope stays hooks-only (RunAnalysisSnapshot, ManagerStyleSignals,
PostRunReflection); full perks, legacy carry selection and prestige ladders
remain post-MVP per
[[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]].
Determinism rule: a running save must never read mutable cross-save meta
after creation.

FMX-26 / FMX-36 ratified the thirteenth bounded context, **Staff
Operations**, on 2026-05-28 via
[[09-Decisions/ADR-0053-staff-operations-context]]. It owns staff
contract lifecycle (offered → signed → active → expiring →
expired/terminated/renewed), role assignment (slot + free-role overflow),
pipeline-coverage read model spanning Recruitment / Development /
Training / Medical / Tactics / Match-Day, wage schedule and
specialisation metadata. Wage events emit to Club Management's ledger via
the canonical Customer-Supplier + Anti-Corruption Layer pattern
([[09-Decisions/ADR-0050-club-economy-accounting-ledger]]); no ADR-0050
amendment is required. Consumes People queries (ADR-0052, draft) for
actor identity when ratified; until then sources identity from own staff
roster.

FMX-23 proposes **People / Persona & Skills** behind
[[09-Decisions/ADR-0052-people-persona-and-skills-context]], and FMX-3 proposes
**Narrative** behind
[[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]. Both are
planning context only until ratified. People owns actor/persona truth;
Narrative owns scene/context-card assembly, fallback templates, validation,
provenance, evals and provider adapter boundaries.

> Authority: [[09-Decisions/ADR-0019-modular-monolith-ddd]]. Full map at
> [[bounded-context-map]].

## High-level package layout

```mermaid
flowchart TB
  Web[apps/web] --> UI[packages/ui]
  Web --> Data[packages/game-data]
  Web --> Schema[packages/db-schema]
  Web --> Engine[MatchEnginePort adapter]
  Web --> Dexie[Dexie / IndexedDB cache + drafts]
  Web --> Postgres[PostgreSQL + Drizzle system of record]
  Web -. deferred additive projection/live graph .-> Surreal[SurrealDB]
  Dexie -. future local SP adapter .-> Engine
```

## Bounded context layout

```mermaid
flowchart TB
  subgraph Identity[Identity & Access]
  end
  subgraph Orch[League Orchestration]
  end
  subgraph Club[Club Management]
  end
  subgraph Squad[Squad & Player]
  end
  subgraph Training[Training]
  end
  subgraph Transfer[Transfer]
  end
  subgraph Match[Match]
  end
  subgraph WP[Watch Party]
  end
  subgraph Notif[Notification]
  end
  subgraph Sync[Offline Sync]
  end
  subgraph Audit[Audit & Security]
  end
  subgraph ManagerLegacy[Manager & Legacy (draft)]
  end
  subgraph People[People / Persona & Skills (draft)]
  end
  subgraph Narrative[Narrative (draft)]
  end

  Identity --> Orch
  Identity --> Club
  Orch --> Match
  Orch --> Transfer
  Orch --> WP
  Club --> Squad
  Squad --> Training
  Squad --> Transfer
  Squad --> Match
  Match --> WP
  Match --> Notif
  Transfer --> Notif
  Orch --> Notif
  Sync --> Identity
  Sync --> Club
  Sync --> Squad
  Sync --> Transfer
  Sync --> Match
  Audit --> Identity
  Audit --> Transfer
  Audit --> Match
  Audit --> Orch
  Orch -. run ended .-> ManagerLegacy
  Club -. economy summary .-> ManagerLegacy
  Match -. style summary .-> ManagerLegacy
  Squad -. actor facts .-> People
  Club -. board/fan facts .-> People
  People -. actor cards .-> Narrative
  Match -. committed key events .-> Narrative
  Club -. authoritative facts .-> Narrative
  Transfer -. fixed transfer facts .-> Narrative
  Narrative -. display snapshots .-> Notif
```

## Source folder convention

```text
src/domain/
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
  people/          # draft if ADR-0052 is accepted
  narrative/       # draft if ADR-0054 is accepted
```

Each folder owns `commands.ts`, `events.ts`, `queries.ts`,
`state-machine.ts` (if applicable), `policies.ts`, `repository.ts` and
`index.ts` (public exports only).

## Cross-cutting infrastructure

- **Transactional outbox** ([[09-Decisions/ADR-0028-postgres-transactional-outbox]])
  for same-Postgres-transaction domain-event publication.
- **Club Economy accounting ledger**
  ([[09-Decisions/ADR-0050-club-economy-accounting-ledger]]) for weekly finance
  facts, accounting projections, budget envelopes, country economy profiles and
  insolvency state.
- **Job queue + scheduler** for timers, reminders, escalation,
  auto-resolves.
- **Realtime channel** ([[09-Decisions/ADR-0023-realtime-transport]])
  for league status, notifications and watch-party signals: SSE first,
  Centrifugo when scale/presence/recovery requires it.
- **Notification platform** ([[09-Decisions/ADR-0043-notification-and-messaging-platform]])
  for inbox, preferences, delivery attempts, email, push preparation and
  offline notification projections.
- **Match worker** for server-authoritative simulation behind
  `MatchEnginePort` ([[09-Decisions/ADR-0011-server-authoritative-multiplayer]],
  [[09-Decisions/ADR-0049-swappable-spatial-event-match-engine]]).
- **Spectator service** for watch parties
  ([[09-Decisions/ADR-0015-spectator-snapshot-streaming]]).
- **Hybrid-online PWA seam** ([[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]])
  keeps Dexie scoped to caches/drafts/staging in MVP while preserving a future
  local-authoritative singleplayer adapter.
