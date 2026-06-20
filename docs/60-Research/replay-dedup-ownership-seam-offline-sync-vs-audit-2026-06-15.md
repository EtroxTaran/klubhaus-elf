---
title: "Replay/dedup ownership seam: Offline Sync vs Audit & Security (FMX-164)"
status: current
tags: [research, synthesis, replay-protection, idempotency, offline-sync, audit, command-reception, event-sourcing, fmx-164]
context: [audit-security, offline-sync]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-164
related:
  - [[raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]]
  - [[raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
---

# Replay/dedup ownership seam: Offline Sync vs Audit & Security (FMX-164)

## Scope

FMX-164 resolves the seam left by ADR-0090, ADR-0091, ADR-0115 and ADR-0028:
who owns authoritative command replay/dedup state, what duplicate requests
return, and where the check sits relative to domain validation and the
transactional outbox.

Nico approved the recommended packet on 2026-06-15:

- D1 = **Reception capability**.
- D2 = **Cached outcome**.
- D3 = **ADR-0119 seam**.

The binding decision home is
[[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]].
The decision record is preserved in
[[../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]].

## Evidence synthesis

### Real-world API precedent

AWS and Stripe both support the same direction:

- the client supplies a stable idempotency key;
- the server records the first accepted intent/outcome;
- retries with the same key receive a semantically equivalent result;
- the server rejects or errors when the same key is reused with different
  request parameters/intent;
- the idempotency record and mutating side effect must be atomic enough that
  one cannot be committed without the other.

FMX translates that into `commandId` + canonical payload hash + actor/save/run
binding. A repeated identical command is a retry. A repeated ID with different
hash or binding is not a domain conflict; it is a replay/misuse/security fact.

### Event-sourcing and DDD precedent

Azure's event-sourcing guidance keeps business-rule enforcement in command
handlers that rehydrate an aggregate/event stream before appending new events.
That maps cleanly to FMX:

- the replay/dedup gate happens before domain dispatch;
- each domain context still owns legal-command rules and aggregate invariants;
- committed events remain the authoritative state transition;
- projections, audit consumers and public eligibility derive from committed
  facts.

The command-reception gate is therefore a platform ingress capability, not a
new game-domain bounded context and not a replacement for domain validation.

### Outbox precedent

The transactional outbox solves post-commit publication: if the domain
transaction commits, the outbox message is eventually published; if it rolls
back, it is not. The relay may publish duplicates, so consumers must be
idempotent.

That is a different problem from duplicate command **acceptance**. FMX must not
wait for an outbox consumer to discover a duplicate, because the duplicate
needs a synchronous answer before domain execution and before any new events
are appended.

ADR-0028 remains the committed-domain-event publication path and domain
mutation trail. ADR-0119 adds the missing pre-domain command gate.

### Game and public-trust precedent

The Perplexity game-precedent pass was useful for product framing but weak as
direct citation. The safe line is narrower:

- public/community stats and achievement systems use platform/server APIs and
  constraints, not arbitrary local-save trust;
- FMX already accepted ADR-0115/ADR-0116: signatures are evidence, server
  authority remains the acceptance authority and public features consume
  verified histories/proofs;
- therefore replay/dedup is part of the server/public-trust command intake,
  while Offline Sync remains the client UX and retry/rebase owner.

This preserves local/casual play while keeping public Hall of Fame,
leaderboards and async multiplayer on verified command/provenance evidence.

## Accepted FMX line

| Concern | Accepted owner | Rationale |
|---|---|---|
| Local command queue, retry/backoff and offline UX | Offline Sync | Client-side resilience and rebase workflow. |
| `expectedVersion` conflict presentation/rebase | Offline Sync, using server results | This is a concurrency/result UX, not an idempotency mismatch. |
| `commandId` replay/dedup policy and processed-command state | Audit & Security via Command Reception | Replays, duplicate IDs and mismatched bindings are security/audit facts. |
| Domain command legality | Owning domain context | Game rules and aggregate invariants stay with the domain owner. |
| Authoritative event append | Owning domain context + event store transaction | Event-sourced truth. |
| Committed event publication/domain mutation trail | ADR-0028 outbox | Post-commit reliability and projection feed. |
| Security facts after reception decision | Audit & Security | Tamper-evident forensic record and anomaly signals. |

## Canonical command path

```text
Receive command
-> auth/session binding
-> canonical payload hash
-> commandId dedup/replay gate
-> domain validation
-> expectedVersion / append
-> outbox + security facts
```

The dedup/replay gate must run before domain validation so an identical retry
does not execute domain logic twice and a mismatched retry does not reach a
domain handler at all.

## Duplicate semantics

| Case | Meaning | Result |
|---|---|---|
| Unseen `commandId` | New command intent | Continue to domain validation and expected-version append. |
| Same `commandId`, same hash and same actor/session/save/run binding, first outcome final | Retry / late response recovery | Return the first stored outcome. |
| Same `commandId`, same hash and binding, first request still pending | Concurrent retry | Return pending/accepted status without executing a second command. |
| Same `commandId`, different hash or actor/session/save/run/aggregate binding | Replay misuse or collision | Security rejection before domain validation. |
| Different `commandId`, stale `expectedVersion` | Real concurrency conflict | Domain result that Offline Sync presents/rebases. |

## Implementation-shape notes for code phase

This packet is architectural, not code. The future code phase still needs exact
schemas and transaction boundaries. The implementation should preserve these
minimum contracts:

- processed-command record keyed by actor/account + save/run + aggregate scope
  + `commandId`;
- stored canonical payload hash and binding evidence;
- stored outcome reference/status for replayable response;
- atomicity between first accepted command, domain append and processed-command
  completion;
- security fact emission for accepted, duplicate, pending and rejected cases;
- idempotent downstream consumers for ADR-0028 outbox publications.

## Related

- [[raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]]
- [[raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
- [[../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
- [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
- [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
