import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/mutations - Fetch all cash mutations (Buku Besar)
export async function GET() {
  try {
    const mutations = await prisma.cashMutation.findMany({
      include: { invoice: true },
      orderBy: { mutationDate: "desc" },
    });

    const formatted = mutations.map((m) => ({
      id: m.id,
      date: m.mutationDate.toISOString().split("T")[0],
      invoiceNo: m.invoice?.invoiceNumber || "-",
      studentName: m.studentName || m.invoice?.studentId || "Siswa",
      period: m.period || "September 2026",
      method: (m.method.toUpperCase() === "TRANSFER" ? "TRANSFER" : m.method.toUpperCase() === "CICILAN" ? "CICILAN" : "TUNAI") as "CICILAN" | "TUNAI" | "TRANSFER",
      description: m.description,
      amount: Number(m.amount),
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching cash mutations:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/mutations - Create new cash mutation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, invoiceNo, studentName, period, method, description, amount } = body;

    let invoiceId: string | undefined = undefined;
    if (invoiceNo) {
      const inv = await prisma.invoice.findUnique({ where: { invoiceNumber: invoiceNo } });
      if (inv) invoiceId = inv.id;
    }

    const created = await prisma.cashMutation.create({
      data: {
        invoiceId,
        studentName: studentName || "Siswa",
        period: period || "September 2026",
        method: method || "TUNAI",
        description: description || "Penerimaan Pembayaran",
        amount: Number(amount || 0),
        mutationDate: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        date: created.mutationDate.toISOString().split("T")[0],
        invoiceNo: invoiceNo || "-",
        studentName: created.studentName,
        period: created.period,
        method: created.method as "CICILAN" | "TUNAI" | "TRANSFER",
        description: created.description,
        amount: Number(created.amount),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating cash mutation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/mutations - Delete cash mutation
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID mutasi diperlukan" }, { status: 400 });
    }

    await prisma.cashMutation.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting cash mutation:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
