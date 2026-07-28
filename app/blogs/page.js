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
          <div className={styles.articleList}>
            <Link
              className={styles.articleCard}
              href="/blogs/website-accessibility-report-template"
            >
              <div className={styles.cardVisual} aria-hidden="true">
                <span className={styles.visualLabel}>Client reporting</span>
                <strong>Executive clarity + developer detail</strong>
                <div className={styles.checkRows}>
                  <span>Issue priorities</span>
                  <span>Component patterns</span>
                  <span>Remediation roadmap</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardMeta}>Report template · 9 min read</p>
                <h2>Website Accessibility Report Template for Web Agencies</h2>
                <p>
                  Copy a practical report structure for presenting scores,
                  prioritized findings, developer fixes, and next steps to
                  agency clients.
                </p>
                <span className={styles.readLink}>Use the report template →</span>
              </div>
            </Link>

            <Link
              className={styles.articleCard}
              href="/blogs/automated-vs-manual-accessibility-testing"
            >
              <div className={styles.cardVisual} aria-hidden="true">
                <span className={styles.visualLabel}>Testing strategy</span>
                <strong>Automation + human review</strong>
                <div className={styles.checkRows}>
                  <span>Scanner coverage</span>
                  <span>Interaction testing</span>
                  <span>Combined reporting</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <p className={styles.cardMeta}>Testing workflow · 11 min read</p>
                <h2>
                  Automated vs Manual Accessibility Testing: A Guide for Web
                  Agencies
                </h2>
                <p>
                  Learn what scanners can detect, what requires human review,
                  and how to combine both methods into a practical client
                  workflow.
                </p>
                <span className={styles.readLink}>Compare testing methods →</span>
              </div>
            </Link>

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
        </div>
      </section>
      <Footer />
    </main>
  );
}
