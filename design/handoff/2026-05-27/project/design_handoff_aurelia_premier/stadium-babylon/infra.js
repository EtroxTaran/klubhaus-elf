// infra.js — Plaza, parking (thin instances), gates, scoreboard, signage (Babylon).
import { STADIUM_NAME, hexToColor3 } from './config.js';

export function buildInfrastructure(scene, { accent = 0x1f3d6b, secondary = 0xd9b04a, shadowGen = null } = {}) {
  const root = new BABYLON.TransformNode('infra', scene);

  // ── Outer ring concourse (a flat disc-with-hole, made via ribbon) ──
  {
    const segs = 80;
    const rIn = 105, rOut = 138;
    const inner = [], outer = [];
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      inner.push(new BABYLON.Vector3(Math.cos(a) * rIn,  0.02, Math.sin(a) * rIn));
      outer.push(new BABYLON.Vector3(Math.cos(a) * rOut, 0.02, Math.sin(a) * rOut));
    }
    const concourse = BABYLON.MeshBuilder.CreateRibbon('concourse', {
      pathArray: [inner, outer], sideOrientation: BABYLON.Mesh.DOUBLESIDE, closeArray: false,
    }, scene);
    const mat = new BABYLON.StandardMaterial('concourseMat', scene);
    mat.diffuseColor = hexToColor3(0xc8baa0);
    mat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    concourse.material = mat;
    concourse.receiveShadows = true;
    concourse.parent = root;
  }

  // ── Plaza in front of N stand ──
  {
    const plaza = BABYLON.MeshBuilder.CreateGround('plaza', { width: 80, height: 24 }, scene);
    plaza.position.set(0, 0.03, -150);
    const mat = new BABYLON.StandardMaterial('plazaMat', scene);
    mat.diffuseColor = hexToColor3(0xbfb098);
    mat.specularColor = new BABYLON.Color3(0.02, 0.02, 0.02);
    plaza.material = mat;
    plaza.receiveShadows = true;
    plaza.parent = root;
  }

  // ── Parking — thin instances of cars in two colour groups ──
  const cornerOffsets = [[ 130,-130],[-130,-130],[ 130, 130],[-130, 130]];

  const carGreyMat = new BABYLON.StandardMaterial('carGreyMat', scene);
  carGreyMat.diffuseColor = hexToColor3(0x7d7064);
  const carAccentMat = new BABYLON.StandardMaterial('carAccentMat', scene);
  carAccentMat.diffuseColor = hexToColor3(accent);
  carAccentMat.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const greyCar = BABYLON.MeshBuilder.CreateBox('greyCar', { width: 1.6, height: 0.42, depth: 3 }, scene);
  greyCar.material = carGreyMat;
  greyCar.parent = root;
  greyCar.isVisible = false;
  const accentCar = BABYLON.MeshBuilder.CreateBox('accentCar', { width: 1.6, height: 0.42, depth: 3 }, scene);
  accentCar.material = carAccentMat;
  accentCar.parent = root;
  accentCar.isVisible = false;

  const greyMatrices = [];
  const accentMatrices = [];
  const scale1 = new BABYLON.Vector3(1, 1, 1);
  const rotId = BABYLON.Quaternion.Identity();
  for (const [x, z] of cornerOffsets) {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        const px = x + (c - 3.5) * 2.2;
        const pz = z + (r - 2) * 4.0;
        if (Math.random() < 0.18) continue;
        const m = BABYLON.Matrix.Compose(scale1, rotId, new BABYLON.Vector3(px, 0.21, pz));
        const arr = new Float32Array(16); m.copyToArray(arr);
        if ((r + c) % 5 === 0) accentMatrices.push(arr);
        else greyMatrices.push(arr);
      }
    }
  }

  function flat(arr) {
    const out = new Float32Array(arr.length * 16);
    for (let i = 0; i < arr.length; i++) out.set(arr[i], i * 16);
    return out;
  }
  greyCar.thinInstanceSetBuffer('matrix', flat(greyMatrices), 16, true);
  accentCar.thinInstanceSetBuffer('matrix', flat(accentMatrices), 16, true);
  greyCar.isVisible = true;
  accentCar.isVisible = true;
  if (shadowGen) { shadowGen.addShadowCaster(greyCar); shadowGen.addShadowCaster(accentCar); }

  // ── Entrance gates (4 cuboids in front of N stand) ──
  const gateMat = new BABYLON.StandardMaterial('gateMat', scene);
  gateMat.diffuseColor = hexToColor3(0x1a1410);
  for (const gx of [-22, -8, 8, 22]) {
    const gate = BABYLON.MeshBuilder.CreateBox(`gate_${gx}`, { width: 3.6, height: 4.0, depth: 1.6 }, scene);
    gate.position.set(gx, 2.0, -148);
    gate.material = gateMat;
    gate.parent = root;
    if (shadowGen) shadowGen.addShadowCaster(gate);
  }

  // ── Stadium signage on plaza ──
  {
    const slabMat = new BABYLON.StandardMaterial('signSlabMat', scene);
    slabMat.diffuseColor = hexToColor3(0x1a1410);
    slabMat.specularColor = new BABYLON.Color3(0.15, 0.15, 0.15);
    const slab = BABYLON.MeshBuilder.CreateBox('signSlab', { width: 36, height: 5.5, depth: 0.8 }, scene);
    slab.position.set(0, 3.0, -157);
    slab.material = slabMat;
    slab.parent = root;
    if (shadowGen) shadowGen.addShadowCaster(slab);

    // Letter face — DynamicTexture
    const dt = new BABYLON.DynamicTexture('signTex', { width: 1024, height: 156 }, scene, false);
    dt.hasAlpha = false;
    const ctx = dt.getContext();
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(0, 0, 1024, 156);
    ctx.fillStyle = '#f6efdc';
    ctx.font = '700 92px Newsreader, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(STADIUM_NAME, 512, 78);
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillStyle = '#b7301b';
    ctx.fillText('HAFENSTADT · EST. 1923', 512, 156 - 28);
    dt.update();

    const faceMat = new BABYLON.StandardMaterial('signFaceMat', scene);
    faceMat.diffuseTexture = dt;
    faceMat.emissiveColor = new BABYLON.Color3(0.6, 0.56, 0.48);
    faceMat.specularColor = new BABYLON.Color3(0, 0, 0);
    faceMat.backFaceCulling = false;

    const face = BABYLON.MeshBuilder.CreatePlane('signFace', { width: 35, height: 5 }, scene);
    face.position.set(0, 3.0, -156.59);
    face.material = faceMat;
    face.parent = root;
  }

  // ── Scoreboard ──
  const scoreboardGroup = new BABYLON.TransformNode('scoreboard', scene);
  scoreboardGroup.parent = root;
  {
    const sbBaseHeight = 26;
    const sbPanelW = 22, sbPanelH = 9;

    const pylonMat = new BABYLON.StandardMaterial('pylonMat', scene);
    pylonMat.diffuseColor = hexToColor3(0x231a13);
    pylonMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);

    const pylon = BABYLON.MeshBuilder.CreateCylinder('sbPylon', {
      height: sbBaseHeight - 2, diameterTop: 0.7, diameterBottom: 1.2, tessellation: 10,
    }, scene);
    pylon.position.y = (sbBaseHeight - 2) / 2;
    pylon.material = pylonMat;
    pylon.parent = scoreboardGroup;
    if (shadowGen) shadowGen.addShadowCaster(pylon);

    const brace = BABYLON.MeshBuilder.CreateBox('sbBrace', { width: 2.6, height: 0.18, depth: 0.4 }, scene);
    brace.position.y = sbBaseHeight / 2;
    brace.material = pylonMat;
    brace.parent = scoreboardGroup;

    // Backing slab
    const boardMat = new BABYLON.StandardMaterial('sbBoardMat', scene);
    boardMat.diffuseColor = hexToColor3(0x0a0807);
    const board = BABYLON.MeshBuilder.CreateBox('sbBoard', { width: sbPanelW, height: sbPanelH, depth: 0.6 }, scene);
    board.position.set(0, sbBaseHeight, 0.5);
    board.rotation.x = -0.08;
    board.material = boardMat;
    board.parent = scoreboardGroup;
    if (shadowGen) shadowGen.addShadowCaster(board);

    // Screen face — DynamicTexture
    const dt = new BABYLON.DynamicTexture('sbTex', { width: 880, height: 360 }, scene, false);
    const ctx = dt.getContext();
    ctx.fillStyle = '#0a0807';
    ctx.fillRect(0, 0, 880, 360);
    ctx.font = '700 200px Newsreader, Georgia, serif';
    ctx.fillStyle = '#f6efdc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2 — 1', 440, 180 - 8);
    ctx.font = '600 36px Inter, sans-serif';
    ctx.fillStyle = '#b7301b';
    ctx.textAlign = 'left';
    ctx.fillText('AURELIA', 60, 60);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cbb98a';
    ctx.fillText('AUERBACH', 880 - 60, 60);
    ctx.font = '700 44px JetBrains Mono, monospace';
    ctx.fillStyle = '#f6efdc';
    ctx.textAlign = 'center';
    ctx.fillText("78'", 440, 360 - 50);
    dt.update();

    const faceMat = new BABYLON.StandardMaterial('sbFaceMat', scene);
    faceMat.diffuseTexture = dt;
    faceMat.emissiveColor = new BABYLON.Color3(0.8, 0.78, 0.7);
    faceMat.specularColor = new BABYLON.Color3(0, 0, 0);
    faceMat.disableLighting = true;

    const face = BABYLON.MeshBuilder.CreatePlane('sbFace', { width: sbPanelW - 1, height: sbPanelH - 0.6 }, scene);
    face.position.set(0, sbBaseHeight, 0.81);
    face.rotation.x = -0.08;
    face.material = faceMat;
    face.parent = scoreboardGroup;

    scoreboardGroup.position.set(0, 0, 90);
    scoreboardGroup.rotation.y = Math.PI;  // panel faces inward toward pitch
  }

  function setAccent(hex) {
    carAccentMat.diffuseColor = hexToColor3(hex);
  }

  function setVisible(v) { root.setEnabled(v); }
  function setScoreboardVisible(v) { scoreboardGroup.setEnabled(v); }

  return { root, scoreboardGroup, setAccent, setVisible, setScoreboardVisible };
}
