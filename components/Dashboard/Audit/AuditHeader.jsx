import React from 'react';
import { useRouter } from 'next/navigation';

export default function AuditHeader({ scanRow, report, status }) {
  const router = useRouter();
  const url = report?.url || scanRow?.url || '';
  const scannedAt = report?.generatedAt || scanRow?.created_at || '';

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
      <div>
        <h1 style={{ margin: 0 }}>{url}</h1>
        <div style={{ color: '#666', fontSize: 13 }}>{scannedAt ? `Scan ${status === 'completed' ? 'completed' : 'started'} on ${new Date(scannedAt).toLocaleString()}` : 'Preparing scan…'}</div>
      </div>
      <div>
        {/* Action buttons live in ActionPanel; keep header minimal */}
      </div>
    </header>
  );
}
