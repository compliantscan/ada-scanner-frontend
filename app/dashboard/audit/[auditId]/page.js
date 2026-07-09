'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSupabaseClient } from '../../../../lib/supabaseClient';
import ScanProgress from '../../../components/dashboard/audit/ScanProgress';
import AuditExecutiveReport from '../../../components/dashboard/audit/AuditExecutiveReport';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

function FailedState({ error, onRetry }) {
  return (
    <div style={{ background: '#f8fafd', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '48px 56px', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 700, color: '#121212' }}>Scan could not be completed</h2>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#4b4b4b', lineHeight: 1.6 }}>{error || 'An unexpected error occurred during the scan.'}</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            style={{ padding: '12px 24px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #000, #2e2e2e)', color: '#fff', fontSize: 14, fontWeight: 700 }}
          >
            Run New Scan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const router = useRouter();
  const params = useParams();
  const auditId = params?.auditId;
  const [scanRow, setScanRow] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('queued');
  const [error, setError] = useState(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    let mounted = true;
    let pollInterval = null;

    async function fetchStatus() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.replace('/login'); return; }
        const apiUrl = getApiUrl();
        const resp = await fetch(`${apiUrl}/dashboard/scan/${encodeURIComponent(auditId)}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!resp.ok) {
          if (resp.status === 404) throw new Error('Audit not found');
          throw new Error('Unable to fetch audit status');
        }
        const payload = await resp.json();
        if (!mounted) return;
        setScanRow(payload.scan || payload);
        const s = (payload.scan && payload.scan.results_json && payload.scan.results_json._status) || (payload.results_json && payload.results_json._status) || 'queued';
        setStatus(s);

        if (s === 'completed') {
          const repResp = await fetch(`${apiUrl}/dashboard/report/${encodeURIComponent(auditId)}`, {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (repResp.ok) {
            const repPayload = await repResp.json();
            setReport(repPayload.scan || repPayload);
            setLoading(false);
            clearInterval(pollInterval);
          } else {
            setError('Failed to load final report');
            setLoading(false);
            clearInterval(pollInterval);
          }
        } else if (s === 'failed') {
          setError((payload.scan && payload.scan.results_json && payload.scan.results_json._error) || 'Scan failed');
          setLoading(false);
          clearInterval(pollInterval);
        } else {
          setLoading(true);
        }
      } catch (err) {
        console.error('Audit polling error:', err);
        setError(err.message || 'Error polling audit');
        setLoading(false);
        if (pollInterval) clearInterval(pollInterval);
      }
    }

    if (auditId) {
      fetchStatus();
      pollInterval = setInterval(fetchStatus, 3000);
    }

    return () => { mounted = false; if (pollInterval) clearInterval(pollInterval); };
  }, [auditId, router]);

  if (error) {
    return <FailedState error={error} onRetry={() => { router.push('/dashboard'); router.refresh(); }} />;
  }

  if (loading) {
    return (
      <div style={{ background: '#f8fafd', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '48px 56px', maxWidth: 480, width: '100%' }}>
          <ScanProgress status={status} scanRow={scanRow} />
        </div>
      </div>
    );
  }

  return <AuditExecutiveReport report={report} scanRow={scanRow} />;
}
