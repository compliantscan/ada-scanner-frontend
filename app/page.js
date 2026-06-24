'use client';

import { useEffect, useRef, useState } from 'react';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
}

const apiUrl = getApiUrl();

const scanSteps = [
  'Loading your page in a real browser...',
  'Injecting accessibility scanner...',
  'Testing buttons and form controls...',
  'Checking color contrast ratios...',
  'Scanning image alternative text...',
  'Testing keyboard navigation...',
  'Checking landmark and heading structure...',
  'Generating your violation report...',
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [showInputError, setShowInputError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const apiCompleteRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Auto-focus on desktop only
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      inputRef.current?.focus();
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!scanning) return;

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % scanSteps.length);
    }, 6000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (apiCompleteRef.current && prev >= 90) return 100;
        if (prev >= 90 && !apiCompleteRef.current) return 90;
        return Math.min(prev + 1, 90);
      });
    }, 500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [scanning]);

  useEffect(() => {
    if (progress === 100 && apiCompleteRef.current) {
      const timer = setTimeout(() => {
        const result = sessionStorage.getItem('adaScanResult');
        if (result) window.location.href = '/results';
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowInputError(false);

    if (!url.trim()) {
      setShowInputError(true);
      inputRef.current?.focus();
      setTimeout(() => setShowInputError(false), 1500);
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setScanning(true);
    setProgress(0);
    setCurrentStep(0);
    apiCompleteRef.current = false;

    try {
      const response = await fetch(`${apiUrl}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Scan failed. Please check the URL and try again.');
      }

      sessionStorage.setItem('adaScanResult', JSON.stringify(data));
      apiCompleteRef.current = true;
      setProgress(100);
    } catch (err) {
      setScanning(false);
      setProgress(0);
      setError(err.message || 'Scan failed. Please check the URL and try again.');
      apiCompleteRef.current = false;
    }
  };

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <a href="/" className="logo">CompliantScan</a>

          <div className="nav-links">
            {navLinks.map(({ href, label }) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </div>

          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M16 4L4 16" stroke="#121212" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 5H17M3 10H17M3 15H17" stroke="#121212" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu-backdrop ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobile-menu">
        <nav className="mobile-menu-nav">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="mobile-menu-link"
              onClick={() => handleNavClick(href)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <main className="container">
        <section className="hero" id="hero">
          <div className="eyebrow">
            <span className="dot"></span>
            Free website scanner
          </div>

          <h1 className="headline">
            Is your website one lawsuit away from a{' '}
            <span className="highlight">$25,000 fine?</span>
          </h1>

          <p className="subheadline">
            3,117 ADA website lawsuits were filed in 2025. Scan your site free — find every violation before a lawyer does.
          </p>

          <form className="scanner" onSubmit={handleSubmit}>
            <label htmlFor="url" className="input-label">Enter your website URL</label>
            <div className="input-row">
              <input
                ref={inputRef}
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                disabled={scanning}
                className={showInputError ? 'shake' : ''}
              />
              <button type="submit" disabled={scanning}>
                {scanning ? 'Scanning...' : 'Scan free'}
              </button>
            </div>

            {!scanning && !error && (
              <p className="scanner-note">No account required · Takes under 60 seconds</p>
            )}

            {scanning && (
              <div className="progress-wrapper">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">{scanSteps[currentStep]}</p>
              </div>
            )}

            {error && <p className="error-message">{error}</p>}
          </form>

          <div className="trust-row">
            <div className="trust-item">✓ WCAG 2.1 AA tested</div>
            <div className="trust-item">✓ No credit card required</div>
            <div className="trust-item">✓ Real browser scan</div>
            <div className="trust-item">✓ PDF report included</div>
          </div>

          <div className="stats-row">
            <div className="stat">
              <div className="stat-number">3,117</div>
              <div className="stat-label">ADA lawsuits in 2025</div>
            </div>
            <div className="stat">
              <div className="stat-number">95.9%</div>
              <div className="stat-label">Of websites fail WCAG</div>
            </div>
            <div className="stat">
              <div className="stat-number">$15,000</div>
              <div className="stat-label">Average settlement cost</div>
            </div>
            <div className="stat">
              <div className="stat-number">60 sec</div>
              <div className="stat-label">To scan your site</div>
            </div>
          </div>


        </section>
      </main>

      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}
