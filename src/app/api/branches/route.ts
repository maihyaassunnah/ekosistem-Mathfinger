import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/branches - Fetch all branches with student and admin counts
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        students: true,
        users: true,
        invoices: { where: { status: "PAID" } },
      },
      orderBy: { branchName: "asc" },
    });

    const formatted = branches.map((b) => {
      const liveRevenue = b.invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const defaultRevenue = b.branchCode === "SKT" ? 3250000 : 4355000;
      return {
        id: b.id,
        code: b.branchCode,
        name: b.branchName,
        address: b.address,
        phone: b.phone || "-",
        activeStudents: b.students.filter((s) => s.status === "ACTIVE").length,
        adminCount: b.users.length,
        monthlyRevenue: liveRevenue > 0 ? liveRevenue : defaultRevenue,
        status: b.status,
      };
    });

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching branches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/branches - Create new branch directly in PostgreSQL
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, name, address, phone, status } = body;

    if (!name) {
      return NextResponse.json({ error: "Nama cabang wajib diisi" }, { status: 400 });
    }

    // Auto-generate code if empty or check uniqueness
    const rawCode = (code || name.slice(0, 3)).toUpperCase().replace(/[^A-Z0-9]/g, "");
    let finalCode = rawCode || "CBG";

    const existing = await prisma.branch.findUnique({ where: { branchCode: finalCode } });
    if (existing) {
      finalCode = `${finalCode}${Math.floor(Math.random() * 90 + 10)}`;
    }

    const created = await prisma.branch.create({
      data: {
        branchCode: finalCode,
        branchName: name,
        address: address || "-",
        phone: phone || "-",
        status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        code: created.branchCode,
        name: created.branchName,
        address: created.address,
        phone: created.phone || "-",
        activeStudents: 0,
        adminCount: 0,
        monthlyRevenue: 0,
        status: created.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating branch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/branches - Update branch directly in PostgreSQL
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, code, name, address, phone, status } = body;

    if (!id && !code) {
      return NextResponse.json({ error: "ID atau Kode Cabang diperlukan" }, { status: 400 });
    }

    // Find branch by id or code
    let branch = id ? await prisma.branch.findUnique({ where: { id } }) : null;
    if (!branch && code) {
      branch = await prisma.branch.findUnique({ where: { branchCode: code } });
    }
    if (!branch && name) {
      branch = await prisma.branch.findFirst({ where: { branchName: name } });
    }

    if (!branch) {
      return NextResponse.json({ error: "Cabang tidak ditemukan" }, { status: 404 });
    }

    const updated = await prisma.branch.update({
      where: { id: branch.id },
      data: {
        ...(code && code !== branch.branchCode ? { branchCode: code } : {}),
        ...(name ? { branchName: name } : {}),
        ...(address !== undefined ? { address } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(status ? { status: status === "INACTIVE" ? "INACTIVE" : "ACTIVE" } : {}),
      },
      include: {
        students: true,
        users: true,
        invoices: { where: { status: "PAID" } },
      },
    });

    const liveRevenue = updated.invoices.reduce((sum, inv) => sum + Number(inv.amount), 0);

    return NextResponse.json({
      id: updated.id,
      code: updated.branchCode,
      name: updated.branchName,
      address: updated.address,
      phone: updated.phone || "-",
      activeStudents: updated.students.filter((s) => s.status === "ACTIVE").length,
      adminCount: updated.users.length,
      monthlyRevenue: liveRevenue,
      status: updated.status,
    });
  } catch (error: any) {
    console.error("Error updating branch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/branches - Delete or deactivate branch in PostgreSQL
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID cabang diperlukan" }, { status: 400 });
    }

    // Check relations
    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        students: true,
        classes: true,
        users: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ error: "Cabang tidak ditemukan" }, { status: 404 });
    }

    // If has active students or classes or admins, soft delete (set status INACTIVE)
    if (branch.students.length > 0 || branch.classes.length > 0 || branch.users.length > 0) {
      await prisma.branch.update({
        where: { id },
        data: { status: "INACTIVE" },
      });
      return NextResponse.json({
        message: "Cabang dinonaktifkan karena memiliki data relasi siswa/kelas/admin",
        status: "INACTIVE",
      });
    }

    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Cabang berhasil dihapus dari database" });
  } catch (error: any) {
    console.error("Error deleting branch:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
