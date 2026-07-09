import React from 'react';

export default function PriorityIssuesCard({ report = { priorityChecklist: [] } }) {
  const items = report.priorityChecklist || report.priorityChecklist || [];

  return (
    <section style={{ padding: 20, border: '1px solid #eee', borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Top Priority Issues</h3>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {items.slice(0,3).map((it, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #fafafa' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{it.title || it.ruleId || it.description}</div>
              <div style={{ fontSize: 13, color: '#666' }}>{it.severity || it.severity}</div>
            </div>
            <div style={{ color: '#999' }}>{it.estimatedMinutes ? `${it.estimatedMinutes}m` : (it.occurrences || '')}</div>
          </li>
        ))}
      </ol>
    </section>
  );
}
