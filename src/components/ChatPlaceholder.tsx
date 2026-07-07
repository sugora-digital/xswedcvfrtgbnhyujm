import React, { useEffect, useState, useRef } from 'react';
import { supabaseClient } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { chatStore, ChatMessage, Conversation, ChatSettings } from '../lib/chatStore';
import { MediaLinksDocsDrawer } from './chat/MediaLinksDocsDrawer';
import { StarredMessagesDrawer } from './chat/StarredMessagesDrawer';
import { MessageInfoDrawer } from './chat/MessageInfoDrawer';
import { CallsPanel } from './chat/panels/CallsPanel';
import { ContactsPanel } from './chat/panels/ContactsPanel';
import { GroupsPanel } from './chat/panels/GroupsPanel';
import { NewGroupPanel } from './chat/panels/NewGroupPanel';
import { ArchivedPanel } from './chat/panels/ArchivedPanel';
import { StarredPanel } from './chat/panels/StarredPanel';
import { SettingsPanel } from './chat/panels/SettingsPanel';
import { LogOut, ShieldCheck, MessageSquare, Users, Settings, Hash, Send, Bell, Search, Sun, Moon, Monitor, ArrowLeft, Code, Sparkles, Check, CheckCheck, Heart, User, Pin, Archive, VolumeX, Trash2, Edit2, Reply, CornerUpRight, Copy, Paperclip, Image as ImageIcon, FileText, Film, Music, Mic, Smile, X, Info, ChevronLeft, ArrowDown, ChevronRight, Star, AlertTriangle, ShieldAlert, CheckSquare, Square, Download, Share2, Phone, Video, MoreVertical, BadgeCheck, Camera, Edit3, Plus, SlidersHorizontal } from 'lucide-react';
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

function safeFormatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

function safeFormatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  } catch (_) {
    return '';
  }
}

export default function ChatPlaceholder() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [username, setUsername] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  // Store lists & filters
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [activeNavTab, setActiveNavTab] = useState('chats');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'groups' | 'calls'>('all');
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
  const [longPressMessage, setLongPressMessage] = useState<ChatMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Custom attachment states
  const [attachment, setAttachment] = useState<{ name: string; size: number; type: string; base64: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMediaDrawer, setShowMediaDrawer] = useState(false);
  const [showStarredDrawer, setShowStarredDrawer] = useState(false);
  const [messageInfoMsg, setMessageInfoMsg] = useState<ChatMessage | null>(null);
  const [showForwardModal, setShowForwardModal] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Search User to start direct message
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [showNewDMPopup, setShowNewDMPopup] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
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
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [chatSearchText, setChatSearchText] = useState('');
  const [starredOpen, setStarredOpen] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportDetails, setReportDetails] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Authenticate and join store
  useEffect(() => {
    let active = true;
    async function getUser() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (!active) return;
        
        if (data?.session?.user) {
          const user = data.session.user;
          
          // Force wait/validate profile exist and fetched from database
          let profileLoaded = false;
          let retries = 5;
          let userProfile: any = null;
          
          while (retries > 0 && !profileLoaded && active) {
            try {
              const { data: profileList } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id);
              
              if (profileList && profileList.length > 0) {
                userProfile = profileList[0];
                profileLoaded = true;
              } else {
                await new Promise((resolve) => setTimeout(resolve, 400));
                retries--;
              }
            } catch (_) {
              await new Promise((resolve) => setTimeout(resolve, 400));
              retries--;
            }
          }
          
          if (!profileLoaded && active) {
            // Profile fallback: create dynamic mock-to-real profile insert
            const emailLower = user.email?.toLowerCase() || '';
            const isSpecialSignup = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(emailLower);
            const usernameVal = user.user_metadata?.username || emailLower.split('@')[0] || 'user_' + Math.random().toString(36).substring(2, 7);
            
            let role = 'User';
            if (emailLower === 'ceo.neomcq@gmail.com' || emailLower.includes('admin')) {
              role = 'Admin';
            } else if (emailLower.includes('support')) {
              role = 'Support';
            }
            
            const profileData = {
              id: user.id,
              username: usernameVal.toLowerCase().trim(),
              email: emailLower,
              display_name: usernameVal,
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
              bio: '',
              email_verified: isSpecialSignup ? true : false,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString(),
              online_status: 'online',
              status: 'Active',
              role: role
            };
            
            try {
              await supabaseClient.from('profiles').insert(profileData);
              userProfile = profileData;
            } catch (_) {
              userProfile = profileData;
            }
          }
          
          if (active && userProfile) {
            setCurrentUser({ ...user, ...userProfile, avatar_url: userProfile.avatar });
            setUsername(userProfile.username || user.user_metadata?.username || user.email?.split('@')[0] || 'sugora_user');
            // Set user presence online
            chatStore.setPresence(user.id, 'online');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    getUser();

    // Cleanup presence offline
    return () => {
      active = false;
      const saved = localStorage.getItem('sugora_real_auth_bypass_session') || localStorage.getItem('sugora_mock_session');
      if (saved) {
        try {
          const session = JSON.parse(saved);
          if (session?.user?.id) {
            chatStore.setPresence(session.user.id, 'offline');
          }
        } catch (_) {}
      }
    };
  }, []);

  // Sync conversation list and details from the store reactively
  useEffect(() => {
    if (!currentUser) return;

    // Trigger offline fast boot, then cloud sync
    if (!chatStore.isLoaded) {
      chatStore.loadFromIDB().then(() => {
        chatStore.syncWithSupabase(currentUser.id);
      });
    } else {
      chatStore.syncWithSupabase(currentUser.id);
    }

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


  // Force scroll to bottom when switching conversations
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    setShowScrollButton(false);
  }, [activeConv?.id]);

  // Handle Intelligent Auto-Scroll

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Check if we are near the bottom (within 150px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShowScrollButton(false);
    } else {
      setShowScrollButton(true);
    }
  }, [messages, typingUsers]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      setShowScrollButton(false);
    }
  };

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


  // --- MOBILE BACK NAVIGATION ---
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // If we are in a conversation and user presses back, close the conversation instead of navigating away.
      if (activeConv) {
        e.preventDefault();
        setActiveConv(null);
        // We pushed state when entering conv, so popping goes back to the chat list (which is /chat)
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeConv]);

  // Push state when entering a conversation
  useEffect(() => {
    if (activeConv) {
      window.history.pushState({ chat: activeConv.id }, '', '/chat');
    }
  }, [activeConv?.id]);


  // Auto-grow textarea
  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.style.height = 'auto';
      textInputRef.current.style.height = `${Math.min(textInputRef.current.scrollHeight, 120)}px`;
    }
  }, [messageText]);
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
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
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
    const dm = conversations.find(c => c.type === 'one-to-one' && c.recipient?.id === recipient.id);
    if (dm) {
      setActiveConv(dm);
    } else {
      const conv = chatStore.startConversation(currentUser.id, recipient.id, 'one-to-one');
      const augmented = { ...conv, recipient, unreadCount: 0 };
      setActiveConv(augmented);
    }
    setIsNewChatOpen(false);
    setUserSearchQuery('');
  };

  // Filters conversation list
  const filteredConversations = conversations.filter(c => {
    // Tab filters
    if (activeTab === 'unread' && c.unreadCount === 0) return false;
    const archivedList = c.archived_by ?? [];
    if (activeTab === 'groups' && c.type !== 'group') return false;
    if (activeTab === 'archived' && !archivedList.includes(currentUser?.id)) return false; // fallback if needed
    if (activeTab !== 'archived' && archivedList.includes(currentUser?.id)) return false;

    // Filter out conversations with no messages, UNLESS it's the active one
    const hasMessages = !!c.lastMessage;
    if (!hasMessages && activeConv?.id !== c.id) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const userMatch = c.recipient?.display_name?.toLowerCase().includes(q) || c.recipient?.username?.toLowerCase().includes(q);
      const textMatch = c.lastMessage?.text?.toLowerCase().includes(q);
      return userMatch || textMatch;
    }
    return true;
  });

  // Find profiles (users) matching the search query that don't already have an active conversation
  const filteredUsersToChat = chatStore.getProfiles().filter(p => {
    // Exclude current logged-in user
    if (p.id === currentUser?.id) return false;

    // Exclude deleted and disabled accounts
    const isDeleted = p.status?.toLowerCase() === 'deleted' || (p as any).deleted === true;
    const isDisabled = p.status?.toLowerCase() === 'disabled' || p.status?.toLowerCase() === 'suspended' || (p as any).disabled === true;
    if (isDeleted || isDisabled) return false;

    // Search query
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true; // Show all active users by default if query is empty

    const displayName = (p.display_name || '').toLowerCase();
    const username = (p.username || '').toLowerCase();
    const email = (p.email || '').toLowerCase();
    const fullName = ((p as any).full_name || '').toLowerCase();

    // Exact matches
    const isExactUsername = username === q || username === q.replace(/^@/, '');
    const isExactDisplayName = displayName === q;
    const isExactFullName = fullName === q;

    // Partial matches
    const isPartialUsername = username.includes(q) || username.includes(q.replace(/^@/, ''));
    const isPartialDisplayName = displayName.includes(q);
    const isPartialFullName = fullName.includes(q);
    const isPartialEmail = email.includes(q);

    return isExactUsername || isExactDisplayName || isExactFullName || isPartialUsername || isPartialDisplayName || isPartialFullName || isPartialEmail;
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
  const profilesList = chatStore.getProfiles().filter(p => {
    const isSelf = p.id === currentUser?.id;
    const isActive = !p.status || p.status.toLowerCase() === 'active';
    return !isSelf && isActive;
  });

  return (
    <div 
      className="h-[100dvh] w-full bg-[#F8FAFC] dark:bg-[#09090B] text-slate-900 dark:text-neutral-50 flex flex-col md:flex-row transition-colors duration-300 select-none overflow-hidden"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Left Navigation (Desktop) */}
      <nav className={`hidden md:flex flex-col w-[260px] lg:w-[280px] bg-[#F8FAFC] dark:bg-[#09090B] shrink-0 border-r border-neutral-200/50 dark:border-zinc-800/50 h-full p-4 ${activeConv ? 'hidden md:flex' : 'flex'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] p-[1px] shadow-sm">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-white dark:bg-zinc-900">
              <Sparkles className="h-4.5 w-4.5 text-[#7B61FF]" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Sugora
          </span>
        </div>

        {/* Nav Items */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-thin">
          {[
            { id: 'chats', label: 'Chats', icon: MessageSquare, badge: filteredConversations.reduce((acc, c) => acc + c.unreadCount, 0) || null, color: 'text-[#6C4EFF]', activeBg: 'bg-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)]' },
            { id: 'calls', label: 'Calls', icon: Phone, color: 'text-[#6C4EFF]' },
            { id: 'contacts', label: 'Contacts', icon: Users, color: 'text-[#00C8FF]' },
            { id: 'groups', label: 'Groups', icon: Users, color: 'text-[#FF4081]' },
            { id: 'starred', label: 'Starred', icon: Star, color: 'text-[#FFB300]' },
            { id: 'archived', label: 'Archived', icon: Archive, color: 'text-[#6C4EFF]' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveNavTab(item.id); setActiveConv(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[16px] transition-all duration-200 cursor-pointer group relative ${
                activeNavTab === item.id 
                  ? 'bg-white dark:bg-zinc-900 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] border border-neutral-100 dark:border-zinc-800/50' 
                  : 'hover:bg-neutral-100/60 dark:hover:bg-zinc-900/40 text-neutral-500 dark:text-zinc-400 border border-transparent'
              }`}
            >
              {activeNavTab === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#6C4EFF] rounded-r-full" />
              )}
              <div className="flex items-center gap-4 pl-1">
                <item.icon className={`h-5 w-5 transition-colors ${activeNavTab === item.id ? item.color : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-300'}`} />
                <span className={`text-[15px] ${
                  activeNavTab === item.id ? 'text-[#6C4EFF] font-semibold' : 'font-medium'
                }`}>
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-[#6C4EFF] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          <div className="mt-8 mb-2">
            {[
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'help', label: 'Help & Support', icon: Info },
            ].map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-4 px-3 pl-4 py-2.5 rounded-[16px] transition-all duration-200 cursor-pointer group hover:bg-neutral-100/60 dark:hover:bg-zinc-900/40 text-neutral-500 dark:text-zinc-400"
              >
                <item.icon className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-zinc-300" />
                <span className="text-[15px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Profile Box */}
        <div className="mt-auto pt-4 flex flex-col gap-4">
          <button onClick={() => setShowProfileDrawer(true)} className="flex items-center justify-between p-2 rounded-[20px] bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.username} className="h-full w-full object-cover" />
                  ) : (
                    (currentUser.display_name || currentUser.username || 'U').substring(0,2).toUpperCase()
                  )}
                </div>
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-bold text-neutral-900 dark:text-white truncate pr-2">{currentUser.display_name || currentUser.username}</span>
                <span className="text-[11px] font-medium text-green-500">Online</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 mr-1" />
          </button>
          
          <div className="p-4 rounded-[20px] bg-gradient-to-br from-[#6C4EFF] via-[#7B61FF] to-[#FF4081] text-white shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2)_0%,transparent_50%)]" />
            <div className="relative z-10 flex flex-col items-start gap-2">
              <h4 className="font-bold text-sm">Sugora Premium</h4>
              <p className="text-[11px] text-white/90 leading-tight mb-1 font-medium">Unlock exclusive features and cloud storage.</p>
              <button className="px-4 py-2 bg-white text-[#6C4EFF] hover:bg-neutral-50 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer w-full flex items-center justify-center gap-2">
                <Star className="h-3.5 w-3.5" />
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-white dark:bg-zinc-950 md:rounded-l-[40px] md:border-l border-neutral-200/60 dark:border-zinc-800/60 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
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
          className={`w-full md:w-[320px] lg:w-[360px] border-r border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#09090B] flex flex-col shrink-0 z-10 transition-all duration-300 ${activeConv ? 'hidden md:flex md:flex-none' : 'flex flex-1 md:flex-none'}`}
        >
          {activeNavTab === 'calls' ? (
            <CallsPanel currentUser={currentUser} />
          ) : activeNavTab === 'contacts' ? (
            <ContactsPanel currentUser={currentUser} onStartChat={handleStartDirectChat} />
          ) : activeNavTab === 'groups' ? (
            <GroupsPanel currentUser={currentUser} conversations={conversations} onSelectGroup={setActiveConv} />
          ) : activeNavTab === 'starred' ? (
            <StarredPanel currentUser={currentUser} onJumpToMessage={(convId, msgId) => {
              const conv = conversations.find(c => c.id === convId);
              if (conv) setActiveConv(conv);
              setTimeout(() => {
                const el = document.getElementById('msg-' + msgId);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 300);
            }} />
          ) : activeNavTab === 'archived' ? (
            <ArchivedPanel currentUser={currentUser} conversations={conversations} onSelectChat={setActiveConv} />
          ) : activeNavTab === 'settings' ? (
            <SettingsPanel currentUser={currentUser} onLogOut={handleSignOut} />
          ) : isNewGroupOpen ? (
            <NewGroupPanel 
              currentUser={currentUser} 
              onCancel={() => setIsNewGroupOpen(false)} 
              onGroupCreated={(group) => {
                setIsNewGroupOpen(false);
                setActiveConv(group);
              }}
            />
          ) : isNewChatOpen ? (
            <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
              {/* Header with back button */}
              <div className="p-4 border-b border-neutral-100 dark:border-zinc-900 flex items-center gap-3 shrink-0 bg-neutral-50/50 dark:bg-zinc-950">
                <button 
                  onClick={() => {
                    setIsNewChatOpen(false);
                    setUserSearchQuery('');
                  }}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-500 dark:text-zinc-400 cursor-pointer"
                  title="Back to Chats"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-zinc-100">
                    New Chat
                  </h2>
                  <p className="text-[10px] text-neutral-400">Select peer to start conversation</p>
                </div>
              </div>

              {/* Search input (fixed at top, always visible) */}
              <div className="p-4 border-b border-neutral-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-450" />
                  <input 
                    type="text" 
                    placeholder="Search by username or name..." 
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setIsSearchLoading(true);
                      const timer = setTimeout(() => setIsSearchLoading(false), 200);
                      return () => clearTimeout(timer);
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850 focus:border-teal-500 dark:focus:border-teal-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              {/* Users List or Loading indicator or Empty State */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {isSearchLoading ? (
                  <div className="text-center py-12 px-4 space-y-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent mx-auto" />
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500 uppercase tracking-wider font-extrabold">Filtering peer nodes...</p>
                  </div>
                ) : filteredUsersToChat.length === 0 ? (
                  <div className="text-center py-12 px-4 space-y-2">
                    <Users className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
                    <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No users found</p>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-550">No peer profiles match your query.</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filteredUsersToChat.map((user) => {
                      const isOnline = chatStore.getPresence(user.id).status === 'online';
                      return (
                        <div
                          key={user.id}
                          onClick={() => handleStartDirectChat(user)}
                          className="flex items-center gap-3 p-3 rounded-[20px] hover:bg-white dark:hover:bg-zinc-900 shadow-sm cursor-pointer transition-all border border-transparent hover:border-neutral-100 dark:hover:border-zinc-800"
                        >
                          <div className="relative shrink-0 pointer-events-none">
                            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 overflow-hidden flex items-center justify-center font-bold text-[#6C4EFF] text-xs">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.display_name} className="h-full w-full object-cover animate-fade-in" />
                              ) : (
                                (user.display_name || '').substring(0, 2).toUpperCase()
                              )}
                            </div>
                            {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#10B981] ring-2 ring-white dark:ring-zinc-950" />}
                          </div>
                          <div className="min-w-0 flex-1 pointer-events-none">
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-[14px] text-neutral-900 dark:text-white truncate">
                                {user.display_name}
                              </p>
                              {user.email_verified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-[#6C4EFF] fill-[#6C4EFF]/10" />
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 font-medium truncate">@{user.username}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (<>
              {/* Search bar and Filters header */}
              <div className="p-4 space-y-4 shrink-0 bg-[#F8FAFC]/50 dark:bg-[#09090B]/50 backdrop-blur-xl border-b border-neutral-200/50 dark:border-zinc-800/50 relative z-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Chats
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="h-10 w-10 flex items-center justify-center rounded-full border border-neutral-200/60 dark:border-zinc-800/60 text-neutral-500 hover:text-neutral-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                      <Edit3 className="h-[18px] w-[18px]" />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={() => setShowNewDMPopup(!showNewDMPopup)}
                        className="px-4 h-10 rounded-full bg-gradient-to-tr from-[#6C4EFF] to-[#00C8FF] hover:opacity-90 text-white font-semibold text-[14px] flex items-center gap-1.5 shadow-[0_4px_15px_-3px_rgba(108,78,255,0.4)] transition-all cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                        <span>New DM</span>
                      </button>
                      
                      {showNewDMPopup && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowNewDMPopup(false)} />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-zinc-800 p-1.5 z-50 animate-fade-in origin-top-right">
                            <button
                              onClick={() => { setShowNewDMPopup(false); setIsNewChatOpen(true); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors text-left"
                            >
                              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-neutral-900 dark:text-white leading-none">Personal Chat</span>
                                <span className="text-[11px] font-medium text-neutral-500 mt-1">Start a direct message</span>
                              </div>
                            </button>
                            
                            <div className="h-px w-full bg-neutral-100 dark:bg-zinc-800 my-1" />
                            
                            <button
                              onClick={() => { setShowNewDMPopup(false); setIsNewGroupOpen(true); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors text-left group"
                            >
                              <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[14px] font-bold text-neutral-900 dark:text-white leading-none group-hover:text-emerald-600 transition-colors">Create Group</span>
                                <span className="text-[11px] font-medium text-neutral-500 mt-1">Chat with multiple people</span>
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-neutral-400 group-focus-within:text-[#6C4EFF] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search messages..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-11 py-3 bg-white dark:bg-zinc-900 rounded-[20px] text-[14px] focus:outline-none border border-neutral-200/60 dark:border-zinc-800/60 focus:border-[#6C4EFF]/50 focus:ring-4 focus:ring-[#6C4EFF]/10 transition-all shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] font-medium"
                    />
                    <button className="absolute right-3.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-neutral-100 dark:bg-zinc-800 rounded-full text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer">
                      <SlidersHorizontal className="h-[14px] w-[14px]" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 px-2 mt-3 mb-1 overflow-x-auto scrollbar-none relative pb-1">
                  {[
                    { id: 'all', icon: MessageSquare },
                    { id: 'unread', icon: Bell },
                    { id: 'groups', icon: Users }
                  ].map((tabObj) => {
                    const tab = tabObj.id as 'all' | 'unread' | 'groups' | 'calls';
                    const Icon = tabObj.icon;
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-3.5 py-1.5 text-[13px] font-bold capitalize transition-all duration-300 cursor-pointer overflow-hidden rounded-[14px] flex-shrink-0 group flex items-center gap-1.5 ${
                          isActive 
                            ? 'text-[#6C4EFF] dark:text-[#7B61FF]' 
                            : 'text-neutral-500 dark:text-zinc-400 hover:text-neutral-800 dark:hover:text-zinc-200'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeFilterTabPill"
                            className="absolute inset-0 bg-[#6C4EFF]/10 dark:bg-[#7B61FF]/15 border border-[#6C4EFF]/20 dark:border-[#7B61FF]/30 rounded-[14px] z-0"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <Icon className={`relative z-10 h-3.5 w-3.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:-rotate-3'}`} />
                        <span className="relative z-10 transform transition-transform duration-300">{tab}</span>
                        
                        {!isActive && (
                          <div className="absolute inset-0 bg-neutral-100 dark:bg-zinc-800/80 rounded-[14px] opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 z-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

          {/* Conversation List Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <MessageSquare className="h-8 w-8 text-neutral-350 dark:text-zinc-700 mx-auto" />
                <p className="text-xs font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConversations.length > 0 && (
                  <div className="space-y-1">
                    {searchQuery && (
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                        Active Chats ({filteredConversations.length})
                      </div>
                    )}
                    {filteredConversations.map((conv) => {
                      const recipient = conv.recipient;
                      if (!recipient) return null;
                      const isPinned = conv.pinned_by?.includes(currentUser?.id);
                      const isMuted = conv.muted_by?.includes(currentUser?.id);
                      const isOnline = chatStore.getPresence(recipient.id).status === 'online';
                      const hasUnread = conv.unreadCount > 0;
                      
                      return (
                        <div key={conv.id} className="relative overflow-hidden rounded-[20px] mb-1.5 group">
                          {/* Background Swipe Actions */}
                          <div className="absolute inset-y-0 right-0 flex items-center justify-end px-3 gap-2 w-full bg-neutral-100 dark:bg-zinc-900 rounded-[20px]">
                            <button className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-neutral-500 hover:text-amber-500 transition-colors cursor-pointer">
                              <Archive className="h-4 w-4" />
                            </button>
                            <button className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-neutral-500 hover:text-[#6C4EFF] transition-colors cursor-pointer">
                              <VolumeX className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); chatStore.deleteConversation(conv.id, currentUser.id); }}
                              className="h-10 w-10 rounded-full bg-red-50 dark:bg-red-500/10 shadow-sm flex items-center justify-center text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {/* Foreground Card */}
                          <motion.div
                            drag="x"
                            dragConstraints={{ left: -160, right: 0 }}
                            dragElastic={0.1}
                            dragDirectionLock
                            onClick={() => {
                              setActiveConv(conv);
                              chatStore.markAsRead(conv.id, currentUser.id);
                            }}
                            className={`relative z-10 flex items-center gap-3.5 p-3 rounded-[20px] cursor-pointer transition-all select-none ${
                              activeConv?.id === conv.id
                                ? 'bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-neutral-100 dark:border-zinc-800/80 scale-[1.02]'
                                : 'bg-[#F8FAFC] hover:bg-white dark:bg-[#09090B] dark:hover:bg-zinc-900/60 border border-transparent hover:border-neutral-100 dark:hover:border-zinc-800/50'
                            }`}
                          >
                            {/* Premium Avatar */}
                            <div className="relative shrink-0 pointer-events-none">
                              <div className="h-[52px] w-[52px] rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-sm overflow-hidden border border-white/50 dark:border-zinc-800/50 shadow-sm">
                                {recipient.avatar ? (
                                  <img src={recipient.avatar} alt={recipient.display_name ?? 'Recipient'} className="h-full w-full object-cover" />
                                ) : (
                                  (recipient.display_name ?? '').slice(0, 2).toUpperCase()
                                )}
                              </div>
                              {/* Online Indicator */}
                              {isOnline && (
                                <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full bg-[#10B981] border-[2.5px] border-[#F8FAFC] group-hover:border-white dark:border-zinc-900 transition-colors" />
                              )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center pointer-events-none pr-1">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-[15px] truncate flex items-center gap-1.5 text-neutral-900 dark:text-white">
                                  {recipient.display_name}
                                  {recipient.email_verified && (
                                    <BadgeCheck className="h-4 w-4 text-[#6C4EFF] fill-[#6C4EFF]/10" />
                                  )}
                                </span>
                                <span className={`text-[11px] shrink-0 font-medium ${hasUnread ? 'text-[#6C4EFF] font-bold' : 'text-neutral-400'}`}>
                                  {conv.lastMessage ? new Date(conv.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-[13px] truncate flex-1 leading-snug ${hasUnread ? 'text-neutral-900 dark:text-zinc-200 font-semibold' : 'text-neutral-500 dark:text-zinc-400 font-medium'}`}>
                                  {chatStore.getTypingUsers(conv.id, currentUser.id).length > 0 ? (
                                    <span className="text-[#00C8FF] font-semibold flex items-center gap-1">
                                      Typing...
                                    </span>
                                  ) : conv.lastMessage ? (
                                    conv.lastMessage.deleted_for_everyone ? (
                                      <span className="italic text-neutral-400">Deleted message</span>
                                    ) : (
                                      conv.lastMessage.text || (
                                        <span className="flex items-center gap-1">
                                          <ImageIcon className="h-3.5 w-3.5" /> Media
                                        </span>
                                      )
                                    )
                                  ) : (
                                    <span className="text-neutral-400">Draft</span>
                                  )}
                                </p>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {isPinned && <Pin className="h-3.5 w-3.5 text-neutral-400 rotate-45" />}
                                  {isMuted && <VolumeX className="h-3.5 w-3.5 text-neutral-400" />}
                                  {hasUnread && (
                                    <span className="h-[20px] min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-[#6C4EFF] text-white font-bold text-[11px] shadow-[0_2px_8px_-2px_rgba(108,78,255,0.4)]">
                                      {conv.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </aside>



        {/* MAIN MESSAGING CANVAS AREA */}
        <main className={`flex-1 bg-white dark:bg-[#09090B] flex flex-col relative overflow-hidden ${activeConv ? 'flex' : 'hidden md:flex'}`}>
          {activeConv ? (
            <>
              {/* Active Header bar */}
              <div className="h-[76px] border-b border-neutral-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-xl px-4 flex items-center justify-between shrink-0 z-10 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={() => setActiveConv(null)}
                    className="h-10 w-10 rounded-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 md:hidden shrink-0 transition-colors"
                  >
                    <ArrowLeft className="h-[22px] w-[22px]" />
                  </button>
                  
                  {/* Premium Header Avatar */}
                  <div className="relative shrink-0 flex items-center gap-3.5 cursor-pointer group" onClick={() => setShowProfileDrawer(true)}>
                    <div className="relative">
                      <div className="h-[50px] w-[50px] rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-sm overflow-hidden border border-neutral-100 dark:border-zinc-800/80 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] group-hover:shadow-md transition-all">
                        {activeConv.type === 'group' ? (
                          activeConv.avatar ? (
                            <img src={activeConv.avatar} alt={activeConv.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-white bg-indigo-500">{(activeConv.title || 'G').slice(0, 2).toUpperCase()}</div>
                          )
                        ) : activeConv.recipient?.avatar ? (
                          <img src={activeConv.recipient.avatar} alt={activeConv.recipient?.display_name ?? 'Recipient'} className="h-full w-full object-cover" />
                        ) : (
                          (activeConv.recipient?.display_name ?? '').slice(0, 2).toUpperCase()
                        )}
                      </div>
                      {chatStore.getPresence(activeConv.recipient?.id || '').status === 'online' && (
                        <span className="absolute bottom-0 right-0 h-[14px] w-[14px] rounded-full bg-[#10B981] border-[2.5px] border-white dark:border-[#09090B]" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex flex-col justify-center gap-0.5">
                      <h3 className="font-bold text-[16px] text-neutral-900 dark:text-white flex items-center gap-1.5 truncate">
                        {activeConv.recipient?.display_name}
                        {activeConv.recipient?.email_verified && (
                          <BadgeCheck className="h-[18px] w-[18px] text-[#6C4EFF] fill-[#6C4EFF]/10" />
                        )}
                      </h3>
                      <p className="text-[13px] text-[#10B981] font-semibold truncate flex items-center gap-1.5">
                        {chatStore.getPresence(activeConv.recipient?.id || '').status === 'online' ? (
                          <>
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                            </span>
                            Online
                          </>
                        ) : (
                          <span className="text-neutral-400 font-medium">Offline</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'voice')}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-[#6C4EFF] border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer group"
                    title="Voice Call"
                  >
                    <Phone className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => callingStore.startCall(activeConv.recipient, 'video')}
                    className="h-10 w-10 flex items-center justify-center rounded-full text-[#6C4EFF] border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 shadow-sm transition-colors cursor-pointer group"
                    title="Video Call"
                  >
                    <Video className="h-[18px] w-[18px] group-hover:scale-110 transition-transform" />
                  </button>

                  <div className="relative">
                    <button 
                      onClick={() => setShowMenu(!showMenu)}
                      className="h-10 w-10 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-700 border border-neutral-200/60 dark:border-zinc-800/60 hover:bg-neutral-50 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 shadow-sm transition-colors cursor-pointer relative"
                    >
                      <MoreVertical className="h-[18px] w-[18px]" />
                    </button>
                    <AnimatePresence>
                      {showMenu && (
                        <>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMenu(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1D] rounded-t-[32px] shadow-2xl z-[70] md:absolute md:top-12 md:bottom-auto md:right-0 md:left-auto md:w-[320px] md:rounded-[24px] md:border md:border-neutral-200 dark:md:border-zinc-800 p-2 overflow-hidden flex flex-col max-h-[85vh]"
                          >
                            <div className="w-12 h-1.5 bg-neutral-200 dark:bg-zinc-700 rounded-full mx-auto my-3 md:hidden shrink-0" />
                            <div className="overflow-y-auto scrollbar-none px-4 pb-safe space-y-5 py-2">
                              
                              <div>
                                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">Communication</h4>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <Phone className="h-[20px] w-[20px] text-neutral-400" /> Voice Call
                                </button>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <Video className="h-[20px] w-[20px] text-neutral-400" /> Video Call
                                </button>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <Search className="h-[20px] w-[20px] text-neutral-400" /> Search Chat
                                </button>
                                <button onClick={() => { setShowMenu(false); setShowProfileDrawer(true); }} className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <User className="h-[20px] w-[20px] text-neutral-400" /> View Contact
                                </button>
                              </div>

                              <div>
                                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">Media, Links & Docs</h4>
                                <button onClick={() => { setShowMenu(false); setShowMediaDrawer(true); }} className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                                  <ImageIcon className="h-[20px] w-[20px] text-neutral-400" /> Media, Links & Docs
                                </button>
                                <button onClick={() => { setShowMenu(false); setShowStarredDrawer(true); }} className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                                  <Star className="h-[20px] w-[20px] text-neutral-400" /> Starred Messages
                                </button>
                              </div>

                              <div>
                                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">Chat Settings</h4>
                                <div className="w-full flex items-center justify-between gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <div className="flex items-center gap-3"><Bell className="h-[20px] w-[20px] text-neutral-400" /> Mute Notifications</div>
                                  <div className="w-10 h-6 bg-neutral-200 dark:bg-zinc-700 rounded-full flex items-center p-1"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                                </div>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800/50 rounded-2xl text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors">
                                  <ImageIcon className="h-[20px] w-[20px] text-neutral-400" /> Wallpaper
                                </button>
                              </div>

                              <div>
                                <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">Safety & Privacy</h4>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl text-[15px] font-medium text-red-500 transition-colors">
                                  <ShieldAlert className="h-[20px] w-[20px] text-red-500" /> Block User
                                </button>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-2xl text-[15px] font-medium text-orange-500 transition-colors">
                                  <AlertTriangle className="h-[20px] w-[20px] text-orange-500" /> Report User
                                </button>
                                <button className="w-full flex items-center gap-3 px-2 py-3 hover:bg-[#6C4EFF]/10 rounded-2xl text-[15px] font-medium text-[#6C4EFF] transition-colors">
                                  <Trash2 className="h-[20px] w-[20px] text-[#6C4EFF]" /> Clear Chat
                                </button>
                              </div>
                              
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin relative bg-white dark:bg-[#09090B]"
              >
                {/* E2E Banner */}
                <div className="flex justify-center mb-6">
                  <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-[20px] p-4 max-w-sm w-full text-center space-y-2">
                    <div className="flex items-center justify-center gap-1.5 text-[#10B981] font-bold text-[13px]">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verified Sugora End-to-End Encryption</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 dark:text-zinc-400">
                      Your messages and calls are secured with end-to-end encryption.
                    </p>
                    <button className="text-[#6C4EFF] text-[12px] font-bold hover:underline cursor-pointer">
                      Learn more
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-center my-4">
                  <div className="bg-neutral-100 dark:bg-zinc-800/50 px-3 py-1 rounded-full text-[11px] font-bold text-neutral-500 dark:text-zinc-400">
                    Today
                  </div>
                </div>
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#6C4EFF] blur-2xl opacity-20 rounded-full" />
                      <div className="p-6 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 text-[#6C4EFF] relative border border-[#6C4EFF]/20">
                        <MessageSquare className="h-10 w-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[17px] font-bold text-neutral-900 dark:text-white">Start the conversation</h3>
                      <p className="text-[14px] text-neutral-500 max-w-sm mt-1">Send a message or a sticker to say hello to {activeConv.type === 'group' ? activeConv.title : activeConv.recipient?.display_name}.</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-4 w-full">
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender_id === currentUser.id;
                      const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id);
                      
                      return (
                        <div key={msg.id} onContextMenu={(e) => { e.preventDefault(); setLongPressMessage(msg); }} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {!isMe && (
                            <div className="w-8 shrink-0 flex items-end pb-1">
                              {showAvatar && (
                                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#6C4EFF]/10 to-[#00C8FF]/10 flex items-center justify-center font-bold text-[#6C4EFF] text-[10px] overflow-hidden border border-neutral-100 dark:border-zinc-800 shadow-sm cursor-pointer" onClick={() => setShowProfileDrawer(true)}>
                                  {activeConv.recipient?.avatar ? (
                                    <img src={activeConv.recipient.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                  ) : (
                                    (activeConv.recipient?.display_name ?? '').slice(0, 2).toUpperCase()
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]`}>
                            {/* Message bubble */}
                                                        {(() => {
                              const isMediaOnly = msg.attachment && (msg.type === 'image' || msg.type === 'video') && !msg.text;
                              return (
                            <div className={`relative group ${
                              isMediaOnly ? 'bg-transparent shadow-none' : 
                              isMe 
                                 ? 'px-4 py-2.5 bg-gradient-to-br from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] text-white rounded-[20px] rounded-br-[4px] shadow-[0_4px_15px_-3px_rgba(108,78,255,0.4)]' 
                                 : 'px-4 py-2.5 bg-white dark:bg-zinc-900 text-neutral-800 dark:text-zinc-100 rounded-[20px] rounded-bl-[4px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 dark:border-zinc-800/80'
                            }`}>
                              {/* Hover actions */}
                              <div className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>
                                <button onClick={() => setReplyingTo(msg)} className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-zinc-200 transition-colors shadow-sm bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700">
                                  <Reply className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              {/* Attachments */}
                              {msg.attachment && (
                                <div className={isMediaOnly ? "" : "mb-2"}>
                                  {msg.type === 'image' && (
                                    <div className={`relative group cursor-pointer overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)] ${isMediaOnly ? `rounded-[24px] ${isMe ? 'rounded-br-[8px]' : 'rounded-bl-[8px]'}` : 'rounded-[16px]'}`} onClick={() => setLightboxImage(msg.attachment.file_url)}>
                                      <img 
                                        src={msg.attachment.file_url} 
                                        alt="Attachment" 
                                        className="max-h-[340px] max-w-[280px] sm:max-w-[340px] w-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                                      />
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                      {isMediaOnly && (
                                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                          {isMe && (
                                            <span className="ml-0.5">
                                              {msg.status === 'sent' && <Check className="h-[12px] w-[12px]" />}
                                              {msg.status === 'delivered' && <CheckCheck className="h-[12px] w-[12px]" />}
                                              {msg.status === 'read' && <CheckCheck className="h-[12px] w-[12px] text-[#00C8FF]" />}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {msg.type === 'video' && (
                                    <div className={`relative group cursor-pointer overflow-hidden shadow-[0_2px_12px_-4px_rgba(0,0,0,0.15)] bg-neutral-900 ${isMediaOnly ? `rounded-[24px] ${isMe ? 'rounded-br-[8px]' : 'rounded-bl-[8px]'}` : 'rounded-[16px]'}`}>
                                      <video src={msg.attachment.file_url} className="max-h-[340px] max-w-[280px] sm:max-w-[340px] w-auto object-cover opacity-80" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-14 w-14 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:bg-[#6C4EFF]/90 transition-all cursor-pointer">
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        </div>
                                      </div>
                                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        {isMediaOnly && <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                                        {isMediaOnly && isMe && (
                                          <span className="ml-0.5">
                                            {msg.status === 'sent' && <Check className="h-[12px] w-[12px]" />}
                                            {msg.status === 'delivered' && <CheckCheck className="h-[12px] w-[12px]" />}
                                            {msg.status === 'read' && <CheckCheck className="h-[12px] w-[12px] text-[#00C8FF]" />}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {msg.type === 'document' && (
                                    <div className={`flex items-center gap-3 p-3 rounded-[16px] ${isMe ? 'bg-white/20 border border-white/10' : 'bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-100 dark:border-zinc-800'}`}>
                                      <div className={`h-10 w-10 flex items-center justify-center rounded-full ${isMe ? 'bg-white/20 text-white' : 'bg-[#6C4EFF]/10 text-[#6C4EFF]'}`}>
                                        <FileText className="h-5 w-5" />
                                      </div>
                                      <div className="min-w-0 pr-4">
                                        <p className="font-bold text-[13px] truncate tracking-tight">{msg.attachment.file_name}</p>
                                        <p className={`text-[11px] font-medium mt-0.5 ${isMe ? 'text-white/80' : 'text-neutral-500'}`}>{(msg.attachment.file_size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Text content */}
                              {msg.text && (
                                <p className="text-[15px] leading-relaxed font-sans whitespace-pre-wrap break-words">
                                  {msg.text}
                                </p>
                              )}

                              {/* Meta row */}
                              {!isMediaOnly && (
                                <div className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] font-bold select-none ${isMe ? 'text-white/90' : 'text-neutral-400'}`}>
                                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  {isMe && (
                                    <span className="ml-0.5">
                                      {msg.status === 'sent' && <Check className="h-[14px] w-[14px]" />}
                                      {msg.status === 'delivered' && <CheckCheck className="h-[14px] w-[14px]" />}
                                      {msg.status === 'read' && <CheckCheck className="h-[15px] w-[15px] text-white" />}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

                {/* Typing Indicator */}
                <AnimatePresence>
                  {typingUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex gap-3 justify-start items-end"
                    >
                      <div className="w-8 shrink-0 pb-1">
                        <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
                          <span className="text-[10px]">💬</span>
                        </div>
                      </div>
                      <div className="px-4 py-2.5 bg-neutral-100 dark:bg-zinc-900 text-neutral-500 dark:text-zinc-400 rounded-[20px] rounded-bl-[4px] shadow-sm text-[13px] font-medium flex items-center gap-1.5 w-fit">
                        <span className="flex gap-1">
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-neutral-400 dark:bg-zinc-500 rounded-full inline-block" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-neutral-400 dark:bg-zinc-500 rounded-full inline-block" />
                          <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-neutral-400 dark:bg-zinc-500 rounded-full inline-block" />
                        </span>
                        <span>typing...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-1 w-full" />
                
                {/* Scroll to bottom button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.button
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="absolute bottom-6 right-6 h-10 w-10 bg-white dark:bg-zinc-800 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-full flex items-center justify-center text-[#6C4EFF] border border-neutral-100 dark:border-zinc-700 z-30 cursor-pointer"
                    >
                      <ArrowDown className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 border-2 border-white dark:border-zinc-800 rounded-full" />
                    </motion.button>
                  )}
                </AnimatePresence>
              {/* Composer */}
              <div className="px-3 sm:px-5 pb-safe pt-2 bg-transparent relative z-20 w-full mb-2 md:mb-4">
                <AnimatePresence>
                  {showAttachmentMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 50, scale: 0.95 }}
                      className="absolute bottom-[84px] left-4 right-4 md:left-6 md:w-[320px] bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-neutral-100 dark:border-zinc-800 p-6 z-50 origin-bottom-left"
                    >
                      <div className="w-10 h-1.5 bg-neutral-200 dark:bg-zinc-800 rounded-full mx-auto mb-6" />
                      <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                        {[
                          { id: 'gallery', label: 'Gallery', icon: ImageIcon, color: 'from-purple-500 to-indigo-500' },
                          { id: 'camera', label: 'Camera', icon: Camera, color: 'from-red-400 to-pink-500' },
                          { id: 'document', label: 'Document', icon: FileText, color: 'from-blue-400 to-cyan-500' },
                          { id: 'location', label: 'Location', icon: Pin, color: 'from-green-400 to-emerald-500' },
                          { id: 'contact', label: 'Contact', icon: User, color: 'from-indigo-400 to-purple-500' },
                          { id: 'poll', label: 'Poll', icon: SlidersHorizontal, color: 'from-orange-400 to-amber-500' },
                          { id: 'audio', label: 'Audio', icon: Music, color: 'from-pink-400 to-rose-500' }
                        ].map(item => (
                          <button key={item.id} type="button" className="flex flex-col items-center gap-2 group cursor-pointer" onClick={(e) => {
                            e.preventDefault();
                            if (item.id === 'gallery' || item.id === 'document' || item.id === 'camera' || item.id === 'audio') {
                              fileInputRef.current?.click();
                            }
                            setShowAttachmentMenu(false);
                          }}>
                            <div className={`h-[60px] w-[60px] rounded-[22px] bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                              <item.icon className="h-7 w-7" />
                            </div>
                            <span className="text-[11px] font-bold text-neutral-600 dark:text-zinc-400">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {replyingTo && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="max-w-4xl mx-auto mb-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[20px] p-3 flex items-start gap-3 shadow-lg border border-neutral-200/50 dark:border-zinc-800/50"
                    >
                      <div className="w-1 h-full min-h-[40px] bg-[#6C4EFF] rounded-full shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[#6C4EFF] text-[13px] font-bold">{replyingTo.sender_id === currentUser?.id ? 'You' : (activeConv.type === 'group' ? 'Member' : activeConv.recipient?.display_name)}</span>
                          <button type="button" onClick={() => setReplyingTo(null)} className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full text-neutral-400 transition-colors"><X className="h-4 w-4" /></button>
                        </div>
                        <p className="text-neutral-600 dark:text-zinc-300 text-[13px] truncate mt-0.5">{replyingTo.text || (replyingTo.attachment ? 'Media attached' : '')}</p>
                      </div>
                      {replyingTo.attachment && replyingTo.type === 'image' && (
                        <img src={replyingTo.attachment.file_url} className="h-10 w-10 rounded-md object-cover" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form 
                  onSubmit={handleSendMessage}
                  onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                  className="max-w-4xl mx-auto flex items-end gap-2"
                >
                  <button 
                    type="button" 
                    onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    className={`h-12 w-12 shrink-0 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${showAttachmentMenu ? 'bg-neutral-800 rotate-45' : 'bg-[#6C4EFF] hover:opacity-90'}`}
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                  
                  <div className="flex-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-[24px] border border-neutral-200/50 dark:border-zinc-800/50 shadow-sm px-2 py-1 flex items-end transition-all">
                    <textarea 
                      ref={textInputRef}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="w-full bg-transparent resize-none py-3 px-3 text-[15px] font-medium text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none max-h-[120px] scrollbar-none"
                      rows={1}
                      style={{ minHeight: '44px' }}
                    />
                    <div className="flex items-center gap-1 pr-1 pb-1 shrink-0">
                      <button type="button" className="p-2 rounded-full text-neutral-400 hover:text-[#6C4EFF] transition-colors cursor-pointer">
                        <Smile className="h-6 w-6" />
                      </button>
                      <button type="button" className="p-2 rounded-full text-neutral-400 hover:text-[#6C4EFF] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!messageText.trim() && !attachment}
                    className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                      messageText.trim() || attachment 
                        ? 'bg-[#6C4EFF] text-white hover:scale-105 cursor-pointer rotate-0' 
                        : 'bg-[#6C4EFF] text-white hover:scale-105 cursor-pointer'
                    }`}
                  >
                    {messageText.trim() || attachment ? (
                      <Send className="h-5 w-5 ml-0.5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#F8FAFC] dark:bg-[#09090B]">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6C4EFF] via-[#7B61FF] to-[#00C8FF] blur-[40px] opacity-20 rounded-full" />
                <div className="h-24 w-24 rounded-[32px] bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#6C4EFF]/5 to-[#00C8FF]/5" />
                  <Sparkles className="h-10 w-10 text-[#6C4EFF]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Sugora Core</h2>
              <p className="text-neutral-500 max-w-sm text-[15px]">Select a conversation or start a new connection to begin secure end-to-end messaging.</p>
            </div>
          )}
        </main>
        
        {/* Mobile Nav */}
        <nav className={`md:hidden border-t border-neutral-200/50 dark:border-zinc-800/50 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl min-h-[64px] pt-2 pb-safe flex items-center justify-around z-50 ${activeConv ? 'hidden' : 'flex'}`}>
          {[
            { id: 'chats', icon: MessageSquare, label: 'Chats', badge: conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0) },
            { id: 'calls', icon: Phone, label: 'Calls' },
            { id: 'contacts', icon: Users, label: 'Contacts' },
            { id: 'groups', icon: Users, label: 'Groups' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => { setActiveNavTab(tab.id); setActiveConv(null); }}
              className={`flex flex-col items-center gap-1 p-2 w-16 transition-colors cursor-pointer ${
                activeNavTab === tab.id ? 'text-[#6C4EFF]' : 'text-neutral-400'
              }`}
            >
              <div className="relative">
                <tab.icon className={`h-6 w-6 ${activeNavTab === tab.id ? 'text-[#6C4EFF] fill-current opacity-20' : 'text-neutral-400'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-[#6C4EFF] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-[#09090B]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold mt-1 ${activeNavTab === tab.id ? 'text-[#6C4EFF]' : 'text-neutral-400'}`}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      
      {/* Long Press Message Actions Sheet */}
      <AnimatePresence>
        {longPressMessage && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLongPressMessage(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1D] rounded-t-[32px] shadow-2xl z-[90] p-2 overflow-hidden flex flex-col md:absolute md:left-1/2 md:-translate-x-1/2 md:w-[400px] md:bottom-12 md:rounded-[24px]"
            >
              <div className="w-12 h-1.5 bg-neutral-200 dark:bg-zinc-700 rounded-full mx-auto my-3 shrink-0" />
              <div className="px-4 pb-safe space-y-4 py-2">
                <div className="flex items-center justify-between px-4 pb-4 border-b border-neutral-100 dark:border-zinc-800">
                  <button onClick={() => { setReplyingTo(longPressMessage); setLongPressMessage(null); }} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-600 dark:text-zinc-300 group-hover:bg-[#6C4EFF]/10 group-hover:text-[#6C4EFF] transition-colors"><Reply className="h-5 w-5" /></div>
                    <span className="text-[11px] font-bold">Reply</span>
                  </button>
                  <button onClick={() => { setLongPressMessage(null); }} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-600 dark:text-zinc-300 group-hover:bg-[#6C4EFF]/10 group-hover:text-[#6C4EFF] transition-colors"><CornerUpRight className="h-5 w-5" /></div>
                    <span className="text-[11px] font-bold">Forward</span>
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(longPressMessage.text || ''); setLongPressMessage(null); }} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-600 dark:text-zinc-300 group-hover:bg-[#6C4EFF]/10 group-hover:text-[#6C4EFF] transition-colors"><Copy className="h-5 w-5" /></div>
                    <span className="text-[11px] font-bold">Copy</span>
                  </button>
                  <button onClick={() => { setLongPressMessage(null); }} className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center text-neutral-600 dark:text-zinc-300 group-hover:bg-yellow-500/10 group-hover:text-yellow-500 transition-colors"><Star className="h-5 w-5" /></div>
                    <span className="text-[11px] font-bold">Star</span>
                  </button>
                </div>
                
                <div className="flex flex-col gap-1">
                  <button onClick={() => { setReplyingTo(longPressMessage); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-[16px] text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                    <Reply className="h-5 w-5 text-neutral-400" /> Reply
                  </button>
                  <button onClick={() => { setShowForwardModal(longPressMessage); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-[16px] text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                    <CornerUpRight className="h-5 w-5 text-neutral-400" /> Forward
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(longPressMessage.text); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-[16px] text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                    <Copy className="h-5 w-5 text-neutral-400" /> Copy
                  </button>
                  <button onClick={() => { chatStore.toggleStarMessage(longPressMessage.id, currentUser?.id); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-[16px] text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                    <Star className={`h-5 w-5 ${longPressMessage.starred_by?.includes(currentUser?.id) ? 'fill-amber-400 text-amber-400' : 'text-neutral-400'}`} /> {longPressMessage.starred_by?.includes(currentUser?.id) ? 'Unstar' : 'Star'}
                  </button>
                  
                  <div className="h-px bg-neutral-200 dark:bg-zinc-800 my-1 mx-2" />
                  
                  <button onClick={() => { setMessageInfoMsg(longPressMessage); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-[16px] text-[15px] font-medium text-neutral-800 dark:text-zinc-200 transition-colors cursor-pointer">
                    <Info className="h-5 w-5 text-neutral-400" /> Message Info
                  </button>
                  {longPressMessage.sender_id === currentUser?.id && (
                    <button onClick={() => { chatStore.deleteMessage(longPressMessage.id, currentUser.id, 'everyone'); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[16px] text-[15px] font-medium text-red-500 transition-colors cursor-pointer">
                      <Trash2 className="h-5 w-5 text-red-500" /> Delete for Everyone
                    </button>
                  )}
                  <button onClick={() => { chatStore.deleteMessage(longPressMessage.id, currentUser?.id, 'me'); setLongPressMessage(null); }} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-[16px] text-[15px] font-medium text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="h-5 w-5 text-red-500" /> Delete for Me
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  
      {/* Media Links Docs Drawer */}
        <AnimatePresence>
          {showMediaDrawer && activeConv && (
            <MediaLinksDocsDrawer
              conversationId={activeConv.id}
              currentUser={currentUser}
              onClose={() => setShowMediaDrawer(false)}
              onJumpToMessage={(id) => {
                const el = document.getElementById('msg-' + id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setShowMediaDrawer(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Starred Messages Drawer */}
        <AnimatePresence>
          {showStarredDrawer && activeConv && (
            <StarredMessagesDrawer
              conversationId={activeConv.id}
              currentUser={currentUser}
              onClose={() => setShowStarredDrawer(false)}
              onJumpToMessage={(id) => {
                const el = document.getElementById('msg-' + id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setShowStarredDrawer(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Message Info Drawer */}
        <AnimatePresence>
          {messageInfoMsg && (
            <MessageInfoDrawer
              message={messageInfoMsg}
              currentUser={currentUser}
              onClose={() => setMessageInfoMsg(null)}
            />
          )}
        </AnimatePresence>
        
        {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 text-white/50 hover:text-white p-2 cursor-pointer z-50">
              <X className="h-8 w-8" />
            </button>
            <img src={lightboxImage} alt="Fullscreen view" className="max-w-full max-h-[90vh] object-contain select-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


