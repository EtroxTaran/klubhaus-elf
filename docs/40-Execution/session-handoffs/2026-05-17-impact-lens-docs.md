---
title: Impact Lens Documentation Handoff
status: wrapped
tags: [meta, handoff, player-strength, impact-lens]
created: 2026-05-17
updated: 2026-05-17
type: handoff
binding: false
related:
  - [[../../60-Research/player-strength-presentation]]
  - [[../../60-Research/raw-perplexity/raw-player-strength-overview]]
  - [[../../50-Game-Design/progressive-disclosure-ui]]
  - [[../../10-Architecture/bounded-context-map]]
---

# Impact Lens Documentation Handoff

## Goals

- Analyse the attached player-strength research.
- Challenge it against current vault decisions.
- Preserve the raw source.
- Promote a complete no-global-OVR player-strength model across gameplay,
  architecture, feature and index docs.

## Completed

- Preserved the source in
  [[../../60-Research/raw-perplexity/raw-player-strength-overview]] and linked
  it from the raw research index.
- Created the binding synthesis
  [[../../60-Research/player-strength-presentation]].
- Updated progressive disclosure and tactics docs to replace global stars /
  OVR with Impact Lens tiers.
- Updated squad, scouting, training and set-piece docs for the locked 1-20
  schema, status signals and scouting uncertainty.
- Documented `ImpactLensProjection` ownership in Squad & Player and the
  no-cross-context-JOIN rule in architecture/data docs.
- Updated maps and current state so future agents find the new guidance.

## Open Tasks

- Tune exact role-weight tables for all 50 roles.
- Decide exact German labels for Quick Impact bands.
- Decide whether availability modifies Role Impact directly or stays mostly
  adjacent in Standard UI after playtesting.
- Split implementation tickets when the squad/tactics UI work starts.

## Decisions Made

- No global player OVR / universal star rating in squad, tactic, scouting or
  transfer lists.
- Quick uses assistant-ranked recommendations and qualitative Impact bands.
- Standard shows Role Impact, category bars and status icons.
- Expert shows 1-20 attributes, Impact formula breakdown and uncertainty bands.
- Impact is a deterministic read projection, not simulation authority.

## Blockers

- `corepack pnpm docs:check` currently fails due to pre-existing vault-wide
  broken wikilinks unrelated to the Impact Lens docs. New Impact Lens links did
  not appear in the failure list.

## Durable Notes Updated

- [[../../60-Research/raw-perplexity/raw-player-strength-overview]]
- [[../../60-Research/raw-perplexity/README]]
- [[../../60-Research/player-strength-presentation]]
- [[../../50-Game-Design/progressive-disclosure-ui]]
- [[../../50-Game-Design/tactics-system]]
- [[../../60-Research/tactics-and-formations]]
- [[../../50-Game-Design/squad-and-club-structure]]
- [[../../50-Game-Design/scouting-and-recruitment]]
- [[../../50-Game-Design/training-load-and-medicine]]
- [[../../50-Game-Design/set-pieces]]
- [[../../20-Features/feature-tactics-progressive-disclosure]]
- [[../../10-Architecture/bounded-context-map]]
- [[../../60-Research/surrealdb-schema-patterns]]
- [[../../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Game-Design-Map]]
- [[../../00-Index/Feature-Map]]
- [[../../00-Index/Architecture-Map]]
- [[../../50-Game-Design/README]]
- [[../../60-Research/progressive-disclosure-research]]
- [[feature-gap-analysis]]
- [[../../60-Research/ai-manager-behaviour]]

## Promotion Needed

- No new ADR is required yet. If implementation makes the projection table or
  event invalidation contract materially more specific, add an ADR-0004
  addendum or implementation note.
## Related

- [[../../60-Research/player-strength-presentation]]
- [[../../60-Research/raw-perplexity/raw-player-strength-overview]]
- [[../../50-Game-Design/progressive-disclosure-ui]]
- [[../../10-Architecture/bounded-context-map]]
