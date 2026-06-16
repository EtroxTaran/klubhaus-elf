---
title: Training, Load and Medicine
status: draft
tags: [game-design, training, load, medical]
created: 2026-05-16
updated: 2026-06-11
type: game-design
binding: false
related: [[README]], [[../60-Research/player-strength-presentation]], [[../60-Research/player-staff-development-decision-model-2026-05-28]], [[youth-academy-and-development]], [[tactics-system]], [[match-engine]], [[GD-0021-player-staff-development-and-decision-influence]], [[../60-Research/systemic-events-player-development-venue-ops]], [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
---

# Training, Load and Medicine

> **Status note (2026-06-11, FMX-143):** This system/mode note is `status: draft` — it was
> reopened 2026-05-27 and was **not** among the 133 decisions ratified in the 2026-06-08
> sweep (#153). "Approved" wording below is **pre-reopen history**, not a current status
> claim; the product rules described here await individual re-approval (decided by Nico,
> 2026-06-11: keep `draft`, re-approval is a later HITL pass — see
> [[../40-Execution/ratification-status-inventory-2026-06-11|status inventory]]). Frontmatter
> is the status SSOT per
> [[../10-Architecture/09-Decisions/ADR-0092-vault-governance-status-ssot-and-reference-integrity-sweep|ADR-0092]].
> The ratified GDDR layer ([[README|Game Design Hub]]) may cover the same system — the GDDR
> is then the binding record.

> Approved by the systemic events / player lifecycle pass (2026-05-17).
> This note uses a multifactor risk model. Do not implement injuries from
> one magic workload threshold.

Training links short-term match form with long-term development. The
research stresses that training should not just "+1 attribute" - it should
trade conditioning for fatigue, intensity for injury risk, and detail for
roster availability.

## 1. Eight training blocks

| Block | Purpose | Side effects |
|---|---|---|
| Match Preparation | Tactical drills, opponent prep | Tactical familiarity ↑ |
| Team Cohesion | Eingespielt-Chemistry | Familiarity ↑, morale ↑ |
| Tactical Familiarity | Role automation | Tactic exec ↑, fatigue ↑ |
| Position-specific | Per-position attribute | Per-position growth ↑ |
| Set-Piece Sessions | Routines | Set-piece efficiency ↑ |
| Recovery | Regen | Fatigue ↓, growth = 0 |
| Physical Loading | Conditioning | Stamina ↑, injury risk ↑ |
| Individual Focus | 1-1 attribute | Per-attribute growth ↑ |

A week is a budgeted set of blocks. Stuffing too many high-intensity blocks
breaks the load model below.

## 2. Load model

Load comes from:

- Match minutes.
- Training intensity.
- Training block type.
- Travel time (long away trips ↑).
- Weather (heat / cold ↑).
- Pitch/surface quality.
- Role demands (pressing, sprint exposure, duel volume).
- Fitness state (poor fitness ↑ load per same activity).
- Medical history (chronic risk ↑).

Outputs:

- **Fatigue** - decays naturally with rest.
- **Readiness** - short-term availability estimate for match and training.
- **Injury risk** - rises non-linearly with load, recurrence and context.
- **Form** - peaks at moderate load.
- **Sharpness** - rises with appropriate match exposure and falls with long
  absence.

High intensity briefly ↑ pressing and fitness but ↑ injury + form risk.
This makes rotation a real resource-management decision across the season.

## 3. Per-player weekly fatigue

```text
weekly_fatigue = sum(
  match_minutes * match_intensity
  + training_intensity * training_minutes
  + travel_load
  + weather_load
)
fatigue_state = max(0, fatigue_state + weekly_fatigue - rest_factor)
injury_risk = base_injury_risk
            + fragility_factor
            + fatigue_amplifier(fatigue_state)
```

This is a UI-friendly simplification. The simulation tracks risk channels
rather than a single threshold:

| Channel | Typical source |
|---|---|
| Training exposure | block type, intensity, surface, weather |
| Match exposure | minutes, sprint load, contact, role demand |
| Overuse | acute load versus chronic baseline, monotony, poor recovery |
| Recurrence | body-part history, recent return, rehab quality |
| Contact | duels, fouls, collisions |
| Illness/minor availability | travel, fatigue, seasonal/weather context |

External workload research supports load spikes as a signal, but the
evidence for universal thresholds is mixed. The game therefore exposes
staff risk bands and causes, not one exact predictor.

## 4. Medical and sport science

A medical centre with high tier delivers three benefits:

- **Shorter downtime** per injury.
- **Lower re-injury rate**.
- **Better end-of-season availability** (peak window management).

Combined with diagnostics it lets a club press harder, rotate more,
develop juniors more stably.

## 5. Injury model

| Injury class | Typical duration | Recovery |
|---|---|---|
| Niggle | 0-3 days | monitor / reduced load |
| Minor knock | 1-14 days | light training |
| Sprain / pull | 1-8 weeks | rehab |
| Tear | 2-6 months | rehab + medical centre tier |
| Season-threatening | 6+ months | specialist + recurrence risk |
| Chronic flag | indefinite | permanent `injury_proneness` ↑ possible |

Medical centre tier reduces durations 10-25 %.

Pipeline:

1. Training and Match emit load/contact/readiness signals.
2. Squad & Player owns the injury profile and persisted injury record.
3. Risk windows open only during eligible activities.
4. Injury occurrence and severity are separate deterministic draws.
5. `TrainingInjuryOccurred`, `MatchInjuryOccurred`,
   `PlayerAvailabilityChanged` and `PlayerReturnedFromInjury` feed
   Notification/Narrative.

## 6. Tactical familiarity

Switching tactic mid-season costs *tactical familiarity* - a per-tactic
percentage that scales how reliably the team executes. Familiarity grows
with:

- Tactical training block hours.
- Match minutes in the tactic.
- Squad continuity.

Drops on:

- New tactic switch (instant -20-40 %).
- Significant squad rotation.

The match engine ([[match-engine]]) reads familiarity as a multiplier on
team-shape correctness.

## 7. UI tiers

| Tier | Training UI |
|---|---|
| Quick | "Auto-coach" toggle; one-tap optimise |
| Standard | Block grid per week, intensity slider, recovery toggle |
| Expert | Per-player schedule, individual focus targets, load forecast |

## 8. Impact Lens status signals

Training owns or contributes the short-term availability facts consumed by
[[../60-Research/player-strength-presentation]]:

- fatigue,
- fitness,
- sharpness,
- injury-risk warnings,
- training-derived tactical familiarity.

These signals may modify Role Impact projections, but the UI must keep them
visible as separate status indicators so the player can tell the difference
between a poor role fit and a good fit who is currently tired or rusty.

## 9. Coach role-fit

Coaches have specialisations (attacking / midfield / defensive / GK /
fitness / set-piece). Assigning a coach outside their specialisation
reduces block effectiveness.

Staff Operations owns role assignment, pipeline coverage and specialisation
metadata. Training consumes those facts through the GD-0021 factor matrix and
applies bounded effects. FMX-152 accepts staff-skill profile effects only as
narrow Staff Operations pipeline modifiers; Training still owns exact formulas,
bands and tuning.

## 10. Future-scope notes (classified future-scope)

- "Training camp" event in pre-season - implement as a special week-block
  bundle with morale + chemistry bonuses but a travel-fatigue cost.
- Weather effects on training (rain cancellation) - probabilistic outdoor
  cancellation; an indoor facility ([[stadium-and-campus]]) negates it.
- Wellness / sleep tracking - flavour-only feed cards (no real attribute
  effects beyond fatigue model).
