// pitch.js — Pitch, markings, goals (Babylon).
import { PITCH, hexToColor3 } from './config.js';

const B = () => BABYLON;

export function buildPitch(scene) {
  const root = new BABYLON.TransformNode('pitch', scene);

  // ── Striped grass — 14 plane strips alternating two greens ──
  const stripeMatA = new BABYLON.StandardMaterial('grassA', scene);
  stripeMatA.diffuseColor = hexToColor3(0x3d5e3d);
  stripeMatA.specularColor = new BABYLON.Color3(0, 0, 0);
  const stripeMatB = new BABYLON.StandardMaterial('grassB', scene);
  stripeMatB.diffuseColor = hexToColor3(0x476c46);
  stripeMatB.specularColor = new BABYLON.Color3(0, 0, 0);

  for (let i = 0; i < 14; i++) {
    const stripe = BABYLON.MeshBuilder.CreateGround(`stripe_${i}`, {
      width: PITCH.w - 0.02,
      height: PITCH.h / 14 - 0.02,
    }, scene);
    stripe.position.set(0, 0.01, -PITCH.h / 2 + i * (PITCH.h / 14) + PITCH.h / 28);
    stripe.material = i % 2 === 0 ? stripeMatA : stripeMatB;
    stripe.receiveShadows = true;
    stripe.parent = root;
  }

  // ── Field markings — line meshes ──
  const lineColor = new BABYLON.Color3(1, 1, 1);
  const halfW = PITCH.w / 2, halfH = PITCH.h / 2, y = 0.03;

  const addLine = (pts, name) => {
    const line = BABYLON.MeshBuilder.CreateLines(name, {
      points: pts.map(p => new BABYLON.Vector3(p[0], p[1], p[2])),
    }, scene);
    line.color = lineColor;
    line.alpha = 0.9;
    line.parent = root;
    return line;
  };

  // Outer rectangle + halfway line
  addLine([[-halfW,y,-halfH],[halfW,y,-halfH],[halfW,y,halfH],[-halfW,y,halfH],[-halfW,y,-halfH]], 'rect');
  addLine([[-halfW,y,0],[halfW,y,0]], 'halfway');

  // Centre circle (64 segments)
  const circ = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    circ.push([Math.cos(a) * 9.15, y, Math.sin(a) * 9.15]);
  }
  addLine(circ, 'center-circle');

  // Penalty + goal area lines (both ends)
  const pbW = 40.32, pbD = 16.5, gaW = 18.32, gaD = 5.5;
  for (const s of [-1, 1]) {
    const zEdge = s * halfH, zIn = zEdge - s * pbD;
    addLine([[-pbW/2,y,zEdge],[-pbW/2,y,zIn],[pbW/2,y,zIn],[pbW/2,y,zEdge]], `pb_${s}`);
    addLine([[-gaW/2,y,zEdge],[-gaW/2,y,zEdge - s*gaD],[gaW/2,y,zEdge - s*gaD],[gaW/2,y,zEdge]], `ga_${s}`);
  }

  // Centre + penalty spots — tiny white discs
  const spotMat = new BABYLON.StandardMaterial('spot', scene);
  spotMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
  spotMat.disableLighting = true;
  for (const z of [0, halfH - 11, -(halfH - 11)]) {
    const spot = BABYLON.MeshBuilder.CreateDisc(`spot_${z}`, { radius: 0.15, tessellation: 16 }, scene);
    spot.rotation.x = Math.PI / 2;
    spot.position.set(0, 0.04, z);
    spot.material = spotMat;
    spot.parent = root;
  }

  // ── Goals — posts, crossbar, translucent net ──
  const goalMat = new BABYLON.StandardMaterial('goal', scene);
  goalMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  goalMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

  const netMat = new BABYLON.StandardMaterial('net', scene);
  netMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  netMat.alpha = 0.08;
  netMat.backFaceCulling = false;

  for (const s of [-1, 1]) {
    const goalGroup = new BABYLON.TransformNode(`goal_${s}`, scene);
    goalGroup.position.z = s * halfH;
    goalGroup.parent = root;

    // Posts
    for (const x of [-3.66, 3.66]) {
      const post = BABYLON.MeshBuilder.CreateCylinder(`post_${s}_${x}`, {
        height: 2.44, diameter: 0.12, tessellation: 8,
      }, scene);
      post.position.set(x, 1.22, 0);
      post.material = goalMat;
      post.parent = goalGroup;
    }
    // Crossbar
    const bar = BABYLON.MeshBuilder.CreateCylinder(`bar_${s}`, {
      height: 7.32, diameter: 0.12, tessellation: 8,
    }, scene);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 2.44, 0);
    bar.material = goalMat;
    bar.parent = goalGroup;

    // Net volume
    const net = BABYLON.MeshBuilder.CreateBox(`net_${s}`, { width: 7.32, height: 2.44, depth: 1.8 }, scene);
    net.position.set(0, 1.22, s * 0.9);
    net.material = netMat;
    net.parent = goalGroup;
  }

  return root;
}
