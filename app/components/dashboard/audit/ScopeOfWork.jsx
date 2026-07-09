import React from 'react';
import { getSeverityCounts, estimateEffort, suggestedSchedule, groupIssuesByPage } from './auditHelpers';

export default function ScopeOfWork({ report }) {
  const counts = getSeverityCounts(report);
  const effort = estimateEffort(counts);
  const pages = groupIssuesByPage(report);
  const schedule = suggestedSchedule(effort.upper);

  const rows = [
    { label: 'Estimated affected pages', value: pages.length },
    { label: 'Estimated engineering effort', value: `${effort.lower}–${effort.upper} hours` },
    { label: 'Suggested schedule', value: schedule },
    { label: 'Suggested retest', value: 'After remediation deployment' },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 36px' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#121212' }}>Suggested Scope of Work</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
        {rows.map(r => (
          <div key={r.label} style={{ background: '#f8fafd', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4b4b4b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{r.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#121212' }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
