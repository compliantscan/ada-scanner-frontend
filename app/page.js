import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import ExecutiveReportPreview from '../components/ExecutiveReportPreview/ExecutiveReportPreview';
import StatsBar from '../components/StatsBar/StatsBar';
import styles from './page.module.css';
import BuiltForAgencies from '@/components/BuiltForAgencies/BuiltForAgencies';
import HowItWorks from '@/components/HowItWorks/HowItWorks';
import Stakes from '@/components/Stakes/Stakes';
import FAQ from '@/components/FAQ/FAQ';
import Contact from '@/components/Contact/Contact';
import Footer from '@/components/Footer/Footer';





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
      <FAQ />
      <Contact />
      <Footer />

    </main>
  );
}