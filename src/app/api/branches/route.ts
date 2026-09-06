import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/branches - Fetch all branches with student and admin counts
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        students: true,
        users: true,
      },
      orderBy: { branchName: "asc" },
    });

    const formatted = branches.map((b) => ({
      id: b.id,
      code: b.branchCode,
      name: b.branchName,
      address: b.address,
      phone: b.phone || "-",
      activeStudents: b.students.filter((s) => s.status === "ACTIVE").length,
      adminCount: b.users.length,
      monthlyRevenue: 3500000,
      status: b.status,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching branches:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
