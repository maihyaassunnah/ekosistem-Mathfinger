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
