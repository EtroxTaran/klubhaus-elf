# soccer-manager

Offline-first football manager PWA in the style of the classic Anstoß series.

> **Docs-vault-only repository (reset 2026-05-27).** The prior implementation
> (app, packages, match engine, Storybook showcase, toolchain) was removed; this
> repo now holds only the `docs/` Obsidian vault — the design memory the game is
> rebuilt from. See `AGENTS.md` for the full context.

## Quick start

```bash
pnpm docs:check     # validate the vault (frontmatter, wikilinks, no secrets)
pnpm docs:preview   # build + serve the Quartz docs site locally
```

See `AGENTS.md` for agent rules and `docs/00-Index/Home.md` for the Obsidian
Vault entry point.

## Docs vault preview

Open `docs/` as a vault in the Obsidian app, or preview it in a browser
(no Obsidian required):

```bash
pnpm docs:preview   # http://localhost:8080
```

## UI showcase (Storybook)

```bash
pnpm storybook      # http://localhost:6006
```

See `docs/90-Meta/obsidian-config.md` for vault details.
