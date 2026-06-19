---
title: "FMX-183 breach notification decision queue"
status: accepted
tags: [execution, decision-queue, gdpr, privacy, incident-response, breach-notification, bfdi, fmx-183, accepted]
created: 2026-06-15
updated: 2026-06-19
type: decision-queue
binding: true
linear: FMX-183
related:
  - [[../60-Research/breach-notification-runbook-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-breach-notification-runbook-2026-06-15]]
  - [[../60-Research/raw-perplexity/raw-breach-notification-runbook-source-checks-2026-06-15]]
  - [[../30-Implementation/incident-response]]
  - [[../30-Implementation/privacy-and-consent]]
---

# FMX-183 breach notification decision queue

> **APPROVED on 2026-06-19.** Nico approved all recommended options via
> `APPROVE ALL RECOMMENDED`. This note is now the accepted decision
> record; no open Nico decision remains for FMX-183.


## Context

FMX-183 closes the operational gap where [[../30-Implementation/privacy-and-consent]]
§9 had a binding Art. 33/34 decision tree and user template, but
[[../30-Implementation/incident-response]] lacked the BfDI form link, 72-hour
drill, severity mapping and escalation path.

The recommendations below are source-backed but not accepted until Nico
decides.

## D1 - Operational home

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Keep [[../30-Implementation/privacy-and-consent]] §9 as legal tree/template; add operational drill to [[../30-Implementation/incident-response]]. | **Yes** | See approved packet |
| B | Create a new standalone compliance runbook and leave incident-response generic. | No | See approved packet |
| C | Keep all breach-notification detail only in privacy-and-consent. | No | See approved packet |

Recommended: **A**.

## D2 - Supervisory authority routing

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Bookmark the current BfDI form, but require live EDPB/DPA route verification at entity setup, drills and incidents. | **Yes** | See approved packet |
| B | Hard-code BfDI as final authority route with no state-authority fallback. | No | See approved packet |
| C | Never name a route in the runbook; require external counsel before every authority lookup. | No | See approved packet |

Recommended: **A**.

## D3 - Severity-to-notification policy

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | SEV1/SEV2 incidents with possible user personal data page Privacy Lead immediately and prepare Art. 33 unless unlikely-risk rationale is documented. | **Yes** | See approved packet |
| B | Decide purely case-by-case with no severity defaults. | No | See approved packet |
| C | Notify every incident that touches any personal data, regardless of risk. | No | See approved packet |

Recommended: **A**.

## D4 - Player communication channels

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Use direct email for Art. 34, supported by in-app inbox/status/community updates for high-impact incidents. | **Yes** | See approved packet |
| B | Email only; no game-native or public support surface. | No | See approved packet |
| C | Public status/community post only unless email is legally forced by counsel. | No | See approved packet |

Recommended: **A**.

## D5 - Drill cadence

| Option | Description | Recommendation | Nico decision (2026-06-19) |
|---|---|---|---|
| **A** | Annual full breach-notification drill plus semiannual BfDI/authority link and contact check. | **Yes** | See approved packet |
| B | Annual drill only. | No | See approved packet |
| C | Quarterly full drills. | No | See approved packet |

Recommended: **A**.

## Recommended package if Nico accepts all

Approve **D1-D5 = A/A/A/A/A**.

Applied follow-up after approval:

- Treat [[../30-Implementation/incident-response]] as the operational home for
  the GDPR breach-notification drill.
- Keep [[../30-Implementation/privacy-and-consent]] §9 as the legal
  decision-tree/template source.
- Front-door wording is promoted to accepted/current.
- Re-evaluate competent authority at company formation and during each drill.


## Approved Packet

Nico approved all recommended options on 2026-06-19: **D1=A, D2=A, D3=A, D4=A, D5=A**.

No open Nico decision remains for FMX-183.

## Related

- [[../60-Research/breach-notification-runbook-2026-06-15]]
- [[../30-Implementation/incident-response]]
- [[../30-Implementation/privacy-and-consent]]
