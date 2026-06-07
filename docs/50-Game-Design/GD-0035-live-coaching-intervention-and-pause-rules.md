---
title: GD-0035 Live-Coaching Intervention & Pause Rules
status: draft
tags: [game-design, gddr, match, watch-party, live-coaching, intervention-buffer, pause-vote, anti-grief, multiplayer, fmx-101]
created: 2026-06-07
updated: 2026-06-07
type: gddr
binding: false
linear: FMX-101
related:
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[GD-0025-in-match-controls]]
  - [[GD-0002-match-engine]]
  - [[watch-party-and-conference]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../60-Research/live-match-intervention-buffer-and-pause-vote-2026-06-07]]
---

# GD-0035: Live-Coaching Intervention & Pause Rules

> **Status `draft`.** The gameplay-design companion to **ADR-0087** (architecture/contracts).
> Authored after Nico chose FMX-101 D1–D4 live (2026-06-07, all = A). All numeric magnitudes are
> **FMX-52 calibration** behind `interventionPolicyVersion` / a pause-policy version + per-group
> config — this note pins *shapes, feel and directions*, not final values. Cross-linked from
> `watch-party-and-conference.md §7` and `GD-0025`.

## Why this exists

Live coaching is the emotional core of a watched match, but it has two abuse holes (gap **G24**):
a manager can **flood** instructions at one stoppage (spam / unfair edge / unreadable match), and
in a multiplayer **watch party** a manager can **deliberately pause** to stall or grief. GD-0025 +
ADR-0072 settled the control *kit* and *when* changes apply; FMX-101 adds the **rules of fair
use**: how many changes land at once, what happens when one can't, and how a shared pause is
governed. The genre + real-sport lesson: bound deliberate stoppages with **small budgets, short
hard caps, auto-resume and clear attribution** (CS tactical timeouts, NBA/NFL timeouts), and keep
intervention timing **sport-meaningful** (changes at natural breaks), never telepathic.

## 1. Intervention buffer — how changes land (D1, D2)

Interventions still bind exactly as GD-0025/ADR-0072 say: **light** commands (shout, mentality
preset) apply on the next tick; **heavy** commands (sub, formation swap, tactic change) apply at
the next natural break (dead ball / restart / half-time) via an atomic `TacticSnapshot` swap. What
FMX-101 adds is the **bounding** at each of those acceptance points:

- **Caps per acceptance point** (D1): at most a few changes land at one break — a global cap (~8)
  plus per-type caps: **up to 3 substitutions** (the real "triple change"), **one tactical
  package** (a single confirm can bundle formation + roles + mentality + instructions — it counts
  as *one* change, applied atomically), and **one shout**. Numbers → FMX-52.
- **Last word wins**: if you change your mind before the break, the **latest** tactical package and
  the **latest** shout are the ones that apply; earlier ones are quietly *superseded*. Two subs for
  the same player → the first is kept, the second is rejected as a duplicate.
- **Deterministic order**: when several changes land together, they apply in a fixed, replay-stable
  order — the player never sees a different result on a re-watch.

### When a change can't apply (D2) — the feedback the player sees

Every blocked change gives an immediate, honest reason (a concise toast for all tiers; the Expert
tier shows the full reason). The categories:

| Reason | Player-facing message (indicative) | When |
|---|---|---|
| **Buffer full** | "Too many changes for this stoppage — try again at the next break." | per-point cap hit |
| **Window closed** | "You can't make that change now." | e.g. subs after the final whistle / all windows used; shout during live play if windows-only |
| **Duplicate / superseded** | "Already scheduled" / "Replaced by your later instruction." | conflicting/repeated change |
| **Illegal** | "No substitutions remaining." / "That would leave too few players." | breaks a rule (IFAB / squad) |
| **Not executed in time** | "Your substitution didn't make it before full time." | accepted but no break occurred before match end |

Overflow **rejects** (it does not silently wait) so the player always knows where they stand. (The
ordinary case — a *legal* change that simply waits for the next break — still shows the GD-0025
`pending → scheduled → applied` states; rejection is only the can't-happen path.)

IFAB stays the boss of substitutions: max subs + windows come from competition rules, and the
buffer cap never lets you exceed them.

## 2. Deliberate pause in a watch party (D3, D4)

Real football gives managers **no** timeout — only the referee stops play. A watch party invents a
trusted "digital referee", so it must feel fair to everyone. This deliberate pause is **separate**
from the existing automatic *disconnect* pause (which stays free, longer, and budget-less — see
`watch-party.md §5.1`).

**Who can pause (D3 — hybrid by group size):**

- **Two managers** → either can ask to pause; a **3-second veto window** appears ("[Name] wants to
  pause — hold to veto"). No veto → it pauses and spends the requester's credit. Vetoed → no pause,
  no credit spent.
- **Three or more** → a quick **majority vote** (need at least half, including the requester)
  inside a 3-second window. No majority → no pause, no credit spent.
- **Resuming** → any manager can ask to resume; a 3-second "Resuming…" countdown plays, during
  which one other manager may **re-pause once** (spending their own credit). Otherwise it resumes
  and the cooldown starts.

**How much pausing you get (D4 — discrete budget):** each active manager gets a **small number of
pauses per half** (default ~2), there's a **group cap per half**, a **cooldown** between pauses,
and each pause has a **short max duration with automatic resume**. It reads like a basketball
timeout count — "Pause 1/2 this half" — so everyone can see what's left.

**Always-on, non-negotiable guardrails** (not configurable by any group): a pause auto-resumes at
its cap (no "paused until I say so"); a hard ceiling on single-pause length (≤60s) and on total
paused time per half; unused pauses **don't carry** into the second half; and **every** pause,
resume and blocked request is logged with who did it (for the end-of-half summary and abuse
reports).

**Group-configurable knobs** (lobby settings, within platform ceilings): pauses per manager per
half, group cap per half, cooldown, max pause duration, the consent mode, and who may pause
(anyone / host / host + co-hosts). Friends can run it loose; open lobbies can harden it.

While paused, the tactics panel opens for everyone with a clear note that **changes apply after
resume** — the pause is for *coaching*, not a free break. A pause never speeds up or alters the
match itself; it only suspends the shared view (see the determinism note below).

## 3. Default magnitudes (provisional — FMX-52)

Indicative starting points to be tuned on a running build; **none are locked from intuition**:

| Knob | Provisional default | Owner / tunable |
|---|---|---|
| Buffer: global cap / point | ~8 | Match policy → FMX-52 |
| Buffer: subs / tactical pkg / shouts per point | 3 / 1 / 1 | Match policy → FMX-52 |
| Deliberate pause budget / manager / half | ~2 | per-group + FMX-52 |
| Deliberate pause: group cap / half | `min(managers×2, 6)` | per-group + FMX-52 |
| Cooldown between pauses | ~90s in-match | per-group + FMX-52 |
| Max pause duration (auto-resume) | ~20s (ceiling 60s) | per-group + FMX-52; **ceiling fixed** |
| Veto / vote window | ~3s | per-group + FMX-52 |

## 4. Determinism note (player-invisible, design-critical)

A pause **never** affects the match result. The match engine only knows "running" or "paused" —
it stops advancing while paused and picks up exactly where it left off; it never reads real-world
time. All the budgets, cooldowns and votes live in the watch-party layer, not the engine. That is
why two people watching the same replay always see the same match, regardless of who paused when.
(Architecture + invariants: ADR-0087; restates `match.md §6`.)

## 5. Reserved for later (post-MVP)

- A separate longer "tactics pause" type (one per half) for deep menu work.
- Reputation-sensitive guardrails (habitual pausers get longer personal cooldowns).
- A designated "Head Coach" role with +1 pause and a single veto-override per half (a coach's-
  challenge analogue).
