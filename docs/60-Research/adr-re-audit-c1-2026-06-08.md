---
title: "ADR Re-Audit — Cluster C1: Foundation / Platform / UI / i18n (2026-06-08)"
status: draft
tags: [research, adr-audit, foundation, platform, pwa, offline, ui, design-system, animation, i18n, cluster-c1]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0001-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  - [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]]
  - [[../10-Architecture/09-Decisions/ADR-0025-mobile-delivery]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0010-design-system]]
  - [[../10-Architecture/09-Decisions/ADR-0048-design-update-and-migration-path]]
  - [[../10-Architecture/09-Decisions/ADR-0022-animation-game-feel]]
  - [[../10-Architecture/09-Decisions/ADR-0006-i18n]]
  - [[../10-Architecture/09-Decisions/ADR-0047-babylon-3d-presentation-engine]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[pre-mortem/PM-2026-05-20-09-i18n-and-localization]]
  - [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]]
  - [[narrative-content-pipeline]]
  - [[../00-Index/Decision-Log]]
---

# ADR Re-Audit — Cluster C1: Foundation / Platform / UI / i18n

Read-only re-audit of the ten C1 ADRs (tech stack, offline/hybrid posture, mobile delivery,
mobile-first UI/IA + client-state, design system + migration path, animation, i18n). Ground
truth respected: offline-first PWA, LLM out of authoritative state, Dokploy deploy, narrowly
scoped cloud sync. **Propose only — Nico ratifies; nothing here is accepted.** Supersession,
where warranted, is expressed only via a *new* draft ADR with `Supersedes:` frontmatter.

External verification (this audit): GSAP 100%-free status, Motion latest/React-19, and the
Paraglide-vs-i18next picture re-checked against 2026 sources (cited inline below).

## Per-ADR verdicts

### ADR-0001 Tech Stack — **silently-superseded (clean)** · confidence high
Correctly superseded by [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]; carries a
"historical memory only" banner and `superseded_by` frontmatter. No issue — included only to
confirm the lineage is clean. **Recommendation:** none; leave as historical.

### ADR-0021 Revised Tech Stack — **sound** · confidence high
The hybrid Postgres+Drizzle-as-record / SurrealDB-deferred-behind-interface posture is the
defensible "refuse risk only where it lands on money-critical state" call, and the Zustand
scope was already tightened by ADR-0008 §D2. **Issue (minor):** frontmatter `status: draft`
while body says `accepted` and Decision-Log lists `draft` — a vault-wide phase artifact (all
ADRs reopened to draft), not a content defect. **Issue (cross-cluster, flag only):** the
Postgres-vs-SurrealDB data-layer axis is owned by cluster C2/C3 — do not relitigate here.
**Recommendation:** keep; no new ADR from C1. Confirm version pins (Drizzle v1, Zod 4, Zustand v5)
are still latest-stable when the engineering wave starts (ADR's own Renovate clause).

### ADR-0002 Offline-first Strategy — **silently-superseded (clean, but a content asset)** · confidence high
Superseded by ADR-0020 for MVP scope, banner + frontmatter correct. The catch: ADR-0002 still
contains the **most detailed offline mechanics in the vault** (SW tooling `vite-plugin-pwa`
`injectManifest` + Workbox 7, update FSM, outbox replay triggers, IndexedDB budget, install UX,
Sync/Activity view). ADR-0020 deliberately narrows MVP scope but does **not** re-state these
mechanics, and ADR-0090 (offline-sync) builds the command-queue seam without re-deriving the SW
layer. **Issue:** the SW/precache/update-strategy detail now lives *only* inside a superseded
doc, so it reads as "do not implement" even though most of it (precache shell, network-first nav,
SWR read-models, never-cache mutations, hash-busted locale bundles) is exactly the Phase-2 plan.
**Recommendation (option set):** (A) leave as-is and rely on ADR-0090 to re-home SW mechanics when
offline returns; (B) **preferred** — when offline-first work starts, a new ADR re-homes the still-valid
SW/precache/update/outbox mechanics from ADR-0002 §§2–8 as current spec, citing ADR-0002 as origin;
(C) lift them into the arc42 08-Crosscutting chapter now. Recommend (B), deferred to the offline wave —
not a C1 blocker.

### ADR-0020 Hybrid-online MVP, Offline-ready — **sound** · confidence high
Cleanly stages "least-irreversible path": server-confirmed authority for MVP, four offline UX
states, forward-compatible command/snapshot contracts, Dexie mandatory. Coheres with ADR-0008
§D2 (same four states, command-id/expected-version seam) and ADR-0090 (thin MVP + migration seam).
**Issue (minor):** §UX names four offline states; ADR-0008 binds the same four; ADR-0090 adds the
command-queue migration seam — three docs describe one model with no single canonical home.
**Recommendation:** keep; when offline-first is implemented, name one doc as the canonical
offline-state-model source (likely the re-homed ADR from the ADR-0002 recommendation above) and
back-reference. No new ADR needed now.

### ADR-0025 Mobile Delivery (PWA + Capacitor) — **weak (under-grounded + version-stale)** · confidence medium
Direction (responsive PWA = source of truth; thin additive Capacitor shell for APNs/FCM; no
web-code fork) is sound and matches ADR-0008 U9. But the ADR self-describes as "recorded as the
research-recommended default after the question was skipped at plan approval" — i.e. it was never
truly ratified, and the iOS-PWA-push claims (~16% opt-in, 3-strike rule, EU DMA "no push at all")
are 2026-as-of-May assertions with **no linked research note** and no version anchor. Capacitor's
major version / minimum-iOS support is unstated. **Recommendation (option set):** (A) keep as-is
(low cost, post-MVP anyway); (B) **preferred** — a short grounding pass: pin the iOS-PWA-push and
EU-DMA claims to dated sources, state target Capacitor major + min iOS, and have Nico explicitly
ratify (it is currently an un-ratified default by the ADR's own admission); (C) defer the whole
decision behind a "mobile-iOS launch?" gate. Recommend (B) — cheap, removes an un-grounded binding
claim. Not MVP-blocking.

### ADR-0008 Mobile-first UI — route map, IA & client-state — **sound** · confidence high
The strongest doc in the cluster: ratified live (D1–D3 = A,A,A, FMX-98), resolves the
GD-0016↔ADR-0021 Zustand contradiction explicitly, enumerates invariants U1–U9 + verification +
a11y (WCAG 2.2 AA, 44px, prefers-reduced-motion), and pins the worker bridge (Comlink control-plane
+ hand-rolled postMessage event stream) to the existing MatchWorkerBridge. **Issue (minor):** the
a11y §  references i18n as "route-level locale routing only (ADR-0006 / R2-10)" and chrome strings
in `locales/{de,en}.ts` — this inherits ADR-0006's stale i18next/2-locale assumption (see below).
**Recommendation:** keep; the only follow-on is that the i18n contract it points at (ADR-0006) is
itself stale — fix there, not here.

### ADR-0010 Aurelia Premier Design System — **weak (thin frontmatter + scope drift risk)** · confidence medium
The tokenized approach (CSS-var indirection over Tailwind v4 `@theme`, `data-scheme` not
`prefers-color-scheme`, club-adaptive accent, shadcn deferred, fixtures-vs-i18n boundary) is
sound and matches Nico's standing "tokenized/reusable/responsive" rule. **Issues:** (1) frontmatter
is the thinnest in the cluster — no `created`, no `binding`, no `supersedes`/`related` lineage,
only `status: draft` + `updated: 2026-05-16`; it predates the vault's frontmatter conventions.
(2) It still says "shadcn is deferred / currently unused" and "Direction A only, 10 of 45 screens"
— a May snapshot that may have drifted. (3) Tailwind **v4** CSS-first `@theme` should be confirmed
latest-stable at implementation (Tailwind v4 is current in 2026; verify exact minor). **Recommendation
(option set):** (A) leave (design phase, app not built); (B) **preferred** — a light hygiene ADR or
amendment normalizes ADR-0010 frontmatter to vault convention and re-confirms the shadcn-deferral +
Tailwind-v4 + token-source decisions still hold, folding in ADR-0048's token-single-source so the
design-system decision has one current head. Recommend (B); low priority.

### ADR-0048 Design-System Update & Migration Path — **sound** · confidence high
Clean amendment to ADR-0010: token single-source (wiki + future app derive), versioned dated
snapshots, diff-driven sync-only ("never reimplement by eye"), supersede discipline for breaking
changes, one-issue-one-PR. `binding: false` is appropriate (process policy, not architecture).
**Issue (minor):** it amends ADR-0010 but ADR-0010's own frontmatter has no `amended_by` back-link
(ADR-0010 predates that convention) — the lineage is one-directional. **Recommendation:** keep; if
the ADR-0010 hygiene pass happens (above), add the reciprocal `amended_by: ADR-0048` link there.

### ADR-0022 Animation & Game-Feel Stack — **sound (version pins to refresh)** · confidence high
Motion (`motion/react`, slim `m` + `LazyMotion`) for UI/gesture/layout + GSAP (`@gsap/react`
`useGSAP`) for choreographed/in-canvas timelines + Tailwind keyframes for micro-states, with a
clear role boundary, is current best practice and survives external re-check. **Verified 2026:**
GSAP became **100% free incl. all bonus plugins (SplitText/MorphSVG/etc.) and commercial use** on
2025-04-30 via Webflow — ADR-0022's "GSAP fully free incl. plugins since 2025" claim is **correct**
([webflow.com/blog/gsap-becomes-free], [css-tricks.com GSAP now free]). Motion is **MIT** and now
ships **explicit React 19 support** (React-19 added to the test suite, React-19 reorder fixes in the
12.29–12.39 line; latest stable **12.40.0**, not the 11.x the ADR's bundle figures predate)
([motion.dev/changelog], [npmjs.com/package/motion]). The `LazyMotion`+`m` pattern still works but
Motion's current docs de-emphasize it in favor of direct imports + ESM tree-shaking. **Issue (minor):**
no explicit version pins (ADR-0021's no-`latest` rule applies); the "≈4.6kb initial" figure is a
Framer-Motion-era number. **Recommendation:** keep the decision; refresh the bundle figure and add
explicit pins (Motion ^12, GSAP ^3.13, `@gsap/react`) when implementation starts.

### ADR-0006 i18n Strategy — **stale / silently-superseded-by-research** · confidence high · **the cluster's weakest decision**
ADR-0006 (binding-track, parked `draft`) still records **i18next/react-i18next, German default,
English maintained**, with key taxonomy "pending Wave 2 UI research." Wave 2 *closed*: the i18n
pre-mortem [[pre-mortem/PM-2026-05-20-09-i18n-and-localization]] (2026-05-20, status `current`)
and [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] §T09 produced a materially
**different** recommendation that ADR-0006 was never updated to reflect:
- **Library: Paraglide JS + format.js Intl polyfills**, explicitly *over* i18next — pre-mortem
  benchmark cites Paraglide ~5KB vs i18next ~22KB runtime and "i18next 205KB vs Paraglide 47KB"
  for 5 locales/100 messages, with an official **TanStack Start adapter since Jan 2026**.
- **Locales: 5 MVP (DE/EN/FR/ES/IT)**, not the 2 (de/en) that ADR-0006, ADR-0008 a11y §, and
  ADR-0010's `locales/{de,en}.ts` boundary all still assume.
- **ICU MessageFormat MF1** (plural/select/gender) as a hard requirement; **TMS = Tolgee
  self-hosted**; pseudo-loc + ICU-validate + RTL-logical-properties as CI gates; URL-first locale
  detection hierarchy; hash-busted locale bundles for SW cache.

External re-check (this audit, 2026): Paraglide JS markets itself as "compiler-first i18n for
**TanStack Start**, SvelteKit and Vite," v3.x line, ~70% smaller i18n bundles, first-class SSR,
runtime locale switching without full reload; the main trade-off vs i18next/Lingui is that strict
ICU MF1/MF2 is plugin-dependent rather than a core runtime API ([github.com/opral/paraglide-js],
[intlayer.org/doc/benchmark], [phrase.com react-i18n libraries], [simplelocalize.io react l10n]).
So the pre-mortem's Paraglide-over-i18next recommendation **holds in 2026**, with the one caveat
that the **ICU-MF1 requirement (slavic plurals, flected club names) must be validated against
Paraglide's plugin story** before locking it — that is the genuine open sub-decision.

**Issues:** (1) ADR-0006 contradicts its own downstream research and the gap-closure's explicit
"i18n ADR depth pass" required-artefact that was never produced. (2) Three other binding docs
(ADR-0008 a11y §, ADR-0010 i18n boundary, narrative-content-pipeline ICU work) inherit the stale
2-locale/i18next assumption. (3) The library choice is a tech decision with real PWA-bundle and
SSR consequences — exactly a HITL gate, not something to settle in-line.
**Recommendation (option set, for Nico):**
- **(A) Paraglide JS + format.js + Tolgee self-hosted, 5 MVP locales (DE/EN/FR/ES/IT)** — the
  pre-mortem's recommendation; best PWA bundle + native TanStack Start adapter; risk = ICU-MF1 is
  plugin-mediated and locale hot-swap implies a re-render/reload pattern. **(Audit lead recommendation.)**
- **(B) i18next + i18next-icu, DE/EN now** — what ADR-0006 says today; richest ICU/plugin ecosystem
  and zero migration from the current ADR, at ~4x the runtime bundle (worse for the offline PWA budget).
- **(C) Lingui** — compiled catalogs + first-class ICU MF1, middle bundle weight; weaker TanStack
  Start story than Paraglide.
This warrants a **new superseding i18n ADR** (supersedes ADR-0006) once Nico picks A/B/C and the
ICU-MF1-vs-Paraglide-plugin question is resolved. Confidence high that ADR-0006 is stale; the choice
itself is Nico's.

## Cross-ADR issues within C1

1. **i18n staleness fans out across the cluster.** ADR-0006 (i18next, 2 locales) is contradicted by
   the closed Wave-2 i18n research, and ADR-0008 (a11y §, `locales/{de,en}`), ADR-0010 (i18n boundary),
   and the narrative-content-pipeline ICU work all inherit the stale assumption. A superseding i18n ADR
   should also note the downstream locale-count touch-points so they migrate together. **(Highest-value
   C1 finding.)**

2. **Offline mechanics live in a superseded doc.** The concrete SW/precache/update/outbox/storage spec
   exists in detail **only** in superseded ADR-0002; ADR-0020 (MVP scope) and ADR-0090 (sync seam) point
   at it but never re-home it. No single *current* doc owns the SW/precache/update-strategy mechanics.
   Re-home them in the offline wave (see ADR-0002 recommendation).

3. **No single canonical "offline UX state model."** The four offline states (available-offline /
   cached-stale / draft-on-device / requires-connection) are independently restated in ADR-0020 §UX and
   ADR-0008 §client-state, with the command-id/expected-version seam added by ADR-0008 + ADR-0090.
   One canonical home + back-references would remove drift risk.

4. **Design-system decision has two heads.** ADR-0010 (decision) + ADR-0048 (amendment, token
   single-source) are correctly linked one way but ADR-0010's pre-convention frontmatter lacks the
   reciprocal `amended_by` and modern lineage fields. Hygiene-only; low priority.

5. **Version-pin currency (ADR-0021 no-`latest` rule).** ADR-0022 (Motion 11-era figure; should be
   Motion ^12 + GSAP ^3.13), ADR-0010 (Tailwind v4 minor), ADR-0025 (Capacitor major + min iOS unstated)
   all carry implicit-or-stale version assumptions. None are defects today (design phase), but all must be
   re-pinned to latest-stable at implementation per ADR-0021 §5 + Renovate.

6. **No harmful coupling found** between the foundation/UI/animation decisions — boundaries (PWA source
   of truth, worker-bridge typed seam, token indirection, animation role split) are clean.

## Proposed decisions (working titles; numbers assigned centrally)

- **New superseding ADR — "i18n stack & locale scope (supersedes ADR-0006)."** Pick library
  (Paraglide JS + format.js / i18next+icu / Lingui), MVP locale set (recommended DE/EN/FR/ES/IT),
  ICU-MF1 requirement and how it's met on the chosen lib, TMS (Tolgee self-hosted), and the i18n CI
  gates (pseudo-loc, ICU-validate, logical-properties/RTL-prep) + hash-busted SW locale caching. Folds
  in the closed Wave-2 i18n research as binding. Audit-lead recommendation: option A (Paraglide), pending
  the ICU-MF1/plugin validation and Nico's ratification. **Confidence high (that an ADR is needed).**
- **New ADR (light) — "Mobile-delivery grounding + ratification (amends/supersedes ADR-0025)."** Pin the
  iOS-PWA-push / EU-DMA claims to dated sources, state target Capacitor major + min iOS, and convert the
  self-described un-ratified default into an explicitly ratified (or explicitly gated) decision.
  **Confidence medium.**
- **New ADR (hygiene) — "Design-system head normalization (amends ADR-0010)."** Normalize ADR-0010
  frontmatter to vault convention, fold in ADR-0048 token-single-source as one current head, re-confirm
  shadcn-deferral + Tailwind-v4 + `data-scheme` still hold. **Confidence low (nice-to-have).**

Offline-mechanics re-homing (cross-issue 2) and the offline-state canonical-home (cross-issue 3) are
recommended as part of the *offline-first implementation wave*, not as standalone C1 ADRs now.

## Sources (external, this audit)
- GSAP 100%-free incl. all plugins + commercial, 2025-04-30 (Webflow): webflow.com/blog/gsap-becomes-free;
  css-tricks.com "GSAP is Now Completely Free"; gsap.com/blog/3-13.
- Motion latest stable 12.40.0, MIT, explicit React 19 support: motion.dev/changelog;
  npmjs.com/package/motion; github.com/motiondivision/motion.
- Paraglide JS compiler-first i18n with first-class TanStack Start + SSR, ~70% smaller, v3.x:
  github.com/opral/paraglide-js; intlayer.org/doc/benchmark/nextjs; phrase.com react-i18n libraries;
  simplelocalize.io popular React localization libraries.
- Internal: [[pre-mortem/PM-2026-05-20-09-i18n-and-localization]] (Paraglide+Tolgee, 5 locales, ICU-MF1,
  CI gates); [[../95-Archive/gap-reports/gap-closure-concept-2026-05-22]] §T09 (i18n ADR depth pass owed).
