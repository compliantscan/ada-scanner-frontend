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
      <Topbar onMenuOpen={() => setSidebarOpen(true)} />

      <div className="agency-dashboard__body">
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
