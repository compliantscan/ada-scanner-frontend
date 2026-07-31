import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

const AUTH_PAGES = new Set(['/login', '/signup']);
const PRODUCTION_SITE_URL = 'https://www.compliantscan.com';

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;
  const hasOAuthResponse =
    request.nextUrl.searchParams.has('code') ||
    request.nextUrl.searchParams.has('error');

  // Supabase falls back to its configured Site URL when a redirect allowlist is
  // incomplete. Move the one-time PKCE code—not an access token—to the canonical
  // callback before any page renders.
  if (
    hasOAuthResponse &&
    pathname !== '/auth/callback' &&
    (hostname.endsWith('.vercel.app') || pathname === '/')
  ) {
    const callbackUrl = new URL('/auth/callback', PRODUCTION_SITE_URL);
    request.nextUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const requiresUser =
    pathname.startsWith('/dashboard') ||
    pathname === '/billing' ||
    pathname === '/auth/reset-password';

  if (requiresUser && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_PAGES.has(pathname) && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    dashboardUrl.search = '';
    return NextResponse.redirect(dashboardUrl);
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/billing', '/auth/reset-password', '/login', '/signup'],
};
