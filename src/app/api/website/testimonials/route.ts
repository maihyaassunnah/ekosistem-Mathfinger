import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_TESTIMONIALS = [
  {
    storyNumber: "01",
    title: "Dari Takut Matematika, Kini Jadi Juara Berhitung di Sekolah",
    parentName: "Bunda Rasyid",
    studentName: "M. Rasyid Al-Fatih",
    role: "Siswa SD IT Al-Madani (Level Dasar)",
    branch: "Singkut",
    rating: 5,
    comment:
      "Awalnya Rasyid selalu cemas tiap PR berhitung. Setelah 4 bulan di Math Fingers Singkut, jarinya bergerak lincah dan nilai matematikanya naik drastis jadi 95!",
    avatarUrl: "/images/landing/student-story.jpg",
  },
  {
    storyNumber: "02",
    title: "Metode Jari Tangan Praktis, Ujian Sekolah Tanpa Alat Bantu",
    parentName: "Ayahanda Kayla",
    studentName: "Kayla Putri Azzahra",
    role: "Alumni Level Mahir (SDN 02 Bangko)",
    branch: "Bangko",
    rating: 5,
    comment:
      "Sangat puas dengan metode Math Fingers. Waktu ujian di sekolah kan dilarang bawa kalkulator atau sempoa, jari tangan Kayla langsung jadi kalkulator kilat yang selalu siap.",
    avatarUrl: "/images/landing/about-teacher.jpg",
  },
  {
    storyNumber: "03",
    title: "Belajar Membaca Menyenangkan, 3 Bulan Langsung Lancar Tanpa Mengeja",
    parentName: "Mama Rayyan",
    studentName: "Rayyan Danendra (5 Tahun)",
    role: "Kelas Les Membaca Cepat Fonik",
    branch: "Singkut",
    rating: 5,
    comment:
      "Tutornya luar biasa sabar dan penuh kasih. Rayyan yang tadinya sulit fokus sekarang antusias membaca buku cerita sendiri setiap malam sebelum tidur.",
    avatarUrl: "/images/landing/hero-kids.jpg",
  },
];

// GET /api/website/testimonials - Fetch all active testimonials
export async function GET() {
  try {
    let testimonials = await prisma.websiteTestimonial.findMany({
      orderBy: [{ storyNumber: "asc" }, { createdAt: "asc" }],
    });

    if (testimonials.length === 0) {
      await prisma.websiteTestimonial.createMany({
        data: DEFAULT_TESTIMONIALS,
      });
      testimonials = await prisma.websiteTestimonial.findMany({
        orderBy: [{ storyNumber: "asc" }, { createdAt: "asc" }],
      });
    }

    const formatted = testimonials.map((t) => ({
      id: t.id,
      storyNumber: t.storyNumber || "01",
      title: t.title || "Prestasi Siswa Math Fingers",
      parentName: t.parentName,
      studentName: t.studentName,
      role: t.role || "Siswa Math Fingers",
      branch: t.branch,
      rating: t.rating,
      comment: t.comment,
      avatarUrl: t.avatarUrl || "/images/landing/student-story.jpg",
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    console.error("Error fetching website testimonials:", error);
    return NextResponse.json(DEFAULT_TESTIMONIALS);
  }
}

// POST /api/website/testimonials - Add testimonial
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, studentName, branch, rating, comment, title, role, storyNumber, avatarUrl } = body;

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
        title: title || `Cerita Prestasi ${studentName || "Siswa"}`,
        role: role || "Siswa Math Fingers",
        storyNumber: storyNumber || "01",
        avatarUrl: avatarUrl || "/images/landing/student-story.jpg",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating website testimonial:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/testimonials - Update testimonial
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, parentName, studentName, branch, rating, comment, title, role, storyNumber, avatarUrl } = body;

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
        ...(title !== undefined ? { title } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(storyNumber !== undefined ? { storyNumber } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
    });

    return NextResponse.json(updated);
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
