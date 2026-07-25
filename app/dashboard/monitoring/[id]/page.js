'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon, { ScoreRing } from '../../../../components/Dashboard/Icons/Icons';
import { getSupabaseClient } from '../../../../lib/supabaseClient';
import { getApiUrl } from '../../../../lib/apiUrl';
import './detail.css';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

function getScoreColor(score) {
  if (score === null || score === undefined) return 'var(--cs-text-muted)';
  if (score >= 80) return 'var(--cs-green)';
  if (score >= 50) return 'var(--cs-orange)';
  return 'var(--cs-red)';
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Needs Work';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

// SVG trend chart – uses absolute pixel positions only (no % in points)
function TrendChart({ scans }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  if (!scans || scans.length === 0) {
    return (
      <div className="trend-empty">
        <div className="trend-empty__icon"><Icon name="activity" /></div>
        <p>No scan data yet. Run a scan to see your accessibility trend.</p>
      </div>
    );
  }

  // Chart dimensions
  const W = 700;
  const H = 220;
  const PAD_L = 48;  // left padding for Y labels
  const PAD_R = 16;
  const PAD_T = 24;
  const PAD_B = 44;  // bottom padding for X labels
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const reversed = [...scans].reverse(); // oldest → newest

  // Y axis: always 0–100
  const yMin = 0;
  const yMax = 100;

  // Map score to Y pixel (inverted – higher score = lower y)
  const toY = (score) => PAD_T + chartH - ((score - yMin) / (yMax - yMin)) * chartH;
  const toX = (i) => PAD_L + (scans.length === 1 ? chartW / 2 : (i / (reversed.length - 1)) * chartW);

  const points = reversed.map((s, i) => ({ x: toX(i), y: toY(s.score), scan: s, i }));
  const polyPts = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPts = `${points[0].x},${PAD_T + chartH} ${polyPts} ${points[points.length - 1].x},${PAD_T + chartH}`;

  // Y gridlines
  const yGrids = [0, 25, 50, 75, 100];

  // Gradient id (unique to avoid conflicts with other charts)
  const gradId = 'detail-trend-grad';

  return (
    <div className="trend-chart-container" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="trend-chart"
        style={{ overflow: 'visible' }}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cs-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--cs-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines + labels */}
        {yGrids.map(val => {
          const y = toY(val);
          return (
            <g key={val}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--cs-border)" strokeWidth="1" strokeDasharray="4 4" />
              <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="11" fill="var(--cs-text-muted)">{val}</text>
            </g>
          );
        })}

        {/* Area fill */}
        {points.length > 1 && (
          <polygon points={areaPts} fill={`url(#${gradId})`} />
        )}

        {/* Line */}
        {points.length > 1 && (
          <polyline
            points={polyPts}
            fill="none"
            stroke="var(--cs-accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* X-axis labels (dates) */}
        {points.map((p, i) => {
          const label = formatDate(p.scan.created_at);
          // Show fewer labels if many scans
          const show = reversed.length <= 6 || i === 0 || i === reversed.length - 1 || i % Math.ceil(reversed.length / 5) === 0;
          return show ? (
            <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize="10" fill="var(--cs-text-muted)">
              {label}
            </text>
          ) : null;
        })}

        {/* Data points with tooltips */}
        {points.map((p, i) => (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTooltip({ x: p.x, y: p.y, scan: p.scan })}
          >
            <circle cx={p.x} cy={p.y} r="8" fill="transparent" />
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="white"
              stroke="var(--cs-accent)"
              strokeWidth="2.5"
            />
            {/* Score label above point */}
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--cs-accent)">
              {p.scan.score}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="trend-tooltip"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            top: `${(tooltip.y / H) * 100}%`,
            transform: 'translate(-50%, -120%)',
          }}
        >
          <div className="trend-tooltip__score" style={{ color: getScoreColor(tooltip.scan.score) }}>
            Score: {tooltip.scan.score}
          </div>
          <div className="trend-tooltip__date">{formatDateTime(tooltip.scan.created_at)}</div>
          {tooltip.scan.critical_count > 0 && (
            <div className="trend-tooltip__stat trend-tooltip__stat--critical">{tooltip.scan.critical_count} critical</div>
          )}
          {tooltip.scan.serious_count > 0 && (
            <div className="trend-tooltip__stat trend-tooltip__stat--serious">{tooltip.scan.serious_count} serious</div>
          )}
        </div>
      )}
    </div>
  );
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
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, [id]);

  async function fetchData() {
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');

      const headers = { Authorization: `Bearer ${session.access_token}` };

      const res = await fetch(`${getApiUrl()}/dashboard/monitoring/${id}`, { headers });
      if (!res.ok) throw new Error('Failed to load site');
      const data = await res.json();
      
      setSite(data.site);
      setScans(data.scans || []);
      setAlerts(data.alerts || []);

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
      
      setTimeout(() => { fetchData(); setScanning(false); }, 6000);
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

  if (loading) return (
    <div className="detail-page">
      <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 24 }}></div>
      <div className="detail-header">
        <div className="detail-header__left">
          <div className="skeleton" style={{ width: 56, height: 56, borderRadius: 16 }}></div>
          <div>
            <div className="skeleton" style={{ width: 200, height: 32, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: 300, height: 16 }}></div>
          </div>
        </div>
      </div>
      <div className="detail-stats-row">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="detail-stat-card">
            <div className="skeleton" style={{ width: 80, height: 16, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: 40, height: 32, marginBottom: 8 }}></div>
            <div className="skeleton" style={{ width: 60, height: 12 }}></div>
          </div>
        ))}
      </div>
      <div className="detail-card" style={{ height: 400 }}>
        <div className="skeleton" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );

  if (!site) return (
    <div className="detail-page" style={{ padding: 40 }}>
      <p>Site not found.</p>
    </div>
  );

  // Latest scan
  const latestScan = scans[0] || null;
  const score = latestScan?.score ?? null;
  const scoreColor = getScoreColor(score);

  // Score change
  const prevScore = scans[1]?.score ?? null;
  const scoreDiff = (score !== null && prevScore !== null) ? score - prevScore : null;

  return (
    <div className="detail-page">
      {/* Back link */}
      <Link href="/dashboard/monitoring" className="detail-back">
        <Icon name="chevron" style={{ transform: 'rotate(90deg)' }} />
        Back to Monitoring
      </Link>

      {/* Header */}
      <div className="detail-header">
        <div className="detail-header__left">
          <div className="detail-header__icon">
            <Icon name="globe" />
          </div>
          <div>
            <h1 className="detail-title">{site.url.replace(/^https?:\/\//, '')}</h1>
            <div className="detail-meta">
              <span className={`detail-badge detail-badge--${site.status}`}>{site.status}</span>
              <span><Icon name="clock" /> {site.frequency} scan</span>
              <span><Icon name="bell" /> Alerts {site.alerts_enabled ? 'on' : 'off'}</span>
              {site.last_scan_at && <span>Last scanned: {formatRelativeTime(site.last_scan_at)}</span>}
            </div>
          </div>
        </div>
        <div className="detail-header__actions">
          <button className="detail-btn detail-btn--secondary" onClick={handlePauseToggle}>
            <Icon name={site.status === 'paused' ? 'play' : 'pause'} />
            {site.status === 'paused' ? 'Resume' : 'Pause'}
          </button>
          <button className="detail-btn detail-btn--primary" onClick={handleScanNow} disabled={scanning || site.status === 'paused'}>
            <Icon name="refresh-cw" />
            {scanning ? 'Scanning...' : 'Scan Now'}
          </button>
        </div>
      </div>

      {/* Stats Overview Row */}
      <div className="detail-stats-row">
        <div className="detail-stat-card">
          <div className="detail-stat-card__label">Current Score</div>
          <div className="detail-stat-card__value" style={{ color: scoreColor }}>
            {score !== null ? score : '—'}
          </div>
          {score !== null && <div className="detail-stat-card__sub">{getScoreLabel(score)}</div>}
          {scoreDiff !== null && (
            <div className={`detail-stat-card__diff ${scoreDiff > 0 ? 'detail-stat-card__diff--up' : scoreDiff < 0 ? 'detail-stat-card__diff--down' : ''}`}>
              {scoreDiff > 0 ? '↑' : scoreDiff < 0 ? '↓' : '→'} {Math.abs(scoreDiff)} pts vs last scan
            </div>
          )}
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-card__label">Critical Issues</div>
          <div className="detail-stat-card__value detail-stat-card__value--red">
            {latestScan?.critical_count ?? '—'}
          </div>
          <div className="detail-stat-card__sub">Must fix</div>
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-card__label">Serious Issues</div>
          <div className="detail-stat-card__value detail-stat-card__value--orange">
            {latestScan?.serious_count ?? '—'}
          </div>
          <div className="detail-stat-card__sub">Should fix</div>
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-card__label">Moderate Issues</div>
          <div className="detail-stat-card__value detail-stat-card__value--blue">
            {latestScan?.moderate_count ?? '—'}
          </div>
          <div className="detail-stat-card__sub">Consider fixing</div>
        </div>

        <div className="detail-stat-card">
          <div className="detail-stat-card__label">Total Scans</div>
          <div className="detail-stat-card__value">
            {scans.length}
          </div>
          <div className="detail-stat-card__sub">Scan history</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="detail-tabs">
        <button className={`detail-tab ${activeTab === 'overview' ? 'detail-tab--active' : ''}`} onClick={() => setActiveTab('overview')}>
          <Icon name="activity" /> Overview
        </button>
        <button className={`detail-tab ${activeTab === 'history' ? 'detail-tab--active' : ''}`} onClick={() => setActiveTab('history')}>
          <Icon name="clock" /> Scan History
        </button>
        {compareData && (
          <button className={`detail-tab ${activeTab === 'compare' ? 'detail-tab--active' : ''}`} onClick={() => setActiveTab('compare')}>
            <Icon name="layers" /> Comparison
          </button>
        )}
        {alerts.length > 0 && (
          <button className={`detail-tab ${activeTab === 'alerts' ? 'detail-tab--active' : ''}`} onClick={() => setActiveTab('alerts')}>
            <Icon name="bell" /> Alerts <span className="detail-tab__badge">{alerts.filter(a => !a.read).length || alerts.length}</span>
          </button>
        )}
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="detail-tab-content">
          {/* Trend Chart */}
          <div className="detail-card">
            <div className="detail-card__header">
              <h3 className="detail-card__title"><Icon name="activity" /> Accessibility Score Trend</h3>
              {scans.length > 0 && (
                <div className="detail-card__meta">
                  {scans.length} scan{scans.length !== 1 ? 's' : ''} recorded
                </div>
              )}
            </div>
            <TrendChart scans={scans} />
          </div>

          {/* Score + Quick Info */}
          <div className="detail-overview-grid">
            {/* Score Ring Card */}
            <div className="detail-card detail-card--score">
              {score !== null ? (
                <ScoreRing score={score} size={140} />
              ) : (
                <div className="detail-score-placeholder">—</div>
              )}
              <h3 className="detail-score-status">
                {site.status === 'healthy' ? '✓ Looking Good!' :
                 site.status === 'warning' ? '⚠ Needs Attention' :
                 site.status === 'critical' ? '✗ Action Required' :
                 site.status === 'paused' ? '⏸ Paused' : 'Pending First Scan'}
              </h3>
              <p className="detail-score-sub">
                {score !== null ? getScoreLabel(score) + ' accessibility' : 'Run a scan to get your score'}
              </p>
              <div className="detail-score-meta">
                <div className="detail-score-meta-item">
                  <Icon name="clock" />
                  <span>Scans {site.frequency}</span>
                </div>
                {site.last_scan_at && (
                  <div className="detail-score-meta-item">
                    <Icon name="check" />
                    <span>{formatDate(site.last_scan_at)}</span>
                  </div>
                )}
              </div>
              <button className="detail-btn detail-btn--secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                <Icon name="download" /> Export Report
              </button>
            </div>

            {/* Violations Breakdown */}
            {latestScan && (
              <div className="detail-card">
                <h3 className="detail-card__title"><Icon name="alert" /> Latest Violations Breakdown</h3>
                <div className="detail-violations">
                  {[
                    { label: 'Critical', count: latestScan.critical_count, colorClass: 'critical', desc: 'Accessibility blockers — must fix immediately' },
                    { label: 'Serious', count: latestScan.serious_count, colorClass: 'serious', desc: 'Major barriers for users with disabilities' },
                    { label: 'Moderate', count: latestScan.moderate_count, colorClass: 'moderate', desc: 'Significant but not blocking' },
                    { label: 'Minor', count: latestScan.minor_count, colorClass: 'minor', desc: 'Best practice improvements' },
                  ].map(({ label, count, colorClass, desc }) => (
                    <div key={label} className="detail-violation-row">
                      <div className="detail-violation-row__left">
                        <span className={`detail-violation-dot detail-violation-dot--${colorClass}`} />
                        <div>
                          <div className="detail-violation-row__label">{label}</div>
                          <div className="detail-violation-row__desc">{desc}</div>
                        </div>
                      </div>
                      <div className={`detail-violation-row__count detail-violation-row__count--${colorClass}`}>
                        {count ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="detail-scan-info">
                  <Icon name="clock" />
                  Scan on {formatDateTime(latestScan.created_at)}
                  {latestScan.pages_scanned > 0 && ` · ${latestScan.pages_scanned} page${latestScan.pages_scanned !== 1 ? 's' : ''} scanned`}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Scan History */}
      {activeTab === 'history' && (
        <div className="detail-tab-content">
          <div className="detail-card">
            <h3 className="detail-card__title"><Icon name="clock" /> Scan History</h3>
            {scans.length === 0 ? (
              <div className="detail-empty">No scans performed yet. Click "Scan Now" to run your first scan.</div>
            ) : (
              <div className="detail-history-table">
                <div className="detail-history-table__head">
                  <div>Date & Time</div>
                  <div>Score</div>
                  <div>Critical</div>
                  <div>Serious</div>
                  <div>Moderate</div>
                  <div>Minor</div>
                  <div>Pages</div>
                </div>
                {scans.map((scan, i) => {
                  const prevScan = scans[i + 1];
                  const diff = prevScan ? scan.score - prevScan.score : null;
                  return (
                    <div key={scan.id} className={`detail-history-table__row ${i === 0 ? 'detail-history-table__row--latest' : ''}`}>
                      <div className="detail-history-table__cell--date">
                        {formatDateTime(scan.created_at)}
                        {i === 0 && <span className="detail-history-latest-badge">Latest</span>}
                      </div>
                      <div className="detail-history-table__cell--score">
                        <span style={{ color: getScoreColor(scan.score), fontWeight: 700 }}>{scan.score}</span>
                        {diff !== null && (
                          <span className={`detail-history-diff ${diff > 0 ? 'detail-history-diff--up' : diff < 0 ? 'detail-history-diff--down' : ''}`}>
                            {diff > 0 ? '↑' : diff < 0 ? '↓' : '→'}{Math.abs(diff)}
                          </span>
                        )}
                      </div>
                      <div><span className="detail-history-count detail-history-count--critical">{scan.critical_count ?? 0}</span></div>
                      <div><span className="detail-history-count detail-history-count--serious">{scan.serious_count ?? 0}</span></div>
                      <div><span className="detail-history-count detail-history-count--moderate">{scan.moderate_count ?? 0}</span></div>
                      <div><span className="detail-history-count detail-history-count--minor">{scan.minor_count ?? 0}</span></div>
                      <div>{scan.pages_scanned ?? 1}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Compare */}
      {activeTab === 'compare' && compareData && (
        <div className="detail-tab-content">
          <div className="detail-card">
            <h3 className="detail-card__title"><Icon name="layers" /> Scan Comparison</h3>

            <div className="compare-grid">
              {[
                { label: 'Previous Scan', data: compareData.previous, dim: true },
                { label: 'Latest Scan', data: compareData.current, dim: false },
              ].map(({ label, data, dim }) => (
                <div key={label} className={`compare-box ${dim ? 'compare-box--dim' : 'compare-box--highlight'}`}>
                  <div className="compare-box__label">{label}</div>
                  <div className="compare-box__date">{formatDate(data.created_at)}</div>
                  <div className="compare-box__score" style={{ color: getScoreColor(data.score) }}>
                    {data.score}
                  </div>
                  <div className="compare-box__stats">
                    <span className="compare-box__stat compare-box__stat--critical"><Icon name="alert" /> {data.critical_count} critical</span>
                    <span className="compare-box__stat compare-box__stat--serious"><Icon name="alert" /> {data.serious_count} serious</span>
                    {data.moderate_count > 0 && <span className="compare-box__stat"><Icon name="alert" /> {data.moderate_count} moderate</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="compare-summary">
              {compareData.scoreDiff > 0 && <span className="compare-summary__good">↑ Score improved by {compareData.scoreDiff} points. </span>}
              {compareData.scoreDiff < 0 && <span className="compare-summary__bad">↓ Score dropped by {Math.abs(compareData.scoreDiff)} points. </span>}
              {compareData.scoreDiff === 0 && <span>Score unchanged. </span>}
              {compareData.newIssues.length > 0 && <span className="compare-summary__bad">{compareData.newIssues.length} new issue{compareData.newIssues.length !== 1 ? 's' : ''} introduced. </span>}
              {compareData.fixedIssues.length > 0 && <span className="compare-summary__good">{compareData.fixedIssues.length} issue{compareData.fixedIssues.length !== 1 ? 's' : ''} fixed.</span>}
            </div>

            <div className="compare-issues-grid">
              <div>
                <h4 className="compare-issues-title compare-issues-title--bad">
                  <Icon name="alert" /> New Issues ({compareData.newIssues.length})
                </h4>
                {compareData.newIssues.length === 0 ? (
                  <div className="compare-issues-empty compare-issues-empty--good">✓ No new issues detected</div>
                ) : (
                  <div className="issues-list">
                    {compareData.newIssues.slice(0, 8).map((issue, idx) => (
                      <div key={idx} className="issue-item">
                        <div className={`issue-item__icon issue-item__icon--${issue.impact}`}>
                          <Icon name="alert" />
                        </div>
                        <div className="issue-item__content">
                          <div className="issue-item__title">{issue.help}</div>
                          <div className="issue-item__meta">
                            <span className={`issue-item__impact issue-item__impact--${issue.impact}`}>
                              {issue.impact}
                            </span>
                            {issue.id && <span className="issue-item__rule">{issue.id}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {compareData.newIssues.length > 8 && (
                      <div className="issues-more">+{compareData.newIssues.length - 8} more issues</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="compare-issues-title compare-issues-title--good">
                  <Icon name="check" /> Fixed Issues ({compareData.fixedIssues.length})
                </h4>
                {compareData.fixedIssues.length === 0 ? (
                  <div className="compare-issues-empty">No issues were fixed since last scan.</div>
                ) : (
                  <div className="issues-list">
                    {compareData.fixedIssues.slice(0, 8).map((issue, idx) => (
                      <div key={idx} className="issue-item">
                        <div className="issue-item__icon issue-item__icon--fixed">
                          <Icon name="check" />
                        </div>
                        <div className="issue-item__content">
                          <div className="issue-item__title">{issue.help}</div>
                          <div className="issue-item__meta">
                            <span className={`issue-item__impact issue-item__impact--${issue.impact}`}>
                              {issue.impact}
                            </span>
                            {issue.id && <span className="issue-item__rule">{issue.id}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    {compareData.fixedIssues.length > 8 && (
                      <div className="issues-more">+{compareData.fixedIssues.length - 8} more fixed</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Alerts */}
      {activeTab === 'alerts' && (
        <div className="detail-tab-content">
          <div className="detail-card">
            <h3 className="detail-card__title"><Icon name="bell" /> Alerts</h3>
            {alerts.length === 0 ? (
              <div className="detail-empty">No alerts for this site.</div>
            ) : (
              <div className="detail-alerts-list">
                {alerts.map(alert => (
                  <div key={alert.id} className={`detail-alert-item ${alert.read ? 'detail-alert-item--read' : ''}`}>
                    <div className={`detail-alert-item__icon detail-alert-item__icon--${alert.severity}`}>
                      <Icon name="bell" />
                    </div>
                    <div className="detail-alert-item__content">
                      <div className="detail-alert-item__message">{alert.message}</div>
                      <div className="detail-alert-item__meta">
                        <span className={`detail-alert-badge detail-alert-badge--${alert.severity}`}>{alert.severity}</span>
                        <span>{formatRelativeTime(alert.created_at)}</span>
                        {alert.read && <span className="detail-alert-read">Read</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
