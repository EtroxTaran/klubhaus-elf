---
title: Feature - League & Season Orchestration
status: draft
tags: [feature, league-orchestration, league, season, fixtures, standings, promotion-relegation]
context: league-orchestration
created: 2026-06-20
updated: 2026-06-20
type: feature
binding: false
related: [[README]], [[../00-Index/MVP-Scope]], [[../50-Game-Design/GD-0009-league-structure]], [[../10-Architecture/state-machines/league-week]], [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]], [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]], [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]], [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]], [[../60-Research/competition-registry-sub-aggregate-2026-06-02]], [[../60-Research/fixture-scheduling-determinism-2026-06-02]], [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]], [[feature-statistics-analytics-hub-mvp]], [[feature-async-week-loop]]
---

# Feature - League & Season Orchestration

## Goal

Give the player a coherent, replayable season: a fictional league that is
scheduled once and deterministically, a live official standings table they can
read at any point, a week-by-week / match-day progression toward season's end,
and a season rollover that crowns a champion and (where the pyramid has depth)
promotes and relegates clubs into the next season. League Orchestration is the
single authority for the official ordering and every structural outcome derived
from it (champion, qualification, promotion, relegation, rollover) per
[[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
(FMX-131 amendment); Statistics & Analytics owns the display/history projection
surface ([[feature-statistics-analytics-hub-mvp]]).

This spec is player-facing. The aggregate/contract model lives in the four
grounding ADRs and the [[../10-Architecture/state-machines/league-week]] state
machine; this note translates them into user stories and behavioural acceptance
criteria, and parks every still-undecided number/policy under **Open decisions**.

## User stories

- As a manager I am placed into a fictional league (default sandbox `Aurelia
  Premier`) for the current season, with an IP-clean name, so I have a
  competition to play in. *(GD-0009; ADR-0066 I8.)*
- As a manager I can view the full season fixture list for my club and for the
  whole competition, including round, match-day and scheduled date. *(ADR-0068
  `NextFixture` / `FixturesPublished`.)*
- As a manager I can open the live league table at any time and see, per club,
  the played / won / drawn / lost / goals-for / goals-against / goal-difference /
  points columns and the current rank. *(ADR-0066 `OfficialStandingRow`.)*
- As a manager I can see *why* two clubs are ordered the way they are when they
  are level on points (the applied tie-break trace). *(ADR-0066
  `tieBreakerTrace` / `TieBreakerRule`.)*
- As a manager I progress the season match-day by match-day (or week by week in
  an async group); after a match-day resolves, the table and my next fixture
  update. *(league-week FSM; [[feature-async-week-loop]].)*
- As a manager I can see my club's structural standing-position meaning
  in-context (e.g. "currently in a champion / qualification / promotion /
  relegation / play-off slot") so the table tells a story, not just numbers.
  *(ADR-0066 `structuralOutcome`.)*
- As a manager, when every fixture has been played, I see the season finalised:
  a champion is declared and the final table is locked. *(ADR-0066
  `CompetitionStandingsFinalizedV1`.)*
- As a manager in a multi-tier pyramid I see which clubs are promoted and
  relegated at season's end, and my club carried into the correct tier edition
  for the next season. *(ADR-0066 `PyramidConfiguration` /
  Pyramid-rollover process manager.)*
- As a manager I start a new season in continuity with the last: a new edition
  with a fresh fixture draw, my honours/standing-history preserved, and the
  league calendar reset to the Aug–May window. *(ADR-0066 `Season` FSM +
  `SeasonAdvanced`; ADR-0068 per-season re-seed.)*
- As a manager replaying or reloading the same save, I get the **same**
  fixtures, the same table progression and the same champion for the same
  inputs. *(ADR-0068 determinism contract.)*
- As a manager I see league match-days reserved around international windows so
  my league dates do not collide with national-team windows. *(ADR-0084 NT3;
  reserved seam — see Open decisions / Out of release.)*

## In scope (MVP)

The MVP delivers the **league** competition family only; cups and continental
competitions are reserved seams (designed-for, not built) per ADR-0066 and
GD-0009. Confirm the precise MVP slice against [[../00-Index/MVP-Scope]] before
implementation; the canonical scope note is authoritative over any older
"In scope" heading.

- Season + league edition setup for the default sandbox competition, IP-clean
  naming through the catalog. *(ADR-0066 `Season`, `LeagueCompetitionSeason`,
  I8.)*
- Deterministic round-robin fixture generation, published once and immutable.
  *(ADR-0068: stable order → seeded draw → circle method → mirrored second half
  → home/away post-pass.)*
- Per-club and per-competition fixture views (`NextFixture`,
  fixture-list read model).
- Live official standings with the League-owned tie-break rule and an explicit
  tie-break trace. *(ADR-0066 official standings contract.)*
- Match-day / week progression driven by the league-week state machine, ending
  each cycle in post-match reports and an updated table.
- Season finalisation: champion + final locked table +
  `CompetitionStandingsFinalizedV1` published to Statistics.
- Promotion/relegation rollover where pyramid depth > 1 (schema supports depth
  >1; MVP ships single-tier data per ADR-0066 D4 — depth-1 means no
  promotion/relegation movement actually occurs in the default sandbox until
  multi-tier data exists; see Open decisions).
- Season rollover into a new edition with a new fixture draw seed.
- International-window **reservation** in the schedule (windows are reserved from
  MVP even though the playable dual-role is post-MVP). *(ADR-0084 NT3.)*

## Post-MVP scope

- Cup and continental competition families (`CupCompetitionSeason`, knockout /
  group-then-knockout formats, seeding, brackets, draws). *(ADR-0066 reserved
  R2-06; GD-0009 cups post-MVP.)*
- Midweek cup-rotation calendar collision handling via the reserved
  `CalendarSlotPolicy` hook. *(ADR-0068.)*
- Cross-competition qualification (e.g. cup winner → continental entry) as a
  `CompetitionConcluded`-driven process. *(ADR-0066.)*
- Play-off competitions for promotion/relegation slots (the schema names
  `playoffSlots`; the play-off *competition* is undesigned — see Open
  decisions). *(ADR-0066 `PromotionRule` / `RelegationRule`.)*
- The playable national-team dual-role (job market, tournament UX, clash modal);
  MVP ships only the reserved international-window calendar + foreshadowing.
  *(ADR-0084 NT9.)*
- Women's calendar offset (data-only via per-`Season` `CalendarWindow`, not a
  schema change). *(ADR-0066 R2-13.)*

## Out of first release

- Any real competition / club / venue name — all naming is IP-clean by
  construction. *(ADR-0066 I8; GD-0009.)*
- Settlement / accrual of competition and fixture revenue: League **publishes**
  the rule/cadence profiles; CommercialPortfolio owns interpretation. *(ADR-0070
  D3.)* The player-facing money surface is out of this feature.
- The standings *history*, leaders and analytics surface — owned by
  [[feature-statistics-analytics-hub-mvp]] (display projection, not authority).
- Live in-match controls and rendering (owned by the Match context /
  [[../10-Architecture/state-machines/match]] and the first-playable match
  feature).

## Acceptance

Behavioural, Given/When/Then. Where a measurable gate already exists in a
binding ADR it is referenced; no new numeric threshold is invented here
(undecided ones are under **Open decisions**).

1. **League placement.** Given a new save in the default sandbox, When the
   season is set up, Then the manager's club is registered as a `Participant` in
   exactly one active `LeagueCompetitionSeason` edition for the current
   `SeasonId`, and the competition's user-facing name resolves through the
   IP-clean catalog (no literal real competition name is storable). *(ADR-0066
   I1, I8.)*

2. **Fixtures generated once, deterministically.** Given a registered league
   edition with N participants, When `GenerateFixtures` runs, Then a complete
   double round-robin is published where each ordered club pair plays exactly
   once home and once away, total rounds = `2(n−1)` for even n, and re-running
   `GenerateFixtures` for the same edition is a no-op returning the identical
   set. *(ADR-0068 F3, F5.)*

3. **Replay determinism.** Given the same `(seed, participants, format)`, When
   fixtures are regenerated after a reload or replay, Then the published fixture
   set is byte-identical (golden-replay), the only RNG draw being the
   participant draw under sub-label `fixtures:<competitionSeasonId>:draw`.
   *(ADR-0068 F1, F2, F4.)*

4. **Bounded home/away streaks.** Given the published fixtures, When the
   schedule is inspected per club, Then no club exceeds the configured
   `maxStreak` (default 2) consecutive home or away matches, or the residual is
   logged for the odd-n edge. *(ADR-0068 F7.)*

5. **View next fixture / fixture list.** Given a published season, When the
   manager opens their fixture view, Then `NextFixture(clubId)` returns the
   correct upcoming fixture (round, match-day, scheduled date, home/away clubs),
   and the full competition fixture list is viewable for any round. *(ADR-0068
   `NextFixture` / `FixturesPublished`.)*

6. **Live official standings.** Given match results exist for played rounds,
   When the manager opens the league table, Then
   `GetOfficialCompetitionStandings(competitionSeasonId)` returns one
   `OfficialStandingRow` per club with played/won/drawn/lost/GF/GA/GD/points and
   a rank, ordered by the League-owned `TieBreakerRule`. *(ADR-0066 I10.)*

7. **Tie-break is explained and authoritative.** Given two or more clubs level
   on points, When the manager inspects their ordering, Then the order is
   resolved by the League-owned `TieBreakerRule` (not by any Statistics
   projection) and a `tieBreakerTrace` records which criterion broke the tie.
   *(ADR-0066 I10; FMX-131 — see [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]].)*

8. **Standings authority vs display.** Given the Statistics & Analytics
   standings projection may lag or rebuild, When a structural outcome (champion,
   qualification, promotion, relegation, play-off) is decided, Then it is decided
   from the League-owned official ordering and never from the Statistics
   projection; the projection may display the same rows but decides nothing.
   *(ADR-0066 I10; ADR-0068 F8.)*

9. **Match-day progression updates the world.** Given a week/match-day in the
   league-week FSM, When the resolver completes all matches for that match-day
   (`MatchdayResolved`), Then post-match reports are produced, the official table
   reflects the new results, and `NextFixture` advances to the following round.
   *(league-week FSM §3, §5; [[feature-async-week-loop]].)*

10. **Structural slot meaning while in-season.** Given an in-progress season,
    When the manager views the table, Then each club's current
    `structuralOutcome` slot (champion / qualified / promoted / relegated /
    play-off, where applicable) is derivable from the official ordering and the
    `PyramidConfiguration`/competition rules. *(ADR-0066 `structuralOutcome`,
    I5/I6.)*

11. **Season finalisation + champion.** Given every fixture in the edition has a
    result, When the season is finalised, Then exactly one champion is
    determined from the final official ordering, the table is locked, and
    `CompetitionStandingsFinalizedV1` is published to Statistics & Analytics with
    the rule version and source-result watermark. *(ADR-0066 official standings
    contract; I9.)*

12. **Promotion/relegation rollover (pyramid depth > 1).** Given a finalised
    tier edition whose `PyramidConfiguration` has adjacent tiers, When the
    Pyramid-rollover process manager runs, Then it reads the League-owned official
    standings (not the Statistics projection), and the direct promotion +
    relegation slots between adjacent tiers are mutually resolvable with no
    orphaned or oversubscribed slot, registering each affected club into its
    next-season tier edition. *(ADR-0066 I6, I10; cross-tier process manager.)*

13. **Season rollover continuity.** Given a finalised season, When the next
    season is created, Then a new `LeagueCompetitionSeason` edition is created
    with a **new** fixture-draw seed (never a mid-season re-seed), the `Season`
    advances `planned → active → completed` monotonically emitting
    `SeasonAdvanced` on each transition, and the calendar resets to the season's
    `CalendarWindow`. *(ADR-0066 I7, I9; ADR-0068 idempotency/per-season re-seed.)*

14. **IP-clean throughout.** Given any standings row, fixture, champion banner or
    rollover notice surfaced to the player, When it names a competition or club,
    Then the name resolves through the IP-clean fictional catalog and no real
    competition name appears. *(ADR-0066 I8; GD-0009; ADR-0070 P9.)*

15. **International windows reserved.** Given the season's published
    `InternationalWindow`s, When `GenerateFixtures` places league rounds across
    the calendar, Then no league match is scheduled inside an international
    window (lower-priority cups/friendlies may, when those families exist); a
    residual same-day club↔nation collision surfaces as a `DualRoleFixtureClash`
    rather than silently overlapping. *(ADR-0084 NT3, NT5.)*

16. **Commercial profile publication (boundary only).** Given fixtures are
    published, When the league emits its commercial facts, Then
    `FixtureCommercialProfilesPublished` references the immutable
    `FixturesPublished` event and `CompetitionRevenueProfilePublished` is emitted
    before any fixture profile that references its version — League publishes
    rule/cadence facts only and writes no ledger rows. *(ADR-0070 P2, P3, P8.)*

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  — competition/season registry, official standings authority, pyramid +
  rollover (FMX-131).
- [[../10-Architecture/09-Decisions/ADR-0068-fixture-scheduling-contract]] —
  deterministic fixture generation + scheduling commands/queries.
- [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  — supplier contract to CommercialPortfolio (boundary only).
- [[../10-Architecture/09-Decisions/ADR-0084-national-team-dual-role-and-international-window-contract]]
  — international-window reservation honoured by the scheduler.
- [[../10-Architecture/state-machines/league-week]] — weekly/match-day lifecycle
  clock this feature progresses.
- [[feature-statistics-analytics-hub-mvp]] — standings display/history/leaders
  projection consumer (not authority).
- [[feature-async-week-loop]] — async week-cycle cadence that drives
  match-day progression.
- [[../60-Research/competition-registry-sub-aggregate-2026-06-02]],
  [[../60-Research/fixture-scheduling-determinism-2026-06-02]],
  [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]] —
  grounding research.

## Open decisions

Items below are **not** ratified numbers/policies. They must go to Nico before a
build beat (ask-first gate); do not invent them in implementation.

- **Default league size (N participants).** Number of clubs in `Aurelia Premier`
  for MVP is not fixed in the grounding ADRs (`18-club set` appears only as a
  *test* example in ADR-0068 verification, not a ratified league size).
- **Points rule values.** `PointsRule { win, draw, loss }` shape is fixed
  (ADR-0066) but the MVP values (e.g. 3/1/0) are not ratified in these notes.
- **Tie-break ordering for the default league.** `TieBreakerRule` is an ordered
  list over a fixed enum (goal_diff / goals_for / head_to_head / wins /
  drawn_lots); the *specific MVP ordering* for the sandbox is undecided.
- **Promotion/relegation slot counts.** `PromotionRule` / `RelegationRule`
  direct vs play-off slot counts per tier are undecided (depend on the
  multi-tier data, which is itself out of MVP per ADR-0066 D4).
- **Play-off competition design.** `playoffSlots` exist in the schema but the
  play-off *competition format* is explicitly reserved/undesigned (ADR-0066).
- **Whether single-tier MVP data ships any promotion/relegation at all.**
  ADR-0066 D4 = "depth >1 schema, single-tier MVP data"; whether the default
  sandbox exposes a second tier (and thus real promotion/relegation movement) at
  MVP, or only telegraphs it, is a scope call.
- **`maxStreak` value.** ADR-0068 names a *default* of 2; whether 2 is the
  ratified MVP value is not closed.
- **Match-day → next-week advancement UX.** league-week §8 leaves open whether
  `post_match_reports` auto-advances (with a configurable delay) or requires an
  explicit "start next week" action.
- **International-calendar template contents.** The set of `InternationalWindow`s
  (counts, kinds, dates) for the sandbox season is calibration data, not
  ratified here (ADR-0084 NT10 / GD-0043 `legacy.nationalTeam`).
- **Season label / calendar-window months.** The Aug–May window is the ratified
  *direction* (GD-0009); exact `CalendarWindow { startMonth, endMonth }` values
  and `Season` label format for the sandbox are unconfirmed in these notes.
- **Champion/qualification tie to continental entry.** Cross-competition
  qualification is a reserved post-MVP process (ADR-0066); no qualification slots
  resolve to a real downstream competition at MVP.
