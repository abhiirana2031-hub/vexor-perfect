"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Torus } from "@react-three/drei";
import * as THREE from "three";
interface RingProps {
  radius: number;
  tube: number;
  rotation: [number, number, number];
  speed: number;
  color: string;
  opacity?: number;
}
function Ring({ radius, tube, rotation, speed, color, opacity = 0.6 }: RingProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = rotation[0] + t * speed * 0.5;
    ref.current.rotation.y = rotation[1] + t * speed;
    ref.current.rotation.z = rotation[2] + t * speed * 0.3;
  });
  return (
    <Torus ref={ref} args={[radius, tube, 16, 100]}>
      <meshStandardMaterial
        color={color}
        wireframe={false}
        transparent
        opacity={opacity}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.9}
      />
    </Torus>
  );
}
export function FloatingRings() {
  return (
    <group>
      <Ring
        radius={2.2}
        tube={0.015}
        rotation={[0.3, 0, 0]}
        speed={0.3}
        color="#3B82F6"
        opacity={0.7}
      />
      <Ring
        radius={2.8}
        tube={0.01}
        rotation={[1.1, 0.4, 0]}
        speed={-0.2}
        color="#7C3AED"
        opacity={0.5}
      />
      <Ring
        radius={3.5}
        tube={0.008}
        rotation={[0.6, 1.2, 0.5]}
        speed={0.15}
        color="#06B6D4"
        opacity={0.3}
      />
    </group>
  );
}
