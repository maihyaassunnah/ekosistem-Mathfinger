import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan kata sandi wajib diisi");
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          include: { branch: true },
        });

        if (!user) {
          throw new Error("Akun belum terdaftar. Silakan hubungi Super Admin.");
        }

        if (user.status !== "ACTIVE") {
          throw new Error("Akun Anda sedang dinonaktifkan oleh administrator.");
        }

        let isPasswordValid = false;
        if (
          user.passwordHash.startsWith("$2a$") ||
          user.passwordHash.startsWith("$2b$")
        ) {
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
        } else {
          isPasswordValid = user.passwordHash === credentials.password;
        }

        if (!isPasswordValid) {
          throw new Error("Kata sandi yang Anda masukkan salah.");
        }

        const safeAvatar =
          user.avatarUrl &&
          !user.avatarUrl.startsWith("data:") &&
          user.avatarUrl.length < 500
            ? user.avatarUrl
            : null;

        return {
          id: user.id,
          name: user.fullName,
          email: user.email,
          role: user.role,
          branchName: user.branch?.branchName || "Semua Cabang (Pusat)",
          image: safeAvatar,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user?.email) return false;

        const normalizedEmail = user.email.toLowerCase().trim();

        // Check if this Google email has been registered beforehand
        const existingUser = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!existingUser) {
          console.warn(
            `Akses Google DITOLAK: ${normalizedEmail} belum terdaftar di sistem.`
          );
          // Returning false will redirect to /login?error=AccessDenied
          return false;
        }

        if (existingUser.status !== "ACTIVE") {
          console.warn(
            `Akses Google DITOLAK: ${normalizedEmail} berstatus nonaktif.`
          );
          return false;
        }

        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.branchName = (user as any).branchName;
        const img = (user as any).image || (user as any).avatarUrl;
        // Never put base64 or oversized strings into JWT cookie to prevent HTTP 431
        if (img && typeof img === "string" && !img.startsWith("data:") && img.length < 500) {
          token.picture = img;
        } else {
          token.picture = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).branchName = token.branchName;
        session.user.image = (token.picture as string) || null;

        if (!token.role && session.user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email.toLowerCase().trim() },
            include: { branch: true },
          });
          if (dbUser) {
            (session.user as any).id = dbUser.id;
            (session.user as any).role = dbUser.role;
            (session.user as any).branchName =
              dbUser.branch?.branchName || "Semua Cabang (Pusat)";
            if (dbUser.avatarUrl && !dbUser.avatarUrl.startsWith("data:") && dbUser.avatarUrl.length < 500) {
              session.user.image = dbUser.avatarUrl;
            }
          }
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
