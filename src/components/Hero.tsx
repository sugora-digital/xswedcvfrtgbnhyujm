import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Bot, Phone, Video, Shield, Cpu, ArrowRight, 
  Download, Sparkles, Mic, Volume2, Camera, Laptop, Tablet, 
  Smartphone, Send, Globe, Users, Heart, Share2, ShieldCheck,
  CheckCircle, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { navigate } from '../lib/router';

export default function Hero() {
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'phone'>('desktop');
  const [activeFeature, setActiveFeature] = useState<'chat' | 'ai' | 'calls'>('chat');
  const [aiTypingText, setAiTypingText] = useState('');
  const [callTimer, setCallTimer] = useState('00:04');

  // Live typing animation for the AI companion mockup
  useEffect(() => {
    let index = 0;
    const fullText = "Analyzing sharded communication payload. Zero traces found. Secure communication path established via multi-hop routing.";
    
    const interval = setInterval(() => {
      setAiTypingText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        setTimeout(() => { index = 0; }, 3000); // pause and repeat
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // Timer for active call mockup
  useEffect(() => {
    let seconds = 4;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setCallTimer(`${mins}:${secs}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      
      {/* Dynamic Ambient Background Blobs */}
      <div className="absolute top-1/4 left-1/10 w-[30vw] h-[30vw] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/10 w-[35vw] h-[35vw] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[140px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/3 w-[25vw] h-[25vw] rounded-full bg-cyan-500/10 dark:bg-cyan-600/15 blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '4s' }} />

      {/* Grid line matrix for futuristic feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-20 -z-20" />

      <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Side Content */}
        <div className="lg:col-span-5 text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
          
          {/* Animated Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200/55 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/5 cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-purple-500 dark:text-cyan-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Sugora v2.0 Platform Live</span>
          </motion.div>

          {/* Premium Headline */}
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              The Future of <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Private Communication
              </span> <br />
              Powered by AI.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed"
            >
              Experience sovereign communication. Secure chat, high-fidelity voice and video calls, and a built-in AI companion. No central servers, no tracking, complete digital sovereignty.
            </motion.p>
          </div>

          {/* Call To Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <button
              id="hero-get-started"
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/20 dark:shadow-blue-500/10 transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer group"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-download"
              onClick={() => {
                const element = document.querySelector('#download');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 font-bold text-base rounded-2xl shadow-md transition-all transform hover:-translate-y-1 active:translate-y-0 cursor-pointer"
            >
              <Download className="h-5 w-5" />
              Download App
            </button>
          </motion.div>

          {/* Active Counters / Security highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 grid grid-cols-3 gap-4"
          >
            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-neutral-900 dark:text-white">100%</span>
              <span className="block text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">End-to-End</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-neutral-900 dark:text-white">Zero</span>
              <span className="block text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Log Policy</span>
            </div>
            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-neutral-900 dark:text-white">4ms</span>
              <span className="block text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Ultra-Low Latency</span>
            </div>
          </motion.div>

        </div>

        {/* Right Side Mockups Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[500px] w-full mt-8 lg:mt-0">
          
          {/* Quick Mockup Interaction Selector */}
          <div className="flex p-1.5 rounded-2xl bg-neutral-200/50 dark:bg-neutral-900/50 border border-neutral-300/30 dark:border-neutral-800/30 backdrop-blur-xl mb-6 shadow-lg z-30">
            {[
              { id: 'chat', label: 'Modern Chat', icon: MessageSquare },
              { id: 'ai', label: 'Sugora AI', icon: Bot },
              { id: 'calls', label: 'HD Voice & Video', icon: Phone },
            ].map((feat) => (
              <button
                id={`hero-tab-${feat.id}`}
                key={feat.id}
                onClick={() => setActiveFeature(feat.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeFeature === feat.id 
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-md' 
                    : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                <feat.icon className="h-4 w-4" />
                <span>{feat.label}</span>
              </button>
            ))}
          </div>

          {/* Interactive Screen Container */}
          <div className="relative w-full max-w-[620px] aspect-[4/3] flex items-center justify-center">
            
            <AnimatePresence mode="wait">
              
              {/* 1. MODERN CHAT MOCKUP VIEW */}
              {activeFeature === 'chat' && (
                <motion.div
                  key="chat-mockup"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  {/* Desktop Frame representation */}
                  <div className="absolute inset-0 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl shadow-2xl p-4 overflow-hidden flex flex-col">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-800/50">
                      <div className="flex items-center gap-1.5">
                        <span className="h-3 w-3 rounded-full bg-red-400/80" />
                        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                        <span className="h-3 w-3 rounded-full bg-green-400/80" />
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">Sharded Route: SECURE_10</span>
                      </div>
                      <Globe className="h-4 w-4 text-neutral-400" />
                    </div>

                    {/* Window Content Split */}
                    <div className="flex-1 flex overflow-hidden pt-3">
                      {/* Left Sidebar */}
                      <div className="w-1/3 border-r border-neutral-200/50 dark:border-neutral-800/50 pr-3 space-y-2.5">
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">My Channels</div>
                        {[
                          { name: 'general', active: true, unread: false },
                          { name: 'ai-collaborator', active: false, unread: true },
                          { name: 'development', active: false, unread: false }
                        ].map((chan) => (
                          <div 
                            key={chan.name}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-all ${
                              chan.active 
                                ? 'bg-blue-600/10 text-blue-600 dark:bg-cyan-500/15 dark:text-cyan-400' 
                                : 'text-neutral-500 dark:text-neutral-400'
                            }`}
                          >
                            <span># {chan.name}</span>
                            {chan.unread && <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />}
                          </div>
                        ))}
                      </div>

                      {/* Messaging Stream */}
                      <div className="flex-1 pl-4 flex flex-col justify-between h-full">
                        <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
                          <div className="flex gap-2 text-left">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xs">A</div>
                            <div className="flex-1 bg-neutral-100 dark:bg-neutral-900/60 p-3 rounded-2xl rounded-tl-none border border-neutral-200/40 dark:border-neutral-800/40">
                              <span className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">Alex Mercer</span>
                              <p className="text-xs text-neutral-600 dark:text-neutral-300">Has anyone reviewed the decentralization sharding proposal? The sync latency is absolutely incredible.</p>
                            </div>
                          </div>
                          <div className="flex gap-2 text-left flex-row-reverse">
                            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-black text-xs">M</div>
                            <div className="flex-1 bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none shadow-md">
                              <span className="block text-[10px] font-bold text-purple-200 mb-1">You</span>
                              <p className="text-xs">Yes! It is down to 4ms average locally. We are running end-to-end ZK handshakes directly inside the client sandbox.</p>
                            </div>
                          </div>
                        </div>

                        {/* Text Field Input Mock */}
                        <div className="pt-2">
                          <div className="flex gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-2 items-center">
                            <input 
                              disabled 
                              type="text" 
                              placeholder="Send encrypted payload..." 
                              className="flex-1 bg-transparent border-none text-xs focus:outline-none px-2 text-neutral-500 dark:text-neutral-400" 
                            />
                            <button className="h-8 w-8 bg-blue-600 dark:bg-cyan-500 rounded-xl flex items-center justify-center text-white shadow-md">
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Floating glass overlay details */}
                  <div className="absolute -bottom-4 -left-4 p-3.5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">End-to-End Chat</span>
                      <span className="block text-xs font-black text-neutral-900 dark:text-white">AES-GCM Authenticated</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. SUGORA AI VIEW */}
              {activeFeature === 'ai' && (
                <motion.div
                  key="ai-mockup"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  {/* Tablet Frame representation */}
                  <div className="absolute inset-x-4 inset-y-2 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-2xl shadow-2xl p-5 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-800/50">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600 dark:text-cyan-400 animate-pulse" />
                        <span className="text-xs font-black text-neutral-900 dark:text-white">Sugora AI Assistant</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">COGNITIVE_READY</span>
                      </div>
                    </div>

                    {/* AI Visual Interface */}
                    <div className="flex-1 flex flex-col justify-between pt-4 overflow-hidden">
                      <div className="space-y-4">
                        {/* User Question */}
                        <div className="flex gap-3 text-left">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-bold text-xs">U</div>
                          <div className="flex-1 bg-white dark:bg-neutral-900/50 p-3 rounded-2xl rounded-tl-none border border-neutral-200/30 dark:border-neutral-850">
                            <p className="text-xs text-neutral-600 dark:text-neutral-300">How do you secure peer-to-peer data packet routing?</p>
                          </div>
                        </div>

                        {/* AI typing response */}
                        <div className="flex gap-3 text-left">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="flex-1 bg-white/50 dark:bg-neutral-900/80 p-3.5 rounded-2xl rounded-tl-none border border-neutral-200/40 dark:border-neutral-800/40 min-h-[80px]">
                            <p className="text-xs text-neutral-700 dark:text-neutral-200 font-mono leading-relaxed">
                              {aiTypingText}
                              <span className="inline-block w-1.5 h-3 bg-cyan-400 ml-1 animate-pulse" />
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Interactive AI Quick Actions */}
                      <div className="grid grid-cols-3 gap-2.5 pt-3">
                        {['Summarize Chat', 'Analyze Code', 'Translate Audio'].map((action) => (
                          <div key={action} className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-purple-500 dark:hover:border-cyan-400 text-center cursor-pointer transition-all">
                            <span className="block text-[10px] font-bold text-neutral-600 dark:text-neutral-300">{action}</span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Floating dynamic status */}
                  <div className="absolute top-1/4 -right-2 p-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl flex items-center gap-2.5 animate-pulse">
                    <Zap className="h-4 w-4 text-purple-500 animate-bounce" />
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Inference Latency</span>
                      <span className="block text-xs font-black text-neutral-900 dark:text-white">&lt; 150ms total</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. HD CALLS VIEW */}
              {activeFeature === 'calls' && (
                <motion.div
                  key="calls-mockup"
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full relative"
                >
                  {/* Phone Frame representation */}
                  <div className="absolute inset-y-0 mx-auto w-[280px] rounded-[36px] border-[6px] border-neutral-800 dark:border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden flex flex-col justify-between">
                    
                    {/* Top Speaker / Notch */}
                    <div className="h-6 bg-neutral-950 w-full flex justify-center items-center">
                      <div className="w-16 h-3.5 bg-neutral-900 rounded-full" />
                    </div>

                    {/* Active call body */}
                    <div className="flex-1 bg-gradient-to-b from-neutral-900 via-slate-900 to-neutral-950 p-5 flex flex-col justify-between text-center relative">
                      
                      {/* Secure Call indicator */}
                      <div className="flex justify-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                          <Shield className="h-3 w-3" />
                          256-Bit Link
                        </span>
                      </div>

                      {/* Caller Info */}
                      <div className="space-y-3 pt-6">
                        <div className="relative inline-block">
                          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-500 p-[2px] mx-auto animate-pulse">
                            <div className="h-full w-full rounded-full bg-neutral-900 flex items-center justify-center text-white text-xl font-bold">
                              EL
                            </div>
                          </div>
                          {/* Microphone pulse */}
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-cyan-400 flex items-center justify-center text-neutral-950 shadow-md">
                            <Mic className="h-3 w-3" />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-white">Elena Rostova</h4>
                          <p className="text-[10px] text-neutral-400">Voice Quality // 320kbps Opus</p>
                        </div>
                      </div>

                      {/* Simulated Voice wave graph */}
                      <div className="flex justify-center items-center gap-1.5 h-12">
                        {[4, 10, 8, 12, 16, 20, 14, 18, 10, 6, 8, 14, 18, 10, 4].map((h, i) => (
                          <motion.span 
                            key={i} 
                            animate={{ height: [h, h * 1.5, h * 0.5, h] }} 
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.05 }} 
                            className="w-1 bg-gradient-to-t from-blue-500 via-cyan-400 to-purple-500 rounded-full"
                            style={{ height: h }}
                          />
                        ))}
                      </div>

                      {/* Timer */}
                      <span className="text-xs font-mono text-neutral-300">{callTimer}</span>

                      {/* Action buttons bar */}
                      <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-800/50">
                        <button className="h-10 w-10 rounded-full bg-neutral-850 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer">
                          <Volume2 className="h-4.5 w-4.5" />
                        </button>
                        <button className="h-10 w-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center cursor-pointer">
                          <Phone className="h-4.5 w-4.5 rotate-[135deg]" />
                        </button>
                        <button className="h-10 w-10 rounded-full bg-neutral-850 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer">
                          <Camera className="h-4.5 w-4.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* Absolute overlay details */}
                  <div className="absolute bottom-6 -right-4 p-4 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl flex items-center gap-3 animate-bounce">
                    <Video className="h-5 w-5 text-purple-500" />
                    <div className="text-left">
                      <span className="block text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Ultra High Definition</span>
                      <span className="block text-xs font-black text-neutral-900 dark:text-white">Crystal Clear VoIP</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

        </div>

      </div>

    </section>
  );
}
