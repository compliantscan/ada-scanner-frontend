'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon, { ScoreRing } from '../../../../components/Dashboard/Icons/Icons';
import { getSupabaseClient } from '../../../../lib/supabaseClient';
import './detail.css';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

export default function MonitoringDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [site, setSite] = useState(null);
  const [scans, setScans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      const headers = { Authorization: `Bearer ${session.access_token}` };

      // Fetch site details + scans + alerts
      const res = await fetch(`${getApiUrl()}/dashboard/monitoring/${id}`, { headers });
      if (!res.ok) throw new Error('Failed to load site');
      const data = await res.json();
      
      setSite(data.site);
      setScans(data.scans || []);
      setAlerts(data.alerts || []);

      // Fetch compare data
      const compRes = await fetch(`${getApiUrl()}/dashboard/monitoring/${id}/compare`, { headers });
      if (compRes.ok) {
        const compData = await compRes.json();
        if (!compData.error) setCompareData(compData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleScanNow() {
    try {
      setScanning(true);
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      await fetch(`${getApiUrl()}/dashboard/monitoring/${id}/scan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      // Wait a bit, then refetch
      setTimeout(fetchData, 5000);
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  }

  async function handlePauseToggle() {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const newStatus = site.status === 'paused' ? 'pending' : 'paused';
      
      await fetch(`${getApiUrl()}/dashboard/monitoring/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <div className="detail-page" style={{ padding: 40 }}>Loading...</div>;
  if (!site) return <div className="detail-page" style={{ padding: 40 }}>Site not found</div>;

  // Chart prep (reverse for chronological order)
  const chartScans = [...scans].reverse();
  const maxScore = 100;
  
  return (
    <div className="detail-page">
      <Link href="/dashboard/monitoring" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--cs-text-muted)', textDecoration: 'none', marginBottom: 20, fontSize: 13, fontWeight: 500 }}>
        <Icon name="chevron" style={{ transform: 'rotate(90deg)' }} /> Back to Monitoring
      </Link>

      <div className="detail-header">
        <div className="detail-header__left">
          <div className="detail-header__icon">
            <Icon name="globe" />
          </div>
          <div>
            <h1 className="detail-title">{site.url}</h1>
            <div className="detail-meta">
              <span className={`detail-badge detail-badge--${site.status}`}>{site.status}</span>
              <span><Icon name="clock" /> {site.frequency} scan</span>
              <span><Icon name="bell" /> Alerts {site.alerts_enabled ? 'enabled' : 'disabled'}</span>
              <span>Last scanned: {site.last_scan_at ? new Date(site.last_scan_at).toLocaleDateString() : 'Never'}</span>
            </div>
          </div>
        </div>
        <div className="detail-header__actions">
          <button className="detail-btn detail-btn--secondary" onClick={handlePauseToggle}>
            <Icon name={site.status === 'paused' ? 'play' : 'pause'} />
            {site.status === 'paused' ? 'Resume' : 'Pause'} Monitoring
          </button>
          <button className="detail-btn detail-btn--primary" onClick={handleScanNow} disabled={scanning || site.status === 'paused'}>
            <Icon name="refresh-cw" />
            {scanning ? 'Scanning...' : 'Run Scan Now'}
          </button>
        </div>
      </div>

      <div className="detail-grid">
        {/* Left Column */}
        <div>
          {/* Trend Chart */}
          <div className="detail-card">
            <h3 className="detail-card__title">
              <Icon name="activity" /> Accessibility Trend
            </h3>
            {chartScans.length > 0 ? (
              <div className="trend-chart-container">
                <svg className="trend-chart" viewBox={`0 0 ${chartScans.length * 100 || 800} 200`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--cs-accent)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="var(--cs-accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid */}
                  <line x1="0" y1="40" x2="100%" y2="40" className="trend-grid" />
                  <line x1="0" y1="100" x2="100%" y2="100" className="trend-grid" />
                  <line x1="0" y1="160" x2="100%" y2="160" className="trend-grid" />

                  {/* Line */}
                  {chartScans.length > 1 && (
                    <polyline 
                      className="trend-line" 
                      points={chartScans.map((s, i) => `${(i / (chartScans.length - 1)) * 100}% ${200 - (s.score / maxScore) * 160 - 20}`).join(', ')} 
                    />
                  )}
                  {chartScans.length > 1 && (
                    <polygon 
                      className="trend-area"
                      points={`0,200 ${chartScans.map((s, i) => `${(i / (chartScans.length - 1)) * 100}% ${200 - (s.score / maxScore) * 160 - 20}`).join(', ')} 100%,200`}
                    />
                  )}

                  {/* Points */}
                  {chartScans.map((s, i) => {
                    const cx = chartScans.length === 1 ? '50%' : `${(i / (chartScans.length - 1)) * 100}%`;
                    const cy = 200 - (s.score / maxScore) * 160 - 20;
                    return (
                      <g key={s.id}>
                        <circle cx={cx} cy={cy} r="4" className="trend-point" />
                        <text x={cx} y={cy - 12} className="trend-label" textAnchor="middle">{s.score}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div style={{ color: 'var(--cs-text-muted)', fontSize: 14 }}>No scan data available yet. Run a scan to see trends.</div>
            )}
          </div>

          {/* Compare Section */}
          {compareData && (
            <div className="detail-card">
              <h3 className="detail-card__title">
                <Icon name="layers" /> Latest Scan Comparison
              </h3>
              
              <div className="compare-grid">
                <div className="compare-box">
                  <div className="compare-box__label">Previous Scan</div>
                  <div className="compare-box__score">{compareData.previous.score}</div>
                  <div className="compare-box__stats">
                    <span className="compare-box__stat compare-box__stat--critical"><Icon name="alert" /> {compareData.previous.critical_count} critical</span>
                    <span className="compare-box__stat compare-box__stat--serious"><Icon name="alert" /> {compareData.previous.serious_count} serious</span>
                  </div>
                </div>
                
                <div className="compare-box">
                  <div className="compare-box__label">Current Scan</div>
                  <div className="compare-box__score">{compareData.current.score}</div>
                  <div className="compare-box__stats">
                    <span className="compare-box__stat compare-box__stat--critical"><Icon name="alert" /> {compareData.current.critical_count} critical</span>
                    <span className="compare-box__stat compare-box__stat--serious"><Icon name="alert" /> {compareData.current.serious_count} serious</span>
                  </div>
                </div>
              </div>

              <div className="compare-summary">
                {compareData.scoreDiff > 0 && <span>Great job! Accessibility score improved by {compareData.scoreDiff} points. </span>}
                {compareData.scoreDiff < 0 && <span>Accessibility score dropped by {Math.abs(compareData.scoreDiff)} points. </span>}
                {compareData.scoreDiff === 0 && <span>Accessibility score remained unchanged. </span>}
                
                {compareData.newIssues.length > 0 && `${compareData.newIssues.length} new issues were introduced. `}
                {compareData.fixedIssues.length > 0 && `${compareData.fixedIssues.length} issues were fixed.`}
              </div>

              {/* Issues Lists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>New Issues</h4>
                  {compareData.newIssues.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--cs-text-muted)' }}>No new issues detected.</div>
                  ) : (
                    <div className="issues-list">
                      {compareData.newIssues.slice(0, 5).map((issue, idx) => (
                        <div key={idx} className="issue-item">
                          <div className={`issue-item__icon issue-item__icon--${issue.impact}`}>
                            <Icon name="alert" />
                          </div>
                          <div className="issue-item__content">
                            <div className="issue-item__title">{issue.help}</div>
                            <div className="issue-item__meta">
                              <span style={{ textTransform: 'uppercase' }}>{issue.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Fixed Issues</h4>
                  {compareData.fixedIssues.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--cs-text-muted)' }}>No issues were fixed since last scan.</div>
                  ) : (
                    <div className="issues-list">
                      {compareData.fixedIssues.slice(0, 5).map((issue, idx) => (
                        <div key={idx} className="issue-item">
                          <div className="issue-item__icon" style={{ background: 'var(--cs-green-soft)', color: 'var(--cs-green)' }}>
                            <Icon name="check" />
                          </div>
                          <div className="issue-item__content">
                            <div className="issue-item__title">{issue.help}</div>
                            <div className="issue-item__meta">
                              <span style={{ textTransform: 'uppercase' }}>{issue.impact}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Status Overview */}
          <div className="detail-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              {scans.length > 0 ? (
                <ScoreRing score={scans[0].score} size={120} />
              ) : (
                <div style={{ width: 120, height: 120, borderRadius: '50%', border: '8px solid var(--cs-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: 'var(--cs-text-muted)' }}>--</div>
              )}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{site.status === 'healthy' ? 'Looking Good!' : site.status === 'warning' ? 'Needs Attention' : site.status === 'critical' ? 'Critical Action Required' : 'Status Pending'}</h3>
            <p style={{ fontSize: 13, color: 'var(--cs-text-muted)', marginBottom: 24 }}>
              {site.frequency === 'daily' ? 'We check this site every day.' : site.frequency === 'weekly' ? 'We check this site every week.' : 'We check this site every month.'}
            </p>
            <button className="detail-btn detail-btn--secondary" style={{ width: '100%', justifyContent: 'center' }}>
              <Icon name="download" /> Generate Monthly Report
            </button>
          </div>

          {/* Timeline */}
          <div className="detail-card">
            <h3 className="detail-card__title">
              <Icon name="clock" /> Scan History
            </h3>
            <div className="timeline">
              {scans.length === 0 && (
                <div style={{ fontSize: 13, color: 'var(--cs-text-muted)' }}>No scans performed yet.</div>
              )}
              {scans.slice(0, 8).map((scan, i) => (
                <div key={scan.id} className={`timeline-item ${i === 0 ? 'timeline-item--first' : ''}`}>
                  <div className="timeline-item__date">
                    {new Date(scan.created_at).toLocaleString()}
                  </div>
                  <div className="timeline-item__content">
                    Scan completed
                    <span className="timeline-item__score">Score: {scan.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
