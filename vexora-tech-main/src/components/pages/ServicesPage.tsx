import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Services } from '@/entities';
import PageShell from '@/components/PageShell';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Video URLs (CloudFront)
const VIDEO_HERO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4';
const VIDEO_CINEMATIC = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4';
const VIDEO_METRICS = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4';
const VIDEO_TECH = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4';
const VIDEO_FOOTER = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4';

// Style overrides block
const CORE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Anton+SC&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css');

  .space-mono-page {
    font-family: 'Space Mono', monospace !important;
  }
  .space-mono-page * {
    font-family: 'Space Mono', monospace !important;
  }
  .font-anton {
    font-family: 'Anton SC', sans-serif !important;
  }
`;

// ScrambleIn - Entrance Reveal
function ScrambleIn({ text, delay, triggered }: { text: string; delay: number; triggered: boolean }) {
  const [display, setDisplay] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';

  useEffect(() => {
    if (!triggered) return;
    const timer = setTimeout(() => {
      let frame = 0;
      const interval = setInterval(() => {
        frame++;
        const cursor = Math.floor(frame * 0.5);
        if (cursor >= text.length) {
          setDisplay(text);
          clearInterval(interval);
          return;
        }
        let out = '';
        for (let i = 0; i < text.length; i++) {
          if (i < cursor) {
            out += text[i];
          } else if (text[i] === ' ') {
            out += ' ';
          } else if (i < cursor + 3) {
            out += chars[Math.floor(Math.random() * chars.length)];
          } else {
            out += '';
          }
        }
        setDisplay(out);
      }, 25);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [triggered, text, delay]);

  return <span>{display || '\u00A0'}</span>;
}

// ScrambleText - Hover Driven Scramble
function ScrambleText({ text, isHovered, className = '' }: { text: string; isHovered: boolean; className?: string }) {
  const [display, setDisplay] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered) {
      let frame = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        frame++;
        const cursor = Math.floor(frame / 4);
        if (cursor >= text.length) {
          setDisplay(text);
          clearInterval(intervalRef.current!);
          return;
        }
        let out = '';
        for (let i = 0; i < text.length; i++) {
          if (i < cursor) {
            out += text[i];
          } else if (text[i] === ' ') {
            out += ' ';
          } else {
            out += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplay(out);
      }, 25);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplay(text);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, text]);

  return <span className={className}>{display}</span>;
}

// Custom 4-fold abstract logo SVG
function SynapseXLogo({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} fill="currentColor">
      <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" />
      <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(90)" />
      <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(180)" />
      <path d="M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z" transform="rotate(270)" />
    </svg>
  );
}

// SquashHamburger component
function SquashHamburger({ open }: { open: boolean }) {
  return (
    <div className="relative flex flex-col justify-between w-[18px] h-[12px] sm:w-[15px] sm:h-[10px] cursor-pointer">
      <motion.span
        animate={open ? { rotate: 45, y: 5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full h-[1.5px] sm:h-[1.2px] bg-white block absolute top-0"
      />
      <motion.span
        animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full h-[1.5px] sm:h-[1.2px] bg-white block absolute top-[5.25px] sm:top-[4.4px]"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-full h-[1.5px] sm:h-[1.2px] bg-white block absolute bottom-0"
      />
    </div>
  );
}

export default function ServicesPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverLink, setHoverLink] = useState<string | null>(null);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const secondSectionRef = useRef<HTMLDivElement>(null);

  // Set entrance reveal state
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntranceComplete(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Vexor Dynamic services lists
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const result = await BaseCrudService.getAll<Services>('services');
      setServices(result.items || []);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mouse scrubbing seek timeline effect on Hero Background Video
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    let isSeeking = false;
    let targetTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!video.duration) return;
      // Percent based horizontal scrubbing, adjusted with 0.8 sensitivity factor
      const percent = e.clientX / window.innerWidth;
      targetTime = percent * video.duration * 0.8;
      
      if (!isSeeking) {
        isSeeking = true;
        video.currentTime = targetTime;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (Math.abs(video.currentTime - targetTime) > 0.05) {
        isSeeking = true;
        video.currentTime = targetTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // useScroll link for Section 2 rotated 3D perspective scroll effect
  const { scrollYProgress } = useScroll({
    target: secondSectionRef,
    offset: ["start end", "end start"]
  });
  const springProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const translateY = useTransform(springProgress, [0, 1], [60, -120]);
  const textOpacity = useTransform(springProgress, [0.3, 0.5], [0, 1]);

  return (
    <PageShell className="space-mono-page min-h-screen bg-black text-white selection:bg-white/20 select-none overflow-x-hidden">
      <style>{CORE_STYLES}</style>

      {/* Navigation bar removed as requested */}

      {/* ─────────────────── SECTION 1: HERO (Mouse Scrubbed Video) ─────────────────── */}
      <section className="h-screen h-[100dvh] relative flex flex-col justify-end p-6 sm:p-10 md:p-14 overflow-hidden bg-black">
        {/* Scrub Video Element */}
        <video
          ref={heroVideoRef}
          src={VIDEO_HERO}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* Overlay Filters */}
        <div className="absolute inset-0 bg-black/40 z-1 pointer-events-none" />
        <div 
          className="absolute inset-0 z-2 pointer-events-none opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24x24px'
          }}
        />

        {/* Watermark Display Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-1 overflow-hidden mt-[50px]">
          <span 
            className="font-anton select-none leading-none tracking-[-0.04em] uppercase opacity-[0.10] text-[clamp(100px,25vw,480px)] text-transparent"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            VEXOR_IT
          </span>
        </div>

        {/* Content Layers */}
        <AnimatePresence>
          {entranceComplete && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
              className="relative z-10 w-full flex flex-col md:flex-row items-end justify-between gap-8 pt-24"
            >
              {/* Left Column */}
              <div className="flex flex-col gap-4 text-left max-w-xl">
                <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(36px,8vw,80px)] uppercase">
                  <ScrambleIn text="Precision" delay={200} triggered={entranceComplete} /><br />
                  <ScrambleIn text="Engineering" delay={500} triggered={entranceComplete} />
                </h1>
                <motion.p 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.215, 0.61, 0.355, 1.0] }}
                  className="text-white/60 text-xs sm:text-sm leading-relaxed font-light max-w-sm"
                >
                  Vexor designs and builds high-performance custom software, microservices frameworks, and optimized databases tailored to enterprise scale. We solve computational complexity with simple, modular engineering.
                </motion.p>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4 text-left md:text-right">
                <h1 className="text-white font-light leading-[0.95] tracking-[-0.03em] text-[clamp(36px,8vw,80px)] uppercase">
                  <ScrambleIn text="Modular" delay={700} triggered={entranceComplete} /><br />
                  <ScrambleIn text="Architecture" delay={1000} triggered={entranceComplete} />
                </h1>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─────────────────── SECTION 2: CINEMATIC PERSPECTIVE TEXT ─────────────────── */}
      <section 
        ref={secondSectionRef}
        className="h-screen h-[100dvh] relative flex items-center justify-center bg-black overflow-hidden"
      >
        <video
          src={VIDEO_CINEMATIC}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none"
        />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#010103] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/45 z-1 pointer-events-none" />

        <div className="max-w-5xl mx-auto z-10 perspective-[400px]">
          <motion.p
            style={{
              rotateX: 24,
              y: translateY,
              z: 15,
              opacity: textOpacity,
              transformStyle: 'preserve-3d',
            }}
            className="font-mono font-normal text-[18px] sm:text-[24px] md:text-[30px] lg:text-[34px] text-white leading-[1.4] tracking-tight select-none px-6 sm:px-12 text-center uppercase"
          >
            A digital infrastructure built on the architecture of modern scalable systems. Vexor translates business rules into computational intelligence. Every latency is reduced, every schema is optimized, and every line is clean. We continuously reconstruct backend workflows as unified data systems.
          </motion.p>
        </div>
      </section>

      {/* ─────────────────── SECTION 3: METRICS ─────────────────── */}
      <section className="min-h-screen relative flex items-center justify-center bg-black py-28 px-6 overflow-hidden">
        <video
          src={VIDEO_METRICS}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-25 z-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/50 z-1 pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2 }}
            className="text-white text-xs sm:text-sm tracking-[0.25em] uppercase mb-16 font-semibold"
          >
            // Performance Metrics
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full">
            {[
              { val: '2.4ms', label: 'Average Server Latency' },
              { val: '99.99%', label: 'System Uptime Matrix' },
              { val: '50M+', label: 'Daily Requests Isolated' }
            ].map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.01] border border-white/5 backdrop-blur-sm"
              >
                <span className="text-white text-[clamp(44px,8vw,80px)] font-light tracking-tighter leading-none">
                  {metric.val}
                </span>
                <span className="text-white/40 text-[11px] mt-4 tracking-widest uppercase font-semibold">
                  {metric.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── SECTION 4: CAPABILITIES / ADAPTIVE INTEL ─────────────────── */}
      <section className="h-screen h-[100dvh] relative flex flex-col justify-between bg-black p-8 sm:p-12 md:p-16 overflow-hidden">
        <video
          src={VIDEO_TECH}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/60 z-1 pointer-events-none" />

        {/* Top Area */}
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start gap-6 mt-16 md:mt-10">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
            className="text-white font-light text-[clamp(28px,6vw,56px)] leading-[1.0] tracking-tight uppercase"
          >
            Computational<br />Intelligence
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.5, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.2 }}
            className="text-white text-[12px] sm:text-xs leading-relaxed max-w-xs md:text-right pt-2 uppercase"
          >
            The system isolates structural bottlenecks within 72 hours of telemetry integration. From there, execution paths are mapped, balanced, and automated.
          </motion.p>
        </div>

        {/* Bottom Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full mb-10"
        >
          {[
            { title: 'Cloud Orchestration', desc: 'Real-time automated container balancing and server scaling.' },
            { title: 'Database Tuning', desc: 'Indexing, query caching, and lock reduction under heavy writes.' },
            { title: 'Microservices Routing', desc: 'Zero-trust gRPC endpoints with stateful request balancing.' },
            { title: 'Feedback Telemetry', desc: 'Real-time resource tracking and performance anomaly isolation.' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="space-y-2 text-left"
            >
              <h3 className="text-white text-xs sm:text-sm font-semibold uppercase">{item.title}</h3>
              <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─────────────────── SECTION 5: DYNAMIC VEXOR SERVICES ─────────────────── */}
      <section className="min-h-screen relative flex items-center justify-center bg-black py-28 px-6">
        <div className="max-w-3xl mx-auto w-full relative z-10 text-center space-y-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.0 }}
            className="space-y-6"
          >
            <span className="text-white/40 text-xs sm:text-sm tracking-[0.25em] uppercase font-bold">// Architecture</span>
            <h2 className="text-white font-light text-[clamp(24px,5vw,48px)] leading-[1.15] tracking-tight uppercase">
              Modular Layers. Zero Friction.
            </h2>
            <p className="text-white/45 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto uppercase">
              Our core capabilities cover the entire systems engineering stack, from raw backend data pipelines to interactive client-side logic layer operations.
            </p>
          </motion.div>

          {/* Stacked Cards Grid representing Services */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="space-y-4 max-w-lg mx-auto w-full"
          >
            {isLoading ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner />
              </div>
            ) : services.length > 0 ? (
              services.map((service, idx) => (
                <Link
                  key={service._id}
                  to={`/services/${service.slug || service._id}`}
                  className="border border-white/10 hover:border-white/30 rounded-xl flex items-center justify-between px-6 py-4.5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 w-full group cursor-pointer"
                >
                  <span className="text-white/30 text-[10px] tracking-wider uppercase font-semibold">
                    Layer 0{idx + 1}
                  </span>
                  <span className="text-white text-sm sm:text-base font-light uppercase tracking-tight group-hover:translate-x-[-4px] transition-transform">
                    {service.serviceName}
                  </span>
                </Link>
              ))
            ) : (
              <div className="text-white/40 text-xs py-8 uppercase tracking-widest border border-white/5 rounded-xl">
                No active services indexed.
              </div>
            )}
          </motion.div>

        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer className="bg-black border-t border-white/10 overflow-hidden relative z-10 w-full">
        <div className="flex flex-col md:flex-row min-h-[380px] w-full">
          {/* Left Block: Background Loop Video */}
          <div className="w-full md:w-1/2 h-[220px] md:h-auto relative overflow-hidden bg-white/[0.01]">
            <video
              src={VIDEO_FOOTER}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
          </div>

          {/* Right Block: Brand Info */}
          <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-14 bg-[#020202]">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white/70">
                <SynapseXLogo className="w-5 h-5" />
                <span className="text-sm font-semibold tracking-widest uppercase">Vexor</span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-sm uppercase">
                The next evolution of digital engineering. Built for organizations that refuse to be limited by technical debt or modular constraints.
              </p>
            </div>
            
            <p className="text-white/25 text-[10px] tracking-wider uppercase mt-12 font-medium">
              &copy; {new Date().getFullYear()} Vexor IT Solutions. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </PageShell>
  );
}
