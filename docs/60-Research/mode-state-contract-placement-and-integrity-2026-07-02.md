---
title: "Mode-state contract placement and integrity (world preference, run snapshot, consent facts, mode log)"
status: draft
tags: [research, dual-mode]
created: 2026-07-02
updated: 2026-07-02
type: research
binding: false
linear: FMX-212
sourceType: external
context: [identity-access, league-orchestration, offline-sync, audit-security, staff-operations, notification]
related:
  - [[raw-perplexity/raw-mode-state-contract-placement-and-integrity-2026-07-02]]
  - [[mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[dual-mode-vault-delta-reconciliation-2026-07-02]]
  - [[management-delegation-and-easy-mode-surfaces-2026-07-02]]
  - [[tier-parity-measurement-calibration-2026-07-01]]
  - [[assisted-play-parity-auto-coach-2026-07-01]]
  - [[../50-Game-Design/progressive-disclosure-ui]]
  - [[../50-Game-Design/GD-0004-tactics]]
  - [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]]
  - [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]]
  - [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]]
  - [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]]
  - [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]]
  - [[../10-Architecture/09-Decisions/ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]]
  - [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]]
---

# Mode-state contract placement and integrity

## Question

The ratified dual-mode decisions (D1 two worlds / three tiers, D2 switch
anytime, D3 bounded pro edge, D4 full sweep) plus the Wave-2 labeling and
delegation recommendations create four new **fact families** that no existing
contract owns: (1) the player's world/tier **preference**, (2) a **per-run /
per-competition snapshot** of the world actually used (badge, per-match mode
log, season mode profile, BG3-style re-badge), (3) **per-area
consent/delegation assignments** (manual / propose / delegate) plus their
act-and-report feed, and (4) **MP group mode composition**. Where does each
fact live contractually — identity-access, league-orchestration, offline-sync,
audit-security, staff-operations, notification — and how does the mode log
stay tamper-evident in an offline-capable PWA under ADR-0090's sync model, so
that Stage-2 can draft ADR-0135+ confidently? The sibling packets
([[mode-choice-switching-and-competitive-labeling-2026-07-02]] finding 11,
[[asymmetric-interface-fairness-multiplayer-2026-07-02]] labeling Option A,
[[management-delegation-and-easy-mode-surfaces-2026-07-02]]
NEW-delegation-consent-model,
[[dual-mode-vault-delta-reconciliation-2026-07-02]] ADR-0055 row) all flag
this as open; none researches it.

## Summary

The vault already contains almost all of the machinery these facts need — the
gap is assignment, not invention. Preference and competitive record must be
**separate facts with separate owners**, a split that is documented industry
practice (Lichess/Chess.com one profile + per-format ratings, Valorant account
level vs per-mode rank, Google Play Games profile vs progress) and that
ADR-0090 already anticipates by carving cosmetic LWW preferences away from
server-authoritative game state. The per-run world snapshot and mode log
belong on the rated units League Orchestration already owns (run lifecycle,
`LeagueCompetitionSeason`, competition entries per ADR-0066), following the
genre pattern of snapshot-on-the-rated-unit (Forza per-entry assist flags and
dirty-lap invalidation, BG3's per-save one-way honour downgrade). The
integrity question resolves cleanly against existing binding decisions: BG3's
trivially file-editable honour flag shows a *stored* client-side mode flag is
worthless as competitive evidence, and the abandoned Web Environment Integrity
proposal confirms a PWA can never attest its runtime — but FMX does not need
either, because ADR-0115's signed command envelope plus ADR-0116's trust
levels mean the mode log can be a **deterministic server-side projection over
the already-signed command history** (server-attested-on-sync), with offline
runs simply `pending-verification` until sync exactly as ADR-0116 D9 already
rules. Consent/delegation assignments are save-scoped game state (FM
precedent: responsibilities live in the save), best owned as Staff Operations
facts that domain contexts execute — the seam GD-0028/ADR-0126 already sketch
with `staff.delegate_topic` — with the act-and-report feed landing in the
binding ADR-0102 notification platform. The GD-0035/GD-0036 per-group-config
seam extends to MP mode composition without new contracts. All placements
below are evidence-based inputs; nothing here is decided.

## Findings

1. **Finding:** Current vault state genuinely has no owner for any mode fact:
   [[../50-Game-Design/progressive-disclosure-ui]] §7 keeps the tier out of
   the save ("Save game does not embed the tier — it's a UI choice"; §2 makes
   it "global (per user profile)" with a per-match override), and ADR-0123's
   `PrincipalContext` is explicitly "not a domain-membership object" with no
   preference or competitive-history surface — Identity & Access refuses
   domain semantics by accepted decision. So the D2 + labeling requirements
   (per-run badge, per-match mode log, season mode profile) currently have no
   contractual home; this is a gap to fill additively, not a contradiction to
   repair.
   **Source:** internal —
   [[../50-Game-Design/progressive-disclosure-ui]] §2/§7/§9,
   [[../10-Architecture/09-Decisions/ADR-0123-identity-access-context-definition]] §1/§3.
   **Confidence:** high

2. **Finding:** Separating an account-level **preference** from per-unit
   **competitive records** is documented, mainstream practice: Lichess keeps
   "one [Glicko-2 rating] per game variant" under a single profile
   (lichess.org/faq); Chess.com keeps per-format ratings under one account;
   Valorant stores account progression (Account Level/AP) separately from
   per-mode competitive rank (playvalorant.com account-leveling article;
   Riot competitive-mode FAQ); Google Play Games separates the Play Games
   profile (name/avatar/preferences) from per-game progress linked to the
   account (support.google.com/googleplay/answer/14641155). No surveyed title
   derives competitive classification from the live preference.
   **Source:** raw Q4 —
   [[raw-perplexity/raw-mode-state-contract-placement-and-integrity-2026-07-02]].
   **Confidence:** high

3. **Finding:** The genre records the mode fact **on the rated unit itself**:
   Forza leaderboards store per-entry assist metadata (visible per time;
   hardcore boards are a *filter* over the recorded assists of the single
   best lap — "if that time doesn't qualify as Hardcore, you won't see it on
   that board") and a per-lap invalidation flag ("invalidated times are
   ranked lower than 'clean' ones, even if they are faster"), including
   invalidation for *changing assists mid-lap* — the exact per-unit
   accept-and-flag semantics the labeling recommendations need. BG3's Honour
   Mode is per-save state with a one-way visible downgrade ("continue your
   adventure, which will then disable Honour Mode").
   **Source:** forums.forza.net threads 96209, 22995, 85660 (raw Q2); Larian
   Community Update #25 (raw Q3). Forum-sourced for Forza: pattern high,
   exact current rules medium.
   **Confidence:** high (pattern)

4. **Finding:** A client-held mode flag is **forgeable by construction**:
   BG3's honour flag lives in the save file and the community routinely
   restores failed honour runs by editing/backing up files (bg3.wiki
   "Circumventing Honour Mode Save File Restrictions"; a Steam guide exists
   solely to flip a failed run back to Honour). Forza's friction-assist
   glitch let assisted laps post as "clean" until patched — flag *integrity*,
   not flag existence, is the hard part. Any FMX design that stores the
   competitive mode badge as a client-asserted field inherits this failure.
   **Source:** raw Q2/Q3 —
   [[raw-perplexity/raw-mode-state-contract-placement-and-integrity-2026-07-02]].
   **Confidence:** high

5. **Finding:** The documented integrity patterns for offline-capable
   competitive metadata are exactly three: **server-attested-on-sync** (the
   client value is a claim; the server re-derives from signed/authoritative
   logs — the strongest documented pattern, cf. AEPD videogame guidance
   distinguishing client logs from authoritative telemetry),
   **client-signed hash-chained append-only logs** (RFC 9162 / Certificate
   Transparency being the canonical construction), and **accept-and-flag
   trust tiers** (speedrun.com verification; separate verified/unverified
   boards). Client signatures are explicitly graded "tamper-evident
   evidence, not absolute proof" absent hardware attestation.
   **Source:** raw Q1 (Perplexity synthesis; AEPD
   aepd.es/en/guides/videogames-recommendations-industry.pdf; RFC 9162).
   Engine citations were partly generic; carried at reduced confidence.
   **Confidence:** medium (doctrine convergent, per-title wire-level detail
   undocumented)

6. **Finding:** A PWA **cannot attest its runtime**: Google's Web Environment
   Integrity proposal — the only serious attempt at web-client attestation —
   was abandoned in November 2023 ("no longer being considered by the Chrome
   team"), with the successor scoped to Android WebViews only; Play
   Integrity/App Attest remain native-only. This removes option families that
   assume trustworthy client-side mode assertions and independently confirms
   ADR-0115's own posture wording ("signatures are mandatory evidence, not
   authority").
   **Source:** github.com/explainers-by-googlers/Web-Environment-Integrity;
   theregister.com 2023-11-02; arstechnica.com 2023-11-06; Wikipedia "Web
   Environment Integrity" (raw Q5).
   **Confidence:** high

7. **Finding:** FMX already owns the full server-attestation stack the mode
   log needs: every mutating command carries an app-managed **Ed25519
   signature, canonical payload hash, `commandId` and binding**
   (ADR-0115); Audit & Security keeps a separate security audit log with
   **per-record hash-chaining + signed checkpoints (Merkle batching)**
   (ADR-0091) and owns replay/dedup through Command Reception (ADR-0119 per
   ADR-0090 banner); ADR-0116 defines `SaveTrustLevel` /
   `PublicEligibility`, a `ServerProvenanceProofV1` covering "command root
   or hash-chain head", the rule that **offline runs stay
   `pending-verification` until sync without losing eligibility** (D9),
   public-surface gating on `server-verified` (D6) and strict irreversible
   downgrade (D10). A mode log derived from this chain inherits all of it;
   no new cryptography is required.
   **Source:** internal —
   [[../10-Architecture/09-Decisions/ADR-0115-command-integrity-and-replay-protection-posture]],
   [[../10-Architecture/09-Decisions/ADR-0091-audit-security-context-definition]],
   [[../10-Architecture/09-Decisions/ADR-0116-save-trust-levels-and-provenance-posture]].
   **Confidence:** high

8. **Finding:** ADR-0090 already partitions client state into exactly the
   classes the four fact families need: **last-write-wins is allowed only
   for cosmetic local preferences (theme, notification toggles)**; all game
   state is server-authoritative re-validation + rebase with
   `commandId` + `expectedVersion` (ADR-0008 Dexie draft lifecycle). External
   practice matches: Steam Cloud file sync with conflict dialogs protecting
   saves, portable settings profiles per the Game Accessibility Guidelines,
   Play Games profile-vs-progress. Mapping: world/tier *preference* →
   cosmetic-LWW class; consent/delegation *assignments* → game-state command
   class (they change who may mutate state — never LWW); per-run *snapshot /
   mode log* → server-derived projection, not client-writable at all.
   **Source:** internal ADR-0090 §Decision, ADR-0008 §client-state; raw Q4
   (Steamworks Cloud docs, gameaccessibilityguidelines.com, Google
   support).
   **Confidence:** high

9. **Finding:** League Orchestration already owns every rated unit the
   snapshot needs to sit on: the map row gives it "Season, week, match-day,
   mode, pause, quorum" plus the ADR-0066 Competition & Season registry
   (`Competition`, `Season`, `LeagueCompetitionSeason`, participants,
   official standings via `CompetitionStandingsFinalizedV1`), and run
   lifecycle events (`RogueliteRunStarted` / `RogueliteRunEnded`) are
   consumed from League Orchestration per ADR-0055. ADR-0116's
   `ServerProvenanceProofV1` already binds "save/run ID" — the run record is
   an established trust anchor. Snapshot-at-entry plus re-badge-on-switch
   therefore lands in league-orchestration without any boundary move.
   **Source:** internal — [[../10-Architecture/bounded-context-map|bounded-context-map]]
   League Orchestration row,
   [[../10-Architecture/09-Decisions/ADR-0066-competition-registry-sub-aggregate]],
   [[../10-Architecture/09-Decisions/ADR-0055-tactics-context]] consumed
   facts, ADR-0116 D5.
   **Confidence:** high

10. **Finding:** The delegation-assignment seam the
    [[management-delegation-and-easy-mode-surfaces-2026-07-02|delegation packet]]
    proposes is already sketched in accepted/near-accepted contracts:
    GD-0028's `staff.delegate_topic` intent routes to "Staff
    Operations/Notification: delegation preference fact", and ADR-0126's
    intent table makes Staff Operations the owning context with effect
    `staff_topic_delegated` ("staff/history visible"). ADR-0053's boundary
    (Staff Operations owns role slots/assignments and publishes facts;
    concrete gameplay effects remain in consuming contexts; per-save
    `save_<uuidv7hex>` tables only) fits "Staff Operations owns assignment
    facts, domain contexts execute" exactly. FM's save-scoped
    responsibilities (behavioral evidence, no official schema doc) support
    save-scoping the assignments rather than account-scoping them.
    **Source:** internal —
    [[../50-Game-Design/GD-0028-dialogue-intent-taxonomy-effect-matrix]] §intent table,
    [[../10-Architecture/09-Decisions/ADR-0126-cross-producer-effect-intent-taxonomy]],
    [[../10-Architecture/09-Decisions/ADR-0053-staff-operations-context]];
    raw Q4 (FM, flagged behavioral).
    **Confidence:** high (internal seam), medium (FM leg)

11. **Finding:** The act-and-report feed has a binding home: ADR-0102
    (accepted/binding 2026-06-19) re-ratified the notification platform with
    an explicit offline-delivery clause, and GD-0028 already routes the
    delegation preference fact through "Staff Operations/Notification".
    Delegated-action reports are ordinary notification-category events from
    the executing domain contexts; no new context or channel is required.
    **Source:** internal —
    [[../10-Architecture/09-Decisions/ADR-0102-notification-platform-re-ratification-offline-delivery-clause]],
    GD-0028.
    **Confidence:** high

12. **Finding:** The MP group-mode-config extension seam is confirmed:
    GD-0035 defines "group-configurable knobs (lobby settings, within
    platform ceilings)" with a per-knob scope table and a
    `pausePrivilegePolicyVersion` versioning pattern; GD-0036 hangs
    transfer-escalation knobs on the same group config. "League mode
    composition" (open / Easy-only / Pro-only) is one more knob of the same
    shape — a **membership rule, not an account lock** (preserving D2), with
    breaches evidenced by the mode log exactly as the
    [[asymmetric-interface-fairness-multiplayer-2026-07-02|fairness packet]]'s
    NEW-mp-group-mode-config Option A assumes.
    **Source:** internal —
    [[../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
    knobs table,
    [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]].
    **Confidence:** high

13. **Finding:** The mode fact is largely **derivable rather than
    declarable**: under the ratified easy-tactics decision the Easy surface
    compiles `CoarseTacticInput` deterministically into the same tactic
    contract Pro writes, so "which surface authored this tactic" is a
    provenance fact of the compile step (the
    [[dual-mode-vault-delta-reconciliation-2026-07-02|vault-delta note]]
    already flags dial-compiled vs hand-authored preset provenance), and
    "which consent levels were active" is a fact of the delegation
    assignments. A mode log projected from commands/events that exist anyway
    is (a) cheaper, (b) un-forgeable short of forging the signed command
    history itself — avoiding the BG3 stored-flag failure (finding 4) by
    construction.
    **Source:** internal synthesis over the 2026-07-02 easy-tactics
    decision, ADR-0055 `TacticLockSnapshotProduced`, ADR-0115; inference,
    not an external citation.
    **Confidence:** medium

## Inputs For Decisions

Everything below is **input with a marked recommendation — recommendation,
not a decision**. Fact families A–D each get placement options with concrete
contract deltas; the integrity fork closes the packet.

### NEW-mode-fact-placement — fact family A: world/tier preference

The vault-delta note flags "whether `world` becomes a persisted profile field
beside tier" as open (ADR-0055 row). Options:

- **Option A1 — presentation-only, device-local (status quo).** Preference
  stays a client setting in the ADR-0090 cosmetic-LWW class; never leaves
  the device. *Deltas:* none. *Pros:* zero contract change; §7 stays true.
  *Cons:* no cross-device roaming (a player's world resets on a new device —
  poor for a headline D1 feature); onboarding answer not recoverable.
- **Option A2 — persisted account preference in identity-access.** A narrow
  `AccountPreference` surface (new command `SetAccountPreference`, event
  `AccountPreferenceChanged`, query `GetAccountPreferences`) carrying
  `preferredWorld`, `preferredTier`, per-area override defaults. **Not** a
  `PrincipalContext` field — ADR-0123 accepted that claims snapshots carry
  only authorization inputs, and world preference is not one. *Pros:*
  roaming; one queryable default for onboarding/new-save flows. *Cons:*
  Identity & Access absorbs its first non-auth fact — a scope stretch
  against ADR-0123 D1's "keep it narrow" rationale (mitigable: preferences
  are account-scoped platform facts, not domain memberships, so the ADR's
  refusal list is not technically violated).
- **Option A3 — both-axis split (preference roams, record rules).**
  Preference per A2 (or A1 at MVP), and **no competitive or MP contract ever
  reads it** — every comparative surface reads only family-B snapshots.
  This is the chess/Valorant/Play-Games pattern (finding 2) and the
  fairness packets' assumption.

*Recommendation (recommendation, not a decision):* **A3, with A1 as the MVP
default** and A2 as the additive follow-up once hosted profiles matter
(hosted leaderboards / MP). Whatever is chosen, write the invariant into the
covering ADR: *preference is never evidence; only per-unit snapshots are.*

### Competitive labeling (OPEN fork) — fact family B: per-run world snapshot + mode log

The labeling recommendations (world badge, per-match mode log, season mode
profile, BG3-style re-badge) need a per-rated-unit record. Placement options:

- **Option B1 — League Orchestration owns snapshot + profile on its rated
  units (recommended).** *Deltas (draft precision, names illustrative):*
  - Fields: `RunRecord.worldAtEntry` (+ `tierAtEntry`, since D1 keeps the
    3-tier enum internal and world is a derived branding layer),
    `RunRecord.modeProfile` (aggregate: matchdays per tier, consent levels
    active per area, `mixed` flag), `CompetitionEntry.worldAtEntry`,
    `CompetitionEntry.rebadgedTo` (nullable, one-way).
  - Events: `RunWorldRecordedV1` (at run/entry creation),
    `MatchModeRecordedV1` (per match-day, emitted from the settled
    projection, not from the client), `EntryModeRebadgedV1` (BG3-pattern
    one-way re-badge on mid-unit switch), `SeasonModeProfileFinalizedV1`
    (alongside `CompetitionStandingsFinalizedV1`).
  - Read models: `SeasonModeProfile` ("played 28 of 34 matchdays in Easy"),
    `RunModeBadge` (badge + trust level for leaderboard surfaces),
    `EntryModeHistory` (per-match log for match cards/reports).
  *Pros:* rated units, standings finalization and run lifecycle already live
  here (finding 9); snapshot-at-entry mirrors Forza/BG3 (finding 3); the
  fairness packet's per-match log lands on the same records GD-0035's audit
  facts already decorate. *Cons:* League Orchestration grows a projection
  that consumes facts from Tactics/Match/Staff Operations — but through
  published language only, consistent with its existing consumption pattern.
- **Option B2 — Match owns the per-match mode fact inside the lock
  snapshot.** Extend `TacticSnapshot` with an `authoringProvenance` slice
  (dial-compiled vs hand-authored, tier of the authoring surface) frozen at
  `lineup_locked` via the existing `TacticLockSnapshotProduced` event.
  *Pros:* per-match truth is frozen exactly where per-match tactic truth is
  already frozen; replays carry it. *Cons:* covers only the tactic axis of
  "mode" — consent levels for training/transfers/finance are not Match
  facts; a season profile still needs an aggregator.
- **Option B3 — Audit & Security owns the mode log as security evidence.**
  *Pros:* tamper-evidence is native there. *Cons:* violates ADR-0091's
  mandate ("observe, record, verify, flag — never own canonical game
  state"); the mode log is a *product* surface (badges, match reports), not
  investigation evidence; audit should verify it, not own it.

*Recommendation (recommendation, not a decision):* **B1 + B2 together, B3
rejected**: Match freezes the per-match authoring-provenance slice (B2, the
per-match atom), League Orchestration projects atoms + consent facts into
per-unit snapshots and season profiles (B1), Audit & Security supplies
integrity, not ownership. The mode log is thus a **derived projection**
(finding 13), never a client-writable field.

### Delegation model shape (OPEN fork) — fact family C: per-area consent assignments + act-and-report feed

- **Option C1 — Staff Operations owns assignment facts; domains execute;
  Notification carries the feed (recommended).** *Deltas:*
  - Aggregate/fields (per save, `save_<uuidv7hex>` per ADR-0053):
    `AreaResponsibilityAssignment { area, consentLevel: manual | propose |
    delegate, responsibleStaffRoleSlot, policyVersion }`.
  - Commands: `SetAreaConsentLevel`, `AssignAreaResponsibility` (both
    ordinary signed game-state commands — `commandId` + `expectedVersion`,
    **not** cosmetic-LWW prefs; they change who mutates game state, finding
    8).
  - Events: `AreaConsentLevelChangedV1`, `AreaResponsibilityAssignedV1`
    (consumed by the owning domain context to arm/disarm its delegated
    policy, and by League Orchestration's mode profile, family B).
  - Read models: `ConsentLevelForArea` (read by every domain policy before
    acting), `DelegationOverview` (the switch-preview / settings surface).
  - Feed: executing domain contexts emit their normal domain events; a
    notification category ("Delegated actions") in the binding ADR-0102
    platform renders act-and-report digests with GD-0028-style explanations.
  *Pros:* matches the GD-0028/ADR-0126 `staff.delegate_topic` seam and
  ADR-0053's boundary verbatim (finding 10); one grammar for the consent
  ladder incl. the ADR-0084 NT levels; save-scoped like FM responsibilities.
  *Cons:* Staff Operations becomes a hub every domain polls — mitigated by
  event-carried state (domains cache `ConsentLevelForArea`).
- **Option C2 — each domain context owns its own consent setting.**
  *Pros:* maximal locality; no hub. *Cons:* six divergent grammars; no
  single read model for tier presets, the switch preview or the family-B
  mode profile; the NT dual-role ladder stays a snowflake.
- **Option C3 — new "Assistance/Delegation" bounded context.** *Pros:*
  clean textbook home for policy + assignments. *Cons:* the map is large and
  the merge-review gate exists for a reason; ADR-0053 + GD-0028 show the
  facts already have a natural owner; the *policies* must live in the
  owning domains anyway (they issue domain commands), so the new context
  would own only a table.

*Recommendation (recommendation, not a decision):* **C1.** Explicitly encode
the two delegation-packet invariants in the covering ADR: delegated policies
never overwrite manual pins, and every delegated action lands in the feed
with an explanation.

### MP treatment (OPEN fork) — fact family D: group mode composition

- **Option D1 — extend GD-0035/GD-0036 group config (recommended).** Add
  `modeComposition: open | easy-only | pro-only` (+
  `modeCompositionPolicyVersion`) to the existing per-group lobby-settings
  knob table, scoped "per-group + platform ceiling" like pause budgets. A
  breach (member's family-B snapshot contradicts the rule) is a visible
  group-rule breach handled socially/by group tooling — never an account
  lock (D2 intact). *Deltas:* one knob + one read model
  (`GroupModeComplianceView` joining group config with member
  `SeasonModeProfile`s); no new events beyond the existing group-config
  change pattern. *Pros:* seam confirmed (finding 12); implements the
  fairness packet's recommendation with zero new architecture. *Cons:*
  needs the family-B mode log first — ordering constraint for Stage-2.
- **Option D2 — platform-level mode-filtered matchmaking.** Rejected-class
  per the fairness packet (splits MVP-scale population; frames Easy as a
  protected class); kept only as future-scope re-open if a large ranked
  ladder ever ships.

*Recommendation (recommendation, not a decision):* **D1**, post-MVP,
sequenced after family B.

### NEW-mode-log-integrity (newly discovered fork) — offline tamper-evidence

The mode badge/log is the entire competitive-labeling mechanism; FMX is an
offline-capable PWA. An untrustworthy mode log collapses the recommended
transparency-without-locks MP architecture.

- **Option E1 — server-attested-on-sync (mode log as server projection).**
  The mode log is deterministically re-derived server-side from the ADR-0115
  signed command history during ADR-0090's normal re-validation/rebase on
  sync. Client-side, the identical projection runs locally for immediate UI,
  but is labeled with ADR-0116 vocabulary (`local-only` /
  `pending-verification`) until the server proof exists; public/comparative
  surfaces accept only `server-verified` per ADR-0116 D6. *Pros:* the
  strongest documented pattern (finding 5); reuses ADR-0115/0116/0091
  machinery wholesale — zero new crypto; forging the mode log requires
  forging the signed, hash-chained, dedup-checked command history, which
  ADR-0116 D10 already answers with irreversible downgrade; offline runs
  lose nothing (D9). *Cons:* the trustworthy badge is only available after
  sync — acceptable, since purely-local surfaces are exactly the
  casual-only tier ADR-0116 already defines.
- **Option E2 — separate client-signed hash-chained mode-event log**
  (RFC 9162-style chain of `ModeChanged` events under the device Ed25519
  key). *Pros:* self-contained tamper-evidence for exported saves shared
  P2P before any sync. *Cons:* **redundant** — the commands that imply mode
  are already individually signed and chain-anchored, so a second chain
  adds attack surface and key-management cost for no additional trust; and
  with no web attestation (finding 6) a hostile client can sign a fabricated
  chain anyway, so E2 is still only evidence, same as E1's local label.
- **Option E3 — accept-and-flag only (no re-derivation).** Trust the
  client's asserted mode facts, attach trust tiers, moderate disputes
  (speedrun.com pattern). *Pros:* cheapest. *Cons:* BG3/Forza evidence
  (finding 4) shows asserted flags get farmed the moment they carry
  prestige; FMX already paid for the stronger machinery, so settling for E3
  wastes ADR-0115/0116.

*Recommendation (recommendation, not a decision):* **E1**, with E3's
labeling vocabulary as its presentation layer (they compose: E1 *is*
accept-and-flag where the flag is computed, not asserted) and E2 rejected as
redundant. One hard sub-invariant for the covering ADR: **mode-bearing facts
must be command-derived** — any mode fact that cannot be re-derived from the
signed command/event history (e.g. a pure UI toggle that never issues a
command) must either become a command (family C consent changes already are)
or stay out of competitive surfaces (family A preference).

### Stress evidence for ratified decisions (not re-opened)

- **D2 (switch anytime):** fully compatible with every placement above —
  switching writes a new snapshot/re-badge event (B1) instead of being
  blocked; BG3 shows the one-way re-badge preserves both freedom and
  integrity.
- **D3 (bounded pro edge):** the envelope's credibility in MP rests on the
  mode log being trustworthy (fairness packet R1/R3); E1 is the only option
  that makes the log evidence-grade on an offline PWA, so D3's labeling
  companion should be treated as *dependent on* E1-class integrity.
- **D1 (two worlds / three tiers):** all family-B fields should persist the
  internal **tier enum** (ADR-0055 `TacticTier` vocabulary) and derive the
  world label through the Stage-2 branding mapping table — otherwise a
  future re-branding rewrites competitive records.

## Future-scope notes (classified future-scope)

- **Hosted leaderboards / profiles:** family A Option A2 (account preference
  surface) and any cross-save "world identity" celebration UI only become
  necessary with hosted profiles; sequence behind the identity-access
  follow-ups in ADR-0123.
- **P2P save sharing before sync:** if exported saves with mode badges are
  ever shared P2P as a feature (watch-party adjacent), revisit E2 — a
  self-contained chain has value only in that no-server niche.
- **Commitment flag ("Pro-pure run"):** the mode-choice packet's Ironman-style
  future flag is a pure family-B derivation (a run whose mode log contains
  only Expert entries) plus ADR-0116 eligibility — no extra state needed;
  note this so it is not built as a separate stored flag.
- **Delegation telemetry:** the act-and-report feed doubles as the data
  source for re-tuning tier defaults (delegation packet future-scope); the
  notification category should be designed queryable, not fire-and-forget.
- **Could not verify (kept out of load-bearing claims):** Halo Infinite's
  per-match input-record schema; GT7's internal assist-storage model; FM's
  save-internal delegation storage (behavioral only); exact current Forza
  board rules; several Q1 engine citations were generic tamper-evidence
  pages and were discarded. None of the recommendations depends on these.
