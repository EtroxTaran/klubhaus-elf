---
title: GD-0014 Save & Career Model
status: approved
tags: [game-design, gddr, save]
created: 2026-05-17
updated: 2026-05-17
type: game-design
binding: true
related: [[README]], [[GD-0002-match-engine]], [[../60-Research/pwa-offline-patterns]], [[../10-Architecture/09-Decisions/ADR-0002-offline-first]], [[../10-Architecture/09-Decisions/ADR-0005-save-format]], [[../00-Index/Non-Goals]]
---

# GD-0014: Save & Career Model

## Status

approved

> The rules below are ratified — they restate accepted ADR-0002 / ADR-0005 and
> binding Vision/Non-Goals. The Wave-2 items under "Open" are NOT approved.

## Date

2026-05-17

## Player experience goal

Long, durable careers the player fully owns — multiple saves, offline forever,
exportable, never silently corrupted.

## Decided / strong (ratified)

- **Long single-player careers, fully playable with no network**, incl. all
  match simulation and save/load (ADR-0002 accepted; Vision).
- **Every save is versioned; forward migrations only**; breaking changes ship
  with migration tests; **no localStorage / ad-hoc JSON fallback**
  (ADR-0005 accepted; Non-Goals).
- **Multiple parallel career saves per browser profile** (one IndexedDB DB,
  many saves) (pwa-offline-patterns §2.1) — improving on Anstoss single-slot
  (anstoss-series-deep-dive §8).
- **User-owned saves**: export/import a single human-readable
  `.smsave.json`; user can export *and delete* their save
  (pwa-offline-patterns §4/§12; club-boss-analysis takeaway 14).
- **Autosave: three rotating slots** (`current`, `autosave_n-1`,
  `autosave_n-2`) + a manual slot; "Restore previous" is an explicit UI action,
  never a silent fallback (pwa-offline-patterns §3.5/§12).
- **No `Date` objects in save payloads — ISO strings only**; all state
  structured-cloneable and JSON-serializable without loss
  (pwa-offline-patterns §12).
- Cloud sync is **out of scope for MVP**; single-player only (Non-Goals;
  ADR-0002).

## Open (Wave 2)

- **R2-08 (critical)** — save-determinism/replay format (event log vs snapshot
  vs delta). **R2-12 (medium)** — hotseat multi-manager may change the shape
  before ADR-0004 locks. Optional save-export encryption (passphrase, never
  default-on); save-format linter CLI; autosave quota-eviction policy.

## Rationale

Forward-only + versioned + user-exportable is the simplest durable model and a
trust feature no competitor offers (pwa-offline-patterns §11/§12).

## Consequences

Positive:

- Durable, portable, user-owned careers; no masked data loss.

Negative / constraints:

- Serialization constraints (no `Date`, structured-cloneable) bind how
  match/world/career state in GD-0002/0010 is modelled.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0002-offline-first]] (accepted)
- [[../10-Architecture/09-Decisions/ADR-0005-save-format]] (accepted)

## Related

- Research: [[../60-Research/pwa-offline-patterns]]
- [[README]] — hub · siblings: [[GD-0002-match-engine]] · [[GD-0010-ai-world]] · [[GD-0015-ip-clean-data]]
