---
title: "RAW — Single-source-of-truth for derived deadlines; additive-vs-mutative resolution (FMX-102)"
status: raw
tags: [research, raw, perplexity, deadlines, ddd, source-of-truth, watch-party, league-week, fmx-102]
created: 2026-06-07
updated: 2026-06-07
type: research
related:
  - [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
---

> Unprocessed Perplexity transcript. Synthesised into
> [[../fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]].
> Do not implement from raw. Captured 2026-06-07 for FMX-102 (gap G25, deadline half).

## Prompt

**System:** You are a senior distributed-systems and domain-driven-design architect. Give precise
patterns with rationale and trade-offs; cite established patterns/sources where possible.

**User:** Design problem: in an async/turn-based multiplayer game, two subsystems compute deadlines
for the SAME match. A 'league-week' state machine opens a matchday on its own cadence timer and emits
a 'MatchdayOpened' event with lock deadlines. Separately, a 'watch party' scheduling feature lets
players pick a broadcast time T and computes deadlines BACKWARDS from it (transfer_lock = T-60min,
lineup_lock = T-30min, setup_lock = T-5min). These two can DISAGREE on the lock times for the same
fixture. This is an 'additive vs mutative' question: when a watch party is scheduled, should the
league-week (A) ADOPT/overwrite its own computed deadlines with the watch-party-derived ones (single
source of truth = broadcast_at), (B) keep BOTH sets (additive), or (C) DEFER the entire matchday
lifecycle to the watch-party FSM for that fixture? Hard constraints: a 'no mid-cycle deadline
mutation' rule (deadlines must not change once the week/cycle is open); single-source-of-truth for
derived values; strictly event-driven with NO cross-service/cross-context joins; replay determinism
where wall-clock must never feed the deterministic engine. Please give best-practice patterns for:
naming a single authoritative source for derived deadlines; resolving precedence at SCHEDULE time
(before the cycle opens) so it is not a mid-cycle mutation; event-carried state transfer to hand the
broadcast_at deadline from the watch-party context to the league context without a join; and
idempotency/replay-safety. Which of A/B/C is the cleanest and why?

## Response

The cleanest model is **C: defer the matchday lifecycle for that fixture to the watch‑party FSM**,
and make the *watch‑party's `broadcast_at`* the single authoritative input from which *all* lock
deadlines are derived in the league context. You then decide **lifecycle type and precedence at
*schedule* time**, before the league week opens, and transfer that decision into the league context
via events (no joins), idempotently and replay-safely.

### 1. Single authoritative source for derived deadlines

Treat deadlines as **derived** from a single **primitive** fact — either `kickoff_at` (league
cadence) or `broadcast_at` (watch-party). Pattern = *Authoritative Fact, Derived Projection*:

```text
MatchTiming {
  lifecycle_mode: enum { LEAGUE_CADENCE, BROADCAST_DRIVEN }
  kickoff_at: Instant?     // authoritative when LEAGUE_CADENCE
  broadcast_at: Instant?   // authoritative when BROADCAST_DRIVEN
}
computeDeadlines(timing) -> Deadlines  // pure, no wall-clock
  // BROADCAST_DRIVEN: transfer_lock = broadcast_at-60m; lineup_lock = -30m; setup_lock = -5m
```

The source of truth is **not** the computed deadlines, but `(lifecycle_mode, anchor_at)` plus the
invariant "deadlines are always recomputable from that pair." Name it `MatchTiming.anchor_at` with a
discriminator `anchor_type ∈ {KICKOFF, BROADCAST}` — making explicit that exactly one anchor is
authoritative and downstream deadlines are projections.

### 2. Resolving precedence at *schedule* time (no mid-cycle mutation)

Each fixture gets a **MatchLifecycleMode** decided once, then immutable:
- Created with an attached watch-party / "broadcast-required" flag → `BROADCAST_DRIVEN`; else
  `LEAGUE_CADENCE`. After **league week open**, the mode is immutable.

Enforce via aggregate invariants: `lifecycle_mode` and `anchor_at` set exactly once **before**
`cycle_opened_at`; once `cycle_opened_at` is set, no changes to mode or anchor; deadlines recomputed
only while `cycle_opened_at == null`. All deadline computation is effectively **pre-cycle**.

### 3. Event-carried state transfer (no joins)

Watch-party publishes self-contained events:

```text
WatchPartyScheduled { watch_party_id, match_id, broadcast_at, league_week_id?, ... }
WatchPartyRescheduled { watch_party_id, match_id, old_broadcast_at, new_broadcast_at }
```

League subscriber/process manager loads the Match aggregate and applies:

```text
applyWatchPartyScheduled(broadcast_at):
  require lifecycle_mode == BROADCAST_DRIVEN ; require cycle_opened_at == null
  timing = MatchTiming(BROADCAST_DRIVEN, broadcast_at=broadcast_at)
  deadlines = computeDeadlines(timing) ; raise MatchDeadlinesUpdated(match_id, deadlines)
applyWatchPartyRescheduled(new): require cycle_opened_at == null  // enforces no mid-cycle mutation
```

Classic event-carried state transfer: events carry all needed fields; consumers avoid joins.

### 4. Idempotency & replay safety

Handlers idempotent under replay; invariant forbids changing timing after `cycle_opened_at`, so
re-applying the log recomputes identical deadlines. Versioned aggregates; pure handlers; projections
deduped by `(event_stream_id, event_sequence)`. No `now()` in domain logic — `broadcast_at` is an
explicit event timestamp; deadline derivation is pure arithmetic. Same stream → same deadlines.

### 5. A vs B vs C

- **A (adopt/overwrite):** if the override happens after open it violates "no mid-cycle mutation"; if
  restricted to pre-open you have two competing bases and must pick one per fixture — which is
  **C under a different name**. "A is just C without naming the mode explicitly, which makes reasoning
  harder." Works only as "before open, if a watch party exists, recompute from broadcast_at and
  discard league-derived deadlines" — i.e. C hidden.
- **B (additive, both sets):** breaks single-source-of-truth; every consumer (UI, validation,
  settlement) needs precedence logic; ambiguity and bugs; worst fit. Only justified if both sets are
  needed for analytics — and then one is authoritative, the other informational/deprecated.
- **C (defer lifecycle for the fixture):** for BROADCAST_DRIVEN fixtures the watch-party FSM is
  authority for `broadcast_at`; the league FSM still owns lifecycle state (week open, lock
  enforcement) but **derives** deadlines from `broadcast_at`. No mid-cycle mutation; single source of
  truth; strictly event-driven; replay-deterministic. Requires one extra concept — **MatchLifecycleMode**
  per fixture — which is exactly what resolves "additive vs mutative" principledly.

### 6. Concrete pattern summary

Add `MatchLifecycleMode` + `MatchTiming{anchor_type, anchor_at}` to the Match aggregate; deadlines
derived not primary. Decide mode at schedule/creation; broadcast-driven fixtures require a broadcast
slot before the week can open. Watch-party publishes `WatchPartyScheduled/Rescheduled(match_id,
broadcast_at)`; league consumes, sets timing, recomputes deadlines (rejecting changes after open).
`MatchdayOpened` emitted by league when it opens; mode + anchor must already be set; later
scheduling/rescheduling rejected at the domain boundary. All computation pure; aggregates rebuilt from
streams → identical deadlines. **C is cleanest** — formally "C with an explicit lifecycle-mode flag
and event-carried timing."

Citations:
[1] https://www.ardent-tool.com/tech/Async_Challenge_EDN_V33_N12.pdf
[2] https://cs.colby.edu/courses/F19/cs232-labs/labs/lab03/assignment.php
[4] https://etd.auburn.edu/bitstream/handle/10415/8816/A_Multiplayer_Adversarial_Environment_for_AI_Agents.pdf
[6] https://boards.straightdope.com/t/asynchronous-multiplayer-games/619559
