import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
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
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-soft-shadow-gray transition-colors duration-300"
                >
                  {currentUser.profilePhoto ? (
                    <Image
                      src={currentUser.profilePhoto}
                      alt={currentUser.fullName}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover border-2 border-secondary"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                      {currentUser.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-foreground">{currentUser.fullName.split(' ')[0]}</span>
                    <span className="text-xs text-foreground/60">Profile</span>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-soft-shadow-gray border border-secondary/20 rounded-lg shadow-lg z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-foreground hover:bg-background/50 rounded-t-lg transition-colors"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={() => {
                          localStorage.removeItem('currentUser');
                          window.dispatchEvent(new Event('userUpdated'));
                          setCurrentUser(null);
                          setShowProfileMenu(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-destructive hover:bg-background/50 rounded-b-lg transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/profile">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 hover:scale-105 text-sm lg:text-base">
                  Get Started
                </Button>
              </Link>
            )}
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
              
              {/* Mobile Profile Section */}
              <div className="border-t border-secondary/20 pt-4 mt-4">
                {currentUser ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-background/50 transition-colors"
                    >
                      {currentUser.profilePhoto ? (
                        <Image
                          src={currentUser.profilePhoto}
                          alt={currentUser.fullName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover border-2 border-secondary"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                          {currentUser.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{currentUser.fullName}</span>
                        <span className="text-xs text-foreground/60">View Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('currentUser');
                        window.dispatchEvent(new Event('userUpdated'));
                        setCurrentUser(null);
                        setIsMenuOpen(false);
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-destructive hover:bg-background/50 rounded-lg transition-colors flex items-center gap-2 mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 sm:px-6 py-2 sm:py-3 font-semibold rounded-lg transition-all duration-300 text-sm sm:text-base">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
