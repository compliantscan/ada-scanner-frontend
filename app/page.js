'use client';

import { useEffect, useRef, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
const scanStatuses = [
  'Loading your site...',
  'Checking color contrast...',
  'Scanning form labels...',
  'Reviewing landmark structure...',
  'Analyzing headings and labels...',
];

function isValidFullUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanStatus, setScanStatus] = useState(scanStatuses[0]);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!loading) return;

    let index = 0;
    setScanStatus(scanStatuses[index]);
    intervalRef.current = setInterval(() => {
      index = (index + 1) % scanStatuses.length;
      setScanStatus(scanStatuses[index]);
    }, 4000);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setError('Scan timed out. Please try again or check your URL.');
    }, 55000);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [loading]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL to scan.');
      return;
    }

    if (!isValidFullUrl(trimmedUrl)) {
      setError('Please enter a full URL, including https://');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const payload = await response.json();

      if (!response.ok) {
        const errorText = payload?.message || 'We couldn\'t scan that site. Double check the URL and try again.';
        throw new Error(errorText);
      }

      sessionStorage.setItem('adaScanResult', JSON.stringify(payload));
      window.location.href = '/results';
    } catch (err) {
      setError(err.message || 'We couldn\'t scan that site. Double check the URL and try again.');
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <section className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Free ADA website accessibility scan</p>
          <h1>Scan your website for ADA violations free — before a lawyer does it for you</h1>
          <p className="hero-subtitle">
            Over 20,000 website accessibility lawsuits are filed every year. Get a fast, no-cost scan now and know
            where your site stands.
          </p>
          <form className="scan-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="site-url" className="sr-only">
              Website URL
            </label>
            <input
              id="site-url"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Enter your website URL — e.g. https://example.com"
              className="site-input"
              aria-label="Website URL"
            />
            <button type="submit" className="scan-button" disabled={loading}>
              {loading ? 'Scanning...' : 'Scan now'}
            </button>
          </form>
          {error && <p className="message error">{error}</p>}
          {loading && (
            <div className="loading-panel">
              <div className="spinner" />
              <p className="loading-title">Scanning your website</p>
              <p className="loading-status">{scanStatus}</p>
            </div>
          )}
        </div>
      </section>

      <section className="how-it-works">
        <p className="section-heading">How it works</p>
        <div className="steps-grid">
          <article className="step-card">
            <p className="step-number">1</p>
            <h2>Enter your website</h2>
            <p>Type in any live URL and request a one-click ADA scan.</p>
          </article>
          <article className="step-card">
            <p className="step-number">2</p>
            <h2>Review the findings</h2>
            <p>See a plain-language summary of the most important accessibility issues.</p>
          </article>
          <article className="step-card">
            <p className="step-number">3</p>
            <h2>Fix before a lawsuit</h2>
            <p>Use the report to correct the worst problems before lawyers find them.</p>
          </article>
        </div>
      </section>

      <footer className="page-footer">
        <p>© 2026 ADA Scanner. Simple website scans for accessibility compliance.</p>
      </footer>
    </main>
  );
}
