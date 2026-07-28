import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './article.module.css';

const articleUrl =
  'https://www.compliantscan.com/blogs/website-accessibility-audit-checklist-for-agencies';
const featuredImageUrl =
  'https://www.compliantscan.com/website-accessibility-audit-checklist.png';
const featuredImageAlt =
  'Website accessibility audit checklist showing keyboard, contrast, screen reader, and content checks';

export const metadata = {
  title: 'Website Accessibility Audit Checklist for Web Agencies',
  description:
    'A practical website accessibility audit checklist for agencies covering automated tests, manual WCAG checks, client reporting, and rescanning.',
  alternates: {
    canonical: articleUrl,
  },
  openGraph: {
    title: 'Website Accessibility Audit Checklist for Web Agencies',
    description:
      'A practical WCAG audit process for testing client websites, prioritizing fixes, and presenting results.',
    type: 'article',
    url: articleUrl,
    images: [
      {
        url: featuredImageUrl,
        width: 1200,
        height: 675,
        alt: featuredImageAlt,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Accessibility Audit Checklist for Web Agencies',
    description:
      'A practical WCAG audit process for testing client websites, prioritizing fixes, and presenting results.',
    images: [featuredImageUrl],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Website Accessibility Audit Checklist for Web Agencies',
  description:
    'A practical website accessibility audit checklist for agencies covering automated tests, manual WCAG checks, client reporting, and rescanning.',
  datePublished: '2026-07-28T10:19:00+05:30',
  dateModified: '2026-07-28T11:57:05+05:30',
  url: articleUrl,
  author: {
    '@type': 'Organization',
    name: 'CompliantScan',
    url: 'https://www.compliantscan.com/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CompliantScan',
    url: 'https://www.compliantscan.com/',
  },
  image: featuredImageUrl,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': articleUrl,
  },
};

export default function AccessibilityAuditChecklistArticle() {
  return (
    <main>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className={styles.article}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <p className={styles.eyebrow}>Agency accessibility field guide</p>
            <h1>Website Accessibility Audit Checklist for Web Agencies</h1>
            <p className={styles.deck}>
              A repeatable process for finding barriers, deciding what needs
              human review, and turning WCAG findings into a client-ready plan.
            </p>
            <div className={styles.byline}>
              <span>By CompliantScan</span>
              <span>Updated July 28, 2026</span>
              <span>12 minute read</span>
            </div>
            <figure className={styles.featuredImage}>
              <Image
                src="/website-accessibility-audit-checklist.png"
                alt={featuredImageAlt}
                width={1200}
                height={675}
                priority
                sizes="(max-width: 1040px) 100vw, 980px"
              />
            </figure>
          </div>
        </header>

        <div className={styles.articleGrid}>
          <aside className={styles.toc}>
            <p>In this guide</p>
            <ol>
              <li><a href="#audit-includes">What an audit includes</a></li>
              <li><a href="#automated-manual">Automated vs. manual</a></li>
              <li><a href="#priority-checks">Priority WCAG checks</a></li>
              <li><a href="#images">Images and alt text</a></li>
              <li><a href="#forms">Forms and labels</a></li>
              <li><a href="#contrast">Color contrast</a></li>
              <li><a href="#keyboard">Keyboard navigation</a></li>
              <li><a href="#structure">Headings and landmarks</a></li>
              <li><a href="#client-findings">Presenting findings</a></li>
              <li><a href="#rescanning">When to rescan</a></li>
            </ol>
          </aside>

          <div className={styles.content}>
            <p className={styles.lead}>
              A website accessibility audit checklist gives an agency a
              consistent way to review client work before launch, during a
              redesign, or as part of an ongoing care plan. The strongest
              audits combine fast automated detection with focused human
              testing. They also translate technical findings into decisions a
              client can understand: what is wrong, who it affects, how urgent
              it is, and what the team should do next.
            </p>

            <div className={styles.keyTakeaway}>
              <strong>The practical goal</strong>
              <p>
                Do not produce a list of errors with no context. Produce a
                prioritized improvement plan that design, development, content,
                and client stakeholders can act on.
              </p>
            </div>

            <section id="audit-includes">
              <h2>1. What an accessibility audit includes</h2>
              <p>
                A useful accessibility audit examines more than the homepage.
                Start by defining a representative sample: the homepage, a
                content page, a landing page, a form, a search or listing page,
                and any important conversion flow. For an ecommerce site, add
                product, cart, and checkout pages. For a SaaS product, include
                authentication and one core in-app workflow.
              </p>
              <p>
                Record the tested URLs, viewport assumptions, browser and
                assistive-technology combinations, WCAG version and target
                level, plus the date of testing. Most agency projects target
                WCAG 2.2 Level AA, but the contract or client policy should
                determine the scope. Use the official{' '}
                <a
                  href="https://www.w3.org/WAI/WCAG22/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  W3C WCAG 2.2 Quick Reference
                </a>{' '}
                to connect each finding to the relevant success criterion.
              </p>
              <ul>
                <li>Define representative pages and critical user journeys.</li>
                <li>Run automated checks on every page in scope.</li>
                <li>Perform keyboard, zoom, focus, and screen-reader checks.</li>
                <li>Document evidence, impact, severity, and remediation.</li>
                <li>Retest fixes rather than assuming a code change worked.</li>
              </ul>
            </section>

            <section id="automated-manual">
              <h2>2. Automated testing versus manual testing</h2>
              <p>
                Automated tools are excellent at repeatable checks: missing
                accessible names, certain contrast failures, invalid ARIA
                attributes, duplicate IDs, empty links, and structural issues
                that can be detected in the page code. They are fast enough to
                run during development and can reveal patterns across many
                templates.
              </p>
              <p>
                Automation cannot decide whether alternative text communicates
                the purpose of an image, whether focus order makes sense,
                whether instructions are understandable, or whether a modal is
                genuinely usable with a screen reader. It also cannot confirm
                every requirement for WCAG conformance. Treat an automated scan
                as evidence and triage—not a certification.
              </p>

              <div className={styles.comparison}>
                <div>
                  <span className={styles.tag}>Automated</span>
                  <h3>Best for breadth</h3>
                  <p>
                    Detect recurring code-level problems quickly across page
                    templates and after releases.
                  </p>
                </div>
                <div>
                  <span className={styles.tag}>Manual</span>
                  <h3>Best for usability</h3>
                  <p>
                    Confirm meaningful text, logical behavior, understandable
                    flows, and real keyboard or screen-reader use.
                  </p>
                </div>
              </div>
              <p>
                Agencies can start by choosing to{' '}
                <Link href="/#scanner">
                  scan a website for accessibility issues
                </Link>{' '}
                to identify likely hotspots, then spend manual testing time on
                the pages and components with the greatest user or business
                impact. The{' '}
                <Link href="/wcag-compliance-checker">
                  WCAG compliance checker guide
                </Link>{' '}
                explains exactly which automated WCAG 2.2 checks are included.
                For a deeper analysis of combining software detection with
                human review, read our guide on{' '}
                <Link href="/blogs/automated-vs-manual-accessibility-testing">
                  automated vs manual accessibility testing
                </Link>.
              </p>
            </section>

            <section id="priority-checks">
              <h2>3. WCAG checks agencies should prioritize</h2>
              <p>
                Prioritize by user impact and reach, not by whichever rule ID
                appears first. A missing label on every checkout field deserves
                attention before a minor issue on an archived page. Start with
                blockers in navigation and conversion flows, then address
                widespread template-level failures.
              </p>
              <div className={styles.priorityTable} role="region" aria-label="Accessibility issue priority examples">
                <div className={styles.tableHeader}>
                  <span>Priority</span><span>Examples</span><span>Agency action</span>
                </div>
                <div>
                  <strong>Critical</strong>
                  <span>Keyboard trap, unlabeled checkout controls</span>
                  <span>Fix before release</span>
                </div>
                <div>
                  <strong>Serious</strong>
                  <span>Low text contrast, empty links, missing names</span>
                  <span>Schedule immediately</span>
                </div>
                <div>
                  <strong>Moderate</strong>
                  <span>Heading gaps, landmark structure, repeated IDs</span>
                  <span>Include in current sprint</span>
                </div>
              </div>
              <p>
                Also test zoom and reflow at 200% and 400%, visible focus,
                target size, error identification, page titles, language, link
                purpose, and status messages. Your WCAG audit checklist should
                map each issue to a component owner so fixes can be applied
                systematically rather than page by page.
              </p>
            </section>

            <section id="images">
              <h2>4. Images and alternative text</h2>
              <p>
                Every informative image needs a text alternative that serves
                the same purpose in context. A product photograph might need
                the product name and important visual distinction. A chart
                needs its conclusion and access to the underlying data. A linked
                logo should identify the destination or action, not merely say
                “image.”
              </p>
              <p>
                Decorative images should normally use an empty alt attribute so
                assistive technology can skip them. Do not automatically fill
                every alt attribute with the file name or nearby heading. During
                manual review, ask: if the image disappeared, what information
                or function would the user lose?
              </p>
              <div className={styles.codeExample}>
                <div>
                  <span className={styles.badLabel}>Weak</span>
                  <code>{'<img src="chart.png" alt="chart">'}</code>
                </div>
                <div>
                  <span className={styles.goodLabel}>Useful</span>
                  <code>{'<img src="chart.png" alt="Support requests fell 32% after the redesign">'}</code>
                </div>
              </div>
            </section>

            <section id="forms">
              <h2>5. Forms and labels</h2>
              <p>
                Form controls need persistent, programmatically associated
                labels. Placeholder text is not a substitute: it disappears
                after typing, often has weak contrast, and may not provide a
                reliable accessible name. Match each visible label to its input
                with <code>for</code> and <code>id</code>, or use another valid
                accessible naming method.
              </p>
              <p>
                Group related choices with <code>fieldset</code> and{' '}
                <code>legend</code>. Explain required formats before submission.
                When validation fails, identify the field, describe the problem,
                and move focus or provide an error summary that keyboard and
                screen-reader users can find. Test the entire form without a
                mouse, including date pickers, custom selects, file uploads,
                and success messages.
              </p>

              <div className={styles.scanExample}>
                <div className={styles.scanTop}>
                  <span>Example from an automated scan</span>
                  <span className={styles.seriousBadge}>Serious</span>
                </div>
                <h3>Form fields need accessible labels</h3>
                <p>
                  Affected elements: 6 · Pages: 1 · Check: Form control has an
                  accessible name
                </p>
                <div className={styles.scanAction}>
                  <strong>Recommended fix</strong>
                  <span>
                    Connect every visible label to its input and give
                    icon-only controls a meaningful accessible name.
                  </span>
                </div>
              </div>
            </section>

            <section id="contrast">
              <h2>6. Color contrast</h2>
              <p>
                Check text against the actual background in every state,
                including hover, focus, disabled, validation, overlays, and
                text placed on images or gradients. WCAG 2.2 Level AA generally
                requires a contrast ratio of at least 4.5:1 for normal text and
                3:1 for large text. User-interface components and meaningful
                graphical objects also need sufficient contrast against
                adjacent colors.
              </p>
              <p>
                Automated contrast results can be noisy when opacity, layered
                backgrounds, or dynamic states are involved. Confirm flagged
                combinations with a contrast analyzer and review components,
                not isolated hex values. A token-level correction to muted text
                may resolve dozens of instances across the website.
              </p>
            </section>

            <section id="keyboard">
              <h2>7. Keyboard navigation</h2>
              <p>
                Put the mouse aside. Starting at the browser chrome, use Tab,
                Shift+Tab, Enter, Space, Escape, and arrow keys where expected.
                Every interactive element should be reachable and operable.
                Focus order should follow the visual and logical reading order,
                and the focused element should always be visible.
              </p>
              <p>
                Pay close attention to menus, modals, carousels, accordions,
                cookie banners, custom dropdowns, and embedded widgets. A modal
                should move focus inside when opened, keep focus within while
                active, close with Escape when appropriate, and return focus to
                its trigger. Record keyboard traps and unreachable primary
                actions as high-priority findings.
              </p>
            </section>

            <section id="structure">
              <h2>8. Headings and landmarks</h2>
              <p>
                Headings should describe the page outline, not be selected
                merely for visual size. Use one clear page-level heading, then
                nest sections in a logical hierarchy. Skipping a level is not
                automatically a failure in every circumstance, but a confusing
                outline makes navigation harder for people who browse by
                heading.
              </p>
              <p>
                Check that major regions use appropriate landmarks such as
                header, navigation, main, complementary, and footer. Keep the
                main landmark at the top level and provide labels when multiple
                navigation or complementary regions need to be distinguished.
                A descriptive page title, logical headings, and landmarks give
                users several efficient ways to understand and move through the
                page.
              </p>
            </section>

            <section id="client-findings">
              <h2>9. How to present accessibility findings to clients</h2>
              <p>
                Clients rarely need an unfiltered developer export. Lead with a
                short executive summary: pages reviewed, issues found, the
                highest-impact risks, and an honest statement about the limits
                of automated testing. Then group findings by priority and
                component so the client can budget and sequence the work.
              </p>
              <p>
                Every finding should include a plain-language title, affected
                user impact, evidence or screenshot, affected pages or
                components, WCAG reference, and a recommended fix. Separate
                “must fix before launch” from improvements that can be scheduled
                later. Avoid promising legal compliance based on automation
                alone.
              </p>

              <div className={styles.reportExample}>
                <div>
                  <span>Example CompliantScan summary</span>
                  <strong>7 issues found</strong>
                  <small>1 page scanned · WCAG 2.2 AA checks</small>
                </div>
                <div className={styles.severityGrid}>
                  <span><b>1</b> Critical</span>
                  <span><b>2</b> Serious</span>
                  <span><b>3</b> Moderate</span>
                  <span><b>1</b> Minor</span>
                </div>
              </div>
              <p>
                Use our{' '}
                <Link href="/blogs/website-accessibility-report-template">
                  website accessibility report template for web agencies
                </Link>{' '}
                to turn findings into a clear client deliverable. If reporting
                is part of your service,{' '}
                <Link href="/pricing">
                  compare CompliantScan accessibility scanner pricing
                </Link>{' '}
                for ongoing monitoring and client-ready reports. The deliverable
                should help the client approve work—not overwhelm them with
                scanner terminology.
              </p>
            </section>

            <section id="rescanning">
              <h2>10. How often websites should be rescanned</h2>
              <p>
                Rescan after any meaningful component, template, content, or
                dependency change. At minimum, test before launch, immediately
                after remediation, and after major releases. Sites with frequent
                publishing, ecommerce changes, third-party widgets, or multiple
                development teams benefit from weekly or monthly automated
                monitoring.
              </p>
              <p>
                A quarterly manual review is a sensible starting point for many
                agency maintenance plans, but risk and release frequency should
                determine the cadence. Maintain a baseline so new findings can
                be separated from accepted backlog. When a recurring issue
                returns, fix the design-system component or content workflow
                that produced it rather than repeatedly patching individual
                pages.
              </p>
            </section>

            <section className={styles.finalChecklist}>
              <p className={styles.eyebrow}>Before you send the report</p>
              <h2>Agency website accessibility testing checklist</h2>
              <ul>
                <li>Scope includes critical pages and complete user journeys.</li>
                <li>Automated findings have been reviewed for context.</li>
                <li>Keyboard, focus, zoom, and responsive reflow were tested.</li>
                <li>Images, forms, contrast, headings, and landmarks were reviewed.</li>
                <li>Findings explain user impact and provide actionable fixes.</li>
                <li>Critical fixes were retested before being marked complete.</li>
                <li>The report states what automated testing cannot confirm.</li>
                <li>A rescan date or monitoring cadence has been agreed.</li>
              </ul>
            </section>

            <section className={styles.cta}>
              <p className={styles.eyebrow}>Turn the checklist into action</p>
              <h2>Need a faster way to audit client websites?</h2>
              <p>
                Scan a website with CompliantScan to find automated WCAG issues,
                prioritize fixes, and generate a client-ready report.
              </p>
              <div className={styles.ctaActions}>
                <Link className={styles.primaryButton} href="/#scanner">
                  Scan a website for accessibility issues
                </Link>
                <Link className={styles.secondaryButton} href="/pricing">
                  Compare accessibility scanner pricing
                </Link>
              </div>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
