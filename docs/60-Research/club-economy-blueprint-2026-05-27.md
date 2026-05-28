---
title: Club Economy Blueprint - Research Synthesis 2026-05-27
status: draft
tags: [research, economy, finance, club-management, accounting, fmx-13]
created: 2026-05-27
updated: 2026-05-27
type: research
binding: false
linear: FMX-13
sourceType: external
related:
  - [[raw-perplexity/raw-club-economy-simulation]]
  - [[incoming-design-research-2026-05-27]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/economy-system]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../30-Implementation/club-economy-accounting-ledger]]
---

# Club Economy Blueprint - Research Synthesis 2026-05-27

## Question

How should the raw club-economy report be promoted into FMX planning so that
economy becomes a first-class MVP pillar without turning raw external research
into implementation authority?

## Status

This note is a sourced synthesis for FMX-13. It sits between the lossless raw
input and the draft decision layer:

`raw report -> this synthesis -> GDDR/system notes -> ADR/contracts -> implementation`

It is **not binding**. It records Nico's current direction and the research
basis for the draft notes created in the same beat.

## Nico Direction Captured

- Economy is an **MVP pillar**, not only a post-match cash signal.
- The simulation tick is a **weekly ledger**. Monthly and seasonal reports are
  projections.
- Insolvency is a **staged crisis**: overdraft / freeze / arrears / licence
  consequences before run end.
- The target depth is **full accounting**: cash, P&L, balance-sheet-like views,
  transfer amortisation, liabilities, covenants and compliance ratios.
- Country-specific profiles cover Germany, England, France, Italy and Spain,
  with an abstract fallback.
- Calibration uses sourced ranges, ratios and formulas; final balance constants
  wait for simulation tests and Nico sign-off.
- UI remains progressive: Quick / Standard / Expert.
- Original FMX-13 note: Investor rescue was SP-only future-scope /
  monetisation review, not MVP scope. FMX-41 amends this: if activated,
  Investor is clean singleplayer cash with no debt, no owner-control effect, no
  fan penalty and no multiplayer advantage.

## External Source Check

The raw report's structure is broadly consistent with current external signals:

- UEFA's current sustainability framework makes squad cost ratio a core control
  surface and applies the permanent 70 percent ceiling from 2025/26. This
  supports a game compliance view that combines wages, transfer amortisation
  and agent/transaction costs rather than wages alone.
- UEFA's 2025 regulations explicitly include squad cost ratio and cash-flow
  statement requirements, which supports modelling liquidity separately from
  accounting profit.
- UEFA's 2026 finance landscape notes record European club revenues and rising
  investment, while also highlighting player contract and asset management.
  That supports the full-accounting choice: football finance is not only gate
  receipts and weekly wages.
- Deloitte Football Money League 2026 keeps the standard revenue taxonomy:
  matchday, broadcast and commercial. It also highlights stadium surroundings
  and non-matchday use as commercial drivers, supporting the stadium/campus
  and venue-operation links.
- Premier League handbook rules for 2025/26 define relegation payments over
  up to three seasons at 55 / 45 / 20 percent of relegated-club shares, with the
  third year removed for one-season members. That validates parachute payments
  as a country-profile rule rather than a universal mechanic.

## Promotion Targets

### Game design

Promote the report into [[../50-Game-Design/GD-0008-finance-economy]] and
[[../50-Game-Design/economy-system]] as the canonical finance/economy model:

- weekly ledger as the authoritative economic tick;
- full accounting as the Expert layer and compliance substrate;
- staged insolvency as the Roguelite failure arc;
- seasonal cashflow calendar as the teaching structure;
- country/liga profiles as data, not hard-coded logic;
- ranges/formulas instead of final balance constants.

### Feature planning

Create [[../20-Features/feature-club-economy-mvp-pillar]] so the MVP roadmap has
a feature surface beyond "cash/run-risk feedback". The first playable does not
need every accounting screen, but it does need the actual economy spine:

- starting budget and opening balance sheet;
- weekly finance tick;
- ticketing / matchday / basic sponsor / wage / travel flows;
- visible runway and crisis warnings;
- first staged insolvency recovery path.

### Architecture

Create [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
and [[../30-Implementation/club-economy-accounting-ledger]] as draft
architecture/contract anchors:

- Club Management owns ledger, budgets, sponsors, stadium economics, board
  finance pressure and insolvency state.
- Transfer, Match, League, Squad and Stadium/Fan systems interact through
  commands, queries and domain events only.
- Ledger entries are append-only facts; reports and ratios are projections.
- Full accounting is implemented as domain read models, not as cross-context SQL
  joins or UI-only arithmetic.

## Country Profile Model

The initial target coverage follows the existing regulation note:

| Profile | Scope |
|---|---|
| Germany | Deep profile, including professional tiers down to the amateur boundary. |
| England | Deep profile for pyramid / ground-grade / parachute-payment style rules. |
| France | Top-tier profile around licensing and economic stability. |
| Italy | Top-tier profile around licensing and stadium obligations. |
| Spain | Top-tier profile; abstract regional detail until deeper sources are added. |
| Abstract | Fallback for generated countries and community-pack extensions. |

Country profiles own calibration and rule variants: season timing, payment
cadence, parachute/solidarity payments, tax/levy profile, licence rules,
stadium requirements and media-right relevance by tier.

## Full Accounting Model

The game should track three layers:

| Layer | Purpose | Player-facing tier |
|---|---|---|
| Cash ledger | Whether the club can pay this week. | Quick / Standard / Expert |
| Accrual accounting | Profit/loss, amortisation, receivables/payables. | Standard / Expert |
| Compliance ratios | Squad cost, debt, runway, licence readiness. | Standard / Expert |

The key gameplay distinction is:

- **Cash crisis**: the club cannot meet near-term obligations.
- **Accounting loss**: the club is structurally unprofitable.
- **Compliance breach**: the club is solvent but violates league/board rules.

These must be separate because they create different player decisions.

## Open Decisions

- Final thresholds for each insolvency stage.
- Exact number of weeks/months before staged crisis becomes run end.
- First playable's minimum accounting UI depth.
- Whether the clean-cash Investor entitlement activates in the first playable
  or waits for platform/legal review.
- Final country-profile ranges and multipliers after balance simulations.

## Source Links

- UEFA Financial Sustainability overview:
  <https://www.uefa.com/insideuefa/protecting-the-game/financial-sustainability/>
- UEFA Club Licensing and Financial Sustainability Regulations 2025:
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2025-Online>
- UEFA European Club Finance and Investment Landscape 2026:
  <https://www.uefa.com/news-media/news/02a2-200452a66064-0cfd3f86b94f-1000--new-report-highlights-record-revenues-and-increasing-investment-into-european-football/>
- Deloitte Football Money League 2026:
  <https://www.deloitte.com/uk/en/services/financial-advisory/analysis/deloitte-football-money-league.html>
- Deloitte Annual Review of Football Finance 2025:
  <https://www.deloitte.com/global/en/Industries/tmt/research/annual-review-of-football-finance.html>
- Premier League Handbook 2025/26:
  <https://resources.premierleague.pulselive.com/premierleague/document/2025/10/22/c03ebde8-8b59-4822-9f3b-bd42ed587f92/PL_Handbook_25-26_07.10.pdf>

## Related

- Raw input: [[raw-perplexity/raw-club-economy-simulation]]
- Triage: [[incoming-design-research-2026-05-27]]
- Game design: [[../50-Game-Design/GD-0008-finance-economy]] ·
  [[../50-Game-Design/economy-system]]
- Feature: [[../20-Features/feature-club-economy-mvp-pillar]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
- Implementation planning: [[../30-Implementation/club-economy-accounting-ledger]]
