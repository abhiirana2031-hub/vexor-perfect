/**
 * HeroCanvas.tsx — Lazy-loaded 3D scene.
 * Exact same animation as vexor-it-solutions, ported for Astro/React.
 * Loaded via React.lazy() in Hero.tsx so it never blocks initial render.
 */
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars, AdaptiveDpr, OrbitControls } from '@react-three/drei';
import { TechOrb }       from './3d/TechOrb';
import { FloatingRings } from './3d/FloatingRings';
import { ParticleField } from './3d/ParticleField';
import { GridFloor }     from './3d/GridFloor';

interface Props { mouseX?: number; mouseY?: number; }

function SceneContent({ mouseX = 0, mouseY = 0 }: Props) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5,  5,  5]}  intensity={2}   color="#00d9ff" />
      <pointLight position={[-5,-3, -5]}  intensity={1.5} color="#7C3AED" />
      <pointLight position={[0,  3, -3]}  intensity={1}   color="#06B6D4" />

      {/* Main distorted orb */}
      <TechOrb position={[0, 0, 0]}   scale={1.2} speed={0.8} distort={0.5} color="#00d9ff" />

      {/* Smaller orbiting orbs */}
      <TechOrb position={[2.5, 1, -1]}    scale={0.3} speed={1.5} color="#7C3AED" />
      <TechOrb position={[-2, -0.5, 0.5]} scale={0.2} speed={2}   color="#06B6D4" />

      {/* Rotating rings */}
      <FloatingRings />

      {/* Particle field — reacts to mouse */}
      <ParticleField count={600} radius={5} mouse={{ x: mouseX, y: mouseY }} />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* Moving grid floor */}
      <GridFloor />

      {/* Environment reflections */}
      <Environment preset="night" />

      {/* Auto-quality DPR */}
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function HeroCanvas({ mouseX = 0, mouseY = 0 }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: 4,       // ACESFilmicToneMapping
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <SceneContent mouseX={mouseX} mouseY={mouseY} />
      </Suspense>
    </Canvas>
  );
}
