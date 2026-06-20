---
title: ADR-0119 Command Reception Dedup Seam
status: accepted
tags: [adr, architecture, command-reception, replay-protection, idempotency, offline-sync, audit, outbox, fmx-164]
context: [audit-security, offline-sync]
created: 2026-06-15
updated: 2026-06-15
type: adr
binding: true
linear: FMX-164
amends:
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[ADR-0028-postgres-transactional-outbox]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[ADR-0028-postgres-transactional-outbox]]
---

# ADR-0119: Command Reception Dedup Seam

## Status

accepted

Accepted 2026-06-15 by Nico for FMX-164. Decision queue:
[[../../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]].

This ADR amends ADR-0090, ADR-0091, ADR-0115 and ADR-0028. It does not create a
new bounded context.

## Date

2026-06-15

## Context

ADR-0090 gives Offline Sync the future client command queue, retry/backoff,
offline UX and rebase flow. ADR-0091 gives Audit & Security replay-protection
and dedup state. ADR-0115 makes `commandId`, `expectedVersion`, canonical
payload hash and signed command evidence mandatory for mutating commands.
ADR-0028 defines the transactional outbox for committed domain events.

The unresolved seam was operationally important: if Offline Sync owns replay,
does that make the client authoritative? If Audit & Security owns dedup, does
it run synchronously before domains or asynchronously from the outbox? If the
outbox is the audit trail, is it also the duplicate-command gate?

FMX needs one command path that supports offline retries and public-trust
surfaces without executing a command twice or letting mismatched duplicate IDs
reach domain handlers.

## Decision

### D1 - owner

FMX uses a **Command Reception capability** as the synchronous pre-domain
ingress gate for mutating commands.

The capability is owned by Audit & Security for replay/dedup policy,
processed-command state and security facts. It is not a new bounded context.
It cooperates with Identity & Access for authentication/session binding and
then dispatches only non-duplicate, non-rejected commands to the owning domain
context.

Offline Sync owns the client-side queue, retry/backoff, offline UX,
`expectedVersion` conflict presentation and rebase flow. It does not own the
authoritative server processed-command store.

Domain contexts own command legality and aggregate invariants. They do not
reimplement generic replay/dedup semantics for every command.

ADR-0028 owns post-commit domain-event publication and the domain mutation
audit trail. It does not own pre-commit command dedup.

### D2 - canonical command path

Every mutating command follows this order:

```text
Receive command
-> auth/session binding
-> canonical payload hash
-> commandId dedup/replay gate
-> domain validation
-> expectedVersion / append
-> outbox + security facts
```

The dedup/replay gate runs before domain validation. That prevents identical
retries from executing domain logic twice and prevents mismatched duplicate IDs
from reaching game-rule handlers.

The `expectedVersion` check remains distinct from idempotency. A stale
`expectedVersion` on a different command ID is a concurrency result used by
Offline Sync for rebase UX. It is not a replay/dedup mismatch.

### D3 - duplicate semantics

| Case | Result |
|---|---|
| Unseen `commandId` | Continue to domain validation and expected-version append. |
| Same `commandId`, same canonical payload hash and same actor/session/save/run/aggregate binding; first request final | Return the first stored outcome. |
| Same `commandId`, same hash/binding; first request still pending | Return a pending/accepted status and do not dispatch a second command. |
| Same `commandId`, different hash or actor/session/save/run/aggregate binding | Reject before domain validation as replay misuse / security fact. |
| Different `commandId`, stale `expectedVersion` | Return a domain/concurrency result; Offline Sync presents or rebases. |

The first stored outcome can be a success, domain rejection or final
concurrency result, as long as the same hash/binding retry receives the same
semantic result. The exact response envelope is a future implementation schema,
but it must preserve this distinction.

### D4 - security facts and committed events

Audit & Security records command-reception facts for accepted, duplicate,
pending and rejected requests. These are security audit facts, not domain
events and not raw payload dumps.

When a command succeeds and appends domain events, ADR-0028 publishes those
committed events through the transactional outbox. Audit & Security may consume
committed domain events and command metadata via the outbox for projections,
forensics and anomaly scoring, but that asynchronous consumption is not the
authoritative duplicate-command decision.

## Options considered

### D1 - owner

| Option | Meaning | Assessment |
|---|---|---|
| A. Reception capability | Synchronous pre-domain gate owned by Audit & Security for replay/dedup policy and processed-command state; Offline Sync owns client queue/rebase UX. | **Accepted.** Cleanest split between trust boundary, UX and domain rules. |
| B. Offline Sync owns authoritative dedup | Client queue and server processed-command state are treated as one concern. | Rejected; risks implying client authority and mixes UX state with security facts. |
| C. Outbox/audit consumer owns dedup | Duplicate detection happens after committed events through outbox consumers. | Rejected; too late to stop duplicate domain execution. |

### D2 - duplicate semantics

| Option | Meaning | Assessment |
|---|---|---|
| A. Cached outcome | Same ID + same hash/binding returns first outcome or pending status; mismatched hash/binding rejects. | **Accepted.** Matches mature idempotent API practice and reduces client uncertainty. |
| B. Always `409 Duplicate` | Every repeated command ID returns a generic duplicate error. | Rejected; safe but poor retry semantics for offline/network loss. |
| C. Re-run domain validation on retry | Re-execute handler and compare result. | Rejected; risks duplicate side effects and inconsistent late-arrival results. |

### D3 - artifact shape

| Option | Meaning | Assessment |
|---|---|---|
| A. ADR-0119 seam | Add a dedicated accepted ADR and amend related ADRs. | **Accepted.** The seam crosses Offline Sync, Audit & Security, command integrity and outbox. |
| B. Inline amendments only | Patch ADR-0090/0091/0115/0028 without a new ADR. | Too easy to lose as scattered wording. |
| C. Implementation note only | Defer to code-phase spec. | Too late; the ownership decision is architectural. |

## Rationale

This aligns FMX with mature idempotent API behavior while preserving DDD
ownership:

- clients can retry safely after offline or network loss;
- repeated identical commands do not produce duplicate side effects;
- mismatched duplicate IDs become security facts before game logic runs;
- `expectedVersion` conflicts remain rebase/concurrency results;
- domains keep ownership of game rules;
- the outbox remains a post-commit publication mechanism, not a pre-commit
  command gate.

The pattern also fits ADR-0115/ADR-0116 public-trust posture: signatures and
command/provenance evidence support trust decisions, but the server remains the
acceptance authority.

## Consequences

Positive:

- Closes the replay/dedup ownership ambiguity across ADR-0090, ADR-0091,
  ADR-0115 and ADR-0028.
- Gives Offline Sync deterministic retry/rebase semantics without making the
  client authoritative.
- Keeps outbox responsibilities narrow and reliable.
- Provides a single place for security audit facts and replay anomaly signals.

Costs / constraints:

- Code phase needs a processed-command store and response replay contract.
- First-accept atomicity must be specified with the domain append transaction.
- Security audit minimization must avoid storing raw sensitive payloads; hashes,
  reason codes and binding evidence are preferred.
- Implementation tests must cover same-ID/same-hash, same-ID/different-hash,
  pending retry and stale-version cases.

## Follow-ups

- Define the processed-command table/schema when code-phase persistence is
  authored.
- Define the response replay envelope in the first command API contract.
- Add conformance tests to ADR-0118 security/idempotency test scope once code
  surfaces exist.

## Related

- [[../../60-Research/replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-replay-dedup-command-reception-2026-06-15]]
- [[../../60-Research/raw-perplexity/raw-replay-dedup-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-164-replay-dedup-seam-decision-queue-2026-06-15]]
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
- [[ADR-0091-audit-security-context-definition]]
- [[ADR-0115-command-integrity-and-replay-protection-posture]]
- [[ADR-0028-postgres-transactional-outbox]]
