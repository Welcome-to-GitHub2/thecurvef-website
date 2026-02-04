import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes only
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin_session');

    // If not logged in → redirect to admin login
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/* ────────────────────────────────────────────────
   APPLY MIDDLEWARE ONLY TO /admin/*
──────────────────────────────────────────────── */
export const config = {
  matcher: ['/admin/:path*'],
};
