import React, { useState, useEffect } from 'react';
import { 
  Bot, Sparkles, FileText, Code, Globe2, ClipboardList, Image as ImageIcon,
  CheckCircle2, ArrowRight, Zap, Play, Cpu, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AIPreview() {
  const [activeTab, setActiveTab] = useState<'writing' | 'coding' | 'translation' | 'summaries' | 'image'>('writing');
  const [typedOutput, setTypedOutput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiCapabilities = [
    {
      id: 'writing',
      title: 'Sovereign Writing Assistant',
      icon: FileText,
      pitch: 'Compose emails, documents, and messages directly in-chat. Refine tone, fix syntax, and draft complete reports without exposing your text to central databases.',
      input: 'Draft a professional notification explaining that Sugora now operates with 100% end-to-end local-first encryption.',
      output: 'Subject: Core System Migration: Full End-to-End Sovereignty Initiated\n\nDear Network Members,\n\nWe are pleased to confirm that your communication node has successfully updated. All chat streams, voice lines, and media sharing now execute strictly via peer-to-peer zero-knowledge channels. No data logs or personal metadata are retained.'
    },
    {
      id: 'coding',
      title: 'Secure Code Companion',
      icon: Code,
      pitch: 'An isolated coding helper compiling scripts, debugging loops, and suggesting algorithms directly inside your private workspace. Your code is never sent to a model provider.',
      input: 'Generate a TypeScript function to construct a localized cryptographic seed pair.',
      output: 'export function generateSecureSeedPair(): CryptographicKeyPair {\n  const secureBuffer = new Uint32Array(32);\n  window.crypto.getRandomValues(secureBuffer);\n  const keyIndex = deriveLocalIndex(secureBuffer);\n  return createHandshakeKeypair(keyIndex);\n}'
    },
    {
      id: 'translation',
      title: 'Zero-Knowledge Translation',
      icon: Globe2,
      pitch: 'Instant real-time message translation in over 40 languages. The translation indexes download locally, protecting multilingual chats from third-party interception.',
      input: 'Translate "Welcome to the future of decentralized networks" into Japanese.',
      output: '分散型ネットワークの未来へようこそ。\n\n[Pronunciation: Bunsan-gata nettowāku no mirai e yōkoso]'
    },
    {
      id: 'summaries',
      title: 'Deep Thread Summaries',
      icon: ClipboardList,
      pitch: 'Instantly summarize lengthy chat history threads, community updates, or meeting action items. Distills 500 messages into highly focused bullets.',
      input: 'Summarize the channel updates from today.',
      output: 'SUGORA CHAT SUMMARY (Channel: #development):\n\n1. Latency Optimization: Sync latency successfully lowered to 4.2ms.\n2. Key Exchange: On-device key derivations confirmed stable across 2.4M active nodes.\n3. Upcoming Beta: Local WebGPU LLM models entering initial alpha testing next Tuesday.'
    },
    {
      id: 'image',
      title: 'On-Device Image Creator',
      icon: ImageIcon,
      pitch: 'Generate professional illustrations, UI layout assets, or avatars locally on your device hardware utilizing optimized diffusion model parameters.',
      input: 'Generate a hyper-realistic premium neon geometric vector emblem for Sugora.',
      output: '// RENDERING CORE EMBLEM PARAMETERS...\n- Hardware acceleration: WebGPU initialized\n- Seed: 0x8F21B9\n- Image Resolution: 1024x1024 vector matrix\n- Generation Status: Complete. Asset cached in private local sandbox.'
    }
  ];

  // Typing animation loop when activeTab changes
  useEffect(() => {
    setIsTyping(true);
    setTypedOutput('');
    const targetText = aiCapabilities.find(cap => cap.id === activeTab)?.output || '';
    
    let index = 0;
    const interval = setInterval(() => {
      setTypedOutput(targetText.substring(0, index));
      index += 3; // speed up typing slightly for longer responses
      if (index >= targetText.length + 3) {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [activeTab]);

  const activeData = aiCapabilities.find(cap => cap.id === activeTab)!;

  return (
    <section id="sugora-ai" className="py-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Immersive futuristic visual grid */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-purple-500/5 dark:bg-purple-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/5 blur-[140px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/10 uppercase tracking-widest">
            <Bot className="h-4.5 w-4.5 text-purple-500 animate-pulse" />
            <span>Sugora Cognitive Core</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Sugora AI. Private Intelligence, <br />
            engineered for <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">total privacy</span>.
          </h2>
          
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            We reject remote commercial model servers that harvest user data. Sugora AI is optimized to execute locally inside on-device client sandboxes, guaranteeing zero trace leakage.
          </p>
        </div>

        {/* Layout Split: Left selection list, Right beautiful output terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Selector List and pitches */}
          <div className="lg:col-span-5 space-y-4 text-left order-2 lg:order-1">
            
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
              AI Processing Dimensions
            </div>

            <div className="space-y-3.5">
              {aiCapabilities.map((cap) => {
                const isActive = activeTab === cap.id;
                const IconComp = cap.icon;
                return (
                  <button
                    id={`ai-cap-${cap.id}`}
                    key={cap.id}
                    onClick={() => setActiveTab(cap.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex gap-4 cursor-pointer ${
                      isActive 
                        ? 'bg-white dark:bg-neutral-900 border-blue-300 dark:border-neutral-800 shadow-xl shadow-blue-500/5' 
                        : 'bg-white/40 dark:bg-neutral-900/10 border-neutral-200/50 dark:border-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900/40 hover:border-neutral-300 dark:hover:border-neutral-800'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 transition-all ${
                      isActive 
                        ? 'bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-neutral-900 dark:text-white">{cap.title}</span>
                        {cap.id === 'image' && (
                          <span className="text-[8px] font-bold bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-300 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                        {cap.pitch}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right panel: Beautiful futuristic visual terminal / illustration showing AI */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            
            {/* Holographic glowing console container */}
            <div className="relative rounded-[32px] border border-neutral-200/80 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl shadow-2xl p-6 overflow-hidden flex flex-col justify-between aspect-[4/3] w-full">
              
              {/* Mesh background grid lines overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40 -z-10" />

              {/* Console header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200/50 dark:border-neutral-800/50">
                <div className="flex items-center gap-2 text-left">
                  <span className="inline-block h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">Cognitive Processing Session</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded font-bold uppercase tracking-widest">
                    Coming Soon Badge
                  </span>
                </div>
              </div>

              {/* Live interactive prompt view */}
              <div className="flex-1 py-5 flex flex-col justify-between overflow-hidden">
                
                {/* User query mock input block */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Localized Context Input</span>
                  <div className="p-3.5 rounded-2xl bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-between">
                    <p className="text-xs font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                      &gt; {activeData.input}
                    </p>
                    <Cpu className="h-4 w-4 text-blue-500 shrink-0" />
                  </div>
                </div>

                {/* AI responding mock output block */}
                <div className="space-y-2 text-left mt-4 flex-1 flex flex-col justify-between overflow-hidden">
                  <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Secure On-Device Reasoning</span>
                  
                  <div className="flex-1 p-4 rounded-2xl bg-neutral-950 border border-neutral-900 font-mono text-xs text-zinc-300 relative overflow-y-auto leading-relaxed max-h-[160px] scrollbar-thin">
                    <p className="whitespace-pre-wrap text-[11px]">
                      {typedOutput}
                      {isTyping && <span className="inline-block h-3.5 w-1.5 bg-cyan-400 ml-0.5 animate-pulse" />}
                    </p>
                  </div>
                </div>

              </div>

              {/* Custom dynamic visualizer matching active capabilities */}
              <div className="pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-500 animate-spin" />
                  WebGPU Active Acceleration
                </span>
                <span>Inference complete // latency &lt;150ms</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
