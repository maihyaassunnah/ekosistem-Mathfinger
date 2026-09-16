import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-mathfingers-key-2026",
});

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};

