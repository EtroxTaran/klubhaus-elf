---
title: GD re-audit — cluster G4 (Transfers / Scouting / Escalation)
status: draft
tags: [research, audit, gd-re-audit, g4, transfers, scouting, escalation, inactivity-pressure, contracts, async-multiplayer]
context: [transfer, scouting]
created: 2026-06-08
updated: 2026-06-08
type: research
binding: false
related:
  - [[../50-Game-Design/GD-0006-transfers]]
  - [[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure]]
  - [[../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
  - [[../10-Architecture/09-Decisions/ADR-0088-async-escalation-fsm-and-watch-party-deadline-source-of-truth]]
  - [[../10-Architecture/09-Decisions/ADR-0004-data-model]]
  - [[../50-Game-Design/GD-0027-hidden-attribute-substrate-mapping]]
  - [[../50-Game-Design/GD-0040-future-contracts-clm-extraction-seam]]
  - [[club-boss-analysis]]
  - [[anstoss-series-deep-dive]]
  - [[player-contract-lifecycle-fsm-2026-06-03]]
  - [[fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]
  - [[adr-re-audit-master-2026-06-08]]
  - [[../90-Meta/collaboration-and-decision-protocol]]
  - [[../00-Index/Open-Decisions-Dossier]]
---

# GD re-audit — cluster G4 (Transfers / Scouting / Escalation)

Audit of the two G4 game-design records against the existing mature vault, for the
planning-mode ratification sweep. Scope: transfers & scouting
([[../50-Game-Design/GD-0006-transfers|GD-0006]]) and transfer escalation & inactivity
pressure ([[../50-Game-Design/GD-0036-transfer-escalation-and-inactivity-pressure|GD-0036]]).

**Decision gate ([[../90-Meta/collaboration-and-decision-protocol]]): every recommendation
below is options + a recommendation + confidence, for Nico to ratify. Nothing here is
accepted; this note edits no existing file.** Ground-truth constraints respected:
offline-first PWA (ADR-0002), LLM out of authoritative state (ADR-0030 — escalation creates
facts, Narrative renders), Postgres system-of-record (ADR-0021/0027/0004), narrow cloud-sync
(ADR-0090). Both GDs were reset to `status: draft` on 2026-05-27 (decisions reopened), so each
needs an explicit disposition even where the substance is sound.

## Headline findings

1. **Both records are substantively sound and well-grounded.** GD-0006 is the long-standing,
   research-backed transfer/scouting fantasy (club-boss-analysis + anstoss-series-deep-dive);
   GD-0036 is the freshly-authored (2026-06-07) escalation design companion to ADR-0088, with
   Nico's live D1–D4 choices already recorded. Neither needs redesign.
2. **The two split cleanly on what blocks them.** GD-0006's *core* mechanics (inbox-as-surface,
   ranged uncertainty, sort/filter-from-day-one, transfer-list pulse) are ratifiable now and
   independent of unresolved tuning; only its **Open (Wave 2)** items (opponent transfer AI
   R2-04, budget/wage/value tier model R2-02) are genuinely deferred. GD-0036 is a pure design
   companion to a `proposed` ADR (ADR-0088) and rides that ADR's ratification.
3. **The chief governance issue is status/header drift, identical to the ADR clusters.** Both
   GDs carry a body/front-matter mismatch: GD-0006's body says `approved` while front-matter is
   `status: draft` (and the README banner records the global 2026-05-27 reset); GD-0036's
   `binding: false` is correct but its design content is downstream of an ADR that is still
   `proposed`. The README precedence rule ("Status wins first; approved is binding") means the
   body-`approved` line in GD-0006 is currently misleading.
4. **GD-0006's FMX-81 contract-lifecycle appendix overlaps ADR-0073 and the GD-0040 future-CLM
   seam.** The appendix is the player-facing face of ADR-0073's ownership decision; on ratify
   the appendix should be ratified *as design narrative for* ADR-0073, not as an independent
   contract decision, and its "future Contracts context" hint should defer to GD-0040.

---

## Per-GD verdicts

### GD-0006 — Transfers & Scouting — **sound** (ratify-with-amendment: status reconciliation + dependency ordering)

Confidence: **high** on the substance; **medium** on the precise disposition because part of the
record (Open Wave 2 items + FMX-81 appendix) is genuinely downstream of other decisions.

Evidence: GD-0006 is the most-cited transfer record in the vault and the design source for
ADR-0004 (`transfer_offer`, RELATE graph) and ADR-0073. Its **Decided / strong** section is
grounded in two mature research notes:
- club-boss-analysis takeaways **2** (inbox/email deal-flow with Accept/Decline/Defer/Snooze),
  **4** (risk surfaced as ranges, not point estimates), and **8** (sort/filter every list from
  day one — "the most repeated review request for the genre");
- anstoss-series-deep-dive §3 "Transfers" (transfer-list pulse at season start, age/talent
  arbitrage on 18–19y prospects, AI bidding pressure) and §7 rec. 9 (unified inbox feed).
It also correctly names its **avoid-known-failures** list (thin one-shot renewal; sparse
late-game targets) and pins IP-safety to ip-and-licensing §3. None of this is contested by any
later ADR/GD; it is the stable backbone of the Transfer context.

The record itself already separates ratifiable design (the Decided / strong block + the adopted
mechanics "continent-targeted scouting + rating ranges") from explicitly-deferred algorithm work
(R2-04 opponent transfer/scouting/bidding AI; R2-02 club budget/wage/value tier model). That
separation is exactly right and should be preserved on ratify — i.e. ratify the *design
direction*, leave the two algorithm items `defer` (Wave 2), do not block the core record on them.

Issues:
- **(a) Body says `approved`, front-matter says `status: draft`.** Post the 2026-05-27 global
  reopen this is the standard drift. Under the README precedence rule the body-`approved` line is
  now misleading. The reconciliation is a header chore, not a redesign.
- **(b) The FMX-81 contract-lifecycle appendix is currently `proposed` inside an otherwise-design
  record and duplicates ADR-0073.** §74–109 restate ADR-0073's ownership landing (Squad & Player
  owns lifecycle truth; Transfer owns process cases — `PreContractCase`, `FreeAgentSigningCase`;
  Regulations owns eligibility) plus a top-5 fictional-profile table that mirrors ADR-0073's. This
  is good (the player-facing narrative belongs in the GD), but on ratify it must read as *the
  design face of ADR-0073*, not as an independent contract decision — so it **dependsOn ADR-0073**.
- **(c) The appendix's "future Contracts context" hint** (line ~289 of ADR-0073; echoed in the GD
  consequences) is the same question GD-0040 now owns. The GD should defer that hint to GD-0040 so
  the future-CLM-extraction question is tracked in one place.

Recommendation (options, for Nico):
- **A. Ratify-with-amendment.** Ratify the Decided / strong block + adopted mechanics as design of
  record; reconcile the body `approved` → match the ratified status; mark R2-02 and R2-04 as
  explicitly `defer` (Wave 2, unblock on those research items); ratify the FMX-81 appendix *as the
  design narrative for ADR-0073* (dependsOn ADR-0073) and point its future-Contracts hint at
  GD-0040. **Recommended.**
- **B. Ratify-as-is** (reopen → re-ratify unchanged). Cheapest, but leaves the body/front-matter
  status contradiction and the appendix's still-`proposed` framing unreconciled.
- **C. Split the FMX-81 appendix out** into its own GD. Cleaner separation but premature map/record
  growth for a beat ADR-0073 already owns; rejected.
- **Recommended: A**, high confidence. The content is settled; only the header status, the explicit
  Wave-2 deferral of R2-02/R2-04, and the appendix-↔-ADR-0073 dependency need stating at ratify.

Open D-question(s): see structured output (one header/scope-ordering question).

### GD-0036 — Transfer Escalation & Inactivity Pressure — **sound** (ratify-as-is, gated on ADR-0088)

Confidence: **high**.

Evidence: GD-0036 is the gameplay-design companion to ADR-0088 and was authored **after** Nico's
live FMX-102 choices (2026-06-07: escalation **D1–D4 = A/A/A/B**). It is a clean, faithful
player-facing rendering of the architecture in ADR-0088:
- **§1 five-stage ladder** (S1 Expired & ignored → S2 Registered interest → S3 Unrest & request
  → S4 Media leak / strike-threat → S5 Public unrest) maps 1:1 to ADR-0088 D1=A's
  `expired_ignored → registered_interest → unrest_requested → media_strike_threat → public_unrest`
  and to the per-stage consequence events (`TransferInterestRegistered`,
  `PlayerTransferRequestSubmitted`, `TransferStandoffEscalated`, `SupporterUnrestTriggered`).
- **§2 pressure meter that leaks** is the player-language version of ADR-0088 D2=A (hybrid
  pressure-accumulator) + D3=A (leaky-bucket + per-stage stickiness + hysteresis). The "you can
  only climb one rung at a time, and S4 can never be reached from a single event" promise is the
  human face of invariant **ES3** (no-strike structural gate) and ES4 (per-stage stickiness).
- **§3 de-escalation** triggers (new contract / reconciliation / agreed sale / window closes /
  decay) match `TransferEscalationDeescalated`'s `cause` enum exactly.
- **§4 determinism** correctly records Nico's **D4 = B** (seeded variance from the existing
  `TransferRng` stream #7, replay-safe, randomness inside the structural rails) — consistent with
  ES1/ES2 and the standing memory rule that Nico prefers bounded seeded variance over pure
  determinism (FMX-92 D4=C, FMX-102 D4=B).
- **§5** correctly routes all magnitudes to FMX-52 behind `escalationModelVersion` and pins
  *stages/feel/direction*, not values — matching ADR-0088's "out of scope / open ratification".
- **§6** reserves the right post-MVP items (multi-window grudges, dressing-room contagion,
  promise-tracking) without committing them.

The personality coupling ("ambitious climbs faster, loyal tolerates more") correctly ties into
GD-0027's hidden-attribute substrate (shifts *thresholds*, not dice), so GD-0036 **dependsOn
GD-0027** for the substrate it reads, and **dependsOn ADR-0088** for the whole mechanism.

Issues (minor): none of substance. (a) `binding: false` is correct for a draft companion. (b) The
record's own banner already states it "pins stages, feel and direction, not final values" — no
over-commitment. (c) It is downstream of a `proposed` ADR, so it cannot be ratified *ahead* of
ADR-0088; it should ratify *with* it (ADR-0088 sits in the ADR-0093 joint-ratification wave per
the master note). This is a sequencing fact, not a defect.

Recommendation: **ratify-as-is**, gated on ADR-0088 (and ADR-0093's joint wave) being ratified
first. No open design question — Nico's D1–D4 are already chosen and faithfully transcribed; the
only "open" magnitudes are explicitly FMX-52 calibration, not ratification blockers. The single
design follow-up flagged by ADR-0088 (whether S4 should additionally gate on competition-window
state) is a post-ratify tuning question, not a blocker, and is better tracked against ADR-0088 /
FMX-52 than re-opened here.

---

## Cross-GD issues within G4

- **XG1 — Status/header drift mirrors the ADR clusters.** GD-0006 body-`approved` vs
  front-matter-`draft` is the same governance gap C9 flagged vault-wide (its proposed new GD on
  ADR status/binding lifecycle). The G4 fix is local (reconcile GD-0006's header on ratify) but it
  is an instance of the broader pattern; if Nico ratifies the C9 lifecycle GD, GD-0006 should be
  swept under the same rule.

- **XG2 — Contract lifecycle is documented in three places that must stay consistent.** GD-0006
  §74–109 (player-facing appendix), ADR-0073 (ownership/contracts), and GD-0040 (future-CLM
  extraction-seam) all touch the contract-lifecycle question. They are *complementary* (GD-0006 =
  fantasy, ADR-0073 = boundaries, GD-0040 = future extraction), but the GD-0006 appendix predates
  GD-0040 and still carries its own "a future Contracts context may be needed" hint. On ratify,
  point that hint at GD-0040 so there is one owner of the extraction question.

- **XG3 — Escalation feeds Transfer/Squad/Audience/Narrative; GD-0006 is the parent surface.** The
  escalation events GD-0036 describes (transfer request, stand-off signal, supporter unrest) surface
  in GD-0006's inbox-as-deal-flow surface. The two GDs are coherent and non-conflicting; GD-0036 is
  effectively a deepening of GD-0006's "AI bidding pressure" + "avoid thin one-shot renewal" themes
  into a staged, reversible system. No contradiction; worth a forward-link from GD-0006 to GD-0036
  on ratify so the parent record points at its escalation child.

## External research (targeted)

No external lookup was warranted for G4. Both GDs rest on assumptions already grounded and recently
verified in the vault:
- GD-0036's escalation model was freshly researched on 2026-06-07 across five Perplexity passes
  ([[fmx-102-async-escalation-and-deadline-source-of-truth-2026-06-07]]: transfer-escalation
  real-world / games / FSM-DDD-determinism), confirming the staged-and-reversible ladder against
  real sagas (Suárez, Gerrard, Rooney, Van Dijk, Kane, Mahrez) and genre precedent (FM, EA FC,
  OOTP, Football Chairman). Re-verifying 24h-old grounded research would add nothing.
- GD-0006's mechanics are derived from [[club-boss-analysis]] + [[anstoss-series-deep-dive]] and
  its only uncertain content (R2-02 economy tiers, R2-04 opponent AI) is *explicitly deferred to
  Wave 2 by design* — those are open research items, not assumptions to verify now.

## Disposition summary (for the queue)

| GD | Disposition | DependsOn | Scope-call? | One-line |
|---|---|---|---|---|
| **GD-0006** | ratify-with-amendment | ADR-0073, GD-0040 | no | Sound transfer/scouting fantasy; reconcile body-`approved`→status, defer R2-02/R2-04 to Wave 2, ratify FMX-81 appendix as ADR-0073's design face. |
| **GD-0036** | ratify-as-is | ADR-0088, ADR-0093, GD-0027 | no | Faithful player-facing companion to ADR-0088 (D1–D4 = A/A/A/B already chosen); ratify with ADR-0088, magnitudes → FMX-52. |
