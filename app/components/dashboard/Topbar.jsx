'use client';

import Icon from './Icons';
import { useDashboard } from '../../context/DashboardContext';

export default function Topbar({ showWelcome = true }) {
  const { user } = useDashboard();

  // Extract user name from Supabase user object
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'User';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <header className="dashboard-topbar">
      {showWelcome ? (
        <div className="dashboard-topbar__left">
          <span className="dashboard-topbar__badge">Agency Dashboard</span>
          <h1 className="dashboard-topbar__title">
            Welcome back, {userName} 👋
          </h1>
          <p className="dashboard-topbar__subtitle">
            Scan websites, generate reports, and make the web accessible for everyone.
          </p>
        </div>
      ) : (
        <div className="dashboard-topbar__left">
          <span className="dashboard-topbar__badge">Agency Dashboard</span>
        </div>
      )}

      <div className="dashboard-topbar__actions">
        <div className="dashboard-topbar__actions-row">
          <button type="button" className="dashboard-topbar__pill-btn">
            What&apos;s new
            <span className="dashboard-topbar__notify-dot" />
          </button>
          <button type="button" className="dashboard-topbar__icon-btn" aria-label="Help">
            <Icon name="help" />
          </button>
          <button type="button" className="dashboard-topbar__icon-btn" aria-label="Notifications">
            <Icon name="bell" />
            <span className="dashboard-topbar__bell-badge">3</span>
          </button>
          <div className="dashboard-sidebar__avatar">{userInitials}</div>
        </div>
        <button type="button" className="dashboard-topbar__new-scan">
          <Icon name="plus" />
          New Scan
        </button>
      </div>
    </header>
  );
}