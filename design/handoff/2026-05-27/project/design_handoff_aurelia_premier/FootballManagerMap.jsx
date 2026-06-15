// FootballManagerMap.jsx
// ------------------------------------------------------------------
// Production-ready React Three Fiber tycoon map for Klubhaus Elf.
// Drop this file into a Vite + React project that already has:
//   npm i three @react-three/fiber @react-three/drei
//
// Usage:
//   import FootballManagerMap from './FootballManagerMap';
//   <FootballManagerMap />
//
// All geometry is procedural — no external asset dependencies.
// ------------------------------------------------------------------

import React, { useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';

// ── Theme tokens (Aurelia Premier palette adapted to a vibrant tycoon look) ──
const C = {
  paper:        '#f4ede0',
  ink:          '#1a1410',
  scarlet:      '#b7301b',
  scarletDark:  '#8a2210',
  grass:        '#4a8a3b',
  grassDark:    '#3f7831',
  grassLight:   '#5fa64e',
  concrete:     '#cfc5b1',
  concreteDark: '#9c9180',
  road:         '#454035',
  roof:         '#1c1814',
  glass:        '#7fb4d3',
  glassDark:    '#3c5b78',
  tree:         '#2d5a2c',
  treeTrunk:    '#5a3a22',
  carColors:    ['#9c9180', '#1f3d6b', '#7a1c2f', '#3b6e3e', '#e8c66a', '#f0e7d4'],
};

// ── HoverableGroup — adds hover scale + emissive glow + click logging ──
function HoverableGroup({ name, children, scaleOnHover = 1.03 }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef();
  const targetScale = useRef(1);

  // Smooth scale interpolation
  useFrame(() => {
    if (!groupRef.current) return;
    const t = hovered ? scaleOnHover : 1;
    targetScale.current += (t - targetScale.current) * 0.15;
    groupRef.current.scale.setScalar(targetScale.current);
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); console.log(`[click] ${name}`); }}
    >
      {typeof children === 'function' ? children({ hovered }) : children}
    </group>
  );
}

// ── Pitch (reusable green field with white markings) ──
function Pitch({ width = 24, depth = 36, lineColor = '#ffffff', stripes = true }) {
  const lines = useMemo(() => {
    const hw = width / 2, hd = depth / 2;
    const pbW = width * 0.55, pbD = depth * 0.15;
    const segs = [];
    // Perimeter
    segs.push([[-hw, 0, -hd], [hw, 0, -hd], [hw, 0, hd], [-hw, 0, hd], [-hw, 0, -hd]]);
    // Halfway
    segs.push([[-hw, 0, 0], [hw, 0, 0]]);
    // Center circle
    const circ = [];
    const r = Math.min(width, depth) * 0.13;
    for (let i = 0; i <= 32; i++) { const a = (i / 32) * Math.PI * 2; circ.push([Math.cos(a) * r, 0, Math.sin(a) * r]); }
    segs.push(circ);
    // Penalty boxes
    for (const s of [-1, 1]) {
      const ze = s * hd, zi = ze - s * pbD;
      segs.push([[-pbW / 2, 0, ze], [-pbW / 2, 0, zi], [pbW / 2, 0, zi], [pbW / 2, 0, ze]]);
    }
    return segs;
  }, [width, depth]);

  return (
    <group>
      {/* Grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.005, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={C.grass} roughness={0.95} />
      </mesh>
      {/* Stripes (mowing pattern) */}
      {stripes && Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.011, -depth / 2 + i * (depth / 12) + depth / 24]}>
          <planeGeometry args={[width - 0.05, depth / 12 - 0.05]} />
          <meshStandardMaterial color={i % 2 === 0 ? C.grass : C.grassLight} roughness={0.95} />
        </mesh>
      ))}
      {/* Markings */}
      {lines.map((pts, i) => (
        <line key={i} position={[0, 0.022, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={pts.length}
              array={new Float32Array(pts.flat())}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={lineColor} transparent opacity={0.9} />
        </line>
      ))}
    </group>
  );
}

// ── Floodlight Tower ──
function Floodlight({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 10, 8]} />
        <meshStandardMaterial color="#2a261f" roughness={0.7} metalness={0.4} />
      </mesh>
      <mesh position={[0, 10.2, 0]} castShadow>
        <boxGeometry args={[1.3, 0.5, 0.9]} />
        <meshStandardMaterial color="#1a1410" roughness={0.6} />
      </mesh>
      <mesh position={[0, 10.0, 0.51]}>
        <planeGeometry args={[1.1, 0.35]} />
        <meshStandardMaterial color="#ffd87a" emissive="#ffd87a" emissiveIntensity={1.8} />
      </mesh>
      <pointLight position={[0, 10, 0]} color="#fff2b0" intensity={0.4} distance={40} decay={1.5} />
    </group>
  );
}

// ── Stadium ──
function Stadium({ position = [0, 0, 0] }) {
  // Tycoon-scale stadium: simpler than a realistic build, but recognisable
  const pitchW = 24, pitchD = 36;
  const stands = [
    { side: 'N', w: pitchW + 8, d: 5, dz: -(pitchD / 2 + 3.5), rot: 0 },
    { side: 'S', w: pitchW + 8, d: 5, dz: (pitchD / 2 + 3.5), rot: Math.PI },
    { side: 'E', w: pitchD + 6, d: 4, dz: (pitchW / 2 + 3) + 1, rot: -Math.PI / 2 }, // dz used as x offset post-rotate
    { side: 'W', w: pitchD + 6, d: 4, dz: -(pitchW / 2 + 3) - 1, rot: Math.PI / 2 },
  ];
  return (
    <HoverableGroup name="Stadium">
      <group position={position}>
        <Pitch width={pitchW} depth={pitchD} />

        {/* Stands — N/S */}
        {[['N', -(pitchD / 2 + 3.5)], ['S', (pitchD / 2 + 3.5)]].map(([key, z]) => (
          <group key={key} position={[0, 0, z]}>
            {/* Lower tier (concrete base) */}
            <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
              <boxGeometry args={[pitchW + 8, 2.0, 5]} />
              <meshStandardMaterial color={C.concrete} roughness={0.9} />
            </mesh>
            {/* Seat band (scarlet accent) */}
            <mesh position={[0, 2.1, key === 'N' ? -1.5 : 1.5]} castShadow>
              <boxGeometry args={[pitchW + 6, 0.5, 1.2]} />
              <meshStandardMaterial color={C.scarlet} roughness={0.7} />
            </mesh>
            {/* Upper tier */}
            <mesh position={[0, 3.2, key === 'N' ? -0.5 : 0.5]} castShadow>
              <boxGeometry args={[pitchW + 7, 1.0, 3]} />
              <meshStandardMaterial color={C.concreteDark} roughness={0.85} />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 4.6, key === 'N' ? -0.5 : 0.5]} rotation={[key === 'N' ? -0.1 : 0.1, 0, 0]} castShadow>
              <boxGeometry args={[pitchW + 9, 0.2, 4.5]} />
              <meshStandardMaterial color={C.roof} roughness={0.6} metalness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Stands — E/W (rotated so long axis aligns z) */}
        {[['E', (pitchW / 2 + 3.5)], ['W', -(pitchW / 2 + 3.5)]].map(([key, x]) => (
          <group key={key} position={[x, 0, 0]}>
            <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
              <boxGeometry args={[4, 2.0, pitchD + 6]} />
              <meshStandardMaterial color={C.concrete} roughness={0.9} />
            </mesh>
            <mesh position={[key === 'E' ? -1.2 : 1.2, 2.1, 0]} castShadow>
              <boxGeometry args={[1.0, 0.5, pitchD + 4]} />
              <meshStandardMaterial color={C.scarlet} roughness={0.7} />
            </mesh>
            <mesh position={[key === 'E' ? -0.3 : 0.3, 3.0, 0]} castShadow>
              <boxGeometry args={[2.5, 0.9, pitchD + 5]} />
              <meshStandardMaterial color={C.concreteDark} roughness={0.85} />
            </mesh>
            <mesh position={[key === 'E' ? -0.3 : 0.3, 4.3, 0]} rotation={[0, 0, key === 'E' ? 0.1 : -0.1]} castShadow>
              <boxGeometry args={[3.6, 0.2, pitchD + 7]} />
              <meshStandardMaterial color={C.roof} roughness={0.6} metalness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Floodlights at corners */}
        <Floodlight position={[-(pitchW / 2 + 6), 0, -(pitchD / 2 + 6)]} />
        <Floodlight position={[(pitchW / 2 + 6), 0, -(pitchD / 2 + 6)]} />
        <Floodlight position={[-(pitchW / 2 + 6), 0, (pitchD / 2 + 6)]} />
        <Floodlight position={[(pitchW / 2 + 6), 0, (pitchD / 2 + 6)]} />

        {/* Goalposts */}
        {[-1, 1].map((s) => (
          <group key={s} position={[0, 0, s * pitchD / 2]}>
            <mesh position={[-2, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[2, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 1.4, 6]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 4, 6]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Dugouts (small box + roof) on the W side of the pitch */}
        {[-1, 1].map((s) => (
          <group key={s} position={[-(pitchW / 2 + 1.4), 0.4, s * 6]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <boxGeometry args={[1.6, 0.7, 3]} />
              <meshStandardMaterial color={C.ink} roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.8, 0]} castShadow>
              <boxGeometry args={[1.8, 0.08, 3.2]} />
              <meshStandardMaterial color={C.scarlet} />
            </mesh>
          </group>
        ))}
      </group>
    </HoverableGroup>
  );
}

// ── Building (generic boxy tycoon building) ──
function Building({ name, position, w, h, d, color, roofColor, accent, glass = true }) {
  return (
    <HoverableGroup name={name}>
      {({ hovered }) => (
        <group position={position}>
          {/* Body */}
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={color}
              roughness={0.7}
              emissive={hovered ? accent || C.scarlet : '#000000'}
              emissiveIntensity={hovered ? 0.25 : 0}
            />
          </mesh>
          {/* Roof — slightly larger overhang */}
          <mesh position={[0, h + 0.1, 0]} castShadow>
            <boxGeometry args={[w + 0.4, 0.25, d + 0.4]} />
            <meshStandardMaterial color={roofColor || C.roof} roughness={0.6} metalness={0.15} />
          </mesh>
          {/* Glass strip front */}
          {glass && (
            <mesh position={[0, h * 0.55, d / 2 + 0.01]}>
              <planeGeometry args={[w * 0.85, h * 0.4]} />
              <meshStandardMaterial color={C.glass} roughness={0.2} metalness={0.4}
                emissive={C.glassDark} emissiveIntensity={0.05} />
            </mesh>
          )}
          {/* Accent stripe */}
          {accent && (
            <mesh position={[0, 0.1, d / 2 + 0.011]}>
              <planeGeometry args={[w, 0.2]} />
              <meshStandardMaterial color={accent} />
            </mesh>
          )}
        </group>
      )}
    </HoverableGroup>
  );
}

// ── ParkingLot — instanced cars ──
function ParkingLot({ position, rows = 4, cols = 8, name = 'Parkplatz' }) {
  const meshRef = useRef();
  const count = rows * cols;

  const { matrices, colors } = useMemo(() => {
    const matrices = [], colors = [];
    const m = new THREE.Matrix4();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.18) continue;
        const x = (c - cols / 2 + 0.5) * 1.6;
        const z = (r - rows / 2 + 0.5) * 2.6;
        m.makeTranslation(x, 0.2, z);
        matrices.push(m.clone());
        colors.push(new THREE.Color(C.carColors[(Math.random() * C.carColors.length) | 0]));
      }
    }
    return { matrices, colors };
  }, [rows, cols]);

  return (
    <HoverableGroup name={name}>
      <group position={position}>
        {/* Asphalt pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[cols * 1.6 + 1.2, rows * 2.6 + 1.2]} />
          <meshStandardMaterial color="#3a3530" roughness={0.95} />
        </mesh>
        {/* Lane stripes */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
            position={[(i - cols / 2) * 1.6, 0.012, 0]}>
            <planeGeometry args={[0.06, rows * 2.6]} />
            <meshStandardMaterial color="#bbb59c" />
          </mesh>
        ))}
        {/* Cars */}
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, Math.max(1, matrices.length)]}
          castShadow
        >
          <boxGeometry args={[1.0, 0.4, 2.2]} />
          <meshStandardMaterial roughness={0.5} metalness={0.25} />
        </instancedMesh>
        {/* Side-effect: set matrices once the ref is attached */}
        <ParkingLotInit meshRef={meshRef} matrices={matrices} colors={colors} />
      </group>
    </HoverableGroup>
  );
}
function ParkingLotInit({ meshRef, matrices, colors }) {
  React.useEffect(() => {
    if (!meshRef.current) return;
    matrices.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    colors.forEach((c, i) => meshRef.current.setColorAt && meshRef.current.setColorAt(i, c));
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [meshRef, matrices, colors]);
  return null;
}

// ── Tree — simple low-poly cone-on-trunk ──
function Tree({ position, scale = 1, color }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.6, 6]} />
        <meshStandardMaterial color={C.treeTrunk} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.7, 1.6, 7]} />
        <meshStandardMaterial color={color || C.tree} roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.45, 0.9, 7]} />
        <meshStandardMaterial color={color || C.tree} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ── Trees (scattered, instanced for perf where possible) ──
function Trees({ positions }) {
  return (
    <group>
      {positions.map((p, i) => (
        <Tree key={i} position={p.pos} scale={p.s}
          color={i % 7 === 0 ? '#3f7838' : i % 5 === 0 ? '#5fa64e' : C.tree} />
      ))}
    </group>
  );
}

// ── FoodTrucks — colourful small boxes ──
function FoodTrucks({ position, count = 4 }) {
  const palette = ['#b7301b', '#d9b04a', '#3b6e3e', '#1f3d6b'];
  return (
    <group position={position}>
      {Array.from({ length: count }).map((_, i) => (
        <HoverableGroup key={i} name={`FoodTruck-${i + 1}`}>
          <group position={[i * 3.6 - count * 1.8, 0, 0]}>
            <mesh position={[0, 0.7, 0]} castShadow>
              <boxGeometry args={[3, 1.4, 1.5]} />
              <meshStandardMaterial color={palette[i % palette.length]} roughness={0.6} />
            </mesh>
            {/* Cab */}
            <mesh position={[-1.8, 0.5, 0]} castShadow>
              <boxGeometry args={[0.9, 1.0, 1.4]} />
              <meshStandardMaterial color="#1a1410" roughness={0.7} />
            </mesh>
            {/* Awning */}
            <mesh position={[0.3, 1.6, 0]} rotation={[0, 0, -0.2]} castShadow>
              <boxGeometry args={[2, 0.06, 1.8]} />
              <meshStandardMaterial color="#f4ede0" roughness={0.7} />
            </mesh>
            {/* Wheels */}
            {[-1.0, 1.0].map((x, w) => (
              <mesh key={w} position={[x, 0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.3, 10]} />
                <meshStandardMaterial color="#1a1410" />
              </mesh>
            ))}
          </group>
        </HoverableGroup>
      ))}
    </group>
  );
}

// ── Road — gray strip with center dashes ──
function Road({ from, to, width = 4 }) {
  const dx = to[0] - from[0], dz = to[2] - from[2];
  const len = Math.hypot(dx, dz);
  const cx = (from[0] + to[0]) / 2, cz = (from[2] + to[2]) / 2;
  const ang = Math.atan2(dx, dz);
  return (
    <group position={[cx, 0.005, cz]} rotation={[0, ang, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, len]} />
        <meshStandardMaterial color={C.road} roughness={0.95} />
      </mesh>
      {/* Dashed centerline */}
      {Array.from({ length: Math.floor(len / 3) }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.005, -len / 2 + i * 3 + 1.2]}>
          <planeGeometry args={[0.2, 1.2]} />
          <meshStandardMaterial color="#cbb98a" />
        </mesh>
      ))}
    </group>
  );
}

// ── TramStation — small platform + canopy + tram ──
function TramStation({ position }) {
  return (
    <HoverableGroup name="Tram-Station">
      <group position={position}>
        {/* Platform */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 0.6, 4]} />
          <meshStandardMaterial color={C.concrete} roughness={0.9} />
        </mesh>
        {/* Canopy */}
        <mesh position={[0, 3, 0]} castShadow>
          <boxGeometry args={[18, 0.2, 4.4]} />
          <meshStandardMaterial color={C.scarlet} roughness={0.55} metalness={0.2} />
        </mesh>
        {/* Canopy columns */}
        {[-6, -2, 2, 6].map((x, i) => (
          <mesh key={i} position={[x, 1.65, -1.7]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 2.7, 8]} />
            <meshStandardMaterial color="#1a1410" />
          </mesh>
        ))}
        {/* Tram car */}
        <mesh position={[0, 1.2, 2.6]} castShadow>
          <boxGeometry args={[15, 1.8, 2.4]} />
          <meshStandardMaterial color={C.glass} emissive={C.glassDark} emissiveIntensity={0.08}
            roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 2.05, 2.6]}>
          <boxGeometry args={[15.2, 0.2, 2.6]} />
          <meshStandardMaterial color={C.ink} />
        </mesh>
        {/* Rails */}
        {[2.0, 3.2].map((z, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, z]}>
            <planeGeometry args={[26, 0.1]} />
            <meshStandardMaterial color="#9c9180" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </HoverableGroup>
  );
}

// ── TrainingGrounds — 2 small pitches + a fitness grid ──
function TrainingGrounds({ position }) {
  return (
    <group position={position}>
      <HoverableGroup name="Training-Pitch-A">
        <group position={[-12, 0, 0]}>
          <Pitch width={18} depth={28} stripes={false} />
        </group>
      </HoverableGroup>
      <HoverableGroup name="Training-Pitch-B">
        <group position={[12, 0, 0]}>
          <Pitch width={18} depth={28} stripes={false} />
        </group>
      </HoverableGroup>
      {/* Fitness grid (small box markers) */}
      <HoverableGroup name="Fitness-Area">
        <group position={[0, 0, 20]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[14, 8]} />
            <meshStandardMaterial color="#c8baa0" roughness={0.95} />
          </mesh>
          {[[-4, -2], [-4, 2], [0, -2], [0, 2], [4, -2], [4, 2]].map((p, i) => (
            <mesh key={i} position={[p[0], 0.3, p[1]]} castShadow>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <meshStandardMaterial color={C.scarlet} roughness={0.6} />
            </mesh>
          ))}
        </group>
      </HoverableGroup>
    </group>
  );
}

// ── Decorative ground (large grass plane + paths) ──
function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={C.grass} roughness={1} />
      </mesh>
      {/* Slight color variations for visual interest */}
      {[[-40, -50, 18], [60, -60, 16], [70, 60, 22], [-70, 50, 20]].map(([x, z, r], i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.001, z]}>
          <circleGeometry args={[r, 24]} />
          <meshStandardMaterial color={i % 2 === 0 ? C.grassDark : C.grassLight} roughness={1} />
        </mesh>
      ))}
    </>
  );
}

// ── Scene root ──
function Scene() {
  // Pre-compute tree positions outside of render-loop
  const trees = useMemo(() => {
    const arr = [];
    // Ring of trees around the map
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const r = 110 + Math.random() * 20;
      arr.push({ pos: [Math.cos(a) * r, 0, Math.sin(a) * r], s: 1 + Math.random() * 0.6 });
    }
    // Random scatter
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      // Avoid the stadium central area + main plaza
      if (Math.hypot(x, z) < 55) continue;
      arr.push({ pos: [x, 0, z], s: 0.8 + Math.random() * 0.8 });
    }
    return arr;
  }, []);

  return (
    <>
      <Ground />

      {/* Central stadium */}
      <Stadium position={[0, 0, 0]} />

      {/* Training grounds — north of stadium */}
      <TrainingGrounds position={[0, 0, -65]} />

      {/* Youth Academy building (north-west) */}
      <Building name="Jugendakademie"
        position={[-45, 0, -65]} w={10} h={8} d={8}
        color={C.concrete} roofColor={C.scarlet} accent={C.scarlet} />

      {/* Clubhouse / HQ (east) */}
      <Building name="Klubhaus"
        position={[55, 0, 5]} w={14} h={11} d={12}
        color={C.concrete} roofColor={C.roof} accent={C.scarlet} />

      {/* Parking lot beside clubhouse */}
      <ParkingLot position={[55, 0, -20]} rows={4} cols={8} name="Klub-Parking" />

      {/* Merch megastore (south) */}
      <Building name="Fanshop"
        position={[-30, 0, 55]} w={16} h={6} d={10}
        color={C.scarlet} roofColor={C.roof} accent={'#f4ede0'} />

      {/* Ticket booth */}
      <Building name="Tickets"
        position={[-10, 0, 50]} w={5} h={4} d={5}
        color={C.ink} roofColor={C.scarlet} accent={C.scarlet} glass={false} />

      {/* Food trucks */}
      <FoodTrucks position={[15, 0, 55]} count={4} />

      {/* Transport hub — tram station (far south) */}
      <TramStation position={[0, 0, 80]} />

      {/* Large public parking (south-east, off-map access) */}
      <ParkingLot position={[55, 0, 55]} rows={5} cols={10} name="Besucher-Parking" />

      {/* Roads / paths */}
      <Road from={[0, 0, 32]} to={[0, 0, 75]} width={5} />
      <Road from={[-30, 0, 50]} to={[30, 0, 50]} width={3} />
      <Road from={[35, 0, 0]} to={[55, 0, 0]} width={4} />
      <Road from={[55, 0, 0]} to={[55, 0, 55]} width={3.5} />
      <Road from={[-20, 0, -50]} to={[20, 0, -50]} width={3} />
      <Road from={[-45, 0, -55]} to={[-45, 0, -75]} width={3} />

      {/* Decorative trees */}
      <Trees positions={trees} />
    </>
  );
}

// ── Main exported component ──
export default function FootballManagerMap() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true }}
      style={{ width: '100%', height: '100%', background: '#a9c9d6' }}
    >
      {/* Camera locked to tycoon angle */}
      <PerspectiveCamera makeDefault position={[80, 70, 80]} fov={28} near={1} far={500} />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <hemisphereLight args={['#fff2d6', '#3b6e3e', 0.55]} />
      <directionalLight
        position={[60, 100, 40]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-bias={-0.0005}
      />

      {/* Subtle environment for PBR reflections */}
      <Environment preset="city" />

      <Scene />

      <ContactShadows position={[0, 0.03, 0]} opacity={0.4} scale={300} blur={2.2} far={50} />

      {/* Restricted orbit — keep tycoon perspective */}
      <OrbitControls
        target={[0, 4, 0]}
        minDistance={40}
        maxDistance={220}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.42}
        enablePan={true}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}
