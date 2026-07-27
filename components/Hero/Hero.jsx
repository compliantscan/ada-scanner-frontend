import ScannerInput from '../ScannerInput/ScannerInput';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.left}>
      <span className={styles.badge}>
        <span className={styles.badgeDot} aria-hidden="true" />
        AI-powered accessibility audits
      </span>

      <h1 className={styles.headline}>
        Website Accessibility{' '}
        <br />
        Scanner for <em className={styles.headlineAccent}>Web Agencies</em>
      </h1>

      <p className={styles.subhead}>
        Find WCAG 2.2 issues, prioritize fixes, and generate client-ready
        accessibility reports in minutes.
      </p>

      <ScannerInput />
    </div>
  );
}
