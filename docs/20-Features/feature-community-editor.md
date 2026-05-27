---
title: Feature - Community Editor
status: draft
tags: [feature, editor, datasets, modding]
created: 2026-05-16
updated: 2026-05-18
type: feature
binding: false
related:
  - [[README]]
  - [[../00-Index/MVP-Scope]]
  - [[../50-Game-Design/community-editor-and-datasets]]
  - [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
---

# Feature - Community Editor

> **REOPENED on 2026-05-27:** This feature note is `draft` planning context again. Any `approved`, `binding`, or implementation-ready wording below is historical pre-reopen context until Nico re-approves it.

## Goal

Let users author / import versioned override packs that adapt the base
fictional universe to their preferred names, kits, competitions or
scenarios.

## User stories

- As a player I import a community pack to make my universe look
  realistic.
- As a pack author I edit clubs, players, leagues + export as a single
  pack file.
- As a player I see conflicts between two packs before activating both.
- As a player I see clearly why a save will not load (missing pack /
  wrong version).

## Post-MVP scope

Community editor/importer is post-MVP per [[../00-Index/MVP-Scope]]. The MVP
must still keep IP-clean generated IDs stable enough that override packs can be
added later.

- Pack file format (archive with `manifest.yaml` + data + optional
  migrations).
- Schema validation on import.
- Manifest with priority, dependency, replacement scope.
- Stable IDs as primary keys.
- Import preview with conflict view.
- Save records active packs + versions.

## Out of first editor release

- In-game marketplace.
- Pack signature scheme.
- Per-entity history editor (only structural editing in MVP).

## UI tiers

- Quick: toggle "Use community pack?" + file picker.
- Standard: pack list + active toggle + conflict preview.
- Expert: full editor with per-entity diff + schema validator.

## Acceptance

- Pack import refuses invalid schema gracefully.
- Conflict detection surfaces priority winner.
- Save load with missing pack offers two fallbacks (load without /
  abort).
- Pack export produces a self-contained file that re-imports cleanly.

## Dependencies

- [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
- [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
## Related

- [[README]]
- [[../00-Index/MVP-Scope]]
- [[../50-Game-Design/community-editor-and-datasets]]
- [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
