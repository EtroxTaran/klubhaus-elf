---
title: Assisted-Play Parity - Auto-Coach Strength Specification and Calibration
status: draft
tags: [research, dual-mode]
context: [tactics, training]
created: 2026-07-01
updated: 2026-07-01
type: research
binding: false
linear:
sourceType: external
related:
  - [[raw-perplexity/raw-assisted-play-parity-auto-coach-2026-07-01]]
  - [[../20-Features/feature-tactics-progressive-disclosure]]
  - [[../50-Game-Design/tactics-system]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0005-training]]
  - [[../50-Game-Design/GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[ai-manager-behaviour]]
  - [[progressive-disclosure-research]]
---

# Assisted-Play Parity - Auto-Coach Strength Specification and Calibration

## Question

The vault's Auto-Coach ([[../50-Game-Design/progressive-disclosure-ui]] §4)
"proposes only, never overwrites" — but its **strength is undefined**, and it
is the single biggest lever for the hard requirement "an easy-mode player must
remain competitively viable". How do comparable games implement assistant /
auto-pick systems whose output approaches expert play, how is assistant
quality tuned and measured, what are the documented failure modes at both
extremes (too weak / too strong), and how could an Auto-Coach strength target
be specified and calibrated against expert-optimal play — including as a
GD-0043-style calibration slot?

## Summary

Every genre we examined lands on the same trap from one of two sides. Football
Manager's assistant/delegation and Civilization's automation are *safe but
weak*: they concentrate their failures in adaptation (in-match reaction,
long-run plan evolution) rather than static picks, so automation users
effectively self-handicap against a difficulty tuned for manual play. Battle
Legion and over-strong auto-battle show the opposite failure: automation
strong enough to win on its own "kills the strategy of the game". The most
useful engineering precedent is chess: Stockfish specifies limited strength as
an *externally anchored number* (UCI_Elo, calibrated against the CCRL 40/4
rating list at a stated time control) and produces it via full-strength search
plus probabilistic selection among top-N candidates — i.e. strength is a
measured, benchmarked property, not a vibe. Maia shows the alternative of
training to a target band directly. Applied to FMX: the Auto-Coach strength
target should be (a) expressed as a normalized score between a naive baseline
agent and an expert-reference agent, (b) specified **per decision class**
(lineup, tactic preset, in-match triggers, training plan, other areas) because
assistants degrade non-uniformly, and (c) owned by a new `assist.autoCoach`
calibration slot under GD-0043 with Monte-Carlo season-sim acceptance. The
mechanism that best fits the "one simulation core" constraint is Auto-Coach =
the same evaluation the AI managers use, throttled by candidate-set
temperature (Stockfish Skill-Level pattern), never by fake noise the player
could perceive as cheating. All of this feeds — and does not decide — D3.

## Findings

1. **Finding:** Football Manager's delegation system (Staff Responsibilities)
   lets nearly everything be delegated, but frames the assistant as
   *advice-giver* for tactics/selection in competitive matches; SI's own
   framing is workload relief, not equal-strength play.
   **Source:** footballmanager.com "Delegating for success" (FM26);
   sortitoutsi Staff Responsibilities guide (see raw note Q1).
   **Confidence:** high.

2. **Finding:** FM community experiments and consensus put fully-delegated
   ("holiday") performance at roughly *intrinsic squad strength*, with the
   assistant's weaknesses concentrated in **adaptation**: conservative match
   plans, poor substitutions, little game-state reaction, no long-run tactical
   evolution, short-termist squad building. Delegating *training* alone to a
   competent assistant costs little (an FM24 experiment found "not huge"
   differences). Static picks are near-fine; dynamic decisions are where the
   gap opens.
   **Source:** The Higher Tempo Press delegation essay; r/footballmanagergames
   threads; FM24 training-delegation experiment video (raw note Q1). No
   SI-published benchmark exists — magnitudes are community-reported.
   **Confidence:** medium.

3. **Finding:** Stockfish specifies limited strength as an externally
   anchored, measurable target: `UCI_Elo` is "calibrated at a time control of
   120s+1s and anchored to CCRL 40/4", and the docs state the calibration is
   time-control-specific. The mechanism behind `Skill Level` is full-strength
   search with MultiPV plus a level-dependent probability of playing a weaker
   candidate move — throttling *selection*, not *understanding*.
   **Source:** official Stockfish wiki (UCI & Commands page), raw note Q2.
   **Confidence:** high.

4. **Finding:** Two complementary strength-limiting families exist: (a)
   degrade a strong engine (noise on evaluation, blunder scheduling, search
   limits — MadChess documents its Elo-to-parameter mapping and verifies it by
   engine-vs-engine testing); (b) train models directly on the target band
   (Maia predicts the move humans at a given Lichess rating actually play,
   validated by move-agreement and match results). (a) is cheap and tunable;
   (b) produces more believable behaviour but needs data FMX will not have at
   MVP.
   **Source:** madchess.net UCI_LimitStrength algorithm write-up; maiachess.com
   / McIlroy-Young et al. KDD 2020 (paper identity known, not re-fetched).
   **Confidence:** high for (a), medium for Maia details.

5. **Finding:** The "too weak" failure mode is endemic in 4X/grand strategy:
   Civilization's automated workers/governors are greedy short-horizon local
   optimisers blind to the player's strategy; Paradox automation is
   deliberately "competent but conservative"; Total War auto-resolve is tuned
   good-enough-to-skip-trivia but mis-values micro-intensive armies. The
   cross-genre consequence: **difficulty is balanced assuming manual play, so
   automation users silently play a harder game** — exactly the situation
   FMX's hard parity requirement forbids.
   **Source:** Civilization wiki + CivFanatics; Paradox/Total War community
   consensus via raw note Q3 (no single canonical URL for the Paradox/TW
   claims).
   **Confidence:** medium (high for the Civ automation complaints, lower for
   per-franchise specifics).

6. **Finding:** The "too strong" failure mode is documented just as clearly:
   Ed Beach removed builder automation from Civ VI arguing "automation is a
   sign that your game design is weak… there are no interesting decisions"
   behind an automate button; the Battle Legion postmortem-style critique
   found that auto-battling *to victory* "killed the strategy of the game";
   Soren Johnson's "players will optimize the fun out of a game" predicts that
   if Auto-Coach is the optimum, pro-mode players will feel obliged to press
   it and stop playing the tactics game.
   **Source:** Verge Civ design piece / quote thread (Beach); Jeff Witt,
   ggDigest Battle Legion analysis; Soren Johnson, "Water Finds a Crack"
   (designer-notes.com). Raw note Q3/Q4.
   **Confidence:** high for Johnson/Witt (primary texts read); medium for the
   exact provenance of the Beach quote.

7. **Finding:** Auto-battle done well is explicitly framed as a **bounded
   bet**: Adam Telfer describes the healthy shape as "do I send my fighters
   out without my control… or do I think the AI will mess up this battle, so I
   should do it manually?" — manual play buys a *bounded, perceivable* edge
   over automation, and automation shifts interesting decisions to the meta
   layer. This is the closest published articulation of FMX's easy/pro parity
   goal.
   **Source:** mobilefreetoplay.com, "Games That Don't Want You To Play Them".
   **Confidence:** high.

8. **Finding:** In-client recommenders in deck/auto-battler games
   (Hearthstone smart deck completion, TFT item hints, Marvel Snap sample
   decks) are deliberately curated, collection-constrained and *not*
   meta-optimal; the observed ladder pattern is that pure recommender/meta
   followers plateau around mid ranks while top ranks require adaptation
   skill. Designers treat recommenders as onboarding, and research on
   auto-battler balance warns that recommending only highest-strength lineups
   flattens strategy diversity.
   **Source:** raw note Q5; "Lineup Mining and Balance Analysis of Auto
   Battler" (ACM DL 10.1145/3434581.3434611) for the diversity warning.
   **Confidence:** medium (pattern consensus; per-game internals unpublished).

9. **Finding:** Established quantitative metrics exist for assistant/agent
   strength: win rate vs a reference agent; Elo within an agent league
   (AlphaStar was placed against the human ladder distribution; Stockfish
   against CCRL); **oracle agreement rate** (share of decisions matching a
   reference-optimal policy); **regret** (expected-value gap between the
   assistant's pick and the oracle pick); plus diversity metrics to detect
   recommendation-induced meta collapse. King-style AI playtesting (bots at
   several skill levels; win-rate/attempt targets per level) shows the
   difficulty-calibration workflow at production scale.
   **Source:** raw note Q2/Q5; Stockfish wiki; ACM lineup-mining paper;
   AlphaStar/OpenAI Five published results and King's human-like playtesting
   work (identities known, not re-fetched this session).
   **Confidence:** high for the metric definitions; medium for the King
   specifics.

10. **Finding:** Opacity is a parity-adjacent failure of its own: hidden
    assistant mechanics that occasionally look wrong destroy trust even when
    statistically sound ("perception is reality" — players assume unfairness
    from black-box single events). Advisor systems that *explain* proposals
    ("suggest, player confirms") retain trust; this matches the vault's
    existing propose-only rule and the explainability acceptance criterion in
    [[../20-Features/feature-tactics-progressive-disclosure]].
    **Source:** Soren Johnson, "Game AI & Our Cheatin' Hearts"
    (gamedeveloper.com); Civ advisor pattern (raw note Q3/Q4).
    **Confidence:** high.

## Inputs For Decisions

### D3 (parity target) — primary customer of this packet

The evidence supports specifying the Auto-Coach target as a **normalized
strength score with two anchors**, instead of a raw "% of expert" ratio:

- **Lower anchor N** = naive baseline agent (legal-but-uninformed picks:
  default preset, most-rested XI, no in-match reaction).
- **Upper anchor E** = expert-reference agent (best policy we can build on the
  real engine: full Expert-tier action space, opponent-aware, in-match
  triggers used optimally within D4's trigger model).
- **Auto-Coach strength** `S = (AC − N) / (E − N)`, measured on mean season
  points (or mean goal difference) over Monte-Carlo season simulations with
  identical squads. This avoids the compression problem of raw points ratios
  (even a random XI wins games with a strong squad — FM's holiday result
  "roughly intrinsic squad strength" is the N anchor made visible).

Options for where to put S (evidence-based, **recommendation, not a
decision**):

- **Option D3-a — near-parity (S ≈ 0.90-0.95 everywhere):** matches the
  chess-engine insight that a throttled expert can be pinned to a number, and
  guarantees easy-mode viability. Risk (Findings 6, 8): pro depth becomes
  cosmetic; players "optimize the fun out" by pressing Auto-Coach even in pro
  mode.
- **Option D3-b — bounded pro edge (S ≈ 0.85-0.90 season-aggregate, with the
  gap placed in adaptation decisions):** mirrors the healthiest published
  pattern (Finding 7's "bounded bet"; Finding 8's mid-rank plateau for
  recommender-followers). Easy mode stays viable (S far above N; never
  self-handicapping vs the AI league), pro mode's edge is real but capped and
  *legible* — it comes from the decision classes assistants are documentedly
  bad at (in-match reaction, opponent-specific pivots), not from hidden
  penalties.
- **Option D3-c — parity vs AI only:** cheapest to guarantee (tune AI-league
  managers so Auto-Coach output sits mid-table-fair), but does nothing for
  human-vs-human comparison contexts and leaves the easy-vs-pro gap
  unspecified.

*Recommendation (not a decision):* D3-b, with the season-aggregate corridor
(e.g. S within 0.85-0.92) as a GD-0043 tolerance envelope and the explicit
rule that the pro edge must come from adaptation decision classes, not from
degrading Auto-Coach's static picks. Findings 2 and 5 show static-pick
quality is cheap to make near-expert; Findings 6-8 show the whole design
fails if the *aggregate* is either ~1.0 or unbounded below.

### D1 (two modes vs three tiers vs override)

- Indifferent to mode count, but Finding 2 implies the Auto-Coach must cover
  **every decision class the easy surface hides** (lineup, tactic, set
  pieces, training, and simple surfaces for finance/stadium/scouting per
  [[../50-Game-Design/progressive-disclosure-ui]] §3), because any uncovered
  class silently becomes an FM-style self-handicap for easy players.
- Per-area override (D1 option C) multiplies the calibration surface: each
  area's assistant needs its own strength measurement or the parity guarantee
  is only as strong as the weakest-calibrated area. Evidence-neutral on
  desirability; it is a calibration-cost input.

### D2 (mode permanence)

- The propose-only + never-overwrite rule already in the vault removes the
  main technical obstacle to switch-anytime (state is preserved). Finding 10
  adds: whatever permanence Nico picks, Auto-Coach proposals must stay
  explainable, or switchers will attribute easy-mode losses to a "dumbed
  down" black box. Chess precedent (Finding 3) notes strength calibration is
  context-specific (time control); if competitive contexts lock modes,
  Auto-Coach strength should be re-validated under competitive settings
  rather than assumed transferable.

### D4 (sweep scope)

- Finding 2's decision-class split (static picks vs adaptation) suggests the
  sweep should treat "assistant coverage + strength per area" as one sweep
  dimension: tactics and training are grounded here; finance/stadium/
  scouting assistants have no strength spec anywhere in the vault yet.

### NEW-autocoach-strength-mechanism (newly discovered fork)

*How* the Auto-Coach's strength level is produced is a genuine design fork
the vault has not posed:

- **Option A — throttled expert (Stockfish Skill-Level pattern):** run the
  same evaluation the AI-league managers use, generate top-N candidate
  proposals, select via temperature/probability schedule tuned to hit the
  target S. Pros: one policy to maintain; strength is one tunable knob;
  deterministic under a seeded stream (fits the vault's seeded-variance
  preference); the assistant never "understands less", it just doesn't always
  pick the top candidate. Cons: at low temperatures its occasional
  non-optimal picks are arbitrary rather than characterful.
- **Option B — degraded evaluation (MadChess pattern):** add calibrated noise
  /knowledge attenuation to the assistant's evaluation. Pros: smooth strength
  dial. Cons: produces *wrong beliefs*, which leak into the explanation UI —
  clashes with Finding 10's trust requirement (the assistant would confidently
  explain a mistaken assessment).
- **Option C — separately authored assistant policy (FM assistant pattern):**
  hand-written heuristics per area. Pros: fully controllable tone. Cons: this
  is precisely the architecture whose weakness profile (adaptation gaps,
  drift from engine changes, per-patch decay) is documented in Findings 2
  and 5; it also doubles maintenance against the AI-manager policy.

*Recommendation (not a decision):* Option A, with the explanation UI always
describing the *chosen* candidate's rationale (never the internal ranking),
and Option B explicitly rejected for explanation-bearing assistants.

### NEW-autocoach-strength-granularity (newly discovered fork)

Is the strength target **one global number or a per-decision-class vector**
(lineup / tactic preset / in-match triggers / training plan / other areas)?
Evidence (Findings 2, 5): assistants degrade non-uniformly, and the gap
concentrates in adaptation classes; a single global S both under-specifies
(where the pro edge lives) and over-constrains (forces pointless precision on
classes that are near-free to make near-optimal).
*Recommendation (not a decision):* per-decision-class vector with a
season-aggregate corridor as the acceptance gate — the aggregate is what D3
promises players; the vector is what engineering tunes.

### GD-0043 calibration-slot proposal (input for Nico; touching GD-0043 is a decision)

GD-0043 is binding and its slot taxonomy does not cover assistants. Proposed
new slot (draft contract, to be ratified by Nico, not by this note):

```yaml
calibrationSlot:
  id: assist.autoCoach
  owner: tactics (with training for the training-plan decision class)
  sourceRecord: <the GDDR that closes D3>
  parameterPackVersion: <tbd>
  primaryMetrics:
    - normalizedStrength S per decision class (season-sim Monte Carlo,
      identical squads, vs naive-baseline N and expert-reference E agents)
    - season-aggregate S corridor (the D3 promise)
    - oracleAgreementRate and meanRegret per decision class vs E
    - proposal-diversity index (guard against one-preset meta collapse,
      per the auto-battler lineup-mining warning)
  harnessTier: T2 (Monte Carlo envelope) + T3 (multi-season soak:
    Auto-Coach-managed club must not drift into FM-holiday-style decay)
  tolerancePolicy: envelope (S corridor) + hard invariants
    (S never < a floor in any decision class; S never ≥ 1.0 on aggregate —
    Auto-Coach must not beat the expert-reference agent)
  baselineAuthority: Nico (per GD-0043 rebaseline rule)
  evidencePath: this note + raw capture + future harness run reports
```

Two properties come straight from the chess precedent (Finding 3): the
strength number is only meaningful **relative to a named reference agent and
setting** (as UCI_Elo is only meaningful relative to CCRL 40/4 at 120s+1s),
so E and N must be versioned artifacts inside the parameter pack; and any
engine change invalidates the calibration, so `assist.autoCoach` must be
re-run whenever `match.core` rebaselines.

## Future-scope notes (classified future-scope)

- **Maia-style personalisation:** once real (consented) telemetry exists, an
  assistant trained on FMX players at a target band could replace the
  throttled-expert temperature schedule for more human-feeling proposals —
  post-MVP, data-dependent, and a privacy decision in its own right.
- **Auto-Coach as difficulty accessibility dial:** the same S machinery could
  later expose "assistant strength" as an accessibility option (weaker
  assistant = harder solo game) — distinct from the D3 parity promise and
  must not be conflated with it.
- **Tactic AI scout** ([[../50-Game-Design/tactics-system]] §19, Phase 2)
  should reuse the same E-agent evaluation rather than growing a second
  assistant brain.
- **Could not verify:** any SI-published quantitative benchmark of FM
  assistant strength; exact provenance/venue of the Ed Beach automation
  quote; Total War auto-resolve internals (community reverse-engineering
  only). These remain low-confidence background, not load-bearing for the
  slot proposal.
