'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ScanReport from '../../components/ScanReport';
import { getApiUrl } from '../../../lib/apiUrl';

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
        const response = await fetch(`${getApiUrl()}/report/${encodeURIComponent(scanId)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load report');
        setScan(normalizeScanReport(data.scan || data));
      } catch (loadError) {
        setError(loadError?.message || 'Unable to load report');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [scanId]);

  if (loading) {
    return (
      <main className="public-report-loading" aria-busy="true" aria-label="Loading accessibility report">
        <div className="public-report-loading__sheet">
          <div className="public-report-loading__header">
            <div className="skeleton" style={{ width: 180, height: 24 }} />
            <div className="skeleton" style={{ width: 92, height: 14 }} />
          </div>
          <div className="skeleton" style={{ width: '62%', height: 54, margin: '68px 0 20px' }} />
          <div className="skeleton" style={{ width: '42%', height: 18, marginBottom: 48 }} />
          <div className="public-report-loading__cards">
            {[1, 2, 3].map((item) => (
              <div key={item} className="skeleton" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !scan) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Report unavailable</h1>
            <p>{error || 'This report could not be found.'}</p>
          </div>
        </div>
      </main>
    );
  }

  return <ScanReport result={scan} variant="public" />;
}
