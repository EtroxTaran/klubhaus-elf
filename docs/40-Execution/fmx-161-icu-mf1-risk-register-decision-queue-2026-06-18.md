---
title: FMX-161 ICU-MF1 Risk Register Decision Queue
status: draft
tags: [execution, decision-queue, fmx-161, i18n, locale, risk-register, paraglide, intl]
created: 2026-06-18
updated: 2026-06-18
type: decision-queue
binding: false
linear: FMX-161
related:
  - [[../60-Research/icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[../60-Research/raw-perplexity/raw-icu-mf1-risk-register-source-checks-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  - [[../10-Architecture/11-Risks]]
  - [[../00-Index/Decision-Log]]
---

# FMX-161 ICU-MF1 Risk Register Decision Queue

## Status

Awaiting Nico. This queue reconciles a stale risk-register/front-door line with
accepted ADR-0094 evidence, but the residual locale-scope confirmation should be
answered before the PR is marked ready.

## D1 - Risk Register Status

Options:

- **A. Mark the broad ICU-MF1 MVP risk resolved, with a residual
  Slavic/case-heavy locale gate.**
- **B. Keep ICU-MF1 validation as an active broad risk until a real catalog
  spike proves every MVP message.**
- **C. Reopen ADR-0094 and choose a different i18n stack or first-class ICU
  authoring system now.**

Recommendation: **A.**

Reason: ADR-0094 already resolves the headline risk for MVP locales
DE/EN/FR/ES/IT, and current source checks support that conclusion. Paraglide
native variants use `Intl.PluralRules`; ICU MF1 is optional plugin syntax; the
remaining hard case is future Slavic/case-heavy localization and casus-slot data
quality. B overstates the blocker; C is unnecessary absent a near-term Slavic
locale or ICU-authoring requirement.

## D2 - Residual Locale Reopen Trigger

Options:

- **A. First Slavic/case-heavy locale addition reopens the risk.** Examples:
  PL/CZ/RU or any locale with material case/gender/one-few-many pressure.
- **B. Reopen only when PL, CZ or RU specifically enters scope.**
- **C. Do not name a locale trigger; rely on generic translation QA later.**

Recommendation: **A.**

Reason: A catches the actual linguistic risk without overfitting the control to
three example locales. B misses other case-heavy languages. C is too vague for a
risk register.

## D3 - Near-Term Locale Scope

Options:

- **A. Confirm no Slavic/case-heavy locale is MVP or near-term implementation
  scope.**
- **B. Add a named Slavic/case-heavy locale to near-term scope, which keeps the
  residual risk active and requires an i18n spike before locale migration.**
- **C. Leave near-term locale scope undecided; keep the residual risk active.**

Recommendation: **A**, if it matches product intent.

Reason: The current accepted MVP scope is DE/EN/FR/ES/IT. No current front-door
note found by FMX-161 adds PL/CZ/RU to MVP. If Nico wants a Slavic/case-heavy
locale near-term, the risk should remain active until a spike proves categories,
casus slots and authoring ergonomics.

## D4 - ADR-0094 Body Cleanup

Options:

- **A. Clean ADR-0094 stale body/open-question wording in FMX-161.**
- **B. Leave ADR-0094 unchanged and file/track a separate status-drift follow-up
  if Nico wants body cleanup.**
- **C. Reopen ADR-0094 because stale body text invalidates the accepted
  decision.**

Recommendation: **B.**

Reason: FMX-161's issue text says ADR-0094 remains the source. The current task
is risk-register/front-door reconciliation, not a rewrite of the ADR body. The
stale body wording is visible drift, but it does not change the frontmatter
status or the validation note used here.

## Proposed Answer Packet For Nico

If approved:

- D1 = A
- D2 = A
- D3 = A unless a Slavic/case-heavy locale is planned near-term
- D4 = B

This makes the risk-register row resolved-for-MVP, keeps the residual reopen
gate explicit and avoids expanding FMX-161 beyond the stale risk-register
reconciliation.
