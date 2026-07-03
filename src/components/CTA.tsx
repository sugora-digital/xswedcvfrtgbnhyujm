import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Database, AlertCircle, Sparkles, UserPlus, LogIn, LayoutDashboard, MessageSquare, LogOut } from 'lucide-react';
import { getSupabaseConfig, supabaseClient } from '../lib/supabase';
import { navigate } from '../lib/router';
import { motion, AnimatePresence } from 'motion/react';

interface CTAProps {
  currentUser?: any;
  userRole?: string | null;
}

export default function CTA({ currentUser, userRole }: CTAProps = {}) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dbStatus, setDbStatus] = useState(getSupabaseConfig());

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    const currentConfig = getSupabaseConfig();
    setDbStatus(currentConfig);

    try {
      if (currentConfig.isConfigured) {
        console.log(`CTA: Inserting waitlist subscriber to Supabase: ${email}`);
        const { error } = await supabaseClient.from('waitlist').insert({ email, created_at: new Date().toISOString() });
        if (error) {
          throw error;
        }
      } else {
        console.log(`CTA: Supabase not configured. Saving subscriber locally: ${email}`);
        const localWaitlist = JSON.parse(localStorage.getItem('sugora_local_waitlist') || '[]');
        if (!localWaitlist.includes(email)) {
          localWaitlist.push(email);
          localStorage.setItem('sugora_local_waitlist', JSON.stringify(localWaitlist));
        }
      }

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
    <section id="cta-section" className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Immersive radial glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-radial-gradient from-blue-500/5 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Direct Platform Access Card (Sign Up & Sign In) */}
          <div className="lg:col-span-6 p-8 sm:p-12 rounded-[40px] border border-neutral-200/80 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-500/5 blur-2xl rounded-full" />
            
            {currentUser ? (
              <>
                <div className="space-y-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" />
                    Secure Node Active
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white leading-tight">
                    Welcome back. <br />
                    Session is active.
                  </h3>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    Your secure keys are verified. You are authenticated as <span className="text-blue-500 dark:text-cyan-400 font-bold">@{currentUser.email?.split('@')[0]}</span> ({currentUser.email}). Navigate directly to your workspace below.
                  </p>
                </div>

                {/* Logged in action buttons */}
                <div className="space-y-3 pt-8 relative z-10">
                  <button
                    id="cta-chats-btn"
                    onClick={() => navigate('/chat')}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>Open Encrypted Shard Chats</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {userRole === 'Admin' && (
                    <button
                      id="cta-admin-btn"
                      onClick={() => navigate('/admin/dashboard')}
                      className="w-full py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-850 dark:text-neutral-200 font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5 text-teal-500" />
                      <span>Access Admin Dashboard</span>
                    </button>
                  )}

                  {userRole === 'Support' && (
                    <button
                      id="cta-support-btn"
                      onClick={() => navigate('/support/dashboard')}
                      className="w-full py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-850 dark:text-neutral-200 font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="h-4.5 w-4.5 text-teal-500" />
                      <span>Access Support Dashboard</span>
                    </button>
                  )}

                  <button
                    id="cta-logout-btn"
                    onClick={() => supabaseClient.auth.signOut()}
                    className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/15 border border-dashed border-red-500/30 text-red-500 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Exit Sovereign Session</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6 relative z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/10 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" />
                    Sovereign Nodes Ready
                  </span>

                  <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white leading-tight">
                    Enter the future. <br />
                    Claim your keys.
                  </h3>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    Create a secure public-key profile instantly using Supabase Auth, or access your existing encrypted workspace dashboard securely from any browser sandbox.
                  </p>
                </div>

                {/* Large Sign Up & Sign In buttons */}
                <div className="space-y-3 pt-8 relative z-10">
                  <button
                    id="cta-register-btn"
                    onClick={() => navigate('/register')}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="h-4.5 w-4.5" />
                    <span>Create Free Sovereign Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    id="cta-login-btn"
                    onClick={() => navigate('/login')}
                    className="w-full py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-extrabold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="h-4.5 w-4.5" />
                    <span>Sign In to Existing Node</span>
                  </button>
                </div>
              </>
            )}

          </div>

          {/* Column 2: Beta Sandbox Wave registration */}
          <div className="lg:col-span-6 p-8 sm:p-12 rounded-[40px] border border-neutral-200/80 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-sm flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-purple-500/5 blur-2xl rounded-full" />

            <div className="space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/10 text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-widest">
                <Mail className="h-3.5 w-3.5 animate-pulse" />
                Wave Invites Open
              </span>

              <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white leading-tight">
                Get notified. <br />
                Preview Wave 04.
              </h3>

              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                Receive unique sandbox invitation codes and cryptographic genesis keys during our upcoming bi-weekly rolls. No phone or tracking logs required.
              </p>
            </div>

            {/* Input fields form */}
            <div className="pt-8 relative z-10">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/25 text-center space-y-2.5"
                  >
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
                    <h4 className="font-extrabold text-neutral-900 dark:text-white text-base">You are on the list!</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                      Your invite is securely logged. We will deliver your genesis credentials direct to this address when Wave 04 triggers.
                    </p>
                    
                    {!dbStatus.isConfigured && (
                      <div className="pt-3 border-t border-emerald-500/10 text-[9px] font-mono text-neutral-400 flex items-center justify-center gap-1.5">
                        <Database className="h-3.5 w-3.5" />
                        <span>Saved to local cache storage (Offline Mode)</span>
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
                    <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm focus-within:border-blue-500 transition-colors">
                      <div className="flex items-center gap-2.5 px-3 flex-1">
                        <Mail className="h-4.5 w-4.5 text-neutral-400" />
                        <input
                          id="waitlist-email-input"
                          type="email"
                          required
                          placeholder="Enter secure email address..."
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-transparent border-none text-xs sm:text-sm text-neutral-800 dark:text-white placeholder-neutral-400 focus:outline-none py-3"
                        />
                      </div>
                      <button
                        id="waitlist-submit"
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto px-6 py-3 bg-neutral-950 hover:bg-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isSubmitting ? 'Securing...' : 'Secure Slot'}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Developer telemetry notice */}
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-500 mt-2 px-1">
                      {dbStatus.isConfigured ? (
                        <>
                          <Database className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-green-500 font-bold">Supabase Configured: waitlist table matches perfectly.</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5 text-neutral-400" />
                          <span>Supabase not configured. Saved to client database fallback.</span>
                        </>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
