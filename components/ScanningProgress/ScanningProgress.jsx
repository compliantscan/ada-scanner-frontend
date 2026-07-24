'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getApiUrl } from '../../lib/apiUrl';
import { getCachedSession } from '../../lib/supabaseClient';
import styles from './ScanningProgress.module.css';

const STAGES = [
  { at: 0, title: 'Opening the website', detail: 'Loading the homepage in a real browser' },
  { at: 24, title: 'Inspecting page structure', detail: 'Reviewing headings, forms, links, and images' },
  { at: 50, title: 'Running accessibility checks', detail: 'Testing detectable WCAG 2.2 AA issues' },
  { at: 78, title: 'Preparing your results', detail: 'Prioritizing findings and building the report' },
];

function normalizeUrl(value) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return '';
  try {
    const normalized = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(normalized);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

function getDomain(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return 'your website';
  }
}

async function readResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || body.error || `The scan could not start (${response.status}).`);
  return body;
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });
}

function CheckIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 3.5 3.5L16 5.75" /></svg>;
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    </svg>
  );
}

export default function ScanningProgress({ mode = 'public' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetUrl = useMemo(() => normalizeUrl(searchParams.get('url') || ''), [searchParams]);
  const domain = useMemo(() => getDomain(targetUrl), [targetUrl]);
  const scanType = searchParams.get('scanType') || 'single';
  const reportType = searchParams.get('reportType') || 'executive';
  const [progress, setProgress] = useState(4);
  const [status, setStatus] = useState('scanning');
  const [error, setError] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [runNumber, setRunNumber] = useState(0);
  const progressRef = useRef(progress);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (status !== 'scanning') return undefined;
    const timer = setInterval(() => {
      setProgress((current) => {
        const increment = current < 26 ? 5 : current < 58 ? 3 : current < 82 ? 2 : 1;
        return Math.min(current + increment, 92);
      });
    }, 1100);
    return () => clearInterval(timer);
  }, [status, runNumber]);

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    const completeAndNavigate = async (destination, preview) => {
      if (disposed) return;
      if (preview) setScreenshot(preview);
      setProgress(100);
      setStatus('complete');
      await wait(900, controller.signal);
      if (!disposed) router.replace(destination);
    };

    const runPublicScan = async () => {
      const payload = await readResponse(await fetch(`${getApiUrl()}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
        signal: controller.signal,
      }));
      sessionStorage.setItem('adaScanResult', JSON.stringify(payload));
      await completeAndNavigate('/results', payload.homepageScreenshot);
    };

    const runDashboardScan = async () => {
      const session = await getCachedSession();
      if (!session?.access_token) {
        router.replace(`/login?redirect=${encodeURIComponent(`/dashboard/scanning?url=${targetUrl}`)}`);
        return;
      }

      const apiUrl = getApiUrl();
      const authHeaders = { Authorization: `Bearer ${session.access_token}` };
      const started = await readResponse(await fetch(`${apiUrl}/dashboard/scan`, {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, scan_type: scanType, report_type: reportType }),
        signal: controller.signal,
      }));
      const scanId = started.scanId || started.id;
      if (!scanId) throw new Error('The scan started without a report ID. Please try again.');

      for (let attempt = 0; attempt < 160; attempt += 1) {
        await wait(attempt === 0 ? 900 : 1500, controller.signal);
        const poll = await readResponse(await fetch(`${apiUrl}/dashboard/scan/${scanId}`, {
          headers: authHeaders,
          cache: 'no-store',
          signal: controller.signal,
        }));
        const scan = poll.scan || poll;
        const results = scan?.results_json || scan?.results || {};
        const scanStatus = results._status || scan?.status;
        const realProgress = Number(results._progress || scan?.progress || 0);

        if (realProgress > progressRef.current) setProgress(Math.min(realProgress, 96));
        if (results.homepageScreenshot) setScreenshot(results.homepageScreenshot);
        if (scanStatus === 'failed') throw new Error(results._error || 'The scan could not be completed.');
        if (scanStatus === 'completed' || realProgress >= 100) {
          await completeAndNavigate(`/dashboard/audit/${scanId}`, results.homepageScreenshot);
          return;
        }
      }
      throw new Error('The scan is taking longer than expected. Please try again.');
    };

    const start = async () => {
      if (!targetUrl) {
        setStatus('error');
        setError('The website address is missing or invalid.');
        return;
      }
      try {
        setError('');
        setProgress(4);
        setStatus('scanning');
        if (mode === 'dashboard') await runDashboardScan();
        else await runPublicScan();
      } catch (scanError) {
        if (scanError?.name === 'AbortError' || disposed) return;
        setStatus('error');
        setError(scanError?.message || 'The scan could not be completed. Please try again.');
      }
    };

    const startTimer = setTimeout(start, 0);
    return () => {
      disposed = true;
      clearTimeout(startTimer);
      controller.abort();
    };
  }, [mode, reportType, router, runNumber, scanType, targetUrl]);

  const activeStage = STAGES.reduce((active, stage, index) => progress >= stage.at ? index : active, 0);
  const isDashboard = mode === 'dashboard';

  return (
    <main className={`${styles.page} ${isDashboard ? styles.dashboardPage : ''}`}>
      {!isDashboard && (
        <a className={styles.brand} href="/" aria-label="CompliantScan home">
          <img src="/compliantscan-mark.png" alt="" /><span>CompliantScan</span>
        </a>
      )}

      <section className={styles.scanShell} aria-live="polite">
        <div className={styles.previewColumn}>
          <div className={styles.previewHeading}>
            <div><span className={styles.eyebrow}>Website preview</span><strong>{domain}</strong></div>
            <span className={`${styles.liveBadge} ${status === 'error' ? styles.errorBadge : ''}`}>
              <span />
              {status === 'complete' ? 'Scan complete' : status === 'error' ? 'Scan paused' : 'Scanning live'}
            </span>
          </div>

          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span className={styles.browserDots}><i /><i /><i /></span>
              <span className={styles.addressBar}><GlobeIcon />{targetUrl || 'Website address'}</span>
            </div>
            <div className={styles.browserViewport}>
              <div className={styles.previewFallback}>
                <span>{domain.charAt(0).toUpperCase()}</span><p>Opening {domain}</p>
              </div>
              {screenshot ? (
                <img className={styles.sitePreview} src={screenshot} alt={`Homepage preview of ${domain}`} />
              ) : targetUrl ? (
                <iframe
                  className={styles.siteFrame}
                  src={targetUrl}
                  title={`Live preview of ${domain}`}
                  tabIndex="-1"
                  sandbox="allow-forms allow-scripts allow-same-origin"
                />
              ) : null}
              {status === 'scanning' && (
                <><div className={styles.scanTint} /><div className={styles.scanLine}><span>Checking page</span></div><div className={styles.scanGrid} /></>
              )}
            </div>
          </div>
          <p className={styles.previewNote}><span><GlobeIcon /></span>We are checking the live page in a real browser.</p>
        </div>

        <div className={styles.statusColumn}>
          <div className={`${styles.radar} ${status !== 'scanning' ? styles.radarStopped : ''}`}>
            <span className={styles.radarRing} /><span className={styles.radarRing} />
            <span className={styles.radarCore}>{status === 'complete' ? <CheckIcon /> : <img src="/compliantscan-mark.png" alt="" />}</span>
          </div>
          <span className={styles.eyebrow}>
            {status === 'complete' ? 'Finished' : status === 'error' ? 'Needs attention' : 'Accessibility scan in progress'}
          </span>
          <h1>{status === 'complete' ? 'Your results are ready' : status === 'error' ? 'We could not finish this scan' : `Scanning ${domain}`}</h1>
          <p className={styles.statusLead}>
            {status === 'complete' ? 'Opening your accessibility report now.' : status === 'error' ? error : 'Keep this page open while we inspect the site and prepare a clear, prioritized report.'}
          </p>

          {status !== 'error' ? (
            <>
              <div className={styles.progressMeta}><span>{status === 'complete' ? 'Complete' : STAGES[activeStage].title}</span><strong>{Math.round(progress)}%</strong></div>
              <div className={styles.progressTrack} role="progressbar" aria-label="Website scan progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <ol className={styles.stages}>
                {STAGES.map((stage, index) => {
                  const complete = status === 'complete' || index < activeStage;
                  const active = status !== 'complete' && index === activeStage;
                  return (
                    <li key={stage.title} className={`${complete ? styles.stageComplete : ''} ${active ? styles.stageActive : ''}`}>
                      <span className={styles.stageIcon}>{complete ? <CheckIcon /> : index + 1}</span>
                      <span><strong>{stage.title}</strong><small>{stage.detail}</small></span>
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <div className={styles.errorActions}>
              <button type="button" onClick={() => setRunNumber((value) => value + 1)}>Try scan again</button>
              <button type="button" className={styles.secondaryButton} onClick={() => router.push(isDashboard ? '/dashboard/scan' : '/')}>Change website</button>
            </div>
          )}
          <div className={styles.trustRow}>
            <span><CheckIcon /> Real browser</span><span><CheckIcon /> WCAG 2.2 AA</span><span><CheckIcon /> Private scan</span>
          </div>
        </div>
      </section>
    </main>
  );
}
