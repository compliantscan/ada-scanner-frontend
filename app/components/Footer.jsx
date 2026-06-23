export default function Footer() {
  const platforms = [
    { label: 'Windows', icon: '🪟' },
    { label: 'macOS', icon: '🍎' },
    { label: 'Linux', icon: '🐧' },
    { label: 'Chrome', icon: '🌐' },
    { label: 'iOS', icon: '📱' },
    { label: 'Android', icon: '🤖' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand-block">
            <div className="footer-logo">
              <div className="footer-logo-icon" aria-hidden="true" />
              <p className="footer-brand">CompliantScan</p>
            </div>
            <div className="footer-contact">
              <a href="mailto:hello@compliantscan.com">hello@compliantscan.com</a>
              <span>ADA and WCAG compliance scanner for websites of all sizes.</span>
            </div>
          </div>

          <nav className="footer-nav">
            <a href="#hero">Home</a>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </nav>

          <div className="footer-cta-block">
            <p className="footer-cta-heading">Get started with your compliance scanner now.</p>
            <div className="footer-cta-buttons">
              <button className="footer-btn-primary">Try CompliantScan</button>
              <button className="footer-btn-secondary">Watch Demo</button>
            </div>
          </div>
        </div>

        <div className="footer-platforms">
          {platforms.map((p) => (
            <span key={p.label} className="footer-platform-pill">
              <span aria-hidden="true">{p.icon}</span>
              {p.label}
            </span>
          ))}
        </div>

        <div className="footer-row-2">
          <p className="footer-copyright">© 2026 CompliantScan. All rights reserved.</p>
          <p className="footer-mission">
            Made for small businesses, agencies, and anyone who would rather fix a violation than pay a lawyer.
          </p>
        </div>
      </div>
      <div className="footer-bottom" aria-hidden="true" />
    </footer>
  );
}
