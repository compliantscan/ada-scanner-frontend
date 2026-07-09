import React from 'react';

export default function AuditStats({ report, loading }) {
  const stats = report ? {
    pages: report.pages?.[0]?.violations ? report.pages.length : (report.pages?.length || 1),
    totalViolations: report.executiveSummary?.totalViolations ?? 0,
    affectedElements: report.executiveSummary?.severityCounts?.totalAffectedElements ?? 0,
    score: report.executiveSummary?.score ?? 0,
  } : { pages: '—', totalViolations: '—', affectedElements: '—', score: '—' };

  return (
    <section style={{ display: 'flex', gap: '12px', marginTop: 18 }}>
      <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 120 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Pages Scanned</div>
        <div style={{ fontSize: 20 }}>{loading ? '—' : stats.pages}</div>
      </div>
      <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 120 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Total WCAG Violations</div>
        <div style={{ fontSize: 20 }}>{loading ? '—' : stats.totalViolations}</div>
      </div>
      <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, minWidth: 120 }}>
        <div style={{ fontSize: 12, color: '#666' }}>Affected Elements</div>
        <div style={{ fontSize: 20 }}>{loading ? '—' : stats.affectedElements}</div>
      </div>
    </section>
  );
}
