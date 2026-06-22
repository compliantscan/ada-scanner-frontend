'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
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

export default function ResultsPage() {
  const [scan, setScan] = useState(null);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [showBlur, setShowBlur] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const blurTriggerRef = useRef(null);
  const modalTriggerRef = useRef(null);
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

    function check() {
      if (blurTriggerRef.current) {
        const r = blurTriggerRef.current.getBoundingClientRect();
        setShowBlur(r.top < window.innerHeight);
      }
      if (modalTriggerRef.current) {
        const r = modalTriggerRef.current.getBoundingClientRect();
        setShowModal(r.top < window.innerHeight);
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, [unlocked, scan]);

  const visibleViolations = useMemo(() => {
    const all = scan?.violations || [];
    return unlocked ? all : all.slice(0, 3);
  }, [scan, unlocked]);

  if (scan === null) {
    return (
      <main className="page-container">
        <section className="hero-section">
          <p className="eyebrow">Scan results</p>
          <h1>Nothing to show yet</h1>
          <p className="hero-subtitle">Run a scan from the homepage first, then return here to see the free report.</p>
          <button className="secondary-button" onClick={() => router.push('/')}>Back to scan</button>
        </section>
      </main>
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
      setShowModal(false);
      setShowBlur(false);
      sessionStorage.setItem(`adaReportUnlocked:${scan.id}`, 'true');
      setEmailSuccess(payload.message || 'Full report unlocked. The PDF is being emailed to you.');
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
    <main className="page-container free-report-page">
      <section className="free-hero-card">
        <p className="eyebrow">{unlocked ? 'Full ADA compliance report' : 'Free ADA scan report'}</p>
        <div className="score-layout">
          <div className="score-dial" style={{ '--score': summary.score }} aria-label={`Accessibility score ${summary.score} out of 100`}>
            <span>{summary.score}</span>
          </div>
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
              <p className="expires-copy">
                Settlement range {summary.settlementRange || '$5,000-$25,000'} · Estimated fix time {summary.estimatedFixTime || 'Calculating'} · Free PDF {unlocked ? 'enabled' : 'disabled'}.
                {!unlocked ? ` Free report expires ${expires}.` : ''}
              </p>
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
          <div className="free-violation-list">
            {visibleViolations.map((violation, index) => (
              <ViolationCard key={`${violation.ruleId}-${index}`} item={violation} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* blur trigger: placed right after the 3 visible cards */}
      {!unlocked && hasViolations && <div ref={blurTriggerRef} style={{ height: 0 }} />}

      {/* locked blurred cards */}
      {!unlocked && hasViolations && lockedViolations.length > 0 && (
        <div className={`gate-blurred-section${showBlur ? ' visible' : ''}`}>
          <div className="gate-blurred-cards">
            {lockedViolations.slice(0, 1).map((violation, index) => (
              <ViolationCard key={`locked-${index}`} item={violation} index={index + 3} />
            ))}
          </div>
          {/* modal trigger: right after the single blurred card */}
          <div ref={modalTriggerRef} style={{ height: 0, marginTop: 80 }} />
        </div>
      )}

      {/* full-screen overlay modal */}
      {!unlocked && showModal && (
        <div className="ss-backdrop" role="dialog" aria-modal="true" aria-label="Unlock full report">
          <div className="ss-modal">
            <div className="ss-modal-left">
              <h2 className="ss-headline">Get the Complete ADA Compliance Report</h2>
              <p className="ss-desc">You've only seen the first few accessibility issues.</p>
              <p className="ss-desc">Enter your email to unlock the full report and receive a downloadable PDF with all compliance findings, severity levels, and recommended fixes.</p>
              {emailSuccess ? (
                <p className="message success ss-success">{emailSuccess}</p>
              ) : (
                <form className="ss-form" onSubmit={handleEmailSubmit} noValidate>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work Email Address"
                    aria-label="Work email address"
                    className="ss-input"
                  />
                  <button type="submit" className="ss-cta" disabled={emailLoading}>
                    {emailLoading ? 'Unlocking...' : 'Unlock Full Report'}
                  </button>
                </form>
              )}
              {emailError && <p className="message error">{emailError}</p>}
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
  );
}
