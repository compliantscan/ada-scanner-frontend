'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get('session_id'));
  }, []);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">CompliantScan</a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>
      <main className="page-container">
        <section className="hero-section" style={{ textAlign: 'center', maxWidth: 560, margin: '40px auto' }}>
          <p className="eyebrow">Payment confirmed</p>
          <h1>You&apos;re all set.</h1>
          <p className="hero-subtitle" style={{ marginTop: 12 }}>
            Your subscription is active. Check your email — your access token and a welcome PDF are on their way.
          </p>
          {sessionId && (
            <p style={{ fontSize: 12, color: '#4b4b4b', marginTop: 8 }}>Reference: {sessionId}</p>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
            <button className="scan-button" onClick={() => router.push('/')}>Scan a site now</button>
            <button className="secondary-button" onClick={() => router.push('/billing')}>Manage subscription</button>
          </div>
        </section>
      </main>
    </>
  );
}
