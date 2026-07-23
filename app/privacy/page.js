import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from '../legal.module.css';

export const metadata = {
  title: 'Privacy Policy — CompliantScan',
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <article className={styles.content}>
        <p className={styles.eyebrow}>Legal</p>
        <h1>Privacy Policy</h1>
        <p className={styles.updated}>Last updated July 23, 2026</p>

        <section className={styles.section}>
          <h2>What we collect</h2>
          <p>We collect information you submit to CompliantScan, such as your email address, account details, website URLs you ask us to scan, and messages you send us. We may also collect basic technical information needed to operate and protect the service.</p>
        </section>
        <section className={styles.section}>
          <h2>How we use information</h2>
          <p>We use this information to run requested accessibility scans, generate reports, manage accounts, provide support, improve reliability, and prevent misuse. We do not sell personal information.</p>
        </section>
        <section className={styles.section}>
          <h2>Service providers</h2>
          <p>We may use trusted hosting, authentication, email, and infrastructure providers to operate CompliantScan. They process information only as needed to provide those services.</p>
        </section>
        <section className={styles.section}>
          <h2>Your choices</h2>
          <p>You may ask to access, correct, or delete personal information associated with your account. Some records may be retained where required for security, legal, or operational reasons.</p>
        </section>
        <section className={styles.section}>
          <h2>Contact</h2>
          <p>Questions about privacy can be sent to <a href="mailto:info@compliantscan.com">info@compliantscan.com</a>.</p>
        </section>
      </article>
      <Footer />
    </main>
  );
}
