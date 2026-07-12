import styles from './BuiltForAgencies.module.css';

const ROWS = [
  [
    {
      id: 'real-browser-scanning',
      title: 'Real Browser Scanning',
      description:
        'We scan with a real Chromium browser to analyze JavaScript-rendered content accurately.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      id: 'executive-reports',
      title: 'Executive Reports',
      description:
        'Beautiful, client-ready reports that communicate impact, risk, and recommended actions.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 20V10M11 20V4M18 20v-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ],
  [
    {
      id: 'developer-guidance',
      title: 'Developer Guidance',
      description:
        'Technical details, code examples, and AI-powered remediation guidance.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M8.5 8L4 12l4.5 4M15.5 8l4.5 4-4.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'agency-workflow',
      title: 'Agency Workflow',
      description:
        'Manage scans, share reports, and collaborate with your team and clients.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="8.5" cy="8" r="2.75" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M14.8 14.2c2.3.2 3.8 1.9 3.9 4.3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ],
  [
    {
      id: 'scan-history',
      title: 'Scan History',
      description:
        'Track progress over time and compare scans to measure improvements.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 7v5l3.5 2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'secure-private',
      title: 'Secure & Private',
      description:
        'Your data is always private. Scans and reports are visible only to your workspace.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect
            x="5.5"
            y="10.5"
            width="13"
            height="9.5"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 14v2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ],
];

export default function BuiltForAgencies() {
  return (
    <section id="built-for-agencies" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.label}>Built for agencies</p>
          <h2 className={styles.heading}>
            Everything you need to deliver accessible websites.
          </h2>
          <p className={styles.description}>
            From automated audits to developer guidance and executive
            summaries, CompliantScan fits seamlessly into your workflow.
          </p>
        </div>

        <div className={styles.right}>
          {ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.stackRow}
              style={{ zIndex: rowIndex + 1 }}
            >
              <div className={styles.rowInner}>
                {row.map((feature) => (
                  <div key={feature.id} className={styles.featureCard}>
                    <div className={styles.iconBox}>{feature.icon}</div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}