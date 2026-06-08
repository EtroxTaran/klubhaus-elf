---
title: GD-0039 C6 status reconciliation & cluster ratification order (People-first)
status: draft
tags: [game-design, gddr, governance, c6, people, staff, manager-legacy, youth, scouting, discipline, loans, ratification-order, status-drift, fmx-105]
created: 2026-06-08
updated: 2026-06-08
type: gddr
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0060-youth-academy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
  - [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../10-Architecture/09-Decisions/ADR-0075-loan-orchestration-process-manager]]
  - [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../60-Research/adr-re-audit-c6-2026-06-08]]
  - [[../90-Meta/vault-governance]]
  - [[../90-Meta/collaboration-and-decision-protocol]]
  - [[../00-Index/Current-State]]
  - [[../00-Index/Decision-Log]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# GD-0039: C6 status reconciliation & cluster ratification order (People-first)

> **Status `draft` — decision-gate item, not accepted.** A governance/clarification note for the
> **C6 cluster** (People / Players / Staff / Manager-Legacy / Youth / Scouting and their
> contract/discipline/loan satellites). It records (a) the **canonical status** of the cluster ADRs
> against the binding 2026-05-27 reopen note and (b) a **fixed People-first ratification order** the
> cluster's own dependency graph demands. It **does not edit any ADR file** — reconciliation is
> central, never piecemeal (read-only-on-existing-files rule, [[../90-Meta/vault-governance]]).
> Grounded by the [[../60-Research/adr-re-audit-c6-2026-06-08|C6 re-audit]] (issues 1 + 2). Awaiting
> Nico ratify. Nothing here is binding until then.

> **Scope split with the portfolio-governance line.** ADR-0089 already owns the bounded-context
> **count / ordinal numbering** reconciliation (19→28). The **status-vs-reopen** half of this note
> overlaps a *portfolio-governance* ADR if/when one lands for vault-wide frontmatter drift. **If that
> ADR lands, the status half folds into it and only the People-first ratification-ORDER below remains
> the distinct C6 contribution of this GDDR.** Until then this note carries both halves so the knot is
> not left unrecorded.

## Why this exists

Two governance defects sit underneath the whole C6 cluster, and both block a clean ratify pass:

1. **Status drift.** The binding [[../00-Index/Current-State]] banner says *"2026-05-27 — Decisions
   reopened. All previously `accepted` ADRs … were reset to `status: draft`."* Yet **ADR-0051**,
   **ADR-0053** and **ADR-0061** still carry `status: accepted` + `binding: true` in their own
   frontmatter, and the [[../00-Index/Decision-Log]] index mirrors the stale `accepted`. So three
   sources disagree about whether anything in C6 is binding — a direct violation of the
   *single-current-truth* rule. (Economy siblings 0050/0058/0062 carry the same drift; out of C6
   scope here but flagged for the economy cluster's own note.)

2. **No fixed ratification order.** The cluster is a dependency graph, not a flat list. **ADR-0052
   (People)** is the upstream actor-identity owner that 0053/0064/0078/0075 all reference; **ADR-0051
   (Manager & Legacy)** is the upstream legacy/seed owner for 0053/0060/0064/0082. Yet several of those
   upstreams are *still* `draft`/`proposed` while their own downstreams are also `draft`/`proposed`, and
   no note anywhere fixes the order in which Nico should ratify them. Ratifying a downstream before its
   identity/seed owner would bake in a dangling "if ADR-0052 is ratified" reference.

This GDDR is the single place that records the canonical answer to both, so the per-ADR apply-PRs land
coherently — **without touching the ADR files themselves**.

## 1. Canonical status of the C6 cluster (status-reconciliation half)

The **binding reopen note is the source of truth**: every C6 ADR is `draft` and **nothing in the
cluster is binding** until Nico re-ratifies it. The stale `accepted`/`binding: true` frontmatter on
0051/0053/0061 is a **marker that was never flipped on 2026-05-27** — a stale *status label*, not a
live decision. The audit found each of those decisions *sound on its merits*; the problem is purely the
frontmatter/index lagging the reopen.

| ADR | Frontmatter says | Decision-Log says | Canonical (per reopen note) |
|---|---|---|---|
| 0051 Manager & Legacy | `accepted` / `binding:true` | accepted | **draft** (sound, awaiting re-ratify) |
| 0052 People | `draft` | — | **draft** (correct already) |
| 0053 Staff Operations | `accepted` / `binding:true` | accepted | **draft** (sound, awaiting re-ratify) |
| 0060 Youth Academy | `proposed` | — | **draft/proposed** (correct) |
| 0061 Club-Mgmt Sub-Aggregate Audit | `accepted` / `binding:true` | accepted | **draft** (sound; only weakly in C6) |
| 0064 Scouting Activity | `proposed` | — | **draft/proposed** (correct) |
| 0073 Contract Lifecycle FSM | `proposed` | — | **draft/proposed** (correct) |
| 0075 Loan Orchestration | `proposed` | — | **draft/proposed** (correct) |
| 0078 Player Discipline | `proposed` | — | **draft/proposed** (correct) |
| 0082 Manager Style-Signal | `proposed` | — | **draft/proposed** (correct) |

**No ADR file is edited by this note.** When Nico ratifies, the canonical status is set per-ADR in that
ADR's own apply-PR (the same ratify gate every other decision uses). This table is the reference the
apply-PRs read, not a substitute for them.

## 2. People-first ratification order (the distinct C6 contribution)

Ratify **upstream identity/seed owners before their consumers**, so no ratified ADR ever carries a
live "if upstream X is ratified" dangling reference. Three waves:

> **Wave 1 — Identity & seed roots (ratify first)**
> - **ADR-0052 — People / Persona & Skills.** The keystone: actor identity that Staff Ops, Scouting,
>   Discipline and Loans all reference.
> - **ADR-0051 — Manager & Legacy.** Cross-run identity / legacy / seed owner that Staff Ops, Youth,
>   Scouting and Manager-Signal reference.
>
> *(0051 and 0052 are mutually independent — either order within Wave 1 is fine — but **both** must
> precede everything below.)*

> **Wave 2 — Direct consumers of the roots**
> - **ADR-0053 — Staff Operations** (needs People + Manager-Legacy).
> - **ADR-0060 — Youth Academy** (needs Manager-Legacy seed; pairs with 0075 on the `YouthLoaned` seam).
> - **ADR-0064 — Scouting Activity** (needs People identity + Manager-Legacy seed).

> **Wave 3 — Process/contract satellites & signals (ratify last)**
> - **ADR-0073 — Player Contract Lifecycle FSM** (Squad owns truth; references People).
> - **ADR-0078 — Player Discipline** (references People; emits `PlayerSuspendedV1` others consume).
> - **ADR-0075 — Loan Orchestration** (needs People + Regulations + 0073; pairs with 0060).
> - **ADR-0082 — Manager Style-Signal** (fills 0051's `ManagerStyleSignals` surface; consumes 0074).

**ADR-0061** (Club-Mgmt Sub-Aggregate Audit) is *primarily an economy-cluster decision* and only weakly
in C6; its ratify belongs to the economy cluster's order, cross-referenced here, not slotted into a C6
wave. **ADR-0089** (portfolio count/ordinals) is **orthogonal** to this order — it can ratify at any
point; every C6 §Map-patch is subordinate to it once it lands, independent of these waves.

### Why People-first (not Manager-first, not flat)

- **People (0052) is the actor-identity root** the audit calls *"the keystone of the cluster"* — every
  consumer names it as the identity owner, so ratifying it first removes the largest number of dangling
  references at once. This is also the DDD-correct direction: **ratify upstream context boundaries
  before the contexts that depend on their published contracts** (Customer–Supplier upstream-first), the
  same posture ADR-0019's modular-monolith boundaries assume.
- **Manager-Legacy (0051) is the seed/legacy root**, co-equal at Wave 1 but not *the* identity owner, so
  it is paired with People rather than placed ahead of it.
- A **flat / first-to-ratify** order (the rejected Option B-style churn) would let a Wave-3 satellite
  ratify before its root and bake in a stale conditional — exactly the drift this note exists to prevent.

## 3. Options considered

- **Option A — one central governance/clarification note (recommended).** A single note (this GDDR,
  pending Nico) records the canonical status table *and* the fixed People-first ratification order; the
  ADR files are left untouched and updated only in their own ratify apply-PRs. Lowest drift, one source
  of truth, honours read-only-on-existing-files. *Cost:* one note to maintain; if a portfolio-governance
  ADR lands, the status half migrates there (§Scope split).
- **Option B — per-ADR supersession notes flipping each stale frontmatter.** A new draft ADR per stale
  file (0051/0053/0061…) with `Supersedes:` to correct status. *Rejected:* heavy (three+ near-empty
  supersession ADRs for a label that the reopen note already overrides), high drift risk, and it
  conflates *status-marker hygiene* with *real design supersession* — the audit found none of these
  decisions is actually superseded.
- **Option C — leave as-is, rely on the Decision-Log.** *Rejected:* the Decision-Log **mirrors the stale
  `accepted`**, so it is part of the drift, not a fix; it cannot be the reconciliation source.

## 4. Recommendation & confidence

**Recommendation: Option A — one central note; do not edit the ADR files.** Fold the **status half** into
the portfolio-governance ADR if/when it lands; keep the **People-first ratification-ORDER** (§2) as the
distinct, durable C6 contribution of this GDDR. This resolves C6 re-audit issues **1 + 2** at the lowest
drift cost and keeps a single current truth.

**Confidence: high.** The status reconciliation is mechanical (the binding reopen note already decides
it; this only records it). The People-first order follows directly from the cluster's stated dependency
graph and standard upstream-first DDD ratification — low uncertainty. The only genuinely open choice is
*where the status half ultimately lives* (here vs. the portfolio-governance ADR), which §Scope split
leaves to Nico.

## 5. Out of scope / handed off

- **BC count & ordinal numbering** → owned by [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation|ADR-0089]] (orthogonal; not relitigated here).
- **Economy-cluster status drift** (0050/0058/0062) → that cluster's own reconciliation note.
- **Contracts/CLM extraction-seam** (the shared 0073 + 0075 "future Contracts context" footnote) → a
  separate tracked open question (C6 re-audit issue 4); not a status/order matter.
- **Loan D2 option-letter inconsistency** and **discipline appeal-timing vs async** (C6 re-audit
  issues 5 + 6) → design/labelling fixes, out of this governance note's remit.

## Decision gate

Per [[../90-Meta/collaboration-and-decision-protocol]], this GDDR is **`draft` and not accepted**. The
canonical status table (§1) and the People-first ratification order (§2) take effect only on Nico's
ratify, and each affected ADR's frontmatter is corrected solely in its own apply-PR.
