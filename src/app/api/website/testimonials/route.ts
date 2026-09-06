import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/website/testimonials - Fetch all active testimonials
export async function GET() {
  try {
    const testimonials = await prisma.websiteTestimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    const formatted = testimonials.map((t) => ({
      id: t.id,
      parentName: t.parentName,
      studentName: t.studentName,
      branch: t.branch,
      rating: t.rating,
      comment: t.comment,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching website testimonials:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/website/testimonials - Add testimonial
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, studentName, branch, rating, comment } = body;

    if (!parentName || !comment) {
      return NextResponse.json({ error: "Nama orang tua dan ulasan wajib diisi" }, { status: 400 });
    }

    const created = await prisma.websiteTestimonial.create({
      data: {
        parentName,
        studentName: studentName || "Siswa",
        branch: branch || "Singkut",
        rating: rating ? Number(rating) : 5,
        comment,
      },
    });

    return NextResponse.json(
      {
        id: created.id,
        parentName: created.parentName,
        studentName: created.studentName,
        branch: created.branch,
        rating: created.rating,
        comment: created.comment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating website testimonial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/testimonials - Update testimonial
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, parentName, studentName, branch, rating, comment } = body;

    if (!id) {
      return NextResponse.json({ error: "ID testimoni diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websiteTestimonial.update({
      where: { id },
      data: {
        ...(parentName ? { parentName } : {}),
        ...(studentName ? { studentName } : {}),
        ...(branch ? { branch } : {}),
        ...(rating !== undefined ? { rating: Number(rating) } : {}),
        ...(comment ? { comment } : {}),
      },
    });

    return NextResponse.json({
      id: updated.id,
      parentName: updated.parentName,
      studentName: updated.studentName,
      branch: updated.branch,
      rating: updated.rating,
      comment: updated.comment,
    });
  } catch (error: any) {
    console.error("Error updating website testimonial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/testimonials - Delete testimonial
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID testimoni diperlukan" }, { status: 400 });
    }

    await prisma.websiteTestimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website testimonial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
