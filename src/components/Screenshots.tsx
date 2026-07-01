import React, { useState } from 'react';
import { MessageSquare, Shield, Activity, HardDrive, Search, User, Lock, CheckCheck, MapPin, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function Screenshots() {
  const [selectedDemoTab, setSelectedDemoTab] = useState<'threads' | 'nodes' | 'shards'>('threads');

  return (
    <section className="py-20 md:py-28 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            Interface Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Designed for <span className="brand-gradient-text">Absolute Visual Precision</span>.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
            Explore the wireframe blueprints of Sugora's custom messaging dashboard. Clean lines, lightweight DOM components, and a zero-distraction layout configured for focus.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1 (Large 8-cols): Interactive Interface Shell */}
          <div className="lg:col-span-8 glass-panel border border-neutral-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden min-h-[420px] flex flex-col justify-between">
            
            {/* Header tab selectors */}
            <div className="px-6 py-4 border-b border-neutral-200/60 dark:border-zinc-800/60 bg-neutral-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-pulse" />
                sugora_interface_blueprint.dxf
              </span>
              
              <div className="flex bg-neutral-200/50 dark:bg-zinc-850/50 rounded-lg p-0.5 text-xs font-bold">
                {[
                  { id: 'threads', label: 'Threads Layout' },
                  { id: 'nodes', label: 'Peer Nodes' },
                  { id: 'shards', label: 'Shard Splitting' }
                ].map((tab) => (
                  <button
                    id={`blueprint-demo-tab-${tab.id}`}
                    key={tab.id}
                    onClick={() => setSelectedDemoTab(tab.id as any)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${selectedDemoTab === tab.id ? 'bg-white dark:bg-zinc-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Workspace Viewports */}
            <div className="flex-1 p-6 flex items-center justify-center bg-neutral-50/30 dark:bg-zinc-900/10">
              
              {/* THREADS VIEW MOCKUP */}
              {selectedDemoTab === 'threads' && (
                <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl overflow-hidden flex h-[280px]">
                  <div className="w-1/3 border-r border-neutral-150 dark:border-zinc-850 p-3 space-y-2">
                    <div className="h-7 bg-neutral-100 dark:bg-zinc-900 rounded-md flex items-center px-2">
                      <Search className="h-3 w-3 text-neutral-400 mr-1.5" />
                      <div className="h-2 w-12 bg-neutral-300 dark:bg-zinc-800 rounded" />
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`p-2 rounded-lg flex items-center gap-2 ${i === 1 ? 'bg-teal-500/10 border border-teal-500/20' : ''}`}>
                        <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-zinc-800 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className={`h-2.5 rounded ${i === 1 ? 'bg-teal-500/60 w-16' : 'bg-neutral-300 dark:bg-zinc-800 w-12'}`} />
                          <div className="h-2 bg-neutral-200 dark:bg-zinc-900 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-900 pb-2">
                        <div className="h-3 w-20 bg-neutral-300 dark:bg-zinc-800 rounded" />
                        <div className="h-2 w-8 bg-neutral-200 dark:bg-zinc-900 rounded" />
                      </div>
                      <div className="space-y-1.5 text-xs text-neutral-600 dark:text-zinc-400">
                        <div className="p-2.5 bg-neutral-50 dark:bg-zinc-900/50 border border-neutral-100 dark:border-zinc-850 rounded-lg">
                          <p className="font-mono text-[10px] text-teal-500 mb-1">NODE_HANDSHAKE: OK</p>
                          <p className="font-mono text-[11px]">Sovereign payload compilation complete.</p>
                        </div>
                        <div className="p-2.5 bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/10 rounded-lg self-end ml-12">
                          <p className="font-mono text-[11px] text-teal-600 dark:text-teal-400">Recipient key signature validated on-device.</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-7 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-md flex items-center justify-between px-3">
                      <span className="text-[10px] text-neutral-400">Payload input disabled in demo...</span>
                      <CheckCheck className="h-3.5 w-3.5 text-teal-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* PEER NODES VIEW MOCKUP */}
              {selectedDemoTab === 'nodes' && (
                <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl p-4 h-[280px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs font-extrabold text-neutral-900 dark:text-white">Active Distributed Gateways</span>
                    </div>
                    <span className="font-mono text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold">14 ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { region: 'us-east-1', ip: '142.250.72.14', latency: '4ms' },
                      { region: 'eu-west-3', ip: '216.58.212.110', latency: '12ms' },
                      { region: 'ap-east-1', ip: '172.217.161.46', latency: '8ms' }
                    ].map((node, i) => (
                      <div key={i} className="p-3 rounded-lg border border-neutral-200 dark:border-zinc-850 bg-neutral-50/50 dark:bg-zinc-900/30 text-xs font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-700 dark:text-zinc-300">{node.region}</span>
                          <span className="h-2 w-2 rounded-full bg-teal-500" />
                        </div>
                        <p className="text-[10px] text-neutral-400">{node.ip}</p>
                        <p className="text-[10px] text-teal-500 font-bold">PING: {node.latency}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-indigo-500/5 rounded-lg border border-indigo-500/10 text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                    // Routing consensus checks are cryptographic, ensuring complete packet integrity across zones.
                  </div>
                </div>
              )}

              {/* SHARD SPLITTING VIEW MOCKUP */}
              {selectedDemoTab === 'shards' && (
                <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 rounded-xl p-4 h-[280px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-900 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-teal-500" />
                      <span className="text-xs font-extrabold text-neutral-900 dark:text-white">Active Cryptographic Key Shard Indices</span>
                    </div>
                    <span className="font-mono text-[9px] bg-teal-500/10 text-teal-500 px-1.5 py-0.5 rounded font-bold">SHAMIR_SCHEME_ACTIVE</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { index: '0x3F1A', status: 'SHARD_PINNED_US', path: 'ipfs://QmYwAP...F8w9' },
                      { index: '0x9B4E', status: 'SHARD_PINNED_EU', path: 'ipfs://QmTzBH...B7w2' }
                    ].map((shard, i) => (
                      <div key={i} className="p-2.5 rounded-lg border border-neutral-200 dark:border-zinc-850 bg-neutral-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-neutral-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-neutral-600 dark:text-zinc-400">
                            #{i+1}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800 dark:text-zinc-200">{shard.index}</p>
                            <p className="text-[10px] text-neutral-400">{shard.path}</p>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-teal-500">{shard.status}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-neutral-400 dark:text-zinc-500 font-mono text-center">
                    Requires a minimum threshold of <span className="font-bold text-neutral-800 dark:text-zinc-300">2 shards</span> to reassemble.
                  </div>
                </div>
              )}

            </div>

            {/* Footer metric labels */}
            <div className="px-6 py-3 border-t border-neutral-200/60 dark:border-zinc-800/60 bg-neutral-50/30 dark:bg-zinc-900/50 flex items-center justify-between text-[11px] text-neutral-500 dark:text-zinc-400">
              <span className="font-semibold text-neutral-700 dark:text-zinc-300">Sugora Vector Wireframe Workspace</span>
              <span className="font-mono font-bold">100% SCALE_VECTOR</span>
            </div>

          </div>

          {/* Card 2 (Small 4-cols): Core System Performance Specs */}
          <div className="lg:col-span-4 p-6 bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-200 dark:border-zinc-800/80 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500 shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Performance Specs</h3>
                  <p className="text-xs text-neutral-500 dark:text-zinc-400">Real-time compilation telemetry</p>
                </div>
              </div>

              {/* Performance indicators */}
              <div className="space-y-4">
                {[
                  { label: 'Core Transit Latency', val: '4ms', desc: 'Global node cluster ping rates' },
                  { label: 'Security Handshake', val: '256-bit', desc: 'Dynamic seed generation strength' },
                  { label: 'Database Ingestion', val: '0.00s', desc: 'No remote file server indexing buffers' },
                  { label: 'Local Memory Cache', val: 'Wiped', desc: 'Active memory sandbox protection' }
                ].map((spec, idx) => (
                  <div key={idx} className="border-b border-neutral-200/50 dark:border-zinc-850 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-neutral-700 dark:text-zinc-300">{spec.label}</span>
                      <span className="text-xs font-mono font-extrabold text-teal-500">{spec.val}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 dark:text-zinc-500 mt-0.5">{spec.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-850 text-[11px] leading-relaxed text-neutral-500 dark:text-zinc-400 mt-6">
              <span className="font-bold text-neutral-800 dark:text-zinc-300 block mb-1">Architectural Standard:</span>
              Sugora is engineered on decoupled React components and local state stores, resulting in instant navigation paint times and zero loading spinners.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
