'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function CallbackContent() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const exchangeCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash
      );
      const code = searchParams.get('code') || hashParams.get('code');
      const hashError = hashParams.get('error_description') || hashParams.get('error');
      const queryError = searchParams.get('error_description') || searchParams.get('error');

      if (hashError || queryError) {
        setError(hashError || queryError || 'Google sign-in was cancelled or failed.');
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseClient();

        if (!code) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (session) {
            router.replace('/dashboard');
            return;
          }

          throw new Error(
            sessionError?.message || 'No authentication code was provided. The callback may have returned a session in the hash or the redirect was incomplete.'
          );
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          throw exchangeError;
        }

        router.replace('/dashboard');
      } catch (err) {
        const message = err.message || 'Unable to complete Google sign-in.';
        setError(
          /pkce code verifier/i.test(message)
            ? 'This sign-in attempt has expired. Please start Google sign-in again from this browser.'
            : message
        );
        setLoading(false);
      }
    };

    exchangeCode();
  }, [router]);

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">CompliantScan</p>
          <h1>{loading ? 'Finishing sign in…' : 'Sign in could not be completed'}</h1>
          <p>
            {loading
              ? 'We are completing your Google sign-in now.'
              : 'Return to the login page and try again in this browser.'}
          </p>
        </div>

        {error ? (
          <div className="auth-message auth-error">
            <div>{error}</div>
            <div style={{ marginTop: '12px' }}>
              <Link href="/login" className="auth-link">Try sign in again</Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
