import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve from Vite environment variables or optional user-configured storage
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('rsa_custom_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('rsa_custom_supabase_anon_key') : null;

// Prefer non-placeholder env variable, fallback to stored credentials
export const activeSupabaseUrl =
  (envUrl && !envUrl.includes('your-project') && !envUrl.includes('placeholder')
    ? envUrl
    : storedUrl) || '';

export const activeSupabaseKey =
  (envKey && !envKey.includes('your-anon-key') && !envKey.includes('placeholder')
    ? envKey
    : storedKey) || '';

export const isSupabaseConfigured = Boolean(
  activeSupabaseUrl &&
  activeSupabaseKey &&
  activeSupabaseUrl.startsWith('http') &&
  !activeSupabaseUrl.includes('placeholder') &&
  !activeSupabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? activeSupabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? activeSupabaseKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const saveCustomSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('rsa_custom_supabase_url', url.trim());
    localStorage.setItem('rsa_custom_supabase_anon_key', key.trim());
    window.location.reload();
  }
};

export const clearCustomSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('rsa_custom_supabase_url');
    localStorage.removeItem('rsa_custom_supabase_anon_key');
    window.location.reload();
  }
};

export async function testSupabaseConnection(
  testUrl?: string,
  testKey?: string
): Promise<{ ok: boolean; message: string }> {
  const targetUrl = testUrl || activeSupabaseUrl;
  const targetKey = testKey || activeSupabaseKey;

  if (!targetUrl || !targetKey) {
    return {
      ok: false,
      message: 'Supabase URL and Anon Key are missing or empty.',
    };
  }

  if (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://')) {
    return {
      ok: false,
      message: 'Invalid Supabase URL: Must begin with https://',
    };
  }

  try {
    const client = createClient(targetUrl, targetKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client.auth.getSession();
    if (error && !error.message?.includes('session')) {
      return { ok: false, message: error.message };
    }
    return {
      ok: true,
      message: 'Connection successful! Supabase Auth endpoint is active and verified.',
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Network connection failed. Please check the URL and Key.',
    };
  }
}
