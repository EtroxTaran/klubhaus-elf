---
title: ADR re-audit — Cluster C6 (People / Players / Staff / Manager / Youth / Scouting)
status: draft
tags: [research, audit, adr, ddd, people, staff, manager-legacy, youth-academy, scouting, contracts, discipline, loans, c6, 2026-06-08]
context: [people-persona-skills, staff-operations, manager-legacy]
created: 2026-06-08
updated: 2026-06-08
type: research
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
  - [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/state-machines/player-contract-lifecycle]]
  - [[../10-Architecture/state-machines/loan-orchestration]]
  - [[../10-Architecture/state-machines/player-discipline]]
  - [[../10-Architecture/state-machines/youth-academy]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../50-Game-Design/GD-0007-youth]]
  - [[../00-Index/Current-State]]
  - [[../00-Index/Decision-Log]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# ADR re-audit — Cluster C6 (People / Players / Staff / Manager / Youth / Scouting)

Audit pass over the ten C6 ADRs against the existing arc42 set, the
[[../00-Index/Decision-Log]], [[../10-Architecture/bounded-context-map]] and the
binding [[../00-Index/Current-State]] reopen note. Ground-truth constraints
(offline-first PWA, LLM out of authoritative state per ADR-0030, Postgres per
ADR-0027) are taken as given and not relitigated. One targeted external check was
run on the most version-sensitive decisions (RSTP loan caps + Bosman pre-contract)
— see §External verification.

## Headline cross-cutting finding (read first)

**Governance/status drift between ADR frontmatter and the binding reopen note.**
[[../00-Index/Current-State]] carries a binding banner: *"2026-05-27 — Decisions
reopened. All previously `accepted` ADRs and `approved` GDDRs/system notes were
reset to `status: draft` for re-evaluation"* and *"Active phase: research /
analysis / architecture planning — no development."* Yet in C6, **ADR-0051,
ADR-0053 and ADR-0061 still carry `status: accepted` + `binding: true`** in their
own frontmatter (confirmed: `grep -m1 "^status:"`). The same drift exists on
their siblings ADR-0050 / ADR-0058 / ADR-0062. The Decision-Log index also lists
these as `accepted`. So two sources of truth disagree about whether anything in
this cluster is binding. Per the "single current truth" rule
([[../90-Meta/vault-governance]]) and the read-only-on-existing-files rule, this
should be reconciled centrally (one supersession/clarification note), not by
silently editing the ADRs. This is the single most important issue in the cluster
because every downstream "if ADR-0051/0053 is ratified" reference in the `proposed`
ADRs hangs off it.

## Per-ADR verdicts

### ADR-0051 — Manager and Legacy Context — `sound` (with a status-drift caveat)
Decision (own 12th BC for cross-run manager identity / run-analysis / legacy /
prestige; cross-save meta read-only-at-creation) is well-argued: industry
roguelite precedent + DDD overload argument + downstream ADR-0052/0082 commitments.
The snapshot-at-creation determinism rule is the load-bearing invariant and is
clean. Evidence: §Determinism "A running save must never read mutable cross-save
meta after creation … copied into the save snapshot". Issue: frontmatter says
`accepted`/`binding:true` but the 2026-05-27 reopen reset it to draft — stale
status marker, not a stale decision. Confidence: high.

### ADR-0052 — People, Persona & Skills Context — `sound` (still `draft`, correctly)
The keystone of the cluster — Scouting (0064), Staff Ops (0053), Discipline (0078)
and Loans (0075) all reference it as the actor-identity owner. D1=A (own
profile/relationship/scoring context) / D2=A (ratify boundary, ship thin slice
behind `peopleModelVersion`) are coherent and match CK3 Opinion / Talk-of-the-Town
/ FM precedent. Evidence: explicit "People does **not** own" list cleanly separates
it from Squad/Match/Transfer truth. Issue: it is an **upstream dependency that is
still draft while three downstream ADRs are also draft and several
ratified-then-reopened siblings already name it** — a ratification-ordering knot,
not a design flaw. Confidence: high.

### ADR-0053 — Staff Operations Context — `sound` (status-drift caveat)
13th BC for staff hire/fire/contract FSM + role assignment + pipeline-coverage +
wage-event emission; clean Customer-Supplier→ledger pattern (ADR-0050) and
explicit non-ownership of player contracts. Evidence: Option B recommendation with
five-of-six DDD criteria + Sporting-Director real-world precedent. Issues: (a)
same `accepted`/`binding:true` vs reopen-to-draft drift; (b) the GD-0020/GD-0021
**staff-skill effect-activation gate is still an open MVP decision** (GD-0021 §
"Staff skills … Option A/B/C") — the structural ownership is fine but the
behavioural surface it plans for is unresolved. Confidence: high on structure,
medium on the deferred staff-skill activation.

### ADR-0060 — Youth Academy Context — `sound` (`proposed`)
Strongest-in-wave 6/6 DDD firing; the annual-cadence vs weekly-Training
cadence-mismatch argument (Vernon long-running-process) is the decisive and
correct one. D1=C (own coarse BC) / D2=A (Regulations owns home-grown
*interpretation*, Academy owns *history facts* + derived counter) is the right
split and avoids meaning-drift. Evidence: Option D explicitly ruled out by ratified
ADR-0053 §Decision (no player ownership). Issue: `YouthLoaned` is emitted with "no
real downstream until [the loan] PM exists" — now resolved by ADR-0075, so the two
must ratify in a consistent order. Confidence: high.

### ADR-0061 — Club Management Sub-Aggregate Audit — `sound` but **only weakly in C6**
Primarily an economy-cluster decision (Stadium / CommercialPortfolio / Audience &
Atmosphere). It belongs to C6 only via the "club-mgmt aggregate" boundary and
because Manager & Legacy's `clubBuilding` signal (ADR-0082) consumes its outputs.
Within its own remit it is sound and ratified. Issues for C6: (a) same
`accepted`/`binding:true` vs reopen drift; (b) the ratification note names **real
club legal entities** (Bayern Allianz Arena GmbH, BVB Stadionmanagement GmbH,
Real Madrid Bernabéu JV) as rationale — research-prose only, not gameplay-facing,
so GD-0015/ADR-0007 IP-clean rule is not breached, but it is worth a one-line
"rationale cites real entities; no in-game naming implied" guard to avoid the
pattern leaking into seed data. Confidence: high (decision); the C6 relevance is
marginal.

### ADR-0064 — Scouting Activity Context — `sound` (`proposed`)
Own BC for scout *activity* (assignment/report-lifecycle/coverage/lists/hidden-flag
reveal) distinct from scout *identity* (People). The decisive argument is correct:
only an own context honours the binding `bounded-context-map` §3.1 Impact-Lens
no-cross-context-join rule. HITL decisions (recruitment-only opposition w/ reserved
hook; Scouting-discovers→Academy-intakes; reveal-gated-but-truth-stays-in-owner)
are clean seams. Evidence: §Determinism "Hidden-flag *truth* is never copied into
Scouting; only the **reveal state**". Issue: this ADR is the clearest instance of
the **"20th context" collision** — it claims the 20th, as do several parallel ADRs;
ADR-0089 now reconciles this to a stable ordinal-by-ADR-number scheme. Verdict
stays sound *conditional on* ADR-0089's reconciliation landing. Confidence: high.

### ADR-0073 — Player Contract Lifecycle FSM — `sound` (`proposed`)
D1=B (Squad & Player owns the lifecycle truth; Transfer owns three process cases:
Renewal / PreContract / FreeAgent; Regulations owns eligibility verdicts;
Notification owns warnings; Club Mgmt owns ledger) is the right ownership split and
fixes the genuine modelling defect it names: the club-to-club transfer FSM cannot
represent free-agent / Bosman / internal-renewal because `seller_club_id` is
non-null. Invariants PCL1–PCL9 are tight and the "keep `seller_club_id` non-null,
use separate cases" rule (PCL3) is exactly right. External check confirms the
Bosman six-month pre-contract rule it models is **current** (RSTP Art. 18(3), Jan
2025 edition — see §External verification). Issues: (a) the eleven lifecycle states
+ five "terminal *event*" rows mix states and events in one table — minor
ubiquitous-language tidy needed before the FSM note is authoritative; (b) it
explicitly keeps "future Contracts/CLM context" open — fine, but that open seam is
*shared* with ADR-0075 (loans) and should be tracked once, not twice. Confidence: high.

### ADR-0075 — Loan-Orchestration Process Manager — `sound` (`proposed`)
Transfer-led saga owning `LoanAgreement` FSM + playing-time monitor + `LoanQuality`
read-model; no new BC; finance via intents→Club Mgmt ACL; eligibility via
Regulations queries; minutes authoritative from Match. The RSTP grounding is
accurate and current (loan caps 6/6 from Jul-2024, ≤3 between same two clubs,
U-21/club-trained exemption, window-to-window min / ≤1yr max, sub-loan ban — all
confirmed in §External verification). LO1–LO11 invariants are strong; LO6
(guarantee grants recall *right*, never forces selection) and LO7 (loan-quality is
a pure function, no RNG) are correct and match both RSTP and FM. Issues: (a)
**Decision-Log records D2=B for this ADR but the ADR body and HITL gate both say
"D2 = Option + obligation-to-buy"** with the prose mapping that to "B" only in the
log — a labelling inconsistency to reconcile (the substance is consistent; the
A/B/C letter is not); (b) it couples the loan saga to the permanent-transfer
completion path via conditional obligation-to-buy earlier than a minimal model
would — acknowledged in §Consequences, acceptable but a real implementation
sequencing risk; (c) shares the "future Contracts/CLM context" seam with ADR-0073.
Confidence: high.

### ADR-0078 — Player Discipline Suspension Contracts — `sound` (`proposed`)
D1=A (Squad & Player owns the discipline ledger / suspension window / appeal case /
eligibility projection; Match owns card facts; Regulations owns profiles) is
consistent with ADR-0056's "consumer owns applied process state" pattern. D2=A
(straight-red appeals only), D3=A (profile-driven scope), D4=A (appeal resolves
before next relevant fixture, keeping line-up lock deterministic) are
well-justified. `PlayerSuspendedV1` is the canonical event other ADRs (0076)
depend on, and it is self-contained (no consumer joins). Evidence: invariants
D1–D8, esp. D4 "suspended player cannot be selected at Match line-up lock". Issue:
the appeal-timing rule (D4 = resolve before next relevant fixture) is in mild
tension with the async-escalation/deadline FSM thinking in the recent FMX-101/102
work ([[fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]) — a
multi-day async hearing (its own Option B) may be wanted later in async multiplayer;
worth a forward note so it is not silently precluded. Confidence: high.

### ADR-0082 — Manager Style-Signal & Run-Analysis Contract — `sound` (`proposed`)
Fills ADR-0051's draft `ManagerStyleSignals` / `RunAnalysisSnapshot` /
`PostRunReflection` surface; consumes ADR-0074's tactical fingerprint (does not
re-open it); names no archetype (G3 deferral). D1–D4 = A/A/A/A are right: hooks-only,
coarse signals + 3-band confidence (numerics Expert-tier only), **no start-finance
perk in MVP** (correctly prevents the early-snowball anti-pattern), minimal-but-real
reflection. Invariants M1–M10 are strong, esp. M2/M5 (pure deterministic projection
from published facts, no joins, no `*Rng`). Issue: the `clubBuilding` signal
depends on facts from contexts that are themselves `proposed`/reopened (Stadium
Ops / Audience & Atmosphere / CommercialPortfolio) — flagged in the ADR as
"reserved hooks", so not a defect, but it means this contract cannot be fully
exercised until that economy cluster settles. Confidence: high.

## Cross-ADR issues within C6

1. **Status vs reopen drift (highest priority).** ADR-0051/0053/0061 (and economy
   siblings 0050/0058/0062) carry `accepted`/`binding:true` while the binding
   Current-State note says all accepted ADRs were reset to `draft` on 2026-05-27.
   Decision-Log mirrors the stale `accepted`. One central reconciliation note
   should state the canonical status; the ADR files must not be edited piecemeal.

2. **The "if ADR-0051/0053/0052 is ratified" dependency knot.** ADR-0052 (People)
   is the upstream identity owner for 0053/0064/0078/0075 yet is itself `draft`;
   0051 is the upstream legacy/seed owner for 0053/0060/0064/0082. Several of these
   downstreams are also `draft`/`proposed`. There is no single note that fixes the
   **ratification order** for the cluster — recommend one ordering note
   (People → Staff Ops / Youth / Scouting → Discipline / Loans / Manager-signal).

3. **"20th bounded context" collision.** ADR-0064 (and the parallel proposals)
   each independently claim "the 20th/21st/22nd context". ADR-0089 reconciles this
   to a stable ordinal-by-ADR-number catalog (19→28). Every C6 ADR with a §Map
   patch proposal should be read as *subordinate to ADR-0089* once it ratifies; the
   per-ADR "17th/18th/20th" prose is now provisional, not authoritative.

4. **Shared "future Contracts/CLM context" seam tracked twice.** ADR-0073 and
   ADR-0075 both keep a future Contracts/CLM bounded context as an extraction seam,
   each with its own wording. This is one decision (does player+staff+commercial+loan
   contract complexity warrant a CLM context post-MVP?) and should be a single
   tracked open question, not two parallel footnotes that could drift.

5. **Loan D2 option-letter inconsistency.** ADR-0075 body/HITL say "Option +
   obligation-to-buy" while the Decision-Log labels it `D2=B`; ADR-0078 etc. use
   A-letters for the chosen option. The substance agrees; the A/B/C letter does not.
   Minor, but it is exactly the kind of ubiquitous-language drift the vault forbids.

6. **Discipline appeal-timing vs async-multiplayer thinking.** ADR-0078 D4 fixes
   appeal resolution before the next relevant fixture (deterministic lock); the
   FMX-101/102 async-escalation work points toward multi-day async deadlines. Not a
   contradiction today, but the two should be cross-linked so the MVP choice does
   not silently preclude the async hearing later.

7. **IP-clean rationale hygiene.** ADR-0061 (and to a lesser extent 0060's
   EPPP/NLZ/UEFA-HGP analogues) cite real entities/regulations in *rationale*. The
   gameplay-facing IP-clean hardline (GD-0015/ADR-0007) is respected (abstract
   tiers, fictional profiles), but a one-line guard ("real names appear in rationale
   only; never in seed/sample data") would harden the seam.

## Proposed decisions (new/superseding — working titles only)

- **GD/governance note — C6 status reconciliation & ratification order** (not a new
  BC). Fixes the canonical status of 0051/0053/0061 vs the reopen note and records
  one cluster ratification order (People first). Low map cost; resolves issues 1+2.
- **New ADR — Contracts/CLM extraction-seam decision** consolidating the
  ADR-0073 + ADR-0075 "future Contracts context" footnotes into one tracked
  open question (resolves issue 4). Likely "defer, keep seam" — but as one decision.
- Everything else in C6 is sound enough to ratify **as-is** once status/order is
  reconciled; no design supersession is warranted by this audit.

## External verification

- **RSTP loans (ADR-0075).** Confirmed current via Perplexity against the FIFA RSTP
  **January 2025 edition, Article 10**: simultaneous international loan caps phased
  8 (2022/23) → 7 (2023/24) → **6 from 1 July 2024 onward**; **≤3** loans between the
  same two clubs each direction; **U-21 and club-trained players exempt** from the
  caps; minimum duration = interval between two registration periods, **maximum 1
  year** (multi-year only via successive ≤1yr agreements with player consent);
  **sub-loan to a third club prohibited**; on early termination the home contract
  reactivates. ADR-0075's §Context and LO9/LO10 match this exactly.
- **Bosman / pre-contract (ADR-0073).** Confirmed current: **RSTP Art. 18(3)**
  (Jan 2025 edition) — a player may conclude a contract with a club in *another
  association* if his contract has expired or is **due to expire within six months**,
  with written notice to the current club. ADR-0073's `pre_contract_eligible` state
  and PCL9 are consistent. (Domestic pre-contract windows remain association-specific
  — correctly modelled as Regulations profile data, not hard-coded.)
- Sources (Perplexity, 2026-06-08): FIFA RSTP Jan-2025 edition (Art. 10, Art. 18(3));
  FIFA media release "FIFA to introduce new loan regulations"; Morgan Sports Law
  commentary on the loan provisions.
- **FSM library currency** (deferred to implementation by the ADRs, e.g. ADR-0064
  cites "XState v5 — 5.20.1"): not re-verified here because all C6 ADRs explicitly
  defer the concrete FSM-library pick to implementation phase with a "re-verify
  currency at that time" clause — the correct posture for a docs-only phase. Flag for
  re-check when implementation resumes.
