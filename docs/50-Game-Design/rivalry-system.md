---
title: Rivalry System - Emergent Five-sub-score Rivalry Graph
status: draft
tags: [game-design, rivalry, fans, history, matchday, risk, fmx-46]
created: 2026-05-16
updated: 2026-06-11
type: game-design
binding: false
related: [[README]], [[../60-Research/fan-culture-segmentation-research]], [[../60-Research/matchday-operating-costs-and-risk-cost-settlement-2026-05-29]], [[matchday-event-engine]], [[audience-and-atmosphere]], [[GD-0022-economy-commercial-impact-and-contracts]], [[watch-party-and-conference]]
---

# Rivalry System - Emergent Five-sub-score Rivalry Graph

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

Rivalries are not just declared at scenario start. They **emerge** from
geography, history, sporting events, fan incidents and transfer
conflicts. The aim is to surface narrative pairings that aren't always
the obvious derbies.

## 1. Rivalry score

For each ordered pair (A → B) the system maintains a `rivalry_score`
(0-100). The score is a weighted aggregate of five sub-scores:

| Sub-score | Source signals | Decay rate |
|---|---|---|
| `regional_score` | Geographic proximity (km), shared catchment | Stable |
| `historical_score` | Long-running league overlap, historic key matches | Very slow |
| `sporting_score` | Frequent losses, important deciders lost | Per-season |
| `fan_incident_score` | Pyro, projectiles, fan marches | Per-season |
| `transfer_tension_score` | Cross-rivalry transfers, agent conflicts | Per-season |

```text
rivalry_score = clamp(
  0.25 * regional_score +
  0.20 * historical_score +
  0.25 * sporting_score +
  0.15 * fan_incident_score +
  0.15 * transfer_tension_score,
  0, 100
)
```

Symmetry: `rivalry_score(A→B) ≈ rivalry_score(B→A)` but the underlying
sub-scores can differ (e.g. A has bigger sporting grievance against B
than vice versa).

## 2. Sub-score growth signals

### 2.1 `regional_score`

- 0-30: > 200 km apart.
- 30-60: 50-200 km apart.
- 60-100: < 50 km apart.

Modified by: shared region cultural / linguistic markers (modest +5).

### 2.2 `historical_score`

- +10 per decade of shared league.
- +5 per "important historical moment" entry in club history (champion
  decided, relegation decided, cup final).
- Slow decay: -1 per 10 seasons of no contact.

### 2.3 `sporting_score`

- +5 per recent (last 5 seasons) decisive loss.
- +10 per major decider lost (last 10 seasons).
- +3 per close loss in derby.
- Per-season decay: -2.

### 2.4 `fan_incident_score`

- +10 per match-day security incident between the clubs.
- +5 per high-profile media incident.
- +3 per minor incident.
- Per-season decay: -3.

### 2.5 `transfer_tension_score`

- +15 per "icon" leaving directly to the rival.
- +5 per any senior transfer.
- +3 per agent / contract dispute involving the rival.
- Per-season decay: -2.

## 3. Rivalry threshold tiers

| Tier | Score | Effect |
|---|---|---|
| **None** | 0-20 | Just a fixture |
| **Mild** | 20-40 | Slight atmosphere boost |
| **Strong** | 40-65 | Derby badge in UI, atmosphere x 1.15 |
| **High** | 65-85 | Risk match candidate; alcohol policy review |
| **Volatile** | 85-100 | Auto-classified high-security; visiting-fan cap; watch-party suggestion |

## 4. Effects on match-day

Per [[audience-and-atmosphere]] and [[matchday-event-engine]]:

- Higher atmosphere multiplier in the engine.
- Higher security event probability.
- Higher `MatchdayOperatingCostProfile` risk tier and damage reserve.
- Higher catering revenue per fan (premium pricing accepted).
- Watch-party auto-proposal for `Strong+` rivalries.

FMX-46 mapping to operating-cost risk:

| Rivalry tier | Operating-cost profile input |
|---|---|
| None / Mild | Normal fixture attractiveness; no automatic risk uplift. |
| Strong | Derby badge; `guarded` or `elevated` risk if away demand, kickoff or incident memory also fires. |
| High | `elevated` risk by default; alcohol policy and away allocation review. |
| Volatile | `highRisk` by default; visiting-fan cap, security upgrade and fan-dialogue mitigation recommended. |

## 5. Decay and reset

Sub-scores decay per season as listed above. Total decay is gentle - a
rivalry should outlive a single bad season.

A rivalry can **rebuild** quickly through any of the trigger signals. So a
team that wasn't anyone's enemy can become one in a season or two through
a string of incidents.

## 6. UI tiers

| Tier | Rivalry surface |
|---|---|
| Quick | "Derby badge" + 1-line history |
| Standard | Rivalry card with score + sub-score breakdown |
| Expert | Full rivalry graph view, club-by-club, with timeline of incidents |

## 7. Cross-club view

Each club has a `rivals_list` page showing top-N rivals by score, with
ability to expand each into a relationship-history view.

## 8. Future-scope notes (classified future-scope)

- Should rivalries cross country borders (Bundesliga-Premier League)?
  Yes, but rarely - mostly via continental cup history. Sub-scores allow
  for it.
- Anstoss-style "no-derby clubs" - clubs with very low regional score and
  no history can still develop strong rivalries via sporting and
  fan-incident scores.
- Player can manually nominate a rival? No - the score is emergent only.
  The player can comment on a rival (media event) but cannot inject.
