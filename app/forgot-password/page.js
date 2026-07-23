'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '@/components/Auth/Auth.module.css';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', sent: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: '', sent: false });

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setStatus({ loading: false, error: '', sent: true });
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Unable to send the reset email. Please try again.',
        sent: false,
      });
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logo}>
          <img src="/compliantscan-mark.png" alt="" />
          <span>CompliantScan</span>
        </Link>

        <h1 className={styles.heading}>Reset your password.</h1>
        <p className={styles.subheading}>
          Enter the email connected to your account and we will send you a secure reset link.
        </p>

        {status.sent ? (
          <>
            <p role="status" style={{ color: 'var(--color-brand-green)', lineHeight: 1.6 }}>
              Check your inbox. If an account exists for {email}, a reset link is on its way.
            </p>
            <Link href="/login" className={styles.forgotLink}>← Back to sign in</Link>
          </>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@agency.com"
                autoComplete="email"
                required
                className={styles.input}
              />
            </div>
            {status.error && <p role="alert" className={styles.errorText}>{status.error}</p>}
            <button type="submit" className={styles.submitButton} disabled={status.loading}>
              {status.loading ? 'Sending reset link…' : 'Send reset link'}
            </button>
            <p className={styles.termsText}>
              Remembered your password? <Link href="/login">Sign in</Link>
            </p>
          </form>
        )}
      </section>
    </main>
  );
}
