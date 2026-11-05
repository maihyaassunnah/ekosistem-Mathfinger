import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

/**
 * Returns the effective branch ID for data scoping.
 * - Non-SuperAdmin users (Branch Admin, Tutor, Assistant) are STRICTLY locked to their own branch.
 * - SuperAdmin can view all (null) or specify a branch filter.
 */
export async function getEffectiveBranchId(session: any, requestedBranch?: string | null): Promise<string | null> {
  const role = (session?.user as any)?.role;
  const isSuperAdmin =
    role === "SUPER_ADMIN" ||
    role === "Super Admin" ||
    (session?.user?.email &&
      ["wahyudinhafiz123@gmail.com", "ma.ihyaassunnah@gmail.com"].includes(session.user.email.toLowerCase()));

  let targetBranchParam: string | null = null;

  if (!isSuperAdmin) {
    const userBranch = (session?.user as any)?.branchName;
    const email = (session?.user?.email || "").toLowerCase();

    if (
      email.includes("bangko") ||
      email.includes("dwsafitri") ||
      email.includes("uswatun") ||
      email.includes("lailatus") ||
      /bangko|tabir/i.test(userBranch || "")
    ) {
      targetBranchParam = "Bangko";
    } else if (
      email.includes("singkut") ||
      email.includes("febri") ||
      email.includes("rini") ||
      /singkut/i.test(userBranch || "")
    ) {
      targetBranchParam = "Singkut";
    } else {
      targetBranchParam = userBranch || "Singkut";
    }
  } else {
    if (!requestedBranch || requestedBranch === "ALL") return null;
    targetBranchParam = requestedBranch;
  }

  if (!targetBranchParam) return null;

  const isBangkoTabir = /bangko|tabir/i.test(targetBranchParam);
  try {
    const b = await prisma.branch.findFirst({
      where: {
        OR: [
          { id: targetBranchParam },
          ...(isBangkoTabir
            ? [
                { branchCode: "BGK" },
                { branchName: { contains: "Bangko", mode: "insensitive" as const } },
                { branchName: { contains: "Tabir", mode: "insensitive" as const } },
              ]
            : []),
          { branchName: { contains: targetBranchParam, mode: "insensitive" as const } },
          { branchCode: { equals: targetBranchParam, mode: "insensitive" as const } },
        ],
      },
    });
    return b?.id || null;
  } catch {
    return null;
  }
}
