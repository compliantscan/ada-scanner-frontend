'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function CallbackContent() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finishSignIn = () => {
      const isPopup = new URLSearchParams(window.location.search).get('popup') === '1';
      if (isPopup && window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'compliantscan:auth-complete' }, window.location.origin);
        window.close();
        return;
      }
      router.replace('/dashboard');
      router.refresh();
    };

    const exchangeCode = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash,
      );
      const code = searchParams.get('code') || hashParams.get('code');
      const authError =
        hashParams.get('error_description') ||
        hashParams.get('error') ||
        searchParams.get('error_description') ||
        searchParams.get('error');

      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }

      try {
        const supabase = getSupabaseClient();

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (!session) {
            throw new Error(sessionError?.message || 'Google sign-in did not return a session.');
          }
        }

        finishSignIn();
      } catch (callbackError) {
        const message = callbackError?.message || 'Unable to complete Google sign-in.';
        const friendlyMessage = /pkce code verifier/i.test(message)
          ? 'This sign-in attempt expired. Please start Google sign-in again.'
          : message;
        setError(friendlyMessage);
        setLoading(false);
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            { type: 'compliantscan:auth-error', message: friendlyMessage },
            window.location.origin,
          );
        }
      }
    };

    exchangeCode();
  }, [router]);

  if (loading) {
    return (
      <main className="auth-redirect" aria-live="polite" aria-label="Completing sign in">
        <span className="auth-redirect__bar" />
      </main>
    );
  }

  return (
    <main className="auth-redirect auth-redirect--error">
      <p>{error || 'Google sign-in could not be completed.'}</p>
      <a href="/login">Return to sign in</a>
    </main>
  );
}
