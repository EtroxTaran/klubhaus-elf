---
title: ICU-MF1 Risk Register Reconciliation
status: current
tags: [research, synthesis, fmx-161, i18n, locale, paraglide, intl, cldr, risk-register]
created: 2026-06-18
updated: 2026-06-18
type: research
binding: false
linear: FMX-161
related:
  - [[raw-perplexity/raw-icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[raw-perplexity/raw-icu-mf1-risk-register-source-checks-2026-06-18]]
  - [[../40-Execution/fmx-161-icu-mf1-risk-register-decision-queue-2026-06-18]]
  - [[../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  - [[../10-Architecture/11-Risks]]
  - [[../00-Index/Decision-Log]]
---

# ICU-MF1 Risk Register Reconciliation

## Intent

FMX-161 reconciles a stale risk-register row with ADR-0094. The risk register
still said `i18n ICU-MF1 validation pending`, while ADR-0094 already contains a
2026-06-09 validation note: for MVP locales DE/EN/FR/ES/IT, the headline
ICU-MF1 risk is resolved because native Paraglide variants plus platform
`Intl.PluralRules` handle plural/select categories and ICU MessageFormat 1
syntax is optional plugin support.

This note is non-binding evidence. The paired decision queue asks Nico to
confirm the remaining locale-scope gate.

## Conclusion

Recommended reconciliation:

- Treat the ADR-0094 headline ICU-MF1 risk as **resolved for the MVP locale
  scope**.
- Keep a residual active gate for the **first Slavic/case-heavy locale** such as
  PL/CZ/RU, or the first move to make ICU MessageFormat syntax the authoring
  contract.
- Avoid the inaccurate shortcut "MVP locales are one/other only"; current
  `Intl`/CLDR category sets can expose `many` for some MVP locales too.
- Make the actual control "catalog QA against the active locale's
  `Intl.PluralRules` category set", plus casus-slot coverage for inflected club
  names.

## Evidence Summary

| Question | Source-checked answer | Consequence |
|---|---|---|
| Does Paraglide need ICU-MF1 to select plural categories? | No. Paraglide variants and formatting docs state pluralization uses `Intl.PluralRules`; ICU MessageFormat 1 is supported through plugin-based file/message formats. | The risk row should not hold the MVP stack as broadly pending on ICU-MF1. |
| Does platform/FormatJS plural support cover more than one/other? | Yes. MDN and FormatJS expose the LDML category vocabulary `zero`, `one`, `two`, `few`, `many`, `other`; FormatJS locale data comes from CLDR. | FMX must QA actual categories per locale; source checks corrected the raw "simple MVP plurals" simplification. |
| Where is the remaining linguistic risk? | CLDR shows some languages need multiple categories and case/gender-sensitive minimal pairs; Russian/Czech examples show visible one/few/many pressure. | Reopen on first Slavic/case-heavy locale, not on the current DE/EN/FR/ES/IT MVP scope. |
| Are inflected club names an ICU-only problem? | No. CLDR warns about noun/gender/case behavior; ADR-0094 already classifies flected club names as a casus-slot content-model concern. | Keep casus slots or supplied localized forms as the control; do not imply ICU syntax alone solves club-name inflection. |

## Proposed Canonical Wording

Risk name:

`i18n ICU-MF1 resolved for MVP; residual Slavic/case-heavy locale gate`

Why:

ADR-0094's validation resolves the headline MVP risk for DE/EN/FR/ES/IT:
Paraglide native variants use `Intl.PluralRules`, ICU MessageFormat 1 remains
optional plugin syntax, and inflected club names are handled by casus-slot
content modeling. Source checks show current CLDR/Intl can expose categories
such as `many` for some MVP locales, so the control is category QA, not a
one/other-only assumption. The remaining risk materializes when FMX adds a
Slavic/case-heavy locale or switches to ICU syntax as the authoring contract.

Mitigation:

Keep ADR-0094 as the stack source. Mark the broad MVP ICU-MF1 concern
resolved-for-MVP, but keep an active reopen gate before PL/CZ/RU or another
case-heavy locale enters near-term scope. At that point validate
one/few/many/other coverage, casus-slot data, message authoring ergonomics and
whether the ICU MF1 plugin, Lingui or another fallback is needed.

## Nico Decision Needed

FMX-161 can reconcile the stale row without reopening ADR-0094, but Nico should
confirm the residual gate before the PR is marked ready:

- Does FMX keep PL/CZ/RU and other Slavic/case-heavy locales out of MVP and the
  near-term implementation wave?
- Should first Slavic/case-heavy locale support be the explicit reopen trigger?
- Should the stale ADR-0094 body/open-question wording be cleaned now, or left
  as a separate status-drift follow-up because ADR-0094 is the source for this
  issue?

Recommendation: yes to the first two; leave the broader ADR-0094 body cleanup as
a separate follow-up unless Nico wants FMX-161 to expand.
