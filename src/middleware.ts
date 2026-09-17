import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-mathfingers-key-2026",
  callbacks: {
    authorized: ({ token, req }) => {
      // Allow if token is successfully decoded OR session cookie exists
      const sessionToken =
        req.cookies.get("__Secure-next-auth.session-token")?.value ||
        req.cookies.get("next-auth.session-token")?.value;
      return !!token || !!sessionToken;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};

