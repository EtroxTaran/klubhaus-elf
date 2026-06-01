---
title: Regulations and Compliance - Promotion-Gated Stadium and Operations Rules
status: draft
tags: [game-design, regulations, compliance, leagues, promotion, economy, cup, competition, matchday, security, sanctions, fmx-41, fmx-45, fmx-46]
created: 2026-05-16
updated: 2026-05-29
type: game-design
binding: false
related: [[README]], [[../60-Research/regulations-and-pyramids-research]], [[../60-Research/late-game-systems]], [[../60-Research/club-economy-blueprint-2026-05-27]], [[../60-Research/club-economy-impact-map-and-commercial-contracts-2026-05-28]], [[../60-Research/cup-and-competition-revenue-profiles-2026-05-28]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[stadium-and-campus]], [[matchday-event-engine]], [[economy-system]], [[GD-0022-economy-commercial-impact-and-contracts]], [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]], [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]], [[../30-Implementation/club-economy-commercial-contracts]]
---

# Regulations and Compliance - Promotion-Gated Stadium and Operations Rules

Promotion must mean **infrastructure + operations obligations**, not just
better opponents and TV money. The compliance gameplay loop turns sporting
success into investment pressure.

FMX-13 adds a finance-compliance layer: country profiles also define payment
cadence, parachute/solidarity patterns, financial licence checks and squad-cost
style ratios. Infrastructure compliance and finance compliance are evaluated
separately but surface in one licence readiness view.

## 1. Product rule

> **Each (country, tier, competition) tuple has a set of compliance rules.
> A club must meet the rules of its destination tier when promoted, or face
> consequences (special permit, alternate stadium, ground-share, refuse
> promotion).**

## 2. Three rule layers

| Layer | Rule type | Example |
|---|---|---|
| Federation / League | Hard admission rules | Floodlight standard, security concept, stadium admission |
| Country | Soft match culture | Alcohol policy, fan travel patterns, stadium culture |
| Competition | Special rules | Squad registration, security tiers, international requirements |

Implemented as: `LeagueRegulationService` returns merged rule set for
(country, tier, competition).

## 3. Country coverage at MVP

| Country | Coverage | Source |
|---|---|---|
| Germany | Bundesliga → Verbandsliga | [[../60-Research/regulations-and-pyramids-research]] §3 |
| England | Premier League → Step 7 | [[../60-Research/regulations-and-pyramids-research]] §4 |
| France | Ligue 1 + 2 | [[../60-Research/regulations-and-pyramids-research]] §5 |
| Italy | Serie A + B | [[../60-Research/regulations-and-pyramids-research]] §6 |
| Spain | LaLiga 1 + 2 | [[../60-Research/regulations-and-pyramids-research]] §7 |
| Other | Abstract licence profile | League + licence profile only |

Community packs ([[community-editor-and-datasets]]) can extend.

## 4. Compliance categories

A compliance rule belongs to a category. Each category has a graded
threshold per tier.

| Category | Examples |
|---|---|
| **Capacity** | Minimum / specific stand categories |
| **Floodlight** | lux / colour temperature / coverage |
| **Sanitary** | toilets per spectator, accessibility |
| **Press / media** | media seats, press conference room |
| **Security** | safety officer, security concept, separation zones |
| **Hospitality** | premium seats, suites, food service |
| **Medical** | paramedics, ambulance, first-aid stations |
| **Pitch + infra** | drainage, turf, irrigation, undersoil heating |
| **Connectivity** | WiFi, app infrastructure, broadcasting cables |
| **Squad** | home-grown minimum, work-permit, age-band quotas |
| **Finance** | squad cost, debt, cash runway, arrears, reporting readiness |

## 5. Promotion compliance check

```mermaid
flowchart TD
    Promo["Promoted on the pitch"] --> Check["LeagueRegulationService.check(club, target_tier)"]
    Check --> Compliant{"Compliant?"}
    Compliant -- Yes --> Confirm["Promotion confirmed"]
    Compliant -- No --> Options["Options menu"]
    Options --> Crash["Crash-build (expensive, fast)"]
    Options --> Permit["Special permit (penalty, conditional)"]
    Options --> Share["Ground-share with another club"]
    Options --> Refuse["Refuse promotion (roguelite only)"]
```

## 6. Per-option details

### 6.1 Crash-build

- Cost: 1.5-2.5× normal build cost.
- Time: half the normal time.
- Risk: temporary capacity drop (existing stand torn down).
- Side effect: Fan zone disrupted for the season.

### 6.2 Special permit

- Granted for 1 season.
- Penalty: 10-30 % revenue cut from gate / hospitality.
- Conditions: must meet at end of season or face relegation.

### 6.3 Ground-share

- Rent another club's stadium (in-game-fictional rental market).
- Lower revenue (split with host).
- Atmosphere -10 % to -30 % from "not home".

### 6.4 Refuse promotion (Create-a-Club Roguelite mode only)

- Run gets a "compliance failure" badge.
- May trigger DNA `tradition ↓` (refusing is unusual).
- League stays at current tier.

## 7. Squad registration rules

Per competition:

- Total squad size cap.
- Home-grown minimum.
- Foreign player cap (per relevant FA rules - abstracted).
- Work-permit checks (abstract: each non-home foreign player has a
  "permit score" derived from career caps).
- U-21 minimum (continental cups).

## 8. Operations rules

- Safety officer required (Germany 3. Liga +, England FA Ground Grading
  Grade A-B).
- Security concept (written plan) required at higher tiers.
- Anti-discrimination procedures (mandated at all tiers; tighter at top
  tiers).
- Alcohol policy: per country (e.g. Bundesliga allows; some other leagues
  restrict at risk matches).
- Matchday risk-tier rules: routine, guarded, elevated, high-risk, restricted
  and closed-door profiles determine required staffing, separation,
  public-order controls and commercial constraints.
- Away-supporter rules: allocation caps, fan separation, travel bans,
  escorted travel and away-sector closures are profile/rule outputs, not
  hidden matchday modifiers.

## 9. Compliance failure mid-season

If a club drops *below* current tier requirements mid-season (e.g.
stand-roof collapse, safety officer resignation):

- Warning + grace period (typically 6-12 weeks).
- If unresolved, partial sanctions: alcohol ban, sector closure, fine.
- If still unresolved at season end: forced relegation.

## 10. Competition revenue and commercial constraints

FMX-41 adds two finance-facing outputs:

- `CompetitionRevenueProfile`: prize schedule, gate-sharing rule,
  ticket-allocation rule, media/facility payment cadence, solidarity/parachute
  support, settlement delay, travel obligation, neutral-venue rule,
  replay/two-leg rule, security rule and forecast policy per competition
  profile.
- `LicenceCommercialConstraint`: rules that constrain matchday commerce, such
  as alcohol bans, sector closures, ghost matches, away-fan restrictions,
  hospitality requirements, safety staffing and financial-ratio checks.

Regulations & Compliance owns the rule catalog. Club Management owns the
commercial settlement and ledger posting caused by those rules.

FMX-45 clarifies the split: Regulations and League/Competition data define
which cup profile applies; Club Management converts it into cash, receivable,
cost and forecast-shock settlement events. Fixture congestion can be exposed as
a profile hook, but fatigue and injury consequences stay with the sporting
systems.

FMX-46 adds `MatchdayOperatingCostProfile` inputs. Regulations & Compliance
owns the rules that can force or constrain operating settlement: alcohol bans,
away-fan caps or bans, safety-staffing minimums, public-order classification,
sector closures, ghost matches, fine ladders and risk-tier reclassification.
CommercialPortfolio turns those constraints into per-fixture settlement events;
Club Management posts the resulting finance ledger entries. Regulations never
writes ledger rows directly.

## 11. UI tiers

| Tier | Compliance surface |
|---|---|
| Quick | "Promotion ready: yes / no" badge + 1-3 actionable cards |
| Standard | Compliance dashboard with per-category status |
| Expert | Full rule-set view, per-rule current state, planned-action timeline |

## 12. Community editor hooks

Community packs ([[community-editor-and-datasets]]) can override:

- Tier definitions per country.
- Per-tier compliance thresholds.
- Sanction parameters.

Manifest must declare which countries it modifies, to allow safe layering.

## 13. Future-scope notes (classified future-scope)

- "Special permit" odds: should the board decide or is it always
  available? Always available but with cost - the league regulator is the
  fictional decider.
- Should women's leagues have their own rule set? Yes - additive overlay
  on top of country rules. See R2-13 in
  [[../95-Archive/gap-reports/research-wave-2-gaps]].
- Continental cups compliance is separate per UEFA-analogue body -
  modelled as a competition-layer rule set. Full continental cup
  design locked in [[../60-Research/late-game-systems]] (gap D6,
  2026-05-17): 3 tiers per continent (Champions Cup / Continental
  League / Challenge Trophy) + global IFC Club World Masters; IP-
  safe naming via fictional governing bodies (IFC / EFC / AFU /
  APFC / AFA); FFP-style penalties for Petrol-State + Murky owner
  archetypes.
