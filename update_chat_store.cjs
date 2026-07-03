const fs = require('fs');

let content = fs.readFileSync('src/lib/chatStore.ts', 'utf8');

const importStatement = `import { getRealSupabaseClient } from './supabase';\nimport { get, set } from 'idb-keyval';\n`;

content = content.replace(`import { getRealSupabaseClient } from './supabase';`, importStatement);

const oldLoad = `  private loadFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      localStorage.setItem(key, JSON.stringify(defaultValue));
    } catch (_) {}
    return defaultValue;
  }`;

const oldSave = `  private saveToStorage(keys: ('conversations' | 'participants' | 'messages' | 'presence' | 'userControls' | 'settings' | 'privacySettings' | 'reports')[]) {
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
  }`;

const newStorage = `
  public async loadFromIDB() {
    try {
      const convs = await get('sugora_chat_conversations');
      if (convs) this.conversations = convs;
      
      const parts = await get('sugora_chat_participants');
      if (parts) this.participants = parts;
      
      const msgs = await get('sugora_chat_messages');
      if (msgs) this.messages = msgs;
      
      const pres = await get('sugora_chat_presence');
      if (pres) this.presence = pres;
      
      const ucs = await get('sugora_chat_user_controls');
      if (ucs) this.userControls = ucs;
      
      const sets = await get('sugora_chat_settings');
      if (sets) this.settings = sets;
      
      const psets = await get('sugora_chat_privacy_settings');
      if (psets) this.privacySettings = psets;
      
      const reps = await get('sugora_chat_reports');
      if (reps) this.reports = reps;
      
      this.isLoaded = true;
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to load from IDB:', e);
    }
  }

  private loadFromStorage<T>(key: string, defaultValue: T): T {
    // We still keep memory sync fallback just in case
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      // localStorage.setItem(key, JSON.stringify(defaultValue));
    } catch (_) {}
    return defaultValue;
  }

  private saveToStorage(keys: ('conversations' | 'participants' | 'messages' | 'presence' | 'userControls' | 'settings' | 'privacySettings' | 'reports')[]) {
    try {
      if (keys.includes('conversations')) {
        localStorage.setItem('sugora_chat_conversations', JSON.stringify(this.conversations));
        set('sugora_chat_conversations', this.conversations);
      }
      if (keys.includes('participants')) {
        localStorage.setItem('sugora_chat_participants', JSON.stringify(this.participants));
        set('sugora_chat_participants', this.participants);
      }
      if (keys.includes('messages')) {
        localStorage.setItem('sugora_chat_messages', JSON.stringify(this.messages));
        set('sugora_chat_messages', this.messages);
      }
      if (keys.includes('presence')) {
        localStorage.setItem('sugora_chat_presence', JSON.stringify(this.presence));
        set('sugora_chat_presence', this.presence);
      }
      if (keys.includes('userControls')) {
        localStorage.setItem('sugora_chat_user_controls', JSON.stringify(this.userControls));
        set('sugora_chat_user_controls', this.userControls);
      }
      if (keys.includes('settings')) {
        localStorage.setItem('sugora_chat_settings', JSON.stringify(this.settings));
        set('sugora_chat_settings', this.settings);
      }
      if (keys.includes('privacySettings')) {
        localStorage.setItem('sugora_chat_privacy_settings', JSON.stringify(this.privacySettings));
        set('sugora_chat_privacy_settings', this.privacySettings);
      }
      if (keys.includes('reports')) {
        localStorage.setItem('sugora_chat_reports', JSON.stringify(this.reports));
        set('sugora_chat_reports', this.reports);
      }
    } catch (e) {
      console.error('Failed to save to storage:', e);
    }
  }
`;

content = content.replace(oldLoad + '\n' + oldSave, newStorage);

if (content.includes('loadFromIDB')) {
    fs.writeFileSync('src/lib/chatStore.ts', content);
    console.log("ChatStore updated with IDB");
} else {
    console.log("Failed to inject");
}
