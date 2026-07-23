import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Terms of Service — CompliantScan',
};

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article className={styles.content}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>Terms of Service</h1>
        <p className={styles.updated}>Last updated July 23, 2026</p>

        <section className={styles.section}>
          <h2>Using CompliantScan</h2>
          <p>You may use CompliantScan only for websites you own or are authorized to assess. You agree not to misuse the service, interfere with its operation, or use it to scan systems without permission.</p>
        </section>
        <section className={styles.section}>
          <h2>Automated reports</h2>
          <p>CompliantScan reports are generated through automated testing. They help identify detectable accessibility issues but do not replace a complete manual audit, legal advice, or a certification of compliance.</p>
        </section>
        <section className={styles.section}>
          <h2>Accounts and plans</h2>
          <p>You are responsible for safeguarding your account credentials and for activity under your account. Paid features, billing periods, and cancellation options are presented when you choose a plan.</p>
        </section>
        <section className={styles.section}>
          <h2>Availability</h2>
          <p>We work to keep the service reliable, but availability and scan results are not guaranteed. Features may change as the product improves.</p>
        </section>
        <section className={styles.section}>
          <h2>Contact</h2>
          <p>Questions about these terms can be sent to <a href="mailto:info@compliantscan.com">info@compliantscan.com</a>.</p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
