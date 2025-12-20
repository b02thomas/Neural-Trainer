import { createClient } from '@/lib/supabase/server';
import { verifyDiscordPremium } from '@/lib/discord';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/play';

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth error:', error);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (data.session) {
      const userId = data.session.user.id;
      const userEmail = data.session.user.email;

      // Get the Discord provider token (only present for Discord OAuth)
      const providerToken = data.session.provider_token;

      if (providerToken) {
        // Discord OAuth flow - verify premium status
        const verification = await verifyDiscordPremium(providerToken);

        if (!verification.isPremium) {
          // User doesn't have premium role - sign them out and redirect
          await supabase.auth.signOut();

          const errorMessage = verification.error || 'premium_required';
          return NextResponse.redirect(
            `${origin}/access-denied?reason=${encodeURIComponent(errorMessage)}`
          );
        }

        // User is premium! Update their metadata
        await supabase.auth.updateUser({
          data: {
            discord_id: verification.userId,
            discord_username: verification.username,
            is_premium: true,
            verified_at: new Date().toISOString(),
          },
        });

        // Update profile with Discord info and premium role
        await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: userEmail,
            discord_id: verification.userId,
            discord_username: verification.username,
            role: 'premium',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
      } else {
        // Email/password login - check if user has access in profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        // If no profile exists or role is 'user', deny access
        if (!profile || profile.role === 'user') {
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/access-denied?reason=premium_required`
          );
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed
  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
