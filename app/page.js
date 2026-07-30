import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import ExecutiveReportPreview from '../components/ExecutiveReportPreview/ExecutiveReportPreview';
import StatsBar from '../components/StatsBar/StatsBar';
import styles from './page.module.css';
import BuiltForAgencies from '@/components/BuiltForAgencies/BuiltForAgencies';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Stakes from '@/components/Stakes/Stakes';
import FAQ from '@/components/FAQ/FAQ';
import Resources from '@/components/Resources/Resources';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';
import LandingMotion from '@/components/LandingMotion/LandingMotion';

export const metadata = {
  title: 'CompliantScan | Website Accessibility Scanner for Agencies',
  description:
    'Scan websites for WCAG 2.2 issues, get developer-ready fixes, and generate client-ready accessibility reports with CompliantScan.',
  alternates: {
    canonical: 'https://www.compliantscan.com/',
  },
  openGraph: {
    title: 'CompliantScan | Website Accessibility Scanner for Agencies',
    description:
      'Scan websites for WCAG 2.2 issues, get developer-ready fixes, and generate client-ready accessibility reports with CompliantScan.',
    url: 'https://www.compliantscan.com/',
    siteName: 'CompliantScan',
    type: 'website',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CompliantScan',
  alternateName: 'Compliant Scan',
  url: 'https://www.compliantscan.com/',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CompliantScan',
  url: 'https://www.compliantscan.com/',
  logo: 'https://www.compliantscan.com/logo.png',
  description:
    'CompliantScan helps agencies find WCAG 2.2 issues, communicate impact clearly, and deliver accessibility improvements with confidence.',
  email: 'info@compliantscan.com',
  sameAs: [
    'https://x.com/Compliantscans',
    'https://www.linkedin.com/company/compliantscan/',
  ],
};

export default function Home() {
  return (
    <main>
      <LandingMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <Navbar />

      <section className={styles.heroSection} data-reveal="hero">
        <div className={styles.heroGrid}>
          <Hero />
          <ExecutiveReportPreview />
        </div>
      </section>

      <StatsBar />
      <Stakes />

      <BuiltForAgencies />
      <HowItWorks />
      <Resources />
      <FAQ />
      <Contact />
      <Footer />

    </main>
  );
}
