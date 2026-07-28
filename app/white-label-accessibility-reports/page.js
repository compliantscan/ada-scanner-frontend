import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ScannerInput from '@/components/ScannerInput/ScannerInput';
import styles from './whitelabel.module.css';

export const metadata = {
    title: 'White Label Accessibility Reports for Agencies | CompliantScan',
    description:
        'Generate professional, client-ready WCAG accessibility reports under your own agency brand. Audit client sites, estimate remediation effort, and deliver recurring compliance reporting.',
    alternates: {
        canonical: 'https://www.compliantscan.com/white-label-accessibility-reports',
    },
    openGraph: {
        title: 'White Label Accessibility Reports for Web Agencies | CompliantScan',
        description:
            'Transform complex automated WCAG audits into executive summaries and developer guidance branded for your digital agency.',
        url: 'https://www.compliantscan.com/white-label-accessibility-reports',
        siteName: 'CompliantScan',
        type: 'website',
        images: [
            {
                url: 'https://www.compliantscan.com/white-label-accessibility-reports-og.png',
                alt: 'White Label Accessibility Reports built for web agencies',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'White Label Accessibility Reports for Agencies | CompliantScan',
        description:
            'Turn automated accessibility findings into professional executive summaries, developer guidance, and recurring client reports.',
        images: [
            'https://www.compliantscan.com/white-label-accessibility-reports-og.png',
        ],
    },
};

export default function WhiteLabelReportsPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'CompliantScan White Label Accessibility Reports',
        url: 'https://www.compliantscan.com/white-label-accessibility-reports',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        description:
            'White-label website accessibility reporting software for web design, development, and digital marketing agencies.',
    };

    return (
        <main className={styles.wrapper}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <span className={styles.badge}>Agency Client-Service Solution</span>
                    <h1>White Label Accessibility Reports Built for Web Agencies</h1>
                    <p className={styles.subtitle}>
                        Audit client websites for WCAG 2.2 barriers and deliver
                        executive-ready accessibility summaries, priority
                        roadmaps, and technical developer guides—all designed
                        to fit your agency&apos;s client-service workflow.
                    </p>

                    <div className={styles.scanFormBox}>
                        <ScannerInput />
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Client-Ready Workflow</p>
                        <h2>How Digital Agencies Deliver Accessibility Services</h2>
                        <p className={styles.sectionLead}>
                            Stop handing client stakeholders unformatted developer logs. CompliantScan converts technical scan engine outputs into clear, professional deliverables.
                        </p>
                    </div>

                    <div className={styles.grid3}>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>01</div>
                            <h3>Scan Client Assets</h3>
                            <p>
                                Run single-page or full-site automated scans on staging or live websites using real browser rendering powered by Playwright and <code>axe-core</code>.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>02</div>
                            <h3>Automated Executive Summaries</h3>
                            <p>
                                Present non-technical agency clients with clear risk assessments, high-level accessibility scores, and estimated business impact without confusing jargon.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>03</div>
                            <h3>Technical Remediation Guidance</h3>
                            <p>
                                Equip your frontend development team with CSS selectors, affected HTML snippets, WCAG criteria references, and estimated fix times.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>04</div>
                            <h3>Priority Issue Roadmaps</h3>
                            <p>
                                Organize accessibility bugs into Critical, Serious, Moderate, and Minor severities so clients can easily approve phased remediation proposals.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>05</div>
                            <h3>Downloadable & Shareable Reports</h3>
                            <p>
                                Export polished PDF reports or generate private dashboard links to share directly during client pitch meetings and project reviews.
                            </p>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.stepNum}>06</div>
                            <h3>Recurring Client Monitoring</h3>
                            <p>
                                Maintain ongoing retainer value by running scheduled audits, tracking score improvements, and proving remediation progress over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Realistic Scope & Disclaimer */}
            <section className={styles.disclaimerSection}>
                <div className={styles.container}>
                    <div className={styles.disclaimerBox}>
                        <span className={styles.warningTag}>Compliance Transparency</span>
                        <h2>Setting Realistic Expectations With Agency Clients</h2>
                        <p>
                            White-label automated accessibility reports are
                            useful for discovering repeatable code errors,
                            monitoring structural drift, and presenting initial
                            audit findings. Automated tools can evaluate only a
                            portion of accessibility requirements and cannot
                            judge every real user experience.
                        </p>
                        <p>
                            Automated reports <strong>do not provide legal certification</strong> or guarantee complete WCAG 2.2 compliance. Responsible web agencies use automated reports as the foundation of a broader audit process that includes human keyboard and screen-reader verification.
                        </p>
                    </div>
                </div>
            </section>

            {/* Internal Articles / Agency Resources */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <p className={styles.eyebrow}>Agency Strategy Guides</p>
                        <h2>Refine Your Agency's Audit & Testing Pipeline</h2>
                        <p className={styles.sectionLead}>
                            Explore our tactical field guides on managing client audits and building defensible accessibility retainers.
                        </p>
                    </div>

                    <div className={styles.grid2}>
                        <Link href="/blogs/website-accessibility-audit-checklist-for-agencies" className={styles.resourceCard}>
                            <span className={styles.meta}>Field Checklist</span>
                            <h3>Website Accessibility Audit Checklist for Web Agencies</h3>
                            <p>
                                A 10-part checklist for auditing client sites, prioritizing findings, and delivering clear remediation proposals.
                            </p>
                            <span className={styles.linkText}>Read Audit Checklist →</span>
                        </Link>

                        <Link href="/blogs/automated-vs-manual-accessibility-testing" className={styles.resourceCard}>
                            <span className={styles.meta}>Testing Strategy</span>
                            <h3>Automated vs Manual Accessibility Testing Guide</h3>
                            <p>
                                Learn how to combine high-speed automated
                                scanners like CompliantScan with targeted manual
                                testing for broader WCAG coverage.
                            </p>
                            <span className={styles.linkText}>Read Testing Strategy →</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Ready to Offer Professional Accessibility Audits?</h2>
                        <p>
                            Scan a client website now to generate your first audit report, or explore our scalable agency subscription tiers.
                        </p>
                        <div className={styles.ctaActions}>
                            <Link href="/#scanner" className={styles.btnPrimary}>
                                Scan Client Website
                            </Link>
                            <Link href="/pricing" className={styles.btnSecondary}>
                                View Agency Pricing
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
