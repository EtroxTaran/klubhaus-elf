---
title: FMX-162 Effect-intent taxonomy decision queue
status: current
tags: [execution, decision-queue, effect-intent, narrative, media-ecology, press, dialogue, fmx-162]
created: 2026-06-15
updated: 2026-06-15
type: decision-queue
binding: false
linear: FMX-162
related:
  - [[../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
  - [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0034-media-outlet-ecology-model]]
---

# FMX-162 Effect-intent taxonomy decision queue

This is the HITL decision packet for FMX-162. No option below is accepted until
Nico decides.

## D1 - Taxonomy shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. One canonical published-language catalog** | One catalog lists every advisory `EffectIntentId`, its primary owner and policy key. Contexts still translate locally. | **Recommended.** It satisfies ADR-0054's one-owner invariant while avoiding a shared domain model. |
| B. Producer-local vocabularies | Narrative and Media Ecology keep separate intent sets; consumers map both. | Lower upfront coordination, but `press.*` and `media.*` drift easily and conformance is harder. |
| C. Owner-local keys only | Each consuming context publishes accepted policy keys; producers emit loose tags. | Too weak for existing docs because producers could not prove one owner + one policy key per intent. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D2 - Authority boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. Advisory intent only; owner applies** | Producers emit advisory metadata on committed facts. Owners validate, clamp/reject and emit authoritative result events. | **Recommended.** Matches ADR-0030/0054/0065/0085 and Microsoft DDD event-boundary guidance. |
| B. Producer emits effect commands | Producer sends command-like requests to consumer contexts. | Blurs authority and makes replay/error handling harder. |
| C. Producer may write minor effects directly | Narrative/Media write small deltas for convenience. | Rejected; violates the non-authoritative boundary. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D3 - Catalog ownership

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated cross-cutting ADR-0125** | ADR-0125 is the catalog governance home; consumers own policy semantics. | **Recommended.** Neither producer owns the other's consumer mappings. |
| B. Narrative owns the catalog | Narrative owns all dialogue, press and media effect-intent mappings. | Too much Narrative overreach; weak for Media Ecology coverage facts. |
| C. Consumer contexts own separate accepted-key registries | Every owner publishes its own list and producers adapt to them. | Strong local ownership but poor cross-producer discoverability. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D4 - V1 scope and rows

| Option | Meaning | Assessment |
|---|---|---|
| **A. Account for every GD-0028, ADR-0065 and ADR-0085 named intent now** | Draft ADR-0125 includes the complete v1 mapping table, including aliases for ADR-0065/0085 bare IDs. | **Recommended.** Closes the exact FMX-162 gap and makes later tests exhaustive. |
| B. Only press/media rows now | Map only ADR-0065 and ADR-0085; leave broader GD-0028 rows as-is. | Faster, but the dialogue/press boundary would still have two catalog shapes. |
| C. Only a governance rule now | Define the rule and defer all rows. | Too abstract; acceptance criteria require an accounted-for catalog. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D5 - People / relationship ownership

| Option | Meaning | Assessment |
|---|---|---|
| **A. People supplies gates/scalers; effect owners stay as listed** | People-owned persona/receptivity facts may gate or scale owner policies, but current v1 effect rows stay with Squad, Transfer, Audience, Club, Staff Ops or Media Ecology. | **Recommended.** Preserves GD-0028 and avoids silently moving morale/trust/transfer effects into People. |
| B. People owns all relationship/receptivity effects | Player/staff/agent relationship movement becomes People-owned. | Cleaner People centrality, but changes existing GDDR ownership and needs broader People-context ratification. |
| C. No People involvement in the contract | Owners ignore People/persona inputs until later. | Too weak for dialogue; persona gates are already part of GD-0028. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D6 - Visibility and audit posture

| Option | Meaning | Assessment |
|---|---|---|
| **A. Visible bounded outcome + history/audit row** | Accepted/clamped/rejected effects surface an inspectable reason and duration/band label where player-relevant. | **Recommended.** Avoids opaque safe-answer farming and supports replay trust. |
| B. Mostly hidden modifiers | Preserve mystery; show only occasional narrative feedback. | Higher drama but risks external-guide heuristics and player distrust. |
| C. Fully numeric visible deltas | Show exact values for every effect. | Too gamey before calibration and risks locking premature numbers. |

**Recommendation:** A.

**Decision:** Pending Nico.

## D7 - Conformance timing

| Option | Meaning | Assessment |
|---|---|---|
| **A. Name future contract test now; implement in code phase** | Docs define `effect-intent-catalog-exhaustive-mapping`; no code or dependency change in docs-only phase. | **Recommended.** Gives a concrete acceptance target without premature scaffolding. |
| B. Add schema/test scaffolding now | Create executable Zod contract code in docs-only repo. | Not allowed in current phase; repo has no implementation workspace. |
| C. Keep conformance manual | Rely on review only. | Too weak for a catalog designed to be exhaustive. |

**Recommendation:** A.

**Decision:** Pending Nico.

## Decision record

- 2026-06-15: FMX-162 selected after live Linear/worktree/GitHub triage.
- 2026-06-15: FMX-162 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-162-effect-intent-taxonomy`.
- 2026-06-15: Perplexity-first research captured for real-world football/media,
  game precedents and DDD contract patterns.
- 2026-06-15: Source checks preserved for EA FC 25, Football Manager, OOTP,
  Microsoft DDD/domain events, football coach-pressure studies and Zod 4
  conformance-shape docs.
- 2026-06-15: Draft ADR-0125 prepared with a full v1 catalog and aliases for
  ADR-0065/0085 bare IDs.

## Proposed packet

Recommended selection: **D1-D7 = A/A/A/A/A/A/A**.

If accepted:

- Promote
  [[../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
  to `accepted` / `binding: true`.
- Mark ADR-0065's and ADR-0085's deferred effect-intent taxonomy flags as
  resolved by ADR-0125.
- Add the bounded-context-map clause proposed in ADR-0125.
- Keep exact magnitudes in GD-0043 calibration slots.
- Add the future code-phase test
  `effect-intent-catalog-exhaustive-mapping` when the workspace exists.

## Related

- [[../60-Research/effect-intent-taxonomy-cross-producer-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0125-cross-producer-effect-intent-taxonomy]]
- [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-realworld-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-game-precedents-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-ddd-contracts-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-effect-intent-taxonomy-source-checks-2026-06-15]]
