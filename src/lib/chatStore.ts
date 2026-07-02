// sugora Chat System - Phase 1 Core State Store
// Fully typed, persistent, and reactive across tabs/iframes.
import { getRealSupabaseClient } from './supabase';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  type: 'text' | 'emoji' | 'image' | 'video' | 'audio' | 'voice' | 'pdf' | 'document';
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
  edited_at?: string;
  deleted_for_everyone?: boolean;
  deleted_for_users?: string[]; // IDs of users who deleted for themselves
  parent_message_id?: string; // For replies
  attachment?: {
    id: string;
    file_name: string;
    file_size: number;
    file_type: string;
    file_url: string;
  };
  starred_by?: string[]; // User IDs who starred this message
  reactions?: Record<string, string>; // userId -> emoji
}

export interface Conversation {
  id: string;
  type: 'one-to-one' | 'group' | 'support';
  title?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  pinned_by: string[]; // List of user IDs who pinned it
  archived_by: string[]; // List of user IDs who archived it
  muted_by: string[]; // List of user IDs who muted it
  pinned_message_ids?: string[]; // List of pinned message IDs within this conversation
  blocked_by?: string[]; // List of user IDs who blocked the conversation
  reported_by?: string[]; // List of user IDs who reported the conversation
}

export interface Participant {
  conversation_id: string;
  user_id: string;
  joined_at: string;
}

export interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
}

export interface UserChatControl {
  user_id: string;
  chat_enabled: boolean;
  attachments_blocked: boolean;
  suspended: boolean;
  activity_count: number;
}

export interface ChatSettings {
  enable_chat: boolean;
  message_length: number;
  maximum_upload_size: number; // in bytes
  allowed_file_types: string; // e.g., "jpg,png,gif,pdf,doc,mp3,mp4"
  image_compression: boolean;
  video_upload_limit: number; // in MB
  voice_duration_limit: number; // in seconds
  message_edit_limit: number; // in minutes
  chat_retention_policy: string; // "forever" | "30_days" | "90_days"
}

export interface UserPrivacySettings {
  user_id: string;
  last_seen: 'everyone' | 'contacts' | 'nobody';
  online_status: 'everyone' | 'nobody';
  read_receipts: boolean;
  who_can_message: 'everyone' | 'contacts';
}

export interface ChatReport {
  id: string;
  reporter_id: string;
  conversation_id: string;
  message_id?: string;
  reason: string;
  details?: string;
  created_at: string;
  status: 'pending' | 'resolved';
}

// Default settings
const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  enable_chat: true,
  message_length: 2000,
  maximum_upload_size: 10 * 1024 * 1024, // 10MB
  allowed_file_types: 'jpg,png,gif,pdf,docx,txt,mp3,mp4',
  image_compression: true,
  video_upload_limit: 25,
  voice_duration_limit: 120,
  message_edit_limit: 15,
  chat_retention_policy: 'forever'
};

// Default profiles for resolution
const PROFILES = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'ceo_neomcq', email: 'ceo.neomcq@gmail.com', display_name: 'Neo MCQ', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', bio: 'Founder & CEO of Sugora Labs', email_verified: true },
  { id: '22222222-2222-2222-2222-222222222222', username: 'alice_support', email: 'alice.support@sugora.io', display_name: 'Alice Agent', role: 'Support', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', bio: 'Senior Cryptography Advocate', email_verified: true },
  { id: '33333333-3333-3333-3333-333333333333', username: 'bob_builder', email: 'bob@example.com', display_name: 'Bob Jenkins', role: 'User', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', bio: 'Tech enthusiast & builder', email_verified: false },
  { id: '44444444-4444-4444-4444-444444444444', username: 'malicious_node', email: 'spammer@malice.com', display_name: 'Node 404', role: 'User', status: 'Suspended', avatar: '', bio: 'Testing message rates', email_verified: true },
  
  // Custom auth accounts
  { id: 'admin-uuid-0000-0000-000000000000', username: 'admin_sugora', email: 'admin@sugora.com', display_name: 'Sugora Admin', role: 'Admin', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', bio: 'Sugora Administrator', email_verified: true },
  { id: 'support-uuid-0000-0000-000000000000', username: 'support_sugora', email: 'support@sugora.com', display_name: 'Sugora Support', role: 'Support', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', bio: 'Sugora Support Advocate', email_verified: true },
  { id: 'user1-uuid-0000-0000-000000000000', username: 'user1_sugora', email: 'user1@sugora.com', display_name: 'Sugora User', role: 'User', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', bio: 'Sugora Alpha Tester', email_verified: true }
];

// Seed initial conversations & messages to have high fidelity active chats on first run
const SEED_CONVERSATIONS: Conversation[] = [
  { id: 'conv-1', type: 'one-to-one', created_at: '2026-06-30T10:00:00Z', updated_at: '2026-07-01T23:45:00Z', pinned_by: [], archived_by: [], muted_by: [] },
  { id: 'conv-2', type: 'one-to-one', created_at: '2026-07-01T12:00:00Z', updated_at: '2026-07-02T00:05:00Z', pinned_by: [], archived_by: [], muted_by: [] },
  { id: 'conv-support-1', type: 'support', created_at: '2026-07-01T15:00:00Z', updated_at: '2026-07-01T21:15:00Z', pinned_by: [], archived_by: [], muted_by: [] }
];

const SEED_PARTICIPANTS: Participant[] = [
  // Conversation 1: CEO and User1
  { conversation_id: 'conv-1', user_id: '11111111-1111-1111-1111-111111111111', joined_at: '2026-06-30T10:00:00Z' },
  { conversation_id: 'conv-1', user_id: 'user1-uuid-0000-0000-000000000000', joined_at: '2026-06-30T10:00:00Z' },

  // Conversation 2: Bob Builder and Alice Support
  { conversation_id: 'conv-2', user_id: '33333333-3333-3333-3333-333333333333', joined_at: '2026-07-01T12:00:00Z' },
  { conversation_id: 'conv-2', user_id: '22222222-2222-2222-2222-222222222222', joined_at: '2026-07-01T12:00:00Z' },

  // Support Conversation 1: Bob Builder and Support Sugora
  { conversation_id: 'conv-support-1', user_id: '33333333-3333-3333-3333-333333333333', joined_at: '2026-07-01T15:00:00Z' },
  { conversation_id: 'conv-support-1', user_id: 'support-uuid-0000-0000-000000000000', joined_at: '2026-07-01T15:00:00Z' }
];

const SEED_MESSAGES: ChatMessage[] = [
  // conv-1: CEO and User1
  { id: 'msg-1', conversation_id: 'conv-1', sender_id: 'user1-uuid-0000-0000-000000000000', text: 'Hey Neo! The Sugora Alpha platform is incredible. The zero-knowledge identity handshake is so fast.', type: 'text', status: 'read', created_at: '2026-07-01T23:30:00Z' },
  { id: 'msg-2', conversation_id: 'conv-1', sender_id: '11111111-1111-1111-1111-111111111111', text: 'Appreciate it! We worked hard on securing the shards routing. Let me send you the system diagram.', type: 'text', status: 'read', created_at: '2026-07-01T23:35:00Z' },
  { 
    id: 'msg-3', 
    conversation_id: 'conv-1', 
    sender_id: '11111111-1111-1111-1111-111111111111', 
    text: 'Sugora Secure Architecture Diagram', 
    type: 'image', 
    status: 'read', 
    created_at: '2026-07-01T23:37:00Z',
    attachment: {
      id: 'att-1',
      file_name: 'sugora_architecture_v1.png',
      file_size: 1540120, // ~1.5 MB
      file_type: 'image/png',
      file_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'
    }
  },
  { id: 'msg-4', conversation_id: 'conv-1', sender_id: 'user1-uuid-0000-0000-000000000000', text: 'Wow, that explains the node isolation perfectly. This is true Web3 privacy.', type: 'text', status: 'read', created_at: '2026-07-01T23:45:00Z' },

  // conv-2: Bob and Alice
  { id: 'msg-5', conversation_id: 'conv-2', sender_id: '33333333-3333-3333-3333-333333333333', text: 'Hi Alice, do we have any documentation regarding the maximum network packet thresholds?', type: 'text', status: 'read', created_at: '2026-07-02T00:01:00Z' },
  { id: 'msg-6', conversation_id: 'conv-2', sender_id: '22222222-2222-2222-2222-222222222222', text: 'Hey Bob! Yes, let me dig out the PDF specification file for you.', type: 'text', status: 'read', created_at: '2026-07-02T00:03:00Z' },
  { 
    id: 'msg-7', 
    conversation_id: 'conv-2', 
    sender_id: '22222222-2222-2222-2222-222222222222', 
    text: 'Sugora Node Spec Sheet', 
    type: 'pdf', 
    status: 'delivered', 
    created_at: '2026-07-02T00:05:00Z',
    attachment: {
      id: 'att-2',
      file_name: 'sugora_node_specs.pdf',
      file_size: 4501200, // ~4.3 MB
      file_type: 'application/pdf',
      file_url: '#'
    }
  },

  // conv-support-1: Bob and Support Sugora
  { id: 'msg-s1', conversation_id: 'conv-support-1', sender_id: '33333333-3333-3333-3333-333333333333', text: 'Hello! I am having issues uploading a demo video in the workspace.', type: 'text', status: 'read', created_at: '2026-07-01T21:10:00Z' },
  { id: 'msg-s2', conversation_id: 'conv-support-1', sender_id: 'support-uuid-0000-0000-000000000000', text: 'Hi Bob! Currently, the upload parameter is restricted to 10MB. Let me query if the admin can update this limit.', type: 'text', status: 'read', created_at: '2026-07-01T21:15:00Z' }
];

const SEED_PRESENCE: UserPresence[] = [
  { user_id: '11111111-1111-1111-1111-111111111111', status: 'online', last_seen: new Date().toISOString() },
  { user_id: '22222222-2222-2222-2222-222222222222', status: 'online', last_seen: new Date().toISOString() },
  { user_id: '33333333-3333-3333-3333-333333333333', status: 'away', last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  { user_id: '44444444-4444-4444-4444-444444444444', status: 'offline', last_seen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { user_id: 'admin-uuid-0000-0000-000000000000', status: 'online', last_seen: new Date().toISOString() },
  { user_id: 'support-uuid-0000-0000-000000000000', status: 'online', last_seen: new Date().toISOString() },
  { user_id: 'user1-uuid-0000-0000-000000000000', status: 'online', last_seen: new Date().toISOString() }
];

const SEED_USER_CONTROLS: UserChatControl[] = PROFILES.map(u => ({
  user_id: u.id,
  chat_enabled: u.role !== 'User' || u.status === 'Active',
  attachments_blocked: false,
  suspended: u.status === 'Suspended',
  activity_count: u.id === '11111111-1111-1111-1111-111111111111' ? 12 : u.id === '33333333-3333-3333-3333-333333333333' ? 8 : 4
}));

class ChatStore {
  private conversations: Conversation[] = [];
  private participants: Participant[] = [];
  private messages: ChatMessage[] = [];
  private presence: UserPresence[] = [];
  private userControls: UserChatControl[] = [];
  private settings: ChatSettings = DEFAULT_CHAT_SETTINGS;
  private privacySettings: UserPrivacySettings[] = [];
  private reports: ChatReport[] = [];
  private typingStatus: Record<string, Record<string, number>> = {}; // convId -> { userId -> timestamp }
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();

    // Listen for storage events to sync across tabs/iframes!
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('sugora_chat_')) {
          this.loadFromStorage();
          this.notifyListeners();
        }
      });

      // Clear expired typing indicators periodically
      setInterval(() => {
        let changed = false;
        const now = Date.now();
        Object.keys(this.typingStatus).forEach(convId => {
          const users = this.typingStatus[convId];
          Object.keys(users).forEach(userId => {
            if (now - users[userId] > 4000) {
              delete users[userId];
              changed = true;
            }
          });
          if (Object.keys(users).length === 0) {
            delete this.typingStatus[convId];
            changed = true;
          }
        });
        if (changed) {
          this.notifyListeners();
        }
      }, 2000);
    }
  }

  private loadFromStorage() {
    try {
      this.conversations = this.getStoredItem('sugora_chat_conversations', SEED_CONVERSATIONS);
      this.participants = this.getStoredItem('sugora_chat_participants', SEED_PARTICIPANTS);
      this.messages = this.getStoredItem('sugora_chat_messages', SEED_MESSAGES);
      this.presence = this.getStoredItem('sugora_chat_presence', SEED_PRESENCE);
      this.userControls = this.getStoredItem('sugora_chat_user_controls', SEED_USER_CONTROLS);
      this.settings = this.getStoredItem('sugora_chat_settings', DEFAULT_CHAT_SETTINGS);
      this.privacySettings = this.getStoredItem('sugora_chat_privacy_settings', []);
      this.reports = this.getStoredItem('sugora_chat_reports', []);
    } catch (e) {
      console.error('Failed to load chat data from localStorage:', e);
    }
  }

  private getStoredItem<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } catch (_) {}
    return defaultValue;
  }

  private saveToStorage(keys: ('conversations' | 'participants' | 'messages' | 'presence' | 'userControls' | 'settings' | 'privacySettings' | 'reports')[]) {
    try {
      if (keys.includes('conversations')) localStorage.setItem('sugora_chat_conversations', JSON.stringify(this.conversations));
      if (keys.includes('participants')) localStorage.setItem('sugora_chat_participants', JSON.stringify(this.participants));
      if (keys.includes('messages')) localStorage.setItem('sugora_chat_messages', JSON.stringify(this.messages));
      if (keys.includes('presence')) localStorage.setItem('sugora_chat_presence', JSON.stringify(this.presence));
      if (keys.includes('userControls')) localStorage.setItem('sugora_chat_user_controls', JSON.stringify(this.userControls));
      if (keys.includes('settings')) localStorage.setItem('sugora_chat_settings', JSON.stringify(this.settings));
      if (keys.includes('privacySettings')) localStorage.setItem('sugora_chat_privacy_settings', JSON.stringify(this.privacySettings));
      if (keys.includes('reports')) localStorage.setItem('sugora_chat_reports', JSON.stringify(this.reports));
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(); } catch (_) {}
    });
  }

  private isSyncing = false;
  private currentUserId: string | null = null;
  private supabaseSubscription: any = null;

  public async syncWithSupabase(userId: string) {
    if (this.isSyncing && this.currentUserId === userId) return;
    this.currentUserId = userId;
    this.isSyncing = true;
    console.log('Syncing ChatStore with Supabase for user:', userId);

    const client = getRealSupabaseClient();
    if (!client) {
      this.isSyncing = false;
      return;
    }

    try {
      // 1. Fetch dynamic profiles (users)
      const { data: profiles, error: pErr } = await client.from('profiles').select('*');
      if (profiles && !pErr) {
        PROFILES.splice(0, PROFILES.length, ...profiles);
      }

      // 2. Fetch all conversations
      const { data: convs, error: cErr } = await client.from('conversations').select('*');
      if (convs && !cErr) {
        this.conversations = convs;
      }

      // 3. Fetch participants
      const { data: parts, error: partErr } = await client.from('participants').select('*');
      if (parts && !partErr) {
        this.participants = parts;
      }

      // 4. Fetch messages
      const { data: msgs, error: mErr } = await client.from('messages').select('*');
      if (msgs && !mErr) {
        this.messages = msgs;
      }

      // Save to local storage for offline resiliency
      this.saveToStorage(['conversations', 'participants', 'messages']);
      this.notifyListeners();

      // 5. Setup dynamic Real-Time Subscription
      if (this.supabaseSubscription) {
        client.removeChannel(this.supabaseSubscription);
      }

      this.supabaseSubscription = client
        .channel('chat-store-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload: any) => {
          console.log('Real-time message change payload:', payload);
          if (payload.eventType === 'INSERT') {
            const exists = this.messages.some((m: any) => m.id === payload.new.id);
            if (!exists) {
              this.messages.push(payload.new);
              this.saveToStorage(['messages']);
              this.notifyListeners();
            }
          } else if (payload.eventType === 'UPDATE') {
            const idx = this.messages.findIndex((m: any) => m.id === payload.new.id);
            if (idx !== -1) {
              this.messages[idx] = payload.new;
              this.saveToStorage(['messages']);
              this.notifyListeners();
            }
          } else if (payload.eventType === 'DELETE') {
            this.messages = this.messages.filter((m: any) => m.id !== payload.old.id);
            this.saveToStorage(['messages']);
            this.notifyListeners();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload: any) => {
          console.log('Real-time conversation change payload:', payload);
          if (payload.eventType === 'INSERT') {
            const exists = this.conversations.some((c: any) => c.id === payload.new.id);
            if (!exists) {
              this.conversations.push(payload.new);
              this.saveToStorage(['conversations']);
              this.notifyListeners();
            }
          } else if (payload.eventType === 'UPDATE') {
            const idx = this.conversations.findIndex((c: any) => c.id === payload.new.id);
            if (idx !== -1) {
              this.conversations[idx] = payload.new;
              this.saveToStorage(['conversations']);
              this.notifyListeners();
            }
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, (payload: any) => {
          console.log('Real-time participant change payload:', payload);
          if (payload.eventType === 'INSERT') {
            const exists = this.participants.some((p: any) => p.conversation_id === payload.new.conversation_id && p.user_id === payload.new.user_id);
            if (!exists) {
              this.participants.push(payload.new);
              this.saveToStorage(['participants']);
              this.notifyListeners();
            }
          }
        })
        .subscribe();

    } catch (e) {
      console.error('Error in syncWithSupabase:', e);
    } finally {
      this.isSyncing = false;
    }
  }

  // --- API Methods ---

  public getSettings(): ChatSettings {
    return this.settings;
  }

  public updateSettings(newSettings: Partial<ChatSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveToStorage(['settings']);
    this.notifyListeners();
  }

  public getConversationsForUser(userId: string): (Conversation & { 
    unreadCount: number; 
    lastMessage?: ChatMessage; 
    recipient?: typeof PROFILES[0];
  })[] {
    // Get all conversations where user is a participant
    const userConvs = this.participants
      .filter(p => p.user_id === userId)
      .map(p => this.conversations.find(c => c.id === p.conversation_id))
      .filter((c): c is Conversation => !!c);

    return userConvs.map(conv => {
      // Find other participant
      const parts = this.participants.filter(p => p.conversation_id === conv.id);
      const recipientPart = parts.find(p => p.user_id !== userId);
      const recipient = PROFILES.find(p => p.id === (recipientPart?.user_id || ''));

      // Messages in this conversation
      const convMsgs = this.messages.filter(m => m.conversation_id === conv.id && (!m.deleted_for_users || !m.deleted_for_users.includes(userId)));
      const lastMessage = convMsgs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      // Unread messages count (received messages that are NOT read, and not sent by me)
      const unreadCount = convMsgs.filter(m => m.sender_id !== userId && m.status !== 'read').length;

      return {
        ...conv,
        unreadCount,
        lastMessage,
        recipient
      };
    });
  }

  public getMessages(conversationId: string, userId: string): ChatMessage[] {
    return this.messages
      .filter(m => m.conversation_id === conversationId && (!m.deleted_for_users || !m.deleted_for_users.includes(userId)))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public startConversation(creatorId: string, otherId: string, type: 'one-to-one' | 'support' = 'one-to-one'): Conversation {
    // Check if conversation already exists
    const existing = this.conversations.find(c => {
      if (c.type !== type) return false;
      const parts = this.participants.filter(p => p.conversation_id === c.id);
      const userIds = parts.map(p => p.user_id);
      return userIds.includes(creatorId) && userIds.includes(otherId) && userIds.length === 2;
    });

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${Math.random().toString(36).substring(2, 11)}`,
      type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      pinned_by: [],
      archived_by: [],
      muted_by: []
    };

    const part1: Participant = { conversation_id: newConv.id, user_id: creatorId, joined_at: new Date().toISOString() };
    const part2: Participant = { conversation_id: newConv.id, user_id: otherId, joined_at: new Date().toISOString() };

    this.conversations.push(newConv);
    this.participants.push(part1, part2);

    this.saveToStorage(['conversations', 'participants']);
    this.notifyListeners();

    // Persist to Supabase asynchronously
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations').insert({
        id: newConv.id,
        type: newConv.type,
        created_at: newConv.created_at,
        updated_at: newConv.updated_at,
        pinned_by: newConv.pinned_by,
        archived_by: newConv.archived_by,
        muted_by: newConv.muted_by
      }).then(({ error }) => {
        if (error) console.error('Supabase conv insert error:', error);
      });

      client.from('participants').insert([
        { conversation_id: newConv.id, user_id: creatorId, joined_at: part1.joined_at },
        { conversation_id: newConv.id, user_id: otherId, joined_at: part2.joined_at }
      ]).then(({ error }) => {
        if (error) console.error('Supabase participants insert error:', error);
      });
    }

    return newConv;
  }

  public sendMessage(args: {
    conversation_id: string;
    sender_id: string;
    text: string;
    type?: ChatMessage['type'];
    parent_message_id?: string;
    attachment?: ChatMessage['attachment'];
  }): ChatMessage {
    // Check if user is suspended/disabled in chat controls
    const control = this.getUserControl(args.sender_id);
    if (!this.settings.enable_chat) {
      throw new Error('Messaging is currently disabled by administrator.');
    }
    if (control.suspended || !control.chat_enabled) {
      throw new Error('Your messaging privileges have been suspended.');
    }
    if (args.attachment && control.attachments_blocked) {
      throw new Error('You are blocked from sending file attachments.');
    }

    const newMessage: ChatMessage = {
      id: `msg-${Math.random().toString(36).substring(2, 11)}`,
      conversation_id: args.conversation_id,
      sender_id: args.sender_id,
      text: args.text.slice(0, this.settings.message_length),
      type: args.type || 'text',
      status: 'sent',
      created_at: new Date().toISOString(),
      parent_message_id: args.parent_message_id,
      attachment: args.attachment
    };

    this.messages.push(newMessage);

    // Update conversation timestamp
    const convIdx = this.conversations.findIndex(c => c.id === args.conversation_id);
    if (convIdx !== -1) {
      this.conversations[convIdx].updated_at = new Date().toISOString();
    }

    // Update activity counts for user
    const cIdx = this.userControls.findIndex(u => u.user_id === args.sender_id);
    if (cIdx !== -1) {
      this.userControls[cIdx].activity_count += 1;
    }

    this.saveToStorage(['messages', 'conversations', 'userControls']);
    this.notifyListeners();

    // Persist to Supabase asynchronously
    const client = getRealSupabaseClient();
    if (client) {
      client.from('messages').insert({
        id: newMessage.id,
        conversation_id: newMessage.conversation_id,
        sender_id: newMessage.sender_id,
        text: newMessage.text,
        type: newMessage.type,
        status: newMessage.status,
        created_at: newMessage.created_at,
        parent_message_id: newMessage.parent_message_id || null,
        attachment: newMessage.attachment || null,
        starred_by: newMessage.starred_by || [],
        reactions: newMessage.reactions || {}
      }).then(({ error }) => {
        if (error) console.error('Supabase message insert error:', error);
      });

      client.from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', args.conversation_id)
        .then(({ error }) => {
          if (error) console.error('Supabase conv update error:', error);
        });
    }

    // Simulate auto-delivered state
    setTimeout(() => {
      const idx = this.messages.findIndex(m => m.id === newMessage.id);
      if (idx !== -1 && this.messages[idx].status === 'sent') {
        this.messages[idx].status = 'delivered';
        this.saveToStorage(['messages']);
        this.notifyListeners();

        // Update delivered status in Supabase
        if (client) {
          client.from('messages')
            .update({ status: 'delivered' })
            .eq('id', newMessage.id)
            .then(({ error }) => {
              if (error) console.error('Supabase status delivery update error:', error);
            });
        }
      }
    }, 1000);

    return newMessage;
  }

  public editMessage(messageId: string, userId: string, newText: string): boolean {
    const msgIdx = this.messages.findIndex(m => m.id === messageId);
    if (msgIdx === -1) return false;
    const msg = this.messages[msgIdx];

    if (msg.sender_id !== userId) return false;

    // Time limit check
    const elapsedMinutes = (Date.now() - new Date(msg.created_at).getTime()) / (1000 * 60);
    if (elapsedMinutes > this.settings.message_edit_limit) {
      throw new Error(`You can only edit messages within ${this.settings.message_edit_limit} minutes.`);
    }

    const editedText = newText.slice(0, this.settings.message_length);
    const editTime = new Date().toISOString();
    this.messages[msgIdx].text = editedText;
    this.messages[msgIdx].edited_at = editTime;

    this.saveToStorage(['messages']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('messages')
        .update({
          text: editedText,
          edited_at: editTime
        })
        .eq('id', messageId)
        .eq('sender_id', userId)
        .then(({ error }) => {
          if (error) console.error('Supabase message edit error:', error);
        });
    }
    return true;
  }

  public deleteMessage(messageId: string, userId: string, type: 'me' | 'everyone'): boolean {
    const msgIdx = this.messages.findIndex(m => m.id === messageId);
    if (msgIdx === -1) return false;
    const msg = this.messages[msgIdx];

    const client = getRealSupabaseClient();
    if (type === 'me') {
      const deletedFor = msg.deleted_for_users || [];
      if (!deletedFor.includes(userId)) {
        const updatedDeletedFor = [...deletedFor, userId];
        this.messages[msgIdx].deleted_for_users = updatedDeletedFor;
        this.saveToStorage(['messages']);
        this.notifyListeners();

        // Update in Supabase
        if (client) {
          client.from('messages')
            .update({ deleted_for_users: updatedDeletedFor })
            .eq('id', messageId)
            .then(({ error }) => {
              if (error) console.error('Supabase delete message for me error:', error);
            });
        }
      }
    } else {
      // Delete for Everyone (only sender can do this)
      if (msg.sender_id !== userId) return false;
      this.messages[msgIdx].deleted_for_everyone = true;
      this.messages[msgIdx].text = 'This message was deleted';
      this.saveToStorage(['messages']);
      this.notifyListeners();

      // Update in Supabase
      if (client) {
        client.from('messages')
          .update({
            deleted_for_everyone: true,
            text: 'This message was deleted'
          })
          .eq('id', messageId)
          .eq('sender_id', userId)
          .then(({ error }) => {
            if (error) console.error('Supabase delete message for everyone error:', error);
          });
      }
    }

    return true;
  }

  public markAsRead(conversationId: string, userId: string) {
    let changed = false;
    this.messages = this.messages.map(m => {
      if (m.conversation_id === conversationId && m.sender_id !== userId && m.status !== 'read') {
        changed = true;
        return { ...m, status: 'read' };
      }
      return m;
    });

    if (changed) {
      this.saveToStorage(['messages']);
      this.notifyListeners();

      // Update in Supabase
      const client = getRealSupabaseClient();
      if (client) {
        client.from('messages')
          .update({ status: 'read' })
          .eq('conversation_id', conversationId)
          .neq('sender_id', userId)
          .neq('status', 'read')
          .then(({ error }) => {
            if (error) console.error('Supabase mark messages as read error:', error);
          });
      }
    }
  }

  // --- Pins, Archive, Mute ---
  public togglePin(conversationId: string, userId: string) {
    const idx = this.conversations.findIndex(c => c.id === conversationId);
    if (idx === -1) return;

    const pinnedBy = this.conversations[idx].pinned_by || [];
    let updatedPinnedBy: string[];
    if (pinnedBy.includes(userId)) {
      updatedPinnedBy = pinnedBy.filter(id => id !== userId);
    } else {
      updatedPinnedBy = [...pinnedBy, userId];
    }
    this.conversations[idx].pinned_by = updatedPinnedBy;
    this.saveToStorage(['conversations']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations')
        .update({ pinned_by: updatedPinnedBy })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle pin error:', error);
        });
    }
  }

  public toggleArchive(conversationId: string, userId: string) {
    const idx = this.conversations.findIndex(c => c.id === conversationId);
    if (idx === -1) return;

    const archivedBy = this.conversations[idx].archived_by || [];
    let updatedArchivedBy: string[];
    if (archivedBy.includes(userId)) {
      updatedArchivedBy = archivedBy.filter(id => id !== userId);
    } else {
      updatedArchivedBy = [...archivedBy, userId];
    }
    this.conversations[idx].archived_by = updatedArchivedBy;
    this.saveToStorage(['conversations']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations')
        .update({ archived_by: updatedArchivedBy })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle archive error:', error);
        });
    }
  }

  public toggleMute(conversationId: string, userId: string) {
    const idx = this.conversations.findIndex(c => c.id === conversationId);
    if (idx === -1) return;

    const mutedBy = this.conversations[idx].muted_by || [];
    let updatedMutedBy: string[];
    if (mutedBy.includes(userId)) {
      updatedMutedBy = mutedBy.filter(id => id !== userId);
    } else {
      updatedMutedBy = [...mutedBy, userId];
    }
    this.conversations[idx].muted_by = updatedMutedBy;
    this.saveToStorage(['conversations']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations')
        .update({ muted_by: updatedMutedBy })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle mute error:', error);
        });
    }
  }

  public deleteConversation(conversationId: string, userId: string) {
    // Delete for self by marking all current messages as deleted for this user
    this.messages = this.messages.map(m => {
      if (m.conversation_id === conversationId) {
        const deletedFor = m.deleted_for_users || [];
        if (!deletedFor.includes(userId)) {
          return { ...m, deleted_for_users: [...deletedFor, userId] };
        }
      }
      return m;
    });
    this.saveToStorage(['messages']);
    this.notifyListeners();
  }

  // --- Typing indicator ---
  public setTyping(conversationId: string, userId: string, isTyping: boolean) {
    if (!this.typingStatus[conversationId]) {
      this.typingStatus[conversationId] = {};
    }

    if (isTyping) {
      this.typingStatus[conversationId][userId] = Date.now();
    } else {
      delete this.typingStatus[conversationId][userId];
      if (Object.keys(this.typingStatus[conversationId]).length === 0) {
        delete this.typingStatus[conversationId];
      }
    }
    this.notifyListeners();
  }

  public getTypingUsers(conversationId: string, currentUserId: string): string[] {
    const users = this.typingStatus[conversationId] || {};
    const now = Date.now();
    return Object.keys(users)
      .filter(uid => uid !== currentUserId && now - users[uid] < 4000)
      .map(uid => PROFILES.find(p => p.id === uid)?.display_name || 'Someone');
  }

  // --- User presence ---
  public getPresence(userId: string): UserPresence {
    return this.presence.find(p => p.user_id === userId) || { user_id: userId, status: 'offline', last_seen: new Date(Date.now() - 600000).toISOString() };
  }

  public setPresence(userId: string, status: 'online' | 'offline' | 'away') {
    const idx = this.presence.findIndex(p => p.user_id === userId);
    if (idx !== -1) {
      this.presence[idx].status = status;
      this.presence[idx].last_seen = new Date().toISOString();
    } else {
      this.presence.push({ user_id: userId, status, last_seen: new Date().toISOString() });
    }
    this.saveToStorage(['presence']);
    this.notifyListeners();
  }

  public getAllPresence(): UserPresence[] {
    return this.presence;
  }

  // --- User controls (Admin operations) ---
  public getUserControl(userId: string): UserChatControl {
    return this.userControls.find(u => u.user_id === userId) || {
      user_id: userId,
      chat_enabled: true,
      attachments_blocked: false,
      suspended: false,
      activity_count: 0
    };
  }

  public updateUserControl(userId: string, updates: Partial<UserChatControl>) {
    const idx = this.userControls.findIndex(u => u.user_id === userId);
    if (idx !== -1) {
      this.userControls[idx] = { ...this.userControls[idx], ...updates };
    } else {
      this.userControls.push({
        user_id: userId,
        chat_enabled: true,
        attachments_blocked: false,
        suspended: false,
        activity_count: 0,
        ...updates
      });
    }
    this.saveToStorage(['userControls']);
    this.notifyListeners();
  }

  public getAllUserControls(): UserChatControl[] {
    return this.userControls;
  }

  // --- Dashboard Statistics ---
  public getStats() {
    const totalConversations = this.conversations.length;
    const totalMessages = this.messages.length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const messagesSentToday = this.messages.filter(m => m.created_at.startsWith(todayStr)).length;
    
    const activeUsersChatting = new Set(this.messages.map(m => m.sender_id)).size;
    const onlineUsers = this.presence.filter(p => p.status === 'online').length;
    
    // Calculate storage usage
    const attachments = this.messages.filter(m => !!m.attachment).map(m => m.attachment!);
    const totalStorageBytes = attachments.reduce((sum, att) => sum + att.file_size, 0);
    const mediaCount = attachments.length;

    const imageStorage = attachments.filter(a => a.file_type.startsWith('image')).reduce((sum, a) => sum + a.file_size, 0);
    const videoStorage = attachments.filter(a => a.file_type.startsWith('video')).reduce((sum, a) => sum + a.file_size, 0);
    const documentStorage = attachments.filter(a => a.file_type.includes('pdf') || a.file_type.includes('doc') || a.file_type.includes('text')).reduce((sum, a) => sum + a.file_size, 0);
    const audioStorage = attachments.filter(a => a.file_type.startsWith('audio') || a.file_type.includes('voice')).reduce((sum, a) => sum + a.file_size, 0);

    return {
      totalConversations,
      totalMessages,
      messagesSentToday,
      activeUsersChatting,
      onlineUsers,
      averageResponseTime: '2.5 min', // simulated realistic response time
      storageUsageMB: (totalStorageBytes / (1024 * 1024)).toFixed(2),
      mediaCount,
      breakdown: {
        images: (imageStorage / (1024 * 1024)).toFixed(2),
        videos: (videoStorage / (1024 * 1024)).toFixed(2),
        documents: (documentStorage / (1024 * 1024)).toFixed(2),
        audio: (audioStorage / (1024 * 1024)).toFixed(2),
      }
    };
  }

  // --- Advanced Message Actions (Star, Pin, Reactions) ---
  public toggleStarMessage(messageId: string, userId: string) {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return;
    if (!msg.starred_by) msg.starred_by = [];
    const idx = msg.starred_by.indexOf(userId);
    if (idx === -1) {
      msg.starred_by.push(userId);
    } else {
      msg.starred_by.splice(idx, 1);
    }
    this.saveToStorage(['messages']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('messages')
        .update({ starred_by: msg.starred_by })
        .eq('id', messageId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle star error:', error);
        });
    }
  }

  public getStarredMessages(userId: string): ChatMessage[] {
    return this.messages.filter(m => m.starred_by?.includes(userId));
  }

  public togglePinMessage(conversationId: string, messageId: string) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return;
    if (!conv.pinned_message_ids) conv.pinned_message_ids = [];
    const idx = conv.pinned_message_ids.indexOf(messageId);
    if (idx === -1) {
      conv.pinned_message_ids.push(messageId);
    } else {
      conv.pinned_message_ids.splice(idx, 1);
    }
    this.saveToStorage(['conversations']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations')
        .update({ pinned_message_ids: conv.pinned_message_ids })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle pin message error:', error);
        });
    }
  }

  public getPinnedMessages(conversationId: string): ChatMessage[] {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv || !conv.pinned_message_ids) return [];
    return this.messages.filter(m => conv.pinned_message_ids?.includes(m.id));
  }

  public addReaction(messageId: string, userId: string, emoji: string) {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return;
    if (!msg.reactions) msg.reactions = {};
    msg.reactions[userId] = emoji;
    this.saveToStorage(['messages']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('messages')
        .update({ reactions: msg.reactions })
        .eq('id', messageId)
        .then(({ error }) => {
          if (error) console.error('Supabase add reaction error:', error);
        });
    }
  }

  public removeReaction(messageId: string, userId: string) {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg || !msg.reactions) return;
    delete msg.reactions[userId];
    this.saveToStorage(['messages']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('messages')
        .update({ reactions: msg.reactions })
        .eq('id', messageId)
        .then(({ error }) => {
          if (error) console.error('Supabase remove reaction error:', error);
        });
    }
  }

  // --- Moderation & Privacy Settings ---
  public toggleBlockConversation(conversationId: string, userId: string) {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return;
    if (!conv.blocked_by) conv.blocked_by = [];
    const idx = conv.blocked_by.indexOf(userId);
    if (idx === -1) {
      conv.blocked_by.push(userId);
    } else {
      conv.blocked_by.splice(idx, 1);
    }
    this.saveToStorage(['conversations']);
    this.notifyListeners();

    // Update in Supabase
    const client = getRealSupabaseClient();
    if (client) {
      client.from('conversations')
        .update({ blocked_by: conv.blocked_by })
        .eq('id', conversationId)
        .then(({ error }) => {
          if (error) console.error('Supabase toggle block error:', error);
        });
    }
  }

  public reportConversation(reporterId: string, conversationId: string, reason: string, details?: string) {
    const newReport: ChatReport = {
      id: `rep-${Math.random().toString(36).substring(2, 9)}`,
      reporter_id: reporterId,
      conversation_id: conversationId,
      reason,
      details,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    this.reports.push(newReport);
    this.saveToStorage(['reports']);

    // Mark conversation as reported too
    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      if (!conv.reported_by) conv.reported_by = [];
      if (!conv.reported_by.includes(reporterId)) {
        conv.reported_by.push(reporterId);
        this.saveToStorage(['conversations']);
      }
    }

    this.notifyListeners();
  }

  public getReports(): ChatReport[] {
    return this.reports;
  }

  public getPrivacySettings(userId: string): UserPrivacySettings {
    const existing = this.privacySettings.find(ps => ps.user_id === userId);
    if (existing) return existing;

    const newSettings: UserPrivacySettings = {
      user_id: userId,
      last_seen: 'everyone',
      online_status: 'everyone',
      read_receipts: true,
      who_can_message: 'everyone'
    };
    this.privacySettings.push(newSettings);
    this.saveToStorage(['privacySettings']);
    return newSettings;
  }

  public updatePrivacySettings(userId: string, updated: Partial<UserPrivacySettings>) {
    const existingIdx = this.privacySettings.findIndex(ps => ps.user_id === userId);
    if (existingIdx !== -1) {
      this.privacySettings[existingIdx] = {
        ...this.privacySettings[existingIdx],
        ...updated
      };
    } else {
      this.privacySettings.push({
        user_id: userId,
        last_seen: 'everyone',
        online_status: 'everyone',
        read_receipts: true,
        who_can_message: 'everyone',
        ...updated
      });
    }
    this.saveToStorage(['privacySettings']);
    this.notifyListeners();
  }

  public getProfiles() {
    return PROFILES;
  }
}

export const chatStore = new ChatStore();
