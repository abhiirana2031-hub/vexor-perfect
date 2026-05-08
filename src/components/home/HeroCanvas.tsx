/**
 * HeroCanvas.tsx
 * This file is LAZY-LOADED by Hero.tsx via React.lazy().
 * All Three.js / react-three-fiber imports live here so they never
 * block the initial render and any failure is caught by ThreeBoundary.
 */
import React, { useRef } from 'react';
import { Sparkles as LucideSparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── Single Ring Layer ────────────────────────────────────────────────────────
const CoreLayer = ({
  position,
  rotationSpeed,
  color,
  label,
  index,
}: {
  position: [number, number, number];
  rotationSpeed: number;
  color: string;
  label: string;
  index: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 32]} />
        <meshStandardMaterial
          color="#0a0a0f"
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
        {/* Glow ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.55, 2.6, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </mesh>

      {/* HTML label */}
      <Html position={[2.8, 0, 0]} center distanceFactor={10}>
        <div className="whitespace-nowrap px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
            {label}
          </p>
        </div>
      </Html>
    </group>
  );
};

// ── Full Core Group ──────────────────────────────────────────────────────────
const FuturisticCore = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const layers = [
    { label: 'AI INTEGRATION', color: '#00d9ff', speed: 0.01 },
    { label: 'WEB SOLUTIONS', color: '#00d9ff', speed: -0.015 },
    { label: 'CLOUD ARCH', color: '#00d9ff', speed: 0.012 },
    { label: 'DIGITAL EXP', color: '#00d9ff', speed: -0.008 },
  ];

  return (
    <group ref={groupRef} scale={1.2}>
      <pointLight position={[0, 0, 0]} color="#00d9ff" intensity={2} distance={10} />

      {/* Top Cap */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.6, 32]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
        <Html position={[0, 0.4, 0]} center>
          <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-400/30 rounded-xl flex items-center justify-center">
            <LucideSparkles className="w-6 h-6 text-cyan-400" />
          </div>
        </Html>
      </mesh>

      {/* Layers */}
      {layers.map((layer, i) => (
        <CoreLayer
          key={i}
          index={i}
          position={[0, 1 - i * 0.7, 0]}
          rotationSpeed={layer.speed}
          color={layer.color}
          label={layer.label}
        />
      ))}

      {/* Base */}
      <mesh position={[0, -1.8, 0]}>
        <cylinderGeometry args={[3, 3.5, 0.8, 32]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
      </mesh>

      {/* Floor glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial
          color="#00d9ff"
          transparent
          opacity={0.05}
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
};

// ── Default Export: The Canvas ────────────────────────────────────────────────
export default function HeroCanvas() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <FuturisticCore />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[-5, 2, -5]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#00d9ff" transparent opacity={0.08} />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
