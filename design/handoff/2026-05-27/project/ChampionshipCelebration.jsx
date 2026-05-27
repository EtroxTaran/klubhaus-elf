/**
 * ChampionshipCelebration.jsx
 * --------------------------------------------------------------
 * A symbolic, stylized 3D trophy-celebration scene built with
 * React Three Fiber + drei. Everything is rendered from Three.js
 * primitives — no GLTF, no external textures.
 *
 * Public API (props on <ChampionshipCelebration />):
 *   primaryColor   : hex string  — main jersey/team colour
 *   secondaryColor : hex string  — accent (shorts / stripes)
 *   jerseyStyle    : 'solid' | 'stripes' | 'hoops'
 *   fanColor       : hex string  — base tint for the crowd / sky
 *   isCelebrating  : boolean     — pauses or plays all motion
 *
 * Drop into a Vite + R3F project:
 *   import ChampionshipCelebration from './ChampionshipCelebration';
 *   <Canvas><ChampionshipCelebration primaryColor="#E10F1A" ... /></Canvas>
 * --------------------------------------------------------------
 */

const { useRef, useMemo, useEffect, useState, Suspense } = React;
const { Canvas, useFrame, useThree } = window.ReactThreeFiber;
const { OrbitControls, Environment, ContactShadows, Float } = window.Drei;

/* ------------------------------------------------------------------ */
/* 1. Procedural jersey texture                                        */
/* ------------------------------------------------------------------ */
function useJerseyTexture(primaryColor, secondaryColor, jerseyStyle) {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // base
    ctx.fillStyle = primaryColor;
    ctx.fillRect(0, 0, size, size);

    if (jerseyStyle === 'stripes') {
      ctx.fillStyle = secondaryColor;
      const stripeW = size / 8;
      for (let i = 0; i < 8; i += 2) {
        ctx.fillRect(i * stripeW, 0, stripeW, size);
      }
    } else if (jerseyStyle === 'hoops') {
      ctx.fillStyle = secondaryColor;
      const hoopH = size / 6;
      for (let i = 0; i < 6; i += 2) {
        ctx.fillRect(0, i * hoopH, size, hoopH);
      }
    }
    // collar accent (always present)
    ctx.fillStyle = secondaryColor;
    ctx.fillRect(0, 0, size, size * 0.08);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [primaryColor, secondaryColor, jerseyStyle]);
}

/* ------------------------------------------------------------------ */
/* 2. Player                                                           */
/* ------------------------------------------------------------------ */
function Player({
  position,
  phase = 0,
  isCentral = false,
  jerseyTexture,
  secondaryColor,
  skinColor = '#d8a878',
  isCelebrating,
}) {
  const groupRef = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const trophyRef = useRef();

  useFrame(({ clock }) => {
    if (!isCelebrating || !groupRef.current) return;
    const t = clock.getElapsedTime();

    // Body bounce – offset by phase so it isn't synchronised
    const bounce = Math.abs(Math.sin(t * 3 + phase)) * (isCentral ? 0.18 : 0.32);
    groupRef.current.position.y = position[1] + bounce;

    // Slight rotational sway
    groupRef.current.rotation.y =
      Math.sin(t * 1.5 + phase) * (isCentral ? 0.05 : 0.18);

    // Arm flailing – central player lifts trophy steadily, others wave
    if (isCentral) {
      if (leftArm.current) leftArm.current.rotation.z = 2.6;
      if (rightArm.current) rightArm.current.rotation.z = -2.6;
      if (trophyRef.current) {
        trophyRef.current.position.y = 1.55 + Math.sin(t * 2 + phase) * 0.05;
        trophyRef.current.rotation.y = t * 0.6;
      }
    } else {
      if (leftArm.current)
        leftArm.current.rotation.z = 1.6 + Math.sin(t * 4 + phase) * 1.0;
      if (rightArm.current)
        rightArm.current.rotation.z = -1.6 - Math.sin(t * 4 + phase + 1) * 1.0;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torso */}
      <mesh castShadow position={[0, 0.55, 0]}>
        <capsuleGeometry args={[0.28, 0.55, 6, 12]} />
        <meshStandardMaterial
          map={jerseyTexture}
          roughness={0.55}
          metalness={0.05}
        />
      </mesh>

      {/* Shorts */}
      <mesh castShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.28, 0.24, 0.32, 16]} />
        <meshStandardMaterial color={secondaryColor} roughness={0.7} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[-0.12, -0.32, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.45, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.85} />
      </mesh>
      <mesh castShadow position={[0.12, -0.32, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.45, 10]} />
        <meshStandardMaterial color={skinColor} roughness={0.85} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshStandardMaterial color={skinColor} roughness={0.8} />
      </mesh>

      {/* Arms – pivot from shoulder */}
      <group ref={leftArm} position={[-0.32, 0.78, 0]}>
        <mesh castShadow position={[-0.22, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.32, 0.78, 0]}>
        <mesh castShadow position={[0.22, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.42, 4, 8]} />
          <meshStandardMaterial color={skinColor} roughness={0.85} />
        </mesh>
      </group>

      {/* Trophy held by central player */}
      {isCentral && (
        <group ref={trophyRef} position={[0, 1.55, 0]}>
          <Trophy />
        </group>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Trophy                                                           */
/* ------------------------------------------------------------------ */
function Trophy() {
  // Lathe profile — half-silhouette rotated around Y to make a cup
  const points = useMemo(() => {
    const pts = [];
    pts.push(new THREE.Vector2(0.0, 0.0));
    pts.push(new THREE.Vector2(0.18, 0.0));
    pts.push(new THREE.Vector2(0.20, 0.06));
    pts.push(new THREE.Vector2(0.08, 0.12));
    pts.push(new THREE.Vector2(0.08, 0.30));
    pts.push(new THREE.Vector2(0.22, 0.42));
    pts.push(new THREE.Vector2(0.30, 0.60));
    pts.push(new THREE.Vector2(0.34, 0.82));
    pts.push(new THREE.Vector2(0.32, 0.95));
    pts.push(new THREE.Vector2(0.28, 1.00));
    return pts;
  }, []);

  return (
    <group>
      {/* Cup body */}
      <mesh castShadow>
        <latheGeometry args={[points, 24]} />
        <meshStandardMaterial
          color="#ffd56b"
          metalness={1}
          roughness={0.18}
          emissive="#3a2a00"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* Handles */}
      <mesh castShadow position={[0.34, 0.7, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.14, 0.035, 10, 18, Math.PI]} />
        <meshStandardMaterial color="#ffd56b" metalness={1} roughness={0.2} />
      </mesh>
      <mesh
        castShadow
        position={[-0.34, 0.7, 0]}
        rotation={[0, Math.PI, 0]}
      >
        <torusGeometry args={[0.14, 0.035, 10, 18, Math.PI]} />
        <meshStandardMaterial color="#ffd56b" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Podium                                                           */
/* ------------------------------------------------------------------ */
function Podium() {
  // tier: [radius, height, y, color]
  const tiers = [
    { r: 1.4, h: 0.6, y: 0.3, color: '#c9a14a' }, // 1st (center, tallest)
    { r: 1.1, h: 0.45, y: 0.225, color: '#c0c0c0' }, // 2nd
    { r: 1.0, h: 0.32, y: 0.16, color: '#b87333' }, // 3rd
  ];
  return (
    <group>
      {/* Center tier */}
      <mesh receiveShadow castShadow position={[0, tiers[0].y, 0]}>
        <cylinderGeometry args={[tiers[0].r, tiers[0].r, tiers[0].h, 32]} />
        <meshStandardMaterial color="#1b1f2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[0, tiers[0].h + 0.005, 0]}>
        <cylinderGeometry args={[tiers[0].r, tiers[0].r, 0.04, 32]} />
        <meshStandardMaterial
          color={tiers[0].color}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* 2nd-place tier (left) */}
      <mesh receiveShadow castShadow position={[-2.2, tiers[1].y, 0]}>
        <cylinderGeometry args={[tiers[1].r, tiers[1].r, tiers[1].h, 32]} />
        <meshStandardMaterial color="#1b1f2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[-2.2, tiers[1].h + 0.005, 0]}>
        <cylinderGeometry args={[tiers[1].r, tiers[1].r, 0.04, 32]} />
        <meshStandardMaterial
          color={tiers[1].color}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* 3rd-place tier (right) */}
      <mesh receiveShadow castShadow position={[2.2, tiers[2].y, 0]}>
        <cylinderGeometry args={[tiers[2].r, tiers[2].r, tiers[2].h, 32]} />
        <meshStandardMaterial color="#1b1f2a" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh position={[2.2, tiers[2].h + 0.005, 0]}>
        <cylinderGeometry args={[tiers[2].r, tiers[2].r, 0.04, 32]} />
        <meshStandardMaterial
          color={tiers[2].color}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      {/* Numeric plaques */}
      {[
        { p: [0, 0.32, 1.41], n: '1' },
        { p: [-2.2, 0.24, 1.11], n: '2' },
        { p: [2.2, 0.18, 1.01], n: '3' },
      ].map((t, i) => (
        <mesh key={i} position={t.p}>
          <planeGeometry args={[0.35, 0.35]} />
          <meshStandardMaterial color="#0c0e14" roughness={0.7} />
        </mesh>
      ))}

      {/* Stage floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[8, 48]} />
        <meshStandardMaterial color="#0a0c12" roughness={0.85} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Confetti                                                         */
/* ------------------------------------------------------------------ */
function Confetti({ count = 320, palette, isCelebrating }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    const paletteColors = palette.map((c) => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 12,
        y: 4 + Math.random() * 6,
        z: (Math.random() - 0.5) * 6,
        vy: 0.02 + Math.random() * 0.04,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        wobble: Math.random() * Math.PI * 2,
        color: paletteColors[i % paletteColors.length],
        scale: 0.5 + Math.random() * 0.7,
      });
    }
    return arr;
  }, [count, palette]);

  // Apply colours once per palette change
  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    particles.forEach((p, i) => {
      color.copy(p.color);
      meshRef.current.setColorAt(i, color);
    });
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame(({ clock }) => {
    if (!meshRef.current || !isCelebrating) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      p.y -= p.vy;
      if (p.y < 0.05) p.y = 5 + Math.random() * 3;
      p.rx += 0.02;
      p.rz += 0.03;
      const wx = Math.sin(t * 2 + p.wobble) * 0.35;
      dummy.position.set(p.x + wx, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.scale.setScalar(p.scale * 0.08);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, count]}
      castShadow={false}
    >
      <boxGeometry args={[1, 1, 0.18]} />
      <meshStandardMaterial
        roughness={0.4}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Crowd                                                            */
/* ------------------------------------------------------------------ */
function Crowd({ count = 600, fanColor, isCelebrating }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seats = useMemo(() => {
    const arr = [];
    const base = new THREE.Color(fanColor);
    for (let i = 0; i < count; i++) {
      // Arrange on a semi-cylindrical wall behind & to the sides
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 1.15;
      const radius = 8 + Math.random() * 2.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.3 + Math.random() * 4.2;

      // jitter colour around fanColor with occasional accent
      const c = base.clone();
      const hsl = { h: 0, s: 0, l: 0 };
      c.getHSL(hsl);
      hsl.h = (hsl.h + (Math.random() - 0.5) * 0.06 + 1) % 1;
      hsl.l = Math.min(0.95, Math.max(0.15, hsl.l + (Math.random() - 0.5) * 0.3));
      c.setHSL(hsl.h, hsl.s, hsl.l);
      // sprinkle bright accents
      if (Math.random() < 0.04) c.setHSL(Math.random(), 0.9, 0.6);

      arr.push({
        x, y, z,
        baseY: y,
        phase: Math.random() * Math.PI * 2,
        color: c,
        scale: 0.18 + Math.random() * 0.12,
      });
    }
    return arr;
  }, [count, fanColor]);

  useEffect(() => {
    if (!meshRef.current) return;
    const color = new THREE.Color();
    seats.forEach((s, i) => {
      color.copy(s.color);
      meshRef.current.setColorAt(i, color);
    });
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [seats]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    seats.forEach((s, i) => {
      const bob = isCelebrating ? Math.sin(t * 4 + s.phase) * 0.15 : 0;
      dummy.position.set(s.x, s.baseY + bob, s.z);
      dummy.rotation.set(0, Math.atan2(-s.x, -s.z), 0);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[1, 1.4, 1]} />
      <meshStandardMaterial roughness={0.8} />
    </instancedMesh>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Flash lights — procedural camera-flash spheres                   */
/* ------------------------------------------------------------------ */
function CameraFlashes({ count = 40 }) {
  const ref = useRef();
  const flashes = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 1.1;
      const radius = 7 + Math.random() * 3;
      arr.push({
        x: Math.cos(angle) * radius,
        y: 0.8 + Math.random() * 4,
        z: Math.sin(angle) * radius,
        next: Math.random() * 2,
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((m, i) => {
      const f = flashes[i];
      const phase = (t * 1.7 + f.next * 5) % 4;
      const intensity = phase < 0.12 ? 1 - phase / 0.12 : 0;
      m.material.opacity = intensity;
      m.scale.setScalar(0.04 + intensity * 0.18);
    });
  });

  return (
    <group ref={ref}>
      {flashes.map((f, i) => (
        <mesh key={i} position={[f.x, f.y, f.z]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Scene                                                            */
/* ------------------------------------------------------------------ */
function CelebrationScene({
  primaryColor,
  secondaryColor,
  jerseyStyle,
  fanColor,
  isCelebrating,
}) {
  const jerseyTexture = useJerseyTexture(primaryColor, secondaryColor, jerseyStyle);

  // Clean up the canvas texture when colors / style change
  useEffect(() => {
    return () => {
      if (jerseyTexture) jerseyTexture.dispose();
    };
  }, [jerseyTexture]);

  const confettiPalette = useMemo(
    () => [primaryColor, secondaryColor, '#ffd56b', '#ffffff', '#ff6b6b', '#66d2ff'],
    [primaryColor, secondaryColor]
  );

  // Player layout: central + 6 around, on/around podium
  const players = [
    { pos: [0, 0.65, 0], central: true, phase: 0, skin: '#d8a878' },
    { pos: [-2.2, 0.5, 0], phase: 0.7, skin: '#a07050' },
    { pos: [2.2, 0.38, 0], phase: 1.4, skin: '#e9c39a' },
    { pos: [-0.95, 0.0, 1.05], phase: 2.1, skin: '#7a5238' },
    { pos: [0.95, 0.0, 1.05], phase: 2.8, skin: '#c98e6b' },
    { pos: [-1.7, 0.0, -0.9], phase: 3.5, skin: '#5e3d28' },
    { pos: [1.7, 0.0, -0.9], phase: 4.2, skin: '#bf9472' },
  ];

  return (
    <>
      <color attach="background" args={[new THREE.Color(fanColor).multiplyScalar(0.18).getStyle()]} />
      <fog attach="fog" args={[new THREE.Color(fanColor).multiplyScalar(0.15).getStyle(), 14, 28]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight
        position={[0, 9, 4]}
        angle={0.5}
        penumbra={0.6}
        intensity={2.2}
        color="#fff4d6"
        castShadow
      />
      <pointLight position={[-6, 4, -4]} intensity={0.6} color={primaryColor} />
      <pointLight position={[6, 4, -4]} intensity={0.6} color={secondaryColor} />

      <Podium />

      {players.map((p, i) => (
        <Player
          key={i}
          position={p.pos}
          phase={p.phase}
          isCentral={p.central}
          jerseyTexture={jerseyTexture}
          secondaryColor={secondaryColor}
          skinColor={p.skin}
          isCelebrating={isCelebrating}
        />
      ))}

      <Crowd fanColor={fanColor} isCelebrating={isCelebrating} />
      <CameraFlashes />
      <Confetti palette={confettiPalette} isCelebrating={isCelebrating} />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={14}
        blur={2.4}
        far={6}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 9. Public component                                                 */
/* ------------------------------------------------------------------ */
function ChampionshipCelebration({
  primaryColor = '#E10F1A',
  secondaryColor = '#FFFFFF',
  jerseyStyle = 'solid',
  fanColor = '#3a2a8a',
  isCelebrating = true,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2.2, 7.2], fov: 42 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <CelebrationScene
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          jerseyStyle={jerseyStyle}
          fanColor={fanColor}
          isCelebrating={isCelebrating}
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.2, 0]}
      />
    </Canvas>
  );
}

window.ChampionshipCelebration = ChampionshipCelebration;
