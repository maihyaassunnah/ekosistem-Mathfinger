import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_EVENTS = [
  {
    day: "25",
    month: "SEP",
    title: "Trial Class Gratis Serentak Akhir Pekan",
    time: "14:00 – 16:00 WIB",
    location: "Cabang Singkut & Cabang Bangko",
    desc: "Sesi terbuka bagi orang tua dan ananda untuk mencoba langsung metode jari tangan dan konsultasi kurikulum.",
    orderIndex: 1,
    isActive: true,
  },
  {
    day: "01",
    month: "OKT",
    title: "Pembukaan Pendaftaran Gelombang Baru (Diskon 50%)",
    time: "08:00 – 17:00 WIB",
    location: "Pendaftaran Online & Kantor Cabang",
    desc: "Dapatkan potongan uang pendaftaran 50% dan bonus modul belajar lengkap serta kartu digital siswa.",
    orderIndex: 2,
    isActive: true,
  },
  {
    day: "18",
    month: "OKT",
    title: "Lomba Hitung Cepat 10 Jari Antar Siswa Math Fingers",
    time: "09:00 – 12:00 WIB",
    location: "Gedung Serbaguna Cabang Singkut",
    desc: "Ajang uji kecepatan, ketelitian, dan sportivitas berhitung jaritmatika dengan piala serta beasiswa belajar.",
    orderIndex: 3,
    isActive: true,
  },
];

// GET /api/website/events - Ambil semua agenda
export async function GET() {
  try {
    let events = await prisma.websiteEvent.findMany({
      orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
    });

    if (events.length === 0) {
      await prisma.websiteEvent.createMany({
        data: DEFAULT_EVENTS,
      });
      events = await prisma.websiteEvent.findMany({
        orderBy: [{ orderIndex: "asc" }, { createdAt: "asc" }],
      });
    }

    return NextResponse.json(events);
  } catch (error: any) {
    console.error("Error fetching website events:", error);
    return NextResponse.json(DEFAULT_EVENTS);
  }
}

// POST /api/website/events - Tambah agenda baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { day, month, title, time, location, desc, orderIndex, isActive } = body;

    if (!title || !day || !month) {
      return NextResponse.json(
        { error: "Judul, tanggal hari, dan bulan agenda wajib diisi" },
        { status: 400 }
      );
    }

    const created = await prisma.websiteEvent.create({
      data: {
        day: String(day).padStart(2, "0"),
        month: String(month).toUpperCase(),
        title,
        time: time || "09:00 – 11:00 WIB",
        location: location || "Cabang Singkut & Cabang Bangko",
        desc: desc || "",
        orderIndex: orderIndex ? Number(orderIndex) : 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Error creating website event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/website/events - Edit agenda
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, day, month, title, time, location, desc, orderIndex, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID agenda diperlukan" }, { status: 400 });
    }

    const updated = await prisma.websiteEvent.update({
      where: { id },
      data: {
        ...(day ? { day: String(day).padStart(2, "0") } : {}),
        ...(month ? { month: String(month).toUpperCase() } : {}),
        ...(title ? { title } : {}),
        ...(time ? { time } : {}),
        ...(location ? { location } : {}),
        ...(desc ? { desc } : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Error updating website event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/website/events - Hapus agenda
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID agenda diperlukan" }, { status: 400 });
    }

    await prisma.websiteEvent.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting website event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
