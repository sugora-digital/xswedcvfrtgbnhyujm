import React from 'react';
import { Sun, Moon, Monitor, Shield, ArrowUpRight, Globe, Github } from 'lucide-react';
import { useTheme } from './ThemeContext';

export default function Footer() {
  const { theme, setTheme } = useTheme();

  const sections = [
    {
      title: 'Decentralized Suite',
      links: [
        { name: 'Sovereign Messaging', href: '#features' },
        { name: 'Built-in AI assistant', href: '#sugora-ai' },
        { name: 'Crystal voice calls', href: '#features' },
        { name: 'Sovereign Communities', href: '#features' }
      ]
    },
    {
      title: 'Verifiable Security',
      links: [
        { name: 'Advanced Encryption', href: '#privacy' },
        { name: 'Strict Zero Tracking', href: '#privacy' },
        { name: 'On-device Sandbox', href: '#privacy' },
        { name: 'Cryptographic Audits', href: '#features' }
      ]
    },
    {
      title: 'Architectural blue',
      links: [
        { name: 'Developer Hub', href: '#download' },
        { name: 'Active Roadmap', href: '#roadmap' },
        { name: 'PWA Installation', href: '#download' },
        { name: 'Common Inquiries', href: '#faq' }
      ]
    }
  ];

  return (
    <footer id="about" className="bg-white dark:bg-neutral-950 border-t border-neutral-200/50 dark:border-neutral-900/50 pt-20 pb-24 transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic background trace */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-600/5 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer columns split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-200/60 dark:border-neutral-900">
          
          {/* Brand presentation column */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/10">
                <span className="text-white text-base font-black">S</span>
              </div>
              <span className="text-xl font-black tracking-tight text-neutral-900 dark:text-white">
                Sugora
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed max-w-sm">
              Sugora is a modern, fast, and completely sovereign digital communication platform designed to bypass corporate server telemetry. Fully verifiable, secure, and local-first.
            </p>

            {/* Public profiles */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sugora"
                target="_blank"
                rel="noreferrer"
                className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-all cursor-pointer"
                title="GitHub Repositories"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <div className="h-9 w-9 rounded-xl border border-neutral-200 dark:border-neutral-850 flex items-center justify-center text-neutral-400 dark:text-neutral-600 cursor-not-allowed">
                <Globe className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>

          {/* Nav Links column links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {sections.map((sec, idx) => (
              <div key={idx} className="space-y-4 text-left">
                <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-widest">
                  {sec.title}
                </h4>
                <ul className="space-y-3">
                  {sec.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white font-medium transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom copyright and Theme selections */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left space-y-1 font-medium text-xs text-neutral-400 dark:text-neutral-500">
            <p>© {new Date().getFullYear()} Sugora Labs Inc. All rights reserved.</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-300 dark:text-neutral-600">
              Zero-knowledge sharding transit nodes compliant
            </p>
          </div>

          {/* Theme Selector triggers */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 dark:border-neutral-800 w-fit mx-auto md:mx-0 shadow-sm">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((item) => {
              const active = theme === item.id;
              return (
                <button
                  id={`footer-theme-${item.id}`}
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    active
                      ? 'bg-white dark:bg-neutral-950 text-blue-600 dark:text-cyan-400 shadow-md'
                      : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </footer>
  );
}
