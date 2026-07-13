---
title: klubhaus-elf Architecture
type: architecture
project: klubhaus-elf
context: football-manager
status: active
owner: Nico
updated: 2026-07-13
sensitivity: internal
---

# klubhaus-elf Architecture

The repository is currently a docs-vault-only design workspace for an
offline-ready football manager. Implementation decisions remain draft until
re-ratified through the project decision protocol.

## Bounded contexts

- **Club Management** — squad, staff, finance, facilities, and club identity.
- **Competition** — leagues, seasons, fixtures, standings, and progression.
- **Matchday** — authoritative simulation, events, tactics, and presentation.
- **Transfer Market** — scouting, negotiations, contracts, and player movement.
- **Narrative** — systemic events, AI narration, rivalries, and fan ecology.

## Current structural boundary

- `docs/` is the authoritative Obsidian design memory.
- `wiki/` is the short project-wide navigation and governance Wall.
- There is no current product runtime; proposed runtime details are not active
  implementation truth until their ADR/GDDR status permits it.

See the [Architecture Map](../docs/00-Index/Architecture-Map.md) and
[bounded-context map](../docs/10-Architecture/bounded-context-map.md) for the
detailed model.
