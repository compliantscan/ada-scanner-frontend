'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../lib/apiUrl';
import { getCachedSession } from '../../lib/supabaseClient';

export default function BillingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function openPortal() {
    setError('');
    setLoading(true);

    try {
      const session = await getCachedSession();
      if (!session?.access_token) {
        router.replace('/login?next=/billing');
        return;
      }

      const response = await fetch(`${getApiUrl()}/billing-portal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to open billing portal.');
      window.location.assign(data.url);
    } catch (portalError) {
      setError(portalError.message || 'Unable to open billing portal.');
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">CompliantScan</p>
          <h1>Manage your subscription</h1>
          <p>Open Stripe’s secure portal to update your plan, payment details, or cancellation.</p>
        </div>

        {error && <p role="alert" className="auth-message auth-error">{error}</p>}

        <button className="auth-button" type="button" onClick={openPortal} disabled={loading}>
          {loading ? 'Opening secure billing…' : 'Open billing portal'}
        </button>
        <Link href="/dashboard/billing" className="auth-link">Back to plans</Link>
      </section>
    </main>
  );
}
