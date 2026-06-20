---
title: Community Overlay Pipeline Bounded Context - Ownership Synthesis 2026-05-28
status: draft
tags: [research, community, overlay, import, bounded-context, risk-legal, fmx-33]
context: community-overlay
created: 2026-05-28
updated: 2026-05-28
type: research
binding: false
linear: FMX-33
sourceType: external
related:
  - [[raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  - [[../50-Game-Design/community-editor-and-datasets]]
  - [[../20-Features/feature-community-editor]]
  - [[../50-Game-Design/GD-0015-ip-clean-data]]
  - [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]]
  - [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]]
  - [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]]
  - [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - [[../10-Architecture/bounded-context-map]]
---

# Community Overlay Pipeline Bounded Context - Ownership Synthesis 2026-05-28

## Question

The 16-context bounded-context map has no Community Overlay Pipeline
owner. ADR-0016 (proposed 2026-05-19) defines the pack manifest model
+ validation pipeline + save-creation determinism + IP-safety stance,
but no bounded context claims the orchestrator. **Critical state:
ADR-0056 (Regulations, accepted 2026-05-28) and ADR-0057 (Rivalry,
accepted 2026-05-28) already explicitly delegated semantic validation
of pack overrides to the owning BCs**, leaving the orchestrator +
manifest validation + IP-safety gate + immutability + multi-BC
delegation as the residual concern.

**Who owns the Community Overlay Pipeline?**

## Status

This is a sourced ownership dossier for FMX-33. It does not change the
bounded-context map. The recommendation feeds a new draft ADR-0059
(`status: proposed`, `binding: false`) that Nico ratifies separately.
`risk:legal` label set throughout.

`raw research -> this synthesis -> ADR-0059 §Options + §Recommendation -> Nico decision`

## Summary

**Recommendation: Option D (Community Overlay Pipeline as own bounded
context, 17th).** Six-of-six DDD split criteria fire (own ubiquitous
language - Manifest / ImportSession / IPGate / Activation; own
lifecycle - uploaded → validating → approved → activated → archived;
own storage - pack registry + activation history per save + IP audit
log; multiple consumers - Regulations + Rivalry + Squad & Player +
Club + Tactics + Match + Notification; cross-cutting orchestration
role; no co-change with any single downstream BC). Vernon canonical
ingestion-as-bounded-context pattern is decisive (Stripe Connect
onboarding + Avalara data sync + Salesforce Data Import Wizard +
GitHub Actions workflow ingestion + OpenStreetMap changeset workflow
as direct DDD analogues). Real-world platform precedent (Bethesda
Creation Kit + Bethesda.net + Steam Workshop + CurseForge / Modrinth
manifest-driven) confirms ingestion as distinct subsystem. Genre
precedent (FM `.fmf` save-creation-only activation + multiple-pack
selection + version-strict + internal merge) mirrors the proposed
design. **The existing FMX delegation pattern from ADR-0056 + ADR-0057
already-in-place is the strongest single argument**: those ADRs
explicitly reference "FMX-33 Community Overlay Pipeline" as the
upstream orchestrator they delegate to. `risk:legal` IP-safety
hardline contained in one BC.

## Findings

### Finding F1: ADR-0016 designs the pipeline concretely but unattributed

- **Source:** [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  (proposed 2026-05-19);
  [[../50-Game-Design/community-editor-and-datasets]];
  [[../20-Features/feature-community-editor]].
- **Confidence:** High.
- **Finding:** ADR-0016 designs:
  - **Pack manifest** with `id`, `version`, `game_version_min`,
    `game_version_max`, `pack_type` (override / expansion / scenario),
    `depends_on`, `replaces`, `adds`, `priority`, `ip_disclaimer:
    required`.
  - **Override scope** (CAN): club names + colours + logos +
    competitions + rivalries + player names + attributes + league
    structure + scenario dates + historical worlds + crest icon
    packs.
  - **Override scope** (CANNOT): IP-clean core determinism (stable IDs
    as PKs) + encryption envelope / RNG contract (ADR-0005) + cross-
    save rule set versioning (per-save immutability post-creation
    per ADR-0051 / ADR-0056).
  - **Validation pipeline**: schema validation → game-version
    compatibility check → conflict detection (high-priority pack
    wins) → IP disclaimer acceptance → import preview → user confirm
    → activation → save migration if applicable.
  - **Sandbox**: P2P distribution only; FMX does not host community
    packs.
  - **IP-safety**: ADR-0007 §13 living-person filter + GD-0015 IP-
    clean hardline + denylist CI gate.
  - **Save-creation determinism**: pack activation snapshot at save
    creation; immutable thereafter (except pre-authored future-
    changes per ADR-0051).
- **Impact on FMX-33:** The pipeline exists concretely in design;
  manifest schema + validation steps + IP rules + save-creation
  immutability are all specified. The orchestrator + IP-safety gate +
  multi-BC delegation has no named owner. Naming none keeps ADR-0016
  in a proposed-but-not-implemented limbo and leaves the cluster of
  downstream consumers without a defined upstream.

### Finding F2: ADR-0056 + ADR-0057 already delegated semantic validation; orchestration is the residual

- **Source:**
  [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  + [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  (both accepted 2026-05-28);
  [[../10-Architecture/bounded-context-map]] lines 106 + 129.
- **Confidence:** High (direct ratified quotation).
- **Finding:** **bounded-context-map §1 Regulations explanatory
  paragraph (line 129)**: "Cross-save preset sharing of community
  rule overrides flows through FMX-33 Community Overlay Pipeline per
  ADR-0016; **Regulations BC owns schema + semantic validation per
  Vernon**." **bounded-context-map §1 Rivalry explanatory paragraph
  (line 106)**: "Cross-save rivalry pre-population (era profiles +
  community overlays) flows through ADR-0051 Manager & Legacy legacy
  seeds + ADR-0016 Community Overlay surface per FMX-33 Community
  Overlay Pipeline; **Rivalry BC owns schema + semantic validation
  per Vernon**." ADR-0056 §Public contract draft commands include
  `ImportRuleOverride` (consumed from FMX-33 Community Overlay
  Pipeline). ADR-0057 §Public contract draft commands include
  `ImportRivalrySeedFromOverlay` (FMX-33 Community Overlay Pipeline
  surface).
- **Impact on FMX-33:** **Two ratified ADRs (accepted, binding:true)
  explicitly reference the FMX-33 Community Overlay Pipeline as the
  upstream orchestrator.** They delegated the semantic validation
  (what's a valid rule? what's a valid rivalry seed?) to themselves
  per Vernon canonical pattern. The orchestrator + manifest schema
  validation + IP-safety gate + immutability + multi-BC routing +
  save-creation snapshot is the residual concern. **The existing
  delegation explicitly names a missing context that this beat must
  define.** Not naming it now leaves both Regulations and Rivalry
  with a dangling reference.

### Finding F3: ADR-0027 + ADR-0028 + ADR-0051 constrain the storage + delivery + determinism shape

- **Source:** ADR-0027 (Postgres Data Model, accepted, binding);
  ADR-0028 (Transactional Outbox, accepted, binding); ADR-0051
  (Manager & Legacy, accepted, binding).
- **Confidence:** High.
- **Finding:**
  - Per-save isolation via `save_<uuidv7hex>` schema for game state.
  - Platform data (catalog metadata, pack registry) in `public`
    schema.
  - Domain events delivered via transactional outbox (`outbox_event`
    with idempotent `event_id` UUIDv7).
  - **Cross-save meta read only at save creation** per ADR-0051
    determinism rule: "A running save must never read mutable cross-
    save meta after creation."
- **Impact on FMX-33:** Community Overlay Pipeline must:
  - Store pack registry + IP audit log + activation history in
    `public` (platform-scope).
  - Apply pack at save creation only; copy into save snapshot;
    immutable thereafter per ADR-0051.
  - Emit pack-activation events via transactional outbox per
    ADR-0028.
  - Match canonical immutable-after-activation pattern (synthesis F4
    Query 2).

### Finding F4: DDD canonical pattern - import/ingestion/ETL warrants own bounded context

- **Source:**
  [[raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  Query 2; Vaughn Vernon strategic design; Martin Fowler bounded-
  context page; Microsoft Learn DDD guidance.
- **Confidence:** High.
- **Finding:** Six canonical criteria for import-as-own-bounded-
  context (Vernon + Fowler + Microsoft):
  1. Distinct ubiquitous language (Manifest, ImportSession,
     ValidationRun, CompatibilityCheck, ConflictSet, IPGate,
     Activation, Archive) different from any downstream BC's terms.
  2. Non-trivial domain logic specific to ingestion (manifest
     parsing, version compatibility, dependency resolution, conflict
     detection, IP-safety gate) - business policy about what's
     allowed to enter the system.
  3. Own domain lifecycle (uploaded → validating → approved →
     activated → archived) as classic aggregate lifecycle.
  4. Interacts with multiple downstream BCs and shields them -
     textbook ACL / translation context.
  5. Own governance + risk regime (IP/legal/compliance/audit) -
     policy-heavy subdomain.
  6. Independent evolution pressure - import rules change on a
     different cadence than downstream BCs.
- **Real-world DDD analogues:**
  - **Stripe Connect onboarding / account provisioning** - own
    lifecycle (account application → KYC → verification → pending /
    verified / rejected); separate from Payments / Accounts BC.
  - **Avalara data sync / tax content ingestion** - content
    releases + effective dates + jurisdictional coverage separate
    from tax-calculation BC.
  - **Salesforce Data Import Wizard** - import job + mapping +
    deduplication + dry-run + failure handling distinct from
    Accounts / Contacts BCs.
  - **GitHub Actions workflow ingestion** - workflow file +
    validation + forbidden actions + repository policy compliance
    separate from Execution / Runner BC.
  - **OpenStreetMap changeset workflow** - changeset + validation +
    conflict detection + review + revert separate from Map Data BC.
- **Orchestration pattern**: Process Manager / Saga in application
  layer of Import BC; downstream BCs (Regulations + Rivalry) provide
  domain services for semantic validation; Import BC owns the
  decision (activate or reject).
- **IP-safety / legal gates belong inside Import BC** as domain
  invariants on ImportSession activation. Cross-cutting Policy
  Service can exist as supporting infrastructure, but **decision**
  belongs in Import BC.
- **Immutable-after-activation**: versioned aggregates + Published
  Language to downstream BCs; downstream BCs reference immutable IDs
  (RulePackId, SeedSetId); changing requires new import producing
  new IDs.
- **Impact on FMX-33:** Direct DDD support for Option D (Community
  Overlay Pipeline as own bounded context). Vernon's canonical
  pattern matches the FMX problem shape exactly. The orchestrator +
  IP gate + manifest validation + immutability + multi-BC delegation
  all fit the textbook ingestion-BC model.

### Finding F5: Real-world platform precedent - Bethesda + Steam Workshop + CurseForge + EU DSA

- **Source:**
  [[raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  Query 3; Nexus Mods Creation Kit guide; Bethesda.net Creations
  page.
- **Confidence:** Medium.
- **Finding:** Real-world community-content platforms 2023-2026
  follow consistent architecture:
  - **Bethesda Creation Kit + Bethesda.net Mods**: creator-authored
    upload + Creation Kit technical validation gate + creator IP
    disclaimer ("use an original mod or have permission for ported
    assets") + post-publication takedowns. Bethesda.net hosted
    distribution + Nexus Mods third-party repository.
  - **Steam Workshop**: notice-and-takedown driven (NOT pre-
    clearance). Automated review for file format + account integrity
    + game-specific packaging; NOT asset copyright provenance. Manual
    review when flagged. Trademark disputes via report/notice
    channels.
  - **Minecraft Java modpacks (CurseForge / Modrinth)** = **manifest-
    driven compliance pipeline**. Pack manifests validate exact mods
    + versions + loaders + dependencies. Client launcher resolves
    manifest entries + downloads + flags conflicts at install-time.
    IP enforcement via platform rules + repository metadata +
    attribution + license fields + removal-after-complaint.
  - **FM Editor + community DBs**: SI positions Editor as sanctioned
    tool; community packs framed as fan-made enhancements outside
    official game data. Disclaimers: fan-made + not affiliated with
    SI/Sega + use at own risk.
  - **2023-2026 governance trends**: EU DSA stronger duties around
    notice handling + transparency + risk management; Bethesda paid-
    mods follow-ups push toward creator authorisation + asset
    provenance + commercialisation rules; Steam Workshop policy:
    better reporting tools + clearer content rules. Pattern: upload
    gate + provenance metadata + complaint-driven enforcement +
    audit trail.
- **Impact on FMX-33:** Real-world platforms converge on the same
  architecture FMX-33 must implement: upload gate + manifest
  validation + IP-safety disclaimer + dependency resolution + post-
  activation takedown / archive support + audit trail. Each is
  modelled as a distinct subsystem from the consuming game / app
  contexts. Pattern endorses Option D.

### Finding F6: Genre precedent - FM .fmf save-creation-only activation is the closest direct precedent

- **Source:**
  [[raw-perplexity/raw-community-overlay-pipeline-2026-05-28]]
  Query 1; fmscout.com + Steam Workshop FM data packs.
- **Confidence:** Medium-high.
- **Finding:** Football Manager:
  - `.fmf` editor data files in `editor data` folder; user selects
    at new-career creation; multiple packs can be enabled; FM's
    internal merge applies them.
  - Schema validation tied to FM DB version; community emphasises
    matching FM version; incompatible packs blocked or partially
    loaded with error messages.
  - **Activation: save-creation only. Immutable thereafter.** "Once
    you have created a save: you cannot add or remove editor data
    files for that save."
  - Conflict resolution: deterministic internal merge; community
    warned NOT to stack overlapping DBs.
  - IP enforcement: NO in-game IP confirmation; reactive via Steam
    Workshop + fan-site policies + takedowns.
  - Universal cross-game pattern: save-creation-only activation +
    version-strict + no in-game IP gates.
- **Impact on FMX-33:** FM's save-creation-only activation +
  multiple-pack selection + version-strict compatibility + internal
  merge is the closest direct genre precedent. FMX would lead the
  genre with **declared in-game IP-safety hardline** (ADR-0007
  living-person filter + GD-0015 IP-clean denylist + manifest
  `ip_disclaimer: required`) - no surveyed sim has this. Option D
  is the architectural shape that makes this declaration possible.

## Inputs For Decisions

If Option D is accepted, the following items encode in ADR-0059:

- **Context owner:** Community Overlay Pipeline as the next bounded
  context (17th if accepted before ADR-0052 / ADR-0054; 18th / 19th
  depending on acceptance order of parallel drafts).
- **Owned aggregates:**
  - `PackRegistry` (platform-scope catalog of imported packs:
    metadata, versions, dependencies, IP-disclaimer-signed status,
    archived status).
  - `ImportSession` aggregate (FSM: uploaded → manifest-parsed →
    validating → approved → activated → archived; failure path:
    rejected / expired).
  - `ManifestSchema` aggregate (versioned schema definitions per
    pack-format-version; CI-gated against ADR-0007 + GD-0015).
  - `IPSafetyAuditLog` aggregate (denylist matches + disclaimer
    acceptance + reviewer notes; per-pack + per-import-session;
    `risk:legal` review surface).
  - `ConflictResolutionPolicy` (priority-based; last-write-wins for
    same priority; dependency-aware merge per CurseForge precedent).
- **Public contract:**
  - Commands: `UploadCommunityPack`, `ParseManifest`,
    `ValidateCompatibility`, `RequestSemanticValidation` (per
    downstream BC), `RecordIPGateDecision`, `ApprovePack`,
    `RejectPack`, `ActivatePackAtSaveCreation`, `ArchivePack`,
    `RevokePack` (community-takedown / IP claim).
  - Events: `CommunityPackUploaded`, `ManifestParsed`,
    `CompatibilityChecked`, `SemanticValidationRequested`,
    `SemanticValidationCompleted`, `IPGateEvaluated`,
    `PackApproved`, `PackActivated`, `PackArchived`, `PackRevoked`.
  - Queries (read models):
    - `AvailablePacks(gameVersion)` - packs valid for the current
      game build.
    - `PackDetails(packId)` - manifest + semantic validation status
      + IP disclaimer status + activation history.
    - `ActivePacksInSave(saveId)` - immutable snapshot of activated
      packs for a given save.
    - `PackConflictAnalysis(packIds)` - dependency + override
      conflict surface for UI preview before activation.
    - `IPSafetyAuditTrail(packId)` - audit log for `risk:legal`
      review.
- **Consumed facts** (delegation responses from downstream BCs per
  ADR-0056 + ADR-0057 pattern):
  - `RuleOverrideValidated` / `RuleOverrideRejected` from
    Regulations & Compliance (per ADR-0056 Public Contract).
  - `RivalryOverrideValidated` / `RivalryOverrideRejected` from
    Rivalry System (per ADR-0057 Public Contract).
  - `TacticPresetOverrideValidated` from Tactics (when accepted -
    deferred per ADR-0055).
  - `EconomyProfileOverrideValidated` from Club Management (when
    designed).
  - `NameCorpusOverrideValidated` from a future "Identity Corpus"
    consumer or directly from Squad & Player.
- **Storage scope:** **mixed**.
  - **Platform-scope** (`public` schema) for PackRegistry +
    ImportSession + IPSafetyAuditLog (cross-save catalog).
  - **Per-save** (`save_<uuidv7hex>` schema) for activation snapshot
    (which packs were activated at this save's creation; immutable).
- **Determinism:** Pack activation is **save-creation only**. Active
  rule set + community overrides copied into save snapshot at
  creation per ADR-0051 determinism rule. Running save never re-
  reads mutable pack registry. Per-save activation snapshot is
  immutable.
- **IP-safety as domain invariant:** Activation transition guarded
  by `IPGateEvaluated == accepted`. Denylist match (ADR-0007 living-
  person filter + GD-0015 IP-clean hardline) is hard fail. Disclaimer
  acceptance is required state for activation. `risk:legal` audit
  log preserved for compliance review.
- **Orchestration pattern:** **Process Manager / Saga in
  application layer of Community Overlay BC**. Saga coordinates
  manifest parsing → compatibility check → multi-BC semantic
  validation (Regulations + Rivalry + future Tactics + future
  Identity Corpus) → IP gate → user preview → activation. Each
  downstream BC owns its semantic validation per Vernon (ADR-0056 +
  ADR-0057 already-in-place); Community Overlay BC owns the
  decision.
- **Map patch proposal:** insert "Community Overlay Pipeline" as
  the next bounded context row in §1; add `Overlay` node + edges in
  §2 Mermaid (consumes Identity + League + downstream BC validation
  responses; publishes activation events to Regulations + Rivalry +
  Tactics + Squad + Club + Notification at save creation); add
  `community-overlay/` folder in §4 source mapping. Insert position
  depends on acceptance order of parallel drafts; the patch is
  order-tolerant.

## Future-scope notes (classified future-scope)

Not ratification blockers; resolve in follow-up GDDR / ADR work:

1. **Community editor UI** (in-game pack authoring). Post-MVP per
   community-editor-and-datasets.md §editor scope. Community Overlay
   BC owns the import surface; editor UI consumes via SDK pattern.
2. **Tactics preset sharing via Community Overlay** (ADR-0055
   Tactics future-scope). Deferred per ADR-0055; when designed,
   Tactics will provide `TacticPresetOverrideValidated` per
   ADR-0056 / ADR-0057 pattern.
3. **Economy profile community overrides** (per-country payment
   cadence + licence/compliance overrides per ADR-0050). Deferred;
   when designed, Club Management provides
   `EconomyProfileOverrideValidated`.
4. **Name corpus community overrides** (per-locale name lists with
   living-person filter + provenance per ADR-0007 §13). Deferred;
   consumer TBD (Squad & Player or future Identity Corpus BC).
5. **Community pack hosting / marketplace** (out of MVP per
   ADR-0016 §sandbox). P2P distribution only; Community Overlay BC
   handles import only, not hosting.
6. **Pack migration logic** (version mismatch between activated pack
   in save and pack on disk). ADR-0016 sketches the rules; Community
   Overlay BC owns the migration state machine.
7. **Repeat-infringer governance** (per 2023-2026 EU DSA precedent).
   Future-scope `RevokePack` command; community takedown workflow.
8. **Compliance reporting + audit trail externalisation** (for
   regulatory review). `IPSafetyAuditTrail` read model is the
   foundation; external reporting integration is future-scope.
9. **Pack dependency resolution algorithm** (CurseForge / Modrinth
   precedent). Sketched in ADR-0016 §validation pipeline; algorithm
   tuning is GDDR territory.
10. **In-game pack discovery UI** (browse + filter + install). Out
    of MVP; Community Overlay BC publishes `AvailablePacks` read
    model that any UI can consume.

## Why not Option A (Platform service outside the bounded-context map)?

A library / handler in `packages/db` that delegates to owning BCs;
NOT a bounded context.

- **Argument for:** the orchestration is fairly mechanical (validate
  manifest → route to BCs → activate at save creation). It runs at
  save-creation time, not as a runtime FSM. Platform tooling (DB
  migrations, schema sync) already lives in `packages/db`.
- **Arguments against:**
  - **Substantial domain logic exists** - IP-safety gate +
    manifest validation + conflict resolution + dependency
    resolution + version compatibility + audit trail are NOT
    mechanical (Vernon Query 2: "import logic specific to
    ingestion = NOT generic plumbing; business policy about
    what's allowed to enter the system").
  - **Own ubiquitous language exists** - Manifest, ImportSession,
    IPGate, Activation, Archive don't belong to any downstream BC's
    language. Vernon: distinct language = own BC.
  - **Own lifecycle exists** - uploaded → validating → approved →
    activated → archived is a textbook aggregate lifecycle, not a
    function call.
  - **IP-safety / legal gating** is policy-heavy subdomain. Vernon
    Query 2: "policy-heavy subdomain = own BC, not buried in
    plumbing."
  - **Existing FMX delegation pattern (synthesis F2)** explicitly
    references "FMX-33 Community Overlay Pipeline" as the upstream
    BC that delegates to Regulations + Rivalry. Treating it as a
    library makes the dangling reference architectural debt.

## Why not Option B (Sub-aggregate inside Identity & Access)?

Identity & Access absorbs pack import because pack upload is a
user-triggered action (logged in + authorised).

- **Argument for:** Identity & Access already handles user actions +
  authorisation; pack upload is "yet another user action".
- **Arguments against:**
  - **Identity's existing scope is "user, sessions, roles, device
    state"** (bounded-context-map §1) - account ownership +
    authentication. Pack lifecycle + manifest parsing + IP gating +
    semantic validation routing have nothing to do with Identity's
    language.
  - **Multi-BC delegation requires the orchestrator to know about
    Regulations + Rivalry + Tactics + Club + Squad + ...** -
    Identity is not in the business of knowing about game-state BCs.
  - **IP-safety hardline** is a different governance concern than
    user-account management. Different audit trail, different
    review process, different stakeholders.

## Why not Option C (Sub-aggregate inside Offline Sync)?

Offline Sync absorbs pack import because packs flow through cache /
draft / file surfaces.

- **Argument for:** ADR-0020 Offline Sync owns "cache / draft status
  and freshness metadata"; pack files flow through offline storage.
- **Arguments against:**
  - **Offline Sync's MVP scope is "cache / draft status and
    freshness metadata"** - storage hygiene + sync state. Pack
    lifecycle + manifest + IP gate + semantic validation are not
    Offline Sync language.
  - **Pack activation is save-creation only** (per ADR-0051
    determinism) - not a sync surface. Save-creation runs once;
    offline sync handles continuous state.
  - **Multi-BC delegation** doesn't fit Offline Sync's role -
    Offline Sync is downstream of, not orchestrator of, the game-
    state BCs.

## Why not Option E (rejected) - Cross-cutting Policy Service called by each consumer?

Each consumer BC (Regulations + Rivalry + ...) calls a shared
`CommunityOverlayPolicy` service for pack ingestion.

- **Trade-off:** Vernon's explicit anti-pattern (synthesis F4 from
  Query 2 analog to FMX-34 Query 2). "On-demand Domain Service
  called by each consumer" leaks cross-context model into everyone
  else's language, leads to tight coupling and duplication. Listed
  for completeness; rejected.

## What the ratification PR includes

Per the FMX-33 plan and
[[../30-Implementation/domain-research-workflow]] Phase 5:

- This synthesis note.
- The raw research at
  [[raw-perplexity/raw-community-overlay-pipeline-2026-05-28]].
- A new draft ADR-0059 with four options (A platform service / B
  Identity sub-aggregate / C Offline Sync sub-aggregate / D own
  context) + Option E anti-pattern explicitly rejected,
  §Recommendation = Option D, Public-contract sketch, determinism +
  storage rules, §Map patch proposal as fenced diff. `risk:legal`
  label set.
- Note: ADR-0016 (Community Dataset Overrides, proposed) becomes
  the upstream scope/content definition that ADR-0059 implements.
  ADR-0016 status updated to "implemented by ADR-0059 if accepted"
  in the apply-PR.
- Decision-Log row for ADR-0059 (`proposed`).
- Current-State FMX-33 anchor block.
- Session handoff naming the ratify-ask:
  *"Accept Option D (recommended), choose A / B / C, or Defer?"*

The bounded-context map is **not** modified by this PR. The §Map
patch applies only on Nico's acceptance via a follow-up apply PR
(analog FMX-35 / FMX-36 / FMX-37 / FMX-39 / FMX-40).

## Related vault

- [[../10-Architecture/09-Decisions/ADR-0016-community-dataset-overrides]]
  - upstream scope + content definition.
- [[../10-Architecture/09-Decisions/ADR-0019-modular-monolith-ddd]] -
  modular monolith ground rules.
- [[../10-Architecture/09-Decisions/ADR-0027-postgres-data-model]] -
  storage scope conventions (mixed platform + per-save).
- [[../10-Architecture/09-Decisions/ADR-0028-postgres-transactional-outbox]]
  - event delivery mechanism.
- [[../10-Architecture/09-Decisions/ADR-0051-manager-and-legacy-context]]
  - cross-save determinism rule; pack activation snapshot at save
  creation.
- [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] -
  future-scope tactic-preset community sharing.
- [[../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - Regulations BC explicitly delegates semantic validation to
  itself; FMX-33 BC is the upstream orchestrator.
- [[../10-Architecture/09-Decisions/ADR-0057-rivalry-system-context]]
  - Rivalry BC explicitly delegates semantic validation to itself;
  FMX-33 BC is the upstream orchestrator.
- [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] - IP-
  clean naming + living-person filter (denylist source for IP-gate).
- [[../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - future-scope economy profile community overrides.
- [[../50-Game-Design/community-editor-and-datasets]] - GDDR;
  editor scope + validation pipeline.
- [[../50-Game-Design/GD-0015-ip-clean-data]] - IP-clean hardline.
- [[../30-Implementation/domain-research-workflow]] - the workflow
  this dossier follows.
