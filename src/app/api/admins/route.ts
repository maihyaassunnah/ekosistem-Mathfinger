import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/admins - Fetch all registered admin and staff accounts
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { branch: true },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone || "-",
      avatarUrl: u.avatarUrl || "",
      branchName: u.branch ? u.branch.branchName : "Semua Cabang (Pusat)",
      role:
        u.role === "SUPER_ADMIN"
          ? "Super Admin"
          : u.role === "BRANCH_ADMIN"
          ? "Admin Cabang"
          : u.role === "BRANCH_ASSISTANT"
          ? "Asisten Cabang"
          : "Tutor",
      status: u.status === "ACTIVE" ? "Aktif" : "Nonaktif",
      createdAt: u.createdAt.toISOString().split("T")[0],
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admins - Register a new admin / branch staff
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, branchName, role, status, phone } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Nama lengkap dan email wajib diisi" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar di sistem. Gunakan email lain." },
        { status: 400 }
      );
    }

    // Find branch
    let branchId: string | null = null;
    if (branchName && branchName !== "Semua Cabang (Pusat)") {
      const branch = await prisma.branch.findFirst({
        where: {
          branchName: { contains: branchName, mode: "insensitive" },
        },
      });
      if (branch) branchId = branch.id;
    }

    // Map role enum
    let dbRole: "SUPER_ADMIN" | "BRANCH_ADMIN" | "BRANCH_ASSISTANT" | "TUTOR" = "BRANCH_ADMIN";
    if (role === "Super Admin") dbRole = "SUPER_ADMIN";
    else if (role === "Asisten Cabang") dbRole = "BRANCH_ASSISTANT";
    else if (role === "Tutor") dbRole = "TUTOR";
    else dbRole = "BRANCH_ADMIN";

    // Hash password or default
    const plainPassword = password || "password123";
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const created = await prisma.user.create({
      data: {
        fullName,
        email: normalizedEmail,
        passwordHash,
        role: dbRole,
        status: status === "Nonaktif" ? "INACTIVE" : "ACTIVE",
        branchId,
        phone: phone || null,
        avatarUrl: body.avatarUrl || null,
      },
      include: { branch: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        fullName: created.fullName,
        email: created.email,
        phone: created.phone || "-",
        avatarUrl: created.avatarUrl || "",
        branchName: created.branch?.branchName || "Semua Cabang (Pusat)",
        role:
          created.role === "SUPER_ADMIN"
            ? "Super Admin"
            : created.role === "BRANCH_ADMIN"
            ? "Admin Cabang"
            : created.role === "BRANCH_ASSISTANT"
            ? "Asisten Cabang"
            : "Tutor",
        status: created.status === "ACTIVE" ? "Aktif" : "Nonaktif",
        createdAt: created.createdAt.toISOString().split("T")[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating admin account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/admins - Update admin account (status, role, branch, password)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, fullName, email, password, branchName, role, status } = body;

    if (!id) {
      return NextResponse.json({ error: "ID admin wajib disertakan" }, { status: 400 });
    }

    let branchId: string | null = undefined as any;
    if (branchName !== undefined) {
      if (branchName === "Semua Cabang (Pusat)") {
        branchId = null;
      } else {
        const branch = await prisma.branch.findFirst({
          where: { branchName: { contains: branchName, mode: "insensitive" } },
        });
        if (branch) branchId = branch.id;
      }
    }

    let dbRole: "SUPER_ADMIN" | "BRANCH_ADMIN" | "BRANCH_ASSISTANT" | "TUTOR" | undefined = undefined;
    if (role) {
      if (role === "Super Admin") dbRole = "SUPER_ADMIN";
      else if (role === "Asisten Cabang") dbRole = "BRANCH_ASSISTANT";
      else if (role === "Tutor") dbRole = "TUTOR";
      else dbRole = "BRANCH_ADMIN";
    }

    let passwordHash = undefined;
    if (password && password.trim().length > 0) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(fullName ? { fullName } : {}),
        ...(email ? { email: email.toLowerCase().trim() } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
        ...(passwordHash ? { passwordHash } : {}),
        ...(dbRole ? { role: dbRole } : {}),
        ...(status !== undefined ? { status: status === "Aktif" ? "ACTIVE" : "INACTIVE" } : {}),
        ...(branchId !== undefined ? { branchId } : {}),
      },
      include: { branch: true },
    });

    return NextResponse.json({
      id: updated.id,
      fullName: updated.fullName,
      email: updated.email,
      phone: updated.phone || "-",
      avatarUrl: updated.avatarUrl || "",
      branchName: updated.branch?.branchName || "Semua Cabang (Pusat)",
      role:
        updated.role === "SUPER_ADMIN"
          ? "Super Admin"
          : updated.role === "BRANCH_ADMIN"
          ? "Admin Cabang"
          : updated.role === "BRANCH_ASSISTANT"
          ? "Asisten Cabang"
          : "Tutor",
      status: updated.status === "ACTIVE" ? "Aktif" : "Nonaktif",
      createdAt: updated.createdAt.toISOString().split("T")[0],
    });
  } catch (error: any) {
    console.error("Error updating admin account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/admins - Delete admin account
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID admin wajib disertakan" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting admin account:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
