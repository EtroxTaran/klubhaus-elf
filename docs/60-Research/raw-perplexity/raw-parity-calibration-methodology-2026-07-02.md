---
title: "Raw capture — Parity calibration methodology, anchor agents & Auto-Coach<->AI policy (FMX-218)"
status: raw
tags: [research, raw, dual-mode, fork-resolution]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-218
sourceType: external
---

# Raw capture — FMX-218 parity calibration methodology

Raw external-research capture for the three open prerequisites ADR-0135 leaves
undecided: (1) ownership + versioning of the `ExpertReference`/`NaiveBaseline`
anchor agents; (2) harness cadence sizing (per-merge smoke vs nightly vs
per-release soak across GD-0043 T2/T3/T4 given the ~15x policy-pair cell
multiplier); (3) whether the Auto-Coach and the AI-league opponent managers
share one evaluation policy or are separate modules. Parity band NUMBERS stay
OPEN/harness-gated — this note captures methodology only.

Queries run: 3 Perplexity (Sonar) + 3 Exa web searches. Substantive answers
below with source URLs. Low-confidence flags preserved from the tools.

---

## Q1 (Perplexity) — Owning & versioning reference/baseline agents so scores stay comparable

**Question:** best practices for owning and versioning "reference agents" /
"baseline agents" used as fixed anchors in regression/eval harnesses; how
benchmark agents are versioned (Stockfish/CCRL, golden-master, MLflow Model
Registry, DVC, W&B artifacts); who owns them (infra/eval vs domain team);
should a fixed naive-baseline + expert-reference be checked into the same
versioned pack they gate, or a separate agent registry.

**Answer (substantive):**

- **Treat reference agents as immutable, versioned artifacts.** Modern ML
  tooling (MLflow Model Registry, DVC, W&B Artifacts) all model artifacts as
  immutable objects identified by *name + version/alias* tied to a source
  commit hash. A reference agent "is just a model with additional semantic
  meaning (anchor for regression/rating)." MLflow: named versions (e.g.
  `chess-agent` v5) with immutable artifacts + movable production/staging
  aliases. DVC: content-hash-tracked, tied to Git commits. W&B: content-
  addressed, immutable per version, reproducible.
- **A strength number is only interpretable if BOTH the reference artifact AND
  the evaluation harness (rules, time control, seeds, environment build) are
  versioned and reproducible** — these collectively define the "rating scale."
  Best practice tracks eval config (opponent set, environment, seeds, hardware)
  as run metadata alongside the model version. A rating like "Elo 3200" is not
  intrinsic; it is defined relative to opponent set + environment + rules +
  randomness.
- **Versioning scheme:** SemVer-style — MAJOR = rules/reward/API change that
  breaks comparability; MINOR = algorithm improvement keeping eval protocol
  compatible; PATCH = bugfix not altering evaluated strength. Name + semantic
  version + content hash + Git commit.
- **Rating-list anchoring precedent (low-confidence analogy):** rating lists
  like CCRL/Stockfish keep a **fixed reference engine/build that is never
  retroactively changed**; all ratings are relative to it. If time control or
  hardware changes they either re-establish a new baseline (keeping the old
  list) or run "bridge" matches to estimate a conversion between scales. Same
  principle as fixed ML benchmark suites (GLUE, SuperGLUE, Atari) staying fixed
  across papers to preserve comparability.
- **Ownership split (well-supported):** infra/QA/MLOps/eval-platform team owns
  the *evaluation system* — registries, storage, access control, lifecycle,
  CI/CD eval pipelines, operational SLOs. Domain/model team owns *which*
  baselines exist and *what they mean* — the semantic definition of "naive" and
  "expert," metric interpretation, and sign-off on any baseline change. Change
  control: domain team proposes baseline changes; infra implements/rolls out
  via registry with code-review-style approval; documented in a changelog with
  rationale + expected metric impact.
- **Co-locate vs separate registry (strong pattern):** SEPARATE the lifecycle
  of baselines from the artifact-under-test. Store baselines in an independent
  registry/namespace and REFERENCE them by stable ID in the evaluation config
  (`candidate = X`, `naive_baseline = chess-random-v1`,
  `expert_baseline = stockfish-2800-v3`, `eval_suite = chess_std_v1`). Reasons:
  (a) different lifecycles — baseline stable for long periods, candidate changes
  often; bundling forces replication or risks accidental baseline mutation; (b)
  reusability across projects/experiments; (c) auditability ("when did our
  expert baseline change?"); (d) reproducibility — re-run historical evals with
  the exact same baseline version via a stable ID. Bundling everything in one
  "golden master" release is a *low-confidence* small-team/prototype pattern
  that becomes unwieldy at scale.
- **Never change a baseline in place; always create a new version.** When a
  baseline or suite changes, mark historical metrics as "on suite X, baselines
  A/B" and, if needed, run bridge evals to map old to new scales.

Sources: MLflow Model Registry docs; DVC docs; Weights & Biases Artifacts docs;
LaunchDarkly software-release-versioning guide; ModernRequirements version-
control best practices; freestyle.sh "version control for AI agents";
decagon.ai agent-versioning. (Perplexity flagged the CCRL-anchoring analogy and
the explicit infra/domain owner split as low-confidence but "consistent with
common MLOps and game-AI practice.")
URLs: https://launchdarkly.com/blog/software-release-versioning/ ;
https://www.modernrequirements.com/blogs/version-control-best-practices/ ;
https://www.freestyle.sh/blog/engineering/version-control-for-ai-agents ;
https://decagon.ai/blog/decagon-agent-versioning

---

## Q2 (Perplexity) — Tiering test cadence for expensive stochastic Monte-Carlo suites

**Question:** best practice for tiering per-merge smoke vs nightly full runs vs
per-release soak for expensive stochastic Monte-Carlo suites (game-balance
regression, self-play eval); test pyramid applied to slow sim gates; picking a
fast smoke subset (sentinels/canaries); controlling combinatorial explosion
(pairwise/orthogonal arrays); published game-studio/ML practice.

**Answer (substantive):**

- **Staged CI pipeline is the established shape:** small deterministic /
  sim-lite set on every merge; broader stochastic sweeps nightly/weekly; very
  large "soak" runs as a release gate / pre-launch activity. Grounded in the
  **test pyramid** (Fowler: many fast unit tests, fewer service tests, few
  end-to-end/system tests) and Google Testing Blog "Just Say No to More
  End-to-End Tests" (minimize slow global tests, push checks down; run expensive
  tests on **post-submit / batch** pipelines, not every commit).
- **Typical tiering for sim-heavy systems:**
  - *Per-merge/PR (minutes):* deterministic or short-horizon tests + a *very
    small* stochastic subset; goal fail-fast on API/invariant/egregious-balance
    breakage. Keep CI under ~10–20 min.
  - *Nightly/continuous (hours):* broader Monte-Carlo / self-play sweeps over
    key modes/agents/parameter ranges; track drift in global metrics (win
    rates, resource curves, exploit frequency) vs the last nightly baseline;
    typically non-blocking-but-monitored.
  - *Release/soak (hours–days):* high-volume runs + stress/extreme
    configurations; verify statistical stability (narrow CIs) of shipped
    balance; often a HARD release gate.
  - Implemented as separate CI jobs with own schedule + gating rules, and
    granular test tags (`@unit`, `@slow`, `@monte_carlo`, `@soak`) so suites are
    selectable by time budget/tier.
- **Choosing sentinel/canary scenarios:** high-leverage cells where small
  parameter changes produce large visible effects (early-game economy openings,
  known knife-edge matchups, exploit-prone scenarios); historical
  regression hot-spots (permanent regression tests around what has broken
  before); canary metrics updated per-merge with LIMITED samples (tens–hundreds
  of games — trade statistical power for speed, sensitive enough to catch gross
  regressions); short-horizon "prefix" sims (first N ticks/turns) to catch
  crashes and early-balance shifts cheaply. Large studios/RL teams maintain
  "golden" scenario sets curated by designers + researchers, re-run on every
  change at small sample counts (low-confidence; from talks).
- **Combinatorial explosion — pairwise / t-way (NIST):** most reported software
  failures are triggered by interactions of FEW parameters; pairwise (2-way)
  covering arrays detect a very large fraction of faults, 3-way/4-way capture
  nearly all remaining with still-manageable suite size (Kuhn, Wallace & Gallo,
  NIST *Combinatorial Testing*). Apply: identify independent axes (map/env,
  faction/agent, difficulty/ruleset, toggles); generate pairwise or 3-way cell
  sets as the NIGHTLY matrix; add hand-picked high-order-interaction scenarios
  on top. Per-merge = a few sentinels (not full coverage); nightly = pairwise/
  3-way; soak = nightly matrix + stress combos + higher t-way on critical axes.

Sources: Martin Fowler (Test Pyramid; Continuous Integration); Google Testing
Blog ("Just Say No to More End-to-End Tests"); NIST Combinatorial/Pairwise
Testing (Kuhn, Wallace, Gallo). Game-studio nightly-sweep vs soak specifics
flagged low-confidence (talks/anecdote, but consistent with the general
guidance).

**Q2 corroboration (Exa) — concrete game-studio tiering tables:**

- **ButterStack "Game Dev Testing & QA" (2026-03-13):** explicit budget table —
  Unit tests every commit <5 min; Boot/smoke every build <10 min; Integration
  nightly <30 min; Full smoke suite nightly <30 min; Performance tests nightly
  + release candidates <45 min; Full platform matrix release-candidates-only
  <2 h. Jenkins `when{}` blocks gate smoke to Test/Shipping/nightly triggers;
  "keeps commit builds fast while still catching regressions before QA."
  URL: https://www.butterstack.com/blog/game-dev-testing-qa-pipeline/
- **Riot Games — Legends of Runeterra CI/CD:** merge pipeline runs functional
  (pytest) + performance + memory-budget tests; **"run the game at 10x speed
  and parallelize... several hundred functional tests in just a few minutes,"**
  reusing a single game server hosting many concurrent matches. Demonstrates the
  speed-up lever (accelerated sim + parallel + shared server) that makes a
  larger per-merge subset affordable.
  URL: https://live-rg-engineering.pantheonsite.io/news/legends-runeterra-cicd-pipeline
- **Semaphore game CI guide (2026-03-27):** "split workflows — fast checks
  (lint, unit) on every commit; full builds on merge or nightly."
  URL: https://semaphore.io/how-to-manage-ci-cd-for-game-development-unity,-unreal,-large-binaries
- **opensources.live CI strategies (2026-02-16):** retention/trigger tiers —
  PR: quick smoke + unit, 7d retention; nightly: full build + large test
  suites, retain last 30 nightlies; release: 365d retention, pinned gold builds.
  URL: https://opensources.live/ci-strategies-for-large-game-repositories-artifact-storage-b
- **Bugnet smoke-test guide (2026-04-10):** "short duration test (60s) on every
  commit and a longer test (10 min) on nightly" — the per-merge/nightly horizon
  split made concrete.
  URL: https://bugnet.io/blog/how-to-build-automated-smoke-tests-for-game-builds

**Q2 corroboration (Exa) — statistical sample-sizing (sizes the soak, not the numbers):**

- **DEV "Your AI Agent Evaluation Is Lying to You" (2026-05-08):** Wilson-CI
  minimum games to distinguish a true win-rate from 50% at 95%: **p=0.60 → ~93
  games; p=0.55 → ~381; p=0.52 → ~2401.** "Most agent improvements are in the
  52–58% range... you need hundreds of games, not ten." For TrueSkill/Elo
  ladders: set a **sigma floor** — don't compare agents until sigma is below the
  gap you care about; gate a merge only when sigma < threshold AND the CI
  doesn't overlap the agent it must beat. DIRECTLY sizes the parity harness:
  ADR-0135's head-to-head band is 52–57%, i.e. a ~2–7pt edge over 50%, so
  distinguishing "inside vs outside band" per cell needs on the order of
  hundreds-to-thousands of seeded matches PER CELL — a per-release soak
  magnitude, not per-merge.
  URL: https://dev.to/diven_rastdus_c5af27d68f3/your-ai-agent-evaluation-is-lying-to-you-why-10-test-runs-prove-nothing-1ij2
- **Wu et al., "On Strength Adjustment for MCTS-Based Programs" (AAAI 2019):**
  strength-vs-Elo correlation studies used **250 games per benchmark** point;
  stochastic-analysis sets ~2000 games per threshold. Named precedent for the
  per-cell game counts strength calibration needs.
  URL: https://doi.org/10.1609/aaai.v33i01.33011222
- **Rupp et al., "Simulation-Driven Balancing... with RL" (arXiv 2503.18748):**
  RL/self-play framed as PCG balancing task — the learned-best-response upgrade
  path for the `P_pro_opt`/expert anchor.
  URL: https://arxiv.org/html/2503.18748v1

---

## Q3 (Perplexity) — Shared evaluation policy for Auto-Coach vs AI opponents, or separate?

**Question:** should a player-facing assistant/auto-play and the AI opponents
SHARE one evaluation engine or be separate? Precedents for shared-engine +
strength-throttle (Stockfish Skill Level / UCI_LimitStrength); architecture
tradeoff (shared service vs separate modules — assistant must explain +
propose-only, opponent need not); coupling risks; DDD guidance on one bounded
context vs two with a shared kernel.

**Answer (substantive):**

- **Verdict: share the core evaluation/search ENGINE as a shared KERNEL, but
  implement opponent-AI and assistant/auto-play as SEPARATE modules / bounded
  contexts that call into it.** "The more explanation, safety, and UX
  requirements you have on the assistant side, the stronger the case for
  separation."
- **Two-layer model:** (1) core computation layer — search, evaluation,
  scoring, state prediction; (2) role/interaction layer — "opponent" vs
  "assistant/auto-play," including explanation, UI, safety.
- **Benefits of the shared core:** behavioral CONSISTENCY (assistant advice
  matches what a same-difficulty opponent would do — no "engine mismatch"); DRY
  / lower maintenance (one place for search+heuristics; improvements and bug
  fixes benefit both); shared testing/validation (validate the engine once,
  apply in multiple roles; enables self-play as a proxy for how good assistant
  recommendations are).
- **Why the higher-level modules must differ:** the ASSISTANT must explain WHY
  it recommends, be **propose-only** with human veto, need guardrails/logging/
  audit; the OPPONENT need not explain, is optimized for challenge/robustness/
  performance under real-time budget. Different non-functional constraints
  (latency, logging, auditability) and governance (transparency, human
  oversight) apply far more strongly to the assistant.
- **Risks if HEAVILY coupled (one undifferentiated module):** user-trust /
  perceived-fairness damage (players suspect recommendations are "rigged" to
  push them into traps); misaligned incentives (assistant "interesting
  experience" vs opponent "win" entangled → bugs make the assistant recommend
  moves that favor the engine's opponent personality); governance/compliance
  complexity (can't cleanly scope different policies to "adversarial NPC" vs
  "player assistance").
- **Risks if FULLY separated (no shared kernel):** behavioral DIVERGENCE
  (assistant advice drifts from what strong opponents actually do); DUPLICATED
  effort / double maintenance (every tactics improvement reimplemented +
  revalidated twice); inconsistent domain evaluation (lose the ability to use
  engine-vs-engine self-play as a proxy for assistant quality, complicating
  debugging).
- **DDD guidance:** ONE bounded context only if the ubiquitous language is
  identical, rules differ only by configuration ("opponent strength" vs "advice
  strength" as parameters of the same operation), and non-functional/governance
  needs are similar — "workable if your assistant is very lightweight and you
  don't need deep explanation or separate audit." Once explanation, logs, and
  human-centered UX enter, prefer **two bounded contexts over a SHARED KERNEL**:
  shared kernel = core eval fn (state→score), search, domain objects; Opponent
  context wraps it with difficulty scaling/personality/tactics (no explain
  duty); Assistant context wraps it with candidate generation + explanation
  ("we recommend X because it leads to higher-value states"), logging/telemetry,
  and propose-only enforcement. Maintain rigorous JOINT governance around the
  shared kernel (shared tests, versioning, change-control to prevent divergent
  heuristics). "Avoid a single undifferentiated module that both attacks and
  advises the player."

Sources: DDD shared-kernel / bounded-context patterns (Evans/Vernon lineage,
described generically); Microsoft Responsible AI (transparency, human
oversight); agent-architecture survey arXiv 2503.12687. Perplexity flagged the
games-specific extrapolations as "reasoned but low-confidence" because
literature on this exact pattern in games is sparse.

**Q3 corroboration (Exa) — Stockfish primary source (shared engine + throttle):**

- **Stockfish official docs (UCI & Commands):** `Skill Level` (spin 0–20,
  default 20) — "Internally, MultiPV is enabled, and with a certain probability
  depending on the Skill Level, a weaker move will be played." `UCI_Elo`
  (1320–3190) — "calibrated at a time control of 120s+1s and **anchored to CCRL
  40/4**." UCI_LimitStrength "enables weaker play aiming for an Elo rating."
  URL: https://official-stockfish.github.io/docs/stockfish-wiki/UCI-%26-Commands.html
- **Stockfish FAQ:** "Skill Level and UCI_Elo make Stockfish play weaker by
  intentionally choosing suboptimal moves."
  URL: https://official-stockfish.github.io/docs/stockfish-wiki/Stockfish-FAQ.html
- **Stockfish source `src/search.h` / `search.cpp`:** the `Skill` struct — "used
  to implement strength limit. If we have a UCI_Elo, we convert it to an
  appropriate skill level, **anchored to the Stash engine** ... Skill 0..19
  covers CCRL Blitz Elo 1320..3190." Mechanism: full-strength search with
  `MultiPV` enabled to retrieve a candidate set, then `pick_best()` selects a
  sub-optimal move with probability tied to `level` — i.e. throttle SELECTION,
  not understanding. Same full-strength engine plays the opponent side.
  URL: https://github.com/official-stockfish/Stockfish/blob/253aaefb/src/search.h
  Confirms ADR-0135 §5's "throttled expert" as a shipping primary-source
  precedent: ONE engine, weakened via candidate-set temperature, externally
  anchored to a fixed rating list (CCRL) — exactly the E-anchor + throttle
  pattern.

---

## Cross-note synthesis flags (for the ADR/GDDR authors)

- Anchor agents (`ExpertReference` E, `NaiveBaseline` N) are prerequisite
  artifacts that do not yet exist. Registry pattern: separate immutable
  versioned artifacts referenced by stable ID from the parameter pack, NOT
  bundled — but ADR-0135 §2 currently says "versioned agents INSIDE its
  parameter pack." The evidence favors: pack references anchor IDs + eval-suite
  ID; the anchors live in a shared agent/artifact registry. (Reconcilable: the
  pack VERSION-PINS anchor + suite IDs; the bytes live in the registry.)
- Cadence: 52–57% head-to-head band ⇒ hundreds–thousands of seeded matches per
  cell to resolve in/out-of-band ⇒ full parity sweep is per-release soak (T3),
  nightly runs a pairwise/sentinel subset, per-merge runs a handful of sentinels
  at low sample count for fail-fast only. Exact seed counts are OPEN (harness-
  derived), same as the band numbers.
- Shared eval: Auto-Coach = same engine as AI-league managers (shared kernel),
  separate bounded context adding explanation + propose-only. ADR-0135 §5 A
  already asserts "same evaluation the AI-league managers use"; this note
  supplies the module-boundary rationale (two contexts, one kernel) and the
  primary-source (Stockfish) precedent.

## Could-not-verify / low-confidence

- No public engineering write-up of a *game studio* running a self-play PARITY
  regression gate specifically (as opposed to general balance sweeps); the
  cadence recommendation is assembled from adjacent CI + sample-sizing sources.
- CCRL-as-fixed-anchor framing is a widely-known-practice analogy, not a
  formally documented policy (Perplexity low-confidence).
- DDD shared-kernel-vs-two-contexts guidance is generic best practice
  extrapolated to this domain (Perplexity low-confidence for the games specific).
