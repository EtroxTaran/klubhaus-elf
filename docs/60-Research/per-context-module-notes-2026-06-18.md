---
title: Per-Context Module Notes Surface
status: current
tags: [research, bounded-context, module-notes, context-map, ddd, fmx-169]
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-169
related:
  - [[raw-perplexity/raw-per-context-module-notes-2026-06-18]]
  - [[raw-perplexity/raw-per-context-module-notes-source-checks-2026-06-18]]
  - [[../40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/05-Building-Blocks]]
  - [[../10-Architecture/modules/match-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# Per-Context Module Notes Surface

FMX-169 asks whether the 28 bounded contexts need one module note each under
`docs/10-Architecture/modules/`, or whether
[[../10-Architecture/bounded-context-map]] §4 remains the only target surface for
folder/context mapping and public contract discovery.

This note is **research and recommendation only**. No context-note template,
module folder policy or canonical architecture surface changes until Nico
answers
[[../40-Execution/fmx-169-per-context-module-notes-decision-queue-2026-06-18]].

## Current FMX baseline

- [[../10-Architecture/bounded-context-map]] is currently the binding 28-context
  catalog, context map and source-folder mapping reference.
- [[../10-Architecture/05-Building-Blocks]] delegates the complete
  `src/domain/<context>` mapping to the bounded-context map.
- Existing files in [[../10-Architecture/modules/match-engine]] and sibling
  notes describe packages/substrates such as `@klubhaus-elf/db`,
  `match-engine`, `ui` and `web`. They are not a per-bounded-context catalog.
- ADR-0019 requires public exports/contracts and no cross-context database
  leakage. ADR-0089 makes the 28-context catalog the current ceiling under a
  review gate.

## Evidence Summary

| Evidence | Finding | FMX consequence |
|---|---|---|
| [[raw-perplexity/raw-per-context-module-notes-2026-06-18]] | Discovery recommended a hybrid: central context map for portfolio/edges, per-context notes for local public contracts. | Do not replace the map. If notes are adopted, make them local interface cards. |
| [[raw-perplexity/raw-per-context-module-notes-source-checks-2026-06-18]] | Microsoft and DDD Crew support clear bounded-context boundaries plus explicit public interfaces; AsyncAPI and game/engine examples support public contract docs but warn against duplicate schema truth. | Context notes should summarize responsibilities and contract surfaces, then link to ADRs/GDDRs/state machines/future generated schemas. |
| Current module notes | Package/module notes already use a thin Purpose/Owns/Inputs/Outputs/Invariants/Dependencies shape. | Per-context notes can reuse the concise style, but need inbound/outbound collaboration and owns/not-owns fields to avoid repeating the full map. |

## Options

### A. Central map only

Keep [[../10-Architecture/bounded-context-map]] §4 as the single target surface.
Do not create per-context notes.

Pros:

- Lowest maintenance and duplication risk.
- One canonical place for the 28-context catalog and folder mapping.
- Fits the current docs-only phase if many public contracts are still draft.

Cons:

- The map must carry every context's purpose, relationships, folder path and
  contract hints. At 28 contexts, this becomes harder to scan and update.
- Context-local questions such as "what does Match own and not own?" require
  reading multiple ADRs/GDDRs and map paragraphs.
- Future code agents may lack a context-local onboarding card when touching one
  `src/domain/<context>` folder.

### B. Per-context notes for all 28 now

Create a note for every bounded context under
`docs/10-Architecture/modules/contexts/` or a similar path in one pass.

Pros:

- Complete coverage and predictable navigation.
- Gives every future context folder an intended module card before code exists.
- Makes gaps visible through empty/open-question sections.

Cons:

- Highest duplication and churn risk while many context contracts remain draft
  or explicitly unresolved.
- Easy to accidentally ratify unsettled contract details by writing them as
  current module notes.
- Large same-PR surface area for a documentation-structure decision.

### C. Staged hybrid

Keep the bounded-context map as the canonical catalog, cluster map,
relationship topology and source-folder index. Add per-context module notes only
as local interface cards, starting with a first MVP-critical slice.

Pros:

- Keeps one central truth for context identity and edges.
- Gives high-coupling contexts local contract cards without forcing all 28 at
  once.
- Lets each note stay short and link to ADRs/GDDRs/state machines rather than
  duplicating full decisions.
- Matches source-checked guidance: context map for boundaries/relationships,
  local context card for public interface and collaboration.

Cons:

- Requires clear rules for which details live in the map vs a context note.
- Partial coverage must be labelled as intentional, not accidental.
- Later code-phase generated schemas need a sync rule so hand-written notes do
  not become stale contract sources.

## Recommendation

Recommend **C. Staged hybrid**.

Operational rule:

- `bounded-context-map` remains canonical for:
  - the 28-context catalog;
  - cluster membership;
  - relationship topology;
  - source-folder mapping;
  - global communication rules.
- A per-context note owns only:
  - short purpose and scope;
  - owns / does-not-own boundaries;
  - public command/query/event summaries;
  - inbound/outbound collaboration list;
  - invariants and timing/replay constraints;
  - links to ADRs/GDDRs/state machines/future generated schemas;
  - open questions.

Do not copy full ADR text, GDDR mechanics, state-machine tables or final schema
definitions into the notes. Link them.

## Candidate first slice

If Nico accepts per-context notes, start with eight contexts that sit on the
MVP-critical and highest-coupling seams:

| Context | Why first |
|---|---|
| Match | Deterministic simulation/event-log/replay authority, many consumers and draft ADR-0129. |
| League Orchestration | Season/week/fixture/deadline owner and standings source after FMX-131. |
| Squad & Player | Durable player/squad/availability/contract/discipline/injury facts and draft ADR-0131. |
| Training | Load/readiness/development signal owner and draft ADR-0130. |
| Tactics | Tactic snapshot, opposition templates and match lock-time contract. |
| Transfer | Market/offers/deadlines/escalation, cross-coupled with League, Squad, Club and Regulations. |
| Club Management | Ledger/budget/board/insolvency authority and many financial ACLs. |
| Offline Sync | Platform seam for hybrid-online offline UX, command queue/rebase and future collaboration mechanics. |

Audit & Security and Identity & Access should be the next platform slice if
Nico wants the first wave to favor security/governance over sporting depth.

## Candidate template

If D1/D2 in the decision queue are accepted, use this shape for each first-slice
note. The exact path remains a Nico decision.

```markdown
---
title: <Context> Context Module Note
status: current
tags: [architecture, bounded-context, module, <context-slug>]
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: module
binding: true
related:
  - bounded-context-map
  - 05-Building-Blocks
  - owning ADR/GDDR/state-machine notes
---

# <Context>

## Purpose

## Owns

## Does Not Own

## Public Contracts

### Commands

### Queries

### Events

## Inbound Collaborations

## Outbound Collaborations

## Invariants

## Timing / Replay Notes

## Dependencies

## Open Questions
```

## Open risks

- Some contexts have draft definition ADRs only. Their module notes must say
  "proposal only" until Nico accepts those ADRs.
- If all 28 notes are created before code exists, they may become a parallel
  schema catalog. That is the main reason not to recommend Option B.
- If no context notes are created, future implementation agents may keep adding
  contract details to `bounded-context-map`, making the map too dense for its
  primary role.
