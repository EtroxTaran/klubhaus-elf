---
title: ADR-0138 Mode-State Placement and Integrity (preference vs per-unit snapshots, command-derived mode log)
status: draft
tags: [adr, architecture, dual-mode, mode-state, integrity, league-orchestration, match, audit-security, fmx-212]
context: [match, league-orchestration, audit-security, identity-access, watch-party]
created: 2026-07-02
updated: 2026-07-02
type: adr
binding: false
linear: FMX-212
supersedes:
superseded_by:
related:
  - [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
  - [[ADR-0115-command-integrity-and-replay-protection-posture]]
  - [[ADR-0116-save-trust-levels-and-provenance-posture]]
  - [[ADR-0091-audit-security-context-definition]]
  - [[ADR-0090-offline-sync-scope-and-conflict-strategy]]
  - [[ADR-0066-competition-registry-sub-aggregate]]
  - [[ADR-0123-identity-access-context-definition]]
  - [[ADR-0102-notification-platform-re-ratification-offline-delivery-clause]]
  - [[ADR-0055-tactics-context]]
  - [[ADR-0053-staff-operations-context]]
  - [[ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
  - [[ADR-0136-delegation-to-staff-contract]]
  - [[ADR-0137-stadium-construction-and-expansion-contract]]
  - [[../../50-Game-Design/GD-0046-two-worlds-mode-model]]
  - [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
  - [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../../50-Game-Design/progressive-disclosure-ui]]
  - [[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02]]
  - [[../../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
  - [[../../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]
  - [[../../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
---

# ADR-0138: Mode-State Placement and Integrity (preference vs per-unit snapshots, command-derived mode log)

## Status

draft

Proposed for Nico's ratification. This ADR assigns contractual owners
to the mode/world **fact families** the ratified dual-mode decisions create,
and fixes how mode-bearing facts stay trustworthy in an offline-capable PWA.
The **competitive labeling** and **MP treatment** forks stay OPEN; every ★
below is the research packet's recommendation — **recommendation, not a
decision**. Authored under the never-self-accept rule; `binding: false` until
Nico ratifies.

## Date

2026-07-02 (FMX-212 Stage-2)

## Context

The ratified dual-mode directions (D1 three internal tiers branded as two
worlds, D2 switch anytime everywhere, D3 bounded pro edge via a floor+cap
envelope with exact numbers explicitly open, D4 full sweep — 2026-07-01/02)
plus the 2026-07-02 easy-tactics decision (coarse dials compile
deterministically into the same tactic contract Pro writes) create four new
fact families that no existing contract owns
([[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02|mode-state packet]],
Finding 1):

- **Family A — world/tier preference:** the player's current choice.
  Today it is a device-local UI setting explicitly kept out of the save
  ([[../../50-Game-Design/progressive-disclosure-ui|progressive-disclosure-ui]] §7),
  and [[ADR-0123-identity-access-context-definition|ADR-0123]]'s
  `PrincipalContext` refuses domain semantics by accepted decision.
- **Family B — per-unit world snapshot + mode log:** which world/tier was
  actually used per rated unit (run, season, competition entry, match), the
  substrate every labeling option needs
  ([[../../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02|labeling packet]],
  Finding 11).
- **Family C — per-area consent/delegation assignments** plus the
  act-and-report feed (covered by
  [[ADR-0136-delegation-to-staff-contract|ADR-0136]]; this ADR only fixes
  placement consistency).
- **Family D — MP group mode composition** (post-MVP; GD-0035/GD-0036
  group-config seam).

Two hard constraints shape the integrity half:

- **A client-held mode flag is forgeable by construction.** BG3's honour
  flag is routinely restored by save-file editing; Forza's assist-flag
  glitch let assisted laps post as clean; and the abandoned Web Environment
  Integrity proposal confirms a PWA can never attest its runtime
  (mode-state packet Findings 4, 6). Any design that stores the competitive
  mode badge as a client-asserted field inherits this failure.
- **FMX already owns the needed attestation stack.** Every mutating command
  carries an Ed25519 signature, payload hash and `commandId`
  ([[ADR-0115-command-integrity-and-replay-protection-posture|ADR-0115]]);
  [[ADR-0116-save-trust-levels-and-provenance-posture|ADR-0116]] defines
  `SaveTrustLevel`/`PublicEligibility`, offline runs staying
  `pending-verification` until sync (D9) and public-surface gating on
  `server-verified` (D6);
  [[ADR-0091-audit-security-context-definition|ADR-0091]] hash-chains the
  audit log; [[ADR-0090-offline-sync-scope-and-conflict-strategy|ADR-0090]]
  already partitions client state into cosmetic-LWW preferences vs
  server-authoritative game state (mode-state packet Findings 7, 8).

The research corpus is the
[[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02|mode-state packet]]
(placement + integrity options, external precedent: Lichess/Chess.com/
Valorant/Play Games preference-vs-record split, Forza/BG3
snapshot-on-the-rated-unit), the
[[../../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02|labeling packet]]
(badge/re-badge UX evidence) and the
[[../../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02|fairness packet]]
(MP treatment options and risk register). Claims below cite those notes;
this ADR adds no new external research.

## Options Considered

### O1 — Family A placement: world/tier preference (mode-state packet, NEW-mode-fact-placement)

- **Option A1 — presentation-only, device-local (status quo).** Preference
  stays in ADR-0090's cosmetic-LWW class; zero contract change; no
  cross-device roaming.
- **Option A2 — persisted account preference in identity-access.** A narrow
  `AccountPreference` surface (`SetAccountPreference` /
  `AccountPreferenceChanged` / `GetAccountPreferences`) carrying
  `preferredWorld`, `preferredTier`, per-area override defaults —
  explicitly **not** a `PrincipalContext` field (ADR-0123 keeps claims
  snapshots authorization-only). Enables roaming; stretches Identity &
  Access with its first non-auth fact.
- **Option A3 — both-axis split (preference roams, record rules). ★
  recommended.** Preference per A2 (or A1 at MVP) **and no competitive or
  MP contract ever reads it** — every comparative surface reads only
  family-B snapshots. This is the documented Lichess/Chess.com/Valorant/
  Play-Games pattern (mode-state packet Finding 2).

★ = **A3, with A1 as the MVP default and A2 additive once hosted profiles
matter** (hosted leaderboards / MP). Whichever variant Nico picks, the
family-A invariant below applies verbatim.

### O2 — Family B ownership: per-unit snapshot + mode log (mode-state packet, family B)

- **Option B1 — League Orchestration owns snapshot + season profile on its
  rated units.** Fields on `RunRecord` / `CompetitionEntry`
  (`worldAtEntry` + `tierAtEntry`, `modeProfile`, `rebadgedTo`), events
  `RunWorldRecordedV1`, `MatchModeRecordedV1`, `EntryModeRebadgedV1`,
  `SeasonModeProfileFinalizedV1`, read models `SeasonModeProfile`,
  `RunModeBadge`, `EntryModeHistory`. League Orchestration already owns
  every rated unit and standings finalization (mode-state packet Finding 9);
  snapshot-at-entry mirrors Forza/BG3 (Finding 3).
- **Option B2 — Match freezes the per-match mode atom.** Extend the tactic
  lock snapshot with an `authoringProvenance` slice (dial-compiled vs
  hand-authored, tier of the authoring surface) frozen at `lineup_locked`
  via the existing `TacticLockSnapshotProduced` event
  ([[ADR-0055-tactics-context|ADR-0055]]). Covers only the tactic axis;
  needs an aggregator for a season profile.
- **Option B3 — Audit & Security owns the mode log as security evidence.
  Rejected.** Violates [[ADR-0091-audit-security-context-definition|ADR-0091]]'s
  mandate ("observe, record, verify, flag — never own canonical game
  state"); the mode log is a product surface (badges, match reports), not
  investigation evidence.

★ = **B1 + B2 together, B3 rejected**: Match freezes the per-match atom;
League Orchestration projects atoms + consent facts (family C) into per-unit
snapshots and season profiles; Audit & Security supplies **integrity, not
ownership**. The mode log is thus a derived projection, never a
client-writable field (mode-state packet Finding 13).

### O3 — Mode-log integrity (mode-state packet, NEW-mode-log-integrity)

- **Option E1 — server-attested-on-sync (mode log as server projection). ★
  recommended.** The mode log is deterministically re-derived server-side
  from the ADR-0115 signed command history during ADR-0090's normal
  re-validation/rebase on sync. The identical projection runs locally for
  immediate UI but carries ADR-0116 vocabulary (`local-only` /
  `pending-verification`) until the server proof exists; public/comparative
  surfaces accept only `server-verified` per ADR-0116 D6. Forging the mode
  log requires forging the signed, hash-chained, dedup-checked command
  history; offline runs lose nothing (ADR-0116 D9). Zero new cryptography.
- **Option E2 — separate client-signed hash-chained mode-event log.
  Rejected as redundant.** The commands that imply mode are already
  individually signed and chain-anchored; a second chain adds attack
  surface and key-management cost for no additional trust, and without web
  attestation a hostile client can sign a fabricated chain anyway
  (mode-state packet Findings 5–6).
- **Option E3 — accept-and-flag only (no re-derivation).** Trusting
  client-asserted mode facts repeats the BG3/Forza failure the moment the
  badge carries prestige (Finding 4). **Rejected as the trust mechanism**,
  but its trust-tier *vocabulary* is retained as E1's presentation layer —
  E1 *is* accept-and-flag where the flag is computed, not asserted.

★ = **E1, with E3's labeling vocabulary as presentation, E2 rejected.**

### O4 — Family C placement: delegation/consent facts (settled by ADR-0136's frame)

The mode-state packet's C1 ★ (Staff Operations owns assignment facts;
owning domains execute; the ADR-0102 notification platform carries the
act-and-report feed) is the same recommendation
[[ADR-0136-delegation-to-staff-contract|ADR-0136]] carries as its O1/O4;
this ADR does not restate that contract. What this ADR adds is the
**projection dependency**: `AreaConsentLevelChangedV1` /
`AreaResponsibilityAssignedV1` are consumed by League Orchestration's
family-B mode profile, because "which consent levels were active" is half of
what "mode actually used" means (mode-state packet Finding 13). Consent
changes are ordinary signed game-state commands — never cosmetic-LWW
preferences — because they change who may mutate game state (Finding 8),
which is exactly what makes them command-derivable for O3.

### O5 — Family D + MP encoding: what enters MP contracts now

- **Vault-delta ★ (adopted as this ADR's proposal): do NOT encode world
  into MP contracts in Stage-2 — leave a reserved field only.** D2
  (switch anytime) plus the open per-area override make the world label a
  branding attribute, not a truthful capability descriptor; any MP rule
  keyed on "world" would misclassify mixed-surface players
  ([[../../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02|vault-delta note]],
  MP-treatment input). The truth surface for MP is the family-B snapshot,
  not the world label.
- **MP treatment (OPEN fork):** the fairness packet's ★ is **Option A —
  mode-blind unified competition + full mode transparency** (sorting by
  performance only; mode visible via family-B badges/log; D3 envelope
  monitored in MP telemetry). Option B (mode-segregated ladders) stays
  **explicitly reopenable if an official large-population ranked ladder
  ever ships**; Option C (mode-normalization boosts) is **rejected by
  evidence unless D3 itself is revised** — it would make the engine read
  the authoring surface, breaking the one-contract invariant
  ([[../../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02|fairness packet]],
  MP-treatment fork).
- **Family D group config (fairness packet NEW-mp-group-mode-config ★,
  Option A):** post-MVP, "league mode composition" (open / Easy-only /
  Pro-only) becomes one more per-group knob in the
  [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules|GD-0035]] /
  [[../../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure|GD-0036]]
  lobby-settings table (`modeComposition` + policy version) — a
  **membership rule, not an account lock** (D2 intact), with breaches
  evidenced by the family-B mode log. Scoped as **group config + mode
  log**, sequenced after family B ships.

## Proposed contract shape (★ — recommendation, not a decision)

### 1. Ownership map

| Fact family | Owner | Others' role |
|---|---|---|
| A — world/tier preference | Client setting (A1, MVP) → identity-access `AccountPreference` (A2, when hosted profiles matter) | No competitive/MP contract may read it (A3) |
| B — per-match mode atom | **Match** (authoring-provenance slice in the tactic lock snapshot) | Tactics supplies compile provenance; replays carry the atom |
| B — per-unit snapshot, season profile, re-badge | **League Orchestration** (projection over atoms + family-C facts, on its rated units) | Audit & Security verifies integrity; never owns |
| C — consent/delegation assignments + feed | **Staff Operations** + ADR-0102 notification platform, per [[ADR-0136-delegation-to-staff-contract|ADR-0136]] | League Orchestration consumes for the mode profile |
| D — MP group mode composition | **Group config** (GD-0035/GD-0036 knob table), post-MVP | Reads the family-B mode log as evidence; platform stays mode-blind |

All family-B fields persist the internal **tier enum** (Quick/Standard/
Expert); the world label is derived through the Stage-2 branding mapping —
otherwise a future re-branding rewrites competitive records (mode-state
packet, stress evidence for D1).

### 2. Hard invariants (apply under every option Nico may pick)

1. **Preference is never evidence, only per-unit snapshots are.** No
   leaderboard, ranking, matchmaking, badge, export or official-comparison
   contract may read family A; comparative surfaces read family B
   exclusively (mode-state packet, family-A recommendation).
2. **Mode-bearing facts must be command-derived** — any mode fact that
   cannot be re-derived from the signed command/event history is invalid
   for competitive surfaces. A pure UI toggle that never issues a command
   must either become a command (family-C consent changes already are) or
   stay out of competitive surfaces (family-A preference)
   (mode-state packet, NEW-mode-log-integrity ★).
3. **The mode log is a projection, never an input.** Clients render the
   local projection with ADR-0116 trust labels; only the server-derived,
   `server-verified` projection reaches public/comparative surfaces
   (ADR-0116 D6/D9 applied unchanged).
4. **Switching is never blocked, only recorded.** A mid-unit switch emits a
   re-badge event (`EntryModeRebadgedV1`, one-way, BG3 pattern — labeling
   packet Finding 2); D2 stays intact everywhere, including inside rated
   units and family-D groups.
5. **Badges are informational only.** No mode-based rewards, rankings or
   matchmaking keys; watch-party and social surfaces stay mode-neutral so
   the label never becomes a stigma channel (fairness packet R8, labeling
   packet Finding 4).

### 3. Integrity flow (E1, names illustrative)

Signed commands (ADR-0115) → owning-context events (tactic lock snapshot
with `authoringProvenance`; `AreaConsentLevelChangedV1`; run/entry
lifecycle) → League Orchestration mode projection (`MatchModeRecordedV1`,
`SeasonModeProfile`) → on sync, server re-derives the identical projection
during ADR-0090 re-validation and stamps ADR-0116 provenance
(`server-verified`); until then the local projection is labeled
`local-only` / `pending-verification` and is ineligible for public
surfaces. Audit & Security's hash-chained log (ADR-0091) anchors the
history the projection is derived from; tamper attempts resolve to
ADR-0116 D10's irreversible downgrade. No new cryptographic machinery is
introduced by this ADR.

### 4. Relation to ADR-0108 (future amendment, not made here)

[[ADR-0108-no-pay-to-win-and-mp-fairness-invariant|ADR-0108]] pins
no-**pay**-to-win; it is silent on the D3 bounded depth edge. A future
amendment — **fed by the D3 numbers-finalization pass once the sim harness
exists** ([[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]) —
would cover **bounded-edge disclosure**:

- the **mode-twin zero-effect property**: identical authoritative outputs
  for identical tactic contracts regardless of authoring surface, added to
  the future `no-p2w-architecture-contract` gate family so
  "no-depth-to-win beyond D3's envelope" gets the same CI standing as
  no-pay-to-win (fairness packet Finding 9 and D3 stress input);
- the **copy gate applied to fairness claims about modes**: player/store
  copy communicates the invariants, not raw envelope numbers, and no
  fairness claim ships without its backing test (fairness packet R5,
  mirroring ADR-0108's existing copy/source gate);
- an `mp.tierParity`-class telemetry slot with the D3 envelope as
  acceptance gate, per ADR-0135's slot taxonomy.

This ADR deliberately does **not** amend ADR-0108 now: the amendment's
substance is the finalized D3 numbers, which are explicitly open.

## Decision

Draft — nothing is decided here. Proposed for ratification:

1. The **ownership map** (§1) and the five **hard invariants** (§2),
   including the verbatim family-A invariant and the command-derived
   mode-log invariant.
2. **B1+B2 / E1** as the snapshot + integrity architecture (B3, E2, E3-as-
   trust-mechanism rejected).
3. **No world field in MP contracts in Stage-2** — reserved field only;
   MP treatment itself stays an open fork carried in §Open forks.
4. Family-C placement is ratified through
   [[ADR-0136-delegation-to-staff-contract|ADR-0136]]; this ADR adds only
   the family-B projection dependency on its events.

## Rationale

- **Assignment, not invention.** Every fact family lands on machinery the
  vault already owns — ADR-0090's state classes, ADR-0115/0116/0091's
  attestation stack, ADR-0066's rated units, ADR-0053/0102's staff/
  notification seam — so the dual-mode sweep adds projections and fields,
  not contexts or cryptography (mode-state packet, Summary).
- **The preference/record split is the industry norm** (Lichess, Chess.com,
  Valorant, Play Games — Finding 2), and the snapshot-on-the-rated-unit
  pattern is the genre's (Forza, BG3 — Finding 3). Deviating from either
  would need evidence the packets do not contain.
- **E1 is the only integrity option that makes the badge evidence-grade on
  an offline PWA** (Findings 4–7): D3's credibility in MP rests on a
  trustworthy mode log, so the labeling companion of D3 is treated as
  dependent on E1-class integrity.
- **Keeping world out of MP contracts keeps the open forks open.** A
  reserved field costs nothing; encoding the branding layer now would
  prejudge the MP-treatment and labeling forks and misclassify
  mixed-surface players under D2.

## Consequences

Positive:

- Every mode-bearing surface (badges, season profiles, group rules, future
  MP labels) reads one derived, server-attestable truth; the BG3
  stored-flag failure is excluded by construction.
- D2 is preserved everywhere — integrity comes from recording switches, not
  blocking them.
- Identity & Access stays narrow at MVP (A1); the A2 surface is a purely
  additive later step.
- The future ADR-0108 amendment has a named scope and a named feeder
  (ADR-0135's D3 numbers pass) instead of an implicit TODO.

Negative / constraints:

- League Orchestration grows a cross-context projection (consuming Match,
  Tactics and Staff Operations facts) — via published language only, but a
  real coupling surface to review at contract time.
- The trustworthy badge exists only after sync; purely-local surfaces stay
  casual-only per ADR-0116 — acceptable, but must be communicated in UX
  copy.
- Family-D group config and any MP labeling are sequenced **after** family
  B ships; Stage-2 planning must respect that ordering.
- A3 discipline ("no competitive contract reads preference") needs a future
  contract-check twin to the ADR-0108 schema gate, or drift will reintroduce
  the preference-as-evidence bug.

## Open forks for Nico (carried, not decided here)

- **Competitive labeling** (badge/board shape; fork carried by
  [[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]]): labeling
  packet ★ = one main board with a prestige-neutral world badge + opt-in
  Pro-pure prestige boards; this ADR only supplies the substrate (family B)
  either choice needs.
- **MP treatment**: fairness packet ★ = mode-blind unified competition +
  transparency (Option A); B reopenable if a large ranked ladder ships; C
  rejected-by-evidence unless D3 is revised. This ADR encodes only the
  reserved field.
- **Family A variant timing**: ★ = A3 with A1 at MVP, A2 once hosted
  profiles matter — the A2 trigger point is Nico's call.
- **Family D group-mode-config**: ★ = adopt post-MVP as group config +
  mode log (fairness packet NEW-mp-group-mode-config Option A).
- **World naming / parity numbers / preset mapping / per-area override**:
  open in their own FMX-212 notes
  ([[../../50-Game-Design/GD-0046-two-worlds-mode-model|GD-0046]],
  [[ADR-0135-tier-parity-and-assist-strength-calibration-contract|ADR-0135]]);
  family-B records are naming-proof because they persist the internal tier
  enum (§1).

## Future-scope notes (classified future-scope)

- **Hosted profiles:** family-A Option A2 and any cross-save "world
  identity" UI sequence behind ADR-0123 follow-ups.
- **P2P save sharing before sync:** the only niche where E2's
  self-contained chain has value; revisit only if that feature ships
  (mode-state packet, future scope).
- **Commitment flag ("Pro-pure run"):** a pure family-B derivation (mode
  log contains only Expert entries) plus ADR-0116 eligibility — must not be
  built as a separate stored flag.
- **ADR-0108 amendment:** drafted after the D3 numbers-finalization pass
  (§4 above).

## Supersedes

None

## Related Docs

- [[../../60-Research/mode-state-contract-placement-and-integrity-2026-07-02]]
- [[../../60-Research/mode-choice-switching-and-competitive-labeling-2026-07-02]]
- [[../../60-Research/asymmetric-interface-fairness-multiplayer-2026-07-02]]
- [[../../60-Research/dual-mode-vault-delta-reconciliation-2026-07-02]]
- [[ADR-0108-no-pay-to-win-and-mp-fairness-invariant]]
- [[ADR-0115-command-integrity-and-replay-protection-posture]]
- [[ADR-0116-save-trust-levels-and-provenance-posture]]
- [[ADR-0135-tier-parity-and-assist-strength-calibration-contract]]
- [[ADR-0136-delegation-to-staff-contract]]
- [[ADR-0137-stadium-construction-and-expansion-contract]] — same FMX-212
  wave (stadium-area commands whose mode provenance the family-B projection
  covers under D4)
- [[../../50-Game-Design/GD-0046-two-worlds-mode-model]] — two-worlds cover;
  carries the competitive-labeling and world-naming forks this ADR supplies
  the substrate for
- [[../../50-Game-Design/GD-0035-live-coaching-intervention-and-pause-rules]]
