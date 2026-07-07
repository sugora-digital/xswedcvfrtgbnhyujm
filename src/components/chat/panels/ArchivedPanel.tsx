import React, { useState } from 'react';
import { Archive, Search, BellOff, ArrowLeft } from 'lucide-react';
import { chatStore } from '../../../lib/chatStore';

export const ArchivedPanel = ({ currentUser, conversations, onSelectChat }: { currentUser: any, conversations: any[], onSelectChat: (conv: any) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const archivedGroups = conversations.filter(c => c.archived_by?.includes(currentUser?.id));
  
  const filtered = archivedGroups.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.recipient?.display_name?.toLowerCase().includes(q) || c.title?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 space-y-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Archived</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search archived..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Archive className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No archived chats</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const hasUnread = conv.unreadCount > 0;
            return (
              <div
                key={conv.id}
                onClick={() => onSelectChat(conv)}
                className="flex items-center justify-between p-3 rounded-[20px] hover:bg-white dark:bg-zinc-900 transition-all select-none border border-transparent hover:border-neutral-100 hover:shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-neutral-500/10 to-neutral-500/10 overflow-hidden flex items-center justify-center font-bold text-neutral-500 shrink-0">
                    {conv.recipient?.avatar ? (
                      <img src={conv.recipient.avatar} alt="Chat" className="h-full w-full object-cover" />
                    ) : (
                      (conv.recipient?.display_name || '').substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[15px] truncate flex-1 text-neutral-900 dark:text-white">
                        {conv.recipient?.display_name || conv.title || 'Chat'}
                      </h4>
                      {conv.lastMessage && (
                        <span className="text-[11px] shrink-0 font-medium text-neutral-400">
                          {new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-neutral-500 dark:text-zinc-400 truncate mt-0.5">
                      {conv.lastMessage ? conv.lastMessage.text || 'Media' : 'No messages yet'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); chatStore.toggleArchive(conv.id, currentUser.id); }}
                  className="p-2 ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 hover:text-[#6C4EFF] transition-colors"
                  title="Unarchive"
                >
                  <Archive className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
