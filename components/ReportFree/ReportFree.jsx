import Link from 'next/link';
import styles from './ReportFree.module.css';

const SEVERITY_BADGE_CLASS = {
  Critical: 'badgeCritical',
  Serious: 'badgeSerious',
  Moderate: 'badgeModerate',
  Minor: 'badgeMinor',
  critical: 'badgeCritical',
  serious: 'badgeSerious',
  moderate: 'badgeModerate',
  minor: 'badgeMinor',
};

function ScoreGaugeSmall({ score, label }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.gaugeWrap}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-gauge-track)" strokeWidth="9" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--color-brand-green)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className={styles.gaugeText}>
        <span className={styles.gaugeScore}>{score}</span>
        <span className={styles.gaugeLabel}>{label}</span>
      </div>
    </div>
  );
}

export default function ReportFree({ scanData }) {
  const summary = scanData?.executiveSummary || scanData || {};
  const severityCounts = summary.severityCounts || { critical: 0, serious: 0, moderate: 0, minor: 0 };
  
  const SEVERITY_SUMMARY = [
    { label: 'Critical', value: severityCounts.critical || 0, color: 'var(--color-critical)' },
    { label: 'Serious', value: severityCounts.serious || 0, color: 'var(--color-serious)' },
    { label: 'Moderate', value: severityCounts.moderate || 0, color: 'var(--color-moderate)' },
    { label: 'Minor', value: severityCounts.minor || 0, color: 'var(--color-minor)' },
  ];

  const SEVERITY_CARDS = [
    { label: 'Critical', value: severityCounts.critical || 0, note: 'Must fix', color: 'var(--color-critical)' },
    { label: 'Serious', value: severityCounts.serious || 0, note: 'Should fix', color: 'var(--color-serious)' },
    { label: 'Moderate', value: severityCounts.moderate || 0, note: 'Consider fixing', color: 'var(--color-moderate)' },
    { label: 'Minor', value: severityCounts.minor || 0, note: 'Nice to fix', color: 'var(--color-minor)' },
  ];

  const totalIssues = SEVERITY_SUMMARY.reduce((acc, curr) => acc + curr.value, 0);
  const pagesScanned = scanData?.pages?.length || summary.pagesScanned || 1;

  const STATS = [
    {
      id: 'pages',
      value: pagesScanned.toString(),
      label: 'Pages Scanned',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="3.5" width="14" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'issues',
      value: totalIssues.toString(),
      label: 'Issues Found',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 20V10M11 20V4M18 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'scan-time',
      value: summary.estimatedFixTime || '60s',
      label: 'Scan Time',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'standard',
      value: 'WCAG 2.1 AA',
      label: 'Target Standard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const violations = scanData?.violations || [];
  const topIssues = violations.slice(0, 4).map((v, idx) => ({
    id: idx,
    severity: v.severity.charAt(0).toUpperCase() + v.severity.slice(1),
    title: v.title || v.description,
    elements: v.affectedElements || 1,
    pages: Math.min(pagesScanned, v.affectedElements || 1),
  }));

  let domain = 'example.com';
  try {
    if (scanData?.url) domain = new URL(scanData.url).hostname;
  } catch (e) {
    domain = scanData?.url || 'example.com';
  }

  const scanDate = scanData?.timestamp || scanData?.createdAt || scanData?.created_at
    ? new Date(scanData.timestamp || scanData.createdAt || scanData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  const score = summary.score || 0;
  let scoreLabel = 'Poor';
  if (score >= 90) scoreLabel = 'Excellent';
  else if (score >= 70) scoreLabel = 'Good';
  else if (score >= 50) scoreLabel = 'Fair';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Link href="/"><span>CompliantScan</span></Link>
        </div>

        <div className={styles.headerActions}>
          <Link href="/report" className={styles.downloadButton}>
            Get Full Report
          </Link>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.thumbnailCard}>
            <div className={styles.thumbnail}>
              <div className={styles.thumbnailTopBar} />
              <div className={styles.thumbnailContent}>
                <div className={styles.thumbnailTextBlock}>
                  <span className={styles.thumbnailHeadline}>Elevating brands</span>
                  <span className={styles.thumbnailHeadline}>through thoughtful design</span>
                  <span className={styles.thumbnailCta} />
                </div>
                <div className={styles.thumbnailImageBlock} />
              </div>
            </div>
            <p className={styles.domain}>{domain}</p>
            <p className={styles.metaText}>Scanned on {scanDate}</p>
            <p className={styles.metaText}>Scan Type: {pagesScanned > 1 ? 'Full Website Scan' : 'Single Page Scan'}</p>
          </div>

          <div className={styles.scoreCard}>
            <p className={styles.scoreCardLabel}>Overall Accessibility Score</p>
            <ScoreGaugeSmall score={score} label={scoreLabel} />
          </div>

          <div className={styles.severityListCard}>
            {SEVERITY_SUMMARY.map((item) => (
              <div key={item.label} className={styles.severityListRow}>
                <span className={styles.severityDot} style={{ backgroundColor: item.color }} />
                <span className={styles.severityListValue}>{item.value}</span>
                <span className={styles.severityListLabel}>{item.label}</span>
              </div>
            ))}
            <div className={styles.severityListTotal}>
              <span>Total Issues</span>
              <span>{totalIssues}</span>
            </div>
          </div>

          <div className={styles.unlockCard}>
            <span className={styles.lockIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <p className={styles.unlockTitle}>View Your Full Report</p>
            <p className={styles.unlockText}>
              Open your five-page agency snapshot, review the priority findings,
              and download the PDF without creating an account.
            </p>
            <Link href="/report" className={styles.unlockButton}>
              Open Full Report
            </Link>
          </div>
        </aside>

        <main className={styles.main}>
          <section className={styles.summarySection}>
            <h1 className={styles.summaryHeading}>Executive Summary</h1>
            <p className={styles.summaryText}>
              Your website has {score >= 90 ? 'excellent' : score >= 70 ? 'good' : 'poor'} accessibility foundations {score < 90 && 'but needs improvement in several key areas to meet WCAG 2.1 AA standards.'}
              {score < 90 && ' Addressing these issues will improve usability for people with disabilities and reduce legal risk.'}
            </p>

            <div className={styles.statsRow}>
              {STATS.map((stat) => (
                <div key={stat.id} className={styles.statItem}>
                  <span className={styles.statIcon}>{stat.icon}</span>
                  <div>
                    <p className={styles.statValue}>{stat.value}</p>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {totalIssues > 0 && (
            <section className={styles.severitySection}>
              <h2 className={styles.sectionHeading}>Issues by Severity</h2>
              <p className={styles.sectionSubtext}>
                Issues are grouped by their impact level. Start with critical
                and serious issues first.
              </p>

              <div className={styles.severityCardsGrid}>
                {SEVERITY_CARDS.map((card) => (
                  <div key={card.label} className={styles.severityCard}>
                    <p className={styles.severityCardLabel}>{card.label}</p>
                    <p className={styles.severityCardValue} style={{ color: card.color }}>
                      {card.value}
                    </p>
                    <p className={styles.severityCardNote}>{card.note}</p>
                    <span className={styles.severityCardBar} style={{ backgroundColor: card.color }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {topIssues.length > 0 && (
            <section className={styles.topIssuesSection}>
              <div className={styles.topIssuesHeader}>
                <div>
                  <h2 className={styles.sectionHeading}>Top Issues</h2>
                  <p className={styles.sectionSubtext}>
                    These issues impact the most pages and users on your website.
                  </p>
                </div>
                <Link href="/report" className={styles.viewAllLink}>
                  View all issues
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <div className={styles.issuesList}>
                {topIssues.map((issue) => (
                  <div key={issue.id} className={styles.issueRow}>
                    <span className={`${styles.severityBadge} ${styles[SEVERITY_BADGE_CLASS[issue.severity] || styles.badgeMinor]}`}>
                      {issue.severity}
                    </span>
                    <span className={styles.issueTitle}>{issue.title}</span>
                    <div className={styles.issueMeta}>
                      <span className={styles.issueMetaValue}>{issue.elements}</span>
                      <span className={styles.issueMetaLabel}>Affected Elements</span>
                    </div>
                    <div className={styles.issueMeta}>
                      <span className={styles.issueMetaValue}>{issue.pages}</span>
                      <span className={styles.issueMetaLabel}>Pages</span>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles.issueChevron}>
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.ctaBanner}>
            <div className={styles.ctaBannerLeft}>
              <span className={styles.ctaBannerIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3l1.8 4.9L18.5 9l-4.7 1.1L12 15l-1.8-4.9L5.5 9l4.7-1.1L12 3z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className={styles.ctaBannerTitle}>Get Your Full Agency Report</p>
                <p className={styles.ctaBannerText}>
                  Review the priority findings and download a client-ready
                  five-page PDF. No login required.
                </p>
              </div>
            </div>
            <Link href="/report" className={styles.ctaBannerButton}>
              Open Full Report
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
