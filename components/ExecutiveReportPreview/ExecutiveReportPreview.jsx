import ScoreGauge from './ScoreGauge';
import styles from './ExecutiveReportPreview.module.css';

const SEVERITY_ITEMS = [
  { label: 'Critical', count: 13, colorVar: 'var(--color-critical)' },
  { label: 'Serious', count: 9, colorVar: 'var(--color-serious)' },
  { label: 'Moderate', count: 18, colorVar: 'var(--color-moderate)' },
  { label: 'Minor', count: 5, colorVar: 'var(--color-minor)' },
];

const TOP_ISSUES = [
  {
    title: 'Buttons must have discernible text',
    count: 7,
    severity: 'Critical',
    colorVar: 'var(--color-critical)',
  },
  {
    title: 'Images must have alt text',
    count: 5,
    severity: 'Serious',
    colorVar: 'var(--color-serious)',
  },
  {
    title: 'Form elements must have labels',
    count: 4,
    severity: 'Serious',
    colorVar: 'var(--color-serious)',
  },
  {
    title: 'Low contrast text detected',
    count: 6,
    severity: 'Moderate',
    colorVar: 'var(--color-moderate)',
  },
];

export default function ExecutiveReportPreview() {
  return (
    <div className={styles.stack}>
      <div className={styles.sheetBack} aria-hidden="true" />
      <div className={styles.sheetMid} aria-hidden="true" />

      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>Executive Accessibility Report</h2>
            <p className={styles.website}>example.com</p>
            <p className={styles.timestamp}>
              Scanned on May 20, 2025 at 9:41 AM
            </p>
          </div>
          <ScoreGauge score={35} label="Critical" />
        </header>

        <div className={styles.divider} />

        <section className={styles.summaryRow}>
          <div>
            <p className={styles.sectionLabel}>Summary</p>
            <p className={styles.summaryText}>
              Your website has good accessibility foundations but needs
              improvement in several key areas to meet WCAG 2.2 AA
              standards.
            </p>
          </div>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>24</span>
              <span className={styles.statLabel}>Pages Scanned</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>34</span>
              <span className={styles.statLabel}>Issues Found</span>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        <section>
          <p className={styles.sectionLabel}>Issues by severity</p>
          <div className={styles.severityGrid}>
            {SEVERITY_ITEMS.map((item) => (
              <div key={item.label} className={styles.severityItem}>
                <span className={styles.severityLabel}>{item.label}</span>
                <span className={styles.severityCount}>{item.count}</span>
                <span
                  className={styles.severityBar}
                  style={{ background: item.colorVar }}
                />
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        <section>
          <p className={styles.sectionLabel}>Top issues</p>
          <ul className={styles.issuesList}>
            {TOP_ISSUES.map((issue) => (
              <li key={issue.title} className={styles.issueRow}>
                <span
                  className={styles.issueDot}
                  style={{ background: issue.colorVar }}
                  aria-hidden="true"
                />
                <span className={styles.issueTitle}>{issue.title}</span>
                <span className={styles.issueCount}>{issue.count}</span>
                <span className={styles.issueSeverity}>{issue.severity}</span>
              </li>
            ))}
          </ul>
        </section>

        <a href="/report/example" className={styles.viewLink}>
          View full report
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.9 7h8.2M11.1 7L7.6 3.5M11.1 7L7.6 10.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}