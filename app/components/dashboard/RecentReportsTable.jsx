'use client';

import { useRouter } from 'next/navigation';
import Icon, { ScoreRing } from './Icons';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ViolationCell({ violations, violationsChange }) {
  return (
    <div>
      <div className="recent-reports__violations">{violations}</div>
      {violationsChange !== null && violationsChange > 0 && (
        <div className="recent-reports__violations-meta recent-reports__violations-meta--up">
          ↗ {violationsChange} new
        </div>
      )}
      {violationsChange !== null && violationsChange < 0 && (
        <div className="recent-reports__violations-meta recent-reports__violations-meta--down">
          ↘ {Math.abs(violationsChange)} fewer
        </div>
      )}
      {violationsChange === null && (
        <div className="recent-reports__violations-meta">—</div>
      )}
    </div>
  );
}

function SkeletonRow() {
  const shimmer = {
    display: 'inline-block',
    borderRadius: '6px',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    height: '14px',
  };

  return (
    <tr>
      <td>
        <div className="recent-reports__website">
          <div className="recent-reports__site-icon">
            <Icon name="globe" />
          </div>
          <div>
            <div style={{ ...shimmer, width: '100px', marginBottom: '6px' }} aria-hidden="true" />
            <div style={{ ...shimmer, width: '140px' }} aria-hidden="true" />
          </div>
        </div>
      </td>
      <td><span style={{ ...shimmer, width: '80px' }} aria-hidden="true" /></td>
      <td><span style={{ ...shimmer, width: '20px' }} aria-hidden="true" /></td>
      <td><span style={{ ...shimmer, width: '44px', height: '44px', borderRadius: '50%' }} aria-hidden="true" /></td>
      <td><span style={{ ...shimmer, width: '30px' }} aria-hidden="true" /></td>
      <td><span style={{ ...shimmer, width: '70px' }} aria-hidden="true" /></td>
      <td><span style={{ ...shimmer, width: '110px' }} aria-hidden="true" /></td>
      <td>
        <div className="recent-reports__actions">
          {[1, 2, 3, 4].map((i) => (
            <button key={i} type="button" className="recent-reports__action-btn" disabled aria-hidden="true">
              <Icon name={['eye', 'download', 'share', 'more'][i - 1]} />
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}

export default function RecentReportsTable({ reports = [], isInitialLoading = false, title = 'Recent reports', subtitle = 'Your latest accessibility scans and generated reports', showViewAll = true }) {
  const router = useRouter();

  function handleView(report) {
    // Navigate to the authenticated audit page
    if (report.id) {
      router.push(`/dashboard/audit/${report.id}`);
    } else {
      console.log('[Dashboard] View report — no id available:', report);
    }
  }

  async function handleDownload(report) {
    if (!report.id) {
      console.log('[Dashboard] Download — no scan id available');
      return;
    }
    const apiUrl = getApiUrl();
    try {
      const response = await fetch(`${apiUrl}/lead-report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId: report.id }),
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ada-report-${report.id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log('[Dashboard] PDF download error:', err.message);
    }
  }

  function handleShare(report) {
    if (!report.id) {
      console.log('[Dashboard] Share — no scan id available');
      return;
    }
    const link = `${window.location.origin}/report/${report.id}`;
    navigator.clipboard?.writeText(link).catch(() => {});
    console.log('[Dashboard] Share link copied:', link);
  }

  return (
    <section className="recent-reports">
      <div className="recent-reports__header">
        <div>
          <h2 className="recent-reports__title">{title}</h2>
          <p className="recent-reports__subtitle">{subtitle}</p>
        </div>
        {showViewAll && (
          <button type="button" className="recent-reports__view-all" onClick={() => router.push('/dashboard/reports')}>
            View all reports
          </button>
        )}
      </div>

      <div className="recent-reports__table-wrap">
        <table className="recent-reports__table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Scan Type</th>
              <th>Pages</th>
              <th>Score</th>
              <th>Violations</th>
              <th>Risk Level</th>
              <th>Scanned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loading skeleton — only on first load with no data */}
            {isInitialLoading && reports.length === 0 && (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            )}

            {/* Empty state */}
            {!isInitialLoading && reports.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <span style={{ opacity: 0.4 }}>
                      <Icon name="file" />
                    </span>
                    <p style={{ margin: 0, fontSize: '15px' }}>
                      No scans yet. Run your first scan to generate a report.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {/* Real data rows */}
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <div className="recent-reports__website">
                    <div className="recent-reports__site-icon">
                      <Icon name="globe" />
                    </div>
                    <div>
                      <div className="recent-reports__site-name">{report.domain}</div>
                      <div className="recent-reports__site-url">{report.url}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`recent-reports__badge recent-reports__badge--${report.scanTypeVariant}`}>
                    {report.scanType}
                  </span>
                </td>
                <td>{report.pages}</td>
                <td>
                  <ScoreRing score={report.score} />
                </td>
                <td>
                  <ViolationCell
                    violations={report.violations}
                    violationsChange={report.violationsChange}
                  />
                </td>
                <td>
                  <span className={`recent-reports__badge recent-reports__badge--${report.riskVariant}`}>
                    {report.riskLevel}
                  </span>
                </td>
                <td>
                  <span className="recent-reports__date">{formatDate(report.scannedAt)}</span>
                </td>
                <td>
                  <div className="recent-reports__actions">
                    <button
                      type="button"
                      className="recent-reports__action-btn"
                      aria-label="View report"
                      onClick={() => handleView(report)}
                    >
                      <Icon name="eye" />
                    </button>
                    <button
                      type="button"
                      className="recent-reports__action-btn"
                      aria-label="Download report"
                      onClick={() => handleDownload(report)}
                    >
                      <Icon name="download" />
                    </button>
                    <button
                      type="button"
                      className="recent-reports__action-btn"
                      aria-label="Share report"
                      onClick={() => handleShare(report)}
                    >
                      <Icon name="share" />
                    </button>
                    <button
                      type="button"
                      className="recent-reports__action-btn"
                      aria-label="More actions"
                    >
                      <Icon name="more" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
