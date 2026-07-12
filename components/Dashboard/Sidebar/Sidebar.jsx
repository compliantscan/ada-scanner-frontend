'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '../Icons/Icons';
import { navItems } from '../MockData/mockData';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function Sidebar({ open, onClose, scansThisMonth = null, monthlyLimit = 100, user = null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);

  // Prefetch all nav routes so clicking is instant
  useEffect(() => {
    navItems.forEach(item => {
      if (item.href) router.prefetch(item.href);
    });
  }, [router]);
  
  // Use real count if provided, fall back to 0 while loading
  const scansUsed = scansThisMonth ?? 0;
  const progressPercent = Math.min(100, (scansUsed / monthlyLimit) * 100);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      // The DashboardProvider listener will redirect to /login
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const userEmail = user?.email || 'No email';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0];
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <>
      <div
        className={`dashboard-sidebar-backdrop ${open ? 'dashboard-sidebar-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`dashboard-sidebar ${open ? 'dashboard-sidebar--open' : ''}`}>

        <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            if (item.id === 'divider') {
              return <hr key="divider" style={{ border: 'none', borderTop: '1px solid var(--color-divider)', margin: '6px 0' }} />;
            }

            const isActive =
              item.id === 'dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href) && item.href !== '/dashboard';

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`dashboard-sidebar__link ${isActive ? 'dashboard-sidebar__link--active' : ''}`}
                onClick={onClose}
              >
                <span className="dashboard-sidebar__link-icon">
                  <Icon name={item.icon} />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-sidebar__plan">
          <p className="dashboard-sidebar__plan-title">Unlock full access</p>
          <p className="dashboard-sidebar__plan-label">
            Create an account to download reports, access all issues, and get AI fixes.
          </p>
          <button type="button" className="dashboard-sidebar__upgrade-btn">
            Get Started
          </button>
        </div>
      </aside>
    </>
  );
}
