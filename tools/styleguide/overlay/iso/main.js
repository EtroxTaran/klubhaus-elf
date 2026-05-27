// main.js — isometric club-campus Babylon scene for the styleguide overlay.
// Orthographic ArcRotateCamera locked to the true isometric elevation; azimuth
// rotates, wheel/keys zoom the ortho frustum. Builds an Anstoss-style campus
// (campus.js). Graceful static fallback when Babylon/WebGL is unavailable.
import { CLUBS, clubColor, ISO, clamp } from './config.js';
import { buildCampus } from './campus.js';

const canvas     = document.getElementById('js-canvas');
const stageEl    = document.getElementById('js-stage');
const loadEl     = document.getElementById('js-load');
const fallbackEl = document.getElementById('js-fallback');

function showFallback(reason) {
  if (fallbackEl) fallbackEl.hidden = false;
  if (loadEl) loadEl.remove();
  if (canvas) canvas.style.display = 'none';
  console.warn('[iso] static fallback —', reason);
}

if (typeof BABYLON === 'undefined' || typeof BABYLON.Engine === 'undefined'
    || (BABYLON.Engine.isSupported && !BABYLON.Engine.isSupported())) {
  showFallback('babylon-or-webgl-unavailable');
} else {
  try { boot(); }
  catch (err) { showFallback((err && err.message) || 'init-error'); console.error(err); }
}

function boot() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Engine ────────────────────────────────────────────────────
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: false, stencil: false,
    powerPreference: 'high-performance', antialias: true,
  });
  engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, 1.5));

  // ── Scene ─────────────────────────────────────────────────────
  const scene = new BABYLON.Scene(engine);
  scene.useRightHandedSystem = true;
  scene.clearColor = new BABYLON.Color4(0.039, 0.031, 0.027, 1);
  scene.skipPointerMovePicking = true;
  scene.imageProcessingConfiguration.toneMappingEnabled = true;
  scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
  scene.imageProcessingConfiguration.exposure = 1.05;

  // ── Camera: orthographic, locked to the isometric elevation ────
  const cam = new BABYLON.ArcRotateCamera('iso', ISO.alpha, ISO.beta, ISO.radius, BABYLON.Vector3.Zero(), scene);
  cam.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  cam.lowerBetaLimit = cam.upperBetaLimit = ISO.beta;     // lock elevation = true iso
  cam.minZ = -2000; cam.maxZ = 4000;
  cam.panningSensibility = 30;
  cam.inertia = 0.82;
  cam.attachControl(canvas, true);
  if (cam.inputs.attached.mousewheel) cam.inputs.removeByType('ArcRotateCameraMouseWheelInput');

  const state = {
    club: 'hafenstadt', half: ISO.orthoHalfHeight, auto: !reduceMotion, targetAlpha: null,
    layers: { outdoor: true, training: true, buildings: true },
  };

  function setOrtho() {
    const w = canvas.clientWidth || canvas.width || 1;
    const h = canvas.clientHeight || canvas.height || 1;
    const a = w / h;
    cam.orthoTop = state.half;  cam.orthoBottom = -state.half;
    cam.orthoLeft = -state.half * a; cam.orthoRight = state.half * a;
  }
  setOrtho();

  // ── Lights ────────────────────────────────────────────────────
  const hemi = new BABYLON.HemisphericLight('iso-hemi', new BABYLON.Vector3(0.35, 1, 0.25), scene);
  hemi.intensity = 0.92;
  hemi.diffuse = new BABYLON.Color3(1, 0.97, 0.9);
  hemi.groundColor = new BABYLON.Color3(0.42, 0.36, 0.29);
  const dir = new BABYLON.DirectionalLight('iso-dir', new BABYLON.Vector3(-1, -1.7, -0.8), scene);
  dir.intensity = 0.5;
  dir.position = new BABYLON.Vector3(220, 320, 180);

  // ── Build campus ──────────────────────────────────────────────
  const campus = buildCampus(scene, { accent: clubColor(state.club) });

  // ── UI: club accent swatches ──────────────────────────────────
  const sw = document.getElementById('js-swatches');
  if (sw) {
    for (const [id, c] of Object.entries(CLUBS)) {
      const hex = clubColor(id);
      const b = document.createElement('button');
      b.className = 'iso-swatch' + (id === state.club ? ' is-active' : '');
      b.style.background = '#' + hex.toString(16).padStart(6, '0');
      b.title = c.name;
      b.setAttribute('aria-label', 'Vereinsakzent ' + c.name);
      b.innerHTML = `<span class="iso-swatch-lbl">${c.name.slice(0, 3)}</span>`;
      b.addEventListener('click', () => {
        state.club = id;
        campus.setAccent(clubColor(id));
        for (const s of sw.children) s.classList.remove('is-active');
        b.classList.add('is-active');
        const sub = document.getElementById('js-mast-sub');
        if (sub) sub.textContent = `Vereinsgelände · ${c.name} · ${c.tag}`;
      });
      sw.appendChild(b);
    }
  }

  // ── UI: azimuth view presets (beta is locked) ─────────────────
  const camWrap = document.getElementById('js-cams');
  const PRESETS = [
    { label: '0°',   alpha: ISO.alpha },
    { label: '90°',  alpha: ISO.alpha + Math.PI / 2 },
    { label: '180°', alpha: ISO.alpha + Math.PI },
    { label: '270°', alpha: ISO.alpha + 3 * Math.PI / 2 },
  ];
  if (camWrap) {
    for (const p of PRESETS) {
      const b = document.createElement('button');
      b.className = 'iso-cam-btn';
      b.textContent = 'Drehung ' + p.label;
      b.addEventListener('click', () => {
        state.targetAlpha = p.alpha;
        state.auto = false; syncAuto();
        for (const x of camWrap.children) x.classList.remove('is-active');
        b.classList.add('is-active');
        setTimeout(() => b.classList.remove('is-active'), 1400);
      });
      camWrap.appendChild(b);
    }
  }

  // ── UI: toggles (auto-spin, reset, layers) ────────────────────
  function syncAuto() {
    const t = document.getElementById('js-t-auto');
    if (t) t.classList.toggle('is-on', state.auto);
  }
  function syncLayer(name) {
    const t = document.getElementById('js-t-' + name);
    if (t) t.classList.toggle('is-on', state.layers[name]);
  }
  syncAuto(); ['outdoor', 'training', 'buildings'].forEach(syncLayer);

  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.toggle;
      if (k === 'auto')  { state.auto = !state.auto; state.targetAlpha = null; syncAuto(); }
      else if (k === 'reset') { state.targetAlpha = ISO.alpha; state.half = ISO.orthoHalfHeight; setOrtho(); state.auto = false; syncAuto(); }
      else if (state.layers[k] !== undefined) { state.layers[k] = !state.layers[k]; campus.setLayer(k, state.layers[k]); syncLayer(k); }
    });
  });

  // ── Zoom: wheel via ortho frustum ─────────────────────────────
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    state.half = clamp(state.half * (e.deltaY > 0 ? 1.08 : 0.92), ISO.orthoMin, ISO.orthoMax);
    setOrtho();
  }, { passive: false });

  // ── Keyboard a11y ─────────────────────────────────────────────
  canvas.addEventListener('keydown', (e) => {
    const step = Math.PI / 24;
    switch (e.key) {
      case 'ArrowLeft':  cam.alpha -= step; state.targetAlpha = null; break;
      case 'ArrowRight': cam.alpha += step; state.targetAlpha = null; break;
      case 'ArrowUp': case '+': case '=':
        state.half = clamp(state.half * 0.9, ISO.orthoMin, ISO.orthoMax); setOrtho(); break;
      case 'ArrowDown': case '-': case '_':
        state.half = clamp(state.half * 1.1, ISO.orthoMin, ISO.orthoMax); setOrtho(); break;
      case ' ': case 'Spacebar':
        state.auto = !state.auto; state.targetAlpha = null; syncAuto(); break;
      case '0': case 'r': case 'R':
        state.targetAlpha = ISO.alpha; state.half = ISO.orthoHalfHeight; setOrtho(); state.auto = false; syncAuto(); break;
      default: return;
    }
    e.preventDefault();
  });

  // ── Perf: freeze once ready ───────────────────────────────────
  scene.executeWhenReady(() => {
    scene.render();
    try { scene.freezeActiveMeshes(); } catch (_) { /* non-fatal */ }
    if (loadEl) { loadEl.classList.add('is-done'); setTimeout(() => loadEl.remove(), 600); }
  });

  // ── Render loop ───────────────────────────────────────────────
  const AUTO_SPEED = 0.12;
  const fpsEl = document.getElementById('js-fps');
  const meshEl = document.getElementById('js-meshes');
  const triEl = document.getElementById('js-tris');
  let last = performance.now(), hudAcc = 0;

  engine.runRenderLoop(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000); last = now;

    if (state.targetAlpha != null) {
      const d = state.targetAlpha - cam.alpha;
      if (Math.abs(d) < 0.003) { cam.alpha = state.targetAlpha; state.targetAlpha = null; }
      else cam.alpha += d * Math.min(1, dt * 6);
    } else if (state.auto) {
      cam.alpha += AUTO_SPEED * dt;
    }

    scene.render();

    hudAcc += dt;
    if (hudAcc >= 0.5) {
      hudAcc = 0;
      if (fpsEl)  fpsEl.textContent = engine.getFps().toFixed(0);
      const active = scene.getActiveMeshes();
      if (meshEl) meshEl.textContent = active.length;
      if (triEl) {
        let tris = 0;
        for (let i = 0; i < active.length; i++) {
          const m = active.data[i];
          if (m && m.getTotalIndices) tris += m.getTotalIndices() / 3;
        }
        triEl.textContent = Math.round(tris).toLocaleString('de-DE');
      }
    }
  });

  // ── Resize ────────────────────────────────────────────────────
  const onResize = () => { engine.resize(); setOrtho(); };
  window.addEventListener('resize', onResize);
  if (stageEl && 'ResizeObserver' in window) new ResizeObserver(onResize).observe(stageEl);

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); }, false);
}
