'use client';

import { useState } from 'react';
import './dashboard.css';
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar';
import Topbar from '../../components/Dashboard/Topbar/Topbar';
import Icon from '../../components/Dashboard/Icons/Icons';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';

// Inner layout that reads from context
function DashboardLayoutInner({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, user } = useDashboard();

  return (
    <div className="agency-dashboard">
      <Topbar />

      <div className="agency-dashboard__body">
        <button
          type="button"
          className="dashboard-mobile-toggle"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Icon name="menu" />
        </button>

        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          scansThisMonth={data?.scansThisMonth ?? null}
          monthlyLimit={data?.monthlyLimit ?? 100}
          user={user}
        />

        <div className="agency-dashboard__main">{children}</div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardProvider>
  );
}
