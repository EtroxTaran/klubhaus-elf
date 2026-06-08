---
title: ADR-0016 Community Datasets via Versioned Override Packs
status: accepted
tags: [adr, architecture, data, modding, community]
created: 2026-05-16
updated: 2026-06-08
type: adr
binding: false
related: [[../../60-Research/regulations-and-pyramids-research]], [[../../50-Game-Design/community-editor-and-datasets]], [[ADR-0004-data-model]], [[ADR-0007-naming-schema]], [[ADR-0021-revised-tech-stack]]
---

# ADR-0016: Community Datasets via Versioned Override Packs

> **STACK-REVISION IMPACT 2026-05-19 ([[ADR-0021-revised-tech-stack]] + ADR-0023/0024/0025).**
> Informational only — status (`proposed`) and decision are **unchanged**; do not
> implement. On promotion the substrate amendment below applies: *override-pack
> versioning and manifest model unchanged; **pack storage/query substrate →
> PostgreSQL** per [[ADR-0021-revised-tech-stack]] (not SurrealDB);
> [[ADR-0007-naming-schema]] IP-naming gate still applies.*
> Disposition: **keep parked** (owner directive 2026-05-19; gate is owner
> review, currently paused — not the stack).

## Status

Proposed (2026-05-16). Needs Nico's review before acceptance.

## Context

The game ships an IP-clean fictional universe (per
[[ADR-0007-naming-schema]]) but users will want to add or modify clubs,
players, kits and competitions to look like the real world. The naive
"replace JSON files" approach is fragile (version mismatch, save
incompatibility, hostile-content risk) and is the standard reason
modding pipelines collapse.

Research
([[../../60-Research/raw-perplexity/raw-environment-events]] §5,
modding.wiki Kingdom Come) recommends **versioned override packs with
manifests + schema validation + stable IDs**, not raw file imports.

## Decision

Community datasets are **versioned override packs**:

1. The game ships a **core dataset** (IP-clean).
2. Users may install **override packs**, **expansion packs** or
   **scenario packs** stacked on top of core.
3. Each pack has a **manifest** declaring its version, game-version
   compatibility, replacement scope, dependencies and priority.
4. Schema validation runs on import.
5. Stable IDs are the primary keys; pack-renames preserve history.
6. Conflicts between packs are resolved by manifest priority and shown
   in a preview before activation.

The game does **not** host community packs - distribution is
peer-to-peer.

## Consequences

### Positive

- Saves remain loadable across pack updates if manifests align.
- Pack conflicts are detected before saves break.
- Real-world content remains user-supplied (legal hand-off to the
  user).
- Multiple packs layer cleanly (e.g. real-look + women's-league
  expansion).

### Negative

- Pack authoring requires schema knowledge.
- Save migration logic needs per-pack migration handling.
- Editor UI is non-trivial.

### Future

- A pack signature scheme can be added when distribution grows beyond
  hobby use.
- Server-side validation of shared async-group packs (so all members
  use the same dataset).

## Implementation

- Pack file format: a single archive (ZIP) containing `manifest.yaml` +
  data files + optional `migrations.yaml`.
- Game runtime supports up to N packs simultaneously (N tunable).
- Save records active packs + versions; load-time mismatch is surfaced.
- Editor UI builds packs through a schema-checked form.

## Compliance

- Pack imports MUST be schema-validated before activation.
- Stable IDs MUST be used as primary keys (no name-as-PK).
- The game MUST NOT host community packs by default.
- Async groups MUST agree on active packs at group creation; members
  with missing packs cannot join until resolved.

## Sources

- modding.wiki Kingdom Come Deliverance.
- Reddit r/footballmanagergames custom-database threads.
- [[../../60-Research/raw-perplexity/raw-environment-events]] §5.
