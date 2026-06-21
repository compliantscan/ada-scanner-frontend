'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function PaidReportPage() {
  const { scanId } = useParams();
  const [token, setToken] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const fromHash = hash.get('access_token');
    if (fromHash) {
      sessionStorage.setItem('adaPaidReportToken', fromHash);
      setToken(fromHash);
    } else {
      setToken(sessionStorage.getItem('adaPaidReportToken') || '');
    }
  }, []);

  async function loadReport(event) {
    event?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const scanAccessKey = sessionStorage.getItem(`adaScanAccessKey:${scanId}`) || '';
      const response = await fetch(`${apiUrl}/paid-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scanId, scanAccessKey }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || 'Unable to load paid report.');
      setReport(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    const scanAccessKey = sessionStorage.getItem(`adaScanAccessKey:${scanId}`) || '';
    const response = await fetch(`${apiUrl}/paid-report/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ scanId, scanAccessKey }),
    });
    if (!response.ok) return setError('Unable to download PDF.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ada-paid-report-${scanId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="page-container paid-report-page">
      <section className="hero-section compact-hero">
        <p className="eyebrow">Paid report</p>
        <h1>Full ADA compliance report</h1>
        <p className="hero-subtitle">Paste the subscription access token issued after checkout to unlock this scan.</p>
        {!report && (
          <form className="scan-form" onSubmit={loadReport}>
            <input className="site-input" value={token} onChange={(event) => setToken(event.target.value)} placeholder="Subscription access token" />
            <button className="scan-button" disabled={loading || !token}>{loading ? 'Loading...' : 'Unlock report'}</button>
          </form>
        )}
        {error && <p className="message error">{error}</p>}
      </section>
      {report && (
        <section className="paid-report-shell">
          <div className="paid-summary-grid">
            <div><span>Score</span><strong>{report.executiveSummary.score}</strong></div>
            <div><span>Risk</span><strong>{report.executiveSummary.riskLevel}</strong></div>
            <div><span>Fix time</span><strong>{report.executiveSummary.estimatedFixTime}</strong></div>
            <button className="scan-button" onClick={downloadPdf}>Download PDF</button>
          </div>
          <h2>Priority checklist</h2>
          <ol className="priority-list">
            {report.priorityChecklist.map(item => <li key={item.ruleId}><strong>{item.title}</strong><span>{item.riskReductionPerHour} risk-reduction pts/hr</span></li>)}
          </ol>
          <h2>All violations</h2>
          <div className="paid-violations">
            {report.violations.map(item => (
              <article key={item.ruleId} className="paid-violation-card">
                <span className={`risk-pill ${item.severity}`}>{item.severity}</span>
                <h3>{item.title}</h3>
                <p>WCAG 2.1 AA {item.wcag.id} · {item.wcag.name}</p>
                <pre>{item.elementHtml || 'No HTML snippet captured.'}</pre>
                <div className="fix-preview">
                  <strong>{item.fix.aiGenerated ? 'AI-generated fix' : 'Suggested fix'}</strong>
                  <div className="fix-code-grid">
                    <div>
                      <span>Replace this</span>
                      <pre>{item.fix.replaceThis || item.elementHtml || 'Failing snippet unavailable.'}</pre>
                    </div>
                    <div>
                      <span>With this</span>
                      <pre>{item.fix.withThis}</pre>
                    </div>
                  </div>
                  <p>{item.fix.explanation}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
