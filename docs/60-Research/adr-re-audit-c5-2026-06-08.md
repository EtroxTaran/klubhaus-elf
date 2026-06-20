---
title: ADR re-audit — Cluster C5 (Economy / Finance / Commercial / Investor)
status: draft
tags: [research, audit, re-audit, economy, finance, commercial, investor, ledger, settlement, bankruptcy, cluster-c5, adr-0050, adr-0058, adr-0062, adr-0063, adr-0070, adr-0079, adr-0086]
context: [club-management-economy, commercial-portfolio]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../30-Implementation/club-economy-accounting-ledger]]
  - [[../30-Implementation/club-economy-commercial-contracts]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/economy-system]]
  - [[club-economy-blueprint-2026-05-27]]
  - [[investor-compliance-and-entitlement-boundary-2026-06-01]]
  - [[background-fast-cost-settlement-2026-06-07]]
  - [[fixture-commercial-revenue-profiles-2026-06-03]]
  - [[dynasty-board-ownership-bankruptcy-2026-06-05]]
---

# ADR re-audit — Cluster C5 (Economy / Finance / Commercial / Investor)

Audit of the seven cluster-C5 decisions: accounting ledger ([[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]),
commercial-impact boundary ([[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]),
audience/atmosphere ([[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]),
investor entitlement ([[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]),
fixture/competition revenue contract ([[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]),
dynasty board/ownership/bankruptcy ([[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]),
and background-fast cost settlement ([[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]).

Ground-truth honoured: offline-first/local-first; LLM out of authoritative state; Club Management is the **sole finance-ledger writer**.
Read-only on all existing files; supersession proposals below are NEW-draft-only.

## Headline

The cluster is **architecturally coherent and unusually well-grounded** on the *boundary* axis: one ledger writer
(Club Management), commercial settlement isolated in CommercialPortfolio, causal facts kept in their owning contexts,
clean Customer-Supplier + ACL. The four levers that defend a 50-year save (board/ownership/bankruptcy, dynasty)
are pinned to one owner with a determinism contract.

But the cluster has **one load-bearing gap and two ubiquitous-language drifts** that span ADRs:

1. **No accounting-identity invariant.** The ledger is specified as a **single-signed-entry** stream
   (`amountMinor … signed`, [[../30-Implementation/club-economy-accounting-ledger]] §Ledger entry shape),
   not double-entry. ADR-0050/0058/0086 all lean on IFRS-15 cash-vs-recognition separation and on "reversal +
   compensating repost" corrections, yet nothing guarantees `assets = liabilities + equity` reconciles, or that a
   reversal is *balanced*. Production immutable ledgers (TigerBeetle, Modern Treasury, Square) are double-entry
   precisely to make idempotent reversal/replay mechanically checkable (Perplexity, 2026-06-08).
2. **Investor ownership drift.** ADR-0050 says "real-money Investor … remain SP-only payment/entitlement events";
   ADR-0058's amended note assigns the **Investor entitlement grant policy to CommercialPortfolio**; ADR-0063
   puts the `InvestorEntitlement` aggregate + state machine in **CommercialPortfolio**. Three files, three
   slightly different homes for "who owns the Investor." Resolvable, but currently a reader must triangulate.
3. **`MoneyBand` vs `Money` (fixed-point minor units) drift.** ADR-0070/0086 settlement envelopes carry both
   `estimatedOperatingCostBand: MoneyBand` *and* `estimatedOperatingCostTotal: Money`; the ledger only accepts
   `amountMinor`. The band→exact-money collapse rule (when does a band become a postable integer?) is unspecified
   and is exactly where determinism + reconciliation can silently break.

None of these reopen the *boundary* decisions — they are invariant/contract gaps inside an otherwise sound map.

---

## Per-ADR verdicts

### ADR-0050 — Club Economy Accounting Ledger — **weak** (boundary sound; invariant gap), confidence **high**

The core decision (Club-owned append-only ledger; statements/KPIs are projections; sole writer; integer minor units;
country profiles as data) is **sound and best-practice**. The weakness is the **accounting model under** the decision.

Evidence:
- ADR-0050 §Decision: "Money values are integer minor units; ratios use basis points"; "Ledger entries are
  append-only domain facts"; projections include "balance-sheet-like summaries, amortisation schedules, liabilities".
- [[../30-Implementation/club-economy-accounting-ledger]] §Ledger entry shape defines a **single signed** field
  `amountMinor` (no contra-account, no debit/credit pairing). `entryKind` ∈ {cash, accrual, liability, receivable,
  amortisation, reserve, equity} is a *category*, not a balanced transfer.
- ADR-0050 lists `AccountingStatement` + `LiabilitySchedule` + `BalanceSheet`-like projections and (via ADR-0058)
  IFRS-15 accrual schedules — i.e. a real balance sheet is promised, but no posting rule guarantees it balances.

Issues:
- No accounting-identity invariant: a missing/duplicated counter-effect silently breaks the balance sheet, and
  there is no machine check. This undercuts the ADR's own "strong audit trail / replays / multiplayer trust" claim.
- "Reversal + compensating repost" (ADR-0086 D3) is only safe if the original posting was balanced; on a single-entry
  stream a reversal is just another signed row with no structural guarantee it offsets the right accounts.
- 80+ event names are enumerated, but there is **no `LedgerEntry` invariant table** (cf. ADR-0070/0086 which DO have
  invariant tables) — the most invariant-hungry aggregate in the cluster has none.

Recommendation (2-3 options for Nico):
- **(A) Balanced double-entry postings** — every `FinanceLedgerEntryPosted` carries ≥2 lines summing to zero
  (debit/credit), accountCode per line. Strongest reconciliation; matches TigerBeetle/Modern Treasury; makes
  reversal/replay trivially checkable. Cost: every emitter's settlement event must map to balanced lines (an ACL
  responsibility already implied).
- **(B) Single-entry + enforced projection identity** — keep `amountMinor`, but add a *binding invariant* that the
  derived balance sheet must reconcile each week and a contra-account is recorded per entry. Cheaper; weaker
  structural guarantee.
- **(C) Status quo (single signed, no identity invariant)** — reject; it is the current implicit state and is the gap.
- *Recommendation: A*, expressed as a **new superseding ADR** ("Double-entry ledger posting invariant") that
  supersedes ADR-0050 (decision unchanged; adds the posting-shape + identity invariant). Confidence high that the
  gap is real; the A/B choice is Nico's.

### ADR-0058 — Club Economy Commercial Impact Boundary — **sound** (with an in-file status artefact), confidence **high**

The decision is sound: CommercialPortfolio owns commercial policy/lifecycle/accrual/settlement; Club Management posts;
causal facts stay with owners. The FMX-32 amendment correctly **supersedes its own original Option C** in-place via a
ratification note (a documented, legitimate amendment).

Evidence:
- §Ratification note: "The original §Recommendation below (Option C …) is superseded by the FMX-32 boundary audit …
  instantiated as the **CommercialPortfolio** bounded context."
- Five FMX amendments (44/45/46/47/48/50) layer on without moving the boundary — disciplined.

Issues (minor, not boundary):
- **Status artefact:** the file has `status: accepted` (frontmatter) AND a literal `## Status (original draft text)
  → draft` block mid-file. Harmless to humans, but a parser/NotebookLM export could mis-read the status. (Read-only;
  flag only.)
- Investor ownership wording (see cross-ADR #2) originates here: the amended note hands CommercialPortfolio the
  "Investor entitlement grant policy", which ADR-0050 frames as a pure SP payment/entitlement event.
- Carries the **same `MoneyBand`/recognition ambiguity** downstream (see cross-ADR #3) — accrual schedules are named
  but the band→postable-money collapse is undefined.

Recommendation: **no supersession of the boundary.** Fold the status-block artefact note + the Investor-ownership
single-source-of-truth fix into the proposed Investor consolidation ADR (cross-ADR #2). Confidence high.

### ADR-0062 — Audience & Atmosphere Context — **sound**, confidence **high**

In-cluster because it carves fan demand / atmosphere / ticketing-trust out of Club Management and feeds the economy.
The 6/6 DDD split-criteria case is thorough; ownership exclusions are explicit ("does not write money facts";
Club Management owns ledger; CommercialPortfolio owns ticketing policy). Determinism uses dedicated `AtmosphereRng`/
`PoliticsRng`/`TrustRng` sub-labels of `WorldRng` (ADR-0018).

Evidence:
- §"Audience & Atmosphere does not own … Finance ledger entries (owned by Club Management per ADR-0050)".
- §Determinism: "`AtmosphereRng(saveId, clubId, week)` sub-label of `WorldRng` … No cross-RNG draws."

Issues (small):
- RNG-stream taxonomy drift across the cluster: ADR-0062 names `AtmosphereRng`/`PoliticsRng`/`TrustRng`; ADR-0086
  uses `WorldRng:venue:<clubId>:<week>:opcost:v1`; ADR-0079 uses `worldAiMgmt:…`. These are *consistent* (all
  sub-labels of the two world streams) but use two different *notation conventions* (`XxxRng(args)` vs
  `WorldRng:scope:...`). A single grammar would prevent label collisions. Belongs to the determinism-cluster audit,
  flagged here for the economy touch-points.
- Status is `accepted` while the phase note says all ADRs reopened to `draft` — a vault-wide bookkeeping mismatch,
  not a C5-specific defect.

Recommendation: keep as-is; no economy-side change. Confidence high.

### ADR-0063 — Investor Entitlement and Payment Boundary — **sound (as a draft)**, confidence **medium**

A clean `proposed`/`binding:false` options ADR. `PaymentProviderPort` + server-authoritative idempotent entitlement
state machine (`created → paid → entitled → refunded|revoked`), account-bound not save-bound, MoR-vs-direct flagged
as an explicit HITL gate. This is the right shape and correctly defers the legal call.

Evidence:
- §Option B (recommended): "`PaymentProviderPort` abstracts `apple-iap | google-iap | web-psp` … exactly-once …
  Entitlements bind to the **account, not the save**."
- §Vendor sub-decision: B1 MoR-first for web vs B2 Stripe-direct, kept as HITL.

Issues:
- It is the **third** place that locates Investor ownership (CommercialPortfolio aggregate) — see cross-ADR #2; the
  cluster needs one canonical statement.
- The MoR-vs-direct framing is still accurate for 2026: MoR (Paddle/FastSpring; Lemon Squeezy now Stripe-owned) is
  the lower-ops choice for EU VAT/OSS + US sales-tax nexus + dispute handling on a single SP consumable; Stripe-direct
  is only a fit if the studio becomes seller-of-record (Perplexity, 2026-06-08). **One update worth noting:** the
  Lemon-Squeezy→Stripe acquisition and the 2024-2025 Apple/Google anti-steering / external-purchase rulings make a
  web checkout *alongside* IAP more viable — the `PaymentProviderPort` seam already absorbs this, so no decision
  change, but the SKU/disclosure read models should anticipate an "external-purchase link" surface.
- `web-psp` is treated as one provider type; under MoR the "provider" is the MoR, not a raw PSP — the port's type
  enum may want `web-mor | web-psp` to keep B1/B2 swappable without a domain change.

Recommendation: keep Option B; **ratify-or-extend via a small amendment** (not a supersession) that (a) names the
single Investor owner, (b) splits the web provider type into `web-mor | web-psp`, (c) notes the anti-steering
external-link surface. Vendor/refund/age-gate stay HITL. Confidence medium (legal gates genuinely open).

### ADR-0070 — Fixture/Competition Revenue Profile Contract — **sound**, confidence **high**

A model published-language contract: League owns rule/cadence facts (`CompetitionRevenueProfile`,
`FixtureCommercialProfile`), CommercialPortfolio owns accrual/settlement interpretation, Club Management posts.
Event-plus-query, immutable versioned profiles, ACL consumer-owned projections, 9 invariants (P1-P9), explicit
field-to-consumer mapping with "no orphan fields". Ratified A/A/A.

Evidence:
- §Invariants P8: "Club Management remains the sole ledger writer"; P5: no Rivalry/Audience/Stadium facts copied into
  the fixture profile (kills the stale-copy failure mode).
- §Background-fast hook seeds the `MatchdayOperatingCostSummary` that ADR-0086 then formalises — clean forward link.

Issues (small):
- `qualityProfileClass: 'backgroundFast' | 'standard' | 'expert'` (ADR-0070) vs match-engine's four profiles
  (`competitive-full`, `interactive-standard`, `background-detailed`, `background-fast`, per ADR-0086 §Context) —
  a **3-vs-4 enum drift** on the same concept. Minor, but two enums for "quality profile" invites a mapping bug.
- The `MoneyBand`/`Money` collapse rule (cross-ADR #3) is introduced here (`estimatedOperatingCostBand: MoneyBand`).

Recommendation: keep; reconcile the quality-profile enum and the band-collapse rule in the ADR-0086 follow-up
(they share the envelope). Confidence high.

### ADR-0079 — Dynasty Board, Ownership & Bankruptcy FSMs — **sound (as proposed)**, confidence **high**

Strong: Board & Ownership land as Club Management sub-aggregates (no new BC, no cross-context ACL for ledger effects
since CM already owns board pressure + insolvency stage); `WorldAiMgmtRng` for stochastic + deterministic board
ladder; 12 invariants (DB1-DB12); caps/cooldowns; reserved liquidation/CVA tail; all magnitudes = FMX-52 calibration.
The ADR even self-documents the one determinism-table tension it resolves.

Evidence:
- §D3 reconciliation note: the determinism-and-replay table lists impersonal "board events → WorldRng"; this ADR puts
  AI-management ownership/insolvency *decisions* on `WorldAiMgmtRng` and the board ladder on *no* stream — "No
  contradiction — this ADR records the split explicitly."
- DB5: "No finance-ledger write occurs outside Club Management."

Issues (small):
- **Bankruptcy ↔ ledger seam is under-specified on the economy side.** `AdministrationEntered` carries a
  `pointsDeductionBand` (sporting) and `wageCapPct`, and `AdministratorFireSaleOpened` drives transfer cash, but the
  ADR does not name the **ledger effects of insolvency** (creditor write-off posting, wage-cap saving entries,
  fire-sale receipts) as ADR-0050 ledger events. `ClubRescued.creditorWriteoffBand` implies a balance-sheet
  write-off with no posting contract. Given the proposed double-entry move (ADR-0050 rec), creditor write-off is the
  textbook case that *needs* balanced postings.
- Overlaps ADR-0050's "insolvency stage" — ADR-0079's `InsolvencyCase` FSM extends it; the two should cross-reference
  the **same** state enum (ADR-0050 names "staged insolvency"; ADR-0079 names an FSM) to avoid two insolvency models.

Recommendation: keep the decision; on ratify, add an explicit **insolvency→ledger posting contract** (creditor
write-off, wage-cap delta, fire-sale receipt) referencing ADR-0050, ideally as balanced entries. Fold into the
double-entry ADR if A is chosen. Confidence high.

### ADR-0086 — Background-fast Matchday Cost-Settlement — **sound (as proposed)**, confidence **high**

Excellent fit: one `MatchdayOperatingCostSummary` settlement fact replaces the 19-event foreground storm at world
scale; lightweight stateless path (no per-fixture saga); reversal+repost reconciliation for detailed-resim upgrades;
seeded variance on the existing `WorldRng:venue` sub-label (Nico's documented override of the pure-function default,
consistent with the standing "seeded variance over pure determinism" steer); 11 invariants (BF1-BF11). It explicitly
extends ADR-0070 and does not reopen ADR-0050/0058/0061/0070.

Evidence:
- BF8: posted summary "immutable & canonical; … reconciles via reversal + compensating repost … never mutate, never
  supersede-by-version"; D3-D rejected ("Dangerous in a ledger").
- BF6/BF7: seed + draw indices persisted in `provenance`; no new top-level `*Rng`.

Issues:
- **Reversal+repost is the single-entry weak point made concrete.** "LedgerEntryReversal(C0) + LedgerEntryBooked(C1)"
  is only audit-correct if postings are balanced; on the current single-signed ledger, a reversal is an unbalanced
  signed row. This ADR is *correct* about the accounting intent but inherits ADR-0050's missing invariant.
- `estimatedOperatingCostTotal: Money` (exact) vs `estimatedOperatingCostBand: MoneyBand` (band) vs ledger
  `amountMinor` — the postable value is `Money`, but which field the ledger posts, and how a `MoneyBand` becomes
  deterministic `amountMinor`, is unstated (cross-ADR #3).
- Quality-profile enum drift (3 vs 4) shared with ADR-0070.

Recommendation: keep D1-D4 as chosen; on ratify, pin (a) the band→`amountMinor` collapse as a deterministic function,
(b) the reversal as a balanced pair (depends on ADR-0050 rec A). Confidence high.

---

## Cross-ADR issues (within C5)

1. **No accounting-identity invariant (load-bearing).** ADR-0050's single-signed `amountMinor` ledger has no
   double-entry / balanced-transfer guarantee, yet ADR-0058 (IFRS-15 accrual), ADR-0086 (reversal+repost) and
   ADR-0079 (creditor write-off) all assume corrections and a real balance sheet reconcile. Production immutable
   ledgers are double-entry for exactly this reason (TigerBeetle / Modern Treasury / Square; Perplexity 2026-06-08).
   → proposed superseding ADR.

2. **Investor ownership stated in three places, three ways.** ADR-0050 ("SP-only payment/entitlement events"),
   ADR-0058 ("CommercialPortfolio owns the Investor entitlement grant policy"), ADR-0063 (`InvestorEntitlement`
   aggregate + FSM in CommercialPortfolio). All *reconcilable* (CommercialPortfolio owns policy/entitlement; Club
   Management posts the one cash fact; payment behind a port) but no single canonical sentence. Ubiquitous-language
   drift → consolidate when ADR-0063 ratifies.

3. **`MoneyBand` vs `Money` vs `amountMinor` collapse rule undefined.** The settlement envelopes (ADR-0070/0086)
   carry both a band and an exact total; the ledger posts an integer minor-unit. The deterministic rule that turns a
   band into a postable integer (and keeps replay byte-identical) is unspecified — the precise place determinism +
   reconciliation can silently diverge. → pin in the ADR-0086 follow-up.

4. **Quality-profile enum drift (3 vs 4).** ADR-0070 `qualityProfileClass: backgroundFast|standard|expert` vs the
   match-engine four-profile model (`competitive-full|interactive-standard|background-detailed|background-fast`). One
   canonical enum + an explicit mapping prevents a settlement-routing bug.

5. **RNG notation drift.** `AtmosphereRng(...)`/`PoliticsRng(...)`/`TrustRng(...)` (ADR-0062) vs
   `WorldRng:scope:...:opcost:v1` (ADR-0086) vs `worldAiMgmt:structural:...` (ADR-0079). All legitimately sub-labels
   of the two world streams, but two notations. Cross-cluster (determinism) issue; flagged for the economy
   touch-points (variance on ledger-bound values must be unambiguously labelled).

6. **Insolvency model stated twice.** ADR-0050 "staged insolvency state" vs ADR-0079 `InsolvencyCase` FSM. Should be
   one enum/FSM referenced by both, with an explicit insolvency→ledger posting contract.

No harmful coupling found: the sole-writer rule + ACL discipline is consistently honoured across all seven ADRs.

---

## External research (targeted, weakest points)

- **Ledger model (ADR-0050 weakness):** Perplexity (2026-06-08) — production immutable/event-sourced ledgers
  (TigerBeetle, Modern Treasury, Square) are double-entry; single-entry cannot by itself guarantee
  `assets = liabilities + equity`, and reversal/replay correctness is much harder to verify mechanically without
  balanced transfers. Minimum robust invariant even for a game: store each event as a balanced transfer with explicit
  source/destination accounts and enforce debits = credits per event and in aggregate. IFRS-15 tie-in: separate
  cash / deferred-revenue(liability) / earned-revenue so projections can move amounts over time — which the C5
  design *names* but does not structurally enforce.
- **Investor web payment path (ADR-0063 weakness):** Perplexity (2026-06-08) — for a one-off digital consumable, MoR
  (Paddle / FastSpring; Lemon Squeezy now Stripe-owned) remains the lower-ops 2025-2026 choice for EU VAT/OSS +
  multi-jurisdiction US sales-tax nexus + refund/chargeback admin; Stripe-direct only if the studio acts as
  seller-of-record. 2024-2025 platform pressure on external-purchase / anti-steering makes a web checkout alongside
  IAP more common — the existing `PaymentProviderPort` already absorbs this; suggests a `web-mor | web-psp` split and
  an external-purchase-link disclosure surface. Vendor/refund/age-gate remain HITL/legal.

(Sources are Perplexity syntheses; treat vendor specifics as calibration, re-verify at implementation time per the
project's "latest stable, never assume" rule.)

---

## Proposed decisions (working titles; numbers assigned centrally)

1. **New superseding ADR — "Double-entry / balanced-transfer ledger posting invariant"** (supersedes ADR-0050;
   decision otherwise unchanged). Adds the posting-shape + accounting-identity invariant the cluster's corrections
   (ADR-0058 accrual, ADR-0086 reversal+repost, ADR-0079 creditor write-off) silently depend on. Options A
   (balanced double-entry), B (single-entry + enforced projection identity), C (status quo — reject). Rec A.
   Confidence high (gap real); A/B is Nico's.

2. **New amendment ADR — "Investor entitlement single-source-of-truth + web-provider split"** (amends/ratifies
   ADR-0063; references ADR-0050/0058). One canonical ownership sentence (CommercialPortfolio owns
   policy+entitlement FSM; Club Management posts the one cash fact; payment behind `PaymentProviderPort`); split
   `web-psp` → `web-mor | web-psp`; note the anti-steering external-link surface. Vendor/refund/age-gate stay HITL.
   Confidence medium.

3. **New follow-up ADR (or ADR-0086 ratification amendment) — "Settlement value collapse + quality-profile enum
   reconciliation"**: deterministic `MoneyBand → amountMinor` collapse rule; single canonical quality-profile enum
   with an explicit 4→settlement mapping; insolvency→ledger posting contract (creditor write-off / wage-cap delta /
   fire-sale receipt) referencing ADR-0050/0079 as balanced entries. Confidence high.

No new GD proposed — the gaps are architectural/contractual, not game-design.
