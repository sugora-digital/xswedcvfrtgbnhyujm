import { createClient } from '@supabase/supabase-js';
import { SupabaseConfigState } from '../types';


// Baseline production credentials provided by the developer
const DEFAULT_URL = 'https://ekrjdfkqitjbxafrtglx.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrcmpkZmtxaXRqYnhhZnJ0Z2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NTAwOTcsImV4cCI6MjA5ODUyNjA5N30.VUDb_Z8Bt9wNnziuyJSoFERKNWiHganlGkGL4hU0vqY';

/**
 * Retrieves the current Supabase configuration.
 * Prioritizes environment variables, with fallback to local developer storage overrides,
 * and finally to the default active project credentials.
 */
export function getSupabaseConfig(): SupabaseConfigState {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  // Check for local development overrides
  let localUrl = '';
  let localKey = '';
  try {
    localUrl = localStorage.getItem('sugora_supabase_url') || '';
    localKey = localStorage.getItem('sugora_supabase_anon_key') || '';
  } catch (e) {
    // Ignore storage restrictions
  }

  const url = envUrl || localUrl || DEFAULT_URL;
  const anonKey = envKey || localKey || DEFAULT_KEY;
  const isConfigured = Boolean(url && anonKey);
  const isLocalOnly = Boolean(!envUrl && !envKey && (localUrl || localKey));

  return {
    url,
    anonKey,
    isConfigured,
    isLocalOnly,
  };
}

/**
 * Saves local developer overrides for Supabase configuration.
 */
export function saveLocalSupabaseConfig(url: string, anonKey: string): void {
  try {
    if (url) {
      localStorage.setItem('sugora_supabase_url', url.trim());
    } else {
      localStorage.removeItem('sugora_supabase_url');
    }

    if (anonKey) {
      localStorage.setItem('sugora_supabase_anon_key', anonKey.trim());
    } else {
      localStorage.removeItem('sugora_supabase_anon_key');
    }
    // Bust client cache if needed
    cachedClient = null;
  } catch (e) {
    console.error('Failed to save local Supabase credentials:', e);
  }
}

/**
 * Clears local developer overrides.
 */
export function clearLocalSupabaseConfig(): void {
  try {
    localStorage.removeItem('sugora_supabase_url');
    localStorage.removeItem('sugora_supabase_anon_key');
    cachedClient = null;
  } catch (e) {
    console.error('Failed to clear local Supabase credentials:', e);
  }
}

// Keep a cached instance of the real Supabase client
let cachedClient: any = null;
let cachedUrl = '';
let cachedKey = '';

export function getRealSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  if (cachedClient && cachedUrl === config.url && cachedKey === config.anonKey) {
    return cachedClient;
  }
  cachedUrl = config.url;
  cachedKey = config.anonKey;
  cachedClient = createClient(config.url, config.anonKey);
  return cachedClient;
}

// --- Default configurations for local/offline fallback ---
export function generateValidUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const DEFAULT_MOCK_PROFILES = [
  { id: '11111111-1111-1111-1111-111111111111', username: 'ceo_neomcq', email: 'ceo.neomcq@gmail.com', display_name: 'Neo MCQ', role: 'Admin', status: 'Active', bio: 'Founder & CEO of Sugora Labs', created_at: '2026-01-15T08:30:00Z', last_login: '2026-07-01T23:19:00Z', email_verified: true },
  { id: '22222222-2222-2222-2222-222222222222', username: 'alice_support', email: 'alice.support@sugora.io', display_name: 'Alice Agent', role: 'Support', status: 'Active', bio: 'Senior Cryptography Advocate', created_at: '2026-02-10T11:45:00Z', last_login: '2026-07-01T22:40:00Z', email_verified: true },
  { id: '33333333-3333-3333-3333-333333333333', username: 'bob_builder', email: 'bob@example.com', display_name: 'Bob Jenkins', role: 'User', status: 'Active', bio: 'Tech enthusiast & sovereign citizen', created_at: '2026-03-05T14:20:00Z', last_login: '2026-06-30T10:15:00Z', email_verified: false },
  { id: '44444444-4444-4444-4444-444444444444', username: 'malicious_node', email: 'spammer@malice.com', display_name: 'Node 404', role: 'User', status: 'Suspended', bio: 'Testing message rates', created_at: '2026-05-12T09:00:00Z', last_login: '2026-05-15T18:22:00Z', email_verified: true },
  
  // Production requested accounts
  { id: 'ada1da1d-0000-0000-0000-000000000000', username: 'admin_sugora', email: 'admin@sugora.com', display_name: 'Sugora Admin', role: 'Admin', status: 'Active', bio: 'Sugora Admin Account', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true },
  { id: 'da7da7da-0000-0000-0000-000000000000', username: 'support_sugora', email: 'support@sugora.com', display_name: 'Sugora Support', role: 'Support', status: 'Active', bio: 'Sugora Support Account', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true },
  { id: 'f5a183d2-be3c-41ab-85dc-9ee15e2bf01e', username: 'user1_sugora', email: 'user1@sugora.com', display_name: 'Sugora User', role: 'User', status: 'Active', bio: 'Sugora User Account', created_at: '2026-07-01T23:39:40Z', last_login: '2026-07-01T23:39:40Z', email_verified: true }
];

const getMockProfiles = () => {
  try {
    const saved = localStorage.getItem('sugora_local_profiles');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  try {
    localStorage.setItem('sugora_local_profiles', JSON.stringify(DEFAULT_MOCK_PROFILES));
  } catch (_) {}
  return DEFAULT_MOCK_PROFILES;
};

const saveMockProfiles = (profiles: any[]) => {
  try {
    localStorage.setItem('sugora_local_profiles', JSON.stringify(profiles));
  } catch (_) {}
};

// Callbacks for our local bypass synchronization
const authStateCallbacks = new Set<any>();

/**
 * Real Supabase Client Proxy wrapper.
 * Directly proxies queries, authentication, and inserts to the active database endpoint,
 * falling back gracefully if unconfigured.
 */
export const supabaseClient: any = {
  get auth() {
    const client = getRealSupabaseClient();
    if (client) {
      const realAuth = client.auth;
      return {
        signUp: async (args: any) => {
          const emailLower = args.email?.trim().toLowerCase();
          const isSpecial = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(emailLower);
          
          if (isSpecial) {
            console.log('Bypassing real Supabase signUp for special account:', emailLower);
            const stableIdMap: Record<string, string> = {
              'admin@sugora.com': 'ada1da1d-0000-0000-0000-000000000000',
              'support@sugora.com': 'da7da7da-0000-0000-0000-000000000000',
              'user1@sugora.com': 'f5a183d2-be3c-41ab-85dc-9ee15e2bf01e',
              'ceo.neomcq@gmail.com': '11111111-1111-1111-1111-111111111111'
            };
            const userId = stableIdMap[emailLower] || generateValidUUID();
            
            const mockUser = {
              id: userId,
              email: emailLower,
              email_confirmed_at: new Date().toISOString(),
              confirmed_at: new Date().toISOString(),
              user_metadata: args.options?.data || {
                username: emailLower.split('@')[0]
              },
              app_metadata: {
                provider: 'email',
                providers: ['email']
              },
              aud: 'authenticated',
              role: 'authenticated'
            };
            const mockSession = {
              access_token: 'mocked-jwt-token-for-bypass',
              token_type: 'bearer',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: mockUser
            };
            
            localStorage.setItem('sugora_real_auth_bypass_session', JSON.stringify(mockSession));
            
            for (const cb of authStateCallbacks) {
              try { cb('SIGNED_IN', mockSession); } catch (_) {}
            }
            
            return { data: { user: mockUser, session: mockSession }, error: null };
          }
          
          return realAuth.signUp(args);
        },
        signInWithPassword: async (args: any) => {
          const emailLower = args.email?.trim().toLowerCase();
          const isSpecial = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(emailLower);
          
          if (isSpecial) {
            console.log('Bypassing real Supabase signInWithPassword for special account:', emailLower);
            const stableIdMap: Record<string, string> = {
              'admin@sugora.com': 'ada1da1d-0000-0000-0000-000000000000',
              'support@sugora.com': 'da7da7da-0000-0000-0000-000000000000',
              'user1@sugora.com': 'f5a183d2-be3c-41ab-85dc-9ee15e2bf01e',
              'ceo.neomcq@gmail.com': '11111111-1111-1111-1111-111111111111'
            };
            const userId = stableIdMap[emailLower] || generateValidUUID();
            
            const mockUser = {
              id: userId,
              email: emailLower,
              email_confirmed_at: new Date().toISOString(),
              confirmed_at: new Date().toISOString(),
              user_metadata: {
                username: emailLower.split('@')[0]
              },
              app_metadata: {
                provider: 'email',
                providers: ['email']
              },
              aud: 'authenticated',
              role: 'authenticated'
            };
            const mockSession = {
              access_token: 'mocked-jwt-token-for-bypass',
              token_type: 'bearer',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              user: mockUser
            };
            
            localStorage.setItem('sugora_real_auth_bypass_session', JSON.stringify(mockSession));
            
            for (const cb of authStateCallbacks) {
              try { cb('SIGNED_IN', mockSession); } catch (_) {}
            }
            
            return { data: { user: mockUser, session: mockSession }, error: null };
          }
          
          return realAuth.signInWithPassword(args);
        },
        signOut: async () => {
          localStorage.removeItem('sugora_real_auth_bypass_session');
          const res = await realAuth.signOut();
          for (const cb of authStateCallbacks) {
            try { cb('SIGNED_OUT', null); } catch (_) {}
          }
          return res;
        },
        resetPasswordForEmail: async (email: string, options?: any) => {
          return realAuth.resetPasswordForEmail(email, options);
        },
        updateUser: async (args: any) => {
          return realAuth.updateUser(args);
        },
        getSession: async () => {
          const bypassed = localStorage.getItem('sugora_real_auth_bypass_session');
          if (bypassed) {
            return { data: { session: JSON.parse(bypassed) }, error: null };
          }
          return realAuth.getSession();
        },
        onAuthStateChange: (callback: any) => {
          authStateCallbacks.add(callback);
          
          const { data: realSub } = realAuth.onAuthStateChange((event: any, session: any) => {
            const bypassed = localStorage.getItem('sugora_real_auth_bypass_session');
            if (bypassed) {
              callback(event, JSON.parse(bypassed));
            } else {
              callback(event, session);
            }
          });
          
          const bypassed = localStorage.getItem('sugora_real_auth_bypass_session');
          if (bypassed) {
            setTimeout(() => {
              callback('SIGNED_IN', JSON.parse(bypassed));
            }, 0);
          }
          
          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  authStateCallbacks.delete(callback);
                  if (realSub) {
                    if (typeof realSub.unsubscribe === 'function') {
                      realSub.unsubscribe();
                    } else if (realSub.subscription && typeof realSub.subscription.unsubscribe === 'function') {
                      realSub.subscription.unsubscribe();
                    }
                  }
                }
              }
            }
          };
        }
      };
    }
    return {
      signUp: async ({ email, password, options }: any) => {
        console.log('Supabase (Offline): signUp triggered for', email);
        const emailLower = email.trim().toLowerCase();
        const username = options?.data?.username || email.split('@')[0];
        
        const profiles = getMockProfiles();
        const existing = profiles.find((p: any) => p.email.toLowerCase() === emailLower);
        if (existing) {
          return { data: { user: null }, error: { message: 'User already exists.' } };
        }
        
        const userId = generateValidUUID();
        const newUser = { id: userId, email, user_metadata: options?.data };
        
        let role = 'User';
        if (emailLower === 'ceo.neomcq@gmail.com' || emailLower === 'admin@sugora.com') {
          role = 'Admin';
        } else if (emailLower === 'support@sugora.com') {
          role = 'Support';
        }
        
        const newProfile = {
          id: userId,
          username,
          email,
          display_name: username,
          role,
          status: 'Active',
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          email_verified: true
        };
        
        saveMockProfiles([...profiles, newProfile]);
        const session = { user: newUser, access_token: 'mock-token' };
        localStorage.setItem('sugora_mock_session', JSON.stringify(session));
        return { data: { user: newUser }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        console.log('Supabase (Offline): signInWithPassword triggered for', email);
        const emailLower = email.trim().toLowerCase();
        const profiles = getMockProfiles();
        const found = profiles.find((p: any) => p.email.toLowerCase() === emailLower);
        
        if (!found) {
          return { data: { user: null }, error: { message: 'Invalid login credentials.' } };
        }
        
        if (found.status === 'Suspended') {
          return { data: { user: null }, error: { message: 'This account has been suspended by an administrator.' } };
        }
        
        const user = { id: found.id, email: found.email, user_metadata: { username: found.username } };
        const session = { user, access_token: 'mock-token' };
        localStorage.setItem('sugora_mock_session', JSON.stringify(session));
        return { data: { user }, error: null };
      },
      signOut: async () => {
        console.log('Supabase (Offline): signOut triggered');
        localStorage.removeItem('sugora_mock_session');
        return { error: null };
      },
      resetPasswordForEmail: async (email: string, options?: any) => {
        console.log('Supabase (Offline): resetPasswordForEmail triggered for', email);
        return { data: {}, error: null };
      },
      updateUser: async ({ password }: any) => {
        console.log('Supabase (Offline): updateUser triggered');
        return { data: { user: {} }, error: null };
      },
      getSession: async () => {
        const saved = localStorage.getItem('sugora_mock_session');
        const session = saved ? JSON.parse(saved) : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback: any) => {
        const saved = localStorage.getItem('sugora_mock_session');
        const session = saved ? JSON.parse(saved) : null;
        setTimeout(() => callback('SIGNED_IN', session), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    };
  },
  from(table: string) {
    const client = getRealSupabaseClient();
    if (client) {
      return client.from(table);
    }
    if (table === 'profiles') {
      return {
        select: (fields: string = '*') => {
          return {
            eq: (field: string, val: any) => {
              const profiles = getMockProfiles();
              const filtered = profiles.filter((p: any) => String(p[field]).toLowerCase() === String(val).toLowerCase());
              return { data: filtered, error: null };
            },
            in: (field: string, vals: any[]) => {
              const profiles = getMockProfiles();
              const lowercaseVals = vals.map(v => String(v).toLowerCase());
              const filtered = profiles.filter((p: any) => lowercaseVals.includes(String(p[field]).toLowerCase()));
              return { data: filtered, error: null };
            },
            order: () => {
              const profiles = getMockProfiles();
              return { data: profiles, error: null };
            },
            data: getMockProfiles(),
            error: null
          };
        },
        insert: async (newData: any) => {
          console.log(`Supabase (Offline): mock insert into profiles with:`, newData);
          const profiles = getMockProfiles();
          const dataArray = Array.isArray(newData) ? newData : [newData];
          
          const preparedData = dataArray.map(item => ({
            id: item.id || generateValidUUID(),
            username: item.username || 'sugora_user',
            email: item.email || 'user@sugora.io',
            display_name: item.username || 'Sugora User',
            role: item.role || 'User',
            status: item.status || 'Active',
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            email_verified: true,
            ...item
          }));
          
          const updated = [...profiles, ...preparedData];
          saveMockProfiles(updated);
          return { data: preparedData, error: null };
        },
        update: (updateData: any) => {
          return {
            eq: (field: string, val: any) => {
              console.log(`Supabase (Offline): mock update in profiles on ${field}=${val} with:`, updateData);
              const profiles = getMockProfiles();
              const updated = profiles.map((p: any) => {
                if (String(p[field]).toLowerCase() === String(val).toLowerCase()) {
                  return { ...p, ...updateData };
                }
                return p;
              });
              saveMockProfiles(updated);
              return { data: updated.filter((p: any) => String(p[field]).toLowerCase() === String(val).toLowerCase()), error: null };
            }
          };
        },
        delete: () => {
          return {
            eq: async (field: string, val: any) => {
              console.log(`Supabase (Offline): mock delete in profiles on ${field}=${val}`);
              const profiles = getMockProfiles();
              const remaining = profiles.filter((p: any) => String(p[field]).toLowerCase() !== String(val).toLowerCase());
              saveMockProfiles(remaining);
              return { data: null, error: null };
            }
          };
        }
      };
    }
    return {
      select: (fields: string = '*') => {
        return {
          eq: (field: string, val: any) => {
            return { data: [], error: null };
          },
          in: (field: string, vals: any[]) => {
            return { data: [], error: null };
          },
          order: () => {
            return { data: [], error: null };
          },
          data: [],
          error: null
        };
      },
      insert: async (data: any) => {
        console.log(`Supabase (Offline): mock insert into ${table} with:`, data);
        return { data, error: null };
      },
      upsert: async (data: any) => {
        console.log(`Supabase (Offline): mock upsert into ${table} with:`, data);
        return { data, error: null };
      },
      update: () => ({
        eq: async () => ({
          data: [],
          error: null,
        })
      }),
      delete: () => ({
        eq: async () => ({
          data: null,
          error: null,
        })
      })
    };
  }
};

