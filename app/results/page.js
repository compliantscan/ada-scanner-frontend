'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReportFree from '@/components/ReportFree/ReportFree';

export default function ResultsPage() {
  const [scan, setScan] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const raw = sessionStorage.getItem('adaScanResult');
    if (!raw) return setScan(null);
    try {
      const parsed = JSON.parse(raw);
      setScan(parsed);
    } catch {
      setScan(null);
    }
  }, []);

  if (scan === null) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scan results</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '16px 0', color: 'var(--color-text-main)' }}>Nothing to show yet</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Run a scan from the homepage first, then return here to see the free report.
        </p>
        <button 
          onClick={() => router.push('/')}
          style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          Back to scan
        </button>
      </div>
    );
  }

  return <ReportFree scanData={scan} />;
}
