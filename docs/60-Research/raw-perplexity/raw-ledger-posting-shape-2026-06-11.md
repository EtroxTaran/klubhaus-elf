---
title: "Raw — Ledger posting shape: double-entry vs single-entry for a deterministic offline game ledger (FMX-145)"
status: raw
tags: [research, raw, perplexity, ledger, double-entry, accounting, event-sourcing, determinism, reversal, tigerbeetle, modern-treasury, fmx-145]
created: 2026-06-11
updated: 2026-06-11
type: research
binding: false
linear: FMX-145
related:
  - [[../ledger-posting-shape-double-vs-single-entry-2026-06-11]]
---

# Raw capture — Ledger posting shape (Perplexity, 2026-06-11)

Verbatim-faithful capture of the Perplexity strand on balanced double-entry vs single-entry +
periodic reconciliation for the FMX-145 / ADR-0095 D1 decision. Synthesis in
[[../ledger-posting-shape-double-vs-single-entry-2026-06-11]].

## Prompt (summary)

Offline single-player football-manager game; deterministic event-sourced ledger; byte-identical
replay; integer minor units; append-only; sole-writer bounded context. Decide posting shape:
**A** balanced double-entry postings (≥2 lines summing to zero, typed `accountCode`, reversal =
offsetting pair, derivable `assets = liabilities + equity` control check) vs **B** single-entry
signed `amountMinor` + contra-account reference + weekly enforced-projection reconciliation.
Questions: (1) what production immutable/event-sourced ledgers do (TigerBeetle, Modern Treasury,
Square/Cash App, Stripe, Uber) — is per-transaction balance a kernel invariant, how are
corrections modeled; (2) documented failure modes of single-entry + periodic reconciliation;
(3) precedents/overhead of double-entry in game/sim economies; (4) reversal semantics —
leg-swapped pair vs negative-amount repost; (5) runtime/storage cost at offline-client scale
(thousands of postings/season, 50–100-season soak).

## Answer (verbatim)

You are describing exactly what most production financial ledgers do today: an **immutable,
event-sourced, balanced double-entry ledger with per-transaction invariants and reversal
entries**. TigerBeetle, Stripe, Square/Cash App, Uber, and Modern Treasury–style ledgers all fall
into that family, with minor variations in how they expose corrections and projections. For a
deterministic offline game, Option A (balanced double-entry per posting) is much closer to
industry practice and imposes negligible overhead at your scale.

### 1) What production immutable/event-sourced ledgers do

- **TigerBeetle** — explicitly an immutable, double-entry, accounting-style ledger. Transfers
  always involve two accounts and are required to balance; transfers are atomic and append-only.
  Reversals are modeled as **corrections via new transfers**, not mutation; records are immutable.
  Per-transaction validity is enforced at the kernel level before append.
- **Stripe (Balance Platform / Treasury)** — built on a **double-entry ledger**: debits and
  credits between internal accounts so "every movement of funds is balanced across accounts";
  corrections are **adjustment entries**, never overwrites.
- **Square / Cash App** — "double-entry accounting ledger that tracks balances in an immutable
  way"; chargebacks/corrections are **separate journal entries** (reversals/adjustments).
- **Uber** — in-house finance platform uses a **double-entry general ledger**; each trip leads to
  balanced entries across rider, driver and Uber accounts; refunds/disputes are adjustment
  entries posted after the fact.
- **Modern Treasury (Ledgers)** — journal entries **must balance** ("A Journal Entry is balanced
  when the sum of all debit amounts equals the sum of all credit amounts"); the ledger is
  immutable; corrections are reversal/adjusting journal entries. Correctness is guaranteed at the
  **write path**, not by periodic reconciliation.

Summary: per-transaction balance is enforced as a **kernel invariant**; ledgers are immutable and
event-sourced; corrections/reversals are **new entries referencing the original**.

### 2) Failure modes of single-entry + periodic reconciliation

Single-entry bookkeeping is documented as suitable only for very simple, low-risk contexts:

- It **can't enforce the accounting equation** (Assets = Liabilities + Equity) on every
  transaction because it only records one side.
- **Error detection is much harder** — discrepancies surface only at the end-of-period
  reconciliation; many errors are silent (mis-classification still "looks" fine; omissions have
  no forced balancing condition).
- **Late error detection**: the system happily processes further entries on a broken base until
  the periodic check runs.
- **Attribution of imbalance**: when the weekly projection fails, you know the **aggregate** is
  wrong but not which transaction(s) caused it — debugging requires recomputing projections over
  potentially thousands of events.
- **Replay divergence**: if projection logic and write-path logic differ even slightly, replaying
  the event log may produce a different projection than the original run. With double-entry the
  ledger itself provides a built-in invariant at the **event** level that must hold identically
  in replay.

### 3) Double-entry in game/sim economies; modeling overhead

Precedents: EVE Online's economy uses ledger-like systems and corporate wallets with multiple
accounts whose balances must reconcile for economic analysis; educational accounting games
implement full double-entry; open-source virtual-economy frameworks (Minecraft/Roblox economy
plugins) adopt double-entry for correctness/auditability — especially where virtual currency may
later be monetized.

Per-posting overhead is **constant and small**: identify source/destination accounts + type, then
a journal-entry builder that adds lines (`accountCode`, `amountMinor`) and asserts sum == 0 at
build time. Most paths add **two lines**; complex events (transfer with commission) 3–4 lines,
which maps directly to economic reality. Once a **simple chart of accounts** and a few helpers
exist, the cognitive overhead is small and far outweighed by simpler debugging ("where did the
money go?" is answerable per event).

### 4) Reversal semantics

Standard practice is the **reversing journal entry**: a new entry with the **same accounts** as
the original and **opposite debit/credit (or negated amounts)**, tied to the original via an
`originalEntryId`, so the net effect is zero. "Change of destination" corrections are modeled as
**reversal of the original + a new correct entry**, never a single mutated/leg-swapped step.
Advantages: auditability (history includes the mistake and its correction), idempotency/replay
(post entries exactly as written, never mutate), determinism (pure append-only, no state-dependent
branch logic). With signed per-line amounts, "leg-swapped pair" and "same accounts, negated
lines" coincide; the standard term is **reversing entry**.

### 5) Runtime/storage cost at offline scale

~5,000 events/season × 100 seasons × 2 lines = ~1,000,000 lines; at 64–128 bytes/line ≈ ≤128 MB
worst case (far less with compact integers). IndexedDB and Postgres both handle tens of millions
of rows locally; runtime adds a few extra writes per event and an O(1) integer sum check —
negligible vs game logic. **Double-entry does not add any runtime/storage cost that matters** for
this environment.

### Recommendation

Option A — balanced double-entry per posting, append-only, no mutation, reversals as reversing
entries; per-event invariants protect determinism and replay; consistent with TigerBeetle /
Modern Treasury / Stripe / Square / Uber practice; negligible overhead at this scale. Option B
has known failure modes: late error detection, harder attribution, higher replay-divergence risk
because correctness is pushed into an external projection pipeline.

## Citations (as returned)

- <https://www.paylocity.com/resources/glossary/double-entry-accounting/>
- <https://www.factorcloud.com/blogs/why-double-entry-accounting-matters-more-than-you-think>
- <https://pilot.com/blog/double-entry-vs-single-entry-bookkeeping>
- <https://www.investopedia.com/terms/d/double-entry.asp>
- <https://www.highradius.com/resources/Blog/what-is-accounts-double-entry-bookkeeping-system/>
- <https://nowcfo.com/double-entry-bookkeeping-explained/>
- <https://www.salesforce.com/ap/blog/double-entry-accounting-and-bookkepping/>
- <https://rooled.com/resources/5-benefits-of-double-entry-bookkeeping-for-startups/>
