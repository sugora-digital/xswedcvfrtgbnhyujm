import React, { useState } from 'react';
import { Shield, Zap, Layers, RefreshCw, Smartphone, Key, Globe, EyeOff, ServerCrash } from 'lucide-react';
import { motion } from 'motion/react';
import { Feature } from '../types';

export default function Features() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const features: Feature[] = [
    {
      id: 'quantum-sharding',
      title: 'Quantum Sharding',
      description: 'Your messages are divided into highly encrypted, distributed memory fragments. No complete database exists on any single hardware server.',
      iconName: 'Shield',
      badge: 'Decentralized'
    },
    {
      id: 'sovereign-storage',
      title: 'Sovereign Local Escrow',
      description: 'Your private key never leaves your physical device processor. We utilize zero-knowledge mathematics to authenticate queries safely.',
      iconName: 'Key',
      badge: 'Self-Custody'
    },
    {
      id: 'hyper-sync',
      title: 'Vanguard Sync Engine',
      description: 'Real-time state verification across multiple devices using custom delta compression. Experience 4ms message synchronization rates.',
      iconName: 'Zap',
      badge: 'Ultra-Fast'
    },
    {
      id: 'ephemeral-logs',
      title: 'Zero-Trace Ephemerality',
      description: 'Automatic physical cache purge schedules. Sharded log traces dissolve from node routers immediately after verification.',
      iconName: 'EyeOff',
      badge: 'Safe Cache'
    },
    {
      id: 'failover-mesh',
      title: 'Peer-to-Peer Mesh Failover',
      description: 'No single server outages. If centralized gateways disconnect, Sugora seamlessly routes transient keys over active P2P local nodes.',
      iconName: 'Globe',
      badge: 'Anti-Fragile'
    },
    {
      id: 'hardware-isolation',
      title: 'Isolated Hardware Sandboxing',
      description: 'Full sandbox compilation of active chat environments. Protects sensitive memory buffers from root processes or screenshot interceptors.',
      iconName: 'Layers',
      badge: 'Secure App'
    }
  ];

  // Helper to map string to Icon component
  const getIcon = (name: string, isHovered: boolean) => {
    const cls = `h-6 w-6 transition-transform duration-300 ${isHovered ? 'scale-110 text-teal-500' : 'text-indigo-500 dark:text-indigo-400'}`;
    switch (name) {
      case 'Shield': return <Shield className={cls} />;
      case 'Key': return <Key className={cls} />;
      case 'Zap': return <Zap className={cls} />;
      case 'EyeOff': return <EyeOff className={cls} />;
      case 'Globe': return <Globe className={cls} />;
      case 'Layers': return <Layers className={cls} />;
      default: return <Shield className={cls} />;
    }
  };

  return (
    <section id="features" className="py-20 md:py-28 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Vanguard Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Engineering a Communication Network that belongs exclusively to <span className="brand-gradient-text">you</span>.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
            We ripped apart the traditional corporate client-server database topology. Sugora introduces an original, decentralized messaging engine engineered around local ownership, zero compromises, and complete visual clarity.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const isHovered = hoveredCard === feat.id;
            return (
              <motion.div
                id={`feature-card-${feat.id}`}
                key={feat.id}
                onMouseEnter={() => setHoveredCard(feat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isHovered
                    ? 'bg-neutral-50 border-neutral-300 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg'
                    : 'bg-neutral-50/50 border-neutral-200 dark:bg-zinc-900/30 dark:border-zinc-900'
                }`}
              >
                {/* Icon & Badge row */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-all ${isHovered ? 'bg-teal-500/10' : 'bg-neutral-100 dark:bg-zinc-850'}`}>
                    {getIcon(feat.iconName, isHovered)}
                  </div>
                  {feat.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {feat.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2 transition-colors duration-200 group-hover:text-teal-500">
                  {feat.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Informative Security Accent Callout */}
        <div className="mt-16 p-6 rounded-2xl border border-neutral-200/60 dark:border-zinc-800 bg-neutral-50/30 dark:bg-zinc-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-white">Active Cryptographic Audit Protocol</h4>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-0.5">Sugora's core encryption library is completely open-source, reproducible, and verifiable on GitHub.</p>
            </div>
          </div>
          <button
            id="features-audit-link"
            className="w-full md:w-auto px-4 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-950 dark:text-zinc-300 dark:hover:text-white border border-neutral-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 transition-colors cursor-pointer"
            onClick={() => alert("Verification codes and build checklists are ready in our open GitHub repositories! Clone the architectural blueprints in the footer.")}
          >
            Review Audit Blueprint
          </button>
        </div>

      </div>
    </section>
  );
}
