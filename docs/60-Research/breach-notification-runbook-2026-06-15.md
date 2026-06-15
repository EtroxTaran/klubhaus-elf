---
title: "Breach notification runbook research (FMX-183)"
status: current
tags: [research, synthesis, gdpr, privacy, incident-response, breach-notification, bfdi, security, live-service, fmx-183]
created: 2026-06-15
updated: 2026-06-15
type: research
binding: false
linear: FMX-183
related:
  - [[raw-perplexity/raw-breach-notification-runbook-2026-06-15]]
  - [[raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]]
  - [[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
  - [[../30-Implementation/incident-response]]
  - [[../30-Implementation/privacy-and-consent]]
  - [[../30-Implementation/secrets-management]]
  - [[gdpr-compliance]]
---

# Breach notification runbook research (FMX-183)

## Scope

FMX-183 wires the operational GDPR breach-notification drill into
[[../30-Implementation/incident-response]] while keeping
[[../30-Implementation/privacy-and-consent]] §9 as the binding source for the
legal Art. 33/34 decision tree and user-notification template.

This packet is intentionally non-binding for architecture/governance decisions.
It recommends a small-team operational default and records the Nico decision
queue in
[[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]].

## Source-backed findings

### The 72-hour clock needs an explicit `T0`

EDPB Guidelines 9/2022 define controller awareness as a reasonable degree of
certainty that a security incident led to personal data compromise. For FMX,
the incident timeline therefore needs two separate timestamps:

- detection or alert ingestion;
- GDPR `T0`, when Privacy Lead or delegate reaches reasonable certainty that a
  personal-data breach occurred.

The first 15 minutes of incident response should set
`personal_data_involved = no | unknown | yes`; `unknown` should page the
Privacy Lead for SEV1/SEV2 security incidents instead of waiting for full
forensics.

### Partial notification is the safe default near the deadline

GDPR Art. 33 allows phased notification when all required information cannot be
provided at the same time. For FMX, if Art. 33 looks likely and material facts
remain incomplete by the midpoint of the 72-hour window, the playbook should
prepare a partial authority notification with current facts and documented
uncertainties.

The operational checkpoints are:

- `T+24h`: risk classification and draft authority notice;
- `T+48h`: partial-notification decision, counsel/privacy review if ambiguous;
- `T+70h`: file or document no-notify rationale, leaving a two-hour buffer.

### Authority routing is a live check, not a hard-coded legal conclusion

EDPB's current breach-notification routing page lists Germany's BfDI row and
links to the BfDI Lucom form, while also listing German state authority routes.
FMX can bookmark the BfDI form because the existing
[[gdpr-compliance]] posture names BfDI as the current lead route, but the
runbook must require the Privacy Lead to re-check competent authority during
company formation, entity/address changes and each live incident.

### Player communication should be legal plus game-native

Art. 34 user communication is triggered by likely high risk and is separate
from Art. 33 authority notification. FMX already has the DE/EN user template in
[[../30-Implementation/privacy-and-consent]] §9.4.

Game/live-service best practice adds channel selection:

- direct email is the default for affected users where contact data exists;
- in-app inbox/status page/community post can support discoverability;
- high-risk auth/payment incidents should include concrete player actions such
  as password reset, session review, phishing caution and payment-card checks;
- no legally material facts should exist only in a transient push/social post.

## Recommended operational model

| Area | Recommendation | Why |
|---|---|---|
| Operational home | Keep the legal tree/template in [[../30-Implementation/privacy-and-consent]] §9; put the 72-hour drill, BfDI link, RACI, severity mapping and checkpoints in [[../30-Implementation/incident-response]]. | Avoids duplicating legal truth while making incident commanders operationally effective. |
| Authority route | Bookmark the current BfDI Lucom form, but require live EDPB/DPA route verification at entity setup, drills and incidents. | EDPB lists multiple German authorities; company establishment can change competent authority. |
| Severity mapping | SEV1/SEV2 incidents with possible real user personal data page the Privacy Lead immediately and prepare Art. 33 unless risk is clearly unlikely. | Conservative and accountable without notifying every benign internal event. |
| User communication | Use the §9.4 DE/EN template by email for Art. 34, supported by in-app/status/community updates for high-impact live-service incidents. | Direct notice satisfies the affected-user need; game-native channels help player action and trust. |
| Drill cadence | Annual full breach-notification drill plus semiannual BfDI/authority link and contact check. | Keeps the form, roles and templates current without overloading a small team. |

## Severity mapping

| Incident pattern | FMX severity | Art. 33 posture | Art. 34 posture |
|---|---|---|---|
| Server/root compromise, personal data likely accessible | SEV1 | Prepare/file unless risk is demonstrably unlikely. | Likely if account takeover, payment, chat/support or broad exposure. |
| Auth DB, password hash, session/refresh token or signing-key exposure | SEV1/SEV2 | Prepare/file unless strong containment proves unlikely risk. | Likely for reusable credentials/tokens or broad account takeover risk. |
| Payment processor breach notice | SEV1/SEV2 | Assess controller/processor role and prepare/file unless risk unlikely. | Often likely high risk if financial abuse/phishing/card-data risk exists. |
| Support export/ticket leak | SEV2/SEV3 | File if uncontrolled, broad, sensitive or externally accessible. | File user notice if exposure is broad, uncontrolled or includes sensitive free text. |
| Analytics/log export with IP/device/user ids | SEV2/SEV3 | Assess; likely if user-tied logs are exposed outside approved processor boundary. | Usually only if account access, sensitive content or high abuse risk follows. |
| Public analytics property id only | SEV4 | No Art. 33; document no personal-data breach. | No Art. 34. |

## Decision needed from Nico

See
[[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
for D1-D5 options and recommendations. Until Nico accepts, this packet stays
non-binding and the issue should remain decision-pending.

## Sources

- Raw Perplexity discovery:
  [[raw-perplexity/raw-breach-notification-runbook-2026-06-15]]
- Source checks:
  [[raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]]
- GDPR Art. 33 text mirror:
  <https://gdpr-info.eu/art-33-gdpr/>
- GDPR Art. 34 text mirror:
  <https://gdpr-info.eu/art-34-gdpr/>
- EDPB DPA routing:
  <https://www.edpb.europa.eu/notify-data-breach_en>
- BfDI Lucom form:
  <https://formulare.bfdi.bund.de/lip/action/invoke.do?id=BfDIDSverstoesse>
- EDPB Guidelines 9/2022:
  <https://www.edpb.europa.eu/system/files/2023-04/edpb_guidelines_202209_personal_data_breach_notification_v2.0_en.pdf>

## Related

- [[../30-Implementation/incident-response]]
- [[../30-Implementation/privacy-and-consent]]
- [[../30-Implementation/secrets-management]]
- [[../40-Execution/fmx-183-breach-notification-decision-queue-2026-06-15]]
