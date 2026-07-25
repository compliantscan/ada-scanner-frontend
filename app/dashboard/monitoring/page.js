'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon, { ScoreRing } from '../../../components/Dashboard/Icons/Icons';
import { getCachedSession } from '../../../lib/supabaseClient';
import { getApiUrl } from '../../../lib/apiUrl';
import './monitoring.css';

// Module-level cache
let _monitoringCache = null;
let _monitoringCacheTime = 0;
const MONITORING_TTL = 30_000;

function formatRelativeTime(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function formatNextScan(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff < 0) return 'Due now';
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `in ${mins}m`;
  if (hours < 24) return `in ${hours}h`;
  return `in ${days}d`;
}

function getScoreColor(score) {
  if (score === null || score === undefined) return 'var(--cs-text-muted)';
  if (score >= 80) return 'var(--cs-green)';
  if (score >= 50) return 'var(--cs-orange)';
  return 'var(--cs-red)';
}

function MiniSparkline({ scans }) {
  if (!scans || scans.length < 2) return null;
  const reversed = [...scans].reverse();
  const scores = reversed.map(s => s.score || 0);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * W;
    const y = H - ((s - min) / range) * (H - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const lastTwo = scores.slice(-2);
  const trending = lastTwo[1] > lastTwo[0] ? 'up' : lastTwo[1] < lastTwo[0] ? 'down' : 'neutral';
  return (
    <div className="monitoring-card__sparkline-wrap">
      <svg width={W} height={H} className="monitoring-card__sparkline">
        <polyline points={pts} fill="none" stroke={trending === 'up' ? 'var(--cs-green)' : trending === 'down' ? 'var(--cs-red)' : 'var(--cs-accent)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className={`monitoring-card__trend-icon monitoring-card__trend-icon--${trending}`}>
        {trending === 'up' ? '↑' : trending === 'down' ? '↓' : '→'}
      </span>
    </div>
  );
}

function SummarySkeletonCard() {
  return (
    <div className="monitoring-stat-card">
      <div className="monitoring-stat-card__header">
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 12 }} />
        <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 4 }} />
      </div>
      <div className="skeleton" style={{ width: 60, height: 36, borderRadius: 8, margin: '4px 0' }} />
      <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 4 }} />
    </div>
  );
}

function MonitoringSkeletonCard() {
  return (
    <div className="monitoring-card monitoring-card--skeleton">
      <div className="monitoring-card__header">
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14 }} />
        <div className="skeleton" style={{ width: 68, height: 22, borderRadius: 999 }} />
      </div>
      
      <div className="skeleton" style={{ width: '65%', height: 18, borderRadius: 6, margin: '6px 0 2px' }} />
      
      <div style={{ display: 'flex', gap: 14, marginBottom: 4 }}>
        <div className="skeleton" style={{ width: 64, height: 14, borderRadius: 4 }} />
        <div className="skeleton" style={{ width: 72, height: 14, borderRadius: 4 }} />
      </div>

      <div className="monitoring-card__score-section" style={{ background: '#f8fafd', borderColor: '#ededed' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <div className="skeleton" style={{ width: 52, height: 32, borderRadius: 6 }} />
          <div className="skeleton" style={{ width: 110, height: 12, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 4 }} />
        </div>
        <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
        <div className="skeleton" style={{ width: 64, height: 20, borderRadius: 6 }} />
        <div className="skeleton" style={{ width: 64, height: 20, borderRadius: 6 }} />
      </div>

      <div className="skeleton" style={{ width: 100, height: 14, borderRadius: 4, marginTop: 2 }} />

      <div className="monitoring-card__footer" style={{ marginTop: 'auto', paddingTop: 8 }}>
        <div className="skeleton" style={{ flex: 1, height: 36, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 8 }} />
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  const router = useRouter();
  const [sites, setSites] = useState(() => _monitoringCache?.sites || []);
  const [summary, setSummary] = useState(() => _monitoringCache?.summary || { healthy: 0, warning: 0, critical: 0, total: 0 });
  const [loading, setLoading] = useState(!_monitoringCache);
  const [scansLoading, setScansLoading] = useState(true);
  const [scanningId, setScanningId] = useState(null);
  const [scansMap, setScansMap] = useState({});

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newFrequency, setNewFrequency] = useState('weekly');
  const [newAlertsEnabled, setNewAlertsEnabled] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites(force = false) {
    if (force) {
      setLoading(true);
    }
    const now = Date.now();
    if (!force && _monitoringCache && now - _monitoringCacheTime < MONITORING_TTL) {
      setSites(_monitoringCache.sites);
      setSummary(_monitoringCache.summary);
      setLoading(false);
      const session = await getCachedSession();
      if (session) fetchRecentScans(_monitoringCache.sites, session.access_token);
      return;
    }
    try {
      const session = await getCachedSession();
      if (!session) return router.push('/login');

      const res = await fetch(`${getApiUrl()}/dashboard/monitoring`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (!res.ok) throw new Error('Failed to load monitoring data');

      const data = await res.json();
      const sitesData = data.sites || [];
      const summaryData = data.summary || { healthy: 0, warning: 0, critical: 0, total: 0 };
      _monitoringCache = { sites: sitesData, summary: summaryData };
      _monitoringCacheTime = Date.now();
      setSites(sitesData);
      setSummary(summaryData);

      // Fetch recent scans for sparklines & scores
      fetchRecentScans(sitesData, session.access_token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentScans(sitesData, token) {
    if (!token) return;
    setScansLoading(true);
    const map = {};
    await Promise.all(
      sitesData.map(async (site) => {
        try {
          const res = await fetch(`${getApiUrl()}/dashboard/monitoring/${site.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const d = await res.json();
            map[site.id] = d.scans || [];
          }
        } catch {}
      })
    );
    setScansMap(map);
    setScansLoading(false);
  }

  async function handleScanNow(e, siteId) {
    e.preventDefault();
    e.stopPropagation();
    if (scanningId) return;
    setScanningId(siteId);
    try {
      const session = await getCachedSession();
      await fetch(`${getApiUrl()}/dashboard/monitoring/${siteId}/scan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setTimeout(() => { fetchSites(true); setScanningId(null); }, 5000);
    } catch (err) {
      console.error(err);
      setScanningId(null);
    }
  }

  async function handleAddSite(e) {
    e.preventDefault();
    if (!newUrl) return;
    setModalLoading(true);
    setModalError('');

    try {
      const session = await getCachedSession();
      
      const res = await fetch(`${getApiUrl()}/dashboard/monitoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          url: newUrl,
          frequency: newFrequency,
          pages_monitored: 1,
          alerts_enabled: newAlertsEnabled
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add site');

      setIsModalOpen(false);
      setNewUrl('');
      setNewFrequency('weekly');
      setNewAlertsEnabled(true);
      fetchSites(true);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  }

  const filteredSites = sites.filter(site => {
    if (statusFilter !== 'all' && site.status !== statusFilter) return false;
    if (search && !site.url.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="monitoring-page">
      <div className="monitoring-header">
        <div>
          <h1 className="monitoring-title">Monitoring</h1>
          <p className="monitoring-subtitle">Automatically track your clients' accessibility over time.</p>
        </div>
        <button className="monitoring-add-btn" onClick={() => setIsModalOpen(true)}>
          <Icon name="plus" />
          Add Website
        </button>
      </div>

      <div className="monitoring-summary">
        {loading ? (
          <>
            <SummarySkeletonCard />
            <SummarySkeletonCard />
            <SummarySkeletonCard />
            <SummarySkeletonCard />
          </>
        ) : (
          <>
            <div className="monitoring-stat-card">
              <div className="monitoring-stat-card__header">
                <div className="monitoring-stat-card__icon monitoring-stat-card__icon--blue">
                  <Icon name="globe" />
                </div>
                <span className="monitoring-stat-card__title">Total Monitored</span>
              </div>
              <div className="monitoring-stat-card__value">{summary.total}</div>
              <div className="monitoring-stat-card__sub">Active websites</div>
            </div>
            
            <div className="monitoring-stat-card">
              <div className="monitoring-stat-card__header">
                <div className="monitoring-stat-card__icon monitoring-stat-card__icon--green">
                  <Icon name="check" />
                </div>
                <span className="monitoring-stat-card__title">Healthy</span>
              </div>
              <div className="monitoring-stat-card__value monitoring-stat-card__value--green">{summary.healthy}</div>
              <div className="monitoring-stat-card__sub">Score ≥ 80</div>
            </div>

            <div className="monitoring-stat-card">
              <div className="monitoring-stat-card__header">
                <div className="monitoring-stat-card__icon monitoring-stat-card__icon--orange">
                  <Icon name="alert" />
                </div>
                <span className="monitoring-stat-card__title">Warnings</span>
              </div>
              <div className="monitoring-stat-card__value monitoring-stat-card__value--orange">{summary.warning}</div>
              <div className="monitoring-stat-card__sub">Needs attention</div>
            </div>

            <div className="monitoring-stat-card">
              <div className="monitoring-stat-card__header">
                <div className="monitoring-stat-card__icon monitoring-stat-card__icon--red">
                  <Icon name="x" />
                </div>
                <span className="monitoring-stat-card__title">Critical</span>
              </div>
              <div className="monitoring-stat-card__value monitoring-stat-card__value--red">{summary.critical}</div>
              <div className="monitoring-stat-card__sub">Action required</div>
            </div>
          </>
        )}
      </div>

      <div className="monitoring-filters">
        <div className="monitoring-search">
          <span className="monitoring-search__icon">
            <Icon name="search" />
          </span>
          <input 
            type="text" 
            className="monitoring-search__input" 
            placeholder="Search websites..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select 
          className="monitoring-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="healthy">Healthy</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
          <option value="pending">Pending</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {loading ? (
        <div className="monitoring-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <MonitoringSkeletonCard key={i} />
          ))}
        </div>
      ) : sites.length === 0 ? (
        <div className="monitoring-empty">
          <div className="monitoring-empty__icon">
            <Icon name="activity" />
          </div>
          <h2 className="monitoring-empty__title">No sites monitored yet</h2>
          <p className="monitoring-empty__desc">
            Add your first website to automatically track its accessibility over time and get alerts when issues are detected.
          </p>
          <button className="monitoring-add-btn" style={{ margin: '0 auto' }} onClick={() => setIsModalOpen(true)}>
            <Icon name="plus" /> Add Website
          </button>
        </div>
      ) : (
        <div className="monitoring-grid">
          {filteredSites.map(site => {
            const siteScans = scansMap[site.id] || [];
            const latestScan = siteScans[0] || null;
            const score = site.score ?? (latestScan?.score ?? null);
            const scoreColor = getScoreColor(score);
            const lastScanLabel = formatRelativeTime(site.last_scan_at);
            const nextScanLabel = formatNextScan(site.next_scan_at);
            const isScanning = scanningId === site.id;
            const isScoreLoading = scansLoading && score === null;

            return (
              <div className="monitoring-card" key={site.id}>
                {/* Card Header */}
                <div className="monitoring-card__header">
                  <div className="monitoring-card__icon">
                    <Icon name="globe" />
                  </div>
                  <div className={`monitoring-badge monitoring-badge--${site.status}`}>
                    {site.status}
                  </div>
                </div>

                {/* URL */}
                <div className="monitoring-card__url" title={site.url}>
                  {site.url.replace(/^https?:\/\//, '')}
                </div>
                
                {/* Meta: frequency & alerts */}
                <div className="monitoring-card__meta">
                  <div className="monitoring-card__meta-item">
                    <Icon name="clock" />
                    {site.frequency}
                  </div>
                  <div className="monitoring-card__meta-item">
                    <Icon name="bell" />
                    {site.alerts_enabled ? 'Alerts On' : 'Alerts Off'}
                  </div>
                </div>

                {/* Score Section */}
                <div className="monitoring-card__score-section">
                  <div className="monitoring-card__score-left">
                    {isScoreLoading ? (
                      <>
                        <div className="skeleton" style={{ width: 52, height: 32, borderRadius: 6, marginBottom: 4 }} />
                        <div className="monitoring-card__score-label">Accessibility Score</div>
                        <div className="skeleton" style={{ width: 84, height: 12, borderRadius: 4, marginTop: 4 }} />
                      </>
                    ) : (
                      <>
                        <div className="monitoring-card__score-val" style={{ color: scoreColor }}>
                          {score !== null ? score : '--'}
                        </div>
                        <div className="monitoring-card__score-label">Accessibility Score</div>
                        {lastScanLabel ? (
                          <div className="monitoring-card__score-time">Last scan: {lastScanLabel}</div>
                        ) : (
                          <div className="monitoring-card__score-time">Initial scan queued</div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="monitoring-card__score-right">
                    {isScoreLoading ? (
                      <div className="skeleton" style={{ width: 56, height: 56, borderRadius: '50%' }} />
                    ) : score !== null ? (
                      <ScoreRing score={score} size={56} />
                    ) : (
                      <div className="monitoring-card__score-ring-placeholder">
                        <span>N/A</span>
                      </div>
                    )}
                    {!isScoreLoading && <MiniSparkline scans={siteScans} />}
                  </div>
                </div>

                {/* Violations Summary */}
                {isScoreLoading ? (
                  <div style={{ display: 'flex', gap: 6, margin: '2px 0' }}>
                    <div className="skeleton" style={{ width: 64, height: 20, borderRadius: 6 }} />
                    <div className="skeleton" style={{ width: 64, height: 20, borderRadius: 6 }} />
                  </div>
                ) : latestScan ? (
                  <div className="monitoring-card__violations">
                    {latestScan.critical_count > 0 && (
                      <span className="monitoring-card__violation-chip monitoring-card__violation-chip--critical">
                        {latestScan.critical_count} critical
                      </span>
                    )}
                    {latestScan.serious_count > 0 && (
                      <span className="monitoring-card__violation-chip monitoring-card__violation-chip--serious">
                        {latestScan.serious_count} serious
                      </span>
                    )}
                    {latestScan.moderate_count > 0 && (
                      <span className="monitoring-card__violation-chip monitoring-card__violation-chip--moderate">
                        {latestScan.moderate_count} moderate
                      </span>
                    )}
                    {latestScan.critical_count === 0 && latestScan.serious_count === 0 && latestScan.moderate_count === 0 && (
                      <span className="monitoring-card__violation-chip monitoring-card__violation-chip--ok">
                        ✓ No major issues
                      </span>
                    )}
                  </div>
                ) : null}

                {/* Next Scan */}
                {nextScanLabel && site.status !== 'paused' && (
                  <div className="monitoring-card__next-scan">
                    <Icon name="clock" />
                    Next scan {nextScanLabel}
                  </div>
                )}
                {site.status === 'paused' && (
                  <div className="monitoring-card__next-scan monitoring-card__next-scan--paused">
                    <Icon name="pause" />
                    Monitoring paused
                  </div>
                )}

                {/* Footer Actions */}
                <div className="monitoring-card__footer">
                  <Link href={`/dashboard/monitoring/${site.id}`} className="monitoring-card__btn monitoring-card__btn--primary">
                    View Detail
                  </Link>
                  <button 
                    className={`monitoring-card__btn-icon ${isScanning ? 'monitoring-card__btn-icon--spinning' : ''}`} 
                    title={isScanning ? 'Scanning...' : 'Scan Now'} 
                    onClick={(e) => handleScanNow(e, site.id)}
                    disabled={isScanning || site.status === 'paused'}
                  >
                    <Icon name="refresh-cw" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="monitoring-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="monitoring-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleAddSite}>
              <div className="monitoring-modal__header">
                <h3 className="monitoring-modal__title">Add Website</h3>
                <button type="button" className="monitoring-modal__close" onClick={() => setIsModalOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>
              <div className="monitoring-modal__body">
                {modalError && (
                  <div className="monitoring-modal__error">
                    <Icon name="alert" />
                    {modalError}
                  </div>
                )}
                
                <div className="monitoring-modal__group">
                  <label className="monitoring-modal__label">Website URL</label>
                  <input 
                    type="url" 
                    className="monitoring-modal__input" 
                    placeholder="https://example.com" 
                    required 
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                  />
                </div>

                <div className="monitoring-modal__group">
                  <label className="monitoring-modal__label">Scan Frequency</label>
                  <select 
                    className="monitoring-modal__select"
                    value={newFrequency}
                    onChange={e => setNewFrequency(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="monitoring-modal__toggle">
                  <div>
                    <div className="monitoring-modal__toggle-label">Email Alerts</div>
                    <div className="monitoring-modal__toggle-desc">Get notified when score drops or new issues appear</div>
                  </div>
                  <div 
                    className={`monitoring-modal__switch ${newAlertsEnabled ? 'monitoring-modal__switch--active' : ''}`}
                    onClick={() => setNewAlertsEnabled(!newAlertsEnabled)}
                  >
                    <div className="monitoring-modal__switch-knob"></div>
                  </div>
                </div>
              </div>
              <div className="monitoring-modal__footer">
                <button type="button" className="monitoring-modal__btn monitoring-modal__btn--cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="monitoring-modal__btn monitoring-modal__btn--submit" disabled={modalLoading}>
                  {modalLoading ? 'Scanning & Adding...' : 'Add Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
