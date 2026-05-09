import React, { useState, useEffect, useRef, Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

/* ── 3D Error Boundary ───────────────────────────────────────────────────── */
class ThreeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  constructor(p: any) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[3D]', e.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ── Stat Item — Studio Namma Style ─────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col gap-1">
    <span className="font-black text-white text-3xl lg:text-4xl tracking-tighter leading-none">
      {value}
    </span>
    <span className="font-bold uppercase text-[10px] tracking-[0.2em] text-white/40 whitespace-nowrap">
      {label}
    </span>
  </div>
);

export const Hero = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showCanvas, setShowCanvas] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    const t = setTimeout(() => setShowCanvas(true), 150);
    return () => { clearTimeout(t); window.removeEventListener('resize', check); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#020408]"
      style={{ minHeight: '100dvh' }}
    >
      {/* ── 3D Background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <ThreeBoundary>
          {showCanvas && (
            <HeroCanvas mouseX={mouse.x} mouseY={mouse.y} isMobile={isMobile} />
          )}
        </ThreeBoundary>
        
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,4,8,0.4)_100%)]" />
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#020408] to-transparent pointer-events-none" />
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-[110rem] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center py-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            {/* Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="h-[1px] w-12 bg-secondary" />
              <span className="text-secondary font-bold tracking-[0.4em] text-[10px] uppercase">
                Enterprise Technology Partner
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-white leading-[0.85] tracking-tighter mb-10 text-[clamp(3.5rem,10vw,8rem)]">
              Pioneering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary/50">
                The Future
              </span> <br />
              Of Tech.
            </h1>

            {/* Description */}
            <p className="font-paragraph text-lg lg:text-xl text-white/50 max-w-xl mb-12 leading-relaxed">
              We think, craft, and design bold digital experiences for ambitious brands. 
              Meticulous engineering meets intentional design.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-6 mb-20">
              <button
                onClick={() => navigate('/contact')}
                className="group relative px-10 py-5 bg-secondary text-primary font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2 tracking-widest text-xs">
                  START A PROJECT <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              
              <button
                onClick={() => navigate('/work')}
                className="px-10 py-5 border border-white/10 text-white/80 font-bold rounded-full transition-all duration-300 hover:bg-white hover:text-primary tracking-widest text-xs"
              >
                VIEW OUR WORK
              </button>
            </div>

            {/* Glassmorphism Stats Section */}
            <div className="flex flex-wrap gap-x-16 gap-y-8 py-10 px-12 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl w-fit">
              <Stat value="500+" label="Projects Done" />
              <Stat value="200+" label="Happy Clients" />
              <Stat value="15+" label="Years Exp." />
            </div>
          </motion.div>

          {/* Desktop Spacer for 3D Orb */}
          <div className="hidden lg:block h-full min-h-[600px] pointer-events-none" />
        </div>
      </div>

      {/* ── Scroll Indicator ──────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6"
      >
        <span className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-bold">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-20 bg-gradient-to-b from-secondary to-transparent" 
        />
      </motion.div>
    </section>
  );
};
