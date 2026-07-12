import React from 'react';
import { getTopPriorityIssues, getQuickWins, getNextSprintIssues, getIssues } from './auditHelpers';

const SEV_BADGE = {
  critical: { bg: '#fee2e2', color: '#991b1b' },
  serious:  { bg: '#fef3c7', color: '#92400e' },
  moderate: { bg: '#fefce8', color: '#713f12' },
  minor:    { bg: '#eff6ff', color: '#1e40af' },
};

function SeverityBadge({ severity }) {
  const s = SEV_BADGE[severity] || SEV_BADGE.minor;
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: s.bg, color: s.color }}>
      {severity}
    </span>
  );
}

function IssueRow({ issue, showTime = true }) {
  const mins = issue.fix?.estimatedMinutes ?? { critical: 45, serious: 30, moderate: 15, minor: 5 }[issue.severity] ?? 15;
  const timeLabel = mins < 60 ? `${mins} min` : `${Math.ceil(mins / 60)} hr`;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <SeverityBadge severity={issue.severity} />
          {issue.affectedElements > 0 && (
            <span style={{ fontSize: 11, color: '#4b4b4b' }}>{issue.affectedElements} element{issue.affectedElements !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#121212', lineHeight: 1.4 }}>
          {issue.title || issue.description || issue.ruleId}
        </div>
      </div>
      {showTime && (
        <div style={{ fontSize: 12, color: '#4b4b4b', fontWeight: 600, whiteSpace: 'nowrap', paddingTop: 2 }}>~{timeLabel}</div>
      )}
    </div>
  );
}

function Section({ title, accent, children, emptyText }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: accent, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: '#121212', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</span>
      </div>
      {children || <p style={{ fontSize: 13, color: '#4b4b4b', margin: '8px 0 0 18px' }}>{emptyText}</p>}
    </div>
  );
}

export default function PriorityPlan({ report }) {
  const issues = getIssues(report);
  const top3 = getTopPriorityIssues(issues, 3);
  const quickWins = getQuickWins(issues).filter(v => !top3.find(t => (t.ruleId || t.title) === (v.ruleId || v.title)));
  const nextSprint = getNextSprintIssues(issues).slice(0, 5);

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 36px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700, color: '#121212' }}>Priority Plan</h2>

      <Section title="Fix Now" accent="#ef4444">
        {top3.length > 0
          ? top3.map((issue, i) => <IssueRow key={i} issue={issue} />)
          : null}
        {top3.length === 0 && undefined}
      </Section>
      {top3.length === 0 && <p style={{ fontSize: 13, color: '#4b4b4b', margin: '0 0 20px 18px' }}>No critical or serious issues found.</p>}

      <div style={{ margin: '20px 0', borderTop: '1px solid #f0f0f0' }} />

      <Section title="Quick Wins · Under 30 min" accent="#f59e0b">
        {quickWins.length > 0
          ? quickWins.slice(0, 4).map((issue, i) => <IssueRow key={i} issue={issue} />)
          : null}
      </Section>
      {quickWins.length === 0 && <p style={{ fontSize: 13, color: '#4b4b4b', margin: '0 0 20px 18px' }}>No quick wins identified.</p>}

      <div style={{ margin: '20px 0', borderTop: '1px solid #f0f0f0' }} />

      <Section title="Next Sprint" accent="#4b6bfb">
        {nextSprint.length > 0
          ? nextSprint.map((issue, i) => <IssueRow key={i} issue={issue} />)
          : null}
      </Section>
      {nextSprint.length === 0 && <p style={{ fontSize: 13, color: '#4b4b4b', margin: '0 0 4px 18px' }}>No remaining moderate or minor issues.</p>}
    </div>
  );
}
