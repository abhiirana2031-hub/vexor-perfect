import React, { useEffect, useRef } from 'react';

interface FadingVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

export default function FadingVideo({ src, className = '', style = {} }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  const fadeTo = (target: number, duration: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const startOpacity = video.style.opacity === '' ? 0 : parseFloat(video.style.opacity);
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      video.style.opacity = String(startOpacity + (target - startOpacity) * progress);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fallbackTimer: NodeJS.Timeout;

    const triggerPlayAndFade = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      video.play().catch(() => {});
      fadeTo(1, FADE_MS);
    };

    const handleLoadedData = () => {
      video.style.opacity = '0';
      triggerPlayAndFade();
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_LEAD && remaining > 0 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeTo(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        if (!video) return;
        video.currentTime = 0;
        fadingOutRef.current = false;
        video.play().catch(() => {});
        fadeTo(1, FADE_MS);
      }, 100);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    // Set a 1.5s fallback in case loadeddata event delays or fails to trigger
    fallbackTimer = setTimeout(() => {
      if (video.style.opacity === '0' || video.style.opacity === '') {
        triggerPlayAndFade();
      }
    }, 1500);

    // If already loaded / playing
    if (video.readyState >= 3) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      preload="auto"
      className={className}
      style={{
        ...style,
        opacity: 0,
      }}
    />
  );
}
