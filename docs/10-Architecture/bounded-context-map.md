---
title: Bounded Context Map
status: current
tags: [architecture, ddd, bounded-context, service-ready]
created: 2026-05-16
updated: 2026-05-28
type: architecture
binding: true
related: [[../60-Research/raw-perplexity/raw-architecture]], [[../60-Research/player-strength-presentation]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../60-Research/manager-archetype-roguelite-2026-05-27]], [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]], [[../60-Research/ai-narration-testing-framework-2026-05-28]], [[09-Decisions/ADR-0019-modular-monolith-ddd]], [[09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0043-notification-and-messaging-platform]], [[09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[09-Decisions/ADR-0051-manager-and-legacy-context]], [[09-Decisions/ADR-0052-people-persona-and-skills-context]], [[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]], [[05-Building-Blocks]], [[../30-Implementation/mvp-implementation-roadmap]], [[../30-Implementation/club-economy-accounting-ledger]], [[../30-Implementation/ai-narration-contract-testing-framework]]
---

# Bounded Context Map

The application is structured as a **service-ready modular monolith with
DDD bounded contexts** in TypeScript. Each context owns its domain logic,
its state machine(s), its database tables, and a thin public contract
(commands + queries + domain events) that is JSON-serialisable and
network-transparent.

> Decision authority: [[09-Decisions/ADR-0019-modular-monolith-ddd]] —
> accepted 2026-05-16.

Per-context public contracts and code paths (`context-contracts/`, planned).
MVP build order:
[[../30-Implementation/mvp-implementation-roadmap]].

**Service-ready** means: although MVP ships as one process, every
context's contract is designed as if it could be running on its own
process / pod / region. Splitting a context out later is a deployment
change, not a refactor.

## 1. Sixteen bounded contexts

| Context | Core elements | Exposed outputs |
|---|---|---|
| **Identity & Access** | User, sessions, roles, device state | Auth claims, membership context |
| **League Orchestration** | Season, week, match-day, mode, pause, quorum | League status, deadlines, lifecycle events |
| **Club Management** | Finance ledger, accounting projections, budgets, infrastructure, sponsors, board, fans, insolvency state | Club state, economy snapshots, board pressure, facility modifiers |
| **Squad & Player** | Player base data, fitness, morale, contracts, injuries | Impact Lens projections, squad projections, player state |
| **Training** | Training plan, load, development signals | Training outcomes, fatigue signals, growth deltas |
| **Transfer** | Market valuation, opportunities, offers, clause packages, negotiation cases, deadlines, escalation | Transfer state, valuation bands, pressure signals, completed deals |
| **Match** | Line-up, tactic lock, simulation, results | Result, match events, replay stream |
| **Watch Party** | Polls, scheduling, broadcast, conference | Watch-party status, event timeline |
| **Notification** | Durable notifications, inbox, preferences, subscriptions, schedules, delivery attempts, provider adapters, push preparation, digests | User-facing message projections, unread counters, delivery/audit events |
| **Manager & Legacy** | Manager profile, run analysis snapshots, manager style signals, archetype candidates, legacy unlock catalog, prestige profile | Post-run reflection projections, legacy/prestige configuration for new-save creation, archetype candidate board |
| **Staff Operations** | Staff contract lifecycle, role assignment, pipeline coverage, wage schedule, specialisation metadata | Staff roster + role-assignment board projections, pipeline-coverage snapshots, wage events for the Club Management ledger |
| **Tactics** | Tactic presets, set-piece routine variants, opposition templates, role/duty configurations, tactical-style signal aggregation | TacticSnapshot at lock-time, RoleProfileForPosition queries, OppositionTemplate lookups, SetPieceRoutineCatalog, TacticalIdentityFingerprint for Manager & Legacy |
| **Regulations & Compliance** | Regulatory profiles per regulator + competition + tier (versioned by effective date), transfer-window FSM, work-permit catalog, sanction catalog, licence-tier facility requirements, community-pack rule-override validation policy | EligibilityForTransfer / SquadRegistrationCheck / LicenceTierCompliance / FfpRatioCheck queries, CurrentTransferWindow status, EffectiveRuleSet snapshot at save creation, sanction escalation chain |
| **Rivalry System** | RivalryEdge graph (club pair × sub-score history × threshold-tier FSM), 5-sub-score formula (regional + historical + sporting + fan-incident + transfer-tension), deterministic per-season decay, threshold-tier classification | RivalryScore / IsDerbyFixture / TopRivalsForClub / RivalryIncidentTimeline / RivalryGraphSnapshot / DerbyContext queries; RivalryTierTransitioned events to Fan Ecology + Matchday-Event-Engine + Watch Party + Manager & Legacy + Notification + Match + Tactics + Regulations consumers |
| **Offline Sync** | MVP: cache/draft status and freshness metadata. Future: local outbox, command replay, conflict logic | Draft/cache status now; sync status later |
| **Audit & Security** | Command log, replay protection, abuse detection | Audit trail, anomaly flags |

Player lifecycle and systemic world events are specialised by
[[09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]. They do not
add a thirteenth bounded context. The `WorldEventDirector` is an orchestration
policy over the existing contexts.

Manager & Legacy was ratified 2026-05-28 via
[[09-Decisions/ADR-0051-manager-and-legacy-context]] (FMX-25 dossier +
FMX-35 apply) and is the twelfth context. It owns cross-run manager
identity, run analysis, style signals, archetype candidates, legacy setup
and prestige selection. League, Club Management, Match, Transfer, Squad &
Player and Training provide facts through public contracts; Notification
renders Manager & Legacy projections.

Staff Operations was ratified 2026-05-28 via
[[09-Decisions/ADR-0053-staff-operations-context]] (FMX-26 dossier +
FMX-36 apply) and is the thirteenth context. It owns staff contract
lifecycle, role assignment, pipeline coverage, wage schedule and
specialisation metadata. Staff Operations consumes People (ADR-0052,
draft) actor identity and skill-profile snapshots via query; it does not
own persona, OCEAN substrate or the relationship graph. Wage events flow
to Club Management per [[09-Decisions/ADR-0050-club-economy-accounting-ledger]];
effect-readiness and role-assignment events are consumed by Training,
Transfer, Squad & Player and Match.

Rivalry System was ratified 2026-05-28 via
[[09-Decisions/ADR-0057-rivalry-system-context]] (FMX-34 dossier +
FMX-40 apply) and is the sixteenth context. It owns the rivalry-edge
graph (club pair × sub-score history × threshold-tier FSM), the 5-
sub-score emergent formula (regional + historical + sporting + fan-
incident + transfer-tension, per
[[../50-Game-Design/rivalry-system]]), deterministic per-season decay
and threshold-tier classification (None / Mild / Strong / High /
Volatile). Rivalry consumes Match `MatchResolved` for sporting sub-
score, Transfer `TransferCompleted` for transfer-tension sub-score,
Fan Ecology `FanIncidentLogged` for fan-incident sub-score, Club
Management `ClubFoundedInLocation` / `ClubRelocatedToLocation` for
regional base, and League Orchestration `SeasonAdvanced` for the
deterministic decay batch. It publishes `RivalryScore` /
`IsDerbyFixture` / `TopRivalsForClub` / `RivalryIncidentTimeline` /
`RivalryGraphSnapshot` / `DerbyContext` read models + `Rivalry
TierTransitioned` events to Fan Ecology (atmosphere multiplier),
Matchday-Event-Engine via Club Management (Pyro-incident trigger),
Watch Party (auto-proposal), Manager & Legacy (future archetype
signal), Notification (derby copy), Match (derby classification at
`lineup_locked`), Tactics (future derby-specific opposition awareness)
and Regulations & Compliance (downstream sanction chain via
matchday-event-engine). Consumers treat rivalry as external fact and
apply their own policies in their own contexts - canonical Vernon
scoring-context pattern (analogous to credit rating + customer
affinity + recommendation + supplier-score real-world DDD precedents).
Cross-save rivalry pre-population (era profiles + community overlays)
flows through ADR-0051 Manager & Legacy legacy seeds + ADR-0016
Community Overlay surface per FMX-33 Community Overlay Pipeline;
Rivalry BC owns schema + semantic validation per Vernon.

Regulations & Compliance was ratified 2026-05-28 via
[[09-Decisions/ADR-0056-regulations-compliance-context]] (FMX-30
dossier + FMX-39 apply) and is the fifteenth context. It owns the
versioned multi-regulator rule catalog (UEFA-analogue + national
league analogue + national association analogue per regulator scope ×
competition profile × effective date), the transfer-window FSM, the
work-permit catalog, the sanction catalog and licence-tier facility
requirements. Stock catalogs live in `packages/game-data` per
ADR-0021/0027 conventions; per-save active rule set + community
overrides are copied into the save snapshot at creation per ADR-0051
determinism rule. Multi-context eligibility chains (transfer
completion, squad registration, promotion compliance) run as Process
Manager / Saga inside the BC owning the overall business process -
Transfer for signings, Squad & Player for registration, League
Orchestration for promotion. Regulations owns the rule; each consumer
owns its enforcement via Anticorruption Layer per Vernon's canonical
Tax-catalog pattern. IP-clean rule terminology hardline applies to the
entire Regulations BC per [[../50-Game-Design/GD-0015-ip-clean-data]]
+ [[09-Decisions/ADR-0007-naming-schema]]. Cross-save preset sharing
of community rule overrides flows through FMX-33 Community Overlay
Pipeline per [[09-Decisions/ADR-0016-community-dataset-overrides]];
Regulations BC owns schema + semantic validation per Vernon.

Tactics was ratified 2026-05-28 via
[[09-Decisions/ADR-0055-tactics-context]] (FMX-28 dossier + FMX-37
apply) and is the fourteenth context. It owns the persistent tactics
library: tactic presets (saved → active → archived FSM), set-piece
routine variants (drafted → published → retired FSM), opposition
templates (three-layer model: archetype + sub-archetype +
manager-signature), role/duty configurations (5-layer tactical model)
and tactical-style signal aggregation. Match consumes a `TacticSnapshot`
at `lineup_locked` (canonical Reference + Snapshot pattern - the live
preset may be edited after lock without affecting the in-flight match).
Training and Transfer read `RoleProfileForPosition`; Manager & Legacy
consumes `TacticalIdentityFingerprint` for archetype-style signal
aggregation per GD-0019 §MVP hook model; Staff Operations publishes
`SetPieceCoachReadinessUpdated` for routine-quality multipliers.
Cross-save preset sharing stays scoped to the FMX-33 Community Overlay
Pipeline territory per [[09-Decisions/ADR-0016-community-dataset-overrides]].

### 1.1 Proposed FMX-23 context

[[09-Decisions/ADR-0052-people-persona-and-skills-context]] proposes an
additional bounded context, **People / Persona & Skills**, for actor personas,
the relationship graph, player/staff skill profiles and deterministic dialogue
context cards.

This is not accepted yet. Until ratified, the existing thirteen-context
map (eleven ratified 2026-05-16 + Manager & Legacy ratified 2026-05-28 +
Staff Operations ratified 2026-05-28) remains the baseline and
implementation may only preserve planning hooks. If ADR-0052 is accepted,
People owns personhood and skill/profile projections while Squad &
Player, Training, Match, Club Management, Transfer, Notification, Manager
& Legacy and Staff Operations keep their own authoritative facts. Staff
Operations (accepted via ADR-0053) consumes People queries for actor
identity and skill-profile snapshots when ADR-0052 is accepted; until
then, Staff Operations sources identity from its own staff roster and
treats skill-profile data as stub.

### 1.3 Proposed FMX-3 context

[[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] proposes
an additional bounded context, **Narrative**, for scene/storylet selection,
`NarrativeContextCard` assembly, fallback templates, optional LLM adapter
boundary, validation, provenance, evaluation corpus, playtest evidence and
narrative telemetry.

This is not accepted yet. Until ratified, the existing eleven-context map
remains the baseline and implementation may only preserve planning hooks. If
ADR-0054 is accepted, Narrative becomes the owner of the narration framework.
People remains the source of actor/persona truth, Notification remains the
delivery owner, and Match/Squad/Club/Fan/Transfer contexts remain the
authoritative fact owners.

## 2. Context map (high-level)

```mermaid
flowchart TB
    Identity["Identity & Access"]
    League["League Orchestration"]
    Club["Club Management"]
    Squad["Squad & Player"]
    Training["Training"]
    Transfer["Transfer"]
    Match["Match"]
    WP["Watch Party"]
    Notif["Notification"]
    ML["Manager & Legacy"]
    Staff["Staff Operations"]
    Tactics["Tactics"]
    Reg["Regulations & Compliance"]
    Rival["Rivalry System"]
    Offline["Offline Sync"]
    Audit["Audit & Security"]

    Identity --> League
    Identity --> Club
    Identity --> ML
    Identity --> Staff
    League --> Match
    League --> Transfer
    League --> WP
    League --> ML
    Club --> Squad
    Club --> Match
    Club --> ML
    Club --> Staff
    Squad --> Training
    Squad --> Transfer
    Squad --> Match
    Squad --> ML
    Staff --> Training
    Staff --> Transfer
    Staff --> Squad
    Staff --> Match
    Staff --> Club
    Staff --> Notif
    Staff --> Tactics
    Staff --> Reg
    Identity --> Tactics
    Identity --> Reg
    League --> Tactics
    League --> Reg
    Squad --> Tactics
    Squad --> Reg
    Club --> Reg
    Match --> Tactics
    Transfer --> Reg
    Tactics --> Match
    Tactics --> Training
    Tactics --> Transfer
    Tactics --> ML
    Tactics --> WP
    Reg --> Transfer
    Reg --> Squad
    Reg --> Club
    Reg --> League
    Reg --> Staff
    Reg --> Match
    Reg --> Notif
    Identity --> Rival
    League --> Rival
    Club --> Rival
    Squad --> Rival
    Match --> Rival
    Transfer --> Rival
    Rival --> Match
    Rival --> Club
    Rival --> WP
    Rival --> ML
    Rival --> Notif
    Rival --> Tactics
    Rival --> Reg
    Training --> Squad
    Training --> ML
    Transfer --> ML
    Match --> WP
    Match --> Notif
    Match --> ML
    Transfer --> Notif
    League --> Notif
    ML --> Notif
    Offline --> Identity
    Offline --> Club
    Offline --> Squad
    Offline --> Transfer
    Offline --> Match
    Audit --> Identity
    Audit --> Transfer
    Audit --> Match
    Audit --> League
```

## 3. Communication rules

Contexts may communicate ONLY via three contract types, all of them
JSON-serialisable (Zod schemas) and routed through a transport
abstraction (`Bus` for commands + events, `QueryGateway` for queries).
In MVP the transport is in-process; the same call site works against a
network implementation later.

- **Commands** - explicit change requests (`SubmitTrainingPlan`,
  `CompleteWeek`, `SendTransferOffer`).
- **Queries / Read Models** - UI-friendly read views without mutation.
- **Domain Events** - facts (`WeekCompleted`, `QuorumReached`,
  `TrainingWeekProcessed`, `TransferOfferExpired`, `MatchResolved`).
  Published via the transactional outbox
  ([[09-Decisions/ADR-0013-transactional-outbox]]).

No context reads another context's internal tables or document fields.
No JOIN across context boundaries. No shared lookup tables that bypass
the rule.

Systemic event rules follow the same contract discipline. For example,
Training may emit `TrainingWeekProcessed` and `InjuryRiskUpdated`, Squad &
Player may emit `PlayerDevelopmentDeltaApplied` and `TrainingInjuryOccurred`,
Club Management may emit `VenueEventBooked` and `MatchdayEventTriggered`,
and Notification may render deterministic projections from those facts.

FMX-13 adds the Club Economy accounting boundary
([[09-Decisions/ADR-0050-club-economy-accounting-ledger]]): Transfer, Match,
League, Squad and Stadium/Fan systems may produce facts that affect money, but
only Club Management posts ledger entries and exposes finance read models. No
other context writes finance tables or recalculates accounting state.

FMX-23 proposes the People / Persona & Skills boundary
([[09-Decisions/ADR-0052-people-persona-and-skills-context]]): Squad, Training,
Match, Club, Transfer, Notification and Manager & Legacy may emit facts about
people, but People owns persona projections, relationship edges, skill-profile
snapshots and dialogue context cards. People does not write player attributes,
match facts, finance state or notification delivery records.

FMX-3 proposes the Narrative boundary
([[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]):
owning domains publish facts and read models; Narrative assembles
`NarrativeContextCard`, renders fallbacks, optionally enhances presentation
copy, validates output and emits display snapshots/provenance for
Notification/UI delivery. Narrative does not mutate domain state and generated
prose is never parsed into commands or facts.

### 3.1 Impact Lens projection

Per [[../60-Research/player-strength-presentation]], `ImpactLensProjection`
is a **Squad & Player** read model exposed via the squad `queryGateway`.

It may combine facts from tactics, training, match and scouting only through:

- public queries,
- published domain events,
- or denormalised projection inputs already copied into Squad-owned storage.

It MUST NOT query another context's internal tables. The projection is
read-only: it can rank UI recommendations and Auto-Coach proposals, but command
handlers and workflow transitions must re-read authoritative state from the
owning context.

## 4. Source mapping

The TypeScript code lives under `src/domain/` with one folder per context:

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
  manager-legacy/
  staff-operations/
  tactics/
  regulations/
  rivalry/
  sync/
  audit/
```

Each folder owns:

- `commands.ts` - command type definitions + handlers.
- `events.ts` - domain event type definitions.
- `queries.ts` - read-model definitions.
- `state-machine.ts` (if applicable) - FSM definition.
- `policies.ts` - domain rules.
- `repository.ts` - persistence interface.
- `index.ts` - public exports (commands + queries + events only).

## 5. Swap-ability and service extraction

Each context can be replaced (e.g. swap Training for a new model)
provided it keeps its commands + queries + domain events contracts. The
rest of the system doesn't know which implementation is running.

Service extraction (moving a context out of the monolith into its own
process / pod) is a **deployment change, not a refactor**, because:

- All inter-context calls already go through `Bus` + `QueryGateway`.
- All contracts are already JSON-serialisable.
- Each context already owns its own storage (no shared tables to split).
- Domain events already publish through the transactional outbox.

Anticipated extraction order when scaling demands it:

1. **Match worker** - heaviest CPU + needs anti-cheat isolation.
2. **Job scheduler / Outbox publisher** - long-running supervisor.
3. **Spectator service** - high fan-out per
   [[09-Decisions/ADR-0015-spectator-snapshot-streaming]].
4. **Notification service** - independent scaling per push volume.

Notification extraction follows
[[09-Decisions/ADR-0043-notification-and-messaging-platform]]: Postgres
notification records remain the durable source of truth; SurrealDB projections,
Dexie mirrors, email/push providers and Centrifugo are adapters around that
context, not owners of notification state.

The remaining seven contexts likely stay co-located unless a real
scaling signal forces a split.

This is the explicit user requirement that drove this map: maximum
service-architecture readiness so individual systems can be
re-developed independently and scaled independently. See ADR-0019
§Decision.

## 6. Storage isolation

Each context owns its own PostgreSQL tables (per
[[09-Decisions/ADR-0027-postgres-data-model]] — supersedes the SurrealDB
mechanics in [[09-Decisions/ADR-0004-data-model]]). Tables live in
`public` (platform contexts) or in a `save_<uuidv7hex>` schema (per-save
contexts); access is routed through `QueryGateway.withPlatform` /
`withSave(saveId)` (`@soccer-manager/db`), which sets a `LOCAL search_path`
so a wrong scope yields **relation-not-found**, never a silent cross-tenant
read. The rule is **strict**:

- Cross-context reads happen via the public query layer of the other
  context, not by querying their tables directly.
- No JOIN across context boundaries.
- No shared lookup tables that bypass the rule.
- No "convenience" cross-context reads for performance - if a query is
  too slow, the owning context publishes a read-model.

Accepted in gap B1 Q&A (2026-05-16) at the strict level so service
extraction stays a deployment change rather than a data-migration.

## 7. Future-scope notes (classified future-scope)

MVP staging per [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]:
Offline Sync is intentionally narrow in the first playable. It owns cache
freshness, draft status and "requires connection" surfaces. Queued domain
mutation replay and conflict resolution are preserved as future responsibilities,
not MVP requirements.

- Should Match Engine be a separately deployable service in MVP? No -
  modular monolith. Extraction is allowed post-MVP if perf demands it.
- Where do "AI manager" decisions sit? In the League context (for
  league-wide AI decisions + structural events) and in Club + Transfer
  (for per-club AI behaviour). Locked in
  [[../60-Research/ai-manager-behaviour]] (gap D4, 2026-05-17):
  utility-AI core + FSM situation classifier + heuristic constraints;
  `packages/ai-manager/` framework-agnostic; uses pre-allocated
  `WorldAiMgmtRng` + `MatchAiRng` from D8. Transfer-specific valuation,
  sell pressure, clause pricing and negotiation ownership are detailed in
  [[transfer-market-architecture]] and
  [[../60-Research/transfer-market-simulation]].
- Where do player development, injuries, venue events and narrative events
  sit? Locked in
  [[09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]:
  domain-owned policies inside Training, Squad & Player, Club Management,
  Match, League and Notification, coordinated by deterministic event
  orchestration. No generic random-event bounded context.
- Spectator stream: own context or in Match? Own context (Watch Party)
  because it has independent state machine and scheduling.
- 3D Presentation Layer (post-MVP, iso-stadium / cutscenes /
  backdrops) is **not** a bounded context. It is a UI/presentation
  adapter that consumes existing read-models and domain events
  ([[09-Decisions/ADR-0029-3d-presentation-layer]],
  [[../30-Implementation/3d-presentation-architecture]]). Renderer
  inputs cross the boundary only as immutable JSON `SceneDescriptor`
  objects produced by `apps/web/src/lib/scene-mapper/*` adapters; no
  domain command, query, event or storage is owned by the renderer.
  The match renderer itself is governed by [[09-Decisions/ADR-0024-match-renderer-abstraction]] (Canvas 2D first behind [[09-Decisions/ADR-0026-match-frame-contract]]; PixiJS no longer planned per [[09-Decisions/ADR-0041-presentation-renderer-strategy]]) — not by ADR-0029.
