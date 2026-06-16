---
title: ADR-0108 No-Pay-to-Win and Multiplayer Fairness Invariant
status: draft
tags: [adr, architecture, monetization, no-p2w, multiplayer, fairness, testing, fmx-190]
created: 2026-06-13
updated: 2026-06-13
type: adr
binding: false
amends:
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-no-p2w-mp-fairness-guardrails-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-football-manager-monetization-precedents-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-no-p2w-legal-store-policy-2026-06-13]]
  - [[../../60-Research/raw-perplexity/raw-no-p2w-test-gate-tooling-2026-06-13]]
  - [[../../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[ADR-0063-investor-entitlement-and-payment-boundary]]
  - [[ADR-0109-payment-provider-and-monetization-legal-gates]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../../30-Implementation/ci-and-review-process]]
---

# ADR-0108: No-Pay-to-Win and Multiplayer Fairness Invariant

## Status

draft

> **Decision gate.** This ADR is the non-binding FMX-190 proposal. It becomes
> binding only if Nico approves D1-D5 in
> [[../../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]].
> Until then it is planning context and must not be implemented from.

## Date

- Drafted: 2026-06-13 (FMX-190)

## Context

Nico's product canon is strict no-pay-to-win: real money never buys competitive
power. Before FMX-190, that rule existed in scattered form:

- [[../../50-Game-Design/GD-0022-economy-commercial-impact-and-contracts|GD-0022]]
  says Investor cash is clean singleplayer value and must not create competitive
  advantage.
- [[ADR-0063-investor-entitlement-and-payment-boundary|ADR-0063]] defines
  `InvestorAllowState` with SP-allowed / MP-denied / offline-deferred handling.
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon|GD-0041]]
  and [[ADR-0107-pricing-and-iap-monetization-boundary|ADR-0107]] propose the
  FMX-191 monetization model and entitlement taxonomy.

That is not yet enough for a project-wide invariant. Future cosmetics, Supporter
features, account services, singleplayer assistance, store/provider work and
eventual multiplayer all need one testable rule.

## Options considered

### D1 - record shape

| Option | Shape | Assessment |
|---|---|---|
| **A. Dedicated ADR-0108** | One project-wide architecture invariant for no-P2W and shared/MP fairness. | **Recommended.** The rule spans many contexts and future CI. |
| B. Fold into ADR-0107 only | Keep the rule inside the monetization boundary. | Too narrow; ADR-0107 is product/provider-boundary focused and still draft. |
| C. Test-only note | Record only the future test matrix. | Too weak for a load-bearing product promise. |

### D2 - competitive surface coverage

| Option | Shape | Assessment |
|---|---|---|
| **A. Broad shared/competitive surface** | Shared saves, rankings, async groups, watch-party state, exports, official comparisons, matchmaking, rewards and future MP. | **Recommended.** Competitive truth appears before full MP ships. |
| B. MP-only | Only future server-authoritative multiplayer. | Too narrow. |
| C. Ranked-only | Only ladders/leaderboards. | Misses private groups and official comparisons. |

### D3 - enforcement level

| Option | Shape | Assessment |
|---|---|---|
| **A. Docs-level contract now, code tests later** | Name the required future architecture/API/property/integration gates, but do not add code in the docs-only phase. | **Recommended.** Matches project phase. |
| B. Add code tests now | Rebuild test harness immediately. | Reject; the repo is docs-vault-only. |
| C. Prose-only | State the principle without a future gate. | Reject; Linear explicitly asks for test-backed. |

### D4 - paid information advantage

| Option | Shape | Assessment |
|---|---|---|
| **A. Forbidden power unless equal baseline exists** | Paid hidden-state reveal, stronger certainty, prediction or tactical analysis fails the gate. | **Recommended.** Management games turn information into outcomes. |
| B. Allow as Supporter QoL | Paid analytics can exist if it does not write state. | Too risky unless all decision-relevant knowledge is equally available. |
| C. Decide later | No invariant for information advantage. | Reject. |

### D5 - visible cosmetics

| Option | Shape | Assessment |
|---|---|---|
| **A. Non-competitive if mechanically inert** | Visible paid identity is allowed if it has no gameplay/readability/status/matchmaking/fan/media/ranking effect. | **Recommended.** Preserves cosmetic monetization and answers soft-P2W objections. |
| B. Private-only paid cosmetics | Never show paid cosmetics to opponents/groups. | Too restrictive for club identity. |
| C. Visible paid status is competitive by default | Treat visibility as P2W risk by itself. | Too broad. |

## Proposed decision if accepted

Adopt a project-wide invariant:

> Real money may unlock presentation, identity, account service or strictly
> isolated singleplayer assistance, but it must have zero effect on competitive
> shared state.

## Invariant definitions

- **Real-money entitlement:** any account/save right unlocked through money,
  premium currency, platform purchase, subscription, paid bundle, paid service,
  refund/revocation handling or provider-confirmed entitlement state.
- **Competitive shared state:** authoritative or official state used by shared
  saves, rankings, async private groups, watch-party/conference state, exports,
  official comparisons, matchmaking, rewards or future multiplayer.
- **Paid information advantage:** any paid feature that reveals hidden state,
  narrows probability bands, improves forecasts, improves scouting certainty or
  grants tactical/analytics conclusions beyond the non-paying baseline.
- **Zero-effect:** given the same authoritative inputs and deterministic seed,
  competitive outputs are identical with paid entitlements present, absent or
  reassigned, except for explicitly cosmetic presentation fields.

## Boundary rules

### 1. Entitlement classes

All real-money entitlements must classify into one of these buckets before
implementation:

| Class | Competitive-state policy |
|---|---|
| `cosmetic_identity` | Allowed only for presentation/profile surfaces; no readability, match, fan/media, ranking or reward effect. |
| `supporter_qol` | Allowed only for non-authoritative history, convenience and social/profile curation; no hidden information or decision automation. |
| `account_service` | Allowed only for account/profile service with no fixture, ranking, squad, economy, reward or matchmaking effect. |
| `singleplayer_investor` | ADR-0063 special case; allowed only in isolated non-shared singleplayer saves. |
| `forbidden_power` | Not implementable without superseding this ADR and GD-0041/ADR-0107 through Nico. |

### 2. Investor generalization

ADR-0063's Investor is now treated as a special case of this wider invariant:

- `InvestorAllowState = SP-allowed` only inside isolated singleplayer saves.
- `InvestorAllowState = MP-denied` for every shared/ranked/async/watch-party/export/
  official-comparison/future-MP surface.
- A save or account that has received singleplayer paid assistance cannot become an
  official competitive/shared save. FMX-189 resolves the earlier
  neutralization/exclusion fork as a hard SP/Hotseat/import -> MP prohibition.
- Refund/revocation changes entitlement state only; it must not rewrite competitive
  simulation facts or create MP/share advantages.

### 3. Paid information advantage

Paid scouting certainty, hidden-attribute reveal, tactical prediction, stronger
opponent analysis, premium recommendations or better model outputs are competitive
power unless the same decision-relevant information is available to non-paying
players under the same rules and cadence.

### 4. Soft P2W / visible cosmetics

Visible paid cosmetics are explicitly non-competitive when all are true:

- no authoritative state effect;
- no match readability advantage;
- no fan/media/board/rivalry pressure effect;
- no matchmaking, ranking, reward, export or official-comparison effect;
- no hidden information or signal that affects competitive decisions.

## Proposed future CI gate

No code is added in the docs-only phase. When implementation returns, this ADR
requires a future `no-p2w-architecture-contract` gate, analogous in role to
ADR-0089 D3's no-shared-tables invariant:

- **Static boundary check:** competitive contexts must not import Commerce,
  IAP, provider, transaction or entitlement internals.
- **API/schema contract check:** Match, League, Statistics, Transfer, Scouting,
  rewards, export and comparison contracts must not accept payment/entitlement
  fields as competitive inputs.
- **Property-based zero-effect check:** generated histories and entitlement
  assignments produce identical authoritative outputs after paid entitlements are
  stripped or shuffled.
- **Integration scenario check:** purchase/refund/revocation flows affect only
  cosmetic/profile/account-service state, or isolated singleplayer saves marked
  non-shared/non-ranked.
- **Copy/source gate:** player/store copy cannot claim no-P2W for an
  implementation path until the corresponding entitlement taxonomy and tests exist.

The intended future tooling is a dedicated Vitest Test Project plus fast-check
properties/model tests, using the current project stack; no new dependency is
approved by this ADR.

## Rationale

Option A/A/A/A/A gives the no-P2W promise the same level of architectural force as
other cross-context invariants without pretending implementation exists today. It
keeps the FMX-191 monetization model intact, generalizes ADR-0063, and prevents
the most likely loopholes: paid scouting certainty, paid analytics, speed-ups,
extra attempts, tradeable paid value and future MP spillover.

## Consequences

Positive:

- Future SKU, provider and Supporter work gets a hard red/green fairness gate.
- The Investor boundary becomes a special case of a general project invariant.
- Paid information advantage is closed as a loophole before implementation.
- Future CI work has a named contract instead of relying on prose.

Negative / constraints:

- Supporter features involving analytics/history need careful review.
- Product copy must avoid absolute no-P2W claims until implementation has the
  corresponding test gate.
- FMX-194 / draft
  [[ADR-0109-payment-provider-and-monetization-legal-gates|ADR-0109]] still
  needs legal/provider/age/refund review before any paid launch.

## Supersedes

None.

## Related Docs

- [[../../60-Research/no-pay-to-win-and-mp-fairness-invariant-2026-06-13]]
- [[../../40-Execution/fmx-190-no-p2w-mp-fairness-decision-queue-2026-06-13]]
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
- [[ADR-0107-pricing-and-iap-monetization-boundary]]
- [[ADR-0063-investor-entitlement-and-payment-boundary]]
- [[ADR-0109-payment-provider-and-monetization-legal-gates]]
- [[ADR-0089-bounded-context-portfolio-reconciliation]]
