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

export const metadata = {
  title: 'Website Accessibility Scanner for Agencies | CompliantScan',
  description:
    'Scan websites for WCAG 2.2 issues, get developer-ready fixes, and generate client-ready accessibility reports with CompliantScan.',
  alternates: {
    canonical: 'https://www.compliantscan.com/',
  },
};

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className={styles.heroSection}>
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
