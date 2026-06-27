import React from 'react';
import { Search, Bell, User, Command, Menu } from 'lucide-react';
import { GLASS_STYLES } from '@/lib/design';

interface TopbarProps {
  member: any;
  onToggleSidebar?: () => void;
}

export const Topbar = ({ member, onToggleSidebar }: TopbarProps) => {
  return (
    <div className="h-20 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 lg:px-10 flex items-center justify-between relative z-20 gap-4">
      <style>{GLASS_STYLES}</style>

      {/* Mobile Toggle */}
      {onToggleSidebar && (
        <button 
          onClick={onToggleSidebar} 
          className="p-2 rounded-xl text-white/50 hover:text-white lg:hidden flex-shrink-0 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Search Bar - Glass Style */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-white/60 transition-colors" />
          <input 
            type="text" 
            placeholder="Search console database..." 
            className="w-full bg-white/[0.02] border border-white/5 rounded-full py-2.5 pl-12 pr-12 focus:border-white/15 focus:bg-white/[0.04] outline-none transition-all text-xs font-light tracking-wider text-white/80 placeholder:text-white/20"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 opacity-30">
            <Command className="w-2.5 h-2.5" />
            <span className="text-[7px] font-bold">K</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all group">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3.5 pl-6 border-l border-white/5 group cursor-pointer">
          <div className="text-right">
            <p className="text-[10px] font-medium tracking-widest text-white uppercase font-body-barlow">
              {member?.profile?.nickname || 'ADMIN'}
            </p>
            <p className="text-[8px] font-light text-white/30 uppercase tracking-[0.2em] font-body-barlow">Operator</p>
          </div>
          <div className="w-9 h-9 rounded-xl border border-white/10 p-0.5 group-hover:border-white/20 transition-colors">
            <div className="w-full h-full rounded-[0.5rem] bg-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
