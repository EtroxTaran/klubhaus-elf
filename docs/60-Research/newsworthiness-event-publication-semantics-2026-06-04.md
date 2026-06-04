---
title: Newsworthiness event-publication semantics
status: current
tags: [research, narrative, newsworthiness, events, contracts, ddd, fmx-83]
created: 2026-06-04
updated: 2026-06-04
type: research
related:
  - [[raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
  - [[../30-Implementation/ai-narration-contract-testing-framework]]
  - [[domain-model-audit-and-backlog-2026-06-02]]
---

# Newsworthiness event-publication semantics (FMX-83)

Grounds FMX-83 / gap G14. Raw capture:
[[raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]].

Promoted source checks:

- Reuters Handbook of Journalism:
  <https://www.mediareform.org.uk/wp-content/uploads/2015/12/Reuters_Handbook_of_Journalism.pdf>
- Football injury consensus statement:
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10646851/> and
  <https://bjsm.bmj.com/content/57/21/1341>
- FIFA judicial bodies / Disciplinary Code:
  <https://inside.fifa.com/legal/judicial-bodies> and
  <https://digitalhub.fifa.com/m/1b1c85f7bbc8b3e6/original/i8zsik8xws0pyl8uay9i-pdf>
- Football Manager official UI/news surface references:
  <https://www.footballmanager.com/news/development-update-football-manager-25>
  and <https://www.footballmanager.com/fm26/features/fm26s-reimagined-user-interface>
- Failbetter storylet structure:
  <https://www.failbettergames.com/news/echo-bazaar-narrative-structures-part-two>
  and
  <https://www.failbettergames.com/news/storynexus-developer-diary-2-fewer-spreadsheets-less-swearing>
- Microsoft DDD event references:
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation>
  and
  <https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/integration-event-based-microservice-communications>
- Zod 4 API docs:
  <https://zod.dev/api#discriminated-unions>,
  <https://zod.dev/api#json>,
  <https://zod.dev/v4/changelog#deprecates-strict-and-passthrough>

## 1. Problem

ADR-0054 and ADR-0065 define Narrative as the owner of storylet selection,
templates, fallback rendering and press/media authoring, but gap G14 asks a
different question: how does Narrative learn that a domain fact is newsworthy
without becoming a hidden reader of Squad, Transfer, Club Management or
Discipline state?

The missing contract is a published-language layer between owning domains and
Narrative:

```text
source context fact
  -> source-owned publication decision
  -> self-contained newsworthy fact event
  -> NarrativeNewsFactProjection
  -> storylet/article/inbox/feed surfaces
```

The source context decides that a fact exists and whether it is publishable.
Narrative decides which content surface uses the snapshot and how it is
phrased. Notification delivers the resulting display snapshot.

## 2. Decisions recorded for FMX-83

Nico selected FMX-83 as the next issue and then said "go on". The decisions
below are authored as recommended proposed defaults, not ratified architecture
decisions.

| # | Decision question | Proposed default |
|---|---|---|
| D1 | Generic narrative fact event vs distinct source events | **Distinct publisher-owned events plus shared Narrative projection.** Each source context keeps its ubiquitous language; Narrative normalises into a projection/checklist. |
| D2 | Transfer rumour origin | **Transfer emits the rumour publication fact.** Narrative may render and vary prose but may not invent rumour truth or market state. |
| D3 | `PlayerSuspended` boundary | **Consume only.** FMX-80/Discipline remains sole schema owner; FMX-83 lists projection requirements so Narrative can consume it later. |
| D4 | Payload granularity | **Banded, display-ready snapshots.** Include display names, context, bands, source/confidence/legal/privacy metadata and salience inputs; exclude raw internals and consumer joins. |

## 3. Design conclusions

- Newsworthiness is a source-domain publication decision, not a Narrative
  permission to query for interesting facts.
- Narrative events are integration events, not internal domain events. They
  need stable envelopes, idempotency, schema versions and enough denormalized
  display data for a consumer projection.
- Every event needs source metadata. Rumours, official reports and inferred
  pressure are not the same kind of claim.
- Use bands where exact detail would be privacy-sensitive, medically/legally
  over-specific or balance-unstable: injury time loss, fee/wage, pressure and
  suspension duration.
- A story thread is first-class. Rumours, board pressure and injury updates
  should be superseded, confirmed, contradicted or expired instead of piling up
  as unrelated articles.
- Salience is input data, not an opaque score locked here. The first contract
  carries `salienceInputs`, `audienceScopeHint` and `decayHint`; final weights
  stay calibration/content-policy work.
- Zod 4 future implementation should use strict discriminated event schemas and
  export JSON Schema from the same schemas. No dependency changes were made in
  this docs-only beat.

## 4. Event families

FMX-83 defines the Narrative-facing publication facets for four event families.
Source contexts remain the domain owners.

| Event family | Source owner | Narrative-facing purpose |
|---|---|---|
| `InjuryOccurred` | Squad & Player after Training/Match facts are persisted | Make an injury intelligible for reports, inbox, media and dialogue without medical/raw-state joins. |
| `ContractExpiring` | Squad & Player contract lifecycle, aligned with ADR-0073 | Let Narrative and Notification surface expiry/renewal pressure from a self-contained warning payload. |
| `BoardPressureChanged` | Club Management / board policy | Publish pressure movement, reason and context as a banded public-facing fact. |
| `TransferRumourPublished` | Transfer | Publish attributed rumour facts as rumour objects with confidence, decay and supersession. |
| `PlayerSuspended` | FMX-80/Discipline follow-up | Not defined here. FMX-83 lists requirements only: reason band, scope, duration band, appeal status and source/legal flags. |

## 5. Shared payload checklist

Every Narrative-facing newsworthy event should include:

- event envelope: `eventId`, `eventType`, `eventVersion`, `producerContext`,
  `occurredAt`, `publishedAt`, `aggregateRef`, `schemaVersion`,
  `sourceTraceRef`, `idempotencyKey`;
- display snapshot: player/club/subject display names, fictional competition
  label, contextual labels and enough text-safe data to render without joins;
- story controls: `storyThreadId`, optional `supersedesEventId`,
  `audienceScopeHint`, `decayHint`, `cooldownKey`;
- newsworthiness metadata: `salienceInputs`, `sourceType`,
  `sourceConfidence`, `attributionRequired`, `privacyDetailLevel`,
  `legalRiskClass`;
- domain-specific bands: injury time-loss band, expiry window band, board
  pressure band, transfer-fee band, suspension duration band, etc.;
- provenance/versioning: source rule set version, contract schema version and
  template/storylet compatibility tag where useful.

## 6. Narrative consumer projection

Narrative should store a rebuildable `NarrativeNewsFactProjection` keyed by
`eventId` and grouped by `storyThreadId`.

Projection rules:

- idempotent upsert by `eventId`;
- no authoritative writes and no cross-context joins;
- immutable display snapshot; later facts supersede or close a thread;
- projection may derive content eligibility and frequency/cooldown flags;
- generated prose never feeds back into the projection;
- LLM/fallback provenance from ADR-0054 remains attached to display snapshots,
  not to the source fact.

## 7. Open follow-ups

- FMX-80 must define the canonical `PlayerSuspended` schema and appeal/scope
  policy.
- FMX-82 must decide media-outlet cadence, stance, reach and reliability rules.
- FMX-87 must define `DialogueIntent` availability/effect matrices that consume
  these facts.
- Final salience weights, cooldowns and article-volume caps belong to content
  calibration/playtest, not this contract.
- Exact TypeScript/Zod package layout remains implementation-phase work once
  Narrative contracts are ratified.

## Related

- [[raw-perplexity/raw-newsworthiness-event-publication-semantics-2026-06-04]]
- [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
- [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
- [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
- [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
- [[../20-Features/feature-ai-narration-mvp-pillar]]
- [[../30-Implementation/ai-narration-contract-testing-framework]]

