---
title: "RAW — Hidden-attribute substrate mapping (8-meta / OCEAN → labels)"
status: raw
tags: [research, raw, perplexity, persona, ocean, player-skills, scouting, determinism, fmx-86]
created: 2026-06-05
updated: 2026-06-05
type: research
related: [[../hidden-attribute-substrate-mapping-2026-06-05]], [[../../50-Game-Design/GD-0020-eos-player-skills-personas-and-people]], [[../../50-Game-Design/GD-0021-player-staff-development-and-decision-influence]], [[../../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]], [[../../10-Architecture/09-Decisions/ADR-0064-scouting-activity-context]]
---

# RAW Perplexity capture — Hidden-attribute substrate mapping (FMX-86)

> Unprocessed research capture and source notes. Synthesised into
> [[../hidden-attribute-substrate-mapping-2026-06-05]]. Do not implement from raw.
> Captured 2026-06-05 (Sonar). Perplexity citations are model-provided and were
> cross-checked only where promoted into the synthesis. Raw notes may quote
> competitor names/features for analysis only; implementation follows
> [[../ip-and-licensing]] + [[../../10-Architecture/09-Decisions/ADR-0007-naming-schema]].
> Four prompts: (1) OCEAN→football-label mapping + FM personality derivation;
> (2) FM/OOTP scouting-gated reveal & attribute bands; (3) persist-vs-derive a
> personality vector in deterministic sims; (4) single-composite vs multi-tag labels.

## Prompt 1 — OCEAN → football-behaviour labels; how FM derives its personality system

**Prompt (verbatim):** "I am designing a football management sim. Players have 8 hidden
'meta' attributes (1–20): Potential, Consistency, Pressure, Professionalism, Determination,
Adaptability, Injury-Proneness, Big-Matches. I keep an internal OCEAN vector (O,C,E,A,N)
NEVER shown to the player. The player only sees football-language LABELS: professional,
volatile, leader, mentor, loner, media-savvy, demanding, homesick, adaptable, ambitious,
loyal, temperamental. Q1: From sport-psychology research, how do OCEAN dimensions map onto
these labels (dominant dimension + direction)? Q2: How does Football Manager derive its
visible 'Personality' descriptor, 'Media Handling Style' and hidden 'Player Traits' from
hidden attributes (Adaptability, Ambition, Loyalty, Pressure, Professionalism, Sportsmanship,
Temperament, Controversy, Determination)? What thresholds/combinations produce which descriptor?"

**Key findings (OCEAN → label, reasoned mapping from sport-psych — flagged not-FM-code):**
- **professional** ← ↑Conscientiousness (+ ↓Neuroticism, mid/↑Agreeableness). Football: ↑Professionalism meta, ↑Consistency, lower Injury-Proneness via lifestyle.
- **volatile** ← ↑Neuroticism (+ ↓Agreeableness, sometimes ↑Extraversion so it's visible). → discipline/media incidents.
- **leader** ← ↑Extraversion (+ ↑Conscientiousness, mid/↑Agreeableness, ↓/mid-Neuroticism). → ↑Determination/Pressure handling.
- **mentor** ← ↑Agreeableness (+ ↑Conscientiousness, mid-Extraversion, ↓Neuroticism). → boosts juniors' development.
- **loner** ← ↓Extraversion (± low Agreeableness). Less dressing-room effect either way; less mentoring uptake.
- **media-savvy** ← ↑Extraversion (+ ↑Agreeableness, mid/↑Conscientiousness, ↓Neuroticism). → low Controversy.
- **demanding** ← ↑Conscientiousness (+ ↓/mid-Agreeableness, mid-Extraversion). → ↑Ambition/Determination; harmony risk if low-A.
- **homesick** ← ↑Neuroticism (+ ↓Extraversion, ↓Openness). → ↓Adaptability, transfer-request risk after a move.
- **adaptable** ← ↑Openness (+ ↓/mid-Neuroticism, mid-Extraversion/Agreeableness). → ↑Adaptability meta, short settling-in.
- **ambitious** ← ↑Conscientiousness (+ ↓/mid-Agreeableness, sometimes ↑Extraversion). → ↑Ambition; clashes if club lags.
- **loyal** ← ↑Agreeableness (+ mid/↑Conscientiousness, ↓Neuroticism). → ↑Loyalty, fewer forced moves.
- **temperamental** ← ↑Neuroticism (+ ↓Agreeableness, ↑Extraversion). → cards/suspensions, ↑Controversy, ↓Sportsmanship.
- General grounding: ↑Conscientiousness & ↓Neuroticism predict training adherence/performance; Extraversion+Agreeableness relate to cohesion/leadership.

**Key findings (FM's actual system — reconstructed from editor fields + community reverse-engineering, not official code):**
- FM stores 1–20 hidden mentals: **Adaptability, Ambition, Loyalty, Pressure, Professionalism, Sportsmanship, Temperament, Controversy, Determination**.
- **Personality** descriptor = function of a subset (mainly Determination, Professionalism, Ambition, Loyalty, Sportsmanship, Temperament, Pressure, Controversy). FM checks **elite high-value buckets first** (e.g. Professionalism 18–20 → *Model Professional*; ~15–17 → *Professional*; ~12–14 → *Fairly Professional*; Determination 18–20 → *Resolute*), then **falls through** to neutral labels (*Balanced*, *Fairly Determined*) if nothing extreme matches. Conflicts resolved by precedence (high Ambition tends to beat moderate Loyalty).
- **Media Handling Style** (*Media-Friendly / Outspoken / Reserved / Evasive / Unflappable*) derives more directly from **Temperament, Controversy, Sportsmanship, Professionalism (± Pressure)**: low Temperament + high Controversy → Outspoken/Volatile; high Professionalism + low Controversy → Media-Friendly.
- **Player Traits / PPMs** ("Argues With Officials", "Tries Killer Balls Often") are **separate coexisting flags**, mostly learned/assigned, NOT a deterministic function of personality — but correlate (low Temperament/Sportsmanship → combative traits; high Determination/Work Rate → hard-working traits).
- Practical takeaway offered: compute a few core axes from Big-Five (Professionalism ← ↑C+↓N; Volatility ← ↑N+↓A; Leadership ← ↑E+↑C+mid-A), map to meta, then assign visible labels by pattern (FM-style elite-bucket-first).
- Citations (model-provided): fmmvibe.com meta-attributes; fm-arena FM24 meta; steamcommunity; YouTube guides.

## Prompt 2 — Scouting-gated reveal & attribute bands (FM, OOTP, NBA 2K MyGM)

**Prompt (verbatim):** "In FM and similar sports sims, hidden attributes/personality are not
shown precisely until a scout has spent time. Explain: (1) how FM's scouting knowledge/
familiarity progressively reveals attributes — the attribute-RANGE/masked-value mechanic
(e.g. 13–17), star ratings as a RANGE that narrows, and how personality/traits surface over
time; (2) the real-world analogy of confidence rising with observation count; (3) best-practice
'confidence-gated reveal' where a knowledge% threshold flips hidden → estimated band → known,
and why bands beat point estimates for fairness and replay. Cite FM/OOTP/NBA 2K."

**Key findings:**
- FM uses a **scouting-knowledge gate**: more knowledge → more precise report. Incomplete knowledge shows attributes as a **range/band (e.g. "13–17")** that **narrows** as knowledge rises; hidden attributes never appear as raw numbers but surface indirectly via report text. Stable model:
  - Low knowledge → "Unknown" / very wide band / vague star band (prevents false precision).
  - Medium → narrower attribute bands + tighter star ranges (tentative confidence).
  - High → effectively "known" for practical purposes (act with confidence).
- **Star ratings are opinion ranges**, not truths — they express confidence + fit, and tighten with knowledge/familiarity. Reports **expire** and are re-scouted to refresh.
- **Real-world analogy:** confidence rises with **observation count + quality** — each viewing shrinks the confidence interval (prior → better posterior). The range UI is exactly this.
- **Best-practice confidence-gated reveal:** 0→T1 hidden/insufficient; T1–T2 estimated band (e.g. 13–17, never a single number); T2+ progressively narrow (13–15 → 14–15); only flip to a single **known** value when design justifies near-certainty.
- **Why bands > point estimates:** communicate uncertainty honestly; reduce perceived randomness when truth differs from early estimate; make scouting meaningful; support player agency; easier to balance across scout quality/league/data tiers.
- **Other sims:** OOTP Baseball — scout-evaluated ratings differ from true ratings; scout accuracy + budget control closeness. NBA 2K MyGM/MyNBA — evaluation depends on scouting/workouts/insider reports rather than full immediate certainty. Shared pattern: **assessment quality improves with scouting input; show uncertainty explicitly.**
- Citations (model-provided): passion4fm hidden-attributes guide; fmscout hidden-attributes viewer; sortitoutsi FM26 hidden attributes; YouTube.

## Prompt 3 — Persist vs derive/cache a personality vector in a deterministic sim

**Prompt (verbatim):** "Deterministic, replay-safe sim (fixed seed → byte-identical runs).
Per-character OCEAN vector DERIVED from 8 hidden integer meta attributes + a generation
archetype seed. Should I PERSIST the OCEAN vector in the save, or DERIVE/CACHE it from
seed+meta? Trade-offs: (a) determinism/replay, (b) save size + migration when the derivation
formula changes, (c) risk of the algorithm evolving between versions breaking old saves,
(d) the vector drifting over time (mentoring/aging) — once mutated it can't be re-derived.
Best practice in long-running sims / event-sourced systems incl. derive-then-persist-on-first-
mutation / snapshot."

**Key findings (recommendation = derive for init, persist thereafter — event-sourcing + snapshot):**
- (a) **Determinism:** derive-only is deterministic ONLY if the derivation fn is pure AND bit-identical across versions; any formula/float change silently alters old saves & breaks replays. **Persisting decouples replay correctness from future code changes** → safer.
- (b) **Size:** a 5-float vector is negligible even ×thousands of actors — **not** the deciding factor. Migration: if NOT persisted, a formula change rewrites history on load → you must keep all old formulas forever (version branches) or run a migration that effectively persists a snapshot anyway. If persisted: new actors use new formula at gen, old actors keep persisted truth; trivial migration.
- (c) **Algorithm evolution:** formulas WILL evolve (reweighting, edge fixes). Derive-only → replays from version N don't reproduce on N+1; old saves "soft-corrupt". Persist → old saves load identical values; generation code used only at creation/intentional migration → safe to refactor.
- (d) **Drift (mentoring/aging):** once any component mutates, OCEAN is no longer a pure function of seed+meta. You'd have to store an event log or deltas — i.e. you're storing the vector anyway. Persisting makes load trivial (read 5 values, no replay).
- **derive-then-persist-on-first-mutation (lazy snapshot):** store seed+meta+archetype; derive OCEAN at creation; persist immediately (simpler) or at latest on first mutation; after persistence NEVER re-derive — it's authoritative state. Analogous to lazy snapshotting in event-sourced systems (derive once, snapshot is canonical; historical derivation code can be quarantined/removed).
- **Concrete recommendation:** (1) store seed + 8 meta for provenance; (2) derive OCEAN at creation; (3) persist as soon as the character exists (or at latest first mutation); (4) never re-derive on load post-persist; (5) new formulas apply only to newly created characters (or an explicit content migration).
- Citations (model-provided): gafferongames float determinism; HN event-sourcing/snapshot thread; deterministic-engine writeups; (Anthropic persona-vectors, tangential).

## Prompt 4 — Single composite descriptor vs multi-tag labels (FM / CK3 / RimWorld)

**Prompt (verbatim):** "Compare (A) a SINGLE composite personality descriptor per character
(FM's one 'Personality' word, weighted blend of hidden attrs) vs (B) MULTIPLE coexisting
trait TAGS (CK3, RimWorld, FM's separate Player Traits). (1) How do FM, CK3, RimWorld each
handle it, and do they prevent contradictory tags? (2) UX/systemic trade-offs for comprehension,
dialogue, avoiding noisy/contradictory presentation? (3) Best practice for a football sim that
wants 'leader AND volatile AND homesick' at a glance, with rules to prevent mutually-contradictory
labels."

**Key findings (recommendation = hybrid leaning multi-tag with exclusion axes):**
- **FM** = composite single **Personality** word + a separate **Media Handling Style** + coexisting **Player Traits/PPMs**. One Personality string ⇒ never visibly contradictory; PPMs have soft/hard exclusion sets (community warns against conflicting mentored traits).
- **CK3** = pure **multi-tag**; characters hold many traits across categories; **mutually-exclusive groups** enforced (Brave↔Craven, Chaste↔Lustful, Just↔Arbitrary) — adding the opposite removes the old. No composite word; personality = the trait set.
- **RimWorld** = **multi-tag** with **incompatibility sets** (Volatile↔Steadfast, Psychopath↔Kind, Ascetic↔Greedy); generator respects incompatibilities.
- **Trade-offs:** single composite = fast comprehension, low UI noise, no visible contradiction, designer can retune weights under a stable label — BUT information-lossy (can't show orthogonal facets), poor for dialogue targeting, opaque (players need guides). Multi-tag = rich/expressive, emergent narrative, clean per-trait dialogue hooks, player-visible progress — BUT noisy UI risk, contradiction risk without exclusion rules, higher cognitive load + testing.
- **Recommended for the football sim (the stated goal "leader AND volatile AND homesick" at a glance):** a **hybrid** — optional primary composite for sorting + a **small curated set of multi-label tags along orthogonal AXES with per-axis mutual exclusion**:
  - Leadership axis (Leader / Influential / Background), Stability axis (Unflappable / Balanced / Volatile — hard opposites), Attachment axis (Homesick / Settled), Social axis (Media-savvy / Reserved / Outspoken), + orthogonal flags (Mentor, Loner, etc.).
  - Rule: **≤1 tag per axis**; orthogonal axes coexist freely (Leader + Volatile + Homesick are different axes → allowed). On threshold-cross: remove old axis tag, add new, optionally notify ("X has settled in").
  - UX: list view = composite/primary + 2–3 prioritised tag icons; detail = all tags grouped by axis with plain-language tooltips.
- Citations (model-provided): fmscout & fminside personality guides; neonlightsmedia FM26 personality; sortitoutsi; footballmanager.fandom Personality.
