'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import Icon from '../Icons/Icons';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

function isValidUrl(value) {
  try {
    const normalized = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value) ? value : `https://${value}`;
    const parsed = new URL(normalized);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

export default function ScanWebsiteCard({ onScanComplete }) {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('single');
  const [reportType, setReportType] = useState('executive');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setScanError(null);

    // 1. Client-side URL validation
    if (!url.trim()) {
      setScanError('Please enter a website URL.');
      return;
    }
    if (!isValidUrl(url.trim())) {
      setScanError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }

    setScanning(true);

    try {
      const apiUrl = getApiUrl();
      // If user is authenticated, create a dashboard audit which returns immediately
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      const endpoint = session ? `${apiUrl}/dashboard/scan` : `${apiUrl}/scan`;

      const headers = { 'Content-Type': 'application/json' };
      if (session && session.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url: url.trim(),
          scanType,    // 'single' | 'full' — passed to API even if full-site not yet implemented
          reportType,  // 'executive' | 'developer' | 'both'
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || `Scan failed (${response.status})`);
      }

      // 2. Notify parent to refresh stats
      if (typeof onScanComplete === 'function') {
        onScanComplete();
      }

      // 3. Navigate to the dashboard audit page for authenticated users
      const newScanId = payload.scanId || payload.id || payload.scanId;
      if (session && newScanId) {
        router.push(`/dashboard/audit/${newScanId}`);
      } else {
        // Fallback for anonymous/public scan: reuse existing results page
        sessionStorage.setItem('adaScanResult', JSON.stringify(payload));
        router.push('/results');
      }
    } catch (err) {
      setScanError(err.message || 'Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <section className="scan-website-card">
      <div className="scan-website-card__header">
        <div className="scan-website-card__header-icon">
          <Icon name="globe" />
        </div>
        <h2 className="scan-website-card__title">Scan a website</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="scan-website-card__field">
          <label className="scan-website-card__label" htmlFor="website-url">
            Website URL
          </label>
          <div className="scan-website-card__input-wrap">
            <span className="scan-website-card__input-icon">
              <Icon name="link" />
            </span>
            <input
              id="website-url"
              type="url"
              className="scan-website-card__input"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                if (scanError) setScanError(null);
              }}
              disabled={scanning}
            />
          </div>
        </div>

        <div className="scan-website-card__selectors">
          <div>
            <div className="scan-website-card__selector-label">Scan type</div>
            <div className="scan-website-card__segmented" role="group" aria-label="Scan type">
              <button
                type="button"
                className={`scan-website-card__segment ${scanType === 'single' ? 'scan-website-card__segment--active' : ''}`}
                onClick={() => setScanType('single')}
                disabled={scanning}
              >
                Single page
              </button>
              <button
                type="button"
                className={`scan-website-card__segment ${scanType === 'full' ? 'scan-website-card__segment--active' : ''}`}
                onClick={() => setScanType('full')}
                disabled={scanning}
              >
                Full website
              </button>
            </div>
          </div>

          <div>
            <div className="scan-website-card__selector-label">Report type</div>
            <div className="scan-website-card__segmented" role="group" aria-label="Report type">
              <button
                type="button"
                className={`scan-website-card__segment ${reportType === 'executive' ? 'scan-website-card__segment--active' : ''}`}
                onClick={() => setReportType('executive')}
                disabled={scanning}
              >
                Executive
              </button>
              <button
                type="button"
                className={`scan-website-card__segment ${reportType === 'developer' ? 'scan-website-card__segment--active' : ''}`}
                onClick={() => setReportType('developer')}
                disabled={scanning}
              >
                Developer
              </button>
              <button
                type="button"
                className={`scan-website-card__segment ${reportType === 'both' ? 'scan-website-card__segment--active' : ''}`}
                onClick={() => setReportType('both')}
                disabled={scanning}
              >
                Both
              </button>
            </div>
          </div>
        </div>

        {/* Inline error message */}
        {scanError && (
          <p
            role="alert"
            style={{
              margin: '10px 0 0',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              fontSize: '13px',
              lineHeight: '1.5',
            }}
          >
            {scanError}
          </p>
        )}

        <button
          type="submit"
          className="scan-website-card__submit"
          disabled={scanning}
          style={scanning ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
        >
          {scanning ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid currentColor',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              Scanning...
            </>
          ) : (
            <>
              <Icon name="search" />
              Start Scan
            </>
          )}
        </button>
      </form>
    </section>
  );
}
