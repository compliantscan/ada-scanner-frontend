import React from 'react';
import { groupIssuesByPage, calculateRisk, formatDomain } from './auditHelpers';

function RiskBadge({ critical, serious }) {
  const score = 100 - critical * 10 - serious * 5;
  const risk = calculateRisk(Math.max(0, score));
  const styles = {
    'Low Risk':    { bg: '#dcfce7', color: '#15803d' },
    'Medium Risk': { bg: '#fef3c7', color: '#92400e' },
    'High Risk':   { bg: '#fee2e2', color: '#991b1b' },
  };
  const s = styles[risk] || styles['Low Risk'];
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{risk}</span>
  );
}

export default function PageCoverage({ report }) {
  const pages = groupIssuesByPage(report);

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 36px' }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#121212' }}>Page Coverage</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
              {['Page', 'Issues', 'Critical', 'Serious', 'Risk'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 700, color: '#4b4b4b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.map((page, i) => {
              const critical = page.critical ?? 0;
              const serious = page.serious ?? 0;
              const label = page.url ? formatDomain(page.url) || page.url : `Page ${i + 1}`;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 12px', color: '#121212', fontWeight: 500, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span title={page.url}>{label}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: '#4b4b4b', fontWeight: 600 }}>{page.violations ?? 0}</td>
                  <td style={{ padding: '12px 12px' }}>
                    {critical > 0
                      ? <span style={{ color: '#991b1b', fontWeight: 700 }}>{critical}</span>
                      : <span style={{ color: '#4b4b4b' }}>0</span>}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    {serious > 0
                      ? <span style={{ color: '#92400e', fontWeight: 700 }}>{serious}</span>
                      : <span style={{ color: '#4b4b4b' }}>0</span>}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <RiskBadge critical={critical} serious={serious} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
