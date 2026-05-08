import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Rocket, Shield, Activity, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, PerspectiveCamera, OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// --- 3D Components ---

const CoreLayer = ({ position, rotationSpeed, color, label, index }: { position: [number, number, number], rotationSpeed: number, color: string, label: string, index: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
    }
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
        {/* Glow Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[2.55, 2.6, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </mesh>
      
      {/* Label on the layer */}
      <Html position={[2.8, 0, 0]} center distanceFactor={10}>
        <div className="whitespace-nowrap px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-md">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/60">{label}</p>
        </div>
      </Html>
    </group>
  );
};

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
    { label: 'CLOUD ARCHITECTURE', color: '#00d9ff', speed: 0.012 },
    { label: 'DIGITAL EXPERIENCE', color: '#00d9ff', speed: -0.008 }
  ];

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Central Core Glow */}
      <pointLight position={[0, 0, 0]} color="#00d9ff" intensity={2} distance={10} />
      
      {/* Top Cap */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.6, 32]} />
        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
        <Html position={[0, 0.4, 0]} center>
          <div className="w-12 h-12 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
        </Html>
      </mesh>

      {/* Layers */}
      {layers.map((layer, i) => (
        <CoreLayer 
          key={i} 
          index={i}
          position={[0, 1 - (i * 0.7), 0]} 
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

      {/* Floor Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial 
          color="#00d9ff" 
          transparent 
          opacity={0.1} 
          metalness={1}
          roughness={0}
        />
      </mesh>
    </group>
  );
};

// --- UI Components ---

const FloatingCard = ({ icon: Icon, title, value, position, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: position.includes('right') ? 50 : -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1, delay }}
    className={`absolute ${position} z-20 glass-effect p-4 md:p-6 !rounded-2xl border-white/10 shadow-glow-cyan/5 flex items-center gap-4 group`}
  >
    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 group-hover:border-secondary transition-colors">
      <Icon className="w-5 h-5 text-secondary" />
    </div>
    <div>
      <p className="text-[8px] font-black uppercase tracking-widest text-foreground/40 mb-0.5">{title}</p>
      <p className="text-sm font-black text-foreground">{value}</p>
    </div>
  </motion.div>
);

const Terminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    '> init_vexor',
    'Loading modules...',
    'System ready.'
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullLines.length) {
        setLines(prev => [...prev, fullLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
      className="absolute bottom-[-10%] right-[10%] w-full max-w-[280px] glass-effect !rounded-2xl border-white/5 p-5 shadow-soft-depth z-30"
    >
      <div className="flex gap-1.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-green-500/50" />
      </div>
      <div className="font-mono text-[10px] space-y-2">
        {lines.map((line, i) => (
          <div key={i} className={i === 0 ? 'text-secondary' : 'text-foreground/40'}>
            <span className="mr-2">$</span>
            {line}
          </div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-1.5 h-3 bg-secondary inline-block align-middle ml-1"
        />
      </div>
    </motion.div>
  );
};

const StatItem = ({ label, value, icon: Icon }: any) => (
  <div className="flex items-center gap-4 px-8 border-r border-white/5 last:border-none">
    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
      <Icon className="w-5 h-5 text-secondary" />
    </div>
    <div>
      <p className="text-xl font-black text-foreground tracking-tighter">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-foreground/40">{label}</p>
    </div>
  </div>
);

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-[#03050a] pt-32 pb-40 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.03)_0%,transparent_70%)]" />
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Side: Content */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl"
            >
              <Sparkles className="w-3 h-3 text-secondary" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary">Next-Gen IT Transformation</span>
            </motion.div>

            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="font-heading text-6xl md:text-8xl lg:text-[6.5rem] font-black text-foreground leading-[0.9] tracking-tighter"
              >
                Building <br />
                <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Intelligent</span><br />
                Digital Solutions
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-paragraph text-lg text-foreground/50 max-w-xl leading-relaxed"
              >
                Empowering businesses with cutting-edge AI, high-performance web systems, and futuristic digital experiences.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <button 
                onClick={() => navigate('/services')}
                className="px-10 py-5 rounded-2xl bg-secondary text-black text-[11px] font-black uppercase tracking-widest hover:bg-white hover:shadow-neon-cyan transition-all duration-500 flex items-center gap-3 group"
              >
                Explore Services
                <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/projects')}
                className="px-10 py-5 rounded-2xl border border-white/10 glass-effect text-foreground/60 text-[11px] font-black uppercase tracking-widest hover:border-white/30 transition-all duration-500 flex items-center gap-3 group"
              >
                View Projects
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Right Side: 3D Scene */}
          <div className="relative h-[600px] lg:h-[800px] w-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]}>
              <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                autoRotate 
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 1.5}
              />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
              
              <Suspense fallback={null}>
                <FuturisticCore />
              </Suspense>

              {/* Background Bokeh */}
              <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <mesh position={[-5, 2, -5]}>
                  <sphereGeometry args={[0.5, 32, 32]} />
                  <meshBasicMaterial color="#00d9ff" transparent opacity={0.1} />
                </mesh>
              </Float>
            </Canvas>

            {/* Overlay UI Cards */}
            <FloatingCard 
              icon={Activity} 
              title="Performance" 
              value="Optimized" 
              position="top-10 left-10" 
              delay={0.8} 
            />
            <FloatingCard 
              icon={Shield} 
              title="Security" 
              value="Advanced" 
              position="top-[40%] right-10" 
              delay={1.2} 
            />
            <Terminal />
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-10 left-0 right-0 z-20">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="glass-effect !rounded-[2.5rem] border-white/5 py-8 flex flex-wrap justify-between items-center bg-[#05050a]/50"
          >
            <StatItem icon={Rocket} value="50+" label="Projects Delivered" />
            <StatItem icon={Activity} value="30+" label="Happy Clients" />
            <StatItem icon={Sparkles} value="99.9%" label="Uptime & Reliability" />
            <StatItem icon={Activity} value="24/7" label="Support" />
          </motion.div>
        </div>
      </div>

      {/* Background Large Logo Text */}
      <div className="absolute bottom-[-10%] left-[-5%] text-[30rem] font-black text-white/[0.01] pointer-events-none select-none tracking-tighter">
        VEXOR
      </div>
    </section>
  );
};
