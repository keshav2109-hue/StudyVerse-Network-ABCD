
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check key generation status first
  const keyStatusUrl = new URL('/api/key-status', request.url);
  let keyGenRequired = true; // Default to true for security
  try {
    const keyStatusRes = await fetch(keyStatusUrl);
    if (keyStatusRes.ok) {
      const data = await keyStatusRes.json();
      keyGenRequired = data.on;
    }
  } catch (error) {
    console.error('Middleware could not fetch key status, defaulting to key required.', error);
  }

  // If key generation is not required, skip all checks
  if (!keyGenRequired) {
    return NextResponse.next();
  }

  // Paths to protect if key generation is required
  const protectedPaths = ['/pcmb', '/commerce', '/edu10', '/edu9', '/live', '/subjects', '/verifieduser', '/edu10aarambh', '/abhay2025', '/abhay9-2025'];
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
  matcher: ['/pcmb/:path*', '/commerce/:path*', '/edu10/:path*', '/edu9/:path*', '/live/:path*', '/subjects/:path*', '/verifieduser/:path*', '/edu10aarambh/:path*', '/abhay2025/:path*', '/abhay9-2025/:path*'],
};
