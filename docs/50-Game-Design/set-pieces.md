---
title: Set Pieces - Corners, Free Kicks, Penalties, Throw-ins
status: draft
tags: [game-design, tactics, set-pieces]
created: 2026-05-16
updated: 2026-05-17
type: game-design
binding: false
related: [[README]], [[tactics-system]], [[match-engine]], [[squad-and-club-structure]], [[../60-Research/tactics-and-formations]]
---

# Set Pieces - Corners, Free Kicks, Penalties, Throw-ins

Set pieces deliver a disproportionate share of goals in real football and
must be a first-class sub-system. The user explicitly wanted "deep tactic
+ shallow casual UX" - set pieces is a great place to demonstrate that.

## 1. Five modules

| Module | Variants |
|---|---|
| Offensive corners | Near-post, far-post, short, mixer, decoy |
| Defensive corners | Zonal, man, hybrid, near-post block |
| Direct free kicks | Direct shot, dummy, lay-off |
| Indirect free kicks | Cross, short, third-man run |
| Long throw-ins | Direct to box, short build-up |
| Penalties | Shooter order, opponent profile bias |
| Second balls | Rest defence, immediate pressure |

## 2. Set-piece editor

The editor for each module exposes:

- **Takers** in priority order.
- **Target zones** (near-post / far-post / centre / edge of box).
- **Runners** with named tasks (block, near-post run, late arrival).
- **Markers** (defensive corners) per opposition profile.
- **Trigger** (when to use this variant).

Variants per module: 3 default + N user-defined.

## 3. Set-piece attributes

| Area | Sample attributes (1-20 canonical scale) |
|---|---|
| **Execution** | Crossing, shot technique, composure, decisions |
| **Target** | Timing, heading, jumping, bravery |
| **Blocker / runner** | Anticipation, balance, aggression |
| **Defensive org** | Concentration, positioning, communication |

A team with strong crossers + headers can be efficient even with weaker
open play. The match engine resolves set-piece events using these
attributes in isolation from open-play attribute math.

## 4. Coaching

A **Set-Piece Coach** (see [[squad-and-club-structure]] §1) multiplies the
training block effectiveness. Without one, set-piece variants take more
weeks to learn.

## 5. Penalty psychology

Penalties have a small psychological layer:

- Composure attribute (shooter).
- Big-match temperament (hidden attribute).
- Crowd context (home / away / neutral).
- Atmosphere ([[fan-ecology]] §3).
- Recent miss memory (per-player).

These combine into a small probability shift. Not a slot-machine - the
attribute math is dominant.

## 6. UI tiers

| Tier | Set-piece UI |
|---|---|
| Quick | Auto-assign takers; "use recommended routines" |
| Standard | Pick from 3 default variants per module, change taker |
| Expert | Full editor (zones, runners, markers, triggers, variant trees) |

## 7. Match engine hooks

The match engine treats every set piece as an isolated mini-scene:

```text
on set_piece_event(type):
  variant = tactic.set_pieces[type].select(context)   # deterministic — see ADR-0067
  outcome = resolve_attribute_math(variant, takers, markers, atmosphere)
  emit_event(outcome)
```

`.select(context)` is a **deterministic, replay-safe pure function** pinned by
[[../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
(proposed, FMX-70): eligible variants are filtered by `Trigger`, ordered
`(priority DESC, variantId ASC)`, and chosen by the module's `selectionMode`
(`priority` default, or opt-in `seeded-mix` drawing from `MatchCoreRng` sub-label
`setpiece:<side>:<type>:<deadBallIndex>`). No hidden engine state; identical on
every replay of the same seed.

Set-piece outcomes are tracked separately in match statistics so the
player can analyse efficiency.

## 8. Future-scope notes (classified future-scope)

- Throw-in routines for non-long-throw clubs - light template; depth Phase 2.
- Substitutes only for set pieces (specialist taker shifts) - in scope
  but expert-only.
- Opposition-specific set-piece pre-match preview - yes, as a brief in the
  match-day report.
