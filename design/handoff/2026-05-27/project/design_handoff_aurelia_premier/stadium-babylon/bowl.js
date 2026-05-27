// bowl.js — Continuous rounded-rectangle bowl, two-tier seating, crowd (Babylon).
// Uses ExtrudePolygon (depth=tiny → flat tread; depth=tall → back wall) with
// earcut for triangulation, and Thin Instances for crowd / VIP windows / struts.
import { BOWL, SECTORS, hexToColor3 } from './config.js';

// ── Geometry helpers ───────────────────────────────────────────
// Generate a closed contour for a rounded rectangle. Returns BABYLON.Vector3
// array in the XZ plane (Y=0). Counter-clockwise winding matches earcut's
// expected outer-shape orientation; holes will use clockwise winding.
function roundedRectContour(w, h, r, arcSegs = 18, clockwise = false) {
  const pts = [];
  const hw = w / 2 - r, hh = h / 2 - r;
  const V = (x, z) => new BABYLON.Vector3(x, 0, z);

  // Trace counter-clockwise starting bottom-right corner
  // Straight: right edge going up (z increasing)
  pts.push(V( hw + r, -hh));
  pts.push(V( hw + r,  hh));
  // Arc top-right (centre = +hw, +hh; angles 0 → π/2)
  for (let i = 1; i <= arcSegs; i++) {
    const a = (i / arcSegs) * (Math.PI / 2);
    pts.push(V(hw + Math.cos(a) * r, hh + Math.sin(a) * r));
  }
  // Top edge straight (x decreasing)
  pts.push(V(-hw, hh + r));
  // Arc top-left (centre = -hw, +hh; angles π/2 → π)
  for (let i = 1; i <= arcSegs; i++) {
    const a = Math.PI / 2 + (i / arcSegs) * (Math.PI / 2);
    pts.push(V(-hw + Math.cos(a) * r, hh + Math.sin(a) * r));
  }
  // Left edge straight (z decreasing)
  pts.push(V(-hw - r, -hh));
  // Arc bottom-left (centre = -hw, -hh; π → 3π/2)
  for (let i = 1; i <= arcSegs; i++) {
    const a = Math.PI + (i / arcSegs) * (Math.PI / 2);
    pts.push(V(-hw + Math.cos(a) * r, -hh + Math.sin(a) * r));
  }
  // Bottom edge straight (x increasing)
  pts.push(V( hw, -hh - r));
  // Arc bottom-right (centre = +hw, -hh; 3π/2 → 2π)
  for (let i = 1; i <= arcSegs; i++) {
    const a = 1.5 * Math.PI + (i / arcSegs) * (Math.PI / 2);
    pts.push(V(hw + Math.cos(a) * r, -hh + Math.sin(a) * r));
  }
  if (clockwise) pts.reverse();
  return pts;
}

// Sample N evenly-spaced points along the rounded-rect perimeter — used for
// placing crowd, VIP windows, struts. Returns {x, z} pairs.
function rowPerimeterSamples(w, h, r, N) {
  const straightW = Math.max(0, w - 2 * r);
  const straightH = Math.max(0, h - 2 * r);
  const arc = (Math.PI / 2) * r;
  const perim = 2 * straightW + 2 * straightH + 4 * arc;
  const out = [];
  for (let i = 0; i < N; i++) {
    let u = (i / N) * perim;
    // Walk segments in counter-clockwise order:
    // 0: right edge (x = w/2, z from -h/2+r to h/2-r), length straightH
    // 1: top-right arc, length arc
    // 2: top edge (z = h/2, x from w/2-r to -w/2+r), length straightW
    // 3: top-left arc
    // 4: left edge
    // 5: bottom-left arc
    // 6: bottom edge
    // 7: bottom-right arc
    let x, z;
    if (u < straightH) { x = w / 2; z = -h / 2 + r + u; }
    else if ((u -= straightH) < arc) {
      const a = u / r;
      x = w / 2 - r + Math.cos(a) * r;
      z = h / 2 - r + Math.sin(a) * r;
    } else if ((u -= arc) < straightW) {
      x = w / 2 - r - u; z = h / 2;
    } else if ((u -= straightW) < arc) {
      const a = Math.PI / 2 + u / r;
      x = -w / 2 + r + Math.cos(a) * r;
      z = h / 2 - r + Math.sin(a) * r;
    } else if ((u -= arc) < straightH) {
      x = -w / 2; z = h / 2 - r - u;
    } else if ((u -= straightH) < arc) {
      const a = Math.PI + u / r;
      x = -w / 2 + r + Math.cos(a) * r;
      z = -h / 2 + r + Math.sin(a) * r;
    } else if ((u -= arc) < straightW) {
      x = -w / 2 + r + u; z = -h / 2;
    } else {
      u -= straightW;
      const a = 1.5 * Math.PI + u / r;
      x = w / 2 - r + Math.cos(a) * r;
      z = -h / 2 + r + Math.sin(a) * r;
    }
    out.push({ x, z });
  }
  return out;
}

function rowDims(i) {
  const innerW = BOWL.innerW + 2 * i * BOWL.rowDepth;
  const innerH = BOWL.innerH + 2 * i * BOWL.rowDepth;
  const innerR = BOWL.cornerRadius + i * BOWL.rowDepth;
  const outerW = innerW + BOWL.rowDepth;
  const outerH = innerH + BOWL.rowDepth;
  const outerR = innerR + BOWL.rowDepth;
  return { innerW, innerH, innerR, outerW, outerH, outerR };
}

export function rowY(i) {
  const tierLift = (i >= BOWL.tier2Bottom) ? 2.6 : 0;
  return i * BOWL.rowHeight + tierLift;
}

export function sectorForPosition(x, z) {
  const a = Math.atan2(z, x);
  for (const [k, s] of Object.entries(SECTORS)) {
    let [a0, a1] = s.arc;
    if (a1 < a0) {
      if (a >= a0 || a <= a1) return k;
    } else {
      if (a >= a0 && a <= a1) return k;
    }
  }
  return null;
}

// Build an extruded ring (rounded-rect outer minus rounded-rect inner) at
// given Y position with depth. depth >= 0.01 → a slab; for treads we use
// a very thin depth so it reads as flat.
function buildRing(scene, name, outerW, outerH, outerR, innerW, innerH, innerR, y, depth, mat, arcSegs = 18) {
  const shape = roundedRectContour(outerW, outerH, outerR, arcSegs, false);
  const hole  = roundedRectContour(innerW, innerH, innerR, arcSegs, true); // CW for hole
  const mesh = BABYLON.MeshBuilder.ExtrudePolygon(name, {
    shape,
    holes: [hole],
    depth,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
  }, scene, earcut);
  // ExtrudePolygon extrudes downward from y=0; lift so TOP of the slab sits at `y`.
  mesh.position.y = y + depth;
  mesh.material = mat;
  return mesh;
}

// ── Main build ─────────────────────────────────────────────────
export function buildBowl(scene, { crowdDensity = 0.30, scarlet = 0xb7301b, secondary = 0xd9b04a } = {}) {
  const root = new BABYLON.TransformNode('bowl', scene);

  // Shared materials
  const matConcrete = new BABYLON.StandardMaterial('bowlConcrete', scene);
  matConcrete.diffuseColor = hexToColor3(0xc7baa5);
  matConcrete.specularColor = new BABYLON.Color3(0.04, 0.04, 0.04);

  const matConcreteDark = new BABYLON.StandardMaterial('bowlConcreteDark', scene);
  matConcreteDark.diffuseColor = hexToColor3(0x8e8270);
  matConcreteDark.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  const matAccent = new BABYLON.StandardMaterial('bowlAccent', scene);
  matAccent.diffuseColor = hexToColor3(scarlet);
  matAccent.specularColor = new BABYLON.Color3(0.08, 0.08, 0.08);

  const matVip = new BABYLON.StandardMaterial('bowlVip', scene);
  matVip.diffuseColor = hexToColor3(0x2a221c);
  matVip.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);

  const TREAD_THICK = 0.05;
  const CURVE_SEGMENTS = 18;

  // ── Pitch-level concrete plinth ──
  {
    const d0 = rowDims(0);
    const plinth = buildRing(
      scene, 'plinth',
      d0.innerW, d0.innerH, d0.innerR,
      d0.innerW - 4, d0.innerH - 4, d0.innerR - 2,
      0.02, TREAD_THICK, matConcrete, CURVE_SEGMENTS
    );
    plinth.receiveShadows = true;
    plinth.parent = root;
  }

  // ── Tread rings ──
  for (let i = 0; i < BOWL.rows; i++) {
    if (i === BOWL.tier1Top + 1) continue;  // tier-break gap
    const d = rowDims(i);
    const isAccentRow = (i === 1 || i === BOWL.rows - 2);
    const isVipRow    = (i === BOWL.tier1Top);
    const mat = isAccentRow ? matAccent : (isVipRow ? matVip : matConcrete);
    const tread = buildRing(
      scene, `tread_${i}`,
      d.outerW, d.outerH, d.outerR,
      d.innerW, d.innerH, d.innerR,
      rowY(i) + 0.01, TREAD_THICK, mat, CURVE_SEGMENTS
    );
    tread.receiveShadows = true;
    tread.parent = root;
  }

  // ── VIP boxes — thin-instanced glowing windows along the tier-break inner rim ──
  {
    const vipY = rowY(BOWL.tier1Top) + 0.7;
    const dV = rowDims(BOWL.tier1Top + 1);
    const samples = rowPerimeterSamples(dV.innerW, dV.innerH, dV.innerR, 96);

    const vipMat = new BABYLON.StandardMaterial('vipMat', scene);
    vipMat.diffuseColor = hexToColor3(0xfff2b8);
    vipMat.emissiveColor = hexToColor3(0xfff2b8).scale(0.45);
    vipMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    const vipBox = BABYLON.MeshBuilder.CreateBox('vipBox', {
      width: 2.4, height: 2.0, depth: 0.9,
    }, scene);
    vipBox.material = vipMat;
    vipBox.parent = root;
    vipBox.isVisible = false; // master mesh, only thin instances render
    vipBox.thinInstanceEnablePicking = false;

    const matrices = new Float32Array(samples.length * 16);
    const scale = new BABYLON.Vector3(1, 1, 1);
    samples.forEach((p, j) => {
      const yaw = Math.atan2(-p.x, -p.z);  // face center
      const rot = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
      const translation = new BABYLON.Vector3(p.x, vipY, p.z);
      const m = BABYLON.Matrix.Compose(scale, rot, translation);
      m.copyToArray(matrices, j * 16);
    });
    vipBox.thinInstanceSetBuffer('matrix', matrices, 16, true);
    // Re-show the mesh once thin instances are set
    vipBox.isVisible = true;
  }

  // ── Back wall — extruded ring rising above last row ──
  {
    const last = rowDims(BOWL.rows - 1);
    const wall = buildRing(
      scene, 'backWall',
      last.outerW + 1.2, last.outerH + 1.2, last.outerR + 0.6,
      last.outerW,       last.outerH,       last.outerR,
      rowY(BOWL.rows - 1) + 0.4, 7.0, matConcreteDark, CURVE_SEGMENTS
    );
    wall.receiveShadows = true;
    wall.parent = root;
  }

  // ── Roof — thin cantilevered ring above bowl ──
  const roofGroup = new BABYLON.TransformNode('roof', scene);
  roofGroup.parent = root;
  {
    const last = rowDims(BOWL.rows - 1);
    const roofY = rowY(BOWL.rows - 1) + 13;
    const overshoot = 6;
    const inner = rowDims(BOWL.tier2Bottom);

    const roofMat = new BABYLON.StandardMaterial('roofMat', scene);
    roofMat.diffuseColor = hexToColor3(0x231a13);
    roofMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    const roof = buildRing(
      scene, 'roofRing',
      last.outerW + 2.0, last.outerH + 2.0, last.outerR + 1.0,
      inner.innerW - overshoot, inner.innerH - overshoot, inner.innerR - 2,
      roofY, 0.35, roofMat, CURVE_SEGMENTS
    );
    roof.parent = roofGroup;

    // Support struts — thin-instanced cylinders around back perimeter
    const strutLen = roofY - 1.0;
    const strutMat = new BABYLON.StandardMaterial('strutMat', scene);
    strutMat.diffuseColor = hexToColor3(0x231a13);
    strutMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

    const strut = BABYLON.MeshBuilder.CreateCylinder('strut', {
      height: strutLen, diameter: 0.4, tessellation: 8,
    }, scene);
    strut.material = strutMat;
    strut.parent = roofGroup;
    strut.isVisible = false;

    const strutCount = 16;
    const strutSamples = rowPerimeterSamples(last.outerW + 0.4, last.outerH + 0.4, last.outerR + 0.2, strutCount);
    const sMatrices = new Float32Array(strutCount * 16);
    const sScale = new BABYLON.Vector3(1, 1, 1);
    const sRot = BABYLON.Quaternion.Identity();
    strutSamples.forEach((p, i) => {
      const t = new BABYLON.Vector3(p.x, strutLen / 2 + 0.6, p.z);
      BABYLON.Matrix.Compose(sScale, sRot, t).copyToArray(sMatrices, i * 16);
    });
    strut.thinInstanceSetBuffer('matrix', sMatrices, 16, true);
    strut.isVisible = true;
  }

  // ── Sector hover/select rings (ribbon arcs) ──
  const sectorMeshes = {};
  const sectorMats = {};
  {
    const rOuter = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 5;
    const rInner = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 1.5;
    for (const [key, s] of Object.entries(SECTORS)) {
      let [a0, a1] = s.arc;
      let arcLen = a1 - a0;
      if (arcLen < 0) arcLen += Math.PI * 2;
      const segs = 32;
      const inner = [], outer = [];
      for (let i = 0; i <= segs; i++) {
        const a = a0 + (i / segs) * arcLen;
        inner.push(new BABYLON.Vector3(Math.cos(a) * rInner, 0.04, Math.sin(a) * rInner));
        outer.push(new BABYLON.Vector3(Math.cos(a) * rOuter, 0.04, Math.sin(a) * rOuter));
      }
      const ring = BABYLON.MeshBuilder.CreateRibbon(`sector_${key}`, {
        pathArray: [inner, outer], sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      }, scene);
      const ringMat = new BABYLON.StandardMaterial(`sectorMat_${key}`, scene);
      ringMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
      ringMat.emissiveColor = hexToColor3(scarlet);
      ringMat.disableLighting = true;
      ringMat.alpha = 0;
      ring.material = ringMat;
      ring.parent = root;
      ring.isPickable = false;
      sectorMeshes[key] = ring;
      sectorMats[key] = ringMat;
    }
  }

  // ── Crowd — Thin Instances of upright capsules with per-instance colors ──
  const personMat = new BABYLON.StandardMaterial('personMat', scene);
  personMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  personMat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);

  const person = BABYLON.MeshBuilder.CreateBox('person', {
    width: 0.45, height: 1.1, depth: 0.4,
  }, scene);
  person.material = personMat;
  person.parent = root;
  person.isVisible = false;
  person.receiveShadows = false;

  // Pivot so origin is at base (height 1.1, default centered at 0 → shift +0.55)
  // Babylon's Box is centered at origin; we'll account for this by placing y = rowY + 0.14 + 0.55
  // (i.e. centre of capsule sits 0.55 above the tread).
  const palette = [
    0xf0e7d4, 0x2a221c, scarlet, secondary, 0x6f6357, 0x9c8e76, 0x1f3d6b,
  ].map(hexToColor3);

  const matrices = [];
  const colors = [];
  const tmpScale = new BABYLON.Vector3();
  const tmpPos = new BABYLON.Vector3();
  let countSeed = 0;

  for (let i = 0; i < BOWL.rows; i++) {
    if (i === BOWL.tier1Top + 1) continue;
    if (i === BOWL.tier1Top) continue;
    if (i === 0) continue;
    if (i >= BOWL.rows - 1) continue;
    const d = rowDims(i);
    const perimeter = 2 * ((d.innerW - 2 * d.innerR) + (d.innerH - 2 * d.innerR)) + 2 * Math.PI * d.innerR;
    const N = Math.max(40, Math.floor(perimeter * crowdDensity));
    const samples = rowPerimeterSamples(d.innerW, d.innerH, d.innerR, N);
    const yBase = rowY(i) + 0.14 + 0.55;  // box centre

    for (let j = 0; j < samples.length; j++) {
      const p = samples[j];
      if (Math.random() < 0.10) continue;
      const next = samples[(j + 1) % samples.length];
      const tx = next.x - p.x, tz = next.z - p.z;
      const tlen = Math.hypot(tx, tz) || 1;
      const inwardX = -tz / tlen, inwardZ = tx / tlen;
      const yaw = Math.atan2(inwardX, inwardZ);
      const rot = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);

      const sX = 0.95 + Math.random() * 0.18;
      const sY = 0.92 + Math.random() * 0.22;
      tmpScale.set(sX, sY, sX);
      const back = 0.45;
      tmpPos.set(p.x + inwardX * -back, yBase, p.z + inwardZ * -back);

      const m = BABYLON.Matrix.Compose(tmpScale, rot, tmpPos);
      const f = new Float32Array(16);
      m.copyToArray(f);
      matrices.push(f);
      colors.push(palette[(Math.random() * palette.length) | 0]);
      countSeed++;
    }
  }

  // Flatten into one big Float32Array
  const matBuf = new Float32Array(matrices.length * 16);
  for (let i = 0; i < matrices.length; i++) matBuf.set(matrices[i], i * 16);
  const colBuf = new Float32Array(matrices.length * 4);
  for (let i = 0; i < colors.length; i++) {
    colBuf[i * 4 + 0] = colors[i].r;
    colBuf[i * 4 + 1] = colors[i].g;
    colBuf[i * 4 + 2] = colors[i].b;
    colBuf[i * 4 + 3] = 1.0;
  }
  person.thinInstanceSetBuffer('matrix', matBuf, 16, true);
  person.thinInstanceSetBuffer('color',  colBuf, 4,  false);
  person.isVisible = true;

  // ── API for theme updates and hover/select ──
  function setAccent(scarletHex, secondaryHex) {
    matAccent.diffuseColor = hexToColor3(scarletHex);
    for (const key of Object.keys(sectorMats)) {
      sectorMats[key].emissiveColor = hexToColor3(scarletHex);
    }
    // Re-tint a portion of crowd deterministically
    const tint = hexToColor3(scarletHex);
    const tint2 = hexToColor3(secondaryHex);
    const buf = person.thinInstanceGetWorldMatrices ? null : null; // unused
    const n = matrices.length;
    const refresh = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const r = (i * 2654435761 >>> 0) / 4294967296;
      let c;
      if (r < 0.20) c = tint;
      else if (r < 0.32) c = tint2;
      else c = colors[i];
      refresh[i * 4 + 0] = c.r;
      refresh[i * 4 + 1] = c.g;
      refresh[i * 4 + 2] = c.b;
      refresh[i * 4 + 3] = 1.0;
    }
    person.thinInstanceSetBuffer('color', refresh, 4, false);
  }
  // Initial accent application (re-tint crowd against current scarlet/secondary)
  setAccent(scarlet, secondary);

  let currentHover = null, currentSelect = null;
  function setHover(sector) {
    if (currentHover && currentHover !== currentSelect) sectorMats[currentHover].alpha = 0;
    currentHover = sector;
    if (sector && sector !== currentSelect) sectorMats[sector].alpha = 0.20;
  }
  function setSelect(sector) {
    if (currentSelect) sectorMats[currentSelect].alpha = 0;
    currentSelect = sector;
    if (sector) sectorMats[sector].alpha = 0.55;
  }

  return {
    root,
    roofGroup,
    crowdMesh: person,
    setAccent,
    setHover,
    setSelect,
  };
}
