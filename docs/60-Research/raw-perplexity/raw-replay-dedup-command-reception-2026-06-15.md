---
title: Raw Perplexity - Replay Dedup Command Reception Seam
status: raw
tags: [research, raw, perplexity, replay-protection, idempotency, offline-sync, audit, command-reception, fmx-164]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-164
related:
  - [[../replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
  - [[../../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
---

# Raw Perplexity - Replay Dedup Command Reception Seam

## Capture metadata

- Captured: 2026-06-15
- Tool: Perplexity Sonar via MCP
- Purpose: FMX-164 ownership seam research for replay/dedup vs Offline Sync,
  Audit & Security and ADR-0028 transactional outbox.
- Handling: Punctuation normalized to ASCII for vault consistency. This is raw
  research input, not authoritative implementation guidance.

## Prompt 1 - architecture seam

Research event-sourced and offline-capable command handling for a browser/PWA
football-management game. Compare where command idempotency, replay protection
and duplicate handling should live when the system already has:

- client Offline Sync with future IndexedDB command queue and conflict rebase;
- server-authoritative DDD/domain command handlers;
- Audit & Security with security audit log and replay-protection state;
- a transactional outbox for committed domain events.

Recommend the ownership seam and validation order.

## Raw answer capture 1

Perplexity recommended placing idempotency/replay protection at the **server
command reception / command gateway boundary** before domain mutation. The
answer described this as a small synchronous ingress capability, not as a
domain rule and not as the client outbox.

The recommended flow was:

1. Receive command and bind it to authenticated actor/session/save context.
2. Canonicalize the payload and calculate a payload hash.
3. Check the `commandId` idempotency/replay store.
4. If unseen, continue to server-side domain validation.
5. Apply optimistic concurrency (`expectedVersion`) and append canonical
   events inside the same transaction.
6. Publish committed events through the transactional outbox.
7. Emit security/audit facts for the reception decision.

The answer argued that this gives clients safe retry semantics while keeping
game-rule authority in domain handlers. It also prevents a duplicate request
from executing expensive or stateful domain logic when the first request has
already been processed.

Perplexity treated Offline Sync as the owner of the client-side queue,
backoff, offline UX and rebase flow. It should not be the authoritative dedup
owner because an offline-capable client is controlled by the player and cannot
be trusted as the replay-protection source of truth.

Perplexity treated ADR-0028 transactional outbox as the reliable publication
mechanism for **committed** events, not as the pre-commit command gate. It
warned against routing duplicate-command checks through an asynchronous outbox
consumer because the duplicate request needs a synchronous answer before domain
execution.

## Prompt 2 - DDD / event-sourcing ownership

In DDD and event-sourced systems, should replay/dedup state be owned by an
Audit & Security bounded context, by each domain context, by the transactional
outbox, or by Offline Sync? Explain the trade-offs and recommend a pattern for
FMX.

## Raw answer capture 2

Perplexity recommended a split:

- Audit & Security owns replay/dedup **policy, evidence and the processed
  command record** because replay attempts, mismatched payloads and actor/save
  binding violations are security facts.
- The command-reception capability performs the synchronous check using that
  policy/store before dispatching to a domain command handler.
- Domain contexts still own their legal-move rules, aggregate invariants and
  event append semantics. They should not have to reimplement generic replay
  and duplicate semantics in every context.
- Offline Sync owns client state and conflict UX, including the local command
  queue and `expectedVersion` rebase flow, but it does not decide whether a
  command is a duplicate on the server.
- The transactional outbox remains an event-publication and projection/audit
  feed after a successful domain commit.

The answer called out one nuance: if a duplicate uses the same `commandId` and
the same canonical hash/binding, it should return the first stored result or a
pending status. If the same `commandId` arrives with different payload,
actor/session, device, save/run or aggregate binding, it should be rejected as
a security violation before domain validation.

## Prompt 3 - real-world and game precedent

Look at real-world API services and comparable game/simulation systems. What
patterns should FMX borrow for idempotent retries, replay protection and public
trust surfaces such as leaderboards or Hall of Fame?

## Raw answer capture 3

Perplexity named payment/cloud API idempotency as the strongest real-world
analogue: clients provide a stable idempotency key, the server records the
first result and later retries with the same key receive a consistent answer.
It also highlighted that services reject parameter mismatches for a reused key,
because "same id but different request" is usually accidental misuse or
malicious replay.

For game/simulation precedent, Perplexity's answer was useful mainly as a
classification aid, not as direct citable authority. It grouped patterns into:

- deterministic command logs and replay systems, where commands are accepted
  through a canonical authority before replay;
- online/competitive surfaces that treat local client state as untrusted;
- public stats/achievements/leaderboards that are uploaded through platform or
  server APIs rather than being silently trusted from arbitrary local state;
- modded or offline-local play that remains playable but is separated from
  public eligibility when provenance cannot be verified.

The source quality for concrete game claims was mixed. The synthesis therefore
uses the game section as product-design precedent only where separately
source-checked or already covered by ADR-0115/ADR-0116, and does not canonize
weak secondary game URLs as binding evidence.

## Perplexity recommendation

The recommended FMX ownership seam:

- **Owner:** Audit & Security owns replay/dedup policy and processed-command
  state through a synchronous command-reception capability.
- **Offline Sync:** owns client queue, retry/backoff, offline UX and rebase
  handling for `expectedVersion` conflicts.
- **Domain contexts:** own command legality and aggregate invariants.
- **ADR-0028 outbox:** owns reliable publication of committed events and the
  domain mutation trail after the command succeeds.
- **Duplicate semantics:** same `commandId` + same hash/binding returns the
  first stored outcome or pending status; same `commandId` + different
  hash/binding is a security rejection before domain validation.

## Source-quality note

Perplexity was directionally strong for the architectural split and for API
idempotency analogues. The real-world API claims were source-checked in
[[raw-replay-dedup-source-checks-2026-06-15]]. The game-precedent section is
kept conservative because the strongest direct evidence for FMX's public-trust
posture already lives in ADR-0115/ADR-0116 and the new source-check note.
