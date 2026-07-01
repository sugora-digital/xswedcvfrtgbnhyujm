import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Server, Laptop, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Security() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Local Cryptographic Salt',
      description: 'The app combines high-entropy hardware noise with your private seed to create unique, dynamic encryption salts right inside your device memory.',
      icon: Key,
      badge: 'Step 1: Input Entropy'
    },
    {
      title: 'Local-First Shard Splitting',
      description: 'Your message is encrypted locally with AES-GCM 256. It is then physically split into mathematical shards using custom threshold schemes.',
      icon: Lock,
      badge: 'Step 2: Client Sharding'
    },
    {
      title: 'Decentralized Ingestion Routing',
      description: 'The sharded packets traverse independent nodes. No individual node ever receives enough shards to read or rebuild any part of the original message.',
      icon: Server,
      badge: 'Step 3: Multi-Route Transit'
    },
    {
      title: 'On-Device Zero-Knowledge Assembly',
      description: 'Only the recipient device holds the private keys required to query, pull, and assemble the threshold shards back into clear-text.',
      icon: ShieldCheck,
      badge: 'Step 4: Secure Decryption'
    }
  ];

  return (
    <section id="security" className="py-20 md:py-28 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Step details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                End-to-End Absolute Zero Knowledge
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                How Sugora keeps your logs <span className="brand-gradient-text">100% invisible</span> to third parties.
              </h2>
              <p className="text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
                Unlike traditional "secure" messengers that store encrypted databases on central servers (which are highly vulnerable to government subpoenas and corporate leaks), Sugora fragments chats across transient nodes. Click through the architectural flow below:
              </p>
            </div>

            {/* List of steps */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isActive = activeStep === idx;
                const Icon = step.icon;
                return (
                  <button
                    id={`security-step-btn-${idx}`}
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full text-left p-4 rounded-xl border flex gap-4 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-neutral-50 border-neutral-300 dark:bg-zinc-900 dark:border-zinc-800 shadow-md'
                        : 'bg-white border-neutral-150 hover:bg-neutral-50/50 dark:bg-zinc-950/20 dark:border-zinc-900'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-teal-500/10 text-teal-600' : 'bg-neutral-100 text-neutral-500 dark:bg-zinc-900'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 dark:text-zinc-500 tracking-wider">
                          {step.badge}
                        </span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-ping" />
                        )}
                      </div>
                      <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white mt-0.5">
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="text-xs text-neutral-600 dark:text-zinc-400 mt-1.5 leading-relaxed font-medium">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Visual Interactive Pipeline Animation */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-zinc-900/40 border border-neutral-200/60 dark:border-zinc-800/60 h-[480px] flex flex-col justify-between overflow-hidden relative">
              
              {/* Background Network Graphic Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] opacity-60 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-zinc-800/60 pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-zinc-500">
                    Live Packets Compilation Preview
                  </h4>
                  <span className="text-[9px] font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded font-bold">ACTIVE_ENCRYPTION_SHELL</span>
                </div>

                {/* Pipeline visualizer animation block */}
                <div className="space-y-4 py-4">
                  {/* Step 1 Visual */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${activeStep === 0 ? 'bg-teal-500/5 border-teal-500/30' : 'bg-white/40 dark:bg-zinc-950/20 border-transparent opacity-60'}`}>
                    <Key className={`h-5 w-5 ${activeStep === 0 ? 'text-teal-500' : 'text-neutral-400'}`} />
                    <div className="flex-1 text-xs">
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-zinc-500">SOURCE: CLIENT_NODE_01</span>
                      <p className="font-bold text-neutral-800 dark:text-zinc-200">Ephemeral Salt Generated: <code className="font-mono text-[10px] text-teal-500">2d6a78...</code></p>
                    </div>
                    {activeStep >= 0 && <Check className="h-4 w-4 text-teal-500" />}
                  </div>

                  {/* Step 2 Visual */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${activeStep === 1 ? 'bg-teal-500/5 border-teal-500/30' : 'bg-white/40 dark:bg-zinc-950/20 border-transparent opacity-60'}`}>
                    <Lock className={`h-5 w-5 ${activeStep === 1 ? 'text-teal-500' : 'text-neutral-400'}`} />
                    <div className="flex-1 text-xs">
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-zinc-500">CIPHER: AES-GCM_256</span>
                      <p className="font-bold text-neutral-800 dark:text-zinc-200">Sharding: Split payload into <code className="font-mono text-[10px] text-teal-500">3 distributed fragments</code></p>
                    </div>
                    {activeStep >= 1 && <Check className="h-4 w-4 text-teal-500" />}
                  </div>

                  {/* Step 3 Visual */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${activeStep === 2 ? 'bg-teal-500/5 border-teal-500/30' : 'bg-white/40 dark:bg-zinc-950/20 border-transparent opacity-60'}`}>
                    <Server className={`h-5 w-5 ${activeStep === 2 ? 'text-teal-500' : 'text-neutral-400'}`} />
                    <div className="flex-1 text-xs">
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-zinc-500">TRANSIT: 3 INDEPENDENT NODES</span>
                      <p className="font-bold text-neutral-800 dark:text-zinc-200">Routing shards across: <code className="font-mono text-[10px] text-teal-500">US-EAST, EU-WEST, AS-EAST</code></p>
                    </div>
                    {activeStep >= 2 && <Check className="h-4 w-4 text-teal-500" />}
                  </div>

                  {/* Step 4 Visual */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${activeStep === 3 ? 'bg-teal-500/5 border-teal-500/30' : 'bg-white/40 dark:bg-zinc-950/20 border-transparent opacity-60'}`}>
                    <ShieldCheck className={`h-5 w-5 ${activeStep === 3 ? 'text-teal-500' : 'text-neutral-400'}`} />
                    <div className="flex-1 text-xs">
                      <span className="font-mono text-[10px] text-neutral-400 dark:text-zinc-500">RECIPIENT: AUTHENTICATED</span>
                      <p className="font-bold text-neutral-800 dark:text-zinc-200">Assembly: Recompiled plain-text verified locally.</p>
                    </div>
                    {activeStep >= 3 && <Check className="h-4 w-4 text-teal-500" />}
                  </div>
                </div>
              </div>

              {/* Secure Legend */}
              <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-[10px] font-mono text-zinc-400">
                <AlertCircle className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200 block mb-0.5">SECURITY CRITERIA VERIFIED</span>
                  Sugora nodes do not retain packet content logs. Any unauthorized database eavesdropping yields only random cryptographically isolated noise blocks.
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
