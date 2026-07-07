import React from 'react';
import { Settings, User, Bell, Lock, MessageSquare, Database, Shield, Globe, HelpCircle, LogOut } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export const SettingsPanel = ({ currentUser, onLogOut }: { currentUser: any, onLogOut: () => void }) => {
  const settingsSections = [
    { id: 'profile', icon: User, label: 'Profile', desc: 'Change photo, username, bio' },
    { id: 'appearance', icon: Globe, label: 'Appearance', desc: 'Light, Dark, System themes' },
    { id: 'notifications', icon: Bell, label: 'Notifications', desc: 'Message sounds, vibrations' },
    { id: 'privacy', icon: Lock, label: 'Privacy', desc: 'Last seen, online status, block users' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', desc: 'Wallpaper, backup, auto-download' },
    { id: 'storage', icon: Database, label: 'Storage', desc: 'Clear cache, media management' },
    { id: 'security', icon: Shield, label: 'Security', desc: 'Password, 2FA, encryption' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support', desc: 'FAQ, contact us, report bugs' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">Settings</h2>
        
        {/* Profile Card Summary */}
        <div className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-neutral-100 dark:border-zinc-800 cursor-pointer hover:shadow-md transition-shadow">
          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] flex items-center justify-center text-white font-bold text-xl overflow-hidden shadow-sm">
            {currentUser?.user_metadata?.avatar_url ? (
              <img src={currentUser.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              (currentUser?.user_metadata?.username || currentUser?.email || 'U').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
              {currentUser?.user_metadata?.username || 'User'}
            </h3>
            <p className="text-sm text-neutral-500 truncate">{currentUser?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
        <div className="space-y-1">
          {settingsSections.map(sec => (
            <button
              key={sec.id}
              className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all text-left border border-transparent hover:border-neutral-100 hover:shadow-sm group"
            >
              <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-500 group-hover:text-[#6C4EFF] group-hover:bg-[#6C4EFF]/10 transition-colors">
                <sec.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-neutral-900 dark:text-white">{sec.label}</h4>
                <p className="text-[12px] text-neutral-500 truncate">{sec.desc}</p>
              </div>
            </button>
          ))}
          
          <div className="h-px bg-neutral-200 dark:bg-zinc-800 my-2 mx-4" />
          
          <button
            onClick={onLogOut}
            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left group"
          >
            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-500">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-bold text-red-500">Log Out</h4>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
