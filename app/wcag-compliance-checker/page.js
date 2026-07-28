import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ScannerInput from '@/components/ScannerInput/ScannerInput';
import styles from './checker.module.css';

export const metadata = {
  title: 'WCAG Compliance Checker for Websites | CompliantScan',
  description:
    'Free online WCAG compliance checker for web agencies and developers. Audit any website against WCAG 2.2 AA standards for contrast, form labels, ARIA, and DOM structure.',
  alternates: {
    canonical: 'https://www.compliantscan.com/wcag-compliance-checker',
  },
  openGraph: {
    title: 'WCAG Compliance Checker for Websites | CompliantScan',
    description:
      'Run automated WCAG 2.2 accessibility checks on any web page. Identify contrast issues, missing labels, and structural DOM barriers instantly.',
    url: 'https://www.compliantscan.com/wcag-compliance-checker',
    siteName: 'CompliantScan',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG Compliance Checker for Websites | CompliantScan',
    description:
      'Run automated WCAG 2.2 accessibility checks on any web page with CompliantScan.',
  },
};

export default function WCAGComplianceCheckerPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CompliantScan WCAG Compliance Checker',
    url: 'https://www.compliantscan.com/wcag-compliance-checker',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    description:
      'An automated WCAG 2.2 accessibility checker designed for web agencies to audit sites, detect programmatic violations, and generate client reports.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
  };

  return (
    <main className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* Hero & Scanner Form */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>Automated WCAG 2.2 Audit Tool</span>
          <h1>WCAG Compliance Checker for Websites</h1>
          <p className={styles.subtitle}>
            Audit any web page against Web Content Accessibility Guidelines (WCAG 2.2 Level AA). Instantly identify programmatic accessibility barriers, low contrast text, missing form labels, and broken ARIA markup.
          </p>

          <div className={styles.scanFormBox}>
            <ScannerInput />
          </div>
        </div>
      </section>

      {/* What the Checker Scans */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Automated Testing Scope</p>
            <h2>What Our WCAG Compliance Checker Tests</h2>
            <p className={styles.sectionLead}>
              CompliantScan uses real browser automation to execute client-side JavaScript, rendering pages exactly as modern browsers display them before running deterministic WCAG 2.2 rules.
            </p>
          </div>

          <div className={styles.grid3}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Forms & Inputs</span>
                <h3>Programmatic Form Labels</h3>
              </div>
              <p>
                Identifies form fields, select menus, and checkboxes missing explicit <code>&lt;label&gt;</code> tags, <code>aria-label</code> attributes, or valid <code>aria-labelledby</code> associations.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Visual Contrast</span>
                <h3>Color Contrast Ratios</h3>
              </div>
              <p>
                Calculates text and background color contrast ratios to ensure compliance with WCAG 2.2 AA requirements (4.5:1 for regular body text, 3:1 for large text).
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Media & Images</span>
                <h3>Alternative Text & Descriptions</h3>
              </div>
              <p>
                Flags informative images missing <code>alt</code> attributes, decorative images missing empty <code>alt=&quot;&quot;</code> strings, and redundant alt descriptions.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Document Architecture</span>
                <h3>Heading Hierarchy & Structure</h3>
              </div>
              <p>
                Inspects structural document outlines (<code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>) for skipped heading levels, missing main headings, and missing <code>lang</code> tags.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Interactive Elements</span>
                <h3>ARIA Roles & Focus Targets</h3>
              </div>
              <p>
                Detects invalid ARIA roles, un-namable button icons, duplicate DOM element IDs, and interactive controls unreachable by keyboard.
              </p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>Navigation & Region</span>
                <h3>Landmark Region Markup</h3>
              </div>
              <p>
                Verifies semantic HTML layout containers (<code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;footer&gt;</code>) to guarantee proper assistive navigation landmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Realistic Compliance Disclaimer */}
      <section className={styles.disclaimerSection}>
        <div className={styles.container}>
          <div className={styles.disclaimerBox}>
            <span className={styles.warningTag}>Important Audit Context</span>
            <h2>Automated Testing Does Not Guarantee Full Legal Compliance</h2>
            <p>
              Automated WCAG compliance checkers evaluate around 30% to 40% of total WCAG success criteria. While automated scanners are fast and essential for catching code-level violations at scale, machine algorithms cannot determine if alternative text accurately describes an image contextually, if video captions match spoken dialogue, or if complex navigation menus make logical sense to a screen-reader user.
            </p>
            <p>
              To achieve thorough accessibility and minimize ADA legal exposure, agencies should always pair automated WCAG scans with focused manual testing, including keyboard-only navigation and native screen reader passes.
            </p>
          </div>
        </div>
      </section>

      {/* Agency Guides & Internal Links */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.eyebrow}>Agency Field Guides</p>
            <h2>Step-by-Step Accessibility Guides for Web Agencies</h2>
            <p className={styles.sectionLead}>
              Explore our agency resources to build a consistent, repeatable WCAG testing workflow for client projects.
            </p>
          </div>

          <div className={styles.grid2}>
            <div className={styles.resourceCard}>
              <span className={styles.meta}>Audit Checklist</span>
              <h3>
                <Link href="/blogs/website-accessibility-audit-checklist-for-agencies" className={styles.resourceLink}>
                  Website Accessibility Audit Checklist for Web Agencies
                </Link>
              </h3>
              <p>
                A practical, 10-part checklist covering representative page sampling, automated scans, manual review, and presenting WCAG findings to clients.
              </p>
              <Link href="/blogs/website-accessibility-audit-checklist-for-agencies" className={styles.readMore}>
                Read the website accessibility audit checklist &rarr;
              </Link>
            </div>

            <div className={styles.resourceCard}>
              <span className={styles.meta}>Testing Strategy</span>
              <h3>
                <Link href="/blogs/automated-vs-manual-accessibility-testing" className={styles.resourceLink}>
                  Automated vs Manual Accessibility Testing Guide
                </Link>
              </h3>
              <p>
                Learn what automated tools catch, what requires human review, and how agencies combine both methods for defensible client audits.
              </p>
              <Link href="/blogs/automated-vs-manual-accessibility-testing" className={styles.readMore}>
                Read the automated vs manual testing guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBox}>
            <h2>Ready to Run a WCAG Scan Across Your Client Sites?</h2>
            <p>
              Use CompliantScan to discover automated WCAG 2.2 issues, track compliance scores, and generate client-ready executive reports.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/#scanner" className={styles.btnPrimary}>
                Scan a website for accessibility issues
              </Link>
              <Link href="/pricing" className={styles.btnSecondary}>
                Compare accessibility scanner pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
