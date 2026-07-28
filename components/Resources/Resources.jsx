import Link from 'next/link';
import styles from './Resources.module.css';

export default function Resources() {
  return (
    <section className={styles.section} id="resources">
      <div className={styles.container}>
        <p className={styles.label}>Resources & Guides</p>
        <h2 className={styles.heading}>
          Latest Accessibility Field Guide
        </h2>
        <p className={styles.subheading}>
          Practical checklists and frameworks to help your agency audit client websites, communicate WCAG findings, and plan remediation.
        </p>

        <div className={styles.card}>
          <div className={styles.badgeRow}>
            <span className={styles.categoryBadge}>Agency Field Guide</span>
            <span className={styles.readTime}>12 min read</span>
          </div>

          <h3 className={styles.articleTitle}>
            <Link
              href="/blogs/website-accessibility-audit-checklist-for-agencies"
              className={styles.articleTitleLink}
            >
              Website Accessibility Audit Checklist for Web Agencies
            </Link>
          </h3>

          <p className={styles.articleExcerpt}>
            A practical, repeatable 10-part process for finding WCAG 2.2 barriers, prioritizing critical issues, and delivering actionable accessibility audit reports to clients.
          </p>

          <div className={styles.actionRow}>
            <Link
              href="/blogs/website-accessibility-audit-checklist-for-agencies"
              className={styles.readLink}
            >
              Read the website accessibility audit checklist &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
