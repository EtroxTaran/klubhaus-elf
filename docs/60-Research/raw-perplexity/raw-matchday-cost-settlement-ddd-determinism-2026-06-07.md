---
title: "Raw — DDD/event-sourcing: collapsing an event storm + estimate-vs-detailed reconciliation (FMX-92)"
status: raw
tags: [research, raw, perplexity, ddd, event-sourcing, cqrs, determinism, ledger, idempotency, reversal, fmx-92]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-92
related:
  - [[../background-fast-cost-settlement-2026-06-07]]
---

# Raw capture — DDD / event-sourcing / determinism (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on collapsing a fine-grained event storm into a
single read-fact and reconciling a coarse estimate later replaced by a detailed computation in a
deterministic, append-only, sole-writer ledger. Synthesis in
[[../background-fast-cost-settlement-2026-06-07]].

## Prompt (summary)

DDD/event-sourcing: a football sim where foreground matches emit ~19 fine-grained per-cost domain
events consumed by a Commercial context that settles, and a Club-Management context that is the
SOLE ledger writer (via ACL/Customer-Supplier). For hundreds of background-fast fixtures the event
storm is too chatty and bloats the store; background-fast should emit ONE aggregated
`MatchdayOperatingCostSummary`. (1) best-practice patterns for a collapsed/aggregated fact vs
fine-grained stream; (2) determinism: seeded RNG sub-stream vs pure function; (3) supersede vs
delta-adjust vs reversal+repost reconciliation in an append-only ledger; (4) idempotency keys for
summary + ledger posting and how they change on a detailed-resim upgrade.

## Answer (verbatim)

You are describing two different *models of reality* for the same thing: foreground = "what
actually happened" at steward/security/pitch level (fine-grained ES); background = "what the
business is happy to treat as having happened" (a single settled number that is *contractually
binding* for the ledger). That distinction drives the right patterns.

### 1. Collapsing an event storm into a single fact

You don't want to "compress" a fine-grained stream; you want a *different* event in a *different*
model of the domain. In the Match/Commercial context: foreground = fine-grained domain events
(`StewardingDeployed`, `SecurityDeployed`, `PitchRecoveryBooked`); background = a single
**coarse-grained domain event** such as `MatchdayOperatingCostCalculated` / `MatchdayOperatingCostSettled`.
In the Club-Management (Ledger) context: receive an **integration event** (`MatchdayOperatingCostSettled`)
and turn it into one or more **accounting entries** (`LedgerEntryBooked`) — the immutable-event-log-as-ledger
pattern Fowler and Microsoft describe.[5][6] Do not think of the summary as a *snapshot* of an
underlying ES stream; it is its own **business fact**: "the club has agreed to treat this fixture
as costing X." That *is* the business reality for background matches.

Names that fit DDD/ES practice: "coarse-grained domain event" / "summary domain event" in Match;
"settlement event" / "OperatingCostSettled" as the integration event; the read-model built off it
may be `MatchdayOperatingCostSummary` projection, but the *stored* thing is a domain/integration
event, not a projection.

Trade-offs. Use **fine-grained events** when you need granular invariants inside an aggregate,
multiple projections where individual costs matter, or later re-interpretation of historic events
under new costing rules.[5] Use **coarse summary events** when the business accepts that only the
aggregate is economically relevant for that activity class, you won't re-derive itemised history,
and you need throughput/store-compaction (hundreds of fixtures/matchday) and simple fast replay,
with the fine-grained sim being purely internal/ephemeral. In your case, emitting **one event for
fast fixtures is exactly the right call** — those fixtures never enter the detailed model unless
explicitly "upgraded." To keep options open, treat the coarse event as the primary source of truth
for background fixtures and keep a separate internal log of the cheap inputs (fixture, risk band,
attendance band, RNG seed if used) so you can deterministically regenerate detail on upgrade.

### 2. Determinism and randomness

Two independent constraints: domain semantics (is randomness part of domain behaviour?) and
technical requirement (deterministic, replay-safe). You can have both *if* any randomness is
**seeded** and **treated as data**.

- If variation is a **designed feature** ("operating costs are noisy within a band to reflect
  uncertainty"), model it explicitly: store a **fixture-level seed** (or the draws as events,
  `RandomSeedAllocated`/`RandomDrawUsed`); the sim becomes a pure function of
  `(fixture facts, bands, seed, draws)`; replays are bit-identical given a stable RNG and the same
  consumption order.
- If variation is *not* a business requirement and the goal is reproducible economics: make
  `OperatingCost = f(fixtureFacts, riskBand, attendanceBand)` a **pure function with no
  randomness**; persist only the inputs and the settled cost (closer to a traditional accounting
  system).

Given the emphasis on replay safety and ledger semantics, the default should be **no randomness in
anything that hits the ledger** unless there is a clear domain-level reason to model stochasticity.
If you want "fog of war" for the player's *perception*, make it a separate read-model/UI-level
concern that does not affect booked costs. So: for ledger-relevant `MatchdayOperatingCostSettled`,
use a pure function of deterministic inputs; if background sim uses RNG to approximate sub-costs,
treat the seed as part of the fixture's **simulation input state** (persist it), but ideally still
compute a deterministic cost from deterministic bands so the ledger event itself does not encode
randomness.

### 3. Reconciling cheap settlement vs detailed resim in an immutable ledger

Classic **accounting patterns** on an event-sourced ledger: *Reversals* (full offset),
*Adjustments* (deltas), *Superseding versions* (logical replacement). In an immutable store you
never mutate/delete; you only add events and adjust projections.[5][6] Care about auditability,
semantics (current truth), idempotency, simplicity.

**3a. Full reversal + repost.** Cheap settlement posts `LedgerEntryBooked` for C0; later detailed
sim computes C1; emit `LedgerEntryReversal` exactly negating C0 + `LedgerEntryBooked` for C1.
*Pros:* matches real accounting (reversal-entry pattern); very clear audit trail; reporting is
just `sum(amount)` (no version filtering); fits ES well (corrections are subsequent facts).
*Cons:* extra events (2 per upgrade); "current best per fixture" queries must accept multiple
pairs if re-upgraded. For a financial ledger, usually the **safest and least surprising**.

**3b. Delta / adjustment posting.** Post Δ = C1 − C0 as one `LedgerEntryAdjustment`.
*Pros:* fewer events; balance = `sum(originals + adjustments)`. *Cons:* less explicit (C1 inferred
via C0 + Δ); chains of deltas get error-prone; harder to answer "what did we believe at each
point?" Use when you care about balances not believed-value-at-each-step, and adjustments are small
and infrequent.

**3c. Supersede-by-version.** Emit multiple `MatchdayOperatingCostSettled` with increasing
versions; projections ignore all but the latest per fixture. *Pros:* matches an event-version
concept; last-write-wins per fixture is easy. *Cons:* **dangerous in a ledger** — a raw
`sum(amount)` overstates totals unless you join against latest version; multiple consumers must
implement version rules consistently to avoid double-counting; weakens "every event is a
business-relevant fact." For a true accounting ledger this is usually **worse** than reversal+repost
or deltas; better suited to non-financial ES streams.

**Recommendation.** In a Club-Management ledger that is sole-writer and append-only: model
background settlement as a legal booking even if cheap; on "upgrade" to detailed sim, treat it as
an **accounting correction** — **preferred: reversal + repost** (classic, easiest for auditors and
tooling); alternative: delta adjustment if double-events are too noisy and you mostly care about
final balances. Given the emphasis on idempotency and determinism, reversal+repost has the extra
benefit that each event is conceptually atomic and self-contained (a reversal completely undoes a
prior event), making idempotent handling straightforward.

### 4. Idempotency keys for summary vs upgraded settlement

Two layers: the Match/Commercial side emitting settlement events, and the Ledger side posting
entries. Want re-delivery/replay safe (no double postings) and a clean cheap→detailed story. Core
idea: idempotent consumers keep a `(IdempotencyKey, ConsumerName) → handled-at-position` table and
discard/replace on repeat. Use **one idempotency key per semantic operation** that should happen
once for that consumer.

Let `FixtureId` identify the fixture; `SettlementKind ∈ {Cheap, Detailed}`; `SettlementVersion` a
monotone integer per fixture (0 cheap, 1,2… detailed). Match/Commercial side: cheap settlement key
= `SettlementId` or `(FixtureId, SettlementVersion=0)`; detailed = a different operation
(`SettlementVersion=1`), or the same key `FixtureId+"Detailed"` if you want re-runnable-but-
idempotent. Ledger side, reversal+repost: initial cheap booking key
`("FixtureCostCheapBooked", FixtureId)`; the later upgrade is conceptually one operation
("upgrade fixture cost") keyed `("FixtureCostUpgradedToDetailed", FixtureId)`, internally emitting
`LedgerEntryReversal` for C0 + `LedgerEntryBooked` for C1; re-sending the upgrade with the same key
emits nothing further. Delta variant: `("FixtureCostBooked", FixtureId)` then
`("FixtureCostAdjustedToDetailed", FixtureId)`; if multiple upgrades, add a version
`("FixtureCostUpgrade", FixtureId, SettlementVersion)`. **Do not reuse the same key for cheap and
detailed** — they are semantically different postings.

How the key changes on upgrade: the read-model "current settlement per fixture" keys on
`(FixtureId)` and stores `CurrentSettlementKind/Amount/Version`, overwriting on upgrade regardless
of reversal-vs-delta. The **ledger posting idempotency key should change** between cheap and
detailed because you want two distinct operations in history ("initially booked a cheap estimate" /
"corrected it later"). So the idempotency key is **per operation, not per final state**; a detailed
upgrade is a new operation → new key, with internal logic that corrects the previous operation
without double-posting.

### End-to-end design (as offered)

1. Background sim computes `C0 = CostFunction(fixtureFacts, riskBand, attendanceBand)`; Commercial
   emits `MatchdayOperatingCostCalculated {FixtureId, C0, Kind="Cheap"}`; integration event
   `MatchdayOperatingCostSettled {FixtureId, C0, Kind="Cheap"}`, idempotency key
   `("FixtureCostSettlement", FixtureId, Kind="Cheap")`.
2. Ledger: if key unseen, `LedgerEntryBooked` debit Operating Expenses / credit Cash-Payables for
   C0, persist idempotency record; if seen, no-op.
3. On-demand detailed re-sim → itemised costs + better total C1; Commercial emits
   `MatchdayOperatingCostCalculated {C1, Kind="Detailed"}`; integration event
   `MatchdayOperatingCostUpgraded {FixtureId, C0, C1}`, key `("FixtureCostSettlementUpgrade", FixtureId)`.
4. Ledger consumes upgrade: **Option A (recommended)** look up current booked C0, emit
   `LedgerEntryReversal` for C0 + `LedgerEntryBooked` for C1, mark key processed (re-delivery →
   no-op). **Option B** post Δ = C1 − C0.
5. Determinism: all costs are functions of persisted inputs, no hidden randomness; replays
   re-derive and re-publish in order; idempotency keys + projections ensure no double-post. If you
   later want randomness (e.g. crowd disturbances affecting steward cost), make it explicit domain
   state (store seed/draws) so the sim stays deterministic and the ledger still sees deterministic
   results.

## Citations (as returned)

- [1] https://falberthen.github.io/posts/ecommerceddd-pt3/
- [2] https://sevalla.com/blog/event-driven-architecture-ddd/
- [3] https://ricofritzsche.me/cqrs-event-sourcing-projections/
- [4] https://www.youtube.com/watch?v=0axq4CvXQc8
- [5] https://martinfowler.com/eaaDev/EventSourcing.html
- [6] https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing
- [7] https://cdn2.hubspot.net/hubfs/6746794/whitepaper%20DDD,%20CQRS%20and%20Event%20Sourcing%20Explained.pdf
- [8] https://news.ycombinator.com/item?id=19072850

> **Note (synthesis):** Nico's D4 = C overrides the research's pure-function *default*: variance is
> adopted as a designed feature. Per the research's own §2, this is legitimate **iff** the seed +
> draws are persisted as part of the fixture's settlement input state so replays stay bit-identical
> — which ADR-0086 mandates (seed + draw indices in `provenance`).
