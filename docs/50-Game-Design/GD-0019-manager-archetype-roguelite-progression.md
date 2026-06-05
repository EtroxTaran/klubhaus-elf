---
title: GD-0019 Manager Archetype Roguelite Progression
status: draft
tags: [game-design, gddr, roguelite, manager, archetype, progression, fmx-16]
created: 2026-05-27
updated: 2026-06-05
type: game-design
binding: false
supersedes:
superseded_by:
related:
  - [[README]]
  - [[mode-create-a-club-roguelite]]
  - [[GD-0017-mvp-scope-and-mode-sequencing]]
  - [[../60-Research/manager-archetype-roguelite-2026-05-27]]
  - [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  - [[../60-Research/tactical-identity-fingerprint-2026-06-03]]
  - [[../60-Research/raw-perplexity/raw-roguelite-meta-progression]]
  - [[../60-Research/late-game-systems]]
  - [[../20-Features/feature-roguelite-mvp-first-playable]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  - [[../60-Research/manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]]
---

# GD-0019: Manager Archetype Roguelite Progression

## Status

draft

> Draft only. This record captures the current best design direction for
> manager-archetype roguelite progression. It is not implementable until Nico
> approves it and the linked ADR is accepted.

## Date

2026-05-27 (created) · 2026-06-05 (FMX-93 confirming revision)

## FMX-93 confirming revision (2026-06-05)

> Added by FMX-93 (Gap **G3**). Confirms — does not rewrite — the stance below. Decisions D1–D4 put to
> Nico live and chosen 2026-06-05 = **A, A, A, A**. The architectural contract is authored in
> [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
> (`proposed`); decision basis is
> [[../60-Research/manager-archetype-mvp-hooks-and-perk-prestige-2026-06-05]].

- **D1 — MVP scope: hooks-only confirmed; taxonomy deferred.** MVP captures run-end facts + provisional
  `ManagerStyleSignals` + a `PostRunReflection`. Archetype **names**, perk caps and the prestige ladder
  stay post-MVP & Nico-gated. **Authored-then-validated note:** the eventual taxonomy is to be
  *authored as a small designed set and then validated/renamed by playtest clustering* — **not** a
  purely data-mined output (pure clustering yields unstable, design-useless groups; roguelite-agency
  research). No archetype list exists yet.
- **D2 — Signal schema + confidence.** The **tactical** signal is fully pinned by
  [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation|ADR-0074]]
  (EWMA h=15 + empirical-Bayes). The **five non-tactical** categories (youth, transfer, finance,
  club-building, resilience) are captured as **coarse signals with a lightweight sample-based
  confidence** (ADR-0082). Player-facing confidence is shown as **3 bands — Provisional / Emerging /
  Established**; raw numbers appear only in the **Expert** UI tier (FM scout-range pattern).
- **D3 — Start-finance perk policy.** **No soft perk affects starting finance in MVP.** Any future one
  requires a prestige unlock + hard cap + an explicit challenge counterweight + a fresh Nico decision.
  (Confirms "direct start-money not a safe default"; research: starting-economy boosts collapse early
  tension and snowball.)
- **D4 — Post-run reflection.** **MVP-mandatory, minimal but real**: a short text summary of the 2–3
  strongest signals + run outcome. Delivers the player-experience goal below.
- **Owner.** Manager & Legacy (ADR-0051) assembles the `RunAnalysisSnapshot` from published facts only
  (no roguelite process-manager split at MVP).

The "Decided / strong", "Taxonomy stance" and "Change policy" sections below are unchanged and remain
the governing principles; the items above resolve the matching entries in **§Open**.

## Player experience goal

After a run ends, the player should feel that the club's story ended but the
manager learned something real. The next run should feel different because the
game recognized the player's style, not because grind made every number bigger.

## Decided / strong

- **MVP ships hooks, not the full meta system.** The first playable should
  capture run-end facts and show a lightweight post-run reflection. Full perk
  selection, cross-save legacy and deep prestige ladders are post-MVP unless
  Nico explicitly expands scope.
- **Manager identity is emergent hybrid.** The player may choose a starting
  background/profile, but the real archetype is inferred from behaviour across
  runs: tactics, youth, transfer, finance, infrastructure, crisis handling and
  social/board style.
- **Archetype progress is reflected, not grinded.** During a run, the player
  should not see threshold checklists like "win 7 derbies for title X". The
  post-run screen explains observed style signals and likely future paths.
- **Perks use a balance corridor.** Small numerical effects can exist, but only
  with explicit caps, tests and a prestige/challenge counterweight. Direct
  start-money, strong starting squads and prebuilt infrastructure are not safe
  defaults.
- **Prestige is mandatory once perks matter.** Stronger meta progression must
  unlock or require harder challenge levels, so replayability increases instead
  of early-game tension collapsing.
- **Everything concrete is playtest-tunable.** Thresholds, weights, taxonomy,
  names, perk caps, UI emphasis and prestige modifiers can change during
  development. Changing the principles above requires a new Nico decision.

## MVP hook model

The MVP should record enough facts for future analysis without promising the
final archetype system:

```text
Run ends
  -> collect run-end facts from owning domains
  -> create RunAnalysisSnapshot
  -> derive provisional ManagerStyleSignals
  -> show PostRunReflection
  -> store snapshot for future Manager & Legacy progression
```

Minimum signal categories:

| Category | Example source facts | MVP handling |
|---|---|---|
| Tactical identity | possession, pressing, risk, adaptation, set-piece use | Capture as coarse style signals; no fixed archetype name required. |
| Youth and development | academy promotions, U21 minutes, player growth | Capture counts/rates for later reflection. |
| Transfer style | net spend, resale profit, scouting reliance, wage discipline | Capture summary; no final perk threshold. |
| Financial discipline | cash runway, crisis stages, budget breaches, recovery actions | Capture from Club Economy ledger snapshots. |
| Club building | stadium/campus/fan/sponsor investments | Capture investment emphasis, not fixed "builder" class. |
| Resilience | crisis recoveries, promotion attempts, run length, end reason | Capture for run-end narrative and future prestige calibration. |

The first playable can use a simple post-run reflection such as:

- "Your run leaned toward youth development and conservative finance."
- "You built pressure through aggressive promotion spending, but cash runway
  collapsed late."
- "These signals are saved for future Manager & Legacy progression."

## Taxonomy stance

Do not lock a V1 archetype family list yet. The draft direction is dynamic
style-tag composition:

- MVP stores style signals and confidence, not fixed class membership.
- Named archetypes are derived later from playtest-observed combinations.
- Candidate names can exist in examples, but are not canonical until approval.

Options to revisit after playtests:

| Option | Use when | Concern |
|---|---|---|
| Existing 5 talent-tree families | The late-game talent tree proves sufficient. | May miss economy and club-building replay styles. |
| 6 football-manager families | Playtests show clear stable clusters around Tactics, Motivation, Youth, Transfer, Finance and Infrastructure. | May overfit our first design intuition. |
| Dynamic tag composition | Playstyles vary widely and replayability benefits from combinable identities. | Needs better explanation and content naming work. |

Current recommendation: **dynamic tags first**, named archetypes later.

## Change policy

Playtests and development may change without a new GDDR:

- numeric thresholds;
- signal weights;
- candidate labels;
- post-run copy;
- perk caps;
- prestige modifier values;
- which signals appear in Quick / Standard / Expert UI.

Requires Nico decision and a GDDR/ADR update:

- moving full perks into MVP;
- removing the prestige counterweight;
- exposing grind checklists;
- allowing competitive multiplayer perk advantage;
- changing the Manager & Legacy domain owner;
- allowing running saves to read mutable cross-save meta.

## Open

- Final archetype taxonomy and naming. *(Still open — deferred post-MVP. FMX-93 (G3) confirms the
  deferral and pins it as **authored-then-clustering-validated**, not pure data-mining. No list yet.)*
- ~~Exact signal schema and confidence model.~~ → **tactical** signal specified by proposed
  [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]]
  (FMX-68, G10): five signals + EWMA(h=15) + empirical-Bayes confidence, raw signals only; the **five
  non-tactical** coarse signals + 3-band confidence specified by proposed
  [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]]
  (FMX-93). Taxonomy/naming stays open above (G3).
- ~~Exact post-run UI depth for first playable.~~ → **resolved (FMX-93, D4)**: MVP ships a minimal but
  real text `PostRunReflection` (outcome + top 2–3 signals); richer depth is post-MVP.
- First prestige ladder shape. *(Still open — post-MVP, Nico-gated.)*
- Whether future challenge runs can badge async-group cosmetics. *(Still open — post-MVP.)*
- ~~Whether any soft perk may affect starting finance, and if yes, the maximum allowed cap.~~ →
  **resolved (FMX-93, D3)**: **none in MVP**; any future start-finance perk is prestige-gated +
  hard-capped + counterweighted + a fresh Nico decision.

## Rationale

The raw report's strongest idea is behaviour-based manager identity. Market
research supports challenge variety and meta layers, but the differentiator is
not copying a fixed class system. FMX should record what the player actually did
and let replayable identities emerge from data, then use playtests to decide
which names and mechanics deserve promotion.

## Consequences

Positive:

- Preserves the Roguelite differentiator without bloating the first playable.
- Keeps replayability high by delaying premature taxonomy lock-in.
- Gives architecture a clear hook for future Manager & Legacy progression.

Negative / constraints:

- Requires disciplined event contracts before implementation.
- Post-run UX must be clear even when no final perk unlocks yet.
- Balance cannot be finalized without simulation and playtest evidence.

## Supersedes

None

## Feeds ADRs

- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
- [[../10-Architecture/09-Decisions/ADR-0074-tactical-identity-fingerprint-aggregation]] (FMX-68 — tactical signal algorithm)
- [[../10-Architecture/09-Decisions/ADR-0082-manager-style-signal-and-run-analysis-contract]] (FMX-93 — non-tactical signals + run-analysis contract)

## Related

- Research: [[../60-Research/manager-archetype-roguelite-2026-05-27]] ·
  [[../60-Research/raw-perplexity/raw-roguelite-meta-progression]] ·
  [[../60-Research/late-game-systems]]
- Mode / feature: [[mode-create-a-club-roguelite]] ·
  [[../20-Features/feature-roguelite-mvp-first-playable]]
- [[README]] - Game Design Log
