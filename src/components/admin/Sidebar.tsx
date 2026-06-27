import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Cpu, 
  MessageSquare, 
  Users, 
  Star, 
  Mail, 
  LogOut,
  TrendingUp,
  FileText,
  QrCode,
  Shield,
  Camera,
  Check,
  X,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GLASS_STYLES, SERIF } from '@/lib/design';

interface SidebarProps {
  onSetActiveTab: (tab: string) => void;
  activeTab: string;
}

const menuItems = [
  { id: 'stats', label: 'Ecosystem Analytics', icon: TrendingUp },
  { id: 'projects', label: 'Deployments', icon: Briefcase },
  { id: 'services', label: 'Core Architecture', icon: Cpu },
  { id: 'blogs', label: 'Data Logs', icon: FileText },
  { id: 'users', label: 'Neural Profiles', icon: Users },
  { id: 'testimonials', label: 'Client Feedback', icon: MessageSquare },
  { id: 'team', label: 'Squad Matrix', icon: Star },
  { id: 'enquiries', label: 'Incoming Signals', icon: Mail },
  { id: 'scanner', label: 'Neural Scanner', icon: QrCode },
  { id: 'logs', label: 'Neural Logs', icon: Shield },
];

export const Sidebar = ({ onSetActiveTab, activeTab }: SidebarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminName, setAdminName] = useState(() => 
    localStorage.getItem('adminProfileName') || 'Administrator'
  );
  const [adminAvatar, setAdminAvatar] = useState<string | null>(() => 
    localStorage.getItem('adminProfileAvatar') || null
  );
  const [editName, setEditName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    if (editName.trim()) {
      setAdminName(editName.trim());
      localStorage.setItem('adminProfileName', editName.trim());
    }
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAdminAvatar(dataUrl);
      localStorage.setItem('adminProfileAvatar', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full bg-black border-r border-white/5 flex flex-col relative">
      <style>{GLASS_STYLES}</style>

      {/* Logo Section */}
      <div className="p-6 pb-8 border-b border-white/5">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/vexor-logo.png" 
            alt="Vexor" 
            className="h-8 w-auto object-contain"
          />
          <div>
            <h1 className="font-heading text-base tracking-tighter text-white uppercase font-light">
              VEXOR<span className="text-white/40 font-normal"> CONTROL</span>
            </h1>
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/30">Console Registry</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSetActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === item.id 
                ? 'text-white bg-white/[0.06] border border-white/10' 
                : 'text-white/40 hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <item.icon className={`w-4 h-4 flex-shrink-0 transition-colors ${activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-white'}`} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-light">
              {item.label}
            </span>
            {activeTab === item.id && (
              <motion.div
                layoutId="active-indicator"
                className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-white rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Admin Profile Section */}
      <div className="p-4 border-t border-white/5 space-y-2">
        {/* Profile toggle button */}
        <button
          onClick={() => setProfileOpen(p => !p)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-200 group"
        >
          {adminAvatar ? (
            <img src={adminAvatar} className="w-8 h-8 rounded-full object-cover border border-white/20" alt="Admin" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{adminName.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[11px] font-semibold text-white truncate">{adminName}</p>
            <p className="text-[8px] uppercase tracking-widest text-white/30">Admin</p>
          </div>
          <ChevronDown className={`w-3 h-3 text-white/30 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Editable Profile Panel */}
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 space-y-3">
                {/* Avatar upload */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {adminAvatar ? (
                      <img src={adminAvatar} className="w-12 h-12 rounded-full object-cover border border-white/20" alt="Admin" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-white">{adminName.charAt(0)}</span>
                      </div>
                    )}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Camera className="w-2.5 h-2.5 text-black" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Display Name</p>
                    {isEditing ? (
                      <div className="flex gap-1">
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-[11px] text-white outline-none"
                          autoFocus
                        />
                        <button onClick={handleSaveName} className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </button>
                        <button onClick={() => setIsEditing(false)} className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                          <X className="w-3 h-3 text-white/50" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditName(adminName); setIsEditing(true); }}
                        className="text-[12px] text-white font-medium hover:text-white/70 transition-colors text-left"
                      >
                        {adminName} <span className="text-white/20 text-[9px]">✎</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all duration-300 uppercase tracking-widest text-[9px]"
        >
          <LogOut className="w-4 h-4 text-white/30" />
          <span>Terminate Session</span>
        </button>
      </div>
    </div>
  );
};
