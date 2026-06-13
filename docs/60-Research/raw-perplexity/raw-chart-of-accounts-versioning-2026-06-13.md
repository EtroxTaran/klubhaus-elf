---
title: "Raw - chart-of-accounts and category-catalog versioning (FMX-150)"
status: raw
tags: [research, raw, perplexity, ledger, chart-of-accounts, category-code, versioning, append-only, replay, fmx-150]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-150
related:
  - [[../chart-of-accounts-and-category-catalog-2026-06-13]]
  - [[../../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]
  - [[../../10-Architecture/09-Decisions/ADR-0106-chart-of-accounts-and-category-catalog]]
---

# Raw - chart-of-accounts and category-catalog versioning (FMX-150)

## Research prompt

Perplexity was asked for versioning best practice for a chart of accounts and category catalog in an
append-only embedded ledger. The prompt asked how to avoid renumbering, how old saves replay under old
catalogs, whether categories should be effective-dated, and whether a game should use control
accounts plus sub-ledger/category dimensions.

## Key findings

- Codes are historical identifiers. Once posted, an account code must never be reused for a different
  meaning.
- Evolution should be additive: add new account codes; mark old accounts inactive; do not delete,
  renumber or reinterpret posted history.
- Reporting structures can be versioned independently of ledger postings. Old saves should replay
  against the catalog version/hash they were authored with, while newer UI trees can map historical
  categories for display.
- Fine business dimensions are safer as a versioned category catalog than as account explosion:
  category splits/merges affect reports, not the accounting identity.
- Control accounts with metadata/dimensions are the normal embedded-ledger pattern: the ledger keeps
  balance through stable account types, while reporting slices by category, campaign, match,
  competition, sponsor, transfer or insolvency case.
- For FMX, `chartOfAccountsVersion` and `categoryCatalogVersion` should be carried by postings or
  by the posting batch/provenance envelope so deterministic replay can pin the exact vocabulary.

## Source trail

- Perplexity research pass, 2026-06-13: chart-of-accounts / category catalog versioning for
  embedded append-only ledgers.
- Oracle General Ledger chart-of-accounts reporting / tree-versioning docs:
  <https://docs.oracle.com/en/cloud/saas/financials/26b/ocuar/general-ledger-chart-of-accounts-reports.html>
- Twisp ledger database documentation: <https://www.twisp.com/docs/infrastructure/ledger-database>
- CloudBees feature/versioning guidance as a product-catalog analogy:
  <https://www.cloudbees.com/>
- Qolo and Ingo Money embedded-ledger/product-ledger material as additional Perplexity-returned
  examples of control accounts plus product metadata.

## Notes for synthesis

FMX already has ADR-0095 LI-9. FMX-150 should make it concrete: semantic account codes are stable,
the chart has an integer version, the category catalog has a separate version, old saves pin both,
and category evolution never rewrites ledger history.
