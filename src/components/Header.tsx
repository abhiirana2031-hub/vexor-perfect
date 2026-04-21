import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

interface CurrentUser {
  _id: string;
  email: string;
  fullName: string;
  profilePhoto?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for logged-in user and listen to storage changes
  useEffect(() => {
    const checkUser = () => {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user._id) {
            setCurrentUser(user);
          } else {
            setCurrentUser(null);
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          localStorage.removeItem('currentUser');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    // Check on mount
    checkUser();

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', checkUser);
    
    // Listen for custom event from same tab updates
    window.addEventListener('userUpdated', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userUpdated', checkUser);
    };
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/projects', label: 'Projects' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-effect !rounded-full px-6 md:px-8 py-3 flex items-center justify-between lg:justify-start gap-4 md:gap-12 border-white/10 shadow-soft-depth w-full max-w-[95%] lg:max-w-[90%]"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center overflow-hidden shrink-0">
            <img src="/vexor-logo.png" alt="Vexor Logo" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-heading text-lg md:text-xl font-black tracking-tighter text-foreground group-hover:text-secondary transition-colors whitespace-nowrap">
            VEXOR <span className="text-secondary opacity-60 font-medium hidden sm:inline">IT SOLUTIONS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${
                isActive(link.path) ? 'text-secondary' : 'text-foreground/40 hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div layoutId="nav-pill-active" className="absolute -bottom-1 left-0 right-0 h-px bg-secondary shadow-neon-cyan" />
              )}
            </Link>
          ))}
        </nav>

        {/* Action Button / User Profile */}
        <div className="hidden lg:flex items-center">
          {currentUser ? (
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40 group-hover:text-secondary transition-colors">Authenticated User</span>
                <span className="text-[11px] font-black text-foreground truncate max-w-[120px] uppercase tracking-tighter">{currentUser.fullName}</span>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-secondary/20 group-hover:border-secondary shadow-soft-depth transition-all p-0.5 overflow-hidden">
                {currentUser.profilePhoto ? (
                  <img src={currentUser.profilePhoto} alt="profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center rounded-full text-secondary">
                     <User size={16} />
                  </div>
                )}
              </div>
            </Link>
          ) : (
            <button 
              onClick={() => navigate('/profile')}
              className="px-6 py-2 rounded-full bg-secondary text-black text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-neon-cyan transition-all duration-500"
            >
              Get Started
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-full glass-effect flex items-center justify-center text-foreground/40 hover:text-secondary transition-all border-white/10"
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-[calc(100%+1rem)] left-0 right-0 glass-effect !rounded-[2rem] p-8 border-white/10 shadow-soft-depth flex flex-col gap-6 lg:hidden z-50 bg-[#0a0a0f]/95"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-black uppercase tracking-[0.3em] transition-all ${
                    isActive(link.path) ? 'text-secondary translate-x-4' : 'text-foreground/40 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isActive(link.path) && <div className="w-2 h-2 rounded-full bg-secondary shadow-neon-cyan" />}
                    {link.label}
                  </div>
                </Link>
              ))}
              
              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full py-4 rounded-xl bg-secondary text-black text-[10px] font-black uppercase tracking-widest shadow-neon-cyan"
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
