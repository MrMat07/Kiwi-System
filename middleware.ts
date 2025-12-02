import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthPayloadFromRequest } from './lib/auth/jwt';

const publicPaths = ['/login', '/api/auth/login', '/api/auth/register', '/api/auth/logout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  const payload = getAuthPayloadFromRequest(request);
  if (!payload) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
