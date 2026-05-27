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
  every part, plus a dedicated **isometric club-campus scene** (`isometric.html` + `iso/`,
  procedural Anstoss-style stadium + infrastructure, token-driven) and shared `assets/`
  (Aurelia tokens + static fallback SVG). Copied over/alongside the export at build — the
  snapshot stays byte-for-byte untouched (ADR-0048). At build the heavy 34-script design
  canvas is renamed to `canvas.html` and the **hub becomes `index.html`**, so the landing at
  `/` is the hub under any server config; references to the canvas are repointed
  automatically. The canvas navigates via hash anchors, so it needs no internal change.
- **Tokenized · reusable · responsive:** one token source (`overlay/assets/aurelia.css`
  `:root`); the hub and the 3D scene share it — the Babylon scene reads the CSS tokens at
  runtime. See `docs/10-Architecture/09-Design-System.md` and the iso research note
  `docs/60-Research/isometric-stadium-campus-research.md`.
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

Redeploy note: in Dokploy, **rebuild without cache** (force-rebuild) so the new image is used.

Verify on deploy: `/` is the hub and every card/link resolves; the heavy design canvas is at
`/canvas.html`; the isometric **club-campus** scene (`/isometric.html`) renders at the iso
angle (drag rotates, scroll/keys zoom, elevation locked) — stadium, floodlights, scoreboard,
forecourt, parking, training pitches, campus buildings + trees, with club-accent swatches and
layer toggles, and a static fallback when WebGL/JS is off; the Babylon stadium loads; layouts
are responsive (sm/md/lg/xl); and there is **no** Three.js "Stadium 3D" page.
