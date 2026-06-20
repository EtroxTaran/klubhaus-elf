---
title: Feature - Statistics Analytics Hub MVP
status: draft
tags: [feature, statistics, analytics, standings, data-hub, mvp, fmx-94, fmx-131]
context: statistics-analytics
created: 2026-06-05
updated: 2026-06-12
type: feature
binding: false
linear: FMX-94
related:
  - [[README]]
  - [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
  - [[../60-Research/raw-perplexity/raw-statistics-analytics-read-model-owner-2026-06-05]]
  - [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]]
  - [[../60-Research/raw-perplexity/raw-standings-authority-league-vs-statistics-2026-06-12]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../50-Game-Design/match-engine]]
  - [[../60-Research/player-strength-presentation]]
---

# Feature - Statistics Analytics Hub MVP

## User story

As a manager, I want a trusted analytics hub that explains match performance,
form, standings, player trends and season history, so that I can improve my
tactics and squad while the save builds memorable records over time.

## MVP scope

In scope for the first active slice:

- Analytics Hub entry with Key Findings and action links.
- Last Match analytics: result, xG/xGA, shots, shot quality, PPDA, field tilt,
  zone control and event timeline.
- Team analysis versus league context, normalized per 90.
- Player analysis with role-aware stat lines, form and player comparison.
- Standings history and league leaderboards.
- Official standings labels displayed from League-owned official ordering; the
  Analytics projection is not the promotion/relegation authority.
- Rolling team/player form windows.
- Shot maps, pass maps and heatmaps for Expert tier.
- `AnalyticsMetricDefinition` / metric-set version visibility for modeled
  metrics.
- Immutable `SeasonAnalyticsHandoffSnapshot` output for Manager & Legacy /
  HoF/prestige follow-ups.
- Empty/loading/stale states for projections.

Out of MVP scope:

- xT/OBV or other possession-value models beyond the selected core set.
- Custom dashboards or user-authored formulas.
- Report export/share.
- Similarity search.
- Full Hall-of-Fame voting simulation and cross-save record books.
- Product/user telemetry analytics.

## Gherkin scenarios

```gherkin
Feature: Statistics Analytics Hub MVP

  Scenario: Key Findings explain the last run of results
    Given my team has completed five league matches
    When I open the Analytics Hub
    Then I see ranked Key Findings for form, chance quality and defensive risk
    And each finding links to a relevant action surface when available

  Scenario: Last Match separates official facts from estimates
    Given a match has been resolved
    When I open Last Match analytics
    Then I see official score, scorers, cards and shots
    And I see xG, PPDA, field tilt and zone control labeled as model-derived

  Scenario: Standings reference resolves through Statistics
    Given League Orchestration exposes CompetitionStatus with a standingsRef
    When I open standings history
    Then Statistics & Analytics resolves CompetitionStandingsHistory
    And League Orchestration is not queried through private tables
    And promotion/relegation status comes from League-owned official ordering

  Scenario: Player comparison avoids global OVR
    Given I compare two forwards
    When the comparison view renders
    Then it shows role-relevant per-90 stats, percentiles and form
    And it does not show a universal global OVR score

  Scenario: Season handoff freezes legacy evidence
    Given a season has ended
    When the season summary is generated
    Then Statistics & Analytics freezes a SeasonAnalyticsHandoffSnapshot
    And Manager & Legacy can consume that snapshot without live analytics joins
```

## Acceptance criteria

- Feature spec links to the FMX-94 research, GD-0031 and ADR-0081.
- MVP scope includes Key Findings, Last Match, Team Analysis, Player Analysis,
  standings/leaders, form windows and early season-history output.
- Official counts and derived model estimates are visibly distinct.
- Projection query names match ADR-0081.
- Analytics standings views are display/history projections; structural outcomes
  use ADR-0066 official standings contracts.
- Analytics Hub does not duplicate Squad & Player's Impact Lens or introduce a
  global OVR.
- Manager & Legacy receives immutable handoff snapshots only.
- Out-of-scope advanced analytics are listed explicitly.
- `pnpm docs:check` passes after the vault update.

## Related

- [[../60-Research/statistics-analytics-read-model-owner-2026-06-05]]
- [[../60-Research/standings-authority-league-vs-statistics-2026-06-12]]
- [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
- [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
- [[../50-Game-Design/match-engine]]
- [[../60-Research/player-strength-presentation]]
