---
title: FMX-190 No-P2W and MP-fairness decision queue
status: accepted
tags: [execution, decision-queue, monetization, no-p2w, multiplayer, fairness, fmx-190, accepted]
created: 2026-06-13
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-190
related:
  - [[../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
---

# FMX-190 No-P2W and MP-fairness decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-190.


This is the HITL decision queue for FMX-190. It turns the research synthesis
[[../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]] into explicit
Nico decisions for accepted
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]]
.

Scope premise: FMX-190 enforces the FMX-191 no-P2W promise. It does not reopen
the monetization model or FMX-194 legal/provider gates.

## D1 - record shape

| Option | Meaning | Assessment |
|---|---|---|
| **A. Dedicated ADR-0108** | Create one project-wide architecture invariant for no-P2W and MP/shared fairness. | **Recommended.** The rule spans Commerce, Match, League, Statistics, Transfer, Scouting, exports and future MP. |
| B. Fold into ADR-0107 only | Keep it inside the monetization boundary ADR. | Too narrow; ADR-0107 is still draft and product/provider focused. |
| C. Test-only implementation note | Skip the ADR and create only a future test note. | Reject. This is a product/architecture invariant, not just a test recipe. |

**Recommendation:** A.

## D2 - covered competitive surfaces

| Option | Meaning | Assessment |
|---|---|---|
| **A. Broad shared/competitive coverage** | Cover shared saves, rankings, async groups, watch-party/conference state, exports, official comparisons, matchmaking, rewards and future MP. | **Recommended.** No-P2W can be broken before full multiplayer exists. |
| B. MP-only | Only future server-authoritative multiplayer is protected. | Too late and too narrow; async/ranking/comparison surfaces already create competitive truth. |
| C. Ranked-only | Protect only explicit ladders and leaderboards. | Misses private-group fairness, official exports and comparison surfaces. |

**Recommendation:** A.

## D3 - enforcement level during docs-only phase

| Option | Meaning | Assessment |
|---|---|---|
| **A. Docs-level test contract now, code tests later** | ADR-0108 names mandatory future static/API/property/integration gates, but no code is added while repo is docs-only. | **Recommended.** Matches phase reality and prevents prose-only drift. |
| B. Add code tests now | Rebuild a test harness immediately. | Reject for current phase; no app/toolchain exists beyond docs validation. |
| C. Prose-only invariant | State the promise without a future gate. | Reject. Linear asks for a test-backed invariant. |

**Recommendation:** A.

## D4 - paid information advantage

| Option | Meaning | Assessment |
|---|---|---|
| **A. Forbidden power unless equal baseline exists** | Paid hidden-state reveal, stronger scouting certainty, tactical predictions or analytics advantage fail the no-P2W gate. | **Recommended.** In a management game, better private information is competitive power. |
| B. Allow paid analytics as supporter QoL | Advanced paid analysis is allowed if it does not directly change state. | Too risky unless every decision-relevant field is equally available to non-payers. |
| C. Decide per feature later | Leave information advantage undefined. | Reject. This is the most likely future loophole. |

**Recommendation:** A.

## D5 - visible cosmetics and soft P2W

| Option | Meaning | Assessment |
|---|---|---|
| **A. Explicitly non-competitive if mechanically inert** | Paid visible cosmetics are allowed when they have no gameplay, ranking, information, readability, fan/media or matchmaking effect. | **Recommended.** Preserves the FMX-191 model while addressing soft-P2W objections. |
| B. Hide paid cosmetics from shared surfaces | Cosmetic purchases remain private only. | Overly restrictive for a supporter/identity model. |
| C. Treat visible paid status as competitive by default | Any visible paid identity is a P2W risk. | Too broad; player perception risk can be controlled by hard zero-effect rules. |

**Recommendation:** A.

## Decision record

- 2026-06-13: FMX-190 claimed and moved to `In Progress`.
- 2026-06-13: Perplexity research and official/tooling source checks saved.
- 2026-06-13: draft ADR-0108 prepared as a non-binding proposal record.
- Accepted by Nico 2026-06-19: D1-D5 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A**.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A**.

No open Nico decision remains for FMX-190.

## Related

- [[../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
- [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
