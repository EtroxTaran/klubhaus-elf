---
title: Audit & Security context — definition grounding 2026-06-07
status: draft
tags: [research, audit, security, anti-abuse, replay-protection, gdpr, ddd, fmx-104]
created: 2026-06-07
updated: 2026-06-15
type: research
binding: false
sourceType: external
related:
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[replay-dedup-ownership-seam-offline-sync-vs-audit-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../30-Implementation/audit-trail]]
---

# Audit & Security — context-definition grounding (2026-06-07)

Closes the "thin/undefined" Audit & Security context. The bounded-context map lists only "command log,
replay protection, abuse detection, audit trail, anomaly flags" with no design. ADR-0091 defines it.

> **FMX-164 amendment note (2026-06-15):** this 2026-06-07 research remains the
> grounding for ADR-0091, but ADR-0119 is now the binding owner/order seam for
> replay/dedup. `expectedVersion` conflicts are distinct concurrency/rebase
> results owned by the domain/server response and Offline Sync UX, while
> Audit & Security owns replay/dedup policy and processed-command state through
> Command Reception.

## Open calls

- **D1 — own bounded context vs cross-cutting concern.**
- **D2 — security audit log vs reuse of the domain event store.**

## What best practice says (Perplexity Sonar, 2026-06-07)

- **D1 → model it as an explicit but NARROW bounded context** (a *supporting/generic* subdomain), not a
  rich core domain and not invisible plumbing. It earns a boundary because it has distinct invariants,
  data lifecycles, retention rules and access controls. Its job is to **observe, record, verify, flag**
  — never to decide game rules or own canonical game state.
- **D2 → separate the security audit log from the domain event store.** Event sourcing answers "how did
  game state change?"; the **security audit log** answers "who attempted what, under which security
  decision, with what evidence?" (command reception, auth/authz decisions, idempotency/replay
  rejections, rate-limit triggers, anomaly flags, moderation actions). Don't overload domain events with
  security concerns; don't rebuild game state from the audit log.
- **Audit log design:** append-only, write-once; **tamper-evidence via per-record hash-chaining +
  periodic signed checkpoints** (Merkle batching for efficient verification); log security-relevant
  *facts* (who/what/when/why/integrity-metadata), **not** raw PII/secrets/payloads; purpose-based,
  minimized **retention** (hot/warm/cold tiers + anonymized summaries).
- **Replay protection is layered:** idempotency `commandId` + per-session nonce + monotonic `sequenceNo`
  + `expectedVersion` optimistic concurrency + a processed-command dedup store + short expiry window.
  This composes directly with ADR-0090's command envelope.
- **Anti-cheat = server authority:** the deterministic server **re-simulates/validates** every command
  against canonical state, rejects impossible states (turn order, delta bounds, ownership, unreachable
  transitions), rate-limits, and emits **anomaly scores as flags** (not auto-truth). **P2P watch-party
  must be non-authoritative** — peer messages are presence/chat/UX hints; any peer-originated action
  routes through the same authenticated server command pipeline; log peer-graph/co-participation to
  detect collusion.
- **GDPR interplay:** immutable audit ≠ GDPR exemption. **Pseudonymize** identifiers, minimize, access-
  control/encrypt sensitive fields, document lawful basis (legitimate interest / legal obligation),
  short raw-log retention. Right-to-erasure pattern: **retain the audit fact, sever/rotate the
  re-identification lookup** rather than deleting the chain.

## Recommendation

- **D1 = own narrow bounded context.** Owns: the security audit log schema + tamper-evidence; replay-
  detection / command-dedup state; abuse/anomaly scoring + flags + moderation-workflow hooks; retention/
  redaction policy. Does **not** own: domain command validation (each context re-validates its own),
  authentication/accounts/sessions (Identity & Access), or the transactional outbox (ADR-0028
  infrastructure). Rule of thumb: *observe, record, verify, flag — never decide game rules.*
- **D2 = separate security audit log** from the domain event store; consume domain events + command
  metadata via the outbox, never join into other contexts' tables.

## Sources

Perplexity Sonar 2026-06-07 (event-store vs security audit log separation; hash-chain/Merkle
tamper-evidence; layered replay protection; server-authoritative anti-cheat + anomaly flags; P2P
collusion; GDPR immutable-audit vs erasure; bounded-context-vs-cross-cutting framing — Fowler bliki,
software-architecture-guild, dzone). Existing [[../30-Implementation/audit-trail]].
