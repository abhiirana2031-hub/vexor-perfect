"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Props { mouseX?: number; mouseY?: number; isMobile?: boolean; }

export default function HeroCanvas({ mouseX = 0, mouseY = 0, isMobile = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!containerRef.current) return;
    console.log('[3D] Initializing Studio Namma Hero Canvas');

    // ── Setup ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    containerRef.current.appendChild(renderer.domElement);

    // ── Lights ───────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    // Strong rim light from top right
    const rimLight = new THREE.PointLight(0x3B82F6, 120);
    rimLight.position.set(10, 10, 10);
    scene.add(rimLight);

    // Deep purple secondary light
    const purpleLight = new THREE.PointLight(0x7C3AED, 100);
    purpleLight.position.set(-10, -5, 5);
    scene.add(purpleLight);

    // Front soft light for depth
    const frontLight = new THREE.PointLight(0xffffff, 40);
    frontLight.position.set(0, 0, 15);
    scene.add(frontLight);

    // ── Main Glossy Orb ──────────────────────────────────────────────────
    const geometry = new THREE.SphereGeometry(3.5, 128, 128);
    const material = new THREE.MeshPhysicalMaterial({ 
      color: 0x050505,
      metalness: 0.9, 
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1,
    });
    const orb = new THREE.Mesh(geometry, material);
    orb.position.set(window.innerWidth > 768 ? 4 : 0, 0, 0);
    scene.add(orb);

    // ── Particle Field ────────────────────────────────────────────────────
    const starCount = isMobile ? 500 : 1500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ 
      size: 0.03, 
      color: 0xffffff, 
      transparent: true, 
      opacity: 0.4,
      blending: THREE.AdditiveBlending 
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ── Animation ─────────────────────────────────────────────────────────
    let frameId: number;
    let targetX = 0;
    let targetY = 0;

    const animate = () => {
      const time = Date.now() * 0.001;
      
      // Smooth mouse lerping
      targetX += (mouseRef.current.x - targetX) * 0.05;
      targetY += (mouseRef.current.y - targetY) * 0.05;

      orb.rotation.y = time * 0.1;
      orb.rotation.z = Math.sin(time * 0.2) * 0.1;
      
      // Parallax movement
      orb.position.x = (window.innerWidth > 768 ? 4 : 0) + targetX * 1.2;
      orb.position.y = targetY * 1.2 + Math.sin(time * 0.4) * 0.2;
      
      stars.rotation.y += 0.0004;
      stars.position.x = targetX * 0.5;
      stars.position.y = targetY * 0.5;
      
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      orb.position.x = width > 768 ? 4 : 0;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      console.log('[3D] Cleaning up Hero Canvas');
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 pointer-events-none z-0" />;
}
