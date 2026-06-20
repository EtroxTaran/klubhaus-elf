---
title: Module Notes Index
status: current
tags: [architecture, module, index, bounded-context]
created: 2026-06-20
updated: 2026-06-20
type: index
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[match-engine]]
---

# Module Notes Index

One concise module/interface note per bounded context: public contract
(commands/queries/events), storage ownership (ADR-0121 no shared tables) and
consumers/producers. Full responsibilities live in each context-definition ADR
and [[../bounded-context-map]]; these notes are the public-surface summary.

> Context notes below are FMX-204 drafts (`status: draft`) with an **Open items**
> section for contract elements the source ADR has not yet pinned down.

## Per bounded context

| Context | Module note |
|---|---|
| Match | [[match-engine]] |
| Identity & Access | [[identity-access]] |
| League Orchestration | [[league-orchestration]] |
| Club Management | [[club-management-economy]] |
| Squad & Player | [[squad-player]] |
| Training | [[training]] |
| Transfer | [[transfer]] |
| Watch Party | [[watch-party]] |
| Notification | [[notification]] |
| Manager & Legacy | [[manager-legacy]] |
| Staff Operations | [[staff-operations]] |
| Tactics | [[tactics]] |
| Regulations & Compliance | [[regulations-compliance]] |
| Rivalry System | [[rivalry]] |
| Stadium Operations | [[stadium-operations]] |
| Audience & Atmosphere | [[audience-atmosphere]] |
| CommercialPortfolio | [[commercial-portfolio]] |
| Offline Sync | [[offline-sync]] |
| Audit & Security | [[audit-security]] |
| AI World Simulation | [[ai-world-simulation]] |
| Narrative | [[narrative-dialogue]] |
| Youth Academy | [[youth-academy]] |
| Statistics & Analytics | [[statistics-analytics]] |
| People / Persona & Skills | [[people-persona-skills]] |
| Scouting | [[scouting]] |
| Environment & Climate | [[environment-climate]] |
| Media Ecology | [[media-ecology]] |
| Community Overlay Pipeline | [[community-overlay]] |

## Cross-cutting / infrastructure modules

- [[db]] · [[db-schema]] — persistence substrate
- [[game-data]] — static reference data
- [[ui]] · [[web]] — presentation / app shell
