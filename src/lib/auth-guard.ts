import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth(allowedRoles?: string | string[]) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized: Silakan login terlebih dahulu untuk mengakses data ini." },
        { status: 401 }
      ),
      session: null,
    };
  }

  if (allowedRoles) {
    const userRole = (session.user as any).role;
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Normalize roles (e.g., "SUPER_ADMIN" or "Super Admin")
    const isAllowed = rolesArray.some(
      (r) =>
        r.toUpperCase() === (userRole || "").toUpperCase() ||
        (r === "SUPER_ADMIN" && (userRole === "Super Admin" || userRole === "SUPER_ADMIN")) ||
        (r === "BRANCH_ADMIN" && (userRole === "Admin Cabang" || userRole === "BRANCH_ADMIN"))
    );

    if (!isAllowed) {
      return {
        error: NextResponse.json(
          { error: "Forbidden: Akun Anda tidak memiliki izin untuk melakukan aksi ini." },
          { status: 403 }
        ),
        session,
      };
    }
  }

  return { error: null, session };
}
