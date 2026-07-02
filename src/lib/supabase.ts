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

/**
 * Real Supabase Client Proxy wrapper.
 * Directly proxies queries, authentication, and inserts to the active database endpoint,
 * falling back gracefully if unconfigured.
 */
export const supabaseClient: any = {
  get auth() {
    const client = getRealSupabaseClient();
    if (client) return client.auth;
    return {
      signUp: async (email: string) => {
        console.log('Supabase (Offline): signUp triggered for', email);
        return { data: { user: { email } }, error: null };
      },
      signIn: async (email: string) => {
        console.log('Supabase (Offline): signIn triggered for', email);
        return { data: { user: { email } }, error: null };
      },
    };
  },
  from(table: string) {
    const client = getRealSupabaseClient();
    if (client) {
      return client.from(table);
    }
    return {
      select: () => ({
        eq: () => ({
          data: [],
          error: null,
        }),
        order: () => ({
          data: [],
          error: null,
        }),
      }),
      insert: async (data: any) => {
        console.log(`Supabase (Offline): mock insert into ${table} with:`, data);
        return { data, error: null };
      },
      delete: () => ({
        eq: async () => ({
          data: null,
          error: null,
        })
      })
    };
  }
};

