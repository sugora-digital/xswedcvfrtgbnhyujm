import React, { useState, useEffect } from 'react';
import { Cpu, Brain, Sparkles, MessageSquareCode, ShieldAlert, ArrowRight, Play, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIPreview() {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const prompts = [
    {
      id: 'summarize',
      label: 'Summarize core-stream',
      short: 'Summarize',
      fullPrompt: 'Analyze #system-core-stream and compile key architectural milestones.',
      response: 'SUGORA_LOCAL_AI // SUMMARY:\n- HANDSHAKE: Websocket client connection secure.\n- CORE LATENCY: Settled at 4ms across decentralized shards.\n- SAFETY SCORE: 100% compliant. No data leaks detected.'
    },
    {
      id: 'decrypt',
      label: 'Inspect log entropy',
      short: 'Entropy',
      fullPrompt: 'Query local ephemeral logs and calculate active entropy levels.',
      response: 'SUGORA_LOCAL_AI // ENTROPY REPORT:\n- EPHEMERAL SEEDS: Active (256-bit strength).\n- PHYSICAL MEMORY: Fully isolated sandbox active.\n- STATUS: High entropy verified. Automatic purge set for 60 seconds.'
    },
    {
      id: 'action',
      label: 'Draft security release',
      short: 'Release Notes',
      fullPrompt: 'Draft a cryptographic verification change-log for Github.',
      response: 'SUGORA_LOCAL_AI // DRAFT GITHUB RELEASE:\n- Feat: Added local zero-knowledge signature handshakes.\n- Refactor: Decoupled client storage indices from server routers.\n- Sec: Purged stale active sessions older than 5 minutes.'
    }
  ];

  useEffect(() => {
    if (!selectedPrompt) return;
    
    setIsTyping(true);
    setDisplayedResponse('');
    
    const targetResponse = prompts.find(p => p.id === selectedPrompt)?.response || '';
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < targetResponse.length) {
        setDisplayedResponse(prev => prev + targetResponse[currentIndex]);
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [selectedPrompt]);

  return (
    <section id="ai-preview" className="py-20 md:py-28 bg-neutral-50 dark:bg-zinc-900/50 border-y border-neutral-200/50 dark:border-zinc-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Pitch */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/10 text-xs font-semibold">
              <Cpu className="h-3.5 w-3.5" />
              <span>Phase 2 Blueprint: Sovereign AI</span>
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Private Intelligence. <span className="brand-gradient-text">Zero Cloud Latency</span>.
            </h2>
            
            <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
              We reject remote API telemetry. In Phase 2, Sugora introduces a custom, 100% local LLM compiled straight into your local application binary. 
            </p>
            
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/80 text-xs text-left">
              <h4 className="font-bold text-neutral-800 dark:text-zinc-300 flex items-center gap-1.5 mb-1">
                <Brain className="h-4 w-4 text-teal-500" />
                The Zero-Leak AI Promise
              </h4>
              <p className="text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
                Your chats are never parsed or uploaded to train commercial models. AI reasoning compiles directly on-device using WebGPU and hardware accelerators.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <button
                id="ai-waitlist-btn"
                onClick={() => {
                  const element = document.querySelector('#cta-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer"
              >
                Sign up for Beta Sandbox
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right Side: Interactive Mock Screen */}
          <div className="lg:col-span-7">
            <div className="glass-panel-heavy rounded-2xl border border-neutral-200/80 dark:border-zinc-800/80 shadow-2xl overflow-hidden">
              
              {/* Mock Header */}
              <div className="px-4 py-3 border-b border-neutral-200/60 dark:border-zinc-800/60 bg-neutral-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-indigo-500" />
                  <span className="font-mono text-xs text-neutral-800 dark:text-zinc-300 font-bold">SUGORA_INTELLIGENCE_BLUEPRINT.EXE</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded font-bold">COMING SOON</span>
              </div>

              {/* Console Body */}
              <div className="p-4 space-y-4">
                <p className="text-[11px] text-neutral-500 dark:text-zinc-400 font-mono">
                  // CLICK A DIRECTIVE TO SIMULATE LOCAL DECENTRALIZED ANALYSIS:
                </p>

                {/* Prompt choices row */}
                <div className="flex flex-wrap gap-2">
                  {prompts.map((prompt) => (
                    <button
                      id={`ai-prompt-btn-${prompt.id}`}
                      key={prompt.id}
                      onClick={() => setSelectedPrompt(prompt.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        selectedPrompt === prompt.id
                          ? 'bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/10'
                          : 'bg-white hover:bg-neutral-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-neutral-600 dark:text-zinc-300 border-neutral-200 dark:border-zinc-800'
                      }`}
                    >
                      {prompt.short}
                    </button>
                  ))}
                </div>

                {/* Output Screen */}
                <div className="h-48 rounded-xl bg-neutral-950 border border-neutral-900 p-4 font-mono text-xs text-zinc-300 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-30" />

                  <div className="relative z-10 space-y-3">
                    {selectedPrompt ? (
                      <>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
                          <span>PROMPT: {prompts.find(p => p.id === selectedPrompt)?.fullPrompt}</span>
                        </div>
                        <pre className="text-emerald-400 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                          {displayedResponse}
                          {isTyping && <span className="inline-block h-3.5 w-1.5 bg-emerald-400 ml-1 animate-pulse" />}
                        </pre>
                      </>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 py-6 space-y-2">
                        <Sparkles className="h-6 w-6 text-indigo-500/40 animate-pulse" />
                        <p className="text-[11px]">Select an offline prompt command above to see local response models operate.</p>
                      </div>
                    )}
                  </div>

                  {selectedPrompt && !isTyping && (
                    <div className="text-[10px] text-zinc-500 text-right font-mono flex items-center justify-end gap-1.5 border-t border-zinc-900 pt-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                      <span>SUGORA_LOCAL_ENGINE_COMPLETE</span>
                    </div>
                  )}
                </div>

              </div>
              
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
