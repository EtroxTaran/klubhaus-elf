---
title: Training, Load and Medicine
status: draft
tags: [game-design, training, load, medical]
created: 2026-05-16
updated: 2026-05-16
type: game-design
binding: false
related: [[README]], [[youth-academy-and-development]], [[tactics-system]], [[match-engine]]
---

# Training, Load and Medicine

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
- Travel time (long away trips ↑).
- Weather (heat / cold ↑).
- Fitness state (poor fitness ↑ load per same activity).
- Medical history (chronic risk ↑).

Outputs:

- **Fatigue** - decays naturally with rest.
- **Injury risk** - rises non-linearly with load.
- **Form** - peaks at moderate load.

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
| Minor knock | 1-7 days | Light training |
| Sprain / pull | 1-3 weeks | Rehab |
| Tear | 1-3 months | Rehab + medical centre tier |
| Severe (ACL etc.) | 6-12 months | Specialist + risk of recurrence |
| Chronic flag | indefinite | Permanent injury_proneness ↑ |

Medical centre tier reduces durations 10-25 %.

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

## 8. Coach role-fit

Coaches have specialisations (attacking / midfield / defensive / GK /
fitness / set-piece). Assigning a coach outside their specialisation
reduces block effectiveness.

## 9. Open questions

- "Training camp" event in pre-season - implement as a special week-block
  bundle with morale + chemistry bonuses but a travel-fatigue cost.
- Weather effects on training (rain cancellation) - probabilistic outdoor
  cancellation; an indoor facility ([[stadium-and-campus]]) negates it.
- Wellness / sleep tracking - flavour-only feed cards (no real attribute
  effects beyond fatigue model).
