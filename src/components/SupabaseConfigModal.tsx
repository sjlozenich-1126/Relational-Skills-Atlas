import React, { useState } from 'react';
import {
  Database,
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  KeyRound,
  RefreshCw,
  HelpCircle,
  Server,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  activeSupabaseUrl,
  activeSupabaseKey,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  testSupabaseConnection,
} from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState(activeSupabaseUrl);
  const [key, setKey] = useState(activeSupabaseKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(url.trim(), key.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ ok: false, message: err?.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setTestResult({ ok: false, message: 'Please provide both the Project URL and Anon Public Key.' });
      return;
    }
    saveCustomSupabaseConfig(url.trim(), key.trim());
  };

  const handleClear = () => {
    clearCustomSupabaseConfig();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E0E0E0] w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#E0E0E0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#202124]">Supabase Integration Setup</h3>
              <p className="text-xs text-[#5F6368]">
                Connect your Supabase project for persistent Auth & user sessions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Current Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isSupabaseConfigured
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            {isSupabaseConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <span className="font-semibold block text-sm">
                {isSupabaseConfigured
                  ? 'Supabase Active & Configured'
                  : 'Supabase Not Connected (Operating in Demo/Session Mode)'}
              </span>
              <p className="text-[#5F6368]">
                {isSupabaseConfigured
                  ? `Your application is connected to ${activeSupabaseUrl}. All email/password sign-ins authenticate directly with your Supabase project.`
                  : 'You can test the app right now with mock sessions, or enter your Supabase Project URL and Anon API key below to activate real user sign-in.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3.5 py-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-[#202124] bg-gray-50/50"
              />
              <span className="text-[11px] text-[#5F6368] mt-1 block">
                Found in your Supabase Dashboard under <strong>Project Settings &gt; API</strong>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202124] mb-1">
                Supabase Anon / Public Key
              </label>
              <textarea
                value={key}
                rows={2}
                onChange={(e) => {
                  setKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 text-xs border border-[#E0E0E0] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono text-[#202124] bg-gray-50/50"
              />
              <span className="text-[11px] text-[#5F6368] mt-1 block">
                The <code>anon</code> / <code>public</code> key safe for client-side browsers.
              </span>
            </div>

            {/* Test Connection Result Feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                  testResult.ok
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E0E0E0]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !url.trim() || !key.trim()}
                  className="px-3 py-2 text-xs font-medium text-[#1A73E8] bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>

                {Boolean(activeSupabaseUrl) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
                    title="Clear custom configuration"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 text-xs font-medium text-[#5F6368] hover:text-[#202124] rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={!url.trim() || !key.trim()}
                  className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Connect</span>
                </button>
              </div>
            </div>
          </form>

          {/* Vercel Hosting Instructions */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#202124]">
              <Server className="w-4 h-4 text-[#1A73E8]" />
              <span>Permanent Configuration on Vercel</span>
            </div>
            <p className="text-[#5F6368] leading-relaxed">
              To configure Supabase permanently for your Vercel deployment at{' '}
              <a
                href="https://relationalskillsatlas.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="text-[#1A73E8] underline font-medium"
              >
                relationalskillsatlas.vercel.app
              </a>
              :
            </p>
            <ol className="list-decimal list-inside space-y-1 text-[#5F6368] pl-1 font-mono text-[11px]">
              <li>
                In your Vercel Dashboard, navigate to <strong>Project Settings &gt; Environment Variables</strong>.
              </li>
              <li>
                Add <code>VITE_SUPABASE_URL</code> with your project URL.
              </li>
              <li>
                Add <code>VITE_SUPABASE_ANON_KEY</code> with your anon public key.
              </li>
              <li>
                (Optional) Add <code>GEMINI_API_KEY</code> for custom AI syllabus and assessment generation.
              </li>
              <li>
                Click <strong>Deployments &gt; Redeploy</strong> to bake the variables into the production bundle.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
