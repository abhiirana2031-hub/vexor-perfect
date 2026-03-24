import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-secondary/20">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <Image
              src="/vexor-logo.png"
              alt="Vexor Logo"
              width={40}
              height={40}
              className="w-8 sm:w-10 h-8 sm:h-10 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-heading text-lg sm:text-2xl font-bold text-primary-foreground group-hover:text-secondary transition-colors duration-300">VEXOR</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base font-medium transition-colors duration-300 relative group ${
                  isActive(link.path) ? 'text-secondary' : 'text-foreground hover:text-secondary'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link to="/contact">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm lg:text-base">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-foreground hover:text-secondary transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 sm:h-6 w-5 sm:w-6" /> : <Menu className="h-5 sm:h-6 w-5 sm:w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-soft-shadow-gray/95 backdrop-blur-lg border-t border-secondary/20"
          >
            <nav className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block font-paragraph text-base sm:text-lg font-medium py-2 transition-colors duration-300 ${
                    isActive(link.path) ? 'text-secondary' : 'text-foreground hover:text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 mt-3 sm:mt-4 text-sm sm:text-base">
                  Get Started
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
