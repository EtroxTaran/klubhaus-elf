---
title: Raw Perplexity - Club Financing Tools 2026-06-01
status: raw
tags: [research, raw, perplexity, economy, finance, accounting, debt, compliance, investor, fmx-49]
created: 2026-06-01
updated: 2026-06-01
type: research
binding: false
linear: FMX-49
sourceType: perplexity
related:
  - [[../club-financing-tools-2026-06-01]]
  - [[../club-economy-blueprint-2026-05-27]]
  - [[../club-economy-impact-map-and-commercial-contracts-2026-05-28]]
  - [[../../50-Game-Design/GD-0008-finance-economy]]
  - [[../../50-Game-Design/economy-system]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../30-Implementation/club-economy-accounting-ledger]]
---

# Raw Perplexity - Club Financing Tools 2026-06-01

This note preserves the FMX-49 research prompts and condensed raw outputs. It is
not implementation authority and not final balance data. The synthesis is
[[../club-financing-tools-2026-06-01]]. Real clubs, leagues, regulators and
accounting standards appear for source evidence only; shipped content must
remain fictional, IP-clean and game-adapted.

## Prompt 1 - football club financing instruments

Research realistic football club financing tools separate from real-money
purchases: overdrafts, bank loans, stadium/facility loans, revolving credit,
sponsor advances, media-payment advances, receivables factoring, restructuring,
payment holidays, owner/board support, emergency player sales, wage deferrals
and supplier arrears.

### Condensed raw answer

- **Overdraft / credit line:** flexible short-term negative cash up to a limit;
  usually current debt with variable interest, bank review and withdrawal/limit
  risk. Game implication: automatic drawdown while cash is below zero, weekly
  interest, limit exhaustion into freeze/arrears.
- **Term bank loan / facility loan:** fixed principal, tenor, repayment
  schedule and covenants. Game implication: scheduled principal/interest,
  covenant breach, margin step-up, forced restructuring or austerity.
- **Stadium/facility financing:** long-lived project finance with construction
  drawdowns and later debt service. Game implication: project-phase cash need,
  later matchday upside, but long debt-service drag.
- **Sponsor/media advances:** future commercial cash pulled forward; cash now
  but future contracted income already consumed. Game implication: should be
  tied to CommercialPortfolio contract schedules and contract liabilities, not
  treated as free revenue.
- **Receivables factoring:** cash against transfer, sponsor or media
  receivables, with discount and recourse risk. Game implication: true-sale vs
  secured-borrowing classification, lower future cash and higher distress
  perception when overused.
- **Restructuring/payment holiday:** maturity extension, rate change,
  capitalised interest, covenant reset or temporary payment relief. Game
  implication: short-term runway gain, higher total cost, stricter covenants,
  licence/reputation pressure.
- **Owner/board support:** equity injection, shareholder loan or guarantee.
  Game implication: separate fictional in-world board support from real-money
  Investor; loans increase debt, equity-like grants do not.
- **Emergency player sale:** liquidity recovery through discounted sales and
  sporting harm. Game implication: a Club Management mandate that shapes
  Transfer behaviour, not a Transfer ownership move.
- **Wage deferral / supplier arrears:** crisis consequences, not normal
  financing. Game implication: overdue-payables ageing, morale/regulatory risk,
  and licence-review escalation.

### Source anchors

- Trade Finance Global, football finance:
  <https://www.tradefinanceglobal.com/finance-products/sports/football/>
- LawInSport, financing football clubs:
  <https://www.lawinsport.com/topics/sports/item/a-guide-to-financing-football-clubs-part-2-equity-finance-ownership-models>
- Football Benchmark, club finance methodology:
  <https://footballbenchmark.com/club-finance-methodology>
- Off The Pitch:
  <https://offthepitch.com>

## Prompt 2 - finance product modelling in management games

Research how management games and sports sims expose debt, loans, board support,
financial distress, emergency cash and accounting depth.

### Condensed raw answer

- Public game-specific source coverage is thinner than the football/accounting
  source base; many games expose finance as budgets, wage limits, board cash
  and reputation rather than detailed facility modelling.
- Useful design pattern: keep three UI layers over one model:
  - Quick: cash runway, next major payment, one to three action cards.
  - Standard: debt, upcoming inflows/outflows, board confidence, short-term
    runway and budget headroom.
  - Expert: receivables/payables, loan terms, covenants, factoring,
    recognition schedules and licence tests.
- Game implication: FMX should expose financing as actions and consequences,
  not as a manual treasury spreadsheet.

### Source anchors

- Sports Interactive manual, Football Manager finances:
  <https://community.sports-interactive.com/sigames-manual/football-manager-2024-touch-and-console/finances-r4988/>
- Circle J Games, finance mechanic design:
  <https://circlejgames.com/finance-mechanic/>

## Prompt 3 - accounting treatment

Research accounting treatment for overdrafts, revolving credit, bank loans,
stadium loans, interest accrual, current/non-current classification, covenant
breaches, factoring, sponsor/media advances, restructuring/payment holidays,
arrears and owner support.

### Condensed raw answer

- Loans, overdrafts, drawn revolving facilities, factoring borrowings and
  shareholder loans are financial liabilities. A game can simplify effective
  interest into scheduled interest and fee lines, but should preserve principal,
  interest, maturity, current/non-current split and covenants.
- Covenant breaches matter because a longer-term facility can become callable
  or effectively current when the club loses the right to defer settlement.
- Factoring depends on risk transfer. If the club retains meaningful recourse or
  default risk, the receivable stays in place and the cash is a borrowing
  secured against that receivable. If substantially all risk transfers, the
  receivable can be removed and the discount is a loss/fee.
- Sponsor/media cash received before performance is delivered is a contract
  liability/deferred income concept. CommercialPortfolio should own the
  performance obligation and cash-vs-revenue schedule.
- Restructuring/payment holidays modify liability schedules. Full IFRS 9
  modification gain/loss math is not needed for first playable, but the revised
  schedule, added cost, covenant reset and distress flag are needed.
- Equity-like owner support differs from shareholder loans. Equity improves
  solvency without repayment; shareholder loans improve liquidity but remain
  related-party debt unless the rules profile treats subordinated support more
  favourably.
- Wage, tax/social, transfer and supplier arrears should be aged and categorised
  because football regulators focus on no-overdue-payables.

### Source anchors

- ACCA, IFRS and football finance:
  <https://abmagazine.accaglobal.com/content/abmagazine/global/articles/2020/specials/cpd-special-edition-2020/technical/ifrs-and-football-finance.html>
- IFRS, IFRS 9 Financial Instruments:
  <https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/>
- IFRS Interpretations Committee, player-transfer payments under IFRS 15 / IAS 38:
  <https://www.ifrs.org/content/dam/ifrs/meetings/2019/november/ifric/ap6-ifrs-15-ias-38-presentation-of-player-transfer-payments.pdf>
- ICAEW, accounting for football clubs:
  <https://www.icaew.com/technical/corporate-reporting/accounting-for-specific-sectors/football-clubs>
- Price Bailey, football clubs and FRS 102 accounting rules:
  <https://www.pricebailey.co.uk/guides/football-clubs-frs-102-accounting-rules/>

## Prompt 4 - football governance and Top-5 compliance

Research football governance and compliance rules relevant to financing
distress: UEFA no-overdue-payables, football earnings, squad cost, debt
sustainability, domestic insolvency/administration consequences, transfer
registration restrictions, owner funding and related-party/fair-value scrutiny.

### Condensed raw answer

- **UEFA overlay:** current Club Licensing and Financial Sustainability
  Regulations include no-overdue-payables, net equity, future financial
  information, football earnings, acceptable-deviation, fair-value and squad-cost
  rules. The 2026 rules are effective from 1 June 2026.
- **England:** EFL 2025/26 regulations impose a 12-point deduction for an Event
  of Insolvency; Premier League 2025/26 handbook material references a 9-point
  insolvency deduction appeal path. Game implication: England-like profiles
  should have explicit insolvency sporting sanctions and P&S/PSR-style review.
- **Germany:** DFL licensing describes economic capability as a licensing
  requirement before every season and notes that criteria can yield licence
  without conditions, with conditions or with requirements. Game implication:
  Germany-like profile should stress pre-season liquidity/licence readiness.
- **France:** LFP/DNCG decision notices show measures such as wage-bill control,
  transfer-fee control, recruitment ban and relegation/conservative relegation.
  Game implication: France-like profile should make regulator-imposed wage and
  transfer caps prominent recovery tools.
- **Italy:** FIGC UEFA club licensing manual lists audited annual/interim
  statements, no overdue payables to football clubs, employees/social/tax
  authorities, UEFA/FIGC/leagues, net equity and future financial information.
  Game implication: Italy-like profile should use licensing documentation and
  future financial information as primary gates.
- **Spain:** LaLiga's official squad-cost-limit page defines the LCPD as the
  maximum amount a club/SAD may consume on the registrable squad during the
  season, proposed by the club and approved/rectified to guarantee financial
  stability. Game implication: Spain-like profile should gate registrations
  through approved squad-cost capacity.

### Source anchors

- UEFA Club Licensing and Financial Sustainability Regulations 2026:
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2026-Online>
- UEFA Article 88, acceptable deviation:
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2026/Article-88-Acceptable-deviation-Online?contentId=Gh_vsBxitM0MEptqFozniA>
- UEFA Article 94, squad cost rule:
  <https://documents.uefa.com/r/UEFA-Club-Licensing-and-Financial-Sustainability-Regulations-2026/Article-94-Squad-cost-rule-Online?contentId=ECUHs41EOPHcoQeGRa3OSA>
- EFL Regulations 2025/26:
  <https://images.gc.eflservices.co.uk/526ac020-67b3-11f0-9ba4-015464ec39cd.pdf>
- Premier League Handbook 2025/26:
  <https://resources.premierleague.pulselive.com/premierleague/document/2025/07/24/99839920-d274-42aa-a2ac-e5612b4f6c61/PL_Handbook_25-26_Digital_24.07.pdf>
- DFL licensing criteria:
  <https://www.dfl.de/de/hintergrund/lizenzierungsverfahren/kriterien-und-anforderungen/>
- LFP DNCG decision notices:
  <https://www.lfp.fr/article/dncg-releve-de-decisions-du-15-novembre-2024>
  <https://www.lfp.fr/article/dncg-releve-de-decisions-du-24-juin-2025>
- FIGC Italian Club Licensing Manual 2023:
  <https://www.figc.it/media/221069/all-al-cu-132a-licenze-uefa-2023-eng.pdf>
- LaLiga squad cost limit:
  <https://www.laliga.com/en-US/transparency/economic-management/squad-cost-limit>

## Prompt 5 - FMX construct critique and gap analysis

Critique the proposed FMX construct: Club Management owns ledger, financing,
budget envelopes, board pressure and insolvency; CommercialPortfolio owns
commercial contracts, receivables, IFRS 15 schedules and fair-value facts;
Regulations & Compliance owns rule catalogs/checks; Transfer, League, Stadium
and Audience provide facts.

### Condensed raw answer

- The construct is sound: financing belongs in Club Management because it
  decides liquidity, obligation schedules, board pressure, insolvency and
  ledger posting.
- Missing pieces:
  - explicit rolling `CashflowRunwayForecast`;
  - overdue-payables categories and ageing;
  - facility-level covenant profile and current/non-current split;
  - binary factoring treatment (`trueSale` vs `securedBorrowing`);
  - funding guarantees as future hook;
  - emergency sale mandate as a Club-owned policy output to Transfer;
  - Top-5 regulatory profile differences.
- Inside Club Management:
  - overdraft/credit line, bank/facility/stadium loan, factoring action,
    restructuring/payment holiday, shareholder loan, equity-like rescue grant,
    emergency sale mandate, insolvency state and runway forecast.
- External facts only:
  - commercial cash/revenue schedules, receivable eligibility and fair-value
    assessment from CommercialPortfolio;
  - transfer receivables/payables and market-sale consequences from Transfer;
  - rule checks and sanction/lifting outcomes from Regulations & Compliance;
  - competition payment cadence from League/Competition.
- Exclude/defer:
  - audit-grade IFRS calculations, derivatives/swaps, crypto/fan tokens,
    real-world tax engineering, full group consolidation and securities-style
    fan investment.

## Recommended raw conclusion

FMX-49 should add a **Club Management-owned FinancingFacility layer** backed by a
rolling cashflow/runway view and overdue-payables ageing. It should keep
CommercialPortfolio as the source for sponsor/media schedules and receivable
facts, keep Regulations & Compliance as the source for Top-5 profile checks and
sanctions, and keep the real-money Investor as a separate SP entitlement path
with no debt/control semantics.
