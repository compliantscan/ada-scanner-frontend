import styles from './ScoreGauge.module.css';

const RADIUS = 34;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreGauge({ score = 35, label = 'Critical' }) {
  const progress = (score / 100) * CIRCUMFERENCE;

  return (
    <div className={styles.gauge}>
      <svg width="88" height="88" viewBox="0 0 88 88" className={styles.svg}>
        <circle
          cx="44"
          cy="44"
          r={RADIUS}
          fill="none"
          stroke="var(--color-gauge-track)"
          strokeWidth={STROKE}
        />
        <circle
          cx="44"
          cy="44"
          r={RADIUS}
          fill="none"
          stroke="var(--color-critical)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central" className={styles.scoreText}>
          {score}
        </text>
      </svg>
      <span className={styles.scoreLabel}>{label}</span>
    </div>
  );
}