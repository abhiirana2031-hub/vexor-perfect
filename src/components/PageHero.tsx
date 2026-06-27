import React from 'react';
import { motion } from 'framer-motion';
import { SERIF } from '@/lib/design';
import BlurText from '@/components/BlurText';
import FadingVideo from '@/components/FadingVideo';

interface PageHeroProps {
  label?: string;
  title: string;
  titleItalic?: string;
  subtitle?: string;
  center?: boolean;
  videoSrc?: string;
}

/**
 * Reusable dark page hero — Instrument Serif heading using BlurText word-by-word transition.
 * Supports an optional background video for a highly cinematic hero section.
 */
export default function PageHero({ label, title, titleItalic, subtitle, center = false, videoSrc }: PageHeroProps) {
  const fullTitle = titleItalic ? `${title} ${titleItalic}` : title;

  return (
    <section className={`relative w-full pt-40 pb-28 px-6 border-b border-white/5 overflow-hidden ${center ? 'text-center' : ''}`}>
      {/* Background Video */}
      {videoSrc ? (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FadingVideo
            src={videoSrc}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle gradient vignette to blend with the pure black page body */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
      ) : (
        /* Subtle radial glow if no video */
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        {label && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium">{label}</span>
          </motion.div>
        )}

        <div className="text-left mb-6">
          <BlurText
            text={fullTitle}
            className="text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05] justify-start text-left"
            style={{
              justifyContent: 'flex-start',
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
            }}
          />
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/50 text-base leading-relaxed max-w-xl text-left"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
