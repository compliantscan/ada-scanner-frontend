import React from 'react';

export default function AuditScoreCard({ report, loading, status }) {
  const score = report?.executiveSummary?.score ?? null;
  const risk = report?.executiveSummary?.riskLevel ?? (score >= 80 ? 'Low' : score >= 60 ? 'Medium' : 'High');

  return (
    <aside style={{ padding: 20, border: '1px solid #eee', borderRadius: 12 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Accessibility Score</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', border: '8px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          {loading ? '—' : (score !== null ? `${score}` : '—')}
        </div>
        <div>
          <div style={{ fontSize: 14, color: '#444' }}>{risk} Risk</div>
          <div style={{ fontSize: 12, color: '#888' }}>{status === 'completed' ? 'Scan complete' : 'Scanning…'}</div>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 13, color: '#666' }}>Violation Breakdown</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1, padding: 8, background: '#fee', borderRadius: 6 }}>Critical<br/>{report?.executiveSummary?.severityCounts?.critical ?? 0}</div>
          <div style={{ flex: 1, padding: 8, background: '#fff4e6', borderRadius: 6 }}>Serious<br/>{report?.executiveSummary?.severityCounts?.serious ?? 0}</div>
          <div style={{ flex: 1, padding: 8, background: '#fff8f0', borderRadius: 6 }}>Moderate<br/>{report?.executiveSummary?.severityCounts?.moderate ?? 0}</div>
          <div style={{ flex: 1, padding: 8, background: '#f0fff4', borderRadius: 6 }}>Minor<br/>{report?.executiveSummary?.severityCounts?.minor ?? 0}</div>
        </div>
      </div>
    </aside>
  );
}
