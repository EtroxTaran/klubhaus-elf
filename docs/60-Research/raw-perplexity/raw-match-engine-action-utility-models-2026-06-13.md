---
title: "Raw - match-engine action utility and attribute models (FMX-133)"
status: raw
tags: [research, raw, perplexity, match-engine, action-utility, xg, xt, epv, attributes, fmx-133]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-133
related:
  - [[../match-engine-core-model-2026-06-13]]
  - [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]
  - [[../../50-Game-Design/match-engine]]
---

# Raw - match-engine action utility and attribute models (FMX-133)

## Research prompt

Perplexity was asked to compare coarse Markov/event-chain models, logistic
outcome probabilities, weighted attribute contests, xG, xT/EPV/possession value
and explainable reason codes for a deterministic, replayable sports-management
match engine.

## Source-quality note

The answer was directionally useful, but most citations were weak. Stronger
anchors for xG, xT, EPV/possession value and action-value concepts are captured
in [[raw-match-engine-source-checks-2026-06-13]].

## Extracted findings

- A football-manager match engine should use a **layered model**:
  1. Markov/event-chain structure for possession phase and next-action flow.
  2. Logistic or logistic-like probabilities for action outcomes.
  3. Weighted attribute contests for explainability and player differentiation.
  4. xG for shot quality and goal probability.
  5. xT/EPV-style state value for action choice.
  6. Reason codes for audit, replay and player-facing analysis.
- Markov/event-chain structure is useful as the outer model because it is
  deterministic, inspectable and easy to drive from possession phase, zone,
  pressure, fatigue and tactics.
- Logistic outcome functions are best used locally, e.g. pass success, dribble
  success, duel win, foul/card risk, shot goal probability.
- Weighted attribute contests remain valuable because players must feel their
  attributes matter. They should feed the probability model and reason codes,
  not replace spatial value.
- xG should be the shot-specific probability surface. Non-shot actions need
  possession value rather than direct goal probability.
- xT/EPV-style values are the recommended utility backbone: each candidate action
  is evaluated by expected post-action state value, success/failure distribution,
  tactical style and risk preference.

## Candidate formula extracted for synthesis

```text
utility(action) =
  sum(outcome_probability(action, state, actor, defender) *
      possession_value(resulting_state(outcome)))
  + tactical_style_bias
  + player_trait_bias
  - risk_penalty
  - fatigue_or_pressure_penalty
```

The action choice should be deterministic under the seeded RNG, but not always
perfectly optimal. `Decision`, `Composure` and tactical familiarity should affect
how often a player chooses the best action versus a near-best plausible action.

## Reason-code pattern

Each event should carry compact reason codes such as:

- `tactic:direct_play_bias`
- `state:high_epv_gain`
- `state:low_pressure_lane`
- `attribute:passing_advantage`
- `attribute:poor_decision_under_pressure`
- `risk:protect_lead`
- `fatigue:late_match_degradation`
- `rng:low_probability_success`

These codes support commentary and analytics without allowing generated text to
change the event.

## Source trail

- Perplexity research pass, 2026-06-13: action utility, attribute math, xG/xT/EPV
  and reason-code modelling.
- Stronger source checks: [[raw-match-engine-source-checks-2026-06-13]].

## Related

- [[../match-engine-core-model-2026-06-13]]
- [[../../50-Game-Design/GD-0042-match-engine-core-model-and-calibration]]

