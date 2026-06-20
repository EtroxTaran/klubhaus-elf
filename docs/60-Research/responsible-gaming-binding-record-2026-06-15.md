---
title: "Responsible gaming binding record (FMX-193)"
status: current
tags: [research, synthesis, responsible-gaming, dark-patterns, monetization, compliance, iarc, usk, fmx-193]
context: audit-security
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-193
related:
  - [[raw-perplexity/raw-responsible-gaming-legal-regulatory-2026-06-15]]
  - [[raw-perplexity/raw-responsible-gaming-game-precedents-2026-06-15]]
  - [[raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
  - [[../40-Compliance/responsible-gaming]]
  - [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
  - [[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
  - [[../10-Architecture/09-Decisions/ADR-0107-pricing-and-iap-monetization-boundary]]
  - [[../10-Architecture/09-Decisions/ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[../50-Game-Design/GD-0041-monetization-model-and-no-pay-to-win-canon]]
  - [[../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../40-Compliance/monetization-legal-gates-evidence-2026-06-13]]
---

# Responsible gaming binding record (FMX-193)

## Scope

FMX-193 creates the accepted responsible-gaming packet for the PM-18
responsible-gaming findings. It defines the current home for:

- no paid random rewards / loot boxes;
- dark-pattern and pressure-loop bans;
- public responsible-gaming statement;
- optional wellness/session reminders;
- release evidence for IARC/USK and paid-scope reviews.

This note is a planning synthesis, not legal advice. The draft decision home is
[[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant|ADR-0122]].
The HITL queue is
[[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]].

## Evidence synthesis

### Legal and rating posture

The source-checked posture is conservative:

- The EU DSA already makes dark-pattern avoidance a mainstream digital-service
  requirement and explicitly frames minors and deceptive design as protected
  areas.
- USK/IARC expose in-game purchases, randomized purchases, gambling themes,
  pressure to play and pressure to buy as rating/review evidence.
- German prevention sources explain loot boxes/random items as a spending-risk
  mechanism even where German law does not treat loot boxes as gambling per se.
- The Austrian Supreme Court loot-box decision reduced one DACH litigation
  pressure point for a specific pack design, but it did not create a blanket
  safe harbor.

Therefore FMX should not wait for a legal bright line before setting the product
invariant. The lowest-risk and clearest trust posture remains: **no paid random
rewards, no loot boxes, no paid player/item packs and no paid trading path**.

### Game and market precedent

Two football-manager examples are the clearest contrast:

- Hattrick is the positive precedent: long-term strategy, play at your own pace,
  no need for daily bonus/currency collection and no way to buy in-game
  advantages.
- Top Eleven is the counterexample: modern listing evidence includes in-app
  purchases with random items, collection/packs, season/event rewards and
  persistent event pressure.

FMX should use the Hattrick pressure profile, but be stricter than Hattrick on
paid information advantage. ADR-0108 already recommends treating paid information
advantage as forbidden power; FMX-193 should extend that trust posture into
responsible-gaming copy and audit artifacts.

### Product guardrail split

FMX-193 should not ratify the whole monetization model. Instead:

- ADR-0107/GD-0041 decide monetization model and entitlement classes.
- ADR-0108 decides competitive fairness / no-P2W.
- ADR-0122 should decide the responsible-gaming invariant: no paid randomness,
  no coercive retention pressure, public statement and compliance evidence.
- [[../40-Compliance/responsible-gaming]] should become the durable checklist
  and public-statement draft home once ADR-0122 is accepted.

## Recommended approval packet

| Decision | Recommendation | Rationale |
|---|---|---|
| D1 record shape | **A. Dedicated ADR-0122 + compliance home** | Responsible gaming spans legal/rating evidence, UX, product copy and monetization; a standalone record is easier to audit than burying it in ADR-0107/0108. |
| D2 paid randomness | **A. Hard no paid random rewards** | Strongest product trust posture; simplest IARC/USK evidence; avoids fact-specific legal ambiguity. |
| D3 dark-pattern gate | **A. Ban + release self-audit** | DSA, consumer-law and youth-protection evidence all make this a live design constraint. |
| D4 wellness reminders | **A. Optional local reminders, default off for 18+** | Supports balanced play without paternalism or tracking-heavy telemetry. |
| D5 public statement | **A. Versioned statement now, product route later** | Creates one source of truth before UI/copy drift; publish in product when the app/site exists. |
| D6 scope split | **A. Responsible gaming only** | PM-18 also contains OSS/license issues, but mixing them would block the responsible-gaming record. |
| D7 relation to monetization drafts | **A. Bind guardrails independently if accepted** | No paid randomness / no dark patterns can be accepted before final SKU decisions. |

Recommended selection: **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A, D7=A**.

## Proposed invariant vocabulary

- **Paid random reward:** any real-money, premium-currency, subscription,
  paid-bundle or paid-service path where the player pays before knowing the
  exact digital reward, item, player, pack, cosmetic or entitlement.
- **Loot-box-like mechanic:** randomized reward presentation, item pack, mystery
  award, card pack or prize draw that has purchase pressure or paid acquisition.
- **Coercive retention pressure:** UI/copy/mechanics that materially push a
  player to return or continue through false urgency, guilt, streak loss,
  punitive absence, hidden defaults, confirmshaming, roach-motel friction or
  paid relief from pressure.
- **Wellness reminder:** local, optional, neutral session-time prompt that gives
  the player awareness and an easy dismiss/disable path.
- **Responsible-gaming statement:** versioned public product truth covering paid
  randomness, pressure loops, no-P2W relation, session reminders and update date.

## Proposed release self-audit

Any release that adds or changes monetization, retention, notifications, rating
descriptors, account/account-age handling or public product copy should answer:

| Check | Pass condition |
|---|---|
| Paid randomness | No paid path produces unknown/random rewards, packs, draws or paid tradable outcomes. |
| Price clarity | Real-currency price and entitlement are visible before purchase; no bundle mismatch or hidden recurring charge. |
| Absence safety | No daily login streak, lost-streak purchase, punitive absence, "your club misses you" guilt copy or paid comeback relief. |
| Urgency | Any countdown or limited offer must be real, dated and not attached to paid pressure; MVP default is none. |
| Exit/cancel | Neutral copy, symmetrical buttons, no confirmshaming, no red/green manipulation. |
| Notifications | Opt-in per channel; informational copy; easy disable path; frequency caps. |
| Rating evidence | IARC/USK evidence records purchases, random-item absence, gambling theme absence/presence, pressure descriptors, ads, online interaction and change log. |
| Public statement | Statement version/date updated when the above changes materially. |

## Open Nico decisions

ADR-0122 and [[../40-Compliance/responsible-gaming]] remain draft/non-binding
until Nico answers D1-D7 in
[[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]].

## Related

- [[raw-perplexity/raw-responsible-gaming-legal-regulatory-2026-06-15]]
- [[raw-perplexity/raw-responsible-gaming-game-precedents-2026-06-15]]
- [[raw-perplexity/raw-responsible-gaming-source-checks-2026-06-15]]
- [[../10-Architecture/09-Decisions/ADR-0122-responsible-gaming-and-dark-pattern-invariant]]
- [[../40-Compliance/responsible-gaming]]
- [[../40-Execution/fmx-193-responsible-gaming-decision-queue-2026-06-15]]
