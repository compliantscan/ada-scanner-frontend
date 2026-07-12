'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { getSupabaseClient, getCachedSession } from '../../lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const dashboardData = useDashboardData();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Background refetch when returning to /dashboard (keeps existing data visible)
  useEffect(() => {
    if (pathname === '/dashboard') {
      dashboardData.refetch({ background: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    getCachedSession().then((session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        router.push('/login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <DashboardContext.Provider value={{ ...dashboardData, user }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error('useDashboard must be used inside <DashboardProvider>');
  }
  return ctx;
}
