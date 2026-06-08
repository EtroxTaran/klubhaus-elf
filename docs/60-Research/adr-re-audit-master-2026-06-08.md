---
title: ADR Re-Audit — Master Report (2026-06-08)
status: draft
binding: false
tags: [research, adr, gddr, re-audit, audit, backlog, governance, ddd, decision-log]
created: 2026-06-08
updated: 2026-06-08
type: research
linear: [FMX-105]
related:
  - "[[adr-re-audit-c1-2026-06-08]]"
  - "[[adr-re-audit-c2-2026-06-08]]"
  - "[[adr-re-audit-c3-2026-06-08]]"
  - "[[adr-re-audit-c4-2026-06-08]]"
  - "[[adr-re-audit-c5-2026-06-08]]"
  - "[[adr-re-audit-c6-2026-06-08]]"
  - "[[adr-re-audit-c7-2026-06-08]]"
  - "[[adr-re-audit-c8-2026-06-08]]"
  - "[[adr-re-audit-c9-2026-06-08]]"
  - "[[domain-model-audit-and-backlog-2026-06-02]]"
  - "[[../10-Architecture/bounded-context-map]]"
  - "[[../00-Index/Decision-Log]]"
  - "[[../00-Index/Current-State]]"
  - "[[../90-Meta/collaboration-and-decision-protocol]]"
  - "[[../90-Meta/vault-governance]]"
---

# ADR Re-Audit — Master Report (2026-06-08)

> **Status: draft / proposal — nothing here is ratified.** This is the synthesis
> note for a read-only re-audit of the full ADR/GDDR portfolio (80 ADRs to ADR-0091,
> 36 GDDRs, the arc42 set, and the `60-Research` corpus). It builds on, and is read
> with, the nine per-cluster notes ([[adr-re-audit-c1-2026-06-08]] … [[adr-re-audit-c9-2026-06-08]])
> and the earlier [[domain-model-audit-and-backlog-2026-06-02|Domain-Model Audit & Backlog]].
> Every superseding ADR, new ADR, GDDR and Decision-Log line below is a **proposal
> pending Nico's ask-first decision gate** (see [[../90-Meta/collaboration-and-decision-protocol]]).
> **No existing ADR/GDDR/arc42/research file was edited or overwritten.** Supersession
> is expressed only through the *new* draft ADRs proposed here (with `Supersedes:` in
> frontmatter); the old files are left untouched per the read-only rule. The allocated
> ADR/GD numbers (ADR-0092…ADR-0104, GD-0037…GD-0040) are reserved for those drafts.

> **Method.** Nine cluster lanes re-read the portfolio against the ground-truth
> constraints (offline-first PWA — ADR-0002; LLM out of authoritative state — ADR-0030;
> Dokploy deploy — ADR-0044; narrow cloud-sync — ADR-0090), produced per-cluster
> findings, then a cross-cluster reconciliation pass merged contradictions, de-duplicated
> overlapping proposals into a minimal consolidated ADR/GD set, and ordered the open
> decisions. External claims (Postgres/SurrealDB maturity, i18n bundle/SSR, native↔WASM
> float determinism, OWASP KDF guidance, schema-per-tenant scaling) were grounded via
> Perplexity / context7 / Ref on the weakest decisions only.

---

## A. Executive assessment

**Overall health: strong and converging.** The 80-ADR / 36-GDDR portfolio is
**structurally healthy**. Bounded-context placement decisions across the People/Players
(C6), Competition/League (C7) and Narrative/Media (C8) clusters are uniformly sound;
RNG/determinism discipline is consistent (the locked-9 streams, sub-label reuse, no
top-level-stream proliferation); the sole-ledger-writer / Customer-Supplier / ACL
boundaries hold across the economy cluster (C5); and the supersession chain is mostly
clean (ADR-0001→0021, 0004→0027, 0013→0028, 0003→0049 are banner-and-frontmatter
correct). The ground-truth constraints are respected throughout — nothing in the
portfolio treats the product as a server app, leaks LLM into authoritative state, or
widens the cloud-sync scope.

**The portfolio's problems are overwhelmingly EDITORIAL / REFERENCE-INTEGRITY, not
architectural** — with a small, clearly-bounded set of genuine load-bearing content
gaps. This distinction is the report's central finding: the cheapest, highest-leverage
fixes are governance/housekeeping, and they unblock confident ratification of everything
downstream.

**Top problems (priority order):**

1. **Vault-wide status / lifecycle drift.** Many ADRs carry body `Accepted` +
   `binding:true` while the 2026-05-27 reopen reset everything to `draft`, frontmatter
   says `draft`, and the Decision-Log mirrors the stale `accepted`. Three conflicting
   truths per file. This is one *governance* problem, not N ADR problems, and a single
   rule resolves it portfolio-wide (see [[#F. Proposed draft ADRs|ADR-0092]]).
2. **Stale cross-references propagating from supersessions.** The ADR-0013→0028 outbox
   citation rot across ADR-0019/0014/0011/0018 and bounded-context-map §3; the
   ADR-0010→0019 renumber residue inside ADR-0018; and the `audit_log` table living in
   three conflicting positions (ADR-0004/0027 list it, ADR-0028 deletes it, ADR-0091
   wants a separate security log).
3. **Context-count drift.** Binding ADR-0019 says "eleven", the map says "nineteen",
   ADR-0089 proposes 28. The binding *style*-ADR is the stale one; the map (reconciled
   by ADR-0089) should be the sole count source.
4. **Genuine content gaps worth real ADRs.** The i18n stack is contradicted by its own
   *closed* downstream research (ADR-0006 stale); the accounting ledger has no
   double-entry/balance-identity invariant despite four downstream corrections assuming
   one; the match-engine native↔WASM determinism contract is under-specified for an
   offline-verify-locally product; and several offline/SW mechanics live only inside the
   superseded ADR-0002.

**Top opportunities:**

- **One governance sweep resolves problems 1–3 across the whole vault at once**
  ([[#F. Proposed draft ADRs|ADR-0092]]). This is the single highest-leverage move.
- **The data-layer axis is already coherently resolved** (Postgres = system-of-record,
  SurrealDB additive/deferred) and should **not** be relitigated — see [[#D. Data-layer axis — Postgres vs SurrealDB|§D]].
- **Ratifying the async-coordination foundation as one wave** (ADR-0012/0014 promote,
  ADR-0088/0089 land — [[#F. Proposed draft ADRs|ADR-0093]]) unblocks everything resting
  on parked dependencies.

**Confidence notes.** High confidence on the structural assessment, the governance
fixes, and the data-layer record decision (Postgres-as-record, no SurrealDB 2.x adoption
now). Medium confidence on the schema-per-save scale envelope (external scaling band is
directional, not project-measured) and on whether the additive SurrealDB seam is worth
*keeping reserved* vs *removing for MVP simplicity* — that last one is a scope call for
Nico, not a technical verdict. Lower confidence (and explicitly deferred) on the
product/scope GDDRs (offline narration tier, context-portfolio trim).

---

## B. Cluster index

Each cluster note carries the full per-decision findings; this master report draws from
and reconciles them. Read alongside [[domain-model-audit-and-backlog-2026-06-02]].

| Cluster | Scope | Note |
|---|---|---|
| C1 | Foundation / Platform / UI / i18n | [[adr-re-audit-c1-2026-06-08]] |
| C2 | Data / Persistence / Save / Sync | [[adr-re-audit-c2-2026-06-08]] |
| C3 | Match Engine / Simulation / Presentation | [[adr-re-audit-c3-2026-06-08]] |
| C4 | Architecture Style / Modularity / Eventing / Realtime | [[adr-re-audit-c4-2026-06-08]] |
| C5 | Economy / Finance / Commercial / Investor | [[adr-re-audit-c5-2026-06-08]] |
| C6 | People / Players / Staff / Manager / Youth / Scouting | [[adr-re-audit-c6-2026-06-08]] |
| C7 | Competition / League / Regulations / Fixtures / National | [[adr-re-audit-c7-2026-06-08]] |
| C8 | Narrative / Media / AI-World / Notifications / Stats | [[adr-re-audit-c8-2026-06-08]] |
| C9 | Environment / Cross-cutting / Ops / Governance / Security | [[adr-re-audit-c9-2026-06-08]] |

---

## C. Cross-cutting contradictions

These are the reconciliation-confirmed contradictions that span clusters. Each maps to a
proposed draft ADR in [[#F. Proposed draft ADRs|§F]]; the resolution lives there, the
contradiction is recorded here.

### C-1 — `audit_log` / audit-trail ownership has three conflicting positions
ADR-0004 (historical) and ADR-0027 §1+§4 (current) list a platform-DB `audit_log` table;
ADR-0028 §7 deletes it ("the outbox **is** the audit trail"); ADR-0091 (proposed) wants a
**separate** append-only, hash-chained, signed *security* log. The names "domain audit
events" (ADR-0017/0028) and "security audit log" (ADR-0091) are near-identical, inviting
an unsafe future merge that would break ADR-0091's forensic boundary.
**Resolution:** [[#F. Proposed draft ADRs|ADR-0092]] (canonicalise) + [[#F. Proposed draft ADRs|ADR-0097]]
(drop the platform `audit_log`; outbox = domain trail, ADR-0091 = security trail) + an
08-Crosscutting disambiguation note. Involves ADR-0004 / ADR-0027 / ADR-0028 / ADR-0091 / ADR-0017.

### C-2 — Vault-wide status / lifecycle drift
Body `Accepted` + `binding:true` vs frontmatter `draft` vs Decision-Log stale `accepted`,
confirmed in ADR-0011/0019/0023/0027/0028 (C2/C4), ADR-0051/0053/0061 (C6),
ADR-0009/0017/0007/0043 (C8/C9). Implementers/agents cannot read an ADR's real binding
state. **Resolution:** [[#F. Proposed draft ADRs|ADR-0092]] — frontmatter is canonical,
body `Accepted` demotes to dated history, standard reopen banner; never edit each ADR
individually. Highest-leverage portfolio fix.

### C-3 — ADR-0013→0028 outbox citation rot
The superseded SurrealDB+Redis outbox ADR (0013) is still cited as the *live* outbox
source by ADR-0019/0014/0011/0018 and bounded-context-map §3; only ADR-0088 correctly
redirects to ADR-0028. **Resolution:** [[#F. Proposed draft ADRs|ADR-0092]]
reference-integrity sweep (redirect all outbox citations to ADR-0028; fix ADR-0018's two
ADR-0010→0019 renumber-residue references; retire ADR-0019's hardcoded "eleven"). Pure
reference integrity, no architectural change.

### C-4 — Determinism regime: unconditional byte-equality vs statistical envelope
ADR-0026/0067 mandate unconditional byte-equality; ADR-0049 introduces a
"statistical-envelope where event equality is intentionally versioned" + "outcome-first
for background-fast" with **no per-quality-profile precedence rule**. Compounded by
ADR-0003 still saying "8 RNG streams" (vs canonical locked-9) and native↔WASM float
equality not being guaranteed. **Resolution:** [[#F. Proposed draft ADRs|ADR-0096]] —
integer/fixed-point numeric surface mandatory for replay-bearing computation;
per-quality-profile precedence rule (byte-identical for competitive-full /
interactive-standard, statistical-envelope only for background-fast); ADR-0003
carry-forward appendix restating 9 streams.

### C-5 — Spectator/watch-party substrate vs persisted-snapshot removal
ADR-0015 persists "snapshot per virtual minute", but binding ADR-0026 +
determinism-and-replay made resim-from-kickoff the **only** replay model with **no**
persisted snapshots (MatchFrame derived-never-persisted). ADR-0087's pause-vote
streaming and ADR-0049's replay cursors assume a coherent event-log spectator feed that
ADR-0015 doesn't provide. **Resolution:** [[#F. Proposed draft ADRs|ADR-0099]] —
event-log-only spectator model (committed event/spatial log + replay cursor, delay at
delivery, no persisted snapshots), online-only within ADR-0090's narrow sync scope.

### C-6 — Quality-profile enum drift across clusters
Match-engine four-profile model (`competitive-full | interactive-standard |
background-detailed | background-fast`, ADR-0026/0049/match.md) vs the 3-valued
`qualityProfileClass` (`backgroundFast | standard | expert`) in economy settlement
contracts (ADR-0070/0086). Same concept, two enums — a settlement-routing-bug risk.
**Resolution:** [[#F. Proposed draft ADRs|ADR-0101]] — one shared vocabulary owned by the
engine port (EngineCapabilities), referenced not re-declared, with an explicit
4→settlement mapping.

### C-7 — Story-thread ownership / naming collision
ADR-0076 uses `storyThreadId` as Narrative's grouping/supersession key; ADR-0085 makes
`NarrativeThread` a first-class aggregate owned by Media Ecology under the same name/key,
with no stated origination owner — DDD model-leakage. **Resolution:**
[[#F. Proposed draft ADRs|ADR-0100]] — per-context aggregate names (Narrative owns
`StoryThread`; Media Ecology renames to `CoverageThread`); `storyThreadId` is a
correlation key only.

---

## D. Data-layer axis — Postgres vs SurrealDB

**This is COHERENTLY RESOLVED at the system-of-record level and should not be
relitigated.** It is open only at the *future-additive* level. See
[[adr-re-audit-c2-2026-06-08]] for the per-decision detail.

**Settled state (supersession chain is clean):**

- ADR-0001 (SurrealDB-era stack) → **superseded by ADR-0021**: Postgres + Drizzle as
  system-of-record, SurrealDB deferred/additive behind ADR-0023 interfaces.
- ADR-0004 (SurrealDB data model) → **superseded by ADR-0027**: Postgres
  schema-per-save, Drizzle source of truth.
- ADR-0013 (SurrealDB+Redis outbox) → **superseded by ADR-0028**: Postgres transactional
  outbox.
- ADR-0043 confines SurrealDB to an optional additive graph/live **projection** for
  notification inbox views, behind an anti-corruption adapter that "cannot replace
  Postgres notification truth".
- The foundational research note `60-Research/surrealdb-schema-patterns.md` is **itself
  `status:superseded`, `superseded_by: ADR-0027`** — the SurrealDB schema corpus is
  historical, not a live competing option.

**External version reality (Perplexity, 2026-06-08):** PostgreSQL latest stable is
**18.x** (mature, the standard primary datastore). SurrealDB's production-stable line is
**1.x**; **2.x is preview/early-adopter and not broadly production-mature in 2026**, even
single-node. This decisively backs Postgres-as-system-of-record for an offline-first,
money-critical, deterministic, event-sourced product: betting irreversible
financial/match state on a not-yet-production-mature 2.x store would violate ADR-0021's
own "refuse risk only where it lands on irreversible, money-critical state" rationale.

**The genuinely open sub-question — does SurrealDB earn any additive role, and where:**

- **(A — RECOMMENDED)** Keep Postgres 18.x as sole system-of-record; admit SurrealDB
  **only** as an optional, replaceable, non-authoritative projection (notification
  graph/live views per ADR-0043, never reconciled-against for correctness), pinned to
  the stable 1.x line behind the existing interface. Re-evaluate 2.x only when it reaches
  production maturity **and** a concrete graph/live need is proven.
- **(B)** Drop SurrealDB entirely for MVP; use Postgres + `LISTEN`/`NOTIFY` + the existing
  RealtimeTransport (SSE/Centrifugo) for live projections — simplest ops, one datastore,
  zero maturity risk; defer any graph store to a future ADR if a real graph workload
  emerges.
- **(C — REJECTED)** Adopt SurrealDB as a co-primary for graph-heavy contexts (rivalry,
  relationships) — doubles operational/migration/backup surface on a single Dokploy node,
  adds a not-production-mature dependency, and there is no current workload that Postgres
  recursive CTEs / a graph extension cannot serve.

**The real open decision is A-vs-B** (keep the additive seam reserved, or remove it for
MVP simplicity), **not** Postgres-vs-SurrealDB-as-record.

**Adjacent and more pressing than the substrate question — schema-per-save scale
envelope.** ADR-0027's schema-per-save tenancy envelope is **unbounded**. External
research (Perplexity, 2026-06-08) puts the comfort band at hundreds of schemas
(~100–300), with pain in the high-hundreds-to-low-thousands and expert-only territory
above several thousand (migration fan-out, `pg_dump` enumeration, `pg_class`/
`pg_attribute` catalog bloat, planner overhead). The project's soft-10/hard-50
saves-per-user math reaches **hundreds of thousands** of live schemas — well past the
band. This needs a documented schema ceiling + cold/archive fallback, addressed in
[[#F. Proposed draft ADRs|ADR-0097]].

**Recommendation.** Option **A** (Postgres sole system-of-record; SurrealDB as a reserved
optional non-authoritative 1.x projection), and **separately** bound the schema-per-save
envelope (ADR-0097). **Confidence:** high on Postgres-as-record and on not adopting
SurrealDB 2.x now; medium on the A-vs-B additive-seam call (Nico's scope decision).

---

## E. Ubiquitous-language issues

Naming/vocabulary collisions surfaced by the reconciliation pass. Most fold into the
proposed ADRs in [[#F. Proposed draft ADRs|§F]]; a few are cosmetic.

| # | Issue | Canonical answer | Folds into |
|---|---|---|---|
| E-1 | **Context COUNT drift**: ADR-0019 "eleven", map "nineteen", ADR-0089 "28", per-ADR "the 20th". | The **map** (reconciled by ADR-0089) is the sole count source; the style-ADR owns style only and is count-agnostic. | ADR-0092 / ADR-0093 |
| E-2 | **RNG stream-count drift**: ADR-0003 §1 "8 streams" vs canonical locked-9 (determinism-and-replay §2.2, ADR-0008/0018/0086/0087/0088). | Restate "9" in the ADR-0049-successor carry-forward appendix; never edit ADR-0003. | ADR-0096 |
| E-3 | **"audit log" overloaded**: domain audit events (outbox, ADR-0017/0028) vs platform `audit_log` table (ADR-0027) vs hash-chained security log (ADR-0091). | Three distinct things; rename/disambiguate so they cannot be merged; drop the platform table. | ADR-0092 / ADR-0097 |
| E-4 | **Quality-profile enum**: 4-profile (engine/frame) vs 3-valued `qualityProfileClass` (settlement, ADR-0070/0086). | One canonical enum owned by EngineCapabilities; referenced everywhere; explicit 4→settlement mapping. | ADR-0101 |
| E-5 | **Story-thread concept**: `storyThreadId` correlation key (Narrative, ADR-0076) vs `NarrativeThread` aggregate (Media Ecology, ADR-0085) under the same name. | Per-context names (`StoryThread` vs `CoverageThread`); shared correlation ID only. | ADR-0100 |
| E-6 | **Investor ownership stated three ways**: ADR-0050 (SP-only events), ADR-0058 (CommercialPortfolio owns entitlement grant policy), ADR-0063 (InvestorEntitlement aggregate+FSM). | One sentence: CommercialPortfolio owns policy + entitlement FSM; Club Management posts the one cash fact; payment behind PaymentProviderPort. | ADR-0095 / ADR-0101 |
| E-7 | **Loan buy-clause option-letter drift**: ADR-0075 body/HITL "Option + obligation-to-buy" vs Decision-Log "D2=B". Substance agrees, letter does not. | Reconcile the A/B/C label in the Decision-Log line. | §H (Decision-Log) |
| E-8 | **Insolvency model stated twice**: ADR-0050 "staged insolvency state" vs ADR-0079 InsolvencyCase FSM. | One shared enum/FSM referenced by both. | ADR-0095 / ADR-0101 |
| E-9 | **MoneyBand vs Money vs amountMinor**: settlement envelopes carry a band AND an exact total; ledger posts integer minor units; no deterministic band→amountMinor collapse rule. | Deterministic, replay-byte-identical collapse function (determinism hazard, not just naming). | ADR-0101 |
| E-10 | **RNG sub-label NOTATION drift (cosmetic)**: `AtmosphereRng(saveId,clubId,week)` (ADR-0062) vs `WorldRng:scope:…:opcost:v1` (ADR-0086) vs `worldAiMgmt:structural:…` (ADR-0079). | All valid sub-labels of the two world streams; unify notation in the determinism doc. | ADR-0096 (note) |
| E-11 | **ADR-0010→0019 renumber residue**: ADR-0018 cites "ADR-0010" twice meaning the modular-monolith ADR (now 0019); the 0010 slot is the design-system ADR. | Redirect the two references to ADR-0019. | ADR-0092 |

---

## F. Proposed draft ADRs

Allocated numbers ADR-0092…ADR-0104. Each row is a **proposed** draft for Nico to ratify;
nothing is accepted. The "Draft file" column will link the draft ADR once written (the
drafts are separate work items — this master report creates only itself).

| ADR | Working title | Supersedes | Recommendation | Conf. | Draft file |
|---|---|---|---|---|---|
| **ADR-0092** | Vault governance: status/lifecycle single-source-of-truth + reference-integrity sweep (outbox 0013→0028, renumber residue, context-count, `audit_log` canonicalisation) | — | **Option A**: one governance rule (frontmatter canonical, body `Accepted` → dated history, standard reopen banner) + a single reference-integrity sweep folded into the ADR-0089 apply-PR. Pure editorial, zero architectural change; resolves the three highest-leverage cross-cluster problems at once. | high | `[[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]]` |
| **ADR-0093** | Joint ratification wave: promote async-coordination foundation (ADR-0012 cadence + ADR-0014 state machines) and land ADR-0088 + ADR-0089 | — | **Option A**: ratify all four together; make the `WatchPartyScheduled`/`MatchdayOpened` `contract_version` bump explicit at ratify; redirect ADR-0012/0014's stale 0013→0028 citations in the promotion note. | high | `[[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]]` |
| **ADR-0094** | i18n stack & locale scope (supersedes ADR-0006) | ADR-0006 | **Option A**: Paraglide JS + format.js + self-hosted Tolgee, MVP locales DE/EN/FR/ES/IT — pending validation that ICU-MF1 (flected club names / slavic plurals) is met via Paraglide's plugin story. ~70% smaller offline bundle, native TanStack Start SSR. | high | `[[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]` |
| **ADR-0095** | Double-entry / balanced-transfer ledger posting invariant (supersedes ADR-0050) | ADR-0050 | **Option A**: balanced double-entry postings (every `FinanceLedgerEntryPosted` ≥2 lines summing to zero, `accountCode` per line; reversal = balanced offsetting pair) + a LedgerEntry invariant table + assets=liabilities+equity identity check. Leaves the ADR-0050 boundary unchanged; A/B is Nico's call. | high | `[[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]]` |
| **ADR-0096** | Match-engine cross-runtime determinism & numeric-surface contract (finalises ADR-0049, carries ADR-0003 forward) | ADR-0049, ADR-0003 | **Option A**: mandate integer/fixed-point numeric surface for all replay-bearing computation; per-quality-profile precedence (byte-identical for competitive-full/interactive-standard, statistical-envelope only for background-fast); ADR-0003 carry-forward appendix restating 9 streams. Spike gets owner/deadline + MVP fallback (TS-first). | high | `[[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]]` |
| **ADR-0097** | PostgreSQL data-model scale envelope + audit-table canonicalisation (supersedes ADR-0027, amends ADR-0028) | ADR-0027, ADR-0028 | **Option A**: keep schema-per-save; add a documented per-node schema ceiling + cold/archive fallback + pg_dump/PITR-at-scale note; **drop** the platform `audit_log` (outbox = domain trail, ADR-0091 = security trail). Pin Postgres 18.x at implementation. | medium | `[[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]` |
| **ADR-0098** | Save-format KDF upgrade (Argon2id passphrase path) + active-pack refs in SavePayload (supersedes ADR-0005) | ADR-0005 | **Option A**: keep PBKDF2 for the high-entropy device-backup key; move the portable-export *passphrase* path to Argon2id (WASM) behind the existing `kdfAlgo` envelope field; add `activePacks` refs + a missing-pack import path to SavePayload. | medium | `[[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]]` |
| **ADR-0099** | Spectator / watch-party streaming over the committed event log (supersedes ADR-0015) | ADR-0015 | **Option A**: event-log-only streaming — consume committed event/spatial log + replay cursor (ADR-0049), delay applied at delivery, no persisted snapshots; align status with Decision-Log; online-only within ADR-0090's narrow sync scope. Sequence before/with ADR-0087. | medium | `[[../10-Architecture/09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]` |
| **ADR-0100** | Story-thread ownership & cross-context naming (`StoryThread` vs `CoverageThread`; `storyThreadId` as correlation key) — supersedes thread-ownership portions of ADR-0076/0085 | ADR-0076, ADR-0085 | **Option A**: Narrative owns thread origination (`StoryThread`); Media Ecology renames its aggregate to `CoverageThread`; `storyThreadId` is correlation-only. Draw the X2 media-publication seam; cross-ref `WorldAiMgmtRng:media:*` to ADR-0071. Supersede **only** the thread-ownership portions. | medium | `[[../10-Architecture/09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]` |
| **ADR-0101** | Settlement value-collapse + quality-profile enum reconciliation + insolvency-to-ledger posting contract | — | **Option A**: one follow-up ADR pinning a deterministic `MoneyBand→amountMinor` collapse (replay byte-identical), a single canonical quality-profile enum + 4→settlement mapping, an insolvency→ledger posting contract (balanced if double-entry adopted), and a shared insolvency enum referenced by ADR-0050 + ADR-0079. Sequence right after ADR-0095. | high | `[[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]` |
| **ADR-0102** | Notification platform re-ratification + offline-delivery clause (supersedes ADR-0043) | ADR-0043 | **Option B**: small superseding ADR re-stating ADR-0043 unchanged under the current gate + an explicit offline clause (inbox-first; SSE/email/push are best-effort online enhancements; replay via the ADR-0090 queue). | medium | `[[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]` |
| **ADR-0103** | Multi-agent orchestration & conflict serialization (supersedes ADR-0009) | ADR-0009 | **Option A**: tool-agnostic orchestration ADR generalising serialize-schema/interface/config + fan-out-independent-beats across all three agents (Claude/Codex/Cursor); links ADR-0044/0045/0046. Low priority, agent-workflow housekeeping. | medium | `[[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]]` |
| **ADR-0104** | Mobile-delivery grounding + ratification (supersedes ADR-0025) | ADR-0025 | **Option B**: grounding pass — pin iOS-PWA-push / EU-DMA claims to dated sources, state target Capacitor major + min iOS, convert the un-ratified default into an explicitly ratified decision. Not MVP-blocking; low priority. | low | `[[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]]` |

---

## G. Proposed draft GDs

Allocated numbers GD-0037…GD-0040. These are **product/scope** decisions for Nico, not
architecture defects; the relevant architectural boundaries (ADR-0030 LLM-out-of-state,
ADR-0089 context catalog) stay as they are.

| GD | Working title | Recommendation | Conf. | Draft file |
|---|---|---|---|---|
| **GD-0037** | Offline narration tier for the AI-narration MVP pillar (deterministic template vs optional on-device WebGPU vs cloud LLM) | Nico's product/scope call. If pursued, **Option B** (optional capability-gated on-device WebGPU tier *between* deterministic templates and cloud LLM) requires a dedicated version-pinning + device-capability research pass first; the deterministic template fallback stays the guaranteed baseline regardless. ADR-0030 boundary unchanged. | low | `[[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]]` |
| **GD-0038** | Bounded-context portfolio trim / merge-review gate (keep ADR-0089 D1 option B alive) | **Option B**: treat the merge-review as a first-class ongoing gate rather than accepting 28 as final; trim candidates that always co-change (Scouting/Transfer; Statistics-Analytics-as-read-model-only). Only pursue if Nico wants the count actively managed. | medium | `[[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]]` |
| **GD-0039** | C6 status reconciliation & cluster ratification order (People-first) | **Option A**: one central note recording canonical status + a fixed People-first ratification order (People → Staff Ops/Youth/Scouting → Discipline/Loans/Manager-signal). Fold the status half into ADR-0092; keep the ratification-ORDER as the distinct C6 contribution. | high | `[[../50-Game-Design/GD-0039-c6-status-reconciliation-and-cluster-ratification-order]]` |
| **GD-0040** | Future Contracts/CLM bounded-context extraction-seam decision | **Option A**: one consolidated "defer, keep the seam" decision so ADR-0073 and ADR-0075 stop tracking the same future-CLM question in parallel; re-evaluate after loans/staff/commercial contract work lands. | medium | `[[../50-Game-Design/GD-0040-future-contracts-clm-extraction-seam]]` |

---

## H. To add to Decision-Log on ratify

> **We do NOT edit [[../00-Index/Decision-Log]] here** (read-only on existing files).
> This is the block Nico can paste into the Decision-Log's ADR table **after** ratifying
> each draft, plus the two label reconciliations. Column shape matches the existing log:
> `| ADR | Status | Decision | Lineage |`.

### New ADR rows (paste on ratify)

| ADR | Status | Decision | Lineage |
|---|---|---|---|
| [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep]] | draft | Status single-source-of-truth (frontmatter canonical) + reference-integrity sweep (outbox 0013→0028, ADR-0010→0019 residue, retire "eleven", `audit_log` canonicalisation). | New governance ADR; no supersede. |
| [[../10-Architecture/09-Decisions/ADR-0093-joint-ratification-wave-async-coordination-foundation]] | draft | Joint ratification of ADR-0012 + ADR-0014 (promote) and ADR-0088 + ADR-0089 (land), with `contract_version` bump on WatchPartyScheduled/MatchdayOpened. | New; promotes 0012/0014, lands 0088/0089. |
| [[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]] | draft | Paraglide JS + format.js + Tolgee; MVP locales DE/EN/FR/ES/IT (pending ICU-MF1 validation). | Supersedes ADR-0006. |
| [[../10-Architecture/09-Decisions/ADR-0095-balanced-transfer-ledger-posting-invariant]] | draft | Balanced double-entry ledger postings + accounting-identity invariant. | Supersedes ADR-0050. |
| [[../10-Architecture/09-Decisions/ADR-0096-match-engine-cross-runtime-determinism-numeric-surface]] | draft | Mandatory integer/fixed-point numeric surface + per-quality-profile determinism precedence; restates 9 RNG streams. | Supersedes ADR-0049 + ADR-0003. |
| [[../10-Architecture/09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]] | draft | Schema-per-save ceiling + cold/archive fallback; drop platform `audit_log`; pin Postgres 18.x. | Supersedes ADR-0027; amends ADR-0028. |
| [[../10-Architecture/09-Decisions/ADR-0098-save-format-kdf-argon2id-and-active-pack-refs]] | draft | Argon2id on the portable-export passphrase path; `activePacks` refs + missing-pack import in SavePayload. | Supersedes ADR-0005. |
| [[../10-Architecture/09-Decisions/ADR-0099-spectator-watch-party-streaming-over-committed-event-log]] | draft | Event-log-only spectator/watch-party streaming (replay cursor, no persisted snapshots); online-only in ADR-0090 scope. | Supersedes ADR-0015. |
| [[../10-Architecture/09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]] | draft | StoryThread (Narrative origination) vs CoverageThread (Media Ecology); `storyThreadId` correlation-only. | Supersedes thread-ownership portions of ADR-0076 + ADR-0085. |
| [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]] | draft | Deterministic MoneyBand→amountMinor collapse + canonical quality-profile enum + insolvency→ledger posting contract. | New; depends on ADR-0095/0096. |
| [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]] | draft | Re-ratify ADR-0043 unchanged + explicit offline-delivery clause. | Supersedes ADR-0043. |
| [[../10-Architecture/09-Decisions/ADR-0103-multi-agent-orchestration-conflict-serialization]] | draft | Tool-agnostic multi-agent orchestration + conflict serialization (all three agents). | Supersedes ADR-0009. |
| [[../10-Architecture/09-Decisions/ADR-0104-mobile-delivery-grounding-and-ratification]] | draft | Grounded, ratified mobile-delivery decision (Capacitor major/min iOS pinned). | Supersedes ADR-0025. |

### New GDDR rows (paste on ratify, in the GDDR table)

| GDDR | Status | Decision |
|---|---|---|
| [[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]] | draft | Offline-narration tier scope (template baseline; optional WebGPU tier pending research). |
| [[../50-Game-Design/GD-0038-bounded-context-portfolio-trim-merge-review-gate]] | draft | Standing context-count merge-review gate (keep ADR-0089 D1 B alive). |
| [[../50-Game-Design/GD-0039-c6-status-reconciliation-and-cluster-ratification-order]] | draft | People-first C6 cluster ratification order. |
| [[../50-Game-Design/GD-0040-future-contracts-clm-extraction-seam]] | draft | Defer-and-keep the Contracts/CLM extraction seam (one consolidated decision). |

### Existing-row reconciliations (edit the wording of these rows on ratify)

| Existing row | Change |
|---|---|
| ADR-0075 (loan orchestration) | Reconcile the buy-clause label: body/HITL "Option + obligation-to-buy" vs log "D2=B" — agree the A/B/C letter (E-7). |
| ADR-0019 (modular monolith) | Drop the hardcoded "eleven contexts"; defer the count to the bounded-context-map / ADR-0089 (E-1). |
| ADR-0003 (match engine) | Note "9 RNG streams" via the ADR-0096 carry-forward, not by editing ADR-0003's row's claim of 8 (E-2). |

---

## I. Open decisions & recommended validation order

Ordered so that each step's prerequisites are ratified first. Steps 1–3 are the unblock
wave; 4–8 the determinism→economy chain; 9–14 high-value-but-independent and
housekeeping.

1. **Portfolio governance** — ratify the status single-source-of-truth rule +
   reference-integrity sweep ([[#F. Proposed draft ADRs|ADR-0092]]). Prerequisite: until
   every ADR's binding state is unambiguous, all downstream ratifications rest on
   uncertain ground.
2. **Bounded-context portfolio** — ratify [[#F. Proposed draft ADRs|ADR-0093]]/ADR-0089
   (D2/D3 ordinal catalog + clusters; keep D1 28-vs-merge as a standing gate, see
   [[#G. Proposed draft GDs|GD-0038]]). Fixes the count vocabulary C4/C6/C7/C9 depend on;
   its apply-PR carries step 1's sweep.
3. **Async-coordination foundation** — ratify ADR-0012 + ADR-0014 + ADR-0088 together
   (with the contract_version bump) via [[#F. Proposed draft ADRs|ADR-0093]]. Everything
   FSM/cadence rests on these parked dependencies; largest downstream surface unblocked.
4. **Match-engine determinism & numeric-surface contract**
   ([[#F. Proposed draft ADRs|ADR-0096]], finalises ADR-0049, carries ADR-0003 forward,
   restates 9 streams, sets the per-quality-profile precedence rule). Load-bearing for
   offline verify-locally; unblocks the quality-profile enum used in economy settlement.
5. **Spectator/watch-party event-log streaming** ([[#F. Proposed draft ADRs|ADR-0099]],
   supersede ADR-0015) — before/with ADR-0087, after step 4 fixes the replay-cursor
   contract.
6. **Data layer** — ratify the Postgres schema-per-save scale envelope + audit
   canonicalisation ([[#F. Proposed draft ADRs|ADR-0097]], supersede ADR-0027/0028) and
   the SurrealDB additive-seam A-vs-B call ([[#D. Data-layer axis — Postgres vs SurrealDB|§D]]).
   Pin Postgres 18.x.
7. **Accounting double-entry / balanced-ledger invariant**
   ([[#F. Proposed draft ADRs|ADR-0095]], supersede ADR-0050). Prerequisite for step 8.
8. **Settlement value-collapse + quality-profile enum + insolvency→ledger postings**
   ([[#F. Proposed draft ADRs|ADR-0101]]) — lands coherently only after steps 4 (enum)
   and 7 (balanced postings).
9. **i18n stack & locale scope** ([[#F. Proposed draft ADRs|ADR-0094]], supersede
   ADR-0006). Independent of the engine/economy chain but high-value; resolve the ICU-MF1
   sub-question, then migrate ADR-0008/0010/narrative locale touch-points together.
10. **Save-format KDF + active-pack refs** ([[#F. Proposed draft ADRs|ADR-0098]],
    supersede ADR-0005) — needs the community-pack model (ADR-0016/0059) ratified so
    SavePayload's `activePacks` contract is stable.
11. **C6 People-first ratification order** ([[#G. Proposed draft GDs|GD-0039]]), then
    ratify the people/scouting/youth/loans/discipline chain in that order.
12. **Story-thread ownership/naming** ([[#F. Proposed draft ADRs|ADR-0100]], supersede
    thread portions of ADR-0076/0085) + **Notification re-ratification**
    ([[#F. Proposed draft ADRs|ADR-0102]], supersede ADR-0043) — narrative/media cluster,
    before that implementation wave.
13. **Lower-priority housekeeping** (any order): multi-agent orchestration
    ([[#F. Proposed draft ADRs|ADR-0103]], supersede ADR-0009); mobile-delivery grounding
    ([[#F. Proposed draft ADRs|ADR-0104]], supersede ADR-0025); observability refresh
    (ADR-0017); design-system head normalization (ADR-0010); tactical-fingerprint
    effective-N (ADR-0074); national-team/eligibility cross-refs (ADR-0084/0069); HF9
    HoF-voting RNG (ADR-0083).
14. **Product/scope GDDRs at Nico's discretion**: offline-narration tier
    ([[#G. Proposed draft GDs|GD-0037]]), portfolio-trim merge-review gate
    ([[#G. Proposed draft GDs|GD-0038]]), future Contracts/CLM seam
    ([[#G. Proposed draft GDs|GD-0040]]).

---

> **Reminder.** This note creates no binding decision and edits no existing file. The
> proposed ADRs/GDDRs (ADR-0092…ADR-0104, GD-0037…GD-0040) are separate draft work items;
> their files are referenced above and will carry `Supersedes:` frontmatter where
> applicable. Ratification is Nico's via the ask-first decision gate
> ([[../90-Meta/collaboration-and-decision-protocol]]).
