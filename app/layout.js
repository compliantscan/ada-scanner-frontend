import './globals.css';

export const metadata = {
  title: 'CompliantScan',
  description: 'Scan your website for ADA violations free before a lawyer does it for you.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <a href="/" className="site-logo" aria-label="CompliantScan — go to home">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <rect width="28" height="28" rx="8" fill="#1d4ed8"/>
                <path d="M8 14.5l4.5 4.5 7.5-9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>CompliantScan</span>
            </a>
            <nav className="site-nav">
              <a href="/">Home</a>
              <a href="/#scanner">Scanner</a>
              <a href="/#features">Features</a>
              <a href="/pricing">Pricing</a>
              <a href="/#contact">Contact</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
