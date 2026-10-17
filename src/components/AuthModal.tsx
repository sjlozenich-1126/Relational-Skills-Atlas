import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Lock,
  Mail,
  KeyRound,
  User as UserIcon,
  X,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    signInWithEmail,
    signUpWithEmail,
    isSupabaseConfigured,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode when modal opens with a specific mode
  React.useEffect(() => {
    setMode(authModalMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

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
        } else {
          closeAuthModal();
        }
      } else {
        const res = await signUpWithEmail(email, password, name);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg(res.message || 'Account created successfully!');
          if (!res.message?.includes('verify')) {
            setTimeout(() => {
              closeAuthModal();
            }, 1200);
          }
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
      closeAuthModal();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E0E0E0] w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1A73E8] flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#202124]">
                {mode === 'signin' ? 'Sign in to Atlas' : 'Create an Account'}
              </h3>
              <p className="text-xs text-[#5F6368]">Supabase Authentication</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-[#5F6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Supabase Status Banner */}
        <div
          className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
            isSupabaseConfigured
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            <span>
              {isSupabaseConfigured
                ? 'Connected to live Supabase Auth instance'
                : 'Supabase credentials pending (Demo mode active)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfigModal(true)}
            className="text-[11px] font-medium underline text-[#1A73E8] hover:text-[#1557B0] cursor-pointer"
          >
            {isSupabaseConfigured ? 'Settings' : 'Connect'}
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E0E0E0] bg-gray-50/70">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              mode === 'signin'
                ? 'border-[#1A73E8] text-[#1A73E8] bg-white font-semibold'
                : 'border-transparent text-[#5F6368] hover:text-[#202124]'
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
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              mode === 'signup'
                ? 'border-[#1A73E8] text-[#1A73E8] bg-white font-semibold'
                : 'border-transparent text-[#5F6368] hover:text-[#202124]'
            }`}
          >
            Register / Sign Up
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                Full Name
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
              <span>Processing...</span>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In with Email' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {!isSupabaseConfigured && (
            <div className="pt-2 border-t border-[#E0E0E0]">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-2 px-3 text-xs text-[#5F6368] hover:text-[#202124] hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Instant Sign-In with Demo Session</span>
              </button>
            </div>
          )}
        </form>
      </div>

      <SupabaseConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
};
