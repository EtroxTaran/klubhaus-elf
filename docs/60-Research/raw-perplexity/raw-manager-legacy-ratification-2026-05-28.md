---
title: Raw - Manager & Legacy Ratification Research (FMX-25)
status: raw
tags: [research, raw, perplexity, manager, legacy, roguelite, bounded-context, fmx-25]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-25
sourceType: perplexity
related:
  - [[../manager-legacy-bounded-context-2026-05-28]]
  - [[../manager-archetype-roguelite-2026-05-27]]
  - [[../late-game-systems]]
  - [[raw-roguelite-meta-progression]]
---

# Raw - Manager & Legacy Ratification Research (FMX-25)

> Three Perplexity queries run during FMX-25 to support the ratification
> recommendation for ADR-0051 Manager & Legacy Context. This is raw input, not
> implementation authority. The synthesis in
> [[../manager-legacy-bounded-context-2026-05-28]] reconciles these findings
> with the prior FMX-16 research, the vault and ADR-0051 / ADR-0052.

## Why these queries

The ratification call needs grounded best-practice evidence for two structural
claims in ADR-0051:

1. Cross-run meta belongs in its own bounded context.
2. The determinism rule "a running save must never read mutable cross-save meta
   after creation" is the canonical pattern, not a project-local invention.

FMX-16's synthesis (manager-archetype-roguelite-2026-05-27) already covered
roguelite *gameplay* precedent. These queries explicitly target the
*architectural / context-boundary* layer instead.

## Query 1 - Roguelite cross-run meta architecture

### Prompt

Roguelite and management sims with cross-run meta-progression (Hades, Slay the
Spire, Against the Storm, Darkest Dungeon II, Risk of Rain 2): how is run-meta
state (perk unlocks, prestige, persistent identity) architecturally separated
from the in-run authoritative simulation state? At which point is
meta-progression injected into a new run? How is determinism preserved when the
meta file is mutable? What aggregate/module boundary patterns are used?

### Output summary

- **Canonical pattern across all surveyed titles: snapshot-at-creation.** Meta
  layer is loaded once at boot/profile-select. Starting a new run copies a
  snapshot of relevant meta data into the run state. During the run, the
  authoritative simulation only reads from that snapshot, not from the live
  mutable meta profile.
- **Meta profile is updated only on explicit boundaries** (death, win,
  return-to-hub). Updates may not retroactively alter running simulations.
- **Run determinism depends solely on the run save** (RNG seeds, difficulty
  modifiers, deck/loadout, fixed content pools), never on the global profile
  file. Seeded reproducible runs in Slay the Spire and Risk of Rain 2 only work
  because of this rule.
- **High-level module split observed in all five titles:**
  - Profile / Account / Meta layer: unlocked content IDs, meta currencies,
    permanent upgrades, unlocked difficulty modifiers, persistent collections.
    Mutated only via end-of-run reducers or meta-screen purchases.
  - Run / Expedition / Settlement layer: player build, current map/world state,
    in-run progression, RNG state, seeds. Created from a profile snapshot, then
    self-contained.
  - Content registry / Catalog layer: static definitions. Unlocked content is a
    profile-side filter on this registry.
- **End-of-run is modelled as a reducer**: `profile' = f(profile, run_result)`.
  Runs in the meta layer, invisible to the simulation code that handled the
  run.
- **Aggregate boundary contract** is typically a serialised `RunConfig` /
  `EmbarkConfig` value object built from the profile, then owned by the run.
- Game-specific notes:
  - *Hades*: Mirror of Night, Keepsakes, weapon aspects, House renovations are
    "applied when you leave for a run"; in-run RNG depends on loadout and Heat
    at embark, not on later meta changes.
  - *Slay the Spire*: card/relic pools and ascension are checked at run start;
    seeded runs are reproducible across machines.
  - *Risk of Rain 2*: profile unlocks vs run instance fully separated; mid-run
    achievement unlocks affect future runs only.
  - *Darkest Dungeon II*: Profile + Altar of Hope vs Journey; embark reads
    profile snapshot.
  - *Against the Storm*: Smoldering City (meta) vs Settlement (run); cycles
    persist across settlements but never modify them retroactively.

### Citations Perplexity returned

- [1] Uppsala University thesis, "A Deep Dive into the Mechanics and Progression
  of the Hades Series" - <https://uu.diva-portal.org/smash/get/diva2:1972814/FULLTEXT01.pdf>
- [2] dms462fall2020.wordpress.com - meta-progression in Hades
- [3] Supergiant Games blog - <https://www.supergiantgames.com/blog/>
- [5] GameFAQs Hades Mirror/Darkness discussion

### Confidence

High. Five independent titles converge on the same pattern; one peer-reviewed
academic source (Uppsala thesis) describes the meta-vs-run split for Hades in
detail. ADR-0051's determinism rule matches this pattern exactly.

## Query 2 - DDD pattern for cross-instance meta state

### Prompt

In Domain-Driven Design, what is the canonical pattern for cross-instance /
cross-save meta state in a single-player game/simulator with multiple
deterministic runs? Bounded context vs platform configuration? Standard pattern
for snapshot-at-creation-never-read-again? How does the meta context consume
domain events from other contexts without violating isolation? Published Evans
/ Vernon / Alagarsamy references?

### Output summary

- **Cross-run meta belongs in its own bounded context** if it has domain rules
  (unlocks, prestige math, archetype derivation). Pure platform configuration
  (flags, display settings) stays outside the domain model.
- **Snapshot-at-creation pattern is DDD-compatible** but does not have a single
  canonical name. Closest published terms: *immutable value object*,
  *configuration-at-construction*, *anti-corruption layer at run creation*. The
  run context reads current meta once, maps it into a run-local immutable
  snapshot, and never re-reads the source.
- **Replay determinism follows directly** from the bounded-context rule + the
  immutable snapshot + recording only in-run inputs. The simulation depends
  only on the snapshot plus its own inputs.
- **Meta context consumes events from peer contexts as published domain
  events** (`RunEnded`, `BossDefeated`, `AchievementUnlocked`,
  `MilestoneReached`). Subscriber updates its own model; it does not read peer
  aggregates directly. Long-running reactions use a saga / process manager.
- The run context is the **upstream source of truth** for run facts; the meta
  context is the **downstream consumer** that translates facts into its own
  language.
- **No published Evans / Vernon / Alagarsamy passage directly addresses
  cross-aggregate progression state in a deterministic-replay game context.**
  Their general guidance on bounded contexts, aggregates and domain events
  applies, but the meta-vs-run boundary is an application of those rules to
  this domain.
- Observer pattern for domain events crossing architectural boundaries is the
  closest directly stated guidance in the surveyed material.

### Citations Perplexity returned

- [1] emergentmind.com - DDD topic page
- [2] bytebytego.com - DDD demystified
- [4] handbook.chaineapp.com - DDD handbook section on domain events crossing
  boundaries
- [5] Microsoft archive (Feb 2009) - "Best Practice: An Introduction to
  Domain-Driven Design"
- [6] Vaadin blog - "DDD Part 2: Tactical Domain-Driven Design"

### Confidence

Medium-high. The canonical DDD reasoning is consistent and matches ADR-0051,
but Perplexity correctly flags that no single canonical published passage from
Evans/Vernon/Alagarsamy addresses this exact game-loop scenario - we apply
their general guidance to the domain.

## Query 3 - Football management sims: cross-save manager identity

### Prompt

How do Football Manager (SI), EA FC Career (24/25/26), Out of the Park
Baseball, FIFA Manager classic and Anstoss model manager identity that persists
across saves/careers? Cross-save identity at all? EA FC 26 Manager Live
Challenges architecture? Reputation/archetype/style: fixed taxonomy or
emergent? Football Manager: persistent profile across world regeneration?
Developer interviews on the architecture?

### Output summary

- **Across FM, EA FC Career, OOTP, FIFA Manager, Anstoss: the in-world manager
  is scoped to a single save / career.** A separate account/profile layer
  tracks unlocks, achievements and cosmetics across saves but does not
  influence simulation state.
- **EA FC 26 Manager Live Challenges (2025/26)** are the strongest precedent
  for FMX's intent. Public information indicates:
  - Meta state (account): challenge unlocks, completion, global challenge XP,
    cosmetics, leaderboards.
  - Challenge save state: results, transfers, tactics, in-world manager
    reputation. Each challenge run is a temporary mini-save.
  - The two are logically separated so a challenge template can be replayed
    and rotated without impacting other careers.
  - Live Challenges do not carry in-world reputation between challenges; each
    challenge is a fresh universe with a scenario-defined avatar.
- **Football Manager** is the most architecturally interesting baseline:
  - Hybrid manager profile: fixed attribute distribution at creation
    (Motivating, Tactical Knowledge, Working with Youngsters, etc.) plus
    emergent traits inferred from behaviour (tactical preferences, squad
    building patterns, media tone).
  - Reputation is a numeric stat driven mostly by results.
  - **Persistence is strictly per-save.** Starting a new save creates a new
    manager; the old one is not present, even with the same name. Retiring
    inside a save leaves an AI-controlled manager with their full career
    history *inside that universe*.
- **OOTP, FIFA Manager and Anstoss** all use locked stat taxonomies with light
  emergent tagging; reputation per universe; high-score / hall-of-fame as the
  only cross-save artifact.
- **Persistent cross-run "identity" in the roguelite sense is rare** in the
  genre. Where meta exists, it stays cosmetic / unlock-based and does not feed
  simulation state.
- **Developer commentary themes (paraphrased from public talks/blogs):**
  - SI prioritises per-universe narrative integrity and avoids cross-save
    mechanical persistence to keep balance clean and prevent exploits.
  - EA's Live Challenges architecture is built around stateless template + run
    state + account meta, primarily for live-ops flexibility.
- **Trade-offs that big titles accepted by scoping identity to one save:**
  - Clean isolation between worlds, simpler QA/balance.
  - No sense of "a manager career across your real lifetime as a player".
- **What changes when cross-run identity is first-class (FMX's intent):**
  - Closer to Hades / Slay the Spire than to FM, OOTP or Anstoss.
  - Need explicit guards against trivialisation (cap meta-power; meta unlocks
    variety/options, not raw power).
  - Three-state model recommended: Meta Profile (account, identity, style
    tags) + Run Template (scenario parameters) + Run State (one attempt;
    deleted on completion).
  - Meta Profile should store aggregated signals (% youth-promotion runs,
    average press intensity, titles by tier), never raw world state.

### Citations Perplexity returned

- [1] footballmanager.com - FM26 reimagined UI page
- [2] designweek.co.uk - Nomad FM franchise identity
- [3] underconsideration.com - Brand New FM logo and identity
- [4] YouTube interview / talk (link returned)

### Confidence

Medium-high for the architectural patterns (the meta-vs-save split is
explicitly visible in EA FC and inferable from FM's behaviour). Lower for any
specific FM/SI internal architecture - SI has not published a code-level
breakdown; commentary is design-level only. The empirical inference (per-save
manager identity, no cross-universe persistence) is well-supported by
gameplay behaviour and patch-note evidence.

## Combined implications for ADR-0051 ratification

1. **Snapshot-at-creation determinism** is the canonical industry pattern, not
   an Klubhaus Elf-specific invention. ADR-0051's rule "a running save must never read
   mutable cross-save meta after creation" matches every surveyed title.
2. **Own bounded context for cross-run meta** is the DDD-correct answer when
   the meta has domain rules (which Manager & Legacy does: archetype
   detection, style-signal derivation, prestige scaling). Folding it into
   Identity or League would mix progression rules with account ownership /
   league scheduling - exactly what ADR-0019 §Decision warns against.
3. **Domain-event consumption** as ADR-0051 §Draft consumed facts describes
   (`RogueliteRunEnded` from League, economy summaries from Club Management,
   etc.) matches the DDD-standard pattern: upstream contexts publish, the meta
   context translates and stores.
4. **FMX's positioning** is novel in football sims (closest precedent: EA FC
   26 Manager Live Challenges + Hades' meta layer). The ADR can claim genre
   leadership while leaning on a well-tested architectural pattern.

The findings reinforce **Accept (Option A)** as the recommendation in the
synthesis note. No finding contradicts ADR-0051's draft direction.
