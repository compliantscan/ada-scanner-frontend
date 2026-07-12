import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditActions({ report }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 36px' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#121212' }}>Actions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          disabled
          title="PDF download coming soon"
          style={{
            padding: '14px 20px', borderRadius: 14, border: 'none', cursor: 'not-allowed',
            background: 'linear-gradient(135deg, #000, #2e2e2e)',
            color: '#fff', fontSize: 14, fontWeight: 700, opacity: 0.5,
          }}
        >
          Download Executive PDF
        </button>

        <button
          onClick={handleCopyLink}
          style={{
            padding: '13px 20px', borderRadius: 14, border: '1px solid #ededed', cursor: 'pointer',
            background: '#fff', color: '#121212', fontSize: 14, fontWeight: 600,
          }}
        >
          {copied ? '✓ Link Copied' : 'Copy Share Link'}
        </button>

        <button
          disabled
          title="Developer report coming soon"
          style={{
            padding: '13px 20px', borderRadius: 14, border: '1px solid #ededed', cursor: 'not-allowed',
            background: '#f8fafd', color: '#4b4b4b', fontSize: 14, fontWeight: 600, opacity: 0.6,
          }}
        >
          View Developer Report
          <span style={{ marginLeft: 8, fontSize: 10, background: '#e0e7ff', color: '#4b6bfb', padding: '2px 7px', borderRadius: 999, fontWeight: 700 }}>Soon</span>
        </button>

        <button
          onClick={() => { router.push('/dashboard'); router.refresh(); }}
          style={{
            padding: '13px 20px', borderRadius: 14, border: '1px solid #ededed', cursor: 'pointer',
            background: '#fff', color: '#4b6bfb', fontSize: 14, fontWeight: 600,
          }}
        >
          Run New Scan
        </button>
      </div>
    </div>
  );
}
