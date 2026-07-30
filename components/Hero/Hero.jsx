import Link from 'next/link';
import ScannerInput from '../ScannerInput/ScannerInput';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <div className={styles.left} data-reveal-item data-hero-copy>
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

      <div id="scanner">
        <ScannerInput />
      </div>
      <p className={styles.guideLink}>
        Preparing a client review? Use our{' '}
        <Link href="/wcag-compliance-checker">
          WCAG compliance checker
        </Link>{' '}
        or follow our{' '}
        <Link href="/blogs/website-accessibility-audit-checklist-for-agencies">
          website accessibility audit checklist
        </Link>
        .
      </p>
    </div>
  );
}
