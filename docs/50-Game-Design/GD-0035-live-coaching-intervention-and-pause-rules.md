---
title: GD-0035 Live-Coaching Intervention & Pause Rules
status: accepted
tags: [game-design, gddr, match, watch-party, live-coaching, intervention-buffer, pause-vote, tactics-pause, reputation, anti-grief, multiplayer, fmx-101, fmx-140]
context: [match, watch-party]
created: 2026-06-07
updated: 2026-06-16
type: gddr
binding: false
linear: FMX-101
related:
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[GD-0025-in-match-controls]]
  - [[GD-0002-match-engine]]
  - [[GD-0043-gameplay-calibration-ownership-and-acceptance-gate]]
  - [[watch-party-and-conference]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../60-Research/live-match-intervention-buffer-and-pause-vote-2026-06-07]]
  - [[../60-Research/live-match-pause-ratification-2026-06-16]]
  - [[../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
  - [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]]
---

# GD-0035: Live-Coaching Intervention & Pause Rules

> **Status `accepted`.** The gameplay-design companion to **ADR-0087** (architecture/contracts).
> Authored after Nico chose FMX-101 D1–D4 live (2026-06-07, all = A), then amended by FMX-140
> (2026-06-16) for Design 1 pause semantics, MVP tactics pause, local pause-trust tier and small
> additive Head Coach/host privileges. All numeric magnitudes are **GD-0043
> `match.liveIntervention` calibration** behind `interventionPolicyVersion` /
> `pausePrivilegePolicyVersion` + per-group config — this note pins *shapes, feel and directions*,
> not final values. Cross-linked from `watch-party-and-conference.md §7` and `GD-0025`.

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
  as *one* change, applied atomically), and **one shout**. Numbers → GD-0043
  `match.liveIntervention`.
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

### Tactics pause (FMX-140)

The MVP also includes a **longer tactics pause** as a separate pause kind, not as a larger ordinary
deliberate pause:

- one tactics pause per **managed side** per half;
- no banking into the next half and no stacking with another tactics pause;
- longer than the ordinary deliberate pause, but always under a hard policy ceiling and mandatory
  auto-resume;
- takes effect at the same deterministic pause boundary as ordinary deliberate pause;
- all exact values (duration, cooldown interaction, shared-pause handling when both sides request)
  stay in `match.liveIntervention` calibration.

The tactics pause exists for deep menu work and halftime-like tactical review during active
multiplayer. It is a game-world concession, not a real-football rule: real football gives managers
no timeout, so the game keeps it scarce, visible and auditable.

### Local trust tier and role privileges (FMX-140)

Pause privilege is **local to the group/competition**, never an account-wide social score.
Watch Party owns a `PauseTrustTier` derived from completed sessions, abandon facts, accepted
reports, cooldown history and pause audit. The tier is used only for pause governance.

MVP additive privileges:

- **Head Coach/host**: +1 ordinary deliberate pause per half and one veto override.
- **Trusted tier**: +1 ordinary deliberate pause per half.
- **Restricted/revoked tier**: loses additive privileges for the policy cooldown window.

Privileges are intentionally small. They never bypass platform ceilings for single-pause duration,
total paused time per half, auto-resume, no carry-over or always-on audit. Abuse handling is
audit-gated: abandon/report/cooldown facts drive revocation through `pausePrivilegePolicyVersion`.

While paused, the tactics panel opens for everyone with a clear note that **changes apply after
resume** — the pause is for *coaching*, not a free break. A pause never speeds up or alters the
match itself; active-manager pause suspends the authoritative match at a deterministic safe point,
while spectator replay/pause remains presentation-only (see the determinism note below).

## 3. Default magnitudes (provisional — `match.liveIntervention`, GD-0043)

Indicative starting points to be tuned on a running build; **none are locked from intuition**:

| Knob | Provisional default | Owner / tunable |
|---|---|---|
| Buffer: global cap / point | ~8 | Match policy → `match.liveIntervention` |
| Buffer: subs / tactical pkg / shouts per point | 3 / 1 / 1 | Match policy → `match.liveIntervention` |
| Deliberate pause budget / manager / half | ~2 | per-group + `match.liveIntervention` |
| Deliberate pause: group cap / half | `min(managers×2, 6)` | per-group + `match.liveIntervention` |
| Cooldown between pauses | ~90s in-match | per-group + `match.liveIntervention` |
| Max pause duration (auto-resume) | ~20s (ceiling 60s) | per-group + `match.liveIntervention`; **ceiling fixed** |
| Tactics pause budget | 1 / managed side / half | per-group + `match.liveIntervention`; **no carry-over** |
| Tactics pause duration | longer than ordinary pause; ceiling by policy profile | per-group + `pausePrivilegePolicyVersion`; **auto-resume fixed** |
| Head Coach/host additive privilege | +1 ordinary pause / half + 1 veto override | local group policy; hard platform ceilings still apply |
| Trusted-tier additive privilege | +1 ordinary pause / half | local `PauseTrustTier`; revocable by audit |
| Veto / vote window | ~3s | per-group + `match.liveIntervention` |

## 4. Determinism note (player-invisible, design-critical)

A pause **never** affects the match result. The match engine only knows "running" or "paused" —
it stops advancing while paused and picks up exactly where it left off; it never reads real-world
time. All the budgets, cooldowns and votes live in the watch-party layer, not the engine. That is
why two people watching the same replay always see the same match, regardless of who paused when.
(Architecture + invariants: ADR-0087; restates `match.md §6`.)

## 5. Reserved for later (post-MVP)

- Richer whiteboard/coaching-room tools inside the tactics pause.
- League/admin-specific privilege profiles beyond the small MVP additive model.
- Account-wide reputation is explicitly **not** part of the MVP pause system; reopening it would
  require a new HITL privacy/fairness decision.

## Calibration slot (FMX-141)

- Slot: `match.liveIntervention`
- Parameter pack: `interventionPolicyVersion`
- Harness: T0 exact replay for intervention order/rejection + T1/T2 watch-party
  fairness sweeps in [[../30-Implementation/gameplay-calibration-and-soak-test-runbook]].
- Metrics: buffer caps, typed rejection frequency, pause budget usage, pause
  duration, cooldown, vote/veto windows and grief-risk signals.
