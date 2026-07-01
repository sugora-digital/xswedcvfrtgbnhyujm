import { SupabaseConfigState } from '../types';

/**
 * Retrieves the current Supabase configuration.
 * Prioritizes environment variables, with fallback to local developer storage overrides for interactive testing.
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

  const url = envUrl || localUrl;
  const anonKey = envKey || localKey;
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
  } catch (e) {
    console.error('Failed to clear local Supabase credentials:', e);
  }
}

/**
 * Mock client preparation for Phase 1.
 * This demonstrates integration-readiness without throwing errors on missing credentials.
 */
export const supabaseClient = {
  isPrepared: true,
  config: getSupabaseConfig(),
  // Placeholder methods for future phases
  auth: {
    signUp: async (email: string) => {
      console.log('Supabase: Future signUp triggered for', email);
      return { data: { user: { email } }, error: null };
    },
    signIn: async (email: string) => {
      console.log('Supabase: Future signIn triggered for', email);
      return { data: { user: { email } }, error: null };
    },
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        data: [],
        error: null,
      }),
    }),
    insert: async (data: any) => {
      console.log(`Supabase: Future insert into ${table} with:`, data);
      return { data, error: null };
    },
  }),
};
