'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

export default function BillingPage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function openPortal(e) {
    e.preventDefault();
    if (!customerId.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/billing-portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customerId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Unable to open billing portal.');
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo"><img src="/compliantscan-mark.png" alt="" />CompliantScan</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>
      <main className="page-container">
        <section className="hero-section" style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
          <p className="eyebrow">Billing</p>
          <h1>Manage your subscription</h1>
          <p className="hero-subtitle" style={{ marginTop: 12 }}>
            Enter the Stripe customer ID from your confirmation email to update your plan, change payment details, or cancel.
          </p>
          <form onSubmit={openPortal} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="site-input"
              style={{ maxWidth: '100%', width: '100%' }}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Stripe customer ID (cus_...)"
            />
            <button className="scan-button" type="submit" disabled={loading || !customerId.trim()}>
              {loading ? 'Opening portal...' : 'Open billing portal'}
            </button>
          </form>
          {error && <p className="message error" style={{ marginTop: 12 }}>{error}</p>}
          <button className="secondary-button" style={{ marginTop: 16 }} onClick={() => router.push('/')}>Back to home</button>
        </section>
      </main>
    </>
  );
}
