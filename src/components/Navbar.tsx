import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { GLASS_STYLES } from '@/lib/design';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Work' },
  { path: '/about', label: 'About' },
  { path: '/blogs', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // Hide on homepage — HeroSection owns its nav
  if (isHome) return null;

  return (
    <>
      <style>{GLASS_STYLES}</style>
      <nav className="fixed top-0 inset-x-0 z-50 px-6 pt-5">
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
              <Link key={link.path} to={link.path}
                className={`text-sm font-medium transition-colors ${isActive(link.path) ? 'text-white' : 'text-white/55 hover:text-white'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/contact')}
              className="text-white/60 text-sm font-medium hover:text-white transition-colors cursor-pointer">
              Get in Touch
            </button>
            <button onClick={() => navigate('/profile')}
              className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5">
              Start Project <ChevronRight size={14} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden liquid-glass rounded-full p-2.5 text-white/70 hover:text-white transition-colors cursor-pointer">
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
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-glass mt-3 rounded-3xl px-6 py-5 max-w-5xl mx-auto flex flex-col gap-4 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium py-1 transition-colors ${isActive(link.path) ? 'text-white' : 'text-white/55'}`}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                <button onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                  className="w-full liquid-glass rounded-full py-3 text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
                  Start a Project <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
