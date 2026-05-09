/**
 * HeroCanvas.tsx
 * Exact port of HeroScene.tsx from vexor-it-solutions.
 * Lazy-loaded by Hero.tsx via React.lazy() — never blocks first paint.
 */
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars, AdaptiveDpr } from '@react-three/drei';
import { TechOrb }       from './3d/TechOrb';
import { FloatingRings } from './3d/FloatingRings';
import { ParticleField } from './3d/ParticleField';
import { GridFloor }     from './3d/GridFloor';

interface HeroCanvasProps {
  mouseX?: number;
  mouseY?: number;
}

function SceneContent({ mouseX = 0, mouseY = 0 }: HeroCanvasProps) {
  return (
    <>
      {/* Lighting — exact from HeroScene.tsx */}
      <ambientLight intensity={0.2} />
      <pointLight position={[5,  5,  5]}  intensity={2}   color="#3B82F6" />
      <pointLight position={[-5, -3, -5]} intensity={1.5} color="#7C3AED" />
      <pointLight position={[0,  3, -3]}  intensity={1}   color="#06B6D4" />

      {/* Main orb */}
      <TechOrb position={[0, 0, 0]}  scale={1.2} speed={0.8} distort={0.5} color="#3B82F6" />

      {/* Orbiting orbs */}
      <TechOrb position={[2.5,  1,  -1]}  scale={0.3} speed={1.5} color="#7C3AED" />
      <TechOrb position={[-2, -0.5, 0.5]} scale={0.2} speed={2}   color="#06B6D4" />

      {/* Rings */}
      <FloatingRings />

      {/* Particles — react to mouse */}
      <ParticleField count={600} radius={5} mouse={{ x: mouseX, y: mouseY }} />

      {/* Background stars */}
      <Stars radius={100} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />

      {/* Grid floor */}
      <GridFloor />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Auto-quality */}
      <AdaptiveDpr pixelated />
    </>
  );
}

export default function HeroCanvas({ mouseX = 0, mouseY = 0 }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: 4,        // ACESFilmicToneMapping
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
