import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImageIcon, Link as LinkIcon, FileText, Download, Share2, CornerUpRight, Trash2, Search, Play, File as FileGeneric } from 'lucide-react';
import { chatStore, ChatMessage } from '../../lib/chatStore';

interface Props {
  conversationId: string;
  onClose: () => void;
  onJumpToMessage: (msgId: string) => void;
  currentUser: any;
}

export const MediaLinksDocsDrawer: React.FC<Props> = ({ conversationId, onClose, onJumpToMessage, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'media' | 'links' | 'docs'>('media');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get all messages for this conversation
  const messages = chatStore.getMessages(conversationId, currentUser?.id);
  const profiles = chatStore.getProfiles();
  
  const getSenderName = (senderId: string) => {
    if (senderId === currentUser?.id) return 'You';
    return profiles.find(p => p.id === senderId)?.display_name || 'Unknown';
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Extract media
  const mediaItems = useMemo(() => {
    return messages
      .filter(m => m.attachment && (m.type === 'image' || m.type === 'video' || m.type === 'audio'))
      .filter(m => {
        if (!searchQuery) return true;
        const s = searchQuery.toLowerCase();
        return m.attachment?.file_name.toLowerCase().includes(s) || 
               getSenderName(m.sender_id).toLowerCase().includes(s);
      })
      .reverse();
  }, [messages, searchQuery, currentUser]);

  // Extract links
  const linkItems = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return messages
      .filter(m => m.text && m.text.match(urlRegex))
      .filter(m => {
        if (!searchQuery) return true;
        const s = searchQuery.toLowerCase();
        return m.text.toLowerCase().includes(s) || 
               getSenderName(m.sender_id).toLowerCase().includes(s);
      })
      .map(m => {
        const urls = m.text.match(urlRegex) || [];
        return urls.map(url => ({
          message: m,
          url,
          domain: new URL(url).hostname
        }));
      })
      .flat()
      .reverse();
  }, [messages, searchQuery, currentUser]);

  // Extract docs
  const docItems = useMemo(() => {
    return messages
      .filter(m => m.attachment && (m.type === 'document' || m.type === 'pdf'))
      .filter(m => {
        if (!searchQuery) return true;
        const s = searchQuery.toLowerCase();
        return m.attachment?.file_name.toLowerCase().includes(s) || 
               getSenderName(m.sender_id).toLowerCase().includes(s);
      })
      .reverse();
  }, [messages, searchQuery, currentUser]);

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-white dark:bg-[#09090B] border-l border-neutral-200/50 dark:border-zinc-800/50 shadow-2xl z-50 flex flex-col"
    >
      <div className="h-[76px] px-4 flex items-center justify-between border-b border-neutral-200/50 dark:border-zinc-800/50 shrink-0">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Media, Links & Docs</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-3 border-b border-neutral-200/50 dark:border-zinc-800/50 shrink-0">
        <div className="flex gap-1 bg-neutral-100 dark:bg-zinc-800/50 p-1 rounded-xl">
          {[
            { id: 'media', label: 'Media', count: mediaItems.length },
            { id: 'links', label: 'Links', count: linkItems.length },
            { id: 'docs', label: 'Docs', count: docItems.length }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-colors \${
                activeTab === t.id 
                  ? 'bg-white dark:bg-zinc-700 text-[#6C4EFF] shadow-sm' 
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-zinc-300'
              }`}
            >
              {t.label} <span className="opacity-60 font-normal ml-0.5">{t.count}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-100 dark:bg-zinc-800/50 border-none rounded-xl py-2 pl-9 pr-4 text-[14px] text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-[#6C4EFF]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'media' && (
          <div className="grid grid-cols-3 gap-2">
            {mediaItems.map(msg => (
              <div 
                key={msg.id} 
                className="aspect-square bg-neutral-100 dark:bg-zinc-800 rounded-xl overflow-hidden relative group cursor-pointer"
                onClick={() => onJumpToMessage(msg.id)}
              >
                {msg.type === 'image' && msg.attachment?.file_url && (
                  <img src={msg.attachment.file_url} alt="Media" className="w-full h-full object-cover" />
                )}
                {msg.type === 'video' && (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white relative">
                    {msg.attachment?.file_url && <video src={msg.attachment.file_url} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                    <Play className="h-8 w-8 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}
                {msg.type === 'audio' && (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                    <Play className="h-8 w-8 opacity-90" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-end gap-1">
                    <button className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-md transition-colors"><Download className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="text-[10px] text-white font-medium line-clamp-1">{getSenderName(msg.sender_id)}</div>
                </div>
              </div>
            ))}
            {mediaItems.length === 0 && (
              <div className="col-span-3 text-center py-12 text-neutral-500 text-[14px]">No media found</div>
            )}
          </div>
        )}

        {activeTab === 'links' && (
          <div className="space-y-3">
            {linkItems.map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group" onClick={() => onJumpToMessage(item.message.id)}>
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
                  <LinkIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[14px] font-bold text-neutral-900 dark:text-white truncate block hover:underline" onClick={(e) => e.stopPropagation()}>
                    {item.url}
                  </a>
                  <p className="text-[12px] text-neutral-500 truncate mt-0.5">{item.domain}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-neutral-400">{getSenderName(item.message.sender_id)}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-zinc-600" />
                    <span className="text-[11px] font-medium text-neutral-400">{formatDate(item.message.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
            {linkItems.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-[14px]">No links found</div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-2">
            {docItems.map(msg => (
              <div key={msg.id} className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-zinc-800/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group" onClick={() => onJumpToMessage(msg.id)}>
                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-neutral-900 dark:text-white truncate">{msg.attachment?.file_name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium text-neutral-400">{msg.attachment?.file_size ? (msg.attachment.file_size / 1024).toFixed(1) + ' KB' : 'Unknown size'}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-zinc-600" />
                    <span className="text-[11px] font-medium text-neutral-400">{getSenderName(msg.sender_id)}</span>
                  </div>
                </div>
                <button className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); /* download logic */ }}>
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
            {docItems.length === 0 && (
              <div className="text-center py-12 text-neutral-500 text-[14px]">No documents found</div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
