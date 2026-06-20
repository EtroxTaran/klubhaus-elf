---
title: Fan Demand and Price Elasticity - Research Synthesis 2026-05-28
status: draft
tags: [research, fans, ticketing, price-elasticity, attendance, economy, fmx-42]
context: audience-atmosphere
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-42
sourceType: external
related:
  - [[club-economy-blueprint-2026-05-27]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[fan-culture-segmentation-research]]
  - [[../50-Game-Design/fan-ecology]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/rivalry-system]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Fan Demand and Price Elasticity - Research Synthesis 2026-05-28

## Question

How should FMX model supporter attendance, season-ticket renewal, price
elasticity, top-match demand and fan-trust backlash so the economy is realistic,
country-profile aware and still fair as a game?

## Summary

The research answer is not one global elasticity constant. FMX needs a
**segment-specific latent demand model**:

1. Fan Ecology estimates latent demand by segment before capacity is applied.
2. Stadium capacity, seat class and ticketing policy allocate demand into
   actual attendance.
3. Price affects every segment differently.
4. Fixture quality, opponent draw, rivalry, table stakes, weather and kickoff
   time change both demand and price tolerance.
5. Aggressive pricing can increase one-match revenue while damaging fan trust,
   future renewal and sponsor image.

The recommended model is **Option C - Segment Elasticity + Latent Demand +
Trust Guardrail**. It is richer than a flat attendance multiplier, but still
data-driven and testable. It avoids final constants: every value below is a
calibration input or shape, not a locked number.

## Evidence summary

| Finding | Source pattern | FMX implication |
|---|---|---|
| Casual spectators are more price-sensitive than season-ticket holders. | Simmons' English league demand study estimates attendances with and without season-ticket holders and finds larger price elasticity for adjusted casual attendance. | Separate season-ticket renewal from single-match price response. |
| Team quality, league position, goals and promotion/relegation matter. | Simmons 1996 and Forrest/Simmons 2002 link attendance to sporting factors, team quality and outcome uncertainty. | Fixture attractiveness must include form, table context, stakes and opponent strength. |
| Demand can be capacity-constrained. | DFL 2024/25 reports very high Bundesliga utilisation; Premier League and top clubs often operate near sell-out. | Model latent demand separately from actual attendance; price changes may shift revenue/segment mix before attendance drops. |
| Opponent category / top-match pricing is real. | Manchester United 2025/26 uses categories A/B/C for Premier League and D for some cup games; clubs state this reflects demand differences. | Top-match surcharge should be a policy over fixture category, not manual per-match guessing. |
| Full dynamic pricing creates trust and affordability risk. | Euro 2028 publicly ruled out dynamic pricing; Euroconsumers/FSE criticised opaque FIFA dynamic pricing. | Dynamic pricing needs guardrails, transparency and fan-trust effects. |
| Germany has high utilisation and moderate prices. | DFL spectator report reports record ticket sales and high utilisation; DFL notes ticket prices rose below consumer-price inflation over the reference period. | Germany profile: high base demand, lower price headroom, high backlash risk for aggressive pricing. |
| Spain is improving attendance but not uniformly full. | LaLiga 2024/25 reports >17M spectators, 84.5% occupancy in the top division and 68.5% in second tier. | Spain profile: strong big-club/tourist/star pull, more growth room outside top clubs. |
| France has record attendance but mixed utilisation. | LFP 2024/25 reports 8.55M Ligue 1 spectators and record final matchday attendance. | France profile: lower price level, more volatile local demand, strong regional-club pockets. |
| Italy has strong derby/local demand but stadium-quality constraints. | FIGC ReportCalcio covers Italian stadiums/spectators; 2024/25 Serie A attendance sources show strong total attendance but uneven club/stadium performance. | Italy profile: stadium quality, safety perception and derby intensity matter heavily. |

## Model options

### Option A - Flat occupancy multiplier

Every club has one demand score. Price, form and opponent apply to that score.

- Pros: simplest to implement and explain.
- Cons: cannot distinguish loyal fans from casual fans, season-ticket holders
  from single-ticket buyers, or sell-out latent demand from real attendance.
- Verdict: reject. It would make Nico's fan-scene differences mostly cosmetic.

### Option B - Club archetype curves

Each club uses one archetype curve: traditional, balanced, event-led, corporate
or family. Segment detail appears only in UI flavour.

- Pros: good for quick balancing and generated clubs.
- Cons: still too coarse for season-ticket policy, supporter backlash,
  hospitality, top-match pricing and fan-service campaigns.
- Verdict: useful as initial generator defaults, but not as the simulation core.

### Option C - Segment Elasticity + Latent Demand + Trust Guardrail

Each fan segment has its own demand shape. Fixture attractiveness and commercial
policy produce latent demand; stadium capacity and ticketing allocation produce
actual attendance. Aggressive pricing affects fan trust and future renewal.

- Pros: matches the research, preserves fan-scene differences, supports Quick /
  Standard / Expert, and keeps constants tunable.
- Cons: needs calibration tests and careful UI explanation.
- Verdict: recommended.

## Recommended demand equation shape

For each segment `s`:

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

Then:

```text
actual_attendance =
  allocate_to_capacity(latent_demand_by_segment, seat_class_inventory, policy)
```

Important implementation rule: price acts on **latent demand**. If latent demand
is far above capacity, a price increase may not reduce attendance; it may change
who gets seats, revenue per seat and fan trust.

## Segment priors

These are shape priors, not final constants.

| Segment | Attendance floor | Price sensitivity | Form sensitivity | Fixture/top-match sensitivity | Trust/backlash risk |
|---|---|---|---|---|---|
| Ultras / Hardcore | Very high if not alienated | Low for normal prices; high anger at identity/pricing betrayal | Low short-term, medium long-term | Very high for derbies | Very high |
| Core | High | Low-medium | Medium | High for derbies/cups | High |
| Family | Medium | Medium-high total-trip-cost sensitivity | Medium | Medium; family events matter | Medium-high |
| Fair Weather | Low | High | Very high | High when club is winning or famous opponent visits | Medium |
| Corporate | Medium if facilities are strong | Low for ticket price, high for package quality/value | Low-medium | High for prestige/top fixtures | Medium via brand-safety |
| Casual / Event | Low | Medium-high except for marquee events | High | Very high for top opponent, stars, cup final | Low-medium |

## Driver matrix

| Driver | Ultras / Hardcore | Core | Family | Fair Weather | Corporate | Casual / Event |
|---|---|---|---|---|---|---|
| Ticket price | Low attendance effect, high mood effect if exploitative | Low-medium | High | High | Low for premium, medium for normal seats | Medium-high |
| Winning streak | Low | Medium | Medium | Very high | Medium | High |
| Bad season | Low unless hopeless or identity breach | Medium | Medium | Very high drop | Medium | High drop |
| Derby/rivalry | Very high | Very high | Medium | High | High if prestigious | Very high |
| Star opponent/player | Medium | Medium | Medium | High | High | Very high |
| Weather | Low | Low-medium | High | Medium | Low if hospitality covered | Medium |
| Midweek/late kickoff | Low-medium | Medium | High | Medium | Low-medium | Medium-high |
| Stadium safety/comfort | Medium via politics | Medium | Very high | Medium | Very high | Medium |
| Fan-service campaign | High for identity events | High | High for family/community | Medium | Low-medium | Medium |

## Fan trust and fairness state

Price elasticity alone is not enough. The model needs a persistent
`ticketingTrustState`:

| Signal | Effect |
|---|---|
| Price jump above profile guardrail | immediate mood drop, future renewal risk |
| Opaque dynamic pricing | trust drop, press/supporter event risk |
| Season-ticket value preserved | renewal support, lower backlash |
| Fan-first inventory protected | loyalty/family/core support |
| Repeated top-match surcharges | short-term revenue, long-term trust erosion |
| Transparent communication / phased change | reduced backlash |

Trust should primarily affect future behaviour: season-ticket renewal,
boycott risk, supporter protests, atmosphere and sponsor-category fit.

## Fixture attractiveness

`FixtureCommercialProfile` should provide or derive:

| Field | Meaning |
|---|---|
| `opponentDrawPower` | Reputation, table position, style, stars and global/local appeal. |
| `rivalryTier` | None / Mild / Strong / High / Volatile from Rivalry System. |
| `fixtureStakes` | Routine, promotion, relegation, title, qualification, elimination, final. |
| `homeFormBand` | Recent form and long-term performance trend. |
| `noveltyBand` | First promotion season, rare opponent, new-stadium effect, farewell/icon event. |
| `kickoffConvenience` | Weekend afternoon, evening, late, midweek, holiday. |
| `weatherComfort` | Weather + roof/comfort mitigation. |

## Country-profile demand tendencies

| Country | Demand shape | Pricing/trust implication |
|---|---|---|
| Germany | High occupancy, high supporter organisation, strong standing/season-ticket culture, local roots. | Lower price headroom; stronger backlash against aggressive premiumisation; capacity often binds. |
| England | High top-tier demand, global/tourist/corporate pull, strong category pricing. | Higher price headroom in top tier; local-fan affordability pressure; top-match categories expected. |
| Spain | Top-heavy demand, strong star/tourist pull at elite clubs, improving occupancy but more variance. | Big clubs can monetise stars/opponents; smaller clubs need performance/local loyalty growth. |
| Italy | Strong derby/local identity, ultras/curva importance, uneven stadium quality. | Stadium quality and safety strongly mediate family/casual demand; derby spikes matter. |
| France | Record top-tier attendance but mixed utilisation; lower price levels and strong regional pockets. | More price-sensitive outside top clubs; regional identity and success swings matter. |

## `FanDemandForecast` refinement

Replace the single `priceElasticityBand` field with a richer but still compact
structure:

| Field | Meaning |
|---|---|
| `segmentDemand` | Per-segment latent demand, actual forecast and confidence band. |
| `attendanceFloorBySegment` | Minimum expected attendance share before severe trust/identity shocks. |
| `priceSensitivityBySegment` | Segment-specific low/medium/high/very-high shape. |
| `referencePriceBySeatClass` | Country/club/seat-class baseline used for fairness comparisons. |
| `ticketingTrustState` | Supporter trust in pricing policy and recent price-change memory. |
| `fixtureAttractiveness` | Normalised profile from opponent, rivalry, stakes, form, stars and novelty. |
| `capacityPressure` | Underfilled, balanced, constrained or sold-out latent-demand state. |
| `seasonTicketRenewalProbability` | Renewal probability by segment/seat class with trust and form modifiers. |
| `boycottRisk` | Protest/boycott probability by segment and trigger. |
| `hospitalityDemand` | Corporate/premium demand band driven by fixture and facility quality. |
| `sponsorCategoryFit` | Category-level brand fit/risk after fan/trust/fixture effects. |
| `provenance` | Source facts, snapshot IDs and freshness. |

## UI surfaces

| Tier | Surface |
|---|---|
| Quick | Demand badge, projected attendance, expected revenue delta, one warning if fan trust is at risk. |
| Standard | Segment bars, top three demand drivers, 13-week attendance/renewal forecast, price-policy comparison. |
| Expert | Latent demand vs capacity, elasticity bands by segment, seat-class allocation, trust memory, scenario sensitivity. |

## Balance and acceptance scenarios

```gherkin
Feature: Fan demand and price elasticity

  Scenario: Loyal bad-season floor
    Given a traditional club has high ultras and core loyalty
    And the club is in poor form
    When attendance is forecast for a routine home fixture
    Then core attendance remains above the casual baseline
    And fair-weather and casual demand fall more sharply

  Scenario: Fair-weather collapse
    Given an event-led club has low core loyalty and high fair-weather share
    And the club loses several matches
    When the next low-stakes fixture is forecast
    Then latent demand falls sharply
    And ticket discounts have limited trust benefit if sporting context remains poor

  Scenario: Derby spike under capacity constraint
    Given a strong rivalry fixture
    And latent demand exceeds stadium capacity
    When a top-match surcharge is applied
    Then actual attendance stays near capacity
    And revenue rises
    But ticketing trust and segment mix are evaluated

  Scenario: Price hike backlash
    Given a club raises normal match prices above its profile guardrail
    And communication transparency is low
    When the next season-ticket renewal forecast runs
    Then renewal probability falls for core and family segments
    And boycott risk may increase for ultras/core

  Scenario: Weather and kickoff affect families
    Given a midweek late kickoff in bad weather
    When attendance is forecast
    Then family and casual demand are reduced more than ultras demand
    And roof/comfort upgrades mitigate part of the loss
```

## Open decisions for Nico

- Should FMX allow full dynamic pricing, or only fixed category pricing plus
  bounded surcharge presets for MVP?
- How visible should `ticketingTrustState` be in Quick mode: explicit badge or
  only warning card?
- Should Germany-style fan-first guardrails be hard country rules or tunable
  profile defaults?
- Should AI clubs be allowed to use aggressive dynamic pricing before FMX-51 is
  complete?
- Should top-match surcharge be player-set, board-limited or supporter-vote
  gated for very traditional clubs?

## Source links

- Simmons, "The demand for English league football: a club-level analysis":
  <https://www.tandfonline.com/doi/abs/10.1080/000368496328777>
- Forrest and Simmons, "Outcome Uncertainty and Attendance Demand in Sport":
  <https://academic.oup.com/jrsssd/article-pdf/51/2/229/49941309/jrsssd_51_2_229.pdf>
- Forrest, Simmons and Feehan, "A Spatial Cross-Sectional Analysis of Elasticity
  of Demand for Soccer":
  <https://ideas.repec.org/a/bla/scotjp/v49y2002i3p336-356.html>
- Manchester United 2025/26 match-by-match ticket categories:
  <https://www.manutd.com/en/amp/news/detail/man-utd-match-by-match-ticket-prices-for-2025-26-season>
- Manchester City 2025/26 ticket update and in-season increase guardrail:
  <https://www.mancity.com/news/club/ticket-update-13-june-2025-63885400>
- DFL spectator report 2024/25:
  <https://report.dfl.de/2425/en/current-reports/spectator-report.html>
- DFL 2024/25 ticket-record press release:
  <https://www.dfl.de/de/aktuelles/saison-2024-25-deutscher-profifussball-stellt-neuen-ticketabsatz-rekord-auf/>
- LaLiga 2024/25 economic report news:
  <https://www.laliga.com/en-CO/news/laliga-reaches-a-new-historical-maximum-in-revenues-and-exceeds-17-million-spectators>
- LaLiga 2024/25 economic report PDF:
  <https://assets.laliga.com/assets/2026/04/13/originals/dd7aec50d2ee10d78a8f409e609c34a5.pdf>
- LFP Ligue 1 2024/25 attendance record:
  <https://www.lfp.fr/article/saison-2024-2025-une-affluence-record-pour-une-saison-historique>
- FIGC ReportCalcio 2025:
  <https://www.figc.it/media/277126/report-calcio-2025.pdf>
- Euro 2028 no dynamic pricing:
  <https://www.espn.com/soccer/story/_/id/46953614/euro-2028-fa-use-dynamic-ticket-pricing>
- Euroconsumers / Football Supporters Europe dynamic pricing critique:
  <https://www.euroconsumers.org/wp-content/uploads/2026/02/PR_Dynamic-Pricing-FIFA_Feb26.pdf>
- Sports season-ticket subscription review:
  <https://www.sciencedirect.com/science/article/pii/S1757581824000100>
- Sport fan price sensitivity by loyalty levels:
  <https://scholarworks.bwise.kr/erica/handle/2021.sw.erica/586>
