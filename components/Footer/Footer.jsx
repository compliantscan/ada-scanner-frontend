import styles from './Footer.module.css';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/#built-for-agencies' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'FAQ', href: '/#faq' },
  ],
  Company: [
    { label: 'About', href: '/#built-for-agencies' },
    { label: 'Contact', href: '/contact' },
    { label: 'Docs', href: '/blogs' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:info@compliantscan.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="5.5" width="17" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4.5 6.5l7.5 6 7.5-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/bibek-dahal-8357b4347/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 10.5v6M8 7.75v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M11.5 16.5v-3.5c0-1.1.9-2 2-2s2 .9 2 2v3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M11.5 16.5v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/bibek_dahal0807',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topRow}>
          <div className={styles.brandColumn}>
            <div className={styles.logo}>
              <img src="/compliantscan-mark.png" alt="" />
              <span>CompliantScan</span>
            </div>
            <p className={styles.tagline}>
              AI-powered accessibility audits that help agencies find WCAG
              issues and win client trust.
            </p>
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className={styles.socialIcon}
                  aria-label={social.label}
                  target={social.id === 'email' ? undefined : '_blank'}
                  rel={social.id === 'email' ? undefined : 'noopener noreferrer'}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className={styles.linksGrid}>
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className={styles.linkColumn}>
                <p className={styles.linkHeading}>{heading}</p>
                <ul className={styles.linkList}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className={styles.link}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            &copy; {year} CompliantScan. All rights reserved.
          </p>
          <p className={styles.madeIn}>Built in Coimbatore, India</p>
        </div>
      </div>
    </footer>
  );
}
