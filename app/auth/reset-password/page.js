'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/components/Auth/Auth.module.css';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', complete: false });

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setStatus({ loading: false, error: 'Passwords do not match.', complete: false });
      return;
    }

    setStatus({ loading: true, error: '', complete: false });

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setStatus({ loading: false, error: '', complete: true });
      setTimeout(() => {
        router.replace('/dashboard');
        router.refresh();
      }, 800);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Unable to update your password. Request a new reset link.',
        complete: false,
      });
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <Link href="/" className={styles.logo}>
          <img src="/compliantscan-mark.png" alt="" />
          <span>CompliantScan</span>
        </Link>

        <h1 className={styles.heading}>Choose a new password.</h1>
        <p className={styles.subheading}>Use at least eight characters and do not reuse an old password.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="new-password">New password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="confirm-password">Confirm new password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              className={styles.input}
            />
          </div>

          {status.error && <p role="alert" className={styles.errorText}>{status.error}</p>}
          {status.complete && <p role="status" className={styles.successText}>Password updated. Opening your dashboard…</p>}

          <button type="submit" className={styles.submitButton} disabled={status.loading || status.complete}>
            {status.loading ? 'Updating password…' : 'Update password'}
          </button>
        </form>
      </section>
    </main>
  );
}
