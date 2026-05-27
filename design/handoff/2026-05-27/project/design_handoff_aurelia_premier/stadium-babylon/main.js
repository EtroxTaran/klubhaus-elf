// main.js — Babylon orchestrator: engine, scene, camera, UI bindings, loop.
import { CLUBS, SECTORS, BOWL, PITCH, CAM_PRESETS, degToRad, hexToColor3 } from './config.js';
import { buildPitch } from './pitch.js';
import { buildBowl, sectorForPosition } from './bowl.js';
import { buildLights, buildFloodlights } from './lights.js';
import { buildInfrastructure } from './infra.js';
import { buildLandscape } from './landscape.js';
import { createCameraDirector } from './cameras.js';

const canvas = document.getElementById('js-canvas');
const stageEl = document.getElementById('js-stage');
const loadEl  = document.getElementById('js-load');

// ── Engine ─────────────────────────────────────────────────────
const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: false,
  stencil: false,
  powerPreference: 'high-performance',
  antialias: true,
});
engine.setHardwareScalingLevel(1 / Math.min(devicePixelRatio, 1.8));

// ── Scene ──────────────────────────────────────────────────────
const scene = new BABYLON.Scene(engine);
scene.useRightHandedSystem = true;     // match three.js convention
scene.clearColor = new BABYLON.Color4(0.04, 0.03, 0.025, 1);
// ACES tone mapping (Babylon's built-in image processing)
scene.imageProcessingConfiguration.toneMappingEnabled = true;
scene.imageProcessingConfiguration.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
scene.imageProcessingConfiguration.exposure = 1.0;

// ── Camera (ArcRotateCamera = OrbitControls equivalent) ────────
const heli = CAM_PRESETS.heli;
const dx = heli.pos[0] - heli.target[0];
const dy = heli.pos[1] - heli.target[1];
const dz = heli.pos[2] - heli.target[2];
const radius0 = Math.hypot(dx, dy, dz);
const alpha0 = Math.atan2(dz, dx);
const beta0 = Math.acos(dy / radius0);

const camera = new BABYLON.ArcRotateCamera(
  'cam',
  alpha0, beta0, radius0,
  new BABYLON.Vector3(heli.target[0], heli.target[1], heli.target[2]),
  scene
);
camera.fov = degToRad(heli.fov);
camera.minZ = 1;
camera.maxZ = 1400;
camera.lowerRadiusLimit = 50;
camera.upperRadiusLimit = 520;
camera.upperBetaLimit = Math.PI / 2 - 0.04;  // can't go below horizon
camera.lowerBetaLimit = 0.05;
camera.wheelDeltaPercentage = 0.01;
camera.panningSensibility = 80;
camera.inertia = 0.8;
camera.attachControl(canvas, true);

const director = createCameraDirector(camera);

// Track user interaction to pause autorotate (same as three.js version)
let userInteracted = false;
canvas.addEventListener('pointerdown', () => {
  if (!userInteracted) { userInteracted = true; state.auto = false; updateAutoToggle(); }
});

// ── State ──────────────────────────────────────────────────────
const state = {
  club: 'hafenstadt',
  hour: 13.5,
  roofOn: true,
  floods: true,
  infra: true,
  crowd: true,
  scoreboard: true,
  auto: true,
  selectedSector: 'N',
  hoverSector: null,
  landscape: true,
};

// ── Lights (built first so we can add shadow casters) ──────────
const lights = buildLights(scene);

// ── Ground ─────────────────────────────────────────────────────
const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 1400, height: 1400 }, scene);
const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
groundMat.diffuseColor = hexToColor3(0x5e6c47);
groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
ground.material = groundMat;
ground.position.y = -0.02;
ground.receiveShadows = true;

// ── Build scene pieces ─────────────────────────────────────────
const pitch = buildPitch(scene);

const cfg0 = CLUBS[state.club];
const bowl = buildBowl(scene, { scarlet: 0xb7301b, secondary: cfg0.secondary });

const floodPositions = [
  [-95, 0, -125], [95, 0, -125], [-95, 0, 125], [95, 0, 125],
];
const floods = buildFloodlights(scene, floodPositions, lights.shadowGen);

const infra = buildInfrastructure(scene, {
  accent: cfg0.primary, secondary: cfg0.secondary, shadowGen: lights.shadowGen,
});

const landscape = buildLandscape(scene, {
  primary: cfg0.primary, secondary: cfg0.secondary, shadowGen: lights.shadowGen,
});

// Receivers / casters for the shadow generator
// Ground + pitch + bowl pieces receive
ground.receiveShadows = true;
pitch.getChildMeshes().forEach(m => { m.receiveShadows = true; });
bowl.root.getChildMeshes().forEach(m => { m.receiveShadows = true; });

// Add bowl back wall + roof + struts as casters
bowl.root.getChildMeshes().forEach(m => {
  if (/backWall|roofRing|strut/.test(m.name) && lights.shadowGen) {
    lights.shadowGen.addShadowCaster(m);
  }
});

// ── Apply functions ────────────────────────────────────────────
function applyClubColor() {
  const c = CLUBS[state.club];
  bowl.setAccent(0xb7301b, c.secondary);
  infra.setAccent(c.primary);
  document.getElementById('js-mast-sub').textContent = `3D Infrastructure Mockup · ${c.name} · ${c.tag}`;
}
function applyTimeOfDay() {
  const p = lights.apply(state.hour);
  const sp = lights.sunPosition(state.hour);
  const sunHeight = sp.y;
  const floodT = Math.max(0, Math.min(1, 1 - sunHeight / 80));
  floods.setIntensity(state.floods ? floodT : 0);
  document.getElementById('js-flood').textContent = state.floods ? (floodT > 0.05 ? 'Auto' : 'Off') : 'Aus';
  document.getElementById('js-tod-label').textContent = formatHour(state.hour);
  groundMat.diffuseColor = hexToColor3(p.ground);
}
function applyRoof() {
  bowl.roofGroup.setEnabled(state.roofOn);
  document.getElementById('js-roof').textContent = state.roofOn ? 'An' : 'Aus';
  document.getElementById('js-t-roofs').classList.toggle('is-on', state.roofOn);
}
function applyFloods() {
  floods.setVisible(state.floods);
  document.getElementById('js-t-floods').classList.toggle('is-on', state.floods);
  applyTimeOfDay();
}
function applyInfra() {
  infra.setVisible(state.infra);
  document.getElementById('js-t-infra').classList.toggle('is-on', state.infra);
}
function applyCrowd() {
  bowl.crowdMesh.setEnabled(state.crowd);
  document.getElementById('js-t-crowd').classList.toggle('is-on', state.crowd);
}
function applyScoreboard() {
  infra.setScoreboardVisible(state.scoreboard);
  document.getElementById('js-t-board').classList.toggle('is-on', state.scoreboard);
}
function applyLandscape() {
  landscape.setEnabled(state.landscape);
  document.getElementById('js-t-land').classList.toggle('is-on', state.landscape);
}
function applySelection() {
  bowl.setSelect(state.selectedSector);
  const co = document.getElementById('js-callout');
  if (!state.selectedSector) { co.style.display = 'none'; return; }
  co.style.display = '';
  const info = SECTORS[state.selectedSector];
  document.getElementById('js-callout-kick').textContent = 'Tribüne · ' + state.selectedSector;
  document.getElementById('js-callout-title').textContent = info.name;
  document.getElementById('js-callout-meta').innerHTML =
    `<span>Kapazität <b>${info.cap.toLocaleString('de-DE')}</b></span>` +
    `<span>Typ <b>${info.type}</b></span>`;
  document.getElementById('js-callout-body').textContent = info.heritage;
}
function applyHover() { bowl.setHover(state.hoverSector); }
function updateAutoToggle() {
  document.getElementById('js-t-auto').classList.toggle('is-on', state.auto);
}
function updateCapacity() {
  const total = Object.values(SECTORS).reduce((s, x) => s + x.cap, 0);
  document.getElementById('js-cap').textContent = total.toLocaleString('de-DE');
}
function formatHour(h) {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}

// ── UI bindings ────────────────────────────────────────────────
const sw = document.getElementById('js-swatches');
for (const [id, c] of Object.entries(CLUBS)) {
  const b = document.createElement('button');
  b.className = 's3-swatch' + (id === state.club ? ' is-active' : '');
  b.style.background = '#' + c.primary.toString(16).padStart(6, '0');
  b.title = c.name;
  b.innerHTML = `<span class="s3-swatch-lbl">${c.name.slice(0, 3)}</span>`;
  b.addEventListener('click', () => {
    state.club = id;
    for (const s of sw.children) s.classList.remove('is-active');
    b.classList.add('is-active');
    applyClubColor();
  });
  sw.appendChild(b);
}

const camWrap = document.getElementById('js-cams');
for (const [id, p] of Object.entries(CAM_PRESETS)) {
  const b = document.createElement('button');
  b.className = 's3-cam-btn';
  b.dataset.cam = id;
  b.textContent = p.label;
  b.addEventListener('click', () => {
    director.goTo(id);
    state.auto = false; updateAutoToggle();
    for (const x of camWrap.children) x.classList.remove('is-active');
    b.classList.add('is-active');
    setTimeout(() => b.classList.remove('is-active'), 1600);
  });
  camWrap.appendChild(b);
}

document.querySelectorAll('[data-toggle]').forEach(el => {
  el.addEventListener('click', () => {
    const k = el.dataset.toggle;
    if      (k === 'roofs')  { state.roofOn = !state.roofOn; applyRoof(); }
    else if (k === 'floods') { state.floods = !state.floods; applyFloods(); }
    else if (k === 'infra')  { state.infra = !state.infra; applyInfra(); }
    else if (k === 'crowd')  { state.crowd = !state.crowd; applyCrowd(); }
    else if (k === 'board')  { state.scoreboard = !state.scoreboard; applyScoreboard(); }
    else if (k === 'land')   { state.landscape = !state.landscape; applyLandscape(); }
    else if (k === 'auto')   { state.auto = !state.auto; updateAutoToggle(); }
  });
});

const todInput = document.getElementById('js-tod-input');
todInput.value = state.hour * 60;
todInput.addEventListener('input', () => {
  state.hour = parseFloat(todInput.value) / 60;
  applyTimeOfDay();
});

// ── Hit-test for hover/click (ray vs y=0 plane) ────────────────
function pointerToSector() {
  const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera);
  if (Math.abs(ray.direction.y) < 1e-4) return null;
  const t = -ray.origin.y / ray.direction.y;
  if (t < 0) return null;
  const x = ray.origin.x + ray.direction.x * t;
  const z = ray.origin.z + ray.direction.z * t;
  const dist = Math.hypot(x, z);
  const maxR = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 4;
  const minR = Math.min(PITCH.w, PITCH.h) / 2;
  if (dist > minR && dist < maxR) return sectorForPosition(x, z);
  return null;
}

scene.onPointerObservable.add((ev) => {
  if (ev.type === BABYLON.PointerEventTypes.POINTERMOVE) {
    const sec = pointerToSector();
    if (sec !== state.hoverSector) {
      state.hoverSector = sec;
      applyHover();
      canvas.style.cursor = sec ? 'pointer' : 'grab';
    }
  } else if (ev.type === BABYLON.PointerEventTypes.POINTERTAP) {
    const sec = pointerToSector();
    if (sec) {
      state.selectedSector = sec;
      state.auto = false; updateAutoToggle();
      applySelection();
    }
  }
});

// ── Performance HUD ────────────────────────────────────────────
const fpsEl  = document.getElementById('js-fps');
const drwEl  = document.getElementById('js-draws');
const actEl  = document.getElementById('js-active');
let hudAcc = 0;

// ── Initial apply ──────────────────────────────────────────────
applyClubColor();
applyTimeOfDay();
applyRoof();
applyFloods();
applyInfra();
applyCrowd();
applyScoreboard();
applyLandscape();
applySelection();
updateAutoToggle();
updateCapacity();

// ── Render loop ────────────────────────────────────────────────
let lastTime = performance.now();
const AUTO_ROT_SPEED = 0.30 * (Math.PI / 180) * 4; // rad/sec (~match three.js feel)

engine.runRenderLoop(() => {
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  // Auto-rotate camera if state.auto is on and no preset transition is active
  if (state.auto && !director.active) {
    camera.alpha += AUTO_ROT_SPEED * dt;
  }
  director.tick(dt);
  scene.render();

  // HUD update at ~2 Hz
  hudAcc += dt;
  if (hudAcc >= 0.5) {
    hudAcc = 0;
    fpsEl.textContent = engine.getFps().toFixed(0);
    const meshes = scene.getActiveMeshes().length;
    drwEl.textContent = meshes;
    // Total active vertex count / 3 ≈ triangles
    let tris = 0;
    const activeMeshes = scene.getActiveMeshes();
    for (let i = 0; i < activeMeshes.length; i++) {
      const m = activeMeshes.data[i];
      if (m && m.getTotalIndices) tris += m.getTotalIndices() / 3;
    }
    actEl.textContent = Math.round(tris).toLocaleString('de-DE');
  }
});

// ── Resize ─────────────────────────────────────────────────────
window.addEventListener('resize', () => engine.resize());
new ResizeObserver(() => engine.resize()).observe(stageEl);

// Hide loading splash after first frame
requestAnimationFrame(() => requestAnimationFrame(() => {
  loadEl.classList.add('is-done');
  setTimeout(() => loadEl.remove(), 600);
}));
