import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { GLASS_STYLES } from '@/lib/design';

interface PageShellProps {
  children: React.ReactNode;
  /** Additional classes on the outer wrapper */
  className?: string;
}

/**
 * Wraps every inner page with the dark bg, shared Navbar and Footer.
 * HomePage does NOT use this — it uses HeroSection which owns its own nav.
 */
export default function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <>
      <style>{GLASS_STYLES}</style>
      <div className={`min-h-screen bg-black text-white overflow-x-hidden ${className}`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
