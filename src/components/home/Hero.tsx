import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal as TerminalIcon, ShieldCheck, Activity, ChevronRight } from 'lucide-react';

/**
 * Interactive Terminal Component
 * Matches the MacBook style window in the screenshot.
 */
const TerminalWindow = () => {
  const [lines, setLines] = useState<string[]>([]);
  const fullLines = [
    '> init_vexor',
    'Loading modules...',
    'Optimizing core...',
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
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full max-w-[500px] aspect-[4/5] glass-effect !rounded-[2.5rem] border-white/10 shadow-soft-depth overflow-hidden flex flex-col group relative"
    >
      {/* Mac Header */}
      <div className="h-12 bg-white/[0.03] border-b border-white/5 flex items-center px-6 gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-8 font-mono text-sm space-y-4">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-3 ${i === 0 ? 'text-secondary' : 'text-foreground/60'}`}
            >
              {i === 0 && <span className="text-secondary">$</span>}
              {line}
              {i === lines.length - 1 && i < fullLines.length - 1 && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-4 bg-secondary"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Terminal Footer (Status Bar) */}
      <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#27C93F] animate-pulse shadow-[0_0_10px_#27C93F]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#27C93F]">Online</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Uptime</p>
          <p className="text-xl font-black text-foreground tracking-tighter">99.99%</p>
        </div>
      </div>

      {/* Cyber Grid Mask inside terminal */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
    </motion.div>
  );
};

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/profile');
  };
  
  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#03050a] pt-32 pb-20"
    >
      {/* Background Orbital Lines (Matches screenshot) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
         {[...Array(5)].map((_, i) => (
           <div 
             key={i}
             className="absolute border border-white/5 rounded-full"
             style={{ 
               width: `${(i + 1) * 400}px`, 
               height: `${(i + 1) * 400}px`,
               opacity: 1 - (i * 0.2)
             }}
           />
         ))}
         {/* Radial Glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,rgba(0,217,255,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          
          {/* Left: Content */}
          <div className="space-y-10 md:space-y-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-4 px-5 py-2 md:px-6 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl"
            >
              <div className="w-4 h-4 rounded-full bg-secondary/20 flex items-center justify-center">
                <Activity className="w-2 h-2 text-secondary animate-pulse" />
              </div>
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] uppercase text-secondary">
                Next-Gen IT Transformation
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-6 md:space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-black text-foreground leading-[0.9] tracking-tighter"
              >
                Building <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary animate-text-shimmer bg-[length:200%_auto] shadow-neon-cyan/20">
                  Intelligent
                </span><br />
                Digital Solutions
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="font-paragraph text-lg md:text-xl text-foreground/40 max-w-xl leading-relaxed font-medium"
              >
                Empowering businesses with cutting-edge AI, high-performance web systems, and futuristic digital experiences. Innovation is our core essence.
              </motion.p>
            </div>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col md:flex-row items-stretch md:items-center gap-6 md:gap-8 pt-4 md:pt-8"
            >
              <button 
                onClick={handleGetStarted}
                className="w-full md:w-auto px-10 py-5 rounded-2xl bg-secondary text-black text-sm font-black uppercase tracking-[0.2em] hover:bg-white hover:shadow-neon-cyan transition-all duration-500 group flex items-center justify-center gap-4 relative z-20"
              >
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/services')}
                className="w-full md:w-auto px-10 py-5 rounded-2xl border border-white/10 text-foreground/60 text-sm font-black uppercase tracking-[0.2em] hover:bg-white/[0.02] hover:border-white/20 transition-all duration-500 relative z-20"
              >
                View Services
              </button>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <div className="relative flex justify-center lg:justify-end">
             {/* Floating Ambient Effects behind terminal */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 blur-[120px] rounded-full -z-10 animate-mesh-panning" />
             <TerminalWindow />
          </div>

        </div>
      </div>

      {/* Corner Logo Background Element */}
      <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
        <div className="w-12 h-12 rounded-xl glass-effect flex items-center justify-center border-white/10">
           <div className="text-[10px] font-black text-foreground/40">NV</div>
        </div>
      </div>
    </section>
  );
};
