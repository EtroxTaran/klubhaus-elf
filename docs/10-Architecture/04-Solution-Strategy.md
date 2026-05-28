---
title: Solution Strategy
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-28
type: arch
related: [[01-Introduction]], [[02-Constraints]], [[05-Building-Blocks]], [[09-Decisions/ADR-0001-tech-stack]], [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]], [[09-Decisions/ADR-0049-swappable-spatial-event-match-engine]], [[09-Decisions/ADR-0050-club-economy-accounting-ledger]], [[09-Decisions/ADR-0051-manager-and-legacy-context]], [[09-Decisions/ADR-0052-people-persona-and-skills-context]], [[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]], [[../00-Index/MVP-Scope]]
---

# Solution Strategy

Build a modular pnpm workspace:

- `apps/web`: TanStack Start PWA and server functions.
- Match engine adapter: deterministic simulation behind `MatchEnginePort`,
  isolated from React, DB, UI rendering and LLM code. The concrete runtime is
  selected by the ADR-0049 TS-vs-Rust spike.
- `packages/game-data`: generated, IP-clean domain data.
- `packages/db-schema`: standalone, zero-dependency Zod validation mirror
  generated from the Drizzle schema ([[09-Decisions/ADR-0027-postgres-data-model]]).
- `packages/ui`: shared UI primitives/components.

MVP runtime strategy:

- Create-a-Club Roguelite first playable.
- Server-confirmed commands own authoritative progression.
- Club economy is an MVP pillar: weekly economy advancement, finance ledger
  updates and insolvency-stage changes are server-confirmed Club Management
  commands/read models.
- Manager-archetype progression is MVP-relevant as hooks only: run-end analysis
  and style-signal capture may be preserved, while full Manager & Legacy
  meta-progression stays draft until ADR-0051/GD-0019 are ratified.
- AI narration is MVP-relevant as an emotional world layer: Full Dialogue,
  All Active actor context and Playtest First remain draft until
  ADR-0030/ADR-0054/GD-0018 are ratified. Generated prose is presentation only.
- Match results are server-confirmed in MVP; local client adapters are preview
  or future selective-offline surfaces unless a later ADR/GDDR promotes them.
- Dexie / IndexedDB stores cached read models, drafts and local UI state.
- Contracts remain versioned and storage-adapter-friendly so selective
  offline-first singleplayer can be added later.

## Related

- [[05-Building-Blocks]] — module map (hub) · [[09-Decisions/ADR-0001-tech-stack]] — stack decision
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] — MVP runtime staging · [[09-Decisions/ADR-0049-swappable-spatial-event-match-engine]] — match-engine replacement boundary · [[09-Decisions/ADR-0050-club-economy-accounting-ledger]] — economy ledger boundary · [[09-Decisions/ADR-0051-manager-and-legacy-context]] — Manager & Legacy proposal · [[09-Decisions/ADR-0052-people-persona-and-skills-context]] — People proposal · [[09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]] — Narrative proposal · [[../00-Index/MVP-Scope]] — scope
- Modules: [[modules/web]] · [[modules/match-engine]] · [[modules/game-data]] · [[modules/db-schema]] · [[modules/ui]]
- [[01-Introduction]] · [[02-Constraints]] — arc42 siblings
