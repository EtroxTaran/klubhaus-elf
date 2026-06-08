---
title: ADR-0059 Community Overlay Pipeline Context
status: accepted
tags: [adr, architecture, ddd, community, overlay, import, privacy, gdpr, dsa, naming, fmx-33, fmx-54, risk-legal]
created: 2026-05-28
updated: 2026-06-08
type: adr
binding: false
supersedes:
superseded_by:
related:
  - [[ADR-0007-naming-schema]]
  - [[ADR-0016-community-dataset-overrides]]
  - [[ADR-0019-modular-monolith-ddd]]
  - [[ADR-0027-postgres-data-model]]
  - [[ADR-0028-postgres-transactional-outbox]]
  - [[ADR-0050-club-economy-accounting-ledger]]
  - [[ADR-0051-manager-and-legacy-context]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0056-regulations-compliance-context]]
  - [[ADR-0057-rivalry-system-context]]
  - [[ADR-0052-people-persona-and-skills-context]]
  - [[ADR-0054-narrative-context-and-ai-narration-framework]]
  - [[../../50-Game-Design/community-editor-and-datasets]]
  - [[../../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../../20-Features/feature-community-editor]]
  - [[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
  - [[../../60-Research/community-overlay-pipeline-decision-2026-06-07]]
  - [[../../60-Research/fan-persona-privacy-and-naming-2026-06-01]]
  - [[../../60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  - [[../../00-Index/Open-Decisions-Dossier]]
---

# ADR-0059: Community Overlay Pipeline Context

## Status

proposed

## Date

2026-05-28

## Context

The 16-context bounded-context map (after FMX-40 ratification) has no
Community Overlay Pipeline owner. ADR-0016 (Community Dataset
Overrides, proposed 2026-05-19) defines:

- **Pack manifest** with `id`, `version`, `game_version_min`,
  `game_version_max`, `pack_type`, `depends_on`, `replaces`, `adds`,
  `priority`, `ip_disclaimer: required`.
- **Override scope (CAN)**: club names + colours + logos +
  competitions + rivalries + player names + attributes + league
  structure + scenario dates + historical worlds + crest icon packs.
- **Override scope (CANNOT)**: IP-clean core determinism + encryption
  envelope + cross-save rule-set versioning per-save immutability.
- **Validation pipeline**: schema → game-version compatibility →
  conflict detection (high-priority pack wins) → IP disclaimer →
  preview → user confirm → activation → save migration.
- **Sandbox**: P2P distribution only; FMX does not host community
  packs.
- **IP-safety**: ADR-0007 §13 living-person filter + GD-0015 IP-clean
  hardline + denylist CI gate.
- **Save-creation determinism**: pack activation snapshot at save
  creation; immutable thereafter (except pre-authored future-changes
  per ADR-0051).

**Critical state: ADR-0056 (Regulations & Compliance, accepted
2026-05-28) and ADR-0057 (Rivalry System, accepted 2026-05-28) already
explicitly delegated semantic validation of their pack overrides to
the owning BCs per Vernon canonical pattern.** The bounded-context-map
explanatory paragraphs (lines 106 + 129) explicitly reference "FMX-33
Community Overlay Pipeline" as the upstream orchestrator they delegate
to. ADR-0056 Public Contract includes `ImportRuleOverride` (consumed
from FMX-33 Community Overlay Pipeline). ADR-0057 Public Contract
includes `ImportRivalrySeedFromOverlay` (FMX-33 Community Overlay
Pipeline surface).

That leaves the **orchestrator + manifest validation + IP-safety gate
+ immutability + multi-BC delegation** as the residual concern. Two
ratified ADRs (accepted, binding:true) explicitly reference a missing
context.

The
[[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
synthesis evaluates four options + Option E anti-pattern against DDD
authorities (Vernon ingestion-as-bounded-context pattern), genre
precedent (FM `.fmf` editor data) and real-world precedent (Bethesda
Creation Kit + Steam Workshop + CurseForge / Modrinth).

## Options considered

### Option A - Platform service outside the bounded-context map

A library / handler in `packages/db` that delegates to owning BCs;
NOT a bounded context. Platform tooling for DB migrations + schema
sync model.

- **Coupling:** weak - mechanical orchestration via function calls.
- **Test isolation:** weak - no bounded context boundary.
- **Service extractability:** N/A - not a context.
- **Data sovereignty:** weak - substantial domain logic (IP-safety
  gate + manifest validation + audit trail) buried in plumbing.
  Vernon Query 2 explicit: "policy-heavy subdomain = own BC, not
  buried in plumbing."
- **Trade-off:** ADR-0056 + ADR-0057 already reference "FMX-33
  Community Overlay Pipeline" as the upstream orchestrator they
  delegate to. Treating it as a library makes the dangling reference
  architectural debt; the ubiquitous language (Manifest +
  ImportSession + IPGate + Activation + Archive) does not belong in
  any downstream BC's language per Evans bounded-context discipline.

### Option B - Sub-aggregate inside Identity & Access

Identity & Access absorbs pack import; user-triggered action +
authorisation locality.

- **Coupling:** weak - Identity's scope is "user, sessions, roles,
  device state" (account ownership + authentication). Pack lifecycle
  + manifest parsing + IP gating + semantic validation routing have
  nothing to do with Identity's language.
- **Test isolation:** weak.
- **Service extractability:** weak.
- **Data sovereignty:** weak - multi-BC delegation requires the
  orchestrator to know about Regulations + Rivalry + Tactics + Club
  + Squad + ... Identity is not in the business of knowing about
  game-state BCs.
- **Trade-off:** IP-safety hardline is a different governance
  concern than user-account management. Different audit trail,
  different review process, different stakeholders. Putting pack
  import inside Identity overloads an authentication context with
  content-policy responsibility.

### Option C - Sub-aggregate inside Offline Sync

Offline Sync absorbs pack import because packs flow through cache /
draft / file surfaces.

- **Coupling:** weak - Offline Sync's MVP scope is "cache / draft
  status and freshness metadata" (storage hygiene + sync state).
  Pack lifecycle + manifest + IP gate + semantic validation are not
  Offline Sync language.
- **Test isolation:** weak.
- **Service extractability:** weak.
- **Data sovereignty:** weak - pack activation is save-creation only
  per ADR-0051 determinism rule; Offline Sync handles continuous
  state, not one-time activation gates.
- **Trade-off:** Offline Sync is downstream of, not orchestrator of,
  the game-state BCs. Multi-BC delegation doesn't fit Offline Sync's
  role.

### Option D - New "Community Overlay Pipeline" bounded context

Carve a dedicated context owning the pack registry + import-session
FSM + manifest schema validation + IP-safety gate + conflict-
resolution policy + IP audit log. Exposes Open Host Service +
Published Language. Each downstream BC (Regulations + Rivalry + future
Tactics + future Squad / Club / Identity Corpus) provides semantic
validation as a domain service consumed by Community Overlay BC's
Process Manager / Saga during import. Community Overlay BC owns the
**decision** (activate or reject) and emits activation events at save
creation time.

- **Coupling:** clean. Each downstream BC owns its semantic
  validation per Vernon canonical pattern (already-in-place via
  ADR-0056 + ADR-0057); Community Overlay owns orchestration + IP
  gate + immutability + multi-BC routing.
- **Test isolation:** strong. Community Overlay owns its own storage
  (mixed platform + per-save per ADR-0027); deterministic event
  fixtures drive tests.
- **Service extractability:** matches ADR-0019 §5 - extraction is a
  deployment change because all contracts are JSON-serialisable.
- **Data sovereignty:** explicit. Platform-scope `PackRegistry` +
  `IPSafetyAuditLog` (cross-save catalog + IP review surface); per-
  save `ActivePacksSnapshot` immutable at save creation per ADR-0051
  determinism rule.
- **IP-safety surface contained.** GD-0015 + ADR-0007 IP-clean
  hardline applies to one context boundary - review surface for
  `risk:legal` is one module not scattered code. Same container
  advantage as ADR-0056 Regulations.
- **Trade-off:** adds another bounded context to the map. The map is
  at 16 ratified + ADR-0052 (People) + ADR-0054 (Narrative) drafts.
  Adding Community Overlay brings the potential total to 19 if all
  four drafts ratify. Modular-monolith stays one process per ADR-0019
  §5.

### Option E (rejected as anti-pattern) - Cross-cutting Policy Service called by each consumer

Each consumer BC (Regulations + Rivalry + ...) calls a shared
`CommunityOverlayPolicy` service for pack ingestion.

- **Trade-off:** Vernon's explicit anti-pattern. "On-demand Domain
  Service called by each consumer" leaks cross-context model into
  everyone else's language, leads to tight coupling and duplication.
  Listed for completeness; rejected.

## Decision questions (open — awaiting Nico, 2026-06-07)

Re-grounded in [[../../60-Research/community-overlay-pipeline-decision-2026-06-07]] (DDD
ingestion-context-vs-ACL; Steam Workshop / Paradox / Factorio mod architecture; EU DSA
notice-and-action obligations).

- **D1 — Owner.** **A. Own bounded context (Option D) ← recommended** · B. Platform service (Option A)
  · C. Sub-aggregate in Identity / Offline Sync (Options B/C) · (E rejected anti-pattern).
- **D2 — MVP distribution.** **A. Local-file / P2P import only ← recommended** (no own-backend DSA
  platform scope; FMX-54 privacy/naming gate on the IPGate) · B. Hosted marketplace in MVP (incurs DSA
  notice-and-action + trusted-flaggers + transparency + moderation/appeals now).

**Recommendation: D1 = A, D2 = A.** The pipeline satisfies six-of-six DDD context criteria (own
language/lifecycle/storage/governance, multiple shielded consumers, independent evolution) and matches
the Factorio/Paradox/Steam ingestion-context precedent; two already-binding ADRs (0056, 0057) name it
as their orchestrator, so ratifying resolves dangling references. Local-import-only keeps MVP out of
DSA own-platform obligations while the BC is designed so a hosted/Workshop adapter can plug in later.
Full rationale below.

## Recommendation

**Option D (Community Overlay Pipeline as own bounded context).**
Three converging arguments:

1. **DDD canonical pattern (synthesis F4) is decisive.** Vernon-style
   strategic design treats import / ingestion / ETL as **own bounded
   context** when six criteria align - and FMX-33 satisfies **six of
   six** (stronger than FMX-26/28/30/34 where five-of-six fired):
   own ubiquitous language (Manifest + ImportSession + IPGate +
   Activation + Archive); own lifecycle (uploaded → validating →
   approved → activated → archived); own storage boundary; multiple
   downstream consumers shielded via ACL; own governance + risk
   regime (IP-safety + legal compliance); independent evolution.
   Real-world DDD analogues converge: **Stripe Connect onboarding**,
   **Avalara data sync**, **Salesforce Data Import Wizard**, **GitHub
   Actions workflow ingestion**, **OpenStreetMap changeset workflow**
   - all treat ingestion as separate BC with Process Manager / Saga
   in application layer + downstream BCs as domain services + IP /
   legal gates as domain invariants on activation.

2. **Existing FMX delegation pattern (synthesis F2) is the strongest
   single argument.** ADR-0056 (Regulations) and ADR-0057 (Rivalry)
   - both accepted, binding - explicitly delegate semantic validation
   of pack overrides to themselves per Vernon canonical pattern, and
   the bounded-context-map explanatory paragraphs (lines 106 + 129)
   explicitly reference "FMX-33 Community Overlay Pipeline" as the
   upstream orchestrator. Two ratified ADRs (binding) name a missing
   context. Option D defines that context; Options A / B / C leave
   the references dangling.

3. **Real-world platform precedent (synthesis F5) confirms ingestion
   as distinct subsystem.** Bethesda Creation Kit + Bethesda.net Mods
   (creator-authored upload + technical validation gate + creator IP
   disclaimer + post-publication takedowns) is the most directly
   analogous architecture. Steam Workshop (notice-and-takedown +
   automated technical review + manual flagged review). CurseForge /
   Modrinth (manifest-driven compliance + dependency resolution +
   attribution + license fields + removal-after-complaint). FM
   Editor + community DBs (`.fmf` save-creation-only activation +
   multiple-pack selection + version-strict + internal merge). 2023-
   2026 EU DSA + Bethesda paid-mods + Steam Workshop policy trends
   converge on upload gate + provenance metadata + complaint-driven
   enforcement + audit trail - exactly what an Import BC owns.

### Named risks

- **Map growth.** The map was 11 contexts on 2026-05-16; with
  FMX-25/26/28/30/34 ratified it is 16; adding Community Overlay
  brings 17. If ADR-0052 People + ADR-0054 Narrative also ratify,
  total is 19. Modular-monolith stays one process per ADR-0019 §5;
  service extraction is a deployment change.
- **IP-safety surface (`risk:legal` label).** IP-clean rule
  terminology hardline + denylist + living-person filter + manifest
  IP disclaimer + audit trail all live inside Community Overlay BC.
  Container advantage: IP review surface is **one module**, not
  scattered. Real risk: requires careful authoring of the IP-gate
  invariant + periodic Nico / external IP audit.
- **Coordination with ADR-0016.** ADR-0016 (Community Dataset
  Overrides, proposed) defines the scope + content + manifest model.
  ADR-0059 defines the bounded context that implements it. On
  acceptance, ADR-0016 should be updated to "implemented by
  ADR-0059" in the apply-PR or kept as the upstream content/scope
  reference.
- **Multi-BC orchestration complexity.** Process Manager / Saga
  coordinates manifest parsing + compatibility check + multi-BC
  semantic validation (Regulations + Rivalry + future Tactics +
  future Squad / Club) + IP gate + user preview + activation. Pattern
  is well-established (ADR-0056 Process Manager for transfer
  eligibility); curve tuning is GDDR territory.
- **EU DSA compliance trajectory.** 2023-2026 governance trends push
  toward platform accountability + creator provenance + audit
  trails. Community Overlay BC's `IPSafetyAuditLog` + `RevokePack`
  + repeat-infringer state machine satisfy these requirements;
  detailed compliance reporting is future-scope.

### FMX-54 privacy and naming amendment

FMX-54 does not activate hosted pack distribution and does not ratify this ADR.
It adds a required gate if this ADR is later accepted:

- MVP community packs remain local file import / peer-to-peer sharing.
- `IPGate` must include privacy/persona naming validation for fan groups, fan
  reps, journalists, media outlets, sponsors, venues, supporter slogans/chants
  and imported name corpora.
- Local import can warn and run best-effort schema/IP/privacy checks, but it
  must reject or flag real private-person data, real supporter membership
  lists, real social handles, real fan-group names, doxxing content,
  special-category-like fan fields and AI impersonations of real people.
- Hosted distribution, pack discovery or marketplace functionality is blocked
  until DSA notice/action, complaints/appeals, moderation logs, repeat-abuse
  policy, AI transparency labels where applicable, DSAR/deletion integration and
  Privacy Notice/RoPA updates are defined and approved.

Status stays `proposed` / `binding: false` until Nico ratifies.

## Decision

Propose a dedicated **Community Overlay Pipeline** bounded context.

If ratified, Community Overlay Pipeline owns:

- `PackRegistry` aggregate (platform-scope catalog of imported packs:
  metadata, versions, dependencies, IP-disclaimer-signed status,
  archived status, revoked status).
- `ImportSession` aggregate (per import attempt; FSM: uploaded →
  manifest-parsed → validating → approved → activated → archived;
  failure path: rejected / expired).
- `ManifestSchema` aggregate (versioned schema definitions per pack-
  format-version; CI-gated against ADR-0007 + GD-0015).
- `IPSafetyAuditLog` aggregate (denylist matches + disclaimer
  acceptance + reviewer notes; per-pack + per-import-session;
  `risk:legal` review surface).
- `ConflictResolutionPolicy` (priority-based; last-write-wins for
  same priority; dependency-aware merge per CurseForge precedent).
- `ActivePacksSnapshot` (per-save, immutable at save creation per
  ADR-0051 determinism rule).

Community Overlay Pipeline does **not** own:

- Semantic validation of rule overrides (Regulations & Compliance
  owns per ADR-0056; provides `RuleOverrideValidated` /
  `RuleOverrideRejected`).
- Semantic validation of rivalry seed overrides (Rivalry System owns
  per ADR-0057; provides `RivalryOverrideValidated` /
  `RivalryOverrideRejected`).
- Semantic validation of tactic preset overrides (Tactics owns per
  ADR-0055 future-scope).
- Semantic validation of economy profile overrides (Club Management
  owns per ADR-0050 when designed).
- Semantic validation of name corpus overrides (Squad & Player or
  future Identity Corpus owns when designed).
- Pack hosting / distribution (P2P only per ADR-0016).
- In-game pack discovery UI (Community Overlay publishes
  `AvailablePacks` read model; UI consumer TBD).
- User authentication (Identity & Access owns).
- IP-clean denylist source data (ADR-0007 + GD-0015 binding rule
  catalogs; Community Overlay consumes them as policy inputs).

## Public contract direction

Draft commands:

- `UploadCommunityPack`
- `ParseManifest`
- `ValidateCompatibility`
- `RequestSemanticValidation(downstreamBC, override)`
- `RecordIPGateDecision`
- `ApprovePack`
- `RejectPack`
- `ActivatePackAtSaveCreation`
- `ArchivePack`
- `RevokePack` (community-takedown / IP claim)
- `RecordDisclaimerAcceptance`

Draft events:

- `CommunityPackUploaded`
- `ManifestParsed`
- `CompatibilityChecked`
- `SemanticValidationRequested`
- `SemanticValidationCompleted`
- `IPGateEvaluated`
- `PackApproved`
- `PackRejected`
- `PackActivated`
- `PackArchived`
- `PackRevoked`

Draft read models:

- `AvailablePacks(gameVersion)` - packs valid for the current game
  build with compatibility verdicts.
- `PackDetails(packId)` - manifest + semantic validation status + IP
  disclaimer status + activation history.
- `ActivePacksInSave(saveId)` - immutable snapshot of activated
  packs for a given save.
- `PackConflictAnalysis(packIds)` - dependency + override conflict
  surface for UI preview before activation.
- `IPSafetyAuditTrail(packId)` - audit log for `risk:legal` review.
- `PendingValidations(packId)` - which downstream BCs have not yet
  responded to `SemanticValidationRequested`.

Draft consumed facts (delegation responses from downstream BCs):

- `RuleOverrideValidated` / `RuleOverrideRejected` from Regulations
  & Compliance (per ADR-0056 Public Contract).
- `RivalryOverrideValidated` / `RivalryOverrideRejected` from
  Rivalry System (per ADR-0057 Public Contract).
- `TacticPresetOverrideValidated` from Tactics (when designed -
  deferred per ADR-0055).
- `EconomyProfileOverrideValidated` from Club Management (when
  designed).
- `NameCorpusOverrideValidated` from Squad & Player or future
  Identity Corpus BC (when designed).
- `SaveCreationRequested` from League Orchestration / new-save
  workflow - triggers `ActivePacksSnapshot` materialisation.

## Determinism and storage rules

- **Mixed scope:**
  - **Platform-scope** (`public` schema per ADR-0027) for
    `PackRegistry` + `ImportSession` history + `ManifestSchema`
    versions + `IPSafetyAuditLog`. Cross-save catalog.
  - **Per-save** (`save_<uuidv7hex>` schema) for `ActivePacksSnapshot`
    (which packs were activated at this save's creation;
    immutable). Copied at save creation per ADR-0051 determinism
    rule.
- **Pack activation is save-creation only.** Active rule set +
  community overrides copied into save snapshot at creation. Running
  save never re-reads mutable pack registry (canonical Vernon
  immutable-after-activation pattern with versioned aggregates +
  Published Language to downstream BCs).
- **IP-safety as domain invariant.** Activation transition guarded
  by `IPGateEvaluated == accepted`. Denylist match (ADR-0007 living-
  person filter + GD-0015 IP-clean hardline) is hard fail. Manifest
  `ip_disclaimer: required` field must be acknowledged. `risk:legal`
  audit log preserved for compliance review (EU DSA precedent).
- **Cross-context inputs arrive through public events / queries
  only.** Community Overlay does not join across context tables.
- **Pack-activation events fire via ADR-0028 transactional outbox**;
  downstream BCs subscribe to apply overrides during save creation.
- **Orchestration pattern: Process Manager / Saga in application
  layer of Community Overlay BC.** Saga coordinates manifest parsing
  → compatibility check → multi-BC semantic validation (Regulations
  + Rivalry + future Tactics + future Squad / Club) → IP gate → user
  preview → activation. Each downstream BC owns its semantic
  validation per Vernon (ADR-0056 + ADR-0057 already-in-place);
  Community Overlay BC owns the **decision** (activate or reject).
- **Pack revocation** (community takedown / IP claim) updates pack
  registry to `revoked` state. **Already-activated saves are
  unaffected** (per-save snapshot immutability per ADR-0051) - this
  matches Vernon canonical versioned-aggregate pattern; users can
  reload an old save with a revoked pack as long as the snapshot
  exists. Revocation only blocks future activations.

## Rationale

Community Overlay Pipeline modelling has six structural properties
that DDD canonically resolves as "own bounded context":

1. **Own ubiquitous language** - Manifest, ImportSession,
   ValidationRun, CompatibilityCheck, ConflictSet, IPGate,
   Activation, Archive, PackVersion. These terms have specific
   meaning only in the ingestion domain; consuming contexts speak
   different language (rule, rivalry-edge, club, fixture).

2. **Own lifecycle independent of any consumer** - import session
   FSM (uploaded → validating → approved → activated → archived);
   pack registry FSM (registered → active → revoked / archived).
   None of these change in lockstep with any single consumer's
   transaction.

3. **Own storage boundary** - pack registry + IP audit log in
   platform schema; per-save activation snapshot in save schema.
   Independent storage evolution from any downstream BC.

4. **Multiple consumers each with their own rich model** -
   Regulations (rule overrides), Rivalry (rivalry seeds), Tactics
   (tactic presets future-scope), Squad & Player (name corpus
   future-scope), Club Management (economy profile future-scope),
   Notification (pack-activation announcements), Manager & Legacy
   (community-overlay-supplied legacy seeds). Each consumes pack
   overrides differently and applies its own policy in its own
   aggregate.

5. **Own governance + risk regime** - IP-safety hardline + denylist
   + living-person filter + manifest IP disclaimer + audit trail +
   EU DSA compliance trajectory + repeat-infringer handling form a
   distinct governance subdomain with `risk:legal` review surface.
   Vernon: "policy-heavy subdomain = own BC, not buried in plumbing."

6. **Independent evolution pressure** - community pack format
   versioning + manifest schema evolution + IP-safety rule updates
   change on a different cadence than downstream BCs' semantic
   rules.

Vernon's canonical ingestion-as-bounded-context pattern (Stripe
Connect + Avalara + Salesforce + GitHub Actions + OSM) is the direct
DDD analogue. Real-world platform precedent (Bethesda + Steam
Workshop + CurseForge) confirms the architecture. FM `.fmf` save-
creation-only activation is the genre precedent. **The existing FMX
delegation pattern (ADR-0056 + ADR-0057 explicitly reference FMX-33
Community Overlay Pipeline) is the strongest single argument** -
two ratified binding ADRs name a missing context.

The marginal cost (one more context in the modular monolith, with
extraction as a deployment change per ADR-0019 §5) is small compared
with the coupling debt the alternatives accumulate. Option A
(platform service) buries policy-heavy ingestion subdomain in
plumbing; Option B (Identity sub-aggregate) overloads authentication
context with content-policy responsibility; Option C (Offline Sync
sub-aggregate) puts orchestration in a storage-hygiene context;
Option E (cross-cutting policy service) is Vernon explicit anti-
pattern.

## Consequences

Positive:

- Clear owner for pack registry + import session lifecycle +
  manifest validation + IP-safety gate + multi-BC delegation
  orchestration + audit trail.
- Contracts-first path: commands, events, read models, consumed
  facts all named at draft precision.
- ADR-0056 + ADR-0057 dangling "FMX-33 Community Overlay Pipeline"
  references resolve cleanly to a defined context.
- Vernon canonical Process Manager / Saga + Open Host Service +
  Published Language pattern applied directly.
- IP-safety surface (`risk:legal`) contained in one bounded context;
  GD-0015 + ADR-0007 audit is one module not scattered code.
- Real-world platform precedent (Bethesda + Steam Workshop +
  CurseForge + Modrinth) mirrored - playtesters / modders recognise
  the model.
- EU DSA 2023-2026 governance trends (upload gate + provenance +
  complaint-driven enforcement + audit trail) natively supported.
- ADR-0016 (proposed) gets a concrete implementer; transitions from
  "designed but unowned" to "designed + implemented context".

Negative:

- Adds one bounded context to the map (17th if accepted before
  ADR-0052 / ADR-0054; 18th / 19th depending on acceptance order).
- IP-clean rule terminology + manifest schema authoring requires
  careful drafting (GD-0015 + ADR-0007 hardline). `risk:legal`
  label set on ADR + apply-PR.
- Process Manager / Saga coordination across 5+ downstream BCs is
  non-trivial. Pattern is well-established (ADR-0056 Process Manager
  for transfer eligibility, ADR-0057 Process Manager inside
  rivalry); curve tuning is GDDR territory.
- ADR-0016 needs cross-reference update after acceptance to mark
  "implemented by ADR-0059" or stays as upstream content/scope
  reference.
- Repeat-infringer / EU DSA compliance reporting features stay
  post-MVP; foundations (`IPSafetyAuditLog`, `RevokePack`) are
  defined now.

## Map patch proposal

Applies only on Nico's acceptance. Until then, the bounded-context
map keeps the sixteen-context baseline. The patch is **order-
tolerant** - ADR-0052 (People) and ADR-0054 (Narrative) may be
accepted before or after this ADR.

### Patch 1: §1 table

Rename section header to reflect new count ("Seventeen" /
"Eighteen" / "Nineteen" bounded contexts depending on how many
parallel drafts are accepted at apply-time). Insert one new row
after Rivalry System:

```diff
 | **Rivalry System** | RivalryEdge graph (club pair × sub-score history × threshold-tier FSM), 5-sub-score formula (regional + historical + sporting + fan-incident + transfer-tension), deterministic per-season decay, threshold-tier classification | RivalryScore / IsDerbyFixture / TopRivalsForClub / RivalryIncidentTimeline / RivalryGraphSnapshot / DerbyContext queries; RivalryTierTransitioned events to Fan Ecology + Matchday-Event-Engine + Watch Party + Manager & Legacy + Notification + Match + Tactics + Regulations consumers |
+| **Community Overlay Pipeline** | Pack registry (platform-scope catalog with versions + dependencies + IP disclaimer status + revoked status), import-session FSM (uploaded → validating → approved → activated → archived), manifest schema validation, conflict-resolution policy, IP-safety gate + audit log, per-save active-packs snapshot (immutable at save creation) | AvailablePacks / PackDetails / ActivePacksInSave / PackConflictAnalysis / IPSafetyAuditTrail / PendingValidations queries; PackActivated / PackRevoked / IPGateEvaluated events; orchestrates semantic-validation delegations to Regulations + Rivalry + Tactics + Squad + Club + future Identity Corpus per Vernon Process Manager / Saga pattern |
 | **Offline Sync** | MVP: cache/draft status and freshness metadata. Future: local outbox, command replay, conflict logic | Draft/cache status now; sync status later |
```

Add an explanatory paragraph after the table noting boundaries:
"Community Overlay Pipeline consumes ADR-0016 community-pack content
+ manifests via P2P import; orchestrates semantic-validation
delegations to Regulations & Compliance (rule overrides per ADR-0056
Public Contract), Rivalry System (rivalry seed overrides per ADR-
0057), Tactics (preset overrides future-scope per ADR-0055), Squad
& Player (name corpus overrides future-scope), Club Management
(economy profile overrides future-scope per ADR-0050). It owns the
**decision** (activate or reject) gated by ADR-0007 + GD-0015 IP-
safety hardline + manifest IP disclaimer acceptance. Pack activation
is **save-creation only** per ADR-0051 determinism rule; per-save
`ActivePacksSnapshot` is immutable thereafter. Pack revocation
(community takedown / IP claim) updates platform-scope registry but
does not affect already-activated saves (canonical Vernon versioned-
aggregate immutable-after-activation pattern). Real-world platform
precedent: Bethesda Creation Kit + Bethesda.net Mods + Steam
Workshop + CurseForge / Modrinth manifest-driven compliance + 2023-
2026 EU DSA upload gate + provenance metadata + complaint-driven
enforcement + audit trail."

### Patch 2: §2 Mermaid

Insert `Overlay` node + edges:

```diff
     Rival["Rivalry System"]
+    Overlay["Community Overlay Pipeline"]
     Offline["Offline Sync"]
     Audit["Audit & Security"]

     Identity --> League
     Identity --> Club
     Identity --> ML
     Identity --> Staff
     Identity --> Tactics
     Identity --> Reg
     Identity --> Rival
+    Identity --> Overlay
+    League --> Overlay
+    Overlay --> Reg
+    Overlay --> Rival
+    Overlay --> Tactics
+    Overlay --> Squad
+    Overlay --> Club
+    Overlay --> ML
+    Overlay --> Notif
+    Reg --> Overlay
+    Rival --> Overlay
+    Tactics --> Overlay
+    Squad --> Overlay
+    Club --> Overlay
```

(`Overlay` consumes from Identity (auth), League (save creation
trigger), and **bidirectionally** from Regulations + Rivalry +
Tactics + Squad + Club (request semantic validation → receive
response). It publishes pack-activation events to Regulations +
Rivalry + Tactics + Squad + Club at save creation; publishes
`PackActivated` / `PackRevoked` / `IPGateEvaluated` events to
Notification + Manager & Legacy. The bidirectional edges with
Regulations / Rivalry reflect the Process Manager / Saga delegation
pattern: Overlay requests semantic validation; downstream BCs
respond via `*OverrideValidated` / `*OverrideRejected` events
consumed by Overlay's Saga.)

### Patch 3: §4 Source mapping

Add `community-overlay/` to the per-context folder list:

```diff
   manager-legacy/
   staff-operations/
   tactics/
   regulations/
   rivalry/
+  community-overlay/
   sync/
   audit/
```

### Patch 4: ADR-0016 cross-reference update

Update ADR-0016 (Community Dataset Overrides, currently proposed) to
mark "implemented by ADR-0059 Community Overlay Pipeline Context"
in its frontmatter `superseded_by:` or `related:` field. ADR-0016
stays the upstream scope/content/manifest definition; ADR-0059
defines the bounded context that implements it. This is editorial /
referential, not a status change for ADR-0016 itself.

## Supersedes

None

## Related Docs

- [[../../60-Research/community-overlay-pipeline-bounded-context-2026-05-28]]
  - FMX-33 ratification synthesis (this ADR's decision basis).
- [[../../60-Research/community-overlay-pipeline-decision-2026-06-07]]
  - 2026-06-07 external re-grounding (DDD ingestion context + DSA).
- [[../../00-Index/Open-Decisions-Dossier]] - consolidated open-decision Q&A.
- [[../../60-Research/raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  - FMX-33 raw research (genre / DDD / real-world surveys).
- [[ADR-0016-community-dataset-overrides]] - upstream scope +
  content + manifest definition; ADR-0059 implements its pipeline.
- [[../../50-Game-Design/community-editor-and-datasets]] - GDDR;
  editor scope + validation pipeline.
- [[../../50-Game-Design/GD-0015-ip-clean-data]] - IP-clean
  hardline.
- [[ADR-0007-naming-schema]] - IP-clean naming + living-person
  filter (denylist source for IP-gate).
- [[ADR-0019-modular-monolith-ddd]] - modular monolith ground
  rules.
- [[ADR-0027-postgres-data-model]] - mixed platform / per-save
  schema convention.
- [[ADR-0028-postgres-transactional-outbox]] - event delivery
  mechanism.
- [[ADR-0050-club-economy-accounting-ledger]] - future-scope
  economy profile override consumer.
- [[ADR-0051-manager-and-legacy-context]] - cross-save determinism
  rule; pack activation at save creation only.
- [[ADR-0055-tactics-context]] - future-scope tactic preset
  override consumer.
- [[ADR-0056-regulations-compliance-context]] - rule override
  validation provider; explicitly references "FMX-33 Community
  Overlay Pipeline".
- [[ADR-0057-rivalry-system-context]] - rivalry seed override
  validation provider; explicitly references "FMX-33 Community
  Overlay Pipeline".
- [[ADR-0052-people-persona-and-skills-context]] - parallel draft;
  no direct boundary requirement.
- [[ADR-0054-narrative-context-and-ai-narration-framework]] -
  parallel draft; no direct boundary requirement.
