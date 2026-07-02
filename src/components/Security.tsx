import React, { useState } from 'react';
import { 
  Shield, Lock, EyeOff, Radio, Cpu, CheckCircle2, 
  ChevronRight, Terminal, Sparkles, Database 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Security() {
  const [activePillar, setActivePillar] = useState<'encryption' | 'privacy' | 'security' | 'tracking' | 'architecture'>('encryption');

  const pillars = [
    {
      id: 'encryption',
      title: 'Advanced Cryptographic Encryption',
      shortTitle: 'Encryption',
      tag: 'AES-GCM-256',
      description: 'Your communication is sealed with double-ratchet threshold cryptography. Messages, files, and call packets are encrypted locally before transmission and cannot be decoded by any middle-hop node routers.',
      icon: Lock,
      color: 'text-blue-500',
      bgGlow: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'privacy',
      title: 'Absolute Sovereign Privacy',
      shortTitle: 'Privacy',
      tag: 'Zero-ID',
      description: 'Sugora requires no phone numbers, email addresses, or personal credentials to sign up. Your identity is represented entirely by a localized, cryptographically random public-key address.',
      icon: EyeOff,
      color: 'text-purple-500',
      bgGlow: 'from-purple-500/10 to-transparent'
    },
    {
      id: 'security',
      title: 'Hardware-Grade Security',
      shortTitle: 'Security',
      tag: 'Sandboxed',
      description: 'The Sugora application executes inside isolated operating system memory sandboxes. Stale message traces and temporary media caches are instantly wiped out of physical device RAM upon closing.',
      icon: Shield,
      color: 'text-cyan-500',
      bgGlow: 'from-cyan-500/10 to-transparent'
    },
    {
      id: 'tracking',
      title: 'Strict Zero Tracking',
      shortTitle: 'Zero Tracking',
      tag: 'No Telemetry',
      description: 'We do not maintain marketing tracking codes, device identifiers, or interaction logs. Sugora has zero awareness of who you are, when you connect, or who you communicate with.',
      icon: Radio,
      color: 'text-rose-500',
      bgGlow: 'from-rose-500/10 to-transparent'
    },
    {
      id: 'architecture',
      title: 'Transparent Verifiable Architecture',
      shortTitle: 'Transparent Core',
      tag: '100% Open Source',
      description: 'Our entire compiler source code is open and reproducible. Any security researcher or organization can verify that our client binary builds contain no backdoors or hidden database reporting tools.',
      icon: Cpu,
      color: 'text-emerald-500',
      bgGlow: 'from-emerald-500/10 to-transparent'
    }
  ];

  const activeData = pillars.find(p => p.id === activePillar)!;

  return (
    <section id="privacy" className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Visual background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] bg-purple-500/5 dark:bg-purple-600/5 blur-[130px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/10 uppercase tracking-widest">
            Privacy Focus
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Designed for privacy. <br />
            Protected by <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">impenetrable shields</span>.
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            Sugora doesn't ask you to trust a corporate privacy policy. We protect your conversations using mathematics and hardware isolation, rendering surveillance technically impossible.
          </p>
        </div>

        {/* Pillars split grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Large shield illustration */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[400px]">
            
            {/* Interactive shield representation using layered vectors */}
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Outer rotating security ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-neutral-300 dark:border-neutral-800 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-6 rounded-full border border-neutral-200 dark:border-neutral-900" />
              
              {/* Holographic orbital particles */}
              <div className="absolute top-8 left-12 h-3.5 w-3.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="absolute bottom-12 right-16 h-3.5 w-3.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Central Vector Shield illustration */}
              <div className="relative z-10 w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                    <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="10" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Backdrop Glow shield */}
                  <path d="M100 20 C100 20 155 35 155 80 C155 130 100 170 100 170 C100 170 45 130 45 80 C45 35 100 20 100 20 Z" 
                        fill="url(#shieldGrad)" opacity="0.15" filter="url(#shieldGlow)" />

                  {/* Outer Main Shield outline */}
                  <path d="M100 25 C100 25 150 38 150 80 C150 125 100 162 100 162 C100 162 50 125 50 80 C50 38 100 25 100 25 Z" 
                        stroke="url(#shieldGrad)" strokeWidth="4" strokeLinecap="round" />

                  {/* Inner protective core */}
                  <path d="M100 40 C100 40 135 50 135 80 C135 115 100 145 100 145 C100 145 65 115 65 80 C65 50 100 40 100 40 Z" 
                        fill="url(#shieldGrad)" opacity="0.35" />

                  {/* Central Interlocking Star node */}
                  <circle cx="100" cy="85" r="16" fill="#ffffff" filter="url(#shieldGlow)" />
                  <circle cx="100" cy="85" r="8" fill="#3b82f6" />
                </svg>

                {/* Secure Floating Glass Cards overlaying the shield */}
                <div className="absolute -top-4 -right-2 p-3 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">AES-GCM Authenticated</span>
                </div>

                <div className="absolute -bottom-2 -left-4 p-3 bg-white/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-blue-500 shrink-0 animate-bounce" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">Zero Logging Policy</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Side: Pillars interaction list */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
              Core Privacy Pillars
            </div>

            <div className="grid grid-cols-1 gap-3">
              {pillars.map((pil) => {
                const isActive = activePillar === pil.id;
                const IconComp = pil.icon;
                return (
                  <button
                    id={`privacy-pillar-${pil.id}`}
                    key={pil.id}
                    onClick={() => setActivePillar(pil.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${
                      isActive 
                        ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-lg' 
                        : 'bg-white/40 dark:bg-neutral-900/10 border-neutral-200/60 dark:border-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900/30'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${
                      isActive 
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-neutral-900 dark:text-white">{pil.shortTitle}</span>
                        <span className="text-[9px] font-bold bg-neutral-200/50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-md">
                          {pil.tag}
                        </span>
                      </div>
                      
                      {isActive && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium pt-1">
                          {pil.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Transparent Architecture Highlight box */}
            <div className="p-4.5 bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-900 rounded-2xl flex items-center gap-3">
              <Database className="h-5 w-5 text-purple-500 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-neutral-900 dark:text-white block">Complete Database Erasure</span>
                <span className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">Sugora contains no central account files, meaning we hold nothing to yield, compromise, or leak.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
