# Interactive Design Styleguide (deploy)

Serves the **interactive** Aurelia Premier styleguide (the claude.ai/design export's
handoff) as a standalone static site — separate from the docs wiki. This is the design
system, not our app; Quartz/`tools/docs-preview` is untouched.

- **Source:** the newest `design/handoff/<date>/project/design_handoff_aurelia_premier/`
  (selected automatically at build → tracks the latest export per the migration path,
  `docs/30-Implementation/design-sync-workflow.md` / ADR-0048).
- **Babylon-only:** the Three.js stadium (`stadium-3d/` + `Stadium 3D.html`) is dropped at
  build time and stale links repoint to the Babylon stadium (ADR-0047). The committed
  handoff snapshot is never edited.
- **No build step:** React/Babel/Fonts via CDN; local `.jsx` are Babel-transpiled in the
  browser. nginx just serves the directory (the landing page is `Handoff Overview.html`).

## Run

Part of the docs stack (own auth-gated subdomain `STYLEGUIDE_DOMAIN`):

```bash
docker compose -f docker-compose.docs.yml up -d --build styleguide
```

Local sanity (no Traefik/auth):

```bash
docker build -f tools/styleguide/Dockerfile -t fmx-styleguide . && \
docker run --rm -p 8082:80 fmx-styleguide   # → http://localhost:8082
```

Verify on deploy: the styleguide is clickable + responsive (Component States / adaptive
screens), the Babylon stadium loads, and there is **no** Three.js "Stadium 3D" page.
