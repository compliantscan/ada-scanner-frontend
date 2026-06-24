'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}
const apiUrl = getApiUrl();
const upgradeUrl = process.env.NEXT_PUBLIC_UPGRADE_URL || '/pricing';

const riskClass = {
  'CRITICAL RISK': 'critical',
  'HIGH RISK': 'serious',
  'MODERATE RISK': 'moderate',
  'LOW RISK': 'minor',
};

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sourceLabel(item) {
  if (item.sourceDetected) return `${item.filePath || 'Unknown file'}:${item.lineNumber || '?'}`;
  if (item.target) return `Runtime DOM target: ${item.target}`;
  return 'Runtime DOM - source line not detectable';
}

function escapeAttribute(value) {
  return String(value || '').replace(/"/g, '&quot;');
}

function ViolationCard({ item, index }) {
  return (
    <article className="report-violation-card">
      <div className="violation-card-header">
        <div>
          <p className="violation-index">Fix {index + 1}</p>
          <h3>{item.title}</h3>
          <p className="wcag-line">WCAG 2.1 AA {item.wcag.id} - {item.wcag.name}</p>
        </div>
        <span className={`risk-pill ${item.severity}`}>{item.severity}</span>
      </div>

      <p className="violation-description">{item.description}</p>

      <div className="detail-grid">
        <div><span>Affected elements</span><strong>{item.affectedElements}</strong></div>
        <div><span>Source</span><strong>{sourceLabel(item)}</strong></div>
        <div><span>Effort</span><strong>{item.fix.effort}</strong></div>
      </div>

      <div className="code-block">
        <span>HTML snippet</span>
        <pre><code>{item.elementHtml || 'No HTML snippet captured.'}</code></pre>
      </div>

      <div className="fix-preview">
        <strong>{item.fix.aiGenerated ? 'AI-generated code fix' : 'Generated code fix'}</strong>
        <div className="fix-code-grid">
          <div>
            <span>Replace this</span>
            <pre><code>{item.fix.replaceThis || item.elementHtml || 'Failing snippet unavailable.'}</code></pre>
          </div>
          <div>
            <span>With this</span>
            <pre><code>{item.fix.withThis}</code></pre>
          </div>
        </div>
        <p>{item.fix.explanation}</p>
      </div>
    </article>
  );
}

function ViolationCardAboveFold({ item, index }) {
  return (
    <article className="report-violation-card card-no-bottom-radius">
      <div className="violation-card-header">
        <div>
          <p className="violation-index">Fix {index + 1}</p>
          <h3>{item.title}</h3>
          <p className="wcag-line">WCAG 2.1 AA {item.wcag.id} - {item.wcag.name}</p>
        </div>
        <span className={`risk-pill ${item.severity}`}>{item.severity}</span>
      </div>
      <p className="violation-description">{item.description}</p>
      <div className="detail-grid">
        <div><span>Affected elements</span><strong>{item.affectedElements}</strong></div>
        <div><span>Source</span><strong>{sourceLabel(item)}</strong></div>
        <div><span>Effort</span><strong>{item.fix.effort}</strong></div>
      </div>
      <div className="code-block">
        <span>HTML snippet</span>
        <pre><code>{item.elementHtml || 'No HTML snippet captured.'}</code></pre>
      </div>
    </article>
  );
}

function ViolationCardBelowFold({ item }) {
  return (
    <article className="report-violation-card card-no-top-radius">
      <div className="fix-preview">
        <strong>{item.fix.aiGenerated ? 'AI-generated code fix' : 'Generated code fix'}</strong>
        <div className="fix-code-grid">
          <div>
            <span>Replace this</span>
            <pre><code>{item.fix.replaceThis || item.elementHtml || 'Failing snippet unavailable.'}</code></pre>
          </div>
          <div>
            <span>With this</span>
            <pre><code>{item.fix.withThis}</code></pre>
          </div>
        </div>
        <p>{item.fix.explanation}</p>
      </div>
    </article>
  );
}

const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    tagline: 'For small businesses who want to stay protected',
    features: ['1 website monitored', 'Weekly automated rescans', 'Email alerts on new violations', 'Full violation report', 'AI-generated fix for every issue', 'Professional PDF report'],
    featured: false,
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    tagline: 'For agencies managing multiple sites',
    features: ['5 websites monitored', 'Daily rescans', 'Everything in Starter', 'White-label PDF reports', 'Priority email support'],
    featured: true,
  },
  {
    name: 'Agency',
    monthlyPrice: 249,
    tagline: 'For web agencies with active client portfolios',
    features: ['25 websites monitored', 'Everything in Growth', 'Client-ready reports', 'Dedicated onboarding call', 'Custom plans available'],
    featured: false,
  },
];

function EmailGateModal({ onClose, onSubmit, onSuccess, email, setEmail, loading, error, success }) {
  return (
    <div className="ss-backdrop" role="dialog" aria-modal="true" aria-label="Unlock full report" onClick={onClose}>
      <div className="ss-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ss-modal-left">
          <h2 className="ss-headline">Get the Complete ADA Compliance Report</h2>
          <p className="ss-desc">You&apos;ve only seen the first few accessibility issues.</p>
          <p className="ss-desc">Enter your email to unlock the full report and receive a downloadable PDF with all compliance findings, severity levels, and recommended fixes.</p>
          {success ? (
            <p className="message success ss-success">{success}</p>
          ) : (
            <form className="ss-form" onSubmit={onSubmit} noValidate>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work Email Address" aria-label="Work email address" className="ss-input" />
              <button type="submit" className="ss-cta" disabled={loading}>{loading ? 'Unlocking...' : 'Unlock Full Report'}</button>
            </form>
          )}
          {error && <p className="message error">{error}</p>}
          <p className="ss-trust">No spam. Report delivered instantly.</p>
        </div>
        <div className="ss-modal-right">
          <h3 className="ss-right-headline">See Every Accessibility Issue Before Your Users Do</h3>
          <ul className="ss-bullets">
            <li><span className="ss-check">✓</span> WCAG violations detected</li>
            <li><span className="ss-check">✓</span> Severity breakdown included</li>
            <li><span className="ss-check">✓</span> Fix recommendations generated</li>
            <li><span className="ss-check">✓</span> Downloadable PDF report</li>
            <li><span className="ss-check">✓</span> Compliance summary score</li>
          </ul>
          <p className="ss-social-proof">Join 500+ website owners improving accessibility.</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [scan, setScan] = useState(null);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const blurGateRef = useRef(null);
  const fix4Ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('adaScanResult');
    if (!raw) return setScan(null);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.scanAccessKey) sessionStorage.setItem(`adaScanAccessKey:${parsed.id}`, parsed.scanAccessKey);
      const alreadyUnlocked = sessionStorage.getItem(`adaReportUnlocked:${parsed.id}`) === 'true';
      setUnlocked(alreadyUnlocked);
      setScan(parsed);
    } catch {
      setScan(null);
    }
  }, []);

  useEffect(() => {
    if (unlocked) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setModalOpen(true);
        } else if (entry.boundingClientRect.top > 0) {
          setModalOpen(false);
        }
      },
      { threshold: 0.1 }
    );
    if (blurGateRef.current) observer.observe(blurGateRef.current);
    return () => observer.disconnect();
  }, [unlocked, scan]);

  useEffect(() => {
    if (showEmailGate) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showEmailGate]);

  const visibleViolations = useMemo(() => {
    const all = scan?.violations || [];
    return unlocked ? all : all.slice(0, 3);
  }, [scan, unlocked]);

  if (scan === null) {
    return (
      <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">CompliantScan</a>
          <div className="nav-links">
            <a href="/#hero">Home</a>
            <a href="/#how-it-works">How it works</a>
            <a href="/#features">Features</a>
            <a href="/#pricing">Pricing</a>
            <a href="/#contact">Contact</a>
          </div>
        </div>
      </nav>
      <main className="page-container">
        <section className="hero-section">
          <p className="eyebrow">Scan results</p>
          <h1>Nothing to show yet</h1>
          <p className="hero-subtitle">Run a scan from the homepage first, then return here to see the free report.</p>
          <button className="secondary-button" onClick={() => router.push('/')}>Back to scan</button>
        </section>
      </main>
      </>
    );
  }

  async function handleEmailSubmit(event) {
    event.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);
    if (!email || !isValidEmail(email)) return setEmailError('Please enter a valid email address.');
    setEmailLoading(true);
    try {
      const response = await fetch(`${apiUrl}/collect-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, url: scan.url, scanId: scan.id }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Something went wrong - please try again.');
      setUnlocked(true);
      setShowEmailGate(false);
      setModalOpen(false);
      sessionStorage.setItem(`adaReportUnlocked:${scan.id}`, 'true');
      setEmailSuccess(payload.message || 'Full report unlocked. The PDF is being emailed to you.');
      setTimeout(() => fix4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setEmailError(err.message || 'Something went wrong - please try again.');
    } finally {
      setEmailLoading(false);
    }
  }

  async function downloadPdf() {
    setPdfError(null);
    setPdfLoading(true);
    try {
      const scanAccessKey = sessionStorage.getItem(`adaScanAccessKey:${scan.id}`) || scan.scanAccessKey || '';
      const response = await fetch(`${apiUrl}/lead-report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: scan.id, scanAccessKey }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || 'Unable to download PDF.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ada-full-report-${scan.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err.message);
    } finally {
      setPdfLoading(false);
    }
  }

  const summary = scan.executiveSummary || scan;
  const severityCounts = summary.severityCounts || { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const totalViolations = severityCounts.critical + severityCounts.serious + severityCounts.moderate + severityCounts.minor;
  const hasViolations = totalViolations > 0;
  const lockedViolations = unlocked ? [] : (scan.violations || []).slice(3);
  const expires = scan.expiresAt ? new Date(scan.expiresAt).toLocaleDateString() : '7 days';

  return (
    <>
    <nav className="nav">
      <div className="nav-inner">
        <a href="/" className="logo">CompliantScan</a>
        <div className="nav-links">
          <a href="/#hero">Home</a>
          <a href="/#how-it-works">How it works</a>
          <a href="/#features">Features</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#contact">Contact</a>
        </div>
      </div>
    </nav>
    <main className="page-container free-report-page">
      <section className="free-hero-card">
        <p className="eyebrow">{unlocked ? 'Full ADA compliance report' : 'Free ADA scan report'}</p>
        <div className="score-layout">
          <div>
            <span className={`risk-pill ${riskClass[summary.riskLevel] || 'minor'}`}>{summary.riskLevel}</span>
            <h1>{hasViolations ? 'Your site has accessibility risk.' : 'No accessibility issues detected.'}</h1>
            <p className="hero-subtitle">
              {!hasViolations
                ? 'Your website appears to comply with WCAG 2.1 AA standards. Keep monitoring for changes.'
                : unlocked
                ? 'All violations are unlocked with source snippets, WCAG mapping, effort estimates, AI-generated fixes, PDF download, and badge code.'
                : 'The free report shows the top 3 violations with the same full detail and code-fix quality as the paid report.'}
            </p>
            {hasViolations && (
              <div className="risk-alert-bar">
                <div className="risk-alert-item">
                  <span className="risk-alert-label">Settlement range</span>
                  <strong className="risk-alert-value">{summary.settlementRange || '$5,000–$25,000'}</strong>
                </div>
                <div className="risk-alert-divider" />
                <div className="risk-alert-item">
                  <span className="risk-alert-label">Estimated fix time</span>
                  <strong className="risk-alert-value">{summary.estimatedFixTime || 'Calculating'}</strong>
                </div>
                <div className="risk-alert-divider" />
                <div className="risk-alert-item">
                  <span className="risk-alert-label">PDF report</span>
                  <strong className="risk-alert-value">{unlocked ? '✓ Enabled' : '✗ Locked'}</strong>
                </div>
                {!unlocked && (
                  <>
                    <div className="risk-alert-divider" />
                    <div className="risk-alert-item">
                      <span className="risk-alert-label">Report expires</span>
                      <strong className="risk-alert-value">{expires}</strong>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {hasViolations && (
        <section className="report-summary-grid" aria-label="Report summary">
          <div><span>Critical</span><strong>{severityCounts.critical}</strong></div>
          <div><span>Serious</span><strong>{severityCounts.serious}</strong></div>
          <div><span>Moderate</span><strong>{severityCounts.moderate}</strong></div>
          <div><span>Minor</span><strong>{severityCounts.minor}</strong></div>
        </section>
      )}

      {unlocked && hasViolations && (
        <section className="paid-tools-panel">
          <button className="scan-button" onClick={downloadPdf} disabled={pdfLoading}>{pdfLoading ? 'Preparing PDF...' : 'Download PDF'}</button>
          <div className="badge-code">
            <span>Compliance badge embed code</span>
            <pre><code>{scan.complianceBadgeHtml || `<a href="${escapeAttribute(scan.url)}" aria-label="View accessibility status"><img src="${escapeAttribute(scan.url)}/ada-compliance-badge.svg" alt="ADA accessibility monitoring enabled"></a>`}</code></pre>
          </div>
          <button className="secondary-button" onClick={() => router.push(upgradeUrl)}>Set up monitoring</button>
          {pdfError && <p className="message error">{pdfError}</p>}
        </section>
      )}

      {hasViolations && (
        <section className="trailer-section">
          <div className="section-row">
            <div>
              <p className="eyebrow">Priority checklist</p>
              <h2>{unlocked ? 'All violations, sorted by remediation priority' : 'Top 3 violations with full detail'}</h2>
            </div>
            <p className="locked-note">{unlocked ? 'Full report unlocked' : 'No PDF download'}</p>
          </div>

          <div className="fix-list-wrap">
            <div className="free-violation-list">
              {visibleViolations.map((violation, index) => (
                <div key={`${violation.ruleId}-${index}`}>
                  <ViolationCard item={violation} index={index} />
                </div>
              ))}
            </div>

            {!unlocked && lockedViolations.length > 0 && (
              <>
                <div className="blur-gate-cards">
                  {lockedViolations.slice(0, 2).map((violation, index) => (
                    <ViolationCard key={`locked-${index}`} item={violation} index={index + 3} />
                  ))}
                </div>
                <div className="blur-gate-overlay" ref={blurGateRef} />
              </>
            )}
          </div>
        </section>
      )}

      {/* Paywall modal — backdrop + pricing cards, scroll-dismissed */}
      {!unlocked && modalOpen && (
        <>
          <div className={`paywall-backdrop${modalOpen ? ' open' : ''}`} onClick={() => setModalOpen(false)} />
          <div className={`paywall-modal${modalOpen ? ' open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <p className="paywall-modal-eyebrow">Unlock the full report</p>
            <h2 className="paywall-modal-title">Your site has more issues to fix</h2>
            <p className="paywall-modal-sub">Choose a plan to unlock all violations, AI-generated fixes, and ongoing monitoring.</p>
            <div className="paywall-cards-grid">
              {PLANS.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`pricing-drawer-card${plan.featured ? ' featured' : ''}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-tagline">{plan.tagline}</p>
                  <div className="plan-price">
                    <span className="price-amount">${plan.monthlyPrice}</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <button className="plan-cta" onClick={() => setShowEmailGate(true)}>Start monitoring</button>
                  <ul className="plan-features">
                    {plan.features.map((f, fi) => <li key={fi}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* email gate modal */}
      {!unlocked && showEmailGate && (
        <EmailGateModal
          email={email}
          setEmail={setEmail}
          loading={emailLoading}
          error={emailError}
          success={emailSuccess}
          onClose={() => setShowEmailGate(false)}
          onSubmit={handleEmailSubmit}
        />
      )}

      {unlocked && (
        <section className="page-breakdown">
          <h2>Page-by-page breakdown</h2>
          <table>
            <thead><tr><th>Page scanned</th><th>Violations</th><th>Density</th></tr></thead>
            <tbody>
              {(scan.pages || []).map(page => (
                <tr key={page.url}><td>{page.url}</td><td>{page.violations}</td><td>{page.density}/page</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="scan-footer">
        <button className="scan-another-button" onClick={() => router.push('/')}>Scan another site</button>
      </section>
    </main>
    </>
  );
}
