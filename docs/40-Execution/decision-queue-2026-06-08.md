---
title: Decision-Queue — Planning-Mode Ratification Sweep
type: execution
status: draft
binding: false
created: 2026-06-08
tags: [execution, adr, gddr, decision-queue, ratification]
updated: 2026-06-09
related:
  - "[[adr-re-audit-master-2026-06-08]]"
  - "[[Decision-Log]]"
  - "[[Current-State]]"
  - "[[collaboration-and-decision-protocol]]"
---

# Decision-Queue — Planning-Mode Ratification Sweep (2026-06-08)

> [!warning] Draft planning aid — nothing here is ratified
> This is a **single ordered sweep driver** to support Nico's planning-mode
> ratification pass. It is `status: draft`, `binding: false`. **No decision below
> is decided by this document.** Ratification is **Nico's alone**, via the decision
> gate in [[collaboration-and-decision-protocol]]. Every item lists a *proposed*
> disposition + (where needed) open D-questions with options, a marked
> recommendation, and a confidence — these are inputs for Nico, not outcomes.
>
> Context reset: everything was reopened to `status: draft` on **2026-05-27**, so
> **every** ADR and GDDR needs an explicit disposition this pass — including the
> sound ones. The deep per-item analysis lives in the linked audit notes; this
> doc is the navigation + checklist layer.

**Builds on (read, do not redo):** the re-audit master
[[adr-re-audit-master-2026-06-08]] and cluster notes
[[adr-re-audit-c1-2026-06-08]] · [[adr-re-audit-c2-2026-06-08]] ·
[[adr-re-audit-c3-2026-06-08]] · [[adr-re-audit-c4-2026-06-08]] ·
[[adr-re-audit-c5-2026-06-08]] · [[adr-re-audit-c6-2026-06-08]] ·
[[adr-re-audit-c7-2026-06-08]] · [[adr-re-audit-c8-2026-06-08]] ·
[[adr-re-audit-c9-2026-06-08]] · [[gd-re-audit-g1-2026-06-08]] ·
[[gd-re-audit-g2-2026-06-08]] · [[gd-re-audit-g3-2026-06-08]] ·
[[gd-re-audit-g4-2026-06-08]] · [[gd-re-audit-g5-2026-06-08]] ·
[[gd-re-audit-g6-2026-06-08]] · [[gd-re-audit-g7-2026-06-08]].
Lineage anchors: [[Decision-Log]], [[Current-State]],
[[collaboration-and-decision-protocol]].

**Totals (from the tally):** 133 decisions · 52 ratify-as-is · 65
ratify-with-amendment · 16 supersede-by-new · 0 defer · 0 merge · 0
reject-candidate · **12 scope-calls** (pure-Nico) · **89 with open D-questions**.

---

## How to run this sweep

1. **Decide the 12 scope-calls FIRST, in queue order** — Batch 0 (GD-0037 narration
   tier, GD-0040 CLM seam), then the portfolio/data/MVP scope-calls woven into
   Batches 1–2 (GD-0038, ADR-0089, ADR-0097, GD-0017). These have **no technical
   default** and cascade the widest; nothing downstream is safe to ratify until
   they're set. (Remaining scope-calls — GD-0015, GD-0004, GD-0020, GD-0021,
   GD-0022, GD-0023, ADR-0083 — are decided in their own batches alongside their
   dependencies.)
2. **Then go batch by batch in the given order.** Each batch's `dependsOn` are fully
   satisfied by earlier batches, so you never have to look ahead. **Five
   co-ratification PAIRS must be confirmed together** (mutual deps — ratify as a
   unit): **ADR-0012 + ADR-0088**, **ADR-0016 + ADR-0059**, **GD-0011 + GD-0030**,
   **GD-0010 + GD-0024**, **GD-0020 + GD-0021**.
3. **Confirm the 52 ratify-as-is items in BULK per batch** (reopen → re-ratify
   unchanged) — they have empty open questions. Only the **89 items with open
   D-questions** need discussion. The **16 supersede-by-new** items pair an old ADR
   with its new draft (e.g. ADR-0027→0097, ADR-0050→0095, ADR-0006→0094) — ratify
   the new draft, mark the old superseded in the same step.
4. **No defer / merge / reject candidates exist** — every card resolves to ratify
   (as-is or amended) or supersede, so the queue is a single clean pass with no
   parking lot.
5. **Run the head (Batches 0–2) as the unblock wave**; Batches 3–7 then proceed at
   pace, with the GD cluster (Batch 7) last since every GDDR rests on its ADR
   substrate.

---

## Batch 0 — Scope-calls to decide FIRST

These are **pure product/scope calls a workflow cannot pre-decide** (no technical
default) and cascade the widest. Decide them before anything else. (Batch-0 proper
holds GD-0037 + GD-0040; the other ten scope-calls are listed here for visibility but
are decided in-place in their own batches — see the per-batch tables and detailed
cards.)

### Decide-first (Batch 0 proper)

- **GD-0037 — Offline narration tier.** *Decision:* (A) template-only offline /
  (B) optional on-device WebGPU small-LLM tier + cloud LLM when online / (C)
  cloud-LLM-only (degrades to templates offline). *Cascades:* sets the ceiling for
  the whole Narrative/Media cluster (GD-0013/0018/0028/0034, ADR-0054/0065/0076/0085);
  decide first to avoid reworking narration contracts. *Recommend* **B** — template
  floor always present, WebGPU as opt-in enrichment, cloud online; keeps ADR-0030
  (LLM out of authoritative state) intact and offline-first. *Confidence:* medium.
- **GD-0040 — Future Contracts/CLM extraction seam.** *Decision:* (A) reserve an
  explicit seam in Player Contract context now / (B) no seam, extract later if
  needed. *Cascades:* shapes ADR-0073/0075 (contract lifecycle, loan PM) and GD-0006
  transfers — draw their boundaries once. *Recommend* **A** — cheap to reserve an ACL
  boundary, expensive to retrofit. *Confidence:* medium.

### Remaining scope-calls (decided in-place in their batches)

| Scope-call | Decided in | The call (short) | Recommend |
|---|---|---|---|
| GD-0038 | Batch 1 | 28 contexts final vs merge-review gate | B (merge-review gate) |
| ADR-0089 | Batch 1 | Confirm reconciled 28-context map as canonical count source | ratify-w/-amend (D1 live as GD-0038) |
| ADR-0097 | Batch 2 | Postgres scale envelope + schema ceiling + drop platform audit_log | A |
| GD-0017 | Batch 4 | MVP mode sequencing (Create-a-Club Roguelite first, Career later) | A (ratify as-is) |
| GD-0015 | Batch 5 | IP-clean data-generation depth (datapack opt-in; editor real names) | A floor + C overlay |
| GD-0020 | Batch 7 | EOS people-model breadth (16+4+8 + OCEAN; MVP actor classes) | A |
| GD-0021 | Batch 7 | Player/staff dev + decision-influence breadth (staff-skill gate) | B (narrow pipeline modifiers) |
| GD-0022 | Batch 7 | Economy commercial-impact / contracts depth | A (MVP-lean) |
| GD-0023 | Batch 7 | AI club economy behaviour depth (owner-support gating) | B (gate by archetype+regime) |
| GD-0004 | Batch 7 | Tactics & formations depth for MVP | A (lock recommended MVP slice) |
| ADR-0083 | Batch 6 | Awards/HoF contract + HoF-voting RNG + D4=B full-HoF scope | A (D1–D3); D4=B re-confirm |

---

## Tally

| Disposition | Count |
|---|---:|
| **Total** | **133** |
| ratify-as-is | 52 |
| ratify-with-amendment | 65 |
| supersede-by-new | 16 |
| defer | 0 |
| merge | 0 |
| reject-candidate | 0 |
| — | — |
| scope-calls (pure-Nico) | 12 |
| with open D-question(s) | 89 |

---

## Batch 1 — Governance & portfolio unblock

> ADR-0092 status-SSOT + ref-integrity sweep is the single highest-leverage move;
> ADR-0093 async-foundation wave and ADR-0089 context portfolio (incl. its GD-0038
> trim/merge scope-call) make every downstream ratification rest on firm ground.

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0092 | Vault governance status SSOT + ref-integrity sweep | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | ADR-0093 | Joint ratification wave (0012+0014 promote, 0088+0089 land) | ratify-w/-amend | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | GD-0038 | Bounded-context portfolio trim / merge-review gate | ratify-w/-amend · **scope** | Y | ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0089 | Bounded-context Portfolio Reconciliation | ratify-w/-amend · **scope** | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 2 — Determinism, data & economy spine

> Match-engine determinism (0096/0099), Postgres scale envelope scope-call (0097),
> double-entry ledger (0095) and settlement/quality-profile/insolvency collapse
> (0101). Everything numeric/replay-bearing and economic depends on these.

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0096 | Match-engine cross-runtime determinism & numeric surface (finalises 0049) | ratify-w/-amend | Y | ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | ADR-0097 | PostgreSQL scale envelope + audit canonicalisation (supersedes 0027) | ratify-w/-amend · **scope** | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | ADR-0095 | Double-entry ledger posting invariant (supersedes 0050 shape) | ratify-w/-amend | Y | ADR-0097 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0101 | Settlement collapse + quality-profile enum + insolvency postings | ratify-w/-amend | Y | ADR-0095, ADR-0096 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | ADR-0099 | Spectator streaming over committed event log (supersedes 0015) | ratify-w/-amend | Y | ADR-0096 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 3 — Cross-cutting new ADRs & ordering GD

> i18n stack (0094), story-thread ownership (0100), People-first C6 ratification
> order (GD-0039), multi-agent orchestration (0103), mobile-delivery grounding
> (0104) — independent supersedes that gate later clusters or are housekeeping.

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0094 | i18n stack & locale scope (supersedes 0006) | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | GD-0039 | C6 status reconciliation & People-first ratification order | ratify-w/-amend | Y | ADR-0092, ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | ADR-0100 | Story-thread ownership & naming (StoryThread vs CoverageThread) | ratify-w/-amend | Y | ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0103 | Multi-agent orchestration & conflict serialization (supersedes 0009) | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | ADR-0104 | Mobile-delivery grounding + ratification (supersedes 0025) | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 4 — Platform, async coordination & infra ADRs

> IP naming, design system, server-auth multiplayer, state-machines/cadence wave
> (0014/0012/0088), observability, modular monolith & lifecycle, realtime transport,
> CI/CD/workflow/orchestration, mobile UI/i18n/animation, MVP-scope scope-call.
> **Pairs in this batch:** ADR-0012 + ADR-0088 (ratify together).

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0007 | IP-clean Naming Schema + Data Generators | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | ADR-0010 | Klubhaus Design-System | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | ADR-0011 | Server-Authoritative Multiplayer | ratify-w/-amend | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0014 | Explicit State Machines | supersede-by-new (0093) | Y | ADR-0092, ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | ADR-0012 | Async Multiplayer Cadence Models | supersede-by-new (0093) | Y | ADR-0092, ADR-0093, ADR-0088 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 6 | ADR-0088 | Async Escalation FSM + Watch-Party Deadline SoT | ratify-w/-amend | Y | ADR-0092, ADR-0093, ADR-0012, ADR-0014 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 7 | ADR-0017 | Self-hosted Observability & Logging | ratify-w/-amend | Y | ADR-0092, ADR-0097 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 8 | ADR-0019 | Service-ready Modular Monolith with DDD | supersede-by-new (0092) | Y | ADR-0092, ADR-0089 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 9 | ADR-0018 | Systemic Events and Player Lifecycle | supersede-by-new (0092) | Y | ADR-0092, ADR-0019, ADR-0089 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 10 | ADR-0021 | Revised Tech Stack (Postgres+Drizzle, SurrealDB deferred) | ratify-as-is | N | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 11 | ADR-0001 | Tech Stack (original, SurrealDB-era) | ratify-as-is | N | ADR-0021 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 12 | ADR-0008 | Mobile-first UI — route map, IA & client-state | ratify-as-is | N | ADR-0021 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 13 | ADR-0006 | i18n Strategy (i18next, DE+EN) | supersede-by-new (0094) | Y | ADR-0008, ADR-0021 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 14 | ADR-0020 | Hybrid-online MVP, Offline-ready | ratify-as-is | N | ADR-0021 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 15 | GD-0017 | MVP Scope and Mode Sequencing | ratify-as-is · **scope** | Y | ADR-0020 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 16 | ADR-0022 | Animation & Game-Feel Stack | ratify-w/-amend | Y | ADR-0021 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 17 | ADR-0023 | Realtime Transport (SSE MVP + Centrifugo upgrade) | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 18 | ADR-0025 | Mobile Delivery (PWA + Capacitor) | supersede-by-new (0104) | Y | ADR-0008 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 19 | ADR-0044 | CI/CD Strategy & Merge Policy | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 20 | ADR-0045 | Issue-first + Git-Worktree Agent Workflow | ratify-w/-amend | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 21 | ADR-0046 | Team Topology & Multi-Lead Scaling | ratify-w/-amend | Y | ADR-0089, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 22 | ADR-0009 | Cursor Cloud Agent Orchestration | supersede-by-new (0103) | Y | ADR-0092, ADR-0044, ADR-0045, ADR-0046 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 23 | ADR-0048 | Design-System Update & Migration Path | ratify-as-is | N | ADR-0010 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 5 — Match, render, data-model & save chain

> Match frame contract & renderers (0026/0024/0003/0049/0015), 3D/Babylon
> presentation (0047/0029/0041), Postgres data-model + IP-clean data scope-call
> (0027/0004/GD-0015), community packs & save-format (0016/0059/0005/0098), outbox
> (0028/0013), LLM boundary, offline-first/notification/audit.
> **Pairs in this batch:** ADR-0016 + ADR-0059 (ratify together).

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0026 | Match Frame Contract | ratify-as-is | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | ADR-0003 | Match Engine Architecture | supersede-by-new (0096) | Y | ADR-0096, ADR-0026 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | ADR-0024 | Match Renderer Abstraction | ratify-as-is | N | ADR-0026 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0027 | PostgreSQL Data Model (schema-per-save) | supersede-by-new (0097) | Y | ADR-0092, ADR-0093, ADR-0096 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | ADR-0004 | Data Model (SurrealDB-era) | ratify-as-is | N | ADR-0027 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 6 | GD-0015 | IP-clean Data Generation | ratify-w/-amend · **scope** | Y | ADR-0007, ADR-0004 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 7 | ADR-0016 | Community Datasets via Override Packs | ratify-as-is | N | ADR-0059 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 8 | ADR-0059 | Community Overlay Pipeline Context | ratify-w/-amend | Y | ADR-0092, ADR-0016, ADR-0027 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 9 | ADR-0005 | Save Format and Versioning | supersede-by-new (0098) | Y | ADR-0092, ADR-0016, ADR-0059 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 10 | ADR-0098 | Save-format KDF Argon2id + active-pack refs (supersedes 0005) | ratify-w/-amend | Y | ADR-0005, ADR-0016, ADR-0059 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 11 | ADR-0028 | PostgreSQL Transactional Outbox | supersede-by-new (0097) | Y | ADR-0092, ADR-0093, ADR-0027 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 12 | ADR-0013 | Transactional Outbox (SurrealDB + Redis Streams) | ratify-as-is | N | ADR-0028 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 13 | ADR-0030 | LLM Out Of Authoritative State Boundary | ratify-as-is | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 14 | ADR-0047 | Babylon.js as 3D / Isometric Presentation Engine | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 15 | ADR-0029 | 3D Presentation Layer | ratify-w/-amend | Y | ADR-0047 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 16 | ADR-0041 | Two-Renderer Presentation Strategy | ratify-w/-amend | Y | ADR-0047 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 17 | ADR-0049 | Swappable Spatial-Event Match Engine | supersede-by-new (0096) | Y | ADR-0026 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 18 | ADR-0015 | Spectator Snapshot Streaming | supersede-by-new (0099) | Y | ADR-0096, ADR-0026, ADR-0049 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 19 | ADR-0090 | Offline Sync scope + conflict strategy | ratify-w/-amend | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 20 | ADR-0102 | Notification re-ratification + offline-delivery clause (supersedes 0043) | ratify-w/-amend | Y | ADR-0092, ADR-0090 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 21 | ADR-0002 | Offline-first Strategy | ratify-as-is | N | ADR-0020, ADR-0090 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 22 | ADR-0043 | Notification and Messaging Platform | supersede-by-new (0102) | Y | ADR-0092, ADR-0090 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 23 | ADR-0091 | Audit & Security context definition | ratify-as-is | N | ADR-0089, ADR-0090, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 6 — Domain bounded-context ADRs (economy, people, competition, narrative)

> The bulk of context ADRs in People-first / economy / competition / narrative order
> per GD-0039: ledger contexts, People/Staff/Youth/Scouting/Contracts/Discipline/
> Loans, Tactics/Regulations, Competition/Fixtures, awards/national-team (incl. 0083
> HoF-RNG scope-call), media/world-sim, set-piece, live-control.

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | ADR-0050 | Club Economy Accounting Ledger | supersede-by-new (0095) | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | ADR-0051 | Manager and Legacy Context | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | ADR-0052 | People, Persona & Skills Context | ratify-as-is | N | ADR-0092, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | ADR-0053 | Staff Operations Context | ratify-as-is | Y | ADR-0092, ADR-0052, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | ADR-0054 | Narrative Context and AI Narration Framework | ratify-as-is | N | ADR-0092, ADR-0030 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 6 | ADR-0055 | Tactics Context | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 7 | ADR-0056 | Regulations & Compliance Context | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 8 | ADR-0057 | Rivalry System Context | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 9 | ADR-0058 | Club Economy Commercial Impact Boundary | ratify-w/-amend | Y | ADR-0092, ADR-0050 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 10 | ADR-0061 | Club Management Sub-Aggregate Audit | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 11 | ADR-0062 | Audience & Atmosphere Context | ratify-as-is | N | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 12 | ADR-0063 | Investor Entitlement and Payment Boundary | ratify-w/-amend | Y | ADR-0092, ADR-0050, ADR-0058 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 13 | ADR-0064 | Scouting Activity Context | ratify-as-is | N | ADR-0092, ADR-0093, ADR-0052, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 14 | ADR-0066 | Competition & Season Registry sub-aggregate | ratify-as-is | N | ADR-0092, ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 15 | ADR-0067 | Set-piece Variant Selection Determinism | ratify-as-is | N | ADR-0026, ADR-0096 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 16 | ADR-0068 | Fixture scheduling contract + determinism | ratify-as-is | N | ADR-0092, ADR-0093 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 17 | ADR-0069 | League↔Regulations eligibility hand-off | ratify-w/-amend | Y | ADR-0092, ADR-0056, ADR-0066 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 18 | ADR-0070 | Fixture / Competition Revenue Profile Contract | ratify-w/-amend | Y | ADR-0092, ADR-0050 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 19 | ADR-0071 | AI World Simulation Context and Drift Contract | ratify-as-is | N | ADR-0092, ADR-0089 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 20 | ADR-0072 | In-Match Control Seam & Intervention Determinism | ratify-as-is | N | ADR-0024, ADR-0026 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 21 | ADR-0073 | Player Contract Lifecycle FSM | ratify-w/-amend | Y | ADR-0092, ADR-0052, GD-0039, GD-0040 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 22 | ADR-0074 | Tactical-identity fingerprint aggregation | ratify-w/-amend | Y | ADR-0092, ADR-0055 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 23 | ADR-0075 | Loan-Orchestration Process Manager | ratify-w/-amend | Y | ADR-0092, ADR-0052, ADR-0073, GD-0039, GD-0040 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 24 | ADR-0060 | Youth Academy Context | ratify-as-is | N | ADR-0092, ADR-0052, ADR-0075, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 25 | ADR-0077 | Environment & Climate context (weather + pitch) | ratify-as-is | Y | ADR-0089 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 26 | ADR-0078 | Player Discipline Suspension Contracts | ratify-w/-amend | Y | ADR-0092, ADR-0052, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 27 | ADR-0076 | Narrative Newsworthiness Event Contracts | supersede-by-new (0100) | Y | ADR-0092, ADR-0089, ADR-0078 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 28 | ADR-0079 | Dynasty Board, Ownership & Bankruptcy FSMs | ratify-w/-amend | Y | ADR-0092, ADR-0050 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 29 | ADR-0080 | Opposition-template AI consumption contract | ratify-as-is | N | ADR-0092, ADR-0055 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 30 | ADR-0081 | Statistics & Analytics Read-Model Owner | ratify-as-is | N | ADR-0092, ADR-0089 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 31 | ADR-0082 | Manager Style-Signal & Run-Analysis Contract | ratify-as-is | N | ADR-0092, ADR-0051, GD-0039 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 32 | ADR-0083 | Awards / Honours / Records / Hall-of-Fame contract | ratify-w/-amend · **scope** | Y | ADR-0092, ADR-0081 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 33 | ADR-0084 | National-team dual-role + international-window contract | ratify-w/-amend | Y | ADR-0092, ADR-0089, ADR-0066, ADR-0056, ADR-0083 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 34 | ADR-0085 | Media Ecology Context and Outlet Operational Behaviour | supersede-by-new (0100) | Y | ADR-0092, ADR-0089, ADR-0071, ADR-0076 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 35 | ADR-0065 | Narrative Media/Press Content Ownership | ratify-w/-amend | Y | ADR-0092, ADR-0089, ADR-0085, ADR-0100 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 36 | ADR-0086 | Background-fast Matchday Cost-Settlement | ratify-w/-amend | Y | ADR-0092, ADR-0050, ADR-0070 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 37 | ADR-0087 | Live-match Intervention Buffer + Pause-Vote | ratify-as-is | N | ADR-0072, ADR-0099 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

## Batch 7 — Game-design (GD) decisions, dependency-ordered

> All GDDRs after their ADR substrates are ratified. Economy/board scope-calls
> (GD-0022/0023), EOS people scope-calls (GD-0020/0021), tactics scope-call (GD-0004)
> sit with their dependencies; the rest follow.
> **Pairs in this batch:** GD-0011 + GD-0030, GD-0010 + GD-0024, GD-0020 + GD-0021.

| # | ID | Title | Disposition | Open Q? | Depends on | Sweep |
|---|---|---|---|:--:|---|---|
| 1 | GD-0001 | Core Career Loop & Weekly Rhythm | ratify-as-is | N | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 2 | GD-0002 | Match Engine & Simulation Model | ratify-w/-amend | Y | ADR-0096, ADR-0049, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 3 | GD-0005 | Training & Development | ratify-w/-amend | Y | ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 4 | GD-0006 | Transfers & Scouting | ratify-w/-amend | Y | ADR-0073, GD-0040 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 5 | GD-0007 | Youth Academy | ratify-w/-amend | Y | ADR-0092, ADR-0060, ADR-0075 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 6 | GD-0009 | League & Competition Structure | ratify-w/-amend | Y | ADR-0066, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 7 | GD-0011 | Career Progression, Board & Objectives | ratify-w/-amend | Y | GD-0030 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 8 | GD-0030 | Dynasty Board & Ownership | ratify-as-is | Y | ADR-0079, GD-0011 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 9 | GD-0008 | Finance, Economy & Stadium | ratify-w/-amend | Y | ADR-0050, ADR-0079, GD-0030 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 10 | GD-0012 | Onboarding & New Game | ratify-as-is | N | GD-0017, ADR-0094 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 11 | GD-0013 | Narrative, Inbox & Events | ratify-w/-amend | Y | — | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 12 | GD-0018 | AI Narrative Personas and Dialogue | ratify-w/-amend | Y | GD-0013, ADR-0030, ADR-0052, ADR-0054, ADR-0100 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 13 | GD-0010 | AI Managers & World Simulation | ratify-w/-amend | Y | GD-0024, GD-0018 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 14 | GD-0024 | AI World-Drift Algorithm | ratify-w/-amend | Y | GD-0010, ADR-0071 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 15 | GD-0019 | Manager Archetype Roguelite Progression | ratify-as-is | N | ADR-0051, ADR-0074, ADR-0082 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 16 | GD-0020 | EOS Player Skills, Personas and People | ratify-w/-amend · **scope** | Y | GD-0021, ADR-0052 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 17 | GD-0021 | Player and Staff Development and Decision Influence | ratify-w/-amend · **scope** | Y | GD-0020, ADR-0052, ADR-0053 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 18 | GD-0003 | Squad, Players & Attributes | ratify-w/-amend | Y | GD-0020, ADR-0027, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 19 | GD-0022 | Economy Commercial Impact and Contracts | ratify-as-is · **scope** | Y | GD-0008, ADR-0058 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 20 | GD-0023 | AI Club Economy Behaviour | ratify-as-is · **scope** | Y | GD-0008, GD-0030, ADR-0051 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 21 | GD-0014 | Save & Career Model | ratify-w/-amend | Y | ADR-0096, ADR-0098, ADR-0005 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 22 | GD-0016 | Mobile UX Gameplay Loop | ratify-as-is | N | ADR-0008, ADR-0010, ADR-0094 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 23 | GD-0025 | In-Match Controls & Live-Control Kit | ratify-as-is | N | ADR-0072, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 24 | GD-0004 | Tactics & Formations | ratify-w/-amend · **scope** | Y | ADR-0092, ADR-0055, ADR-0072, GD-0025 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 25 | GD-0026 | Set-Piece-Coach Effect-Readiness Multiplier Curve | ratify-as-is | N | ADR-0067, ADR-0055, ADR-0053, ADR-0018, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 26 | GD-0027 | Hidden-Attribute Substrate Mapping (8-meta / OCEAN → labels) | ratify-as-is | N | GD-0020, ADR-0064, ADR-0052 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 27 | GD-0028 | Dialogue Intent Taxonomy and Effect Matrix | ratify-as-is | N | GD-0018, ADR-0030, ADR-0054, ADR-0052 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 28 | GD-0029 | Weather & Pitch Design Model | ratify-as-is | N | ADR-0077 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 29 | GD-0031 | Analytics Hub and Statistics | ratify-as-is | N | ADR-0081 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 30 | GD-0033 | National-Team (Bundestrainer) Dual-Role | ratify-w/-amend | Y | ADR-0084, ADR-0066, GD-0011 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 31 | GD-0032 | Awards, Honours, Records & Hall of Fame | ratify-w/-amend | Y | ADR-0083, ADR-0081, GD-0031, GD-0033 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 32 | GD-0034 | Media-Outlet Ecology Model | ratify-w/-amend | Y | ADR-0085, ADR-0076, ADR-0100, GD-0018, GD-0028 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 33 | GD-0035 | Live-Coaching Intervention & Pause Rules | ratify-as-is | N | ADR-0087, ADR-0072, ADR-0092 | ☐ ratify ☐ amend ☐ defer ☐ reject |
| 34 | GD-0036 | Transfer Escalation & Inactivity Pressure | ratify-as-is | N | ADR-0088, ADR-0093, GD-0027 | ☐ ratify ☐ amend ☐ defer ☐ reject |

---

# Decision cards (detailed)

> Cards appear **only** for items whose disposition is NOT ratify-as-is **OR** that
> carry open D-question(s). Pure ratify-as-is / no-question items are covered by the
> batch tables above. The deep analysis lives in each item's linked audit note.

## Batch 0

### GD-0037 — Offline narration tier (template/WebGPU/cloud LLM)
- **One-line:** What offline tier sits above the template baseline.
- **Current status:** draft; product GDDR; ADR-0030 unchanged. **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — offline narration tier above template baseline:**
  - **(A)** template-only offline.
  - **(B)** capability-gated on-device WebGPU tier (conditional on a research pass). ★ *recommended (if offline narration quality matters)*
  - **(C)** defer; A stays the floor.
  - *Confidence:* low — pure Nico product call. Template floor (A) always present regardless; ADR-0030 boundary unaffected.
- **dependsOn:** — · **Audit:** master G,I-14.

### GD-0040 — Future Contracts/CLM extraction-seam decision
- **One-line:** Consolidate the duplicate future-Contracts/CLM footnotes into one defer-and-keep-seam decision with an observable trigger.
- **Current status:** draft; scope GDDR; ADR-0073/0075 untouched. **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — dedicated Contracts/CLM context post-MVP, owned where?:**
  - **(A)** defer-keep-seam in GD-0040. ★ *recommended (lowest-regret; removes drift, commits nothing)*
  - **(B)** pre-commit now — *reject.*
  - **(C)** drop the seam — *reject.*
  - *Confidence:* medium.
- **dependsOn:** — · **Audit:** master G,I-14.

## Batch 1

### ADR-0092 — Vault governance status SSOT + ref-integrity sweep
- **One-line:** Frontmatter status canonical; fold outbox/renumber/eleven/audit_log fixes into the ADR-0089 PR.
- **Current status:** draft; new governance ADR. **Disposition:** ratify-with-amendment.
- **Open D-question — status SSOT + sweep + audit_log:**
  - **(A)** fold the sweep into the ADR-0089 apply-PR + drop platform audit_log. ★ *recommended (drop audit_log with ADR-0097)*
  - **(B)** per-ADR notes.
  - **(C)** log-only.
  - *Confidence:* high.
- **dependsOn:** — · **Audit:** master C-1/2/3,F,I-1.

### ADR-0093 — Joint ratification wave (0012+0014 promote, 0088+0089 land)
- **One-line:** Ratify four as one wave + contract_version bumps + 0013→0028 redirect.
- **Current status:** draft; sequencing ADR. **Disposition:** ratify-with-amendment.
- **Open D-question — four together vs piecemeal vs parked:**
  - **(A)** ratify all four together as one wave. ★ *recommended (28-vs-gate routed to GD-0038)*
  - **(B)** piecemeal.
  - **(C)** parked.
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** master A,F,I-2/3.

### GD-0038 — Bounded-context portfolio trim / merge-review gate
- **One-line:** 28 final, or a ceiling under a standing merge-review gate (Scouting/Transfer, Statistics, Media/Narrative, Env&Climate)?
- **Current status:** draft; scope companion to ADR-0089. **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — 28 final vs ceiling-with-gate:**
  - **(A)** 28 final.
  - **(B)** merge-review gate (B-lite: ratify the 28-map, flag explicit MVP merge candidates). ★ *recommended (faithful to ADR-0089 grounding; not a reason to delay ADR-0089)*
  - **(C)** freeze at 19 — *reject.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0093 · **Audit:** master G,I-2/14.

### ADR-0089 — Bounded-context Portfolio Reconciliation
- **One-line:** 19→28 reconciliation with a sound ordinal-key mechanism (D2/D3 ratify as-is); D1 (accept 28 vs standing merge-review gate, GD-0038) is the live scope call.
- **Current status:** draft (proposed/binding:false; does not edit the map). **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question 1 — accept 28 as final, or keep a standing merge-review gate?:**
  - **(A)** accept 28 as the canonical catalog.
  - **(B)** ratify the catalog mechanism but keep D1 open as a first-class standing merge-review gate (GD-0038). ★ *recommended (ratify D2 fixed ordinal key + D3 six subdomain clusters as-is; keep D1 live as GD-0038)*
  - **(C)** collapse merge candidates now — *reject (premature).*
  - *Confidence:* medium.
- **Open D-question 2 — should the apply-PR retire ADR-0019's stale 'eleven' count?:**
  - **(A)** yes — make the bounded-context-map the sole count source, retire 'eleven' (coordinated with ADR-0092). ★ *recommended*
  - **(B)** no — separate pass (weaker).
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

## Batch 2

### ADR-0096 — Match-engine cross-runtime determinism & numeric-surface (finalises 0049)
- **One-line:** Integer/fixed-point surface mandatory; per-profile precedence; 9-stream restatement; runtime fork to Nico.
- **Current status:** draft; supersedes ADR-0049 + ADR-0003. **Disposition:** ratify-with-amendment.
- **FMX-135 follow-up:** [[fmx-135-match-engine-contract-decision-queue-2026-06-12]] resolved the
  runtime/source fork and status/binding cleanup on 2026-06-12. Outcome: D1=B single Rust/WASM module
  everywhere (Wasmtime/browser WebAssembly) with mandatory integer/fixed-point replay surface; D2=A;
  D3=A; D4 single-WASM readiness spike; D5 all six named ADRs `accepted` / `binding: true`.
- **Open D-question — numeric surface + runtime fork:**
  - **(A)** integer/fixed-point mandatory + Rust-native-default spike. ★ *recommended (D1=A regardless of fork)*
  - **(B)** single Rust→WASM module both sides.
  - **(C)** TS-first authoritative runtime — fallback if spike inconclusive.
  - *Note:* D1 (fixed-point mandatory) holds regardless; the A/B/C is the runtime fork, with C as the explicit fallback. Also folds the ADR-0003 carry-forward appendix + 9-stream restatement; sets per-quality-profile determinism precedence (byte-identical for competitive-full/interactive-standard; statistical-envelope for background-fast). *Confidence:* high.
- **dependsOn:** ADR-0093 · **Audit:** master C-4,F,I-4 (see also [[adr-re-audit-c3-2026-06-08]]).

### ADR-0097 — PostgreSQL scale envelope + audit canonicalisation (supersedes 0027)
- **One-line:** Bound schema-per-save (ceiling + cold/archive); drop platform audit_log; pin Postgres 18.x.
- **Current status:** draft; supersedes ADR-0027, amends ADR-0028. **Disposition:** ratify-with-amendment · **scope-call**. **supersedes:** ADR-0027 (+ amends ADR-0028).
- **Open D-question — scale envelope + audit + schema ceiling + SurrealDB seam:**
  - **(A)** keep schema-per-active-save + documented per-node ceiling + cold/archive fallback; keep SurrealDB 1.x deferred seam; drop platform audit_log (outbox = domain trail, ADR-0091 = security trail). ★ *recommended (D1=A, D2=A; the ceiling band + SurrealDB keep-vs-drop are scope/ops calls)*
  - **(B)** hybrid / drop SurrealDB seam.
  - **(C)** row-level tenancy + RLS — *reject (loses mechanical isolation).*
  - *Confidence:* medium (scale band is directional, not project-measured). Pin Postgres 18.x at implementation.
- **dependsOn:** ADR-0092 · **Audit:** master C-1,D,F,I-6.

### ADR-0095 — Double-entry ledger posting invariant (supersedes 0050 shape-only)
- **One-line:** Balanced double-entry postings + invariant table + assets=liabilities+equity check.
- **Current status:** draft; partial supersede of ADR-0050 (shape only). **Disposition:** ratify-with-amendment. **supersedes:** ADR-0050 (posting-model shape only; boundary unchanged).
- **Open D-question — posting shape (genuine A-vs-B):**
  - **(A)** balanced double-entry (≥2 lines summing to zero, accountCode per line, reversal = offsetting pair). ★ *recommended (A-vs-B is Nico's; matches TigerBeetle/Modern Treasury, makes reversal/replay mechanically checkable)*
  - **(B)** single-entry + enforced projection identity (weekly reconcile + contra-account).
  - **(C)** status quo (single signed amount, no identity invariant) — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0097 · **Audit:** master A,F,I-7; pair with ADR-0101.

### ADR-0101 — Settlement collapse + quality-profile enum + insolvency postings
- **One-line:** Deterministic MoneyBand→amountMinor collapse + canonical 4-valued enum + named insolvency postings + shared insolvency enum.
- **Current status:** draft; new reconciliation ADR. **Disposition:** ratify-with-amendment.
- **Open D-question — fix-location + collapse rule + enum + insolvency:**
  - **(A)** one ADR carrying the canonical 4-valued quality-profile enum + the deterministic (replay-byte-identical) MoneyBand→amountMinor collapse (one versioned rule, seeded variant co-equal) + named insolvency→ledger postings + one shared insolvency enum referenced by ADR-0050/0079. ★ *recommended (balanced postings GATED on ADR-0095)*
  - **(B)** per-PR fixes — *reject.*
  - **(C)** defer — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0095, ADR-0096 · **Audit:** master C-6,F,I-8.

### ADR-0099 — Spectator streaming over committed event log (supersedes 0015)
- **One-line:** Event-log streaming, no persisted snapshots (removes the ADR-0026 contradiction); post-MVP gate; online-only.
- **Current status:** draft; supersedes ADR-0015. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0015.
- **Open D-question — substrate + status + offline boundary:**
  - **(A)** event-log-only streaming + replay cursor (per ADR-0049), delay at delivery, no persisted snapshots; post-MVP gate; online-only within ADR-0090's narrow sync scope. ★ *recommended (all three; sequence before/with ADR-0087)*
  - **(B)** persisted-snapshot delivery cache alongside the log.
  - **(C)** park entirely — *reject.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0096 · **Audit:** master C-5,F,I-5.

## Batch 3

### ADR-0094 — i18n stack & locale scope (supersedes 0006)
- **One-line:** Paraglide v2 + format.js + Tolgee v6, DE/EN/FR/ES/IT; ICU-MF1 spike before ratify.
- **Current status:** draft; supersedes ADR-0006. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0006.
- **Open D-question — i18n stack (ICU-MF1 sufficiency gate):**
  - **(A)** Paraglide JS + format.js Intl polyfills + self-hosted Tolgee TMS, locales DE/EN/FR/ES/IT. ★ *recommended (best PWA offline bundle + native TanStack Start SSR; casus-slot/ICU-MF1 spike pre-Sprint-1)*
  - **(B)** i18next + i18next-icu (richest ecosystem, ~4× bundle).
  - **(C)** Lingui (compiled catalogs, weaker TanStack story).
  - *Confidence:* high. Library choice is a real PWA-bundle/SSR tech decision — HITL gate; ICU-MF1 (flected club names / slavic plurals) must validate before locking.
- **dependsOn:** — · **Audit:** master A,F,I-9 (see also [[adr-re-audit-c1-2026-06-08]]).

### GD-0039 — C6 status reconciliation & People-first ratification order
- **One-line:** Record canonical C6 status (0051/0053/0061 = draft) + People-first order; fold status into ADR-0092.
- **Current status:** draft; governance GDDR for C6. **Disposition:** ratify-with-amendment.
- **Open D-question — record C6 status + order without editing ADR files:**
  - **(A)** central note (People/ADR-0052 keystone, upstream-first). ★ *recommended*
  - **(B)** per-ADR notes — *reject.*
  - **(C)** log-only — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0093 · **Audit:** master G,I-11.

### ADR-0100 — Story-thread ownership & naming (StoryThread vs CoverageThread)
- **One-line:** Narrative owns StoryThread; Media Ecology = CoverageThread; storyThreadId correlation-only.
- **Current status:** draft; partial supersede of ADR-0076 + ADR-0085 (thread-ownership portions only). **Disposition:** ratify-with-amendment. **supersedes:** ADR-0076 + ADR-0085 (thread-ownership portions only).
- **Open D-question — ownership/naming + X2 media-publication seam + media RNG owner:**
  - **(A)** per-context names: Narrative owns thread origination (StoryThread), Media Ecology renames to CoverageThread, storyThreadId is correlation-only; PressPublicationPolicy = Narrative vs cadenceProfile = Media Ecology; media RNG via WorldAiMgmtRng:media:* sub-label. ★ *recommended (all three; A-vs-C least certain)*
  - **(B)** Media Ecology sole owner of the thread aggregate.
  - **(C)** thin shared StoryThread contract owned by neither.
  - *Confidence:* medium.
- **dependsOn:** ADR-0093 · **Audit:** master C-7,E-5,F,I-12.

### ADR-0103 — Multi-agent orchestration & conflict serialization (supersedes 0009)
- **One-line:** Generalise serialize-contracts / fan-out-beats tool-agnostically + cross-link ADR-0044/0045/0046.
- **Current status:** draft; supersedes ADR-0009. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0009.
- **Open D-question — retire ADR-0009 + branch-naming:**
  - **(A)** tool-agnostic orchestration ADR (preserves the serialization insight, retires the Cursor-only framing). ★ *recommended (branch-naming via the ADR-0045 amendment)*
  - **(B)** mark stale via the Decision-Log only.
  - **(C)** fold into ADR-0045.
  - *Confidence:* medium.
- **dependsOn:** — · **Audit:** master F,I-13.

### ADR-0104 — Mobile-delivery grounding + ratification (supersedes 0025)
- **One-line:** Ground iOS-push / EU-DMA claims, pin Capacitor 7.x, convert the skipped default to explicit ratification (or gate).
- **Current status:** draft; supersedes ADR-0025. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0025.
- **Open D-question — ratify vs gate; 7.x vs 8.x; claims accurate?:**
  - **(A)** keep ADR-0025 as-is.
  - **(B)** grounding pass + pin Capacitor 7.x + explicit Nico ratification (direction unchanged: responsive PWA = source of truth, thin additive Capacitor shell, no web-code fork). ★ *recommended (C fallback; re-check EU-DMA before build)*
  - **(C)** defer behind a 'mobile-iOS launch?' gate.
  - *Confidence:* low. Not MVP-blocking.
- **dependsOn:** — · **Audit:** master F,I-13.

## Batch 4

### ADR-0010 — Klubhaus Design-System
- **One-line:** Tokenized design-system approach is sound (matches Nico's standing rule); thinnest pre-convention frontmatter + possibly-drifted shadcn/screen snapshot + unpinned Tailwind v4 minor.
- **Current status:** draft (weak — pre-convention frontmatter). **Disposition:** ratify-with-amendment.
- **Open D-question — pre-convention frontmatter + drifted snapshot + unpinned Tailwind:**
  - **(A)** leave as-is.
  - **(B)** light hygiene amendment: normalize frontmatter to vault convention, fold in ADR-0048's token-single-source (one head), add reciprocal `amended_by: ADR-0048`, re-confirm shadcn-deferral + Tailwind-v4 + data-scheme token decisions. ★ *recommended*
  - **(C)** defer to the design-system implementation wave.
  - *Confidence:* medium. Substance ratified; only frontmatter/lineage + version-pin currency need the amendment.
- **dependsOn:** — · **Audit:** [[adr-re-audit-c1-2026-06-08]].

### ADR-0011 — Server-Authoritative Multiplayer
- **One-line:** Strong, ground-truth-consistent (server-only FSM authority, idempotent UUIDv7 commands, encrypted saves, hard-reject offline conflict); only partial ADR-0013→0028 outbox citation rot + status-vs-body mismatch.
- **Current status:** draft (binding:true frontmatter; body 'Accepted'). **Disposition:** ratify-with-amendment.
- **Open D-question — stale outbox citations + status mismatch:**
  - **(A)** reopen→re-ratify unchanged; sweep the ADR-0013→0028 citations + reconcile status via the ADR-0092 governance pass (no in-place edit). ★ *recommended*
  - **(B)** standalone superseding ADR for the citation fix — *reject (duplicates ADR-0092).*
  - **(C)** ratify as-is, leave the stale citation — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0014 — Explicit State Machines
- **One-line:** Correct, universally-relied-on FSM pattern stuck at 'parked' while ADR-0088 extends it — promote via the ADR-0093 joint wave.
- **Current status:** draft (proposed/binding:false; 'keep parked'). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0093.
- **Open D-question — promote the parked-but-relied-on FSM pattern?:**
  - **(A)** promote to accepted inside the ADR-0093 wave (with 0012/0088/0089), redirect ADR-0013→0028, wire in the ADR-0088 choreography invariant. ★ *recommended*
  - **(B)** keep parked, restate locally per FSM — *reject.*
  - **(C)** promote standalone, decoupled from 0012/0088 — *reject (mutually load-bearing).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0093 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0012 — Async Multiplayer Cadence Models
- **One-line:** Sound Fixed+Dynamic cadence design; 'no mid-cycle mutation' invariant load-bearing but unratified; carries an embedded FMX-102 amendment. **Pair: ratify with ADR-0088.**
- **Current status:** draft (proposed/binding:false; 'keep parked'). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0093.
- **Open D-question — ratify the cadence rule-set + resolve the embedded FMX-102 amendment + wall-clock-vs-seeded boundary:**
  - **(A)** ratify jointly with ADR-0088 (+0014) via ADR-0093, land the embedded amendment, redirect ADR-0013→0028, pin the boundary (cadence timers = wall-clock by design; deadlines never use wall-clock inside the seeded engine). ★ *recommended*
  - **(B)** ratify alone, leave the FMX-102 amendment dangling — *reject.*
  - **(C)** strip the embedded amendment, ratify the base only — *reject.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0093, ADR-0088 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0088 — Async Escalation FSM + Watch-Party Deadline Source-of-Truth
- **One-line:** Strongest-engineered cluster ADR (escalation FSM + broadcast_at deadline anchor, golden-trace invariants); un-ratifiable until 0012/0014 promote; adds payload fields to two ratified events without an explicit contract_version note. **Pair: ratify with ADR-0012.**
- **Current status:** draft (proposed; depends on parked 0012/0014). **Disposition:** ratify-with-amendment.
- **Open D-question — how to ratify given the parked deps + the implicit contract_version bump:**
  - **(A)** ratify jointly with the 0012/0014 promotion via the ADR-0093 wave, and make the WatchPartyScheduled / MatchdayOpened contract_version bump explicit at ratify. ★ *recommended*
  - **(B)** ratify standalone ahead of 0012/0014 — *reject (rests on parked deps).*
  - **(C)** ratify without contract_version discipline — *reject (version-skew risk).*
  - *Confidence:* high. (D4=B seeded variance correct; ES3 variance bounds deferred to FMX-52.)
- **dependsOn:** ADR-0092, ADR-0093, ADR-0012, ADR-0014 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0017 — Self-hosted Observability & Logging
- **One-line:** Stack confirmed current best practice mid-2026 (Alloy correctly anticipated Grafana-Agent EOL); only status/lifecycle drift + stale SurrealDB-as-source wording — content unchanged.
- **Current status:** draft (three conflicting status truths). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile status drift + stale SurrealDB-as-source wording:**
  - **(A)** superseding ADR: re-state the stack as still-current, purge stale SurrealDB language, record the Alloy-vs-upstream-OTel-Collector neutrality trade-off, reconcile status (makes it implementation-ready). ★ *recommended if Nico wants it implementation-ready now*
  - **(B)** lightweight amendment banner + let ADR-0092 carry status reconciliation vault-wide.
  - **(C)** leave as-is, defer to build phase.
  - *Confidence:* high. Substrate cleanup depends on the ADR-0097 Postgres resolution.
- **dependsOn:** ADR-0092, ADR-0097 · **Audit:** [[adr-re-audit-c9-2026-06-08]].

### ADR-0019 — Service-ready Modular Monolith with DDD
- **One-line:** Architecture sound; binding ADR stale (eleven-context count two reconciliations behind; ADR-0013 outbox citation superseded) — corrected via the ADR-0092 sweep, not in-place.
- **Current status:** draft (binding:true; body 'Accepted'). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0092.
- **Open D-question — correct the stale artefacts without editing the binding style-ADR:**
  - **(A)** land the ADR-0092 reference-integrity sweep: restate count-agnostically, redirect ADR-0013→0028, retire 'eleven' in the ADR-0089 apply-PR. ★ *recommended*
  - **(B)** dedicated superseding ADR for 0019 alone.
  - **(C)** in-place amend — *reject (violates read-only / single-source).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0089 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0018 — Systemic Events and Player Lifecycle
- **One-line:** Sound systemic-events architecture marred by dangling 'ADR-0010' citations (renumbered to ADR-0019), stale ADR-0013 outbox refs, hardcoded 'eleven' — all via the ADR-0092 sweep.
- **Current status:** draft (body 'Accepted'; cites renumbered ADR-0010 twice). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0092.
- **Open D-question — correct dangling renumber refs + outbox citation + hardcoded count:**
  - **(A)** fold all three fixes into the ADR-0092 sweep (redirect ADR-0010→0019, ADR-0013→0028, drop hardcoded 'eleven'). ★ *recommended*
  - **(B)** dedicated housekeeping note for 0018 alone.
  - **(C)** leave the dangling refs — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0019, ADR-0089 · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### GD-0017 — MVP Scope and Mode Sequencing
- **One-line:** Pure product/scope decision (Roguelite-first, Career-later, hybrid-online MVP, export/import + multiplayer + full-offline deferred); verbatim-consistent with canonical MVP-Scope. No technical driver.
- **Current status:** draft (supersede-head for older both-modes-day-0 notes). **Disposition:** ratify-as-is · **scope-call**.
- **Open D-question — re-affirm the MVP boundary?:**
  - **(A)** ratify as-is (verbatim-consistent; every dependency aligned). ★ *recommended*
  - **(B)** widen MVP to ship Career playable day 0 — *contradicts canonical scope.*
  - **(C)** make full offline-first singleplayer an MVP requirement — *contradicts canonical scope.*
  - *Confidence:* high. A workflow cannot pre-decide MVP scope, so genuinely scopeCallForNico even though everything aligns to A.
- **dependsOn:** ADR-0020 · **Audit:** [[gd-re-audit-g1-2026-06-08]].

### ADR-0022 — Animation & Game-Feel Stack
- **One-line:** Role split (Motion for UI/gesture/layout + GSAP for choreographed/in-canvas + Tailwind keyframes) sound and externally re-verified for 2026; only version pins + stale bundle figure need refresh.
- **Current status:** draft (sound; version pins to refresh). **Disposition:** ratify-with-amendment.
- **Open D-question — ratify with a version-pin/bundle-figure refresh?:**
  - **(A)** ratify with amendment: keep the role split, refresh the Framer-Motion-era '≈4.6kb' figure, add explicit pins (Motion ^12, GSAP ^3.13, @gsap/react) per ADR-0021's no-latest rule. ★ *recommended*
  - **(B)** ratify as-is; refresh pins/figures only at implementation start.
  - *Confidence:* high.
- **dependsOn:** ADR-0021 · **Audit:** [[adr-re-audit-c1-2026-06-08]].

### ADR-0023 — Realtime Transport (SSE MVP + Centrifugo upgrade path)
- **One-line:** Sound + current best practice (SSE behind a swappable interface, Centrifugo upgrade path); no Centrifugo version pin + HTTP/2-at-proxy requirement buried.
- **Current status:** draft (body 'Accepted'; frontmatter draft). **Disposition:** ratify-with-amendment.
- **Open D-question — ratify given the missing version pin + buried HTTP/2 invariant:**
  - **(A)** reopen→re-ratify the interface + SSE-MVP + Centrifugo-upgrade as-is; on the upgrade ticket pin a real Centrifugo version (v5.x) + promote 'HTTP/2 at the Dokploy reverse proxy' to a one-line crosscutting invariant (ADR-0044 territory). ★ *recommended*
  - **(B)** ratify fully as-is; track pin + HTTP/2 as backlog notes only (weaker).
  - **(C)** hold ratification until Centrifugo is scheduled — *reject (SSE-MVP independently ratifiable today).*
  - *Confidence:* high.
- **dependsOn:** — · **Audit:** [[adr-re-audit-c4-2026-06-08]].

### ADR-0025 — Mobile Delivery (PWA + Capacitor)
- **One-line:** Direction sound (PWA source of truth + thin additive Capacitor shell, no fork) but an un-ratified default with un-sourced 2026 push/DMA claims + no Capacitor/min-iOS anchor — supersede via ADR-0104.
- **Current status:** draft (weak — under-grounded + version-stale). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0104.
- **Open D-question — how to land the mobile-delivery decision?:**
  - **(A)** keep as-is.
  - **(B)** grounding pass (ADR-0104): pin claims to dated sources, state target Capacitor major + min iOS, explicit Nico ratification; direction unchanged. ★ *recommended (cheap; converts a self-described un-ratified default into an explicit decision)*
  - **(C)** defer behind a 'mobile-iOS launch?' gate.
  - *Confidence:* medium. Not MVP-blocking.
- **dependsOn:** ADR-0008 · **Audit:** [[adr-re-audit-c1-2026-06-08]].

### ADR-0045 — Issue-first + Git-Worktree Agent Workflow
- **One-line:** One-issue↔one-worktree↔one-branch with staged enforcement is the standard low-cost parallel-agent model; needs a small branch-naming reconciliation.
- **Current status:** draft. **Disposition:** ratify-with-amendment.
- **Open D-question — two coexisting branch-naming conventions (tool/fmx-n-slug vs claude/<thema>):**
  - **(A)** amend ADR-0045 to record BOTH accepted forms — `tool/fmx-n-slug` for issue-scoped work, `tool/<thema>` for cross-cutting/meta sweeps — and state which gates apply to each. ★ *recommended*
  - **(B)** tighten to one form (`tool/fmx-n-slug` only), treat `claude/<thema>` as a violation to migrate.
  - *Confidence:* low. Workflow-ergonomics call for Nico.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c9-2026-06-08]].

### ADR-0046 — Team Topology & Multi-Lead Scaling
- **One-line:** Future-scope intent sound and dormant-while-solo; the '11 bounded contexts' premise is stale vs ADR-0089's catalog of 28.
- **Current status:** draft. **Disposition:** ratify-with-amendment.
- **Open D-question — correct the stale '11 contexts' premise now or defer?:**
  - **(A)** amend to replace '11' with the ADR-0089 catalog AND make the ownership unit the CLUSTER (per ADR-0089 grouping), not the individual context. ★ *recommended (low-cost; aligns ownership with the cluster grouping)*
  - **(B)** leave dormant until the 2nd lead joins, then rewrite against the live count.
  - *Confidence:* medium (genuinely future-scope; may be rewritten anyway).
- **dependsOn:** ADR-0089, ADR-0092 · **Audit:** [[adr-re-audit-c9-2026-06-08]].

### ADR-0009 — Cursor Cloud Agent Orchestration
- **One-line:** The serialize-shared-contracts insight is worth preserving, but the Cursor-only framing + 'cloud agents do most implementation' premise are out of date — generalise tool-agnostically via ADR-0103.
- **Current status:** draft (body 'accepted' + binding:true — contradiction). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0103.
- **Open D-question — retire the Cursor-only framing while keeping the serialization insight:**
  - **(A)** superseding ADR-0103 (generalises across all three agents, links 0044/0045/0046, retires the stale framing). ★ *recommended*
  - **(B)** in-place amend — *not permitted under the read-only rule.*
  - **(C)** mark stale via the Decision-Log only; defer generalisation.
  - *Confidence:* medium. Low-priority housekeeping.
- **dependsOn:** ADR-0092, ADR-0044, ADR-0045, ADR-0046 · **Audit:** [[adr-re-audit-c9-2026-06-08]].

## Batch 5

### ADR-0026 — Match Frame Contract
- **One-line:** Cluster keystone; ten rules decisively resolve every engine↔renderer fork; only latent coupling is the four-profile enum (reconciled in ADR-0101).
- **Current status:** draft (binding:true; strongest ADR in the cluster). **Disposition:** ratify-as-is.
- **Open D-question — flagged human-decision forks HF-1/HF-2:**
  - **(A)** treat HF-1/HF-2 as already-flagged in-ADR forks Nico resolves at ratify time; no new framing needed. ★ *recommended (also pin the quality-profile enum as engine-port-owned — that reconciliation lives in ADR-0101, not here)*
  - **(B)** pull HF-1/HF-2 into a separate decision card.
  - **(C)** defer HF-1/HF-2 indefinitely.
  - *Confidence:* high.
- **dependsOn:** — · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0003 — Match Engine Architecture
- **One-line:** Declared-superseded engine ADR whose still-live content (stale '8 RNG streams', undefined carry-forward set) is folded forward by ADR-0096; do not edit in place.
- **Current status:** draft (declared superseded_by ADR-0049; DL agrees). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0096.
- **Open D-question — resolve the carry-forward set + RNG stream-count drift (8 vs locked 9):**
  - **(A)** resolve inside ADR-0096: add a 'rules carried forward from ADR-0003' appendix + restate 9 streams there; never edit ADR-0003. ★ *recommended*
  - **(B)** edit ADR-0003 in place (8→9 + enumerate) — *reject (breaks supersession hygiene).*
  - **(C)** leave as historical with no successor appendix — *reject.*
  - *Confidence:* high.
- **dependsOn:** ADR-0096, ADR-0026 · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0027 — PostgreSQL Data Model (schema-per-save, Drizzle SoT)
- **One-line:** Decision sound (schema-per-save mechanically enforces isolation; lazy migration; Drizzle SoT + generated Zod mirror) but weak on status drift, unbounded scale envelope, audit_log contradiction — superseded by ADR-0097.
- **Current status:** draft (body 'accepted' → status drift). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0097.
- **Open D-question 1 — schema-per-save scale envelope (unbounded → hundreds of thousands of schemas):**
  - **(A)** keep schema-per-save + documented per-node ceiling + cold/archive fallback + pg_dump/PITR-at-scale note; pin Postgres 18.x. ★ *recommended*
  - **(B)** hybrid: schema-per-ACTIVE-save, row-level/cold-blob for archived.
  - **(C)** row-level tenancy + saveId predicate + RLS — *loses mechanical isolation.*
  - *Confidence:* medium.
- **Open D-question 2 — audit_log (three conflicting positions):**
  - **(A)** drop the platform audit_log (outbox = domain trail, ADR-0091 = security trail). ★ *recommended (both successors lean this way)*
  - **(B)** keep a thin audit_log projection fed from the outbox, documented as derived.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0093, ADR-0096 · **Audit:** [[adr-re-audit-c2-2026-06-08]].

### GD-0015 — IP-clean Data Generation
- **One-line:** Full-IP-clean v1 rules restate accepted ADR-0007 and ratify cleanly; amendment surfaces two product/legal scope calls + parks the generation-algorithm research.
- **Current status:** draft (rules restate accepted ADR-0007 + FMX-54). **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question 1 — community datapack opt-in (default off, revisit M5+):**
  - **(A)** keep default-off, local/P2P only at MVP, revisit M5+ (minimal IP/DSA/privacy surface). ★ *recommended*
  - **(B)** allow opt-in import now with best-effort post-normalisation validation + warning.
  - **(C)** enable hosted pack distribution now.
  - *Confidence:* high.
- **Open D-question 2 — editor-typed real names:**
  - **(A)** EULA + warning dialog, local-only, never shipped or synced. ★ *recommended (preserves local freedom, keeps real names out of shipped/synced data)*
  - **(B)** hard-block real-name input even locally.
  - **(C)** allow and sync user-entered real names — *reject on IP grounds.*
  - *Confidence:* high.
- *Overall scope recommendation:* A as floor + C overlay (procedural + curated evocative-but-not-real seed lists, community packs as overlay). **dependsOn:** ADR-0007, ADR-0004 · **Audit:** [[gd-re-audit-g1-2026-06-08]].

### ADR-0059 — Community Overlay Pipeline Context
- **One-line:** BC placement sound (six-of-six DDD); two data-side gaps. **Pair: ratify with ADR-0016.**
- **Current status:** draft / sound-proposal. **Disposition:** ratify-with-amendment.
- **Open D-question 1 — ActivePacksSnapshot not encoded in SavePayload (determinism/loadability hole):**
  - **(A)** add an explicit SavePayload activePacks refs field + missing-pack import path (folds into the ADR-0098 save-format refresh). ★ *recommended*
  - **(B)** rely on ADR-0016 §Compliance prose only.
  - *Confidence:* medium.
- **Open D-question 2 — override-pack structural validation against integer/Zod/CHECK invariants implicit:**
  - **(A)** tie ManifestSchema validation to the ADR-0027 Zod/CHECK bounds. ★ *recommended*
  - **(B)** leave structural validation implicit.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0016, ADR-0027 · **Audit:** [[adr-re-audit-c2-2026-06-08]].

### ADR-0005 — Save Format and Versioning
- **One-line:** Structurally strong (compress-then-encrypt, AEAD AAD, three version fields, RNG snapshot) — weak only on KDF (Argon2id has overtaken PBKDF2 for passphrases) + a missing activePacks contract; both addressed by ADR-0098.
- **Current status:** draft. **Disposition:** supersede-by-new. **supersededByNew:** ADR-0098.
- **Open D-question 1 — KDF for the portable-export passphrase path:**
  - **(A)** keep PBKDF2 for the high-entropy device-backup key; move the portable-export passphrase to Argon2id via WASM, gated behind the kdfAlgo envelope field. ★ *recommended*
  - **(B)** keep PBKDF2 everywhere, raise iterations ('fine' not best-practice).
  - **(C)** Argon2id everywhere (overkill for the device-key path).
  - *Confidence:* medium.
- **Open D-question 2 — SavePayload does not encode active-pack references:**
  - **(A)** add an explicit activePacks refs field + missing-pack import path; tie ManifestSchema validation to ADR-0027 bounds. ★ *recommended*
  - **(B)** leave it implicit in ADR-0016 §Compliance prose.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0016, ADR-0059 · **Audit:** [[adr-re-audit-c2-2026-06-08]].

### ADR-0098 — Save-format KDF Argon2id + active-pack refs (supersedes 0005)
- **One-line:** Argon2id on the portable passphrase, keep PBKDF2 device key; add activePacks + missing-pack gate.
- **Current status:** draft; partial supersede of ADR-0005. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0005 (KDF + active-pack portions).
- **Open D-question — passphrase KDF + missing-pack import:**
  - **(A)** split KDF (Argon2id passphrase / PBKDF2 device key) + block load on missing pack. ★ *recommended (D1=A; D2 lead A, the missing-pack UX is Nico's)*
  - **(B)** PBKDF2 everywhere / degrade gracefully.
  - **(C)** Argon2id-all / fetch missing packs.
  - *Confidence:* medium.
- **dependsOn:** ADR-0005, ADR-0016, ADR-0059 · **Audit:** master F,I-10.

### ADR-0028 — PostgreSQL Transactional Outbox
- **One-line:** Substrate rework sound and current (same-transaction insert; polling-floor + LISTEN/NOTIFY as latency-only; monthly partitioning); weak only on status drift + the audit-table contradiction, both fixed by ADR-0097's amendment.
- **Current status:** draft (body 'accepted' → status drift). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0097.
- **Open D-question — canonical audit-trail split (§7 'outbox IS the audit trail' vs 0027/0091):**
  - **(A)** outbox = business/domain event trail; ADR-0091 hash-chained log = security/tamper-evidence trail; drop the platform audit_log. ★ *recommended (matches both successors)*
  - **(B)** keep a thin audit_log projection fed from the outbox, documented as derived.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0093, ADR-0027 · **Audit:** [[adr-re-audit-c2-2026-06-08]].

### ADR-0030 — LLM Out Of Authoritative State Boundary
- **One-line:** Textbook LLM-out-of-state boundary (deterministic-first, post-commit enrichment, no parse-back, kill-switch, cost caps, arch guard); sound — reopen→re-ratify as-is. The only open item is the SEPARATE offline-narration product call (GD-0037).
- **Current status:** draft. **Disposition:** ratify-as-is.
- **Open D-question — on-device WebGPU tier between templates and cloud LLM? (tracked as GD-0037, not a defect here):**
  - **(A)** templates = guaranteed offline baseline; cloud LLM the only enrichment tier (no on-device path).
  - **(B)** add an optional capability-gated on-device WebGPU tier BETWEEN templates and cloud; templates stay the guaranteed baseline (requires a version-pinning + device-capability research pass first). ★ *recommended if offline narration quality is a product priority — Nico's product call*
  - **(C)** defer the on-device question entirely; revisit post-MVP.
  - *Confidence:* low. The ADR-0030 boundary ratifies as-is regardless of this answer.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c8-2026-06-08]].

### ADR-0047 — Babylon.js as 3D / Isometric Presentation Engine
- **One-line:** Sound, version-current (Babylon 9.11.0) engine swap behind the unchanged presentation seam; one process caveat — R3F-era bundle budgets unre-validated for Babylon + no in-vault fit-test artifact.
- **Current status:** draft (binding:false; amends 0029 §2 + 0041). **Disposition:** ratify-with-amendment.
- **Open D-question — Babylon bundle-budget re-validation outstanding:**
  - **(A)** keep the decision; on promotion pin a Babylon-specific lazy-load + Floor-tier-2D-fallback budget + record the test device. ★ *recommended (track as promotion debt, not a ratification blocker; handle inside the 0029/0041/0047 consolidation)*
  - **(B)** block ratification until a fresh on-device Babylon measurement exists.
  - **(C)** re-validate R3F-vs-Babylon entirely.
  - *Confidence:* medium.
- **dependsOn:** — · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0029 — 3D Presentation Layer
- **One-line:** Core decision sound; §2/§Rationale prose still says Three.js/R3F while Babylon is the live choice. Fix by consolidating 0029/0041/0047 into one presentation ADR, not another banner.
- **Current status:** draft (binding:true; §2/§Rationale stale). **Disposition:** ratify-with-amendment.
- **Open D-question — fix the self-contradicting body:**
  - **(A)** do not edit in place; when the presentation ADRs are promoted out of draft, consolidate 0029 §2/§Rationale + 0041 + 0047 into ONE presentation-renderer ADR. ★ *recommended (editorial, not a re-litigation)*
  - **(B)** add another in-place banner.
  - **(C)** edit §2/§Rationale directly to say Babylon.
  - *Confidence:* high.
- **dependsOn:** ADR-0047 · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0041 — Two-Renderer Presentation Strategy
- **One-line:** Sound two-renderer guardrail, now a two-hop indirection (body says R3F, banner says Babylon). Amend by consolidating 0029/0041/0047; keep the guardrail intact.
- **Current status:** draft (binding:true; Decision body names R3F). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the R3F body vs Babylon choice:**
  - **(A)** consolidate with 0029 + 0047 into one presentation-renderer ADR; no in-place edit. ★ *recommended*
  - **(B)** add another banner.
  - **(C)** edit the Decision body directly.
  - *Confidence:* high.
- **dependsOn:** ADR-0047 · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0049 — Swappable Spatial-Event Match Engine
- **One-line:** Sound future-open MatchEnginePort boundary, but the cross-runtime determinism contract + spike governance under-specified; finalised by ADR-0096.
- **Current status:** draft (boundary sound, determinism under-specified). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0096.
- **Open D-question 1 — byte-stable cross-runtime replay (native↔WASM float equality not guaranteed):**
  - **(A)** pin integer/fixed-point as a HARD invariant for all replay-bearing computation; keep the Rust-native-default spike; per-quality-profile precedence. ★ *recommended (removes the divergence class; Nico's seeded-variance lean is gameplay-RNG, not numeric equality)*
  - **(B)** single-runtime Rust→WASM both sides.
  - **(C)** TS authoritative MVP runtime, Rust as a future swap.
  - *Confidence:* high.
- **Open D-question 2 — determinism regime per quality profile:**
  - **(A)** byte-identical event log for competitive-full/interactive-standard; statistical-envelope only for background-fast. ★ *recommended (pin precedence in ADR-0096)*
  - **(B)** unconditional byte-equality across all profiles.
  - **(C)** leave precedence unstated, decide per-feature.
  - *Confidence:* high.
- **Open D-question 3 — spike governance (owner/deadline/fallback):**
  - **(A)** record owner + deadline + explicit MVP fallback = TS-first if inconclusive. ★ *recommended*
  - **(B)** keep the open-ended gate with no who/when/fallback.
  - **(C)** commit to Rust-native now, skip the spike.
  - *Confidence:* medium.
- **dependsOn:** ADR-0026 · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0015 — Spectator Snapshot Streaming
- **One-line:** Stale — 'persist snapshot per virtual minute' contradicts ADR-0026's no-persisted-snapshots rule + status drift + no offline-first boundary. Superseded by ADR-0099.
- **Current status:** draft (Proposed/binding:false; DL: post-MVP social). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0099.
- **Open D-question — re-express spectator/watch-party streaming:**
  - **(A)** event-log-only streaming + replay cursor, no persisted snapshots; align status; online-only within ADR-0090's narrow sync scope. ★ *recommended (supersede with ADR-0099; sequence before/with ADR-0087)*
  - **(B)** keep a persisted-snapshot stream as an optimization alongside the log.
  - **(C)** defer the spectator model entirely.
  - *Confidence:* medium.
- **dependsOn:** ADR-0096, ADR-0026, ADR-0049 · **Audit:** [[adr-re-audit-c3-2026-06-08]].

### ADR-0090 — Offline Sync scope + conflict strategy
- **One-line:** Sound and current ground-truth (server-authoritative re-validation + rebase; CRDTs confined to non-authoritative overlays); only fix is a one-line Replicache→Zero citation refresh.
- **Current status:** draft. **Disposition:** ratify-with-amendment.
- **Open D-question — Replicache citation (sunset/open-sourced; successor is Zero):**
  - **(A)** one-line citation refresh on ratify (Replicache→Zero sunset; borrowed command-replay pattern unchanged); decision content stays as-is. ★ *recommended (no superseding ADR needed)*
  - **(B)** leave the stale Replicache citation in place.
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c2-2026-06-08]].

### ADR-0102 — Notification re-ratification + offline-delivery clause (supersedes 0043)
- **One-line:** Re-state ADR-0043 unchanged (fix status drift) + offline clause (inbox-first; channels best-effort; replay via ADR-0090).
- **Current status:** draft; supersedes ADR-0043. **Disposition:** ratify-with-amendment. **supersedes:** ADR-0043.
- **Open D-question — resolve status drift + offline-seam gap:**
  - **(A)** frontmatter + re-ratification note.
  - **(B)** superseding ADR + offline clause (status half could fold into ADR-0092). ★ *recommended*
  - **(C)** dossier-only.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0090 · **Audit:** master F,I-12.

### ADR-0043 — Notification and Messaging Platform
- **One-line:** Well-reasoned platform but WEAK on governance — frontmatter/body status drift (cited as 'accepted' by four cluster ADRs) + thin offline-first framing (predates ADR-0090). Superseded by ADR-0102.
- **Current status:** draft frontmatter / body 'accepted' (drift). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0102.
- **Open D-question — how to re-ratify given status drift + online-only delivery channels:**
  - **(A)** frontmatter-as-truth + one-line note (body still self-describes accepted; offline gap remains).
  - **(B)** superseding ADR-0102: re-state unchanged under the gate + explicit offline clause aligning channels to ADR-0090 (inbox-first; SSE/email/push best-effort; replay via the ADR-0090 queue). ★ *recommended (fixes both in one move without editing the old file)*
  - **(C)** leave entirely — *highest future-confusion risk.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0090 · **Audit:** [[adr-re-audit-c8-2026-06-08]].

## Batch 6

### ADR-0050 — Club Economy Accounting Ledger
- **One-line:** Boundary sound but the single-signed ledger has no double-entry / accounting-identity invariant that four downstream corrections depend on — supersede by ADR-0095, decision otherwise unchanged.
- **Current status:** draft (body/log carry stale 'accepted'). **Disposition:** supersede-by-new. **supersededByNew:** ADR-0095.
- **Open D-question — posting model to guarantee assets = liabilities + equity:**
  - **(A)** balanced double-entry postings (≥2 lines summing to zero, accountCode per line, reversal = offsetting pair) + identity check. ★ *recommended (gap is real with high confidence; A-vs-B is Nico's)*
  - **(B)** single-entry + enforced projection identity (weekly reconcile + contra-account).
  - **(C)** status quo — *reject (the current implicit gap).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

### ADR-0053 — Staff Operations Context
- **One-line:** Structurally sound 13th BC (staff hire/fire/contract FSM, role assignment, pipeline-coverage, wage-event emission); ratify-as-is on structure, but the GD-0021 staff-skill effect-activation gate is an open MVP call + accepted/binding status-drift.
- **Current status:** accepted/binding frontmatter, reset to draft (status-drift). **Disposition:** ratify-as-is (structure).
- **Open D-question — staff-skill effect-activation gate for MVP (GD-0021):**
  - **(A)** full staff-skill effects active at MVP.
  - **(B)** minimal/no staff-skill effects at MVP, structure reserved (gate deferred). ★ *recommended (ratify structural ownership now; keep the gate a deferred GD-0021 product decision; the BC boundary does not depend on it)*
  - **(C)** partial: a small whitelisted set at MVP.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0052, GD-0039 · **Audit:** [[adr-re-audit-c6-2026-06-08]].

### ADR-0058 — Club Economy Commercial Impact Boundary
- **One-line:** Boundary sound (no supersession); ratify with a minor amendment routing the in-file status artefact to ADR-0092 and the canonical Investor-ownership sentence to the Investor/ledger consolidation.
- **Current status:** draft (in-file status artefact: frontmatter 'accepted' + mid-file '→ draft'). **Disposition:** ratify-with-amendment.
- **Open D-question — resolve the status artefact + the triangulated Investor-ownership wording:**
  - **(A)** ratify the boundary as-is; fix the status artefact under the ADR-0092 rule (frontmatter canonical) + fold the single canonical Investor-ownership sentence into the Investor consolidation (ADR-0095/0101). ★ *recommended (no boundary change)*
  - **(B)** re-edit in place to delete the stale status block + restate Investor ownership locally (heavier; duplicates the SSOT fix).
  - **(C)** leave both as-is — *reject (export hazard + triangulated wording).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0050 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

### ADR-0063 — Investor Entitlement and Payment Boundary
- **One-line:** Sound draft with the right shape; ratify Option B with a small amendment (single Investor-owner sentence, web-mor|web-psp port split, anti-steering external-link surface) — vendor/refund/age-gate remain HITL/legal.
- **Current status:** draft (proposed/binding:false options ADR; defers the legal call correctly). **Disposition:** ratify-with-amendment.
- **Open D-question — ratify Option B with a small extension, or leave un-amended?:**
  - **(A)** ratify Option B (PaymentProviderPort + server-authoritative idempotent entitlement FSM, account-bound) + amendment (a) single canonical Investor owner, (b) split web-psp → web-mor|web-psp, (c) note the 2024-25 anti-steering/external-link surface — via the Investor consolidation (ADR-0095/0101). ★ *recommended (MoR-first remains the lower-ops EU/US tax+disputes choice; vendor pick stays HITL)*
  - **(B)** ratify Option B unchanged now; defer the split + SSOT sentence (leaves ownership triangulated + the port enum coarse).
  - **(C)** re-open the entitlement-home decision — *reject (Option B shape is correct).*
  - *Confidence:* medium (legal gates genuinely open).
- **dependsOn:** ADR-0092, ADR-0050, ADR-0058 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

### ADR-0069 — League↔Regulations eligibility hand-off
- **One-line:** Good DDD (stateless CompetitionEligibilityPolicy domain service; block/warn/quarantine; pure-fn-over-snapshot replay-safety); weak only on a load-bearing staleness gap — §5/E9 still reserves G25 as open, but ADR-0088 closed it.
- **Current status:** draft / proposed. **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the §5/E9 'reserved hook' for G25 (now closed by ADR-0088) + clarify verdict persistence:**
  - **(A)** annotate at ratify with the ADR-0088 cross-ref (downgrade §5/E9 to 'resolved upstream — policy reads League's authoritative deadline anchor') + a one-line clarification that a rejected verdict IS persisted for audit/replay. ★ *recommended (cheapest, keeps the policy intact)*
  - **(B)** author a tiny superseding ADR re-stating the hand-off with G25 resolved inline.
  - **(C)** leave as-is, rely on ADR-0088's back-reference — *risk the two never get linked.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0056, ADR-0066 · **Audit:** [[adr-re-audit-c7-2026-06-08]].

### ADR-0070 — Fixture / Competition Revenue Profile Contract
- **One-line:** Model published-language contract (League owns rule/cadence facts, CommercialPortfolio interprets, Club Management posts); ratify with an amendment deferring two shared-envelope drifts to ADR-0096/0101.
- **Current status:** draft (ratified A/A/A in body). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the two shared-envelope drifts (3-vs-4 quality-profile enum; undefined MoneyBand→money collapse):**
  - **(A)** ratify the contract as-is; reconcile the quality-profile enum (one canonical enum owned by EngineCapabilities, referenced not re-declared, explicit 4→settlement mapping) + the MoneyBand→amountMinor collapse in the ADR-0101 follow-up. ★ *recommended (shared envelope, no boundary change)*
  - **(B)** re-declare a reconciled enum + collapse rule inside ADR-0070 itself (duplicates ADR-0096/0101; risks a second divergent enum source).
  - **(C)** leave both drifts unreconciled — *reject (settlement-routing + determinism hazards).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0050 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

### ADR-0073 — Player Contract Lifecycle FSM
- **One-line:** Sound design (Squad&Player owns lifecycle truth; Transfer owns Renewal/PreContract/FreeAgent; Regulations owns eligibility; Bosman six-month pre-contract confirmed current). Two small amendments.
- **Current status:** proposed. **Disposition:** ratify-with-amendment.
- **Open D-question 1 — mixed lifecycle state/event table (ubiquitous-language drift):**
  - **(A)** split states and terminal events into two clearly-labelled tables/columns. ★ *recommended (pure editorial)*
  - **(B)** keep one table but annotate each row as state vs event.
  - *Confidence:* high.
- **Open D-question 2 — future-CLM extraction seam kept here AND in ADR-0075:**
  - **(A)** fold both into the single GD-0040 ('defer, keep the seam') decision. ★ *recommended*
  - **(B)** leave each ADR's footnote independent.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0052, GD-0039, GD-0040 · **Audit:** [[adr-re-audit-c6-2026-06-08]].

### ADR-0074 — Tactical-identity fingerprint aggregation
- **One-line:** Sound algorithm extending ADR-0055's fingerprint (five signals, EWMA half-life 15, empirical-Bayes confidence, pure deterministic, no *Rng); weak on one load-bearing point — confidence double-counts uncertainty by using raw n.
- **Current status:** draft / proposed (D1-D4 = A/A/A/A). **Disposition:** ratify-with-amendment.
- **Open D-question — replace raw match-count n with an EWMA-consistent effective sample size?:**
  - **(A)** use n_eff = (Σwᵢ)²/Σwᵢ² (Kish effective N of the exponential weights) — principled, matches the EWMA memory. ★ *recommended*
  - **(B)** cap n_eff = min(n, round(1/α)) ≈ min(n, 22) — cheap approximation.
  - **(C)** keep raw n but document confidence as 'matches observed', not 'effective evidence'.
  - *Confidence:* medium. (Also surface the `adaptation` axis as known low-confidence calibration debt.)
- **dependsOn:** ADR-0092, ADR-0055 · **Audit:** [[adr-re-audit-c7-2026-06-08]].

### ADR-0075 — Loan-Orchestration Process Manager
- **One-line:** Sound Transfer-led saga (LoanAgreement FSM + playing-time monitor + LoanQuality read-model, no new BC; RSTP grounding current). Two amendments.
- **Current status:** proposed. **Disposition:** ratify-with-amendment.
- **Open D-question 1 — D2 buy-clause option-letter inconsistency (body 'Option + obligation-to-buy' vs DL 'D2=B'):**
  - **(A)** reconcile the Decision-Log letter to the body/HITL substance. ★ *recommended (pure ubiquitous-language reconciliation)*
  - **(B)** change the body to match the log's D2=B label.
  - *Confidence:* high.
- **Open D-question 2 — shared future-CLM seam (also in ADR-0073):**
  - **(A)** fold both into the single GD-0040 'defer, keep the seam' decision. ★ *recommended*
  - **(B)** leave each ADR's footnote independent.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0052, ADR-0073, GD-0039, GD-0040 · **Audit:** [[adr-re-audit-c6-2026-06-08]].

### ADR-0077 — Environment & Climate context (weather + pitch)
- **One-line:** Sound, determinism-aware weather/pitch model on reserved WeatherRng stream #5; reopen→re-ratify, apply the ADR-0089 #26 count + ratify the pitch-state split on ratification.
- **Current status:** draft (reopened; was proposed/ratify-gated). **Disposition:** ratify-as-is.
- **Open D-question — who owns pitch-condition STATE vs weather-as-input?:**
  - **(A)** Stadium Ops keeps the pitch-condition aggregate (mutable state); Environment & Climate owns weather only as a deterministic input feed. ★ *recommended (cleanest boundary discipline; the 2026-06-07 sweep recommendation)*
  - **(B)** Environment & Climate owns both weather and pitch-condition state as one context.
  - **(C)** defer the split to build phase.
  - *Confidence:* high. On ratify also apply the ADR-0089 catalog number (#26, not the stale '19→20').
- **dependsOn:** ADR-0089 · **Audit:** [[adr-re-audit-c9-2026-06-08]].

### ADR-0078 — Player Discipline Suspension Contracts
- **One-line:** Sound (Squad&Player owns discipline ledger/suspension/appeal/eligibility; Match owns card facts; Regulations owns profiles; D1-D4 = A). One cross-link amendment.
- **Current status:** proposed. **Disposition:** ratify-with-amendment.
- **Open D-question — appeal-timing rule (D4, resolve-before-next-fixture) vs async multi-day hearings (FMX-101/102):**
  - **(A)** ratify D4 as-is (resolve before next relevant fixture) + add a forward cross-link noting async multi-day hearing (D4 Option B) is not precluded later. ★ *recommended (correct for offline determinism; only a cross-link needed)*
  - **(B)** switch now to a multi-day async deadline hearing model.
  - **(C)** defer the appeal-timing decision until the async-multiplayer hearing model is settled.
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0052, GD-0039 · **Audit:** [[adr-re-audit-c6-2026-06-08]].

### ADR-0076 — Narrative Newsworthiness Event Contracts
- **One-line:** Strong contracts-first work (source decides newsworthiness, immutable snapshots, banded display, rumour decay, outbox+idempotency, Zod 4); sound EXCEPT the storyThreadId/NarrativeThread ownership collision with ADR-0085 — only that portion superseded by ADR-0100.
- **Current status:** draft. **Disposition:** supersede-by-new (thread-ownership portion). **supersededByNew:** ADR-0100.
- **Open D-question — thread ownership/naming collision (X1):**
  - **(A)** Narrative owns thread origination as StoryThread; Media Ecology renames its aggregate to CoverageThread; storyThreadId is a correlation key only. ★ *recommended (carried by ADR-0100; supersedes ONLY the thread-ownership portions of 0076/0085; the rest ratifies as-is)*
  - **(B)** Media Ecology sole owner of the thread aggregate; Narrative read-only.
  - **(C)** thin shared StoryThread correlation contract owned by neither.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0089, ADR-0078 · **Audit:** [[adr-re-audit-c8-2026-06-08]].

### ADR-0079 — Dynasty Board, Ownership & Bankruptcy FSMs
- **One-line:** Sound FSM placement (Club Management sub-aggregates, WorldAiMgmtRng, DB1-DB12); ratify with an amendment adding the insolvency→ledger posting contract + one shared insolvency enum (via ADR-0101, after ADR-0095) — the only economy-side gap.
- **Current status:** draft (proposed; ratified-style, binding-pending). **Disposition:** ratify-with-amendment.
- **Open D-question — add the under-specified insolvency→ledger seam:**
  - **(A)** ratify the FSMs; add an explicit insolvency→ledger posting contract (creditor write-off / wage-cap delta / fire-sale receipt) referencing ADR-0050 as balanced entries (if double-entry per ADR-0095) + one shared insolvency enum/FSM referenced by both 0050 and 0079 — folded into ADR-0101. ★ *recommended*
  - **(B)** ratify the FSMs as-is, track the ledger seam + duplicate model later.
  - **(C)** reopen the Board/Ownership/Bankruptcy placement — *reject (placement sound).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0050 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

### ADR-0083 — Awards / Honours / Records / Hall-of-Fame contract
- **One-line:** Sound additive extension of ADR-0051 (three-layer model + raw-facts-plus-versioned-formula determinism + era-norm/scarcity knobs). Ratify D1-D3 as-is; the load-bearing open item is the HoF-voting RNG, plus a D4=B full-HoF-in-MVP scope re-confirm.
- **Current status:** draft / proposed (D1-D4 = A/A/A/B). **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question 1 — in-world HoF 'voting': pure deterministic formula or stochastic seeded voting?:**
  - **(A)** pure deterministic induction for MVP, no new top-level *Rng; any later stochastic voting uses an existing-stream sub-label per ADR-0018 §3 (the dossier M2 position). ★ *recommended*
  - **(B)** introduce stochastic seeded voting now via an existing-stream sub-label.
  - **(C)** defer the voting model entirely (reserved stub).
  - *Confidence:* high (determinism shape). *Note (Nico's standing lean):* if seeded variance is desired, reserve the existing-stream sub-label seam now so B can ship post-MVP without a refactor.
- **Open D-question 2 — re-confirm D4=B (ship full HoF in MVP) scope:**
  - **(A)** keep D4=B — ship full HoF in MVP; dilution managed by the era-norm/scarcity knobs, magnitudes tuned in FMX-52. ★ *recommended (marginal cost is UI not architecture; handoff snapshot exists)*
  - **(B)** revert to the recommended reserved-stub (induction UI/voting deferred until magnitudes validate).
  - *Confidence:* medium. Pure scope call for Nico.
- **dependsOn:** ADR-0092, ADR-0081 · **Audit:** [[adr-re-audit-c7-2026-06-08]].

### ADR-0084 — National-team dual-role + international-window contract
- **One-line:** Sound (windows = a calendar fact in League Orchestration, no new BC; reuse-don't-invent exemplary; NT1-NT10 concrete). Weak on stale '19-context' framing + reserved competitionRef invariant + a D3=B reputation-coherence check — all additive at ratify.
- **Current status:** draft / proposed (D1-D4 = A/A/B/A). **Disposition:** ratify-with-amendment.
- **Open D-question 1 — re-base the stale '19-context map' + add the reserved/null competitionRef invariant:**
  - **(A)** annotate both at the ratify gate (cross-ref ADR-0089 for the count framing; add the reserved/null competitionRef invariant until the ADR-0066 continental seam ships). ★ *recommended (additive; no-new-BC decision unaffected)*
  - **(B)** author a superseding ADR if the D3=B coherence check fails.
  - *Confidence:* medium.
- **Open D-question 2 — D3=B drops the trophy path; does the global reputation aggregate subsume it?:**
  - **(A)** confirm the reputation aggregate is global and trophies feed it → D3=B stands; annotate the coherence confirmation at ratify. ★ *recommended (run the A coherence check first)*
  - **(B)** reputation is regional/fragmented → reinstate an 'OR N trophies' path to preserve the GD-0011 club-legend spine.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0089, ADR-0066, ADR-0056, ADR-0083 · **Audit:** [[adr-re-audit-c7-2026-06-08]].

### ADR-0085 — Media Ecology Context and Outlet Operational Behaviour
- **One-line:** Well-grounded determinism story but WEAK on ubiquitous language — first-class NarrativeThread aggregate named for the Narrative context with no origination owner (X1) + an undrawn 'two owners of media' seam with ADR-0065 (X2). Thread-ownership portion superseded by ADR-0100.
- **Current status:** draft. **Disposition:** supersede-by-new (thread-ownership portion). **supersededByNew:** ADR-0100.
- **Open D-question — who owns thread origination + how are the aggregates named?:**
  - **(A)** rename Media Ecology's aggregate to CoverageThread; storyThreadId = correlation key only; Narrative owns thread origination (StoryThread). ★ *recommended (carried by ADR-0100; the rest of ADR-0085 — persistent opinionated outlets, deterministic scoring/budget, non-authoritative, IP-clean naming — is sound; also resolve X2 + cross-ref WorldAiMgmtRng:media:* to ADR-0071)*
  - **(B)** Media Ecology sole owner of the thread aggregate; Narrative read-only.
  - **(C)** thin shared StoryThread correlation contract owned by neither.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0089, ADR-0071, ADR-0076 · **Audit:** [[adr-re-audit-c8-2026-06-08]].

### ADR-0065 — Narrative Media/Press Content Ownership
- **One-line:** Sound BC call (Narrative subdomain, publish-vs-deliver split keeps ADR-0043 clean); overtaken-by-events on the media seam — add the additive Related→ADR-0085 pointer + confirm the PressPublicationPolicy/cadenceProfile line at ratify (X2, resolved via ADR-0100).
- **Current status:** draft. **Disposition:** ratify-with-amendment.
- **Open D-question — how is the 'two owners of media' seam drawn at contract level?:**
  - **(A)** PressPublicationPolicy = content readiness/embargo to Narrative; cadenceProfile + edition-budget + salience selection to Media Ecology, with OutletPublishedStory as the single hand-off contract; add the additive Related→ADR-0085 pointer at ratify (drawn in ADR-0100's X2 portion). ★ *recommended*
  - **(B)** keep all publication-policy language in Narrative (Media Ecology only consumes) — risks Media Ecology's cadence having no owned policy.
  - **(C)** move all publication policy to Media Ecology — over-rotates a player-facing concern into the simulation context.
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0089, ADR-0085, ADR-0100 · **Audit:** [[adr-re-audit-c8-2026-06-08]].

### ADR-0086 — Background-fast Matchday Cost-Settlement
- **One-line:** Excellent settlement fit (stateless, immutable-canonical, seeded variance on WorldRng:venue, BF1-BF11); ratify D1-D4 with an amendment pinning the deterministic MoneyBand→amountMinor collapse + balanced reversal + quality-profile enum via ADR-0101 (depends on ADR-0095/0096).
- **Current status:** draft (proposed; D1-D4 = A,A,A,C). **Disposition:** ratify-with-amendment.
- **Open D-question — pin the two inherited gaps (reversal balance; MoneyBand→amountMinor collapse) + the 3-vs-4 enum drift:**
  - **(A)** ratify D1-D4; pin the band→amountMinor collapse as a deterministic (replay-byte-identical) function + the reversal as a balanced offsetting pair + reconcile the quality-profile enum — all via ADR-0101 (depends on ADR-0095 for balanced postings, ADR-0096 for the enum). ★ *recommended*
  - **(B)** ratify D1-D4, leave the collapse rule / balanced-reversal / enum to implementation time — *reopens the place determinism can silently diverge.*
  - **(C)** re-open the settlement model — *reject (the path is sound).*
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0050, ADR-0070 · **Audit:** [[adr-re-audit-c5-2026-06-08]].

## Batch 7

### GD-0002 — Match Engine & Simulation Model
- **One-line:** Content-sound match-engine GD; amend on ratify to redirect its 'open spike gates' to ADR-0096/0049 (determinism/numeric-surface owner) + demote the embedded FMX-70 set-piece banner via ADR-0092.
- **Current status:** draft (binding:false; embeds an inline Status:accepted FMX-70 sub-section). **Disposition:** ratify-with-amendment.
- **Open D-question — how do the 'open spike gates' resolve, given the master assigned that determinism substance to ADR-0096?:**
  - **(A)** ratify 'Decided/strong' as-is and redirect the open spike-gates to ADR-0096/0049 as resolution owner (GD records design intent; ADR pins the mechanism). ★ *recommended*
  - **(B)** hold GD-0002 in draft until ADR-0096 ratifies, then ratify both together.
  - **(C)** ratify fully as-is leaving the spike-gates as open game-design items — *re-creates the determinism-regime split.*
  - *Confidence:* high.
- **dependsOn:** ADR-0096, ADR-0049, ADR-0092 · **Audit:** [[gd-re-audit-g2-2026-06-08]].

### GD-0005 — Training & Development
- **One-line:** Content sound and uncontested; only the draft-vs-binding:true-vs-'approved' status drift needs the ADR-0092 governance fix, then ratify.
- **Current status:** draft frontmatter, but binding:true + body 'approved' banner. **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the three conflicting status truths:**
  - **(A)** fold into the ADR-0092 status-SSOT governance sweep (frontmatter canonical, demote body 'approved' to dated history, add the standard reopen banner); no content change. ★ *recommended (one central rule fixes GD-0005 + GD-0007 + ADR siblings at once)*
  - **(B)** edit GD-0005 in place to set body 'draft' + binding:false directly (re-creates drift risk).
  - **(C)** ratify as-is, treat the reopen note as the override (leaves three truths).
  - *Confidence:* high.
- **dependsOn:** ADR-0092 · **Audit:** [[gd-re-audit-g3-2026-06-08]].

### GD-0006 — Transfers & Scouting
- **One-line:** Sound research-backed transfer/scouting fantasy (inbox-as-surface, ranged uncertainty, sort/filter day-one); ratify-with-amendment to reconcile body-'approved'→status, defer R2-02/R2-04 to Wave 2, ratify the FMX-81 appendix as ADR-0073's design narrative.
- **Current status:** draft (front-matter); body still 'approved'. **Disposition:** ratify-with-amendment.
- **Open D-question — ratify given the status drift + deferred R2-02/R2-04 + the FMX-81 appendix duplicating ADR-0073:**
  - **(A)** ratify the Decided/strong block + adopted mechanics; reconcile body 'approved'→ratified; mark R2-02/R2-04 explicit Wave-2 defer; ratify the FMX-81 appendix as the design face of ADR-0073 (dependsOn ADR-0073) with its future-Contracts hint pointed at GD-0040. ★ *recommended*
  - **(B)** ratify-as-is (leaves the status contradiction + appendix 'proposed' framing).
  - **(C)** split the FMX-81 appendix into its own GD — *premature record growth for a beat ADR-0073 owns.*
  - *Confidence:* high.
- **dependsOn:** ADR-0073, GD-0040 · **Audit:** [[gd-re-audit-g4-2026-06-08]].

### GD-0007 — Youth Academy
- **One-line:** Sound youth-pillar design; needs the ADR-0092 status fix plus a cross-ref to ADR-0060 (lifecycle) / ADR-0075 (loan exit), then ratify.
- **Current status:** draft frontmatter, but binding:true + body 'approved' banner. **Disposition:** ratify-with-amendment.
- **Open D-question — status drift + academy lifecycle/ownership now in ADR-0060/0075:**
  - **(A)** ADR-0092 status-SSOT fix + a light cross-ref noting ADR-0060 owns the AcademySeason/YouthCohort lifecycle and ADR-0075 the loan exit (GD-0007 reads as the design pillar feeding them). ★ *recommended*
  - **(B)** ADR-0092 status fix only; leave ownership cross-refs implicit.
  - **(C)** ratify as-is.
  - *Confidence:* high.
- **dependsOn:** ADR-0092, ADR-0060, ADR-0075 · **Audit:** [[gd-re-audit-g3-2026-06-08]].

### GD-0009 — League & Competition Structure
- **One-line:** Design sound (uncopyrightable formats + fictional names, ADR-0066 owns the schema); only status/SSOT drift — binding:true + 'approved' body + an embedded copy of ADR-0066's diagram — needs amending, no redesign.
- **Current status:** draft frontmatter / binding:true + body 'approved' (drift). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile status + the embedded Appendix-A ADR-0066 diagram:**
  - **(A)** reconcile status under ADR-0092 (frontmatter canonical SSOT); re-ratify design content unchanged; make Appendix A a non-authoritative mirror/rendered reference to ADR-0066; re-point R2-14 refs to ADR-0027/0066. ★ *recommended (pure ratification chores, no redesign)*
  - **(B)** strip Appendix A entirely, link to ADR-0066 as sole owner; reconcile status only.
  - **(C)** leave as-is, defer the metadata/SSOT cleanup to build phase.
  - *Confidence:* high.
- **dependsOn:** ADR-0066, ADR-0092 · **Audit:** [[gd-re-audit-g6-2026-06-08]].

### GD-0011 — Career Progression, Board & Objectives
- **One-line:** Narrative spine sound; one substantive open question — reconcile its binding single-stat board model with GD-0030's ladder/FSM — plus clear the binding/status artefact. **Pair: ratify with GD-0030.**
- **Current status:** draft (reopened) but in-file Status:approved + binding:true artefact. **Disposition:** ratify-with-amendment.
- **Open D-question 1 — single 0-100% board trust vs GD-0030's 8-tier ladder + 6-state confidence FSM:**
  - **(A)** GD-0030's confidence FSM is a richer RENDERING of the same single 0-100 trust value (single source preserved; FSM = display/escalation states). ★ *recommended (one value, many states; preserves GD-0011 legibility + GD-0030 drama)*
  - **(B)** FMX-89/GD-0030 SUPERSEDES the single-stat constraint (board trust becomes the multi-state ladder).
  - **(C)** keep both: single stat for match-to-match, ladder/FSM only for late-game dynasty.
  - *Confidence:* high.
- **Open D-question 2 — binding:true + '→ approved' artefact vs the reopen-to-draft phase:**
  - **(A)** clear the artefact to match the post-ratification status convention. ★ *recommended (bookkeeping fix on ratify)*
  - **(B)** treat GD-0011 as the one still-binding G5 record.
  - **(C)** leave as-is.
  - *Confidence:* high.
- **dependsOn:** GD-0030 · **Audit:** [[gd-re-audit-g5-2026-06-08]].

### GD-0030 — Dynasty Board & Ownership
- **One-line:** Best-grounded G5 record (D1-D4 already Nico's, directions-only/FMX-52 magnitudes); ratifies as-is once its board model is reconciled with GD-0011 and the shared insolvency FSM is canonicalised. **Pair: ratify with GD-0011.**
- **Current status:** draft (binding:false; D1-D4 = A/A/A/A live 2026-06-05). **Disposition:** ratify-as-is.
- **Open D-question — state GD-0030's relationship to GD-0011's single-stat rule (Supersedes:None today):**
  - **(A)** state that the confidence FSM is a richer rendering of the same single 0-100 trust value (no supersede; single source preserved). ★ *recommended (same value, many states; paired with the GD-0011 card)*
  - **(B)** GD-0030 explicitly supersedes GD-0011's single-stat constraint.
  - **(C)** cross-reference note only, defer the model reconciliation.
  - *Confidence:* high.
- **dependsOn:** ADR-0079, GD-0011 · **Audit:** [[gd-re-audit-g5-2026-06-08]].

### GD-0008 — Finance, Economy & Stadium
- **One-line:** Sound MVP economy spine; ratify the direction, amend to reference one canonical insolvency FSM; the ~9 'open' items are FMX-52 calibration, not design questions.
- **Current status:** draft (reopened; binding:false). **Disposition:** ratify-with-amendment.
- **Open D-question — three competing insolvency vocabularies (GD-0008 vs GD-0030 vs ADR-0050/0079):**
  - **(A)** define one canonical InsolvencyCase FSM (ADR-0079) + have GD-0008 + GD-0030 name effect-directions over the SAME state set. ★ *recommended (mirrors C5 cross-ADR #6)*
  - **(B)** keep GD-0008's player-facing crisis ladder as canonical names + map the ADR FSM to it.
  - **(C)** leave both vocabularies, document a mapping table only.
  - *Confidence:* high.
- **dependsOn:** ADR-0050, ADR-0079, GD-0030 · **Audit:** [[gd-re-audit-g5-2026-06-08]].

### GD-0013 — Narrative, Inbox & Events
- **One-line:** Inbox-as-feed narrative engine + hard content boundary are durable; only defect is approved/draft/binding lifecycle drift — ratify content, reconcile status vault-wide.
- **Current status:** draft front-matter / body 'approved' / binding:true (three-way drift). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the three-way lifecycle drift (the Decided/strong design is not in question):**
  - **(A)** ratify the Decided/strong block as-is + reconcile the lifecycle via the vault-wide status-reconciliation (ADR-0092); carry the hard content boundary (no doping/Babe-of-the-Month/illegal-accounting/gambling-draws) forward unchanged. ★ *recommended (governance fix, not a narrative decision)*
  - **(B)** re-mark draft-only + re-ratify the Decided block without a vault-wide rule.
  - **(C)** keep as 'approved', exempt from the reopen.
  - *Confidence:* high.
- **dependsOn:** — · **Audit:** [[gd-re-audit-g7-2026-06-08]].

### GD-0018 — AI Narrative Personas and Dialogue
- **One-line:** Cluster keystone (LLM-out-of-state, intent-based dialogue, mandatory CI-manifested fallback, disclosure); sound — amend to name the Art.50 machine-readable-marking duty + bind persona/thread ownership to ADR-0052/0100.
- **Current status:** draft (FMX-88 D1-D4 + FMX-87 D1-D3 chosen live). **Disposition:** ratify-with-amendment.
- **Open D-question 1 — EU AI Act Art.50 (from 2026-08-02): ship machine-readable marking of AI text now, or defer?:**
  - **(A)** add explicit machine-readable marking in MVP (provenance already carried per-output; small extension) + keep first-exposure + settings/help disclosure. ★ *recommended (cheap, future-proofs the 2026-08-02 obligation; final wording stays the Nico + external-legal release blocker per FMX-88 D3)*
  - **(B)** defer machine-readable marking to the same later legal-gated phase as text export/share.
  - **(C)** treat all in-game narrative as evidently-fictional + rely on the lighter-touch carve-out only.
  - *Confidence:* medium.
- **Open D-question 2 — confirm GD-0018 depends on ADR-0052 (persona authority) + ADR-0100 (thread ownership) rather than owning that state:**
  - **(A)** ratify GD-0018 design now; bind persona authority to ADR-0052 + thread ownership to ADR-0100 as hard dependsOn for implementation. ★ *recommended (no interim duplicate model)*
  - **(B)** carry an interim persona/thread model until those ADRs ratify.
  - **(C)** block GD-0018 ratification until 0052 + 0100 ratify.
  - *Confidence:* high.
- **dependsOn:** GD-0013, ADR-0030, ADR-0052, ADR-0054, ADR-0100 · **Audit:** [[gd-re-audit-g7-2026-06-08]].

### GD-0010 — AI Managers & World Simulation
- **One-line:** Original AI-world goal GD; sound direction, but its open items now live in GD-0023/0024/0018 — ratify as direction + pointer, drop the stale ADR-0009 link. **Pair: ratify with GD-0024.**
- **Current status:** draft (created 2026-05-17 as a direction GD). **Disposition:** ratify-with-amendment.
- **Open D-question — how to ratify the umbrella goal whose concrete items have landed in newer records:**
  - **(A)** ratify the goal as a living umbrella + add a 'resolved-into' pointer block (GD-0024/0023/0018/FMX-90) + drop the stale ADR-0009 feed link. ★ *recommended (anti-flatline goal uncontested, worth preserving as direction)*
  - **(B)** mark GD-0010 superseded-in-substance by its children, keep only the player-experience goal.
  - **(C)** leave the goal as-is without pointers.
  - *Confidence:* high.
- **dependsOn:** GD-0024, GD-0018 · **Audit:** [[gd-re-audit-g7-2026-06-08]].

### GD-0024 — AI World-Drift Algorithm
- **One-line:** Legible, replay-safe world-drift (Rising Rival / Giant Collapse / Era Shift), labelled RNG, no hidden buff, numbers→FMX-52; sound — one open call is bounded-context-vs-policy. **Pair: ratify with GD-0010.**
- **Current status:** draft (FMX-91; Nico pre-selected 4 core options 2026-06-03). **Disposition:** ratify-with-amendment.
- **Open D-question — ratify 'AI World Simulation' as its own bounded context or keep it an orchestration policy?:**
  - **(A)** ratify AI World Simulation as a bounded context per the FMX-91 lean + the ADR-0089 catalog (drift gets a single clear owner). ★ *recommended (genuinely cross-context orchestration with its own state — caps/cooldowns/calibration — matching ADR-0071)*
  - **(B)** keep drift as an orchestration policy spread across League/Club/Transfer (no new context).
  - **(C)** defer the context-vs-policy call until post-MVP continental depth is decided.
  - *Confidence:* high.
- **dependsOn:** GD-0010, ADR-0071 · **Audit:** [[gd-re-audit-g7-2026-06-08]].

### GD-0020 — EOS Player Skills, Personas and People
- **One-line:** Coherent People/skills substrate direction (16+4+8, OCEAN internal, labels surface); ratify the direction but confirm the MVP actor-class breadth + defer the staff-skill gate to GD-0021. **Pair: ratify with GD-0021.**
- **Current status:** draft (binding:false; body 'Draft only' — no status drift). **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — confirm the MVP actor-class breadth + defer the staff-skill gate:**
  - **(A)** ratify the substrate direction as-is (16+4+8 kept, skills≠attributes, OCEAN internal, football labels, prose presentation-only); confirm the full MVP actor-class breadth explicitly; let GD-0021 own the staff-skill gate. ★ *recommended (the substrate is the binding frame GD-0027 already obeys; unblocks ADR-0052)*
  - **(B)** ratify the substrate but narrow MVP actor classes (player+staff+board only), defer journalists/media/fan-rep/agent persona context.
  - **(C)** defer GD-0020 entirely until GD-0021's gate + ADR-0052 resolve.
  - *Confidence:* high.
- **dependsOn:** GD-0021, ADR-0052 · **Audit:** [[gd-re-audit-g3-2026-06-08]].

### GD-0021 — Player and Staff Development and Decision Influence
- **One-line:** Numerics-free owner/consumer factor-matrix layer sound; the one open gate is the staff-skill MVP A/B/C call — a pure scope decision. **Pair: ratify with GD-0020.**
- **Current status:** draft (binding:false; body 'Draft only' — no status drift). **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — staff-skill MVP activation gate:**
  - **(A)** target-only: staff keep contracts/roles/coverage/specialisations but no skill-profile mechanics in MVP.
  - **(B)** narrow pipeline modifiers: staff skills affect only Staff-Operations pipeline-quality read-models consumed by Training/Scouting/Medical/Match-Day. ★ *recommended (smallest useful MVP activation that makes staff matter without a full staff-card catalog/UI/balance pass; the GD's own recommendation)*
  - **(C)** full staff skill cards: profiles visible + mechanically active across systems.
  - *Confidence:* high. Pure product/scope call (aligns with Nico's standing seeded-variance lean for development influence).
- **dependsOn:** GD-0020, ADR-0052, ADR-0053 · **Audit:** [[gd-re-audit-g3-2026-06-08]].

### GD-0003 — Squad, Players & Attributes
- **One-line:** Sound intent (mobile cards, traits, legacy artefacts) but body binds the stale 1–10 scale; amend to the 16+4+8 / 1–20 baseline + ADR-0027, then ratify.
- **Current status:** draft (binding:false; body flags the scale contradiction). **Disposition:** ratify-with-amendment.
- **Open D-question — reconcile the stale 1–10 body vs the binding 16+4+8 / 1–20 baseline:**
  - **(A)** amend body: promote 16+4+8 / 1–20 + 'No global OVR / Impact Lens' as the decided direction, demote 1–10 + ADR-0004 text to dated history, redirect schema refs ADR-0004→ADR-0027. ★ *recommended (cheapest; keeps the GD number, removes a live contradiction)*
  - **(B)** supersede GD-0003 with a new GD restating the squad/attribute pillar on the current baseline.
  - **(C)** ratify as-is and rely on the reopen banner — *unsafe (would re-bind the wrong scale).*
  - *Confidence:* high.
- **dependsOn:** GD-0020, ADR-0027, ADR-0092 · **Audit:** [[gd-re-audit-g3-2026-06-08]].

### GD-0022 — Economy Commercial Impact and Contracts
- **One-line:** Exemplary, boundary-disciplined commercial extension; design ratifies as-is. The ~40 'open' items are scope/calibration checklist for Nico/FMX-52, not GDDR defects.
- **Current status:** draft (reopened; binding:false). **Disposition:** ratify-as-is · **scope-call**.
- **Open D-question — MVP dynamic-pricing scope:**
  - **(A)** MVP = category pricing + bounded surcharges only (trust/affordability-safe; the GD's own recommended stance). ★ *recommended (full dynamic pricing stays an explicit later Nico decision)*
  - **(B)** MVP also enables full bounded dynamic pricing with mandatory transparency.
  - **(C)** dynamic pricing is profile-data-only until playtested.
  - *Confidence:* high.
- **dependsOn:** GD-0008, ADR-0058 · **Audit:** [[gd-re-audit-g5-2026-06-08]].

### GD-0023 — AI Club Economy Behaviour
- **One-line:** Strong 'compose-don't-invent' AI economy with no stat-cheats + clean Investor isolation; ratify-as-is. One scope call (AI owner-support gating); rest is FMX-52 calibration.
- **Current status:** draft (reopened; binding:false). **Disposition:** ratify-as-is · **scope-call**.
- **Open D-question — in-fiction AI owner-support (equity injection / director soft loan) — all profiles or gated?:**
  - **(A)** enabled for all profiles, magnitude/strings differ by owner archetype.
  - **(B)** gated by archetype + country financialControlRegime (e.g. Foundation/50+1 cannot inject like a Sugar-Daddy). ★ *recommended (keeps support diegetic and legible; never the real-money Investor either way)*
  - **(C)** defer owner-support entirely post-MVP.
  - *Confidence:* medium.
- **dependsOn:** GD-0008, GD-0030, ADR-0051 · **Audit:** [[gd-re-audit-g5-2026-06-08]].

### GD-0014 — Save & Career Model
- **One-line:** Ratified rules sound (versioned forward-only migrations, no localStorage fallback, parallel saves, 3 rotating autosave slots + explicit Restore, ISO-strings-only); amendment closes GD-0014's own open R2-08 by reference to ADR-0096/0098.
- **Current status:** draft (rules restate accepted ADR-0005, MVP-amended by ADR-0020). **Disposition:** ratify-with-amendment.
- **Open D-question — close R2-08 (save-determinism / replay format: event log vs snapshot vs delta):**
  - **(A)** close by reference: record that the binding determinism-and-replay contract (ADR-0096 committed event-log, resim-from-kickoff, NO persisted snapshots, MatchFrame derived-never-persisted + ADR-0098 save envelope) decides this in favour of event-log; GD-0014 cites them, does not re-decide. ★ *recommended (the replay model is already binding; the save model must follow it for one coherent head)*
  - **(B)** re-open R2-08 as a standalone save-format decision.
  - **(C)** defer R2-08 until the ADR-0096 determinism spike produces benchmark evidence.
  - *Confidence:* high. (R2-12 hotseat stays deferred to ADR-0004.)
- **dependsOn:** ADR-0096, ADR-0098, ADR-0005 · **Audit:** [[gd-re-audit-g1-2026-06-08]].

### GD-0004 — Tactics & Formations
- **One-line:** Oldest/thinnest cluster GD with the worst lifecycle drift (binding:true + body 'approved' vs draft); ratify the opt-in-depth principle, drop the stale binding/approved via ADR-0092, make the scope call to lock-or-defer the R2-03 MVP tactics slice.
- **Current status:** draft frontmatter BUT binding:true + body 'approved'; R2-03 MVP slice marked recommended-not-decided. **Disposition:** ratify-with-amendment · **scope-call**.
- **Open D-question — lock the recommended R2-03 MVP tactics slice, or keep it deferred?:**
  - **(A)** lock the recommended MVP slice as the ratified target (5-8 formations, 3 mentalities, 4 instructions + chemistry multiplier); exact taxonomy/role list = FMX-52 design debt. ★ *recommended*
  - **(B)** ratify the opt-in-depth principle only; keep the R2-03 slice deferred to a later tactics-content GD.
  - **(C)** supersede GD-0004 with a fuller tactics GD folding in GD-0025/ADR-0055/0074 — *heavier than the sweep needs.*
  - *Confidence:* medium.
- **dependsOn:** ADR-0092, ADR-0055, ADR-0072, GD-0025 · **Audit:** [[gd-re-audit-g2-2026-06-08]].

### GD-0033 — National-Team (Bundestrainer) Dual-Role
- **One-line:** Telegraphed reserved-stub dual-role (MVP ships only the InternationalWindow calendar + foreshadowing + reserved prestige seam); one coherence check on D3=B's dropped trophy path vs the global-vs-regional reputation model + the GD-0011 spine.
- **Current status:** draft (binding:false; D1-D4 = A/A/B/A). **Disposition:** ratify-with-amendment.
- **Open D-question — D3=B dropped the 'OR 3 trophies' path assuming a single global rep number trophies feed; if rep is regional/fragmented this contradicts the GD-0011 'club legend → national coach' spine:**
  - **(A)** confirm the region-rep aggregation curve genuinely produces a single global number trophies meaningfully raise → keep D3=B as-is (annotate the coherence confirmation at the ADR-0084 ratify gate). ★ *recommended (run the A coherence check first — it is a confirmation, not a re-decision)*
  - **(B)** restore a trophy alternative ('rep≥75 AND 5 seasons, OR a major-trophy count') so a fragmented-region legend can still cross the gate.
  - **(C)** keep D3=B but lower/band the global-rep threshold so dominant-in-one-region legends realistically clear it (FMX-52).
  - *Confidence:* medium. Fall to B only if the reputation model turns out fragmented. (75/5 stay FMX-52 calibration debt regardless.)
- **dependsOn:** ADR-0084, ADR-0066, GD-0011 · **Audit:** [[gd-re-audit-g6-2026-06-08]].

### GD-0032 — Awards, Honours, Records & Hall of Fame
- **One-line:** Three-layer model sound (raw-facts + versioned formula, era-norm + scarcity knobs); two ratify-gate items — the load-bearing HF9/M2 in-world induction RNG choice + a D4=B full-HoF-in-MVP scope re-confirm.
- **Current status:** draft (binding:false; D1-D4 = A/A/A/B, D4=B Nico override). **Disposition:** ratify-with-amendment.
- **Open D-question 1 — in-world HoF induction: pure deterministic formula or stochastic seeded voting?:**
  - **(A)** pure deterministic induction formula for MVP, no new top-level RNG ('voting' = deterministic presentation flavour over the ranking).
  - **(B)** seeded stochastic voting via a SUB-LABEL of an existing stream (the dossier M2 'if stochastic later' path, pulled forward).
  - **(C)** pure formula for MVP BUT reserve the sub-label seam explicitly so B can ship post-MVP without a refactor. ★ *recommended (ships pure-deterministic + replay-safe in MVP yet keeps Nico's repeated seeded-variance lean (FMX-92 D4=C, FMX-102 D4=B) open as a co-equal future option)*
  - *Confidence:* medium.
- **Open D-question 2 — re-confirm D4=B (full HoF — induction UI + simulated voting — in MVP with magnitudes unvalidated until FMX-52):**
  - **(A)** keep D4=B — full HoF in MVP (current Nico override). ★ *recommended (anti-dilution knobs are first-class, handoff snapshot exists; marginal cost is UI not architecture)*
  - **(B)** revert to the recommended reserved-stub (records book + handoff snapshot in MVP, full HoF post-MVP).
  - **(C)** full HoF data spine in MVP but gate the induction/voting UI behind a flag until FMX-52.
  - *Confidence:* medium. Pure scope call for Nico.
- **dependsOn:** ADR-0083, ADR-0081, GD-0031, GD-0033 · **Audit:** [[gd-re-audit-g6-2026-06-08]].

### GD-0034 — Media-Outlet Ecology Model
- **One-line:** Outlets as a persistent opinionated cast with memory, 5-dim vector, deterministic pure edition selection, news-gravity dial, no authoritative effects; sound — pick the media RNG label + align thread naming to ADR-0100.
- **Current status:** draft (FMX-82; companion to ADR-0085; D1-D4 chosen live 2026-06-07). **Disposition:** ratify-with-amendment.
- **Open D-question 1 — which RNG label backs media-edition seeded noise / stance drift:**
  - **(A)** WorldAiMgmtRng:media:* sub-label — reuse the existing AI/world stream, avoid stream proliferation. ★ *recommended (matches the master-sweep cross-ref; existing labelled-substream pattern gives per-edition reproducibility keyed by (outletId, eventId, seasonSeed))*
  - **(B)** dedicated MediaRng stream — isolate media variance if per-edition volume risks cross-contaminating world/AI replay.
  - **(C)** defer the label until media volume is measured in soak tests.
  - *Confidence:* medium.
- **Open D-question 2 — confirm GD-0034 aligns to ADR-0100's thread split rather than owning an independent thread model:**
  - **(A)** dependsOn ADR-0100: Media Ecology owns 'CoverageThread'; storyThreadId is correlation-only; Narrative owns origination. ★ *recommended (a second independent thread owner under the same name is exactly the ubiquitous-language defect ADR-0100 fixes)*
  - **(B)** GD-0034 keeps its own thread aggregate independent of ADR-0100.
  - **(C)** defer thread naming entirely to implementation.
  - *Confidence:* high.
- **dependsOn:** ADR-0085, ADR-0076, ADR-0100, GD-0018, GD-0028 · **Audit:** [[gd-re-audit-g7-2026-06-08]].

---

*End of Decision-Queue. All dispositions, options, recommendations and confidences
above are draft inputs for Nico's ratification gate — nothing is decided here. See
the linked audit notes for the full per-item analysis.*
