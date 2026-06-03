---
title: Fixture scheduling contract + determinism (FMX-72)
status: current
tags: [research, league, fixtures, scheduling, determinism, rng, replay, contracts, gap-g1, fmx-72]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-72
sourceType: external
related:
  - [[raw-perplexity/raw-fixture-scheduling-determinism-2026-06-02]]
  - [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[determinism-and-replay]]
  - [[../10-Architecture/state-machines/league-week]]
  - [[../50-Game-Design/GD-0009-league-structure]]
  - [[competition-registry-sub-aggregate-2026-06-02]]
  - [[../30-Implementation/domain-research-workflow]]
---

# Fixture scheduling contract + determinism (FMX-72)

## Question

The ratified Competition & Season registry (ADR-0066 / FMX-79) gives a *static*
structure, but there is no way to **schedule** a competition or **generate** its
fixtures, and no public contract by which other contexts learn fixtures exist or
query the next fixture / competition status. Fixture generation must be
**deterministic** (replay-safe, per the binding determinism contract) but no rule
is specified. What are the public commands/events/queries, and what is the
deterministic generation rule (gap **G1** remediation, named by the audit:
`ScheduleCompetition` / `GenerateFixtures` / `FixturesPublished` / `NextFixture` /
`CompetitionStatus`)?

## Summary

Decision-ready and ratified live by Nico (2026-06-02, all recommended options):

- **Algorithm (D1):** the **circle/polygon method** — double round-robin with a
  **mirrored second half** (equivalent to Berger tables; the clean choice to
  implement deterministically). The scheduler is a **pure function**; the only
  randomness is a **single seeded Fisher-Yates "draw"** of the participant list.
- **Seed source (D1):** the existing **`WorldRng`** stream under a new sub-label
  **`fixtures:<competitionSeasonId>:draw`** (PCG32 + xxhash32 label-derivation per
  [[determinism-and-replay]] §2; adding sub-labels is replay-safe and never
  perturbs other streams).
- **Idempotency (D2):** fixtures are **generated once per competition-season
  edition and immutable**; regenerating from the same seed yields a byte-identical
  set. Promotion/relegation or roster change = a **new season edition with a new
  seed** (aligns with ADR-0066's per-season `LeagueCompetitionSeason` edition).
- **Standings (D3):** `CompetitionStatus` exposes stage/current-round + a
  **reference to a separate standings read model** — it does not own table
  computation (defers the G19 statistics-owner decision).
- **Home/away:** mirrored second half + a **deterministic streak-reduction
  post-pass** (bound consecutive home/away to ≤ 2; fixed iteration order) — a
  documented default, revisitable, not a blocking decision.
- **Contracts** (all Zod-describable, self-contained, no cross-context joins):
  commands `ScheduleCompetition` + `GenerateFixtures`; event `FixturesPublished`;
  queries `NextFixture` + `CompetitionStatus`.

## Inputs (vault, binding/relevant)

- **ADR-0066** (accepted, FMX-79): the Competition & Season registry —
  `LeagueCompetitionSeason` edition owns participants + format + schedule; this
  contract is the *behaviour* that fills the edition's schedule. Participants are
  `ClubId` references.
- **determinism-and-replay.md** (`binding`): PCG32 via `pure-rand`; per-stream
  seed via `xxhash32(label, masterSeed)`; **9 named streams** incl. `WorldRng`
  (#1, "randomness not bound to a specific subsystem"); adding sub-labels by label
  is safe (§2.3); cross-stream draws forbidden (§2.4); sorts use a total-order
  comparator with an entity-id tie-break (rule 5); resim-from-kickoff; integer
  representation.
- **ADR-0018 §3** (`binding`): RNG sub-label convention (e.g.
  `venue:<clubId>:<week>`); adding sub-labels allowed.
- **league-week.md**: the weekly lifecycle SM **consumes** fixtures
  (`matchday_open` etc.) but does not create them — this contract produces them.
- **GD-0009** (`binding`): Aug–May calendar; promotion/relegation pyramid +
  parallel cups (cups post-MVP); IP-clean naming.
- **ADR-0014** (`proposed`, parked): explicit state machines for time-critical
  workflows; this contract defines only the fixture-*creation* interface, not the
  runtime week SM (ADR-0014 territory) — dependency acknowledged.

## Findings

### F1 — Circle method is the deterministic round-robin choice (≡ Berger)
Circle/polygon and Berger tables yield the same per-round pairings; Berger is the
tabulated form. The circle method is trivial to implement for any even n (dummy
"bye" for odd) and is the clean deterministic choice; Berger's value (chess colour
balance) maps to the home/away post-pass (F4). Double round-robin via a **mirrored
second half** guarantees each pair plays once home + once away and is the most
recognizable football pattern.

### F2 — The scheduler is a pure function; one seeded draw is the only RNG
Given a fixed participant order, the circle method + mirror + home/away rules are
fully deterministic. The single legitimate randomness is the **draw** — a seeded
Fisher-Yates shuffle of the participants — so two saves with the same seed produce
byte-identical fixtures. This isolates all schedule randomness to one labelled
draw and keeps the rest a pure transform.

### F3 — `WorldRng` sub-label fits; no new top-level stream needed
Fixture generation is season-setup randomness recurring each season, "not bound to
a specific subsystem" — exactly `WorldRng`'s scope. A sub-label
`fixtures:<competitionSeasonId>:draw` gives full isolation (label-derived seeds
never perturb other streams, §2.3) and independent auditability without growing
the locked 9-stream set. A dedicated `FixtureRng` stream was considered but adds
no isolation a sub-label lacks.

### F4 — Home/away needs a deterministic post-pass
Base circle/Berger schedules still produce 2+ home/away streaks. A small
**deterministic local-search post-pass** (flip home/away on streaks > max, fixed
iteration order, loop until stable) bounds streaks (≤ 2 recommended) and improves
balance while staying replay-safe. Documented as a default; the exact max-streak
is a tunable, not a blocking decision.

### F5 — Generate-once-immutable matches the registry edition model
Idempotent generation (regenerate-from-seed → identical) is the replay-safe model;
mid-season regeneration can rewrite played fixtures and breaks replay. Because
ADR-0066 already models each season as a distinct `LeagueCompetitionSeason`
edition, promotion/relegation naturally maps to a **new edition + new seed** — no
mid-season re-seed is needed. Fixtures are frozen at `FixturesPublished`.

### F6 — Contracts are self-contained (no cross-context joins)
`FixturesPublished` carries the full fixture set (competition + season + per-fixture
date/round/home `ClubId`/away `ClubId`) so Match, Notification and Watch Party
consume without joining League's tables. `NextFixture` answers per-club and
per-competition; `CompetitionStatus` returns stage/round + a standings *reference*.
Per the binding communication rules, all data flows via commands/queries/events.

### F7 — Parallel-competition calendar collisions
Within the Aug–May window, parallel competitions (league + post-MVP cups) can
collide on a club's match-day. MVP ships league-only (one edition per club per
window), so collisions are a no-op; a **reserved hook** (`CalendarSlotPolicy`) is
named for post-MVP midweek cup rotation — not designed here (GD-0009: cups
post-MVP).

## Options matrix (ratified by Nico 2026-06-02)

| Decision | Options | Ratified |
|---|---|---|
| **D1 algorithm + seed** | A. circle method + `WorldRng` sub-label · B. Berger tables · C. circle + dedicated stream | **A** |
| **D2 idempotency** | A. generate-once, immutable (new edition for changes) · B. re-runnable mid-season | **A** |
| **D3 standings** | A. reference a separate standings read model · B. `CompetitionStatus` owns standings | **A** |

(Home/away streak post-pass + mirrored second half = documented defaults, not
gated. Cup calendar collisions reserved for post-MVP.)

## Sources

- Internal: ADR-0066, determinism-and-replay.md, ADR-0018 §3, league-week.md,
  GD-0009, ADR-0014, competition-registry-sub-aggregate-2026-06-02.
- External (raw at [[raw-perplexity/raw-fixture-scheduling-determinism-2026-06-02]]):
  round-robin scheduling (Wikipedia; Trick CMU sports-scheduling survey),
  circle-method ≡ Berger one-factorization, mirrored double round-robin, seeded
  Fisher-Yates + labelled sub-streams, home/away streak post-pass as separate
  optimization, generate-once-immutable.
