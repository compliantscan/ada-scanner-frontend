import styles from './Stakes.module.css';

const STATS = [
  {
    id: 'lawsuits',
    value: '3,117',
    label: 'federal accessibility lawsuits filed in 2025',
    detail: 'Up 27% from 2,452 in 2024.',
    source: 'Seyfarth Shaw, 2026',
  },
  {
    id: 'fail-rate',
    value: '95.9%',
    label: 'of websites fail basic accessibility checks',
    detail: 'Across the top 1M homepages tested.',
    source: 'WebAIM Million, 2026',
  },
  {
    id: 'widgets',
    value: '22.6%',
    label: 'of sued sites already had a widget installed',
    detail: "Overlays don't stop lawsuits — or the FTC.",
    source: 'EcomBack, H1 2025',
  },
];

export default function Stakes() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>The stakes</p>
        <h2 className={styles.heading}>
          Your clients are already being sued for this.
        </h2>
        <p className={styles.subheading}>
          Accessibility lawsuits aren&apos;t rare or theoretical &mdash; they&apos;re
          rising fast, and an installed widget doesn&apos;t make your clients
          safe. Neither does ignoring it make your agency safe.
        </p>

        <div className={styles.statsGrid}>
          {STATS.map((stat) => (
            <div key={stat.id} className={styles.statCard}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statLabel}>{stat.label}</p>
              <p className={styles.statDetail}>{stat.detail}</p>
              <p className={styles.statSource}>Source: {stat.source}</p>
            </div>
          ))}
        </div>

        <div className={styles.footNote}>
          <p>
            In January 2025, the FTC fined accessiBe $1M for misleading
            businesses about what its accessibility widget could actually
            guarantee. Overlays patch symptoms &mdash; they don&apos;t fix
            underlying WCAG violations, and courts have noticed.
          </p>
        </div>
      </div>
    </section>
  );
}