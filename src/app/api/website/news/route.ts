import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_NEWS = [
  {
    title: "Ujian Kenaikan Level Semester: Puluhan Siswa Raih Nilai Sempurna",
    category: "PRESTASI & SERTIFIKASI",
    date: "15 Sep 2026",
    author: "Tim Akademik Math Fingers",
    image: "/images/landing/student-story.jpg",
    summary:
      "Pemberian piagam penghargaan resmi dan evaluasi rapor kompetensi digital bagi siswa yang menuntaskan level dasar.",
    orderIndex: 1,
    isActive: true,
  },
  {
    title: "Tips Efektif Mendampingi Anak Belajar Matematika di Rumah Tanpa Stres",
    category: "EDUKASI ORANG TUA",
    date: "10 Sep 2026",
    author: "Ustadzah Sri Wahyuni, S.Pd.I",
    image: "/images/landing/about-teacher.jpg",
    summary:
      "Pendekatan positif agar anak tidak trauma angka: gunakan permainan visual dan apresiasi proses belajar jari tangan.",
    orderIndex: 2,
    isActive: true,
  },
  {
    title: "Inovasi Kartu QR Digital: Orang Tua Pantau Absensi & Nilai Siswa Real-time",
    category: "TEKNOLOGI EDUKASI",
    date: "05 Sep 2026",
    author: "Manajemen Sistem",
    image: "/images/landing/programs-bg.jpg",
    summary:
      "Kemudahan integrasi notifikasi presensi otomatis dan riwayat jurnal perkembangan belajar langsung ke WhatsApp wali murid.",
    orderIndex: 3,
    isActive: true,
  },
  {
    title: "Gebyar Milad Math Fingers: Lomba Hitung Cepat dan Pentas Bakat Siswa",
    category: "KEGIATAN & EVENT",
    date: "28 Agu 2026",
    author: "Panitia Milad",
    image: "/images/landing/hero-kids.jpg",
    summary:
      "Kemeriahan lomba ketangkasan 10 jari diikuti oleh ratusan siswa dari Cabang Singkut dan Cabang Bangko.",
    orderIndex: 4,
    isActive: true,
  },
];

// GET /api/website/news - Ambil semua berita
export async function GET() {
  try {
    let news = await prisma.websiteNews.findMany({
      orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
    });

    // Seed default jika tabel masih kosong
    if (news.length === 0) {
      await prisma.websiteNews.createMany({
        data: DEFAULT_NEWS,
      });
      news = await prisma.websiteNews.findMany({
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
      });
    }

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("Error fetching website news:", error);
    // Fallback jika database belum sync
    return NextResponse.json(DEFAULT_NEWS);
  }
}

// POST /api/website/news - Tambah berita baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, date, author, image, summary, content, orderIndex, isActive } = body;

    if (!title || !category || !summary) {
      return NextResponse.json(
        { error: "Judul, kategori, dan ringkasan berita wajib diisi" },
        { status: 400 }
      );
    }

    const created = await prisma.websiteNews.create({
      data: {
        title,
        category,
        date: date || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
        author: author || "Admin Math Fingers",
        image: image || "/images/landing/student-story.jpg",
        summary,
        content: content || null,
        orderIndex: orderIndex ? Number(orderIndex) : 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating website news:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/news - Edit berita
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, category, date, author, image, summary, content, orderIndex, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID berita diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websiteNews.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(category ? { category } : {}),
        ...(date ? { date } : {}),
        ...(author ? { author } : {}),
        ...(image ? { image } : {}),
        ...(summary ? { summary } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating website news:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/news - Hapus berita
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID berita diperlukan" }, { status: 400 });
    }

    await prisma.websiteNews.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website news:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
