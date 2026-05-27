// bowl.js — Continuous rounded-rectangle bowl with two-tier seating + crowd.
import * as THREE from 'three';
import { BOWL, SECTORS } from './config.js';

// ── Helpers ────────────────────────────────────────────────────
// Trace a rounded-rect outline into a Shape or Path.
// Coords are X/Y; caller is expected to rotate the geometry flat afterwards.
function traceRoundedRect(target, w, h, r) {
  const hw = w / 2 - r, hh = h / 2 - r;
  target.moveTo( hw + r, -hh);
  target.lineTo( hw + r,  hh);
  target.absarc( hw,      hh, r, 0,           Math.PI / 2, false);
  target.lineTo(-hw,      hh + r);
  target.absarc(-hw,      hh, r, Math.PI / 2, Math.PI,     false);
  target.lineTo(-hw - r, -hh);
  target.absarc(-hw,     -hh, r, Math.PI,     Math.PI * 1.5, false);
  target.lineTo( hw,     -hh - r);
  target.absarc( hw,     -hh, r, Math.PI * 1.5, Math.PI * 2, false);
}
function makeRoundedRectShape(w, h, r) { const s = new THREE.Shape(); traceRoundedRect(s, w, h, r); return s; }
function makeRoundedRectPath(w, h, r)  { const p = new THREE.Path();  traceRoundedRect(p, w, h, r); return p; }

// Row geometry parameters for a given row index.
function rowDims(i) {
  const innerW = BOWL.innerW + 2 * i * BOWL.rowDepth;
  const innerH = BOWL.innerH + 2 * i * BOWL.rowDepth;
  const innerR = BOWL.cornerRadius + i * BOWL.rowDepth;
  const outerW = innerW + BOWL.rowDepth;
  const outerH = innerH + BOWL.rowDepth;
  const outerR = innerR + BOWL.rowDepth;
  return { innerW, innerH, innerR, outerW, outerH, outerR };
}

// Y-position of row i (handles tier-break gap).
export function rowY(i) {
  const tierLift = (i >= BOWL.tier2Bottom) ? 2.6 : 0;  // upper-tier offset
  return i * BOWL.rowHeight + tierLift;
}

// Sample N points along the perimeter of the rounded-rect for row i
// (inner perimeter — fans sit just inside this edge).
function rowPerimeterSamples(i, N) {
  const { innerW, innerH, innerR } = rowDims(i);
  const path = makeRoundedRectPath(innerW, innerH, innerR);
  return path.getSpacedPoints(N);
}

// Determine which sector (N/E/S/W) a given world position belongs to.
export function sectorForPosition(x, z) {
  const a = Math.atan2(z, x);
  for (const [k, s] of Object.entries(SECTORS)) {
    let [a0, a1] = s.arc;
    if (a1 < a0) { // wraps -π (W sector)
      if (a >= a0 || a <= a1) return k;
    } else {
      if (a >= a0 && a <= a1) return k;
    }
  }
  return null;
}

// ── Main build ─────────────────────────────────────────────────
export function buildBowl({ crowdDensity = 0.30, scarlet = 0xb7301b, secondary = 0xd9b04a }) {
  const group = new THREE.Group();

  // Shared materials so an entire bowl is just a handful of draws.
  const matConcrete = new THREE.MeshStandardMaterial({ color: 0xc7baa5, roughness: 0.92, metalness: 0.03 });
  const matConcreteDark = new THREE.MeshStandardMaterial({ color: 0x8e8270, roughness: 0.88 });
  const matAccent   = new THREE.MeshStandardMaterial({ color: scarlet, roughness: 0.7 });
  const matVip      = new THREE.MeshStandardMaterial({ color: 0x2a221c, roughness: 0.4, metalness: 0.3 });

  // Build tread for each row. ShapeGeometry triangulates the 2D ring quickly
  // (no extruded walls — they'd be invisible from any practical camera angle).
  const CURVE_SEGMENTS = 18;

  // ── Pitch-level concrete plinth (covers gap between pitch and row 0) ──
  {
    const { innerW, innerH, innerR } = rowDims(0);
    const outer = makeRoundedRectShape(innerW, innerH, innerR);
    // Inner hole sized so the pitch sees a clear 6-unit grass surround
    const inner = makeRoundedRectPath(innerW - 4, innerH - 4, innerR - 2);
    outer.holes.push(inner);
    const g = new THREE.ShapeGeometry(outer, CURVE_SEGMENTS);
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, matConcrete);
    m.position.y = 0.02;
    m.receiveShadow = true;
    group.add(m);
  }

  // ── Tread rings + accent bands per row ──
  for (let i = 0; i < BOWL.rows; i++) {
    if (i === BOWL.tier1Top + 1) continue;  // tier-break gap, no tread (VIP boxes here)
    const d = rowDims(i);
    // Tread (flat annular shape)
    const treadShape = makeRoundedRectShape(d.outerW, d.outerH, d.outerR);
    treadShape.holes.push(makeRoundedRectPath(d.innerW, d.innerH, d.innerR));
    const treadGeo = new THREE.ShapeGeometry(treadShape, CURVE_SEGMENTS);
    treadGeo.rotateX(-Math.PI / 2);
    const isAccentRow = (i === 1 || i === BOWL.rows - 2);
    const isVipRow    = (i === BOWL.tier1Top);
    const tread = new THREE.Mesh(treadGeo, isAccentRow ? matAccent : (isVipRow ? matVip : matConcrete));
    tread.position.y = rowY(i) + 0.01;
    tread.receiveShadow = true;
    tread.castShadow = false;
    group.add(tread);
  }

  // ── VIP boxes — small box-shaped windows along the inner rim of tier1 break ──
  {
    const vipY = rowY(BOWL.tier1Top) + 0.7;
    const samples = rowPerimeterSamples(BOWL.tier1Top + 1, 96);
    const vipGeo = new THREE.BoxGeometry(2.4, 2.0, 0.9);
    const vipMat = new THREE.MeshStandardMaterial({ color: 0xfff2b8, emissive: 0xfff2b8, emissiveIntensity: 0.45, roughness: 0.5 });
    const vipMesh = new THREE.InstancedMesh(vipGeo, vipMat, samples.length);
    vipMesh.frustumCulled = false;
    const M = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const tmpV = new THREE.Vector3();
    samples.forEach((p, j) => {
      // Face INWARD (toward pitch center) — use direction from point to origin
      const angle = Math.atan2(-p.x, -p.y);
      q.setFromAxisAngle(up, angle);
      tmpV.set(p.x, vipY, p.y);
      M.compose(tmpV, q, new THREE.Vector3(1, 1, 1));
      vipMesh.setMatrixAt(j, M);
    });
    vipMesh.instanceMatrix.needsUpdate = true;
    group.add(vipMesh);
  }

  // ── Back wall — extruded ring from last row outward, going up tall enough
  //    that the upper-tier crowd can't poke out the top from side angles ──
  {
    const last = rowDims(BOWL.rows - 1);
    const backWallH = 7.0;
    const outerW = last.outerW + 1.2;
    const outerH = last.outerH + 1.2;
    const outerR = last.outerR + 0.6;
    const wallShape = makeRoundedRectShape(outerW, outerH, outerR);
    wallShape.holes.push(makeRoundedRectPath(last.outerW, last.outerH, last.outerR));
    const wallGeo = new THREE.ExtrudeGeometry(wallShape, { depth: backWallH, bevelEnabled: false, curveSegments: CURVE_SEGMENTS });
    wallGeo.rotateX(-Math.PI / 2);
    const wall = new THREE.Mesh(wallGeo, matConcreteDark);
    wall.position.y = rowY(BOWL.rows - 1) + 0.4;
    wall.castShadow = true;
    wall.receiveShadow = true;
    group.add(wall);
  }

  // ── Roof — thin cantilevered ring above bowl (raised so crowd has air) ──
  const roofGroup = new THREE.Group();
  group.add(roofGroup);
  {
    const last = rowDims(BOWL.rows - 1);
    const roofH = rowY(BOWL.rows - 1) + 13;
    const overshoot = 6;
    const outerW = last.outerW + 2.0;
    const outerH = last.outerH + 2.0;
    const outerR = last.outerR + 1.0;
    const roofOuter = makeRoundedRectShape(outerW, outerH, outerR);
    // Inner edge of roof reaches forward over the inner stand area
    const innerInset = rowDims(BOWL.tier2Bottom);
    roofOuter.holes.push(makeRoundedRectPath(innerInset.innerW - overshoot, innerInset.innerH - overshoot, innerInset.innerR - 2));
    const roofGeo = new THREE.ExtrudeGeometry(roofOuter, { depth: 0.35, bevelEnabled: false, curveSegments: CURVE_SEGMENTS });
    roofGeo.rotateX(-Math.PI / 2);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x231a13, roughness: 0.55, metalness: 0.25 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = roofH;
    roof.castShadow = true;
    roofGroup.add(roof);

    // Support struts (16 evenly around the back perimeter)
    const strutLen = roofH - 1.0;
    const strutGeo = new THREE.CylinderGeometry(0.2, 0.2, strutLen, 8);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x231a13, roughness: 0.6 });
    const strutCount = 16;
    const strutMesh = new THREE.InstancedMesh(strutGeo, strutMat, strutCount);
    strutMesh.frustumCulled = false;
    const path = makeRoundedRectPath(last.outerW + 0.4, last.outerH + 0.4, last.outerR + 0.2);
    const sP = path.getSpacedPoints(strutCount);
    const M = new THREE.Matrix4();
    sP.forEach((p, i) => {
      M.makeTranslation(p.x, strutLen / 2 + 0.6, p.y);
      strutMesh.setMatrixAt(i, M);
    });
    strutMesh.instanceMatrix.needsUpdate = true;
    strutMesh.castShadow = true;
    roofGroup.add(strutMesh);
  }

  // ── Sector hover/select rings (one per sector, sized to bowl footprint) ──
  const sectorMeshes = {};
  for (const [key, s] of Object.entries(SECTORS)) {
    const arcLen = (s.arc[1] - s.arc[0] + Math.PI * 2) % (Math.PI * 2) || Math.PI / 2;
    const rOuter = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 5;
    const rInner = Math.max(BOWL.innerW, BOWL.innerH) / 2 + BOWL.rows * BOWL.rowDepth + 1.5;
    const ringGeo = new THREE.RingGeometry(rInner, rOuter, 32, 1, s.arc[0], arcLen);
    const ringMat = new THREE.MeshBasicMaterial({ color: scarlet, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.04;
    group.add(ring);
    sectorMeshes[key] = ring;
  }

  // ── Crowd — InstancedMesh of upright capsules across all rows ──
  const personGeo = new THREE.BoxGeometry(0.45, 1.1, 0.4);
  // Move pivot so person stands on row tread (origin at base)
  personGeo.translate(0, 0.55, 0);
  const personMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85, metalness: 0.0, vertexColors: false });

  // Pre-compute matrices so we know total count
  const personMatrices = [];
  const personColors = [];
  const palette = [
    new THREE.Color(0xf0e7d4),  // cream
    new THREE.Color(0x2a221c),  // ink
    new THREE.Color(scarlet),
    new THREE.Color(secondary),
    new THREE.Color(0x6f6357),  // grey
    new THREE.Color(0x9c8e76),  // tan
    new THREE.Color(0x1f3d6b),  // navy (random fans wear stuff)
  ];

  const tmpM = new THREE.Matrix4();
  const tmpQ = new THREE.Quaternion();
  const tmpUp = new THREE.Vector3(0, 1, 0);
  const tmpPos = new THREE.Vector3();
  const tmpScl = new THREE.Vector3(1, 1, 1);

  for (let i = 0; i < BOWL.rows; i++) {
    if (i === BOWL.tier1Top + 1) continue;
    if (i === BOWL.tier1Top) continue; // VIP box level — skip
    if (i === 0) continue;  // front row often clips the pitch line, skip
    if (i >= BOWL.rows - 1) continue;  // skip very back row — reads as roof clip from side angles
    const d = rowDims(i);
    // Approximate perimeter length
    const perimeter = 2 * ((d.innerW - 2 * d.innerR) + (d.innerH - 2 * d.innerR)) + 2 * Math.PI * d.innerR;
    const N = Math.max(40, Math.floor(perimeter * crowdDensity));
    const samples = rowPerimeterSamples(i, N);
    const y = rowY(i) + 0.14;  // sits on tread

    for (let j = 0; j < samples.length; j++) {
      const p = samples[j];
      // Skip with low probability for natural sparseness
      if (Math.random() < 0.10) continue;
      const next = samples[(j + 1) % samples.length];
      const tx = next.x - p.x, tz = next.y - p.y;
      const tlen = Math.hypot(tx, tz) || 1;
      // Inward normal: rotate tangent 90° toward center
      const inwardX = -tz / tlen, inwardZ = tx / tlen;
      const yaw = Math.atan2(inwardX, inwardZ);
      tmpQ.setFromAxisAngle(tmpUp, yaw);

      // Slight scale & color jitter
      const sX = 0.95 + Math.random() * 0.18;
      const sY = 0.92 + Math.random() * 0.22;
      tmpScl.set(sX, sY, sX);
      const back = 0.45;
      tmpPos.set(p.x + inwardX * -back, y, p.y + inwardZ * -back);
      tmpM.compose(tmpPos, tmpQ, tmpScl);
      // Push a fresh array of 16 floats (faster than .clone())
      personMatrices.push(new Float32Array(tmpM.elements));
      personColors.push(palette[(Math.random() * palette.length) | 0]);
    }
  }

  const crowdMesh = new THREE.InstancedMesh(personGeo, personMat, personMatrices.length || 1);
  crowdMesh.castShadow = false;
  crowdMesh.receiveShadow = false;
  crowdMesh.frustumCulled = false;
  const writeM = new THREE.Matrix4();
  for (let i = 0; i < personMatrices.length; i++) {
    writeM.fromArray(personMatrices[i]);
    crowdMesh.setMatrixAt(i, writeM);
  }
  for (let i = 0; i < personColors.length; i++) {
    crowdMesh.setColorAt(i, personColors[i]);
  }
  crowdMesh.count = personMatrices.length;
  crowdMesh.instanceMatrix.needsUpdate = true;
  if (crowdMesh.instanceColor) crowdMesh.instanceColor.needsUpdate = true;
  group.add(crowdMesh);

  // ── Re-tint accent materials when club changes ──
  function setAccent(scarletHex, secondaryHex) {
    matAccent.color.setHex(scarletHex);
    // Recolor a portion of the crowd to use the new accent
    if (!crowdMesh.instanceColor) return;
    const tint = new THREE.Color(scarletHex);
    const tint2 = new THREE.Color(secondaryHex);
    for (let i = 0; i < crowdMesh.count; i++) {
      const r = (i * 2654435761 >>> 0) / 4294967296;  // deterministic hash
      if (r < 0.20) crowdMesh.setColorAt(i, tint);
      else if (r < 0.32) crowdMesh.setColorAt(i, tint2);
    }
    crowdMesh.instanceColor.needsUpdate = true;
  }
  setAccent(scarlet, secondary);

  // ── Hover / select highlight API ──
  let currentHover = null, currentSelect = null;
  function setHover(sector) {
    if (currentHover && currentHover !== currentSelect) sectorMeshes[currentHover].material.opacity = 0;
    currentHover = sector;
    if (sector && sector !== currentSelect) sectorMeshes[sector].material.opacity = 0.20;
  }
  function setSelect(sector) {
    if (currentSelect) sectorMeshes[currentSelect].material.opacity = 0;
    currentSelect = sector;
    if (sector) sectorMeshes[sector].material.opacity = 0.55;
  }

  return {
    group,
    roofGroup,
    crowdMesh,
    setAccent,
    setHover,
    setSelect,
    sectorMeshes,
  };
}
