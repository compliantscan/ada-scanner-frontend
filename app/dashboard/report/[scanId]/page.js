'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AgencyReport from '../../../../components/AgencyReport/AgencyReport';
import { getCachedSession } from '../../../../lib/supabaseClient';
import { getApiUrl } from '../../../../lib/apiUrl';

export default function DashboardReportPage() {
  const router = useRouter();
  const params = useParams();
  const scanId = params?.scanId;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.querySelector('.agency-dashboard__main')?.scrollTo({ top: 0, behavior: 'auto' });
  }, [scanId]);

  useEffect(() => {
    const controller = new AbortController();

    const loadReport = async () => {
      try {
        const session = await getCachedSession();
        if (!session?.access_token) {
          router.replace(`/login?redirect=${encodeURIComponent(`/dashboard/report/${scanId}`)}`);
          return;
        }

        const response = await fetch(`${getApiUrl()}/dashboard/report/${encodeURIComponent(scanId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
          cache: 'no-store',
          signal: controller.signal,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error || data?.message || 'Unable to load report');
        setReport(data.scan || data);
      } catch (loadError) {
        if (loadError?.name !== 'AbortError') {
          setError(loadError?.message || 'Unable to load report');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    if (scanId) loadReport();
    return () => controller.abort();
  }, [router, scanId]);

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

  if (error || !report) {
    return (
      <main className="auth-shell">
        <div className="auth-card">
          <div className="auth-header">
            <p className="auth-eyebrow">CompliantScan</p>
            <h1>Report unavailable</h1>
            <p>{error || 'This report could not be found.'}</p>
            <button type="button" onClick={() => router.push(`/dashboard/audit/${scanId}`)}>
              Back to audit
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <AgencyReport
      scanData={report}
      backHref={`/dashboard/audit/${scanId}`}
      dashboardReport
    />
  );
}
