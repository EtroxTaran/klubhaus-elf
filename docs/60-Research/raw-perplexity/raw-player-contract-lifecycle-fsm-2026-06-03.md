---
title: "RAW — Player contract lifecycle FSM, Bosman and free-agent path"
status: raw
tags: [research, raw, perplexity, transfer, contracts, squad, regulations, fmx-81]
created: 2026-06-03
updated: 2026-06-03
type: research
related: [[../player-contract-lifecycle-fsm-2026-06-03]], [[../../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]], [[../../10-Architecture/state-machines/player-contract-lifecycle]]
---

# RAW Perplexity capture — Player contract lifecycle FSM (FMX-81)

> Unprocessed research capture and source notes. Synthesised into
> [[../player-contract-lifecycle-fsm-2026-06-03]]. Do not implement from raw.
> Captured 2026-06-03 (Sonar + targeted source checks). Perplexity citations are
> model-provided and were cross-checked only where promoted into the synthesis.

## Prompt 1 — Real-world rules

System: senior football regulations researcher; prefer official FIFA/FA/federation
sources, then reputable legal analysis; cite concrete URLs; keep quotes short.

User: research current football player contract expiry, pre-contract/Bosman-style
agreements, free-agent registration timing, and work-permit/GBE interplay for a
football manager game design/architecture spec. Focus on FIFA RSTP Article 18
style six-month rule, registration windows, free agents whose contracts expired
before window close, and UK GBE as a concrete top-5 example. Provide concise
findings, URLs, and caveats for 2025-2026 sources.

## Captured answer 1 — Summary

- Perplexity identified the core modelling split as:
  1. when a player may sign or pre-sign a contract;
  2. when a player may be registered for competition;
  3. whether the target jurisdiction grants work permission / GBE.
- It cited the FIFA RSTP Article 18 six-month contract-expiry principle and
  Article 6 registration-period principle. The raw answer stressed that signing
  and registration are separate acts.
- It recommended modelling association-level overrides for:
  - pre-contract approach window, defaulting to six months;
  - out-of-window registration for pre-existing free agents;
  - work-permit / GBE threshold and exception-panel logic;
  - domestic stricter rules.
- It recommended a data profile rather than hard-coded global FIFA behaviour:
  `preContractWindowMonths`, `domesticPreContractWindowMonths`,
  `freeAgentRegistrationPolicy`, `workPermitProfile`, and `ruleSetVersion`.

## Targeted official-source checks

- FIFA Legal Handbook 2025 page:
  <https://inside.fifa.com/legal/news/legal-handbook-2025-edition-published>
  states the 2025 Legal Handbook contains the up-to-date versions of key FIFA
  regulations, including the Regulations on the Status and Transfer of Players.
- FIFA RSTP commentary PDF hosted by The FA:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/registrations/commentary-on-the-fifa-regulations-on-the-status-and-transfer-of-players-edition-2021.ashx>
  was used for registration-period and Article 18 source checks.
- The FA men's players GBE criteria PDF for 2025/26:
  <https://www.thefa.com/-/media/files/thefaportal/governance-docs/registrations/gbe-2025-26/fa-mens-players-gbe-criteria-202526.ashx>
  was used as the England-like work-permit anchor. The document says the
  2025/26 criteria are effective from 1 June 2025 and will be reviewed before
  the summer transfer window in 2026; re-check before ratifying exact profile
  data.

## Prompt 2 — Genre / game analysis

System: senior football game designer comparing management games; cite concrete
game/version/source references where possible; do not invent unsupported mechanics.

User: compare how Football Manager / FM Mobile, Top Eleven, Soccer Manager,
FIFA Manager / Anstoss-style games handle contract renewal, expiring contracts,
approach-to-sign/Bosman, free agents, expiry warnings, counter-offers and
transfer inbox opportunities. End with best-practice recommendations for a
mobile-first offline-ready Klubhaus Elf MVP that must avoid a thin one-shot
renewal loop.

## Captured answer 2 — Summary

- Football Manager was treated as the high-depth reference:
  - contracts are visible in list/report surfaces with expiry sorting;
  - agents can be asked about availability and projected demands;
  - broken contract talks can be revived through agent/player relationship work;
  - pre-contract / end-of-contract targets become important in mid-season.
- FM Mobile and Soccer Manager were described as compressed variants: fewer
  clauses and screens, but still multi-step enough to allow refusals,
  counter-demands, expiry warnings and free-agent lists.
- Top Eleven was useful mostly as a loop/pacing counterexample: high visibility,
  simple renewal prompts and season rollover pressure, but too live-ops/resource
  driven and not realistic enough for FMX's simulation target.
- Anstoss/FIFA Manager-style games were useful for phase-based pacing:
  contract work as a planning phase, clear batch overviews and digestible
  end-of-season / mid-season contract tasks.
- Recommended FMX MVP shape:
  - a Contracts Hub with expiry/state sorting;
  - smart warnings at season start, mid-season and pre-contract opening;
  - multi-touch renewal: intent -> negotiation -> cooling-off / follow-up;
  - compact mobile negotiation controls: wage, years, role and one key clause;
  - free agents as a curated transfer surface;
  - Bosman opportunities as inbox/feed cards, not hidden list trivia.

## Targeted genre-source checks

- Football Manager 26 official dugout, mid-season transfer tips:
  <https://www.footballmanager.com/the-dugout/10-tips-successful-mid-season-transfer-window-fm26>
  states that expiring contracts are a key mid-season search and that many
  European contracts become pre-contract opportunities in the final six months.
- Football Manager 23 official recruitment revamp:
  <https://www.footballmanager.com/features/recruitment-revamp>
  documents agent availability/demand conversations, contract discussion with
  agents and expiring contracts broken down in player status views.
- GuideToFM signing players:
  <https://www.guidetofm.com/squad/signing-players/>
  documents the four acquisition methods, the "Approach To Sign" path, free
  transfers, end-of-contract agreements, and the England domestic one-month
  caveat in FM's model.

## Prompt 3 — DDD ownership

System: DDD architecture advisor; cite established DDD literature/practice if
possible; be concise and translate findings into bounded-context ownership
guidance.

User: For a football manager modular monolith, analyze DDD ownership for a player
contract lifecycle FSM where Squad & Player owns player base data/contracts,
Transfer owns agent/deal negotiation facts, Regulations owns rule catalog/work
permits/transfer windows, Club Management owns finance ledger, Notification owns
inbox. Should contract renewal/expiry/Bosman lifecycle truth live in Squad &
Player, Transfer, or a separate Contracts context? Provide options, rationale,
recommendation and public contract/event implications.

## Captured answer 3 — Summary

- Perplexity recommended a separate Contracts context as the generic DDD best
  practice for a contract-lifecycle-management domain.
- It also described two acceptable alternatives:
  - Squad & Player as owner when the game wants fewer contexts and contract truth
    is primarily roster/player-state truth.
  - Transfer as owner only in a highly transfer-centric design, with the warning
    that this conflates transient deal negotiation with long-lived obligations.
- Klubhaus Elf-specific handling:
  - the generic "new Contracts context" advice is recorded as a future extraction
    option, not adopted in FMX-81;
  - existing FMX notes already place player contracts inside Squad & Player;
  - Nico selected Squad & Player ownership for this beat;
  - Transfer still owns renewal / pre-contract / free-agent negotiation cases as
    process artifacts and commands Squad & Player to change contract state.

## Research caveats

- Do not copy official legal wording into game data. FMX profile names and rule
  text stay fictional / IP-clean.
- The FA 2025/26 GBE criteria explicitly says revised criteria can be issued
  before the summer 2026 transfer window. Re-check official FA publications before
  making exact top-5 profile constants binding.
- Perplexity's legal citations included some weak/non-official links; only the
  official FIFA/FA/FM/GuideToFM source checks above are promoted in the synthesis.

## Related

- [[../player-contract-lifecycle-fsm-2026-06-03]]
- [[../../10-Architecture/09-Decisions/ADR-0073-player-contract-lifecycle-fsm]]
- [[../../10-Architecture/state-machines/player-contract-lifecycle]]
