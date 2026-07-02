import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('q1');

  const faqItems: FAQItem[] = [
    {
      id: 'q1',
      question: 'Is Sugora really private? How do you monetize?',
      answer: 'Yes, Sugora is completely private. We operate on a dual-license model: the core communication protocol is 100% open-source, non-profit, and self-hosted. For enterprise workspaces, we offer premium high-performance node clustering, dedicated storage pinners, and customized hardware sandboxes. We will never sell ads, harvest chat metadata, or compromise user secrets.'
    },
    {
      id: 'q2',
      question: 'What makes Sugora different from Signal or Telegram?',
      answer: 'Telegram stores your non-secret chats in centralized servers, holding the decryption keys. Signal is highly secure but relies on central servers to route and authenticate directories. Sugora splits encrypted message payloads into distributed threshold fragments (shards) across transient nodes. No complete database exists on any single server, and keys remain entirely isolated inside your physical device processors.'
    },
    {
      id: 'q3',
      question: 'Where is my message history stored?',
      answer: 'All active threads, profiles, and keystores are stored securely on your local device (using client-side sandboxed IndexedDB). We never compile or index message histories on a remote host. If you connect a Supabase cloud project in developer options, your logs can optionally mirror to your self-hosted private cloud cluster.'
    },
    {
      id: 'q4',
      question: 'How do I install the Sugora Progressive Web App (PWA)?',
      answer: 'You do not need to download packages from the App Store. On Desktop Chrome/Edge, look for the "Install" icon in the address bar. On Mobile Safari (iOS), tap the Share button and select "Add to Home Screen". On Android Chrome, tap the menu and select "Install App". You can immediately pin Sugora to your launcher menu.'
    },
    {
      id: 'q5',
      question: 'What is the implementation plan for Phase 2?',
      answer: 'Phase 1 establishes Sugora\'s responsive branding, interactive developer modules, and offline PWA service shells. Phase 2 introduces full Supabase database synchronization, secure multi-user rooms, and on-device WebGPU accelerated AI assistants. Join our waiting list below to receive sandbox invitation keys!'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Dynamic lighting effects */}
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/5 blur-[140px] rounded-full" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/10 uppercase tracking-widest">
            <HelpCircle className="h-4 w-4" />
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Frequently Asked <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium max-w-lg mx-auto leading-relaxed">
            Everything you need to know about Sugora's decentralized core, security standards, and architectural design.
          </p>
        </div>

        {/* Accordion Group */}
        <div className="space-y-4 text-left">
          {faqItems.map((item, idx) => {
            const isOpen = openId === item.id;
            return (
              <motion.div
                id={`faq-item-${item.id}`}
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-xl' 
                    : 'bg-white/40 dark:bg-neutral-900/10 border-neutral-200/60 dark:border-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900/20'
                }`}
              >
                {/* Header button */}
                <button
                  id={`faq-toggle-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white transition-colors hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer"
                >
                  <span className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl shrink-0 ${isOpen ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'}`}>
                      <HelpCircle className="h-4.5 w-4.5 shrink-0" />
                    </div>
                    <span>{item.question}</span>
                  </span>
                  <div className={`h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-800/85 flex items-center justify-center text-neutral-400 shrink-0 transition-all ${isOpen ? 'rotate-180 bg-neutral-100 dark:bg-neutral-800 text-blue-500' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Animated Answer Body */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium border-t border-neutral-150 dark:border-neutral-800/80">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
