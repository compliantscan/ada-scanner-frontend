/**
 * Shared API URL utility.
 * Returns the backend base URL, stripping any trailing slash.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_API_URL environment variable (set in Vercel / .env.local)
 *  2. http://localhost:3001 when running on localhost
 *  3. Logs a warning and returns '' (avoids crashing the page in production
 *     if the env var was accidentally removed — the fetch will simply fail
 *     with a user-visible error instead of a blank white screen).
 */
export function getApiUrl() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url.replace(/\/$/, '');

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3001';
  }

  // Production fallback — should never be reached if Vercel env is configured
  console.warn('[getApiUrl] NEXT_PUBLIC_API_URL is not set. API calls will fail.');
  return '';
}
