---
title: Deployment
status: draft
tags: [architecture, deployment]
created: 2026-05-15
updated: 2026-05-17
type: arch
related: [[06-Runtime]], [[../30-Implementation/deployment-dokploy]], [[../30-Implementation/secrets-rotation]], [[../30-Implementation/ci-and-review-process]]
---

# Deployment

Dokploy runs Docker Compose on Hetzner:

- `develop` -> `dev.soccer-manager.etrox.de`
- `main` -> `soccer-manager.etrox.de`

Details: [[../30-Implementation/deployment-dokploy]]

## Related

- [[../30-Implementation/deployment-dokploy]] — deployment runbook · [[../30-Implementation/secrets-rotation]] — credential handling
- [[../30-Implementation/ci-and-review-process]] — green-gate before deploy
- [[06-Runtime]] — arc42 sibling
