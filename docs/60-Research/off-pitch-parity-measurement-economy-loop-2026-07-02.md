---
title: Off-Pitch Parity Measurement and the Economy Loop (Multi-Season Decision Areas)
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
context: [transfer, club-management-economy, training, scouting, statistics-analytics, stadium-operations]
related:
  - [[raw-perplexity/raw-off-pitch-parity-measurement-economy-loop-2026-07-02]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[dual-mode-precedents-sports-management-2026-07-01]]
  - [[stadium-construction-expansion-models-2026-07-02]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0008-finance-economy]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../30-Implementation/economy-calibration-and-soak-test-runbook]]
---

# Off-Pitch Parity Measurement and the Economy Loop (Multi-Season Decision Areas)

## Question

D3's ratified floor+cap envelope and D4's full sweep apply to **every**
decision-bearing management area, but the measurement machinery the Wave-1
notes ground (Jaffe restricted-play, the xPts policy ladder,
`P_easy_opt`/`P_pro_opt` fixed-budget optimizer anchors, the N/E-anchored
Auto-Coach strength `S`) is defined only for the **match/tactics slice with
identical squads**. Does that methodology honestly transfer to areas whose
value compounds through multi-season squad and balance-sheet evolution —
transfers, finance/stadium timing, training plans, scouting — and if not, what
is the honest v1 measurement per area, what does that mean for the D3
envelope's claim strength (especially in transfers, where
[[management-delegation-and-easy-mode-surfaces-2026-07-02|the delegation
digest]] locates the biggest delegated-quality collapse), and how should the
GD-0043 gameplay/economy runbook split own these cells? This note provides
evidence and options; it decides nothing.

## Summary

The match-slice machinery does **not** transfer wholesale, for three
evidence-backed reasons. First, there is **no documented expert benchmark**
for long-horizon management decisions anywhere in the comparable-games record:
a targeted search found no FM community experiment that cleanly compares
DoF-run vs human-run transfer windows on fees, squad value or wage efficiency
(holiday experiments measure league position/survival only), Hattrick's
economy models are heuristic ROI pipelines rather than optimizers, and OOTP's
AI-economy testing claims could not be sourced to any developer methodology
statement. Second, the academic long-horizon literature itself **does not use
best-response/exploitability anchors** in compounding resource domains — the
published standard is scripted expert heuristics plus outcome distributions
(build-order search validated by time-to-target and win rate vs scripted
openings; long-horizon agent benchmarks graded on outcome/milestone
distributions). Third, feasibility is **area-uneven**: stadium/financing
timing and training-plan choice have compact decision structures where a true
fixed-budget optimizer anchor is realistic (the idle-game purchase-optimization
precedent), while multi-season transfer policy and scouting are adversarial,
information-theoretic and combinatorial — exactly where FM's delegated quality
documentedly collapses. The honest v1 is therefore a **two-class anchor
scheme**: optimum-relative gates where an optimizer is computable, and
reference-relative corridors (scripted `E_ref` heuristics + T3 soak
league-position/squad-value/wage-efficiency distributions + a hard
no-domination invariant) where it is not — with the anchor class declared as a
first-class field in a new `assist.*` slot family so the parity claim's
epistemic status is explicit. Real-football econometrics supplies validated
value metrics: relative wage spending explains ~90% of league-position
variance and transfer-value-based squad valuation (£XI) performs almost
identically, with a documented nonlinearity at both table extremes that the
envelope cells must respect. Production economy practice (EVE's Monthly
Economic Report metric family, Machinations' Monte-Carlo Predict) supports
distribution-based long-horizon health monitoring — which FMX's economy
runbook (`soak:50y`, control charts) already implements, so the per-area gates
ride on existing harness machinery.

## Findings

1. **Finding:** No clean multi-season DoF-vs-human benchmark exists in the FM
   community record. Holiday/delegation experiment formats are established
   ("Bottom at Christmas", "Holiday Journeyman", holiday-based tactic testing)
   but measure **league position/survival only**; a targeted search returned an
   explicit not-found for transfer-window A/B comparisons on fees, squad-value
   delta or wage efficiency, and for net-transfer-value / market-value-delta /
   wage-efficiency as documented community benchmarks.
   **Source:** footballmanageraddict.com Bottom-at-Christmas series;
   fmoverload.home.blog Holiday Journeyman; Evidence Based Football Manager
   (YouTube); Perplexity explicit not-found results (raw note Q1).
   **Confidence:** medium (an absence claim from one thorough search pass;
   consistent with [[assisted-play-parity-auto-coach-2026-07-01]] Finding 2's
   "no SI-published benchmark").

2. **Finding:** Hattrick — the genre's most economy-centric title — models
   long-horizon economy quality through **heuristic ROI pipelines**
   (skill-trading near salary-pop thresholds, train-and-sell cycles with
   community tools like Transfer Compare and Player Training Estimation, e.g.
   a "~3M in 3 months" pipeline claim), not through formal optimizers; no
   published bot/scripted-agent economy studies were found.
   **Source:** Hattrick Skill Trade Guide and money-making guide videos;
   community training-strategies guide; hattrick.org press article (raw Q2;
   Perplexity marked the no-bot-studies result as its own inference).
   **Confidence:** medium.

3. **Finding:** Hattrick's transfer market **is** rigorously studied
   academically — and the result is that human transfer behaviour is measurably
   suboptimal even under **zero information asymmetry**: 6,258-auction studies
   find sellers "both very sophisticated and suboptimal" (irrational reserve
   clustering, quantified expected-revenue loss, sunk-cost fallacy).
   Implication for FMX: a "human expert" anchor in transfer domains is noisy
   even in the best case; **scripted reference policies are more reproducible
   anchors than recorded human play**.
   **Source:** Englmaier, Schmöller & Stowasser, SFB/TR 15 DP 326 / VfS 2016
   (https://sfbtr15.de/uploads/media/326.pdf); Trautmann & Traxler, *Journal of
   Economic Psychology* 31(2), 2010; Schmöller dissertation (LMU).
   **Confidence:** high.

4. **Finding:** Real-football econometrics validates the packet's candidate
   value metrics: **relative wage spending explains ~90% of league-position
   variance** over a decade (top two English divisions), and a transfer-fee
   squad valuation (£XI, Tomkins et al.) correlates just under 90% with wages
   and explains position "almost equally as well". Crucially, **both measures
   overstate the resources required for top positions and understate those
   required to avoid relegation** — so wage-efficiency/squad-value gates must
   be banded per squad-strength/table-region cell, not applied as one linear
   ratio.
   **Source:** Szymanski, OpenLearn (Open University) business-of-football
   article; Szymanski, London Evening Standard 2010-12-17 (on Kuper &
   Szymanski, *Why England Lose*, and Tomkins/Riley/Fulcher, *Pay as You
   Play*); Hall, Szymanski & Zimbalist, *J. Sports Economics* 3(2), 2002.
   **Confidence:** high.

5. **Finding:** The academic long-horizon/macro literature evaluates decision
   quality with **scripted baselines plus outcome distributions, never
   exploitability**: build-order optimization is judged by time-to-target-state
   and resource efficiency validated by win rate vs scripted openings and
   built-in AI (Churchill & Buro AIIDE 2011; Justesen et al. GECCO 2017);
   AlphaStar published only match-outcome/ladder evaluation with no separate
   macro-quality index; long-horizon agent benchmarks grade mean task success
   and milestone distributions. Dense **proxy value curves** (supply
   difference, net-worth/resource-rate curves) are the standard surrogate for
   compounding value.
   **Source:** Churchill & Buro, *Build Order Optimization in StarCraft*,
   AIIDE 2011; Justesen et al., GECCO 2017
   (https://sebastianrisi.com/wp-content/uploads/justesen_gecco17.pdf);
   yobibyte.github.io SC2 research survey (COMA/QMIX supply-difference reward);
   arize.com long-horizon agent benchmark field guide.
   **Confidence:** high for the named papers; medium for the generalization
   (no formal infeasibility theorem surfaced — it is observed practice).

6. **Finding:** Production long-horizon economy health monitoring is
   **distribution- and index-based**: EVE Online's Monthly Economic Report
   (published by a named in-house economic council) tracks ISK faucets/sinks by
   category, **velocity of ISK**, and price indices (Mineral/Ship/Module) with
   public raw data — i.e. the industry's most mature live game economy is
   governed by exactly the metric family FMX's
   [[../30-Implementation/economy-calibration-and-soak-test-runbook|economy
   runbook]] already encodes (KPI bands, control charts, concentration
   trends), not by optimizer-relative measures.
   **Source:** eveonline.com Monthly Economic Reports (e.g. May 2026, February
   2026 editions).
   **Confidence:** high.

7. **Finding:** Monte-Carlo simulation of economy models **before
   implementation** is documented commercial practice: Machinations' "Predict"
   runs an economy diagram many times and returns outcome
   distributions/histograms for balance decisions. However, a targeted search
   could **not** verify pre-launch scripted player-archetype agents
   (spender/hoarder/optimizer) as documented industry practice, nor
   economy-balance regression gates in production pipelines — FMX's planned
   policy-ladder-on-soak-harness approach would be *ahead of* documented public
   practice, and should not be justified as "industry standard".
   **Source:** machinations.io docs ("The difference between Play and
   Predict"; level-progression tutorial 6; charts); Perplexity explicit
   unverifiable-results (raw Q3).
   **Confidence:** high for Machinations; medium for the absence claims.

8. **Finding:** Where the decision structure is compact, **analytic or
   searchable optimality is genuinely attainable**: idle-game math (Pecorella,
   GDC 2016) derives closed-form growth curves and **purchase-optimization
   models** (what to buy when, prestige timing) that identify optimal or
   near-optimal policies directly. Stadium expansion / financing timing in FMX
   has the same shape — a small discrete set of projects x timing x financing
   instruments over a deterministic-ish demand model — so a fixed-budget
   optimizer anchor **is feasible** for this area even though it is
   multi-season.
   **Source:** Pecorella, *Quest for Progress: The Math and Design of Idle
   Games*, GDC/GDC Europe 2016 (gdcvault.com; slides on media.gdcvault.com).
   **Confidence:** high for the precedent; medium for the transfer to FMX
   stadium timing (this note's inference; demand-model fidelity is the risk).

9. **Finding:** Training is the **cheapest off-pitch area to keep near-expert**
   and the least floor-risky: FM community evidence shows delegating training
   to a competent assistant costs little, while the loud delegated-quality
   failures concentrate in value-sensitive/adaptive **transfer** decisions
   ("never delegate selling") — i.e. the per-area risk ordering for D3's floor
   is transfers >> scouting > finance/stadium > training.
   **Source:** [[assisted-play-parity-auto-coach-2026-07-01]] Finding 2 and
   [[management-delegation-and-easy-mode-surfaces-2026-07-02]] Finding 2
   (thehighertempopress.com; r/footballmanagergames; FM24 training-delegation
   experiment), re-grounded via raw Q1.
   **Confidence:** medium (community-reported magnitudes).

10. **Finding:** Multi-season compounding changes *what* a parity gate must
    hold on: small per-window edges compound through squad/balance-sheet state,
    so per-decision metrics (fee vs market value) are only diagnostics; the
    gate-bearing observable is the **T3 outcome distribution** (league-position
    distribution, squad-value and wage-efficiency trajectories over a
    soak-scale horizon) — the same shape the tier-parity note already requires
    at season scale for tactics and the economy runbook already computes at
    50y scale. This mirrors both the sports-econometrics practice (decade-scale
    aggregates, Finding 4) and EVE's trend-based governance (Finding 6).
    **Source:** synthesis over Findings 4-6 and
    [[tier-parity-measurement-calibration-2026-07-01]] (season-level T3
    requirement); an inference, not an external citation.
    **Confidence:** medium.

## Per-area measurement-feasibility matrix

Policy-ladder legend per area: `P_random` (random legal picks), `P_naive`
(defaults, minimal interaction — the easy-naive anchor), `P_easy_opt` /
`P_pro_opt` (best policy on the easy/pro surface under a fixed budget),
`E_ref` (versioned scripted expert-reference heuristic). All value metrics are
computed on the existing harnesses: T2 windows where meaningful, T3
soak-scale outcome distributions as the gate.

| Area | Decision structure | Gate-bearing value metric (v1) | Diagnostic metrics | Optimizer anchor (`P_*_opt`) feasible v1? | Honest v1 anchor | Claim strength for D3 wording | Confidence |
|---|---|---|---|---|---|---|---|
| **Training** (training) | Compact: plan/block choice per horizon; weak adversarial coupling | Development value delta (squad-quality growth) vs `E_ref` at T3; league-position distribution unchanged-or-better | Per-player growth curves, injury/load side-effects | **Yes** — small policy space; season-scale search is affordable | Fixed-budget optimizer + `E_ref` smoke | **Optimum-relative** (match-style `R` ratio transfers) | High |
| **Stadium & financing timing** (stadium-operations, club-management-economy) | Compact discrete: project x timing x financing instrument over demand model | Cumulative net cash / balance-sheet position at T3 horizon vs optimizer; insolvency-risk tail | Capacity-utilisation, debt-service coverage, payback period | **Yes** — enumerable combinations (idle-game purchase-optimization precedent, Finding 8) | Fixed-budget optimizer (exhaustive/beam search) + `E_ref` | **Optimum-relative**, conditional on demand-model fidelity | Medium-high |
| **Scouting** (scouting) | Information-gathering; value is uncertainty reduction realised only through later transfers | Downstream: realised value-vs-cost of signings sourced via scouting, at T3; coverage/discovery quality bands | Report accuracy vs true attributes; shortlist hit-rate | **No** — value-of-information over a stochastic market; optimizer is a research project | `E_ref` scripted policies + T3 outcome distributions | **Reference-relative corridor** + no-domination invariant | Medium |
| **Transfers/contracts** (transfer) | Adversarial (AI clubs adapt), value-sensitive, combinatorial, compounds hardest | League-position distribution + squad-value trajectory + wage-efficiency (points per relative wage, Finding 4) at T3 | Net-transfer-value vs in-game market value per window; fee-vs-value residuals; wage-bill drift | **No** at v1 — multi-season best response intractable (Finding 5); precisely FM's delegated-collapse area (Finding 9) | Ladder of `E_ref` scripted policies (buy-side, sell-side, contract-renewal) + T3 distributions + hard floors | **Reference-relative corridor only**; optimum-relative claims would be dishonest | Medium |

Cross-cutting rules the matrix implies:

- **Banding per table region:** wage-efficiency and squad-value gates must be
  banded by squad-strength/table-region cell because both metrics are
  documentedly nonlinear at the top and bottom of the table (Finding 4).
- **Identical-squad discipline breaks:** unlike the match slice, off-pitch
  parity runs *create* squad divergence — cells must therefore fix the starting
  state (same club, same seed cohort) and gate on **distribution differences
  between policies**, not on absolute levels.
- **`E_ref` decay:** scripted references go stale exactly as the tier-parity
  note warns for optimizer anchors; every `E_ref` must be a versioned artifact
  re-validated on economy/market parameter changes.

## Inputs For Decisions

### OPEN fork: delegation model shape (strength-spec cell of this packet)

The digest's `assist.delegation.<area>` slot-family recommendation asserted
"shared N/E-anchor methodology"; this packet's evidence **qualifies** that
claim: the *anchor grammar* (normalized `S` between N and E) transfers, but
the **E anchor's epistemic class does not** — for transfers and scouting, E
can only be a scripted reference heuristic at v1, not an optimizer-derived
approximate best response (Findings 1-3, 5). Consequences per option:

- If delegation Option A (standing autopilot) is chosen, its floor invariant
  ("worst staff band stays above the easy floor") is **testable at v1 in all
  four areas** — floors need only `P_random`/`P_naive` and distributions, not
  optimizers. The corridor's *upper* anchor is weaker in transfers/scouting.
- The digest's D3 stress note (a neglected easy save must not become dominated)
  is measurable v1 via the T3 no-domination check: `P_naive`-with-delegation
  must not sit below the AI-field squad-expected band in league-position
  distribution. *Recommendation (recommendation, not a decision):* make this
  no-domination distribution check the **hard invariant** of every
  `assist.delegation.<area>` slot, independent of anchor class.

### OPEN fork: stadium expansion model

Input, not a decision: stadium/financing timing is the off-pitch area where a
true optimizer anchor is cheapest (Finding 8) — **provided** the chosen
expansion model keeps the decision set enumerable. A module/project-card model
is directly enumerable; a free tile-grid model is only measurable through its
canonical "next best upgrades" query (which
[[management-delegation-and-easy-mode-surfaces-2026-07-02|the delegation
digest]] already requires for the easy surface). *Recommendation
(recommendation, not a decision):* whichever model Nico picks, require that
the pro surface expose a **finite canonical project/timing/financing decision
enumeration** as a contract property, so the stadium parity cell keeps its
optimum-relative claim strength; a model that breaks enumerability silently
downgrades the D3 claim in this area.

### OPEN fork: competitive labeling

Input: a competitive label can only honestly assert what the measurement can
back. Per the matrix, the label's parity claim decomposes into (a)
optimum-relative statements for match/tactics (Wave-1), training and stadium
timing; (b) reference-relative + no-domination statements for transfers and
scouting. A single undifferentiated "easy reaches X% of pro-optimal
everywhere" label would overclaim in exactly the area (transfers) where the
easy floor is most at risk (Finding 9). *Recommendation (recommendation, not a
decision):* label copy should promise the **no-domination invariant**
globally ("easy is never a losing strategy") and reserve percent-of-optimal
language for the optimizer-anchored areas.

### OPEN fork: MP treatment

Input only: in MP, off-pitch divergence compounds across seasons between human
clubs, so the T3 no-domination check (not per-window fee comparisons) is the
right fairness observable; deterministic delegated execution (digest
recommendation) keeps it computable. No new evidence beyond
[[asymmetric-interface-fairness-multiplayer-2026-07-02]] scope.

### NEW-offpitch-anchor-class (newly discovered fork)

What counts as the upper anchor E per off-pitch area:

- **Option A — optimizer everywhere.** Pros: uniform claim strength with the
  match slice. Cons: infeasible v1 for transfers/scouting (Finding 5); an
  under-budgeted "optimizer" would masquerade as an optimum and **overstate
  parity** — worse than an honest reference.
- **Option B — scripted `E_ref` everywhere.** Pros: uniform, cheap, honest.
  Cons: forfeits attainable optimum-relative claims in training and stadium
  timing; references decay silently (same staleness risk Wave-1 flags).
- **Option C — declared per-area anchor class.** Each `assist.*` slot carries
  an `anchorClass: optimizer | scriptedReference` field; optimizer where the
  decision structure is compact (training, stadium/financing timing),
  scripted-reference + distribution gates where it is not (transfers,
  scouting), with planned upgrades as future scope. Pros: maximal honesty per
  cell; matches both the academic practice (Finding 5) and the
  chess-precedent rule that a strength number is only meaningful relative to a
  named reference. Cons: two claim grammars to communicate.

*Recommendation (recommendation, not a decision):* **Option C**, with the
anchor class surfaced in the slot contract and in any player-facing parity
copy derived from it.

### NEW-d3-claim-strength-per-area (newly discovered fork)

D3's placeholder numbers (floor-normalized `R` ~0.85-0.95, head-to-head
52-57%) are defined against `P_pro_opt` — an object that does not exist v1 for
transfers/scouting. This does **not** reopen D3 (the envelope, the floor, and
"EASY never dominated" stand); it is evidence about the *wording* of the
Stage-2 per-area gates:

- **Option A — reuse the match-slice envelope wording in every area.**
  Dishonest where no optimizer exists; the transfer-area "R" would silently
  measure distance to a heuristic, not to pro-optimal.
- **Option B — two-class wording.** Optimum-relative envelope (match,
  training, stadium timing); reference-relative corridor + hard no-domination
  invariant (transfers, scouting), stated as such in the GDDR with explicit
  per-area confidence levels. The D3 head-to-head band applies unchanged only
  where head-to-head is well-defined (match); off-pitch areas gate on T3
  outcome-distribution deltas instead.
- **Option C — defer off-pitch gates.** Rejected by the evidence: transfers
  are the documented collapse area (Finding 9); an ungated transfer surface is
  exactly the FM self-handicap D3 exists to prevent.

*Recommendation (recommendation, not a decision):* **Option B** — and where a
per-area envelope number must be stated before an optimizer exists, mark it
`confidence: reference-relative` rather than borrowing the match-slice
placeholder numbers.

### Slot-family extension proposal (input for the Stage-2 GDDR; touching GD-0043 is a decision)

`tactics.tierParity` stays match-scoped as proposed by
[[tier-parity-measurement-calibration-2026-07-01]]. The off-pitch cells become
a slot family with shared grammar and per-area packs (per the digest's
NEW-delegation-strength-spec recommendation), extended by this packet's
anchor-class field:

```yaml
calibrationSlotFamily:
  id: assist.delegation.<area>          # training | scouting | transfers | financeStadium
  owner: <owning domain context> (metrics surface via statistics-analytics)
  sourceRecord: <future dual-mode GDDR>
  parameterPackVersion: <area>PolicyLadderVersion
  anchorClass: optimizer                 # training, financeStadium
             | scriptedReference         # transfers, scouting (v1)
  primaryMetrics:
    - t3OutcomeDistributions: [leaguePositionDistribution,
        squadValueTrajectory, wageEfficiencyBand]   # gate-bearing (Finding 10)
    - normalizedStrengthS per decision class vs [N, E]  # E per anchorClass
    - noDominationInvariant: P_naive-with-delegation >= AI-field
        squad-expected band                # hard invariant, all areas
  diagnosticMetrics:                       # never gate-bearing alone
    - transfers: [netTransferValueVsMarket, feeVsValueResiduals, wageBillDrift]
    - scouting: [reportAccuracy, shortlistHitRate, coverage]
    - training: [growthCurves, loadInjurySideEffects]
    - financeStadium: [capacityUtilisation, debtServiceCoverage, paybackPeriod]
  harnessTier: T2 (window-scale smoke) + T3 (gate; soak-scale distributions)
  tolerancePolicy: envelope (banded per squad-strength/table-region cell,
    Finding 4 nonlinearity) + hard-invariant (no-domination)
  baselineAuthority: Nico (parity envelopes are product promises)
  evidencePath: this note + raw capture + future run reports
```

### GD-0043 economy-runbook ownership of these cells

GD-0043's scope split assigns economy calibration to the
[[../30-Implementation/economy-calibration-and-soak-test-runbook|economy
runbook]] and everything else to the gameplay runbook. Proposed cell
ownership (input, not a decision):

| Cell | Harness that runs it | Runbook that owns bands | Rationale |
|---|---|---|---|
| `assist.delegation.transfers` | economy `soak:50y` machinery (T3) + gameplay T2 for window smoke | **economy runbook** (bands), slot owner = transfer context | squad-value/wage metrics are economy KPIs the runbook already charts; `transfer.escalation` (gameplay) stays separate — pressure mechanics, not parity |
| `assist.delegation.financeStadium` | economy `soak:50y` | **economy runbook** | balance-sheet/insolvency metrics are its §11 flatline instrumentation |
| `assist.delegation.training` | gameplay T2/T3 | **gameplay runbook** | development value is a gameplay magnitude (GD-0005 lineage) |
| `assist.delegation.scouting` | gameplay T2/T3, joined to economy outputs for downstream value | **gameplay runbook**, with an economy join view | informational value realises through transfer outcomes |

This resolves the tier-parity note's deferred "per-area parity sub-gates ...
the economy runbook would own the finance cells" future-scope item with a
concrete split. *Recommendation, not a decision.*

## Future-scope notes (classified future-scope)

- **Optimizer upgrade path for transfers/scouting:** learned/search-based
  transfer-policy agents (the RL upgrade Wave-1 lists for `P_pro_opt`) would
  raise the transfer cell from reference-relative to optimum-relative; treat
  as post-launch research, and re-word the label only after the upgrade lands.
- **`E_ref` governance cadence:** scripted references for market-facing areas
  decay when AI-market tuning changes; a scheduled re-validation cadence
  (mirroring the tier-parity meta-drift item) is needed once the economy is
  live-tuned.
- **T4 telemetry:** consented mode-split trajectories (squad value, wage
  efficiency, league position by mode over real multi-season saves) are the
  eventual validation of the T3 proxies — same consent gate as Wave-1's item.
- **EVE-style public economy report:** a periodic in-game/world economy report
  (faucets/sinks, market indices) doubles as a player feature and as the T4
  instrumentation surface; ties into GD-0008's transparency posture.
- **Could not verify:** any FM DoF-vs-human A/B experiment with economic
  metrics; OOTP developer AI-economy test methodology; pre-launch
  player-archetype economy-agent practice; Lux-AI/OpenTTD evaluation details
  beyond competition win-rate framing. None are load-bearing — the
  recommendations above lean only on the sourced findings.
