---
title: "No-pay-to-win and MP-fairness invariant (FMX-190)"
status: current
tags: [research, synthesis, monetization, no-p2w, multiplayer, fairness, testing, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: research
binding: false
linear: FMX-190
related:
  - [[raw-perplexity/raw-no-p2w-mp-fairness-guardrails-2026-06-13]]
  - [[raw-perplexity/raw-football-manager-monetization-precedents-2026-06-13]]
  - [[raw-perplexity/raw-no-p2w-legal-store-policy-2026-06-13]]
  - [[raw-perplexity/raw-no-p2w-test-gate-tooling-2026-06-13]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
---

# No-pay-to-win and MP-fairness invariant (FMX-190)

## Scope

FMX-190 takes the FMX-191 model-level promise and turns it into a project-wide,
testable invariant. It does not reopen which monetization model FMX should use.
It defines the fairness boundary that every current and future real-money
entitlement must satisfy.

Decision home: draft
[[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]].
Decision queue:
[[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]].

## Evidence synthesis

Market and player-perception evidence:

- Football-manager communities treat supporter-style identity/history/status as
  acceptable when it does not affect squad strength, scouting, training,
  transfers, opportunity volume or competitive results.
- Top Eleven/OSM-style tokens, boosters, paid scout usage, speed-ups and recovery
  shortcuts are common negative examples because they affect squad quality,
  preparation quality or competitive tempo.
- "Soft P2W" is a live perception risk: even if money does not buy a guaranteed
  win, it can buy efficiency, information, retries or pressure relief that changes
  competitive outcomes over a season.

Legal/store/policy evidence:

- Apple and Google require in-app purchase/payment-policy compliance for digital
  goods in their ecosystems and require odds disclosures for purchased randomized
  virtual items.
- EU consumer-law summaries emphasize clear pre-contract information, prices,
  withdrawal information and consent for additional paid services.
- European Commission dark-pattern sweeps highlight pressure selling, drip pricing,
  hidden information and subscription manipulation as consumer-protection risks.
- Therefore the no-P2W claim should be treated as factual product truth, while
  provider/refund/age-gate/legal wording remains FMX-194.

Testing/tooling evidence:

- ADR-0089 already established the precedent of explicit architecture-test
  invariants for cross-context boundaries.
- Current Vitest docs support separated projects for dedicated test suites.
- Current fast-check docs support generated property/model tests with shrinking
  and reproducible failure paths.

## Recommendation

Create a dedicated ADR for the invariant:

> Real money may unlock presentation, identity, account service or strictly
> isolated singleplayer assistance, but it must have zero effect on competitive
> shared state.

Recommended decision packet:

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 record shape | **A. Dedicated ADR-0108** | A project-wide invariant is broader than the FMX-191 monetization draft and needs architecture-test hooks. |
| D2 surface coverage | **A. Broad shared/competitive coverage** | Future MP is not the only risk; async groups, rankings, watch-party, exports and comparisons can all carry competitive truth. |
| D3 enforcement level | **A. Docs-level test contract now, code tests later** | The repo is docs-only; naming the future gate now avoids prose-only drift without pretending tests can run today. |
| D4 paid information | **A. Treat paid information advantage as forbidden power** | In a management game, hidden knowledge and stronger analysis affect decisions and outcomes. |
| D5 visible cosmetics | **A. Explicitly non-competitive if mechanically inert** | Defuses soft-P2W/status objections while preserving the cosmetic monetization model. |

## Proposed invariant vocabulary

- **Real-money entitlement:** any account/save right unlocked through money,
  premium currency, subscription, paid bundle, platform purchase or paid service.
- **Competitive shared state:** authoritative or official state used by shared
  saves, rankings, async groups, watch-party/conference state, exports,
  official comparisons, matchmaking, rewards or future multiplayer.
- **Paid information advantage:** any paid feature that reveals hidden state,
  improves certainty, improves forecasts or increases tactical/scouting analysis
  beyond the non-paying baseline.
- **Zero-effect:** under the same authoritative inputs and deterministic seeds,
  competitive outputs are byte-/value-identical with paid entitlements present,
  absent or reassigned, except for explicitly cosmetic presentation fields.

## Proposed test matrix

When implementation returns, the CI gate should include:

- static boundary check: competitive contexts must not import Commerce/IAP/payment
  internals or depend on entitlement state;
- API/schema contract check: match, league, ranking, statistics, transfer,
  scouting and export contracts must not expose paid entitlement fields as inputs
  to competitive decisions;
- property-based zero-effect check: generated entitlement sets and generated
  competitive histories produce identical authoritative outputs after entitlement
  stripping or shuffling;
- integration scenario check: purchase/refund/revocation flows change only
  cosmetic/profile/account-service surfaces unless the save is explicitly
  non-shared singleplayer;
- text/source check: product copy and store metadata cannot claim no-P2W until
  the entitlement taxonomy and CI gate exist for the relevant implementation path.

## Open Nico decisions

ADR-0108 is a draft. Nico must approve or change D1-D5 in
[[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]] before it can
be accepted or treated as binding.

## Related

- [[raw-perplexity/raw-no-p2w-mp-fairness-guardrails-2026-06-13]]
- [[raw-perplexity/raw-football-manager-monetization-precedents-2026-06-13]]
- [[raw-perplexity/raw-no-p2w-legal-store-policy-2026-06-13]]
- [[raw-perplexity/raw-no-p2w-test-gate-tooling-2026-06-13]]
- [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]]
- [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
- [[../10-Architecture/09-Decisions/ADR-0063-investor-entitlement-and-payment-boundary]]
- [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
