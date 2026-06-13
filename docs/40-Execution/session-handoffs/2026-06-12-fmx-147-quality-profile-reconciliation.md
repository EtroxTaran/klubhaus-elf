---
title: FMX-147 quality-profile reconciliation handoff
status: wrapped
tags: [meta, execution, handoff, fmx-147, quality-profile, settlement]
created: 2026-06-12
updated: 2026-06-13
type: handoff
binding: false
related:
  - [[../../60-Research/quality-profile-enum-settlement-path-2026-06-12]]
  - [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
  - [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
---

# Handoff: FMX-147 quality-profile reconciliation (2026-06-12)

## Goals

- Close the ADR-0101 D3 research layer for quality-profile enum reconciliation.
- Preserve raw Perplexity/Web research plus synthesis.
- Prepare Nico's decision gate without self-ratifying the schema or gameplay/contract mapping.

## Completed

- Updated `main` from `origin/main` and created branch
  `codex/fmx-147-quality-profile-reconciliation`.
- Confirmed Linear FMX-147 had no blockers and moved it to `In Progress`.
- Ran Perplexity research on DDD/event-schema enum reconciliation, real-world football fixture
  categorisation/risk and sports-management simulation quality tiers.
- Cross-checked sources with SGSA risk/stewarding guidance, Arsenal match-category pages, OOTP
  quick-play controls, ZenGM mass-sim positioning and event-sourcing documentation.
- Saved three raw research notes and the FMX-147 synthesis note.
- Updated ADR-0101 to record FMX-147 research completion and the open D3 decision gate.
- Updated ADR-0070 with a pending, not-applied schema-v2 amendment note.
- Updated Current-State, Decision-Log, Open-Decisions-Dossier and research indexes.
- Nico decided D3 on 2026-06-13:
  - contract shape = ADR-0070 `FixtureCommercialProfilesPublished.schemaVersion: 2`;
  - mapping = `competitive-full` / `interactive-standard` -> `foreground_per_event`,
    `background-detailed` -> `background_summary_then_reconcile`, `background-fast` ->
    `lightweight_stateless`;
  - compatibility = pre-1.0 replace, because no live v1 events/saves/external consumers exist.
- Saved supplemental raw Perplexity research for the pre-1.0 replacement exception.
- Applied the D3 contract to ADR-0070 and ADR-0101; ADR-0101 is now `binding: true`.

## Open Tasks

- Run `node scripts/docs-check.mjs`.
- Commit, push, update Linear with final vault paths and open the PR.

## Decisions Made

- Nico approved Option A for D3, the foreground/summary/lightweight settlement mapping, and the
  pre-1.0 replacement handling for the old ADR-0070 v1 sketch.

## Blockers

- None.

## Durable Notes Updated

- [[../../60-Research/quality-profile-enum-settlement-path-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-quality-profile-enum-ddd-contract-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-quality-profile-real-world-football-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-quality-profile-sim-games-2026-06-12]]
- [[../../60-Research/raw-perplexity/raw-pre1-contract-replacement-2026-06-13]]
- [[../../10-Architecture/09-Decisions/ADR-0101-settlement-value-collapse-quality-profile-insolvency-ledger-contract]]
- [[../../10-Architecture/09-Decisions/ADR-0070-fixture-commercial-revenue-profile-contract]]
- [[../../00-Index/Current-State]]
- [[../../00-Index/Decision-Log]]
- [[../../00-Index/Research-Map]]
- [[../../00-Index/Open-Decisions-Dossier]]
- [[../../60-Research/00-summary]]
- [[../../60-Research/raw-perplexity/README]]

## Promotion Needed

- None; FMX-147 D3 has been promoted into ADR-0070 and ADR-0101.
