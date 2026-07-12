import React from 'react';
import { getTopPriorityIssues, getIssues } from './auditHelpers';

const SEV_BADGE = {
  critical: { bg: '#fee2e2', color: '#991b1b' },
  serious:  { bg: '#fef3c7', color: '#92400e' },
  moderate: { bg: '#fefce8', color: '#713f12' },
  minor:    { bg: '#eff6ff', color: '#1e40af' },
};

function BrowserFrame({ screenshotUrl, highlightBox }) {
  return (
    <div style={{ borderRadius: 16, border: '1px solid #ededed', overflow: 'hidden', background: '#f8fafd' }}>
      {/* Browser chrome */}
      <div style={{ background: '#f0f0f0', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map(c => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block' }} />
          ))}
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#4b4b4b', border: '1px solid #e0e0e0' }}>
          {screenshotUrl ? screenshotUrl : 'Screenshot preview'}
        </div>
      </div>
      {/* Content area */}
      <div style={{ position: 'relative', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        {screenshotUrl ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img src={screenshotUrl} alt="Issue screenshot" style={{ width: '100%', borderRadius: 8, display: 'block' }} />
            {highlightBox && (
              <div style={{
                position: 'absolute',
                top: highlightBox.y, left: highlightBox.x,
                width: highlightBox.width, height: highlightBox.height,
                border: '2px solid #ef4444',
                borderRadius: 4,
                boxShadow: '0 0 0 2px rgba(239,68,68,0.2)',
                pointerEvents: 'none',
              }} />
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#4b4b4b' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Screenshot preview unavailable for this issue</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TopIssueExample({ report }) {
  const issues = getIssues(report);
  const top = getTopPriorityIssues(issues, 1)[0];
  if (!top) return null;

  const sev = SEV_BADGE[top.severity] || SEV_BADGE.minor;
  const screenshotUrl = top.screenshot || top.screenshotUrl || null;
  const highlightBox = top.highlightBox || null;
  const pageUrl = report?.url || '';

  const whyItMatters = top.fix?.explanation
    || `Some visitors may not be able to interact with this element when using assistive technology.`;
  const recommendedFix = top.fix?.withThis
    ? `Update the element: ${top.fix.withThis.slice(0, 120)}${top.fix.withThis.length > 120 ? '…' : ''}`
    : `Review and remediate this element to meet WCAG 2.2 AA requirements.`;

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '32px 36px' }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: '#121212' }}>Top Issue Example</h2>
      <p style={{ margin: '0 0 24px', fontSize: 13, color: '#4b4b4b' }}>Highest-severity issue found during this audit.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, alignItems: 'start' }}>
        <BrowserFrame screenshotUrl={screenshotUrl} highlightBox={highlightBox} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'capitalize', background: sev.bg, color: sev.color }}>
              {top.severity}
            </span>
            {top.wcag?.id && (
              <span style={{ fontSize: 11, color: '#4b6bfb', fontWeight: 600 }}>WCAG {top.wcag.id}</span>
            )}
          </div>

          <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#121212', lineHeight: 1.4 }}>
            {top.title || top.description || top.ruleId}
          </h3>

          {pageUrl && (
            <div style={{ fontSize: 12, color: '#4b4b4b', marginBottom: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Affected page: <span style={{ color: '#4b6bfb' }}>{pageUrl}</span>
            </div>
          )}

          <div style={{ background: '#f8fafd', borderRadius: 14, padding: '16px 18px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4b4b4b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Why this matters</div>
            <p style={{ margin: 0, fontSize: 13, color: '#121212', lineHeight: 1.6 }}>{whyItMatters}</p>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 14, padding: '16px 18px', border: '1px solid #bbf7d0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Recommended fix</div>
            <p style={{ margin: 0, fontSize: 13, color: '#14532d', lineHeight: 1.6 }}>{recommendedFix}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
