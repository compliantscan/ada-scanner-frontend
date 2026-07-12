import React from 'react';
import { calculateScore, calculateRisk, getSeverityCounts, estimateEffort, estimateProjectValue, getPagesScanned } from './auditHelpers';

const SEVERITY_COLORS = {
  critical: { bg: '#fff1f1', text: '#c0392b', dot: '#e74c3c' },
  serious:  { bg: '#fff8f0', text: '#b7590a', dot: '#f39c12' },
  moderate: { bg: '#fffbf0', text: '#8a6d00', dot: '#f1c40f' },
  minor:    { bg: '#f0f9ff', text: '#1a6b8a', dot: '#3498db' },
};

function ScoreDial({ score }) {
  const risk = calculateRisk(score);
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="52" fill="none" stroke="#f0f0f0" strokeWidth="10" />
        <circle
          cx="64" cy="64" r="52" fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="64" y="60" textAnchor="middle" fontSize="26" fontWeight="700" fill="#121212" fontFamily="inherit">{score}</text>
        <text x="64" y="78" textAnchor="middle" fontSize="11" fill="#4b4b4b" fontFamily="inherit">/ 100</text>
      </svg>
      <span style={{
        padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
        background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2',
        color: score >= 80 ? '#15803d' : score >= 60 ? '#92400e' : '#991b1b',
      }}>{risk}</span>
    </div>
  );
}

export default function ExecutiveSummaryCard({ report }) {
  const score = calculateScore(report);
  const counts = getSeverityCounts(report);
  const pages = getPagesScanned(report);
  const total = report?.executiveSummary?.totalViolations ?? (counts.critical + counts.serious + counts.moderate + counts.minor);
  const effort = estimateEffort(counts);
  const value = estimateProjectValue(effort);

  const stats = [
    { label: 'Pages Scanned', value: pages },
    { label: 'Total Violations', value: total },
    { label: 'Remediation Effort', value: `${effort.lower}–${effort.upper} dev hrs` },
    { label: 'Est. Project Value', value: `$${value.lower.toLocaleString()}–$${value.upper.toLocaleString()}` },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '36px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
        <ScoreDial score={score} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4b4b4b', marginBottom: 6 }}>Accessibility Score</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: '#f8fafd', borderRadius: 14, padding: '14px 18px' }}>
                <div style={{ fontSize: 11, color: '#4b4b4b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#121212', marginTop: 4 }}>{s.value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {Object.entries(counts).filter(([k]) => k !== 'totalAffectedElements').map(([sev, count]) => {
              const c = SEVERITY_COLORS[sev] || SEVERITY_COLORS.minor;
              return (
                <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: 6, background: c.bg, borderRadius: 10, padding: '8px 14px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: c.text, textTransform: 'capitalize' }}>{sev}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
