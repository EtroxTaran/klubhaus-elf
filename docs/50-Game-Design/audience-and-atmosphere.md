---
title: Audience & Atmosphere - Six Segments and Atmosphere Engine
status: draft
tags: [game-design, fans, audience, atmosphere, ultras, economy, ticketing, price-elasticity, season-tickets, matchday, fan-service, risk, fmx-32, fmx-41, fmx-42, fmx-43, fmx-46, fmx-48, fmx-54]
created: 2026-05-16
updated: 2026-06-01
type: game-design
binding: true
supersedes: fan-ecology
related: [[README]], [[../60-Research/fan-culture-segmentation-research]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]], [[../60-Research/fan-demand-price-elasticity-2026-05-28]], [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[../60-Research/fan-service-campaign-catalog-and-effects-2026-06-01]], [[../60-Research/club-management-sub-aggregate-audit-2026-05-28]], [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]], [[stadium-and-campus]], [[rivalry-system]], [[matchday-event-engine]], [[mode-manage-a-club-career]], [[economy-system]], [[GD-0022-economy-commercial-impact-and-contracts]], [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]], [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]], [[../20-Features/feature-ai-narration-mvp-pillar]], [[../30-Implementation/club-economy-commercial-contracts]]
---

> **Renamed 2026-05-28 from "Fan Ecology".** Audience & Atmosphere
> was ratified as own bounded context by FMX-32 audit (ADR-0062
> spin-off of ADR-0061). The old `fan-ecology.md` GDDR is
> `status: superseded` and supersedes-linked back to this note.
> Content unchanged below; only the binding owner shifts from the
> Club Management "fans" sub-aggregate to the new Audience &
> Atmosphere BC.

# Audience & Atmosphere - Six Segments and Atmosphere Engine

Fan culture must produce *sporting, economic and political* effects all at
once. A single "mood" gauge is too coarse - real fans split into segments
that react to *different* things and pull the club in opposing directions.

FMX-13, FMX-41, FMX-42 and FMX-43 make fan ecology a direct economy input: fan
segments drive latent demand, attendance, season-ticket renewal, utilisation,
waitlist pressure, catering, merchandise, hospitality demand, sponsor fit and
ticketing-trust risk. FMX-46 adds matchday risk inputs: atmosphere, segment
volatility and fan-incident memory can raise or lower the
`MatchdayOperatingCostProfile`. FMX-48 adds fan-service campaign effects:
CommercialPortfolio settles campaign cost/sponsor facts, while Audience &
Atmosphere owns the mood, trust, atmosphere, demand and cooldown memory effects.
Audience & Atmosphere never posts money directly; CommercialPortfolio consumes
its public outputs for commercial and operating settlement, and Club Management
posts ledger entries.

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
- `attendance_floor` - bad-season floor before severe trust/identity shocks.
- `price_sensitivity` - segment-specific reaction to ticket price and trip cost.
- `ticketing_trust` - memory of perceived fairness, transparency and shocks.
- `season_ticket_renewal_probability` by seat class / package.
- `season_ticket_utilisation_probability` for aggregate attendance or release.
- `waitlist_pressure` by segment and seat class.
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
- **Security-risk input** for the `MatchdayOperatingCostProfile`.

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

## 5a. Named fan groups and reps for MVP narration

The six segments remain the source of truth for population, mood, volatility,
attendance and economic outputs. For the AI narration MVP pillar, each club also
generates a small named fan-group overlay:

- `fan_group_id` and IP-clean generated name;
- represented segment: Ultras, Core, Family, Fair Weather, Corporate or Casual;
- identity: tradition, local pride, youth-first, anti-owner, results-first,
  style-first or community-first;
- red lines: ticket prices, rival transfers, selling icons, sponsor category,
  defensive football, academy neglect or security restrictions;
- mobilization style: choreo, banners, social campaign, boycott, meeting or
  delegation;
- influence band and public visibility.

Fan reps are People actors attached to those groups. They can appear in
controlled dialogue scenes and media stories, but they do not own fan facts.
Any mood, protest or attendance effect still comes from Fan Ecology rules and
the selected deterministic intent, not from generated prose.

## 6. Rivalry-driven fan loading

The Fan Service consumes the `rivalry_score` from [[rivalry-system]]:

- High score → segment population temporarily ↑ for the derby.
- High score → atmosphere multiplier × 1.3.
- High score → risk-event probabilities ↑ (see [[matchday-event-engine]]).
- High score plus incident memory → higher matchday operating-cost risk tier.

## 7. Commercial demand contract

FMX-41 formalises the Fan Ecology output for the economy. Fan Ecology does not
post money. It publishes a `FanDemandForecast` for [[economy-system]] and
[[../30-Implementation/club-economy-commercial-contracts]].

The forecast includes:

- segment-level latent demand before stadium capacity is applied;
- segment-level actual attendance forecast after seat inventory and allocation;
- season-ticket renewal probability by segment and seat class;
- season-ticket utilisation / no-show / release probability by fan-group cohort;
- waitlist pressure and conversion appetite by segment and seat class;
- reference-price comparison by seat class and country/club profile;
- price sensitivity by segment, not one global elasticity constant;
- persistent `ticketingTrustState` and fan-trust guardrails;
- fixture attractiveness from opponent draw, rivalry, stakes, form, star pull,
  novelty, weather and kickoff convenience;
- capacity pressure: underfilled, balanced, constrained or sold-out latent
  demand state;
- catering, merchandise and hospitality propensity;
- sponsor-category fit and boycott risk;
- expected effect of fan-service campaigns such as away trains, family days,
  summer parties, choreo support, supporter dialogue, beverage rewards and
  digital fan challenges;
- campaign fatigue / cooldown memory by segment and sponsor category.

This preserves two club archetypes:

- **loyal/traditional fans** keep occupancy and season-ticket renewal higher in
  bad sporting years, but punish identity and price shocks more strongly;
- **success/event fans** generate bigger top-match/star/cup upside, but drop
  faster when form, hype or opponent appeal falls.

### 7.1 FMX-42 fan-demand model

Fan demand is calculated as **latent demand first, attendance second**. This
prevents sold-out clubs from looking price-insensitive for the wrong reason:
if latent demand is far above capacity, a price increase may keep attendance
full while changing segment mix, revenue per seat, renewal risk and trust.

Draft equation shape:

```text
latent_demand_s =
  reachable_population_s
  * loyalty_floor_s
  * price_response_s(ticket_price, reference_price, fairness_state)
  * sporting_context_response_s(form, table_context, long_term_trend)
  * fixture_response_s(opponent_draw, rivalry_tier, fixture_stakes, star_pull)
  * comfort_response_s(weather, kickoff_time, stadium_quality, safety)
  * campaign_response_s(active_fan_events)
```

Club profile and country profile provide calibration ranges only. They do not
create code branches: a Germany-style traditional club can still behave like an
event-led club if the generated fan mix and commercial history support it.

### 7.2 FMX-43 season-ticket cohort outputs

Fan Ecology does not own season-ticket campaigns. It provides the demand and
trust inputs Club Management needs to run them:

| Output | Meaning |
|---|---|
| `renewalProbabilityByCohort` | Renewal chance for segment x seat class x package x loyalty tier. |
| `utilisationProbabilityByCohort` | Aggregate likelihood to attend, release or no-show for included matches. |
| `waitlistPressureBySeatClass` | Unmet demand and scarcity pressure by segment and seat class. |
| `priceShockMemory` | Persistent memory of above-guardrail increases and opaque pricing. |
| `useItOrReleaseTolerance` | How harshly each segment reacts to no-show enforcement. |
| `compensationSensitivity` | Segment reaction to credit/refund/discount policies after inaccessible matches. |

These are cohort facts, not individual supporter records. A "strict
utilisation policy" can therefore change renewal probability, atmosphere,
trust and credit liability without storing who personally attended.

### 7.3 FMX-48 fan-service campaign effects

Audience & Atmosphere consumes `FanEventSegmentEffectPublished` facts from
CommercialPortfolio after a campaign settles. It owns the final segment effects;
CommercialPortfolio only supplies campaign outcome, sponsor and settlement
facts.

Minimum campaign-effect inputs:

| Input | Meaning |
|---|---|
| `campaignKind` | Away travel, family/community, fan festival, choreo/dialogue, beverage reward or digital challenge. |
| `targetSegments` | Segment weights and expected reach. |
| `uptakeBand` | Actual participation compared with forecast. |
| `communicationQuality` | Whether promises, changes, cancellation and make-goods were explained. |
| `sponsorFit` | Category and local/community fit. |
| `riskOutcome` | Travel disruption, alcohol/safety incident, prohibited material, privacy/moderation issue or clean outcome. |
| `cooldownImpact` | Repetition/fatigue memory for the same segment, sponsor category and campaign kind. |

Draft segment tendencies:

- Ultras/Core respond strongly to away travel, choreo support and credible
  supporter dialogue; they punish over-branded events and broken promises.
- Family responds to family days, community tickets and safe festivals; alcohol
  heavy or unsafe campaigns can reduce trust.
- Casual/Fair Weather respond to fan festivals, beverage rewards and digital
  challenges, but fatigue quickly if sign-up friction or sponsor spam is high.
- Corporate responds to orderly premium/festival or travel-linked experiences
  and reacts negatively to disorder or brand-safety risk.

## 8. UI tiers

| Tier | Surface |
|---|---|
| Quick | "Fan mood: green / amber / red" badge + 1 fan event card |
| Standard | Segment bar chart with 3 trend arrows |
| Expert | Full per-segment grid with drivers and forecasts |

## 9. Sanction chain effects on fans

A sanction chain item ([[matchday-event-engine]]) propagates into fan
population:

- Partial sector closure → Ultras attendance ↓.
- Visiting-fan ban → away-segment population ↓.
- Alcohol ban → Casual + Ultras catering ↓.
- Ghost match → all attendance = 0 + Core loyalty ↓ for one cycle.

## 10. Future-scope notes (classified future-scope)

- Full fan-group UI and churn between groups remain future scope. The MVP only
  needs enough named group/rep context for narration and decision pressure.
- Do fans churn between segments? Yes, but slowly - Family → Core after
  N years of attendance.
- Should fan-zone modules generate Family loyalty bumps? Yes (modest +1
  per season).
