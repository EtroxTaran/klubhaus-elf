---
title: Raw capture — parity-architecture placement, soak proxies, higher-order interaction residual (FMX-222)
status: raw
tags: [research, raw, dual-mode, fork-hardening]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-222
sourceType: external
---

# Raw capture — parity-architecture placement / soak proxies / higher-order interaction residual (FMX-222)

Raw web-research capture grounding the three resolvable parity-architecture
sub-forks that FMX-222 proposes to close as updates to
[[../../10-Architecture/09-Decisions/ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]:

1. **Tactical Evaluation Core placement** — the stateless shared eval kernel
   (ADR-0135 §5) as a Shared-Kernel *supporting* subdomain, with an
   infra-owns-system / Nico+domain-owns-semantics ownership split for the
   `ExpertReference`/`NaiveBaseline` anchors (ADR-0135 §2).
2. **Reduced-horizon soak proxies** — acceptable for the most expensive
   off-pitch cells (transfers/scouting ~50-season delegation soak, ADR-0135
   §4.2 / open fork 13) or full-horizon mandatory.
3. **Higher-order interaction residual risk** — accept the residual >t-way
   override-combo risk between full per-release sweeps (ADR-0135 §6 nightly
   covering-array / open fork 14) with a named monitoring trigger, or mandate
   periodic higher-strength sweeps.

Band NUMBERS and SPRT α/β/indifference parameters stay explicitly
DEFERRED/engine-gated — this capture grounds METHOD only, per the ADR-0135
open-fork discipline. Nothing here is a decision.

---

## Q1 — DDD: is a Shared Kernel a subdomain type or an integration pattern, and can a stateless shared computation module be a "supporting subdomain"?

**Tool:** perplexity-ask.

**Question asked:** In DDD, how is a Shared Kernel classified/governed relative to
core/supporting/generic subdomains? Is it a subdomain type or a context-mapping
pattern; can a stateless shared computation module be modeled as a "supporting
subdomain" shared between two BCs; what are the documented risks (coupling,
joint change-control, single owning team, explicit change agreement) per Evans /
Vernon / modern practice; and what governance prevents semantic leakage into
consuming contexts?

**Substantive answer (captured):**

- **A Shared Kernel is a *context-mapping relationship / integration pattern*,
  NOT a subdomain type.** It is orthogonal to the core/supporting/generic
  *subdomain* classification. Evans defines it as two models tied by a common
  subset that is shared and jointly managed — one of the Context Map
  relationships alongside Customer/Supplier, Conformist, ACL (DDD ch. 14).
  Context Mapper (tooling based on Evans/Vernon) states plainly: "The Shared
  Kernel pattern describes a relationship between two bounded contexts and is
  used on a context map." Core/supporting/generic answer a *different* question
  ("how strategically important is this problem space / how much do we invest?")
  and BCs↔subdomains are not necessarily 1:1.
- **Consequence for FMX-222:** modeling the stateless Tactical Evaluation Core
  as a **supporting subdomain** AND implementing it as a **Shared Kernel**
  library between AI World Simulation and Tactics/Training is *fully compatible
  with DDD and orthogonal* — the two labels are on different axes. A supporting
  subdomain is business-specific but not strategically core; a Shared Kernel is
  one legitimate way to *implement* such a subdomain across BCs (vs duplication
  or ACL). Good fit when the shared thing is "a business-specific calculation
  engine that must be identical across contexts... stateless calculation engine
  encapsulating domain rules, with no persistence or state."
- **Documented Shared-Kernel risks (Evans/Vernon/modern):**
  1. **Tight coupling** — Vernon (IDDD p.92): "Sharing part of the model and
     associated code forms a very intimate interdependency, which can leverage
     design work or undermine it." Evolution of one context is constrained by
     the other; deployments/refactors are no longer fully independent.
  2. **Joint change-control / coordination overhead** — Vernon: shared stuff
     "shouldn't be changed without consultation with the other team." Evans: any
     change must be coordinated. Requires CI + automated testing to guard side
     effects.
  3. **Ownership must be explicit** — Evans lists options incl. one team as
     designated owner with final say; modern practice: "nowadays handled by a
     platform team." Without a designated owning team the kernel becomes a
     commons nobody stewards.
  4. **Scope creep** — "keep the shared kernel as small as possible; if a lot of
     model code ends up there, it may be a sign the contexts should be merged."
  5. **Semantic leakage / model drift** — if contexts begin needing *different*
     meanings for the "same" concept, the kernel encodes one context's semantics
     into another. Guidance: only genuinely-shared concepts belong; otherwise
     use ACL / separate models and share only lower-level non-semantic utilities
     (value objects, pure computations).
  6. **Operational coupling** — CI/CD, semantic versioning, breaking-change
     policy, shared regression suite / contract tests, synchronized releases.
- **Governance to prevent semantic leakage (convergent recommendation):** keep
  the kernel small/stable/truly-shared; make ownership explicit (platform/
  enabling team owns it, consumers treat it X-as-a-Service and contribute via
  PR/change proposals, not unilateral edits); strict change-control with
  *semantic design reviews* + ADRs; versioned compatibility contracts (a change
  that would introduce differing semantics is either rejected or segregated into
  a new type/module); keep kernel types "thin" (pure value objects + pure
  computation, no context-specific workflow/policy). When semantics diverge,
  stop sharing and translate.

**Direct relevance to ADR-0135 §5:** this is exactly the ADR's stated design —
share a stateless *kernel* over the published `TacticSnapshot` contract (thin,
pure state→value + candidate generation, "nothing else"), NEVER a *policy*
(which carries difficulty/personality/explain-duty semantics). The DDD
literature confirms: sharing a thin stateless kernel is the safe form; sharing a
policy is the semantic-leakage anti-pattern the ADR already forbids. The
"supporting subdomain + Shared Kernel" framing is orthogonal-axis-correct, so
proposing it as a *supporting* subdomain (not a new core BC) is defensible.

**Sources:**
- Microsoft Press / De Angelis, DDD strategic (Evans summary, kernel ownership):
  https://www.microsoftpressstore.com/articles/article.aspx?p=3192407&seqNum=3
- DDD Practitioners glossary — Shared Kernel (bounded-context relationship):
  https://ddd-practitioners.com/home/glossary/bounded-context/bounded-context-relationship/shared-kernel/
- Vaadin — Strategic DDD part 1 (keep kernel small; CI + auto-test):
  https://vaadin.com/blog/ddd-part-1-strategic-domain-driven-design
- Context Mapper docs — Shared Kernel is a BC relationship:
  https://contextmapper.org/docs/shared-kernel/
- Build Simple — Strategic DDD balancing act (platform-team ownership, change
  review boards, coupling risks):
  https://buildsimple.substack.com/p/strategic-ddd-the-balancing-act-of
- Nilus — Shared Kernel in DDD microservices (use sparingly; cost-of-divergence
  vs cost-of-coupling): https://www.nilus.be/blog/shared_kernel_in_domain-driven_design_microservices/

Confidence: high (multiple convergent named DDD sources; Vernon/Evans primary
concepts consistently quoted).

---

## Q2 — Team Topologies: platform-owns-system / domain-owns-semantics split for a shared eval / anchor-model registry

**Tool:** exa web_search.

**Question asked:** Team Topologies platform-team-owns-the-substrate / domain-
team-owns-the-semantics ownership split for a shared ML evaluation / anchor model
registry between infrastructure platform and domain experts.

**Substantive answer (captured, cross-source):**

- **The canonical Team-Topologies split is by-substrate:** "platform team owns
  the substrate; specialized teams consume it." For a **model registry**
  specifically: "The platform team operates the registry; service teams consume
  it... platform owns Kubernetes, GPU scheduling, the registry's infrastructure;
  the MLOps team owns the training pipelines, evaluation gates, deployment
  patterns." ML teams' core expertise is "model training, evaluation, and
  improvement"; operating a registry as infra is outside that — "ML teams can
  certainly use the registry; they shouldn't have to operate it."
- **Evaluation harness = platform; eval sets + thresholds = product/domain.** An
  AI-platform RACI table assigns the **evaluation harness to Platform** ("offline
  eval infrastructure is shared; eval datasets per product") and **domain corpora
  to Product** ("the platform provides the ingest pipeline; the team owns the
  corpus"). "A shared harness runs offline suites against registered models and
  prompts. Product teams supply their eval sets and their thresholds. The
  platform provides the runners, the dashboards, and the promotion gate."
- **Own-by-outcome, make the handoff explicit.** "Platform owns 'workloads can
  deploy reliably'; ML owns 'models deliver accurate predictions.'" The failure
  mode named repeatedly: gaps where "nobody owns the problem" — the fix is an
  explicit contract: ML produces a validated artifact with defined requirements;
  platform provides templates/rollout gate; the mutation flows through the
  platform change-management process.
- **Registry mutations flow through platform change-management; X-as-a-Service.**
  "The model/prompt/index registry is a platform service. Registry mutations flow
  through the platform change-management process." Platform↔stream-aligned
  relationship "should primarily be X-as-a-Service... documented interfaces, not
  asking the platform team to do work for them." Anti-patterns named: the
  "throw-it-over-the-wall" handoff and "no platform, all custom."

**Direct relevance to ADR-0135 §2:** this is a near-exact external analogue of
the proposed **infra-owns-system / Nico+domain-owns-semantics** split. Mapping:
platform/eval-infra team ← "owns the evaluation SYSTEM: registry, storage, access
control, CI eval pipelines, eval-suite build"; Nico/domain ← "owns what 'expert'
and 'naive' MEAN + signs off any anchor change" (the eval-set/threshold/semantic
side the sources assign to product/domain). The sources also independently
supply the exact change-control shape the ADR wants: **domain proposes an anchor
change with expected metric impact; infra rolls it out via the registry under
code-review + changelog** = "ML produces validated artifact... mutation flows
through platform change-management process." The content-addressed immutable
registry (MLflow/DVC/W&B) the ADR §2 cites is corroborated as the standard
"platform owns the registry" substrate.

**Sources:**
- Socratopia — MLOps & Model Lifecycle (platform owns substrate/registry; ML
  consumes): https://www.socratopia.app/library/cloud-native-platform-engineering-en/chapter-21
- COMPEL Framework — Architecture Runway: Building the AI Platform (RACI:
  eval harness = platform, eval datasets/thresholds = product; registry mutations
  via platform change-management):
  https://www.compelframework.org/articles/architecture-runway-building-the-ai-platform
- Luca Berton — Platform + SRE + ML team contract (own-by-outcome; explicit
  handoff): https://lucaberton.com/blog/platform-sre-ml-team-contract/
- Team Topologies — key concepts: https://teamtopologies.com/key-concepts
- AI Solutions Wiki — Team Topologies for AI (platform provides ML platform incl.
  model registry as X-as-a-Service): https://ai-solutions.wiki/frameworks/team-topologies-ai/
- Agent-Axiom — Platform Team vs Product Teams (platform owns eval substrate +
  rollout gate; product owns acceptance criteria / domain logic):
  https://agent-axiom.github.io/agent-arch/en/book/part-vi/chapter-14/

Confidence: high for the ownership-split pattern (multiple convergent 2026
platform-engineering sources); the FMX mapping is this note's inference.

---

## Q3 — Simulation: when is a reduced/truncated horizon a valid proxy for a long-horizon soak, and what biases does truncation add?

**Tool:** perplexity-ask.

**Question asked:** In discrete-event / agent-based simulation, when is a reduced/
truncated time-horizon a valid proxy for an expensive long-horizon (50+ period)
soak/steady-state evaluation, and what biases does truncation introduce
(terminating vs steady-state, Welch/Law-Kelton warm-up, surrogate metrics/
metamodels, rare compounding/tail/absorbing-state failures)?

**Substantive answer (captured):**

- **Core rule:** a reduced horizon is valid "only when your decision metric is
  itself a short-horizon quantity, or when you can justify the system has already
  reached the regime you care about and truncation error is controlled by proper
  warm-up / initialization-bias handling." For **long-horizon compounding, soak,
  or steady-state** evaluations a short run is "generally NOT a faithful proxy
  unless you replace the full-horizon outcome with a validated surrogate metric
  or metamodel and explicitly accept the fidelity loss."
- **Terminating vs non-terminating:** terminating models have a natural endpoint;
  truncation is fine if the horizon matches the real decision. Non-terminating /
  steady-state models have no natural end; the objective is a long-run average /
  equilibrium, so "arbitrary truncation reintroduces both initialization bias and
  finite-horizon bias" — standard practice is run-long-then-discard-warm-up or
  formal steady-state methods (Welch's method to identify/trim the transient
  prefix).
- **Why full-horizon matters for compounding KPIs:** early observations can
  dominate the trajectory, but "late failures and path-dependent effects can
  still materially change the result." A short proxy "typically overstates
  stability, understates variance, and misses tail risk."
- **Surrogates are acceptable only with explicit validation:** reduced models /
  response-surface metamodels are legitimate substitutes "when they are built to
  approximate a target output and their error bounds or loss of fidelity are
  acknowledged" and validated against the target quantity. Validity depends on
  how the reduction changes sensitivity, not merely time-scale separation.
- **The specific danger = rare compounding / tail / absorbing-state failures:**
  "a short-horizon proxy can completely miss rare events that only accumulate
  late, including insolvency, resource exhaustion, cascading defaults..." — the
  system "may appear healthy for many periods and then abruptly enter an
  absorbing bad state." With an absorbing failure state, entry probability "is
  low in early periods and much higher after cumulative exposure; a truncated run
  underestimates that probability simply because it does not allow enough time
  for the failure mechanism to manifest."
- **Defensible when:** the real decision is short-horizon; OR the metric is
  *empirically shown to stabilize* before the truncation point; OR justified
  warm-up removal + long-enough remaining segment; OR the reduced output is a
  *validated proxy with known error*. **Not defensible when** the quantity is a
  long-run survival / ruin / steady-state / path-dependent compounding measure
  and the short run is used merely to save time — "truncation changes the
  estimand, not just the estimator."

**Direct relevance to ADR-0135 §4.2 / open fork 13:** the off-pitch transfers/
scouting cells gate precisely on *compounding, path-dependent* observables
(league-position distribution, squad-value trajectory, wage-efficiency band over
a soak horizon; off-pitch packet Finding 10) AND on a hard **no-domination /
insolvency-tail** invariant — an absorbing-state-shaped failure. This is the
textbook "not defensible to blindly truncate" case: a reduced-horizon proxy would
systematically *understate* the late compounding gap and *underestimate* the
insolvency/domination tail probability, i.e. **overstate parity** — the same
single-direction error ADR-0135 §2 already fights for anchors. The honest
recommendation this supports: reduced-horizon proxies are acceptable ONLY as a
CI-speed *trend/screening* instrument (nightly, non-gating), never as the
gate-bearing per-release soak, and only with an **explicit fidelity caveat + y a
per-metric stabilization check** (empirical demonstration that the proxy horizon
has reached the regime, Welch-style) — full-horizon (economy runbook `soak:50y`)
stays MANDATORY for the gate-bearing no-domination / trajectory distributions.
This aligns with ADR-0135 §6's existing "per-release soak = the only HARD gate"
and keeps values OPEN.

**Sources:**
- Haas (UMass CS590M) lecture — steady-state simulation, initialization bias,
  warm-up: https://people.cs.umass.edu/~phaas/CS590M/slides/slecture10a.pdf
- Rossetti, *Simulation Modeling and Arena* — finite vs infinite horizon
  (terminating vs steady-state; truncation): https://rossetti.github.io/RossettiArenaBook/ch3-finiteVsInfinite.html
- (canonical texts referenced by the answer) Averill Law, *Simulation Modeling
  and Analysis*; Banks et al., *Discrete-Event System Simulation*; Welch
  initialization-bias procedure.
- Quasi-steady-state reduction fidelity depends on sensitivity, not just
  time-scale separation: https://pmc.ncbi.nlm.nih.gov/articles/PMC4129492/

Confidence: high for the terminating/steady-state + truncation-bias theory
(canonical simulation texts); the mapping to the FMX off-pitch absorbing-state
cells is this note's inference.

---

## Q4 — Combinatorial testing: empirical t-way fault coverage and residual >t-way risk

**Tool:** perplexity-ask.

**Question asked:** In combinatorial interaction testing / covering arrays, what
is the empirical fault-detection coverage of pairwise (2-way) and t-way testing,
and the residual risk of faults triggered only by higher-order (>t-way)
interactions? (NIST interaction-rule 1..6-way cumulative distribution; why higher-
strength arrays grow combinatorially / are infeasible per release; risk-based
selection of sentinel higher-strength combos + production monitoring.)

**Substantive answer (captured):**

- **NIST "interaction rule":** "most software bugs and failures are caused by one
  or two parameters, with progressively fewer by three or more," and many
  failures are revealed only when multiple conditions are true. Pairwise is
  useful but "it is not enough to test all pairs of values, because many failures
  are only revealed when more than two conditions are true." The empirical
  cumulative curve rises quickly through 2-way then keeps improving through
  3/4/5/6-way; across the studied systems, **4-way to 6-way coverage was often
  enough to find ALL faults discovered** — but with explicit "no guarantee of
  finding all defects."
- **Residual-risk statement (quotable form):** "if your test suite covers all
  interactions up to strength t, then any defect that requires >t-way coincidence
  remains potentially undetected, though such defects appear rarer in the
  empirical NIST studies." NIST is explicit that covering arrays give "no
  guarantee of finding all defects" and that going beyond 4→6-way yields
  diminishing returns vs test-cost growth.
- **Why higher strength is infeasible per release = combinatorial explosion:**
  the number of required combinations grows very rapidly with parameter count,
  value counts, and strength t; SP 800-142 frames combinatorial testing as the
  way to *avoid* exhaustive testing while keeping strong assurance, because
  exhaustive enumeration is generally impossible for realistic systems.
- **Recommended residual-risk management = risk-based, not exhaustive:** "select
  specific higher-strength combinations for high-risk subsystems, include known
  problematic or *sentinel* configurations, and continue monitoring in production
  so rare interaction failures can be detected after deployment." I.e. use
  2-way/3-way broadly, raise strength selectively where risk justifies, and treat
  operational telemetry/incident feedback as part of the assurance strategy.

**Direct relevance to ADR-0135 §6 / open fork 14:** the ADR already runs a
**pairwise / t-way covering array generated FROM the slot/policy-pair taxonomy**
nightly, plus **2-3 named sentinel override combos** (e.g. "Easy-everywhere +
Expert-tactics", the highest-leverage combo where the optimizer edge lives) on
the per-merge smoke and per-release soak. NIST's guidance is a direct
endorsement of *exactly* this structure: broad t-way coverage + risk-based
sentinel selection of the highest-risk higher-order configuration + production
(here: T4 mode-split telemetry) monitoring. The literature supports **accepting
the residual >t-way risk** (it is empirically rare and full higher-strength
sweeps are combinatorially infeasible per release) **provided** there is a named
monitoring trigger. The honest recommendation this supports: accept the residual
with (a) the taxonomy-generated t-way array as the standing coverage, (b) the
sentinel combos as the risk-based higher-strength patch, and (c) a **named
monitoring trigger** — T4 consent-gated mode-split parity telemetry, escalating
to an ad-hoc higher-strength sweep on any out-of-envelope field signal — rather
than mandating a routine periodic higher-strength sweep (which buys little over
diminishing returns and cannot be afforded at the ~15x cell multiplier). Values
(which strength t, which extra combos) stay OPEN/engine-gated.

**Sources:**
- NIST ACT-for-Software — interactions involved in software failures (the
  interaction rule, 1..6-way cumulative):
  https://csrc.nist.gov/projects/automated-combinatorial-testing-for-software/combinatorial-methods-in-testing/interactions-involved-in-software-failures
- NIST SP 800-142 — Practical Combinatorial Testing (Kuhn/Kacker/Lei):
  https://csrc.nist.gov/pubs/sp/800/142/final ; PDF:
  https://csrc.nist.rip/groups/sns/acts/documents/sp800-142-101006.pdf
- NIST ACTS project page:
  https://csrc.nist.rip/Projects/Automated-Combinatorial-Testing-for-Software
- Recent review corroborating cumulative t-way fault distribution:
  https://pmc.ncbi.nlm.nih.gov/articles/PMC11561887/

Confidence: high (NIST primary sources; the FMX mapping is this note's
inference, consistent with ADR-0135 §6's existing covering-array + sentinel
design).

---

## Cross-fork synthesis note (for the ADR-0135 proposal updates)

All three sub-forks resolve toward the **conservative, honesty-preserving**
option that the existing ADR-0135 machinery already leans on:

1. **Placement** — the shared eval kernel is legitimately a **supporting
   subdomain implemented as a Shared Kernel** (orthogonal axes, DDD-correct);
   the infra-owns-system / Nico+domain-owns-semantics split is the standard
   platform/domain ownership contract. Because `bounded-context-map.md` is
   `binding:true`, this must be PROPOSED inside ADR-0135 flagged "requires
   ratifying a change to the binding bounded-context map" — the map has no
   Shared-Kernel construct today (only ADR-0089 cognitive-aid clusters), so
   adding a stateless supporting Shared-Kernel subdomain at the AI World
   Simulation ↔ Tactics/Training seam is a real map/taxonomy change reserved to
   Nico. Do NOT edit the map.
2. **Soak proxies** — reduced-horizon proxies acceptable only as non-gating
   trend/screening with an explicit fidelity caveat + stabilization check;
   full-horizon `soak:50y` stays MANDATORY for the gate-bearing no-domination /
   trajectory distributions (absorbing-state tail cannot be truncated honestly).
3. **Higher-order residual** — accept the residual >t-way risk (empirically
   rare; full higher-strength sweeps combinatorially infeasible per release)
   with the taxonomy-generated t-way array + risk-based sentinel combos + a
   NAMED monitoring trigger (T4 mode-split telemetry → ad-hoc higher-strength
   sweep on field signal), rather than mandating routine periodic higher-strength
   sweeps.

Band NUMBERS, SPRT α/β/indifference, the exact proxy horizon, the covering-array
strength t and the sentinel-combo list all stay explicitly OPEN/engine-gated —
this capture fixes METHOD, never values.
