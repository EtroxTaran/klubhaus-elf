---
title: Community Overlay Pipeline module
status: draft
tags: [architecture, module, community, overlay, import, ip-safety]
context: community-overlay
created: 2026-06-20
updated: 2026-06-20
type: module
binding: false
related: [[../05-Building-Blocks]], [[../bounded-context-map]], [[../09-Decisions/ADR-0059-community-overlay-pipeline-context]], [[../09-Decisions/ADR-0016-community-dataset-overrides]], [[../09-Decisions/ADR-0027-postgres-data-model]], [[../09-Decisions/ADR-0121-architecture-fitness-function-no-shared-tables]]
---

# Community Overlay Pipeline Boundary

## Purpose

Ingestion/orchestration boundary for community datapacks: validates pack
manifests, runs the IP-safety gate, routes semantic validation to owning
contexts, and snapshots activated packs immutably at save creation. It owns the
**decision** (activate or reject), not the semantic rules of any override
(ADR-0059).

## Owns

- `PackRegistry` aggregate — platform-scope catalog of imported packs
  (metadata, versions, dependencies, IP-disclaimer-signed status, archived,
  revoked).
- `ImportSession` aggregate — per import attempt; FSM uploaded → manifest-parsed
  → validating → approved → activated → archived; failure path rejected /
  expired.
- `ManifestSchema` aggregate — versioned schema definitions per pack-format
  version; CI-gated against ADR-0007 + GD-0015 (and the ADR-0097 Zod/CHECK
  bounds per the BCM row).
- `IPSafetyAuditLog` aggregate — denylist matches + disclaimer acceptance +
  reviewer notes; per-pack + per-import-session; `risk:legal` review surface.
- `ConflictResolutionPolicy` — priority-based; last-write-wins for equal
  priority; dependency-aware merge.
- `ActivePacksSnapshot` — per-save, immutable at save creation (ADR-0051
  determinism rule); the `ActivePacksSnapshot` refs feed SavePayload (ADR-0098).
- (FMX-188, if accepted) `CommunityTextRef` text-trust classification for
  community-authored prose fields that may later feed Narrative LLM prose.

Does **not** own: semantic validation of rule / rivalry / tactic-preset /
economy-profile / name-corpus overrides (each owning BC validates its own); pack
hosting/distribution (P2P only per ADR-0016); in-game pack-discovery UI; user
authentication (Identity & Access); the IP-clean denylist source data (ADR-0007
+ GD-0015 — consumed as policy inputs).

## Public contract

Commands (draft per ADR-0059):

- `UploadCommunityPack`, `ParseManifest`, `ValidateCompatibility`,
  `RequestSemanticValidation(downstreamBC, override)`, `RecordIPGateDecision`,
  `ApprovePack`, `RejectPack`, `ActivatePackAtSaveCreation`, `ArchivePack`,
  `RevokePack` (community-takedown / IP claim), `RecordDisclaimerAcceptance`.

Domain events (draft per ADR-0059):

- `CommunityPackUploaded`, `ManifestParsed`, `CompatibilityChecked`,
  `SemanticValidationRequested`, `SemanticValidationCompleted`,
  `IPGateEvaluated`, `PackApproved`, `PackRejected`, `PackActivated`,
  `PackArchived`, `PackRevoked`.

Queries / read models (draft per ADR-0059):

- `AvailablePacks(gameVersion)`, `PackDetails(packId)`,
  `ActivePacksInSave(saveId)`, `PackConflictAnalysis(packIds)`,
  `IPSafetyAuditTrail(packId)`, `PendingValidations(packId)`, and (FMX-188
  proposed) `CommunityTextRefs(packId)`.

## Storage ownership

- **Platform-scope** (`public` schema, ADR-0027): `PackRegistry`,
  `ImportSession` history, `ManifestSchema` versions, `IPSafetyAuditLog` —
  cross-save catalog.
- **Per-save** (`save_<uuidv7hex>` schema, ADR-0027): `ActivePacksSnapshot`,
  copied at save creation and immutable thereafter (ADR-0051).
- No shared tables / no cross-context joins (ADR-0121): cross-context inputs
  arrive only through public events / queries. Activation events fire via the
  ADR-0028 transactional outbox.

## Consumers / Producers

- **Consumers of its outputs:** Regulations & Compliance, Rivalry System,
  Tactics (future), Squad & Player (future), Club Management (future),
  Notification, Manager & Legacy — they subscribe to pack-activation events at
  save creation; `PackActivated` / `PackRevoked` / `IPGateEvaluated` also go to
  Notification + Manager & Legacy. SavePayload (ADR-0098) consumes
  `ActivePacksSnapshot` refs. Pack-discovery UI consumer is TBD.
- **Facts it consumes (delegation responses):** `RuleOverrideValidated` /
  `RuleOverrideRejected` (Regulations, ADR-0056); `RivalryOverrideValidated` /
  `RivalryOverrideRejected` (Rivalry, ADR-0057); `TacticPresetOverrideValidated`
  (Tactics, future ADR-0055); `EconomyProfileOverrideValidated` (Club
  Management, future ADR-0050); `NameCorpusOverrideValidated` (Squad & Player /
  future Identity Corpus); `SaveCreationRequested` (League Orchestration /
  new-save workflow) triggers `ActivePacksSnapshot` materialisation. ADR-0007 +
  GD-0015 denylist/IP-clean catalogs are consumed as policy inputs.

## Invariants

- IP-safety is a domain invariant: activation is guarded by
  `IPGateEvaluated == accepted`; an ADR-0007 living-person / GD-0015 IP-clean
  denylist match is a hard fail; manifest `ip_disclaimer: required` must be
  acknowledged.
- Pack activation is **save-creation only** (ADR-0051); a running save never
  re-reads the mutable pack registry.
- Per-save `ActivePacksSnapshot` is immutable after creation; `RevokePack` only
  blocks future activations and does not affect already-activated saves.
- This context owns orchestration + the activate/reject decision; each downstream
  BC owns its own semantic validation (Vernon Process Manager / Saga; ADR-0056 +
  ADR-0057 already in place). It does not embed downstream semantic rules.
- No cross-context table joins; all cross-context exchange via public events /
  queries (ADR-0121, ADR-0028).
- Override application is default-off per GD-0015 (BCM row).

## Open items

- ADR-0059 is `status: accepted` but `binding: false`, with open decision
  questions D1 (owner = Option D, recommended) and D2 (MVP distribution =
  local-file/P2P only, recommended) still awaiting Nico; the contract lists
  above are explicitly labelled **draft**. Pin once ratified.
- FMX-188 UGC text-trust surface (`CommunityTextRef`, `CommunityTextRefs`,
  trust-class enum, prompt-injection screening) is amendment-conditional — the
  ADR marks it "if Nico accepts"; treat as proposed until ratified.
- The in-game pack-discovery UI consumer of `AvailablePacks` is named TBD in the
  ADR.
- The BCM row mentions `ManifestSchema` validation against the **ADR-0097**
  Zod/CHECK bounds; ADR-0059 does not enumerate the concrete schema-bound
  contract — exact validation-bound contract is unspecified.
