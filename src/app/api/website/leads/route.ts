import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/leads - Fetch all trial leads
export async function GET() {
  try {
    const leads = await prisma.websiteLead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formatted = leads.map((l) => ({
      id: l.id,
      studentName: l.studentName,
      studentAge: l.studentAge,
      parentName: l.parentName,
      phone: l.phone,
      branch: (l.branch as "Singkut" | "Bangko") || "Singkut",
      createdAt: l.createdAt.toISOString().split("T")[0],
      status: (l.status as "Baru" | "Dihubungi" | "Trial Terjadwal" | "Terdaftar") || "Baru",
      notes: l.notes || undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching website leads:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/website/leads - Submit new trial lead (from landing page form)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentName, studentAge, parentName, phone, branch, notes } = body;

    if (!studentName || !parentName || !phone) {
      return NextResponse.json({ error: "Nama anak, orang tua, dan nomor WhatsApp wajib diisi" }, { status: 400 });
    }

    const created = await prisma.websiteLead.create({
      data: {
        studentName,
        studentAge: studentAge || "7 Tahun",
        parentName,
        phone,
        branch: branch || "Singkut",
        status: "Baru",
        notes: notes || null,
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        studentName: created.studentName,
        studentAge: created.studentAge,
        parentName: created.parentName,
        phone: created.phone,
        branch: created.branch,
        createdAt: created.createdAt.toISOString().split("T")[0],
        status: created.status,
        notes: created.notes || undefined,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating website lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/leads - Update lead status / notes
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "ID calon siswa / lead diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websiteLead.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      studentName: updated.studentName,
      studentAge: updated.studentAge,
      parentName: updated.parentName,
      phone: updated.phone,
      branch: updated.branch,
      createdAt: updated.createdAt.toISOString().split("T")[0],
      status: updated.status,
      notes: updated.notes || undefined,
    });
  } catch (error: any) {
    console.error("Error updating website lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/leads - Delete lead
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID calon siswa diperlukan" }, { status: 400 });
    }

    await prisma.websiteLead.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website lead:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
