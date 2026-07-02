import React from 'react';
import { Sun, Moon, Monitor, Shield, Terminal, ArrowUpRight, Globe, Github } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion } from 'motion/react';

export default function Footer() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const sections = [
    {
      title: 'Platform',
      links: [
        { name: 'Architecture Blueprint', href: '#features' },
        { name: 'Cryptographic Core', href: '#security' },
        { name: 'Sovereign AI Sandbox', href: '#ai-preview' },
        { name: 'PWA Web Launcher', href: '#download' }
      ]
    },
    {
      title: 'Open Source Assets',
      links: [
        { name: 'Sugora Client Repos', href: 'https://github.com/sugora/client' },
        { name: 'Reproduction Builds', href: 'https://github.com/sugora/core' },
        { name: 'Cryptographic Audits', href: '#features' },
        { name: 'Compliance Records', href: '#faq' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Sugora', href: '#about' },
        { name: 'Privacy Charter', href: '#security' },
        { name: 'Hardware Partners', href: '#features' },
        { name: 'Genesis Project', href: '#home' }
      ]
    }
  ];

  return (
    <footer id="about" className="bg-white dark:bg-zinc-950 border-t border-neutral-200/50 dark:border-zinc-900/50 pt-16 pb-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-neutral-100 dark:border-zinc-900 pb-12">
          
          {/* Logo & Bio area */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-500 p-[1.5px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-white dark:bg-zinc-900">
                  <svg className="h-4.5 w-4.5 fill-teal-500" viewBox="0 0 512 512">
                    <path d="M 140,256 C 140,165.4 213.4,92 304,92 C 340,92 372,104 400,128 C 360,160 310,180 270,220 C 220,270 200,330 200,380 C 164,352 140,306 140,256 Z" fill="url(#footerTeal)" />
                    <path d="M 372,256 C 372,346.6 298.6,420 208,420 C 180,420 150,410 120,392 C 160,360 210,340 250,300 C 300,250 320,190 320,140 C 352,170 372,210 372,256 Z" fill="url(#footerPurple)" />
                    <defs>
                      <linearGradient id="footerTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                      <linearGradient id="footerPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#4f46e5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Sugora
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-zinc-400 font-medium leading-relaxed">
              Sugora is a modern, fast, and secure communication hub designed to establish complete digital sovereignty. Our core libraries are fully auditable and local-first.
            </p>

            {/* Social Icons / Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sugora"
                className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-750 flex items-center justify-center text-neutral-500 hover:text-neutral-800 dark:text-zinc-450 dark:hover:text-white transition-colors"
                title="GitHub Repositories"
              >
                <Github className="h-4 w-4" />
              </a>
              <div className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-zinc-800 flex items-center justify-center text-neutral-400 dark:text-zinc-650 cursor-not-allowed">
                <Globe className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Quick link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-2.5">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.href.startsWith('http') ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white font-semibold transition-colors flex items-center gap-0.5"
                        >
                          {link.name}
                          <ArrowUpRight className="h-3 w-3 opacity-60" />
                        </a>
                      ) : (
                        <a
                          href={link.href}
                          className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-white font-semibold transition-colors"
                        >
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Footer legal & Theme switcher bar */}
        <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-xs text-neutral-400 dark:text-zinc-500 space-y-1 text-center md:text-left font-medium">
            <p>© {new Date().getFullYear()} Sugora Labs Inc. All rights reserved.</p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-350 dark:text-zinc-600">
              Zero-Knowledge Decentralization Core Alpha Phase 1
            </p>
          </div>

          {/* Bottom theme selector button row */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800/50 w-fit mx-auto md:mx-0">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Monitor }
            ].map((item) => {
              const active = theme === item.id;
              return (
                <button
                  id={`footer-theme-select-${item.id}`}
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    active
                      ? 'bg-white dark:bg-zinc-950 text-teal-600 dark:text-teal-400 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800 dark:text-zinc-450 dark:hover:text-zinc-200'
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
