'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../Icons/Icons';
import { useDashboard } from '../../../app/context/DashboardContext';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function Topbar() {
  const { user } = useDashboard();
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef(null);

  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || userEmail.split('@')[0] || 'User';
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userAvatar = user?.user_metadata?.avatar_url;

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  };

  return (
    <header className="dashboard-topbar">
      <a href="/dashboard" className="dashboard-topbar__logo">
        <span className="dashboard-topbar__logo-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="dashboard-topbar__logo-text">CompliantScan</span>
      </a>

      <div className="dashboard-topbar__actions-row">
        {/* Notification bell */}
        <button type="button" className="dashboard-topbar__icon-btn" style={{ position: 'relative' }} aria-label="Notifications">
          <Icon name="bell" />
          <span style={{ position: 'absolute', top: 8, right: 10, width: 6, height: 6, backgroundColor: '#dc2626', borderRadius: '50%' }}></span>
        </button>

        {/* New Scan */}
        <button
          type="button"
          className="dashboard-topbar__new-scan"
          onClick={() => router.push('/dashboard/scan')}
        >
          <Icon name="plus" />
          New Scan
        </button>

        {/* Avatar */}
        <div className="dashboard-topbar__avatar-wrap" ref={popupRef}>
          <button
            type="button"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={() => setPopupOpen(!popupOpen)}
            aria-label="Account menu"
          >
            <div className="dashboard-topbar__avatar">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="dashboard-topbar__avatar-img" />
              ) : (
                userInitials
              )}
            </div>
            <Icon name="chevron" />
          </button>

          {popupOpen && (
            <div className="dashboard-topbar__avatar-popup">
              <div className="dashboard-topbar__avatar-popup-info">
                <div className="dashboard-topbar__avatar-popup-name">{userName}</div>
                <div className="dashboard-topbar__avatar-popup-email">{userEmail}</div>
              </div>
              <hr className="dashboard-topbar__avatar-popup-divider" />
              <button className="dashboard-topbar__avatar-popup-item" onClick={() => { setPopupOpen(false); router.push('/dashboard/account'); }}>
                <Icon name="user" />
                Account
              </button>
              <button className="dashboard-topbar__avatar-popup-item" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
