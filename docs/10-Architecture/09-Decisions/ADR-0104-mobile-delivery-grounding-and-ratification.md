---
title: ADR-0104 Mobile-delivery grounding + ratification (supersedes ADR-0025)
status: accepted
tags: [adr, architecture, mobile, pwa, capacitor, push, ios, dma, grounding, governance, fmx-198]
created: 2026-06-08
updated: 2026-06-19
type: adr
binding: false
supersedes: ADR-0025-mobile-delivery
  - [[ADR-0025-mobile-delivery]]
superseded_by:
related:
  - [[ADR-0025-mobile-delivery]]
  - [[ADR-0008-mobile-first-ui]]
  - [[ADR-0002-offline-first]]
  - [[ADR-0021-revised-tech-stack]]
  - [[ADR-0023-realtime-transport]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../11-Risks]]
  - [[../../50-Game-Design/GD-0016-mobile-ux-loop]]
  - [[../../60-Research/pwa-offline-patterns]]
  - [[../../60-Research/version-pin-audit-2026-06-19]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0104: Mobile-delivery grounding + ratification (supersedes ADR-0025)

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08. This is a **grounding-and-ratification
> supersede** of [[ADR-0025-mobile-delivery]]. It does **not** reverse ADR-0025's direction
> (responsive PWA = single source of truth; thin additive Capacitor shell for the app stores)
> — that direction is sound and is re-affirmed. It exists to fix two governance defects in
> ADR-0025: (a) ADR-0025 self-describes as an **un-ratified** "research-recommended default
> after the question was skipped at plan approval", yet carries `binding: true` and prints
> hard claims; (b) its two binding external claims — **iOS PWA Web Push is unfit** and **EU iOS
> PWAs get no push at all under the DMA** — have **no linked research note** and the ADR pins
> **no Capacitor version / min-iOS anchor**. This ADR grounds those claims to dated sources and
> converts the default into an explicitly ratifiable decision. **Per the decision gate it does
> not edit ADR-0025** (supersession is expressed here only). Low priority, not MVP-blocking.
> Awaiting Nico ratify.

## Date

2026-06-08

## Context

[[ADR-0025-mobile-delivery]] decided mobile delivery as: the responsive PWA stays the single
source of truth, and a **thin Capacitor shell** is the planned, additive, reversible path to the
App Store / Play Store with native APNs/FCM push (reusing the unchanged web `webDir`). That
direction is consistent with the project's offline-first posture ([[ADR-0002-offline-first]]),
the mobile-first UI ([[ADR-0008-mobile-first-ui]], whose invariant **U9** already assumes "the
route shell runs identically in PWA + Capacitor — no web-code fork"), and the additive/reversible
philosophy. **None of that is in dispute here.**

Three defects make ADR-0025 weak as a *binding* record:

1. **Self-contradicting status.** ADR-0025 is `status: accepted`, `binding: true`, yet its own
   Decision section says it "was recorded as the research-recommended **default** after the
   question was **skipped at plan approval**". Under the decision gate
   ([[../../90-Meta/collaboration-and-decision-protocol.md]]), a research-recommended default that
   was never put to Nico is not a ratified decision. It should be either explicitly ratified or
   explicitly gated — not silently binding.

2. **Un-grounded binding claims.** ADR-0025 prints, as binding fact, that iOS PWA Web Push is
   structurally unfit (forced add-to-Home-Screen, ~16% vs 40–70% opt-in, a "3-strike" rule
   killing silent pushes, no Background Sync, ~7-day eviction) and — most consequentially — that
   **"EU iOS PWAs get no push at all under the DMA"**. There is **no research note** under
   `60-Research/` backing these (the only adjacent note is [[../../60-Research/pwa-offline-patterns]],
   which does not cover push/DMA), and no dated source. The "no push at all in the EU" claim in
   particular is load-bearing for the *whole* Capacitor justification and must not sit un-sourced.

3. **No version anchor.** ADR-0025 names "Capacitor" with **no target major and no minimum iOS**,
   violating the standing currency rule (pin real, current versions — never assume). A mobile
   ADR with no Capacitor/iOS anchor cannot be implemented or risk-assessed as written.

This ADR is a cheap correction pass. It is **post-MVP and not MVP-blocking** (the Capacitor
target is post-MVP per ADR-0025; the PWA path carries the MVP). It is filed at **low priority**.

## Grounding (dated, sourced — 2026-06-08)

The claims ADR-0025 asserted are, as of 2026-06-08, **substantially accurate** but should be
pinned to sources and dated so they can be re-checked (Apple's DMA posture has already flipped
once and could flip again):

- **iOS Web Push exists only for Home-Screen web apps (iOS 16.4+), is user-gesture-gated, has no
  Background Sync, and has an aggressive (~7-day) storage-eviction window.** Confirmed by Apple's
  own docs ("Sending web push notifications in web apps and browsers") and 2026 PWA-limitations
  write-ups (MagicBell 2026 guide). The **"3-strike" rule is *not* in Apple's documentation** for
  iOS 16.4+ Web Push — it is an inferred/empirical behaviour, so ADR-0025 over-stated it as a hard
  fact; this ADR downgrades it to "observed, unverified" (Perplexity grounding 2026-06-08).
- **EU iOS Home-Screen web apps: push status.** Apple's iOS 17.4 EU change (DMA response)
  demoted EU Home-Screen web apps to Safari-tab shortcuts — **no standalone mode, no badges, and
  no Web Push** — and as of the latest 2026 public technical treatment this is **not restored**.
  So ADR-0025's "EU iOS PWAs get no push at all" is **accurate as of 2026-06-08**, but it is
  **DMA-driven and reversible** and must carry a date + a re-check trigger (it should not be
  printed as a timeless invariant). Source: MagicBell 2026 PWA-iOS guide; corroborated by Apple's
  EU iOS 17.4 web-apps notices.
- **Capacitor version anchor.** ADR-0025 pinned nothing. As of **2026-06-02** the latest stable
  Capacitor release is **7.6.6** (GitHub `ionic-team/capacitor` releases). **Capacitor 7** targets
  **minimum iOS 14.0** and requires **Xcode 16+** (Capacitor `docs/updating/7-0`). A `docs/updating/8-0`
  page exists, so **Capacitor 8 is in flight** — the exact target major is an open question for
  Nico, but the implementable anchor today is **Capacitor 7 (min iOS 14, Xcode 16+)**.
  *(Note: an initial Perplexity pass guessed "Capacitor 6"; the GitHub releases API corrected it to
  7.6.6 — recorded here as evidence the version was checked against the real source, not assumed.)*

> **FMX-198 currency note (2026-06-19):** this Capacitor 7.x anchor is now a
> historical accepted baseline, not the newest stable package observation.
> Direct source checks now observe `@capacitor/core@8.4.1` as current stable
> and Capacitor 9 as alpha. Re-pinning the mobile baseline to Capacitor 8.x is
> a Nico platform/support decision because it changes native floors.

These belong in a proper `60-Research/mobile-delivery-ios-push-and-capacitor-2026-06-08` note on
ratify; this ADR carries the inline citations until that note lands.

## Options considered

- **A — Keep ADR-0025 as-is.** Low cost; the decision is post-MVP anyway, so leave the
  un-ratified default and un-sourced claims untouched until mobile-iOS is actually built.
- **B — Grounding pass (RECOMMENDED).** Supersede with a grounded record: pin the
  iOS-PWA-push / EU-DMA claims to dated sources, state the **target Capacitor major + minimum
  iOS**, and convert the "research-recommended default that was skipped at plan approval" into an
  **explicitly ratified** decision (or an explicit gate). Direction unchanged.
- **C — Defer behind a gate.** Park the entire decision behind a "mobile-iOS launch?" gate and
  do not ground anything until that gate opens.

## Decision

Propose, awaiting Nico: **Option B.** Re-affirm ADR-0025's direction (PWA = source of truth;
thin, additive, reversible Capacitor shell; native APNs/FCM), but:

1. **Convert status from un-ratified default → explicit ratification.** Nico either ratifies the
   PWA-plus-Capacitor direction outright, or selects Option C (gate it). Either way it stops being
   silently `binding: true` on the strength of a skipped question.
2. **Pin the version anchor:** target **Capacitor 7.x** (min **iOS 14.0**, Xcode 16+) as the
   implementable baseline, with **Capacitor 8** flagged as a watch item (re-pin at build per the
   currency rule; exact major is Open Question Q1 below).
3. **Date-stamp and source the external claims.** The iOS-Web-Push limitations and the EU-DMA
   "no push" status are recorded **as of 2026-06-08** with citations and a **re-check trigger**
   before any mobile-iOS build, because the DMA posture is reversible. The "3-strike" claim is
   **downgraded** from binding fact to "observed, unverified".

This ADR does **not** change which transport carries push, nor the realtime transport
([[ADR-0023-realtime-transport]]), nor the cloud-sync scope ([[ADR-0090-offline-sync-scope-and-conflict-strategy]]).

## Rationale

The direction in ADR-0025 is correct and corroborated: Capacitor remains the only path that
restores reliable background push for **EU iOS** users without forking the web front end, and it
preserves the single-codebase / additive / reversible posture the project values. The problem was
never the direction — it was that a *binding* architecture record rested on (a) a question that was
skipped, (b) external claims with no source and no date, and (c) no version anchor, in a domain
(Apple DMA policy) that is actively changing. Option B fixes exactly those three defects at near-zero
cost and leaves the implementation untouched. Option A keeps an un-grounded binding claim on the
books (cheap now, but it is the kind of claim that silently goes stale). Option C is legitimate but
heavier than warranted for a low-risk, low-priority, direction-unchanged correction — though if Nico
prefers to formally gate mobile-iOS, C is a clean fallback and changes nothing technical.

## Consequences

Positive:

- Removes an **un-grounded binding claim** ("EU iOS = no push at all") by pinning it to a dated
  source with a re-check trigger.
- Mobile delivery becomes a **real ratified decision** (or an explicit gate) instead of a skipped
  default carrying `binding: true`.
- Adds the missing **Capacitor 7 / iOS 14 / Xcode 16** version anchor, making the decision
  implementable and currency-rule-compliant.
- Down-scopes the over-stated "3-strike" claim to its actual (unverified) status.

Negative / constraints:

- Adds one supersede ADR for a post-MVP, low-priority item (governance overhead).
- The EU-DMA claim now carries a **maintenance obligation**: it must be re-verified before any
  mobile-iOS build, since Apple's posture is reversible.
- A `60-Research/mobile-delivery-*` note still needs to be authored on ratify to host the citations
  durably (this ADR carries them inline meanwhile).

## Risks

**Low.** The architectural direction is unchanged, so there is no rework risk. The only residual
risk is that the dated EU-DMA / iOS-push facts drift after 2026-06-08 — mitigated by the explicit
date-stamp and the "re-check before mobile-iOS build" trigger. Choosing the wrong Capacitor major
(7 vs an imminent 8) is mitigated by the "re-pin at build" rule and Open Question Q1.

## Open questions

1. **Target Capacitor major + minimum iOS.** Capacitor 7.6.6 is the latest stable (2026-06-02,
   min iOS 14, Xcode 16+); Capacitor 8 appears to be in flight (an `updating/8-0` doc exists).
   Pin **7.x now and re-pin at build**, or wait for / target **8.x**?
2. **Are the iOS-PWA-push / EU-DMA claims still accurate at grounding/build time?** They are
   accurate as of 2026-06-08, but DMA-driven and reversible; this needs a re-check before any
   mobile-iOS build and possibly a standing watch.
3. **Ratify vs gate:** does Nico want to **ratify** the PWA-plus-Capacitor direction now (Option B),
   or formally **gate** it behind a "mobile-iOS launch?" decision (Option C)?

## Supersedes

[[ADR-0025-mobile-delivery]] — superseded for **grounding + ratification only**; its direction
(PWA = source of truth, thin additive Capacitor shell, native APNs/FCM) is re-affirmed, not
reversed. **ADR-0025 is not edited** (decision gate): supersession is recorded here in frontmatter
(`supersedes: ADR-0025`) and in this section. ADR-0025 should be marked `superseded_by: ADR-0104`
**only by Nico on ratify**, never by an agent.

## Confidence

**low.** The direction is well-corroborated, but (a) the exact target Capacitor major is unresolved
(7 vs imminent 8), (b) the EU-DMA fact is reversible and time-sensitive, and (c) whether to ratify
or gate is Nico's call. This is a low-priority, post-MVP correction.

## Related Docs

- [[ADR-0025-mobile-delivery]] — the superseded decision (direction re-affirmed; defects corrected).
- [[ADR-0008-mobile-first-ui]] — invariant **U9** ("route shell runs identically in PWA + Capacitor,
  no web-code fork") already depends on this delivery model.
- [[ADR-0002-offline-first]] — offline-first PWA baseline this delivery model serves.
- [[ADR-0021-revised-tech-stack]] · [[ADR-0023-realtime-transport]] · [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  — adjacent constraints, unchanged by this ADR.
- [[../11-Risks]] — native build-pipeline / App-Store-review risk (from ADR-0025).
- [[../../50-Game-Design/GD-0016-mobile-ux-loop]] — mobile experience this delivery channel realises.
- [[../../60-Research/pwa-offline-patterns]] — adjacent PWA research (does **not** cover push/DMA;
  the gap this ADR grounds).
- [[../../00-Index/Open-Decisions-Dossier]] — consolidated open-decision Q&A.
- External (2026-06-08): Apple "Sending web push notifications in web apps and browsers"
  (developer.apple.com); MagicBell 2026 "PWA iOS limitations / Safari support" guide (iOS 16.4 push,
  ~7-day eviction, no Background Sync, iOS 17.4 EU demotion = no push); GitHub
  `ionic-team/capacitor` releases (7.6.6, 2026-06-02); Capacitor `docs/updating/7-0` (min iOS 14,
  Xcode 16+).
