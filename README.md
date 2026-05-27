# football-manager-x

Docs-vault-only repository for an offline-ready football manager PWA concept in
the style of the classic Anstoß series.

> **Reset 2026-05-27.** The prior implementation was removed. The `docs/`
> Obsidian vault is the single source of truth and design memory. See
> `AGENTS.md` and `docs/00-Index/Home.md` for the entry points.

## Quick start

```bash
pnpm docs:check     # validate the vault (frontmatter, wikilinks, no secrets)
pnpm docs:preview   # build + serve the Quartz docs site locally
```

See `AGENTS.md` for agent orchestration and `docs/00-Index/Home.md` for the
Obsidian Vault entry point.

## Docs vault preview

Open `docs/` as a vault in the Obsidian app, or preview it in a browser
(no Obsidian required):

```bash
pnpm docs:preview   # http://localhost:8080
```

See `docs/90-Meta/obsidian-config.md` for vault details.
