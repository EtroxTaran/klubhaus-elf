---
title: Manager & Legacy Bounded Context - Ratification Synthesis 2026-05-28
status: draft
tags: [research, manager, legacy, bounded-context, ratification, fmx-25]
context: manager-legacy
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-25
sourceType: external
related:
  - [[raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  - [[manager-archetype-roguelite-2026-05-27]]
  - [[late-game-systems]]
  - [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  - [[../50-Game-Design/mode-create-a-club-roguelite]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/bounded-context-map]]
---

# Manager & Legacy Bounded Context - Ratification Synthesis 2026-05-28

## Question

Should **ADR-0051 Manager & Legacy Context** be ratified as the 12th bounded
context in the FMX architecture, rejected and folded into existing contexts, or
deferred? This synthesis collects the evidence needed for Nico's decision.

## Status

This is a sourced ratification dossier for FMX-25. It does not change ADR-0051's
status itself. The ADR remains `status: draft` and `binding: false` until Nico
ratifies.

`raw research -> this synthesis -> ADR-0051 §Options + §Recommendation -> Nico decision`

## Summary

**Recommendation: Accept (Option A)** ADR-0051 as proposed. Three converging
lines of evidence support a clean accept:

1. **Industry pattern.** Across Hades, Slay the Spire, Risk of Rain 2, Darkest
   Dungeon II and Against the Storm, cross-run meta is architecturally
   separated from in-run authoritative state with a snapshot-at-creation
   determinism rule. ADR-0051's determinism clause matches this pattern
   exactly. One peer-reviewed source (Uppsala thesis) describes the
   meta-vs-run split for Hades in detail.
2. **DDD correctness.** Cross-run meta with domain rules (archetype detection,
   style-signal derivation, prestige scaling) belongs in its own bounded
   context per ADR-0019 §Decision. The alternative - folding into Identity or
   League - mixes account ownership and league scheduling with progression
   rules, which is exactly what the modular-monolith decision warns against.
3. **Downstream commitments.** ADR-0052 People, Persona and Skills (merged
   2026-05-28 via FMX-23) explicitly references ADR-0051 ratification at
   three named points. Rejecting ADR-0051 would invalidate an adjacent
   already-merged draft and require an ADR-0052 patch in the same beat.

The five open questions GD-0019 lists (taxonomy, signal schema, post-run UI
depth, prestige ladder shape, snapshot timing) are **scope-bounding, not
blockers**. They resolve by playtest tuning and follow-up GDDR updates; none
of them require a different context owner.

## Findings

### Finding F1: Snapshot-at-creation is the canonical roguelite pattern

- **Source:** [[raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  Query 1; Uppsala thesis on Hades meta-progression
  (uu.diva-portal.org/smash/get/diva2:1972814/FULLTEXT01.pdf).
- **Confidence:** High.
- **Finding:** Five independent successful roguelites (Hades, Slay the Spire,
  Risk of Rain 2, Darkest Dungeon II, Against the Storm) implement the same
  pattern: meta loaded at boot, snapshot copied into run state at run start,
  authoritative simulation reads only from snapshot, meta updated only on
  explicit boundaries (death, win, return). Seeded reproducible runs are only
  possible because of this rule.
- **Impact on ADR-0051:** Direct match with ADR-0051 §Determinism. The rule "a
  running save must never read mutable cross-save meta after creation" is the
  industry-standard pattern, not an FMX invention.

### Finding F2: DDD canonical answer matches the proposed boundary

- **Source:** [[raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  Query 2; ADR-0019 §Decision.
- **Confidence:** Medium-high.
- **Finding:** Cross-run meta with its own domain rules (archetype detection,
  style synthesis, prestige rules) is DDD-canonically a bounded context. The
  closest published terms for the snapshot rule are "immutable value object",
  "configuration-at-construction" and "anti-corruption layer at run creation".
  Cross-context communication via published domain events plus subscriber
  translation is the standard pattern.
- **Impact on ADR-0051:** ADR-0051's `Draft consumed facts` list matches this
  pattern: League publishes `RogueliteRunEnded`, Club Management publishes
  `InsolvencyStageChanged` and economy summaries, Manager & Legacy subscribes
  and translates. No cross-context table joins. ADR-0019 storage isolation
  (§6) holds.

### Finding F3: Football sims keep manager scoped to one save - cross-run identity is FMX's differentiator

- **Source:** [[raw-perplexity/raw-manager-legacy-ratification-2026-05-28]]
  Query 3; footballmanager.com FM26 page.
- **Confidence:** Medium-high.
- **Finding:** Football Manager (SI), EA FC Career (24/25/26), Out of the
  Park, FIFA Manager classic and Anstoss all scope the in-world manager to a
  single save. A separate account profile tracks unlocks, achievements and
  cosmetics but does not influence simulation state. FM's emergent traits +
  reputation system is the closest baseline but is strictly per-save. EA FC
  26's Manager Live Challenges (2025/26) demonstrate the meta-vs-run
  separation at the account-profile level, but do not carry in-world
  reputation between challenges.
- **Impact on ADR-0051:** Persistent cross-run *identity* is a genuine FMX
  differentiator. Precedent is weak in football sims, strong in roguelites
  (Hades, Slay the Spire). The architectural pattern is borrowed from the
  roguelite side; the football framing is novel. This validates the
  decision to give the concern its own context rather than folding it into a
  per-save aggregate.

### Finding F4: ADR-0052 already depends on ADR-0051 ratification

- **Source:** [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  §Context, §Options considered (Option 4), §Draft consumed facts.
- **Confidence:** High (direct quotation).
- **Finding:** Three named references in ADR-0052 read "if ADR-0051 is
  ratified". §Context: "Manager & Legacy, if ADR-0051 is ratified, owns
  cross-save manager identity and run/legacy progression". §Draft consumed
  facts: "run/manager snapshot facts from Manager & Legacy if ADR-0051 is
  ratified". §Options Option 4 explicitly rejects extending Manager & Legacy
  to own all save-scope people - confirming the separation, conditional on
  ratification.
- **Impact on ADR-0051:** Rejecting ADR-0051 requires a same-beat ADR-0052
  patch to remove the conditional references. Deferring ADR-0051 leaves
  ADR-0052's contract partially undefined.

### Finding F5: GD-0019 design principles bind regardless of ratification outcome

- **Source:** [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]]
  §Decided/strong, §Change policy.
- **Confidence:** High.
- **Finding:** GD-0019 enumerates principles ratification cannot weaken:
  manager identity emergent-hybrid, archetype reflected-not-grinded, balance
  corridor with mandatory prestige counterweight, MVP ships hooks not full
  meta. §Change policy lists "changing the Manager & Legacy domain owner" as
  a Nico-gated decision - making the FMX-25 ratification the formal gate.
- **Impact on ADR-0051:** Accept is consistent with GD-0019's listed
  principles. Reject would require GD-0019 rewrite (different owner). Defer
  is permitted but leaves the gate open.

### Finding F6: Late-game-systems already locks compatible 3-tier perk ladder + HoF

- **Source:** [[late-game-systems]] §7 (Hall of Fame), §9.2 (Determinism
  safeguard), §9.3 (3-tier Legacy perk tree).
- **Confidence:** High.
- **Finding:** late-game-systems is `status: current` and `binding: true`. It
  defines a 3-tier perk progression (Tactician/Networker/Youth Whisperer →
  Global Reputation/Financial Savvy → Legendary Name), a 3-layer Hall of Fame
  (Manager per-save, Manager cross-save, Club per-save, Player Legends), and
  the determinism safeguard "simulation reads nothing from this meta file
  once a save is created... same seed + same legacy configuration at
  creation → byte-identical world".
- **Impact on ADR-0051:** ADR-0051's determinism rule is already established
  binding behaviour from late-game-systems §9.2. Accepting ADR-0051 names
  the owner; the rule itself is not new. The 3-tier perk ladder is post-MVP
  per GD-0019; ADR-0051 acceptance does not bring it into MVP.

## Inputs For Decisions

If Option A (Accept) is chosen, the following items encode in the ratified ADR:

- **Context owner:** Manager & Legacy as the 12th bounded context.
- **Owned aggregates:** manager profile, run analysis snapshots, manager style
  signals, archetype candidates, legacy unlock catalog, prestige profile.
- **Determinism rule:** binding (matches late-game-systems §9.2).
- **MVP scope:** hooks only (RunAnalysisSnapshot, ManagerStyleSignals,
  PostRunReflection). Perks, legacy carry, prestige ladder remain post-MVP.
- **Public Contract sketch:** as drafted in ADR-0051 §Public contract direction
  (commands, events, read models, consumed facts).
- **Storage scope:** mixed - platform-scope cross-save meta + save-scope run
  snapshots, per ADR-0027.
- **Bounded-context-map patch:** insert "Manager & Legacy" as the 12th row in
  §1 + add to the §2 Mermaid diagram.

## Future-scope notes (classified future-scope)

The five scope-bounding questions from GD-0019 §Open remain `future-scope`,
playtest-tunable, deferred to follow-up GDDR updates:

1. **Archetype taxonomy.** Dynamic style-tags (GD-0019 recommendation) vs
   locked 5-family or 6-family list. Tunable via post-playtest GDDR amendment.
2. **Exact `ManagerStyleSignals` schema fields.** Coarse categories listed in
   GD-0019 §MVP hook model; precise field shape via post-MVP implementation
   GDDR.
3. **Post-run reflection UI depth in MVP.** Minimum viable copy listed in
   GD-0019 §MVP hook model; UI iteration in styleguide.
4. **Prestige ladder modifier shape.** Sketch in late-game-systems §9.3; final
   tuning via playtest.
5. **Snapshot timing for skill-profile snapshots** (line-up lock vs save
   creation). ADR-0052 boundary question; resolves jointly with FMX-26
   follow-up (post-ADR-0052 narrowed scope).

These are not ratification blockers per the workflow: ADR-0051 owns the
*context boundary and contract surface*; tuning lives in GDDR or follow-up
ADRs.

## Why not Defer (Option B)?

Option B (Defer-with-scope-adjustment) narrows MVP to a single read model
(`PostRunReflection`) and the `RogueliteRunEnded` consumer. The case for it:
keeps options open until first playtest data lands.

The case against, and why this synthesis recommends against it:

- The structural decision (own context, snapshot-at-creation determinism,
  consumed-fact list) is independent of which commands ship in MVP. GD-0019
  already constrains MVP to hooks-only - the deferral is not the gate, it's
  the GDDR.
- ADR-0052's three conditional references stay unresolved.
- Cost of delay > cost of acceptance: ADR-0051's MVP scope is hooks only;
  the marginal cost of accepting is naming the owner.

## Why not Reject (Option C)?

Option C folds the concerns into existing contexts: manager identity into
Identity; run analysis into League; legacy/prestige into post-MVP without an
owner.

The case against:

- ADR-0019 §Decision explicitly warns against overloading Identity with
  domain rules; it owns "user, sessions, roles, device state", not
  game-design progression.
- League Orchestration owns "season, week, match-day, mode, pause, quorum";
  archetype detection and style-signal synthesis are different domain
  language.
- ADR-0052 would need a same-beat patch to drop its conditional references
  to Manager & Legacy.
- All five surveyed roguelites carve the cross-run meta into its own module.
  Industry pattern argues against folding.

## What the ratification PR includes

Per the FMX-25 plan and [[../30-Implementation/domain-research-workflow]]
Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-manager-legacy-ratification-2026-05-28]].
- ADR-0051 expanded in place with the three options above + clear Accept
  recommendation + map patch proposal as a fenced diff.
- Decision-Log row update on ADR-0051 (Lineage column reflects FMX-25
  ratification pass + recommendation).
- Current-State annotation noting FMX-25 dossier ready and awaiting Nico
  decision.
- Session handoff naming the explicit ratify-ask.

The `bounded-context-map.md` itself is **not** modified by this PR. The map
patch lives inside ADR-0051 as a fenced diff and applies only when Nico
flips ADR-0051 to `status: accepted` and `binding: true`.

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]] -
  the ADR under ratification.
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]] -
  adjacent draft with explicit ratify-dependency.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular-monolith decision the new context must respect.
- [[../50-Game-Design/GD-0019-manager-archetype-roguelite-progression]] -
  pillar binding regardless of ratification outcome.
- [[late-game-systems]] - already-binding determinism + perk ladder context.
- [[manager-archetype-roguelite-2026-05-27]] - prior FMX-16 synthesis.
- [[../30-Implementation/domain-research-workflow]] - the workflow this
  dossier follows.
