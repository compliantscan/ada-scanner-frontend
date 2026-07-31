'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ScanReport from '../../components/ScanReport';
import { getApiUrl } from '../../../lib/apiUrl';
import { getCachedSession } from '../../../lib/supabaseClient';

function normalizeScanReport(scan) {
  if (!scan) return null;
  const raw =
    scan?.results ||
    scan?.result ||
    scan?.scan_results ||
    scan?.report ||
    scan?.data ||
    scan;
  return {
    ...raw,
    id: scan?.id || raw?.id,
    scanId: scan?.id || raw?.scanId,
    url: scan?.url || raw?.url || raw?.website_url,
    created_at: scan?.created_at || raw?.created_at,
  };
}

export default function PublicReportPage() {
  const params = useParams();
  const scanId = params?.scanId || 'unknown';
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      if (!scanId || scanId === 'unknown') {
        setLoading(false);
        return;
      }

      try {
        const shareKey = new URLSearchParams(window.location.search).get('key');
        const session = await getCachedSession().catch(() => null);
        const endpoint = new URL(`${getApiUrl()}/report/${encodeURIComponent(scanId)}`);
        if (shareKey) endpoint.searchParams.set('key', shareKey);

        const response = await fetch(endpoint.toString(), {
          headers: session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : undefined,
          cache: 'no-store',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Unable to load report');
        }

        setScan(normalizeScanReport(data.scan || data));
      } catch (err) {
        setError(err.message || 'Unable to load report');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [scanId]);

  if (loading) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Loading report…</h1>
            <p>Scan ID: {scanId}</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Report unavailable</h1>
            <p>{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!scan) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Public Scan Report</h1>
            <p>Scan ID: {scanId}</p>
          </div>
        </div>
      </main>
    );
  }

  return <ScanReport result={scan} variant="public" />;
}
