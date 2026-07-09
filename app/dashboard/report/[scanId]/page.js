'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ScanReport from '../../../components/ScanReport';
import { getSupabaseClient } from '../../../../lib/supabaseClient';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

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
    user_id: scan?.user_id,
    user_email: scan?.user_email,
  };
}

export default function DashboardReportPage() {
  const router = useRouter();
  const params = useParams();
  const scanId = params?.scanId;
  const [reportResult, setReportResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace('/login'); return; }

        const response = await fetch(`${getApiUrl()}/dashboard/report/${encodeURIComponent(scanId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data?.error || 'Unable to load report');
        setReportResult(normalizeScanReport(data.scan));
      } catch (err) {
        setError(err.message || 'Unable to load report');
      } finally {
        setLoading(false);
      }
    };
    if (scanId) load();
  }, [scanId, router]);

  if (loading) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Loading report…</h1>
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

  return <ScanReport result={reportResult} variant="dashboard" />;
}
