---
title: "FMX-183 breach notification decision queue"
status: current
tags: [execution, decision-queue, gdpr, privacy, incident-response, breach-notification, bfdi, fmx-183]
created: 2026-06-15
updated: 2026-06-15
type: execution
binding: false
linear: FMX-183
related:
  - [[../60-Research/breach-notification-runbook-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-breach-notification-runbook-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]]
  - [[../30-Implementation/incident-response]]
  - [[../30-Implementation/privacy-and-consent]]
---

# FMX-183 breach notification decision queue

## Context

FMX-183 closes the operational gap where [[../30-Implementation/privacy-and-consent]]
§9 had a binding Art. 33/34 decision tree and user template, but
[[../30-Implementation/incident-response]] lacked the BfDI form link, 72-hour
drill, severity mapping and escalation path.

The recommendations below are source-backed but not accepted until Nico
decides.

## D1 - Operational home

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Keep [[../30-Implementation/privacy-and-consent]] §9 as legal tree/template; add operational drill to [[../30-Implementation/incident-response]]. | **Yes** | Pending |
| B | Create a new standalone compliance runbook and leave incident-response generic. | No | Pending |
| C | Keep all breach-notification detail only in privacy-and-consent. | No | Pending |

Recommended: **A**.

## D2 - Supervisory authority routing

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Bookmark the current BfDI form, but require live EDPB/DPA route verification at entity setup, drills and incidents. | **Yes** | Pending |
| B | Hard-code BfDI as final authority route with no state-authority fallback. | No | Pending |
| C | Never name a route in the runbook; require external counsel before every authority lookup. | No | Pending |

Recommended: **A**.

## D3 - Severity-to-notification policy

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | SEV1/SEV2 incidents with possible user personal data page Privacy Lead immediately and prepare Art. 33 unless unlikely-risk rationale is documented. | **Yes** | Pending |
| B | Decide purely case-by-case with no severity defaults. | No | Pending |
| C | Notify every incident that touches any personal data, regardless of risk. | No | Pending |

Recommended: **A**.

## D4 - Player communication channels

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Use direct email for Art. 34, supported by in-app inbox/status/community updates for high-impact incidents. | **Yes** | Pending |
| B | Email only; no game-native or public support surface. | No | Pending |
| C | Public status/community post only unless email is legally forced by counsel. | No | Pending |

Recommended: **A**.

## D5 - Drill cadence

| Option | Description | Recommendation | Nico decision |
|---|---|---|---|
| **A** | Annual full breach-notification drill plus semiannual BfDI/authority link and contact check. | **Yes** | Pending |
| B | Annual drill only. | No | Pending |
| C | Quarterly full drills. | No | Pending |

Recommended: **A**.

## Recommended package if Nico accepts all

Approve **D1-D5 = A/A/A/A/A**.

Applied follow-up after approval:

- Treat [[../30-Implementation/incident-response]] as the operational home for
  the GDPR breach-notification drill.
- Keep [[../30-Implementation/privacy-and-consent]] §9 as the legal
  decision-tree/template source.
- Promote front-door wording from decision-pending to accepted/current.
- Re-evaluate competent authority at company formation and during each drill.

## Related

- [[../60-Research/breach-notification-runbook-2026-06-15]]
- [[../30-Implementation/incident-response]]
- [[../30-Implementation/privacy-and-consent]]
