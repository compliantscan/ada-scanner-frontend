import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { safeNextPath } from '@/lib/authRedirect';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const authError = requestUrl.searchParams.get('error');
  const next = safeNextPath(requestUrl.searchParams.get('next'), '/dashboard');
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin).replace(/\/+$/, '');

  if (authError || !code) {
    return NextResponse.redirect(`${siteUrl}/login?error=oauth_failed`);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(`${siteUrl}/login?error=oauth_failed`);
    }

    return NextResponse.redirect(`${siteUrl}${next}`);
  } catch {
    return NextResponse.redirect(`${siteUrl}/login?error=oauth_failed`);
  }
}
