---
title: "Raw - Watch Party context ownership source checks (FMX-159)"
status: raw
tags: [research, raw, source-checks, ddd, bounded-context, watch-party, discord, yjs, automerge, football-manager, fmx-159]
created: 2026-06-17
updated: 2026-06-17
type: research
binding: false
linear: FMX-159
related:
  - [[../watch-party-context-ownership-2026-06-17]]
  - [[raw-watch-party-context-ownership-ddd-2026-06-17]]
  - [[raw-watch-party-context-ownership-realworld-2026-06-17]]
  - [[raw-watch-party-context-ownership-games-2026-06-17]]
  - [[../../40-Execution/fmx-159-watch-party-context-ownership-decision-queue-2026-06-17]]
  - [[../../10-Architecture/09-Decisions/ADR-0133-watch-party-context-definition]]
---

# Raw - Watch Party context ownership source checks (FMX-159)

## Scope

This note records targeted source checks for FMX-159 after the Perplexity
discovery passes. It is still raw research; the synthesized recommendation
lives in [[../watch-party-context-ownership-2026-06-17]].

## DDD and context-map checks

### Martin Fowler - Bounded Context

Source: <https://martinfowler.com/bliki/BoundedContext.html>

Checked facts:

- Bounded Context is a central strategic DDD pattern for dividing large models.
- Each context can keep a unified model and explicit language inside its
  boundary.
- Relationships between contexts should be made explicit, commonly through a
  context map.

FMX-159 implication:

- Watch Party should have one canonical context-definition ADR because it has
  its own language: party, host, participant, schedule poll, broadcast cursor,
  pause vote, conference and party marker. Match and Notification use different
  language.

### Microsoft Learn - domain analysis and bounded contexts

Source:
<https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis>

Checked facts:

- Service boundaries should align to business capabilities, with high
  cohesion and loose coupling.
- A bounded context is where a specific domain model applies.
- Context maps document integration points and clarify responsibilities.
- Customer/Supplier, Open Host Service, Published Language and
  Anti-Corruption Layer are named context relationship patterns.

FMX-159 implication:

- Watch Party should consume Match through published language and keep an ACL
  translation around event-log/replay concepts. It should publish its own
  party language to Notification and other consumers.

### Microsoft Learn - Anti-Corruption Layer

Source:
<https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer>

Checked facts:

- An ACL isolates systems with different semantics through a translation layer.
- The layer protects one subsystem's design from another subsystem's API or
  data model.
- It is useful when two subsystems need to communicate but have different
  semantics.

FMX-159 implication:

- Watch Party should translate Match event-log/replay/cursor facts into party
  timeline and broadcast-state language. The ACL must not become a home for
  business rules that belong in Match or Watch Party.

## Platform and game checks

### Discord Activities

Sources:

- <https://docs.discord.com/developers/activities/overview>
- <https://docs.discord.com/developers/activities/how-activities-work>

Checked facts:

- Discord describes Activities as multiplayer games and social experiences.
- Activities are web apps hosted in iframes on desktop, mobile and web.
- The Embedded App SDK handles communication between the activity and Discord
  clients through commands and events.
- The lifecycle includes launch, iframe initialization, handshake, auth,
  client events/commands and disconnection/error handling.

FMX-159 implication:

- A Watch Party should be modeled as a social room/session with explicit
  lifecycle, roles and command/event boundaries. Discord is platform precedent
  for the "activity instance" pattern, not evidence for owning Match state.

### Football Manager Versus Mode

Source:
<https://www.footballmanager.com/news/versus-mode-returns-football-manager-fmfc-members>

Checked facts:

- Official Football Manager copy describes Versus Mode as head-to-head online
  manager competition using exported career teams or teams from playable
  leagues.
- It is grouped with Fantasy Draft and Online Career as a multiplayer mode.
- The official page notes a spectator delay issue when another manager joins
  as a spectator.

FMX-159 implication:

- Synchronous manager-session precedent exists in the genre, and spectator
  delay is a real product concern. The source does not define a Watch Party
  ownership model.

## CRDT/current library checks

### Context7 - Yjs

Source: Context7 `/yjs/docs`, queried 2026-06-17.

Checked facts:

- Yjs centers collaborative state in a `Y.Doc`.
- Shared types include maps, arrays and text-like structures.
- Awareness state is separate from document state and is intended for presence
  such as cursor/user-status information.
- Providers handle communication/sync; IndexedDB persistence can cache Yjs
  documents locally.

### Ref - Yjs README providers

Source:
<https://github.com/yjs/yjs/blob/main/README.md?plain=1#L213#connection-providers>

Checked facts:

- Official Yjs README lists WebSocket, WebRTC, Hocuspocus, Liveblocks, Y-Sweet
  and other providers for connection/sync.
- Several providers include persistence, managed backends or peer-to-peer
  sync options.

### Context7 - Automerge

Source: Context7 `/websites/automerge`, queried 2026-06-17.

Checked facts:

- Automerge supports local-first CRDT documents with concurrent change merge.
- Automerge Repo provides application plumbing around documents.
- Repo can be configured with storage adapters and network adapters.
- IndexedDB storage and BroadcastChannel sync are documented for local browser
  persistence and same-browser/tab sync.

### Ref - Automerge README

Source:
<https://github.com/automerge/automerge/blob/main/README.md?plain=1#L1#automerge>

Checked facts:

- Automerge provides CRDT implementations, compact format and sync protocol.
- The project positions itself for local-first applications.
- JavaScript package `@automerge/automerge` is stable; Automerge 3 was
  recently released with major memory-use reductions.

FMX-159 implication:

- Yjs/Automerge are plausible future CRDT substrates for collaborative
  overlays, but no code dependency is selected here.
- The ADR should decide ownership semantics, not library choice.
- MVP should avoid CRDT for core game state and can avoid CRDT for party chat
  if server-ordered append-only chat/markers are enough.

## Sources rejected or downgraded

- Perplexity's sports-watch-party party-planning links are retained as product
  discovery, not architectural evidence.
- Reddit/Steam community requests are retained only as weak demand signals.
- Perplexity's esport spectator-mode claims were not source-checked enough to
  become canonical.

## Related

- [[../watch-party-context-ownership-2026-06-17]]
- [[raw-watch-party-context-ownership-ddd-2026-06-17]]
- [[raw-watch-party-context-ownership-realworld-2026-06-17]]
- [[raw-watch-party-context-ownership-games-2026-06-17]]
