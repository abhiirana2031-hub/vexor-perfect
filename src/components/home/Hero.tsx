import React, { useState, useEffect, useRef, Suspense, lazy, Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

/* ── 3D Error Boundary ───────────────────────────────────────────────────── */
class ThreeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  constructor(p: any) { super(p); this.state = { failed: false }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(e: Error) { console.warn('[3D]', e.message); }
  render() { return this.state.failed ? null : this.props.children; }
}

/* ── Lazy canvas — passes isMobile so scene reduces GPU load ─────────────── */
const LazyCanvas = lazy(() =>
  import('./HeroCanvas').catch(() => ({ default: () => null }))
);

/* ── Stat item — fluid size ─────────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <span
      className="font-black text-white tracking-tight"
      style={{ fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', lineHeight: 1 }}
    >
      {value}
    </span>
    <span
      className="font-semibold uppercase mt-1 whitespace-nowrap"
      style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.65rem)', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}
    >
      {label}
    </span>
  </div>
);

/* ── Hero ────────────────────────────────────────────────────────────────── */
export const Hero = () => {
  const navigate = useNavigate();
  const [mouse, setMouse]       = useState({ x: 0, y: 0 });
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
    if (isMobile) return; // skip mouse tracking on touch devices
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
      style={{ minHeight: '100dvh', background: '#020408' }}
    >
      {/* ── Full-screen 3D background ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <ThreeBoundary>
          {showCanvas && (
            <Suspense fallback={null}>
              {/* Pass isMobile so HeroCanvas halves particle count */}
              <LazyCanvas mouseX={mouse.x} mouseY={mouse.y} isMobile={isMobile} />
            </Suspense>
          )}
        </ThreeBoundary>

        {/* Gradient overlay — stronger on mobile for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isMobile
              ? 'linear-gradient(180deg, rgba(2,4,8,0.88) 0%, rgba(2,4,8,0.72) 60%, rgba(2,4,8,0.50) 100%)'
              : 'linear-gradient(105deg, rgba(2,4,8,0.82) 0%, rgba(2,4,8,0.55) 45%, rgba(2,4,8,0.1) 75%, transparent 100%)',
          }}
        />

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: 'clamp(80px, 12vw, 180px)', background: 'linear-gradient(to top, #020408 0%, transparent 100%)' }}
        />
      </div>

      {/* ── Text content overlay ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center min-h-[100dvh]">
        <div
          className="w-full max-w-[100rem] mx-auto"
          style={{
            paddingLeft:  'clamp(1.25rem, 5vw, 5rem)',
            paddingRight: 'clamp(1.25rem, 5vw, 5rem)',
            paddingTop:   'clamp(6rem, 14vw, 10rem)',
            paddingBottom:'clamp(8rem, 16vw, 12rem)',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-5 sm:mb-8"
          >
            <span
              className="font-black uppercase"
              style={{ fontSize: 'clamp(0.55rem, 1.6vw, 0.7rem)', letterSpacing: '0.38em', color: 'rgba(255,255,255,0.55)' }}
            >
              Enterprise Technology Partner
            </span>
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', flexShrink: 0 }}
            />
          </motion.div>

          {/* Headline — fluid clamp, preserves proportional scale */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
            className="font-heading font-black text-white leading-[0.90] tracking-tight"
            style={{
              fontSize: 'clamp(2.6rem, 9vw, 7.5rem)',
              marginBottom: 'clamp(1rem, 3vw, 2rem)',
            }}
          >
            Pioneering<br />
            <span style={{ color: '#3B82F6' }}>The Future</span><br />
            Of Technology.
          </motion.h1>

          {/* Sub-text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.25 }}
            className="leading-relaxed"
            style={{
              fontSize: 'clamp(0.85rem, 2.2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.52)',
              maxWidth: 'clamp(280px, 55vw, 460px)',
              marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            Empowering businesses worldwide with innovative technology solutions that drive growth, efficiency, and digital transformation.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.42 }}
            className="flex flex-wrap gap-3 sm:gap-4"
            style={{ marginBottom: 'clamp(2rem, 6vw, 4rem)' }}
          >
            <button
              onClick={() => navigate('/contact')}
              className="group flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{
                padding: 'clamp(11px,1.6vw,15px) clamp(20px,3.5vw,32px)',
                borderRadius: 10,
                background: '#3B82F6',
                color: '#fff',
                fontSize: 'clamp(0.6rem, 1.3vw, 0.72rem)',
                letterSpacing: '0.18em',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(59,130,246,0.4)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 44px rgba(59,130,246,0.65)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 24px rgba(59,130,246,0.4)')}
            >
              Start a Project
              <ChevronRight style={{ width: 14, height: 14 }} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2 font-black uppercase transition-all duration-300"
              style={{
                padding: 'clamp(11px,1.6vw,15px) clamp(20px,3.5vw,32px)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.75)',
                fontSize: 'clamp(0.6rem, 1.3vw, 0.72rem)',
                letterSpacing: '0.18em',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
            >
              View Our Work
            </button>
          </motion.div>

          {/* Stats — always inline, fluid gaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-wrap"
            style={{ gap: 'clamp(1.2rem, 4vw, 2.5rem)' }}
          >
            <Stat value="500+" label="Projects Completed" />
            <Stat value="200+" label="Happy Clients" />
            <Stat value="50+"  label="Team Members" />
            <Stat value="15+"  label="Years Experience" />
          </motion.div>
        </div>
      </div>

      {/* ── SCROLL indicator — desktop only ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 hidden lg:flex"
      >
        <span
          className="font-black uppercase"
          style={{ fontSize: '0.55rem', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.35)' }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(59,130,246,0.8), transparent)', transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
};
