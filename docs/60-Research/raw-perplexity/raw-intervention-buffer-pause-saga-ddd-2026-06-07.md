---
title: "Raw — DDD: intervention-buffer value object vs pause-vote saga, determinism boundary (FMX-101)"
status: raw
tags: [research, raw, perplexity, ddd, event-sourcing, saga, process-manager, value-object, determinism, watch-party, match, fmx-101]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-101
related:
  - [[../live-match-intervention-buffer-and-pause-vote-2026-06-07]]
---

# Raw capture — DDD modelling of buffer policy + pause-vote saga (Perplexity, 2026-06-07)

Verbatim-faithful capture of the Perplexity strand on DDD/event-sourcing modelling: a
Match-owned `InterventionBufferPolicy` value object + replay-safe rejection events, vs a
Watch-Party-owned pause-vote process manager/saga, and how the two contexts coordinate
without injecting wall-clock into the seeded engine. Synthesis in
[[../live-match-intervention-buffer-and-pause-vote-2026-06-07]].

## Prompt (summary)

Deterministic event-sourced Match BC (seeded RNG; replay = same seed + same ordered
intervention events; wall-clock never in the seeded stream) + separate Watch Party BC
(synchronous multiplayer coaching). Contexts talk only via commands/queries/events, no
cross-context joins. Design (A) a Match-owned `InterventionBufferPolicy` — value object in
the Match aggregate (max-buffer-size, per-point acceptance window, deterministic ordering/
tie-break, rejection rules) + replay-safe `InterventionRejected`; (B) a Watch-Party-owned
pause-vote as a process manager/saga (voteOpen→enacted→resumed) distinct from auto
disconnect-pause, holding wall-clock budgets/cooldowns/quorum while keeping Match
wall-clock-free. Questions: (1) where abuse-protection lives so it never pollutes the
engine; (2) how a watch-party pause shifts the next deterministic acceptance point without
wall-clock; (3) ownership of a shared "live coaching rules" matrix between contexts without
coupling; (4) per-period (per-half) budget/quorum tracking in a saga. Give modelling
recommendations, event/command shapes, determinism invariants.

## Answer (verbatim)

You are on the right track with the separation of a deterministic **Match** core and a wall-clock-aware **Watch Party** / coordination layer. The high-level answer:

- Keep **all wall-clock, abuse-protection, budgets, cooldowns, quorum, UX-driven rules, and "who is allowed to send which interventions when" entirely outside the Match context** (Watch-Party side, in a process manager / saga).
- The **Match** owns only **deterministic acceptance rules over an already-filtered stream of interventions**, expressed as a value object like `InterventionBufferPolicy`.
- A watch-party pause does **not** enter the seeded random stream or Match's concept of time; it only changes *whether/when commands are sent* to Match and possibly how many simulation "ticks" you advance before accepting the next intervention.
- Shared "live coaching rules" become **configuration read-models / policies** consumed by *both* contexts, with **ownership** in the context that has the business authority to change them (usually Watch-Party / Competition Rules), while Match only sees the subset it needs as simple parameters.
- Per-period budgets/quorums sit in a **watch-party process manager** with explicit state, counters, and wall-clock timestamps; Match never sees those.

### A. Match-owned InterventionBufferPolicy as a value object

Model intervention handling as **purely deterministic business rules on an ordered stream of intervention intents**. Aggregate root `Match`; value object `InterventionBufferPolicy`.

`InterventionBufferPolicy` responsibilities — **static parameters** (immutable per match): `maxBufferSize`, `acceptanceWindow` (how many sim steps / decision points into the future you may target), deterministic **ordering/tie-break** rules (sequence number, role priority, then a client-local tie-breaker), deterministic **rejection rules** (too late / too early / buffer full / conflicting). **Deterministic operation**: no wall-clock, no external calls; uses only the deterministic sim tick / decision-point index, seeded RNG (if any, in a well-defined order), and command-payload + aggregate state.

Recommended shape (Match BC, domain layer):

```
class Match : AggregateRoot {
  MatchId id; MatchConfig config;
  InterventionBufferPolicy policy;      // value object
  List<PlannedIntervention> buffer;     // accepted-but-not-yet-applied inputs

  void proposeIntervention(ProposeIntervention cmd) {
    var result = policy.evaluate(buffer, cmd, currentDecisionPoint());
    switch (result) {
      case Accepted a: apply(new InterventionAccepted(matchId:id, decisionPoint:a.decisionPoint, orderingKey:a.orderingKey, ...)); break;
      case Rejected r: apply(new InterventionRejected(matchId:id, reason:r.reason, interventionId:cmd.interventionId, decisionPoint:r.decisionPoint)); break;
    }
  }
  void on(InterventionAccepted e) { buffer.add(new PlannedIntervention(e.interventionId, e.decisionPoint, e.orderingKey, e.payload)); /* sort by (decisionPoint, orderingKey) deterministically */ }
  void on(InterventionRejected e) { /* no state effect; maybe a "seen" table for idempotency */ }
}

class InterventionBufferPolicy {   // immutable VO
  int maxBufferSize; int maxInterventionsPerDecisionPoint;
  DecisionPointWindow window; TieBreakRule tieBreakRule;
  EvaluationResult evaluate(List<PlannedIntervention> buffer, ProposeIntervention cmd, DecisionPoint currentPoint);
}
```

The VO holds *parameters*; the buffer + current decision point live in the aggregate. The VO is immutable within a match; if rules can change mid-match, emit `InterventionPolicyChanged` as part of the same event stream (safe for determinism).

**Deterministic `InterventionRejected`:** rejection must depend **only** on prior event history (current buffer/decision point/policy), the *content* of the command, and deterministic functions — no wall-clock, no environment state. On replay, re-submit the same commands in the same order → same events in the same positions. Make rejection a first-class domain event:

```
event InterventionRejected {
  MatchId matchId; InterventionId interventionId;  // caller-provided
  string reasonCode;                                // "TooLate","BufferFull","Conflict",...
  DecisionPoint requestedDecisionPoint; DecisionPoint currentDecisionPoint;
  int bufferSizeAtDecision;
}
```

Use an explicit caller-provided `InterventionId` (idempotency + stable replay IDs). Keep ordering stable via a deterministic `orderingKey = (coachRolePriority, clientSequenceNumber)`. Never include wall-clock in events; if you want real-time recorded, log it **outside** the event-sourced stream (operational log / non-deterministic projection).

> **Invariant 1:** for a given `(seed, ordered list of commands with complete payloads)` the sequence of domain events `(InterventionAccepted | InterventionRejected | …)` is identical byte-for-byte on every replay.

### B. Watch-Party pause-vote as process manager / saga

Treat pause voting + abuse protection as a **Watch-Party-owned process manager** that listens to user actions (`PauseVoteCast`, `PauseVoteRetracted`, `UserDisconnected/Reconnected`) and match-timeline events (`MatchHalfStarted/Ended`, `MatchPaused/Resumed`), applies wall-clock + group-config rules, and decides when to send commands into Match (`PauseMatch`, `ResumeMatch`, `ProposeIntervention`). The existing auto disconnect-pause is another process — either integrate into the same FSM (separate triggers/guards) or keep **two separate processes** that both emit `PauseMatch`; Match stays ignorant of who asked. Lean toward two separate processes; Watch Party coordinates them.

**Q1 — Where abuse-protection lives:** entirely in Watch Party. Match only knows "can I accept this intervention at this decision point given my local policy + buffer?" and "is the match paused/running?"; it never sees spam detection, budgets, or elapsed wall-clock. Watch Party process managers (`PauseVoteProcess`, `AutoDisconnectPauseProcess`, optionally `AbuseProtectionProcess`) track wall-clock per user/party/period, counters (interventions/pauses used), cooldowns ("next allowed pause at T"), and quorum/majority. Commands Watch-Party → Match: `PauseMatch{matchId, reason}` / `ResumeMatch{matchId, reason}`. Events Match → Watch-Party: `MatchPaused{matchId, reason, [deterministic pause point]}` / `MatchResumed{matchId, reason}`. The saga uses `MatchPaused` to start wall-clock billing and stops on `MatchResumed`. **Determinism invariant:** Match state/replay depend only on the **order** of `PauseMatch`/`ResumeMatch`/intervention commands, not wall-clock; wall-clock only influences whether/when those commands are sent (outside the deterministic context).

**Q2 — How a pause shifts the next acceptance point without wall-clock:** keep "time" in Match as **simulation time / decision points**, not wall-clock. Two designs:
- *Design 1 — pause = stop advancing the simulation.* Match has internal `isPaused` driven only by `PauseMatch`/`ResumeMatch`; while paused the sim stops advancing ticks (or ticks in a no-progress mode consuming no inputs). The next decision point **doesn't move**; the game is frozen until resume. Simplest for determinism: pause is just another input into the deterministic FSM; on replay you send `PauseMatch`/`ResumeMatch` at the same positions.
- *Design 2 — simulation continues server-side; pause is presentation/streaming only.* Match ticks invisibly; Watch Party stops forwarding state + restricts commands; on unpause, send a catch-up snapshot. Match doesn't even know a pause occurred (like video pause while the live feed continues).
- Given the emphasis on deterministic interventions with known acceptance windows, **Design 1** fits: the match knows it is paused and interventions aren't processed while paused.
- Coordination either way: Watch Party decides (saga + wall-clock) → emits `PauseMatch` command → Match deterministically emits `MatchPaused` → saga sets state Paused + starts timing → during pause, saga denies/buffers interventions per live-coaching rules → on conditions met (budget/players/time) saga emits `ResumeMatch` → Match emits `MatchResumed` → saga stops timing + debits budget. **Invariant 2:** Match's accept/reject decision depends only on the sequence of deterministic commands/events (incl. `MatchPaused/Resumed`), not real-time intervals between them.

**Q3 — Ownership of the shared "live coaching rules" matrix** (rows: `pauseAllowed?`, `inputsAtAnyTime? vs inputsOnlyAtFixedWindows`, view/spectator delays, role constraints): this is domain policy about what watchers can do; the natural owner is the context that interacts with users + enforces quotas/fairness and may vary per party/tournament → **Watch Party / Competition / Rules**, not Match. Split: Watch-Party owns `LiveCoachingRules` as a config aggregate/policy object (pauseAllowed, interventionsAnyTime/onlyInWindows + windows, minPauseCooldown, maxPausesPerPeriod, userSpecificCooldown, spectator delays…) read by its sagas to accept/reject locally before commanding Match. Match sees **only the simulation-affecting subset as simple parameters** carried in commands/initial config (`allowedDecisionPoints`, `maxInterventionsPerDecisionPoint`), immutable for the match or changed via deterministic events. **Avoid coupling** with an **anti-corruption layer** in Watch Party translating `LiveCoachingRules` → `MatchInterventionConstraints` (`ConfigureMatchInterventionConstraints{matchId, constraints}` command → Match `MatchInterventionConstraintsConfigured{...}` event → stored in the `InterventionBufferPolicy` VO, used deterministically). Ownership rule: source of truth for "what are the rules?" = Watch-Party/Competition; for "how do they affect simulation?" = Match (narrow stable translation interface).

**Q4 — Per-period (per-half) budget/quorum in a saga:** model as a per-WatchParty, per-Match process manager — an FSM with counters + timers, event-sourced (for debugging/replay). Sketch:

```
class PauseControlProcess : ProcessManager {  // key: (WatchPartyId, MatchId)
  MatchPeriod currentPeriod; bool voteOpen; bool matchPaused; Instant? pauseStartedAt;
  Map<MatchPeriod,Duration> pauseUsedByPeriod; Duration pauseBudgetPerPeriod; Duration minPauseCooldown;
  Instant? nextPauseAllowedAt; Set<UserId> eligibleVoters; Set<UserId> yesVotes; Set<UserId> noVotes; int quorumCount;
}
```

States (voting side): `Idle` (on `MatchPeriodStarted`: set period, reset period budget, voteOpen=false) → `VoteClosed` (on `UserRequestedPause`: if `now < nextPauseAllowedAt` → `PauseRequestRejected(reason="Cooldown")`; else if period budget exhausted → `PauseRequestRejected(reason="NoBudget")`; else open vote → `PauseVoteWindowOpened`) → `VoteOpen` (on `PauseVoteCast`: record; if yes ≥ quorum → `PauseVoteApproved` + send `PauseMatch`; on `VoteWindowTimeout` → `PauseVoteWindowExpired`) → `MatchPaused` (on `MatchPaused`: pauseStartedAt=now; on `MatchResumed`: add duration to period, if ≥ budget → `PauseBudgetExhausted`, `nextPauseAllowedAt = now + minPauseCooldown`). Prefer explicit enum states over booleans for clear invariants.

Watch-Party events: `PauseVoteWindowOpened`, `PauseVoteCast`, `PauseVoteApproved`, `PauseVoteRejected`, `PauseRequestRejected{reasonCode}`, `PauseBudgetDebited`, `PauseBudgetExhausted`, `PauseCooldownStarted/Ended`. Commands to Match: `PauseMatch`, `ResumeMatch`. **Saga-level determinism note:** the saga itself isn't replay-deterministic in the Match sense (it uses wall-clock) and needn't be; for fairness-dispute reproducibility, event-source it and **record effective wall-clock timestamps** so you can re-run decision logic as a simulation (not bit-identical).

### Determinism invariants to assert

1. **Engine determinism:** fixed seed + initial config + ordered command list `[C1..Cn]` into Match (incl. `ProposeIntervention`/`PauseMatch`/`ResumeMatch`) → uniquely determined, identical-on-replay Match event sequence.
2. **Command envelope:** Watch-Party→Match commands carry only deterministic data (no wall-clock, no volatile IDs); idempotent via explicit IDs.
3. **Context separation:** Match never reads wall-clock, never queries Watch-Party state directly, never uses "current real time" to decide accept/reject.
4. **Policy immutability (per match):** `InterventionBufferPolicy` is fixed for the match or changed only by explicit domain events in Match's own stream; no external subsystem secretly mutates it.
5. **Intervention identity:** each proposal has an `InterventionId`; all decisions about it are uniquely determined by event history + payload.
6. **Pause semantics:** pausing has a clearly defined effect (stop advancing ticks, or advance-but-don't-process-interventions), purely a function of `PauseMatch`/`ResumeMatch`, not real time.

---

Citations (as returned):
[1] 80.lv/articles/divide-and-conquer-deterministic-and-scripted-match3-engine ·
[2] youtube.com/watch?v=ZXEHPKmx410 ·
[3] community.temporal.io/.../determinism-and-event-history-of-a-workflow-receiving-signals/16565 ·
[4] hftadvisory.substack.com/p/matching-engine-determinism-why-replay ·
[5] forum.gamemaker.io/.../deterministic-random-seed... · [6] youtube.com/watch?v=4oJGkx0K8UQ
