'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ScannerInput.module.css';

function normalizeUserUrl(url) {
  const trimmed = typeof url === 'string' ? url.trim() : '';
  if (!trimmed) return '';

  let normalized = trimmed;
  if (!/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  if ((normalized.match(/https?:\/\//gi) || []).length > 1) {
    return '';
  }

  return normalized;
}

const TRUST_ITEMS = [
  { label: 'No credit card required', icon: 'card' },
  { label: '60 second average scan', icon: 'clock' },
  { label: 'Real browser scan', icon: 'browser' },
  { label: 'WCAG 2.2 compliant', icon: 'shield' },
];

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.25" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 9h14M9 1.75c2 2 2 12.5 0 14.5M9 1.75c-2 2-2 12.5 0 14.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function TrustIcon({ type }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    fill: 'none',
    'aria-hidden': true,
  };

  switch (type) {
    case 'card':
      return (
        <svg {...common}>
          <rect x="1.5" y="4" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.5 14.5L13.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'browser':
      return (
        <svg {...common}>
          <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1.5 5.5h13" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="3.4" cy="4" r="0.5" fill="currentColor" />
          <circle cx="5" cy="4" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...common}>
          <path
            d="M8 1.5L13.5 3.5V7.5C13.5 10.8 11.1 13.4 8 14.5C4.9 13.4 2.5 10.8 2.5 7.5V3.5L8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M5.7 8L7.3 9.6L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ScannerInput() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleScan = (e) => {
    e.preventDefault();
    setError('');

    const finalUrl = normalizeUserUrl(url);
    if (!finalUrl) {
      setError('Please enter a valid website URL.');
      return;
    }

    // Redirect to scanning page — it handles the API call and shows progress
    router.push(`/scanning?url=${encodeURIComponent(finalUrl)}`);
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.scanner} role="search" onSubmit={handleScan}>
        <label htmlFor="website-url" className={styles.srOnly}>
          Website URL
        </label>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}>
            <GlobeIcon />
          </span>
          <input
            id="website-url"
            type="url"
            name="url"
            placeholder="Enter your website URL"
            className={styles.input}
            autoComplete="off"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.button}>
          Scan Website
          <ArrowIcon />
        </button>
      </form>

      {error && <p style={{ color: 'var(--color-critical)', marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>{error}</p>}

      <ul className={styles.trustList}>
        {TRUST_ITEMS.map((item) => (
          <li key={item.label} className={styles.trustItem}>
            <span className={styles.trustIcon}>
              <TrustIcon type={item.icon} />
            </span>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}