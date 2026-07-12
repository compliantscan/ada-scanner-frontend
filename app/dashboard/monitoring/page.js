'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon, { ScoreRing } from '../../../components/Dashboard/Icons/Icons';
import { getCachedSession } from '../../../lib/supabaseClient';
import './monitoring.css';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

// Module-level cache
let _monitoringCache = null;
let _monitoringCacheTime = 0;
const MONITORING_TTL = 30_000;

export default function MonitoringPage() {
  const router = useRouter();
  const [sites, setSites] = useState(() => _monitoringCache?.sites || []);
  const [summary, setSummary] = useState(() => _monitoringCache?.summary || { healthy: 0, warning: 0, critical: 0, total: 0 });
  const [loading, setLoading] = useState(!_monitoringCache);

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
    const now = Date.now();
    if (!force && _monitoringCache && now - _monitoringCacheTime < MONITORING_TTL) {
      setSites(_monitoringCache.sites);
      setSummary(_monitoringCache.summary);
      setLoading(false);
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
      const sites = data.sites || [];
      const summary = data.summary || { healthy: 0, warning: 0, critical: 0, total: 0 };
      _monitoringCache = { sites, summary };
      _monitoringCacheTime = Date.now();
      setSites(sites);
      setSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      fetchSites();
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
        <div className="monitoring-stat-card">
          <div className="monitoring-stat-card__header">
            <div className="monitoring-stat-card__icon monitoring-stat-card__icon--blue">
              <Icon name="globe" />
            </div>
            <span className="monitoring-stat-card__title">Total Monitored</span>
          </div>
          <div className="monitoring-stat-card__value">{summary.total}</div>
        </div>
        
        <div className="monitoring-stat-card">
          <div className="monitoring-stat-card__header">
            <div className="monitoring-stat-card__icon monitoring-stat-card__icon--green">
              <Icon name="check" />
            </div>
            <span className="monitoring-stat-card__title">Healthy</span>
          </div>
          <div className="monitoring-stat-card__value">{summary.healthy}</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-card__header">
            <div className="monitoring-stat-card__icon monitoring-stat-card__icon--orange">
              <Icon name="alert" />
            </div>
            <span className="monitoring-stat-card__title">Warnings</span>
          </div>
          <div className="monitoring-stat-card__value">{summary.warning}</div>
        </div>

        <div className="monitoring-stat-card">
          <div className="monitoring-stat-card__header">
            <div className="monitoring-stat-card__icon monitoring-stat-card__icon--red">
              <Icon name="x" />
            </div>
            <span className="monitoring-stat-card__title">Critical</span>
          </div>
          <div className="monitoring-stat-card__value">{summary.critical}</div>
        </div>
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
        <div>Loading...</div>
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
          {filteredSites.map(site => (
            <div className="monitoring-card" key={site.id}>
              <div className="monitoring-card__header">
                <div className="monitoring-card__icon">
                  <Icon name="globe" />
                </div>
                <div className={`monitoring-badge monitoring-badge--${site.status}`}>
                  {site.status}
                </div>
              </div>

              <div className="monitoring-card__url" title={site.url}>
                {site.url.replace(/^https?:\/\//, '')}
              </div>
              
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

              <div className="monitoring-card__score-section">
                <div>
                  <div className="monitoring-card__score-val">{site.score !== null ? site.score : '--'}</div>
                  <div className="monitoring-card__score-label">Current Score</div>
                </div>
                {site.score !== null && (
                  <ScoreRing score={site.score} size={48} />
                )}
              </div>

              <div className="monitoring-card__footer">
                <Link href={`/dashboard/monitoring/${site.id}`} className="monitoring-card__btn monitoring-card__btn--primary">
                  View Detail
                </Link>
                <button className="monitoring-card__btn-icon" title="Scan Now" onClick={() => router.push(`/dashboard/monitoring/${site.id}`)}>
                  <Icon name="refresh-cw" />
                </button>
              </div>
            </div>
          ))}
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
                  {modalLoading ? 'Adding...' : 'Add Website'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
