'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AgencyReport from '@/components/AgencyReport/AgencyReport';

export default function ReportPreviewPage() {
  const [scan, setScan] = useState(undefined);

  useEffect(() => {
    const raw = sessionStorage.getItem('adaScanResult');
    if (!raw) {
      setScan(null);
      return;
    }
    try {
      setScan(JSON.parse(raw));
    } catch {
      setScan(null);
    }
  }, []);

  if (scan === undefined) {
    return (
      <main
        aria-busy="true"
        aria-live="polite"
        style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center', fontFamily: 'var(--font-sans)', background: '#f5f3ee', color: '#17241f' }}
      >
        <div>
          <div style={{ width: 38, height: 38, margin: '0 auto 18px', border: '3px solid #d8ddd8', borderTopColor: '#173f2e', borderRadius: '50%', animation: 'reportSpin .8s linear infinite' }} />
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Preparing your report…</p>
          <style>{'@keyframes reportSpin { to { transform: rotate(360deg); } }'}</style>
        </div>
      </main>
    );
  }

  if (!scan) {
    return (
      <main style={{ minHeight: '100vh', padding: '100px 24px', textAlign: 'center', fontFamily: 'var(--font-sans)', background: '#f5f3ee', color: '#17241f' }}>
        <p style={{ color: '#a56e1e', fontSize: 12, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Accessibility Snapshot</p>
        <h1 style={{ margin: '14px 0', fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 500 }}>Run a scan to create your report.</h1>
        <p style={{ maxWidth: 560, margin: '0 auto 28px', color: '#65706a', lineHeight: 1.6 }}>Your five-page agency report is generated from the latest scan in this browser. No login is required.</p>
        <Link href="/" style={{ display: 'inline-block', padding: '13px 21px', borderRadius: 9, background: '#173f2e', color: 'white', fontWeight: 700, textDecoration: 'none' }}>Scan a website</Link>
      </main>
    );
  }

  return <AgencyReport scanData={scan} />;
}
