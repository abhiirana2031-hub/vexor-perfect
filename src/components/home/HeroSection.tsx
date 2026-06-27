import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Instagram, Twitter, Globe, Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Liquid Glass CSS + Google Font — injected once via <style>
───────────────────────────────────────────────────────────── */
const GLASS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

  .liquid-glass {
    background: rgba(255, 255, 255, 0.01);
    background-blend-mode: luminosity;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .liquid-glass::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.45) 0%,
      rgba(255,255,255,0.15) 20%,
      rgba(255,255,255,0)    40%,
      rgba(255,255,255,0)    60%,
      rgba(255,255,255,0.15) 80%,
      rgba(255,255,255,0.45) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

/* ─────────────────────────────────────────────────────────────
   RAF-based fade — resumes from current opacity, cancels
   any competing animation before starting
───────────────────────────────────────────────────────────── */
function fadeVideo(
  videoEl: HTMLVideoElement,
  targetOpacity: number,
  duration: number,
  rafRef: React.MutableRefObject<number | null>,
  onComplete?: () => void
) {
  if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  const startOpacity =
    videoEl.style.opacity === '' ? 0 : parseFloat(videoEl.style.opacity);
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    videoEl.style.opacity = String(
      startOpacity + (targetOpacity - startOpacity) * progress
    );
    if (progress < 1) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      rafRef.current = null;
      onComplete?.();
    }
  }
  rafRef.current = requestAnimationFrame(step);
}

/* ─────────────────────────────────────────────────────────────
   Nav links shared between desktop & mobile
───────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Work' },
  { path: '/about', label: 'About' },
  { path: '/blogs', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const rafRef      = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  /* ── Video fade logic ─────────────────────────────────────── */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.style.opacity = '0';
      fadeVideo(video, 1, 500, rafRef);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeVideo(video, 0, 500, rafRef);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      fadingOutRef.current = false;
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadeVideo(video, 1, 500, rafRef);
      }, 100);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    if (video.readyState >= 3) handleCanPlay();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{GLASS_STYLES}</style>

      {/* ── Root ── */}
      <div className="min-h-screen bg-black overflow-hidden relative flex flex-col">

        {/* ── Background Video ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            autoPlay
            muted
            playsInline
            loop={false}
            className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
            style={{ opacity: 0 }}
          />
          {/* Cinematic vignette layers */}
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        </div>

        {/* ─────────────────── NAVBAR ─────────────────── */}
        <nav className="relative z-20 pl-6 pr-6 py-6">
          <div className="liquid-glass rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                <img src="/vexor-logo.png" alt="Vexor Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Vexor<span className="text-white/50 font-normal"> IT</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="text-white/70 text-sm font-medium hover:text-white transition-colors cursor-pointer"
              >
                Get in Touch
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                Start Project <ChevronRight size={14} />
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden liquid-glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="liquid-glass mt-3 rounded-3xl px-6 py-5 max-w-5xl mx-auto flex flex-col gap-4 md:hidden"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium py-1 transition-colors ${
                      isActive(link.path) ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="w-full liquid-glass rounded-full py-3 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Start a Project <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* ─────────────────── HERO CONTENT ─────────────────── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">

          {/* Tag pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="liquid-glass rounded-full px-4 py-1.5 text-white/70 text-xs font-medium mb-6 inline-flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Web Development &amp; IT Solutions
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            We Build Digital<br />
            <span className="italic text-white/80">Experiences</span>
          </motion.h1>

          {/* Email / CTA bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="max-w-xl w-full space-y-4"
          >
            {/* Email subscribe bar */}
            <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your work email"
                className="flex-1 bg-transparent text-white placeholder:text-white/40 text-base outline-none min-w-0"
              />
              <button
                onClick={() => navigate('/profile')}
                className="bg-white rounded-full p-3 text-black flex-shrink-0 hover:bg-white/90 transition-colors cursor-pointer"
                aria-label="Get started"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-white/70 text-sm leading-relaxed px-4">
              From custom web applications to enterprise IT infrastructure — we turn your
              boldest ideas into production-ready software. Trusted by 200+ businesses worldwide.
            </p>

            {/* Secondary CTA */}
            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={() => navigate('/services')}
                className="liquid-glass rounded-full px-7 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
              >
                Explore Services
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="liquid-glass rounded-full px-7 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer"
              >
                View Our Work
              </button>
            </div>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.55 }}
            className="mt-10 flex items-center gap-8 text-white/50 text-xs font-medium"
          >
            {[
              { value: '500+', label: 'Projects Delivered' },
              { value: '200+', label: 'Happy Clients' },
              { value: '15+', label: 'Years Experience' },
            ].map(({ value, label }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="w-px h-8 bg-white/15" />}
                <div className="text-center">
                  <div className="text-white text-xl font-semibold" style={{ fontFamily: "'Instrument Serif', serif" }}>{value}</div>
                  <div className="text-[10px] uppercase tracking-widest mt-0.5">{label}</div>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>

        {/* ─────────────────── SOCIAL FOOTER ─────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="relative z-10 flex justify-center gap-4 pb-12"
        >
          <a
            href="#"
            aria-label="Instagram"
            className="liquid-glass rounded-full p-4 text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Instagram size={20} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="liquid-glass rounded-full p-4 text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Twitter size={20} />
          </a>
          <a
            href="#"
            aria-label="Website"
            className="liquid-glass rounded-full p-4 text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={20} />
          </a>
        </motion.div>

      </div>
    </>
  );
}
