'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
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
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('adaScanResult');
    if (!raw) return setScan(null);
    try {
      const parsed = JSON.parse(raw);
      if (parsed.scanAccessKey) sessionStorage.setItem(`adaScanAccessKey:${parsed.id}`, parsed.scanAccessKey);
      setUnlocked(sessionStorage.getItem(`adaReportUnlocked:${parsed.id}`) === 'true');
      setScan(parsed);
    } catch {
      setScan(null);
    }
  }, []);

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
  const hidden = Math.max(0, (scan.violations || []).length - 3);
  const expires = scan.expiresAt ? new Date(scan.expiresAt).toLocaleDateString() : '7 days';

  return (
    <main className="page-container free-report-page">
      <section className="free-hero-card">
        <p className="eyebrow">{unlocked ? 'Full ADA compliance report' : 'Free ADA scan report'}</p>
        <div className="score-layout">
          <div className="score-dial" style={{ '--score': summary.score }} aria-label={`Accessibility score ${summary.score} out of 100`}>
            <span>{summary.score}</span>
            <small>{summary.grade}</small>
          </div>
          <div>
            <span className={`risk-pill ${riskClass[summary.riskLevel] || 'minor'}`}>{summary.riskLevel}</span>
            <h1>Your site has accessibility risk.</h1>
            <p className="hero-subtitle">
              {unlocked
                ? 'All violations are unlocked with source snippets, WCAG mapping, effort estimates, AI-generated fixes, PDF download, and badge code.'
                : 'The free report shows the top 3 violations with the same full detail and code-fix quality as the paid report.'}
            </p>
            <p className="expires-copy">
              Settlement range {summary.settlementRange || '$5,000-$25,000'} - Estimated fix time {summary.estimatedFixTime || 'Calculating'} - Free PDF download {unlocked ? 'enabled' : 'disabled'}.
              {!unlocked ? ` Free report expires on ${expires}.` : ''}
            </p>
          </div>
        </div>
      </section>

      <section className="report-summary-grid" aria-label="Report summary">
        <div><span>Total violations</span><strong>{scan.totalViolations}</strong></div>
        <div><span>Shown now</span><strong>{visibleViolations.length}</strong></div>
        <div><span>Grade</span><strong>{summary.grade}</strong></div>
        <div><span>Risk badge</span><strong>{summary.riskLevel}</strong></div>
      </section>

      {unlocked && (
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

      {!unlocked && (
        <section className="unlock-banner">
          <div>
            <p>{hidden} more violation{hidden === 1 ? '' : 's'} hidden</p>
            <span>Missing from free view: full violation list, PDF download, monitoring setup, and compliance badge embed code.</span>
          </div>
          <div className="cta-row">
            <a href="#email-unlock" className="scan-button">Enter email for full report</a>
            <button className="secondary-button dark" onClick={() => router.push(upgradeUrl)}>Upgrade to Pro</button>
          </div>
        </section>
      )}

      {!unlocked && (
        <section className="lead-card" id="email-unlock">
          <h2>Get the full report</h2>
          <p>Enter your email to unlock all findings on this page. The PDF will be generated and emailed in the background.</p>
          {emailSuccess ? <p className="message success">{emailSuccess}</p> : (
            <form className="email-form" onSubmit={handleEmailSubmit} noValidate>
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" aria-label="Email for full report" />
              <button type="submit" disabled={emailLoading}>{emailLoading ? 'Unlocking...' : 'Unlock full report'}</button>
            </form>
          )}
          {emailError && <p className="message error">{emailError}</p>}
        </section>
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
    </main>
  );
}
