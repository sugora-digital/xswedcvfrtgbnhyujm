import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>('q1');

  const faqItems: FAQItem[] = [
    {
      id: 'q1',
      question: 'Is Sugora really private? How do you monetize?',
      answer: 'Yes, Sugora is completely secure. We operate on a dual-license model: the core communication protocol is 100% open-source, non-profit, and self-hosted. For enterprise workspaces, we offer premium high-performance node clustering, dedicated storage pinners, and customized hardware sandboxes. We will never sell ads or harvest chat metadata.'
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
    <section id="faq" className="py-20 md:py-28 bg-neutral-50 dark:bg-zinc-900/50 border-y border-neutral-200/50 dark:border-zinc-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Common Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Frequently Asked <span className="brand-gradient-text">Questions</span>
          </h2>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium">
            Everything you need to know about Sugora's decentralized core and security standards.
          </p>
        </div>

        {/* Accordion Group */}
        <div className="space-y-4">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                id={`faq-item-${item.id}`}
                key={item.id}
                className="rounded-2xl border border-neutral-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm hover:shadow transition-shadow duration-300"
              >
                {/* Header button */}
                <button
                  id={`faq-toggle-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm sm:text-base text-neutral-900 dark:text-white transition-colors hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                    {item.question}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-neutral-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-500' : ''}`} />
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
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium border-t border-neutral-100 dark:border-zinc-900">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
