---
title: "Raw source checks - breach notification runbook (FMX-183)"
status: raw
tags: [research, raw, source-check, gdpr, privacy, incident-response, breach-notification, bfdi, edpb, fmx-183]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-183
related:
  - [[../breach-notification-runbook-2026-06-15]]
  - [[raw-breach-notification-runbook-2026-06-15]]
  - [[../../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
  - [[../../30-Implementation/incident-response]]
  - [[../../30-Implementation/privacy-and-consent]]
---

# Raw source checks - breach notification runbook (FMX-183)

## Checked sources

| Source | URL | Checked finding | Canon use |
|---|---|---|---|
| GDPR Art. 33 text mirror | <https://gdpr-info.eu/art-33-gdpr/> | Authority notification is due without undue delay and, where feasible, within 72 hours after awareness unless unlikely to create risk; notification content includes breach nature, affected categories/counts, contact, consequences and measures; phased updates and breach documentation are explicit. | Canon for checklist wording; final legal review can cross-check EUR-Lex if counsel needs official citation format. |
| GDPR Art. 34 text mirror | <https://gdpr-info.eu/art-34-gdpr/> | User communication applies when high risk is likely; content must be clear and plain and include breach nature, contact, consequences and measures; exceptions include strong protection or later risk elimination. | Canon for user-notification trigger and content handoff to [[../../30-Implementation/privacy-and-consent]] §9. |
| EDPB DPA notification routing | <https://www.edpb.europa.eu/notify-data-breach_en> | EDPB says breaches should be notified to the relevant DPA unless unlikely to present risk; Germany section lists BfDI and multiple German state authorities. The BfDI row links to the Lucom form. | Canon routing lookup; runbook must say re-verify competent authority at incident time. |
| BfDI Lucom form | <https://formulare.bfdi.bund.de/lip/action/invoke.do?id=BfDIDSverstoesse> | The page resolves to a BfDI Lucom Interaction Platform form surface and requires browser session cookies/JavaScript. | Canon operational URL for current BfDI form bookmark. |
| EDPB Guidelines 9/2022 | <https://www.edpb.europa.eu/system/files/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf> | EDPB treats controller awareness as reasonable certainty that a security incident led to personal data compromise. It also supports prompt investigation followed by fuller investigation and phased updates. | Canon for `T0` awareness trigger and phased notification guardrail. |
| FMX privacy-and-consent | [[../../30-Implementation/privacy-and-consent]] | §9 already owns the binding Art. 33/34 decision tree and user-notification template; FU-7 asks to wire the BfDI link into incident-response. | Canon legal decision tree and template source. |
| FMX secrets-management | [[../../30-Implementation/secrets-management]] | §9.3 already references a one-hour response playbook and GDPR Art. 33/34 notification timing for secret leaks. | Canon incident severity/secret-leak integration point. |

## Source conflicts and weak citations

- Perplexity surfaced law-firm and compliance-vendor material. Those are useful
  for examples but not used as authority where GDPR/EDPB/BfDI sources are
  available.
- EDPB routing explicitly says national authority information is provided by
  the national supervisory authorities and questions should be directed to the
  supervisory authority. FMX therefore treats the EDPB page as a routing index,
  not as legal advice.
- The BfDI Lucom form requires JavaScript/session cookies, so the runbook must
  preserve the URL and require the Privacy Lead to verify live accessibility
  during drills and incidents.

## Canonical facts for FMX-183

- `T0` for the 72-hour timer is not alert ingestion; it is when the controller
  has reasonable certainty that a security incident caused personal-data
  compromise.
- A partial Art. 33 notification is preferable to a late perfect notification
  when required facts are not complete by the deadline.
- A no-notification decision still needs an internal breach assessment record.
- The current operational bookmark for a BfDI notification is:
  <https://formulare.bfdi.bund.de/lip/action/invoke.do?id=BfDIDSverstoesse>
- Competent-authority routing is a live check at company formation and incident
  time, because German state authority jurisdiction can matter for a German
  private company.

## Related

- [[../breach-notification-runbook-2026-06-15]]
- [[raw-breach-notification-runbook-2026-06-15]]
- [[../../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
