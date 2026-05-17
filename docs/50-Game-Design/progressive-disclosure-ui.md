---
title: Progressive Disclosure UI - Three Tier Model (Quick / Standard / Expert)
status: approved
tags: [game-design, ux, progressive-disclosure, tactics, casual, expert]
created: 2026-05-16
updated: 2026-05-16
type: game-design
binding: true
related: [[README]], [[../60-Research/progressive-disclosure-research]], [[../60-Research/tactics-and-formations]], [[../60-Research/onboarding-strategy]], [[tactics-system]], [[onboarding-and-tutorial]], [[match-engine]]
---

# Progressive Disclosure UI - Three Tier Model (Quick / Standard / Expert)

The user explicitly wanted Football-Manager-grade tactical depth *and* a
five-minutes-per-week casual session in the same product. The answer is
**one simulation core, three operating tiers**. Approved at the product
level.

## 1. Approved product rule

> **The game ships exactly three UI tiers: Quick, Standard, Expert. They
> share the same simulation core and the same data model. Only what is
> *surfaced* differs. The tier is a user setting (default Standard);
> Quick and Expert are explicit opt-ins.**

## 2. Tier targets

| Tier | Target user | Session length |
|---|---|---|
| **Quick** | "Did I win?" | ≤ 5 min / week |
| **Standard** | Default manager player | 10-15 min / week |
| **Expert** | Tactics + data enthusiast | 25+ min / week |

The tier setting is global (per user profile) but a per-match override is
allowed without changing the global preference.

## 3. What each tier shows (by area)

| Area | Quick | Standard | Expert |
|---|---|---|---|
| Player view | Star rating (1-5) | Star + role-fit % + 3 trend arrows | Full 1-10 attribute grid (toggleable 1-20) |
| Tactic | Preset + auto-pick | Roles + duties + mentality slider + pressing | Full Position+Role+Duty+Instructions+Traits editor |
| Set pieces | Auto | 3 default variants | Full editor |
| Training | Auto-coach toggle | Block grid + intensity slider | Per-player schedule + load forecast |
| Scouting | "Top 3 recommended" | Short list + scout reports | Long list + heat map + coverage map |
| Transfers | Inbox card with Accept / Reject | Side panel with counter wizard | Full clause editor, agent pressure meter |
| Finance | Bank health badge + 3 cards | 8 KPI summary | Full P&L + cash-flow projection |
| Stadium | Build wizard with 1-3 next upgrades | Tile map + module list | SimCity grid + plot pricing + queueing |
| Fans | Mood badge + 1 event card | 6 segment bar chart with trends | Per-segment forecast + drivers |
| Match | Text ticker + final stats | Text + 2D + halftime + ratings | Full 2D + heat-maps + pass network + event log |
| Reports | Match-Report-Lite | Per-player ratings | Per-event log + analytics |

## 4. Auto-Coach (Quick + Standard helper)

A single button "Auto-Coach" that proposes:

- Best XI for chosen play style.
- Roles + duties.
- Set-piece takers.
- Training plan.

The Auto-Coach **proposes only** - it never overwrites manual choices.
This guarantee is critical: a player switching tiers mid-season must not
have their tactical work silently overwritten.

## 5. Daily prompt list

At each day tick the UI prompts:

- **Quick**: 1 prioritised action ("Accept sponsor offer?").
- **Standard**: 3 prioritised actions + 2 deferrable.
- **Expert**: full inbox + all open decisions.

Default action across tiers: Accept / Decline / Defer / Snooze.

## 6. Reports

Match reports adapt:

- **Quick**: 3 lines (won/lost, top performer, low performer) + one
  recommended action.
- **Standard**: Per-player ratings, key events, possession + shots
  overview.
- **Expert**: Per-event log, per-player heat map, pass network, set-piece
  efficiency, fatigue curves, opponent spike windows.

All tiers consume the *same event log* from
[[match-engine]] §5.

## 7. Tier switching

The user can change tier at any time in user settings:

- Tier change preserves all underlying state.
- Manual tactic choices remain (Auto-Coach proposes but doesn't overwrite).
- Save game does not embed the tier (it's a UI choice).

## 8. Onboarding

The first-run onboarding (per [[../60-Research/research-wave-2-gaps]]
R2-05) asks one question: "How deep do you want to manage?" with three
illustrated options. The user can change it later.

## 9. Engineering implications

- The match engine produces the **full event log** regardless of tier.
  The tier determines presentation only.
- The data model exposes every attribute; UI components select per tier.
- Tier-specific UI is implemented as variant components, not separate
  routes.
- The Save format is tier-agnostic (per
  [[../10-Architecture/09-Decisions/ADR-0005-save-format]]).

## 10. Open questions

- Per-area tier override (e.g. Quick everywhere except Tactics where I
  want Expert) - in scope at Standard tier as a power-user toggle. UI cost
  acceptable.
- Tutorial copy per tier - yes; three tone variants per topic.
- A11y tier alignment - all tiers must meet WCAG 2.2 AA;
  see [[../60-Research/research-wave-2-gaps]] R2-07.
