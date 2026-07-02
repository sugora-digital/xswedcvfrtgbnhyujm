import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabase';
import { navigate } from '../lib/router';
import { useTheme } from './ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle2, 
  XCircle, Loader2, Sparkles, KeyRound, ShieldCheck, Sun, Moon, Monitor, ArrowUpRight
} from 'lucide-react';

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// Background Grid/Orbs animation
function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
      {/* Dynamic Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a12_1px,transparent_1px),linear-gradient(to_bottom,#0f172a12_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Floating Ambient Glowing Orbs */}
      <motion.div 
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-teal-500/10 dark:bg-teal-500/10 blur-3xl"
      />
      <motion.div 
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 40, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 blur-3xl"
      />
    </div>
  );
}

// Theme Selector Widget
function QuickThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  return (
    <div className="absolute top-6 right-6 flex items-center gap-1.5 p-1 rounded-xl bg-white/40 dark:bg-zinc-900/40 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm z-50">
      {[
        { val: 'light', icon: Sun, label: 'Light' },
        { val: 'dark', icon: Moon, label: 'Dark' },
        { val: 'system', icon: Monitor, label: 'System' }
      ].map((opt) => (
        <button
          key={opt.val}
          onClick={() => setTheme(opt.val as any)}
          aria-label={`Switch theme to ${opt.label}`}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            theme === opt.val
              ? 'bg-teal-500 text-white shadow-sm'
              : 'text-neutral-500 hover:text-neutral-800 dark:text-zinc-400 dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <opt.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

// Header branding
function AuthHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-8">
      <div className="cursor-pointer flex items-center gap-2 group mb-2" onClick={() => navigate('/')}>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-500 p-[1.5px] shadow-lg shadow-teal-500/10 dark:shadow-teal-500/5 transition-transform duration-300 group-hover:scale-105">
          <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-zinc-950 transition-colors">
            <svg className="h-5.5 w-5.5 fill-teal-500 text-teal-500" viewBox="0 0 512 512">
              <path d="M 140,256 C 140,165.4 213.4,92 304,92 C 340,92 372,104 400,128 C 360,160 310,180 270,220 C 220,270 200,330 200,380 C 164,352 140,306 140,256 Z" fill="url(#authTeal)" />
              <path d="M 372,256 C 372,346.6 298.6,420 208,420 C 180,420 150,410 120,392 C 160,360 210,340 250,300 C 300,250 320,190 320,140 C 352,170 372,210 372,256 Z" fill="url(#authPurple)" />
              <defs>
                <linearGradient id="authTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="authPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-300 dark:to-indigo-300 bg-clip-text text-transparent">
          Sugora
        </span>
      </div>
    </div>
  );
}

// Password Strength meter calculations
function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: '', color: 'bg-neutral-200' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score === 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
  if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
  if (score === 3) return { score: 75, label: 'Good', color: 'bg-teal-400' };
  return { score: 100, label: 'Strong', color: 'bg-teal-500' };
}

// SIGN IN VIEW
export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Restore remembered email on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sugora_remember_email');
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch (_) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // Automatically register special production accounts if they don't exist in Supabase yet!
      const emailLowerTrimmed = email.trim().toLowerCase();
      const isProductionAccount = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com'].includes(emailLowerTrimmed);
      if (error && isProductionAccount && password === '9049Iiohb@') {
        console.log('Production account login failed. Attempting silent signup...');
        const usernameMap: Record<string, string> = {
          'admin@sugora.com': 'admin_sugora',
          'support@sugora.com': 'support_sugora',
          'user1@sugora.com': 'user1_sugora'
        };

        const signUpRes = await supabaseClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              username: usernameMap[emailLowerTrimmed]
            }
          }
        });

        if (!signUpRes.error && signUpRes.data.user) {
          // Signup succeeded. Now attempt to sign in again.
          const retryRes = await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password,
          });
          if (!retryRes.error) {
            data = retryRes.data;
            error = null;
          } else {
            error = retryRes.error;
          }
        }
      }

      if (error) {
        setErrorMsg(error.message || 'Invalid email or password.');
      } else {
        // Handle Remember Me
        try {
          if (rememberMe) {
            localStorage.setItem('sugora_remember_email', email.trim());
          } else {
            localStorage.removeItem('sugora_remember_email');
          }
        } catch (_) {}

        const user = data.user;
        let userRole = 'User';

        if (user) {
          try {
            const { data: profile, error: profileErr } = await supabaseClient
              .from('profiles')
              .select('role, status')
              .eq('id', user.id);

            const emailLower = user.email?.toLowerCase() || '';
            const correctRoleMap: Record<string, string> = {
              'admin@sugora.com': 'Admin',
              'support@sugora.com': 'Support',
              'user1@sugora.com': 'User',
              'ceo.neomcq@gmail.com': 'Admin'
            };
            const expectedRole = correctRoleMap[emailLower] || 'User';

            if (profile && profile.length > 0) {
              if (profile[0].status === 'Suspended') {
                await supabaseClient.auth.signOut();
                throw new Error('This account has been suspended by an administrator.');
              }
              userRole = profile[0].role || 'User';
              
              // Enforce correct role if it doesn't match the expected role for these accounts
              if (userRole !== expectedRole) {
                userRole = expectedRole;
                await supabaseClient
                  .from('profiles')
                  .update({ role: expectedRole })
                  .eq('id', user.id);
              }
            } else {
              userRole = expectedRole;
              const isSpecial = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(emailLower);
              await supabaseClient.from('profiles').insert({
                id: user.id,
                username: user.user_metadata?.username || user.email?.split('@')[0] || 'sugora_user',
                email: user.email,
                role: userRole,
                status: 'Active',
                email_verified: isSpecial ? true : false
              });
            }
          } catch (err: any) {
            if (err.message?.includes('suspended')) {
              setErrorMsg(err.message);
              setLoading(false);
              return;
            }
            const emailLower = user.email?.toLowerCase() || '';
            const correctRoleMap: Record<string, string> = {
              'admin@sugora.com': 'Admin',
              'support@sugora.com': 'Support',
              'user1@sugora.com': 'User',
              'ceo.neomcq@gmail.com': 'Admin'
            };
            userRole = correctRoleMap[emailLower] || 'User';
          }
        }

        setSuccessMsg(`Welcome back! Authenticated as ${userRole}. Redirecting...`);
        setTimeout(() => {
          if (userRole === 'Admin') {
            navigate('/admin/dashboard');
          } else if (userRole === 'Support') {
            navigate('/support/dashboard');
          } else {
            navigate('/chat');
          }
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 transition-colors duration-300">
      <DecorativeBackground />
      <QuickThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl shadow-neutral-200/50 dark:shadow-none"
      >
        <AuthHeader />

        <div className="space-y-1 mb-6 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
            <Sparkles className="h-5 w-5 text-teal-500" />
            Sign in to Sugora
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400">
            Welcome back! Connect with your friends securely.
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
          >
            <XCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10.5 pr-4 py-2.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10.5 pr-11 py-2.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-white cursor-pointer transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me and other Options */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 dark:border-zinc-800 text-teal-500 focus:ring-teal-500"
              />
              <span className="font-semibold text-neutral-600 dark:text-zinc-400">Remember Me</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-zinc-800 text-center text-xs">
          <span className="text-neutral-500 dark:text-zinc-400">Don't have an account? </span>
          <button
            onClick={() => navigate('/register')}
            className="font-bold text-teal-600 hover:text-teal-500 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Sign Up Free
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// SIGN UP VIEW
export function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Username validation state
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{ available: boolean; message: string } | null>(null);

  // Form submission state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const debouncedUsername = useDebounce(username, 500);

  // Debounced username availability checker
  useEffect(() => {
    if (!debouncedUsername.trim()) {
      setUsernameStatus(null);
      return;
    }

    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!regex.test(debouncedUsername)) {
      setUsernameStatus({ 
        available: false, 
        message: 'Must be 3-20 characters using letters, numbers, or underscores.' 
      });
      return;
    }

    const checkAvailability = async () => {
      setUsernameChecking(true);
      try {
        const lower = debouncedUsername.toLowerCase().trim();
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('username')
          .eq('username', lower);

        if (error) {
          console.error('Username check error:', error);
          setUsernameStatus({ available: false, message: 'Server check failed. Please try again.' });
        } else if (data && data.length > 0) {
          setUsernameStatus({ available: false, message: '❌ Username Already Taken' });
        } else {
          setUsernameStatus({ available: true, message: '✅ Username Available' });
        }
      } catch (err) {
        setUsernameStatus({ available: false, message: 'Network check failed.' });
      } finally {
        setUsernameChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername]);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) return;

    // Pre-checks
    if (usernameStatus && !usernameStatus.available) {
      setErrorMsg('Please select an available username');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Double check duplicate email in profiles mapping first (Duplicate email prevention)
      const lowerEmail = email.toLowerCase().trim();
      const { data: existingEmail, error: emailError } = await supabaseClient
        .from('profiles')
        .select('email')
        .eq('email', lowerEmail);

      if (emailError) {
        console.error('Email check error:', emailError);
      } else if (existingEmail && existingEmail.length > 0) {
        setErrorMsg('❌ Email address is already registered');
        setLoading(false);
        return;
      }

      // 2. Register user with Supabase Auth
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email: lowerEmail,
        password,
        options: {
          data: {
            username: username.toLowerCase().trim(),
          }
        }
      });

      if (signUpError) {
        setErrorMsg(signUpError.message || 'Auth registration failed.');
        setLoading(false);
        return;
      }

      const user = signUpData?.user;
      if (!user) {
        setErrorMsg('Auth succeeded but failed to fetch user metadata.');
        setLoading(false);
        return;
      }

      // 3. Create the profile row mapping (Username reservation) with retry & rollback
      const isSpecialSignup = ['admin@sugora.com', 'support@sugora.com', 'user1@sugora.com', 'ceo.neomcq@gmail.com'].includes(lowerEmail);
      const profileData = {
        id: user.id,
        username: username.toLowerCase().trim(),
        email: lowerEmail,
        display_name: username.trim(),
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', // default avatar
        bio: '',
        email_verified: isSpecialSignup ? true : false,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
        online_status: 'online',
        status: 'Active',
        role: isSpecialSignup ? (lowerEmail === 'ceo.neomcq@gmail.com' || lowerEmail === 'admin@sugora.com' ? 'Admin' : 'Support') : 'User'
      };

      let profileError = null;
      let retries = 3;
      while (retries > 0) {
        const { error } = await supabaseClient
          .from('profiles')
          .insert(profileData);
        if (!error) {
          profileError = null;
          break;
        }
        profileError = error;
        retries--;
        if (retries > 0) {
          console.warn(`Profile creation failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (profileError) {
        console.error('Failed to create profile mapping after retries:', profileError);
        // Rollback: sign out and show error
        await supabaseClient.auth.signOut();
        setErrorMsg('❌ Profile registration failed. The signup has been rolled back. Please try again.');
        setLoading(false);
        return;
      }

      // Check if user is instantly active or if email verification is requested
      const session = signUpData.session;
      if (session) {
        setSuccessMsg('✅ Sign up successful! Welcome to Sugora!');
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      } else {
        // Email verification required
        setSuccessMsg('Account created successfully! Please check your email inbox to verify your account.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 transition-colors duration-300">
      <DecorativeBackground />
      <QuickThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl shadow-neutral-200/50 dark:shadow-none"
      >
        <AuthHeader />

        <div className="space-y-1 mb-6 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
            <Sparkles className="h-5 w-5 text-teal-500" />
            Create Your Account
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400">
            Sign up to Sugora to access your private chat hub.
          </p>
        </div>

        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
          >
            <XCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 text-xs flex items-start gap-2.5"
          >
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Username Input with Debounced Realtime check */}
          <div className="space-y-1">
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Username
            </label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="username"
                type="text"
                placeholder="sugora_pro"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10.5 pr-11 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
              {usernameChecking && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-500 animate-spin" />
              )}
            </div>
            
            {/* Status indicator */}
            <AnimatePresence>
              {usernameStatus && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-[11px] font-bold ${
                    usernameStatus.available 
                      ? 'text-teal-600 dark:text-teal-400' 
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {usernameStatus.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10.5 pr-4 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10.5 pr-11 py-2 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:text-zinc-500 dark:hover:text-white cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Strength Meter */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-neutral-500 dark:text-zinc-500 uppercase tracking-wider">Strength</span>
                  <span className={passwordStrength.score >= 75 ? 'text-teal-500' : passwordStrength.score >= 50 ? 'text-amber-500' : 'text-red-500'}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${passwordStrength.score}%` }}
                    className={`h-full ${passwordStrength.color} transition-all`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10.5 pr-4 py-2 bg-neutral-50 dark:bg-zinc-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all dark:text-white ${
                  !passwordsMatch ? 'border-red-500 focus:ring-red-500/30' : 'border-neutral-200 dark:border-zinc-800 focus:border-teal-500'
                }`}
              />
            </div>
            {!passwordsMatch && (
              <span className="text-[11px] text-red-500 font-bold block">❌ Passwords do not match</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (usernameStatus && !usernameStatus.available) || !passwordsMatch || password.length < 8}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                <span>Signing Up...</span>
              </>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-zinc-800 text-center text-xs">
          <span className="text-neutral-500 dark:text-zinc-400">Already have an account? </span>
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-teal-600 hover:text-teal-500 dark:text-teal-400 hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// FORGOT PASSWORD VIEW
export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Use site url for password reset callback redirects
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to send password reset request.');
      } else {
        setSuccessMsg('✅ Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 transition-colors duration-300">
      <DecorativeBackground />
      <QuickThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl"
      >
        <AuthHeader />

        <div className="space-y-1 mb-6 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
            <KeyRound className="h-5 w-5 text-teal-500" />
            Reset Password
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400">
            Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <XCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10.5 pr-4 py-2.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-teal-500" /> : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-zinc-800 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-1.5 font-bold text-xs text-neutral-600 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// RESET PASSWORD VIEW
export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const passwordsMatch = password && confirmPassword ? password === confirmPassword : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || password !== confirmPassword) return;

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        setErrorMsg(error.message || 'Failed to update password.');
      } else {
        setSuccessMsg('✅ Password successfully updated! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 transition-colors duration-300">
      <DecorativeBackground />
      <QuickThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl"
      >
        <AuthHeader />

        <div className="space-y-1 mb-6 text-center">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center justify-center gap-1.5">
            <Lock className="h-5 w-5 text-teal-500" />
            Set New Password
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400">
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <XCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl border border-teal-500/20 bg-teal-500/5 text-teal-600 dark:text-teal-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10.5 pr-4 py-2.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400 block">
              Confirm New Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 dark:text-zinc-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10.5 pr-4 py-2.5 bg-neutral-50 dark:bg-zinc-950 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all dark:text-white ${
                  !passwordsMatch ? 'border-red-500 focus:ring-red-500/30' : 'border-neutral-200 dark:border-zinc-800 focus:border-teal-500'
                }`}
              />
            </div>
            {!passwordsMatch && (
              <span className="text-[11px] text-red-500 font-semibold block">❌ Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || password.length < 8}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-teal-500" /> : 'Update Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// EMAIL VERIFICATION MESSAGE
export function VerifyEmail() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-50 transition-colors duration-300">
      <DecorativeBackground />
      <QuickThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-neutral-200/50 dark:border-zinc-800/50 backdrop-blur-xl shadow-2xl text-center space-y-5"
      >
        <AuthHeader />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-500 mx-auto animate-bounce">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed">
            We have sent a verification link to your email address. Please click the link in your inbox to verify your identity and start chatting.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold rounded-xl text-sm shadow transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <span>Proceed to Login</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[11px] text-neutral-400 dark:text-zinc-500">
          Didn't receive the email? Check your spam folder or wait a few minutes.
        </p>
      </motion.div>
    </div>
  );
}
