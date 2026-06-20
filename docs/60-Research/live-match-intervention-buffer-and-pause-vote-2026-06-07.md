---
title: Live-match Intervention Buffer + Watch-Party Pause-Vote (FMX-101)
status: current
tags: [research, match, watch-party, intervention-buffer, pause-vote, determinism, anti-grief, ddd, event-sourcing, multiplayer, fmx-101]
context: [match, watch-party]
created: 2026-06-07
updated: 2026-06-07
type: research
binding: false
linear: FMX-101
related:
  - [[raw-perplexity/raw-live-coaching-pause-governance-2026-06-07]]
  - [[raw-perplexity/raw-inmatch-intervention-rate-limiting-2026-06-07]]
  - [[raw-perplexity/raw-intervention-buffer-pause-saga-ddd-2026-06-07]]
  - [[raw-perplexity/raw-deterministic-intervention-buffering-2026-06-03]]
  - [[in-match-controls-and-presentation-2026-06-03]]
  - [[determinism-and-replay]]
  - [[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[../10-Architecture/09-Decisions/ADR-0072-in-match-control-seam]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0018-systemic-events-and-player-lifecycle]]
  - [[../10-Architecture/state-machines/match]]
  - [[../10-Architecture/state-machines/watch-party]]
  - [[../50-Game-Design/GD-0025-in-match-controls]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../50-Game-Design/watch-party-and-conference]]
  - [[../50-Game-Design/GD-0002-match-engine]]
---

# Live-match Intervention Buffer + Watch-Party Pause-Vote (FMX-101)

Synthesis for **FMX-101** (E8-1, epic FMX-64; closes gap **G24**). Grounds proposed
[[../10-Architecture/09-Decisions/ADR-0087-live-match-intervention-buffer-and-pause-vote]]
and draft [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]].
Builds on the FMX-100 buffering capture
[[raw-perplexity/raw-deterministic-intervention-buffering-2026-06-03]] (acceptance-point /
binding mechanics) rather than repeating it.

## 1. Problem & scope

ADR-0072 (in-match control seam, FMX-100) ratified **when** interventions apply (light
cmds → `immediateNextTick`; heavy → `nextSemanticBoundary` = deadBall/restart/halftime;
immutable `TacticSnapshot`) and **explicitly deferred the buffer state-machine + the
watch-party pause-vote to FMX-101 (G24)**. Two holes remain:

1. **No bound** on *how many* interventions may be buffered per deterministic acceptance
   point, no deterministic ordering/tie-break for them, and no explicit rejection-feedback
   contract → spam, replay-bloat, and replay-nondeterminism risk (Match-owned).
2. **No FSM for a deliberate, manager-initiated pause.** `watch-party.md §5.1` covers only
   the **automatic disconnect** pause (`disconnectPauseMode`,
   `disconnectPauseWindowSeconds` 30–300/default 180, `disconnectPauseBudgetPerHalf`
   default 1). A deliberate pause has no budget/cooldown/quorum → stalling/grief in
   human-vs-human watch parties (Watch-Party-owned).

Out of scope: spectator-delay tuning (ADR-0015), the disconnect-pause path itself beyond
boundary clarification, match-engine simulation internals (ADR-0049), and numeric
calibration runs (routed to **FMX-52**).

## 2. Key finding — the determinism boundary is the whole design

All three strands converge on the same architecture, matching what the codebase already
asserts (`match.md §6`; ADR-0072 invariants C1/C4): **keep every wall-clock, abuse-
protection, budget, cooldown and quorum rule in Watch Party (a saga); keep Match a pure,
deterministic value-object policy over an already-filtered, ordered intervention stream.**

- Match never reads wall-clock, never queries Watch-Party state, never uses real time to
  accept/reject. Its only inputs are seed + ordered commands.
- A pause is **not** in the seeded stream. Coordination is event-only: Watch Party emits
  `PauseMatch`/`ResumeMatch` commands; Match deterministically emits `MatchPaused`/
  `MatchResumed`. The *relative order* of these among intervention commands is what makes a
  replay reproducible — never the real-time gap between them.
- The shared "live coaching rules" matrix (`watch-party-and-conference.md §7`) is owned by
  Watch Party; Match receives only the **simulation-affecting subset** as immutable
  parameters via an ACL (`ConfigureMatchInterventionConstraints` → stored in the buffer
  policy VO). No cross-context joins (bounded-context-map §3/§6).

Corollary: **no new `*Rng`.** Buffering, ordering and rejection are pure functions of
event history + command payload; this adds no randomness consumer (ADR-0018 locked-9
streams unchanged; determinism-and-replay §2.3 "new consumers don't invalidate replays" is
not even exercised).

## 3. Match side — `InterventionBufferPolicy` (value object) + rejection events

Prior art (FM/EA FC/OOTP/EHM) bounds interventions **indirectly** — stoppage-gated
acceptance + last-write-wins tactics + IFAB sub limits + UI friction — and almost never
publishes numeric caps. RTS/MOBA engines are the explicit-bound reference: small per-entity
queue caps, a per-tick processing cap, and deterministic ordering by
`tick → playerId → unit/seq` with last-in-order-wins on conflict.

**D1 = A (Nico, 2026-06-07): bounded per-point buffer + per-type caps.** Model a Match-
aggregate value object holding *parameters only* (the buffer + current decision point live
on the aggregate):

- `maxBufferedPerAcceptancePoint` (global, ~8 default → FMX-52);
- per-type caps: **subs ≤3/point** (within the IFAB total + windows, which stay
  rule-data-driven), **1 atomic tactical "package"/point** (a package may bundle many
  parameter changes but counts as one intervention), **1 shout/point**;
- deterministic ordering/tie-break `(boundaryIndex, commandId)` — `commandId` is the
  stable monotonic key already on ADR-0072's `InterventionCommand`;
- conflict resolution: **subs** dedup (same player twice → keep first, reject later);
  **tactics + shouts** last-write-wins (earlier "superseded").

**D2 = A: typed deterministic rejection.** Rejection is a first-class, self-contained,
replay-safe Match domain event with a typed reason — `BufferFull | WindowClosed |
Duplicate/Superseded | Illegal | NotExecutedInTime`. Overflow **rejects** (no silent
auto-defer — clearer UX) — note this is the *overflow/illegal/too-late* path; ADR-0072's
existing default (legal cmds auto-queue to the next valid boundary, `pending→scheduled→
applied`) is unchanged. Feedback surfaces in **all** UI tiers (concise toast; Expert sees
the full reason). Determinism rule: rejection depends only on prior event history + command
content → same state + same request → same decision; rejection events carry a caller-
provided `interventionId` for idempotency and stable replay IDs; **no wall-clock in any
event** (real-time, if wanted, lives in an operational log outside the stream).

Events (Match): `InterventionBuffered`, `InterventionApplied`, `InterventionRejected`
(+ existing `MatchPaused`/`MatchResumed` for coordination), routed via the ADR-0028 outbox.
All match the `Match*`/`*ed`/`*Rejected` naming in `match.md §7`.

## 4. Watch-Party side — deliberate pause-vote process manager (saga)

The cleanest real/game references for **bounded deliberate pauses** are CS tactical
timeouts (4×30s, ≤1/round, auto-resume, clear attribution), NBA/NFL timeouts (small finite
budget per period, no carry-over, hard caps), coach's-challenge tied to a timeout, and
cricket/tennis per-period review budgets. Chess offers the alternative (a shared time-bank
via Fischer/Bronstein). Football itself has **no** manager timeout — so we are inventing a
trusted "digital referee," which raises the bar on fairness + attribution. Pub Dota/SC2
show the failure mode to avoid: "anyone can pause/unpause at will."

**D3 = A: hybrid consent by group size.** 2 managers → unilateral request + a 3s **veto**
window (no veto → pause; vetoed → no pause, credit not consumed). 3+ → a short majority
vote (**≥⌈n/2⌉ incl. requester**) within a 3s window. Resume: any manager requests resume →
3s "Resuming…" countdown during which one **re-pause** is allowed (consumes the re-pauser's
credit). This is the research-backed balance of low-friction co-op vs anti-grief; nobody
can hard-lock the group.

**D4 = A: discrete per-active-manager-per-half budget** (NBA/NFL/CS shape; chosen over the
chess-clock shared time-bank for legibility — "Pause 1/2 this half" — and per-person abuse
reasoning). Shape: N pauses/manager/half (default ~2) + a global per-half cap + a cooldown
between pauses + a max-duration with auto-resume. **Distinct** from the disconnect pause,
which stays free, longer, and budget-less.

Modelled as a Watch-Party **process manager / saga** (`PauseControlProcess`, keyed
`(watchPartyId, matchId)`), separate from the disconnect-pause process; both emit
`PauseMatch`. States: `Idle → VoteClosed → VoteOpen → MatchPaused →` (auto/`MatchResumed`)
`→ VoteClosed`. It tracks wall-clock budgets/cooldowns/quorum + per-half counters,
event-sourced with **effective wall-clock timestamps recorded** for fairness-dispute
re-runs (the saga is deliberately *not* bit-reproducible — only Match is). Events:
`PauseVoteOpened`, `PauseVoteEnacted`, `PauseResumed`, `PauseRequestRejected{reasonCode}`,
`PauseBudgetDebited`/`PauseBudgetExhausted`, `PauseCooldownStarted/Ended`.

**Calibration vs platform-fixed:** all magnitudes (budget, cooldown, max-duration, quorum
thresholds) → **FMX-52** + per-group config. **Platform-fixed hard ceilings** (non-
configurable): max pause ≤60s, absolute max total paused time/half (~5 min), mandatory
auto-resume, no carry-over between halves, always-on audit/attribution.

## 5. §7 live-coaching matrix ownership (no overlap)

| §7 row | Owner | How |
|---|---|---|
| Pause allowed? | **Watch Party** | policy flag; gates the pause-vote saga |
| Inputs at any time? (Always / Only fixed windows) | **Watch Party** sets the flag → **Match** *enforces* | WP owns the rule; Match's `acceptanceWindow` (via ACL constraints) enforces it deterministically |
| Coach view delay / Spectator view delay | **Watch Party** | streaming concern (ADR-0015), unchanged |
| Disconnect pause mode / window | **Watch Party** | existing §5.1, unchanged |
| Chat | **Watch Party** | unchanged |
| (new) Deliberate pause budget / cooldown / quorum / max-duration | **Watch Party** | new pause-vote saga |
| (new) Intervention buffer caps / ordering / rejection | **Match** | new `InterventionBufferPolicy` VO |

Rule of thumb (from the DDD strand): source of truth for *"what are the rules?"* = Watch
Party; for *"how do they affect the simulation?"* = Match, behind a narrow stable ACL.

## 6. Determinism invariants (carried into ADR-0087)

1. Fixed seed + initial config + ordered Match command list → byte-identical Match event
   sequence on replay.
2. Watch-Party→Match commands carry only deterministic data (no wall-clock/volatile IDs);
   idempotent via explicit IDs.
3. Match never reads wall-clock / never queries Watch-Party state / never uses real time to
   accept/reject.
4. `InterventionBufferPolicy` is immutable per match or changed only via a Match-stream
   event (`InterventionPolicyChanged` / `MatchInterventionConstraintsConfigured`).
5. Each intervention has a stable `interventionId`; its accept/reject is uniquely
   determined by event history + payload.
6. Pause has a defined deterministic effect (stop advancing the sim / advance-but-don't-
   process) purely as a function of `PauseMatch`/`ResumeMatch` — never real time.

## 7. Open / ratify-gated items

- All magnitudes (buffer caps, pause budget/cooldown/max-duration, quorum thresholds) =
  **FMX-52** calibration behind `interventionPolicyVersion` / a pause-policy version.
- Confirm pause semantics = "stop advancing the sim" (Design 1) vs presentation-only
  (Design 2). Recommendation + ADR default: **Design 1** (match is pause-aware;
  interventions not processed while paused) — matches the existing operational-pause split.
- Whether the optional "tactics pause" type (longer, 1/half) ships at MVP or is reserved.
- Reputation-based escalation + role-based (Head Coach +1 pause / veto-override) = post-MVP
  reserved hooks.

## 8. Sources

The three FMX-101 raw captures (pause governance / intervention rate-limiting / DDD saga)
+ the FMX-100 buffering capture. **Honesty note:** the pause-governance Sonar run returned
off-topic web citations (recorded in its raw file); its game/sport facts (CS/NBA/NFL/cricket/
tennis/chess) are standard and independently verifiable and are what this synthesis relies
on. SI/EA in-match internals are observational (no published numbers) → all magnitudes are
deferred to FMX-52, not asserted as fact.
