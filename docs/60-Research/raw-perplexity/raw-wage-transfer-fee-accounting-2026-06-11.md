---
title: "Raw — IAS 38 player-registration accounting, transfer instalments, wages, loans (FMX-144)"
status: raw
tags: [research, raw, perplexity, accounting, ias38, transfer-fees, amortisation, wages, loans, ffp, fmx-144]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-144
related:
  - [[../wage-and-transfer-fee-posting-contracts-2026-06-11]]
---

# Raw capture — Football-club accounting practice (Perplexity, 2026-06-11)

Verbatim-faithful capture of the Perplexity strand on real-world football-club accounting for
FMX-144 (wage + transfer-fee posting contracts). Synthesis in
[[../wage-and-transfer-fee-posting-contracts-2026-06-11]].

## Prompt (summary)

Football management sim accounting model. Asked for sourced practice on: (1) IAS 38 player
registrations — what is capitalised vs expensed; (2) transfer instalments as payable/receivable;
(3) disposal gain/loss mechanics; (4) contract-extension re-amortisation; (5) early
termination / career-ending injury write-off; (6) wage presentation + payroll cadence;
(7) loan-out/loan-in accounting; (8) UEFA squad-cost-ratio input = amortisation, not cash fee.

## Response (key findings, faithful)

### 1. IAS 38 player registrations

- Under IAS 38, an intangible asset is recognised at **cost** = purchase price + **directly
  attributable costs** of preparing the asset for use; finite-life intangibles are amortised
  systematically (typically **straight-line**) over useful life. In football the useful life is
  the **contract term**.
- On acquisition: `Dr Intangible assets – player registrations` / `Cr Cash` +
  `Cr Payables – amounts due to other clubs`.
- Amortisation: `Dr Amortisation of player registrations (P&L operating expense)` /
  `Cr Accumulated amortisation`.
- **Capitalised** in club practice: transfer fee; transfer-linked levies/solidarity payments
  borne by the buyer; **directly attributable intermediary/agent fees for securing the
  registration**; registration fees.
- **Expensed immediately** (IAS 19 employee benefits, not IAS 38 cost): player **wages**,
  **signing-on bonus** (recognised in staff costs over service period), performance bonuses,
  agent fees that relate to the player's salary/representation rather than the transfer.
- Club disclosures: Juventus and Borussia Dortmund disclose "intangible assets — player
  registration rights" at cost, straight-line over contract term; Manchester United (IFRS,
  20-F) capitalises registration costs and amortises over contract term, wages in employee
  benefit expenses.

### 2. Transfer instalments

- Buyer recognises the **full cost at acquisition date** regardless of instalment timing:
  `Dr Intangible` / `Cr Trade payables to football clubs` (+ `Cr Cash` for upfront part).
- Seller: `Dr Receivables from football clubs` + `Dr Cash` / `Cr Intangible (carrying amount)` +
  `Cr Profit on disposal`.
- Presented as **"Amounts due from/to football clubs"** with current/non-current split.
- Discounting (IFRS 9) applies to material long-dated interest-free instalments; many Premier
  League accounts show nominal values (immaterial); some Italian/German clubs disclose
  present-value measurement with unwinding as finance income/expense.

### 3. Disposal

- IAS 38: gain/loss = **net disposal proceeds − carrying amount**, recognised in P&L.
- Presented as a separate line, commonly **"Profit on disposal of players' registrations"**.

### 4. Contract extension

- Change in useful life = **change in accounting estimate** (IAS 8) → **prospective**:
  remaining net book value re-amortised over the **new remaining contract term**. No prior-period
  adjustment, no gain/loss. Serie A / Bundesliga notes state this explicitly.

### 5. Early termination / career-ending injury

- Termination/release with no fee: derecognise — `Dr Loss on disposal/termination` /
  `Cr Intangible` (clear accumulated amortisation). Settlement paid to the player = termination
  expense in staff costs.
- Career-ending injury = impairment indicator (IAS 36): write carrying amount down to
  recoverable amount (often nil) — `Dr Impairment loss` / `Cr Accumulated impairment`.

### 6. Wages

- IAS 19 employee benefits, expensed as incurred; presented as **"Staff costs" / "Employee
  benefit expenses" / "Wages and salaries"**, with notes splitting players / coaching staff /
  admin staff. Operating expense, separate from amortisation.
- UK player contracts quoted as **weekly wages** but payroll typically administered
  **monthly**; IFRS recognition is accrual-based over service period regardless of cadence.

### 7. Loans

- Registration right **stays with the parent club**; intangible remains on parent's balance
  sheet and **amortisation continues** during the loan.
- Loan-out: loan fee income recognised **over the loan period** (IFRS 15 analogy;
  `Cr Deferred income` then released). Parent remains employer → gross wage expense; borrowing
  club's wage share recognised as recharge income / cost offset (some clubs present net).
- Loan-in: borrowing club recognises **no intangible**; loan fee expensed over the loan term
  (prepaid then released); wage share in staff costs.

### 8. UEFA squad cost ratio / FFP

- UEFA sustainability rules use **accounting figures, not cash flows**: squad cost ratio ≈
  player wages + coach/staff wages + **amortisation of player registrations** + agent fees, per
  audited financial statements. Cash instalment timing only feeds net-debt/liquidity metrics.

## Sources cited by Perplexity

1. opag.io — IAS 38 explained (recognition/measurement)
2. ICAEW — IFRS standards tracker, IAS 38
3. ifrs.org — IAS 38 Intangible Assets (standard text)
4. iasplus.com (Deloitte) — IAS 38 summary
5. KPMG — capitalisation of intangible assets (PDF)
6. ACCA — technical article, intangible assets
7. PKF — in-depth guide to IAS 38 under IFRS
8. XRB (NZ) — IAS 38 standard document
   Plus named club annual-report practice: Manchester United (20-F/IFRS), Juventus, Borussia
   Dortmund ("Intangible assets — player registration rights" notes).
