---
title: League Orchestration module
status: draft
tags: [architecture, module, league, competition, season, fixtures]
context: league-orchestration
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0066-competition-registry-sub-aggregate]], [[../09-Decisions/ADR-0068-fixture-scheduling-contract]], [[../09-Decisions/ADR-0069-league-regulations-eligibility-handoff]], [[../09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# League Orchestration Boundary

## Purpose

Owns the season/week/match-day clock and the Competition & Season registry:
schedules competitions, deterministically generates fixtures, resolves official
standings and structural outcomes (champion, qualification, promotion/relegation,
season rollover), and publishes competition/season lifecycle and revenue-rule
facts as the supplier of record.

## Owns

- **Competition & Season registry** sub-aggregate cluster (ADR-0066): `Competition`
  + `Season` reference entities; `LeagueCompetitionSeason` edition aggregate root
  (MVP league family); `CupCompetitionSeason` (reserved, post-MVP R2-06);
  `PyramidConfiguration` aggregate root (tier order + promotion/relegation rules).
- Participants by `ClubId` **reference only** (Club Management owns the Club aggregate).
- League-owned `TieBreakerRule`, official current/final ordering and
  `CompetitionStandingsFinalizedV1` (FMX-131).
- Deterministic fixture scheduler (`generateFixtures(participants, format, seed)`,
  pure circle-method + seeded draw under `WorldRng` sub-label
  `fixtures:<competitionSeasonId>:draw`).
- Pyramid-rollover Process Manager (season-rollover promotion/relegation; reads
  League-owned official standings, never the Statistics projection).
- `CompetitionEligibilityPolicy` stateless domain service (scheduling/lifecycle-time
  Regulations + Squad eligibility gate, ADR-0069).
- Season/week/match-day, mode, pause and quorum clock state.

## Public contract

Faithful to the BCM "exposed outputs" row and the ADR contract lists.

**Commands**

- `ScheduleCompetition(competitionId, seasonId, participantClubIds, format) → CompetitionSeasonId` (ADR-0068)
- `GenerateFixtures(competitionSeasonId) → void` — emits `FixturesPublished`; idempotent / fire-once per edition (ADR-0068)

**Queries**

- `NextFixture(scope: {clubId} | {competitionSeasonId})` (ADR-0068)
- `CompetitionStatus(competitionSeasonId) → { stage, currentRound, totalRounds, standingsRef }` — `standingsRef` is the Statistics & Analytics projection ref only, not structural authority (ADR-0068 / FMX-131)
- `GetOfficialCompetitionStandings(competitionSeasonId) → OfficialCompetitionStandings | null` (ADR-0066 / FMX-131)
- `CompetitionRevenueProfileSnapshot(competitionSeasonId, version?)` (ADR-0070)
- `FixtureCommercialProfileSnapshot(fixtureId, version?)` (ADR-0070)

**Domain events** (published-language, via the transactional outbox / ADR-0028)

- `SeasonAdvanced` — on each `Season` `planned → active → completed` transition (ADR-0066 I9)
- `FixturesPublished` — self-contained immutable fixture set (ADR-0068)
- `CompetitionStandingsFinalizedV1` — official final ordering + structural outcomes (ADR-0066 / FMX-131)
- `CompetitionRevenueProfilePublished` (ADR-0070)
- `FixtureCommercialProfilesPublished` (`schemaVersion: 2`, FMX-147) (ADR-0070)
- `CompetitionEligibilityAdvised` — advisory-breach event from the eligibility policy (ADR-0069)

## Storage ownership

- Own Postgres schema/tables only (ADR-0027 data model; cross-context refs are
  opaque branded UUIDv7 columns, embedded VOs are `jsonb`).
- **No shared tables / no cross-context joins** (ADR-0121): every command, query
  and event payload is self-contained; consumers read published-language facts,
  never League tables (ADR-0066 I-set, ADR-0068 F6, ADR-0069 E1, ADR-0070 P1).
- League does not write Club ledger rows (Club Management is sole ledger writer,
  ADR-0050 via ADR-0070 P8) and does not expose tables for CommercialPortfolio joins.

## Consumers / Producers

**Consumers of League outputs**

- Match — fixture identity from `FixturesPublished`.
- Notification / Watch Party — deadlines, `lineup_lock_at` source from `FixturesPublished`.
- CommercialPortfolio (Customer-Supplier + ACL) — `CompetitionRevenueProfilePublished` /
  `FixtureCommercialProfilesPublished` / profile snapshot queries (ADR-0070).
- Rivalry System — `SeasonAdvanced` (deterministic per-season decay batch).
- Statistics & Analytics — `CompetitionStandingsFinalizedV1` for history/leaders/
  display projections (ADR-0066 / FMX-131 / ADR-0081).

**Facts League consumes**

- Regulations & Compliance (OHS) — `EffectiveRuleSet`, `SquadRegistrationCheck`-adjacent
  catalog, `CurrentTransferWindow`, `LicenceTierCompliance` (reserved) (ADR-0069).
- Squad & Player (OHS) — squad-registration facts (queried, never joined) (ADR-0069).
- Match/result facts — source for official standings resolution (ADR-0066 I10).
- Club Management — `ClubId` participant references.

## Invariants

- Editions reference exactly one `CompetitionId` + one `SeasonId`; no duplicate
  `ClubId` per edition; the same `ClubId` may appear across many editions in one
  season (participation by reference, no ownership conflict) (ADR-0066 I1–I3).
- `CompetitionFormat` is immutable after edition creation; format changes are a new
  edition (ADR-0066 I7). Fixtures are immutable after `FixturesPublished`;
  `GenerateFixtures` is idempotent (ADR-0068 F5).
- `PyramidConfiguration` tier ranks are positive, unique, contiguous from 1 (total +
  acyclic ordering); adjacent-tier promotion/relegation slots are mutually resolvable
  (ADR-0066 I5–I6).
- Fixture generation is pure and deterministic: same `(seed, participants, format)`
  ⇒ byte-identical fixtures; the only RNG draw is `fixtures:<id>:draw`; no wall-clock,
  integer-only (ADR-0068 F1–F4).
- League owns the only authority for official ordering used by champion,
  qualification, promotion/relegation and season rollover; the Statistics
  `standingsRef` is display/history only and never decides structural outcomes
  (ADR-0066 I10 / ADR-0068 F8 / FMX-131).
- Eligibility verdicts are pure functions of (command input, aggregate state,
  `ruleSetVersion`) over the immutable per-save `EffectiveRuleSet` snapshot; a
  `mandatory` breach blocks the triggering command (no `FixturesPublished`); only
  opaque `ruleRef` / `RemediationRef` cross the boundary, no rule terminology
  (ADR-0069 E1–E8; IP / `risk:legal`).
- All competition/season names resolve through the IP-clean catalog
  `CompetitionNameRef`; no literal real names are storable (ADR-0066 I8 /
  GD-0015 / ADR-0007). No example uses real competition/sponsor/club/player names
  (ADR-0070 P9).

## Open items

- **Cup family (R2-06):** `CupCompetitionSeason` aggregate, `Knockout` /
  `GroupThenKnockout` formats, `SeedingValue` and bracket/draw model are named and
  reserved by ADR-0066 but unspecified at MVP — no built contract yet.
- **Cup seeding source** (prior-season standings / coefficient / draw) is reserved
  for R2-06; the `SeedingValue` seam is not a complete contract (ADR-0066).
- **Reserved eligibility hooks:** `LicenceTierCompliance` and `FfpRatioCheck` are
  named-not-enforced at single-tier MVP (ADR-0069 E6–E7).
- **G25 deadline-source seam:** the regulatory-window vs watch-party `broadcast_at`
  deadline contradiction is acknowledged and reserved in ADR-0069 §5, not resolved here.
- **Continental / women's-calendar offset** seams (new `CompetitionFormat` variant /
  per-`Season` `CalendarWindow`) are designed-for but not built (ADR-0066).
- ADR-0069 and the Pyramid-rollover promotion-routing detail are `binding: false`
  (ADR-0069 frontmatter); treat the eligibility contract as proposed-but-ratified
  pending the binding flip on apply.
