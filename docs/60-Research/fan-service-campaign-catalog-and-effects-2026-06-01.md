---
title: Fan-Service Campaign Catalog and Effects - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, fans, fan-service, sponsorship, travel, alcohol, safety, community, fmx-48]
context: [commercial-portfolio, audience-atmosphere]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-48
sourceType: external
related:
  - [[raw-perplexity/raw-fan-service-campaign-catalog-and-effects-2026-06-01]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[catering-and-merchandise-operations-2026-06-01]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/audience-and-atmosphere]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../50-Game-Design/matchday-event-engine]]
  - [[../50-Game-Design/sponsorship-portfolio]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
---

# Fan-Service Campaign Catalog and Effects - Research Synthesis 2026-06-01

## Question

FMX-41 named paid fan-service campaigns - away trains, summer/family events,
choreo support and beer-per-goal activations - as economy levers. The current
docs only list them as examples. How should FMX model a `FanEventCampaign`
catalog so these campaigns have clear cost, sponsor, segment, atmosphere,
commercial and risk effects without becoming a detached event-management game?

Nico's defaults for FMX-48:

- keep ownership in the already-ratified split: CommercialPortfolio owns
  campaign policy and commercial settlement, Audience & Atmosphere owns segment
  mood/trust/atmosphere effects, Stadium Operations owns venue facts,
  Regulations owns rule constraints, and Club Management remains sole ledger
  writer;
- create a sourced campaign catalog with at least eight fictional/IP-clean
  campaign types;
- include legal/risk notes for travel, alcohol and safety;
- keep all numbers as profile ranges and design hooks, not final constants;
- surface Quick / Standard / Expert assumptions and explicit Nico decisions.

## Summary

The research answer is to model fan-service as **time-boxed campaigns with a
lifecycle, sponsor/fulfilment model and segment-specific outcome**, not as free
flavour text:

1. `FanEventCampaign` receives a compact lifecycle:
   `draft -> scheduled -> active -> settled -> reviewed`, with side exits to
   `cancelled` or `breached` when weather, safety, supplier or sponsor promises
   fail.
2. Campaigns spend money or sponsor inventory now to move future demand,
   atmosphere, sponsor fit and risk. Direct financial settlement remains
   separate from fan effects.
3. Travel campaigns are logistics/risk products: bus, rail and flight support
   improve away support and core/ultras trust, but require capacity, security,
   cleaning/damage reserve, refund/cancellation and disruption handling.
4. Family/community events are loyalty-pipeline products: they may lower
   short-term yield through discounted/free blocks, but improve Family/Core
   mood, future local demand, sponsor/community fit and kids/youth pipeline.
5. Choreo and supporter dialogue are SLO-mediated trust products: they can raise
   atmosphere and fan identity if material/safety rules are clear; mishandling
   can increase protest, confiscation, sanction or broken-trust memory.
6. Beer-per-goal style activations are country-profile and regulation gated.
   A real 2025/26 Darmstadt/Krombacher source supports the pattern, but FMX
   should model it as fictional, with non-alcoholic/soft-drink variants in
   stricter profiles and visible public-order/family-fit risk.
7. Sponsor contribution is broader than cash: sponsors can provide funding,
   prizes, transport support, media spend, digital/UGC tooling, staff or
   community grants. Every campaign tracks brand fit and make-good obligations
   if promised exposure or uptake fails.
8. Cooldowns and anti-spam are necessary: too many sponsor pushes or low-value
   events reduce fan sentiment and sponsor ROI even when raw impressions rise.

## Source base

| Area | Primary sources used | FMX use |
|---|---|---|
| Away travel / special trains | Deutsche Bahn football extra trains and EURO 2024 Fan Tickets; RevierSport / Spiegel special-train cost and damage coverage; Tagesspiegel EURO train/security coverage; 2026 travel-cost reporting | `away-train`, `bus-subsidy`, `flight-subsidy`, damage reserve, station/stadium transfer and refund/disruption hooks |
| Family/community/fan festivals | DFL kids/youth clubs; UEFA fan festival; FIFA 2026 fan festival; European Leagues Europe Day 2026 | `family-day`, `summer-party`, `community-ticket-day`, capacity/digital-pass, weather/no-show and community reputation hooks |
| Choreo/SLO/dialogue | UEFA Practical Guide to Supporter Liaison; UEFA 2026 SLO workshop; FSE SLO explainer; UEFA Academy SLO programme; Supporters Direct Scotland | SLO-mediated `choreo-support` / `supporter-dialogue`, material approval, fan trust, risk and sanction hooks |
| Alcohol / beer activations | SV Darmstadt 98 Krombacher goal-bonus pages; UK Sporting Events alcohol law; Heineken football fan campaign; alcohol marketing and public-health coverage | `beer-per-goal` / beverage sponsor campaigns, country-profile gating, family-fit and public-order risk |
| Sponsor activation / measurement | SportsPro, Brandlens, DIGIDECK, SponsorCX, SponsorUnited, MoZeus | sponsor contribution fields, impressions/participation/sentiment KPIs, make-good, cooldown and compliance complexity |

Confidence: **medium-high** on lifecycle, ownership, campaign categories and
risk dimensions; **medium** on quantitative effect sizes because public club ROI
and subsidy data are rarely disclosed; **low-medium** for Spain/Italy
alcohol-profile specifics pending a later primary-source pass.

## Campaign lifecycle

`FanEventCampaign` is an explicit commercial object:

```text
draft -> scheduled -> active -> settled -> reviewed
                 scheduled -> cancelled
                 active -> cancelled
                 active -> breached
                 breached -> settled
```

| State | Meaning |
|---|---|
| `draft` | Campaign assembled from fixture, segment, sponsor and venue data. |
| `scheduled` | Budget, sponsor contribution, venue capacity and risk controls are locked. |
| `active` | The campaign is visible to fans and may affect demand before / during / after the fixture. |
| `settled` | Costs, sponsor contributions, make-goods, refunds and ledger requests are known. |
| `reviewed` | Audience & Atmosphere receives outcome facts and cooldown/fatigue memory updates. |
| `cancelled` | Weather, safety, low uptake, supplier or legal issue stops the event. |
| `breached` | Sponsor, club or partner misses a material obligation; make-good or penalty follows FMX-44 breach rules. |

## Candidate campaign catalog

| Campaign | Primary target | Cost / contribution | Main upside | Main risk |
|---|---|---|---|---|
| `away-train` | Ultras, Core, away travellers | Rail charter/subsidy, security, cleaning, damage reserve; sponsor/city support possible | Away atmosphere, core loyalty, safer coordinated travel | Disruption, station transfer, damage, policing, refund |
| `bus-subsidy` | Core, Family, lower-budget fans | Coach subsidy, marshals, parking, insurance | Cheap domestic away support, predictable capacity | Delay, low comfort, low uptake, route incident |
| `flight-subsidy` | Core, Corporate, continental away fans | Partial airfare/charter, transfer, carbon/reputation cost | Enables far-away cup/continental support | High cost, cancellation, ESG backlash |
| `family-day` | Family, Casual, local community | Discount blocks, kids area, mascot, extra stewarding; family sponsor fit | Family mood, future renewal, kids/youth pipeline, merch/catering | Weather, safeguarding, low margin |
| `summer-party` / `fan-festival` | Casual, Family, Core | Stage, staff, cleaning, security, sponsor zones, weather mitigation | Local brand, sponsor impressions, season-ticket push | Weather cancellation, crowd flow, cost overrun |
| `community-ticket-day` | Family, Casual, local groups | Free/discounted blocks, partner coordination, no-show management | Utilisation, goodwill, future demand, sponsor CSR | No-show, resale/misuse, lower yield |
| `choreo-support` | Ultras, Core | Materials, storage, liaison, approval workflow, security review | Atmosphere, identity, derby/cup emotion | Prohibited material, pyro/sanction, fan autonomy tension |
| `supporter-dialogue` | Ultras, Core, named groups | SLO time, forum venue, communications, follow-up budget | Trust, lower protest/sanction probability, better risk acceptance | Broken promises, low credibility, polarised groups |
| `beer-per-goal` / beverage reward | Core, Casual, adult fans | Sponsor-funded reward pool, POS/venue coordination, compliance controls | Sponsor buzz, catering uplift, match emotion | Alcohol law, public-order, family-fit and health backlash |
| `digital-fan-challenge` | Casual, Fair Weather, remote fans | Sponsor tech/prizes/media spend, moderation, data consent | Impressions, first-party data, social reach | Privacy, IP/moderation, spam fatigue |

## Segment effects

| Segment | Campaigns that usually help | Campaigns that can hurt |
|---|---|---|
| Ultras / Hardcore | Away travel, choreo support, supporter dialogue | Over-branded events, strict searches, alcohol bans without dialogue |
| Core | Away travel, supporter dialogue, community identity events | Broken promises, overpriced sponsored events |
| Family | Family day, community tickets, safe fan festival | Alcohol-heavy campaigns, unsafe crowding, late cancellations |
| Fair Weather | Big fan festivals, digital challenges, cup/derby rewards | Low-stakes dialogue events |
| Corporate | Flight/hospitality-linked away support, premium fan festival | Disorder or controversial sponsor backlash |
| Casual / Event | Beer/soft-drink rewards, fan festival, digital challenge | High-friction signup or repeated low-value sponsor spam |

Effects are inputs to Audience & Atmosphere. CommercialPortfolio emits the
campaign outcome; Audience & Atmosphere owns the final mood, loyalty, trust,
atmosphere and demand changes.

## Contract and settlement rules

`FanEventCampaign` should carry these minimum fields before implementation:

| Field | Meaning |
|---|---|
| `campaignId` | UUIDv7 identity. |
| `campaignKind` | Catalog value such as `away-train`, `family-day`, `beer-per-goal`. |
| `lifecycleState` | draft, scheduled, active, settled, reviewed, cancelled or breached. |
| `fixtureId` / `seasonId` | Fixture-scoped or season/campaign scoped. |
| `targetSegments` | Segment weights and primary affected cohorts. |
| `budgetMinor` | Planned club spend. |
| `sponsorContribution` | Cash, prize, transport support, media, staff or community grant. |
| `fulfilmentModel` | Club-run, sponsor-run, partner-run or supporter-group-coordinated. |
| `capacity` | Participant / ticket / travel / venue cap. |
| `eligibilityPolicy` | Segment, age, member, away allocation or community-partner rules. |
| `riskFlags` | Travel, weather, safety, alcohol, legal, data, low uptake, incident risk. |
| `regulatoryProfile` | Country/profile constraints and required approvals. |
| `expectedEffects` | Mood, loyalty, demand, atmosphere, sponsor-fit and commercial bands. |
| `kpiTargets` | Participation, attendance, impressions, sentiment, sponsor leads or uptake. |
| `cooldownPolicy` | Minimum gap before repeating by kind, segment and sponsor category. |
| `makeGoodPolicy` | Sponsor/fan compensation after low uptake, cancellation or breach. |
| `settlementPolicy` | Timing for costs, sponsor contribution, refunds and make-goods. |
| `provenance` | Source forecasts, venue facts, sponsor contract and rules used. |

Settlement events that must be representable:

- `FanEventCampaignScheduled`
- `FanEventCampaignCostCommitted`
- `FanEventSponsorContributionRecognised`
- `FanEventCampaignCancelled`
- `FanEventMakeGoodGranted`
- `FanEventCampaignSettled`
- `FanEventLowUptakeRecorded`
- `FanEventSegmentEffectPublished`
- `AwayTravelSubsidySettled`
- `ChoreoSupportSettled`
- `BeverageRewardCampaignSettled`
- `CommunityTicketBlockSettled`
- `FanEventCooldownApplied`

Club Management posts ledger entries only after CommercialPortfolio emits the
settlement event. The fan effect event is consumed by Audience & Atmosphere.

## Legal and risk notes

- **Travel:** chartered trains/buses/flights concentrate supporters and require
  capacity, station/parking transfer, police/steward liaison, disruption,
  refund, damage reserve and alcohol/on-board conduct policies.
- **Alcohol:** country profiles must gate campaign availability. England-like
  profiles restrict consumption with pitch view; France-like profiles restrict
  alcohol advertising/sponsorship; Germany-like profiles may allow more stadium
  or fan-zone use but still carry public-order risk. Non-alcoholic/soft-drink
  variants are the default safe fallback.
- **Safety:** fan festivals, family days and choreo support need crowd-flow,
  temporary structure, materials, emergency and prohibited-content checks.
  Unsafe or prohibited behaviour remains abstracted and sanctioned; no how-to
  details.
- **Children / family:** family days and kids/community programs require
  safeguarding and privacy hooks. FMX models this as compliance complexity and
  risk, not personal data about children.
- **Digital / UGC:** digital challenges require eligibility rules, usage rights,
  moderation, data consent and spam fatigue handling.

## Quick / Standard / Expert

| Tier | Surface |
|---|---|
| Quick | Pick a recommended campaign and see total cost, expected mood/atmosphere band, sponsor help and one risk badge. |
| Standard | Compare campaign types, target segments, sponsor contribution, uptake forecast, risk/cooldown and settlement timing. |
| Expert | Inspect lifecycle state, assumptions, capacity, eligibility, SLO/security approvals, KPI targets, make-good, cooldown and source provenance. |

## Acceptance scenarios

```gherkin
Feature: Fan-service campaigns

  Scenario: Subsidised away train improves away support
    Given a high-rivalry away fixture
    And the club schedules an away-train campaign with enough capacity
    When the campaign settles without disruption
    Then Club Management posts travel subsidy and damage reserve outcomes
    And Audience & Atmosphere receives improved core and ultras trust
    And away atmosphere increases for the fixture

  Scenario: Family day trades yield for long-term loyalty
    Given a low-demand home fixture
    When the club schedules a family day with community ticket blocks
    Then ticket yield is reduced
    And Family segment mood, future demand and sponsor community fit improve
    And low uptake is recorded if group attendance misses the forecast

  Scenario: Beer-per-goal is constrained by the country profile
    Given a club in a strict alcohol-profile country
    When a beverage sponsor proposes beer-per-goal
    Then CommercialPortfolio offers a non-alcoholic or off-site variant
    And the risk card shows alcohol, family-fit and public-order constraints

  Scenario: Choreo support uses SLO-mediated approval
    Given a derby fixture with high atmosphere potential
    And the club funds a choreo-support campaign
    When SLO dialogue and material approval succeed
    Then atmosphere and ultras/core trust improve
    And sanction probability is lower than an unmanaged display

  Scenario: Failed low-uptake event creates make-good
    Given a sponsor-funded fan festival has a participation target
    And bad weather reduces attendance below the agreed threshold
    When settlement runs
    Then CommercialPortfolio records low uptake
    And a make-good or future sponsor slot is scheduled
    And fan sentiment depends on communication and compensation quality
```

## Open before approval

- Decide first-playable campaign catalog: minimum eight types or the full ten
  above.
- Decide Quick-mode abstraction: one recommended campaign card per period, or a
  visible campaign board from the start.
- Decide whether alcohol campaigns exist as explicit beer/alcohol language or
  ship behind a generic beverage / non-alcoholic abstraction.
- Decide default cooldown hardness and anti-spam thresholds.
- Decide whether SLO quality is an active staff modifier in MVP or a future
  hook owned by Staff Operations / Audience & Atmosphere.
- Decide whether travel disruption, refund and damage-reserve rules are active
  in MVP or profile-data-only until matchday operations are playtested.
- Decide whether sponsor KPI make-goods are Standard-visible or Expert-only.

## Related

- [[raw-perplexity/raw-fan-service-campaign-catalog-and-effects-2026-06-01]]
- [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[fan-demand-price-elasticity-2026-05-28]]
- [[commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[catering-and-merchandise-operations-2026-06-01]]
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../50-Game-Design/economy-system]]
- [[../50-Game-Design/audience-and-atmosphere]]
- [[../50-Game-Design/stadium-and-campus]]
- [[../50-Game-Design/matchday-event-engine]]
- [[../50-Game-Design/sponsorship-portfolio]]
- [[../30-Implementation/club-economy-commercial-contracts]]
