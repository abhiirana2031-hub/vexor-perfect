import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * Ambient Cursor - A subtle, high-fidelity cursor glow that follows the mouse with spring physics.
 * Prioritizes high-end visuals with background blur and gradient.
 */
export const AmbientCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInViewport, setIsMouseInViewport] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMouseInViewport(true);
    };

    const handleMouseLeave = () => setIsMouseInViewport(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isMouseInViewport) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,217,255,0.08)_0%,transparent_70%)] mix-blend-screen z-[100] blur-3xl"
      animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20, restDelta: 0.001 }}
    />
  );
};

/**
 * Depth Scroll - A minimalist scroll progress bar that glows.
 */
export const DepthScroll = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-secondary via-white to-secondary origin-left z-[1000] shadow-[0_0_10px_rgba(0,217,255,0.5)]"
      style={{ scaleX }}
    />
  );
};

/**
 * Minimalist Heading - Styled for "Futuristic Minimalism with Depth".
 */
export const SectionHeading = ({ 
  subtitle, 
  title, 
  highlight, 
  description, 
  align = "center" 
}: { 
  subtitle: string; 
  title: string; 
  highlight?: string; 
  description?: string;
  align?: "left" | "center" | "right";
}) => {
  return (
    <div className={`mb-16 sm:mb-24 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-md mb-8"
      >
        <Sparkles className="w-3 h-3 text-secondary animate-pulse" />
        <span className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/60">
          {subtitle}
        </span>
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="font-heading text-4xl sm:text-5xl md:text-7xl font-black text-foreground tracking-tighter leading-[0.9] mb-8"
      >
        {title}<br />
        {highlight && (
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-white to-secondary animate-text-shimmer bg-[length:200%_auto]">
            {highlight}
          </span>
        )}
      </motion.h2>
      
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`font-paragraph text-lg md:text-xl text-foreground/40 max-w-2xl leading-relaxed font-medium ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
};

/**
 * Stat Counter - Glassmorphic stat visualization.
 */
export const StatCounter = ({ end, duration = 2, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsInView(true);
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    
    let current = 0;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="glass-card flex flex-col items-center justify-center p-8 space-y-4 hover:bg-white/[0.04] transition-colors group">
      <motion.div 
        className="text-5xl md:text-6xl font-black text-foreground tracking-tighter"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <span className="group-hover:text-secondary transition-colors">{count}</span>
        <span className="text-secondary">{suffix}</span>
      </motion.div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 border-t border-white/5 pt-4 w-full text-center">
        {label}
      </p>
    </div>
  );
};
