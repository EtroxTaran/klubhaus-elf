---
title: "RAW — Staged player-unhappiness/transfer-request models in management games (FMX-102)"
status: raw
tags: [research, raw, perplexity, transfer, escalation, games, prior-art, fmx-102]
created: 2026-06-07
updated: 2026-06-07
type: research
related:
  - [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
---

> Unprocessed Perplexity transcript. Synthesised into
> [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]].
> Do not implement from raw. Captured 2026-06-07 for FMX-102 (gap G25, escalation half).

## Prompt

**System:** You are a game-design researcher specializing in football/sports management simulation
games. Give concrete, mechanism-level detail about how shipped games model these systems. Cite
versions/sources where possible.

**User:** How do football/sports management games model escalating player unhappiness and
transfer-request pressure as a STAGED system? Cover Football Manager (player happiness/morale,
promises and broken promises, 'wants to leave', formally requesting a transfer / handing in a
request, dressing-room/squad unrest, transfer-listed, asking-to-leave interactions), EA Sports FC /
FIFA Career Mode (player unsettled, transfer request, morale), OOTP Baseball (trade demands, player
morale, no-trade), and Football Chairman. For EACH game: what are the discrete stages of
unhappiness/escalation, what thresholds or counters advance a player between stages (e.g. number of
ignored complaints, time, broken promises), does unhappiness DECAY / cool off over time and how
(does playing time or a new contract reverse it), and is the stage progression deterministic or
partly random? I am designing a DETERMINISTIC, replay-safe staged escalation finite state machine
for a transfer system, so call out which mechanisms are tunable thresholds vs random rolls.

## Response

You can think of all four games as implementing a finite‑state machine with discrete **stages**
(content → mildly unhappy → wants to leave → formal demand / transfer‑listed), **counters/thresholds**
that push a player up one step (ignored complaints, time without resolution, broken promises, bad
results), **decay rules** that let them step down (time, wins, game time, new contract), and a mix of
**deterministic triggers** and **probabilistic flavor** layered on top.

### Football Manager (FM23/24)

**Stages:** Content/Happy → Concern/Slightly Unhappy → Unhappy with a specific issue → "Wants to
leave"/public agitation → Formal transfer request / asking to leave → Transfer‑listed/"set for
departure." At squad level, accumulation feeds **dressing-room unrest** and **leader‑propagated
discontent**.

**Threshold/counter drivers (mostly deterministic):**
- **Playing time vs agreed squad status** (Key/Important/Regular/Squad/Fringe/Backup): hidden
  minutes ratio below threshold for a minimum period → concern → escalation if ignored.
- **Promises** (playing time, contract, transfer): each has a **deadline/evaluation point** and a
  numeric success/failure condition; a **broken promise** reliably jumps at least one stage and can
  cause dressing-room unrest. "Breaking promises destroys morale."
- **Blocked transfer / rejecting bids:** behaves like a broken implicit promise; can jump to "wants
  to leave"/request.
- **Club performance/ambition:** failing promised competitions can escalate many players at once.
- **Ignored complaint time:** unresolved concerns within a few months almost always escalate.

**Decay/cool-off:** direct repairs (more minutes, new contract, fulfilled promise, sale/loan agreed
freezes complaints, selling the agitator) + passive decay once the underlying cause is removed.

**Deterministic vs random:** transitions mostly threshold-driven on minutes/promises/results;
randomness is mainly in *whether/when* a player escalates and dialogue outcomes, **trait-modulated**
(ambition, professionalism, loyalty). For a replay-safe FSM, make transitions purely threshold-based
and use **traits as different thresholds, not RNG**.

### EA Sports FC / FIFA Career Mode

**Stages:** Content/Neutral → Unsettled/wants to discuss role or contract → Unhappy/Wants to leave →
Transfer request. No real team-unrest mechanic; mostly individual.

**Drivers (deterministic condition checks weekly):** playing time vs role (Crucial/Important/Rotation/
Sporadic); ignored complaint + continued non-selection; contract dissatisfaction; team performance.
"If you keep ignoring a first-team player, they *will* eventually ask out." No obvious RNG on whether
escalation happens.

**Decay:** start them regularly / new contract / transfer granted → grievances clear; little slow
passive decay while the cause remains.

### OOTP Baseball

**Stages:** Normal/Happy → Unhappy about a specific issue (role/salary/team performance) → "Demands
trade" → no-trade-clause resistance (separate dimension).

**Drivers:** team performance & market size; role vs expectation; contract dissatisfaction; ignored
complaints over time. Largely deterministic with thresholds on duration + magnitude; **personality
strongly modulates tolerance** (loyalty vs greed/ambition).

**Decay:** winning improves morale; role adjustments fix role unhappiness; renegotiation clears
salary unhappiness; passive decay once the dissatisfaction is no longer valid. Suggests multi-year
rolling counters.

### Football Chairman

**Stages:** Content → Interested in move/unsettled → Wants to leave → Transfer-listed/for sale.
Event-driven (bigger-club bid, rejected bids, club performance), with **RNG on top** (first big bid
doesn't always cause a demand; probability by stature gap + importance). For full determinism, drop
the random layer: "After N rejected bids from a significantly bigger club, the player always jumps to
'wants to leave.'"

### Design takeaways for a deterministic, replay-safe staged FSM

**Unified stage ladder:** Content → Concerned → Unhappy → Wants to leave → Formal request →
Committed to leaving.

**Tunable deterministic counters:** playing-time deficit counter (ratio over last M matches with
T/K thresholds per stage); broken-promises counter; ignored-complaint time (days_since_complaint
with D1/D2 escalation points); club-performance deficit (moving window); bid-rejection count +
stature gap (N rejections → "wants to leave"); role mismatch persistence.

**Deterministic decay/cool-off:** underlying cause corrected (ratio back above threshold, new
contract, performance back above expectation) + time-since-resolution; track `days_in_state`, start a
**cool-off countdown** when the cause is resolved, step down a stage after `COOL_OFF[state]`.

**Replace RNG with trait-based thresholds:**

| Trait | Effect on thresholds |
|---|---|
| High ambition | Lower K/D/N; escalates faster |
| High loyalty | Higher K/D/N; escalates slower |
| High professionalism | Slower performance penalty; maybe never reaches Formal |
| High greed | Lower tolerance for salary/contract mismatch |
| Low temperament | Direct jump Unhappy → Formal on a broken promise |

Citations:
[1] https://www.youtube.com/watch?v=rpE5TFRMVCg
[2] https://www.youtube.com/watch?v=nUl0VUox0aA
[3] https://footballgpt.co/fm/fm-morale
[4] https://steamcommunity.com/app/2252570/discussions/0/5715692378855527354/
[5] https://www.fmrte.com/forums/topic/7956-keeping-squad-players-happy/
[6] https://www.passion4fm.com/how-to-improve-players-morale-happiness-in-football-manager/
