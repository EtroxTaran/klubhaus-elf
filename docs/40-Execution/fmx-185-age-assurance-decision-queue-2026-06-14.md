---
title: FMX-185 age assurance decision queue
status: current
tags: [execution, decision-queue, age-gate, age-assurance, ratings, iarc, usk, legal, pending, fmx-185]
created: 2026-06-14
updated: 2026-06-14
type: decision-queue
binding: false
linear: FMX-185
related:
  - [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
  - [[../40-Compliance/age-assurance-and-rating-evidence]]
  - [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/auth-flows]]
  - [[../30-Implementation/client-telemetry]]
---

# FMX-185 age assurance decision queue

This is the HITL decision queue for FMX-185. It turns the research synthesis
[[../60-Research/age-assurance-and-iarc-rating-2026-06-14]] into explicit Nico
decisions before draft
[[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture|ADR-0112]]
can become binding.

## D1 - age-gate data model

| Option | Meaning | Assessment |
|---|---|---|
| **A. Keep 16+ self-declaration, no DOB** | One mandatory radio before signup fields; store only successful `attested_age_band = '16+'`; store no refusal. | **Recommended.** Best privacy/data-minimisation fit for current low-risk MVP and existing docs. |
| B. Collect DOB, derive age band, discard DOB | Stronger due-diligence signal but store only `<13` / `13-15` / `16+`. | More future-ready if under-16 accounts are planned, but over-collects for current no-under-16 account posture. |
| C. Add parent/guardian consent path | Allow under-16 accounts with verified parental consent and youth safeguards. | Reject for MVP; high legal/ops burden and broad product-scope expansion. |

**Recommendation:** A.

## D2 - under-16 refusal and telemetry

| Option | Meaning | Assessment |
|---|---|---|
| **A. No account, no persisted refusal, no optional telemetry** | "No" goes to offline/no-account play. Optional analytics/marketing never starts and no optional event is queued. | **Recommended.** Matches PM-18 F-06 and avoids a children's-data record. |
| B. Persist a minor flag | Store `<16` to enforce consent ineligibility. | Only useful if under-16 accounts exist; not needed for FMX MVP. |
| C. Let under-16 users create restricted accounts | Youth-account feature set. | Defer; needs parent controls, data retention and product policy decisions. |

**Recommendation:** A.

## D3 - strong age verification / AVS strictness

| Option | Meaning | Assessment |
|---|---|---|
| **A. No KJM-grade AVS at MVP** | Self-declared 16+ is a low-risk eligibility signal; AVS only becomes a trigger if scope changes. | **Recommended.** Official KJM AVS criteria target closed adult groups for harmful content, not current FMX. |
| B. Design an inactive AVS seam | Keep architecture ready for future high-risk features. | Reasonable later, but unnecessary without adult/harmful/high-risk scope. |
| C. Deploy identity/liveness/eID AVS now | Verify all signup users. | Reject as disproportionate and privacy-heavy. |

**Recommendation:** A.

## D4 - IARC/USK evidence home

| Option | Meaning | Assessment |
|---|---|---|
| **A. Stable compliance evidence note** | Use [[../40-Compliance/age-assurance-and-rating-evidence]] for build-versioned rating evidence and re-check triggers. | **Recommended.** One durable home that can feed IARC/USK/store submission later. |
| B. Keep rating evidence inside FMX-194 paid checklist | Treat ratings only as monetization evidence. | Reject; age/rating readiness applies before and beyond paid checkout. |
| C. Create per-release folders now | Pre-create release-specific evidence hierarchy. | Overkill until a release/app-shell exists. |

**Recommendation:** A.

## D5 - youth protection officer trigger

| Option | Meaning | Assessment |
|---|---|---|
| **A. JMStV §7 content/business-risk watch** | Replace 50k MAU with review before public launch, monetization, USK/IARC submission, USK 12+ signal, chat/UGC or sustained commercial operation; document the `<50 employees` / `<10m monthly accesses` self-regulation carve-out. | **Recommended.** Matches official source checks; 50k MAU was not confirmed as law. |
| B. Appoint external JmSchB now | Use external youth protection officer or USK/FSM membership immediately. | Conservative but premature in docs-only planning. |
| C. Keep 50k MAU trigger | Preserve pre-mortem wording. | Reject; creates a false legal threshold. |

**Recommendation:** A.

## D6 - scope split with FMX-193

| Option | Meaning | Assessment |
|---|---|---|
| **A. FMX-185 owns age assurance/rating only** | Responsible-gaming/no-dark-pattern statement remains FMX-193; cross-link where needed. | **Recommended.** Keeps each legal/product packet focused. |
| B. Fold responsible gaming into FMX-185 | Add no-lootbox/no-dark-pattern statement now. | Too broad and duplicates FMX-193. |

**Recommendation:** A.

## Decision record

- 2026-06-14: FMX-185 was already `In Progress` when execution started; no
  branch, PR or worktree existed for it.
- 2026-06-14: branch/worktree created:
  `codex/fmx-185-age-gate-age-assurance`.
- 2026-06-14: Perplexity research and official/source checks saved.
- 2026-06-14: synthesis created in
  [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]].
- 2026-06-14: compliance evidence home created in
  [[../40-Compliance/age-assurance-and-rating-evidence]].
- 2026-06-14: draft ADR-0112 prepared as a non-binding proposal record.
- Pending Nico: D1-D6 above.

## Recommended approval packet

Approve **D1=A, D2=A, D3=A, D4=A, D5=A, D6=A**.

## Related

- [[../60-Research/age-assurance-and-iarc-rating-2026-06-14]]
- [[../40-Compliance/age-assurance-and-rating-evidence]]
- [[../10-Architecture/09-Decisions/ADR-0112-age-assurance-and-rating-evidence-posture]]
