import React, { useState, useEffect } from 'react';
import { Smartphone, Laptop, Download, Monitor, CheckCircle, Apple, AlertCircle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CrossPlatform() {
  const [activePlatform, setActivePlatform] = useState<'web' | 'mobile' | 'desktop'>('web');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);

  useEffect(() => {
    // Listen for the native browser install trigger
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Manual instruction fallback
      alert("Progressive Web App (PWA) Install Guide:\n\n1. For iOS/Safari: Click the 'Share' icon and choose 'Add to Home Screen'.\n2. For Android/Chrome: Click the 3 dots in the top right and select 'Install app'.\n3. For Desktop: Click the install icon in the address bar.");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to PWA prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallSuccess(true);
      setTimeout(() => setShowInstallSuccess(false), 5000);
    }
  };

  const platforms = [
    {
      id: 'web',
      name: 'Sugora Web Core',
      status: 'available',
      description: 'Run the platform natively inside any compliant modern browser. Full local sharded cache support included.',
      badge: 'Zero Download',
      icon: Laptop
    },
    {
      id: 'mobile',
      name: 'Sugora iOS & Android',
      status: 'beta',
      description: 'Fully isolated native binaries featuring local hardware key sandboxing. Notifications operate over sharded push lines.',
      badge: 'Beta Active',
      icon: Smartphone
    },
    {
      id: 'desktop',
      name: 'Sugora Desktop Engine',
      status: 'coming-soon',
      description: 'High-performance desktop shell for macOS, Windows, and Linux. Built directly with native system keystore integrations.',
      badge: 'Coming Soon',
      icon: Monitor
    }
  ];

  return (
    <section id="download" className="py-20 md:py-28 bg-neutral-50 dark:bg-zinc-900/50 border-y border-neutral-200/50 dark:border-zinc-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Platform selection tabs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                PWA &amp; Cross Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Sovereign communication on <span className="brand-gradient-text">every device</span>.
              </h2>
              <p className="text-sm text-neutral-600 dark:text-zinc-400 leading-relaxed font-medium">
                Sugora is lightweight by design. Our PWA architecture allows you to compile, run, and pin the messaging workspace directly onto your phone, laptop, or desktop without passing through centralized corporate app stores.
              </p>
            </div>

            {/* Platform interactive tabs */}
            <div className="space-y-3">
              {platforms.map((plat) => {
                const isActive = activePlatform === plat.id;
                const Icon = plat.icon;
                return (
                  <button
                    id={`platform-tab-${plat.id}`}
                    key={plat.id}
                    onClick={() => setActivePlatform(plat.id as any)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-white border-neutral-300 dark:bg-zinc-950 dark:border-zinc-800 shadow-md'
                        : 'bg-neutral-100/50 border-neutral-150 hover:bg-white dark:bg-zinc-900/10 dark:border-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-teal-500/10 text-teal-600' : 'bg-neutral-200 text-neutral-600 dark:bg-zinc-850 dark:text-zinc-400'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">
                          {plat.name}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-zinc-400">
                          {plat.description.substring(0, 75)}...
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      plat.status === 'available'
                        ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20'
                        : plat.status === 'beta'
                        ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20'
                        : 'bg-neutral-200 text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {plat.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive PWA Install Panel */}
          <div className="lg:col-span-6">
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800/80 shadow-2xl flex flex-col justify-between relative overflow-hidden h-[420px]">
              
              {/* Radial Accent background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-teal-500/5 blur-2xl pointer-events-none" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-500">PWA CORE MODULE READY</span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Pin Sugora directly to your home screen
                </h3>

                <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed font-medium">
                  By installing the Sugora Progressive Web App, you bypass third-party platforms entirely. Enjoy native window launching, offline capability, push status pings, and hardware sandboxing instantly.
                </p>

                {/* Benefits List */}
                <div className="space-y-2 py-2">
                  {[
                    'Instant compilation directly in browser sandboxes',
                    'Basic offline storage (loads from local worker cache)',
                    'Symmetric hardware encryption key protection',
                    'Zero app-store telemetry or tracking scripts'
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-neutral-600 dark:text-zinc-300">
                      <CheckCircle className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Install Trigger Button */}
              <div className="pt-4 border-t border-neutral-100 dark:border-zinc-850">
                <AnimatePresence mode="wait">
                  {showInstallSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs rounded-xl flex items-center gap-2 font-bold"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Installation success! Sugora launcher added to your hardware menu.
                    </motion.div>
                  ) : (
                    <motion.button
                      id="pwa-install-trigger"
                      onClick={handleInstallClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                    >
                      <Download className="h-4 w-4" />
                      <span>{isInstalled ? 'App Already Pin Installed' : 'Install Sugora Web PWA'}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </AnimatePresence>
                <p className="text-[10px] text-center text-neutral-400 dark:text-zinc-500 mt-2 font-medium">
                  Compatible with Chrome, Safari, Edge, and iOS/Android systems.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
