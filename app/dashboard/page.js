'use client';

import { useDashboard } from '../context/DashboardContext';
import StatCard from '../../components/Dashboard/StatCard/StatCard';
import ScanWebsiteCard from '../../components/Dashboard/ScanWebsiteCard/ScanWebsiteCard';
import PlanCard from '../../components/Dashboard/PlanCard/PlanCard';
import RecentReportsTable from '../../components/Dashboard/RecentReportsTable/RecentReportsTable';

export default function DashboardPage() {
  const { data, isInitialLoading, isRefreshing, error, refetch } = useDashboard();

  // Build stat cards from real data (or show skeleton values while loading)
  const stats = [
    {
      id: 'websites',
      label: 'Websites Scanned',
      value: String(data?.websitesScanned ?? 0),
      trend: 'unique domains',
      trendDirection: 'neutral',
      icon: 'globe',
      color: 'blue',
    },
    {
      id: 'pages',
      label: 'Pages Scanned',
      value: String(data?.pagesScanned ?? 0),
      trend: 'total pages',
      trendDirection: 'neutral',
      icon: 'file',
      color: 'green',
    },
    {
      id: 'violations',
      label: 'Total Violations',
      value: String(data?.totalViolations ?? 0),
      trend: 'across all scans',
      trendDirection: 'neutral',
      icon: 'alert',
      color: 'red',
    },
    {
      id: 'critical',
      label: 'Critical Issues',
      value: String(data?.criticalIssues ?? 0),
      trend: 'critical severity',
      trendDirection: 'neutral',
      icon: 'shield',
      color: 'orange',
    },
    {
      id: 'score',
      label: 'Avg. Accessibility Score',
      value: `${data?.avgScore ?? 0}/100`,
      trend: 'average across scans',
      trendDirection: 'neutral',
      icon: 'chart',
      color: 'purple',
    },
  ];

  return (
    <>
      {/* Error banner — only when no data exists */}
      {error && !data && (
        <div
          role="alert"
          style={{
            margin: '0 0 16px',
            padding: '12px 16px',
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '8px',
            color: '#b91c1c',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span>Could not load dashboard data. Please refresh.</span>
          <button
            type="button"
            onClick={refetch}
            style={{
              background: 'none',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              color: '#b91c1c',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '13px',
              whiteSpace: 'nowrap',
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Subtle background refresh indicator */}
      {isRefreshing && data && (
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
          Refreshing…
        </div>
      )}

      <section className="dashboard-stats" aria-label="Dashboard statistics">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} isInitialLoading={isInitialLoading} />
        ))}
      </section>

      <section className="dashboard-middle">
        <ScanWebsiteCard onScanComplete={refetch} />
        <PlanCard />
      </section>

      <RecentReportsTable
        reports={data?.recentReports ?? []}
        isInitialLoading={isInitialLoading}
      />
    </>
  );
}
