import React, { useEffect, useRef } from 'react';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260616_212935_bbf608da-62d1-4f25-9be4-c346e4d09cc8.mp4';

export default function VeldaraBackground() {
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ===================== LIGHT PARTICLES =====================
    const pCanvas = particlesRef.current;
    if (!pCanvas) return;
    const pCtx = pCanvas.getContext('2d');
    if (!pCtx) return;

    let isActive = true;
    let particlesList: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const createParticles = () => {
      particlesList = [];
      const count = Math.floor((pCanvas.width * pCanvas.height) / 25000); // reduced particle count for maximum optimization
      for (let i = 0; i < count; i++) {
        particlesList.push({
          x: Math.random() * pCanvas.width,
          y: Math.random() * pCanvas.height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.0 + 0.3,
          opacity: Math.random() * 0.4 + 0.1,
        });
      }
    };

    const resizeParticles = () => {
      pCanvas.width = window.innerWidth;
      pCanvas.height = window.innerHeight;
      createParticles();
    };

    const animateParticles = () => {
      if (!isActive) return;
      pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      for (const p of particlesList) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        pCtx.fill();
      }
      requestAnimationFrame(animateParticles);
    };

    resizeParticles();
    window.addEventListener('resize', resizeParticles);
    animateParticles();

    return () => {
      isActive = false;
      window.removeEventListener('resize', resizeParticles);
    };
  }, []);

  return (
    <>
      {/* Scroll Video Background Container - Lightweight Native Loop */}
      <div 
        className="fixed inset-0 pointer-events-none" 
        style={{
          zIndex: -10,
          background: '#020202',
        }}
      >
        <video 
          muted 
          playsInline 
          preload="auto" 
          autoPlay
          loop
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />
      </div>

      {/* Particles Canvas */}
      <canvas 
        ref={particlesRef} 
        className="fixed inset-0 pointer-events-none w-full h-full"
        style={{ zIndex: 1 }}
      />
    </>
  );
}
