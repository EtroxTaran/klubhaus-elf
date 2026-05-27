// main.js — Orchestrator: renderer, scene, UI bindings, event loop.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { CLUBS, SECTORS, BOWL, PITCH, CAM_PRESETS } from './config.js';
import { buildPitch } from './pitch.js';
import { buildBowl, sectorForPosition } from './bowl.js';
import { buildLights, buildFloodlights } from './lights.js';
import { buildInfrastructure } from './infra.js';
import { createCameraDirector } from './cameras.js';

const stageEl = document.getElementById('js-stage');
const loadEl  = document.getElementById('js-load');

// ── Renderer ───────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
stageEl.appendChild(renderer.domElement);

// ── Scene + camera + controls ──────────────────────────────────
const scene = new THREE.Scene();

// PBR environment for subtle reflections — uses RoomEnvironment for natural light
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 1, 800);
camera.position.set(125, 95, 125);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 6, 0);
controls.minDistance = 60;
controls.maxDistance = 300;
controls.maxPolarAngle = Math.PI / 2 - 0.04;
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.30;

const director = createCameraDirector(camera, controls);

let userInteracted = false;
controls.addEventListener('start', () => {
  if (!userInteracted) { userInteracted = true; state.auto = false; updateAutoToggle(); controls.autoRotate = false; }
});

// ── Resize ─────────────────────────────────────────────────────
function resize() {
  const w = stageEl.clientWidth, h = stageEl.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();
new ResizeObserver(resize).observe(stageEl);

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
};

// ── Ground ─────────────────────────────────────────────────────
const groundMat = new THREE.MeshStandardMaterial({ color: 0x5e6c47, roughness: 1 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.02;
ground.receiveShadow = true;
scene.add(ground);

// ── Build scene pieces ─────────────────────────────────────────
const pitch = buildPitch();
scene.add(pitch);

const cfg0 = CLUBS[state.club];
const bowl = buildBowl({ scarlet: 0xb7301b, secondary: cfg0.secondary });
scene.add(bowl.group);

const lights = buildLights(scene, renderer);

const floodPositions = [
  [-95, 0, -125], [95, 0, -125], [-95, 0, 125], [95, 0, 125],
];
const floods = buildFloodlights(scene, floodPositions);

const infra = buildInfrastructure({ accent: cfg0.primary, secondary: cfg0.secondary });
scene.add(infra.group);

// ── Apply functions ────────────────────────────────────────────
function applyClubColor() {
  const c = CLUBS[state.club];
  bowl.setAccent(0xb7301b, c.secondary);   // scarlet stays as bowl accent, secondary tweaks crowd
  infra.setAccent(c.primary);
  document.getElementById('js-mast-sub').textContent = `3D Infrastructure Mockup · ${c.name} · ${c.tag}`;
}
function applyTimeOfDay() {
  lights.apply(state.hour);
  // Auto-trigger floodlights at low sun
  const sp = lights.sunPosition(state.hour);
  const sunHeight = sp.y;
  const floodT = Math.max(0, Math.min(1, 1 - sunHeight / 80));
  floods.setIntensity(state.floods ? floodT : 0);
  document.getElementById('js-flood').textContent = state.floods ? (floodT > 0.05 ? 'Auto' : 'Off') : 'Aus';
  document.getElementById('js-tod-label').textContent = formatHour(state.hour);
  ground.material.color.copy(new THREE.Color(lights.apply._lastGround || 0x5e6c47));
}
function applyRoof() {
  bowl.roofGroup.visible = state.roofOn;
  document.getElementById('js-roof').textContent = state.roofOn ? 'An' : 'Aus';
  document.getElementById('js-t-roofs').classList.toggle('is-on', state.roofOn);
}
function applyFloods() {
  floods.setVisible(state.floods);
  document.getElementById('js-t-floods').classList.toggle('is-on', state.floods);
  applyTimeOfDay();  // recompute floodlight intensity
}
function applyInfra() {
  infra.group.visible = state.infra;
  document.getElementById('js-t-infra').classList.toggle('is-on', state.infra);
}
function applyCrowd() {
  bowl.crowdMesh.visible = state.crowd;
  document.getElementById('js-t-crowd').classList.toggle('is-on', state.crowd);
}
function applyScoreboard() {
  infra.scoreboardGroup.visible = state.scoreboard;
  document.getElementById('js-t-board').classList.toggle('is-on', state.scoreboard);
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
function applyHover() {
  bowl.setHover(state.hoverSector);
}
function updateAutoToggle() {
  controls.autoRotate = state.auto;
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
// Club swatches
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

// Camera preset buttons
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

// Toggles
document.querySelectorAll('[data-toggle]').forEach(el => {
  el.addEventListener('click', () => {
    const k = el.dataset.toggle;
    if (k === 'roofs')      { state.roofOn = !state.roofOn; applyRoof(); }
    else if (k === 'floods'){ state.floods = !state.floods; applyFloods(); }
    else if (k === 'infra') { state.infra = !state.infra; applyInfra(); }
    else if (k === 'crowd') { state.crowd = !state.crowd; applyCrowd(); }
    else if (k === 'board') { state.scoreboard = !state.scoreboard; applyScoreboard(); }
    else if (k === 'auto')  { state.auto = !state.auto; updateAutoToggle(); }
  });
});

// Time slider
const todInput = document.getElementById('js-tod-input');
todInput.value = state.hour * 60;
todInput.addEventListener('input', () => {
  state.hour = parseFloat(todInput.value) / 60;
  applyTimeOfDay();
});

// ── Hit-test for hover/click ───────────────────────────────────
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const hitPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const hitPoint = new THREE.Vector3();

function pointerToSector(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  // Intersect with horizontal plane at y=0 — gives us a world-space position
  if (raycaster.ray.intersectPlane(hitPlane, hitPoint)) {
    const dist = Math.hypot(hitPoint.x, hitPoint.z);
    // Only consider hits within bowl footprint
    const maxR = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 4;
    const minR = Math.min(PITCH.w, PITCH.h) / 2;
    if (dist > minR && dist < maxR) {
      return sectorForPosition(hitPoint.x, hitPoint.z);
    }
  }
  return null;
}

renderer.domElement.addEventListener('pointermove', (e) => {
  const sec = pointerToSector(e);
  if (sec !== state.hoverSector) {
    state.hoverSector = sec;
    applyHover();
    renderer.domElement.style.cursor = sec ? 'pointer' : 'grab';
  }
});
renderer.domElement.addEventListener('click', (e) => {
  const sec = pointerToSector(e);
  if (sec) {
    state.selectedSector = sec;
    state.auto = false; updateAutoToggle();
    applySelection();
  }
});

// ── Performance HUD ────────────────────────────────────────────
const fpsEl  = document.getElementById('js-fps');
const drwEl  = document.getElementById('js-draws');
const triEl  = document.getElementById('js-tris');
let fpsAcc = 0, fpsFrames = 0, fpsLast = performance.now();

// ── Initial apply ──────────────────────────────────────────────
applyClubColor();
applyTimeOfDay();
applyRoof();
applyFloods();
applyInfra();
applyCrowd();
applyScoreboard();
applySelection();
updateAutoToggle();
updateCapacity();

// ── Render loop ────────────────────────────────────────────────
const clock = new THREE.Clock();
function tick() {
  const dt = Math.min(0.05, clock.getDelta());
  controls.update();
  director.tick(dt);

  renderer.render(scene, camera);

  // HUD
  fpsAcc += dt; fpsFrames++;
  if (fpsAcc >= 0.5) {
    const fps = Math.round(fpsFrames / fpsAcc);
    fpsEl.textContent = fps;
    drwEl.textContent = renderer.info.render.calls;
    triEl.textContent = renderer.info.render.triangles.toLocaleString('de-DE');
    fpsAcc = 0; fpsFrames = 0;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// Hide loading splash on first paint
requestAnimationFrame(() => requestAnimationFrame(() => {
  loadEl.classList.add('is-done');
  setTimeout(() => loadEl.remove(), 600);
}));
