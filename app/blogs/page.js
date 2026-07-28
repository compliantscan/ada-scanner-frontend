import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './blogs.module.css';

export const metadata = {
  title: 'Website Accessibility Resources for Agencies | CompliantScan',
  description:
    'Practical WCAG guides, accessibility testing checklists, and reporting advice for web agencies.',
  alternates: {
    canonical: 'https://www.compliantscan.com/blogs',
  },
};

export default function BlogsPage() {
  return (
    <main>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Accessibility resources</p>
          <h1>Accessibility Guides for Web Agencies</h1>
          <p className={styles.intro}>
            Practical checklists and reporting guidance to help your agency
            find accessibility barriers, explain their impact, and plan fixes.
          </p>
        </div>
      </section>

      <section className={styles.articleSection}>
        <div className={styles.container}>
          <Link
            className={styles.articleCard}
            href="/blogs/website-accessibility-audit-checklist-for-agencies"
          >
            <div className={styles.cardVisual} aria-hidden="true">
              <span className={styles.visualLabel}>Agency field guide</span>
              <strong>10-part audit checklist</strong>
              <div className={styles.checkRows}>
                <span>Automated checks</span>
                <span>Manual review</span>
                <span>Client reporting</span>
              </div>
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardMeta}>WCAG 2.2 · 12 min read</p>
              <h2>Website Accessibility Audit Checklist for Web Agencies</h2>
              <p>
                A practical, repeatable process for testing client websites,
                prioritizing WCAG findings, and presenting a useful action
                plan.
              </p>
              <span className={styles.readLink}>Read the checklist →</span>
            </div>
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
