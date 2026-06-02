---
title: ADR-0066 Competition & Season Registry sub-aggregate (League Orchestration)
status: proposed
tags: [adr, architecture, ddd, league, competition, season, fixture, registry, pyramid, gap-g1, fmx-79]
created: 2026-06-02
updated: 2026-06-02
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0007-naming-schema]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0058-club-economy-commercial-impact-boundary]]
  - [[ADR-0057-rivalry-system-context]]
  - [[../bounded-context-map]]
  - [[../state-machines/league-week]]
  - [[../../50-Game-Design/GD-0009-league-structure]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../60-Research/competition-registry-sub-aggregate-2026-06-02]]
  - [[../../60-Research/raw-perplexity/raw-competition-registry-sub-aggregate-2026-06-02]]
  - [[../../60-Research/domain-model-audit-and-backlog-2026-06-02]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# ADR-0066: Competition & Season Registry sub-aggregate (League Orchestration)

## Status

proposed

> **Proposed — not self-accepted.** This ADR closes the structural shape of the
> single **critical** audit gap **G1** (R2-14, `prio:critical`). It carries four
> **open questions for Nico** (§Open questions) as option sets, each with a
> recommendation. A separate apply-PR ratifies (flips status, applies the
> bounded-context-map / GD-0009 hunks) per the FMX-24 / ask-first gate. Until then
> `binding: false`.

## Date

- Proposed: 2026-06-02

## Context

FMX-79 (child of the E1 epic FMX-57, the only **critical** gap in the
domain-model audit) resolves audit gap **G1 / R2-14**: the
`league`/`competition`/`fixture` **domain schema** was never locked.

GD-0009 (`binding: true`, approved) ratifies the *direction* — real-world
competition **structures** mirrored, real names never used; promotion/relegation
pyramid + **multiple parallel cups**; Aug–May calendar; default sandbox `Aurelia
Premier` in a fictional country; cups (incl. midweek rotation) explicitly
post-MVP. But no aggregate/entity/value-object/invariant set exists for the
competition/season registry. The bounded-context map names **League
Orchestration** owner of "Season, week, match-day, mode, pause, quorum" (line 37)
and already promises `FixtureCommercialProfile` / `CompetitionRevenueProfile` /
`SeasonAdvanced` to CommercialPortfolio, Regulations and Rivalry (L82–88,
L296–297) — yet nothing produces those facts. The league-week state machine
([[../state-machines/league-week]]) owns the weekly **clock** and assumes
fixtures already exist; nothing owns the **structure/format** they come from.

**Why this matters (gap G1, critical):** Match cannot know what fixture it
simulates, Regulations cannot scope an `EffectiveRuleSet` to a competition, and
CommercialPortfolio cannot attach a revenue profile to a competition until the
competition/season aggregate exists. Locking it now — future-proofed for parallel
cups — prevents an expensive re-model when cups arrive post-MVP.

Research synthesis
[[../../60-Research/competition-registry-sub-aggregate-2026-06-02]] (DDD +
public football data models + IP doctrine, two Perplexity queries archived at
[[../../60-Research/raw-perplexity/raw-competition-registry-sub-aggregate-2026-06-02]])
grounds the model below. Persistence is Postgres per
[[ADR-0027-postgres-data-model]] (supersedes the SurrealDB sketch in ADR-0004);
this ADR is persistence-agnostic and Zod-describable, mapping cleanly onto
ADR-0027 (cross-context refs = opaque branded UUIDv7 columns; embedded VOs =
`jsonb`).

## Open questions for Nico (HITL — not yet answered)

Unlike most context ADRs in this wave, the shaping questions here are **open**;
the proposal carries each as an option set with a recommendation and does **not**
self-decide. Map/GD-0009 hunks are drafted against the recommended options.

1. **D1 — Bounded-context placement.** **[rec. A]** Competition & Season registry
   as a **sub-aggregate cluster inside League Orchestration** (matches map L37;
   keeps clock + structure together; honours existing published-language
   promises) — vs B. a new "Competition & Fixtures" bounded context (orphans the
   promises, duplicates the season clock).
2. **D2 — Aggregate granularity.** **[rec. A]** a shared **`CompetitionSeason`
   concept with distinct aggregate roots per format family** (league ships, cup
   reserved) — vs B. one **polymorphic `Competition` aggregate with a league/cup
   discriminator** (the issue's literal phrasing; simpler but god-object-prone).
   *This ADR documents the model under rec. A and notes the B variant inline.*
3. **D3 — Parallel-cup modelling.** **[rec. A]** sibling competition **editions
   under one Season**, clubs shared by `ClubId` reference — vs B. a dedicated
   cup-calendar aggregate (reserve as a post-MVP seam if midweek rotation needs
   its own lifecycle).
4. **D4 — MVP tier depth.** **[rec. A]** model **pyramid depth >1** in the schema
   but ship **single-tier data** at MVP (per M3-001) — vs B. single-league only,
   no pyramid abstraction (contradicts GD-0009 "Decided/strong").
5. **Cup seeding source** (prior-season standings / coefficient / draw) is
   **reserved for R2-06**, not designed here; the model leaves a `SeedingValue`
   seam.

## Decision (proposed, under recommended options)

Specify the Competition & Season registry as a **sub-aggregate cluster inside
League Orchestration** comprising **four aggregate roots** + reference entities +
value objects, unified by a shared `CompetitionSeason` concept. League is the MVP
family; cup + continental are reserved seams (designed-for, not built).

### Aggregate roots & reference entities

| Element | Kind | Role | MVP? |
|---|---|---|---|
| `Competition` | reference entity (small AR) | Long-lived competition concept (e.g. "Aurelia Premier"): id, IP-clean name ref, kind (`league`/`cup`/`continental`), association/country ref, default format template. | ✅ |
| `Season` | reference entity (small AR) / calendar VO | Calendar concept: id, label (`2027/28`), `CalendarWindow` (Aug–May), status FSM (`planned → active → completed`). | ✅ |
| `LeagueCompetitionSeason` | **aggregate root** (edition) | The per-season league edition: refs `CompetitionId` + `SeasonId` + `LeagueTier`; owns `Participant`s, `CompetitionFormat`, schedule/standings. The unit of domain rules. | ✅ |
| `CupCompetitionSeason` | **aggregate root** (edition) — *reserved* | Per-season cup edition: refs + `Participant`s (with `SeedingValue`) + bracket/group state. Same `CompetitionSeason` concept; distinct invariants. | ⏸ post-MVP (R2-06) |
| `PyramidConfiguration` | **aggregate root** | Tier ranking + promotion/relegation rules for a pyramid: ordered `TierConfiguration`s + `PromotionRule`/`RelegationRule` VOs. | ✅ (depth-1 data) |

> **D2 variant B note:** if Nico chooses the single polymorphic aggregate, collapse
> `LeagueCompetitionSeason` + `CupCompetitionSeason` into one `CompetitionSeason`
> aggregate with a `format`-discriminated body; the invariant catalogue below is
> unchanged, but cup-only and league-only fields become conditionally-present.

### Child entities & value objects (Zod-describable)

```ts
// All ids are opaque branded UUIDv7 (ADR-0027). Cross-context refs (ClubId,
// AssociationId, RegionId) point at other BCs and are never dereferenced here.

CompetitionId        = Branded<'CompetitionId'>
SeasonId             = Branded<'SeasonId'>
CompetitionSeasonId  = Branded<'CompetitionSeasonId'>
PyramidId            = Branded<'PyramidId'>
ParticipantId        = Branded<'ParticipantId'>   // local to an edition
ClubId               = Branded<'ClubId'>           // ref → Club Management

CompetitionKind      = enum('league' | 'cup' | 'continental')

// — Naming: IP-clean reference only (GD-0015 / ADR-0007), never a literal real name
CompetitionNameRef   = { templateId: CatalogCompetitionTemplateId, seed: int }

// — Calendar
CalendarWindow       = { startMonth: 1..12, endMonth: 1..12, crossesYearBoundary: bool }

// — Format (immutable discriminated union; chosen at edition creation)
PointsRule           = { win: int, draw: int, loss: int }            // e.g. 3/1/0
TieBreakerRule       = ordered list of enum('goal_diff'|'goals_for'|'head_to_head'|'wins'|'drawn_lots')
CompetitionFormat =
  | RoundRobin       { legs: 1 | 2, balancedHomeAway: bool, points: PointsRule, tieBreakers: TieBreakerRule }
  | Knockout         { rounds: int, twoLegged: bool, tieBreaker: enum('away_goals'|'extra_time_pens'|'replay'), draw: DrawRule }   // reserved
  | GroupThenKnockout{ group: { groups: int, perGroup: int, advancePerGroup: int, points: PointsRule }, knockout: Knockout }       // reserved

// — Tier / pyramid
TierRank             = PositiveInt                                   // 1 = top
LeagueTier           = { pyramidId: PyramidId, rank: TierRank }
PromotionRule        = { directSlots: int, playoffSlots: int, playoffEntrantsFromBelow: int }
RelegationRule       = { directSlots: int, playoffSlots: int }
TierConfiguration    = { rank: TierRank, competitionIds: CompetitionId[], promotion?: PromotionRule, relegation?: RelegationRule }

// — Participation
SeedingValue         = { pot?: int, coefficient?: int, entryRound?: int }   // cup seam, reserved
Participant          = { id: ParticipantId, clubId: ClubId, registeredName: CompetitionNameRef,
                         seeding?: SeedingValue, association?: AssociationId }

// — Edition aggregate (league family, MVP)
LeagueCompetitionSeason = {
  id: CompetitionSeasonId, competitionId: CompetitionId, seasonId: SeasonId,
  tier: LeagueTier, format: CompetitionFormat /* RoundRobin at MVP */,
  participants: Participant[], status: enum('registering'|'active'|'completed')
}
```

### Invariant catalogue (each a checkable policy)

| # | Invariant | Where enforced |
|---|---|---|
| **I1** | A `CompetitionSeason` edition references **exactly one** `CompetitionId` and **exactly one** `SeasonId`. | edition AR construction |
| **I2** | An edition's `Participant` set has **no duplicate `ClubId`** (a club enters a given competition-season once). | edition AR |
| **I3** | The **same `ClubId` may appear in many editions** within one `SeasonId` (league + N cups) — participation is by reference, never ownership. *(parallel-competition criterion)* | cross-edition (registry invariant; no AR owns the club) |
| **I4** | `RoundRobin` league schedule completeness: each ordered club pair plays exactly `legs` times; with `legs=2`, exactly one home + one away per pair. | edition AR + `SchedulingPolicy` |
| **I5** | `TierRank` values within a `PyramidConfiguration` are **positive, unique, and contiguous from 1** → ordering is **total and acyclic by construction**. | `PyramidConfiguration` AR |
| **I6** | For adjacent tiers `r` and `r+1`, `RelegationRule(r).directSlots + playoffSlots == PromotionRule(r+1).directSlots + playoffSlots` → promotion/relegation slots are **mutually resolvable** (no orphaned/oversubscribed slot). | `PyramidConfiguration` AR |
| **I7** | `CompetitionFormat` is **immutable** after edition creation; a format change is modelled as a new edition, never an in-place mutation. | edition AR |
| **I8** | Every `Competition`/`Season` user-facing name resolves through `CompetitionNameRef` → the IP-clean fictional catalog (GD-0015 / ADR-0007); **no literal real competition name** is storable. *(IP criterion)* | `Competition` AR + catalog ACL |
| **I9** | A `Season` advances `planned → active → completed` monotonically; `SeasonAdvanced` is emitted on each transition (the published fact downstream contexts consume). | `Season` AR + outbox (ADR-0028) |

The canonical **mermaid aggregate diagram** lives in the GD-0009 architecture
appendix ([[../../50-Game-Design/GD-0009-league-structure]] §"Competition & Season
registry") to avoid duplication; this ADR owns the typed model + invariants.

### Parallel-competition model

Editions are siblings under a `Season`; clubs are shared purely by `ClubId`
reference held inside each edition's `Participant`. A club in `Aurelia Premier`
+ two cups in season `2027/28` is three `Participant` rows across three editions,
all pointing at one `ClubId` — **no aggregate owns the club**, so there is no
ownership conflict (satisfies the parallel-competition acceptance criterion, I3).
Cross-competition qualification (cup winner → continental entry) is a **domain
event** (`CompetitionConcluded` → a Process Manager creates an entry
`Participant`), never an object reference.

### Cross-tier movement (Process Manager, not an aggregate method)

Promotion/relegation at season rollover is a **Pyramid-rollover Process Manager**:
on each tier edition's `CompetitionConcluded`, it reads the `PyramidConfiguration`
rules (I5/I6) and registers each club into its next-season tier edition. Per-edition
aggregates stay focused on their own invariants (Vernon process-manager guidance).

### Reserved post-MVP seams (designed-for, not built)

- **Cups (R2-06):** `CupCompetitionSeason` AR + `Knockout`/`GroupThenKnockout`
  formats + `SeedingValue` + bracket/draw model are **named and reserved**; not
  implemented at MVP (GD-0009: cups post-MVP). No foreclosure.
- **Continental:** added as a new `CompetitionFormat` variant + scheduling/
  advancement **policy**, with no change to existing aggregates (F6).
- **Women's calendar offset (R2-13):** `CalendarWindow` is per-`Season`, so an
  offset calendar is data, not a schema change — **not precluded**.

### IP posture (confirms GD-0009 / GD-0015 / ADR-0007)

Competition **formats/structures** (double round-robin, knockout, group+knockout,
pyramid, Aug–May, seeding/draw) are **unprotectable systems/methods**: US 17 USC
§102(b); CJEU *Football Association Premier League* (matches are not "works", no
other IP right). Protected and avoided: real names/logos (trademark + copyright,
incl. confusingly-similar) and a real league's complete roster + exact
promotion/relegation history as a curated dataset (EU Database Directive
96/9/EC). Mitigation: I8 forces all naming through the IP-clean catalog; histories
are generated, not copied. No real competition names appear in this ADR's schema
or examples.

## Consequences

**Positive**

- Closes the single critical gap G1: the four dangling published-language
  contracts (`FixtureCommercialProfile` / `CompetitionRevenueProfile` /
  `SeasonAdvanced`, + Match fixture identity, + Regulations competition scoping)
  now have a producing aggregate to bind to (unblocks FMX-72/74/78/84/91).
- Future-proof for cups + continental + women's calendar without re-modelling
  (reserved seams; format-as-policy).
- Persistence-clean against ADR-0027; Zod-describable for contracts-first.
- IP-clean by construction (I8).

**Negative / constraints**

- Cup family is specified but unbuilt; the `CupCompetitionSeason` reserved seam
  must be honoured when R2-06 opens (a future ADR, not silent extension).
- Four open decisions (D1–D4) gate ratification; the apply-PR cannot land until
  Nico answers. The model is drafted against the recommended options.
- Seeding (R2-06) is intentionally undesigned; the `SeedingValue` seam must not be
  treated as a complete cup-seeding contract.

## HITL gate

This ADR is `proposed` / `binding: false`. The bounded-context-map and GD-0009
hunks are **drafted against the recommended options** but applied only by a
separate ratification PR after Nico answers D1–D4 (ask-first gate;
`needs:nico-decision`). If Nico picks any non-recommended option, the typed model
above is revised before apply. `bounded-context-map.md` is **not edited** in this
PR (ratify gate) — the registry refines the existing League Orchestration row
rather than adding a context, so the apply-PR will amend that row in place once
D1–D4 are answered.
