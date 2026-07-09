'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function DashboardAccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState('your account');

  useEffect(() => {
    const loadSession = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace('/login');
          return;
        }

        setEmail(session.user?.email || 'your account');
      } catch (error) {
        router.replace('/login');
      }
    };

    loadSession();
  }, [router]);

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">CompliantScan</p>
          <h1>Account</h1>
          <p>Signed in as: {email}</p>
        </div>
      </div>
    </main>
  );
}
