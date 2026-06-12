---
title: GD-0030 Dynasty Board & Ownership
status: accepted
tags: [game-design, gddr, dynasty, board, confidence, ownership, takeover, bankruptcy, administration, late-game, fmx-89]
created: 2026-06-05
updated: 2026-06-12
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  - [[../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../10-Architecture/state-machines/dynasty-board-and-ownership]]
  - [[../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]]
  - [[../60-Research/insolvency-ledger-posting-contract-2026-06-12]]
  - [[GD-0010-ai-world]]
  - [[GD-0011-career-progression]]
  - [[late-game-systems]]
  - [[ai-manager-behaviour]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# GD-0030: Dynasty Board & Ownership

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Date

2026-06-05

## Player experience goal

A 50-year save should never go flat at the top. The **board** should feel like a
living relationship — a clear bar to clear, genuine warmth when you over-deliver,
mounting pressure and a public vote of confidence when you don't — and the
**owner** should matter: a frugal Foundation, a trigger-happy Sugar-Daddy and a
distressed Asset-Stripper play like different jobs. When a club mismanages its
money the drama is real but *fair* — administration, a points hit, a fire-sale,
and a fork between **saving the club as a hero** or **walking away** — and it
reads from visible causes, never as a dice roll. This is the design answer to
GD-0010's named retention-failure mode, the **"Club Boss late-game flatline."**

## Decided / strong

Companion design model to
[[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
(architecture, ownership, determinism, event contracts) and the FSMs in
[[../10-Architecture/state-machines/dynasty-board-and-ownership]]. This GDDR fixes
the **shape, states and effect *directions*** only; every magnitude is **FMX-52
calibration**. Nico chose **D1–D4 = A/A/A/A** live (2026-06-05). All three systems
are owned by **Club Management** as a "Board & Ownership" sub-aggregate set (D1).

### 1. Board-ambition expectation ladder (deterministic)

An **8-tier** seasonal expectation ladder ([[ai-manager-behaviour]] §10.5):

| Tier | Expectation |
|---|---|
| 1 | Avoid relegation |
| 2 | Lower mid-table |
| 3 | Mid-table |
| 4 | Top half |
| 5 | Europe / continental qualification |
| 6 | Title challenge |
| 7 | Win the title |
| 8 | Win title + deep continental run |

- The season's tier is **set deterministically** from wage/squad-value rank +
  prior finish + owner ambition (no RNG — D3).
- **Cross-season ratchet (±1 tier max/season):** finish ≥ target + 2 →
  expectations **+1 tier** next season; finish ≤ target − 2 → **−1 tier** (with a
  confidence penalty). Over-performance both rewards *and* tightens the next
  bar — the real-world "moving baseline" effect.
- Targets are expressed as a **primary league target + cup target(s) + 1-2
  strategy goals** (e.g. play a style, blood youth, stay within wage budget),
  each with a **minimum acceptable** band (FM pattern).

### 2. Board confidence + 2-phase sacking (deterministic)

- **Confidence** is a smoothed score driven by *distance from the expectation
  band*, weighted by recent results/trend, with modifiers for marquee/derby/cup
  results, fan unrest and board-relationship signals (transfer-support alignment,
  public conduct). Effect *directions* from [[ai-manager-behaviour]] §9.1; weights
  = calibration.
- **Escalation states:** `confident → concerned → under_review → vote_of_confidence
  → last_chance → sacked`, mirroring the real ladder. The bar moves to "orange" at
  `under_review` with an explicit internal target window ("X points from the next
  Y games").
- **2-phase sacking (FM best practice):** dropping below the soft threshold opens a
  **board-confidence meeting** with a temporary **override objective**; meeting it
  returns to `concerned`, failing it (or a hard-floor breach) → `sacked`. A `sacked`
  outcome ends the run and is consumed by **Manager & Legacy** for run-analysis.
- **Transparency (fixing the FM criticism):** always surface the current board
  score + the **top factors helping and hurting** it; only realistically-sackable
  goals (relegation when safety expected, financial collapse, total style failure)
  are ever "Critical".

### 3. Owner archetypes — 6 presets on a continuous trait space (D4)

Six **named presets** ([[late-game-systems]] §6.2), each a **point in a continuous
6-axis trait space** that drives event weights and budget behaviour (OOTP-style
legibility + replay-stable continuous modifiers):

**Trait axes:** `ambition`, `patience`, `financialPrudence`, `riskAppetite`,
`interference`, `identityRigidity` (each 0-1).

| Preset | Character | Spending direction | Manager stance |
|---|---|---|---|
| **Foundation / Community** | Long-term custodian, 50+1 culture | Sustainable wage cap, no debt, youth+local | Most patient; suppresses giant-collapse |
| **Sugar-Daddy** | Benefactor chasing success | Equity injection; ↑ wage + transfer for a few seasons | Impatient unless loyal; escalates expectations fast |
| **Asset-Stripper / Leveraged** | Debt on the club, cash extraction | ↓ wages, forced star sales | Hires "compliant" managers; high administration risk |
| **Petrol-State / Sovereign** | Soft-power, elite ambition | Very high spend (FFP-shaped), long contracts | High pressure for elite success; tolerates rebuilds |
| **Murky** | Shady, unpredictable | Erratic; sudden withdrawal risk | Mid-season board drama; regulatory/AML risk |
| **Foreign-Business / Corporate** | Brand/ROI, data-driven trading | Controlled, FFP-compliant; buy-young-sell-high | Low tolerance for off-philosophy managers |

The named preset gives the narrative hook ("a Sugar-Daddy just bought us"); the
trait vector does the mechanical work (event-weight modifiers, budget multipliers,
manager patience). IP-safe naming per [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]].

### 4. Ownership-transition arc (stochastic, capped)

- **Trigger:** the `instability_score` model from
  [[../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]] / [[late-game-systems]]
  §6.3 (financial stress + performance + ownership tenure/satisfaction; ≥ threshold
  → takeover candidate), plus consumed AI-World-Sim drift facts (`GiantCollapseTriggered`
  feeds asset-stripper/distressed takeovers; `RisingRivalTriggered` feeds
  sugar-daddy/sovereign ones).
- **Flow:** `stable → takeover_candidate → sale_in_progress → (fit-and-proper gate)
  → new_owner` with an **archetype draw** (the new owner's preset) and an **effect
  vector** (budget philosophy + expectation reset). At completion the player gets
  **decision points — align / resist publicly / leave gracefully** (each with a
  job-security / reputation consequence, from §6.2).
- **Fit-and-proper / Owners' & Directors' gate:** buyer flags (criminal /
  disqualified / sanctioned / repeat-insolvency) can **block** a takeover or force a
  later sale — a real-world rail that also prevents nonsense buyers.
- **Caps:** ≤1 takeover per league per 5-7 seasons; ≤2 meaningful takeovers
  globally per season; per-club cooldown — so the world stays volatile, not chaotic
  (bands = calibration).
- **Consequence (fixing the cosmetic-takeover criticism):** a takeover swaps the
  owner archetype and **hard-resets budget philosophy + expectations**, not just a
  one-off cash bump.

### 5. Bankruptcy / administration arc — core MVP (D2)

A staged descent with a **player-facing fork**:

`stable → stressed → cash_flow_crisis → under_embargo → administration → {rescued |
(reserved: liquidated→phoenix)}`.

This is the shared `InsolvencyCaseStage` enum used by ADR-0079 and ADR-0050. Older
finance labels such as `watch`, `overdraft`, `freeze`, `arrears`, `licence_review`,
`recovery` and `run_end` are UI/read-model aliases only.

- **Administration effects (MVP, directions only):** automatic **points deduction**
  (band ~ −9..−15, calibration; EFL real anchor −12), **transfer embargo**
  (free/low-wage only), **administrator fire-sale** (AI buyers get a valuation
  discount; board accepts fair bids), enforced **wage cap**, reputation hit.
- **Finance semantics (FMX-146):** administration entry, points deduction,
  embargo, wage-cap policy and fire-sale opening are not ledger postings by
  themselves. Wage caps constrain future wage blocks; completed fire sales reuse
  registration disposal/write-off postings; creditor haircut on rescue creates
  the one insolvency-specific write-off posting.
- **Player paths (from §6.4):**
  - **Heroic save** — hit survival targets + a positive net window → "White
    Knight" rescue investor → **"Saved the Club"** legacy credit.
  - **Abandon** — leave before administration → **"Abandoned a sinking ship"** tag
    (light, club-local legacy penalty).
  - **Inside administration** — expectations flip to "Fight for survival" with a
    heavy underdog bonus if the club stays up.
- **Determinism:** the annual insolvency audit + administrator decisions draw from
  `WorldAiMgmtRng` sub-labels (see ADR-0079); the descent thresholds are
  state-driven.

### 6. Infrastructure / archetype-resistance

An owner's trait vector **damps or amplifies** structural-event probabilities (a
stable Foundation suppresses giant-collapse and administration; a reckless
Asset-Stripper amplifies administration risk) — the §4.3 personality-drift-cap
substrate generalised to club ownership. Resistance is a **continuous modifier**,
never a bespoke exception path.

## Open (Wave 2 / reserved)

- **Liquidation → phoenix club** and **creditor-CVA negotiation** — **reserved**
  post-MVP (D2); they touch league registration + save structure. Named hooks only
  in the FSM (`liquidated`, `PhoenixClubFounded`).
- **All numeric magnitudes** — instability factors + threshold, takeover
  caps/cooldown, admin points band, embargo wage-cap %, escalation deltas,
  confidence weights/decay, archetype budget multipliers, owner-resistance
  modifiers — **FMX-52** calibration (banded ranges, evidence gate).
- **Board-meeting dialogue surfaces + ownership news UI** — gaps G4-G6, separate
  late-game-UI issues.
- **National-team dual-role** (FMX-84) and **engagement-flatline + HoF metric
  inputs** (FMX-90) — sibling E5 issues this GDDR unblocks.

## Rationale

The genre evidence is unambiguous: FM's holistic, negotiable board relationship is
the gold standard but its **takeovers are cosmetic** and **bankruptcy is one-shot
punitive**; OOTP's **legible owner archetypes** are the playability template;
EA FC shows the value (and the danger) of exposed priority-tiered objectives. By
keeping FM's 2-phase confidence loop, adopting OOTP archetypes-as-trait-points,
making ownership change consequential and turning administration into a real
heroic-save/abandon arc — all grounded in the real board ladder and EFL
administration rules — FMX-89 delivers the volatility that defends the 50-year
save while staying fair, legible and replay-safe. No magic numbers are baked:
directions now, magnitudes at the calibration capstone.

## Consequences

Positive:

- The two levers that keep a long save alive (board ambition, ownership change)
  become first-class, deterministic and tunable.
- Owners are legible *and* mechanically distinct; takeovers and administration are
  consequential arcs, not flavour text.
- Directions fixed now; tuning deferred to FMX-52, so balance changes are caught at
  the evidence gate, not baked from intuition.

Negative / constraints:

- Realism depends on FMX-52 calibration; un-tuned, the world is inert or chaotic
  (the two documented failure modes).
- The most dramatic ending (liquidation → phoenix) is deferred, so MVP bankruptcy
  drama tops out at the heroic-save/abandon fork.
- Board/ownership effects concentrate in Club Management; its sub-aggregate set
  grows (mitigated by clear FSM boundaries — see the state-machine note).

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]]
  (ownership = Club Management sub-aggregates, RNG/determinism, event contracts,
  caps/cooldowns, MVP scope).

## Related

- Research: [[../60-Research/dynasty-board-ownership-bankruptcy-2026-06-05]]
  (+ raw: [[../60-Research/raw-perplexity/raw-board-confidence-real-world-2026-06-05]],
  [[../60-Research/raw-perplexity/raw-club-takeover-administration-real-world-2026-06-05]],
  [[../60-Research/raw-perplexity/raw-board-ownership-comparable-games-2026-06-05]],
  [[../60-Research/raw-perplexity/raw-deterministic-long-sim-patterns-2026-06-05]]).
- Decisions: [[../10-Architecture/09-Decisions/ADR-0079-dynasty-board-ownership-and-bankruptcy]];
  state machine [[../10-Architecture/state-machines/dynasty-board-and-ownership]].
- Calibration: [[../30-Implementation/economy-calibration-and-soak-test-runbook]] (FMX-52).
- [[README]] — Game Design Log (hub) · context: [[GD-0010-ai-world]] late-game arc,
  [[GD-0011-career-progression]].
