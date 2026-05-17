---
title: Progressive Disclosure for Tactical Depth (Casual + Power-User)
status: in-review
tags: [research, ux, tactics, progressive-disclosure, synthesis, wave-2]
created: 2026-05-16
updated: 2026-05-17
type: research
binding: false
related: [[raw-perplexity/raw-environment-events]], [[player-strength-presentation]], [[../50-Game-Design/progressive-disclosure-ui]], [[../50-Game-Design/tactics-system]]
---

# Progressive Disclosure for Tactical Depth (Casual + Power-User)

The user explicitly wants Football-Manager-grade tactical depth (inverted
full-backs, early-cross suppression, dribbling tendency) *and* a five-
minutes-per-week casual experience in the same product. This note distils
the Perplexity recommendation into a UX pattern and tactical model.

## 1. Product rule

> **One simulation core, three operating tiers.** Match engine + tactics
> system are identical; only what the UI exposes differs.

| Tier | Target user | What they touch |
|---|---|---|
| **Quick** | 5 min/week, "did I win?" | Formation pick, qualitative Impact bands, recommended XI, match-report-lite |
| **Standard** | Casual manager, default | Roles, team focus, basic instructions |
| **Expert** | Tactics / data enthusiast | Role detail, per-player instructions, data hub, deep reports |

This is the Progressive Disclosure pattern from Nielsen Norman / classic UX
literature: rare and complex options are deferred so beginners aren't
overwhelmed, without removing depth for power users.

## 2. Underlying tactical model

All tiers operate on the same model:

`Position + Role + Duty + Player Instructions + Traits / Tendencies`

- **Position**: where the player starts.
- **Role**: core job (e.g. Inverted Full-Back, Target Man, Deep-Lying
  Playmaker).
- **Duty**: defend / support / attack.
- **Player Instructions**: behaviour overrides (cuts inside, early-cross
  never, low-pass risk, dribble more, …).
- **Traits / Tendencies**: long-term player attributes ("drifts to centre",
  "shoots from distance").

Example - inverted full-back:

- Position: right-back.
- Role: Inverted Full-Back.
- Duty: Support.
- Instructions: cut inside, dribble less, never early-cross, seek short
  pass.
- Trait: drifts to centre when the ball is on the opposite flank.

## 3. Casual access surface (Quick tier)

Surface only what is needed in five minutes:

- **Recommended XI** auto-built by assistant from chosen play style.
- **Recommended roles** prefilled with sensible defaults.
- **Qualitative Impact band per player** for the chosen role / tactic context;
  raw 1-20 attributes hidden by default.
- **Match-Report-Lite**: won / lost, top performer, lowest performer, one
  recommended action.
- **What should I do next?** - prioritised daily inbox with Accept /
  Decline / Defer.
- One **Auto-Coach** button that updates training, lineup and tactics
  from current squad state.

## 4. Standard access surface

Adds:

- Per-position role + duty editor.
- Team-style preset switcher (Counter / Gegenpressing / Possession /
  Tiki-Taka / Defensive Block).
- Mentality slider.
- Pressing intensity + trigger.
- Match report (per-player ratings, possession, shots).

## 5. Expert access surface

Adds:

- Full 1-20 visible attribute view and Impact formula breakdown.
- Role detail editor with player instructions overriding role defaults.
- Set-piece routine editor.
- Data hub: zone heat-maps, pass networks, fatigue curves, pressing
  resistance, expected vs actual outputs.
- Deep match report (per-event, per-player, set-piece efficiency, opponent
  spike windows).

## 6. UI rule

- The tier setting lives in **user settings**, not per match.
- Default tier is **Standard**.
- Quick and Expert are **explicit opt-ins**.
- Per-match override is allowed but does not change global preference.

## 7. Match engine implications

The match engine must produce data that supports every tier:

- Per-event log (where, who, what action, outcome).
- Per-player movement / positioning data (for heat-maps).
- Per-zone passing data.
- Set-piece outcomes separately tracked.
- Fatigue per player over time.

The Quick tier *consumes the same data* but presents a 3-line summary +
qualitative Impact guidance; the Expert tier consumes the full event log.

## 8. Implementation note

This pattern interacts with two other systems:

- The **assistant** (Auto-Coach button) needs explicit rules so it doesn't
  silently break a player's tactical choices when they switch from Quick to
  Standard mid-season. Suggested rule: assistant only proposes changes,
  never overwrites manual settings.
- The **save format** ([[../10-Architecture/09-Decisions/ADR-0005-save-format]])
  must store tactical state independently of UI tier so a save can be
  opened by any user / agent at any tier.

## 9. Sources (new URLs)

All retrieved 2026-05-16.

- Nielsen Norman Group on Progressive Disclosure - [nngroup.com progressive-disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- Football Manager role + duty guide - [guidetofm.com tactics roles-duties](https://www.guidetofm.com/tactics/roles-duties/)
- FootballGPT tactics overview - [footballgpt.co topics tactics](https://footballgpt.co/topics/tactics)
- Passion4FM pressing detail - [passion4fm.com pressing in football manager](https://www.passion4fm.com/pressing-in-football-manager/)
- Tactical familiarity discussion (Reddit) - [reddit fmgames tactics building blocks](https://www.reddit.com/r/footballmanagergames/comments/15kvew2/what_formations_roles_and_instructions_can_you/)
- FM26 mobile UI conventions - [footballmanager.com/fm26/features/mobile](https://www.footballmanager.com/fm26/features/mobile)
