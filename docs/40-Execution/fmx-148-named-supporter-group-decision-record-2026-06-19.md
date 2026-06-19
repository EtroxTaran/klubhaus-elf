---
title: FMX-148 Named Supporter Group Decision Record
status: current
tags: [execution, decision-record, fmx-148, audience, atmosphere, supporter-groups, privacy, dsa, naming, accepted]
created: 2026-06-19
updated: 2026-06-19
type: decision-record
binding: false
linear: FMX-148
related:
  - [[../60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
  - [[../60-Research/raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]
  - [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
  - [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
  - [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]]
---

# FMX-148 Named Supporter Group Decision Record

## Context

ADR-0062 accepted Audience & Atmosphere as its own bounded context, but kept
`NamedSupporterGroup`, `OnboardNamedSupporterGroup`,
`NamedSupporterGroupOnboarded` and `NamedSupporterGroupRoster` behind the FMX-54
persona-privacy/naming gate. FMX-54 produced research and planning direction;
FMX-148 records the binding product/architecture choices needed to fold that
detail into ADR-0062.

## Decisions Recorded

| ID | Question | Options considered | Nico decision |
|---|---|---|---|
| D1 | Should `NamedSupporterGroup` ship enabled, remain default-off or stay stubbed? | Default-on; opt-in/default-off; continue stub. | **Opt-in/default-off.** The surface is specified now, but not enabled by default in MVP. |
| D2 | Is People/Person a hard blocker? | Hard blocker; not blocker via opaque refs; A&A owns local rep. | **Not a blocker via opaque refs.** People owns person/persona truth; A&A owns group facts. |
| D3 | What is the Legal/UGC scope? | Fictional local/P2P; DSA-ready MVP seam; hosted MVP. | **Fictional local/P2P.** Hosted pack distribution remains future-scope until DSA/privacy/moderation gates exist. |

## Accepted Contract

- `NamedSupporterGroup` is no longer an undefined stub. It is an opt-in,
  default-off fictional group overlay attached to Audience & Atmosphere
  supporter segments.
- A&A stores group facts and segment effects only. Any named representative is
  an optional opaque People actor/persona ref.
- Shipped/generated groups and reps are fictional. No real supporter group,
  real person, handle, photo, membership list, account profile, special-category
  label or real-world political/religious/ethnic/health/sexuality attribute is
  stored in A&A.
- `OnboardNamedSupporterGroup`, `NamedSupporterGroupOnboarded` and
  `NamedSupporterGroupRoster` may exist only behind explicit save/scenario setup
  or local overlay import. They are not default-on MVP flows.
- Community Overlay remains local/P2P for MVP. Hosted distribution needs a
  future DSA Article 16 notice/action, moderation, appeal, revocation, DSAR and
  legal-review packet before activation.
- ADR-0007/GD-0015 naming safety extends to supporter groups, reps,
  chants/slogans, banners and local overlay names.

## Evidence

- Synthesis:
  [[../60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
- Raw Perplexity:
  [[../60-Research/raw-perplexity/raw-fmx-148-legal-privacy-ugc-2026-06-19]],
  [[../60-Research/raw-perplexity/raw-fmx-148-supporter-representation-2026-06-19]],
  [[../60-Research/raw-perplexity/raw-fmx-148-game-precedents-naming-2026-06-19]]
- Source checks:
  [[../60-Research/raw-perplexity/raw-fmx-148-source-checks-2026-06-19]]

## Follow-up

- Exact similarity thresholds, denylist content and sample-review cadence stay
  implementation/calibration follow-ups.
- Hosted community-pack distribution requires a separate decision packet and
  legal sign-off.
- If People implementation scope changes later, A&A continues to consume only
  opaque refs unless a future ADR says otherwise.

## Related

- [[../60-Research/named-supporter-group-consent-dsa-naming-2026-06-19]]
- [[../10-Architecture/09-Decisions/ADR-0062-audience-and-atmosphere-context]]
- [[../10-Architecture/09-Decisions/ADR-0052-people-persona-and-skills-context]]
- [[../60-Research/fan-persona-privacy-and-naming-2026-06-01]]
