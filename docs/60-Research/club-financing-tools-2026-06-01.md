---
title: Club Financing Tools Separate from Investor - Research Synthesis 2026-06-01
status: draft
tags: [research, economy, finance, accounting, debt, compliance, investor, club-management, fmx-49]
context: club-management-economy
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-49
sourceType: external
related:
  - [[raw-perplexity/raw-club-financing-tools-2026-06-01]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[top5-country-economy-profiles-2026-05-29]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[../50-Game-Design/regulations-and-compliance]]
  - [[../20-Features/feature-club-economy-mvp-pillar]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../30-Implementation/club-economy-accounting-ledger]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
---

# Club Financing Tools Separate from Investor - Research Synthesis 2026-06-01

## Question

FMX-13 gave the club economy debt, overdraft and insolvency states. FMX-41 and
FMX-50 made the real-money Investor a clean singleplayer entitlement, not debt
or owner control. FMX-49 asks: which **in-world club financing tools** should
exist, who owns them, how do they hit the ledger and compliance model, and how
do they stay separate from Investor?

Nico's decisions for FMX-49:

- **Boundary:** Club Management owns financing facilities/actions, ledger
  effects, board pressure and insolvency state; CommercialPortfolio, Transfer,
  League/Competition and Regulations provide facts.
- **First-playable depth:** active core set is overdraft/credit line, bank loan,
  sponsor advance, receivables factoring, restructuring/payment holiday and
  emergency sale mandate. Media advances, wage deferrals and supplier arrears
  are hooks or crisis consequences.
- **Board support:** fictional non-IAP board support has two in-world variants:
  equity-like rescue grant and shareholder loan. Real-money Investor remains
  SP-only clean entitlement cash with no debt/control semantics.
- **Advances:** hybrid contract fact model. CommercialPortfolio owns contract
  amendment, cash-vs-revenue schedule, contract liability and fair-value facts;
  Club Management owns the liquidity action, readiness decision and
  ledger/insolvency effect.
- **Regulatory depth:** Top-5 exact-ish profiles, IP-clean and source-calibrated.
- **Accounting depth:** playable IFRS-lite, not audit-grade IFRS calculations.

## Summary

FMX should model financing as a **Club Management financing facility layer** over
the existing weekly ledger:

1. A club can be profitable and still hit a cash crisis. FMX-49 therefore adds
   a rolling `CashflowRunwayForecast` as the trigger surface beneath
   `healthy -> watch -> overdraft -> freeze -> arrears -> licence_review`.
2. Financing tools are obligations and liquidity actions, not commercial
   contract ownership. Club Management owns `FinancingFacility`; external
   contexts supply eligibility facts.
3. Sponsor/media advances are not free revenue. They pull forward future
   contract cash while CommercialPortfolio still tracks the contract liability
   and recognition schedule.
4. Factoring needs one playable accounting distinction: `trueSale` removes the
   receivable at a discount; `securedBorrowing` keeps the receivable and adds a
   factoring liability.
5. Board support is an in-world finance event. Equity-like rescue grants improve
   liquidity/equity with no repayment; shareholder loans improve liquidity but
   increase related-party debt.
6. Investor stays outside this model. It is a payment/entitlement event with
   clean SP cash and no owner, debt, fan, sponsor, board or compliance meaning.
7. Top-5 regulatory profiles should feel different: England punishes formal
   insolvency hard, Germany stresses pre-season licence readiness, France uses
   DNCG-style wage/transfer controls, Italy stresses licensing documentation and
   future financial information, Spain gates registrations through squad-cost
   capacity.

## Source base

| Area | Primary sources used | FMX use |
|---|---|---|
| Football financing instruments | Trade Finance Global football finance, LawInSport financing guide, club-finance practice sources | Tool families, risk profiles, secured receivables, owner support |
| Accounting logic | ACCA football finance, IFRS 9, IFRS 15 / IAS 38 transfer-payment material, ICAEW football accounting, FRS 102 football guidance | IFRS-lite cash/accrual, contract liability, current/non-current, factoring and restructuring semantics |
| UEFA overlay | UEFA Club Licensing and Financial Sustainability Regulations 2026 | No-overdue payables, football earnings, acceptable deviation, fair value and 70% squad-cost anchor |
| England | EFL Regulations 2025/26, Premier League Handbook 2025/26 | Insolvency deduction profile, P&S/PSR-style financial control |
| Germany | DFL licensing criteria pages | Pre-season economic capability, conditions/requirements licence profile |
| France | LFP/DNCG decision notices and LFP regulations | Wage-bill controls, transfer-fee controls, recruitment bans, relegation/conservative relegation |
| Italy | FIGC Italian Club Licensing Manual 2023 | Audited/interim accounts, no overdue payables, net equity, future financial information |
| Spain | LaLiga official squad cost limit page | LCPD-style registration/squad-cost gate |

Confidence: **high** on boundary ownership, core tool families, Investor
separation, UEFA/England/Spain/DNCG concept anchors and accounting-lite
semantics; **medium** on exact Germany/Italy/France calibration detail until a
later primary-source pass extracts the newest full rulebooks; **low** on any
numeric balance values, which remain soak-test inputs only.

## Boundary decision

FMX-49 keeps financing inside **Club Management**, because the behaviour is
about liquidity, obligations, board risk appetite, insolvency and ledger posting.

Three options were evaluated with Nico:

| Option | Fit |
|---|---|
| Club Management financing layer | **Chosen.** Matches ADR-0050 ledger ownership and keeps insolvency, budget envelope and board-pressure decisions in one place. |
| Split by source | Rejected for first playable. Sponsor/media advances are commercially sourced, but the liquidity action and solvency effect would become split-brain. |
| New Treasury BC | Rejected for now. Useful only if later FMX adds deep capital markets, multi-club group finance or treasury-team simulation. |

External contexts still own their facts:

| Source | Facts consumed by Club Management |
|---|---|
| CommercialPortfolio | contract cash schedule, recognition schedule, contract liability, receivable schedule, fair-value assessment, sponsor/media advance eligibility |
| Transfer | transfer receivables/payables, contingent clauses, emergency sale candidate valuations and sporting-market consequences |
| League/Competition | media/prize/solidarity payment cadence, competition revenue profile and settlement delays |
| Regulations & Compliance | Top-5 regulatory profile, no-overdue-payables checks, squad-cost and licence results, sanctions and embargoes |
| Stadium Operations | facility/stadium financing facts, lease/owned/municipal/ground-share facts and capital-project timing |
| Audience & Atmosphere | fan, sponsor and board-perception inputs where crisis actions harm trust |

## Financing facility model

`FinancingFacility` is a Club Management object, not a CommercialPortfolio
contract and not a payment entitlement.

Minimum common fields:

| Field | Meaning |
|---|---|
| `facilityId` | UUIDv7 identity. |
| `facilityKind` | `overdraft`, `creditLine`, `bankLoan`, `facilityLoan`, `stadiumLoan`, `sponsorAdvance`, `mediaAdvance`, `receivablesFactoring`, `shareholderLoan`, `equityGrant`, `restructuredDebt`. |
| `status` | `offered`, `active`, `drawn`, `atRisk`, `breached`, `restructured`, `closed` or `defaulted`. |
| `counterpartyKind` | bank, sponsor, league, owner, board, factor, facility lender or generated other. |
| `approvedLimitMinor` | Maximum draw or facility size where applicable. |
| `outstandingPrincipalMinor` | Principal or liability balance. |
| `interestBandBps` | Simple game-rate band; full effective-interest math is out of first playable. |
| `feeMinor` | Upfront, commitment, arrangement or factoring fee. |
| `maturityWeekId` | Contractual maturity / review week. |
| `repaymentSchedule` | Principal and interest due weeks. |
| `securedAgainst` | none, sponsor receivable, media receivable, transfer receivable, stadium/facility, owner guarantee or mixed. |
| `recoursePolicy` | none, partial, full or profile-specific. Used by factoring. |
| `covenantProfile` | none, light, standard or strict. |
| `classification` | current, nonCurrent, mixed or callableAfterBreach. |
| `regulatoryTreatment` | profile-derived treatment for debt, equity, acceptable deviation, squad-cost and licensing. |
| `provenance` | Source facts, rule profile and decision path used. |

First-playable active tools:

| Tool | Player use | Ledger/accounting effect | Main risk |
|---|---|---|---|
| Overdraft / credit line | Survive a short cash dip without opening a full crisis. | Draw cash, current debt, weekly interest, limit utilisation. | Limit cut, higher rate, freeze if exhausted. |
| Bank / facility loan | Fund planned deficit, promotion push or refinancing. | Cash draw, debt principal, repayment schedule, interest expense. | Covenant breach, callable/current reclassification, budget restrictions. |
| Sponsor advance | Pull forward sponsor cash from an existing contract. | Cash now; CommercialPortfolio keeps contract liability/deferred revenue and future cash reduction facts. | Future income already consumed, sponsor/fair-value scrutiny, renewal pressure. |
| Receivables factoring | Turn transfer/sponsor/media receivable into cash. | `trueSale`: remove receivable and book discount; `securedBorrowing`: keep receivable and add factoring liability. | Lower future cash, recourse/default risk, distress perception. |
| Restructuring / payment holiday | Recover after covenant or liquidity breach. | Revised schedule, new interest/fee, status changes, covenant reset. | Higher total cost, licence-review flag, stricter board/league control. |
| Emergency sale mandate | Force liquidity through transfer-market disposals. | Target proceeds/readiness policy; actual sale remains a Transfer event. | Fire-sale discount, squad quality hit, fan/board trust loss. |

Hooks / crisis consequences:

- `mediaAdvance` uses the same hybrid contract-fact pattern as sponsor advance,
  but stays profile-gated until competition payment cadences are stable.
- `wageDeferral` and `supplierArrears` are not normal manager financing buttons.
  They appear when liquidity failure creates modified liabilities or overdue
  payables.
- `stadiumLoan` is active only when the stadium/campus project loop needs it;
  until then it is a facility-loan subtype.
- `OwnerFundingGuarantee` is a future hook for licensing forecasts and bank
  covenants; not first-playable cash unless converted into grant or loan.

## Cashflow runway and insolvency

FMX-49 adds `CashflowRunwayForecast` as the explainable bridge between weekly
ledger and crisis state:

| Field | Meaning |
|---|---|
| `forecastHorizonWeeks` | Default Standard view is 13 weeks; licence/going-concern views can use 12 months. |
| `minimumCashMinor` | Lowest projected cash balance. |
| `availableFacilitiesMinor` | Undrawn credit available inside currently valid facilities. |
| `scheduledInflows` | Commercial, media, prize, transfer and financing cash by week. |
| `scheduledOutflows` | Wages, transfer instalments, debt service, stadium costs, tax/social, suppliers and levies by week. |
| `runwayWeeks` | Weeks until cash plus committed facilities cannot cover due obligations. |
| `fundingGapMinor` | Gap before the next licence/checkpoint date. |
| `recommendedActions` | Eligible facilities, sale mandate, budget freeze or restructuring prompts. |
| `confidenceBand` | High/medium/low based on receivable certainty and fixture/cup dependence. |

Refined states:

| State | Trigger style | Recovery tools |
|---|---|---|
| `healthy` | runway and ratios within profile thresholds | normal financing only |
| `watch` | forecast breach before obligations are missed | credit line, sponsor advance, factoring, budget tightening |
| `overdraft` | cash below zero but facility available | interest accrues, credit review, board warning |
| `freeze` | facility exhausted or board/regulator acts | discretionary spend freeze, emergency sale mandate, no new optional debt without approval |
| `arrears` | due obligation missed | overdue-payables ageing, supplier/player/tax/transfer category flags |
| `licence_review` | repeated arrears, covenant breach or licence-check failure | restructuring, owner support, sanction package |
| `recovery` | accepted workout plan | monitored ratios, transfer/wage controls, repayment plan |
| `run_end` | licence lost, control loss or unrecoverable insolvency | run collapse or future phoenix hook |

## Overdue payables and Top-5 profiles

FMX-49 adds `OverduePayablesAging` because UEFA-style and domestic checks care
about who is unpaid and how long.

Minimum categories:

- `footballClubTransferPayables`
- `employeePayables`
- `taxSocialPayables`
- `supplierPayables`
- `uefaLicensorPayables`

Age buckets:

- current / not overdue;
- 1-30 days;
- 31-60 days;
- 61-90 days;
- more than 90 days;
- deferred by agreement;
- disputed with non-frivolous dispute marker.

Top-5 exact-ish profile direction:

| Profile | First-playable feel |
|---|---|
| England-like | Formal insolvency is a major sporting sanction; P&S/PSR-style rolling loss review, HMRC/reporting pressure and central-payment assignment hooks. |
| Germany-like | Pre-season economic capability is the central pressure; licence can come with conditions/requirements; liquidity planning matters early. |
| France-like | DNCG-style intervention can cap wage bill and transfer fees, ban recruitment or impose relegation/conservative relegation. |
| Italy-like | Licensing documentation, audited/interim accounts, net equity, no-overdue-payables and future financial information drive eligibility. |
| Spain-like | LCPD-style squad-cost capacity gates registration; debt service and budget stability constrain signings before crisis. |
| UEFA overlay | No-overdue-payables, fair-value adjustment, football earnings, equity-covered acceptable deviation and squad-cost ratio. |

All profile names in shipped content remain fictional/IP-clean; real rules only
calibrate source behaviour.

## Investor separation

Investor is not a financing tool.

| In-world financing | Investor entitlement |
|---|---|
| Owned by Club Management or sourced from domain facts. | Owned by payment/entitlement boundary and consumed for a clean ledger grant. |
| Creates debt, equity, contract liability, future cash loss, covenant or board restrictions depending on tool. | Creates no debt, owner control, fan effect, sponsor effect, board-policy effect, compliance ratio change or multiplayer effect. |
| Can trigger insolvency, licence, restructuring or emergency-sale effects. | Buys liquidity only; negative weekly operating economics remain unchanged. |
| Available through game simulation. | Real-money, SP-only, platform/legal-gated. |

Board support is in-world only:

- `EquityRescueGrant`: fictional board/owner capital support; no repayment,
  improves cash and equity; may carry board restrictions or profile limits.
- `ShareholderLoan`: related-party debt; improves cash but adds liability,
  interest/maturity and regulatory treatment.

## Public contracts

Club Management commands:

- `RequestFinancingOption`
- `OpenFinancingFacility`
- `DrawFinancingFacility`
- `ScheduleFinancingRepayment`
- `AcceptSponsorAdvance`
- `FactorReceivable`
- `RequestDebtRestructuring`
- `GrantPaymentHoliday`
- `AcceptOwnerSupport`
- `IssueEmergencySaleMandate`
- `RecordOverduePayable`
- `AdvanceFinancialHealthState`

Club Management events:

- `FinancingFacilityOpened`
- `FinancingDrawdownPosted`
- `FinancingInterestAccrued`
- `FinancingRepaymentScheduled`
- `FinancingRepaymentPosted`
- `FinancingCovenantBreached`
- `SponsorAdvanceAccepted`
- `MediaAdvanceAccepted`
- `ReceivableFactored`
- `DebtRestructuringAgreed`
- `PaymentHolidayGranted`
- `OwnerSupportGranted`
- `EmergencySaleMandateIssued`
- `OverduePayableAged`
- `FinancialHealthStateChanged`

Consumed facts:

- `CommercialAdvanceEligibilityPublished`
- `CommercialReceivableSchedulePublished`
- `CommercialFairValueAssessed`
- `TransferReceivableSchedulePublished`
- `TransferPayableSchedulePublished`
- `EmergencySaleMarketAssessmentPublished`
- `LicenceFinancialCheckCompleted`
- `RegulatorySanctionApplied`
- `CompetitionPaymentCadencePublished`

Read models:

- `FinancingFacilityRegister`
- `CashflowRunwayForecast`
- `OverduePayablesAging`
- `FinancingOptionBoard`
- `DebtServiceSchedule`
- `CovenantStatusBoard`
- `FinancialHealthState`
- `RegulatoryFinanceReadiness`

## Acceptance scenarios

```gherkin
Feature: Club financing tools separate from Investor

  Scenario: Overdraft buys time but not profitability
    Given a club's 13-week cashflow forecast turns negative
    And an overdraft facility has undrawn capacity
    When Club Management draws the overdraft
    Then cash runway improves
    And current debt and weekly interest increase
    And the operating P&L forecast remains unchanged

  Scenario: Sponsor advance uses CommercialPortfolio contract facts
    Given CommercialPortfolio has an active sponsor contract with future cash
    And the contract is eligible for an advance
    When the club accepts a sponsor advance
    Then Club Management posts cash and the financing action
    And CommercialPortfolio keeps the cash-vs-revenue schedule and contract liability
    And future sponsor cash available to the club is reduced

  Scenario: Bank loan repayment and covenant breach
    Given a bank loan has a repayment schedule and strict covenant profile
    When the club misses the leverage covenant after a wage increase
    Then Club Management emits FinancingCovenantBreached
    And the facility becomes atRisk or callableAfterBreach
    And the FinancialHealthState can move to licence_review

  Scenario: Restructuring grants relief with restrictions
    Given a club is in licence_review
    And a lender accepts restructuring
    When DebtRestructuringAgreed is applied
    Then the repayment schedule changes
    And short-term runway improves
    And board/regulatory restrictions are attached to recovery

  Scenario: Factoring keeps the accounting distinction visible
    Given a transfer receivable is due in a future week
    When the club factors the receivable with recourse
    Then the receivable remains visible
    And a secured factoring liability is posted
    And future cash is lower after fees

  Scenario: True-sale factoring removes the receivable
    Given a sponsor receivable is eligible for true-sale factoring
    When the club factors it without recourse
    Then the receivable is removed
    And cash posts at a discount
    And no factoring liability remains

  Scenario: Owner support differs from Investor
    Given a club is in arrears
    When the board offers an equity rescue grant
    Then cash improves without debt or repayment
    But the event is marked as in-world board support
    And no Investor entitlement is created

  Scenario: Shareholder loan helps liquidity but increases debt
    Given a club needs cash before a licence check
    When the board offers a shareholder loan
    Then cash improves
    And related-party debt and future debt service increase
    And Regulations & Compliance treats the loan according to the country profile

  Scenario: Emergency sale mandate shapes Transfer without moving ownership
    Given a club has a funding gap before the licence checkpoint
    When Club Management issues an emergency sale mandate
    Then Transfer receives the target proceeds and deadline
    And Transfer still owns offers, valuations and sale negotiation

  Scenario: Arrears age into licence risk
    Given a transfer payable is missed
    When the payable ages beyond the configured profile threshold
    Then OverduePayableAged updates the football-club category
    And Regulations & Compliance can emit a licence or sanction result
```

## Open before approval

- Final thresholds for runway, covenant warning, arrears age and licence-review
  escalation per Top-5 profile.
- How much Germany/Italy/France exactness is needed before constants freeze;
  current profile shape is source-calibrated, not final rule text.
- Whether `mediaAdvance` becomes active in first playable or remains hook-only.
- Whether `OwnerFundingGuarantee` appears in Standard UI or only in Expert/legal
  profile notes.
- Whether emergency sale mandate can be player-triggered voluntarily or only
  board/regulator-triggered in crisis.
- Whether supplier arrears are visible as a selectable deferral choice or only
  appear after cash failure.

## Related

- Raw research: [[raw-perplexity/raw-club-financing-tools-2026-06-01]]
- Economy design: [[../50-Game-Design/GD-0008-finance-economy]] ·
  [[../50-Game-Design/economy-system]] ·
  [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
- Architecture: [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]] ·
  [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]] ·
  [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
- Implementation: [[../30-Implementation/club-economy-accounting-ledger]] ·
  [[../30-Implementation/club-economy-commercial-contracts]]
