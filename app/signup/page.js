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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M9 12.5l2 2 4-4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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