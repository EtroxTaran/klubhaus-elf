---
title: FMX-152 staff skill MVP scope decision queue
status: current
tags: [execution, decision-queue, staff, skills, player-development, backroom, fmx-152]
created: 2026-06-15
updated: 2026-06-16
type: decision-queue
binding: false
linear: FMX-152
related:
  - [[../60-Research/staff-skill-mvp-scope-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-realworld-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-games-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-ddd-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
  - [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
---

# FMX-152 staff skill MVP scope decision queue

This is the HITL decision record for FMX-152. Nico accepted the recommended
packet on 2026-06-16: **D1-D4 = B/A/A/A**.

## Context

GD-0021 already names the staff-skill MVP choice:

- A - Target-only.
- B - Narrow pipeline modifiers.
- C - Full staff skill cards.

FMX-152 refreshes that choice with Perplexity-first research, source checks and
a concrete promotion path. The accepted outcome is **B**.

## D1 - Staff-skill MVP activation scope

| Option | Meaning | Assessment |
|---|---|---|
| A. Target-only | Staff skills stay future-facing. Staff Operations still owns lifecycle, roles and pipeline coverage, but People-owned staff skill profiles do not change MVP mechanics. | Lowest scope and balance risk, but staff skills remain mostly cosmetic and the GD-0021 activation gap stays open. |
| **B. Narrow pipeline modifiers** | Staff skills affect only Staff Operations pipeline-quality/modifier read models consumed by Training, Scouting, Medical and Match-Day. | **Recommended.** Best fit for real-world specialization, Football Manager genre precedent and DDD boundaries. |
| C. Full staff skill cards | Staff profiles are visible and mechanically active across systems with a staff skill catalog, UI, effects and balancing. | Richest player fantasy, but too broad for MVP without a dedicated catalog/UI/balance/replay pass. |

**Recommendation:** B.

**Decision:** Accepted 2026-06-16 - B.

## D2 - Promotion shape after approval

| Option | Meaning | Assessment |
|---|---|---|
| **A. Update GD-0021 only** | After approval, GD-0021 gains a dated subsection that closes the A/B/C gate and records the exact Option B MVP rule. ADR-0052/ADR-0053 get traceability only if needed. | **Recommended.** FMX-152 is primarily a game-design activation decision; no new bounded context is created. |
| B. Create a new GDDR | Add a dedicated staff-skill GDDR even if B wins. | Useful if the catalog/UI becomes large, but unnecessary for the narrow Option B rule. |
| C. Make it an ADR-only change | Encode the decision only in ADR-0052 or ADR-0053. | Too architectural; the core question is player-facing gameplay scope. |

**Recommendation:** A.

**Decision:** Accepted 2026-06-16 - A.

## D3 - MVP player visibility

| Option | Meaning | Assessment |
|---|---|---|
| **A. Banded pipeline explanations** | Show staff strengths/weaknesses as bands and reasons on affected pipelines: training, scouting, medical, set-piece/match-day prep. No full staff card catalog. | **Recommended.** Gives causality and genre legibility without turning the slice into card gameplay. |
| B. Hidden modifiers only | Apply staff-skill effects but show only occasional narrative/report hints. | Lower UI cost, but risks invisible math and poor player trust. |
| C. Full visible staff skill cards | Show detailed role-specific staff skill cards and make them a core optimization surface. | Strong long-term fantasy, but belongs with Option C and a separate catalog/balance pass. |

**Recommendation:** A.

**Decision:** Accepted 2026-06-16 - A.

## D4 - Contract boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. People profile -> Staff Operations pipeline projection -> consumer application** | People owns `StaffSkillProfileSnapshot`; Staff Operations maps assigned staff into pipeline-quality/modifier snapshots; Training/Scouting/Medical/Match-Day apply local rules. | **Recommended.** Matches ADR-0052/ADR-0053, DDD bounded contexts and CQRS read-model guidance. |
| B. Consumers query People directly | Training/Scouting/Medical/Match-Day consume staff skill profiles directly and calculate their own effects. | Risks duplicated mappings and tighter People coupling. |
| C. Staff Operations owns all skill truth | Move staff skill truth out of People into Staff Operations. | Contradicts ADR-0052's People/persona/skill-profile ownership unless a broader ADR revision is approved. |

**Recommendation:** A.

**Decision:** Accepted 2026-06-16 - A.

## Decision record

- 2026-06-15: FMX-152 selected after live Linear/worktree/GitHub triage.
- 2026-06-15: FMX-152 moved from `Backlog` to `In Progress`.
- 2026-06-15: Clean worktree/branch created:
  `codex/fmx-152-staff-skill-mvp-scope`.
- 2026-06-15: Perplexity-first research captured for real-world staff
  specialization, game precedents and DDD/contracts-first design.
- 2026-06-15: Source checks preserved for Sports Interactive staff attributes,
  EA FC 26 Career Mode, Sports Data Campus set-piece specialization, Microsoft
  DDD/CQRS and Martin Fowler bounded contexts.
- 2026-06-16: Nico accepted the recommended packet: **D1-D4 = B/A/A/A**.

## Accepted packet

Accepted selection: **D1-D4 = B/A/A/A**.

Applied follow-up:

- Update
  [[../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]]
  to close the staff-skill MVP decision gate as Option B.
- Keep staff-skill public planning names non-final until a future schema/API
  pass.
- Extend the existing `PipelineCoverageSnapshot` vocabulary with banded
  staff-skill-aware modifier/explanation fields; do not add a new public
  `StaffPipelineQualityModifierSnapshot` name yet.
- Keep full staff skill cards, staff skill catalog, staff progression and
  staff synergy trees post-MVP unless separately approved.
- Update Current-State, Research Summary, Research Map, Decision-Log and any
  affected feature note from "pending" to "accepted" wording.

## Related

- [[../60-Research/staff-skill-mvp-scope-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-realworld-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-games-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-ddd-2026-06-15]]
- [[../60-Research/raw-perplexity/raw-staff-skill-mvp-scope-source-checks-2026-06-15]]
