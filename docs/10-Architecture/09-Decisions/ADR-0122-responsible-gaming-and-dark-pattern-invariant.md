---
title: ADR-0122 Responsible Gaming and Dark-Pattern Invariant
status: accepted
tags: [adr, architecture, responsible-gaming, dark-patterns, monetization, compliance, loot-boxes, fmx-193, accepted]
context: audit-security
created: 2026-06-15
updated: 2026-06-19
type: adr
binding: true
linear: FMX-193
amends:
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../40-Compliance/age-assurance-and-rating-evidence]]
supersedes:
superseded_by:
related:
  - [[../../60-Research/responsible-gaming-binding-record-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-responsible-gaming-legal-regulatory-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-responsible-gaming-game-precedents-2026-06-15]]
  - [[../../60-Research/raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
  - [[../../40-Compliance/responsible-gaming]]
  - [[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
  - [[ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
---

# ADR-0122: Responsible Gaming and Dark-Pattern Invariant

> **RATIFIED on 2026-06-19.** Nico approved the linked FMX decision
> queue via `APPROVE ALL RECOMMENDED`; this ADR/amendment is now
> binding according to its approved scope.


## Status

accepted

Prepared for FMX-193 on 2026-06-15. Binding after Nico approved D1-D7 on 2026-06-19 in
[[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]].

## Date

2026-06-15

## Context

PM-18 contains responsible-gaming risks that were only partially mitigated:
loot-box/legal ambiguity, DSA/digital-fairness pressure, session-time wellbeing
and the need for a public responsible-gaming statement.

FMX already has adjacent draft records:

- ADR-0107 / GD-0041 propose monetization classes.
- ADR-0108 proposes the no-pay-to-win and paid-information fairness invariant.
- [[../../40-Compliance/age-assurance-and-rating-evidence]] preserves age and
  rating evidence triggers.
- [[../../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
  preserves paid activation evidence.

Those records do not yet give responsible gaming a single durable home. FMX-193
adds that proposed home without accepting the broader monetization model.

## Proposed decision

### D1 - Record shape

FMX should keep a dedicated responsible-gaming ADR and compliance note:

- this ADR decides the invariant and ownership;
- [[../../40-Compliance/responsible-gaming]] carries the public statement draft,
  self-audit checklist and release evidence;
- ADR-0107/0108/GD-0041 remain separate decision gates.

### D2 - No paid random rewards

FMX should permanently ban paid random rewards unless a later ADR explicitly
reopens the invariant with legal, rating and product-trust evidence.

Blocked by default:

- loot boxes;
- paid player/item/card packs;
- paid mystery awards;
- paid prize draws;
- premium-currency random pulls;
- paid trading/skin-gambling-like paths;
- paid event packs where the exact reward is unknown before purchase.

Cosmetics remain possible only when fixed-price or otherwise deterministic and
mechanically inert.

### D3 - Dark-pattern and pressure-loop gate

FMX should block:

- false urgency or fake scarcity;
- daily-login streak rewards, streak-loss penalties and paid streak recovery;
- guilt copy and punitive absence mechanics;
- confirmshaming, hidden paid/default opt-ins and asymmetric exit buttons;
- roach-motel cancellation/account friction;
- paid relief from pressure that the product created;
- notifications whose main purpose is emotional pressure rather than factual
  information.

Any rating-, monetization- or retention-relevant release should save the
completed self-audit from [[../../40-Compliance/responsible-gaming]].

### D4 - Wellness/session reminders

FMX should reserve an optional local session reminder:

- default off for 18+ users;
- neutral copy;
- configurable thresholds;
- no required telemetry;
- one-step dismiss and one-step disable.

If a future accepted age-assurance record distinguishes 16/17 users at runtime,
Nico can decide whether reminders default on for that band. ADR-0122 should not
add new age tracking by itself.

### D5 - Public statement

The responsible-gaming statement should be versioned in the vault now and
published in-product when a public app/site route exists. The statement must be
updated when paid scope, retention loops, notifications or rating-relevant
mechanics materially change.

### D6 - Scope split

PM-18 also contains OSS/license decisions. This ADR deliberately does not decide
license strategy, repo split or source-availability posture. Those need their
own founder/legal decision packet.

### D7 - Relation to monetization drafts

ADR-0122 is binding independently of ADR-0107/0108/GD-0041.
It blocks paid randomness and dark patterns before final monetization SKUs are
approved. It does not approve any SKU, price, payment provider, supporter tier
or store policy.

## Options considered

### D1 - record shape

| Option | Meaning | Assessment |
|---|---|---|
| A. Dedicated ADR-0122 plus compliance home | One ADR for invariant; one compliance note for statement/checklist/evidence. | **Recommended.** Most auditable and least likely to be buried. |
| B. Fold into ADR-0107/0108 only | Extend monetization/no-P2W records. | Overloads existing drafts and mixes product wellbeing with competitive fairness. |
| C. Compliance note only | No ADR; checklist only. | Too weak for a cross-cutting invariant. |

### D2 - paid random rewards

| Option | Meaning | Assessment |
|---|---|---|
| A. Hard ban | No paid random rewards or loot-box-like paid mechanics. | **Recommended.** Cleanest trust/rating/legal posture. |
| B. Re-evaluate post-MVP | Allow only a future ADR to reopen. | Acceptable as future process, but current packet should still ban by default. |
| C. Allow disclosed paid random cosmetics | Odds/descriptors but paid randomness allowed. | Not recommended; rating and trust risk remain. |

### D3 - dark-pattern gate

| Option | Meaning | Assessment |
|---|---|---|
| A. Ban plus release self-audit | Explicit blocked patterns and saved evidence. | **Recommended.** Aligns DSA, youth-prevention and store/rating evidence. |
| B. Guideline only | Non-binding design advice. | Too easy to erode in live-ops copy. |
| C. Decide later | Wait for UI implementation. | Late and risky. |

### D4 - wellness/session reminders

| Option | Meaning | Assessment |
|---|---|---|
| A. Optional local reminders, default off for 18+ | Neutral, local, no required telemetry. | **Recommended.** Helpful without paternalism. |
| B. Default on for all users | Stronger nudge. | Higher friction and no clear need for adult strategy players. |
| C. No reminders | Omit feature entirely. | Leaves a low-cost wellbeing tool unused. |

### D5 - public statement

| Option | Meaning | Assessment |
|---|---|---|
| A. Versioned statement now, product route later | Vault statement first; publish when app/site exists. | **Recommended.** Single truth before copy drift. |
| B. Wait for launch | Draft at public-launch work. | Late. |
| C. Marketing-only copy | No compliance evidence role. | Too weak. |

### D6 - PM-18 scope split

| Option | Meaning | Assessment |
|---|---|---|
| A. Responsible-gaming only | Leave OSS/license to another issue. | **Recommended.** Keeps FMX-193 focused. |
| B. Include OSS/license | One combined ADR. | Founder/legal over-scope. |
| C. Defer all | Wait for license strategy. | Leaves responsible-gaming orphaned. |

### D7 - relation to monetization drafts

| Option | Meaning | Assessment |
|---|---|---|
| A. Bind guardrails independently if accepted | Responsible-gaming invariant can be accepted before SKUs. | **Recommended.** A no-random/no-dark-pattern invariant is safer than SKU design. |
| B. Wait for monetization ratification | Keep all draft. | Unnecessary delay. |
| C. Ratify monetization here | Accept ADR-0107/0108/GD-0041 via FMX-193. | Out of scope. |

## Consequences

If accepted:

- paid random rewards and dark-pattern retention loops become project-wide
  forbidden product patterns;
- compliance evidence for responsible gaming lives in one durable vault note;
- product copy has a versioned responsible-gaming source;
- IARC/USK evidence should preserve absence of random purchases and pressure
  descriptors;
- monetization SKU decisions remain separately gated.

If rejected or changed, keep this ADR accepted/binding and update
[[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
with Nico's selected options.

## Related

- [[../../60-Research/responsible-gaming-binding-record-2026-06-15]]
- [[../../40-Compliance/responsible-gaming]]
- [[../../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
- [[ADR-0107-pricing-and-iap-monetization-boundary]]
- [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[../../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
