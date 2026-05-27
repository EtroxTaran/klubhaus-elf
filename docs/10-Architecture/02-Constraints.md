---
title: Constraints
status: current
tags: [architecture]
created: 2026-05-15
updated: 2026-05-22
type: architecture
binding: false
related:
  - [[01-Introduction]]
  - [[04-Solution-Strategy]]
  - [[09-Decisions/ADR-0001-tech-stack]]
  - [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../00-Index/MVP-Scope]]
---

# Constraints

- Hybrid-online MVP, offline-ready and installable as a PWA.
- Selective offline-first singleplayer must remain possible post-MVP.
- MVP gameplay progression is server-confirmed; Dexie is used for caches,
  drafts and future local-save/export seams.
- German primary UI with i18n from day one.
- No real club logos, club names, or player names.
- pnpm, Biome, Vitest, Playwright, and TypeScript strict are mandatory.
- Agents work via Cursor with deterministic hooks and PR review gates.
## Related

- [[01-Introduction]]
- [[04-Solution-Strategy]]
- [[09-Decisions/ADR-0001-tech-stack]]
- [[09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
- [[../00-Index/MVP-Scope]]
