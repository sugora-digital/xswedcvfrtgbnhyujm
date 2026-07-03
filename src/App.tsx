import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { usePath, navigate } from './lib/router';
import { SignIn, SignUp, ForgotPassword, ResetPassword, VerifyEmail } from './components/Auth';
import ChatPlaceholder from './components/ChatPlaceholder';
import AdminDashboard from './components/AdminDashboard';
import SupportDashboard from './components/SupportDashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AIPreview from './components/AIPreview';
import Security from './components/Security';
import CrossPlatform from './components/CrossPlatform';
import Screenshots from './components/Screenshots';
import Roadmap from './components/Roadmap';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import SupabasePrompt from './components/SupabasePrompt';
import { supabaseClient } from './lib/supabase';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { callingStore } from './lib/callingStore';
import CallOverlay from './components/CallOverlay';

export default function App() {
  const path = usePath();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      callingStore.init(currentUser.id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function ensureUserProfile(user: any): Promise<string> {
      try {
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id);

        if (profile && profile.length > 0) {
          if (profile[0].status === 'Suspended') {
            await supabaseClient.auth.signOut();
            setCurrentUser(null);
            setUserRole(null);
            navigate('/login');
            throw new Error('Suspended');
          }
          return profile[0].role || 'User';
        } else {
          // Profile does not exist, let's create it!
          const emailLower = user.email?.toLowerCase() || '';
          const isSpecialSignup = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(emailLower);
          const username = user.user_metadata?.username || emailLower.split('@')[0] || 'user_' + Math.random().toString(36).substring(2, 7);

          let role = 'User';
          if (emailLower === 'ceo.neomcq@gmail.com' || emailLower.includes('admin')) {
            role = 'Admin';
          } else if (emailLower.includes('support')) {
            role = 'Support';
          }

          const profileData = {
            id: user.id,
            username: username.toLowerCase().trim(),
            email: emailLower,
            display_name: username,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            bio: '',
            email_verified: isSpecialSignup ? true : false,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            online_status: 'online',
            status: 'Active',
            role: role
          };

          await supabaseClient.from('profiles').insert(profileData);
          return role;
        }
      } catch (e: any) {
        if (e?.message === 'Suspended') {
          throw e;
        }
        // Fallback role on other errors
        const emailLower = user.email?.toLowerCase() || '';
        if (emailLower === 'ceo.neomcq@gmail.com' || emailLower.includes('admin')) {
          return 'Admin';
        } else if (emailLower.includes('support')) {
          return 'Support';
        }
        return 'User';
      }
    }

    async function checkAuth() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session?.user) {
          const user = data.session.user;
          setCurrentUser(user);
          
          // Try to load cached role from localStorage for instant boot
          const cachedRole = localStorage.getItem('sugora_cached_role');
          if (cachedRole) {
            setUserRole(cachedRole);
            setAuthLoading(false); // unblock instantly
          }
          
          // Do network request in background
          ensureUserProfile(user).then(role => {
            setUserRole(role);
            localStorage.setItem('sugora_cached_role', role);
            if (!cachedRole) setAuthLoading(false);
          }).catch(e => {
            console.error('ensureUserProfile error:', e);
            if (!cachedRole) setAuthLoading(false);
          });
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setAuthLoading(false);
        }
      } catch (err) {
        console.error(err);
        setAuthLoading(false);
      }
    }

    checkAuth();

    // Listen for Auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        try {
          const role = await ensureUserProfile(session.user);
          setUserRole(role);
        } catch (e) {
          console.error('ensureUserProfile change error:', e);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
      }
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [path]);

  // Handle protected route redirects
  useEffect(() => {
    if (authLoading) return;

    if (path.startsWith('/admin')) {
      if (!currentUser) {
        navigate('/login');
      }
    } else if (path.startsWith('/support')) {
      if (!currentUser) {
        navigate('/login');
      }
    } else if (path === '/chat' && !currentUser) {
      navigate('/login');
    } else if ((path === '/login' || path === '/register' || path === '/') && currentUser) {
      if (userRole === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'Support') {
        navigate('/support/dashboard');
      } else {
        navigate('/chat');
      }
    }
  }, [path, currentUser, userRole, authLoading]);

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent mx-auto" />
            <p className="text-xs text-neutral-500 dark:text-zinc-400 font-bold uppercase tracking-widest">
              Establishing Secure Handshake...
            </p>
          </div>
        </div>
      );
    }

    if (path.startsWith('/admin')) {
      if (!currentUser) return null;
      if (userRole !== 'Admin') {
        return <UnauthorizedRequired role="Admin" />;
      }
      if (path === '/admin/dashboard') {
        return <AdminDashboard />;
      }
      return <AdminDashboard />;
    }

    if (path.startsWith('/support')) {
      if (!currentUser) return null;
      if (userRole !== 'Support' && userRole !== 'Admin') {
        return <UnauthorizedRequired role="Support" />;
      }
      if (path === '/support/dashboard') {
        return <SupportDashboard />;
      }
      return <SupportDashboard />;
    }

    switch (path) {
      case '/login':
        return <SignIn />;
      case '/register':
        return <SignUp />;
      case '/forgot-password':
        return <ForgotPassword />;
      case '/reset-password':
        return <ResetPassword />;
      case '/verify-email':
        return <VerifyEmail />;
      case '/chat':
        return currentUser ? <ChatPlaceholder /> : null;
      default:
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 selection:bg-teal-500/30 selection:text-teal-900 dark:selection:text-teal-200 transition-colors duration-300">
            {/* Navigation Bar */}
            <Navbar currentUser={currentUser} userRole={userRole} />

            {/* Primary Sections */}
            <main>
              {/* SECTION 2: Hero Landing & Live Wireframe */}
              <Hero />

              {/* SECTION 3: Trusted Platform (Animated Statistics) */}
              <Screenshots />

              {/* SECTION 4: Bento-style Core Advantage Features */}
              <Features />

              {/* SECTION 5: Future AI companion preview (Phase 2 plans) */}
              <AIPreview />

              {/* SECTION 6: Zero Knowledge handshakes & Privacy */}
              <Security />

              {/* SECTION 7: PWA app launcher & multiple platforms */}
              <CrossPlatform />

              {/* SECTION 8: Active product roadmap */}
              <Roadmap />

              {/* SECTION 9: Frequently Asked Questions */}
              <FAQ />

              {/* SECTION 10: Waitlist Subscription & Sign Up / Sign In Grid */}
              <CTA currentUser={currentUser} userRole={userRole} />
            </main>

            {/* SECTION 11: Directory links, social profiles, and theme control widget */}
            <Footer />

            {/* Floating Supabase Developer Dashboard Widget */}
            <SupabasePrompt />
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      {renderContent()}
      <CallOverlay />
    </ThemeProvider>
  );
}

function UnauthorizedRequired({ role }: { role: string }) {
  const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/60 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="inline-flex p-4 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
            Unauthorized Access
          </h1>
          <p className="text-sm text-neutral-500 dark:text-zinc-400 leading-relaxed font-sans">
            You do not have permission to view this resource. Access is strictly restricted to {role} users only.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={handleReturn}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Workspace</span>
          </button>
        </div>
      </div>
    </div>
  );
}
