// lights.js — Sun + sky + floodlights + time-of-day animation.
import * as THREE from 'three';

// Key palettes by hour. We lerp between them for any continuous time.
const KEY_PALETTES = [
  // hour, sky, fog, fogNear, fogFar, ground, ambient, dirInt, hemiTop, hemiBot, exposure
  { h: 0,   sky: 0x080706, fog: 0x080706, fogNear: 100, fogFar: 380, ground: 0x252320, ambient: 0.05, dirInt: 0.04, hemiTop: 0x101010, hemiBot: 0x050505, exposure: 1.2 },
  { h: 5,   sky: 0x1a1a2e, fog: 0x1a1a2e, fogNear: 100, fogFar: 380, ground: 0x2e2c28, ambient: 0.08, dirInt: 0.10, hemiTop: 0x2a2438, hemiBot: 0x0a0807, exposure: 1.1 },
  { h: 7,   sky: 0xe89668, fog: 0xe6a87e, fogNear: 180, fogFar: 480, ground: 0x4a4434, ambient: 0.25, dirInt: 0.70, hemiTop: 0xe89668, hemiBot: 0x3a2820, exposure: 1.0 },
  { h: 9,   sky: 0xb5cfdf, fog: 0xcacdc7, fogNear: 220, fogFar: 520, ground: 0x57663d, ambient: 0.42, dirInt: 1.05, hemiTop: 0xeae3d0, hemiBot: 0x3a3530, exposure: 1.0 },
  { h: 13,  sky: 0xaecadc, fog: 0xd2d1c6, fogNear: 240, fogFar: 540, ground: 0x5e6c47, ambient: 0.50, dirInt: 1.20, hemiTop: 0xf4ede0, hemiBot: 0x3a3530, exposure: 1.0 },
  { h: 17,  sky: 0xc88a5a, fog: 0xa07050, fogNear: 200, fogFar: 480, ground: 0x4d4630, ambient: 0.35, dirInt: 0.90, hemiTop: 0xd49060, hemiBot: 0x2a221c, exposure: 1.05 },
  { h: 19,  sky: 0x7a3a26, fog: 0x3a2820, fogNear: 150, fogFar: 420, ground: 0x36322a, ambient: 0.18, dirInt: 0.32, hemiTop: 0x8a4a32, hemiBot: 0x18120e, exposure: 1.15 },
  { h: 21,  sky: 0x1a1018, fog: 0x100c0a, fogNear: 130, fogFar: 380, ground: 0x2a2825, ambient: 0.08, dirInt: 0.08, hemiTop: 0x1a1410, hemiBot: 0x080605, exposure: 1.25 },
  { h: 24,  sky: 0x080706, fog: 0x080706, fogNear: 100, fogFar: 380, ground: 0x252320, ambient: 0.05, dirInt: 0.04, hemiTop: 0x101010, hemiBot: 0x050505, exposure: 1.2 },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(a, b, t) {
  const ac = new THREE.Color(a), bc = new THREE.Color(b);
  return ac.lerp(bc, t).getHex();
}
function palette(hour) {
  let i = 0;
  while (i < KEY_PALETTES.length - 1 && KEY_PALETTES[i + 1].h <= hour) i++;
  const p0 = KEY_PALETTES[i], p1 = KEY_PALETTES[Math.min(i + 1, KEY_PALETTES.length - 1)];
  const t = (hour - p0.h) / Math.max(0.001, (p1.h - p0.h));
  return {
    sky:     lerpColor(p0.sky, p1.sky, t),
    fog:     lerpColor(p0.fog, p1.fog, t),
    fogNear: lerp(p0.fogNear, p1.fogNear, t),
    fogFar:  lerp(p0.fogFar,  p1.fogFar,  t),
    ground:  lerpColor(p0.ground,  p1.ground,  t),
    ambient: lerp(p0.ambient, p1.ambient, t),
    dirInt:  lerp(p0.dirInt,  p1.dirInt,  t),
    hemiTop: lerpColor(p0.hemiTop, p1.hemiTop, t),
    hemiBot: lerpColor(p0.hemiBot, p1.hemiBot, t),
    exposure: lerp(p0.exposure, p1.exposure, t),
  };
}

// Sun position parametric by hour. Sun rises in east, sets in west.
function sunPosition(hour, distance = 200) {
  // angle from horizontal: 0 at 6 / 18, peak ~80° at 12
  const dayProgress = (hour - 6) / 12;    // -.5 .. 1.5
  const t = Math.max(-0.2, Math.min(1.2, dayProgress));
  const angle = t * Math.PI;               // 0 at 6am, π at 6pm
  const elevation = Math.sin(angle) * Math.PI * 0.42;
  const azimuth = angle - Math.PI / 2;     // east → south → west
  return new THREE.Vector3(
    Math.cos(elevation) * Math.sin(azimuth) * distance,
    Math.sin(elevation) * distance,
    Math.cos(elevation) * Math.cos(azimuth) * distance
  );
}

export function buildLights(scene, renderer) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xf4ede0, 0x3a3530, 0.55);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -180;
  sun.shadow.camera.right = 180;
  sun.shadow.camera.top = 180;
  sun.shadow.camera.bottom = -180;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 500;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.04;
  scene.add(sun);
  scene.add(sun.target);

  // Sun visual (a small bright sprite for visual interest)
  const sunHalo = new THREE.Sprite(new THREE.SpriteMaterial({
    color: 0xfff2c8, opacity: 0.85, transparent: true,
    depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  }));
  sunHalo.scale.set(28, 28, 1);
  sunHalo.renderOrder = -1;
  scene.add(sunHalo);

  function apply(hour) {
    const p = palette(hour);
    scene.background = new THREE.Color(p.sky);
    if (!scene.fog) scene.fog = new THREE.Fog(p.fog, p.fogNear, p.fogFar);
    scene.fog.color.setHex(p.fog);
    scene.fog.near = p.fogNear;
    scene.fog.far = p.fogFar;
    ambient.intensity = p.ambient;
    hemi.color.setHex(p.hemiTop);
    hemi.groundColor.setHex(p.hemiBot);
    sun.intensity = p.dirInt;
    const sp = sunPosition(hour);
    sun.position.copy(sp);
    sun.target.position.set(0, 0, 0);
    sun.target.updateMatrixWorld();
    sunHalo.position.copy(sp).multiplyScalar(0.8);
    sunHalo.material.opacity = sp.y > 5 ? 0.85 : Math.max(0, sp.y / 6 * 0.85);
    renderer.toneMappingExposure = p.exposure;
    return p;
  }

  return { ambient, hemi, sun, sunHalo, apply, sunPosition };
}

// ── Floodlights ────────────────────────────────────────────────
export function buildFloodlights(scene, positions) {
  const group = new THREE.Group();
  scene.add(group);
  const sharedMast = new THREE.MeshStandardMaterial({ color: 0x3a342e, roughness: 0.7, metalness: 0.4 });
  const sharedHousing = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.6 });
  const bulbMats = [];
  const points = [];
  const halos = [];

  for (const pos of positions) {
    const fl = new THREE.Group();
    fl.position.set(...pos);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, 32, 8), sharedMast);
    mast.position.y = 16; mast.castShadow = true; fl.add(mast);
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 1.6), sharedHousing);
    housing.position.y = 32; housing.castShadow = true; fl.add(housing);
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xffd87a, emissive: 0xffd87a, emissiveIntensity: 1.5 });
    const bulb = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.6), bulbMat);
    bulb.position.set(0, 31.5, 0.81);
    fl.add(bulb);
    const point = new THREE.PointLight(0xffd87a, 1.0, 160, 1.4);
    point.position.set(0, 31, 0);
    fl.add(point);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      color: 0xffd87a, opacity: 0.18, transparent: true,
      depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    halo.scale.set(5, 5, 1);
    halo.position.set(0, 31.6, 0);
    fl.add(halo);
    group.add(fl);
    bulbMats.push(bulbMat);
    points.push(point);
    halos.push(halo);
  }

  // Set intensity 0..1 (auto-set by time-of-day driver)
  function setIntensity(t) {
    const tt = Math.max(0, Math.min(1, t));
    for (let i = 0; i < bulbMats.length; i++) {
      bulbMats[i].emissiveIntensity = 0.4 + tt * 2.2;
      points[i].intensity = tt * 1.6;
      halos[i].material.opacity = 0.05 + tt * 0.35;
    }
  }
  function setVisible(v) { group.visible = v; }

  return { group, setIntensity, setVisible };
}
