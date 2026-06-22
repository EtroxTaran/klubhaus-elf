---
title: ADR-0087 Live-match Intervention Buffer + Watch-Party Pause-Vote
status: accepted
tags: [adr, architecture, ddd, match, watch-party, intervention-buffer, pause-vote, tactics-pause, process-manager, saga, value-object, determinism, event-sourcing, anti-grief, multiplayer, fmx-101, fmx-140]
context: [watch-party, match]
created: 2026-06-07
updated: 2026-06-16
type: adr
binding: true
supersedes:
superseded_by:
related:
  - [[ADR-0072-in-match-control-seam]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0049-swappable-spatial-event-match-engine]]
  - [[ADR-0099-spectator-watch-party-streaming-over-committed-event-log]]
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0026-match-frame-contract]]
  - [[../bounded-context-map]]
  - [[../state-machines/match]]
  - [[../state-machines/watch-party]]
  - [[../../50-Game-Design/GD-0025-in-match-controls]]
  - [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../../50-Game-Design/watch-party-and-conference]]
  - [[../../50-Game-Design/GD-0002-match-engine]]
  - [[../../60-Research/live-match-intervention-buffer-and-pause-vote-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-live-coaching-pause-governance-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-inmatch-intervention-rate-limiting-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-intervention-buffer-pause-saga-ddd-2026-06-07]]
  - [[../../60-Research/raw-perplexity/raw-deterministic-intervention-buffering-2026-06-03]]
  - [[../../60-Research/determinism-and-replay]]
  - [[../../60-Research/live-match-pause-ratification-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-live-match-pause-ratification-2026-06-16]]
  - [[../../60-Research/raw-perplexity/raw-live-match-pause-source-checks-2026-06-16]]
  - [[../../40-Execution/fmx-140-live-match-pause-ratification-decision-queue-2026-06-16]]
---

# ADR-0087: Live-match Intervention Buffer + Watch-Party Pause-Vote

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored after Nico chose the FMX-101 decisions live
> (2026-06-07, D1–D4 = A/A/A/A). Closes domain-audit gap **G24** and the E8-1 child of epic
> FMX-64. It **extends ADR-0072** (fills the buffer-state-machine + pause-vote it explicitly
> deferred); it does **not** re-open the ADR-0072 control seam. It proposes **draft amendments**
> to `state-machines/match.md` and `state-machines/watch-party.md` (authored in the same PR,
> clearly marked draft) and flips **no** context to accepted. **No bounded-context-map change**
> (a contract between the existing ratified Match and Watch Party contexts).

> **FMX-135 status cleanup (2026-06-12):** Nico confirmed the FMX-143
> ratification intent during the FMX-135 pass. This ADR remains `accepted` and is
> now `binding: true`; the pre-ratification banner above stays historical context.
>
> **FMX-140 ratification cleanup (2026-06-16):** Nico confirmed Design 1 pause
> semantics and promoted the previously reserved tactics-pause, local pause-trust
> tier and additive Head Coach/host privileges into MVP scope. The state-machine
> amendments in `match.md` and `watch-party.md` are current, not draft. Numeric
> magnitudes remain GD-0043 / FMX-52 calibration behind versioned policy profiles.

## Date

- Proposed: 2026-06-07 (FMX-101)
- Ratification cleanup / amendment: 2026-06-16 (FMX-140)

## Context

ADR-0072 (FMX-100) ratified the in-match **control seam**: an `InterventionCommand` with an
`ExecutionBinding` (`immediateNextTick` for light cmds — shout/mentality; `nextSemanticBoundary`
∈ {deadBall, restart, halftime} for heavy cmds — sub/formationSwap/tacticChange), an immutable
`TacticSnapshot` swapped atomically at the boundary, and a default "queue legal cmds to the next
valid boundary (`pending→scheduled→applied`); deterministic reject for impossible cmds". It
**explicitly deferred** the *buffer state machine* and the *watch-party pause-vote* to **FMX-101
(G24)**. Two gaps remain:

1. **Match.** `match.md §4` accepts "tactical changes, substitutions, shouts" during `simulating`
   and `§5` binds every accepted intervention into the seeded stream, but **nothing bounds how
   many interventions may buffer at one deterministic acceptance point, how they are ordered, or
   how a rejected/late one is surfaced** → command spam, replay-bloat, and replay-nondeterminism
   risk.
2. **Watch Party.** `watch-party.md §5.1` defines only the **automatic disconnect** pause
   (`disconnectPauseMode`, `disconnectPauseWindowSeconds` 30–300/default 180,
   `disconnectPauseBudgetPerHalf` default 1) and states "pause budgets, cooldowns and audit events
   are watch-party orchestration concerns, not match-engine logic". There is **no FSM for a
   deliberate, manager-initiated pause** (budget, cooldown, quorum, audit per active manager per
   half) → pause-as-stalling/grief in human watch parties.

Binding constraints preserved:

- **`match.md §6` / ADR-0072 C1/C4** — "Pause windows are operational timers; they must not enter
  the deterministic engine as wall-clock time; only accepted interventions become replay events."
- **bounded-context-map §3/§6** — Match and Watch Party are ratified contexts; they communicate
  only via commands/queries/events; no cross-context joins.
- **ADR-0028** — domain events route via the transactional outbox.
- **ADR-0018 / determinism-and-replay** — locked-9 RNG streams; new randomness consumers may be
  added without invalidating replays (not exercised here — see Determinism).

Grounded in [[../../60-Research/live-match-intervention-buffer-and-pause-vote-2026-06-07]] (three
new Perplexity passes — multiplayer/real-sport pause governance, in-match intervention
rate-limiting, DDD saga vs value-object — plus the FMX-100 buffering capture). FMX-140 adds a
source-checked ratification cleanup in
[[../../60-Research/live-match-pause-ratification-2026-06-16]] after Nico answered the open
tactics-pause, role/reputation and abuse-revocation questions.

Scope: the Match-owned `InterventionBufferPolicy` value object + buffer/rejection events; the
Watch-Party-owned deliberate pause-vote process manager (distinct from §5.1); their event-only
coordination; the `§7` live-coaching matrix ownership split; the determinism contract. Out of
scope: spectator-delay tuning (ADR-0099, supersedes ADR-0015); the disconnect-pause path beyond boundary clarification;
match simulation internals (ADR-0049); **all numeric magnitudes** (→ FMX-52 behind
`interventionPolicyVersion` / `pausePrivilegePolicyVersion`).

## Decision options

### D1 — Match intervention-buffer bounding

| Option | Description | Trade-off |
|---|---|---|
| **A. Bounded per-point + per-type caps** | Global cap (~8/point) + per-type caps (subs ≤3/point within IFAB total; 1 atomic tactical "package"; 1 shout/point); deterministic order `(boundaryIndex, commandId)`; subs dedup, tactics/shouts last-write-wins. | **Chosen (Nico).** Matches RTS/MOBA command-queue caps + observed FM behaviour; bounds spam + replay-bloat; gives QA a testable invariant. Magnitudes → FMX-52. |
| B. Unbounded last-write-wins | No explicit caps; rely on UI friction; last tactic/shout at a point wins; subs limited only by IFAB. | The FM-observed default; simplest, but allows replay-bloat and gives no spam invariant to assert. |
| C. Strict 1-per-point | At most one intervention accepted per acceptance point. | Maximally simple/safe but unrealistic — blocks the real "triple sub + shape change" at one stoppage. |

### D2 — Match rejection / overflow model

| Option | Description | Trade-off |
|---|---|---|
| **A. Typed deterministic reject** | Self-contained, replay-safe `InterventionRejected` with `reason ∈ {BufferFull, WindowClosed, Duplicate/Superseded, Illegal, NotExecutedInTime}`; overflow rejects (no silent auto-defer); feedback in all UI tiers (Expert = full reason). | **Chosen.** Matches ADR-0072 "deterministic reject" + best practice (separate request-time from binding-time; expose pending/scheduled/applied/rejected). Clear UX; auditable. |
| B. Auto-defer, reject only impossible | Overflow silently rolls to the next point; reject only truly impossible cmds; Expert-only feedback. | Fewer events but "why didn't my change apply yet?" is opaque; weaker invariant. |

### D3 — Watch-Party deliberate-pause consent

| Option | Description | Trade-off |
|---|---|---|
| **A. Hybrid veto/quorum by group size** | 2 managers → unilateral request + 3s veto window; 3+ → short majority vote (≥⌈n/2⌉ incl. requester) in a 3s window; any manager may request resume (3s countdown, one re-pause). | **Chosen.** Research-backed balance of low-friction co-op vs anti-grief; nobody can hard-lock the group; avoids the Dota/SC2 "anyone pauses/unpauses at will" failure. |
| B. Always majority quorum | Every pause needs a majority vote. | Most grief-proof, but heavy friction in the common 2-manager case. |
| C. Unilateral within budget | Any active manager pauses freely until budget/cooldown exhausted (Dota/SC2-style). | Simplest, but one manager can fragment everyone's flow within their allowance. |

### D4 — Watch-Party pause allowance shape

| Option | Description | Trade-off |
|---|---|---|
| **A. Discrete per-manager/half count** | N discrete pauses/manager/half (default ~2) + global per-half cap + cooldown + max-duration + auto-resume; distinct from the free/longer disconnect pause. | **Chosen.** Mirrors NBA/NFL/CS timeout design; legible ("Pause 1/2"), easy to audit + reason about per-person abuse. |
| B. Shared time-bank (chess-clock) | A pooled "pause-seconds" bank/half drawn down per pause (Fischer/Bronstein analogue). | More flexible (few long vs many short) but harder to surface fairly across managers + reason about abuse. |

## Decision

**D1 = A, D2 = A, D3 = A, D4 = A** (Nico, live, 2026-06-07).

Match owns a deterministic `InterventionBufferPolicy` **value object** bounding buffered
interventions per acceptance point with per-type caps + deterministic ordering, emitting typed,
replay-safe rejection events. Watch Party owns a **deliberate pause-vote process manager**
(hybrid veto/quorum by group size; discrete per-manager-per-half budget + cooldown + max-duration
+ auto-resume), separate from the §5.1 disconnect pause. The two coordinate **only** via
`PauseMatch`/`ResumeMatch` commands and `MatchPaused`/`MatchResumed` events; **no wall-clock ever
enters the seeded engine**, and **no new `*Rng`** is declared (buffering/ordering/rejection are
pure functions). All magnitudes route to FMX-52.

**FMX-140 amendment (Nico, 2026-06-16).** The accepted pause contract now includes:

- active-manager deliberate pause uses **Design 1**: suspend Match progression at deterministic
  safe points; passive spectator pause/replay remains presentation-only;
- MVP ships a **separate tactics pause** (`pauseKind = tactics`), one per managed side per half,
  longer than ordinary deliberate pause, with strict auto-resume and no carry-over;
- Watch Party owns a local per-group/competition **pause trust tier**; no account-global pause or
  social score is introduced;
- Head Coach/host receives **+1 ordinary deliberate pause per half** and **one veto override**;
  trusted tier receives **+1 ordinary deliberate pause per half**;
- every extra privilege is audit-gated and revocable through abandon/report/cooldown facts behind
  `pausePrivilegePolicyVersion`.

## Public contract direction

### A. Match — `InterventionBufferPolicy` (value object) + events

Parameters live on an immutable VO; the buffer + current decision point live on the `Match`
aggregate. The VO is fixed for the match or changed only by a Match-stream event
(`MatchInterventionConstraintsConfigured`, fed by the Watch-Party ACL — see §C). Zod sketches are
**illustrative, not implementation**:

```ts
InterventionBufferPolicy = {
  interventionPolicyVersion: int,                 // FMX-52 calibration version
  maxBufferedPerAcceptancePoint: int,             // ~8 (FMX-52)
  perTypeCaps: { substitution: int, tacticalPackage: int, shout: int },  // 3 / 1 / 1 (FMX-52)
  // ordering: ascending (boundaryIndex, commandId); subs dedup; tactics+shouts last-write-wins
  acceptanceWindow: 'fixedWindowsOnly' | 'anyTime', // set by WP "Inputs at any time?" via ACL
}

// emitted at accept
InterventionBuffered = {
  matchId: MatchId, interventionId: InterventionId, commandId: CommandId,
  side: 'home' | 'away', type: 'substitution'|'tacticChange'|'formationSwap'|'mentalityPreset'|'shout',
  binding: ExecutionBinding,                       // ADR-0072
  boundaryIndex: int,                              // deterministic acceptance point
}
// emitted when the bound command executes (heavy = snapshot swap; sub = swap players)
InterventionApplied = {
  matchId: MatchId, interventionId: InterventionId, appliedAtTick: Tick, appliedAtBoundary: int,
}
// D2 — self-contained, replay-safe; no cross-context join; no wall-clock
InterventionRejected = {
  matchId: MatchId, interventionId: InterventionId,
  reason: 'BufferFull' | 'WindowClosed' | 'DuplicateSuperseded' | 'Illegal' | 'NotExecutedInTime',
  type: InterventionType, requestedBoundaryIndex: int, currentBoundaryIndex: int,
  bufferSizeAtDecision: int,                       // everything needed for UI/Notification
}
```

Rejection is a pure function of prior event history + command content (no wall-clock, no
environment) → same state + same request ⇒ same decision, same byte-for-byte event. `interventionId`
is caller-provided (idempotency + stable replay IDs). All four events route via the ADR-0028
outbox; UI + Notification consume `InterventionRejected` directly (no source-domain join). Naming
follows `match.md §7` (`Match*` / `*ed` / `*Rejected`).

### B. Watch Party — deliberate pause-vote process manager (saga)

A `PauseControlProcess` (keyed `(watchPartyId, matchId)`), **separate** from the §5.1
disconnect-pause process; both may emit `PauseMatch`, so Match never learns who asked. FSM:
`Idle → VoteClosed → VoteOpen → MatchPaused → (auto-resume | ResumeMatch) → VoteClosed`. It holds
all wall-clock state — per-half budget counters, cooldown (`nextPauseAllowedAt`), eligible voters,
votes, quorum — and is event-sourced **with effective wall-clock timestamps recorded** for
fairness-dispute re-runs (the saga is deliberately *not* bit-reproducible; only Match is).

```ts
// Watch-Party events (group-config magnitudes → FMX-52 + per-group config)
PauseVoteOpened  = { watchPartyId, matchId, half, openedBy: MemberId, pauseKind: 'deliberate'|'tactics', mode: 'vetoWindow'|'majorityVote', closesInMs: int, policyVersion: int }
PauseVoteEnacted = { watchPartyId, matchId, half, enactedBy: MemberId, pauseKind, budgetRemaining: int, maxDurationMs: int }
PauseResumed     = { watchPartyId, matchId, half, pauseKind, cause: 'autoResume'|'managerResume'|'maxDurationReached' }
PauseRequestRejected = { watchPartyId, matchId, half, requestedBy: MemberId, pauseKind, reasonCode: 'Cooldown'|'NoBudget'|'GlobalCapReached'|'NotAllowed'|'Vetoed'|'QuorumNotMet'|'PrivilegeRevoked' }
PauseBudgetDebited / PauseBudgetExhausted / PauseCooldownStarted / PauseCooldownEnded = { … }

// commands Watch-Party → Match (deterministic data only)
PauseMatch  = { matchId: MatchId, reason: 'watchPartyVote' | 'tacticsPause' | 'autoDisconnect' }
ResumeMatch = { matchId: MatchId, reason: 'watchPartyVote' | 'tacticsPause' | 'autoDisconnect' | 'maxDuration' }
// Match → Watch-Party (already added to match.md §7 by this ADR)
MatchPaused / MatchResumed = { matchId: MatchId, reason }
```

**Persistence.** `watch_party` gains distinct deliberate-pause columns —
`deliberate_pause_budget_per_half`, `deliberate_pause_global_cap_per_half`,
`deliberate_pause_cooldown_s`, `deliberate_pause_max_duration_s`, `pause_consent_mode`,
`tactics_pause_budget_per_half`, `tactics_pause_max_duration_s` and
`pause_privilege_policy_version` — and a `watch_party_pause_event` audit child table (event log,
not state). Participant-local pause privilege state sits on `watch_party_participant` or a child
projection: `pause_trust_tier`, `pause_privilege_revoked_until`, `pause_privilege_policy_version`.
Platform-fixed ceilings (non-configurable): max duration ≤60s for ordinary deliberate pauses,
hard tactics-pause duration ceiling from the policy profile, absolute max total paused/half,
mandatory auto-resume, no carry-over between halves, always-on audit.

### C. FMX-140 tactics pause + local privilege layer

`PauseControlProcess` distinguishes three pause kinds:

| Pause kind | Owner | Counts against | Shape |
|---|---|---|---|
| `deliberate` | Watch Party | ordinary per-manager/per-half budget | ADR-0087 D3/D4 hybrid veto/quorum, short duration, cooldown, auto-resume |
| `tactics` | Watch Party | tactics budget, one per managed side per half | longer coaching window, strict auto-resume, no banking, no stacking |
| `disconnect` | Watch Party | disconnect policy only | existing §5.1 automatic recovery path, distinct from deliberate/tactics budgets |

Local privilege layer:

- `PauseTrustTier = new | trusted | restricted` (names illustrative; exact thresholds = FMX-52).
- Trust is scoped to the watch party group/competition. It is derived from completed sessions,
  abandon facts, accepted reports, cooldown history and audit events. It is never an account-global
  social score.
- Head Coach/host additive privilege: +1 ordinary deliberate pause per half and one veto override
  within platform ceilings.
- Trusted-tier additive privilege: +1 ordinary deliberate pause per half within platform ceilings.
- Restricted/revoked tier can lose additive privileges for the policy cooldown window. Revocation
  is audit-gated and event-sourced; no opaque manual penalty is part of the core contract.

### D. §7 live-coaching matrix ownership (no overlap)

| `watch-party-and-conference.md §7` row | Owner | Mechanism |
|---|---|---|
| Pause allowed? | **Watch Party** | policy flag gating the pause-vote saga |
| Inputs at any time? (Always / Only fixed windows) | **WP sets flag → Match enforces** | WP owns the rule; flows to Match's `acceptanceWindow` via the ACL; Match enforces deterministically |
| Coach / Spectator view delay | **Watch Party** | streaming (ADR-0099, supersedes ADR-0015), unchanged |
| Disconnect pause mode / window | **Watch Party** | existing §5.1, unchanged |
| Chat | **Watch Party** | unchanged |
| *(new)* deliberate pause budget/cooldown/quorum/max-duration | **Watch Party** | pause-vote saga (§B) |
| *(new)* tactics pause budget/duration/auto-resume | **Watch Party** | pause-control saga (`pauseKind = tactics`) |
| *(new)* local pause-trust tier + Head Coach/host privilege | **Watch Party** | audit-gated privilege policy (`pausePrivilegePolicyVersion`) |
| *(new)* intervention buffer caps/ordering/rejection | **Match** | `InterventionBufferPolicy` VO (§A) |

ACL (avoids coupling): a Watch-Party anti-corruption layer translates its `LiveCoachingRules` →
`MatchInterventionConstraints` and issues `ConfigureMatchInterventionConstraints{matchId,
constraints}`; Match records `MatchInterventionConstraintsConfigured` and stores it in the buffer
policy VO. Source of truth: *"what are the rules?"* = Watch Party; *"how do they affect the
simulation?"* = Match.

### Pause semantics (Design 1 — accepted default)

A watch-party pause = **stop advancing the simulation**: Match has an internal `isPaused` driven
only by `PauseMatch`/`ResumeMatch`; while paused it does not advance ticks or process
interventions, so the **next deterministic acceptance point does not move** — it is merely
suspended until resume. On replay, `PauseMatch`/`ResumeMatch` are fed at the same *positions* in
the command stream (never by real-time gap). The presentation-only alternative (Design 2: sim
keeps ticking server-side, pause is streaming-only) is **rejected** as the MVP default because it
breaks the "interventions are not processed while paused" expectation; it remains a possible
post-MVP streaming optimization.

## Determinism & RNG

- **No new `*Rng`.** Buffering, ordering, and rejection are pure functions of event history +
  command payload; this adds no randomness consumer (ADR-0018 locked-9 streams unchanged).
- Wall-clock lives **only** in the Watch-Party saga; it influences *whether/when* `PauseMatch`/
  `ResumeMatch`/intervention commands are emitted, never the Match outcome.
- Match decisions depend solely on `(seed, ordered command list)`.

## Invariants

Match-side intervention buffer (**IB**):

- **IB1** Every accepted/rejected intervention is a pure function of prior Match event history +
  command payload — no wall-clock, no Watch-Party state.
- **IB2** Ordering of buffered interventions at a point is a deterministic total order over
  `(boundaryIndex, commandId)`.
- **IB3** Per-point caps (global + per-type) are enforced before acceptance; overflow ⇒
  `InterventionRejected{BufferFull}` (D2; no silent auto-defer).
- **IB4** `InterventionRejected` is self-contained (UI/Notification need no cross-context join).
- **IB5** Same `(seed, ordered commands)` ⇒ byte-identical `InterventionBuffered/Applied/Rejected`
  sequence on replay.
- **IB6** `InterventionBufferPolicy` is immutable per match except via a Match-stream event
  (`MatchInterventionConstraintsConfigured`).
- **IB7** IFAB sub limits + windows remain rule-data-driven (Regulations/competition data); the
  buffer cap never overrides them.

Watch-Party pause-vote (**PV**):

- **PV1** All pause budgets/cooldowns/quorum/wall-clock live in the Watch-Party saga; Match never
  sees them.
- **PV2** The deliberate pause-vote is a process distinct from the §5.1 disconnect pause; the
  disconnect pause consumes no deliberate budget.
- **PV3** A pause reaches Match only as a `PauseMatch` command; Match emits `MatchPaused`
  deterministically; the saga starts wall-clock billing on that event.
- **PV4** Per-half ordinary and tactics budgets never carry over; platform ceilings (ordinary
  deliberate pause max duration ≤60s, tactics ceiling by policy profile, mandatory auto-resume,
  max total paused/half) are non-configurable.
- **PV5** Every pause/resume/rejected-request emits an audit event with attribution.
- **PV6** Consent: 2-manager = veto window; 3+ = majority quorum (≥⌈n/2⌉); no single manager can
  hold the group paused beyond the max-duration auto-resume.
- **PV7** A pause shifts the next deterministic acceptance point only by suspending sim progress
  (Design 1) — never by injecting wall-clock into the seeded engine (restates `match.md §6` / C4).
- **PV8** Local pause-trust tiers and Head Coach/host privileges are Watch-Party policy state, not
  Match state and not account-global reputation.
- **PV9** Any additive pause privilege is revocable only through attributed audit facts and a
  versioned policy profile.

## Consequences

**Positive.** Closes G24; live coaching becomes spam- and grief-resistant while staying
deterministic; QA gets testable IB/PV invariants + golden traces; clean context separation (Match
pure, Watch Party wall-clock); no map change; no new RNG; extends rather than re-opens ADR-0072.

**Negative / constraints.** Adds a Watch-Party persistence + saga surface (new columns + audit
table); the ACL adds one translation hop; exact numbers are unresolved until FMX-52 (the spec ships
structure + defaults, not final magnitudes); on-device feel of veto/resume/tactics windows can only
be validated on a running build.

## Ratified cleanup and remaining calibration

- All magnitudes (buffer caps; ordinary pause budget/cooldown/max-duration; tactics-pause duration;
  trust thresholds; quorum/veto windows) → **FMX-52 / GD-0043**.
- **Design 1** is confirmed for active-manager deliberate pause semantics.
- The longer **tactics pause** is MVP scope: one per managed side per half, strict auto-resume,
  no carry-over.
- Local pause-trust tier and Head Coach/host additive privileges are MVP scope under
  `pausePrivilegePolicyVersion`.
- The two state-machine amendments (`match.md`, `watch-party.md`) are current as of FMX-140.
