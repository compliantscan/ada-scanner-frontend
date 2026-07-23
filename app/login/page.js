import Link from 'next/link';
import LoginForm from '@/components/Auth/LoginForm';
import styles from '@/components/Auth/Auth.module.css';

export const metadata = {
  title: 'Sign in — CompliantScan',
  description: 'Sign in to your CompliantScan workspace.',
};

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <img src="/compliantscan-mark.png" alt="" />
          <span>CompliantScan</span>
        </Link>

        <h1 className={styles.heading}>Welcome back.</h1>
        <p className={styles.subheading}>Sign in to your workspace to view scans and reports.</p>

        <LoginForm />

        <p className={styles.switchText}>
          Don&apos;t have an account? <Link href="/signup">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}
