---
title: GD-0037 Offline Narration Tier for the AI-Narration MVP Pillar
status: draft
tags: [game-design, gddr, narrative, ai, llm, offline-first, webgpu, on-device, progressive-enhancement, mvp-pillar]
created: 2026-06-08
updated: 2026-06-08
type: gddr
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[GD-0013-narrative-inbox]]
  - [[GD-0018-ai-narrative-personas-and-dialogue]]
  - [[GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../60-Research/ai-narration-scope-freeze-and-fallback-coverage-2026-06-04]]
  - [[../60-Research/ai-narration-world-and-dialogue-mvp-2026-05-28]]
  - [[../20-Features/feature-ai-narration-mvp-pillar]]
---

# GD-0037: Offline Narration Tier for the AI-Narration MVP Pillar

> **Status `draft`.** A **product / scope** decision record, not an architecture-defect
> report. It does **not** reopen the ADR-0030 boundary — that boundary (runtime LLM
> never owns authoritative state) is best-practice and **stays** under every option
> here. This GD asks one narrow question: *when the player is offline, what tier of
> narration do we promise above the deterministic template baseline?* No option is
> accepted — Nico ratifies the scope call (decision gate, `90-Meta/collaboration-and-decision-protocol.md`).

## Why this exists

AI narration is a named **MVP pillar** ([[../20-Features/feature-ai-narration-mvp-pillar]]),
and FMX-88 already froze its scope: optional LLM prose may *phrase* committed facts on the
surfaces in `ai-narration-scope-freeze-and-fallback-coverage` §3, while a **deterministic
template** is the guaranteed, CI-enforced fallback for every prose point. That fallback
manifest is the load-bearing safety contract and is untouched here.

The gap is experiential, not structural. The cloud LLM enhancement runs through OpenRouter
(ADR-0030) and is therefore **online-only**. The game is **offline-first** (ADR-0002) and
cloud sync is narrowly scoped (ADR-0090), so a fully offline player today gets *template-only*
narration — the marquee pillar visibly flattens exactly when a manager is most immersed (a
long offline season run, a flight, a commute). No on-device enhancement path has ever been
weighed. The question is whether that flattening is acceptable for MVP, or whether a
**capability-gated on-device tier** should sit *between* templates and the cloud LLM.

This is squarely the kind of scope/gameplay call the decision gate reserves for Nico: it
changes the felt quality of an MVP pillar and would pull a new class of dependency (in-browser
inference) into the product surface.

## The three-tier mental model

The proposal does **not** flatten the existing two-tier model; it inserts a middle rung:

| Tier | Availability | Role | Status |
|---|---|---|---|
| **T0 Deterministic template** | Always (offline + online) | The **guaranteed** narration. Renders every prose point with no provider. | Frozen baseline (FMX-88). **Never replaced** under any option. |
| **T1 On-device WebGPU prose** | Offline *and* online, **capability-gated** | Best-effort cosmetic enrichment when the device can run it. Phrases committed facts only. | The subject of this GD (Option B). |
| **T2 Cloud LLM (OpenRouter)** | Online only | Richest enhancement; the FMX-88 surface line. | Unchanged (ADR-0030). |

The boundary rule is identical for T1 and T2: it may *phrase* a scene, never create the
scene's facts, options, effects, IDs or state transitions. T0 must still render every fixture
with inference disabled — so T1 inherits the whole fallback manifest unchanged, it just has
*one more reason* to fall back (no WebGPU / device too weak / cold-start budget exceeded).

## Options considered

### Option A — Template-only offline; cloud LLM is the only enhancement tier

Accept the status quo. Offline narration is T0 template-only; the LLM enrichment is an
online-only luxury (T2). Simplest possible scope: nothing new to pin, nothing new to test
beyond what FMX-88 already mandates, zero new dependency surface, zero new device-capability
matrix to maintain.

- **Pro:** smallest footprint; no new library, version-pinning duty, or device support tier;
  the pillar's *facts and structure* are 100% intact offline (only the prose phrasing
  degrades).
- **Con:** the pillar visibly flattens offline — the one place offline-first players spend the
  most time. "AI narration" reads as "AI narration when you have signal," which undercuts the
  pillar's marketing and felt value.

### Option B — Add an optional, capability-gated on-device WebGPU tier (T1)

Introduce T1 between templates and cloud LLM: when the device exposes WebGPU (or a built-in
Prompt API) **and** passes a capability probe, render short cosmetic snippets on-device;
otherwise fall straight through to T0. Strictly progressive enhancement — **never** a
replacement for T0, and **never** allowed to own facts/effects (ADR-0030 holds verbatim).

- **Pro:** the pillar stays alive offline for capable devices — short, persona-flavoured prose
  on inbox items, post-match lines and key-event wording — without weakening the deterministic
  guarantee. Aligns with the offline-first identity (ADR-0002): the headline feature degrades
  *gracefully by capability*, not *cliff-edge by connectivity*.
- **Con:** real cost and real fragility. In-browser inference in early–mid 2026 is **best-effort
  only**, never production-reliable as a sole path (sources below):
  - **WebGPU coverage is fragmented**, especially on mobile — must feature-detect and fall back,
    cannot be assumed across clients.
  - **Model/VRAM ceiling is low**: ~0.5–3B quantized models are the realistic browser sweet spot;
    7B-class needs desktop GPUs with ~8–12 GB and is unrealistic on iOS Safari / most phones.
  - **Cold-start / download cost**: model assets are tens-to-hundreds of MB (multi-GB for larger
    models); first-run init is multi-second-plus, mitigated only by Cache Storage / IndexedDB
    caching across sessions — itself a PWA storage-budget concern (cross-check `60-Research/performance-budgets`).
  - **API churn**: WebLLM (MLC), transformers.js (ONNX Runtime Web) and the Chrome Prompt API
    (Gemini Nano) are all evolving and Chrome-locked for the built-in path; no cross-browser
    standard.
  - Therefore B **must not** name or pin a library inside this GD. It is gated behind a
    **dedicated version-pinning + device-capability research pass** (per the global "verify latest
    stable via context7/Ref, never assume" rule) producing a draft ADR before any dependency lands.

### Option C — Defer entirely; revisit after MVP playtest evidence

Ship MVP on Option A and explicitly park the on-device tier. Revisit only once playtests show
whether offline narration *quality* (not facts) actually matters to players, and once the 2026
WebGPU landscape settles further.

- **Pro:** lets evidence, not speculation, justify a fragile dependency; keeps MVP lean; the
  WebGPU/model landscape is moving fast enough that a 2026-H2 re-check may be materially better.
- **Con:** the pillar ships in its flattened offline form; a later retrofit of a capability-gated
  tier re-touches the narration render path and provenance/telemetry after it has stabilised.

## Recommendation

**Nico's product/scope call** — confidence **low** (this is a felt-quality + roadmap-priority
judgement, not a correctness question, and the external landscape is genuinely in flux).

If the offline degradation of the pillar is considered a meaningful product weakness, **Option B**
is the principled direction *because* it preserves the deterministic guarantee while restoring the
pillar offline — but B is **conditional**: it requires a **dedicated version-pinning +
device-capability research pass first** (latest stable WebLLM / transformers.js / Prompt-API,
real VRAM + mobile-WebGPU support matrix, PWA storage budget, cold-start UX) landing as a draft
ADR before any library is pinned. If offline prose quality is judged a "nice-to-have," **Option C**
(defer, gather playtest evidence) is the disciplined default and keeps MVP lean. **Option A** is
the floor — acceptable only if we are comfortable marketing the pillar as effectively online-gated.

Under **every** option the **deterministic template (T0) remains the guaranteed baseline** and the
**ADR-0030 boundary is unchanged**.

## Out of scope / non-goals

- Reopening ADR-0030 (LLM out of authoritative state) — explicitly **not** in scope; it holds for
  T1 exactly as for T2.
- Naming or pinning any inference library — deferred to the B research pass (would land as a draft ADR).
- Generated-text **export/share** — already excluded for MVP (FMX-88 D4); unaffected here.
- Authoritative narration (facts, options, effects, IDs) — always deterministic, never any LLM tier.

## Open questions for the research pass (only if Option B is pursued)

1. Real device-capability matrix: which WebGPU/Prompt-API tiers clear a quality bar for short
   persona-flavoured snippets, and what is the fall-through probe?
2. Storage budget: model caching vs the PWA's existing offline asset/save budget
   (`60-Research/performance-budgets`).
3. Provenance/telemetry: does T1 reuse the FMX-88 `source: llm` provenance schema with a new
   `provider: on-device` marker, or a distinct `source` value? (Article 50 disclosure implications.)
4. Determinism posture: T1 is cosmetic-only, so it stays outside authoritative state/replay — but
   confirm it is excluded from any save/replay/audit hash exactly as T2 is.
5. Re-check cadence: if deferred (Option C), when does the WebGPU landscape get re-evaluated?
