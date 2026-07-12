'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCachedSession } from '../../../lib/supabaseClient';
import Icon, { ScoreRing } from '../../../components/Dashboard/Icons/Icons';
import './reports.css';

// Module-level cache: avoids re-fetching on every visit within the same session
let _reportsCache = null;
let _reportsCacheTime = 0;
const REPORTS_TTL = 30_000; // 30 seconds

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

function calculateApproxScore(scan) {
  if (scan.score != null && Number.isFinite(scan.score)) return scan.score;
  const bySev = scan.violations_by_severity;
  if (bySev) {
    const d = (bySev.critical || 0) * 12 + (bySev.serious || 0) * 7 + (bySev.moderate || 0) * 3 + (bySev.minor || 0);
    return Math.max(0, Math.min(100, 100 - d));
  }
  const v = scan.results_json?.violations;
  if (Array.isArray(v)) {
    const d = v.reduce((acc, vio) => {
      if (vio.impact === 'critical') return acc + 12;
      if (vio.impact === 'serious') return acc + 7;
      if (vio.impact === 'moderate') return acc + 3;
      if (vio.impact === 'minor') return acc + 1;
      return acc;
    }, 0);
    return Math.max(0, Math.min(100, 100 - d));
  }
  return 100;
}

function buildReportRow(scan) {
  let hostname;
  try { hostname = new URL(scan.url).hostname; } catch { hostname = scan.url; }

  const score = calculateApproxScore(scan);
  let riskLevel, riskBadge;
  if (score >= 80) { riskLevel = 'Low Risk'; riskBadge = 'green'; }
  else if (score >= 60) { riskLevel = 'Medium Risk'; riskBadge = 'orange'; }
  else { riskLevel = 'High Risk'; riskBadge = 'red'; }

  const elements = Array.isArray(scan.results_json?.violations)
    ? scan.results_json.violations.length * 5
    : 80;

  const pages = scan.pages_scanned ?? 1;
  const scanType = scan.scan_type === 'full' ? 'Full Website' : (scan.scan_type === 'single' ? 'Single Page' : (pages > 1 ? 'Full Website' : 'Single Page'));

  let reportType = 'Executive';
  let reportBadge = 'green';
  
  if (scan.report_type === 'developer') {
    reportType = 'Developer';
    reportBadge = 'blue';
  } else if (scan.report_type === 'both') {
    reportType = 'Both';
    reportBadge = 'purple';
  }

  const d = new Date(scan.created_at);
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return {
    id: scan.id,
    domain: hostname,
    url: scan.url,
    title: `${hostname} – Accessibility Report`,
    meta: `${pages} pages · ${elements} elements`,
    scanType,
    reportType,
    reportBadge,
    riskLevel,
    riskBadge,
    score,
    dateStr,
    timeStr,
    thumbnail: null,
  };
}

function ReportThumbnail({ thumbnail, title }) {
  return (
    <div className="rt-report-image">
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="rt-report-image-inner" />
      ) : null}
    </div>
  );
}

function ReportRow({ report, onDownload, onShare, onDelete, onView }) {
  return (
    <tr>
      <td>
        <div className="rt-report-col">
          <ReportThumbnail thumbnail={report.thumbnail} title={report.title} />
          <div className="rt-report-info">
            <h4 className="rt-report-title">{report.title}</h4>
            <p className="rt-report-meta">{report.meta}</p>
          </div>
        </div>
      </td>
      <td>
        <span className={`rt-badge rt-badge--${report.riskBadge}`}>
          {report.riskLevel}
        </span>
      </td>
      <td>
        <span className={`rt-badge ${report.scanType === 'Full Website' ? 'rt-badge--green' : 'rt-badge--blue'}`}>
          <Icon name={report.scanType === 'Full Website' ? 'globe' : 'file'} />
          {report.scanType}
        </span>
      </td>
      <td>
        <span className={`rt-badge rt-badge--${report.reportBadge}`}>
          {report.reportType}
        </span>
      </td>
      <td>
        <ScoreRing score={report.score} size={40} />
      </td>
      <td>
        <div className="rt-date">
          <span>{report.dateStr}</span>
          <span>{report.timeStr}</span>
        </div>
      </td>
      <td>
        <div className="rt-actions">
          <button className="rt-action-btn" aria-label="View" onClick={() => onView(report)}>
            <Icon name="eye" />
          </button>
          <button className="rt-action-btn" aria-label="Download" onClick={() => onDownload(report)}>
            <Icon name="download" />
          </button>
          <button className="rt-action-btn" aria-label="Share" onClick={() => onShare(report)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          <button className="rt-action-btn" aria-label="Delete" onClick={() => onDelete(report)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState(() => _reportsCache || []);
  const [isInitialLoading, setIsInitialLoading] = useState(!_reportsCache);
  const [activeTab, setActiveTab] = useState('All Reports');
  const lastFetchedRef = useRef(_reportsCacheTime);

  const fetchReports = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && _reportsCache && now - _reportsCacheTime < REPORTS_TTL) {
      setReports(_reportsCache);
      setIsInitialLoading(false);
      return;
    }
    setIsInitialLoading(true);
    try {
      const session = await getCachedSession();
      if (!session) { setIsInitialLoading(false); return; }

      const apiUrl = getApiUrl();
      const resp = await fetch(`${apiUrl}/dashboard/scans`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });

      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const payload = await resp.json();
      const rows = (payload.scans || []).map(buildReportRow);
      _reportsCache = rows;
      _reportsCacheTime = Date.now();
      setReports(rows);
      lastFetchedRef.current = Date.now();
    } catch (err) {
      console.error('[Reports] Failed to load:', err.message);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // View Action
  function handleView(report) {
    if (!report.id) return;
    router.push(`/dashboard/audit/${report.id}`);
  }

  // Download Action
  async function handleDownload(report) {
    if (!report.id) return;
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
      console.error('PDF download error:', err.message);
      alert('Failed to download report.');
    }
  }

  // Share Action
  function handleShare(report) {
    if (!report.id) return;
    const url = `${window.location.origin}/dashboard/audit/${report.id}`;
    navigator.clipboard.writeText(url)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  }

  // Delete Action
  async function handleDelete(report) {
    if (!report.id) return;
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      const session = await getCachedSession();
      if (!session) return;
      
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/dashboard/scan/${report.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      if (!response.ok) throw new Error('Delete failed');
      
      setReports(prev => {
        const updated = prev.filter(r => r.id !== report.id);
        _reportsCache = updated;
        return updated;
      });
    } catch (err) {
      console.error('Delete error:', err.message);
      alert('Failed to delete report.');
    }
  }

  const allRows = reports.filter(r => {
    if (activeTab === 'All Reports') return true;
    return r.reportType === activeTab;
  });

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Reports</h1>
        <p className="reports-subtitle">Download and manage your accessibility reports.</p>
      </div>

      {/* Tabs – no bottom margin, filter card border attaches to it */}
      <div className="reports-tabs">
        {['All Reports', 'Executive', 'Developer', 'Both'].map(tab => (
          <button
            key={tab}
            className={`reports-tab ${activeTab === tab ? 'reports-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter bar – top border removed so it visually attaches to tabs */}
      <div className="reports-filters">
        <div className="reports-search">
          <span className="reports-search-icon"><Icon name="search" /></span>
          <input
            type="text"
            className="reports-search-input"
            placeholder="Search reports by website..."
          />
        </div>

        {/* spacer pushes dropdowns + export to the right */}
        <div className="reports-filter-spacer" />

        <div className="reports-filter-group">
          <div className="reports-dropdown">
            <span className="reports-dropdown-label">Report Type</span>
            <div className="reports-dropdown-val">
              All Types <Icon name="chevron" />
            </div>
          </div>
          <div className="reports-dropdown">
            <span className="reports-dropdown-label">Date Range</span>
            <div className="reports-dropdown-val">
              All Time <Icon name="chevron" />
            </div>
          </div>

          {/* gap between Date Range and Export All */}
          <div style={{ width: 24 }} />

          <button className="reports-export-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Export All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="reports-table-container">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report</th>
              <th>Risk Level</th>
              <th>Scan Type</th>
              <th>Report Type</th>
              <th>Score</th>
              <th>Generated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isInitialLoading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--cs-text-muted)' }}>
                  Loading reports…
                </td>
              </tr>
            ) : allRows.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--cs-text-muted)' }}>
                  No reports found.
                </td>
              </tr>
            ) : (
              allRows.map(report => (
                <ReportRow 
                  key={report.id} 
                  report={report} 
                  onDownload={handleDownload} 
                  onShare={handleShare}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))
            )}
          </tbody>
        </table>

        {!isInitialLoading && allRows.length > 0 && (
          <div className="reports-pagination">
            <button className="reports-page-btn">‹</button>
            <button className="reports-page-btn reports-page-btn--active">1</button>
            <button className="reports-page-btn">2</button>
            <button className="reports-page-btn">3</button>
            <span style={{ color: 'var(--cs-text-muted)', padding: '0 4px' }}>...</span>
            <button className="reports-page-btn">8</button>
            <button className="reports-page-btn">›</button>
          </div>
        )}
      </div>
    </div>
  );
}
