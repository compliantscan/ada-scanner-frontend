import React from 'react';

export default function ScanProgress({ status, scanRow }) {
  const progress = (scanRow && scanRow.results_json && scanRow.results_json._progress) || 0;
  const label = (scanRow && scanRow.results_json && scanRow.results_json._status) || status || 'queued';
  const reconnecting = label === 'reconnecting';
  return (
    <section style={{ padding: 40, border: '1px solid #eee', borderRadius: 12, textAlign: 'center' }}>
      <div style={{ fontSize: 18, marginBottom: 12 }}>
        {reconnecting ? 'Reconnecting…' : label === 'queued' ? 'Queued' : 'Scanning…'}
      </div>
      <div style={{ width: 160, height: 160, borderRadius: '50%', border: '8px solid #eee', margin: '12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
        {Math.min(100, progress)}%
      </div>
      <div style={{ color: '#666' }}>
        {reconnecting
          ? 'Your scan is safe. We are reconnecting to load the completed report.'
          : label === 'queued'
            ? 'Your scan is queued and will start shortly.'
            : 'Live scan in progress. This page will update when complete.'}
      </div>
    </section>
  );
}
