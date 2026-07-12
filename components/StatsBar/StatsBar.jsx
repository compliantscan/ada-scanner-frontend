import styles from './StatsBar.module.css';

const STATS = [
  {
    value: '95.9%',
    label: ['of websites fail', 'accessibility'],
  },
  {
    value: '60',
    suffix: 'sec',
    label: ['average', 'scan time'],
  },
  {
    value: 'WCAG 2.2',
    label: ['latest accessibility', 'guidelines'],
  },
  {
    value: 'PDF',
    label: ['client-ready', 'reports'],
  },
  {
    value: '100%',
    label: ['private & secure', 'workspaces'],
  },
];

export default function StatsBar() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {STATS.map((stat) => (
          <div key={stat.value} className={styles.stat}>
            <p className={styles.value}>
              {stat.value}
              {stat.suffix && <span className={styles.suffix}> {stat.suffix}</span>}
            </p>
            <p className={styles.label}>
              {stat.label[0]}
              <br />
              {stat.label[1]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}