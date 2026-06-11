---
title: "Raw — Chart-of-accounts granularity for an embedded/product game ledger (FMX-145)"
status: raw
tags: [research, raw, perplexity, ledger, chart-of-accounts, accounting, metadata-dimensions, versioning, fmx-145]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-145
related:
  - [[../ledger-posting-shape-double-vs-single-entry-2026-06-11]]
---

# Raw capture — Chart-of-accounts granularity (Perplexity, 2026-06-11)

Verbatim-faithful capture of the Perplexity strand on chart-of-accounts granularity for the
FMX-145 / ADR-0095 open question. Synthesis in
[[../ledger-posting-shape-double-vs-single-entry-2026-06-11]].

## Prompt (summary)

Same FMX-145 context (offline single-player deterministic double-entry ledger, sole writer,
integer minor units). Posting families from the existing design: 15+ matchday operating-cost
families, catering (revenue/COGS/labour/waste), merchandise (sales/markdown/write-down/returns/
royalty true-up), sponsorship, ticketing/season tickets, cup settlement (receivable→cash, gate
share, travel/security), financing (facilities/drawdown/interest/repayment/factoring), transfers
(fees/instalments/amortisation), wages, insolvency (write-off, fire-sale, wage cap), fan-event
campaigns, investor grants. Questions: (1) best practice for SMALL fixed charts in
embedded/product ledgers (Modern Treasury / TigerBeetle / Formance / Sequence-style) — control
accounts vs sub-accounts vs metadata dimensions; (2) is "few typed accounts + small control set +
fine classification in posting metadata" the documented recommendation; (3) sane account count
(~15/~30/~60) and whether an in-game "Expert accounting" P&L-by-category view can come from event
metadata; (4) CoA versioning in append-only ledgers (never renumber/reuse); (5) precedent for a
two-level design (fixed top-level accounts + versioned sub-code/dimension catalog).

## Answer (verbatim)

You are in the territory of *embedded* / *product* ledgers rather than a full ERP, and most
serious vendors converge on the same pattern: **small, stable account sets + rich, versioned
metadata dimensions**.

### 1) Best practice for small charts in embedded/product ledgers

- **Modern Treasury** — the Ledger product is explicitly *not* a full general ledger; design a
  small product-specific chart, then "slice and dice" using **metadata on ledger entries** and
  dimensions (customer, product, region). Keep the ledger schema stable; push product-specific
  detail into dimensions/custom fields so they evolve without data migrations. Pattern: **few
  accounts + many dimensions on entries**, with control accounts (cash, payables, receivables)
  representing balances.
- **TigerBeetle** — flat set of accounts with an `account_code` and `user_data` metadata fields;
  positions itself as financial accounting **primitives** you overlay with your own reporting
  model. Reference designs (wallets, merchant acquiring) use a **small fixed set of account
  types** plus application-level classification via codes/tags — not thousands of accounts.
- **Formance** — accounts are strings plus optional metadata; promotes **posting metadata for
  business semantics** (order_id, product, channel); "design a small number of account
  categories" and use metadata attributes rather than exploding the account tree.
- **Sequence / Twisp-style ledger databases** — immutable append-only transaction records with
  **metadata for lineage/classification**; separate **storage of economic facts** from
  **reporting structures** so reporting can change without rewriting history.

> Best practice: a **small, stable set of accounts** (4–6 types: asset/liability/equity/revenue/
> expense) and **entry-level metadata/dimensions** carrying most business-specific classification.

### 2) Is "few typed accounts + control accounts + metadata" documented?

No vendor writes a GAAP-style standard, but their docs/examples describe exactly this pattern:
classical 5 account types; one account per major economic role; custom fields on ledger entries
(e.g. `fee_type`) with reports built by filtering/aggregating on them. Their examples, conceptual
docs and reference architectures all converge on it.

### 3) Account count for this club economy; metadata-driven P&L

Recommended: **~30–40 accounts** total (Assets/Liabilities/Equity ~10–20; Revenue/Expense ~10–20).
Sketch: Assets (operating cash, restricted cash, receivables: ticketing/sponsorship/transfers,
inventory: merchandise/catering, prepaid/accrued); Liabilities (trade payables, wage payables,
deferred revenue: season tickets/sponsorship, loan principal, tax/social); Equity (owner equity,
retained earnings); Revenue (ticketing, catering, merchandise, sponsorship, broadcast/prize,
transfer, other); Expenses (matchday opex as ONE line, catering COGS+labour, merchandise COGS,
wages players, wages staff, financing interest, amortisation of player registrations,
sanctions/fines, other).

Each **posting** carries metadata: `category_code` (`matchday_stewarding`, `matchday_security`,
…), `competition_id`, `match_id`, `campaign_id`, `sponsor_contract_id`, `transfer_id`.

Trade-offs for the in-game "Expert accounting" UI:

- **Pros of metadata categories:** P&L-by-category aggregates postings by `category_code`
  independent of the CoA; category structure can change between game versions without
  renumbering accounts; the UI can present a category hierarchy (matchday → security → police
  contribution) while accounts remain flat and small.
- **Cons:** needs a reporting query path (group-by on metadata, not just account_code);
  accounting-literate players may expect line items ≡ accounts — mitigate by showing both Account
  and Category columns.

Going to ~60 accounts would mostly duplicate what metadata can do, make the category model harder
to version and the CoA harder for players to understand.

### 4) CoA versioning in append-only ledgers

- **Never reuse account codes** — once an account exists it remains historical fact.
- **Additive evolution only** — add new accounts; mark old ones **inactive** (never delete or
  reassign); historical periods keep querying them.
- **Versioned reporting structures over a stable ledger** — enterprise GLs (Oracle) use
  chart-of-accounts mappings / tree versions with effective dates: the nominal accounts are
  stable, the roll-up trees are versioned.
- For an append-only ledger: account creation is an insert/event; postings keep pointing at the
  `account_id` they had at creation time; reporting trees carry an effective date/version id.

### 5) Two-level design precedent

Strong precedent: ERP/GL systems separate top-level segments from versioned reporting trees;
fintech ledgers keep accounts coarse and build **versioned category catalogs** mapping entry
metadata to P&L lines. Concrete pattern: Level 1 = fixed accounts (~30, typed, stable codes);
Level 2 = versioned `category_catalog(category_id, version_id, code, name, parent_category_id,
default_account_id, effective_from/to)`. Old saves keep their category version; later versions
can split categories (e.g. `MATCHDAY_SECURITY_POLICE` out of `MATCHDAY_SECURITY`) with mapping
layers for P&L v1 vs v2. Result: **stable balance sheet** (accounts never move) + **flexible
P&L/dashboards** (catalog evolves by patch) without touching ledger history.

## Citations (as returned)

- <https://learn.microsoft.com/en-us/sql/relational-databases/security/ledger/ledger-append-only-ledger-tables?view=sql-server-ver17>
- <https://www.c-sharpcorner.com/article/append-only-ledger-table-in-sql-server/>
- <https://dev.to/morteza-jangjoo/sql-server-ledger-tables-complete-guide-with-banking-example-4f65>
- <https://book.ledgersmb.org/dev/split-book/sec-company-config-coa.html>
- <https://www.twisp.com/docs/infrastructure/ledger-database>
- <https://docs.oracle.com/en/cloud/saas/financials/26b/ocuar/general-ledger-chart-of-accounts-reports.html>
- <https://jack-vanlightly.com/blog/2024/8/13/table-format-comparisons-append-only-tables-and-incremental-reads>
- <https://www.dualentry.com/blog/general-ledger-vs-chart-of-accounts>
