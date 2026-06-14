---
title: ADR re-audit — cluster C9 (Environment / Cross-cutting / Ops / Governance / Security)
status: draft
tags: [research, audit, adr-re-audit, c9, observability, ci-cd, worktree, team-topology, cursor, audit-security, naming, weather-pitch, governance]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch]]
  - [[../10-Architecture/09-Decisions/ADR-0017-observability-logging]]
  - [[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy]]
  - [[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow]]
  - [[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling]]
  - [[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  - [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0002-offline-first]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/bounded-context-map]]
  - [[../10-Architecture/08-Crosscutting]]
  - [[../50-Game-Design/GD-0029-weather-and-pitch-design-model]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[telemetry-privacy]]
  - [[audit-security-context-definition-2026-06-07]]
  - [[determinism-and-replay]]
  - [[../90-Meta/collaboration-and-decision-protocol]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# ADR re-audit — cluster C9 (Environment / Cross-cutting / Ops / Governance / Security)

Audit of the eight C9 ADRs against the existing mature vault. Scope: weather/pitch
([[../10-Architecture/09-Decisions/ADR-0077-environment-and-climate-context-weather-and-pitch|0077]]),
observability/logging ([[../10-Architecture/09-Decisions/ADR-0017-observability-logging|0017]]),
CI-CD & merge ([[../10-Architecture/09-Decisions/ADR-0044-cicd-and-merge-policy|0044]]),
worktree workflow ([[../10-Architecture/09-Decisions/ADR-0045-issue-first-worktree-workflow|0045]]),
team topology ([[../10-Architecture/09-Decisions/ADR-0046-team-topology-and-scaling|0046]]),
cursor orchestration ([[../10-Architecture/09-Decisions/ADR-0009-cursor-orchestration|0009]]),
audit/security ([[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition|0091]]),
naming schema ([[../10-Architecture/09-Decisions/ADR-0007-naming-schema|0007]]).

**Decision gate ([[../90-Meta/collaboration-and-decision-protocol]]): every recommendation
below is options + a recommendation + confidence, for Nico to ratify. Nothing here is
accepted; this note edits no existing file.** Ground-truth constraints (offline-first PWA,
LLM out of authoritative state, narrow cloud sync) are respected — the ops ADRs are framed
local-first first, server second.

## Headline findings

1. **The whole cluster's biggest issue is status/lifecycle drift, not technical content.**
   The phase banner (`CLAUDE.md`: "all ADRs/GDDRs reopened to `draft`") collides with
   per-file front-matter that still says `status: accepted` / `binding: true`. ADR-0009,
   ADR-0017 and ADR-0007 carry `accepted`/`binding: true` in their body or front-matter
   while the Decision-Log lists them as `draft`. This is a **vault-wide governance gap that
   surfaces sharply in C9** because three of its ADRs are old "binding" ones.
2. **Two C9 ADRs (0009, 0044/0045/0046) describe an agent-ops process that has visibly
   evolved past them** — `claude/<thema>` branch prefixes and a 1M-context Opus model are in
   use today, yet ADR-0009 still frames Cursor Cloud Agents as "most implementation."
3. **The substantive domain ADRs are sound**: ADR-0077 (weather/pitch) and ADR-0091
   (audit/security) are well-grounded, determinism-aware, and correctly ratify-gated. The
   observability stack (ADR-0017) is confirmed current best practice for mid-2026.

---

## Per-ADR verdicts

### ADR-0077 — Environment & Climate (weather + pitch) — **sound**

Confidence: **high**.

Evidence: a 20th-context proposal grounded in WGEN/Richardson stochastic-weather literature
and FM/OOTP precedent, using the **already-reserved `WeatherRng` stream #5** with versioned
per-feature sub-labels (`WeatherRng:match:<id>:v1:truth:<feature>`), 11 explicit invariants
(EC1–EC11), correct lock-time snapshot discipline (EC5/EC7), and a fallible-forecast mechanic
that is genuinely replay-safe (EC6). It correctly does **not** edit `bounded-context-map.md`
(ratify-gated, per [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]).
The one open boundary item (pitch-condition *state* ownership) is explicitly flagged for Nico
rather than decided, and a 2026-06-07 sweep already added a recommendation (Stadium Ops keeps
the aggregate; Environment owns weather as input) — that is exactly the right shape.

Issues (minor): (a) the "20th bounded context" framing in §Status/§Map-patch is now
**superseded by ADR-0089** which fixes the final count at **28** with Environment & Climate as
**#26** — ADR-0077's own prose still says "19 → 20", a stale internal number though the
substance is unaffected. (b) The pitch-state ownership item was still open at
this audit point; **FMX-142 resolved it on 2026-06-14** by applying the
ADR-0077 split consistently: Stadium Operations owns pitch state and
`PitchConditionChanged`; Environment & Climate owns weather facts and
derivation rules. Neither undermines the decision.

Recommendation: no new ADR needed for the model. On ratification, (i) apply the ADR-0089
catalog count (#26, not "20th") rather than ADR-0077's local number, and (ii) ratify the
pitch-state split per the 2026-06-07 recommendation. Both are ratification chores, not redesign.

### ADR-0017 — Self-hosted Observability & Logging — **weak** (status/currency drift; content sound)

Confidence: **high**.

Evidence: the technical decision (self-hosted EU/GDPR stack: Loki + Prometheus + Grafana +
Alloy + GlitchTip, OTel as the instrumentation contract, five data classes, two-point
redaction, domain-audit-kept-separate) is **confirmed current best practice for mid-2026** by
targeted research (see §Research): Grafana **Alloy is the recommended Grafana-ecosystem
collector — Grafana Agent reached EOL 2025-11-01, so ADR-0017's Alloy choice correctly
anticipated the migration**; GlitchTip remains a viable lightweight Sentry-compatible option at
this scale; OTel remains the standard browser+Node contract. The offline-first crash-queue
rules (capped by count/age/bytes, redact-before-IndexedDB) are exactly right for a PWA.

Issues: (a) **status drift** — front-matter says `status: draft` + `binding: true` +
`accepted_at: 2026-05-17`, the body says "Accepted (2026-05-17…)", and the phase banner says
all ADRs are reopened to draft. Three different truths in one file. (b) **Substrate drift** —
the ADR text still names "SurrealDB projections" as a log source in five places; the 2026-05-19
amendment banner notes these "now mean Postgres" per [[../10-Architecture/09-Decisions/ADR-0021-revised-tech-stack]],
but the body was never cleaned, so a reader meets stale SurrealDB references first. This is the
live Postgres-vs-SurrealDB tension leaking into an ops ADR. (c) **Vendor-neutrality nuance** —
research flags that Alloy is more opinionated/Grafana-coupled than the upstream OTel Collector;
ADR-0017 leans on Alloy as the agent. Given OTel is the declared instrumentation contract, this
is acceptable, but the trade-off is unstated.

Recommendation (options, for Nico):
- **A. Superseding ADR** that (i) re-states the stack as still-current, (ii) purges the stale
  SurrealDB-as-source language, (iii) records the Alloy-vs-OTel-Collector neutrality trade-off
  explicitly, and (iv) reconciles the accepted/binding/draft status under the phase rules.
- **B. Lightweight amendment banner only** (like the existing 2026-05-19 one) noting "Alloy
  choice validated mid-2026; SurrealDB references = Postgres" — cheaper, but leaves three
  status truths unreconciled.
- **C. Leave as-is** — defer until the build phase reopens it.
- **Recommended: A** if Nico wants the observability ADR to be implementation-ready; otherwise
  **B**. The content does not need to change — only the metadata and stale substrate wording.

### ADR-0044 — CI/CD Strategy & Merge Policy — **sound** (minor staleness)

Confidence: **medium-high**.

Evidence: "portable pipeline, thin CI" (check logic in repo scripts, runnable locally, vendor
unlocked) plus "auto-merge when green on strict branch protection" (docs: no review; code →
`main`: ≥1 CODEOWNER) is a clean, defensible policy that matches the docs-vault-only present and
scales to per-domain owners. The `Closes FMX-<n>` 1-PR-↔-1-issue link to ADR-0045 is coherent.
For AI-authored PRs it correctly requires **ephemeral, secret-free, SHA-pinned** runners — the
right security posture for untrusted-input CI.

Issues (minor): (a) it is offered as `draft`/`binding: false` yet the repo **already operates**
under this policy (auto-merge on green, `Closes FMX-…`), so the lived process is ahead of the
ADR's status. (b) Dagger/Earthly are floated as "later optionally" without a trigger; fine as a
hook. (c) Nothing pins concrete required-check names for the build phase (deferred, acceptable).

Recommendation: keep as-is for now. On build-phase entry, a small superseding/amending ADR
should pin the exact required checks (test/lint/type/e2e) and confirm the CODEOWNER-review
switch. No redesign warranted.

### ADR-0045 — Issue-first + Git-Worktree Agent Workflow — **sound** (drift vs lived practice)

Confidence: **medium**.

Evidence: one-issue↔one-worktree↔one-branch with `‹tool›/fmx-‹n›-‹slug›` branch naming, shared
object store, no `cp -r`/no nesting, automatic cleanup, and a staged-enforcement model
(advisory now, hard hook armed on Nico's command) is the standard, low-cost way to run parallel
agents. Correctly ties traceability to `linear-link-check`.

Issues: (a) **branch-naming drift** — the ADR prescribes `‹tool›/fmx-‹n›-‹slug›`, but the
current working branch is `claude/open-decisions-dossier` (theme-based, matching the global
`claude/<thema>` convention) and the global rule says "Branch-Präfix `claude/<thema>`". So two
naming conventions coexist (`claude/fmx-104-…` vs `claude/<thema>`) and neither doc reconciles
them. (b) the worktree helper script / registry is deferred until the hook is armed — fine, but
means the "registry" invariant is currently unowned. (c) "humans `feat/fmx-…`" is asserted but
untested at solo scale.

Recommendation (options, for Nico):
- **A. Amend ADR-0045** to record both accepted branch forms — `‹tool›/fmx-‹n›-‹slug›` for
  issue-scoped work and `‹tool›/<thema>` for cross-cutting/meta work — and state which gates
  (linear-link-check) apply to each.
- **B. Tighten to one form** (`‹tool›/fmx-‹n›-‹slug›` only) and treat `claude/<thema>` as a
  violation to be migrated.
- **Recommended: A**, low confidence on the exact split — this is a workflow ergonomics call for
  Nico, and the dossier-style theme branches are clearly useful for non-issue sweeps.

### ADR-0046 — Team Topology & Multi-Lead Scaling — **stale** (count drift; future-scope intact)

Confidence: **medium-high**.

Evidence: the future-scope intent (Lead Architect + Domain Leads aligned to bounded contexts
via Conway, CODEOWNERS-by-domain teams not individuals, merge queue + flow captain at scale,
activates on the 2nd lead) is sound and additive. It correctly stays dormant while solo.

Issues: (a) **stale count** — the ADR's Context says ownership maps to "the **11 bounded
contexts**", but [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
fixes the ratified catalog at **28** contexts. The ownership-map premise (1 lead ≈ 1 context)
scales very differently at 28 than at 11 — 28 contexts / few leads means leads own *clusters*,
which ADR-0089's cluster grouping (Sporting Core, Engagement & Narrative, …) already anticipates
but ADR-0046 doesn't reference. (b) CODEOWNERS still `@EtroxTaran` (single human) — correct for
solo, but the "teams not individuals" rule has no teams yet.

Recommendation (options, for Nico):
- **A. Amend ADR-0046** to (i) replace "11" with the ADR-0089 catalog and (ii) make the
  ownership unit the **cluster** (per ADR-0089 grouping), not the individual context, so a lead
  owns a coherent cluster.
- **B. Leave dormant** until the 2nd lead actually joins, then rewrite against the live count.
- **Recommended: A** (low-cost correction now avoids a future lead inheriting a 17-context-stale
  premise); confidence medium because it is genuinely future-scope and may be rewritten anyway.

### ADR-0009 — Cursor Cloud Agent Orchestration — **stale**

Confidence: **medium**.

Evidence: the core idea (Plan Mode in `.cursor/plans/`, serialize schema/interface/config
changes, fan out only independent beats after exclusivity checks) is a reasonable
conflict-avoidance pattern and is consistent with ADR-0045's worktree isolation.

Issues: (a) **status/phase contradiction** — body says `accepted`, front-matter `binding: true`,
phase says reopened to draft, Decision-Log says `draft`. (b) **premise drift** — Context asserts
"Most implementation is done by Cloud Agents working in parallel," but the project is in a
**docs-only research phase with no implementation**, and the live team is three coding agents
(Claude/Codex/Cursor) per `CLAUDE.md`/global config — Cursor is one of three, not "most." (c)
It is **Cursor-specific** (`.cursor/plans/`, `cursor/*` branches, Bugbot) while ADR-0045/0044
define a tool-agnostic worktree+CI model; ADR-0009 reads like an older, narrower precursor that
ADR-0045 has largely absorbed without an explicit supersede link. (d) `related: []` is empty —
it doesn't even point at ADR-0045/0044 or the cursor-cloud-agent-workflow note it implements.

Recommendation (options, for Nico):
- **A. Superseding ADR** "Multi-agent orchestration & conflict-serialization" that generalises
  ADR-0009's serialize-shared-contracts insight across all three agents, links it to
  ADR-0044/0045/0046, and retires the Cursor-only framing — with `Supersedes: ADR-0009` in
  front-matter (the only permitted supersession mechanism).
- **B. Amend ADR-0009 in place** — not permitted under the read-only rule for existing ADRs; a
  new ADR is required.
- **C. Mark ADR-0009 stale via the Decision-Log status only**, defer generalisation to build phase.
- **Recommended: A**, medium confidence — the serialization insight is worth preserving but the
  Cursor-only, "cloud agents do most work" framing is demonstrably out of date.

### ADR-0091 — Audit & Security context definition — **sound**

Confidence: **high**.

Evidence: defines the previously-thin Audit & Security context as an *explicit but narrow*
supporting subdomain — "observe, record, verify, flag — never decide game rules" — backed by a
**separate** append-only, hash-chained, signed-checkpoint security audit log (distinct from the
domain event store), owning replay/dedup state that composes with ADR-0090's command envelope,
plus abuse/anomaly flags and GDPR-compatible retain-fact-sever-identifier retention. The
explicit does-NOT-own list (no domain validation, no Identity/auth, no ADR-0028 outbox) is
exactly the boundary discipline the modular monolith needs. Server re-simulation as the primary
anti-cheat is correct for a deterministic event-sourced backend. Correctly ratify-gated, no map
change.

Issues (minor): (a) it asserts Audit & Security is "already-ratified" as a context — consistent
with ADR-0089's catalog, but worth confirming the map row exists before implementation. (b)
anomaly *scoring* is deferred to FMX-52-style calibration (rules-first) — sensible, flagged. (c)
overlap with ADR-0017's "domain audit events" data class (§2.5) and the
[[../10-Architecture/08-Crosscutting]] redaction rules must be reconciled so there are not two
"audit log" owners (see cross-ADR §X2).

Recommendation: ratify as-is. Add one cross-reference in implementation to disambiguate
"domain audit events" (ADR-0017/0028 outbox + archive) from the "security audit log" (ADR-0091)
— they are different logs with different owners and retention, and the names are confusingly close.

### ADR-0007 — IP-clean Naming Schema + Data Generators — **sound**

Confidence: **high**.

Evidence: a thorough, well-sourced IP-safety + procedural-generation contract: no real
identifiers, GeoNames real-regions / Bloom-filtered fictional-cities, approved/forbidden corpus
licence table, living-person filter on Wikidata, `GeneratorRng` stream #9 with label-derived
determinism (same `worldSeed` → byte-identical world), and the FMX-54 §13a extension to
fan/media/sponsor/venue persona naming with normalisation+confusable+phonetic denylist gates and
CI enforcement (string-match real-name test, provenance test, byte-identical golden test). This
is the strongest doc in the cluster and aligns with the memory rule "every fictional name
evocative-but-clearly-not-real."

Issues (minor): (a) status drift again — `status: draft` front-matter, body "Accepted
(2026-05-17…)", `binding: true`, `accepted_at`. (b) §6 cites "D9 permanent product decision: no
3D" for crests — this is a **point-in-time claim** that is worth re-confirming given other parts
of the broader project explore 3D (the global memory references a "Babylon 3D" styleguide
surface); the *crest* no-3D rule is independently justified (SVG perf budget) so the decision
stands, but the "permanent, no-3D" framing is broader than this ADR's remit. (c) corpus licence
currency (Wikidata CC0, GeoNames CC-BY, OGL v3.0, Game-Icons.net CC-BY-3.0) should be
re-verified at build time, not assumed frozen.

Recommendation: keep as-is. At build-phase, (i) re-confirm corpus licences are unchanged and
(ii) scope the "no 3D" claim to crests specifically rather than as a product-wide assertion
inside a naming ADR. No redesign.

---

## Cross-ADR issues within C9

- **X1 — Status/lifecycle drift is cluster-wide (governance gap).** ADR-0009, ADR-0017, ADR-0007
  carry body-`accepted` + `binding: true` while the phase banner reopened everything to `draft`
  and the Decision-Log lists them `draft`. Readers get three conflicting truths per file. This
  is the single highest-leverage fix in C9 and is really a **vault-governance** problem (see
  proposed new GD below), not eight separate ADR problems.

- **X2 — "Audit log" is an overloaded term across ADR-0017, ADR-0091, ADR-0028.** ADR-0017 §2.5
  defines "Domain audit events" (authoritative business history via the ADR-0028 Postgres outbox
  + archive partitions, hot 60d / archive forever). ADR-0091 defines a **separate** "security
  audit log" (hash-chained, who-attempted-what). These are correctly *distinct*, but the near-
  identical naming invites a future implementer to merge them and break ADR-0091's forensic
  boundary. Ubiquitous-language fix needed: rename one ("domain event archive" vs "security
  audit log") or add an explicit disambiguation note in [[../10-Architecture/08-Crosscutting]].

- **X3 — Bounded-context count is stale in two C9 ADRs.** ADR-0046 says "11 contexts"; ADR-0077
  says "19 → 20th". Both predate [[../10-Architecture/09-Decisions/ADR-0089-bounded-context-portfolio-reconciliation]]
  which fixes the catalog at **28** (Environment & Climate = #26). Not contradictions in
  substance (ADR-0089 already reconciles the "20th" collision between ADR-0077 and ADR-0085), but
  stale numbers that a careless apply-PR could re-introduce.

- **X4 — The agent-ops trio (0009/0044/0045/0046) overlaps without a clear hierarchy.** ADR-0009
  (cursor-specific serialization), ADR-0045 (tool-agnostic worktree isolation) and ADR-0044
  (CI/merge) all govern "how agents change the repo safely," but ADR-0009 is older and narrower
  and isn't linked from the newer three (`related: []`). The lived practice (`claude/<thema>`
  branches, Opus 1M model, three agents) has moved past ADR-0009's framing. Consolidation under
  one current orchestration ADR (see proposed) would remove the overlap.

- **X5 — Substrate (Postgres vs SurrealDB) leaks into the ops layer.** ADR-0017's body still
  names SurrealDB as a log/metric source in five spots, papered over by an amendment banner. The
  live data-layer tension (Postgres ADR-0027/0004 vs SurrealDB) thus has stale fingerprints in
  the observability ADR. Whoever resolves the substrate axis must sweep ADR-0017's source list.

## External research (targeted)

Source: Perplexity (Sonar), 2026-06-08, on the observability stack currency (the most
version-sensitive C9 decision). Key confirmations and citations:

- **Grafana Alloy is the recommended Grafana-ecosystem agent**; **Grafana Agent is EOL as of
  2025-11-01** — ADR-0017's Alloy choice correctly anticipated this. Pin explicit image tags,
  not `latest`. (grafana.com/oss/alloy-opentelemetry-collector; grafana.com/blog/grafana-agent-to-grafana-alloy-opentelemetry-collector-faq)
- **OpenTelemetry remains the standard browser+Node instrumentation contract** in 2026; OTel
  Collector is the de-facto trace transport. (grafana.com/docs/opentelemetry/collector/grafana-alloy)
- **Alloy vs upstream OTel Collector neutrality trade-off**: Alloy is more opinionated /
  Grafana-coupled; upstream Collector is maximally vendor-neutral. ADR-0017 leans Alloy but
  declares OTel as the contract, so portability is preserved at the SDK layer. (oneuptime.com
  2026-02-06 comparison; coralogix.com "the Grafana Alloy dilemma")
- **GlitchTip remains a viable lightweight Sentry-compatible option** at single-node scale; main
  caveat is lag vs upstream Sentry on newest SDK/perf features — exactly the upgrade-path
  ADR-0017 already records. (GlitchTip project docs)

Conclusion: ADR-0017's **technology choices are current best practice for mid-2026**; its only
problems are metadata/status drift and stale SurrealDB wording — not the stack.

## Proposed decisions (working titles only — numbers assigned centrally)

See the structured output for the machine-readable list. In summary:

1. **New GD — "ADR status & binding lifecycle reconciliation under the research-phase
   reopen."** Cluster-wide governance fix for X1: define how a `binding: true` / body-`accepted`
   ADR is represented while the phase banner has reopened everything to `draft` (single source of
   truth per file). Highest-leverage, lowest-risk.
2. **Superseding ADR — "Multi-agent orchestration & conflict serialization (Claude/Codex/Cursor)."**
   `Supersedes: ADR-0009`. Generalises ADR-0009's serialize-shared-contracts insight tool-
   -agnostically, links ADR-0044/0045/0046, retires the Cursor-only + "cloud agents do most work"
   framing (X4).
3. **Superseding ADR — "Self-hosted observability stack refresh (Alloy/LGTM/GlitchTip, 2026)."**
   `Supersedes: ADR-0017`. Re-affirms the stack as current, purges stale SurrealDB-as-source
   language (X5), records the Alloy-vs-OTel-Collector neutrality trade-off, reconciles status.
   Only if Nico wants observability implementation-ready now; otherwise a cheaper amendment banner.

Lower-priority (amendments, not new ADRs, all Nico-gated): correct ADR-0046's "11" → ADR-0089
catalog with cluster-as-ownership-unit; record both branch-naming forms in ADR-0045; ratify
ADR-0077's pitch-state split and apply the ADR-0089 #26 count on ratification.
