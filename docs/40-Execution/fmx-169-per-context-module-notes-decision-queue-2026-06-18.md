---
title: FMX-169 Per-Context Module Notes Decision Queue
status: draft
tags: [execution, decision-queue, bounded-context, module-notes, context-map, ddd, fmx-169]
created: 2026-06-18
updated: 2026-06-18
type: decision-queue
binding: false
linear: FMX-169
related:
  - [[../60-Research/per-context-module-notes-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-per-context-module-notes-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-per-context-module-notes-source-checks-2026-06-18]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/05-Building-Blocks]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# FMX-169 Per-Context Module Notes Decision Queue

## Status

Awaiting Nico. This queue records recommendations only. No per-context module
notes, template path, or canonical architecture-doc ownership rule is binding
until Nico answers.

## D1 - Target Documentation Surface

Options:

- **A. Central map only.** Keep
  [[../10-Architecture/bounded-context-map]] §4 as the single surface for all 28
  context/folder mappings and public-contract pointers.
- **B. Per-context notes for all 28 now.** Create one module note for every
  bounded context in a single FMX-169 pass.
- **C. Staged hybrid.** Keep the map as the canonical catalog/edge/folder index
  and create short per-context interface cards only for a first MVP-critical
  slice.

Recommendation: **C.**

Reason: Source checks support a central context map plus local bounded-context
interface cards. A keeps maintenance low but overloads the map. B gives full
coverage but risks ratifying unsettled contracts and duplicating ADR/GDDR/schema
truth too early.

## D2 - First Slice

Options:

- **A. Eight-context MVP/coupling slice:** Match, League Orchestration, Squad &
  Player, Training, Tactics, Transfer, Club Management, Offline Sync.
- **B. Platform/security-first slice:** Match, League Orchestration, Squad &
  Player, Club Management, Offline Sync, Audit & Security, Identity & Access,
  Regulations & Compliance.
- **C. Template-only now.** Create no context notes until more definition ADRs
  are accepted.

Recommendation: **A.**

Reason: A covers the first playable sporting/economy flow and the most common
implementation seams. B is defensible if Nico wants security/governance
discoverability first, but it leaves Training/Tactics/Transfer without local
cards despite their heavy Match/Squad coupling. C is safest for duplication, but
does not solve the agent-onboarding gap that FMX-169 identifies.

## D3 - Template Required Fields

Options:

- **A. Thin package-note shape.** Purpose, Owns, Inputs, Outputs, Invariants,
  Dependencies.
- **B. Bounded-context interface card.** Purpose, Owns, Does Not Own, Public
  Contracts, Inbound/Outbound Collaborations, Invariants, Timing/Replay Notes,
  Dependencies and Open Questions.
- **C. Formal contract catalog.** Include detailed commands/events/queries with
  schema-like fields in each note.

Recommendation: **B.**

Reason: B is enough to clarify context ownership and public interface without
turning notes into duplicate schemas. A misses inbound/outbound collaboration
and non-ownership boundaries. C should wait for generated or code-backed
contract docs.

## D4 - Drift and Sync Rule

Options:

- **A. Manual same-PR rule now.** Any public-contract or ownership wording change
  updates the owning context note and the map edge if needed.
- **B. Add future code-phase CI.** Once `src/domain/<context>` exists, CI checks
  that each context folder links to a module note and generated contracts.
- **C. Generated docs only later.** Do not maintain hand-written context notes
  after code exists.

Recommendation: **A now, B later.**

Reason: In the docs-only phase, manual same-PR updates are the only real control.
When code exists, a lightweight CI/reference check should protect note/map/code
drift. C is attractive for schema detail, but generated docs will not replace
human-readable ownership and collaboration notes.

## Consolidated Recommendation

Approve **D1=C, D2=A, D3=B, D4=A now / B later**.

Operational interpretation:

- `bounded-context-map` remains the canonical 28-context catalog, cluster map,
  source-folder mapping and relationship topology.
- Per-context notes become short interface cards, not full ADRs or schema
  catalogs.
- First wave: Match, League Orchestration, Squad & Player, Training, Tactics,
  Transfer, Club Management and Offline Sync.
- Each note links to the accepted/proposed ADRs, GDDRs, state machines and
  future generated schemas instead of copying them.
- The branch should create the template and first notes only after Nico answers.

## Nico Decision Log

Pending.
