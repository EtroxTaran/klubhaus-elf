---
title: ADR-0079 Dynasty Board, Ownership & Bankruptcy FSMs
status: accepted
tags: [adr, architecture, ddd, dynasty, board, confidence, ownership, takeover, bankruptcy, administration, club-management, determinism, replay, fmx-89]
created: 2026-06-05
updated: 2026-06-12
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[../bounded-context-map]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[../state-machines/dynasty-board-and-ownership]]
  - [[../../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
  - [[../../50-Game-Design/GD-0010-ai-world]]
  - [[../../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
  - [[../../60-Research/raw-perplexity/raw-board-confidence-real-world-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-club-takeover-administration-real-world-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-board-ownership-comparable-games-2026-06-05]]
  - [[../../60-Research/raw-perplexity/raw-deterministic-long-sim-patterns-2026-06-05]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/late-game-systems]]
  - [[../../60-Research/ai-manager-behaviour]]
---

# ADR-0079: Dynasty Board, Ownership & Bankruptcy FSMs

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **FMX-146 amendment applied 2026-06-12.** ADR-0101 D4 now treats this ADR / GD-0030
> as the owner of the shared `InsolvencyCaseStage` enum and maps insolvency events to
> ledger effects without creating a second finance FSM. Administration, points deduction,
> embargo, wage-cap policy and fire-sale opening are policy/state facts; completed fire
> sales reuse ADR-0105 registration postings; creditor haircut/forgiveness maps to
> `InsolvencyCreditorWriteOffPosted` inside ADR-0050.

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** FMX-89 (E5 epic FMX-61) closes the late-game
> arc gaps **G2/G20** by promoting research-tier board-ambition, ownership-
> transition and bankruptcy/administration prose into ratified, deterministic,
> calibratable state machines. **D1–D4 were chosen live by Nico on 2026-06-05 =
> A, A, A, A.** Ownership lands on the **existing Club Management bounded context**
> as a new **"Board & Ownership" sub-aggregate set** — so **no bounded-context-map
> structural change** beyond a one-line sub-aggregate clause (proposed, applied on
> ratify per [[../../90-Meta/vault-governance]]). It locks **no numeric constants**:
> every threshold, cap, deduction band, decay rate and budget multiplier is
> **GD-0043 `dynasty.ownershipBoard` calibration debt** behind a `dynastyModelVersion`. The
> **liquidation → phoenix-club** tail and **creditor-CVA negotiation** are
> explicitly **reserved** (named hooks only).

## Date

- Proposed: 2026-06-05 (FMX-89)

## Context

The dynasty/late-game layer is richly researched but unratified. Board-ambition
escalation ([[../../60-Research/ai-manager-behaviour]] §10.5 — 8 tiers, ±1-tier
ratchet, confidence coupling §9.1), ownership transitions
([[../../60-Research/late-game-systems]] §6 — `OwnerProfile`, 6 archetypes, §6.3
`instability_score`) and bankruptcy/administration (§6.4) are the two levers that
keep a 50-year save volatile rather than flat — GD-0010's named **"Club Boss
late-game flatline"** retention-failure mode. They are also the highest-blast-
radius late-game FSMs (finance, board pressure, narrative), so their **ownership
and determinism** must be pinned before any UI or tuning.

Pre-existing constraints this ADR must honour:

- **Club Management is the sole finance-ledger writer** and *already owns* budget
  envelopes, **board pressure** and staged **insolvency state**
  ([[ADR-0050-club-economy-accounting-ledger]]; [[../bounded-context-map]] §1).
  Other contexts emit facts via **Customer-Supplier + ACL**.
- **Manager & Legacy** owns manager identity + run analysis + cross-save meta, with
  *"cross-save meta read only at save creation, never during a running save"*
  ([[ADR-0051-manager-and-legacy-context]]).
- **AI World Simulation** (proposed [[ADR-0071-ai-world-simulation-context-and-drift-contract]],
  FMX-91) publishes `RisingRivalTriggered` / `GiantCollapseTriggered` /
  `ContinentalEraShifted` and pinned the `instability_score` model + the
  `worldAiMgmt:structural:year:<y>:takeover:<clubId>` and
  `worldAiMgmt:drift:season:<s>:owner-resistance:<clubId>` sub-labels. **FMX-89
  consumes these; it does not redefine them.**
- **Determinism** ([[../../60-Research/determinism-and-replay]]): stream #1
  `WorldRng` (world drift / league restructure / board events), stream #2
  `WorldAiMgmtRng` (out-of-match AI-management decisions); seed by
  `xxhash32(label, masterSeed)`; new labels never perturb existing streams; every
  stochastic draw declares a sub-label ([[ADR-0018-systemic-events-and-player-lifecycle]] §3).

Per [[ADR-0019-modular-monolith-ddd]], contexts interact only via commands +
queries/read-models + domain events (JSON/Zod), with **no cross-context joins**.

## Options Considered

- **D1 ownership:** all in Manager & Legacy · split (ownership in Club Management,
  board ambition in Manager & Legacy) · **all in Club Management as a Board &
  Ownership sub-aggregate set (chosen)** · new "Dynasty Governance" bounded context.
- **D2 bankruptcy scope:** **core MVP + reserved liquidation/CVA tail (chosen)** ·
  full MVP incl. liquidation/phoenix · reserved-stub only.
- **D3 RNG allocation:** **`WorldAiMgmtRng` for stochastic ownership/bankruptcy +
  deterministic board ladder (chosen)** · all on `WorldRng` · hybrid per FMX-91.
- **D4 owner model:** **6 named presets on a continuous trait space (chosen)** ·
  discrete archetypes only · continuous traits only.

## Decision

Nico selected the four planning defaults live (2026-06-05): **D1 = Club Management
sub-aggregates**, **D2 = core MVP + reserved tail**, **D3 = `WorldAiMgmtRng` +
deterministic board ladder**, **D4 = 6 named presets on a trait space**.

### D1 — Ownership: a "Board & Ownership" sub-aggregate set inside Club Management

| Option | Description | Trade-off |
|---|---|---|
| A. Manager & Legacy owns all three | Extend ADR-0051 to own board ambition + ownership + bankruptcy. | One owner; but these are **club-level** concerns and ADR-0051 is scoped to manager meta + the cross-save-meta-at-creation rule — a poor fit. |
| B. Split (CM owns ownership+bankruptcy, M&L owns board ambition) | Ledger-coupled FSMs in Club Management; board relationship in Manager & Legacy. | Separates manager-vs-club; but board ambition reads club perf/finance heavily → more cross-context queries, and "board pressure" already lives in Club Management. |
| **C. All in Club Management (chosen)** | Board-ambition, ownership-transition and bankruptcy/administration become a **Board & Ownership sub-aggregate set** in Club Management. | **Chosen (Nico).** ADR-0050 already gives Club Management board pressure + insolvency stage + sole-ledger-writer, so bankruptcy fire-sales/points and ownership budget effects need **no cross-context ACL**; **no new BC** (keeps the context map stable; mirrors FMX-82's "avoid BC proliferation"). Cost: Club Management's sub-aggregate set grows. |
| D. New "Dynasty Governance" bounded context | A dedicated BC owns all three. | Cleanest DDD seam + room to grow; but adds a context (governance prefers a stable map) and heavy ACL traffic back to the ledger. |

**Chosen: Option C.** Club Management gains three cohesive sub-aggregates:

- **`BoardRelationship`** — the deterministic expectation ladder + confidence +
  2-phase sacking (per club, per manager tenure).
- **`OwnerProfile` + `OwnershipTransition`** — the owner archetype (preset + trait
  vector) and the takeover FSM.
- **`InsolvencyCase`** — the bankruptcy/administration FSM (extends the existing
  "staged insolvency state" ADR-0050 already names).

**Manager & Legacy** consumes the emitted facts (`ManagerSacked`,
`BoardConfidenceChanged`, run-end outcomes) for run analysis only — it stores
analysis snapshots, not alternate truth (ADR-0051 rule preserved). The board
ladder is **per-save in-world state**, never the mutable cross-save meta ADR-0051
forbids reading at runtime.

### D2 — Bankruptcy scope: core MVP + reserved liquidation/CVA tail

| Option | Description | Trade-off |
|---|---|---|
| **A. Core MVP + reserved tail (chosen)** | Ratify entry → points deduction → transfer embargo → administrator fire-sale → rescue(new-owner)/survival. Reserve liquidation→phoenix + creditor-CVA negotiation as post-MVP named hooks. | **Chosen.** Ships exactly what FM ships; defers the tail that touches **league registration + save structure** (highest blast radius). |
| B. Full MVP incl. liquidation/phoenix | Ratify the entire arc now. | Most complete; pulls league-registration + save-structure concerns in and is highest-risk to lock from intuition. |
| C. Reserved-stub only | Entry trigger + a simple insolvency flag; full FSM later. | Lowest commitment; leaves the highest-blast-radius FSM under-pinned (the issue flags this as a risk). |

**Chosen: Option A.** Administration MVP exposes a points-deduction effect
(band ~ −9..−15; EFL real anchor −12 — magnitude = calibration), a transfer
embargo, an administrator fire-sale (AI buyer valuation discount), an enforced
wage cap, and the **heroic-save vs abandon** player fork. **Reserved (not MVP):**
`liquidated` → `PhoenixClubFounded` and creditor-CVA negotiation — named hooks +
future FSM transitions only; a later E5/League issue coordinates league
registration + save-structure impact.

### D3 — RNG allocation: `WorldAiMgmtRng` for stochastic, deterministic board ladder

| Option | Description | Trade-off |
|---|---|---|
| **A. AiMgmt + deterministic board (chosen)** | Ownership-transition + bankruptcy stochastic draws use `WorldAiMgmtRng`; board-ambition escalation is a pure deterministic function of finish-vs-target (no draw). | **Chosen.** Reuses FMX-91's `worldAiMgmt:structural:...` grammar; the ±1-tier ladder is deterministic by construction → cleanest replay. |
| B. All on `WorldRng` | Treat board/ownership/bankruptcy as impersonal world-structural events. | Matches the literal determinism-table wording "board events → WorldRng"; but diverges from FMX-91's AiMgmt takeover precedent. |
| C. Hybrid per FMX-91 | AI-management draws (archetype pick, owner-resistance) on `WorldAiMgmtRng`; impersonal outcomes (insolvency audit) on `WorldRng`. | Most precise; two streams to reason about per event. |

**Chosen: Option A.** Sub-label taxonomy (all under stream #2 `WorldAiMgmtRng`,
extending FMX-91's grammar; immutable components only — `clubId`, `seasonId`,
`year` — never reschedulable indices):

```text
worldAiMgmt:structural:year:<year>:takeover:<clubId>          # (existing, FMX-91) takeover candidacy resolution
worldAiMgmt:structural:year:<year>:ownership:<clubId>:archetype-pick   # new owner archetype draw
worldAiMgmt:structural:year:<year>:ownership:<clubId>:effect-shape     # effect-vector shaping
worldAiMgmt:structural:year:<year>:insolvency:<clubId>:audit           # annual insolvency-audit outcome
worldAiMgmt:structural:year:<year>:insolvency:<clubId>:firesale:<slot> # per-slot fire-sale realization
worldAiMgmt:structural:year:<year>:insolvency:<clubId>:writeoff:<creditorClass>:v1 # creditorWriteoffBand collapse
worldAiMgmt:structural:year:<year>:insolvency:<clubId>:rescue          # rescue-bid emergence
worldAiMgmt:drift:season:<seasonId>:owner-resistance:<clubId>          # (existing, FMX-91) archetype-resistance modifier reused
```

**Board-ambition escalation, confidence and the 2-phase sacking ladder declare
NO `*Rng`** — they are pure deterministic functions of (finish vs target, results,
finance state, fan signals). *(Reconciliation: the [[../../60-Research/determinism-and-replay]]
table lists impersonal "board events" under `WorldRng`; the AI-management
ownership/insolvency *decisions* here follow FMX-91 on `WorldAiMgmtRng`, and the
board ladder needs no stream at all. No contradiction — this ADR records the split
explicitly.)*

### D4 — Owner model: 6 named presets on a continuous trait space

| Option | Description | Trade-off |
|---|---|---|
| **A. Named presets + trait axes (chosen)** | Keep the 6 named archetypes as presets, each a point in a continuous 6-axis trait space driving event weights. | **Chosen.** OOTP-style legibility + the research's "continuous, not binary" replay-stability; preserves the §6.2 archetypes. |
| B. Discrete archetypes only | 6 hard bins with fixed tables. | Simplest; research warns of threshold-abuse + less replay-stable tuning. |
| C. Continuous traits only | Pure trait vectors, no names. | Most flexible; loses the legible narrative hook. |

**Chosen: Option A.** Six presets (Foundation, Sugar-Daddy, Asset-Stripper,
Petrol-State, Murky, Foreign-Business) each map to a vector over
`{ ambition, patience, financialPrudence, riskAppetite, interference,
identityRigidity }` (0-1). The vector drives budget multipliers, manager patience
and **archetype-resistance** modifiers on structural-event probabilities (a stable
Foundation suppresses giant-collapse/administration; a reckless Asset-Stripper
amplifies them) — generalising the §4.3 personality-drift-cap substrate. Generated
owner names are IP-safe per [[ADR-0007-naming-schema]].

## Public contract direction

Board & Ownership sub-aggregates emit self-contained domain events (no consumer
joins). Draft set:

```text
# BoardRelationship (deterministic)
BoardExpectationSet        { clubId, seasonId, tier (1-8), primaryTarget, cupTargets[], strategyGoals[], minimumAcceptableBand }
BoardConfidenceChanged     { clubId, managerTenureId, seasonId, state, scoreBand, topHelpingFactors[], topHurtingFactors[] }
BoardOverrideObjectiveSet  { clubId, managerTenureId, window: { matches, pointsTarget }, deadlineMatchOrdinal }
ManagerSacked              { clubId, managerTenureId, seasonId, reason, finalScoreBand }   # Manager & Legacy consumes for run-analysis

# OwnerProfile / OwnershipTransition (stochastic; WorldAiMgmtRng)
OwnerProfileAssigned       { clubId, ownerProfileId, archetypePreset, traitVector, budgetPolicy, rngLabel, provenance }
OwnershipTransitionTriggered { clubId, seasonId, cause: instability|giant-collapse|rising-rival|owner-fatigue, instabilityScoreSnapshot, rngLabel }
OwnershipTransitionResolved  { clubId, seasonId, outcome: completed|blocked-by-odt|withdrawn, newOwnerProfileId?, fitAndProperVerdict, rngLabel }
OwnerExpectationResetApplied { clubId, fromTier, toTier, budgetPolicyDelta }

# InsolvencyCase (stochastic; WorldAiMgmtRng) — core MVP
InsolvencyStageChanged     { clubId, insolvencyCaseId, fromStage, toStage, reason, dynastyModelVersion }
AdministrationEntered      { clubId, seasonId, pointsDeductionBand, embargoScope, wageCapPct, rngLabel }
InsolvencyWageCapPolicySet { clubId, insolvencyCaseId, wageCapPct, effectiveWeekId }
AdministratorFireSaleOpened{ clubId, valuationDiscountBand, mustSellThreshold }
ClubRescued                { clubId, rescueOwnerProfileId, creditorWriteoffBand, reputationPenaltyBand, legacyCredit: 'saved-the-club' }
ManagerAbandonedClub       { clubId, managerTenureId, legacyPenalty: 'abandoned-sinking-ship' }
# Reserved (post-MVP, named only): ClubLiquidated, PhoenixClubFounded, CvaProposed, CvaAccepted
```

`InsolvencyCaseStage` is the shared enum:
`stable | stressed | cash_flow_crisis | under_embargo | administration | rescued | liquidated`.
`liquidated` remains a post-MVP reserved hook. ADR-0050 references this enum instead of
owning a separate staged insolvency FSM.

Ledger mapping (ADR-0101 D4 / FMX-146): `AdministrationEntered`, points deductions,
embargoes, wage caps and `AdministratorFireSaleOpened` are not postings. Wage-cap policy
constrains future ADR-0105 wage blocks; completed fire sales use ADR-0105
`RegistrationDisposalSettled` / `RegistrationWriteOffPosted` with `insolvencyCaseId`
provenance; `ClubRescued` with a creditor haircut creates ADR-0050
`InsolvencyCreditorWriteOffPosted`.

Draft commands/queries: `EvaluateBoardSeason(clubId, seasonId)`,
`OpenBoardConfidenceMeeting(clubId)`, `ResolveOwnershipTransition(clubId)`,
`RunInsolvencyAudit(clubId, year)`; read-models `BoardRelationshipBoard(clubId)`,
`OwnerProfileSnapshot(clubId)`, `InsolvencyCaseStatus(clubId)`.

**Consumed (via ACL / events):** AI World Simulation
`GiantCollapseTriggered` / `RisingRivalTriggered` (ownership-transition triggers);
Match/League results + Club Management finance state (board ladder + insolvency
audit). **Emitted ledger effects stay inside Club Management** (it is the
sub-aggregates' own context) — no ledger write occurs outside Club Management.
FMX-146 narrows "ledger effects" to actual economic events: stage/policy events
do not post, completed fire sales reuse ADR-0105 registration postings and creditor
haircuts use ADR-0050 `InsolvencyCreditorWriteOffPosted`.

## Invariants

| # | Invariant |
|---|---|
| **DB1** | All ownership/insolvency stochastic draws use **`WorldAiMgmtRng`** sub-labels only; no draw reads another stream. |
| **DB2** | Board-ambition escalation, confidence and the 2-phase sacking ladder are **pure deterministic functions** of in-world state — they declare **no `*Rng`**. |
| **DB3** | RNG sub-labels use **immutable components** (`clubId`, `seasonId`, `year`) only; a shipped label's draw count + purpose are frozen — new behaviour uses a new label (future-proof per determinism-and-replay §2.3). |
| **DB4** | The board ladder is **per-save in-world state**, never the mutable cross-save meta ADR-0051 forbids reading at runtime. |
| **DB5** | **No finance-ledger write occurs outside Club Management** (the sub-aggregates live inside it); consumed external drift arrives via ACL/events, never cross-context joins. |
| **DB6** | Structural events obey **caps + cooldowns**: ≤1 takeover/league/(5-7 seasons), ≤2 globally/season, per-club cooldown; eligibility→bounded probability→cap/cooldown gate→deterministic apply (bands = calibration). |
| **DB7** | Owner archetype = a **named preset + a continuous trait vector**; resistance/amplification is a continuous modifier, never a bespoke code path. |
| **DB8** | The cross-season expectation **ratchet is bounded to ±1 tier/season**. |
| **DB9** | Bankruptcy MVP is **administration → rescue/survival**; **liquidation → phoenix-club and creditor-CVA are reserved** (named hooks + future transitions only). |
| **DB10** | Ownership change passes a **fit-and-proper / Owners'-&-Directors' gate**; a disqualifying buyer flag blocks the takeover or forces a later sale. |
| **DB11** | Determinism invariant: **same `worldSeed` + same fixtures → byte-identical board/ownership/insolvency event sequence.** |
| **DB12** | All numeric magnitudes are **calibration debt** behind `dynastyModelVersion`; no constant is locked in this ADR. |

## Determinism, persistence and tests

### Determinism ([[ADR-0018-systemic-events-and-player-lifecycle]] §3)

Structural decisions resolve on a **season-end structural pass** (aligning with
FMX-91's `generatedBy: 'season-end-structural-pass'`); finance/board-confidence
tracking is continuous but RNG-free. Sub-label taxonomy declared above. No
`Math.random()`/`Date.now()`.

### Persistence ([[ADR-0027-postgres-data-model]] / [[ADR-0028-postgres-transactional-outbox]])

Per-save schema; cross-context references as opaque branded UUIDs (no cross-context
`references()`). Sketch:

```text
board_relationship { club_id, manager_tenure_id, season_id, expectation_tier,
  primary_target, cup_targets jsonb, strategy_goals jsonb, confidence_score int,
  confidence_state text, override_objective jsonb?, history jsonb }

owner_profile { club_id, owner_profile_id, archetype_preset text,
  trait_vector jsonb, budget_policy jsonb, narrative_flags jsonb, since_season int }

ownership_transition { id, club_id, season_id, cause text, state text,
  instability_score int, fit_and_proper_verdict text, new_owner_profile_id?, rng_label }

insolvency_case { club_id, season_id, state text, points_deduction int,
  embargo_scope text, wage_cap_pct int, fire_sale jsonb, resolution text, rng_label }
```

Outbox for all emitted events.

### Test strategy

- **Golden determinism:** same `worldSeed` + fixtures → byte-identical
  board/ownership/insolvency event streams (DB11).
- **Label-stability:** adding a new sub-label (e.g. an extra fire-sale slot) leaves
  all prior draws bit-identical (DB3).
- **Board ladder determinism:** identical (finish, results, finance) inputs →
  identical confidence/escalation/sacking transitions, with no RNG draw (DB2).
- **Ratchet bound:** expectation never moves more than ±1 tier/season (DB8).
- **Cap/cooldown:** even a forced probability spike cannot exceed the takeover
  caps; cooldown fields gate re-entry (DB6).
- **Boundary:** no ledger write outside Club Management (DB5); no draw outside the
  declared `WorldAiMgmtRng` labels (DB1); ODT gate blocks disqualified buyers
  (DB10); reserved liquidation/CVA transitions are unreachable in MVP (DB9).
- **Contract tests:** AI World Simulation drift facts consumed as transition
  triggers; Manager & Legacy consumes `ManagerSacked`/run-end facts for analysis.

## Map patch proposal (not applied — ratify-gated)

On ratification, [[../bounded-context-map]] gains a one-line clause on the **Club
Management** row noting the new **Board & Ownership** sub-aggregate set
(`BoardRelationship`, `OwnerProfile` + `OwnershipTransition`, `InsolvencyCase`) and
its emitted events; **the context count is unchanged (no new BC)**. The map file is
**not** edited until Nico ratifies (per [[../../90-Meta/vault-governance]]; same
discipline as ADR-0075 / ADR-0077).

## Consequences

Positive:

- One owner + one determinism contract for the two levers that defend the 50-year
  save; ownership/bankruptcy ledger effects need no cross-context ACL.
- Reuses FMX-91's RNG grammar and drift facts; the board ladder is deterministic by
  construction.
- Owners are legible *and* mechanically distinct; takeovers + administration are
  consequential arcs (fixing the genre's cosmetic-takeover / one-shot-bankruptcy
  failures); no magic numbers baked (GD-0043 `dynasty.ownershipBoard`).

Negative / constraints:

- Club Management's sub-aggregate set grows (mitigated by clear FSM boundaries — see
  the state-machine note).
- The most dramatic ending (liquidation → phoenix) is reserved, so MVP bankruptcy
  drama tops out at heroic-save/abandon.
- Realism depends on GD-0043 `dynasty.ownershipBoard` calibration; un-tuned the world is inert or chaotic.

## HITL gate

Authored `proposed` after Nico chose the FMX-89 planning defaults live
(2026-06-05): **D1 = C** (Club Management sub-aggregates), **D2 = A** (core MVP +
reserved tail), **D3 = A** (`WorldAiMgmtRng` + deterministic board ladder),
**D4 = A** (6 named presets on a trait space).

Remaining ratification / follow-up items before implementation:

- all numeric magnitudes (instability factors + threshold, takeover caps/cooldown,
  admin points band, embargo wage-cap %, escalation deltas, confidence
  weights/decay, archetype budget multipliers, owner-resistance modifiers) →
  GD-0043 `dynasty.ownershipBoard` behind `dynastyModelVersion`;
- the **liquidation → phoenix-club + creditor-CVA** slice (reserved hooks) → a later
  E5/League issue (league registration + save structure);
- late-game UI surfaces (board-meeting dialogue, ownership news) → gaps G4-G6;
- the 1-line bounded-context-map Club Management clause (apply on ratify).

## Supersedes

None

## Related Docs

- [[../../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-board-confidence-real-world-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-club-takeover-administration-real-world-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-board-ownership-comparable-games-2026-06-05]]
- [[../../60-Research/raw-perplexity/raw-deterministic-long-sim-patterns-2026-06-05]]
- [[../../50-Game-Design/GD-0030-dynasty-board-and-ownership]]
- [[../state-machines/dynasty-board-and-ownership]]
- [[../bounded-context-map]]
- [[ADR-0050-club-economy-accounting-ledger]]
- [[ADR-0051-manager-and-legacy-context]]
- [[ADR-0082-manager-style-signal-and-run-analysis-contract]] — FMX-93. **Disambiguation:** the **owner** archetypes here (`OwnerProfile`, §6.2) are distinct from **manager**-style identity; the manager-archetype *taxonomy* stays deferred (G3) — consumers reference `ManagerStyleSignals`, not a named manager-archetype list.
- [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
- [[ADR-0018-systemic-events-and-player-lifecycle]]
- [[../../60-Research/determinism-and-replay]]
