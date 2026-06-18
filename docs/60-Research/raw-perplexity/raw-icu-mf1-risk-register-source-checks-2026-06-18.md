---
title: ICU-MF1 Risk Register Source Checks
status: raw
tags: [research, raw, source-check, fmx-161, i18n, locale, paraglide, intl, cldr, risk-register]
created: 2026-06-18
updated: 2026-06-18
type: raw-research
binding: false
linear: FMX-161
related:
  - [[../icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[raw-icu-mf1-risk-register-reconciliation-2026-06-18]]
  - [[../../10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope]]
  - [[../../10-Architecture/11-Risks]]
---

# ICU-MF1 Risk Register Source Checks

Source-check capture for FMX-161. This file records the evidence used to
correct the raw Perplexity pass and reconcile `11-Risks` with ADR-0094.

## Tooling Used

- Context7: `/opral/paraglide-js`, query for variants/plurals and ICU MF1 plugin
  posture.
- Ref:
  - Paraglide variants:
    <https://github.com/opral/inlang-paraglide-js/blob/main/docs/variants.md?plain=1#L38#pluralization>
  - Paraglide formatting:
    <https://github.com/opral/inlang-paraglide-js/blob/main/docs/formatting.md?plain=1#L6#formatting>
  - Paraglide FAQ:
    <https://github.com/opral/inlang-paraglide-js/blob/main/README.md?plain=1#L278#faq>
  - Paraglide file formats:
    <https://github.com/opral/inlang-paraglide-js/blob/main/docs/file-formats.md?plain=1#L6#translation-file-formats>
  - FormatJS `Intl.PluralRules` polyfill:
    <https://github.com/formatjs/formatjs/blob/main/docs/src/docs/polyfills/intl-pluralrules.mdx?plain=1#L10#implemented-features>
- Official web:
  - MDN `Intl.PluralRules`:
    <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules>
  - Unicode CLDR plural rules:
    <https://cldr.unicode.org/index/cldr-spec/plural-rules>
  - Unicode CLDR 48 language plural rules:
    <https://www.unicode.org/cldr/charts/48/supplemental/language_plural_rules.html>
- Local runtime probe:
  `node -e "for (const locale of ['de','en','fr','es','it','pl','cs','ru']) { const pr = new Intl.PluralRules(locale); console.log(locale, pr.resolvedOptions().pluralCategories.join(',')); }"`

## Source-Checked Findings

| Source | Finding | FMX-161 implication |
|---|---|---|
| Paraglide variants docs | Paraglide pluralization uses `Intl.PluralRules` under the hood; ordinal category names also follow `Intl.PluralRules`. | Native Paraglide variants can select CLDR plural categories without requiring ICU MessageFormat syntax. |
| Paraglide formatting docs | Built-in formatter names include `plural`, `number`, `datetime` and `relativetime`; `plural` uses `Intl.PluralRules`. | The MVP i18n stack can express locale-aware plural/category formatting through native formatters. |
| Paraglide FAQ/file-format docs | Paraglide message syntax and file formats are plugin-based; ICU MessageFormat 1 is supported via the ICU plugin, not mandatory for the default path. | ICU-MF1 should be treated as optional syntax support or future fallback, not as an MVP blocker by itself. |
| FormatJS `Intl.PluralRules` docs | FormatJS polyfill implements `select`, `selectRange`, cardinal/ordinal rule types and all six LDML categories, with locale data generated from CLDR plural rules. | `format.js` remains a credible polyfill path where platform `Intl` coverage is missing, without changing the ADR-0094 stack choice. |
| MDN `Intl.PluralRules` | `Intl.PluralRules` returns plural tags for cardinal or ordinal forms; the tag set is `zero`, `one`, `two`, `few`, `many`, `other`. | The category vocabulary used by Paraglide and CLDR is the platform vocabulary FMX must test against. |
| Unicode CLDR plural rules | CLDR categories are driven by phrase/sentence changes under numeric placeholders; languages can need noun, verb, pronoun, gender or case-sensitive examples. | "Flected club names" are content/model/casus-slot concerns, not solved merely by selecting ICU-MF1. |
| Unicode CLDR language chart | Russian cardinal rules visibly include `one`, `few` and `many`; Czech includes `one`, `few`, `many`, `other`. | The first Slavic/case-heavy locale remains the right reopen trigger. |
| Local Node `Intl.PluralRules` probe | Current runtime categories: `de one,other`; `en one,other`; `fr many,one,other`; `es many,one,other`; `it many,one,other`; `pl few,many,one,other`; `cs few,many,one,other`; `ru few,many,one,other`. | The risk must not claim MVP locales are only one/other. It should say the stack handles categories natively and require catalog QA for actual message patterns. |

## Corrections To The Raw Discovery Pass

- The useful conclusion from Perplexity stands: the headline ICU-MF1 risk can be
  resolved for MVP because native Paraglide variants plus `Intl.PluralRules`
  cover plural category selection and ICU MF1 remains optional plugin syntax.
- The "MVP locales are simple one/other" simplification is too broad. Current
  `Intl`/CLDR category sets for French, Spanish and Italian can expose `many`
  in some cases. The risk row should avoid that claim.
- The residual gate should be worded around "first Slavic/case-heavy locale or
  ICU-syntax authoring migration", not only "Slavic plurals".

## Local Vault Checks

- `docs/10-Architecture/09-Decisions/ADR-0094-i18n-stack-and-locale-scope.md`
  already states the ICU-MF1 validation is resolved for DE/EN/FR/ES/IT and
  should be revalidated when a Slavic locale is added.
- `docs/10-Architecture/11-Risks.md` still carried the stale
  `i18n ICU-MF1 validation pending` row before FMX-161.
- `docs/00-Index/Decision-Log.md` still said ADR-0094 was pending ICU-MF1
  validation before FMX-161.
- No current front-door note was found that makes PL/CZ/RU part of MVP scope.
