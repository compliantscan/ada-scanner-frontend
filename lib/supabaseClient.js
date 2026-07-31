import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

let browserClient = null;
let cachedSession = null;
let sessionPromise = null;
let authListenerStarted = false;

export function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      isSingleton: true,
    });
  }

  return browserClient;
}

function ensureAuthListener() {
  if (typeof window === 'undefined' || authListenerStarted) return;
  authListenerStarted = true;
  getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    cachedSession = session;
    sessionPromise = null;
  });
}

export async function getCachedSession() {
  ensureAuthListener();
  if (cachedSession !== null) return cachedSession;
  if (sessionPromise) return sessionPromise;

  sessionPromise = getSupabaseClient().auth.getSession().then(({ data: { session } }) => {
    cachedSession = session;
    sessionPromise = null;
    return session;
  });

  return sessionPromise;
}
