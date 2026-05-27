// grid.js — procedural isometric campus: a tiled ground plane with a pitch in
// the centre and four stand blocks. Built for cheap rendering:
//   • the whole tile field is two thin-instanced meshes (one draw call each),
//   • static materials are frozen,
//   • only the stands keep a live material so the club accent can change.
import { GRID, PITCH, PAPER, hexToColor3 } from './config.js';

// Footprint (world units) the pitch + border occupy; tiles inside are skipped.
const BORDER = { w: 84, h: 121 };   // cream border ground
const FIELD  = { w: 78, h: 115 };   // green playing field

function mat(scene, name, hex, { freeze = true, spec = 0 } = {}) {
  const m = new BABYLON.StandardMaterial(name, scene);
  m.diffuseColor = hexToColor3(hex);
  m.specularColor = new BABYLON.Color3(spec, spec, spec);
  if (freeze) m.freeze();
  return m;
}

function pushMatrix(arr, x, y, z) {
  const m = BABYLON.Matrix.Translation(x, y, z);
  for (let k = 0; k < 16; k++) arr.push(m.m[k]);
}

export function buildCampus(scene, { accent = 0xb7301b } = {}) {
  const meshes = [];

  // ── Base ground (large, sits just under the tiles) ──────────────
  const ground = BABYLON.MeshBuilder.CreateGround('iso-ground', { width: 1600, height: 1600 }, scene);
  ground.position.y = -0.05;
  ground.material = mat(scene, 'iso-ground-mat', PAPER.ground);
  ground.isPickable = false;
  ground.receiveShadows = false;
  ground.freezeWorldMatrix();
  meshes.push(ground);

  // ── Tile field (two thin-instanced meshes, checkerboard) ────────
  const edge = GRID.tile - GRID.gap;
  const light = BABYLON.MeshBuilder.CreateBox('iso-tile-light', { width: edge, depth: edge, height: GRID.height }, scene);
  const dark  = BABYLON.MeshBuilder.CreateBox('iso-tile-dark',  { width: edge, depth: edge, height: GRID.height }, scene);
  light.material = mat(scene, 'iso-tile-light-mat', PAPER.paper);
  dark.material  = mat(scene, 'iso-tile-dark-mat',  PAPER.paper2);

  const halfCols = (GRID.cols - 1) / 2;
  const halfRows = (GRID.rows - 1) / 2;
  const lightM = [];
  const darkM = [];
  const skipX = BORDER.w / 2 + GRID.tile * 0.5;
  const skipZ = BORDER.h / 2 + GRID.tile * 0.5;
  for (let i = 0; i < GRID.cols; i++) {
    for (let j = 0; j < GRID.rows; j++) {
      const x = (i - halfCols) * GRID.tile;
      const z = (j - halfRows) * GRID.tile;
      if (Math.abs(x) < skipX && Math.abs(z) < skipZ) continue; // pitch footprint
      const y = GRID.height / 2;
      if ((i + j) % 2 === 0) pushMatrix(lightM, x, y, z);
      else pushMatrix(darkM, x, y, z);
    }
  }
  light.thinInstanceSetBuffer('matrix', new Float32Array(lightM), 16, true);
  dark.thinInstanceSetBuffer('matrix', new Float32Array(darkM), 16, true);
  for (const t of [light, dark]) {
    t.isPickable = false;
    t.doNotSyncBoundingInfo = true;
    t.freezeWorldMatrix();
    meshes.push(t);
  }

  // ── Pitch (cream border + green field + markings) ───────────────
  const border = BABYLON.MeshBuilder.CreateGround('iso-pitch-border', { width: BORDER.w, height: BORDER.h }, scene);
  border.position.y = GRID.height + 0.02;
  border.material = mat(scene, 'iso-pitch-border-mat', PAPER.paper2);
  border.isPickable = false; border.freezeWorldMatrix();
  meshes.push(border);

  const field = BABYLON.MeshBuilder.CreateGround('iso-pitch-field', { width: FIELD.w, height: FIELD.h }, scene);
  field.position.y = GRID.height + 0.05;
  field.material = mat(scene, 'iso-pitch-field-mat', PAPER.grass);
  field.isPickable = false; field.freezeWorldMatrix();
  meshes.push(field);

  // markings (white-ish), grouped under a TransformNode then merged
  const lineMat = mat(scene, 'iso-line-mat', 0xf0ead9);
  const marks = [];
  const halfLine = BABYLON.MeshBuilder.CreateBox('iso-halfline', { width: FIELD.w - 8, height: 0.18, depth: 0.6 }, scene);
  halfLine.position.y = GRID.height + 0.12;
  marks.push(halfLine);
  const circle = BABYLON.MeshBuilder.CreateTorus('iso-circle', { diameter: 18, thickness: 0.5, tessellation: 48 }, scene);
  circle.position.y = GRID.height + 0.12;
  marks.push(circle);
  // simple rectangle outline via four thin boxes
  const ow = FIELD.w - 8, oh = FIELD.h - 8;
  const mk = (w, d, x, z) => {
    const b = BABYLON.MeshBuilder.CreateBox('iso-edge', { width: w, height: 0.18, depth: d }, scene);
    b.position.set(x, GRID.height + 0.12, z);
    marks.push(b);
  };
  mk(ow, 0.6, 0, oh / 2); mk(ow, 0.6, 0, -oh / 2);
  mk(0.6, oh, ow / 2, 0); mk(0.6, oh, -ow / 2, 0);
  const markings = BABYLON.Mesh.MergeMeshes(marks, true, true, undefined, false, false);
  if (markings) {
    markings.name = 'iso-markings';
    markings.material = lineMat;
    markings.isPickable = false;
    markings.freezeWorldMatrix();
    meshes.push(markings);
  }

  // ── Stands (four blocks around the pitch, club accent) ──────────
  const standH = 11;
  const standMat = new BABYLON.StandardMaterial('iso-stand-mat', scene);
  standMat.diffuseColor = hexToColor3(accent);
  standMat.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);
  const standParts = [];
  const ns = (z) => BABYLON.MeshBuilder.CreateBox('iso-stand', { width: FIELD.w + 22, height: standH, depth: 13 }, scene).setAbsolutePosition(new BABYLON.Vector3(0, standH / 2, z));
  const ew = (x) => BABYLON.MeshBuilder.CreateBox('iso-stand', { width: 13, height: standH, depth: FIELD.h + 4 }, scene).setAbsolutePosition(new BABYLON.Vector3(x, standH / 2, 0));
  standParts.push(ns(FIELD.h / 2 + 9), ns(-(FIELD.h / 2 + 9)), ew(FIELD.w / 2 + 9), ew(-(FIELD.w / 2 + 9)));
  const stands = BABYLON.Mesh.MergeMeshes(standParts, true, true, undefined, false, false);
  stands.name = 'iso-stands';
  stands.material = standMat;          // NOT frozen → setAccent can recolour
  stands.isPickable = false;
  stands.addLODLevel(900, null);       // cull the stands when very far out
  meshes.push(stands);

  function setAccent(hex) { standMat.diffuseColor = hexToColor3(hex); }

  return { meshes, setAccent, stands };
}
