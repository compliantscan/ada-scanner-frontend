'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const severityStyles = {
  critical: { label: 'Critical', color: '#dc2626' },
  serious: { label: 'Serious', color: '#f97316' },
  moderate: { label: 'Moderate', color: '#facc15' },
  minor: { label: 'Minor', color: '#14b8a6' },
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function ResultsPage() {
  const [scan, setScan] = useState(null);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('adaScanResult');
    if (!raw) {
      setScan(null);
      return;
    }

    try {
      setScan(JSON.parse(raw));
    } catch (err) {
      setScan(null);
    }
  }, []);

  if (scan === null) {
    return (
      <main className="page-container">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Scan results</p>
            <h1>Nothing to show yet</h1>
            <p className="hero-subtitle">Run a scan from the homepage first, then return here to see the report preview.</p>
            <button className="secondary-button" onClick={() => router.push('/')}>Back to scan</button>
          </div>
        </section>
      </main>
    );
  }

  const total = scan.summary.totalViolations;
  const topViolations = scan.violations.slice(0, 3);
  const remaining = Math.max(scan.violations.length - 3, 0);

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (!email || !isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailLoading(true);

    try {
      const response = await fetch(`${apiUrl}/collect-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, url: scan.url, scanResult: scan }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || 'Something went wrong — please try again.');
      }

      setEmailSuccess(`Check your inbox — your full ADA compliance report is on its way to ${email}.`);
    } catch (err) {
      setEmailError(err.message || 'Something went wrong — please try again.');
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <main className="page-container">
      <section className="results-hero">
        <div>
          <p className="eyebrow">Scan results</p>
          <h1>{total} accessibility violation{total === 1 ? '' : 's'}</h1>
          <p className="hero-subtitle">This free preview shows the top issues your site must fix before accessibility problems become legal risk.</p>
        </div>
      </section>

      <section className="severity-summary">
        {Object.entries(severityStyles).map(([key, info]) => {
          const count = scan.violationsBySeverity?.[key] ?? 0;
          const width = total ? Math.max((count / total) * 100, 5) : 5;
          return (
            <div key={key} className="severity-card">
              <div className="severity-row">
                <span>{info.label}</span>
                <span>{count}</span>
              </div>
              <div className="severity-bar">
                <div className="severity-fill" style={{ width: `${width}%`, backgroundColor: info.color }} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="top-violations">
        <h2>Top 3 violations</h2>
        <div className="violation-grid">
          {topViolations.map((violation, index) => (
            <article key={violation.id} className="violation-card">
              <p className="violation-rank">#{index + 1}</p>
              <h3>{violation.id}</h3>
              <p className="violation-impact">{violation.impact.toUpperCase()}</p>
              <p className="violation-description">{violation.description}</p>
              <div className="violation-detail">
                <strong>WCAG criterion:</strong> {violation.id}
              </div>
              <div className="violation-detail">
                <strong>Why it matters:</strong> {violation.help}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="more-violations-card">
        <div className="more-violations-blur">
          <p className="more-violations-count">{remaining} more violation{remaining === 1 ? '' : 's'} detected</p>
          <p>Your site has {remaining} more violations. Enter your email to get the full report.</p>
          {emailSuccess ? (
            <div className="email-confirmation">
              <p>{emailSuccess}</p>
            </div>
          ) : (
            <>
              <form className="email-form" onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email for full report"
                  required
                />
                <button type="submit" disabled={emailLoading}>{emailLoading ? 'Sending your report...' : 'Get full report'}</button>
              </form>
              {emailError && <p className="message error">{emailError}</p>}
            </>
          )}
        </div>
      </section>

      <footer className="page-footer results-footer">
        <button className="secondary-button" onClick={() => router.push('/')}>Scan another site</button>
      </footer>
    </main>
  );
}
