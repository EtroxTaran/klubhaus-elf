---
title: GD re-audit — Cluster G5 (Economy / Finance / Board / Commercial / Career-progression)
status: draft
tags: [research, audit, re-audit, game-design, gddr, economy, finance, board, ownership, commercial, career-progression, insolvency, cluster-g5, gd-0008, gd-0011, gd-0022, gd-0023, gd-0030]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0011-career-progression]]
  - [[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]
  - [[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]
  - [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0086-background-fast-matchday-cost-settlement]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[adr-re-audit-c5-2026-06-08]]
  - [[adr-re-audit-master-2026-06-08]]
---

# GD re-audit — Cluster G5 (Economy / Finance / Board / Commercial / Career-progression)

Audit of the five cluster-G5 game-design records, reset to `draft` on 2026-05-27 and
needing an explicit ratification disposition in the planning-mode Decision-Queue:
finance/economy spine ([[../50-Game-Design/GD-0008-finance-economy]]),
career-progression/board-trust ([[../50-Game-Design/GD-0011-career-progression]]),
commercial impact & contracts ([[../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts]]),
AI-club economy behaviour ([[../50-Game-Design/GD-0023-ai-club-economy-behaviour]]),
dynasty board & ownership ([[../50-Game-Design/GD-0030-dynasty-board-and-ownership]]).

Ground-truth honoured: offline-first local-first; LLM out of authoritative state; Club
Management is the **sole finance-ledger writer** (ADR-0050); Postgres = system of record.
Read-only on every existing file; any supersession/amendment below is a proposal for Nico,
not an edit. Builds on the C5 ADR re-audit ([[adr-re-audit-c5-2026-06-08]]) — the ADR-side
findings there (no accounting-identity invariant, Investor-ownership drift, `MoneyBand`
collapse rule, insolvency-model-stated-twice) are the architecture mirror of the
design-side findings here, and are not relitigated.

## Headline

The cluster is **design-coherent and unusually well-grounded**: every magnitude is explicitly
deferred to FMX-52 calibration ("directions now, magnitudes at the gate"), the boundary
discipline (CommercialPortfolio owns commercial policy/settlement, Club Management owns the
ledger, AI uses the *same* ledger) is consistent across all five records, and the Investor
real-money path is cleanly isolated from competitive fairness in three records identically.

Four of the five are **clean or near-clean ratifications**. The load-bearing issue is a single
**cross-GD model conflict** plus two **ubiquitous-language drifts**:

1. **Board-model conflict (load-bearing).** [[../50-Game-Design/GD-0011-career-progression]]
   ratifies "**Board trust = a single 0–100% stat (not multi-axis)**" as *binding* MVP design;
   [[../50-Game-Design/GD-0030-dynasty-board-and-ownership]] (FMX-89, D1–D4=A/A/A/A live)
   introduces an **8-tier expectation ladder + 6-state confidence FSM**
   (`confident→concerned→under_review→vote_of_confidence→last_chance→sacked`) +
   per-objective minimum-acceptable bands. These are two different board models for the same
   relationship. GD-0030 lists GD-0011 only as "context" and declares `Supersedes: None` — so
   the conflict is **unreconciled**. Either GD-0030's confidence score *is* the GD-0011 single
   stat (rendered with more states) and that must be stated, or GD-0030 supersedes the
   single-stat constraint. This must be resolved before either ratifies.

2. **Insolvency vocabulary stated three ways.** GD-0008: "warning → overdraft/freeze → arrears
   → licence review → run end / control loss". GD-0030: "stable → stressed → cash_flow_crisis →
   under_embargo → administration → {rescued | liquidated→phoenix}". ADR-0050/0079: "staged
   insolvency state" / `InsolvencyCase` FSM. One descent, three enums. (Design-side mirror of
   C5 re-audit cross-ADR #6.)

3. **GD-0011 status artefact + binding-flag mismatch.** GD-0011 carries `binding: true` and an
   in-file `## Status → approved` block while the phase note says all GDs reopened to `draft`,
   and the other four G5 records are `binding: false` / `status: draft`. A parser/NotebookLM
   export can mis-read this as the one still-binding record. (Mirror of C5 re-audit ADR-0058
   status-artefact finding.)

None of these reopen the *boundary* or *ownership* decisions — they are model-reconciliation
and bookkeeping gaps inside an otherwise sound design map.

---

## Per-GD verdicts

### GD-0008 — Finance, Economy & Stadium — **ratify-with-amendment**, confidence **high**

The core direction is sound and best-practice: economy as MVP pillar, weekly deterministic
ledger with monthly/season views as projections, full accounting as the long-term model,
liquidity≠profit≠compliance separated, in-world Club-owned financing (FMX-49) cleanly split
from the real-money Investor (FMX-50), country profiles as data, progressive disclosure
(Quick/Standard/Expert), "ranges and formulas beat final constants". It feeds ADR-0050/0027
correctly and the C5 ADR re-audit found the *boundary* under it sound.

Amendment needed (not a reopen):
- **Insolvency vocabulary** (cross-GD #2): GD-0008's staged crisis path uses a different state
  vocabulary than GD-0030 and the ADR-0050/0079 `InsolvencyCase` FSM. Pin one canonical FSM and
  have GD-0008 reference it rather than name a parallel ladder.
- All ~9 "Open before approval" items (thresholds, country ranges, balance-test targets, first
  read models, Investor timing) are genuine **FMX-52 calibration / scope** deferrals, not
  blockers to ratifying the *direction*. They should be carried forward as calibration tasks,
  not treated as open design questions in this queue.

dependsOn: ADR-0050 (ledger model — the C5 double-entry/identity proposal), and the
canonical-insolvency-FSM resolution shared with GD-0030/ADR-0079.

### GD-0011 — Career Progression, Board & Objectives — **ratify-with-amendment**, confidence **high**

The narrative spine (club legend → national-team coach; legible per-match board stakes;
end-game systems must exist before launch) is sound, well-grounded in the Anstoss / Club-Boss
research, and already has its Wave-2 successors wired (FMX-84 national-team arc, FMX-89
board/ownership = GD-0030, FMX-95 prestige/HoF). The "Decided / strong" direction is correct.

The problem is the **single 0–100% board-trust stat** (cross-GD #1) and the **binding/status
artefact** (cross-GD #3). The single-stat MVP simplification is a *good* legibility rule for the
match-to-match surface, but it now coexists with GD-0030's ladder+FSM. This is the one G5 card
with a substantive open D-question: is the GD-0030 confidence FSM a *richer rendering of the
same 0–100 trust value* (single source of truth preserved), or does FMX-89 *supersede* the
single-stat constraint? Recommendation: reconcile as one value, many states.

dependsOn: GD-0030 (the board model that must be reconciled with the single-stat rule).

### GD-0022 — Economy Commercial Impact and Contracts — **ratify-as-is**, confidence **high**

A large, disciplined extension of GD-0008's spine: causal commercial loop (fans/fixtures/
stadium/rivalry/competition → demand → policy → settlement → ledger → feedback), season-ticket
lifecycle with deferred-revenue accrual accounting, commercial-contract lifecycle + 3-severity
breach model, cup/competition revenue profiles (6 IP-clean preset families), profile-driven
matchday operating-cost settlement (6 risk tiers), catering/merch operating-model dial,
fan-service campaign catalog, FMX-49 financing boundary, FMX-50 Investor/compliance surface.
Boundary discipline is exemplary throughout ("CommercialPortfolio owns settlement; Club
Management is sole ledger writer per ADR-0050/0061") and every magnitude is a stated
calibration range. The ~40-item "Open before approval" list is almost entirely **scope/breadth
and calibration** ("minimum eight types or full ten", "category pricing vs full dynamic
pricing", "hard country rules vs tunable defaults") — i.e. pure product-scope calls for Nico,
not design defects. The acceptance-scenario set (Gherkin) is thorough.

Inherited, not GD-0022's to fix: the `MoneyBand→amountMinor` collapse rule and the
accounting-identity invariant (C5 ADR re-audit; live in ADR-0050/0070/0086). The one design-level
item worth surfacing to Nico (not a blocker) is the **dynamic-pricing scope call** — GD-0022
itself flags it as "an explicit Nico decision". Ratify the design as-is; route the scope items
to Nico/FMX-52 as a checklist rather than reopening the GDDR.

dependsOn: GD-0008 (it extends the spine); ADR-0058 boundary (already sound in C5).

### GD-0023 — AI Club Economy Behaviour — **ratify-as-is**, confidence **high**

Strong "compose, don't invent" design: the locked manager-AI agent + a thin club
financial-policy layer (5 archetypes), 3 financial regimes (Healthy/Stressed/Distressed) gating
an action set chosen by utility ranking under heuristic + country-compliance constraints, tiered
fidelity (Tier 0 active commercial choices → Tier 2–3 banded), **soft diegetic homeostasis with
no AI stat cheats applied identically to player and AI**, rare bounded insolvency via the
existing FSM, in-fiction owner support that is *never* the real-money Investor, explainability
via rationale tags. It reuses ADR-0050 (same ledger), ADR-0058 (AI as commercial-contract
consumer via the reserved `cashUrgency/fanFitWeight/serviceQualityWeight/renewalBias` hooks —
which GD-0022 confirms FMX-51 now consumes), ADR-0051 (manager archetype), and draws only from
`WorldAiMgmtRng`. Determinism, fairness and boundary all honoured. The genre-norm grounding
(budget-envelope AI protected from collapse; hidden rubber-banding reads as unfair) is the
correct best-practice stance.

The "Open" items are explicit Nico-gated calibration/scope (archetype assignment, insolvency
frequency band, homeostasis aggressiveness, Tier-0 breadth, whether GD-0023 absorbs vs links
the GD-0010 economy slice, AI owner-support gating). One is a genuine **scope call**: whether
AI owner-support is enabled for all profiles or gated (e.g. 50+1) — flagged below. Everything
else is FMX-52. No design defect; ratify-as-is.

dependsOn: GD-0008 / economy-system (ledger + staged insolvency it composes); GD-0030
(shares the owner-archetype trait space and insolvency FSM — they must use the *same*
6-axis archetype vocabulary; currently consistent).

### GD-0030 — Dynasty Board & Ownership — **ratify-as-is** (with the cross-GD reconciliation
noted against GD-0011), confidence **high**

The strongest-grounded record in the cluster: D1–D4 chosen **A/A/A/A by Nico live (2026-06-05)**,
explicit "shape/states/effect-directions only, every magnitude = FMX-52". 8-tier expectation
ladder with a ±1-tier cross-season ratchet; 6-state confidence FSM with 2-phase sacking and the
FM-transparency fix (always surface score + top help/hurt factors); 6 owner archetypes as points
in a continuous 6-axis trait space (OOTP legibility + replay-stable continuous modifiers);
capped stochastic ownership-transition arc with a fit-and-proper gate; staged bankruptcy/
administration MVP arc with the heroic-save/abandon fork (liquidation→phoenix + creditor-CVA
explicitly reserved post-MVP). It is the design companion to ADR-0079 (which the C5 re-audit
verdicted *sound as proposed*) and the state-machine note, and IP-safe naming is honoured
(ADR-0007).

The only items against it are **shared, not intrinsic**: the board-model reconciliation with
GD-0011 (cross-GD #1 — GD-0030 should state whether its confidence FSM *is* the GD-0011 single
0–100 trust value rendered as states, or supersedes that constraint) and the canonical
insolvency FSM vocabulary (cross-GD #2). With those carried as a reconciliation note, the
decision itself ratifies as-is; the D1–D4 choices are already Nico's.

dependsOn: ADR-0079 (its architecture twin); GD-0011 (board-model reconciliation);
shared insolvency-FSM resolution with GD-0008/ADR-0050/0079.

---

## Cross-GD issues (within G5)

1. **Board model conflict (load-bearing).** GD-0011 "single 0–100% stat (not multi-axis)" vs
   GD-0030 "8-tier ladder + 6-state confidence FSM + minimum-acceptable bands". GD-0030 declares
   `Supersedes: None` and treats GD-0011 as context, so nothing reconciles them. → resolve as
   "one trust value, many states", or have FMX-89 explicitly supersede the single-stat rule.
   This is the one open D-question carrying real design weight; everything else is calibration
   or scope.

2. **Insolvency vocabulary stated three ways** (GD-0008 / GD-0030 / ADR-0050+0079). One
   canonical `InsolvencyCase` FSM referenced by all; the GDs name effect-directions over the
   *same* state set. Mirrors C5 re-audit cross-ADR #6 — resolve on the architecture side and
   have the GDs reference it.

3. **GD-0011 binding/status artefact.** `binding: true` + `## Status → approved` on a record the
   phase note reopened to draft, while the other four G5 records are `binding: false`/`draft`.
   Bookkeeping fix on ratify (set to the queue's chosen post-ratification status), not a design
   change.

4. **Owner-archetype vocabulary is shared and must stay single-source.** GD-0030's 6 named owner
   presets on a 6-axis trait space and GD-0023's 5 *financial-policy* archetypes both describe
   AI club ownership/finance personality and both feed AI behaviour + ownership transitions.
   They are currently consistent (GD-0023 = manager-composed financial policy; GD-0030 = owner
   archetype that resets budget philosophy) but the two vocabularies sit in different records;
   one cross-reference sentence ("owner archetype (GD-0030) sets the envelope; financial-policy
   archetype (GD-0023) acts within it") prevents future drift. Minor.

No harmful coupling: the sole-ledger-writer rule, CommercialPortfolio settlement ownership, the
Investor isolation, `WorldAiMgmtRng` determinism and the FMX-52 calibration gate are honoured
identically across all five records.

---

## External research (targeted, weakest points)

The G5 records are already grounded in their own cited research (Anstoss / Club-Boss /
ai-manager-behaviour / EFL administration rules / OOTP archetypes / season-ticket accrual /
top-5 country profiles). The two genuinely-uncertain assumptions both resolve *internally* and
did not warrant new external lookup:

- **Single-stat vs ladder board trust** is a *design-consistency* question between two FMX
  records, not an external fact — the resolution is editorial (one value many states) and is
  Nico's call, not a research gap.
- **AI rubber-banding fairness** (GD-0023) is already grounded ("budget-envelope AI protected
  from collapse is the genre norm; hidden rubber-banding reads as unfair") and matches the
  consistently-cited stance; no contradiction found.

(Where calibration magnitudes are eventually frozen — EFL −12 points anchor, season-ticket
deferral %, country financial-control regimes — re-verify at FMX-52 per the project's
"latest stable, never assume" rule.)

---

## Proposed decisions / amendments (for Nico; numbers assigned centrally)

1. **Board-model reconciliation** (amends GD-0011 and GD-0030): one sentence fixing whether the
   GD-0030 confidence FSM is a richer rendering of the GD-0011 single 0–100 trust value (single
   source preserved — recommended) or supersedes the single-stat constraint. Confidence high
   that the conflict is real; the resolution direction is Nico's.
2. **Canonical insolvency FSM reference** (touches GD-0008, GD-0030, ADR-0050, ADR-0079): one
   `InsolvencyCase` state set; the GDs name effect-directions over it instead of parallel
   vocabularies. Resolve with C5 re-audit cross-ADR #6.
3. **GD-0011 bookkeeping**: clear the `binding:true`/`approved` artefact to match the queue's
   post-ratification status convention.
4. **Owner-archetype cross-reference** (GD-0023↔GD-0030): one sentence keeping the two archetype
   vocabularies single-source. Minor.

No new GD proposed — the gaps are model-reconciliation and bookkeeping, not new game design.
