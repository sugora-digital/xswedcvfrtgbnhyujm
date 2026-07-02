import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Globe, Shield, Radio, Server, CheckCircle2, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Screenshots() {
  const [activeNetworkZone, setActiveNetworkZone] = useState('eu');
  const [latencyText, setLatencyText] = useState('4.2ms');

  // Let's create an automated ping loop simulating live node status checks!
  useEffect(() => {
    const latencies: Record<string, string> = {
      'us': '3.8ms',
      'eu': '4.2ms',
      'ap': '7.1ms',
      'sa': '12.4ms'
    };
    
    const interval = setInterval(() => {
      const zones = ['us', 'eu', 'ap', 'sa'];
      const randomZone = zones[Math.floor(Math.random() * zones.length)];
      setActiveNetworkZone(randomZone);
      setLatencyText(latencies[randomZone]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Stats Counters
  const stats = [
    {
      id: 'users',
      label: 'Sovereign Nodes Connected',
      value: '2,482,910',
      badge: 'Active peers',
      icon: Users,
      color: 'text-blue-500',
      glow: 'from-blue-500/10 to-transparent'
    },
    {
      id: 'messages',
      label: 'Secured Messages Sent',
      value: '156,290,440',
      badge: 'Zero trace logs',
      icon: MessageSquare,
      color: 'text-purple-500',
      glow: 'from-purple-500/10 to-transparent'
    },
    {
      id: 'countries',
      label: 'Countries with Mesh Nodes',
      value: '142',
      badge: 'Global mesh',
      icon: Globe,
      color: 'text-cyan-500',
      glow: 'from-cyan-500/10 to-transparent'
    },
    {
      id: 'uptime',
      label: 'Gateway Availability',
      value: '99.999%',
      badge: 'Zero server downtime',
      icon: Shield,
      color: 'text-emerald-500',
      glow: 'from-emerald-500/10 to-transparent'
    }
  ];

  const networkNodes = [
    { name: 'US-East Gateway', code: 'us', latency: '3.8ms', status: 'Optimal' },
    { name: 'EU-West Cluster', code: 'eu', latency: '4.2ms', status: 'Optimal' },
    { name: 'AP-South Transit', code: 'ap', latency: '7.1ms', status: 'Optimal' },
    { name: 'SA-East Hub', code: 'sa', latency: '12.4ms', status: 'Optimal' }
  ];

  return (
    <section id="trusted-platform" className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Decorative grids */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-radial-gradient from-blue-500/5 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-600 dark:text-purple-300 bg-purple-500/10 border border-purple-500/10 uppercase tracking-widest">
            Trusted Platform
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white">
            Trusted by millions. <br />
            Backed by <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">verifiable cryptography</span>.
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            Sugora operates a globally sharded, peer-to-peer system that is mathematically immune to single-point server collapse. See our live decentralized network activity indices below.
          </p>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                id={`stat-card-${item.id}`}
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative overflow-hidden p-8 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-900 rounded-[32px] shadow-sm transition-all"
              >
                {/* Background glow overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${item.glow} opacity-40`} />

                {/* Stat Icon & Badge */}
                <div className="flex items-center justify-between relative z-10 mb-6">
                  <div className={`p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/50 ${item.color} shadow-sm`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-200/40 dark:bg-neutral-800/80 px-2 py-1 rounded-md">
                    {item.badge}
                  </span>
                </div>

                {/* Value & Label */}
                <div className="space-y-1 text-left relative z-10">
                  <span className="block text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-sans">
                    {item.value}
                  </span>
                  <span className="block text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Network Gateway Router status card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left panel: Live ping and route visualizer */}
          <div className="lg:col-span-8 p-8 bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200/60 dark:border-neutral-900 rounded-[32px] flex flex-col justify-between overflow-hidden relative">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/10 uppercase tracking-widest mb-1">
                  <Radio className="h-3 w-3 animate-ping" />
                  Live Shard Ping Telemetry
                </span>
                <h4 className="text-lg font-extrabold text-neutral-900 dark:text-white">Active Distributed Shard Gateway</h4>
              </div>

              {/* Ping metrics indicator */}
              <div className="flex items-center gap-4 bg-white dark:bg-neutral-950 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-800 shadow-sm">
                <Server className="h-4 w-4 text-purple-500" />
                <div className="text-left text-xs">
                  <span className="text-neutral-400 block text-[9px] uppercase font-bold tracking-wider">Zone Response</span>
                  <span className="font-mono font-black text-neutral-900 dark:text-white">{latencyText}</span>
                </div>
              </div>
            </div>

            {/* Interactive network node layout */}
            <div className="flex-1 py-8 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              
              {/* Nodes List */}
              <div className="space-y-3">
                {networkNodes.map((node) => {
                  const isActive = activeNetworkZone === node.code;
                  return (
                    <div 
                      key={node.code}
                      className={`p-4 rounded-2xl border transition-all text-left flex items-center justify-between ${
                        isActive 
                          ? 'bg-blue-600/5 border-blue-300 dark:bg-cyan-500/5 dark:border-cyan-500/40 shadow-sm shadow-blue-500/5' 
                          : 'bg-white dark:bg-neutral-950 border-neutral-200/60 dark:border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                          isActive ? 'bg-blue-500 text-white' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                        }`}>
                          {node.code}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-neutral-900 dark:text-white">{node.name}</span>
                          <span className="block text-[10px] font-mono text-neutral-400">{node.status} // Verified</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`block text-xs font-mono font-bold ${isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-neutral-400'}`}>
                          {node.latency}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[8px] font-mono text-green-500 uppercase tracking-widest font-bold">
                          <CheckCircle2 className="h-2 w-2" />
                          Online
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graphic visual network circle mapping */}
              <div className="flex items-center justify-center p-4">
                <div className="relative w-48 h-48 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800/80">
                  {/* Concentric rings */}
                  <div className="absolute w-36 h-36 rounded-full border border-neutral-200/60 dark:border-neutral-800/50" />
                  <div className="absolute w-24 h-24 rounded-full border border-dashed border-neutral-200/60 dark:border-neutral-800/30" />
                  
                  {/* Glowing central hub */}
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20">
                    S
                  </div>

                  {/* Orbital node indicators */}
                  {[
                    { style: { top: '15%', left: '25%' }, label: 'us', active: activeNetworkZone === 'us' },
                    { style: { top: '25%', right: '10%' }, label: 'eu', active: activeNetworkZone === 'eu' },
                    { style: { bottom: '20%', left: '15%' }, label: 'ap', active: activeNetworkZone === 'ap' },
                    { style: { bottom: '15%', right: '20%' }, label: 'sa', active: activeNetworkZone === 'sa' }
                  ].map((orb, i) => (
                    <div 
                      key={i} 
                      className="absolute transition-all duration-500"
                      style={orb.style}
                    >
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-black uppercase shadow-md ${
                        orb.active 
                          ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white scale-110 ring-4 ring-blue-500/25 animate-pulse' 
                          : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-400'
                      }`}>
                        {orb.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Right panel: Security / Zero server audit details */}
          <div className="lg:col-span-4 p-8 bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200/60 dark:border-neutral-900 rounded-[32px] flex flex-col justify-between">
            
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/10">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Zero Server Dependency</h4>
                  <p className="text-xs text-neutral-500">Pure Peer-to-Peer Architecture</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'Local Key Protection', text: 'Private key indices compile strictly within the secure hardware sandbox of your physical device.' },
                  { title: 'Zero Centrally Indexed Logs', text: 'Routing paths dissolve immediately after cryptographic multi-hop handshake confirms delivery.' },
                  { title: 'Dynamic Packet Routing', text: 'Sugora bypasses ISP censorship blocks by dynamically switching routing hashes every 10 seconds.' }
                ].map((item, i) => (
                  <div key={i} className="pb-4 border-b border-neutral-200/50 dark:border-neutral-800 last:border-0 last:pb-0">
                    <span className="block text-xs font-black text-neutral-900 dark:text-white mb-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {item.title}
                    </span>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 text-left">
              <span className="block text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">Sugora Network Grade</span>
              <span className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                A-GRADE VERIFIED BLUEPRINT
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
