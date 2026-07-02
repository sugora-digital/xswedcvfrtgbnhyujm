import React, { useState } from 'react';
import { 
  MessageSquare, Bot, Phone, Video, Users, Globe, 
  Download, Cpu, RefreshCw, Shield, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any | null>(null);

  const featuresList = [
    {
      id: 'messaging',
      title: 'Sovereign Messaging',
      description: 'End-to-end encrypted messaging designed on peer-to-peer architecture. Messages are fully protected, self-purging, and completely owned by you.',
      icon: MessageSquare,
      badge: 'Local-First',
      color: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/10'
    },
    {
      id: 'ai-assistant',
      title: 'Built-in AI Assistant',
      description: 'A sovereign smart companion capable of translating, summarizing, coding, and generating responses locally or via zero-knowledge remote compute.',
      icon: Bot,
      badge: 'Cognitive',
      color: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/10'
    },
    {
      id: 'voice-calls',
      title: 'Crystal Clear Voice Calls',
      description: 'Ultra-low latency VoIP calls using the high-fidelity Opus codec. Automatically routed through the closest distributed nodes to bypass packet loss.',
      icon: Phone,
      badge: '320kbps HD',
      color: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/10'
    },
    {
      id: 'video-calls',
      title: 'Sovereign Video Calls',
      description: 'High-definition 1080p peer-to-peer video streaming. Background separation and lighting algorithms execute strictly on device.',
      icon: Video,
      badge: 'E2E Streaming',
      color: 'from-pink-500 to-pink-600',
      glow: 'shadow-pink-500/10'
    },
    {
      id: 'groups',
      title: 'Encrypted Groups',
      description: 'Private multi-user channels with independent group keys. Group configurations are stored strictly within the devices of the active participants.',
      icon: Users,
      badge: 'Zero-Trace',
      color: 'from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/10'
    },
    {
      id: 'communities',
      title: 'Sovereign Communities',
      description: 'Host interactive, large-scale communities without a central corporate server. Set dynamic roles, custom moderation systems, and permissions.',
      icon: Globe,
      badge: 'Decentralized',
      color: 'from-indigo-500 to-indigo-600',
      glow: 'shadow-indigo-500/10'
    },
    {
      id: 'file-sharing',
      title: 'Distributed File Transfer',
      description: 'Share files of unlimited size. Files are sharded, encrypted locally, and transferred over direct high-speed peer streams.',
      icon: Download,
      badge: 'P2P Transfer',
      color: 'from-cyan-500 to-cyan-600',
      glow: 'shadow-cyan-500/10'
    },
    {
      id: 'search',
      title: 'Zero-Knowledge Search',
      description: 'Instantly find messages or media. Your search query is indexed locally and matched cryptographically without ever revealing text to outer nodes.',
      icon: Cpu,
      badge: 'Smart Index',
      color: 'from-teal-500 to-teal-600',
      glow: 'shadow-teal-500/10'
    },
    {
      id: 'device-sync',
      title: 'Cross Device Syncing',
      description: 'Real-time delta synchronization across phone, tablet, and desktop. New devices register securely via hardware cryptographic handshakes.',
      icon: RefreshCw,
      badge: 'Vanguard Sync',
      color: 'from-red-500 to-red-600',
      glow: 'shadow-red-500/10'
    }
  ];

  return (
    <section id="features" className="py-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 border border-blue-500/10 uppercase tracking-widest">
            Complete Suite
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Everything you expect, <br />
            engineered with <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">uncompromising sovereignty</span>.
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            Sugora doesn't sacrifice productivity for security. We provide a full array of state-of-the-art communication tools, completely decoupled from corporate telemetry and central databases.
          </p>
        </div>

        {/* 9-Grid Features Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feat, index) => {
            const isHovered = hoveredCard === feat.id;
            const IconComp = feat.icon;
            return (
              <motion.div
                id={`feature-card-${feat.id}`}
                key={feat.id}
                onMouseEnter={() => setHoveredCard(feat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedFeature(feat)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`group relative p-8 rounded-3xl border text-left cursor-pointer transition-all duration-300 overflow-hidden ${
                  isHovered
                    ? 'bg-white dark:bg-neutral-900 border-neutral-300/80 dark:border-neutral-800 shadow-2xl transform -translate-y-1'
                    : 'bg-white/40 dark:bg-neutral-900/30 border-neutral-200/60 dark:border-neutral-900/60 shadow-sm'
                }`}
              >
                {/* Accent hover glow effect inside the card */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-neutral-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Icon Column & Badge Row */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-lg ${feat.glow} transform group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-neutral-200/50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                    {feat.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium mb-6">
                  {feat.description}
                </p>

                {/* Learn More link */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Architecture</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Audit Callout with Beautiful Custom Inline Details state (No alerts!) */}
        <div className="mt-20 p-8 rounded-3xl border border-neutral-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/10">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-extrabold text-neutral-900 dark:text-white">Active Cryptographic Audit Protocol</h4>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 font-medium">Sugora's security libraries are entirely open-source, mathematically proven, and verifiable on GitHub.</p>
            </div>
          </div>
          <button
            id="features-audit-link"
            className="w-full md:w-auto px-6 py-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-white border border-neutral-300 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-950 dark:hover:bg-neutral-800 hover:border-neutral-950 dark:hover:border-neutral-700 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            onClick={() => {
              setSelectedFeature({
                title: "Cryptographic Audit Blueprint",
                description: "Our core sharding and end-to-end handshake engines compile under isolated reproducible builds. Anyone can review, compile, and run our serverless routing client independently on any platform. Code audits, zero-knowledge tests, and full cryptographic blueprints are stored in the /src/components folder for direct developer exploration.",
                badge: "Open-Source Hub",
                color: "from-purple-600 to-blue-600"
              });
            }}
          >
            Review Audit Blueprint
          </button>
        </div>

        {/* Feature Modal Detail view (Replaces old window.alert usage) */}
        <AnimatePresence>
          {selectedFeature && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-md">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-white dark:bg-neutral-950 rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl relative overflow-hidden"
              >
                {/* Background color blob */}
                <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 blur-2xl rounded-full" />
                
                <button 
                  id="close-feature-modal"
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-6 right-6 h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-950/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-6 text-left">
                  <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-full border border-blue-500/10">
                    {selectedFeature.badge}
                  </span>
                  
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-white">
                    {selectedFeature.title}
                  </h3>

                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                    {selectedFeature.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-2">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Security Protocol status</span>
                    <span className="block text-xs font-black text-green-500 dark:text-green-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      Active / Mathematically Audited
                    </span>
                  </div>

                  <button
                    id="modal-acknowledge"
                    onClick={() => setSelectedFeature(null)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer text-center"
                  >
                    Close Verification Blueprint
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
