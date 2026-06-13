---
title: FMX-191 Monetization model decision queue
status: current
tags: [execution, decision-queue, monetization, no-p2w, pricing, pending, fmx-191]
created: 2026-06-13
updated: 2026-06-13
type: decision-queue
binding: false
linear: FMX-191
addresses: [PM-2026-05-20-04-F-01]
related:
  - [[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
---

# FMX-191 Monetization model decision queue

This is the HITL decision queue for FMX-191. It turns the research synthesis
[[../60-Research/monetization-model-and-no-p2w-canon-2026-06-13]] into explicit
Nico decisions before [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]]
or [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]]
can become binding.

Scope premise already selected in this beat: **FMX-191 = model-level canon**.
FMX-190 is the follow-up for CI/test enforcement and multiplayer fairness
verification; as of 2026-06-13 it has produced draft
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]]
as a non-binding proposal.

## D1 - launch monetization model

| Option | Meaning | Assessment |
|---|---|---|
| **A. Free core + cosmetics + optional Supporter Club** | Core game free to start; paid deterministic cosmetics; optional non-power supporter membership | **Recommended.** Best balance of PWA acquisition, genre trust and recurring revenue without selling power. |
| B. One-time premium | Pay once for the game; no IAP except possibly expansions | High trust, but weak unknown-PWA acquisition and no recurring service-cost model. |
| C. Free core + cosmetics only | No membership/pass at launch | Safest fairness stance, but leaves recurring revenue and fan-club identity depth weaker. |
| D. F2P with paid progression/power | Paid boosts, resources, speed-ups or competitive convenience | Reject. Directly conflicts with no-P2W and future multiplayer trust. |

**Recommendation:** A.

## D2 - supporter, season card and ads timing

| Option | Meaning | Assessment |
|---|---|---|
| **A. Supporter at launch; cosmetic season card later; no ads in MVP** | Launch with non-power supporter membership and cosmetics; add a cosmetic-only season card only after content cadence is proven | **Recommended.** Keeps MVP clean and avoids FOMO/filler pressure. |
| B. Launch with supporter + season card | More monetization surface immediately | Higher content burden and greater dark-pattern/FOMO risk before retention is known. |
| C. Cosmetics only at launch; defer supporter/pass | Lowest complexity | May underfund service costs and misses the best Hattrick-style precedent. |
| D. Add optional rewarded ads | Monetizes non-payers | Privacy, UX, ratings and trust costs are high for a serious football-manager product. |

**Recommendation:** A.

## D3 - Investor handling

| Option | Meaning | Assessment |
|---|---|---|
| **A. Keep ADR-0063 Investor as singleplayer-only special case** | Investor cash remains isolated to singleplayer saves and excluded from shared/ranked/MP/comparison surfaces | **Recommended.** Preserves accepted design memory while preventing competitive spillover. |
| B. Defer Investor activation until FMX-194/legal work | Keep ADR-0063 as a paper boundary, but do not include it in the active monetization canon yet | Conservative if Nico wants zero paid gameplay-adjacent value until vendor/legal review. |
| C. Remove Investor from monetization canon | Treat Investor as not part of FMX monetization | Not recommended because ADR-0063 already documents it and GD-0022 references clean SP cash. |

**Recommendation:** A.

## D4 - no-P2W entitlement taxonomy

| Option | Meaning | Assessment |
|---|---|---|
| **A. Strict model-level taxonomy now** | Allowed: cosmetics, non-authoritative supporter QoL/history, account services and SP-only Investor. Forbidden: power, paid information, speed-ups, paid randomness with power and tradeable paid items. | **Recommended.** Gives future SKU, store and MP work a hard red/green gate. |
| B. Strict taxonomy plus CI/test enforcement now | Do FMX-190 inside this issue | Correct end-state but wrong scope; mixes model ratification with test-framework work. |
| C. Soft principle only | "Avoid P2W" without classifying edge cases | Reject. Too vague for future agents and store/SKU design. |

**Recommendation:** A.

## D5 - FMX-190 follow-up boundary

| Option | Meaning | Assessment |
|---|---|---|
| **A. FMX-191 canon; FMX-190 enforcement** | This issue ratifies model/ADR/GDDR; FMX-190 later adds SKU/contract tests and MP fairness CI | **Recommended and matches the scope premise.** |
| B. Merge FMX-190 into FMX-191 now | One larger monetization/fairness epic | Too broad for this beat and delays the decision record. |
| C. Drop FMX-190 follow-up | Rely on prose only | Reject. No-P2W needs future enforcement once SKU/contracts exist. |

**Recommendation:** A.

## Decision record

- 2026-06-13: FMX-191 claimed and moved to `In Progress`.
- 2026-06-13: market, legal/store/privacy, no-P2W guardrail and official source-check
  research saved.
- 2026-06-13: draft [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]]
  and [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]]
  prepared as non-binding proposal records.
- Pending Nico: D1-D5 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A**.
