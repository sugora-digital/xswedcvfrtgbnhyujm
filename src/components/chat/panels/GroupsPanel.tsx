import React, { useState } from 'react';
import { Users, Search, Plus, BadgeCheck } from 'lucide-react';
import { chatStore } from '../../../lib/chatStore';

export const GroupsPanel = ({ currentUser, conversations, onSelectGroup }: { currentUser: any, conversations: any[], onSelectGroup: (conv: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const groups = conversations.filter(c => c.type === 'group');
  
  const filteredGroups = groups.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.title?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 space-y-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Groups</h2>
          <button className="px-3 h-9 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white font-semibold text-[13px] flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all">
            <Plus className="h-4 w-4" />
            <span>New Group</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search groups..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Users className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No groups found</p>
          </div>
        ) : (
          filteredGroups.map((conv) => {
            const hasUnread = conv.unreadCount > 0;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectGroup(conv)}
                className="flex items-center justify-between p-3 rounded-[20px] hover:bg-white dark:bg-zinc-900 transition-all select-none border border-transparent hover:border-neutral-100 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-tr from-pink-500/10 to-rose-500/10 overflow-hidden flex items-center justify-center font-bold text-pink-500 shrink-0 border border-pink-500/20">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt="Group" className="h-full w-full object-cover" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-bold text-[15px] truncate flex-1 ${hasUnread ? 'text-neutral-900 dark:text-white' : 'text-neutral-900 dark:text-white'}`}>
                        {conv.title || 'Group Chat'}
                      </h4>
                      {conv.lastMessage && (
                        <span className={`text-[11px] shrink-0 font-medium ${hasUnread ? 'text-[#6C4EFF] font-bold' : 'text-neutral-400'}`}>
                          {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-[13px] truncate mt-0.5 ${hasUnread ? 'text-neutral-900 dark:text-zinc-200 font-semibold' : 'text-neutral-500 dark:text-zinc-400'}`}>
                      {conv.lastMessage ? conv.lastMessage.text || 'Media' : 'No messages yet'}
                    </p>
                  </div>
                </div>
                {hasUnread && (
                  <div className="h-5 min-w-[20px] rounded-full bg-[#6C4EFF] text-white text-[11px] font-bold flex items-center justify-center px-1.5 ml-2 shadow-sm">
                    {conv.unreadCount}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
