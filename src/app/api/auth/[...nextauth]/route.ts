import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                fullName: user.name || user.email.split("@")[0],
                email: user.email,
                passwordHash: "google-oauth",
                role: "SUPER_ADMIN",
                status: "ACTIVE",
              },
            });
          }
        } catch (e) {
          console.error("Error creating/checking Google OAuth user:", e);
        }
      }
      return true;
    },
    async session({ session }) {
      if (session?.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
          });
          if (dbUser) {
            (session.user as any).role = dbUser.role;
            (session.user as any).id = dbUser.id;
          }
        } catch (e) {
          console.error("Session sync error:", e);
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "super-secret-mathfingers-key-2026",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
