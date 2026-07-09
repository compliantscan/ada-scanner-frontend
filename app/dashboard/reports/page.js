'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import Topbar from '../../components/dashboard/Topbar';
import RecentReportsTable from '../../components/dashboard/RecentReportsTable';

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
  const violations = Number.isFinite(scan.total_violations)
    ? scan.total_violations
    : (Array.isArray(scan.results_json?.violations) ? scan.results_json.violations.length : 0);

  const pages = scan.pages_scanned ?? 1;
  const scanType = pages > 1 ? 'Full Website' : 'Single Page';
  const scanTypeVariant = pages > 1 ? 'blue' : 'green';

  let riskLevel, riskVariant;
  if (score >= 80)      { riskLevel = 'Low Risk';    riskVariant = 'green'; }
  else if (score >= 60) { riskLevel = 'Medium Risk'; riskVariant = 'orange'; }
  else                  { riskLevel = 'High Risk';   riskVariant = 'red'; }

  return {
    id: scan.id,
    domain: hostname,
    url: scan.url,
    scanType,
    scanTypeVariant,
    pages: Number.isFinite(pages) ? pages : 1,
    score,
    violations,
    violationsChange: null,
    riskLevel,
    riskVariant,
    scannedAt: scan.created_at,
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchedRef = useRef(0);

  const fetchReports = useCallback(async ({ background = false } = {}) => {
    const hasData = lastFetchedRef.current > 0;
    if (background || hasData) {
      setIsRefreshing(true);
    } else {
      setIsInitialLoading(true);
    }
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setIsInitialLoading(false); setIsRefreshing(false); return; }

      const apiUrl = getApiUrl();
      const resp = await fetch(`${apiUrl}/dashboard/scans`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });

      if (!resp.ok) {
        const payload = await resp.json().catch(() => ({}));
        throw new Error(payload.message || `Server returned ${resp.status}`);
      }

      const payload = await resp.json();
      const rows = (payload.scans || []).map(buildReportRow);
      setReports(rows);
      setError(null);
      lastFetchedRef.current = Date.now();
    } catch (err) {
      console.error('[Reports] Failed to load:', err.message);
      if (!lastFetchedRef.current) {
        setError(err.message || 'Could not load reports.');
      }
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Refetch on window focus with 15s freshness guard
  useEffect(() => {
    function handleFocus() {
      if (Date.now() - lastFetchedRef.current > 15000) {
        fetchReports({ background: true });
      }
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchReports]);

  return (
    <>
      <Topbar showWelcome={false} />

      {error && !reports.length && (
        <div
          role="alert"
          style={{
            margin: '0 0 16px', padding: '12px 16px', background: '#fef2f2',
            border: '1px solid #fca5a5', borderRadius: '8px', color: '#b91c1c',
            fontSize: '14px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: '12px',
          }}
        >
          <span>Could not load reports. Please refresh.</span>
          <button
            type="button"
            onClick={fetchReports}
            style={{
              background: 'none', border: '1px solid #fca5a5', borderRadius: '6px',
              color: '#b91c1c', padding: '4px 10px', cursor: 'pointer', fontSize: '13px',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {isRefreshing && reports.length > 0 && (
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
          Refreshing…
        </div>
      )}

      <RecentReportsTable
        reports={reports}
        isInitialLoading={isInitialLoading}
        title="All Reports"
        subtitle="Every accessibility scan for your account"
        showViewAll={false}
      />
    </>
  );
}
