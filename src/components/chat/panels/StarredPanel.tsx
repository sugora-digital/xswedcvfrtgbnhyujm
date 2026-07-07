import React, { useState } from 'react';
import { Star, Search, ChevronRight, MessageSquare } from 'lucide-react';
import { chatStore } from '../../../lib/chatStore';

export const StarredPanel = ({ currentUser, onJumpToMessage }: { currentUser: any, onJumpToMessage: (convId: string, msgId: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const starredMessages = chatStore.getStarredMessages(currentUser?.id);
  const profiles = chatStore.getProfiles();

  const getSenderName = (senderId: string) => {
    if (senderId === currentUser?.id) return 'You';
    return profiles.find(p => p.id === senderId)?.display_name || 'Unknown';
  };

  const filtered = starredMessages.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.text?.toLowerCase().includes(q) || getSenderName(m.sender_id).toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]/50 dark:bg-[#09090B]/50">
      <div className="p-4 space-y-4 shrink-0 border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Starred Messages</h2>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
            <input 
              type="text" 
              placeholder="Search starred messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Star className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
            <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No starred messages</p>
          </div>
        ) : (
          filtered.map(msg => (
            <div 
              key={msg.id} 
              className="bg-white dark:bg-zinc-900 rounded-[20px] p-3 shadow-sm border border-neutral-100 dark:border-zinc-800 group cursor-pointer hover:shadow-md transition-all"
              onClick={() => onJumpToMessage(msg.conversation_id, msg.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-neutral-900 dark:text-white">{getSenderName(msg.sender_id)}</span>
                  <span className="text-[11px] text-neutral-400">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-1.5 text-neutral-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800" 
                    onClick={(e) => { e.stopPropagation(); chatStore.toggleStarMessage(msg.id, currentUser?.id); }} 
                    title="Unstar"
                  >
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-neutral-300" />
                </div>
              </div>
              
              <div className="text-[14px] text-neutral-700 dark:text-zinc-300 break-words whitespace-pre-wrap">
                {msg.text}
              </div>
              
              {msg.attachment && msg.type === 'image' && (
                <img src={msg.attachment.file_url} className="mt-2 rounded-xl max-h-[160px] object-cover" alt="Attachment" />
              )}
              {msg.attachment && msg.type === 'document' && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <span className="text-[13px] font-medium truncate">{msg.attachment.file_name}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
