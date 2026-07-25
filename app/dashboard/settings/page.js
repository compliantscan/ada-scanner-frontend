'use client';

import { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import Icon from '../../../components/Dashboard/Icons/Icons';

export default function SettingsPage() {
  const { user } = useDashboard();

  const [notifications, setNotifications] = useState({
    scanComplete: true,
    weeklyReport: false,
    monitoringAlerts: true,
    productUpdates: false,
  });

  const [saved, setSaved] = useState(false);

  function toggleNotification(key) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--cs-text)' }}>Settings</h1>
        <p style={{ fontSize: 14, color: 'var(--cs-text-muted)', margin: '6px 0 0' }}>
          Manage your preferences and notification settings.
        </p>
      </div>

      {/* Profile section */}
      <section
        style={{
          background: 'var(--cs-card)',
          border: '1px solid var(--cs-border)',
          borderRadius: 'var(--cs-radius-md)',
          padding: '28px 32px',
          marginBottom: 20,
          boxShadow: 'var(--cs-shadow-soft)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', color: 'var(--cs-text)' }}>
          <Icon name="user" style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Profile
        </h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Email</label>
            <div style={readonlyStyle}>{user?.email || '—'}</div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Account ID</label>
            <div style={readonlyStyle}>{user?.id ? user.id.slice(0, 12) + '…' : '—'}</div>
          </div>
        </div>
      </section>

      {/* Notification preferences */}
      <section
        style={{
          background: 'var(--cs-card)',
          border: '1px solid var(--cs-border)',
          borderRadius: 'var(--cs-radius-md)',
          padding: '28px 32px',
          marginBottom: 20,
          boxShadow: 'var(--cs-shadow-soft)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 20px', color: 'var(--cs-text)' }}>
          <Icon name="bell" style={{ marginRight: 8, verticalAlign: 'middle' }} />
          Notification Preferences
        </h2>
        {[
          { key: 'scanComplete', label: 'Scan complete', description: 'Receive an email when a scan finishes' },
          { key: 'weeklyReport', label: 'Weekly summary', description: 'Get a weekly digest of your accessibility scores' },
          { key: 'monitoringAlerts', label: 'Monitoring alerts', description: 'Be notified when a monitored site\u2019s score changes' },
          { key: 'productUpdates', label: 'Product updates', description: 'Hear about new features and improvements' },
        ].map(({ key, label, description }) => (
          <div key={key} style={toggleRowStyle}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text)' }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--cs-text-muted)', marginTop: 2 }}>{description}</div>
            </div>
            <button
              type="button"
              onClick={() => toggleNotification(key)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                background: notifications[key] ? 'var(--cs-accent)' : '#d1d5db',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
              aria-label={`Toggle ${label}`}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: notifications[key] ? 22 : 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  transition: 'left 0.2s',
                }}
              />
            </button>
          </div>
        ))}
      </section>

      {/* Save button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        {saved && (
          <span style={{ fontSize: 13, color: 'var(--cs-green)', alignSelf: 'center', fontWeight: 600 }}>
            ✓ Settings saved
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          style={{
            padding: '10px 24px',
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
            background: 'var(--cs-gradient-cta)',
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            transition: 'opacity 0.15s',
          }}
        >
          Save Changes
        </button>
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--cs-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 6,
};

const readonlyStyle = {
  padding: '10px 14px',
  borderRadius: 10,
  background: 'var(--cs-bg)',
  border: '1px solid var(--cs-border)',
  fontSize: 14,
  color: 'var(--cs-text-secondary)',
  userSelect: 'all',
};

const toggleRowStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '14px 0',
  borderBottom: '1px solid var(--cs-border)',
};
