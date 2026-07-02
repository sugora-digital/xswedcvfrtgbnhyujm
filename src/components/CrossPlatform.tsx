import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Laptop, Download, Monitor, CheckCircle, Apple, 
  AlertCircle, ArrowUpRight, Tablet, Layout, Check, X, Shield 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CrossPlatform() {
  const [activePlatform, setActivePlatform] = useState<'desktop' | 'mobile' | 'tablet' | 'pwa'>('desktop');
  const [showPwaGuide, setShowPwaGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show beautiful custom dialog instead of alert()
      setShowPwaGuide(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallSuccess(true);
      setTimeout(() => setShowInstallSuccess(false), 5000);
    }
  };

  const platformsList = [
    {
      id: 'desktop',
      name: 'Sugora Desktop Engine',
      supportedSystems: 'Windows, macOS, Linux',
      badge: 'Native Executable',
      description: 'Supercharged native application compiled with deep OS keystore integration and memory protection protocols.',
      icon: Monitor,
      specs: ['Direct peer sockets', 'Hardware sandbox key storage', 'Custom tray status bar']
    },
    {
      id: 'mobile',
      name: 'Sugora iOS & Android',
      supportedSystems: 'iPhone, iPad, Android Phones',
      badge: 'Mobile Package',
      description: 'Fully responsive mobile clients operating over secure sharded push notification lines to conserve device battery.',
      icon: Smartphone,
      specs: ['FaceID/Biometric lock support', 'Isolated sandboxed file drawer', 'Background threshold sync']
    },
    {
      id: 'tablet',
      name: 'Sugora Tablet Workspace',
      supportedSystems: 'iPadOS, Android Tablets',
      badge: 'Extended View',
      description: 'Multi-column workspace designed to maximize tablet real estate. Smooth transitions and flexible side panels.',
      icon: Tablet,
      specs: ['Split View multi-tasking', 'Dynamic dragging interface', 'Stylus layout annotation']
    },
    {
      id: 'pwa',
      name: 'Sugora PWA Core',
      supportedSystems: 'Chrome, Safari, Firefox, Edge',
      badge: 'Direct Launch',
      description: 'Progressive Web App that pins directly to your device screen. Bypass traditional centralized corporate app stores.',
      icon: Layout,
      specs: ['Zero local storage logs', 'Instant browser sandbox paint', 'Push status notification pings']
    }
  ];

  return (
    <section id="download" className="py-24 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300 relative overflow-hidden border-t border-neutral-200/40 dark:border-neutral-800/40">
      
      {/* Dynamic background lighting */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/5 dark:bg-blue-600/5 blur-[140px] rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/10 uppercase tracking-widest">
            Cross Platform
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
            Sovereign communication on <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">every screen, any hardware</span>.
          </h2>
          <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
            Sugora is engineered to run seamlessly across all systems. Download native binaries or pin our lightweight progressive web app to bypass restrictive centralized corporate distribution.
          </p>
        </div>

        {/* Layout split: Left device mockup, Right selection panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Beautiful Interactive Responsive Device Mockup frame */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center relative min-h-[440px]">
            
            <AnimatePresence mode="wait">
              {activePlatform === 'desktop' && (
                <motion.div 
                  key="desktop-frame"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-[500px] rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-2xl relative overflow-hidden"
                >
                  {/* Title Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60 mb-3 text-xs font-mono">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-400" />
                      <span className="h-3 w-3 rounded-full bg-amber-400" />
                      <span className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <span className="text-neutral-400 font-bold">sugora_desktop_pro.exe</span>
                    <span className="text-cyan-500 font-bold">● macOS/Windows</span>
                  </div>

                  {/* Inside Layout Mock */}
                  <div className="grid grid-cols-12 gap-3 h-[240px] rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 p-2 text-left text-xs">
                    {/* Left Sidebar */}
                    <div className="col-span-3 border-r border-neutral-200/50 dark:border-neutral-800/80 pr-2 space-y-2">
                      <div className="h-6 bg-neutral-200/60 dark:bg-neutral-800 rounded-md flex items-center px-1.5 text-[9px]">
                        Search node...
                      </div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`p-1 rounded-lg flex items-center gap-1.5 ${i===1 ? 'bg-blue-500/10 border border-blue-500/20' : ''}`}>
                          <div className="h-4 w-4 rounded-full bg-neutral-300 dark:bg-neutral-800 shrink-0" />
                          <div className="h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded w-10" />
                        </div>
                      ))}
                    </div>

                    {/* Chat stream */}
                    <div className="col-span-9 flex flex-col justify-between h-full pl-2">
                      <div className="border-b border-neutral-200/50 dark:border-neutral-800 pb-1.5 flex justify-between text-[10px] text-neutral-400">
                        <span># General Security</span>
                        <span className="text-green-500">Node Secure</span>
                      </div>
                      <div className="flex-1 py-2 space-y-2">
                        <div className="p-2 bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-lg text-[10px]">
                          <p className="font-mono text-cyan-500 text-[9px] mb-0.5">PEER_SIGNATURE: VERIFIED</p>
                          <p className="text-neutral-600 dark:text-neutral-400">All direct client routes compile securely locally.</p>
                        </div>
                      </div>
                      <div className="h-7 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg flex items-center justify-between px-2 text-[10px] text-neutral-400">
                        <span>Type secure message...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePlatform === 'mobile' && (
                <motion.div 
                  key="mobile-frame"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-[260px] aspect-[9/19] rounded-[48px] border-8 border-neutral-950 bg-white dark:bg-neutral-950 p-3 shadow-2xl relative overflow-hidden"
                >
                  {/* Camera notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-neutral-950 rounded-b-2xl z-20" />
                  
                  {/* Screen Content */}
                  <div className="h-full rounded-[36px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 p-3 flex flex-col justify-between text-left text-xs relative z-10 pt-6">
                    <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-[9px] text-blue-500">S</div>
                        <span className="font-extrabold text-[10px] text-neutral-800 dark:text-white">Sugora</span>
                      </div>
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>

                    <div className="flex-1 space-y-2 py-2">
                      <div className="p-2 bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl text-[9px]">
                        <span className="block font-bold text-blue-500 mb-0.5">Sovereign Direct Chat</span>
                        <p className="text-neutral-500 dark:text-neutral-400">Your sharded messages dissolve instantly from server routes.</p>
                      </div>
                    </div>

                    <div className="h-8 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between px-2.5 text-[9px] text-neutral-400">
                      <span>Tap to write secure...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePlatform === 'tablet' && (
                <motion.div 
                  key="tablet-frame"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-[440px] aspect-[4/3] rounded-[36px] border-[6px] border-neutral-950 bg-white dark:bg-neutral-950 p-3 shadow-2xl relative overflow-hidden"
                >
                  {/* Inside tablet interface */}
                  <div className="h-full rounded-[24px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/80 p-3.5 flex flex-col justify-between text-left text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800 pb-2">
                      <span className="font-extrabold text-xs text-neutral-800 dark:text-white">Sugora Tablet Grid</span>
                      <span className="text-[10px] font-mono text-cyan-500">Active Node Zone: EU-West</span>
                    </div>

                    <div className="flex-1 py-4 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl space-y-1">
                        <span className="font-bold text-neutral-800 dark:text-zinc-200 block text-[10px]">Secure Shard Ingestion</span>
                        <p className="text-[9px] text-neutral-500">Threshold assembly completes instantly on physical chip buffer.</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl space-y-1">
                        <span className="font-bold text-neutral-800 dark:text-zinc-200 block text-[10px]">Isolated Cache Purges</span>
                        <p className="text-[9px] text-neutral-500">Memory buffers erase thoroughly upon closing.</p>
                      </div>
                    </div>

                    <div className="h-8 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center justify-between px-3 text-[10px] text-neutral-400">
                      <span>Write secure messaging payload...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activePlatform === 'pwa' && (
                <motion.div 
                  key="pwa-frame"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-[360px] rounded-[32px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4 shadow-2xl relative overflow-hidden text-left"
                >
                  <div className="space-y-4">
                    <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded">
                      Browser Sandbox compliant
                    </span>
                    <h4 className="text-base font-black text-neutral-900 dark:text-white">Sugora PWA Launcher</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      By pinning our PWA, the browser wraps Sugora into an independent hardware Sandbox container. Bypasses corporate controls.
                    </p>

                    <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 space-y-1.5 text-[11px]">
                      <span className="font-bold text-neutral-800 dark:text-zinc-300 block">PWA Core Advantages</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>Instant localized cache compilation</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                        <span>Bypasses traditional App Store constraints</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right panel: Selector tabs list */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 px-1">
              Select Client Application
            </div>

            <div className="grid grid-cols-1 gap-3">
              {platformsList.map((plat) => {
                const isActive = activePlatform === plat.id;
                const IconComp = plat.icon;
                return (
                  <button
                    id={`platform-selector-${plat.id}`}
                    key={plat.id}
                    onClick={() => setActivePlatform(plat.id as any)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex gap-4 cursor-pointer ${
                      isActive 
                        ? 'bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 shadow-xl' 
                        : 'bg-white/40 dark:bg-neutral-900/10 border-neutral-200/60 dark:border-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900/30'
                    }`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 transition-all ${
                      isActive 
                        ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md' 
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}>
                      <IconComp className="h-5 w-5" />
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold text-neutral-900 dark:text-white">{plat.name}</span>
                        <span className="text-[9px] font-bold text-neutral-400 bg-neutral-200/50 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
                          {plat.badge}
                        </span>
                      </div>
                      <span className="block text-[10px] text-neutral-400 font-mono">{plat.supportedSystems}</span>
                      
                      {isActive && (
                        <div className="pt-2 space-y-2">
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                            {plat.description}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {plat.specs.map((spec, sIdx) => (
                              <span key={sIdx} className="text-[8px] font-bold bg-blue-500/10 text-blue-600 dark:text-cyan-400 px-2 py-0.5 rounded uppercase tracking-wider">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Downloader CTA buttons block */}
            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 flex flex-col sm:flex-row gap-4">
              <button
                id="native-download-trigger"
                className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                onClick={() => {
                  setShowPwaGuide(true);
                }}
              >
                <span>Download Client Native Binary</span>
              </button>
              
              <button
                id="pwa-install-trigger"
                className="flex-1 py-4 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 text-neutral-800 dark:text-neutral-200 font-extrabold text-xs rounded-xl shadow-sm hover:shadow-md transition-all text-center cursor-pointer"
                onClick={handleInstallClick}
              >
                <span>Install Web PWA App</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* PWA Instruction Guide popup (Replacing old window.alert fallback!) */}
      <AnimatePresence>
        {showPwaGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-neutral-950 rounded-[32px] border border-neutral-200 dark:border-neutral-800 p-8 shadow-2xl relative"
            >
              <button 
                id="close-pwa-guide"
                onClick={() => setShowPwaGuide(false)}
                className="absolute top-6 right-6 h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-white/50 dark:bg-neutral-950/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6 text-left">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 flex items-center justify-center text-cyan-500 shadow-sm">
                  <Shield className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                  PWA Installation Guide
                </h3>

                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                  Follow these instructions to pin the Sugora Web Workspace directly to your physical hardware menu:
                </p>

                <div className="space-y-3 font-medium text-xs">
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 flex gap-3">
                    <span className="font-mono font-black text-blue-500 shrink-0">01</span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      <strong>iOS / Safari:</strong> Tap the <span className="underline font-bold text-neutral-900 dark:text-white">Share</span> icon in the bottom browser menu, then select <span className="underline font-bold text-neutral-900 dark:text-white">Add to Home Screen</span>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 flex gap-3">
                    <span className="font-mono font-black text-blue-500 shrink-0">02</span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      <strong>Android / Chrome:</strong> Tap the <span className="underline font-bold text-neutral-900 dark:text-white">3 Dots menu</span> in the top right, then select <span className="underline font-bold text-neutral-900 dark:text-white">Install App</span>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 flex gap-3">
                    <span className="font-mono font-black text-blue-500 shrink-0">03</span>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      <strong>Desktop / PC:</strong> Click the <span className="underline font-bold text-neutral-900 dark:text-white">Install Launcher icon</span> in your browser's address bar.
                    </p>
                  </div>
                </div>

                <button
                  id="guide-acknowledge"
                  onClick={() => setShowPwaGuide(false)}
                  className="w-full py-4 bg-neutral-950 dark:bg-neutral-800 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer text-center"
                >
                  I Understand, Pin Launcher
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
