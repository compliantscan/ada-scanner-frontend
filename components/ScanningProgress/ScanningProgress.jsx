'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const STEPS = [
  { id: 'loading',    label: 'Loading website in real browser',         sub: 'Opening your URL in a real Chrome browser' },
  { id: 'crawling',   label: 'Crawling internal pages',                 sub: 'Discovering all pages and content' },
  { id: 'wcag',       label: 'Running WCAG checks',                     sub: 'Checking for accessibility violations' },
  { id: 'forms',      label: 'Detecting forms and interactive elements', sub: 'Analyzing inputs, buttons, and controls' },
  { id: 'contrast',   label: 'Checking color contrast ratios',          sub: 'Verifying contrast meets WCAG standards' },
  { id: 'keyboard',   label: 'Testing keyboard navigation',             sub: 'Checking focus order and keyboard accessibility' },
  { id: 'landmarks',  label: 'Checking landmarks and headings',         sub: 'Validating page structure and semantics' },
  { id: 'report',     label: 'Generating your report',                  sub: 'Compiling results and AI insights' },
];

// Spread the visual step advances evenly over ~55s (leaving last step for real completion)
const STEP_INTERVAL_MS = 6500;

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

function CircularProgress({ pct }) {
  const radius = 48;
  const stroke = 6;
  const norm = radius - stroke / 2;
  const circ = 2 * Math.PI * norm;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="60" cy="60" r={norm} fill="none" stroke="#e7e4da" strokeWidth={stroke} />
      <circle
        cx="60" cy="60" r={norm}
        fill="none"
        stroke="#1c4532"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

export default function ScanningProgress() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';

  const [completedSteps, setCompletedSteps] = useState(0);
  const [done, setDone]   = useState(false);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  // Visual step advancement
  useEffect(() => {
    if (done || error) return;
    // Don't advance beyond second-to-last step visually; last step = report generation (held for real done)
    if (completedSteps >= STEPS.length - 2) return;

    const t = setTimeout(() => setCompletedSteps(p => p + 1), STEP_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [completedSteps, done, error]);

  // Fire real scan once
  useEffect(() => {
    if (!url || hasFetched.current) return;
    hasFetched.current = true;

    async function runScan() {
      try {
        const res = await fetch(`${getApiUrl()}/scan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Scan failed.');
        sessionStorage.setItem('adaScanResult', JSON.stringify(data));
        setCompletedSteps(STEPS.length);
        setDone(true);
      } catch (err) {
        setError(err.message || 'Scan failed. Please try again.');
      }
    }

    runScan();
  }, [url]);

  // Redirect after done
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.push('/results'), 900);
    return () => clearTimeout(t);
  }, [done, router]);

  if (!url) {
    if (typeof window !== 'undefined') router.replace('/');
    return null;
  }

  const displayUrl = url.replace(/^https?:\/\//, '');
  // percent: each completed step = 1/(total) of 100, capped visual to 95 until truly done
  const pct = done ? 100 : Math.min(Math.round((completedSteps / STEPS.length) * 100), 95);

  const getStepStatus = (index) => {
    if (done || index < completedSteps) return 'complete';
    if (index === completedSteps) return 'active';
    return 'pending';
  };

  if (error) {
    return (
      <div style={{ ...page, flexDirection: 'column', gap: '20px' }}>
        <div style={{ maxWidth: 480, width: '100%', background: 'var(--color-cream-paper)', border: '1px solid var(--color-border)', borderRadius: 16, padding: 32, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#d64545', margin: '0 0 8px' }}>Scan failed</p>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-text-secondary)', margin: '0 0 24px' }}>{error}</p>
          <button onClick={() => router.push('/')} style={{ padding: '12px 28px', background: 'var(--color-brand-green)', color: '#fff', border: 'none', borderRadius: 8, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
            ← Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={shell}>
        {/* ── LEFT PANEL ─────────────────────────────────────────── */}
        <div style={leftPanel}>
          {/* Badge */}
          <div style={badge}>
            <span style={badgeDot} />
            SCANNING YOUR WEBSITE
          </div>

          {/* Headline */}
          <h1 style={headline}>
            Scanning in<br />real browser...
          </h1>
          <p style={sub}>
            We analyze your website just like a real visitor would — checking for accessibility issues, WCAG 2.2 AA compliance, and better user experience.
          </p>

          {/* URL card */}
          <div style={urlCard}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--color-text-muted)' }}>Scanning</p>
              <p style={{ margin: '2px 0 6px', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--color-text-primary)' }}>{displayUrl}</p>
              <p style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--color-text-muted)' }}>This may take up to 60 seconds</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────── */}
        <div style={rightPanel}>
          {/* Steps list */}
          <div style={{ flex: 1 }}>
            {STEPS.map((step, i) => {
              const status = getStepStatus(i);
              return (
                <div key={step.id} style={stepRow}>
                  {/* Number / check circle */}
                  <div style={{
                    ...stepCircle,
                    background: status === 'complete' ? 'var(--color-brand-green)' : 'transparent',
                    border: status === 'complete'
                      ? 'none'
                      : status === 'active'
                        ? '2px solid var(--color-brand-green)'
                        : '2px solid var(--color-border-strong)',
                    color: status === 'complete' ? '#fff' : status === 'active' ? 'var(--color-brand-green)' : 'var(--color-text-muted)',
                  }}>
                    {status === 'complete' ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12.5l4.5 4.5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontFamily: 'var(--font-sans)',
                      fontWeight: status === 'pending' ? 400 : 600,
                      fontSize: 15,
                      color: status === 'pending' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    }}>{step.label}</p>
                    <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-sans)', fontSize: 12.5, color: 'var(--color-text-muted)' }}>{step.sub}</p>
                  </div>

                  {/* Status label */}
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: status === 'complete'
                      ? 'var(--color-brand-green)'
                      : status === 'active'
                        ? 'var(--color-brand-green)'
                        : 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {status === 'complete' ? 'Completed' : status === 'active' ? 'In progress' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Circular progress */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: 32, borderLeft: '1px solid var(--color-border)' }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <CircularProgress pct={pct} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}>{pct}%</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'var(--color-brand-green)', fontWeight: 600 }}>Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER TRUST BAR ───────────────────────────────────────── */}
      <div style={footer}>
        {/* Left trust statement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-brand-green)', flexShrink: 0 }}>
            <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Our scans are accurate because we use a real browser environment, just like your visitors. No shortcuts, just real results.
          </p>
        </div>

        {/* Right trust icons */}
        <div style={{ display: 'flex', gap: 36, alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { label: 'Real Browser Scan', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z" stroke="currentColor" strokeWidth="1.5"/></svg> },
            { label: 'WCAG 2.2 AA', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5"/></svg> },
            { label: 'Secure & Private', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5"/></svg> },
            { label: 'Trusted by Agencies', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><circle cx="15" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 20c0-3.3 3.1-6 7-6M22 20c0-3.3-3.1-6-7-6M9 20c0-3.3 1.3-6 3-6s3 2.7 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)' }}>
              {item.icon}
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 500, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scanPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}

/* ── inline style objects ──────────────────────────────────────────── */
const page = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-cream)',
};

const shell = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  gap: 0,
  maxWidth: 1100,
  width: '100%',
  margin: '0 auto',
  padding: '56px 40px 40px',
  alignItems: 'start',
};

const leftPanel = {
  paddingRight: 48,
  borderRight: '1px solid var(--color-border)',
  paddingTop: 4,
};

const badge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontFamily: 'var(--font-sans)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: 'var(--color-brand-green)',
  textTransform: 'uppercase',
  marginBottom: 24,
};

const badgeDot = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  background: 'var(--color-brand-green)',
  display: 'inline-block',
  animation: 'scanPulse 1.4s ease-in-out infinite',
};

const headline = {
  fontFamily: 'var(--font-serif)',
  fontSize: 44,
  fontWeight: 400,
  lineHeight: 1.15,
  color: 'var(--color-text-primary)',
  margin: '0 0 16px',
};

const sub = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14.5,
  lineHeight: 1.65,
  color: 'var(--color-text-secondary)',
  margin: '0 0 32px',
};

const urlCard = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
  background: 'var(--color-cream-paper)',
  border: '1px solid var(--color-border)',
  borderRadius: 12,
  padding: '18px 20px',
};

const rightPanel = {
  display: 'flex',
  gap: 0,
  paddingLeft: 48,
  alignItems: 'flex-start',
};

const stepRow = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 16,
  padding: '14px 0',
  borderBottom: '1px solid var(--color-border)',
};

const stepCircle = {
  width: 30,
  height: 30,
  minWidth: 30,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.25s ease, border-color 0.25s ease',
  marginTop: 2,
};

const footer = {
  borderTop: '1px solid var(--color-border)',
  padding: '20px 40px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 32,
  maxWidth: 1100,
  width: '100%',
  margin: '0 auto',
  flexWrap: 'wrap',
};
