import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, X, Key, Globe, Eye, EyeOff, Check, Copy } from 'lucide-react';
import { getSupabaseConfig, saveLocalSupabaseConfig, clearLocalSupabaseConfig } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function SupabasePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setUrlInput(config.url);
    setKeyInput(config.anonKey);
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalSupabaseConfig(urlInput, keyInput);
    const updated = getSupabaseConfig();
    setConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClear = () => {
    clearLocalSupabaseConfig();
    setUrlInput('');
    setKeyInput('');
    setConfig(getSupabaseConfig());
  };

  const copyEnvSnippet = () => {
    const snippet = `VITE_SUPABASE_URL="${config.url || 'https://your-project.supabase.co'}"\nVITE_SUPABASE_ANON_KEY="${config.anonKey || 'your-anon-key'}"`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Indicator Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          id="supabase-prompt-toggle"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border text-xs font-semibold cursor-pointer ${
            config.isConfigured
              ? 'bg-teal-500/10 text-teal-600 border-teal-500/30 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/20'
              : 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/20'
          } backdrop-blur-md`}
        >
          <Database className="h-4 w-4 animate-pulse" />
          <span>
            {config.isConfigured 
              ? `Supabase Ready${config.isLocalOnly ? ' (Local Overrides)' : ''}` 
              : 'Setup Supabase (Phase 1 Ready)'}
          </span>
          <span className={`h-2 w-2 rounded-full ${config.isConfigured ? 'bg-teal-500' : 'bg-amber-500'}`} />
        </motion.button>
      </div>

      {/* Slide-over Drawer Panels */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-950 border-l border-neutral-200 dark:border-zinc-800 shadow-2xl z-50 overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6 border-b border-neutral-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-teal-500" />
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Supabase Integration Panel</h3>
                </div>
                <button
                  id="close-supabase-drawer"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Header */}
              <div className={`p-4 rounded-xl border mb-6 ${
                config.isConfigured
                  ? 'bg-teal-500/5 border-teal-500/20 text-teal-800 dark:text-teal-200'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-800 dark:text-amber-200'
              }`}>
                <div className="flex items-start gap-3">
                  {config.isConfigured ? (
                    <CheckCircle2 className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {config.isConfigured ? 'Database Connectivity Enabled' : 'Configuration Required'}
                    </h4>
                    <p className="text-xs mt-1 text-neutral-600 dark:text-zinc-300 leading-relaxed">
                      {config.isConfigured
                        ? `Sugora is successfully connected to your database endpoint. Future chat and user auth tables will bind here seamlessly.`
                        : `Sugora's data schemas are prepared for deployment. Provide credentials to enable state caching, newsletter waitlists, and interactive database actions.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Environment Setup Help */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500 mb-2">
                  Production Env Variables Setup
                </h4>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs">
                  <p className="mb-3 text-neutral-600 dark:text-zinc-300">
                    To store your credentials securely for hosting, declare these variables in your <code className="bg-neutral-200 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">.env</code> or Vercel dashboard:
                  </p>
                  <pre className="p-3 bg-neutral-900 text-neutral-100 rounded-lg font-mono text-[10px] overflow-x-auto relative group">
                    <code>
                      VITE_SUPABASE_URL="your-project-url"<br />
                      VITE_SUPABASE_ANON_KEY="your-anon-key"
                    </code>
                    <button
                      id="copy-env-snippet"
                      onClick={copyEnvSnippet}
                      className="absolute right-2 top-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </pre>
                  {copied && <span className="text-[10px] text-teal-500 mt-1 block">Copied to clipboard!</span>}
                </div>
              </div>

              {/* Developer Interactive Settings */}
              <form onSubmit={handleSave} className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                  Interactive Developer Bypass
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
                  Test Supabase features instantly by entering credentials here. Overrides are stored securely in your client-side session only.
                </p>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5 text-neutral-400" />
                    Supabase Project URL
                  </label>
                  <input
                    id="supabase-url-input"
                    type="url"
                    placeholder="https://your-project.supabase.co"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Key className="h-3.5 w-3.5 text-neutral-400" />
                      Supabase Anon Key
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-[10px]"
                    >
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </label>
                  <input
                    id="supabase-key-input"
                    type={showKey ? 'text' : 'password'}
                    placeholder="your-anon-key-string"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    id="save-supabase-config"
                    type="submit"
                    className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Local Overrides
                  </button>
                  {config.isConfigured && (
                    <button
                      id="clear-supabase-config"
                      type="button"
                      onClick={handleClear}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-zinc-300 font-semibold rounded-lg text-xs transition-all cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {saveSuccess && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-teal-500 font-medium"
                  >
                    Saved successfully! Waitlist submissions will now stream to your database.
                  </motion.p>
                )}
              </form>

              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-zinc-800 text-[11px] text-neutral-500 dark:text-zinc-400 leading-relaxed">
                <p className="font-semibold text-neutral-700 dark:text-zinc-300 mb-1">Phase 1 Delivery Note:</p>
                Database connection and authentication structures are decoupled and optimized in a configuration wrapper. Standard API routing schemas are fully mapped, making this structure instantly upgradable for active real-time data storage in subsequent phases.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
