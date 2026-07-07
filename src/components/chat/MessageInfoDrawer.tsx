import React from 'react';
import { motion } from 'motion/react';
import { X, Check, CheckCheck, Clock, ShieldCheck, User, Info, FileText } from 'lucide-react';
import { chatStore, ChatMessage } from '../../lib/chatStore';

interface Props {
  message: ChatMessage;
  onClose: () => void;
  currentUser: any;
}

export const MessageInfoDrawer: React.FC<Props> = ({ message, onClose, currentUser }) => {
  const profiles = chatStore.getProfiles();
  const getSenderName = (senderId: string) => {
    if (senderId === currentUser?.id) return 'You';
    return profiles.find(p => p.id === senderId)?.display_name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-y-0 right-0 w-full sm:w-[380px] bg-[#F8FAFC] dark:bg-[#09090B] border-l border-neutral-200/50 dark:border-zinc-800/50 shadow-2xl z-50 flex flex-col"
    >
      <div className="h-[76px] px-4 flex items-center justify-between border-b border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#09090B] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center">
            <Info className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Message Info</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-neutral-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white flex items-center justify-center font-bold text-[11px]">
              {getSenderName(message.sender_id).charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-neutral-900 dark:text-white">{getSenderName(message.sender_id)}</p>
              <p className="text-[11px] text-neutral-500">{formatDate(message.created_at)}</p>
            </div>
          </div>
          
          <div className="text-[15px] text-neutral-800 dark:text-zinc-200 break-words bg-neutral-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-neutral-100 dark:border-zinc-700/50">
            {message.text || (message.attachment ? 'Media message' : '')}
            {message.attachment && (
              <div className="mt-2 flex items-center gap-2 text-[12px] text-blue-500 bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg">
                <FileText className="h-4 w-4" />
                <span className="truncate max-w-[200px]">{message.attachment.file_name}</span>
                <span className="opacity-70 ml-auto">{(message.attachment.file_size / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-sm border border-neutral-100 dark:border-zinc-800">
          <div className="flex items-center gap-4 p-3 border-b border-neutral-100 dark:border-zinc-800/50">
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
              <CheckCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-neutral-900 dark:text-white">Read</p>
              <p className="text-[12px] text-neutral-500">{message.status === 'read' ? formatDate(message.created_at) : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 border-b border-neutral-100 dark:border-zinc-800/50">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
              <CheckCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-neutral-900 dark:text-white">Delivered</p>
              <p className="text-[12px] text-neutral-500">{['delivered', 'read'].includes(message.status) ? formatDate(message.created_at) : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3">
            <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500 flex items-center justify-center shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-neutral-900 dark:text-white">Sent</p>
              <p className="text-[12px] text-neutral-500">{formatDate(message.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-2 shadow-sm border border-neutral-100 dark:border-zinc-800">
          <div className="p-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Technical Details</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-neutral-500">Message ID</span>
                <span className="font-mono text-neutral-900 dark:text-white select-all">{message.id.split('-')[0]}...</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-neutral-500">Type</span>
                <span className="capitalize font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">{message.type}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-neutral-500">End-to-End Encrypted</span>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </div>
              {message.edited_at && (
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-neutral-500">Edited</span>
                  <span className="text-neutral-900 dark:text-white">{formatDate(message.edited_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
