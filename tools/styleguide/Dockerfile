# Standalone interactive Design Styleguide (Aurelia Premier).
#
# Serves the claude.ai/design export's interactive handoff
# (design/handoff/<latest>/project/design_handoff_aurelia_premier) as static
# assets via nginx — React/Babel/Fonts come from CDN, local .jsx are Babel-
# transpiled in-browser, so no build step is needed. This is the DESIGN SYSTEM,
# served separately from the docs wiki (Quartz is untouched).
#
# Babylon-only: the Three.js stadium engine (`stadium-3d/`) and its page
# (`Stadium 3D.html`) are dropped at build time; stale nav links are repointed
# to the Babylon stadium (ADR-0047). The handoff snapshot itself is never edited.
#
# An OVERLAY (tools/styleguide/overlay/: hub.html, isometric.html, iso/, assets/)
# is copied over/alongside the export. It adds a clickable hub (the new landing
# page) plus a dedicated isometric Babylon scene — without editing the snapshot.
#
# Build context = repo root (whole-context COPY avoids the BuildKit selective-
# COPY include-pattern bug documented in tools/docs-preview/Dockerfile).

FROM nginx:alpine AS runtime
COPY . /ctx
RUN set -eu; \
  src="$(ls -d /ctx/design/handoff/*/ | sort | tail -1)project/design_handoff_aurelia_premier"; \
  test -d "$src" || { echo "styleguide source not found: $src"; exit 1; }; \
  rm -rf /usr/share/nginx/html; mkdir -p /usr/share/nginx/html; \
  cp -r "$src"/. /usr/share/nginx/html/; \
  # Babylon-only: drop the Three.js stadium engine + page.
  rm -rf "/usr/share/nginx/html/stadium-3d" "/usr/share/nginx/html/Stadium 3D.html"; \
  # Repoint any nav link to the removed Three.js page → the Babylon stadium.
  find /usr/share/nginx/html -maxdepth 1 -name '*.html' \
    -exec sed -i 's|Stadium 3D\.html|Stadium 3D Babylon.html|g' {} +; \
  # Babylon-only: drop the leftover "three.js Variante" masthead button on the
  # Babylon stadium page (the three.js variant no longer exists).
  sed -i 's#<a class="s3-mast-btn is-alt"[^>]*>three\.js Variante</a>##' "/usr/share/nginx/html/Stadium 3D Babylon.html"; \
  # Overlay (hub + isometric scene + shared assets) copied OVER/ALONGSIDE the
  # export. The snapshot in /ctx is never edited; the served copy only gains files.
  cp -r /ctx/tools/styleguide/overlay/. /usr/share/nginx/html/; \
  rm -rf /ctx; \
  # The entry page must be a clear, fast landing — NOT the heavy 34-script design
  # canvas. Restore the proven "landing lives AT index.html" pattern (robust under
  # any nginx default): 1) rename the slow canvas → canvas.html, 2) repoint every
  # reference to it (export .html + the one .jsx link), 3) make index.html the hub.
  # The canvas navigates via hash anchors only, so it needs no internal change.
  mv "/usr/share/nginx/html/index.html" "/usr/share/nginx/html/canvas.html"; \
  find /usr/share/nginx/html -maxdepth 1 \( -name '*.html' -o -name '*.jsx' \) \
    -exec sed -i 's|index\.html|canvas.html|g' {} +; \
  cp "/usr/share/nginx/html/hub.html" "/usr/share/nginx/html/index.html"; \
  # Sanity (blind-build safety): entry = hub, canvas reachable, repoint done.
  test -f /usr/share/nginx/html/hub.html; \
  test -f /usr/share/nginx/html/isometric.html; \
  test -f /usr/share/nginx/html/canvas.html; \
  grep -q 'hub-body' /usr/share/nginx/html/index.html; \
  grep -q 'text/babel' /usr/share/nginx/html/canvas.html; \
  ! grep -q 'index\.html#' "/usr/share/nginx/html/Handoff Overview.html"
COPY tools/styleguide/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
