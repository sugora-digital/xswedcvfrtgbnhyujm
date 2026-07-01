import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AIPreview from './components/AIPreview';
import Security from './components/Security';
import CrossPlatform from './components/CrossPlatform';
import Screenshots from './components/Screenshots';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SupabasePrompt from './components/SupabasePrompt';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors duration-300">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Primary Sections */}
        <main>
          
          {/* Hero Landing & Live Wireframe */}
          <Hero />

          {/* Bento-style Core Advantage Features */}
          <Features />

          {/* Interactive Bento Wireframes */}
          <Screenshots />

          {/* Zero Knowledge handshakes */}
          <Security />

          {/* Future AI companion preview (Phase 2 plans) */}
          <AIPreview />

          {/* PWA app launcher & multiple platforms */}
          <CrossPlatform />

          {/* Frequently Asked Questions */}
          <FAQ />

          {/* Waitlist Subscription */}
          <CTA />

        </main>

        {/* Directory links, social profiles, and theme control widget */}
        <Footer />

        {/* Floating Supabase Developer Dashboard Widget */}
        <SupabasePrompt />

      </div>
    </ThemeProvider>
  );
}
