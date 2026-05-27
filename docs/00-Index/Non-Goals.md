---
title: Non-Goals
status: current
tags: [context, vision]
created: 2026-05-17
updated: 2026-05-18
type: index
binding: true
related:
  - [[Vision]]
  - [[MVP-Scope]]
---

# Non-Goals

Explicitly out of scope for the MVP. Changing any of these requires an ADR.

- **Manage-a-Club Career as playable mode** — visible as "comes later"; not the
  first MVP playable.
- **Full offline-first domain model** — MVP is hybrid-online with app shell,
  cached reads and drafts only; local-authoritative singleplayer is post-MVP.
- **Multiplayer / online group play** — not in MVP; future multiplayer is
  server-authoritative by design.
- **Cloud sync** — SurrealDB sync is post-MVP and optional
  ([[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]).
- **User-facing save export/import** — post-MVP, but save-envelope and
  versioning contracts are reserved from day one.
- **Licensed real IP** — no real club/player/league brands; generated data only
  ([[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]).
- **localStorage for game state** — game state is IndexedDB via Dexie only.
- **Backward save migrations** — forward-only
  ([[../10-Architecture/09-Decisions/ADR-0005-save-format]]).
- **ESLint / Prettier / npm / yarn** — Biome and pnpm are canonical.
- **Desktop-first or separate desktop UI** — one mobile-first responsive UI.

See [[Vision]] for goals.
## Related

- [[Vision]]
- [[MVP-Scope]]
