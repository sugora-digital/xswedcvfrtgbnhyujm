import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Lock, MessageSquare, Check, Wifi, Globe, Laptop, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  const [activeTab, setActiveTab] = useState<'chat' | 'security' | 'network'>('chat');
  const [selectedChannel, setSelectedChannel] = useState('#system-core');
  const [isSecure, setIsSecure] = useState(true);

  const channels = [
    { id: '#system-core', label: 'core-stream', unread: false },
    { id: '#secure-sync', label: 'crypto-keys', unread: true },
    { id: '#global-nodes', label: 'distributed', unread: false }
  ];

  const mockMessages: Record<string, Array<{ sender: string; text: string; time: string; self?: boolean }>> = {
    '#system-core': [
      { sender: 'System Engine', text: 'Initializing zero-latency decentralization cluster...', time: '10:04' },
      { sender: 'Client Node', text: 'Securing websocket handshake with local keystore.', time: '10:05' },
      { sender: 'System Engine', text: 'Sugora Node connection successful. Core latency: 4ms.', time: '10:05' }
    ],
    '#secure-sync': [
      { sender: 'Entropy Generator', text: 'Generated high-entropy ephemeral security keys.', time: '09:41' },
      { sender: 'Client Node', text: 'Active keys verified. Shard splitting complete.', time: '09:42' }
    ],
    '#global-nodes': [
      { sender: 'Orchestrator', text: 'Distributed network consensus reached across 14 zones.', time: '08:12' },
      { sender: 'Gateway Alpha', text: 'IPFS pinning active for secure transient logs.', time: '08:15' }
    ]
  };

  const handleWaitlistScroll = () => {
    const element = document.querySelector('#cta-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-12 md:py-20 lg:py-24 bg-gradient-to-b from-transparent via-neutral-100/30 to-transparent dark:via-zinc-900/10">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start space-y-6">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/10 text-xs font-semibold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Phase 1 Launch: Secure Public Architectural Alpha</span>
            </motion.div>

            {/* Title / Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Reclaiming <span className="brand-gradient-text">Absolute Sovereignty</span> Over Your Digital Speech.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-neutral-600 dark:text-zinc-400 max-w-xl font-medium leading-relaxed"
            >
              Sugora is a hyper-fast, premium messaging platform crafted on local-first database shards, decentralized consensus, and total hardware transparency. Zero ads. Zero trackers.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
            >
              <button
                id="hero-primary-cta"
                onClick={handleWaitlistScroll}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500 text-white dark:text-zinc-950 font-bold text-sm rounded-xl shadow-lg shadow-teal-500/20 dark:shadow-teal-400/10 transition-all cursor-pointer"
              >
                Join Waitlist
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                id="hero-secondary-cta"
                href="#features"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-neutral-800 dark:text-zinc-200 font-bold text-sm rounded-xl transition-all border border-neutral-200/50 dark:border-zinc-800/50"
              >
                Explore Technology
              </a>
            </motion.div>

            {/* Minor Trust Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-6 pt-4 text-xs font-semibold text-neutral-500 dark:text-zinc-500"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-500" />
                <span>Zero-Knowledge Architecture</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-indigo-500" />
                <span>Local-First Cryptography</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Live Interactive Blueprint Wireframe */}
          <div className="lg:col-span-7 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl glass-panel-heavy rounded-2xl border border-neutral-200/80 dark:border-zinc-800/80 shadow-2xl overflow-hidden neon-shimmer"
            >
              {/* Wireframe Header Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200/60 dark:border-zinc-800/60 bg-neutral-50/50 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex rounded-lg bg-neutral-200/60 dark:bg-zinc-850/60 p-0.5 text-[11px] font-bold">
                  <button
                    id="blueprint-tab-chat"
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'}`}
                  >
                    Active Thread
                  </button>
                  <button
                    id="blueprint-tab-security"
                    onClick={() => setActiveTab('security')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${activeTab === 'security' ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'}`}
                  >
                    Encrypted Core
                  </button>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-400 dark:text-zinc-500">
                  <Wifi className="h-3.5 w-3.5 text-teal-500" />
                  <span className="text-[10px] font-mono">NODE_UP_04</span>
                </div>
              </div>

              {/* Interactive Area */}
              <div className="h-[360px] flex text-sm">
                
                {/* 1. Left Chat Panel Tab Content */}
                {activeTab === 'chat' && (
                  <>
                    {/* Channel Selector list */}
                    <div className="w-1/3 border-r border-neutral-200/60 dark:border-zinc-800/60 p-3 bg-neutral-50/30 dark:bg-zinc-900/10 space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
                        Active Streams
                      </p>
                      {channels.map((chan) => (
                        <button
                          id={`blueprint-channel-${chan.id.replace('#', '')}`}
                          key={chan.id}
                          onClick={() => setSelectedChannel(chan.id)}
                          className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            selectedChannel === chan.id
                              ? 'bg-neutral-200/50 dark:bg-zinc-800/50 text-neutral-900 dark:text-white'
                              : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5 text-teal-500/70" />
                            {chan.id}
                          </span>
                          {chan.unread && selectedChannel !== chan.id && (
                            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Messages Window */}
                    <div className="flex-1 flex flex-col justify-between p-4 bg-white/40 dark:bg-zinc-950/20">
                      <div className="space-y-3.5 overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-neutral-150 dark:border-zinc-850 pb-2">
                          <span className="font-bold text-xs text-neutral-900 dark:text-white">{selectedChannel}</span>
                          <span className="text-[9px] font-mono bg-teal-500/10 text-teal-500 px-1.5 py-0.5 rounded font-bold">ACTIVE_ENCRYPTED</span>
                        </div>

                        {mockMessages[selectedChannel]?.map((msg, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-[11px] font-extrabold text-neutral-800 dark:text-zinc-300">
                                {msg.sender}
                              </span>
                              <span className="text-[9px] text-neutral-400 dark:text-zinc-500 font-mono">
                                {msg.time}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-600 dark:text-zinc-400 font-mono leading-relaxed bg-neutral-100/50 dark:bg-zinc-900/40 p-2 rounded-lg border border-neutral-200/20 dark:border-zinc-800/10">
                              {msg.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Interactive textfield mock */}
                      <div className="pt-2">
                        <div className="flex gap-2 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50 dark:bg-zinc-900 p-1.5">
                          <input
                            disabled
                            type="text"
                            placeholder="Type a secure payload..."
                            className="flex-1 bg-transparent border-none text-xs focus:outline-none px-2 text-neutral-500"
                          />
                          <button disabled className="px-3 py-1 bg-teal-500 text-white rounded-md text-[10px] font-bold">
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 2. Security Tab Content */}
                {activeTab === 'security' && (
                  <div className="flex-1 p-6 flex flex-col justify-between bg-white/40 dark:bg-zinc-950/20 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                          Hardware Cryptographic Modules
                        </h4>
                        <button
                          id="blueprint-toggle-security"
                          onClick={() => setIsSecure(!isSecure)}
                          className="text-[10px] font-bold px-2 py-0.5 bg-neutral-200 dark:bg-zinc-800 rounded text-neutral-600 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                          {isSecure ? 'Disconnect Core' : 'Activate Core'}
                        </button>
                      </div>

                      {/* Key status metrics */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30">
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block mb-1">Local Seed State</span>
                          <span className={`font-mono font-bold ${isSecure ? 'text-teal-500' : 'text-red-400'}`}>
                            {isSecure ? 'ENTROPY_HIGH' : 'NO_KEYSTORE'}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg border border-neutral-200 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30">
                          <span className="text-[10px] text-neutral-400 dark:text-zinc-500 block mb-1">E2E Status</span>
                          <span className={`font-mono font-bold ${isSecure ? 'text-teal-500' : 'text-red-400'}`}>
                            {isSecure ? 'SHA256_ACTIVE' : 'DEACTIVATED'}
                          </span>
                        </div>
                      </div>

                      {/* Animated cryptographic key stream */}
                      <div className="p-3 rounded-lg bg-neutral-900 dark:bg-black border border-neutral-800 text-[10px] font-mono text-zinc-400 space-y-1">
                        <div className="flex justify-between border-b border-zinc-800 pb-1 text-[9px] text-zinc-500 font-bold">
                          <span>EPHEMERAL_KEY_HEX</span>
                          <span>STRENGTH: 256BIT</span>
                        </div>
                        <p className="break-all text-[9px] text-teal-400/80 leading-relaxed font-bold">
                          {isSecure 
                            ? 'f3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' 
                            : 'CONNECTION_OFFLINE_KEYS_CLEARED_SECURELY'}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-neutral-500 dark:text-zinc-400 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${isSecure ? 'bg-teal-500' : 'bg-red-500'}`} />
                      <span>
                        {isSecure 
                          ? 'Zero-Knowledge local keys active. Network requests cannot parse messages.' 
                          : 'Core deactivated. Message caches wiped completely.'}
                      </span>
                    </div>
                  </div>
                )}

              </div>

              {/* Interactive Footer */}
              <div className="px-4 py-2 bg-neutral-100/50 dark:bg-zinc-900/50 border-t border-neutral-200/60 dark:border-zinc-800/60 flex items-center justify-between text-[10px] text-neutral-500 dark:text-zinc-500">
                <span>SUGORA v1.0.0-ALPHA</span>
                <span className="font-mono">BUILD: 2026_JUL_01</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
