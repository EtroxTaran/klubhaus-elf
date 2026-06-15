---
title: "Raw - breach notification runbook (FMX-183)"
status: raw
tags: [research, raw, perplexity, gdpr, privacy, incident-response, breach-notification, bfdi, security, live-service, fmx-183]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-183
related:
  - [[../breach-notification-runbook-2026-06-15]]
  - [[raw-breach-notification-runbook-source-checks-2026-06-15]]
  - [[../../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
  - [[../../30-Implementation/incident-response]]
  - [[../../30-Implementation/privacy-and-consent]]
  - [[../../30-Implementation/secrets-management]]
---

# Raw - breach notification runbook (FMX-183)

## Research prompt

Perplexity was asked on 2026-06-15:

> Research the current best-practice operational playbook for GDPR
> personal-data breach notification for a small Germany-based online game/PWA.
> Focus on: Art. 33 72-hour trigger and required content, Art. 34 user
> communication trigger/content, Germany/BfDI or lead supervisory authority
> routing, phased notification when facts are incomplete, severity mapping for
> live-service incidents (auth compromise, payment processor incident, support
> export leak, analytics/token leak), escalation/RACI, drill cadence, and
> examples from other live-service games or SaaS incident communications.
> Provide concise recommendations plus source URLs.

## Source-quality note

Perplexity was used as the discovery pass. The canonical FMX synthesis does not
treat law-firm, vendor or generic SaaS incident-response sources as binding.
FMX-183 then ran targeted source checks against GDPR Art. 33/34 text, EDPB
breach-notification guidance/routing, the BfDI Lucom form and existing FMX
privacy/secrets runbooks. Those checks are preserved in
[[raw-breach-notification-runbook-source-checks-2026-06-15]].

## Extracted Perplexity findings

- Art. 33 supervisory-authority notification should be treated as a scripted
  72-hour workflow after the controller becomes aware of a personal-data
  breach. The note must preserve the `T0` awareness timestamp separately from
  detection time.
- Art. 33 notification content should cover the breach nature, categories and
  approximate numbers of data subjects/records, contact point, likely
  consequences and measures taken/proposed.
- Art. 33(4) phased notification is the safe model when facts remain incomplete
  near the deadline: file an initial notification with known facts, then update
  without undue delay.
- Art. 33(5) means every personal-data breach assessment needs an internal
  record, including the no-notify rationale.
- Art. 34 user communication is separate and only required when the breach is
  likely to create high risk for users, but the communication must be clear,
  plain and actionable.
- For a Germany-based controller, the competent German supervisory authority
  depends on main establishment and cross-border posture. EDPB's DPA routing
  page is the operational lookup point; the current Germany row includes the
  BfDI form as one route and multiple German state authority routes.
- Conservative small-team handling should page the Privacy Lead as soon as
  real user personal data could be involved in a SEV1/SEV2 security incident,
  vendor processor incident, support-export exposure or auth/token compromise.
- If risk is plausible and facts are incomplete by the midpoint of the
  72-hour window, the playbook should prepare a partial authority notification
  rather than waiting for forensic certainty.

## Live-service scenarios surfaced

| Scenario | Perplexity risk posture | FMX-183 synthesis handling |
|---|---|---|
| Auth database or token compromise | Usually Art. 33; Art. 34 when account takeover, password reuse, session hijack or payment/chat exposure creates high risk. | SEV1/SEV2 privacy escalation, token/session invalidation and default Art. 33 preparation unless risk is clearly unlikely. |
| Payment processor incident | Processor notice must be triaged quickly; financial metadata usually raises risk and often high risk. | Treat as Privacy Lead + counsel escalation; coordinate user comms with processor but keep FMX controller obligations tracked. |
| Support export/ticket leak | Small, contained mis-send can be no-notify with documented rationale; public/uncontrolled export is likely Art. 33 and often Art. 34. | Map support-export public exposure to SEV2/SEV1 depending on volume/sensitivity; require access-log and deletion evidence before downgrade. |
| Analytics/log/token leak | Public analytics IDs alone are usually not a personal-data breach; user-tied logs or reusable tokens can be. | Require `personal_data_involved` triage in first 15 minutes and invalidate exposed reusable tokens. |

## Real-world and game-product analogs surfaced

- Live-service games and SaaS products should not rely on vague public
  statements for legal notification. The authority notification and user
  notification are separate artifacts with different thresholds.
- Good player-facing incident communication is short, plain, concrete and
  action-oriented: what happened, what data was involved, what the studio did,
  what the player should do, how to contact support/privacy.
- A game can use product-native channels, such as in-app inbox, status page,
  community post and email, but legally relevant Art. 34 communication should
  reach affected users directly when feasible.
- Incident drills should include the actual form fields and user copy, not
  only technical containment steps.

These analogs support product and runbook recommendations, not legal authority.

## Perplexity recommendations surfaced

| Decision area | Perplexity recommendation | FMX-183 handling |
|---|---|---|
| Runbook home | Put the operational drill in incident-response, leaving privacy-and-consent as the legal decision tree/template source. | Adopted as D1 recommendation. |
| DPA routing | Use Germany/BfDI route for current FMX posture but verify competent authority at entity setup and incident time. | Adopted as D2 recommendation. |
| Severity mapping | Use conservative SEV1/SEV2 privacy escalation and presume Art. 33 preparation unless unlikely-risk rationale is documented. | Adopted as D3 recommendation. |
| User communication | Use direct email plus in-app/status support for high-risk/player-action incidents. | Adopted as D4 recommendation. |
| Drill cadence | Run a full annual drill and more frequent contact/link checks or tabletop refreshes. | Adopted as D5 recommendation with annual drill plus semiannual link/contact check. |

## Perplexity citations surfaced

- EDPB DPA notification routing:
  <https://www.edpb.europa.eu/notify-data-breach_en>
- GDPR Art. 33 text mirror:
  <https://gdpr-info.eu/art-33-gdpr/>
- GDPR Art. 34 text mirror:
  <https://gdpr-info.eu/art-34-gdpr/>
- EDPB Guidelines 9/2022 on personal data breach notification:
  <https://www.edpb.europa.eu/system/files/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf>
- Generic German legal-practitioner and compliance articles were surfaced but
  only used as discovery, not canon.

## Related

- [[../breach-notification-runbook-2026-06-15]]
- [[raw-breach-notification-runbook-source-checks-2026-06-15]]
- [[../../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
