---
title: Handoff FMX-78 Fixture commercial and competition revenue profiles
status: wrapped
tags: [meta, execution, handoff, league, fixture, competition, commercial, revenue, fmx-78]
created: 2026-06-03
updated: 2026-06-03
type: handoff
related:
  - [[../../60-Research/fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../../60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../../30-Implementation/club-economy-commercial-contracts]]
  - [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
---

# Handoff: FMX-78 Fixture commercial and competition revenue profiles (2026-06-03)

## Goals

- Define the League Orchestration -> CommercialPortfolio published-language
  contract for `FixtureCommercialProfile` and `CompetitionRevenueProfile`.
- Ground the contract in real football competition mechanics, DDD supplier /
  consumer best practice and management-game player-presentation precedent.
- Keep all architecture/gameplay choices behind Nico's ask-first gate.

## Completed

- Synced `main` and created branch
  `codex/fmx-78-fixture-commercial-revenue-profiles`.
- Claimed Linear issue FMX-78 by moving it to `In Progress`.
- Ran Perplexity research across real-world football revenue mechanics,
  source hardening, DDD event/query publication and management-game finance
  presentation.
- Archived raw research:
  [[../../60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03]].
- Added synthesis:
  [[../../60-Research/fixture-commercial-revenue-profiles-2026-06-03]].
- Added proposed ADR:
  [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]].
- Updated [[../../30-Implementation/club-economy-commercial-contracts]] so
  `FixtureCommercialProfile` is League-owned stable profile data and not a
  Rivalry/Audience/Stadium/Weather blend.
- Updated [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  to clarify player-facing commercial explanations are composed by
  CommercialPortfolio from multiple context facts.
- Updated the older FMX-45 cup-revenue note so CommercialPortfolio, not Club
  Management, consumes `CompetitionRevenueProfile`; Club Management remains the
  ledger writer.
- Anchored the new notes in Current State, Research Map, Decision Log and the
  raw Perplexity index.
- Nico ratified A/A/A on 2026-06-03; ADR-0070 is now accepted/binding and the
  bounded-context map lists the accepted profile events + snapshot queries.

## Open Tasks

- Open the FMX-78 docs PR and let the normal `docs-check` + `linear-id` gates
  verify it.
- Future FMX-92 work can use `operatingCostAttachmentKey` as the
  background-fast `MatchdayOperatingCostSummary` hook.

## Decisions made

- **D1 = A:** event-plus-query.
- **D2 = A:** League-owned stable fixture/competition commercial facts only.
- **D3 = A:** League owns rule/cadence profiles and CommercialPortfolio owns
  settlement/accrual interpretation.

## Blockers

- None for FMX-78 after ratification and validation.

## Durable notes updated

- `docs/60-Research/raw-perplexity/raw-fixture-commercial-revenue-profiles-2026-06-03.md`
- `docs/60-Research/fixture-commercial-revenue-profiles-2026-06-03.md`
- `docs/10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract.md`
- `docs/30-Implementation/club-economy-commercial-contracts.md`
- `docs/50-Game-Design/GD-0022-economy-commercial-impact-and-contracts.md`
- `docs/60-Research/cup-and-competition-revenue-profiles-2026-05-28.md`
- `docs/60-Research/raw-perplexity/README.md`
- `docs/00-Index/Research-Map.md`
- `docs/00-Index/Current-State.md`
- `docs/00-Index/Decision-Log.md`

## Next step

Commit, push and open the FMX-78 docs PR. Move Linear FMX-78 to `In Review`
after the PR exists.
