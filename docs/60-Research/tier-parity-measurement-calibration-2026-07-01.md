---
title: Tier Parity Measurement and Calibration (Easy vs Pro)
status: draft
tags: [research, dual-mode]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
linear:
sourceType: external
context: [match, tactics, statistics-analytics]
related:
  - [[raw-perplexity/raw-tier-parity-measurement-calibration-2026-07-01]]
  - [[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
---

# Tier Parity Measurement and Calibration (Easy vs Pro)

## Question

Nico's dual-mode requirement says: an easy-mode player (coarse Anstoss-style
controls) must stay competitively viable against pro-mode players (FM-style
per-player control) on one simulation core, with at most a bounded pro edge.
How can "the easy-mode decision surface reaches X% of pro-optimal output" be
**defined**, **measured**, and **kept true over balance patches** — concretely,
what new calibration slots, scenario packs, metrics and acceptance envelopes
would tier parity need on top of the existing
[[../50-Game-Design/GD-0042-match-engine-core-model-and-calibration|GD-0042]]
calibration harness and
[[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate|GD-0043]]
acceptance gates? This note feeds Nico's open decisions D1-D4 (especially D3);
it decides nothing.

## Summary

The research question has a well-established formal shape: easy mode is a
**restriction of the manager's decision space**, and Jaffe's restricted-play
framework (AIIDE 2012) defines balance of exactly this situation as the
win-rate/value delta between a restricted agent and an unrestricted agent,
estimated by repeated simulation. "Pro-optimal output" gets a rigorous
definition from the exploitability/best-response literature: the value of the
best policy findable on the pro surface, in practice an **approximate best
response found by a fixed, versioned search budget**, because true optima are
intractable in rich games. The measurable metric FMX already has the parts for
is an **expected-points (xPts) delta**: Opta's public xPts model (simulate each
match from shot xG 10,000 times, take mean points) is directly reproducible on
GD-0042's Monte-Carlo harness — run a ladder of scripted manager policies
(random / easy-naive / easy-optimized / pro-reference / pro-optimized) across
squad-strength scenario cells and compare per-match xPts and season-level
league-position distributions. Industry precedent shows both that non-50/50
**target envelopes are a first-class calibration objective** (Hernández et
al.'s metagame autobalancing optimizes toward a designer-specified target
win-rate graph) and that asymmetric-input fairness in production is governed by
**explicit versioned parameters plus split telemetry re-tuned every patch**
(Apex Legends aim-assist constants 0.6/0.4, Season-22 published percentage
re-tune). Keeping parity true over patches therefore means: a dedicated
calibration slot with floor-and-cap envelopes, mandatory re-runs whenever
`match.core` or tactics parameters change, and re-derivation of the
"pro-optimal" anchor policy each time — otherwise the measured optimum silently
goes stale. Each D3 option maps to a concrete, testable envelope; definitions
below.

## Findings

1. **Restricted play is the exact formal template for easy-vs-pro parity.**
   Jaffe et al. define competitive-balance questions as "the fairness of games
   with restricted players": measure the win rate of an agent restricted from
   certain actions against a standard agent that may exploit the restriction.
   Easy mode *is* such a restriction (coarse tactic + aggressiveness instead of
   per-player roles/instructions), so "easy reaches X% of pro" is measurable
   without human players, by simulation.
   Source: Jaffe et al., *Evaluating Competitive Game Balance with Restricted
   Play*, AIIDE 2012 (https://ojs.aaai.org/index.php/AIIDE/article/view/12513);
   Jaffe PhD thesis, UW 2013 (http://hdl.handle.net/1773/22797).
   Confidence: high.

2. **"Pro-optimal output" should be defined as an approximate best response
   under a fixed search budget, not a mythical true optimum.** Exploitability /
   NashConv measures distance-from-optimal as the value gained by deviating to
   a best response; in large games the true best response is intractable, so
   the field uses learned/search-based approximate best responses as the
   optimal anchor. Consequence for FMX: the "pro-optimal" reference must be a
   **versioned optimizer artifact** (fixed algorithm + compute budget + seed
   protocol), so X% is comparable across patches.
   Source: Lanctot et al. 2017 (https://arxiv.org/pdf/1711.00832.pdf); Lockhart
   et al., IJCAI 2019 (https://www.ijcai.org/proceedings/2019/0066.pdf);
   Timbers et al., *Approximate Exploitability*, IJCAI 2022
   (https://www.ijcai.org/proceedings/2022/0484.pdf); OpenSpiel
   `exploitability.py`. Confidence: high.

3. **Simulation-based balancing with heuristic agents is a working, published
   method — and it gets harder as archetype disparity grows.** Rupp et al.
   estimate balance by repeated simulation with scripted agents, using a
   game-independent balance metric on [0,1] (0.5 = equal win rates), and show
   that balancing **asymmetric archetypes** needs more effort and achieves
   lower accuracy as the disparity between archetypes increases; a follow-up
   human study confirmed agent-simulated balance improves human-perceived
   balance in most cases.
   Source: Rupp, Eberhardinger, Eckert, IEEE CoG 2023/journal
   (https://arxiv.org/html/2503.18748); Rupp & Eckert, *Level the Level*, 2025
   (https://doi.org/10.1145/3723498.3723747); Rupp, AIIDE 2025 DC
   (https://doi.org/10.1609/aiide.v21i1.36856). Confidence: high.

4. **Non-equal balance targets (a bounded edge) are a first-class calibration
   objective, not a hack.** Hernández et al.'s metagame autobalancing lets the
   designer specify a **target win-rate graph** between strategies — explicitly
   "beyond a simple requirement of equal win chances" (e.g. 70/30 cycles) — and
   optimizes game parameters to minimize distance to that target. A "pro beats
   easy by at most 5-15%" target is the same machinery with a two-sided band.
   Source: Hernández et al., *Metagame Autobalancing for Competitive Multiplayer
   Games*, IEEE CoG 2020 (https://doi.org/10.1109/cog47356.2020.9231762).
   Confidence: high.

5. **xPts gives the metric shape FMX needs, and GD-0042 can already compute
   it.** Opta's expected-points model: simulate each match's goals from the xG
   of every shot, 10,000 simulations per match, expected points = points
   weighted by simulated W/D/L proportions. FMX's T2 Monte-Carlo harness over
   seeds is the same computation one level up (whole-engine seeds instead of
   shot resampling), so "expected-points delta between preset-play and
   optimal-play" is directly implementable on existing GD-0042 machinery.
   Source: Opta Analyst model descriptions
   (https://theanalyst.com/articles/championship-table-expected-points;
   https://theanalyst.com/articles/opta-premier-league-expected-points-table-arsenal-chelsea).
   Confidence: high.

6. **Skill-range normalization: anchor "X% of optimal" against a random-policy
   floor, not against zero.** Politowski et al. assess "skill vs chance" by
   comparing a random agent's outcomes to trained agents' outcomes — the spread
   between them measures how much decisions matter. Without this floor, a
   match engine where squad strength dominates decisions would report high
   parity trivially; with it, X% measures share of *achievable decision value*.
   Source: Politowski et al., *Assessing Video Game Balance using Autonomous
   Agents*, 2023 (https://doi.org/10.48550/arxiv.2304.08699). Confidence:
   high (method); medium (transfer to manager-sim context is this note's
   inference).

7. **Production asymmetric-input fairness = explicit versioned parameter +
   split telemetry + per-patch re-tuning + a public floor commitment.** Apex
   Legends' controller-vs-mouse bridge is a numeric aim-assist constant (0.6
   console / 0.4 PC controller, confirmed by Respawn when a patch accidentally
   equalized them), re-tuned in Season 22 with published per-context
   reductions (18%/22%/25%) and an explicit designer rationale ("aim assist is
   just too strong in these PC lobbies") plus a commitment that the bridge
   stays because it is an accessibility feature. Input-based matchmaking
   (Halo/CoD crossplay pools) is the complementary lever when tuning cannot
   close the gap.
   Source: https://dotesports.com/apex-legends/news/respawn-rolls-back-aim-assist-values-after-accidental-escape-change
   (citing official Respawn statement);
   https://gamerant.com/apex-legends-aim-assist-nerf-season-22/;
   https://esports.gg/news/apex-legends/apex-legends-aim-assist-getting-nerfed-on-pc-in-season-22/.
   Confidence: high for Apex facts; medium for matchmaking internals.

8. **Handicap systems equalize expected outcomes but change legitimacy
   perception — FMX's parity should come from surface design, not hidden
   boosts.** Golf's World Handicap System and go's handicap stones normalize
   across ability toward net parity / roughly equal win chances; they work
   because they are *declared*. A hidden easy-mode buff would mirror the
   "buying results without playing the depth" problem that
   [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]]
   bans for money; the fairness promise must hold in both directions (easy mode
   neither crippled nor secretly boosted).
   Source: USGA/R&A World Handicap System documentation
   (https://www.usga.org/handicapping.html); go/Elo handicap literature (not
   individually fetched). Confidence: medium (system facts well-established;
   design inference is this note's).

9. **Patch-to-patch balance regression practice: versioned baseline
   distributions, envelope bands, delta + effect size — matching GD-0043's
   existing acceptance rule.** Across industry sources, balance regression is
   dashboard-style: recompute win-rate/outcome distributions per patch, compare
   to the last accepted baseline via deltas with confidence intervals and
   distribution distances (KS/EMD), flag out-of-envelope items; commonly cited
   fairness bands like "45-55% win rate per archetype" exist but are industry
   folklore rather than published policy. Fully automated build-gating
   pipelines are almost never documented publicly in engineering detail.
   Source: Perplexity synthesis across King (Gudmundsson et al., IEEE CIG
   2018), Ubisoft La Forge, card-game balance discussion; see raw note.
   Confidence: medium (convergent but partly qualitative/undocumented).

10. **Human-calibrated agents matter for what players actually experience.**
    King's playtesting agents were deliberately trained to be *human-like*, not
    optimal, because optimal agents mispredict experienced difficulty. For
    parity this means the gate must include a *naive* easy policy (defaults,
    minimal effort) in addition to the *optimized* easy policy: viability for
    real easy-mode players is about the naive-to-optimized band, not only the
    theoretical optimum of the easy surface.
    Source: Gudmundsson et al., *Human-Like Playtesting with Deep Learning*,
    IEEE CIG 2018 (via raw note; paper well-known, not re-fetched).
    Confidence: medium-high.

## Proposed measurement machinery (evidence-derived, for the future GDDR)

Definitions the D3 options below share. All of it runs on GD-0042's harness
(T2 seed sweeps, scenario packs) under GD-0043's slot contract; nothing needs a
new kind of infrastructure, only new policies, scenario cells and envelopes.

**Policy ladder** (scripted manager agents, versioned like golden fixtures):

| Policy | Meaning |
|---|---|
| `P_random` | random legal choices on either surface — the chance floor |
| `P_easy_naive` | easy surface, sensible defaults, minimal interaction (the "stove" player) |
| `P_easy_opt` | best policy findable **within the easy decision surface** by a fixed-budget optimizer (search over coarse tactic x aggressiveness x simple-surface choices) |
| `P_pro_ref` | strong scripted heuristic on the pro surface (smoke-test reference) |
| `P_pro_opt` | approximate best response on the **pro surface** under the same fixed optimizer budget — the "pro-optimal" anchor (Finding 2) |

**Core metrics** per scenario cell (squad-strength profile s x opponent o x
context):

- `xPts(P, s, o)`: mean points per match over an N-seed sweep (Opta-style,
  Finding 5), plus the W/D/L distribution itself.
- **Parity ratio** `R(s, o) = (xPts(P_easy_opt) - xPts(P_random)) /
  (xPts(P_pro_opt) - xPts(P_random))` — floor-normalized so "X% of pro-optimal
  output" measures share of achievable decision value (Finding 6).
- **Head-to-head edge** `E(s) = xPts(P_pro_opt vs P_easy_opt) - 1.5 baseline`
  (or equivalently the win-probability of pro-opt vs easy-opt) — the direct
  restricted-vs-unrestricted measurement (Finding 1).
- **Naive-viability band** `V(s) = xPts(P_easy_naive) / xPts(P_easy_opt)` — how
  much of easy-mode value the low-effort player gets (Finding 10).
- Season-level (T3): league-position distribution per policy per
  squad-strength profile — parity must hold at season scale, not only
  per-match mean, because small per-match edges compound over 34 matchdays.
- Tail guard: envelopes checked on the mean **and** on tail cells (knockout
  scenarios, top-decile seeds), because optimizer edges concentrate in edge
  cases.

**Scenario-pack extension** (adds an opponent-policy axis to GD-0042's minimum
pack): squad-strength profiles {clear favourite, even, clear underdog} x
opponent policies {AI-field mix, `P_easy_opt`, `P_pro_opt`} x the existing
style cells (high press vs low block, direct vs possession, congestion).

**Calibration slot proposal** (GD-0043 contract):

```yaml
calibrationSlot:
  id: tactics.tierParity
  owner: tactics (with match; metrics surface via statistics-analytics)
  sourceRecord: <future dual-mode GDDR>
  parameterPackVersion: tierParityPolicyLadderVersion
  primaryMetrics: [parityRatioR, headToHeadEdgeE, naiveViabilityV,
                   xPtsDeltaPerCell, seasonPositionDistribution]
  harnessTier: T2 (+ T3 season soak per release)
  tolerancePolicy: envelope (two-sided floor+cap per D3 choice)
  baselineAuthority: Nico (parity envelopes are product promises, not tuning)
  evidencePath: this note + raw capture + future run reports
```

**Patch-stability rules** (the "kept true over balance patches" part):

1. Any change to `match.core`, `match.liveControl` or tactics parameter packs
   triggers a `tactics.tierParity` T2 re-run — parity is a cross-cutting
   invariant of those slots, like background-fast compatibility already is.
2. On engine/tactics changes, `P_easy_opt` and `P_pro_opt` are **re-derived**
   with the same versioned optimizer budget before gating; comparing against
   stale optima silently overstates parity (Finding 2). Scripted `P_pro_ref` /
   `P_easy_naive` run unchanged as smoke references.
3. Envelope breach = build fails the gate; re-baselining a parity envelope is a
   Nico-level product decision under GD-0043's rebaseline rule, never a
   developer convenience.
4. Post-launch (T4): mode-split outcome telemetry (league results by mode, like
   input-split telemetry in shooters, Finding 7) validates the simulated gate
   against real players, consent-gated.

## Inputs For Decisions

### D3 - parity target: a measurable definition per option

**Option A — near-parity (~90-95% of expert optimum everywhere).**
Definition: `R(s, o) >= 0.90` in **every** scenario cell, and head-to-head
win-probability of `P_easy_opt` vs `P_pro_opt` within a tight band (e.g.
46-50% over the sweep); naive-viability `V(s)` additionally gated (e.g.
>= 0.85) so the real low-effort player, not just the easy optimum, stays
viable.
Pros: strongest fairness story for shared leagues; simplest player promise;
symmetric with GD-0041's "power is earned through play" ethos. Cons: Rupp's
results say holding equality across *disparate* archetypes is the hardest,
least accurate balancing regime (Finding 3); it also compresses the payoff of
the pro surface toward zero — if pro depth changes almost nothing, FM-style
players lose their reason to engage (the same trap GD-0004 flags for shallow
competitors, mirrored).
Evidence: Findings 1, 3, 6.

**Option B — bounded pro edge (~5-15%).**
Definition: two-sided envelope — cap **and** floor:
`0.85 <= R(s, o) <= 0.95` per cell; head-to-head `P_pro_opt` vs `P_easy_opt`
win-probability within e.g. 52-57% (per-match xPts edge roughly +0.06 to
+0.20); season-level: pro edge <= ~4-8 league points over 34 matchdays for
equal squads, so an easy-mode club with a clearly better squad still finishes
above a pro-mode club with a weaker one ("punch above weight, not out of
class"). The cap is the fairness gate; the floor keeps pro depth meaningful.
Pros: exactly the machinery Hernández et al. show works (designer-specified
non-equal target graph, Finding 4); preserves both audiences' payoff; the
bounded edge is measurable, regression-testable and communicable ("pro
knowledge is worth at most one squad-quality tier"). Cons: two-sided envelopes
need more simulation budget (both bounds can fail); the exact band is a
product-feel call needing T4 validation later.
Evidence: Findings 1, 2, 4, 5.

**Option C — parity vs AI only.**
Definition: no gate on easy-vs-pro head-to-head; instead
`xPts(P_easy_naive/P_easy_opt vs AI-field)` must sit within the
squad-strength-expected band (league-position distribution not worse than
squad rating predicts, per profile), i.e. easy mode is guaranteed viable in
single-player career context only.
Pros: cheapest sweep (one opponent axis); no tension with pro-surface depth.
Cons: does **not** satisfy the stated hard requirement ("easy-mode player must
remain competitively viable against others"); the moment shared
leagues/rankings exist (ADR-0108 fairness surface), an unmeasured easy-vs-pro
gap becomes a trust problem of the same kind GD-0041 forbids for money.
Evidence: Findings 8, 9; GD-0041.

**Recommendation (recommendation, not a decision):** Option B, implemented as
the floor+cap envelope on the floor-normalized parity ratio `R` plus the
head-to-head band, with Option C's AI-field check included as a cheap
always-on subset. Near-parity (A) can be revisited later by narrowing the
envelope — envelopes can tighten without redesign, but a system tuned for exact
parity cannot cheaply re-grow a meaningful pro edge.

### D1 - two modes vs three tiers vs two-modes+per-area-override

Measurement-cost evidence only: every mode/tier and every per-area override
combination is another **policy family** in the parity sweep, and Rupp's
asymmetric-archetype results show balancing accuracy drops as archetype
disparity and count grow (Finding 3). Two modes = 1 parity pair; three tiers =
3 pairs; free per-area override = combinatorial (only sentinel combinations
could realistically be gated, e.g. "easy everywhere + pro tactics", which is
also the highest-leverage combo since tactics is where the optimizer edge
lives). Recommendation (not a decision): whatever surface count Nico picks,
gate **whole-mode policy families plus at most 2-3 sentinel override combos**;
an ungated combinatorial override space cannot carry a parity promise.

### D2 - mode permanence

Evidence input: if parity is envelope-gated per patch (D3 A or B), fairness no
longer *requires* locking — switch-anytime is safe because both surfaces are
kept inside the measured band, and the Apex precedent shows per-context
parameterization (different bridges in mixed vs pure lobbies) is an accepted
pattern for the competitive-only-declared variant (Finding 7). Locking
per-save adds no measurable fairness benefit on top of a passing gate; its
value is product identity, not parity. If D3=C (no easy-vs-pro gate), then
locked-declared in competitive contexts becomes the only honest option, since
unmeasured mixed competition would otherwise carry an unquantified gap.

### D4 - sweep scope

The parity harness sizes itself: T2 parity sweep (policy ladder x 3
squad-strength profiles x 3 opponent policies x style cells, multi-seed) on
every `match.core`/tactics parameter change; full T3 season soak
(league-position distributions per policy) per release; T4 mode-split
telemetry post-launch. This mirrors GD-0043's existing tier semantics — no new
harness tier is needed, only new cells and the optimizer re-derivation step.

### NEW decision forks discovered (for Nico, not decided here)

**NEW-parity-normalization** — what "X% of pro-optimal output" is measured
against: (a) raw xPts ratio easy/pro; (b) floor-normalized parity ratio `R`
(share of achievable decision value above the random floor); (c) head-to-head
win-probability band only. Raw ratio (a) is misleading in a squad-dominated
engine (trivially high parity); (c) alone hides *where* the gap comes from.
Recommendation (not a decision): (b) as the headline gate with (c) as
co-primary check — both are already computable on the T2 harness.

**NEW-optimal-anchor-policy** — what counts as "pro-optimal": (a) fixed
scripted reference heuristics only; (b) versioned fixed-budget optimizer
(approximate best response) re-derived per patch; (c) human benchmark
squads/players later via T4. (a) is cheap but decays — the scripted reference
stops representing what skilled players find, and parity numbers go stale;
(b) is the literature-standard anchor (Finding 2) at higher compute cost.
Recommendation (not a decision): (b) for the gate, (a) as smoke references,
(c) as post-launch validation.

**NEW-easy-assist-parameterization** — how parity is *achieved* when
measurement says the gap is too big: (a) design-level mapping (each easy
preset compiles to a genuinely strong pro-surface configuration — Auto-Coach
quality becomes the parity mechanism, cf.
[[progressive-disclosure-ui|progressive disclosure draft]] §4); (b) an
explicit declared numeric assist constant on easy mode (aim-assist style,
Finding 7); (c) hidden outcome-level compensation in the engine.
Recommendation (not a decision): (a) first — transparent, no hidden buff,
consistent with GD-0041's earned-power ethos and one-simulation-core purity;
(b) only as a declared, monitored, versioned fallback; (c) never — it
contradicts GD-0042's single game semantics across profiles and would be a
hidden handicap (Finding 8).

## Future-scope notes (classified future-scope)

- **T4 mode-split telemetry**: once real players exist, validate the simulated
  parity gate with consented outcome telemetry split by mode (league results,
  xPts-vs-points by mode), the manager-sim analog of input-split telemetry in
  crossplay shooters; needs the analytics-consent surface first.
- **RL/learned best-response agents** for exploit discovery (OpenAI-Five-style
  self-play surfacing degenerate tactics before players do) — future upgrade of
  the `P_pro_opt` anchor; the fixed-budget search optimizer is the v1.
- **Meta-drift cadence**: the community will discover pro-surface exploits
  faster than easy-surface ones; a scheduled re-derivation cadence for anchor
  policies (not only on parameter changes) may be needed once live.
- **Per-area parity sub-gates**: if D1 lands on per-area overrides, extend the
  parity ladder to area-scoped policies (easy-finance-vs-pro-finance etc.);
  the economy runbook would own the finance cells, mirroring the GD-0043
  economy/gameplay split.
- **Question**: should the parity envelope itself be part of the public player
  promise (like GD-0041's no-P2W copy), which would make re-baselining a
  communication event, not just a calibration event?
