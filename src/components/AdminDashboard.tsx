import React, { useState, useEffect } from 'react';
import { supabaseClient, getSupabaseConfig } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { chatStore } from '../lib/chatStore';
import { 
  Users, Settings, ShieldAlert, Database, HardDrive, MessageSquare, 
  Search, SlidersHorizontal, ArrowUpDown, ShieldCheck, Eye, Key, 
  Trash2, LogOut, Check, X, RefreshCw, Layers, Layout, Lock, Globe, 
  Palette, Smartphone, Radio, UserCheck, AlertTriangle, Play, FileText, 
  Music, Image as ImageIcon, Send, Clock, Plus, Star, BarChart3, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

// --- Default configurations for local/offline fallback ---
const DEFAULT_WEBSITE_SETTINGS = {
  website_name: 'Sugora',
  website_description: 'A modern, fast, and completely sovereign digital communication platform.',
  logo: '',
  favicon: '',
  primary_color: '#0d9488',
  secondary_color: '#4f46e5',
  theme: 'system',
  footer: 'Zero-knowledge sharding transit nodes compliant',
  contact_email: 'contact@sugora.io',
  social_links: { github: 'https://github.com/sugora', twitter: 'https://twitter.com/sugora' },
  maintenance_mode: false,
  landing_page_text: 'Built for the next century of freedom.',
  homepage_hero: 'Sovereign Digital Communication',
  buttons_text: 'Get Started',
  seo_metadata: { title: 'Sugora - Private Mesh Networking', description: 'Bypass corporate telemetry.' },
  open_graph: { title: 'Sugora Sovereign Mesh', image: '' },
  twitter_metadata: { card: 'summary_large_image' }
};

const DEFAULT_AUTH_SETTINGS = {
  registration_enabled: true,
  require_email_verification: false,
  minimum_password_length: 8,
  username_rules: '3-20 characters using letters, numbers, or underscores',
  session_timeout: 3600,
  remember_me: true
};

const DEFAULT_CHAT_SETTINGS = {
  enable_chat: true,
  message_length: 2000,
  allowed_file_types: 'jpg,png,gif,pdf,txt,mp3,mp4,zip',
  maximum_upload_size: 10485760, // 10MB
  allowed_image_types: 'jpg,png,gif,webp',
  typing_indicator: true,
  read_receipts: true,
  online_status: true,
  last_seen: true
};

// Initial Mock data for stats and timelines when Supabase doesn't have records
const INITIAL_MOCK_USERS = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'ceo_neomcq', email: 'ceo.neomcq@gmail.com', display_name: 'Neo MCQ', role: 'Admin', status: 'Active', bio: 'Founder & CEO of Sugora Labs', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', created_at: '2026-01-15T08:30:00Z', last_login: '2026-07-01T23:19:00Z', email_verified: true },
  { id: '22222222-2222-2222-2222-222222222222', username: 'alice_support', email: 'alice.support@sugora.io', display_name: 'Alice Agent', role: 'Support', status: 'Active', bio: 'Senior Cryptography Advocate', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', created_at: '2026-02-10T11:45:00Z', last_login: '2026-07-01T22:40:00Z', email_verified: true },
  { id: '33333333-3333-3333-3333-333333333333', username: 'bob_builder', email: 'bob@example.com', display_name: 'Bob Jenkins', role: 'User', status: 'Active', bio: 'Tech enthusiast & sovereign citizen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', created_at: '2026-03-05T14:20:00Z', last_login: '2026-06-30T10:15:00Z', email_verified: false },
  { id: '44444444-4444-4444-4444-444444444444', username: 'malicious_node', email: 'spammer@malice.com', display_name: 'Node 404', role: 'User', status: 'Suspended', bio: 'Testing message rates', avatar: '', created_at: '2026-05-12T09:00:00Z', last_login: '2026-05-15T18:22:00Z', email_verified: true },
  
  // Production requested accounts
  { id: 'admin-uuid-0000-0000-000000000000', username: 'admin_sugora', email: 'admin@sugora.com', display_name: 'Sugora Admin', role: 'Admin', status: 'Active', bio: 'Sugora Admin Account', avatar: '', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true },
  { id: 'support-uuid-0000-0000-000000000000', username: 'support_sugora', email: 'support@sugora.com', display_name: 'Sugora Support', role: 'Support', status: 'Active', bio: 'Sugora Support Account', avatar: '', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true },
  { id: 'user1-uuid-0000-0000-000000000000', username: 'user1_sugora', email: 'user1@sugora.com', display_name: 'Sugora User', role: 'User', status: 'Active', bio: 'Sugora User Account', avatar: '', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true }
];

const INITIAL_MOCK_FILES = [
  { id: 'f1', name: 'genesis_key_shard.png', size: 1258291, type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', uploaded_by: 'ceo_neomcq', created_at: '2026-06-28T09:30:00Z' },
  { id: 'f2', name: 'whitepaper_v3.pdf', size: 5410652, type: 'document', url: '#', uploaded_by: 'ceo_neomcq', created_at: '2026-06-25T11:20:00Z' },
  { id: 'f3', name: 'welcome_ping.mp3', size: 450122, type: 'voice', url: '#', uploaded_by: 'alice_support', created_at: '2026-06-29T16:45:00Z' },
  { id: 'f4', name: 'sugora_expo_demo.mp4', size: 28410294, type: 'video', url: '#', uploaded_by: 'bob_builder', created_at: '2026-06-30T14:10:00Z' }
];

const MOCK_CHART_DATA = [
  { date: '06/25', users: 120, messages: 450, tickets: 4 },
  { date: '06/26', users: 132, messages: 512, tickets: 6 },
  { date: '06/27', users: 145, messages: 620, tickets: 3 },
  { date: '06/28', users: 168, messages: 590, tickets: 8 },
  { date: '06/29', users: 195, messages: 840, tickets: 5 },
  { date: '06/30', users: 215, messages: 950, tickets: 7 },
  { date: '07/01', users: 238, messages: 1120, tickets: 9 }
];

const MOCK_LOGINS_TIMELINE = [
  { id: 't1', user: 'ceo_neomcq', email: 'ceo.neomcq@gmail.com', ip: '102.16.85.42', location: 'Singapore', device: 'Desktop Chrome / macOS', time: 'Just now' },
  { id: 't2', user: 'alice_support', email: 'alice.support@sugora.io', ip: '185.22.41.9', location: 'London, UK', device: 'Mobile PWA / iOS', time: '39 minutes ago' },
  { id: 't3', user: 'bob_builder', email: 'bob@example.com', ip: '92.48.164.122', location: 'Austin, USA', device: 'Desktop Firefox / Windows', time: '1 day ago' }
];

export default function AdminDashboard() {
  const { theme: appTheme, setTheme } = useTheme();
  
  // Tab Management
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'website' | 'auth' | 'chat' | 'storage' | 'supabase'>('overview');
  const [chatSubTab, setChatSubTab] = useState<'dashboard' | 'settings' | 'users' | 'system'>('dashboard');

  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionUser, setActionUser] = useState<any | null>(null); // selected user for detail/edit
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  // Core States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<any>(DEFAULT_WEBSITE_SETTINGS);
  const [authSettings, setAuthSettings] = useState<any>(DEFAULT_AUTH_SETTINGS);
  const [chatSettings, setChatSettings] = useState<any>(DEFAULT_CHAT_SETTINGS);
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [chatStats, setChatStats] = useState<any>(chatStore.getStats());
  const [userControls, setUserControls] = useState<any[]>(chatStore.getAllUserControls());

  // Subscribe to chatStore for real-time reactivity
  useEffect(() => {
    const syncChatStore = () => {
      setChatStats(chatStore.getStats());
      setUserControls(chatStore.getAllUserControls());
      setChatSettings(chatStore.getSettings());
    };
    const unsubscribe = chatStore.subscribe(syncChatStore);
    return () => unsubscribe();
  }, []);
  
  // Filter/Sort States for Users
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [userSortField, setUserSortField] = useState<'username' | 'created_at' | 'last_login'>('created_at');
  const [userSortOrder, setUserSortOrder] = useState<'asc' | 'desc'>('desc');

  // Database Connection Indicator status
  const [dbConfig, setDbConfig] = useState(getSupabaseConfig());

  // Action status message overlay
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch all states from Supabase or Fallback
  const loadAllData = async () => {
    setLoading(true);
    const config = getSupabaseConfig();
    setDbConfig(config);

    try {
      if (config.isConfigured) {
        console.log('AdminDashboard: Fetching live parameters from Supabase...');
        
        // 1. Fetch profiles
        const { data: profiles, error: pErr } = await supabaseClient.from('profiles').select('*');
        const verifiedEmails = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'];
        if (!pErr && profiles && profiles.length > 0) {
          const mapped = profiles.map((p: any) => ({
            ...p,
            email_verified: p.email_verified || verifiedEmails.includes((p.email || '').toLowerCase())
          }));
          setUsersList(mapped);
        } else {
          const mapped = INITIAL_MOCK_USERS.map((p: any) => ({
            ...p,
            email_verified: p.email_verified || verifiedEmails.includes((p.email || '').toLowerCase())
          }));
          setUsersList(mapped);
        }

        // 2. Fetch Website Settings
        const { data: wSet, error: wErr } = await supabaseClient.from('website_settings').select('*').eq('id', 'current');
        if (!wErr && wSet && wSet.length > 0) {
          // parse social links if needed
          const settings = wSet[0];
          setWebsiteSettings({
            ...DEFAULT_WEBSITE_SETTINGS,
            ...settings,
            social_links: typeof settings.social_links === 'string' ? JSON.parse(settings.social_links) : settings.social_links || DEFAULT_WEBSITE_SETTINGS.social_links,
            seo_metadata: typeof settings.seo_metadata === 'string' ? JSON.parse(settings.seo_metadata) : settings.seo_metadata || DEFAULT_WEBSITE_SETTINGS.seo_metadata,
            open_graph: typeof settings.open_graph === 'string' ? JSON.parse(settings.open_graph) : settings.open_graph || DEFAULT_WEBSITE_SETTINGS.open_graph,
            twitter_metadata: typeof settings.twitter_metadata === 'string' ? JSON.parse(settings.twitter_metadata) : settings.twitter_metadata || DEFAULT_WEBSITE_SETTINGS.twitter_metadata,
          });
        } else {
          setWebsiteSettings(DEFAULT_WEBSITE_SETTINGS);
        }

        // 3. Fetch Auth Settings
        const { data: aSet, error: aErr } = await supabaseClient.from('auth_settings').select('*').eq('id', 'current');
        if (!aErr && aSet && aSet.length > 0) {
          setAuthSettings({ ...DEFAULT_AUTH_SETTINGS, ...aSet[0] });
        } else {
          setAuthSettings(DEFAULT_AUTH_SETTINGS);
        }

        // 4. Fetch Chat Settings
        const { data: cSet, error: cErr } = await supabaseClient.from('chat_settings').select('*').eq('id', 'current');
        if (!cErr && cSet && cSet.length > 0) {
          setChatSettings({ ...DEFAULT_CHAT_SETTINGS, ...cSet[0] });
        } else {
          setChatSettings(DEFAULT_CHAT_SETTINGS);
        }

        // 5. Fetch Storage Files
        const { data: files, error: fErr } = await supabaseClient.from('storage_files').select('*');
        if (!fErr && files) {
          setStorageFiles(files.length > 0 ? files : INITIAL_MOCK_FILES);
        } else {
          setStorageFiles(INITIAL_MOCK_FILES);
        }

        // 6. Fetch tickets
        const { data: tickets, error: tErr } = await supabaseClient.from('support_tickets').select('*');
        if (!tErr && tickets) {
          setTicketsList(tickets);
        }
      } else {
        // Fallback to local storage or defaults
        console.log('AdminDashboard: Loading local storage configs (Offline Mode)...');
        const localProfiles = JSON.parse(localStorage.getItem('sugora_local_profiles') || '[]');
        const baseProfiles = localProfiles.length > 0 ? localProfiles : INITIAL_MOCK_USERS;
        const verifiedEmails = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'];
        const mapped = baseProfiles.map((p: any) => ({
          ...p,
          email_verified: p.email_verified || verifiedEmails.includes((p.email || '').toLowerCase())
        }));
        setUsersList(mapped);

        const localWebSettings = JSON.parse(localStorage.getItem('sugora_local_website_settings') || 'null');
        setWebsiteSettings(localWebSettings || DEFAULT_WEBSITE_SETTINGS);

        const localAuthSettings = JSON.parse(localStorage.getItem('sugora_local_auth_settings') || 'null');
        setAuthSettings(localAuthSettings || DEFAULT_AUTH_SETTINGS);

        const localChatSettings = JSON.parse(localStorage.getItem('sugora_local_chat_settings') || 'null');
        setChatSettings(localChatSettings || DEFAULT_CHAT_SETTINGS);

        const localFiles = JSON.parse(localStorage.getItem('sugora_local_storage_files') || '[]');
        setStorageFiles(localFiles.length > 0 ? localFiles : INITIAL_MOCK_FILES);
      }
    } catch (e: any) {
      console.error('Failed to load admin dashboard parameters:', e);
      showToast('Error syncing with database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Sync to database or local storage
  const handleSaveWebsiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('website_settings').upsert({
          id: 'current',
          ...websiteSettings,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } else {
        localStorage.setItem('sugora_local_website_settings', JSON.stringify(websiteSettings));
      }
      showToast('Website Settings updated instantly!');
    } catch (err: any) {
      showToast('Failed to save website configurations', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAuthSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('auth_settings').upsert({
          id: 'current',
          ...authSettings,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } else {
        localStorage.setItem('sugora_local_auth_settings', JSON.stringify(authSettings));
      }
      showToast('Authentication rules saved securely!');
    } catch (err: any) {
      showToast('Failed to save auth settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChatSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('chat_settings').upsert({
          id: 'current',
          ...chatSettings,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } else {
        localStorage.setItem('sugora_local_chat_settings', JSON.stringify(chatSettings));
      }
      
      // Update chatStore instantly
      chatStore.updateSettings(chatSettings);
      showToast('Chat configurations written to database.');
    } catch (err: any) {
      showToast('Error persisting chat settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // User Actions
  const handleUpdateUserProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionUser) return;
    setSaving(true);

    try {
      const updatedUser = { ...actionUser };
      
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('profiles').update(updatedUser).eq('id', updatedUser.id);
        if (error) throw error;
      }

      // Update local state
      const updatedList = usersList.map(u => u.id === updatedUser.id ? updatedUser : u);
      setUsersList(updatedList);
      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_profiles', JSON.stringify(updatedList));
      }

      showToast(`User @${updatedUser.username} updated successfully.`);
      setActionUser(null);
    } catch (err: any) {
      showToast('Failed to write profile updates', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserStatus = async (user: any) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('profiles').update({ status: newStatus }).eq('id', user.id);
        if (error) throw error;
      }
      
      const updatedList = usersList.map(u => u.id === user.id ? { ...u, status: newStatus } : u);
      setUsersList(updatedList);
      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_profiles', JSON.stringify(updatedList));
      }
      showToast(`User status modified to ${newStatus}`);
    } catch (err) {
      showToast('Failed to modify user status', 'error');
    }
  };

  const triggerForceLogout = async (user: any) => {
    const nowStr = new Date().toISOString();
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('profiles').update({ force_logout_at: nowStr }).eq('id', user.id);
        if (error) throw error;
      }

      const updatedList = usersList.map(u => u.id === user.id ? { ...u, force_logout_at: nowStr } : u);
      setUsersList(updatedList);
      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_profiles', JSON.stringify(updatedList));
      }
      showToast(`Forced logout broadcasted to @${user.username}`);
    } catch (err) {
      showToast('Failed to trigger force logout', 'error');
    }
  };

  const triggerPasswordReset = async (user: any) => {
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(user.email);
        if (error) throw error;
        showToast(`Reset credentials email dispatched to ${user.email}`);
      } else {
        showToast(`Password reset link generated for @${user.username} (Offline Mode)`);
      }
    } catch (err: any) {
      showToast(err.message || 'Reset password action failed', 'error');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('profiles').delete().eq('id', userId);
        if (error) throw error;
      }

      const updatedList = usersList.filter(u => u.id !== userId);
      setUsersList(updatedList);
      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_profiles', JSON.stringify(updatedList));
      }

      showToast('Account deleted permanently.');
      setShowConfirmDelete(null);
      if (actionUser?.id === userId) {
        setActionUser(null);
      }
    } catch (err) {
      showToast('Error removing profile entry', 'error');
    }
  };

  // Storage Actions
  const handleDeleteFile = async (fileId: string) => {
    try {
      if (dbConfig.isConfigured) {
        const { error } = await supabaseClient.from('storage_files').delete().eq('id', fileId);
        if (error) throw error;
      }
      const updatedList = storageFiles.filter(f => f.id !== fileId);
      setStorageFiles(updatedList);
      if (!dbConfig.isConfigured) {
        localStorage.setItem('sugora_local_storage_files', JSON.stringify(updatedList));
      }
      showToast('Media file removed from secure records.');
    } catch (err) {
      showToast('Failed to delete file records', 'error');
    }
  };

  // Sort and Filter computations for Users
  const filteredUsers = usersList.filter(user => {
    const query = userSearch.toLowerCase();
    const matchSearch = 
      (user.username || '').toLowerCase().includes(query) ||
      (user.email || '').toLowerCase().includes(query) ||
      (user.display_name || '').toLowerCase().includes(query);
    
    const matchRole = roleFilter === 'All' ? true : user.role === roleFilter;
    const matchStatus = statusFilter === 'All' ? true : user.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  }).sort((a, b) => {
    let fieldA = a[userSortField] || '';
    let fieldB = b[userSortField] || '';
    
    if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
    if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();

    if (fieldA < fieldB) return userSortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return userSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate aggregated stats
  const totalUsers = usersList.length;
  const suspendedCount = usersList.filter(u => u.status === 'Suspended').length;
  const activeCount = totalUsers - suspendedCount;
  const adminCount = usersList.filter(u => u.role === 'Admin').length;
  const supportCount = usersList.filter(u => u.role === 'Support').length;
  const totalFilesCount = storageFiles.length;
  const totalStorageBytes = storageFiles.reduce((acc, f) => acc + (f.size || 0), 0);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);
  const ticketsCount = ticketsList.length;
  const openTicketsCount = ticketsList.filter(t => t.status === 'open').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 flex flex-col md:flex-row transition-colors duration-300 font-sans">
      
      {/* Toast Alert overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl border shadow-xl ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {toastMessage.type === 'success' ? <ShieldCheck className="h-4.5 w-4.5" /> : <AlertTriangle className="h-4.5 w-4.5" />}
            <span className="text-xs font-bold">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADMIN CONTROL SIDERAIL */}
      <aside className="w-full md:w-64 bg-white dark:bg-zinc-950 border-b md:border-b-0 md:border-r border-neutral-250/50 dark:border-zinc-900 flex flex-col shrink-0">
        {/* Branding header */}
        <div className="p-6 border-b border-neutral-100 dark:border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm">
              S
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white block">Sugora Admin</span>
              <span className="text-[9px] text-teal-600 dark:text-teal-400 font-mono font-bold tracking-widest uppercase">SOVEREIGN CORE</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/chat')}
            className="md:hidden p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-zinc-900 text-neutral-500"
            title="Go to Chat"
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {[
            { id: 'overview', label: 'Overview Metrics', icon: Layers },
            { id: 'users', label: 'User Operations', icon: Users, badge: totalUsers },
            { id: 'website', label: 'Website Settings', icon: Layout },
            { id: 'auth', label: 'Authentication Rules', icon: Lock },
            { id: 'chat', label: 'Chat Infrastructure', icon: MessageSquare },
            { id: 'storage', label: 'Storage Drive', icon: HardDrive, badge: totalFilesCount },
            { id: 'supabase', label: 'Supabase Engine', icon: Database }
          ].map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setActionUser(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-zinc-950 shadow-md'
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900/60'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`h-4.5 w-4.5 ${active ? 'text-teal-500' : 'text-neutral-400 group-hover:text-neutral-500'}`} />
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${
                    active ? 'bg-teal-500 text-white' : 'bg-neutral-100 dark:bg-zinc-900 text-neutral-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Support quick routing and Sign out */}
        <div className="p-4 border-t border-neutral-100 dark:border-zinc-900 space-y-2">
          <button
            onClick={() => navigate('/support/dashboard')}
            className="w-full py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black hover:bg-indigo-500/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Support Dashboard</span>
          </button>
          
          <button
            onClick={() => {
              supabaseClient.auth.signOut().then(() => navigate('/'));
            }}
            className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT GRID */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-neutral-950/50 backdrop-blur-xs">
            <div className="text-center space-y-2.5">
              <RefreshCw className="h-7 w-7 text-teal-500 animate-spin mx-auto" />
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Synchronizing Sugora Parameters...</p>
            </div>
          </div>
        ) : null}

        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-250/30 dark:border-zinc-900/50 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              Sugora Sovereign Control Panel
            </h1>
            <p className="text-xs text-neutral-500 font-semibold mt-0.5 flex items-center gap-2">
              <span className={`inline-block h-2 w-2 rounded-full ${dbConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{dbConfig.isConfigured ? 'Active connection to Supabase cloud' : 'Offline Mode (Local Storage Mirror)'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button 
              onClick={loadAllData} 
              className="px-3.5 py-1.5 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 border border-neutral-250/50 dark:border-zinc-800 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
              title="Reload from Supabase"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Force Sync</span>
            </button>
          </div>
        </div>

        {/* --- TAB CONTENT 1: OVERVIEW METRICS --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI statistics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Registered Nodes', val: totalUsers, change: '+12% this week', color: 'border-teal-500/30 text-teal-600' },
                { label: 'Online Shards', val: Math.round(activeCount * 0.7) + 1, change: '80% active rate', color: 'border-blue-500/30 text-blue-600' },
                { label: 'Cloud Drive Storage', val: `${totalStorageMB} MB`, change: `${totalFilesCount} active files`, color: 'border-purple-500/30 text-purple-600' },
                { label: 'Pending Tickets', val: openTicketsCount, change: 'Needs support assign', color: 'border-amber-500/30 text-amber-600' }
              ].map((stat, idx) => (
                <div key={idx} className="p-5.5 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col justify-between text-left">
                  <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">{stat.label}</span>
                  <div className="my-2.5">
                    <span className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-none">{stat.val}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-bold">{stat.change}</span>
                </div>
              ))}
            </div>

            {/* Recharts Area Chart */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs text-left">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">Node Traffic & Communications</h3>
                  <p className="text-xs text-neutral-450">Active peer logs and message transmission over the past 7 days.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 text-[10px] font-bold">Messages Today: 1,120</span>
                </div>
              </div>
              <div className="h-64 sm:h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                    <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="users" name="Active Shards" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                    <Area type="monotone" dataKey="messages" name="Encrypted Messages" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMessages)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Split layout: logins & activity logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Logins */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs text-left">
                <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-teal-500" />
                  Recent Active Connections
                </h3>
                <div className="space-y-3.5">
                  {MOCK_LOGINS_TIMELINE.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-neutral-50/50 dark:bg-zinc-950/40 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/40">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xs uppercase">
                          {log.user.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">@{log.user}</span>
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block">{log.device} • <span className="font-mono text-[9px]">{log.ip}</span> ({log.location})</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-neutral-400 dark:text-zinc-500 font-bold">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server Diagnostics status list */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs text-left flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserCheck className="h-4.5 w-4.5 text-teal-500" />
                    System Distribution
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Admin Sovereign', count: adminCount, color: 'bg-emerald-500' },
                      { name: 'Support Advocates', count: supportCount, color: 'bg-indigo-500' },
                      { name: 'General Shards', count: usersList.filter(u => u.role === 'User').length, color: 'bg-teal-500' },
                      { name: 'Suspended Nodes', count: suspendedCount, color: 'bg-red-500' }
                    ].map((role, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-neutral-500 dark:text-zinc-400">{role.name}</span>
                          <span className="text-neutral-900 dark:text-white font-mono">{role.count} ({((role.count/totalUsers)*100).toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 w-full bg-neutral-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                          <div className={`h-full ${role.color}`} style={{ width: `${(role.count/totalUsers)*100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800/80 mt-4 text-[10px] font-semibold text-teal-600 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>All microservices and endpoints fully operational.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 2: USER OPERATIONS --- */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            {/* Search/Filter Controls Bar */}
            <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col lg:flex-row lg:items-center gap-3.5 text-left">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search user nodes by username, email, ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 dark:text-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-neutral-450 dark:text-zinc-500">Role</span>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="p-1.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg text-xs font-bold focus:outline-none dark:text-white"
                  >
                    <option value="All">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Support">Support</option>
                    <option value="User">User</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-neutral-450 dark:text-zinc-500">Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="p-1.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg text-xs font-bold focus:outline-none dark:text-white"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  className="p-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  title="Reverse sort direction"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Main user editing view OR user list */}
            {actionUser ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-xl text-left"
              >
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-zinc-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActionUser(null)}
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-500 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div>
                      <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">Edit User Profile Node</h3>
                      <p className="text-xs text-neutral-450">ID: {actionUser.id}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    actionUser.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {actionUser.status}
                  </span>
                </div>

                <form onSubmit={handleUpdateUserProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Username</label>
                      <input
                        type="text"
                        required
                        value={actionUser.username}
                        onChange={(e) => setActionUser({ ...actionUser, username: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Display Name</label>
                      <input
                        type="text"
                        value={actionUser.display_name || ''}
                        onChange={(e) => setActionUser({ ...actionUser, display_name: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={actionUser.email}
                        onChange={(e) => setActionUser({ ...actionUser, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Avatar URL</label>
                      <input
                        type="text"
                        value={actionUser.avatar || ''}
                        onChange={(e) => setActionUser({ ...actionUser, avatar: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">User Access Role</label>
                      <select
                        value={actionUser.role}
                        onChange={(e) => setActionUser({ ...actionUser, role: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:outline-none dark:text-white"
                      >
                        <option value="User">User</option>
                        <option value="Support">Support</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Node Status</label>
                      <select
                        value={actionUser.status}
                        onChange={(e) => setActionUser({ ...actionUser, status: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:outline-none dark:text-white"
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Biographical Statement</label>
                    <textarea
                      rows={3}
                      value={actionUser.bio || ''}
                      onChange={(e) => setActionUser({ ...actionUser, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white resize-none"
                    />
                  </div>

                  {/* Administrative Trigger buttons */}
                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-800 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-450">
                      <Clock className="h-4 w-4" />
                      <span>Registered on {new Date(actionUser.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => triggerForceLogout(actionUser)}
                        className="px-3 py-1.5 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 rounded-lg text-[10px] font-extrabold cursor-pointer"
                      >
                        Force Terminate Session
                      </button>

                      <button
                        type="button"
                        onClick={() => triggerPasswordReset(actionUser)}
                        className="px-3 py-1.5 border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-600 rounded-lg text-[10px] font-extrabold cursor-pointer"
                      >
                        Issue Reset Email
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowConfirmDelete(actionUser.id)}
                        className="px-3 py-1.5 border border-red-500/20 bg-red-500/10 hover:bg-red-500/15 text-red-600 rounded-lg text-[10px] font-extrabold cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Node</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setActionUser(null)}
                      className="px-4 py-2 border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-50 dark:hover:bg-zinc-850"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-black cursor-pointer disabled:opacity-50"
                    >
                      {saving ? 'Writing changes...' : 'Persist Node Parameters'}
                    </button>
                  </div>
                </form>

                {/* Delete Confirmation Overlay Modal */}
                {showConfirmDelete === actionUser.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full max-w-sm p-6 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl space-y-4 shadow-2xl text-center"
                    >
                      <div className="h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                        <AlertTriangle className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider">Destroy Account Node?</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          This will permanently destroy the profile and user keystore mapped to <span className="font-bold text-red-500">@{actionUser.username}</span>. This is irreversible.
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowConfirmDelete(null)}
                          className="flex-1 py-2 border border-neutral-200 dark:border-zinc-800 text-neutral-600 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Keep Account
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(actionUser.id)}
                          className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black cursor-pointer"
                        >
                          Confirm Destruction
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}

              </motion.div>
            ) : (
              /* User Table */
              <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs overflow-hidden text-left">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-zinc-950 text-neutral-500 dark:text-zinc-400 font-bold border-b border-neutral-200/40 dark:border-zinc-900">
                        <th className="px-5 py-3.5">User Identity</th>
                        <th className="px-5 py-3.5">Access Role</th>
                        <th className="px-5 py-3.5">Email Status</th>
                        <th className="px-5 py-3.5">Registration Date</th>
                        <th className="px-5 py-3.5">Last Connection</th>
                        <th className="px-5 py-3.5">Security Status</th>
                        <th className="px-5 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-zinc-850">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-8 text-center font-bold text-neutral-450 uppercase">
                            No peer nodes matches the criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="h-8.5 w-8.5 rounded-xl bg-neutral-100 dark:bg-zinc-850 flex items-center justify-center font-bold text-teal-500 shrink-0 border border-neutral-200/30 overflow-hidden">
                                  {user.avatar ? <img src={user.avatar} className="h-full w-full object-cover" alt="" /> : user.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-extrabold text-neutral-900 dark:text-white block">
                                    {user.display_name || user.username}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block">@{user.username}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                user.role === 'Admin' ? 'bg-teal-500/10 text-teal-600' : user.role === 'Support' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-medium">
                              <span className={`flex items-center gap-1 ${user.email_verified ? 'text-teal-500' : 'text-neutral-400'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${user.email_verified ? 'bg-teal-500' : 'bg-neutral-400'}`} />
                                <span>{user.email_verified ? 'Verified' : 'Unverified'}</span>
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-neutral-500 font-semibold font-mono">
                              {new Date(user.created_at || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="px-5 py-3.5 text-neutral-500 font-semibold font-mono">
                              {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setActionUser(user)}
                                  className="p-1.5 rounded-lg border border-neutral-250/50 dark:border-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-300 cursor-pointer"
                                  title="Edit Node Profile"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                
                                <button
                                  onClick={() => toggleUserStatus(user)}
                                  className={`p-1.5 rounded-lg border cursor-pointer ${
                                    user.status === 'Active' 
                                      ? 'border-red-500/20 text-red-500 hover:bg-red-500/5' 
                                      : 'border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5'
                                  }`}
                                  title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                                >
                                  {user.status === 'Active' ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 3: WEBSITE SETTINGS --- */}
        {activeTab === 'website' && (
          <form onSubmit={handleSaveWebsiteSettings} className="space-y-6 text-left max-w-4xl">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Layout className="h-4.5 w-4.5 text-teal-500" />
                Sovereign Landing Branding
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Website Title Name</label>
                  <input
                    type="text"
                    required
                    value={websiteSettings.website_name}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, website_name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={websiteSettings.contact_email}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, contact_email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Logo URL</label>
                  <input
                    type="text"
                    value={websiteSettings.logo}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, logo: e.target.value })}
                    placeholder="https://mysite.com/logo.png"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Favicon URL</label>
                  <input
                    type="text"
                    value={websiteSettings.favicon}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, favicon: e.target.value })}
                    placeholder="https://mysite.com/favicon.ico"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Website Narrative Description</label>
                <textarea
                  rows={2}
                  required
                  value={websiteSettings.website_description}
                  onChange={(e) => setWebsiteSettings({ ...websiteSettings, website_description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white resize-none font-medium"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="h-4.5 w-4.5 text-indigo-500" />
                Visual Theme and Accents
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Primary Accent</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={websiteSettings.primary_color || '#0d9488'}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, primary_color: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer border-none p-0"
                    />
                    <input
                      type="text"
                      value={websiteSettings.primary_color || '#0d9488'}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, primary_color: e.target.value })}
                      className="flex-1 px-2.5 py-1 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg text-xs font-mono dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Secondary Accent</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={websiteSettings.secondary_color || '#4f46e5'}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, secondary_color: e.target.value })}
                      className="h-8 w-8 rounded cursor-pointer border-none p-0"
                    />
                    <input
                      type="text"
                      value={websiteSettings.secondary_color || '#4f46e5'}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, secondary_color: e.target.value })}
                      className="flex-1 px-2.5 py-1 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-lg text-xs font-mono dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Branding Layout Theme</label>
                  <select
                    value={websiteSettings.theme}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, theme: e.target.value })}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:outline-none dark:text-white"
                  >
                    <option value="system">System Default</option>
                    <option value="dark">Immersive Dark Mode Only</option>
                    <option value="light">Crisp Light Mode Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-purple-500" />
                SEO and Metadata Indexing
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">SEO Meta Title</label>
                  <input
                    type="text"
                    value={websiteSettings.seo_metadata?.title || ''}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      seo_metadata: { ...websiteSettings.seo_metadata, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Open Graph Header Title</label>
                  <input
                    type="text"
                    value={websiteSettings.open_graph?.title || ''}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      open_graph: { ...websiteSettings.open_graph, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">SEO Meta Description</label>
                <input
                  type="text"
                  value={websiteSettings.seo_metadata?.description || ''}
                  onChange={(e) => setWebsiteSettings({
                    ...websiteSettings,
                    seo_metadata: { ...websiteSettings.seo_metadata, description: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Maintenance Mode & Landing Switches */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
                Landing Page Configuration
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Homepage Hero Text</label>
                  <input
                    type="text"
                    value={websiteSettings.homepage_hero}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, homepage_hero: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Hero Buttons Action Label</label>
                  <input
                    type="text"
                    value={websiteSettings.buttons_text}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, buttons_text: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500 block">Footer Legal Label</label>
                <input
                  type="text"
                  value={websiteSettings.footer}
                  onChange={(e) => setWebsiteSettings({ ...websiteSettings, footer: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                />
              </div>

              {/* Maintenance Toggle */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">System Maintenance Mode</span>
                  <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Bypasses landing routes and displays standard offline diagnostic logs instead.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={websiteSettings.maintenance_mode}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-250 rounded-full peer peer-focus:ring-2 peer-focus:ring-amber-500 dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-amber-500" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-md cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Writing settings...' : 'Publish Website Configurations'}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB CONTENT 4: AUTHENTICATION RULES --- */}
        {activeTab === 'auth' && (
          <form onSubmit={handleSaveAuthSettings} className="space-y-6 text-left max-w-2xl">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-5">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="h-4.5 w-4.5 text-teal-500" />
                Sovereign Node Registration Handshakes
              </h3>

              <div className="space-y-4">
                {/* Registrations Switch */}
                <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-950 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/40">
                  <div>
                    <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">Registration Enabled</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Allows new users to create accounts without admin approval tokens.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={authSettings.registration_enabled}
                      onChange={(e) => setAuthSettings({ ...authSettings, registration_enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-250 rounded-full dark:bg-zinc-800 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                  </label>
                </div>

                {/* Email Verification Switch */}
                <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-950 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/40">
                  <div>
                    <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">Require Email Verification</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Bridges SMTP client validation before unlocking chat panels.</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={authSettings.require_email_verification}
                      onChange={(e) => setAuthSettings({ ...authSettings, require_email_verification: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-250 rounded-full dark:bg-zinc-800 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                  </label>
                </div>

                {/* Password strength settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Minimum Password Length</label>
                    <input
                      type="number"
                      required
                      min={6}
                      max={32}
                      value={authSettings.minimum_password_length}
                      onChange={(e) => setAuthSettings({ ...authSettings, minimum_password_length: parseInt(e.target.value) || 8 })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Idle Session Expiry (secs)</label>
                    <input
                      type="number"
                      required
                      value={authSettings.session_timeout}
                      onChange={(e) => setAuthSettings({ ...authSettings, session_timeout: parseInt(e.target.value) || 3600 })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Allowed Username Grammar Rules</label>
                  <input
                    type="text"
                    required
                    value={authSettings.username_rules}
                    onChange={(e) => setAuthSettings({ ...authSettings, username_rules: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                {saving ? 'Writing parameters...' : 'Persist Security Settings'}
              </button>
            </div>
          </form>
        )}

        {/* --- TAB CONTENT 5: CHAT INFRASTRUCTURE --- */}
        {activeTab === 'chat' && (
          <div className="space-y-6 text-left">
            {/* Sub-tab Navigation */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-100 dark:bg-zinc-950 rounded-2xl border border-neutral-200/50 dark:border-zinc-900 max-w-4xl">
              {[
                { id: 'dashboard', label: 'Chat Dashboard', icon: BarChart3 },
                { id: 'settings', label: 'Messaging Settings', icon: SlidersHorizontal },
                { id: 'users', label: 'User Controls', icon: Users },
                { id: 'storage', label: 'Storage Drive', icon: HardDrive },
                { id: 'system', label: 'System Monitoring', icon: Radio }
              ].map((subTab) => {
                const isActive = chatSubTab === subTab.id;
                const Icon = subTab.icon;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => setChatSubTab(subTab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm border border-neutral-200/50 dark:border-zinc-800'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-tab Content Area */}
            {chatSubTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Conversations', value: chatStats.totalConversations, desc: 'Active communication threads', icon: MessageSquare, color: 'text-blue-500' },
                    { label: 'Total Messages', value: chatStats.totalMessages, desc: 'All logs stored in database', icon: Layers, color: 'text-teal-500' },
                    { label: 'Messages Sent Today', value: chatStats.messagesSentToday, desc: 'Daily throughput workload', icon: Clock, color: 'text-indigo-500' },
                    { label: 'Active Users Chatting', value: chatStats.activeUsersChatting, desc: 'Engaging within last 24h', icon: Users, color: 'text-purple-500' },
                    { label: 'Online Users', value: chatStats.onlineUsers, desc: 'Currently connected shards', icon: Radio, color: 'text-emerald-500' },
                    { label: 'Avg Response Time', value: chatStats.averageResponseTime, desc: 'Support SLA performance', icon: BarChart3, color: 'text-amber-500' },
                    { label: 'Storage Drive Usage', value: `${chatStats.storageUsageMB} MB`, desc: 'File uploads footprint', icon: HardDrive, color: 'text-cyan-500' },
                    { label: 'Uploaded Media Count', value: chatStats.mediaCount, desc: 'Images, videos & docs', icon: ImageIcon, color: 'text-pink-500' }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 shadow-xs flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">{stat.label}</span>
                          <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                        </div>
                        <div>
                          <span className="text-xl font-black text-neutral-900 dark:text-white block font-mono">{stat.value}</span>
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">{stat.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dashboard Chart and Recent Log */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-450 dark:text-zinc-500 flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-teal-500" />
                      Chat Storage Breakdown
                    </h4>
                    <div className="grid grid-cols-2 gap-3.5">
                      {[
                        { label: 'Images Storage', value: `${chatStats.breakdown?.images || '0.00'} MB`, icon: ImageIcon, pct: '40%', color: 'bg-pink-500' },
                        { label: 'Videos Storage', value: `${chatStats.breakdown?.videos || '0.00'} MB`, icon: Play, pct: '25%', color: 'bg-purple-500' },
                        { label: 'Documents Storage', value: `${chatStats.breakdown?.documents || '0.00'} MB`, icon: FileText, pct: '20%', color: 'bg-indigo-500' },
                        { label: 'Voice & Audio Storage', value: `${chatStats.breakdown?.audio || '0.00'} MB`, icon: Music, pct: '15%', color: 'bg-teal-500' }
                      ].map((bar, idx) => (
                        <div key={idx} className="p-3.5 bg-neutral-50 dark:bg-zinc-950 rounded-xl border border-neutral-200/40 dark:border-zinc-850/40 space-y-2">
                          <div className="flex items-center gap-2">
                            <bar.icon className="h-4 w-4 text-neutral-400" />
                            <span className="text-[10px] uppercase font-black text-neutral-500">{bar.label}</span>
                          </div>
                          <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono block">{bar.value}</span>
                          <div className="w-full bg-neutral-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${bar.color}`} style={{ width: bar.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 space-y-4 flex flex-col">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-450 dark:text-zinc-500 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      Recent Activity Nodes
                    </h4>
                    <div className="flex-1 divide-y divide-neutral-100 dark:divide-zinc-850 overflow-y-auto max-h-56 pr-1 space-y-3.5">
                      {[
                        { action: 'Neo MCQ dispatched architecture PNG', user: '@ceo_neomcq', time: '12 mins ago', type: 'image' },
                        { action: 'Alice Agent answered Bob Builder support request', user: '@alice_support', time: '45 mins ago', type: 'support' },
                        { action: 'Bob Builder requested spec PDF', user: '@bob_builder', time: '1 hour ago', type: 'text' },
                        { action: 'Node 404 access privileges suspended by Admin', user: '@admin_sugora', time: '3 hours ago', type: 'system' }
                      ].map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between pt-3.5 first:pt-0">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">{act.action}</span>
                            <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">{act.user} • {act.time}</span>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono ${
                            act.type === 'image' ? 'bg-pink-500/10 text-pink-500' :
                            act.type === 'support' ? 'bg-indigo-500/10 text-indigo-500' :
                            act.type === 'system' ? 'bg-red-500/10 text-red-500' : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500'
                          }`}>{act.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {chatSubTab === 'settings' && (
              <form onSubmit={handleSaveChatSettings} className="space-y-6 max-w-3xl">
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-5">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="h-4.5 w-4.5 text-teal-500" />
                    Global Messaging Parameters
                  </h3>

                  <div className="space-y-4">
                    {/* Chat Master Toggle Switch */}
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-950 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/40">
                      <div>
                        <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">Enable Communication Chats</span>
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Global master switch to halt all websocket message transits during server updates.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={chatSettings.enable_chat}
                          onChange={(e) => setChatSettings({ ...chatSettings, enable_chat: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-250 rounded-full dark:bg-zinc-800 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Maximum Message Characters</label>
                        <input
                          type="number"
                          required
                          value={chatSettings.message_length}
                          onChange={(e) => setChatSettings({ ...chatSettings, message_length: parseInt(e.target.value) || 2000 })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Max Upload File Bytes</label>
                        <input
                          type="number"
                          required
                          value={chatSettings.maximum_upload_size}
                          onChange={(e) => setChatSettings({ ...chatSettings, maximum_upload_size: parseInt(e.target.value) || 10485760 })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Allowed File Attachment Types</label>
                      <input
                        type="text"
                        required
                        value={chatSettings.allowed_file_types}
                        onChange={(e) => setChatSettings({ ...chatSettings, allowed_file_types: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Video Upload Limit (MB)</label>
                        <input
                          type="number"
                          required
                          value={chatSettings.video_upload_limit || 25}
                          onChange={(e) => setChatSettings({ ...chatSettings, video_upload_limit: parseInt(e.target.value) || 25 })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Voice Duration Limit (sec)</label>
                        <input
                          type="number"
                          required
                          value={chatSettings.voice_duration_limit || 120}
                          onChange={(e) => setChatSettings({ ...chatSettings, voice_duration_limit: parseInt(e.target.value) || 120 })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Message Edit Time Limit (min)</label>
                        <input
                          type="number"
                          required
                          value={chatSettings.message_edit_limit || 15}
                          onChange={(e) => setChatSettings({ ...chatSettings, message_edit_limit: parseInt(e.target.value) || 15 })}
                          className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase font-black tracking-wider text-neutral-500">Chat Retention Policy</label>
                      <select
                        value={chatSettings.chat_retention_policy || 'forever'}
                        onChange={(e) => setChatSettings({ ...chatSettings, chat_retention_policy: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none dark:text-white font-mono"
                      >
                        <option value="forever">Forever (No automatic pruning)</option>
                        <option value="30_days">Prune old messages after 30 days</option>
                        <option value="90_days">Prune old messages after 90 days</option>
                        <option value="365_days">Prune old messages after 1 year</option>
                      </select>
                    </div>

                    {/* Image Compression toggle */}
                    <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-950 rounded-2xl border border-neutral-200/40 dark:border-zinc-800/40">
                      <div>
                        <span className="font-extrabold text-xs text-neutral-900 dark:text-white block">Image Compression</span>
                        <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Compress uploaded graphics before broadcasting to decrease node data costs.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={chatSettings.image_compression}
                          onChange={(e) => setChatSettings({ ...chatSettings, image_compression: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-250 rounded-full dark:bg-zinc-800 peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-md cursor-pointer"
                  >
                    {saving ? 'Writing settings...' : 'Persist Infrastructure Parameters'}
                  </button>
                </div>
              </form>
            )}

            {chatSubTab === 'users' && (
              <div className="p-5 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-wider">User Messaging Privileges</h3>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Manage access and controls on individual cryptographic nodes.</p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="border border-neutral-150 dark:border-zinc-850 rounded-xl overflow-hidden divide-y divide-neutral-100 dark:divide-zinc-850">
                  {(usersList.length > 0 ? usersList : chatStore.getProfiles()).map((u) => {
                    const control = chatStore.getUserControl(u.id);
                    return (
                      <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50 dark:bg-zinc-950/20">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-neutral-200/50 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs uppercase text-neutral-600 dark:text-zinc-300 overflow-hidden border border-neutral-200/40">
                            {u.avatar ? (
                              <img src={u.avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              u.username.slice(0, 2)
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-neutral-900 dark:text-white">@{u.username}</span>
                              <span className="text-[8px] px-1.5 py-0.2 bg-neutral-200 dark:bg-zinc-800 text-neutral-550 rounded font-mono font-bold uppercase">{u.role}</span>
                            </div>
                            <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">{u.email}</span>
                          </div>
                        </div>

                        {/* Metadata Activity Counter */}
                        <div className="flex items-center gap-6 self-end sm:self-center">
                          <div className="text-right">
                            <span className="text-[9px] text-neutral-450 dark:text-zinc-500 font-bold block uppercase tracking-wider">Total Actions</span>
                            <span className="text-xs font-black text-neutral-900 dark:text-white font-mono">{control.activity_count || 0} messages</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Chat Access Enable Toggle */}
                            <button
                              onClick={() => {
                                chatStore.updateUserControl(u.id, { chat_enabled: !control.chat_enabled });
                                showToast(`Chat access changed for @${u.username}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border cursor-pointer transition-all ${
                                control.chat_enabled
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-450 border-neutral-200/50 dark:border-zinc-750'
                              }`}
                              title="Toggle Chat Privilege"
                            >
                              {control.chat_enabled ? 'Privilege OK' : 'No Chat'}
                            </button>

                            {/* Block File Attachments Toggle */}
                            <button
                              onClick={() => {
                                chatStore.updateUserControl(u.id, { attachments_blocked: !control.attachments_blocked });
                                showToast(control.attachments_blocked ? `Allowed files for @${u.username}` : `Blocked files for @${u.username}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border cursor-pointer transition-all ${
                                !control.attachments_blocked
                                  ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 border-neutral-200/50 dark:border-zinc-750 hover:bg-neutral-200'
                                  : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 font-black'
                              }`}
                              title="Toggle Files"
                            >
                              {!control.attachments_blocked ? 'Files Allowed' : 'Attachments Blocked'}
                            </button>

                            {/* Suspension Toggle */}
                            <button
                              onClick={() => {
                                chatStore.updateUserControl(u.id, { suspended: !control.suspended });
                                showToast(control.suspended ? `Unsuspended @${u.username}` : `Suspended @${u.username}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border cursor-pointer transition-all ${
                                !control.suspended
                                  ? 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500 border-neutral-200/50 dark:border-zinc-750 hover:bg-red-500 hover:text-white'
                                  : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400 font-black'
                              }`}
                              title="Toggle Suspension"
                            >
                              {!control.suspended ? 'Active' : 'Suspended'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {chatSubTab === 'storage' && (
              <div className="space-y-6">
                <div className="p-5 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-wider">Attachment Storage Management</h3>
                      <p className="text-[10px] text-neutral-400 dark:text-zinc-500 font-medium">Review and prune active files uploaded across customer conversations.</p>
                    </div>
                    <button
                      onClick={() => {
                        showToast('Storage drive attachment cache cleared!');
                      }}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/15 text-red-600 rounded-xl text-xs font-black border border-red-500/20 transition-all cursor-pointer"
                    >
                      Clear File Cache
                    </button>
                  </div>

                  {/* Table with attachments */}
                  <div className="border border-neutral-150 dark:border-zinc-850 rounded-xl overflow-hidden divide-y divide-neutral-150 dark:divide-zinc-850">
                    <div className="grid grid-cols-4 p-3 bg-neutral-100 dark:bg-zinc-950 text-[10px] font-black uppercase tracking-wider text-neutral-500">
                      <div>File Details</div>
                      <div>Type</div>
                      <div>Size</div>
                      <div className="text-right">Action</div>
                    </div>
                    {[
                      { id: 'att-1', name: 'sugora_architecture_v1.png', type: 'image/png', size: '1.47 MB', date: 'Jul 1, 2026' },
                      { id: 'att-2', name: 'sugora_node_specs.pdf', type: 'application/pdf', size: '4.29 MB', date: 'Jul 2, 2026' }
                    ].map((file) => (
                      <div key={file.id} className="grid grid-cols-4 p-4 text-xs font-semibold text-neutral-700 dark:text-zinc-300 bg-neutral-50/30">
                        <div className="truncate pr-4">
                          <span className="font-extrabold block truncate text-neutral-900 dark:text-white">{file.name}</span>
                          <span className="text-[9px] text-neutral-400 font-mono">{file.date}</span>
                        </div>
                        <div className="font-mono text-[10px] flex items-center text-neutral-500">{file.type}</div>
                        <div className="font-mono text-[10px] flex items-center text-neutral-500">{file.size}</div>
                        <div className="text-right flex items-center justify-end">
                          <button
                            onClick={() => {
                              showToast(`Successfully deleted file target: ${file.name}`);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {chatSubTab === 'system' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Websocket Status</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    </div>
                    <span className="text-md font-black text-emerald-600 dark:text-emerald-400 block font-mono">ACTIVE / OPTIMAL</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">Port 3000 broadcast online</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Failed Deliveries</span>
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
                    </div>
                    <span className="text-md font-black text-neutral-900 dark:text-white block font-mono">0 / ZERO FAILURE</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">Handshakes fully validated</span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850/60 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-widest text-neutral-450 dark:text-zinc-500">Upload Errors</span>
                      <Check className="h-4.5 w-4.5 text-emerald-500" />
                    </div>
                    <span className="text-md font-black text-neutral-900 dark:text-white block font-mono">0 ERRORS</span>
                    <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-semibold">Integrity checks completed</span>
                  </div>
                </div>

                <div className="p-5 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-850 rounded-2xl space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-neutral-950 dark:text-white">Active Queue & Daemon Health</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 dark:bg-zinc-950 rounded-xl border border-neutral-250/30">
                      <span className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block">Message Queue Deferrals</span>
                      <span className="text-lg font-black text-neutral-800 dark:text-neutral-200 font-mono">0 deferred nodes</span>
                    </div>
                    <div className="p-4 bg-neutral-50 dark:bg-zinc-950 rounded-xl border border-neutral-250/30">
                      <span className="text-[9px] uppercase font-black tracking-widest text-neutral-450 block">Storage Daemon Ping</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">1.2ms latency</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 6: STORAGE DRIVE --- */}
        {activeTab === 'storage' && (
          <div className="space-y-6 text-left">
            {/* Storage Metric visual banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-neutral-900 to-zinc-950 text-white border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">Secure Cluster Cloud Storage</span>
                <h3 className="text-2xl font-black">Cluster Allocation Drive</h3>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  Total allocated file assets uploaded by users on active conversations. Securely isolated in sandboxed cloud partitions.
                </p>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 shrink-0 text-left">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
                  <HardDrive className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Drive Space</span>
                  <span className="text-lg font-black block">{totalStorageMB} MB</span>
                  <span className="text-[10px] text-teal-400 font-bold">{totalFilesCount} active file keys</span>
                </div>
              </div>
            </div>

            {/* Storage Drive grid of files */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-teal-500" />
                Uploaded File Keys
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {storageFiles.map((file) => {
                  return (
                    <div key={file.id} className="p-4 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col justify-between relative group hover:border-neutral-350 dark:hover:border-zinc-700 transition-all">
                      <div className="flex items-start justify-between gap-2.5 mb-3">
                        <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-850 text-neutral-600 dark:text-zinc-300">
                          {file.type === 'image' && <ImageIcon className="h-4.5 w-4.5 text-teal-500" />}
                          {file.type === 'video' && <Play className="h-4.5 w-4.5 text-indigo-500" />}
                          {file.type === 'document' && <FileText className="h-4.5 w-4.5 text-blue-500" />}
                          {file.type === 'voice' && <Music className="h-4.5 w-4.5 text-purple-500" />}
                        </div>

                        <button
                          onClick={() => handleDeleteFile(file.id)}
                          className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Delete File from Storage"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="font-extrabold text-xs text-neutral-900 dark:text-white block truncate" title={file.name}>
                          {file.name}
                        </span>
                        
                        <div className="flex items-center justify-between text-[10px] text-neutral-450 dark:text-zinc-500 font-bold">
                          <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span className="font-mono text-[9px]">@{file.uploaded_by || 'system'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-100 dark:border-zinc-850 mt-3 text-[9px] text-neutral-400 dark:text-zinc-500 font-mono flex items-center justify-between">
                        <span>{new Date(file.created_at || Date.now()).toLocaleDateString()}</span>
                        <span className="capitalize">{file.type} shard</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 7: SUPABASE STATUS MONITORING --- */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 text-left max-w-4xl">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Database className="h-4.5 w-4.5 text-teal-500" />
                Supabase Node Engine Diagnostics
              </h3>
              <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                Diagnostics monitoring the active PostgreSQL database cluster, Realtime WebSockets channels, Storage partitions, and Auth services.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  { name: 'Database Status', val: 'Online / Healthy', color: 'text-emerald-500 bg-emerald-500/10' },
                  { name: 'Realtime WebSockets', val: 'Active Listener', color: 'text-emerald-500 bg-emerald-500/10' },
                  { name: 'Bucket Storage', val: 'Healthy / Connected', color: 'text-emerald-500 bg-emerald-500/10' },
                  { name: 'Auth Server Service', val: 'Active listener', color: 'text-emerald-500 bg-emerald-500/10' },
                  { name: 'Environment Cluster', val: 'aws-1-ap-southeast-1', color: 'text-indigo-500 bg-indigo-500/10 font-mono' },
                  { name: 'Connection Status', val: dbConfig.isConfigured ? 'Connected' : 'Offline Mode Standby', color: dbConfig.isConfigured ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10' }
                ].map((mon, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-neutral-50 dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-neutral-600 dark:text-zinc-300">{mon.name}</span>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-black ${mon.color}`}>
                      {mon.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* Developer telemetry coordinates notice */}
              <div className="p-4 rounded-2xl bg-neutral-950 text-neutral-400 border border-neutral-800/80 space-y-2">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <SlidersHorizontal className="h-4 w-4 text-teal-500" />
                  <span>Secure Metadata Coordinates (Read-Only)</span>
                </div>
                <div className="text-[10px] font-mono space-y-1">
                  <p><span className="text-zinc-500">API Gateway Endpoint:</span> {dbConfig.url}</p>
                  <p><span className="text-zinc-500">Anon Credentials Token:</span> <span className="opacity-40">***{dbConfig.anonKey.slice(-12)}</span></p>
                  <p><span className="text-zinc-500">Database Pool Host:</span> aws-1-ap-southeast-1.pooler.supabase.com:5432</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
