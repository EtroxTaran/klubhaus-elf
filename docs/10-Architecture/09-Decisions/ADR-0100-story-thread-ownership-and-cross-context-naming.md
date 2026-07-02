---
title: ADR-0100 Story-thread ownership and cross-context naming (StoryThread vs CoverageThread; storyThreadId as correlation key)
status: accepted
tags: [adr, architecture, ddd, narrative, media-ecology, story-thread, bounded-context, correlation-key, ownership, fmx-105]
context: [narrative-dialogue, media-ecology]
created: 2026-06-08
updated: 2026-06-11
type: adr
binding: false
amends: [[ADR-0076-narrative-newsworthiness-event-contracts]], [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
supersedes:
superseded_by:
related:
  - [[ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[ADR-0065-narrative-media-press-content-ownership]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0018-systemic-events-and-player-lifecycle]]
  - [[ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../bounded-context-map]]
  - [[../../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]]
  - [[../../60-Research/media-outlet-operational-behaviour-2026-06-07]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0100: Story-thread ownership and cross-context naming (StoryThread vs CoverageThread; storyThreadId as correlation key)

> **Open Question closed (FMX-211 D8, decided 2026-06-22) — "C-lite".** D1=A (per-context
> aggregates: `StoryThread`@Narrative, `CoverageThread`@Media Ecology) stands. The shared
> lifecycle enum `emerging → heating → climax → resolved` gets **one canonical
> Published-Language home** in the cross-producer effect-intent/PL catalog
> ([[ADR-0126-cross-producer-effect-intent-taxonomy]]), referenced by both contexts — **not**
> a shared aggregate/kernel and **no** phase-correlation contract (GD-0013 needs none; the two
> state machines advance independently; `storyThreadId` correlates identity, not phase). This
> removes the enum-drift risk without re-opening D1=A.

> **Recorded as a partial supersession / amendment (Nico, 2026-06-11, FMX-143).** This ADR
> **amends** [[ADR-0076-narrative-newsworthiness-event-contracts|ADR-0076]] and
> [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour|ADR-0085]] — it replaces
> **only their thread-ownership / thread-naming portions** (see Status history below); both
> predecessors remain `accepted` for everything else. The 2026-06-08 ledger shorthand
> "0076/0085→0100" is annotated accordingly in
> [[../../40-Execution/ratification-status-inventory-2026-06-11|the status inventory]]
> (amendment pattern per ADR-0095/0097/0098 precedent; the ledger itself is unchanged as a
> scribe record).

## Status

accepted

> Adopted `accepted` 2026-06-08 — authored and ratified in the same sweep
> ([[decision-queue-2026-06-08-ratified|ledger]], PR #153); body previously read `draft`. Body
> status reconciled to the frontmatter SSOT (ADR-0092) on 2026-06-11 (FMX-143).

> **History (pre-ratification banner, demoted 2026-06-11 per ADR-0092 / FMX-143):**
> **`draft` / `binding: false`.** Authored 2026-06-08 during the open-decisions audit. This
> ADR resolves a **cross-ADR collision** between two still-`proposed` ADRs: ADR-0076 and
> ADR-0085 both attach first-class meaning to the **same name** (`storyThreadId` / thread)
> across **two different bounded contexts**, with **no stated owner of thread origination**.
> It **supersedes only the thread-ownership / thread-naming portions** of ADR-0076 and
> ADR-0085 — every other decision in those ADRs (event envelope, four publication facets,
> outlet model, cadence, stance drift, determinism, RNG label) stands unchanged. It does
> **not** flip any context to accepted, does **not** implement schemas, and does **not** edit
> `bounded-context-map.md` (ratify gate, per [[../../90-Meta/vault-governance]]). Awaiting
> Nico ratify.

## Date

- Drafted: 2026-06-08 (open-decisions audit, FMX-105 follow-on)

## Context

Two parallel proposed ADRs introduce a "story thread" concept, but they do not agree on what
it is, who owns it, or who creates it:

- **ADR-0076 (Narrative Newsworthiness Event Contracts)** uses `storyThreadId` as a field on
  the `NewsworthyEventEnvelope` and on `NarrativeNewsFactProjection`, where it is a
  **grouping / supersession key**: "grouped and superseded by `storyThreadId`". In ADR-0076
  the thread is *implicit* — an ID that correlates and supersedes facts inside Narrative's
  rebuildable projection. No aggregate, no lifecycle, no origination rule.
- **ADR-0085 (Media Ecology Context)** promotes the thread to a **first-class
  `NarrativeThread` aggregate** owned by **Media Ecology**, with an explicit lifecycle
  (`emerging → heating → climax → resolved`), its own events (`NarrativeThreadOpened` /
  `Advanced` / `Resolved`), and it "aligns with ADR-0076 `storyThreadId`". ADR-0085 even
  names its aggregate **`NarrativeThread`** — i.e. it plants a **Narrative-named** aggregate
  inside the **Media Ecology** context.

The collision has three concrete edges:

1. **Shared-named aggregate across contexts.** Media Ecology owns a first-class aggregate
   literally named `NarrativeThread`, while Narrative ([[ADR-0054-narrative-context-and-ai-narration-framework]],
   [[ADR-0065-narrative-media-press-content-ownership]]) is the context whose ubiquitous
   language already owns "narrative". A first-class aggregate carrying another context's
   ubiquitous-language word, owned in two places under one name, is the textbook
   shared-kernel / model-leakage smell (grounding below). Sharing a **correlation key** is
   idiomatic; sharing a **named aggregate** is not.
2. **No stated owner of thread origination.** ADR-0076 treats threads as emergent grouping;
   ADR-0085 opens/advances/resolves threads from Media Ecology. Neither says **who creates a
   thread** — i.e. who decides "these facts are one ongoing story". That is a player-facing
   *story* concept, not an outlet-simulation concept; leaving origination unowned is exactly
   the seam ADR-0085 itself flagged as the "two owners of media" risk.
3. **Two adjacent ownership ambiguities ride along.** (a) The **X2 "two owners of media"
   seam**: ADR-0065 gives Narrative `PressPublicationPolicy` (content authoring), while
   ADR-0085 gives Media Ecology `cadenceProfile` / per-edition budget / salience selection
   (outlet behaviour) — these are different concerns that must not collapse into one owner,
   and the hand-off artifact is unstated. (b) The shared **`WorldAiMgmtRng:media:*`**
   namespace ([[ADR-0071-ai-world-simulation-context-and-drift-contract]], ADR-0085 §Open
   ratification item) needs a single named owner so the sub-label is not minted twice.

DDD grounding (Evans / Vernon / Khononov, cross-checked via Perplexity 2026-06-08; see
Martin Fowler, *BoundedContext*, and the DDD-practitioners context-mapping glossary):

- Each bounded context owns its own model and aggregate roots; two contexts using **different
  names** for "the same real-world thing", linked only by a **shared identifier / correlation
  key**, is the expected, idiomatic case.
- Re-using the **same aggregate name and structure** across contexts is effectively a
  **Shared Kernel** — a high-friction, high-coordination relationship that DDD treats as a
  deliberate exception, never a default; when not deliberate it is **model leakage** and a
  design smell.
- **Ubiquitous Language is per-context**: per-context renaming of the local model (different
  aggregate names in each context, shared correlation ID) is the recommended approach;
  integration goes through Published Language / events / ACL, not a shared domain model.

This is **not** relitigating ADR-0076 or ADR-0085. Their substantive content is sound. The
only open question is the **ownership and naming of the thread concept and its two adjacent
seams**, which neither ADR can resolve alone because it spans both.

Scope:

- Who owns **thread origination** (creating a thread / declaring facts one story).
- The **naming** of the per-context thread models (resolve the shared `NarrativeThread` name).
- The status of **`storyThreadId`** (correlation key vs shared aggregate).
- Drawing the **X2 media-ownership seam** (Narrative content vs Media Ecology behaviour) and
  naming the single hand-off artifact.
- Naming the **owner of the `WorldAiMgmtRng:media:*`** namespace.

Out of scope (unchanged, still owned by the named ADRs):

- The ADR-0076 event envelope, metadata block and four publication facets.
- The ADR-0085 `MediaOutlet` model, `MediaEdition`, cadence/stance/budget policy, determinism
  rules and the RNG-stream *family* choice (`WorldAiMgmtRng` vs `MediaRng`) — only the
  *namespace owner* is named here.
- Salience weights / magnitudes (→ FMX-52 calibration).
- Runtime code, package layout or dependency changes.

## Decision options

### D1 — Thread ownership, naming and `storyThreadId` status

| Option | Description | Trade-off |
|---|---|---|
| **A. Narrative owns origination; per-context aggregate names; `storyThreadId` is correlation-only** | **Narrative** owns **thread ORIGINATION** as a first-class `StoryThread` aggregate (declares facts a story, owns the player-facing arc). **Media Ecology renames** its aggregate to **`CoverageThread`** (the outlet-side coverage arc of a story: how outlets escalate/cool coverage). Both reference the **same `storyThreadId`** as a **correlation key only** — no shared aggregate. The X2 seam is drawn explicitly and `OutletPublishedStory` is the single Media→Narrative hand-off. `WorldAiMgmtRng:media:*` is cross-referenced to ADR-0071 as namespace owner. | **Recommended.** Removes the model-leakage (no shared-named aggregate); one clear origination owner; puts the player-facing *story* concept in the *story* context and the outlet *coverage* concept in the *simulation* context. Idiomatic correlation-key sharing per DDD grounding. Cost: touches two proposed ADRs and renames one aggregate. |
| B. Media Ecology sole thread owner; Narrative read-only | Media Ecology keeps `NarrativeThread` and owns origination; Narrative only consumes. | Puts a **player-facing story concept inside a simulation context**; keeps the leaked name; makes Narrative (the story context) a downstream renderer of its own core concept. Weaker DDD fit; entrenches the smell rather than resolving it. |
| C. Thin shared `StoryThread` correlation contract owned by neither | A tiny Published-Language contract (just `storyThreadId` + a shared lifecycle enum) owned as a shared kernel by neither context. | Cleanest *vocabulary* (one definition of the lifecycle enum), but adds a standing shared-kernel artifact for essentially **one ID + one enum**, with the coordination cost DDD warns about — overhead disproportionate to the payload. |

### D2 — X2 media-ownership seam (resolve "two owners of media")

| Option | Description | Trade-off |
|---|---|---|
| **A. Split by concern + single hand-off artifact** | **Narrative** owns press/media **content authoring** (`PressPublicationPolicy`, `ToneProfileLibrary`, article/conference templates — ADR-0065, unchanged). **Media Ecology** owns outlet **operational behaviour** (`cadenceProfile`, per-edition budget, salience selection — ADR-0085, unchanged). The single cross-context hand-off is **`OutletPublishedStory`**: Media Ecology decides *what/when/how prominently* an outlet covers a fact; Narrative renders *the words*. | **Recommended.** The two concerns have different change-rhythms (editorial behaviour vs prose templates); a single named hand-off event prevents the seam from blurring. Consistent with ADR-0085's own "no two owners of media" warning. |
| B. Leave the seam implicit | Keep both policies as today without naming the hand-off. | The exact ambiguity ADR-0085 flagged as a risk; invites a future god-context. |

### D3 — `WorldAiMgmtRng:media:*` namespace owner

| Option | Description | Trade-off |
|---|---|---|
| **A. Cross-reference ADR-0071 as namespace owner** | The `WorldAiMgmtRng:media:*` sub-label family (ADR-0085 §Open ratification item) is documented as owned by the **`WorldAiMgmtRng`** stream defined in ADR-0071; Media Ecology consumes it via the versioned sub-label, it is not a new top-level stream. | **Recommended.** Matches ADR-0018 §3 stream discipline and the open-decisions sweep recommendation (reuse, no new top-level `*Rng`). Single owner; no double-mint. |
| B. Defer | Leave it as the open ratification item in ADR-0085. | Keeps the namespace owner unnamed across two ADRs; the collision this ADR exists to remove persists. |

## Decision (proposed default)

**D1 = A, D2 = A, D3 = A.** Ratified 2026-06-08 (#153); recorded as an amendment of ADR-0076/0085 on 2026-06-11 (FMX-143, H1).

- **Narrative owns thread origination** via a first-class **`StoryThread`** aggregate. A
  `StoryThread` is the player-facing arc — "this injury, this contract saga, this transfer
  rumour are one ongoing story" — created and superseded inside Narrative (this absorbs and
  makes explicit the implicit grouping/supersession that ADR-0076 described).
- **Media Ecology renames `NarrativeThread` → `CoverageThread`**, the **outlet-side coverage
  arc** (`emerging → heating → climax → resolved`) — unchanged lifecycle and events, only the
  aggregate name changes. `CoverageThread` describes how the outlet ecology escalates/cools
  its coverage of a story; it is *not* the story.
- **`storyThreadId` is a correlation key only.** Both `StoryThread` (Narrative) and
  `CoverageThread` (Media Ecology) carry the same `storyThreadId`; neither aggregate is shared
  and neither joins into the other's tables. Cross-context flow is Published-Language events
  ([[ADR-0028-postgres-transactional-outbox]]), not a shared model.
- **X2 seam drawn (D2=A):** content authoring = Narrative; outlet behaviour = Media Ecology;
  `OutletPublishedStory` is the single hand-off.
- **RNG namespace (D3=A):** `WorldAiMgmtRng:media:*` is owned by ADR-0071's `WorldAiMgmtRng`
  stream.

### Naming map (the only renames)

| Concept | Old (in ADR-0076 / 0085) | New (this ADR) | Owner |
|---|---|---|---|
| Player-facing story arc | implicit grouping by `storyThreadId` (ADR-0076) | `StoryThread` aggregate | **Narrative** |
| Outlet coverage arc | `NarrativeThread` aggregate (ADR-0085) | `CoverageThread` aggregate | **Media Ecology** |
| Cross-context link | `storyThreadId` | `storyThreadId` (unchanged) | correlation key, owned by neither |
| Media coverage events | `NarrativeThreadOpened/Advanced/Resolved` (ADR-0085) | `CoverageThreadOpened/Advanced/Resolved` | **Media Ecology** |

Everything else in ADR-0076 and ADR-0085 is preserved verbatim.

## Invariants

| # | Invariant |
|---|---|
| ST1 | A first-class thread aggregate carrying another context's ubiquitous-language word is forbidden; each context names its own thread model (`StoryThread` in Narrative, `CoverageThread` in Media Ecology). |
| ST2 | `storyThreadId` is a **correlation key** shared across contexts; it is owned by no aggregate and creates no shared kernel. No context joins another's thread tables to read it. |
| ST3 | **Narrative** is the sole originator of a `StoryThread` (declares facts one story; owns supersession). Media Ecology never originates a story; it opens a `CoverageThread` against an existing `storyThreadId`. |
| ST4 | Content authoring (`PressPublicationPolicy`, tone, templates) is **Narrative**; outlet operational behaviour (`cadenceProfile`, budget, salience) is **Media Ecology**; the single hand-off is `OutletPublishedStory` (ST = the X2 seam). |
| ST5 | The `WorldAiMgmtRng:media:*` sub-label namespace is owned by ADR-0071's `WorldAiMgmtRng`; no new top-level `*Rng` is minted (ADR-0018 §3 discipline). |
| ST6 | This ADR changes **only** thread ownership/naming and the two adjacent seams; the ADR-0076 envelope/facets and ADR-0085 outlet model/determinism are unchanged. |

## Rationale

DDD authorities (Evans, Vernon, Khononov; cross-checked 2026-06-08) are explicit: two
bounded contexts referencing the same real-world thing should share **only an identifier**
and keep **separate, independently-named models**; a **same-named, same-structure aggregate
in two contexts is a Shared Kernel** (deliberate, high-coordination) or, when unintended,
**model leakage** and a smell. ADR-0085 planting a `NarrativeThread` aggregate inside Media
Ecology — using Narrative's ubiquitous word — is the unintended case. Option A resolves it
with the idiomatic move: per-context names (`StoryThread` / `CoverageThread`) over a shared
`storyThreadId` correlation key, integrated by events.

Origination belongs to Narrative because a *story* ("these facts are one arc the player
follows") is a Narrative concept; an outlet's *coverage* of that arc is the Media Ecology
concept. Option B inverts this (story concept inside a simulation context); Option C is the
purest vocabulary but pays a standing shared-kernel coordination cost for one ID and one
enum, which the grounding warns against. Landing this **before** narrative/media
implementation means the rename is a docs edit, not a schema/event migration across two
contexts.

## Consequences

Positive:

- Removes the model-leakage / shared-kernel smell; each context owns an independently-named
  thread model over a shared correlation key.
- One unambiguous **origination owner** (Narrative) for the player-facing story arc.
- The **media-publication seam** (Narrative content vs Media Ecology behaviour) and its single
  hand-off (`OutletPublishedStory`) become explicit.
- The shared **`WorldAiMgmtRng:media:*`** namespace gets one named owner (ADR-0071).
- Cheap now (docs rename) vs expensive later (cross-context event/schema migration).

Negative / constraints:

- Touches **two proposed ADRs**; the supersession must be read as **partial** — only the
  thread-ownership/naming portions are replaced, the rest of ADR-0076 and ADR-0085 stands.
- Media Ecology's `NarrativeThread*` event names rename to `CoverageThread*`; any draft
  references must follow the naming map.
- A reviewer must verify nothing in ADR-0076/0085 outside the thread concern is disturbed
  (risk below).

## Risks

- **Over-supersession.** The biggest risk is reading "supersedes ADR-0076, ADR-0085" as
  replacing the whole ADRs. It does **not**: it supersedes only the thread-ownership and
  thread-naming portions (and names the two adjacent seam owners). The envelope, facets,
  outlet model, cadence, stance drift, determinism and RNG-family choice remain the authority
  of ADR-0076 / ADR-0085. Invariant ST6 encodes this.
- **Map/ADR drift.** Until ratified, ADR-0085 still says `NarrativeThread`; consumers should
  treat the naming map here as the target once Nico ratifies (no existing file is edited).

## Open questions

- **D1: A (per-context names over a shared `storyThreadId` correlation key) vs C (a thin
  shared `StoryThread` correlation contract owned by neither context)?** A is recommended
  (idiomatic, no standing shared-kernel artifact); C is defensible if Nico wants one canonical
  definition of the thread-lifecycle enum living outside both contexts. This is the single
  decision the recommendation is least certain about.

## Supersedes

**Partial supersession — thread-ownership / thread-naming portions only:**

- **ADR-0076** — supersedes its treatment of `storyThreadId` as an implicit Narrative
  grouping/supersession concept by making **`StoryThread`** an explicit Narrative-owned
  aggregate and `storyThreadId` an explicit correlation key. The ADR-0076 envelope, metadata
  block, four publication facets and `NarrativeNewsFactProjection` are **unchanged**.
- **ADR-0085** — supersedes its **`NarrativeThread`** aggregate name (→ **`CoverageThread`**)
  and its `NarrativeThread*` event names (→ `CoverageThread*`), and confirms Media Ecology is
  **not** the thread originator. The ADR-0085 `MediaOutlet` model, `MediaEdition`, cadence /
  stance / budget policy, determinism rules and RNG-stream family choice are **unchanged**;
  the `WorldAiMgmtRng:media:*` open item is closed in favour of ADR-0071 ownership (D3=A).

The superseded files are **not edited** (supersession is expressed only here, per
[[../../90-Meta/vault-governance]]).

## Related Docs

- [[ADR-0076-narrative-newsworthiness-event-contracts]] - source of `storyThreadId` grouping; thread-ownership portion superseded.
- [[ADR-0085-media-ecology-context-and-outlet-operational-behaviour]] - source of the `NarrativeThread` aggregate; renamed to `CoverageThread`.
- [[ADR-0065-narrative-media-press-content-ownership]] - `PressPublicationPolicy` / content-authoring side of the X2 seam (unchanged).
- [[ADR-0054-narrative-context-and-ai-narration-framework]] - Narrative context that owns story origination.
- [[ADR-0071-ai-world-simulation-context-and-drift-contract]] - `WorldAiMgmtRng` stream; named owner of the `:media:*` sub-label namespace.
- [[ADR-0019-modular-monolith-ddd]] - logical contexts, no shared tables, events over shared models.
- [[ADR-0027-postgres-data-model]] - per-context storage isolation (no cross-context joins on `storyThreadId`).
- [[ADR-0028-postgres-transactional-outbox]] - the Published-Language transport between `StoryThread` and `CoverageThread`.
- [[ADR-0089-bounded-context-portfolio-reconciliation]] - Narrative (#21) and Media Ecology (#28) catalog entries this seam sits between.
- [[../bounded-context-map]] - target of any future (ratify-gated) naming clarification.
- [[../../60-Research/newsworthiness-event-publication-semantics-2026-06-04]] / [[../../60-Research/media-outlet-operational-behaviour-2026-06-07]] - grounding for the two superseded ADRs.
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A (X2 seam, media RNG namespace M1).
- DDD grounding (Perplexity, 2026-06-08): Fowler *BoundedContext*; shared correlation key idiomatic, shared-named aggregate = Shared-Kernel/model-leakage; Ubiquitous Language per context → per-context aggregate naming.
