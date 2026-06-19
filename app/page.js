'use client';

import { useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('Please enter a URL to scan.');
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
        throw new Error(payload.message || 'Scan request failed');
      }

      setResult(payload);
    } catch (err) {
      setError(err.message || 'Unable to complete the scan.');
    } finally {
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
          <form className="scan-form" onSubmit={handleSubmit}>
            <label htmlFor="site-url" className="sr-only">
              Website URL
            </label>
            <input
              id="site-url"
              type="url"
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
          {result && (
            <div className="result-card">
              <p className="result-label">Scan complete</p>
              <div className="result-summary">
                <div>
                  <span>{result.summary.totalViolations}</span>
                  <p>Violations</p>
                </div>
                <div>
                  <span>{result.summary.passes}</span>
                  <p>Passes</p>
                </div>
                <div>
                  <span>{result.summary.incomplete}</span>
                  <p>Incomplete</p>
                </div>
              </div>
              <button
                type="button"
                className="scan-button redirect-button"
                onClick={() => {
                  sessionStorage.setItem('adaScanResult', JSON.stringify(result));
                  window.location.href = '/results';
                }}
              >
                View full preview
              </button>
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
