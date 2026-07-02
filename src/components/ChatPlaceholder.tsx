import React, { useEffect, useState, useRef } from 'react';
import { supabaseClient } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { chatStore, ChatMessage, Conversation, ChatSettings } from '../lib/chatStore';
import { 
  LogOut, ShieldCheck, MessageSquare, Users, Settings, Hash, Send, Bell, 
  Search, Sun, Moon, Monitor, ArrowLeft, Code, Sparkles, Check, CheckCheck,
  Heart, User, Pin, Archive, VolumeX, Trash2, Edit2, Reply, CornerUpRight, 
  Copy, Paperclip, Image as ImageIcon, FileText, Film, Music, Mic, Smile, X, Info,
  ChevronLeft, ChevronRight, Star, AlertTriangle, ShieldAlert, CheckSquare, Square, Download, Share2,
  Phone, Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { callingStore } from '../lib/callingStore';

// --- Curated Premium Media & Handshake Link Assets ---
const STICKERS = [
  { id: 'st1', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&auto=format&fit=crop&q=60', name: 'Retro Node' },
  { id: 'st2', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=60', name: 'Genesis Shard' },
  { id: 'st3', url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=120&auto=format&fit=crop&q=60', name: 'AES Cipher' },
  { id: 'st4', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=60', name: 'Decoded Matrix' },
  { id: 'st5', url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=120&auto=format&fit=crop&q=60', name: 'Cyber Core' }
];

const GIFS = [
  { id: 'g1', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3ZpdXp4ZDV4ejBpeWlhOHh6NDRxNnN0Mnp4NHFid3o0ZXR3M2g5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKSjRrfIPjeiVyM/giphy.gif', name: 'Cyber Handshake' },
  { id: 'g2', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExenF2cjJ1NHNnY2Z3OHp5eTYzb212d21rc214Z3B0OWszeHk3c2p0YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7Fbya7NARBI3bp9Pq5/giphy.gif', name: 'Secure Sharding' },
  { id: 'g3', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3g4MWowOTVyZmExdjV0cm5td3B6MHg4M3F0NHEycXZ0YnVwbXZwaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/938T8vG3P1gY0/giphy.gif', name: 'Access Granted' },
  { id: 'g4', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnhhZHFnbmdreThvM2VobThsc2p6NW1xZno5Nnp3YXBzb2twbWR4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/S92wTYF3NwhIGtz9FD/giphy.gif', name: 'Distributed Mesh' },
  { id: 'g5', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdnd2bjQ2cGhpbjByajl4am9iMnAwajcycXZwd2gxd2NveHhzMnQ5eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L333CZZm75cHRGL8B7/giphy.gif', name: 'Telemetry Bypass' }
];

const LINK_REGEX = /(https?:\/\/[^\s]+)/g;

function LinkPreview({ text }: { text: string }) {
  const match = text.match(LINK_REGEX);
  if (!match) return null;
  const url = match[0];
  
  let title = "Sugora Core Protocol Node Connection";
  let description = "Direct sharded peer routing, transit metadata bypass, and zero-knowledge end-to-end messaging.";
  let domain = "sugora.io";
  
  if (url.includes('github')) {
    title = "Sugora Core Repository / GitHub SDK";
    description = "Sovereign client cryptography implementation, audited sharding ledgers, and dev templates.";
    domain = "github.com";
  } else if (url.includes('twitter') || url.includes('x.com')) {
    title = "Sugora Labs / Network Broadcasts on X";
    description = "Core system status reports, telemetry compliance bulletins, and sharding protocol updates.";
    domain = "x.com";
  } else if (url.includes('giphy')) {
    title = "Sugora Animated Media Interchange";
    domain = "giphy.com";
  }
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-2.5 block border border-neutral-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-neutral-50 dark:bg-zinc-900/60 text-left hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors shadow-xs"
    >
      <div className="p-3 space-y-1">
        <span className="text-[9px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">{domain}</span>
        <h5 className="text-[11px] font-black text-neutral-800 dark:text-zinc-200 line-clamp-1">{title}</h5>
        <p className="text-[10px] text-neutral-450 dark:text-zinc-500 line-clamp-2 leading-relaxed font-semibold">{description}</p>
      </div>
    </a>
  );
}

export default function ChatPlaceholder() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [username, setUsername] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  // Store lists & filters
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'archived' | 'calls'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [callHistory, setCallHistory] = useState(callingStore.getCallHistory());

  useEffect(() => {
    const unsubCalls = callingStore.subscribe(() => {
      setCallHistory(callingStore.getCallHistory());
    });
    return () => unsubCalls();
  }, []);
  
  // Input & Composer
  const [messageText, setMessageText] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Custom attachment states
  const [attachment, setAttachment] = useState<{ name: string; size: number; type: string; base64: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Search User to start direct message
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Local settings reference from store
  const [chatSettings, setChatSettings] = useState<ChatSettings>(chatStore.getSettings());

  // New States for Advanced Features
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState<any>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [mediaRecorderInstance, setMediaRecorderInstance] = useState<any | null>(null);
  const [activeTabEmoji, setActiveTabEmoji] = useState<'emoji' | 'gif' | 'sticker'>('emoji');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchText, setChatSearchText] = useState('');
  const [starredOpen, setStarredOpen] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Authenticate and join store
  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
          const user = data.session.user;
          setCurrentUser(user);
          setUsername(user.user_metadata?.username || user.email?.split('@')[0] || 'sugora_user');
          
          // Set user presence online
          chatStore.setPresence(user.id, 'online');
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getUser();

    // Cleanup presence offline
    return () => {
      const saved = localStorage.getItem('sugora_mock_session');
      if (saved) {
        const session = JSON.parse(saved);
        if (session?.user?.id) {
          chatStore.setPresence(session.user.id, 'offline');
        }
      }
    };
  }, []);

  // Sync conversation list and details from the store reactively
  useEffect(() => {
    if (!currentUser) return;

    // Trigger persistent cloud storage synchronization
    chatStore.syncWithSupabase(currentUser.id);

    const syncStore = () => {
      setChatSettings(chatStore.getSettings());
      
      const convs = chatStore.getConversationsForUser(currentUser.id);
      setConversations(convs);

      if (activeConv) {
        // Refresh active conversation and messages
        const updatedActive = convs.find(c => c.id === activeConv.id);
        if (updatedActive) {
          setActiveConv(updatedActive);
        }
        
        const msgs = chatStore.getMessages(activeConv.id, currentUser.id);
        setMessages(msgs);

        // Get typing status
        const typings = chatStore.getTypingUsers(activeConv.id, currentUser.id);
        setTypingUsers(typings);

        // Auto mark as read
        chatStore.markAsRead(activeConv.id, currentUser.id);
      }
    };

    syncStore();
    const unsubscribe = chatStore.subscribe(syncStore);
    return () => unsubscribe();
  }, [currentUser, activeConv?.id]);

  // Keep scrolled to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // Handle typing debounce
  useEffect(() => {
    if (!activeConv || !currentUser || !isTyping) return;

    chatStore.setTyping(activeConv.id, currentUser.id, true);
    const delayDebounce = setTimeout(() => {
      setIsTyping(false);
      chatStore.setTyping(activeConv.id, currentUser.id, false);
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [messageText, isTyping]);

  // --- PRIVACY SETTINGS INITIALIZATION ---
  useEffect(() => {
    if (currentUser) {
      setPrivacySettings(chatStore.getPrivacySettings(currentUser.id));
    }
  }, [currentUser]);

  // --- BROWSER NATIVE PUSH NOTIFICATIONS ---
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!currentUser || !conversations.length) return;
    const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    if (totalUnread > 0 && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const activeUnreadConv = conversations.find(c => c.unreadCount > 0 && c.lastMessage && c.lastMessage.sender_id !== currentUser.id);
      if (activeUnreadConv && activeUnreadConv.lastMessage) {
        const notifyKey = `sugora_notified_${activeUnreadConv.lastMessage.id}`;
        if (!localStorage.getItem(notifyKey)) {
          localStorage.setItem(notifyKey, 'true');
          const notification = new Notification(`Message from @${activeUnreadConv.recipient.username}`, {
            body: activeUnreadConv.lastMessage.text || 'Shared Secure Attachment File',
            icon: activeUnreadConv.recipient.avatar || undefined,
            tag: activeUnreadConv.id
          });
          notification.onclick = () => {
            setActiveConv(activeUnreadConv);
            window.focus();
          };
        }
      }
    }
  }, [conversations, currentUser]);

  // --- VOICE MEMO RECORDER ENGINE ---
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          chatStore.sendMessage({
            conversation_id: activeConv.id,
            sender_id: currentUser.id,
            text: "Recorded Voice Memo Shard",
            type: 'voice',
            parent_message_id: replyingTo?.id,
            attachment: {
              id: `voice-${Math.random().toString(36).substring(2, 9)}`,
              file_name: `Voice_${new Date().toISOString().replace(/[:.]/g, '-')}.wav`,
              file_size: blob.size,
              file_type: 'audio/wav',
              file_url: base64
            }
          });
          setReplyingTo(null);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorderInstance(recorder);
      setIsRecordingVoice(true);
      setVoiceDuration(0);
    } catch (err) {
      alert('Microphone access denied or unsupported on this environment.');
    }
  };

  const stopVoiceRecording = (send: boolean) => {
    if (!mediaRecorderInstance) return;
    if (send) {
      mediaRecorderInstance.stop();
    } else {
      mediaRecorderInstance.onstop = null;
      try {
        mediaRecorderInstance.stream.getTracks().forEach((t: any) => t.stop());
      } catch (err) {}
      setIsRecordingVoice(false);
    }
    setIsRecordingVoice(false);
    setMediaRecorderInstance(null);
  };

  useEffect(() => {
    let timer: any;
    if (isRecordingVoice) {
      timer = setInterval(() => {
        setVoiceDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const formatVoiceTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  // --- REACTION ENGINE CONTROLLER ---
  const handleToggleReaction = (msgId: string, emoji: string) => {
    if (!currentUser) return;
    chatStore.addReaction(msgId, currentUser.id, emoji);
  };

  // --- STARRED MESSAGES MANAGER ---
  const handleToggleStar = (msgId: string) => {
    if (!currentUser) return;
    chatStore.toggleStarMessage(msgId, currentUser.id);
  };

  // --- MULTI-SELECT BULK OPERATIONS ---
  const handleToggleSelectMessage = (msgId: string) => {
    setSelectedMessageIds(prev => 
      prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId]
    );
  };

  const handleBulkDelete = () => {
    if (!currentUser || selectedMessageIds.length === 0) return;
    if (confirm(`Delete ${selectedMessageIds.length} selected messages?`)) {
      selectedMessageIds.forEach(id => {
        chatStore.deleteMessage(id, currentUser.id, 'everyone');
      });
      setSelectedMessageIds([]);
      setMultiSelectMode(false);
    }
  };

  const handleBulkForward = () => {
    if (!currentUser || selectedMessageIds.length === 0) return;
    const selectedMsgs = messages.filter(m => selectedMessageIds.includes(m.id));
    setShowForwardModal(selectedMsgs[0]);
  };

  // --- BLOCK & REPORT SYSTEM ---
  const handleToggleBlock = () => {
    if (!activeConv || !currentUser) return;
    chatStore.toggleBlockConversation(activeConv.id, currentUser.id);
    alert(chatStore.getConversationsForUser(currentUser.id).find(c => c.id === activeConv.id)?.blocked_by?.includes(currentUser.id) ? 'User blocked.' : 'User unblocked.');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !currentUser) return;
    chatStore.reportConversation(activeConv.id, currentUser.id, reportReason, reportDetails);
    setShowReportModal(false);
    setReportDetails('');
    alert('Conversation reported successfully to administrators.');
  };

  const handleSignOut = async () => {
    try {
      if (currentUser) {
        chatStore.setPresence(currentUser.id, 'offline');
      }
      await supabaseClient.auth.signOut();
      navigate('/');
    } catch (err) {
      console.error('Signout failed:', err);
      navigate('/');
    }
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Convert uploaded file to base64 for persistent storage in localStorage
  const handleFileSelection = (file: File) => {
    const limits = chatSettings.maximum_upload_size;
    if (file.size > limits) {
      alert(`File size exceeds limit of ${(limits / (1024 * 1024)).toFixed(0)}MB.`);
      return;
    }

    const allowed = chatSettings.allowed_file_types.split(',');
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(extension)) {
      alert(`Format .${extension} not supported. Allowed: ${chatSettings.allowed_file_types}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAttachment({
          name: file.name,
          size: file.size,
          type: file.type,
          base64: e.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Send message
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!activeConv || !currentUser) return;
    if (!messageText.trim() && !attachment) return;

    try {
      let attachmentPayload = undefined;
      if (attachment) {
        let typeClass: ChatMessage['type'] = 'document';
        if (attachment.type.startsWith('image/')) typeClass = 'image';
        else if (attachment.type.startsWith('video/')) typeClass = 'video';
        else if (attachment.type.startsWith('audio/')) typeClass = 'audio';

        attachmentPayload = {
          id: `att-${Math.random().toString(36).substring(2, 11)}`,
          file_name: attachment.name,
          file_size: attachment.size,
          file_type: attachment.type,
          file_url: attachment.base64
        };
      }

      chatStore.sendMessage({
        conversation_id: activeConv.id,
        sender_id: currentUser.id,
        text: messageText,
        type: attachment ? (attachment.type.startsWith('image/') ? 'image' : attachment.type.startsWith('video/') ? 'video' : attachment.type.startsWith('audio/') ? 'audio' : 'document') : 'text',
        parent_message_id: replyingTo?.id,
        attachment: attachmentPayload
      });

      // Clear states
      setMessageText('');
      setReplyingTo(null);
      setAttachment(null);
      setShowEmojiPicker(false);
      chatStore.setTyping(activeConv.id, currentUser.id, false);
      textInputRef.current?.focus();
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    }
  };

  // Keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Initiate chat with searched user
  const handleStartDirectChat = (recipient: any) => {
    if (!currentUser) return;
    const conv = chatStore.startConversation(currentUser.id, recipient.id, 'one-to-one');
    setActiveConv(conv);
    setShowNewChatModal(false);
  };

  // Filters conversation list
  const filteredConversations = conversations.filter(c => {
    // Tab filters
    if (activeTab === 'unread' && c.unreadCount === 0) return false;
    if (activeTab === 'archived' && !c.archived_by.includes(currentUser?.id)) return false;
    if (activeTab !== 'archived' && c.archived_by.includes(currentUser?.id)) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const userMatch = c.recipient?.display_name?.toLowerCase().includes(q) || c.recipient?.username?.toLowerCase().includes(q);
      const textMatch = c.lastMessage?.text?.toLowerCase().includes(q);
      return userMatch || textMatch;
    }
    return true;
  });

  // Action methods
  const handleTogglePin = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chatStore.togglePin(convId, currentUser.id);
  };

  const handleToggleArchive = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chatStore.toggleArchive(convId, currentUser.id);
  };

  const handleToggleMute = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    chatStore.toggleMute(convId, currentUser.id);
  };

  const handleDeleteConversation = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this chat history?')) {
      chatStore.deleteConversation(convId, currentUser.id);
      if (activeConv?.id === convId) {
        setActiveConv(null);
      }
    }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Message copied to clipboard.');
  };

  const handleTriggerEdit = (msg: ChatMessage) => {
    setEditingMessage(msg);
    setMessageText(msg.text);
    textInputRef.current?.focus();
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !currentUser) return;
    try {
      chatStore.editMessage(editingMessage.id, currentUser.id, messageText);
      setEditingMessage(null);
      setMessageText('');
    } catch (err: any) {
      alert(err.message || 'Failed to edit message.');
    }
  };

  const handleDeleteMessage = (msgId: string, type: 'me' | 'everyone') => {
    if (!currentUser) return;
    chatStore.deleteMessage(msgId, currentUser.id, type);
  };

  const handleForwardMessage = (recipientId: string) => {
    if (!showForwardModal || !currentUser) return;
    
    // Start/get conv
    const conv = chatStore.startConversation(currentUser.id, recipientId);
    
    // Send message to that conv
    chatStore.sendMessage({
      conversation_id: conv.id,
      sender_id: currentUser.id,
      text: showForwardModal.text,
      type: showForwardModal.type,
      attachment: showForwardModal.attachment
    });

    setShowForwardModal(null);
    setActiveConv(conv);
    alert('Message forwarded successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent mx-auto" />
          <p className="text-xs text-neutral-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
            Opening Sugora Shards...
          </p>
        </div>
      </div>
    );
  }

  // Pre-filter list of potential recipients
  const profilesList = chatStore.getProfiles().filter(p => p.id !== currentUser?.id);
  const filteredUsersToChat = profilesList.filter(p => {
    const q = userSearchQuery.toLowerCase();
    const displayName = p.display_name || '';
    const username = p.username || '';
    return displayName.toLowerCase().includes(q) || username.toLowerCase().includes(q);
  });

  return (
    <div 
      className="h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-neutral-50 flex flex-col transition-colors duration-300 select-none overflow-hidden"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Top Header Panel */}
      <header className="h-14 shrink-0 border-b border-neutral-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 flex items-center justify-between z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-900 md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 p-[1px] shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-white dark:bg-zinc-900">
              <svg className="h-4.5 w-4.5 fill-teal-500" viewBox="0 0 512 512">
                <path d="M 140,256 C 140,165.4 213.4,92 304,92 C 340,92 372,104 400,128 C 360,160 310,180 270,220 C 220,270 200,330 200,380 C 164,352 140,306 140,256 Z" fill="url(#chatLogoTeal)" />
                <path d="M 372,256 C 372,346.6 298.6,420 208,420 C 180,420 150,410 120,392 C 160,360 210,340 250,300 C 300,250 320,190 320,140 C 352,170 372,210 372,256 Z" fill="url(#chatLogoPurple)" />
                <defs>
                  <linearGradient id="chatLogoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                  <linearGradient id="chatLogoPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <span className="text-sm font-black tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-300 dark:to-indigo-300 bg-clip-text text-transparent">
            Sugora Shard Chats
          </span>
          <span className="hidden sm:inline-block text-[9px] bg-teal-500/10 text-teal-600 dark:text-teal-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
            Phase 1 Secure
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Privacy settings trigger */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-850 cursor-pointer"
            title="Privacy Settings"
          >
            <ShieldCheck className="h-4 w-4 text-teal-500" />
          </button>

          {/* Quick theme switcher */}
          <button
            onClick={() => {
              const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
              setTheme(modes[nextIndex]);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-850 cursor-pointer"
            title="Toggle theme"
          >
            {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* User profile identifier */}
          <div className="flex items-center gap-2 px-2.5 py-1 border border-neutral-200/50 dark:border-zinc-800/50 bg-neutral-50/50 dark:bg-zinc-900/50 rounded-xl text-xs">
            <User className="h-3.5 w-3.5 text-teal-500" />
            <span className="font-extrabold text-neutral-700 dark:text-zinc-300 hidden xs:inline">
              @{username}
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* DRAG AND DROP OVERLAY */}
        <AnimatePresence>
          {dragActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-teal-500/15 dark:bg-teal-500/10 backdrop-blur-xs flex items-center justify-center border-2 border-dashed border-teal-500 z-50 pointer-events-none"
            >
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-center space-y-4 max-w-sm shadow-2xl">
                <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-500 inline-block">
                  <Paperclip className="h-8 w-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold">Release to Import Shards</h3>
                <p className="text-xs text-neutral-400">
                  Drop files to automatically encrypt and stage for direct message pipeline transmission.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIDEBAR: CONVERSATION LISTS */}
        <aside 
          className={`w-full md:w-80 border-r border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 flex flex-col shrink-0 z-10 transition-all duration-300 ${
            activeConv ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search bar and Filters header */}
          <div className="p-4 border-b border-neutral-100 dark:border-zinc-900 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-400 dark:text-zinc-500 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-teal-500" />
                Conversations
              </h2>
              
              <button 
                onClick={() => setShowNewChatModal(true)}
                className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
              >
                <span>New DM</span>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search secure conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-neutral-100 dark:border-zinc-900 text-xs">
              {(['all', 'unread', 'archived', 'calls'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-2 font-extrabold capitalize text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                      : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-zinc-900 p-2 space-y-1">
            {activeTab === 'calls' ? (
              callHistory.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-2">
                  <Phone className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No call records found</p>
                  <p className="text-[11px] text-neutral-400 dark:text-zinc-500">Call connections initiated will log here securely.</p>
                </div>
              ) : (
                callHistory.map((call) => {
                  const otherUserId = call.caller_id === currentUser?.id ? call.receiver_id : call.caller_id;
                  const otherUser = chatStore.getProfiles().find(p => p.id === otherUserId);
                  const isIncoming = call.receiver_id === currentUser?.id;
                  const isVideo = call.type === 'video';

                  const name = otherUser?.display_name || otherUser?.username || 'Unknown Shard';
                  const initials = otherUser?.display_name
                    ? otherUser.display_name.substring(0, 2).toUpperCase()
                    : otherUser?.username
                    ? otherUser.username.substring(0, 2).toUpperCase()
                    : 'U';

                  return (
                    <div
                      key={call.id}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-neutral-50/50 dark:hover:bg-zinc-900/30 transition-all select-none text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-zinc-800 border border-neutral-200/50 dark:border-zinc-800 overflow-hidden flex items-center justify-center font-black text-teal-600 text-xs">
                            {otherUser?.avatar ? (
                              <img src={otherUser.avatar} alt={name} className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-neutral-900 dark:text-zinc-100 truncate">
                            {name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-neutral-450 dark:text-zinc-500 font-bold">
                            {isVideo ? <Video className="h-3 w-3 inline text-teal-500" /> : <Phone className="h-3 w-3 inline text-teal-500" />}
                            <span>
                              {isIncoming ? 'Incoming' : 'Outgoing'}
                            </span>
                            <span className="h-1 w-1 bg-neutral-350 rounded-full" />
                            <span className={`capitalize ${
                              call.status === 'completed' || call.status === 'active' ? 'text-emerald-500' : 'text-red-500'
                            }`}>
                              {call.status}
                            </span>
                            {call.duration_seconds && call.duration_seconds > 0 && (
                              <>
                                <span className="h-1 w-1 bg-neutral-350 rounded-full" />
                                <span>{Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s</span>
                              </>
                            )}
                          </div>
                          <span className="text-[9px] text-neutral-400 font-medium block mt-0.5">
                            {new Date(call.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </div>

                      {/* Callback buttons */}
                      {otherUser && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => callingStore.startCall(otherUser, 'voice')}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-teal-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-teal-600 text-neutral-500 transition-colors cursor-pointer"
                            title="Call Back"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => callingStore.startCall(otherUser, 'video')}
                            className="p-1.5 rounded-lg bg-neutral-100 hover:bg-teal-500 hover:text-white dark:bg-zinc-800 dark:hover:bg-teal-600 text-neutral-500 transition-colors cursor-pointer"
                            title="Video Call Back"
                          >
                            <Video className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <Hash className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
                <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No conversations found</p>
                <p className="text-[11px] text-neutral-400 dark:text-zinc-500">Initiate a direct messaging pipeline using the 'New DM' button.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const recipient = conv.recipient;
                if (!recipient) return null;

                const isPinned = conv.pinned_by?.includes(currentUser?.id);
                const isMuted = conv.muted_by?.includes(currentUser?.id);
                const isOnline = chatStore.getPresence(recipient.id).status === 'online';
                const isAway = chatStore.getPresence(recipient.id).status === 'away';

                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setActiveConv(conv);
                      chatStore.markAsRead(conv.id, currentUser.id);
                    }}
                    className={`group relative flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all select-none ${
                      activeConv?.id === conv.id
                        ? 'bg-neutral-100/80 dark:bg-zinc-900 text-neutral-900 dark:text-white'
                        : 'hover:bg-neutral-50/50 dark:hover:bg-zinc-900/30'
                    }`}
                  >
                    {/* Avatar Container */}
                    <div className="relative shrink-0">
                      <div className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-zinc-800 border border-neutral-200/50 dark:border-zinc-800 overflow-hidden flex items-center justify-center font-black text-teal-600 text-sm">
                        {recipient.avatar ? (
                          <img src={recipient.avatar} alt={recipient.display_name} className="h-full w-full object-cover" />
                        ) : (
                          recipient.display_name.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      
                      {/* Presence Status */}
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                      )}
                      {!isOnline && isAway && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-950" />
                      )}
                    </div>

                    {/* Meta info column */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs truncate flex items-center gap-1.5 text-neutral-900 dark:text-zinc-100">
                          {recipient.display_name}
                          {recipient.role !== 'User' && (
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-500 font-extrabold px-1 rounded uppercase tracking-wider shrink-0">
                              {recipient.role}
                            </span>
                          )}
                        </span>
                        
                        <span className="text-[9px] font-bold text-neutral-400 shrink-0">
                          {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5">
                        <p className="text-[11px] text-neutral-450 dark:text-zinc-400 truncate flex-1 leading-normal font-medium">
                          {conv.lastMessage ? (
                            conv.lastMessage.deleted_for_everyone ? (
                              <span className="italic text-neutral-400">Deleted message</span>
                            ) : (
                              conv.lastMessage.text || 'Shared Attachment'
                            )
                          ) : (
                            <span className="italic text-teal-500">Pipeline opened</span>
                          )}
                        </p>

                        <div className="flex items-center gap-1 shrink-0">
                          {isPinned && <Pin className="h-3 w-3 text-teal-500 rotate-45" />}
                          {isMuted && <VolumeX className="h-3 w-3 text-neutral-400" />}
                          {conv.unreadCount > 0 && (
                            <span className="h-4.5 min-w-4.5 px-1 flex items-center justify-center rounded-full bg-teal-500 text-white font-extrabold text-[9px]">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick overlay action context triggers */}
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 rounded-lg p-1 border border-neutral-150 dark:border-zinc-800 transition-opacity z-10">
                      <button 
                        onClick={(e) => handleTogglePin(conv.id, e)} 
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded text-neutral-500 hover:text-teal-500" 
                        title="Pin Chat"
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => handleToggleArchive(conv.id, e)} 
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded text-neutral-500 hover:text-indigo-500" 
                        title="Archive Chat"
                      >
                        <Archive className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => handleToggleMute(conv.id, e)} 
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded text-neutral-500 hover:text-amber-500" 
                        title="Mute Notifications"
                      >
                        <VolumeX className="h-3 w-3" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteConversation(conv.id, e)} 
                        className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded text-neutral-500 hover:text-red-500" 
                        title="Delete Conversation"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* MAIN MESSAGING CANVAS AREA */}
        <main className="flex-1 bg-slate-50 dark:bg-zinc-900/30 flex flex-col relative overflow-hidden">
          {activeConv ? (
            <>
              {/* Active Header bar */}
              <div className="h-14 border-b border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 px-4 flex items-center justify-between shrink-0 z-10 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveConv(null)}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-900 md:hidden shrink-0"
                  >
                    <ArrowLeft className="h-4.5 w-4.5" />
                  </button>

                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-xl bg-neutral-100 dark:bg-zinc-800 border border-neutral-200/50 dark:border-zinc-800 overflow-hidden flex items-center justify-center font-black text-teal-600 text-xs">
                      {activeConv.recipient?.avatar ? (
                        <img src={activeConv.recipient.avatar} alt={activeConv.recipient.display_name} className="h-full w-full object-cover" />
                      ) : (
                        activeConv.recipient?.display_name?.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    {chatStore.getPresence(activeConv.recipient?.id).status === 'online' && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-extrabold text-xs text-neutral-900 dark:text-zinc-100 flex items-center gap-1.5 truncate">
                      {activeConv.recipient?.display_name}
                      {activeConv.recipient?.role !== 'User' && (
                        <span className="text-[8px] bg-teal-500/15 text-teal-600 dark:text-teal-400 font-extrabold px-1 rounded uppercase tracking-wider shrink-0">
                          {activeConv.recipient?.role}
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-neutral-450 dark:text-zinc-500 font-bold truncate">
                      {chatStore.getPresence(activeConv.recipient?.id).status === 'online' ? (
                        <span className="text-emerald-500 animate-pulse">Active now</span>
                      ) : (
                        `Last seen: ${new Date(chatStore.getPresence(activeConv.recipient?.id).last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'voice')}
                    className="p-2 rounded-xl text-neutral-500 hover:text-teal-500 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                    title="Voice Call"
                  >
                    <Phone className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'video')}
                    className="p-2 rounded-xl text-neutral-500 hover:text-teal-500 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                    title="Video Call"
                  >
                    <Video className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => setChatSearchOpen(!chatSearchOpen)}
                    className={`p-2 rounded-xl text-neutral-500 hover:text-teal-500 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer ${chatSearchOpen ? 'text-teal-500 bg-neutral-100 dark:bg-zinc-900' : ''}`}
                    title="Search Chat Messages"
                  >
                    <Search className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => setStarredOpen(!starredOpen)}
                    className={`p-2 rounded-xl text-neutral-500 hover:text-amber-550 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer ${starredOpen ? 'text-amber-550 bg-neutral-100 dark:bg-zinc-900' : ''}`}
                    title="Starred Messages"
                  >
                    <Star className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => {
                      setMultiSelectMode(!multiSelectMode);
                      setSelectedMessageIds([]);
                    }}
                    className={`p-2 rounded-xl text-neutral-500 hover:text-teal-500 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer ${multiSelectMode ? 'text-teal-500 bg-neutral-100 dark:bg-zinc-900' : ''}`}
                    title="Multi-Select Messages"
                  >
                    <CheckSquare className="h-4 w-4" />
                  </button>

                  <button 
                    onClick={() => setShowProfileDrawer(!showProfileDrawer)}
                    className="p-2 rounded-xl text-neutral-500 hover:text-teal-500 hover:bg-neutral-100 dark:hover:bg-zinc-900 cursor-pointer"
                    title="Profile Info"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Secure Handshake Notice Banner */}
              <div className="bg-teal-500/5 dark:bg-teal-500/10 border-b border-teal-500/10 p-2.5 text-[10px] text-teal-600 dark:text-teal-400 font-semibold flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>Verified Sugora End-to-End Cryptography Handshake Pipeline Active</span>
                </span>
                <span className="font-mono text-[8px] opacity-75 shrink-0 hidden xs:inline">TTL: 2548s</span>
              </div>

              {/* Message Search sliding block */}
              {chatSearchOpen && (
                <div className="bg-neutral-50 dark:bg-zinc-950 border-b border-neutral-200/50 dark:border-zinc-800/50 p-2.5 flex items-center gap-2 shrink-0 z-10">
                  <Search className="h-4 w-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search text within this conversation log..."
                    value={chatSearchText}
                    onChange={(e) => setChatSearchText(e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-xs focus:outline-none dark:text-white font-medium"
                  />
                  {chatSearchText && (
                    <button onClick={() => setChatSearchText('')} className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-lg text-neutral-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* Pinned Messages sticky header banner */}
              {messages.filter(m => m.is_pinned).length > 0 && (
                <div className="bg-teal-500/5 dark:bg-teal-500/10 border-b border-teal-500/10 px-4 py-2 text-xs flex items-center justify-between shrink-0 z-10 animate-in slide-in-from-top duration-150">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Pin className="h-3.5 w-3.5 text-teal-500 rotate-45 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="font-extrabold text-[9px] text-teal-600 dark:text-teal-400 block uppercase tracking-wider">Pinned Message Shard</span>
                      <p className="text-[11px] text-neutral-600 dark:text-zinc-300 truncate leading-normal font-semibold">
                        {messages.filter(m => m.is_pinned)[0].text || 'Shared Attachment'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => chatStore.togglePinMessage(activeConv.id, messages.filter(m => m.is_pinned)[0].id)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-400 hover:text-red-500 transition-colors"
                    title="Unpin Message"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Messages Thread list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="p-4 rounded-3xl bg-neutral-100 dark:bg-zinc-900/50 text-teal-500">
                      <MessageSquare className="h-8 w-8" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider">No message logs</h4>
                    <p className="text-[11px] text-neutral-450 dark:text-zinc-500 max-w-xs leading-relaxed">
                      Say hello to initiate a cryptographically logged direct-shards communication session with @{activeConv.recipient?.username}.
                    </p>
                  </div>
                ) : (
                  (chatSearchText 
                    ? messages.filter(m => m.text?.toLowerCase().includes(chatSearchText.toLowerCase()))
                    : messages
                  ).map((msg) => {
                    const isMe = msg.sender_id === currentUser.id;
                    const parentMsg = msg.parent_message_id ? messages.find(m => m.id === msg.parent_message_id) : null;
                    const isStarred = msg.starred_by?.includes(currentUser.id);
                    const isPinned = msg.is_pinned;

                    return (
                      <div 
                        key={msg.id}
                        className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'} relative group animate-in fade-in duration-200`}
                      >
                        {/* Multi select mode checkbox */}
                        {multiSelectMode && (
                          <button
                            onClick={() => handleToggleSelectMessage(msg.id)}
                            className="self-center p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg text-neutral-400 hover:text-teal-500 shrink-0"
                          >
                            {selectedMessageIds.includes(msg.id) ? (
                              <CheckSquare className="h-4.5 w-4.5 text-teal-500" />
                            ) : (
                              <Square className="h-4.5 w-4.5" />
                            )}
                          </button>
                        )}

                        <div className={`max-w-[75%] sm:max-w-[60%] space-y-1 relative`}>
                          
                          {/* Reply / Quoting Banner Header */}
                          {parentMsg && (
                            <div className="p-2 border-l-2 border-teal-500 bg-neutral-150/40 dark:bg-zinc-800/40 rounded-r-lg text-[10px] text-neutral-500 truncate mb-1">
                              <span className="font-black text-teal-600 block">
                                @{parentMsg.sender_id === currentUser.id ? 'You' : activeConv.recipient?.username}
                              </span>
                              <span>{parentMsg.text || 'Shared Shard File'}</span>
                            </div>
                          )}
 
                          {/* Message bubble */}
                          <div className={`p-3.5 rounded-2xl relative ${
                            isMe 
                              ? 'bg-neutral-900 dark:bg-white text-white dark:text-zinc-950 rounded-tr-xs shadow-xs' 
                              : 'bg-white dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-850 rounded-tl-xs shadow-xs text-slate-800 dark:text-zinc-100'
                          }`}>
                            {/* Message actions popup overlay (Hover states on desktop) */}
                            <div className={`absolute top-1/2 -translate-y-1/2 ${
                              isMe ? '-left-32 sm:-left-44' : '-right-32 sm:-right-44'
                            } opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white dark:bg-zinc-900 shadow-xl border border-neutral-200/50 dark:border-zinc-800 p-1 rounded-xl z-20 transition-all`}>
                              <button 
                                onClick={() => setReplyingTo(msg)} 
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-850 rounded text-neutral-500 hover:text-teal-500" 
                                title="Reply"
                              >
                                <Reply className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => handleCopyMessage(msg.text)} 
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-855 rounded text-neutral-500 hover:text-indigo-500" 
                                title="Copy"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => handleToggleStar(msg.id)} 
                                className={`p-1 hover:bg-neutral-100 dark:hover:bg-zinc-855 rounded ${isStarred ? 'text-amber-500' : 'text-neutral-500 hover:text-amber-500'}`} 
                                title={isStarred ? "Unstar Message" : "Star Message"}
                              >
                                <Star className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => chatStore.togglePinMessage(activeConv.id, msg.id)} 
                                className={`p-1 hover:bg-neutral-100 dark:hover:bg-zinc-855 rounded ${isPinned ? 'text-teal-500' : 'text-neutral-500 hover:text-teal-500'}`} 
                                title={isPinned ? "Unpin Message" : "Pin Message"}
                              >
                                <Pin className="h-3 w-3 rotate-45" />
                              </button>
                              {isMe && !msg.deleted_for_everyone && (
                                <button 
                                  onClick={() => handleTriggerEdit(msg)} 
                                  className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-850 rounded text-neutral-500 hover:text-amber-500" 
                                  title="Edit"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                              )}
                              <button 
                                onClick={() => setShowForwardModal(msg)} 
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-850 rounded text-neutral-500 hover:text-blue-500" 
                                title="Forward"
                              >
                                <CornerUpRight className="h-3 w-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteMessage(msg.id, isMe ? 'everyone' : 'me')} 
                                className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-850 rounded text-neutral-500 hover:text-red-500" 
                                title={isMe ? 'Delete for Everyone' : 'Delete for Me'}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                              
                              {/* Hover Reactions Panel */}
                              <div className="flex items-center gap-0.5 border-l border-neutral-150 dark:border-zinc-800 pl-1.5 ml-1 hidden xs:flex">
                                {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleToggleReaction(msg.id, emoji)}
                                    className="hover:scale-130 transition-transform p-0.5 text-[11px]"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Render attachments if any */}
                            {msg.attachment && (
                              <div className="mb-2 rounded-xl overflow-hidden border border-neutral-150 dark:border-zinc-800 bg-neutral-100/50 dark:bg-zinc-900/50 p-2">
                                {msg.type === 'image' && (
                                  <img 
                                    src={msg.attachment.file_url} 
                                    alt={msg.attachment.file_name} 
                                    onClick={() => {
                                      setLightboxImage(msg.attachment.file_url);
                                      const imageMsgs = messages.filter(m => m.type === 'image' && m.attachment?.file_url);
                                      const idx = imageMsgs.findIndex(m => m.id === msg.id);
                                      setLightboxIndex(idx);
                                    }}
                                    className="max-h-48 w-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                {msg.type === 'video' && (
                                  <div className="relative rounded-lg overflow-hidden bg-black/90 max-h-60">
                                    <video 
                                      src={msg.attachment.file_url} 
                                      controls 
                                      className="w-full max-h-56 rounded-lg object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                                {(msg.type === 'audio' || msg.type === 'voice') && (
                                  <div className="flex flex-col gap-1.5 p-2 bg-neutral-100/85 dark:bg-zinc-900 rounded-xl max-w-xs">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
                                      {msg.type === 'voice' ? <Mic className="h-3.5 w-3.5 text-red-500 shrink-0 animate-pulse" /> : <Music className="h-3.5 w-3.5 text-indigo-500 shrink-0" />}
                                      <span>{msg.type === 'voice' ? 'Voice Shard Memo' : 'Secure Audio Track'}</span>
                                    </div>
                                    <audio 
                                      src={msg.attachment.file_url} 
                                      controls 
                                      className="w-full h-8 max-w-[210px] sm:max-w-xs"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                )}
                                {msg.type === 'document' && (
                                  <div className="flex items-center gap-2.5 p-2 bg-neutral-150/40 dark:bg-zinc-800/40 rounded-lg text-xs">
                                    <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="font-extrabold font-mono text-[10px] truncate max-w-36">{msg.attachment.file_name}</p>
                                      <p className="text-[9px] text-neutral-450 dark:text-zinc-500">{(msg.attachment.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Text content */}
                            <p className="text-xs leading-relaxed font-sans font-medium whitespace-pre-wrap select-text">
                              {msg.text}
                            </p>

                            {/* Link previews */}
                            <LinkPreview text={msg.text} />

                            {/* Status and timestamp line */}
                            <div className="flex items-center justify-end gap-1.5 mt-1.5 text-[9px] font-bold select-none opacity-80">
                              {isStarred && <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500 shrink-0 animate-pulse" />}
                              {isPinned && <Pin className="h-2.5 w-2.5 text-teal-500 rotate-45 shrink-0" />}
                              <span>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {msg.edited_at && <span className="italic text-[8px]">edited</span>}
                              
                              {/* WhatsApp style double ticks */}
                              {isMe && (
                                <span>
                                  {msg.status === 'sent' && <Check className="h-3 w-3 text-neutral-400" />}
                                  {msg.status === 'delivered' && <CheckCheck className="h-3 w-3 text-neutral-400" />}
                                  {msg.status === 'read' && <CheckCheck className="h-3 w-3 text-teal-500 dark:text-teal-400" />}
                                </span>
                              )}
                            </div>

                            {/* Reactions display underneath bubble */}
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                              <div className="absolute -bottom-2.5 right-2 flex items-center gap-1 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-full px-1.5 py-0.5 text-[10px] shadow-sm select-none z-10 font-bold">
                                {Object.entries(msg.reactions).map(([emoji, uids]: [string, any]) => {
                                  if (!uids || uids.length === 0) return null;
                                  return (
                                    <span key={emoji} title={`${uids.length} reaction(s)`} className="flex items-center gap-0.5">
                                      <span>{emoji}</span>
                                      <span className="text-[8px] text-neutral-400 dark:text-zinc-500">{uids.length}</span>
                                    </span>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Animated Typing indicators dots */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-850 px-3.5 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-2.5 shadow-sm text-neutral-500 text-[11px] font-bold">
                      <div className="flex gap-1 items-center">
                        <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 bg-teal-500 rounded-full animate-bounce" />
                      </div>
                      <span>{typingUsers.join(', ')} typing...</span>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer Footer Panel */}
              <div className="p-3 border-t border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 space-y-2 shrink-0 z-10">
                {/* Replying banner */}
                {replyingTo && (
                  <div className="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-850 rounded-xl text-[10px]">
                    <div className="flex items-center gap-2">
                      <Reply className="h-4 w-4 text-teal-500 rotate-180" />
                      <div>
                        <span className="font-extrabold text-neutral-550 block">Replying to @{replyingTo.sender_id === currentUser.id ? 'You' : activeConv.recipient?.username}</span>
                        <span className="text-neutral-400 truncate max-w-sm block">{replyingTo.text}</span>
                      </div>
                    </div>
                    <button onClick={() => setReplyingTo(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Staged file attachment preview */}
                {attachment && (
                  <div className="flex items-center justify-between p-2 bg-teal-500/5 border border-teal-500/20 rounded-xl text-[10px]">
                    <div className="flex items-center gap-2 min-w-0">
                      {attachment.type.startsWith('image/') ? <ImageIcon className="h-4 w-4 text-teal-500" /> : <FileText className="h-4 w-4 text-indigo-500" />}
                      <div className="min-w-0">
                        <span className="font-black font-mono block truncate max-w-sm text-neutral-850 dark:text-zinc-200">{attachment.name}</span>
                        <span className="text-neutral-450 font-bold block">{(attachment.size / (1024 * 1024)).toFixed(2)} MB • Stage Encrypted</span>
                      </div>
                    </div>
                    <button onClick={() => setAttachment(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {/* Handshake Block Check / Suspension warning */}
                {activeConv.blocked_by?.length > 0 ? (
                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex items-center gap-3 text-xs text-amber-600 dark:text-amber-400 font-semibold select-none animate-pulse">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="font-extrabold uppercase tracking-wider text-[10px]">Pipeline Cryptographic Handshake Suspended</p>
                      <p className="text-[11px] opacity-85 leading-relaxed font-medium">
                        This communication channel has been blocked by one of the participants. Unblock user in details panel to resume sharding operations.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Attachment trigger */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-neutral-150 dark:border-zinc-800 hover:border-neutral-300 hover:text-teal-500 cursor-pointer text-neutral-500 transition-all"
                        title="Attach secure file shard"
                      >
                        <Paperclip className="h-4.5 w-4.5" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileSelection(e.target.files[0]);
                          }
                        }}
                      />

                      {/* Microphone mic recording trigger */}
                      <button
                        type="button"
                        onClick={startVoiceRecording}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-neutral-150 dark:border-zinc-800 hover:border-neutral-300 hover:text-red-500 cursor-pointer text-neutral-500 transition-all"
                        title="Record voice memo shard"
                      >
                        <Mic className="h-4.5 w-4.5" />
                      </button>

                      {/* Simple Emoji Menu Selector Popover Trigger */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-neutral-150 dark:border-zinc-800 hover:border-neutral-300 hover:text-teal-500 cursor-pointer text-neutral-500 transition-all"
                          title="Pick emoji"
                        >
                          <Smile className="h-4.5 w-4.5" />
                        </button>

                        <AnimatePresence>
                          {showEmojiPicker && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute bottom-12 left-0 p-3 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-xl w-64 z-30 flex flex-col gap-2.5"
                            >
                              {/* Picker Tabs */}
                              <div className="flex border-b border-neutral-100 dark:border-zinc-900 text-[10px] font-bold">
                                {(['emoji', 'gif', 'sticker'] as const).map((tab) => (
                                  <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveTabEmoji(tab)}
                                    className={`flex-1 pb-1.5 uppercase text-center border-b-2 transition-all cursor-pointer ${
                                      activeTabEmoji === tab
                                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                                        : 'border-transparent text-neutral-400'
                                    }`}
                                  >
                                    {tab}s
                                  </button>
                                ))}
                              </div>

                              {/* Content based on selected tab */}
                              {activeTabEmoji === 'emoji' && (
                                <div className="grid grid-cols-6 gap-1.5 max-h-44 overflow-y-auto pt-1">
                                  {['😀','🔥','👍','🎉','🔒','🛡️','💻','🚀','💡','💬','💯','❤️','👏','🙌','😂','😮','😢','🙏'].map(emoji => (
                                    <button
                                      key={emoji}
                                      type="button"
                                      onClick={() => {
                                        setMessageText(prev => prev + emoji);
                                        setShowEmojiPicker(false);
                                        textInputRef.current?.focus();
                                      }}
                                      className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {activeTabEmoji === 'gif' && (
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pt-1">
                                  {GIFS.map(gif => (
                                    <button
                                      key={gif.id}
                                      type="button"
                                      onClick={() => {
                                        chatStore.sendMessage({
                                          conversation_id: activeConv.id,
                                          sender_id: currentUser.id,
                                          text: `Sent GIF: ${gif.name}`,
                                          type: 'image',
                                          parent_message_id: replyingTo?.id,
                                          attachment: {
                                            id: `gif-${Math.random().toString(36).substring(2, 9)}`,
                                            file_name: `${gif.name}.gif`,
                                            file_size: 1048576,
                                            file_type: 'image/gif',
                                            file_url: gif.url
                                          }
                                        });
                                        setShowEmojiPicker(false);
                                      }}
                                      className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer group"
                                    >
                                      <img src={gif.url} alt={gif.name} className="h-16 w-full object-cover" />
                                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate px-1 font-mono">{gif.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}

                              {activeTabEmoji === 'sticker' && (
                                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pt-1">
                                  {STICKERS.map(st => (
                                    <button
                                      key={st.id}
                                      type="button"
                                      onClick={() => {
                                        chatStore.sendMessage({
                                          conversation_id: activeConv.id,
                                          sender_id: currentUser.id,
                                          text: `Sent Sticker: ${st.name}`,
                                          type: 'image',
                                          parent_message_id: replyingTo?.id,
                                          attachment: {
                                            id: `sticker-${Math.random().toString(36).substring(2, 9)}`,
                                            file_name: `${st.name}.png`,
                                            file_size: 204857,
                                            file_type: 'image/png',
                                            file_url: st.url
                                          }
                                        });
                                        setShowEmojiPicker(false);
                                      }}
                                      className="relative rounded-lg overflow-hidden border border-neutral-200 dark:border-zinc-800 hover:border-teal-500 transition-colors cursor-pointer"
                                    >
                                      <img src={st.url} alt={st.name} className="h-16 w-full object-cover" />
                                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 truncate px-1 font-mono">{st.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {isRecordingVoice ? (
                      <div className="flex-1 bg-red-500/10 dark:bg-red-500/15 border border-red-500/15 rounded-xl py-2 px-3 flex items-center justify-between text-xs animate-pulse select-none">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping shrink-0" />
                          <span className="font-extrabold text-red-600 dark:text-red-400">Recording Voice: {formatVoiceTime(voiceDuration)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button type="button" onClick={() => stopVoiceRecording(false)} className="px-2 py-1 text-red-500 hover:bg-red-500/10 font-black rounded-lg text-[9px] uppercase">Cancel</button>
                          <button type="button" onClick={() => stopVoiceRecording(true)} className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white font-black rounded-lg text-[9px] uppercase">Send</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0 relative">
                        <textarea
                          ref={textInputRef}
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value);
                            setIsTyping(true);
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder={editingMessage ? "Editing message shard..." : "Type secure encrypted message..."}
                          className="w-full pl-3 pr-14 py-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white resize-none max-h-24 min-h-10 font-medium"
                          rows={1}
                        />

                        {/* Staged edits save key indicator */}
                        {editingMessage && (
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-teal-500 hover:bg-teal-500/10 rounded-lg cursor-pointer font-bold text-[10px]"
                          >
                            Save
                          </button>
                        )}
                        
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] font-bold text-neutral-400">
                          {messageText.length}/{chatSettings.message_length}
                        </span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isRecordingVoice}
                      className="h-10 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white font-black text-xs transition-all shadow-sm shrink-0 cursor-pointer"
                    >
                      <span>Send</span>
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0d94880c_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="relative z-10 max-w-lg space-y-6">
                <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-teal-500 mx-auto">
                  <MessageSquare className="h-9 w-9 text-teal-500 animate-pulse" />
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-white shadow-md">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white flex items-center justify-center gap-2">
                    <span>Welcome,</span>
                    <span className="bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
                      @{username}!
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed max-w-md mx-auto">
                    You have successfully established a secure identity handshake channel. Choose an active recipient keys thread on the left side, or spin up a new custom one-to-one messaging pipeline.
                  </p>
                </div>

                {/* Secure info block */}
                <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/40 text-left space-y-2.5 max-w-md mx-auto shadow-xs">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    <ShieldCheck className="h-4 w-4 text-teal-500" />
                    <span>Sugora Shards Core Node Security</span>
                  </div>
                  <p className="text-[11px] text-neutral-450 dark:text-zinc-500 leading-relaxed font-medium">
                    All communication packets transiting the Sugora network undergo rigorous local peer-to-peer encryption. Your private key sharding parameters are secure and stored on-device.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowNewChatModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                  >
                    Start New Shard Direct Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT SIDE DRAWER: PROFILE SUMMARY DETAILS */}
        <AnimatePresence>
          {showProfileDrawer && activeConv?.recipient && (
            <motion.aside 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-72 border-l border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 flex flex-col shrink-0 z-20"
            >
              <div className="h-14 border-b border-neutral-100 dark:border-zinc-900 px-4 flex items-center justify-between shrink-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-zinc-500 flex items-center gap-1">
                  <Info className="h-4 w-4 text-teal-500" />
                  Recipient Identity
                </h3>
                <button onClick={() => setShowProfileDrawer(false)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 text-center space-y-6">
                {/* Visual Avatar */}
                <div className="space-y-2.5">
                  <div className="h-20 w-20 rounded-2xl bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-800 overflow-hidden mx-auto flex items-center justify-center font-black text-teal-500 text-2xl shadow-sm">
                    {activeConv.recipient.avatar ? (
                      <img src={activeConv.recipient.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      activeConv.recipient.display_name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                      {activeConv.recipient.display_name}
                    </h4>
                    <p className="text-[10px] text-neutral-450 dark:text-zinc-500 font-bold">@{activeConv.recipient.username}</p>
                  </div>
                </div>

                {/* Identity profile stats */}
                <div className="p-3.5 rounded-2xl border border-neutral-200/50 dark:border-zinc-800/50 bg-neutral-50/50 dark:bg-zinc-900/30 text-left space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">Registered Email</span>
                    <span className="text-[11px] text-neutral-700 dark:text-zinc-300 font-extrabold truncate block">{activeConv.recipient.email}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">System Bio / Status</span>
                    <span className="text-[11px] text-neutral-500 dark:text-zinc-400 font-semibold block leading-relaxed">
                      {activeConv.recipient.bio || 'Verified node in the Sugora distributed platform.'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-400 block">Network Role</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                      activeConv.recipient.role === 'Admin' ? 'bg-teal-500/10 text-teal-600' : activeConv.recipient.role === 'Support' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500'
                    }`}>
                      {activeConv.recipient.role}
                    </span>
                  </div>
                </div>

                {/* Shard handshake details */}
                <div className="p-3.5 rounded-2xl border border-neutral-200/50 dark:border-zinc-800/50 bg-teal-500/5 text-left space-y-2.5">
                  <h5 className="text-[9px] uppercase font-extrabold tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Handshake Encryption
                  </h5>
                  <div className="space-y-1 font-mono text-[9px] text-neutral-400 dark:text-zinc-500">
                    <p className="truncate"><span className="font-semibold text-neutral-500">ID Key:</span> {activeConv.recipient.id}</p>
                    <p><span className="font-semibold text-neutral-500">Cipher:</span> AES-256-GCM</p>
                    <p><span className="font-semibold text-neutral-500">Handshake:</span> Verified OK</p>
                  </div>
                </div>

                {/* Advanced Action Cards */}
                <div className="space-y-2.5 pt-4 border-t border-neutral-100 dark:border-zinc-900">
                  <button
                    onClick={handleToggleBlock}
                    className={`w-full py-2.5 px-4 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      activeConv.blocked_by?.includes(currentUser.id)
                        ? 'border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'border-neutral-200 hover:border-red-500 dark:border-zinc-800 hover:bg-red-500/5 text-neutral-600 hover:text-red-500 dark:text-zinc-400'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>{activeConv.blocked_by?.includes(currentUser.id) ? 'Unblock Shard Handshake' : 'Block Shard Handshake'}</span>
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-zinc-800 hover:border-amber-500 hover:bg-amber-500/5 text-xs font-extrabold flex items-center justify-center gap-2 text-neutral-600 hover:text-amber-500 dark:text-zinc-400 transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Report Pipeline Incident</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL: DIRECT MESSAGE NEW USER START */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-neutral-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-teal-500" />
                  Spin up Direct Message
                </h3>
                <button onClick={() => setShowNewChatModal(false)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search user by display name or @username..." 
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-855"
                />
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pt-2">
                {filteredUsersToChat.length === 0 ? (
                  <p className="text-center py-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">No matching users</p>
                ) : (
                  filteredUsersToChat.map(user => (
                    <div
                      key={user.id}
                      onClick={() => handleStartDirectChat(user)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 cursor-pointer transition-all"
                    >
                      <div className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-black text-teal-600 text-xs shrink-0">
                        {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.display_name.slice(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-xs text-neutral-900 dark:text-white">{user.display_name}</p>
                        <p className="text-[10px] text-neutral-400">@{user.username} • {user.role}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FORWARD MESSAGE SELECTION */}
      <AnimatePresence>
        {showForwardModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-neutral-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-2xl text-left space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <CornerUpRight className="h-4.5 w-4.5 text-teal-500" />
                  Forward Message
                </h3>
                <button onClick={() => setShowForwardModal(null)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <p className="text-[11px] text-neutral-450 dark:text-zinc-500 font-medium bg-neutral-50 dark:bg-zinc-900 p-2.5 rounded-xl border border-neutral-150 dark:border-zinc-850 truncate">
                {showForwardModal.text || 'Forward shared attachment'}
              </p>

              <div className="max-h-60 overflow-y-auto space-y-1 pt-2">
                {profilesList.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleForwardMessage(user.id)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-neutral-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center font-black text-teal-600 text-xs shrink-0">
                        {user.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : user.display_name.slice(0,2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-xs text-neutral-900 dark:text-white">{user.display_name}</p>
                        <p className="text-[10px] text-neutral-450">@{user.username}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-teal-500 hover:underline">Select</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DRAWER: STARRED MESSAGES LOGS */}
      <AnimatePresence>
        {starredOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-55">
            <motion.aside 
              initial={{ x: 350 }}
              animate={{ x: 0 }}
              exit={{ x: 350 }}
              className="w-full max-w-sm h-full bg-white dark:bg-zinc-950 border-l border-neutral-200 dark:border-zinc-800 flex flex-col z-55"
            >
              <div className="h-14 border-b border-neutral-150 dark:border-zinc-900 px-4 flex items-center justify-between shrink-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 animate-pulse" />
                  Starred Shard Messages
                </h3>
                <button onClick={() => setStarredOpen(false)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.filter(m => m.starred_by?.includes(currentUser.id)).length === 0 ? (
                  <p className="text-center py-12 text-xs font-extrabold text-neutral-400 uppercase tracking-widest">No starred messages yet</p>
                ) : (
                  messages.filter(m => m.starred_by?.includes(currentUser.id)).map(stMsg => (
                    <div key={stMsg.id} className="p-3 bg-neutral-50 dark:bg-zinc-900 rounded-xl border border-neutral-150 dark:border-zinc-850 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-black uppercase text-neutral-450 dark:text-zinc-500">
                        <span>@{stMsg.sender_id === currentUser.id ? 'You' : activeConv?.recipient?.username}</span>
                        <span>{new Date(stMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs font-medium dark:text-zinc-200">{stMsg.text}</p>
                      <button 
                        onClick={() => handleToggleStar(stMsg.id)} 
                        className="text-[9px] text-red-500 hover:underline font-bold"
                      >
                        Unstar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: USER PRIVACY SETTINGS */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-zinc-955 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-left space-y-5 z-55"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-teal-500" />
                  Cryptographic Privacy Keys
                </h3>
                <button onClick={() => setShowPrivacyModal(false)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-zinc-300">Share Online Status Presence</label>
                    <p className="text-[10px] text-neutral-400">Let peers inspect when your node key is active online.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings?.online_status === 'everyone'}
                    onChange={(e) => {
                      const updated = { online_status: (e.target.checked ? 'everyone' : 'nobody') as 'everyone' | 'nobody' };
                      setPrivacySettings((prev: any) => ({ ...prev, ...updated }));
                      chatStore.updatePrivacySettings(currentUser.id, updated);
                    }}
                    className="h-4 w-4 text-teal-500 border-neutral-300 rounded focus:ring-teal-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-zinc-300">Share Read Receipts</label>
                    <p className="text-[10px] text-neutral-400">Enable peer nodes to verify delivered and read handshake ticks.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!privacySettings?.read_receipts}
                    onChange={(e) => {
                      const updated = { read_receipts: e.target.checked };
                      setPrivacySettings((prev: any) => ({ ...prev, ...updated }));
                      chatStore.updatePrivacySettings(currentUser.id, updated);
                    }}
                    className="h-4 w-4 text-teal-500 border-neutral-300 rounded focus:ring-teal-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-zinc-300">Restrict Messaging Keying</label>
                    <p className="text-[10px] text-neutral-400">Restricts message handshakes only to contacts/trusted peers.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={privacySettings?.who_can_message === 'everyone'}
                    onChange={(e) => {
                      const updated = { who_can_message: (e.target.checked ? 'everyone' : 'contacts') as 'everyone' | 'contacts' };
                      setPrivacySettings((prev: any) => ({ ...prev, ...updated }));
                      chatStore.updatePrivacySettings(currentUser.id, updated);
                    }}
                    className="h-4 w-4 text-teal-500 border-neutral-300 rounded focus:ring-teal-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-xl text-xs uppercase"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: REPORT CONVERSATION INCIDENT */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-55">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl text-left space-y-4 z-55"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                  Report Shard Incident
                </h3>
                <button onClick={() => setShowReportModal(false)} className="p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-400">Incident Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none font-bold"
                  >
                    <option value="spam">Spamming / Flooding packets</option>
                    <option value="abuse">Harassment / Verbal Abuse</option>
                    <option value="malware">Malicious File Shards</option>
                    <option value="other">Other Violation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-400">Additional Log Details</label>
                  <textarea
                    placeholder="Provide specific technical or dialogue log context..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                    className="w-full mt-1 px-3 py-2 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none font-medium resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2 border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-900 font-extrabold text-neutral-500 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReportSubmit}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl text-xs"
                >
                  File Incident Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: FULLSCREEN LIGHTBOX & IMAGE GALLERY SLIDER */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 z-[100] select-none">
            <button 
              onClick={() => setLightboxImage(null)} 
              className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Previous Image Trigger */}
            <button
              onClick={() => {
                const imageMsgs = messages.filter(m => m.type === 'image' && m.attachment?.file_url);
                if (imageMsgs.length > 0) {
                  const prevIdx = (lightboxIndex - 1 + imageMsgs.length) % imageMsgs.length;
                  setLightboxIndex(prevIdx);
                  setLightboxImage(imageMsgs[prevIdx].attachment!.file_url);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Image Trigger */}
            <button
              onClick={() => {
                const imageMsgs = messages.filter(m => m.type === 'image' && m.attachment?.file_url);
                if (imageMsgs.length > 0) {
                  const nextIdx = (lightboxIndex + 1) % imageMsgs.length;
                  setLightboxIndex(nextIdx);
                  setLightboxImage(imageMsgs[nextIdx].attachment!.file_url);
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Display active image */}
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center gap-3">
              <img src={lightboxImage} alt="" className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl" referrerPolicy="no-referrer" />
              <p className="text-[10px] font-mono font-bold text-neutral-450 dark:text-zinc-500">
                Image Shard {lightboxIndex + 1} of {messages.filter(m => m.type === 'image' && m.attachment?.file_url).length}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION TOOLBAR: MULTI-SELECT OPERATIONS */}
      <AnimatePresence>
        {multiSelectMode && selectedMessageIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-14 left-1/2 -translate-x-1/2 bg-neutral-900/95 dark:bg-zinc-950/95 border border-zinc-800 text-white shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-6 z-55 select-none backdrop-blur-md"
          >
            <span className="text-xs font-black font-mono tracking-wider text-teal-400">
              {selectedMessageIds.length} Shards Selected
            </span>

            <div className="h-4 w-[1px] bg-neutral-700" />

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const firstSelectedMsg = messages.find(m => m.id === selectedMessageIds[0]);
                  if (firstSelectedMsg) {
                    setShowForwardModal(firstSelectedMsg);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 font-extrabold text-[10px] transition-all uppercase"
              >
                <CornerUpRight className="h-3.5 w-3.5" />
                <span>Forward ({selectedMessageIds.length})</span>
              </button>

              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 font-extrabold text-[10px] transition-all uppercase"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Selected</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Footer */}
      <footer className="h-10 border-t border-neutral-100 dark:border-zinc-900 bg-neutral-50/50 dark:bg-zinc-950 px-6 flex items-center justify-between text-[10px] text-neutral-450 dark:text-zinc-500 shrink-0">
        <span className="flex items-center gap-1">
          Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Sugora Labs Inc.
        </span>
        <span>Version 3.0.0 (Core Message Pipeline)</span>
      </footer>
    </div>
  );
}
