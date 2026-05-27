---
title: Fan Ecology - Six Segments and Atmosphere Engine
status: draft
tags: [game-design, fans, atmosphere, ultras]
created: 2026-05-16
updated: 2026-05-16
type: game-design
binding: false
related: [[README]], [[../60-Research/fan-culture-segmentation-research]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[stadium-and-campus]], [[rivalry-system]], [[matchday-event-engine]], [[mode-manage-a-club-career]], [[economy-system]]
---

# Fan Ecology - Six Segments and Atmosphere Engine

Fan culture must produce *sporting, economic and political* effects all at
once. A single "mood" gauge is too coarse - real fans split into segments
that react to *different* things and pull the club in opposing directions.

FMX-13 makes fan ecology a direct economy input: fan segments drive attendance,
season-ticket renewal, catering, merchandise, hospitality demand and sponsor
fit. They never post money directly; Club Management reads their public outputs
when producing [[economy-system]] ledger entries.

## 1. Six supporter segments

| Segment | Loyalty | Drivers | Economic weight |
|---|---|---|---|
| **Ultras / Hardcore** | Very high | Identity, rivalry, repression, ticket prices, tradition | Atmosphere generator; low per-cap revenue |
| **Core** | High | Sporting style, identity, derbies, season-ticket value | High per-cap; high stability |
| **Family** | Medium | Safety, sanitary, cleanliness, kid-friendly | High catering + merch; weather-sensitive |
| **Fair Weather** | Low | Table position, form, star players | Volatile; vanishes in crisis |
| **Corporate** | Low | Hospitality, brand, stadium standard, sponsors | Highest per-cap; demands amenity |
| **Casual / Event** | Very low | Media hype, big-name attractions, derbies | Low per-cap; useful off-peak |

Each club has a `fan_segment_mix` per DNA. A traditional club skews
Ultras + Core; an investor club skews Corporate + Casual.

## 2. Per-segment state

For each segment the system tracks:

- `population` - number of supporters in this segment.
- `loyalty` (0-100) - lag between bad events and exit.
- `mood` (-100..+100) - current happiness.
- `volatility` - how fast mood moves on news.
- `attendance_probability` per match.
- `merch_propensity`, `catering_propensity`, `hospitality_demand`.

A decision can move different segments in opposite directions. Examples:

- Ticket-price hike: Ultras + Core mood ↓↓; Corporate neutral.
- VIP expansion: Corporate ↑; Ultras ↓.
- Selling an icon: Ultras + Core ↓↓; Fair Weather mixed.
- Sponsor from incompatible industry: Ultras + Family ↓.
- Alcohol ban: Ultras + Casual ↓; Family ↑; catering revenue ↓.

## 3. Atmosphere engine

Atmosphere is a single composite value `[0..100]` per match. Inputs:

- Derby / rivalry intensity (from [[rivalry-system]]).
- Table context (relegation fight / title race).
- Stadium utilisation %.
- Fan-segment mix at the match × stadium architecture (standing %).
- Weather + kickoff time.
- Recent security interventions.
- Form + club mood.

Outputs:

- **Home advantage** - probability shift on duels in own half.
- **Morale swing magnitude** during the match (see [[match-engine]]).
- **Sponsor perception** - post-match brand reading.
- **Social buzz / club image** - long-term media KPI.
- **Per-capita match-day revenue**.

Pseudocode:

```text
atmosphere = base
           + rivalry_score * 0.20
           + table_context_score * 0.15
           + utilisation * 0.20
           + standing_share * 0.15
           + form_score * 0.15
           + weather_modifier
           - security_load
           - recent_negative_incidents
```

## 4. Per-capita revenue model

```text
per_capita_revenue = base
                   * dwell_time_factor       # from fan zone + catering
                   * weather_factor
                   * family_share_factor     # families spend more
                   * derby_factor            # away travel + premium pricing
```

This is why fan-zone build-out has cascading effects (see
[[stadium-and-campus]] §4).

The revenue model feeds the weekly ledger as matchday and non-matchday facts.
Expert finance views may show which fan segment moved a revenue component, but
the segment state remains owned by this system.

## 5. Fan politics events

Triggered when segment moods reach thresholds. Examples:

- Choreo (Ultras mood very high): +5 atmosphere this match, +1 % atmosphere
  for season.
- Protest banner (Core mood very low): media event, board worry.
- Ticket boycott (Ultras + Core mood very low): attendance drops, segment
  population temporarily reduces.
- Fan call for owner ouster: media event chain.

Events are surfaced as inbox cards with Accept / Decline / Defer actions.

## 6. Rivalry-driven fan loading

The Fan Service consumes the `rivalry_score` from [[rivalry-system]]:

- High score → segment population temporarily ↑ for the derby.
- High score → atmosphere multiplier × 1.3.
- High score → risk-event probabilities ↑ (see [[matchday-event-engine]]).

## 7. UI tiers

| Tier | Surface |
|---|---|
| Quick | "Fan mood: green / amber / red" badge + 1 fan event card |
| Standard | Segment bar chart with 3 trend arrows |
| Expert | Full per-segment grid with drivers and forecasts |

## 8. Sanction chain effects on fans

A sanction chain item ([[matchday-event-engine]]) propagates into fan
population:

- Partial sector closure → Ultras attendance ↓.
- Visiting-fan ban → away-segment population ↓.
- Alcohol ban → Casual + Ultras catering ↓.
- Ghost match → all attendance = 0 + Core loyalty ↓ for one cycle.

## 9. Future-scope notes (classified future-scope)

- Should ultras have *individual* groups (named) or as one aggregate
  segment? Recommendation: aggregate at MVP; named groups Phase 2+.
- Do fans churn between segments? Yes, but slowly - Family → Core after
  N years of attendance.
- Should fan-zone modules generate Family loyalty bumps? Yes (modest +1
  per season).
