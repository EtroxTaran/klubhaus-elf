---
title: ADR-0068 Fixture scheduling contract + determinism (League Orchestration)
status: accepted
tags: [adr, architecture, league, fixtures, scheduling, determinism, rng, replay, contracts, gap-g1, fmx-72]
created: 2026-06-02
updated: 2026-06-08
accepted_at: 2026-06-02
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0081-statistics-analytics-read-model-owner]]
  - [[ADR-0014-state-machines]]
  - [[../state-machines/league-week]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0009-league-structure]]
  - [[../../60-Research/fixture-scheduling-determinism-2026-06-02]]
  - [[../../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-fixture-scheduling-determinism-2026-06-02]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# ADR-0068: Fixture scheduling contract + determinism (League Orchestration)

## Status

accepted

> **Ratified by Nico 2026-06-02** (decisions taken live before drafting). The
> three open questions resolved on the recommended options: **D1 = A** (circle
> method + `WorldRng` sub-label), **D2 = A** (generate-once, immutable),
> **D3 = A** (`CompetitionStatus` references a separate standings read model).
> Closes the scheduling half of audit gap **G1**. Builds on the ratified
> Competition & Season registry ([[ADR-0066-competition-registry-sub-aggregate]]).

> **2026-06-05 follow-up (FMX-94 / G19).** Proposed
> [[ADR-0081-statistics-analytics-read-model-owner]] names the pending
> `standingsRef` owner as projection-only **Statistics & Analytics**. Until
> ADR-0081 is ratified, ADR-0068 remains accepted for fixture scheduling and
> still treats standings as an external read-model reference.

## Date

- Proposed + Accepted (Nico): 2026-06-02

## Context

ADR-0066 locked the *static* Competition & Season registry; nothing yet
**schedules** a competition or **generates** its fixtures, and no public contract
lets other contexts learn fixtures exist (Match has nothing to simulate,
Notification no deadlines, Watch Party no `lineup_lock_at` source). The audit
(gap **G1**) names the exact surface: commands `ScheduleCompetition` /
`GenerateFixtures`, event `FixturesPublished`, queries `NextFixture` /
`CompetitionStatus`. Generation must satisfy the binding determinism contract
([[../../60-Research/determinism-and-replay]]) — same `(seed, inputs)` →
byte-identical fixtures across save/reload/replay.

The `league-week` state machine **consumes** fixtures but does not create them;
this ADR defines only the fixture-*creation* interface (runtime week orchestration
stays [[ADR-0014-state-machines]] territory, parked). Grounding:
[[../../60-Research/fixture-scheduling-determinism-2026-06-02]] (+ raw capture).

## Decision (ratified — Nico 2026-06-02, D1–D3 all option A)

### 1. Deterministic generation rule

Fixture generation is a **pure function**
`generateFixtures(participants, format, seed) → Fixture[]`:

1. **Stable base order** — sort participants by `ClubId` (total order, the
   determinism tie-break rule).
2. **Seeded draw** — a **Fisher-Yates shuffle** of the participant list, drawing
   from `WorldRng` under sub-label **`fixtures:<competitionSeasonId>:draw`**
   (PCG32 via `pure-rand`; seed = `xxhash32('fixtures:<competitionSeasonId>:draw',
   masterSeed)`, per [[../../60-Research/determinism-and-replay]] §2). This is the
   **only** RNG the scheduler touches.
3. **Single round-robin** — the **circle/polygon method** over the drawn order
   (fixed pivot + rotate; dummy "bye" for odd n). Equivalent to Berger tables.
4. **Double round-robin** — **mirrored second half**: round `R+r` repeats round
   `r` with home/away swapped, guaranteeing each pair plays once home + once away.
5. **Home/away post-pass** — a deterministic local search (flip on streaks >
   `maxStreak`, default `maxStreak = 2`, fixed iteration order, loop until stable)
   bounds consecutive home/away runs. Pure; no RNG.
6. **Calendar placement** — rounds laid across the Aug–May window
   (`CalendarWindow` from the `Season`). A reserved `CalendarSlotPolicy` hook is
   named for post-MVP midweek cup rotation; MVP is league-only so no parallel
   collision occurs.

No transcendental math, no wall-clock, integer-only (determinism rules 1–9).

### 2. Idempotency

`GenerateFixtures` is **fire-once per `LeagueCompetitionSeason` edition** and the
result is **immutable** after `FixturesPublished`. Regenerating with the same
seed + participants yields a byte-identical set (a golden-replay assertion).
Promotion/relegation or roster change is modelled as a **new season edition with
a new seed** (per ADR-0066's per-season edition model) — never a mid-season
re-seed.

### 3. Public contracts (Zod-describable; self-contained; no cross-context joins)

```ts
// — Commands —
ScheduleCompetition = {                       // bind a competition+season into the calendar
  competitionId: CompetitionId,
  seasonId: SeasonId,
  participantClubIds: ClubId[],               // from the registry edition
  format: CompetitionFormat                   // RoundRobin at MVP (ADR-0066)
} → CompetitionSeasonId

GenerateFixtures = {                          // produce + publish the fixture set (idempotent)
  competitionSeasonId: CompetitionSeasonId
} → void   // emits FixturesPublished; no-op if already published

// — Domain event (self-contained payload) —
FixturesPublished = {
  competitionSeasonId: CompetitionSeasonId,
  competitionId: CompetitionId,
  seasonId: SeasonId,
  drawSeedLabel: string,                      // "fixtures:<competitionSeasonId>:draw" (audit)
  fixtures: ReadonlyArray<{
    fixtureId: FixtureId,                     // branded UUIDv7
    round: int,                               // 1..(2(n-1))
    matchday: int,
    scheduledDate: DateOnly,                  // within the Season CalendarWindow
    homeClubId: ClubId,
    awayClubId: ClubId
  }>
}

// — Queries / read models —
NextFixture(scope: { clubId: ClubId } | { competitionSeasonId: CompetitionSeasonId })
  → { fixtureId, round, matchday, scheduledDate, homeClubId, awayClubId } | null

CompetitionStatus(competitionSeasonId: CompetitionSeasonId) → {
  stage: 'scheduled' | 'in-progress' | 'completed',
  currentRound: int,
  totalRounds: int,
  standingsRef: StandingsReadModelRef          // reference only — standings owned elsewhere (G19)
}
```

`FixturesPublished` routes through the transactional outbox
([[ADR-0028-postgres-transactional-outbox]]); consumers (Match, Notification,
Watch Party, CommercialPortfolio via FMX-78, Regulations via FMX-74) read the
self-contained payload — no cross-context table join.

### 4. Sequence

```mermaid
sequenceDiagram
    participant Caller as League Orchestration (caller)
    participant Reg as Competition&Season registry (ADR-0066)
    participant Sched as Fixture scheduler (pure fn)
    participant Outbox as Transactional outbox
    participant Cons as Consumers (Match / Notification / Watch Party)
    Caller->>Reg: ScheduleCompetition(competition, season, participants, format)
    Reg-->>Caller: competitionSeasonId (edition)
    Caller->>Sched: GenerateFixtures(competitionSeasonId)
    Note over Sched: sort by ClubId → seeded draw<br/>(WorldRng sub-label fixtures:&lt;id&gt;:draw) →<br/>circle method → mirror 2nd half → home/away post-pass
    Sched->>Outbox: FixturesPublished(self-contained fixtures)
    Outbox-->>Cons: FixturesPublished
    Cons->>Caller: NextFixture / CompetitionStatus (queries)
```

## Invariants (checkable policies)

| # | Invariant | Where enforced |
|---|---|---|
| **F1** | `generateFixtures` is pure: output depends only on `(participants, format, seed)`; no wall-clock, no `Math.random`, integer-only. | scheduler |
| **F2** | The only RNG draw is the participant **draw**, from `WorldRng` sub-label `fixtures:<competitionSeasonId>:draw`; no other stream is touched. | scheduler + ADR-0018 audit |
| **F3** | Double round-robin completeness: each ordered pair plays exactly once home and once away; total rounds = `2(n−1)` (n even). | scheduler + test |
| **F4** | Same `(seed, participants, format)` → **byte-identical** fixture set (golden-replay). | golden-replay test |
| **F5** | Fixtures are immutable after `FixturesPublished`; `GenerateFixtures` is idempotent (re-run = no-op / identical). | edition AR |
| **F6** | `FixturesPublished` is self-contained — every consumer field is in the payload; no cross-context join implied by any command/query. | contract review |
| **F7** | Consecutive home or away runs per club ≤ `maxStreak` (default 2) after the post-pass, or the residual is logged (odd-n edge). | scheduler post-pass + test |
| **F8** | `CompetitionStatus.standingsRef` is a reference only; this contract computes no standings table (G19 deferred). | contract review |

## Verification

- Golden-replay: a fixed `(seed, 18-club set)` regenerates a byte-identical
  fixture set on re-run (F4); double round-robin completeness asserted (F3).
- Determinism isolation: changing an unrelated `WorldRng` sub-label draw count
  does not change the fixture set (F2).
- Post-pass: assert no club exceeds `maxStreak` consecutive home/away for even n
  (F7).
- Contract unit tests: `FixturesPublished` round-trips through Zod; `NextFixture`
  answers per-club and per-competition; `CompetitionStatus` exposes
  stage/round/`standingsRef`.

## Consequences

**Positive**
- Closes the scheduling half of gap G1; turns the static registry into a
  schedulable, queryable, event-emitting capability. Unblocks FMX-74 (Regulations
  eligibility hand-off) and FMX-78 (commercial/revenue profiles), plus Match /
  Notification / Watch Party calendar consumers.
- Fully replay-safe within the existing determinism contract (no new top-level
  RNG stream; one labelled sub-stream).
- Idempotent + immutable fixtures align with ADR-0066's per-season editions.

**Negative / constraints**
- The `fixtures:<competitionSeasonId>:draw` sub-label semantics are part of the
  replay contract: changing the draw/shuffle algorithm requires an
  `engineVersion` bump so old saves reproduce (determinism rule 11).
- Standings are resolved by the FMX-94 follow-up proposal:
  [[ADR-0081-statistics-analytics-read-model-owner]] names projection-only
  Statistics & Analytics as the `standingsRef` owner. Until ratification,
  `CompetitionStatus` still only references standings and does not compute them.
- Parallel-competition calendar collisions are reserved (post-MVP cups), not
  designed — the `CalendarSlotPolicy` hook must be honoured when cups arrive.

## HITL gate

`accepted` / `binding: true` — Nico ratified D1–D3 live on 2026-06-02 before
drafting. The `bounded-context-map.md` League Orchestration **exposed-outputs**
row should list `FixturesPublished` + the scheduling commands/queries; that
in-place map edit is folded into the FMX-79 ratification apply-PR (#121, which
already amends the same row) to avoid a conflicting double-edit. Standings owner
(G19) is now proposed in [[ADR-0081-statistics-analytics-read-model-owner]].
