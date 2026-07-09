'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function DashboardBillingPage() {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    };

    verifySession();
  }, [router]);

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-eyebrow">CompliantScan</p>
          <h1>Billing</h1>
          <p>Subscription management will appear here.</p>
        </div>
      </div>
    </main>
  );
}
