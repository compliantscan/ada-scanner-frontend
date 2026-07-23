import Link from 'next/link';
import SignupForm from '@/components/Auth/SignupForm';
import styles from '@/components/Auth/Auth.module.css';

export const metadata = {
  title: 'Sign up — CompliantScan',
  description: 'Create a free CompliantScan account and run your first accessibility scan.',
};

export default function SignupPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <img src="/compliantscan-mark.png" alt="" />
          <span>CompliantScan</span>
        </Link>

        <h1 className={styles.heading}>Create your account.</h1>
        <p className={styles.subheading}>
          Free to start. No credit card required for your first scan.
        </p>

        <SignupForm />

        <p className={styles.switchText}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
