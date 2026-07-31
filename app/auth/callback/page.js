import { Suspense } from 'react';
import CallbackContent from './CallbackContent';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="auth-shell"><div className="auth-card"><div className="auth-header"><p className="auth-eyebrow">CompliantScan</p><h1>Finishing sign in…</h1><p>We are completing your Google sign-in now.</p></div></div></div>}>
      <CallbackContent />
    </Suspense>
  );
}
