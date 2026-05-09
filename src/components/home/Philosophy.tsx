import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Zap, Cpu, BarChart3, Globe, CheckCircle2, Layers } from 'lucide-react';

/* ── Feature Card (2x2 grid left side – close to reference) ─────────────── */
const FeatureCard = ({ icon: Icon, title, tag, desc, delay }: any) => (
  <motion.div
    initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true }} transition={{ duration:0.65, delay }}
    whileHover={{ y:-4, borderColor:'rgba(0,217,255,0.3)' }}
    style={{ padding:28, borderRadius:20, background:'linear-gradient(145deg,#090f1e,#060b16)', border:'1px solid rgba(0,217,255,0.1)', boxShadow:'0 8px 32px rgba(0,0,0,0.35)', position:'relative', overflow:'hidden', cursor:'default', transition:'border-color 0.3s, transform 0.3s' }}
  >
    {/* Icon */}
    <div style={{ width:52, height:52, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,217,255,0.08)', border:'1px solid rgba(0,217,255,0.2)', marginBottom:18 }}>
      <Icon style={{ width:24, height:24, color:'#00d9ff' }} />
    </div>
    <h3 style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.22em', color:'#fff', marginBottom:10 }}>{title}</h3>
    <p style={{ fontSize:13, lineHeight:1.65, color:'rgba(255,255,255,0.42)', marginBottom:16 }}>{desc}</p>
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ width:24, height:1, background:'#00d9ff' }} />
      <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:'#00d9ff' }}>{tag}</span>
    </div>
    {/* Corner glow */}
    <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(0,217,255,0.06)', filter:'blur(25px)', pointerEvents:'none' }} />
  </motion.div>
);

/* ── Hexagonal Tech Ecosystem (the "something else") ─────────────────────── */
const HEX_NODES = [
  { label:'AI', icon: Cpu,      color:'#00d9ff', angle: 90,  r: 120 },
  { label:'SECURE', icon: Shield,   color:'#00ffb3', angle: 30,  r: 120 },
  { label:'CLOUD', icon: Layers,    color:'#7b6fff', angle: 330, r: 120 },
  { label:'SPEED', icon: Zap,      color:'#ff9f43', angle: 270, r: 120 },
  { label:'GLOBAL', icon: Globe,   color:'#00d9ff', angle: 210, r: 120 },
  { label:'DATA', icon: BarChart3, color:'#e056fd', angle: 150, r: 120 },
];

const TechEcosystem = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:'-80px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setActive(a => (a+1) % HEX_NODES.length), 1800);
    return () => clearInterval(id);
  }, [inView]);

  const CX = 200, CY = 200;

  return (
    <motion.div ref={ref}
      initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }}
      viewport={{ once:true }} transition={{ duration:0.9 }}
      style={{ position:'relative', padding:32, borderRadius:32, background:'linear-gradient(145deg,#070d1c,#050910)', border:'1px solid rgba(0,217,255,0.12)', boxShadow:'0 40px 80px rgba(0,0,0,0.5),inset 0 0 60px rgba(0,217,255,0.02)', overflow:'visible' }}
    >
      {/* Scanning line */}
      <motion.div animate={{ y:['0%','100%','0%'] }} transition={{ duration:5, repeat:Infinity, ease:'linear' }}
        style={{ position:'absolute', inset:'32px', height:1, background:'linear-gradient(90deg,transparent,rgba(0,217,255,0.35),transparent)', pointerEvents:'none', zIndex:5 }} />

      {/* SVG network */}
      <svg width="100%" viewBox="0 0 400 400" style={{ overflow:'visible', display:'block' }}>
        {/* Outer hexagon path */}
        <polygon points={HEX_NODES.map(n => {
          const rad = (n.angle - 90) * Math.PI / 180;
          return `${CX + n.r * Math.cos(rad)},${CY + n.r * Math.sin(rad)}`;
        }).join(' ')} fill="none" stroke="rgba(0,217,255,0.08)" strokeWidth="1" />

        {/* Connection lines from center */}
        {HEX_NODES.map((n, i) => {
          const rad = (n.angle - 90) * Math.PI / 180;
          const nx = CX + n.r * Math.cos(rad);
          const ny = CY + n.r * Math.sin(rad);
          return (
            <g key={i}>
              <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={i===active ? n.color : 'rgba(0,217,255,0.12)'} strokeWidth={i===active ? 1.5 : 0.8} strokeDasharray={i===active ? '0' : '4,4'} style={{ transition:'all 0.4s' }} />
              {/* Animated dot on active line */}
              {i === active && (
                <motion.circle r="3" fill={n.color}
                  animate={{ cx:[CX, nx], cy:[CY, ny] }}
                  transition={{ duration:0.9, repeat:Infinity, ease:'linear' }}
                />
              )}
            </g>
          );
        })}

        {/* Outer nodes */}
        {HEX_NODES.map((n, i) => {
          const rad = (n.angle - 90) * Math.PI / 180;
          const nx = CX + n.r * Math.cos(rad);
          const ny = CY + n.r * Math.sin(rad);
          const isActive = i === active;
          return (
            <g key={i}>
              {isActive && <circle cx={nx} cy={ny} r="28" fill={`${n.color}15`} stroke={n.color} strokeWidth="1" opacity="0.6" />}
              <circle cx={nx} cy={ny} r="20" fill={isActive ? `${n.color}22` : 'rgba(255,255,255,0.03)'} stroke={isActive ? n.color : 'rgba(0,217,255,0.2)'} strokeWidth="1" style={{ transition:'all 0.4s' }} />
              <text x={nx} y={ny+4} textAnchor="middle" fontSize="8" fontWeight="900" fill={isActive ? n.color : 'rgba(255,255,255,0.45)'} letterSpacing="0" fontFamily="system-ui" style={{ transition:'all 0.4s' }}>{n.label}</text>
            </g>
          );
        })}

        {/* Center node */}
        <circle cx={CX} cy={CY} r="44" fill="rgba(0,217,255,0.06)" stroke="rgba(0,217,255,0.35)" strokeWidth="1.5" />
        <motion.circle cx={CX} cy={CY} r="44" fill="none" stroke="#00d9ff" strokeWidth="2" strokeDasharray="280" animate={{ strokeDashoffset:[280,0] }} transition={{ duration:2, ease:'easeOut', once:true }} />
        <circle cx={CX} cy={CY} r="30" fill="rgba(0,217,255,0.04)" stroke="rgba(0,217,255,0.2)" strokeWidth="1" />

        {/* Center text */}
        <text x={CX} y={CY-8} textAnchor="middle" fontSize="28" fontWeight="900" fill="#fff" fontFamily="system-ui" letterSpacing="-1">100</text>
        <text x={CX} y={CY+10} textAnchor="middle" fontSize="7.5" fontWeight="900" fill="rgba(255,255,255,0.4)" fontFamily="system-ui" letterSpacing="1">OUT OF 100</text>

        {/* Inner rotating ring */}
        <motion.circle cx={CX} cy={CY} r="58" fill="none" stroke="rgba(0,217,255,0.1)" strokeWidth="1" strokeDasharray="8,6"
          animate={{ rotate:360 }} transition={{ duration:20, repeat:Infinity, ease:'linear' }}
          style={{ transformOrigin:`${CX}px ${CY}px` }} />
      </svg>

      {/* Bottom badge */}
      <div style={{ display:'flex', justifyContent:'center', marginTop:-8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 20px', borderRadius:99, background:'rgba(0,217,255,0.08)', border:'1px solid rgba(0,217,255,0.25)' }}>
          <CheckCircle2 style={{ width:14, height:14, color:'#00d9ff' }} />
          <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.35em', color:'#00d9ff' }}>Maximum Efficiency</span>
        </div>
      </div>

      {/* Floating metric badges */}
      {[
        { icon: Shield,   val:'99.9%', label:'Uptime',            top:-20, left:-20,  color:'#00ffb3' },
        { icon: Award,    val:'500+',  label:'Projects Delivered', top:-20, right:-20, color:'#00d9ff' },
        { icon: Globe,    val:'50+',   label:'Countries Served',   bottom:-20, left:-20, color:'#7b6fff' },
        { icon: Rocket,   val:'2x',    label:'Faster Delivery',    bottom:-20, right:-20, color:'#ff9f43' },
      ].map((b, i) => (
        <motion.div key={i}
          initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true }} transition={{ delay:0.6 + i*0.15 }}
          style={{ position:'absolute', top:b.top, bottom:(b as any).bottom, left:b.left, right:(b as any).right, display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:14, background:'rgba(5,9,18,0.92)', border:`1px solid ${b.color}35`, backdropFilter:'blur(16px)', boxShadow:'0 8px 24px rgba(0,0,0,0.5)', whiteSpace:'nowrap' }}
        >
          <b.icon style={{ width:16, height:16, color:b.color, flexShrink:0 }} />
          <div>
            <p style={{ fontSize:13, fontWeight:900, color:'#fff', lineHeight:1 }}>{b.val}</p>
            <p style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(255,255,255,0.4)' }}>{b.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

/* ── Stats Bar ────────────────────────────────────────────────────────────── */
const StatBar = ({ icon: Icon, value, label }: any) => (
  <div style={{ display:'flex', alignItems:'center', gap:14, padding:'0 28px', borderRight:'1px solid rgba(255,255,255,0.05)' }} className="last:border-none">
    <div style={{ width:40, height:40, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,217,255,0.07)', border:'1px solid rgba(0,217,255,0.2)', flexShrink:0 }}>
      <Icon style={{ width:18, height:18, color:'#00d9ff' }} />
    </div>
    <div>
      <p style={{ fontSize:19, fontWeight:900, color:'#fff', letterSpacing:'-0.04em', lineHeight:1 }}>{value}</p>
      <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:'rgba(255,255,255,0.35)', whiteSpace:'nowrap' }}>{label}</p>
    </div>
  </div>
);

/* ── Philosophy Export ────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:Shield,   title:'Cyber Secure',  tag:'Always Protected',     delay:0.1, desc:'Military-grade encryption and advanced security protocols to protect what matters.' },
  { icon:BarChart3,title:'Hyper Scale',   tag:'Grow Without Limits',  delay:0.2, desc:'Architectures built to scale with your vision — no limits, no bottlenecks.' },
  { icon:Zap,      title:'Ultra Fast',    tag:'Speed By Design',      delay:0.3, desc:'Optimized for speed and efficiency with sub-second latency across the globe.' },
  { icon:Cpu,      title:'AI Native',     tag:'AI Powered Solutions', delay:0.4, desc:'Intelligence integrated into every layer of code to deliver smarter experiences.' },
];

export const Philosophy = () => (
  <section id="philosophy" style={{ position:'relative', width:'100%', padding:'96px 0 112px', background:'#03050a', borderTop:'1px solid rgba(255,255,255,0.05)', overflow:'hidden' }}>

    {/* Ambient */}
    <div style={{ position:'absolute', top:'50%', left:'30%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,217,255,0.04) 0%,transparent 70%)', pointerEvents:'none' }} />

    <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">

      {/* Header */}
      <div style={{ marginBottom:72 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
          <div style={{ width:48, height:1, background:'#00d9ff' }} />
          <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.5em', color:'#00d9ff' }}>Our Standard</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-end">
          <h2 className="font-heading font-black tracking-tighter text-white" style={{ fontSize:'clamp(2.2rem,4.5vw,4.5rem)', lineHeight:0.92 }}>
            Built for Performance.<br />
            Engineered for <span style={{ color:'#00d9ff' }}>Excellence.</span>
          </h2>
          <p style={{ fontSize:17, lineHeight:1.7, color:'rgba(255,255,255,0.4)', maxWidth:440 }}>
            We don't just build digital products — we build robust, scalable, and future-ready solutions that drive real business impact.
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left: 2×2 cards */}
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f,i) => <FeatureCard key={i} {...f} />)}
        </div>

        {/* Right: Hex ecosystem */}
        <div style={{ position:'relative', paddingTop:32, paddingBottom:32 }}>
          <TechEcosystem />
        </div>
      </div>


    </div>

    {/* BG watermark */}
    <div style={{ position:'absolute', top:'50%', right:'-8%', transform:'translateY(-50%) rotate(90deg)', fontSize:'20rem', fontWeight:900, color:'rgba(255,255,255,0.007)', pointerEvents:'none', userSelect:'none', letterSpacing:'-0.04em' }}>VEXOR</div>
  </section>
);
