---
title: Non-Goals
status: current
tags: [context, vision]
created: 2026-05-17
updated: 2026-05-17
type: index
binding: true
related: [[Vision]]
---

# Non-Goals

Explicitly out of scope for the MVP. Changing any of these requires an ADR.

- **Multiplayer / online play** — single-player only; offline-first by design.
- **Cloud sync** — SurrealDB sync is post-MVP and optional
  ([[../10-Architecture/09-Decisions/ADR-0002-offline-first]]).
- **Licensed real IP** — no real club/player/league brands; generated data only
  ([[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).
- **localStorage for game state** — game state is IndexedDB via Dexie only.
- **Backward save migrations** — forward-only
  ([[../10-Architecture/09-Decisions/ADR-0005-save-format]]).
- **ESLint / Prettier / npm / yarn** — Biome and pnpm are canonical.
- **Desktop-first or separate desktop UI** — one mobile-first responsive UI.

See [[Vision]] for goals.
