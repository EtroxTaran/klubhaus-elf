---
title: Tactics System - Position, Role, Duty, Instructions, Traits
status: draft
tags: [game-design, tactics, match, mobile-ux]
created: 2026-05-16
updated: 2026-05-28
type: game-design
binding: true
related: [[README]], [[../60-Research/progressive-disclosure-research]], [[../60-Research/ai-manager-behaviour]], [[../60-Research/tactics-and-formations]], [[../60-Research/data-generators]], [[../60-Research/player-strength-presentation]], [[../60-Research/eos-player-staff-skills-and-personas-2026-05-28]], [[../60-Research/match-engine-simulation-model]], [[match-engine]], [[set-pieces]], [[progressive-disclosure-ui]], [[GD-0020-eos-player-skills-personas-and-people]]
---

# Tactics System - Position, Role, Duty, Instructions, Traits

Tactics is the single most-played UI of a manager game. We adopt a
layered model so 5-min/week casual users and 25-min/week experts can
play on the same engine without parallel content.

> Approved 2026-05-17 (gap D3). Full implementation reference is
> [[../60-Research/tactics-and-formations]]. This GDD captures the
> product-level rules; numerical depth + UX wireframes + competitor
> analysis live in the research note.

## 1. Five-layer model

`Position + Role + Duty + Player Instructions + Traits / Tendencies`

| Layer | Owned by | Examples |
|---|---|---|
| **Position** | Tactic editor | RB, CB, DM, CM, AM, LW, RW, ST |
| **Role** | Tactic editor | Inverted Full-Back, Ball-Winning Mid, Target Man, Poacher, Trequartista |
| **Duty** | Tactic editor | Defend / Support / Attack |
| **Player Instructions** | Per-player overrides | Cut inside, dribble more, early-cross never, low-pass risk |
| **Traits / Tendencies** | Player-owned, slow to acquire | Drifts to centre, shoots from distance, tries first-time passes |

The match engine ([[match-engine]]) reads all five and produces events.

## 2. Six tactical pillars

1. **Formation** - 20 supported (per [[../60-Research/tactics-and-formations]] §3).
2. **Play model** - positional, direct, counter, pressing-heavy,
   flank-oriented; expressed via team-instruction combinations.
3. **Phase logic** - in possession, out of possession, transition to
   attack, transition to defend, set plays. Light Expert-tier per-phase
   overrides ([[../60-Research/tactics-and-formations]] §6.4).
4. **Roles** - 50 supported across 8 position groups.
5. **Team rules** - mentality, pressing intensity, defensive line,
   width, tempo, build-up style, time-wasting, focus of play (8 total;
   per-tier exposure).
6. **Opponent adaptation** - 3-layer template system (archetypes +
   sub-archetypes + manager-signature) per
   [[../60-Research/tactics-and-formations]] §9.

## 3. Formation catalogue (20 formations)

8 core (Tier-1; available all tiers) + 12 advanced (Tier-2; Quick tier
hidden, AI still uses):

**Core 8**: 4-4-2 Flat / 4-3-3 / 4-2-3-1 / 3-5-2 / 4-1-2-1-2 (Narrow
Diamond) / 5-3-2 / 3-4-3 / 4-5-1.

**Advanced 12**: 4-1-4-1 / 4-2-2-2 (Narrow) / 4-3-2-1 (Christmas Tree)
/ 3-4-1-2 / 3-4-2-1 / 4-2-3-1 Wide / 5-4-1 / 4-1-2-3 / 3-3-3-1 /
5-2-3 / 4-4-2 Asymmetric / 4-3-3 (DM Pivot).

Full table + zone-weight authoring guidance:
[[../60-Research/tactics-and-formations]] §3.

## 4. Role catalogue (50 roles)

| Position | Roles | Total |
|---|---|---:|
| GK | Goalkeeper, Sweeper Keeper, Distributor Keeper | 3 |
| CB | Central Defender, Ball-Playing Defender, Stopper, Libero, Wide CB | 5 |
| FB / WB | Full-Back, Wing-Back, Inverted FB, Complete WB, Defensive FB, Marauding WB | 6 |
| DM | Anchor, BWM-DM, DLP-DM, Half-Back, Regista | 5 |
| CM | Central Mid, Box-to-Box, Mezzala, Carrilero, Roaming Playmaker, AP-CM, DLP-CM | 7 |
| AMC | Attacking Mid, AP-AMC, Shadow Striker, Trequartista, Enganche, WP-AMC | 6 |
| W / IF | Winger, Inside Forward, Inverted Winger, WP-W, Raumdeuter, Defensive Winger, Wide Target Man | 7 |
| ST | Advanced Forward, Poacher, Target Man, Deep-Lying Forward, Pressing Forward, False Nine, Complete Forward, Channel Forward | 8 |
| Cross-position | Libero (back-4 stretch), Regista (CM), Trequartista (ST) | 3 |

**Total = 50 roles**. Each role has default duty + default Player
Instructions; player can override per-player. Per-tier exposure:

- **Quick**: no role UI (locked preset templates).
- **Standard**: top 3 per position (~22 roles visible).
- **Expert**: all 50.

Full list + duty allowances: [[../60-Research/tactics-and-formations]] §4.

## 5. Duties

3 duties globally (Defend / Support / Attack), constrained per role.
Single-duty roles: Anchor, Half-Back (Defend only); Poacher, Shadow
Striker, Raumdeuter, Trequartista (Attack only); Sweeper Keeper,
Distributor Keeper (Support only). Most roles dual-duty; Central
Midfielder + Winger + Inside Forward + Advanced Forward + Target Man
triple-duty.

UI: duty segmented control shows only allowed duties; disabled if
single-duty.

## 6. Player Instructions

18 instructions in 4 groups at Expert tier; 6 high-impact subset at
Standard tier; none at Quick tier.

Standard 6: Width tendency / Run frequency / Press intensity
(individual) / Passing risk (individual) / Shoot frequency / Marking.

Expert groups: Positioning & movement (6) / Ball use (6) / Defensive &
pressing (4) / Set-piece behaviour (2). Full catalogue:
[[../60-Research/tactics-and-formations]] §5.

Defaults derive from role; overrides visibly marked (accent border +
"Changed" tag + inline reset).

## 7. Team Instructions

8 dimensions at Expert; 5 at Standard; 1 (Mentality) at Quick.

| # | Instruction | Tier |
|---:|---|---|
| 1 | Mentality (5 visible bands / 7 internal steps) | Quick + |
| 2 | Pressing Intensity (Low / Med / High) | Standard + |
| 3 | Defensive Line Height (Deep / Normal / High / VeryHigh) | Standard + |
| 4 | Team Width (Narrow / Normal / Wide) | Standard + |
| 5 | Tempo (Slow / Normal / Fast / VeryFast) | Standard + |
| 6 | Build-up Style (Short / Mixed / Direct / Long Ball) | Expert |
| 7 | Time-Wasting (Never / Sometimes / Aggressive) | Expert |
| 8 | Focus of Play (Left / Centre / Right / Mixed) | Expert |

## 8. Traits / Tendencies

Player-owned, slow to acquire (per
[[../60-Research/data-generators]] §10 hidden attribute schema).

Acquired by:

- Year of focus training (Individual Focus block in
  [[training-load-and-medicine]]).
- Mentoring from a senior with the same trait.

Examples: drifts to centre when ball on opposite flank; tries to play
through the lines; shoots from distance under pressure; steps up to
mark tightly; cuts back rather than crossing first time; trades pace
for positioning.

FMX-23 adds a separate draft player skills/perks layer in
[[GD-0020-eos-player-skills-personas-and-people]]. Tactics may consume a locked
`PlayerSkillProfileSnapshot`, but skills/perks are not tendencies: tendencies
change action choice probabilities; skills/perks apply bounded effects only
when their declared trigger fires.

## 9. Attribute scale (RECONCILED with D2)

Per [[../60-Research/data-generators]] §10 (locked schema):

- **16 visible** attributes on **1-20 scale**:
  - 7 Technical: Passing, First Touch, Dribbling, Finishing,
    Crossing, Tackling, Heading
  - 5 Mental: Decisions, Positioning, Vision, Composure, Work Rate
  - 4 Physical: Pace, Strength, Agility, Stamina
- **4 GK-only extras** on 1-20 scale: Reflexes, Handling, Aerial Reach,
  Distribution.
- **8 hidden meta** on 1-20 scale: Potential, Consistency, Pressure,
  Professionalism, Determination, Adaptability, Injury Proneness,
  Big Matches.

**Total: 20 visible + 8 hidden = 28 attributes on 1-20 scale.**

Per-tier display:

- **Quick**: qualitative Impact band and availability warnings for the
  selected tactic / role context; no global OVR or universal star rating.
- **Standard**: Role Impact, Technical / Mental / Physical / GK category bars,
  short-term status icons and access to the 1-20 visible attributes.
- **Expert**: full 1-20 visible attribute grid + Impact formula breakdown +
  scout-report uncertainty bands for 8 hidden attributes.

(Replaces the previous incorrect "10 + 8 + 10 + 5 = 33 on 1-10 scale"
claim from the original draft. The previous schema was authored
before D2 locked the canonical numbers.)

Player strength presentation follows [[../60-Research/player-strength-presentation]]:
the squad and tactic UI rank players by role/tactic context, never by a
context-free Overall.

## 10. Tactical familiarity

Single bar 0-100 per tactic slot. Grows via training + match minutes +
squad continuity (weekly cap 8). Decays 2/week non-use (floor 20).
SwitchModifier penalises non-recent use per match. Penalty curve:
0 → 0.4× shape multiplier; 50 → 0.85×; 80 → 1.0× baseline; 100 →
1.04× mastery reward. ContinuityMatchFactor punishes wholesale
rotation. New-manager Similarity partial carryover.

Tactic slots per tier: 2 / 3 / 3 (Quick / Standard / Expert), plus
saved presets 0 / 10 / 50.

Full formulas + numbers: [[../60-Research/tactics-and-formations]] §6.5.

## 11. Match-day controls

```text
Pre-match: lineup + tactic confirm or auto-coach
Match start: tactic locked unless adjusted
Halftime: 3-tile modal (subs / mentality / one tactical tweak) + "Open Full Editor"
In-match: substitutions, touchline shouts, tactical changes (trigger-based per D4)
```

Halftime modal layout: [[../60-Research/tactics-and-formations]] §7.5.

In-match decisions follow D4's trigger model: HT / 60' / 75' / 85' /
90' + event triggers (goal / red / injury / opponent shape change).

## 12. Touchline shouts (3 universal)

Available at all tiers. 10-min cooldown between shouts (20 min for
All-Out Attack). Max 8 per match.

| Shout | Use case |
|---|---|
| **Encourage** | Morale low / after conceding |
| **Demand More** | Match drifting; better side underperforming |
| **All-Out Attack** | Chasing late goal |

Effects: temporary multipliers on mentality / pressing / tempo /
discipline / energy. Full numbers:
[[../60-Research/tactics-and-formations]] §8.

## 13. UI tiers

| Tier | Tactic UI |
|---|---|
| **Quick** | 5 starter presets + recommended XI + Mentality 5-band + "Recommended Counter" + 3 shouts |
| **Standard** | Tap-to-edit formation + bottom-sheet role picker (top 3 per position) + 6 player instructions + 5 team instructions + 10 saved presets + 3-5 opposition templates + 3 manual opposition instructions + 3 shouts |
| **Expert** | All 20 formations + all 50 roles + long-press drag + 18 player instructions in 4 groups + 8 team instructions + light per-phase overrides + 50 saved presets + community import + full opposition library + sub-archetype + manager-signature view + 3 shouts |

See [[progressive-disclosure-ui]] for the broader pattern.

## 14. Opposition tactics (3-layer template system)

Per gap D3:

- **Layer 1**: 8 archetype templates (vs Deep Block, vs High Press, vs
  Wide Overloads, vs Target Man, vs Playmaker 10, vs Counter-Attacking,
  vs 3-5-2, vs 4-2-3-1). Templates are deltas on base tactic.
- **Layer 2**: ~25-30 sub-archetype variants (3-4 per main archetype)
  with distinct philosophies (e.g. `vs_high_press/direct_bypass`,
  `vs_high_press/playmaker_dribble`, `vs_high_press/wing_bypass`,
  `vs_high_press/draw_and_release`).
- **Layer 3**: manager-signature templates — each of the 10 AI
  manager archetypes from D4 has 1-3 signature templates they favour,
  giving AI managers distinct tactical character.
- **Emergent club character**: clubs accumulate historic counter-
  template usage over their manager history; surfaced in opposition
  analysis as a "tactical fingerprint".

Full design: [[../60-Research/tactics-and-formations]] §9.

## 15. Tactic preset sharing

URL-encoded share codes per ADR-0016:
`TACTIC-<hash>-<base64-LZ-compressed-JSON>`. Local-only at MVP; no
server. Expert tier: import / export + filter by formation / style /
use-case / vs-archetype tags.

## 16. Tactical predictability penalty

Using one tactic > 50 % of matches in a season incurs a small
offensive-effectiveness penalty (up to 5 % max). Counter-templates
cancel half the penalty when applied. Ties to D4's tactical arms
race.

Formula: [[../60-Research/tactics-and-formations]] §11.

## 17. Set-piece routine selection

Per A3 §7 (locked):

- Quick tier: AI auto-picks routines + takers.
- Standard tier: 3 recommended routines per set-piece type + global
  taker priority list.
- Expert tier: full library selection per type + per-routine taker
  assignment.

No set-piece editor at MVP; per-club editor Phase 2 per A3.

## 18. Touch targets + accessibility

Per [[../60-Research/performance-budgets]] (D9):

- Touch targets: 44 × 44 px minimum (positions get 36 px visual +
  invisible padding to 48 px hit area).
- 8 px minimum spacing between adjacent controls; 12 px for grouped
  chips.
- WCAG 2.2 AA / BITV 2.0: screen-reader labels on every pitch position;
  keyboard navigation with arrow-keys + roving tabindex; colour-
  independent role/duty indicators (D/S/A badges + role-family icons).

## 19. Open follow-ups (deferred to later gaps)

- **Per-position familiarity** (e.g. tracking who has played which
  role in this tactic — beyond squad-level familiarity bar). Deferred
  Phase 2.
- **In-match advanced shouts** (Focus / Regroup, Time-Waste,
  Tackle Harder). Deferred Phase 2.
- **Per-club historic-tactic timeline UI** (visualise manager
  succession + tactical evolution). Deferred Phase 2.
- **Tactic AI scout** ("how would the AI grade this tactic against
  this opponent?"). Deferred Phase 2.
