---
title: Club Economy Commercial Contracts - Draft Contracts
status: draft
tags: [implementation, economy, commercial, contracts, contract-lifecycle, breach, tickets, fan-demand, price-elasticity, season-tickets, cup, competition, matchday, catering, merchandise, operations, inventory, accounting, investor, fmx-41, fmx-42, fmx-43, fmx-44, fmx-45, fmx-46, fmx-47]
created: 2026-05-28
updated: 2026-06-01
type: implementation
binding: false
linear: FMX-41
related:
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/audience-and-atmosphere]]
  - [[../50-Game-Design/sponsorship-portfolio]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../60-Research/fan-demand-price-elasticity-2026-05-28]]
  - [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
  - [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
  - [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
  - [[../60-Research/catering-and-merchandise-operations-2026-06-01]]
  - [[club-economy-accounting-ledger]]
  - [[../10-Architecture/bounded-context-map]]
---

# Club Economy Commercial Contracts - Draft Contracts

## Purpose

Define the contract surface implied by FMX-41 before code exists. This note
extends [[club-economy-accounting-ledger]] with ticketing, fan-demand
elasticity, season-ticket lifecycle accounting, commercial contracts, cup
settlement, fan-event campaigns and Investor entitlement inputs. FMX-44 adds
the shared commercial contract lifecycle, obligation, exclusivity and breach
surface for sponsorship, catering, merchandise, hospitality, suppliers and
venue activations. FMX-45 refines `CompetitionRevenueProfile` and cup
settlement so domestic and continental fixtures can produce hard cash,
receivables, future EV and elimination shock without copying real-world
licensed competitions. FMX-46 adds `MatchdayOperatingCostProfile` and
risk-cost settlement for stewarding, security, policing-style contribution,
medical, cleaning, energy, temporary staff, pitch recovery, insurance,
restrictions and sanctions.

This is draft planning only. It becomes implementation authority only after the
relevant GDDR/ADR path is approved.

## Ownership rule

Per accepted ADR-0058 and ADR-0061, CommercialPortfolio owns:

- ticketing policies and season-ticket campaigns;
- commercial contract portfolio for sponsorship, catering, merchandise,
  hospitality, supplier and venue-activation contracts;
- fan-event campaign choices and budgets;
- commercial forecasts and per-fixture commercial/operating settlement;
- Investor entitlement grant policy in singleplayer.

Club Management owns:

- finance ledger posting for all commercial outcomes;
- budget envelopes, board pressure and insolvency state.

Other domains provide facts through contracts. They do not write commercial
state or ledger entries directly.

## Contract sketches

### `FanDemandForecast`

Owned by Audience & Atmosphere, consumed by CommercialPortfolio.

| Field | Meaning |
|---|---|
| `clubId` | Club receiving demand. |
| `fixtureId` | Optional fixture scope; absent for season forecast. |
| `forecastHorizon` | Match, week, campaign or season. |
| `segmentDemand` | Per-segment latent demand, actual forecast and confidence band. |
| `attendanceFloorBySegment` | Minimum expected attendance share before severe trust/identity shocks. |
| `priceSensitivityBySegment` | Low/medium/high/very-high response shape by segment. |
| `referencePriceBySeatClass` | Country/club/seat-class baseline for fairness comparisons. |
| `ticketingTrustState` | Supporter trust in pricing policy and recent price-change memory. |
| `fixtureAttractiveness` | Opponent, rivalry, stakes, form, stars, novelty, kickoff and weather profile. |
| `capacityPressure` | Underfilled, balanced, constrained or sold-out latent-demand state. |
| `seasonTicketRenewalProbability` | Renewal probability by segment and seat class. |
| `seasonTicketUtilisationProbability` | Aggregate attendance / release probability for season-ticket cohorts. |
| `waitlistPressure` | Scarcity and conversion pressure by segment and seat class. |
| `cateringPropensity` | Per-segment spend propensity band. |
| `merchandisePropensity` | Per-segment spend propensity band. |
| `hospitalityDemand` | Corporate/premium demand band. |
| `sponsorCategoryFit` | Fit/risk by sponsor category. |
| `boycottRisk` | Segment-driven demand shock risk. |
| `provenance` | Source facts and freshness. |

Calculation contract:

- price response is applied to latent demand before stadium capacity is
  allocated;
- if latent demand exceeds capacity, price changes may affect segment mix,
  revenue and trust even when attendance stays full;
- season-ticket demand and single-ticket demand are separate curves;
- ticketing trust primarily affects future renewal, boycott risk, atmosphere
  and sponsor fit rather than only the current fixture;
- country profile, club DNA and fan-segment mix provide ranges, never final
  balance constants.

### `FixtureCommercialProfile`

Produced from League/Competition fixture state plus Rivalry and Match context.

| Field | Meaning |
|---|---|
| `fixtureId` | Fixture identity. |
| `fixtureKind` | League, cup, playoff, friendly, continental, final. |
| `homeClubId` / `awayClubId` | Participating clubs. |
| `importanceTier` | Routine, high, top, season-decider. |
| `fixtureStakes` | Routine, promotion, relegation, title, qualification, elimination or final. |
| `rivalryTier` | None, mild, strong, high, volatile. |
| `opponentDrawPower` | Generated reputation/star pull band. |
| `starPullBand` | Notable player/manager attraction without using real-world names. |
| `noveltyBand` | First promotion season, rare opponent, new-stadium effect or farewell/icon event. |
| `homeFormBand` | Recent form and long-term performance trend. |
| `kickoffConvenience` | Weekend afternoon, evening, late, midweek or holiday. |
| `awayDemandBand` | Away-following pressure. |
| `riskBand` | Security and sanction risk. |
| `weatherBand` | Forecast/weather effect band. |
| `campaignTriggers` | Goal, derby, cup-final or star-player campaign flags. |

### `StadiumCommercialSnapshot`

Owned by Stadium Operations, read by commercial and operating settlement.

| Field | Meaning |
|---|---|
| `stadiumId` | Venue identity. |
| `capacityBySeatClass` | Standing, seated, family, premium, suites, accessibility and away. |
| `availableCapacityBySeatClass` | After construction, sanctions, accessibility rules and away allocations. |
| `seasonTicketEligibleCapacityBySeatClass` | Home inventory that may be sold as season tickets after protected allocations. |
| `cateringThroughput` | Service capacity and queue quality. |
| `merchThroughput` | Shop and fulfilment capacity. |
| `hospitalityQuality` | Premium service band. |
| `fanZoneQuality` | Dwell-time and activation band. |
| `ownershipModel` | Owned, leased, municipal, ground-share. |
| `fixedOperatingCost` | Weekly venue cost range. |
| `matchdayVariableCostBands` | Venue operating cost bands for routine through high-risk fixtures. |
| `stewardingDensityBand` | Baseline and risk-tier staffing density. |
| `securityCapabilityBand` | Search, segregation, surveillance and control capability. |
| `medicalEmergencyCapacity` | First-aid, ambulance, doctor and heat/water readiness band. |
| `cleaningWasteCostBand` | Cleaning, waste and sanitation cost band. |
| `energyUtilityCostBand` | Floodlight, heating/cooling, water and technical-system cost band. |
| `pitchCondition` | Pitch health and recovery-cost risk. |
| `awaySeparationConstraints` | Segregation, ingress/egress and away-sector constraints. |
| `eventEligibility` | Concert, conference, community/fan event tags. |

### `TicketingPolicy`

Owned by CommercialPortfolio.

| Field | Meaning |
|---|---|
| `policyId` | Policy identity. |
| `seasonTicketShareTarget` | Target share by seat class. |
| `seasonTicketDiscountBand` | Discount versus comparable single-ticket basket. |
| `seasonTicketLifecyclePolicy` | Campaign states and windows: renewal, relocation, presale, waitlist, public sale and closed. |
| `seasonTicketAccountingPolicy` | Accrual recognition mode and match-allocation basis. |
| `singleTicketPriceBands` | Price ranges by seat class. |
| `topMatchSurchargePolicy` | Off, cautious, market, premium. |
| `dynamicPricingMode` | Disabled, categories-only, bounded-dynamic or experimental. |
| `pricingTransparencyPolicy` | How clearly price changes and categories are communicated. |
| `seasonTicketProtectionRule` | Rules preserving season-ticket value versus single-ticket promotions. |
| `seatRelocationPolicy` | Eligibility and priority for moving seats between renewal and new sale. |
| `memberPresalePolicy` | Member, fan-group and loyalty-tier access before public sale. |
| `waitlistPolicy` | Waitlist eligibility, offer order, offer expiry and pressure output. |
| `paymentPlanPolicy` | Upfront, internal instalment, finance partner and account-credit handling. |
| `useItOrReleasePolicy` | Aggregate utilisation target, no-show consequences and seat-release incentive. |
| `officialExchangePolicy` | Club-controlled release/exchange rules and credit treatment; not a free secondary marketplace. |
| `groupCompensationPolicy` | Credit/refund/discount treatment for cancelled or inaccessible included matches. |
| `concessionPolicy` | Youth/family/senior/community rules. |
| `awayAllocationPolicy` | Allocation and pricing rules. |
| `fanTrustGuardrail` | Max tolerated price shock by segment. |
| `effectiveFromWeekId` | Deterministic activation. |

### `SeasonTicketCampaign`

Owned by CommercialPortfolio. Operates on fan-group cohorts, not individual
supporters.

| Field | Meaning |
|---|---|
| `campaignId` | UUIDv7 identity. |
| `clubId` | Club running the campaign. |
| `seasonId` | Season scope. |
| `policyId` | Linked `TicketingPolicy`. |
| `campaignState` | planning, renewalWindow, seatRelocation, memberPresale, waitlistAllocation, publicSale, closed, inSeasonAdjustment or renewalReview. |
| `includedFixturePolicy` | League-only, league-plus-defined-cup, premium package or profile-specific product. |
| `seatClassQuotas` | Standing, seating, family, premium, suites/hospitality and accessibility. Away inventory is excluded. |
| `targetShareBySeatClass` | Target season-ticket share by seat class. |
| `discountVsSingleTicketBasketBand` | Discount against a comparable single-ticket basket. |
| `renewalWindow` | Start/end week and communication policy. |
| `earlyBirdWindow` | Optional early-bird or loyalty-protection period. |
| `seatRelocationWindow` | Relocation eligibility and priority. |
| `memberPresaleWindow` | Member, loyalty-tier or fan-group sale period. |
| `waitlistPolicy` | Ordering, eligibility, expiry and waitlist-pressure output. |
| `paymentPlanPolicy` | Upfront, internal instalment, finance partner and account-credit handling. |
| `loyaltyTierPolicy` | Renewal rights, attendance minimums, priority windows and benefit bands. |
| `fanGroupEligibilityPolicy` | Protected group-level access rules without single-fan modelling. |
| `useItOrReleasePolicy` | Aggregate no-show threshold, release incentives and renewal consequence band. |
| `groupCompensationPolicy` | Credit/refund/discount treatment for group-level access failures. |
| `allocationOutcome` | Sold seats and unmet demand by segment, package and seat class. |
| `accountingScheduleId` | Linked `SeasonTicketAccountingSchedule`. |
| `trustGuardrail` | Price-shock and fairness limits from Audience & Atmosphere / country profile. |
| `provenance` | Forecasts, stadium snapshot, fixture set and policy versions used. |

### `SeasonTicketAccountingSchedule`

Owned by CommercialPortfolio as an accrual/recognition schedule; Club
Management posts the resulting ledger entries. It distinguishes cash receipt,
receivables, deferred revenue and match-by-match recognition.

| Field | Meaning |
|---|---|
| `scheduleId` | UUIDv7 identity. |
| `campaignId` | Linked season-ticket campaign. |
| `cashReceiptPlan` | Expected and actual receipts by week/payment method. |
| `instalmentReceivableMinor` | Club-owned instalment receivables. |
| `financePartnerFeeMinor` | Fee/cost where a finance partner funds the supporter. |
| `grossConsiderationMinor` | Total ticket consideration before credits and fees. |
| `accountCreditAppliedMinor` | Existing credits applied against renewal. |
| `deferredRevenueMinor` | Remaining contract liability for future included matches. |
| `recognizedRevenueByMatch` | Revenue released as each included match is played. |
| `remainingPerformanceObligations` | Included matches / access benefits still owed. |
| `creditLiabilityMinor` | Exchange, compensation or carried credit pool. |
| `refundLiabilityMinor` | Cash refund pool where policy/profile requires it. |
| `materialRightLiabilityMinor` | Optional hook for cup priority rights or renewal discounts. |
| `recognitionPolicy` | Equal per included match, seat-class weighted, package weighted or profile-specific. |
| `adjustmentEvents` | Cancellations, relocations, sanctions, cup opt-ins and package amendments. |

### `CommercialContract`

Owned by CommercialPortfolio.

| Field | Meaning |
|---|---|
| `contractId` | UUIDv7 identity. |
| `contractVersion` | Version number; amendments and renewals create new versions and keep the old version in history. |
| `contractKind` | sponsorship, catering, merchandise, hospitality, supplier or venue-activation. |
| `lifecycleState` | draft, offered, negotiating, active, renewalDue, breached, suspended, terminated or expired. |
| `counterpartyProfileId` | Fictional generated partner profile. |
| `assetPackage` | Rights granted: shirt, sleeve, stand, shop, pouring rights, hospitality area, digital inventory, fan-zone slot, etc. |
| `term` | Start/end week, renewal window, option periods and break clauses. |
| `cashSchedule` | Upfront, monthly, seasonal, matchday, milestone or arrears payments. |
| `recognitionSchedule` | Revenue/cost recognition period and performance-obligation basis. |
| `commercialModel` | Fixed fee, revenue share, royalty, minimum guarantee, management fee, lease/rent, supplier rebate or hybrid. |
| `fixedGuaranteeMinor` | Guaranteed amount, if any. |
| `minimumGuaranteeMinor` | Minimum annual / seasonal guarantee to true up against share/royalty. |
| `revenueShareBps` | Share rate in basis points, if any. |
| `costShareBps` | COGS/staffing split, if any. |
| `royaltyBps` | Merchandise/licence royalty, if any. |
| `exclusivityScope` | Category, territory, asset scope and carve-outs. |
| `obligationSchedule` | Club and counterparty obligations, due windows and fulfilment state. |
| `serviceLevelPolicy` | Queue, stockout, open-stand, fulfilment, hospitality or quality thresholds. |
| `performanceBonuses` | Promotion, cup, table, reach or attendance triggers. |
| `penaltyPolicy` | Fee reduction, make-good, cash penalty, suspension or termination rule. |
| `breachPolicy` | Severity, cure window, repeat threshold and termination rights. |
| `renewalPolicy` | First negotiation, first refusal, auto-renew, matching right or open-market policy. |
| `fanFitRisk` | IP-clean category risk and segment reaction band. |
| `reputationRisk` | Counterparty, club and regulatory scandal hooks. |
| `portfolioDependencies` | Conflicts or dependencies with other active contracts. |
| `aiDecisionHints` | Read-only factors for FMX-51 AI club behaviour; not AI behaviour itself. |
| `auditTrail` | Event log with actor, event type, week and summary payload. |
| `provenance` | Source forecasts, snapshots and policy versions used. |

Shared lifecycle:

```text
draft -> offered -> negotiating -> active -> renewalDue -> expired
                                   active -> breached -> active
                                   breached -> suspended -> terminated
                                   active -> terminated
```

`renewed` is an event, not a long-lived state: it creates a successor
`contractVersion` and returns the contract to `active`.

Shared breach severities:

| Severity | Meaning | Default game consequence |
|---|---|---|
| `curable` | Minor missed obligation, late report, one missed activation, small stockout. | Cure timer, make-good option, small fan/service hit. |
| `material` | Repeated SLA failure, missed guarantee payment, exclusivity conflict, serious fulfilment miss. | Penalty, fee reduction, suspended rights, renegotiation and trust impact. |
| `critical` | Fraud, regulatory ban, severe safety/health incident, major scandal or persistent uncured material breach. | Termination for cause, damages/repayment, reputation shock and category cooldown. |

Family schedules:

| Family | Family-specific schedule |
|---|---|
| Sponsorship | Asset inventory, category exclusivity, activation obligations, appearance/digital deliverables, morals/reputation hooks. |
| Catering | POS/opening rules, queue/stockout/waste/service SLAs, supplier mandates, alcohol/food policy. |
| Merchandise | Royalty/MAG, channel scope, stock/returns risk, campaign drops, fulfilment SLA. |
| Hospitality | Seat/package inventory, service level, minimum spend/headcount, premium quality, sponsor overlap. |
| Supplier | Mandatory supplier, rebates, volume targets, equipment support, exclusivity carve-outs. |
| Venue activation | Event rights, staffing, safety, sponsor contribution, fulfilment model, cancellation policy. |

### Catering and merchandise operations (FMX-47)

FMX-47 deepens the catering and merchandise families beyond a flat
`revenueShareBps`/`costShareBps` into an explicit operations + inventory side.
CommercialPortfolio settles each fixture/period; Club Management posts the ledger
entry (ADR-0050 single-writer; ADR-0061 ownership). Numbers are calibration
ranges, not constants. Source: [[../60-Research/catering-and-merchandise-operations-2026-06-01]].

`operatingModel` (per catering/merch contract) decides risk allocation:

| Family | `operatingModel` values | Who bears stock/inventory + fulfilment risk |
|---|---|---|
| Catering | `inHouse`, `concessionLease`, `managementFee`, `revenueShare`, `magPlusShare` | Club (`inHouse`, `managementFee`) vs operator (others) |
| Merchandise | `ownStoreEcom`, `licensedPartner`, `kitSupplierGuarantee`, `pureLicensing` | Club (`ownStoreEcom`) vs partner/manufacturer/licensee (others) |

Operations fields added to the catering/merch schedules:

| Field | Meaning |
|---|---|
| `operatingModel` | Risk-allocation model above; drives which cost/inventory lines apply. |
| `cogsBps` | Cost of goods sold band (catering blended ~23-32%; merch kit 35-45%). |
| `labourOpexBps` | Catering staffing + other opex band (in-house/management-fee only). |
| `wasteRateBps` | Catering spoilage band (~3-5% of food COGS normal, higher on shock). |
| `perCapitaBand` | Catering spend-per-attendee band before capacity/stockout cap. |
| `serviceCapacity` | Throughput cap (`transactions_per_min × window × basket`) from Stadium snapshot. |
| `stockPlan` | Merch planned stock buy vs demand forecast; lead-time + size/SKU split. |
| `demandMultipliers` | Merch spike factors: kit launch (~3-5×), icon signing (~1.3-1.5×), cup-final (~1.1-1.3×), promotion/trophy. |
| `markdownPolicy` | Merch season-end markdown (30-70%) + write-down-to-NRV rule (IAS 2). |
| `returnsRateBps` | E-commerce apparel returns band (~15-25%) + net return cost. |
| `fulfilmentSla` | Merch dispatch/delivery SLA + per-order fulfilment cost. |
| `alcoholPolicy` | Catering `inBowl` / `concourseOnly` / `nearBan` dial (revenue↔safety; links FMX-53 country profile). |
| `supplierMandate` | Pouring-rights / must-buy / ranging constraints + category exclusivity carve-outs (reuses `exclusivityScope`). |

Settlement separates the ledger lines (named in ADR-0050): revenue, COGS,
labour/opex, royalty/MAG true-up, guarantee shortfall, waste/spoilage and stock
write-down — never a single net number. Cash-vs-recognition follows IFRS 15 per
`operatingModel` (POS at sale; concession rent straight-line; revenue-share as
concessionaire sales occur; royalty under the sales-based royalty exception; MAG
straight-line with overage true-up only above the floor).

Additional operations events that must be representable:

- `MatchdayCateringSettled` (revenue + COGS + labour + waste lines)
- `CateringStockoutRecorded` (lost demand + satisfaction penalty to Audience & Atmosphere)
- `CateringWastePosted`
- `MerchandiseStockPlanCommitted`
- `MerchandiseSalesSettled` (full-price + spike lines)
- `MerchandiseMarkdownApplied`
- `MerchandiseStockWrittenDown`
- `MerchandiseReturnsSettled`
- `CommercialRoyaltyTrueUpRecognised`
- `CommercialGuaranteeShortfallRecognised`

Contract events that must be representable before implementation:

- `CommercialOfferCreated`
- `CommercialOfferIssued`
- `CommercialContractActivated`
- `CommercialContractAmended`
- `CommercialRenewalWindowOpened`
- `CommercialContractRenewed`
- `CommercialContractExpired`
- `CommercialObligationMissed`
- `CommercialExclusivityConflictDetected`
- `CommercialBreachOpened`
- `CommercialBreachCured`
- `CommercialMakeGoodGranted`
- `CommercialPenaltyApplied`
- `CommercialContractSuspended`
- `CommercialContractTerminated`
- `CommercialContractSuperseded`

### `CompetitionRevenueProfile`

Owned by League/Competition data, consumed by CommercialPortfolio.

| Field | Meaning |
|---|---|
| `competitionId` | Fictional competition identity. |
| `countryProfileId` | Country/profile scope. |
| `competitionKind` | domesticLeague, domesticCup, leagueCup, superCup, playoff, continentalCup, friendly or finalSeries. |
| `fixtureSettlementKind` | homeTie, awayTie, twoLegTie, replay, neutralSemi, neutralFinal or leaguePhase. |
| `roundBand` | qualifying, early, middle, late, semi, final, leaguePhase, knockoutPlayoff or knockout. |
| `prestigeBand` | local, national, major, continentalLower, continentalMajor or global. |
| `prizeSchedule` | Participation, win/progression, finalist/winner, league-phase, ranking and solidarity bands. |
| `gateSharingRule` | Gross/net basis, deductions, home/away/organizer shares, levy/pool and expense caps. |
| `ticketAllocationRule` | Away quota, finalist allocation, neutral venue split, sponsor allocation and protected supporter quotas. |
| `mediaPaymentRule` | Central pool, facility/live-selection fee, value/legacy pillar, payment cadence and settlement delay. |
| `settlementDelay` | Cash timing and receivable risk by revenue family. |
| `recognitionPolicy` | When revenue is receivable, cash, accrued or forecast-only. |
| `travelCostRule` | Away, neutral, final and continental travel/accommodation expectations. |
| `securityCostRule` | Home/neutral security basis, rivalry/risk modifiers and regulation constraints. |
| `neutralVenueRule` | Host body, allocation split, central hospitality, club share and final travel. |
| `replayOrTwoLegRule` | Replay, extra-time, penalties and two-leg rules by round. |
| `matchdayCommercialModifiers` | Catering, merchandise, hospitality and fan-zone demand bands. |
| `sponsorBonusTriggerRules` | Round reached, televised tie, final, upset, trophy or continental qualification. |
| `fixtureCongestionRule` | Rest-day pressure, travel load, training opportunity cost, fatigue/injury hooks. |
| `forecastPolicy` | Expected future-round value, progression probability source, confidence band and elimination shock. |
| `solidarityRule` | Amateur/lower-tier, qualifying, non-participant or parachute-style support. |
| `communityOverridePolicy` | Which fields community packs may override and required provenance. |
| `ipCleanSourceProfile` | Fictional template family used as inspiration, never a licensed clone. |
| `provenance` | Source facts, research note, profile version and effective season. |

Draft IP-clean preset families:

| Family | Use |
|---|---|
| `central-round-domestic-cup` | DFB-like central round payments, no replay, neutral final and home-tie windfalls. |
| `shared-gate-underdog-cup` | FA-like prize ladder, net-gate sharing, live facility fees and replay/neutral rules. |
| `federation-hosting-cup` | RFEF-like lower-tier hosting, federation aid and late two-leg option. |
| `seeded-elite-entry-cup` | Lega-like elite later entry, central media and compact late-round value. |
| `solidarity-amateur-cup` | FFF-like amateur aid, travel/referee support and grassroots cup identity. |
| `continental-value-pillar-cup` | UEFA-like equal share, performance, ranking/progression, value/legacy and solidarity pools. |

Settlement events that must be representable:

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

### `MatchdayOperatingCostProfile`

Owned by CommercialPortfolio as the per-fixture operating settlement profile.
It consumes facts from Stadium Operations, Audience & Atmosphere, Rivalry
System, Regulations & Compliance, League/Competition and Matchday Event Engine.
Club Management posts ledger entries only after settlement events are emitted.

| Field | Meaning |
|---|---|
| `profileId` | Profile identity and version. |
| `fixtureId` | Fixture scope. |
| `venueId` | Stadium Operations venue identity. |
| `competitionId` | League/Competition profile reference. |
| `countryProfileId` | Country or abstract fallback profile. |
| `riskTier` | routine, guarded, elevated, highRisk, restricted or closedDoor. |
| `riskDrivers` | Rivalry, away support, kickoff, weather, stakes, incident memory, sanctions and venue state. |
| `attendanceBand` | Expected attendance / open-sector band used for variable costs. |
| `awayFanBand` | Away allocation, travel pressure and segregation pressure. |
| `openSectorPlan` | Which home/away/premium/family/accessibility sectors are open or closed. |
| `stewardingRule` | Stewarding baseline and risk multiplier. |
| `securityRule` | Search, segregation, private-security and surveillance rule. |
| `policingContributionRule` | None, footprint-limited, shared, high-risk contribution or competition-hosted. |
| `medicalEmergencyRule` | First-aid, ambulance, doctor, heat/water and emergency-service profile. |
| `cleaningWasteRule` | Cleaning, waste and sanitation cost rule. |
| `energyUtilityRule` | Floodlight, heating, cooling, water and technical-system cost rule. |
| `temporaryStaffRule` | Turnstile, retail, catering, hospitality, fan-zone and contractor staffing rule. |
| `officialsRule` | Match official, VAR/technical and competition-operations cost/levy rule. |
| `pitchRecoveryRule` | Weather, pitch condition, turf quality and event-density recovery rule. |
| `insuranceComplianceRule` | Seasonal overhead allocation and inspection/risk-history modifier. |
| `damageReserveRule` | Property, transport, cleanup and supporter-incident reserve rule. |
| `restrictionRule` | Alcohol, away-fan, sector, ghost-match and public-order constraints. |
| `mitigationOptions` | Security upgrade, fan dialogue, alcohol restriction, away cap, water/medical upgrade, pitch prep. |
| `forecastCostBand` | Quick/Standard visible expected operating-cost range. |
| `settlementDelay` | Matchday, post-match disciplinary delay or monthly allocation. |
| `provenance` | Source facts, profile version, confidence and research/source note. |

Risk tiers:

| Tier | Meaning |
|---|---|
| `routine` | Normal fixture, no special public-order signal. |
| `guarded` | Attendance, away demand, kickoff or weather needs visible planning. |
| `elevated` | Rivalry, cup stakes, incident memory or away-travel pressure. |
| `highRisk` | High/volatile rivalry or regulator/police high-risk classification. |
| `restricted` | Alcohol ban, away cap/ban, sector closure or special entry controls. |
| `closedDoor` | Ghost match / behind-closed-doors sanction. |

Settlement events that must be representable:

- `MatchdayOperatingCostForecasted`
- `MatchdayStewardingCostPosted`
- `MatchdaySecurityCostPosted`
- `MatchdayPoliceContributionPosted`
- `MatchdayMedicalEmergencyCostPosted`
- `MatchdayCleaningWasteCostPosted`
- `MatchdayEnergyCostPosted`
- `MatchdayTemporaryStaffCostPosted`
- `MatchdayOfficialsCostPosted`
- `PitchRecoveryCostPosted`
- `MatchdayInsuranceComplianceCostAllocated`
- `MatchdayDamageReserveAdjusted`
- `MatchdaySanctionFinePosted`
- `SectorClosureRevenueImpactRecorded`
- `GhostMatchSettlementRecorded`
- `AwayFanRestrictionApplied`
- `AlcoholRestrictionApplied`
- `RiskTierReclassified`
- `MitigationActionSettled`

### `FanEventCampaign`

Owned by CommercialPortfolio; causal effects apply through Audience &
Atmosphere and settle through the ledger.

| Field | Meaning |
|---|---|
| `campaignId` | Campaign identity. |
| `campaignKind` | away-train, bus-subsidy, flight-subsidy, summer-party, family-day, beer-per-goal, choreo-support, community-ticket-day. |
| `targetSegments` | Fan segments affected. |
| `fixtureId` | Optional linked fixture. |
| `budgetMinor` | Planned club spend. |
| `sponsorContributionMinor` | Sponsor support, if any. |
| `capacity` | Participant/fan limit. |
| `fulfilmentModel` | Club-run, sponsor-run, partner-run. |
| `expectedEffects` | Mood, loyalty, attendance, catering/merch/hospitality bands. |
| `riskFlags` | Weather, security, alcohol policy, low uptake, incident risk. |
| `settlementPolicy` | When costs and sponsor contributions post. |

### `InvestorEntitlementGrant`

Produced by platform/payment boundary, consumed by CommercialPortfolio for
entitlement policy and by Club Management for the final ledger posting.

| Field | Meaning |
|---|---|
| `entitlementId` | Platform entitlement identity. |
| `saveId` | Singleplayer save scope. |
| `userId` | Owning account. |
| `skuId` | Store SKU. |
| `cashGrantMinor` | Exact in-game cash amount. |
| `currencyProfile` | In-game currency profile. |
| `platform` | Web, iOS, Android, desktop, etc. |
| `storeTransactionRef` | Opaque transaction reference. |
| `grantedAt` | Grant timestamp. |
| `disclosureVersion` | Disclosure text/version accepted. |
| `refundOrRevocationPolicy` | Platform/legal handling hook. |

Rules:

- only accepted in singleplayer saves;
- idempotent by `entitlementId`;
- posts one `investor_entitlement_cash_grant` ledger entry;
- does not mutate ownership, board, fan, sponsor, debt or compliance state.

## Settlement flow

```mermaid
sequenceDiagram
    participant League
    participant Fan as Audience & Atmosphere
    participant Stadium as Stadium Operations
    participant Commercial as CommercialPortfolio
    participant Club as Club Management
    participant Ledger as Club Ledger

    League->>Commercial: FixtureCommercialProfile + CompetitionRevenueProfile
    Fan->>Commercial: FanDemandForecast + atmosphere/risk facts
    Stadium->>Commercial: StadiumCommercialSnapshot
    Commercial->>Commercial: Apply TicketingPolicy + CommercialContracts + MatchdayOperatingCostProfile
    Commercial->>Club: Commercial and operating settlement events
    Club->>Ledger: Post season-ticket cash / receivables / deferred revenue
    Club->>Ledger: Post matchday commercial and operating settlement
    Commercial->>Fan: FanEventCampaign outcome facts
    Club->>Ledger: Post campaign costs / sponsor contributions
```

## Read models

| Read model | Purpose |
|---|---|
| `CommercialForecastSnapshot` | Quick/Standard finance dashboard and forecast. |
| `TicketingPolicySnapshot` | Ticketing UI and explainability. |
| `SeasonTicketCampaignSnapshot` | Lifecycle state, renewal, allocation, waitlist, utilisation, cash, discount and opportunity-cost view. |
| `SeasonTicketAccountingSchedule` | Deferred revenue, receivables, credits and match-by-match recognition. |
| `CommercialContractPortfolio` | Sponsor/catering/merchandise/hospitality/supplier/activation contract board. |
| `CommercialContractRegister` | Lifecycle state, contract version, renewal window, breach case and obligation status. |
| `CommercialExclusivityGraph` | Category/territory/asset overlaps and blocked/narrowed offers. |
| `MatchdayCommercialSettlement` | Per-fixture revenue/cost breakdown. |
| `MatchdayOperatingCostSettlement` | Per-fixture operating cost, risk-tier and restriction breakdown. |
| `FanEventCampaignBoard` | Fan-service event choices and results. |
| `CupRunRevenueForecast` | Secured cup cash, earned receivables, future-round EV, payment timing and elimination shock. |
| `InvestorGrantAudit` | Entitlement and ledger provenance for SP cash grants. |

## Test scenarios before implementation

- Season-ticket share changes early cash and top-match upside.
- Season-ticket sale posts cash or receivable plus deferred revenue, then
  recognises match revenue only when included fixtures are played.
- Instalment plans change cash timing without changing the included-match
  performance obligation.
- Finance-partner plans post earlier net cash and a partner fee rather than
  club-owned receivable risk.
- Seat-release / no-show policies change aggregate utilisation and credit
  liabilities without creating individual supporter records.
- Cancelled or inaccessible included matches post group-level credit/refund
  liability according to policy.
- Loyal fan segments stabilise bad-year attendance.
- Fair-weather segments create high upside and high volatility.
- Rivalry/top-match surcharge changes single-ticket revenue and fan-trust risk.
- High latent demand can keep attendance full while changing segment mix and
  future renewal risk.
- Opaque price jumps reduce ticketing trust and future renewal even if current
  revenue rises.
- Home cup tie posts ticket, catering, merchandise, security, prize/media and
  sponsor effects separately.
- Matchday operating-cost profile posts stewarding, security,
  policing-style, medical, cleaning, energy, temporary staff, officials, pitch,
  insurance and sanction effects separately.
- High-risk rivalry fixture shows mitigation before operating settlement.
- Alcohol restriction reduces catering upside and security/sanction exposure.
- Sector closure reduces capacity while fixed required operating costs remain.
- Ghost match removes attendance income while required stadium, security,
  medical, energy and competition-operation costs still post.
- Away cup tie posts travel/accommodation plus profile-defined gate share or
  facility fee.
- Neutral final uses allocation, central prize/media, travel and sponsor rules
  instead of normal home-gate assumptions.
- Cup progression adds actual next-fixture settlement and recalculates future
  round EV.
- Early cup exit removes future EV and records a forecast shock without posting
  a cash loss unless an earned receivable is reversed.
- Continental league-phase settlement separates equal share, performance,
  ranking/progression, value/legacy and solidarity pools.
- Fixture congestion creates forecast risk hooks without moving fatigue/injury
  ownership out of sporting systems.
- Own catering has higher upside and cost risk than concession.
- Merch campaign can profit or fail through inventory/fulfilment assumptions.
- A sponsor exclusivity conflict is blocked, narrowed by carve-out or value
  reduced before signature.
- A curable missed activation creates a make-good instead of immediate
  termination.
- Repeated catering SLA failures escalate into material breach, ledger penalty
  and fan-service impact.
- Critical counterparty or safety breach can terminate a deal and post exit
  cash separately from normal revenue.
- Renewal windows enforce incumbent rights before a competing offer can be
  accepted.
- Upfront sponsor cash improves runway while recognition follows the delivery
  schedule.
- AI club hints are exposed as read-only factors, but FMX-44 does not implement
  final AI behaviour.
- Beer-per-goal campaign posts sponsor contribution and alcohol-policy risk.
- Away-train subsidy improves loyalty/away atmosphere and posts real cost.
- Investor grant is idempotent, SP-only and posts clean cash without side effects.

## Related

- [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]]
- [[../60-Research/fan-demand-price-elasticity-2026-05-28]]
- [[../60-Research/season-ticket-lifecycle-and-accounting-2026-05-28]]
- [[../60-Research/commercial-contract-lifecycle-and-breach-model-2026-05-28]]
- [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]]
- [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]]
- [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- [[club-economy-accounting-ledger]]
