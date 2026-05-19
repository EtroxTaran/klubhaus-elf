---
title: Feature Gap Analysis - MoSCoW Scope
status: in-review
tags: [research, feature, moscow, scope]
created: 2026-05-15
updated: 2026-05-18
type: research
binding: false
related: [[competitor-matrix]], [[feature-library-synthesis]], [[anstoss-series-deep-dive]], [[player-strength-presentation]], [[offline-mvp-scope-and-sync-strategy]], [[../00-Index/MVP-Scope]], [[../00-Index/Feature-Map]]
---

# Feature Gap Analysis - MoSCoW Scope

This note classifies every signature feature from
[[feature-library-synthesis]] into MoSCoW buckets (Must / Should / Could /
Won't for MVP). It feeds the seed epics M2-M8 and the
[[../00-Index/Feature-Map]].

> Wave 1 left this note as a 3-line stub. Wave 2 (2026-05-16) populates it
> based on the consolidated competitor inventory and the systems-design
> synthesis.

## 1. Must (MVP - first playable)

Anything required to demonstrate the core product hypothesis: hybrid-online,
offline-ready, mobile-friendly fictional-universe manager with a sharp
Create-a-Club Roguelite loop.

| Feature | Source pattern | Linked design note |
|---|---|---|
| 7-pillar club simulation (Identity / Economy / Infra / Fans / Sport / Tactics / Time) | All competitors | [[systems-design-synthesis]] |
| 1-20 player attributes + Impact Lens presentation (mobile-readable without global OVR) | FM scale + mobile UI convention, corrected by D2 and Impact Lens | [[../50-Game-Design/squad-and-club-structure]], [[player-strength-presentation]] |
| Weekly heartbeat with 7-day ticks + match tick | Anstoss day-by-day, FM weekly model | [[../50-Game-Design/core-loop]] |
| 2D event-based match engine + text ticker | FM 2D, Anstoss text | [[../50-Game-Design/match-engine]] |
| Tactics: Position + Role + Duty + basic instructions | FM tactics core | [[../50-Game-Design/tactics-system]] |
| Basic scouting (regional scouts + shortlist) | FM scouting basics | [[../50-Game-Design/scouting-and-recruitment]] |
| Minimal stadium capacity / run-cost feedback | Anstoss 3 attractions | [[../50-Game-Design/stadium-and-campus]] |
| Two-layer finance (operating P&L + investment budget) | Anstoss / EA FM split | [[../50-Game-Design/economy-system]] |
| Sponsor and fan signals as first-run feedback | EA FM / FM Supporter Profile | [[../50-Game-Design/sponsorship-portfolio]], [[../50-Game-Design/fan-ecology]] |
| Run-risk / club control pressure | Roguelite death spiral | [[../50-Game-Design/mode-create-a-club-roguelite]] |
| Create-a-Club Roguelite (permadeath + soft carries) | Our differentiator | [[../50-Game-Design/mode-create-a-club-roguelite]] |
| Roguelite first playable feature slice | MVP scope | [[../20-Features/feature-roguelite-mvp-first-playable]] |
| Singleplayer baseline contracts | Genre standard | [[../50-Game-Design/singleplayer-baseline]] |
| Hybrid-online PWA shell + local drafts/caches | MVP scope | [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] |
| Fictional-universe naming + procedural players | Our IP-clean baseline | [[../10-Architecture/09-Decisions/ADR-0007-naming-schema]] |
| Inbox-as-feed for board / sponsor / scout events | Anstoss letters / FM news | [[../50-Game-Design/core-loop]] |
| Halftime modal (3 controls: formation / mentality / 1-tap sub) | Mobile FM Touch | [[../50-Game-Design/match-engine]] |
| 3-tier UI: Quick / Standard / Expert (Progressive Disclosure) | Our differentiator | [[../50-Game-Design/progressive-disclosure-ui]] |

## 2. Should (Phase 2 - depth pass)

Second-wave features that distinguish a depth product from a casual one.

| Feature | Source pattern | Linked design note |
|---|---|---|
| Full selective offline-first singleplayer | Future product promise | [[offline-mvp-scope-and-sync-strategy]], [[../10-Architecture/09-Decisions/ADR-0020-hybrid-online-mvp-offline-ready]] |
| Save export/import with version migrations | User-owned saves | [[../10-Architecture/09-Decisions/ADR-0005-save-format]] |
| Manage-a-Club Career (Anstoss 2 "real manager career") | Anstoss 2 | [[../50-Game-Design/mode-manage-a-club-career]] |
| Board + Supporter Confidence split | FM | [[../50-Game-Design/mode-manage-a-club-career]] |
| Full 20 visible + 8 hidden meta attribute model | FM-style depth, simplified by D2 | [[../50-Game-Design/squad-and-club-structure]], [[data-generators]] |
| Tactical familiarity over time | FM | [[../50-Game-Design/tactics-system]] |
| Set-piece sub-system (corners / free kicks / penalties / throw-ins) | FM24+ set-piece coach | [[../50-Game-Design/set-pieces]] |
| Youth academy with intake pipeline + loan environment | FM youth | [[../50-Game-Design/youth-academy-and-development]] |
| Training blocks (8 blocks) + load model | FM training | [[../50-Game-Design/training-load-and-medicine]] |
| Medical / sport-science centre | FM medical | [[../50-Game-Design/training-load-and-medicine]] |
| Async multiplayer private group (Fixed Cadence default) | SOKKA, ManagerZone, FM Online | [[../50-Game-Design/async-multiplayer-private-group]] |
| Manager talent tree | Anstoss 2022, Soccer Manager 2026 | [[../50-Game-Design/mode-manage-a-club-career]] |
| Promotion compliance gating (stadium / safety / hospitality) | FA Ground Grading | [[../50-Game-Design/regulations-and-compliance]] |
| Rivalry system (5-sub-score emergent) | Our differentiator | [[../50-Game-Design/rivalry-system]] |
| Match-day event engine (weather, infra, catering, medical) | Our differentiator | [[../50-Game-Design/matchday-event-engine]] |

## 3. Could (Phase 3 - social + content layers)

Nice-to-haves that lift the product but aren't required for the MVP loop.

| Feature | Source pattern | Linked design note |
|---|---|---|
| Dynamic Cadence async (quorum + countdown) | Our differentiator | [[../50-Game-Design/async-multiplayer-private-group]] |
| Watch parties for human-vs-human + finals | Our differentiator | [[../50-Game-Design/watch-party-and-conference]] |
| Conference mode for relegation match-days | Our differentiator | [[../50-Game-Design/watch-party-and-conference]] |
| Player-to-player transfer negotiation with escalation | Our differentiator | [[../50-Game-Design/transfer-negotiations-p2p]] |
| Community editor (override packs + manifests) | Anstoss editor + modding best practice | [[../50-Game-Design/community-editor-and-datasets]] |
| Stadium attractions sub-economy (Anstoss-3 buildings catalogue) | Anstoss 3 | [[../50-Game-Design/stadium-and-campus]] |
| Career arc toward national-team coach | Anstoss "Bundestrainer" | [[../50-Game-Design/mode-manage-a-club-career]] |
| Press conferences (100+ keyed responses) | Anstoss, FM | TBD post-MVP |
| Capacitor packaging for iOS + Android stores | Our roadmap | [[../10-Architecture/09-Decisions/ADR-0008-mobile-first-ui]] |
| Sanction service (chain of penalties) | UEFA / DFB references | [[../50-Game-Design/matchday-event-engine]] |

## 4. Won't (out of scope for the foreseeable future)

| Feature | Rationale |
|---|---|
| Real player / club / league licences | ADR-0007: full fictionalisation |
| Real-time PvP match-day | Async + watch parties cover the social spike without RT pressure |
| Free-to-play with pay-to-win currency | [[club-boss-analysis]] + competitor risk picture |
| Open MMO (single persistent world) | We commit to private friend groups only |
| Doping / "schwarze Kasse" / Babe of the Month (Anstoss flavour) | [[anstoss-series-deep-dive]] §6 IP / ethics boundaries |
| Public real-tournament data feeds | Out of legal scope; community editor handles user wishes |
| 3D match view | Permanent product decision (gap D9, 2026-05-17). Match render is Text & Stats (Floor tier default) + 2D canvas (Standard / Premium default). See [[performance-budgets]] §6. |

## 5. Open scope questions (not yet classified)

- Women's football competitions - data model must support, but MVP scope TBD.
- Press conferences - depth TBD post-MVP.
- Football Fusion-style export (EA FM 04 cross-over) - clearly out for MVP;
  re-evaluate after Phase 4.
- Save-state import/export with version migration - Phase 2; contract reserved
  from MVP.
- League editor (vs club / player editor only) - decision pending; affects
  [[../50-Game-Design/community-editor-and-datasets]].
