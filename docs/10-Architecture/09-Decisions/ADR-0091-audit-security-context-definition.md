---
title: ADR-0091 Audit & Security — context definition
status: accepted
tags: [adr, architecture, ddd, audit, security, anti-abuse, replay-protection, gdpr, fmx-104]
created: 2026-06-07
updated: 2026-06-11
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../bounded-context-map]]
  - [[../../60-Research/audit-security-context-definition-2026-06-07]]
  - [[../../30-Implementation/audit-trail]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0091: Audit & Security — context definition

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `proposed`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`proposed` / `binding: false`.** Authored 2026-06-07 to close the Audit & Security "thin/undefined"
> gap surfaced in the open-decisions sweep. Defines the scope of the already-ratified **Audit &
> Security** bounded context (no map-row change — the context exists; this ADR fixes its internals).
> Awaiting Nico ratify.

## Date

2026-06-07

## Context

The bounded-context map lists **Audit & Security** with only "command log, replay protection, abuse
detection / audit trail, anomaly flags" and no design. It is one of the two thinnest contexts. The
backend is deterministic and event-sourced with a transactional outbox (ADR-0028); the server is the
single authority; async P2P watch-party adds untrusted peer surfaces; the PWA client queues commands
(ADR-0090). GDPR/privacy obligations apply. What it owns vs what stays in Identity / each domain / the
outbox has never been pinned down.

## Options considered

### D1 — bounded context vs cross-cutting concern

- **A. Own narrow bounded context** (explicit boundary; supporting/generic subdomain that observes,
  records, verifies, flags). **← recommended.**
- **B. Pure cross-cutting concern / library** scattered across contexts (no clear ownership, weak
  forensics boundary, retention/redaction policy diffuse).
- **C. Rich core security domain** (over-scoped; security ops are not a core business capability here).

### D2 — security audit log vs domain event store

- **A. Separate security audit log**, distinct from the domain event store. **← recommended.**
- **B. Reuse domain events as the audit trail** (overloads domain events with security concerns; can't
  cleanly answer "who attempted what under which decision").

## Decision

Propose, awaiting Nico: **D1 = A, D2 = A.** Keep **Audit & Security** as an *explicit but narrow*
bounded context whose mandate is **observe, record, verify, flag — never decide game rules or own
canonical game state**, backed by a **separate security audit log**.

If ratified, Audit & Security owns:

- **Security audit log** (append-only, write-once) — separate from the domain event store; records
  command reception, auth/authz decisions, idempotency/replay rejections, rate-limit triggers, anomaly
  flags and moderation actions as security *facts* (who/what/when/why + integrity metadata), **not** raw
  PII/secrets/payloads.
- **Tamper-evidence** — per-record **hash-chaining** + periodic **signed checkpoints** (Merkle batching
  for efficient verification); separated signing keys, least-privilege access.
- **Replay-protection / dedup state** — the processed-`commandId` store + nonce/`sequenceNo`/
  `expectedVersion`/expiry verification that backs ADR-0090's command envelope.
- **Abuse / anomaly scoring + flags** and **moderation-workflow hooks** (review queue / sanction
  signals); flags are advisory, not auto-truth, unless very strong and explainable.
- **Retention + redaction policy** for security evidence (hot/warm/cold tiers; pseudonymized
  identifiers; GDPR severing of re-identification lookups on erasure).

Audit & Security does **not** own:

- Domain command validation / legal-move rules / aggregate invariants (each owning context re-validates
  its own commands; the server re-simulates deterministically).
- Authentication, accounts, roles, sessions, MFA (Identity & Access).
- The transactional outbox / reliable event publication (ADR-0028 infrastructure) — Audit & Security
  *consumes* domain events + command metadata via the outbox, never joins other contexts' tables.
- The canonical domain event store (game/domain contexts).

## Rationale

A deterministic, server-authoritative, event-sourced game makes **server re-validation/re-simulation**
the strongest anti-cheat, and makes the security audit log a distinct concern from the domain event
store: the event store answers "how did game state change?", the audit log answers "who attempted what,
under which security decision, with what evidence?". Conflating them pollutes the domain model and
weakens forensics. The boundary is justified by distinct invariants, retention rules and access
controls — but it stays narrow (a supporting/generic subdomain), because security operations are not a
core business capability and the context must not own game rules. Layered replay protection
(idempotency + nonce + sequence + expected-version + dedup + expiry) and non-authoritative P2P are the
canonical defenses for async multiplayer; GDPR is satisfied by minimization + pseudonymization +
retain-fact-sever-identifier rather than breaking the hash chain.

## Consequences

Positive:

- Closes the Audit & Security "undefined" gap with a ratifiable, bounded scope.
- Clean separation: domain event store stays pure; security evidence is tamper-evident + investigable.
- Replay-protection state has a named owner that composes with ADR-0090's command envelope.
- GDPR-compatible by design (minimization, pseudonymization, severable re-identification).

Negative:

- Requires hash-chain + signed-checkpoint plumbing and a dedup store (modest infra).
- Anomaly scoring is a tuning surface (FMX-52-style calibration) — ship rules-based detection first,
  scoring later.
- Detailed moderation workflow + DSA-style reporting (shared with ADR-0059 community surface) is
  post-MVP; foundations (audit log, flags) are defined now.

## Supersedes

None. Complements ADR-0028 (outbox), ADR-0090 (command envelope) and Identity & Access.

## Related Docs

- [[../../60-Research/audit-security-context-definition-2026-06-07]] - grounding (event-store vs audit
  log; tamper-evidence; replay protection; anti-cheat; GDPR; BC-vs-cross-cutting).
- [[ADR-0028-postgres-transactional-outbox]] - event delivery infra Audit & Security consumes.
- [[ADR-0090-offline-sync-scope-and-conflict-strategy]] - command envelope (idempotency +
  expected-version) whose dedup/replay state Audit & Security owns.
- [[ADR-0027-postgres-data-model]] - per-save / platform schema convention.
- [[ADR-0019-modular-monolith-ddd]] - modular-monolith ground rules.
- [[../../30-Implementation/audit-trail]] - existing audit-trail implementation note.
- [[../bounded-context-map]] - Audit & Security context (scope fixed by this ADR; no map row change).
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A.
