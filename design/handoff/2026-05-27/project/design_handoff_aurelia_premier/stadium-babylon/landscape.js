// landscape.js — Surrounding infrastructure: approach boulevard, fan zone,
// flags, training pitches, club building, bus park, tram platform, ring road,
// trees, lamps and a harbour-edge water plane (we're in Hafenstadt).
//
// All built in the same scene as bowl/infra/pitch and registered with the
// shadow generator so the whole site casts and receives shadows coherently.
import { hexToColor3 } from './config.js';

const TAU = Math.PI * 2;

// ── Helpers ────────────────────────────────────────────────────
function pavedMat(scene, name, hex, spec = 0.02) {
  const m = new BABYLON.StandardMaterial(name, scene);
  m.diffuseColor = hexToColor3(hex);
  m.specularColor = new BABYLON.Color3(spec, spec, spec);
  return m;
}
function makeBox(scene, name, w, h, d, mat, parent) {
  const b = BABYLON.MeshBuilder.CreateBox(name, { width: w, height: h, depth: d }, scene);
  b.material = mat;
  if (parent) b.parent = parent;
  return b;
}

// ── Main build ─────────────────────────────────────────────────
export function buildLandscape(scene, { primary = 0x1f3d6b, secondary = 0xd9b04a, shadowGen = null } = {}) {
  const root = new BABYLON.TransformNode('landscape', scene);

  // Master shared materials ──
  const matAsphalt   = pavedMat(scene, 'asphalt',  0x2e2c28);
  const matAsphalt2  = pavedMat(scene, 'asphalt2', 0x35332e);
  const matCurb      = pavedMat(scene, 'curb',     0x9a8e7a);
  const matLawn      = pavedMat(scene, 'lawn',     0x4a5e36);
  const matLawnDark  = pavedMat(scene, 'lawnDk',   0x3a4d29);
  const matPaver     = pavedMat(scene, 'paver',    0xbfb098);
  const matPaverDk   = pavedMat(scene, 'paverDk',  0xa5957c);
  const matTrunk     = pavedMat(scene, 'trunk',    0x4a3826, 0.04);
  const matFoliage   = pavedMat(scene, 'foliage',  0x456a3a, 0.04);
  const matFoliage2  = pavedMat(scene, 'foliage2', 0x375d33, 0.04);
  const matWindow    = pavedMat(scene, 'window',   0x9bb4c2);   matWindow.specularColor = new BABYLON.Color3(0.6, 0.6, 0.65);
  const matWall      = pavedMat(scene, 'wall',     0xddcdb2, 0.08);
  const matWallDk    = pavedMat(scene, 'wallDk',   0xb7a890, 0.08);
  const matRoof      = pavedMat(scene, 'roofFlat', 0x1a1410, 0.08);
  const matSteel     = pavedMat(scene, 'steel',    0x3a342e); matSteel.specularColor = new BABYLON.Color3(0.4,0.4,0.4);
  const matWhite     = pavedMat(scene, 'white',    0xeeeae0, 0.05);
  const matStripe    = pavedMat(scene, 'stripe',   0xeeeae0, 0.05); matStripe.disableLighting = true; matStripe.emissiveColor = new BABYLON.Color3(0.7,0.66,0.58);
  const matWater     = (() => {
    const m = new BABYLON.StandardMaterial('water', scene);
    m.diffuseColor = hexToColor3(0x2a4858);
    m.emissiveColor = hexToColor3(0x1c3744);
    m.specularColor = new BABYLON.Color3(0.4, 0.45, 0.5);
    m.specularPower = 64;
    return m;
  })();
  const matKioskA = pavedMat(scene, 'kioskA', secondary);
  const matKioskB = pavedMat(scene, 'kioskB', 0xb7301b);
  const matFlag   = pavedMat(scene, 'flag', primary);   matFlag.backFaceCulling = false;
  const matBus = pavedMat(scene, 'bus', 0xead7c1, 0.1);  matBus.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);

  // Quick collector for shadow casters
  const addCaster = (m) => { if (shadowGen) shadowGen.addShadowCaster(m); };
  const setRecv = (m) => { m.receiveShadows = true; };

  // ───────────────────────────────────────────────────────────────
  // 1. Outer ring road — wide asphalt ribbon at radius ~195 with curbs and dashes
  // ───────────────────────────────────────────────────────────────
  {
    const rIn = 188, rOut = 208, segs = 96;
    const inner = [], outer = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * TAU;
      inner.push(new BABYLON.Vector3(Math.cos(a) * rIn,  0.025, Math.sin(a) * rIn));
      outer.push(new BABYLON.Vector3(Math.cos(a) * rOut, 0.025, Math.sin(a) * rOut));
    }
    const road = BABYLON.MeshBuilder.CreateRibbon('ringRoad', {
      pathArray: [inner, outer], sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    }, scene);
    road.material = matAsphalt;
    setRecv(road); road.parent = root;

    // Curbs — narrow ribbons just inside/outside
    for (const [r0, r1, name] of [[rIn - 0.6, rIn, 'curbIn'], [rOut, rOut + 0.6, 'curbOut']]) {
      const a1 = [], a2 = [];
      for (let i = 0; i <= segs; i++) {
        const a = (i / segs) * TAU;
        a1.push(new BABYLON.Vector3(Math.cos(a) * r0, 0.08, Math.sin(a) * r0));
        a2.push(new BABYLON.Vector3(Math.cos(a) * r1, 0.08, Math.sin(a) * r1));
      }
      const curb = BABYLON.MeshBuilder.CreateRibbon(name, {
        pathArray: [a1, a2], sideOrientation: BABYLON.Mesh.DOUBLESIDE,
      }, scene);
      curb.material = matCurb;
      curb.parent = root;
    }

    // Lane dashes — thin instances of a tiny white box
    const dash = BABYLON.MeshBuilder.CreateBox('dash', { width: 0.4, height: 0.02, depth: 2.4 }, scene);
    dash.material = matStripe;
    dash.parent = root;
    dash.isVisible = false;
    const dashCount = 64;
    const dashMats = new Float32Array(dashCount * 16);
    const sc = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < dashCount; i++) {
      const a = (i / dashCount) * TAU;
      const r = (rIn + rOut) / 2;
      const px = Math.cos(a) * r, pz = Math.sin(a) * r;
      const yaw = a + Math.PI / 2;  // tangent to circle
      const rot = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
      const m = BABYLON.Matrix.Compose(sc, rot, new BABYLON.Vector3(px, 0.06, pz));
      m.copyToArray(dashMats, i * 16);
    }
    dash.thinInstanceSetBuffer('matrix', dashMats, 16, true);
    dash.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 2. Approach boulevard — paved spine from plaza heading north, with side lawns
  // ───────────────────────────────────────────────────────────────
  {
    // Centre paved strip
    const blvd = BABYLON.MeshBuilder.CreateGround('blvd', { width: 36, height: 130 }, scene);
    blvd.position.set(0, 0.035, -225);
    blvd.material = matPaver;
    setRecv(blvd); blvd.parent = root;

    // Edge stripes
    for (const x of [-17.5, 17.5]) {
      const stripe = BABYLON.MeshBuilder.CreateGround(`blvdStripe_${x}`, { width: 0.4, height: 130 }, scene);
      stripe.position.set(x, 0.07, -225);
      stripe.material = matStripe;
      stripe.parent = root;
    }

    // Side lawns — 2 strips flanking the boulevard
    for (const x of [-32, 32]) {
      const lawn = BABYLON.MeshBuilder.CreateGround(`blvdLawn_${x}`, { width: 26, height: 130 }, scene);
      lawn.position.set(x, 0.025, -225);
      lawn.material = matLawn;
      lawn.parent = root;
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 3. Flag pole row — 6 poles at the north end of the plaza with cloth flags
  // ───────────────────────────────────────────────────────────────
  {
    const poleMat = matSteel;
    const poleH = 14;
    for (let i = 0; i < 6; i++) {
      const x = -25 + i * 10;
      const pole = BABYLON.MeshBuilder.CreateCylinder(`flagPole_${i}`, {
        height: poleH, diameter: 0.22, tessellation: 8,
      }, scene);
      pole.position.set(x, poleH / 2, -163);
      pole.material = poleMat;
      pole.parent = root;
      addCaster(pole);

      // Cap on top
      const cap = BABYLON.MeshBuilder.CreateSphere(`flagCap_${i}`, { diameter: 0.4, segments: 6 }, scene);
      cap.position.set(x, poleH + 0.1, -163);
      cap.material = matWhite;
      cap.parent = root;

      // Flag cloth (alternating club + town)
      const flag = BABYLON.MeshBuilder.CreatePlane(`flag_${i}`, { width: 3, height: 1.8 }, scene);
      flag.position.set(x + 1.5, poleH - 1.5, -163);
      flag.material = i % 2 === 0 ? matFlag : matKioskA;
      flag.rotation.y = -0.08 + Math.sin(i * 1.7) * 0.06;  // tiny variance
      flag.parent = root;
    }
  }

  // ───────────────────────────────────────────────────────────────
  // 4. Fan zone — 8 kiosks + colourful umbrellas on the plaza wings
  // ───────────────────────────────────────────────────────────────
  {
    const wing = [
      // Each kiosk: [x, z, color (A or B), kind (food/merch)]
      [-44, -150, 'A'], [-44, -158, 'B'],
      [ 44, -150, 'A'], [ 44, -158, 'B'],
      [-32, -172, 'B'], [-12, -172, 'A'],
      [ 12, -172, 'A'], [ 32, -172, 'B'],
    ];
    for (const [x, z, kind] of wing) {
      const body = makeBox(scene, 'kioskBody', 5.5, 2.8, 3.5, kind === 'A' ? matKioskA : matKioskB, root);
      body.position.set(x, 1.4, z);
      addCaster(body);
      // Slanted awning
      const awning = makeBox(scene, 'awning', 6.5, 0.18, 4.5, matRoof, root);
      awning.position.set(x, 3.0, z);
      awning.rotation.x = -0.12;
      addCaster(awning);
      // Counter window — a darker box face
      const win = makeBox(scene, 'kioskWin', 4.2, 1.2, 0.05, matVip(matRoof), root);
      win.position.set(x, 1.7, z - 1.78);
    }

    // Umbrellas — thin instanced cones with little tables
    const umbrellaCount = 14;
    const umbrella = BABYLON.MeshBuilder.CreateCylinder('umbrella', {
      height: 0.4, diameterTop: 3.4, diameterBottom: 0.2, tessellation: 12,
    }, scene);
    const umbrellaMatA = pavedMat(scene, 'umbA', secondary);
    umbrella.material = umbrellaMatA;
    umbrella.parent = root;
    umbrella.isVisible = false;
    const umbrellaMats = new Float32Array(umbrellaCount * 16);
    const umbrellaColors = new Float32Array(umbrellaCount * 4);
    const colorTable = [secondary, 0xb7301b, primary, 0xeeeae0, secondary].map(hexToColor3);
    const sc1 = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < umbrellaCount; i++) {
      // Place between -60 and 60 x, -135 and -180 z
      const x = -55 + Math.random() * 110;
      const z = -140 - Math.random() * 38;
      const yaw = Math.random() * TAU;
      const rot = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
      const t = new BABYLON.Vector3(x, 2.6, z);
      BABYLON.Matrix.Compose(sc1, rot, t).copyToArray(umbrellaMats, i * 16);
      const c = colorTable[i % colorTable.length];
      umbrellaColors[i*4+0] = c.r; umbrellaColors[i*4+1] = c.g; umbrellaColors[i*4+2] = c.b; umbrellaColors[i*4+3] = 1;
    }
    umbrella.thinInstanceSetBuffer('matrix', umbrellaMats, 16, true);
    umbrella.thinInstanceSetBuffer('color', umbrellaColors, 4, false);
    umbrella.isVisible = true;

    // Pole for each umbrella (separate thin instance set)
    const upole = BABYLON.MeshBuilder.CreateCylinder('umbPole', {
      height: 2.6, diameter: 0.08, tessellation: 6,
    }, scene);
    upole.material = matSteel;
    upole.parent = root;
    upole.isVisible = false;
    const upoleMats = new Float32Array(umbrellaCount * 16);
    for (let i = 0; i < umbrellaCount; i++) {
      // Reuse positions from umbrella matrices
      const idx = i * 16;
      const px = umbrellaMats[idx + 12], pz = umbrellaMats[idx + 14];
      const t = new BABYLON.Vector3(px, 1.3, pz);
      BABYLON.Matrix.Compose(sc1, BABYLON.Quaternion.Identity(), t).copyToArray(upoleMats, i * 16);
    }
    upole.thinInstanceSetBuffer('matrix', upoleMats, 16, true);
    upole.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 5. Training pitches — 2 mini-pitches to the east of the stadium
  // ───────────────────────────────────────────────────────────────
  {
    const tpRoot = new BABYLON.TransformNode('trainingPitches', scene);
    tpRoot.parent = root;
    tpRoot.position.set(220, 0, 0);

    for (let p = 0; p < 2; p++) {
      const pz = -42 + p * 84;  // 2 pitches stacked north-south
      const w = 65, h = 42;
      // Striped grass — 10 strips
      for (let i = 0; i < 10; i++) {
        const stripe = BABYLON.MeshBuilder.CreateGround(`tpGrass_${p}_${i}`, {
          width: w, height: h / 10,
        }, scene);
        stripe.position.set(0, 0.04, pz - h / 2 + i * (h / 10) + h / 20);
        stripe.material = i % 2 === 0 ? matLawn : matLawnDark;
        setRecv(stripe);
        stripe.parent = tpRoot;
      }
      // Outline + halfway
      const lc = new BABYLON.Color3(1, 1, 1);
      const addL = (pts, name) => {
        const ln = BABYLON.MeshBuilder.CreateLines(name, {
          points: pts.map(p => new BABYLON.Vector3(p[0], p[1], p[2])),
        }, scene);
        ln.color = lc; ln.alpha = 0.85; ln.parent = tpRoot;
      };
      const hw = w/2, hh = h/2, y = 0.08, z0 = pz;
      addL([[-hw,y,z0-hh],[hw,y,z0-hh],[hw,y,z0+hh],[-hw,y,z0+hh],[-hw,y,z0-hh]], `tpRect_${p}`);
      addL([[-hw,y,z0],[hw,y,z0]], `tpHalf_${p}`);
      // Centre circle
      const cc = [];
      for (let k = 0; k <= 48; k++) {
        const a = (k/48)*TAU;
        cc.push([Math.cos(a)*6.5, y, z0 + Math.sin(a)*6.5]);
      }
      addL(cc, `tpCirc_${p}`);

      // Goals
      const goalMat = matWhite;
      for (const s of [-1, 1]) {
        const gg = new BABYLON.TransformNode(`tpGoal_${p}_${s}`, scene);
        gg.position.set(0, 0, z0 + s * hh);
        gg.parent = tpRoot;
        for (const x of [-3, 3]) {
          const post = BABYLON.MeshBuilder.CreateCylinder(`tpPost`, {height: 2.0, diameter: 0.08, tessellation: 6}, scene);
          post.position.set(x, 1.0, 0); post.material = goalMat; post.parent = gg;
        }
        const bar = BABYLON.MeshBuilder.CreateCylinder('tpBar', { height: 6.0, diameter: 0.08, tessellation: 6 }, scene);
        bar.rotation.z = Math.PI / 2; bar.position.set(0, 2.0, 0); bar.material = goalMat; bar.parent = gg;
      }
    }

    // Fence around training pitches — instanced posts + horizontal rails
    const fenceMat = matSteel;
    const post = BABYLON.MeshBuilder.CreateCylinder('tpFencePost', {
      height: 2.4, diameter: 0.14, tessellation: 6,
    }, scene);
    post.material = fenceMat;
    post.parent = tpRoot;
    post.isVisible = false;
    const fenceMats = [];
    const sc2 = new BABYLON.Vector3(1, 1, 1);
    const rotId = BABYLON.Quaternion.Identity();
    // Perimeter at ±36 x, -90 to 90 z
    for (let z = -90; z <= 90; z += 5) {
      for (const xx of [-36, 36]) {
        const m = BABYLON.Matrix.Compose(sc2, rotId, new BABYLON.Vector3(xx, 1.2, z));
        const arr = new Float32Array(16); m.copyToArray(arr); fenceMats.push(arr);
      }
    }
    for (let x = -36; x <= 36; x += 5) {
      for (const zz of [-90, 90]) {
        const m = BABYLON.Matrix.Compose(sc2, rotId, new BABYLON.Vector3(x, 1.2, zz));
        const arr = new Float32Array(16); m.copyToArray(arr); fenceMats.push(arr);
      }
    }
    const fb = new Float32Array(fenceMats.length * 16);
    for (let i = 0; i < fenceMats.length; i++) fb.set(fenceMats[i], i * 16);
    post.thinInstanceSetBuffer('matrix', fb, 16, true);
    post.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 6. Club shop / museum building — west of stadium
  // ───────────────────────────────────────────────────────────────
  {
    const cb = new BABYLON.TransformNode('clubBuilding', scene);
    cb.parent = root;
    cb.position.set(-205, 0, 0);

    // Main block (long side facing stadium)
    const main = makeBox(scene, 'cbMain', 14, 11, 50, matWall, cb);
    main.position.y = 5.5;
    addCaster(main); setRecv(main);

    // Lower wing perpendicular (south)
    const wing = makeBox(scene, 'cbWing', 28, 6.5, 14, matWallDk, cb);
    wing.position.set(8, 3.25, -32);
    addCaster(wing); setRecv(wing);

    // Roof slabs (slightly darker)
    const mainRoof = makeBox(scene, 'cbMainRoof', 14.6, 0.4, 50.6, matRoof, cb);
    mainRoof.position.y = 11.2;
    const wingRoof = makeBox(scene, 'cbWingRoof', 28.6, 0.4, 14.6, matRoof, cb);
    wingRoof.position.set(8, 6.7, -32);

    // Window strips — repeating thin instances of a glass plane
    const winMesh = BABYLON.MeshBuilder.CreatePlane('cbWin', { width: 2.4, height: 1.6 }, scene);
    winMesh.material = matWindow;
    winMesh.parent = cb;
    winMesh.isVisible = false;
    const winMats = [];
    const sc3 = new BABYLON.Vector3(1, 1, 1);
    // Front face of main block (facing +x toward stadium), y=4.5 and y=8 rows
    for (const yRow of [4.5, 8.0]) {
      for (let z = -22; z <= 22; z += 3) {
        const m = BABYLON.Matrix.Compose(sc3, BABYLON.Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0), new BABYLON.Vector3(7.01, yRow, z));
        const arr = new Float32Array(16); m.copyToArray(arr); winMats.push(arr);
      }
    }
    // Front face of wing block (facing +x)
    for (let z = -38; z <= -26; z += 3) {
      const m = BABYLON.Matrix.Compose(sc3, BABYLON.Quaternion.RotationYawPitchRoll(Math.PI/2, 0, 0), new BABYLON.Vector3(22.01, 3.6, z));
      const arr = new Float32Array(16); m.copyToArray(arr); winMats.push(arr);
    }
    const wb = new Float32Array(winMats.length * 16);
    for (let i = 0; i < winMats.length; i++) wb.set(winMats[i], i * 16);
    winMesh.thinInstanceSetBuffer('matrix', wb, 16, true);
    winMesh.isVisible = true;

    // Signage on building front
    const dt = new BABYLON.DynamicTexture('cbSign', { width: 1024, height: 128 }, scene, false);
    const ctx = dt.getContext();
    ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 0, 1024, 128);
    ctx.font = '700 64px Newsreader, Georgia, serif';
    ctx.fillStyle = '#f6efdc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('CLUB · SHOP · MUSEUM', 512, 64);
    dt.update();
    const signMat = new BABYLON.StandardMaterial('cbSignMat', scene);
    signMat.diffuseTexture = dt;
    signMat.emissiveColor = new BABYLON.Color3(0.55, 0.5, 0.42);
    signMat.specularColor = new BABYLON.Color3(0,0,0);
    const sign = BABYLON.MeshBuilder.CreatePlane('cbSignPlane', { width: 28, height: 3.4 }, scene);
    sign.position.set(7.04, 10.0, 0);
    sign.rotation.y = -Math.PI / 2;
    sign.material = signMat;
    sign.parent = cb;

    // Plaza pad in front of building
    const pad = BABYLON.MeshBuilder.CreateGround('cbPad', { width: 28, height: 56 }, scene);
    pad.position.set(20, 0.03, 0);
    pad.material = matPaverDk;
    setRecv(pad); pad.parent = cb;
  }

  // ───────────────────────────────────────────────────────────────
  // 7. Bus parking + buses — south of the stadium
  // ───────────────────────────────────────────────────────────────
  {
    const bus = new BABYLON.TransformNode('busZone', scene);
    bus.parent = root;
    bus.position.set(0, 0, 175);

    // Asphalt pad
    const pad = BABYLON.MeshBuilder.CreateGround('busPad', { width: 130, height: 50 }, scene);
    pad.position.y = 0.025;
    pad.material = matAsphalt2;
    setRecv(pad); pad.parent = bus;

    // Bay stripes — 9 white lines
    for (let i = 0; i < 10; i++) {
      const x = -54 + i * 12;
      const stripe = BABYLON.MeshBuilder.CreateGround(`busStripe_${i}`, { width: 0.3, height: 36 }, scene);
      stripe.position.set(x, 0.05, 0);
      stripe.material = matStripe;
      stripe.parent = bus;
    }

    // Buses — thin instanced long boxes with a row of bright windows on the side
    const busBody = BABYLON.MeshBuilder.CreateBox('busBody', { width: 2.6, height: 3.0, depth: 11 }, scene);
    busBody.material = matBus;
    busBody.parent = bus;
    busBody.isVisible = false;
    const busCount = 9;
    const busMats = [];
    const sc4 = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < busCount; i++) {
      if (Math.random() < 0.18) continue;
      const x = -48 + i * 12;
      const z = (Math.random() - 0.5) * 12;
      const m = BABYLON.Matrix.Compose(sc4, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(x, 1.5, z));
      const arr = new Float32Array(16); m.copyToArray(arr); busMats.push(arr);
    }
    const bb = new Float32Array(busMats.length * 16);
    for (let i = 0; i < busMats.length; i++) bb.set(busMats[i], i * 16);
    busBody.thinInstanceSetBuffer('matrix', bb, 16, true);
    busBody.isVisible = true;
    addCaster(busBody);

    // Bus windshields (dark strip on top half) — a single tiled instance set
    const busWin = BABYLON.MeshBuilder.CreateBox('busWin', { width: 2.65, height: 1.1, depth: 10.4 }, scene);
    busWin.material = matVip(matRoof);
    busWin.parent = bus;
    busWin.isVisible = false;
    const wb2 = new Float32Array(busMats.length * 16);
    for (let i = 0; i < busMats.length; i++) {
      // place 0.9 above bus center, same xz
      const idx = i * 16;
      const px = busMats[i][12], pz = busMats[i][14];
      const m = BABYLON.Matrix.Compose(sc4, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(px, 2.6, pz));
      m.copyToArray(wb2, i * 16);
    }
    busWin.thinInstanceSetBuffer('matrix', wb2, 16, true);
    busWin.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 8. Tram platform — far north end of approach boulevard
  // ───────────────────────────────────────────────────────────────
  {
    const tram = new BABYLON.TransformNode('tramStop', scene);
    tram.parent = root;
    tram.position.set(0, 0, -290);

    // Platform slab
    const plat = makeBox(scene, 'tramPlat', 70, 0.7, 5, matCurb, tram);
    plat.position.y = 0.35; setRecv(plat);

    // Canopy roof on slim supports
    const canopy = makeBox(scene, 'tramCanopy', 64, 0.25, 5.6, matRoof, tram);
    canopy.position.y = 4.2;
    addCaster(canopy);
    // Supports — 6 thin cylinders
    for (let i = 0; i < 6; i++) {
      const x = -30 + i * 12;
      const sup = BABYLON.MeshBuilder.CreateCylinder(`tramSup_${i}`, {
        height: 4.0, diameter: 0.18, tessellation: 6,
      }, scene);
      sup.position.set(x, 2.0, 0);
      sup.material = matSteel;
      sup.parent = tram;
      addCaster(sup);
    }

    // Rails — two long thin strips
    for (const z of [-4, -5.5]) {
      const rail = makeBox(scene, `rail_${z}`, 90, 0.06, 0.18, matSteel, tram);
      rail.position.set(0, 0.06, z);
    }
    // Sleepers — instanced wooden bars
    const sleeper = BABYLON.MeshBuilder.CreateBox('sleeper', { width: 2.4, height: 0.12, depth: 0.4 }, scene);
    sleeper.material = matTrunk;
    sleeper.parent = tram;
    sleeper.isVisible = false;
    const sleepCount = 24;
    const sleepMats = new Float32Array(sleepCount * 16);
    const sc5 = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < sleepCount; i++) {
      const x = -42 + i * 3.6;
      const m = BABYLON.Matrix.Compose(sc5, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(x, 0.06, -4.75));
      m.copyToArray(sleepMats, i * 16);
    }
    sleeper.thinInstanceSetBuffer('matrix', sleepMats, 16, true);
    sleeper.isVisible = true;

    // A single static tram parked at the platform
    const tramCarMat = pavedMat(scene, 'tramCar', primary);
    tramCarMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.25);
    const tramCar = makeBox(scene, 'tramCar', 24, 3.0, 2.4, tramCarMat, tram);
    tramCar.position.set(-12, 1.6 + 0.1, -4.75);
    addCaster(tramCar);
    // Window stripe
    const tramWin = makeBox(scene, 'tramCarWin', 22.5, 1.0, 2.45, matVip(matRoof), tram);
    tramWin.position.set(-12, 2.4, -4.75);

    // Station name
    const dt = new BABYLON.DynamicTexture('tramSign', { width: 768, height: 96 }, scene, false);
    const ctx = dt.getContext();
    ctx.fillStyle = '#1a1410'; ctx.fillRect(0, 0, 768, 96);
    ctx.font = '700 48px Inter, sans-serif';
    ctx.fillStyle = '#f6efdc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('▸ AURELIA ARENA', 384, 48);
    dt.update();
    const tramSignMat = new BABYLON.StandardMaterial('tramSignMat', scene);
    tramSignMat.diffuseTexture = dt;
    tramSignMat.emissiveColor = new BABYLON.Color3(0.55, 0.5, 0.42);
    tramSignMat.specularColor = new BABYLON.Color3(0, 0, 0);
    const sign = BABYLON.MeshBuilder.CreatePlane('tramSignPlane', { width: 20, height: 2.4 }, scene);
    sign.position.set(0, 3.0, 2.55);
    sign.material = tramSignMat;
    sign.parent = tram;
  }

  // ───────────────────────────────────────────────────────────────
  // 9. Trees — hundreds, scattered in the green zones around the complex
  // ───────────────────────────────────────────────────────────────
  {
    // Two meshes — trunk cylinder + foliage cone — share placement matrices.
    const trunk = BABYLON.MeshBuilder.CreateCylinder('tTrunk', {
      height: 2.2, diameter: 0.45, tessellation: 6,
    }, scene);
    trunk.material = matTrunk; trunk.parent = root; trunk.isVisible = false;
    const crown = BABYLON.MeshBuilder.CreateCylinder('tCrown', {
      height: 4.4, diameterTop: 0.05, diameterBottom: 3.2, tessellation: 8,
    }, scene);
    crown.material = matFoliage; crown.parent = root; crown.isVisible = false;

    const places = [];
    function tryAdd(x, z, minDist = 6) {
      // Reject placements inside critical zones (bowl, plaza, training pitches, club building, bus parking, ring road)
      const r = Math.hypot(x, z);
      if (r < 145) return;                                  // too close to bowl/concourse
      if (r > 185 && r < 215) return;                       // on the ring road
      if (x > 175 && Math.abs(z) < 100) return;             // training pitches
      if (x < -175 && Math.abs(z) < 35) return;             // club building
      if (Math.abs(z) > 150 && Math.abs(z) < 200 && Math.abs(x) < 70) return; // bus & tram zones
      if (Math.abs(x) < 22 && z < -160 && z > -300) return; // boulevard
      // also reject if too close to an existing tree
      for (const p of places) {
        const dx = p.x - x, dz = p.z - z;
        if (dx * dx + dz * dz < minDist * minDist) return;
      }
      places.push({ x, z });
    }

    // Boulevard tree alley — denser, ordered rows
    for (let i = 0; i < 14; i++) {
      const z = -160 - i * 10;
      tryAdd(-26, z, 3);
      tryAdd( 26, z, 3);
    }
    // Two outer rings of scattered trees
    for (let i = 0; i < 500; i++) {
      const a = Math.random() * TAU;
      const r = 145 + Math.random() * 130;
      tryAdd(Math.cos(a) * r, Math.sin(a) * r, 5);
      if (places.length > 220) break;
    }

    const trunkMats = new Float32Array(places.length * 16);
    const crownMats = new Float32Array(places.length * 16);
    const crownCols = new Float32Array(places.length * 4);
    const greens = [hexToColor3(0x456a3a), hexToColor3(0x375d33), hexToColor3(0x5a7a4a), hexToColor3(0x506a40)];
    for (let i = 0; i < places.length; i++) {
      const p = places[i];
      const s = 0.85 + Math.random() * 0.45;
      const yaw = Math.random() * TAU;
      const rot = BABYLON.Quaternion.RotationYawPitchRoll(yaw, 0, 0);
      const scaleT = new BABYLON.Vector3(s, s, s);
      // Trunk pos
      BABYLON.Matrix.Compose(scaleT, rot, new BABYLON.Vector3(p.x, 1.1 * s, p.z)).copyToArray(trunkMats, i * 16);
      // Crown pos (above trunk)
      BABYLON.Matrix.Compose(scaleT, rot, new BABYLON.Vector3(p.x, (2.2 + 4.4 * 0.5) * s, p.z)).copyToArray(crownMats, i * 16);
      const c = greens[(Math.random() * greens.length) | 0];
      crownCols[i * 4] = c.r; crownCols[i * 4 + 1] = c.g; crownCols[i * 4 + 2] = c.b; crownCols[i * 4 + 3] = 1;
    }
    trunk.thinInstanceSetBuffer('matrix', trunkMats, 16, true);
    crown.thinInstanceSetBuffer('matrix', crownMats, 16, true);
    crown.thinInstanceSetBuffer('color',  crownCols, 4, false);
    trunk.isVisible = true; crown.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 10. Lamp posts — thin instances along boulevard, concourse and ring road
  // ───────────────────────────────────────────────────────────────
  {
    const mast = BABYLON.MeshBuilder.CreateCylinder('lampMast', {
      height: 8, diameter: 0.18, tessellation: 6,
    }, scene);
    mast.material = matSteel; mast.parent = root; mast.isVisible = false;

    const head = BABYLON.MeshBuilder.CreateBox('lampHead', { width: 0.7, height: 0.3, depth: 0.7 }, scene);
    const headMat = new BABYLON.StandardMaterial('lampHeadMat', scene);
    headMat.diffuseColor = hexToColor3(0xffd87a);
    headMat.emissiveColor = hexToColor3(0xffd87a).scale(0.5);
    head.material = headMat; head.parent = root; head.isVisible = false;

    const positions = [];
    // Boulevard
    for (let i = 0; i < 13; i++) {
      const z = -158 - i * 11;
      positions.push([-21, z]); positions.push([21, z]);
    }
    // Around concourse — 16 evenly
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * TAU;
      positions.push([Math.cos(a) * 142, Math.sin(a) * 142]);
    }
    // Along ring road outside curb — 24 evenly
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * TAU + 0.05;
      positions.push([Math.cos(a) * 212, Math.sin(a) * 212]);
    }

    const mastMats = new Float32Array(positions.length * 16);
    const headMats = new Float32Array(positions.length * 16);
    const sc6 = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < positions.length; i++) {
      const [x, z] = positions[i];
      BABYLON.Matrix.Compose(sc6, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(x, 4, z)).copyToArray(mastMats, i * 16);
      BABYLON.Matrix.Compose(sc6, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(x, 8.15, z)).copyToArray(headMats, i * 16);
    }
    mast.thinInstanceSetBuffer('matrix', mastMats, 16, true);
    head.thinInstanceSetBuffer('matrix', headMats, 16, true);
    mast.isVisible = true; head.isVisible = true;
  }

  // ───────────────────────────────────────────────────────────────
  // 11. Harbour edge — large water plane on the far south (Hafenstadt!)
  // ───────────────────────────────────────────────────────────────
  {
    const water = BABYLON.MeshBuilder.CreateGround('water', { width: 900, height: 250 }, scene);
    water.position.set(0, -0.1, 360);
    water.material = matWater;
    water.parent = root;

    // Stone quay between water and bus park
    const quay = BABYLON.MeshBuilder.CreateGround('quay', { width: 900, height: 18 }, scene);
    quay.position.set(0, 0.04, 230);
    quay.material = matCurb;
    quay.parent = root;

    // Bollards along the quay
    const boll = BABYLON.MeshBuilder.CreateCylinder('bollard', {
      height: 0.8, diameterTop: 0.45, diameterBottom: 0.5, tessellation: 8,
    }, scene);
    boll.material = matSteel; boll.parent = root; boll.isVisible = false;
    const bcount = 30;
    const bmats = new Float32Array(bcount * 16);
    const scB = new BABYLON.Vector3(1, 1, 1);
    for (let i = 0; i < bcount; i++) {
      const x = -200 + i * 14;
      BABYLON.Matrix.Compose(scB, BABYLON.Quaternion.Identity(), new BABYLON.Vector3(x, 0.4, 236)).copyToArray(bmats, i * 16);
    }
    boll.thinInstanceSetBuffer('matrix', bmats, 16, true);
    boll.isVisible = true;
  }

  function setEnabled(v) { root.setEnabled(v); }
  return { root, setEnabled };
}

// ── Tiny helper: clone a material into a slightly darker variant on demand ──
// (Used for window/dark strips so we don't need a dozen tiny material defs.)
function matVip(srcMat) {
  // Re-use the dark roof mat; just return the source for boxes that want dark
  return srcMat;
}
