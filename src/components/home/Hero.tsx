import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Rocket, Shield, Activity, Sparkles, Zap, Crown, TrendingUp } from 'lucide-react';

/* ─── Isometric Server Stack ─────────────────────────────────────────────── */
const LAYERS = [
  { label: 'AI INTEGRATION',     color: '#00d9ff' },
  { label: 'WEB SOLUTIONS',      color: '#00c8ef' },
  { label: 'CLOUD ARCHITECTURE', color: '#00b5dc' },
  { label: 'DIGITAL EXPERIENCE', color: '#009ec8' },
];

const ServerStack = () => (
  <motion.div
    animate={{ y: [0, -14, 0] }}
    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    style={{ transformStyle: 'preserve-3d' }}
    className="relative mx-auto"
  >
    <div
      style={{
        transform: 'perspective(900px) rotateX(22deg) rotateY(-20deg)',
        transformStyle: 'preserve-3d',
        width: 'fit-content',
        margin: '0 auto',
      }}
    >
      {/* ── Top Cap ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
        className="relative flex items-center justify-center mx-auto mb-[6px]"
        style={{
          width: 220, height: 62,
          background: 'linear-gradient(160deg,#0f2242 0%,#091730 100%)',
          border: '1px solid rgba(0,217,255,0.55)',
          borderRadius: 10,
          boxShadow: '0 0 40px rgba(0,217,255,0.22), inset 0 0 30px rgba(0,217,255,0.06)',
        }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#00d9ff,transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,217,255,0.3),transparent)' }} />
        <div style={{ width: 42, height: 42, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.5)', boxShadow: '0 0 18px rgba(0,217,255,0.35)' }}>
          <Crown style={{ width: 20, height: 20, color: '#00d9ff' }} />
        </div>
        {/* right-face illusion */}
        <div className="absolute" style={{ right: -18, top: 4, bottom: -4, width: 18, background: 'linear-gradient(90deg,rgba(0,217,255,0.12),transparent)', borderTop: '1px solid rgba(0,217,255,0.25)', borderRight: '1px solid rgba(0,217,255,0.1)', skewY: '0deg', clipPath: 'polygon(0 0,100% 8px,100% 100%,0 100%)' }} />
      </motion.div>

      {/* ── Server Layers ── */}
      {LAYERS.map((l, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.13 }}
          className="relative mb-[5px]"
          style={{
            width: 240 + i * 2,
            height: 48,
            background: `linear-gradient(135deg,#0b1a2e 0%,#070f1c 100%)`,
            border: `1px solid ${l.color}50`,
            borderTop: `1px solid ${l.color}90`,
            borderRadius: 4,
            boxShadow: `0 0 12px ${l.color}18, inset 0 0 16px rgba(0,217,255,0.03)`,
            display: 'flex', alignItems: 'center', paddingLeft: 16, gap: 10,
            overflow: 'hidden',
          }}
        >
          {/* Scan line */}
          <motion.div
            animate={{ x: ['-110%', '210%'] }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
            className="absolute inset-y-0 w-1/4 pointer-events-none"
            style={{ background: `linear-gradient(90deg,transparent,${l.color}28,transparent)` }}
          />
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{ width: 7, height: 7, borderRadius: '50%', background: l.color, boxShadow: `0 0 8px ${l.color}`, flexShrink: 0 }} />
          <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(190,220,255,0.72)', zIndex: 1 }}>
            {l.label}
          </span>
          {/* right-face shadow */}
          <div className="absolute" style={{ right: -14, top: 2, bottom: -2, width: 14, background: `linear-gradient(90deg,${l.color}18,transparent)`, borderTop: `1px solid ${l.color}30`, clipPath: 'polygon(0 0,100% 4px,100% 100%,0 100%)' }} />
        </motion.div>
      ))}

      {/* ── Base ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ width: 268, height: 22, background: 'linear-gradient(180deg,#070e1c,#040910)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}
      >
        <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-y-0 w-1/3" style={{ background: 'linear-gradient(90deg,transparent,rgba(0,217,255,0.22),transparent)' }} />
      </motion.div>

      {/* ── Platform ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="relative mx-auto mt-1"
        style={{ width: 310, height: 14, background: 'linear-gradient(180deg,#050810,transparent)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, marginLeft: -21 }}
      />

      {/* ── Glow beneath ── */}
      <div className="mx-auto" style={{ width: 280, height: 14, background: 'rgba(0,217,255,0.18)', filter: 'blur(16px)', borderRadius: '50%', marginTop: 4 }} />
    </div>

    {/* ── Decorative floating cubes ── */}
    {[
      { dx: -170, dy: -60, size: 22 },
      { dx: 165,  dy: -90, size: 16 },
      { dx: -150, dy:  50, size: 12 },
    ].map((c, i) => (
      <motion.div key={i}
        animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 3.5 + i, repeat: Infinity, delay: i * 0.8 }}
        style={{
          position: 'absolute', top: '50%', left: '50%',
          width: c.size, height: c.size,
          transform: `translate(calc(-50% + ${c.dx}px), calc(-50% + ${c.dy}px))`,
          background: 'rgba(0,217,255,0.06)',
          border: '1px solid rgba(0,217,255,0.22)',
          borderRadius: 4,
        }}
      />
    ))}
  </motion.div>
);

/* ─── Mini Chart ─────────────────────────────────────────────────────────── */
const MiniChart = () => {
  const pts = [8, 14, 10, 20, 16, 24, 19, 28, 22, 30];
  const W = 72, H = 28, max = Math.max(...pts);
  const d = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (pts.length - 1)) * W},${H - (v / max) * H}`).join(' ');
  return (
    <svg width={W} height={H} style={{ display: 'block', marginTop: 4 }}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#00d9ff" stopOpacity="0" />
      </linearGradient></defs>
      <path d={`${d} L${W},${H} L0,${H} Z`} fill="url(#cg)" />
      <path d={d} fill="none" stroke="#00d9ff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

/* ─── Floating Card ──────────────────────────────────────────────────────── */
const Card = ({ icon: Icon, title, value, sub, style }: { icon: any; title: string; value: string; sub?: React.ReactNode; style?: React.CSSProperties }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 1.1 }}
    style={{
      position: 'absolute', zIndex: 20,
      padding: '12px 14px',
      background: 'rgba(6,11,22,0.82)',
      backdropFilter: 'blur(18px)',
      border: '1px solid rgba(0,217,255,0.2)',
      borderRadius: 14,
      boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-start', gap: 10,
      ...style,
    }}
  >
    <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,217,255,0.09)', border: '1px solid rgba(0,217,255,0.3)', flexShrink: 0 }}>
      <Icon style={{ width: 15, height: 15, color: '#00d9ff' }} />
    </div>
    <div>
      <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)', marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 13, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</p>
      {sub && <div style={{ marginTop: 4 }}>{sub}</div>}
    </div>
  </motion.div>
);

/* ─── Terminal ───────────────────────────────────────────────────────────── */
const Terminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const full = ['> init_vexor', 'Loading modules...', 'System ready.'];
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => { if (i < full.length) { setLines(p => [...p, full[i]]); i++; } else clearInterval(id); }, 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
      style={{
        position: 'absolute', bottom: '-2%', right: '4%', zIndex: 30,
        width: 230, padding: '14px 16px',
        background: 'rgba(4,8,18,0.88)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13,
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      }}
    >
      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        {['#f87171', '#fbbf24', '#4ade80'].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 10.5, lineHeight: 1.9 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ color: i === 0 ? '#00d9ff' : 'rgba(255,255,255,0.45)' }}>
            <span style={{ marginRight: 5 }}>$</span>{l}
          </div>
        ))}
        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
          style={{ display: 'inline-block', width: 6, height: 11, background: '#00d9ff', verticalAlign: 'middle' }} />
      </div>
    </motion.div>
  );
};

/* ─── Stat Item ──────────────────────────────────────────────────────────── */
const Stat = ({ icon: Icon, value, label }: any) => (
  <div className="flex items-center gap-3 px-4 sm:px-6 border-r border-white/5 last:border-none">
    <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,217,255,0.07)', border: '1px solid rgba(0,217,255,0.2)', flexShrink: 0 }}>
      <Icon style={{ width: 15, height: 15, color: '#00d9ff' }} />
    </div>
    <div>
      <p className="text-base sm:text-lg font-black text-white" style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</p>
      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
    </div>
  </div>
);

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden" style={{ background: '#03050a', paddingTop: 'clamp(100px,14vw,140px)', paddingBottom: 'clamp(140px,18vw,200px)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 68% 42%, rgba(0,217,255,0.06) 0%, transparent 55%)' }} />
        <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
      </div>

      <div className="w-full max-w-[100rem] mx-auto px-5 sm:px-8 lg:px-12 relative z-10">

        {/* ── Main 2-col grid ── */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text content ── */}
          <div className="space-y-7 sm:space-y-9 text-center lg:text-left order-2 lg:order-1">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(0,217,255,0.25)', background: 'rgba(0,217,255,0.05)', backdropFilter: 'blur(12px)' }}
            >
              <Sparkles style={{ width: 11, height: 11, color: '#00d9ff' }} />
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#00d9ff' }}>Next-Gen IT Transformation</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
              className="font-heading font-black text-white"
              style={{ fontSize: 'clamp(2.6rem,6vw,5.8rem)', lineHeight: 0.92, letterSpacing: '-0.03em' }}
            >
              Building <br />
              <span className="bg-gradient-neon bg-clip-text text-transparent animate-glow-pulse">Intelligent</span><br />
              Digital Solutions
            </motion.h1>

            {/* Sub */}
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed mx-auto lg:mx-0"
              style={{ color: 'rgba(255,255,255,0.48)', maxWidth: 420 }}
            >
              Empowering businesses with cutting-edge AI, high-performance web systems, and futuristic digital experiences.
            </motion.p>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.38 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button onClick={() => navigate('/services')}
                className="flex items-center gap-2 font-black uppercase text-black transition-all duration-300"
                style={{ padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,38px)', borderRadius: 12, background: '#00d9ff', fontSize: 11, letterSpacing: '0.2em', boxShadow: '0 0 28px rgba(0,217,255,0.35)', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(0,217,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(0,217,255,0.35)')}
              >
                Explore Services <Rocket style={{ width: 14, height: 14 }} />
              </button>
              <button onClick={() => navigate('/projects')}
                className="flex items-center gap-2 font-black uppercase transition-all duration-300"
                style={{ padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,38px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.13)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: '0.2em', cursor: 'pointer', backdropFilter: 'blur(12px)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,217,255,0.4)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
              >
                View Projects <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Server visual ── */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center"
            style={{ height: 'clamp(340px,50vw,580px)' }}
          >
            <ServerStack />

            {/* Floating cards – hidden on very small screens */}
            <div className="hidden sm:block">
              <Card icon={TrendingUp} title="Performance" value="Optimized" sub={<MiniChart />} style={{ top: '8%', left: '2%' }} />
              <Card icon={Shield} title="Security" value="Advanced" sub={<span style={{ fontSize: 11, fontWeight: 900, color: '#00d9ff' }}>100%</span>} style={{ top: '40%', right: '2%' }} />
              <Terminal />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-[100rem] mx-auto px-5 sm:px-8 lg:px-12 pb-5">
          <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.8 }}
            className="flex flex-wrap justify-around sm:justify-between items-center gap-y-4 py-5 sm:py-6 px-4 sm:px-6 rounded-[1.4rem] sm:rounded-[2rem]"
            style={{ background: 'rgba(4,6,14,0.78)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 -4px 40px rgba(0,0,0,0.3)' }}
          >
            <Stat icon={Rocket}   value="50+"   label="Projects Delivered" />
            <Stat icon={Activity} value="30+"   label="Happy Clients" />
            <Stat icon={Sparkles} value="99.9%" label="Uptime" />
            <Stat icon={Zap}      value="24/7"  label="Support" />
          </motion.div>
        </div>
      </div>

      {/* Watermark */}
      <div className="hidden lg:block absolute bottom-[-6%] left-[-3%] font-black pointer-events-none select-none" style={{ fontSize: '24rem', color: 'rgba(255,255,255,0.007)', letterSpacing: '-0.05em' }}>
        VEXOR
      </div>
    </section>
  );
};
