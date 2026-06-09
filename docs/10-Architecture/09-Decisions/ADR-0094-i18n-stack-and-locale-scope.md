---
title: ADR-0094 i18n stack & locale scope (supersedes ADR-0006)
status: accepted
tags: [adr, i18n, l10n, icu, paraglide, tolgee, formatjs, locale, offline-pwa, ssr, fmx-i18n-depth-pass]
created: 2026-06-08
updated: 2026-06-09
type: adr
binding: false
supersedes: ADR-0006-i18n
  - [[ADR-0006-i18n]]
superseded_by:
related:
  - [[ADR-0006-i18n]]
  - [[ADR-0008-mobile-first-ui]]
  - [[ADR-0010-design-system]]
  - [[ADR-0021-revised-tech-stack]]
  - [[../../60-Research/pre-mortem/PM-2026-05-20-09-i18n-and-localization]]
  - [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  - [[../../60-Research/narrative-content-pipeline]]
  - [[../../60-Research/performance-budgets]]
  - [[../../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../../50-Game-Design/GD-0012-onboarding]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0094: i18n stack & locale scope (supersedes ADR-0006)

## Status

draft

> **`draft` / `binding: false`.** Authored 2026-06-08. This is the **"i18n ADR depth pass"** that
> gap-closure §T09 listed as a *required artefact* but which was never produced. It folds the **closed
> Research Wave 2** recommendation (PM-2026-05-20-09 + gap-closure-2026-05-22 §T09) into a single ADR and
> **supersedes the stale ADR-0006** direction (i18next + DE/EN "pending Wave 2"). It does **not** edit
> ADR-0006, ADR-0008 or ADR-0010 (ratify gate / supersession-by-new-ADR rule). It records a recommended
> option for **Nico to ratify**; nothing here is accepted. The library choice is **hard to reverse
> post-implementation**, so it is flagged for live ratification before any Sprint-1 i18n scaffolding.

## Date

2026-06-08

## Context

[[ADR-0006-i18n]] still records the intent **i18next / react-i18next, German default + English from day
one**, explicitly **"pending Wave 2 research"** and blocked on that wave. Wave 2 has since **closed** —
but with a **materially different** recommendation than ADR-0006 assumed:

- **PM-2026-05-20-09** ("Internationalization & Localization", `status: current`) produces a CORE library
  comparison and recommends **Paraglide JS + `format.js` Intl polyfills** (F-02), **Tolgee self-hosted**
  as TMS (F-06), **5 MVP locales DE/EN/FR/ES/IT** (scope line + future-scope §1), with **ICU-MF1** as the
  message contract, plus CI gates (pseudo-loc, ICU-validate, RTL logical-properties, Unicode-property
  name validation, SW locale-cache hashing).
- **gap-closure-2026-05-22 §T09** ratifies that direction ("ICU/messageformat-capable tooling, Unicode
  property validation, pseudo-localization and logical CSS properties") and lists an **"i18n ADR depth
  pass"** among its *required artefacts* — **this ADR is that artefact**, produced for the first time.

The gap between ADR-0006 and the closed research is **not cosmetic** and has real **offline-first PWA**
consequences:

- **Bundle.** ADR-0006's i18next (~22 KB gz runtime) is ~**4×** the compiled-Paraglide footprint
  (~5 KB gz). For an offline PWA that **precaches** its locale bundles in the service worker (PM-09 F-10,
  [[../../60-Research/performance-budgets]]), the runtime-library delta is paid by every install on every
  device, against a tight initial-load budget.
- **SSR / routing.** The stack is TanStack-Start-based ([[ADR-0021-revised-tech-stack]],
  [[ADR-0008-mobile-first-ui]]); the chosen i18n lib must do **first-class SSR** and integrate with the
  router's locale segment (PM-09 F-07 URL-first detection).
- **Locale count.** ADR-0006 assumes **2 locales (DE/EN)**. The closed research moves to **5
  (DE/EN/FR/ES/IT)**. Several downstream artefacts **inherit the stale 2-locale / i18next assumption** and
  must migrate **in lockstep**, not piecemeal:
  - [[ADR-0008-mobile-first-ui]] — its **a11y / lang-attribute / RTL-readiness** section is sized for
    DE/EN.
  - [[ADR-0010-design-system]] — the **i18n boundary** + string-expansion / logical-properties tokens
    assume 2 locales.
  - the **narrative-content pipeline** ([[../../60-Research/narrative-content-pipeline]],
    [[../../50-Game-Design/GD-0013-narrative-inbox]]) — ICU template authoring + per-locale content
    budget (95–145 KB gz/locale) scales with locale count and with flected-name handling.

This ADR fixes the stack and the MVP locale scope so those touch-points migrate together.

## Options considered

Grounded by the PM-09 CORE library comparison (May 2026) and a targeted June-2026 version/feature
re-check (Perplexity, see Rationale): **Paraglide JS v2.0.0**, **Tolgee server v6.0.0**.

- **A (RECOMMENDED) — Paraglide JS + `format.js` Intl polyfills + Tolgee self-hosted; MVP locales
  DE/EN/FR/ES/IT.**
  Compiler-first: messages compile to tree-shakable, type-safe ESM (~**5 KB** gz runtime, **~70 %**
  smaller than i18next), `format.js`/native `Intl` for plural/number/date/relative-time formatters, and
  **first-class SSR**. Tolgee (Apache-2.0) self-hosts on a cheap node (~€5–10/mo) with ICU-native,
  in-context editing and no vendor lock-in.
  **Risk:** **ICU-MF1 is plugin-mediated** in Paraglide (slavic plurals, flected club names), not core —
  see Risks. **Adapter nuance:** Paraglide ships an official **Vite** adapter; TanStack Start is
  Vite-based, but a *dedicated official "TanStack Start" adapter package* is **not confirmed** as of
  2026-06 (PM-09 cited a "2026-01 official adapter"; the June re-check found only the Vite/Svelte/Next
  official adapters + community TanStack integration). Treat TanStack-Start support as **Vite-adapter +
  community glue**, to be validated, not as a turnkey first-party package.

- **B — i18next + i18next-icu, DE/EN.**
  Richest, most mature ICU ecosystem; ICU-MF1 first-class via plugin; **zero migration** from ADR-0006.
  **Cost:** ~**4×** runtime bundle (~22 KB gz) — the worst option for the offline-PWA precache budget —
  and runtime-lookup rather than compile-time tree-shaking. Keeps the smaller 2-locale scope, which the
  closed research already moved past.

- **C — Lingui.**
  Compiled catalogs (macros) + **first-class ICU-MF1**, middle bundle weight (~10 KB gz). Better ICU
  story than Paraglide, lighter than i18next. **Cost:** weaker / community-only TanStack Start story and
  partial tree-shaking; a macro/build-step toolchain to own. A credible **fallback if A's ICU-MF1 plugin
  story proves insufficient.**

## Decision

Propose, awaiting Nico: **Option A** — **Paraglide JS + `format.js` Intl polyfills + Tolgee self-hosted**,
**MVP locales DE/EN/FR/ES/IT (DE source)**, ICU-MF1 as the (optional) ICU-syntax contract. **The
ICU-MF1 validation flagged here is resolved for the MVP locale set — see the validation note below.**

### ICU-MF1 validation — resolved for MVP (2026-06-09)

Grounded check (context7 @ `/opral/paraglide-js` docs + Perplexity, 2026-06-09): for the MVP
locales **DE/EN/FR/ES/IT** the original ICU-MF1 worry does **not** bind, because the needs are met
without depending on the ICU plugin:

- **Plurals/select are native, not ICU-plugin-dependent.** Paraglide v2's **variants system** +
  built-in formatters (`plural` over `Intl.PluralRules` — incl. ordinal and `few`/`many`,
  `number`/`datetime`/`relativetime`) cover the cardinal `one`/`other` needs of these five locales
  without ICU syntax.
- **Flected club names are a casus-slot concern, not an ICU one.** Neither ICU MF1 nor Paraglide
  does morphological declension; the idiomatic (and already ADR-specified) solution is the
  **casus-slot scheme** — pass pre-inflected variables (`{club_gen}`, `{club_dat}`). The ICU plugin
  does not change this either way.
- **The `inlang-icu-messageformat-1` plugin stays optional** — adopt it only if the team wants
  literal ICU strings; native variants suffice for MVP.
- **Possible simplification (not decided here):** since Paraglide wraps `Intl.*` natively, `format.js`
  is not strictly required for these five locales — whether to drop it from Option A is a follow-up
  for implementation; this ADR keeps the A stack as ratified.
- **Slavic `one/few/many/other` pressure is post-MVP** (no Slavic locale in DE/EN/FR/ES/IT) —
  re-validate when a Slavic locale is added.

Net: **Option A stands; the headline ICU-MF1 risk is resolved for MVP** (mitigated via native
variants + the casus-slot scheme; ICU plugin optional).

This ADR **folds the closed Wave-2 research in as binding** (the PM-09 CORE outputs + §T09 decision are
not re-litigated here) and **enumerates the downstream locale-count migration touch-points** so they
migrate in lockstep:

1. [[ADR-0008-mobile-first-ui]] — extend its a11y / `lang` / RTL-readiness section from DE/EN to the
   5-locale set (logical CSS properties already mandated by PM-09 F-03).
2. [[ADR-0010-design-system]] — re-scope its i18n boundary + string-expansion tokens to 5 locales;
   enforce the `no-logical-direction-classes` lint rule (F-03) and pseudo-loc expansion budget (F-04).
3. [[../../60-Research/narrative-content-pipeline]] / [[../../50-Game-Design/GD-0013-narrative-inbox]] —
   author ICU templates against the **casus-slot** scheme (`{club_gen}` not `{club}`, F-01) and size the
   per-locale content budget for 5 locales.

The CI gate set from PM-09 carries over as binding intent: **pseudo-loc** snapshot (blocking per PR),
**ICU-validate** pre-commit (`@formatjs/icu-messageformat-parser`), **RTL logical-properties** lint +
visual regression, **Unicode-property-escape** name validation (`\p{L}\p{N}\p{Pd}\p{Zs}`, never
`[a-zA-Z]`, F-05), and **content-hashed locale bundles + manifest** for SW cache-busting (F-10).

## Rationale

- **Bundle is the deciding axis for an offline-first PWA.** PM-09's CORE table puts Paraglide at ~5 KB gz
  vs i18next ~22 KB gz (~70 % smaller); the service worker precaches locale bundles, so the library delta
  is paid per install. This is why A beats B despite B's richer ICU story.
- **Closed research, not a fresh tech bake-off.** PM-09 (`status: current`) and §T09 already decided the
  direction; this ADR's job is the *depth pass* that turns that into a ratifiable architecture decision +
  the migration map — consistent with the supersession-by-new-ADR rule and the "single current truth"
  principle.
- **June-2026 version/feature re-check (targeted, Perplexity).** Confirms **Paraglide JS v2.0.0** stable
  and that **ICU-MF1 is provided via a plugin, not as the default message format** — which *substantiates*
  the headline risk below rather than disproving it. Confirms **Tolgee server v6.0.0** self-hostable
  (Apache-2.0). **Tempers** PM-09's "official TanStack Start adapter (2026-01)" claim: the re-check found
  official adapters for **Vite / SvelteKit / Next.js** but **no first-party TanStack Start package**;
  since TanStack Start is Vite-based this is a *Vite-adapter + community-integration* story, which is a
  validation item, not a blocker.
- **5-locale MVP (DE/EN/FR/ES/IT)** deliberately excludes slavic locales (PL/RU) from MVP, which is
  exactly where flected-name / `one-few-many-other` plural pressure is highest (F-01) — so the ICU-MF1
  plugin risk is **lower at MVP** and the casus-slot data model can mature before Phase-2 slavic locales
  land.

## Consequences

Positive:

- **Smallest offline-PWA i18n runtime** (~5 KB gz vs ~22 KB), best initial-load + SW-precache budget.
- **Compile-time, type-safe, tree-shakable** messages; dead strings caught at build, not runtime.
- **First-class SSR** with the TanStack-Start/Vite stack ([[ADR-0021-revised-tech-stack]],
  [[ADR-0008-mobile-first-ui]]).
- **5-locale MVP** (DE/EN/FR/ES/IT) with a clear Phase-2 path to slavic locales.
- **No TMS vendor lock-in** (Tolgee Apache-2.0 self-hosted, ~€30/mo total incl. MT) and the PM-09 CI gate
  set becomes the enforced i18n quality bar.

Negative:

- **Downstream locale-count assumptions must migrate in lockstep** (ADR-0008 a11y §, ADR-0010 i18n
  boundary, narrative pipeline) — a coordinated change, not a drop-in.
- **ICU-MF1 is plugin-mediated** in Paraglide (`inlang-icu-messageformat-1`) — but **optional**:
  plurals/select are native (variants + `Intl.PluralRules`) and flected names use the casus-slot
  scheme. **Validated 2026-06-09 for the MVP locales** (see Decision); re-check on a Slavic locale.
- **Locale switching is reload-based** in Paraglide (`window.location.reload()`), acceptable for an
  infrequent action but a UX constraint to note.
- **TanStack-Start integration is Vite-adapter + community glue**, not a turnkey first-party package — a
  small integration-ownership cost.

## Risks

- **ICU-MF1 sufficiency (primary, hard-to-reverse).** If plugin-mediated ICU-MF1 cannot cleanly express
  **flected club names** (DE genitive, slavic casus) and **slavic plural categories** (`one/few/many/
  other`), **fall back to C (Lingui, first-class ICU-MF1)** or **B (i18next + i18next-icu)**. Because the
  library choice is **hard to reverse after implementation**, this must be validated (spike on the F-01
  casus-slot + Top-5-league snapshot test) **before** Nico ratifies and before Sprint-1 scaffolding.
- **Adapter-maturity risk.** Reliance on a community TanStack-Start integration (vs first-party) could
  break on a TanStack Start major; mitigate by pinning and tracking the Vite adapter as the stable seam.
- **Single-source-of-count drift.** If ADR-0008/0010/narrative migrate at different times, the vault
  briefly holds two locale-count truths; mitigate by migrating the three touch-points in **one ratified
  batch**.

## Open questions

1. **Is plugin-mediated ICU-MF1 sufficient** for flected club names (DE/slavic casus) and slavic plurals,
   or does that force C/B? (Validation spike owed before ratify — the June re-check confirms MF1 is
   plugin-only, raising the stakes on this question.)
2. **Tolgee self-hosted vs SaaS** given the offline-first posture and €-budget — self-host (Apache-2.0,
   no lock-in, ~€5–10/mo) is the PM-09 recommendation; confirm self-host is acceptable ops-wise vs a SaaS
   free tier.

## Supersedes

[[ADR-0006-i18n]] (i18next + DE/EN, "pending Wave 2"). ADR-0006 is **not edited**; its supersession is
recorded **only here** (new-ADR rule). On ratification, ADR-0006 should be marked `superseded_by:
ADR-0094` by the maintainer who applies it.

## Related Docs

- [[ADR-0006-i18n]] — superseded i18n direction (i18next + DE/EN, pending Wave 2).
- [[../../60-Research/pre-mortem/PM-2026-05-20-09-i18n-and-localization]] — closed Wave-2 research; CORE
  library + TMS comparisons, F-01..F-10, 5-locale recommendation (binding input).
- [[../../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] — §T09 ratifies the direction and lists
  the "i18n ADR depth pass" required artefact (this ADR).
- [[ADR-0008-mobile-first-ui]] — a11y / lang / RTL-readiness section to re-scope to 5 locales.
- [[ADR-0010-design-system]] — i18n boundary + string-expansion / logical-properties tokens to re-scope.
- [[../../60-Research/narrative-content-pipeline]] / [[../../50-Game-Design/GD-0013-narrative-inbox]] —
  ICU casus-slot authoring + per-locale content budget.
- [[ADR-0021-revised-tech-stack]] — TanStack-Start substrate the SSR/adapter story depends on.
- [[../../60-Research/performance-budgets]] — initial-load + SW-precache budget the bundle delta is paid
  against.
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
