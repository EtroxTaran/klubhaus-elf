// lights.js — Sun + sky + hemisphere + floodlights + time-of-day animation (Babylon).
import { lerp, lerpHex, hexToColor3 } from './config.js';

// Key palettes by hour. We lerp between them for any continuous time.
const KEY_PALETTES = [
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

function palette(hour) {
  let i = 0;
  while (i < KEY_PALETTES.length - 1 && KEY_PALETTES[i + 1].h <= hour) i++;
  const p0 = KEY_PALETTES[i], p1 = KEY_PALETTES[Math.min(i + 1, KEY_PALETTES.length - 1)];
  const t = (hour - p0.h) / Math.max(0.001, (p1.h - p0.h));
  return {
    sky:     lerpHex(p0.sky, p1.sky, t),
    fog:     lerpHex(p0.fog, p1.fog, t),
    fogNear: lerp(p0.fogNear, p1.fogNear, t),
    fogFar:  lerp(p0.fogFar,  p1.fogFar,  t),
    ground:  lerpHex(p0.ground,  p1.ground,  t),
    ambient: lerp(p0.ambient, p1.ambient, t),
    dirInt:  lerp(p0.dirInt,  p1.dirInt,  t),
    hemiTop: lerpHex(p0.hemiTop, p1.hemiTop, t),
    hemiBot: lerpHex(p0.hemiBot, p1.hemiBot, t),
    exposure: lerp(p0.exposure, p1.exposure, t),
  };
}

function sunPosition(hour, distance = 200) {
  const dayProgress = (hour - 6) / 12;
  const t = Math.max(-0.2, Math.min(1.2, dayProgress));
  const angle = t * Math.PI;
  const elevation = Math.sin(angle) * Math.PI * 0.42;
  const azimuth = angle - Math.PI / 2;
  return new BABYLON.Vector3(
    Math.cos(elevation) * Math.sin(azimuth) * distance,
    Math.sin(elevation) * distance,
    Math.cos(elevation) * Math.cos(azimuth) * distance
  );
}

export function buildLights(scene) {
  // HemisphericLight handles "ambient + skydome" duties in Babylon.
  const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.55;
  hemi.diffuse = hexToColor3(0xf4ede0);
  hemi.groundColor = hexToColor3(0x3a3530);

  // A second hemi acts as a flat ambient floor light so dark sides aren't pure black.
  const ambient = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, -1, 0), scene);
  ambient.intensity = 0.20;
  ambient.diffuse = new BABYLON.Color3(1, 1, 1);
  ambient.groundColor = new BABYLON.Color3(1, 1, 1);

  // Sun — DirectionalLight. Babylon directional lights point in `direction`,
  // so we synthesize direction = -normalize(sun_world_position).
  const sun = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-1, -1, -1), scene);
  sun.intensity = 1.1;
  sun.diffuse = new BABYLON.Color3(1, 1, 1);
  sun.specular = new BABYLON.Color3(0.4, 0.4, 0.4);
  sun.position = new BABYLON.Vector3(150, 200, 150);
  sun.shadowMinZ = 1;
  sun.shadowMaxZ = 500;
  sun.shadowOrthoScale = 0;  // we'll override with explicit width/height below
  // For a tighter shadow frustum covering the stadium
  sun.autoUpdateExtends = false;
  sun.orthoLeft = -180;
  sun.orthoRight = 180;
  sun.orthoTop = 180;
  sun.orthoBottom = -180;

  // Shadow generator
  const shadowGen = new BABYLON.ShadowGenerator(2048, sun);
  shadowGen.usePercentageCloserFiltering = true;
  shadowGen.filteringQuality = BABYLON.ShadowGenerator.QUALITY_MEDIUM;
  shadowGen.bias = 0.0005;
  shadowGen.normalBias = 0.04;
  shadowGen.darkness = 0.35;

  // ── Sun visual halo — billboarded additive plane ──
  const sunHaloMat = new BABYLON.StandardMaterial('sunHaloMat', scene);
  sunHaloMat.emissiveColor = hexToColor3(0xfff2c8);
  sunHaloMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
  sunHaloMat.specularColor = new BABYLON.Color3(0, 0, 0);
  sunHaloMat.disableLighting = true;
  sunHaloMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
  sunHaloMat.alpha = 0.85;

  const sunHalo = BABYLON.MeshBuilder.CreatePlane('sunHalo', { size: 28 }, scene);
  sunHalo.material = sunHaloMat;
  sunHalo.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  sunHalo.renderingGroupId = 0;
  sunHalo.isPickable = false;
  sunHalo.alwaysSelectAsActiveMesh = true;

  let lastGround = 0x5e6c47;

  function apply(hour) {
    const p = palette(hour);
    scene.clearColor = new BABYLON.Color4(
      ((p.sky >> 16) & 255) / 255,
      ((p.sky >> 8) & 255) / 255,
      (p.sky & 255) / 255,
      1
    );

    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = hexToColor3(p.fog);
    scene.fogStart = p.fogNear;
    scene.fogEnd = p.fogFar;

    // Lights
    ambient.intensity = p.ambient;
    hemi.intensity = 0.40 + p.ambient * 0.4;
    hemi.diffuse = hexToColor3(p.hemiTop);
    hemi.groundColor = hexToColor3(p.hemiBot);

    sun.intensity = p.dirInt;
    const sp = sunPosition(hour);
    sun.position = sp.clone();
    // Direction = from sun toward origin, normalized
    sun.direction = sp.scale(-1).normalize();

    // Halo
    sunHalo.position = sp.scale(0.8);
    sunHaloMat.alpha = sp.y > 5 ? 0.85 : Math.max(0, sp.y / 6 * 0.85);

    // Tone mapping exposure
    if (scene.imageProcessingConfiguration) {
      scene.imageProcessingConfiguration.exposure = p.exposure;
    }

    lastGround = p.ground;
    return p;
  }

  apply._lastGround = () => lastGround;

  return { hemi, ambient, sun, sunHalo, shadowGen, apply, sunPosition };
}

// ── Floodlights ────────────────────────────────────────────────
export function buildFloodlights(scene, positions, shadowGen) {
  const root = new BABYLON.TransformNode('floods', scene);

  const mastMat = new BABYLON.StandardMaterial('mastMat', scene);
  mastMat.diffuseColor = hexToColor3(0x3a342e);
  mastMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

  const housingMat = new BABYLON.StandardMaterial('housingMat', scene);
  housingMat.diffuseColor = hexToColor3(0x1a1410);

  const bulbMats = [], points = [], halos = [];

  positions.forEach((pos, idx) => {
    const fl = new BABYLON.TransformNode(`flood_${idx}`, scene);
    fl.position = new BABYLON.Vector3(pos[0], pos[1], pos[2]);
    fl.parent = root;

    // Mast — cylinder, taper approximated with diameterTop/diameterBottom
    const mast = BABYLON.MeshBuilder.CreateCylinder(`mast_${idx}`, {
      height: 32, diameterTop: 0.44, diameterBottom: 0.64, tessellation: 8,
    }, scene);
    mast.position.y = 16;
    mast.material = mastMat;
    mast.parent = fl;
    if (shadowGen) shadowGen.addShadowCaster(mast);

    // Housing
    const housing = BABYLON.MeshBuilder.CreateBox(`housing_${idx}`, {
      width: 2.6, height: 0.8, depth: 1.6,
    }, scene);
    housing.position.y = 32;
    housing.material = housingMat;
    housing.parent = fl;
    if (shadowGen) shadowGen.addShadowCaster(housing);

    // Bulb plane
    const bulbMat = new BABYLON.StandardMaterial(`bulbMat_${idx}`, scene);
    bulbMat.diffuseColor = hexToColor3(0xffd87a);
    bulbMat.emissiveColor = hexToColor3(0xffd87a).scale(1.5);
    bulbMat.disableLighting = true;
    const bulb = BABYLON.MeshBuilder.CreatePlane(`bulb_${idx}`, { width: 2.2, height: 0.6 }, scene);
    bulb.position.set(0, 31.5, 0.81);
    bulb.material = bulbMat;
    bulb.parent = fl;

    // Point light
    const point = new BABYLON.PointLight(`point_${idx}`, new BABYLON.Vector3(0, 31, 0), scene);
    point.diffuse = hexToColor3(0xffd87a);
    point.intensity = 1.0;
    point.range = 160;
    point.parent = fl;

    // Halo — billboarded additive
    const haloMat = new BABYLON.StandardMaterial(`haloMat_${idx}`, scene);
    haloMat.emissiveColor = hexToColor3(0xffd87a);
    haloMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    haloMat.specularColor = new BABYLON.Color3(0, 0, 0);
    haloMat.disableLighting = true;
    haloMat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    haloMat.alpha = 0.18;
    const halo = BABYLON.MeshBuilder.CreatePlane(`halo_${idx}`, { size: 5 }, scene);
    halo.material = haloMat;
    halo.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    halo.position.set(0, 31.6, 0);
    halo.parent = fl;

    bulbMats.push(bulbMat);
    points.push(point);
    halos.push(haloMat);
  });

  function setIntensity(t) {
    const tt = Math.max(0, Math.min(1, t));
    for (let i = 0; i < bulbMats.length; i++) {
      bulbMats[i].emissiveColor = hexToColor3(0xffd87a).scale(0.4 + tt * 2.2);
      points[i].intensity = tt * 1.6;
      halos[i].alpha = 0.05 + tt * 0.35;
    }
  }
  function setVisible(v) { root.setEnabled(v); }

  return { root, setIntensity, setVisible };
}
