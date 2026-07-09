'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icons';
import { navItems } from './mockData';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function Sidebar({ open, onClose, scansThisMonth = null, monthlyLimit = 100, user = null }) {
  const pathname = usePathname();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);
  
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
        <Link href="/dashboard" className="dashboard-sidebar__logo">
          <span className="dashboard-sidebar__logo-icon">
            <Icon name="shield" />
          </span>
          <span className="dashboard-sidebar__logo-text">CompliantScan</span>
        </Link>

        <nav className="dashboard-sidebar__nav" aria-label="Dashboard navigation">
          {navItems.map((item) => {
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
          <div className="dashboard-sidebar__plan-badge">
            <span className="dashboard-sidebar__plan-badge-dot" />
            Agency Plan / Founding Member
          </div>
          <p className="dashboard-sidebar__plan-label">
            Scans this month:{' '}
            {scansThisMonth === null ? (
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '28px',
                  height: '12px',
                  borderRadius: '4px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                  verticalAlign: 'middle',
                }}
              />
            ) : (
              <>{scansUsed} / {monthlyLimit}</>
            )}
          </p>
          <div className="dashboard-sidebar__plan-progress">
            <div
              className="dashboard-sidebar__plan-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button type="button" className="dashboard-sidebar__upgrade-btn">
            Upgrade Plan
          </button>
        </div>

        <div className="dashboard-sidebar__user-container" ref={popupRef}>
          {popupOpen && (
            <div className="dashboard-sidebar__user-popup">
              <button className="dashboard-sidebar__user-popup-item" onClick={handleLogout}>
                <span className="dashboard-sidebar__user-popup-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </span>
                Log out
              </button>
            </div>
          )}
          <div className="dashboard-sidebar__user" onClick={() => setPopupOpen(!popupOpen)}>
            <div className="dashboard-sidebar__avatar">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="dashboard-sidebar__avatar-img" />
              ) : (
                userInitials
              )}
            </div>
            <div className="dashboard-sidebar__user-info">
              <div className="dashboard-sidebar__user-name" title={userName}>{userName}</div>
              <div className="dashboard-sidebar__user-email" title={userEmail}>{userEmail}</div>
            </div>
            <span className="dashboard-sidebar__user-chevron">
              <Icon name="chevron" />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
