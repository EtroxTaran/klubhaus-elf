// pitch.js — Pitch, markings, goals.
import * as THREE from 'three';
import { PITCH } from './config.js';

export function buildPitch() {
  const group = new THREE.Group();

  // Striped grass
  for (let i = 0; i < 14; i++) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(PITCH.w - 0.02, PITCH.h / 14 - 0.02),
      new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0x3d5e3d : 0x476c46, roughness: 0.95 })
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(0, 0.01, -PITCH.h / 2 + i * (PITCH.h / 14) + PITCH.h / 28);
    stripe.receiveShadow = true;
    group.add(stripe);
  }

  // Markings
  const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const halfW = PITCH.w / 2, halfH = PITCH.h / 2, y = 0.03;
  const addLine = (pts) => {
    const g = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
    group.add(new THREE.Line(g, lineMat));
  };
  addLine([[-halfW,y,-halfH],[halfW,y,-halfH],[halfW,y,halfH],[-halfW,y,halfH],[-halfW,y,-halfH]]);
  addLine([[-halfW,y,0],[halfW,y,0]]);
  const circ = [];
  for (let i = 0; i <= 64; i++) { const a = (i/64) * Math.PI * 2; circ.push([Math.cos(a)*9.15, y, Math.sin(a)*9.15]); }
  addLine(circ);
  const pbW = 40.32, pbD = 16.5, gaW = 18.32, gaD = 5.5;
  for (const s of [-1, 1]) {
    const zEdge = s * halfH, zIn = zEdge - s * pbD;
    addLine([[-pbW/2,y,zEdge],[-pbW/2,y,zIn],[pbW/2,y,zIn],[pbW/2,y,zEdge]]);
    addLine([[-gaW/2,y,zEdge],[-gaW/2,y,zEdge - s*gaD],[gaW/2,y,zEdge - s*gaD],[gaW/2,y,zEdge]]);
  }

  // Goals (white posts + crossbar + simple translucent net)
  const goalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const netMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
  for (const s of [-1, 1]) {
    const goal = new THREE.Group();
    goal.position.z = s * halfH;
    const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.44, 8), goalMat);
    post1.position.set(-3.66, 1.22, 0); post1.castShadow = true; goal.add(post1);
    const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.44, 8), goalMat);
    post2.position.set( 3.66, 1.22, 0); post2.castShadow = true; goal.add(post2);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 7.32, 8), goalMat);
    bar.rotation.z = Math.PI / 2; bar.position.set(0, 2.44, 0); bar.castShadow = true; goal.add(bar);
    const net = new THREE.Mesh(new THREE.BoxGeometry(7.32, 2.44, 1.8), netMat);
    net.position.set(0, 1.22, s * 0.9); goal.add(net);
    group.add(goal);
  }

  // Center spot + penalty spots
  const spotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (const z of [0, halfH - 11, -(halfH - 11)]) {
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), spotMat);
    spot.rotation.x = -Math.PI / 2;
    spot.position.set(0, 0.04, z);
    group.add(spot);
  }

  return group;
}
