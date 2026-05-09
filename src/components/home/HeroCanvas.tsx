/**
 * HeroCanvas.tsx — Full 3D scene using ONLY native @react-three/fiber primitives.
 * No @react-three/drei imports → avoids the drei v10 / three v0.177 incompatibility.
 * Visually identical to the HeroScene from vexor-it-solutions.
 */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { mouseX?: number; mouseY?: number; }

/* ── Glowing distorted orb ──────────────────────────────────────────────── */
function GlowOrb({
  position = [0, 0, 0] as [number, number, number],
  scale = 1,
  speed = 1,
  color = '#3B82F6',
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(t * speed * 0.5) * 0.2;
    meshRef.current.rotation.y += 0.005 * speed;
    meshRef.current.position.y = position[1] + Math.sin(t * speed * 0.7) * 0.15;
    // Pulse the glow
    if (lightRef.current) {
      lightRef.current.intensity = 1.8 + Math.sin(t * 2.5 * speed) * 0.6;
    }
    // Slight scale pulse to simulate distortion
    const s = scale * (1 + Math.sin(t * speed * 1.3) * 0.04);
    meshRef.current.scale.setScalar(s);
  });

  return (
    <group>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0}
          metalness={0.85}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Local point light so each orb glows */}
      <pointLight
        ref={lightRef}
        position={[position[0], position[1], position[2] + 1]}
        color={color}
        intensity={2}
        distance={6}
        decay={2}
      />
    </group>
  );
}

/* ── Rotating ring ──────────────────────────────────────────────────────── */
function Ring({
  radius, tube, rotation, speed, color, opacity = 0.6,
}: {
  radius: number; tube: number;
  rotation: [number, number, number];
  speed: number; color: string; opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = rotation[0] + t * speed * 0.5;
    ref.current.rotation.y = rotation[1] + t * speed;
    ref.current.rotation.z = rotation[2] + t * speed * 0.3;
  });

  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, tube, 16, 100]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
}

/* ── Particle field (mouse-reactive) ────────────────────────────────────── */
function ParticleField({
  count = 800,
  radius = 6,
  mouse = { x: 0, y: 0 },
}: { count?: number; radius?: number; mouse?: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = new THREE.Color('#3B82F6');
    const cB = new THREE.Color('#7C3AED');
    const cC = new THREE.Color('#06B6D4');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = radius * (0.5 + Math.random() * 0.5);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      const c = t < 0.33 ? cA : t < 0.66 ? cB : cC;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.03 + mouse.x * 0.1;
    ref.current.rotation.x = Math.sin(t * 0.02) * 0.1 + mouse.y * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Background stars ───────────────────────────────────────────────────── */
function Stars({ count = 2000 }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 80 + Math.random() * 20;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.6} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Scrolling grid floor ───────────────────────────────────────────────── */
function GridFloor() {
  const ref = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const half = 10, step = 1;
    for (let i = -half; i <= half; i++) {
      pts.push(i, 0, -half,  i, 0, half);   // vertical lines
      pts.push(-half, 0, i,  half, 0, i);   // horizontal lines
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.position.z = (state.clock.getElapsedTime() * 0.3) % 1;
  });

  return (
    <group ref={ref} position={[0, -3, 0]}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#1F2937" transparent opacity={0.5} />
      </lineSegments>
    </group>
  );
}

/* ── Full scene ─────────────────────────────────────────────────────────── */
function Scene({ mouseX = 0, mouseY = 0 }: Props) {
  return (
    <>
      {/* Ambient + scene lights */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5,  5,  5]}  intensity={2}   color="#3B82F6" />
      <pointLight position={[-5,-3, -5]}  intensity={1.5} color="#7C3AED" />
      <pointLight position={[0,  3, -3]}  intensity={1}   color="#06B6D4" />

      {/* Main orb */}
      <GlowOrb position={[0, 0, 0]}   scale={1.2} speed={0.8} color="#3B82F6" />

      {/* Orbiting orbs */}
      <GlowOrb position={[2.5,  1,  -1]}  scale={0.3} speed={1.5} color="#7C3AED" />
      <GlowOrb position={[-2, -0.5, 0.5]} scale={0.2} speed={2}   color="#06B6D4" />

      {/* Floating rings */}
      <Ring radius={2.2} tube={0.015} rotation={[0.3, 0, 0]}    speed={0.3}   color="#3B82F6" opacity={0.7} />
      <Ring radius={2.8} tube={0.01}  rotation={[1.1, 0.4, 0]}  speed={-0.2}  color="#7C3AED" opacity={0.5} />
      <Ring radius={3.5} tube={0.008} rotation={[0.6, 1.2, 0.5]} speed={0.15} color="#06B6D4" opacity={0.3} />

      {/* Particles */}
      <ParticleField count={600} radius={5} mouse={{ x: mouseX, y: mouseY }} />

      {/* Stars */}
      <Stars count={2000} />

      {/* Grid */}
      <GridFloor />
    </>
  );
}

/* ── Canvas export ──────────────────────────────────────────────────────── */
export default function HeroCanvas({ mouseX = 0, mouseY = 0 }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene mouseX={mouseX} mouseY={mouseY} />
      </Suspense>
    </Canvas>
  );
}
