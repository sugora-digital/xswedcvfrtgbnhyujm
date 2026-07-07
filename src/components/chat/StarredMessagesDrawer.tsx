import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ChevronRight, MessageSquare, Trash2, CornerUpRight, Copy } from 'lucide-react';
import { chatStore, ChatMessage } from '../../lib/chatStore';

interface Props {
  conversationId: string;
  onClose: () => void;
  onJumpToMessage: (msgId: string) => void;
  currentUser: any;
}

export const StarredMessagesDrawer: React.FC<Props> = ({ conversationId, onClose, onJumpToMessage, currentUser }) => {
  const messages = chatStore.getStarredMessages(currentUser?.id).filter(m => m.conversation_id === conversationId);
  const profiles = chatStore.getProfiles();

  const getSenderName = (senderId: string) => {
    if (senderId === currentUser?.id) return 'You';
    return profiles.find(p => p.id === senderId)?.display_name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleUnstar = (msgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chatStore.toggleStarMessage(msgId, currentUser?.id);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-y-0 right-0 w-full sm:w-[380px] bg-white dark:bg-[#09090B] border-l border-neutral-200/50 dark:border-zinc-800/50 shadow-2xl z-50 flex flex-col"
    >
      <div className="h-[76px] px-4 flex items-center justify-between border-b border-neutral-200/50 dark:border-zinc-800/50 shrink-0 bg-[#F8FAFC] dark:bg-[#09090B]">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Star className="h-5 w-5 fill-current" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Starred Messages</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-zinc-800 text-neutral-500 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-[#09090B]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-60">
            <Star className="h-16 w-16 mb-4 text-neutral-300 dark:text-zinc-700" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">No Starred Messages</h3>
            <p className="text-[14px] text-neutral-500">Tap and hold on any message to star it, so you can easily find it later.</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-3 shadow-sm border border-neutral-100 dark:border-zinc-800 group cursor-pointer hover:shadow-md transition-all" onClick={() => onJumpToMessage(msg.id)}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-neutral-900 dark:text-white">{getSenderName(msg.sender_id)}</span>
                  <span className="text-[11px] text-neutral-400">{formatDate(msg.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-neutral-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800" onClick={(e) => handleUnstar(msg.id, e)} title="Unstar">
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
    </motion.div>
  );
};
