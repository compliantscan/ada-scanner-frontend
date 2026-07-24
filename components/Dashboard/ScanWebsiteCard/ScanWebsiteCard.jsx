'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../Icons/Icons';

function normalizeUrl(value) {
  try {
    const normalized = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value) ? value : `https://${value}`;
    const parsed = new URL(normalized);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : '';
  } catch {
    return '';
  }
}

export default function ScanWebsiteCard() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('single');
  const [reportType, setReportType] = useState('executive');
  const [scanError, setScanError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setScanError('');

    if (!url.trim()) {
      setScanError('Please enter a website URL.');
      return;
    }
    const normalizedUrl = normalizeUrl(url.trim());
    if (!normalizedUrl) {
      setScanError('Please enter a valid URL (e.g. https://example.com).');
      return;
    }

    const params = new URLSearchParams({ url: normalizedUrl, scanType, reportType });
    router.push(`/dashboard/scanning?${params.toString()}`);
  };

  const segment = (value, current, setter, label) => (
    <button
      type="button"
      className={`scan-website-card__segment ${current === value ? 'scan-website-card__segment--active' : ''}`}
      onClick={() => setter(value)}
    >
      {label}
    </button>
  );

  return (
    <section className="scan-website-card">
      <div className="scan-website-card__header">
        <div className="scan-website-card__header-icon"><Icon name="globe" /></div>
        <h2 className="scan-website-card__title">Scan a website</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="scan-website-card__field">
          <label className="scan-website-card__label" htmlFor="website-url">Website URL</label>
          <div className="scan-website-card__input-wrap">
            <span className="scan-website-card__input-icon"><Icon name="link" /></span>
            <input
              id="website-url"
              type="url"
              className="scan-website-card__input"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                if (scanError) setScanError('');
              }}
            />
          </div>
        </div>

        <div className="scan-website-card__selectors">
          <div>
            <div className="scan-website-card__selector-label">Scan type</div>
            <div className="scan-website-card__segmented" role="group" aria-label="Scan type">
              {segment('single', scanType, setScanType, 'Single page')}
              {segment('full', scanType, setScanType, 'Full website')}
            </div>
          </div>
          <div>
            <div className="scan-website-card__selector-label">Report type</div>
            <div className="scan-website-card__segmented" role="group" aria-label="Report type">
              {segment('executive', reportType, setReportType, 'Executive')}
              {segment('developer', reportType, setReportType, 'Developer')}
              {segment('both', reportType, setReportType, 'Both')}
            </div>
          </div>
        </div>

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

        <button type="submit" className="scan-website-card__submit">
          <Icon name="search" />
          Start Scan
        </button>
      </form>
    </section>
  );
}
