---
title: Top-5 Country Economy Calibration Profiles - Research Synthesis 2026-05-29
status: draft
tags: [research, economy, finance, country-profile, calibration, germany, england, spain, italy, france, fmx-53]
context: club-management-economy
created: 2026-05-29
updated: 2026-05-29
type: research
binding: false
linear: FMX-53
sourceType: external
related:
  - [[raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[fan-demand-price-elasticity-2026-05-28]]
  - [[season-ticket-lifecycle-and-accounting-2026-05-28]]
  - [[cup-and-competition-revenue-profiles-2026-05-28]]
  - [[regulations-and-pyramids-research]]
  - [[ip-and-licensing]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
---

# Top-5 Country Economy Calibration Profiles - Research Synthesis 2026-05-29

## Question

How should FMX model Germany, England, Spain, Italy and France as **equal-depth
economy calibration profiles** so the club-finance simulation behaves
plausibly per country — revenue mix, media cadence, matchday/season-ticket
culture, stadium ownership, commercial scale, financial-control regime,
tax/levy abstraction and relegation support — without copying real club numbers
or licensed identities? And which profile should be the first calibration
baseline after the abstract fallback?

This note is the country-economy sibling to the FMX-45
[[cup-and-competition-revenue-profiles-2026-05-28]] research, and it fills out
[[../50-Game-Design/economy-system]] §9 ("Country economy profiles") with
sourced detail. It defines the `CountryEconomyProfile` that supplies the
`countryProfileId` already referenced by `CompetitionRevenueProfile`.

## Nico defaults carried in (from FMX-13 blueprint)

- Economy is an **MVP pillar**; the tick is a weekly ledger.
- Country profiles are **data, not code branches** — payment cadence, levies,
  media style, parachute/solidarity, licence checks, tax/fee assumptions and
  calibration ranges per profile.
- Coverage is **Germany / England / Spain / Italy / France + abstract**.
- Store **ranges, ratios and formulas**; final balance constants wait for
  simulation tests and Nico sign-off.
- UI stays progressive (Quick / Standard / Expert).
- Shipped content is **IP-clean and fictional**; real numbers calibrate scale
  only (see [[ip-and-licensing]], [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).

## Summary

The research answer is a **data-driven `CountryEconomyProfile`** that the Club
Management ledger and the commercial/stadium/competition systems read as
calibration scaffolding:

1. The big-5 separate cleanly along four gameplay-relevant axes: **revenue mix**
   (matchday/broadcast/commercial split), **matchday demand & ownership**
   (attendance, utilisation, season-ticket culture, who owns the stadium),
   **commercial maturity**, and **financial-control style** (how the club is
   policed and what happens on relegation).
2. Two leagues are "matchday-maximised, club-owned" (Germany, England); Italy is
   the "municipal-stadium, low-utilisation, under-commercialised" case; Spain is
   "bimodal" (a few global giants + a long modest tail); France is "PSG-skewed"
   with strong ex-ante budget policing.
3. The financial-control regimes map directly onto the staged-insolvency and
   compliance surfaces already in [[../50-Game-Design/economy-system]]:
   England = ex-post loss limit (PSR), Germany = pre-season licensing/liquidity
   gate, Spain = hard squad-cost registration cap, France = ex-ante budget
   control (DNCG), Italy = moderate ex-ante indicators (FIGC/COVISOC).
4. Relegation support is a **country-profile rule, not a universal mechanic**:
   only England has a large multi-year parachute; the others fall off a steeper
   TV cliff cushioned only by redistribution.
5. Real-world systems become **fictional profile templates** with banded ratios,
   never copied constants or licensed names.

This gives the player a credible reason why the "same" club behaves differently
in a German vs Italian vs English economy, and gives balance testing a small set
of distinct, sourced calibration anchors.

## Source base

Real leagues are research inputs only; shipped data is fictional and banded.

| Area | Primary / authoritative sources | Confidence | FMX use |
|---|---|---|---|
| Revenue mix & league size | Deloitte Annual Review of Football Finance 2025; Deloitte Football Money League 2026 (Big-5 2023/24: €20.4bn revenue, €9.4bn broadcast, €8.0bn commercial). | High (aggregate); Medium (per-league split synthesized). | Matchday/broadcast/commercial split bands per profile. |
| Financial control & UEFA layer | UEFA Club Licensing & Financial Sustainability Regulations 2025 (70% squad-cost ratio from 2025/26); UEFA Club Finance & Investment Landscape 2026; Premier League Handbook 2025/26 (PSR £105m/3yr; parachute 55/45/20% up to 3 seasons). | High. | Domestic control regime + continental overlay + parachute style. |
| Media distribution & cadence | Daniel Geey top-5 broadcasting analysis; Tifosy big-5 broadcasting breakdown; SportBusiness/SportsPro media-rights. | Medium. | Distribution-weight model + instalment cadence per profile. |
| Matchday / season-ticket / ownership | The Esk ticketing & fan-accessibility 2025/26; Football Supporters' Association "Stop Exploiting Loyalty"; UEFA attendance benchmarking. | Medium (ranges reliable, exact decimals approximate). | Attendance/utilisation/ST-share/price bands + ownership model. |
| Commercial scale & tax/levy | Deloitte Money League; European Leagues financial-landscape report; Statista commercial revenue; KPMG/EY country tax profiles (model-cited); French sports-ministry "taxe Buffet". | Medium; tax specifics Low-Medium. | Commercial multiplier + tax-drag/levy abstraction. |
| Regulation/pyramid overlap | [[regulations-and-pyramids-research]] (already-sourced DFB/FA/LFP/FIGC/LaLiga licensing). | High (existing vault note). | Avoids duplicating the infrastructure-compliance layer. |

Full URLs + condensed transcripts: [[raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]].

> **Re-check before final calibration.** Several ticketing, stadium-ownership and
> tax figures are anchored to secondary analysis or were flagged "widely
> established" rather than a named primary. Treat the bands below as
> direction-and-magnitude, not citable constants. Italy's official Lega/figures
> and the Spain/Italy tax-regime status especially need a primary re-check (same
> caveat the FMX-45 cup note raised for Italy).

## Top-5 equal-depth comparison matrix

| Axis | Germany | England | Spain | Italy | France |
|---|---|---|---|---|---|
| Revenue tilt | Commercial-led, balanced | Broadcast+commercial, richest | Broadcast-led; commercial top-heavy | Broadcast-led; weak matchday | Broadcast-dominant |
| Matchday/Broadcast/Commercial band | 10–15 / 35–45 / 40–50 | 12–18 / 44–52 / 34–42 | 10–16 / 38–48 / 34–46 | 8–14 / 42–52 / 30–40 | 8–13 / 45–60 / 25–38 |
| Avg attendance / utilisation | ~43–45k / very high (90–98%) | ~39–41k / very high (>95%) | ~28–30k / bimodal (giants high, tail <70%) | ~29–31k / **low (60–75%)** | ~24–26k / variable |
| Season-ticket culture | Very high; terraces/safe-standing central; long waitlists | Very high; membership-gated; dearest in Europe | High at giants, medium tail; "abono" + tourist pricing | Medium, volatile; room for singles | Medium; PSG high, tail low |
| Ticket price level / ARPU | Low price, high volume | Highest in Europe | Mid-high giants, low-mid tail | Low (singles from ~€9) | Bimodal |
| Stadium ownership | Mostly club-owned/long-lease | Almost all club-owned | Giants own; tail municipal/shared | **Mostly municipal/leased**; few modern exceptions | Mixed; many post-2016 municipal |
| Commercial multiplier (vs 1.0 baseline) | 1.2–1.3 (deep) | 1.3–1.4 | 1.05–1.1 (steep top drop-off) | 0.8–0.9 (under-index) | ~0.9 (PSG 1.2–1.3) |
| Media distribution weight | ~70/23/5/2 multi-year performance | 50 equal / 25 merit / 25 facility | 50 equal / 25 sporting / 25 popularity | equal + results + tradition + market | 50 equal / 30 standing / 20 media |
| Payment cadence | Instalments | Instalments | Monthly/periodic | Instalments | Instalments |
| Financial control | DFL licensing (pre-season liquidity gate + monitoring) | PSR (£105m / 3yr ex-post loss limit) | LCPD hard squad-cost registration cap | FIGC/COVISOC ex-ante indicators (moderate) | DNCG ex-ante budget control (strictest pre-emptive) |
| Relegation support | Modest redistribution | **Large parachute** (multi-year, front-loaded) | Limited; steep cliff | Limited; steep cliff | Limited; DNCG-managed |
| Tax/levy flavour | High employer social on-cost | Std tax + NICs; clubs bear policing | Std tax; case-specific expat discount | Std tax; expat break 2019–23 then off | High employer charges + 5% media levy |
| Matchday op-cost index | 1.0–1.1 | 1.2–1.3 (policing) | 0.9–1.0 | 0.8–0.9 | 1.0–1.1 |

## Per-country profile sketches (calibration handles)

Each profile owns the same field set (see schema below); the prose is the
design intent a balance tester should feel.

- **Germany-like — "terrace-volume economy".** Yield from packed cheap stands,
  not high prices. High, stable utilisation → low matchday demand noise. Deep
  season-ticket + standing inventory (good exercise for the FMX-43 model).
  Commercial-deep even mid-table. Media weighted to multi-year performance →
  smoother income, slower swings. Licensing is a solvency gate that maps onto the
  pre-season compliance check; no parachute. Club-owned grounds → clean matchday
  capture and meaningful stadium-investment decisions.
- **England-like — "premium-priced broadcast economy".** Highest prices and
  ARPU, capacity-constrained demand, near-total ST+membership gating. Broadcast
  rich and relatively equal; large front-loaded parachute is a real revenue
  floor after relegation (the only profile where the death-spiral is cushioned).
  PSR = ex-post 3-year loss limit. Club-owned, premiumisable assets. Best profile
  to stress-test high prices, dynamic single-ticket scarcity and parachute logic.
- **Spain-like — "bimodal giant/tail economy".** Two behaviours in one profile:
  global giants (high commercial, tourist pricing, strong abono) vs a modest
  tail (broadcast-dependent, municipal/shared grounds, empty seats). Media split
  rewards popularity → amplifies big clubs. LCPD is a hard squad-cost
  registration cap: overspend blocks registration even with cash → the only
  profile where a wage decision can be *administratively* blocked, not just
  risky. Good exercise for compliance-gates-as-hard-constraints.
- **Italy-like — "municipal-stadium constrained economy".** Big heritage but low
  utilisation (60–75%) and the municipal-ownership problem: most clubs lease old
  grounds they can't redevelop, capping matchday/hospitality upside; shared
  stadiums dilute brand. Cheap singles, volatile ST. Commercial under-indexes.
  A few modern club-owned exceptions should produce visibly better economics →
  good exercise for "stadium ownership unlocks revenue" decisions. Steep
  relegation cliff.
- **France-like — "ex-ante policed economy".** Broadcast-dominant, PSG-skewed
  commercial (one outlier node, modest median). DNCG reviews budgets *before* the
  season and can restrict recruitment/payroll pre-emptively → the strongest
  ex-ante control, a distinct failure mode (you get blocked at planning time, not
  at crisis time). Two structural drags: very high employer social charges
  (costliest labour for a given net wage) and a 5% media levy haircut on
  distributable TV. Mixed/municipal ownership.
- **Abstract — "neutral generated-country economy".** The fallback for generated
  countries and community packs. Default to **median bands** across all axes
  (balanced revenue split, ~80% utilisation, medium ST share, mixed ownership,
  1.0 commercial multiplier, instalment media on an equal+merit split, a generic
  pre-season licensing gate, modest redistribution, neutral tax drag). Every
  field is overridable by a community pack with declared provenance.

## IP-clean preset template handles

Internal design handles only; player-facing country, league, club and
governing-body names stay fictional and generated (ADR-0007). Reuse the existing
fictional confederations where a continental tie-in is needed
(IFC / EFC / AFU / APFC / AFA, per [[late-game-systems]]).

| Template | Fictional design handle | Core mechanics |
|---|---|---|
| Bundesliga-like | `terrace-volume-economy` | Low price / high utilisation, deep standing+ST inventory, performance-weighted media, licensing solvency gate, no parachute, club-owned capture. |
| Premier-League-like | `premium-broadcast-economy` | Highest prices/ARPU, membership-gated scarcity, rich+equal broadcast, large front-loaded parachute, ex-post loss limit, premiumisable owned grounds. |
| LaLiga-like | `bimodal-giant-tail-economy` | Popularity-weighted media, giant/tail split, hard squad-cost registration cap, tourist dynamic pricing at the top. |
| Serie-A-like | `municipal-constrained-economy` | Low utilisation, lease-locked stadium ceiling, cheap volatile singles, commercial under-index, modern-ground exception bonus. |
| Ligue-1-like | `ex-ante-policed-economy` | Broadcast-dominant, single commercial outlier, pre-emptive budget control, high payroll on-cost, media-levy haircut. |
| Generated / pack | `neutral-baseline-economy` | Median bands on every axis; fully community-overridable with provenance. |

## `CountryEconomyProfile` draft

Owned by country/profile data; read by Club Management (ledger), CommercialPortfolio,
Stadium Operations, Audience & Atmosphere and the competition layer. Sibling to
`CompetitionRevenueProfile`; supplies the `countryProfileId` it references.

| Field | Meaning |
|---|---|
| `countryProfileId` | Fictional profile identity (matches `CompetitionRevenueProfile.countryProfileId`). |
| `revenueMixBand` | Matchday / broadcast / commercial share bands, plus big-club vs tail dispersion multiple. |
| `mediaDistributionModel` | Central pool weights (equal / merit / facility / popularity / multi-year performance) and selling model. |
| `mediaPaymentCadence` | Instalment schedule + withholding assumptions (default: instalment, not lump sum). |
| `attendanceProfile` | Average attendance band + utilisation band + bimodality flag. |
| `seasonTicketCulture` | ST share-of-capacity band, standing/safe-standing relevance, waitlist pressure, renewal stickiness. |
| `ticketPriceLevel` | Single-ticket price index + ARPU band (ticket + F&B + merch). |
| `stadiumOwnershipModel` | club-owned / long-lease / municipal-shared / mixed, plus redevelopment-freedom flag and ancillary-capture share. |
| `commercialMultiplier` | Sponsorship/merch/commercial scale vs 1.0 baseline + drop-off curve outside top clubs + single-outlier flag. |
| `financialControlRegime` | exPostLossLimit / preSeasonLicensingGate / squadCostRegistrationCap / exAnteBudgetControl + thresholds and sanction style. |
| `continentalOverlay` | UEFA-style squad-cost-ratio overlay applied when in continental competition (separate from domestic regime). |
| `relegationSupportRule` | parachute (schedule + front-loading) vs redistribution-only vs none; revenue-cliff steepness. |
| `solidarityRule` | Lower-tier / amateur redistribution style (links to cup `solidarityRule`). |
| `taxLevyProfile` | Corporate-tax drag band, employer payroll on-cost band, expat-discount flag (time-boxed), media-levy haircut. |
| `matchdayOperatingCostIndex` | Stewarding/security/policing cost index vs baseline + clubBearsPolicing flag + high-risk volatility. |
| `paymentCadenceCalendar` | Season timing for recurring obligations and central receipts (feeds the weekly tick). |
| `communityOverridePolicy` | Which fields packs may override and the provenance required. |
| `ipCleanSourceProfile` | Research template family used as inspiration, not a licensed clone. |
| `provenance` | Source note, version, effective season and confidence band. |

## Gameplay-affecting differences (explicit)

These are the differences that must actually change player decisions, not just
flavour text:

1. **Where money comes from.** Germany/England reward filling and owning the
   stadium; France/Italy clubs lean on broadcast and feel matchday upside less.
2. **Price vs volume.** England-like rewards premium pricing & scarcity;
   Germany-like rewards low price + high volume + ST depth. Same demand model,
   opposite optimal policy.
3. **Stadium ownership as a lever.** Italy-like clubs are revenue-capped until
   they escape a municipal lease — a real investment decision the others mostly
   don't face.
4. **How you fail compliance.** Spain-like can *block* a signing (registration
   cap); France-like can *pre-empt* your budget (DNCG); England-like punishes
   *after* the fact (PSR loss limit); Germany-like gates the *licence* pre-season.
   Four distinct failure timings feeding the same staged-insolvency arc.
5. **Relegation shock.** England-like has a parachute floor (recoverable);
   the others fall off a steeper cliff (closer to the roguelite death spiral).
6. **Tax/levy drag.** France-like = costliest payroll + media-levy haircut;
   time-boxed expat discounts (Italy 2019–23, Spain case-specific) can flip
   net-wage competitiveness for foreign signings within a save's timeline.
7. **Commercial ceiling.** Bundesliga/PL-like commercial is deep across the
   table; Serie-A-like under-indexes; Ligue-1-like has one outlier and a weak
   median.

## Draft calibration ranges (NOT final constants)

All values are calibration **inputs** to tune in long-save balance tests, then
sign off with Nico. They are banded ratios/indices, never copied club numbers.

| Profile | MD/BC/COM split | Utilisation band | ST share band | Price index (PL=1.0) | Commercial mult | Op-cost index | Parachute |
|---|---|---|---|---|---|---|---|
| `terrace-volume` (DE) | 12 / 40 / 48 | 0.90–0.98 | 0.60–0.70 | 0.35–0.50 | 1.2–1.3 | 1.0–1.1 | none / redistribution |
| `premium-broadcast` (EN) | 15 / 48 / 37 | 0.92–0.99 | 0.60–0.80 | 1.0 | 1.3–1.4 | 1.2–1.3 | large, front-loaded |
| `bimodal-giant-tail` (ES) | 13 / 43 / 40 | 0.55–0.90 (bimodal) | 0.40–0.65 | 0.45–0.95 | 1.05–1.1 (steep drop) | 0.9–1.0 | limited |
| `municipal-constrained` (IT) | 11 / 47 / 35 | 0.60–0.75 | 0.30–0.55 | 0.35–0.60 | 0.8–0.9 | 0.8–0.9 | limited |
| `ex-ante-policed` (FR) | 10 / 52 / 31 | 0.70–0.90 (variable) | 0.30–0.60 | 0.40–0.80 | 0.9 (PSG 1.2–1.3) | 1.0–1.1 | limited |
| `neutral-baseline` (abstract) | 13 / 45 / 42 | ~0.80 | ~0.50 | ~0.6 | 1.0 | 1.0 | modest redistribution |

(MD/BC/COM are mid-points of the matrix bands, summing ~100; tune as ranges.)

## First calibration baseline recommendation

**Recommendation: calibrate `neutral-baseline` first, then `terrace-volume`
(Germany-like) as the first *country* baseline.** Rationale:

- The abstract profile must be solid first because every generated country and
  community pack falls back to it.
- Germany-like is the cleanest *real-shaped* anchor to validate the spine:
  highest and most stable utilisation (least demand-elasticity noise to fight
  while the ledger is still being tuned), club-owned stadiums (clean matchday
  capture with no municipal-lease special-casing), the deepest season-ticket +
  standing inventory (exercises the FMX-43 model thoroughly), instalment media on
  a smooth multi-year-performance weighting, and a pre-season licensing gate that
  maps directly onto the existing compliance check — with no parachute to
  complicate the relegation arc.
- Then **England-like** second, to stress-test the harder cases the spine must
  also handle: premium pricing + single-ticket scarcity, an ex-post loss limit,
  and parachute-cushioned relegation.
- Italy-like (municipal ownership) and Spain-like (hard registration cap) are the
  most distinctive mechanics and best added once the baseline is stable, since
  each introduces a new constraint type rather than just different numbers.

This is a proposed ordering — final baseline choice is Nico's (see open decisions).

## UI tiers (consistent with economy-system)

- **Quick:** profile shows as a named "league economy style" badge + the one or
  two levers that matter here (e.g. "cheap tickets, sell volume" vs "premium
  pricing"). No raw bands.
- **Standard:** revenue-mix donut, attendance/utilisation, ST share, control-regime
  status and relegation-support summary.
- **Expert:** full `CountryEconomyProfile` field view with bands, media-split
  weights, tax/levy drag, op-cost index and provenance/confidence.

## Open decisions (Nico)

- **First baseline order:** confirm `neutral-baseline` → Germany-like → England-like,
  or prefer England-like first (richest data, but more elasticity/parachute
  complexity up front).
- **Profile granularity:** one profile per country at MVP, or split bimodal
  leagues (Spain, France) into "giant" vs "tail" sub-profiles from the start?
- **Continental overlay timing:** model the UEFA-style 70% squad-cost overlay in
  first playable, or represent it as profile data only until continental cups are
  in scope?
- **Tax/levy depth:** abstract tax as a single "net-wage cost + profit drag"
  knob, or model the time-boxed expat regimes (Italy 2019–23, Spain) and the
  French 5% media levy explicitly because they create dated, save-spanning
  decisions?
- **Parachute as the only relegation cushion:** confirm England-like is the only
  profile with a material parachute, others redistribution-only.
- **Primary-source re-check:** approve a follow-up to replace the lower-confidence
  ticketing/ownership/tax figures with named primary sources before any band
  becomes a final constant (esp. Italy and the Spain/Italy tax-regime status).
- **Whether this note feeds a `draft` ADR** or stays research backing
  [[../50-Game-Design/economy-system]] §9 until the country-profile schema is
  ratified alongside ADR-0050.

## Acceptance scenarios

```gherkin
Feature: Country economy calibration profiles

  Scenario: Same club, two profiles, opposite optimal pricing
    Given a club under a terrace-volume profile
    And the same club under a premium-broadcast profile
    When the player optimises matchday revenue
    Then the terrace-volume optimum favours low price and high volume
    And the premium-broadcast optimum favours high price and scarcity

  Scenario: Municipal ownership caps matchday upside until escaped
    Given a club under a municipal-constrained profile in a leased ground
    When the player tries to expand hospitality and capacity
    Then redevelopment freedom is limited by the ownership model
    And building or acquiring a club-owned ground unlocks higher capture

  Scenario: Financial-control regime changes the failure timing
    Given a squad-cost-registration-cap profile
    When the player overspends the wage cap with cash available
    Then a new registration is blocked administratively
    And the same overspend under an ex-post-loss-limit profile is allowed but accrues breach risk

  Scenario: Relegation support is a profile rule
    Given a club is relegated under a large-parachute profile
    Then a multi-year front-loaded revenue floor is posted
    And the same relegation under a redistribution-only profile posts a steeper cliff

  Scenario: Abstract fallback is used for a generated country
    Given a generated country with no specific profile
    Then the neutral-baseline median bands apply
    And a community pack may override declared fields with provenance
```

## Related

- Raw research: [[raw-perplexity/raw-top5-country-economy-profiles-2026-05-29]]
- Prior economy research: [[club-economy-blueprint-2026-05-27]] ·
  [[club-economy-impact-map-and-commercial-contracts-2026-05-28]] ·
  [[fan-demand-price-elasticity-2026-05-28]] ·
  [[season-ticket-lifecycle-and-accounting-2026-05-28]] ·
  [[cup-and-competition-revenue-profiles-2026-05-28]]
- Regulation overlap: [[regulations-and-pyramids-research]] ·
  [[../50-Game-Design/regulations-and-compliance]]
- Game design: [[../50-Game-Design/GD-0008-finance-economy]] ·
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]] ·
  [[../50-Game-Design/economy-system]]
- Feature: [[../20-Features/feature-club-economy-mvp-pillar]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] ·
  [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]] ·
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
- IP guardrails: [[ip-and-licensing]] ·
  [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
