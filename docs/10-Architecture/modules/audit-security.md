---
title: Audit & Security module
status: draft
tags: [architecture, module, audit, security, replay-protection]
context: audit-security
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0091-audit-security-context-definition]], [[../09-Decisions/ADR-0119-command-reception-dedup-seam]], [[../09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]], [[../09-Decisions/ADR-0027-postgres-data-model]]
---

# Audit & Security Boundary

## Purpose

Explicit but narrow Platform & Governance context that **observes, records,
verifies and flags** — it never decides game rules or owns canonical game state.
It backs the synchronous command-reception trust boundary and keeps a
tamper-evident security trail distinct from the domain event store
(ADR-0091, ADR-0119).

## Owns

- **Security audit log** — append-only, write-once trail of security *facts*
  (command reception, auth/authz decisions, idempotency/replay rejections,
  rate-limit triggers, anomaly flags, moderation actions), recording
  who/what/when/why + integrity metadata, **not** raw PII/secrets/payloads.
- **Tamper-evidence** — per-record hash-chaining + periodic signed checkpoints
  (Merkle batching), with separated signing keys and least-privilege access.
- **Command Reception capability** — the synchronous pre-domain ingress gate:
  replay/dedup policy and the authoritative processed-`commandId` store
  (nonce / `sequenceNo` / expiry verification backing the ADR-0090/ADR-0115
  command envelope).
- **Abuse / anomaly scoring + flags** and moderation-workflow hooks (review
  queue / sanction signals); flags are advisory, not auto-truth.
- **Retention + redaction policy** for security evidence (hot/warm/cold tiers,
  pseudonymized identifiers, GDPR sever-the-identifier-on-erasure).

## Public contract

The sources define the contract at capability/fact granularity; concrete type
names are deferred to the code phase (see Open items). What the BCM and ADRs
pin down:

**Exposed outputs (BCM row):** security facts, dedup/replay decisions, anomaly
flags.

**Command Reception (synchronous, per ADR-0119 D2/D3):** receives a mutating
command after Identity & Access auth/session binding, computes the canonical
payload hash, runs the `commandId` dedup/replay gate **before** domain
validation, then dispatches only non-duplicate, non-rejected commands to the
owning domain context. Duplicate semantics (ADR-0119 D3):

- Unseen `commandId` → continue to domain validation / `expectedVersion` append.
- Same `commandId` + same hash/binding, first request final → return first
  stored outcome.
- Same `commandId` + same hash/binding, first request pending → return
  pending/accepted; do not dispatch a second command.
- Same `commandId`, different hash or actor/session/save/run/aggregate binding →
  reject before domain validation as replay misuse (security fact).
- Different `commandId`, stale `expectedVersion` → concurrency result returned
  for Offline Sync to present/rebase (not a replay/dedup mismatch).

**Security facts emitted (ADR-0119 D4):** command-reception facts for accepted,
duplicate, pending and rejected requests — security audit facts, not domain
events and not raw payload dumps.

## Storage ownership

- Owns its **own schema/tables only** for the security audit log and the
  processed-command (dedup/replay) store; per ADR-0121 no shared tables and no
  cross-context JOINs — cross-context reads go through the other context's
  public query layer.
- Per ADR-0097, the security trail is the context-owned append-only,
  hash-chained log; there is **no platform `audit_log` table** (dropped — the
  outbox is the domain trail, this context's log is the security trail). The
  context *consumes* the outbox and never joins other contexts' tables.
- Table placement (platform `public` vs per-save `save_<…>` schema) follows the
  ADR-0027 routing convention via `QueryGateway.withPlatform` / `withSave`; the
  concrete processed-command table/schema is a code-phase follow-up (ADR-0119).

## Consumers / Producers

- **Consumes (facts in):** committed domain events + command metadata via the
  ADR-0028 transactional outbox (asynchronous — for projections, forensics,
  anomaly scoring; **not** the authoritative duplicate-command decision).
  Per the BCM/arc42 dependency edges it observes Identity & Access, Transfer,
  Match and League Orchestration.
- **Cooperates with:** Identity & Access for authentication/session binding at
  reception; Offline Sync owns the client queue/retry/rebase UX while this
  context owns the authoritative server processed-command store.
- **Produces (outputs out):** security facts, dedup/replay decisions and
  anomaly flags consumed by moderation/review surfaces; the synchronous
  accept/duplicate/reject decision gates command dispatch to owning domains.

## Invariants

- Mandate is observe/record/verify/flag — **never** decides game rules or owns
  canonical game state (ADR-0091).
- The security audit log is **append-only / write-once**, separate from the
  domain event store; records facts (who/what/when/why + integrity metadata),
  not raw PII/secrets/payloads.
- The dedup/replay gate runs **before** domain validation; identical retries
  must not execute domain logic twice and mismatched duplicate IDs must not
  reach game-rule handlers (ADR-0119).
- `expectedVersion` is a domain/concurrency concern owned by domains / presented
  by Offline Sync — distinct from idempotency, not an Audit & Security replay
  decision.
- Does **not** own: authentication/accounts/roles/sessions/MFA (Identity &
  Access), domain command validation / legal-move rules / aggregate invariants
  (each owning context re-validates), the transactional outbox (ADR-0028
  infrastructure it consumes), or the canonical domain event store.
- Anomaly flags are advisory, not auto-truth unless very strong and explainable.
- GDPR by design: minimization + pseudonymization + retain-fact-sever-identifier
  on erasure, without breaking the hash chain.
- Strict storage isolation: own schema/tables only, no shared tables, no
  cross-context JOINs (ADR-0121).

## Open items

The sources fix the contract at fact/capability/decision granularity and
explicitly defer concrete shapes to the code phase:

- Concrete **Command / Query / Domain Event type names** are not enumerated in
  the ADRs/BCM; only the capabilities and fact categories above are defined.
- The **processed-command table/schema** and its platform-vs-per-save placement
  are a code-phase follow-up (ADR-0119 follow-ups).
- The **response replay envelope** for duplicate/pending outcomes is a future
  implementation schema (ADR-0119 D3/follow-ups).
- The **security-audit-log record schema** (fields, hash-chain/checkpoint
  format) is not specified at contract level.
- Detailed **moderation workflow + DSA-style reporting** is post-MVP
  (ADR-0091 Consequences); only foundations (audit log, flags) are defined now.

## Dependencies

- [[../09-Decisions/ADR-0091-audit-security-context-definition]] (context
  definition; draft — do not implement yet)
- [[../09-Decisions/ADR-0119-command-reception-dedup-seam]] (synchronous
  Command Reception replay/dedup seam)
- [[../09-Decisions/ADR-0097-postgres-scale-envelope-and-audit-canonicalisation]]
  (security trail vs outbox; no platform `audit_log` table)
- [[../09-Decisions/ADR-0027-postgres-data-model]] (data model + schema routing)
- [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
  (no shared tables / no cross-context JOIN)
