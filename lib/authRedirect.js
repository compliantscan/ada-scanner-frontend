const PRODUCTION_SITE_URL = 'https://www.compliantscan.com';

export function getSiteUrl() {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return window.location.origin;
    }
  }

  return (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_SITE_URL).replace(/\/+$/, '');
}

export function safeNextPath(value, fallback = '/dashboard') {
  if (typeof value !== 'string') return fallback;

  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return fallback;
  }

  return path;
}

export function getNextPathFromBrowser(fallback = '/dashboard') {
  if (typeof window === 'undefined') return fallback;
  const params = new URLSearchParams(window.location.search);
  return safeNextPath(params.get('next') || params.get('redirect'), fallback);
}
