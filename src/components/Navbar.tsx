import React, { useState } from 'react';
import { Menu, X, Sun, Moon, Monitor, ChevronDown, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'AI', href: '#ai-preview' },
    { name: 'Security', href: '#security' },
    { name: 'Download', href: '#download' },
    { name: 'About', href: '#about' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <a href="#home" className="flex items-center gap-2 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 p-[1.5px] shadow-md shadow-teal-500/10 dark:shadow-teal-500/5 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-zinc-900 transition-colors">
                <svg className="h-5 w-5 fill-teal-500 text-teal-500" viewBox="0 0 512 512">
                  <path d="M 140,256 C 140,165.4 213.4,92 304,92 C 340,92 372,104 400,128 C 360,160 310,180 270,220 C 220,270 200,330 200,380 C 164,352 140,306 140,256 Z" fill="url(#navTeal)" />
                  <path d="M 372,256 C 372,346.6 298.6,420 208,420 C 180,420 150,410 120,392 C 160,360 210,340 250,300 C 300,250 320,190 320,140 C 352,170 372,210 372,256 Z" fill="url(#navPurple)" />
                  <defs>
                    <linearGradient id="navTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                    <linearGradient id="navPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-300 dark:to-indigo-300 bg-clip-text text-transparent">
              Sugora
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <button
              id={`nav-desktop-${link.name.toLowerCase()}`}
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="px-3.5 py-1.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Desktop Utilities */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Theme Dropdown Selector */}
          <div className="relative">
            <button
              id="theme-dropdown-toggle"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 hover:border-neutral-300 dark:border-zinc-800 dark:hover:border-zinc-700 bg-white/50 dark:bg-zinc-900/50 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-300 cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            
            <AnimatePresence>
              {themeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setThemeDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1 shadow-xl z-20"
                  >
                    {[
                      { name: 'Light', val: 'light', icon: Sun },
                      { name: 'Dark', val: 'dark', icon: Moon },
                      { name: 'System', val: 'system', icon: Monitor },
                    ].map((item) => (
                      <button
                        id={`theme-select-${item.val}`}
                        key={item.val}
                        onClick={() => {
                          setTheme(item.val as any);
                          setThemeDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer ${
                          theme === item.val
                            ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-300'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-zinc-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-zinc-900'
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2.5">
            <button
              id="desktop-login-button"
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-zinc-200 hover:text-neutral-950 dark:hover:text-white cursor-pointer"
              onClick={() => alert("Sugora Authentication will be fully customized in Phase 2. To request access to early test networks, join our public waitlist below!")}
            >
              Login
            </button>
            <button
              id="desktop-signup-button"
              onClick={() => {
                const element = document.querySelector('#cta-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Sign Up
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Quick theme cycle on mobile button */}
          <button
            id="mobile-theme-cycle"
            onClick={() => {
              const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
              setTheme(modes[nextIndex]);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-300 cursor-pointer"
          >
            {resolvedTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  id={`nav-mobile-${link.name.toLowerCase()}`}
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-950 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800 space-y-2">
                <button
                  id="mobile-login-button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    alert("Sugora Authentication will be fully customized in Phase 2. To request access to early test networks, join our public waitlist below!");
                  }}
                  className="block w-full text-center py-2.5 text-xs font-semibold text-neutral-700 dark:text-zinc-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-zinc-800 cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="mobile-signup-button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const element = document.querySelector('#cta-section');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="block w-full text-center py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
