"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
export function GridFloor() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.z = (t * 0.3) % 1;
  });
  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1F2937"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#374151"
        fadeDistance={18}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />
    </group>
  );
}
