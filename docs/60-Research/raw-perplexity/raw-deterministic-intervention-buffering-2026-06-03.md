---
title: "RAW — Buffering real-time input into a deterministic simulation"
status: raw
tags: [research, raw, perplexity, match, determinism, replay, lockstep, fmx-100]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../in-match-controls-and-presentation-2026-06-03]]
---

# RAW Perplexity capture — Deterministic intervention buffering (FMX-100)

> Unprocessed transcript. Synthesised into
> [[../in-match-controls-and-presentation-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar).

## Prompt

System: senior game-engine/simulation architect; precise, technical, cite concrete
techniques (RTS lockstep, fighting games, sports sims, replay systems).

User: given a deterministic event-based football sim (RNG seeded at kickoff; replay
= same seed + same ordered intervention events), how to buffer real-time player
input (subs, tactical/mentality changes, shouts, pause) so it enters the engine
only at well-defined points without breaking replay-safety — covering (1) tick-
aligned/lockstep command queuing, (2) acceptance-window/boundary models (per-tick
vs semantic boundary), (3) pause as replayable command vs operational timer,
(4) on-the-fly tactics snapshot vs live mutation, (5) speed control vs fixed
timestep, (6) rejection/late-command feedback — with a recommended model for a
sports sim with natural stoppage boundaries.

## Response

### 1. Tick-aligned / lockstep command queuing

- Sim runs in **fixed ticks** t = 0,1,2,…. Clients input asynchronously but
  commands are **buffered and tagged with a future execution tick**
  (`execute_at_tick = current_tick + TURN_DELAY`). The authoritative sim advances
  tick n→n+1 only when it has the complete command set for tick n. Same initial
  state + same ordered (tick, player, command) list → deterministic outcome.
- Standard in AoE II / StarCraft-style lockstep (documented in Gaffer-on-Games /
  classic GDC RTS-networking talks). Command-turn length in ticks
  (`COMMAND_TURN = 8`), with `T' = ceil(T/COMMAND_TURN)*COMMAND_TURN +
  TURN_DELAY_OFFSET`. The execution tick is computed purely from **sim time, not
  wall-clock**, so any replay feeding the same (tick, command) schedule reproduces
  the result.
- **Single-player:** no network latency buffer needed, but still use a minimal
  "next tick / next turn" delay so input is never applied mid-tick. Sample
  current sim tick at UI-event time → map intent to a command object → schedule at
  `T_current + 1` (or next command-turn boundary) and append to the deterministic
  stream. Wall-clock/framerate only affect WHEN the intention is generated, not
  WHICH tick it attaches to.

### 2. Acceptance-window / boundary models

- **Per-tick:** process all commands with `execute_at_tick == T` each tick (RTS /
  fighting-game next-frame). Simple, predictable latency; but for football,
  tactical shifts/subs deep in continuous play feel "telepathic".
- **Semantic boundary (sports-style):** football has natural boundaries (ball out,
  fouls/free kicks, kickoff/half-time/full-time, bookings, injuries, subs).
  Commands collected continuously but only **committed at specific semantic
  boundary events** (`DeadBallStart`, `RestartPlay`, `PhaseChange`), each a
  deterministic event; at the boundary, queued commands process in deterministic
  order (timestamp then id) atomically before play resumes. Pros: matches sport
  semantics + user expectation; fewer mid-action transitions; clean atomic
  updates + great auditability ("at event #N, throw-in 42:13, these changes
  applied"). Cons: latency for commands issued during long open play; more complex
  queue semantics.
- **Hybrid (most practical):** accept light commands (shouts, mentality intensity)
  at next tick / short window for responsiveness; apply heavy structural commands
  (formations, roles, subs) only at dead-ball/stoppage boundaries. Both models are
  equally deterministic as long as "UI time → execution boundary" is defined
  purely in sim events/ticks, not wall-clock.

### 3. Player-initiated PAUSE

- Separate deterministic sim state from operational shell. Sim FSM has
  RUNNING/PAUSED; **user pause is NOT in the deterministic event stream** — it's
  purely operational, wall-clock-driven. Replays do not reproduce user pauses;
  they run the engine start→end. Interactive replay controls (pause/rewind/ffwd)
  also sit outside the stream.
- Why pause should be non-replayable single-player: it doesn't affect outcome;
  including it pollutes the log and forces replays to mirror real-time watching.
  Keep replays clean/canonical for audit/debug. Implementation: engine tracks
  `sim_time_tick` (int) + `wall_clock`; `paused` is not serialised and not in the
  stream. Game loop skips `simulate_tick()` while paused; commands created while
  paused get bindings from the current sim tick.

### 4. On-the-fly tactics: snapshot vs live mutation

- **Live mutation:** mutate `currentTactics` in place mid-play. Deterministic if
  same command at same tick, but harder to audit and debug (AI may read partially
  mutated structures if timing isn't careful).
- **Snapshot + boundaries (recommended):** immutable `TacticsConfig` snapshot per
  phase; team holds a `current_snapshot_id`; engine switches snapshots only at
  boundaries. Pipeline: at UI time build a NEW snapshot (copy + changes) and push
  `ApplyTacticSnapshot(team_id, new_snapshot_id)` scheduled to next valid
  boundary; at the boundary atomically swap. Deterministic + auditable: for any
  tick T the tactics state is exactly "snapshot X"; never partially applied. Used
  broadly (fighting games/RTS treat per-frame state as immutable; sports presets
  switch only at stoppages). For strong replay/audit needs, **immutable snapshots
  applied only at boundaries** is cleanest.

### 5. Speed control vs fixed-timestep sim

- **Decouple simulation time from presentation time.** Sim runs at fixed Δt;
  speed control changes **how many sim ticks per wall-clock second** (and render),
  NOT Δt or the event sequence. 1x = ~1 tick/frame; 2x = 2 ticks/frame;
  commentary-only/key-highlights = run headless at max speed and show summaries.
  **Never change Δt by speed** — it would alter physics/AI integration and break
  determinism. Replays can run at any speed (incl. single-step) with no effect on
  the tick sequence or command-application timing.

### 6. Rejection / late-command feedback

- **Always schedule for the next valid boundary (default):** if too late for
  boundary B, schedule for B+1; UI shows "will apply at next stoppage/frame".
- **Strict rejection:** precise window (e.g. subs only during stoppage); too-late
  → deterministic reject + UI feedback ("wait for next stoppage").
- **Soft rejection / auto-adjust:** command bound to "next eligible boundary type"
  rather than a specific instance.
- Robust systems separate **request time from binding time**, expose UI states
  (pending/scheduled/applied/rejected), and log request + actual execution. In a
  deterministic sim, rejection itself must be deterministic (same state + same
  request tick → same decision).

### Recommended concrete model (football, natural stoppages)

1. Fixed-timestep deterministic core (20–60 Hz); seeded RNG in match header; only
   inputs = ordered command events.
2. `Command { id, team_id, type, payload, binding }` where binding is
   `TickBinding{execute_tick}` or `SemanticBinding{semantic: NextDeadBall |
   NextRestart | NextHalfTime | ImmediateNextTick | …}`.
3. Input buffering: at user action read current sim tick + phase; build a Command
   with `ImmediateNextTick` (shouts/simple mentality) or `NextDeadBall`/
   `NextRestart` (heavy tactics/subs); append to a pending queue.
4. Binding & execution per tick: detect semantic transitions → enqueue match
   events; on entering a boundary, bind matching pending semantic commands to
   `current_tick(+1)`; execute tick-bound commands sorted by id (tactics =
   snapshot swap at tick start; subs = swap players/formation); simulate the tick
   from the current snapshot.
5. Tactical state = immutable `TacticsConfig` snapshots; `ChangeTactics` carries a
   new snapshot id resolved at bind time.
6. Pause = operational flag, not a Command; speed = ticks-per-frame multiplier,
   fixed Δt. Commands made while paused bind to current sim tick.
7. Late/illegal commands: per-type minimum binding rule; deterministic reject for
   impossible commands (e.g. subbing a sent-off player); rejections logged
   separately, do not affect sim state.

Result: outcomes purely a function of seed + ordered commands; exact replays with
or without real-time pauses; sport-meaningful change timing with tunable
responsiveness for soft commands; clean auditability.

Citations: model cited general sources [1–9] (academic/journal links); the
authoritative patterns are RTS lockstep (Gaffer-on-Games, GDC RTS networking).
