---
title: "Pre-Mortem 2026-05-20 · 09 · i18n & Localization"
status: draft
tags: [research, pre-mortem, i18n, l10n, icu, paraglide, tolgee, 2026-Q2]
created: 2026-05-20
updated: 2026-05-20
type: research
binding: false
report_id: PM-2026-05-20-09
report_set: 2026-05-20
horizon: 2026-11-20
target_dau: 10000
scenarios: [single-node-hetzner, cloud-autoscaling]
iteration: 3
related:
  - [[00-index]]
  - [[findings-registry]]
  - [[PM-2026-05-20-10-accessibility-and-inclusion]]
  - [[PM-2026-05-20-13-community-moderation-and-ugc]]
  - [[../narrative-content-pipeline]]
  - [[../performance-budgets]]
---

# Pre-Mortem 2026-05-20 · 09 · Internationalization & Localization

> **Failure-Headline-Kandidaten**
> - „PL-Plural-Bug 'Du hast 1 Mitteilungen' — beim ersten polnischen Streamer-Auftritt — Vertrauen weg."
> - „DE-User sehen 50 % der Texte als schlechte MT — DeepL-Fast-Track überspringt Glossar, Markenbegriffe falsch."
> - „RTL-Layout bricht bei Tabellen, weil 4 von 87 Komponenten noch `ml-2`/`pr-4` statt `ms-2`/`pe-4` benutzen."
> - „Bundle-Bloat: Initial-Load zieht alle 8 Locale-Bundles à 120 KB — Lighthouse fällt von 92 auf 51."
> - „RU-UI zeigt `Bayern München в матче против Borussia Dortmund` ohne Genitiv `Баварии` — fühlt sich Maschinen-generiert an."

## Scope

i18n/l10n als Architektur-Pre-Mortem: ICU-MessageFormat-Coverage, React-i18n-Lib-Wahl, RTL-Readiness, TMS-Workflow, Pseudo-Localization, Datum/Währung, Sprach-Fallback-Kette, Unicode-Validation, Schriftarten-Subsetting, Locale-Detection, SEO/hreflang, Übersetzer-Onboarding, Service-Worker-Caching. Aufbauend auf gelocktem [[../narrative-content-pipeline]] (ICU-MF1, deterministische Templates, 80–120 MVP, 95–145 KB gz/Locale).

**Welle-1+2-Decisions**: MVP LLM-frei in Runtime (keine LLM-Übersetzung), 5 MVP-Locales empfohlen (DE/EN/FR/ES/IT).

## Top Failure-Hypothesen

### PM-2026-05-20-09-F-01 — ICU MessageFormat reicht für 90 %, scheitert bei flektierten Klubnamen

```yaml
id: PM-2026-05-20-09-F-01
priority: P3
domain: i18n
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "share_of_messages_with_select_or_plural"
    threshold: ">= 20 % nach MVP, sonst zu naive Texte"
mitigation_summary: "ICU MF1 (i18next-icu oder @formatjs/icu-messageformat-parser); slawische Sprachen via Casus-Slots ({club_gen}); LLM-Build-Time generiert flektierte Forms"
linked_adrs: []
linked_specs: [[[../narrative-content-pipeline]]]
linked_code: []
sources:
  - title: "ICU MessageFormat 2.0 Documentation"
    url: "https://unicode-org.github.io/icu/userguide/format_parse/messages/mf2.html"
    accessed: "2026-05-20"
    publisher: "Unicode Consortium"
    confidence: high
  - title: "MF2 in i18next migration state May 2026"
    url: "https://www.locize.com/blog/messageformat-2-i18next/"
    accessed: "2026-05-20"
    publisher: "Locize"
    confidence: high
  - title: "Phrase Practical Guide ICU"
    url: "https://phrase.com/blog/posts/guide-to-the-icu-message-format/"
    accessed: "2026-05-20"
    publisher: "Phrase"
    confidence: high
verification_notes: "ICU MF1 deckt Plural/Gender/Select/Number/Date. MF2 produktionsreif aber Tooling/Translator-Support Mai 2026 lückenhaft. Flektierte Klubnamen sind Daten-Modell-Frage, kein ICU-Feature."
status: open
owner_suggested: content+frontend+data
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** ICU löst Plural/Gender/Select. Nicht Flexion von Eigennamen in Slawischen Sprachen und Deutsch. „1 Spieler von Bayern München" trivial im DE, im RU braucht Klubname Genitiv (`из Баварии Мюнхен`), im PL Akkusativ. Daten-Modell speichert nur `clubName: "Bayern München"` → jede locale-spezifische Konjugation = tote Strings.

**Mitigation.** Club-Schema: optionales `localizedNames: { de: {nom, gen, dat, akk}, ru: {...}, pl: {...} }`. ICU-Strings nur über Casus-System: `{club_gen}` statt `{club}`. Translator-Glossar fixiert Top-100-Klubs alle Casus manuell. Build-Time-Tool (DeepL Pro + Glossar) generiert Vorschläge, Human-Review. MF2 als 2027-Item.

**Verifikation.** Snapshot-Test: für jedes ICU-Template 20 zufällige Sätze mit Top-5-Liga-Klubs; Linter prüft alle `{club_*}`-Slots. CI-Job `pnpm i18n:icu-validate` parst mit `@formatjs/icu-messageformat-parser`.

### PM-2026-05-20-09-F-02 — Library-Lock-in: Paraglide gewinnt im Bundle-Budget, react-intl ist ICU-Standard

```yaml
id: PM-2026-05-20-09-F-02
priority: P3
domain: i18n
probability: 3
impact: 4
score: 12
confidence: high
early_warning:
  - metric: "i18n_runtime_bundle_kb_gzipped"
    threshold: "> 25 KB Library-Code"
mitigation_summary: "Paraglide JS für UI-Strings + format.js Intl-Polyfills für Numbers/Dates; Library-Entscheidung vor Sprint-2"
linked_adrs: []
linked_specs: [[[../performance-budgets]]]
linked_code: []
sources:
  - title: "Paraglide JS GitHub"
    url: "https://github.com/opral/paraglide-js"
    accessed: "2026-05-20"
    publisher: "Opral/Inlang"
    confidence: high
  - title: "Paraglide JS Benchmark"
    url: "https://inlang.com/m/gerre34r/library-inlang-paraglideJs/benchmark"
    accessed: "2026-05-20"
    publisher: "Inlang"
    confidence: high
  - title: "Paraglide + TanStack Start"
    url: "https://eugeneistrach.com/blog/paraglide-tanstack-start/"
    accessed: "2026-05-20"
    publisher: "Personal blog"
    confidence: medium
verification_notes: "Paraglide: 47 KB für 5 locales/100 used messages vs i18next 205 KB. react-intl 17.8 KB Runtime. TanStack Start hat seit Jan 2026 offiziellen Paraglide-Adapter."
status: open
owner_suggested: frontend+architecture
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** 80–120 ICU-Templates × 5–10 Locales: Runtime-Lookup-Libs (i18next, react-intl) schwellen Initial-Bundle. Paraglide kompiliert zu tree-shakable ESM, kann aber kein dynamisches Locale-Hot-Swap ohne Reload.

**Mitigation.** Hybride Architektur: **Paraglide** für 90 % UI-Strings (compile-time, tree-shake, type-safe). **format.js Intl** (PluralRules, DateTimeFormat, NumberFormat, RelativeTimeFormat) für Formatter — moderne Browser haben sie nativ. Sprachwechsel via `window.location.reload()` (akzeptabel selten). Migration vor Sprint-2.

**Verifikation.** `pnpm build:analyze` Budget: i18n-Lib-Runtime ≤ 8 KB gz, Initial-Locale-Bundle ≤ 25 KB.

### PM-2026-05-20-09-F-03 — RTL-Bruchstellen ohne enforced Logical-Properties-Migration

```yaml
id: PM-2026-05-20-09-F-03
priority: P3
domain: i18n
probability: 4
impact: 3
score: 12
confidence: high
early_warning:
  - metric: "stylelint_logical_props_violations"
    threshold: "> 0 in CI"
mitigation_summary: "Lint-Rule verbietet ml-*/mr-*/pl-*/pr-* — nutzt ms-*/me-*/ps-*/pe-*; Storybook RTL-Toggle; Playwright fährt Visual-Tests 2× LTR/RTL"
linked_adrs: []
linked_specs: [[[../../10-Architecture/09-Design-System]]]
linked_code: ["src/components/**/*.tsx", "tailwind.config.ts"]
sources:
  - title: "Tailwind CSS RTL (Flowbite)"
    url: "https://flowbite.com/docs/customize/rtl/"
    accessed: "2026-05-20"
    publisher: "Flowbite"
    confidence: high
  - title: "TR9 Unicode Bidirectional Algorithm"
    url: "http://www.unicode.org/reports/tr9/"
    accessed: "2026-05-20"
    publisher: "Unicode Consortium"
    confidence: high
  - title: "W3C Bidi Unicode Controls"
    url: "https://www.w3.org/International/questions/qa-bidi-unicode-controls.en"
    accessed: "2026-05-20"
    publisher: "W3C i18n"
    confidence: high
verification_notes: "Tailwind 3.3+ unterstützt logische Properties. shadcn/ui-Komponenten nutzen idR logische Variants; Custom-Cards/Tables Hotspots."
status: open
owner_suggested: design+frontend
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** Auch wenn MVP-Scope kein Arabisch enthält: heute mit `ml-/pr-`-Klassen geschriebene Komponente = Refactor-Schulden, die später exponentiell wachsen. Gemischte Spielernamen (lateinisch in arabischem Satz) brauchen `<bdi>` / FSI/PDI-Unicode-Isolation.

**Mitigation.** (1) `eslint-plugin-tailwindcss` custom rule `no-logical-direction-classes`. (2) React-Helper `<Name lang="lat">{name}</Name>` setzt `<bdi>`. (3) Pseudo-RTL-Mode (`dir="rtl"` + `[a-zA-Z]→[ﻲﻳﻯ]`) via `?pseudo=rtl`. (4) Logical Properties heute schreiben — Mehraufwand ~5 %, Refactor ohne RTL-Prep > 30 %.

**Verifikation.** CI `pnpm test:rtl-snapshots` + `pnpm lint:logical-props`.

### PM-2026-05-20-09-F-04 — Pseudo-Localization fehlt im CI → Layout-Bugs überleben bis Beta

```yaml
id: PM-2026-05-20-09-F-04
priority: P3
domain: i18n
probability: 4
impact: 2
score: 8
confidence: high
early_warning:
  - metric: "max_string_expansion_ratio_de_en"
    threshold: "> 1.6 (DE > 60 % länger als EN → Buttons overflow)"
mitigation_summary: "Pseudo-Locale qps-ploc als Build-Target, Storybook-Toggle, Playwright-CI-Run; Stylelint-Defaults für truncation"
linked_adrs: []
linked_specs: []
linked_code: ["src/lib/i18n/pseudo.ts", ".storybook/preview.ts"]
sources:
  - title: "Storybook Globals (locale toggling)"
    url: "https://storybook.js.org/docs/writing-tests/integrations/stories-in-end-to-end-tests"
    accessed: "2026-05-20"
    publisher: "Storybook"
    confidence: high
  - title: "Localization Testing Playwright"
    url: "https://www.thegreenreport.blog/articles/localization-testing-at-scale-playwright-strategies-for-multi-language-web-apps/localization-testing-at-scale-playwright-strategies-for-multi-language-web-apps.html"
    accessed: "2026-05-20"
    publisher: "The Green Report"
    confidence: medium
verification_notes: "Pseudo-Loc-Standard: 30–60 % String-Verlängerung, Diakritika, eckige Klammern als Boundary-Marker."
status: open
owner_suggested: frontend+qa
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** DE ~30 % länger als EN, FI/PL teils 40 %, HU bis +60 %. „Save" → „Aufstellung speichern" → „Tallenna joukkueasetelma" sprengt Buttons. Ohne Pseudo-Locale erst beim DE-Beta-Tester sichtbar.

**Mitigation.** Build-Script `pnpm i18n:pseudo` generiert `qps-ploc.json` durch Char-Mapping + Padding (× 1.4) + `[!! ... !!]`. Storybook-Toggle. Playwright-Visual-Test. Plus `qps-rtl` für RTL-Smoke ohne Arabisch-Übersetzung zu pflegen.

**Verifikation.** Playwright-Snapshot pro Critical-Page in `qps-ploc`; Overflow-Bug-Count im PR-Diff: 0.

### PM-2026-05-20-09-F-05 — Validation-Regexe `[a-zA-Z]` blockieren legitime EU-User

```yaml
id: PM-2026-05-20-09-F-05
priority: P2
domain: i18n
probability: 5
impact: 3
score: 15
confidence: high
early_warning:
  - metric: "username_validation_rejection_rate"
    threshold: "> 2 % (vermutlich Unicode-Block)"
mitigation_summary: "Unicode-Property-Escapes /^[\\p{L}\\p{N}\\p{Pd}\\p{Zs}'.]{2,40}$/u; niemals [a-zA-Z]"
linked_adrs: []
linked_specs: [[[PM-2026-05-20-13-community-moderation-and-ugc]]]
linked_code: ["src/lib/validation/*.ts"]
sources:
  - title: "MDN Unicode character class escape"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape"
    accessed: "2026-05-20"
    publisher: "MDN"
    confidence: high
  - title: "TC39 proposal-regexp-unicode-property-escapes"
    url: "https://tc39.es/proposal-regexp-unicode-property-escapes/"
    accessed: "2026-05-20"
    publisher: "TC39"
    confidence: high
  - title: "Unicode UTS #18 Regular Expressions"
    url: "https://www.unicode.org/reports/tr18/"
    accessed: "2026-05-20"
    publisher: "Unicode Consortium"
    confidence: high
verification_notes: "ECMAScript 2018+ und alle modernen Browser unterstützen \\p{} mit u-Flag. Erlaubt: \\p{L}, \\p{N}, \\p{M}, \\p{Pd}, \\p{Zs}. Verbieten: \\p{Cc}, \\p{Cs}, RTL-Override-Marks (Spoof-Vektor)."
status: open
owner_suggested: frontend+security
effort: S
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** „Müller-Götze", „Saint-Étienne", „Östersunds saison '24" fallen bei naive `[a-zA-Z0-9 ]`-Patterns durch. DE-First-Market mit Umlauten/ß Standard.

**Mitigation.** Zentrale `src/lib/validation/names.ts` mit `\\p{L}\\p{M}\\p{N}\\p{Pd}\\p{Zs}.'` + length-cap. Reject `\\p{Cc}`, `\\p{Cf}` (außer ZWJ), RLO/LRO/RLE/LRE/PDF (Spoofing). Unit-Test mit Test-Corpus aus 50 DE/FR/PL/RU-Namen + 20 Spoof-Versuchen.

**Verifikation.** Snapshot-Test `validation.names.test.ts`. Continuous-Eval gegen `top-1000-european-names`-Dataset.

### PM-2026-05-20-09-F-06 — TMS-Lock-in: Crowdin/Lokalise-Pricing skaliert mit Wachstum

```yaml
id: PM-2026-05-20-09-F-06
priority: P3
domain: i18n
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "monthly_tms_cost_eur"
    threshold: "> € 100 vor 1k DAU"
mitigation_summary: "Tolgee self-hosted als Default (Apache-2.0); Crowdin OSS-Tier als Backup; Translation-Memory + Glossar lokal versioniert"
linked_adrs: []
linked_specs: []
linked_code: []
sources:
  - title: "Tolgee Self-hosted Pricing"
    url: "https://tolgee.io/pricing/self-hosted"
    accessed: "2026-05-20"
    publisher: "Tolgee"
    confidence: high
  - title: "Tolgee GitHub Platform"
    url: "https://github.com/tolgee/tolgee-platform"
    accessed: "2026-05-20"
    publisher: "Tolgee"
    confidence: high
  - title: "OSS-TMS-Comparison 2026 (IntlPull)"
    url: "https://intlpull.com/blog/open-source-tms-comparison-2026"
    accessed: "2026-05-20"
    publisher: "IntlPull"
    confidence: medium
verification_notes: "Tolgee Apache-2.0 self-hosted, Docker, eigener Postgres. Crowdin Free für OSS (60k hosted words), Lokalise $140+/Monat per seat."
status: open
owner_suggested: ops+content
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** **Tolgee self-hosted** auf Hetzner CX22 (~€ 5/Monat): ICU-MessageFormat-native, In-Context-Editing in PWA, MCP-Server, Apache-2.0. Crowdin Free als Backup. Glossar + TM zusätzlich in `docs/15-i18n/glossary.csv` versioniert.

**Verifikation.** DR-Drill: jeden Sprint einmal Export aller Übersetzungen aus Tolgee als XLIFF, Import in Crowdin Sandbox, ICU-Syntax-Vergleich.

### PM-2026-05-20-09-F-07 — Locale-Detection-Falle: Cookies vs URL vs Accept-Language inkonsistent

```yaml
id: PM-2026-05-20-09-F-07
priority: P3
domain: i18n
probability: 3
impact: 3
score: 9
confidence: high
early_warning:
  - metric: "locale_mismatch_events"
    threshold: "> 1 % Diff URL vs gerendertes Locale"
mitigation_summary: "URL-First-Strategy (/de/, /en/) mit Cookie-Persist; Accept-Language nur Hint; nie IP-Geo für Sprach-Wahl (GDPR); hreflang + Sitemap pro Locale"
linked_adrs: []
linked_specs: [[[../gdpr-compliance]]]
linked_code: ["src/router/__root.tsx"]
sources:
  - title: "Every way to detect user's locale (Lingo)"
    url: "https://dev.to/lingodotdev/every-way-to-detect-a-users-locale-from-best-to-worst-369i"
    accessed: "2026-05-20"
    publisher: "Lingo.dev"
    confidence: medium
  - title: "Google Multi-Regional Sites"
    url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites"
    accessed: "2026-05-20"
    publisher: "Google"
    confidence: high
  - title: "TanStack Router i18n"
    url: "https://tanstack.com/router/latest/docs/guide/internationalization-i18n"
    accessed: "2026-05-20"
    publisher: "TanStack"
    confidence: high
verification_notes: "TanStack Router unterstützt locale-param {-$locale}. Cookie nur für persisted-override. IP-Geo ist Consent-Banner-pflichtig (DSGVO)."
status: open
owner_suggested: frontend+seo
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Hypothese.** `/de/dashboard` von Browser mit `Accept-Language: en` ohne Cookie: Sprache eindeutig DE (URL gewinnt). Ohne Hierarchie-Schema → Hydration-Mismatch (Server EN, Client switcht DE) → Flicker + SEO-Confusion.

**Mitigation.** Strikte Hierarchie: **URL-Segment > Cookie `fmx-locale` > Accept-Language > Default `en`**. Bei Konflikt URL vs Cookie: URL gewinnt, Cookie wird update-t. IP-Geo nur opt-in. TanStack-Router-Root-Loader liest URL-Locale, setzt Context.

**Verifikation.** Playwright-Test mit 16 Kombinationen (URL × Cookie × Accept-Language × User-Override). Google-Search-Console-Sitemap-Validator monthly.

### PM-2026-05-20-09-F-08 — Schriftarten-Bloat bei CJK/Arabic erschlägt Performance-Budget

```yaml
id: PM-2026-05-20-09-F-08
priority: P4
domain: i18n
probability: 2
impact: 4
score: 8
confidence: high
early_warning:
  - metric: "font_kb_loaded_per_locale_initial"
    threshold: "> 100 KB (CJK > 500 KB Alarm)"
mitigation_summary: "MVP nur Latin Extended + Cyrillic via Google-Fonts CSS2 (unicode-range automatisch); CJK/Arabic Phase-2 mit Noto-Variable + glyphhanger-Subsetting"
linked_adrs: []
linked_specs: [[[../performance-budgets]]]
linked_code: ["src/styles/fonts.css"]
sources:
  - title: "Use Noto Fonts"
    url: "https://notofonts.github.io/noto-docs/website/use/"
    accessed: "2026-05-20"
    publisher: "Noto Project"
    confidence: high
verification_notes: "Latin Extended + Cyrillic Subsets je ~30–50 KB WOFF2. Arabisch ~80–120 KB. CJK Pan-Variable unsubsetted: 5–20 MB. Google Fonts splittet automatisch via unicode-range."
status: open
owner_suggested: design+performance
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** MVP-Scope = Latin Extended + Cyrillic (DE/EN/FR/IT/ES/PT/PL/RU) via Google-Fonts CSS2. Phase-2: Noto Sans Arabic + Hebrew subset auf Top-1000-Glyphs. CJK niemals unsubsetted. `font-display: swap` + System-Font-Fallback.

**Verifikation.** Lighthouse-CI per locale-Build prüft `total-byte-weight`. Slow-3G in DevTools alle Locales testen, LCP < 2.5 s.

### PM-2026-05-20-09-F-09 — Übersetzer-Onboarding fehlt: Tonfall, Glossar, Don't-Translate-Liste undefiniert

```yaml
id: PM-2026-05-20-09-F-09
priority: P3
domain: i18n
probability: 4
impact: 2
score: 8
confidence: medium
early_warning:
  - metric: "translator_consistency_score"
    threshold: "< 90 % Match mit Glossar in random Stichprobe"
mitigation_summary: "Style-Guide docs/15-i18n/style-guide.md mit Du/Sie (Du für Gaming), Glossar Top-200 in 5–8 Locales, Don't-Translate-Liste, Tonfall-Beispiele"
linked_adrs: []
linked_specs: [[[../narrative-content-pipeline]]]
linked_code: []
sources:
  - title: "TextBest: Du oder Sie"
    url: "https://textbest.de/magazin/du-oder-sie-die-richtige-kundenansprache-fuer-ihren-internetauftritt/"
    accessed: "2026-05-20"
    publisher: "TextBest"
    confidence: medium
  - title: "German UPA UX Writing"
    url: "https://germanupa.de/wissen/methoden-werkzeuge/ux-writing/leitfaden"
    accessed: "2026-05-20"
    publisher: "German UPA"
    confidence: medium
verification_notes: "Gaming-Standard DACH: Du (Steam, Riot, EA Sports, Anstoss). Sie wirkt distanziert. Glossar-Lock essentiell, weil MT Markenbegriffe zerschießt."
status: open
owner_suggested: content+design
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** Sprint-1: 4-Seiten-`style-guide.md`: (1) **Du-Form DE** (Casual-Gaming-Norm). (2) Glossar-CSV Top-200 Football-Begriffe in 8 Locales. (3) Don't-Translate: Klubnamen Default nominativ, Liga-Codes (BL1/EPL/LaLiga), Tactical-Terms (Tiki-Taka). (4) Tonfall-Beispiele pro Variante. DeepL-Glossar lädt CSV als Termbase.

**Verifikation.** Quartärlicher Translation-QA-Audit: 50 zufällige Strings pro Locale gegen Style-Guide. Score > 90 %.

### PM-2026-05-20-09-F-10 — Service-Worker serviert veralteten Locale-Bundle nach Hotfix

```yaml
id: PM-2026-05-20-09-F-10
priority: P3
domain: i18n
probability: 3
impact: 3
score: 9
confidence: medium
early_warning:
  - metric: "sw_cache_hit_for_locale_after_release"
    threshold: "> 10 % nach 24 h"
mitigation_summary: "Locale-URLs mit Content-Hash (/locales/de.<hash>.json); Long-TTL Immutable; Master-Manifest i18n-manifest.json mit max-age=300"
linked_adrs: []
linked_specs: [[[../pwa-offline-patterns]]]
linked_code: ["public/sw.ts", "src/lib/i18n/load.ts"]
sources:
  - title: "Workbox: Handling service worker updates"
    url: "https://developer.chrome.com/docs/workbox/handling-service-worker-updates"
    accessed: "2026-05-20"
    publisher: "Chrome for Developers"
    confidence: high
  - title: "i18next Caching docs"
    url: "https://www.i18next.com/how-to/caching"
    accessed: "2026-05-20"
    publisher: "i18next"
    confidence: high
verification_notes: "PWA mit offline-first muss Locale-Bundles im SW precachen, aber Hotfix erfordert Cache-Bust → Content-Hash + Manifest-Pattern."
status: open
owner_suggested: frontend+ops
effort: M
created: 2026-05-20
updated: 2026-05-20
```

**Mitigation.** Vite generiert Hash-suffixed Locale-Files. `i18n-manifest.json` (~1 KB) mappt locale-code → Hash-URL, `cache-control: max-age=300`. Bundle-Dateien `cache-control: max-age=31536000, immutable`. SW pre-fetcht aktuelle Locale aus Manifest-Refresh; bei Mismatch Background-Sync + notify().

**Verifikation.** E2E: SW-Cache füllen, neue Hash deployen, Reload, prüfen ob neue Strings geladen. SLO: > 95 % User auf neuer Version < 60 min.

## Library-Vergleich (CORE OUTPUT, Mai 2026)

| Lib | Runtime KB gz | ICU MF1 | ICU MF2 | TanStack Start | Type-Safety | Tree-Shake | Lazy/Locale | SSR |
|---|---|---|---|---|---|---|---|---|
| **Paraglide JS** | ~5 KB | partial | nein | offiziell (2026-01) | full (compile) | ja (-70 % Bundle) | reload-on-switch | ja |
| **react-intl** | ~18 KB | full | preview | manuell | gut (babel-plugin) | nein | ja | ja |
| **i18next + icu** | ~22 KB | via Plugin | preview | manuell | gut (i18next-cli) | nein | ja | ja |
| **Lingui** | ~10 KB | full | nein | community | full (macros) | partial | ja | ja |
| **next-intl / use-intl** | ~2 KB | full | nein | community | gut | nein | ja | ja |

**Empfehlung MVP:** **Paraglide JS** + `format.js` Intl-Polyfills.

## TMS-Vergleich (Mai 2026)

| TMS | OSS | Self-Host | Free-Tier | Lowest-Paid | ICU-Native | GitHub | In-Context | TM |
|---|---|---|---|---|---|---|---|---|
| **Tolgee** | Apache-2.0 | ja | 500 keys | $49/Mo | ja | ja | ja (beste) | ja |
| **Weblate** | GPL-3 | ja | für libre projects | €45/Mo Cloud | partial | sehr stark | nein | ja |
| **Crowdin** | nein | nein | 60k OSS-words | $59/Mo | ja | gut | ja | ja |
| **Lokalise** | nein | nein | 500 keys trial | $140/Mo per seat | ja | ja | ja | ja |
| **Texterify** | AGPL | ja | self-host | $9 cloud | partial | ja | partial | ja |
| **SimpleLocalize** | nein | nein | 100 keys | $19/Mo | ja | ja | partial | ja |

**Empfehlung MVP:** **Tolgee self-hosted** auf Hetzner CX22.

## Quantitatives Modell

- UI-Strings pro Locale: ~30 KB roh / ~8 KB gz.
- Narrative-Content (per Spec): 95–145 KB gz/Locale.
- Schrift-Subsets: 30–50 KB pro Family.
- **Initial-Load (1 Locale)**: ~58 KB extra (10 KB i18n-Lib + 8 KB Strings + 40 KB Font).
- **Worst-Case Narrative-Prefetch**: +120 KB → ~178 KB — Lazy-Load via Loader.
- Übersetzungs-Kosten (Mai 2026): pro 1k Wörter DE↔EN: €100–180 professional / €40–70 augmented (DeepL+Human) / DeepL Pro API frei für MVP ($25/Mo / 1M chars).
- MVP-Übersetzungs-Budget für 5 Locales × 8 k Wörter × € 0.05 = **€ 1.750 augmented** (vs € 5.600 professional).
- Tolgee €5–10/Mo + DeepL Pro $25/Mo = **~€30/Mo Total**.

## SLO-Vorschläge

| SLO | Ziel |
|---|---|
| Fehlende Translation-Keys | < 0.5 % aller `t()`-Calls (Telemetry) |
| Pseudo-Localization-CI-Pass | 100 % Critical-Pages, Visual-Diff < 5 % |
| ICU-Validation | 0 Syntax-Fehler (CI-Hook blockt PR) |
| Translation-Hotfix-Propagation | ≥ 95 % User auf neuer Version < 60 min |
| hreflang-Hygiene | 0 Sitemap-Cluster-Errors in Search Console |

## Test-Plan

- Pseudo-Loc (jeder PR, blocking): Build-Plugin → `qps-ploc.json`; Storybook + Playwright + Visual-Regression.
- ICU-Validation (Pre-Commit): `@formatjs/icu-messageformat-parser` parst alle Locale-Files.
- RTL-Visual-Regression (Nightly): 30 Critical-Components in `dir="rtl"`.
- Plural-Rule-Coverage: Snapshot pro ICU-Plural mit Eingaben [0,1,2,3,5,11,21,100] pro Locale. PL/RU/CZ → alle Kategorien (one/few/many/other).
- Locale-Detection-Matrix (E2E): 16 Kombinationen.
- Hreflang-Sitemap-Bot (Monthly).

## Runbook-Skizzen

### RB-09-A: Eilige Übersetzungs-Korrektur Live
1. Fix in `de.json` (z.B. "Vetrag" → "Vertrag").
2. CI: ICU-Validate + Pseudo-Loc + Visual-Regression.
3. Merge → Vite Build erzeugt `de.<NEW_HASH>.json`.
4. Deploy aktualisiert `i18n-manifest.json` (TTL 5min).
5. SW pre-fetcht binnen 5min. SLO: > 95 % User on new version < 60min.

### RB-09-B: Plural-Rule-Bug (z.B. PL "1 Spieler"/"2 Spielern")
1. ICU-Snapshot-Test um fehlende Counts erweitern.
2. `pl.json` korrigieren mit `{count, plural, one {} few {} many {} other {}}`.
3. Pre-Commit `i18n:icu-validate` prüft CLDR-Kategorien-Match.
4. Storybook-Snapshot grün → Hotfix-Release wie RB-09-A.

### RB-09-C: Fallback-Chain-Failure (NO-Übersetzung fehlt, fällt auf EN statt SE)
1. Telemetry: `missing_translation_key_count` pro Locale-Chain.
2. Fallback-Konfig: `no → se → en`, `da → no → se → en`, `et → fi → en`.
3. Per PR Default-Locale-Map aktualisieren; Stille-Fallback (kein UI-Banner — User soll nicht merken).

## Offene Fragen

1. **5 MVP-Locales final?** Vorschlag DE-source, EN, FR, ES, IT. PL/RU/PT als Phase-2 mit slawischer Deklination.
2. **Du oder Sie im DE?** Empfehlung **Du**; Style-Guide-Lock vor erstem Translator-Onboarding.
3. **Paraglide vs i18next?** Bei < 500 Keys Paraglide; bei > 2000 mit dynamischen Namespaces i18next.
4. **Tolgee vs Crowdin?** Hängt von FMX-Lizenz-Strategie (Cross-Ref Report 18 — AGPL-3.0 empfohlen → Crowdin OSS-Tier eligible).
5. **MF2-Migration?** Q1-2027 evaluieren wenn i18next-MF2 stable.

## "Wenn wir nur 3 Dinge tun"-Liste

1. **Pseudo-Localization als CI-Pflicht ab Sprint-1** (F-04). Verhindert > 80 % aller Layout-Bugs pre-launch.
2. **ICU-Validation Pre-Commit + Unicode-Property-Escape-Helpers** (F-01 + F-05). Vermeidet Plural-Bugs und User-Rejection bei Eigennamen.
3. **Tolgee self-hosted + DeepL Pro + Glossar-CSV** (F-06). €30/Mo Total-Cost, MCP-Server-Integration, kein Vendor-Lock-in.

## Verfolgung & Verkettung

IDs `PM-2026-05-20-09-F-NN`. Aggregat: [[findings-registry]].

## Related

- [[00-index]] · [[findings-registry]]
- [[PM-2026-05-20-10-accessibility-and-inclusion]] (Cross-Ref: Unicode Validation + RTL überlappend mit a11y)
- [[PM-2026-05-20-13-community-moderation-and-ugc]] (Cross-Ref: Unicode-aware Hate-Speech-Filter)
- [[../narrative-content-pipeline]] · [[../performance-budgets]]
- [[../../10-Architecture/09-Design-System]]
