import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { UserProfiles, Projects } from '@/entities';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Shield, Key, EyeOff, Eye, Star, Mail, Building2, Briefcase, 
  Globe, X, Phone, Camera, ArrowRight, LogOut, User, Edit3, Check, 
  QrCode, Lock, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

// ─── Glassmorphism Styles ────────────────────────────────────────────────────
const PAGE_STYLES = `
  .vx-glass {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .vx-input {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.10);
    color: #fff;
    outline: none;
    transition: border-color 0.2s;
  }
  .vx-input:focus {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.05);
  }
  .vx-input::placeholder { color: rgba(255,255,255,0.25); }
  .vx-btn-primary {
    background: #fff;
    color: #000;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: background 0.2s, transform 0.2s;
  }
  .vx-btn-primary:hover { background: rgba(255,255,255,0.88); }
  .vx-tab-active {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.15);
    color: #fff;
  }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

type Tab = 'login' | 'register' | 'profile' | 'security' | 'qr';

export default function UserProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [currentUser, setCurrentUser] = useState<UserProfiles | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userProjects, setUserProjects] = useState<Projects[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showQR, setShowQR] = useState(false);

  // Login
  const [loginForm, setLoginForm] = useState({ email: '', password: '', phoneNumber: '', usePhone: false });
  const [loginError, setLoginError] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Register
  const [registerForm, setRegisterForm] = useState({
    fullName: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
    company: '', jobTitle: '', usePhone: false
  });
  const [registerError, setRegisterError] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);

  // Profile edit
  const [profileForm, setProfileForm] = useState({ fullName: '', bio: '', company: '', jobTitle: '', websiteUrl: '', phoneNumber: '' });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore session
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setProfileForm({ fullName: user.fullName || '', bio: user.bio || '', company: user.company || '', jobTitle: user.jobTitle || '', websiteUrl: user.websiteUrl || '', phoneNumber: user.phoneNumber || '' });
        if (user.profilePhoto) setProfileImage(user.profilePhoto);
        setActiveTab('profile');
        loadProjects(user._id);
      } catch { }
    }
  }, []);

  const loadProjects = async (userId: string) => {
    try {
      const all = await BaseCrudService.getAll<Projects>('projects');
      setUserProjects(all.items.filter(p => p.userId === userId));
    } catch { }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const b64 = await fileToBase64(file);
      setProfileImage(b64);
    } catch { } finally { setUploadingImage(false); }
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError('');
    if (loginForm.usePhone ? !loginForm.phoneNumber : !loginForm.email) {
      setLoginError('Please enter your credentials'); return;
    }
    if (!loginForm.password) { setLoginError('Password is required'); return; }

    setIsLoading(true);
    try {
      const ADMIN_EMAIL = import.meta.env.PUBLIC_ADMIN_EMAIL || 'abhayrana8272@gmail.com';
      const ADMIN_PASSWORD = import.meta.env.PUBLIC_ADMIN_PASSWORD || 'vexor@#005';
      if (loginForm.email === ADMIN_EMAIL && loginForm.password === ADMIN_PASSWORD) {
        const adminUser: UserProfiles = { _id: 'admin-root', fullName: 'Vexor Administrator', email: ADMIN_EMAIL, role: 'admin', _createdDate: new Date() };
        setCurrentUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.dispatchEvent(new Event('userUpdated'));
        setActiveTab('profile');
        return;
      }
      const users = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const user = loginForm.usePhone
        ? users.items.find(u => u.phoneNumber === loginForm.phoneNumber)
        : users.items.find(u => u.email === loginForm.email);
      if (!user) { setLoginError('Account not found. Please register.'); return; }
      if (user.passwordHash !== loginForm.password) { setLoginError('Invalid password'); return; }
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.dispatchEvent(new Event('userUpdated'));
      setProfileForm({ fullName: user.fullName || '', bio: user.bio || '', company: user.company || '', jobTitle: user.jobTitle || '', websiteUrl: user.websiteUrl || '', phoneNumber: user.phoneNumber || '' });
      if (user.profilePhoto) setProfileImage(user.profilePhoto);
      setActiveTab('profile');
      loadProjects(user._id!);
    } catch { setLoginError('Connection error. Please try again.'); }
    finally { setIsLoading(false); }
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    setRegisterError('');
    if (!registerForm.fullName) { setRegisterError('Full name is required'); return; }
    if (!registerForm.usePhone && !registerForm.email) { setRegisterError('Email is required'); return; }
    if (registerForm.usePhone && !registerForm.phoneNumber) { setRegisterError('Phone number is required'); return; }
    if (!registerForm.password) { setRegisterError('Password is required'); return; }
    if (registerForm.password !== registerForm.confirmPassword) { setRegisterError('Passwords do not match'); return; }
    if (registerForm.password.length < 6) { setRegisterError('Password must be 6+ characters'); return; }

    setIsLoading(true);
    try {
      const existing = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      const dup = registerForm.usePhone
        ? existing.items.find(u => u.phoneNumber === registerForm.phoneNumber)
        : existing.items.find(u => u.email === registerForm.email);
      if (dup) { setRegisterError('Account already exists. Please login.'); return; }

      const newUser: UserProfiles = {
        _id: crypto.randomUUID(),
        email: registerForm.usePhone ? undefined : registerForm.email,
        phoneNumber: registerForm.usePhone ? registerForm.phoneNumber : undefined,
        fullName: registerForm.fullName,
        passwordHash: registerForm.password,
        company: registerForm.company || undefined,
        jobTitle: registerForm.jobTitle || undefined,
        isVerified: false,
        loginMethod: registerForm.usePhone ? 'phone' : 'email',
        _createdDate: new Date()
      };
      await BaseCrudService.create('userprofiles', newUser);
      setCurrentUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      window.dispatchEvent(new Event('userUpdated'));
      setActiveTab('profile');
    } catch { setRegisterError('Registration failed. Please try again.'); }
    finally { setIsLoading(false); }
  };

  // ── Profile Update ─────────────────────────────────────────────────────────
  const handleProfileUpdate = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updated: UserProfiles = { ...currentUser, ...profileForm, profilePhoto: profileImage || undefined, _updatedDate: new Date() };
      await BaseCrudService.update('userprofiles', updated);
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
      window.dispatchEvent(new Event('userUpdated'));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch { alert('Failed to update profile'); }
    finally { setIsLoading(false); }
  };

  // ── Password Change ────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPwdError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPwdError('Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { setPwdError('Password must be 6+ characters'); return; }
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updated = { ...currentUser, passwordHash: passwordForm.newPassword, _updatedDate: new Date() };
      await BaseCrudService.update('userprofiles', updated);
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPwdFields(false);
      alert('Password updated successfully!');
    } catch { setPwdError('Failed to update password'); }
    finally { setIsLoading(false); }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('userUpdated'));
    setActiveTab('login');
    setProfileImage(null);
  };

  const qrValue = currentUser ? JSON.stringify({ type: 'user_id', id: currentUser._id }) : '';

  // Custom Chrome and Github SVGs for brand logins
  const ChromeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
      <line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
  );

  const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen w-full bg-black text-white selection:bg-white/30 flex p-2 lg:h-screen lg:overflow-hidden lg:p-4 relative">
        <style>{PAGE_STYLES}</style>
        
        {/* ── LEFT COLUMN (HERO) ──────────────────────────────────────────────── */}
        <div className="hidden lg:flex w-[52%] relative flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full select-none">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
              type="video/mp4"
            />
          </video>

          {/* Hero Content Container */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.15, delayChildren: 0.2 }
              }
            }}
            className="z-10 w-full max-w-xs space-y-8"
          >
            {/* Logo */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => window.location.href = '/'}
            >
              <img src="/vexor-logo.png" alt="Vexor Logo" className="w-6 h-6 object-contain" />
              <span className="text-xl font-semibold tracking-tight text-white">Vexor Control</span>
            </motion.div>

            {/* Heading block */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="space-y-3"
            >
              <h1 className="text-4xl font-medium tracking-tight text-white whitespace-nowrap">
                {activeTab === 'login' ? 'Welcome Back' : 'Join Vexor'}
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                {activeTab === 'login' 
                  ? 'Verify your credentials to initialize secure session.' 
                  : 'Follow these quick phases to activate operative console.'}
              </p>
            </motion.div>

            {/* Steps list */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
              className="space-y-3"
            >
              <div className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${activeTab === 'login' ? 'bg-white text-black border border-white' : 'bg-white/5 text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'login' ? 'bg-black text-white' : 'bg-white/10'}`}>1</div>
                <span className="text-xs font-semibold uppercase tracking-wider">Identity Verification</span>
              </div>
              <div className={`w-full rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${activeTab === 'register' ? 'bg-white text-black border border-white' : 'bg-white/5 text-white/50'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${activeTab === 'register' ? 'bg-black text-white' : 'bg-white/10'}`}>2</div>
                <span className="text-xs font-semibold uppercase tracking-wider">Console Registration</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN (FORM) ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
            className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
          >
            {/* Logo for mobile */}
            <div className="flex lg:hidden items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <img src="/vexor-logo.png" alt="Vexor" className="w-6 h-6 object-contain" />
                <span className="text-lg font-semibold tracking-tight text-white">Vexor</span>
              </a>
              <a href="/" className="text-xs text-white/40 hover:text-white uppercase tracking-wider">
                Home
              </a>
            </div>

            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight text-white">
                {activeTab === 'login' ? 'Sign In Credentials' : 'Create New Profile'}
              </h2>
              <p className="text-white/40 text-sm">
                {activeTab === 'login' ? 'Input your registered credentials.' : 'Input your operative details to register.'}
              </p>
            </div>

            {/* Social login buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => alert('Google authentication is handled via console integration')} className="flex items-center justify-center gap-3 w-full bg-black border border-white/10 rounded-2xl py-4 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer">
                <ChromeIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">Google</span>
              </button>
              <button onClick={() => alert('Github authentication is handled via console integration')} className="flex items-center justify-center gap-3 w-full bg-black border border-white/10 rounded-2xl py-4 hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer">
                <GithubIcon className="w-5 h-5 text-white" />
                <span className="text-sm font-medium text-white">GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-black px-6 text-[10px] font-bold text-white/40 uppercase tracking-[0.25em]">
                Or
              </span>
            </div>

            {/* Auth Form */}
            {activeTab === 'login' ? (
              <div className="space-y-5">
                {/* Method selector */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-2xl">
                  <button onClick={() => setLoginForm(f => ({ ...f, usePhone: false }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!loginForm.usePhone ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                    Email
                  </button>
                  <button onClick={() => setLoginForm(f => ({ ...f, usePhone: true }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${loginForm.usePhone ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                    Phone
                  </button>
                </div>

                {/* Input block */}
                {loginForm.usePhone ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Phone Number</label>
                    <input type="tel" placeholder="+91..." value={loginForm.phoneNumber}
                      onChange={e => setLoginForm(f => ({ ...f, phoneNumber: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Email Address</label>
                    <input type="email" placeholder="your@email.com" value={loginForm.email}
                      onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                )}

                {/* Password input */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Password</label>
                  <div className="relative">
                    <input type={showLoginPwd ? 'text' : 'password'} placeholder="••••••••••••" value={loginForm.password}
                      onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 pr-12 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                    <button type="button" onClick={() => setShowLoginPwd(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white focus:outline-none transition-colors">
                      {showLoginPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && <p className="text-red-400 text-xs pl-1">{loginError}</p>}

                <button onClick={handleLogin} disabled={isLoading}
                  className="w-full h-14 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all text-sm uppercase tracking-widest mt-6 cursor-pointer flex items-center justify-center gap-2">
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Full name input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Full Name</label>
                  <input type="text" placeholder="Marcus Chen" value={registerForm.fullName}
                    onChange={e => setRegisterForm(f => ({ ...f, fullName: e.target.value }))}
                    className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                </div>

                {/* Job Title & Company grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Job Title</label>
                    <input type="text" placeholder="Director" value={registerForm.jobTitle}
                      onChange={e => setRegisterForm(f => ({ ...f, jobTitle: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Company</label>
                    <input type="text" placeholder="Vexor Studio" value={registerForm.company}
                      onChange={e => setRegisterForm(f => ({ ...f, company: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                </div>

                {/* Method selector */}
                <div className="flex gap-1 p-1 bg-white/5 rounded-2xl">
                  <button onClick={() => setRegisterForm(f => ({ ...f, usePhone: false }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${!registerForm.usePhone ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                    Email
                  </button>
                  <button onClick={() => setRegisterForm(f => ({ ...f, usePhone: true }))}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${registerForm.usePhone ? 'bg-white text-black' : 'text-white/50 hover:text-white'}`}>
                    Phone
                  </button>
                </div>

                {/* Input field */}
                {registerForm.usePhone ? (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Phone Number</label>
                    <input type="tel" placeholder="+91..." value={registerForm.phoneNumber}
                      onChange={e => setRegisterForm(f => ({ ...f, phoneNumber: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Email Address</label>
                    <input type="email" placeholder="your@email.com" value={registerForm.email}
                      onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                  </div>
                )}

                {/* Password field */}
                <div className="flex flex-col gap-2 relative">
                  <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Password</label>
                  <div className="relative">
                    <input type={showRegPwd ? 'text' : 'password'} placeholder="••••••••••••" value={registerForm.password}
                      onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                      className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 pr-12 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                    <button type="button" onClick={() => setShowRegPwd(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white focus:outline-none transition-colors">
                      {showRegPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-white/40 pl-1">Confirm Password</label>
                  <input type="password" placeholder="••••••••••••" value={registerForm.confirmPassword}
                    onChange={e => setRegisterForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    className="w-full bg-white/5 border border-transparent rounded-2xl h-14 px-5 text-white placeholder:text-white/20 focus:border-white/20 focus:bg-white/[0.08] outline-none transition-all text-sm" />
                </div>

                {registerError && <p className="text-red-400 text-xs pl-1">{registerError}</p>}

                <button onClick={handleRegister} disabled={isLoading}
                  className="w-full h-14 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all text-sm uppercase tracking-widest mt-6 cursor-pointer flex items-center justify-center gap-2">
                  {isLoading ? 'Creating operative...' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Footer link toggle */}
            <div className="text-center pt-2">
              <p className="text-xs text-white/40">
                {activeTab === 'login' ? (
                  <>
                    New operative?{' '}
                    <button onClick={() => { setActiveTab('register'); setLoginError(''); }} className="text-white hover:underline font-semibold focus:outline-none cursor-pointer">
                      Register here
                    </button>
                  </>
                ) : (
                  <>
                    Operative credential holder?{' '}
                    <button onClick={() => { setActiveTab('login'); setRegisterError(''); }} className="text-white hover:underline font-semibold focus:outline-none cursor-pointer">
                      Log in
                    </button>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <style>{PAGE_STYLES}</style>
      <Navbar />

      <div className="pt-28 pb-20 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1 space-y-4">
                {/* Profile card */}
                <div className="vx-glass rounded-3xl p-6 text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative mx-auto w-24 h-24">
                    {profileImage ? (
                      <img src={profileImage} alt={currentUser.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-white/20" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                        <User className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                    <button onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Camera className="w-3.5 h-3.5 text-black" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-white">{currentUser.fullName}</h2>
                    {currentUser.jobTitle && <p className="text-sm text-white/50 mt-0.5">{currentUser.jobTitle}</p>}
                    {currentUser.company && <p className="text-xs text-white/30 mt-0.5">{currentUser.company}</p>}
                  </div>

                  {/* QR Code toggle */}
                  <button onClick={() => setShowQR(q => !q)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all">
                    <QrCode className="w-4 h-4" />
                    {showQR ? 'Hide QR' : 'My QR Code'}
                  </button>

                  <AnimatePresence>
                    {showQR && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="p-4 bg-white rounded-2xl">
                          <QRCodeCanvas value={qrValue} size={160} className="mx-auto" />
                          <p className="text-black/50 text-[9px] uppercase tracking-widest mt-2 text-center">Vexor Digital ID</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 text-white/30 hover:text-red-400 text-xs font-semibold uppercase tracking-wider transition-all">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>

                {/* Nav links */}
                <nav className="vx-glass rounded-2xl p-2 space-y-1">
                  {[
                    { id: 'profile', label: 'Edit Profile', icon: Edit3 },
                    { id: 'security', label: 'Security', icon: Lock },
                    { id: 'qr', label: 'Digital ID', icon: QrCode },
                  ].map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id as Tab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeTab === id ? 'bg-white/8 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                      <Icon className="w-4 h-4" />
                      {label}
                      <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
                    </button>
                  ))}
                </nav>
              </motion.aside>

              {/* Main content */}
              <motion.main initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3 space-y-6">

                <AnimatePresence mode="wait">

                  {/* ── Profile Edit ─────────────────────────────────────── */}
                  {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="vx-glass rounded-3xl p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-white">Edit Profile</h2>
                        {profileSaved && (
                          <span className="flex items-center gap-1.5 text-green-400 text-sm">
                            <Check className="w-4 h-4" /> Saved
                          </span>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: 'fullName', label: 'Full Name', type: 'text' },
                          { key: 'jobTitle', label: 'Job Title', type: 'text' },
                          { key: 'company', label: 'Company', type: 'text' },
                          { key: 'websiteUrl', label: 'Website', type: 'url' },
                          { key: 'phoneNumber', label: 'Phone', type: 'tel' },
                        ].map(({ key, label, type }) => (
                          <div key={key} className={key === 'fullName' ? 'sm:col-span-2' : ''}>
                            <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1.5">{label}</label>
                            <input type={type}
                              value={(profileForm as any)[key]}
                              onChange={e => setProfileForm(f => ({ ...f, [key]: e.target.value }))}
                              className="vx-input w-full rounded-xl px-4 py-3 text-sm" />
                          </div>
                        ))}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase tracking-widest text-white/30 mb-1.5">Bio</label>
                          <textarea value={profileForm.bio}
                            onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                            rows={4}
                            className="vx-input w-full rounded-xl px-4 py-3 text-sm resize-none" />
                        </div>
                      </div>

                      <button onClick={handleProfileUpdate} disabled={isLoading}
                        className="vx-btn-primary px-8 py-3.5 rounded-2xl text-sm disabled:opacity-50">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </motion.div>
                  )}

                  {/* ── Security ──────────────────────────────────────────── */}
                  {activeTab === 'security' && (
                    <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="vx-glass rounded-3xl p-8 space-y-6">
                      <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <Lock className="w-6 h-6 text-white/40" /> Security
                      </h2>

                      <div className="border border-white/8 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-white">Change Password</h3>
                            <p className="text-sm text-white/40 mt-0.5">Update your account password</p>
                          </div>
                          <button onClick={() => setShowPwdFields(p => !p)}
                            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all">
                            {showPwdFields ? 'Cancel' : 'Change'}
                          </button>
                        </div>

                        <AnimatePresence>
                          {showPwdFields && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3 pt-2">
                              <input type="password" placeholder="New Password" value={passwordForm.newPassword}
                                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                                className="vx-input w-full rounded-xl px-4 py-3 text-sm" />
                              <input type="password" placeholder="Confirm Password" value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                className="vx-input w-full rounded-xl px-4 py-3 text-sm" />
                              {pwdError && <p className="text-red-400 text-sm">{pwdError}</p>}
                              <button onClick={handleChangePassword} disabled={isLoading}
                                className="vx-btn-primary px-6 py-3 rounded-xl text-sm disabled:opacity-50">
                                {isLoading ? 'Updating...' : 'Update Password'}
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Account info */}
                      <div className="border border-white/8 rounded-2xl p-6 space-y-3">
                        <h3 className="font-semibold text-white">Account Details</h3>
                        <div className="grid sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-white/30 text-xs uppercase tracking-wider">Email</span>
                            <p className="text-white mt-1">{currentUser.email || '—'}</p>
                          </div>
                          <div>
                            <span className="text-white/30 text-xs uppercase tracking-wider">Role</span>
                            <p className="text-white mt-1 capitalize">{currentUser.role || 'User'}</p>
                          </div>
                          <div>
                            <span className="text-white/30 text-xs uppercase tracking-wider">Member Since</span>
                            <p className="text-white mt-1">
                              {currentUser._createdDate ? new Date(currentUser._createdDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-white/30 text-xs uppercase tracking-wider">Status</span>
                            <p className="text-green-400 mt-1">{currentUser.isVerified ? 'Verified' : 'Unverified'}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ── QR / Digital ID ───────────────────────────────────── */}
                  {activeTab === 'qr' && (
                    <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="vx-glass rounded-3xl p-8 space-y-6 text-center">
                      <div>
                        <h2 className="text-2xl font-semibold text-white mb-1">Digital Identity</h2>
                        <p className="text-white/40 text-sm">Share this QR code to be verified by Vexor admins</p>
                      </div>
                      <div className="inline-block p-6 bg-white rounded-3xl shadow-2xl">
                        <QRCodeCanvas value={qrValue} size={220} />
                      </div>
                      <div className="vx-glass rounded-2xl p-5 text-left space-y-3 max-w-sm mx-auto">
                        <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                          <Shield className="w-4 h-4" /> Identity Token
                        </div>
                        <p className="text-white font-semibold">{currentUser.fullName}</p>
                        <p className="text-white/40 text-sm font-mono break-all text-xs">{currentUser._id}</p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>

                {/* Projects */}
                {activeTab === 'profile' && userProjects.length > 0 && (
                  <div className="vx-glass rounded-3xl p-8 space-y-4">
                    <h3 className="font-semibold text-white">Assigned Projects</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {userProjects.map(p => (
                        <div key={p._id} className="border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-colors">
                          <h4 className="font-semibold text-white text-sm">{p.projectName}</h4>
                          <p className="text-white/40 text-xs mt-1 line-clamp-2">{p.shortDescription}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.main>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
