import React, { useState } from 'react';
import { Users, Search, MessageSquare, Phone, Video, UserPlus, BadgeCheck, MoreVertical } from 'lucide-react';
import { chatStore } from '../../../lib/chatStore';
import { callingStore } from '../../../lib/callingStore';

export const ContactsPanel = ({ currentUser, onStartChat }: { currentUser: any, onStartChat: (user: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const profiles = chatStore.getProfiles().filter(p => p.id !== currentUser?.id);
  
  const filteredProfiles = profiles.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.display_name?.toLowerCase().includes(q) || p.username?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 space-y-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Contacts</h2>
          <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 transition-colors">
            <UserPlus className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Users className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No contacts found</p>
          </div>
        ) : (
          filteredProfiles.map((user) => {
            const isOnline = chatStore.getPresence(user.id).status === 'online';
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-[20px] hover:bg-white dark:bg-zinc-900 transition-all select-none border border-transparent hover:border-neutral-100 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer" onClick={() => onStartChat(user)}>
                  <div className="relative h-11 w-11 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden flex items-center justify-center font-bold text-[#6C4EFF] shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.display_name} className="h-full w-full object-cover" />
                    ) : (
                      (user.display_name || user.username || '').substring(0, 2).toUpperCase()
                    )}
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#10B981] border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[15px] text-neutral-900 dark:text-white truncate flex items-center gap-1">
                      {user.display_name}
                      {user.email_verified && <BadgeCheck className="h-3.5 w-3.5 text-[#6C4EFF] fill-[#6C4EFF]/10" />}
                    </h4>
                    <p className="text-[12px] text-neutral-500 truncate mt-0.5">{isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartChat(user); }}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 hover:text-[#6C4EFF] transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); callingStore.startCall(user, 'voice'); }}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 hover:text-[#6C4EFF] transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); callingStore.startCall(user, 'video'); }}
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 hover:text-[#6C4EFF] transition-colors"
                  >
                    <Video className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
