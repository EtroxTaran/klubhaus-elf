---
title: Matchday Operating Costs and Risk-Cost Settlement - Research Synthesis 2026-05-29
status: draft
tags: [research, economy, matchday, operations, security, stadium, sanctions, risk, fmx-46]
context: [stadium-operations, club-management-economy]
created: 2026-05-29
updated: 2026-05-29
type: research
binding: false
linear: FMX-46
sourceType: external
related:
  - [[raw-perplexity/raw-matchday-operating-costs-risk-settlement-2026-05-29]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[cup-and-competition-revenue-profiles-2026-05-28]]
  - [[club-management-sub-aggregate-audit-2026-05-28]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../50-Game-Design/matchday-event-engine]]
  - [[../50-Game-Design/rivalry-system]]
  - [[../50-Game-Design/stadium-and-campus]]
  - [[../50-Game-Design/audience-and-atmosphere]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
---

# Matchday Operating Costs and Risk-Cost Settlement - Research Synthesis 2026-05-29

## Question

How should FMX model matchday operating costs so home fixtures, derbies, cup
ties, sanctions, alcohol rules, away-fan restrictions and venue incidents are
realistic enough for Expert players but fair enough for a roguelite economy?

Nico's FMX-46 defaults:

- use a profile/event surface and respect the now-accepted FMX-32 boundary
  split instead of hiding every concern inside Club Management;
- use tiered country/profile modifiers for policing-style costs, not exact
  legal invoice formulas;
- warn and offer mitigation before severe incident or sanction costs settle.

## Summary

The research answer is a **data-driven `MatchdayOperatingCostProfile`**:

1. Matchday operating cost is not one `matchday_cost` number. It is a bundle of
   stewarding, security, policing/public-order contribution, medical,
   cleaning/waste, energy, temporary staff, officials, pitch recovery,
   insurance/compliance, damage reserve and sanction effects.
2. FMX should use risk tiers rather than legalistic formulas. Public sources
   support the categories, but exact charge rules vary by country, police
   authority, fixture and venue.
3. Restrictions are economy levers. Alcohol bans, away-fan caps, sector
   closures and ghost matches change revenue, cost and risk at the same time.
4. Costs settle through events. CommercialPortfolio owns per-fixture operating
   settlement policy and Saga state; Club Management remains the sole ledger
   writer per ADR-0050. Regulations, Rivalry, Stadium Operations, Audience &
   Atmosphere, League/Competition and Matchday Event Engine publish facts.
5. Fairness comes from prior visibility: Quick shows risk/cost bands, Standard
   shows drivers and mitigations, Expert shows formula inputs, source profile
   and sensitivity.

## Source base

| Area | Primary sources used | FMX use |
|---|---|---|
| Stadium safety and stewarding | UEFA Safety and Security Regulations; SGSA Green Guide / stewarding factsheets. | Safety/security roles, stewarding separation, risk-based operations planning. |
| Policing-style costs | UK House of Commons football-policing cost briefing; Bremen / German high-risk policing-cost ruling and DFL response. | Profile-driven chargeability and high-risk multipliers, not universal invoice formulas. |
| Venue operations | FIFA Stadium Guidelines facility management, turf/pitch design and technical systems. | Cleaning, maintenance, pitch recovery, power/water/technical system cost hooks. |
| Discipline and sanctions | UEFA disciplinary regulations and attendance sanctions page; FIFA disciplinary-code routing. | Fines, partial closures, behind-closed-doors outcomes and supporter attendance restrictions. |
| Germany | DFB safety provisions; Bremen / DFL policing-cost material. | Safety concept, security officer, stadium order, high-risk police contribution hook. |
| England | SGSA / UK safety certification; Sporting Events alcohol law; UK policing briefing. | High-control profile, club stewarding, alcohol restriction, SPS-style cost uncertainty. |
| Spain | BOE Ley 19/2007 and Real Decreto 203/2010. | Anti-violence framework, match-risk controls, administrative/security posture. |
| Italy | FIGC Codice di Giustizia Sportiva and sector-closure practice example. | Heavy security/admin profile, sector-closure and away-fan-control hooks. |
| France | Service-Public supporter travel bans / stadium security; LFP/FFF disciplinary routing. | Prefectural/admin intervention, away-travel bans, stand closures and ghost-match hooks. |

Source URLs are preserved in
[[raw-perplexity/raw-matchday-operating-costs-risk-settlement-2026-05-29]].

## Top-5 operating profile matrix

These are **fictional profile tendencies**, not real legal clones or final
calibration constants.

| Profile | Matchday operating feel | Strong modifiers | Game design takeaway |
|---|---|---|---|
| Germany-like | High-attendance, fan-culture-heavy, professional security; high-risk police-cost contribution possible in some jurisdictions. | Standing / atmosphere tolerance, beer revenue allowed by default profile, high-risk police contribution hook. | Good for high atmosphere and high derby downside without making every match restrictive. |
| England-like | High-control, high-stewarding, safety-certification-heavy, alcohol restricted in pitch view. | Stewarding intensity, in-ground alcohol restriction, special-police-service chargeability profile. | Best benchmark for visible compliance cost and restricted beverage upside. |
| Spain-like | Security and anti-violence framework with match-by-match enforcement variance. | Administrative/security profile, anti-violence controls, medium alcohol and away-risk modifiers. | Useful as moderate profile with fixture-specific risk swings. |
| Italy-like | Security/admin-heavy, strong ticketing/identity and away-fan-control traditions. | Higher admin overhead, high-risk away controls, frequent partial-closure sensitivity. | Good for high friction on volatile fixtures and visible prevention value. |
| France-like | Strong public-order administration and supporter-travel intervention. | Prefect/admin intervention chance, away travel ban, stand closure and ghost-match sensitivity. | Best profile for fast state/regulator intervention in high-risk fixtures. |

## Cost taxonomy

| Cost family | Main drivers | Settlement behaviour |
|---|---|---|
| Stewarding | Attendance, stand layout, safety certificate, risk tier, away allocation, event density. | Forecast before match; actual posts after fixture with small variance. |
| Private security | Risk tier, search/separation requirement, pyrotechnic history, ticketing controls. | Forecast plus mitigation choice; ignored risk can raise incident probability. |
| Policing-style contribution | Country profile, public-order rule, high-risk classification, kickoff, rivalry, away travel. | Profile band only; may be zero, shared, footprint-limited or high-risk contribution. |
| Medical / emergency | Competition level, attendance, weather, alcohol policy, crowd density, UEFA-style requirements. | Required minimum plus event add-ons for heat, injury, crush or evacuation incidents. |
| Cleaning / waste | Attendance, catering volume, alcohol/fan-zone policy, weather, sector usage. | Mostly variable per attendance and spend; increases after incidents. |
| Energy / utilities | Floodlights, winter heating, undersoil heating, cooling, water, venue systems. | Semi-fixed plus fixture add-ons; investible infrastructure can lower future cost. |
| Temporary staff / contractors | Turnstiles, catering/hospitality staff, retail staff, transport marshals, setup/teardown. | Scales with open sectors, attendance and contract model. |
| Officials / match operations | Competition tier, VAR/technical requirement, neutral/final profile. | Profile-driven cost or levy; may be borne by competition in some profiles. |
| Pitch recovery | Weather, pitch condition, fixture density, non-matchday events, turf quality. | Posts after match/event and affects future pitch risk. |
| Insurance / compliance | Venue capacity, league tier, risk history, safety certificate, inspections. | Mostly seasonal allocation; incident history can raise profile. |
| Damage reserve | Away-fan movement, pyro, clashes, vandalism risk, transport plan. | Forecast reserve adjusted after incident/no-incident settlement. |
| Sanction / closure | Regulations catalog, incident severity, repeat memory, competition rule. | Fines post to ledger; closures alter future capacity/revenue/cost. |

## Risk-tier model

Risk tier is profile data, not a hidden random roll:

| Tier | Meaning | Typical effects |
|---|---|---|
| `routine` | Normal fixture, no special public-order signal. | Baseline stewarding, security, medical, cleaning and utilities. |
| `guarded` | Attendance, kickoff, weather or away demand needs visible planning. | Slight steward/security uplift, clearer mitigation card. |
| `elevated` | Rivalry, cup stakes, incident memory or away travel pressure. | Security upgrade recommended, alcohol/away allocation review, higher damage reserve. |
| `highRisk` | High/volatile rivalry or regulator/police high-risk classification. | Strong steward/security/policing uplift, possible fan separation and travel controls. |
| `restricted` | Regulator or club mitigation limits attendance or behaviour. | Alcohol ban, away cap/ban, sector closure or special entry controls. |
| `closedDoor` | Ghost match / behind-closed-doors sanction. | Ticket and most catering income removed; required operations still post. |

Inputs:

- Rivalry System: `rivalryTier`, fan-incident score and tier transitions.
- Audience & Atmosphere: `AtmosphereSnapshot`, `FanIncidentLogged`,
  `TicketingTrustStateSnapshot` and segment volatility.
- Stadium Operations: capacity, available sectors, ingress/egress, pitch
  condition, technical systems, safety certificate and variable cost bands.
- Regulations & Compliance: `LicenceCommercialConstraint`, sanction catalog,
  alcohol/away/closure rules and effective rule set.
- League/Competition: `FixtureCommercialProfile` and
  `CompetitionRevenueProfile`.
- Matchday Event Engine: weather, pyro, medical, infrastructure and pitch
  event outcomes.
- CommercialPortfolio: ticketing policy, away allocation policy, catering
  contract model, fan-service campaigns and mitigation choices.

## `MatchdayOperatingCostProfile` draft

Owned as a CommercialPortfolio settlement input/profile, with source facts from
the surrounding bounded contexts and ledger posting by Club Management.

| Field | Meaning |
|---|---|
| `profileId` | Profile identity and version. |
| `fixtureId` | Fixture scope. |
| `venueId` | Stadium Operations venue identity. |
| `competitionId` | League/Competition profile reference. |
| `countryProfileId` | Country or abstract fallback profile. |
| `riskTier` | `routine`, `guarded`, `elevated`, `highRisk`, `restricted` or `closedDoor`. |
| `riskDrivers` | Rivalry, away support, kickoff, weather, stakes, incident memory, sanctions, venue state. |
| `attendanceBand` | Expected attendance / open-sector band used for variable costs. |
| `awayFanBand` | Away allocation, travel pressure and segregation pressure. |
| `openSectorPlan` | Which home/away/premium/family/accessibility sectors are open or closed. |
| `stewardingRule` | Stewarding baseline and risk multiplier. |
| `securityRule` | Search, segregation, private security and surveillance rule. |
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

## Settlement event vocabulary

CommercialPortfolio emits settlement events; Club Management posts finance
ledger facts via ADR-0050 ACL.

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

## Forecast and settlement lifecycle

1. **Pre-match forecast.** CommercialPortfolio combines fixture, venue,
   regulations, rivalry, audience and competition facts into a
   `MatchdayOperatingCostProfile`.
2. **Mitigation decision.** Quick may accept a recommended action; Standard
   compares trade-offs; Expert edits or inspects individual rules.
3. **Matchday event resolution.** Matchday Event Engine resolves weather,
   medical, security, infrastructure and pitch events using visible risk inputs.
4. **Post-match settlement.** CommercialPortfolio posts operating-cost
   settlement events and requests ledger entries through Club Management.
5. **Regulatory follow-up.** Regulations & Compliance may issue fines,
   restrictions or closures after a delay; those become future profile inputs.
6. **Memory update.** Rivalry and Audience & Atmosphere absorb fan incidents,
   atmosphere/trust effects and risk-tier feedback.

Fairness guardrails:

- severe outcomes need a visible pre-match risk driver or incident-memory
  explanation;
- mitigation reduces probability or severity but is not free;
- restrictions can lower risk while reducing revenue and atmosphere;
- ghost matches and sector closures preserve required operating costs instead
  of becoming pure revenue toggles;
- exact constants remain calibration data and must pass soak tests later.

## Dashboard surfaces

| Tier | Matchday operating-cost surface |
|---|---|
| Quick | Risk badge, total forecast cost band, one recommended mitigation and one sentence explaining the main driver. |
| Standard | Cost groups (staff/security, venue/facility, restrictions/sanctions), 13-week cash impact, mitigation comparison and restriction warnings. |
| Expert | Full `MatchdayOperatingCostProfile`, formulas, profile modifiers, provenance, sensitivity table, incident memory and event-by-event settlement. |

## Acceptance scenarios

```gherkin
Feature: Matchday operating costs and risk-cost settlement

  Scenario: Normal home league match settles predictable operating costs
    Given a routine home league fixture
    And no recent security incident memory
    When CommercialPortfolio forecasts matchday operating costs
    Then stewarding, security, medical, cleaning, energy, temporary staff and pitch costs are shown as a band
    And Club Management posts the settled ledger entries after the fixture

  Scenario: Derby high-risk match exposes mitigation before settlement
    Given a volatile rivalry fixture
    And high away-fan demand
    When the risk profile is created
    Then the fixture is classified as highRisk
    And Quick mode shows a security mitigation recommendation
    And Expert mode shows rivalry, away allocation, kickoff and incident-memory drivers

  Scenario: Voluntary alcohol restriction lowers risk and revenue
    Given an elevated-risk match with strong catering demand
    When the club accepts an alcohol restriction
    Then catering upside is reduced
    And security incident probability and sanction exposure are reduced
    And both effects are visible before matchday settlement

  Scenario: Away-fan restriction changes revenue, atmosphere and cost
    Given a high-risk away allocation
    When Regulations applies an away-fan restriction
    Then away ticket inventory falls
    And stewarding / policing pressure is recalculated
    And Audience & Atmosphere receives the atmosphere and trust inputs

  Scenario: Sector closure keeps fixed operating costs
    Given a prior security incident caused a sector closure
    When the next home match is forecast
    Then available capacity is reduced
    And ticket/catering revenue forecast falls
    And fixed venue, medical and required security costs remain

  Scenario: Ghost match removes attendance income but not all costs
    Given a behind-closed-doors sanction
    When matchday settlement runs
    Then ticket and most matchday retail income are zero
    And required stadium, security, medical, energy and broadcast-operation costs still post

  Scenario: Cup final uses neutral-venue operating rules
    Given a neutral final profile
    When the matchday operating-cost profile is created
    Then host, allocation, travel, security and competition rules are used
    And home-league match assumptions are not reused

  Scenario: Weather and pitch event posts recovery cost
    Given a heavy-rain match on a tired pitch
    When the Matchday Event Engine resolves a pitch-quality event
    Then PitchRecoveryCostPosted is emitted
    And future venue risk is raised until recovery is complete

  Scenario: Ignored pyro risk escalates through the sanction chain
    Given a highRisk match with recent fan-incident memory
    And the club declines available mitigation
    When a pyro incident is resolved
    Then the immediate fine is posted after disciplinary settlement
    And the next fixture receives elevated risk classification or closure constraints
```

## Open before approval

- Final money ranges per country, tier and stadium scale.
- Whether `MatchdayOperatingCostProfile` is first-playable scope or only the
  contract surface for later implementation.
- Whether Quick mode may auto-apply recommended low-cost mitigations or must
  always ask.
- How much policing/public-order cost is player-controllable versus regulator
  imposed per profile.
- Exact incident-probability and mitigation-effect formulas.
- Whether severe supporter incidents are enabled in first playable or staged
  behind difficulty / realism settings.
