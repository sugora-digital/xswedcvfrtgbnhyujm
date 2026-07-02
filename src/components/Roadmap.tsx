import React, { useState } from 'react';
import { 
  MessageSquare, Bot, Phone, Globe, Briefcase, Sparkles, CheckCircle, 
  Clock, ArrowRight, ShieldCheck, Cpu, Check 
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Roadmap() {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  const roadmapPhases = [
    {
      phase: 1,
      title: 'Sovereign Messaging Core',
      status: 'completed',
      statusText: 'Active / Deployed',
      icon: MessageSquare,
      color: 'border-emerald-500 text-emerald-500 bg-emerald-500/10',
      description: 'The foundation of the Sugora mesh net.',
      milestones: [
        'End-to-End double ratchet encryption protocol',
        'Decentralized local sharding core storage engine',
        'Direct peer-to-peer websocket transit socket channels',
        'Local key derivation compiled sandbox implementation'
      ]
    },
    {
      phase: 2,
      title: 'Decentralized Cognitive Core',
      status: 'active',
      statusText: 'In Active Alpha',
      icon: Bot,
      color: 'border-blue-500 text-blue-500 bg-blue-500/10',
      description: 'Private offline LLM and reasoning parameters.',
      milestones: [
        'Local WebGPU inference acceleration framework',
        'Zero-leak code editing and translation helpers',
        'High-speed thread compression summarization indexing',
        'Isolated on-device diffusion image rendering model'
      ]
    },
    {
      phase: 3,
      title: 'Sovereign Voice & Video Calls',
      status: 'upcoming',
      statusText: 'Q3 2026 Target',
      icon: Phone,
      color: 'border-purple-500 text-purple-500 bg-purple-500/10',
      description: 'HD real-time calling with zero tracking logs.',
      milestones: [
        'High-fidelity Opus codec voice lines implementation',
        'Direct sharded P2P video stream channels routing',
        'Hardware background filter isolation algorithm',
        'Dynamic packet routing bypass systems setup'
      ]
    },
    {
      phase: 4,
      title: 'Decentralized Communities',
      status: 'upcoming',
      statusText: 'Q4 2026 Target',
      icon: Globe,
      color: 'border-cyan-500 text-cyan-500 bg-cyan-500/10',
      description: 'Host large groups without central databases.',
      milestones: [
        'Federated multi-user node channels development',
        'Decentralized consensus moderation tools deployment',
        'Custom cryptographic role-based signature access',
        'Community sharded content distribution network'
      ]
    },
    {
      phase: 5,
      title: 'Enterprise Business Sovereign',
      status: 'upcoming',
      statusText: 'Q1 2027 Target',
      icon: Briefcase,
      color: 'border-rose-500 text-rose-500 bg-rose-500/10',
      description: 'Sovereign networking for companies.',
      milestones: [
        'Company private-net node installation package',
        'Advanced corporate credential delegation schemas',
        'Auditable transparency logs cryptographic proofing',
        'Seamless single-sign-on zero-knowledge integrations'
      ]
    },
    {
      phase: 6,
      title: 'The Eternal Future Sphere',
      status: 'upcoming',
      statusText: 'Long Term Vision',
      icon: Sparkles,
      color: 'border-amber-500 text-amber-500 bg-amber-500/10',
      description: 'Unlocking total visual and data liberty.',
      milestones: [
        'Fully decentralized mesh hardware routers research',
        'Quantum-resistant lattice cryptographic update',
        'Autonomous localized peer networks standard development',
        'Distributed permanent cloud file archival framework'
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Decorative lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-radial-gradient from-purple-500/5 to-transparent blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/10 uppercase tracking-widest">
            Sugora Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Our architectural timeline. <br />
            Built for the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">next century of freedom</span>.
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            We operate with absolute transparency. Here is our multi-phase blueprint to establish a truly sovereign, decentralized, and cognitive digital ecosystem.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-neutral-200 dark:border-neutral-800 max-w-4xl mx-auto pl-6 sm:pl-10 space-y-12 text-left">
          
          {roadmapPhases.map((phase, idx) => {
            const isHovered = hoveredPhase === phase.phase;
            const IconComp = phase.icon;

            return (
              <motion.div
                id={`roadmap-phase-${phase.phase}`}
                key={phase.phase}
                onMouseEnter={() => setHoveredPhase(phase.phase)}
                onMouseLeave={() => setHoveredPhase(null)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative group"
              >
                {/* Vertical timeline node indicator */}
                <div className={`absolute -left-[35px] sm:-left-[51px] top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-20 ${
                  phase.status === 'completed' 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : phase.status === 'active'
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                    : 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-400'
                }`}>
                  {phase.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : phase.status === 'active' ? (
                    <Cpu className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>

                {/* Main Card Content */}
                <div className={`p-8 rounded-[32px] border transition-all duration-300 relative overflow-hidden ${
                  isHovered
                    ? 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-300 dark:border-neutral-800 shadow-xl'
                    : 'bg-neutral-50/40 dark:bg-neutral-900/20 border-neutral-200/60 dark:border-neutral-900/40'
                }`}>
                  
                  {/* Phase header information */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/50 dark:border-neutral-800/80 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${phase.color}`}>
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                          Phase 0{phase.phase} Blueprint
                        </span>
                        <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-0.5">
                          {phase.title}
                        </h3>
                      </div>
                    </div>

                    <span className={`self-start sm:self-center text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : phase.status === 'active'
                        ? 'bg-blue-500/10 text-blue-600 animate-pulse'
                        : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                    }`}>
                      {phase.statusText}
                    </span>
                  </div>

                  {/* Pitch description */}
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mb-6">
                    {phase.description}
                  </p>

                  {/* Milestones list check */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {phase.milestones.map((milestone, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2.5">
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          phase.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                        }`}>
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed">
                          {milestone}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
