import styles from './HowItWorks.module.css';

function StepConnector() {
  return (
    <div className={styles.stepConnector}>
      {[1, 2, 3, 4].map((num, i) => (
        <div key={num} className={styles.connectorItem}>
          <div className={styles.connectorCircle}>{num}</div>
          {i < 3 && <div className={styles.connectorLine} />}
        </div>
      ))}
    </div>
  );
}

function StepOneCard() {
  return (
    <div className={styles.card}>
      <div className={styles.urlField}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <span>https://yourwebsite.com</span>
      </div>
      <button className={styles.scanButton} type="button">
        Start Scan
      </button>
    </div>
  );
}

function StepTwoCard() {
  const checklist = [
    'Loading pages',
    'Crawling content',
    'Running accessibility tests',
    'Analyzing issues',
  ];

  return (
    <div className={styles.card}>
      <div className={styles.browserWindow}>
        <div className={styles.browserDots}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.browserBody}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <div className={styles.skeletonLines}>
            <span className={styles.skeletonLine} style={{ width: '70%' }} />
            <span className={styles.skeletonLine} style={{ width: '45%' }} />
          </div>
        </div>
        <p className={styles.scanningLabel}>Scanning website...</p>
        <ul className={styles.checklist}>
          {checklist.map((item) => (
            <li key={item}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="var(--color-brand-green)" />
                <path
                  d="M7.5 12.5l3 3 6-6.5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepThreeCard() {
  const severities = [
    { label: 'Critical', value: 13, color: 'var(--color-critical)' },
    { label: 'Serious', value: 9, color: 'var(--color-serious)' },
    { label: 'Moderate', value: 18, color: 'var(--color-moderate)' },
    { label: 'Minor', value: 5, color: 'var(--color-minor)' },
  ];

  const score = 35;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.card}>
      <div className={styles.railAndScore}>
        <div className={styles.iconRail}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="14" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.5 9h7M8.5 13h7M8.5 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className={styles.scoreArea}>
          <p className={styles.scoreLabel}>Accessibility Score</p>
          <div className={styles.gaugeWrap}>
            <svg width="90" height="90" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="var(--color-gauge-track)"
                strokeWidth="7"
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="var(--color-critical)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 45 45)"
              />
            </svg>
            <div className={styles.gaugeText}>
              <span className={styles.gaugeScore}>{score}</span>
              <span className={styles.gaugeLabel}>Critical</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.severityRow}>
        {severities.map((s) => (
          <div key={s.label} className={styles.severityItem}>
            <span className={styles.severityDot} style={{ backgroundColor: s.color }} />
            <span className={styles.severityValue}>{s.value}</span>
            <span className={styles.severityLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepFourCard() {
  return (
    <div className={styles.card}>
      <div className={styles.reportHeader}>
        <p className={styles.reportTitle}>Executive Accessibility Report</p>
        <div className={styles.downloadCircle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className={styles.skeletonLines} style={{ marginBottom: 16 }}>
        <span className={styles.skeletonLine} style={{ width: '85%' }} />
        <span className={styles.skeletonLine} style={{ width: '55%' }} />
      </div>

      <div className={styles.reportChartRow}>
        <div className={styles.skeletonLines}>
          <span className={styles.skeletonLine} style={{ width: '70%' }} />
          <span className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
        <svg width="64" height="28" viewBox="0 0 64 28" fill="none">
          <path
            d="M2 20l10-6 8 4 10-12 8 8 10-4 12 6"
            stroke="var(--color-brand-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button className={styles.downloadButton} type="button">
        Download PDF
      </button>
    </div>
  );
}

const STEPS = [
  {
    id: 1,
    title: 'Enter your website',
    description: 'Add your website URL and choose your scan type and report format.',
    Card: StepOneCard,
  },
  {
    id: 2,
    title: 'We scan your site',
    description:
      'Our real browser scans every page, runs WCAG 2.2 checks, and detects accessibility issues.',
    Card: StepTwoCard,
  },
  {
    id: 3,
    title: 'Get your results',
    description:
      'Receive a clear summary of issues, priority fixes, and an overall accessibility score.',
    Card: StepThreeCard,
  },
  {
    id: 4,
    title: 'Share and improve',
    description:
      'Download your report, share it with clients, and start improving accessibility with confidence.',
    Card: StepFourCard,
  },
];

const TRUST_ITEMS = [
  {
    id: 'scan-time',
    label: 'Average scan time: 60 seconds',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2L4 14h7l-1 8 10-13h-8l1-7z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'real-browser',
    label: 'Real browser scanning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 12.5l2 2 4-4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'wcag',
    label: 'WCAG 2.2 AA compliant',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 15.5l3-2 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'private',
    label: 'Your data is always private',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5.5" y="10.5" width="13" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>How it works</p>
        <h2 className={styles.heading}>Simple process. Powerful results.</h2>
        <p className={styles.subheading}>
          From scan to report in under a minute. CompliantScan makes accessibility
          auditing effortless.
        </p>

        <StepConnector />

        <div className={styles.stepsGrid}>
          {STEPS.map(({ id, title, description, Card }) => (
            <div key={id} className={styles.stepColumn}>
              <Card />
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepDescription}>{description}</p>
            </div>
          ))}
        </div>

        <div className={styles.trustBar}>
          {TRUST_ITEMS.map((item) => (
            <div key={item.id} className={styles.trustItem}>
              <span className={styles.trustIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}