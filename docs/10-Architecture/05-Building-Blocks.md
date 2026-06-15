---
title: Building Blocks
status: current
tags: [architecture]
updated: 2026-06-15
---

# Building Blocks

The application is a **service-ready modular monolith**
([[09-Decisions/ADR-0019-modular-monolith-ddd]]), primarily implemented in
TypeScript. Each context owns its domain logic, state machine(s), storage
isolation, and contracts (commands / queries / domain events). The match engine
is deliberately behind a runtime-neutral port so it can move to Rust without
changing caller contracts (cross-runtime determinism + integer/fixed-point
numeric surface per
[[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).

The ratified decomposition is the **28 bounded contexts grouped into six
subdomain clusters** fixed by
[[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]. The clusters
are organisational cognitive-load aids, not new boundaries — a context may relate
across clusters. The canonical context catalog (count, per-context ordinal, scope)
lives in [[bounded-context-map]]; this chapter defers to that map for the
authoritative list and never restates a different count. The six clusters:

1. **Sporting Core** — Match, Tactics, Training, Squad & Player, Stadium
   Operations, Environment & Climate.
2. **Competition & World Simulation** — League Orchestration, Regulations &
   Compliance, Rivalry System, AI World Simulation, Statistics & Analytics.
3. **Club, Finance & Commerce** — Club Management, CommercialPortfolio, Staff
   Operations, Audience & Atmosphere.
4. **Recruitment, People & Career** — Transfer, Scouting, Youth Academy, People /
   Persona & Skills, Manager & Legacy.
5. **Engagement & Narrative** — Narrative, Media Ecology, Notification, Watch
   Party.
6. **Platform & Governance** — Identity & Access, Offline Sync, Audit & Security,
   Community Overlay Pipeline.

FMX-13 adds a load-bearing domain port: Club Management owns the
accounting ledger and economy read models behind
[[09-Decisions/ADR-0050-club-economy-accounting-ledger]]
(amended by ADR-0095's balanced double-entry posting invariant). Finance remains inside
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
([[09-Decisions/ADR-0050-club-economy-accounting-ledger]]); no
ledger-posting-invariant amendment is required. Consumes People queries (ADR-0052, draft) for
actor identity when ratified; until then sources identity from own staff
roster.

FMX-28 / FMX-37 ratified the fourteenth bounded context, **Tactics**, on
2026-05-28 via [[09-Decisions/ADR-0055-tactics-context]]. It owns the
persistent tactics library: tactic presets (saved → active → archived
FSM), set-piece routine variants (drafted → published → retired FSM),
opposition templates (three-layer archetype + sub-archetype +
manager-signature model), role/duty configurations (5-layer tactical
model) and tactical-style signal aggregation. Match consumes a
`TacticSnapshot` at `lineup_locked` (canonical Reference + Snapshot
pattern - the live preset may be edited after lock without affecting the
in-flight match, mirroring Vaughn Vernon's Product Catalog vs Ordering
analogue). Training and Transfer read `RoleProfileForPosition`; Manager
& Legacy consumes `TacticalIdentityFingerprint` for archetype-style
signal aggregation per GD-0019 §MVP hook model; Staff Operations
publishes `SetPieceCoachReadinessUpdated` for routine-quality
multipliers. Cross-save preset sharing stays scoped to the FMX-33
Community Overlay Pipeline territory per
[[09-Decisions/ADR-0016-community-dataset-overrides]].

FMX-34 / FMX-40 ratified the sixteenth bounded context, **Rivalry
System**, on 2026-05-28 via
[[09-Decisions/ADR-0057-rivalry-system-context]]. It owns the
rivalry-edge graph (club pair × sub-score history × threshold-tier
FSM), the 5-sub-score emergent formula (regional + historical +
sporting + fan-incident + transfer-tension, per
[[../50-Game-Design/rivalry-system]]), deterministic per-season decay
and threshold-tier classification (None / Mild / Strong / High /
Volatile). Consumes Match `MatchResolved` for sporting sub-score,
Transfer `TransferCompleted` for transfer-tension sub-score, Fan
Ecology `FanIncidentLogged` for fan-incident sub-score, Club
Management `ClubFoundedInLocation` / `ClubRelocatedToLocation` for
regional base, and League Orchestration `SeasonAdvanced` for the
deterministic per-season decay batch. Publishes `RivalryScore` /
`IsDerbyFixture` / `TopRivalsForClub` / `RivalryIncidentTimeline` /
`RivalryGraphSnapshot` / `DerbyContext` read models +
`RivalryTierTransitioned` events to Fan Ecology (atmosphere
multiplier), Matchday-Event-Engine via Club Management (Pyro-incident
trigger), Watch Party (auto-proposal), Manager & Legacy (future
"derby specialist" archetype signal), Notification (derby copy),
Match (derby classification marker at `lineup_locked`), Tactics
(future derby-specific opposition awareness) and Regulations &
Compliance (downstream sanction chain via matchday-event-engine).
Consumers treat rivalry as external fact and apply their own policies
in their own contexts - **canonical Vaughn Vernon scoring-context
pattern** analogous to credit rating + customer affinity +
recommendation + supplier-score real-world DDD precedents (CQRS read
models + Process Manager / Saga + Domain Service). Cross-save rivalry
pre-population (era profiles + community overlays) flows through
ADR-0051 Manager & Legacy legacy seeds + ADR-0016 community overlay
surface per FMX-33 Community Overlay Pipeline; Rivalry BC owns schema
+ semantic validation per Vernon.

FMX-30 / FMX-39 ratified the fifteenth bounded context, **Regulations &
Compliance**, on 2026-05-28 via
[[09-Decisions/ADR-0056-regulations-compliance-context]]. It owns the
versioned multi-regulator rule catalog (UEFA-analogue + national
league analogue + national association analogue per regulator scope ×
competition profile × effective date), the transfer-window FSM (open
→ countdown → closing → closed), the work-permit catalog, the
sanction catalog and licence-tier facility requirements. Stock
catalogs live in `packages/game-data`; per-save active rule set is
copied into the save snapshot at creation per ADR-0051 determinism
rule (no live reading of mutable global catalog during a save).
Multi-context eligibility chains (transfer completion, squad
registration, promotion compliance) run as **Vernon's Process Manager
/ Saga** in the consuming BC: Transfer for signings, Squad & Player
for registration, League Orchestration for promotion. Regulations owns
the rule; each consumer owns its enforcement via Anticorruption Layer
(canonical Stripe Tax / Avalara Tax-catalog pattern). Community-pack
rule overrides flow through the FMX-33 Community Overlay Pipeline per
[[09-Decisions/ADR-0016-community-dataset-overrides]]; Regulations BC
owns schema + semantic validation per Vernon. IP-clean rule
terminology hardline contained in one context per
[[../50-Game-Design/GD-0015-ip-clean-data]] +
[[09-Decisions/ADR-0007-naming-schema]]; `risk:legal` discipline
applies.

**People / Persona & Skills**
([[09-Decisions/ADR-0052-people-persona-and-skills-context]]) and **Narrative**
([[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]) are part
of the ratified 28-context portfolio per ADR-0089. People owns actor/persona
truth; Narrative owns scene/context-card assembly, fallback templates, validation,
provenance, evals and provider adapter boundaries.

The **Identity & Access** context (Platform & Governance cluster) is explicit
and narrow per
[[09-Decisions/ADR-0123-identity-access-context-definition]]. It owns account,
credential, session, registered-device and global-role/claim truth; publishes
opaque account/session/device identifiers, `PrincipalContext` snapshots and
auth/security identity events; and keeps passkey-first plus password fallback as
the target auth posture. It does **not** own save/watch-party/domain
memberships, business authorization, payments/entitlements, age-assurance
policy, Community Overlay pack lifecycle, Offline Sync queues or Audit &
Security retention. Domains consume principal context and still validate their
own commands.

The **Audit & Security** context (Platform & Governance cluster) is an *explicit
but narrow* bounded context per
[[09-Decisions/ADR-0091-audit-security-context-definition]]: its mandate is
**observe, record, verify, flag — never decide game rules or own canonical game
state**. It owns the append-only security audit log (separate from the domain
event store), tamper-evidence (hash-chaining + signed checkpoints), the
replay-protection / dedup state backing the command envelope, abuse/anomaly
scoring and the GDPR retention/redaction policy. It does **not** own
authentication (Identity & Access), domain command validation (each owning
context re-validates) or the transactional outbox (ADR-0028 infrastructure it
consumes).

FMX-164 / [[09-Decisions/ADR-0119-command-reception-dedup-seam]] makes that
replay/dedup responsibility synchronous at the command-reception boundary:
receive command -> auth/session binding -> canonical payload hash ->
`commandId` dedup/replay gate -> domain validation -> `expectedVersion` /
append -> outbox + security facts. Offline Sync owns the client queue and rebase
UX; the outbox remains committed-event publication/domain mutation trail.

Story-thread ownership across the Narrative and Media Ecology contexts is split
per [[09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]:
**Narrative** is the sole originator of the player-facing `StoryThread`
aggregate, while **Media Ecology** owns the outlet-side `CoverageThread`
aggregate (renamed from `NarrativeThread`). `storyThreadId` is a **correlation
key only** — neither aggregate is shared and neither joins the other's tables;
cross-context flow is Published-Language events via the outbox. Content authoring
(`PressPublicationPolicy`, tone, templates) stays in Narrative; outlet
operational behaviour (cadence, budget, salience) stays in Media Ecology, with
`OutletPublishedStory` as the single hand-off.

> Authority: [[09-Decisions/ADR-0019-modular-monolith-ddd]] (modular-monolith
> ground rules) + [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
> (28-context / six-cluster catalog). Full canonical map at
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

The diagram below shows an **illustrative dependency subset** of the ratified
28-context portfolio (it predates the full catalog and is kept for orientation,
not as the authoritative list). The complete, canonical context map — all 28
contexts, the six clusters and every published-language edge — lives in
[[bounded-context-map]] per
[[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]].

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

The TypeScript code lives under `src/domain/` with one folder per context. The
illustrative subset below is kept for orientation; the **complete folder mapping**
for all 28 ratified contexts is maintained in [[bounded-context-map]] §4
(authoritative per [[09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]).

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
  people/          # People / Persona & Skills (ADR-0052)
  narrative/       # Narrative (ADR-0054)
  # … plus the remaining ratified contexts — see bounded-context-map §4
```

Each folder owns `commands.ts`, `events.ts`, `queries.ts`,
`state-machine.ts` (if applicable), `policies.ts`, `repository.ts` and
`index.ts` (public exports only).

## Cross-cutting infrastructure

- **Transactional outbox** ([[09-Decisions/ADR-0028-postgres-transactional-outbox]])
  for same-Postgres-transaction domain-event publication.
- **Club Economy accounting ledger**
  ([[09-Decisions/ADR-0050-club-economy-accounting-ledger]]) for
  weekly finance facts, accounting projections, budget envelopes, country economy
  profiles and insolvency state.
- **Job queue + scheduler** for timers, reminders, escalation,
  auto-resolves.
- **Realtime channel** ([[09-Decisions/ADR-0023-realtime-transport]])
  for league status, notifications and watch-party signals: SSE first,
  Centrifugo when scale/presence/recovery requires it.
- **Notification platform** ([[09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]])
  for inbox, preferences, delivery attempts, email, push preparation and
  offline notification projections.
- **Match worker** for server-authoritative simulation behind
  `MatchEnginePort` ([[09-Decisions/ADR-0011-server-authoritative-multiplayer]],
  [[09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]).
- **Spectator service** for watch parties
  ([[09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]).
- **Hybrid-online PWA seam** ([[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]])
  keeps Dexie scoped to caches/drafts/staging in MVP while preserving a future
  local-authoritative singleplayer adapter.
