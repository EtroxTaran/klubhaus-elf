---
title: State Machine - Audit & Security
status: draft
tags: [architecture, state-machine, audit, security, anti-abuse, replay-protection, command-reception]
context: audit-security
created: 2026-06-20
updated: 2026-06-20
type: state-machine
binding: false
related:
  - [[README]]
  - [[../bounded-context-map]]
  - [[../09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../09-Decisions/ADR-0014-state-machines]]
  - [[../09-Decisions/ADR-0119-command-reception-dedup-seam]]
  - [[../09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../09-Decisions/ADR-0027-postgres-data-model]]
  - [[../09-Decisions/ADR-0123-identity-access-context-definition]]
  - [[../09-Decisions/ADR-0127-erasure-vs-hgb-retention-field-partition]]
  - [[../../30-Implementation/audit-trail]]
---

# State Machine - Audit & Security

> **Draft.** Transcribes the stateful surface that ADR-0091 (Audit & Security
> context definition) and its amendment ADR-0119 (Command Reception dedup seam)
> define. Audit & Security is an *explicit but narrow* supporting/generic
> subdomain whose mandate is **observe, record, verify, flag — never decide game
> rules or own canonical game state** (ADR-0091). Most of what the context owns
> (the append-only security audit log, hash-chaining, anomaly scoring) is
> **stateless record-keeping or signal computation**, not a finite-state machine.
> The one genuinely stateful FSM the ADRs pin down is the **processed-command
> lifecycle** behind the synchronous Command Reception dedup/replay gate
> (ADR-0119 §D3). This note transcribes only that. Everything the source leaves
> open is under [Open decisions](#open-decisions); nothing below invents
> thresholds, timers or transitions.

## 1. `ProcessedCommand` — Command Reception dedup/replay lifecycle

Per ADR-0119, Audit & Security owns the **processed-`commandId` store** and the
replay/dedup policy exposed through a **synchronous Command Reception capability**
that runs **before domain validation**. The state below is keyed by the
`commandId` idempotency key (ADR-0115 §D2) together with its first-seen canonical
payload hash and actor/session/save/run/aggregate binding.

The canonical command path that this gate sits on (ADR-0119 §D2):

```text
Receive command
-> auth/session binding          (Identity & Access — ADR-0123)
-> canonical payload hash        (ADR-0115 §D14)
-> commandId dedup/replay gate   (Audit & Security — THIS FSM)
-> domain validation             (owning domain context)
-> expectedVersion / append      (owning domain context)
-> outbox + security facts       (ADR-0028 outbox; Audit & Security facts)
```

```mermaid
stateDiagram-v2
    [*] --> processing: Unseen commandId (first request)
    processing --> accepted_final: Domain outcome final (success / domain rejection / final concurrency result)
    processing --> replay_rejected: Mismatched duplicate observed mid-flight (different hash or binding)
    accepted_final --> accepted_final: Retry — same commandId + same hash + same binding (return stored outcome)
    processing --> processing: Retry — same commandId + same hash + same binding, first request still pending (return pending/accepted; do not re-dispatch)
    replay_rejected --> replay_rejected: Retry of mismatched duplicate (re-rejected as security fact)
    accepted_final --> [*]
    replay_rejected --> [*]
```

### State definitions

| State | Meaning |
|---|---|
| `processing` | First request for an unseen `commandId` is in flight: it has passed auth/session binding + canonical payload hashing and is past the dedup gate, awaiting (or running) domain validation, `expectedVersion` append and outcome. The first stored outcome is not yet final. |
| `accepted_final` | The first request reached a **final** stored outcome — success, domain rejection **or** final concurrency result (ADR-0119 §D3). The outcome is cached so that same-`commandId` + same-hash + same-binding retries replay it. |
| `replay_rejected` | A duplicate arrived with the same `commandId` but a **different** canonical payload hash or a different actor/session/save/run/aggregate binding. Rejected before domain validation as replay misuse and recorded as a security fact (ADR-0119 §D3; ADR-0115 §D2). |

> Note: ADR-0119 §D3 also defines a *different*-`commandId` + stale
> `expectedVersion` case, but that returns a **domain/concurrency result that
> Offline Sync presents or rebases** — it is explicitly *not* a replay/dedup
> state of this FSM (ADR-0091, ADR-0119 §D2/§D3). It is therefore not a state or
> transition here.

### Transitions (transcribed from ADR-0119 §D3 duplicate-semantics table)

| From | To | Trigger (incoming request) | Result returned |
|---|---|---|---|
| `[*]` | `processing` | Unseen `commandId` | Continue to domain validation + `expectedVersion` append (ADR-0119 §D3 row 1) |
| `processing` | `accepted_final` | First request reaches a final outcome | Store first outcome (success / domain rejection / final concurrency result) |
| `processing` | `processing` | Same `commandId`, same hash + binding, **first request still pending** | Return pending/accepted status; do **not** dispatch a second command (§D3 row 3) |
| `processing` | `replay_rejected` | Same `commandId`, **different** hash or binding, observed while first is in flight | Reject before domain validation as replay misuse / security fact (§D3 row 4) |
| `accepted_final` | `accepted_final` | Same `commandId`, same hash + binding, **first request final** | Return the first stored outcome (§D3 row 2) |
| `accepted_final` | `replay_rejected` | Same `commandId`, **different** hash or binding | Reject as replay misuse / security fact (§D3 row 4) |
| `replay_rejected` | `replay_rejected` | Further mismatched duplicate of the same `commandId` | Re-reject; record security fact |

### Terminal states

- `accepted_final` and `replay_rejected` are terminal for the *outcome* of the
  first request: once final, all matching retries replay the stored result and
  all mismatched duplicates are rejected. ADR-0119 does **not** define a TTL,
  expiry or eviction transition out of these states — see
  [Open decisions](#open-decisions).

### Guards / preconditions

| Guard | Source | Notes |
|---|---|---|
| Auth/session binding established | ADR-0119 §D2; Identity & Access (ADR-0123) | Runs before the dedup gate; binding identity is part of the dedup key. |
| Canonical payload hash computed | ADR-0115 §D14; ADR-0119 §D2 | Versioned canonical JSON/JCS representation; hash is part of the dedup match. |
| Mutating command only | ADR-0115 §D1/§D2 | Idempotency/dedup applies to mutating commands carrying the ADR-0115 envelope (`commandId`, `expectedVersion`, hash, signature evidence). |
| Signature evidence present | ADR-0115 §D1/§D13 | Mandatory **evidence**, not authority. Invalid/missing-signature handling for verified/public paths is defined by ADR-0115 §D13 (roll back / rebase to last accepted server checkpoint), **not** by this dedup FSM. |
| First-accept atomicity with domain append | ADR-0119 Consequences | "First-accept atomicity must be specified with the domain append transaction" — flagged as a code-phase item, not pinned here. |

## 2. Triggers / inputs

| Trigger | Source |
|---|---|
| Incoming mutating command (with `commandId`, canonical hash, binding, signature evidence) | Client / Offline Sync queue flush (ADR-0090, ADR-0115 §D2) routed through the synchronous Command Reception gate (ADR-0119 §D1) |
| Command-reception security fact recorded (accepted / duplicate / pending / rejected) | Emitted by Audit & Security on every reception decision (ADR-0119 §D4) — security audit facts, not domain events, not raw payloads |
| Committed domain events + command metadata (async) | Consumed from the ADR-0028 transactional outbox for projections, forensics and anomaly scoring; **not** the authoritative duplicate-command decision (ADR-0119 §D4) |

## 3. What this FSM does *not* own

Per ADR-0091 "does not own" and ADR-0119 §D1:

- Domain command validation / legal-move rules / aggregate invariants (each owning context; server re-simulates).
- Authentication, accounts, roles, sessions, MFA (Identity & Access — ADR-0123).
- The transactional outbox / reliable event publication (ADR-0028 infra; Audit & Security *consumes* it).
- The canonical domain event store (game/domain contexts).
- `expectedVersion` concurrency conflicts — those are domain/concurrency results Offline Sync presents or rebases (ADR-0091, ADR-0119 §D2/§D3).
- The client-side command queue, retry/backoff, offline UX and rebase flow (Offline Sync — ADR-0090, ADR-0119 §D1).

## 4. Non-FSM owned surfaces (stateless / signal — not modelled here)

ADR-0091 lists these as owned by Audit & Security but they are append-only
record-keeping or signal computation, not finite-state lifecycles, so they are
intentionally **not** drawn as state machines:

- **Security audit log** — append-only, write-once facts (who/what/when/why + integrity metadata; no raw PII/secrets/payloads).
- **Tamper-evidence** — per-record hash-chaining + periodic signed checkpoints (Merkle batching).
- **Abuse / anomaly scoring + flags** — advisory signals; "ship rules-based detection first, scoring later" (ADR-0091 Consequences). Any review-queue / sanction / moderation **workflow** state machine is explicitly **post-MVP** in ADR-0091 and is not defined here.
- **Retention + redaction policy** — hot/warm/cold tiers, pseudonymization, GDPR severing of re-identification lookups on erasure (see ADR-0127 for erasure-vs-retention field partition). Tier-transition rules and timers are not pinned (see Open decisions).

## 5. Persistence model

Per-save / platform schema convention per ADR-0027. ADR-0119 explicitly defers
the concrete table to the code phase: *"Define the processed-command
table/schema when code-phase persistence is authored"* and *"Define the response
replay envelope in the first command API contract."* No column-level schema is
transcribed here because the source does not define one. Known shape constraints
the ADRs do state:

- A **processed-command store** keyed by `commandId`, storing at minimum the first
  canonical payload hash, the actor/session/save/run/aggregate binding and the
  first stored outcome (so matching retries replay it) — derived from ADR-0119 §D3.
- Security audit minimization: store **hashes, reason codes and binding
  evidence**, not raw sensitive payloads (ADR-0119 Costs/constraints; ADR-0091).
- Security audit log is **separate** from the domain event store (ADR-0091 §D2 = A).

## 6. Rejection reason codes

ADR-0119 §D3 distinguishes accepted / duplicate-final / duplicate-pending /
replay-rejected outcomes but does **not** enumerate a closed `reason` code set
for the response envelope (it states the envelope "is a future implementation
schema, but it must preserve this distinction"). The concrete reason-code
vocabulary is therefore an Open decision, not invented here.

## Open decisions

The following are referenced or implied but **not pinned** by ADR-0091 / ADR-0119
/ ADR-0115 and must not be invented at FSM-transcription time:

- **Dedup-record expiry / TTL / eviction.** ADR-0091 names "nonce/`sequenceNo`/
  **expiry** verification" backing the command envelope, but no expiry duration,
  nonce-window size or processed-command retention horizon is given. No
  transition out of `accepted_final` / `replay_rejected` (eviction/expiry) is
  defined.
- **First-accept atomicity mechanism.** ADR-0119 flags that first-accept
  atomicity "must be specified with the domain append transaction" — the exact
  transactional boundary / locking is deferred to the code phase.
- **`pending` retry timing/backoff semantics.** The `processing` (pending)
  state returns a "pending/accepted status" but no timeout, max-retry or
  promotion-to-failure rule for a stuck in-flight first request is defined.
- **Response replay envelope + closed reason-code set.** The exact response
  envelope and the enumerated rejection `reason` codes are explicitly future
  implementation schema (ADR-0119 §D3, Follow-ups).
- **Anomaly scoring thresholds / abuse-flag state machine.** ADR-0091 defers
  scoring calibration (FMX-52-style) and the moderation/review-queue workflow to
  post-MVP; no scores, thresholds, decay constants or sanction-workflow
  transitions are defined.
- **Retention-tier transition rules.** Hot/warm/cold tier boundaries, durations
  and the erasure-vs-retain field partition mechanics (ADR-0127) are policy, not
  an FSM the source draws; no tier-transition timers are stated.
- **Whether `replay_rejected` is per-request or sticky per `commandId`.** §D3
  rejects mismatched duplicates but does not state whether a single mismatch
  permanently "poisons" the `commandId` for all future requests or is evaluated
  per incoming request; modelled above as a re-evaluated reject without inventing
  a sticky-poison rule.
