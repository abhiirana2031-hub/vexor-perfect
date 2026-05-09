import React, { useState, useEffect, useRef, Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Rocket, Sparkles } from 'lucide-react';

/* ── 3D Error Boundary ───────────────────────────────────────────────────── */
class ThreeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  constructor(p: any) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[3D]', e.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ── Lazy-loaded canvas ──────────────────────────────────────────────────── */
const LazyCanvas = lazy(() =>
  import('./HeroCanvas').catch(() => ({ default: () => null }))
);

/* ── Stat item ───────────────────────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{value}</span>
    <span className="text-[10px] font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
  </div>
);

/* ── Hero ────────────────────────────────────────────────────────────────── */
export const Hero = () => {
  const navigate = useNavigate();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showCanvas, setShowCanvas] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowCanvas(true), 150);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x:  ((e.clientX - rect.left)  / rect.width  - 0.5) * 2,
      y: -((e.clientY - rect.top)   / rect.height - 0.5) * 2,
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden"
      style={{ minHeight: '100vh', background: '#020408' }}
    >
      {/* ── Full-screen 3D background ── */}
      <div className="absolute inset-0 z-0">
        <ThreeBoundary>
          {showCanvas && (
            <Suspense fallback={null}>
              <LazyCanvas mouseX={mouse.x} mouseY={mouse.y} />
            </Suspense>
          )}
        </ThreeBoundary>

        {/* Gradient overlay: left side readable, right side clear for 3D */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(105deg, rgba(2,4,8,0.82) 0%, rgba(2,4,8,0.55) 45%, rgba(2,4,8,0.1) 75%, transparent 100%)' }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #020408 0%, transparent 100%)' }} />
      </div>

      {/* ── Text overlay ── */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen">
        <div className="max-w-[100rem] mx-auto px-6 sm:px-10 lg:px-16 w-full pt-28 pb-36">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Enterprise Technology Partner
            </span>
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6' }} />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="font-heading font-black text-white leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
          >
            Pioneering<br />
            <span style={{ color: '#3B82F6' }}>The Future</span><br />
            Of Technology.
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-md text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: 'rgba(255,255,255,0.52)' }}
          >
            Empowering businesses worldwide with innovative technology solutions that drive growth, efficiency, and digital transformation.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.42 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/contact')}
              className="group flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{ padding: '14px 30px', borderRadius: 10, background: '#3B82F6', color: '#fff', fontSize: 11, letterSpacing: '0.18em', border: 'none', cursor: 'pointer', boxShadow: '0 0 28px rgba(59,130,246,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 48px rgba(59,130,246,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(59,130,246,0.4)')}
            >
              Start a Project
              <ChevronRight style={{ width: 15, height: 15 }} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{ padding: '14px 30px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.75)', fontSize: 11, letterSpacing: '0.18em', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
            >
              View Our Work
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-wrap gap-x-10 gap-y-6"
          >
            <Stat value="500+" label="Projects Completed" />
            <Stat value="200+" label="Happy Clients" />
            <Stat value="50+"  label="Team Members" />
            <Stat value="15+"  label="Years Experience" />
          </motion.div>
        </div>
      </div>

      {/* ── SCROLL indicator ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 hidden lg:flex"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.4em]" style={{ color: 'rgba(255,255,255,0.35)' }}>Scroll</span>
        <motion.div animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(59,130,246,0.8), transparent)', transformOrigin: 'top' }} />
      </motion.div>
    </section>
  );
};
