import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  User as UserIcon,
  ArrowRight,
  Database,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  viewName: string;
  description?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  viewName,
  description = 'Sign in with your email and password to access your personal workspace, verified skills, and portfolio history.',
}) => {
  const {
    isAuthenticated,
    authLoading,
    signInWithEmail,
    signUpWithEmail,
    isSupabaseConfigured,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 border-3 border-[#1A73E8] border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-base font-semibold text-[#202124]">Checking Supabase Session...</h3>
        <p className="text-xs text-[#5F6368] mt-1">Verifying encrypted authentication tokens</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        }
      } else {
        const res = await signUpWithEmail(email, password, name);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg(res.message || 'Account created successfully!');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithEmail('learner@atlas.internal', 'demo-password-123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-[#E0E0E0] rounded-3xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left Hero Pane */}
          <div className="md:col-span-2 bg-[#F8Fafd] p-8 border-b md:border-b-0 md:border-r border-[#E0E0E0] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1A73E8] text-white flex items-center justify-center shadow-sm mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-[#1A73E8] mb-1">
                Protected View
              </span>
              <h2 className="text-xl font-bold text-[#202124] tracking-tight mb-2">
                {viewName}
              </h2>
              <p className="text-xs text-[#5F6368] leading-relaxed mb-6">
                {description}
              </p>

              <div className="space-y-3 pt-4 border-t border-gray-200 text-xs text-[#3C4043]">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                  <span>Encrypted session tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                  <span>Personal skill ledger & progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
                  <span>REP verification audit trails</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-[11px] text-[#5F6368]">
                <Database className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>
                  {isSupabaseConfigured
                    ? 'Supabase Auth Ready'
                    : 'Supabase Config: Demo/Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Auth Form */}
          <div className="md:col-span-3 p-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#E0E0E0] mb-6">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    mode === 'signin'
                      ? 'bg-[#1A73E8] text-white'
                      : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    mode === 'signup'
                      ? 'bg-[#1A73E8] text-white'
                      : 'text-[#5F6368] hover:bg-gray-100'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] text-[#5F6368]">
                {mode === 'signin' ? 'Existing Learner' : 'New Learner'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-[#5F6368] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-hidden focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#202124] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#5F6368] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-hidden focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#202124] mb-1">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#5F6368] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-hidden focus:border-[#1A73E8] focus:ring-1 focus:ring-[#1A73E8]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#1A73E8] hover:bg-[#1557B0] disabled:bg-blue-300 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'signin'
                        ? 'Sign In & Unlock View'
                        : 'Register & Unlock View'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {!isSupabaseConfigured && (
                <div className="pt-3 border-t border-[#E0E0E0]">
                  <button
                    type="button"
                    onClick={handleDemoSignIn}
                    className="w-full py-2 px-3 text-xs text-[#5F6368] hover:text-[#202124] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span>Quick Unlock with Demo Session</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
