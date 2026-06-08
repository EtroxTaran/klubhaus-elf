---
title: GD re-audit — cluster G7 (Narrative / AI-world / Dialogue / Media / Personas / Roguelite)
status: draft
tags: [research, audit, gd-re-audit, g7, narrative, ai-world, dialogue, media-ecology, personas, roguelite, llm, determinism]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../50-Game-Design/GD-0010-ai-world]]
  - [[../50-Game-Design/GD-0013-narrative-inbox]]
  - [[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue]]
  - [[../50-Game-Design/GD-0024-ai-world-drift-algorithm]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0034-media-outlet-ecology-model]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../10-Architecture/09-Decisions/ADR-0030-llm-out-of-authoritative-state]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../10-Architecture/09-Decisions/ADR-0065-narrative-media-press-content-ownership]]
  - [[../10-Architecture/09-Decisions/ADR-0071-ai-world-simulation-context-and-drift-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0076-narrative-newsworthiness-event-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0078-player-discipline-suspension-contracts]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../10-Architecture/09-Decisions/ADR-0085-media-ecology-context-and-outlet-operational-behaviour]]
  - [[../10-Architecture/09-Decisions/ADR-0100-story-thread-ownership-and-cross-context-naming]]
  - [[../50-Game-Design/GD-0037-offline-narration-tier-on-device-webgpu]]
  - [[adr-re-audit-master-2026-06-08]]
  - [[determinism-and-replay]]
  - [[../90-Meta/collaboration-and-decision-protocol]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# GD re-audit — cluster G7 (Narrative / AI-world / Dialogue / Media / Personas / Roguelite)

Decision-readiness audit of the seven G7 GDs against the mature vault, for the planning-mode
ratification sweep. All seven were reset to `status: draft` on 2026-05-27, so each needs an
explicit disposition even when the content is sound. Scope: AI-world goal
([[../50-Game-Design/GD-0010-ai-world|0010]]), narrative inbox
([[../50-Game-Design/GD-0013-narrative-inbox|0013]]), AI narrative personas & dialogue
([[../50-Game-Design/GD-0018-ai-narrative-personas-and-dialogue|0018]]), world-drift algorithm
([[../50-Game-Design/GD-0024-ai-world-drift-algorithm|0024]]), dialogue intent taxonomy
([[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix|0028]]), media-outlet ecology
([[../50-Game-Design/GD-0034-media-outlet-ecology-model|0034]]), manager-archetype roguelite
([[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression|0019]]).

**Decision gate ([[../90-Meta/collaboration-and-decision-protocol]]): every recommendation below
is options + a recommendation + confidence, for Nico to ratify. Nothing here is accepted; this
note edits no existing file.** Ground-truth constraints respected: LLM out of authoritative state
(ADR-0030), offline-first PWA (ADR-0002). The whole cluster is built *around* the LLM-out-of-state
boundary, so the audit checks that each GD honours it rather than re-litigating it.

## Headline findings

1. **Two-layer structure: a goal GD on top of resolution GDs.** GD-0010 (AI-world) and GD-0013
   (narrative inbox) are the original 2026-05-17 *direction* records; their concrete open items
   have since been resolved into newer, sharper GDs (GD-0024 world-drift, GD-0018 personas/dialogue,
   GD-0028 intent taxonomy, GD-0034 media ecology, plus GD-0023 AI-club-economy). The two
   originals are best ratified as **direction + pointer**, not re-expanded.
2. **The cluster's only genuinely open architecture seam is already named in the ADR master sweep:
   story-thread ownership (ADR-0100) and the media RNG label.** GD-0018/0028/0034 all touch the
   Narrative↔Media-Ecology boundary; the master sweep ([[adr-re-audit-master-2026-06-08]]) already
   proposes **ADR-0100** to resolve `StoryThread` (Narrative origination) vs `CoverageThread` (Media
   Ecology) with `storyThreadId` as correlation-only, and flags the `WorldAiMgmtRng:media:*`
   sub-label vs a dedicated `MediaRng` open item. G7 does **not** need to re-decide these — it
   should `dependsOn` them.
3. **Determinism discipline is uniformly strong.** Every GD that emits world state (0024 drift,
   0028 effects, 0034 editions) routes RNG through a labelled stream, fixes numbers to FMX-52
   calibration, and keeps prose presentation-only. This is exactly the seeded-variance-over-pure-
   determinism posture Nico has repeatedly endorsed.
4. **The legal gate (EU AI Act Article 50) in GD-0018 is sound and slightly conservative** — see
   §Research. First-exposure disclosure + persistent settings/help is the right posture; the live
   refinement is the "evidently fictional/creative work" lighter-touch carve-out and a possible
   machine-readable-marking obligation, both of which GD-0018 already partly anticipates
   (per-output provenance).

---

## Per-GD verdicts

### GD-0010 — AI Managers & World Simulation — **sound as a direction GD; supersede-by-pointer**

Disposition: **ratify-with-amendment** (low-cost: convert to direction + explicit pointer).
Confidence: **high**.

Evidence: this is the original 2026-05-17 high-level goal ("a living league that rises and falls
across decades; avoid the Club Boss late-game flatline; AI bidding pressure on transfers"). The
goal is correct and uncontested. Its three open Wave-2 items have all since landed elsewhere and
the GD's own 2026-06-01 / 2026-06-05 banners already record this: **R2-04/R2-06 economy slice →
GD-0023** (AI-club economy); **R2-06 world-drift → GD-0024** (this cluster); **R2-08 AI RNG stream
→ `WorldAiMgmtRng`** locked in [[determinism-and-replay]]; **late-game flatline measurement → the
FMX-90 KPI battery**, with dynasty/board/bankruptcy ratified via ADR-0079/GD-0030.

Issue: the only stale fingerprint is `related:` still pointing at **ADR-0009 (cursor-orchestration)
"AI behaviour epics"** as a feed-target — ADR-0009 is the stale Cursor-only ops ADR the C9 sweep
recommends superseding; AI-behaviour work is not an ADR-0009 concern. Otherwise the GD is a clean
umbrella whose substance now lives in GD-0023/0024/0018.

Recommendation: ratify the goal **as direction**, and on ratification (i) drop the ADR-0009 feed
link, (ii) add a one-line "resolved-into" pointer block (GD-0024 drift, GD-0023 economy, GD-0018
narrative personas, FMX-90 flatline metric) so a reader lands on the live records. No redesign;
this is a hub-hygiene amendment. The one open D-question is whether to keep GD-0010 as a living
umbrella or formally mark it superseded-in-substance by its children.

### GD-0013 — Narrative, Inbox & Events — **sound; status-lifecycle drift**

Disposition: **ratify-with-amendment**. Confidence: **high**.

Evidence: the "Decided / strong" block (inbox-as-feed unified narrative engine, Dexie-backed
offline-survivable, Accept/Decline/Defer/Snooze cards; humour-in-copy-not-mechanics; press
conferences post-MVP; the **hard content boundary** excluding doping mini-game / "Babe of the
Month" / illegal accounting / gambling-style sponsor draws) is durable, IP-safe, and consistent
with the memory rule on tone and the ADR-0007 naming schema. The 2026-05-27 banner correctly
forward-links the Runtime-LLM re-evaluation to GD-0018/ADR-0030.

Issue: **status-lifecycle drift** (the same governance gap the C9 sweep flagged cluster-wide).
Front-matter says `status: draft` + `binding: true`; the body `## Status` says **`approved`** with
an "Approved — ratified design direction" banner; the phase banner reopened everything to draft.
Three conflicting truths in one file. The *content* is not in question — only which lifecycle state
it is in under the reopen.

Recommendation: ratify the Decided/strong block as-is; the open D-question is purely the lifecycle
representation (resolved vault-wide by the proposed status-reconciliation GD the C9 sweep names,
not by re-deciding narrative design). The hard content boundary should be explicitly **carried
forward unchanged** — it is the load-bearing legal/tone guardrail for the whole cluster.

### GD-0018 — AI Narrative Personas & Dialogue — **sound; the cluster keystone; ratify-with-amendment**

Disposition: **ratify-with-amendment**. Confidence: **medium-high**.

Evidence: a thorough, well-grounded keystone. It correctly fixes the boundary (simulation facts
authoritative; traits may affect gameplay but generated prose may not; dialogue is intent-based not
free chat; match-ticker LLM is not match AI; template fallback mandatory + CI-manifested; no PII to
LLMs; first-exposure disclosure + provenance; Narrative gets its own context owner). The FMX-88
(Broad Full Dialogue, D1–D4) and FMX-87 (intent effect line, D1–D3) tables record Nico's live
choices. This is the spine the rest of the cluster hangs from and it honours ADR-0030 cleanly.

Issues (all amendments, not redesign):
- **Article 50 release gate is recorded as a blocker, not closed** (D3 = Nico + external legal
  review) — correct and conservative. The targeted lookup (§Research) confirms first-exposure +
  persistent disclosure is the right posture and that Article 50 transparency obligations apply
  **from 2 August 2026**. The live refinement: in-game *evidently fictional* text likely gets the
  Act's lighter-touch creative-work disclosure, and providers may owe a **machine-readable marking**
  where feasible — GD-0018's per-output provenance partially anticipates this but the GD should name
  the machine-readable-marking obligation explicitly.
- **Persona/relationship dependency on ADR-0052** (People context) is `draft`; GD-0018 correctly
  treats People-sourced facts as proposal inputs until ratified. This is a real `dependsOn`.
- **Story-thread / media seam** with ADR-0076/0085 is exactly the X2/E-5 collision the master sweep
  resolves via **ADR-0100** — GD-0018 should `dependsOn` it rather than carry an independent thread
  model.
- Stale internal pointer: `related:` lists `[[match-engine]]` and `[[GD-0010-ai-world]]` as bare
  links; harmless but worth normalising on ratification.

Recommendation: ratify the Decided/strong + FMX-88/FMX-87 frozen lines as-is; the open D-questions
are (1) the Article 50 disclosure-mechanics shape (does MVP ship machine-readable marking now or
defer with the no-export rule?) and (2) confirming this GD `dependsOn` ADR-0052 and ADR-0100 rather
than owning persona/thread state. Both are scoping/sequencing, not design reversal.

### GD-0024 — AI World-Drift Algorithm — **sound; ratify-as-is (one bounded-context D-question)**

Disposition: **ratify-with-amendment** (single open scope item; otherwise clean).
Confidence: **high**.

Evidence: a strong, legible, replay-safe design. Structural & legible drift driven by visible
inputs (no hidden catch-up buff — the explicit anti-rubber-banding guarantee that GD-0010 demanded);
three MVP families (Rising Rival, Giant Collapse, Continental Era Shift); a clean season-end drift
loop with deterministic scoring, resistance modifiers, global caps + cooldowns, **labelled RNG only
for timing/shape inside eligible bands**, and self-contained `WorldDrift` events consumed by owning
contexts (it does not post money or own fixtures/ledgers/youth). Player-facing legibility (forecast
+ public "why" breakdown in Quick/Standard/Expert) directly answers GD-0010's flatline goal. All
constants routed to FMX-52; byte-identical sequence under identical seeds asserted. Feeds ADR-0071.

Issue: the GD itself flags the one genuinely open item — **whether "AI World Simulation" is ratified
as a bounded context or kept as a League/Club/Transfer orchestration policy.** This is the same
question ADR-0071 carries; FMX-91 had Nico pre-select "AI World Simulation as proposed bounded
context" (the 2026-06-03 banner), so the lean is already set, but it needs the formal ratify. The
secondary opens (per-confederation caps pre/post-MVP; `youthDiffusionHint` consumption) are
correctly deferred.

Recommendation: ratify the model; the open D-question is bounded-context-vs-policy (recommend
ratifying the bounded context per the FMX-91 lean and ADR-0089 catalog, so drift has a clear owner).
`dependsOn` ADR-0071. No relitigation of the drift mechanics.

### GD-0028 — Dialogue Intent Taxonomy & Effect Matrix — **sound; ratify-as-is**

Disposition: **ratify-as-is**. Confidence: **high**.

Evidence: the cleanest record in the cluster. It resolves GD-0018's "exact `DialogueIntent`
taxonomy per surface" with a full, well-ownered matrix across six surfaces (player, staff, board,
press/media, fan-rep, agent), an explicit causality rule (Narrative offers → player selects →
**owning domain** validates & applies → emits result → Narrative renders follow-up), banded effects
(`none`/`minor`/`moderate`/`major`/`critical`) with numbers deferred to FMX-52, a planning-level
`DialogueIntentSelected` command + domain-owned result events, persona influence constrained to
availability-gate + bounded-scale (never changes the effect owner, never promotes prose to state),
and eight invariants (D1–D8) that lock the boundary. FMX-87 D1–D3 chosen live by Nico. It is fully
consistent with ADR-0030/0054 and with GD-0018.

Issues: none material. Its three dependencies are correctly declared in-text: **ADR-0052** (People
persona ownership, draft) must settle before implementation; **FMX-82 / GD-0034** owns final
media-outlet cadence/reach/stance interactions with press/media intents; FMX-52 owns the numbers.
These are downstream sequencing, not defects.

Recommendation: ratify as-is as the proposed design layer. `dependsOn` GD-0018 (frame) and ADR-0052
(persona authority) — but the taxonomy/matrix itself needs no amendment. Numbers and content
fallbacks remain calibration/authoring debt, which is the correct state for a design GD.

### GD-0034 — Media-Outlet Ecology Model — **sound; ratify-with-amendment (RNG-label + thread seam)**

Disposition: **ratify-with-amendment**. Confidence: **medium-high**.

Evidence: a genre-aware, well-researched model: outlets as a small persistent opinionated cast with
memory (defeating the "interchangeable logos" pitfall), a five-dimension attribute vector
(Type/Stance/Reach/Reliability/Cadence) with type-archetype starting bands, a **deterministic pure
edition-selection** (`salience × bias-alignment × decay × −legal-risk + seeded noise`, stable-sort
+ eventId tiebreak, top-N above a floor), per-club "news gravity" as the coverage master dial,
inspectable `OutletStanceAdjusted` drift events, narrative threads, and the clean
Reach/Delivery/Feed separation. It correctly keeps Media out of authoritative effects (emits
coverage facts + advisory effect-intents; owning contexts apply morale/mood/pressure, per
ADR-0030/0076). It is the gameplay companion to ADR-0085 and pins shapes/directions with numbers →
FMX-52 behind `mediaEcologyModelVersion`. The IP-safe outlet naming ties to GD-0015/ADR-0007.

Issues (both already named upstream — this GD should depend, not decide):
- **RNG label open item** — the GD explicitly flags `WorldAiMgmtRng` media sub-label vs a dedicated
  `MediaRng` (an ADR-0085 open item). This is a small but real determinism-ownership call.
- **Narrative-thread seam** — GD-0034's "narrative threads" keyed to ADR-0076 `storyThreadId` is the
  exact `StoryThread` vs `CoverageThread` naming collision the master sweep resolves via **ADR-0100**
  (Narrative owns origination, Media Ecology renames its aggregate `CoverageThread`, `storyThreadId`
  correlation-only). GD-0034 must align to whichever ADR-0100 ratifies.

Recommendation: ratify the model; the open D-questions are (1) the media RNG label (recommend the
`WorldAiMgmtRng:media:*` sub-label to avoid stream proliferation, matching the master-sweep
cross-ref; a dedicated `MediaRng` only if the media volume justifies stream isolation) and (2)
confirm GD-0034 `dependsOn` ADR-0100 for thread naming. `dependsOn` ADR-0085, ADR-0076, ADR-0100.
The outlet→effect-intent taxonomy and authored outlet catalogues are correctly deferred follow-ups.

### GD-0019 — Manager-Archetype Roguelite Progression — **sound; ratify-as-is**

Disposition: **ratify-as-is**. Confidence: **high**.

Evidence: a disciplined, scope-honest record. MVP ships **hooks, not the full meta system**
(run-end facts + provisional `ManagerStyleSignals` + a mandatory minimal `PostRunReflection`);
manager identity is emergent-hybrid (behaviour-inferred, not a fixed class system); progress is
reflected not grinded (no in-run threshold checklists); perks live in a balance corridor with caps
+ prestige/challenge counterweight; **no soft perk affects starting finance in MVP** (D3). The
FMX-93 (G3) confirming revision pins D1–D4 = A,A,A,A and the crucial "authored-then-clustering-
validated" rule for the eventual taxonomy (not pure data-mining — grounded in roguelite-agency
research). The tactical signal is fully specified by ADR-0074 (EWMA h=15 + empirical-Bayes); the
five non-tactical coarse signals + 3-band confidence by ADR-0082; owner is Manager & Legacy
(ADR-0051). The ADR master sweep confirmed ADR-0051/0074/0082 sound. Determinism and FMX-52
calibration discipline are intact; the change-policy table cleanly separates playtest-tunable from
Nico-gated changes.

Issues: none material. Remaining opens (final taxonomy/naming; first prestige-ladder shape; whether
challenge runs badge async-group cosmetics) are all correctly **deferred post-MVP & Nico-gated**,
not unresolved design risk. This GD is a model of how to ratify a draft that intentionally defers
its endgame.

Recommendation: ratify as-is. `dependsOn` its feed-ADRs being ratified in the same pass (ADR-0051,
ADR-0074, ADR-0082) so the signal contracts have a home, but the GD design needs no amendment.

---

## Cross-GD issues within G7

- **Y1 — Two-layer goal/resolution structure (0010, 0013 on top of 0018/0024/0028/0034).** The two
  2026-05-17 originals are direction GDs whose concrete content now lives in newer records. Ratify
  them as direction + pointer; do not re-expand. Highest-leverage hygiene fix; zero design risk.
- **Y2 — Status-lifecycle drift (esp. GD-0013).** GD-0013's body says `approved` while front-matter
  says `draft` + `binding: true` under a phase that reopened everything. This is the same vault-wide
  governance gap the C9 ADR sweep flagged; it is resolved by the proposed status-reconciliation GD,
  not by re-deciding narrative design. No G7 content changes.
- **Y3 — Narrative↔Media story-thread seam → ADR-0100.** GD-0018 and GD-0034 both reference
  ADR-0076 `storyThreadId` and an internal thread model; the `StoryThread` (Narrative) vs
  `CoverageThread` (Media Ecology) ownership is resolved upstream by the proposed **ADR-0100**
  (master sweep §E-5/X2). G7 GDs `dependsOn` ADR-0100; they must not each own an independent thread
  aggregate.
- **Y4 — Media RNG label (`WorldAiMgmtRng:media:*` vs `MediaRng`).** GD-0034's own open item; the
  master sweep cross-refs the `:media:*` sub-label to ADR-0071/0085. Recommend the sub-label to
  avoid stream proliferation; a dedicated stream only if media volume justifies isolation.
- **Y5 — Persona authority depends on ADR-0052 (People), still draft.** GD-0018 and GD-0028 both
  treat People-sourced persona/relationship facts as *proposal inputs* until ADR-0052 ratifies.
  Correct discipline; both GDs carry a hard `dependsOn` ADR-0052 for implementation, though their
  design is ratifiable now.
- **Y6 — FMX-52 calibration is the universal downstream sink.** Every G7 GD that emits numbers
  (0024, 0028, 0034, and 0019's perk caps) routes constants to FMX-52. This is correct and is *not*
  a blocker to ratifying the *design* — but it means none of these GDs are "implementation-ready"
  until calibration runs. Worth stating once in the ratification record so a reader does not mistake
  design-ratify for build-ready.

## External research (targeted)

Source: Perplexity (Sonar), 2026-06-08, on the one genuinely uncertain external assumption in the
cluster — the **EU AI Act Article 50** transparency posture underpinning GD-0018's release gate.

- Article 50 transparency obligations for AI-generated/manipulated content **apply from 2 August
  2026**; the obligation is in force in the Act but the transparency duties land on that date.
  (digital-strategy.ec.europa.eu Code of Practice on AI-generated content; euaiact.com.)
- For **evidently fictional/creative** in-game text, Article 50 points to a **lighter-touch**
  disclosure delivered "in an appropriate manner that does not hamper the enjoyment of the work" —
  not a heavy public-interest label. A **first-exposure disclosure + persistent settings/help
  explanation** is **likely sufficient** for the first-interaction notice duty if clear and
  distinguishable and shown at latest at first exposure. (artificial-intelligence-act.com Art. 50.)
- There may additionally be a **machine-readable / detectable marking** obligation on the provider
  of synthetic outputs where technically feasible — GD-0018's per-output machine-readable provenance
  partially anticipates this, but the GD should name the marking obligation explicitly.

Conclusion: **GD-0018's legal-gate framing is sound and slightly conservative.** The disclosure
posture is right; the live refinements are (a) the fictional-work lighter-touch carve-out and (b)
the explicit machine-readable-marking obligation — both amendments, not a redesign. The Article 50
gate remains a Nico + external-legal release blocker (FMX-88 D3), which is the correct shape.

## Proposed dispositions (summary — see structured output for the machine-readable list)

- **GD-0010** — ratify-with-amendment (direction + resolved-into pointer; drop ADR-0009 link).
- **GD-0013** — ratify-with-amendment (carry the hard content boundary forward; reconcile
  approved/draft/binding lifecycle via the vault-wide status GD).
- **GD-0018** — ratify-with-amendment (keystone; name the Article 50 machine-readable-marking
  obligation; `dependsOn` ADR-0052 + ADR-0100).
- **GD-0024** — ratify-with-amendment (ratify the AI-World-Simulation bounded context per FMX-91
  lean; `dependsOn` ADR-0071).
- **GD-0028** — ratify-as-is (`dependsOn` GD-0018 + ADR-0052; numbers → FMX-52).
- **GD-0034** — ratify-with-amendment (pick the media RNG label; `dependsOn` ADR-0085/0076/0100).
- **GD-0019** — ratify-as-is (`dependsOn` ADR-0051/0074/0082 in the same pass).
