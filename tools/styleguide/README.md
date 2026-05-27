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
- **Overlay (`overlay/`):** a clickable **hub** (`hub.html`, the landing page) that links
  every part, plus a dedicated **isometric Babylon scene** (`isometric.html` + `iso/`) and
  shared `assets/` (Aurelia tokens + static fallback SVG). Copied over/alongside the export
  at build — the snapshot stays byte-for-byte untouched (ADR-0048). The export's real design
  canvas is preserved at `/index.html` (the old `index.html` clobber is gone); nginx serves
  `hub.html` as `/` via its `index` directive.
- **No build step:** React/Babel/Fonts and Babylon.js via CDN; local `.jsx` are
  Babel-transpiled in the browser, `iso/*.js` are native ES modules. nginx just serves the
  directory.

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

Verify on deploy: `/` is the hub and every card/link resolves; the design canvas is at
`/index.html`; the isometric scene (`/isometric.html`) renders at the iso angle (drag
rotates, scroll/keys zoom, elevation locked) with a static fallback when WebGL/JS is off;
the Babylon stadium loads; layouts are responsive (sm/md/lg/xl); and there is **no**
Three.js "Stadium 3D" page.
