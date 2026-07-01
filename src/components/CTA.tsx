import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Database, AlertCircle, Sparkles } from 'lucide-react';
import { getSupabaseConfig, supabaseClient } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dbStatus, setDbStatus] = useState(getSupabaseConfig());

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    // Refresh config state in case they added overrides on-the-fly
    const currentConfig = getSupabaseConfig();
    setDbStatus(currentConfig);

    try {
      if (currentConfig.isConfigured) {
        // Attempt insert to mock/real Supabase table 'waitlist'
        console.log(`CTA: Inserting waitlist subscriber to Supabase: ${email}`);
        await supabaseClient.from('waitlist').insert({ email, created_at: new Date().toISOString() });
      } else {
        // Fallback local persistence
        console.log(`CTA: Supabase not configured. Saving subscriber locally: ${email}`);
        const localWaitlist = JSON.parse(localStorage.getItem('sugora_local_waitlist') || '[]');
        if (!localWaitlist.includes(email)) {
          localWaitlist.push(email);
          localStorage.setItem('sugora_local_waitlist', JSON.stringify(localWaitlist));
        }
      }

      // Simulate a small network delay for a high-end UI response
      setTimeout(() => {
        setIsSubmitting(false);
        setStatus('success');
        setEmail('');
      }, 800);

    } catch (err) {
      console.error('Subscription error:', err);
      setIsSubmitting(false);
      setStatus('error');
    }
  };

  return (
    <section id="cta-section" className="py-20 md:py-28 bg-white dark:bg-zinc-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decorative Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/5 dark:bg-teal-500/2 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel-heavy border border-neutral-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 md:p-16 text-center space-y-8 shadow-2xl">
          
          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/10 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Sovereign Waitlist Now Open
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Secure Your Slot in the <span className="brand-gradient-text">Decentralized Era</span>.
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-zinc-400 font-medium leading-relaxed">
              Sugora is rolling out sandbox invitations in bi-weekly waves. Join the waitlist today to receive your unique cryptographic genesis node keys and preview the future of secure chats.
            </p>
          </div>

          {/* Form */}
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/25 text-center space-y-2.5"
                >
                  <CheckCircle className="h-8 w-8 text-teal-500 mx-auto" />
                  <h4 className="font-extrabold text-neutral-900 dark:text-white text-base">You are on the list!</h4>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400 font-medium">
                    Your invitation slot is logged. Once sandbox channels activate, we will deliver your unique genesis keystore.
                  </p>
                  
                  {/* Developer status message inside success block */}
                  {!dbStatus.isConfigured && (
                    <div className="mt-4 pt-3 border-t border-teal-500/10 text-[10px] font-mono text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                      <Database className="h-3.5 w-3.5" />
                      <span>Saved to client cache. (Supabase Offline)</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubscribe}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/50 backdrop-blur-sm focus-within:border-teal-500 transition-colors">
                    <div className="flex items-center gap-2 px-3 flex-1">
                      <Mail className="h-4.5 w-4.5 text-neutral-400" />
                      <input
                        id="waitlist-email-input"
                        type="email"
                        required
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-none text-xs sm:text-sm text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none py-2"
                      />
                    </div>
                    <button
                      id="waitlist-submit"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isSubmitting ? 'Registering...' : 'Secure Slot'}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Dev persistence warning/status banner */}
                  <div className="flex justify-center items-center gap-1.5 text-[10px] font-mono text-neutral-400 dark:text-zinc-500 mt-2">
                    {dbStatus.isConfigured ? (
                      <>
                        <Database className="h-3 w-3 text-teal-500 animate-pulse" />
                        <span className="text-teal-600 dark:text-teal-400 font-bold">Supabase Connected: Waitlist will stream direct to database tables.</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                        <span>Supabase not configured. Click the bottom-right panel to link credentials.</span>
                      </>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
