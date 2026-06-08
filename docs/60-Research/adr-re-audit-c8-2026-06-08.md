---
title: ADR re-audit — Cluster C8 (Narrative / Media / AI-World / Notifications / Stats)
status: draft
tags: [research, audit, adr-re-audit, c8, narrative, media-ecology, ai-world, llm, notifications, analytics, ddd, determinism]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0043-notification-and-messaging-platform]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0081-statistics-analytics-read-model-owner]]
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../50-Game-Design/GD-0031-analytics-hub-and-statistics]]
  - [[../00-Index/Open-Decisions-Dossier]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
---

# ADR re-audit — Cluster C8: Narrative / Media / AI-World / Notifications / Stats

Read-only audit (2026-06-08) of the eight C8 ADRs against each other, the offline-first /
LLM-out-of-state ground truth, and the ratified DDD/determinism rules. Two targeted external
passes (Perplexity, 2026-06-08) on the weakest seams. **Propose-only — Nico ratifies. Nothing here
flips an ADR to accepted, and no existing file is edited.**

Scope verdict up front: this is a **strong cluster**. The LLM-out-of-state boundary (ADR-0030) and
the source-owns-the-fact / Narrative-renders split (ADR-0076) are sound and well-aligned with
current local-first best practice. The real findings are (1) a concrete **ubiquitous-language /
ownership collision on `NarrativeThread` / `storyThreadId`** between ADR-0076 and ADR-0085, and
(2) an **offline-first gap**: the narration "pillar" is cloud-LLM-only with no on-device path, so a
headline MVP feature silently degrades to templates the moment the player is offline — which the
offline-first ground truth (ADR-0002) arguably makes a product decision, not an implementation
detail.

## Per-ADR verdicts

### ADR-0030 — LLM Out Of Authoritative State Boundary — **sound** (high)

The boundary is textbook and matches 2026 local-first guidance: deterministic ICU fallback rendered
*before* any provider call, LLM runs only on already-committed read models, generated prose never
parsed back into commands/facts, PII-minimized placeholder prompts, provenance (`aiGenerated`,
model metadata, `cacheKey`), kill-switch, cost caps, and a static architecture guard keeping the LLM
SDK out of match-engine/replay paths (lines 103-113, 199-223, 334-369). The Perplexity offline-first
pass independently reproduced this exact shape ("deterministic output first … LLM runs after commit …
never block on the cloud … cache by event ID"). Match-ticker special case (lines 179-197) correctly
keeps the engine from ever awaiting the LLM.

Issue (gap, not a flaw in the boundary): the ADR frames runtime LLM as **cloud-only via OpenRouter**
and the Provider Boundary (lines 286-297) never considers **on-device WebGPU inference**
(WebLLM / transformers.js / MLC). Because [[../20-Features/feature-ai-narration-mvp-pillar]] is a
named MVP *pillar* and the project is **offline-first (ADR-0002)**, an offline player gets
template-only narration — the pillar silently does not function offline. That is a legitimate
product/scope question for Nico, not something the boundary itself resolves. See cross-ADR X3.

Recommendation: keep ADR-0030's boundary as-is; raise the offline-narration path as a separate
decision (proposed below).

### ADR-0054 — Narrative Context and AI Narration Framework — **sound** (high)

Clean DDD ownership: Narrative owns scene/storylet selection, context-card assembly, fallback
templates, the provider adapter, validation, provenance, eval corpus and the `FallbackCoverageManifest`
gate; it explicitly does **not** own any authoritative truth (lines 77-97). The dialogue-intent flow
(lines 145-161) keeps mechanics reading the finite `DialogueIntent`, never prose, with exactly one
`effectOwnerContext` per intent — this is the correct anti-corruption posture and is consistently
echoed in ADR-0030 and ADR-0065. Context-boundary table (lines 164-172) is coherent.

Minor issue: the public-contract list (lines 189-205) already includes `storyThreadId`-adjacent
`NewsworthyEventEnvelope` / `NarrativeNewsFactProjection`, which is where the thread-ownership
collision with ADR-0085 first becomes visible (see X1). No change to ADR-0054's decision is needed;
the collision is resolved in the ADR-0076/0085 seam.

Recommendation: ratify as the Narrative owner; ensure the thread-naming rule (X1) lands before
implementation so Narrative's `storyThreadId` and Media Ecology's `NarrativeThread` are disambiguated.

### ADR-0065 — Narrative Media/Press Content Ownership — **sound** (high)

Correctly resolved as a **Narrative subdomain, not a new BC** — confirmed by ADR-0089's reconciliation
(line 63: "not a new BC — Narrative subdomain"). The publish-vs-deliver split (Narrative publishes
`PressArticlePublished`; Notification distributes) matches the newsroom/CMS analogy and keeps ADR-0043
clean (lines 154-172, 322-324). Effect-intent boundary (lines 287-294) keeps owning contexts as the
only writers of morale/fan/board/transfer state.

Issue (now partly overtaken-by-events): ADR-0065 was authored 2026-06-02, before ADR-0085 (2026-06-07)
carved **outlet operational behaviour** out into the separate Media Ecology context. ADR-0065 still
speaks of Narrative owning `ToneProfileLibrary`, `PressPublicationPolicy` and "which outlet publishes"
flavour as if Narrative were the media owner. ADR-0085 (lines 208-211) says it leaves ADR-0065's
*content authoring* intact and only adds a Related pointer — but the seam between "press content
authoring" (Narrative) and "outlet publication cadence/stance" (Media Ecology) is asserted, not yet
fully drawn. This is overlap to watch, not a contradiction (ADR-0085 explicitly defers the additive
pointer to ratify time).

Recommendation: sound to ratify; add the additive Related→ADR-0085 pointer at ratify (as ADR-0085
already proposes) and confirm the `PressPublicationPolicy` (Narrative) vs `cadenceProfile`/edition
budget (Media Ecology) line so "publication policy" does not have two owners.

### ADR-0076 — Narrative Newsworthiness Event Contracts — **sound** (high)

Strong contracts-first work. Source domain decides the fact is newsworthy (C1), Narrative consumes
immutable snapshots and never joins back (C2), banded display snapshots avoid cross-context joins and
respect medical/legal privacy (D4=A, C5), rumours carry confidence/attribution/decay/supersession
(C4), outbox + idempotency (C7), LLM can phrase but never create facts (C8). The `PlayerSuspended`
de-duplication (defers schema to ADR-0078, lines 305-321, C6) is exactly the right move to avoid two
authoritative owners. Zod 4 `z.strictObject` + `discriminatedUnion` + `z.toJSONSchema()` guidance is
current.

Issue (the cluster's central finding): ADR-0076 introduces `storyThreadId` as the grouping/supersession
key on `NewsworthyEventEnvelope` and `NarrativeNewsFactProjection` (lines 146, 332, 351-356), and
ADR-0085 then declares a **first-class `NarrativeThread` aggregate** (emerging→heating→climax→resolved)
"grouped by `storyThreadId`" owned by **Media Ecology** (ADR-0085 lines 162, 181). Two contexts now
model the same storyline-thread lifecycle under the same name/key without a stated owner of thread
*origination*. See X1.

Recommendation: sound to ratify; bolt on the thread-ownership/naming rule (X1) so the same `storyThreadId`
is a correlation key, not a shared aggregate.

### ADR-0071 — AI World Simulation Context and Drift Contract — **sound** (high)

Clean separation of world-drift orchestration from League/Club/Transfer/Youth authority (lines 56-64),
hybrid RNG allocation with explicit sub-labels and the "new mechanism ⇒ new label, never reuse a
sequence" rule (lines 198-212), byte-identical replay invariant (inv 1), no ledger writes (inv 2),
no cross-context table reads (inv 3), all magnitudes deferred to FMX-52 (inv 5). Event sketches carry
only banded deltas / policy refs, never cash amounts (lines 134-195) — correctly keeping the ledger in
Club Management. Reconciled in ADR-0089 as BC #25.

Issue (minor / forward-looking): ADR-0085's "Open ratification item" proposes Media Ecology **reuse
`WorldAiMgmtRng`** (the stream ADR-0071 introduced) via a `media:*` sub-label. ADR-0071 itself does not
anticipate a media consumer of its RNG family. This is consistent with ADR-0018 stream-reuse discipline
and the dossier M1 recommendation, but it means `WorldAiMgmtRng`'s sub-label namespace is now shared
across two contexts — worth an explicit note so the namespace owner is clear.

Recommendation: ratify as-is; treat the `WorldAiMgmtRng:media:*` sub-label as an ADR-0085 ratify item
(dossier M1) with a one-line cross-reference back to ADR-0071's RNG-label section.

### ADR-0043 — Notification and Messaging Platform — **weak** (medium) — status/offline tension

The decision (first-party Notification BC, Postgres system-of-record, SSE→Centrifugo, Brevo/Mailjet,
Web Push, Dexie offline inbox mirror) is well-reasoned and the channel scoping is disciplined. Two
issues:

1. **Status inconsistency (stale frontmatter).** Frontmatter says `status: draft` and `binding: false`
   (lines 4, 9) but the body says `## Status … accepted`, `accepted_at: 2026-05-22`, `binding: true`
   (lines 8, 19). The project re-opened all ADRs to draft for the current research phase, so the
   *frontmatter* is the intended current truth — but four other cluster ADRs (0065/0076/0081/0085)
   cite ADR-0043 as **"accepted"** (e.g. ADR-0065 line 51, ADR-0085 line 72). The cluster reasons about
   ADR-0043 as a fixed anchor while its own frontmatter says draft. This is exactly the silent-status
   drift the protocol warns against.
2. **Offline-first framing is thin.** ADR-0043 was authored 2026-05-22, before ADR-0090 (2026-06-07)
   pinned the Offline Sync scope/conflict strategy and before ADR-0002 offline-first was re-centred.
   The inbox is correctly offline (Dexie mirror, lines 75, 102), but every *delivery* channel (SSE,
   Centrifugo, email, Web Push) is online-only, and the ADR predates the ADR-0090 outbox/replay-queue
   contract. The notification platform is not re-stated against the now-explicit offline-sync seam.

Recommendation (2-3 options for the status question, for Nico):
- **A.** Treat the frontmatter (`draft`) as truth, leave the body, and add a one-line note in the
  re-ratification pass that ADR-0043 must be re-accepted under the current gate — cheapest, but the
  body still self-describes as accepted.
- **B.** Author a small superseding ADR that re-states ADR-0043 unchanged under the current draft→accept
  gate AND adds an explicit offline-delivery clause aligning it to ADR-0090 (inbox-first, channels are
  best-effort online enhancements, replay via the ADR-0090 queue). **Recommended** — it fixes both the
  status drift and the offline gap in one move without editing the old file.
- **C.** Leave entirely; accept the inconsistency as a known phase artifact. Lowest effort, highest
  future-confusion risk given four ADRs cite it as accepted.

### ADR-0081 — Statistics & Analytics Read-Model Owner — **sound** (high)

Model CQRS projection-only context: read models not command authority (SA1), no private-table joins
(SA2), idempotent via ADR-0028 offsets (SA3), deterministic rebuild for a fixed `metricSetVersion`
(SA4, SA8 side-by-side versions), immutable `SeasonAnalyticsHandoffSnapshot` to Manager & Legacy so
no live cross-save read (SA7), and — importantly for this cluster — **SA9 separates in-world football
statistics from product/user telemetry analytics** (no shared consent semantics). That last invariant
is the right call and directly answers the "analytics read-model" newsworthiness/notification
temptation to conflate the two. Reconciled in ADR-0089 as BC #27. Cleanly resolves the
`standingsRef` owner left open by ADR-0068.

Issue (minor / cross-cluster coupling to watch): Statistics consumes Match analytics output layers
(xG/xA/PPDA/field-tilt, lines 245-256). Those derived layers must exist in the Match engine's output
contract; if they do not yet, SA4's "byte-identical rebuild" depends on a Match contract that may not
be frozen. Out of C8 scope but worth flagging to the Sporting-Core cluster.

Recommendation: ratify as-is; confirm the Match analytics output layer contract exists before
implementation so the derived-metric projections have a stable source.

### ADR-0085 — Media Ecology Context and Outlet Operational Behaviour — **weak** (medium) — ubiquitous-language collision

The decision is well-grounded (persistent opinionated outlets vs the genre's "fake-feeling outlets"
pitfall; deterministic scoring+budget selection; pure-function stance drift over a local
`ClubNarrativeSignalsProjection`; non-authoritative ME1; outbox/idempotent ME11; IP-clean naming
ME10). The determinism story is strong. Two issues:

1. **`NarrativeThread` / `storyThreadId` ownership collision (the cluster's headline).** ADR-0085 makes
   `NarrativeThread` a **first-class Media-Ecology aggregate** with lifecycle `emerging→heating→climax→
   resolved`, "grouped by `storyThreadId` (aligns with ADR-0076 `storyThreadId`)" (lines 162, 181), and
   emits `NarrativeThreadOpened/Advanced/Resolved`. But ADR-0076 already uses `storyThreadId` as
   Narrative's grouping/supersession key on its projection, and the *name* "NarrativeThread" reads as a
   **Narrative** concept living in **Media Ecology**. Targeted DDD research (Perplexity 2026-06-08,
   citing Evans/Vernon/Khononov) is explicit: sharing `storyThreadId` as a **correlation key** is
   idiomatic, but having a first-class aggregate **named for another context** and modelling the same
   lifecycle in two places is model-leakage. The fix is per-context naming (e.g. Narrative `StoryThread`
   vs Media Ecology `CoverageThread`), `storyThreadId` as correlation-only, and a single owner of thread
   *origination*. See X1.
2. **Narrative↔Media-Ecology "two owners of media" seam (with ADR-0065).** ADR-0085 asserts it leaves
   ADR-0065 content authoring intact, but `PressPublicationPolicy` (Narrative, ADR-0065) and
   `cadenceProfile`/edition-budget publication policy (Media Ecology, ADR-0085) both describe "when/what
   gets published." The seam is described but not contract-level drawn. See X2.

Recommendation (2-3 options for X1, for Nico — full framing in cross-ADR section):
- **A.** Rename Media Ecology's aggregate to `CoverageThread`; `storyThreadId` is a correlation key
  only; **Narrative owns thread origination** (it decides a new storyline exists), Media Ecology owns
  the *outlet-coverage* evolution of that thread. **Recommended** (matches the cited DDD pattern).
- **B.** Make **Media Ecology** the sole owner of the thread aggregate (since outlet heat-cycles drive
  it) and have Narrative reference it read-only — fewer aggregates, but puts a player-facing "story"
  concept inside a simulation context (the research's weaker option).
- **C.** Introduce a thin shared `StoryThread` correlation contract owned by neither, defined once and
  consumed by both — cleanest vocabulary but adds a contract artifact for a single ID + lifecycle enum.

## Cross-ADR issues (within C8)

- **X1 — `NarrativeThread` / `storyThreadId` ownership + naming collision (ADR-0076 ↔ ADR-0085).**
  Same storyline-thread lifecycle concept appears as Narrative's grouping key (0076) and as a
  Media-Ecology first-class aggregate *named* `NarrativeThread` (0085). No ADR states who **originates**
  a thread or owns its canonical lifecycle. Resolution = per-context aggregate names + `storyThreadId`
  as correlation key + a named origination owner (Narrative recommended). This is the single most
  actionable C8 finding and warrants a small superseding/clarifying ADR (proposed below).

- **X2 — "two owners of media" seam (ADR-0065 ↔ ADR-0085).** Press *content authoring* (Narrative) vs
  outlet *operational behaviour* (Media Ecology) is the right split, but "publication policy" /
  "which outlet publishes what when" language straddles both. ADR-0085 defers the disambiguating
  Related-pointer + clause to ratify time; until then the seam is asserted, not drawn. Recommend the
  ratify pass explicitly assign `PressPublicationPolicy` (content readiness/embargo) to Narrative and
  `cadenceProfile`+edition-budget+salience selection to Media Ecology, with `OutletPublishedStory` as
  the single hand-off contract.

- **X3 — offline-first narration gap (ADR-0030 ↔ ADR-0002, feature-ai-narration-mvp-pillar).** Runtime
  LLM is cloud-only (OpenRouter); narration is a named MVP pillar; the game is offline-first. An offline
  player gets template-only narration with no on-device path even considered. Whether the pillar is
  "fully delivered" while offline is a **product/scope decision**, not an implementation one. Targeted
  research (Perplexity 2026-06-08) finds in-browser WebGPU inference (WebLLM/transformers.js/MLC) is
  *best-effort viable for short cosmetic snippets in early 2026* but not a guaranteed baseline (model
  size/VRAM/cold-start/mobile constraints) — i.e. it could only ever be a second progressive-enhancement
  tier *above* templates, never a replacement for the deterministic fallback. Flag for Nico.

- **X4 — ADR-0043 status drift (frontmatter draft vs body accepted; cited as accepted by 0065/0076/0081/
  0085).** The cluster treats Notification as a fixed anchor while ADR-0043's own frontmatter says draft.
  Needs an explicit re-ratification note or a superseding re-statement (ADR-0043 option B above).

- **X5 — shared `WorldAiMgmtRng` namespace across ADR-0071 and ADR-0085.** Media Ecology proposes a
  `WorldAiMgmtRng:media:*` sub-label; ADR-0071 owns that stream and its "new mechanism ⇒ new label"
  rule. Low-risk (consistent with ADR-0018 reuse discipline + dossier M1) but the namespace now has two
  consumer contexts; add a one-line cross-reference so the sub-label namespace owner is unambiguous.

## Targeted external research (2026-06-08)

- **DDD — shared thread concept across two contexts** (Perplexity, citing Fowler/Evans `BoundedContext`,
  Vernon strategic design, Khononov, milanjovanovic modular-monolith refactoring): sharing a
  `storyThreadId` as a **correlation key** across contexts is idiomatic; a first-class aggregate named
  for another context that re-models the same lifecycle is model-leakage. Recommended: per-context
  aggregate names (`StoryThread` vs `CoverageThread`), correlation-only ID, customer/supplier relation
  via domain events + ACL, small shared glossary for cross-cutting IDs only. Grounds X1/X2.
- **Offline-first LLM enrichment** (Perplexity, citing offline-first architecture guidance): cloud LLM
  must be a pure progressive-enhancement sidecar — deterministic output first, LLM after commit, never
  block on cloud, cache by event ID, queue-don't-depend. This independently validates ADR-0030's
  boundary AND confirms X3 (on-device WebGPU is at best a *second* enhancement tier in early 2026, not a
  baseline). No reliable version metadata for WebLLM/transformers.js/MLC was returned, so versions are
  **not** asserted here — a follow-up version-pinning pass is needed if the on-device path is pursued.

## Proposed decisions (working titles — numbers assigned centrally)

1. **Clarifying/superseding ADR — "Story-thread ownership & cross-context naming"** (supersedes the
   thread-ownership portions of ADR-0076 + ADR-0085 only). Fixes X1: per-context aggregate names,
   `storyThreadId` as correlation key, Narrative as thread-origination owner (recommended). High value,
   medium confidence on the exact owner pending Nico.

2. **Superseding ADR — "Notification platform re-ratification + offline-delivery clause"** (supersedes
   ADR-0043). Re-states ADR-0043 unchanged under the current draft→accept gate, fixes the
   frontmatter/body status drift (X4), and adds an explicit offline clause aligning channels to ADR-0090
   (inbox-first; SSE/email/push are best-effort online enhancements; replay via the ADR-0090 queue).
   Recommended option B above.

3. **New decision (or GD) — "Offline narration tier for the AI-narration MVP pillar"** (no supersede;
   informs ADR-0030 + the narration feature). Decides whether the narration pillar is "fully delivered"
   while offline, and whether an on-device WebGPU tier sits between deterministic templates and cloud
   LLM. Product/scope call for Nico; requires a version-pinning research follow-up if pursued. X3.

## Sources & honesty

Two Perplexity passes (2026-06-08): DDD shared-thread ownership (Fowler/Evans/Vernon/Khononov-grounded,
high confidence) and offline-first LLM enrichment architecture (medium-high; library version metadata
unavailable, so no versions asserted). All in-vault evidence is line-cited above. No code/runtime
validation possible in this no-code phase. Every recommendation is propose-only and ratify-gated.
