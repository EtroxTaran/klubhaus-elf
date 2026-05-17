---
title: Dokploy Deployment
status: draft
tags: [deployment, implementation]
created: 2026-05-15
updated: 2026-05-17
type: implementation
related: [[../10-Architecture/07-Deployment]], [[secrets-rotation]], [[surrealdb-integration]], [[ci-and-review-process]]
---

# Dokploy Deployment

## Target apps

- `soccer-manager-dev`: branch `develop`, domain `dev.soccer-manager.etrox.de`
- `soccer-manager-prod`: branch `main`, domain `soccer-manager.etrox.de`

## Required Nico-provided access

- Dokploy URL and account/API access.
- DNS status for `*.etrox.de`.
- GitHub App/webhook permissions.
- Staging-only environment variables.

## Health check

Use `/healthz` on the app container.

## Related

- [[../10-Architecture/07-Deployment]] — arc42 deployment view this realizes
- [[secrets-rotation]] — credential policy · [[surrealdb-integration]] — DB in compose
- [[ci-and-review-process]] — green gate before deploy
