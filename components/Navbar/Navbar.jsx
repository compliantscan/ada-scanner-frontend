import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#built-for-agencies' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact' },
];

function ArrowIcon() {
  return (
    <svg
      className={styles.arrow}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoMark() {
  return (
    <svg
      className={styles.logoMark}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 2L24 6V13C24 19.5 19.8 24.7 14 26C8.2 24.7 4 19.5 4 13V6L14 2Z"
        fill="var(--color-brand-green)"
      />
      <path
        d="M9.5 14L12.5 17L18.5 10.5"
        stroke="var(--color-cream)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo} aria-label="CompliantScan home">
          <LogoMark />
          <span className={styles.logoText}>CompliantScan</span>
        </a>

        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href="/login" className={styles.signIn}>
            Sign in
          </a>
          <a href="/login" className={styles.cta}>
            Start Free Scan
            <ArrowIcon />
          </a>
        </div>
      </div>
    </header>
  );
}