'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Auth.module.css';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleGoogleSignIn = async () => {
    setStatus({ ...status, error: '' });
    setGoogleLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      setStatus({ ...status, error: err.message || 'Unable to continue with Google right now.' });
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      const supabase = getSupabaseClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.name } },
      });

      if (signUpError) throw signUpError;
      
      router.push('/dashboard');
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Something went wrong. Try again.' });
      return;
    }

    setStatus({ loading: false, error: '' });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button type="button" className={styles.oauthButton} onClick={handleGoogleSignIn} disabled={status.loading || googleLoading}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 015.5 12c0-.73.13-1.43.34-2.09V7.07H2.18A11 11 0 001 12c0 1.77.42 3.45 1.18 4.93z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 00-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
        </svg>
        {googleLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="name">Full name</label>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange('name')}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@agency.com"
          value={form.email}
          onChange={handleChange('email')}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange('password')}
          required
          minLength={8}
          className={styles.input}
        />
      </div>

      {status.error && <p className={styles.errorText}>{status.error}</p>}

      <button type="submit" className={styles.submitButton} disabled={status.loading || googleLoading}>
        {status.loading ? 'Creating account...' : 'Sign up with email'}
      </button>

      <p className={styles.termsText}>
        By signing up, you agree to our <a href="/terms">Terms</a> and{' '}
        <a href="/privacy">Privacy Policy</a>.
      </p>
    </form>
  );
}