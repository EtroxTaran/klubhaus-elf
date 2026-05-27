// infra.js — Plaza, parking (instanced), gates, scoreboard, stadium signage.
import * as THREE from 'three';
import { STADIUM_NAME, BOWL, PITCH } from './config.js';

export function buildInfrastructure({ accent = 0x1f3d6b, secondary = 0xd9b04a }) {
  const group = new THREE.Group();

  // Outer ring concourse
  const concourse = new THREE.Mesh(
    new THREE.RingGeometry(105, 138, 80),
    new THREE.MeshStandardMaterial({ color: 0xc8baa0, roughness: 0.95, side: THREE.DoubleSide })
  );
  concourse.rotation.x = -Math.PI / 2;
  concourse.position.y = 0.02;
  concourse.receiveShadow = true;
  group.add(concourse);

  // Plaza in front of N stand (where the stadium signage will go too)
  const plaza = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 24),
    new THREE.MeshStandardMaterial({ color: 0xbfb098, roughness: 0.95 })
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0.03, -150);
  plaza.receiveShadow = true;
  group.add(plaza);

  // ── Parking blocks via InstancedMesh ──
  const carGeo = new THREE.BoxGeometry(1.6, 0.42, 3);
  const carGreyMat = new THREE.MeshStandardMaterial({ color: 0x7d7064, roughness: 0.7 });
  const carAccentMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.6, metalness: 0.2 });

  const cornerOffsets = [[ 130,-130],[-130,-130],[ 130, 130],[-130, 130]];
  const totalGrey = cornerOffsets.length * 5 * 8;      // up to 160 grey cars
  const totalAccent = cornerOffsets.length * 5 * 8;    // accent batch
  const greyMesh = new THREE.InstancedMesh(carGeo, carGreyMat, totalGrey);
  const accentMesh = new THREE.InstancedMesh(carGeo, carAccentMat, totalAccent);
  greyMesh.castShadow = true; accentMesh.castShadow = true;
  greyMesh.frustumCulled = false; accentMesh.frustumCulled = false;

  const tmpM = new THREE.Matrix4();
  let gi = 0, ai = 0;
  for (const [x, z] of cornerOffsets) {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        const px = x + (c - 3.5) * 2.2;
        const pz = z + (r - 2) * 4.0;
        if (Math.random() < 0.18) continue;  // empty spots
        tmpM.makeTranslation(px, 0.21, pz);
        if ((r + c) % 5 === 0) accentMesh.setMatrixAt(ai++, tmpM);
        else greyMesh.setMatrixAt(gi++, tmpM);
      }
    }
  }
  greyMesh.count = gi;
  accentMesh.count = ai;
  greyMesh.instanceMatrix.needsUpdate = true;
  accentMesh.instanceMatrix.needsUpdate = true;
  group.add(greyMesh);
  group.add(accentMesh);

  // ── Entrance gates (4 cuboids in a row in front of N stand) ──
  const gateMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.7 });
  const gateGeo = new THREE.BoxGeometry(3.6, 4.0, 1.6);
  for (const gx of [-22, -8, 8, 22]) {
    const gate = new THREE.Mesh(gateGeo, gateMat);
    gate.position.set(gx, 2.0, -148);
    gate.castShadow = true;
    group.add(gate);
  }

  // ── Stadium name sign (raised slab on plaza facing the camera) ──
  {
    const signMat = new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.6, metalness: 0.15 });
    const signSlab = new THREE.Mesh(new THREE.BoxGeometry(36, 5.5, 0.8), signMat);
    signSlab.position.set(0, 3.0, -157);
    signSlab.castShadow = true;
    group.add(signSlab);

    // Letter text via canvas texture
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 156;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#f6efdc';
    ctx.font = '700 92px Newsreader, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(STADIUM_NAME, c.width / 2, c.height / 2);
    // small subtitle line
    ctx.font = '600 22px Inter, sans-serif';
    ctx.fillStyle = '#b7301b';
    ctx.fillText('HAFENSTADT · EST. 1923', c.width / 2, c.height - 28);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: false });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(35, 5), labelMat);
    label.position.set(0, 3.0, -156.59);
    label.rotation.y = 0;
    group.add(label);
  }

  // ── Scoreboard (mounted on a tall pylon behind the south goal) ──
  const scoreboardGroup = new THREE.Group();
  {
    const sbBaseHeight = 26;     // top of pylon / centre of board
    const sbPanelW = 22, sbPanelH = 9;

    // Pylon — tapered steel mast going from ground to top
    const pylonMat = new THREE.MeshStandardMaterial({ color: 0x231a13, roughness: 0.55, metalness: 0.45 });
    const pylon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.6, sbBaseHeight - 2, 10),
      pylonMat
    );
    pylon.position.y = (sbBaseHeight - 2) / 2;
    pylon.castShadow = true;
    scoreboardGroup.add(pylon);
    // Cross-brace at mid-height for industrial feel
    const brace = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.18, 0.4),
      pylonMat
    );
    brace.position.y = sbBaseHeight / 2;
    brace.castShadow = true;
    scoreboardGroup.add(brace);

    // Backing slab
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(sbPanelW, sbPanelH, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0a0807, roughness: 0.5 })
    );
    board.position.y = sbBaseHeight;
    board.position.z = 0.5;
    board.castShadow = true;
    scoreboardGroup.add(board);

    // Screen face — canvas-rendered scoreline
    const c = document.createElement('canvas');
    c.width = 880; c.height = 360;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0a0807';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '700 200px Newsreader, Georgia, serif';
    ctx.fillStyle = '#f6efdc';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('2 — 1', c.width / 2, c.height / 2 - 8);
    ctx.font = '600 36px Inter, sans-serif';
    ctx.fillStyle = '#b7301b';
    ctx.textAlign = 'left';
    ctx.fillText('AURELIA', 60, 60);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#cbb98a';
    ctx.fillText('AUERBACH', c.width - 60, 60);
    ctx.font = '700 44px JetBrains Mono, monospace';
    ctx.fillStyle = '#f6efdc';
    ctx.textAlign = 'center';
    ctx.fillText("78'", c.width / 2, c.height - 50);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(sbPanelW - 1, sbPanelH - 0.6),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    face.position.set(0, sbBaseHeight, 0.81);
    scoreboardGroup.add(face);

    // Tilt the whole top assembly slightly forward (toward pitch)
    board.rotation.x = -0.08;
    face.rotation.x = -0.08;

    // Position the pylon behind the back wall, off-axis behind one goal.
    // Pitch z half = 52.5, back wall outer ≈ 78.5. Put it at z=82 just behind back wall.
    scoreboardGroup.position.set(0, 0, 90);
    scoreboardGroup.rotation.y = Math.PI;  // panel faces inward toward pitch (-z)
  }
  group.add(scoreboardGroup);

  // API for theme updates
  function setAccent(hex) {
    carAccentMat.color.setHex(hex);
  }

  return { group, scoreboardGroup, setAccent };
}
