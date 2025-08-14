
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Paths to protect
  const protectedPaths = ['/pcmb', '/commerce', '/edu10', '/edu9', '/live', '/subjects', '/verifieduser', '/edu10aarambh', '/abhay2025'];
  const { pathname } = request.nextUrl;

  // Check if the current path is one of the protected paths (or a sub-path of /subjects)
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    // Check for the authentication cookie
    const authCookie = request.cookies.get('eduverse_auth');

    if (!authCookie) {
      // If no cookie, redirect to the start of the auth flow
      const url = request.nextUrl.clone();
      url.pathname = '/generatesecurekey';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/pcmb/:path*', '/commerce/:path*', '/edu10/:path*', '/edu9/:path*', '/live/:path*', '/subjects/:path*', '/verifieduser/:path*', '/edu10aarambh/:path*', '/abhay2025/:path*'],
};
