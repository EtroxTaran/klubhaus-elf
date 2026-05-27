// campus.js — procedural Anstoss-style club campus ("Vereinsgelände").
// Stadium bowl + floodlights + scoreboard + forecourt/gates, surrounded by
// parking, training pitches, campus buildings (academy, medical, fan shop,
// museum, hotel, catering) and greenery. Grounded in
// docs/50-Game-Design/stadium-and-campus.md. Cheap to render: thin instances
// for cars + trees, merged static chunks, frozen materials. Colours come from
// the shared design tokens (see config.js → aurelia.css :root).
import {
  pal, hexToColor3,
  FIELD, BORDER, STAND, FORECOURT, GROUND_SIZE, PARKING, TRAINING, BUILDINGS,
} from './config.js';

const cssStr = (name, fb) => {
  const v = (typeof document !== 'undefined'
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() : '');
  return v || fb;
};

function mat(scene, name, color3, { spec = 0.03, freeze = true } = {}) {
  const m = new BABYLON.StandardMaterial(name, scene);
  m.diffuseColor = color3;
  m.specularColor = new BABYLON.Color3(spec, spec, spec);
  if (freeze) m.freeze();
  return m;
}
function box(scene, name, size, pos, material, parent) {
  const b = BABYLON.MeshBuilder.CreateBox(name, size, scene);
  b.position.set(pos[0], pos[1], pos[2]);
  if (material) b.material = material;
  if (parent) b.parent = parent;
  b.isPickable = false;
  return b;
}
function ground(scene, name, w, d, pos, material, parent) {
  const g = BABYLON.MeshBuilder.CreateGround(name, { width: w, height: d }, scene);
  g.position.set(pos[0], pos[1], pos[2]);
  g.material = material;
  if (parent) g.parent = parent;
  g.isPickable = false;
  g.freezeWorldMatrix();   // frozen AFTER positioning
  return g;
}
function pushMatrix(arr, x, y, z, ry = 0, s = 1) {
  const m = BABYLON.Matrix.Compose(
    new BABYLON.Vector3(s, s, s),
    BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Y, ry),
    new BABYLON.Vector3(x, y, z));
  for (let k = 0; k < 16; k++) arr.push(m.m[k]);
}
// deterministic pseudo-random in [0,1) so the layout is stable across loads
function rnd(i) { const v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); }

function makeLabel(scene, text, parent) {
  const dt = new BABYLON.DynamicTexture('lbl-' + text, { width: 256, height: 72 }, scene, true);
  dt.hasAlpha = true;
  const ctx = dt.getContext();
  ctx.clearRect(0, 0, 256, 72);
  ctx.fillStyle = cssStr('--paper', '#f4ede0');
  ctx.fillRect(8, 14, 240, 44);
  dt.drawText(text, null, 47, "600 30px 'Inter', sans-serif", cssStr('--ink', '#1a1410'), null, true, true);
  const m = new BABYLON.StandardMaterial('lblmat-' + text, scene);
  m.diffuseTexture = dt; m.opacityTexture = dt;
  m.emissiveColor = new BABYLON.Color3(1, 1, 1); m.disableLighting = true; m.backFaceCulling = false;
  const plane = BABYLON.MeshBuilder.CreatePlane('lbl', { width: 22, height: 6.2 }, scene);
  plane.material = m;
  plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
  plane.isPickable = false;
  if (parent) plane.parent = parent;
  return plane;
}

export function buildCampus(scene, { accent = 0xb7301b } = {}) {
  const root = new BABYLON.TransformNode('campus', scene);
  const layerOutdoor   = new BABYLON.TransformNode('layer-outdoor', scene);   layerOutdoor.parent = root;
  const layerTraining  = new BABYLON.TransformNode('layer-training', scene);  layerTraining.parent = root;
  const layerBuildings = new BABYLON.TransformNode('layer-buildings', scene); layerBuildings.parent = root;

  // ── Shared materials ──────────────────────────────────────────
  const matGround   = mat(scene, 'm-ground', pal('ground'));
  const matGrass    = mat(scene, 'm-grass', pal('grass'));
  const matGrass2   = mat(scene, 'm-grass2', pal('grassDark'));
  const matBorder   = mat(scene, 'm-border', pal('paper2'));
  const matLine     = mat(scene, 'm-line', pal('paper'));
  const matConcrete = mat(scene, 'm-concrete', pal('rule'));
  const matRoof     = mat(scene, 'm-roof', pal('ink2'));
  const matInk      = mat(scene, 'm-ink', pal('ink'));
  const matMast     = mat(scene, 'm-mast', pal('muted'));
  const matHead     = mat(scene, 'm-head', pal('paper2'));
  const matWall     = mat(scene, 'm-wall', pal('paper'));
  const matAsphalt  = mat(scene, 'm-asphalt', pal('asphalt'));
  const matTrunk    = mat(scene, 'm-trunk', pal('muted'));
  const matTree     = mat(scene, 'm-tree', pal('grassDark'));
  const matCarGrey  = mat(scene, 'm-car', hexToColor3(0x9a9088));
  // Accent materials — NOT frozen so the club accent can recolour them.
  const accentC3 = hexToColor3(accent);
  const matStand    = mat(scene, 'm-stand', accentC3.clone(), { freeze: false });
  const matTrim     = mat(scene, 'm-trim', accentC3.clone(), { freeze: false });
  const matCarAcc   = mat(scene, 'm-car-acc', accentC3.clone(), { freeze: false });
  const matScore    = mat(scene, 'm-score', accentC3.clone(), { spec: 0.1, freeze: false });

  // ── Ground + forecourt plaza ──────────────────────────────────
  ground(scene, 'ground', GROUND_SIZE, GROUND_SIZE, [0, -0.05, 0], matGround, root);
  ground(scene, 'forecourt', FORECOURT.w, FORECOURT.h, [0, 0.0, 0], matConcrete, root);

  // ── Pitch (border + field + markings) ─────────────────────────
  ground(scene, 'pitch-border', BORDER.w, BORDER.h, [0, 0.05, 0], matBorder, root);
  ground(scene, 'pitch-field', FIELD.w, FIELD.h, [0, 0.08, 0], matGrass, root);
  const marks = [];
  const halfLine = box(scene, 'halfline', { width: FIELD.w - 10, height: 0.16, depth: 0.6 }, [0, 0.13, 0], null);
  marks.push(halfLine);
  const circle = BABYLON.MeshBuilder.CreateTorus('circle', { diameter: 18, thickness: 0.5, tessellation: 44 }, scene);
  circle.position.y = 0.13; marks.push(circle);
  const ow = FIELD.w - 10, oh = FIELD.h - 10;
  const edge = (w, d, x, z) => marks.push(box(scene, 'edge', { width: w, height: 0.16, depth: d }, [x, 0.13, z], null));
  edge(ow, 0.6, 0, oh / 2); edge(ow, 0.6, 0, -oh / 2);
  edge(0.6, oh, ow / 2, 0); edge(0.6, oh, -ow / 2, 0);
  const markings = BABYLON.Mesh.MergeMeshes(marks, true, true, undefined, false, false);
  if (markings) { markings.material = matLine; markings.isPickable = false; markings.parent = root; markings.freezeWorldMatrix(); }

  // ── Stands (4 sides: accent front + ink roof slab) ────────────
  const sh = STAND.height, sd = STAND.depth;
  function stand(name, along, sidePos) {
    // along 'x' → N/S stand (long axis x); 'z' → E/W stand (long axis z)
    const long = along === 'x' ? FIELD.w + 26 : sd;
    const deep = along === 'x' ? sd : FIELD.h + 14;
    const pos = along === 'x' ? [0, sh / 2, sidePos] : [sidePos, sh / 2, 0];
    box(scene, name, { width: long, height: sh, depth: deep }, pos, matStand, root).freezeWorldMatrix();
    // roof slab, overhanging toward the pitch
    const rlong = along === 'x' ? FIELD.w + 30 : sd + 6;
    const rdeep = along === 'x' ? sd + 6 : FIELD.h + 18;
    const shift = Math.sign(sidePos) * -3; // toward centre
    const rpos = along === 'x' ? [0, sh + STAND.roof / 2, sidePos + shift] : [sidePos + shift, sh + STAND.roof / 2, 0];
    box(scene, name + '-roof', { width: rlong, height: STAND.roof, depth: rdeep }, rpos, matRoof, root).freezeWorldMatrix();
  }
  stand('stand-n', 'x', -(FIELD.h / 2 + sd / 2 + 1));
  stand('stand-s', 'x',  (FIELD.h / 2 + sd / 2 + 1));
  stand('stand-w', 'z', -(FIELD.w / 2 + sd / 2 + 1));
  stand('stand-e', 'z',  (FIELD.w / 2 + sd / 2 + 1));

  // ── Floodlight masts (4 corners) ──────────────────────────────
  const masts = [], heads = [];
  const cx = FIELD.w / 2 + 9, cz = FIELD.h / 2 + 9, mh = 28;
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const m = BABYLON.MeshBuilder.CreateCylinder('mast', { diameter: 1.7, height: mh, tessellation: 8 }, scene);
    m.position.set(sx * cx, mh / 2, sz * cz); masts.push(m);
    const h = box(scene, 'head', { width: 7, height: 2.4, depth: 3 }, [sx * cx, mh, sz * cz], null);
    heads.push(h);
  }
  const mastMesh = BABYLON.Mesh.MergeMeshes(masts, true, true, undefined, false, false);
  if (mastMesh) { mastMesh.material = matMast; mastMesh.isPickable = false; mastMesh.parent = root; mastMesh.freezeWorldMatrix(); }
  const headMesh = BABYLON.Mesh.MergeMeshes(heads, true, true, undefined, false, false);
  if (headMesh) { headMesh.material = matHead; headMesh.isPickable = false; headMesh.parent = root; headMesh.freezeWorldMatrix(); }

  // ── Scoreboard (behind north stand) ───────────────────────────
  const sbZ = -(FIELD.h / 2 + sd + 12);
  const pylon = BABYLON.MeshBuilder.CreateCylinder('sb-pylon', { diameter: 2.4, height: 16, tessellation: 10 }, scene);
  pylon.position.set(0, 8, sbZ); pylon.material = matMast; pylon.isPickable = false; pylon.parent = root; pylon.freezeWorldMatrix();
  box(scene, 'sb-panel', { width: 27, height: 9.5, depth: 1.6 }, [0, 19, sbZ], matInk, root).freezeWorldMatrix();
  box(scene, 'sb-face', { width: 24, height: 7, depth: 0.5 }, [0, 19, sbZ + 1.0], matScore, root).freezeWorldMatrix();

  // ── Forecourt gates (north) ───────────────────────────────────
  for (let i = -2; i <= 2; i++) {
    box(scene, 'gate', { width: 5, height: 5, depth: 2 }, [i * 12, 2.5, -(FORECOURT.h / 2 - 7)], matInk, root).freezeWorldMatrix();
  }
  // stadium name sign on the forecourt
  const sign = makeLabel(scene, 'AURELIA ARENA', root);
  sign.scaling.set(1.6, 1.6, 1.6);
  sign.position.set(0, 11, -(FORECOURT.h / 2 - 4));

  // ── Parking (layer: outdoor) ──────────────────────────────────
  const carGrey = box(scene, 'car', { width: 3.4, height: 1.5, depth: 6.8 }, [0, -999, 0], matCarGrey, layerOutdoor);
  const carAcc  = box(scene, 'car-acc', { width: 3.4, height: 1.5, depth: 6.8 }, [0, -999, 0], matCarAcc, layerOutdoor);
  const greyM = [], accM = [];
  let carN = 0;
  for (const lot of PARKING) {
    ground(scene, 'lot', lot.w, lot.d, [lot.x, 0.03, lot.z], matAsphalt, layerOutdoor);
    const cols = Math.max(1, Math.floor(lot.w / 4.4));
    const rows = Math.max(1, Math.floor(lot.d / 8.6));
    const ox = lot.x - ((cols - 1) * 4.4) / 2;
    const oz = lot.z - ((rows - 1) * 8.6) / 2;
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++, carN++) {
      pushMatrix(carN % 5 === 0 ? accM : greyM, ox + c * 4.4, 0.78, oz + r * 8.6);
    }
  }
  carGrey.thinInstanceSetBuffer('matrix', new Float32Array(greyM), 16, true);
  carAcc.thinInstanceSetBuffer('matrix', new Float32Array(accM), 16, true);
  for (const c of [carGrey, carAcc]) { c.doNotSyncBoundingInfo = true; c.freezeWorldMatrix(); }

  // ── Trees (layer: outdoor) ────────────────────────────────────
  const cone = BABYLON.MeshBuilder.CreateCylinder('tree-top', { diameterTop: 0, diameterBottom: 6.4, height: 10, tessellation: 7 }, scene);
  cone.material = matTree; cone.isPickable = false; cone.parent = layerOutdoor;
  const trunk = BABYLON.MeshBuilder.CreateCylinder('tree-trunk', { diameter: 1.5, height: 4, tessellation: 6 }, scene);
  trunk.material = matTrunk; trunk.isPickable = false; trunk.parent = layerOutdoor;
  const topM = [], trM = [];
  let t = 0;
  // ring of trees around the campus perimeter, jittered, skipping the centre band
  for (let i = 0; i < 64; i++) {
    const ang = (i / 64) * Math.PI * 2;
    const rad = 250 + rnd(i) * 40;
    const x = Math.cos(ang) * rad * 0.95;
    const z = Math.sin(ang) * rad;
    if (Math.abs(x) < 120 && Math.abs(z) < 150) continue; // keep parking/buildings clear
    const s = 0.7 + rnd(i + 100) * 0.6;
    pushMatrix(trM, x, 2, z, 0, s);
    pushMatrix(topM, x, 4 + 5 * s, z, rnd(i) * 6, s);
    t++;
  }
  cone.thinInstanceSetBuffer('matrix', new Float32Array(topM), 16, true);
  trunk.thinInstanceSetBuffer('matrix', new Float32Array(trM), 16, true);
  for (const m of [cone, trunk]) { m.doNotSyncBoundingInfo = true; m.freezeWorldMatrix(); }

  // ── Training pitches (layer: training) ────────────────────────
  for (let i = 0; i < TRAINING.length; i++) {
    const tp = TRAINING[i];
    ground(scene, 'train-' + i, tp.w, tp.d, [tp.x, 0.04, tp.z], i % 2 ? matGrass2 : matGrass, layerTraining);
    const out = [];
    const w = tp.w - 4, d = tp.d - 4;
    out.push(box(scene, 'te', { width: w, height: 0.14, depth: 0.5 }, [tp.x, 0.1, tp.z + d / 2], null));
    out.push(box(scene, 'te', { width: w, height: 0.14, depth: 0.5 }, [tp.x, 0.1, tp.z - d / 2], null));
    out.push(box(scene, 'te', { width: 0.5, height: 0.14, depth: d }, [tp.x + w / 2, 0.1, tp.z], null));
    out.push(box(scene, 'te', { width: 0.5, height: 0.14, depth: d }, [tp.x - w / 2, 0.1, tp.z], null));
    const om = BABYLON.Mesh.MergeMeshes(out, true, true, undefined, false, false);
    if (om) { om.material = matLine; om.isPickable = false; om.parent = layerTraining; om.freezeWorldMatrix(); }
  }
  makeLabel(scene, 'Trainingsgelände', layerTraining).position.set(TRAINING[0].x, 14, TRAINING[0].z - 30);

  // ── Campus buildings (layer: buildings) ───────────────────────
  for (const b of BUILDINGS) {
    box(scene, 'bld-' + b.label, { width: b.w, height: b.h, depth: b.d }, [b.x, b.h / 2, b.z], matWall, layerBuildings).freezeWorldMatrix();
    box(scene, 'bld-roof', { width: b.w + 2, height: 1.3, depth: b.d + 2 }, [b.x, b.h + 0.65, b.z], matRoof, layerBuildings).freezeWorldMatrix();
    box(scene, 'bld-trim', { width: b.w + 0.6, height: 1.6, depth: b.d + 0.6 }, [b.x, b.h - 2.2, b.z], matTrim, layerBuildings).freezeWorldMatrix();
    const lbl = makeLabel(scene, b.label, layerBuildings);
    lbl.position.set(b.x, b.h + 7, b.z);
  }

  // ── API ───────────────────────────────────────────────────────
  function setAccent(hex) {
    const c = hexToColor3(hex);
    for (const m of [matStand, matTrim, matCarAcc, matScore]) m.diffuseColor = c;
  }
  const layers = { outdoor: layerOutdoor, training: layerTraining, buildings: layerBuildings };
  function setLayer(name, on) { if (layers[name]) layers[name].setEnabled(on); }

  return { root, setAccent, setLayer, layers };
}
