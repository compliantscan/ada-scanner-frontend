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
        Accessibility
        <br />
        reports that
        <br />
        <em className={styles.headlineAccent}>win client trust.</em>
      </h1>

      <p className={styles.subhead}>
        CompliantScan helps agencies find WCAG 2.2 issues, communicate
        impact clearly, and deliver accessibility improvements with
        confidence.
      </p>

      <ScannerInput />
    </div>
  );
}