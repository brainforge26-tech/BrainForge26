import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route categories ─────────────────────────────────────────────────────────
const PUBLIC_PATHS  = ['/', '/login', '/register', '/forgot-password', '/reset-password'];
const AUTH_PATHS    = ['/login', '/register', '/forgot-password', '/reset-password'];

const ROLE_PREFIXES: Record<string, string> = {
  ADMIN:     '/admin',
  MANAGER:   '/manager',
  DEVELOPER: '/developer',
  CLIENT:    '/client',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole    = request.cookies.get('userRole')?.value;
  const isAuthenticated = Boolean(accessToken);

  // ── 1. Static / API / Next internals — skip ──────────────────────────────
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api')   ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // ── 2. Authenticated user tries to visit auth pages → redirect to dashboard
  if (isAuthenticated && AUTH_PATHS.some(p => pathname.startsWith(p))) {
    const dest = userRole ? ROLE_PREFIXES[userRole] ?? '/' : '/';
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── 3. Unauthenticated user tries to visit protected dashboard routes ─────
  const isDashboard = Object.values(ROLE_PREFIXES).some(prefix =>
    pathname.startsWith(prefix),
  );

  if (isDashboard && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. Role-based access control ─────────────────────────────────────────
  if (isDashboard && isAuthenticated && userRole) {
    const allowedPrefix = ROLE_PREFIXES[userRole];
    if (allowedPrefix && !pathname.startsWith(allowedPrefix)) {
      // User is trying to access another role's dashboard
      return NextResponse.redirect(new URL(allowedPrefix, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
