---
title: Raw Perplexity - FMX-148 Game Precedents and Naming
status: raw
tags: [research, raw, perplexity, fmx-148, games, supporter-confidence, naming, ip]
created: 2026-06-19
updated: 2026-06-19
type: research
binding: false
linear: FMX-148
sourceType: perplexity
related:
  - [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[raw-fmx-148-source-checks-2026-06-19]]
  - [[../../50-Game-Design/audience-and-atmosphere]]
---

# Raw Perplexity - FMX-148 Game Precedents and Naming

## Prompt

Research how football manager / sports management / strategy games represent
fan groups, atmosphere, supporter mood, named fan representatives, generated
fictional names, UGC/modding, and IP-safe naming. Compare Football Manager,
Anstoss/We Are Football if sourceable, Hattrick, Top Eleven, OOTP/EHM/CK3/Cities
Skylines analogues. Extract best practices and pitfalls for a fictional named
supporter-group feature. Include URLs where available.

## Raw answer capture

Perplexity found Football Manager's public Supporter Confidence feature as the
strongest sourceable comparable-game benchmark. It did not find reliable enough
public sources for Anstoss/We Are Football, Hattrick, Top Eleven, OOTP, EHM,
CK3 or Cities Skylines supporter-group internals in this pass.

Key points returned:

- Football Manager exposes supporter mood as a management surface through
  Supporter Profile and Supporter Confidence.
- The Supporter Profile is split into six categories: Hardcore, Core, Family,
  Fair Weather, Corporate and Casual.
- Supporter Confidence ties fan mood to management areas such as match
  performance, transfer activity, tactics and squad.
- Strong design pattern: represent fan heterogeneity with readable aggregate
  segments rather than simulating every fan.
- Strong design pattern: separate stable identity from volatile mood. Groups
  should have persistent issue domains/red lines while their current sentiment
  changes.
- Potential pitfall: over-personalizing a whole crowd as one character, making
  feedback opaque, copying real supporter names, or treating atmosphere as pure
  RNG instead of downstream effect of identity, form, rivalry and decisions.
- Suggested IP-safe naming approach: data-driven fictional templates, locale
  dictionaries, internal IDs separate from display names, no real ultra group
  names, anthem/chant names, supporter trademarks or local political/hooligan
  branding.

URLs Perplexity named:

- Football Manager Supporter Confidence:
  `https://www.footballmanager.com/features/supporter-confidence`
- A general supporters' group page and a fan-run club-app article were returned
  as background. They are not treated as primary design authority in the
  synthesis.

## Research handling

Only Football Manager's official Supporter Confidence page is used as a strong
game source. Other comparable-game claims remain unsourced/background.

## Related

- [[../named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[raw-fmx-148-source-checks-2026-06-19]]
- [[../../50-Game-Design/audience-and-atmosphere]]
