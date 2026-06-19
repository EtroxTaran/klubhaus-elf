---
title: Raw ICU-MF1 Risk Register Reconciliation Research
status: raw
tags: [research, raw, perplexity, fmx-161, i18n, locale, paraglide, intl, cldr, risk-register]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-161
related:
  - [[../icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[raw-icu-mf1-risk-register-source-checks-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  - [[../../10-Architecture/11-Risks]]
---

# Raw ICU-MF1 Risk Register Reconciliation Research

Private Perplexity-style discovery capture for FMX-161. This note is raw input,
not implementation guidance. Source-checked conclusions live in
[[raw-icu-mf1-risk-register-source-checks-2026-06-18]] and the synthesis lives in
[[../icu-mf1-risk-register-reconciliation-2026-06-18]].

## Prompt

Verify whether FMX can reconcile the `11-Risks` row
`i18n ICU-MF1 validation pending` with ADR-0094's 2026-06-09 validation note.
ADR-0094 chooses Paraglide JS plus format.js/Tolgee for MVP locales
DE/EN/FR/ES/IT, says Paraglide native variants plus `Intl.PluralRules` cover
plural/select needs, ICU MessageFormat 1 is optional plugin support, flected
club names are a casus-slot/content-model concern, and Slavic
one/few/many/other pressure should be revalidated only when a Slavic locale is
added. Check current Paraglide/Intl/CLDR evidence and recommend whether the risk
row can become "resolved for MVP; revalidate on first Slavic/case-heavy locale".

## Perplexity Result - Condensed Transcript

Recommendation: yes, the risk row can be downgraded from broad "pending
ICU-MF1 validation" to "resolved for MVP locale scope; revalidate on first
Slavic/case-heavy locale or ICU-syntax migration", as long as FMX keeps explicit
plural-category QA for the actual message catalog.

Rationale:

- Paraglide JS exposes a native variants system for selectors and pluralization.
  Plural category selection is built on the platform `Intl.PluralRules` API.
- ICU MessageFormat 1 is not the default Paraglide authoring requirement. It is
  supported through an inlang plugin for teams that want to author ICU syntax.
- The MVP locale list DE/EN/FR/ES/IT avoids the highest-pressure Slavic case
  set. The stack does not need ICU-MF1 solely to select CLDR plural categories
  for the MVP languages.
- Slavic languages such as Polish, Czech and Russian have more visible
  one/few/many/other pressure and should be treated as the revalidation trigger.
- Inflected club names are not solved by ICU alone. They require an explicit
  content/model strategy, such as named casus slots or pre-supplied localized
  forms, so the risk should not be described as purely an ICU plugin risk.
- `format.js` remains useful as a polyfill family where runtime `Intl` support
  is insufficient, but the immediate risk is not "Paraglide cannot do plural
  categories without ICU".

Perplexity caution:

- The raw answer initially simplified the MVP languages as mostly
  one/other-only. Source checks corrected that: current CLDR/Intl datasets can
  expose `many` for some MVP locales too. The conclusion still holds because
  Paraglide/Intl can select those categories natively; the risk wording must not
  rely on "simple plurals only".

## Proposed Risk Register Direction From Raw Pass

- Replace `i18n ICU-MF1 validation pending` with
  `i18n ICU-MF1 resolved for MVP; residual Slavic/case-heavy locale gate`.
- Link the row to ADR-0094 and the FMX-161 packet.
- Keep a reopen condition:
  - first PL/CZ/RU or other Slavic/case-heavy locale;
  - first decision to make ICU MessageFormat syntax the authoring contract;
  - first real catalog messages that cannot be expressed cleanly with native
    Paraglide variants plus casus slots.
- Ask Nico to confirm no Slavic/case-heavy locale is near-term. If not
  confirmed, keep the residual gate active rather than marking the risk fully
  closed.
