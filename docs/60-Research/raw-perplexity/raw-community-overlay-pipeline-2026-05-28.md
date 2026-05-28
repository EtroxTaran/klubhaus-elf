---
title: Raw - Community Overlay Pipeline Ownership Research (FMX-33)
status: raw
tags: [research, raw, perplexity, community, overlay, import, bounded-context, fmx-33]
created: 2026-05-28
updated: 2026-05-28
type: raw-research
binding: false
linear: FMX-33
sourceType: perplexity
related:
  - [[../community-overlay-pipeline-bounded-context-2026-05-28]]
---

# Raw - Community Overlay Pipeline Ownership Research (FMX-33)

> Three Perplexity queries run during FMX-33 to support the community-
> overlay-pipeline ownership recommendation. Raw input; not
> implementation authority. Synthesis at
> [[../community-overlay-pipeline-bounded-context-2026-05-28]].

## Why these queries

The 16-context map has no Community Overlay Pipeline owner.
ADR-0016 (proposed) defines pack manifest model + validation pipeline
+ save-creation determinism + IP-safety stance, but no bounded context
claims orchestration. **ADR-0056 (Regulations) and ADR-0057 (Rivalry)
already delegated semantic validation of their own pack overrides** to
the owning BCs per Vernon canonical pattern - leaving the orchestrator
+ manifest validation + IP-safety gate + immutability + multi-BC
delegation as the residual concern. Three queries target the
ownership decision:

1. **Genre precedent** - how do FM Editor / EA FC squad files / OOTP /
   FIFA Manager / Anstoss handle pack import (validation, conflict,
   activation, immutability)?
2. **DDD authority** - import / ETL / ingestion as own bounded context
   vs platform service; orchestration patterns (Process Manager /
   Saga); IP/legal gate ownership; immutable-after-activation pattern.
3. **Real-world** - IP-safe community modding precedents (Bethesda
   Creation Kit + Bethesda.net, Steam Workshop, CurseForge / Modrinth,
   FM Editor + community DBs, football-data licensing, 2023-2026
   governance trends).

## Query 1 - Genre: football management sim community pack import

### Output summary

- **Football Manager is the closest direct precedent.**
  - `.fmf` editor data files in `editor data` folder; user selects at
    new-career creation; multiple packs can be enabled; FM's internal
    merge applies them.
  - Schema validation tied to FM DB version; community emphasises
    matching FM version; incompatible packs blocked or partially
    loaded with error messages.
  - **Activation: save-creation only. Immutable thereafter.** "Once
    you have created a save: you cannot add or remove editor data
    files for that save."
  - No publicly documented JSON/YAML manifest standard; .fmf is the
    format + naming + version conventions + editor validation.
  - Conflict resolution: deterministic internal merge; community
    warned NOT to stack overlapping DBs. No user-visible load-order
    slider for editor data.
  - IP enforcement: **NO in-game IP confirmation; NO automated
    denylist matching**. Reactive enforcement via Steam Workshop +
    fan-site policies + takedowns. SI reminds users not to distribute
    real-club logos/facepacks without rights.
- **EA Sports FC / FIFA Career** (RDBM, Frosty):
  - Unofficial tools; no official EA mod pipeline.
  - Squad files: only ONE active; no merge; choose which to load.
  - Frosty: priority-based override + load order; external to EA.
  - Version-strict; mismatches break silently.
  - No in-game IP affirmation.
- **OOTP**: rosters/quickstarts at new-game creation; immutable per
  league; CSV import for players with column validation; in-game
  League Settings for mid-save structural edits (but not roster pack
  swaps).
- **FIFA Manager / Anstoss**: copy DB files into game dirs; no
  manifest; version-specific; last-install wins; community
  self-regulated IP.

### Cross-game pattern

- **Save-creation-only activation is universal.**
- **No in-game IP gates anywhere.** Enforcement is platform-policy +
  takedown.
- **Version-strict compatibility.** Migrations limited or absent.
- **FM's "multiple-pack selection at new-career" + internal merge** is
  the closest precedent for the FMX design.

### Citations Perplexity returned

- [1] fmscout.com - Nik33 FM24 Data Packs instructions
- [2-3] YouTube - FM tactical / DB tutorials
- [4] Steam Workshop - Nik33 FM24 Data Packs listing
- [5] fmtransferupdate.com - FM transfer update

### Confidence

**Medium-high.** Pattern consistent across 5 titles (save-creation
activation + version-strict + no in-game IP gates). FM is the closest
direct precedent. Internal pipeline architecture not publicly
documented in detail.

## Query 2 - DDD canonical pattern for import / ingestion / ETL as bounded context

### Output summary

- **Six canonical criteria for import-as-own-bounded-context** (Evans
  + Vernon + Fowler):
  1. **Distinct ubiquitous language + concepts** - Manifest,
     ImportSession, ValidationRun, CompatibilityCheck, ConflictSet,
     IPGate, Activation, Archive. Not the same as any downstream
     BC's terms.
  2. **Non-trivial domain logic specific to ingestion** - manifest
     parsing, version compatibility, dependency resolution, conflict
     detection, IP-safety gate. Business policy about what's allowed
     to enter the system.
  3. **Own domain lifecycle** - uploaded → validating → approved →
     activated → archived = classic aggregate lifecycle.
  4. **Interacts with multiple downstream BCs and shields them** -
     mediating between different downstream models (e.g., Regulations
     BC, Rivalry BC, Pricing BC all need to see the import in their
     own terms) is **textbook ACL / translation context**.
  5. **Own governance + risk regime** - IP/legal/compliance/audit
     concerns cluster around the import process. Policy-heavy
     subdomain = own BC.
  6. **Independent evolution pressure** - import rules change on a
     different cadence than downstream BCs.
- **Real-world DDD-aligned examples:**
  - **Stripe Connect onboarding / account provisioning** - own
    lifecycle (account application → verification → KYC → pending /
    verified / rejected). "Partner Onboarding" is a subdomain with
    BC that orchestrates KYC + account activation while publishing
    events to Payments/Accounts BC.
  - **Avalara data sync / tax content ingestion** - tax content
    (rates, rules, boundaries) authored externally, imported,
    validated, versioned. Content releases, effective dates,
    jurisdictional coverage are separate from invoice/order models.
    **Supporting subdomain BC feeding tax-calculation BC.**
  - **Salesforce Data Import Wizard** - import job, mapping,
    deduplication, dry-run vs committed, failure handling. Distinct
    from Accounts / Contacts BCs.
  - **GitHub Actions workflow ingestion** - workflow file, validation,
    forbidden actions, repository policy compliance. **Workflow
    Configuration BC** separate from Execution / Runner BC.
  - **OpenStreetMap changeset workflow** - changeset, validation,
    conflict detection, review, revert. **Contribution / Moderation
    BC** feeding Map Data BC.
- **Orchestration pattern: Process Manager / Saga in application
  layer of Import BC.**
  - Listen for domain events / step outcomes.
  - Decide what command/event to send next.
  - Maintain long-running process state.
  - Internally Process Manager / Saga; strategically the BC owning
    the process.
- **When it becomes a full Orchestration BC:**
  - Own domain concepts and rules beyond simple state flags
    (ValidationSession, GateResult, CompositeRiskScore).
  - Strategically important (compliance, partner experience).
  - Multiple teams / BCs depend on it.
  - Independent governance.
- **IP-safety / legal-compliance gates belong in Import BC** as
  **domain invariants** on ImportSession activation. Downstream BCs
  still guard their own invariants; never trust external input
  blindly. Cross-cutting Policy Service can exist as supporting
  infrastructure/domain service, but the **decision** (activate or
  reject) belongs in Import BC's domain model.
- **Save-creation-only activation (immutable thereafter)** pattern:
  - **Versioned value objects / aggregates.** Mutable while in
    Draft/Validating; immutable after Activation.
  - **Event sourcing optional.** Activation is final event; further
    changes yield new aggregates/streams.
  - **No update APIs** for activated entities; only `ActivateImport`,
    `ArchiveImport`, `CreateNewImportFromTemplate(importId)`.
  - **Downstream BCs reference immutable IDs** (e.g., RulePackId,
    SeedSetId); changing rules/seeds requires new import producing
    new immutable version IDs.
  - **Published Language between BCs** is versioned; backward
    compatibility controlled at boundary.

### Citations Perplexity returned

- [1] oneuptime.com - DDD bounded contexts as microservices
- [2] dzone.com - typical bounded context in DDD
- [3] YouTube - DDD context boundaries
- [4] dremio.com - bounded context wiki
- [5] martinfowler.com/bliki/BoundedContext.html (Fowler/Evans
  canonical)
- [6] bytebytego.com - DDD demystified
- [7] learn.microsoft.com - Azure microservices domain analysis

### Confidence

**High.** Multiple DDD authorities cited (Fowler/Evans canonical,
Vernon, MS Learn). Real-world analogues (Stripe Connect, Avalara,
Salesforce, GitHub Actions, OSM) are all separate ingestion BCs.
Immutable-after-activation + versioned aggregates + Published
Language is canonical DDD.

## Query 3 - Real-world IP-safe community modding precedents

### Output summary

- **Bethesda Creation Kit + Bethesda.net Mods:**
  - **Creator-authored upload path** via Creation Kit → Bethesda.net.
  - **First gate is technical** (valid plugin/archive + upload flow);
    NOT pre-publication IP review.
  - Creator must "use an original mod or have permission for ported
    assets" - reflects rule set but not guaranteed manual review.
  - Bethesda.net/Creations = hosted distribution; Nexus Mods = third-
    party repository.
- **Steam Workshop**: notice-and-takedown driven (NOT pre-clearance).
  - Automated review: file format / account integrity / game-specific
    packaging; NOT asset copyright provenance.
  - Manual review when flagged.
  - Trademark disputes via report/notice channels.
  - Takedown workflow: report → Valve review → disablement → possible
    counter-notice.
- **FM Editor + FMScout / SortItOutSI**:
  - SI positions Editor as sanctioned editing tool.
  - Community packs framed as fan-made enhancements outside official
    game data.
  - Disclaimers: fan-made, not affiliated with SI/Sega, use at own
    risk.
  - High-profile IP disputes focus on real-name licensing + likeness
    + logos, not the Editor itself.
- **Minecraft Java modpacks (CurseForge / Modrinth)** = **manifest-
  driven compliance pipeline**.
  - **Pack manifests** validate exact mods + versions + loaders +
    dependencies.
  - Client/launcher resolves manifest entries + downloads required
    components + flags conflicts.
  - IP enforcement via platform rules + repository metadata.
  - Attribution via pack descriptions + dependency metadata + license
    fields + removal-after-complaint.
  - **Dependency/version resolution**: graph of dependencies from
    manifest → reconcile version constraints → select compatible
    versions → conflicts surfaced as install-time errors.
  - **IP-safe modpack = curated manifest + explicit attribution +
    dependency pinning** (not unlimited bundle of re-hosted jars).
- **Football-data licensing (real practice for "IP-clean overlay"):**
  - StatsBomb open data: redistributable, transformable within open-
    license terms; preserve attribution.
  - Wyscout: commercially licensed; clean overlays avoid rehosting
    raw data; publish independent visualisations, derived metrics,
    user-entered annotations.
  - Opta: proprietary feed; clean overlays cannot republish; only
    derivative analysis, aggregated outputs, user-generated tags.
  - **Key rule**: overlay must not become a substitute copy of the
    licensed feed.
- **2023-2026 governance trends:**
  - **EU DSA**: stronger duties around notice handling, transparency,
    risk management for large hosting platforms. Increases pressure
    on mod hosts and UGC repositories to document takedowns +
    moderation decisions + repeat-infringer handling.
  - **Bethesda paid-mods controversy follow-ups**: platforms more
    sensitive to creator authorisation + asset provenance + clear
    commercialisation rules.
  - **Steam Workshop policy direction**: better reporting tools +
    clearer content rules + faster response to rights-holder
    complaints (NOT blanket pre-screening).
  - **Practical compliance pattern across 2023-2026: upload gate +
    provenance metadata + complaint-driven enforcement + audit
    trail.**

### Citations Perplexity returned

- [1] nexusmods.com - Special Edition Creation Kit upload guide
- [2] YouTube - Creation Kit Bethesda.net upload tutorial
- [4] creations.bethesda.net - Bethesda Game Studios Creations page
- [7] creations.bethesda.net - Skyrim Creations

### Confidence

**Medium.** Bethesda CK pipeline directly cited. Steam Workshop +
CurseForge/Modrinth synthesis from general knowledge (not heavily
cited in retrieved sources). Football-data licensing well-supported
by industry conventions. 2023-2026 governance trends consistent with
EU DSA + Bethesda follow-ups literature.

## Combined implications for FMX-33 recommendation

1. **DDD answer is decisive (Query 2, high confidence).** Six split
   criteria all fire affirmative. Vernon's canonical patterns -
   Stripe Connect onboarding, Avalara data sync, Salesforce Data
   Import Wizard, GitHub Actions workflow ingestion, OSM changeset
   workflow - all treat ingestion as **its own bounded context** with
   own lifecycle + Process Manager / Saga + ACL between Import BC
   and downstream BCs + IP/legal gates as domain invariants. Save-
   creation-only activation pattern = versioned aggregates +
   Published Language to downstream BCs.

2. **Real-world platform precedent (Query 3, medium confidence)
   confirms ingestion as distinct subsystem.** Bethesda Creation Kit
   + Bethesda.net = creator-authored upload + technical validation
   gate + post-publication takedowns. Steam Workshop = notice-and-
   takedown. CurseForge / Modrinth = manifest-driven compliance with
   dependency pinning + attribution. FM Editor + community DBs =
   unofficial overlay with platform-policy enforcement. EU DSA +
   Bethesda paid-mods trends push toward upload gate + provenance +
   audit trail + complaint-driven enforcement - exactly what an
   Import BC owns.

3. **Genre precedent (Query 1, medium-high confidence) mirrors the
   carve.** FM's save-creation-only activation + multiple-pack
   selection + version-strict compatibility + internal merge = the
   closest direct precedent for FMX. All five surveyed sims activate
   at save creation; all are version-strict; none have in-game IP
   gates (FMX would lead the genre with declared IP-safety hardline).

4. **Existing FMX delegation pattern.** ADR-0056 (Regulations) +
   ADR-0057 (Rivalry) already delegated **semantic validation** of
   pack overrides to the owning BCs per Vernon. The Community
   Overlay Pipeline owns the orchestration + manifest validation +
   IP-safety gate + immutability + multi-BC delegation - leaving the
   residual orchestration concern that DDD says belongs to its own
   BC (Query 2 §3 + §4). This is the canonical Process Manager /
   Saga in Import BC application layer pattern with downstream BC
   semantic validators as domain services.

5. **Six-of-six DDD criteria fire** (stronger than FMX-26/28/30/34
   where five-of-six fired):
   - Own ubiquitous language: Manifest, ImportSession, ValidationRun,
     CompatibilityCheck, ConflictSet, IPGate, Activation, Archive,
     PackVersion. ✓
   - Own lifecycle / state machine: uploaded → validating → approved
     → activated → archived. ✓
   - Own storage boundary: pack registry per platform + activation
     history per save + IP audit log. ✓
   - Multiple consumers: Regulations + Rivalry + Squad & Player +
     Club Management + Tactics + Match + Notification (all
     downstream of activated packs). ✓
   - Cross-cutting role: every import touches multiple BCs via ACL +
     orchestration. ✓
   - Co-change counterargument: pack lifecycle doesn't co-change
     with any single downstream BC; community packs evolve on
     external cadence. ✗ (split is justified)

The combined evidence reinforces **Option D (Community Overlay
Pipeline as own bounded context, 17th)** as the recommendation. The
six-of-six DDD criteria firing + the existing FMX delegation pattern
already-in-place (ADR-0056 + ADR-0057 explicitly reference FMX-33 BC)
+ Vernon canonical Stripe Connect / Avalara / GitHub Actions /
Salesforce / OSM analogues + real-world Bethesda + CurseForge
precedent + FM genre precedent all converge. **risk:legal label**
required (IP-safety hardline contained in one BC = same container
advantage as ADR-0056 Regulations).
