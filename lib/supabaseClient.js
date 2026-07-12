import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}

// Module-level session cache — avoids redundant async getSession() calls on every page mount.
let _cachedSession = null;
let _sessionPromise = null;

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((_event, session) => {
    _cachedSession = session;
    _sessionPromise = null;
  });
}

export async function getCachedSession() {
  if (_cachedSession !== null) return _cachedSession;
  if (_sessionPromise) return _sessionPromise;
  _sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
    _cachedSession = session;
    _sessionPromise = null;
    return session;
  });
  return _sessionPromise;
}
