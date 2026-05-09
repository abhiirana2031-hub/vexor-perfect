import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface TechOrbProps {
  position?: [number, number, number];
  scale?: number;
  speed?: number;
  distort?: number;
  color?: string;
}

export function TechOrb({
  position = [0, 0, 0],
  scale = 1,
  speed = 1,
  distort = 0.4,
  color = '#00d9ff',
}: TechOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * speed * 0.5) * 0.2;
    meshRef.current.rotation.y += 0.005 * speed;
    meshRef.current.position.y = position[1] + Math.sin(time * speed * 0.7) * 0.15;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distort}
        speed={speed * 2}
        roughness={0}
        metalness={0.8}
        transparent
        opacity={0.85}
        envMapIntensity={1}
      />
    </Sphere>
  );
}
