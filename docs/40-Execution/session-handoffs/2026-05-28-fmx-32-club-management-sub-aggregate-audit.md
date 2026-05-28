---
title: Handoff FMX-32 Club Management Sub-Aggregate Ownership Audit
status: wrapped
tags: [meta, execution, handoff, fmx-32]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  - [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../10-Architecture/09-Decisions/ADR-0058-club-economy-commercial-impact-boundary]]
  - [[../../50-Game-Design/stadium-and-campus]]
  - [[../../50-Game-Design/fan-ecology]]
  - [[../../50-Game-Design/sponsorship-portfolio]]
  - [[../../50-Game-Design/matchday-event-engine]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-32 Club Management Sub-Aggregate Ownership Audit (2026-05-28)

## Linear

- Issue: FMX-32 (transitioned to In Progress 2026-05-28; `risk:legal`
  label added).
- Parent: FMX-24.
- Sibling spawned: **FMX-54** Recherchiere Fan-Ecology Persona-
  Privacy & Creative-IP-Safe-Naming Review (created 2026-05-28
  under parent FMX-24, `risk:legal` + `type:research` + `type:doc`
  + `area:squad-club` + `area:meta` labels). Related to FMX-32.
- Unblocks: per-candidate ratification frame for the four wave-2
  economy candidates (Stadium / Audience & Atmosphere /
  CommercialPortfolio / Ticketing & Settlement); draft ADR-0050 +
  ADR-0058 can ratify concurrently with FMX-32 once Nico decides
  per-candidate; clears boundary debt before further wave-2 ledger
  / commercial-contract work lands.

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]].
- Surfaced and resolved 10 plan-mode decisions via AskUserQuestion
  rounds with Nico:
  1. **Audit scope width** = 4 candidates including Ticketing &
     Commercial Settlement (Nico expanded beyond ticket's 3
     candidates to capture the ADR-0058 surface).
  2. **ADR shape** = Combined ADR-0061 + spin-off ADR-0062 if any
     candidate splits.
  3. **Option framing** = per-candidate matrix A / B / C.
  4. **Supersession latitude** = inline amendment hunks against
     draft ADR-0050 + ADR-0058 (both still `binding: false`).
  5. **Fan loop independence** = resolve via Perplexity + DDD
     pattern (research input).
  6. **FSM extraction scope** = strict boundary audit only;
     FSM extraction is a follow-up ticket.
  7. **Fan Ecology `risk:legal` handling** = set on FMX-32 + spawn
     follow-up FMX-54 (privacy + creative-IP-safe-naming review).
  8. **Naming if promoted** = `Audience & Atmosphere` for Fan
     Ecology; `CommercialPortfolio` for the Sponsorship + Catering
     + Merch + Hospitality + Ticketing umbrella.
  9. **ADR number** = ADR-0061 (combined) + ADR-0062 (spin-off).
  10. **Perplexity query budget** = 3 per candidate = 12 queries
     total.
  Plus standing IP-naming directive from Nico (evocative-but-
  clearly-not-real, vault-wide). Saved to long-term memory as
  `feedback-creative-ip-safe-naming.md`.
- Updated FMX-32 Linear: transitioned to In Progress, added
  `risk:legal` label, assignee Nico Rimmele.
- Spawned FMX-54 (Fan Ecology Persona-Privacy & Creative-IP-Safe-
  Naming Review) with full description + acceptance criteria +
  related cross-refs.
- Ran **twelve focused Perplexity queries** across four candidates
  × three dimensions (Genre / DDD authority / Real-world football
  operations 2023-2026):

  - **Stadium / Venue Operations (Q1.1 / Q1.2 / Q1.3):**
    - Q1.1 Genre: medium-high confidence; FM + EA FC + OOTP +
      Anstoss treat Stadium as sub-aggregate; FIFA Manager closest
      to facility-decay model; cross-genre Theme Park / Anno /
      F1 Manager promote ops to own context when ops becomes core.
    - Q1.2 DDD: high confidence; Vernon + Evans + MS Learn all
      converge on own BC for Hotel PMS / CMMS / facility-ops
      subdomain.
    - Q1.3 Real-world: high confidence; Bayern Allianz Arena
      München Stadion GmbH + BVB Stadionmanagement GmbH + Spurs
      venue business + Real Madrid Bernabéu Legends JV separation
      evidence; UEFA + Premier League + DFL + FA EPPP + SGSA Green
      Guide + CEN-EN 17210 multi-regulator framework.

  - **Audience & Atmosphere / Fan Ecology (Q2.1 / Q2.2 / Q2.3):**
    - Q2.1 Genre: medium-high confidence; football sims aggregate
      to single fan-happiness; cross-genre CK3 + Civ VI + Cities +
      TW unanimous on segmented audience / loyalty as own context.
    - Q2.2 DDD: high confidence; Vernon scoring-context + customer-
      loyalty canonical; Salesforce Marketing Cloud + Schufa +
      Spotify + Tesco Clubcard industry pattern; **cadence-
      independence resolution** via Vernon "different life cycles
      and process rhythms" (IDDD ch. 3 + 5) — research-grounded
      answer to the FMX-32 plan §5 Nico-gated question.
    - Q2.3 Real-world: low confidence (Perplexity flagged
      sourcing gap on club-by-club governance); SLO + GDPR +
      DSA regulatory anchor provisionally documented; dossier
      relies on F3.2 DDD authority + F5.2 regulatory framework
      for primary evidence.

  - **CommercialPortfolio (Q3.1 / Q3.2 / Q3.3):**
    - Q3.1 Genre: medium-high confidence; football sims treat
      sponsorship as scalar; F1 Manager / Motorsport Manager
      closest analogues with persistent sponsor portfolio +
      performance-bonus contracts.
    - Q3.2 DDD: high confidence; Vernon CLM canonical; Salesforce
      CPQ + SAP S/4HANA Sales Contract + Stripe Connect +
      Guidewire PolicyCenter + Amdocs subscription lifecycle
      industry pattern unanimous on own BC.
    - Q3.3 Real-world: high confidence; CCO-peer-of-CFO universal
      at Real Madrid + Barça + Bayern + Manchester United +
      Manchester City + Liverpool + BVB + Inter + PSG; commercial
      revenue 40-60% of total per Deloitte Money League 2026;
      UEFA FSR + PL APT + La Liga PSR + GDPR + DSA + EU
      competition + Bundesliga 50+1 multi-regulator framework.

  - **Ticketing & Commercial Settlement (Q4.1 / Q4.2 / Q4.3):**
    - Q4.1 Genre: low confidence (Perplexity flagged sourcing
      gap on UI / mod / patch-note details); inference: football
      sims model ticketing as single attendance line. Vault
      cross-reference (FMX-42 + FMX-43 research) carries F2 weight
      instead.
    - Q4.2 DDD: high confidence; Vernon settlement-context +
      airline yield mgmt vs revenue accounting + Stripe Billing-
      vs-Ledger + concert promoter ticketing-vs-settlement
      industry pattern; rev-rec is canonically own BC, not GL
      sub-aggregate.
    - Q4.3 Real-world: high confidence; IFRS 15 universal practice
      across BVB Konzernabschluss + Real Madrid Memoria + FC
      Barcelona Memòria + Manchester United 20-F; cash receipt
      / deferred revenue / match-by-match recognition / instalment
      receivables / refund liability pools / hospitality multi-
      component performance obligations all documented; yield
      management as distinct role post-Liverpool / Spurs dynamic
      pricing controversies; UEFA FSR + DFL + CRA Schedule 2 +
      DSA + CEN-EN 17210 + Late Payment Directive + GDPR Art. 6
      / 9 six-framework regulatory anchor.

- Archived all 12 raw Perplexity Q+A blocks at
  [[../../60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28]]
  (~70k tokens, large but matches FMX-29 / 33 raw-research
  precedent shape).
- Wrote synthesis
  [[../../60-Research/club-management-sub-aggregate-audit-2026-05-28]]
  with sections Question + Summary + F1 Vault binding state + F2
  Genre + F3 DDD authority + F4 Six-of-six DDD scoring (per
  candidate) + F5 Real-world + F6 Cross-context integration +
  Inputs for decisions + Why not Options A/B/C (per candidate) +
  Future-scope notes + Recommendation (per candidate) +
  Cross-references. Mirrors FMX-29 precedent exactly.
- Applied six-of-six DDD scoring rubric per candidate:
  - Stadium / Venue Operations: **5/6** (criterion 6 low-co-
    change fails: matchday-FSM coupling to Match). Lean Option B.
  - Audience & Atmosphere: **6/6** (matches FMX-29 / 33 wave
    high). Lean Option C, spin-off ADR-0062.
  - CommercialPortfolio: **6/6** (matches wave high). Lean
    Option C.
  - Ticketing & Commercial Settlement: **6/6** (matches wave
    high). Lean Option D (sub-Aggregate inside
    CommercialPortfolio); fallback Option C standalone Settlement
    BC if CommercialPortfolio = Option B.
- Drafted [[../../10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit]]
  with per-candidate Options A/B/C matrix, Recommendation, Decision
  per candidate, Public contract direction, Determinism + storage
  rules, Rationale, Consequences, Map patch proposal (proposed-
  only diff against bounded-context-map.md §1 table + §1 prose +
  §2 high-level Mermaid + §4 source mapping + §5 extraction order
  + §6 finance-ownership amendment to draft ADR-0050 / ADR-0058
  paragraph), Supersedes (none — refines drafts), Related Docs.
- Drafted [[../../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  as spin-off carrying Audience & Atmosphere standalone ratification
  frame with Options A/B/C/D, Recommendation Option C,
  Decision (owns / does not own), Public contract direction
  (`SupporterSegment` + `AtmosphereSnapshot` + `FanIncident` +
  `TicketingTrustLedger` + `NamedSupporterGroup` FMX-54-gated
  aggregates), Determinism + storage rules (per-save schema,
  `AtmosphereRng` / `PoliticsRng` / `TrustRng` sub-labels,
  GDPR / DSA / SLO posture), Rationale, Consequences, Map patch
  (just the AAtmo addition; CommercialPortfolio edges handled in
  ADR-0061), Related Docs.
- Patched [[../../00-Index/Decision-Log]] with two new ADR rows
  (ADR-0061 + ADR-0062) and one research synthesis bullet under
  the wave-2 research synthesis cluster.
- Patched [[../../00-Index/Current-State]] with FMX-32 banner
  block (~80 lines, mirrors FMX-29 banner shape) covering all
  four candidates + six-of-six scoring + recommendation +
  regulatory anchor + public-contract surface preview.
- Wrote this handoff.

## Open

- **Nico per-candidate ratify decision** is the only blocker.
  ADR-0061 + ADR-0062 stay `status: proposed` / `binding: false`
  until ratified. Working recommendation: **Stadium = B**,
  **Audience & Atmosphere = C** (spin-off ADR-0062), **CommercialPortfolio
  = C**, **Ticketing & Settlement = D** (sub-Aggregate inside
  CommercialPortfolio). Each can ratify independently — Nico
  may pick any combination.
- Map growth: if working recommendation is fully accepted, the
  bounded-context-map grows by 2 contexts (Audience & Atmosphere +
  CommercialPortfolio). Combined with in-flight drafts
  ADR-0059 (Community Overlay Pipeline) + ADR-0060 (Youth
  Academy), the map can reach 19-20 contexts depending on landing
  order. Modular monolith stays one process per ADR-0019.
- **In-line amendment hunks against draft ADR-0050 + ADR-0058**
  proposed inside ADR-0061 §Map patch §6. Both target ADRs
  remain `binding: false`. If FMX-32 ratifies, the amendments
  apply at the same ratification event; draft ADR-0050 +
  ADR-0058 can then ratify concurrently with the audit
  recommendation.
- **FMX-54 Fan Ecology Persona-Privacy & Creative-IP-Safe-Naming
  Review** is created but not yet ratified. Until FMX-54 lands,
  `NamedSupporterGroup` aggregate in Audience & Atmosphere stays
  opt-in via FMX-54-gated command (`OnboardNamedSupporterGroup`
  + `NamedSupporterGroupOnboarded` stubbed; persona link to
  People per ADR-0052 draft inactive). FMX-54 also handles the
  vault-wide creative-naming generator pattern for fan-group /
  sponsor / venue / person samples.
- **FSM extraction follow-up.** Per locked plan §6, FMX-32 does
  not extract Stadium matchday FSM + facility-decay sub-FSM +
  season-ticket campaign 8-state FSM + commercial contract
  lifecycle FSM + breach Process Manager + A&A segment-mood FSM
  + A&A politics-event FSM into `docs/10-Architecture/state-
  machines/`. Spawn FMX-XX `FSM extraction batch` ticket after
  FMX-32 ratifies.

## Next sessions

- **Apply-PR for ADR-0061 + ADR-0062 ratification.** When Nico
  ratifies, follow the FMX-35 / 36 / 37 / 39 / 40 apply-PR
  precedent: flip ADRs to `status: accepted` / `binding: true`;
  apply §Map patch hunks to `bounded-context-map.md` (§1 table
  + §1 prose + §2 Mermaid + §4 source mapping + §6 finance-
  ownership paragraph); apply in-line amendments to draft
  ADR-0050 + ADR-0058 (and optionally promote them to
  `accepted` if Nico is also ratifying those drafts at the same
  event); patch [[../../00-Index/Decision-Log]] rows to
  `accepted` + add ratification note; patch
  [[../../00-Index/Current-State]] banner to "ratification applied"; rename
  `fan-ecology.md` GDDR to `audience-and-atmosphere.md` per
  ADR-0062 §Supersedes (with redirect banner on the old filename
  per [[../../90-Meta/vault-governance]] § Supersede discipline).
- **FMX-54 dossier.** Sibling ticket already created; runs the
  same six-phase workflow on Fan Ecology persona privacy +
  creative-IP-safe-naming generator pattern. Inputs for ADR-0062
  `NamedSupporterGroup` aggregate scope hardening.
- **FSM extraction batch** ticket after FMX-32 ratifies.
- **Yield Management as named sub-domain inside CommercialPortfolio**
  ticket (post-Liverpool / Spurs dynamic-pricing-controversy
  organisational trend). Future-scope.

## Changed vault paths

- New:
  - `docs/60-Research/club-management-sub-aggregate-audit-2026-05-28.md`
  - `docs/60-Research/raw-perplexity/raw-club-management-sub-aggregate-audit-2026-05-28.md`
  - `docs/10-Architecture/09-Decisions/ADR-0061-club-management-sub-aggregate-audit.md`
  - `docs/10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context.md`
  - `docs/40-Execution/session-handoffs/2026-05-28-fmx-32-club-management-sub-aggregate-audit.md`
    (this file).
- Patched:
  - `docs/00-Index/Decision-Log.md` (two new ADR rows + one
    research synthesis bullet).
  - `docs/00-Index/Current-State.md` (FMX-32 banner block).
- Linear:
  - FMX-32 transitioned to In Progress; `risk:legal` label added.
  - FMX-54 created.

## Decision still needed from Nico

1. **Stadium / Venue Operations:** Option A (sub-aggregate) /
   Option B (Hybrid named Aggregate `StadiumOperations` — working
   rec) / Option C (own BC).
2. **Audience & Atmosphere:** Option A / Option B (Hybrid) /
   Option C (own BC + spin-off ADR-0062 — working rec).
3. **CommercialPortfolio:** Option A / Option B (Hybrid) /
   Option C (own BC — working rec).
4. **Ticketing & Commercial Settlement:** Option A / Option B /
   Option C (standalone Settlement BC) / Option D (sub-Aggregate
   inside CommercialPortfolio — working rec, conditional on
   CommercialPortfolio = Option C).
5. **Concurrent ratification of draft ADR-0050 + ADR-0058?** If
   yes, draft ADRs flip to `accepted` at the same event; FMX-32
   in-line amendment hunks become authoritative simultaneously.
   If no, FMX-32 amendments stay proposed until ADR-0050 +
   ADR-0058 ratify later.

All five decisions can ratify independently; ADR-0061 + ADR-0062
matrix supports any combination.
