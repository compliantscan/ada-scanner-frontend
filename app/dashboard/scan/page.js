'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../../../components/Dashboard/Icons/Icons';
import { getCachedSession } from '../../../lib/supabaseClient';
import { getApiUrl } from '../../../lib/apiUrl';
import './scan.css';

const SCAN_STAGES = [
  { pct: 5,   label: 'Queued…' },
  { pct: 20,  label: 'Launching browser…' },
  { pct: 45,  label: 'Loading page…' },
  { pct: 70,  label: 'Running accessibility scan…' },
  { pct: 90,  label: 'Analysing results…' },
  { pct: 100, label: 'Complete!' },
];

function stageFromProgress(pct) {
  for (let i = SCAN_STAGES.length - 1; i >= 0; i--) {
    if (pct >= SCAN_STAGES[i].pct) return SCAN_STAGES[i];
  }
  return SCAN_STAGES[0];
}

export default function ScanPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('single');
  const [reportType, setReportType] = useState('executive');

  // Scan state
  const [phase, setPhase] = useState('idle'); // idle | scanning | error
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidUrl = url.trim().startsWith('http://') || url.trim().startsWith('https://');

  async function handleStartScan() {
    if (!isValidUrl) return;
    const params = new URLSearchParams({
      url: url.trim(),
      scanType,
      reportType,
    });
    router.push(`/dashboard/scanning?${params.toString()}`);
    return;

    setPhase('scanning');
    setProgress(5);
    setErrorMsg('');

    try {
      const session = await getCachedSession();
      if (!session) {
        setErrorMsg('You must be logged in to run a scan.');
        setPhase('error');
        return;
      }

      const apiUrl = getApiUrl();
      // Kick off the scan
      const resp = await fetch(`${apiUrl}/dashboard/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          url: url.trim(),
          scan_type: scanType,
          report_type: reportType,
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.message || `Server error (${resp.status})`);
      }

      const { scanId } = await resp.json();
      if (!scanId) throw new Error('No scan ID returned from server.');

      // Poll for completion
      let attempts = 0;
      const MAX_ATTEMPTS = 120; // 2 min at 1s intervals

      const poll = async () => {
        attempts++;
        if (attempts > MAX_ATTEMPTS) {
          setErrorMsg('Scan is taking too long. Please try again.');
          setPhase('error');
          return;
        }

        try {
          const pollResp = await fetch(`${apiUrl}/dashboard/scan/${scanId}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });

          if (!pollResp.ok) throw new Error('Poll failed');
          const { scan } = await pollResp.json();
          const status = scan?.results_json?._status;
          const pct = scan?.results_json?._progress ?? 0;

          if (status === 'failed') {
            const errDetail = scan?.results_json?._error || 'Scan failed. Please try again.';
            setErrorMsg(errDetail);
            setPhase('error');
            return;
          }

          if (status === 'completed') {
            setProgress(100);
            setTimeout(() => router.push(`/dashboard/audit/${scanId}`), 500);
            return;
          }

          // Still running — update progress
          setProgress(Math.max(pct, 5));
          setTimeout(poll, 1000);
        } catch {
          setTimeout(poll, 2000);
        }
      };

      // Simulate early progress while waiting for first real update
      let sim = 5;
      const simInterval = setInterval(() => {
        sim = Math.min(sim + 3, 80);
        setProgress(p => (p < sim ? sim : p));
      }, 1500);
      setTimeout(() => clearInterval(simInterval), 30000);

      poll();
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setPhase('error');
    }
  }

  // Progress UI
  const currentStage = stageFromProgress(progress);

  return (
    <div className="scan-page">
      <div className="scan-page__header">
        <h1 className="scan-page__title">Start a New Scan</h1>
        <p className="scan-page__subtitle">
          Scan any website for WCAG 2.2 AA accessibility issues in under 60 seconds.
        </p>
      </div>

      <div className="scan-card">
        {/* URL Input */}
        <div className="scan-section">
          <h2 className="scan-section__title">Enter Website URL</h2>
          <div className="scan-input-group">
            <div className="scan-input-wrapper">
              <span className="scan-input-icon">
                <Icon name="globe" />
              </span>
              <input
                type="url"
                className="scan-input"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={phase === 'scanning'}
                onKeyDown={(e) => e.key === 'Enter' && isValidUrl && phase === 'idle' && handleStartScan()}
              />
            </div>
            <button
              className="scan-submit-btn"
              disabled={!isValidUrl || phase === 'scanning'}
              onClick={handleStartScan}
            >
              {phase === 'scanning' ? 'Scanning…' : 'Start Scan'}
              {phase !== 'scanning' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar */}
          {phase === 'scanning' && (
            <div className="scan-progress">
              <div className="scan-progress-header">
                <span className="scan-progress-label">{currentStage.label}</span>
                <span className="scan-progress-pct">{progress}%</span>
              </div>
              <div className="scan-progress-track">
                <div
                  className="scan-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {phase === 'error' && (
            <div className="scan-error">
              <Icon name="alert" />
              <span>{errorMsg}</span>
              <button className="scan-error-retry" onClick={() => setPhase('idle')}>Try again</button>
            </div>
          )}

          {/* Feature tags */}
          {phase === 'idle' && (
            <div className="scan-features">
              <div className="scan-feature">
                <span className="scan-feature-icon"><Icon name="check" /></span>
                Real browser scan
              </div>
              <div className="scan-feature">
                <span className="scan-feature-icon"><Icon name="check" /></span>
                WCAG 2.2 AA compliant
              </div>
              <div className="scan-feature">
                <span className="scan-feature-icon"><Icon name="check" /></span>
                No credit card required
              </div>
              <div className="scan-feature">
                <span className="scan-feature-icon"><Icon name="check" /></span>
                Results in under 60 seconds
              </div>
            </div>
          )}
        </div>

        <div className="scan-divider"></div>

        {/* Scan Type */}
        <div className="scan-section">
          <h2 className="scan-section__title">Scan Type</h2>
          <p className="scan-section__subtitle">Choose how you want to scan your website.</p>

          <div className="scan-grid-2">
            <div
              className={`scan-radio-card ${scanType === 'single' ? 'scan-radio-card--active' : ''}`}
              onClick={() => phase !== 'scanning' && setScanType('single')}
            >
              <div className="scan-radio-indicator"></div>
              <div className="scan-radio-icon">
                <Icon name="file" />
              </div>
              <div className="scan-radio-content">
                <h3 className="scan-radio-title">Single Page</h3>
                <p className="scan-radio-desc">Scan a single page URL for accessibility issues.</p>
              </div>
            </div>

            <div
              className={`scan-radio-card ${scanType === 'full' ? 'scan-radio-card--active' : ''}`}
              onClick={() => phase !== 'scanning' && setScanType('full')}
            >
              <div className="scan-radio-indicator"></div>
              <div className="scan-radio-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="10" y="3" width="4" height="4" />
                  <rect x="3" y="17" width="4" height="4" />
                  <rect x="17" y="17" width="4" height="4" />
                  <rect x="10" y="17" width="4" height="4" />
                  <line x1="12" y1="7" x2="12" y2="12" />
                  <line x1="5" y1="17" x2="5" y2="12" />
                  <line x1="19" y1="17" x2="19" y2="12" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="scan-radio-content">
                <h3 className="scan-radio-title">Full Website</h3>
                <p className="scan-radio-desc">Crawl and scan your entire website, including all accessible pages.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type */}
        <div className="scan-section" style={{ marginBottom: 0 }}>
          <h2 className="scan-section__title">Report Type</h2>
          <p className="scan-section__subtitle">Choose the type of report that best fits your needs.</p>

          <div className="scan-grid-3">
            <div
              className={`scan-radio-card ${reportType === 'executive' ? 'scan-radio-card--active' : ''}`}
              onClick={() => phase !== 'scanning' && setReportType('executive')}
            >
              <div className="scan-radio-indicator"></div>
              <div className="scan-radio-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
              <div className="scan-radio-content">
                <h3 className="scan-radio-title">Executive</h3>
                <p className="scan-radio-desc">High-level summary of issues with business impact and recommendations.</p>
              </div>
            </div>

            <div
              className={`scan-radio-card ${reportType === 'developer' ? 'scan-radio-card--active' : ''}`}
              onClick={() => phase !== 'scanning' && setReportType('developer')}
            >
              <div className="scan-radio-indicator"></div>
              <div className="scan-radio-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="scan-radio-content">
                <h3 className="scan-radio-title">Developer</h3>
                <p className="scan-radio-desc">Technical report with detailed issues, code references, and fix guidance.</p>
              </div>
            </div>

            <div
              className={`scan-radio-card ${reportType === 'both' ? 'scan-radio-card--active' : ''}`}
              onClick={() => phase !== 'scanning' && setReportType('both')}
            >
              <div className="scan-radio-indicator"></div>
              <div className="scan-radio-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                  <polyline points="8 16 10 14 12 16" />
                  <polyline points="14 10 16 8 18 10" />
                </svg>
              </div>
              <div className="scan-radio-content">
                <h3 className="scan-radio-title">Both</h3>
                <p className="scan-radio-desc">Get both Executive and Developer reports in one complete package.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scan-privacy-banner">
        <div className="scan-privacy-left">
          <div className="scan-privacy-icon">
            <Icon name="shield" />
          </div>
          <div>
            <h4 className="scan-privacy-title">Your data is secure</h4>
            <p className="scan-privacy-desc">We never store your website content. All scans are private and confidential.</p>
          </div>
        </div>
        <a href="/privacy" className="scan-privacy-link">
          Learn more about privacy
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}
