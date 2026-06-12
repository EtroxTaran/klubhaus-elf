---
title: "Raw — FM finance-model simplifications, aggregated payroll postings, integer amortisation rounding (FMX-144)"
status: raw
tags: [research, raw, perplexity, football-manager, finance-model, payroll, ledger, amortisation, rounding, fmx-144]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-144
related:
  - [[../wage-and-transfer-fee-posting-contracts-2026-06-11]]
---

# Raw capture — Sim-practice + ledger-design strand (Perplexity, 2026-06-11)

Verbatim-faithful capture of the second Perplexity strand for FMX-144: how Football Manager
simplifies club finance, aggregated-vs-per-employee payroll postings, and integer straight-line
rounding. Synthesis in [[../wage-and-transfer-fee-posting-contracts-2026-06-11]].

## Prompt (summary)

(1) Does FM amortise transfer fees over contract length and model instalments? Wage handling and
finance-screen cadence. (2) FM P&L category granularity. (3) Best practice for posting recurring
payroll in event-sourced double-entry ledgers: one aggregated periodic entry with category
breakdown vs one entry per employee. (4) Standard pattern for integer-cent straight-line
remainders.

## Response (key findings, faithful)

### 1. Football Manager finance model

- FM models **transfer amortisation FFP-style**: a £30m fee on a 5-year deal hits the P&L as
  **£6m/year amortisation** until contract end or sale — explicitly called "amortisation"
  in-game; not a one-off expense.
- Transfer UI supports **instalments** ("£X now, £Y over 3 years") plus clauses (appearance
  fees, **sell-on percentage**, add-ons). The game tracks **transfer debt / future instalments**
  separately from P&L amortisation — i.e. **cash schedule and accrual accounting are separate**.
- Wages: managed against a **weekly wage budget** (planning constraint); **no per-payslip
  simulation** — wages aggregate into **monthly / season-to-date** expense categories on the
  Finances screen; projections are monthly with seasonal layers.

### 2. FM finance-report granularity

- Documented expense buckets: **Player Wages, Staff Wages, Match Day Expenses, Bonuses
  (+ Loyalty/Agent Fees), Tax, Non-Football Costs/Other, Loan Repayments & Interest, Scouting,
  Youth Setup, Ground Maintenance**.
- Income buckets: Gate Receipts, Season Tickets, TV, Prize Money, Merchandising, **Player
  Sales (profit)**, Sponsorship, Other.
- "Transfer amortisation" exists as a concept/FFP layer but is sometimes grouped in the public
  UI; no official exhaustive SI category list — list reconstructed from SI-affiliated content
  and community guides.

### 3. Aggregated vs per-employee payroll postings

- Production fintech ledgers (TigerBeetle, Modern Treasury) prefer per-counterparty postings
  for auditability, with batching at the API/protocol layer — driven by *external* throughput
  needs.
- For a **game**, the ledger is an internal analytical system of record while contractual
  detail already lives in the domain model (contracts). Recommended pattern: **one aggregated
  journal per wage category per period**, detail retained in domain state; event-sourced shape
  ≈ `PayrollRunExecuted(period)` with per-category totals + a hash/reference of the
  per-employee breakdown for integrity. Bounded ledger volume; auditability via deterministic
  recomputation from contracts.
- No widely-cited paper specifically on ledger-volume-vs-auditability in games; the trade-off
  table (per-employee = drill-down + volume; aggregated = bounded volume + separate detail
  source) is standard accounting-patterns material (cf. Fowler accounting patterns).

### 4. Integer straight-line remainders

- Standard pattern: `base = floor(total / n)`, `remainder = total − base·n`; either spread the
  remainder one cent across the first `remainder` periods, or **dump the entire remainder into
  the last period** ("**last-period adjustment / balancing adjustment in final period**") —
  the latter is the common simple practice (QuickBooks, ERP straight-line schedules, textbook
  examples). Sum of periodic amounts always equals original cost.

## Sources cited by Perplexity

1–3. YouTube FM finance guides (UI walkthroughs)
4. afmoldtimer.home.blog — "Finances — Football Manager" (2022)
5. footballgpt.co/fm/fm-finances — FM finance-screen guide
6. FM Scout community post (finances screen breakdown)
7. footballmanager.com — "Smarter Transfers, Squad Building and Finance" feature article
