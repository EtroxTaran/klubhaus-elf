---
title: Research Summary
status: current
tags: [research, summary]
updated: 2026-05-18
---

# Research Summary

## Phase 1 — Research Wave 1 (Milestone M1.1, 100 %)

| # | Doc | Linear | Status |
|---|---|---|---|
| 1 | [[anstoss-series-deep-dive]] — Anstoss design DNA, weekly heartbeat, mechanics map, IP boundaries, 17 MVP/post-MVP recommendations | [AKOM-113](https://linear.app/coding-x/issue/AKOM-113) | Done |
| 2 | [[club-boss-analysis]] — Mobile chairman loop, inbox-as-narrative, 14 product takeaways, IP risk notes | [AKOM-114](https://linear.app/coding-x/issue/AKOM-114) | Done |
| 3 | [[competitor-matrix]] — 8 products, feature coverage, differentiation quadrant, MVP-expectation risks | [AKOM-112](https://linear.app/coding-x/issue/AKOM-112) | Done (extended in Wave 2) |
| 4 | [[ip-and-licensing]] — License matrix, hard-stop list, fictional naming schema, ADR-0007 direct input, 5 needs-decision items | [AKOM-111](https://linear.app/coding-x/issue/AKOM-111) | Done |
| 5 | [[pwa-offline-patterns]] — Dexie 4 architecture, migrations, SW update strategy, outbox, iOS/Android quotas, ADR-0002 + ADR-0005 inputs | [AKOM-110](https://linear.app/coding-x/issue/AKOM-110) | Done |

## Phase 1 — Research Synthesis (Milestone M1.2)

- [[feature-gap-analysis]] — MoSCoW scope MVP → M8, **populated by Wave 2**.
- Phase 1 consolidation rewrite of this file - this version covers Wave 2.

## Phase 2 — Research Wave 2 (2026-05-16)

Raw Perplexity transcripts preserved in [[raw-perplexity/README|raw-perplexity/]];
synthesised research outputs:

| # | Doc | Topic |
|---|---|---|
| 6 | [[feature-library-synthesis]] | Consolidated competitor inventory (8+3 products) |
| 7 | [[systems-design-synthesis]] | 7-pillar club model + 5 feedback loops |
| 8 | [[mode-design-research]] | 2x2 mode matrix, roguelite + career patterns |
| 9 | [[async-multiplayer-research]] | Fixed/Dynamic cadence + watch-party + escalation |
| 10 | [[regulations-and-pyramids-research]] | DFB / FA / LFP / FIGC / LaLiga regulation map |
| 11 | [[fan-culture-segmentation-research]] | 6-segment supporter ecology + atmosphere engine |
| 12 | [[progressive-disclosure-research]] | Quick / Standard / Expert UI tiers |

Wave 2 unblocks ADR-0003 (match engine via systems-design-synthesis),
ADR-0004 (data model via Bounded Context Map), ADR-0008 (mobile-first UI via
progressive-disclosure), and the M2-M8 seed epics. It also proposes new ADRs
ADR-0010..ADR-0016 - see [[../00-Index/Decision-Log]].

## Phase 1 — Identified Wave 2 gaps

See [[research-wave-2-gaps]] for the prioritised list of deeper research that
Wave 1 surfaced but did not cover. Most items resolved in Wave 2; remainder
listed there.

## Phase 3 — Wave 3 backlog (2026-05-16)

[[wave-3-gap-analysis]] is now the **single backlog of record** for all
remaining documentation + architecture work. It supersedes
[[research-wave-2-gaps]] (the 19 R2-01..R2-19 IDs are preserved verbatim
under Wave 3 group D) and catalogues 123 gap entries across 12 groups
(A-L): ADR depth rewrites, ADR promotion, arc42 chapter completion,
technical research, implementation guides, security and privacy, product
and business, operations and release, game-design refinement, glossary,
user docs, Linear hygiene.

Each gap follows the same template (Why now / Scope / Research questions
/ Q&A questions for Nico / Output files / Promotes-supersedes /
Dependencies / Effort) and the doc defines four execution waves
(W3.A-W3.D) by priority. Per-gap workflow is agent-led: Perplexity MCP
research → synthesis + Q&A → final vault docs → map updates.

## Ad-hoc Transfer Market Synthesis (2026-05-17)

[[transfer-market-simulation]] promotes Nico's attached transfer-market
research into a current binding synthesis. It reconciles the new ideas with D4
AI Manager Behaviour, D8 Determinism, D9 Performance Budgets, D15 Narrative
Content and the Transfer bounded context.

## MVP Offline Scope Synthesis (2026-05-18)

[[offline-mvp-scope-and-sync-strategy]] supersedes the old MVP assumption that
full offline-first singleplayer must ship immediately. The new binding direction
is a hybrid-online, offline-ready MVP: app shell, safe read caches and local
drafts now; server-confirmed authoritative progression; selective offline-first
singleplayer and export/import after MVP with contracts reserved from day one.

## Pre-Mortem Cluster (2026-05-20)

[[pre-mortem/00-index]] is the entry point to a four-report pre-mortem
covering architecture, tech & ops, gameplay and monetization for the
6-month / 10.000-player horizon across two scenarios (single-node Hetzner
vs. cloud autoscaling). 40 findings carry stable IDs
(`PM-2026-05-20-XX-F-NN`) so commits, PRs and downstream ADRs can cite a
finding via `Addresses PM-…`. Aggregated status lives in
[[pre-mortem/findings-registry]].
