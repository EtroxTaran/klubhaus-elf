---
title: ADR-0146 Per-command stale-state conflict policy (amends ADR-0011 offline-conflict policy)
status: proposed
tags: [adr, architecture, multiplayer, offline-sync, concurrency, conflict-resolution, ux, fmx-248, fmx-230, fmx-228]
context: [offline-sync]
created: 2026-07-23
updated: 2026-07-23
type: adr
binding: false
linear: [FMX-248, FMX-230]
supersedes:
superseded_by:
related:
  - [[ADR-0011-server-authoritative-multiplayer]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[ADR-0008-mobile-first-ui]]
  - [[ADR-0087-live-match-intervention-buffer-and-pause-vote]]
  - [[ADR-0119-command-reception-dedup-seam]]
  - [[../../50-Game-Design/transfer-negotiations-p2p]]
  - [[../../50-Game-Design/async-multiplayer-private-group]]
---

# ADR-0146: Per-command stale-state conflict policy (amends ADR-0011 offline-conflict policy)

## Status

proposed

Authored `proposed` per the never-self-accept rule; **amends the binding ADR-0011** by
supersede-by-amendment (`vault-governance.md`), never a silent overwrite — Nico ratifies.
`binding: false`. FMX-248 (Cluster B / epic FMX-228), run through the Research / Decision loop.
Nico decided the three forks live at the checkpoint (3-class model; deadline = hard-reject now +
limit-order seam arm-later; declare-now/arm-later scope). Grounded by a vault synthesis
(ADR-0011/0090/0088/0008/0087/0119, transfer + async-mp notes) + external optimistic-concurrency
UX best-practice (intent preservation · precondition semantics · fail-fast near deadlines).

## Context

ADR-0011's offline-conflict policy currently **hard-rejects** every command replayed against
moved-on server state (typed `rejected_with_reason` + redo affordance) and states *"a per-action
policy table (auto-rebase for some commands) is out of scope for MVP — revisit when we have real
user data."* FMX-248 (thought T24) asks to fill exactly that deferred table: some conflicts are
**benign** (e.g. a transfer offer sent at a budget that has since dropped but the bid still fits)
and deserve a soft *"state changed — still proceed?"* rather than a blunt reject-and-redo.

Two anchors make this safe and non-reversing:
- **Safety is already guaranteed** — every command carries `commandId` (idempotency) +
  `expectedVersion`, every projection carries `lastSeenVersion` (ADR-0008 U4, ADR-0090). A stale
  command is re-validated server-side and can **never silently apply**; this ADR changes only
  *what we present and allow on a detected conflict*, not the safety guarantee.
- **The direction is already ratified** — ADR-0090 D2 mandates *"server-authoritative
  re-validation + rebase … rebase still-valid queued commands on conflict."* ADR-0011's blanket
  hard-reject was the MVP placeholder for that seam. This ADR turns the placeholder into a policy.

## Decision — a three-class per-command conflict policy

On a detected stale-state conflict, each command re-validates into one of **three classes**, decided
by two questions in order (intent preservation + precondition semantics):

1. **Are the command's hard preconditions still satisfied under current state?** — if **no** →
2. **Did a field the player would weigh in this decision change?** — if the preconditions still hold.

| Class | When | Behaviour |
|---|---|---|
| **HARD-REJECT + redo** | a hard precondition is now **violated** (target sold, budget now *insufficient*, window closed, membership revoked) | today's ADR-0011 behaviour, unchanged: typed reason (`state_changed`/`resource_unavailable`/`deadline_passed`/`forbidden`) + redo affordance preloaded with intent |
| **SOFT confirm-and-continue** | still **executable**, but a **decision-relevant** field moved | show the delta + *proceed / cancel* (the FMX-248 budget case: *"budget £5m→£3m; your £2m offer still fits — proceed?"*) |
| **AUTO / silent-revalidate** | still executable, **nothing decision-relevant** changed, command is idempotent/order-independent | apply (or rebase) with at most a **passive notice** |

**The classifier is per-command and lives in the owning domain context's re-validation** (ADR-0119:
each context re-validates its own commands; Offline Sync owns only the client queue, retry, and
rebase *presentation*). "Decision-relevant field" is declared per command type, not global.

### Default conflict-class per command (declared; concrete set → owning contexts)

- **Transfer offer / bid** (flagship) — SOFT when still affordable after a budget/liquidity move;
  HARD when now unaffordable or the target is gone. (Budget is a stale-sensitive precondition;
  `transfer-market-and-contracts` §9 liquidity check applies.)
- **Counter-offer** — SOFT/HARD as transfer; HARD if the negotiation was resolved/withdrawn.
- **Free-agent entry** — HARD (`resource_unavailable`) if signed elsewhere; slot contention.
- **Line-up submit** — AUTO before lock (idempotent last-write); HARD (`deadline_passed`) after
  `lineupLockAt` (ADR-0088).
- **Tactic prep / change** — AUTO in pure-async (last-write); HARD after `tacticLockAt`.
- **Training plan** — AUTO (pure-async, local, order-independent).
- **Close-week / vote / pause-vote** — HARD on an already-advanced week / closed ballot
  (`state_changed`); votes fall back to abstention per async-mp §7.
- **In-match intervention** — governed by its **existing** per-command rules (ADR-0087: subs dedup,
  tactics/shouts last-write-wins, deterministic `(boundaryIndex, commandId)` order) — this ADR does
  not override ADR-0087; it is cited as the precedent pattern.
- **Admin powers** — HARD (`forbidden`) if role/membership changed.
- **Match-result** — n/a (server-authoritative; clients never submit results).

### Deadline-day edge (ADR-0088)

Within a derived lock window (`transferLockAt`/`lineupLockAt`/`tacticLockAt` = anchor − {60,30,30}
min, pure derivations from a single immutable anchor) there is no time for a soft-confirm
round-trip. **Fallback = HARD-REJECT** (`deadline_passed` / "too close to confirm") — the safe
default. A **pre-authorized "limit-order" tolerance** — the player attaches an intent envelope when
queuing (e.g. *"submit if still affordable up to £Xm"*, a natural *max-bid* feature) so the server
can auto-resolve at the deadline with no round-trip — is **declared now as a seam and armed later**
(post-MVP, with the durable Offline Sync engine).

### MVP scope — declare-now / arm-later

At MVP, **ADR-0011's hard-reject stays the live behaviour**; this ADR **declares** the three-class
policy, the per-command `conflictClass`, the "decision-relevant field" contract, and the limit-order
tolerance seam **now** (so they are forward-additive). SOFT + AUTO + limit-order **arm** with the
post-MVP Offline Sync engine (ADR-0090's thin-MVP seam; ADR-0008: optimistic MP is post-MVP). No
save-format or contract break — the `commandId`/`expectedVersion`/`lastSeenVersion` seam already
ships.

## Invariants (normative)

- **C-a (safety unchanged):** re-validation against `expectedVersion` is the only authority; no
  class ever applies a command whose hard preconditions are violated. AUTO ≠ bypass.
- **C-b (determinism unchanged):** server re-validation stays byte-reproducible; wall-clock never
  enters the engine; deadlines stay pure derivations (ADR-0088 DL1–DL4).
- **C-c (ownership):** the `conflictClass` + "decision-relevant" predicate are owned by each command's
  domain context (ADR-0119); Offline Sync presents, it does not classify.
- **C-d (deadline safety):** inside a lock window the class degrades to HARD-REJECT unless a
  pre-authorized tolerance (armed later) covers the delta.
- **C-e (idempotency retained):** every command keeps its idempotency test (replay = no-op,
  ADR-0011 Compliance); AUTO relies on it.

## Lockstep touch (applies on ratification)

- **binding ADR-0011 §"Offline conflict policy"** — the blanket *"hard-reject … no auto-rebase at
  MVP"* is amended to reference this three-class policy: hard-reject remains the MVP default and the
  behaviour of the HARD class; SOFT/AUTO are the declared-now/arm-later extension resolving the
  deferred "per-action policy table". (Applied at ratification per the ADR-0141→ADR-0056 pattern —
  not hard-edited here while this ADR is `proposed`.)

## Consequences

- Fills the per-action table ADR-0011 explicitly deferred; delivers Nico's soft confirm-and-continue
  for the budget case without weakening safety or determinism.
- Keeps the MVP behaviour exactly as today (hard-reject), so nothing regresses; the richer classes
  are additive and arm with the engine that will actually queue offline commands.
- Gives the transfer *max-bid* feature a principled home (the limit-order tolerance seam).
- Aligns with ADR-0090's rebase mandate and ADR-0087's existing per-command in-match semantics.

## Alternatives considered

- **Two-class (soft/hard, never silent-auto):** rejected — adds friction on trivial, idempotent,
  non-decision-relevant changes that AUTO handles safely; ADR-0087 already ships silent last-write
  for tactics/shouts, so a no-silent-auto rule would be inconsistent.
- **Limit-order tolerance from the start:** deferred — a natural feature but more UX/design surface
  than the declare-now/arm-later scope warrants; kept as an armed-later seam.
- **Keep blanket hard-reject:** rejected — it is ADR-0011's own acknowledged MVP placeholder and
  fails FMX-248's benign-conflict intent.
