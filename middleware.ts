import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication and premium/admin access
const protectedRoutes = ['/play', '/stats'];

// Routes that require admin access only
const adminRoutes = ['/admin'];

// Routes that should redirect to /play if already authenticated
const authRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check route types
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If protected or admin route and not authenticated, redirect to login
  if ((isProtectedRoute || isAdminRoute) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  // If auth route and already authenticated, redirect to play
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/play';
    return NextResponse.redirect(url);
  }

  // Check user role for protected and admin routes
  if ((isProtectedRoute || isAdminRoute) && user) {
    // First check user metadata for Discord premium (set during Discord OAuth)
    const hasPremiumMetadata = user.user_metadata?.is_premium;

    // Also check profiles table for role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    // Debug logging
    console.log('[Middleware] User ID:', user.id);
    console.log('[Middleware] User email:', user.email);
    console.log('[Middleware] Profile:', profile);
    console.log('[Middleware] Profile error:', profileError);

    const userRole = profile?.role || 'user';
    const isAdmin = userRole === 'admin';
    const isPremium = userRole === 'premium' || hasPremiumMetadata;
    const hasAccess = isAdmin || isPremium;

    console.log('[Middleware] Role:', userRole, 'isAdmin:', isAdmin, 'hasAccess:', hasAccess);

    // Admin routes require admin role
    if (isAdminRoute && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/access-denied';
      url.searchParams.set('reason', 'admin_required');
      return NextResponse.redirect(url);
    }

    // Protected routes require admin or premium
    if (isProtectedRoute && !hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/access-denied';
      url.searchParams.set('reason', 'premium_required');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
