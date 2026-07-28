'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '../../../components/Dashboard/Icons/Icons';
import { useDashboard } from '../../context/DashboardContext';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import './account.css';

export default function DashboardAccountPage() {
  const router = useRouter();
  const { user } = useDashboard();

  // Active Tab: 'profile' | 'security' | 'notifications' | 'billing'
  const [activeTab, setActiveTab] = useState('profile');

  // Form State - Profile
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [profileLoading, setProfileLoading] = useState(false);

  // Form State - Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  // Form State - Notifications
  const [notifAuditDigest, setNotifAuditDigest] = useState(true);
  const [notifScoreAlerts, setNotifScoreAlerts] = useState(true);
  const [notifProductUpdates, setNotifProductUpdates] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Alert Banner Feedback
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Sync user state on load
  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setFullName(meta.full_name || meta.name || '');
      setCompanyName(meta.company_name || meta.company || '');
      setRole(meta.role || 'Agency Manager');
      setTimezone(meta.timezone || 'UTC');

      if (meta.notifications) {
        setNotifAuditDigest(meta.notifications.auditDigest ?? true);
        setNotifScoreAlerts(meta.notifications.scoreAlerts ?? true);
        setNotifProductUpdates(meta.notifications.productUpdates ?? false);
      }
    }
  }, [user]);

  const userEmail = user?.email || '';
  const userInitials = (fullName || userEmail.split('@')[0] || 'US').substring(0, 2).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url;

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 4000);
  };

  // 1. Save Profile Details
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          name: fullName,
          company_name: companyName,
          company: companyName,
          role,
          timezone,
        },
      });

      if (error) throw error;
      showAlert('success', 'Profile information updated successfully!');
    } catch (err) {
      showAlert('error', err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // 2. Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showAlert('error', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert('error', 'New passwords do not match.');
      return;
    }

    setSecurityLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showAlert('success', 'Password changed successfully!');
    } catch (err) {
      showAlert('error', err.message || 'Failed to change password.');
    } finally {
      setSecurityLoading(false);
    }
  };

  // 3. Save Notification Preferences
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setNotifLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: {
            auditDigest: notifAuditDigest,
            scoreAlerts: notifScoreAlerts,
            productUpdates: notifProductUpdates,
          },
        },
      });

      if (error) throw error;
      showAlert('success', 'Notification preferences saved!');
    } catch (err) {
      showAlert('error', err.message || 'Failed to save preferences.');
    } finally {
      setNotifLoading(false);
    }
  };

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <h1 className="account-title">Account Settings</h1>
        <p className="account-subtitle">Manage your personal profile, security preferences, and agency details.</p>
      </div>

      {/* Profile Overview Card */}
      <div className="account-profile-card">
        <div className="account-profile-left">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName || 'User'} className="account-avatar-large" />
          ) : (
            <div className="account-avatar-large">{userInitials}</div>
          )}

          <div className="account-profile-info">
            <div className="account-profile-name">{fullName || 'Agency Member'}</div>
            <div className="account-profile-email">
              {userEmail}
              <span className="account-badge-verified">
                <Icon name="check" /> Verified
              </span>
            </div>
          </div>
        </div>

        <div className="account-plan-badge">
          <div>
            <div className="account-plan-badge__title">Current Plan</div>
            <div className="account-plan-badge__val">Agency Pro</div>
          </div>
          <Link href="/dashboard/billing" className="account-btn-secondary" style={{ height: 36, fontSize: 13 }}>
            Manage Billing
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      {alert.message && (
        <div className={`account-alert account-alert--${alert.type}`}>
          <Icon name={alert.type === 'success' ? 'check' : 'alert'} />
          <span>{alert.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="account-tabs">
        <button
          className={`account-tab-btn ${activeTab === 'profile' ? 'account-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <Icon name="user" /> Profile
        </button>

        <button
          className={`account-tab-btn ${activeTab === 'security' ? 'account-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Icon name="lock" /> Security & Password
        </button>

        <button
          className={`account-tab-btn ${activeTab === 'notifications' ? 'account-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Icon name="bell" /> Notifications
        </button>

        <button
          className={`account-tab-btn ${activeTab === 'billing' ? 'account-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          <Icon name="credit-card" /> Plan & Usage
        </button>
      </div>

      {/* Main Content Card */}
      <div className="account-content-card">
        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile}>
            <div className="account-section-header">
              <h2 className="account-section-title">Personal Information</h2>
              <p className="account-section-desc">Update your profile details and agency representation.</p>
            </div>

            <div className="account-form-grid">
              <div className="account-form-group">
                <label className="account-label">Full Name</label>
                <input
                  type="text"
                  className="account-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                />
              </div>

              <div className="account-form-group">
                <label className="account-label">Email Address</label>
                <input
                  type="email"
                  className="account-input"
                  value={userEmail}
                  disabled
                  title="Email cannot be changed directly"
                />
                <span className="account-input-hint">Your login email address</span>
              </div>

              <div className="account-form-group">
                <label className="account-label">Agency / Company Name</label>
                <input
                  type="text"
                  className="account-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Digital Agency"
                />
              </div>

              <div className="account-form-group">
                <label className="account-label">Role / Position</label>
                <input
                  type="text"
                  className="account-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Accessibility Consultant"
                />
              </div>

              <div className="account-form-group account-form-group--full">
                <label className="account-label">Timezone</label>
                <select
                  className="account-select"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="Europe/London">London (GMT / BST)</option>
                  <option value="Europe/Paris">Paris, Berlin, Madrid</option>
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <div className="account-form-actions">
              <button type="submit" className="account-btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword}>
            <div className="account-section-header">
              <h2 className="account-section-title">Security & Password</h2>
              <p className="account-section-desc">Ensure your agency account remains safe and protected.</p>
            </div>

            <div className="account-form-grid">
              <div className="account-form-group account-form-group--full">
                <label className="account-label">New Password</label>
                <input
                  type="password"
                  className="account-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <span className="account-input-hint">Minimum 6 characters long</span>
              </div>

              <div className="account-form-group account-form-group--full">
                <label className="account-label">Confirm New Password</label>
                <input
                  type="password"
                  className="account-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div className="account-form-actions">
              <button type="submit" className="account-btn-primary" disabled={securityLoading}>
                {securityLoading ? 'Updating password...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <form onSubmit={handleSaveNotifications}>
            <div className="account-section-header">
              <h2 className="account-section-title">Notification Preferences</h2>
              <p className="account-section-desc">Choose which updates and audit reports you receive in your inbox.</p>
            </div>

            <div className="account-toggle-list">
              <div className="account-toggle-row">
                <div className="account-toggle-info">
                  <div className="account-toggle-title">Weekly Audit Digest</div>
                  <div className="account-toggle-desc">Receive a weekly summary of compliance scores across all client sites.</div>
                </div>
                <div
                  className={`account-switch ${notifAuditDigest ? 'account-switch--active' : ''}`}
                  onClick={() => setNotifAuditDigest(!notifAuditDigest)}
                >
                  <div className="account-switch-knob" />
                </div>
              </div>

              <div className="account-toggle-row">
                <div className="account-toggle-info">
                  <div className="account-toggle-title">Score Drop & Critical Alerts</div>
                  <div className="account-toggle-desc">Get notified immediately when a client site score drops or critical WCAG issues emerge.</div>
                </div>
                <div
                  className={`account-switch ${notifScoreAlerts ? 'account-switch--active' : ''}`}
                  onClick={() => setNotifScoreAlerts(!notifScoreAlerts)}
                >
                  <div className="account-switch-knob" />
                </div>
              </div>

              <div className="account-toggle-row">
                <div className="account-toggle-info">
                  <div className="account-toggle-title">Product & Feature Updates</div>
                  <div className="account-toggle-desc">Stay informed about new WCAG 2.2 scanning capabilities and agency tool improvements.</div>
                </div>
                <div
                  className={`account-switch ${notifProductUpdates ? 'account-switch--active' : ''}`}
                  onClick={() => setNotifProductUpdates(!notifProductUpdates)}
                >
                  <div className="account-switch-knob" />
                </div>
              </div>
            </div>

            <div className="account-form-actions">
              <button type="submit" className="account-btn-primary" disabled={notifLoading}>
                {notifLoading ? 'Saving preferences...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Billing & Plan */}
        {activeTab === 'billing' && (
          <div>
            <div className="account-section-header">
              <h2 className="account-section-title">Subscription Overview</h2>
              <p className="account-section-desc">View your active plan, audit limits, and billing details.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#f8fafd', padding: 20, borderRadius: 16, border: '1px solid #ededed' }}>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Plan Tier</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#121212' }}>Agency Pro</div>
              </div>

              <div style={{ background: '#f8fafd', padding: 20, borderRadius: 16, border: '1px solid #ededed' }}>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Monthly Audit Limit</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#16a34a' }}>100 Scans / mo</div>
              </div>

              <div style={{ background: '#f8fafd', padding: 20, borderRadius: 16, border: '1px solid #ededed' }}>
                <div style={{ fontSize: 12, color: '#666', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Status</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#4b6bfb' }}>Active Subscription</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #ededed' }}>
              <Link href="/dashboard/billing" className="account-btn-primary">
                <Icon name="credit-card" /> Go to Billing & Invoices
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
