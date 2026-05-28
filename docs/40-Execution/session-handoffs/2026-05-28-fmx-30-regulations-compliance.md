---
title: Handoff FMX-30 Regulations & Compliance Ownership
status: wrapped
tags: [meta, execution, handoff, fmx-30]
created: 2026-05-28
updated: 2026-05-28
type: handoff
binding: false
related:
  - [[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
  - [[../../60-Research/raw-perplexity/raw-regulations-compliance-2026-05-28]]
  - [[../../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]
  - [[../../10-Architecture/09-Decisions/ADR-0050-club-economy-accounting-ledger]]
  - [[../../50-Game-Design/regulations-and-compliance]]
  - [[../../30-Implementation/domain-research-workflow]]
---

# Handoff: FMX-30 Regulations & Compliance Ownership (2026-05-28)

## Linear

- Issue: FMX-30
- Parent: FMX-24
- Unblocks: cleaner ADR-0050 boundary (financial-check-failed producer
  defined); FMX-29 (Youth Academy HG eligibility) and FMX-27 (Scouting
  activity work-permit pre-checks) get the regulatory query surface
  they need.

## Done this session

- Followed the six-phase
  [[../../30-Implementation/domain-research-workflow]] (binding via
  PR #83).
- Identified the residual question: 14-context map has no Regulations
  owner despite `regulations-and-compliance.md` designing concrete
  rules and naming a `LeagueRegulationService.check()` call surface.
- Ran three focused Perplexity queries:
  1. Genre - regulations modelling in football management sims
     (FM, EA FC, OOTP, FIFA Manager, Anstoss). Medium-high
     confidence; FM Advanced Rules editor + Test Rules validator is
     the strongest direct precedent.
  2. DDD - canonical pattern for regulatory / policy / rule catalog
     concerns (Vernon strategic design, Fowler canonical
     bounded-context page, MSDN Magazine 2009 DDD primer). High
     confidence; Vernon's Tax-catalog pattern (Stripe Tax, Avalara)
     is the direct analogue.
  3. Real-world - 2024-2026 regulatory landscape (Paul Hastings, DLA
     Piper, JD Supra, Deloitte, ACAMS). High confidence; UEFA SCR
     70% + Premier League PSR £105m + La Liga cost control +
     Bundesliga DFL licensing + GBE points well-documented.
- Archived raw findings to
  [[../../60-Research/raw-perplexity/raw-regulations-compliance-2026-05-28]].
- Synthesised
  [[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
  with six numbered findings F1-F6 (each with source + confidence).
- Authored new draft ADR
  [[../../10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context]]:
  `status: proposed`, `binding: false`. Four options (A League sub-
  aggregate / B own context / C distributed / D thin Published-Language
  provider), §Recommendation = Option B with three converging
  justifications, §Public contract direction (commands / events /
  read models / consumed facts), §Determinism and storage rules
  (platform-scope catalog in packages/game-data + per-save snapshot
  copied at save creation per ADR-0051 determinism rule), §Map patch
  proposal as four fenced ```diff``` blocks (order-tolerant with
  parallel ADR-0052 / ADR-0054 drafts).
- ADR number is **ADR-0056** (Narrative took ADR-0054 during the
  FMX-28 beat; Tactics took ADR-0055 during FMX-28; this is the next
  available number).
- `risk:legal` label set on ADR-0056 and will be set on the apply PR -
  IP-clean rule terminology (GD-0015 + ADR-0007 hardline) applies to
  the entire context boundary.
- Updated [[../../00-Index/Decision-Log]] with new ADR-0056 row
  (`proposed`) and added the synthesis under "Current Binding Non-ADR
  Inputs".
- Added FMX-30 anchor block to
  [[../../00-Index/Current-State]] before the FMX-28 / FMX-37 block.

## Open / next step

**Nico Accept Option B (recommended), choose A / C / D, or Defer call
on ADR-0056 is the next gate.**

- *Accept Option B (recommended)*: open a follow-up apply PR analogous
  to FMX-35 / FMX-36 / FMX-37. Flip ADR-0056 `status: proposed` →
  `accepted` and `binding: false` → `true`. Apply the §Map patch (four
  parts) to `bounded-context-map.md` in the same PR. Update
  Decision-Log status column. Update Architecture-Map / 05-Building-
  Blocks / Current-State "14 → 15 bounded contexts" prose (or higher
  if ADR-0052 / ADR-0054 ratify in between - patch is order-tolerant).
- *Choose Option A (League absorbs)*: edit ADR-0056 to record the
  choice; the synthesis names ubiquitous-language conflict + multi-
  regulator catalog mismatch as load-bearing arguments against.
- *Choose Option C (Distributed)*: edit ADR-0056; synthesis names
  rule duplication + community-pack validation homelessness + IP-
  surface scatter as arguments against.
- *Choose Option D (Thin Published-Language provider)*: edit ADR-0056;
  synthesis notes this collapses into Option B as soon as window FSM
  + sanction lifecycle + community-override validation are included.
- *Defer*: leave ADR-0056 `proposed`; document deferral on FMX-30.
  Note: ADR-0050 `LeagueLicenceFinancialCheckFailed` event still has
  no defined producer until decision lands.

The seven future-scope items in §Future-scope notes (era-specific rule
sets for Manager & Legacy historical mode, real-time mid-save rule
changes, community-pack overrides via FMX-33, AI-manager regulatory
awareness curves, sport-specific extensions like women's calendar
offset, sanction state machines, IP-clean terminology audit) remain
`future-scope` regardless of the ratification call.

## Blockers

- No implementation authority for Regulations & Compliance until
  ADR-0056 is `accepted` and `binding: true`.
- ADR-0050 (Club Economy, draft) `LeagueLicenceFinancialCheckFailed`
  event continues to have no defined producer until Regulations is
  ratified.
- FMX-29 (Youth Academy) HG eligibility queries depend on the
  Regulations contract; FMX-27 (Scouting activity) work-permit
  pre-checks depend on Regulations.
- FMX-33 (Community Overlay Pipeline) territory partially defined by
  this ADR's §Public contract direction (`ImportRuleOverride` command
  + `RuleOverrideValidated` / `RuleOverrideRejected` events), but the
  Overlay pipeline itself is a separate beat.
- ADR-0052 (People) and ADR-0054 (Narrative) drafts are parallel; the
  §Map patch in ADR-0056 is order-tolerant.

## Changed vault paths

- `docs/60-Research/raw-perplexity/raw-regulations-compliance-2026-05-28.md` *(new)*
- `docs/60-Research/regulations-compliance-bounded-context-2026-05-28.md` *(new)*
- `docs/10-Architecture/09-Decisions/ADR-0056-regulations-compliance-context.md` *(new)*
- `docs/00-Index/Decision-Log.md` *(ADR-0056 row + Current Binding Non-ADR Inputs)*
- `docs/00-Index/Current-State.md` *(FMX-30 anchor block)*
- `docs/40-Execution/session-handoffs/2026-05-28-fmx-30-regulations-compliance.md` *(this file, new)*
- `docs/40-Execution/session-handoffs/README.md` *(new entry)*

## Needs promotion

- ADR-0056 can move to `accepted` / `binding: true` only after Nico
  accepts Option B (or chooses A / C / D).
- [[../../60-Research/regulations-compliance-bounded-context-2026-05-28]]
  stays `draft` as a synthesis; not a promotion gate.
- `bounded-context-map.md` patch applies only on ADR-0056 acceptance.

## Ratify-ask

**Accept Option B (recommended), choose Option A / C / D, or Defer?**

§Recommendation in ADR-0056 names Option B (own bounded context) as
the call. Synthesis F4 + F5 + F6 are the load-bearing arguments:
five-of-six DDD split criteria fire affirmative; Vernon's canonical
Tax-catalog pattern (Stripe Tax, Avalara) is the direct DDD analogue;
real-world multi-regulator structure (UEFA SCR + Premier League PSR +
La Liga cost control + Bundesliga licensing + GBE points) confirms
the domain shape; FM Advanced Rules editor with Test Rules validator
is the closest genre precedent and matches the catalog-as-data
approach exactly.

IP-safety surface contained in one bounded context per GD-0015 +
ADR-0007. `risk:legal` label set.
