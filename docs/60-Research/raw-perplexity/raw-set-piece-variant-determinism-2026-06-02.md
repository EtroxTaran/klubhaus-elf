---
title: "Raw Perplexity — set-piece variant selection determinism (FMX-70)"
status: current
tags: [research, raw, perplexity, match-engine, determinism, set-pieces, rng, fmx-70]
created: 2026-06-02
updated: 2026-06-02
type: research
binding: false
linear: FMX-70
sourceType: external
related:
  - [[../set-piece-variant-determinism-2026-06-02]]
  - [[../../10-Architecture/09-Decisions/ADR-0067-set-piece-variant-selection-determinism]]
---

# Raw Perplexity capture — FMX-70

> Unedited capture of the Perplexity (Sonar) query grounding the FMX-70 dossier
> and ADR-0067. Synthesis lives in [[../set-piece-variant-determinism-2026-06-02]].

## Query — deterministic set-piece variant selection in a replay-from-seed engine

**Prompt (verbatim):** Replay-from-seed (lockstep-style) football sim. At a
dead-ball moment multiple set-piece variants satisfy their triggers; need a
deterministic, replay-safe rule to pick one, captured in an immutable lock-time
tactic snapshot. (1) Compare priority / rotation / seeded selection models for
reproducibility, auditability, unpredictability. (2) For rotation, keep the
counter replay-safe without persisting hidden state (derive by folding the event
log forward / resim-from-kickoff) vs storing a mutable counter — how do lockstep
RTS engines handle per-entity sequence counters. (3) RNG sub-stream/sub-label
hygiene so a seeded set-piece draw doesn't perturb other draws (named streams
keyed by matchId + event-type + per-match sequence index; splitmix/PCG). (4)
Tie-break for equal-priority variants — stable id vs declaration order.

**Answer (verbatim):**

All three models can be made fully deterministic; the main question is what you
want to be "random" from the AI/opponent's point of view vs transparent and
debuggable from an engine/replay point of view.

**1. Comparing the three models.** Assume eligible variants `V = {v1…vn}`
(preconditions already filtered); pick one deterministically given match seed,
event index, and the tactic snapshot, independent of machine/hardware/frame
ordering.

- *(a) Strict PRIORITY (first matching wins):* each variant has a fixed priority;
  sort by priority + deterministic tie-break; pick first passing all conditions.
  **Pros:** simple to verify/replay (no counters/RNG); highly debuggable
  ("variants considered → first by priority that matched was X"); tactics feel
  coherent ("this is our A-plan corner"). **Cons:** predictable to AI/opponents;
  variant starvation (low-priority rarely fires); less apparent variety. Use when
  you want max auditability and accept predictability.
- *(b) Deterministic ROTATION:* `index = rotationCounter % |V|; chosen =
  V_sorted[index]`. Crucial part is how `rotationCounter` is defined to be
  deterministic + replay-safe. **Pros:** deterministic but varied; no RNG
  contamination if implemented as a function of event index; fair usage of
  authored content. **Cons:** state-management complexity if stored as mutable
  state; predictable long-term pattern (A,B,C); dependent on event ordering (a
  new dead-ball type incrementing the same counter changes the sequence → replay
  divergence if not versioned). Use when you want variety without per-event RNG
  and can control counter derivation.
- *(c) SEEDED random pick (per-event stream):* derive a local RNG seed from
  immutable inputs (`matchSeed`, `deadBallIndex`, `teamId`, `setPieceType`) and
  use it only to select among eligible variants:
  `eventSeed = H(matchSeed, teamId, setPieceType, deadBallIndex);
  rng = RNG(eventSeed); u = rng.uniformInt(0,|V|-1); chosen = V_sorted[u]` where
  `H` is splitmix64 / PCG seeding. **Pros:** strong determinism (functionally
  pure, no hidden state/counters); good unpredictability (appears random,
  deterministic to engine); strong isolation with a labelled stream per logical
  decision. **Cons:** slightly more plumbing (stream-naming + hashing); debugging
  requires seed tracing (still straightforward). Use when you want replay-safe
  determinism + realistic unpredictability and you're disciplined about RNG.

  **Recommendation:** for a football management sim heavy on replay + tactics
  analysis, **(c) seeded random pick with labelled streams** is usually the best
  balance: fully deterministic + re-sim-safe; easy to reason about in logs; not
  trivially predictable from priorities; needs no stored counters. You can retain
  **priority as a weight/eligibility** mechanism (weighted random over the
  eligible set).

**2. Rotation counters and replay safety.** Principle from deterministic/lockstep
engines: all state affecting simulation must be either (a) fully logged inputs or
(b) part of deterministic sim state subject to rollback/resim.
- *Option 1 — derive from event log (stateless functional):* define the rotation
  index as a pure function of the event sequence — give every dead-ball an
  absolute `deadBallIndex` per team + set-piece type; rotation index =
  `deadBallIndex` or `deadBallIndex % K`. Equivalent to replaying from kickoff;
  store the index on the event as immutable data and use `event.sequenceIndex`
  (not the live mutable counter) when selecting. If the engine supports rollback,
  counters are part of the authoritative snapshot and roll back reliably.
  **Pros:** no hidden state; easy re-sim from kickoff. **Cons:** future rules that
  create dead-ball events must not change counter semantics in old replays
  without versioning.
- *Option 2 — mutable counter outside core state:* risky for replay (scrubbing,
  mid-match jump, different speeds diverge). Best practice: if a counter
  influences the pick, it must be part of authoritative deterministic state and
  serialized/reconstructible, not a hidden engine field.
- *How typical engines do it:* lockstep RTS (AoE, SC1) store per-entity counters
  inside the sim, advancing only when the same inputs are applied in the same
  order; rollback fighters derive random decisions from frame index + entity id +
  match seed, avoiding mutable RNG state. Clean pattern for set-pieces: add
  `cornerIndex`/`freeKickIndex` to team state, increment on event creation, store
  on the event, use it to resolve the variant.

**3. RNG stream hygiene.** Principle: each logical random decision type should use
its own labelled RNG stream so adding/removing draws in one subsystem doesn't
change others. Compose: `streamSeed = H(baseSeed, label, teamId, setPieceType,
deadBallIndex)` with `label` a fixed constant per category
(`"SETPIECE_VARIANT"`, `"SHOT_DECISION"`, …). splitmix64 is a stateless mixing
function to produce seeds; PCG supports independent streams via a stream/sequence
parameter. Recommended here: **stateless per-event RNG using derived seeds** — no
persisted RNG state; every decision a pure function of known inputs. Log
`(label, streamSeed, firstDraw)` for debugging. Never share RNG objects across
subsystems unless draws are intentionally interdependent.

**4. Tie-break (equal priority).** Need a total deterministic ordering.
- *Stable id ordering (recommended default):* immutable `variantId`; on tie sort
  by `variantId` ascending. Independent of file layout/load order; safe under
  re-serialization/refactor; visible in logs/tools.
- *Declaration order:* deterministic only if the content pipeline preserves
  order; fragile to edits/reordering.
Best practice: give each variant a `priority` + persistent `variantId`; select by
filtering eligibility → sort by `(-priority, variantId)` → then priority picks
index 0 / rotation picks `[deadBallIndex % |V|]` / seeded picks an RNG index in
that order. Fixing the sort key + immutable id gives deterministic total order,
mirroring the deterministic-logic advice to avoid unordered/unstable containers.

**Concrete recommendation:** seeded random pick among eligible variants, priority
influencing eligibility/weight; per-team per-type `deadBallIndex` incremented on
dead-ball creation and serialized/derivable; sort `(priority DESC, variantId
ASC)`; derive `eventSeed` from `matchSeed`+`teamId`+`setPieceType`+`deadBallIndex`
+ label `"SETPIECE_VARIANT"` (splitmix/PCG); distinct label/stream per decision
type; never share RNG across subsystems. Yields replay-from-seed determinism, no
extra mutable engine state, clean isolation, and enough unpredictability that
opponents can't read authored priority lists.

**Citations (as returned):** ruoyusun.com "game networking 2" (lockstep);
jfgeyelin.com "gotchas in making a deterministic game" (RNG/splitmix/PCG);
leagueofgamemakers.com "how to design tie-breakers"; Unity determinism
discussion; vassalengine reference.
