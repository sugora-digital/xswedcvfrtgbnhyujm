import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Monitor, ArrowRight, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { navigate } from '../lib/router';
import { motion, AnimatePresence } from 'motion/react';
import { supabaseClient } from '../lib/supabase';

interface NavbarProps {
  currentUser?: any;
  userRole?: string | null;
}

export default function Navbar({ currentUser, userRole }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();


  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {

      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'AI', href: '#sugora-ai' },
    { name: 'Security', href: '#privacy' },
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
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 dark:bg-neutral-950/70 backdrop-blur-xl border-b border-neutral-200/40 dark:border-neutral-800/40 py-3 shadow-lg shadow-neutral-900/5 dark:shadow-black/20' 
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-cyan-500 p-[1.5px] shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-white dark:bg-neutral-900 transition-colors">
                <svg className="h-6 w-6" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Custom inline vector optimized for navbar */}
                  <circle cx="256" cy="256" r="150" fill="url(#navGlow)" opacity="0.15" />
                  <path d="M 170,300 C 130,220 180,140 256,140 C 320,140 370,180 370,230 C 370,300 300,320 256,360 C 200,410 180,420 170,420 C 130,420 120,380 170,300 Z" fill="url(#navCyan)" opacity="0.95" />
                  <path d="M 342,212 C 382,292 332,372 256,372 C 192,372 142,332 142,282 C 142,212 212,192 256,152 C 312,102 332,92 342,92 C 382,92 392,132 342,212 Z" fill="url(#navBlue)" opacity="0.95" />
                  <path d="M 210,210 C 240,170 272,170 302,210 C 332,250 332,270 302,310 C 272,350 240,350 210,310 C 180,270 180,250 210,210 Z" fill="url(#navPurple)" />
                  <circle cx="256" cy="256" r="20" fill="#ffffff" />
                  <circle cx="256" cy="256" r="10" fill="#3b82f6" />
                  <defs>
                    <linearGradient id="navBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="navPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="navCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2dd4bf" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <linearGradient id="navGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
              Sugora
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              id={`nav-desktop-${link.name.toLowerCase()}`}
              key={link.name}
              onClick={() => handleLinkClick(link.href)}
              className="px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-xl hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-all cursor-pointer"
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
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/60 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-900/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Moon className="h-4.5 w-4.5 text-blue-400" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
            </button>
            
            <AnimatePresence>
              {themeDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setThemeDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-36 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-lg p-1.5 shadow-xl z-20"
                  >
                    {[
                      { name: 'Light', val: 'light', icon: Sun, color: 'text-amber-500' },
                      { name: 'Dark', val: 'dark', icon: Moon, color: 'text-blue-400' },
                      { name: 'System', val: 'system', icon: Monitor, color: 'text-neutral-400' },
                    ].map((item) => (
                      <button
                        id={`theme-select-${item.val}`}
                        key={item.val}
                        onClick={() => {
                          setTheme(item.val as any);
                          setThemeDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer ${
                          theme === item.val
                            ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300'
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                        {item.name}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <>
                {userRole === 'Admin' && (
                  <button
                    id="desktop-admin-dashboard-button"
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="h-4 w-4 text-teal-500" />
                    <span>Admin DB</span>
                  </button>
                )}
                {userRole === 'Support' && (
                  <button
                    id="desktop-support-dashboard-button"
                    onClick={() => navigate('/support/dashboard')}
                    className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="h-4 w-4 text-teal-500" />
                    <span>Support DB</span>
                  </button>
                )}
                <button
                  id="desktop-chats-button"
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Shard Chats</span>
                </button>
                <button
                  id="desktop-logout-button"
                  onClick={() => supabaseClient.auth.signOut()}
                  className="p-2 rounded-xl text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  id="desktop-login-button"
                  className="px-4 py-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 rounded-xl transition-all cursor-pointer"
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
                <button
                  id="desktop-signup-button"
                  onClick={() => navigate('/register')}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Sign Up
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick theme cycle on mobile button */}
          <button
            id="mobile-theme-cycle"
            onClick={() => {
              const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const nextIndex = (modes.indexOf(theme) + 1) % modes.length;
              setTheme(modes[nextIndex]);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-300 cursor-pointer"
          >
            {resolvedTheme === 'dark' ? <Moon className="h-4.5 w-4.5 text-blue-400" /> : <Sun className="h-4.5 w-4.5 text-amber-500" />}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>


      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: '-100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-[72px] left-0 right-0 border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 overflow-hidden z-50 md:hidden"
            >

            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  id={`nav-mobile-${link.name.toLowerCase()}`}
                  key={link.name}
                  onClick={() => handleLinkClick(link.href)}
                  className="block w-full text-left px-3 py-2.5 text-sm font-semibold text-neutral-600 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                {currentUser ? (
                  <>
                    {userRole === 'Admin' && (
                      <button
                        id="mobile-admin-dashboard-button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/admin/dashboard');
                        }}
                        className="block w-full text-center py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-teal-500" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    {userRole === 'Support' && (
                      <button
                        id="mobile-support-dashboard-button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/support/dashboard');
                        }}
                        className="block w-full text-center py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5 text-teal-500" />
                        <span>Support Dashboard</span>
                      </button>
                    )}
                    <button
                      id="mobile-chats-button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/chat');
                      }}
                      className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer flex items-center justify-center gap-1"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Go to Shard Chats</span>
                    </button>
                    <button
                      id="mobile-logout-button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        supabaseClient.auth.signOut();
                      }}
                      className="block w-full text-center py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg border border-dashed border-red-500/30 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Exit sovereign node</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="mobile-login-button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="block w-full text-center py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                    >
                      Login
                    </button>
                    <button
                      id="mobile-signup-button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/register');
                      }}
                      className="block w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg shadow-md cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
