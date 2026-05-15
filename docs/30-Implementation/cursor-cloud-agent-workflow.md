---
title: Cursor Cloud Agent Workflow
status: draft
tags: [meta, implementation]
updated: 2026-05-15
---

# Cursor Cloud Agent Workflow

1. Create or update a plan in `.cursor/plans/`.
2. Check file exclusivity, interface stability, and config exclusivity.
3. Use serial work for schema/config contracts; fan out only independent beats.
4. Commit, push, and create a draft PR before testing; update the PR after fixes.
5. Keep Vault docs and code changes in the same PR.
