/**
 * Shared design tokens extracted from HeroSection.
 * Import this into every page/component that needs the liquid-glass aesthetic.
 */

export const GLASS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap');

  .liquid-glass {
    background: rgba(255,255,255,0.01);
    background-blend-mode: luminosity;
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border: none;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
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

  .liquid-glass-strong {
    background: rgba(255,255,255,0.01);
    background-blend-mode: luminosity;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: none;
    box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15);
    position: relative;
    overflow: hidden;
  }

  .liquid-glass-strong::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.4px;
    background: linear-gradient(
      180deg,
      rgba(255,255,255,0.5) 0%,
      rgba(255,255,255,0.2) 20%,
      rgba(255,255,255,0)   40%,
      rgba(255,255,255,0)   60%,
      rgba(255,255,255,0.2) 80%,
      rgba(255,255,255,0.5) 100%
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  /* Serif display font utility */
  .font-serif-display {
    font-family: 'Instrument Serif', serif;
  }

  .font-body-barlow {
    font-family: 'Barlow', sans-serif;
  }

  /* ── Admin Dark Panel Overrides ──────────────────────────────────────── */
  /* Force all global light-mode glass classes to render dark inside admin */
  .admin-dark-panel .glass-effect,
  .admin-dark-panel .glass-card,
  .admin-dark-panel .glass-card-hover {
    background: rgba(255,255,255,0.03) !important;
    border: 1px solid rgba(255,255,255,0.07) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    color: rgba(255,255,255,0.85) !important;
    box-shadow: none !important;
  }

  .admin-dark-panel .glass-effect::before,
  .admin-dark-panel .glass-card::before {
    display: none !important;
  }

  .admin-dark-panel .text-foreground {
    color: rgba(255,255,255,0.85) !important;
  }

  .admin-dark-panel .text-foreground\\/40,
  .admin-dark-panel .text-foreground\\/60 {
    color: rgba(255,255,255,0.4) !important;
  }

  .admin-dark-panel .futuristic-button {
    background: rgba(255,255,255,0.06) !important;
    border: 1px solid rgba(255,255,255,0.12) !important;
    color: rgba(255,255,255,0.8) !important;
  }

  .admin-dark-panel .futuristic-button:hover {
    background: rgba(255,255,255,0.10) !important;
    color: #fff !important;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

/** Inline style for a liquid-glass card (no ::before trick needed for divs with border-radius) */
export const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), inset 0 -1px 1px rgba(255,255,255,0.04)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
};

/** Stronger glass for cards that sit on pure black */
export const glassCardBordered: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export const SERIF: React.CSSProperties = { fontFamily: "'Instrument Serif', serif" };

export const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4';

export const CALENDLY_URL = 'https://calendly.com/abhayrana8272?hide_gdpr_banner=1&hide_landing_page=1';
