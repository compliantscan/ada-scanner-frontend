# Environment Variables Required

## NEXT_PUBLIC_API_URL
Backend API URL for scan endpoint
- Example: https://your-backend.railway.app
- Default: Falls back to window.location.origin in browser

## NEXT_PUBLIC_FORMSPREE_URL
Formspree endpoint URL for contact form submissions
- Example: https://formspree.io/f/your-form-id
- Required for contact form to function
- Get your form endpoint from https://formspree.io after creating an account

## Supabase Auth (frontend)
Required for the browser-side Supabase client:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Example:
- NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

Google OAuth note:
- Google OAuth client ID and secret are configured in Supabase dashboard auth provider settings.
- Do not store those in frontend/backend app env files.
- The service role key must never be exposed to frontend code. The service role key belongs only in backend environment variables.
