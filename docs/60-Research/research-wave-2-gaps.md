---
title: Research Wave 2 — Gap Analysis & Backlog Proposal
status: proposal
tags: [research, planning, gap-analysis]
updated: 2026-05-16
---

# Research Wave 2 — Gap Analysis & Backlog Proposal

> Prerequisite reading: [[anstoss-series-deep-dive]], [[club-boss-analysis]],
> [[competitor-matrix]], [[ip-and-licensing]], [[pwa-offline-patterns]].
>
> This document audits Wave 1 (Milestone M1.1) and proposes the topics where we
> must dig deeper **before** the Phase 2 ADRs (AKOM-117…126) and the M2-M8 seed
> epics can be finalised without guesswork. Each item is sized so that it can
> ship as a single, parallel-safe Linear issue with one Markdown output file.

## Method

For every Wave 1 doc we asked three questions:

1. Which Acceptance Criteria were satisfied at the survey level only and would
   collapse if we tried to turn them into an ADR decision or a unit-tested
   implementation today?
2. Which open questions were explicitly parked in `§Open questions` /
   `§Needs-decision` sections?
3. Which dependencies that downstream ADRs and M2-M8 epics declare
   (`area:match-engine`, `area:gamedata`, `area:squad`, `area:training`,
   `area:finance`, `area:youth`, `area:transfer`, `area:league`, `area:save`)
   currently have no Wave 1 source they can quote?

The intersection is the Wave 2 backlog below.

## Wave 1 audit — Acceptance vs. ADR-readiness

| Wave 1 doc | Strong (ADR-ready) | Weak (needs Wave 2) |
|---|---|---|
| `anstoss-series-deep-dive` | Mechanics map, weekly rhythm, IP boundaries | Match-engine numbers (xG, event rates, formation effects), economy calibration, tactics depth, late-game arc |
| `club-boss-analysis` | Inbox-as-narrative, tap loop, retention drivers | Strategic onboarding design, end-game systems, dynamic world drift algorithm, ad/IAP UX (deferred) |
| `competitor-matrix` | Differentiation quadrant, MVP risks | Women's football data shape, async/hotseat multiplayer feasibility, annual cadence vs. living world |
| `ip-and-licensing` | License matrix, hard-stop list, ADR-0007 input | Behind-the-Name CC BY-SA share-alike risk in our build pipeline; Wikidata-bloom-filter cost & FP rate; heraldic SVG generator algorithms; sponsor-brand collision check (Interbrand top-500 dataset) |
| `pwa-offline-patterns` | Dexie schema, SW update flow, outbox, iOS quotas | Determinism / RNG choice, replay format, perf budget on low-end Android, push/re-engagement, save encryption, OPFS path, telemetry/privacy/GDPR |

## Prioritised Wave 2 backlog

Priorities use the existing Linear scheme (`prio:critical` = blocks an ADR or
M2 work, `prio:high` = blocks an M2-M8 seed epic, `prio:medium` = unblocks
post-MVP). All items are `parallel:safe` by default — they each produce a
single Markdown file under `docs/60-Research/`.

### R2-01 — Deterministic match-engine simulation model — `prio:critical`

**Why now.** ADR-0003 (AKOM-119) and AKOM-130 (Match Engine v1) both depend on
a documented simulation model. Today we have a feel-driven description
(highlights / 2D / 3D tiers) but no numbers, no RNG choice, no event-rate
calibration, no formation interaction model.

**Scope.**

- Survey of public match-sim approaches: xG-based event sampling, Poisson goal
  models, minute-by-minute Markov chains, FM-style attribute-vs-attribute
  rolls, Football Chairman / Club Boss text-event feeds.
- Recommendation for v1: event schema, tick granularity, formation/mentality
  effect curves, RNG choice (xoroshiro128+ / PCG / sfc32), seed handling for
  replay determinism, edge cases (red cards, injuries, set pieces).
- Performance budget: target ≤ 50 ms per match on a 2022 mid-range Android in
  Workers; ≤ 5 ms per league-round AI matches (background-batch tick).
- Test strategy: property-based tests (fast-check) for determinism,
  golden-replay fixtures, statistical envelope (goals per match, home advantage).

**Output.** `docs/60-Research/match-engine-simulation-model.md`.
**Acceptance.** Recommended event schema, formation-effect curves, RNG choice,
≥ 10 cited public references, ADR-0003 direct-input block, links to AKOM-119
and AKOM-130.

### R2-02 — Player & club generator algorithms — `prio:critical`

**Why now.** ADR-0004 (AKOM-120, data model) and ADR-0007 (AKOM-125, naming)
need an algorithmic foundation. Wave 1 (`ip-and-licensing`) gave us the
*grammar* and the *denylist*, but not the generation algorithm, the heraldic
crest synthesiser, the league budget tiers, or the migration model.

**Scope.**

- Markov-chain vs. n-gram vs. learned-LM approaches for locale-aware name
  generation; tradeoffs in bundle size and licence exposure (Behind-the-Name
  CC BY-SA viral risk, Wikidata bloom-filter cost).
- Procedural heraldic crest SVG synthesis: shield shapes, tinctures, charges,
  layering; library survey (`svg.js`, `paper.js`, raw `@svgdotjs/svg.js`,
  `@resvg/resvg-js`) and licence audit.
- Club budget / wage / attendance tier model, deterministic per `gameId`,
  parameterised by fictional country macro indicators (GDP-analogue, league
  tier).
- Stadium capacity + age curve generator.
- Worker / build-time strategy: bloom filter generation pipeline, denylist
  validation in CI (`pnpm gamedata:lint`).

**Output.** `docs/60-Research/data-generators.md`.
**Acceptance.** Algorithm choices + rationale, bundle-size estimate per asset
type, FP-rate target for the bloom filter, ADR-0004 / ADR-0007 input blocks.

### R2-03 — Tactics & formation depth on mobile — `prio:high`

**Why now.** Anstoss deep dive recommended a halftime modal with formation /
mentality / one-tap sub; Club Boss reviews flagged shallow tactics. ADR-0008
(AKOM-124) needs a target tactics depth and AKOM-130 needs a tactics input
contract for the match engine.

**Scope.**

- Formation taxonomy (4-4-2, 3-5-2, 4-2-3-1, 5-3-2, 4-3-3 variants), mentality
  bands, player-role definitions; how FM Touch, Soccer Manager, Top Eleven
  expose them on phones.
- Mobile UX patterns for set pieces, marking, pressing, defensive line.
- Recommended MVP slice: 5–8 formations, 3 mentalities, 4 instructions, plus a
  *team chemistry* multiplier (Anstoss "Eingespielt").
- Tactics contract feeding the match engine (R2-01) and the training plan.

**Output.** `docs/60-Research/tactics-and-formations.md`.
**Acceptance.** Recommended MVP tactics slice, mobile UX patterns, ADR-0003
and ADR-0008 input blocks, links to AKOM-129 (training) and AKOM-130.

### R2-04 — AI manager / opponent behaviour — `prio:high`

**Why now.** AKOM-131 (league), AKOM-134 (transfers) and AKOM-129 (training)
all assume the rest of the world has plausible AI managers. Wave 1 explicitly
parked this.

**Scope.**

- AI archetypes (rich club, youth-focused, fire-sale, established).
- Heuristic vs. utility-AI vs. simple ML for opponent transfers, scouting,
  formation choice, lineup rotation.
- Fairness and difficulty curve; how to avoid the "Club Boss late-game flatline"
  failure mode.
- Deterministic seeds, world-drift cycles (fallen giants, rising rivals).

**Output.** `docs/60-Research/ai-manager-behaviour.md`.
**Acceptance.** Recommended AI architecture, 4–6 archetypes, difficulty levers,
ADR-0003 / ADR-0009 input blocks.

### R2-05 — Strategic onboarding & first-session design — `prio:high`

**Why now.** Club Boss reviews show that tutorials *teach controls but not
strategy*, and Anstoss is widely criticised for hostile menus. Skipping this
research is the single biggest churn risk in MVP.

**Scope.**

- Onboarding patterns from Top Eleven, OSM, SM24, We Are Football.
- Recommended 60-second start (pick country → pick fictional club → optional
  manager avatar) plus a guided first season teaching financial sustainability
  (ticket pricing, sponsorship, wage budget).
- Empty-state and re-engagement copy, feed-card primary actions.
- Accessibility (large-touch, screen-reader paths).

**Output.** `docs/60-Research/onboarding-strategy.md`.
**Acceptance.** Recommended flow, copy outline, ADR-0008 input block, links to
AKOM-115 (MoSCoW) and ADR-0006 (i18n / tone).

### R2-06 — Late-game / end-game systems — `prio:high`

**Why now.** Both Club Boss and Anstoss flatline at the top of the pyramid.
Without a designed late-game loop, dynasty saves stop being interesting around
season 4–6 — which is exactly the cohort we want to retain.

**Scope.**

- Continental cup / federation cup design without UEFA IP exposure.
- Board ambition escalations, club-ownership transitions, manager-of-the-nation
  arc (Bundestrainer career).
- Dynamic-world drift algorithm: rival rating drift, fallen-giant cycles,
  rising youth nations.
- Prestige / hall-of-fame / legacy metrics.

**Output.** `docs/60-Research/late-game-systems.md`.
**Acceptance.** Recommended systems, rough numeric tuning, ADR-0003 / ADR-0009
input blocks, link to AKOM-131 (league) and AKOM-133 (finance).

### R2-07 — Mobile UX, information architecture & accessibility — `prio:high`

**Why now.** ADR-0008 (AKOM-124) requires a defensible mobile-first IA. Wave 1
gives us patterns (office hub, inbox feed, pre-match comparison) but not a
route map, navigation pattern, or WCAG 2.2 commitments.

**Scope.**

- Route inventory mapped to TanStack Router file structure.
- Bottom-nav vs. drawer vs. hub-tile navigation tradeoffs for one-handed use.
- shadcn/ui components actually needed for MVP; design tokens.
- Accessibility commitments (WCAG 2.2 AA, large touch targets, focus order,
  prefers-reduced-motion for match animations).
- Reachability heuristics (44 px touch targets, thumb-zone heatmap).

**Output.** `docs/60-Research/mobile-ux-ia-a11y.md`.
**Acceptance.** Route map, IA diagram, a11y commitments, ADR-0008 input block.

### R2-08 — Determinism, RNG, replay & save-determinism contract — `prio:critical`

**Why now.** Cross-cutting concern that ADR-0003 (match engine), ADR-0005
(save format) and the outbox in ADR-0002 all rely on. Wave 1 left RNG choice
and replay format unspecified.

**Scope.**

- Choice of seedable PRNG (xoroshiro128+ vs. PCG vs. sfc32) and its
  cross-browser stability guarantees.
- Separating "world RNG" from "match RNG" from "AI RNG" streams to allow
  per-match replays without world drift.
- Replay format: minimal event log vs. full state snapshots vs. delta encoding.
- Save-determinism rules (no `Date.now()` in payloads, ISO strings only).
- Test strategy: property-based determinism tests, golden replays.

**Output.** `docs/60-Research/determinism-and-replay.md`.
**Acceptance.** PRNG recommendation, stream-isolation design, replay format,
ADR-0003 / ADR-0005 input blocks.

### R2-09 — Performance budgets on low-end Android & iOS — `prio:high`

**Why now.** PWA research gave us storage quotas but no compute budgets. The
match engine, league tick and SurrealDB queries must fit a ≤ 2 GB RAM, mid-tier
Android target (the modal device in our market). Without numbers, ADR-0003 and
AKOM-130 will guess.

**Scope.**

- Target devices (Snapdragon 6-class, A12-class iPhone), browser engines,
  Lighthouse performance budgets.
- Match engine target: ≤ 50 ms per match in a Web Worker; league round
  ≤ 800 ms wall clock; first-paint ≤ 1.5 s on 3G Fast.
- Memory headroom: ≤ 80 MB JS heap on phone, ≤ 30 MB IDB working set.
- Bundle budgets per route (initial JS, on-demand chunks).
- Profiling and CI gate strategy (Lighthouse CI, custom perf tests).

**Output.** `docs/60-Research/performance-budgets.md`.
**Acceptance.** Device matrix, per-subsystem budgets, CI gate proposal, link to
AKOM-127 (infra checklist).

### R2-10 — i18n, copy tone & localisation strategy — `prio:medium`

**Why now.** ADR-0006 (AKOM-123) requires a finalised i18n decision. Wave 1
parked "Anstoss humour vs. dry FM tone" and never picked a library, namespace
strategy, or pluralisation approach. ADR-0007 also depends on locale-aware
name pools (R2-02).

**Scope.**

- Library shortlist (i18next, FormatJS, lingui, native ICU MessageFormat),
  bundle-size budgets, SSR + Workbox interaction.
- Namespace strategy (one ns per route group), lazy-load patterns under
  TanStack Start.
- de-DE primary tone (Anstoss-style tabloid parody) vs. en-GB fallback (drier
  FM register); content audit pattern for IP-clean copy.
- Date/number/currency formatting via Intl API; football-specific phrases.

**Output.** `docs/60-Research/i18n-and-tone.md`.
**Acceptance.** Library choice + rationale, namespace map, tone guide, ADR-0006
input block.

### R2-11 — Telemetry, privacy, GDPR for an offline-first PWA — `prio:medium`

**Why now.** ADR-0002 (offline-first) and ADR-0009 (Cursor orchestration) both
imply analytics for SW-update telemetry, perf telemetry, error reporting. We
have no policy on what we collect, where it lives, and how a user opts in.

**Scope.**

- Threat model: what we should *not* know (career save contents, names typed
  in editor, navigation traces tied to identity).
- Recommended stack: self-hosted Plausible / PostHog OSS / Umami / OpenTelemetry
  → file-only sink; tradeoffs in cost, GDPR posture, offline buffering.
- Error reporting: Sentry self-hosted vs. third-party; PII scrubbing for
  fictional-but-user-edited content.
- Consent banner / settings UX; per-category opt-in.
- Save-encryption option (passphrase-protected exports).

**Output.** `docs/60-Research/telemetry-privacy.md`.
**Acceptance.** Recommended stack, data inventory, consent UX, ADR-0002 /
ADR-0009 input blocks.

### R2-12 — Hotseat & async friend leagues feasibility — `prio:medium`

**Why now.** Competitor matrix flagged hotseat as a clear differentiation
opportunity (only We Are Football has it; trivial on Dexie). ADR-0004 may need
a multi-manager-per-save shape; we should know before locking the data model.

**Scope.**

- Pass-and-play UX on a phone (lock screen → manager A → handoff → manager B).
- Async friend leagues via save export/import (no infra) vs. minimal
  cloud-relay via SurrealDB Cloud (post-MVP).
- Conflict resolution when two managers in the same save save offline (extends
  the model in `pwa-offline-patterns` §8).
- Anti-cheat constraints for friend leagues (replay verification).

**Output.** `docs/60-Research/multiplayer-feasibility.md`.
**Acceptance.** MVP recommendation (hotseat? async? both?), data-model
implications for ADR-0004, post-MVP path.

### R2-13 — Women's football data model readiness — `prio:medium`

**Why now.** FM26 and We Are Football 2024 ship women's competitions as a
headline. Competitor matrix flagged that *skipping is acceptable, but the
data model must not preclude it*. ADR-0004 (AKOM-120) lands soon; we should
not have to re-do schemas in M5.

**Scope.**

- Gender field shape (boolean vs. open string vs. league-scoped),
  cross-league transfer constraints.
- Calendar shape (women's leagues often offset from men's by 3 months).
- Wage / value distribution differences and how to surface them honestly.
- IP boundaries (no FIFPRO women's data, no real club mirrors — same rules).

**Output.** `docs/60-Research/womens-football-data-model.md`.
**Acceptance.** Schema recommendation that's additive-only at MVP, calendar
notes, ADR-0004 input block.

## Suggested Linear setup

Recommend creating a **Milestone "M1.5 Research Wave 2"** in the same project
(`soccer-manager — Research & Architecture`). The 13 items above translate
into 13 Linear issues, all `type:research`, all `parallel:safe` except R2-08
(`parallel:after-research`, used by R2-01 and ADR-0003).

Suggested ordering (rough waves; sequential only inside a wave):

- **W2.A — Engine foundations**: R2-08 → (R2-01, R2-02 in parallel) → R2-03,
  R2-04 in parallel.
- **W2.B — Product & UX**: R2-05, R2-06, R2-07, R2-10 in parallel.
- **W2.C — Platform**: R2-09, R2-11, R2-12, R2-13 in parallel.

The two `prio:critical` items (R2-01, R2-02, R2-08) are the only ones that
block ADRs already in M1.3 (`AKOM-119`, `AKOM-120`, `AKOM-125`); everything
else can run in parallel with the ADR finalisation work.

## Cross-references

- AKOM-115 (`feature-gap-analysis.md`, stub today) — MoSCoW will reference
  Wave 2 outputs once they land.
- AKOM-116 (`00-summary.md` rewrite) — will absorb Wave 2 takeaways for the
  Phase 2 ADR kickoff packet.
- ADR-0003 (`AKOM-119`) — blocked by R2-01, R2-08.
- ADR-0004 (`AKOM-120`) — blocked by R2-02, optionally R2-12, R2-13.
- ADR-0006 (`AKOM-123`) — blocked by R2-10.
- ADR-0007 (`AKOM-125`) — blocked by R2-02.
- ADR-0008 (`AKOM-124`) — blocked by R2-03, R2-05, R2-07.
- AKOM-130 (Match Engine v1) — blocked by R2-01, R2-08.
- AKOM-127 (infra checklist) — informed by R2-09, R2-11.
