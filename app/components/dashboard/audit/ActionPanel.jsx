import React from 'react';

export default function ActionPanel({ report, loading }) {
  const disabled = loading || !report;
  return (
    <aside style={{ padding: 20, border: '1px solid #eee', borderRadius: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button disabled={disabled} style={{ padding: '10px 12px', borderRadius: 8, background: disabled ? '#eee' : '#fff' }}>View Executive Report</button>
        <button disabled={disabled} style={{ padding: '10px 12px', borderRadius: 8, background: disabled ? '#eee' : '#fff' }}>View Developer Report</button>
        <button disabled={disabled} style={{ padding: '10px 12px', borderRadius: 8, background: disabled ? '#eee' : '#fff' }}>Download PDF</button>
        <button disabled={disabled} style={{ padding: '10px 12px', borderRadius: 8, background: disabled ? '#eee' : '#fff' }}>Share Report</button>
      </div>
    </aside>
  );
}
