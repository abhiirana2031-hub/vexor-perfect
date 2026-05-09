/**
 * HeroCanvas.tsx — Dark reflective sphere + orbital rings + stars.
 * Matches the vexor-it-solutions aesthetic shown in reference image.
 * Pure @react-three/fiber (no drei) — compatible with three v0.177.
 */
import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { mouseX?: number; mouseY?: number; isMobile?: boolean; }

/* ── Dark reflective main sphere ────────────────────────────────────────── */
function MainOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y += 0.002;
    meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.05;
    meshRef.current.position.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <mesh ref={meshRef} position={[1.2, 0.2, 0]} scale={2.2}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        color="#060818"
        metalness={1}
        roughness={0.04}
        envMapIntensity={1}
      />
    </mesh>
  );
}

/* ── Small satellite orb ─────────────────────────────────────────────────── */
function SatelliteOrb() {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current || !meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Orbit around main orb
    const angle = t * 0.35;
    ref.current.position.x = 1.2 + Math.cos(angle) * 3.8;
    ref.current.position.y = Math.sin(angle * 0.5) * 1.2;
    ref.current.position.z = Math.sin(angle) * 2.2;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} scale={0.55}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#1a0b2e"
          metalness={0.95}
          roughness={0.1}
          emissive="#7C3AED"
          emissiveIntensity={0.25}
        />
      </mesh>
      <pointLight color="#7C3AED" intensity={1.5} distance={4} decay={2} />
    </group>
  );
}

/* ── Orbital ring ─────────────────────────────────────────────────────────── */
function OrbitalRing({
  radius, tube, tilt, speed, color, opacity = 0.7,
}: {
  radius: number; tube: number; tilt: [number, number, number];
  speed: number; color: string; opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = tilt[0] + t * speed * 0.3;
    ref.current.rotation.y = tilt[1] + t * speed;
    ref.current.rotation.z = tilt[2] + t * speed * 0.15;
  });

  return (
    <mesh ref={ref} position={[1.2, 0.2, 0]}>
      <torusGeometry args={[radius, tube, 12, 180]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        transparent
        opacity={opacity}
        roughness={0.1}
        metalness={0.9}
      />
    </mesh>
  );
}

/* ── Star field ──────────────────────────────────────────────────────────── */
function Stars({ count = 2500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 60 + Math.random() * 40;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Mouse-reactive particle dust ───────────────────────────────────────── */
function Dust({ count = 300, mouse = { x: 0, y: 0 } }: { count?: number; mouse?: { x: number; y: number } }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.015 + mouse.x * 0.08;
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.05 + mouse.y * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#3B82F6" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ── Full scene ──────────────────────────────────────────────────────────── */
function Scene({ mouseX = 0, mouseY = 0, isMobile = false }: Props) {
  const stars   = isMobile ? 1200 : 2500;
  const dust    = isMobile ? 120  : 300;
  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={0.15} />

      {/* Key lights */}
      <pointLight position={[-4, 6, 4]}  intensity={4}   color="#3B82F6" />
      <pointLight position={[6,  -2, 2]} intensity={2.5} color="#7C3AED" />
      <pointLight position={[0,  4, -4]} intensity={2}   color="#06B6D4" />
      <pointLight position={[3,  2, 5]}  intensity={1.5} color="#ffffff" />

      {/* Main dark reflective sphere */}
      <MainOrb />

      {/* Satellite */}
      <SatelliteOrb />

      {/* Orbital rings */}
      <OrbitalRing radius={3.6} tube={0.018} tilt={[1.25, 0,    0.15]} speed={0.12}  color="#3B82F6" opacity={0.75} />
      <OrbitalRing radius={4.4} tube={0.012} tilt={[0.35, 0.55, 0]}    speed={-0.08} color="#06B6D4" opacity={0.55} />
      <OrbitalRing radius={5.2} tube={0.008} tilt={[0.7,  1.3,  0.5]}  speed={0.06}  color="#22d3ee" opacity={0.35} />

      {/* Stars — halved on mobile */}
      <Stars count={stars} />

      {/* Dust particles — halved on mobile */}
      <Dust count={dust} mouse={{ x: mouseX, y: mouseY }} />
    </>
  );
}

/* ── Canvas export ───────────────────────────────────────────────────────── */
export default function HeroCanvas({ mouseX = 0, mouseY = 0, isMobile = false }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1, 7], fov: 58 }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? 'default' : 'high-performance' }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <Scene mouseX={mouseX} mouseY={mouseY} isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
