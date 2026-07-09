import React from 'react';
import { useRouter } from 'next/navigation';
import ExecutiveSummaryCard from './ExecutiveSummaryCard';
import PriorityPlan from './PriorityPlan';
import PageCoverage from './PageCoverage';
import TopIssueExample from './TopIssueExample';
import ScopeOfWork from './ScopeOfWork';
import AuditActions from './AuditActions';
import { getAuditUrl, getGeneratedDate, getPagesScanned, formatDomain } from './auditHelpers';

function AuditHeader({ report, scanRow }) {
  const router = useRouter();
  const url = getAuditUrl(report, scanRow);
  const domain = formatDomain(url) || url;
  const generatedAt = getGeneratedDate(report, scanRow);
  const dateStr = generatedAt ? new Date(generatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const pages = getPagesScanned(report);

  function goToDashboard() {
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '28px 36px', marginBottom: 24 }}>
      <button
        onClick={goToDashboard}
        style={{ background: 'none', border: 'none', color: '#4b4b4b', cursor: 'pointer', fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: '#e0e7ff', color: '#4b6bfb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Executive Audit
            </span>
            <span style={{ fontSize: 11, color: '#4b4b4b', fontWeight: 600 }}>WCAG 2.2 AA</span>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: '#121212', letterSpacing: '-0.02em' }}>
            Website Accessibility Report
          </h1>
          <div style={{ fontSize: 15, color: '#4b6bfb', fontWeight: 600, marginBottom: 8 }}>{domain}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Generated', value: dateStr },
              { label: 'Pages scanned', value: pages },
              { label: 'Standard', value: 'WCAG 2.2 AA' },
              { label: 'Prepared by', value: 'CompliantScan' },
            ].map(m => (
              <div key={m.label} style={{ fontSize: 12 }}>
                <span style={{ color: '#4b4b4b' }}>{m.label}: </span>
                <span style={{ color: '#121212', fontWeight: 600 }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WhatThisMeans() {
  return (
    <div style={{ background: '#fff', borderRadius: 28, border: '1px solid #ededed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '28px 36px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#121212' }}>What This Means</h2>
      <p style={{ margin: 0, fontSize: 15, color: '#4b4b4b', lineHeight: 1.7, maxWidth: 720 }}>
        This website has accessibility issues that may affect visitors using screen readers, keyboard navigation, or low-vision assistive workflows.
        The highest-priority fixes should be addressed first because they can block users from completing core actions on the site.
        Addressing these issues improves the experience for all users and demonstrates a commitment to inclusive design.
      </p>
    </div>
  );
}

export default function AuditExecutiveReport({ report, scanRow }) {
  return (
    <div style={{ background: '#f8fafd', minHeight: '100vh', padding: '32px 32px 64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <AuditHeader report={report} scanRow={scanRow} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
          {/* Main column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <ExecutiveSummaryCard report={report} />
            <WhatThisMeans />
            <PriorityPlan report={report} />
            <TopIssueExample report={report} />
            <PageCoverage report={report} />
            <ScopeOfWork report={report} />
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 24 }}>
            <AuditActions report={report} />
          </div>
        </div>
      </div>
    </div>
  );
}
