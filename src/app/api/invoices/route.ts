import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/invoices - Fetch all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        student: true,
        branch: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = invoices.map((inv) => ({
      id: inv.id,
      invoiceNo: inv.invoiceNumber,
      studentId: inv.studentId,
      studentName: inv.student?.studentName || "Siswa",
      period: inv.period || "Bulan Berjalan",
      dueDate: inv.dueDate.toISOString().split("T")[0],
      amount: Number(inv.amount),
      status: inv.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      paidDate: inv.paidAt ? inv.paidAt.toISOString().split("T")[0] : undefined,
      paidMethod: inv.paidMethod || undefined,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/invoices - Create new invoice
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, studentName, period, dueDate, amount, status } = body;

    let student = null;
    if (studentId) {
      student = await prisma.student.findUnique({ where: { id: studentId } });
    }
    if (!student && studentName) {
      student = await prisma.student.findFirst({
        where: { studentName: { contains: studentName, mode: "insensitive" } },
      });
    }
    if (!student) {
      student = await prisma.student.findFirst();
    }

    if (!student) {
      return NextResponse.json({ error: "Data siswa tidak ditemukan" }, { status: 400 });
    }

    const code = Math.floor(1000 + Math.random() * 9000);
    const invoiceNo = `INV/MF/2608/${code}`;
    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 10 * 86400000);

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber: invoiceNo,
        studentId: student.id,
        branchId: student.branchId,
        amount: amount ? Number(amount) : 250000,
        period: period || "Bulan Berjalan",
        dueDate: due,
        status: status === "LUNAS" ? "PAID" : "UNPAID",
      },
      include: { student: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        invoiceNo: created.invoiceNumber,
        studentId: created.studentId,
        studentName: created.student.studentName,
        period: created.period,
        dueDate: created.dueDate.toISOString().split("T")[0],
        amount: Number(created.amount),
        status: created.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/invoices - Update invoice status / payment
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, paidDate, paidMethod } = body;

    if (!id) {
      return NextResponse.json({ error: "ID invoice diperlukan" }, { status: 400 });
    }

    const isPaid = status === "LUNAS";
    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        status: isPaid ? "PAID" : "UNPAID",
        paidAt: isPaid ? (paidDate ? new Date(paidDate) : new Date()) : null,
        paidMethod: isPaid ? (paidMethod || "Tunai") : null,
      },
      include: { student: true },
    });

    return NextResponse.json({
      id: updated.id,
      invoiceNo: updated.invoiceNumber,
      studentId: updated.studentId,
      studentName: updated.student.studentName,
      period: updated.period,
      dueDate: updated.dueDate.toISOString().split("T")[0],
      amount: Number(updated.amount),
      status: updated.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      paidDate: updated.paidAt ? updated.paidAt.toISOString().split("T")[0] : undefined,
      paidMethod: updated.paidMethod || undefined,
    });
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/invoices - Delete invoice
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID invoice diperlukan" }, { status: 400 });
    }

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
