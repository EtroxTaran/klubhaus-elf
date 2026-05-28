---
title: Cup and Competition Revenue Profiles - Research Synthesis 2026-05-28
status: draft
tags: [research, economy, cup, competition, revenue, forecast, legal, fmx-45]
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-45
sourceType: external
related:
  - [[raw-perplexity/raw-cup-competition-revenue-profiles-2026-05-28]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[late-game-systems]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
---

# Cup and Competition Revenue Profiles - Research Synthesis 2026-05-28

## Question

How should FMX model domestic cup, league-cup and continental competition
revenue so every fixture can create realistic but fair financial effects:
gate sharing, ticket allocation, prizes, media/facility fees, travel, security,
sponsor bonuses, merchandise spikes, fixture congestion and elimination
forecast shock?

Nico's defaults for FMX-45:

- define IP-clean draft preset templates, but keep exact numbers as
  calibration-not-final;
- show secured income and future cup upside in Quick, and full EV/probability
  detail in Expert;
- keep season-ticket cup priority / material-right accounting as a visible hook
  linked to FMX-43, not a full liability model in this beat.

## Summary

The research answer is a **data-driven `CompetitionRevenueProfile`** consumed
by Club Management settlement:

1. Competition data owns the commercial profile: prize schedule, gate sharing,
   ticket allocation, media cadence, neutral venue rules, replay/two-leg rules,
   travel/security obligations, solidarity and forecast policy.
2. Club Management owns settlement and ledger posting. League/Competition,
   Regulations, Fan Ecology, Rivalry, Stadium and Match provide facts only.
3. Cup value is split into hard cash, guaranteed receivables and non-spendable
   expected future value. Elimination removes forecast upside; it is not a
   hidden cash loss.
4. Real-world country systems become fictional profile templates, not copied
   constants or licensed competition identities.
5. Continental cups need a separate profile family with equal share,
   performance, ranking/progression, value/legacy and solidarity pools.

This gives small clubs credible cup windfalls, big clubs credible continental
dependence, and players a fair explanation of why progression or elimination
changes the finance forecast.

## Source base

| Area | Primary sources used | FMX use |
|---|---|---|
| England | The FA Cup prize fund 2025-26; FA Cup rules 2025-26. | Published prize ladder, gate-share tradition, live-TV/facility-fee style, replays as profile data. |
| Germany | DFB-Pokal competition information and DFB prize reports. | Central round payments, TV/live-game bonuses, no replay, neutral final, lower-tier home-tie windfall. |
| Spain | RFEF tournament rules PDF; RFEF Tercera Federacion aid call. | Federation-run cup, lower-tier support and aid hooks, no-replay/single-leg profile with late-round two-leg option. |
| Italy | Lega Serie A regulations page and visible official regulation title/snippets. | Top-tier-weighted cup profile, elite clubs entering later, single-leg early rounds and two-legged semifinal option. Official PDF extraction was blocked in this environment, so Italy should be verified again before final calibration. |
| France | FFF Coupe de France articles on 2025-26 dotation and amateur-club support. | Deep solidarity/amateur support, travel/referee support hooks and strong lower-tier cup windfall. |
| Continental | UEFA Circular 32/2025 and UEFA men's competitions distribution explainer. | Equal share, performance, ranking/progression, value/legacy, qualifying and solidarity pools. |

Important: these sources are research inputs. Default FMX data must use
fictional competition names, fictional governing bodies and non-copied balance
ranges.

Source URLs preserved for traceability:

- The FA Cup prize fund 2025-26:
  <https://www.thefa.com/competitions/thefacup/prize-fund>
- FA Cup rules 2025-26:
  <https://www.thefa.com/-/media/thefacom-new/files/competitions/2025-26/rules/rules-of-the-fa-challenge-cup-2025-26.ashx>
- DFB-Pokal information:
  <https://www.dfb.de/maenner/wettbewerbe/dfb-pokal/wettbewerbsinformationen>
- RFEF tournament rules PDF:
  <https://rfef.es/sites/default/files/2025-12/5._Torneos_Federacion.pdf>
- RFEF aid call:
  <https://rfef.es/sites/default/files/pdf/Convocatoria_Ayudas_Clubes_Tercera_Federacion_T._25-26.pdf>
- Lega Serie A regulations:
  <https://www.legaseriea.it/it/lega-serie-a/documentazione/regolamenti>
- FFF Coupe de France article:
  <https://www.fff.fr/article/16649-les-chiffres-des-demi-finales.html>
- FFF amateur-club support article:
  <https://www.fff.fr/article/15810-une-dotation-record-pour-un-projet-inedit.html>
- UEFA Circular 32/2025:
  <https://editorial.uefa.com/resources/029a-1e0b5460b86d-31e6cad26358-1000/20250616_circular_2025_32_en.pdf>
- UEFA men's competitions distribution explainer:
  <https://www.uefa.com/news-media/news/028c-1a963496826a-bf40705cb183-1000--men-s-competitions/>

## Top-5 comparison matrix

| Profile | Prize pattern | Gate / ticket pattern | Media / facility pattern | Costs and risk | Game design takeaway |
|---|---|---|---|---|---|
| Germany-like | Central round payments, strong early-round participation value, later-round increases. | Home tie matters strongly; away share/levy details are profile data. | TV/live-game selection can add meaningful bonus. | Home club security and operations; away club travel. | Good all-round domestic cup template: clear round prizes plus lower-tier home windfalls. |
| England-like | Published prize ladder across qualifying and proper rounds. | Net gate sharing after deductions is a major small-club windfall lever. | Live-TV/facility fees are important, especially for lower-tier clubs. | Replays are configurable by season/round; neutral semi/final raises travel and allocation rules. | Best profile for dramatic underdog economics and big-stadium away draws. |
| Spain-like | Federation participation/progression and aid hooks, with lower-tier support. | Single-leg lower-round hosting can favor lower-tier clubs. | Central media/federation cadence rather than club-owned broadcast detail. | No-replay default; late two-legged rounds optional by profile. | Useful for host-advantage and lower-tier support without copying exact structures. |
| Italy-like | More top-tier-weighted; elite clubs enter later. | Home advantage determined by draw/seeding rules; lower-tier windfall is narrower. | Media package is central and should be abstracted as cadence/value band. | Single-leg early rounds, two-legged semifinal option, neutral final. | Good template for a compact cup where late rounds matter more than early lower-tier breadth. |
| France-like | Deep prize/aid ladder and amateur support. | Lower-tier clubs receive stronger solidarity and logistics support hooks. | TV bonuses and central support exist but should be banded. | Travel/referee support and amateur-club aid reduce downside. | Best profile for community/grassroots cup identity and fair underdog progression. |
| Continental-like | Equal starting fee, performance, ranking/progression and final bonuses. | Non-final home clubs keep local matchday; finals are centrally hosted. | Central revenue pool with value/legacy pillar and surplus sharing. | Heavy fixture congestion, travel, squad-depth pressure and delayed receivables. | Best profile for big-club budgets, qualification dependence and long-save power shifts. |

## IP-clean preset templates

FMX should ship profile templates as calibration scaffolding. Values are bands
and ratios, not final constants.

| Template | Fictional design name | Core mechanics |
|---|---|---|
| DFB-like | `central-round-domestic-cup` | Round participation/progression ladder, no replay, neutral final, live-selection bonus, home operations/security. |
| FA-like | `shared-gate-underdog-cup` | Prize ladder, net-gate sharing, live facility bonus, configurable replay/extra-time rules, neutral semi/final allocation. |
| RFEF-like | `federation-hosting-cup` | Lower-tier hosting bias, federation aid/participation support, no replay, late two-leg option, neutral final. |
| Lega-like | `seeded-elite-entry-cup` | Elite clubs enter later, central media band, single-leg early rounds, two-leg semifinal option, neutral final. |
| FFF-like | `solidarity-amateur-cup` | Broad early ladder, amateur aid, travel/referee support hook, TV bonus, strong lower-tier windfall. |
| UEFA-like | `continental-value-pillar-cup` | Equal share, performance/result, ranking/progression, legacy/value pillar, qualifying and non-participant solidarity pools. |

The template names are internal design handles. Player-facing names should be
fictional and generated per country/continent.

## `CompetitionRevenueProfile` draft

Owned by League/Competition and Regulations data; consumed by Club Management.

| Field | Meaning |
|---|---|
| `competitionId` | Fictional competition identity. |
| `countryProfileId` | Country or abstract-profile scope. |
| `competitionKind` | domesticLeague, domesticCup, leagueCup, superCup, playoff, continentalCup, friendly or finalSeries. |
| `fixtureSettlementKind` | homeTie, awayTie, twoLegTie, replay, neutralSemi, neutralFinal or leaguePhase. |
| `roundBand` | qualifying, early, middle, late, semi, final, leaguePhase, knockoutPlayoff, knockout. |
| `prestigeBand` | local, national, major, continentalLower, continentalMajor, global. |
| `prizeSchedule` | Participation, win/progression, runner-up/winner, league-phase and solidarity bands. |
| `gateSharingRule` | Gross/net basis, deductions, home/away/organizer shares, levy/pool and expense caps. |
| `ticketAllocationRule` | Away quota, finalist allocation, neutral venue split, sponsor/partner allocation and protected supporter quotas. |
| `mediaPaymentRule` | Central pool, facility/live-selection fee, value/legacy pillar, payment cadence and delay. |
| `settlementDelay` | Cash timing and receivable risk by revenue family. |
| `recognitionPolicy` | When revenue is receivable, cash, accrued or forecast-only. |
| `travelCostRule` | Away, neutral, final and continental travel/accommodation expectations. |
| `securityCostRule` | Home/neutral security basis, rivalry/risk modifiers and regulation constraints. |
| `neutralVenueRule` | Host body, ticket allocation, club share, final travel and central hospitality treatment. |
| `replayOrTwoLegRule` | Replay, extra-time, penalties and two-leg rules by round. |
| `matchdayCommercialModifiers` | Catering, merchandise, hospitality and fan-zone demand bands. |
| `sponsorBonusTriggerRules` | Round reached, televised tie, final, upset, trophy or continental qualification. |
| `fixtureCongestionRule` | Rest-day pressure, travel load, training opportunity cost, fatigue/injury hooks. |
| `forecastPolicy` | Expected future round value, progression probability source, confidence band and elimination shock. |
| `solidarityRule` | Amateur/lower-tier, qualifying, non-participant or parachute-style support. |
| `communityOverridePolicy` | Which fields community packs may override and required provenance. |
| `ipCleanSourceProfile` | Research template family used as inspiration, not a licensed clone. |
| `provenance` | Source note, version, effective season and confidence. |

## Settlement event vocabulary

Club Management must be able to represent these events before code starts:

- `CompetitionPrizeReceivableRecorded`
- `CompetitionPrizeCashReceived`
- `CupGateShareSettled`
- `CupMediaFacilityFeeSettled`
- `CupTravelCostPosted`
- `CupSecurityCostPosted`
- `CupSponsorBonusTriggered`
- `CupMerchandiseSpikePosted`
- `CupNeutralVenueAllocationSettled`
- `CupForecastUpdated`
- `CupEliminationForecastShockRecorded`

The ledger receives hard cash, receivables and costs. Forecast shocks update
read models and planning envelopes; they are not retroactive ledger losses
unless a previously booked receivable is reversed.

## Forecast and elimination model

Cup value has four layers:

1. **Cash on hand** - already received gate, prize, sponsor or media money.
2. **Guaranteed receivable** - earned but unpaid prize/media/sponsor money.
3. **Expected future value** - probability-weighted future prize, gate, media,
   sponsor, merchandise and hospitality value minus travel/security/congestion
   cost.
4. **Intangible pressure** - fan mood, board pressure, sponsor confidence,
   reputation and fixture-congestion risk.

Draft formula:

```text
cupFutureEV =
  sum over future rounds (
    reachProbability(round)
    * (
      expectedPrize
      + expectedGateShare
      + expectedMedia
      + expectedSponsorBonus
      + expectedMerchHospitalitySpike
      - expectedTravelCost
      - expectedSecurityCost
      - expectedCongestionCost
    )
  )
```

Progression recalculates actual next-fixture settlement plus remaining future
EV. Elimination removes future EV and records a forecast shock. The player
should feel "we lost upside" instead of "the game took cash away."

Fairness guardrails:

- never let normal wage budget silently depend on long cup runs in Quick mode;
- show secured versus forecast values in different language;
- cap early-save dependency on uncertain cup EV unless board personality or
  difficulty explicitly allows risk;
- give lower-tier clubs meaningful guaranteed windfalls for major away/home
  draws even if they lose;
- keep underdog fan/reputation benefits separate from cash.

## Dashboard surfaces

| Tier | Cup revenue surface |
|---|---|
| Quick | "Secured cup income", "expected cup upside" band and one action card for the next tie. No raw probability table. |
| Standard | Per-fixture breakdown: prize, gate share, media/facility fee, travel, security, sponsor/merch spike and cash timing. |
| Expert | Round-by-round EV table, probability source, cash vs receivable schedule, gate-share formula, delayed payments, congestion sensitivity and elimination shock. |

Season-ticket cup priority / auto-charge rights remain a visible hook only. The
liability/refund depth belongs to the FMX-43 follow-up decision, not FMX-45.

## Acceptance scenarios

```gherkin
Feature: Cup and competition revenue profiles

  Scenario: Home domestic cup tie settles as a full economy event
    Given a home club receives a domestic cup fixture profile
    And the fixture has high opponent draw power
    When matchday settlement runs
    Then ticket, catering, merchandise, security and prize/media effects post separately
    And the future cup forecast is recalculated from the next round

  Scenario: Away tie creates gate-share and travel effects
    Given a club is drawn away in a shared-gate cup profile
    When the tie is settled
    Then travel and accommodation costs post
    And gate-share or facility-fee income follows the competition profile

  Scenario: Neutral final separates central and club settlement
    Given a club reaches a neutral final
    When final settlement runs
    Then ticket allocation, travel, central prize, sponsor bonus and merchandise spike are separate facts
    And local home-gate assumptions are not reused

  Scenario: Underdog cup upset creates windfall without real-world cloning
    Given a lower-tier club beats a stronger fictional opponent
    When the profile advances the club
    Then guaranteed prize and next-round forecast increase
    And fan/reputation uplift is recorded separately from cash

  Scenario: Early exit removes upside, not bank balance
    Given a club has future cup EV but no earned receivable
    When the club is eliminated
    Then the forecast shock removes future EV
    And no cash ledger loss is posted

  Scenario: Fixture congestion has a cost hook
    Given a club advances into a midweek continental fixture
    When the schedule updates
    Then the cup forecast records travel and congestion risk
    And fatigue/injury consequences remain owned by the sporting systems

  Scenario: Continental participation uses multiple revenue pillars
    Given a club reaches a continental league phase
    When the competition profile pays the season
    Then equal share, performance, ranking/progression and value-pillar revenue are separated
    And solidarity/qualifying support is not treated as the same event
```

## Open decisions

- Final calibration values per profile family.
- Whether Quick mode can spend any fraction of expected cup EV through board
  budget policy.
- Whether replay rules are active in first playable or only represented as
  profile data.
- How season-ticket cup priority / material-right liabilities are shown after
  the FMX-43 follow-up.
- Whether Italy's official regulation PDF can be extracted again before final
  preset calibration.

## Related

- Raw research: [[raw-perplexity/raw-cup-competition-revenue-profiles-2026-05-28]]
- Prior economy research: [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] ·
  [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- Game design: [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] ·
  [[../50-Game-Design/economy-system]] ·
  [[../50-Game-Design/regulations-and-compliance]]
- Implementation: [[../30-Implementation/club-economy-commercial-contracts]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] ·
  [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
