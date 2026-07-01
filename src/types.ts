export type Theme = 'light' | 'dark' | 'system';

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  status: 'available' | 'beta' | 'coming-soon';
  downloadUrl?: string;
}

export interface SupabaseConfigState {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  isLocalOnly: boolean;
}
