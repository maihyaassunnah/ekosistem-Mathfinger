import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Protect /dashboard routes from unauthenticated access
  if (pathname.startsWith("/dashboard")) {
    const cookies = req.cookies.getAll();

    // Check if user has ANY session token cookie
    // Matches:
    // - next-auth.session-token
    // - __Secure-next-auth.session-token
    // - Chunked cookies: next-auth.session-token.0, __Secure-next-auth.session-token.0, etc.
    const hasSessionCookie = cookies.some(
      (c) =>
        c.name.includes("next-auth.session-token") &&
        Boolean(c.value && c.value.trim().length > 0)
    );

    const hasAuthHeader = Boolean(req.headers.get("authorization"));

    // If completely unauthenticated (no session token and no auth header), redirect to login
    if (!hasSessionCookie && !hasAuthHeader) {
      const signInUrl = new URL("/login", req.nextUrl.origin);
      signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
