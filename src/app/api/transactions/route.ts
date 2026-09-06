import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/transactions - Fetch all cash transactions
export async function GET() {
  try {
    const transactions = await prisma.cashTransaction.findMany({
      include: { branch: true },
      orderBy: { transactionDate: "desc" },
    });

    const formatted = transactions.map((t) => ({
      id: t.id,
      date: t.transactionDate.toISOString().split("T")[0],
      type: (t.type as "INCOME" | "EXPENSE") || "INCOME",
      category: t.category,
      title: t.title,
      amount: Number(t.amount),
      branch: (t.branch?.branchName as "Singkut" | "Bangko") || "Singkut",
      sourceOrRecipient: t.sourceOrRecipient,
      notes: t.notes || "",
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/transactions - Create new transaction
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, type, category, title, amount, branch: branchName, sourceOrRecipient, notes } = body;

    if (!title || !amount) {
      return NextResponse.json({ error: "Judul dan nominal transaksi wajib diisi" }, { status: 400 });
    }

    let branch = await prisma.branch.findFirst({
      where: { branchName: { contains: branchName || "Singkut", mode: "insensitive" } },
    });
    if (!branch) {
      branch = await prisma.branch.findFirst();
    }

    const txDate = date ? new Date(date) : new Date();

    const created = await prisma.cashTransaction.create({
      data: {
        branchId: branch!.id,
        type: type || "INCOME",
        category: category || "Operasional",
        title,
        amount: Number(amount),
        sourceOrRecipient: sourceOrRecipient || "Kasir",
        transactionDate: txDate,
        notes: notes || "",
      },
      include: { branch: true },
    });

    return NextResponse.json(
      {
        id: created.id,
        date: created.transactionDate.toISOString().split("T")[0],
        type: created.type as "INCOME" | "EXPENSE",
        category: created.category,
        title: created.title,
        amount: Number(created.amount),
        branch: created.branch?.branchName || "Singkut",
        sourceOrRecipient: created.sourceOrRecipient,
        notes: created.notes || "",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/transactions - Delete transaction
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID transaksi diperlukan" }, { status: 400 });
    }

    await prisma.cashTransaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
