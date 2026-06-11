---
title: ADR-0019 Service-ready Modular Monolith with DDD Bounded Contexts
status: accepted
tags: [adr, architecture, ddd, modular-monolith, service-architecture]
created: 2026-05-16
updated: 2026-06-11
accepted_at: 2026-05-16
type: adr
binding: true
related: [[../bounded-context-map]], [[ADR-0011-server-authoritative-multiplayer]], [[ADR-0028-postgres-transactional-outbox]], [[ADR-0014-state-machines]], [[../../60-Research/raw-perplexity/raw-architecture]]
---

# ADR-0019: Service-ready Modular Monolith with DDD Bounded Contexts

> **History**: This ADR was originally numbered 0010 during Wave 3 work.
> It was renumbered to 0019 on merge into main when an existing
> `ADR-0010-design-system` was discovered. Content is unchanged from the
> 2026-05-16 acceptance; only the ADR number was rotated.

## Status

accepted

> Ratified `accepted` 2026-06-08 in the vault-wide ratification sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read "Accepted
> (2026-05-16, gap B1 of [[../../95-Archive/gap-reports/wave-3-gap-analysis]]).". Body status
> reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

## Context

The product requires a **service architecture** in which individual
components (Training, Match Engine, Notifications, Watch Party, etc.) can
be re-developed and replaced without rewriting the surrounding system,
and the system must be able to **scale individual services
independently** later. Nico's direction is explicit: "Prepare complete
modular Architecture and ready to have full service architecture, and
modular structure, so we can re-develop single systems and also have
maximum scalability possibility."

At the same time the team is small, the product is pre-MVP, and the
operational overhead of running distributed microservices on day one
would crush velocity (deployment complexity, network failure handling,
observability, distributed tracing, schema versioning across services).

Wave-2 research (raw at [[../../60-Research/raw-perplexity/raw-architecture]],
synthesised in this ADR) converges on a **service-ready modular monolith**
as the best stage-1 compromise: every bounded context is built as if it
were a separate service, but in MVP they share a runtime + deployable. No
code changes are needed to split a context out later - only deployment
and infrastructure changes.

## Decision

Build the application as a **service-ready modular monolith with DDD
bounded contexts** in TypeScript.

Three rules together encode "service-ready":

1. **One deployable, many bounded contexts.** The MVP ships as one
   Node.js / TanStack Start process. Inside it, the bounded contexts live
   under `src/domain/<context>/` and communicate only through their
   public contracts.
2. **Network-transparent contracts.** Every contract (commands, queries,
   domain events) is JSON-serialisable and routed through a transport
   abstraction. In MVP the transport is an in-process bus; the same
   contract can be carried by HTTP, gRPC or a message broker without
   touching domain code.
3. **Storage isolation.** Each context owns its own Postgres tables
   ([[ADR-0027-postgres-data-model]]). Cross-context reads go through
   the *queries* layer of the owning context. No JOIN across context
   boundaries (no cross-context FKs; opaque branded-`uuid` refs only).
   No "shared lookup tables" that bypass the rule.

### The bounded contexts

The canonical context catalog and count live in [[../bounded-context-map]]
(reconciled in [[ADR-0089-bounded-context-portfolio-reconciliation]]); this ADR
is count-agnostic and owns only the modular-monolith *style*. The list below is
illustrative of the original core set:

- Identity & Access
- League Orchestration
- Club Management
- Squad & Player
- Training
- Transfer
- Match
- Watch Party
- Notification
- Offline Sync
- Audit & Security

### Implementation conventions

- Code lives under `src/domain/<context>/` with a stable folder layout:
  `commands.ts`, `events.ts`, `queries.ts`, `state-machine.ts` (if any),
  `policies.ts`, `repository.ts`, `index.ts` (the only file outsiders
  may import from).
- `index.ts` re-exports **only** the public contract: command types,
  query types, event types. Domain entities + policies + repositories
  are private.
- Inter-context calls go through a `Bus` interface (commands + events) +
  a `QueryGateway` interface (queries). In MVP both are in-process; the
  same call site works against a network implementation later.
- Domain events publish through the transactional outbox per
  [[ADR-0028-postgres-transactional-outbox]].
- Server-authority rules per [[ADR-0011-server-authoritative-multiplayer]].
- State machines per [[ADR-0014-state-machines]].

### Considered alternatives

| Option | Rejection reason |
|---|---|
| **Pure microservices from day one** | Operational complexity (CI/CD, observability, schema versioning across services) too high for a small team pre-MVP |
| **Layered monolith (no bounded contexts)** | Fails the explicit user requirement of swap-ability and scale-up of individual subsystems |
| **Modular monolith without network-transparent contracts** | Cheaper to build but locks the codebase to single-process deployment; later extraction would require touching every call site |
| **Service-ready modular monolith (this ADR)** | Slightly higher up-front discipline (contract design, no shortcuts) in exchange for free service extraction whenever load demands it |

## Consequences

### Positive

- Every context is replaceable on its own without touching the rest of
  the system.
- Service extraction (move Match worker, Job scheduler, Spectator
  service, etc. to its own process / pod) is a deployment change, not a
  refactor.
- Tests can run per-context with minimal mocking; contracts are the
  test surface.
- Storage isolation prevents the classic "shared table" trap that
  destroys swap-ability.
- Scaling individual services independently is a future-proofed option.

### Negative

- More discipline required than a layered monolith: contracts have to
  be JSON-serialisable, transport-agnostic, version-compatible.
- More files / folders than a naive layered approach.
- Some performance overhead vs direct cross-context method calls
  (negligible in MVP because the bus is in-process; acceptable later).
- Cross-context features need explicit event design - cannot just
  "join tables".

### Future

- Extraction order when load demands it (anticipated):
  1. **Match worker** - heaviest CPU + needs anti-cheat isolation.
  2. **Job scheduler / Outbox publisher** - long-running supervisor.
  3. **Spectator service** - high fan-out, naturally separate from
     match worker per [[ADR-0015-spectator-snapshot-streaming]].
  4. **Notification service** - independent scaling per push volume.
- The remaining seven contexts likely stay co-located unless a real
  scaling signal forces a split.

## Compliance

The following compliance rules apply to all new code touching
`src/domain/`:

- New code MUST live in exactly one context folder.
- Imports from another context MUST go through `index.ts` only.
- No raw Postgres query may cross a context boundary
  ([[ADR-0027-postgres-data-model]] §8 `QueryGateway`).
- All commands, events and queries MUST be JSON-serialisable (Zod
  schemas).
- Bus + QueryGateway abstractions MUST be used; direct function calls
  across contexts are forbidden.
- Domain events MUST publish through the transactional outbox per
  [[ADR-0028-postgres-transactional-outbox]].
- New cross-context dependencies require an explicit entry in
  [[../bounded-context-map]] §2 (the dependency map).

CI enforcement:

- Lint rule blocks `src/domain/X/**` from importing
  `src/domain/Y/!index.ts`.
- Test rule asserts every context's `index.ts` re-exports only
  contract types (no domain entities).

## Sources

- [[../../60-Research/raw-perplexity/raw-architecture]] §1, §3, §15-§16.
- DDD references cited in raw note §17: software-architecture-guild,
  oneuptime, dook.pro modular monolith vs microservices.
- Wave 3 gap B1 Q&A with Nico (2026-05-16): Nico requested *maximum
  service-architecture readiness* for future scalability and
  independent re-development of individual systems.
