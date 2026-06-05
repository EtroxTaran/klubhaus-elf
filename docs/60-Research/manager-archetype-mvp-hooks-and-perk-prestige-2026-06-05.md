---
title: Manager-archetype MVP hooks + perk/prestige stance — synthesis (FMX-93)
status: draft
tags: [research, meta, manager, archetype, roguelite, perks, prestige, confidence, fmx-93]
created: 2026-06-05
updated: 2026-06-05
type: research
binding: false
linear: FMX-93
sourceType: external
related:
  - [[raw-perplexity/raw-roguelite-metaprogression-taxonomy-2026-06-05]]
  - [[raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05]]
  - [[raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[tactical-identity-fingerprint-2026-06-03]]
  - [[manager-archetype-roguelite-2026-05-27]]
---

# Manager-archetype MVP hooks + perk/prestige stance — synthesis (FMX-93)

Grounds FMX-93 (Gap **G3**): confirm & pin the GD-0019 "MVP ships hooks, not the meta system" stance,
define the run-end fact contract + provisional `ManagerStyleSignals` for the **five non-tactical**
categories, set the confidence-surface and start-finance perk policy, and explicitly defer
taxonomy/perks/prestige. Three raw Perplexity captures (2026-06-05):
[[raw-perplexity/raw-roguelite-metaprogression-taxonomy-2026-06-05|meta-progression & taxonomy]] ·
[[raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05|manager identity in games + real world]] ·
[[raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05|confidence UX + start-perk balance]].

## Already locked (do not re-decide — from binding/prior decisions)

- **Owner** = Manager & Legacy (ADR-0051, accepted): owns run-analysis snapshots, style signals,
  archetype candidates, legacy/prestige; **cross-save meta read only at save creation, never during a
  running save** (ADR-0051 §Determinism and storage rules — GD-0019's "D8" shorthand).
- **Tactical signal** = fully pinned by [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation|ADR-0074]]
  (FMX-68): five sub-signals + EWMA(h=15) + empirical-Bayes confidence; raw signals + confidence
  only, **no archetype names**; Tactics-owned projection read once at `RogueliteRunEnded`. FMX-93 does
  NOT re-open it — it consumes it.
- **MVP scope direction** (GD-0019 "Decided/strong"): emergent hybrid identity; reflected-not-grinded
  progression; perks in a capped corridor with a **mandatory prestige counterweight**; everything
  concrete is playtest-tunable.

## Findings

### F1 — Defer-by-clustering is sound for the first playable, but the *shipped* taxonomy should be authored-then-validated (high confidence)
Best practice is a **hybrid**, not pure data-mining: ship a small set of deliberately authored
"identity hooks", then use telemetry/clustering to *validate, refine and rename*. Pure clustering can
surface statistically real but **design-useless, patch-unstable** groups; the biggest risk is
mistaking *observed correlation* for a *good player-facing taxonomy*. For FMX (pre-first-playable),
the MVP-hooks-only stance is correct — capture facts + signals now, name nothing. But the deferral
note must say the eventual taxonomy is **authored then clustering-validated**, not invented purely
from data. *Source: [[raw-perplexity/raw-roguelite-metaprogression-taxonomy-2026-06-05]]. Confidence: high.*

### F2 — Prestige/ascension counterweight is the proven answer to meta-power vs replayability (high confidence)
Hades **Heat**, Slay the Spire **Ascension**, Dead Cells **Boss Cells** all let meta-progression widen
options / smooth onboarding while a **player-selected difficulty escalator** restores challenge. This
directly validates GD-0019's "prestige mandatory once perks matter" principle and the rule that meta
should **increase options/learning, not raw power**. *Source: same. Confidence: high.*

### F3 — The five non-tactical categories have real game + real-world substrate (high confidence)
Sports sims (FM/OOTP/EHM/FHM/basketball GM) model manager/GM identity beyond tactics as **numeric
skills + temperament + reputation + owner/board constraints**, generating distinct multi-season AI
behaviour across youth, transfers, finance, club-building and crisis. Real-world analyst vocabulary
maps cleanly: *youth-focused, wheeler-dealer, financially-prudent, project-builder, fire-fighter,
ideologue, pragmatist*. This gives our five non-tactical signal categories (youth, transfer, finance,
club-building, resilience) well-grounded, fact-derivable definitions — captured as **coarse signals**,
not named classes. *Source: [[raw-perplexity/raw-manager-identity-offpitch-games-2026-06-05]]. Confidence: high.*

### F4 — Surface confidence as 3–4 qualitative bands; numbers only in an Expert tier (high confidence)
Raw numeric confidence is a poor *primary* surface (mis-read, false precision, no direction-of-error).
FM's pattern — **visible ranges, knowledge bars, textual descriptors, fuzzy stars** — is the model:
keep the scalar **internal**, show **3–4 bands** (we use Provisional / Emerging / Established) in
simple tiers, expose numerics only in the Expert UI tier via progressive disclosure. *Source:
[[raw-perplexity/raw-confidence-surfacing-and-start-perk-balance-2026-06-05]]. Confidence: high.*

### F5 — Starting-economy perks are dangerous; resource boosts must be capped + prestige-gated + counterweighted (high confidence)
Starting money/squad/infrastructure perks collapse early-game tension, skew the curve, **snowball**
(early capital compounds) and flatten procedural variety. Safe meta unlocks **variety/options/
challenge**; any resource boost should be hard-capped, stackable-limited, time-limited/non-compounding,
or **prestige-gated with a difficulty counterweight**. This confirms GD-0019's "direct start-money not
a safe default" → **no start-finance perk in MVP**; any future one is prestige-gated + capped + a fresh
Nico decision. *Source: same. Confidence: high.*

## Decisions put to Nico (chosen live 2026-06-05 — D1–D4 = A,A,A,A)

- **D1 = A** Confirm hooks-only; defer taxonomy (with the F1 authored-then-validated note).
- **D2 = A** Five non-tactical categories = **coarse signals + lightweight sample-based confidence**;
  player-facing **3-band** surface (Provisional/Emerging/Established), numerics in Expert tier only.
  (Lighter than ADR-0074's full empirical-Bayes: these are season-level counts/rates, not noisy
  per-match continuous series.)
- **D3 = A** No start-finance perk in MVP; future = prestige-gated + hard-capped + counterweighted +
  Nico decision.
- **D4 = A** Post-run reflection = **minimal but real** (top-2/3 signals + run outcome), MVP-mandatory.
- **Ownership:** Manager & Legacy owns `RunAnalysisSnapshot` assembly (ADR-0051), no roguelite
  process-manager split for MVP.

→ Authored into [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
(`proposed`, never-self-accept) + the FMX-93 confirming revision in
[[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]].

## Future-scope (NOT this issue)

- Archetype taxonomy/naming + clustering from the signal vector (post-MVP playtest; authored-then-
  validated per F1).
- Perk catalogue, perk caps, prestige-ladder shape, any start-finance perk cap (Nico-gated).
- Post-run reflection UI depth beyond the minimal text payload; Expert analytics surfaces.
- Calibration of coarse-signal normalisation baselines + confidence thresholds → FMX-52.
