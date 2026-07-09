'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

function getApiUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  return window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : window.location.origin;
}

/**
 * Fetches aggregated dashboard stats from the backend.
 * - Sends the Supabase session token (user-scoped data).
 * - Uses cache:'no-store' to always get fresh data.
 * - Refetches on window focus so returning from another tab/page is fresh.
 * Returns { data, loading, error, refetch }.
 */
export function useDashboardData() {
  const [data, setData] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const lastFetchedRef = useRef(0);

  const fetchStats = useCallback(async ({ background = false } = {}) => {
    const hasData = lastFetchedRef.current > 0;
    if (background || hasData) {
      setIsRefreshing(true);
    } else {
      setIsInitialLoading(true);
    }
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsInitialLoading(false);
        setIsRefreshing(false);
        return;
      }

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || `Server returned ${response.status}`);
      }

      const payload = await response.json();
      setData(payload);
      setError(null);
      lastFetchedRef.current = Date.now();
    } catch (err) {
      console.error('[Dashboard] Failed to load stats:', err.message);
      // Only replace data with error if we have nothing to show
      if (!lastFetchedRef.current) {
        setError(err.message || 'Could not load dashboard data. Please refresh.');
      }
    } finally {
      setIsInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Refetch on window focus with 15s freshness guard
  useEffect(() => {
    function handleFocus() {
      if (Date.now() - lastFetchedRef.current > 15000) {
        fetchStats({ background: true });
      }
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchStats]);

  return { data, isInitialLoading, isRefreshing, error, refetch: fetchStats };
}
