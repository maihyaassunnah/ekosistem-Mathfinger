import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-guard";

// GET /api/invoices - Fetch all invoices
export async function GET(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const program = searchParams.get("program");
    const branch = searchParams.get("branch");

    const whereClause: any = {};
    if (program) {
      whereClause.programType = program.toUpperCase() === "MEMBACA" ? "MEMBACA" : "MATEMATIKA";
    }
    if (branch && branch !== "ALL") {
      whereClause.branch = { branchName: { contains: branch, mode: "insensitive" } };
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
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
      branch: (inv.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
      period: inv.period || "Bulan Berjalan",
      dueDate: inv.dueDate.toISOString().split("T")[0],
      amount: Number(inv.amount),
      status: inv.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
      paidDate: inv.paidAt ? inv.paidAt.toISOString().split("T")[0] : undefined,
      paidMethod: inv.paidMethod || undefined,
      programType: inv.programType,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/invoices - Create new invoice (supports single or bulk)
export async function POST(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

    const body = await req.json();
    const {
      studentId,
      studentIds,
      invoices: rawInvoices,
      studentName,
      period,
      dueDate,
      amount,
      status,
      programType: rawProgramType,
    } = body;

    // Helper to generate a unique invoice number
    const usedNumbers = new Set<string>();
    const generateUniqueInvoiceNo = () => {
      let invNo = "";
      for (let attempt = 0; attempt < 50; attempt++) {
        const code = Math.floor(1000 + Math.random() * 9000);
        invNo = `INV/MF/2608/${code}`;
        if (!usedNumbers.has(invNo)) {
          usedNumbers.add(invNo);
          return invNo;
        }
      }
      return `INV/MF/2608/${Date.now().toString().slice(-4)}`;
    };

    // Case 1: Bulk invoices array provided
    if (Array.isArray(rawInvoices) && rawInvoices.length > 0) {
      const createdList = [];
      for (const item of rawInvoices) {
        let student = null;
        if (item.studentId) {
          student = await prisma.student.findUnique({ where: { id: item.studentId } });
        }
        if (!student && item.studentName) {
          student = await prisma.student.findFirst({
            where: { studentName: { contains: item.studentName, mode: "insensitive" } },
          });
        }
        if (!student) continue;

        const due = item.dueDate ? new Date(item.dueDate) : new Date(Date.now() + 10 * 86400000);
        const programType = (
          item.programType ||
          student.programType ||
          "MATEMATIKA"
        ).toUpperCase() === "MEMBACA"
          ? "MEMBACA"
          : "MATEMATIKA";

        const created = await prisma.invoice.create({
          data: {
            invoiceNumber: generateUniqueInvoiceNo(),
            studentId: student.id,
            branchId: student.branchId,
            amount: item.amount ? Number(item.amount) : 100000,
            period: item.period || "September 2026",
            dueDate: due,
            status: item.status === "LUNAS" ? "PAID" : "UNPAID",
            programType,
          },
          include: { student: true, branch: true },
        });

        createdList.push({
          id: created.id,
          invoiceNo: created.invoiceNumber,
          studentId: created.studentId,
          studentName: created.student.studentName,
          branch: (created.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
          period: created.period,
          dueDate: created.dueDate.toISOString().split("T")[0],
          amount: Number(created.amount),
          status: created.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
          programType: created.programType,
        });
      }

      return NextResponse.json(createdList, { status: 201 });
    }

    // Case 2: Array of studentIds provided with common parameters
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
        include: { branch: true },
      });

      if (students.length === 0) {
        return NextResponse.json({ error: "Tidak ada siswa yang valid ditemukan" }, { status: 400 });
      }

      const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 10 * 86400000);
      const createdList = [];

      for (const st of students) {
        const programType = (
          rawProgramType ||
          st.programType ||
          "MATEMATIKA"
        ).toUpperCase() === "MEMBACA"
          ? "MEMBACA"
          : "MATEMATIKA";

        const created = await prisma.invoice.create({
          data: {
            invoiceNumber: generateUniqueInvoiceNo(),
            studentId: st.id,
            branchId: st.branchId,
            amount: amount ? Number(amount) : 100000,
            period: period || "September 2026",
            dueDate: due,
            status: status === "LUNAS" ? "PAID" : "UNPAID",
            programType,
          },
          include: { student: true, branch: true },
        });

        createdList.push({
          id: created.id,
          invoiceNo: created.invoiceNumber,
          studentId: created.studentId,
          studentName: created.student.studentName,
          branch: (created.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
          period: created.period,
          dueDate: created.dueDate.toISOString().split("T")[0],
          amount: Number(created.amount),
          status: created.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
          programType: created.programType,
        });
      }

      return NextResponse.json(createdList, { status: 201 });
    }

    // Case 3: Single student creation (backward compatibility)
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

    const invoiceNo = generateUniqueInvoiceNo();
    const due = dueDate ? new Date(dueDate) : new Date(Date.now() + 10 * 86400000);

    const programType =
      (rawProgramType || student.programType || "MATEMATIKA").toUpperCase() === "MEMBACA"
        ? "MEMBACA"
        : "MATEMATIKA";

    const created = await prisma.invoice.create({
      data: {
        invoiceNumber: invoiceNo,
        studentId: student.id,
        branchId: student.branchId,
        amount: amount ? Number(amount) : 100000,
        period: period || "September 2026",
        dueDate: due,
        status: status === "LUNAS" ? "PAID" : "UNPAID",
        programType,
      },
      include: { student: true, branch: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        invoiceNo: created.invoiceNumber,
        studentId: created.studentId,
        studentName: created.student.studentName,
        branch: (created.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
        period: created.period,
        dueDate: created.dueDate.toISOString().split("T")[0],
        amount: Number(created.amount),
        status: created.status === "PAID" ? "LUNAS" : "BELUM BAYAR",
        programType: created.programType,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/invoices - Update invoice status (e.g. mark as PAID)
export async function PUT(req: Request) {
  try {
    const { error } = await requireAuth();
    if (error) return error;

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
      include: { student: true, branch: true },
    });

    // Synchronize CashMutation
    if (isPaid) {
      const existingMut = await prisma.cashMutation.findFirst({ where: { invoiceId: updated.id } });
      if (!existingMut) {
        await prisma.cashMutation.create({
          data: {
            invoiceId: updated.id,
            studentName: updated.student?.studentName || "Siswa",
            period: updated.period || "September 2026",
            method: paidMethod?.toUpperCase().includes("TRANSFER") ? "TRANSFER" : "TUNAI",
            description: "Pelunasan Penuh",
            amount: updated.amount,
            mutationDate: paidDate ? new Date(paidDate) : new Date(),
          },
        });
      }
    } else {
      await prisma.cashMutation.deleteMany({ where: { invoiceId: updated.id } });
    }

    return NextResponse.json({
      id: updated.id,
      invoiceNo: updated.invoiceNumber,
      studentId: updated.studentId,
      studentName: updated.student.studentName,
      branch: (updated.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
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
    const { error } = await requireAuth();
    if (error) return error;

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
