---
title: Fan Culture Segmentation and Atmosphere Research
status: in-review
tags: [research, fans, atmosphere, segmentation, ultras, synthesis, wave-2]
context: audience-atmosphere
created: 2026-05-16
updated: 2026-05-16
type: research
binding: false
related: [[raw-perplexity/raw-environment-events]], [[../50-Game-Design/fan-ecology]], [[../50-Game-Design/rivalry-system]]
---

# Fan Culture Segmentation and Atmosphere Research

This note backs [[../50-Game-Design/fan-ecology]] with the multi-segment
supporter model, atmosphere engine inputs/outputs, and the sanction chain
that ties fan behaviour to operational consequences.

## 1. Fan segments

Six segments, aligned with FM Supporter Profile but expanded:

| Segment | Loyalty | Sensitivity drivers | Economic weight |
|---|---|---|---|
| **Ultras / Hardcore** | Very high | Identity, rivalry, repression, ticket prices, tradition | Atmosphere generator; low per-cap revenue |
| **Core** | High | Sporting style, identity, derbies, season-ticket value | High per-cap revenue; high stability |
| **Family** | Medium | Safety, sanitary, cleanliness, kid-friendly experience | High catering + merch; weather-sensitive |
| **Fair Weather** | Low | Table position, form, star players | Volatile; vanishes in crisis |
| **Corporate** | Low | Hospitality, brand, stadium standard, sponsors | Highest per-cap revenue; demands amenity |
| **Casual / Event** | Very low | Media hype, big-name attractions, derbies | Low per-cap; useful for off-peak revenue |

Different segments react to **different** decisions:

- VIP-area expansion ↑ Corporate revenue but ↓ Ultras tradition mood.
- Alcohol ban ↓ Ultras + Casual mood, ↑ Family safety, ↓ catering revenue.
- Star signing ↑ Fair Weather inflow but ↑ wage cost.

## 2. Atmosphere engine

### Inputs

- Derby / rivalry intensity.
- Table context (relegation fight, title race).
- Stadium utilisation.
- Fan segment composition + stadium architecture (standing room %).
- Weather + kickoff time.
- Recent security interventions.
- Form + club mood.

### Outputs (modifiers in the match engine)

- Home advantage (probability shift on duels in our half).
- Morale swing magnitude during matches.
- Sponsor perception (post-match brand readings).
- Social buzz / club image.
- Per-capita match-day revenue.

## 3. Fan politics - decisions that move segments

Each of the following decisions moves two or more segments in opposite
directions:

- Ticket-price hikes (Ultras / Core ↓; Corporate neutral).
- Displacement of active scene (Ultras ↓↓; Casual neutral).
- Sale of club icon (Ultras + Core ↓; Fair Weather mixed).
- VIP-area over-expansion (Corporate ↑; Ultras ↓).
- Sponsors from incompatible industries (Ultras + Family ↓; Corporate ↑
  depending on industry).
- Stadium investment (Family + Corporate ↑; mixed depending on which seats
  get displaced).

## 4. Rivalry score (5 sub-scores)

Rivalries emerge - they are not just declared at scenario start.

| Sub-score | Source signals |
|---|---|
| `regional_score` | Geographical proximity, shared catchment |
| `historical_score` | Long-running league overlap, key past matches |
| `sporting_score` | Frequent losses, important deciders lost |
| `fan_incident_score` | Pyro, projectiles, fan marches between clubs |
| `transfer_tension_score` | Cross-rivalry transfers, agent conflicts |

Combined into a single `rivalry_score` that gates whether a fixture is
classified high-security by [[../50-Game-Design/matchday-event-engine]].

## 5. High-security match classification

Triggered when rivalry + table situation + fan-risk profile align. Inputs:

- Aggregate `rivalry_score` above threshold.
- Last fixture incident memory.
- Tier of competition (cup finals + relegation deciders score higher).
- Reported recent fan-incidents.

Effects:

- Higher security cost.
- More stewards / police demand.
- Possible visiting-fan limits.
- Sector closures.
- Alcohol ban (light beer or zero).
- Higher penalty risk.
- More media attention.

## 6. Sanction chain

Triggered by in-match or pre-match incidents. Multi-stage so consequences
escalate rather than land all at once:

1. Fine.
2. Partial sector closure.
3. Visiting-fan restriction.
4. Alcohol ban / light beer only.
5. Partial ghost match.
6. Full ghost match.
7. Elevated risk classification for follow-up matches.

UEFA disciplinary decisions (Arsenal, Eintracht Frankfurt) and DFB
Sicherheitsrichtlinien are the real-world reference for this chain.

## 7. Sources (new URLs)

All retrieved 2026-05-16.

- FM Supporter Confidence feature - [footballmanager.com supporter-confidence](https://www.footballmanager.com/features/supporter-confidence)
- Sortitoutsi FM23 supporter confidence - [sortitoutsi.net FM23](https://sortitoutsi.net/content/61059/fm23-new-support-confidence-feature)
- Stadium atmosphere psychology - [footballgroundmap.com fans-influence-stadium-atmosphere](https://www.footballgroundmap.com/articles/how-fans-influence-stadium-atmosphere-the-psychology-of-football-supporters)
- The Zimbabwean on stadium atmosphere - [thezimbabwean.co stadium atmospheres football](https://www.thezimbabwean.co/2024/12/the-importance-of-stadium-atmospheres-during-football-matches/)
- Crowd support effects (PMC) - [pmc.ncbi.nlm.nih.gov 10653546](https://pmc.ncbi.nlm.nih.gov/articles/PMC10653546/)
- Sage paper on ultras crowd modalities - [cambridge.org ultras crowd modalities](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DCB80D3B01F003D5BE121D4E03F721EE/S0145553224000282a.pdf/why_so_antisocial_football_ultras_crowd_modalities_and_atmospherics_of_discontent_in_public_space.pdf)
- UEFA Sennferrero decisions (sanctions) - [sennferrero.com UEFA decisions 2023-09-20](https://www.sennferrero.com/wp-content/uploads/2023/10/Decisions-of-20-September-2023-UEFA.pdf)
- UEFA disciplinary regulations 2024 (via RFEF) - [rfef.es UEFA Disciplinary 2024](https://rfef.es/sites/default/files/2026-02/UEFA_Disciplinary_Regulations_2024.pdf)
