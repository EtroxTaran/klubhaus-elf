---
title: Raw Source Checks - Replay Dedup Ownership Seam
status: raw
tags: [research, raw, source-checks, idempotency, event-sourcing, transactional-outbox, steamworks, replay-protection, fmx-164]
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

# Raw Source Checks - Replay Dedup Ownership Seam

## Capture metadata

- Captured: 2026-06-15
- Tools: Web source checks after Perplexity first pass.
- Purpose: Ground FMX-164 replay/dedup ownership and duplicate semantics in
  current primary or high-signal sources.
- Status: raw notes, not binding implementation guidance.

## AWS Builders Library - idempotent APIs

- Source: <https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/>
- Observation: AWS recommends caller-provided unique client request identifiers
  for idempotent operations instead of trying to infer duplicate intent only
  from request parameters.
- Observation: AWS discusses semantically equivalent retry responses, late
  arriving requests and the problem of "same client request ID, different
  intent".
- Observation: The idempotency token and the mutating operation must be handled
  atomically so the system does not record one without the other.
- FMX implication: `commandId` should be an explicit idempotency key. The
  processed-command record and the authoritative command side effect must be
  captured atomically or with an equivalent single-transaction contract.

## Stripe API idempotent requests

- Source: <https://docs.stripe.com/api/idempotent_requests>
- Observation: Stripe saves the first status/body for a given idempotency key
  and returns the same result for later requests with the same key.
- Observation: Stripe compares incoming parameters against the original request
  and errors if they differ.
- Observation: Stripe only saves an idempotent result after endpoint execution
  begins; validation failures and concurrent conflicts are retryable because no
  endpoint execution was initiated.
- FMX implication: FMX should distinguish duplicate replay from validation and
  concurrency conflict. A same-key same-hash retry can return the stored
  outcome or pending status; a same-key different-hash/binding request is a
  misuse/security rejection; an `expectedVersion` conflict remains an Offline
  Sync rebase result, not an idempotency mismatch.

## Microsoft Azure Architecture - Event Sourcing pattern

- Source: <https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing>
- Observation: Event sourcing records each logical change as an event in an
  append-only store that serves as the authoritative source of current state.
- Observation: Command handlers rehydrate the entity from its event stream,
  enforce business rules and append new events.
- Observation: Read models/materialized views are derived from the event store.
- FMX implication: Domain contexts remain the owners of legal command handling
  and aggregate invariant checks. The replay/dedup gate should happen before
  domain dispatch, while committed events remain the authoritative source for
  projections and later audit/provenance.

## Microservices.io - Transactional Outbox

- Source: <https://microservices.io/patterns/data/transactional-outbox.html>
- Observation: The transactional outbox stores messages in the database as part
  of the same transaction that updates business entities, then a separate relay
  publishes them.
- Observation: If the database transaction commits, messages must be sent; if
  it rolls back, they must not be sent.
- Observation: The relay may publish the same message more than once, so
  consumers must be idempotent.
- FMX implication: ADR-0028 is the right pattern for committed domain-event
  publication and consumer idempotency. It is not the right place for the
  synchronous pre-domain duplicate gate, because an outbox consumer reacts
  after a successful commit.

## Steamworks Stats and Achievements

- Source: <https://partner.steamgames.com/doc/features/achievements>
- Observation: Steamworks stats and achievements have API-defined ownership
  and constraints such as "Set By", "Increment Only", "Max Change" and upload
  through `StoreStats`.
- Observation: Steamworks exposes public/community-facing achievement and stat
  surfaces through platform APIs rather than by trusting arbitrary local save
  files.
- FMX implication: For public Hall of Fame, leaderboards and async multiplayer,
  FMX should keep the ADR-0116 posture: public surfaces consume verified
  histories/proofs, not unverified local-only state. This supports the replay
  gate as a server-side/public-trust concern rather than a client-only cache
  concern.

## Consolidated source-check conclusion

- API idempotency precedent supports a stable client-provided key, stored
  first outcome and parameter/hash mismatch rejection.
- Event-sourcing precedent supports keeping domain legality in command
  handlers and event append as the authoritative state transition.
- Transactional-outbox precedent supports post-commit event publication and
  downstream idempotent consumers, not pre-commit command dedup.
- Game/platform precedent supports separating local play from public-trust
  surfaces. FMX should use verified command/provenance evidence for public
  features, while still allowing local/casual play when public eligibility
  cannot be proven.
