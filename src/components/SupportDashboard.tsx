import React, { useState, useEffect } from 'react';
import { supabaseClient, getSupabaseConfig } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { chatStore } from '../lib/chatStore';
import { 
  MessageSquare, ShieldAlert, CheckCircle, Clock, AlertCircle, 
  Send, User, Search, RefreshCw, LogOut, ArrowLeft, ShieldCheck, 
  ChevronRight, ArrowRightLeft, UserCheck, X, Check, Eye, CheckCheck,
  Pin, Reply, Forward, Copy, Trash2, Paperclip, MoreVertical, Star, HardDrive, Play, Music, FileText, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default mock tickets & users for offline/initial state
const INITIAL_MOCK_TICKETS = [
  { id: 1, user_id: '33333333-3333-3333-3333-333333333333', title: 'Need assistance with file upload sizes', description: 'I am trying to upload a 15MB video demo of my Sugora network test but it says maximum is 10MB. Is there any way to extend this?', status: 'open', assigned_to: '22222222-2222-2222-2222-222222222222', created_at: '2026-07-01T21:10:00Z', username: 'bob_builder', email: 'bob@example.com' },
  { id: 2, user_id: '44444444-4444-4444-4444-444444444444', title: 'Why is my node showing Suspended?', description: 'I got a notification stating my cryptographic node is suspended. I have done nothing malicious. Please review my account state.', status: 'pending', assigned_to: null, created_at: '2026-07-01T18:45:00Z', username: 'malicious_node', email: 'spammer@malice.com' },
  { id: 3, user_id: '33333333-3333-3333-3333-333333333333', title: 'Zero knowledge handshake explanation', description: 'Can you provide the cryptographic reference used for client identity key verification? Need it for auditing.', status: 'resolved', assigned_to: '11111111-1111-1111-1111-111111111111', created_at: '2026-06-30T10:15:00Z', username: 'bob_builder', email: 'bob@example.com' }
];

const INITIAL_MOCK_TICKET_MESSAGES = [
  { id: 101, ticket_id: 1, sender_id: '33333333-3333-3333-3333-333333333333', message: 'Hello! I am having issues uploading a demo video in the workspace.', created_at: '2026-07-01T21:10:00Z' },
  { id: 102, ticket_id: 1, sender_id: '22222222-2222-2222-2222-222222222222', message: 'Hi Bob! Alice here. Currently, the upload parameter is restricted to 10MB. Let me query if the admin can update this limit.', created_at: '2026-07-01T21:15:00Z' }
];

const SUPPORT_AGENTS = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'ceo_neomcq', display_name: 'Neo MCQ', role: 'Admin' },
  { id: '22222222-2222-2222-2222-222222222222', username: 'alice_support', display_name: 'Alice Agent', role: 'Support' }
];

export default function SupportDashboard() {
  const { theme } = useTheme();

  // Core States
  const [tickets, setTickets] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>(SUPPORT_AGENTS);
  
  // Selection states
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'open' | 'pending' | 'resolved'>('assigned');
  
  // Input fields
  const [newMessageText, setNewMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferDropdown, setShowTransferDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Direct Customer Chats view states
  const [activeViewMode, setActiveViewMode] = useState<'tickets' | 'customer_chats'>('tickets');
  const [chatConversations, setChatConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState<any | null>(null);
  const [chatComposerText, setChatComposerText] = useState('');
  const [showForwardModal, setShowForwardModal] = useState<any | null>(null);
  const [showUserProfileSummary, setShowUserProfileSummary] = useState<any | null>(null);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [chatStats, setChatStats] = useState<any>(chatStore.getStats());

  // Current user info (acting agent)
  const [currentAgentId, setCurrentAgentId] = useState('22222222-2222-2222-2222-222222222222'); // default to Alice
  const [dbConfig, setDbConfig] = useState(getSupabaseConfig());
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Subscribe to chatStore in real-time
  useEffect(() => {
    const syncChatStoreData = () => {
      const convs = chatStore.getConversationsForUser(currentAgentId);
      setChatConversations(convs);
      setChatStats(chatStore.getStats());

      if (selectedChat) {
        const match = convs.find(c => c.id === selectedChat.id);
        if (match) {
          setSelectedChat(match);
        }
      }
    };

    const unsubscribe = chatStore.subscribe(syncChatStoreData);
    syncChatStoreData();
    return () => unsubscribe();
  }, [currentAgentId, selectedChat?.id]);

  // Handle support staff typing status
  const handleComposerChange = (text: string) => {
    setChatComposerText(text);
    if (!selectedChat) return;

    if (!isAgentTyping) {
      setIsAgentTyping(true);
      chatStore.setTyping(selectedChat.id, currentAgentId, true);
    }

    const timer = setTimeout(() => {
      setIsAgentTyping(false);
      chatStore.setTyping(selectedChat.id, currentAgentId, false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  // Support staff message send handler
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatComposerText.trim() || !selectedChat) return;

    try {
      const msgArgs: any = {
        conversation_id: selectedChat.id,
        sender_id: currentAgentId,
        text: chatComposerText.trim(),
        type: 'text'
      };

      if (replyMessage) {
        msgArgs.parent_message_id = replyMessage.id;
      }

      chatStore.sendMessage(msgArgs);
      setChatComposerText('');
      setReplyMessage(null);
      chatStore.setTyping(selectedChat.id, currentAgentId, false);
      setIsAgentTyping(false);
      showToast('Support reply dispatched.');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Simulate file attachment upload in chat
  const handleSimulateAttachment = (fileType: 'image' | 'video' | 'audio' | 'document') => {
    if (!selectedChat) return;

    const settings = chatStore.getSettings();
    if (!settings.enable_chat) {
      showToast('Messaging is currently disabled.', 'error');
      return;
    }

    const control = chatStore.getUserControl(currentAgentId);
    if (control.attachments_blocked) {
      showToast('Attachments are blocked for this account.', 'error');
      return;
    }

    let fileName = '';
    let fileSize = 100000; // 100KB default
    let fType = '';
    let fileUrl = '#';

    if (fileType === 'image') {
      fileName = 'diagnostic_trace.png';
      fileSize = 1200000; // 1.2MB
      fType = 'image/png';
      fileUrl = 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600';
    } else if (fileType === 'video') {
      fileName = 'glitch_recording.mp4';
      fileSize = 18000000; // 18MB
      fType = 'video/mp4';
    } else if (fileType === 'audio') {
      fileName = 'support_voice_memo.mp3';
      fileSize = 3000000; // 3MB
      fType = 'audio/mp3';
    } else {
      fileName = 'node_logs.txt';
      fileSize = 250000; // 250KB
      fType = 'text/plain';
    }

    // Check maximum size limit
    if (fileSize > settings.maximum_upload_size) {
      showToast(`Upload exceeds maximum size limit of ${settings.maximum_upload_size / (1024 * 1024)}MB.`, 'error');
      return;
    }

    // Check allowed file types
    const ext = fileName.split('.').pop() || '';
    if (!settings.allowed_file_types.includes(ext)) {
      showToast(`Extension .${ext} is not allowed. Allowed types: ${settings.allowed_file_types}`, 'error');
      return;
    }

    try {
      chatStore.sendMessage({
        conversation_id: selectedChat.id,
        sender_id: currentAgentId,
        text: `Uploaded attachment: ${fileName}`,
        type: fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : fileType === 'audio' ? 'audio' : 'document',
        attachment: {
          id: `att-${Math.random().toString(36).substring(2, 9)}`,
          file_name: fileName,
          file_size: fileSize,
          file_type: fType,
          file_url: fileUrl
        }
      });
      showToast('Attachment uploaded successfully.');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Forward message internally handler
  const handleForwardMessage = (targetConvId: string) => {
    if (!showForwardModal) return;

    try {
      chatStore.sendMessage({
        conversation_id: targetConvId,
        sender_id: currentAgentId,
        text: `[Forwarded] ${showForwardModal.text}`,
        type: showForwardModal.type,
        attachment: showForwardModal.attachment
      });
      setShowForwardModal(null);
      showToast('Message forwarded successfully.');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Sync data
  const loadTicketsData = async () => {
    setLoading(true);
    const config = getSupabaseConfig();
    setDbConfig(config);

    try {
      if (config.isConfigured) {
        // Fetch tickets from database
        const { data: dbTickets, error: tErr } = await supabaseClient
          .from('support_tickets')
          .select('*');

        // Fetch agents profiles from profiles where role in Admin, Support
        const { data: dbAgents, error: aErr } = await supabaseClient
          .from('profiles')
          .select('id, username, display_name, role')
          .in('role', ['Admin', 'Support']);

        if (!aErr && dbAgents && dbAgents.length > 0) {
          setAgents(dbAgents);
        }

        // Fetch current session user to map matching agent
        const { data: session } = await supabaseClient.auth.getSession();
        if (session?.session?.user) {
          setCurrentAgentId(session.session.user.id);
        }

        if (!tErr && dbTickets) {
          // Join with metadata or fallback
          const enrichedTickets = dbTickets.map(t => {
            const matchUser = INITIAL_MOCK_TICKETS.find(mockT => mockT.user_id === t.user_id);
            return {
              ...t,
              username: matchUser?.username || 'sugora_shards',
              email: matchUser?.email || 'user@sugora.io'
            };
          });
          setTickets(enrichedTickets.length > 0 ? enrichedTickets : INITIAL_MOCK_TICKETS);
        } else {
          setTickets(INITIAL_MOCK_TICKETS);
        }

        // Fetch messages if ticket is selected
        if (selectedTicket) {
          const { data: dbMessages } = await supabaseClient
            .from('support_messages')
            .select('*')
            .eq('ticket_id', selectedTicket.id);
          
          if (dbMessages) {
            setMessages(dbMessages);
          }
        }
      } else {
        // Local fallback
        const savedTickets = localStorage.getItem('sugora_local_tickets');
        if (savedTickets) {
          setTickets(JSON.parse(savedTickets));
        } else {
          setTickets(INITIAL_MOCK_TICKETS);
        }

        const savedMessages = localStorage.getItem('sugora_local_ticket_messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages(INITIAL_MOCK_TICKET_MESSAGES);
        }
      }
    } catch (e) {
      console.error('Error fetching support ticket parameters:', e);
      showToast('Error syncing with database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketsData();
  }, []);

  // Sync ticket detail on ticket selection change
  useEffect(() => {
    if (selectedTicket) {
      const fetchSelectedMessages = async () => {
        if (dbConfig.isConfigured) {
          const { data } = await supabaseClient
            .from('support_messages')
            .select('*')
            .eq('ticket_id', selectedTicket.id);
          if (data) setMessages(data);
        } else {
          const savedMessages = localStorage.getItem('sugora_local_ticket_messages');
          const allMsgs = savedMessages ? JSON.parse(savedMessages) : INITIAL_MOCK_TICKET_MESSAGES;
          setMessages(allMsgs.filter((m: any) => m.ticket_id === selectedTicket.id));
        }
      };
      fetchSelectedMessages();
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  // Actions
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedTicket) return;
    setSending(true);

    const messagePayload = {
      ticket_id: selectedTicket.id,
      sender_id: currentAgentId,
      message: newMessageText.trim(),
      created_at: new Date().toISOString()
    };

    try {
      if (dbConfig.isConfigured) {
        const { data, error } = await supabaseClient
          .from('support_messages')
          .insert(messagePayload);
        if (error) throw error;
      }

      // Local list update
      const updatedMessages = [...messages, { ...messagePayload, id: Date.now() }];
      setMessages(updatedMessages);

      if (!dbConfig.isConfigured) {
        // Save to local storage
        const savedMessages = localStorage.getItem('sugora_local_ticket_messages');
        const allMsgs = savedMessages ? JSON.parse(savedMessages) : INITIAL_MOCK_TICKET_MESSAGES;
        const finalMsgs = [...allMsgs, { ...messagePayload, id: Date.now() }];
        localStorage.setItem('sugora_local_ticket_messages', JSON.stringify(finalMsgs));
      }

      setNewMessageText('');
      showToast('Message transmitted securely.');
    } catch (err) {
      showToast('Failed to dispatch support chat', 'error');
    } finally {
      setSending(false);
    }
  };

  const updateTicketStatus = async (ticketId: number, status: 'open' | 'pending' | 'resolved') => {
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient
          .from('support_tickets')
          .update({ status })
          .eq('id', ticketId);
        if (error) throw error;
      }

      const updatedTickets = tickets.map(t => t.id === ticketId ? { ...t, status } : t);
      setTickets(updatedTickets);

      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_tickets', JSON.stringify(updatedTickets));
      }

      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status });
      }

      showToast(`Ticket status modified to ${status.toUpperCase()}`);
    } catch (err) {
      showToast('Failed to change ticket status', 'error');
    }
  };

  const handleTransferTicket = async (agentId: string) => {
    if (!selectedTicket) return;
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient
          .from('support_tickets')
          .update({ assigned_to: agentId })
          .eq('id', selectedTicket.id);
        if (error) throw error;
      }

      const updatedTickets = tickets.map(t => t.id === selectedTicket.id ? { ...t, assigned_to: agentId } : t);
      setTickets(updatedTickets);

      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_tickets', JSON.stringify(updatedTickets));
      }

      const selectedAgent = agents.find(a => a.id === agentId);
      setSelectedTicket({ ...selectedTicket, assigned_to: agentId });
      setShowTransferDropdown(false);
      showToast(`Ticket successfully transferred to @${selectedAgent?.username || 'Advocate'}`);
    } catch (err) {
      showToast('Failed to transfer ticket', 'error');
    }
  };

  // User Administration controls inside Support
  const handleToggleUserSuspension = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient
          .from('profiles')
          .update({ status: nextStatus })
          .eq('id', userId);
        if (error) throw error;
      }

      showToast(`User account status updated to ${nextStatus}`);
    } catch (err) {
      showToast('Failed to modify user access parameters', 'error');
    }
  };

  // Filter Computations
  const filteredTickets = tickets.filter(t => {
    // search match
    const matchQuery = 
      (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.username || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    // tab match
    let matchTab = true;
    if (activeTab === 'assigned') {
      matchTab = t.assigned_to === currentAgentId && t.status !== 'resolved';
    } else if (activeTab === 'open') {
      matchTab = t.status === 'open';
    } else if (activeTab === 'pending') {
      matchTab = t.status === 'pending';
    } else if (activeTab === 'resolved') {
      matchTab = t.status === 'resolved';
    }

    return matchQuery && matchTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 flex flex-col transition-colors duration-300 font-sans">
      
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border shadow-xl ${
              toast.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {toast.type === 'success' ? <ShieldCheck className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
            <span className="text-xs font-bold">{toast.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Support Banner header */}
      <header className="h-14 border-b border-neutral-250/50 dark:border-zinc-900 bg-white dark:bg-zinc-950/75 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/chat')}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850 text-neutral-500 cursor-pointer"
            title="Go to Chat"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-sm">
              S
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-neutral-900 dark:text-white block">Advocacy Support Hub</span>
              <span className="text-[9px] text-indigo-500 font-mono font-bold tracking-widest uppercase">REAL-TIME SHARD ROUTER</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex p-0.5 bg-neutral-100 dark:bg-zinc-900 rounded-xl border border-neutral-200/50 dark:border-zinc-800">
            <button
              onClick={() => setActiveViewMode('tickets')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                activeViewMode === 'tickets'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Support Tickets
            </button>
            <button
              onClick={() => setActiveViewMode('customer_chats')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                activeViewMode === 'customer_chats'
                  ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Direct Customer Chats
            </button>
          </div>

          <button 
            onClick={loadTicketsData}
            className="p-2 border border-neutral-200/50 dark:border-zinc-850 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-500 cursor-pointer"
            title="Refresh parameters"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Control Panel</span>
          </button>
        </div>
      </header>

      {/* THREE COLUMN GRID LAYOUT */}
      {activeViewMode === 'tickets' ? (
        <div className="flex-1 flex overflow-hidden">
          
          {/* COLUMN 1: TICKET DIRECTORY LIST */}
          <aside className="w-full md:w-80 border-r border-neutral-250/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col shrink-0">
            
            {/* Tabs bar */}
            <div className="p-3 border-b border-neutral-100 dark:border-zinc-900 flex gap-1">
              {[
                { id: 'assigned', label: 'Assigned', count: tickets.filter(t => t.assigned_to === currentAgentId && t.status !== 'resolved').length },
                { id: 'open', label: 'Open', count: tickets.filter(t => t.status === 'open').length },
                { id: 'pending', label: 'Pending', count: tickets.filter(t => t.status === 'pending').length },
                { id: 'resolved', label: 'Closed', count: tickets.filter(t => t.status === 'resolved').length }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setSelectedTicket(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-zinc-900'
                        : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-zinc-900/40'
                    }`}
                  >
                    <span className="block leading-none">{tab.label}</span>
                    <span className={`inline-block mt-0.5 px-1 py-0.2 rounded text-[8px] font-mono ${active ? 'bg-indigo-500 text-white' : 'bg-neutral-100 dark:bg-zinc-900'}`}>{tab.count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search tickets bar */}
            <div className="p-3 border-b border-neutral-100 dark:border-zinc-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search ticket subjects or users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850 dark:text-white"
                />
              </div>
            </div>

            {/* Ticket Shard Directory */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-left">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                  No matching support tickets.
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isSelected = selectedTicket?.id === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none space-y-2 relative group ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200' 
                          : 'bg-neutral-50/50 dark:bg-zinc-950/20 border-neutral-150 dark:border-zinc-900 hover:border-neutral-300 dark:hover:border-zinc-850'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-bold font-mono">TICKET #{t.id}</span>
                        <span className={`h-2 w-2 rounded-full ${
                          t.status === 'open' ? 'bg-red-500' : t.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />
                      </div>

                      <div>
                        <span className="text-xs font-black block truncate text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{t.title}</span>
                        <p className="text-[10px] text-neutral-500 dark:text-zinc-400 line-clamp-2 mt-0.5">{t.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-zinc-900">
                        <span className="font-bold">@{t.username}</span>
                        <span>{new Date(t.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* COLUMN 2: MESSAGING AREA / REALTIME TICKET CHAT */}
          <main className="flex-1 bg-white dark:bg-zinc-950 flex flex-col relative border-r border-neutral-250/50 dark:border-zinc-900">
            
            {selectedTicket ? (
              <>
                {/* Active Ticket Header controls */}
                <div className="p-4 border-b border-neutral-250/40 dark:border-zinc-900 flex items-center justify-between text-left shrink-0">
                  <div>
                    <h2 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider line-clamp-1">{selectedTicket.title}</h2>
                    <p className="text-[10px] text-neutral-500 font-bold">Opened by @{selectedTicket.username} ({selectedTicket.email})</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {selectedTicket.status !== 'resolved' ? (
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Resolve Shard</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => updateTicketStatus(selectedTicket.id, 'open')}
                        className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 border border-indigo-500/20 rounded-xl text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>Reopen Shard</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Chat conversations trail */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                  {/* Description bubble from the user (The original message) */}
                  <div className="flex gap-3 max-w-2xl">
                    <div className="h-8.5 w-8.5 rounded-xl bg-neutral-100 dark:bg-zinc-855 text-neutral-600 dark:text-zinc-300 flex items-center justify-center shrink-0 font-bold text-xs uppercase border border-neutral-200/50">
                      {(selectedTicket?.username ?? '').slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-neutral-900 dark:text-white">@{selectedTicket?.username ?? 'user'}</span>
                        <span className="text-[9px] text-neutral-400">{new Date(selectedTicket?.created_at || Date.now()).toLocaleTimeString()}</span>
                      </div>
                      <div className="p-4 bg-neutral-100/50 dark:bg-zinc-900/50 border border-neutral-150 dark:border-zinc-850 rounded-2xl">
                        <p className="text-xs text-neutral-700 dark:text-zinc-300 leading-relaxed font-medium">{selectedTicket?.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2 shrink-0">
                    <div className="h-px bg-neutral-150 dark:bg-zinc-900 flex-1" />
                    <span className="text-[9px] text-neutral-450 dark:text-zinc-500 font-mono font-bold tracking-widest uppercase mx-4">ADVOCATE CONNECTION INITIATED</span>
                    <div className="h-px bg-neutral-150 dark:bg-zinc-900 flex-1" />
                  </div>

                  {/* Messages mapping */}
                  {messages.length === 0 ? (
                    <div className="text-center py-6 text-neutral-400 text-[10px] font-bold uppercase tracking-wider">
                      No active messages in this conversation yet. Send a response to begin.
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isAgent = agents.some(a => a.id === msg.sender_id);
                      const senderName = isAgent 
                        ? agents.find(a => a.id === msg.sender_id)?.username || 'Advocate'
                        : selectedTicket?.username || 'user';

                      return (
                        <div key={msg.id} className={`flex gap-3 max-w-2xl ${isAgent ? 'ml-auto flex-row-reverse text-right' : ''}`}>
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs uppercase border ${
                            isAgent 
                              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' 
                              : 'bg-neutral-100 dark:bg-zinc-855 text-neutral-600 dark:text-zinc-300 border-neutral-200/50'
                          }`}>
                            {(senderName ?? '').slice(0, 2)}
                          </div>
                          <div className="space-y-1">
                            <div className={`flex items-center gap-2 ${isAgent ? 'justify-end' : ''}`}>
                              <span className="text-xs font-black text-neutral-900 dark:text-white">@{senderName}</span>
                              <span className="text-[9px] text-neutral-400">{new Date(msg.created_at || Date.now()).toLocaleTimeString()}</span>
                            </div>
                            <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-md ${
                              isAgent 
                                ? 'bg-neutral-950 text-white dark:bg-white dark:text-zinc-950 text-left font-semibold shadow-xs' 
                                : 'bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-150 dark:border-zinc-850 text-neutral-700 dark:text-zinc-300 font-medium'
                            }`}>
                              {msg.message}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat composer box input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-250/40 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex gap-2.5 items-center sticky bottom-0 z-10 shrink-0">
                  <input
                    type="text"
                    required
                    disabled={selectedTicket.status === 'resolved'}
                    placeholder={selectedTicket.status === 'resolved' ? "Ticket resolved. Reopen to chat." : "Transmit response payload to shard..."}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={sending || selectedTicket.status === 'resolved'}
                    className="h-10 w-10 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 disabled:opacity-50"
                    title="Dispatch message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">No Active Conversation</h3>
                  <p className="text-xs text-neutral-550 leading-relaxed max-w-sm mx-auto">Select a support ticket shard from the directory directory on the left to initiate the secure communications link.</p>
                </div>
              </div>
            )}
          </main>

          {/* COLUMN 3: USER INFORMATION DRAWER / ACTION PANEL */}
          {selectedTicket && (
            <aside className="hidden lg:flex w-72 border-l border-neutral-250/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-col overflow-y-auto p-5 space-y-6 shrink-0 text-left">
              
              {/* User details */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">User Profile Node</h3>
                
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-neutral-100 dark:bg-zinc-850 text-neutral-600 dark:text-zinc-300 flex items-center justify-center font-black text-sm border border-neutral-200/40">
                    {(selectedTicket?.username ?? '').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">@{selectedTicket.username}</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block">{selectedTicket.email}</span>
                  </div>
                </div>

                {/* Ticket Assignment details */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-150 dark:border-zinc-900 space-y-2 relative">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-wider block">Assigned Advocate</span>
                  
                  {selectedTicket.assigned_to ? (
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-zinc-300">
                      <span>@{agents.find(a => a.id === selectedTicket.assigned_to)?.username || 'Support'}</span>
                      <button 
                        onClick={() => setShowTransferDropdown(!showTransferDropdown)}
                        className="text-[9px] text-indigo-500 hover:underline cursor-pointer font-black"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleTransferTicket(currentAgentId)}
                      className="w-full py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] font-black hover:bg-indigo-600 transition-all cursor-pointer text-center block"
                    >
                      Claim Support Ticket
                    </button>
                  )}

                  {showTransferDropdown && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden divide-y divide-neutral-100 dark:divide-zinc-850">
                      {agents.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => handleTransferTicket(agent.id)}
                          className="w-full px-3 py-2 text-left text-[10px] font-semibold text-neutral-700 dark:text-zinc-300 hover:bg-neutral-50 dark:hover:bg-zinc-850 cursor-pointer block"
                        >
                          @{agent.username} ({agent.role})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Diagnostic statuses */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Security Parameters</h3>

                <div className="space-y-2">
                  {[
                    { name: 'Email Verified', val: 'Active verified', type: 'success' },
                    { name: 'Node Security', val: 'Active node', type: 'success' },
                    { name: 'Client Version', val: 'PWA v2.4.0', type: 'neutral' }
                  ].map((spec, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-neutral-500 dark:text-zinc-400">{spec.name}</span>
                      <span className={`text-[10px] ${spec.type === 'success' ? 'text-emerald-500' : 'text-neutral-550'}`}>{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ticket Shard Administration operations */}
              <div className="space-y-3.5 pt-4 border-t border-neutral-100 dark:border-zinc-900">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Node Interventions</h3>
                
                <button
                  onClick={() => handleToggleUserSuspension(selectedTicket.user_id, 'Active')}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Suspend Profile Node</span>
                </button>
                
                <button
                  onClick={() => updateTicketStatus(selectedTicket.id, 'pending')}
                  className="w-full py-2 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>Escalate Shard Ticket</span>
                </button>
              </div>

            </aside>
          )}
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          
          {/* COLUMN 1: DIRECT CUSTOMER CHAT DIRECTORY */}
          <aside className="w-full md:w-80 border-r border-neutral-250/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex flex-col shrink-0">
            {/* Live Chat Dashboard Metrics (at the top of Sidebar) */}
            <div className="p-3.5 border-b border-neutral-100 dark:border-zinc-900 bg-neutral-50/50 dark:bg-zinc-900/20 space-y-2.5">
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-mono">Support Chat Dashboard</span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200/40 dark:border-zinc-800/40">
                  <span className="text-[8px] uppercase font-black text-neutral-400 block truncate">Active Chats</span>
                  <span className="text-xs font-mono font-black text-indigo-500">{chatConversations.length}</span>
                </div>
                <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200/40 dark:border-zinc-800/40">
                  <span className="text-[8px] uppercase font-black text-neutral-400 block truncate">Unread Threads</span>
                  <span className="text-xs font-mono font-black text-amber-500">{chatConversations.filter(c => c.unreadCount > 0).length}</span>
                </div>
                <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-neutral-200/40 dark:border-zinc-800/40">
                  <span className="text-[8px] uppercase font-black text-neutral-400 block truncate">SLA Latency</span>
                  <span className="text-xs font-mono font-black text-emerald-500">1.8m</span>
                </div>
              </div>
            </div>

            {/* Live Search bar */}
            <div className="p-3 border-b border-neutral-100 dark:border-zinc-900">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input 
                  type="text" 
                  placeholder="Search live chat profiles..." 
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-neutral-50 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850 dark:text-white"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-left">
              {chatConversations.filter(c => {
                const target = c.recipient?.display_name || c.recipient?.username || 'Customer';
                return target.toLowerCase().includes(chatSearchQuery.toLowerCase());
              }).length === 0 ? (
                <div className="text-center py-12 text-neutral-400 font-bold uppercase text-[10px] tracking-wider">
                  No active customer chats found.
                </div>
              ) : (
                chatConversations
                  .filter(c => {
                    const target = c.recipient?.display_name || c.recipient?.username || 'Customer';
                    return target.toLowerCase().includes(chatSearchQuery.toLowerCase());
                  })
                  .map((c) => {
                    const isSelected = selectedChat?.id === c.id;
                    const recipient = c.recipient || { display_name: 'Customer Node', username: 'node_unknown', avatar: '' };
                    const presence = chatStore.getPresence(recipient.id);
                    const typingUsers = chatStore.getTypingUsers(c.id, currentAgentId);

                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedChat(c);
                          chatStore.markAsRead(c.id, currentAgentId);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer select-none space-y-1 relative group ${
                          isSelected 
                            ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-900 dark:text-indigo-200' 
                            : 'bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar with Presence Indicator */}
                          <div className="relative shrink-0">
                            <div className="h-9 w-9 rounded-xl bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-neutral-600 dark:text-zinc-300 overflow-hidden border border-neutral-200/40">
                              {recipient.avatar ? (
                                <img src={recipient.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                (recipient.username ?? '').slice(0, 2)
                              )}
                            </div>
                            <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-zinc-950 ${
                              presence.status === 'online' ? 'bg-emerald-500' :
                              presence.status === 'away' ? 'bg-amber-500' : 'bg-neutral-350'
                            }`} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-neutral-900 dark:text-white truncate max-w-[120px]">{recipient.display_name}</span>
                              <span className="text-[9px] text-neutral-400 font-medium">
                                {c.lastMessage ? new Date(c.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between gap-1.5">
                              {typingUsers.length > 0 ? (
                                <span className="text-[10px] text-emerald-500 font-extrabold animate-pulse">typing...</span>
                              ) : (
                                <p className="text-[10px] text-neutral-500 dark:text-zinc-400 truncate flex-1 font-medium">
                                  {c.lastMessage?.text || 'No messages yet'}
                                </p>
                              )}

                              {c.unreadCount > 0 && (
                                <span className="h-4.5 min-w-4.5 px-1.5 bg-indigo-500 text-white text-[9px] font-black rounded-full flex items-center justify-center font-mono">
                                  {c.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </aside>

          {/* COLUMN 2: LIVE SUPPORT CHAT VIEW WINDOW */}
          <main className="flex-1 bg-neutral-100/40 dark:bg-zinc-900/10 flex flex-col overflow-y-auto relative min-w-0">
            {selectedChat ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 bg-white dark:bg-zinc-950 border-b border-neutral-250/50 dark:border-zinc-900 flex items-center justify-between sticky top-0 z-10 shrink-0 text-left">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-neutral-100 dark:bg-zinc-900 text-neutral-600 dark:text-zinc-300 flex items-center justify-center font-black text-xs border border-neutral-200/40 overflow-hidden">
                      {selectedChat.recipient?.avatar ? (
                        <img src={selectedChat.recipient.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        (selectedChat.recipient?.username ?? '').slice(0, 2) || 'CS'
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-neutral-900 dark:text-white block">@{selectedChat.recipient?.username}</span>
                        <span className="text-[8px] px-1 bg-neutral-150 dark:bg-zinc-800 text-neutral-550 font-mono rounded uppercase font-black">{selectedChat.recipient?.role || 'User'}</span>
                      </div>
                      <span className="text-[9px] text-emerald-500 font-mono font-bold uppercase flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{chatStore.getPresence(selectedChat.recipient?.id || '').status === 'online' ? 'Connected Node' : 'Offline'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        chatStore.togglePin(selectedChat.id, currentAgentId);
                        showToast('Conversation pin updated.');
                      }}
                      className={`p-2 border rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 cursor-pointer ${
                        selectedChat.pinned_by?.includes(currentAgentId)
                          ? 'bg-amber-500/10 border-amber-500/25 text-amber-500'
                          : 'border-neutral-200 dark:border-zinc-850 text-neutral-400'
                      }`}
                      title="Toggle Pin Thread"
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        chatStore.toggleArchive(selectedChat.id, currentAgentId);
                        setSelectedChat(null);
                        showToast('Conversation moved to archive.');
                      }}
                      className="p-2 border border-neutral-200 dark:border-zinc-850 rounded-xl hover:bg-neutral-50 dark:hover:bg-zinc-900 text-neutral-400 cursor-pointer"
                      title="Archive Thread"
                    >
                      <HardDrive className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Chat window messages */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto flex flex-col text-left">
                  {chatStore.getMessages(selectedChat.id, currentAgentId).length === 0 ? (
                    <div className="text-center py-12 text-neutral-400 text-xs font-black uppercase tracking-wider">
                      Beginning securely encrypted communications link...
                    </div>
                  ) : (
                    chatStore.getMessages(selectedChat.id, currentAgentId).map((msg) => {
                      const isMe = msg.sender_id === currentAgentId;
                      const senderProfile = isMe 
                        ? { display_name: 'Sugora Advocate', username: 'alice_support' }
                        : selectedChat.recipient || { display_name: 'Customer', username: 'customer_node' };

                      // Reply context lookup
                      let parentMsgText = '';
                      if (msg.parent_message_id) {
                        const allMsgs = chatStore.getMessages(selectedChat.id, currentAgentId);
                        const match = allMsgs.find(m => m.id === msg.parent_message_id);
                        if (match) {
                          parentMsgText = match.text;
                        }
                      }

                      return (
                        <div key={msg.id} className={`group flex gap-3 max-w-xl relative ${isMe ? 'ml-auto flex-row-reverse text-right' : ''}`}>
                          
                          {/* Avatar bubble */}
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs uppercase border overflow-hidden bg-neutral-100 dark:bg-zinc-850 text-neutral-600 dark:text-zinc-300 border-neutral-200/50">
                            {isMe ? 'AD' : (senderProfile?.username ?? '').slice(0, 2)}
                          </div>

                          <div className="space-y-1 max-w-sm sm:max-w-md">
                            <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                              <span className="text-xs font-black text-neutral-900 dark:text-white">@{senderProfile?.username ?? 'user'}</span>
                              <span className="text-[9px] text-neutral-400">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>

                            {/* Parent Reply preview */}
                            {parentMsgText && (
                              <div className="p-2 bg-neutral-100 dark:bg-zinc-850 border-l-2 border-indigo-500 rounded-lg text-[10px] text-neutral-500 dark:text-zinc-400 italic mb-1 text-left">
                                {parentMsgText}
                              </div>
                            )}

                            {/* Render attachments */}
                            {msg.attachment && (
                              <div className="mb-2 p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-neutral-250/30 text-left space-y-2 max-w-xs shadow-xs">
                                <div className="flex items-center gap-2.5">
                                  {msg.type === 'image' && <ImageIcon className="h-5 w-5 text-pink-500 shrink-0" />}
                                  {msg.type === 'video' && <Play className="h-5 w-5 text-purple-500 shrink-0" />}
                                  {msg.type === 'audio' && <Music className="h-5 w-5 text-teal-500 shrink-0" />}
                                  {msg.type === 'pdf' || msg.type === 'document' && <FileText className="h-5 w-5 text-indigo-500 shrink-0" />}
                                  <div className="min-w-0">
                                    <span className="text-xs font-black text-neutral-900 dark:text-white block truncate">{msg.attachment.file_name}</span>
                                    <span className="text-[9px] text-neutral-400 font-mono font-bold block">{(msg.attachment.file_size / (1024 * 1024)).toFixed(2)} MB</span>
                                  </div>
                                </div>
                                {msg.type === 'image' && (
                                  <img src={msg.attachment.file_url} alt="" className="w-full max-h-32 object-cover rounded-xl mt-1" referrerPolicy="no-referrer" />
                                )}
                                <a 
                                  href="#" 
                                  onClick={(e) => { e.preventDefault(); showToast('Attachment payload retrieved.'); }}
                                  className="w-full py-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-center rounded-lg text-[10px] font-black uppercase text-indigo-500 block"
                                >
                                  Download File
                                </a>
                              </div>
                            )}

                            {/* Message Bubble text content */}
                            {!msg.deleted_for_everyone ? (
                              <div className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${
                                isMe 
                                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-xs' 
                                  : 'bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-150 dark:border-zinc-850 text-neutral-700 dark:text-zinc-300 font-medium'
                              }`}>
                                {msg.text}
                              </div>
                            ) : (
                              <div className="text-neutral-400 italic text-[10px] bg-neutral-100 dark:bg-zinc-900 p-2 rounded-xl border border-dashed border-neutral-200/50">
                                🚫 This message was deleted
                              </div>
                            )}

                            {/* Real-time delivery and read checkmarks */}
                            {isMe && !msg.deleted_for_everyone && (
                              <div className="flex items-center justify-end gap-1 mt-0.5">
                                {msg.status === 'read' ? (
                                  <CheckCheck className="h-3.5 w-3.5 text-indigo-500" />
                                ) : msg.status === 'delivered' ? (
                                  <CheckCheck className="h-3.5 w-3.5 text-neutral-400" />
                                ) : (
                                  <Check className="h-3.5 w-3.5 text-neutral-400" />
                                )}
                                <span className="text-[8px] font-black font-mono text-neutral-400 uppercase">{msg.status}</span>
                              </div>
                            )}
                          </div>

                          {/* Hover action bar (Support Agent Tools) */}
                          <div className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-all flex items-center bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 p-1 rounded-xl shadow-md gap-1 z-20 ${
                            isMe ? '-left-20' : '-right-20'
                          }`}>
                            <button
                              onClick={() => setReplyMessage(msg)}
                              className="p-1 text-neutral-500 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-zinc-850 rounded-lg cursor-pointer"
                              title="Quote Reply"
                            >
                              <Reply className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setShowForwardModal(msg)}
                              className="p-1 text-neutral-500 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-zinc-850 rounded-lg cursor-pointer"
                              title="Forward Message"
                            >
                              <Forward className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(msg.text);
                                showToast('Copied content to clipboard!');
                              }}
                              className="p-1 text-neutral-500 hover:text-indigo-500 hover:bg-neutral-50 dark:hover:bg-zinc-850 rounded-lg cursor-pointer"
                              title="Copy Text"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                chatStore.deleteMessage(msg.id, currentAgentId, isMe ? 'everyone' : 'me');
                                showToast('Message deleted.');
                              }}
                              className="p-1 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                              title="Delete Message"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                        </div>
                      );
                    })
                  )}

                  {chatStore.getTypingUsers(selectedChat.id, currentAgentId).length > 0 && (
                    <div className="flex gap-2 items-center text-xs text-neutral-500 dark:text-zinc-400 font-extrabold italic animate-pulse py-1 pl-11">
                      <div className="flex gap-1 shrink-0">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>@{selectedChat.recipient?.username || 'Customer'} is typing...</span>
                    </div>
                  )}
                </div>

                {/* Reply bar context display */}
                {replyMessage && (
                  <div className="px-4 py-2 bg-indigo-500/5 border-t border-indigo-500/10 flex items-center justify-between text-left shrink-0">
                    <div className="flex items-center gap-2">
                      <Reply className="h-3.5 w-3.5 text-indigo-500" />
                      <div className="text-[10px]">
                        <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block">Replying to message</span>
                        <span className="text-neutral-550 dark:text-zinc-400 truncate max-w-sm block italic">"{replyMessage.text}"</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setReplyMessage(null)} 
                      className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-555 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Message composer */}
                <form onSubmit={handleSendChatMessage} className="p-4 border-t border-neutral-250/40 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex gap-2.5 items-center sticky bottom-0 z-10 shrink-0">
                  
                  {/* Simulate Attachment Menu dropdown */}
                  <div className="relative group/att">
                    <button
                      type="button"
                      className="h-10 w-10 border border-neutral-200 dark:border-zinc-850 rounded-xl flex items-center justify-center hover:bg-neutral-55 text-neutral-455 dark:text-zinc-400 cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="h-4 w-4" />
                    </button>
                    {/* Popover options */}
                    <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden hidden group-hover/att:block divide-y divide-neutral-100 dark:divide-zinc-850 z-30 w-44">
                      <button
                        type="button"
                        onClick={() => handleSimulateAttachment('image')}
                        className="w-full px-3 py-2 text-left text-[10px] font-black text-neutral-700 dark:text-zinc-300 hover:bg-neutral-55 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <ImageIcon className="h-4 w-4 text-pink-500" />
                        <span>Simulate Image</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateAttachment('video')}
                        className="w-full px-3 py-2 text-left text-[10px] font-black text-neutral-700 dark:text-zinc-300 hover:bg-neutral-55 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Play className="h-4 w-4 text-purple-500" />
                        <span>Simulate Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateAttachment('audio')}
                        className="w-full px-3 py-2 text-left text-[10px] font-black text-neutral-700 dark:text-zinc-300 hover:bg-neutral-55 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <Music className="h-4 w-4 text-teal-500" />
                        <span>Simulate Voice Memo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSimulateAttachment('document')}
                        className="w-full px-3 py-2 text-left text-[10px] font-black text-neutral-700 dark:text-zinc-300 hover:bg-neutral-55 dark:hover:bg-zinc-800 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-indigo-500" />
                        <span>Simulate Document</span>
                      </button>
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Dispatch support response payload to node..."
                    value={chatComposerText}
                    onChange={(e) => handleComposerChange(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-neutral-55 dark:bg-zinc-900 rounded-xl text-xs focus:outline-none border border-neutral-200/50 dark:border-zinc-850 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Dispatch reply"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center border border-indigo-500/20">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">No Selected Conversation</h3>
                  <p className="text-xs text-neutral-550 leading-relaxed max-w-sm mx-auto">Select a customer node from the chat list on the left to review history and send secure agent responses.</p>
                </div>
              </div>
            )}
          </main>

          {/* COLUMN 3: LIVE PROFILE CARD */}
          {selectedChat && (
            <aside className="hidden lg:flex w-72 border-l border-neutral-250/50 dark:border-zinc-900 bg-white dark:bg-zinc-950 flex-col overflow-y-auto p-5 space-y-6 shrink-0 text-left">
              
              {/* User profile Summary */}
              <div className="space-y-4">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Customer Node Identity</h3>
                
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-zinc-850 text-neutral-600 dark:text-zinc-300 flex items-center justify-center font-black text-sm border border-neutral-200/40 overflow-hidden">
                    {selectedChat.recipient?.avatar ? (
                      <img src={selectedChat.recipient.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      (selectedChat.recipient?.username ?? '').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">@{selectedChat.recipient?.username}</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block">{selectedChat.recipient?.email}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-150 dark:border-zinc-900 space-y-1.5">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-mono">Profile Details</span>
                  <div className="text-xs font-semibold text-neutral-700 dark:text-zinc-300 space-y-1">
                    <div><span className="text-neutral-400 font-normal">Display Name:</span> {selectedChat.recipient?.display_name}</div>
                    <div><span className="text-neutral-400 font-normal">Crypto Role:</span> {selectedChat.recipient?.role}</div>
                    <div className="truncate"><span className="text-neutral-400 font-normal">Bio:</span> {selectedChat.recipient?.bio || 'No cryptographic signature.'}</div>
                  </div>
                </div>
              </div>

              {/* Direct interventions */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-zinc-900">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Node Interventions</h3>
                
                <button
                  onClick={() => {
                    chatStore.updateUserControl(selectedChat.recipient.id, { chat_enabled: false });
                    showToast(`Blocked direct chat privilege for @${selectedChat.recipient.username}`);
                  }}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-neutral-700 dark:text-zinc-300 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Disable Chat Access</span>
                </button>

                <button
                  onClick={() => {
                    chatStore.updateUserControl(selectedChat.recipient.id, { attachments_blocked: true });
                    showToast(`Blocked files for @${selectedChat.recipient.username}`);
                  }}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 border border-amber-500/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Block File Uploads</span>
                </button>
                
                <button
                  onClick={() => {
                    chatStore.updateUserControl(selectedChat.recipient.id, { suspended: true });
                    showToast(`Suspended node @${selectedChat.recipient.username}`);
                  }}
                  className="w-full py-2 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Suspend Privileges</span>
                </button>
              </div>

            </aside>
          )}

        </div>
      )}

      {/* Internal Forward message target modal popup */}
      <AnimatePresence>
        {showForwardModal && (
          <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-neutral-200 dark:border-zinc-800 p-6 max-w-md w-full space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-indigo-500 tracking-wider">Forward Message Node</span>
                <button 
                  onClick={() => setShowForwardModal(null)}
                  className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-555 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-neutral-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-neutral-200/50 dark:border-zinc-850/50 text-left text-xs text-neutral-600 dark:text-zinc-400">
                <span className="font-extrabold block text-neutral-900 dark:text-white mb-0.5">Message payload contents:</span>
                "{showForwardModal.text}"
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black text-neutral-450 block tracking-wider text-left">Select Target Connection Shard</span>
                <div className="max-h-56 overflow-y-auto space-y-1.5 text-left pr-1">
                  {chatConversations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleForwardMessage(c.id)}
                      className="w-full p-2.5 rounded-xl border border-neutral-200/50 dark:border-zinc-850 hover:bg-neutral-50 dark:hover:bg-zinc-800 flex items-center justify-between text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    >
                      <span>@{c.recipient?.username || 'Customer Node'}</span>
                      <ChevronRight className="h-4 w-4 text-neutral-450" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
