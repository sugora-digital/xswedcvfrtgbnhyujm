import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, X, Key, Globe, Eye, EyeOff, Check, Copy, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { getSupabaseConfig, saveLocalSupabaseConfig, clearLocalSupabaseConfig, supabaseClient } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function SupabasePrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(getSupabaseConfig());
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<any[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  useEffect(() => {
    setUrlInput(config.url);
    setKeyInput(config.anonKey);
  }, [config]);

  // Fetch live notes
  const fetchNotes = async () => {
    if (!config.isConfigured) return;
    setNotesLoading(true);
    setNotesError(null);
    try {
      // Query notes table
      const { data, error } = await supabaseClient.from('notes').select('*');
      if (error) {
        setNotesError(error.message || 'Error fetching notes');
      } else {
        setNotes(data || []);
      }
    } catch (err: any) {
      setNotesError(err.message || 'Failed to connect/fetch from Supabase.');
    } finally {
      setNotesLoading(false);
    }
  };

  // Fetch when panel opens or config changes
  useEffect(() => {
    if (isOpen && config.isConfigured) {
      fetchNotes();
    }
  }, [isOpen, config]);

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

  const copySqlSnippet = () => {
    const sql = `-- Create the table\ncreate table notes (\n  id bigint primary key generated always as identity,\n  title text not null\n);\n\n-- Enable Row Level Security (RLS)\nalter table notes enable row level security;\n\n-- Create read-only policy\ncreate policy "public can read notes" on public.notes for select to anon using (true);\n\n-- Create write policy\ncreate policy "public can insert notes" on public.notes for insert to anon with check (true);\n\n-- Insert some sample data\ninsert into notes (title)\nvalues\n  ('Today I created a Supabase project.'),\n  ('I added some data and queried it from Next.js.'),\n  ('It was awesome!');`;
    navigator.clipboard.writeText(sql);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    setIsAddingNote(true);
    try {
      const { error } = await supabaseClient.from('notes').insert({ title: newNoteTitle.trim() });
      if (error) {
        alert('Supabase insertion failed: ' + error.message);
      } else {
        setNewNoteTitle('');
        await fetchNotes();
      }
    } catch (err: any) {
      alert('Failed to insert note: ' + err.message);
    } finally {
      setIsAddingNote(false);
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const { error } = await supabaseClient.from('notes').delete().eq('id', id);
      if (error) {
        alert('Supabase deletion failed: ' + error.message);
      } else {
        await fetchNotes();
      }
    } catch (err: any) {
      alert('Failed to delete note: ' + err.message);
    }
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

              {/* Live Notes Database Sandbox */}
              {config.isConfigured && (
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <Database className="h-4 w-4 text-teal-500 animate-pulse" />
                      Live Notes Database Sandbox
                    </h4>
                    <button
                      type="button"
                      onClick={fetchNotes}
                      disabled={notesLoading}
                      className="text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white p-1 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-md transition-colors cursor-pointer"
                      title="Sync/Refresh list"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${notesLoading ? 'animate-spin text-teal-500' : ''}`} />
                    </button>
                  </div>

                  <p className="text-[11px] text-neutral-500 dark:text-zinc-400">
                    Interact directly with your live Supabase <code className="bg-neutral-100 dark:bg-zinc-900 px-1 rounded text-teal-600 dark:text-teal-400 font-semibold font-mono">notes</code> table in real-time.
                  </p>

                  {/* Add Note Form */}
                  <form onSubmit={addNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a new live note..."
                      required
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      disabled={isAddingNote || !newNoteTitle.trim()}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isAddingNote ? 'Saving...' : 'Add'}</span>
                    </button>
                  </form>

                  {/* Notes list / Loading / Errors / Instructions */}
                  {notesLoading && notes.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-500 dark:text-zinc-400">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-teal-500" />
                      <span>Fetching notes from database...</span>
                    </div>
                  ) : notesError ? (
                    <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3.5">
                      <div className="flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-neutral-950 dark:text-white">Table check / Read Policies</p>
                          <p className="text-[10px] mt-0.5 opacity-90 leading-relaxed text-amber-700 dark:text-amber-300">
                            Supabase returned: <code className="font-mono block mt-1 break-all text-red-600 dark:text-red-400">{notesError}</code>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-amber-500/10 text-[10px] space-y-2">
                        <p className="font-semibold text-neutral-700 dark:text-zinc-350">
                          Please ensure the table exists by executing this snippet inside your Supabase SQL Editor:
                        </p>
                        <pre className="p-2.5 bg-zinc-900 text-zinc-100 rounded-md font-mono text-[9px] overflow-x-auto relative group">
                          <code>
                            {`create table notes (
  id bigint primary key generated always as identity,
  title text not null
);

alter table notes enable row level security;

create policy "public can read notes" on public.notes for select to anon using (true);
create policy "public can insert notes" on public.notes for insert to anon with check (true);
create policy "public can delete notes" on public.notes for delete to anon using (true);`}
                          </code>
                          <button
                            type="button"
                            onClick={copySqlSnippet}
                            className="absolute right-1 top-1 p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer flex items-center justify-center"
                            title="Copy SQL code"
                          >
                            {sqlCopied ? <Check className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </pre>
                        {sqlCopied && <span className="text-[9px] text-teal-500 font-medium">SQL copied to clipboard!</span>}
                      </div>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-8 rounded-xl border border-dashed border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30">
                      <p className="text-xs text-neutral-500 dark:text-zinc-400 font-semibold">No notes found in table</p>
                      <p className="text-[10px] text-neutral-450 dark:text-zinc-500 mt-1">Use the input field above to insert a new row.</p>
                    </div>
                  ) : (
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {notes.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-150 dark:border-zinc-800 text-xs hover:border-teal-500/30 transition-all"
                        >
                          <span className="text-neutral-800 dark:text-neutral-200 font-medium break-all pr-3">
                            {note.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteNote(note.id)}
                            className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors shrink-0"
                            title="Delete note"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
