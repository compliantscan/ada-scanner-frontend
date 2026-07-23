'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getApiUrl } from '@/lib/apiUrl';
import styles from './AgencyReport.module.css';

const SEVERITY_ORDER = { critical: 4, serious: 3, moderate: 2, minor: 1 };

const FINDING_GUIDANCE = {
  'color-contrast': {
    title: 'Some text may be difficult to read',
    area: 'Color and visual clarity',
    summary: 'Some text and interface elements do not meet the selected contrast threshold.',
    relatedCheck: 'Minimum color contrast',
    why: 'Low contrast can make text harder to read for people with low vision or in bright light.',
    check: 'Verify the text and background color pair meets the selected contrast target.',
    value: 'A shared color-token fix can improve many repeated elements.',
  },
  label: {
    title: 'Form fields need clearer labels',
    area: 'Forms and lead capture',
    summary: 'Some form fields are missing clear, programmatically associated labels.',
    relatedCheck: 'Accessible form label',
    why: 'Visitors using screen readers may not know what information a field is asking them to enter.',
    check: 'Connect every visible label to its input and give icon-only fields an accessible name.',
    value: 'Clearer forms reduce friction in contact, quote, and signup flows.',
  },
  'button-name': {
    title: 'Some buttons need a meaningful name',
    area: 'Navigation and interaction',
    summary: 'Some controls do not expose a clear programmatic name.',
    relatedCheck: 'Accessible button name',
    why: 'An unlabeled button can be announced only as “button,” leaving its purpose unclear.',
    check: 'Add visible text or an accessible name that describes the action.',
    value: 'Reusable button fixes improve navigation across the whole site.',
  },
  'link-name': {
    title: 'Some links do not explain where they go',
    area: 'Navigation and calls to action',
    summary: 'Some links are missing text that clearly explains their destination.',
    relatedCheck: 'Accessible link name',
    why: 'Unclear link names make destinations hard to understand with assistive technology.',
    check: 'Add descriptive text or an accessible name to icon-only links.',
    value: 'Clear link names reduce ambiguity and make navigation easier for all visitors.',
  },
  'image-alt': {
    title: 'Important images need text alternatives',
    area: 'Images and content',
    summary: 'Some meaningful images are missing a useful text alternative.',
    relatedCheck: 'Image text alternative',
    why: 'Without alternative text, meaningful image content may be missed by screen-reader users.',
    check: 'Add concise alt text for informative images and empty alt text for decorative images.',
    value: 'Good image descriptions make portfolio and case-study content more useful.',
  },
  'heading-order': {
    title: 'The page heading structure needs refinement',
    area: 'Content structure',
    summary: 'Some heading levels do not follow a clear content hierarchy.',
    relatedCheck: 'Logical heading order',
    why: 'A logical heading order helps visitors understand and navigate the page.',
    check: 'Keep heading levels in a clear hierarchy without skipping levels.',
    value: 'A stronger outline improves accessibility and editorial consistency.',
  },
  region: {
    title: 'Some content sits outside clear page regions',
    area: 'Page structure',
    summary: 'Some page content is not contained within a meaningful landmark.',
    relatedCheck: 'Content landmark regions',
    why: 'Landmarks help assistive-technology users move between major page areas.',
    check: 'Wrap major sections in meaningful header, nav, main, aside, or footer regions.',
    value: 'One layout fix can improve every page using the same template.',
  },
  'landmark-one-main': {
    title: 'The page needs one clear main content region',
    area: 'Page structure',
    summary: 'The page does not expose one clear main content region.',
    relatedCheck: 'Single main landmark',
    why: 'A single main landmark lets visitors skip repeated navigation and reach the primary content.',
    check: 'Use one main element around the page’s unique primary content.',
    value: 'This is usually a quick template-level improvement with site-wide value.',
  },
};

function domainFrom(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return String(url || 'website').replace(/^https?:\/\//, '').split('/')[0];
  }
}

function agencyFrom(domain) {
  if (domain.toLowerCase() === 'dd.nyc') return 'DD.NYC';
  const label = domain.split('.')[0].replace(/[-_]+/g, ' ').trim();
  return label
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Your Agency';
}

function friendlyFinding(violation) {
  const ruleId = violation.ruleId || violation.id || '';
  const guide = FINDING_GUIDANCE[ruleId] || {
    title: violation.title || violation.description || 'An accessibility improvement was identified',
    area: 'Website experience',
    summary: violation.description || violation.help || 'The automated scan identified a pattern that should be reviewed.',
    relatedCheck: violation.ruleId || violation.id || 'Automated accessibility check',
    why: violation.description || 'This issue may create unnecessary friction for some visitors using assistive technology.',
    check: violation.fix?.explanation || violation.help || 'Review the affected component and test the updated experience with keyboard and screen-reader navigation.',
    value: 'Resolving the shared component can improve the experience wherever it appears.',
  };
  return { ...violation, ruleId, ...guide };
}

function findingLocation(finding) {
  const target = String(finding.target || '').toLowerCase();
  if (/header|nav|menu/.test(target)) return 'Homepage header navigation';
  if (/footer/.test(target)) return 'Homepage footer';
  if (/form|input|select|textarea/.test(target)) return 'Homepage form';
  if (/button|cta|hero/.test(target)) return 'Homepage primary content';
  if (/main|section|article/.test(target)) return 'Homepage content area';
  return 'Homepage';
}

function Brand() {
  return (
    <a className={styles.brand} href="https://www.compliantscan.com/" aria-label="Visit CompliantScan">
      <img className={styles.brandMark} src="/compliantscan-mark.png" alt="" />
      <span>CompliantScan</span>
    </a>
  );
}

function ReportDomain() {
  return (
    <a className={styles.reportDomain} href="https://www.compliantscan.com/">
      compliantscan.com
    </a>
  );
}

function PageFrame({ number, title, children, className = '' }) {
  return (
    <section className={`${styles.reportPage} ${className}`}>
      {number > 1 && (
        <header className={styles.pageHeader}>
          <Brand />
          <span className={styles.pageTitle}>{title}</span>
          <ReportDomain />
        </header>
      )}
      {children}
      {number > 1 && (
        <footer className={styles.pageFooter}>
          <span>CompliantScan · Accessibility Snapshot</span>
          <span>{number} / 5</span>
        </footer>
      )}
    </section>
  );
}

export default function AgencyReport({ scanData }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  const report = useMemo(() => {
    const summary = scanData?.executiveSummary || {};
    const violations = (scanData?.violations || [])
      .slice()
      .sort((a, b) => (
        (SEVERITY_ORDER[b.severity] || 0) - (SEVERITY_ORDER[a.severity] || 0)
        || (b.affectedElements || 0) - (a.affectedElements || 0)
      ));
    const domain = domainFrom(scanData?.url);
    const agency = scanData?.agencyName || agencyFrom(domain);
    const severityCounts = summary.severityCounts || { critical: 0, serious: 0, moderate: 0, minor: 0 };
    const totalIssues = ['critical', 'serious', 'moderate', 'minor']
      .reduce((sum, severity) => sum + Number(severityCounts[severity] || 0), 0);
    const affectedElements = violations.reduce((sum, item) => sum + Number(item.affectedElements || 1), 0);
    const repeatedComponents = violations.filter((item) => Number(item.affectedElements || 0) > 1).length;
    const pagesScanned = scanData?.pages?.length || summary.pagesScanned || 1;
    const dateValue = scanData?.timestamp || scanData?.createdAt || scanData?.created_at || Date.now();
    return {
      summary,
      violations,
      topFindings: violations.slice(0, 3).map(friendlyFinding),
      domain,
      agency,
      severityCounts,
      totalIssues,
      affectedElements,
      repeatedComponents,
      pagesScanned,
      scanScope: pagesScanned === 1 ? 'Homepage only' : `${pagesScanned} pages`,
      scanDate: new Date(dateValue).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }, [scanData]);

  async function downloadPdf() {
    const scanId = scanData?.scanId || scanData?.id;
    if (!scanId || !scanData?.scanAccessKey) {
      setDownloadError('This scan is missing its download key. Please run a new scan and try again.');
      return;
    }
    setDownloading(true);
    setDownloadError('');
    try {
      const response = await fetch(`${getApiUrl()}/lead-report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId, scanAccessKey: scanData.scanAccessKey }),
      });
      if (!response.ok) throw new Error('The PDF could not be prepared.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.agency.replace(/[^a-z0-9]+/gi, '-')}-Accessibility-Snapshot.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setDownloadError(error.message || 'The PDF could not be downloaded.');
    } finally {
      setDownloading(false);
    }
  }

  const topFindings = report.topFindings.length
    ? report.topFindings
    : [{
      title: 'No automated violations were detected',
      area: 'Automated scan result',
      severity: 'minor',
      affectedElements: 0,
      why: 'The selected automated checks did not identify a failure on this page.',
      check: 'Complete keyboard, zoom, screen-reader, and content review before treating the site as fully accessible.',
      value: 'This provides a strong baseline for ongoing quality checks.',
    }];

  return (
    <main className={styles.workspace}>
      <div className={styles.toolbar}>
        <div>
          <Link href="/results" className={styles.backLink}>← Back to scan results</Link>
          <span className={styles.savedLabel}>Live report preview · 5 pages</span>
        </div>
        <button type="button" className={styles.downloadButton} onClick={downloadPdf} disabled={downloading}>
          {downloading ? 'Preparing PDF…' : 'Download PDF'}
        </button>
      </div>
      {downloadError && <p className={styles.downloadError} role="alert">{downloadError}</p>}

      <div className={styles.pageStack}>
        <PageFrame number={1} className={styles.coverPage}>
          <div className={styles.coverTop}>
            <Brand />
            <ReportDomain />
          </div>
          <div className={styles.coverRule} />
          <div className={styles.coverBody}>
            <div className={styles.coverCopy}>
              <h1>Accessibility<br />Snapshot</h1>
              <p className={styles.coverFor}>for <strong>{report.agency}</strong></p>
              <span className={styles.goldRule} />
              <dl className={styles.coverMeta}>
                <div><dt><span>◎</span> Website scanned</dt><dd>{report.domain}</dd></div>
                <div><dt><span>□</span> Scan scope</dt><dd>{report.scanScope}</dd></div>
                <div><dt><span>◇</span> Scan date</dt><dd>{report.scanDate}</dd></div>
              </dl>
              <p className={styles.coverNote}>Automated accessibility scan based on selected WCAG checks.</p>
            </div>
            <div className={styles.coverArtwork} aria-hidden="true">
              <div className={styles.artGlow} />
              <div className={styles.browserCard}>
                <div className={styles.browserDots}><i /><i /><i /></div>
                <div className={styles.browserLines}><b /><span /><span /><span /></div>
              </div>
              <div className={styles.largeShield}>✓</div>
            </div>
          </div>
          <div className={styles.coverDisclaimer}>
            <span>i</span>
            <p>This report covers issues detectable through automated testing.<br />It is not a complete manual accessibility audit or certification of legal compliance.</p>
          </div>
        </PageFrame>

        <PageFrame number={2} title="Executive summary">
          <div className={styles.pageIntro}>
            <span className={styles.eyebrow}>What the scan found</span>
            <h2>A clear starting point for<br />{report.agency}</h2>
            <p>This automated review covered {report.scanScope.toLowerCase()}. The opportunity is to fix shared components first, then keep those improvements in place as the site changes.</p>
          </div>
          <div className={styles.automatedSummary}>
            <span>Automated scan summary</span>
            <p><strong>{report.totalIssues} issue types</strong> were detected across <strong>{report.affectedElements} elements</strong>. Most findings came from repeated navigation and layout patterns, meaning a small number of component-level fixes may resolve many instances.</p>
          </div>
          <div className={styles.summaryGrid}>
            <div className={styles.metricPanel}><strong>{report.totalIssues}</strong><span>issue types</span></div>
            <div className={styles.metricPanel}><strong>{report.affectedElements}</strong><span>affected elements</span></div>
            <div className={styles.metricPanel}><strong>{report.repeatedComponents}</strong><span>repeated patterns</span></div>
            <div className={styles.metricPanel}><strong>{report.pagesScanned}</strong><span>page{report.pagesScanned === 1 ? '' : 's'} scanned</span></div>
          </div>
          <div className={styles.severityTable}>
            {['critical', 'serious', 'moderate', 'minor'].map((severity) => (
              <div key={severity}>
                <span className={`${styles.severityDot} ${styles[severity]}`} />
                <span>{severity}</span>
                <strong>{report.severityCounts[severity] || 0}</strong>
              </div>
            ))}
          </div>
          <div className={styles.opportunity}>
            <span>Where to begin</span>
            <h3>Prioritize shared templates and components.</h3>
            <p>When the same navigation, button, form, or color style appears in multiple places, one thoughtful fix can improve many experiences at once. Start with serious and high-frequency findings, then verify the result with a short manual review.</p>
          </div>
        </PageFrame>

        <PageFrame number={3} title="Priority findings">
          <div className={styles.pageIntroCompact}>
            <span className={styles.eyebrow}>Top three findings</span>
            <h2>The most useful places to focus</h2>
            <p>These priorities come directly from this scan, ordered by impact and how often the pattern appears.</p>
          </div>
          <div className={styles.findingList}>
            {topFindings.slice(0, 3).map((finding, index) => (
              <article className={styles.findingCard} key={`${finding.ruleId || finding.title}-${index}`}>
                <div className={styles.findingNumberRail}>
                  <strong>0{index + 1}</strong>
                  <i />
                </div>
                <div className={styles.findingCardMain}>
                  <header className={styles.findingHeading}>
                    <div>
                      <span>{finding.area}</span>
                      <h3>{finding.title}</h3>
                      <p>{finding.summary}</p>
                    </div>
                    <em className={styles[finding.severity] || styles.minor}>
                      <b aria-hidden="true">!</b>{finding.severity || 'review'}
                    </em>
                  </header>
                  <div className={styles.findingBody}>
                    <aside className={styles.findingEvidencePanel}>
                      <span className={styles.evidenceLabel}>Example from scan</span>
                      {finding.screenshotDataUrl ? (
                        <figure className={styles.findingEvidence}>
                          <img src={finding.screenshotDataUrl} alt={`Affected area for ${finding.title}`} />
                        </figure>
                      ) : (
                        <div className={styles.findingPlaceholder}><span>Detected on</span><strong>{report.domain}</strong></div>
                      )}
                      <div className={styles.evidenceCallout}>
                        <span aria-hidden="true">!</span>
                        <p>{finding.why}</p>
                      </div>
                    </aside>
                    <dl className={styles.findingFacts}>
                      {[
                        ['⌖', 'Found on', findingLocation(finding)],
                        ['◎', 'Affected', `${finding.affectedElements || 0} element${finding.affectedElements === 1 ? '' : 's'}`],
                        ['✓', 'Related check', finding.relatedCheck],
                        ['?', 'Why it matters', finding.why],
                        ['</>', 'Developer check', finding.check],
                        ['▣', 'Agency value', finding.value],
                      ].map(([icon, label, value]) => (
                        <div key={label}>
                          <span className={styles.factIcon} aria-hidden="true">{icon}</span>
                          <div><dt>{label}</dt><dd>{value}</dd></div>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </PageFrame>

        <PageFrame number={4} title="Monitoring after launch">
          <div className={styles.pageIntro}>
            <span className={styles.eyebrow}>Keep improvements in place</span>
            <h2>Accessibility does not<br />stop at launch</h2>
            <p>New content, plugin updates, campaign pages, and design changes can introduce new accessibility barriers after the original website has been reviewed.</p>
          </div>
          <div className={styles.workflow}>
            {[
              ['01', 'Baseline scan', 'Establish the current automated accessibility baseline.'],
              ['02', 'Issues fixed', 'Prioritize shared components and verify the updates.'],
              ['03', 'Website changes', 'New content and releases alter the experience.'],
              ['04', 'Rescan', 'Check the website again after those changes.'],
              ['05', 'Report', 'Show new issues and what has been resolved.'],
            ].map(([number, title, copy]) => (
              <div key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></div>
            ))}
          </div>
          <div className={styles.monitoringPanel}>
            <div>
              <span className={styles.eyebrow}>A practical agency rhythm</span>
              <h3>Build checks into handoff and maintenance.</h3>
            </div>
            <ul>
              <li>Scan before client review and again before launch.</li>
              <li>Track recurring component issues across multiple sites.</li>
              <li>Share a concise, client-friendly snapshot after improvements.</li>
              <li>Use manual checks for keyboard flow, content, and real user experience.</li>
            </ul>
          </div>
        </PageFrame>

        <PageFrame number={5} title="Founding agency pilot">
          <div className={styles.pilotHero}>
            <span className={styles.eyebrow}>Founding agency pilot</span>
            <h2>Add accessibility monitoring<br />to your client care plans.</h2>
            <p>A focused 30-day pilot for one agency that wants to add repeatable accessibility scanning, reporting, and post-launch monitoring to its client services.</p>
          </div>
          <div className={styles.offerCard}>
            <div className={styles.offerPrice}>
              <span>30-day pilot</span>
              <strong><sup>$</sup>99</strong>
              <p>one-time pilot price</p>
            </div>
            <div className={styles.offerDetails}>
              <h3>Included in the pilot</h3>
              <ul>
                <li>Up to five client websites</li>
                <li>One baseline automated scan per website</li>
                <li>Prioritized findings in plain language</li>
                <li>Developer implementation guidance</li>
                <li>Client-ready PDF snapshots</li>
                <li>One follow-up rescan per website</li>
                <li>New and resolved issue summary</li>
                <li>Personal onboarding and support</li>
              </ul>
            </div>
          </div>
          <div className={styles.afterPilot}>
            <div><span>After the pilot</span><strong>$199/month</strong></div>
            <p>Continue only if the workflow is useful for your agency. No long-term commitment is required for the pilot.</p>
          </div>
          <div className={styles.pilotCta}>
            <div><span>Start with three websites</span><p>Reply to this email with <strong>“Pilot”</strong> and three website URLs. I’ll prepare the first scans and reports within 48 hours.</p></div>
            <a href="mailto:info@compliantscan.com?subject=Pilot">Pilot →</a>
          </div>
          <div className={styles.pilotFooter}>
            <div>
              <span>Prepared for</span>
              <strong>{report.agency}</strong>
              <small>{report.domain}</small>
            </div>
            <a href="mailto:info@compliantscan.com?subject=Pilot">info@compliantscan.com</a>
          </div>
        </PageFrame>
      </div>
    </main>
  );
}
