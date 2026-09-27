import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Sparkles,
  LogOut,
  Database,
} from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, loading, signIn, signUp, signOut } = useSupabaseAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Senior Software Engineer');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        const res = await signUp(email, password, {
          full_name: fullName.trim() || email.split('@')[0],
          role: role.trim(),
        });
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage(
            'Account created successfully! Profile details saved to Supabase profiles database.'
          );
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Logged in successfully! Welcome back.');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
    setSuccessMessage('Signed out successfully.');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-3xl bg-[#0D1527] border border-cyan-500/30 shadow-[0_20px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-cyan-500/20 flex items-center justify-between bg-[#0B132B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {user ? 'Developer Profile' : mode === 'signin' ? 'Sign In to Copilot' : 'Create Supabase Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {user ? 'Connected to Supabase Auth' : 'Sync your conversations across all devices'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* If already logged in */}
          {user ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#070B14] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300 uppercase">
                      {(profile?.full_name || user.email || 'U')[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Active Session
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Role</span>
                    <span className="text-slate-300 font-mono">
                      {profile?.role || user.user_metadata?.role || 'Developer'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Database Storage</span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <Database className="w-3 h-3" /> Auto-sync ON
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20">
                User profile details and chat messages are securely mapped to Supabase ID{' '}
                <span className="font-mono text-cyan-300 text-[11px] break-all">{user.id}</span>.
              </div>

              <button
                onClick={handleSignOut}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from Supabase</span>
              </button>
            </div>
          ) : (
            /* Sign In / Sign Up Forms */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Toggle Tabs */}
              <div className="flex p-1 rounded-xl bg-[#070B14] border border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    mode === 'signin'
                      ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    mode === 'signup'
                      ? 'bg-cyan-500 text-black font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up (New User)
                </button>
              </div>

              {/* Alert Feedback */}
              {errorMessage && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Sign Up extra fields (Full Name, Role) */}
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-400 text-xs"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-xs font-medium mb-1">
                      Engineering Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Full-Stack Architect"
                      className="w-full px-3 py-2 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-400 text-xs"
                    />
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-400 text-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-slate-300 text-xs font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070B14] border border-cyan-500/20 text-slate-200 placeholder-slate-600 outline-none focus:border-cyan-400 text-xs"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Auto Profile Store Notice */}
              <div className="p-2.5 rounded-xl bg-[#070B14]/80 border border-cyan-500/15 text-[11px] text-slate-400 flex items-start gap-2">
                <Database className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  On registration, your email, role, and metadata will be automatically written to the Supabase{' '}
                  <code className="text-cyan-300">profiles</code> database table.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>
                  {submitting
                    ? 'Processing...'
                    : mode === 'signin'
                    ? 'Sign In to Account'
                    : 'Create Account & Save Profile'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
